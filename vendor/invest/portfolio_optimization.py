"""
portfolio_optimization.py
==========================
Optimisation de portefeuille moyenne-variance (Markowitz), frontière efficiente
(Monte Carlo + scipy + cvxpy en option), Hierarchical Risk Parity (PyPortfolioOpt,
en option) et backtest simple (sans dépendance à pyfolio).

Reconstruit à partir de MVO_1_.ipynb (tutoriel de type "Python for Finance Cookbook").
Principaux bugs / points fragiles corrigés :
  - `get_efficient_frontier(avg_rtns, cov_mat, rtns_range)` ignorait ses propres
    paramètres `avg_rtns`/`cov_mat` et utilisait les variables GLOBALES
    `avg_returns`/`cov_mat` à la place (mismatch de nom `avg_rtns` vs `avg_returns`).
    Ça "marchait" par accident tant que les globales avaient la bonne valeur au bon
    moment, mais rendait la fonction inutilisable ailleurs ou avec un autre jeu
    d'actifs sans tout réexécuter dans le bon ordre.
  - Téléchargements de prix répétés à chaque section du notebook (5 à 6 appels
    réseau redondants) -> une seule fonction `download_prices`, réutilisée partout.
  - Dépendance à `pyfolio`, non maintenu depuis 2019 et cassé avec les versions
    récentes de pandas/numpy -> remplacé par des métriques de backtest calculées
    à la main (Sharpe, Sortino, max drawdown, Calmar, CAGR), sans dépendance
    supplémentaire. `quantstats` reste utilisé en option pour le tear-sheet HTML.
  - `!pip install git+https://github.com/robertmartin8/PyPortfolioOpt.git` :
    inutile, le paquet est publié sur PyPI sous le nom `PyPortfolioOpt`.
  - Toutes les périodes étaient codées en dur (ex : "2021-01-01"/"2021-12-31") ->
    paramétrées avec des dates par défaut glissantes (aujourd'hui - N ans).
  - cvxpy et PyPortfolioOpt sont des dépendances lourdes : les fonctions qui en
    dépendent font un import différé et lèvent une erreur claire si le paquet
    n'est pas installé, plutôt que de faire planter l'import du module entier.

Biais de look-ahead : les rendements/poids sont calculés sur toute la fenêtre
d'estimation puis "appliqués" sur la même fenêtre dans les exemples ci-dessous.
Pour un vrai backtest, séparez toujours fenêtre d'estimation (in-sample) et
fenêtre de test (out-of-sample), voir `walk_forward_backtest`.
"""

from __future__ import annotations

import datetime as dt
import warnings
from typing import Optional

import numpy as np
import pandas as pd
import yfinance as yf

warnings.filterwarnings("ignore", category=FutureWarning)

TRADING_DAYS = 252


# ---------------------------------------------------------------------------
# 1) Données
# ---------------------------------------------------------------------------

def download_prices(assets: list[str], start: Optional[str] = None, end: Optional[str] = None,
                     years: int = 3) -> pd.DataFrame:
    """Télécharge les prix de clôture ajustés pour une liste d'actifs.
    Par défaut : les `years` dernières années glissantes (plutôt que des
    dates codées en dur comme dans le notebook original)."""
    if end is None:
        end = dt.date.today().isoformat()
    if start is None:
        start = (dt.date.today() - dt.timedelta(days=365 * years)).isoformat()

    data = yf.download(assets, start=start, end=end, progress=False, auto_adjust=True)
    if isinstance(data.columns, pd.MultiIndex):
        prices = data["Close"]
    else:
        prices = data[["Close"]]
        prices.columns = assets
    return prices.dropna(how="all")


def compute_annualized_stats(prices: pd.DataFrame, trading_days: int = TRADING_DAYS):
    """Rendements journaliers, rendements moyens annualisés et matrice de
    covariance annualisée."""
    returns = prices.pct_change().dropna()
    avg_returns = returns.mean() * trading_days
    cov_mat = returns.cov() * trading_days
    return returns, avg_returns, cov_mat


# ---------------------------------------------------------------------------
# 2) Portefeuille équipondéré (benchmark naïf)
# ---------------------------------------------------------------------------

