import { useMemo, useState } from "react";
import { Link } from "@tanstack/react-router";
import { BoundArea } from "@/lib/chart";
import { THESES, closedTheses, newUserThesis, thesisById, trackRecord } from "@/data/theses";
import { series } from "@/lib/utils";
import type { Domain, Thesis, ThesisStatus, ThesisType } from "@/data/types";
import { cn, fmtNum, fmtPct } from "@/lib/utils";
import { useTerminal } from "@/store/terminal";
import { ScoreBar } from "@/components/terminal/bits";
import { IntelPage } from "./page";

const DOMAINS: (Domain | "All")[] = ["All", "Geopolitics", "Macro", "Commodities", "FX", "Energy", "Equities", "Rates", "Crypto"];

export function ThesesList() {
  const user = useTerminal((s) => s.userTheses);
  const addThesis = useTerminal((s) => s.addThesis);
  const [domain, setDomain] = useState<Domain | "All">("All");
  const [type, setType] = useState<ThesisType | "All">("All");
  const [status, setStatus] = useState<ThesisStatus | "All">("Open");
  const [form, setForm] = useState(false);
  const book = [...user, ...THESES];
  const rows = book.filter((t) => {
    if (domain !== "All" && t.domain !== domain) return false;
    if (type !== "All" && t.type !== type) return false;
    if (status !== "All" && t.status !== status) return false;
    return true;
  });
  const tr = trackRecord(user);

  return (
    <IntelPage
      title="Theses"
      kicker="Desk calls — directional trades and Polymarket"
      actions={
        <div className="flex items-center gap-3">
          <span className="font-mono text-[11px] text-fg-muted">
            Closed hit rate {Math.round(tr.hitRate * 100)}% · n={tr.n}
          </span>
          <button
            type="button"
            onClick={() => setForm((v) => !v)}
            className="h-7 rounded-sm border border-border px-2 font-mono text-[11px] hover:bg-bg-hover"
          >
            {form ? "Close form" : "Add thesis"}
          </button>
        </div>
      }
    >
      {form && <ThesisForm onAdd={(t) => { addThesis(t); setForm(false); }} onCancel={() => setForm(false)} />}
      <div className="flex flex-wrap gap-2 border-b border-border px-3 py-2 md:px-4">
        <Select value={domain} onChange={setDomain} opts={DOMAINS} />
        <Select value={type} onChange={setType} opts={["All", "Market", "Trade"]} />
        <Select value={status} onChange={setStatus} opts={["All", "Open", "Closed"]} />
        <a href="#track" className="ml-auto font-mono text-[11px] text-accent no-underline">
          Public track-record
        </a>
      </div>
      <div className="grid gap-3 p-3 md:grid-cols-2 md:p-4">
        {rows.map((t) => (
          <ThesisCard key={t.id} t={t} />
        ))}
        {rows.length === 0 && (
          <p className="col-span-full py-12 text-center text-sm text-fg-muted">No theses in this filter.</p>
        )}
      </div>
      {status !== "Open" && (
        <section id="track" className="border-t border-border px-3 py-6 md:px-4">
          <h2 className="text-sm font-medium">Closed book</h2>
          <p className="mt-1 text-[12px] text-fg-muted">
            Hit {tr.hits} / stopped {tr.stopped} · average edge captured {tr.avgEdge.toFixed(2)}
          </p>
          <div className="mt-3 overflow-x-auto">
            <table className="w-full min-w-[640px] text-left font-mono text-[12px]">
              <thead className="text-[10px] tracking-wider text-fg-subtle uppercase">
                <tr>
                  <th className="py-2">Thesis</th>
                  <th>State</th>
                  <th>Domain</th>
                  <th>Edge</th>
                  <th>Closed</th>
                </tr>
              </thead>
              <tbody>
                {closedTheses(user).map((t) => (
                  <tr key={t.id} className="border-t border-border">
                    <td className="py-2">
                      <Link to="/theses/$id" params={{ id: t.id }} className="text-fg no-underline hover:text-accent">
                        {t.title}
                      </Link>
                    </td>
                    <td className={t.state === "HIT" ? "text-bull" : "text-bear"}>{t.state}</td>
                    <td className="text-fg-muted">{t.domain}</td>
                    <td>{t.edgeCaptured.toFixed(2)}</td>
                    <td className="text-fg-muted">{t.closed}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      )}
    </IntelPage>
  );
}

function ThesisForm({ onAdd, onCancel }: { onAdd: (t: Thesis) => void; onCancel: () => void }) {
  const [title, setTitle] = useState("");
  const [instrument, setInstrument] = useState("");
  const [domain, setDomain] = useState<Domain>("Macro");
  const [type, setType] = useState<ThesisType>("Trade");
  const [unit, setUnit] = useState<"px" | "prob">("px");
  const [entry, setEntry] = useState("");
  const [target, setTarget] = useState("");
  const [last, setLast] = useState("");
  const [horizon, setHorizon] = useState("3m");
  const [memo, setMemo] = useState("");
  const [supports, setSupports] = useState("");
  const [cuts, setCuts] = useState("");
  const [changeMind, setChangeMind] = useState("");

  return (
    <form
      className="border-b border-border bg-bg-elevated px-3 py-4 md:px-4"
      onSubmit={(e) => {
        e.preventDefault();
        if (!title.trim() || !instrument.trim()) return;
        const split = (s: string) =>
          s
            .split(/[;\n]/)
            .map((x) => x.trim())
            .filter(Boolean);
        onAdd(
          newUserThesis({
            title,
            instrument,
            domain,
            type,
            unit,
            entry: Number(entry) || 0,
            target: Number(target) || Number(entry) || 0,
            last: Number(last) || Number(entry) || 0,
            horizon,
            memo,
            supports: split(supports),
            cuts: split(cuts),
            changeMind: split(changeMind),
          }),
        );
      }}
    >
      <h2 className="font-mono text-[10px] tracking-wider text-fg-subtle uppercase">New thesis</h2>
      <p className="mt-1 text-[12px] text-fg-muted">Stored locally on this machine. Desk book below is unchanged.</p>
      <div className="mt-3 grid gap-2 sm:grid-cols-2 lg:grid-cols-4">
        <label className="flex flex-col gap-1 font-mono text-[11px] sm:col-span-2">
          <span className="text-fg-subtle">Title</span>
          <input required value={title} onChange={(e) => setTitle(e.target.value)} className="h-8 border border-border bg-bg-panel px-2" />
        </label>
        <label className="flex flex-col gap-1 font-mono text-[11px]">
          <span className="text-fg-subtle">Instrument</span>
          <input required value={instrument} onChange={(e) => setInstrument(e.target.value)} placeholder="WTI, EURUSD, pm-fed" className="h-8 border border-border bg-bg-panel px-2" />
        </label>
        <label className="flex flex-col gap-1 font-mono text-[11px]">
          <span className="text-fg-subtle">Horizon</span>
          <input value={horizon} onChange={(e) => setHorizon(e.target.value)} className="h-8 border border-border bg-bg-panel px-2" />
        </label>
        <label className="flex flex-col gap-1 font-mono text-[11px]">
          <span className="text-fg-subtle">Domain</span>
          <select value={domain} onChange={(e) => setDomain(e.target.value as Domain)} className="h-8 border border-border bg-bg-panel px-2">
            {DOMAINS.filter((d) => d !== "All").map((d) => (
              <option key={d}>{d}</option>
            ))}
          </select>
        </label>
        <label className="flex flex-col gap-1 font-mono text-[11px]">
          <span className="text-fg-subtle">Type</span>
          <select value={type} onChange={(e) => setType(e.target.value as ThesisType)} className="h-8 border border-border bg-bg-panel px-2">
            <option>Trade</option>
            <option>Market</option>
          </select>
        </label>
        <label className="flex flex-col gap-1 font-mono text-[11px]">
          <span className="text-fg-subtle">Unit</span>
          <select value={unit} onChange={(e) => setUnit(e.target.value as "px" | "prob")} className="h-8 border border-border bg-bg-panel px-2">
            <option value="px">Price</option>
            <option value="prob">Probability</option>
          </select>
        </label>
        <label className="flex flex-col gap-1 font-mono text-[11px]">
          <span className="text-fg-subtle">Entry</span>
          <input type="number" step="any" value={entry} onChange={(e) => setEntry(e.target.value)} className="h-8 border border-border bg-bg-panel px-2" />
        </label>
        <label className="flex flex-col gap-1 font-mono text-[11px]">
          <span className="text-fg-subtle">Last</span>
          <input type="number" step="any" value={last} onChange={(e) => setLast(e.target.value)} className="h-8 border border-border bg-bg-panel px-2" />
        </label>
        <label className="flex flex-col gap-1 font-mono text-[11px]">
          <span className="text-fg-subtle">Target</span>
          <input type="number" step="any" value={target} onChange={(e) => setTarget(e.target.value)} className="h-8 border border-border bg-bg-panel px-2" />
        </label>
      </div>
      <label className="mt-2 flex flex-col gap-1 font-mono text-[11px]">
        <span className="text-fg-subtle">Memo</span>
        <textarea value={memo} onChange={(e) => setMemo(e.target.value)} rows={3} className="border border-border bg-bg-panel px-2 py-2" />
      </label>
      <div className="mt-2 grid gap-2 md:grid-cols-3">
        <label className="flex flex-col gap-1 font-mono text-[11px]">
          <span className="text-fg-subtle">Supports (semicolon)</span>
          <input value={supports} onChange={(e) => setSupports(e.target.value)} className="h-8 border border-border bg-bg-panel px-2" />
        </label>
        <label className="flex flex-col gap-1 font-mono text-[11px]">
          <span className="text-fg-subtle">Cuts against</span>
          <input value={cuts} onChange={(e) => setCuts(e.target.value)} className="h-8 border border-border bg-bg-panel px-2" />
        </label>
        <label className="flex flex-col gap-1 font-mono text-[11px]">
          <span className="text-fg-subtle">What would change our mind</span>
          <input value={changeMind} onChange={(e) => setChangeMind(e.target.value)} className="h-8 border border-border bg-bg-panel px-2" />
        </label>
      </div>
      <div className="mt-3 flex gap-2">
        <button type="submit" className="h-8 rounded-sm bg-accent px-3 font-mono text-[11px] text-accent-fg">
          Book it
        </button>
        <button type="button" onClick={onCancel} className="h-8 rounded-sm border border-border px-3 font-mono text-[11px]">
          Cancel
        </button>
      </div>
    </form>
  );
}

function ThesisCard({ t }: { t: Thesis }) {
  const prog = progress(t);
  return (
    <Link
      to="/theses/$id"
      params={{ id: t.id }}
      className="block rounded-md border border-border bg-bg-elevated p-4 no-underline hover:border-border-strong"
    >
      <div className="flex items-center gap-2">
        <StateChip s={t.state} />
        <span className="font-mono text-[10px] text-fg-subtle">
          {t.domain} · {t.type}
          {t.user ? " · YOU" : ""}
        </span>
        <span className="ml-auto font-mono text-[10px] text-fg-subtle">{t.status}</span>
      </div>
      <h3 className="mt-2 text-sm font-medium leading-snug text-fg">{t.title}</h3>
      <div className="mt-3 grid grid-cols-3 gap-2 font-mono text-[11px]">
        <div>
          <div className="text-fg-subtle">Entry</div>
          <div>{fmtLevel(t, t.entry)}</div>
        </div>
        <div>
          <div className="text-fg-subtle">Last</div>
          <div>{fmtLevel(t, t.last)}</div>
        </div>
        <div>
          <div className="text-fg-subtle">Target</div>
          <div>{fmtLevel(t, t.target)}</div>
        </div>
      </div>
      <div className="mt-3">
        <div className="mb-1 flex justify-between font-mono text-[10px] text-fg-subtle">
          <span>Progress</span>
          <span>{Math.round(prog * 100)}%</span>
        </div>
        <ScoreBar n={prog * 100} />
      </div>
    </Link>
  );
}

export function ThesisDetail({ id }: { id: string }) {
  const user = useTerminal((s) => s.userTheses);
  const remove = useTerminal((s) => s.removeThesis);
  const t = thesisById(id, user);
  const setAsOf = useTerminal((s) => s.setAsOf);
  const chart = useMemo(() => {
    if (!t) return [];
    return series(t.id, 90, t.entry, Math.abs(t.target - t.entry) / 18, Date.now()).map((v, i) => ({
      i,
      v,
    }));
  }, [t]);
  if (!t) {
    return (
      <IntelPage title="Thesis">
        <p className="p-6 text-sm text-fg-muted">Unknown thesis.</p>
      </IntelPage>
    );
  }
  const prog = progress(t);
  return (
    <IntelPage
      title={t.instrument}
      kicker={t.analyst}
      actions={
        <div className="flex gap-2">
          {t.user && (
            <button
              type="button"
              className="h-7 rounded-sm border border-bear/40 px-2 font-mono text-[11px] text-bear hover:bg-bg-hover"
              onClick={() => {
                remove(t.id);
                window.location.href = "/theses";
              }}
            >
              Delete
            </button>
          )}
          {t.status === "Closed" ? (
            <button
              type="button"
              className="h-7 rounded-sm border border-border px-2 font-mono text-[11px] hover:bg-bg-hover"
              onClick={() => {
                const ts = Date.parse(`${t.opened} UTC`);
                if (!Number.isNaN(ts)) setAsOf(ts);
                window.location.href = "/";
              }}
            >
              Replay at entry
            </button>
          ) : null}
        </div>
      }
    >
      <div className="mx-auto grid max-w-6xl gap-6 p-3 md:grid-cols-[1.2fr_0.8fr] md:p-6">
        <div>
          <StateChip s={t.state} />
          <h2 className="mt-2 text-xl font-medium tracking-tight">{t.title}</h2>
          <p className="mt-3 text-[13px] leading-relaxed text-fg-muted">{t.memo}</p>
          <div className="mt-4 h-48 rounded-md border border-border bg-bg-elevated p-2">
            <BoundArea data={chart} xKey="i" yKey="v" />
          </div>
          <h3 className="mt-6 text-sm font-medium">State of play</h3>
          <dl className="mt-2 grid grid-cols-2 gap-2 font-mono text-[12px] md:grid-cols-4">
            <KV k="Opened" v={t.opened} />
            <KV k="Horizon" v={t.horizon} />
            <KV k="Progress" v={fmtPct(prog * 100, 0, false)} />
            <KV k="Edge cap." v={t.edgeCaptured.toFixed(2)} />
          </dl>
          <h3 className="mt-6 text-sm font-medium">What would change our mind</h3>
          <ul className="mt-2 list-disc space-y-1 pl-4 text-[13px] text-fg-muted">
            {t.changeMind.map((x) => (
              <li key={x}>{x}</li>
            ))}
          </ul>
        </div>
        <div className="space-y-4">
          <div className="rounded-md border border-border bg-bg-elevated p-3">
            <div className="font-mono text-[10px] tracking-wider text-bull uppercase">Supports the call</div>
            <ul className="mt-2 space-y-1 text-[12px] text-fg-muted">
              {t.supports.map((x) => (
                <li key={x}>· {x}</li>
              ))}
            </ul>
          </div>
          <div className="rounded-md border border-border bg-bg-elevated p-3">
            <div className="font-mono text-[10px] tracking-wider text-bear uppercase">Cuts against</div>
            <ul className="mt-2 space-y-1 text-[12px] text-fg-muted">
              {t.cuts.map((x) => (
                <li key={x}>· {x}</li>
              ))}
            </ul>
          </div>
          <div className="rounded-md border border-border bg-bg-elevated p-3">
            <div className="font-mono text-[10px] tracking-wider text-fg-subtle uppercase">Daily log</div>
            <ul className="mt-2 space-y-2 text-[12px]">
              {t.log.map((l) => (
                <li key={l.date}>
                  <span className="font-mono text-[10px] text-fg-subtle">{l.date}</span>
                  <div className="text-fg-muted">{l.text}</div>
                </li>
              ))}
            </ul>
          </div>
          <div className="flex flex-wrap gap-2">
            {t.links.map((l) => (
              <a key={l.href} href={l.href} className="font-mono text-[11px] text-accent no-underline">
                {l.label}
              </a>
            ))}
          </div>
        </div>
      </div>
    </IntelPage>
  );
}

function progress(t: Thesis) {
  const span = t.target - t.entry;
  if (span === 0) return 0;
  return Math.max(0, Math.min(1, (t.last - t.entry) / span));
}

function fmtLevel(t: Thesis, n: number) {
  return t.unit === "prob" ? `${Math.round(n * 100)}%` : fmtNum(n, n > 100 ? 0 : 2);
}

function StateChip({ s }: { s: Thesis["state"] }) {
  const cls =
    s === "WINNING" || s === "HIT"
      ? "text-bull border-bull/30 bg-bull/10"
      : s === "LOSING" || s === "STOPPED"
        ? "text-bear border-bear/30 bg-bear/10"
        : "text-fg-muted border-border bg-bg-panel";
  return <span className={cn("rounded-xs border px-1.5 py-0.5 font-mono text-[10px]", cls)}>{s}</span>;
}

function KV({ k, v }: { k: string; v: string }) {
  return (
    <div className="rounded-sm bg-bg-panel px-2 py-2">
      <div className="text-[10px] text-fg-subtle">{k}</div>
      <div className="text-fg">{v}</div>
    </div>
  );
}

function Select<T extends string>({ value, onChange, opts }: { value: T; onChange: (v: T) => void; opts: T[] }) {
  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value as T)}
      className="h-8 rounded-sm border border-border bg-bg-panel px-2 font-mono text-[11px] text-fg"
    >
      {opts.map((o) => (
        <option key={o} value={o}>
          {o}
        </option>
      ))}
    </select>
  );
}
