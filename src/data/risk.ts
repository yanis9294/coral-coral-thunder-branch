/**
 * Port of quantdesk/risk.py + kelly.py (static estimators, EWMA, Kupiec, Basel, Kelly).
 * GARCH-FHS (arch) is omitted in-browser; EWMA is the conditional-vol engine.
 */
import { hashStr, mulberry32 } from "@/lib/utils";
import {
  chi2Cdf1,
  chi2Cdf2,
  covMatrix,
  excessKurtosis,
  garchT,
  goldenMin,
  invNorm,
  mean,
  normPdf,
  quantile,
  randn,
  skewness,
  solveLinear,
  stdev,
  TRADING_DAYS,
  xlogy,
} from "@/lib/stats";

export const RISK_ASSETS = ["SPX", "NDX", "XAU", "WTI", "TLT", "EURUSD"] as const;
export type RiskAsset = (typeof RISK_ASSETS)[number];

export const DEFAULT_WEIGHTS: Record<RiskAsset, number> = {
  SPX: 0.35,
  NDX: 0.15,
  XAU: 0.1,
  WTI: 0.1,
  TLT: 0.2,
  EURUSD: 0.1,
};

const MU: Record<RiskAsset, number> = {
  SPX: 0.09,
  NDX: 0.11,
  XAU: 0.06,
  WTI: 0.04,
  TLT: 0.03,
  EURUSD: 0.01,
};
const VOL: Record<RiskAsset, number> = {
  SPX: 0.16,
  NDX: 0.22,
  XAU: 0.14,
  WTI: 0.32,
  TLT: 0.12,
  EURUSD: 0.08,
};

export interface VarEs {
  method: string;
  VaR: number;
  ES: number;
  extra?: Record<string, number | boolean>;
}

function clean(r: number[]) {
  return r.filter((x) => Number.isFinite(x));
}

export function histVarEs(r: number[], alpha = 0.99): VarEs {
  const x = clean(r);
  const q = quantile(x, 1 - alpha);
  const tail = x.filter((v) => v <= q);
  return { method: "hist", VaR: -q, ES: tail.length ? -mean(tail) : -q };
}

export function normalVarEs(r: number[], alpha = 0.99): VarEs {
  const x = clean(r);
  const mu = mean(x);
  const sigma = stdev(x, 1);
  const z = invNorm(alpha);
  return {
    method: "normal",
    VaR: -mu + sigma * z,
    ES: -mu + (sigma * normPdf(z)) / (1 - alpha),
  };
}

export function studentTVarEs(r: number[], alpha = 0.99): VarEs {
  const x = clean(r);
  const mu = mean(x);
  const s = stdev(x, 1);
  const k = Math.max(0.2, excessKurtosis(x));
  const nu = Math.max(4.2, Math.min(30, 6 / k + 4));
  const scale = s * Math.sqrt((nu - 2) / nu);
  const z = invNorm(alpha);
  const q = z * Math.sqrt((nu - 2) / nu) * (1 + ((z * z + 1) * 0.25) / nu);
  const pdf = normPdf(q);
  const esStd = (pdf / (1 - alpha)) * ((nu + q * q) / (nu - 1));
  return { method: "student-t", VaR: -mu + scale * Math.abs(q) * Math.sign(q) + 0, ES: -mu + scale * esStd, extra: { nu } };
}

function cfQuantile(z: number, skew: number, exk: number) {
  return z + ((z * z - 1) * skew) / 6 + ((z ** 3 - 3 * z) * exk) / 24 - ((2 * z ** 3 - 5 * z) * skew * skew) / 36;
}

