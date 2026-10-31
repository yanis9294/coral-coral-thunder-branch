import { t as createServerFn } from "../server.js";
import { t as createServerRpc } from "./createServerRpc-CD6_r0xe.js";
import { n as BANK_SOURCES, t as BANK_NOTES } from "./bank-sources-Cttxufcf.js";
//#region src/data/bank-article.ts
function tagFromTitle(title) {
	const t = title.toLowerCase();
	if (/\bfx\b|dollar|euro|yen|sterling|peso/.test(t)) return "FX";
	if (/rate|stir|sofr|ecb|fed |boj|banxico|gilt|bund/.test(t)) return "Rates";
	if (/oil|wti|brent|gas|hormuz|opec/.test(t)) return "Energy";
	if (/gold|metal|copper/.test(t)) return "Metals";
	if (/china|taiwan|iran|ukraine|geopolit/.test(t)) return "Geo";
	if (/equity|stock|nasdaq|s&p/.test(t)) return "Eq";
	return "Macro";
}
//#endregion
//#region src/lib/rss.ts
function decode(s) {
	const named = {
		lt: "<",
		gt: ">",
		amp: "&",
		quot: "\"",
		apos: "'",
		nbsp: " "
	};
	let out = s.replace(/<!\[CDATA\[([\s\S]*?)\]\]>/g, "$1");
	const ent = /&(#x?[0-9a-f]+|[a-z]+);/gi;
	for (let i = 0; i < 2; i++) out = out.replace(ent, (m, body) => {
		const key = body.toLowerCase();
		if (named[key]) return named[key];
		if (key.startsWith("#")) {
			const n = key[1] === "x" ? Number.parseInt(key.slice(2), 16) : Number.parseInt(key.slice(1), 10);
			return Number.isFinite(n) ? String.fromCharCode(n) : m;
		}
		return m;
	});
	return out.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();
}
function tag(block, name) {
	const re = new RegExp(`<${name}[^>]*>([\\s\\S]*?)</${name}>`, "i");
	const m = block.match(re);
	if (m) return decode(m[1] ?? "");
	const alt = block.match(new RegExp(`<${name}[^>]+href=["']([^"']+)["']`, "i"));
	return alt ? decode(alt[1] ?? "") : "";
}
function parseFeed(xml) {
	const items = [...xml.matchAll(/<item[\s\S]*?<\/item>/gi), ...xml.matchAll(/<entry[\s\S]*?<\/entry>/gi)];
	const out = [];
	for (const m of items) {
		const b = m[0];
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
			source
		});
	}
	return out;
}
//#endregion
//#region src/lib/bank-feed.ts?tss-serverfn-split
var UA = "ARGOS-Desk/1.0 (personal research terminal)";
async function getText(url, ms = 8e3) {
	const ctrl = new AbortController();
	const t = setTimeout(() => ctrl.abort(), ms);
	try {
		const res = await fetch(url, {
			headers: {
				"User-Agent": UA,
				Accept: "application/rss+xml, application/xml, text/xml, */*"
			},
			signal: ctrl.signal
		});
		if (!res.ok) return null;
		return await res.text();
	} catch {
		return null;
	} finally {
		clearTimeout(t);
	}
}
function hostOf(href) {
	try {
		return new URL(href).hostname.replace(/^www\./, "");
	} catch {
		return "";
	}
}
function houseOf(title, source, href) {
	const blob = `${title} ${source} ${href}`.toLowerCase();
	const host = hostOf(href);
	const hits = [];
	for (const s of BANK_SOURCES) {
		const h = s.house.toLowerCase();
		const srcHost = hostOf(s.href);
		if (blob.includes(h) || host && srcHost && host === srcHost) hits.push({
			house: s.house,
			n: h.length
		});
	}
	hits.sort((a, b) => b.n - a.n);
	if (hits[0]) return hits[0].house;
	if (/federal reserve|federalreserve/.test(blob)) return "Fed";
	if (/\becb\b|european central bank/.test(blob)) return "ECB";
	return source.split("|")[0]?.trim() || "Wire";
}
function googleRss(q) {
	return `https://news.google.com/rss/search?q=${encodeURIComponent(q)}&hl=en-US&gl=US&ceid=US:en`;
}
var FEEDS = [
	{
		url: "https://think.ing.com/rss",
		house: "ING"
	},
	{
		url: "https://www.federalreserve.gov/feeds/press_all.xml",
		house: "Fed"
	},
	{
		url: "https://www.ecb.europa.eu/rss/press.html",
		house: "ECB"
	},
	{
		url: googleRss("ING Think FX OR rates"),
		house: "ING"
	},
	{
		url: googleRss("Danske Bank FX Strategy"),
		house: "Danske Bank"
	},
	{
		url: googleRss("MUFG FX research"),
		house: "MUFG"
	},
	{
		url: googleRss("Scotiabank GBM foreign exchange"),
		house: "Scotiabank"
	},
	{
		url: googleRss("UBS CIO House View"),
		house: "UBS"
	},
	{
		url: googleRss("OCBC FX rates research"),
		house: "OCBC"
	},
	{
		url: googleRss("UOB Group research FX"),
		house: "UOB"
	},
	{
		url: googleRss("ANZ Data Wrap OR DBS economics"),
		house: "ANZ"
	},
	{
		url: googleRss("Sucden Financial FX OR Mizuho market outlook"),
		house: "Sucden"
	}
];
function deskFallback() {
	return BANK_NOTES.map((n) => ({
		id: n.id,
		house: n.house,
		title: n.title,
		href: n.href,
		ts: Date.parse(`${n.date} 2026`) || Date.now(),
		summary: n.body,
		tag: n.tag,
		source: "desk"
	}));
}
var fetchBankFeed_createServerFn_handler = createServerRpc({
	id: "8a1597edd1b073acd7ac88e6749b1bc240e86bb40e8b2b75f494c6879f9757f5",
	name: "fetchBankFeed",
	filename: "src/lib/bank-feed.ts"
}, (opts) => fetchBankFeed.__executeServer(opts));
var fetchBankFeed = createServerFn({ method: "POST" }).handler(fetchBankFeed_createServerFn_handler, async () => {
	const chunks = await Promise.all(FEEDS.map(async (f) => ({
		f,
		xml: await getText(f.url)
	})));
	const seen = /* @__PURE__ */ new Set();
	const articles = [];
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
				source: "rss"
			});
		}
	}
	articles.sort((a, b) => b.ts - a.ts);
	const live = articles.length > 0;
	const merged = live ? articles.slice(0, 80) : deskFallback();
	const houses = new Set(merged.map((a) => a.house)).size;
	return {
		articles: merged,
		live,
		fetchedAt: Date.now(),
		houses
	};
});
//#endregion
export { fetchBankFeed_createServerFn_handler };
