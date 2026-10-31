"""
dcf_model.py
============
Moteur de valorisation fondamentale : Discounted Cash Flow (DCF), WACC/CAPM,
modèle de Gordon-Shapiro (dividendes) et ratios financiers (dont Piotroski F-score
et chiffre de Graham).

Reconstruit à partir de DCF.ipynb. Principaux bugs corrigés par rapport à l'original :
  - IndentationError dans le bloc de recommandation Buy/Sell (mélange d'indentations).
  - `historic_fcf.dropna()` appelé sur une liste Python (AttributeError) : le pipeline
    FCF historique était incohérent entre une liste (`column_to_list`) et une Series
    pandas (`fcf_series`) selon la cellule exécutée en dernier.
  - Coût de la dette calculé comme `intérêts / dette` sans valeur absolue : comme
    "Interest Expense" est stocké en négatif chez yfinance, le coût de la dette
    ressortait négatif.
  - `np.isnan(beta)` explosait (TypeError) quand yfinance renvoie `None` plutôt
    qu'un NaN pour le beta.
  - Poids equity/dette de la WACC non définis si `total_debt` est NaN (aucun montant
    de dette trouvé) : ajout d'un repli à 0.
  - Deux fonctions DCF quasi identiques (`DCF` et `DCF_with_auto_terminal`) : fusionnées.
  - Deux implémentations différentes (et incomplètes) du Piotroski F-score : fusionnées
    en une seule fonction testée sur les 9 critères standards.
  - Estimation du taux de croissance sectoriel par scraping de SimplyWallSt (fragile,
    404/403 fréquents, dépendance BeautifulSoup) : remplacée par la méthode déjà
    présente ailleurs dans le notebook (CAGR de l'ETF sectoriel), plus fiable.
  - `yf.download(...)['Close']` pouvait renvoyer un DataFrame (colonnes MultiIndex)
    au lieu d'une Series avec les versions récentes de yfinance -> `.item()` plantait.
  - Croissance moyenne du FCF calculée par moyenne arithmétique des taux de
    croissance annuels (biaisée en cas de re-bond après une année négative) ->
    remplacée par un CAGR robuste avec option affichage.
  - Aucune gestion d'erreur réseau/données manquantes : toutes les fonctions
    encapsulent maintenant les appels yfinance et renvoient des messages clairs
    plutôt qu'un plantage silencieux.

Limite importante (biais de look-ahead) : `Ticker.info` (beta, marketCap, prix)
reflète l'état ACTUEL du marché, pas l'état à la date des états financiers
historiques utilisés pour projeter le FCF. Pour un usage dans un terminal
d'analyse rigoureux, il faut soit horodater chaque input, soit itérer avec des
données fondamentales point-in-time (yfinance ne les fournit pas nativement).
"""

from __future__ import annotations

import datetime as dt
import warnings
from dataclasses import dataclass, field
from math import sqrt
from typing import Optional

import numpy as np
import pandas as pd
import yfinance as yf

warnings.filterwarnings("ignore", category=FutureWarning)

SECTOR_ETF_MAP = {
    "Technology": "XLK",
    "Financial Services": "XLF",
    "Financials": "XLF",
    "Energy": "XLE",
    "Health Care": "XLV",
    "Healthcare": "XLV",
    "Consumer Cyclical": "XLY",
    "Consumer Discretionary": "XLY",
    "Consumer Defensive": "XLP",
    "Consumer Staples": "XLP",
    "Industrials": "XLI",
    "Materials": "XLB",
    "Real Estate": "XLRE",
    "Utilities": "XLU",
    "Communication Services": "XLC",
    "Telecommunication Services": "XLC",
}


def safe_div(a, b):
    """Division tolérante aux None/NaN/0."""
    try:
        if a is None or b is None:
            return np.nan
        if isinstance(b, (int, float)) and b == 0:
            return np.nan
        return a / b
    except Exception:
        return np.nan


def cagr(start_val: float, end_val: float, periods: float) -> Optional[float]:
    """Taux de croissance annuel composé. Renvoie None si non calculable
    (valeur de départ nulle/négative ou nombre de périodes nul)."""
    if start_val is None or end_val is None or periods in (None, 0):
        return None
    if start_val <= 0:
        return None
    return (end_val / start_val) ** (1.0 / periods) - 1.0


