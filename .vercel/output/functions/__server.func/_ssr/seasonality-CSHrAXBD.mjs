import { B as mulberry32, F as hashStr, U as pxOf, X as stdev, z as mean } from "./shell-B4EHQ9b6.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/seasonality-CSHrAXBD.js
var SEASON_ASSETS = [
	{
		symbol: "WTI",
		name: "WTI crude",
		cls: "Energy"
	},
	{
		symbol: "XAU",
		name: "Gold",
		cls: "Metals"
	},
	{
		symbol: "SPX",
		name: "S&P 500",
		cls: "Index"
	},
	{
		symbol: "NDX",
		name: "Nasdaq 100",
		cls: "Index"
	},
	{
		symbol: "EURUSD",
		name: "Euro",
		cls: "FX"
	},
	{
		symbol: "USDJPY",
		name: "Dollar-yen",
		cls: "FX"
	},
	{
		symbol: "US10Y",
		name: "UST 10Y",
		cls: "Rates"
	},
	{
		symbol: "BBDXY",
		name: "Bloomberg dollar",
		cls: "FX"
	},
	{
		symbol: "DXY",
		name: "ICE DXY",
		cls: "FX"
	},
	{
		symbol: "BTC",
		name: "Bitcoin",
		cls: "Crypto"
	},
	{
		symbol: "NATGAS",
		name: "Henry Hub",
		cls: "Energy"
	},
	{
		symbol: "XAG",
		name: "Silver",
		cls: "Metals"
	}
];
var MONTHS = [
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
];
function monthReturns(symbol, month) {
	const rng = mulberry32(hashStr(`${symbol}-m${month}`));
	const n = 12;
	const seasonal = symbol === "WTI" ? [
		.4,
		.6,
		1.1,
		1.4,
		.2,
		-.4,
		-.2,
		.8,
		1.6,
		.9,
		-.3,
		.1
	][month] : symbol === "XAU" ? [
		1.2,
		.4,
		-.2,
		.6,
		.3,
		-.4,
		.2,
		.5,
		1.1,
		.8,
		.2,
		.7
	][month] : symbol === "NATGAS" ? [
		.8,
		-.4,
		-1.2,
		-.8,
		-.5,
		.4,
		.6,
		.3,
		.9,
		1.4,
		1.8,
		1.1
	][month] : symbol === "SPX" ? [
		.9,
		.2,
		.8,
		.6,
		.4,
		.1,
		1.1,
		-.4,
		-.6,
		.8,
		1.4,
		1.1
	][month] : symbol === "EURUSD" ? [
		-.3,
		.2,
		.4,
		.1,
		-.2,
		.3,
		.5,
		-.1,
		-.4,
		.2,
		.1,
		-.2
	][month] : symbol === "BTC" ? [
		2.1,
		1.4,
		-.8,
		1.8,
		-1.2,
		-.4,
		1.1,
		-.6,
		-.3,
		2.4,
		1.6,
		.8
	][month] : [
		.1,
		.05,
		.2,
		.15,
		.05,
		-.1,
		.2,
		-.15,
		-.2,
		.25,
		.3,
		.2
	][month];
	const out = [];
	for (let i = 0; i < n; i++) out.push(seasonal + (rng() - .5) * 2.4);
	return out;
}
function stat(month, xs) {
	return {
		month,
		label: MONTHS[month],
		avg: +mean(xs).toFixed(2),
		win: +(xs.filter((v) => v > 0).length / xs.length * 100).toFixed(0),
		std: +stdev(xs, 1).toFixed(2),
		best: +Math.max(...xs).toFixed(2),
		worst: +Math.min(...xs).toFixed(2),
		n: xs.length
	};
}
function seasonality(asOf) {
	const m = new Date(asOf).getUTCMonth();
	return SEASON_ASSETS.map((a) => {
		const heatmap = MONTHS.map((_, i) => stat(i, monthReturns(a.symbol, i)));
		const thisMonth = heatmap[m];
		const nextMonth = heatmap[(m + 1) % 12];
		const now = pxOf(a.symbol, asOf).chg;
		return {
			...a,
			thisMonth,
			nextMonth,
			now,
			vsSeason: +(now - thisMonth.avg).toFixed(2),
			heatmap,
			currentMonth: m
		};
	});
}
function seasonHistory(symbol) {
	return MONTHS.map((_, i) => {
		const s = stat(i, monthReturns(symbol, i));
		return {
			m: s.label,
			avg: s.avg,
			win: s.win,
			best: s.best,
			worst: s.worst
		};
	});
}
//#endregion
export { seasonality as n, seasonHistory as t };