def equal_weight_returns(returns: pd.DataFrame) -> pd.Series:
    n = returns.shape[1]
    weights = np.repeat(1 / n, n)
    return pd.Series(np.dot(returns.values, weights), index=returns.index)


# ---------------------------------------------------------------------------
# 3) Frontière efficiente : Monte Carlo
# ---------------------------------------------------------------------------

def monte_carlo_frontier(avg_returns: pd.Series, cov_mat: pd.DataFrame,
                          n_portfolios: int = 10_000, rf_rate: float = 0.0,
                          seed: Optional[int] = 42) -> pd.DataFrame:
    """Simule des portefeuilles à poids aléatoires (long-only, somme=1) et
    calcule rendement/volatilité/Sharpe pour chacun."""
    rng = np.random.default_rng(seed)
    n_assets = len(avg_returns)
    weights = rng.random(size=(n_portfolios, n_assets))
    weights /= weights.sum(axis=1, keepdims=True)

    rtns = weights @ avg_returns.values
    vols = np.sqrt(np.einsum("ij,jk,ik->i", weights, cov_mat.values, weights))
    sharpe = (rtns - rf_rate) / vols

    return pd.DataFrame({"returns": rtns, "volatility": vols, "sharpe_ratio": sharpe}), weights


# ---------------------------------------------------------------------------
# 4) Frontière efficiente : optimisation scipy (SLSQP)
# ---------------------------------------------------------------------------

def _portfolio_return(w, avg_returns):
    return np.sum(avg_returns * w)


def _portfolio_vol(w, cov_mat):
    return np.sqrt(np.dot(w.T, np.dot(cov_mat, w)))


def efficient_frontier_scipy(avg_returns: pd.Series, cov_mat: pd.DataFrame,
                              returns_range: np.ndarray,
                              weight_bounds: tuple = (0, 1)) -> list[dict]:
    """Frontière efficiente par optimisation contrainte (une minimisation de
    volatilité par niveau de rendement cible).

    Correction par rapport au notebook original : la fonction utilise
    explicitement les paramètres `avg_returns`/`cov_mat` reçus, et non des
    variables globales du même nom définies ailleurs dans le notebook.
    """
    import scipy.optimize as sco

    avg_returns_np = np.asarray(avg_returns)
    cov_mat_np = np.asarray(cov_mat)
    n_assets = len(avg_returns_np)
    bounds = tuple(weight_bounds for _ in range(n_assets))
    initial_guess = np.repeat(1 / n_assets, n_assets)

    results = []
    for target_ret in returns_range:
        constraints = (
            {"type": "eq", "fun": lambda w, r=target_ret: _portfolio_return(w, avg_returns_np) - r},
            {"type": "eq", "fun": lambda w: np.sum(w) - 1},
        )
        res = sco.minimize(_portfolio_vol, initial_guess, args=(cov_mat_np,),
                            method="SLSQP", bounds=bounds, constraints=constraints)
        results.append({"target_return": target_ret, "volatility": res["fun"],
                         "weights": res["x"], "success": res["success"]})
    return results


def max_sharpe_scipy(avg_returns: pd.Series, cov_mat: pd.DataFrame, rf_rate: float = 0.0,
                      weight_bounds: tuple = (0, 1)) -> dict:
    """Portefeuille de Sharpe maximal par optimisation directe (pas de balayage
    sur une grille de rendements cibles)."""
    import scipy.optimize as sco

    avg_returns_np = np.asarray(avg_returns)
    cov_mat_np = np.asarray(cov_mat)
    n_assets = len(avg_returns_np)

    def neg_sharpe(w):
        ret = _portfolio_return(w, avg_returns_np)
        vol = _portfolio_vol(w, cov_mat_np)
        return -(ret - rf_rate) / vol

    bounds = tuple(weight_bounds for _ in range(n_assets))
    constraints = ({"type": "eq", "fun": lambda w: np.sum(w) - 1},)
    initial_guess = np.repeat(1 / n_assets, n_assets)

    res = sco.minimize(neg_sharpe, initial_guess, method="SLSQP",
                        bounds=bounds, constraints=constraints)
    weights = res["x"]
    return {
        "weights": weights,
        "return": _portfolio_return(weights, avg_returns_np),
        "volatility": _portfolio_vol(weights, cov_mat_np),
        "sharpe_ratio": -res["fun"],
        "success": res["success"],
    }


