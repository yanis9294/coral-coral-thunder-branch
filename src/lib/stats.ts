/** Pure stats used by COT / VaR / Kelly. No look-ahead helpers live here. */

export const TRADING_DAYS = 252;

export function mean(xs: number[]): number {
  if (!xs.length) return 0;
  return xs.reduce((s, v) => s + v, 0) / xs.length;
}

export function variance(xs: number[], ddof = 1): number {
  if (xs.length <= ddof) return 0;
  const m = mean(xs);
  return xs.reduce((s, v) => s + (v - m) ** 2, 0) / (xs.length - ddof);
}

export function stdev(xs: number[], ddof = 1): number {
  return Math.sqrt(variance(xs, ddof));
}

export function quantile(xs: number[], q: number): number {
  if (!xs.length) return NaN;
  const a = [...xs].sort((x, y) => x - y);
  const p = Math.max(0, Math.min(1, q));
  const i = (a.length - 1) * p;
  const lo = Math.floor(i);
  const hi = Math.ceil(i);
  if (lo === hi) return a[lo]!;
  return a[lo]! * (hi - i) + a[hi]! * (i - lo);
}

export function skewness(xs: number[]): number {
  const n = xs.length;
  if (n < 3) return 0;
  const m = mean(xs);
  const s = stdev(xs, 1);
  if (s === 0) return 0;
  const m3 = xs.reduce((a, v) => a + (v - m) ** 3, 0) / n;
  return m3 / s ** 3;
}

/** Excess kurtosis (Fisher). Normal = 0. */
export function excessKurtosis(xs: number[]): number {
  const n = xs.length;
  if (n < 4) return 0;
  const m = mean(xs);
  const s = stdev(xs, 1);
  if (s === 0) return 0;
  const m4 = xs.reduce((a, v) => a + (v - m) ** 4, 0) / n;
  return m4 / s ** 4 - 3;
}

export function pearsonKurtosis(xs: number[]): number {
  return excessKurtosis(xs) + 3;
}

export function xlogy(x: number, y: number): number {
  if (x === 0) return 0;
  if (y <= 0) return -1e12;
  return x * Math.log(y);
}

export function normPdf(x: number): number {
  return Math.exp(-0.5 * x * x) / Math.sqrt(2 * Math.PI);
}

export function erf(x: number): number {
  const s = Math.sign(x);
  const a = Math.abs(x);
  const p = 0.3275911;
  const t = 1 / (1 + p * a);
  const c = [0.254829592, -0.284496736, 1.421413741, -1.453152027, 1.061405429];
  let tau = 0;
  let tp = t;
  for (let i = 0; i < c.length; i++) {
    tau += c[i]! * tp;
    tp *= t;
  }
  return s * (1 - tau * Math.exp(-a * a));
}

export function normCdf(x: number): number {
  return 0.5 * (1 + erf(x / Math.SQRT2));
}

/** Acklam inverse normal CDF. */
export function invNorm(p: number): number {
  if (p <= 0) return -8;
  if (p >= 1) return 8;
  const a = [
    -3.969683028665376e1, 2.209460984351305e2, -2.759285104469687e2, 1.383577459590407e2, -3.066479806614716e1,
    2.506628277459239e0,
  ];
  const b = [-5.447609879822406e1, 1.615858368580409e2, -1.556989798598866e2, 6.680131188771972e1, -1.328068155288572e1];
  const c = [
    -7.784894002430293e-3, -3.223964580411365e-1, -2.400758277161838, -2.549732539343734, 4.374664141464968,
    2.938163982698783,
  ];
  const d = [7.784695709041462e-3, 3.224671290700398e-1, 2.445134137142996, 3.754408661907416];
  const plow = 0.02425;
  const phigh = 1 - plow;
  let q: number;
  let r: number;
  if (p < plow) {
    q = Math.sqrt(-2 * Math.log(p));
    return (
      (((((c[0]! * q + c[1]!) * q + c[2]!) * q + c[3]!) * q + c[4]!) * q + c[5]!) /
      ((((d[0]! * q + d[1]!) * q + d[2]!) * q + d[3]!) * q + 1)
    );
  }
  if (p > phigh) {
    q = Math.sqrt(-2 * Math.log(1 - p));
    return (
      -(((((c[0]! * q + c[1]!) * q + c[2]!) * q + c[3]!) * q + c[4]!) * q + c[5]!) /
      ((((d[0]! * q + d[1]!) * q + d[2]!) * q + d[3]!) * q + 1)
    );
  }
  q = p - 0.5;
  r = q * q;
  return (
    ((((((a[0]! * r + a[1]!) * r + a[2]!) * r + a[3]!) * r + a[4]!) * r + a[5]!) * q) /
    (((((b[0]! * r + b[1]!) * r + b[2]!) * r + b[3]!) * r + b[4]!) * r + 1)
  );
}

export function chi2Cdf1(x: number): number {
  if (x <= 0) return 0;
  return erf(Math.sqrt(x / 2));
}

