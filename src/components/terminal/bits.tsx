import type { Severity } from "@/data/types";
import { cn, fmtPct, fmtSigned } from "@/lib/utils";

const SEV: Record<Severity, string> = {
  CRITICAL: "border-bear/40 bg-bear/15 text-bear",
  HIGH: "border-high/40 bg-high/15 text-high",
  MEDIUM: "border-warn/40 bg-warn/15 text-warn",
  LOW: "border-accent/25 bg-accent/10 text-accent",
  INFO: "border-info/40 bg-info/15 text-info",
};

export function SeverityPill({ value, className }: { value: Severity; className?: string }) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-xs border px-1.5 py-0.5 font-mono text-[10px] font-medium tracking-wide",
        SEV[value],
        className,
      )}
    >
      {value}
    </span>
  );
}

export function Delta({ n, suffix = "%", className }: { n: number; suffix?: string; className?: string }) {
  const pos = n > 0;
  const neg = n < 0;
  return (
    <span
      className={cn(
        "tabular font-mono text-xs",
        pos && "text-bull",
        neg && "text-bear",
        !pos && !neg && "text-fg-muted",
        className,
      )}
    >
      {suffix === "%" ? fmtPct(n) : `${fmtSigned(n, 2)}${suffix}`}
    </span>
  );
}

export function Spark({
  data,
  className,
  invert = false,
}: {
  data: number[];
  className?: string;
  invert?: boolean;
}) {
  if (data.length < 2) return null;
  const min = Math.min(...data);
  const max = Math.max(...data);
  const h = max - min || 1;
  const pts = data
    .map((v, i) => {
      const x = (i / (data.length - 1)) * 100;
      const y = 100 - ((v - min) / h) * 100;
      return `${x},${y}`;
    })
    .join(" ");
  const up = data[data.length - 1]! >= data[0]!;
  const bull = invert ? !up : up;
  return (
    <svg viewBox="0 0 100 28" preserveAspectRatio="none" className={cn("h-7 w-16", className)}>
      <polyline
        fill="none"
        points={pts}
        className={bull ? "stroke-bull" : "stroke-bear"}
        strokeWidth="2"
        vectorEffect="non-scaling-stroke"
      />
    </svg>
  );
}

export function ScoreBar({ n, className }: { n: number; className?: string }) {
  const mag = Math.min(100, Math.abs(n));
  const pos = n >= 0;
  return (
    <div className={cn("flex h-1.5 w-full overflow-hidden rounded-xs bg-bg-sunken", className)}>
      <div className="flex w-1/2 justify-end">
        {!pos && <div className="h-full bg-bear" style={{ width: `${mag}%` }} />}
      </div>
      <div className="flex w-1/2">
        {pos && <div className="h-full bg-bull" style={{ width: `${mag}%` }} />}
      </div>
    </div>
  );
}

export function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <div className="px-3 py-2 font-mono text-[10px] font-medium tracking-[0.16em] text-fg-subtle uppercase">
      {children}
    </div>
  );
}

export function LiveDot({ live }: { live: boolean }) {
  return (
    <span className="inline-flex items-center gap-1.5 font-mono text-[10px] tracking-wider text-fg-muted uppercase">
      <span
        className={cn("size-1.5 rounded-full", live ? "live-dot bg-bull" : "bg-fg-subtle")}
      />
      {live ? "Live" : "Replay"}
    </span>
  );
}

export function Kbd({ children }: { children: React.ReactNode }) {
  return (
    <kbd className="rounded-xs border border-border bg-bg-sunken px-1 py-px font-mono text-[10px] text-fg-muted">
      {children}
    </kbd>
  );
}

export function FactorChip({ label, n }: { label: string; n: number }) {
  return (
    <div className="flex min-w-0 flex-col gap-1">
      <div className="flex items-baseline justify-between gap-2">
        <span className="font-mono text-[10px] tracking-wider text-fg-subtle">{label}</span>
        <span className={cn("tabular font-mono text-[11px]", n >= 0 ? "text-bull" : "text-bear")}>
          {fmtSigned(n, 0)}
        </span>
      </div>
      <ScoreBar n={n} />
    </div>
  );
}
