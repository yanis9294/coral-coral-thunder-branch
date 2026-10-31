/**
 * Port of vendor/invest/portfolio_optimization.py
 * Monte Carlo frontier, max-Sharpe / min-vol on the simplex, equal-weight,
 * walk-forward (no look-ahead), backtest metrics. No scipy/cvxpy/PyPortfolioOpt.
 */
import { TRADING_DAYS, mean, stdev } from "@/lib/stats";

export function pctReturns(prices: number[][]): number[][] {
  const n = prices[0]?.length ?? 0;
  const k = prices.length;
  const out: number[][] = Array.from({ length: k }, () => []);
  for (let t = 1; t < n; t++) {
    for (let i = 0; i < k; i++) {
      const a = prices[i]![t - 1]!;
      const b = prices[i]![t]!;
      out[i]!.push(a > 0 && b > 0 ? b / a - 1 : 0);
    }
  }
  return out;
}

export function annStats(rets: number[][]) {
  const k = rets.length;
  const n = rets[0]?.length ?? 0;
  const avg = rets.map((r) => mean(r) * TRADING_DAYS);
  const cov: number[][] = Array.from({ length: k }, () => new Array<number>(k).fill(0));
  const mu = rets.map(mean);
  for (let i = 0; i < k; i++) {
    for (let j = i; j < k; j++) {
      let s = 0;
      for (let t = 0; t < n; t++) s += (rets[i]![t]! - mu[i]!) * (rets[j]![t]! - mu[j]!);
      const v = (s / Math.max(1, n - 1)) * TRADING_DAYS;
      cov[i]![j] = v;
      cov[j]![i] = v;
    }
  }
  return { avg, cov, n };
}

export function portRet(w: number[], avg: number[]) {
  return w.reduce((s, x, i) => s + x * avg[i]!, 0);
}

export function portVol(w: number[], cov: number[][]) {
  let s = 0;
  for (let i = 0; i < w.length; i++) for (let j = 0; j < w.length; j++) s += w[i]! * w[j]! * cov[i]![j]!;
  return Math.sqrt(Math.max(0, s));
}

function simplex(rng: () => number, k: number): number[] {
  const x = Array.from({ length: k }, () => -Math.log(Math.max(1e-12, rng())));
  const s = x.reduce((a, b) => a + b, 0);
  return x.map((v) => v / s);
}

export function monteCarlo(
  avg: number[],
  cov: number[][],
  n = 4000,
  rf = 0,
  seed = 42,
): { rows: { ret: number; vol: number; sharpe: number }[]; weights: number[][] } {
  let a = seed >>> 0;
  const rng = () => {
    a += 0x6d2b79f5;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
  const rows: { ret: number; vol: number; sharpe: number }[] = [];
  const weights: number[][] = [];
  for (let i = 0; i < n; i++) {
    const w = simplex(rng, avg.length);
    const r = portRet(w, avg);
    const v = portVol(w, cov);
    rows.push({ ret: r, vol: v, sharpe: v > 0 ? (r - rf) / v : 0 });
    weights.push(w);
  }
  return { rows, weights };
}

export function bestSharpe(mc: ReturnType<typeof monteCarlo>) {
  let i = 0;
  for (let k = 1; k < mc.rows.length; k++) if (mc.rows[k]!.sharpe > mc.rows[i]!.sharpe) i = k;
  return { i, ...mc.rows[i]!, w: mc.weights[i]! };
}

export function minVol(mc: ReturnType<typeof monteCarlo>) {
  let i = 0;
  for (let k = 1; k < mc.rows.length; k++) if (mc.rows[k]!.vol < mc.rows[i]!.vol) i = k;
  return { i, ...mc.rows[i]!, w: mc.weights[i]! };
}

export function equalWeight(k: number) {
  return Array.from({ length: k }, () => 1 / k);
}

export function backtestMetrics(rets: number[], rf = 0) {
  const n = rets.length;
  if (!n) return { cagr: NaN, vol: NaN, sharpe: NaN, sortino: NaN, maxDd: NaN, calmar: NaN };
  let wealth = 1;
  let peak = 1;
  let maxDd = 0;
  const path: number[] = [];
  for (const r of rets) {
    wealth *= 1 + r;
    peak = Math.max(peak, wealth);
    maxDd = Math.min(maxDd, wealth / peak - 1);
    path.push(wealth);
  }
  const years = n / TRADING_DAYS;
  const cagr_ = years > 0 ? path[path.length - 1]! ** (1 / years) - 1 : NaN;
  const vol = stdev(rets) * Math.sqrt(TRADING_DAYS);
  const sharpe = vol ? (mean(rets) * TRADING_DAYS - rf) / vol : NaN;
  const down = rets.filter((r) => r < 0);
  const dvol = down.length ? stdev(down) * Math.sqrt(TRADING_DAYS) : NaN;
  const sortino = dvol ? (mean(rets) * TRADING_DAYS - rf) / dvol : NaN;
  const calmar = maxDd ? cagr_ / Math.abs(maxDd) : NaN;
  return { cagr: cagr_, vol, sharpe, sortino, maxDd, calmar, path };
}

/** Walk-forward: optimize on the trailing window only, hold until next rebalance. */
export function walkForward(
  rets: number[][],
  lookback = TRADING_DAYS,
  every = 21,
  rf = 0,
): number[] {
  const n = rets[0]?.length ?? 0;
  const k = rets.length;
  const out: number[] = [];
  let w = equalWeight(k);
  for (let t = lookback; t < n; t++) {
    if ((t - lookback) % every === 0) {
      const window = rets.map((r) => r.slice(t - lookback, t));
      const { avg, cov } = annStats(window);
      const mc = monteCarlo(avg, cov, 1200, rf, t);
      w = bestSharpe(mc).w;
    }
    out.push(w.reduce((s, x, i) => s + x * rets[i]![t]!, 0));
  }
  return out;
}

export function alignedCloses(series: { t: number; v: number }[][]): { t: number; px: number[] }[] {
  if (!series.length) return [];
  const maps = series.map((s) => {
    const m = new Map<string, number>();
    for (const p of s) m.set(new Date(p.t).toISOString().slice(0, 10), p.v);
    return m;
  });
  const keys = [...maps[0]!.keys()].filter((d) => maps.every((m) => m.has(d) && (m.get(d) ?? 0) > 0)).sort();
  return keys.map((d) => ({
    t: Date.parse(d + "T00:00:00Z"),
    px: maps.map((m) => m.get(d)!),
  }));
}
