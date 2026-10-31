import { useTerminal } from "@/store/terminal";
import { utcDate, utcStamp } from "@/lib/utils";
import { DESK_EPOCH, useClock } from "@/hooks/clock";

const WINDOW_MS = 7 * 24 * 3600_000;

export function TimeSlider() {
  const stored = useTerminal((s) => s.asOf);
  const setAsOf = useTerminal((s) => s.setAsOf);
  const liveNow = useClock();
  const now = stored == null ? liveNow : Date.now();
  const min = DESK_EPOCH - WINDOW_MS;
  const max = Math.max(DESK_EPOCH, now);
  const value = stored ?? max;

  return (
    <div className="absolute inset-x-0 bottom-0 z-10 flex items-center gap-3 border-t border-border bg-bg-elevated/90 px-3 py-1.5">
      <button
        type="button"
        onClick={() => setAsOf(null)}
        className={`h-6 shrink-0 rounded-xs px-2 font-mono text-[10px] tracking-wide ${
          stored == null ? "bg-bull/20 text-bull" : "text-fg-muted hover:text-fg"
        }`}
      >
        LIVE
      </button>
      <input
        type="range"
        min={min}
        max={max}
        step={3600_000}
        value={value}
        onChange={(e) => setAsOf(Number(e.target.value))}
        className="h-1 flex-1 cursor-pointer accent-accent"
        aria-label="Time slider"
      />
      <span className="hidden shrink-0 tabular font-mono text-[10px] text-fg-muted sm:inline">
        {utcDate(value)} {utcStamp(value)} UTC
      </span>
    </div>
  );
}
