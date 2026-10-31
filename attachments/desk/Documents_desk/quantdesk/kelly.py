"""Critère de Kelly en temps discret et continu : fractions optimales, incertitude d'estimation,
contraintes de levier / long-only, simulation Monte-Carlo et moteur de backtest sans look-ahead.

Notation : μ, σ² = rendement espéré et variance PAR PÉRIODE (ici : journaliers), r = taux sans risque de la même période,
f = fraction du capital investie dans l'actif risqué (levier), g(f) = taux de croissance log-espéré de la richesse.
"""
from __future__ import annotations

from typing import Dict, Iterable, Optional

import numpy as np
import pandas as pd
from scipy import optimize, stats

TRADING_DAYS = 252


# ======================================================================================
# 1. Formules fermées
# ======================================================================================
def kelly_binary(p: float, win: float, loss: float = 1.0) -> float:
    """Pari binaire : on gagne `win` par unité misée avec proba p, on perd `loss` sinon.  f* = p/loss − (1−p)/win."""
    return p / loss - (1 - p) / win


def kelly_from_trades(pnl: Iterable[float]) -> Dict[str, float]:
    """Kelly d'une stratégie à partir de la distribution de ses trades (P&L par unité de risque).
    f* = W/L̄ − (1−W)/W̄  (Thorp).  Hypothèse iid stationnaire : à utiliser comme *borne haute*, jamais telle quelle."""
    x = np.asarray(list(pnl), float)
    x = x[~np.isnan(x)]
    wins, losses = x[x > 0], -x[x < 0]
    if wins.size == 0 or losses.size == 0:
        return {"f_kelly": np.nan}
    W = wins.size / (wins.size + losses.size)
    return {"win_rate": W, "payoff_ratio": wins.mean() / losses.mean(), "f_kelly": kelly_binary(W, wins.mean(), losses.mean()), "n": x.size}


def growth_rate(f, mu: float, sigma2: float, r: float = 0.0):
    """g(f) = r + f(μ−r) − ½ f² σ².   (le signe MOINS du terme quadratique est ce qui rend g concave)."""
    f = np.asarray(f, float)
    return r + f * (mu - r) - 0.5 * f ** 2 * sigma2


def kelly_continuous(mu: float, sigma2: float, r: float = 0.0) -> float:
    """f* = (μ − r)/σ²  — maximiseur unique de g."""
    return (mu - r) / sigma2


def kelly_multi(mu, cov, r: float = 0.0) -> np.ndarray:
    """F* = Σ⁻¹(μ − r·1)  — sans contrainte, le solde (1 − ΣF*) est en cash/emprunt au taux r."""
    mu = np.asarray(mu, float)
    return np.linalg.solve(np.asarray(cov, float), mu - r)


def kelly_empirical(returns, r: float = 0.0, f_max: float = 20.0) -> float:
    """Maximise Σ log(1 + r + f(R−r)) directement sur l'échantillon : capture asymétrie et queues épaisses
    (contrairement à l'approximation gaussienne μ/σ²)."""
    x = np.asarray(pd.Series(returns).dropna(), float)
    lo = -0.999 / max(-(x - r).max(), 1e-12) if (x - r).max() > 0 else -f_max
    hi = 0.999 / max(-(x - r).min(), 1e-12) if (x - r).min() < 0 else f_max
    fn = lambda f: -np.mean(np.log1p(r + f * (x - r)))
    res = optimize.minimize_scalar(fn, bounds=(max(lo, -f_max), min(hi, f_max)), method="bounded")
    return float(res.x)


