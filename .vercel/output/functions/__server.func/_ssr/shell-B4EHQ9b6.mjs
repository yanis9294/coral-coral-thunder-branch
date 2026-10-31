import { i as __toESM } from "../_runtime.mjs";
import { C as require_jsx_runtime, S as useRouter, Z as require_react, b as Link, p as useRouterState, x as useNavigate } from "../_libs/@tanstack/react-router+[...].mjs";
import { c as Clock, i as Menu, o as Ellipsis, r as Search, s as Command, t as X } from "../_libs/lucide-react.mjs";
import { t as clsx } from "../_libs/clsx.mjs";
import { t as twMerge } from "../_libs/tailwind-merge.mjs";
import { n as create, t as persist } from "../_libs/zustand.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/shell-B4EHQ9b6.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var THESES = [
	{
		id: "th-hormuz",
		title: "Oil holds a Hormuz premium — stay long WTI into year-end",
		domain: "Energy",
		type: "Trade",
		status: "Open",
		state: "WINNING",
		instrument: "WTI",
		entry: 74.2,
		target: 92,
		last: 81.4,
		unit: "px",
		opened: "12 Jun 2026",
		horizon: "Dec 2026",
		edgeCaptured: .41,
		analyst: "N. Rahmani",
		memo: "The market still treats Hormuz as a 48-hour headline. The desk treats it as a regime. Spare capacity is thinner than the 2010s, IRGC has a demonstrated harassment toolkit, and insurers now price the option continuously. We are long WTI on the basis, not on a war bet. A kinetic event is upside, not the thesis. Invalidation is a durable US-Iran de-escalation that collapses war-risk, or a US SPR dump that caps the front.",
		changeMind: [
			"Sustained IRGC stand-down + war-risk premia back to 2023 medians for 15 sessions",
			"OPEC+ adding ≥1.5mbpd with Saudi confirmation of spare",
			"US SPR release >30mb announced"
		],
		supports: [
			"Lloyd's surcharge print today",
			"Fujairah product draw",
			"AIS slowdown in TSS vs 30d median",
			"PM Hormuz-closed still only 12% — cheap tail vs our view"
		],
		cuts: [
			"IEA still flags 'adequate' stocks in OECD",
			"US production at record — caps the blow-off",
			"No confirmed boarding in 9 days"
		],
		log: [
			{
				date: "19 Sep",
				text: "Surcharge + drills. Hold. Raise stop to 76.8."
			},
			{
				date: "11 Sep",
				text: "Mandeb harassment cluster. Adds to network thesis, not size."
			},
			{
				date: "02 Sep",
				text: "Fade the first $78 print; reloaded 77.4."
			},
			{
				date: "12 Jun",
				text: "Opened 74.20. Thesis note v1."
			}
		],
		links: [
			{
				label: "Trend · WTI",
				href: "/trend?id=WTI"
			},
			{
				label: "Markets · Hormuz",
				href: "/markets?id=pm-hormuz"
			},
			{
				label: "Monitor",
				href: "/?sel=zone:zone-hormuz"
			}
		]
	},
	{
		id: "th-tsmc",
		title: "Buy the Taiwan blockade tail on Polymarket — still too cheap",
		domain: "Geopolitics",
		type: "Market",
		status: "Open",
		state: "FLAT",
		instrument: "pm-tw",
		entry: .09,
		target: .18,
		last: .08,
		unit: "prob",
		opened: "03 Mar 2026",
		horizon: "Dec 2026",
		edgeCaptured: -.11,
		analyst: "L. Chen",
		memo: "A 2026 blockade remains a low-probability, high-severity event. The market at 8–9% is pricing a round number, not a process. PLA cadence, legal warfare, and customs-inspection 'gray blockade' are the path, not amphibious assault. We own the contract as cheap catastrophe insurance that also pays if the narrative gap closes. This is not a prediction that it happens; it is a statement that 8% is the wrong digit.",
		changeMind: [
			"US-China military-to-military channels restored with a durable ADIZ de-escalation",
			"TSMC geographic diversification materially reduces single-point-of-failure (AZ/JPN capacity >25% of leading edge)",
			"Contract implied vol collapsing with 90d realized"
		],
		supports: [
			"Median-line transits at 2026 highs",
			"Export-control ratchet still in force",
			"No TSMC leading-edge diversification that changes the math this year"
		],
		cuts: [
			"Xi succession PM very high — stability preference",
			"US election now behind us; less 'madman' premium",
			"Mark-to-market is slightly negative"
		],
		log: [
			{
				date: "19 Sep",
				text: "39 aircraft. Hold. Do not chase the 1pt vol pop in TSM."
			},
			{
				date: "14 Aug",
				text: "Trimmed 1/5 on 11¢ spike. Core remains."
			},
			{
				date: "03 Mar",
				text: "Opened 9¢. Size: 2% NAV."
			}
		],
		links: [{
			label: "Markets",
			href: "/markets?id=pm-tw"
		}, {
			label: "Monitor · Strait",
			href: "/?sel=zone:zone-taiwan"
		}]
	},
	{
		id: "th-gold",
		title: "Gold as the cross-asset hedge — $2,800 still in play",
		domain: "Commodities",
		type: "Trade",
		status: "Open",
		state: "WINNING",
		instrument: "XAU",
		entry: 2410,
		target: 2800,
		last: 2642,
		unit: "px",
		opened: "18 Nov 2025",
		horizon: "Mar 2027",
		edgeCaptured: .59,
		analyst: "M. Okonkwo",
		memo: "Official-sector buying + structural fiscal + geopolitics. We are not gold bugs; we are short the idea that real rates dominate this cycle. ETF creates overnight confirm the Western bid is back, not just the Shanghai one. Trim on $2,700; do not exit.",
		changeMind: [
			"Real rates sustainably >2.5% with a strong DXY",
			"Official-sector (EM + official) buying going to zero for two quarters",
			"A true end-of-cycle disinflation that collapses all premia"
		],
		supports: [
			"GLD create 4.2t overnight",
			"DXY fade vs oil bid",
			"EM official accounts still in"
		],
		cuts: ["Positioning on COMEX not extreme yet — room, but also not a squeeze", "Real rates not collapsing"],
		log: [{
			date: "19 Sep",
			text: "ETF create. Hold. Trailing stop 2520."
		}, {
			date: "18 Nov 2025",
			text: "Opened."
		}],
		links: [{
			label: "Trend · XAU",
			href: "/trend?id=XAU"
		}, {
			label: "COT · Gold",
			href: "/cot?id=GC"
		}]
	},
	{
		id: "th-mxn",
		title: "Fade crowded MXN carry — COT extreme",
		domain: "FX",
		type: "Trade",
		status: "Open",
		state: "LOSING",
		instrument: "USDMXN",
		entry: 18.72,
		target: 20.4,
		last: 19.4,
		unit: "px",
		opened: "22 Apr 2026",
		horizon: "Oct 2026",
		edgeCaptured: .4,
		analyst: "S. Alvarez",
		memo: "The peso is a carry darling with COT in the left tail of the last decade. USMCA politics and a late-cycle US labor market are the fundamental pair. We are long USDMXN as a crowding-risk trade, sized as such. Pain is the last 200 pips of carry; the payoff is a disorderly unwind. Do not add.",
		changeMind: ["CFTC non-commercials back inside the 40–60 percentile for 4 prints", "Banxico hiking cycle re-opens in a way that re-widens real carry"],
		supports: ["COT crowding still extreme", "US labor softening in the scorecard"],
		cuts: [
			"Carry still paying",
			"Remittances resilient",
			"Mark-to-market mixed after the bounce"
		],
		log: [{
			date: "19 Sep",
			text: "Still crowded. Hold, no add."
		}, {
			date: "22 Apr",
			text: "Opened 18.72."
		}],
		links: [{
			label: "COT · MXN",
			href: "/cot?id=MXN"
		}, {
			label: "FX",
			href: "/fx"
		}]
	},
	{
		id: "th-fed",
		title: "Fade year-end 50bp cut — issuance, not a put",
		domain: "Macro",
		type: "Market",
		status: "Open",
		state: "WINNING",
		instrument: "pm-fed",
		entry: .58,
		target: .25,
		last: .41,
		unit: "prob",
		opened: "09 Jul 2026",
		horizon: "Dec 2026",
		edgeCaptured: .52,
		analyst: "J. Hart",
		memo: "The 50bp-by-year-end contract was a narrative leftover. Housing and labor are cooling, not collapsing. Today's 20Y tail is a reminder that the Treasury is the supply story. We are short the contract (sold 58¢, cover below 30¢). Do not confuse a Hormuz risk-off day with a Fed put.",
		changeMind: [
			"Payrolls <50k for two prints with unemployment +0.4 in a quarter",
			"Credit event that closes issuance markets",
			"Core PCE ≤2.1% three months running"
		],
		supports: [
			"20Y tail",
			"Labor scorecard still 'cooling' not 'breaking'",
			"PM bid-offer offered today"
		],
		cuts: ["Housing is the residual risk", "Oil spike could do the Fed's job in reverse if it hits core"],
		log: [{
			date: "19 Sep",
			text: "PM −3pp. Hold the short."
		}, {
			date: "09 Jul",
			text: "Sold 58¢."
		}],
		links: [{
			label: "Macro",
			href: "/macro"
		}, {
			label: "Markets",
			href: "/markets?id=pm-fed"
		}]
	},
	{
		id: "th-yen",
		title: "USDJPY offered into 150 — MoF is a floor, not a thesis",
		domain: "FX",
		type: "Trade",
		status: "Open",
		state: "FLAT",
		instrument: "USDJPY",
		entry: 151.2,
		target: 142,
		last: 149.8,
		unit: "px",
		opened: "28 Jul 2026",
		horizon: "Jan 2027",
		edgeCaptured: .15,
		analyst: "K. Saito",
		memo: "Intervention is a tactic. The thesis is BoJ real-rate normalization plus a less one-way carry. We are modestly short USDJPY with a wide stop. Verbal bids today are not a reason to add. Size stays small because carry bleeds.",
		changeMind: ["BoJ returning to YCC-like language", "US exceptionalism re-acceleration that re-opens the rate gap"],
		supports: ["Verbal bids flagged", "JGB 10Y holding above 1%"],
		cuts: ["Carry still the world's favorite", "MoF can pin spot without changing the trend"],
		log: [{
			date: "19 Sep",
			text: "Verbal, not actual. Hold."
		}, {
			date: "28 Jul",
			text: "Opened 151.20."
		}],
		links: [{
			label: "FX",
			href: "/fx"
		}, {
			label: "Trend · USDJPY",
			href: "/trend?id=USDJPY"
		}]
	},
	{
		id: "th-ua-close",
		title: "Ukraine ceasefire 1H26 — closed, stopped",
		domain: "Geopolitics",
		type: "Market",
		status: "Closed",
		state: "STOPPED",
		instrument: "pm-ua",
		entry: .34,
		target: .55,
		last: .19,
		unit: "prob",
		opened: "12 Jan 2026",
		closed: "18 Jun 2026",
		horizon: "Jun 2026",
		edgeCaptured: -1,
		analyst: "N. Rahmani",
		memo: "Wrong on timing. The attritional equilibrium was more stable than the winter commentary implied. Stopped at 19¢ per the rule. Lesson: do not fade a war on a calendar. The 2027 contract is a different animal and is not auto-reopened.",
		changeMind: ["n/a — closed"],
		supports: ["Was: energy-grid stress, aid politics"],
		cuts: ["Front static, US politics less decisive than assumed", "Process, not a date"],
		log: [{
			date: "18 Jun",
			text: "Stopped 19¢. Post-mortem filed."
		}, {
			date: "12 Jan",
			text: "Opened 34¢."
		}],
		links: [{
			label: "Methodology",
			href: "/methodology"
		}]
	},
	{
		id: "th-hy",
		title: "Long HYG into Q1 disinflation — closed, hit",
		domain: "Rates",
		type: "Trade",
		status: "Closed",
		state: "HIT",
		instrument: "HYG",
		entry: 76.4,
		target: 80.5,
		last: 80.5,
		unit: "px",
		opened: "03 Oct 2025",
		closed: "22 Feb 2026",
		horizon: "Mar 2026",
		edgeCaptured: 1,
		analyst: "J. Hart",
		memo: "Worked. Spreads compressed as the landing printed. Exited at target. Would not re-enter here: carry is no longer the edge, it is the crowding.",
		changeMind: ["n/a — closed"],
		supports: ["Landing path", "Default cycle delayed"],
		cuts: ["Was already crowded by January"],
		log: [{
			date: "22 Feb",
			text: "Hit 80.50. Closed."
		}, {
			date: "03 Oct 2025",
			text: "Opened."
		}],
		links: [{
			label: "Trend",
			href: "/trend"
		}]
	},
	{
		id: "th-gas",
		title: "TTF winter squeeze 25/26 — closed, missed",
		domain: "Energy",
		type: "Trade",
		status: "Closed",
		state: "STOPPED",
		instrument: "TTF",
		entry: 41,
		target: 62,
		last: 32.5,
		unit: "px",
		opened: "08 Sep 2025",
		closed: "11 Jan 2026",
		horizon: "Feb 2026",
		edgeCaptured: -1,
		analyst: "M. Okonkwo",
		memo: "Weather and LNG cover were the story. We were long a squeeze that the storage math never quite allowed. Stopped. The 26/27 winter is a new look, not a re-run.",
		changeMind: ["n/a — closed"],
		supports: ["Was: storage optics in October"],
		cuts: ["Norwegian flows, US LNG, warm Dec"],
		log: [{
			date: "11 Jan 2026",
			text: "Stopped 32.5."
		}, {
			date: "08 Sep 2025",
			text: "Opened."
		}],
		links: [{
			label: "Bank",
			href: "/bank"
		}]
	},
	{
		id: "th-btc",
		title: "BTC as liquidity residual, not a macro hedge — closed, hit",
		domain: "Crypto",
		type: "Trade",
		status: "Closed",
		state: "HIT",
		instrument: "BTC",
		entry: 49200,
		target: 62e3,
		last: 62840,
		unit: "px",
		opened: "04 Apr 2025",
		closed: "19 Jan 2026",
		horizon: "Jan 2026",
		edgeCaptured: 1.05,
		analyst: "L. Chen",
		memo: "Treated BTC as a liquidity sponge, not as digital gold. Worked into the ETF residual. Closed at target+. Not a standing long — the crowding in 2026 is different.",
		changeMind: ["n/a — closed"],
		supports: ["ETF flow", "USD liquidity"],
		cuts: ["Correlation to NDX too high to be a hedge"],
		log: [{
			date: "19 Jan 2026",
			text: "Closed above target."
		}, {
			date: "04 Apr 2025",
			text: "Opened."
		}],
		links: [{
			label: "Trend · BTC",
			href: "/trend?id=BTC"
		}]
	}
];
function thesisById(id, extra = []) {
	return extra.concat(THESES).find((t) => t.id === id);
}
function closedTheses(extra = []) {
	return extra.concat(THESES).filter((t) => t.status === "Closed");
}
function trackRecord(extra = []) {
	const closed = closedTheses(extra);
	const hits = closed.filter((t) => t.state === "HIT").length;
	const stopped = closed.filter((t) => t.state === "STOPPED").length;
	const avg = closed.reduce((a, t) => a + t.edgeCaptured, 0) / Math.max(1, closed.length);
	return {
		n: closed.length,
		hits,
		stopped,
		hitRate: hits / Math.max(1, closed.length),
		avgEdge: avg
	};
}
function newUserThesis(p) {
	const today = (/* @__PURE__ */ new Date()).toISOString().slice(0, 10);
	const entry = p.entry ?? 0;
	return {
		id: `th-user-${Date.now().toString(36)}`,
		title: p.title.trim(),
		domain: p.domain ?? "Macro",
		type: p.type ?? "Trade",
		status: "Open",
		state: "FLAT",
		instrument: p.instrument.trim().toUpperCase(),
		entry,
		target: p.target ?? entry,
		last: p.last ?? entry,
		unit: p.unit ?? "px",
		opened: today,
		horizon: p.horizon?.trim() || "3m",
		edgeCaptured: 0,
		memo: p.memo?.trim() || "User thesis. No desk memo yet.",
		changeMind: p.changeMind?.length ? p.changeMind : ["Fill invalidation."],
		supports: p.supports?.length ? p.supports : ["User entry."],
		cuts: p.cuts?.length ? p.cuts : ["No contrary evidence logged."],
		log: [{
			date: today,
			text: "Opened (manual)."
		}],
		analyst: p.analyst?.trim() || "Desk",
		links: p.links?.length ? p.links : [{
			label: "Trend",
			href: "/trend"
		}, {
			label: "Watch",
			href: "/watch"
		}],
		user: true
	};
}
var INST_RE = /\b(EURUSD|USDJPY|GBPUSD|USDCAD|AUDUSD|USDMXN|USDCNH|BBDXY|DXY|WTI|BRENT|XAU|XAG|SPX|NDX|BTC|SOFR|US10Y|NVDA|AAPL|MSFT|GOOG|AMZN|META|TSLA|JPM|XOM|LMT|RTX)\b/i;
function guessInstrument(text) {
	const m = text.match(INST_RE);
	if (m) return m[1].toUpperCase();
	if (/\byen\b|boj|usd\/jpy/i.test(text)) return "USDJPY";
	if (/\beuro\b|ecb|eur\b/i.test(text)) return "EURUSD";
	if (/\bdollar\b|dxy|fed\b/i.test(text)) return "DXY";
	if (/\boil\b|crude|opec|hormuz/i.test(text)) return "WTI";
	if (/\bgold\b/i.test(text)) return "XAU";
	return "DXY";
}
function guessDomain(text) {
	if (/iran|taiwan|ukraine|hormuz|geopolit/i.test(text)) return "Geopolitics";
	if (/oil|wti|brent|gas|opec/i.test(text)) return "Energy";
	if (/gold|copper|metal/i.test(text)) return "Commodities";
	if (/fx|euro|yen|pound|peso|dollar|dxy/i.test(text)) return "FX";
	if (/rate|yield|sofr|bund|gilt|wacc/i.test(text)) return "Rates";
	if (/btc|crypto/i.test(text)) return "Crypto";
	if (/equity|nasdaq|s&p|stock|nvda|aapl/i.test(text)) return "Equities";
	return "Macro";
}
function cn(...inputs) {
	return twMerge(clsx(inputs));
}
function clamp(n, min, max) {
	return Math.max(min, Math.min(max, n));
}
function hashStr(s) {
	let h = 2166136261;
	for (let i = 0; i < s.length; i++) {
		h ^= s.charCodeAt(i);
		h = Math.imul(h, 16777619);
	}
	return h >>> 0;
}
function mulberry32(seed) {
	let a = seed >>> 0;
	return () => {
		a += 1831565813;
		let t = a;
		t = Math.imul(t ^ t >>> 15, t | 1);
		t ^= t + Math.imul(t ^ t >>> 7, t | 61);
		return ((t ^ t >>> 14) >>> 0) / 4294967296;
	};
}
function destination(lat, lng, headingDeg, distKm) {
	const d = distKm / 6371;
	const h = headingDeg * Math.PI / 180;
	const lat1 = lat * Math.PI / 180;
	const lng1 = lng * Math.PI / 180;
	const lat2 = Math.asin(Math.sin(lat1) * Math.cos(d) + Math.cos(lat1) * Math.sin(d) * Math.cos(h));
	const lng2 = lng1 + Math.atan2(Math.sin(h) * Math.sin(d) * Math.cos(lat1), Math.cos(d) - Math.sin(lat1) * Math.sin(lat2));
	return [lat2 * 180 / Math.PI, (lng2 * 180 / Math.PI + 540) % 360 - 180];
}
function fmtNum(n, d = 2) {
	return n.toLocaleString("en-US", {
		minimumFractionDigits: d,
		maximumFractionDigits: d
	});
}
function fmtPct(n, d = 2, sign = true) {
	const body = `${Math.abs(n).toFixed(d)}%`;
	if (!sign) return n < 0 ? `−${body}` : body;
	if (n > 0) return `+${body}`;
	if (n < 0) return `−${body}`;
	return `+${body}`;
}
function fmtSigned(n, d = 1) {
	const body = Math.abs(n).toFixed(d);
	if (n > 0) return `+${body}`;
	if (n < 0) return `−${body}`;
	return body;
}
function utcStamp(ts) {
	const d = new Date(ts);
	return `${String(d.getUTCHours()).padStart(2, "0")}:${String(d.getUTCMinutes()).padStart(2, "0")}:${String(d.getUTCSeconds()).padStart(2, "0")}`;
}
function utcDate(ts) {
	const d = new Date(ts);
	return `${String(d.getUTCDate()).padStart(2, "0")} ${[
		"Jan",
		"Feb",
		"Mar",
		"Apr",
		"May",
		"Jun",
		"Jul",
		"Aug",
		"Sep",
		"Oct",
		"Nov",
		"Dec"
	][d.getUTCMonth()]} ${d.getUTCFullYear()}`;
}
function utcFull(ts) {
	return `${utcDate(ts)}  ${utcStamp(ts)} UTC`;
}
function dayKey(ts) {
	return Math.floor(ts / 864e5);
}
function hourKey(ts) {
	return Math.floor(ts / 36e5);
}
function series(seed, n, base, vol, ts) {
	const rand = mulberry32(hashStr(seed) ^ dayKey(ts));
	const out = [];
	let v = base;
	for (let i = 0; i < n; i++) {
		v += (rand() - .48) * vol;
		out.push(v);
	}
	return out;
}
function mean(xs) {
	if (!xs.length) return 0;
	return xs.reduce((s, v) => s + v, 0) / xs.length;
}
function variance(xs, ddof = 1) {
	if (xs.length <= ddof) return 0;
	const m = mean(xs);
	return xs.reduce((s, v) => s + (v - m) ** 2, 0) / (xs.length - ddof);
}
function stdev(xs, ddof = 1) {
	return Math.sqrt(variance(xs, ddof));
}
function quantile(xs, q) {
	if (!xs.length) return NaN;
	const a = [...xs].sort((x, y) => x - y);
	const p = Math.max(0, Math.min(1, q));
	const i = (a.length - 1) * p;
	const lo = Math.floor(i);
	const hi = Math.ceil(i);
	if (lo === hi) return a[lo];
	return a[lo] * (hi - i) + a[hi] * (i - lo);
}
function skewness(xs) {
	const n = xs.length;
	if (n < 3) return 0;
	const m = mean(xs);
	const s = stdev(xs, 1);
	if (s === 0) return 0;
	return xs.reduce((a, v) => a + (v - m) ** 3, 0) / n / s ** 3;
}
/** Excess kurtosis (Fisher). Normal = 0. */
function excessKurtosis(xs) {
	const n = xs.length;
	if (n < 4) return 0;
	const m = mean(xs);
	const s = stdev(xs, 1);
	if (s === 0) return 0;
	return xs.reduce((a, v) => a + (v - m) ** 4, 0) / n / s ** 4 - 3;
}
function xlogy(x, y) {
	if (x === 0) return 0;
	if (y <= 0) return -0xe8d4a51000;
	return x * Math.log(y);
}
function normPdf(x) {
	return Math.exp(-.5 * x * x) / Math.sqrt(2 * Math.PI);
}
function erf(x) {
	const s = Math.sign(x);
	const a = Math.abs(x);
	const t = 1 / (1 + .3275911 * a);
	const c = [
		.254829592,
		-.284496736,
		1.421413741,
		-1.453152027,
		1.061405429
	];
	let tau = 0;
	let tp = t;
	for (let i = 0; i < c.length; i++) {
		tau += c[i] * tp;
		tp *= t;
	}
	return s * (1 - tau * Math.exp(-a * a));
}
function normCdf(x) {
	return .5 * (1 + erf(x / Math.SQRT2));
}
/** Acklam inverse normal CDF. */
function invNorm(p) {
	if (p <= 0) return -8;
	if (p >= 1) return 8;
	const a = [
		-39.69683028665376,
		220.9460984351305,
		-275.9285104469687,
		138.3577459590407,
		-30.66479806614716,
		2.506628277459239
	];
	const b = [
		-54.47609879822406,
		161.5858368580409,
		-155.6989798598866,
		66.80131188771972,
		-13.28068155288572
	];
	const c = [
		-.007784894002430293,
		-.3223964580411365,
		-2.400758277161838,
		-2.549732539343734,
		4.374664141464968,
		2.938163982698783
	];
	const d = [
		.007784695709041462,
		.3224671290700398,
		2.445134137142996,
		3.754408661907416
	];
	const plow = .02425;
	const phigh = .97575;
	let q;
	let r;
	if (p < plow) {
		q = Math.sqrt(-2 * Math.log(p));
		return (((((c[0] * q + c[1]) * q + c[2]) * q + c[3]) * q + c[4]) * q + c[5]) / ((((d[0] * q + d[1]) * q + d[2]) * q + d[3]) * q + 1);
	}
	if (p > phigh) {
		q = Math.sqrt(-2 * Math.log(1 - p));
		return -(((((c[0] * q + c[1]) * q + c[2]) * q + c[3]) * q + c[4]) * q + c[5]) / ((((d[0] * q + d[1]) * q + d[2]) * q + d[3]) * q + 1);
	}
	q = p - .5;
	r = q * q;
	return (((((a[0] * r + a[1]) * r + a[2]) * r + a[3]) * r + a[4]) * r + a[5]) * q / (((((b[0] * r + b[1]) * r + b[2]) * r + b[3]) * r + b[4]) * r + 1);
}
function chi2Cdf1(x) {
	if (x <= 0) return 0;
	return erf(Math.sqrt(x / 2));
}
function chi2Cdf2(x) {
	if (x <= 0) return 0;
	return 1 - Math.exp(-x / 2);
}
function rollingMin(xs, n, minP) {
	const mp = minP ?? Math.floor(n / 2);
	const out = new Array(xs.length).fill(NaN);
	for (let i = 0; i < xs.length; i++) {
		const start = Math.max(0, i - n + 1);
		const w = xs.slice(start, i + 1);
		if (w.length < mp) continue;
		out[i] = Math.min(...w);
	}
	return out;
}
function rollingMax(xs, n, minP) {
	const mp = minP ?? Math.floor(n / 2);
	const out = new Array(xs.length).fill(NaN);
	for (let i = 0; i < xs.length; i++) {
		const start = Math.max(0, i - n + 1);
		const w = xs.slice(start, i + 1);
		if (w.length < mp) continue;
		out[i] = Math.max(...w);
	}
	return out;
}
function rollingMean(xs, n, minP) {
	const mp = minP ?? Math.floor(n / 2);
	const out = new Array(xs.length).fill(NaN);
	let s = 0;
	for (let i = 0; i < xs.length; i++) {
		s += xs[i];
		if (i >= n) s -= xs[i - n];
		const len = Math.min(i + 1, n);
		if (len >= mp) out[i] = s / len;
	}
	return out;
}
function rollingStd(xs, n, minP) {
	const mp = minP ?? Math.floor(n / 2);
	const out = new Array(xs.length).fill(NaN);
	for (let i = 0; i < xs.length; i++) {
		const start = Math.max(0, i - n + 1);
		const w = xs.slice(start, i + 1);
		if (w.length < mp) continue;
		out[i] = stdev(w, 1);
	}
	return out;
}
function covMatrix(cols) {
	const k = cols.length;
	const n = cols[0]?.length ?? 0;
	const means = cols.map(mean);
	const C = Array.from({ length: k }, () => new Array(k).fill(0));
	for (let i = 0; i < k; i++) for (let j = i; j < k; j++) {
		let s = 0;
		for (let t = 0; t < n; t++) s += (cols[i][t] - means[i]) * (cols[j][t] - means[j]);
		const v = s / Math.max(1, n - 1);
		C[i][j] = v;
		C[j][i] = v;
	}
	return C;
}
function randn(rng) {
	const u = Math.max(1e-12, rng());
	const v = Math.max(1e-12, rng());
	return Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * v);
}
function studentT(rng, df) {
	let chi = 0;
	const k = Math.max(2, Math.round(df));
	for (let i = 0; i < k; i++) {
		const z = randn(rng);
		chi += z * z;
	}
	return randn(rng) / Math.sqrt(chi / k);
}
function garchT(n, omega, alpha, beta, df, rng) {
	const z = [];
	const scale = Math.sqrt(df / (df - 2));
	for (let i = 0; i < n; i++) z.push(studentT(rng, df) / scale);
	const h = new Array(n);
	const r = new Array(n);
	h[0] = omega / Math.max(1e-8, 1 - alpha - beta);
	for (let t = 0; t < n; t++) {
		if (t > 0) h[t] = omega + alpha * r[t - 1] ** 2 + beta * h[t - 1];
		r[t] = Math.sqrt(Math.max(h[t], 1e-16)) * z[t];
	}
	return r;
}
function goldenMin(fn, lo, hi, steps = 48) {
	const phi = (1 + Math.sqrt(5)) / 2;
	let a = lo;
	let b = hi;
	let c = b - (b - a) / phi;
	let d = a + (b - a) / phi;
	for (let i = 0; i < steps; i++) {
		if (fn(c) < fn(d)) b = d;
		else a = c;
		c = b - (b - a) / phi;
		d = a + (b - a) / phi;
	}
	return (a + b) / 2;
}
/**
* Port of quantdesk/risk.py + kelly.py (static estimators, EWMA, Kupiec, Basel, Kelly).
* GARCH-FHS (arch) is omitted in-browser; EWMA is the conditional-vol engine.
*/
var RISK_ASSETS = [
	"SPX",
	"NDX",
	"XAU",
	"WTI",
	"TLT",
	"EURUSD"
];
var DEFAULT_WEIGHTS = {
	SPX: .35,
	NDX: .15,
	XAU: .1,
	WTI: .1,
	TLT: .2,
	EURUSD: .1
};
var MU = {
	SPX: .09,
	NDX: .11,
	XAU: .06,
	WTI: .04,
	TLT: .03,
	EURUSD: .01
};
var VOL = {
	SPX: .16,
	NDX: .22,
	XAU: .14,
	WTI: .32,
	TLT: .12,
	EURUSD: .08
};
function clean(r) {
	return r.filter((x) => Number.isFinite(x));
}
function histVarEs(r, alpha = .99) {
	const x = clean(r);
	const q = quantile(x, 1 - alpha);
	const tail = x.filter((v) => v <= q);
	return {
		method: "hist",
		VaR: -q,
		ES: tail.length ? -mean(tail) : -q
	};
}
function normalVarEs(r, alpha = .99) {
	const x = clean(r);
	const mu = mean(x);
	const sigma = stdev(x, 1);
	const z = invNorm(alpha);
	return {
		method: "normal",
		VaR: -mu + sigma * z,
		ES: -mu + sigma * normPdf(z) / (1 - alpha)
	};
}
function studentTVarEs(r, alpha = .99) {
	const x = clean(r);
	const mu = mean(x);
	const s = stdev(x, 1);
	const k = Math.max(.2, excessKurtosis(x));
	const nu = Math.max(4.2, Math.min(30, 6 / k + 4));
	const scale = s * Math.sqrt((nu - 2) / nu);
	const z = invNorm(alpha);
	const q = z * Math.sqrt((nu - 2) / nu) * (1 + (z * z + 1) * .25 / nu);
	const esStd = normPdf(q) / (1 - alpha) * ((nu + q * q) / (nu - 1));
	return {
		method: "student-t",
		VaR: -mu + scale * Math.abs(q) * Math.sign(q) + 0,
		ES: -mu + scale * esStd,
		extra: { nu }
	};
}
function cfQuantile(z, skew, exk) {
	return z + (z * z - 1) * skew / 6 + (z ** 3 - 3 * z) * exk / 24 - (2 * z ** 3 - 5 * z) * skew * skew / 36;
}
function cornishFisherVarEs(r, alpha = .99) {
	const x = clean(r);
	const mu = mean(x);
	const sd = stdev(x, 1);
	const sk = skewness(x);
	const k = excessKurtosis(x);
	const n = 400;
	const zq = [];
	for (let i = 0; i < n; i++) {
		const u = 1e-6 + (1 - alpha - 1e-6) * i / 399;
		zq.push(cfQuantile(invNorm(u), sk, k));
	}
	let valid = true;
	for (let i = 1; i < zq.length; i++) if (zq[i] < zq[i - 1]) valid = false;
	return {
		method: "cornish-fisher",
		VaR: -(mu + sd * cfQuantile(invNorm(1 - alpha), sk, k)),
		ES: -(mu + sd * mean(zq)),
		extra: { valid }
	};
}
function evtPotVarEs(r, alpha = .99, thresholdQ = .95) {
	const losses = clean(r).map((v) => -v);
	const n = losses.length;
	const u = quantile(losses, thresholdQ);
	const exc = losses.filter((v) => v > u).map((v) => v - u);
	if (exc.length < 20) return {
		method: "evt-pot",
		VaR: NaN,
		ES: NaN,
		extra: {
			xi: NaN,
			beta: NaN
		}
	};
	const e = mean(exc);
	const v = Math.max(1e-12, stdev(exc, 1) ** 2);
	let xi = .5 * (1 - e * e / v);
	xi = Math.max(-.4, Math.min(.6, xi));
	const beta = Math.max(1e-8, .5 * e * (1 + e * e / v));
	const pExc = exc.length / n;
	const VaR = Math.abs(xi) < 1e-8 ? u + beta * Math.log(pExc / (1 - alpha)) : u + beta / xi * ((pExc / (1 - alpha)) ** xi - 1);
	return {
		method: "evt-pot",
		VaR,
		ES: xi < 1 ? VaR / (1 - xi) + (beta - xi * u) / (1 - xi) : NaN,
		extra: {
			xi,
			beta
		}
	};
}
function ewmaVarEs(r, alpha = .99, lam = .94) {
	const x = clean(r);
	let v = variance0(x.slice(0, 30));
	for (let t = 1; t < x.length; t++) v = lam * v + (1 - lam) * x[t - 1] ** 2;
	const sig = Math.sqrt(v);
	const z = invNorm(alpha);
	return {
		method: "ewma",
		VaR: sig * z,
		ES: sig * normPdf(z) / (1 - alpha),
		extra: { sigma: sig }
	};
}
function variance0(xs) {
	return Math.max(1e-12, xs.reduce((s, v) => s + v * v, 0) / Math.max(1, xs.length));
}
function allVarEs(r, alpha = .99) {
	return [
		histVarEs(r, alpha),
		normalVarEs(r, alpha),
		studentTVarEs(r, alpha),
		cornishFisherVarEs(r, alpha),
		evtPotVarEs(r, alpha),
		ewmaVarEs(r, alpha)
	];
}
function kupiecPof(hits, alpha = .99) {
	const T = hits.length;
	const x = hits.reduce((s, h) => s + h, 0);
	const p = 1 - alpha;
	const phat = x / T;
	const lr = -2 * (xlogy(T - x, 1 - p) + xlogy(x, p) - (xlogy(T - x, 1 - phat) + xlogy(x, phat)));
	return {
		exceptions: x,
		expected: T * p,
		rate: phat,
		LR: lr,
		p: 1 - chi2Cdf1(Math.max(lr, 0))
	};
}
function christoffersenIndependence(hits) {
	let n00 = 0, n01 = 0, n10 = 0, n11 = 0;
	for (let i = 1; i < hits.length; i++) {
		const a = hits[i - 1];
		const b = hits[i];
		if (a === 0 && b === 0) n00++;
		else if (a === 0 && b === 1) n01++;
		else if (a === 1 && b === 0) n10++;
		else n11++;
	}
	const pi01 = n01 / Math.max(n00 + n01, 1);
	const pi11 = n11 / Math.max(n10 + n11, 1);
	const pi = (n01 + n11) / Math.max(n00 + n01 + n10 + n11, 1);
	const ll0 = xlogy(n00 + n10, 1 - pi) + xlogy(n01 + n11, pi);
	const ll1 = xlogy(n00, 1 - pi01) + xlogy(n01, pi01) + xlogy(n10, 1 - pi11) + xlogy(n11, pi11);
	const lr = Math.max(-2 * (ll0 - ll1), 0);
	return {
		LR: lr,
		p: 1 - chi2Cdf1(lr),
		n11
	};
}
function baselTrafficLight(exceptions, T = 250, alpha = .99) {
	const p = 1 - alpha;
	let cdf = 0;
	let term = (1 - p) ** T;
	for (let k = 0; k <= exceptions; k++) {
		cdf += term;
		term *= (T - k) / (k + 1) * (p / (1 - p));
	}
	const zone = cdf < .95 ? "green" : cdf < .9999 ? "yellow" : "red";
	const addon = {
		5: .4,
		6: .5,
		7: .65,
		8: .75,
		9: .85
	}[exceptions] ?? (exceptions < 5 ? 0 : 1);
	return {
		zone,
		cdf,
		addon
	};
}
function rollingHistBacktest(r, alpha = .99, window = 500) {
	const hits = [];
	const vars = [];
	for (let t = window; t < r.length; t++) {
		const est = histVarEs(r.slice(t - window, t), alpha);
		const hit = r[t] < -est.VaR ? 1 : 0;
		hits.push(hit);
		if (t % 4 === 0) vars.push({
			t,
			ret: r[t],
			VaR: est.VaR
		});
	}
	const k = kupiecPof(hits, alpha);
	const c = christoffersenIndependence(hits);
	const last = hits.slice(-250);
	const tl = baselTrafficLight(last.reduce((s, h) => s + h, 0), last.length, alpha);
	const lrCc = k.LR + c.LR;
	return {
		n: hits.length,
		hits,
		vars,
		kupiec: k,
		christoffersen: c,
		pCC: 1 - chi2Cdf2(Math.max(lrCc, 0)),
		basel: tl
	};
}
function kellyBinary(p, win, loss = 1) {
	return p / loss - (1 - p) / win;
}
function kellyContinuous(mu, sigma2, r = 0) {
	return (mu - r) / sigma2;
}
function growthRate(f, mu, sigma2, r = 0) {
	return r + f * (mu - r) - .5 * f * f * sigma2;
}
function kellyFromTrades(pnl) {
	const x = pnl.filter(Number.isFinite);
	const wins = x.filter((v) => v > 0);
	const losses = x.filter((v) => v < 0).map((v) => -v);
	if (!wins.length || !losses.length) return {
		f_kelly: NaN,
		win_rate: NaN,
		payoff_ratio: NaN,
		n: x.length
	};
	const W = wins.length / (wins.length + losses.length);
	return {
		win_rate: W,
		payoff_ratio: mean(wins) / mean(losses),
		f_kelly: kellyBinary(W, mean(wins), mean(losses)),
		n: x.length
	};
}
function kellyEmpirical(returns, r = 0, fMax = 8) {
	const x = returns.filter(Number.isFinite);
	const fn = (f) => {
		let s = 0;
		for (const R of x) {
			const w = 1 + r + f * (R - r);
			if (w <= 0) return 1e9;
			s += Math.log(w);
		}
		return -s / x.length;
	};
	return goldenMin(fn, -fMax, fMax);
}
function bayesShrinkMu(muExcess, sigma, nObs, tau = .4, periods = 252) {
	const years = nObs / periods;
	const srHat = muExcess * periods / (sigma * Math.sqrt(periods));
	const postVarSr = 1 / (1 / tau ** 2 + years);
	return {
		muPost: postVarSr * years * srHat * sigma * Math.sqrt(periods) / periods,
		postVarSr
	};
}
function probDrawdown(c, x = .5) {
	return Math.min(1, x ** (2 / c - 1));
}
function positionSize(capital, riskBudget, esDaily) {
	return capital * riskBudget / esDaily;
}
function parametricDecomp(w, cov, names, alpha = .99) {
	const k = w.length;
	let sp2 = 0;
	for (let i = 0; i < k; i++) for (let j = 0; j < k; j++) sp2 += w[i] * cov[i][j] * w[j];
	const sp = Math.sqrt(Math.max(sp2, 1e-16));
	const z = invNorm(alpha);
	const mvar = new Array(k).fill(0);
	for (let i = 0; i < k; i++) {
		let cw = 0;
		for (let j = 0; j < k; j++) cw += cov[i][j] * w[j];
		mvar[i] = z * cw / sp;
	}
	const cvar = mvar.map((m, i) => w[i] * m);
	const kk = normPdf(z) / (1 - alpha) / z;
	const sum = cvar.reduce((s, v) => s + v, 0);
	return names.map((n, i) => ({
		name: n,
		weight: w[i],
		mVaR: mvar[i],
		cVaR: cvar[i],
		cES: cvar[i] * kk,
		pct: cvar[i] / sum * 100
	}));
}
var STRESS = [
	{
		id: "gfc",
		name: "GFC week (scaled)",
		shock: {
			SPX: -.18,
			NDX: -.2,
			XAU: .06,
			WTI: -.12,
			TLT: .04,
			EURUSD: -.04
		}
	},
	{
		id: "covid",
		name: "COVID Mar-2020 week",
		shock: {
			SPX: -.15,
			NDX: -.13,
			XAU: .02,
			WTI: -.25,
			TLT: .05,
			EURUSD: -.02
		}
	},
	{
		id: "v22",
		name: "2022 vol / QT",
		shock: {
			SPX: -.08,
			NDX: -.12,
			XAU: -.03,
			WTI: .04,
			TLT: -.1,
			EURUSD: -.03
		}
	},
	{
		id: "hormuz",
		name: "Hormuz disruption",
		shock: {
			SPX: -.06,
			NDX: -.07,
			XAU: .04,
			WTI: .18,
			TLT: .02,
			EURUSD: -.01
		}
	},
	{
		id: "usd",
		name: "USD squeeze",
		shock: {
			SPX: -.04,
			NDX: -.05,
			XAU: -.05,
			WTI: -.03,
			TLT: -.02,
			EURUSD: -.04
		}
	}
];
function stressPnl(w) {
	return STRESS.map((s) => {
		let pnl = 0;
		for (const a of RISK_ASSETS) pnl += (w[a] ?? 0) * s.shock[a];
		return {
			...s,
			pnl
		};
	});
}
var RET_CACHE = null;
function syntheticBook(n = 1260, seed = 7, end = Date.parse("2026-09-18T00:00:00Z")) {
	if (RET_CACHE) return RET_CACHE;
	const rng = mulberry32(seed);
	const f = garchT(n, (.16 / Math.sqrt(252)) ** 2 * (1 - .07 - .91), .07, .91, 8, rng);
	const ret = {};
	for (const a of RISK_ASSETS) {
		const beta = .5 + rng() * .7;
		const eps = garchT(n, (VOL[a] / Math.sqrt(252) * (.5 + rng() * .5)) ** 2 * (.94 - .92), .06, .92, 8, rng);
		const mu = MU[a] / 252;
		const raw = f.map((v, i) => beta * v + eps[i]);
		const m = mean(raw);
		const sd = stdev(raw, 1) || 1;
		const target = VOL[a] / Math.sqrt(252);
		ret[a] = raw.map((v) => mu + (v - m) / sd * target);
	}
	const dates = [];
	let t = end;
	const seq = [];
	while (seq.length < n) {
		const wd = new Date(t).getUTCDay();
		if (wd !== 0 && wd !== 6) seq.push(t);
		t -= 864e5;
	}
	dates.push(...seq.reverse());
	RET_CACHE = {
		ret,
		port: [],
		dates
	};
	return RET_CACHE;
}
function portfolioReturns(w) {
	const book = syntheticBook();
	const port = [];
	const n = book.dates.length;
	for (let i = 0; i < n; i++) {
		let r = 0;
		for (const a of RISK_ASSETS) r += (w[a] ?? 0) * book.ret[a][i];
		port.push(r);
	}
	return {
		port,
		dates: book.dates,
		ret: book.ret
	};
}
function riskSnapshot(w, alpha = .99, capital = 1e7, budget = .01) {
	const { port, ret } = portfolioReturns(w);
	const methods = allVarEs(port, alpha);
	const hist = methods.find((m) => m.method === "hist");
	const bt = rollingHistBacktest(port, alpha, 500);
	const cov = covMatrix(RISK_ASSETS.map((a) => ret[a]));
	const decomp = parametricDecomp(RISK_ASSETS.map((a) => w[a] ?? 0), cov, [...RISK_ASSETS], alpha);
	const muD = mean(port);
	const s2 = varianceDaily(port);
	const fStar = kellyContinuous(muD, s2);
	const fEmp = kellyEmpirical(port);
	const fBayes = kellyContinuous(bayesShrinkMu(muD, Math.sqrt(s2), port.length).muPost, s2);
	const fromTrades = kellyFromTrades(port.map((r) => r * 10));
	const es = hist.ES;
	const size = positionSize(capital, budget, es);
	const dd = [
		.25,
		.5,
		1,
		1.5
	].map((c) => ({
		c,
		f: c * fStar,
		p50: probDrawdown(c, .5),
		g: growthRate(c * fStar, muD * 252, s2 * 252)
	}));
	return {
		methods,
		bt,
		decomp,
		stress: stressPnl(w),
		kelly: {
			fStar,
			fEmp,
			fBayes,
			fromTrades,
			dd,
			muD,
			s2
		},
		size,
		volAnn: Math.sqrt(s2 * 252),
		sharpe: muD / Math.sqrt(s2) * Math.sqrt(252),
		hist,
		port
	};
}
function varianceDaily(xs) {
	const m = mean(xs);
	return xs.reduce((s, v) => s + (v - m) ** 2, 0) / Math.max(1, xs.length - 1);
}
function wealthPath(port, f = 1) {
	let w = 1;
	return port.slice(-252).map((r, i) => {
		w *= 1 + f * r;
		return {
			d: i,
			v: w
		};
	});
}
var GRID_LAYERS = [
	"SEIS",
	"AIS",
	"MIL",
	"ZONE",
	"PM",
	"NEWS",
	"TRADE",
	"POP",
	"POWER",
	"LIVE",
	"TICKER"
];
var DEFAULT_GRID = {
	SEIS: true,
	AIS: true,
	MIL: true,
	ZONE: true,
	PM: true,
	NEWS: true,
	TRADE: false,
	POP: false,
	POWER: false,
	LIVE: true,
	TICKER: true
};
var DEFAULT_REF = {
	conflicts: true,
	bases: false,
	ports: false,
	waterways: true,
	airports: false,
	pipelines: false,
	cables: false,
	nuclear: false,
	gpu: false,
	finance: false,
	irradiators: false
};
var useTerminal = create()(persist((set, get) => ({
	grid: { ...DEFAULT_GRID },
	ref: { ...DEFAULT_REF },
	mapMode: "globe",
	topo: false,
	fly: true,
	countryColor: "econ",
	sidePanel: "feed",
	selection: null,
	asOf: null,
	lowPower: false,
	cmdOpen: false,
	weights: {
		macro: 30,
		pos: 25,
		risk: 20,
		flow: 25
	},
	workbench: [
		"trend-top",
		"pm-movers",
		"cot-pulse",
		"alerts"
	],
	drawer: null,
	replayThesis: null,
	userTheses: [],
	watchSymbol: null,
	watchlist: [],
	riskWeights: { ...DEFAULT_WEIGHTS },
	riskAlpha: .99,
	riskCapital: 1e7,
	riskBudget: .01,
	moreOpen: false,
	bankArticles: [],
	bankFeedAt: null,
	bankFeedLive: false,
	toggleGrid: (k) => set({ grid: {
		...get().grid,
		[k]: !get().grid[k]
	} }),
	toggleRef: (k) => set({ ref: {
		...get().ref,
		[k]: !get().ref[k]
	} }),
	setMapMode: (mapMode) => set({ mapMode }),
	setTopo: (topo) => set({ topo }),
	setFly: (fly) => set({ fly }),
	setCountryColor: (countryColor) => set({ countryColor }),
	setSidePanel: (sidePanel) => set({ sidePanel: get().sidePanel === sidePanel ? null : sidePanel }),
	setSelection: (selection) => set({ selection }),
	setAsOf: (asOf) => set({ asOf }),
	setLowPower: (lowPower) => set({ lowPower }),
	setCmdOpen: (cmdOpen) => set({ cmdOpen }),
	setWeights: (w) => set({ weights: {
		...get().weights,
		...w
	} }),
	setWorkbench: (workbench) => set({ workbench }),
	setDrawer: (drawer) => set({ drawer }),
	setReplayThesis: (replayThesis) => set({ replayThesis }),
	addThesis: (t) => set({ userTheses: [t, ...get().userTheses] }),
	removeThesis: (id) => set({ userTheses: get().userTheses.filter((x) => x.id !== id) }),
	setWatchSymbol: (watchSymbol) => set({ watchSymbol }),
	addWatch: (s) => {
		set({
			watchlist: get().watchlist.includes(s) ? get().watchlist : [...get().watchlist, s],
			watchSymbol: s
		});
	},
	removeWatch: (s) => {
		const watchlist = get().watchlist.filter((x) => x !== s);
		set({
			watchlist,
			watchSymbol: get().watchSymbol === s ? watchlist[0] ?? null : get().watchSymbol
		});
	},
	setRiskWeights: (w) => set({ riskWeights: {
		...get().riskWeights,
		...w
	} }),
	setRiskAlpha: (riskAlpha) => set({ riskAlpha }),
	setRiskCapital: (riskCapital) => set({ riskCapital }),
	setRiskBudget: (riskBudget) => set({ riskBudget }),
	setMoreOpen: (moreOpen) => set({ moreOpen }),
	setBankFeed: (bankArticles, bankFeedLive, bankFeedAt) => set({
		bankArticles,
		bankFeedLive,
		bankFeedAt
	})
}), {
	name: "argos-terminal",
	skipHydration: true,
	version: 1,
	migrate: (persisted) => {
		const p = persisted;
		if (Array.isArray(p.workbench)) p.workbench = p.workbench.map((id) => id === "tdi-div" ? "bank-tape" : id);
		return p;
	},
	partialize: (s) => ({
		grid: s.grid,
		ref: s.ref,
		mapMode: s.mapMode,
		topo: s.topo,
		fly: s.fly,
		countryColor: s.countryColor,
		lowPower: s.lowPower,
		weights: s.weights,
		workbench: s.workbench,
		userTheses: s.userTheses,
		watchSymbol: s.watchSymbol,
		watchlist: s.watchlist,
		riskWeights: s.riskWeights,
		riskAlpha: s.riskAlpha,
		riskCapital: s.riskCapital,
		riskBudget: s.riskBudget
	})
}));
var NAV = [
	{
		id: "monitor",
		path: "/",
		label: "Monitor",
		fkey: "F1",
		group: "monitor"
	},
	{
		id: "brief",
		path: "/brief",
		label: "Brief",
		fkey: "F2",
		group: "intel"
	},
	{
		id: "theses",
		path: "/theses",
		label: "Theses",
		fkey: "F3",
		group: "intel"
	},
	{
		id: "trend",
		path: "/trend",
		label: "Trend",
		fkey: "F4",
		group: "intel"
	},
	{
		id: "cot",
		path: "/cot",
		label: "COT",
		fkey: "F5",
		group: "intel"
	},
	{
		id: "macro",
		path: "/macro",
		label: "Macro",
		fkey: "F6",
		group: "intel"
	},
	{
		id: "markets",
		path: "/markets",
		label: "Markets",
		fkey: "F7",
		group: "intel"
	},
	{
		id: "micro",
		path: "/micro",
		label: "Micro",
		fkey: "F8",
		group: "intel"
	},
	{
		id: "fx",
		path: "/fx",
		label: "FX",
		fkey: "F9",
		group: "intel"
	},
	{
		id: "news",
		path: "/news",
		label: "News",
		fkey: "F10",
		group: "intel"
	},
	{
		id: "invest",
		path: "/invest",
		label: "Invest",
		fkey: "F11",
		group: "intel"
	},
	{
		id: "bank",
		path: "/bank",
		label: "Bank",
		fkey: "F12",
		group: "intel"
	}
];
var MORE_NAV = [
	{
		id: "stir",
		path: "/stir",
		label: "STIR",
		fkey: "S",
		group: "intel"
	},
	{
		id: "risk",
		path: "/risk",
		label: "Risk",
		fkey: "R",
		group: "intel"
	},
	{
		id: "watch",
		path: "/watch",
		label: "Watch",
		fkey: "A",
		group: "intel"
	},
	{
		id: "seasonality",
		path: "/seasonality",
		label: "Seasonality",
		fkey: "Y",
		group: "intel"
	},
	{
		id: "docs",
		path: "/docs",
		label: "Docs",
		fkey: "D",
		group: "intel"
	},
	{
		id: "workbench",
		path: "/workbench",
		label: "Workbench",
		fkey: "W",
		group: "intel"
	},
	{
		id: "methodology",
		path: "/methodology",
		label: "Methodology",
		fkey: "H",
		group: "intel"
	}
];
/**
* Dollar indices.
*
* ICE DXY (NYBOT) — 6-currency geometric basket, published factor 50.14348112:
*   DXY = 50.14348112 · EURUSD^-0.576 · USDJPY^0.136 · GBPUSD^-0.119
*                     · USDCAD^0.091 · USDSEK^0.042 · USDCHF^0.042
*
* Bloomberg Dollar Spot (BBDXY) — 2026 target weights effective after the close
* of 30 Jun 2026 (50 % Fed trade / 50 % BIS FX liquidity; CNH capped at 7.00).
* Geometric, USD-strength quotes (USDXXX, or 1/XXXUSD). Rebased so the basket
* equals 1240.00 at the terminal's September-2026 central spots.
*/
var ICE_DXY_FACTOR = 50.14348112;
var ICE_DXY_WEIGHTS = [
	{
		pair: "EURUSD",
		w: .576,
		invert: true
	},
	{
		pair: "USDJPY",
		w: .136,
		invert: false
	},
	{
		pair: "GBPUSD",
		w: .119,
		invert: true
	},
	{
		pair: "USDCAD",
		w: .091,
		invert: false
	},
	{
		pair: "USDSEK",
		w: .042,
		invert: false
	},
	{
		pair: "USDCHF",
		w: .042,
		invert: false
	}
];
/** Weight in percent. Invert = pair is XXXUSD (USD strength is 1/spot). */
var BBDXY_2026 = [
	{
		pair: "EURUSD",
		name: "EUR",
		w: 29.01,
		invert: true
	},
	{
		pair: "USDJPY",
		name: "JPY",
		w: 12.8,
		invert: false
	},
	{
		pair: "USDCAD",
		name: "CAD",
		w: 11.01,
		invert: false
	},
	{
		pair: "USDMXN",
		name: "MXN",
		w: 9.83,
		invert: false
	},
	{
		pair: "GBPUSD",
		name: "GBP",
		w: 8.98,
		invert: true
	},
	{
		pair: "USDCNH",
		name: "CNH",
		w: 7,
		invert: false
	},
	{
		pair: "USDCHF",
		name: "CHF",
		w: 5.41,
		invert: false
	},
	{
		pair: "AUDUSD",
		name: "AUD",
		w: 4.37,
		invert: true
	},
	{
		pair: "USDKRW",
		name: "KRW",
		w: 3.22,
		invert: false
	},
	{
		pair: "USDINR",
		name: "INR",
		w: 3.14,
		invert: false
	},
	{
		pair: "USDSGD",
		name: "SGD",
		w: 2.73,
		invert: false
	},
	{
		pair: "USDTWD",
		name: "TWD",
		w: 2.5,
		invert: false
	}
];
var BBDXY_REBASE = 1240;
function usdStrengthQuote(pair, spot, invert) {
	if (!(spot > 0)) return NaN;
	return invert ? 1 / spot : spot;
}
function iceDxy(spots) {
	let v = ICE_DXY_FACTOR;
	for (const { pair, w, invert } of ICE_DXY_WEIGHTS) {
		const s = spots[pair];
		if (!(s > 0)) return NaN;
		v *= usdStrengthQuote(pair, s, invert) ** w;
	}
	return v;
}
function bbdxy(spots, baseSpots) {
	let prod = 1;
	for (const { pair, w, invert } of BBDXY_2026) {
		const s = spots[pair];
		const b = baseSpots[pair];
		if (!(s > 0) || !(b > 0)) return NaN;
		const num = usdStrengthQuote(pair, s, invert);
		const den = usdStrengthQuote(pair, b, invert);
		prod *= (num / den) ** (w / 100);
	}
	return BBDXY_REBASE * prod;
}
function bbdxyContrib(spots, baseSpots) {
	return BBDXY_2026.map((c) => {
		const s = spots[c.pair] ?? 0;
		const b = baseSpots[c.pair] ?? 0;
		const num = usdStrengthQuote(c.pair, s, c.invert);
		const den = usdStrengthQuote(c.pair, b, c.invert);
		const rel = den > 0 ? num / den - 1 : 0;
		return {
			...c,
			spot: s,
			usdQuote: num,
			relPct: rel * 100,
			contrib: wPctWeighted(rel, c.w)
		};
	});
}
function wPctWeighted(rel, wPct) {
	return rel * (wPct / 100) * 100;
}
function bbdxyWeightSum() {
	return BBDXY_2026.reduce((s, c) => s + c.w, 0);
}
var US = [
	{
		tenor: "3M",
		years: .25,
		base: 4.33
	},
	{
		tenor: "2Y",
		years: 2,
		base: 3.72
	},
	{
		tenor: "5Y",
		years: 5,
		base: 3.88
	},
	{
		tenor: "10Y",
		years: 10,
		base: 4.12
	},
	{
		tenor: "30Y",
		years: 30,
		base: 4.38
	}
];
var DE = [
	{
		tenor: "2Y",
		years: 2,
		base: 2.04
	},
	{
		tenor: "10Y",
		years: 10,
		base: 2.41
	},
	{
		tenor: "30Y",
		years: 30,
		base: 2.72
	}
];
var JP = [{
	tenor: "2Y",
	years: 2,
	base: .84
}, {
	tenor: "10Y",
	years: 10,
	base: 1.08
}];
var GB = [{
	tenor: "2Y",
	years: 2,
	base: 3.91
}, {
	tenor: "10Y",
	years: 10,
	base: 4.01
}];
function bump(key, asOf, vol) {
	return (mulberry32(hashStr(key) ^ hourKey(asOf))() - .5) * 2 * vol;
}
function yieldCurve(asOf) {
	return [
		"2Y",
		"5Y",
		"10Y",
		"30Y"
	].map((tenor) => {
		const years = tenor === "2Y" ? 2 : tenor === "5Y" ? 5 : tenor === "10Y" ? 10 : 30;
		const us = US.find((x) => x.tenor === tenor)?.base ?? 4;
		const de = DE.find((x) => x.tenor === tenor)?.base ?? 2.4;
		const jp = JP.find((x) => x.tenor === tenor)?.base ?? 1;
		const gb = GB.find((x) => x.tenor === tenor)?.base ?? 4;
		return {
			tenor,
			years,
			us: +(us + bump(`us-${tenor}`, asOf, .045)).toFixed(3),
			de: +(de + bump(`de-${tenor}`, asOf, .035)).toFixed(3),
			jp: +(jp + bump(`jp-${tenor}`, asOf, .02)).toFixed(3),
			gb: +(gb + bump(`gb-${tenor}`, asOf, .04)).toFixed(3)
		};
	});
}
function yieldLevels(asOf) {
	const r = (k, b, v) => +(b + bump(k, asOf, v)).toFixed(3);
	return {
		us3m: r("us3m", 4.33, .02),
		us2: r("us-2Y", 3.72, .045),
		us5: r("us-5Y", 3.88, .04),
		us10: r("us-10Y", 4.12, .045),
		us30: r("us-30Y", 4.38, .04),
		de2: r("de-2Y", 2.04, .035),
		de10: r("de-10Y", 2.41, .035),
		jp10: r("jp-10Y", 1.08, .02),
		gb10: r("gb-10Y", 4.01, .04),
		bei10: r("bei10", 2.24, .03),
		sofr: r("sofr", 4.31, .015),
		effr: r("effr", 4.33, .01),
		iorb: r("iorb", 4.4, .01)
	};
}
function bp(a, b) {
	return (a - b) * 100;
}
function yieldSpreads(asOf) {
	const y = yieldLevels(asOf);
	const yest = yieldLevels(asOf - 864e5);
	const row = (id, name, now, then, note) => ({
		id,
		name,
		value: +now.toFixed(1),
		chg: +(now - then).toFixed(1),
		unit: "bp",
		note
	});
	return [
		row("2s10s", "US 2s10s", bp(y.us10, y.us2), bp(yest.us10, yest.us2), "Curve. Negative = inversion."),
		row("5s30s", "US 5s30s", bp(y.us30, y.us5), bp(yest.us30, yest.us5), "Long-end steepener."),
		row("10s30s", "US 10s30s", bp(y.us30, y.us10), bp(yest.us30, yest.us10), "Issuance / convexity."),
		row("2s30s", "US 2s30s", bp(y.us30, y.us2), bp(yest.us30, yest.us2), "Full-curve slope."),
		row("usde10", "US–DE 10Y", bp(y.us10, y.de10), bp(yest.us10, yest.de10), "Transatlantic gap. EURUSD beta."),
		row("usjp10", "US–JP 10Y", bp(y.us10, y.jp10), bp(yest.us10, yest.jp10), "USDJPY carry identity."),
		row("usgb10", "US–GB 10Y", bp(y.us10, y.gb10), bp(yest.us10, yest.gb10), "Cable rates gap."),
		row("real10", "US 10Y real", bp(y.us10, y.bei10), bp(yest.us10, yest.bei10), "Nominal − 10Y BEI. Gold/real-rate."),
		row("sofrff", "SOFR−FF", bp(y.sofr, y.effr), bp(yest.sofr, yest.effr), "RRp / reserves plumbing."),
		row("iorbff", "IORB−FF", bp(y.iorb, y.effr), bp(yest.iorb, yest.effr), "Fed corridor.")
	];
}
function yieldHistory(id, asOf, n = 90) {
	const out = [];
	for (let i = n - 1; i >= 0; i--) {
		const s = yieldSpreads(asOf - i * 864e5).find((x) => x.id === id);
		out.push({
			d: n - 1 - i,
			v: s?.value ?? 0
		});
	}
	return out;
}
var SPECS = [
	{
		pair: "EURUSD",
		name: "Euro",
		base: 1.0842,
		vol: .004,
		spread: .8,
		digits: 4
	},
	{
		pair: "USDJPY",
		name: "Yen",
		base: 149.82,
		vol: .55,
		spread: 1.2,
		digits: 2
	},
	{
		pair: "GBPUSD",
		name: "Sterling",
		base: 1.3124,
		vol: .005,
		spread: 1.1,
		digits: 4
	},
	{
		pair: "USDCHF",
		name: "Swiss",
		base: .8621,
		vol: .003,
		spread: 1.4,
		digits: 4
	},
	{
		pair: "AUDUSD",
		name: "Aussie",
		base: .6684,
		vol: .004,
		spread: 1.3,
		digits: 4
	},
	{
		pair: "USDCAD",
		name: "Loonie",
		base: 1.3582,
		vol: .004,
		spread: 1.2,
		digits: 4
	},
	{
		pair: "NZDUSD",
		name: "Kiwi",
		base: .6041,
		vol: .004,
		spread: 1.8,
		digits: 4
	},
	{
		pair: "USDTRY",
		name: "Lira",
		base: 34.82,
		vol: .25,
		spread: 40,
		digits: 2
	},
	{
		pair: "USDMXN",
		name: "Peso",
		base: 18.15,
		vol: .12,
		spread: 40,
		digits: 3
	},
	{
		pair: "USDCNH",
		name: "Offshore yuan",
		base: 7.18,
		vol: .025,
		spread: 8,
		digits: 3
	},
	{
		pair: "USDKRW",
		name: "Won",
		base: 1395,
		vol: 8,
		spread: 80,
		digits: 1
	},
	{
		pair: "USDINR",
		name: "Rupee",
		base: 83.9,
		vol: .25,
		spread: 20,
		digits: 2
	},
	{
		pair: "USDSGD",
		name: "Singapore",
		base: 1.328,
		vol: .004,
		spread: 1.5,
		digits: 4
	},
	{
		pair: "USDTWD",
		name: "Taiwan dollar",
		base: 32.1,
		vol: .12,
		spread: 20,
		digits: 2
	},
	{
		pair: "USDSEK",
		name: "Krona",
		base: 10.52,
		vol: .05,
		spread: 18,
		digits: 3
	},
	{
		pair: "WTI",
		name: "WTI crude",
		base: 81.4,
		vol: 1.8,
		spread: 2,
		digits: 2
	},
	{
		pair: "BRENT",
		name: "Brent",
		base: 84.9,
		vol: 1.7,
		spread: 2,
		digits: 2
	},
	{
		pair: "XAU",
		name: "Gold",
		base: 2642,
		vol: 18,
		spread: 4,
		digits: 1
	},
	{
		pair: "XAG",
		name: "Silver",
		base: 31.4,
		vol: .6,
		spread: 2,
		digits: 2
	},
	{
		pair: "SPX",
		name: "S&P 500",
		base: 5628,
		vol: 28,
		spread: 0,
		digits: 1
	},
	{
		pair: "NDX",
		name: "Nasdaq 100",
		base: 19740,
		vol: 90,
		spread: 0,
		digits: 0
	},
	{
		pair: "US10Y",
		name: "UST 10Y",
		base: 4.12,
		vol: .06,
		spread: 0,
		digits: 3
	},
	{
		pair: "BTC",
		name: "Bitcoin",
		base: 62840,
		vol: 1200,
		spread: 8,
		digits: 0
	},
	{
		pair: "NATGAS",
		name: "Henry Hub",
		base: 2.84,
		vol: .12,
		spread: 2,
		digits: 3
	}
];
var FX_BASE_SPOTS = Object.fromEntries(SPECS.filter((s) => /USD/.test(s.pair)).map((s) => [s.pair, s.base]));
function spotOf(pair, asOf) {
	const s = SPECS.find((x) => x.pair === pair);
	if (!s) return 0;
	const r = mulberry32(hashStr(s.pair) ^ hourKey(asOf));
	return s.base + (r() - .5) * 2 * s.vol;
}
function fxSpots(asOf) {
	const out = {};
	for (const s of SPECS) if (/USD/.test(s.pair)) out[s.pair] = spotOf(s.pair, asOf);
	return out;
}
function rowFromPx(pair, name, px, yPx, spread, digits) {
	const chg = yPx !== 0 ? (px - yPx) / Math.abs(yPx) * 100 : 0;
	return {
		pair,
		name,
		px: +px.toFixed(digits),
		chg: +chg.toFixed(2),
		spread
	};
}
function ticker(asOf) {
	const spots = fxSpots(asOf);
	const ySpots = fxSpots(asOf - 864e5);
	const ice = iceDxy(spots);
	const yIce = iceDxy(ySpots);
	const bb = bbdxy(spots, FX_BASE_SPOTS);
	const yBb = bbdxy(ySpots, FX_BASE_SPOTS);
	const yld = yieldLevels(asOf);
	const yYld = yieldLevels(asOf - 864e5);
	const spr = yieldSpreads(asOf);
	const s2s10 = spr.find((s) => s.id === "2s10s");
	const sofrFf = spr.find((s) => s.id === "sofrff");
	const out = [];
	for (const pair of [
		"EURUSD",
		"USDJPY",
		"GBPUSD",
		"AUDUSD",
		"USDCAD",
		"USDMXN",
		"USDCNH",
		"WTI",
		"XAU",
		"SPX",
		"BTC"
	]) {
		const s = SPECS.find((x) => x.pair === pair);
		const px = /USD/.test(pair) ? spots[pair] : spotOf(pair, asOf);
		const yPx = /USD/.test(pair) ? ySpots[pair] : spotOf(pair, asOf - 864e5);
		out.push(rowFromPx(s.pair, s.name, px, yPx, s.spread, s.digits));
	}
	out.splice(3, 0, rowFromPx("BBDXY", "Bloomberg dollar", bb, yBb, 0, 2));
	out.splice(4, 0, rowFromPx("DXY", "ICE dollar index", ice, yIce, 0, 2));
	out.push(rowFromPx("US10Y", "UST 10Y", yld.us10, yYld.us10, 0, 3));
	out.push({
		pair: "2s10s",
		name: "US 2s10s",
		px: s2s10.value,
		chg: +(s2s10.chg / Math.max(1, Math.abs(s2s10.value)) * 100).toFixed(2),
		spread: 0
	});
	out.push(rowFromPx("SOFR", "SOFR", yld.sofr, yYld.sofr, 0, 3));
	out.push({
		pair: "SOFR-FF",
		name: "SOFR−FF",
		px: sofrFf.value,
		chg: sofrFf.chg,
		spread: 0
	});
	return out;
}
function pxOf(pair, asOf) {
	if (pair === "DXY") {
		const ice = iceDxy(fxSpots(asOf));
		const y = iceDxy(fxSpots(asOf - 864e5));
		return {
			px: +ice.toFixed(2),
			chg: +((ice - y) / y * 100).toFixed(2)
		};
	}
	if (pair === "BBDXY") {
		const bb = bbdxy(fxSpots(asOf), FX_BASE_SPOTS);
		const y = bbdxy(fxSpots(asOf - 864e5), FX_BASE_SPOTS);
		return {
			px: +bb.toFixed(2),
			chg: +((bb - y) / y * 100).toFixed(2)
		};
	}
	const row = ticker(asOf).find((t) => t.pair === pair);
	if (row) return {
		px: row.px,
		chg: row.chg
	};
	const s = SPECS.find((x) => x.pair === pair);
	if (!s) return {
		px: 0,
		chg: 0
	};
	const px = spotOf(pair, asOf);
	const yPx = spotOf(pair, asOf - 864e5);
	return {
		px: +px.toFixed(s.digits),
		chg: +((px - yPx) / yPx * 100).toFixed(2)
	};
}
var PULSE_ASSETS = [
	"WTI",
	"XAU",
	"SPX",
	"BBDXY",
	"DXY",
	"EURUSD",
	"US10Y",
	"BTC",
	"NATGAS"
];
/** Stable SSR seed — Saturday 19 Sep 2026 12:13 UTC (desk date). */
var DESK_EPOCH = Date.parse("2026-09-19T12:13:00.000Z");
function useClock() {
	const asOf = useTerminal((s) => s.asOf);
	const [now, setNow] = (0, import_react.useState)(DESK_EPOCH);
	(0, import_react.useEffect)(() => {
		if (asOf != null) return;
		setNow(Date.now());
		const id = window.setInterval(() => setNow(Date.now()), 1e3);
		return () => window.clearInterval(id);
	}, [asOf]);
	return asOf ?? now;
}
var SEEDS = [
	{
		id: "840",
		iso2: "US",
		iso3: "USA",
		name: "United States",
		capital: "Washington",
		lat: 38.91,
		lng: -77.04,
		region: "North America",
		populationM: 341,
		power: 92,
		econ0: 18,
		news0: -8,
		brief: "Soft-landing narrative intact but late-cycle cracks in labor. Fiscal impulse still large; dollar bid on Hormuz hedges. Elections priced; policy path is the residual.",
		gdp: "$29.2tn",
		fx: "DXY 104.8",
		yields: "10Y 4.12%"
	},
	{
		id: "156",
		iso2: "CN",
		iso3: "CHN",
		name: "China",
		capital: "Beijing",
		lat: 39.9,
		lng: 116.4,
		region: "East Asia",
		populationM: 1410,
		power: 86,
		econ0: -12,
		news0: 6,
		brief: "Property drag persists; industrial policy and rare-earth licenses remain the geopolitical lever. Taiwan Strait optionality is the desk's unpriced tail.",
		gdp: "$18.6tn",
		fx: "USDCNY 7.18",
		yields: "10Y 1.92%"
	},
	{
		id: "643",
		iso2: "RU",
		iso3: "RUS",
		name: "Russia",
		capital: "Moscow",
		lat: 55.75,
		lng: 37.62,
		region: "Eurasia",
		populationM: 144,
		power: 71,
		econ0: -22,
		news0: -34,
		brief: "War economy still absorbing manpower. Energy fiscal break-even creeping higher. Arctic NSR traffic is the quiet structural story.",
		gdp: "$2.1tn",
		fx: "USDRUB 94.2",
		yields: "OFZ 10Y 15.4%"
	},
	{
		id: "364",
		iso2: "IR",
		iso3: "IRN",
		name: "Iran",
		capital: "Tehran",
		lat: 35.69,
		lng: 51.39,
		region: "Middle East",
		populationM: 91,
		power: 54,
		econ0: -41,
		news0: -72,
		brief: "Organizing principle of the tape. Enrichment, militia network, and Hormuz option. Oil risk premia sticky; any kinetic event reprices WTI $8–12.",
		gdp: "$0.4tn",
		fx: "IRR unofficial",
		yields: "n/a"
	},
	{
		id: "682",
		iso2: "SA",
		iso3: "SAU",
		name: "Saudi Arabia",
		capital: "Riyadh",
		lat: 24.71,
		lng: 46.68,
		region: "Middle East",
		populationM: 37,
		power: 62,
		econ0: 8,
		news0: -14,
		brief: "Swing producer with a political oil function. Spare capacity is the global shock absorber — and it is thinner than the 2010s.",
		gdp: "$1.1tn",
		fx: "USDSAR 3.75",
		yields: "Sukuk 10Y 4.8%"
	},
	{
		id: "376",
		iso2: "IL",
		iso3: "ISR",
		name: "Israel",
		capital: "Jerusalem",
		lat: 31.77,
		lng: 35.22,
		region: "Middle East",
		populationM: 10,
		power: 58,
		econ0: -6,
		news0: -28,
		brief: "Northern front and Iran arc dominate risk. Tech complex resilient; shekel used as a regional barometer more than a local story.",
		gdp: "$0.53tn",
		fx: "USDILS 3.72",
		yields: "10Y 4.55%"
	},
	{
		id: "804",
		iso2: "UA",
		iso3: "UKR",
		name: "Ukraine",
		capital: "Kyiv",
		lat: 50.45,
		lng: 30.52,
		region: "Europe",
		populationM: 37,
		power: 44,
		econ0: -28,
		news0: -38,
		brief: "Attrition phase. Grain corridor and energy grid remain market-relevant. Aid fatigue is the 2026 political risk, not the front itself.",
		gdp: "$0.18tn",
		fx: "USDUAH 41.2",
		yields: "n/a"
	},
	{
		id: "792",
		iso2: "TR",
		iso3: "TUR",
		name: "Turkey",
		capital: "Ankara",
		lat: 39.93,
		lng: 32.86,
		region: "Eurasia",
		populationM: 87,
		power: 52,
		econ0: -4,
		news0: -12,
		brief: "Straits, NATO flank, and a lira that still trades as a high-beta EM. Black Sea grain and energy transit keep it on the desk.",
		gdp: "$1.1tn",
		fx: "USDTRY 34.8",
		yields: "10Y 27%"
	},
	{
		id: "784",
		iso2: "AE",
		iso3: "ARE",
		name: "United Arab Emirates",
		capital: "Abu Dhabi",
		lat: 24.45,
		lng: 54.38,
		region: "Middle East",
		populationM: 10,
		power: 48,
		econ0: 22,
		news0: -6,
		brief: "Regional safe-haven and gold/re-export hub. ADNOC barrels and DIFC flows make it a live node when Hormuz tightens.",
		gdp: "$0.54tn",
		fx: "USDAED 3.67",
		yields: "5Y 4.1%"
	},
	{
		id: "818",
		iso2: "EG",
		iso3: "EGY",
		name: "Egypt",
		capital: "Cairo",
		lat: 30.04,
		lng: 31.24,
		region: "Middle East",
		populationM: 114,
		power: 42,
		econ0: -16,
		news0: -18,
		brief: "Suez and FX shortage. Canal receipts are a high-frequency read on Red Sea risk. IMF program still the fiscal backstop.",
		gdp: "$0.39tn",
		fx: "USDEGP 48.1",
		yields: "USD bond 9.4%"
	},
	{
		id: "887",
		iso2: "YE",
		iso3: "YEM",
		name: "Yemen",
		capital: "Sana'a",
		lat: 15.35,
		lng: 44.21,
		region: "Middle East",
		populationM: 35,
		power: 18,
		econ0: -54,
		news0: -46,
		brief: "Bab el-Mandeb kinetic risk. Ansar Allah attacks remain the Red Sea premium. Shipping re-route around the Cape is the observable.",
		gdp: "n/a",
		fx: "n/a",
		yields: "n/a"
	},
	{
		id: "826",
		iso2: "GB",
		iso3: "GBR",
		name: "United Kingdom",
		capital: "London",
		lat: 51.51,
		lng: -.13,
		region: "Europe",
		populationM: 68,
		power: 64,
		econ0: 4,
		news0: 2,
		brief: "Gilt market and North Sea. Sterling still a risk barometer. London remains the FX/commodities matching engine of Europe.",
		gdp: "$3.6tn",
		fx: "GBPUSD 1.312",
		yields: "10Y 4.28%"
	},
	{
		id: "276",
		iso2: "DE",
		iso3: "DEU",
		name: "Germany",
		capital: "Berlin",
		lat: 52.52,
		lng: 13.4,
		region: "Europe",
		populationM: 84,
		power: 68,
		econ0: -8,
		news0: -4,
		brief: "Industrial recession-or-not is the EMU question. Energy mix still the strategic vulnerability. Bunds price the ECB path.",
		gdp: "$4.6tn",
		fx: "EURUSD 1.084",
		yields: "Bund 2.38%"
	},
	{
		id: "250",
		iso2: "FR",
		iso3: "FRA",
		name: "France",
		capital: "Paris",
		lat: 48.86,
		lng: 2.35,
		region: "Europe",
		populationM: 68,
		power: 66,
		econ0: -2,
		news0: 4,
		brief: "Fiscal politics and nuclear complex. Sahel residual and Indo-Pacific deployments keep it on the military overlay.",
		gdp: "$3.2tn",
		fx: "EURUSD 1.084",
		yields: "OAT 3.12%"
	},
	{
		id: "380",
		iso2: "IT",
		iso3: "ITA",
		name: "Italy",
		capital: "Rome",
		lat: 41.9,
		lng: 12.5,
		region: "Europe",
		populationM: 59,
		power: 50,
		econ0: -10,
		news0: -6,
		brief: "BTPs as the EMU stress gauge. Mediterranean energy landing point for TAP/EastMed optionality.",
		gdp: "$2.3tn",
		fx: "EURUSD 1.084",
		yields: "BTP 3.72%"
	},
	{
		id: "724",
		iso2: "ES",
		iso3: "ESP",
		name: "Spain",
		capital: "Madrid",
		lat: 40.42,
		lng: -3.7,
		region: "Europe",
		populationM: 48,
		power: 48,
		econ0: 6,
		news0: 2,
		brief: "Growth outperformer in EMU. LNG import capacity is the quiet energy-security asset.",
		gdp: "$1.7tn",
		fx: "EURUSD 1.084",
		yields: "Bonos 3.18%"
	},
	{
		id: "528",
		iso2: "NL",
		iso3: "NLD",
		name: "Netherlands",
		capital: "Amsterdam",
		lat: 52.37,
		lng: 4.89,
		region: "Europe",
		populationM: 18,
		power: 46,
		econ0: 10,
		news0: 4,
		brief: "Rotterdam and TTF. The European energy price-setters sit here more than in Brussels.",
		gdp: "$1.2tn",
		fx: "EURUSD 1.084",
		yields: "DSL 2.52%"
	},
	{
		id: "616",
		iso2: "PL",
		iso3: "POL",
		name: "Poland",
		capital: "Warsaw",
		lat: 52.23,
		lng: 21.01,
		region: "Europe",
		populationM: 38,
		power: 50,
		econ0: 12,
		news0: -10,
		brief: "NATO eastern flank and Suwałki. Defense spend is structural. Zloty as a regional risk sensor.",
		gdp: "$0.84tn",
		fx: "EURPLN 4.28",
		yields: "10Y 5.4%"
	},
	{
		id: "392",
		iso2: "JP",
		iso3: "JPN",
		name: "Japan",
		capital: "Tokyo",
		lat: 35.68,
		lng: 139.69,
		region: "East Asia",
		populationM: 123,
		power: 72,
		econ0: 2,
		news0: 8,
		brief: "BoJ path and JGB market still the world's most important rates puzzle after the Fed. Yen as funding currency — squeeze risk is live.",
		gdp: "$4.1tn",
		fx: "USDJPY 149.8",
		yields: "JGB 10Y 1.08%"
	},
	{
		id: "410",
		iso2: "KR",
		iso3: "KOR",
		name: "South Korea",
		capital: "Seoul",
		lat: 37.57,
		lng: 126.98,
		region: "East Asia",
		populationM: 52,
		power: 56,
		econ0: 6,
		news0: -8,
		brief: "Semiconductors and the northern threat. Won is a high-beta Asia risk proxy. Memory cycle turning.",
		gdp: "$1.8tn",
		fx: "USDKRW 1348",
		yields: "10Y 3.05%"
	},
	{
		id: "408",
		iso2: "KP",
		iso3: "PRK",
		name: "North Korea",
		capital: "Pyongyang",
		lat: 39.03,
		lng: 125.75,
		region: "East Asia",
		populationM: 26,
		power: 36,
		econ0: -60,
		news0: -22,
		brief: "Missile tests as a vol event for KRW and NKY. Nuclear overlay. Not a market, a tail.",
		gdp: "n/a",
		fx: "n/a",
		yields: "n/a"
	},
	{
		id: "158",
		iso2: "TW",
		iso3: "TWN",
		name: "Taiwan",
		capital: "Taipei",
		lat: 25.03,
		lng: 121.57,
		region: "East Asia",
		populationM: 23,
		power: 54,
		econ0: 8,
		news0: -24,
		brief: "TSMC as a single point of failure for AI capex. Strait risk is the decade's largest geopolitical premium. Desk tracks PLA drills weekly.",
		gdp: "$0.79tn",
		fx: "USDTWD 32.1",
		yields: "10Y 1.48%"
	},
	{
		id: "356",
		iso2: "IN",
		iso3: "IND",
		name: "India",
		capital: "New Delhi",
		lat: 28.61,
		lng: 77.21,
		region: "South Asia",
		populationM: 1440,
		power: 70,
		econ0: 28,
		news0: 6,
		brief: "Growth compounder and Russia oil absorber. Rupee managed. The structural long of the decade — crowded, still intact.",
		gdp: "$3.9tn",
		fx: "USDINR 83.9",
		yields: "10Y 6.82%"
	},
	{
		id: "586",
		iso2: "PK",
		iso3: "PAK",
		name: "Pakistan",
		capital: "Islamabad",
		lat: 33.68,
		lng: 73.05,
		region: "South Asia",
		populationM: 241,
		power: 38,
		econ0: -24,
		news0: -16,
		brief: "IMF patient, nuclear overlay, Gwadar as a China node. Not a liquid market — a stability sensor.",
		gdp: "$0.37tn",
		fx: "USDPKR 278",
		yields: "n/a"
	},
	{
		id: "682",
		iso2: "SA",
		iso3: "SAU",
		name: "Saudi Arabia",
		capital: "Riyadh",
		lat: 24.71,
		lng: 46.68,
		region: "Middle East",
		populationM: 37,
		power: 62,
		econ0: 8,
		news0: -14,
		brief: "OPEC+ whip. Vision 2030 capex vs oil price needed to fund it. That's the constraint.",
		gdp: "$1.1tn",
		fx: "USDSAR 3.75",
		yields: "Sukuk 4.8%"
	},
	{
		id: "036",
		iso2: "AU",
		iso3: "AUS",
		name: "Australia",
		capital: "Canberra",
		lat: -35.28,
		lng: 149.13,
		region: "Oceania",
		populationM: 27,
		power: 52,
		econ0: 4,
		news0: 2,
		brief: "Iron ore, LNG, and AUKUS. AUD as a China/risk hybrid. Critical minerals policy is the 2026 overlay.",
		gdp: "$1.7tn",
		fx: "AUDUSD 0.668",
		yields: "10Y 4.18%"
	},
	{
		id: "076",
		iso2: "BR",
		iso3: "BRA",
		name: "Brazil",
		capital: "Brasília",
		lat: -15.79,
		lng: -47.88,
		region: "LatAm",
		populationM: 216,
		power: 54,
		econ0: 14,
		news0: 8,
		brief: "Soft commodity powerhouse and China iron-ore pair. BRL high-beta. Fiscal is the local residual.",
		gdp: "$2.2tn",
		fx: "USDBRL 5.48",
		yields: "DI 10Y 12.4%"
	},
	{
		id: "484",
		iso2: "MX",
		iso3: "MEX",
		name: "Mexico",
		capital: "Mexico City",
		lat: 19.43,
		lng: -99.13,
		region: "LatAm",
		populationM: 130,
		power: 48,
		econ0: 10,
		news0: -4,
		brief: "Nearshoring residual and USMCA politics. Banxico as a real-rate story. Peso still a carry favorite — crowding risk flagged in COT.",
		gdp: "$1.8tn",
		fx: "USDMXN 19.4",
		yields: "Mbono 10Y 9.6%"
	},
	{
		id: "124",
		iso2: "CA",
		iso3: "CAN",
		name: "Canada",
		capital: "Ottawa",
		lat: 45.42,
		lng: -75.7,
		region: "North America",
		populationM: 41,
		power: 58,
		econ0: 6,
		news0: 2,
		brief: "Oil sands, potash, and a G7 housing hangover. CAD tracks WTI more than BoC rhetoric.",
		gdp: "$2.2tn",
		fx: "USDCAD 1.358",
		yields: "10Y 3.42%"
	},
	{
		id: "710",
		iso2: "ZA",
		iso3: "ZAF",
		name: "South Africa",
		capital: "Pretoria",
		lat: -25.75,
		lng: 28.19,
		region: "Africa",
		populationM: 63,
		power: 40,
		econ0: -14,
		news0: -8,
		brief: "PGMs, gold, and Cape re-route beneficiary when Red Sea closes. ZAR is the EM vol instrument.",
		gdp: "$0.40tn",
		fx: "USDZAR 17.6",
		yields: "R2035 10.8%"
	},
	{
		id: "566",
		iso2: "NG",
		iso3: "NGA",
		name: "Nigeria",
		capital: "Abuja",
		lat: 9.08,
		lng: 7.4,
		region: "Africa",
		populationM: 227,
		power: 36,
		econ0: -18,
		news0: -10,
		brief: "Gulf of Guinea barrels and FX reform unfinished. Sahel spillover is the security overlay.",
		gdp: "$0.25tn",
		fx: "USDNGN 1540",
		yields: "n/a"
	},
	{
		id: "012",
		iso2: "DZ",
		iso3: "DZA",
		name: "Algeria",
		capital: "Algiers",
		lat: 36.75,
		lng: 3.06,
		region: "Africa",
		populationM: 46,
		power: 38,
		econ0: 2,
		news0: -6,
		brief: "Med gas supplier to Europe. Quiet strategic — becomes loud if Ukraine winter is tight.",
		gdp: "$0.25tn",
		fx: "USDDZD 134",
		yields: "n/a"
	},
	{
		id: "360",
		iso2: "ID",
		iso3: "IDN",
		name: "Indonesia",
		capital: "Jakarta",
		lat: -6.21,
		lng: 106.85,
		region: "SE Asia",
		populationM: 279,
		power: 50,
		econ0: 16,
		news0: 4,
		brief: "Nickel, coal, and Malacca-adjacent. Downstream industrial policy is the long. Palm oil is the quiet ag input.",
		gdp: "$1.4tn",
		fx: "USDIDR 15480",
		yields: "10Y 6.55%"
	},
	{
		id: "702",
		iso2: "SG",
		iso3: "SGP",
		name: "Singapore",
		capital: "Singapore",
		lat: 1.35,
		lng: 103.82,
		region: "SE Asia",
		populationM: 6,
		power: 44,
		econ0: 20,
		news0: 6,
		brief: "Malacca node, refining hub, Asian dollar. When shipping insurance spikes, this is where it prints.",
		gdp: "$0.53tn",
		fx: "USDSGD 1.312",
		yields: "SGS 10Y 2.72%"
	},
	{
		id: "458",
		iso2: "MY",
		iso3: "MYS",
		name: "Malaysia",
		capital: "Kuala Lumpur",
		lat: 3.14,
		lng: 101.69,
		region: "SE Asia",
		populationM: 34,
		power: 40,
		econ0: 8,
		news0: 2,
		brief: "Malacca and LNG. Quiet, until it isn't — the strait is a 25% world-trade chokepoint.",
		gdp: "$0.44tn",
		fx: "USDMYR 4.38",
		yields: "10Y 3.78%"
	},
	{
		id: "764",
		iso2: "TH",
		iso3: "THA",
		name: "Thailand",
		capital: "Bangkok",
		lat: 13.76,
		lng: 100.5,
		region: "SE Asia",
		populationM: 72,
		power: 38,
		econ0: 4,
		news0: 0,
		brief: "Tourism and a baht that still behaves like an Asia beta. Not a thesis, a sensor.",
		gdp: "$0.51tn",
		fx: "USDTHB 33.4",
		yields: "10Y 2.55%"
	},
	{
		id: "704",
		iso2: "VN",
		iso3: "VNM",
		name: "Vietnam",
		capital: "Hanoi",
		lat: 21.03,
		lng: 105.85,
		region: "SE Asia",
		populationM: 100,
		power: 42,
		econ0: 18,
		news0: 4,
		brief: "China+1 manufacturing. SCS exposure. Dong managed. The industrial relocation trade, still running.",
		gdp: "$0.46tn",
		fx: "USDVND 25120",
		yields: "n/a"
	},
	{
		id: "608",
		iso2: "PH",
		iso3: "PHL",
		name: "Philippines",
		capital: "Manila",
		lat: 14.6,
		lng: 120.98,
		region: "SE Asia",
		populationM: 117,
		power: 40,
		econ0: 10,
		news0: -12,
		brief: "SCS flashpoint with China. Second Thomas Shoal is a ZONE candidate any given week.",
		gdp: "$0.46tn",
		fx: "USDPHP 56.2",
		yields: "10Y 6.1%"
	},
	{
		id: "578",
		iso2: "NO",
		iso3: "NOR",
		name: "Norway",
		capital: "Oslo",
		lat: 59.91,
		lng: 10.75,
		region: "Europe",
		populationM: 5.6,
		power: 46,
		econ0: 14,
		news0: 4,
		brief: "NCS barrels and Troll gas. Europe's energy insurance policy. NOK oil-beta.",
		gdp: "$0.49tn",
		fx: "EURNOK 11.6",
		yields: "10Y 3.48%"
	},
	{
		id: "752",
		iso2: "SE",
		iso3: "SWE",
		name: "Sweden",
		capital: "Stockholm",
		lat: 59.33,
		lng: 18.07,
		region: "Europe",
		populationM: 10.5,
		power: 44,
		econ0: 2,
		news0: 2,
		brief: "NATO accession residual, defense industrial. Krona still a high-beta G10.",
		gdp: "$0.59tn",
		fx: "EURSEK 11.3",
		yields: "10Y 2.12%"
	},
	{
		id: "756",
		iso2: "CH",
		iso3: "CHE",
		name: "Switzerland",
		capital: "Bern",
		lat: 46.95,
		lng: 7.44,
		region: "Europe",
		populationM: 8.9,
		power: 48,
		econ0: 8,
		news0: 6,
		brief: "Safe-haven CHF and commodity trading houses. When risk-off prints, this is a bid, not a story.",
		gdp: "$0.94tn",
		fx: "USDCHF 0.862",
		yields: "10Y 0.52%"
	},
	{
		id: "792",
		iso2: "TR",
		iso3: "TUR",
		name: "Turkey",
		capital: "Ankara",
		lat: 39.93,
		lng: 32.86,
		region: "Eurasia",
		populationM: 87,
		power: 52,
		econ0: -4,
		news0: -12,
		brief: "Bosporus chokepoint and NATO's southern hinge.",
		gdp: "$1.1tn",
		fx: "USDTRY 34.8",
		yields: "10Y 27%"
	},
	{
		id: "368",
		iso2: "IQ",
		iso3: "IRQ",
		name: "Iraq",
		capital: "Baghdad",
		lat: 33.32,
		lng: 44.37,
		region: "Middle East",
		populationM: 45,
		power: 34,
		econ0: -20,
		news0: -26,
		brief: "Kirkuk-Ceyhan and Basra barrels. Militia risk is the Iran-arc transmission into oil.",
		gdp: "$0.25tn",
		fx: "n/a",
		yields: "n/a"
	},
	{
		id: "414",
		iso2: "KW",
		iso3: "KWT",
		name: "Kuwait",
		capital: "Kuwait City",
		lat: 29.38,
		lng: 47.99,
		region: "Middle East",
		populationM: 4.4,
		power: 36,
		econ0: 4,
		news0: -16,
		brief: "Spare capacity neighbour. Hormuz-adjacent. Quiet unless the strait closes.",
		gdp: "$0.16tn",
		fx: "USDKWD 0.307",
		yields: "n/a"
	},
	{
		id: "634",
		iso2: "QA",
		iso3: "QAT",
		name: "Qatar",
		capital: "Doha",
		lat: 25.29,
		lng: 51.53,
		region: "Middle East",
		populationM: 2.7,
		power: 40,
		econ0: 12,
		news0: -10,
		brief: "LNG that keeps European winters solvable. North Field expansion is structural supply.",
		gdp: "$0.22tn",
		fx: "USDQAR 3.64",
		yields: "n/a"
	},
	{
		id: "512",
		iso2: "OM",
		iso3: "OMN",
		name: "Oman",
		capital: "Muscat",
		lat: 23.59,
		lng: 58.41,
		region: "Middle East",
		populationM: 4.6,
		power: 32,
		econ0: 2,
		news0: -20,
		brief: "East of Hormuz. The alternative load point if the strait seizes. Quietly strategic.",
		gdp: "$0.11tn",
		fx: "USDOMR 0.385",
		yields: "n/a"
	},
	{
		id: "400",
		iso2: "JO",
		iso3: "JOR",
		name: "Jordan",
		capital: "Amman",
		lat: 31.95,
		lng: 35.93,
		region: "Middle East",
		populationM: 11,
		power: 28,
		econ0: -8,
		news0: -14,
		brief: "Buffer state. Not a market — a corridor.",
		gdp: "$0.05tn",
		fx: "USDJOD 0.71",
		yields: "n/a"
	},
	{
		id: "760",
		iso2: "SY",
		iso3: "SYR",
		name: "Syria",
		capital: "Damascus",
		lat: 33.51,
		lng: 36.29,
		region: "Middle East",
		populationM: 23,
		power: 24,
		econ0: -70,
		news0: -40,
		brief: "Fragmented battlespace. Base presence (Hmeimim, al-Tanf) is the MIL overlay.",
		gdp: "n/a",
		fx: "n/a",
		yields: "n/a"
	},
	{
		id: "422",
		iso2: "LB",
		iso3: "LBN",
		name: "Lebanon",
		capital: "Beirut",
		lat: 33.89,
		lng: 35.5,
		region: "Middle East",
		populationM: 5.5,
		power: 22,
		econ0: -48,
		news0: -32,
		brief: "Northern front sensor. Not investable; informative.",
		gdp: "n/a",
		fx: "n/a",
		yields: "n/a"
	},
	{
		id: "275",
		iso2: "PS",
		iso3: "PSE",
		name: "Palestine",
		capital: "Ramallah",
		lat: 31.9,
		lng: 35.2,
		region: "Middle East",
		populationM: 5.5,
		power: 12,
		econ0: -66,
		news0: -50,
		brief: "Humanitarian and kinetic overlay. Oil and risk assets still reprice on headline days.",
		gdp: "n/a",
		fx: "n/a",
		yields: "n/a"
	},
	{
		id: "004",
		iso2: "AF",
		iso3: "AFG",
		name: "Afghanistan",
		capital: "Kabul",
		lat: 34.53,
		lng: 69.17,
		region: "South Asia",
		populationM: 43,
		power: 20,
		econ0: -58,
		news0: -12,
		brief: "Residual terror overlay. Lithium narrative overstated.",
		gdp: "n/a",
		fx: "n/a",
		yields: "n/a"
	},
	{
		id: "398",
		iso2: "KZ",
		iso3: "KAZ",
		name: "Kazakhstan",
		capital: "Astana",
		lat: 51.17,
		lng: 71.45,
		region: "Eurasia",
		populationM: 20,
		power: 38,
		econ0: 8,
		news0: -4,
		brief: "CPC pipeline barrels to Novorossiysk. Uranium. The quiet energy state.",
		gdp: "$0.26tn",
		fx: "USDKZT 478",
		yields: "n/a"
	},
	{
		id: "031",
		iso2: "AZ",
		iso3: "AZE",
		name: "Azerbaijan",
		capital: "Baku",
		lat: 40.41,
		lng: 49.87,
		region: "Eurasia",
		populationM: 10,
		power: 36,
		econ0: 10,
		news0: -2,
		brief: "TAP/TANAP gas to Europe. Corridor politics with Armenia. Strategic, not liquid.",
		gdp: "$0.07tn",
		fx: "USDAZN 1.70",
		yields: "n/a"
	},
	{
		id: "268",
		iso2: "GE",
		iso3: "GEO",
		name: "Georgia",
		capital: "Tbilisi",
		lat: 41.72,
		lng: 44.83,
		region: "Eurasia",
		populationM: 3.7,
		power: 24,
		econ0: 4,
		news0: -8,
		brief: "Caucasus corridor. BTC pipeline. A map node, not a book.",
		gdp: "$0.03tn",
		fx: "n/a",
		yields: "n/a"
	},
	{
		id: "804",
		iso2: "UA",
		iso3: "UKR",
		name: "Ukraine",
		capital: "Kyiv",
		lat: 50.45,
		lng: 30.52,
		region: "Europe",
		populationM: 37,
		power: 44,
		econ0: -28,
		news0: -38,
		brief: "Attrition and grain. Zaporizhzhia nuclear remains a ZONE.",
		gdp: "$0.18tn",
		fx: "USDUAH 41.2",
		yields: "n/a"
	}
];
var BY_ID = {};
for (const s of SEEDS) BY_ID[s.id] = s;
function countryIntel(id, asOf) {
	if (!id) return null;
	const s = BY_ID[id];
	if (!s) return null;
	const r = mulberry32(hashStr(id) ^ dayKey(asOf));
	const econ = clampScore(s.econ0 + (r() - .5) * 10);
	const news = clampScore(s.news0 + (r() - .5) * 14);
	return {
		...s,
		econ,
		news
	};
}
function countryScore(id, asOf, mode) {
	const c = countryIntel(id, asOf);
	if (c) return mode === "econ" ? c.econ : c.news;
	if (!id) return 0;
	return clampScore((mulberry32(hashStr(id) ^ dayKey(asOf) ^ (mode === "econ" ? 1 : 2))() - .5) * 70);
}
function clampScore(n) {
	return Math.max(-100, Math.min(100, n));
}
function allCountryIntel(asOf) {
	const seen = /* @__PURE__ */ new Set();
	const out = [];
	for (const s of SEEDS) {
		if (seen.has(s.id)) continue;
		seen.add(s.id);
		const c = countryIntel(s.id, asOf);
		if (c) out.push(c);
	}
	return out;
}
function CommandPalette() {
	const open = useTerminal((s) => s.cmdOpen);
	const setOpen = useTerminal((s) => s.setCmdOpen);
	const router = useRouter();
	const asOf = useClock();
	const [q, setQ] = (0, import_react.useState)("");
	const inputRef = (0, import_react.useRef)(null);
	(0, import_react.useEffect)(() => {
		if (open) {
			setQ("");
			requestAnimationFrame(() => inputRef.current?.focus());
		}
	}, [open]);
	const items = (0, import_react.useMemo)(() => {
		const countries = allCountryIntel(asOf).map((c) => ({
			id: `c-${c.id}`,
			group: "Countries",
			label: c.name,
			hint: c.iso2,
			href: `/?sel=country:${c.id}`
		}));
		const views = [...NAV, ...MORE_NAV].map((n) => ({
			id: n.id,
			group: "Views",
			label: n.label,
			hint: n.fkey,
			href: n.path
		}));
		const userTheses = useTerminal.getState().userTheses.map((t) => ({
			id: t.id,
			group: "Theses",
			label: t.title,
			hint: t.state,
			href: `/theses/${t.id}`
		}));
		const theses = THESES.map((t) => ({
			id: t.id,
			group: "Theses",
			label: t.title,
			hint: t.state,
			href: `/theses/${t.id}`
		}));
		const all = [
			...views,
			...userTheses,
			...theses,
			...countries
		];
		const qq = q.trim().toLowerCase();
		if (!qq) return all.slice(0, 18);
		return all.filter((x) => `${x.label} ${x.hint}`.toLowerCase().includes(qq)).slice(0, 18);
	}, [asOf, q]);
	if (!open) return null;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "fixed inset-0 z-50 flex items-start justify-center bg-bg/70 px-3 pt-[12vh]",
		onClick: () => setOpen(false),
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "w-full max-w-lg overflow-hidden rounded-md border border-border-strong bg-bg-elevated shadow-2xl",
			onClick: (e) => e.stopPropagation(),
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
				ref: inputRef,
				value: q,
				onChange: (e) => setQ(e.target.value),
				placeholder: "Jump to a view, thesis, country…",
				className: "w-full border-b border-border bg-transparent px-4 py-3 font-sans text-sm text-fg outline-none placeholder:text-fg-subtle",
				onKeyDown: (e) => {
					if (e.key === "Escape") setOpen(false);
					if (e.key === "Enter" && items[0]) {
						router.history.push(items[0].href);
						setOpen(false);
					}
				}
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("ul", {
				className: "max-h-[50vh] overflow-y-auto py-1 terminal-scroll",
				children: [items.map((it) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
					type: "button",
					className: cn("flex w-full items-center justify-between gap-3 px-4 py-2 text-left hover:bg-bg-hover"),
					onClick: () => {
						router.history.push(it.href);
						setOpen(false);
					},
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "min-w-0 truncate text-sm",
						children: it.label
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
						className: "shrink-0 font-mono text-[10px] text-fg-subtle",
						children: [
							it.group,
							" · ",
							it.hint
						]
					})]
				}) }, it.id)), items.length === 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", {
					className: "px-4 py-6 text-center text-sm text-fg-muted",
					children: "No matches"
				})]
			})]
		})
	});
}
var SEV = {
	CRITICAL: "border-bear/40 bg-bear/15 text-bear",
	HIGH: "border-high/40 bg-high/15 text-high",
	MEDIUM: "border-warn/40 bg-warn/15 text-warn",
	LOW: "border-accent/25 bg-accent/10 text-accent",
	INFO: "border-info/40 bg-info/15 text-info"
};
function SeverityPill({ value, className }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
		className: cn("inline-flex items-center rounded-xs border px-1.5 py-0.5 font-mono text-[10px] font-medium tracking-wide", SEV[value], className),
		children: value
	});
}
function Delta({ n, suffix = "%", className }) {
	const pos = n > 0;
	const neg = n < 0;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
		className: cn("tabular font-mono text-xs", pos && "text-bull", neg && "text-bear", !pos && !neg && "text-fg-muted", className),
		children: suffix === "%" ? fmtPct(n) : `${fmtSigned(n, 2)}${suffix}`
	});
}
function Spark({ data, className, invert = false }) {
	if (data.length < 2) return null;
	const min = Math.min(...data);
	const h = Math.max(...data) - min || 1;
	const pts = data.map((v, i) => {
		return `${i / (data.length - 1) * 100},${100 - (v - min) / h * 100}`;
	}).join(" ");
	const up = data[data.length - 1] >= data[0];
	const bull = invert ? !up : up;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("svg", {
		viewBox: "0 0 100 28",
		preserveAspectRatio: "none",
		className: cn("h-7 w-16", className),
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("polyline", {
			fill: "none",
			points: pts,
			className: bull ? "stroke-bull" : "stroke-bear",
			strokeWidth: "2",
			vectorEffect: "non-scaling-stroke"
		})
	});
}
function ScoreBar({ n, className }) {
	const mag = Math.min(100, Math.abs(n));
	const pos = n >= 0;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: cn("flex h-1.5 w-full overflow-hidden rounded-xs bg-bg-sunken", className),
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "flex w-1/2 justify-end",
			children: !pos && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "h-full bg-bear",
				style: { width: `${mag}%` }
			})
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "flex w-1/2",
			children: pos && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "h-full bg-bull",
				style: { width: `${mag}%` }
			})
		})]
	});
}
function LiveDot({ live }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
		className: "inline-flex items-center gap-1.5 font-mono text-[10px] tracking-wider text-fg-muted uppercase",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: cn("size-1.5 rounded-full", live ? "live-dot bg-bull" : "bg-fg-subtle") }), live ? "Live" : "Replay"]
	});
}
function Kbd({ children }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("kbd", {
		className: "rounded-xs border border-border bg-bg-sunken px-1 py-px font-mono text-[10px] text-fg-muted",
		children
	});
}
function FactorChip({ label, n }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex min-w-0 flex-col gap-1",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex items-baseline justify-between gap-2",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "font-mono text-[10px] tracking-wider text-fg-subtle",
				children: label
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: cn("tabular font-mono text-[11px]", n >= 0 ? "text-bull" : "text-bear"),
				children: fmtSigned(n, 0)
			})]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ScoreBar, { n })]
	});
}
function TerminalShell({ children }) {
	const path = useRouterState({ select: (s) => s.location.pathname });
	const nav = useNavigate();
	const setCmd = useTerminal((s) => s.setCmdOpen);
	const setDrawer = useTerminal((s) => s.setDrawer);
	const moreOpen = useTerminal((s) => s.moreOpen);
	const setMoreOpen = useTerminal((s) => s.setMoreOpen);
	const asOf = useClock();
	const live = useTerminal((s) => s.asOf) == null;
	const showTicker = useTerminal((s) => s.grid.TICKER);
	const [menu, setMenu] = (0, import_react.useState)(false);
	(0, import_react.useEffect)(() => {
		try {
			useTerminal.persist.rehydrate();
		} catch {}
	}, []);
	(0, import_react.useEffect)(() => {
		const onKey = (e) => {
			const t = e.target;
			const typing = t && (t.tagName === "INPUT" || t.tagName === "TEXTAREA" || t.isContentEditable);
			if (e.key === "Escape") {
				setDrawer(null);
				setCmd(false);
				setMenu(false);
				setMoreOpen(false);
				return;
			}
			if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
				e.preventDefault();
				setCmd(true);
				return;
			}
			if (!typing && e.key === "/") {
				e.preventDefault();
				setCmd(true);
				return;
			}
			if (typing) return;
			const all = [...NAV, ...MORE_NAV];
			if (e.key === "f" || e.key === "F") {}
			const fMatch = all.find((n) => n.fkey === e.key.toUpperCase() || n.fkey === e.key);
			if (e.key.startsWith("F") && e.key.length <= 3) {
				const hit = all.find((n) => n.fkey === e.key);
				if (hit) {
					e.preventDefault();
					nav({ to: hit.path });
				}
			}
			if (!e.metaKey && !e.ctrlKey && !e.altKey && fMatch && /^[sraydwh]$/i.test(e.key)) {
				e.preventDefault();
				nav({ to: fMatch.path });
			}
		};
		window.addEventListener("keydown", onKey);
		return () => window.removeEventListener("keydown", onKey);
	}, [
		nav,
		setCmd,
		setDrawer,
		setMoreOpen
	]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex h-dvh flex-col overflow-hidden bg-bg text-fg",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", {
				className: "flex h-11 shrink-0 items-center gap-2 border-b border-border bg-bg-elevated px-2 md:px-3",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
						to: "/",
						className: "flex items-center gap-2 px-1 no-underline",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArgosMark, {}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "font-sans text-[13px] font-semibold tracking-[0.18em] text-fg",
							children: "ARGOS"
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("nav", {
						className: "hidden min-w-0 flex-1 items-center gap-0 overflow-x-auto md:flex",
						children: [NAV.map((n) => {
							const active = n.path === "/" ? path === "/" : path === n.path || path.startsWith(n.path + "/");
							return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
								to: n.path,
								className: cn("relative flex h-11 shrink-0 items-center gap-1.5 px-2.5 font-mono text-[11px] tracking-wide no-underline", active ? "text-fg" : "text-fg-muted hover:text-fg"),
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "hidden text-[9px] text-fg-subtle lg:inline",
										children: n.fkey
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: n.label.toUpperCase() }),
									active && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "absolute inset-x-2 bottom-0 h-px bg-accent" })
								]
							}, n.id);
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "relative hidden md:block",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
								type: "button",
								onClick: () => setMoreOpen(!moreOpen),
								className: cn("relative flex h-11 shrink-0 items-center px-2 font-mono text-[11px] text-fg-muted hover:text-fg", moreOpen && "text-fg", MORE_NAV.some((n) => path === n.path || path.startsWith(n.path + "/")) && "text-fg"),
								"aria-label": "More views",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Ellipsis, { className: "size-3.5" }), MORE_NAV.some((n) => path === n.path || path.startsWith(n.path + "/")) && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "absolute inset-x-2 bottom-0 h-px bg-accent" })]
							}), moreOpen && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "fixed inset-0 z-20",
								onClick: () => setMoreOpen(false)
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "absolute left-0 top-11 z-30 w-52 border border-border bg-bg-elevated py-1 shadow-2xl",
								children: MORE_NAV.map((n) => {
									const active = path === n.path || path.startsWith(n.path + "/");
									return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
										to: n.path,
										onClick: () => setMoreOpen(false),
										className: cn("flex h-9 items-center justify-between px-3 font-mono text-[11px] no-underline hover:bg-bg-hover", active ? "text-fg" : "text-fg-muted"),
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: n.label.toUpperCase() }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "text-[9px] text-fg-subtle",
											children: n.fkey
										})]
									}, n.id);
								})
							})] })]
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						className: "ml-auto flex size-9 items-center justify-center rounded-sm text-fg-muted hover:bg-bg-hover hover:text-fg md:hidden",
						onClick: () => setMenu((v) => !v),
						"aria-label": "Open menu",
						children: menu ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { className: "size-4" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Menu, { className: "size-4" })
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
						type: "button",
						className: "hidden h-8 items-center gap-2 rounded-sm border border-border bg-bg-sunken px-2.5 text-fg-muted hover:text-fg md:flex",
						onClick: () => setCmd(true),
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Search, { className: "size-3.5" }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "font-mono text-[11px]",
								children: "Search"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Kbd, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Command, { className: "mr-0.5 inline size-2.5" }), "K"] })
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "hidden items-center gap-3 pl-2 md:flex",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(LiveDot, { live }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center gap-1.5 font-mono text-[11px] text-fg-muted",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Clock, { className: "size-3" }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "tabular text-fg",
									children: utcStamp(asOf)
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "UTC" }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "hidden text-fg-subtle lg:inline",
									children: utcDate(asOf)
								})
							]
						})]
					})
				]
			}),
			menu && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "border-b border-border bg-bg-elevated md:hidden",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "grid grid-cols-3 gap-px p-2",
					children: [...NAV, ...MORE_NAV].map((n) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
						to: n.path,
						onClick: () => setMenu(false),
						className: "flex h-11 items-center justify-center rounded-sm bg-bg-panel font-mono text-[11px] text-fg no-underline",
						children: n.label
					}, n.id))
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "flex min-h-0 flex-1",
				children
			}),
			showTicker && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TickerTape, { asOf }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("footer", {
				className: "flex h-7 shrink-0 items-center justify-between gap-3 border-t border-border bg-bg-elevated px-3 font-mono text-[10px] tracking-wide text-fg-subtle",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "ARGOS DESK · MARKETS & GEOPOLITICS" }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "hidden sm:inline",
						children: "ESC close · / search · F1–F12 · S STIR · R risk · A watch · Y season · D docs"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
						className: "tabular",
						children: [utcStamp(asOf), " UTC"]
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CommandPalette, {})
		]
	});
}
function TickerTape({ asOf }) {
	const rows = ticker(asOf);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "flex h-8 shrink-0 items-center gap-0 overflow-x-auto border-t border-border bg-bg-sunken terminal-scroll",
		children: rows.map((r) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex h-8 shrink-0 items-center gap-2 border-r border-border px-3",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "font-mono text-[10px] tracking-wide text-fg-muted",
					children: r.pair
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "tabular font-mono text-[11px] text-fg",
					children: r.px
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Delta, { n: r.chg }),
				r.spread > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
					className: "font-mono text-[10px] text-fg-subtle",
					children: [r.spread.toFixed(1), "s"]
				})
			]
		}, r.pair))
	});
}
function ArgosMark() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("svg", {
		width: "16",
		height: "16",
		viewBox: "0 0 16 16",
		"aria-hidden": "true",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("circle", {
				cx: "8",
				cy: "8",
				r: "7",
				fill: "none",
				stroke: "currentColor",
				strokeWidth: "1.2",
				className: "text-accent"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("circle", {
				cx: "8",
				cy: "8",
				r: "3.2",
				fill: "none",
				stroke: "currentColor",
				strokeWidth: "1.2",
				className: "text-accent"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("circle", {
				cx: "8",
				cy: "8",
				r: "1.3",
				className: "fill-bull"
			})
		]
	});
}
//#endregion
export { trackRecord as $, fmtSigned as A, mulberry32 as B, cn as C, destination as D, dayKey as E, hashStr as F, rollingMax as G, normCdf as H, hourKey as I, rollingStd as J, rollingMean as K, iceDxy as L, garchT as M, guessDomain as N, fmtNum as O, guessInstrument as P, ticker as Q, invNorm as R, closedTheses as S, countryScore as T, pxOf as U, newUserThesis as V, riskSnapshot as W, stdev as X, series as Y, thesisById as Z, allCountryIntel as _, FX_BASE_SPOTS as a, wealthPath as at, bbdxyWeightSum as b, ICE_DXY_FACTOR as c, yieldLevels as ct, RISK_ASSETS as d, useClock as et, ScoreBar as f, TerminalShell as g, THESES as h, Delta as i, utcStamp as it, fxSpots as j, fmtPct as k, ICE_DXY_WEIGHTS as l, yieldSpreads as lt, Spark as m, BBDXY_REBASE as n, utcDate as nt, FactorChip as o, yieldCurve as ot, SeverityPill as p, rollingMin as q, DESK_EPOCH as r, utcFull as rt, GRID_LAYERS as s, yieldHistory as st, BBDXY_2026 as t, useTerminal as tt, PULSE_ASSETS as u, bbdxy as v, countryIntel as w, clamp as x, bbdxyContrib as y, mean as z };
