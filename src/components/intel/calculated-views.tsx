import { useMemo, useState } from "react";
import { Link } from "@tanstack/react-router";
import { BoundArea, BoundBar } from "@/lib/chart";
import {
  fxBoard,
  impactWindow,
  leadLag,
  macroCalendar,
  microHeat,
  newsFeed,
  pmMarkets,
  scorecards,
  trendMatrix,
  anomalies,
} from "@/data/calculated";
import { printHistory, impliedMove } from "@/data/calendar";
import { cotFeatureHistory, cotTffPulse, cotTffRows, cotTimingCopy, type CotSignalRow } from "@/data/cot-tff";
import { bbdxy, iceDxy, BBDXY_2026 } from "@/data/dxy";
import { FX_BASE_SPOTS, fxSpots, pxOf } from "@/data/prices";
import { yieldSpreads } from "@/data/yields";
import { CHANGELOG, METHODOLOGY, MODEL_UPDATED, MODEL_VERSION } from "@/data/methodology";
import { useClock } from "@/hooks/clock";
import { cn, fmtPct, fmtSigned, utcDate, utcStamp } from "@/lib/utils";
import type { PmMarket } from "@/data/types";
import { Delta, SeverityPill, Spark } from "@/components/terminal/bits";
import { useTerminal, type WidgetId } from "@/store/terminal";
import { Drawer, IntelPage } from "./page";

