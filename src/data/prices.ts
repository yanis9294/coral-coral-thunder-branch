import { hashStr, mulberry32, hourKey } from "@/lib/utils";
import type { TickerRow } from "./types";
import { bbdxy, iceDxy } from "./dxy";
import { yieldLevels, yieldSpreads } from "./yields";

interface Spec {
  pair: string;
  name: string;
  base: number;
  vol: number;
  spread: number;
  digits: number;
}

const SPECS: Spec[] = [
  { pair: "EURUSD", name: "Euro", base: 1.0842, vol: 0.004, spread: 0.8, digits: 4 },
  { pair: "USDJPY", name: "Yen", base: 149.82, vol: 0.55, spread: 1.2, digits: 2 },
  { pair: "GBPUSD", name: "Sterling", base: 1.3124, vol: 0.005, spread: 1.1, digits: 4 },
  { pair: "USDCHF", name: "Swiss", base: 0.8621, vol: 0.003, spread: 1.4, digits: 4 },
  { pair: "AUDUSD", name: "Aussie", base: 0.6684, vol: 0.004, spread: 1.3, digits: 4 },
  { pair: "USDCAD", name: "Loonie", base: 1.3582, vol: 0.004, spread: 1.2, digits: 4 },
  { pair: "NZDUSD", name: "Kiwi", base: 0.6041, vol: 0.004, spread: 1.8, digits: 4 },
  { pair: "USDTRY", name: "Lira", base: 34.82, vol: 0.25, spread: 40, digits: 2 },
  { pair: "USDMXN", name: "Peso", base: 18.15, vol: 0.12, spread: 40, digits: 3 },
  { pair: "USDCNH", name: "Offshore yuan", base: 7.18, vol: 0.025, spread: 8, digits: 3 },
  { pair: "USDKRW", name: "Won", base: 1395, vol: 8, spread: 80, digits: 1 },
  { pair: "USDINR", name: "Rupee", base: 83.9, vol: 0.25, spread: 20, digits: 2 },
  { pair: "USDSGD", name: "Singapore", base: 1.328, vol: 0.004, spread: 1.5, digits: 4 },
  { pair: "USDTWD", name: "Taiwan dollar", base: 32.1, vol: 0.12, spread: 20, digits: 2 },
  { pair: "USDSEK", name: "Krona", base: 10.52, vol: 0.05, spread: 18, digits: 3 },
  { pair: "WTI", name: "WTI crude", base: 81.4, vol: 1.8, spread: 2, digits: 2 },
  { pair: "BRENT", name: "Brent", base: 84.9, vol: 1.7, spread: 2, digits: 2 },
  { pair: "XAU", name: "Gold", base: 2642, vol: 18, spread: 4, digits: 1 },
  { pair: "XAG", name: "Silver", base: 31.4, vol: 0.6, spread: 2, digits: 2 },
  { pair: "SPX", name: "S&P 500", base: 5628, vol: 28, spread: 0, digits: 1 },
  { pair: "NDX", name: "Nasdaq 100", base: 19740, vol: 90, spread: 0, digits: 0 },
  { pair: "US10Y", name: "UST 10Y", base: 4.12, vol: 0.06, spread: 0, digits: 3 },
  { pair: "BTC", name: "Bitcoin", base: 62840, vol: 1200, spread: 8, digits: 0 },
  { pair: "NATGAS", name: "Henry Hub", base: 2.84, vol: 0.12, spread: 2, digits: 3 },
];

export const FX_BASE_SPOTS: Record<string, number> = Object.fromEntries(
  SPECS.filter((s) => /USD/.test(s.pair)).map((s) => [s.pair, s.base]),
);

export function spotOf(pair: string, asOf: number): number {
  const s = SPECS.find((x) => x.pair === pair);
  if (!s) return 0;
  const r = mulberry32(hashStr(s.pair) ^ hourKey(asOf));
  return s.base + (r() - 0.5) * 2 * s.vol;
}

export function fxSpots(asOf: number): Record<string, number> {
  const out: Record<string, number> = {};
  for (const s of SPECS) {
    if (/USD/.test(s.pair)) out[s.pair] = spotOf(s.pair, asOf);
  }
  return out;
}

