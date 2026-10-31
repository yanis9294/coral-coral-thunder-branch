import { hashStr, mulberry32, dayKey, series, clamp } from "@/lib/utils";
import type {
  CotRow,
  PmMarket,
  TdiRow,
  TrendRow,
  Verdict,
} from "./types";
import { ticker } from "./prices";
import { geoNews } from "./monitor";

export { macroCalendar, scorecards, impactWindow, printHistory } from "./calendar";
export { BANK_NOTES as bankNotesList } from "./bank-sources";

function verdictOf(overall: number): Verdict {
  const a = Math.abs(overall);
  if (a >= 70) return "EXTREME";
  if (a >= 45) return "STRONG";
  if (a >= 25) return "MODERATE";
  if (a >= 10) return "MILD";
  return "NEUTRAL";
}

const TREND_UNIVERSE: { symbol: string; name: string; assetClass: string; bias: number }[] = [
  { symbol: "EURUSD", name: "Euro", assetClass: "FX", bias: -8 },
  { symbol: "USDJPY", name: "Dollar-yen", assetClass: "FX", bias: 12 },
  { symbol: "GBPUSD", name: "Sterling", assetClass: "FX", bias: -4 },
  { symbol: "USDCHF", name: "Dollar-swiss", assetClass: "FX", bias: 6 },
  { symbol: "AUDUSD", name: "Aussie", assetClass: "FX", bias: -10 },
  { symbol: "USDCAD", name: "Dollar-cad", assetClass: "FX", bias: 8 },
  { symbol: "NZDUSD", name: "Kiwi", assetClass: "FX", bias: -6 },
  { symbol: "USDTRY", name: "Dollar-lira", assetClass: "FX", bias: 22 },
  { symbol: "SPX", name: "S&P 500", assetClass: "Index", bias: 6 },
  { symbol: "NDX", name: "Nasdaq 100", assetClass: "Index", bias: 10 },
  { symbol: "DAX", name: "DAX", assetClass: "Index", bias: -4 },
  { symbol: "NKY", name: "Nikkei", assetClass: "Index", bias: 8 },
  { symbol: "HSI", name: "Hang Seng", assetClass: "Index", bias: -12 },
  { symbol: "STOXX", name: "Euro Stoxx 50", assetClass: "Index", bias: -2 },
  { symbol: "WTI", name: "WTI crude", assetClass: "Energy", bias: 38 },
  { symbol: "BRENT", name: "Brent", assetClass: "Energy", bias: 36 },
  { symbol: "NATGAS", name: "Henry Hub", assetClass: "Energy", bias: -14 },
  { symbol: "GASOIL", name: "Gasoil", assetClass: "Energy", bias: 28 },
  { symbol: "XAU", name: "Gold", assetClass: "Metals", bias: 32 },
  { symbol: "XAG", name: "Silver", assetClass: "Metals", bias: 18 },
  { symbol: "HG", name: "Copper", assetClass: "Metals", bias: 8 },
  { symbol: "PL", name: "Platinum", assetClass: "Metals", bias: 14 },
  { symbol: "US10Y", name: "UST 10Y yield", assetClass: "Rates", bias: 10 },
  { symbol: "US2Y", name: "UST 2Y yield", assetClass: "Rates", bias: 4 },
  { symbol: "DE10Y", name: "Bund 10Y", assetClass: "Rates", bias: 6 },
  { symbol: "C", name: "Corn", assetClass: "Ags", bias: -8 },
  { symbol: "W", name: "Wheat", assetClass: "Ags", bias: 6 },
  { symbol: "S", name: "Soy", assetClass: "Ags", bias: -2 },
  { symbol: "BTC", name: "Bitcoin", assetClass: "Crypto", bias: 4 },
  { symbol: "ETH", name: "Ether", assetClass: "Crypto", bias: 2 },
  { symbol: "HYG", name: "HY credit", assetClass: "Credit", bias: -6 },
  { symbol: "LQD", name: "IG credit", assetClass: "Credit", bias: -2 },
  { symbol: "BBDXY", name: "Bloomberg dollar", assetClass: "FX", bias: 8 },
  { symbol: "DXY", name: "ICE DXY", assetClass: "FX", bias: 6 },
  { symbol: "SOFR", name: "SOFR", assetClass: "Rates", bias: -4 },
];