export function CotView() {
  const asOf = useClock();
  const [yrs, setYrs] = useState(3);
  const [sel, setSel] = useState<string | null>(null);
  const rows = useMemo(() => cotTffRows(asOf), [asOf]);
  const pulse = cotTffPulse(rows);
  const timing = cotTimingCopy(asOf);
  const row = rows.find((r) => r.market === sel);
  return (
    <IntelPage
      title="COT"
      kicker="CFTC TFF · Williams 156w · no look-ahead"
      actions={
        <div className="flex gap-1">
          {[1, 2, 3, 5].map((y) => (
            <button
              key={y}
              type="button"
              onClick={() => setYrs(y)}
              className={cn("h-7 px-2 font-mono text-[10px]", yrs === y ? "text-fg" : "text-fg-muted")}
            >
              {y}Y
            </button>
          ))}
        </div>
      }
    >
      <p className="border-b border-border px-3 py-2 font-mono text-[11px] text-warn md:px-4">
        SYNTHETIC TFF (quantdesk/cot.py). {timing.note}
      </p>
      <div className="grid grid-cols-2 gap-2 p-3 md:grid-cols-6">
        {pulse.map((p) => (
          <div key={p.cls} className="rounded-md border border-border bg-bg-elevated p-3">
            <div className="font-mono text-[10px] text-fg-subtle">{p.cls}</div>
            <div className={cn("tabular font-mono text-lg", p.crowding >= 0 ? "text-bull" : "text-bear")}>
              {fmtSigned(p.crowding, 1)}
            </div>
          </div>
        ))}
      </div>
      <div className="overflow-x-auto">
        <table className="w-full min-w-[980px] text-left font-mono text-[12px]">
          <thead className="text-[10px] tracking-wider text-fg-subtle uppercase">
            <tr>
              {["Market", "Class", "Net LF", "Idx", "Z", "Extreme", "Sig", "d4", "d13", "Dealer", "AM", "Net COT"].map((h) => (
                <th key={h} className="px-3 py-2">
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((r) => (
              <tr key={r.market} className="cursor-pointer border-t border-border hover:bg-bg-hover" onClick={() => setSel(r.market)}>
                <td className="px-3 py-2 text-fg">{r.market}</td>
                <td className="px-3 text-fg-muted">{r.cls}</td>
                <td className="px-3">{r.last.net_lf.toFixed(1)}</td>
                <td className="px-3">{Number.isFinite(r.last.idx_lf) ? Math.round(r.last.idx_lf * 100) : "—"}</td>
                <td className="px-3">{Number.isFinite(r.last.z_lf) ? r.last.z_lf.toFixed(2) : "—"}</td>
                <td className={cn("px-3", r.extreme.includes("CRWD") && "text-high")}>{r.extreme}</td>
                <td className={cn("px-3", r.sig > 0 ? "text-bull" : r.sig < 0 ? "text-bear" : "text-fg-muted")}>{r.sig}</td>
                <td className="px-3">{Number.isFinite(r.last.d4_lf) ? r.last.d4_lf.toFixed(1) : "—"}</td>
                <td className="px-3">{Number.isFinite(r.last.d13_lf) ? r.last.d13_lf.toFixed(1) : "—"}</td>
                <td className="px-3">{r.last.net_dealer.toFixed(1)}</td>
                <td className="px-3">{r.last.net_am.toFixed(1)}</td>
                <td className="px-3">{r.last.net_cot.toFixed(1)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {row && <CotDrawer row={row} years={yrs} asOf={asOf} onClose={() => setSel(null)} />}
    </IntelPage>
  );
}

function CotDrawer({ row, years, asOf, onClose }: { row: CotSignalRow; years: number; asOf: number; onClose: () => void }) {
  const hist = cotFeatureHistory(row.market, asOf, years);
  return (
    <Drawer title={`${row.market} · ${row.cls} · TFF`} onClose={onClose}>
      <div className="h-44">
        <BoundArea data={hist} xKey="w" yKey="idx" color="var(--warn)" />
      </div>
      <p className="mt-2 font-mono text-[10px] text-fg-subtle">Williams leveraged-funds index (0–100). Y-axis is the index, not a price.</p>
      <div className="mt-3 h-36">
        <BoundArea data={hist} xKey="w" yKey="net" color="var(--accent)" />
      </div>
      <p className="mt-2 font-mono text-[10px] text-fg-subtle">net_cot = net_lf − net_dealer (% of OI).</p>
      <dl className="mt-3 space-y-1 font-mono text-[12px]">
        <div className="flex justify-between">
          <span className="text-fg-subtle">Report Tuesday</span>
          <span>{utcDate(row.reportTue)}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-fg-subtle">Publish Friday</span>
          <span>{utcDate(row.publishFri)}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-fg-subtle">Tradable (exec_lag=2)</span>
          <span>{utcDate(row.tradable)}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-fg-subtle">Source</span>
          <span className="text-warn">{row.source}</span>
        </div>
      </dl>
    </Drawer>
  );
}

export function MacroView() {
  const asOf = useClock();
  const [tier, setTier] = useState<"T3" | "T2+" | "ALL">("T2+");
  const cal = useMemo(() => {
    const all = macroCalendar(asOf);
    if (tier === "T3") return all.filter((c) => c.tier === "T3");
    if (tier === "T2+") return all.filter((c) => c.tier !== "T1");
    return all;
  }, [asOf, tier]);
  const cards = scorecards(asOf);
  const impact = impactWindow(cal, asOf);
  const [sel, setSel] = useState<string | null>(null);
  const rel = cal.find((c) => c.id === sel);
  return (
    <IntelPage
      title="Macro"
      kicker="G8 scorecards · consensus · high/low · probabilities"
      actions={
        <div className="flex gap-1">
          {(["T3", "T2+", "ALL"] as const).map((t) => (
            <button key={t} type="button" onClick={() => setTier(t)} className={cn("h-7 px-2 font-mono text-[10px]", tier === t ? "text-fg" : "text-fg-muted")}>
              {t}
            </button>
          ))}
        </div>
      }
    >
      <div className="p-3 md:p-4">
        <div className="h-40 rounded-md border border-border bg-bg-elevated p-2">
          <BoundBar data={impact} xKey="label" yKey="w" />
        </div>
        <p className="mt-1 font-mono text-[10px] text-fg-subtle">Impact window — sum of print weights over the next 14 UTC days. Axis is weight, not a price.</p>
        <div className="mt-4 grid gap-2 sm:grid-cols-2 lg:grid-cols-4">
          {cards.map((c) => (
            <div key={c.ccy} className="rounded-md border border-border bg-bg-elevated p-3">
              <div className="flex items-baseline justify-between">
                <span className="font-medium">{c.ccy}</span>
                <span className="font-mono text-[10px] text-fg-subtle">{c.regime}</span>
              </div>
              <div className="mt-2 grid grid-cols-2 gap-1 font-mono text-[11px] text-fg-muted">
                <span>BEAT Z {c.beatZ}</span>
                <span>MISS Z {c.missZ}</span>
                <span>BEAT {c.beatPct}%</span>
                <span>MOM {c.momentum}</span>
                <span>STREAK {c.streak}</span>
              </div>
            </div>
          ))}
        </div>
        <h3 className="mt-6 font-mono text-[10px] tracking-wider text-fg-subtle uppercase">Timeline</h3>
        <div className="mt-2 overflow-x-auto">
          <table className="w-full min-w-[920px] text-left font-mono text-[12px]">
            <thead className="text-[10px] tracking-wider text-fg-subtle uppercase">
              <tr>
                {["When", "CCY", "Print", "Cons.", "Low", "High", "Act.", "P beat", "P miss", "P hi", "Hist beat", "Related"].map((h) => (
                  <th key={h} className="px-2 py-2">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {cal.slice(0, 48).map((c) => (
                <tr key={c.id} className="cursor-pointer border-t border-border hover:bg-bg-hover" onClick={() => setSel(c.id)}>
                  <td className="px-2 py-2 text-fg-subtle">
                    {utcDate(c.ts)} {utcStamp(c.ts)}
                  </td>
                  <td className="px-2">{c.ccy}</td>
                  <td className="px-2">
                    {c.name} <span className="text-fg-subtle">{c.tier}</span>
                  </td>
                  <td className="px-2">{c.consensus}</td>
                  <td className="px-2 text-fg-muted">{c.low}</td>
                  <td className="px-2 text-fg-muted">{c.high}</td>
                  <td className={cn("px-2", c.surpriseZ != null && (c.surpriseZ >= 0 ? "text-bull" : "text-bear"))}>
                    {c.actual ?? "—"}
                  </td>
                  <td className="px-2 text-bull">{Math.round(c.pBeat * 100)}%</td>
                  <td className="px-2 text-bear">{Math.round(c.pMiss * 100)}%</td>
                  <td className="px-2">{(c.pAboveHigh * 100).toFixed(1)}%</td>
                  <td className="px-2">{fmtSigned(c.histBeatMove, 0)}</td>
                  <td className="px-2 text-fg-muted">{c.related.join(" ")}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      {rel && <MacroDrawer relId={rel.id} cal={cal} asOf={asOf} onClose={() => setSel(null)} />}
    </IntelPage>
  );
}

function MacroDrawer({
  relId,
  cal,
  asOf,
  onClose,
}: {
  relId: string;
  cal: ReturnType<typeof macroCalendar>;
  asOf: number;
  onClose: () => void;
}) {
  const rel = cal.find((c) => c.id === relId);
  if (!rel) return null;
  const hist = printHistory(rel, asOf);
  const impl = impliedMove(rel);
  return (
    <Drawer title={`${rel.ccy} ${rel.name}`} onClose={onClose}>
      <p className="text-[13px] text-fg-muted">
        {rel.country} · {rel.domain} · {rel.tier} · {rel.unit}
      </p>
      <dl className="mt-3 space-y-1 font-mono text-[12px]">
        <div className="flex justify-between"><span className="text-fg-subtle">Consensus</span><span>{rel.consensus}</span></div>
        <div className="flex justify-between"><span className="text-fg-subtle">Previous</span><span>{rel.previous}</span></div>
        <div className="flex justify-between"><span className="text-fg-subtle">Low / High (10th/90th)</span><span>{rel.low} / {rel.high}</span></div>
        <div className="flex justify-between"><span className="text-fg-subtle">Actual</span><span>{rel.actual ?? "pending"}</span></div>
        <div className="flex justify-between"><span className="text-fg-subtle">Surprise z</span><span>{rel.surpriseZ ?? "—"}</span></div>
        <div className="flex justify-between"><span className="text-fg-subtle">P(beat) / P(miss) / P(inline)</span><span>{Math.round(rel.pBeat * 100)} / {Math.round(rel.pMiss * 100)} / {Math.round(rel.pInline * 100)}</span></div>
        <div className="flex justify-between"><span className="text-fg-subtle">P(above high) / P(below low)</span><span>{(rel.pAboveHigh * 100).toFixed(1)} / {(rel.pBelowLow * 100).toFixed(1)}</span></div>
        <div className="flex justify-between"><span className="text-fg-subtle">Hist 30m beat / miss</span><span>{fmtSigned(rel.histBeatMove, 0)} / {fmtSigned(rel.histMissMove, 0)}</span></div>
        <div className="flex justify-between"><span className="text-fg-subtle">E[|move|] (bp or %)</span><span>{impl.expectedAbs}</span></div>
        <div className="flex justify-between"><span className="text-fg-subtle">Related</span><span>{rel.related.join(" · ")}</span></div>
        <div className="flex justify-between"><span className="text-fg-subtle">n lookback</span><span>{rel.histN}</span></div>
      </dl>
      <h3 className="mt-4 font-mono text-[10px] text-fg-subtle uppercase">Prior prints — surprise z</h3>
      <div className="mt-2 h-40">
        <BoundBar data={hist} xKey="i" yKey="z" color="var(--info)" />
      </div>
      <h3 className="mt-4 font-mono text-[10px] text-fg-subtle uppercase">Prior 30m impulse</h3>
      <div className="mt-2 h-36">
        <BoundBar data={hist} xKey="i" yKey="move" color="var(--accent)" />
      </div>
      <Link to="/trend" className="mt-4 inline-block font-mono text-[11px] text-accent no-underline">Trend matrix →</Link>
    </Drawer>
  );
}

export function MarketsView() {
  const asOf = useClock();
  const [lens, setLens] = useState<"movers" | "whales" | "volatile">("movers");
  const [win, setWin] = useState<"1H" | "4H" | "24H" | "7D">("24H");
  const [cat, setCat] = useState("All");
  const rows = useMemo(() => pmMarkets(asOf), [asOf]);
  const cats = ["All", ...Array.from(new Set(rows.map((r) => r.category)))];
  const filtered = rows.filter((r) => cat === "All" || r.category === cat);
  const delta = (m: PmMarket) => (win === "1H" ? m.delta1h : win === "4H" ? m.delta4h : win === "7D" ? m.delta7d : m.delta24h);
  const sorted = [...filtered].sort((a, b) => {
    if (lens === "whales") return Math.abs(b.whaleNet) - Math.abs(a.whaleNet);
    if (lens === "volatile") return b.realizedVol - a.realizedVol;
    return Math.abs(delta(b)) - Math.abs(delta(a));
  });
  const [sel, setSel] = useState<string | null>(null);
  const m = rows.find((x) => x.id === sel);
  return (
    <IntelPage
      title="Markets"
      kicker="Polymarket · unified prediction tape"
      actions={
        <div className="flex gap-1">
          {(["movers", "whales", "volatile"] as const).map((l) => (
            <button key={l} type="button" onClick={() => setLens(l)} className={cn("h-7 px-2 font-mono text-[10px] uppercase", lens === l ? "text-fg" : "text-fg-muted")}>
              {l}
            </button>
          ))}
        </div>
      }
    >
      <div className="flex flex-wrap gap-2 border-b border-border px-3 py-2">
        <select value={cat} onChange={(e) => setCat(e.target.value)} className="h-8 rounded-sm border border-border bg-bg-panel px-2 font-mono text-[11px]">
          {cats.map((c) => (
            <option key={c}>{c}</option>
          ))}
        </select>
        {(["1H", "4H", "24H", "7D"] as const).map((w) => (
          <button key={w} type="button" onClick={() => setWin(w)} className={cn("h-8 px-2 font-mono text-[11px]", win === w ? "text-fg" : "text-fg-muted")}>
            {w}
          </button>
        ))}
      </div>
      <div className="grid gap-2 p-3 sm:grid-cols-2 lg:grid-cols-3">
        {sorted.map((r) => (
          <button
            key={r.id}
            type="button"
            onClick={() => setSel(r.id)}
            className="rounded-md border border-border bg-bg-elevated p-3 text-left hover:border-border-strong"
          >
            <div className="font-mono text-[10px] text-fg-subtle">{r.category}</div>
            <div className="mt-1 text-[13px] leading-snug">{r.title}</div>
            <div className="mt-2 flex items-end justify-between">
              <span className="tabular font-mono text-xl">{Math.round(r.prob * 100)}%</span>
              <Spark data={r.spark} />
            </div>
            <div className="mt-2 flex justify-between font-mono text-[10px] text-fg-muted">
              <Delta n={delta(r)} />
              <span>vol ${r.volume}m · oi ${r.oi}m</span>
            </div>
          </button>
        ))}
      </div>
      {m && (
        <Drawer title={m.title} onClose={() => setSel(null)}>
          <div className="h-36">
            <BoundArea data={m.spark.map((v, i) => ({ i, v: v * 100 }))} xKey="i" yKey="v" />
          </div>
          <dl className="mt-3 grid grid-cols-2 gap-2 font-mono text-[12px]">
            <div>Flow {fmtSigned(m.whaleNet, 2)}</div>
            <div>Vol ratio {m.volRatio}</div>
            <div>Realized {m.realizedVol}%</div>
            <div>OI ${m.oi}m</div>
          </dl>
          <ul className="mt-3 text-[12px]">
            {m.issues.map((i) => (
              <li key={i.name} className="flex justify-between">
                <span>{i.name}</span>
                <span className="font-mono">{Math.round(i.prob * 100)}%</span>
              </li>
            ))}
          </ul>
          <Link to="/theses" className="mt-4 inline-block font-mono text-[11px] text-accent no-underline">
            Related theses →
          </Link>
        </Drawer>
      )}
    </IntelPage>
  );
}

export function MicroView() {
  const asOf = useClock();
  const heat = microHeat(asOf);
  const ll = leadLag(asOf);
  return (
    <IntelPage title="Micro" kicker="Vol regimes and lead-lag on 44 assets">
      <div className="p-3 md:p-4">
        <div className="grid grid-cols-8 gap-1 sm:grid-cols-11">
          {heat.map((h) => (
            <div
              key={h.s}
              title={`${h.s} ${h.vol}`}
              className="flex aspect-square flex-col items-center justify-center rounded-xs font-mono text-[9px]"
              style={{
                background:
                  h.vol > 0.4
                    ? "color-mix(in oklab, var(--bear) 55%, transparent)"
                    : h.vol < -0.2
                      ? "color-mix(in oklab, var(--bull) 35%, transparent)"
                      : "var(--bg-panel)",
              }}
            >
              {h.s}
            </div>
          ))}
        </div>
        <h3 className="mt-6 font-mono text-[10px] tracking-wider text-fg-subtle uppercase">Lead-lag (optimal minutes)</h3>
        <ul className="mt-2 divide-y divide-border rounded-md border border-border">
          {ll.map((p) => (
            <li key={p.a + p.b} className="flex items-center justify-between px-3 py-2 font-mono text-[12px]">
              <span>
                {p.lead} leads {p.lead === p.a ? p.b : p.a}
              </span>
              <span className="text-fg-muted">
                {p.lagMin}m · ρ {p.corr}
              </span>
            </li>
          ))}
        </ul>
      </div>
    </IntelPage>
  );
}

export function FxView() {
  const asOf = useClock();
  const rows = fxBoard(asOf);
  const spots = fxSpots(asOf);
  const ice = iceDxy(spots);
  const bb = bbdxy(spots, FX_BASE_SPOTS);
  const dxyChg = pxOf("DXY", asOf).chg;
  const bbChg = pxOf("BBDXY", asOf).chg;
  const ySpreads = yieldSpreads(asOf).slice(0, 6);
  return (
    <IntelPage title="FX" kicker="G10 · BBDXY 2026 weights · yield spreads">
      <div className="grid gap-2 border-b border-border p-3 sm:grid-cols-2 lg:grid-cols-4 md:px-4">
        <div className="rounded-md border border-border bg-bg-elevated p-3">
          <div className="font-mono text-[10px] text-fg-subtle">BBDXY</div>
          <div className="mt-1 font-mono text-lg tabular">{bb.toFixed(2)}</div>
          <div className={cn("font-mono text-[11px]", bbChg >= 0 ? "text-bull" : "text-bear")}>{fmtPct(bbChg)}</div>
        </div>
        <div className="rounded-md border border-border bg-bg-elevated p-3">
          <div className="font-mono text-[10px] text-fg-subtle">ICE DXY</div>
          <div className="mt-1 font-mono text-lg tabular">{ice.toFixed(2)}</div>
          <div className={cn("font-mono text-[11px]", dxyChg >= 0 ? "text-bull" : "text-bear")}>{fmtPct(dxyChg)}</div>
        </div>
        {ySpreads.slice(0, 2).map((s) => (
          <div key={s.id} className="rounded-md border border-border bg-bg-elevated p-3">
            <div className="font-mono text-[10px] text-fg-subtle">{s.name}</div>
            <div className="mt-1 font-mono text-lg tabular">{s.value.toFixed(1)} bp</div>
            <div className={cn("font-mono text-[11px]", s.chg >= 0 ? "text-bear" : "text-bull")}>{fmtSigned(s.chg, 1)} bp</div>
          </div>
        ))}
      </div>
      <p className="px-3 py-2 font-mono text-[10px] text-fg-subtle md:px-4">
        BBDXY basket: {BBDXY_2026.map((c) => `${c.name} ${c.w}`).join(" · ")}. CNH capped at 7. Full strip on STIR.
      </p>
      <div className="overflow-x-auto p-3">
        <table className="w-full min-w-[640px] text-left font-mono text-[12px]">
          <thead className="text-[10px] tracking-wider text-fg-subtle uppercase">
            <tr>
              {["Pair", "Spot", "Chg", "Signal", "Score", "Carry", "Cross"].map((h) => (
                <th key={h} className="px-3 py-2">
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((r) => (
              <tr key={r.pair} className="border-t border-border">
                <td className="px-3 py-2">{r.pair}</td>
                <td className="px-3">{r.px}</td>
                <td className={cn("px-3", r.chg >= 0 ? "text-bull" : "text-bear")}>{fmtPct(r.chg)}</td>
                <td className={cn("px-3", r.signal === "LONG" ? "text-bull" : r.signal === "SHORT" ? "text-bear" : "text-fg-muted")}>
                  {r.signal}
                </td>
                <td className="px-3">{r.score}</td>
                <td className="px-3">{r.carry}%</td>
                <td className="px-3 text-fg-muted">{r.cross}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </IntelPage>
  );
}

export function NewsView() {
  const asOf = useClock();
  const [sev, setSev] = useState("ALL");
  const rows = newsFeed(asOf).filter((n) => sev === "ALL" || n.severity === sev);
  return (
    <IntelPage
      title="News"
      kicker="Geolocated tape, ranked"
      actions={
        <select value={sev} onChange={(e) => setSev(e.target.value)} className="h-8 border border-border bg-bg-panel px-2 font-mono text-[11px]">
          {["ALL", "CRITICAL", "HIGH", "MEDIUM", "LOW", "INFO"].map((s) => (
            <option key={s}>{s}</option>
          ))}
        </select>
      }
    >
      <ul className="divide-y divide-border">
        {rows.map((n) => (
          <li key={n.id} className="px-3 py-3 md:px-4">
            <div className="flex flex-wrap items-center gap-2">
              <SeverityPill value={n.severity} />
              <span className="font-mono text-[10px] text-fg-subtle">{n.source}</span>
              <span className="font-mono text-[10px] text-fg-subtle">{n.domain}</span>
              <span className="ml-auto font-mono text-[10px] text-fg-subtle">{utcStamp(n.ts)}</span>
            </div>
            <div className="mt-1 text-sm">{n.title}</div>
            <p className="mt-1 text-[12px] text-fg-muted">{n.summary}</p>
          </li>
        ))}
      </ul>
    </IntelPage>
  );
}

export function MethodologyView() {
  return (
    <IntelPage title="Methodology" kicker={`${MODEL_VERSION} · updated ${MODEL_UPDATED}`}>
      <div className="mx-auto max-w-3xl space-y-4 p-3 md:p-6">
        <p className="text-[13px] leading-relaxed text-fg-muted">
          Public, versioned model cards. Weights on the Trend matrix are user-overridable; everything else is desk-calibrated.
          Raw scores export as JSON from Workbench.
        </p>
        {METHODOLOGY.map((m) => (
          <article key={m.id} className="rounded-md border border-border bg-bg-elevated p-4">
            <h3 className="text-sm font-medium">{m.name}</h3>
            <dl className="mt-2 space-y-1 text-[12px] text-fg-muted">
              <div>
                <span className="text-fg-subtle">Lookback · </span>
                {m.lookback}
              </div>
              <div>
                <span className="text-fg-subtle">Sources · </span>
                {m.sources}
              </div>
              <div>
                <span className="text-fg-subtle">Formula · </span>
                <span className="font-mono text-[11px] text-fg">{m.formula}</span>
              </div>
              <p className="pt-1">{m.notes}</p>
            </dl>
          </article>
        ))}
        <h3 className="pt-4 text-sm font-medium">Changelog</h3>
        <ul className="space-y-2 text-[12px] text-fg-muted">
          {CHANGELOG.map((c) => (
            <li key={c.v}>
              <span className="font-mono text-fg">{c.v}</span> · {c.date} — {c.text}
            </li>
          ))}
        </ul>
      </div>
    </IntelPage>
  );
}

const WIDGETS: { id: WidgetId; label: string }[] = [
  { id: "trend-top", label: "Trend top" },
  { id: "cot-pulse", label: "COT pulse" },
  { id: "pm-movers", label: "PM movers" },
  { id: "macro-impact", label: "Macro impact" },
  { id: "bank-tape", label: "Bank tape" },
  { id: "fx-cross", label: "FX board" },
  { id: "alerts", label: "Alerts" },
  { id: "brief-arcs", label: "Brief arcs" },
  { id: "ticker-board", label: "Pulse" },
  { id: "mini-map", label: "Monitor link" },
];

export function WorkbenchView() {
  const slots = useTerminal((s) => s.workbench);
  const set = useTerminal((s) => s.setWorkbench);
  const asOf = useClock();
  const exportJson = () => {
    const blob = new Blob(
      [JSON.stringify({ asOf, trend: trendMatrix(asOf), cot: cotTffRows(asOf), ts: Date.now() }, null, 2)],
      { type: "application/json" },
    );
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "argos-scores.json";
    a.click();
    URL.revokeObjectURL(url);
  };
  return (
    <IntelPage
      title="Workbench"
      kicker="Compose a layout · export scores"
      actions={
        <button type="button" onClick={exportJson} className="h-7 rounded-sm border border-border px-2 font-mono text-[11px]">
          Export JSON
        </button>
      }
    >
      <div className="grid gap-3 p-3 md:grid-cols-2 md:p-4">
        {slots.map((id, i) => (
          <div key={i} className="min-h-[200px] rounded-md border border-border bg-bg-elevated p-3">
            <select
              value={id}
              onChange={(e) => {
                const next = [...slots];
                next[i] = e.target.value as WidgetId;
                set(next);
              }}
              className="mb-2 h-8 w-full border border-border bg-bg-panel px-2 font-mono text-[11px]"
            >
              {WIDGETS.map((w) => (
                <option key={w.id} value={w.id}>
                  {w.label}
                </option>
              ))}
            </select>
            <Widget id={id} asOf={asOf} />
          </div>
        ))}
      </div>
    </IntelPage>
  );
}

function Widget({ id, asOf }: { id: WidgetId; asOf: number }) {
  if (id === "trend-top") {
    const rows = trendMatrix(asOf).slice(0, 6);
    return (
      <ul className="space-y-1 font-mono text-[12px]">
        {rows.map((r) => (
          <li key={r.symbol} className="flex justify-between">
            <span>{r.symbol}</span>
            <span className={r.overall >= 0 ? "text-bull" : "text-bear"}>{fmtSigned(r.overall, 0)}</span>
          </li>
        ))}
      </ul>
    );
  }
  if (id === "cot-pulse") {
    const rows = cotTffRows(asOf);
    const p = cotTffPulse(rows);
    return (
      <ul className="space-y-1 font-mono text-[12px]">
        {p.map((x) => (
          <li key={x.cls} className="flex justify-between">
            <span>{x.cls}</span>
            <span className={x.crowding >= 0 ? "text-bull" : "text-bear"}>{fmtSigned(x.crowding, 1)}</span>
          </li>
        ))}
      </ul>
    );
  }
  if (id === "pm-movers") {
    const rows = [...pmMarkets(asOf)].sort((a, b) => Math.abs(b.delta24h) - Math.abs(a.delta24h)).slice(0, 5);
    return (
      <ul className="space-y-2 text-[12px]">
        {rows.map((r) => (
          <li key={r.id} className="flex justify-between gap-2">
            <span className="truncate">{r.title}</span>
            <Delta n={r.delta24h} />
          </li>
        ))}
      </ul>
    );
  }
  if (id === "alerts") {
    return (
      <ul className="space-y-2 text-[12px]">
        {anomalies(asOf).map((a) => (
          <li key={a.id}>
            <SeverityPill value={a.severity} />
            <div className="mt-1">{a.title}</div>
          </li>
        ))}
      </ul>
    );
  }
  if (id === "bank-tape") return <BankTapeWidget />;
  if (id === "fx-cross") {
    return (
      <ul className="space-y-1 font-mono text-[12px]">
        {fxBoard(asOf).map((r) => (
          <li key={r.pair} className="flex justify-between">
            <span>{r.pair}</span>
            <span>{r.signal}</span>
          </li>
        ))}
      </ul>
    );
  }
  if (id === "brief-arcs") {
    return (
      <p className="text-[12px] text-fg-muted">
        Today’s arcs: Iran · Hormuz, Russia · Ukraine, Macro · Rates, China · Tech. Open Brief for the note.
      </p>
    );
  }
  if (id === "mini-map") {
    return (
      <Link to="/" className="font-mono text-[12px] text-accent no-underline">
        Open Monitor →
      </Link>
    );
  }
  if (id === "macro-impact") {
    const cal = macroCalendar(asOf);
    const imp = impactWindow(cal, asOf);
    return (
      <div className="h-32">
        <BoundBar data={imp} xKey="label" yKey="w" />
      </div>
    );
  }
  if (id === "ticker-board") {
    return <p className="font-mono text-[12px] text-fg-muted">Pulse lives in the bottom ticker. Toggle TICKER on Monitor.</p>;
  }
  return null;
}

function BankTapeWidget() {
  const articles = useTerminal((s) => s.bankArticles);
  if (!articles.length) {
    return (
      <a href="/bank" className="font-mono text-[12px] text-accent no-underline">
        Open Bank — tape not pulled yet →
      </a>
    );
  }
  return (
    <ul className="space-y-1 text-[12px]">
      {articles.slice(0, 5).map((a) => (
        <li key={a.id} className="flex justify-between gap-2">
          <span className="truncate">{a.title}</span>
          <span className="shrink-0 font-mono text-[10px] text-fg-subtle">{a.house}</span>
        </li>
      ))}
    </ul>
  );
}
