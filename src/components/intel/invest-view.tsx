import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import { BoundArea, BoundBar, BoundScatter } from "@/lib/chart";
import { piotroski, ratiosFrom, runDcf, type DcfReport, type RatioSnap } from "@/data/invest/dcf";
import {
  alignedCloses,
  annStats,
  backtestMetrics,
  bestSharpe,
  equalWeight,
  minVol,
  monteCarlo,
  pctReturns,
  walkForward,
} from "@/data/invest/portfolio";
import { amountMid, disclosureLag, tickerSentiment, type CongressTrade } from "@/data/invest/congress";
import { newUserThesis } from "@/data/theses";
import { fetchCongressTape, fetchFundamentals, fetchPrices, type FundPacket } from "@/lib/market-data";
import { cn, fmtPct } from "@/lib/utils";
import { useTerminal } from "@/store/terminal";
import { IntelPage } from "./page";

type Tab = "dcf" | "book" | "congress";

export function InvestView() {
  const [tab, setTab] = useState<Tab>("dcf");
  return (
    <IntelPage
      title="Invest"
      kicker="DCF · Markowitz · STOCK Act — port of the desk toolkit"
      actions={
        <div className="flex gap-1">
          {(["dcf", "book", "congress"] as const).map((t) => (
            <button
              key={t}
              type="button"
              onClick={() => setTab(t)}
              className={cn("h-7 px-2 font-mono text-[10px] uppercase", tab === t ? "text-fg" : "text-fg-muted")}
            >
              {t === "dcf" ? "DCF" : t === "book" ? "Portfolio" : "Congress"}
            </button>
          ))}
        </div>
      }
    >
      {tab === "dcf" && <DcfPanel />}
      {tab === "book" && <BookPanel />}
      {tab === "congress" && <CongressPanel />}
    </IntelPage>
  );
}

