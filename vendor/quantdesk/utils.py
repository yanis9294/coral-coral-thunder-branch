"""Couche de compatibilité : reprend les noms importés par le notebook original (`from utils import ...`)."""
import numpy as np
import pandas as pd

from .kelly import kelly_constrained, shrunk_covariance


def get_kelly(returns, correlation: bool = True, min_periods: int = 400) -> pd.DataFrame | pd.Series:
    """f* estimé sur moyenne/variance (co-variance) *expanding*, rf = 0.  Série pour un actif, DataFrame pour un panier."""
    if isinstance(returns, pd.Series):
        m = returns.expanding(min_periods).mean()
        v = returns.expanding(min_periods).var()
        return (m / v).dropna().rename("kelly")
    R = returns
    m = R.expanding(min_periods).mean()
    out = {}
    if not correlation:
        return (m / R.expanding(min_periods).var()).dropna(how="all")
    for i in range(min_periods, len(R), 5):  # covariance complète : recalcul tous les 5 jours
        C = shrunk_covariance(R.iloc[: i + 1], "lw")
        out[R.index[i]] = np.linalg.solve(C, m.iloc[i].values)
    return pd.DataFrame(out, index=R.columns).T.reindex(R.index[min_periods:]).ffill()


def filter_leverage(kelly, leverage: float):
    """Borne le levier. Série : clip [0, L]. DataFrame : réduction proportionnelle des lignes dont Σ|f| > L."""
    if isinstance(kelly, pd.Series):
        return kelly.clip(lower=0, upper=leverage)
    gross = kelly.abs().sum(axis=1)
    scale = np.minimum(1.0, leverage / gross.replace(0, np.nan)).fillna(1.0)
    return kelly.mul(scale, axis=0)


def get_cumulative_returns(returns):
    return (1 + returns).cumprod()


def backtest(kelly_df: pd.DataFrame, shift_returns: pd.DataFrame, leverages=range(1, 6)) -> pd.DataFrame:
    out = pd.DataFrame(index=shift_returns.index)
    for L in leverages:
        f = filter_leverage(kelly_df, L).reindex(shift_returns.index)
        out[f"max_leverage_{L}"] = (f * shift_returns).sum(axis=1)
    return out
