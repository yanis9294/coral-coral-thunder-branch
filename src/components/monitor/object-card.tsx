import { Link } from "@tanstack/react-router";
import { X } from "lucide-react";
import { countryIntel } from "@/data/countries";
import {
  flights,
  geoNews,
  liveStudios,
  pmGeos,
  quakes,
  REF_POINTS,
  ships,
  zones,
} from "@/data/monitor";
import type { MapSelection } from "@/data/types";
import { fmtNum, utcFull } from "@/lib/utils";
import { Delta, SeverityPill } from "@/components/terminal/bits";

export function ObjectCard({
  selection,
  asOf,
  onClose,
}: {
  selection: MapSelection;
  asOf: number;
  onClose: () => void;
}) {
  return (
    <div className="absolute top-3 right-3 z-10 w-[min(340px,calc(100%-1.5rem))] rounded-md border border-border-strong bg-bg-elevated/95 shadow-xl">
      <div className="flex items-center justify-between border-b border-border px-3 py-2">
        <span className="font-mono text-[10px] tracking-[0.14em] text-fg-subtle uppercase">{selection.kind}</span>
        <button type="button" onClick={onClose} className="flex size-7 items-center justify-center text-fg-muted hover:text-fg" aria-label="Close">
          <X className="size-3.5" />
        </button>
      </div>
      <div className="max-h-[50vh] overflow-y-auto p-3 terminal-scroll">
        <Body selection={selection} asOf={asOf} />
      </div>
    </div>
  );
}

