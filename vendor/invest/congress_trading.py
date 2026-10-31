"""
congress_trading.py
====================
Suivi des transactions boursières déclarées par les sénateurs et représentants
américains (STOCK Act de 2012 : toute transaction > 1 000 $ doit être déclarée
sous 30-45 jours).

Choix de la source de données
------------------------------
Les deux dumps JSON gratuits historiquement utilisés par la communauté sont morts :
  - senate-stock-watcher-data (GitHub) : plus synchronisé depuis 2021.
  - house-stock-watcher-data (S3)      : bucket renvoie 403 depuis mi-2026.

Solutions restantes :
  1. Disclosed Capitol (https://www.disclosedcapitol.com) : API REST avec un
     vrai palier gratuit (750 crédits offerts à l'inscription, sans carte
     bancaire), endpoint `/trades` filtrable par ticker/chambre/membre/date.
     C'est la source utilisée par défaut ci-dessous (clé via `DC_API_KEY`).
  2. QuiverQuant : source historique de référence, mais sans palier gratuit
     depuis 2026 (à partir de ~30 $/mois).
  3. Source brute gratuite et sans clé, mais plus lourde à exploiter : l'index
     annuel des dépôts de la Chambre
     (https://disclosures-clerk.house.gov/public_disc/financial-pdfs/{year}FD.ZIP)
     donne qui a déposé quoi et quand, mais le détail des transactions est dans
     des PDF individuels (Periodic Transaction Reports) qu'il faut parser un par
     un. Fonction `fetch_house_disclosure_index` fournie pour ce premier niveau ;
     le parsing PDF n'est PAS implémenté ici (hors budget de cette itération) —
     à ajouter avec `pdfplumber` si vous voulez vous passer d'un fournisseur tiers.

Vérifiez les CGU de la source choisie avant toute redistribution des données.
"""

from __future__ import annotations

import json
import os
from dataclasses import dataclass
from pathlib import Path
from typing import Optional

import pandas as pd
import requests

DC_BASE_URL = "https://api.disclosedcapitol.com"
HOUSE_CLERK_INDEX_URL = "https://disclosures-clerk.house.gov/public_disc/financial-pdfs/{year}FD.ZIP"


@dataclass
class CongressTrade:
    politician_name: str
    chamber: str          # "House" ou "Senate"
    ticker: Optional[str]
    trade_type: str        # "Buy" / "Sell" / "Exchange"
    amount_low: Optional[float]
    amount_high: Optional[float]
    transaction_date: Optional[str]
    disclosure_date: Optional[str]
    party: Optional[str] = None
    state: Optional[str] = None


# ---------------------------------------------------------------------------
# 1) Disclosed Capitol (source principale, palier gratuit)
# ---------------------------------------------------------------------------

class DisclosedCapitolClient:
    """Client minimal pour l'API Disclosed Capitol.

    Inscription gratuite (750 crédits offerts) : https://www.disclosedcapitol.com/developers
    Clé transmise via le header `DC-API-Key`.
    """

    def __init__(self, api_key: Optional[str] = None):
        self.api_key = api_key or os.environ.get("DC_API_KEY")
        if not self.api_key:
            raise ValueError(
                "Aucune clé API Disclosed Capitol trouvée. Créez un compte gratuit sur "
                "https://www.disclosedcapitol.com/developers puis passez la clé via "
                "`DisclosedCapitolClient(api_key=...)` ou la variable d'environnement DC_API_KEY."
            )

    def _get(self, path: str, params: Optional[dict] = None) -> dict:
        resp = requests.get(
            f"{DC_BASE_URL}{path}",
            headers={"DC-API-Key": self.api_key},
            params=params or {},
            timeout=20,
        )
        resp.raise_for_status()
        return resp.json()

    def recent_trades(self, ticker: Optional[str] = None, chamber: Optional[str] = None,
                       politician: Optional[str] = None, since: Optional[str] = None,
                       limit: int = 100) -> list[CongressTrade]:
        """Transactions récentes, filtrables par ticker / chambre ("House"/"Senate")
        / nom de membre / date de transaction (`since`, format YYYY-MM-DD)."""
        params = {"limit": limit}
        if ticker:
            params["ticker"] = ticker.upper()
        if chamber:
            params["chamber"] = chamber
        if politician:
            params["politician"] = politician
        if since:
            params["from_date"] = since

        data = self._get("/trades", params=params)
        rows = data if isinstance(data, list) else data.get("data", [])
        trades = []
        for r in rows:
            trades.append(CongressTrade(
                politician_name=r.get("politician_name"),
                chamber=r.get("chamber"),
                ticker=r.get("ticker"),
                trade_type=r.get("trade_type"),
                amount_low=r.get("amount_low"),
                amount_high=r.get("amount_high"),
                transaction_date=r.get("transaction_date"),
                disclosure_date=r.get("disclosure_date"),
                party=r.get("party"),
                state=r.get("state"),
            ))
        return trades


