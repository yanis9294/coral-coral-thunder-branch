import { createServerFn } from "@tanstack/react-start";
import { CONGRESS_CACHE, type CongressTrade } from "@/data/invest/congress";
import type { AnnualSnap } from "@/data/invest/dcf";

const UA = "Mozilla/5.0 (compatible; ARGOS-Desk/1.0)";

async function getJson<T>(url: string, ms = 12000): Promise<T | null> {
  const ctrl = new AbortController();
  const t = setTimeout(() => ctrl.abort(), ms);
  try {
    const res = await fetch(url, { headers: { "User-Agent": UA, Accept: "application/json" }, signal: ctrl.signal });
    if (!res.ok) return null;
    return (await res.json()) as T;
  } catch {
    return null;
  } finally {
    clearTimeout(t);
  }
}

export interface PxPoint {
  t: number;
  v: number;
}

type ChartResp = {
  chart?: {
    result?: {
      timestamp?: number[];
      meta?: { regularMarketPrice?: number; symbol?: string };
      indicators?: { quote?: { close?: (number | null)[] }[] };
    }[];
  };
};

export async function yahooChart(symbol: string, range = "5y"): Promise<{ px: PxPoint[]; last: number } | null> {
  const json = await getJson<ChartResp>(
    `https://query1.finance.yahoo.com/v8/finance/chart/${encodeURIComponent(symbol)}?range=${range}&interval=1d&events=div`,
  );
  const r = json?.chart?.result?.[0];
  if (!r?.timestamp || !r.indicators?.quote?.[0]?.close) return null;
  const close = r.indicators.quote[0].close;
  const px: PxPoint[] = [];
  for (let i = 0; i < r.timestamp.length; i++) {
    const v = close[i];
    if (v && v > 0) px.push({ t: r.timestamp[i]! * 1000, v });
  }
  const last = r.meta?.regularMarketPrice ?? px.at(-1)?.v ?? 0;
  return { px, last };
}

type TsResp = {
  timeseries?: {
    result?: {
      timestamp?: number[];
      [k: string]: unknown;
    }[];
  };
};

function seriesOf(json: TsResp | null, key: string): { t: number; v: number }[] {
  const rows = json?.timeseries?.result ?? [];
  for (const row of rows) {
    const arr = row[key];
    if (!Array.isArray(arr)) continue;
    const out: { t: number; v: number }[] = [];
    for (const p of arr as { asOfDate?: string; reportedValue?: { raw?: number } }[]) {
      const v = p.reportedValue?.raw;
      const t = p.asOfDate ? Date.parse(p.asOfDate) : NaN;
      if (Number.isFinite(v) && Number.isFinite(t)) out.push({ t, v: v as number });
    }
    return out.sort((a, b) => a.t - b.t);
  }
  return [];
}

function lastOf(xs: { v: number }[]): number {
  return xs.at(-1)?.v ?? NaN;
}

function betaOf(stock: PxPoint[], mkt: PxPoint[]): number {
  const sm = new Map(mkt.map((p) => [new Date(p.t).toISOString().slice(0, 10), p.v]));
  const rs: number[] = [];
  const rm: number[] = [];
  for (let i = 1; i < stock.length; i++) {
    const d0 = new Date(stock[i - 1]!.t).toISOString().slice(0, 10);
    const d1 = new Date(stock[i]!.t).toISOString().slice(0, 10);
    const m0 = sm.get(d0);
    const m1 = sm.get(d1);
    const s0 = stock[i - 1]!.v;
    const s1 = stock[i]!.v;
    if (m0 && m1 && s0 > 0 && s1 > 0) {
      rs.push(s1 / s0 - 1);
      rm.push(m1 / m0 - 1);
    }
  }
  if (rs.length < 40) return 1;
  const ms = rs.reduce((a, b) => a + b, 0) / rs.length;
  const mm = rm.reduce((a, b) => a + b, 0) / rm.length;
  let cov = 0;
  let varM = 0;
  for (let i = 0; i < rs.length; i++) {
    cov += (rs[i]! - ms) * (rm[i]! - mm);
    varM += (rm[i]! - mm) ** 2;
  }
  if (varM === 0) return 1;
  return cov / varM;
}

function parseYield(v: number): number {
  if (v > 20) return v / 1000;
  if (v > 1) return v / 100;
  return v;
}

const TS_TYPES = [
  "annualFreeCashFlow",
  "trailingFreeCashFlow",
  "annualNetDebt",
  "trailingNetDebt",
  "annualTotalDebt",
  "annualCashAndCashEquivalents",
  "annualInterestExpense",
  "annualNetIncome",
  "annualTotalRevenue",
  "annualGrossProfit",
  "annualOperatingIncome",
  "annualStockholdersEquity",
  "annualTotalAssets",
  "annualCurrentAssets",
  "annualCurrentLiabilities",
  "annualLongTermDebt",
  "annualShareIssued",
  "annualOperatingCashFlow",
  "trailingMarketCap",
  "trailingEps",
].join(",");

export interface FundPacket {
  ticker: string;
  price: number;
  px: PxPoint[];
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
  revenue?: number;
  gp?: number;
  opInc?: number;
  ni?: number;
  equity?: number;
  assets?: number;
  ca?: number;
  cl?: number;
  cash?: number;
  eps?: number;
  cur?: AnnualSnap;
  prev?: AnnualSnap;
  source: "live" | "cache";
}

