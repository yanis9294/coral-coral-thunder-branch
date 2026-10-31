import { useMemo, useState } from "react";
import { Link } from "@tanstack/react-router";
import { BoundArea } from "@/lib/chart";
import { globalRegime, trendHistory, trendMatrix } from "@/data/calculated";
import { useClock } from "@/hooks/clock";
import { cn, fmtSigned } from "@/lib/utils";
import { useTerminal } from "@/store/terminal";
import type { TrendRow } from "@/data/types";
import { FactorChip, ScoreBar, Spark } from "@/components/terminal/bits";
import { Drawer, IntelPage } from "./page";

export function TrendView() {
  const asOf = useClock();
  const weights = useTerminal((s) => s.weights);
  const setWeights = useTerminal((s) => s.setWeights);
  const rows = useMemo(() => trendMatrix(asOf, weights), [asOf, weights]);
  const regime = globalRegime(rows);
  const [sel, setSel] = useState<string | null>(null);
  const row = rows.find((r) => r.symbol === sel);
  const bulls = [...rows].sort((a, b) => b.overall - a.overall).slice(0, 4);
  const bears = [...rows].sort((a, b) => a.overall - b.overall).slice(0, 4);

  return (
    <IntelPage
      title="Trend matrix"
      kicker={`${rows.length} assets · regime ${regime}`}
      actions={
        <span
          className={cn(
            "rounded-xs border px-2 py-0.5 font-mono text-[10px] tracking-wide",
            regime === "RISK-ON" && "border-bull/40 text-bull",
            regime === "RISK-OFF" && "border-bear/40 text-bear",
            regime === "BALANCED" && "border-border text-fg-muted",
          )}
        >
          {regime}
        </span>
      }
    >
      <div className="grid gap-3 border-b border-border p-3 md:grid-cols-3 md:p-4">
        <div className="rounded-md border border-border bg-bg-elevated p-3">
          <div className="font-mono text-[10px] text-fg-subtle">TOP BULL</div>
          {bulls.map((r) => (
            <button key={r.symbol} type="button" className="mt-1 flex w-full justify-between font-mono text-[12px]" onClick={() => setSel(r.symbol)}>
              <span>{r.symbol}</span>
              <span className="text-bull">{fmtSigned(r.overall, 0)}</span>
            </button>
          ))}
        </div>
        <div className="rounded-md border border-border bg-bg-elevated p-3">
          <div className="font-mono text-[10px] text-fg-subtle">TOP BEAR</div>
          {bears.map((r) => (
            <button key={r.symbol} type="button" className="mt-1 flex w-full justify-between font-mono text-[12px]" onClick={() => setSel(r.symbol)}>
              <span>{r.symbol}</span>
              <span className="text-bear">{fmtSigned(r.overall, 0)}</span>
            </button>
          ))}
        </div>
        <div className="rounded-md border border-border bg-bg-elevated p-3">
          <div className="font-mono text-[10px] text-fg-subtle">WEIGHTS (user)</div>
          {(["macro", "pos", "risk", "flow"] as const).map((k) => (
            <label key={k} className="mt-1 flex items-center gap-2 font-mono text-[11px] uppercase">
              <span className="w-10 text-fg-subtle">{k}</span>
              <input
                type="range"
                min={0}
                max={50}
                value={weights[k]}
                onChange={(e) => setWeights({ [k]: Number(e.target.value) })}
                className="flex-1 accent-accent"
              />
              <span className="tabular w-6 text-right">{weights[k]}</span>
            </label>
          ))}
        </div>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full min-w-[880px] text-left text-[12px]">
          <thead className="sticky top-0 bg-bg font-mono text-[10px] tracking-wider text-fg-subtle uppercase">
            <tr>
              {["Asset", "Class", "Last", "Chg", "Overall", "Verdict", "MACRO", "POS", "RISK", "FLOW", "Crowd", "Reg%"].map((h) => (
                <th key={h} className="px-3 py-2 font-medium">
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((r) => (
              <tr
                key={r.symbol}
                className="cursor-pointer border-t border-border hover:bg-bg-hover"
                onClick={() => setSel(r.symbol)}
              >
                <td className="px-3 py-2 font-medium">{r.symbol}</td>
                <td className="px-3 text-fg-muted">{r.assetClass}</td>
                <td className="tabular px-3 font-mono">{r.last}</td>
                <td className={cn("tabular px-3 font-mono", r.chg >= 0 ? "text-bull" : "text-bear")}>
                  {fmtSigned(r.chg, 2)}%
                </td>
                <td className="px-3">
                  <div className="flex items-center gap-2">
                    <span className={cn("tabular w-10 font-mono", r.overall >= 0 ? "text-bull" : "text-bear")}>
                      {fmtSigned(r.overall, 0)}
                    </span>
                    <ScoreBar n={r.overall} className="w-16" />
                  </div>
                </td>
                <td className="px-3 font-mono text-[10px] text-fg-muted">{r.verdict}</td>
                <Num n={r.macro} />
                <Num n={r.pos} />
                <Num n={r.risk} />
                <Num n={r.flow} />
                <td className="tabular px-3 font-mono text-fg-muted">{r.crowding}</td>
                <td className="tabular px-3 font-mono text-fg-muted">{r.regimeP}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {row && <TrendDrawer row={row} asOf={asOf} onClose={() => setSel(null)} />}
    </IntelPage>
  );
}

function Num({ n }: { n: number }) {
  return (
    <td className={cn("tabular px-3 font-mono", n >= 0 ? "text-bull" : "text-bear")}>{fmtSigned(n, 0)}</td>
  );
}

function TrendDrawer({ row, asOf, onClose }: { row: TrendRow; asOf: number; onClose: () => void }) {
  const hist = trendHistory(row.symbol, asOf);
  return (
    <Drawer title={`${row.symbol} · ${row.name}`} onClose={onClose}>
      <div className="h-36">
        <BoundArea data={hist} xKey="d" yKey="v" />
      </div>
      <div className="mt-4 grid grid-cols-2 gap-3">
        <FactorChip label="MACRO" n={row.macro} />
        <FactorChip label="POS" n={row.pos} />
        <FactorChip label="RISK" n={row.risk} />
        <FactorChip label="FLOW" n={row.flow} />
      </div>
      <p className="mt-4 text-[12px] text-fg-muted">Drivers: {row.drivers.join(" · ")}</p>
      <p className="mt-2 text-[12px] text-fg-muted">
        Crowding {row.crowding} · regime probability {row.regimeP}% (HMM)
      </p>
      <Link to="/cot" className="mt-4 inline-block font-mono text-[11px] text-accent no-underline">
        Open COT →
      </Link>
      <Spark data={hist.map((h) => h.v)} className="mt-3 h-8 w-full" />
    </Drawer>
  );
}
