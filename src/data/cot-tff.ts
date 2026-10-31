/**
 * TypeScript port of quantdesk/cot.py (TFF features, no-lookahead timing, signals).
 * Sandbox has no CFTC feed — markets are the synthetic generator from synthetic_cot_market().
 */
import { hashStr, mulberry32 } from "@/lib/utils";
import { garchT, rollingMax, rollingMean, rollingMin, rollingStd, TRADING_DAYS } from "@/lib/stats";

export const RELEASE_LAG_DAYS = 3;
export const DEFAULT_EXEC_LAG = 2;
export const IDX_WINDOW = 156;
export const Z_WINDOW = 156;

export const FX_SPEC: Record<string, { invert: boolean; cls: string }> = {
  EUR: { invert: false, cls: "Forex" },
  GBP: { invert: false, cls: "Forex" },
  AUD: { invert: false, cls: "Forex" },
  NZD: { invert: false, cls: "Forex" },
  JPY: { invert: true, cls: "Forex" },
  CAD: { invert: true, cls: "Forex" },
  CHF: { invert: true, cls: "Forex" },
  MXN: { invert: true, cls: "Forex" },
};

export interface TffWeek {
  date: number;
  oi: number;
  lf_long: number;
  lf_short: number;
  dealer_long: number;
  dealer_short: number;
  am_long: number;
  am_short: number;
  oth_long: number;
  oth_short: number;
}

export interface CotFeature {
  date: number;
  net_lf: number;
  net_dealer: number;
  net_am: number;
  net_oth: number;
  net_cot: number;
  gross_lf: number;
  idx_lf: number;
  idx_dealer: number;
  idx_am: number;
  idx_cot: number;
  z_lf: number;
  z_dealer: number;
  z_am: number;
  z_cot: number;
  d4_lf: number;
  d13_lf: number;
  d4_cot: number;
  d13_cot: number;
  lf_am_div: number;
}

export interface CotSignalRow {
  market: string;
  cls: string;
  last: CotFeature;
  extreme: string;
  sig: number;
  px: number;
  source: "synthetic";
  reportTue: number;
  publishFri: number;
  tradable: number;
}

function rngFrom(seed: number) {
  return mulberry32(seed >>> 0);
}

/** Port of quantdesk.cot.synthetic_cot_market */
export function syntheticCotMarket(
  nWeeks = 520,
  edge = 0.12,
  seed = 11,
  annVol = 0.09,
  endTs = Date.parse("2026-09-15T00:00:00Z"),
): { px: { t: number; v: number }[]; tff: TffWeek[] } {
  const rng = rngFrom(seed);
  const nDays = nWeeks * 5;
  const dVol = annVol / Math.sqrt(TRADING_DAYS);
  const shocks = garchT(nDays, dVol ** 2 * 0.02, 0.06, 0.92, 6, rng);
  const ret = new Array<number>(nDays).fill(0);
  const net = new Array<number>(nWeeks).fill(0);
  const histNet: number[] = [];
  for (let w = 0; w < nWeeks; w++) {
    const past = w > 0 ? ret.slice(Math.max(0, w * 5 - 65), w * 5).reduce((s, x) => s + x, 0) : 0;
    const prev = w > 0 ? net[w - 1]! : 0;
    net[w] =
      0.85 * prev +
      0.15 * Math.tanh(past / (dVol * Math.sqrt(65)) / 2) * 0.35 +
      (rng() - 0.5) * 0.024;
    histNet.push(net[w]!);
    const h = histNet.slice(-156);
    const m = h.reduce((s, x) => s + x, 0) / h.length;
    const sd = Math.sqrt(h.reduce((s, x) => s + (x - m) ** 2, 0) / Math.max(1, h.length - 1));
    const z = h.length > 26 && sd > 0 ? (net[w]! - m) / sd : 0;
    const drift = -edge * Math.max(-3, Math.min(3, z)) * dVol * 0.35;
    for (let k = 0; k < 5; k++) ret[w * 5 + k] = shocks[w * 5 + k]! + drift;
  }
  const tues0 = tuesdayOnOrBefore(endTs);
  const firstTue = tues0 - (nWeeks - 1) * 7 * 86_400_000;
  const pxSeries: { t: number; v: number }[] = [];
  let px = 100;
  for (let w = 0; w < nWeeks; w++) {
    const tue = firstTue + w * 7 * 86_400_000;
    for (let k = 0; k < 5; k++) {
      const t = tue - 86_400_000 + k * 86_400_000;
      px *= 1 + ret[w * 5 + k]!;
      pxSeries.push({ t, v: px });
    }
  }
  const tff: TffWeek[] = [];
  for (let w = 0; w < nWeeks; w++) {
    const tue = firstTue + w * 7 * 86_400_000;
    const oi = 250_000 * (1 + 0.15 * Math.sin(w / 30)) * Math.exp((rng() - 0.5) * 0.04);
    const dealerNet = -0.7 * net[w]! + (rng() - 0.5) * 0.02;
    const amNet = 0.25 * net[w]! + 0.05 * Math.sin(w / 60) + (rng() - 0.5) * 0.02;
    const legs = (base: number, nt: number) => [base + nt / 2, base - nt / 2] as const;
    const [ll, ls] = legs(0.22, net[w]!);
    const [dl, ds] = legs(0.33, dealerNet);
    const [al, as_] = legs(0.27, amNet);
    tff.push({
      date: tue,
      oi,
      lf_long: ll * oi,
      lf_short: ls * oi,
      dealer_long: dl * oi,
      dealer_short: ds * oi,
      am_long: al * oi,
      am_short: as_ * oi,
      oth_long: 0.1 * oi,
      oth_short: 0.1 * oi,
    });
  }
  return { px: pxSeries, tff };
}

