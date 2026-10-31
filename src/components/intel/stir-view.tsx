import { useMemo, useState } from "react";
import { BoundLine } from "@/lib/chart";
import { policyPath, stirCurves, stirSpreads, stirStripHistory } from "@/data/stir";
import { yieldCurve, yieldHistory, yieldSpreads } from "@/data/yields";
import { bbdxy, bbdxyContrib, iceDxy, BBDXY_2026 } from "@/data/dxy";
import { FX_BASE_SPOTS, fxSpots, pxOf } from "@/data/prices";
import { useClock } from "@/hooks/clock";
import { cn, fmtPct, fmtSigned } from "@/lib/utils";
import { IntelPage } from "./page";

export function StirView() {
  const asOf = useClock();
  const [curveId, setCurveId] = useState("sofr");
  const curves = useMemo(() => stirCurves(asOf), [asOf]);
  const curve = curves.find((c) => c.id === curveId) ?? curves[0]!;
  const meetings = useMemo(() => policyPath(asOf), [asOf]);
  const spreads = useMemo(() => stirSpreads(asOf), [asOf]);
  const ySpreads = useMemo(() => yieldSpreads(asOf), [asOf]);
  const yCurve = useMemo(() => yieldCurve(asOf), [asOf]);
  const hist = useMemo(() => stirStripHistory(curve.root, asOf), [curve.root, asOf]);
  const sprHist = useMemo(() => yieldHistory("2s10s", asOf), [asOf]);
  const spots = fxSpots(asOf);
  const ice = iceDxy(spots);
  const bb = bbdxy(spots, FX_BASE_SPOTS);
  const contrib = bbdxyContrib(spots, FX_BASE_SPOTS);
  const dxyChg = pxOf("DXY", asOf).chg;
  const bbChg = pxOf("BBDXY", asOf).chg;

  return (
    <IntelPage title="STIR" kicker="SOFR / FF / Euribor / SONIA · BBDXY · yield spreads">
      <div className="grid gap-3 p-3 md:grid-cols-4 md:p-4">
        <Stat k="BBDXY" v={bb.toFixed(2)} chg={bbChg} sub="Bloomberg 2026 weights" />
        <Stat k="ICE DXY" v={ice.toFixed(2)} chg={dxyChg} sub="6-currency geometric" />
        <Stat k="US 2s10s" v={`${ySpreads[0]!.value.toFixed(1)} bp`} chg={ySpreads[0]!.chg} sub="curve" bp />
        <Stat k="SOFR−FF" v={`${spreads[0]!.value.toFixed(1)} bp`} sub={spreads[0]!.note} />
      </div>

      <section className="border-t border-border px-3 py-4 md:px-4">
        <h2 className="font-mono text-[10px] tracking-wider text-fg-subtle uppercase">Policy path</h2>
        <div className="mt-2 overflow-x-auto">
          <table className="w-full min-w-[720px] text-left font-mono text-[12px]">
            <thead className="text-[10px] tracking-wider text-fg-subtle uppercase">
              <tr>
                {["Bank", "Date", "Current", "Implied", "P(cut 25)", "P(hold)", "P(hike 25)", "Cum bp"].map((h) => (
                  <th key={h} className="px-3 py-2">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {meetings.map((m) => (
                <tr key={m.id} className="border-t border-border">
                  <td className="px-3 py-2">{m.bank}</td>
                  <td className="px-3 text-fg-muted">{m.date}</td>
                  <td className="px-3">{m.current.toFixed(2)}</td>
                  <td className="px-3">{m.implied.toFixed(3)}</td>
                  <td className="px-3 text-bull">{Math.round(m.pCut25 * 100)}%</td>
                  <td className="px-3">{Math.round(m.pHold * 100)}%</td>
                  <td className="px-3 text-bear">{Math.round(m.pHike25 * 100)}%</td>
                  <td className={cn("px-3", m.cumulativeBp < 0 ? "text-bull" : "text-fg")}>{fmtSigned(m.cumulativeBp, 1)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="border-t border-border px-3 py-4 md:px-4">
        <div className="flex flex-wrap gap-1">
          {curves.map((c) => (
            <button key={c.id} type="button" onClick={() => setCurveId(c.id)} className={cn("h-7 px-2 font-mono text-[10px]", curveId === c.id ? "text-fg" : "text-fg-muted")}>
              {c.name}
            </button>
          ))}
        </div>
        <div className="mt-3 h-48 rounded-md border border-border bg-bg-elevated p-2">
          <BoundLine
            data={hist}
            xKey="d"
            series={[
              { key: "u6", color: "var(--accent)", name: "U6" },
              { key: "z6", color: "var(--warn)", name: "Z6" },
              { key: "h7", color: "var(--info)", name: "H7" },
              { key: "m7", color: "var(--bull)", name: "M7" },
            ]}
          />
        </div>
        <p className="mt-2 font-mono text-[10px] text-fg-subtle">Implied 3m rate (%). Y-axis is the rate, not the price. Whites → reds.</p>
        <div className="mt-3 overflow-x-auto">
          <table className="w-full min-w-[640px] text-left font-mono text-[12px]">
            <thead className="text-[10px] tracking-wider text-fg-subtle uppercase">
              <tr>
                {["Contract", "Expiry", "Implied %", "Δ bp", "Settle", "Vol", "OI"].map((h) => (
                  <th key={h} className="px-3 py-2">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {curve.contracts.map((c) => (
                <tr key={c.id} className="border-t border-border">
                  <td className="px-3 py-2">{c.code}</td>
                  <td className="px-3 text-fg-muted">{c.expiry}</td>
                  <td className="px-3">{c.implied.toFixed(3)}</td>
                  <td className={cn("px-3", c.chg >= 0 ? "text-bear" : "text-bull")}>{fmtSigned(c.chg, 1)}</td>
                  <td className="px-3">{c.settle.toFixed(3)}</td>
                  <td className="px-3 text-fg-muted">{c.volume.toLocaleString()}</td>
                  <td className="px-3 text-fg-muted">{c.oi.toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="grid gap-4 border-t border-border p-3 md:grid-cols-2 md:p-4">
        <div>
          <h2 className="font-mono text-[10px] tracking-wider text-fg-subtle uppercase">Yield spreads</h2>
          <ul className="mt-2 divide-y divide-border rounded-md border border-border">
            {ySpreads.map((s) => (
              <li key={s.id} className="flex items-baseline justify-between gap-3 px-3 py-2">
                <div>
                  <div className="font-mono text-[12px]">{s.name}</div>
                  <div className="text-[11px] text-fg-muted">{s.note}</div>
                </div>
                <div className="text-right font-mono text-[12px]">
                  <div>{s.value.toFixed(1)} bp</div>
                  <div className={s.chg >= 0 ? "text-bear" : "text-bull"}>{fmtSigned(s.chg, 1)}</div>
                </div>
              </li>
            ))}
          </ul>
          <div className="mt-3 h-40 rounded-md border border-border bg-bg-elevated p-2">
            <BoundLine data={sprHist} xKey="d" series={[{ key: "v", color: "var(--accent)", name: "2s10s bp" }]} />
          </div>
        </div>
        <div>
          <h2 className="font-mono text-[10px] tracking-wider text-fg-subtle uppercase">BBDXY 2026 weights</h2>
          <p className="mt-1 text-[12px] text-fg-muted">
            Effective after close 30 Jun 2026. CNH capped at 7.00. Geometric, rebased 1240 at central spots.
          </p>
          <ul className="mt-2 divide-y divide-border rounded-md border border-border">
            {contrib.map((c) => (
              <li key={c.pair} className="flex items-center gap-3 px-3 py-1.5 font-mono text-[11px]">
                <span className="w-10">{c.name}</span>
                <span className="w-16 text-fg-muted">{c.w.toFixed(2)}%</span>
                <span className="flex-1">
                  <span className="block h-1.5 rounded-full bg-bg-panel">
                    <span className="block h-1.5 rounded-full bg-accent" style={{ width: `${(c.w / BBDXY_2026[0]!.w) * 100}%` }} />
                  </span>
                </span>
                <span className={cn("w-16 text-right", c.relPct >= 0 ? "text-bull" : "text-bear")}>{fmtPct(c.relPct)}</span>
              </li>
            ))}
          </ul>
          <div className="mt-3 h-40 rounded-md border border-border bg-bg-elevated p-2">
            <BoundLine
              data={yCurve.map((p) => ({ d: p.years, us: p.us, de: p.de, jp: p.jp, gb: p.gb }))}
              xKey="d"
              series={[
                { key: "us", color: "var(--accent)", name: "US" },
                { key: "de", color: "var(--info)", name: "DE" },
                { key: "jp", color: "var(--warn)", name: "JP" },
                { key: "gb", color: "var(--bull)", name: "GB" },
              ]}
            />
          </div>
          <p className="mt-1 font-mono text-[10px] text-fg-subtle">Nominal curves (%). X = years.</p>
        </div>
      </section>
    </IntelPage>
  );
}

function Stat({ k, v, chg, sub, bp }: { k: string; v: string; chg?: number; sub?: string; bp?: boolean }) {
  return (
    <div className="rounded-md border border-border bg-bg-elevated p-3">
      <div className="font-mono text-[10px] text-fg-subtle">{k}</div>
      <div className="mt-1 font-mono text-lg tabular">{v}</div>
      {chg != null && (
        <div className={cn("font-mono text-[11px]", chg >= 0 ? (bp ? "text-bear" : "text-bull") : bp ? "text-bull" : "text-bear")}>
          {bp ? `${fmtSigned(chg, 1)} bp` : fmtPct(chg)}
        </div>
      )}
      {sub && <div className="mt-1 text-[11px] text-fg-muted">{sub}</div>}
    </div>
  );
}