export function cornishFisherVarEs(r: number[], alpha = 0.99): VarEs {
  const x = clean(r);
  const mu = mean(x);
  const sd = stdev(x, 1);
  const sk = skewness(x);
  const k = excessKurtosis(x);
  const n = 400;
  const zq: number[] = [];
  for (let i = 0; i < n; i++) {
    const u = 1e-6 + ((1 - alpha - 1e-6) * i) / (n - 1);
    zq.push(cfQuantile(invNorm(u), sk, k));
  }
  let valid = true;
  for (let i = 1; i < zq.length; i++) if (zq[i]! < zq[i - 1]!) valid = false;
  const za = cfQuantile(invNorm(1 - alpha), sk, k);
  return {
    method: "cornish-fisher",
    VaR: -(mu + sd * za),
    ES: -(mu + sd * mean(zq)),
    extra: { valid },
  };
}

export function evtPotVarEs(r: number[], alpha = 0.99, thresholdQ = 0.95): VarEs {
  const losses = clean(r).map((v) => -v);
  const n = losses.length;
  const u = quantile(losses, thresholdQ);
  const exc = losses.filter((v) => v > u).map((v) => v - u);
  if (exc.length < 20) return { method: "evt-pot", VaR: NaN, ES: NaN, extra: { xi: NaN, beta: NaN } };
  const e = mean(exc);
  const v = Math.max(1e-12, stdev(exc, 1) ** 2);
  let xi = 0.5 * (1 - (e * e) / v);
  xi = Math.max(-0.4, Math.min(0.6, xi));
  const beta = Math.max(1e-8, 0.5 * e * (1 + (e * e) / v));
  const pExc = exc.length / n;
  const VaR =
    Math.abs(xi) < 1e-8
      ? u + beta * Math.log(pExc / (1 - alpha))
      : u + (beta / xi) * ((pExc / (1 - alpha)) ** xi - 1);
  const ES = xi < 1 ? VaR / (1 - xi) + (beta - xi * u) / (1 - xi) : NaN;
  return { method: "evt-pot", VaR, ES, extra: { xi, beta } };
}

export function ewmaVarEs(r: number[], alpha = 0.99, lam = 0.94): VarEs {
  const x = clean(r);
  let v = variance0(x.slice(0, 30));
  for (let t = 1; t < x.length; t++) v = lam * v + (1 - lam) * x[t - 1]! ** 2;
  const sig = Math.sqrt(v);
  const z = invNorm(alpha);
  return {
    method: "ewma",
    VaR: sig * z,
    ES: (sig * normPdf(z)) / (1 - alpha),
    extra: { sigma: sig },
  };
}

function variance0(xs: number[]) {
  return Math.max(1e-12, xs.reduce((s, v) => s + v * v, 0) / Math.max(1, xs.length));
}

export function allVarEs(r: number[], alpha = 0.99): VarEs[] {
  return [histVarEs(r, alpha), normalVarEs(r, alpha), studentTVarEs(r, alpha), cornishFisherVarEs(r, alpha), evtPotVarEs(r, alpha), ewmaVarEs(r, alpha)];
}

export function kupiecPof(hits: number[], alpha = 0.99) {
  const T = hits.length;
  const x = hits.reduce((s, h) => s + h, 0);
  const p = 1 - alpha;
  const phat = x / T;
  const ll0 = xlogy(T - x, 1 - p) + xlogy(x, p);
  const ll1 = xlogy(T - x, 1 - phat) + xlogy(x, phat);
  const lr = -2 * (ll0 - ll1);
  return { exceptions: x, expected: T * p, rate: phat, LR: lr, p: 1 - chi2Cdf1(Math.max(lr, 0)) };
}