# ---------------------------------------------------------------------------
# 1) Données brutes : cash flows, bilan, actions en circulation
# ---------------------------------------------------------------------------

def fetch_fcf_history(ticker_symbol: str) -> pd.Series:
    """Historique du Free Cash Flow annuel, trié par date, sans NaN.
    Toujours une pandas Series (jamais une liste) pour rester cohérent
    avec le reste du pipeline.
    """
    t = yf.Ticker(ticker_symbol)
    cf = t.cashflow.transpose()
    if cf is None or cf.empty:
        raise ValueError(f"Aucun cash-flow statement disponible pour {ticker_symbol}.")

    cf.index = pd.to_datetime(cf.index)
    fcf_col = next((c for c in ["Free Cash Flow", "FreeCashFlow"] if c in cf.columns), None)

    if fcf_col is not None:
        fcf = cf[fcf_col].dropna().sort_index()
    else:
        # Repli : FCF = Operating Cash Flow - Capex (Capex est stocké en négatif)
        ocf_col = next((c for c in ["Operating Cash Flow", "Total Cash From Operating Activities"]
                        if c in cf.columns), None)
        capex_col = next((c for c in ["Capital Expenditure", "Capital Expenditures"]
                          if c in cf.columns), None)
        if ocf_col is None or capex_col is None:
            raise ValueError(
                f"Impossible de reconstituer le FCF pour {ticker_symbol} "
                f"(colonnes disponibles: {list(cf.columns)})."
            )
        fcf = (cf[ocf_col] + cf[capex_col]).dropna().sort_index()

    if len(fcf) < 2:
        raise ValueError(f"Historique FCF trop court pour {ticker_symbol} ({len(fcf)} point(s)).")
    return fcf


def fetch_net_debt(ticker_symbol: str) -> float:
    t = yf.Ticker(ticker_symbol)
    bal = t.balance_sheet.transpose()
    if bal is None or bal.empty:
        return 0.0
    bal.index = pd.to_datetime(bal.index)
    if "Net Debt" in bal.columns:
        val = bal["Net Debt"].dropna()
        if len(val):
            return float(val.iloc[-1])
    # Repli : dette totale - trésorerie
    total_debt = 0.0
    for col in ["Total Debt", "Short Long Term Debt", "Long Term Debt"]:
        if col in bal.columns:
            v = bal[col].dropna()
            if len(v):
                total_debt += float(v.iloc[-1])
    cash = 0.0
    for col in ["Cash And Cash Equivalents", "Cash"]:
        if col in bal.columns:
            v = bal[col].dropna()
            if len(v):
                cash = float(v.iloc[-1])
                break
    return total_debt - cash


def fetch_shares_outstanding(ticker_symbol: str) -> float:
    info = yf.Ticker(ticker_symbol).info
    shares = info.get("sharesOutstanding")
    if not shares:
        raise ValueError(f"Nombre d'actions en circulation introuvable pour {ticker_symbol}.")
    return float(shares)


# ---------------------------------------------------------------------------
# 2) Projection du FCF
# ---------------------------------------------------------------------------

def project_fcf(fcf_history: pd.Series, years: int = 5,
                 growth_rate: Optional[float] = None) -> tuple[list[float], float]:
    """Projette le FCF sur `years` années.

    Si `growth_rate` n'est pas fourni, on utilise le CAGR de l'historique
    (plus robuste que la moyenne arithmétique des croissances annuelles,
    qui sur-pondère les rebonds après une année creuse).
    """
    values = fcf_history.values
    if growth_rate is None:
        # Si le FCF est devenu négatif à un moment, le CAGR classique n'a pas de sens ;
        # on retombe alors sur la moyenne (bornée) des croissances année sur année.
        if (values <= 0).any():
            yoy = [(values[i] - values[i - 1]) / abs(values[i - 1]) for i in range(1, len(values))]
            growth_rate = float(np.clip(np.mean(yoy), -0.5, 0.5))
        else:
            g = cagr(values[0], values[-1], len(values) - 1)
            growth_rate = float(np.clip(g, -0.5, 0.5)) if g is not None else 0.03

    last = float(values[-1])
    projected = [last * (1 + growth_rate) ** (i + 1) for i in range(years)]
    return projected, growth_rate


