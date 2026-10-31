"""Moteurs VaR / Expected Shortfall et backtesting.

Conventions
-----------
* Les rendements sont des rendements journaliers *simples* (ou log) ; les pertes sont positives.
* VaR_α et ES_α sont retournés comme des **pertes positives** en fraction de la valeur du portefeuille.
* Le niveau de confiance α est celui de la queue (0.99 => on regarde le 1er percentile des rendements).
* Une prévision pour la date t n'utilise que l'information ≤ t-1 (aucun look-ahead).
"""
from __future__ import annotations

from typing import Dict, Optional

import numpy as np
import pandas as pd
from scipy import optimize, stats
from scipy.special import xlogy


def _clean(r) -> np.ndarray:
    return np.asarray(pd.Series(r).dropna(), dtype=float)


# ======================================================================================
# 1. Estimateurs de VaR / ES sur un échantillon (« statiques »)
# ======================================================================================
def hist_var_es(r, alpha: float = 0.99) -> Dict[str, float]:
    x = _clean(r)
    q = np.quantile(x, 1 - alpha)
    tail = x[x <= q]
    return {"VaR": -q, "ES": -tail.mean() if tail.size else -q}


def normal_var_es(r, alpha: float = 0.99, mu: Optional[float] = None, sigma: Optional[float] = None) -> Dict[str, float]:
    x = _clean(r)
    mu = x.mean() if mu is None else mu
    sigma = x.std(ddof=1) if sigma is None else sigma
    z = stats.norm.ppf(alpha)
    return {"VaR": -mu + sigma * z, "ES": -mu + sigma * stats.norm.pdf(z) / (1 - alpha)}


def student_t_var_es(r, alpha: float = 0.99) -> Dict[str, float]:
    """Student-t à 3 paramètres ajustée par maximum de vraisemblance (ES en forme fermée, ν>1)."""
    x = _clean(r)
    nu, loc, scale = stats.t.fit(x)
    nu = max(nu, 1.05)
    q = stats.t.ppf(alpha, nu)
    es_std = stats.t.pdf(q, nu) / (1 - alpha) * (nu + q ** 2) / (nu - 1)
    return {"VaR": -loc + scale * q, "ES": -loc + scale * es_std, "nu": nu}


def _cf_quantile(z: np.ndarray, skew: float, exkurt: float) -> np.ndarray:
    return (z + (z ** 2 - 1) * skew / 6 + (z ** 3 - 3 * z) * exkurt / 24 - (2 * z ** 3 - 5 * z) * skew ** 2 / 36)


def cornish_fisher_var_es(r, alpha: float = 0.99) -> Dict[str, float]:
    """Développement de Cornish-Fisher (moments 3 et 4). Valide seulement si le quantile modifié reste
    monotone : on le vérifie et on signale `valid=False` sinon."""
    x = _clean(r)
    mu, sd = x.mean(), x.std(ddof=1)
    s, k = stats.skew(x), stats.kurtosis(x)  # kurtosis excédentaire
    u = np.linspace(1e-6, 1 - alpha, 4000)
    zq = _cf_quantile(stats.norm.ppf(u), s, k)
    valid = bool(np.all(np.diff(zq) >= 0))
    z_a = _cf_quantile(stats.norm.ppf(1 - alpha), s, k)
    return {"VaR": -(mu + sd * z_a), "ES": -(mu + sd * zq.mean()), "valid": valid}


def evt_pot_var_es(r, alpha: float = 0.99, threshold_q: float = 0.95) -> Dict[str, float]:
    """Peaks-over-threshold : GPD sur les excès de pertes au-dessus du quantile `threshold_q`."""
    losses = -_clean(r)
    n = losses.size
    u = np.quantile(losses, threshold_q)
    exc = losses[losses > u] - u
    if exc.size < 20:
        return {"VaR": np.nan, "ES": np.nan, "xi": np.nan, "beta": np.nan}
    xi, _, beta = stats.genpareto.fit(exc, floc=0)
    p_exc = exc.size / n
    if abs(xi) < 1e-8:
        var = u + beta * np.log(p_exc / (1 - alpha))
    else:
        var = u + beta / xi * ((p_exc / (1 - alpha)) ** xi - 1)
    es = var / (1 - xi) + (beta - xi * u) / (1 - xi) if xi < 1 else np.nan
    return {"VaR": var, "ES": es, "xi": xi, "beta": beta}


