import { Link } from "@tanstack/react-router";
import { BRIEF_ARCS, BRIEF_CLOCK, BRIEF_DATE, BRIEF_EVENTS, BRIEF_KICKER, BRIEF_TITLE } from "@/data/brief";
import { PULSE_ASSETS, pxOf } from "@/data/prices";
import { pmMarkets } from "@/data/calculated";
import { useClock } from "@/hooks/clock";
import { cn } from "@/lib/utils";
import { Delta, SeverityPill } from "@/components/terminal/bits";
import { IntelPage } from "./page";

export function BriefView() {
  const asOf = useClock();
  const pms = pmMarkets(asOf);
  return (
    <IntelPage title="Brief" kicker={`${BRIEF_DATE} · daily note`} actions={<span className="font-mono text-[10px] text-fg-subtle">v1.0 desk</span>}>
      <div className="mx-auto max-w-6xl px-3 py-5 md:px-6">
        <p className="font-mono text-[10px] tracking-[0.16em] text-fg-subtle uppercase">{BRIEF_DATE}</p>
        <h2 className="mt-1 text-2xl font-medium tracking-tight md:text-3xl">{BRIEF_TITLE}</h2>
        <p className="mt-2 max-w-3xl text-sm leading-relaxed text-fg-muted">{BRIEF_KICKER}</p>

        <div className="mt-5 grid grid-cols-2 gap-2 md:grid-cols-4">
          {BRIEF_ARCS.map((a) => (
            <div key={a.id} className="rounded-md border border-border bg-bg-elevated p-3">
              <SeverityPill value={a.severity} />
              <div className="mt-2 text-sm font-medium">{a.name}</div>
              <div className="mt-1 text-[11px] text-fg-muted">{a.kicker}</div>
            </div>
          ))}
        </div>

        <div className="mt-5 overflow-x-auto rounded-md border border-border">
          <div className="flex min-w-max">
            {PULSE_ASSETS.map((sym) => {
              const p = pxOf(sym, asOf);
              return (
                <Link
                  key={sym}
                  to="/trend"
                  className="flex min-w-[110px] flex-col gap-0.5 border-r border-border px-3 py-2 no-underline last:border-r-0 hover:bg-bg-hover"
                >
                  <span className="font-mono text-[10px] text-fg-subtle">{sym}</span>
                  <span className="tabular font-mono text-[13px] text-fg">{p.px}</span>
                  <Delta n={p.chg} />
                </Link>
              );
            })}
          </div>
        </div>

        <div className="mt-3 flex gap-3 overflow-x-auto pb-1 font-mono text-[10px] text-fg-subtle">
          {BRIEF_CLOCK.map((c) => (
            <span key={c.utc} className="shrink-0">
              <span className="text-fg">{c.utc}</span> {c.label} · {c.where}
            </span>
          ))}
        </div>

        <div className="mt-8 space-y-8">
          {BRIEF_ARCS.map((arc) => {
            const ev = BRIEF_EVENTS.filter((e) => e.arc === arc.name);
            return (
              <section key={arc.id}>
                <h3 className="mb-3 font-mono text-[11px] tracking-[0.14em] text-fg-subtle uppercase">{arc.name}</h3>
                <div className="space-y-3">
                  {ev.map((e) => {
                    const pm = e.pmId ? pms.find((p) => p.id === e.pmId) : undefined;
                    return (
                      <article
                        key={e.id}
                        className={cn(
                          "rounded-md border border-border bg-bg-elevated p-4",
                          "border-l-2",
                          e.severity === "CRITICAL" && "border-l-bear",
                          e.severity === "HIGH" && "border-l-high",
                          e.severity === "MEDIUM" && "border-l-warn",
                          e.severity === "LOW" && "border-l-accent",
                          e.severity === "INFO" && "border-l-info",
                        )}
                      >
                        <div className="flex flex-wrap items-start gap-2">
                          <SeverityPill value={e.severity} />
                          <h4 className="flex-1 text-sm font-medium leading-snug">{e.title}</h4>
                          <div className="text-right">
                            <div className="font-mono text-[10px] text-fg-subtle">{e.metric.label}</div>
                            <div
                              className={cn(
                                "tabular font-mono text-sm",
                                e.metric.dir === "up" && "text-bull",
                                e.metric.dir === "down" && "text-bear",
                              )}
                            >
                              {e.metric.value}
                            </div>
                          </div>
                        </div>
                        <p className="mt-2 text-[13px] leading-relaxed text-fg-muted">{e.body}</p>
                        <div className="mt-3 flex flex-wrap items-center gap-3">
                          {pm && (
                            <Link
                              to="/markets"
                              className="rounded-sm border border-border px-2 py-1 font-mono text-[11px] text-fg no-underline hover:bg-bg-hover"
                            >
                              PM {Math.round(pm.prob * 100)}% <Delta n={pm.delta24h} />
                            </Link>
                          )}
                          {e.links.map((l) => (
                            <a key={l.href} href={l.href} className="font-mono text-[11px] text-accent no-underline">
                              {l.label}
                            </a>
                          ))}
                        </div>
                      </article>
                    );
                  })}
                </div>
              </section>
            );
          })}
        </div>
      </div>
    </IntelPage>
  );
}
