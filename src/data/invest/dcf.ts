/**
 * Port of vendor/invest/dcf_model.py — DCF, WACC/CAPM, Gordon, Piotroski, Graham.
 * Live financials come from Yahoo timeseries when the server can reach it;
 * otherwise a dated cache. Look-ahead: beta/price are current, FCF is historical.
 */
import { mean } from "@/lib/stats";

export const SECTOR_ETF: Record<string, string> = {
  Technology: "XLK",
  "Financial Services": "XLF",
  Financials: "XLF",
  Energy: "XLE",
  "Health Care": "XLV",
  Healthcare: "XLV",
  "Consumer Cyclical": "XLY",
  "Consumer Discretionary": "XLY",
  "Consumer Defensive": "XLP",
  "Consumer Staples": "XLP",
  Industrials: "XLI",
  Materials: "XLB",
  "Real Estate": "XLRE",
  Utilities: "XLU",
  "Communication Services": "XLC",
};

export function safeDiv(a?: number | null, b?: number | null): number {
  if (a == null || b == null || !Number.isFinite(a) || !Number.isFinite(b) || b === 0) return NaN;
  return a / b;
}

export function cagr(start: number, end: number, periods: number): number | null {
  if (!(start > 0) || !Number.isFinite(end) || !periods) return null;
  return (end / start) ** (1 / periods) - 1;
}

export function projectFcf(history: number[], years = 5, growth?: number): { projected: number[]; g: number } {
  const values = history.filter((v) => Number.isFinite(v));
  let g = growth;
  if (g == null) {
    if (values.some((v) => v <= 0)) {
      const yoy: number[] = [];
      for (let i = 1; i < values.length; i++) yoy.push((values[i]! - values[i - 1]!) / Math.abs(values[i - 1]!));
      g = Math.max(-0.5, Math.min(0.5, mean(yoy)));
    } else {
      const raw = cagr(values[0]!, values[values.length - 1]!, values.length - 1);
      g = raw == null ? 0.03 : Math.max(-0.5, Math.min(0.5, raw));
    }
  }
  const last = values[values.length - 1] ?? 0;
  const projected = Array.from({ length: years }, (_, i) => last * (1 + g) ** (i + 1));
  return { projected, g };
}

export function dcfIntrinsic(opts: {
  fcf: number[];
  wacc: number;
  terminalG: number;
  netDebt: number;
  shares: number;
}): { ev: number; equity: number; perShare: number; pvFcf: number; pvTerm: number } {
  const { fcf, wacc, terminalG, netDebt, shares } = opts;
  if (wacc <= terminalG) {
    throw new Error(`WACC (${(wacc * 100).toFixed(2)}%) must exceed terminal g (${(terminalG * 100).toFixed(2)}%).`);
  }
  const pv = fcf.map((v, i) => v / (1 + wacc) ** (i + 1));
  const term = (fcf[fcf.length - 1]! * (1 + terminalG)) / (wacc - terminalG);
  const pvTerm = term / (1 + wacc) ** fcf.length;
  const ev = pv.reduce((s, x) => s + x, 0) + pvTerm;
  const equity = ev - netDebt;
  return { ev, equity, perShare: equity / shares, pvFcf: pv.reduce((s, x) => s + x, 0), pvTerm };
}

export function gordonShapiro(dps: number, ke: number, g: number): number | null {
  if (ke <= g) return null;
  return (dps * (1 + g)) / (ke - g);
}

export function recommendation(intrinsic: number, price: number, margin = 0.05): "BUY" | "SELL" | "HOLD" {
  if (intrinsic * (1 - margin) > price) return "BUY";
  if (intrinsic * (1 + margin) < price) return "SELL";
  return "HOLD";
}

export function grahamNumber(eps: number, book: number): number | null {
  if (!(eps > 0) || !(book > 0)) return null;
  return Math.sqrt(22.5 * eps * book);
}

export interface DcfInputs {
  ticker: string;
  price: number;
  fcfHistory: number[];
  netDebt: number;
  shares: number;
  beta: number;
  rf: number;
  rm: number;
  marketCap: number;
  totalDebt: number;
  interest: number;
  taxRate: number;
  sector?: string;
  terminalG?: number;
  fcfG?: number;
  years?: number;
}

export interface DcfReport {
  ticker: string;
  price: number;
  intrinsic: number;
  mos: number;
  wacc: number;
  ke: number;
  kd: number;
  tax: number;
  fcfG: number;
  terminalG: number;
  netDebt: number;
  shares: number;
  beta: number;
  rf: number;
  rm: number;
  projected: number[];
  rec: "BUY" | "SELL" | "HOLD";
  source: "live" | "cache";
}