# ======================================================================================
# 2. Incertitude sur les paramètres (le point qui fait la différence en pratique)
# ======================================================================================
def bayes_shrink_mu(mu_excess: float, sigma: float, n_obs: int, tau: float = 0.4, periods: int = TRADING_DAYS):
    """Shrinkage bayésien du Sharpe annuel vers 0 (prior N(0, τ²)).  Retourne (μ_excès postérieur, Var(μ) postérieure),
    dans les unités *par période* de l'entrée.  Pour l'utilité log, E[log W] est LINÉAIRE en μ : l'allocation optimale utilise
    la moyenne postérieure, f = E[μ−r]/σ² (la variance postérieure n'ajoute pas de terme) ; le coût de l'incertitude vient de la
    dispersion de f̂ autour de f*, d'où la perte moyenne Var(f̂)·σ²/2 = 1/(2Y) par an pour le plug-in non tronqué."""
    years = n_obs / periods
    sr_hat = mu_excess * periods / (sigma * np.sqrt(periods))  # Sharpe annualisé estimé
    post_var_sr = 1.0 / (1.0 / tau ** 2 + years)               # variance postérieure du Sharpe annuel
    post_sr = post_var_sr * years * sr_hat                      # moyenne postérieure (prior centré sur 0)
    mu_post = post_sr * sigma * np.sqrt(periods) / periods
    var_mu = post_var_sr * (sigma ** 2 * periods) / periods ** 2
    return mu_post, var_mu


def shrunk_covariance(R: pd.DataFrame, method: str = "lw") -> np.ndarray:
    if method == "lw":
        from sklearn.covariance import LedoitWolf
        return LedoitWolf().fit(R.dropna().values).covariance_
    if method == "diag":                      # hypothèse « actifs non corrélés » du notebook d'origine
        return np.diag(R.var().values)
    return R.cov().values


# ======================================================================================
# 3. Allocation multi-actifs sous contraintes
# ======================================================================================
def kelly_constrained(mu, cov, r: float = 0.0, max_leverage: float = 1.0, long_only: bool = False, fraction: float = 1.0) -> np.ndarray:
    """max g(f) = r + f'(μ−r) − ½ f'Σf   s.t.  Σ|f_i| ≤ L  (et f ≥ 0 si long_only).  Puis multiplication par `fraction`.
    Remplace la normalisation f·α/Σf du notebook original, qui ne résout pas le problème contraint
    (elle change la direction du portefeuille et diverge quand Σf* ≈ 0)."""
    mu, cov = np.asarray(mu, float), np.asarray(cov, float)
    k = len(mu)
    ex = mu - r
    if long_only:
        x0 = np.zeros(k)
        obj = lambda x: -(x @ ex - 0.5 * x @ cov @ x)
        jac = lambda x: -(ex - cov @ x)
        cons = [{"type": "ineq", "fun": lambda x: max_leverage - x.sum(), "jac": lambda x: -np.ones(k)}]
        res = optimize.minimize(obj, x0, jac=jac, bounds=[(0, None)] * k, constraints=cons, method="SLSQP", options={"maxiter": 300, "ftol": 1e-12})
        f = res.x
    else:
        def unpack(x): return x[:k] - x[k:]
        obj = lambda x: -(unpack(x) @ ex - 0.5 * unpack(x) @ cov @ unpack(x))
        def jac(x):
            g = -(ex - cov @ unpack(x))
            return np.concatenate([g, -g])
        cons = [{"type": "ineq", "fun": lambda x: max_leverage - x.sum(), "jac": lambda x: -np.ones(2 * k)}]
        res = optimize.minimize(obj, np.zeros(2 * k), jac=jac, bounds=[(0, None)] * (2 * k), constraints=cons, method="SLSQP", options={"maxiter": 300, "ftol": 1e-12})
        f = unpack(res.x)
    return fraction * f


# ======================================================================================
# 4. Risque de drawdown d'un pari Kelly fractionnaire (mouvement brownien géométrique)
# ======================================================================================
def prob_drawdown(c: float, x: float = 0.5) -> float:
    """P(la richesse touche x·W₀ un jour) pour une fraction c·f* (c=1 : Kelly plein) : x^(2/c − 1), plafonnée à 1.
    Résultat exact en temps continu pour un GBM (taux sans risque ≈ 0) ; c=1 ⇒ 1 chance sur 2 de perdre la moitié du capital."""
    return float(min(1.0, x ** (2.0 / c - 1.0)))


