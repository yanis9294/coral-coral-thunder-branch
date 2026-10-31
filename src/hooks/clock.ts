import { useEffect, useState } from "react";
import { useTerminal } from "@/store/terminal";

/** Stable SSR seed — Saturday 19 Sep 2026 12:13 UTC (desk date). */
export const DESK_EPOCH = Date.parse("2026-09-19T12:13:00.000Z");

export function useClock() {
  const asOf = useTerminal((s) => s.asOf);
  const [now, setNow] = useState(DESK_EPOCH);
  useEffect(() => {
    if (asOf != null) return;
    setNow(Date.now());
    const id = window.setInterval(() => setNow(Date.now()), 1000);
    return () => window.clearInterval(id);
  }, [asOf]);
  return asOf ?? now;
}
