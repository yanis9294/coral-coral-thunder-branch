/**
 * Dollar indices.
 *
 * ICE DXY (NYBOT) — 6-currency geometric basket, published factor 50.14348112:
 *   DXY = 50.14348112 · EURUSD^-0.576 · USDJPY^0.136 · GBPUSD^-0.119
 *                     · USDCAD^0.091 · USDSEK^0.042 · USDCHF^0.042
 *
 * Bloomberg Dollar Spot (BBDXY) — 2026 target weights effective after the close
 * of 30 Jun 2026 (50 % Fed trade / 50 % BIS FX liquidity; CNH capped at 7.00).
 * Geometric, USD-strength quotes (USDXXX, or 1/XXXUSD). Rebased so the basket
 * equals 1240.00 at the terminal's September-2026 central spots.
 */

export const ICE_DXY_FACTOR = 50.14348112;
export const ICE_DXY_WEIGHTS: { pair: string; w: number; invert: boolean }[] = [
  { pair: "EURUSD", w: 0.576, invert: true },
  { pair: "USDJPY", w: 0.136, invert: false },
  { pair: "GBPUSD", w: 0.119, invert: true },
  { pair: "USDCAD", w: 0.091, invert: false },
  { pair: "USDSEK", w: 0.042, invert: false },
  { pair: "USDCHF", w: 0.042, invert: false },
];

/** Weight in percent. Invert = pair is XXXUSD (USD strength is 1/spot). */
export const BBDXY_2026: { pair: string; name: string; w: number; invert: boolean }[] = [
  { pair: "EURUSD", name: "EUR", w: 29.01, invert: true },
  { pair: "USDJPY", name: "JPY", w: 12.8, invert: false },
  { pair: "USDCAD", name: "CAD", w: 11.01, invert: false },
  { pair: "USDMXN", name: "MXN", w: 9.83, invert: false },
  { pair: "GBPUSD", name: "GBP", w: 8.98, invert: true },
  { pair: "USDCNH", name: "CNH", w: 7.0, invert: false },
  { pair: "USDCHF", name: "CHF", w: 5.41, invert: false },
  { pair: "AUDUSD", name: "AUD", w: 4.37, invert: true },
  { pair: "USDKRW", name: "KRW", w: 3.22, invert: false },
  { pair: "USDINR", name: "INR", w: 3.14, invert: false },
  { pair: "USDSGD", name: "SGD", w: 2.73, invert: false },
  { pair: "USDTWD", name: "TWD", w: 2.5, invert: false },
];

export const BBDXY_REBASE = 1240;

export function usdStrengthQuote(pair: string, spot: number, invert: boolean): number {
  if (!(spot > 0)) return NaN;
  return invert ? 1 / spot : spot;
}

export function iceDxy(spots: Record<string, number>): number {
  let v = ICE_DXY_FACTOR;
  for (const { pair, w, invert } of ICE_DXY_WEIGHTS) {
    const s = spots[pair];
    if (!(s > 0)) return NaN;
    v *= usdStrengthQuote(pair, s, invert) ** w;
  }
  return v;
}

export function bbdxy(spots: Record<string, number>, baseSpots: Record<string, number>): number {
  let prod = 1;
  for (const { pair, w, invert } of BBDXY_2026) {
    const s = spots[pair];
    const b = baseSpots[pair];
    if (!(s > 0) || !(b > 0)) return NaN;
    const num = usdStrengthQuote(pair, s, invert);
    const den = usdStrengthQuote(pair, b, invert);
    prod *= (num / den) ** (w / 100);
  }
  return BBDXY_REBASE * prod;
}

export function bbdxyContrib(spots: Record<string, number>, baseSpots: Record<string, number>) {
  return BBDXY_2026.map((c) => {
    const s = spots[c.pair] ?? 0;
    const b = baseSpots[c.pair] ?? 0;
    const num = usdStrengthQuote(c.pair, s, c.invert);
    const den = usdStrengthQuote(c.pair, b, c.invert);
    const rel = den > 0 ? num / den - 1 : 0;
    return {
      ...c,
      spot: s,
      usdQuote: num,
      relPct: rel * 100,
      contrib: (wPctWeighted(rel, c.w)),
    };
  });
}

function wPctWeighted(rel: number, wPct: number) {
  return rel * (wPct / 100) * 100;
}

export function bbdxyWeightSum() {
  return BBDXY_2026.reduce((s, c) => s + c.w, 0);
}
