import { useMemo, useState } from "react";
import { BoundBar } from "@/lib/chart";
import { seasonHistory, seasonality } from "@/data/seasonality";
import { useClock } from "@/hooks/clock";
import { cn, fmtSigned } from "@/lib/utils";
import { IntelPage } from "./page";

export function SeasonalityView() {
  const asOf = useClock();
  const rows = useMemo(() => seasonality(asOf), [asOf]);
  const [sel, setSel] = useState(rows[0]?.symbol ?? "WTI");
  const card = rows.find((r) => r.symbol === sel) ?? rows[0]!;
  const hist = seasonHistory(sel);
  const month = new Date(asOf).toLocaleString("en-GB", { month: "long", timeZone: "UTC" });

  return (
    <IntelPage title="Seasonality" kicker={`${month} · how the book usually behaves now`}>
      <div className="overflow-x-auto">
        <table className="w-full min-w-[760px] text-left font-mono text-[12px]">
          <thead className="text-[10px] tracking-wider text-fg-subtle uppercase">
            <tr>
              {["Asset", "Class", "This m avg", "Win %", "σ", "Now", "vs season", "Next m"].map((h) => (
                <th key={h} className="px-3 py-2">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((r) => (
              <tr key={r.symbol} className="cursor-pointer border-t border-border hover:bg-bg-hover" onClick={() => setSel(r.symbol)}>
                <td className="px-3 py-2">{r.symbol}</td>
                <td className="px-3 text-fg-muted">{r.cls}</td>
                <td className={cn("px-3", r.thisMonth.avg >= 0 ? "text-bull" : "text-bear")}>{fmtSigned(r.thisMonth.avg, 2)}%</td>
                <td className="px-3">{r.thisMonth.win}%</td>
                <td className="px-3 text-fg-muted">{r.thisMonth.std}</td>
                <td className={cn("px-3", r.now >= 0 ? "text-bull" : "text-bear")}>{fmtSigned(r.now, 2)}%</td>
                <td className={cn("px-3", r.vsSeason >= 0 ? "text-bull" : "text-bear")}>{fmtSigned(r.vsSeason, 2)}</td>
                <td className="px-3 text-fg-muted">{fmtSigned(r.nextMonth.avg, 2)}%</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="border-t border-border p-3 md:p-4">
        <h2 className="text-sm font-medium">{card.symbol} · {card.name}</h2>
        <p className="mt-1 text-[12px] text-fg-muted">
          {card.thisMonth.label}: mean {card.thisMonth.avg}% over {card.thisMonth.n} years · win {card.thisMonth.win}% · best {card.thisMonth.best}% / worst {card.thisMonth.worst}%.
          Current session vs that mean: {fmtSigned(card.vsSeason, 2)}.
        </p>
        <div className="mt-3 h-48 rounded-md border border-border bg-bg-elevated p-2">
          <BoundBar data={hist} xKey="m" yKey="avg" color="var(--accent)" />
        </div>
        <div className="mt-4 grid grid-cols-6 gap-1 sm:grid-cols-12">
          {card.heatmap.map((m) => (
            <div
              key={m.month}
              className="rounded-xs px-1 py-2 text-center font-mono text-[10px]"
              style={{
                background:
                  m.avg > 0.4
                    ? "color-mix(in oklab, var(--bull) 45%, transparent)"
                    : m.avg < -0.3
                      ? "color-mix(in oklab, var(--bear) 45%, transparent)"
                      : "var(--bg-panel)",
              }}
            >
              <div className={cn(m.month === card.currentMonth && "text-accent")}>{m.label.slice(0, 3)}</div>
              <div>{m.avg.toFixed(1)}</div>
            </div>
          ))}
        </div>
      </div>
    </IntelPage>
  );
}
