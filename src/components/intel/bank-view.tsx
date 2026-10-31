import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import { BANK_SOURCES, type BankKind } from "@/data/bank-sources";
import type { BankArticle } from "@/data/bank-article";
import { guessDomain, guessInstrument, newUserThesis } from "@/data/theses";
import { fetchBankFeed } from "@/lib/bank-feed";
import { draftThesisFromNote } from "@/lib/thesis-ai";
import { cn, utcDate, utcStamp } from "@/lib/utils";
import { useTerminal } from "@/store/terminal";
import { IntelPage } from "./page";

const KINDS: (BankKind | "All")[] = ["All", "IB", "Commercial", "Broker", "Regional"];

export function BankView() {
  const nav = useNavigate();
  const add = useTerminal((s) => s.addThesis);
  const articles = useTerminal((s) => s.bankArticles);
  const live = useTerminal((s) => s.bankFeedLive);
  const at = useTerminal((s) => s.bankFeedAt);
  const setFeed = useTerminal((s) => s.setBankFeed);
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState<string | null>(null);
  const [kind, setKind] = useState<(typeof KINDS)[number]>("All");
  const [house, setHouse] = useState("All");
  const [q, setQ] = useState("");
  const [drafting, setDrafting] = useState<string | null>(null);
  const houses = useMemo(() => ["All", ...Array.from(new Set(BANK_SOURCES.map((s) => s.house)))], []);

  const load = async () => {
    setBusy(true);
    setErr(null);
    try {
      const r = await fetchBankFeed();
      setFeed(r.articles, r.live, r.fetchedAt);
    } catch (e) {
      setErr(e instanceof Error ? e.message : "Feed failed");
    } finally {
      setBusy(false);
    }
  };

  useEffect(() => {
    if (!at) void load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const filtered = articles.filter((a) => {
    if (house !== "All" && a.house !== house) return false;
    if (q && !`${a.title} ${a.house} ${a.tag}`.toLowerCase().includes(q.toLowerCase())) return false;
    return true;
  });

  const commit = (a: BankArticle) => {
    const t = newUserThesis({
      title: `${a.house}: ${a.title}`.slice(0, 160),
      instrument: guessInstrument(`${a.title} ${a.summary}`),
      domain: guessDomain(`${a.title} ${a.summary}`),
      type: "Trade",
      horizon: "6w",
      memo: `${a.summary}\n\nSourced ${a.house} · ${utcDate(a.ts)}. House colour, not a desk primary — size as such.`,
      supports: [`Street note — ${a.house}`, a.title],
      cuts: ["House view. Verify against the tape before sizing."],
      changeMind: ["Note withdrawn, or the print the house is hanging on reverses."],
      analyst: a.house,
      links: [
        { label: a.house, href: a.href },
        { label: "Bank", href: "/bank" },
      ],
    });
    add(t);
    nav({ to: "/theses/$id", params: { id: t.id } });
  };

  const grokDraft = async (a: BankArticle) => {
    setDrafting(a.id);
    setErr(null);
    try {
      const r = await draftThesisFromNote({
        data: { house: a.house, title: a.title, body: a.summary, href: a.href },
      });
      if (!r.ok) {
        setErr(r.error);
        return;
      }
      const t = newUserThesis({
        title: r.draft.title,
        instrument: r.draft.instrument,
        domain: r.draft.domain,
        type: r.draft.type,
        horizon: r.draft.horizon,
        memo: r.draft.memo,
        supports: r.draft.supports,
        cuts: r.draft.cuts,
        changeMind: r.draft.changeMind,
        analyst: `${a.house} · Grok`,
        links: [
          { label: a.house, href: a.href },
          { label: "Bank", href: "/bank" },
        ],
      });
      add(t);
      nav({ to: "/theses/$id", params: { id: t.id } });
    } catch (e) {
      setErr(e instanceof Error ? e.message : "Draft failed");
    } finally {
      setDrafting(null);
    }
  };

  const src = BANK_SOURCES.filter((s) => (kind === "All" || s.kind === kind) && (house === "All" || s.house === house));

  return (
    <IntelPage
      title="Bank"
      kicker="Live street tape — ING / Fed / ECB / house RSS"
      actions={
        <button
          type="button"
          onClick={() => void load()}
          disabled={busy}
          className="h-7 rounded-sm border border-border px-2 font-mono text-[11px] hover:bg-bg-hover disabled:opacity-50"
        >
          {busy ? "Fetching…" : "Refresh"}
        </button>
      }
    >
      <p
        className={cn(
          "border-b border-border px-3 py-2 font-mono text-[11px] md:px-4",
          live ? "text-bull" : "text-warn",
        )}
      >
        {live ? "LIVE RSS" : "CACHE — desk reconstructions"}
        {at ? ` · pulled ${utcStamp(at)} UTC ${utcDate(at)}` : ""} · {articles.length} notes · Make thesis writes an Open call on Theses
      </p>
      {err && <p className="border-b border-border px-3 py-2 font-mono text-[11px] text-bear md:px-4">{err}</p>}

      <div className="flex flex-wrap items-center gap-2 border-b border-border px-3 py-2 md:px-4">
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Filter the tape…"
          className="h-8 min-w-[160px] flex-1 rounded-sm border border-border bg-bg-panel px-2 font-mono text-[12px] outline-none"
        />
        <select
          value={house}
          onChange={(e) => setHouse(e.target.value)}
          className="h-8 border border-border bg-bg-panel px-2 font-mono text-[11px]"
        >
          {["All", ...Array.from(new Set(articles.map((a) => a.house))).sort()].map((h) => (
            <option key={h}>{h}</option>
          ))}
        </select>
      </div>

      <section className="border-b border-border px-3 py-4 md:px-4">
        <h2 className="font-mono text-[10px] tracking-wider text-fg-subtle uppercase">Fresh notes</h2>
        <div className="mt-3 grid gap-3 md:grid-cols-2">
          {filtered.slice(0, 24).map((n) => (
            <article key={n.id} className="flex flex-col rounded-md border border-border bg-bg-elevated p-4">
              <div className="flex items-center gap-2 font-mono text-[10px] text-fg-subtle">
                <span className="text-accent">{n.house}</span>
                <span>·</span>
                <span>{utcDate(n.ts)}</span>
                <span className="ml-auto tracking-wider uppercase">{n.tag}</span>
              </div>
              <h3 className="mt-2 text-sm font-medium leading-snug">{n.title}</h3>
              <p className="mt-2 flex-1 text-[13px] leading-relaxed text-fg-muted">{n.summary}</p>
              <div className="mt-3 flex flex-wrap gap-2 font-mono text-[11px]">
                <button type="button" onClick={() => commit(n)} className="h-8 rounded-sm border border-border px-2 hover:bg-bg-hover">
                  Make thesis
                </button>
                <button
                  type="button"
                  onClick={() => void grokDraft(n)}
                  disabled={drafting === n.id}
                  className="h-8 rounded-sm border border-border px-2 hover:bg-bg-hover disabled:opacity-50"
                >
                  {drafting === n.id ? "Grok…" : "Draft with Grok"}
                </button>
                <a href={n.href} target="_blank" rel="noreferrer" className="inline-flex h-8 items-center text-accent no-underline">
                  Open →
                </a>
              </div>
            </article>
          ))}
          {filtered.length === 0 && <p className="text-[13px] text-fg-muted">No notes in this filter.</p>}
        </div>
      </section>

      <section className="px-3 py-4 md:px-4">
        <div className="flex flex-wrap items-center gap-2">
          <h2 className="mr-4 font-mono text-[10px] tracking-wider text-fg-subtle uppercase">Directory</h2>
          {KINDS.map((k) => (
            <button key={k} type="button" onClick={() => setKind(k)} className={cn("h-7 px-2 font-mono text-[10px]", kind === k ? "text-fg" : "text-fg-muted")}>
              {k}
            </button>
          ))}
          <select value={house} onChange={(e) => setHouse(e.target.value)} className="ml-auto h-8 border border-border bg-bg-panel px-2 font-mono text-[11px]">
            {houses.map((h) => (
              <option key={h}>{h}</option>
            ))}
          </select>
        </div>
        <ul className="mt-3 divide-y divide-border rounded-md border border-border">
          {src.map((s) => (
            <li key={s.id} className="flex flex-col gap-1 px-3 py-3 sm:flex-row sm:items-baseline sm:justify-between">
              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="font-mono text-[11px] text-accent">{s.house}</span>
                  <span className="rounded-xs border border-border px-1.5 font-mono text-[10px] text-fg-subtle">{s.kind}</span>
                  <span className="font-mono text-[10px] text-fg-subtle">{s.desk}</span>
                </div>
                <div className="mt-1 text-sm">{s.title}</div>
                <p className="mt-1 text-[12px] text-fg-muted">{s.note}</p>
              </div>
              <a href={s.href} target="_blank" rel="noreferrer" className="shrink-0 font-mono text-[11px] text-accent no-underline">
                Open →
              </a>
            </li>
          ))}
        </ul>
      </section>
    </IntelPage>
  );
}
