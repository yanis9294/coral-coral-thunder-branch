import { TerminalShell } from "@/components/terminal/shell";

export function IntelPage({
  title,
  kicker,
  actions,
  children,
}: {
  title: string;
  kicker?: string;
  actions?: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <TerminalShell>
      <main className="flex min-h-0 min-w-0 flex-1 flex-col overflow-hidden bg-bg">
        <div className="flex h-10 shrink-0 items-center gap-3 border-b border-border px-3 md:px-4">
          <span className="font-mono text-[10px] tracking-[0.16em] text-fg-subtle">INTEL</span>
          <h1 className="text-sm font-medium tracking-tight">{title}</h1>
          {kicker && <span className="hidden truncate text-[11px] text-fg-muted md:inline">{kicker}</span>}
          <div className="ml-auto flex items-center gap-2">{actions}</div>
        </div>
        <div className="min-h-0 flex-1 overflow-y-auto terminal-scroll">{children}</div>
      </main>
    </TerminalShell>
  );
}

export function Drawer({
  title,
  onClose,
  children,
}: {
  title: string;
  onClose: () => void;
  children: React.ReactNode;
}) {
  return (
    <div className="fixed inset-0 z-40 flex justify-end bg-bg/50" onClick={onClose}>
      <aside
        className="flex h-full w-full max-w-md flex-col border-l border-border bg-bg-elevated shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex h-11 shrink-0 items-center justify-between border-b border-border px-4">
          <h2 className="text-sm font-medium">{title}</h2>
          <button type="button" onClick={onClose} className="font-mono text-[11px] text-fg-muted hover:text-fg">
            ESC
          </button>
        </div>
        <div className="min-h-0 flex-1 overflow-y-auto p-4 terminal-scroll">{children}</div>
      </aside>
    </div>
  );
}
