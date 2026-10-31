import { clamp, hashStr, mulberry32, dayKey } from "@/lib/utils";
import { invNorm, normCdf } from "@/lib/stats";
import type { CountryScorecard, MacroRelease } from "./types";

const CCYS = [
  { ccy: "USD", country: "United States" },
  { ccy: "EUR", country: "Euro area" },
  { ccy: "GBP", country: "United Kingdom" },
  { ccy: "JPY", country: "Japan" },
  { ccy: "CAD", country: "Canada" },
  { ccy: "AUD", country: "Australia" },
  { ccy: "NZD", country: "New Zealand" },
  { ccy: "CHF", country: "Switzerland" },
];

interface Spec {
  name: string;
  domain: MacroRelease["domain"];
  tier: MacroRelease["tier"];
  hour: number;
  unit: string;
  base: number;
  sigma: number;
  related: string[];
  /** Typical 30m move of primary related asset, in its native units (FX bp, yields bp, index %). */
  beatMove: number;
  missMove: number;
}

const MACROS: Spec[] = [
  { name: "Payrolls", domain: "Labor", tier: "T3", hour: 12.5, unit: "k", base: 165, sigma: 42, related: ["DXY", "US2Y", "SPX"], beatMove: 18, missMove: -22 },
  { name: "Unemployment", domain: "Labor", tier: "T2", hour: 12.5, unit: "%", base: 4.2, sigma: 0.12, related: ["DXY", "US2Y"], beatMove: -8, missMove: 10 },
  { name: "AHE", domain: "Labor", tier: "T2", hour: 12.5, unit: "% m/m", base: 0.3, sigma: 0.08, related: ["US2Y", "DXY"], beatMove: 12, missMove: -9 },
  { name: "CPI", domain: "Inflation", tier: "T3", hour: 12.5, unit: "% y/y", base: 2.6, sigma: 0.12, related: ["DXY", "US10Y", "XAU"], beatMove: 22, missMove: -18 },
  { name: "Core CPI", domain: "Inflation", tier: "T3", hour: 12.5, unit: "% y/y", base: 2.9, sigma: 0.1, related: ["US2Y", "DXY"], beatMove: 24, missMove: -20 },
  { name: "Core PCE", domain: "Inflation", tier: "T3", hour: 12.5, unit: "% y/y", base: 2.7, sigma: 0.09, related: ["US2Y", "BBDXY"], beatMove: 16, missMove: -14 },
  { name: "GDP", domain: "Growth", tier: "T3", hour: 12.5, unit: "% q/q saar", base: 2.1, sigma: 0.4, related: ["SPX", "DXY"], beatMove: 10, missMove: -12 },
  { name: "PMI mfg", domain: "Growth", tier: "T2", hour: 8, unit: "idx", base: 49.4, sigma: 1.1, related: ["SPX", "USDJPY"], beatMove: 8, missMove: -7 },
  { name: "Retail sales", domain: "Growth", tier: "T2", hour: 12.5, unit: "% m/m", base: 0.3, sigma: 0.35, related: ["SPX", "DXY"], beatMove: 9, missMove: -11 },
  { name: "CPI flash", domain: "Inflation", tier: "T3", hour: 9, unit: "% y/y", base: 2.2, sigma: 0.14, related: ["EURUSD", "DE10Y"], beatMove: 14, missMove: -12 },
  { name: "Policy decision", domain: "Policy", tier: "T3", hour: 18, unit: "%", base: 4.25, sigma: 0.125, related: ["SOFR", "DXY", "SPX"], beatMove: 6, missMove: -16 },
  { name: "Trade balance", domain: "External", tier: "T1", hour: 12.5, unit: "$bn", base: -68, sigma: 8, related: ["DXY"], beatMove: 4, missMove: -3 },
  { name: "ISM services", domain: "Growth", tier: "T2", hour: 14, unit: "idx", base: 52.1, sigma: 1.2, related: ["SPX"], beatMove: 7, missMove: -8 },
  { name: "Jobless claims", domain: "Labor", tier: "T2", hour: 12.5, unit: "k", base: 228, sigma: 12, related: ["US2Y"], beatMove: -5, missMove: 6 },
];

function roundTo(n: number, unit: string) {
  if (unit === "k" || unit === "$bn" || unit === "idx") return +n.toFixed(1);
  if (unit === "%") return +n.toFixed(2);
  return +n.toFixed(2);
}

