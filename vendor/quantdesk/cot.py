"""Analytique de positionnement CFTC (Traders in Financial Futures) : features, signaux, tests prédictifs,
backtests réalistes (délai de publication, coûts, vol-targeting) et statistiques de robustesse.

Timing CFTC : positions mesurées le MARDI, publiées le VENDREDI 15h30 ET.  Toute analyse qui utilise la position
de mardi pour trader dès mardi contient un look-ahead de 3 jours ; ce module l'évite par construction (`exec_lag`).
"""
from __future__ import annotations

import re
from dataclasses import dataclass
from typing import Dict, Iterable, Optional, Tuple

import numpy as np
import pandas as pd
from scipy import stats

from .data import _garch_t, TRADING_DAYS

# nom -> (regex CFTC, ticker yfinance spot, inverser ?)  [les futures CME cotent USD par unité de devise étrangère]
FX_SPEC = {
    "EUR": (r"^EURO FX -", "EURUSD=X", False),
    "GBP": (r"^BRITISH POUND", "GBPUSD=X", False),
    "AUD": (r"^AUSTRALIAN DOLLAR", "AUDUSD=X", False),
    "NZD": (r"^(NZ|NEW ZEALAND) DOLLAR", "NZDUSD=X", False),
    "JPY": (r"^JAPANESE YEN", "JPY=X", True),
    "CAD": (r"^CANADIAN DOLLAR", "CAD=X", True),
    "CHF": (r"^SWISS FRANC", "CHF=X", True),
    "MXN": (r"^MEXICAN PESO", "MXN=X", True),
}
_CAT = {"dealer": "Dealer", "am": "Asset_Mgr", "lf": "Lev_Money", "oth": "Other_Rept"}


# ======================================================================================
# 1. Chargement / normalisation
# ======================================================================================
def _col(df: pd.DataFrame, *cands: str) -> str:
    for c in cands:
        if c in df.columns:
            return c
    low = {c.lower(): c for c in df.columns}
    for c in cands:
        if c.lower() in low:
            return low[c.lower()]
    raise KeyError(f"colonne introuvable parmi {cands}")


def download_tff(start_year: int, end_year: int) -> pd.DataFrame:
    """Télécharge les rapports TFF (futures only) via `cot_reports` (nécessite l'accès à cftc.gov)."""
    import cot_reports as cot

    frames = [pd.DataFrame(cot.cot_year(y, cot_report_type="traders_in_financial_futures_fut")) for y in range(start_year, end_year + 1)]
    return pd.concat(frames, ignore_index=True)


def tidy_tff(raw: pd.DataFrame, name_regex: str) -> pd.DataFrame:
    """Extrait un marché et renvoie un tableau propre indexé par date de rapport (mardi)."""
    nm = _col(raw, "Market_and_Exchange_Names", "Market and Exchange Names")
    d = raw[raw[nm].str.contains(name_regex, regex=True, case=False, na=False)].copy()
    dcol = _col(d, "Report_Date_as_YYYY-MM-DD", "Report_Date_as_MM_DD_YYYY", "As_of_Date_In_Form_YYMMDD")
    out = pd.DataFrame({"date": pd.to_datetime(d[dcol]), "oi": pd.to_numeric(d[_col(d, "Open_Interest_All")])})
    for k, pre in _CAT.items():
        out[f"{k}_long"] = pd.to_numeric(d[_col(d, f"{pre}_Positions_Long_All")])
        out[f"{k}_short"] = pd.to_numeric(d[_col(d, f"{pre}_Positions_Short_All")])
    return out.drop_duplicates("date").set_index("date").sort_index()


