//#region node_modules/.nitro/vite/services/ssr/assets/congress-BroZzhmq.js
function amountMid(t) {
	const lo = t.amountLow ?? 0;
	return (lo + (t.amountHigh ?? lo)) / 2;
}
function signedAmount(t) {
	return (t.tradeType === "Buy" ? 1 : t.tradeType === "Sell" ? -1 : 0) * amountMid(t);
}
function disclosureLag(t) {
	const a = Date.parse(t.txDate);
	const b = Date.parse(t.discDate);
	if (!Number.isFinite(a) || !Number.isFinite(b)) return null;
	return Math.round((b - a) / 864e5);
}
function tickerSentiment(trades) {
	const g = /* @__PURE__ */ new Map();
	for (const t of trades) {
		if (!t.ticker) continue;
		const arr = g.get(t.ticker) ?? [];
		arr.push(t);
		g.set(t.ticker, arr);
	}
	return [...g.entries()].map(([ticker, rows]) => ({
		ticker,
		n: rows.length,
		buys: rows.filter((r) => r.tradeType === "Buy").length,
		sells: rows.filter((r) => r.tradeType === "Sell").length,
		net: rows.reduce((s, r) => s + signedAmount(r), 0),
		members: new Set(rows.map((r) => r.politician)).size,
		last: rows.map((r) => r.txDate).sort().at(-1) ?? ""
	})).sort((a, b) => b.net - a.net);
}
/** Public-tape cache used when Capitol Trades / Disclosed Capitol are unreachable. Lag ≤ 45d is the legal window. */
var CONGRESS_CACHE = [
	{
		id: "c1",
		politician: "Nancy Pelosi",
		chamber: "House",
		ticker: "NVDA",
		tradeType: "Buy",
		amountLow: 5e5,
		amountHigh: 1e6,
		txDate: "2026-08-12",
		discDate: "2026-09-18",
		party: "D",
		state: "CA",
		source: "cache"
	},
	{
		id: "c2",
		politician: "Tommy Tuberville",
		chamber: "Senate",
		ticker: "XOM",
		tradeType: "Buy",
		amountLow: 5e4,
		amountHigh: 1e5,
		txDate: "2026-08-28",
		discDate: "2026-09-22",
		party: "R",
		state: "AL",
		source: "cache"
	},
	{
		id: "c3",
		politician: "Josh Gottheimer",
		chamber: "House",
		ticker: "AAPL",
		tradeType: "Sell",
		amountLow: 15e3,
		amountHigh: 5e4,
		txDate: "2026-09-02",
		discDate: "2026-09-29",
		party: "D",
		state: "NJ",
		source: "cache"
	},
	{
		id: "c4",
		politician: "Dan Crenshaw",
		chamber: "House",
		ticker: "LMT",
		tradeType: "Buy",
		amountLow: 15e3,
		amountHigh: 5e4,
		txDate: "2026-08-19",
		discDate: "2026-09-14",
		party: "R",
		state: "TX",
		source: "cache"
	},
	{
		id: "c5",
		politician: "Mark Warner",
		chamber: "Senate",
		ticker: "MSFT",
		tradeType: "Buy",
		amountLow: 5e4,
		amountHigh: 1e5,
		txDate: "2026-07-30",
		discDate: "2026-09-08",
		party: "D",
		state: "VA",
		source: "cache"
	},
	{
		id: "c6",
		politician: "Marjorie Taylor Greene",
		chamber: "House",
		ticker: "TSLA",
		tradeType: "Sell",
		amountLow: 15e3,
		amountHigh: 5e4,
		txDate: "2026-09-04",
		discDate: "2026-09-30",
		party: "R",
		state: "GA",
		source: "cache"
	},
	{
		id: "c7",
		politician: "Ro Khanna",
		chamber: "House",
		ticker: "GOOG",
		tradeType: "Buy",
		amountLow: 15e3,
		amountHigh: 5e4,
		txDate: "2026-08-21",
		discDate: "2026-09-16",
		party: "D",
		state: "CA",
		source: "cache"
	},
	{
		id: "c8",
		politician: "Rick Scott",
		chamber: "Senate",
		ticker: "JPM",
		tradeType: "Buy",
		amountLow: 1e5,
		amountHigh: 25e4,
		txDate: "2026-08-07",
		discDate: "2026-09-11",
		party: "R",
		state: "FL",
		source: "cache"
	},
	{
		id: "c9",
		politician: "Adam Smith",
		chamber: "House",
		ticker: "RTX",
		tradeType: "Buy",
		amountLow: 15e3,
		amountHigh: 5e4,
		txDate: "2026-09-01",
		discDate: "2026-09-28",
		party: "D",
		state: "WA",
		source: "cache"
	},
	{
		id: "c10",
		politician: "John Boozman",
		chamber: "Senate",
		ticker: "DE",
		tradeType: "Buy",
		amountLow: 15e3,
		amountHigh: 5e4,
		txDate: "2026-08-14",
		discDate: "2026-09-20",
		party: "R",
		state: "AR",
		source: "cache"
	}
];
//#endregion
export { tickerSentiment as i, amountMid as n, disclosureLag as r, CONGRESS_CACHE as t };
