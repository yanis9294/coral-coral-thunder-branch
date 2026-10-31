import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "@tanstack/react-router";
import { MORE_NAV, NAV } from "@/data/nav";
import { allCountryIntel } from "@/data/countries";
import { THESES } from "@/data/theses";
import { useClock } from "@/hooks/clock";
import { useTerminal } from "@/store/terminal";
import { cn } from "@/lib/utils";

export function CommandPalette() {
  const open = useTerminal((s) => s.cmdOpen);
  const setOpen = useTerminal((s) => s.setCmdOpen);
  const router = useRouter();
  const asOf = useClock();
  const [q, setQ] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (open) {
      setQ("");
      requestAnimationFrame(() => inputRef.current?.focus());
    }
  }, [open]);

  const items = useMemo(() => {
    const countries = allCountryIntel(asOf).map((c) => ({
      id: `c-${c.id}`,
      group: "Countries",
      label: c.name,
      hint: c.iso2,
      href: `/?sel=country:${c.id}`,
    }));
    const views = [...NAV, ...MORE_NAV].map((n) => ({
      id: n.id,
      group: "Views",
      label: n.label,
      hint: n.fkey,
      href: n.path,
    }));
    const userTheses = useTerminal.getState().userTheses.map((t) => ({
      id: t.id,
      group: "Theses",
      label: t.title,
      hint: t.state,
      href: `/theses/${t.id}`,
    }));
    const theses = THESES.map((t) => ({
      id: t.id,
      group: "Theses",
      label: t.title,
      hint: t.state,
      href: `/theses/${t.id}`,
    }));
    const all = [...views, ...userTheses, ...theses, ...countries];
    const qq = q.trim().toLowerCase();
    if (!qq) return all.slice(0, 18);
    return all.filter((x) => `${x.label} ${x.hint}`.toLowerCase().includes(qq)).slice(0, 18);
  }, [asOf, q]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center bg-bg/70 px-3 pt-[12vh]" onClick={() => setOpen(false)}>
      <div
        className="w-full max-w-lg overflow-hidden rounded-md border border-border-strong bg-bg-elevated shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <input
          ref={inputRef}
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Jump to a view, thesis, country…"
          className="w-full border-b border-border bg-transparent px-4 py-3 font-sans text-sm text-fg outline-none placeholder:text-fg-subtle"
          onKeyDown={(e) => {
            if (e.key === "Escape") setOpen(false);
            if (e.key === "Enter" && items[0]) {
              router.history.push(items[0].href);
              setOpen(false);
            }
          }}
        />
        <ul className="max-h-[50vh] overflow-y-auto py-1 terminal-scroll">
          {items.map((it) => (
            <li key={it.id}>
              <button
                type="button"
                className={cn(
                  "flex w-full items-center justify-between gap-3 px-4 py-2 text-left hover:bg-bg-hover",
                )}
                onClick={() => {
                  router.history.push(it.href);
                  setOpen(false);
                }}
              >
                <span className="min-w-0 truncate text-sm">{it.label}</span>
                <span className="shrink-0 font-mono text-[10px] text-fg-subtle">
                  {it.group} · {it.hint}
                </span>
              </button>
            </li>
          ))}
          {items.length === 0 && (
            <li className="px-4 py-6 text-center text-sm text-fg-muted">No matches</li>
          )}
        </ul>
      </div>
    </div>
  );
}