# ======================================================================================
# 2. Volatilité conditionnelle : EWMA et GARCH filtré (FHS)
# ======================================================================================
def ewma_sigma_forecast(r: pd.Series, lam: float = 0.94, seed_obs: int = 30) -> pd.Series:
    """σ_t prévu à t-1 pour chaque date t (RiskMetrics)."""
    x = r.dropna()
    v = np.empty(len(x))
    v[0] = x.iloc[:seed_obs].var()
    for t in range(1, len(x)):
        v[t] = lam * v[t - 1] + (1 - lam) * x.iloc[t - 1] ** 2
    return pd.Series(np.sqrt(v), index=x.index, name="sigma_ewma")


def _fit_gjr(x_pct: np.ndarray, dist: str = "t"):
    from arch import arch_model

    am = arch_model(x_pct, mean="Constant", vol="GARCH", p=1, o=1, q=1, dist=dist, rescale=False)
    return am.fit(disp="off", show_warning=False)


def garch_fhs_next(r, alpha: float = 0.99, dist: str = "t") -> Dict[str, float]:
    """GJR-GARCH(1,1) + Filtered Historical Simulation : VaR/ES pour le jour suivant."""
    x = _clean(r) * 100.0
    res = _fit_gjr(x, dist)
    p = res.params
    z = (x - p["mu"]) / res.conditional_volatility
    f = res.forecast(horizon=1, reindex=False).variance.values[-1, 0]
    sig = np.sqrt(f)
    q = np.quantile(z, 1 - alpha)
    return {"VaR": -(p["mu"] + sig * q) / 100, "ES": -(p["mu"] + sig * z[z <= q].mean()) / 100, "sigma": sig / 100}


# ======================================================================================
# 3. Monte-Carlo multi-actifs (t multivariée) et GBM vectorisé
# ======================================================================================
def mc_portfolio_var_es(
    weights, mu, cov, alpha: float = 0.99, horizon: int = 1, n_sims: int = 200_000,
    dist: str = "t", df: float = 5.0, seed: int = 0,
) -> Dict[str, float]:
    """VaR/ES d'un portefeuille buy-and-hold sur `horizon` jours par simulation directe (pas de règle √T).
    mu, cov : moyenne et covariance *journalières* des rendements log. Pertes en fraction de la valeur initiale."""
    rng = np.random.default_rng(seed)
    w = np.asarray(weights, float)
    mu, cov = np.asarray(mu, float), np.asarray(cov, float)
    L = np.linalg.cholesky(cov)
    k = len(w)
    cum = np.zeros((n_sims, k))
    for _ in range(horizon):
        z = rng.standard_normal((n_sims, k)) @ L.T
        if dist == "t":
            chi = rng.chisquare(df, size=(n_sims, 1)) / df
            z = z / np.sqrt(chi) * np.sqrt((df - 2) / df)
        cum += mu + z
    pnl = (w * (np.exp(cum) - 1.0)).sum(axis=1)
    q = np.quantile(pnl, 1 - alpha)
    return {"VaR": -q, "ES": -pnl[pnl <= q].mean()}


def simulate_gbm_paths(s0: float, mu: float, sigma: float, days: int, n_paths: int, seed: int = 0, dist: str = "normal", df: float = 5.0):
    """Trajectoires GBM (mu, sigma annualisés) — version vectorisée et exacte de la marche aléatoire du notebook original."""
    rng = np.random.default_rng(seed)
    dt = 1.0 / 252.0
    z = rng.standard_normal((n_paths, days))
    if dist == "t":
        z = rng.standard_t(df, size=(n_paths, days)) / np.sqrt(df / (df - 2))
    log_inc = (mu - 0.5 * sigma ** 2) * dt + sigma * np.sqrt(dt) * z
    paths = s0 * np.exp(np.cumsum(log_inc, axis=1))
    return np.hstack([np.full((n_paths, 1), s0), paths])