function DcfPanel() {
  const nav = useNavigate();
  const add = useTerminal((s) => s.addThesis);
  const [ticker, setTicker] = useState("AAPL");
  const [years, setYears] = useState(5);
  const [gOver, setGOver] = useState("");
  const [tgOver, setTgOver] = useState("");
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState<string | null>(null);
  const [pack, setPack] = useState<FundPacket | null>(null);
  const [rep, setRep] = useState<DcfReport | null>(null);
  const [rat, setRat] = useState<RatioSnap | null>(null);

  const run = async () => {
    setBusy(true);
    setErr(null);
    try {
      const r = await fetchFundamentals({ data: { ticker } });
      if (!r.ok) {
        setErr(r.error);
        return;
      }
      const p = r.packet;
      setPack(p);
      const report = runDcf(
        {
          ticker: p.ticker,
          price: p.price,
          fcfHistory: p.fcfHistory,
          netDebt: p.netDebt,
          shares: p.shares,
          beta: p.beta,
          rf: p.rf,
          rm: p.rm,
          marketCap: p.marketCap,
          totalDebt: p.totalDebt,
          interest: p.interest,
          taxRate: p.taxRate,
          years,
          fcfG: gOver ? Number(gOver) : undefined,
          terminalG: tgOver ? Number(tgOver) : undefined,
        },
        p.source,
      );
      setRep(report);
      const f = p.cur && p.prev ? piotroski(p.cur, p.prev) : null;
      setRat(
        ratiosFrom({
          ticker: p.ticker,
          price: p.price,
          marketCap: p.marketCap,
          shares: p.shares,
          revenue: p.revenue,
          gp: p.gp,
          opInc: p.opInc,
          ni: p.ni,
          equity: p.equity,
          assets: p.assets,
          ca: p.ca,
          cl: p.cl,
          debt: p.totalDebt,
          cash: p.cash,
          eps: p.eps,
          piotroski: f,
        }),
      );
    } catch (e) {
      setErr(e instanceof Error ? e.message : "DCF failed");
    } finally {
      setBusy(false);
    }
  };

  const saveThesis = () => {
    if (!rep) return;
    const t = newUserThesis({
      title: `${rep.ticker} DCF ${rep.rec} — IV ${rep.intrinsic.toFixed(2)} vs ${rep.price.toFixed(2)}`,
      instrument: rep.ticker,
      domain: "Equities",
      type: "Trade",
      entry: rep.price,
      target: rep.intrinsic,
      last: rep.price,
      unit: "px",
      horizon: `${years}y explicit`,
      memo: `DCF two-stage (FCF + Gordon terminal). WACC ${(rep.wacc * 100).toFixed(2)}%, FCF g ${(rep.fcfG * 100).toFixed(1)}%, terminal ${(rep.terminalG * 100).toFixed(1)}%, β ${rep.beta.toFixed(2)}. MOS ${fmtPct(rep.mos * 100)}. Source ${rep.source}. Look-ahead: beta and spot are current; FCF is historical annual.`,
      supports: [`Intrinsic ${rep.intrinsic.toFixed(2)}`, `WACC ${(rep.wacc * 100).toFixed(2)}%`, rat?.piotroski != null ? `Piotroski ${rat.piotroski}/9` : "F-score n/a"],
      cuts: ["Yahoo TTM is not point-in-time", "Terminal g is a desk choice", "No control premium"],
      changeMind: ["FCF g revised below WACC − 200bp", "Net debt jump that the model did not see"],
      analyst: "Invest · DCF",
      links: [{ label: "Invest", href: "/invest" }],
    });
    add(t);
    nav({ to: "/theses/$id", params: { id: t.id } });
  };

  return (
    <div className="p-3 md:p-4">
      <p className="text-[12px] text-fg-muted">
        Engine is the TypeScript port of <span className="font-mono">dcf_model.py</span>. Financials from Yahoo timeseries (annual FCF, net debt, shares). Price/β from the daily chart vs SPY. CAGR of ^GSPC for Rm, ^TNX for Rf.
      </p>
      <div className="mt-3 flex flex-wrap items-end gap-2">
        <label className="flex flex-col gap-1 font-mono text-[10px] text-fg-subtle">
          Ticker
          <input value={ticker} onChange={(e) => setTicker(e.target.value.toUpperCase())} className="h-8 w-24 border border-border bg-bg-panel px-2 text-[12px] text-fg" />
        </label>
        <label className="flex flex-col gap-1 font-mono text-[10px] text-fg-subtle">
          Years
          <input type="number" value={years} onChange={(e) => setYears(Number(e.target.value))} className="h-8 w-16 border border-border bg-bg-panel px-2 text-[12px] text-fg" />
        </label>
        <label className="flex flex-col gap-1 font-mono text-[10px] text-fg-subtle">
          FCF g override
          <input value={gOver} onChange={(e) => setGOver(e.target.value)} placeholder="auto" className="h-8 w-20 border border-border bg-bg-panel px-2 text-[12px] text-fg" />
        </label>
        <label className="flex flex-col gap-1 font-mono text-[10px] text-fg-subtle">
          Terminal g
          <input value={tgOver} onChange={(e) => setTgOver(e.target.value)} placeholder="auto" className="h-8 w-20 border border-border bg-bg-panel px-2 text-[12px] text-fg" />
        </label>
        <button type="button" onClick={() => void run()} disabled={busy} className="h-8 rounded-sm border border-border px-3 font-mono text-[11px] hover:bg-bg-hover">
          {busy ? "Running…" : "Run DCF"}
        </button>
      </div>
      {err && <p className="mt-2 font-mono text-[11px] text-bear">{err}</p>}
      {rep && (
        <>
          <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            <Tile k="Price" v={rep.price.toFixed(2)} />
            <Tile k="Intrinsic" v={rep.intrinsic.toFixed(2)} />
            <Tile k="MOS" v={fmtPct(rep.mos * 100)} tone={rep.mos >= 0 ? "bull" : "bear"} />
            <Tile k="Rec" v={rep.rec} tone={rep.rec === "BUY" ? "bull" : rep.rec === "SELL" ? "bear" : undefined} />
          </div>
          <dl className="mt-3 grid grid-cols-2 gap-2 font-mono text-[12px] sm:grid-cols-4">
            <KV k="WACC" v={`${(rep.wacc * 100).toFixed(2)}%`} />
            <KV k="Ke / Kd" v={`${(rep.ke * 100).toFixed(2)} / ${(rep.kd * 100).toFixed(2)}`} />
            <KV k="β / Rf / Rm" v={`${rep.beta.toFixed(2)} / ${(rep.rf * 100).toFixed(2)} / ${(rep.rm * 100).toFixed(1)}`} />
            <KV k="g / g∞" v={`${(rep.fcfG * 100).toFixed(1)} / ${(rep.terminalG * 100).toFixed(1)}`} />
          </dl>
          <div className="mt-4 grid gap-4 lg:grid-cols-2">
            <div className="h-52 overflow-hidden rounded-md border border-border bg-bg-elevated p-2">
              <BoundBar data={rep.projected.map((v, i) => ({ y: `Y${i + 1}`, v: v / 1e9 }))} xKey="y" yKey="v" />
            </div>
            {pack && (
              <div className="h-52 overflow-hidden rounded-md border border-border bg-bg-elevated p-2">
                <BoundArea
                  data={pack.px.slice(-252).map((p, i) => ({ d: i, v: p.v, iv: rep.intrinsic }))}
                  xKey="d"
                  yKey="v"
                />
              </div>
            )}
          </div>
          <p className="mt-1 font-mono text-[10px] text-fg-subtle">Left: projected FCF ($bn). Right: last 252 sessions vs model (area = spot).</p>
          {rat && (
            <div className="mt-4 overflow-x-auto">
              <table className="w-full min-w-[640px] text-left font-mono text-[12px]">
                <thead className="text-[10px] text-fg-subtle uppercase">
                  <tr>
                    {["GM", "OM", "NM", "ROE", "Lev", "CR", "P/E", "P/B", "Graham", "F"].map((h) => (
                      <th key={h} className="px-2 py-1">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-t border-border">
                    <td className="px-2 py-2">{pctOrDash(rat.grossMargin)}</td>
                    <td className="px-2">{pctOrDash(rat.opMargin)}</td>
                    <td className="px-2">{pctOrDash(rat.netMargin)}</td>
                    <td className="px-2">{pctOrDash(rat.roe)}</td>
                    <td className="px-2">{numOrDash(rat.leverage)}</td>
                    <td className="px-2">{numOrDash(rat.currentRatio)}</td>
                    <td className="px-2">{numOrDash(rat.pe)}</td>
                    <td className="px-2">{numOrDash(rat.pb)}</td>
                    <td className="px-2">{rat.graham?.toFixed(1) ?? "—"}</td>
                    <td className="px-2">{rat.piotroski ?? "—"}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          )}
          <button type="button" onClick={saveThesis} className="mt-4 h-8 rounded-sm border border-border px-3 font-mono text-[11px] hover:bg-bg-hover">
            Save as thesis
          </button>
        </>
      )}
    </div>
  );
}

function BookPanel() {
  const [raw, setRaw] = useState("META, AMZN, AAPL, NFLX, GOOG");
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState<string | null>(null);
  const [tickers, setTickers] = useState<string[]>([]);
  const [avg, setAvg] = useState<number[]>([]);
  const [mcRows, setMcRows] = useState<{ ret: number; vol: number; sharpe: number }[]>([]);
  const [sh, setSh] = useState<{ w: number[]; ret: number; vol: number; sharpe: number } | null>(null);
  const [mv, setMv] = useState<{ w: number[]; ret: number; vol: number; sharpe: number } | null>(null);
  const [ew, setEw] = useState<ReturnType<typeof backtestMetrics> | null>(null);
  const [wf, setWf] = useState<ReturnType<typeof backtestMetrics> | null>(null);

  const run = async () => {
    setBusy(true);
    setErr(null);
    try {
      const ts = raw.split(/[,\s]+/).map((s) => s.trim().toUpperCase()).filter(Boolean);
      const r = await fetchPrices({ data: { tickers: ts, range: "3y" } });
      if (!r.ok) {
        setErr(r.error);
        return;
      }
      const aligned = alignedCloses(ts.map((t) => r.series[t] ?? []));
      if (aligned.length < 80) {
        setErr("Not enough overlapping history.");
        return;
      }
      const cols = ts.map((_, i) => aligned.map((row) => row.px[i]!));
      const rets = pctReturns(cols);
      const stats = annStats(rets);
      const mc = monteCarlo(stats.avg, stats.cov, 3500, 0, 7);
      const b = bestSharpe(mc);
      const m = minVol(mc);
      const ewRets = rets[0]!.map((_, t) => equalWeight(ts.length).reduce((s, w, i) => s + w * rets[i]![t]!, 0));
      const wfRets = walkForward(rets, 180, 21, 0);
      setTickers(ts);
      setAvg(stats.avg);
      setMcRows(mc.rows);
      setSh(b);
      setMv(m);
      setEw(backtestMetrics(ewRets));
      setWf(backtestMetrics(wfRets));
    } catch (e) {
      setErr(e instanceof Error ? e.message : "Book failed");
    } finally {
      setBusy(false);
    }
  };

  const scatter = useMemo(() => mcRows.map((r) => ({ x: r.vol * 100, y: r.ret * 100 })), [mcRows]);
  const hi = useMemo(() => {
    const pts: { x: number; y: number }[] = [];
    if (sh) pts.push({ x: sh.vol * 100, y: sh.ret * 100 });
    if (mv) pts.push({ x: mv.vol * 100, y: mv.ret * 100 });
    return pts;
  }, [sh, mv]);

  return (
    <div className="p-3 md:p-4">
      <p className="text-[12px] text-fg-muted">
        Port of <span className="font-mono">portfolio_optimization.py</span>. Monte Carlo long-only simplex (no scipy). Walk-forward uses only the trailing 180 sessions — no look-ahead.
      </p>
      <div className="mt-3 flex flex-wrap gap-2">
        <input
          value={raw}
          onChange={(e) => setRaw(e.target.value)}
          className="h-8 min-w-[240px] flex-1 border border-border bg-bg-panel px-2 font-mono text-[12px]"
        />
        <button type="button" onClick={() => void run()} disabled={busy} className="h-8 rounded-sm border border-border px-3 font-mono text-[11px] hover:bg-bg-hover">
          {busy ? "Optimising…" : "Build book"}
        </button>
      </div>
      {err && <p className="mt-2 font-mono text-[11px] text-bear">{err}</p>}
      {sh && mv && (
        <>
          <div className="mt-4 h-64 overflow-hidden rounded-md border border-border bg-bg-elevated p-2">
            <BoundScatter data={scatter} xKey="x" yKey="y" highlight={hi} />
          </div>
          <p className="mt-1 font-mono text-[10px] text-fg-subtle">X = ann. vol % · Y = ann. return %. Gold = max-Sharpe and min-vol.</p>
          <div className="mt-4 overflow-x-auto">
            <table className="w-full min-w-[520px] text-left font-mono text-[12px]">
              <thead className="text-[10px] text-fg-subtle uppercase">
                <tr>
                  <th className="px-2 py-1">Asset</th>
                  <th>E[r]</th>
                  <th>Max Sharpe</th>
                  <th>Min vol</th>
                  <th>1/N</th>
                </tr>
              </thead>
              <tbody>
                {tickers.map((t, i) => (
                  <tr key={t} className="border-t border-border">
                    <td className="px-2 py-2">{t}</td>
                    <td>{fmtPct(avg[i]! * 100)}</td>
                    <td>{fmtPct(sh.w[i]! * 100, 1, false)}</td>
                    <td>{fmtPct(mv.w[i]! * 100, 1, false)}</td>
                    <td>{fmtPct((100 / tickers.length), 1, false)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            {ew && <MetricCard title="Equal weight (in-sample)" m={ew} />}
            {wf && <MetricCard title="Walk-forward max-Sharpe" m={wf} />}
          </div>
        </>
      )}
    </div>
  );
}

function CongressPanel() {
  const nav = useNavigate();
  const add = useTerminal((s) => s.addThesis);
  const [trades, setTrades] = useState<CongressTrade[]>([]);
  const [live, setLive] = useState(false);
  const [busy, setBusy] = useState(false);
  const [ticker, setTicker] = useState("");

  const load = async () => {
    setBusy(true);
    try {
      const r = await fetchCongressTape();
      setTrades(r.trades);
      setLive(r.live);
    } finally {
      setBusy(false);
    }
  };

  useEffect(() => {
    void load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const rows = ticker ? trades.filter((t) => t.ticker.includes(ticker.toUpperCase())) : trades;
  const sent = tickerSentiment(trades);

  const fromTicker = (sym: string) => {
    const s = sent.find((x) => x.ticker === sym);
    if (!s) return;
    const t = newUserThesis({
      title: `Congress tape: ${sym} net ${s.net >= 0 ? "bought" : "sold"}`,
      instrument: sym,
      domain: "Equities",
      type: "Trade",
      horizon: "45d lag",
      memo: `STOCK Act cluster. ${s.n} prints, ${s.buys} buys / ${s.sells} sells, ${s.members} members, net $${(s.net / 1e3).toFixed(0)}k mid. Disclosure can lag 45 days — context, not a real-time signal. Source: public-tape cache (Capitol Trades is challenge-walled; Disclosed Capitol is the paid/free-tier API).`,
      supports: [`Net ${s.net >= 0 ? "buy" : "sell"}`, `${s.members} distinct members`],
      cuts: ["Up to 45-day legal lag", "Amount is a range, not a fill"],
      changeMind: ["Subsequent filings reverse the net", "Ticker is a fund/option, not the common"],
      analyst: "Invest · Congress",
      links: [{ label: "Invest", href: "/invest" }],
    });
    add(t);
    nav({ to: "/theses/$id", params: { id: t.id } });
  };

  return (
    <div className="p-3 md:p-4">
      <p className={cn("font-mono text-[11px]", live ? "text-bull" : "text-warn")}>
        {live ? "LIVE" : "CACHE"} · STOCK Act disclosures. Lag is the point. Not a trade signal.
      </p>
      <div className="mt-3 flex flex-wrap gap-2">
        <input
          value={ticker}
          onChange={(e) => setTicker(e.target.value.toUpperCase())}
          placeholder="Filter ticker"
          className="h-8 w-32 border border-border bg-bg-panel px-2 font-mono text-[12px]"
        />
        <button type="button" onClick={() => void load()} disabled={busy} className="h-8 rounded-sm border border-border px-3 font-mono text-[11px]">
          Reload
        </button>
      </div>
      <h3 className="mt-4 font-mono text-[10px] tracking-wider text-fg-subtle uppercase">Sentiment by ticker</h3>
      <ul className="mt-2 divide-y divide-border rounded-md border border-border">
        {sent.slice(0, 8).map((s) => (
          <li key={s.ticker} className="flex items-center justify-between gap-2 px-3 py-2 font-mono text-[12px]">
            <span>{s.ticker}</span>
            <span className="text-fg-muted">
              {s.buys}B/{s.sells}S · {s.members} names
            </span>
            <span className={s.net >= 0 ? "text-bull" : "text-bear"}>${(s.net / 1e3).toFixed(0)}k</span>
            <button type="button" onClick={() => fromTicker(s.ticker)} className="text-[11px] text-accent">
              Thesis
            </button>
          </li>
        ))}
      </ul>
      <div className="mt-4 overflow-x-auto">
        <table className="w-full min-w-[760px] text-left font-mono text-[12px]">
          <thead className="text-[10px] text-fg-subtle uppercase">
            <tr>
              {["Member", "Ch", "Ticker", "Side", "Mid $", "Tx", "Filed", "Lag"].map((h) => (
                <th key={h} className="px-2 py-1">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((t) => (
              <tr key={t.id} className="border-t border-border">
                <td className="px-2 py-2">{t.politician}</td>
                <td className="px-2 text-fg-muted">{t.chamber[0]}</td>
                <td className="px-2">{t.ticker}</td>
                <td className={cn("px-2", t.tradeType === "Buy" ? "text-bull" : "text-bear")}>{t.tradeType}</td>
                <td className="px-2">{amountMid(t).toLocaleString()}</td>
                <td className="px-2 text-fg-muted">{t.txDate}</td>
                <td className="px-2 text-fg-muted">{t.discDate}</td>
                <td className="px-2">{disclosureLag(t) ?? "—"}d</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function Tile({ k, v, tone }: { k: string; v: string; tone?: "bull" | "bear" }) {
  return (
    <div className="rounded-md border border-border bg-bg-elevated p-3">
      <div className="font-mono text-[10px] text-fg-subtle">{k}</div>
      <div className={cn("mt-1 font-mono text-lg tabular", tone === "bull" && "text-bull", tone === "bear" && "text-bear")}>{v}</div>
    </div>
  );
}

function KV({ k, v }: { k: string; v: string }) {
  return (
    <div className="rounded-sm bg-bg-panel px-2 py-2">
      <div className="text-[10px] text-fg-subtle">{k}</div>
      <div>{v}</div>
    </div>
  );
}

function MetricCard({ title, m }: { title: string; m: ReturnType<typeof backtestMetrics> }) {
  return (
    <div className="rounded-md border border-border bg-bg-elevated p-3">
      <div className="font-mono text-[10px] text-fg-subtle">{title}</div>
      <dl className="mt-2 grid grid-cols-2 gap-1 font-mono text-[12px]">
        <span>CAGR {fmtPct((m.cagr ?? 0) * 100)}</span>
        <span>Vol {fmtPct((m.vol ?? 0) * 100, 1, false)}</span>
        <span>Sharpe {Number.isFinite(m.sharpe) ? m.sharpe!.toFixed(2) : "—"}</span>
        <span>Sortino {Number.isFinite(m.sortino) ? m.sortino!.toFixed(2) : "—"}</span>
        <span>Max DD {fmtPct((m.maxDd ?? 0) * 100)}</span>
        <span>Calmar {Number.isFinite(m.calmar) ? m.calmar!.toFixed(2) : "—"}</span>
      </dl>
      {m.path && (
        <div className="mt-2 h-24">
          <BoundArea data={m.path.map((v, i) => ({ d: i, v }))} xKey="d" yKey="v" />
        </div>
      )}
    </div>
  );
}

function pctOrDash(n: number) {
  return Number.isFinite(n) ? fmtPct(n * 100, 1, false) : "—";
}
function numOrDash(n: number) {
  return Number.isFinite(n) ? n.toFixed(2) : "—";
}