export function trendMatrix(
  asOf: number,
  weights = { macro: 30, pos: 25, risk: 20, flow: 25 },
): TrendRow[] {
  const px = ticker(asOf);
  const wsum = weights.macro + weights.pos + weights.risk + weights.flow || 1;
  return TREND_UNIVERSE.map((a) => {
    const r = mulberry32(hashStr(a.symbol) ^ dayKey(asOf));
    const macro = clamp(a.bias * 0.4 + (r() - 0.5) * 50, -100, 100);
    const pos = clamp(a.bias * 0.2 + (r() - 0.5) * 70, -100, 100);
    const risk = clamp(-a.bias * 0.15 + (r() - 0.5) * 40, -100, 100);
    const flow = clamp(a.bias * 0.5 + (r() - 0.5) * 55, -100, 100);
    const overall =
      (macro * weights.macro + pos * weights.pos + risk * weights.risk + flow * weights.flow) / wsum;
    const t = px.find((p) => p.pair === a.symbol);
    const drivers = [
      macro > 20 ? "macro tailwind" : macro < -20 ? "macro drag" : "macro mixed",
      pos > 40 ? "crowded long" : pos < -40 ? "crowded short" : "positioning mid",
      flow > 20 ? "flow with" : "flow fading",
    ];
    return {
      symbol: a.symbol,
      name: a.name,
      assetClass: a.assetClass,
      last: t?.px ?? +(50 + r() * 50).toFixed(2),
      chg: t?.chg ?? +((r() - 0.5) * 2).toFixed(2),
      overall: +overall.toFixed(1),
      macro: +macro.toFixed(1),
      pos: +pos.toFixed(1),
      risk: +risk.toFixed(1),
      flow: +flow.toFixed(1),
      verdict: verdictOf(overall),
      crowding: +clamp(Math.abs(pos), 0, 100).toFixed(0),
      regimeP: +clamp(55 + overall * 0.25 + (r() - 0.5) * 10, 5, 95).toFixed(0),
      drivers,
    };
  }).sort((a, b) => Math.abs(b.overall) - Math.abs(a.overall));
}

export function globalRegime(rows: TrendRow[]): "RISK-ON" | "BALANCED" | "RISK-OFF" {
  const eq = rows.filter((r) => r.assetClass === "Index");
  const avg = eq.reduce((s, r) => s + r.overall, 0) / Math.max(1, eq.length);
  if (avg > 12) return "RISK-ON";
  if (avg < -12) return "RISK-OFF";
  return "BALANCED";
}

export function trendHistory(symbol: string, asOf: number) {
  return series(`trend-${symbol}`, 90, 0, 8, asOf).map((v, i) => ({
    d: i,
    v: clamp(v, -100, 100),
  }));
}

const COT_UNIVERSE: { contract: string; cls: string; bias: number }[] = [
  { contract: "EUR", cls: "Forex", bias: -20 },
  { contract: "JPY", cls: "Forex", bias: 10 },
  { contract: "GBP", cls: "Forex", bias: -8 },
  { contract: "AUD", cls: "Forex", bias: -16 },
  { contract: "CAD", cls: "Forex", bias: 6 },
  { contract: "MXN", cls: "Forex", bias: -78 },
  { contract: "CHF", cls: "Forex", bias: 12 },
  { contract: "GC", cls: "Metals", bias: 42 },
  { contract: "SI", cls: "Metals", bias: 28 },
  { contract: "HG", cls: "Metals", bias: 8 },
  { contract: "CL", cls: "Energy", bias: 36 },
  { contract: "NG", cls: "Energy", bias: -22 },
  { contract: "RB", cls: "Energy", bias: 18 },
  { contract: "ES", cls: "Index", bias: 14 },
  { contract: "NQ", cls: "Index", bias: 22 },
  { contract: "TY", cls: "Index", bias: -10 },
  { contract: "BTC", cls: "Crypto", bias: 8 },
  { contract: "ETH", cls: "Crypto", bias: 2 },
];