function tuesdayOnOrBefore(ts: number) {
  const d = new Date(ts);
  d.setUTCHours(0, 0, 0, 0);
  const day = d.getUTCDay();
  const back = (day + 7 - 2) % 7;
  return d.getTime() - back * 86_400_000;
}

export function cotIndex(x: number[], n: number): number[] {
  const lo = rollingMin(x, n, Math.floor(n / 2));
  const hi = rollingMax(x, n, Math.floor(n / 2));
  return x.map((v, i) => {
    const span = (hi[i] ?? NaN) - (lo[i] ?? NaN);
    if (!Number.isFinite(span) || span === 0) return NaN;
    return (v - lo[i]!) / span;
  });
}

export function buildFeatures(t: TffWeek[]): CotFeature[] {
  const net_lf = t.map((w) => ((w.lf_long - w.lf_short) / w.oi) * 100);
  const net_dealer = t.map((w) => ((w.dealer_long - w.dealer_short) / w.oi) * 100);
  const net_am = t.map((w) => ((w.am_long - w.am_short) / w.oi) * 100);
  const net_oth = t.map((w) => ((w.oth_long - w.oth_short) / w.oi) * 100);
  const net_cot = net_lf.map((v, i) => v - net_dealer[i]!);
  const gross_lf = t.map((w) => ((w.lf_long + w.lf_short) / w.oi) * 100);
  const series: Record<string, number[]> = { lf: net_lf, dealer: net_dealer, am: net_am, cot: net_cot };
  const idx: Record<string, number[]> = {};
  const z: Record<string, number[]> = {};
  const d4: Record<string, number[]> = {};
  const d13: Record<string, number[]> = {};
  for (const k of Object.keys(series)) {
    const s = series[k]!;
    idx[k] = cotIndex(s, IDX_WINDOW);
    const mu = rollingMean(s, Z_WINDOW);
    const sd = rollingStd(s, Z_WINDOW);
    z[k] = s.map((v, i) => (sd[i] && sd[i] !== 0 ? (v - mu[i]!) / sd[i]! : NaN));
    d4[k] = s.map((v, i) => (i >= 4 ? v - s[i - 4]! : NaN));
    d13[k] = s.map((v, i) => (i >= 13 ? v - s[i - 13]! : NaN));
  }
  return t.map((w, i) => ({
    date: w.date,
    net_lf: net_lf[i]!,
    net_dealer: net_dealer[i]!,
    net_am: net_am[i]!,
    net_oth: net_oth[i]!,
    net_cot: net_cot[i]!,
    gross_lf: gross_lf[i]!,
    idx_lf: idx.lf![i]!,
    idx_dealer: idx.dealer![i]!,
    idx_am: idx.am![i]!,
    idx_cot: idx.cot![i]!,
    z_lf: z.lf![i]!,
    z_dealer: z.dealer![i]!,
    z_am: z.am![i]!,
    z_cot: z.cot![i]!,
    d4_lf: d4.lf![i]!,
    d13_lf: d13.lf![i]!,
    d4_cot: d4.cot![i]!,
    d13_cot: d13.cot![i]!,
    lf_am_div: (z.lf![i] ?? 0) - (z.am![i] ?? 0),
  }));
}

export function sigExtreme(idx: number, hi = 0.85, lo = 0.15, contrarian = true): number {
  if (!Number.isFinite(idx)) return 0;
  let s = 0;
  if (idx >= hi) s = -1;
  else if (idx <= lo) s = 1;
  return contrarian ? s : -s;
}

export function availabilityDate(reportTue: number, releaseLag = RELEASE_LAG_DAYS) {
  return reportTue + releaseLag * 86_400_000;
}

/** exec_lag=2 → Monday close after Friday 15:30 ET publication. */
export function tradableDate(reportTue: number, execLag = DEFAULT_EXEC_LAG, releaseLag = RELEASE_LAG_DAYS) {
  return availabilityDate(reportTue, releaseLag) + execLag * 86_400_000;
}

