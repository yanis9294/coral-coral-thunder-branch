import { useState } from "react";
import { ChevronDown, Layers } from "lucide-react";
import { REF_SECTIONS, flights, geoNews, liveStudios, pmGeos, quakes, ships, zones } from "@/data/monitor";
import { useClock } from "@/hooks/clock";
import { cn } from "@/lib/utils";
import { GRID_LAYERS, useTerminal } from "@/store/terminal";
import type { GridLayer } from "@/data/types";

const CADENCE: Record<GridLayer, string> = {
  SEIS: "5m",
  AIS: "30s",
  MIL: "30s",
  ZONE: "2m",
  PM: "2m",
  NEWS: "30s",
  TRADE: "struct",
  POP: "struct",
  POWER: "struct",
  LIVE: "load",
  TICKER: "live",
};

export function LayerRail() {
  const grid = useTerminal((s) => s.grid);
  const toggleGrid = useTerminal((s) => s.toggleGrid);
  const ref = useTerminal((s) => s.ref);
  const toggleRef = useTerminal((s) => s.toggleRef);
  const mapMode = useTerminal((s) => s.mapMode);
  const setMapMode = useTerminal((s) => s.setMapMode);
  const topo = useTerminal((s) => s.topo);
  const setTopo = useTerminal((s) => s.setTopo);
  const fly = useTerminal((s) => s.fly);
  const setFly = useTerminal((s) => s.setFly);
  const countryColor = useTerminal((s) => s.countryColor);
  const setCountryColor = useTerminal((s) => s.setCountryColor);
  const lowPower = useTerminal((s) => s.lowPower);
  const setLowPower = useTerminal((s) => s.setLowPower);
  const asOf = useClock();
  const [open, setOpen] = useState(false);

  const counts: Partial<Record<GridLayer, number>> = {
    SEIS: quakes(asOf).length,
    AIS: ships(asOf).length,
    MIL: flights(asOf).length,
    ZONE: zones(asOf).length,
    PM: pmGeos().length,
    NEWS: geoNews(asOf).length,
    LIVE: liveStudios().filter((s) => s.onAir).length,
  };

  const body = (
    <>
      <div className="px-3 py-2 font-mono text-[10px] tracking-[0.16em] text-fg-subtle uppercase">Grid</div>
      {GRID_LAYERS.map((k) => (
        <label
          key={k}
          className="flex h-8 cursor-pointer items-center gap-2 px-3 text-[12px] hover:bg-bg-hover"
        >
          <input
            type="checkbox"
            checked={grid[k]}
            onChange={() => toggleGrid(k)}
            className="size-3.5 accent-accent"
          />
          <span className="font-mono text-[11px] tracking-wide">{k}</span>
          <span className="ml-auto tabular font-mono text-[10px] text-fg-subtle">
            {counts[k] ?? CADENCE[k]}
          </span>
        </label>
      ))}
      <div className="mt-1 border-t border-border px-3 py-2 font-mono text-[10px] tracking-[0.16em] text-fg-subtle uppercase">
        Reference
      </div>
      {REF_SECTIONS.map((sec) => (
        <RefGroup key={sec.section} label={sec.section}>
          {sec.layers.map((l) => (
            <label
              key={l.id}
              className="flex h-8 cursor-pointer items-center gap-2 px-3 text-[12px] hover:bg-bg-hover"
            >
              <input
                type="checkbox"
                checked={ref[l.id]}
                onChange={() => toggleRef(l.id)}
                className="size-3.5 accent-accent"
              />
              <span>{l.label}</span>
            </label>
          ))}
        </RefGroup>
      ))}
      <div className="mt-1 border-t border-border px-3 py-2 font-mono text-[10px] tracking-[0.16em] text-fg-subtle uppercase">
        Display
      </div>
      <div className="flex gap-1 px-3 pb-2">
        {(["globe", "flat"] as const).map((m) => (
          <button
            key={m}
            type="button"
            onClick={() => setMapMode(m)}
            className={cn(
              "h-7 flex-1 rounded-sm font-mono text-[10px] tracking-wide uppercase",
              mapMode === m ? "bg-accent text-accent-fg" : "bg-bg-panel text-fg-muted",
            )}
          >
            {m}
          </button>
        ))}
      </div>
      <div className="flex gap-1 px-3 pb-2">
        {(["econ", "news"] as const).map((m) => (
          <button
            key={m}
            type="button"
            onClick={() => setCountryColor(m)}
            className={cn(
              "h-7 flex-1 rounded-sm font-mono text-[10px] tracking-wide uppercase",
              countryColor === m ? "bg-accent text-accent-fg" : "bg-bg-panel text-fg-muted",
            )}
          >
            {m}
          </button>
        ))}
      </div>
      <ToggleRow label="Topo" on={topo} set={setTopo} />
      <ToggleRow label="Fly" on={fly} set={setFly} />
      <ToggleRow label="Low power" on={lowPower} set={setLowPower} />
    </>
  );

  return (
    <>
      <aside className="hidden w-[200px] shrink-0 flex-col overflow-y-auto border-r border-border bg-bg-elevated terminal-scroll md:flex">
        {body}
      </aside>
      <button
        type="button"
        className="absolute top-2 left-2 z-20 flex size-10 items-center justify-center rounded-sm border border-border bg-bg-elevated md:hidden"
        onClick={() => setOpen((v) => !v)}
        aria-label="Layers"
      >
        <Layers className="size-4" />
      </button>
      {open && (
        <div className="absolute inset-y-0 left-0 z-30 w-[220px] overflow-y-auto border-r border-border bg-bg-elevated md:hidden terminal-scroll">
          {body}
        </div>
      )}
    </>
  );
}

function ToggleRow({ label, on, set }: { label: string; on: boolean; set: (v: boolean) => void }) {
  return (
    <button
      type="button"
      onClick={() => set(!on)}
      className="flex h-8 w-full items-center justify-between px-3 text-[12px] hover:bg-bg-hover"
    >
      <span>{label}</span>
      <span className={cn("font-mono text-[10px]", on ? "text-bull" : "text-fg-subtle")}>{on ? "ON" : "OFF"}</span>
    </button>
  );
}

function RefGroup({ label, children }: { label: string; children: React.ReactNode }) {
  const [open, setOpen] = useState(true);
  return (
    <div>
      <button
        type="button"
        className="flex h-8 w-full items-center justify-between px-3 font-mono text-[10px] tracking-wider text-fg-muted uppercase hover:bg-bg-hover"
        onClick={() => setOpen((v) => !v)}
      >
        {label}
        <ChevronDown className={cn("size-3.5 transition-transform", !open && "-rotate-90")} />
      </button>
      {open && children}
    </div>
  );
}