# ======================================================================================
# 4. Backtests rolling
# ======================================================================================
def rolling_var_es(r: pd.Series, method: str = "hist", alpha: float = 0.99, window: int = 750, step: Optional[int] = None,
                   lam: float = 0.94, min_obs: Optional[int] = None) -> pd.DataFrame:
    """Prévisions hors-échantillon date par date. Retourne colonnes [ret, VaR, ES]."""
    r = r.dropna()
    n = len(r)
    min_obs = min_obs or window
    default_step = {"hist": 1, "normal": 1, "cf": 1, "t": 5, "evt": 5, "garch_fhs": 20, "ewma": 1}
    step = step or default_step[method]
    var = np.full(n, np.nan)
    es = np.full(n, np.nan)

    if method == "ewma":
        sig = ewma_sigma_forecast(r, lam).values
        z = stats.norm.ppf(alpha)
        var[:] = sig * z
        es[:] = sig * stats.norm.pdf(z) / (1 - alpha)
        var[:min_obs] = np.nan
        es[:min_obs] = np.nan
    elif method == "garch_fhs":
        from arch import arch_model  # noqa: F401  (import tôt pour échouer clairement)
        x_all = r.values * 100.0
        t = min_obs
        while t < n:
            w = x_all[max(0, t - window):t]
            try:
                res = _fit_gjr(w, "t")
                p = res.params
                cv = res.conditional_volatility
                zs = (w - p["mu"]) / cv
                q = np.quantile(zs, 1 - alpha)
                tail_mean = zs[zs <= q].mean()
                s2 = cv[-1] ** 2
                eps_prev = w[-1] - p["mu"]
                for j in range(t, min(t + step, n)):
                    s2 = p["omega"] + (p["alpha[1]"] + p["gamma[1]"] * (eps_prev < 0)) * eps_prev ** 2 + p["beta[1]"] * s2
                    sig = np.sqrt(s2)
                    var[j] = -(p["mu"] + sig * q) / 100
                    es[j] = -(p["mu"] + sig * tail_mean) / 100
                    eps_prev = x_all[j] - p["mu"]
            except Exception:
                pass
            t += step
    else:
        fn = {"hist": hist_var_es, "normal": normal_var_es, "cf": cornish_fisher_var_es, "t": student_t_var_es, "evt": evt_pot_var_es}[method]
        vals = r.values
        cur = (np.nan, np.nan)
        for t in range(min_obs, n):
            if (t - min_obs) % step == 0:
                try:
                    o = fn(vals[t - window:t], alpha)
                    cur = (o["VaR"], o["ES"])
                except Exception:
                    pass
            var[t], es[t] = cur
    out = pd.DataFrame({"ret": r.values, "VaR": var, "ES": es}, index=r.index).dropna()
    out["hit"] = (out["ret"] < -out["VaR"]).astype(int)
    return out


def kupiec_pof(hits, alpha: float = 0.99) -> Dict[str, float]:
    """Test de couverture inconditionnelle de Kupiec (proportion d'exceptions)."""
    h = np.asarray(hits, int)
    T, x, p = h.size, int(h.sum()), 1 - alpha
    phat = x / T
    ll0 = xlogy(T - x, 1 - p) + xlogy(x, p)
    ll1 = xlogy(T - x, 1 - phat) + xlogy(x, phat)
    lr = -2 * (ll0 - ll1)
    return {"exceptions": x, "expected": T * p, "rate": phat, "LR_pof": lr, "p_pof": 1 - stats.chi2.cdf(lr, 1)}


def christoffersen_independence(hits) -> Dict[str, float]:
    """Test d'indépendance (clustering des exceptions) de Christoffersen."""
    h = np.asarray(hits, int)
    a, b = h[:-1], h[1:]
    n00 = int(((a == 0) & (b == 0)).sum()); n01 = int(((a == 0) & (b == 1)).sum())
    n10 = int(((a == 1) & (b == 0)).sum()); n11 = int(((a == 1) & (b == 1)).sum())
    pi01 = n01 / max(n00 + n01, 1); pi11 = n11 / max(n10 + n11, 1); pi = (n01 + n11) / max(n00 + n01 + n10 + n11, 1)
    ll0 = xlogy(n00 + n10, 1 - pi) + xlogy(n01 + n11, pi)
    ll1 = xlogy(n00, 1 - pi01) + xlogy(n01, pi01) + xlogy(n10, 1 - pi11) + xlogy(n11, pi11)
    lr = max(-2 * (ll0 - ll1), 0.0)
    return {"LR_ind": lr, "p_ind": 1 - stats.chi2.cdf(lr, 1), "n11": n11}


def basel_traffic_light(exceptions: int, T: int = 250, alpha: float = 0.99) -> Dict[str, object]:
    """Zones Bâle (vert < 95 % de la loi binomiale, jaune < 99.99 %, rouge au-delà) et add-on du multiplicateur."""
    cdf = stats.binom.cdf(exceptions, T, 1 - alpha)
    zone = "vert" if cdf < 0.95 else "jaune" if cdf < 0.9999 else "rouge"
    addon = {5: .40, 6: .50, 7: .65, 8: .75, 9: .85}.get(exceptions, 0.0 if exceptions < 5 else 1.0)
    return {"zone": zone, "cdf": cdf, "addon_multiplier": addon}