def fraction_for_drawdown(x: float, beta: float) -> float:
    """Multiple c de Kelly tel que P(toucher x·W₀) = β :  c = 2 / (1 + ln β / ln x)."""
    return 2.0 / (1.0 + np.log(beta) / np.log(x))


# ======================================================================================
# 5. Simulation Monte-Carlo de fractions de Kelly
# ======================================================================================
def simulate_fractional_kelly(mu_ann: float, sigma_ann: float, r_ann: float = 0.0, fractions=(0.25, 0.5, 1.0, 1.5, 2.0),
                              years: float = 10, n_paths: int = 5000, dist: str = "t", df: float = 5.0, seed: int = 0):
    """Rebalancement quotidien à fraction constante c·f*.  Retourne (résumé, richesses[nom] = array (n_paths, T+1))."""
    rng = np.random.default_rng(seed)
    T = int(years * TRADING_DAYS)
    dt = 1 / TRADING_DAYS
    z = rng.standard_normal((n_paths, T)) if dist == "normal" else rng.standard_t(df, (n_paths, T)) / np.sqrt(df / (df - 2))
    R = np.exp((mu_ann - 0.5 * sigma_ann ** 2) * dt + sigma_ann * np.sqrt(dt) * z) - 1
    rd = r_ann * dt
    f_star = (mu_ann - r_ann) / sigma_ann ** 2
    rows, paths = [], {}
    for c in fractions:
        f = c * f_star
        step = np.maximum(1 + rd + f * (R - rd), 1e-9)  # ruine bornée
        W = np.hstack([np.ones((n_paths, 1)), np.cumprod(step, axis=1)])
        mdd = (W / np.maximum.accumulate(W, axis=1) - 1).min(axis=1)
        paths[f"{c:g}×"] = W
        rows.append({"fraction": c, "levier": f, "W_final_médiane": np.median(W[:, -1]), "W_final_P5": np.percentile(W[:, -1], 5),
                     "W_final_P95": np.percentile(W[:, -1], 95), "P(perte)": (W[:, -1] < 1).mean(),
                     "MDD_médian": np.median(mdd), "MDD_pire5%": np.percentile(mdd, 5), "P(MDD>50%)": (mdd < -0.5).mean(),
                     "P(W touche 50%)": (W.min(axis=1) <= 0.5).mean(), "P(W touche 50%)_théo": prob_drawdown(c, 0.5),
                     "g_théorique": float(growth_rate(f, mu_ann, sigma_ann ** 2, r_ann))})
    return pd.DataFrame(rows).set_index("fraction"), paths


# ======================================================================================
# 6. Estimation glissante des moments et signal Kelly (sans look-ahead)
# ======================================================================================
def kelly_signal(returns: pd.DataFrame | pd.Series, rf_ann: float = 0.0, est: str = "expanding", window: int = 756,
                 halflife: int = 252, min_periods: int = 504, rebalance: int = 5, cov: str = "lw", tau: Optional[float] = 0.4,
                 max_leverage: float = 2.0, long_only: bool = True, fraction: float = 0.5) -> pd.DataFrame:
    """Poids cibles calculés avec l'information ≤ t (à appliquer au rendement de t+1).
    est : 'expanding' | 'rolling' | 'ewma' ; tau : écart-type du prior bayésien sur le Sharpe annuel (None = pas de shrinkage)."""
    R = returns.to_frame() if isinstance(returns, pd.Series) else returns
    rf = rf_ann / TRADING_DAYS
    dates = R.index
    W = pd.DataFrame(np.nan, index=dates, columns=R.columns)
    for i in range(min_periods, len(R), rebalance):
        if est == "expanding":
            hist = R.iloc[: i + 1]
        elif est == "rolling":
            hist = R.iloc[max(0, i + 1 - window): i + 1]
        else:
            hist = R.iloc[max(0, i + 1 - 5 * halflife): i + 1]
        if est == "ewma":
            wts = 0.5 ** (np.arange(len(hist))[::-1] / halflife)
            wts /= wts.sum()
            mu = (hist.values * wts[:, None]).sum(axis=0)
            dev = hist.values - mu
            C = (dev * wts[:, None]).T @ dev / (1 - (wts ** 2).sum())
        else:
            mu = hist.mean().values
            C = shrunk_covariance(hist, cov) if R.shape[1] > 1 else np.atleast_2d(hist.var().values)
        ex = mu - rf
        if tau is not None:
            n_eff = len(hist) if est != "ewma" else 2 * halflife
            sd = np.sqrt(np.diag(C))
            ex = np.array([bayes_shrink_mu(ex[j], sd[j], n_eff, tau)[0] for j in range(len(ex))])
        if R.shape[1] == 1:                    # chemin rapide : forme fermée + borne de levier
            lo = 0.0 if long_only else -max_leverage
            w_i = np.array([fraction * np.clip(ex[0] / C[0, 0], lo, max_leverage)])
        else:
            w_i = kelly_constrained(ex + rf, C, rf, max_leverage, long_only, fraction)
        w_i[np.abs(w_i) < 1e-8] = 0.0
        W.iloc[i] = w_i
    return W.ffill()