def min_volatility_scipy(avg_returns: pd.Series, cov_mat: pd.DataFrame,
                          weight_bounds: tuple = (0, 1)) -> dict:
    import scipy.optimize as sco

    cov_mat_np = np.asarray(cov_mat)
    n_assets = cov_mat_np.shape[0]
    bounds = tuple(weight_bounds for _ in range(n_assets))
    constraints = ({"type": "eq", "fun": lambda w: np.sum(w) - 1},)
    initial_guess = np.repeat(1 / n_assets, n_assets)

    res = sco.minimize(_portfolio_vol, initial_guess, args=(cov_mat_np,),
                        method="SLSQP", bounds=bounds, constraints=constraints)
    weights = res["x"]
    return {
        "weights": weights,
        "return": _portfolio_return(weights, np.asarray(avg_returns)),
        "volatility": res["fun"],
        "success": res["success"],
    }


# ---------------------------------------------------------------------------
# 5) Frontière efficiente : cvxpy (dépendance optionnelle)
# ---------------------------------------------------------------------------

def efficient_frontier_cvxpy(avg_returns: pd.Series, cov_mat: pd.DataFrame,
                              n_points: int = 25, max_leverage: Optional[float] = None):
    try:
        import cvxpy as cp
    except ImportError as e:
        raise ImportError(
            "cvxpy n'est pas installé. `pip install cvxpy` pour utiliser cette fonction "
            "(optionnelle) ; les autres méthodes (scipy, Monte Carlo, HRP) n'en ont pas besoin."
        ) from e

    avg_returns_np = np.asarray(avg_returns)
    cov_mat_np = np.asarray(cov_mat)
    n_assets = len(avg_returns_np)

    weights = cp.Variable(n_assets)
    gamma_par = cp.Parameter(nonneg=True)
    portf_rtn = avg_returns_np @ weights
    portf_vol = cp.quad_form(weights, cov_mat_np)
    objective = cp.Maximize(portf_rtn - gamma_par * portf_vol)

    base_constraints = [cp.sum(weights) == 1]
    if max_leverage is not None:
        base_constraints.append(cp.norm(weights, 1) <= max_leverage)
    else:
        base_constraints.append(weights >= 0)

    problem = cp.Problem(objective, base_constraints)

    rtns, vols, weights_list = [], [], []
    for gamma in np.logspace(-3, 3, num=n_points):
        gamma_par.value = gamma
        problem.solve()
        if weights.value is None:
            continue
        rtns.append(float(portf_rtn.value))
        vols.append(float(np.sqrt(portf_vol.value)))
        weights_list.append(weights.value.copy())

    return pd.DataFrame({"return": rtns, "volatility": vols}), weights_list


# ---------------------------------------------------------------------------
# 6) Hierarchical Risk Parity / PyPortfolioOpt (dépendance optionnelle)
# ---------------------------------------------------------------------------

def hrp_optimize(prices: pd.DataFrame) -> dict:
    try:
        from pypfopt.expected_returns import returns_from_prices
        from pypfopt.hierarchical_portfolio import HRPOpt
    except ImportError as e:
        raise ImportError(
            "PyPortfolioOpt n'est pas installé. `pip install PyPortfolioOpt` "
            "(le paquet PyPI officiel ; pas besoin d'installer depuis GitHub)."
        ) from e

    rtn_df = returns_from_prices(prices)
    hrp = HRPOpt(returns=rtn_df)
    hrp.optimize()
    weights = hrp.clean_weights()
    perf = hrp.portfolio_performance(verbose=False, risk_free_rate=0)
    return {"weights": weights, "expected_return": perf[0], "volatility": perf[1], "sharpe": perf[2]}