export function chi2Cdf2(x: number): number {
  if (x <= 0) return 0;
  return 1 - Math.exp(-x / 2);
}

export function rollingMin(xs: number[], n: number, minP?: number): number[] {
  const mp = minP ?? Math.floor(n / 2);
  const out = new Array<number>(xs.length).fill(NaN);
  for (let i = 0; i < xs.length; i++) {
    const start = Math.max(0, i - n + 1);
    const w = xs.slice(start, i + 1);
    if (w.length < mp) continue;
    out[i] = Math.min(...w);
  }
  return out;
}

export function rollingMax(xs: number[], n: number, minP?: number): number[] {
  const mp = minP ?? Math.floor(n / 2);
  const out = new Array<number>(xs.length).fill(NaN);
  for (let i = 0; i < xs.length; i++) {
    const start = Math.max(0, i - n + 1);
    const w = xs.slice(start, i + 1);
    if (w.length < mp) continue;
    out[i] = Math.max(...w);
  }
  return out;
}

export function rollingMean(xs: number[], n: number, minP?: number): number[] {
  const mp = minP ?? Math.floor(n / 2);
  const out = new Array<number>(xs.length).fill(NaN);
  let s = 0;
  for (let i = 0; i < xs.length; i++) {
    s += xs[i]!;
    if (i >= n) s -= xs[i - n]!;
    const len = Math.min(i + 1, n);
    if (len >= mp) out[i] = s / len;
  }
  return out;
}

export function rollingStd(xs: number[], n: number, minP?: number): number[] {
  const mp = minP ?? Math.floor(n / 2);
  const out = new Array<number>(xs.length).fill(NaN);
  for (let i = 0; i < xs.length; i++) {
    const start = Math.max(0, i - n + 1);
    const w = xs.slice(start, i + 1);
    if (w.length < mp) continue;
    out[i] = stdev(w, 1);
  }
  return out;
}

export function covMatrix(cols: number[][]): number[][] {
  const k = cols.length;
  const n = cols[0]?.length ?? 0;
  const means = cols.map(mean);
  const C = Array.from({ length: k }, () => new Array<number>(k).fill(0));
  for (let i = 0; i < k; i++) {
    for (let j = i; j < k; j++) {
      let s = 0;
      for (let t = 0; t < n; t++) s += (cols[i]![t]! - means[i]!) * (cols[j]![t]! - means[j]!);
      const v = s / Math.max(1, n - 1);
      C[i]![j] = v;
      C[j]![i] = v;
    }
  }
  return C;
}

export function solveLinear(A: number[][], b: number[]): number[] {
  const n = b.length;
  const M = A.map((row, i) => [...row, b[i]!]);
  for (let i = 0; i < n; i++) {
    let piv = i;
    for (let r = i + 1; r < n; r++) if (Math.abs(M[r]![i]!) > Math.abs(M[piv]![i]!)) piv = r;
    [M[i], M[piv]] = [M[piv]!, M[i]!];
    const d = M[i]![i]!;
    if (Math.abs(d) < 1e-14) continue;
    for (let c = i; c <= n; c++) M[i]![c]! /= d;
    for (let r = 0; r < n; r++) {
      if (r === i) continue;
      const f = M[r]![i]!;
      for (let c = i; c <= n; c++) M[r]![c]! -= f * M[i]![c]!;
    }
  }
  return M.map((row) => row[n]!);
}

export function randn(rng: () => number): number {
  const u = Math.max(1e-12, rng());
  const v = Math.max(1e-12, rng());
  return Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * v);
}

export function studentT(rng: () => number, df: number): number {
  let chi = 0;
  const k = Math.max(2, Math.round(df));
  for (let i = 0; i < k; i++) {
    const z = randn(rng);
    chi += z * z;
  }
  return randn(rng) / Math.sqrt(chi / k);
}

export function garchT(
  n: number,
  omega: number,
  alpha: number,
  beta: number,
  df: number,
  rng: () => number,
): number[] {
  const z: number[] = [];
  const scale = Math.sqrt(df / (df - 2));
  for (let i = 0; i < n; i++) z.push(studentT(rng, df) / scale);
  const h = new Array<number>(n);
  const r = new Array<number>(n);
  h[0] = omega / Math.max(1e-8, 1 - alpha - beta);
  for (let t = 0; t < n; t++) {
    if (t > 0) h[t] = omega + alpha * r[t - 1]! ** 2 + beta * h[t - 1]!;
    r[t] = Math.sqrt(Math.max(h[t]!, 1e-16)) * z[t]!;
  }
  return r;
}

export function goldenMin(fn: (x: number) => number, lo: number, hi: number, steps = 48): number {
  const phi = (1 + Math.sqrt(5)) / 2;
  let a = lo;
  let b = hi;
  let c = b - (b - a) / phi;
  let d = a + (b - a) / phi;
  for (let i = 0; i < steps; i++) {
    if (fn(c) < fn(d)) b = d;
    else a = c;
    c = b - (b - a) / phi;
    d = a + (b - a) / phi;
  }
  return (a + b) / 2;
}