export function christoffersenIndependence(hits: number[]) {
  let n00 = 0, n01 = 0, n10 = 0, n11 = 0;
  for (let i = 1; i < hits.length; i++) {
    const a = hits[i - 1]!;
    const b = hits[i]!;
    if (a === 0 && b === 0) n00++;
    else if (a === 0 && b === 1) n01++;
    else if (a === 1 && b === 0) n10++;
    else n11++;
  }
  const pi01 = n01 / Math.max(n00 + n01, 1);
  const pi11 = n11 / Math.max(n10 + n11, 1);
  const pi = (n01 + n11) / Math.max(n00 + n01 + n10 + n11, 1);
  const ll0 = xlogy(n00 + n10, 1 - pi) + xlogy(n01 + n11, pi);
  const ll1 = xlogy(n00, 1 - pi01) + xlogy(n01, pi01) + xlogy(n10, 1 - pi11) + xlogy(n11, pi11);
  const lr = Math.max(-2 * (ll0 - ll1), 0);
  return { LR: lr, p: 1 - chi2Cdf1(lr), n11 };
}

export function baselTrafficLight(exceptions: number, T = 250, alpha = 0.99) {
  const p = 1 - alpha;
  let cdf = 0;
  let term = (1 - p) ** T;
  for (let k = 0; k <= exceptions; k++) {
    cdf += term;
    term *= ((T - k) / (k + 1)) * (p / (1 - p));
  }
  const zone = cdf < 0.95 ? "green" : cdf < 0.9999 ? "yellow" : "red";
  const addon = ({ 5: 0.4, 6: 0.5, 7: 0.65, 8: 0.75, 9: 0.85 } as Record<number, number>)[exceptions] ?? (exceptions < 5 ? 0 : 1);
  return { zone, cdf, addon };
}

export function rollingHistBacktest(r: number[], alpha = 0.99, window = 500) {
  const hits: number[] = [];
  const vars: { t: number; ret: number; VaR: number }[] = [];
  for (let t = window; t < r.length; t++) {
    const est = histVarEs(r.slice(t - window, t), alpha);
    const hit = r[t]! < -est.VaR ? 1 : 0;
    hits.push(hit);
    if (t % 4 === 0) vars.push({ t, ret: r[t]!, VaR: est.VaR });
  }
  const k = kupiecPof(hits, alpha);
  const c = christoffersenIndependence(hits);
  const last = hits.slice(-250);
  const tl = baselTrafficLight(last.reduce((s, h) => s + h, 0), last.length, alpha);
  const lrCc = k.LR + c.LR;
  return {
    n: hits.length,
    hits,
    vars,
    kupiec: k,
    christoffersen: c,
    pCC: 1 - chi2Cdf2(Math.max(lrCc, 0)),
    basel: tl,
  };
}

export function kellyBinary(p: number, win: number, loss = 1) {
  return p / loss - (1 - p) / win;
}

export function kellyContinuous(mu: number, sigma2: number, r = 0) {
  return (mu - r) / sigma2;
}

export function growthRate(f: number, mu: number, sigma2: number, r = 0) {
  return r + f * (mu - r) - 0.5 * f * f * sigma2;
}

export function kellyFromTrades(pnl: number[]) {
  const x = pnl.filter(Number.isFinite);
  const wins = x.filter((v) => v > 0);
  const losses = x.filter((v) => v < 0).map((v) => -v);
  if (!wins.length || !losses.length) return { f_kelly: NaN, win_rate: NaN, payoff_ratio: NaN, n: x.length };
  const W = wins.length / (wins.length + losses.length);
  return {
    win_rate: W,
    payoff_ratio: mean(wins) / mean(losses),
    f_kelly: kellyBinary(W, mean(wins), mean(losses)),
    n: x.length,
  };
}

export function kellyEmpirical(returns: number[], r = 0, fMax = 8) {
  const x = returns.filter(Number.isFinite);
  const fn = (f: number) => {
    let s = 0;
    for (const R of x) {
      const w = 1 + r + f * (R - r);
      if (w <= 0) return 1e9;
      s += Math.log(w);
    }
    return -s / x.length;
  };
  return goldenMin(fn, -fMax, fMax);
}

export function bayesShrinkMu(muExcess: number, sigma: number, nObs: number, tau = 0.4, periods = TRADING_DAYS) {
  const years = nObs / periods;
  const srHat = (muExcess * periods) / (sigma * Math.sqrt(periods));
  const postVarSr = 1 / (1 / tau ** 2 + years);
  const postSr = postVarSr * years * srHat;
  const muPost = (postSr * sigma * Math.sqrt(periods)) / periods;
  return { muPost, postVarSr };
}