def es_backtest(bt: pd.DataFrame, alpha: float = 0.99, n_boot: int = 5000, seed: int = 0) -> Dict[str, float]:
    """Backtest de l'ES : Z2 d'Acerbi-Székely (attendu 0 ; >0 = ES sous-estimée) et test de McNeil-Frey
    sur les résidus d'exception (H0 : moyenne 0, H1 : ES sous-estimée) par bootstrap."""
    L = -bt["ret"].values
    ind = (L > bt["VaR"].values).astype(float)
    T = len(bt)
    z2 = (L * ind / bt["ES"].values).sum() / (T * (1 - alpha)) - 1.0
    res = ((L - bt["ES"].values) / bt["ES"].values)[ind == 1]
    if res.size < 5:
        return {"Z2": z2, "MF_mean_resid": np.nan, "p_MF": np.nan, "n_exc": int(res.size)}
    rng = np.random.default_rng(seed)
    centred = res - res.mean()
    boot = rng.choice(centred, size=(n_boot, res.size), replace=True).mean(axis=1)
    return {"Z2": z2, "MF_mean_resid": res.mean(), "p_MF": float((boot >= res.mean()).mean()), "n_exc": int(res.size)}


def backtest_summary(bt: pd.DataFrame, alpha: float = 0.99) -> Dict[str, float]:
    k = kupiec_pof(bt["hit"], alpha)
    c = christoffersen_independence(bt["hit"])
    lr_cc = k["LR_pof"] + c["LR_ind"]
    last = bt["hit"].iloc[-250:]
    tl = basel_traffic_light(int(last.sum()), len(last), alpha)
    e = es_backtest(bt, alpha)
    return {
        "N": len(bt), "exceptions": k["exceptions"], "attendues": round(k["expected"], 1), "taux": k["rate"],
        "p_Kupiec": k["p_pof"], "p_Christoffersen": c["p_ind"], "p_CC": 1 - stats.chi2.cdf(lr_cc, 2),
        "zone_Bâle(250j)": tl["zone"], "Z2_ES": e["Z2"], "p_McNeilFrey": e["p_MF"],
        "VaR_moy": bt["VaR"].mean(), "ES_moy": bt["ES"].mean(),
    }


# ======================================================================================
# 5. Portefeuille : décomposition du risque, stress, sizing
# ======================================================================================
def parametric_risk_decomposition(w, cov, alpha: float = 0.99, names=None) -> pd.DataFrame:
    """VaR/ES normales d'un portefeuille avec VaR marginale et composante (Euler : Σ composantes = VaR)."""
    w = np.asarray(w, float); cov = np.asarray(cov, float)
    sp = np.sqrt(w @ cov @ w)
    z = stats.norm.ppf(alpha)
    mvar = z * (cov @ w) / sp
    cvar = w * mvar
    k = stats.norm.pdf(z) / (1 - alpha) / z
    df = pd.DataFrame({"poids": w, "VaR_marginale": mvar, "VaR_composante": cvar,
                       "ES_composante": cvar * k, "contrib_%": cvar / cvar.sum() * 100},
                      index=names if names is not None else range(len(w)))
    df.loc["TOTAL"] = [w.sum(), np.nan, cvar.sum(), (cvar * k).sum(), 100.0]
    return df


def historical_component_es(R: pd.DataFrame, w, alpha: float = 0.99) -> pd.DataFrame:
    """Décomposition exacte de l'ES historique : contribution_i = -E[w_i r_i | perte portefeuille ≥ VaR]."""
    w = np.asarray(w, float)
    port = R.values @ w
    q = np.quantile(port, 1 - alpha)
    mask = port <= q
    contrib = -(R.values[mask] * w).mean(axis=0)
    df = pd.DataFrame({"poids": w, "ES_contrib": contrib, "contrib_%": contrib / contrib.sum() * 100}, index=R.columns)
    df.loc["TOTAL"] = [w.sum(), contrib.sum(), 100.0]
    return df


def stress_pnl(w, shocks: Dict[str, np.ndarray], names=None) -> pd.Series:
    """P&L (fraction du portefeuille) sous scénarios déterministes de chocs de rendement par actif."""
    w = np.asarray(w, float)
    return pd.Series({k: float(w @ np.asarray(v, float)) for k, v in shocks.items()}, name="P&L")


def position_size(capital: float, risk_budget: float, es_daily: float) -> float:
    """Notionnel tel que la perte de queue (ES 1 jour) = `risk_budget` × capital."""
    return capital * risk_budget / es_daily


def scale_horizon_sqrt(x: float, h: int) -> float:
    """Règle √h : valable seulement pour rendements i.i.d. centrés — à réserver aux ordres de grandeur."""
    return x * np.sqrt(h)
