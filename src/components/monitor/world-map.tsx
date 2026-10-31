import { useEffect, useRef, useState } from "react";
import {
  geoCentroid,
  geoContains,
  geoGraticule10,
  geoNaturalEarth1,
  geoOrthographic,
  geoPath,
  type GeoPermissibleObjects,
  type GeoProjection,
} from "d3-geo";
import { feature } from "topojson-client";
import type { Feature, FeatureCollection, Geometry } from "geojson";
import {
  flights,
  geoNews,
  liveStudios,
  pmGeos,
  POP_CITIES,
  quakes,
  REF_POINTS,
  ships,
  tradeFlows,
  zones,
} from "@/data/monitor";
import { allCountryIntel, countryScore } from "@/data/countries";
import { useClock } from "@/hooks/clock";
import { clamp, cn } from "@/lib/utils";
import { useTerminal } from "@/store/terminal";
import type { MapObjectKind, MapSelection, RefLayer } from "@/data/types";
import { ObjectCard } from "./object-card";
import { TimeSlider } from "./time-slider";

type FC = FeatureCollection<Geometry, { name?: string }>;

interface Hit {
  kind: MapObjectKind;
  id: string;
  label: string;
}

export function WorldMap() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const wrapRef = useRef<HTMLDivElement>(null);
  const asOf = useClock();
  const {
    mapMode,
    topo,
    fly,
    countryColor,
    grid,
    ref,
    selection,
    setSelection,
    lowPower,
  } = useTerminal();

  const [geo, setGeo] = useState<{ countries: FC; land: FC } | null>(null);
  const rot = useRef<[number, number]>([-20, -22]);
  const scaleMul = useRef(1);
  const pan = useRef<[number, number]>([0, 0]);
  const hover = useRef<Hit | null>(null);
  const [hoverUi, setHoverUi] = useState<Hit | null>(null);
  const drag = useRef<{ x: number; y: number; rot: [number, number]; pan: [number, number] } | null>(null);
  const size = useRef({ w: 0, h: 0 });
  const geoRef = useRef(geo);
  geoRef.current = geo;
  const asOfRef = useRef(asOf);
  asOfRef.current = asOf;

  useEffect(() => {
    let dead = false;
    Promise.all([
      fetch(`${import.meta.env.BASE_URL}geo/countries-110m.json`).then((r) => r.json()),
      fetch(`${import.meta.env.BASE_URL}geo/land-110m.json`).then((r) => r.json()),
    ]).then(([c, l]) => {
      if (dead) return;
      const countries = feature(c, c.objects.countries) as unknown as FC;
      const land = feature(l, l.objects.land) as unknown as FC;
      setGeo({ countries, land });
    });
    return () => {
      dead = true;
    };
  }, []);

  useEffect(() => {
    if (!fly || !selection || !geo) return;
    const target = centroidOf(selection, geo.countries, asOf);
    if (!target) return;
    const [lat, lng] = target;
    rot.current = [-lng, -lat];
    draw();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selection, fly, geo]);

  function projection(w: number, h: number): GeoProjection {
    if (mapMode === "globe") {
      return geoOrthographic()
        .rotate([rot.current[0], rot.current[1], 0])
        .translate([w / 2, h / 2])
        .scale(Math.min(w, h) * 0.42 * scaleMul.current)
        .clipAngle(90);
    }
    return geoNaturalEarth1()
      .translate([w / 2 + pan.current[0], h / 2 + pan.current[1]])
      .scale(Math.min(w, h) * 0.22 * scaleMul.current);
  }

  function draw() {
    const canvas = canvasRef.current;
    const g = geoRef.current;
    if (!canvas || !g) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const dpr = Math.min(window.devicePixelRatio || 1, lowPower ? 1 : 2);
    const w = size.current.w;
    const h = size.current.h;
    if (w < 2 || h < 2) return;
    canvas.width = Math.floor(w * dpr);
    canvas.height = Math.floor(h * dpr);
    canvas.style.width = `${w}px`;
    canvas.style.height = `${h}px`;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    const cs = getComputedStyle(document.documentElement);
    const ocean = cs.getPropertyValue("--map-ocean").trim() || "#0c1016";
    const landC = cs.getPropertyValue("--map-land").trim() || "#1a222c";
    const borderC = cs.getPropertyValue("--map-border").trim() || "rgba(183,201,212,0.22)";
    const grat = cs.getPropertyValue("--map-graticule").trim() || "rgba(183,201,212,0.08)";
    const fg = cs.getPropertyValue("--fg").trim() || "#e6e8eb";
    const bull = cs.getPropertyValue("--bull").trim() || "#3dba86";
    const bear = cs.getPropertyValue("--bear").trim() || "#e25c4a";
    const accent = cs.getPropertyValue("--accent").trim() || "#b7c9d4";
    const warn = cs.getPropertyValue("--warn").trim() || "#c9a36a";
    const high = cs.getPropertyValue("--high").trim() || "#d4784a";
    const bg = cs.getPropertyValue("--bg").trim() || "#08090b";

    ctx.fillStyle = bg;
    ctx.fillRect(0, 0, w, h);

    const proj = projection(w, h);
    const path = geoPath(proj, ctx);
    const t = asOfRef.current;

    if (mapMode === "globe") {
      if (!lowPower) {
        ctx.fillStyle = "rgba(230,232,235,0.18)";
        for (let i = 0; i < 90; i++) {
          const x = ((i * 97) % w) + 0.5;
          const y = ((i * 53) % h) + 0.5;
          const cx = w / 2;
          const cy = h / 2;
          const r = Math.min(w, h) * 0.42 * scaleMul.current;
          if (Math.hypot(x - cx, y - cy) > r + 8) {
            ctx.fillRect(x, y, 1, 1);
          }
        }
      }
      ctx.beginPath();
      path({ type: "Sphere" });
      ctx.fillStyle = ocean;
      ctx.fill();
      ctx.strokeStyle = accent;
      ctx.globalAlpha = 0.35;
      ctx.lineWidth = 1;
      ctx.stroke();
      ctx.globalAlpha = 1;
    } else {
      ctx.fillStyle = ocean;
      ctx.fillRect(0, 0, w, h);
    }

    ctx.beginPath();
    path(geoGraticule10() as GeoPermissibleObjects);
    ctx.strokeStyle = grat;
    ctx.lineWidth = 0.6;
    ctx.stroke();

    const mode = useTerminal.getState().countryColor;
    for (const f of g.countries.features) {
      const id = String((f.id as string | number | undefined) ?? "");
      const score = countryScore(id, t, mode);
      ctx.beginPath();
      path(f as GeoPermissibleObjects);
      ctx.fillStyle = choropleth(score, landC, bull, bear, topo ? hashNoise(id) : 0);
      ctx.fill();
    }

    ctx.beginPath();
    path(g.countries as unknown as GeoPermissibleObjects);
    ctx.strokeStyle = borderC;
    ctx.lineWidth = 0.5;
    ctx.stroke();

    if (selection?.kind === "country") {
      const f = g.countries.features.find((x) => String(x.id) === selection.id);
      if (f) {
        ctx.beginPath();
        path(f as GeoPermissibleObjects);
        ctx.strokeStyle = accent;
        ctx.lineWidth = 1.6;
        ctx.stroke();
      }
    }

    const put = (lng: number, lat: number) => proj([lng, lat]) as [number, number] | null;

    if (grid.TRADE) {
      ctx.lineWidth = 1;
      for (const tr of tradeFlows()) {
        const a = put(tr.from.lng, tr.from.lat);
        const b = put(tr.to.lng, tr.to.lat);
        if (!a || !b) continue;
        ctx.strokeStyle = accent;
        ctx.globalAlpha = 0.28;
        ctx.beginPath();
        ctx.moveTo(a[0], a[1]);
        const mx = (a[0] + b[0]) / 2;
        const my = (a[1] + b[1]) / 2 - 28;
        ctx.quadraticCurveTo(mx, my, b[0], b[1]);
        ctx.stroke();
        ctx.globalAlpha = 1;
      }
    }

    if (grid.POP) {
      for (const c of POP_CITIES) {
        const p = put(c.lng, c.lat);
        if (!p) continue;
        ctx.beginPath();
        ctx.arc(p[0], p[1], Math.sqrt(c.popM) * 1.6, 0, Math.PI * 2);
        ctx.fillStyle = "rgba(183,201,212,0.12)";
        ctx.fill();
      }
    }

    if (grid.POWER) {
      for (const c of allCountryIntel(t)) {
        const p = put(c.lng, c.lat);
        if (!p) continue;
        ctx.beginPath();
        ctx.arc(p[0], p[1], c.power / 14, 0, Math.PI * 2);
        ctx.strokeStyle = accent;
        ctx.globalAlpha = 0.45;
        ctx.lineWidth = 1;
        ctx.stroke();
        ctx.globalAlpha = 1;
      }
    }

    const activeRef = Object.entries(ref)
      .filter(([, v]) => v)
      .map(([k]) => k as RefLayer);
    for (const rp of REF_POINTS) {
      if (!activeRef.includes(rp.layer)) continue;
      const p = put(rp.lng, rp.lat);
      if (!p) continue;
      ctx.fillStyle = rp.severity === "CRITICAL" ? bear : rp.severity === "HIGH" ? high : accent;
      ctx.beginPath();
      ctx.rect(p[0] - 2.5, p[1] - 2.5, 5, 5);
      ctx.fill();
    }

    if (grid.ZONE) {
      for (const z of zones(t)) {
        const p = put(z.lng, z.lat);
        if (!p) continue;
        const col = z.severity === "CRITICAL" ? bear : z.severity === "HIGH" ? high : warn;
        ctx.strokeStyle = col;
        ctx.globalAlpha = 0.55;
        ctx.lineWidth = 1.4;
        ctx.setLineDash([4, 3]);
        ctx.beginPath();
        ctx.arc(p[0], p[1], 18 + z.risk, 0, Math.PI * 2);
        ctx.stroke();
        ctx.setLineDash([]);
        ctx.globalAlpha = 0.18;
        ctx.fillStyle = col;
        ctx.fill();
        ctx.globalAlpha = 1;
        ctx.fillStyle = fg;
        ctx.font = "500 10px 'IBM Plex Sans', sans-serif";
        ctx.fillText(z.name, p[0] + 14, p[1] - 6);
      }
    }

    if (grid.SEIS) {
      for (const q of quakes(t)) {
        const p = put(q.lng, q.lat);
        if (!p) continue;
        ctx.beginPath();
        ctx.arc(p[0], p[1], q.mag * 1.6, 0, Math.PI * 2);
        ctx.strokeStyle = warn;
        ctx.globalAlpha = 0.7;
        ctx.lineWidth = 1;
        ctx.stroke();
        ctx.globalAlpha = 1;
        ctx.fillStyle = warn;
        ctx.beginPath();
        ctx.arc(p[0], p[1], 2, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    if (grid.AIS) {
      for (const s of ships(t)) {
        const p = put(s.lng, s.lat);
        if (!p) continue;
        chevron(ctx, p[0], p[1], s.heading, accent);
      }
    }

    if (grid.MIL) {
      for (const f of flights(t)) {
        const p = put(f.lng, f.lat);
        if (!p) continue;
        triangle(ctx, p[0], p[1], f.heading, bear);
      }
    }

    if (grid.PM) {
      for (const m of pmGeos()) {
        const p = put(m.lng, m.lat);
        if (!p) continue;
        diamond(ctx, p[0], p[1], 5, m.delta24 >= 0 ? bull : bear);
      }
    }

    if (grid.NEWS) {
      for (const n of geoNews(t)) {
        const p = put(n.lng, n.lat);
        if (!p) continue;
        ctx.fillStyle = n.severity === "CRITICAL" ? bear : n.severity === "HIGH" ? high : fg;
        ctx.fillRect(p[0] - 2, p[1] - 2, 4, 4);
      }
    }

    if (grid.LIVE) {
      for (const s of liveStudios()) {
        const p = put(s.lng, s.lat);
        if (!p) continue;
        ctx.beginPath();
        ctx.arc(p[0], p[1], 3.5, 0, Math.PI * 2);
        ctx.fillStyle = s.onAir ? bull : "#5c6570";
        ctx.fill();
      }
    }

    if (hover.current) {
      ctx.fillStyle = fg;
      ctx.font = "500 11px 'IBM Plex Sans', sans-serif";
    }
  }

  function hitTest(x: number, y: number): Hit | null {
    const g = geoRef.current;
    const canvas = canvasRef.current;
    if (!g || !canvas) return null;
    const w = size.current.w;
    const h = size.current.h;
    const proj = projection(w, h);
    const t = asOfRef.current;
    const state = useTerminal.getState();

    const candidates: { hit: Hit; d: number }[] = [];
    const consider = (lng: number, lat: number, hit: Hit) => {
      const p = proj([lng, lat]);
      if (!p) return;
      const d = Math.hypot(p[0] - x, p[1] - y);
      if (d < 12) candidates.push({ hit, d });
    };

    if (state.grid.ZONE) for (const z of zones(t)) consider(z.lng, z.lat, { kind: "zone", id: z.id, label: z.name });
    if (state.grid.AIS) for (const s of ships(t)) consider(s.lng, s.lat, { kind: "ais", id: s.id, label: s.name });
    if (state.grid.MIL) for (const f of flights(t)) consider(f.lng, f.lat, { kind: "mil", id: f.id, label: f.callsign });
    if (state.grid.SEIS) for (const q of quakes(t)) consider(q.lng, q.lat, { kind: "seis", id: q.id, label: q.place });
    if (state.grid.PM) for (const m of pmGeos()) consider(m.lng, m.lat, { kind: "pm", id: m.id, label: m.title });
    if (state.grid.NEWS) for (const n of geoNews(t)) consider(n.lng, n.lat, { kind: "news", id: n.id, label: n.title });
    if (state.grid.LIVE) for (const s of liveStudios()) consider(s.lng, s.lat, { kind: "live", id: s.id, label: s.name });
    const activeRef = Object.entries(state.ref)
      .filter(([, v]) => v)
      .map(([k]) => k as RefLayer);
    for (const rp of REF_POINTS) {
      if (activeRef.includes(rp.layer)) consider(rp.lng, rp.lat, { kind: "ref", id: rp.id, label: rp.name });
    }

    candidates.sort((a, b) => a.d - b.d);
    if (candidates[0]) return candidates[0].hit;

    const inv = proj.invert?.([x, y]);
    if (!inv) return null;
    for (const f of g.countries.features) {
      try {
        if (geoContains(f as Feature, inv)) {
          const name = f.properties?.name ?? String(f.id);
          return { kind: "country", id: String(f.id ?? name), label: name };
        }
      } catch {
        /* empty geom */
      }
    }
    return null;
  }

  useEffect(() => {
    const el = wrapRef.current;
    if (!el) return;
    const ro = new ResizeObserver((entries) => {
      const cr = entries[0]?.contentRect;
      if (!cr) return;
      size.current = { w: cr.width, h: cr.height };
      draw();
    });
    ro.observe(el);
    size.current = { w: el.clientWidth, h: el.clientHeight };
    draw();
    return () => ro.disconnect();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [geo, mapMode, topo, countryColor, grid, ref, selection, asOf, lowPower]);

  return (
    <div ref={wrapRef} className="relative h-full min-h-0 w-full overflow-hidden bg-bg-sunken">
      <canvas
        ref={canvasRef}
        className="block h-full w-full touch-none"
        onPointerDown={(e) => {
          const r = canvasRef.current!.getBoundingClientRect();
          drag.current = {
            x: e.clientX,
            y: e.clientY,
            rot: [...rot.current] as [number, number],
            pan: [...pan.current] as [number, number],
          };
          (e.target as HTMLCanvasElement).setPointerCapture(e.pointerId);
        }}
        onPointerMove={(e) => {
          const r = canvasRef.current!.getBoundingClientRect();
          const x = e.clientX - r.left;
          const y = e.clientY - r.top;
          if (drag.current) {
            const dx = e.clientX - drag.current.x;
            const dy = e.clientY - drag.current.y;
            if (mapMode === "globe") {
              rot.current = [
                drag.current.rot[0] + dx * 0.35,
                clamp(drag.current.rot[1] - dy * 0.35, -80, 80),
              ];
            } else {
              pan.current = [drag.current.pan[0] + dx, drag.current.pan[1] + dy];
            }
            draw();
            return;
          }
          const h = hitTest(x, y);
          const id = h ? `${h.kind}:${h.id}` : "";
          const prev = hover.current ? `${hover.current.kind}:${hover.current.id}` : "";
          if (id !== prev) {
            hover.current = h;
            setHoverUi(h);
            canvasRef.current!.style.cursor = h ? "pointer" : "grab";
          }
        }}
        onPointerUp={(e) => {
          const r = canvasRef.current!.getBoundingClientRect();
          const x = e.clientX - r.left;
          const y = e.clientY - r.top;
          const moved =
            drag.current &&
            Math.hypot(e.clientX - drag.current.x, e.clientY - drag.current.y) > 6;
          drag.current = null;
          if (moved) return;
          const h = hitTest(x, y);
          if (h) setSelection({ kind: h.kind, id: h.id });
          else setSelection(null);
        }}
        onWheel={(e) => {
          e.preventDefault();
          const next = clamp(scaleMul.current * (e.deltaY > 0 ? 0.92 : 1.08), 0.6, 4);
          scaleMul.current = next;
          draw();
        }}
      />
      {hoverUi && !selection && (
        <div className="pointer-events-none absolute top-3 left-3 rounded-sm border border-border bg-bg-elevated/90 px-2 py-1 font-mono text-[11px] text-fg">
          {hoverUi.label}
        </div>
      )}
      {selection && <ObjectCard selection={selection} asOf={asOf} onClose={() => setSelection(null)} />}
      <TimeSlider />
      <Legend />
    </div>
  );
}

function Legend() {
  return (
    <div className="pointer-events-none absolute right-3 bottom-14 hidden rounded-sm border border-border bg-bg-elevated/90 px-2 py-1.5 font-mono text-[9px] tracking-wide text-fg-muted md:block">
      <div className="mb-1 text-fg-subtle">LAYERS</div>
      <div className="flex flex-col gap-0.5">
        <span>▲ MIL &nbsp; › AIS &nbsp; ● SEIS</span>
        <span>◆ PM &nbsp; ■ NEWS &nbsp; ◉ LIVE</span>
        <span className="text-bear">ZONE rings = desk cluster</span>
      </div>
    </div>
  );
}

function choropleth(score: number, land: string, bull: string, bear: string, noise: number) {
  const t = Math.min(1, Math.abs(score) / 80);
  const c = score >= 0 ? mix(land, bull, t * 0.75) : mix(land, bear, t * 0.75);
  if (!noise) return c;
  return c;
}

function mix(a: string, b: string, t: number) {
  const pa = parseHex(a);
  const pb = parseHex(b);
  if (!pa || !pb) return a;
  const m = (i: number) => Math.round(pa[i]! + (pb[i]! - pa[i]!) * t);
  return `rgb(${m(0)},${m(1)},${m(2)})`;
}

function parseHex(s: string): [number, number, number] | null {
  const h = s.trim();
  if (h.startsWith("#") && h.length === 7) {
    return [parseInt(h.slice(1, 3), 16), parseInt(h.slice(3, 5), 16), parseInt(h.slice(5, 7), 16)];
  }
  const m = h.match(/rgb\((\d+),\s*(\d+),\s*(\d+)\)/);
  if (m) return [Number(m[1]), Number(m[2]), Number(m[3])];
  return null;
}

function hashNoise(id: string) {
  let h = 0;
  for (let i = 0; i < id.length; i++) h = (h * 31 + id.charCodeAt(i)) | 0;
  return (h % 13) / 100;
}

function chevron(ctx: CanvasRenderingContext2D, x: number, y: number, heading: number, color: string) {
  ctx.save();
  ctx.translate(x, y);
  ctx.rotate((heading * Math.PI) / 180);
  ctx.beginPath();
  ctx.moveTo(0, -5);
  ctx.lineTo(3.2, 4.5);
  ctx.lineTo(0, 2);
  ctx.lineTo(-3.2, 4.5);
  ctx.closePath();
  ctx.fillStyle = color;
  ctx.fill();
  ctx.restore();
}

function triangle(ctx: CanvasRenderingContext2D, x: number, y: number, heading: number, color: string) {
  ctx.save();
  ctx.translate(x, y);
  ctx.rotate((heading * Math.PI) / 180);
  ctx.beginPath();
  ctx.moveTo(0, -6);
  ctx.lineTo(4, 5);
  ctx.lineTo(-4, 5);
  ctx.closePath();
  ctx.fillStyle = color;
  ctx.fill();
  ctx.restore();
}

function diamond(ctx: CanvasRenderingContext2D, x: number, y: number, s: number, color: string) {
  ctx.beginPath();
  ctx.moveTo(x, y - s);
  ctx.lineTo(x + s, y);
  ctx.lineTo(x, y + s);
  ctx.lineTo(x - s, y);
  ctx.closePath();
  ctx.fillStyle = color;
  ctx.fill();
}

function centroidOf(sel: MapSelection, countries: FC, asOf: number): [number, number] | null {
  if (sel.kind === "country") {
    const f = countries.features.find((x) => String(x.id) === sel.id);
    if (!f) return null;
    const c = geoCentroid(f);
    return [c[1], c[0]];
  }
  const t = asOf;
  if (sel.kind === "zone") {
    const z = zones(t).find((x) => x.id === sel.id);
    return z ? [z.lat, z.lng] : null;
  }
  return null;
}

export { WorldMap as default };
