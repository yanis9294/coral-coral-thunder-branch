import { hashStr, mulberry32, dayKey } from "@/lib/utils";
import { yieldLevels } from "./yields";

export interface StirContract {
  id: string;
  root: string;
  code: string;
  expiry: string;
  implied: number;
  chg: number;
  settle: number;
  volume: number;
  oi: number;
  curve: string;
}

export interface PolicyMeeting {
  id: string;
  ccy: string;
  bank: string;
  date: string;
  ts: number;
  current: number;
  implied: number;
  pCut25: number;
  pHold: number;
  pHike25: number;
  cumulativeBp: number;
}

export interface StirCurve {
  id: string;
  name: string;
  ccy: string;
  fixing: string;
  root: string;
  spot: number;
  contracts: StirContract[];
}

const QUARTERS = [
  { code: "U6", expiry: "Sep 2026", ts: Date.parse("2026-09-16T00:00:00Z") },
  { code: "Z6", expiry: "Dec 2026", ts: Date.parse("2026-12-16T00:00:00Z") },
  { code: "H7", expiry: "Mar 2027", ts: Date.parse("2027-03-17T00:00:00Z") },
  { code: "M7", expiry: "Jun 2027", ts: Date.parse("2027-06-16T00:00:00Z") },
  { code: "U7", expiry: "Sep 2027", ts: Date.parse("2027-09-15T00:00:00Z") },
  { code: "Z7", expiry: "Dec 2027", ts: Date.parse("2027-12-15T00:00:00Z") },
  { code: "H8", expiry: "Mar 2028", ts: Date.parse("2028-03-15T00:00:00Z") },
  { code: "M8", expiry: "Jun 2028", ts: Date.parse("2028-06-21T00:00:00Z") },
];

const CURVES: { id: string; name: string; ccy: string; fixing: string; root: string; spot: number; drift: number }[] = [
  { id: "sofr", name: "3M SOFR", ccy: "USD", fixing: "SOFR", root: "SFR", spot: 4.18, drift: -0.22 },
  { id: "ff", name: "30D Fed Funds", ccy: "USD", fixing: "EFFR", root: "ZQ", spot: 4.33, drift: -0.18 },
  { id: "euribor", name: "3M Euribor", ccy: "EUR", fixing: "EURIBOR", root: "ER", spot: 1.92, drift: -0.08 },
  { id: "sonia", name: "3M SONIA", ccy: "GBP", fixing: "SONIA", root: "SO3", spot: 3.98, drift: -0.14 },
  { id: "tona", name: "3M TONA", ccy: "JPY", fixing: "TONA", root: "TON", spot: 0.52, drift: 0.06 },
  { id: "corra", name: "3M CORRA", ccy: "CAD", fixing: "CORRA", root: "CRA", spot: 2.68, drift: -0.1 },
];

function impliedAt(curve: (typeof CURVES)[number], i: number, asOf: number) {
  const r = mulberry32(hashStr(curve.id + QUARTERS[i]!.code) ^ dayKey(asOf));
  const tYears = (i + 1) * 0.25;
  return curve.spot + curve.drift * (1 - Math.exp(-tYears / 1.4)) + (r() - 0.5) * 0.08;
}

export function stirCurves(asOf: number): StirCurve[] {
  return CURVES.map((c) => {
    const contracts: StirContract[] = QUARTERS.map((q, i) => {
      const r = mulberry32(hashStr(c.root + q.code) ^ dayKey(asOf));
      const implied = +impliedAt(c, i, asOf).toFixed(3);
      const yImp = +impliedAt(c, i, asOf - 86_400_000).toFixed(3);
      return {
        id: `${c.root}${q.code}`,
        root: c.root,
        code: `${c.root}${q.code}`,
        expiry: q.expiry,
        implied,
        chg: +((implied - yImp) * 100).toFixed(1),
        settle: +(100 - implied).toFixed(3),
        volume: Math.round(80_000 + r() * 220_000),
        oi: Math.round(400_000 + r() * 900_000),
        curve: c.id,
      };
    });
    return {
      id: c.id,
      name: c.name,
      ccy: c.ccy,
      fixing: c.fixing,
      root: c.root,
      spot: +impliedAt(c, 0, asOf).toFixed(3),
      contracts,
    };
  });
}

