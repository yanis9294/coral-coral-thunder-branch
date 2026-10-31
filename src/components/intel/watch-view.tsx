import { useMemo, useState } from "react";
import { Link } from "@tanstack/react-router";
import { BoundArea } from "@/lib/chart";
import { WATCH_UNIVERSE } from "@/data/watch";
import { pxOf } from "@/data/prices";
import { seasonHistory, seasonality } from "@/data/seasonality";
import { cotFeatureHistory, cotTffRows } from "@/data/cot-tff";
import { macroCalendar } from "@/data/calendar";
import { THESES } from "@/data/theses";
import { series } from "@/lib/utils";
import { useClock } from "@/hooks/clock";
import { cn, fmtPct } from "@/lib/utils";
import { useTerminal } from "@/store/terminal";
import { IntelPage } from "./page";

export function WatchView() {
  const asOf = useClock();
  const symbol = useTerminal((s) => s.watchSymbol);
  const list = useTerminal((s) => s.watchlist);
  const add = useTerminal((s) => s.addWatch);
  const remove = useTerminal((s) => s.removeWatch);
  const setSym = useTerminal((s) => s.setWatchSymbol);
  const [q, setQ] = useState("");
  const matches = WATCH_UNIVERSE.filter(
    (a) =>
      a.symbol.toLowerCase().includes(q.toLowerCase()) ||
      a.name.toLowerCase().includes(q.toLowerCase()),
  );

  const px = symbol ? pxOf(symbol, asOf) : null;
  const hist = useMemo(() => {
    if (!symbol) return [];
    const last = pxOf(symbol, asOf).px || 100;
    return series(`watch-${symbol}`, 90, last, Math.max(Math.abs(last) * 0.008, 0.05), asOf).map((v, i) => ({ d: i, v }));
  }, [symbol, asOf]);
  const season = useMemo(() => (symbol ? seasonHistory(symbol) : []), [symbol]);
  const card = useMemo(() => seasonality(asOf).find((s) => s.symbol === symbol), [asOf, symbol]);
  const cot = useMemo(() => {
    const mkt = symbol?.replace("USD", "").replace("USD", "") ?? "";
    const rows = cotTffRows(asOf);
    return rows.find((r) => symbol?.includes(r.market) || r.market === mkt);
  }, [asOf, symbol]);
  const cotHist = useMemo(() => (cot ? cotFeatureHistory(cot.market, asOf, 2) : []), [cot, asOf]);
  const cal = useMemo(
    () => macroCalendar(asOf).filter((c) => c.related.includes(symbol ?? "") || (symbol?.includes(c.ccy) ?? false)).slice(0, 8),
    [asOf, symbol],
  );
  const related = THESES.filter((t) => t.instrument === symbol || t.title.includes(symbol ?? "___"));

  return (
    <IntelPage title="Watch" kicker="One asset, full blotter — start empty">
      <div className="flex flex-wrap items-center gap-2 border-b border-border px-3 py-2 md:px-4">
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Add an asset — EURUSD, WTI, BBDXY, SOFR…"
          className="h-9 min-w-[220px] flex-1 rounded-sm border border-border bg-bg-panel px-3 font-mono text-[12px] outline-none"
        />
        {q &&
          matches.slice(0, 6).map((m) => (
            <button
              key={m.symbol}
              type="button"
              onClick={() => {
                add(m.symbol);
                setQ("");
              }}
              className="h-8 rounded-sm border border-border px-2 font-mono text-[11px] hover:bg-bg-hover"
            >
              {m.symbol}
            </button>
          ))}
      </div>
      {list.length > 0 && (
        <div className="flex flex-wrap gap-1 border-b border-border px-3 py-2">
          {list.map((s) => (
            <button
              key={s}
              type="button"
              onClick={() => setSym(s)}
              className={cn("h-7 rounded-sm border px-2 font-mono text-[11px]", symbol === s ? "border-accent text-fg" : "border-border text-fg-muted")}
            >
              {s}
              <span
                className="ml-2 text-fg-subtle"
                onClick={(e) => {
                  e.stopPropagation();
                  remove(s);
                }}
              >
                ×
              </span>
            </button>
          ))}
        </div>
      )}

      {!symbol && (
        <div className="flex flex-1 flex-col items-center justify-center px-6 py-24 text-center">
          <p className="text-sm text-fg-muted">No asset selected.</p>
          <p className="mt-2 max-w-md text-[13px] text-fg-subtle">
            Search above and pin a contract. The blotter fills with price, seasonality, COT (if TFF), the next related prints, and linked theses.
          </p>
        </div>
      )}

      {symbol && px && (
        <div className="grid gap-4 p-3 md:grid-cols-[1.3fr_0.7fr] md:p-4">
          <div>
            <div className="flex items-baseline gap-3">
              <h2 className="text-xl font-medium">{symbol}</h2>
              <span className="font-mono text-lg tabular">{px.px}</span>
              <span className={cn("font-mono text-[13px]", px.chg >= 0 ? "text-bull" : "text-bear")}>{fmtPct(px.chg)}</span>
              <span className="font-mono text-[10px] text-fg-subtle">{WATCH_UNIVERSE.find((a) => a.symbol === symbol)?.cls}</span>
            </div>
            <div className="mt-3 h-52 rounded-md border border-border bg-bg-elevated p-2">
              <BoundArea data={hist} xKey="d" yKey="v" />
            </div>
            {season.length > 0 && (
              <>
                <h3 className="mt-4 font-mono text-[10px] tracking-wider text-fg-subtle uppercase">Seasonal monthly mean %</h3>
                <div className="mt-2 h-40 rounded-md border border-border bg-bg-elevated p-2">
                  <BoundArea data={season.map((s, i) => ({ d: i, v: s.avg }))} xKey="d" yKey="v" color="var(--warn)" />
                </div>
                {card && (
                  <p className="mt-2 text-[12px] text-fg-muted">
                    This month {card.thisMonth.label}: avg {card.thisMonth.avg}% · win {card.thisMonth.win}% · vs season {card.vsSeason > 0 ? "+" : ""}
                    {card.vsSeason}
                  </p>
                )}
              </>
            )}
          </div>
          <div className="space-y-3">
            {cot && (
              <div className="rounded-md border border-border bg-bg-elevated p-3">
                <div className="font-mono text-[10px] text-fg-subtle">TFF {cot.market}</div>
                <div className="mt-1 font-mono text-sm">idx {((cot.last.idx_lf || 0) * 100).toFixed(0)} · z {cot.last.z_lf?.toFixed(2) ?? "—"}</div>
                <div className="text-[12px] text-fg-muted">{cot.extreme} · net_cot {cot.last.net_cot.toFixed(1)}</div>
                {cotHist.length > 0 && (
                  <div className="mt-2 h-24">
                    <BoundArea data={cotHist} xKey="w" yKey="idx" color="var(--warn)" />
                  </div>
                )}
                <Link to="/cot" className="mt-2 inline-block font-mono text-[11px] text-accent no-underline">
                  Open COT →
                </Link>
              </div>
            )}
            <div className="rounded-md border border-border bg-bg-elevated p-3">
              <div className="font-mono text-[10px] text-fg-subtle">Next related prints</div>
              <ul className="mt-2 space-y-1 font-mono text-[11px]">
                {cal.length === 0 && <li className="text-fg-muted">None in the window.</li>}
                {cal.map((c) => (
                  <li key={c.id} className="flex justify-between gap-2">
                    <span className="truncate">{c.ccy} {c.name}</span>
                    <span className="text-fg-subtle">{c.tier}</span>
                  </li>
                ))}
              </ul>
              <Link to="/macro" className="mt-2 inline-block font-mono text-[11px] text-accent no-underline">
                Calendar →
              </Link>
            </div>
            <div className="rounded-md border border-border bg-bg-elevated p-3">
              <div className="font-mono text-[10px] text-fg-subtle">Theses</div>
              <ul className="mt-2 space-y-1 text-[12px]">
                {related.length === 0 && <li className="text-fg-muted">None tagged.</li>}
                {related.map((t) => (
                  <li key={t.id}>
                    <Link to="/theses/$id" params={{ id: t.id }} className="text-fg no-underline hover:text-accent">
                      {t.title}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            <div className="flex flex-wrap gap-2 font-mono text-[11px]">
              <Link to="/stir" className="text-accent no-underline">STIR →</Link>
              <Link to="/risk" className="text-accent no-underline">Risk →</Link>
              <Link to="/seasonality" className="text-accent no-underline">Seasonality →</Link>
              <Link to="/fx" className="text-accent no-underline">FX →</Link>
            </div>
          </div>
        </div>
      )}
    </IntelPage>
  );
}
