import { Link } from "@tanstack/react-router";
import { geoNews, pmGeos, zones } from "@/data/monitor";
import { anomalies } from "@/data/calculated";
import { useClock } from "@/hooks/clock";
import { cn, utcDate, utcStamp } from "@/lib/utils";
import { useTerminal } from "@/store/terminal";
import type { SidePanel } from "@/data/types";
import { Delta, SeverityPill } from "@/components/terminal/bits";

const TABS: { id: NonNullable<SidePanel>; label: string }[] = [
  { id: "feed", label: "Feed" },
  { id: "bank", label: "Bank" },
  { id: "desk", label: "Desk" },
  { id: "pm", label: "PM" },
];

export function MonitorSide() {
  const panel = useTerminal((s) => s.sidePanel);
  const asOf = useClock();
  const setSelection = useTerminal((s) => s.setSelection);
  const bank = useTerminal((s) => s.bankArticles);
  const live = useTerminal((s) => s.bankFeedLive);

  return (
    <aside className="hidden w-[320px] shrink-0 flex-col border-l border-border bg-bg-elevated lg:flex">
      <div className="flex h-9 shrink-0 border-b border-border">
        {TABS.map((t) => (
          <button
            key={t.id}
            type="button"
            onClick={() => useTerminal.setState({ sidePanel: t.id })}
            className={cn(
              "relative flex-1 font-mono text-[10px] tracking-wider uppercase",
              panel === t.id ? "text-fg" : "text-fg-muted hover:text-fg",
            )}
          >
            {t.label}
            {panel === t.id && <span className="absolute inset-x-3 bottom-0 h-px bg-accent" />}
          </button>
        ))}
      </div>
      <div className="min-h-0 flex-1 overflow-y-auto terminal-scroll">
        {panel === "feed" && (
          <ul>
            {anomalies(asOf).map((a) => (
              <li key={a.id} className="border-b border-border px-3 py-2.5">
                <div className="mb-1 flex items-center gap-2">
                  <SeverityPill value={a.severity} />
                  <span className="ml-auto font-mono text-[10px] text-fg-subtle">{utcStamp(a.ts)}</span>
                </div>
                <div className="text-[12px] leading-snug">{a.title}</div>
                <p className="mt-1 text-[11px] leading-relaxed text-fg-muted">{a.body}</p>
              </li>
            ))}
            {geoNews(asOf).map((n) => (
              <li key={n.id}>
                <button
                  type="button"
                  className="w-full border-b border-border px-3 py-2.5 text-left hover:bg-bg-hover"
                  onClick={() => setSelection({ kind: "news", id: n.id })}
                >
                  <div className="mb-1 flex items-center gap-2">
                    <SeverityPill value={n.severity} />
                    <span className="font-mono text-[10px] text-fg-subtle">{n.source}</span>
                    <span className="ml-auto font-mono text-[10px] text-fg-subtle">{utcStamp(n.ts)}</span>
                  </div>
                  <div className="text-[12px] leading-snug">{n.title}</div>
                </button>
              </li>
            ))}
          </ul>
        )}
        {panel === "bank" && (
          <ul>
            {bank.length === 0 && (
              <li className="p-3 text-[12px] text-fg-muted">Open Bank (F12) to pull the live street tape.</li>
            )}
            {bank.slice(0, 18).map((n) => (
              <li key={n.id} className="border-b border-border px-3 py-2.5">
                <div className="mb-1 flex items-center gap-2 font-mono text-[10px] text-fg-subtle">
                  <span className="text-accent">{n.house}</span>
                  <span className="ml-auto">{utcDate(n.ts)}</span>
                </div>
                <div className="text-[12px] leading-snug">{n.title}</div>
              </li>
            ))}
            <li className="p-3">
              <Link to="/bank" className="font-mono text-[11px] text-accent no-underline">
                {live ? "Open live Bank →" : "Open Bank →"}
              </Link>
            </li>
          </ul>
        )}
        {panel === "desk" && (
          <ul>
            {zones(asOf).map((z) => (
              <li key={z.id}>
                <button
                  type="button"
                  className="w-full border-b border-border px-3 py-2.5 text-left hover:bg-bg-hover"
                  onClick={() => setSelection({ kind: "zone", id: z.id })}
                >
                  <div className="mb-1 flex items-center gap-2">
                    <SeverityPill value={z.severity} />
                    <span className="font-mono text-[10px] text-fg-subtle">RISK {z.risk.toFixed(1)}</span>
                  </div>
                  <div className="text-[12px] font-medium">{z.name}</div>
                  <div className="font-mono text-[10px] text-fg-subtle">{z.arc}</div>
                  <p className="mt-1 text-[11px] leading-relaxed text-fg-muted">{z.note}</p>
                </button>
              </li>
            ))}
          </ul>
        )}
        {panel === "pm" && (
          <ul>
            {pmGeos()
              .slice()
              .sort((a, b) => Math.abs(b.delta24) - Math.abs(a.delta24))
              .map((m) => (
                <li key={m.id}>
                  <Link
                    to="/markets"
                    className="flex w-full items-start justify-between gap-2 border-b border-border px-3 py-2.5 no-underline hover:bg-bg-hover"
                  >
                    <div className="min-w-0">
                      <div className="truncate text-[12px] text-fg">{m.title}</div>
                      <div className="font-mono text-[10px] text-fg-subtle">{m.category}</div>
                    </div>
                    <div className="shrink-0 text-right">
                      <div className="tabular font-mono text-[12px]">{Math.round(m.prob * 100)}%</div>
                      <Delta n={m.delta24 * 100} />
                    </div>
                  </Link>
                </li>
              ))}
          </ul>
        )}
      </div>
    </aside>
  );
}