export function cotRows(asOf: number): CotRow[] {
  return COT_UNIVERSE.map((c) => {
    const r = mulberry32(hashStr(c.contract) ^ dayKey(asOf));
    const netLong = clamp(50 + c.bias * 0.4 + (r() - 0.5) * 20, 2, 98);
    const percentile = clamp(50 + c.bias * 0.55 + (r() - 0.5) * 15, 1, 99);
    let extreme = "—";
    if (percentile >= 90) extreme = "CRWD LONG";
    else if (percentile <= 10) extreme = "CRWD SHORT";
    else if (percentile >= 80) extreme = "LONG";
    else if (percentile <= 20) extreme = "SHORT";
    return {
      contract: c.contract,
      cls: c.cls,
      netLong: +netLong.toFixed(1),
      percentile: +percentile.toFixed(0),
      extreme,
      velocity: +((r() - 0.5) * 12).toFixed(1),
      flow: +((r() - 0.45) * 8).toFixed(1),
      reversal: +clamp(Math.abs(percentile - 50) / 5 + r() * 2, 0, 10).toFixed(1),
      streak: Math.floor(r() * 9) * (c.bias >= 0 ? 1 : -1),
      dLong: +((r() - 0.5) * 18).toFixed(1),
      dShort: +((r() - 0.5) * 18).toFixed(1),
    };
  });
}

export function cotHistory(contract: string, asOf: number, years: number) {
  const n = years * 52;
  return series(`cot-${contract}`, n, 50, 4, asOf).map((v, i) => ({
    w: i,
    v: clamp(v, 1, 99),
  }));
}

export function cotPulse(rows: CotRow[]) {
  const classes = ["Forex", "Metals", "Energy", "Index", "Crypto"];
  return classes.map((cls) => {
    const xs = rows.filter((r) => r.cls === cls);
    const avg = xs.reduce((s, r) => s + (r.percentile - 50), 0) / Math.max(1, xs.length);
    return { cls, crowding: +avg.toFixed(1) };
  });
}

export function pmMarkets(asOf: number): PmMarket[] {
  const specs: { id: string; title: string; category: string; prob: number }[] = [
    { id: "pm-iran", title: "Iran kinetic event vs US/Israel assets, 2026", category: "Geopolitics", prob: 0.31 },
    { id: "pm-hormuz", title: "Hormuz fully closed ≥7 days this year", category: "Geopolitics", prob: 0.12 },
    { id: "pm-tw", title: "China blockade of Taiwan by Dec 2026", category: "Geopolitics", prob: 0.08 },
    { id: "pm-fed", title: "Fed cuts ≥50bp by year-end", category: "Macro", prob: 0.41 },
    { id: "pm-ua", title: "Ukraine ceasefire by March 2027", category: "Geopolitics", prob: 0.27 },
    { id: "pm-oil", title: "WTI above $100 before 2027", category: "Energy", prob: 0.29 },
    { id: "pm-xi", title: "Xi remains CCP General Secretary through 2027", category: "Geopolitics", prob: 0.86 },
    { id: "pm-ecb", title: "ECB on hold through Q1 2027", category: "Macro", prob: 0.48 },
    { id: "pm-gold", title: "Gold prints $3,000 in 2026", category: "Commodities", prob: 0.37 },
    { id: "pm-sk", title: "DPRK nuclear test before 2027", category: "Geopolitics", prob: 0.22 },
    { id: "pm-suez", title: "Suez transit <50% of 2023 run-rate, Q4", category: "Trade", prob: 0.34 },
    { id: "pm-ai", title: "NVIDIA still #1 GPU vendor by rev, 2027", category: "Tech", prob: 0.72 },
    { id: "pm-uk", title: "UK general election called by Jun 2027", category: "Politics", prob: 0.19 },
    { id: "pm-btc", title: "BTC above $80k in 2026", category: "Crypto", prob: 0.33 },
    { id: "pm-opec", title: "OPEC+ unwind remaining cuts in 2026", category: "Energy", prob: 0.24 },
    { id: "pm-re", title: "China rare-earth export licenses stay tight through Q4", category: "Commodities", prob: 0.61 },
  ];
  return specs.map((s) => {
    const r = mulberry32(hashStr(s.id) ^ dayKey(asOf));
    const spark = series(s.id, 30, s.prob * 100, 3, asOf).map((v) => clamp(v, 1, 99));
    const d1 = (r() - 0.5) * 4;
    const d4 = (r() - 0.5) * 6;
    const d24 = (r() - 0.45) * 8;
    const d7 = (r() - 0.5) * 14;
    return {
      ...s,
      prob: +(s.prob + d24 / 400).toFixed(3),
      delta1h: +d1.toFixed(1),
      delta4h: +d4.toFixed(1),
      delta24h: +d24.toFixed(1),
      delta7d: +d7.toFixed(1),
      volume: +(3 + r() * 48).toFixed(1),
      oi: +(8 + r() * 90).toFixed(1),
      spark,
      issues: [
        { name: "Yes", prob: s.prob },
        { name: "No", prob: 1 - s.prob },
      ],
      volRatio: +(0.7 + r() * 1.6).toFixed(2),
      realizedVol: +(4 + r() * 18).toFixed(1),
      whaleNet: +((r() - 0.5) * 6).toFixed(2),
    };
  });
}

