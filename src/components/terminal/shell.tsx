import { useEffect, useState } from "react";
import { Link, useNavigate, useRouterState } from "@tanstack/react-router";
import {
  Clock,
  Command,
  Menu,
  MoreHorizontal,
  Search,
  X,
} from "lucide-react";
import { MORE_NAV, NAV } from "@/data/nav";
import { ticker } from "@/data/prices";
import { useClock } from "@/hooks/clock";
import { cn, utcDate, utcStamp } from "@/lib/utils";
import { useTerminal } from "@/store/terminal";
import { CommandPalette } from "./command-palette";
import { Delta, Kbd, LiveDot } from "./bits";

export function TerminalShell({ children }: { children: React.ReactNode }) {
  const path = useRouterState({ select: (s) => s.location.pathname });
  const nav = useNavigate();
  const setCmd = useTerminal((s) => s.setCmdOpen);
  const setDrawer = useTerminal((s) => s.setDrawer);
  const moreOpen = useTerminal((s) => s.moreOpen);
  const setMoreOpen = useTerminal((s) => s.setMoreOpen);
  const asOf = useClock();
  const live = useTerminal((s) => s.asOf) == null;
  const showTicker = useTerminal((s) => s.grid.TICKER);
  const [menu, setMenu] = useState(false);

  useEffect(() => {
    try {
      void useTerminal.persist.rehydrate();
    } catch {
      /* localStorage unavailable */
    }
  }, []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const t = e.target as HTMLElement | null;
      const typing =
        t && (t.tagName === "INPUT" || t.tagName === "TEXTAREA" || t.isContentEditable);
      if (e.key === "Escape") {
        setDrawer(null);
        setCmd(false);
        setMenu(false);
        setMoreOpen(false);
        return;
      }
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setCmd(true);
        return;
      }
      if (!typing && e.key === "/") {
        e.preventDefault();
        setCmd(true);
        return;
      }
      if (typing) return;
      const all = [...NAV, ...MORE_NAV];
      if (e.key === "f" || e.key === "F") {
        /* allow F-keys below */
      }
      const fMatch = all.find((n) => n.fkey === e.key.toUpperCase() || n.fkey === e.key);
      if (e.key.startsWith("F") && e.key.length <= 3) {
        const hit = all.find((n) => n.fkey === e.key);
        if (hit) {
          e.preventDefault();
          nav({ to: hit.path });
        }
      }
      if (!e.metaKey && !e.ctrlKey && !e.altKey && fMatch && /^[sraydwh]$/i.test(e.key)) {
        e.preventDefault();
        nav({ to: fMatch.path });
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [nav, setCmd, setDrawer, setMoreOpen]);

  return (
    <div className="flex h-dvh flex-col overflow-hidden bg-bg text-fg">
      <header className="flex h-11 shrink-0 items-center gap-2 border-b border-border bg-bg-elevated px-2 md:px-3">
        <Link to="/" className="flex items-center gap-2 px-1 no-underline">
          <ArgosMark />
          <span className="font-sans text-[13px] font-semibold tracking-[0.18em] text-fg">ARGOS</span>
        </Link>
        <nav className="hidden min-w-0 flex-1 items-center gap-0 overflow-x-auto md:flex">
          {NAV.map((n) => {
            const active = n.path === "/" ? path === "/" : path === n.path || path.startsWith(n.path + "/");
            return (
              <Link
                key={n.id}
                to={n.path}
                className={cn(
                  "relative flex h-11 shrink-0 items-center gap-1.5 px-2.5 font-mono text-[11px] tracking-wide no-underline",
                  active ? "text-fg" : "text-fg-muted hover:text-fg",
                )}
              >
                <span className="hidden text-[9px] text-fg-subtle lg:inline">{n.fkey}</span>
                <span>{n.label.toUpperCase()}</span>
                {active && <span className="absolute inset-x-2 bottom-0 h-px bg-accent" />}
              </Link>
            );
          })}
          <div className="relative hidden md:block">
            <button
              type="button"
              onClick={() => setMoreOpen(!moreOpen)}
              className={cn(
                "relative flex h-11 shrink-0 items-center px-2 font-mono text-[11px] text-fg-muted hover:text-fg",
                moreOpen && "text-fg",
                MORE_NAV.some((n) => path === n.path || path.startsWith(n.path + "/")) && "text-fg",
              )}
              aria-label="More views"
            >
              <MoreHorizontal className="size-3.5" />
              {MORE_NAV.some((n) => path === n.path || path.startsWith(n.path + "/")) && (
                <span className="absolute inset-x-2 bottom-0 h-px bg-accent" />
              )}
            </button>
            {moreOpen && (
              <>
                <div className="fixed inset-0 z-20" onClick={() => setMoreOpen(false)} />
                <div className="absolute left-0 top-11 z-30 w-52 border border-border bg-bg-elevated py-1 shadow-2xl">
                {MORE_NAV.map((n) => {
                  const active = path === n.path || path.startsWith(n.path + "/");
                  return (
                    <Link
                      key={n.id}
                      to={n.path}
                      onClick={() => setMoreOpen(false)}
                      className={cn(
                        "flex h-9 items-center justify-between px-3 font-mono text-[11px] no-underline hover:bg-bg-hover",
                        active ? "text-fg" : "text-fg-muted",
                      )}
                    >
                      <span>{n.label.toUpperCase()}</span>
                      <span className="text-[9px] text-fg-subtle">{n.fkey}</span>
                    </Link>
                  );
                })}
                </div>
              </>
            )}
          </div>
        </nav>
        <button
          type="button"
          className="ml-auto flex size-9 items-center justify-center rounded-sm text-fg-muted hover:bg-bg-hover hover:text-fg md:hidden"
          onClick={() => setMenu((v) => !v)}
          aria-label="Open menu"
        >
          {menu ? <X className="size-4" /> : <Menu className="size-4" />}
        </button>
        <button
          type="button"
          className="hidden h-8 items-center gap-2 rounded-sm border border-border bg-bg-sunken px-2.5 text-fg-muted hover:text-fg md:flex"
          onClick={() => setCmd(true)}
        >
          <Search className="size-3.5" />
          <span className="font-mono text-[11px]">Search</span>
          <Kbd>
            <Command className="mr-0.5 inline size-2.5" />K
          </Kbd>
        </button>
        <div className="hidden items-center gap-3 pl-2 md:flex">
          <LiveDot live={live} />
          <div className="flex items-center gap-1.5 font-mono text-[11px] text-fg-muted">
            <Clock className="size-3" />
            <span className="tabular text-fg">{utcStamp(asOf)}</span>
            <span>UTC</span>
            <span className="hidden text-fg-subtle lg:inline">{utcDate(asOf)}</span>
          </div>
        </div>
      </header>

      {menu && (
        <div className="border-b border-border bg-bg-elevated md:hidden">
          <div className="grid grid-cols-3 gap-px p-2">
            {[...NAV, ...MORE_NAV].map((n) => (
              <Link
                key={n.id}
                to={n.path}
                onClick={() => setMenu(false)}
                className="flex h-11 items-center justify-center rounded-sm bg-bg-panel font-mono text-[11px] text-fg no-underline"
              >
                {n.label}
              </Link>
            ))}
          </div>
        </div>
      )}

      <div className="flex min-h-0 flex-1">{children}</div>

      {showTicker && <TickerTape asOf={asOf} />}

      <footer className="flex h-7 shrink-0 items-center justify-between gap-3 border-t border-border bg-bg-elevated px-3 font-mono text-[10px] tracking-wide text-fg-subtle">
        <span>ARGOS DESK · MARKETS & GEOPOLITICS</span>
        <span className="hidden sm:inline">ESC close · / search · F1–F12 · S STIR · R risk · A watch · Y season · D docs</span>
        <span className="tabular">{utcStamp(asOf)} UTC</span>
      </footer>
      <CommandPalette />
    </div>
  );
}

function TickerTape({ asOf }: { asOf: number }) {
  const rows = ticker(asOf);
  return (
    <div className="flex h-8 shrink-0 items-center gap-0 overflow-x-auto border-t border-border bg-bg-sunken terminal-scroll">
      {rows.map((r) => (
        <div
          key={r.pair}
          className="flex h-8 shrink-0 items-center gap-2 border-r border-border px-3"
        >
          <span className="font-mono text-[10px] tracking-wide text-fg-muted">{r.pair}</span>
          <span className="tabular font-mono text-[11px] text-fg">{r.px}</span>
          <Delta n={r.chg} />
          {r.spread > 0 && (
            <span className="font-mono text-[10px] text-fg-subtle">{r.spread.toFixed(1)}s</span>
          )}
        </div>
      ))}
    </div>
  );
}

function ArgosMark() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" aria-hidden="true">
      <circle cx="8" cy="8" r="7" fill="none" stroke="currentColor" strokeWidth="1.2" className="text-accent" />
      <circle cx="8" cy="8" r="3.2" fill="none" stroke="currentColor" strokeWidth="1.2" className="text-accent" />
      <circle cx="8" cy="8" r="1.3" className="fill-bull" />
    </svg>
  );
}
