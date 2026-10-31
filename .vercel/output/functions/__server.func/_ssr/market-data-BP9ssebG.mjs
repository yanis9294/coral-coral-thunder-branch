import { t as createServerFn } from "./ssr.mjs";
import { t as createServerRpc } from "./createServerRpc-A6pJPYTF.mjs";
import { t as CONGRESS_CACHE } from "./congress-BroZzhmq.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/market-data-BP9ssebG.js
var UA = "Mozilla/5.0 (compatible; ARGOS-Desk/1.0)";
async function getJson(url, ms = 12e3) {
	const ctrl = new AbortController();
	const t = setTimeout(() => ctrl.abort(), ms);
	try {
		const res = await fetch(url, {
			headers: {
				"User-Agent": UA,
				Accept: "application/json"
			},
			signal: ctrl.signal
		});
		if (!res.ok) return null;
		return await res.json();
	} catch {
		return null;
	} finally {
		clearTimeout(t);
	}
}
async function yahooChart(symbol, range = "5y") {
	const r = (await getJson(`https://query1.finance.yahoo.com/v8/finance/chart/${encodeURIComponent(symbol)}?range=${range}&interval=1d&events=div`))?.chart?.result?.[0];
	if (!r?.timestamp || !r.indicators?.quote?.[0]?.close) return null;
	const close = r.indicators.quote[0].close;
	const px = [];
	for (let i = 0; i < r.timestamp.length; i++) {
		const v = close[i];
		if (v && v > 0) px.push({
			t: r.timestamp[i] * 1e3,
			v
		});
	}
	return {
		px,
		last: r.meta?.regularMarketPrice ?? px.at(-1)?.v ?? 0
	};
}
function seriesOf(json, key) {
	const rows = json?.timeseries?.result ?? [];
	for (const row of rows) {
		const arr = row[key];
		if (!Array.isArray(arr)) continue;
		const out = [];
		for (const p of arr) {
			const v = p.reportedValue?.raw;
			const t = p.asOfDate ? Date.parse(p.asOfDate) : NaN;
			if (Number.isFinite(v) && Number.isFinite(t)) out.push({
				t,
				v
			});
		}
		return out.sort((a, b) => a.t - b.t);
	}
	return [];
}
function lastOf(xs) {
	return xs.at(-1)?.v ?? NaN;
}
function betaOf(stock, mkt) {
	const sm = new Map(mkt.map((p) => [new Date(p.t).toISOString().slice(0, 10), p.v]));
	const rs = [];
	const rm = [];
	for (let i = 1; i < stock.length; i++) {
		const d0 = new Date(stock[i - 1].t).toISOString().slice(0, 10);
		const d1 = new Date(stock[i].t).toISOString().slice(0, 10);
		const m0 = sm.get(d0);
		const m1 = sm.get(d1);
		const s0 = stock[i - 1].v;
		const s1 = stock[i].v;
		if (m0 && m1 && s0 > 0 && s1 > 0) {
			rs.push(s1 / s0 - 1);
			rm.push(m1 / m0 - 1);
		}
	}
	if (rs.length < 40) return 1;
	const ms = rs.reduce((a, b) => a + b, 0) / rs.length;
	const mm = rm.reduce((a, b) => a + b, 0) / rm.length;
	let cov = 0;
	let varM = 0;
	for (let i = 0; i < rs.length; i++) {
		cov += (rs[i] - ms) * (rm[i] - mm);
		varM += (rm[i] - mm) ** 2;
	}
	if (varM === 0) return 1;
	return cov / varM;
}
function parseYield(v) {
	if (v > 20) return v / 1e3;
	if (v > 1) return v / 100;
	return v;
}
var TS_TYPES = [
	"annualFreeCashFlow",
	"trailingFreeCashFlow",
	"annualNetDebt",
	"trailingNetDebt",
	"annualTotalDebt",
	"annualCashAndCashEquivalents",
	"annualInterestExpense",
	"annualNetIncome",
	"annualTotalRevenue",
	"annualGrossProfit",
	"annualOperatingIncome",
	"annualStockholdersEquity",
	"annualTotalAssets",
	"annualCurrentAssets",
	"annualCurrentLiabilities",
	"annualLongTermDebt",
	"annualShareIssued",
	"annualOperatingCashFlow",
	"trailingMarketCap",
	"trailingEps"
].join(",");
var fetchFundamentals_createServerFn_handler = createServerRpc({
	id: "db955a0490cf7be5879448950cc18558f4a819f2056ce4f728a75e3c12de5c4c",
	name: "fetchFundamentals",
	filename: "src/lib/market-data.ts"
}, (opts) => fetchFundamentals.__executeServer(opts));
var fetchFundamentals = createServerFn({ method: "POST" }).validator((d) => d).handler(fetchFundamentals_createServerFn_handler, async ({ data }) => {
	const ticker = data.ticker.trim().toUpperCase();
	const now = Math.floor(Date.now() / 1e3);
	const p1 = now - 378432e3;
	const [chart, spy, tnx, gspc, ts] = await Promise.all([
		yahooChart(ticker, "5y"),
		yahooChart("SPY", "5y"),
		yahooChart("^TNX", "5d"),
		yahooChart("^GSPC", "10y"),
		getJson(`https://query1.finance.yahoo.com/ws/fundamentals-timeseries/v1/finance/timeseries/${encodeURIComponent(ticker)}?type=${TS_TYPES}&period1=${p1}&period2=${now}`)
	]);
	if (!chart || chart.px.length < 30) return {
		ok: false,
		error: `No Yahoo chart for ${ticker}. Try AAPL, MSFT, NVDA…`
	};
	const fcf = seriesOf(ts, "annualFreeCashFlow");
	const fcfTrail = seriesOf(ts, "trailingFreeCashFlow");
	const fcfHistory = (fcf.length >= 2 ? fcf : fcfTrail).map((x) => x.v);
	if (fcfHistory.length < 2) return {
		ok: false,
		error: `FCF history too short for ${ticker}.`
	};
	const netDebtS = seriesOf(ts, "annualNetDebt");
	const debtS = seriesOf(ts, "annualTotalDebt");
	const cashS = seriesOf(ts, "annualCashAndCashEquivalents");
	const intS = seriesOf(ts, "annualInterestExpense");
	const sharesS = seriesOf(ts, "annualShareIssued");
	const mcapS = seriesOf(ts, "trailingMarketCap");
	const niS = seriesOf(ts, "annualNetIncome");
	const revS = seriesOf(ts, "annualTotalRevenue");
	const gpS = seriesOf(ts, "annualGrossProfit");
	const opS = seriesOf(ts, "annualOperatingIncome");
	const eqS = seriesOf(ts, "annualStockholdersEquity");
	const taS = seriesOf(ts, "annualTotalAssets");
	const caS = seriesOf(ts, "annualCurrentAssets");
	const clS = seriesOf(ts, "annualCurrentLiabilities");
	const ltdS = seriesOf(ts, "annualLongTermDebt");
	const ocfS = seriesOf(ts, "annualOperatingCashFlow");
	const epsS = seriesOf(ts, "trailingEps");
	const rf = parseYield(tnx?.last ?? 4.12);
	const rm = gspc && gspc.px.length > 2 ? (gspc.px.at(-1).v / gspc.px[0].v) ** (1 / 10) - 1 : .09;
	const beta = spy ? betaOf(chart.px, spy.px) : 1;
	const shares = lastOf(sharesS) || 1e9;
	const marketCap = lastOf(mcapS) || chart.last * shares;
	const totalDebt = lastOf(debtS) || 0;
	const cash = lastOf(cashS) || 0;
	const netDebt = Number.isFinite(lastOf(netDebtS)) ? lastOf(netDebtS) : totalDebt - cash;
	const snap = (iFromEnd) => {
		const at = (s) => s.at(s.length - 1 - iFromEnd)?.v;
		return {
			ni: at(niS),
			assets: at(taS),
			ocf: at(ocfS),
			ltd: at(ltdS),
			ca: at(caS),
			cl: at(clS),
			gp: at(gpS),
			rev: at(revS),
			shares: at(sharesS)
		};
	};
	return {
		ok: true,
		packet: {
			ticker,
			price: chart.last,
			px: chart.px,
			fcfHistory,
			netDebt,
			shares,
			beta,
			rf,
			rm,
			marketCap,
			totalDebt,
			interest: Math.abs(lastOf(intS) || 0),
			taxRate: .21,
			revenue: lastOf(revS),
			gp: lastOf(gpS),
			opInc: lastOf(opS),
			ni: lastOf(niS),
			equity: lastOf(eqS),
			assets: lastOf(taS),
			ca: lastOf(caS),
			cl: lastOf(clS),
			cash,
			eps: lastOf(epsS),
			cur: snap(0),
			prev: snap(1),
			source: "live"
		}
	};
});
var fetchPrices_createServerFn_handler = createServerRpc({
	id: "d728ad1655e8e901133fa8a89ca17b0d6467e1636696518247e35034545b2368",
	name: "fetchPrices",
	filename: "src/lib/market-data.ts"
}, (opts) => fetchPrices.__executeServer(opts));
var fetchPrices = createServerFn({ method: "POST" }).validator((d) => d).handler(fetchPrices_createServerFn_handler, async ({ data }) => {
	const tickers = data.tickers.map((t) => t.trim().toUpperCase()).filter(Boolean).slice(0, 12);
	const range = data.range ?? "3y";
	const pairs = await Promise.all(tickers.map(async (t) => [t, await yahooChart(t, range)]));
	const series = {};
	for (const [t, p] of pairs) if (p) series[t] = p.px;
	if (!Object.keys(series).length) return {
		ok: false,
		error: "Yahoo chart empty."
	};
	return {
		ok: true,
		series
	};
});
var fetchCongressTape_createServerFn_handler = createServerRpc({
	id: "c01b34ecf5f59b56070435c353a8744c40c3ca0ead9d3aba4656cdad90bf202f",
	name: "fetchCongressTape",
	filename: "src/lib/market-data.ts"
}, (opts) => fetchCongressTape.__executeServer(opts));
var fetchCongressTape = createServerFn({ method: "POST" }).handler(fetchCongressTape_createServerFn_handler, async () => {
	return {
		trades: CONGRESS_CACHE,
		live: false
	};
});
//#endregion
export { fetchCongressTape_createServerFn_handler, fetchFundamentals_createServerFn_handler, fetchPrices_createServerFn_handler };