export const MICRO_ASSETS = [
  "EUR", "JPY", "GBP", "AUD", "CAD", "NZD", "CHF", "MXN",
  "SPX", "NDX", "DAX", "NKY", "HSI", "STOXX", "UKX", "ES",
  "WTI", "BRENT", "NG", "GASOIL", "HO", "RB",
  "XAU", "XAG", "HG", "PL", "PA", "AL",
  "US10Y", "US2Y", "DE10Y", "GB10Y", "JP10Y",
  "BTC", "ETH", "SOL",
  "HYG", "LQD", "EMB",
  "W", "C", "S", "KC", "CT",
];

export function microHeat(asOf: number) {
  return MICRO_ASSETS.map((s) => {
    const r = mulberry32(hashStr(`mh-${s}`) ^ dayKey(asOf));
    const vol = (r() - 0.35) * 2;
    return { s, vol: +vol.toFixed(2) };
  });
}

export function leadLag(asOf: number) {
  const pairs: { a: string; b: string }[] = [
    { a: "WTI", b: "CAD" },
    { a: "XAU", b: "USDCHF" },
    { a: "NDX", b: "USDJPY" },
    { a: "US10Y", b: "SPX" },
    { a: "DXY", b: "XAU" },
    { a: "WTI", b: "USDCAD" },
    { a: "HSI", b: "AUD" },
    { a: "BTC", b: "NDX" },
    { a: "NG", b: "EUR" },
    { a: "HG", b: "AUD" },
  ];
  return pairs.map((p) => {
    const r = mulberry32(hashStr(p.a + p.b) ^ dayKey(asOf));
    return { ...p, lagMin: Math.floor(r() * 40) * 5, corr: +((r() - 0.2) * 0.9).toFixed(2), lead: r() > 0.5 ? p.a : p.b };
  });
}

export function fxBoard(asOf: number) {
  const pairs = ["EURUSD", "USDJPY", "GBPUSD", "USDCHF", "AUDUSD", "USDCAD", "NZDUSD", "USDMXN", "USDCNH"];
  const rows = ticker(asOf);
  return pairs.map((p) => {
    const t = rows.find((x) => x.pair === p);
    const r = mulberry32(hashStr(`fx-${p}`) ^ dayKey(asOf));
    const signal = r() > 0.66 ? "LONG" : r() > 0.33 ? "FLAT" : "SHORT";
    return {
      pair: p,
      px: t?.px ?? 0,
      chg: t?.chg ?? 0,
      signal,
      score: +((r() - 0.5) * 80).toFixed(0),
      carry: +((r() - 0.4) * 4).toFixed(2),
      cross: r() > 0.5 ? "with BBDXY" : "vs oil",
    };
  });
}