function Body({ selection, asOf }: { selection: MapSelection; asOf: number }) {
  if (selection.kind === "country") {
    const c = countryIntel(selection.id, asOf);
    if (!c) return <p className="text-sm text-fg-muted">No desk brief for this territory.</p>;
    return (
      <div className="space-y-3">
        <div>
          <div className="text-base font-medium tracking-tight">{c.name}</div>
          <div className="font-mono text-[11px] text-fg-subtle">
            {c.iso3} · {c.capital} · {c.region}
          </div>
        </div>
        <p className="text-[12px] leading-relaxed text-fg-muted">{c.brief}</p>
        <dl className="grid grid-cols-2 gap-x-3 gap-y-2 font-mono text-[11px]">
          <Row k="GDP" v={c.gdp} />
          <Row k="FX" v={c.fx} />
          <Row k="Yields" v={c.yields} />
          <Row k="Pop" v={`${c.populationM}m`} />
          <Row k="Power" v={String(c.power)} />
          <Row k="Econ" v={fmtNum(c.econ, 0)} bull={c.econ} />
          <Row k="News" v={fmtNum(c.news, 0)} bull={c.news} />
        </dl>
      </div>
    );
  }
  if (selection.kind === "zone") {
    const z = zones(asOf).find((x) => x.id === selection.id);
    if (!z) return null;
    return (
      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <SeverityPill value={z.severity} />
          <span className="font-mono text-[11px] text-fg-subtle">RISK {z.risk.toFixed(1)}</span>
        </div>
        <div className="text-base font-medium">{z.name}</div>
        <div className="font-mono text-[11px] text-fg-subtle">{z.arc}</div>
        <p className="text-[12px] leading-relaxed text-fg-muted">{z.note}</p>
        <div className="font-mono text-[10px] text-fg-subtle">{utcFull(z.updated)}</div>
      </div>
    );
  }
  if (selection.kind === "ais") {
    const s = ships(asOf).find((x) => x.id === selection.id);
    if (!s) return null;
    return (
      <dl className="space-y-1 font-mono text-[12px]">
        <div className="font-sans text-base font-medium">{s.name}</div>
        <Row k="Flag" v={s.flag} />
        <Row k="Type" v={s.type} />
        <Row k="Lane" v={s.lane} />
        <Row k="Dest" v={s.dest} />
        <Row k="Speed" v={`${s.speedKn} kn`} />
        <Row k="Heading" v={`${Math.round(s.heading)}°`} />
        <Row k="Draught" v={`${s.draught} m`} />
      </dl>
    );
  }
  if (selection.kind === "mil") {
    const f = flights(asOf).find((x) => x.id === selection.id);
    if (!f) return null;
    return (
      <dl className="space-y-1 font-mono text-[12px]">
        <div className="font-sans text-base font-medium">{f.callsign}</div>
        <Row k="Op" v={f.operator} />
        <Row k="Type" v={f.type} />
        <Row k="Alt" v={`${fmtNum(f.altFt, 0)} ft`} />
        <Row k="Speed" v={`${f.speedKt} kt`} />
        <Row k="From" v={f.from} />
        <Row k="To" v={f.to} />
      </dl>
    );
  }
  if (selection.kind === "seis") {
    const q = quakes(asOf).find((x) => x.id === selection.id);
    if (!q) return null;
    return (
      <div className="space-y-2">
        <SeverityPill value={q.severity} />
        <div className="text-base font-medium">{q.place}</div>
        <dl className="font-mono text-[12px]">
          <Row k="Mag" v={q.mag.toFixed(1)} />
          <Row k="Depth" v={`${q.depthKm} km`} />
          <Row k="Time" v={utcFull(q.ts)} />
        </dl>
      </div>
    );
  }
  if (selection.kind === "pm") {
    const m = pmGeos().find((x) => x.id === selection.id);
    if (!m) return null;
    return (
      <div className="space-y-2">
        <div className="text-sm font-medium leading-snug">{m.title}</div>
        <div className="flex items-baseline gap-2">
          <span className="tabular font-mono text-xl">{Math.round(m.prob * 100)}%</span>
          <Delta n={m.delta24 * 100} />
        </div>
        <div className="font-mono text-[11px] text-fg-subtle">
          {m.category} · vol ${m.volume}m
        </div>
        <Link to="/markets" className="inline-block font-mono text-[11px] text-accent no-underline">
          Open Markets →
        </Link>
      </div>
    );
  }
  if (selection.kind === "news") {
    const n = geoNews(asOf).find((x) => x.id === selection.id);
    if (!n) return null;
    return (
      <div className="space-y-2">
        <SeverityPill value={n.severity} />
        <div className="text-sm font-medium leading-snug">{n.title}</div>
        <p className="text-[12px] leading-relaxed text-fg-muted">{n.summary}</p>
        <div className="font-mono text-[10px] text-fg-subtle">
          {n.source} · {utcFull(n.ts)}
        </div>
        <Link to="/news" className="inline-block font-mono text-[11px] text-accent no-underline">
          News view →
        </Link>
      </div>
    );
  }
  if (selection.kind === "live") {
    const s = liveStudios().find((x) => x.id === selection.id);
    if (!s) return null;
    return (
      <div className="space-y-2">
        <div className="text-base font-medium">{s.name}</div>
        <div className="font-mono text-[11px] text-fg-subtle">
          {s.city} · {s.onAir ? "ON AIR" : "OFF AIR"}
        </div>
        <p className="text-[12px] text-fg-muted">{s.headline}</p>
      </div>
    );
  }
  if (selection.kind === "ref") {
    const r = REF_POINTS.find((x) => x.id === selection.id);
    if (!r) return null;
    return (
      <div className="space-y-2">
        {r.severity && <SeverityPill value={r.severity} />}
        <div className="text-base font-medium">{r.name}</div>
        <div className="font-mono text-[11px] text-fg-subtle">{r.layer}</div>
        <p className="text-[12px] text-fg-muted">{r.note}</p>
      </div>
    );
  }
  return null;
}

function Row({ k, v, bull }: { k: string; v: string; bull?: number }) {
  const cls =
    bull == null ? "text-fg" : bull >= 0 ? "text-bull" : "text-bear";
  return (
    <div className="flex items-baseline justify-between gap-3 py-0.5">
      <dt className="text-fg-subtle">{k}</dt>
      <dd className={cls}>{v}</dd>
    </div>
  );
}