function rowFromPx(pair: string, name: string, px: number, yPx: number, spread: number, digits: number): TickerRow {
  const chg = yPx !== 0 ? ((px - yPx) / Math.abs(yPx)) * 100 : 0;
  return { pair, name, px: +px.toFixed(digits), chg: +chg.toFixed(2), spread };
}

export function ticker(asOf: number): TickerRow[] {
  const spots = fxSpots(asOf);
  const ySpots = fxSpots(asOf - 86_400_000);
  const ice = iceDxy(spots);
  const yIce = iceDxy(ySpots);
  const bb = bbdxy(spots, FX_BASE_SPOTS);
  const yBb = bbdxy(ySpots, FX_BASE_SPOTS);
  const yld = yieldLevels(asOf);
  const yYld = yieldLevels(asOf - 86_400_000);
  const spr = yieldSpreads(asOf);
  const s2s10 = spr.find((s) => s.id === "2s10s")!;
  const sofrFf = spr.find((s) => s.id === "sofrff")!;

  const out: TickerRow[] = [];
  const tape = [
    "EURUSD",
    "USDJPY",
    "GBPUSD",
    "AUDUSD",
    "USDCAD",
    "USDMXN",
    "USDCNH",
    "WTI",
    "XAU",
    "SPX",
    "BTC",
  ];
  for (const pair of tape) {
    const s = SPECS.find((x) => x.pair === pair)!;
    const px = /USD/.test(pair) ? spots[pair]! : spotOf(pair, asOf);
    const yPx = /USD/.test(pair) ? ySpots[pair]! : spotOf(pair, asOf - 86_400_000);
    out.push(rowFromPx(s.pair, s.name, px, yPx, s.spread, s.digits));
  }
  out.splice(3, 0, rowFromPx("BBDXY", "Bloomberg dollar", bb, yBb, 0, 2));
  out.splice(4, 0, rowFromPx("DXY", "ICE dollar index", ice, yIce, 0, 2));
  out.push(rowFromPx("US10Y", "UST 10Y", yld.us10, yYld.us10, 0, 3));
  out.push({
    pair: "2s10s",
    name: "US 2s10s",
    px: s2s10.value,
    chg: +((s2s10.chg / Math.max(1, Math.abs(s2s10.value))) * 100).toFixed(2),
    spread: 0,
  });
  out.push(rowFromPx("SOFR", "SOFR", yld.sofr, yYld.sofr, 0, 3));
  out.push({
    pair: "SOFR-FF",
    name: "SOFR−FF",
    px: sofrFf.value,
    chg: sofrFf.chg,
    spread: 0,
  });
  return out;
}

export function pxOf(pair: string, asOf: number): { px: number; chg: number } {
  if (pair === "DXY") {
    const ice = iceDxy(fxSpots(asOf));
    const y = iceDxy(fxSpots(asOf - 86_400_000));
    return { px: +ice.toFixed(2), chg: +(((ice - y) / y) * 100).toFixed(2) };
  }
  if (pair === "BBDXY") {
    const bb = bbdxy(fxSpots(asOf), FX_BASE_SPOTS);
    const y = bbdxy(fxSpots(asOf - 86_400_000), FX_BASE_SPOTS);
    return { px: +bb.toFixed(2), chg: +(((bb - y) / y) * 100).toFixed(2) };
  }
  const row = ticker(asOf).find((t) => t.pair === pair);
  if (row) return { px: row.px, chg: row.chg };
  const s = SPECS.find((x) => x.pair === pair);
  if (!s) return { px: 0, chg: 0 };
  const px = spotOf(pair, asOf);
  const yPx = spotOf(pair, asOf - 86_400_000);
  return { px: +px.toFixed(s.digits), chg: +(((px - yPx) / yPx) * 100).toFixed(2) };
}

export const PULSE_ASSETS = ["WTI", "XAU", "SPX", "BBDXY", "DXY", "EURUSD", "US10Y", "BTC", "NATGAS"] as const;

export { SPECS as PRICE_SPECS };