export function macroCalendar(asOf: number): MacroRelease[] {
  const out: MacroRelease[] = [];
  let n = 0;
  for (let d = -14; d < 21; d++) {
    CCYS.forEach((c, ci) => {
      const r = mulberry32(hashStr(c.ccy) ^ dayKey(asOf + d * 86400000) ^ (ci + 3));
      if (r() > 0.18) return;
      const m = MACROS[Math.floor(r() * MACROS.length)]!;
      const ts = asOf + d * 86400000 + m.hour * 3600000;
      const past = ts < asOf;
      const bias = (r() - 0.48) * 0.35;
      const consensus = roundTo(m.base + (r() - 0.5) * m.sigma * 0.4, m.unit);
      const previous = roundTo(m.base + (r() - 0.5) * m.sigma * 0.8, m.unit);
      const high = roundTo(consensus + 1.2816 * m.sigma, m.unit);
      const low = roundTo(consensus - 1.2816 * m.sigma, m.unit);
      const pBeat = +clamp(0.5 + bias, 0.12, 0.88).toFixed(2);
      const pMiss = +clamp(1 - pBeat - 0.18, 0.08, 0.7).toFixed(2);
      const pInline = +(1 - pBeat - pMiss).toFixed(2);
      const zHigh = (high - consensus) / m.sigma;
      const zLow = (low - consensus) / m.sigma;
      const pAboveHigh = +(1 - normCdf(zHigh - bias)).toFixed(3);
      const pBelowLow = +normCdf(zLow - bias).toFixed(3);
      const surprise = past ? (r() - 0.48 + bias) * 2.2 : undefined;
      const actual =
        past && surprise !== undefined ? roundTo(consensus + surprise * m.sigma, m.unit) : undefined;
      out.push({
        id: `mac-${n++}`,
        ts,
        country: c.country,
        ccy: c.ccy,
        name: m.name,
        tier: m.tier,
        domain: m.domain,
        unit: m.unit,
        consensus,
        previous,
        actual,
        surpriseZ: surprise !== undefined ? +surprise.toFixed(2) : undefined,
        high,
        low,
        pBeat,
        pMiss,
        pInline,
        pAboveHigh,
        pBelowLow,
        histBeatMove: m.beatMove,
        histMissMove: m.missMove,
        histN: 12 + Math.floor(r() * 14),
        related: m.related,
        weight: m.tier === "T3" ? 3 : m.tier === "T2" ? 2 : 1,
      });
    });
  }
  return out.sort((a, b) => a.ts - b.ts);
}

export function scorecards(asOf: number): CountryScorecard[] {
  const regimes: CountryScorecard["regime"][] = ["RE-ACCEL", "COOLING", "BOTTOMING", "WORSENING"];
  return CCYS.map((c) => {
    const r = mulberry32(hashStr(c.ccy) ^ dayKey(asOf) ^ 99);
    return {
      ccy: c.ccy,
      country: c.country,
      beatZ: +((r() - 0.4) * 1.4).toFixed(2),
      missZ: +((r() - 0.6) * 1.2).toFixed(2),
      beatPct: +clamp(40 + (r() - 0.5) * 40, 15, 85).toFixed(0),
      momentum: +((r() - 0.5) * 2).toFixed(2),
      streak: Math.floor((r() - 0.5) * 6),
      regime: regimes[Math.floor(r() * 4)]!,
    };
  });
}

export function impactWindow(cals: MacroRelease[], asOf: number) {
  const days: { d: number; w: number; label: string }[] = [];
  for (let i = 0; i < 14; i++) {
    const start = asOf + i * 86400000;
    const end = start + 86400000;
    const w = cals.filter((c) => c.ts >= start && c.ts < end).reduce((s, c) => s + c.weight, 0);
    const dt = new Date(start);
    days.push({
      d: i,
      w,
      label: dt.toLocaleDateString("en-GB", { weekday: "short", day: "2-digit", timeZone: "UTC" }),
    });
  }
  return days;
}

export function printHistory(rel: MacroRelease, asOf: number) {
  const out: { i: number; actual: number; consensus: number; z: number; move: number }[] = [];
  for (let k = rel.histN; k >= 1; k--) {
    const r = mulberry32(hashStr(rel.ccy + rel.name) ^ (dayKey(asOf) - k * 30));
    const z = (r() - 0.48) * 2.1;
    const actual = rel.consensus + z * (Math.abs(rel.high - rel.low) / (2 * 1.2816 || 1));
    const move = z >= 0 ? rel.histBeatMove * (0.6 + r() * 0.8) * (z / 1.2) : rel.histMissMove * (0.6 + r() * 0.8) * (-z / 1.2);
    out.push({ i: rel.histN - k, actual: +actual.toFixed(2), consensus: rel.consensus, z: +z.toFixed(2), move: +move.toFixed(1) });
  }
  return out;
}

export function surpriseToZ(actual: number, consensus: number, sigma: number) {
  if (sigma === 0) return 0;
  return (actual - consensus) / sigma;
}

export function impliedMove(rel: MacroRelease) {
  const zBeat = invNorm(1 - rel.pBeat);
  return {
    expectedAbs: +(rel.pBeat * Math.abs(rel.histBeatMove) + rel.pMiss * Math.abs(rel.histMissMove)).toFixed(1),
    skewed: rel.pBeat - rel.pMiss,
    zForHigh: zBeat,
  };
}