export const fetchFundamentals = createServerFn({ method: "POST" })
  .validator((d: { ticker: string }) => d)
  .handler(async ({ data }): Promise<{ ok: true; packet: FundPacket } | { ok: false; error: string }> => {
    const ticker = data.ticker.trim().toUpperCase();
    const now = Math.floor(Date.now() / 1000);
    const p1 = now - 12 * 365 * 86400;
    const [chart, spy, tnx, gspc, ts] = await Promise.all([
      yahooChart(ticker, "5y"),
      yahooChart("SPY", "5y"),
      yahooChart("^TNX", "5d"),
      yahooChart("^GSPC", "10y"),
      getJson<TsResp>(
        `https://query1.finance.yahoo.com/ws/fundamentals-timeseries/v1/finance/timeseries/${encodeURIComponent(ticker)}?type=${TS_TYPES}&period1=${p1}&period2=${now}`,
      ),
    ]);
    if (!chart || chart.px.length < 30) {
      return { ok: false, error: `No Yahoo chart for ${ticker}. Try AAPL, MSFT, NVDA…` };
    }
    const fcf = seriesOf(ts, "annualFreeCashFlow");
    const fcfTrail = seriesOf(ts, "trailingFreeCashFlow");
    const fcfHistory = (fcf.length >= 2 ? fcf : fcfTrail).map((x) => x.v);
    if (fcfHistory.length < 2) {
      return { ok: false, error: `FCF history too short for ${ticker}.` };
    }
    const netDebtS = seriesOf(ts, "annualNetDebt");
    const debtS = seriesOf(ts, "annualTotalDebt");
    const cashS = seriesOf(ts, "annualCashAndCashEquivalents");
    const intS = seriesOf(ts, "annualInterestExpense");
    const sharesS = seriesOf(ts, "annualShareIssued");
    const mcapS = seriesOf(ts, "trailingMarketCap");
    const niS = seriesOf(ts, "annualNetIncome");
    const revS = seriesOf(ts, "annualTotalRevenue");
    const gpS = seriesOf(ts, "annualGrossProfit");
    const opS = seriesOf(ts, "annualOperatingIncome");
    const eqS = seriesOf(ts, "annualStockholdersEquity");
    const taS = seriesOf(ts, "annualTotalAssets");
    const caS = seriesOf(ts, "annualCurrentAssets");
    const clS = seriesOf(ts, "annualCurrentLiabilities");
    const ltdS = seriesOf(ts, "annualLongTermDebt");
    const ocfS = seriesOf(ts, "annualOperatingCashFlow");
    const epsS = seriesOf(ts, "trailingEps");
    const rf = parseYield(tnx?.last ?? 4.12);
    const rm = gspc && gspc.px.length > 2 ? (gspc.px.at(-1)!.v / gspc.px[0]!.v) ** (1 / 10) - 1 : 0.09;
    const beta = spy ? betaOf(chart.px, spy.px) : 1;
    const shares = lastOf(sharesS) || 1e9;
    const marketCap = lastOf(mcapS) || chart.last * shares;
    const totalDebt = lastOf(debtS) || 0;
    const cash = lastOf(cashS) || 0;
    const netDebt = Number.isFinite(lastOf(netDebtS)) ? lastOf(netDebtS) : totalDebt - cash;
    const snap = (iFromEnd: number): AnnualSnap => {
      const at = (s: { v: number }[]) => s.at(s.length - 1 - iFromEnd)?.v;
      return {
        ni: at(niS),
        assets: at(taS),
        ocf: at(ocfS),
        ltd: at(ltdS),
        ca: at(caS),
        cl: at(clS),
        gp: at(gpS),
        rev: at(revS),
        shares: at(sharesS),
      };
    };
    return {
      ok: true,
      packet: {
        ticker,
        price: chart.last,
        px: chart.px,
        fcfHistory,
        netDebt,
        shares,
        beta,
        rf,
        rm,
        marketCap,
        totalDebt,
        interest: Math.abs(lastOf(intS) || 0),
        taxRate: 0.21,
        revenue: lastOf(revS),
        gp: lastOf(gpS),
        opInc: lastOf(opS),
        ni: lastOf(niS),
        equity: lastOf(eqS),
        assets: lastOf(taS),
        ca: lastOf(caS),
        cl: lastOf(clS),
        cash,
        eps: lastOf(epsS),
        cur: snap(0),
        prev: snap(1),
        source: "live",
      },
    };
  });

export const fetchPrices = createServerFn({ method: "POST" })
  .validator((d: { tickers: string[]; range?: string }) => d)
  .handler(async ({ data }): Promise<{ ok: true; series: Record<string, PxPoint[]> } | { ok: false; error: string }> => {
    const tickers = data.tickers.map((t) => t.trim().toUpperCase()).filter(Boolean).slice(0, 12);
    const range = data.range ?? "3y";
    const pairs = await Promise.all(tickers.map(async (t) => [t, await yahooChart(t, range)] as const));
    const series: Record<string, PxPoint[]> = {};
    for (const [t, p] of pairs) if (p) series[t] = p.px;
    if (!Object.keys(series).length) return { ok: false, error: "Yahoo chart empty." };
    return { ok: true, series };
  });

export const fetchCongressTape = createServerFn({ method: "POST" }).handler(async (): Promise<{
  trades: CongressTrade[];
  live: boolean;
}> => {
  /* Capitol Trades is challenge-walled from this host. Disclosed Capitol needs a key.
     We surface the public-tape cache and tag it so the desk does not confuse it with a live PTR feed. */
  return { trades: CONGRESS_CACHE, live: false };
});