export function kellyMulti(mu: number[], cov: number[][], r = 0) {
  const ex = mu.map((m) => m - r);
  return solveLinear(cov, ex);
}

export function probDrawdown(c: number, x = 0.5) {
  return Math.min(1, x ** (2 / c - 1));
}

export function fractionForDrawdown(x: number, beta: number) {
  return 2 / (1 + Math.log(beta) / Math.log(x));
}

export function positionSize(capital: number, riskBudget: number, esDaily: number) {
  return capital * riskBudget / esDaily;
}

export function scaleHorizonSqrt(x: number, h: number) {
  return x * Math.sqrt(h);
}

export function parametricDecomp(w: number[], cov: number[][], names: string[], alpha = 0.99) {
  const k = w.length;
  let sp2 = 0;
  for (let i = 0; i < k; i++) for (let j = 0; j < k; j++) sp2 += w[i]! * cov[i]![j]! * w[j]!;
  const sp = Math.sqrt(Math.max(sp2, 1e-16));
  const z = invNorm(alpha);
  const mvar = new Array<number>(k).fill(0);
  for (let i = 0; i < k; i++) {
    let cw = 0;
    for (let j = 0; j < k; j++) cw += cov[i]![j]! * w[j]!;
    mvar[i] = (z * cw) / sp;
  }
  const cvar = mvar.map((m, i) => w[i]! * m);
  const kk = normPdf(z) / (1 - alpha) / z;
  const sum = cvar.reduce((s, v) => s + v, 0);
  return names.map((n, i) => ({
    name: n,
    weight: w[i]!,
    mVaR: mvar[i]!,
    cVaR: cvar[i]!,
    cES: cvar[i]! * kk,
    pct: (cvar[i]! / sum) * 100,
  }));
}

export const STRESS: { id: string; name: string; shock: Record<RiskAsset, number> }[] = [
  { id: "gfc", name: "GFC week (scaled)", shock: { SPX: -0.18, NDX: -0.2, XAU: 0.06, WTI: -0.12, TLT: 0.04, EURUSD: -0.04 } },
  { id: "covid", name: "COVID Mar-2020 week", shock: { SPX: -0.15, NDX: -0.13, XAU: 0.02, WTI: -0.25, TLT: 0.05, EURUSD: -0.02 } },
  { id: "v22", name: "2022 vol / QT", shock: { SPX: -0.08, NDX: -0.12, XAU: -0.03, WTI: 0.04, TLT: -0.1, EURUSD: -0.03 } },
  { id: "hormuz", name: "Hormuz disruption", shock: { SPX: -0.06, NDX: -0.07, XAU: 0.04, WTI: 0.18, TLT: 0.02, EURUSD: -0.01 } },
  { id: "usd", name: "USD squeeze", shock: { SPX: -0.04, NDX: -0.05, XAU: -0.05, WTI: -0.03, TLT: -0.02, EURUSD: -0.04 } },
];

export function stressPnl(w: Record<RiskAsset, number>) {
  return STRESS.map((s) => {
    let pnl = 0;
    for (const a of RISK_ASSETS) pnl += (w[a] ?? 0) * s.shock[a];
    return { ...s, pnl };
  });
}

let RET_CACHE: { ret: Record<RiskAsset, number[]>; port: number[]; dates: number[] } | null = null;

