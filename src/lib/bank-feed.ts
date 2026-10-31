import { createServerFn } from "@tanstack/react-start";
import { BANK_NOTES, BANK_SOURCES } from "@/data/bank-sources";
import { tagFromTitle, type BankArticle } from "@/data/bank-article";
import { parseFeed } from "./rss";

const UA = "ARGOS-Desk/1.0 (personal research terminal)";

async function getText(url: string, ms = 8000): Promise<string | null> {
  const ctrl = new AbortController();
  const t = setTimeout(() => ctrl.abort(), ms);
  try {
    const res = await fetch(url, {
      headers: { "User-Agent": UA, Accept: "application/rss+xml, application/xml, text/xml, */*" },
      signal: ctrl.signal,
    });
    if (!res.ok) return null;
    return await res.text();
  } catch {
    return null;
  } finally {
    clearTimeout(t);
  }
}

function hostOf(href: string): string {
  try {
    return new URL(href).hostname.replace(/^www\./, "");
  } catch {
    return "";
  }
}

function houseOf(title: string, source: string, href: string): string {
  const blob = `${title} ${source} ${href}`.toLowerCase();
  const host = hostOf(href);
  const hits: { house: string; n: number }[] = [];
  for (const s of BANK_SOURCES) {
    const h = s.house.toLowerCase();
    const srcHost = hostOf(s.href);
    if (blob.includes(h) || (host && srcHost && host === srcHost)) {
      hits.push({ house: s.house, n: h.length });
    }
  }
  hits.sort((a, b) => b.n - a.n);
  if (hits[0]) return hits[0].house;
  if (/federal reserve|federalreserve/.test(blob)) return "Fed";
  if (/\becb\b|european central bank/.test(blob)) return "ECB";
  return source.split("|")[0]?.trim() || "Wire";
}

function googleRss(q: string) {
  return `https://news.google.com/rss/search?q=${encodeURIComponent(q)}&hl=en-US&gl=US&ceid=US:en`;
}

const FEEDS: { url: string; house?: string }[] = [
  { url: "https://think.ing.com/rss", house: "ING" },
  { url: "https://www.federalreserve.gov/feeds/press_all.xml", house: "Fed" },
  { url: "https://www.ecb.europa.eu/rss/press.html", house: "ECB" },
  { url: googleRss("ING Think FX OR rates"), house: "ING" },
  { url: googleRss("Danske Bank FX Strategy"), house: "Danske Bank" },
  { url: googleRss("MUFG FX research"), house: "MUFG" },
  { url: googleRss("Scotiabank GBM foreign exchange"), house: "Scotiabank" },
  { url: googleRss("UBS CIO House View"), house: "UBS" },
  { url: googleRss("OCBC FX rates research"), house: "OCBC" },
  { url: googleRss("UOB Group research FX"), house: "UOB" },
  { url: googleRss("ANZ Data Wrap OR DBS economics"), house: "ANZ" },
  { url: googleRss("Sucden Financial FX OR Mizuho market outlook"), house: "Sucden" },
];

function deskFallback(): BankArticle[] {
  return BANK_NOTES.map((n) => ({
    id: n.id,
    house: n.house,
    title: n.title,
    href: n.href,
    ts: Date.parse(`${n.date} 2026`) || Date.now(),
    summary: n.body,
    tag: n.tag,
    source: "desk" as const,
  }));
}

export const fetchBankFeed = createServerFn({ method: "POST" }).handler(async (): Promise<{
  articles: BankArticle[];
  live: boolean;
  fetchedAt: number;
  houses: number;
}> => {
  const chunks = await Promise.all(FEEDS.map(async (f) => ({ f, xml: await getText(f.url) })));
  const seen = new Set<string>();
  const articles: BankArticle[] = [];
  for (const { f, xml } of chunks) {
    if (!xml) continue;
    for (const it of parseFeed(xml)) {
      const key = it.href.replace(/[?#].*$/, "");
      if (seen.has(key) || seen.has(it.title)) continue;
      seen.add(key);
      seen.add(it.title);
      const house = f.house ?? houseOf(it.title, it.source, it.href);
      articles.push({
        id: `rss-${articles.length}-${it.ts}`,
        house,
        title: it.title.replace(/\s+[—|-]\s+.*$/, "").trim(),
        href: it.href,
        ts: it.ts,
        summary: it.summary,
        tag: tagFromTitle(it.title),
        source: "rss",
      });
    }
  }
  articles.sort((a, b) => b.ts - a.ts);
  const live = articles.length > 0;
  const merged = live ? articles.slice(0, 80) : deskFallback();
  const houses = new Set(merged.map((a) => a.house)).size;
  return { articles: merged, live, fetchedAt: Date.now(), houses };
});
