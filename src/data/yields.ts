import { hashStr, mulberry32, hourKey } from "@/lib/utils";

export interface YieldPoint {
  tenor: string;
  years: number;
  us: number;
  de: number;
  jp: number;
  gb: number;
}

export interface YieldSpread {
  id: string;
  name: string;
  value: number;
  chg: number;
  unit: "bp";
  note: string;
}

const US = [
  { tenor: "3M", years: 0.25, base: 4.33 },
  { tenor: "2Y", years: 2, base: 3.72 },
  { tenor: "5Y", years: 5, base: 3.88 },
  { tenor: "10Y", years: 10, base: 4.12 },
  { tenor: "30Y", years: 30, base: 4.38 },
];
const DE = [
  { tenor: "2Y", years: 2, base: 2.04 },
  { tenor: "10Y", years: 10, base: 2.41 },
  { tenor: "30Y", years: 30, base: 2.72 },
];
const JP = [
  { tenor: "2Y", years: 2, base: 0.84 },
  { tenor: "10Y", years: 10, base: 1.08 },
];
const GB = [
  { tenor: "2Y", years: 2, base: 3.91 },
  { tenor: "10Y", years: 10, base: 4.01 },
];

function bump(key: string, asOf: number, vol: number) {
  const r = mulberry32(hashStr(key) ^ hourKey(asOf));
  return (r() - 0.5) * 2 * vol;
}

export function yieldCurve(asOf: number): YieldPoint[] {
  const tenors = ["2Y", "5Y", "10Y", "30Y"];
  return tenors.map((tenor) => {
    const years = tenor === "2Y" ? 2 : tenor === "5Y" ? 5 : tenor === "10Y" ? 10 : 30;
    const us = US.find((x) => x.tenor === tenor)?.base ?? 4;
    const de = DE.find((x) => x.tenor === tenor)?.base ?? 2.4;
    const jp = JP.find((x) => x.tenor === tenor)?.base ?? 1.0;
    const gb = GB.find((x) => x.tenor === tenor)?.base ?? 4.0;
    return {
      tenor,
      years,
      us: +(us + bump(`us-${tenor}`, asOf, 0.045)).toFixed(3),
      de: +(de + bump(`de-${tenor}`, asOf, 0.035)).toFixed(3),
      jp: +(jp + bump(`jp-${tenor}`, asOf, 0.02)).toFixed(3),
      gb: +(gb + bump(`gb-${tenor}`, asOf, 0.04)).toFixed(3),
    };
  });
}

export function yieldLevels(asOf: number) {
  const r = (k: string, b: number, v: number) => +(b + bump(k, asOf, v)).toFixed(3);
  return {
    us3m: r("us3m", 4.33, 0.02),
    us2: r("us-2Y", 3.72, 0.045),
    us5: r("us-5Y", 3.88, 0.04),
    us10: r("us-10Y", 4.12, 0.045),
    us30: r("us-30Y", 4.38, 0.04),
    de2: r("de-2Y", 2.04, 0.035),
    de10: r("de-10Y", 2.41, 0.035),
    jp10: r("jp-10Y", 1.08, 0.02),
    gb10: r("gb-10Y", 4.01, 0.04),
    bei10: r("bei10", 2.24, 0.03),
    sofr: r("sofr", 4.31, 0.015),
    effr: r("effr", 4.33, 0.01),
    iorb: r("iorb", 4.4, 0.01),
  };
}

function bp(a: number, b: number) {
  return (a - b) * 100;
}

export function yieldSpreads(asOf: number): YieldSpread[] {
  const y = yieldLevels(asOf);
  const yest = yieldLevels(asOf - 86_400_000);
  const row = (id: string, name: string, now: number, then: number, note: string): YieldSpread => ({
    id,
    name,
    value: +now.toFixed(1),
    chg: +(now - then).toFixed(1),
    unit: "bp",
    note,
  });
  return [
    row("2s10s", "US 2s10s", bp(y.us10, y.us2), bp(yest.us10, yest.us2), "Curve. Negative = inversion."),
    row("5s30s", "US 5s30s", bp(y.us30, y.us5), bp(yest.us30, yest.us5), "Long-end steepener."),
    row("10s30s", "US 10s30s", bp(y.us30, y.us10), bp(yest.us30, yest.us10), "Issuance / convexity."),
    row("2s30s", "US 2s30s", bp(y.us30, y.us2), bp(yest.us30, yest.us2), "Full-curve slope."),
    row("usde10", "US–DE 10Y", bp(y.us10, y.de10), bp(yest.us10, yest.de10), "Transatlantic gap. EURUSD beta."),
    row("usjp10", "US–JP 10Y", bp(y.us10, y.jp10), bp(yest.us10, yest.jp10), "USDJPY carry identity."),
    row("usgb10", "US–GB 10Y", bp(y.us10, y.gb10), bp(yest.us10, yest.gb10), "Cable rates gap."),
    row("real10", "US 10Y real", bp(y.us10, y.bei10), bp(yest.us10, yest.bei10), "Nominal − 10Y BEI. Gold/real-rate."),
    row("sofrff", "SOFR−FF", bp(y.sofr, y.effr), bp(yest.sofr, yest.effr), "RRp / reserves plumbing."),
    row("iorbff", "IORB−FF", bp(y.iorb, y.effr), bp(yest.iorb, yest.effr), "Fed corridor."),
  ];
}

export function yieldHistory(id: string, asOf: number, n = 90) {
  const out: { d: number; v: number }[] = [];
  for (let i = n - 1; i >= 0; i--) {
    const ts = asOf - i * 86_400_000;
    const s = yieldSpreads(ts).find((x) => x.id === id);
    out.push({ d: n - 1 - i, v: s?.value ?? 0 });
  }
  return out;
}
