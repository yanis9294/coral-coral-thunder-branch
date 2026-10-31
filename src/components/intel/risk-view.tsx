import { useMemo } from "react";
import { BoundArea, BoundBar } from "@/lib/chart";
import { RISK_ASSETS, riskSnapshot, wealthPath, type RiskAsset } from "@/data/risk";
import { useClock } from "@/hooks/clock";
import { cn, fmtPct } from "@/lib/utils";
import { useTerminal } from "@/store/terminal";
import { IntelPage } from "./page";

export function RiskView() {
  const asOf = useClock();
  const w = useTerminal((s) => s.riskWeights);
  const setW = useTerminal((s) => s.setRiskWeights);
  const alpha = useTerminal((s) => s.riskAlpha);
  const setAlpha = useTerminal((s) => s.setRiskAlpha);
  const capital = useTerminal((s) => s.riskCapital);
  const setCap = useTerminal((s) => s.setRiskCapital);
  const budget = useTerminal((s) => s.riskBudget);
  const setBud = useTerminal((s) => s.setRiskBudget);

  const snap = useMemo(() => riskSnapshot(w, alpha, capital, budget), [w, alpha, capital, budget]);
  const path = useMemo(() => wealthPath(snap.port, 1), [snap.port]);
  const btSeries = snap.bt.vars.map((v) => ({ d: v.t, ret: v.ret * 100, var: -v.VaR * 100 }));

  const sumW = RISK_ASSETS.reduce((s, a) => s + (w[a] ?? 0), 0);

  return (
    <IntelPage
      title="Risk"
      kicker={`VaR / ES / Kelly · α=${alpha} · synthetic book · as-of ${new Date(asOf).toISOString().slice(0, 10)}`}
    >
      <p className="border-b border-border px-3 py-2 font-mono text-[11px] text-warn md:px-4">
        SYNTHETIC returns (GARCH-t). Engine is a TypeScript port of quantdesk/risk.py + kelly.py. Do not size live risk off this tape.
      </p>
      <div className="grid gap-3 p-3 md:grid-cols-4 md:p-4">
        <Tile k={`VaR ${alpha * 100}% 1d`} v={fmtPct(snap.hist.VaR * 100, 2, false)} />
        <Tile k="ES (CVaR) 1d" v={fmtPct(snap.hist.ES * 100, 2, false)} />
        <Tile k="Ann. vol / Sharpe" v={`${(snap.volAnn * 100).toFixed(1)}% · ${snap.sharpe.toFixed(2)}`} />
        <Tile k="Notional @ budget" v={(snap.size / 1e6).toFixed(2) + "m"} sub={`${(budget * 100).toFixed(1)}% of ${ (capital / 1e6).toFixed(1)}m / ES`} />
      </div>

      <section className="grid gap-4 border-t border-border p-3 md:grid-cols-[1fr_1.2fr] md:p-4">
        <div>
          <h2 className="font-mono text-[10px] tracking-wider text-fg-subtle uppercase">Weights (Σ {sumW.toFixed(2)})</h2>
          {RISK_ASSETS.map((a) => (
            <label key={a} className="mt-2 flex items-center gap-2 font-mono text-[11px]">
              <span className="w-14">{a}</span>
              <input
                type="range"
                min={0}
                max={60}
                value={Math.round((w[a] ?? 0) * 100)}
                onChange={(e) => setW({ [a]: Number(e.target.value) / 100 } as Partial<Record<RiskAsset, number>>)}
                className="flex-1 accent-accent"
              />
              <span className="w-10 text-right">{Math.round((w[a] ?? 0) * 100)}%</span>
            </label>
          ))}
          <div className="mt-4 grid grid-cols-2 gap-2 font-mono text-[11px]">
            <label className="flex flex-col gap-1">
              <span className="text-fg-subtle">α</span>
              <select value={alpha} onChange={(e) => setAlpha(Number(e.target.value) as 0.99 | 0.95)} className="h-8 border border-border bg-bg-panel px-2">
                <option value={0.99}>0.99</option>
                <option value={0.95}>0.95</option>
              </select>
            </label>
            <label className="flex flex-col gap-1">
              <span className="text-fg-subtle">Capital</span>
              <input type="number" value={capital} onChange={(e) => setCap(Number(e.target.value))} className="h-8 border border-border bg-bg-panel px-2" />
            </label>
            <label className="flex flex-col gap-1">
              <span className="text-fg-subtle">Risk budget</span>
              <input type="number" step="0.001" value={budget} onChange={(e) => setBud(Number(e.target.value))} className="h-8 border border-border bg-bg-panel px-2" />
            </label>
          </div>
        </div>
        <div className="h-56 rounded-md border border-border bg-bg-elevated p-2">
          <BoundArea data={path} xKey="d" yKey="v" color="var(--accent)" />
        </div>
      </section>

      <section className="border-t border-border px-3 py-4 md:px-4">
        <h2 className="font-mono text-[10px] tracking-wider text-fg-subtle uppercase">Estimators (1-day, losses +)</h2>
        <div className="mt-2 overflow-x-auto">
          <table className="w-full min-w-[520px] text-left font-mono text-[12px]">
            <thead className="text-[10px] tracking-wider text-fg-subtle uppercase">
              <tr>
                {["Method", "VaR", "ES", "Notes"].map((h) => (
                  <th key={h} className="px-3 py-2">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {snap.methods.map((m) => (
                <tr key={m.method} className="border-t border-border">
                  <td className="px-3 py-2">{m.method}</td>
                  <td className="px-3">{Number.isFinite(m.VaR) ? fmtPct(m.VaR * 100, 2, false) : "—"}</td>
                  <td className="px-3">{Number.isFinite(m.ES) ? fmtPct(m.ES * 100, 2, false) : "—"}</td>
                  <td className="px-3 text-fg-muted">
                    {m.extra?.nu != null && `ν=${Number(m.extra.nu).toFixed(1)} `}
                    {m.extra?.valid === false && "CF not monotone "}
                    {m.extra?.xi != null && `ξ=${Number(m.extra.xi).toFixed(2)} `}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="grid gap-4 border-t border-border p-3 md:grid-cols-2 md:p-4">
        <div>
          <h2 className="font-mono text-[10px] tracking-wider text-fg-subtle uppercase">Backtest (hist, 500d window)</h2>
          <dl className="mt-2 grid grid-cols-2 gap-2 font-mono text-[12px]">
            <KV k="N" v={String(snap.bt.n)} />
            <KV k="Exceptions" v={`${snap.bt.kupiec.exceptions} / exp ${snap.bt.kupiec.expected.toFixed(1)}`} />
            <KV k="Kupiec p" v={snap.bt.kupiec.p.toFixed(3)} />
            <KV k="Christoffersen p" v={snap.bt.christoffersen.p.toFixed(3)} />
            <KV k="CC p" v={snap.bt.pCC.toFixed(3)} />
            <KV k="Basel 250d" v={snap.bt.basel.zone.toUpperCase()} />
          </dl>
          <div className="mt-3 h-40 rounded-md border border-border bg-bg-elevated p-2">
            <BoundArea data={btSeries} xKey="d" yKey="ret" color="var(--info)" />
          </div>
        </div>
        <div>
          <h2 className="font-mono text-[10px] tracking-wider text-fg-subtle uppercase">Euler VaR decomposition</h2>
          <ul className="mt-2 divide-y divide-border rounded-md border border-border">
            {snap.decomp.map((d) => (
              <li key={d.name} className="flex justify-between px-3 py-2 font-mono text-[12px]">
                <span>{d.name}</span>
                <span className="text-fg-muted">{d.pct.toFixed(1)}% · w {Math.round(d.weight * 100)}</span>
              </li>
            ))}
          </ul>
          <h2 className="mt-4 font-mono text-[10px] tracking-wider text-fg-subtle uppercase">Stress P&L</h2>
          <div className="mt-2 h-40 rounded-md border border-border bg-bg-elevated p-2">
            <BoundBar data={snap.stress.map((s) => ({ label: s.id, v: +(s.pnl * 100).toFixed(2) }))} xKey="label" yKey="v" color="var(--bear)" />
          </div>
        </div>
      </section>

      <section className="border-t border-border px-3 py-4 md:px-4">
        <h2 className="font-mono text-[10px] tracking-wider text-fg-subtle uppercase">Kelly</h2>
        <div className="mt-2 grid gap-2 sm:grid-cols-4">
          <Tile k="f* continuous" v={snap.kelly.fStar.toFixed(2)} sub="(μ−r)/σ² daily" />
          <Tile k="f empirical" v={snap.kelly.fEmp.toFixed(2)} sub="max Σ log(1+fR)" />
          <Tile k="f Bayes-shrunk" v={snap.kelly.fBayes.toFixed(2)} sub="τ=0.4 on Sharpe" />
          <Tile k="from trades" v={Number.isFinite(snap.kelly.fromTrades.f_kelly) ? snap.kelly.fromTrades.f_kelly.toFixed(2) : "—"} sub={`W=${((snap.kelly.fromTrades.win_rate ?? 0) * 100).toFixed(0)}%`} />
        </div>
        <table className="mt-3 w-full text-left font-mono text-[12px]">
          <thead className="text-[10px] text-fg-subtle uppercase">
            <tr>
              <th className="py-2">c × f*</th>
              <th>f</th>
              <th>P(touch 50%)</th>
              <th>g (ann.)</th>
            </tr>
          </thead>
          <tbody>
            {snap.kelly.dd.map((d) => (
              <tr key={d.c} className="border-t border-border">
                <td className="py-2">{d.c}×</td>
                <td>{d.f.toFixed(2)}</td>
                <td>{(d.p50 * 100).toFixed(1)}%</td>
                <td>{(d.g * 100).toFixed(2)}%</td>
              </tr>
            ))}
          </tbody>
        </table>
        <p className="mt-3 max-w-3xl text-[12px] text-fg-muted">
          Full Kelly has a 50% chance of drawing down to half the capital (continuous GBM). Desk default is 0.25–0.5×.
          Position size uses historical ES so that a 1-day tail equals the risk budget.
        </p>
      </section>
    </IntelPage>
  );
}

function Tile({ k, v, sub }: { k: string; v: string; sub?: string }) {
  return (
    <div className="rounded-md border border-border bg-bg-elevated p-3">
      <div className="font-mono text-[10px] text-fg-subtle">{k}</div>
      <div className="mt-1 font-mono text-lg tabular">{v}</div>
      {sub && <div className="mt-1 text-[11px] text-fg-muted">{sub}</div>}
    </div>
  );
}

function KV({ k, v }: { k: string; v: string }) {
  return (
    <div className="rounded-sm bg-bg-panel px-2 py-2">
      <div className="text-[10px] text-fg-subtle">{k}</div>
      <div className={cn("text-fg", v === "RED" && "text-bear", v === "YELLOW" && "text-warn", v === "GREEN" && "text-bull")}>{v}</div>
    </div>
  );
}
