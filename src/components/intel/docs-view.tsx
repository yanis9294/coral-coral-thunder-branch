import { useEffect, useState } from "react";
import { Link } from "@tanstack/react-router";
import { BBDXY_2026, BBDXY_REBASE, ICE_DXY_FACTOR, ICE_DXY_WEIGHTS, bbdxyWeightSum } from "@/data/dxy";
import { CHANGELOG, METHODOLOGY, MODEL_UPDATED, MODEL_VERSION } from "@/data/methodology";
import { BANK_SOURCES } from "@/data/bank-sources";
import { DEFAULT_QWEN, QWEN_SYSTEM, loadQwenConfig, qwenChat, saveQwenConfig, type QwenConfig } from "@/lib/qwen";
import { cn } from "@/lib/utils";
import { IntelPage } from "./page";

export function DocsView() {
  return (
    <IntelPage title="Docs" kicker={`${MODEL_VERSION} · verify every number`}>
      <div className="mx-auto max-w-4xl space-y-8 p-3 pb-16 md:p-6">
        <p className="text-[13px] leading-relaxed text-fg-muted">
            ARGOS is a markets and geopolitics terminal. This page is the audit trail: what is live, what is synthetic, which formula
            sits behind each tile, and how to run the desk on a machine you control. Model cards also live on{" "}
          <Link to="/methodology" className="text-accent no-underline">
            Methodology
          </Link>
          .
        </p>

        <Section id="data" title="1. Data policy">
          <p>
            Prices, COT, STIR strips, calendar prints, seasonality and the risk book are seeded simulations (mulberry32 + GARCH-t).
            They are internally consistent so you can verify engines, not so you can trade them. A banner that says{" "}
            <span className="text-warn">SYNTHETIC</span> is binding. Bank and Invest are the exceptions: they fetch when you open
            them.
          </p>
          <ul className="mt-2 list-disc space-y-1 pl-4">
            <li>
              Clock seed: desk epoch <span className="font-mono text-fg">2026-09-19T12:13:00Z</span>. Time slider rewinds the same
              seed.
            </li>
            <li>CFTC: no network. TFF rows come from <span className="font-mono">syntheticCotMarket</span> in <span className="font-mono">src/data/cot-tff.ts</span>, a port of <span className="font-mono">vendor/quantdesk/cot.py</span>.</li>
            <li>VaR/ES/Kelly: port of <span className="font-mono">vendor/quantdesk/risk.py</span> + <span className="font-mono">kelly.py</span>. GARCH-FHS (arch) is omitted in-browser.</li>
            <li>Bank: live RSS (ING Think, Fed, ECB, Google News house queries). If every feed fails, the tape falls back to desk reconstructions and the banner says CACHE. Directory links stay below the tape. Make thesis is a heuristic; Draft with Grok only fires when you press it.</li>
            <li>Invest: Yahoo chart + fundamentals-timeseries for DCF and the book (no crumb). Congress is a labeled public-tape cache, not a live PTR feed.</li>
          </ul>
        </Section>

        <Section id="local" title="2. Run it locally">
          <p>Node 22, npm. From the project root:</p>
          <pre className="mt-2 overflow-x-auto rounded-md border border-border bg-bg-sunken p-3 font-mono text-[11px] text-fg">
            {`npm install
npm run dev
# binds 0.0.0.0:8080 — open that origin in a browser`}
          </pre>
          <p className="mt-2">
            Auth and database are off. Preferences (layers, theses, watchlist, risk weights, Qwen config) persist in{" "}
            <span className="font-mono">localStorage</span> keys <span className="font-mono">argos-terminal</span> and{" "}
            <span className="font-mono">argos-qwen</span>. Production build: <span className="font-mono">npm run build</span> then{" "}
            <span className="font-mono">npm run preview</span>.
          </p>
        </Section>

        <QwenPanel />

        <Section id="dxy" title="4. Dollar indices">
          <p>
            ICE DXY is the NYBOT geometric 6-currency basket. Factor {ICE_DXY_FACTOR}. Weights:
          </p>
          <ul className="mt-2 space-y-0.5 font-mono text-[11px]">
            {ICE_DXY_WEIGHTS.map((w) => (
              <li key={w.pair}>
                {w.pair} ^{w.invert ? "−" : ""}
                {w.w}
                {w.invert ? " (invert XXXUSD)" : ""}
              </li>
            ))}
          </ul>
          <p className="mt-3">
            BBDXY is Bloomberg Dollar Spot, 2026 target weights effective after the close of 30 Jun 2026 (50% Fed trade / 50% BIS
            FX liquidity; CNH capped at 7.00). Geometric, USD-strength quotes, rebased {BBDXY_REBASE} at the terminal’s central
            spots. Weight sum {bbdxyWeightSum().toFixed(2)}.
          </p>
          <div className="mt-2 overflow-x-auto">
            <table className="w-full min-w-[420px] text-left font-mono text-[11px]">
              <thead className="text-[10px] text-fg-subtle uppercase">
                <tr>
                  <th className="py-1">CCY</th>
                  <th>Pair</th>
                  <th>w %</th>
                </tr>
              </thead>
              <tbody>
                {BBDXY_2026.map((c) => (
                  <tr key={c.pair} className="border-t border-border">
                    <td className="py-1">{c.name}</td>
                    <td className="text-fg-muted">{c.pair}</td>
                    <td>{c.w.toFixed(2)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="mt-2">
            Formula: <span className="font-mono text-fg">BBDXY = {BBDXY_REBASE} · Π (S_t / S_0)^w</span>. MXN, CAD, CNH, KRW, INR,
            SGD, TWD are in BBDXY and not in ICE DXY. See STIR for the live tiles.
          </p>
        </Section>

        <Section id="yields" title="5. Yield spreads">
          <p>
            Levels are seeded US/DE/JP/GB curves. Spreads in basis points: 2s10s, 5s30s, 10s30s, 2s30s, US–DE 10Y, US–JP 10Y,
            US–GB 10Y, US 10Y real (nominal − 10Y BEI), SOFR−FF, IORB−FF. Ticker carries DXY, BBDXY, US10Y, 2s10s, SOFR, SOFR−FF.
          </p>
        </Section>

        <Section id="stir" title="6. STIR">
          <p>
            Quarterly whites/reds for SOFR, FF, Euribor, SONIA, TONA, CORRA. Implied = 100 − future price. Meeting odds are a
            tilted Bernoulli on ±25 bp. Cumulative path is the sum of expected steps. FRA–OIS proxy = 3M SOFR − EFFR. Not a live
            CME feed.
          </p>
        </Section>

        <Section id="cot" title="7. COT (TFF)">
          <p>
            Port of <span className="font-mono">quantdesk/cot.py</span>. Traders in Financial Futures: leveraged funds, dealers,
            asset managers, other. Features:
          </p>
          <pre className="mt-2 overflow-x-auto rounded-md border border-border bg-bg-sunken p-3 font-mono text-[11px]">
            {`net_k = (long_k − short_k) / OI × 100
net_cot = net_lf − net_dealer
idx = Williams (x − min) / (max − min) over 156 weeks
z over 156 weeks; d4 / d13 diffs
lf_am_div = z_lf − z_am
extreme ±1 at idx ≥ 0.85 / ≤ 0.15, contrarian`}
          </pre>
          <p className="mt-2">
            Timing (no look-ahead): positions as-of Tuesday; CFTC publishes Friday 15:30 ET (<span className="font-mono">release_lag=3</span>
            ). Default <span className="font-mono">exec_lag=2</span> uses Monday close. Trading Tuesday on Tuesday is a 3-day
            look-ahead. Crypto is CME futures only. Source flag is always <span className="font-mono">synthetic</span> here.
          </p>
        </Section>

        <Section id="risk" title="8. Risk (VaR / ES / Kelly)">
          <p>
            Losses are positive. 1,260 synthetic GARCH-t sessions, 500-day rolling backtest. Estimators: historical, normal,
            Student-t (ν from excess kurtosis), Cornish-Fisher, EVT POT (GPD MOM), EWMA λ=0.94. Kupiec POF, Christoffersen
            independence, Basel traffic light on last 250d. Kelly f* = (μ−r)/σ²; empirical max Σ log(1+fR); Bayes shrink of Sharpe
            toward 0 (τ=0.4). Binary f = p/L − (1−p)/W. P(touch x) = x^(2/c − 1). Size = capital × budget / ES.
          </p>
          <p className="mt-2">Do not size live risk off this tape. Full Kelly has ~50% chance of drawing down to half the capital (GBM).</p>
        </Section>

        <Section id="macro" title="9. Economic calendar">
          <p>
            Surprise z = (actual − consensus) / σ_survey. High / low = consensus ± 1.2816 σ (10th / 90th). P(beat) / P(miss) /
            P(inline) from a biased split. P(above high) = 1 − Φ(z_high − bias). Historical 30m move is the mean beat/miss impulse
            of the primary related asset (FX bp, yields bp, or index %). Drawer lists related tickers and a lookback of 12–26
            prints. Not a Bloomberg ECO calendar.
          </p>
        </Section>

        <Section id="season" title="10. Seasonality">
          <p>
            Twelve years of synthetic monthly returns with asset-specific seasonal means (September oil strength, December equity
            strength are injected, not estimated from a live sample). vsSeason = this-month % change − seasonal mean. Win rate, σ,
            best, worst over n years.
          </p>
        </Section>

        <Section id="theses" title="11. Theses">
          <p>
            Desk book is editorial. Add thesis writes to <span className="font-mono">localStorage</span> (user flag). Hit rate is
            closed HIT / closed n. Replay at entry sets the Monitor time slider to the open date.
          </p>
        </Section>

        <Section id="bank" title="12. Bank tape">
          <p>
            Refresh pulls ING Think, the Fed press XML, the ECB press RSS, and Google News queries for the directory houses.
            Items are deduped and sorted newest first (cap 80). A LIVE RSS banner means at least one feed answered; CACHE means
            the desk reconstructions in <span className="font-mono">BANK_NOTES</span>. Make thesis writes an Open call from the
            headline. Draft with Grok calls xAI only on that click and refuses if the key is absent — it does not invent a draft.
          </p>
          <ul className="mt-2 space-y-1 font-mono text-[11px]">
            {BANK_SOURCES.map((s) => (
              <li key={s.id}>
                <span className="text-accent">{s.house}</span>
                <span className="text-fg-subtle"> · {s.kind} · </span>
                <a href={s.href} target="_blank" rel="noreferrer" className="text-fg no-underline hover:text-accent">
                  {s.title}
                </a>
              </li>
            ))}
          </ul>
        </Section>

        <Section id="invest" title="13. Invest">
          <p>
            Port of the desk toolkit (<span className="font-mono">vendor/invest</span>). DCF: annual FCF CAGR clipped to ±50%,
            WACC from equity beta vs SPY, Rf from ^TNX, Rm from 10y ^GSPC CAGR, Gordon terminal only if WACC exceeds g. BUY/SELL if
            the margin of safety is outside ±5%. Price and beta are current; FCF is historical — that is a look-ahead, labeled on
            the thesis. Portfolio: Dirichlet Monte Carlo, max-Sharpe and min-vol, walk-forward on the trailing 180 sessions only
            (rebalance every 21). Congress: signed mid of disclosed ranges. Legal lag up to 45 days. Not a live Capitol Trades scrape.
          </p>
        </Section>

        <Section id="cards" title="14. Model cards">
          {METHODOLOGY.map((m) => (
            <article key={m.id} className="mt-3 rounded-md border border-border bg-bg-elevated p-4">
              <h3 className="text-sm font-medium">{m.name}</h3>
              <dl className="mt-2 space-y-1 text-[12px] text-fg-muted">
                <div>
                  <span className="text-fg-subtle">Lookback · </span>
                  {m.lookback}
                </div>
                <div>
                  <span className="text-fg-subtle">Sources · </span>
                  {m.sources}
                </div>
                <div>
                  <span className="text-fg-subtle">Formula · </span>
                  <span className="font-mono text-[11px] text-fg">{m.formula}</span>
                </div>
                <p className="pt-1">{m.notes}</p>
              </dl>
            </article>
          ))}
          <h3 className="mt-6 text-sm font-medium">Changelog</h3>
          <ul className="mt-2 space-y-2 text-[12px] text-fg-muted">
            {CHANGELOG.map((c) => (
              <li key={c.v}>
                <span className="font-mono text-fg">{c.v}</span> · {c.date} — {c.text}
              </li>
            ))}
          </ul>
          <p className="mt-4 font-mono text-[11px] text-fg-subtle">Updated {MODEL_UPDATED}</p>
        </Section>
      </div>
    </IntelPage>
  );
}

function Section({ id, title, children }: { id: string; title: string; children: React.ReactNode }) {
  return (
    <section id={id}>
      <h2 className="font-mono text-[10px] tracking-wider text-fg-subtle uppercase">{title}</h2>
      <div className="mt-2 text-[13px] leading-relaxed text-fg-muted">{children}</div>
    </section>
  );
}

function QwenPanel() {
  const [cfg, setCfg] = useState<QwenConfig>(DEFAULT_QWEN);
  const [ping, setPing] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setCfg(loadQwenConfig());
    setHydrated(true);
  }, []);

  const save = (next: QwenConfig) => {
    setCfg(next);
    saveQwenConfig(next);
  };

  return (
    <Section id="qwen" title="3. Local Qwen Code">
      <p>
        Prepared, off by default. Talks OpenAI-compatible <span className="font-mono">/chat/completions</span>. Typical local
        servers: Ollama <span className="font-mono">http://127.0.0.1:11434/v1</span>, LM Studio{" "}
        <span className="font-mono">:1234/v1</span>, llama.cpp (not on 8080 — ARGOS binds that), vLLM{" "}
        <span className="font-mono">:8000/v1</span>. Endpoint and model live in localStorage, never in env secrets.
      </p>
      {!hydrated ? (
        <p className="mt-2 font-mono text-[11px] text-fg-subtle">Loading local config…</p>
      ) : (
        <div className="mt-3 grid gap-2 sm:grid-cols-2">
          <label className="flex items-center gap-2 font-mono text-[12px] sm:col-span-2">
            <input
              type="checkbox"
              checked={cfg.enabled}
              onChange={(e) => save({ ...cfg, enabled: e.target.checked })}
            />
            Enable local Qwen
          </label>
          <label className="flex flex-col gap-1 font-mono text-[11px]">
            <span className="text-fg-subtle">Base URL</span>
            <input
              value={cfg.baseUrl}
              onChange={(e) => save({ ...cfg, baseUrl: e.target.value })}
              className="h-8 border border-border bg-bg-panel px-2"
            />
          </label>
          <label className="flex flex-col gap-1 font-mono text-[11px]">
            <span className="text-fg-subtle">Model</span>
            <input
              value={cfg.model}
              onChange={(e) => save({ ...cfg, model: e.target.value })}
              className="h-8 border border-border bg-bg-panel px-2"
            />
          </label>
          <label className="flex flex-col gap-1 font-mono text-[11px] sm:col-span-2">
            <span className="text-fg-subtle">API key (optional)</span>
            <input
              type="password"
              value={cfg.apiKey}
              onChange={(e) => save({ ...cfg, apiKey: e.target.value })}
              className="h-8 border border-border bg-bg-panel px-2"
            />
          </label>
          <div className="sm:col-span-2">
            <button
              type="button"
              disabled={busy}
              onClick={async () => {
                setBusy(true);
                setPing(null);
                const res = await qwenChat(
                  [
                    { role: "system", content: QWEN_SYSTEM },
                    { role: "user", content: "Reply with exactly: PONG" },
                  ],
                  cfg,
                  { timeoutMs: 8000 },
                );
                setPing(res.ok ? res.text : res.error);
                setBusy(false);
              }}
              className={cn("h-8 rounded-sm border border-border px-3 font-mono text-[11px]", busy && "opacity-60")}
            >
              {busy ? "Pinging…" : "Ping local model"}
            </button>
            {ping && <p className="mt-2 font-mono text-[11px] text-fg">{ping}</p>}
          </div>
        </div>
      )}
    </Section>
  );
}