export function tdiRows(asOf: number): TdiRow[] {
  const base: TdiRow[] = [
    { id: "tdi-1", name: "WTI vs OPEC positioning", kind: "Price / POS", score: 78, note: "Price making highs, managed-money not yet at 90th. Room.", severity: "HIGH" },
    { id: "tdi-2", name: "MXN carry vs COT", kind: "FX / POS", score: -82, note: "Spot grinding, crowding extreme. Classic TDI fade.", severity: "CRITICAL" },
    { id: "tdi-3", name: "Gold vs real rates", kind: "MACRO / PRICE", score: 64, note: "Gold bid with real rates not collapsing. Regime break.", severity: "HIGH" },
    { id: "tdi-4", name: "NDX vs HYG", kind: "RISK / CREDIT", score: 22, note: "Equities bid, credit flat. Mild divergence.", severity: "LOW" },
    { id: "tdi-5", name: "USDJPY vs rate gap", kind: "FX / MACRO", score: -36, note: "Spot lagging the 2s gap. Intervention pin.", severity: "MEDIUM" },
    { id: "tdi-6", name: "TTF vs EU storage", kind: "ENERGY / FLOW", score: -48, note: "Price not confirming the storage comfort. Watch.", severity: "MEDIUM" },
    { id: "tdi-7", name: "BBDXY vs gold", kind: "CROSS", score: 55, note: "Both can rise in this regime — the 2022 template is stale.", severity: "MEDIUM" },
    { id: "tdi-8", name: "SPX vs breadth", kind: "MICRO", score: -28, note: "Index vs equal-weight gap. Late-cycle texture, not a trigger.", severity: "LOW" },
  ];
  return base.map((row) => {
    const r = mulberry32(hashStr(row.id) ^ dayKey(asOf));
    return { ...row, score: clamp(row.score + (r() - 0.5) * 8, -100, 100) };
  });
}

export function newsFeed(asOf: number) {
  return geoNews(asOf);
}

export function anomalies(asOf: number) {
  const z = [
    { id: "an-1", title: "Hormuz AIS velocity z = −2.4", body: "Multivariate isolation: speed + density + heading entropy. Auto-pushed to ZONE.", severity: "CRITICAL" as const, href: "/?sel=zone:zone-hormuz" },
    { id: "an-2", title: "MXN COT percentile 4th — reversal cluster", body: "Crowding + velocity sign-flip. Open COT.", severity: "HIGH" as const, href: "/cot" },
    { id: "an-3", title: "PLA ADIZ transits z = +2.1 vs 90d", body: "Count anomaly, not a new ZONE. Desk already covering.", severity: "MEDIUM" as const, href: "/?sel=zone:zone-taiwan" },
  ];
  return z.map((a, i) => ({ ...a, ts: asOf - (i * 17 + 8) * 60_000 }));
}

export function bankNotes() {
  return [
    { id: "b1", house: "Pierpont", date: "18 Sep", title: "Hormuz: option, not a forecast", tag: "Energy", body: "We stay overweight energy on a 3m horizon. Spare capacity math has not improved. A $90 WTI is a scenario, not a base. Size accordingly." },
    { id: "b2", house: "Rhine Capital", date: "17 Sep", title: "G10: fade the dollar smile", tag: "FX", body: "DXY mixed. The smile that paid in 2022 is not the 2026 distribution. Prefer gold over CHF as the hedge." },
    { id: "b3", house: "Pacific Cross", date: "16 Sep", title: "TSMC and the unpriced tail", tag: "Geopolitics", body: "Equity vol on TSM is not a blockade hedge. If you want the tail, buy the contract, not the stock." },
    { id: "b4", house: "Harbor Rates", date: "15 Sep", title: "Issuance is the rates story", tag: "Macro", body: "Coupons, not cuts. 10s30s is the expression. Do not dress a supply cheapening as a hawkish Fed." },
    { id: "b5", house: "Sable Commodities", date: "14 Sep", title: "NdPr is a policy instrument", tag: "Commodities", body: "Treat license delays as a geopolitical factor, not as a China PMI print. Magnet chain over the index." },
    { id: "b6", house: "North Desk", date: "12 Sep", title: "MXN: the crowded good idea", tag: "FX", body: "Carry is the identity. Positioning is the risk. We would rather be late than the last in." },
  ];
}
