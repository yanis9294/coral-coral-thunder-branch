import { useEffect } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { LayerRail } from "@/components/monitor/layer-rail";
import { MonitorSide } from "@/components/monitor/side-panel";
import { WorldMap } from "@/components/monitor/world-map";
import { TerminalShell } from "@/components/terminal/shell";
import type { MapObjectKind } from "@/data/types";
import { useTerminal } from "@/store/terminal";

type Search = { sel?: string };

export const Route = createFileRoute("/")({
  validateSearch: (s: Record<string, unknown>): Search => ({
    sel: typeof s.sel === "string" ? s.sel : undefined,
  }),
  component: MonitorHome,
});

function MonitorHome() {
  const { sel } = Route.useSearch();
  const setSelection = useTerminal((s) => s.setSelection);

  useEffect(() => {
    if (!sel) return;
    const [kind, ...rest] = sel.split(":");
    const id = rest.join(":");
    if (kind && id) setSelection({ kind: kind as MapObjectKind, id });
  }, [sel, setSelection]);

  return (
    <TerminalShell>
      <LayerRail />
      <div className="relative min-h-0 min-w-0 flex-1">
        <WorldMap />
      </div>
      <MonitorSide />
    </TerminalShell>
  );
}