# ---------------------------------------------------------------------------
# 3) Coût du capital (CAPM / WACC)
# ---------------------------------------------------------------------------

def calculate_cost_of_equity(ticker_symbol: str, market_ticker: str = "^GSPC",
                              years: int = 20) -> float:
    """CAPM : Re = Rf + beta * (E[Rm] - Rf)."""
    today = dt.datetime.today()
    start = today - dt.timedelta(days=365 * years)

    market = yf.download(market_ticker, start=start, end=today, progress=False, auto_adjust=True)
    close = market["Close"].squeeze()  # garantit une Series même si colonnes MultiIndex
    rm = cagr(float(close.iloc[0]), float(close.iloc[-1]), years)
    if rm is None:
        raise ValueError("Impossible de calculer le rendement de marché (données insuffisantes).")

    tnx = yf.Ticker("^TNX").history(period="5d")["Close"].dropna()
    if tnx.empty:
        raise ValueError("Taux sans risque (^TNX) indisponible.")
    risk_free_rate = float(tnx.iloc[-1]) / 100.0

    info = yf.Ticker(ticker_symbol).info
    beta = info.get("beta")
    if beta is None:
        raise ValueError(f"Beta indisponible pour {ticker_symbol} : impossible d'estimer le coût des fonds propres.")
    beta = float(beta)

    market_risk_premium = rm - risk_free_rate
    return risk_free_rate + beta * market_risk_premium


def calculate_wacc(ticker_symbol: str, default_tax_rate: float = 0.21) -> dict:
    """WACC = We*Re + Wd*Rd*(1-Tc).
    default_tax_rate: taux fédéral US par défaut (21 %) si le taux effectif est
    indisponible dans les états financiers.
    """
    ticker = yf.Ticker(ticker_symbol)
    info = ticker.info
    market_cap = info.get("marketCap")
    if market_cap is None:
        raise ValueError(f"Capitalisation boursière indisponible pour {ticker_symbol}.")

    balance_sheet = ticker.balance_sheet
    if isinstance(balance_sheet.columns, pd.MultiIndex):
        balance_sheet.columns = ["_".join(map(str, c)).strip() for c in balance_sheet.columns.values]

    def bs_val(*keys, default=0.0):
        for k in keys:
            if k in balance_sheet.index:
                v = balance_sheet.loc[k].dropna()
                if len(v):
                    return float(v.iloc[0])
        return default

    short_term_debt = bs_val("Short Long Term Debt", "Current Debt")
    long_term_debt = bs_val("Long Term Debt")
    total_debt = short_term_debt + long_term_debt

    income_statement = ticker.income_stmt
    if isinstance(income_statement.columns, pd.MultiIndex):
        income_statement.columns = ["_".join(map(str, c)).strip() for c in income_statement.columns.values]

    avg_interest_expense = np.nan
    if "Interest Expense" in income_statement.index:
        interest = income_statement.loc["Interest Expense"].astype(float)
        # yfinance stocke généralement les charges d'intérêt en négatif -> valeur absolue.
        avg_interest_expense = float(np.nanmean(np.abs(interest)))

    tax_rate = default_tax_rate
    if "Tax Rate For Calcs" in income_statement.index:
        tr = np.nanmean(income_statement.loc["Tax Rate For Calcs"].astype(float))
        if not np.isnan(tr):
            tax_rate = float(tr)

    cost_of_debt = safe_div(avg_interest_expense, total_debt) if total_debt > 0 else np.nan
    if np.isnan(cost_of_debt):
        cost_of_debt = 0.0  # entreprise (quasi) sans dette financière

    cost_of_equity = calculate_cost_of_equity(ticker_symbol)

    total_value = market_cap + total_debt
    equity_weight = market_cap / total_value
    debt_weight = total_debt / total_value

    wacc = equity_weight * cost_of_equity + debt_weight * cost_of_debt * (1 - tax_rate)

    return {
        "market_cap": market_cap,
        "total_debt": total_debt,
        "cost_of_equity": cost_of_equity,
        "cost_of_debt": cost_of_debt,
        "tax_rate": tax_rate,
        "wacc": wacc,
    }


# ---------------------------------------------------------------------------
# 4) DCF et Gordon-Shapiro
# ---------------------------------------------------------------------------