def perf_stats(ret: pd.Series, rf_ann: float = 0.0) -> Dict[str, float]:
    ret = ret.dropna()
    n = len(ret)
    if n < 30:
        return {}
    wealth = (1 + ret).cumprod()
    years = n / TRADING_DAYS
    cagr = wealth.iloc[-1] ** (1 / years) - 1
    vol = ret.std() * np.sqrt(TRADING_DAYS)
    ex = ret - rf_ann / TRADING_DAYS
    dd = wealth / wealth.cummax() - 1
    downside = np.sqrt((np.minimum(ex, 0) ** 2).mean()) * np.sqrt(TRADING_DAYS)
    q = ret.quantile(0.05)
    return {"CAGR": cagr, "Vol": vol, "Sharpe": ex.mean() * TRADING_DAYS / vol if vol > 0 else np.nan,
            "Sortino": ex.mean() * TRADING_DAYS / downside if downside > 0 else np.nan, "MaxDD": dd.min(),
            "Calmar": cagr / abs(dd.min()) if dd.min() < 0 else np.nan, "ES95_jour": -ret[ret <= q].mean(),
            "Skew": stats.skew(ret), "Kurt_exc": stats.kurtosis(ret), "Richesse_finale": wealth.iloc[-1]}


def backtest_kelly(returns: pd.DataFrame | pd.Series, rf_ann: float = 0.0, cost_bps: float = 2.0, borrow_spread_ann: float = 0.005,
                   short_fee_ann: float = 0.003, **signal_kw) -> Dict[str, object]:
    """Backtest complet : coûts de transaction sur le turnover, coût de financement du levier (rf + spread),
    frais de short, cash rémunéré à rf sur la part non investie.  Poids(t) appliqués au rendement(t+1)."""
    R = returns.to_frame() if isinstance(returns, pd.Series) else returns
    W = kelly_signal(R, rf_ann=rf_ann, **signal_kw)
    Wl = W.shift(1).fillna(0.0)                       # information ≤ t-1 pour le rendement de t
    rf = rf_ann / TRADING_DAYS
    gross = (Wl * R).sum(axis=1)
    lev = Wl.clip(lower=0).sum(axis=1)
    cash = 1 - Wl.sum(axis=1)
    borrow = np.maximum(-cash, 0) * borrow_spread_ann / TRADING_DAYS
    short_cost = (-Wl.clip(upper=0)).sum(axis=1) * short_fee_ann / TRADING_DAYS
    turnover = Wl.diff().abs().sum(axis=1).fillna(0)
    costs = turnover * cost_bps / 1e4
    net = gross + cash * rf - borrow - short_cost - costs
    active = W.dropna().index[0]
    net = net.loc[active:]
    return {"ret": net, "weights": W.loc[active:], "leverage": Wl.sum(axis=1).loc[active:], "turnover_ann": turnover.loc[active:].mean() * TRADING_DAYS,
            "stats": perf_stats(net, rf_ann)}