def max_sharpe_pypfopt(prices: pd.DataFrame, gamma_l2: float = 0.0) -> dict:
    try:
        from pypfopt.expected_returns import mean_historical_return
        from pypfopt.risk_models import CovarianceShrinkage
        from pypfopt.efficient_frontier import EfficientFrontier
        from pypfopt import objective_functions
    except ImportError as e:
        raise ImportError("PyPortfolioOpt n'est pas installé (`pip install PyPortfolioOpt`).") from e

    mu = mean_historical_return(prices)
    S = CovarianceShrinkage(prices).ledoit_wolf()
    ef = EfficientFrontier(mu, S)
    if gamma_l2 > 0:
        ef.add_objective(objective_functions.L2_reg, gamma=gamma_l2)
    weights = ef.max_sharpe(risk_free_rate=0)
    perf = ef.portfolio_performance(verbose=False, risk_free_rate=0)
    return {"weights": ef.clean_weights(), "expected_return": perf[0], "volatility": perf[1], "sharpe": perf[2]}


# ---------------------------------------------------------------------------
# 7) Backtest / métriques (remplace la dépendance à pyfolio)
# ---------------------------------------------------------------------------

def backtest_metrics(returns: pd.Series, trading_days: int = TRADING_DAYS, rf_rate: float = 0.0) -> dict:
    """Métriques de performance calculées directement (sans pyfolio, non
    maintenu). Couvre l'essentiel : CAGR, volatilité, Sharpe, Sortino, max
    drawdown, Calmar."""
    returns = returns.dropna()
    cumulative = (1 + returns).cumprod()
    n_years = len(returns) / trading_days

    cagr_ = cumulative.iloc[-1] ** (1 / n_years) - 1 if n_years > 0 else np.nan
    vol = returns.std() * np.sqrt(trading_days)
    sharpe = (returns.mean() * trading_days - rf_rate) / vol if vol else np.nan

    downside = returns[returns < 0]
    downside_vol = downside.std() * np.sqrt(trading_days) if len(downside) else np.nan
    sortino = (returns.mean() * trading_days - rf_rate) / downside_vol if downside_vol else np.nan

    running_max = cumulative.cummax()
    drawdown = cumulative / running_max - 1
    max_drawdown = drawdown.min()
    calmar = cagr_ / abs(max_drawdown) if max_drawdown else np.nan

    return {
        "cagr": cagr_,
        "annual_volatility": vol,
        "sharpe_ratio": sharpe,
        "sortino_ratio": sortino,
        "max_drawdown": max_drawdown,
        "calmar_ratio": calmar,
    }


def walk_forward_backtest(prices: pd.DataFrame, optimizer_fn, lookback_days: int = TRADING_DAYS,
                           rebalance_every: int = 21) -> pd.Series:
    """Backtest hors-échantillon simple : à chaque date de rebalancement, on
    optimise les poids sur les `lookback_days` PRÉCÉDENTS uniquement (jamais sur
    le futur), puis on tient ces poids jusqu'au rebalancement suivant. Évite le
    biais de look-ahead des exemples "pédagogiques" du notebook original, où
    les poids optimaux étaient calculés et appliqués sur la même fenêtre.

    `optimizer_fn(avg_returns, cov_mat) -> np.ndarray` doit renvoyer un vecteur
    de poids (ex: `lambda a, c: max_sharpe_scipy(a, c)["weights"]`).
    """
    returns = prices.pct_change().dropna()
    portfolio_returns = pd.Series(index=returns.index, dtype=float)
    current_weights = None

    for i in range(lookback_days, len(returns)):
        if (i - lookback_days) % rebalance_every == 0 or current_weights is None:
            window = returns.iloc[i - lookback_days:i]
            avg_r = window.mean() * TRADING_DAYS
            cov = window.cov() * TRADING_DAYS
            current_weights = optimizer_fn(avg_r, cov)
        portfolio_returns.iloc[i] = float(np.dot(current_weights, returns.iloc[i].values))

    return portfolio_returns.dropna()


if __name__ == "__main__":
    assets = ["META", "AMZN", "AAPL", "NFLX", "GOOG"]
    prices = download_prices(assets)
    returns, avg_returns, cov_mat = compute_annualized_stats(prices)

    ew_returns = equal_weight_returns(returns)
    print("Equal-weight backtest:", backtest_metrics(ew_returns))

    best = max_sharpe_scipy(avg_returns, cov_mat)
    print("Max Sharpe weights:", dict(zip(assets, best["weights"].round(3))))
    print("Sharpe attendu (in-sample):", round(best["sharpe_ratio"], 2))