export function runDcf(inp: DcfInputs, source: "live" | "cache" = "cache"): DcfReport {
  const years = inp.years ?? 5;
  const { projected, g } = projectFcf(inp.fcfHistory, years, inp.fcfG);
  const kd = inp.totalDebt > 0 ? Math.max(0, safeDiv(Math.abs(inp.interest), inp.totalDebt) || 0.04) : 0;
  const ke = inp.rf + inp.beta * (inp.rm - inp.rf);
  const total = inp.marketCap + Math.max(0, inp.totalDebt);
  const we = total > 0 ? inp.marketCap / total : 1;
  const wd = 1 - we;
  const tax = Number.isFinite(inp.taxRate) ? inp.taxRate : 0.21;
  const wacc = we * ke + wd * kd * (1 - tax);
  let tg = inp.terminalG;
  if (tg == null) tg = Math.min(0.04, wacc - 0.005);
  if (tg >= wacc) tg = wacc - 0.005;
  const d = dcfIntrinsic({ fcf: projected, wacc, terminalG: tg, netDebt: inp.netDebt, shares: inp.shares });
  const mos = (d.perShare - inp.price) / inp.price;
  return {
    ticker: inp.ticker,
    price: inp.price,
    intrinsic: d.perShare,
    mos,
    wacc,
    ke,
    kd,
    tax,
    fcfG: g,
    terminalG: tg,
    netDebt: inp.netDebt,
    shares: inp.shares,
    beta: inp.beta,
    rf: inp.rf,
    rm: inp.rm,
    projected,
    rec: recommendation(d.perShare, inp.price),
    source,
  };
}

export interface RatioSnap {
  ticker: string;
  price: number;
  marketCap: number;
  grossMargin: number;
  opMargin: number;
  netMargin: number;
  roe: number;
  leverage: number;
  currentRatio: number;
  pe: number;
  pb: number;
  ps: number;
  graham: number | null;
  book: number;
  eps: number;
  piotroski: number | null;
}

export function ratiosFrom(inp: {
  ticker: string;
  price: number;
  marketCap: number;
  shares: number;
  revenue?: number;
  gp?: number;
  opInc?: number;
  ni?: number;
  equity?: number;
  assets?: number;
  ca?: number;
  cl?: number;
  debt?: number;
  cash?: number;
  eps?: number;
  piotroski?: number | null;
}): RatioSnap {
  const book = safeDiv(inp.equity, inp.shares);
  const eps = inp.eps ?? NaN;
  return {
    ticker: inp.ticker,
    price: inp.price,
    marketCap: inp.marketCap,
    grossMargin: safeDiv(inp.gp, inp.revenue),
    opMargin: safeDiv(inp.opInc, inp.revenue),
    netMargin: safeDiv(inp.ni, inp.revenue),
    roe: safeDiv(inp.ni, inp.equity),
    leverage: safeDiv(inp.assets, inp.equity),
    currentRatio: safeDiv(inp.ca, inp.cl),
    pe: safeDiv(inp.price, eps),
    pb: safeDiv(inp.marketCap, inp.equity),
    ps: safeDiv(inp.marketCap, inp.revenue),
    graham: grahamNumber(eps, book),
    book,
    eps,
    piotroski: inp.piotroski ?? null,
  };
}

/** Piotroski F (0–9) from two annual snapshots. */
export function piotroski(cur: AnnualSnap, prev: AnnualSnap): number {
  const roaC = safeDiv(cur.ni, cur.assets);
  const roaP = safeDiv(prev.ni, prev.assets);
  const crC = safeDiv(cur.ca, cur.cl);
  const crP = safeDiv(prev.ca, prev.cl);
  const gmC = safeDiv(cur.gp, cur.rev);
  const gmP = safeDiv(prev.gp, prev.rev);
  const atC = safeDiv(cur.rev, cur.assets);
  const atP = safeDiv(prev.rev, prev.assets);
  const checks = [
    cur.ni != null && cur.ni > 0,
    cur.ocf != null && cur.ocf > 0,
    Number.isFinite(roaC) && Number.isFinite(roaP) && roaC > roaP,
    cur.ocf != null && cur.ni != null && cur.ocf > cur.ni,
    (cur.ltd ?? 0) <= (prev.ltd ?? 0),
    Number.isFinite(crC) && Number.isFinite(crP) && crC > crP,
    cur.shares != null && prev.shares != null && cur.shares <= prev.shares,
    Number.isFinite(gmC) && Number.isFinite(gmP) && gmC > gmP,
    Number.isFinite(atC) && Number.isFinite(atP) && atC > atP,
  ];
  return checks.filter(Boolean).length;
}

export interface AnnualSnap {
  ni?: number;
  assets?: number;
  ocf?: number;
  ltd?: number;
  ca?: number;
  cl?: number;
  gp?: number;
  rev?: number;
  shares?: number;
}