export function syntheticBook(n = 1260, seed = 7, end = Date.parse("2026-09-18T00:00:00Z")) {
  if (RET_CACHE) return RET_CACHE;
  const rng = mulberry32(seed);
  const dVol = 0.16 / Math.sqrt(TRADING_DAYS);
  const f = garchT(n, dVol ** 2 * (1 - 0.07 - 0.91), 0.07, 0.91, 8, rng);
  const ret = {} as Record<RiskAsset, number[]>;
  for (const a of RISK_ASSETS) {
    const beta = 0.5 + rng() * 0.7;
    const idio = (VOL[a]! / Math.sqrt(TRADING_DAYS)) * (0.5 + rng() * 0.5);
    const eps = garchT(n, idio ** 2 * (1 - 0.06 - 0.92), 0.06, 0.92, 8, rng);
    const mu = MU[a]! / TRADING_DAYS;
    const raw = f.map((v, i) => beta * v + eps[i]!);
    const m = mean(raw);
    const sd = stdev(raw, 1) || 1;
    const target = VOL[a]! / Math.sqrt(TRADING_DAYS);
    ret[a] = raw.map((v) => mu + ((v - m) / sd) * target);
  }
  const dates: number[] = [];
  let t = end;
  const seq: number[] = [];
  while (seq.length < n) {
    const d = new Date(t);
    const wd = d.getUTCDay();
    if (wd !== 0 && wd !== 6) seq.push(t);
    t -= 86_400_000;
  }
  dates.push(...seq.reverse());
  RET_CACHE = { ret, port: [], dates };
  return RET_CACHE;
}

export function portfolioReturns(w: Record<RiskAsset, number>) {
  const book = syntheticBook();
  const port: number[] = [];
  const n = book.dates.length;
  for (let i = 0; i < n; i++) {
    let r = 0;
    for (const a of RISK_ASSETS) r += (w[a] ?? 0) * book.ret[a]![i]!;
    port.push(r);
  }
  return { port, dates: book.dates, ret: book.ret };
}

export function riskSnapshot(w: Record<RiskAsset, number>, alpha = 0.99, capital = 10_000_000, budget = 0.01) {
  const { port, ret } = portfolioReturns(w);
  const methods = allVarEs(port, alpha);
  const hist = methods.find((m) => m.method === "hist")!;
  const bt = rollingHistBacktest(port, alpha, 500);
  const cols = RISK_ASSETS.map((a) => ret[a]!);
  const cov = covMatrix(cols);
  const wv = RISK_ASSETS.map((a) => w[a] ?? 0);
  const decomp = parametricDecomp(wv, cov, [...RISK_ASSETS], alpha);
  const muD = mean(port);
  const s2 = varianceDaily(port);
  const fStar = kellyContinuous(muD, s2);
  const fEmp = kellyEmpirical(port);
  const shrunk = bayesShrinkMu(muD, Math.sqrt(s2), port.length);
  const fBayes = kellyContinuous(shrunk.muPost, s2);
  const trades = port.map((r) => r * 10);
  const fromTrades = kellyFromTrades(trades);
  const es = hist.ES;
  const size = positionSize(capital, budget, es);
  const fractions = [0.25, 0.5, 1, 1.5];
  const dd = fractions.map((c) => ({
    c,
    f: c * fStar,
    p50: probDrawdown(c, 0.5),
    g: growthRate(c * fStar, muD * TRADING_DAYS, s2 * TRADING_DAYS),
  }));
  return {
    methods,
    bt,
    decomp,
    stress: stressPnl(w),
    kelly: { fStar, fEmp, fBayes, fromTrades, dd, muD, s2 },
    size,
    volAnn: Math.sqrt(s2 * TRADING_DAYS),
    sharpe: (muD / Math.sqrt(s2)) * Math.sqrt(TRADING_DAYS),
    hist,
    port,
  };
}

function varianceDaily(xs: number[]) {
  const m = mean(xs);
  return xs.reduce((s, v) => s + (v - m) ** 2, 0) / Math.max(1, xs.length - 1);
}

export function wealthPath(port: number[], f = 1) {
  let w = 1;
  return port.slice(-252).map((r, i) => {
    w *= 1 + f * r;
    return { d: i, v: w };
  });
}

void hashStr;
void randn;