export function policyPath(asOf: number): PolicyMeeting[] {
  const y = yieldLevels(asOf);
  const meetings: { ccy: string; bank: string; date: string; ts: number; current: number }[] = [
    { ccy: "USD", bank: "FOMC", date: "29 Oct 2026", ts: Date.parse("2026-10-29T18:00:00Z"), current: y.effr },
    { ccy: "USD", bank: "FOMC", date: "10 Dec 2026", ts: Date.parse("2026-12-10T19:00:00Z"), current: y.effr },
    { ccy: "USD", bank: "FOMC", date: "28 Jan 2027", ts: Date.parse("2027-01-28T19:00:00Z"), current: y.effr },
    { ccy: "USD", bank: "FOMC", date: "18 Mar 2027", ts: Date.parse("2027-03-18T18:00:00Z"), current: y.effr },
    { ccy: "EUR", bank: "ECB", date: "17 Oct 2026", ts: Date.parse("2026-10-17T12:15:00Z"), current: 2.0 },
    { ccy: "EUR", bank: "ECB", date: "12 Dec 2026", ts: Date.parse("2026-12-12T13:15:00Z"), current: 2.0 },
    { ccy: "GBP", bank: "BoE", date: "06 Nov 2026", ts: Date.parse("2026-11-06T12:00:00Z"), current: 4.0 },
    { ccy: "JPY", bank: "BoJ", date: "30 Oct 2026", ts: Date.parse("2026-10-30T03:00:00Z"), current: 0.5 },
  ];
  let usdCum = 0;
  let eurCum = 0;
  return meetings.map((m, i) => {
    const r = mulberry32(hashStr(m.bank + m.date) ^ dayKey(asOf));
    const pCut = +(0.18 + r() * 0.45).toFixed(2);
    const pHike = +(0.04 + r() * 0.12).toFixed(2);
    const pHold = +(1 - pCut - pHike).toFixed(2);
    const step = (-25 * pCut + 25 * pHike);
    if (m.ccy === "USD") usdCum += step;
    if (m.ccy === "EUR") eurCum += step;
    const cum = m.ccy === "USD" ? usdCum : m.ccy === "EUR" ? eurCum : step;
    return {
      id: `mtg-${i}`,
      ...m,
      implied: +(m.current + cum / 100).toFixed(3),
      pCut25: pCut,
      pHold,
      pHike25: pHike,
      cumulativeBp: +cum.toFixed(1),
    };
  });
}

export function stirSpreads(asOf: number) {
  const curves = stirCurves(asOf);
  const sofr = curves.find((c) => c.id === "sofr")!;
  const ff = curves.find((c) => c.id === "ff")!;
  const er = curves.find((c) => c.id === "euribor")!;
  const so3 = curves.find((c) => c.id === "sonia")!;
  const y = yieldLevels(asOf);
  const redGreen = (a: StirContract, b: StirContract) => +((a.implied - b.implied) * 100).toFixed(1);
  return [
    { id: "fraois", name: "3M SOFR − EFFR", value: +((sofr.spot - y.effr) * 100).toFixed(1), unit: "bp", note: "FRA/OIS proxy (fixing vs funds)." },
    { id: "sfrffz", name: "SFRZ6 − ZQZ6", value: redGreen(sofr.contracts[1]!, ff.contracts[1]!), unit: "bp", note: "Dec SOFR vs FF basis." },
    { id: "edslp", name: "SFRZ6 − SFRU6", value: redGreen(sofr.contracts[1]!, sofr.contracts[0]!), unit: "bp", note: "Near whites slope (cuts priced)." },
    { id: "eurusd3m", name: "3M EURUSD implied", value: +((sofr.spot - er.spot) * 100).toFixed(1), unit: "bp", note: "Short-rate gap, not the NDF." },
    { id: "gbpusd3m", name: "3M GBPUSD implied", value: +((sofr.spot - so3.spot) * 100).toFixed(1), unit: "bp", note: "SONIA vs SOFR." },
  ];
}

export function stirStripHistory(root: string, asOf: number, n = 60) {
  const out: { d: number; u6: number; z6: number; h7: number; m7: number }[] = [];
  for (let i = n - 1; i >= 0; i--) {
    const ts = asOf - i * 86_400_000;
    const curve = stirCurves(ts).find((c) => c.root === root || c.id === root.toLowerCase() || c.contracts[0]?.root === root);
    const c = curve ?? stirCurves(ts)[0]!;
    out.push({
      d: n - 1 - i,
      u6: c.contracts[0]!.implied,
      z6: c.contracts[1]!.implied,
      h7: c.contracts[2]!.implied,
      m7: c.contracts[3]!.implied,
    });
  }
  return out;
}
