/** Tiny RSS/Atom parser — no extra dependency. */

export interface RssItem {
  title: string;
  href: string;
  ts: number;
  summary: string;
  source: string;
}

function decode(s: string) {
  const named: Record<string, string> = { lt: "<", gt: ">", amp: "&", quot: '"', apos: "'", nbsp: " " };
  let out = s.replace(/<!\[CDATA\[([\s\S]*?)\]\]>/g, "$1");
  const ent = /&(#x?[0-9a-f]+|[a-z]+);/gi;
  for (let i = 0; i < 2; i++) {
    out = out.replace(ent, (m, body: string) => {
      const key = body.toLowerCase();
      if (named[key]) return named[key]!;
      if (key.startsWith("#")) {
        const n = key[1] === "x" ? Number.parseInt(key.slice(2), 16) : Number.parseInt(key.slice(1), 10);
        return Number.isFinite(n) ? String.fromCharCode(n) : m;
      }
      return m;
    });
  }
  return out.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();
}

function tag(block: string, name: string): string {
  const re = new RegExp(`<${name}[^>]*>([\\s\\S]*?)</${name}>`, "i");
  const m = block.match(re);
  if (m) return decode(m[1] ?? "");
  const alt = block.match(new RegExp(`<${name}[^>]+href=["']([^"']+)["']`, "i"));
  return alt ? decode(alt[1] ?? "") : "";
}

export function parseFeed(xml: string): RssItem[] {
  const items = [...xml.matchAll(/<item[\s\S]*?<\/item>/gi), ...xml.matchAll(/<entry[\s\S]*?<\/entry>/gi)];
  const out: RssItem[] = [];
  for (const m of items) {
    const b = m[0]!;
    const title = tag(b, "title");
    const href = tag(b, "link") || tag(b, "id") || tag(b, "guid");
    const rawDate = tag(b, "pubDate") || tag(b, "updated") || tag(b, "published") || tag(b, "dc:date");
    const ts = Date.parse(rawDate);
    const summary = tag(b, "description") || tag(b, "summary") || tag(b, "content");
    const source = tag(b, "source") || "";
    if (!title || !href) continue;
    out.push({
      title,
      href,
      ts: Number.isFinite(ts) ? ts : Date.now(),
      summary: summary.slice(0, 400),
      source,
    });
  }
  return out;
}