def trades_to_dataframe(trades: list[CongressTrade]) -> pd.DataFrame:
    df = pd.DataFrame([t.__dict__ for t in trades])
    if not df.empty:
        df["transaction_date"] = pd.to_datetime(df["transaction_date"], errors="coerce")
        df["disclosure_date"] = pd.to_datetime(df["disclosure_date"], errors="coerce")
        df["amount_mid"] = (df["amount_low"].fillna(0) + df["amount_high"].fillna(df["amount_low"])) / 2
        df["disclosure_lag_days"] = (df["disclosure_date"] - df["transaction_date"]).dt.days
    return df


# ---------------------------------------------------------------------------
# 2) Agrégation / signal par ticker
# ---------------------------------------------------------------------------

def ticker_sentiment(trades_df: pd.DataFrame) -> pd.DataFrame:
    """Pour chaque ticker : nombre d'achats/ventes et solde net (en $ médian
    de la fourchette déclarée) sur la période couverte par `trades_df`.
    Un simple indicateur de "consensus" du Congrès, pas un signal de trading."""
    if trades_df.empty:
        return trades_df

    def sign(row):
        return 1 if str(row["trade_type"]).lower().startswith(("buy", "purchase")) else (
            -1 if str(row["trade_type"]).lower().startswith("sale") else 0)

    df = trades_df.copy()
    df["signed_amount"] = df.apply(sign, axis=1) * df["amount_mid"]

    agg = df.groupby("ticker").agg(
        n_trades=("ticker", "count"),
        n_buys=("trade_type", lambda s: s.str.lower().str.startswith(("buy", "purchase")).sum()),
        n_sells=("trade_type", lambda s: s.str.lower().str.startswith("sale").sum()),
        net_signed_amount=("signed_amount", "sum"),
        n_distinct_members=("politician_name", "nunique"),
        last_transaction=("transaction_date", "max"),
    ).sort_values("net_signed_amount", ascending=False)
    return agg


# ---------------------------------------------------------------------------
# 3) Monitoring : ne signaler que les NOUVELLES transactions depuis le dernier passage
# ---------------------------------------------------------------------------

class TradeMonitor:
    """Conserve un état local (fichier JSON) des transactions déjà vues, pour
    n'alerter que sur les nouveautés lors des exécutions suivantes -- utile pour
    un job planifié (cron / tâche du terminal) plutôt qu'un simple script à la demande.
    """

    def __init__(self, state_path: str = "congress_trades_seen.json"):
        self.state_path = Path(state_path)
        self._seen: set[str] = set()
        if self.state_path.exists():
            self._seen = set(json.loads(self.state_path.read_text()))

    @staticmethod
    def _trade_id(row: pd.Series) -> str:
        return "|".join(str(row.get(k)) for k in
                         ["politician_name", "ticker", "transaction_date", "trade_type", "amount_low"])

    def find_new_trades(self, trades_df: pd.DataFrame) -> pd.DataFrame:
        if trades_df.empty:
            return trades_df
        ids = trades_df.apply(self._trade_id, axis=1)
        is_new = ~ids.isin(self._seen)
        new_trades = trades_df[is_new].copy()
        self._seen.update(ids[is_new].tolist())
        self.state_path.write_text(json.dumps(sorted(self._seen)))
        return new_trades

    def watch(self, client: "DisclosedCapitolClient", tickers: list[str]) -> pd.DataFrame:
        """Interroge chaque ticker suivi et renvoie uniquement les transactions
        jamais vues lors d'un appel précédent."""
        all_trades = []
        for tk in tickers:
            all_trades.extend(client.recent_trades(ticker=tk, limit=50))
        df = trades_to_dataframe(all_trades)
        return self.find_new_trades(df)


# ---------------------------------------------------------------------------
# 4) Repli 100% gratuit et sans clé : index brut des dépôts de la Chambre
#    (donne le QUI/QUAND, pas le détail des transactions -- voir docstring du module)
# ---------------------------------------------------------------------------

def fetch_house_disclosure_index(year: int) -> pd.DataFrame:
    """Télécharge et parse l'index annuel des dépôts financiers de la Chambre
    (gratuit, sans clé). Contient le nom du déposant, le type de dépôt et un
    identifiant de document -- PAS le détail des transactions (il faudrait
    ensuite ouvrir le PDF individuel de chaque Periodic Transaction Report)."""
    import io
    import zipfile

    resp = requests.get(HOUSE_CLERK_INDEX_URL.format(year=year), timeout=30,
                         headers={"User-Agent": "Mozilla/5.0"})
    resp.raise_for_status()
    zf = zipfile.ZipFile(io.BytesIO(resp.content))
    txt_name = next(n for n in zf.namelist() if n.lower().endswith(".txt"))
    with zf.open(txt_name) as f:
        df = pd.read_csv(f, sep="\t", encoding="latin-1")
    return df


if __name__ == "__main__":
    # Exemple d'utilisation (nécessite une clé gratuite Disclosed Capitol) :
    client = DisclosedCapitolClient()  # ou DisclosedCapitolClient(api_key="...")
    watchlist = ["AAPL", "NVDA", "MSFT"]

    trades = []
    for tk in watchlist:
        trades.extend(client.recent_trades(ticker=tk, limit=20))
    df = trades_to_dataframe(trades)
    print(df.head())
    print()
    print(ticker_sentiment(df))