# ======================================================================================
# 2. Features
# ======================================================================================
def cot_index(x: pd.Series, n: int) -> pd.Series:
    """Position relative dans la fenêtre de n semaines : 0 = plus bas, 1 = plus haut (indice « Williams COT »)."""
    lo, hi = x.rolling(n, min_periods=n // 2).min(), x.rolling(n, min_periods=n // 2).max()
    return (x - lo) / (hi - lo).replace(0, np.nan)


def build_features(t: pd.DataFrame, idx_window: int = 156, z_window: int = 156) -> pd.DataFrame:
    """Positions nettes en % de l'OI par catégorie + indicateurs standards. Toutes les statistiques de fenêtre sont *trailing*."""
    f = pd.DataFrame(index=t.index)
    for k in _CAT:
        f[f"net_{k}"] = (t[f"{k}_long"] - t[f"{k}_short"]) / t["oi"] * 100
    f["net_cot"] = f["net_lf"] - f["net_dealer"]                       # « Net_COT » du notebook original
    f["gross_lf"] = (t["lf_long"] + t["lf_short"]) / t["oi"] * 100      # exposition brute (crowding)
    f["oi_chg_13w"] = t["oi"].pct_change(13)
    for k in ("lf", "am", "dealer", "cot"):
        s = f[f"net_{k}"]
        f[f"idx_{k}"] = cot_index(s, idx_window)
        f[f"z_{k}"] = (s - s.rolling(z_window, min_periods=z_window // 2).mean()) / s.rolling(z_window, min_periods=z_window // 2).std()
        f[f"d4_{k}"] = s.diff(4)
        f[f"d13_{k}"] = s.diff(13)
    f["lf_am_div"] = f["z_lf"] - f["z_am"]                             # divergence spéculateurs / gérants d'actifs
    return f


# ======================================================================================
# 3. Alignement temporel (point crucial : pas de look-ahead)
# ======================================================================================
def availability_dates(report_dates: pd.DatetimeIndex, release_lag_days: int = 3) -> pd.DatetimeIndex:
    """Mardi + 3 jours = vendredi (jour de publication). Les jours fériés retardant la publication ne sont pas modélisés."""
    return report_dates + pd.Timedelta(days=release_lag_days)


def to_daily_position(signal: pd.Series, daily_index: pd.DatetimeIndex, exec_lag: int = 2, release_lag_days: int = 3) -> pd.Series:
    """Signal hebdo (daté au mardi) -> position journalière applicable au rendement de t.
    exec_lag=1 : entrée à la clôture du vendredi de publication ; exec_lag=2 : clôture du lundi (défaut, conservateur)."""
    s = signal.copy()
    s.index = availability_dates(s.index, release_lag_days)
    daily = s.reindex(daily_index.union(s.index)).ffill().reindex(daily_index)
    return daily.shift(exec_lag)


def forward_returns(px: pd.Series, report_dates: pd.DatetimeIndex, horizon_weeks: int = 4, exec_lag: int = 2,
                    release_lag_days: int = 3) -> pd.Series:
    """Rendement du prix entre l'entrée (exec_lag jours ouvrés après publication) et la fin de l'horizon. Utilise l'index de `px`."""
    px = px.dropna()
    avail = availability_dates(report_dates, release_lag_days)
    pos = px.index.searchsorted(avail, side="left")
    ent = np.minimum(pos + exec_lag - 1, len(px) - 1)
    ex = px.index.searchsorted(avail + pd.Timedelta(weeks=horizon_weeks), side="right") - 1
    ok = (ex < len(px)) & (ex > ent) & (pos + exec_lag - 1 < len(px)) & (avail + pd.Timedelta(weeks=horizon_weeks) <= px.index[-1])
    vals = np.where(ok, px.values[np.clip(ex, 0, len(px) - 1)] / px.values[np.clip(ent, 0, len(px) - 1)] - 1, np.nan)
    return pd.Series(vals, index=report_dates, name=f"fwd_{horizon_weeks}w")


# ======================================================================================
# 4. Signaux
# ======================================================================================
def sig_extreme(index_series: pd.Series, hi: float = 0.85, lo: float = 0.15, contrarian: bool = True) -> pd.Series:
    """±1 aux extrêmes de l'indice COT, 0 sinon (contrarian : short quand la position est saturée à l'achat)."""
    s = pd.Series(0.0, index=index_series.index)
    s[index_series >= hi] = -1.0
    s[index_series <= lo] = 1.0
    return s if contrarian else -s


def sig_zscore(z: pd.Series, cap: float = 2.0, contrarian: bool = True) -> pd.Series:
    s = z.clip(-cap, cap) / cap
    return (-s if contrarian else s).fillna(0.0)


# ======================================================================================
# 5. Tests prédictifs (HAC Newey-West pour rendements forward chevauchants)
# ======================================================================================
def hac_regression(x: pd.Series, y: pd.Series, horizon_weeks: int = 4) -> Dict[str, float]:
    import statsmodels.api as sm

    d = pd.concat([x, y], axis=1, keys=["x", "y"]).dropna()
    if len(d) < 40:
        return {"n": len(d)}
    d["xs"] = (d["x"] - d["x"].mean()) / d["x"].std()
    m = sm.OLS(d["y"], sm.add_constant(d["xs"])).fit(cov_type="HAC", cov_kwds={"maxlags": max(2 * horizon_weeks, 13)})
    return {"n": len(d), "beta_par_sigma": m.params["xs"], "t_HAC": m.tvalues["xs"], "p": m.pvalues["xs"], "R2": m.rsquared}


def rank_ic(x: pd.Series, y: pd.Series, horizon_weeks: int = 4) -> Dict[str, float]:
    d = pd.concat([x, y], axis=1, keys=["x", "y"]).dropna()
    if len(d) < 40:
        return {"n": len(d)}
    ic = stats.spearmanr(d["x"], d["y"])[0]
    n_eff = len(d) / max(horizon_weeks, 1)              # correction grossière du chevauchement
    t = ic * np.sqrt((n_eff - 2) / max(1 - ic ** 2, 1e-12))
    return {"n": len(d), "IC": ic, "t_approx": t, "p": 2 * (1 - stats.t.cdf(abs(t), max(n_eff - 2, 1)))}


def bucket_returns(x: pd.Series, y: pd.Series, q: int = 5) -> pd.DataFrame:
    d = pd.concat([x, y], axis=1, keys=["x", "y"]).dropna()
    d["bucket"] = pd.qcut(d["x"], q, labels=False, duplicates="drop") + 1
    g = d.groupby("bucket")["y"].agg(["mean", "std", "count"])
    g["hit_rate_>0"] = d.groupby("bucket")["y"].apply(lambda s: (s > 0).mean())
    return g


# ======================================================================================
# 6. Backtests
# ======================================================================================
def ewma_vol(ret: pd.Series, lam: float = 0.94, min_periods: int = 30) -> pd.Series:
    return np.sqrt((ret ** 2).ewm(alpha=1 - lam, min_periods=min_periods).mean()) * np.sqrt(TRADING_DAYS)


def backtest_time_series(px: pd.Series, signal: pd.Series, target_vol: float = 0.10, max_leverage: float = 3.0,
                         cost_bps: float = 1.5, exec_lag: int = 2, release_lag_days: int = 3) -> pd.DataFrame:
    """Un marché : position = signal × (vol cible / vol EWMA), coûts sur turnover.  Position(t) n'utilise que l'info ≤ t-exec_lag."""
    ret = px.pct_change().dropna()
    pos_sig = to_daily_position(signal, ret.index, exec_lag, release_lag_days)
    vol = ewma_vol(ret).shift(1)
    lev = (target_vol / vol).clip(upper=max_leverage)
    pos = (pos_sig * lev).fillna(0.0)
    gross = pos * ret
    cost = pos.diff().abs().fillna(0) * cost_bps / 1e4
    return pd.DataFrame({"ret": gross - cost, "gross": gross, "pos": pos})


def backtest_cross_section(prices: pd.DataFrame, signals: pd.DataFrame, target_vol: float = 0.10, cost_bps: float = 1.5,
                           exec_lag: int = 2, top_frac: float = 0.34, release_lag_days: int = 3) -> pd.DataFrame:
    """Portefeuille dollar-neutre : long le tercile de signal le plus haut, short le plus bas, poids égaux puis vol-targeting.
    `signals` : DataFrame (dates de rapport × marchés)."""
    ret = prices.pct_change().dropna(how="all")
    ranks = signals.rank(axis=1, pct=True)
    n = signals.shape[1]
    k = max(int(round(n * top_frac)), 1)
    w = pd.DataFrame(0.0, index=signals.index, columns=signals.columns)
    order = signals.rank(axis=1, method="first")
    w[order > (n - k)] = 1.0 / k
    w[order <= k] = -1.0 / k
    w[signals.isna().any(axis=1)] = 0.0
    wd = pd.DataFrame({c: to_daily_position(w[c], ret.index, exec_lag, release_lag_days) for c in w.columns}).fillna(0.0)
    gross = (wd * ret).sum(axis=1)
    lev = (target_vol / ewma_vol(gross.replace(0, np.nan).fillna(0)).shift(1)).clip(upper=4.0).fillna(0)
    net = gross * lev - (wd.diff().abs().sum(axis=1).fillna(0) * lev * cost_bps / 1e4)
    return pd.DataFrame({"ret": net, "gross": gross * lev})


# ======================================================================================
# 7. Prévision walk-forward (remplace le LSTM récursif du notebook d'origine)
# ======================================================================================
def walk_forward_forecast(X: pd.DataFrame, y: pd.Series, model: str = "ridge", min_train: int = 260, refit_every: int = 13,
                          embargo: int = 4, alpha: float = 50.0, seed: int = 0) -> pd.DataFrame:
    """Prévisions OOS strictes : entraînement expanding, purgé de `embargo` semaines (les cibles forward chevauchent).
    X, y : panels empilés possibles si l'index est un MultiIndex (date, marché) ; le découpage se fait sur la date."""
    from sklearn.ensemble import HistGradientBoostingRegressor
    from sklearn.linear_model import Ridge
    from sklearn.pipeline import make_pipeline
    from sklearn.preprocessing import StandardScaler

    d = pd.concat([X, y.rename("y")], axis=1).dropna()
    dates = d.index.get_level_values(0) if isinstance(d.index, pd.MultiIndex) else d.index
    udates = np.sort(dates.unique())
    preds = pd.Series(np.nan, index=d.index)
    bench = pd.Series(np.nan, index=d.index)
    for i in range(min_train, len(udates), refit_every):
        train_end = udates[max(i - embargo, 0)]
        tr = d[dates < train_end]
        te_mask = (dates >= udates[i]) & (dates < (udates[i + refit_every] if i + refit_every < len(udates) else udates[-1] + pd.Timedelta(days=1)))
        if tr.shape[0] < 100 or not te_mask.any():
            continue
        mdl = make_pipeline(StandardScaler(), Ridge(alpha=alpha)) if model == "ridge" else HistGradientBoostingRegressor(
            max_depth=3, learning_rate=0.05, max_iter=150, l2_regularization=5.0, random_state=seed)
        mdl.fit(tr.drop(columns="y"), tr["y"])
        preds[te_mask] = mdl.predict(d.loc[te_mask].drop(columns="y"))
        bench[te_mask] = tr["y"].mean()
    out = pd.DataFrame({"y": d["y"], "pred": preds, "bench": bench}).dropna()
    return out


def oos_r2(y, pred, bench) -> float:
    """R² hors-échantillon de Campbell-Thompson vs prévision naïve (moyenne historique). >0 = bat le benchmark."""
    y, pred, bench = map(np.asarray, (y, pred, bench))
    return 1 - np.sum((y - pred) ** 2) / np.sum((y - bench) ** 2)


def diebold_mariano(y, pred, bench, h: int = 4) -> Dict[str, float]:
    """H0 : même erreur quadratique que le benchmark.  Statistique HAC ; stat<0 => le modèle est meilleur."""
    y, pred, bench = map(np.asarray, (y, pred, bench))
    d = (y - pred) ** 2 - (y - bench) ** 2
    n = len(d)
    dm = d - d.mean()
    lrv = dm @ dm / n + 2 * sum((1 - k / (h + 1)) * (dm[k:] @ dm[:-k]) / n for k in range(1, h + 1))
    stat = d.mean() / np.sqrt(lrv / n)
    return {"DM": stat, "p": 2 * (1 - stats.norm.cdf(abs(stat)))}


def directional_accuracy(y, pred) -> Dict[str, float]:
    y, pred = np.asarray(y), np.asarray(pred)
    hit = (np.sign(y) == np.sign(pred)).sum()
    n = len(y)
    return {"accuracy": hit / n, "p_binomial_vs_50%": stats.binomtest(int(hit), n, 0.5).pvalue, "n": n}


# ======================================================================================
# 8. Robustesse statistique des backtests
# ======================================================================================
def sharpe(ret: pd.Series, periods: int = TRADING_DAYS) -> float:
    r = ret.dropna()
    return r.mean() / r.std() * np.sqrt(periods) if r.std() > 0 else np.nan


def stationary_bootstrap_sharpe(ret: pd.Series, n_boot: int = 2000, avg_block: int = 20, periods: int = TRADING_DAYS, seed: int = 0):
    """IC 95 % du Sharpe par bootstrap stationnaire (Politis-Romano) – préserve l'autocorrélation."""
    r = ret.dropna().values
    n = len(r)
    rng = np.random.default_rng(seed)
    jump = rng.random((n_boot, n)) < 1.0 / avg_block
    jump[:, 0] = True
    last = np.maximum.accumulate(np.where(jump, np.arange(n), 0), axis=1)          # position du dernier « saut »
    starts = rng.integers(0, n, (n_boot, n))
    idx = (np.take_along_axis(starts, last, axis=1) + (np.arange(n) - last)) % n     # blocs de longueur géométrique
    s = r[idx]
    out = s.mean(axis=1) / s.std(axis=1) * np.sqrt(periods)
    return np.percentile(out, [2.5, 50, 97.5])


def probabilistic_sharpe(sr: float, T: int, skew: float, kurt: float, sr_bench: float = 0.0) -> float:
    """PSR (Bailey & López de Prado) : P(SR vrai > SR benchmark). sr, sr_bench PAR PÉRIODE ; kurt non excédentaire."""
    denom = np.sqrt(1 - skew * sr + (kurt - 1) / 4 * sr ** 2)
    return float(stats.norm.cdf((sr - sr_bench) * np.sqrt(T - 1) / denom))


def deflated_sharpe(ret: pd.Series, n_trials: int, var_sr_trials: Optional[float] = None) -> Dict[str, float]:
    """DSR : corrige le Sharpe du meilleur de `n_trials` essais (sélection = biais d'optimisation)."""
    r = ret.dropna()
    T = len(r)
    sr = r.mean() / r.std()
    sk, ku = stats.skew(r), stats.kurtosis(r, fisher=False)
    v = var_sr_trials if var_sr_trials is not None else 1.0 / T          # variance du Sharpe estimé sous H0
    g = 0.5772156649
    sr_star = np.sqrt(v) * ((1 - g) * stats.norm.ppf(1 - 1.0 / n_trials) + g * stats.norm.ppf(1 - 1.0 / (n_trials * np.e)))
    return {"SR_annualisé": sr * np.sqrt(TRADING_DAYS), "SR*_seuil_annualisé": sr_star * np.sqrt(TRADING_DAYS),
            "PSR(0)": probabilistic_sharpe(sr, T, sk, ku, 0.0), "DSR": probabilistic_sharpe(sr, T, sk, ku, sr_star)}


# ======================================================================================
# 9. Univers synthétique COT + prix (validation du pipeline, avec « edge » injectable)
# ======================================================================================
def synthetic_cot_market(n_weeks: int = 700, edge: float = 0.0, seed: int = 0, ann_vol: float = 0.09,
                         end: Optional[str] = None) -> Tuple[pd.Series, pd.DataFrame]:
    """Prix journaliers + table TFF hebdomadaire synthétiques.
    * Les spéculateurs (lev. funds) suivent la tendance : net_lf(t) dépend des rendements passés (mécanisme réaliste).
    * Les dealers prennent l'autre côté.  * `edge` > 0 injecte un vrai contrarian : drift de la semaine suivante = −edge·z(net_lf)·σ_hebdo.
      edge=0 => AUCUNE prédictibilité : c'est la référence pour vérifier que le pipeline ne « trouve » rien."""
    rng = np.random.default_rng(seed)
    end_ts = pd.Timestamp(end) if end else pd.Timestamp.today().normalize()
    days = pd.bdate_range(end=end_ts, periods=n_weeks * 5 + 10)[-n_weeks * 5:]
    d_vol = ann_vol / np.sqrt(TRADING_DAYS)
    shocks = _garch_t(len(days), d_vol ** 2 * 0.02, 0.06, 0.92, 6.0, rng)
    ret = np.zeros(len(days))
    net = np.zeros(n_weeks)
    hist_net = []
    for w in range(n_weeks):
        sl = slice(w * 5, w * 5 + 5)
        past = ret[max(0, w * 5 - 65): w * 5].sum() if w > 0 else 0.0            # rendement ~13 semaines
        prev = net[w - 1] if w > 0 else 0.0
        net[w] = 0.85 * prev + 0.15 * np.tanh(past / (d_vol * np.sqrt(65)) / 2) * 0.35 + rng.normal(0, 0.012)  # en fraction d'OI
        hist_net.append(net[w])
        h = np.array(hist_net[-156:])
        z = (net[w] - h.mean()) / h.std() if h.size > 26 and h.std() > 0 else 0.0
        drift = -edge * np.clip(z, -3, 3) * d_vol / np.sqrt(1) * 0.35
        ret[sl] = shocks[sl] + drift
    px = pd.Series(100 * np.cumprod(1 + ret), index=days, name="px")
    # les positions COT du mardi w concernent la semaine w (calées sur le mardi de cette semaine, info connue le vendredi)
    tuesdays = pd.DatetimeIndex([days[w * 5 + 1] for w in range(n_weeks)])
    oi = 250_000 * (1 + 0.15 * np.sin(np.arange(n_weeks) / 30)) * np.exp(rng.normal(0, 0.02, n_weeks))
    dealer_net = -0.7 * net + rng.normal(0, 0.01, n_weeks)
    am_net = 0.25 * net + 0.05 * np.sin(np.arange(n_weeks) / 60) + rng.normal(0, 0.01, n_weeks)
    def legs(base, nt):
        return base + nt / 2, base - nt / 2
    ll, ls = legs(0.22, net); dl, ds = legs(0.33, dealer_net); al, as_ = legs(0.27, am_net)
    t = pd.DataFrame({"oi": oi, "lf_long": ll * oi, "lf_short": ls * oi, "dealer_long": dl * oi, "dealer_short": ds * oi,
                      "am_long": al * oi, "am_short": as_ * oi, "oth_long": 0.1 * oi, "oth_short": 0.1 * oi}, index=tuesdays)
    return px, t


def get_cot_universe(markets: Iterable[str] = ("EUR", "GBP", "JPY", "CHF", "AUD", "CAD", "NZD"), start_year: int = 2010,
                     end_year: Optional[int] = None, edge: float = 0.0, allow_synthetic: bool = True, seed: int = 11):
    """Retourne (prix USD par devise étrangère (DataFrame), dict{marché: table TFF}, meta). Réel si le réseau le permet,
    sinon univers synthétique (meta['source']='synthetic')."""
    markets = list(markets)
    end_year = end_year or pd.Timestamp.today().year
    try:
        from .data import load_prices
        raw = download_tff(start_year, end_year)
        px, meta = load_prices([FX_SPEC[m][1] for m in markets], start=f"{start_year}-01-01", allow_synthetic=False)
        if meta["source"] == "synthetic":
            raise RuntimeError
        for m in markets:
            if FX_SPEC[m][2]:
                px[FX_SPEC[m][1]] = 1.0 / px[FX_SPEC[m][1]]
        px.columns = markets
        return px, {m: tidy_tff(raw, FX_SPEC[m][0]) for m in markets}, {"source": "cftc+yfinance"}
    except Exception:
        if not allow_synthetic:
            raise
    n_weeks = (min(end_year, pd.Timestamp.today().year) - start_year + 1) * 52
    pxs, tabs = {}, {}
    for i, m in enumerate(markets):
        p, t = synthetic_cot_market(n_weeks, edge=edge, seed=seed + i, ann_vol=0.08 + 0.01 * (i % 4))
        pxs[m], tabs[m] = p, t
    return pd.DataFrame(pxs), tabs, {"source": "synthetic", "edge": edge}