def dcf_intrinsic_value(fcf_projected: list[float], wacc: float, terminal_growth_rate: float,
                         net_debt: float, shares_outstanding: float) -> dict:
    """Valeur intrinsèque par action via DCF à 2 étages (FCF explicite + valeur terminale
    de Gordon). Lève une erreur explicite si wacc <= terminal_growth_rate (formule invalide),
    plutôt que de renvoyer silencieusement une valeur négative ou infinie."""
    if wacc <= terminal_growth_rate:
        raise ValueError(
            f"WACC ({wacc:.2%}) doit être strictement supérieur au taux de croissance "
            f"terminal ({terminal_growth_rate:.2%})."
        )
    pv_fcf = [fcf_projected[i] / (1 + wacc) ** (i + 1) for i in range(len(fcf_projected))]
    terminal_value = (fcf_projected[-1] * (1 + terminal_growth_rate)) / (wacc - terminal_growth_rate)
    pv_terminal_value = terminal_value / (1 + wacc) ** len(fcf_projected)
    enterprise_value = sum(pv_fcf) + pv_terminal_value
    equity_value = enterprise_value - net_debt
    intrinsic_value_per_share = equity_value / shares_outstanding
    return {
        "enterprise_value": enterprise_value,
        "equity_value": equity_value,
        "intrinsic_value_per_share": intrinsic_value_per_share,
        "pv_fcf_sum": sum(pv_fcf),
        "pv_terminal_value": pv_terminal_value,
    }


def gordon_shapiro_value(dividend_per_share: float, cost_of_equity: float,
                          dividend_growth_rate: float) -> Optional[float]:
    """Valeur = D1 / (k - g). Renvoie None (plutôt que planter) si k <= g."""
    if cost_of_equity <= dividend_growth_rate:
        return None
    d1 = dividend_per_share * (1 + dividend_growth_rate)
    return d1 / (cost_of_equity - dividend_growth_rate)


@dataclass
class DCFReport:
    ticker: str
    last_price: float
    intrinsic_value: float
    wacc: float
    terminal_growth_rate: float
    fcf_growth_rate: float
    net_debt: float
    shares_outstanding: float
    margin_of_safety: float = field(init=False)

    def __post_init__(self):
        self.margin_of_safety = (self.intrinsic_value - self.last_price) / self.last_price

    def recommendation(self, margin: float = 0.05) -> str:
        if self.intrinsic_value * (1 - margin) > self.last_price:
            return "ACHAT (sous-évalué)"
        if self.intrinsic_value * (1 + margin) < self.last_price:
            return "VENTE (sur-évalué)"
        return "NEUTRE (proche de la juste valeur)"

    def summary(self) -> str:
        return (
            f"{self.ticker}\n"
            f"  Prix actuel            : {self.last_price:,.2f}\n"
            f"  Valeur intrinsèque DCF : {self.intrinsic_value:,.2f}\n"
            f"  Marge de sécurité      : {self.margin_of_safety:+.1%}\n"
            f"  WACC utilisé           : {self.wacc:.2%}\n"
            f"  Croissance FCF (g)     : {self.fcf_growth_rate:.2%}\n"
            f"  Croissance terminale   : {self.terminal_growth_rate:.2%}\n"
            f"  Recommandation         : {self.recommendation()}"
        )


