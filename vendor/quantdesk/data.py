"""Chargement de données de marché avec cache disque et repli synthétique.

Ordre de priorité : cache CSV -> yfinance -> génération synthétique calibrée (GARCH-t à facteur commun).
Le repli synthétique n'existe QUE pour tester les pipelines hors-ligne : il est signalé
explicitement dans `meta['source']` et ne doit jamais servir à tirer des conclusions de marché.
"""
from __future__ import annotations

import os
import warnings
from typing import Dict, Iterable, Optional, Tuple

import numpy as np
import pandas as pd

TRADING_DAYS = 252


# --------------------------------------------------------------------------------------
# Génération synthétique : facteur de marché GARCH(1,1)-t + résidus idiosyncratiques
# --------------------------------------------------------------------------------------
def _garch_t(n: int, omega: float, alpha: float, beta: float, df: float, rng) -> np.ndarray:
    """Innovations GARCH(1,1) à queues épaisses (Student-t normalisée à variance 1)."""
    z = rng.standard_t(df, size=n) / np.sqrt(df / (df - 2.0))
    h = np.empty(n)
    r = np.empty(n)
    h[0] = omega / (1.0 - alpha - beta)
    for t in range(n):
        if t > 0:
            h[t] = omega + alpha * r[t - 1] ** 2 + beta * h[t - 1]
        r[t] = np.sqrt(h[t]) * z[t]
    return r


def synthetic_returns(
    tickers: Iterable[str],
    n_days: int = 2520,
    seed: int = 7,
    ann_mu: float = 0.08,
    ann_vol: float = 0.19,
    end: Optional[str] = None,
) -> pd.DataFrame:
    """Rendements simples journaliers synthétiques, corrélés, avec clustering de volatilité."""
    tickers = list(tickers)
    rng = np.random.default_rng(seed)
    k = len(tickers)
    d_vol = ann_vol / np.sqrt(TRADING_DAYS)
    # facteur commun : persistance 0.985, alpha 0.08 => clusters de vol réalistes
    a, b = 0.07, 0.91
    omega = d_vol ** 2 * (1 - a - b)
    f = _garch_t(n_days, omega, a, b, 8.0, rng)
    out = np.empty((n_days, k))
    for j in range(k):
        beta_j = rng.uniform(0.5, 1.2)
        idio_vol = d_vol * rng.uniform(0.5, 1.0)
        eps = _garch_t(n_days, idio_vol ** 2 * (1 - 0.06 - 0.92), 0.06, 0.92, 8.0, rng)
        mu_j = ann_mu / TRADING_DAYS * rng.uniform(0.5, 1.5)
        x = beta_j * f + eps
        # variance targeting : la vol réalisée de l'échantillon est fixée (les GARCH quasi-intégrés ont une vol d'échantillon très dispersée)
        x = (x - x.mean()) / x.std() * d_vol * rng.uniform(0.8, 1.25)
        out[:, j] = mu_j + x
    end_ts = pd.Timestamp(end) if end else pd.Timestamp.today().normalize()
    idx = pd.bdate_range(end=end_ts, periods=n_days + 5)[-n_days:]
    return pd.DataFrame(out, index=idx, columns=tickers)


def synthetic_prices(tickers: Iterable[str], n_days: int = 2520, seed: int = 7, **kw) -> pd.DataFrame:
    r = synthetic_returns(tickers, n_days, seed, **kw)
    return 100.0 * (1.0 + r).cumprod()


# --------------------------------------------------------------------------------------
# Chargement avec repli
# --------------------------------------------------------------------------------------
def load_prices(
    tickers: Iterable[str],
    start: str = "2010-01-01",
    end: Optional[str] = None,
    cache_dir: str = "data_cache",
    allow_synthetic: bool = True,
    seed: int = 7,
) -> Tuple[pd.DataFrame, Dict]:
    """Retourne (prix ajustés, meta). `meta['source']` ∈ {'cache','yfinance','synthetic'}."""
    tickers = list(tickers)
    os.makedirs(cache_dir, exist_ok=True)
    key = "_".join(t.replace("^", "").replace("=", "").replace("/", "") for t in tickers)[:80]
    path = os.path.join(cache_dir, f"px_{key}_{start}_{end or 'today'}.csv")
    if os.path.exists(path):
        px = pd.read_csv(path, index_col=0, parse_dates=True)
        if px.shape[0] > 50:
            return px, {"source": "cache"}
    try:
        import contextlib, io, logging
        import yfinance as yf

        logging.getLogger("yfinance").setLevel(logging.CRITICAL)
        with contextlib.redirect_stdout(io.StringIO()), contextlib.redirect_stderr(io.StringIO()):
            raw = yf.download(tickers, start=start, end=end, auto_adjust=True, progress=False)
        px = raw["Close"] if isinstance(raw.columns, pd.MultiIndex) else raw[["Close"]].rename(columns={"Close": tickers[0]})
        px = px.dropna(how="all").ffill().dropna()
        if px.shape[0] > 50 and px.shape[1] == len(tickers):
            px.to_csv(path)
            return px, {"source": "yfinance"}
    except Exception as exc:  # réseau indisponible, ticker invalide, etc.
        warnings.warn(f"yfinance indisponible ({exc!s:.60}).")
    if not allow_synthetic:
        raise RuntimeError("Aucune source de données disponible et allow_synthetic=False.")
    n = len(pd.bdate_range(start=start, end=end or pd.Timestamp.today()))
    px = synthetic_prices(tickers, n_days=n, seed=seed, end=end)
    warnings.warn("DONNÉES SYNTHÉTIQUES : uniquement pour valider le code, aucune valeur de marché.")
    return px, {"source": "synthetic"}


def to_returns(px: pd.DataFrame | pd.Series, log: bool = False) -> pd.DataFrame | pd.Series:
    r = np.log(px).diff() if log else px.pct_change()
    return r.dropna(how="all")