const MARKETS = [
  { m: "EUR", edge: 0.14, vol: 0.08, cls: "Forex" },
  { m: "GBP", edge: 0.1, vol: 0.09, cls: "Forex" },
  { m: "AUD", edge: 0.11, vol: 0.1, cls: "Forex" },
  { m: "NZD", edge: 0.09, vol: 0.11, cls: "Forex" },
  { m: "JPY", edge: 0.12, vol: 0.09, cls: "Forex" },
  { m: "CAD", edge: 0.08, vol: 0.08, cls: "Forex" },
  { m: "CHF", edge: 0.07, vol: 0.08, cls: "Forex" },
  { m: "MXN", edge: 0.18, vol: 0.12, cls: "Forex" },
  { m: "ES", edge: 0.06, vol: 0.16, cls: "Index" },
  { m: "NQ", edge: 0.05, vol: 0.2, cls: "Index" },
  { m: "TY", edge: 0.09, vol: 0.07, cls: "Rates" },
  { m: "FF", edge: 0.04, vol: 0.04, cls: "Rates" },
  { m: "GC", edge: 0.13, vol: 0.14, cls: "Metals" },
  { m: "CL", edge: 0.16, vol: 0.28, cls: "Energy" },
  { m: "NG", edge: 0.07, vol: 0.45, cls: "Energy" },
  { m: "BTC", edge: 0.04, vol: 0.55, cls: "Crypto" },
];

const cache = new Map<string, { px: { t: number; v: number }[]; feat: CotFeature[] }>();

export function marketPath(market: string, asOf: number) {
  const spec = MARKETS.find((x) => x.m === market);
  if (!spec) return null;
  const key = `${market}`;
  let hit = cache.get(key);
  if (!hit) {
    const seed = (hashStr(market) ^ 11) >>> 0;
    const { px, tff } = syntheticCotMarket(520, spec.edge, seed, spec.vol);
    hit = { px, feat: buildFeatures(tff) };
    cache.set(key, hit);
  }
  const last = hit.feat.filter((f) => f.date <= asOf).at(-1) ?? hit.feat.at(-1)!;
  return { ...hit, last, spec };
}

export function cotTffRows(asOf: number): CotSignalRow[] {
  return MARKETS.map((spec) => {
    const path = marketPath(spec.m, asOf)!;
    const last = path.last;
    const idx = last.idx_lf;
    const sig = sigExtreme(idx);
    let extreme = "—";
    if (idx >= 0.9) extreme = "CRWD LONG";
    else if (idx <= 0.1) extreme = "CRWD SHORT";
    else if (idx >= 0.85) extreme = "LONG";
    else if (idx <= 0.15) extreme = "SHORT";
    const px = path.px.filter((p) => p.t <= asOf).at(-1)?.v ?? 100;
    return {
      market: spec.m,
      cls: spec.cls,
      last,
      extreme,
      sig,
      px: +px.toFixed(spec.m === "JPY" ? 1 : 3),
      source: "synthetic",
      reportTue: last.date,
      publishFri: availabilityDate(last.date),
      tradable: tradableDate(last.date),
    };
  });
}

export function cotFeatureHistory(market: string, asOf: number, years: number) {
  const path = marketPath(market, asOf);
  if (!path) return [];
  const n = years * 52;
  return path.feat
    .filter((f) => f.date <= asOf)
    .slice(-n)
    .map((f, i) => ({
      w: i,
      net: +f.net_cot.toFixed(2),
      lf: +f.net_lf.toFixed(2),
      dealer: +f.net_dealer.toFixed(2),
      idx: Number.isFinite(f.idx_lf) ? +(f.idx_lf * 100).toFixed(1) : 50,
      z: Number.isFinite(f.z_lf) ? +f.z_lf.toFixed(2) : 0,
    }));
}

export function cotTimingCopy(asOf: number) {
  const tue = tuesdayOnOrBefore(asOf);
  const pub = availabilityDate(tue);
  const exec = tradableDate(tue);
  return {
    reportTue: tue,
    publishFri: pub,
    tradable: exec,
    note: "CFTC TFF: positions as-of Tuesday, published Friday 15:30 ET. Default exec_lag=2 uses Monday close — never Tuesday (look-ahead of 3 days).",
  };
}

export function cotTffPulse(rows: CotSignalRow[]) {
  const classes = ["Forex", "Metals", "Energy", "Index", "Rates", "Crypto"];
  return classes.map((cls) => {
    const xs = rows.filter((r) => r.cls === cls);
    const avg =
      xs.reduce((s, r) => s + ((Number.isFinite(r.last.idx_lf) ? r.last.idx_lf : 0.5) - 0.5) * 100, 0) /
      Math.max(1, xs.length);
    return { cls, crowding: +avg.toFixed(1) };
  });
}