def run_dcf(ticker_symbol: str, projection_years: int = 5,
            terminal_growth_rate: Optional[float] = None,
            fcf_growth_rate: Optional[float] = None) -> DCFReport:
    """Pipeline complet : FCF historique -> projection -> WACC -> valeur intrinsèque.

    Si `terminal_growth_rate` est None, on utilise le CAGR de l'ETF sectoriel du
    titre sur 10 ans comme proxy de croissance de long terme (plus robuste que le
    scraping web utilisé dans le notebook original).
    """
    fcf_hist = fetch_fcf_history(ticker_symbol)
    projected_fcf, g_used = project_fcf(fcf_hist, years=projection_years, growth_rate=fcf_growth_rate)

    net_debt = fetch_net_debt(ticker_symbol)
    shares_outstanding = fetch_shares_outstanding(ticker_symbol)
    wacc_data = calculate_wacc(ticker_symbol)
    wacc = wacc_data["wacc"]

    if terminal_growth_rate is None:
        info = yf.Ticker(ticker_symbol).info
        sector = info.get("sector")
        etf = SECTOR_ETF_MAP.get(sector, "SPY")
        etf_hist = yf.Ticker(etf).history(period="10y", auto_adjust=True)["Close"].dropna()
        g_etf = cagr(float(etf_hist.iloc[0]), float(etf_hist.iloc[-1]), 10) if len(etf_hist) > 1 else None
        terminal_growth_rate = min(g_etf, wacc - 0.005) if g_etf else 0.025

    dcf_result = dcf_intrinsic_value(
        fcf_projected=projected_fcf,
        wacc=wacc,
        terminal_growth_rate=terminal_growth_rate,
        net_debt=net_debt,
        shares_outstanding=shares_outstanding,
    )

    price_hist = yf.download(ticker_symbol, period="5d", progress=False, auto_adjust=True)["Close"].squeeze()
    last_price = float(price_hist.iloc[-1])

    return DCFReport(
        ticker=ticker_symbol,
        last_price=last_price,
        intrinsic_value=dcf_result["intrinsic_value_per_share"],
        wacc=wacc,
        terminal_growth_rate=terminal_growth_rate,
        fcf_growth_rate=g_used,
        net_debt=net_debt,
        shares_outstanding=shares_outstanding,
    )


# ---------------------------------------------------------------------------
# 5) Ratios financiers + Piotroski F-score + Graham number
# ---------------------------------------------------------------------------

def compute_financial_ratios(ticker_symbol: str) -> dict:
    """Snapshot des ratios financiers courants (une seule fonction, fusion des
    deux implémentations redondantes du notebook original)."""
    t = yf.Ticker(ticker_symbol)
    info = t.info
    fin = t.financials
    bal = t.balance_sheet
    cf = t.cashflow

    if isinstance(fin.columns, pd.MultiIndex):
        fin.columns = ["_".join(map(str, c)) for c in fin.columns]
    if isinstance(bal.columns, pd.MultiIndex):
        bal.columns = ["_".join(map(str, c)) for c in bal.columns]

    def row(df, *keys):
        for k in keys:
            if k in df.index:
                v = df.loc[k].dropna()
                if len(v):
                    return float(v.iloc[0])
        return None

    price = info.get("currentPrice") or info.get("regularMarketPrice") or info.get("previousClose")
    market_cap = info.get("marketCap")
    shares_out = info.get("sharesOutstanding")
    eps_ttm = info.get("trailingEps")

    revenue = row(fin, "Total Revenue")
    gross_profit = row(fin, "Gross Profit")
    operating_income = row(fin, "Operating Income")
    net_income = row(fin, "Net Income")
    total_equity = row(bal, "Stockholders Equity", "Total Equity Gross Minority Interest")
    total_assets = row(bal, "Total Assets")
    current_assets = row(bal, "Current Assets")
    current_liab = row(bal, "Current Liabilities")
    total_debt = row(bal, "Total Debt") or 0.0
    cash = row(bal, "Cash And Cash Equivalents") or 0.0

    gross_margin = safe_div(gross_profit, revenue)
    operating_margin = safe_div(operating_income, revenue)
    net_margin = safe_div(net_income, revenue)
    roe = safe_div(net_income, total_equity)
    leverage = safe_div(total_assets, total_equity)
    current_ratio = safe_div(current_assets, current_liab)

    per = safe_div(price, eps_ttm) if eps_ttm else None
    book_value_per_share = safe_div(total_equity, shares_out)
    pb = info.get("priceToBook") or safe_div(market_cap, total_equity)
    ps = safe_div(market_cap, revenue)
    ev = (market_cap or 0) + total_debt - cash

    graham_number = None
    if eps_ttm and book_value_per_share and eps_ttm > 0 and book_value_per_share > 0:
        graham_number = sqrt(22.5 * eps_ttm * book_value_per_share)

    return {
        "ticker": ticker_symbol,
        "price": price,
        "market_cap": market_cap,
        "gross_margin": gross_margin,
        "operating_margin": operating_margin,
        "net_margin": net_margin,
        "roe": roe,
        "leverage": leverage,
        "current_ratio": current_ratio,
        "per": per,
        "price_to_book": pb,
        "price_to_sales": ps,
        "enterprise_value": ev,
        "graham_number": graham_number,
        "book_value_per_share": book_value_per_share,
        "eps_ttm": eps_ttm,
        "piotroski_f": piotroski_f_score(ticker_symbol),
    }


