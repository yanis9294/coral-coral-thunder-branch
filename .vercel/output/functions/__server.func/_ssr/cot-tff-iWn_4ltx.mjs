import { B as mulberry32, E as dayKey, F as hashStr, G as rollingMax, H as normCdf, J as rollingStd, K as rollingMean, M as garchT, R as invNorm, q as rollingMin, x as clamp } from "./shell-B4EHQ9b6.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/cot-tff-iWn_4ltx.js
var CCYS = [
	{
		ccy: "USD",
		country: "United States"
	},
	{
		ccy: "EUR",
		country: "Euro area"
	},
	{
		ccy: "GBP",
		country: "United Kingdom"
	},
	{
		ccy: "JPY",
		country: "Japan"
	},
	{
		ccy: "CAD",
		country: "Canada"
	},
	{
		ccy: "AUD",
		country: "Australia"
	},
	{
		ccy: "NZD",
		country: "New Zealand"
	},
	{
		ccy: "CHF",
		country: "Switzerland"
	}
];
var MACROS = [
	{
		name: "Payrolls",
		domain: "Labor",
		tier: "T3",
		hour: 12.5,
		unit: "k",
		base: 165,
		sigma: 42,
		related: [
			"DXY",
			"US2Y",
			"SPX"
		],
		beatMove: 18,
		missMove: -22
	},
	{
		name: "Unemployment",
		domain: "Labor",
		tier: "T2",
		hour: 12.5,
		unit: "%",
		base: 4.2,
		sigma: .12,
		related: ["DXY", "US2Y"],
		beatMove: -8,
		missMove: 10
	},
	{
		name: "AHE",
		domain: "Labor",
		tier: "T2",
		hour: 12.5,
		unit: "% m/m",
		base: .3,
		sigma: .08,
		related: ["US2Y", "DXY"],
		beatMove: 12,
		missMove: -9
	},
	{
		name: "CPI",
		domain: "Inflation",
		tier: "T3",
		hour: 12.5,
		unit: "% y/y",
		base: 2.6,
		sigma: .12,
		related: [
			"DXY",
			"US10Y",
			"XAU"
		],
		beatMove: 22,
		missMove: -18
	},
	{
		name: "Core CPI",
		domain: "Inflation",
		tier: "T3",
		hour: 12.5,
		unit: "% y/y",
		base: 2.9,
		sigma: .1,
		related: ["US2Y", "DXY"],
		beatMove: 24,
		missMove: -20
	},
	{
		name: "Core PCE",
		domain: "Inflation",
		tier: "T3",
		hour: 12.5,
		unit: "% y/y",
		base: 2.7,
		sigma: .09,
		related: ["US2Y", "BBDXY"],
		beatMove: 16,
		missMove: -14
	},
	{
		name: "GDP",
		domain: "Growth",
		tier: "T3",
		hour: 12.5,
		unit: "% q/q saar",
		base: 2.1,
		sigma: .4,
		related: ["SPX", "DXY"],
		beatMove: 10,
		missMove: -12
	},
	{
		name: "PMI mfg",
		domain: "Growth",
		tier: "T2",
		hour: 8,
		unit: "idx",
		base: 49.4,
		sigma: 1.1,
		related: ["SPX", "USDJPY"],
		beatMove: 8,
		missMove: -7
	},
	{
		name: "Retail sales",
		domain: "Growth",
		tier: "T2",
		hour: 12.5,
		unit: "% m/m",
		base: .3,
		sigma: .35,
		related: ["SPX", "DXY"],
		beatMove: 9,
		missMove: -11
	},
	{
		name: "CPI flash",
		domain: "Inflation",
		tier: "T3",
		hour: 9,
		unit: "% y/y",
		base: 2.2,
		sigma: .14,
		related: ["EURUSD", "DE10Y"],
		beatMove: 14,
		missMove: -12
	},
	{
		name: "Policy decision",
		domain: "Policy",
		tier: "T3",
		hour: 18,
		unit: "%",
		base: 4.25,
		sigma: .125,
		related: [
			"SOFR",
			"DXY",
			"SPX"
		],
		beatMove: 6,
		missMove: -16
	},
	{
		name: "Trade balance",
		domain: "External",
		tier: "T1",
		hour: 12.5,
		unit: "$bn",
		base: -68,
		sigma: 8,
		related: ["DXY"],
		beatMove: 4,
		missMove: -3
	},
	{
		name: "ISM services",
		domain: "Growth",
		tier: "T2",
		hour: 14,
		unit: "idx",
		base: 52.1,
		sigma: 1.2,
		related: ["SPX"],
		beatMove: 7,
		missMove: -8
	},
	{
		name: "Jobless claims",
		domain: "Labor",
		tier: "T2",
		hour: 12.5,
		unit: "k",
		base: 228,
		sigma: 12,
		related: ["US2Y"],
		beatMove: -5,
		missMove: 6
	}
];
function roundTo(n, unit) {
	if (unit === "k" || unit === "$bn" || unit === "idx") return +n.toFixed(1);
	if (unit === "%") return +n.toFixed(2);
	return +n.toFixed(2);
}
function macroCalendar(asOf) {
	const out = [];
	let n = 0;
	for (let d = -14; d < 21; d++) CCYS.forEach((c, ci) => {
		const r = mulberry32(hashStr(c.ccy) ^ dayKey(asOf + d * 864e5) ^ ci + 3);
		if (r() > .18) return;
		const m = MACROS[Math.floor(r() * MACROS.length)];
		const ts = asOf + d * 864e5 + m.hour * 36e5;
		const past = ts < asOf;
		const bias = (r() - .48) * .35;
		const consensus = roundTo(m.base + (r() - .5) * m.sigma * .4, m.unit);
		const previous = roundTo(m.base + (r() - .5) * m.sigma * .8, m.unit);
		const high = roundTo(consensus + 1.2816 * m.sigma, m.unit);
		const low = roundTo(consensus - 1.2816 * m.sigma, m.unit);
		const pBeat = +clamp(.5 + bias, .12, .88).toFixed(2);
		const pMiss = +clamp(1 - pBeat - .18, .08, .7).toFixed(2);
		const pInline = +(1 - pBeat - pMiss).toFixed(2);
		const zHigh = (high - consensus) / m.sigma;
		const zLow = (low - consensus) / m.sigma;
		const pAboveHigh = +(1 - normCdf(zHigh - bias)).toFixed(3);
		const pBelowLow = +normCdf(zLow - bias).toFixed(3);
		const surprise = past ? (r() - .48 + bias) * 2.2 : void 0;
		const actual = past && surprise !== void 0 ? roundTo(consensus + surprise * m.sigma, m.unit) : void 0;
		out.push({
			id: `mac-${n++}`,
			ts,
			country: c.country,
			ccy: c.ccy,
			name: m.name,
			tier: m.tier,
			domain: m.domain,
			unit: m.unit,
			consensus,
			previous,
			actual,
			surpriseZ: surprise !== void 0 ? +surprise.toFixed(2) : void 0,
			high,
			low,
			pBeat,
			pMiss,
			pInline,
			pAboveHigh,
			pBelowLow,
			histBeatMove: m.beatMove,
			histMissMove: m.missMove,
			histN: 12 + Math.floor(r() * 14),
			related: m.related,
			weight: m.tier === "T3" ? 3 : m.tier === "T2" ? 2 : 1
		});
	});
	return out.sort((a, b) => a.ts - b.ts);
}
function scorecards(asOf) {
	const regimes = [
		"RE-ACCEL",
		"COOLING",
		"BOTTOMING",
		"WORSENING"
	];
	return CCYS.map((c) => {
		const r = mulberry32(hashStr(c.ccy) ^ dayKey(asOf) ^ 99);
		return {
			ccy: c.ccy,
			country: c.country,
			beatZ: +((r() - .4) * 1.4).toFixed(2),
			missZ: +((r() - .6) * 1.2).toFixed(2),
			beatPct: +clamp(40 + (r() - .5) * 40, 15, 85).toFixed(0),
			momentum: +((r() - .5) * 2).toFixed(2),
			streak: Math.floor((r() - .5) * 6),
			regime: regimes[Math.floor(r() * 4)]
		};
	});
}
function impactWindow(cals, asOf) {
	const days = [];
	for (let i = 0; i < 14; i++) {
		const start = asOf + i * 864e5;
		const end = start + 864e5;
		const w = cals.filter((c) => c.ts >= start && c.ts < end).reduce((s, c) => s + c.weight, 0);
		const dt = new Date(start);
		days.push({
			d: i,
			w,
			label: dt.toLocaleDateString("en-GB", {
				weekday: "short",
				day: "2-digit",
				timeZone: "UTC"
			})
		});
	}
	return days;
}
function printHistory(rel, asOf) {
	const out = [];
	for (let k = rel.histN; k >= 1; k--) {
		const r = mulberry32(hashStr(rel.ccy + rel.name) ^ dayKey(asOf) - k * 30);
		const z = (r() - .48) * 2.1;
		const actual = rel.consensus + z * (Math.abs(rel.high - rel.low) / 2.5632);
		const move = z >= 0 ? rel.histBeatMove * (.6 + r() * .8) * (z / 1.2) : rel.histMissMove * (.6 + r() * .8) * (-z / 1.2);
		out.push({
			i: rel.histN - k,
			actual: +actual.toFixed(2),
			consensus: rel.consensus,
			z: +z.toFixed(2),
			move: +move.toFixed(1)
		});
	}
	return out;
}
function impliedMove(rel) {
	const zBeat = invNorm(1 - rel.pBeat);
	return {
		expectedAbs: +(rel.pBeat * Math.abs(rel.histBeatMove) + rel.pMiss * Math.abs(rel.histMissMove)).toFixed(1),
		skewed: rel.pBeat - rel.pMiss,
		zForHigh: zBeat
	};
}
function rngFrom(seed) {
	return mulberry32(seed >>> 0);
}
/** Port of quantdesk.cot.synthetic_cot_market */
function syntheticCotMarket(nWeeks = 520, edge = .12, seed = 11, annVol = .09, endTs = Date.parse("2026-09-15T00:00:00Z")) {
	const rng = rngFrom(seed);
	const nDays = nWeeks * 5;
	const dVol = annVol / Math.sqrt(252);
	const shocks = garchT(nDays, dVol ** 2 * .02, .06, .92, 6, rng);
	const ret = new Array(nDays).fill(0);
	const net = new Array(nWeeks).fill(0);
	const histNet = [];
	for (let w = 0; w < nWeeks; w++) {
		const past = w > 0 ? ret.slice(Math.max(0, w * 5 - 65), w * 5).reduce((s, x) => s + x, 0) : 0;
		const prev = w > 0 ? net[w - 1] : 0;
		net[w] = .85 * prev + .15 * Math.tanh(past / (dVol * Math.sqrt(65)) / 2) * .35 + (rng() - .5) * .024;
		histNet.push(net[w]);
		const h = histNet.slice(-156);
		const m = h.reduce((s, x) => s + x, 0) / h.length;
		const sd = Math.sqrt(h.reduce((s, x) => s + (x - m) ** 2, 0) / Math.max(1, h.length - 1));
		const z = h.length > 26 && sd > 0 ? (net[w] - m) / sd : 0;
		const drift = -edge * Math.max(-3, Math.min(3, z)) * dVol * .35;
		for (let k = 0; k < 5; k++) ret[w * 5 + k] = shocks[w * 5 + k] + drift;
	}
	const firstTue = tuesdayOnOrBefore(endTs) - (nWeeks - 1) * 7 * 864e5;
	const pxSeries = [];
	let px = 100;
	for (let w = 0; w < nWeeks; w++) {
		const tue = firstTue + w * 7 * 864e5;
		for (let k = 0; k < 5; k++) {
			const t = tue - 864e5 + k * 864e5;
			px *= 1 + ret[w * 5 + k];
			pxSeries.push({
				t,
				v: px
			});
		}
	}
	const tff = [];
	for (let w = 0; w < nWeeks; w++) {
		const tue = firstTue + w * 7 * 864e5;
		const oi = 25e4 * (1 + .15 * Math.sin(w / 30)) * Math.exp((rng() - .5) * .04);
		const dealerNet = -.7 * net[w] + (rng() - .5) * .02;
		const amNet = .25 * net[w] + .05 * Math.sin(w / 60) + (rng() - .5) * .02;
		const legs = (base, nt) => [base + nt / 2, base - nt / 2];
		const [ll, ls] = legs(.22, net[w]);
		const [dl, ds] = legs(.33, dealerNet);
		const [al, as_] = legs(.27, amNet);
		tff.push({
			date: tue,
			oi,
			lf_long: ll * oi,
			lf_short: ls * oi,
			dealer_long: dl * oi,
			dealer_short: ds * oi,
			am_long: al * oi,
			am_short: as_ * oi,
			oth_long: .1 * oi,
			oth_short: .1 * oi
		});
	}
	return {
		px: pxSeries,
		tff
	};
}
function tuesdayOnOrBefore(ts) {
	const d = new Date(ts);
	d.setUTCHours(0, 0, 0, 0);
	const back = (d.getUTCDay() + 7 - 2) % 7;
	return d.getTime() - back * 864e5;
}
function cotIndex(x, n) {
	const lo = rollingMin(x, n, Math.floor(n / 2));
	const hi = rollingMax(x, n, Math.floor(n / 2));
	return x.map((v, i) => {
		const span = (hi[i] ?? NaN) - (lo[i] ?? NaN);
		if (!Number.isFinite(span) || span === 0) return NaN;
		return (v - lo[i]) / span;
	});
}
function buildFeatures(t) {
	const net_lf = t.map((w) => (w.lf_long - w.lf_short) / w.oi * 100);
	const net_dealer = t.map((w) => (w.dealer_long - w.dealer_short) / w.oi * 100);
	const net_am = t.map((w) => (w.am_long - w.am_short) / w.oi * 100);
	const net_oth = t.map((w) => (w.oth_long - w.oth_short) / w.oi * 100);
	const net_cot = net_lf.map((v, i) => v - net_dealer[i]);
	const gross_lf = t.map((w) => (w.lf_long + w.lf_short) / w.oi * 100);
	const series = {
		lf: net_lf,
		dealer: net_dealer,
		am: net_am,
		cot: net_cot
	};
	const idx = {};
	const z = {};
	const d4 = {};
	const d13 = {};
	for (const k of Object.keys(series)) {
		const s = series[k];
		idx[k] = cotIndex(s, 156);
		const mu = rollingMean(s, 156);
		const sd = rollingStd(s, 156);
		z[k] = s.map((v, i) => sd[i] && sd[i] !== 0 ? (v - mu[i]) / sd[i] : NaN);
		d4[k] = s.map((v, i) => i >= 4 ? v - s[i - 4] : NaN);
		d13[k] = s.map((v, i) => i >= 13 ? v - s[i - 13] : NaN);
	}
	return t.map((w, i) => ({
		date: w.date,
		net_lf: net_lf[i],
		net_dealer: net_dealer[i],
		net_am: net_am[i],
		net_oth: net_oth[i],
		net_cot: net_cot[i],
		gross_lf: gross_lf[i],
		idx_lf: idx.lf[i],
		idx_dealer: idx.dealer[i],
		idx_am: idx.am[i],
		idx_cot: idx.cot[i],
		z_lf: z.lf[i],
		z_dealer: z.dealer[i],
		z_am: z.am[i],
		z_cot: z.cot[i],
		d4_lf: d4.lf[i],
		d13_lf: d13.lf[i],
		d4_cot: d4.cot[i],
		d13_cot: d13.cot[i],
		lf_am_div: (z.lf[i] ?? 0) - (z.am[i] ?? 0)
	}));
}
function sigExtreme(idx, hi = .85, lo = .15, contrarian = true) {
	if (!Number.isFinite(idx)) return 0;
	let s = 0;
	if (idx >= hi) s = -1;
	else if (idx <= lo) s = 1;
	return contrarian ? s : -s;
}
function availabilityDate(reportTue, releaseLag = 3) {
	return reportTue + releaseLag * 864e5;
}
/** exec_lag=2 → Monday close after Friday 15:30 ET publication. */
function tradableDate(reportTue, execLag = 2, releaseLag = 3) {
	return availabilityDate(reportTue, releaseLag) + execLag * 864e5;
}
var MARKETS = [
	{
		m: "EUR",
		edge: .14,
		vol: .08,
		cls: "Forex"
	},
	{
		m: "GBP",
		edge: .1,
		vol: .09,
		cls: "Forex"
	},
	{
		m: "AUD",
		edge: .11,
		vol: .1,
		cls: "Forex"
	},
	{
		m: "NZD",
		edge: .09,
		vol: .11,
		cls: "Forex"
	},
	{
		m: "JPY",
		edge: .12,
		vol: .09,
		cls: "Forex"
	},
	{
		m: "CAD",
		edge: .08,
		vol: .08,
		cls: "Forex"
	},
	{
		m: "CHF",
		edge: .07,
		vol: .08,
		cls: "Forex"
	},
	{
		m: "MXN",
		edge: .18,
		vol: .12,
		cls: "Forex"
	},
	{
		m: "ES",
		edge: .06,
		vol: .16,
		cls: "Index"
	},
	{
		m: "NQ",
		edge: .05,
		vol: .2,
		cls: "Index"
	},
	{
		m: "TY",
		edge: .09,
		vol: .07,
		cls: "Rates"
	},
	{
		m: "FF",
		edge: .04,
		vol: .04,
		cls: "Rates"
	},
	{
		m: "GC",
		edge: .13,
		vol: .14,
		cls: "Metals"
	},
	{
		m: "CL",
		edge: .16,
		vol: .28,
		cls: "Energy"
	},
	{
		m: "NG",
		edge: .07,
		vol: .45,
		cls: "Energy"
	},
	{
		m: "BTC",
		edge: .04,
		vol: .55,
		cls: "Crypto"
	}
];
var cache = /* @__PURE__ */ new Map();
function marketPath(market, asOf) {
	const spec = MARKETS.find((x) => x.m === market);
	if (!spec) return null;
	const key = `${market}`;
	let hit = cache.get(key);
	if (!hit) {
		const seed = (hashStr(market) ^ 11) >>> 0;
		const { px, tff } = syntheticCotMarket(520, spec.edge, seed, spec.vol);
		hit = {
			px,
			feat: buildFeatures(tff)
		};
		cache.set(key, hit);
	}
	const last = hit.feat.filter((f) => f.date <= asOf).at(-1) ?? hit.feat.at(-1);
	return {
		...hit,
		last,
		spec
	};
}
function cotTffRows(asOf) {
	return MARKETS.map((spec) => {
		const path = marketPath(spec.m, asOf);
		const last = path.last;
		const idx = last.idx_lf;
		const sig = sigExtreme(idx);
		let extreme = "—";
		if (idx >= .9) extreme = "CRWD LONG";
		else if (idx <= .1) extreme = "CRWD SHORT";
		else if (idx >= .85) extreme = "LONG";
		else if (idx <= .15) extreme = "SHORT";
		const px = path.px.filter((p) => p.t <= asOf).at(-1)?.v ?? 100;
		return {
			market: spec.m,
			cls: spec.cls,
			last,
			extreme,
			sig,
			px: +px.toFixed(spec.m === "JPY" ? 1 : 3),
			source: "synthetic",
			reportTue: last.date,
			publishFri: availabilityDate(last.date),
			tradable: tradableDate(last.date)
		};
	});
}
function cotFeatureHistory(market, asOf, years) {
	const path = marketPath(market, asOf);
	if (!path) return [];
	const n = years * 52;
	return path.feat.filter((f) => f.date <= asOf).slice(-n).map((f, i) => ({
		w: i,
		net: +f.net_cot.toFixed(2),
		lf: +f.net_lf.toFixed(2),
		dealer: +f.net_dealer.toFixed(2),
		idx: Number.isFinite(f.idx_lf) ? +(f.idx_lf * 100).toFixed(1) : 50,
		z: Number.isFinite(f.z_lf) ? +f.z_lf.toFixed(2) : 0
	}));
}
function cotTimingCopy(asOf) {
	const tue = tuesdayOnOrBefore(asOf);
	return {
		reportTue: tue,
		publishFri: availabilityDate(tue),
		tradable: tradableDate(tue),
		note: "CFTC TFF: positions as-of Tuesday, published Friday 15:30 ET. Default exec_lag=2 uses Monday close — never Tuesday (look-ahead of 3 days)."
	};
}
function cotTffPulse(rows) {
	return [
		"Forex",
		"Metals",
		"Energy",
		"Index",
		"Rates",
		"Crypto"
	].map((cls) => {
		const xs = rows.filter((r) => r.cls === cls);
		return {
			cls,
			crowding: +(xs.reduce((s, r) => s + ((Number.isFinite(r.last.idx_lf) ? r.last.idx_lf : .5) - .5) * 100, 0) / Math.max(1, xs.length)).toFixed(1)
		};
	});
}
//#endregion
export { impactWindow as a, printHistory as c, cotTimingCopy as i, scorecards as l, cotTffPulse as n, impliedMove as o, cotTffRows as r, macroCalendar as s, cotFeatureHistory as t };
