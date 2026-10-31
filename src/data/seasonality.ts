import { hashStr, mulberry32 } from "@/lib/utils";
import { mean, stdev } from "@/lib/stats";
import { pxOf } from "./prices";

export const SEASON_ASSETS = [
  { symbol: "WTI", name: "WTI crude", cls: "Energy" },
  { symbol: "XAU", name: "Gold", cls: "Metals" },
  { symbol: "SPX", name: "S&P 500", cls: "Index" },
  { symbol: "NDX", name: "Nasdaq 100", cls: "Index" },
  { symbol: "EURUSD", name: "Euro", cls: "FX" },
  { symbol: "USDJPY", name: "Dollar-yen", cls: "FX" },
  { symbol: "US10Y", name: "UST 10Y", cls: "Rates" },
  { symbol: "BBDXY", name: "Bloomberg dollar", cls: "FX" },
  { symbol: "DXY", name: "ICE DXY", cls: "FX" },
  { symbol: "BTC", name: "Bitcoin", cls: "Crypto" },
  { symbol: "NATGAS", name: "Henry Hub", cls: "Energy" },
  { symbol: "XAG", name: "Silver", cls: "Metals" },
] as const;

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

export interface MonthStat {
  month: number;
  label: string;
  avg: number;
  win: number;
  std: number;
  best: number;
  worst: number;
  n: number;
}

export interface SeasonCard {
  symbol: string;
  name: string;
  cls: string;
  thisMonth: MonthStat;
  nextMonth: MonthStat;
  now: number;
  vsSeason: number;
  heatmap: MonthStat[];
  currentMonth: number;
}

function monthReturns(symbol: string, month: number): number[] {
  const rng = mulberry32(hashStr(`${symbol}-m${month}`));
  const n = 12;
  const seasonal =
    symbol === "WTI"
      ? [0.4, 0.6, 1.1, 1.4, 0.2, -0.4, -0.2, 0.8, 1.6, 0.9, -0.3, 0.1][month]!
      : symbol === "XAU"
        ? [1.2, 0.4, -0.2, 0.6, 0.3, -0.4, 0.2, 0.5, 1.1, 0.8, 0.2, 0.7][month]!
        : symbol === "NATGAS"
          ? [0.8, -0.4, -1.2, -0.8, -0.5, 0.4, 0.6, 0.3, 0.9, 1.4, 1.8, 1.1][month]!
          : symbol === "SPX"
            ? [0.9, 0.2, 0.8, 0.6, 0.4, 0.1, 1.1, -0.4, -0.6, 0.8, 1.4, 1.1][month]!
            : symbol === "EURUSD"
              ? [-0.3, 0.2, 0.4, 0.1, -0.2, 0.3, 0.5, -0.1, -0.4, 0.2, 0.1, -0.2][month]!
              : symbol === "BTC"
                ? [2.1, 1.4, -0.8, 1.8, -1.2, -0.4, 1.1, -0.6, -0.3, 2.4, 1.6, 0.8][month]!
                : [0.1, 0.05, 0.2, 0.15, 0.05, -0.1, 0.2, -0.15, -0.2, 0.25, 0.3, 0.2][month]!;
  const out: number[] = [];
  for (let i = 0; i < n; i++) out.push(seasonal + (rng() - 0.5) * 2.4);
  return out;
}

function stat(month: number, xs: number[]): MonthStat {
  return {
    month,
    label: MONTHS[month]!,
    avg: +mean(xs).toFixed(2),
    win: +((xs.filter((v) => v > 0).length / xs.length) * 100).toFixed(0),
    std: +stdev(xs, 1).toFixed(2),
    best: +Math.max(...xs).toFixed(2),
    worst: +Math.min(...xs).toFixed(2),
    n: xs.length,
  };
}

export function seasonality(asOf: number): SeasonCard[] {
  const m = new Date(asOf).getUTCMonth();
  return SEASON_ASSETS.map((a) => {
    const heatmap = MONTHS.map((_, i) => stat(i, monthReturns(a.symbol, i)));
    const thisMonth = heatmap[m]!;
    const nextMonth = heatmap[(m + 1) % 12]!;
    const now = pxOf(a.symbol, asOf).chg;
    return {
      ...a,
      thisMonth,
      nextMonth,
      now,
      vsSeason: +(now - thisMonth.avg).toFixed(2),
      heatmap,
      currentMonth: m,
    };
  });
}

export function seasonHistory(symbol: string) {
  return MONTHS.map((_, i) => {
    const s = stat(i, monthReturns(symbol, i));
    return { m: s.label, avg: s.avg, win: s.win, best: s.best, worst: s.worst };
  });
}