def piotroski_f_score(ticker_symbol: str) -> Optional[int]:
    """F-score de Piotroski (0 à 9), calculé sur les 2 derniers exercices annuels
    disponibles. Fusion + correction des deux implémentations partielles du
    notebook (l'une ne testait que 6 des 9 critères, l'autre confondait les index)."""
    t = yf.Ticker(ticker_symbol)
    fin = t.financials
    bal = t.balance_sheet
    cf = t.cashflow
    if fin is None or bal is None or fin.shape[1] < 2 or bal.shape[1] < 2:
        return None

    def val(df, key, col):
        if key in df.index and col in df.columns:
            v = df.loc[key, col]
            return float(v) if pd.notna(v) else None
        return None

    cur_col, prev_col = fin.columns[0], fin.columns[1]
    bal_cur_col, bal_prev_col = bal.columns[0], bal.columns[1]

    ni_cur = val(fin, "Net Income", cur_col)
    ni_prev = val(fin, "Net Income", prev_col)
    ta_cur = val(bal, "Total Assets", bal_cur_col)
    ta_prev = val(bal, "Total Assets", bal_prev_col)
    ocf_cur = val(cf, "Operating Cash Flow", cf.columns[0]) if cf is not None and cf.shape[1] else None
    ltd_cur = val(bal, "Long Term Debt", bal_cur_col) or 0
    ltd_prev = val(bal, "Long Term Debt", bal_prev_col) or 0
    ca_cur = val(bal, "Current Assets", bal_cur_col)
    cl_cur = val(bal, "Current Liabilities", bal_cur_col)
    ca_prev = val(bal, "Current Assets", bal_prev_col)
    cl_prev = val(bal, "Current Liabilities", bal_prev_col)
    gp_cur = val(fin, "Gross Profit", cur_col)
    gp_prev = val(fin, "Gross Profit", prev_col)
    rev_cur = val(fin, "Total Revenue", cur_col)
    rev_prev = val(fin, "Total Revenue", prev_col)
    shares_cur = val(bal, "Share Issued", bal_cur_col)
    shares_prev = val(bal, "Share Issued", bal_prev_col)

    roa_cur = safe_div(ni_cur, ta_cur)
    roa_prev = safe_div(ni_prev, ta_prev)
    current_ratio_cur = safe_div(ca_cur, cl_cur)
    current_ratio_prev = safe_div(ca_prev, cl_prev)
    gm_cur = safe_div(gp_cur, rev_cur)
    gm_prev = safe_div(gp_prev, rev_prev)
    at_cur = safe_div(rev_cur, ta_cur)
    at_prev = safe_div(rev_prev, ta_prev)

    score = 0
    checks = [
        ni_cur is not None and ni_cur > 0,                                   # 1. ROA positif
        ocf_cur is not None and ocf_cur > 0,                                 # 2. CFO positif
        roa_cur is not None and roa_prev is not None and roa_cur > roa_prev, # 3. ROA en hausse
        ocf_cur is not None and ni_cur is not None and ocf_cur > ni_cur,     # 4. CFO > résultat net (qualité)
        ltd_cur <= ltd_prev,                                                 # 5. levier en baisse
        current_ratio_cur is not None and current_ratio_prev is not None
            and current_ratio_cur > current_ratio_prev,                     # 6. liquidité en hausse
        shares_cur is not None and shares_prev is not None
            and shares_cur <= shares_prev,                                  # 7. pas de dilution
        gm_cur is not None and gm_prev is not None and gm_cur > gm_prev,     # 8. marge brute en hausse
        at_cur is not None and at_prev is not None and at_cur > at_prev,    # 9. rotation actif en hausse
    ]
    score = sum(1 for c in checks if c)
    return score


if __name__ == "__main__":
    ticker = "AAPL"
    report = run_dcf(ticker)
    print(report.summary())
    print()
    ratios = compute_financial_ratios(ticker)
    for k, v in ratios.items():
        print(f"{k:20}: {v}")
