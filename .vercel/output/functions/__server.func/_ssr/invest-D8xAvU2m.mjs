import { i as __toESM } from "../_runtime.mjs";
import { C as require_jsx_runtime, Z as require_react, x as useNavigate } from "../_libs/@tanstack/react-router+[...].mjs";
import { C as cn, V as newUserThesis, X as stdev, k as fmtPct, tt as useTerminal, z as mean } from "./shell-B4EHQ9b6.mjs";
import { n as IntelPage } from "./page-Crv803Pc.mjs";
import { i as BoundScatter, n as BoundBar, t as BoundArea } from "./chart-BfgsPjdW.mjs";
import { t as createServerFn } from "./ssr.mjs";
import { t as createSsrRpc } from "./createSsrRpc-C1p7zOu_.mjs";
import { i as tickerSentiment, n as amountMid, r as disclosureLag } from "./congress-BroZzhmq.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/invest-D8xAvU2m.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
/**
* Port of vendor/invest/dcf_model.py — DCF, WACC/CAPM, Gordon, Piotroski, Graham.
* Live financials come from Yahoo timeseries when the server can reach it;
* otherwise a dated cache. Look-ahead: beta/price are current, FCF is historical.
*/
function safeDiv(a, b) {
	if (a == null || b == null || !Number.isFinite(a) || !Number.isFinite(b) || b === 0) return NaN;
	return a / b;
}
function cagr(start, end, periods) {
	if (!(start > 0) || !Number.isFinite(end) || !periods) return null;
	return (end / start) ** (1 / periods) - 1;
}
function projectFcf(history, years = 5, growth) {
	const values = history.filter((v) => Number.isFinite(v));
	let g = growth;
	if (g == null) {
		if (values.some((v) => v <= 0)) {
			const yoy = [];
			for (let i = 1; i < values.length; i++) yoy.push((values[i] - values[i - 1]) / Math.abs(values[i - 1]));
			g = Math.max(-.5, Math.min(.5, mean(yoy)));
		} else {
			const raw = cagr(values[0], values[values.length - 1], values.length - 1);
			g = raw == null ? .03 : Math.max(-.5, Math.min(.5, raw));
		}
	}
	const last = values[values.length - 1] ?? 0;
	return {
		projected: Array.from({ length: years }, (_, i) => last * (1 + g) ** (i + 1)),
		g
	};
}
function dcfIntrinsic(opts) {
	const { fcf, wacc, terminalG, netDebt, shares } = opts;
	if (wacc <= terminalG) throw new Error(`WACC (${(wacc * 100).toFixed(2)}%) must exceed terminal g (${(terminalG * 100).toFixed(2)}%).`);
	const pv = fcf.map((v, i) => v / (1 + wacc) ** (i + 1));
	const pvTerm = fcf[fcf.length - 1] * (1 + terminalG) / (wacc - terminalG) / (1 + wacc) ** fcf.length;
	const ev = pv.reduce((s, x) => s + x, 0) + pvTerm;
	const equity = ev - netDebt;
	return {
		ev,
		equity,
		perShare: equity / shares,
		pvFcf: pv.reduce((s, x) => s + x, 0),
		pvTerm
	};
}
function recommendation(intrinsic, price, margin = .05) {
	if (intrinsic * (1 - margin) > price) return "BUY";
	if (intrinsic * (1 + margin) < price) return "SELL";
	return "HOLD";
}
function grahamNumber(eps, book) {
	if (!(eps > 0) || !(book > 0)) return null;
	return Math.sqrt(22.5 * eps * book);
}
function runDcf(inp, source = "cache") {
	const years = inp.years ?? 5;
	const { projected, g } = projectFcf(inp.fcfHistory, years, inp.fcfG);
	const kd = inp.totalDebt > 0 ? Math.max(0, safeDiv(Math.abs(inp.interest), inp.totalDebt) || .04) : 0;
	const ke = inp.rf + inp.beta * (inp.rm - inp.rf);
	const total = inp.marketCap + Math.max(0, inp.totalDebt);
	const we = total > 0 ? inp.marketCap / total : 1;
	const wd = 1 - we;
	const tax = Number.isFinite(inp.taxRate) ? inp.taxRate : .21;
	const wacc = we * ke + wd * kd * (1 - tax);
	let tg = inp.terminalG;
	if (tg == null) tg = Math.min(.04, wacc - .005);
	if (tg >= wacc) tg = wacc - .005;
	const d = dcfIntrinsic({
		fcf: projected,
		wacc,
		terminalG: tg,
		netDebt: inp.netDebt,
		shares: inp.shares
	});
	const mos = (d.perShare - inp.price) / inp.price;
	return {
		ticker: inp.ticker,
		price: inp.price,
		intrinsic: d.perShare,
		mos,
		wacc,
		ke,
		kd,
		tax,
		fcfG: g,
		terminalG: tg,
		netDebt: inp.netDebt,
		shares: inp.shares,
		beta: inp.beta,
		rf: inp.rf,
		rm: inp.rm,
		projected,
		rec: recommendation(d.perShare, inp.price),
		source
	};
}
function ratiosFrom(inp) {
	const book = safeDiv(inp.equity, inp.shares);
	const eps = inp.eps ?? NaN;
	return {
		ticker: inp.ticker,
		price: inp.price,
		marketCap: inp.marketCap,
		grossMargin: safeDiv(inp.gp, inp.revenue),
		opMargin: safeDiv(inp.opInc, inp.revenue),
		netMargin: safeDiv(inp.ni, inp.revenue),
		roe: safeDiv(inp.ni, inp.equity),
		leverage: safeDiv(inp.assets, inp.equity),
		currentRatio: safeDiv(inp.ca, inp.cl),
		pe: safeDiv(inp.price, eps),
		pb: safeDiv(inp.marketCap, inp.equity),
		ps: safeDiv(inp.marketCap, inp.revenue),
		graham: grahamNumber(eps, book),
		book,
		eps,
		piotroski: inp.piotroski ?? null
	};
}
/** Piotroski F (0–9) from two annual snapshots. */
function piotroski(cur, prev) {
	const roaC = safeDiv(cur.ni, cur.assets);
	const roaP = safeDiv(prev.ni, prev.assets);
	const crC = safeDiv(cur.ca, cur.cl);
	const crP = safeDiv(prev.ca, prev.cl);
	const gmC = safeDiv(cur.gp, cur.rev);
	const gmP = safeDiv(prev.gp, prev.rev);
	const atC = safeDiv(cur.rev, cur.assets);
	const atP = safeDiv(prev.rev, prev.assets);
	return [
		cur.ni != null && cur.ni > 0,
		cur.ocf != null && cur.ocf > 0,
		Number.isFinite(roaC) && Number.isFinite(roaP) && roaC > roaP,
		cur.ocf != null && cur.ni != null && cur.ocf > cur.ni,
		(cur.ltd ?? 0) <= (prev.ltd ?? 0),
		Number.isFinite(crC) && Number.isFinite(crP) && crC > crP,
		cur.shares != null && prev.shares != null && cur.shares <= prev.shares,
		Number.isFinite(gmC) && Number.isFinite(gmP) && gmC > gmP,
		Number.isFinite(atC) && Number.isFinite(atP) && atC > atP
	].filter(Boolean).length;
}
/**
* Port of vendor/invest/portfolio_optimization.py
* Monte Carlo frontier, max-Sharpe / min-vol on the simplex, equal-weight,
* walk-forward (no look-ahead), backtest metrics. No scipy/cvxpy/PyPortfolioOpt.
*/
function pctReturns(prices) {
	const n = prices[0]?.length ?? 0;
	const k = prices.length;
	const out = Array.from({ length: k }, () => []);
	for (let t = 1; t < n; t++) for (let i = 0; i < k; i++) {
		const a = prices[i][t - 1];
		const b = prices[i][t];
		out[i].push(a > 0 && b > 0 ? b / a - 1 : 0);
	}
	return out;
}
function annStats(rets) {
	const k = rets.length;
	const n = rets[0]?.length ?? 0;
	const avg = rets.map((r) => mean(r) * 252);
	const cov = Array.from({ length: k }, () => new Array(k).fill(0));
	const mu = rets.map(mean);
	for (let i = 0; i < k; i++) for (let j = i; j < k; j++) {
		let s = 0;
		for (let t = 0; t < n; t++) s += (rets[i][t] - mu[i]) * (rets[j][t] - mu[j]);
		const v = s / Math.max(1, n - 1) * 252;
		cov[i][j] = v;
		cov[j][i] = v;
	}
	return {
		avg,
		cov,
		n
	};
}
function portRet(w, avg) {
	return w.reduce((s, x, i) => s + x * avg[i], 0);
}
function portVol(w, cov) {
	let s = 0;
	for (let i = 0; i < w.length; i++) for (let j = 0; j < w.length; j++) s += w[i] * w[j] * cov[i][j];
	return Math.sqrt(Math.max(0, s));
}
function simplex(rng, k) {
	const x = Array.from({ length: k }, () => -Math.log(Math.max(1e-12, rng())));
	const s = x.reduce((a, b) => a + b, 0);
	return x.map((v) => v / s);
}
function monteCarlo(avg, cov, n = 4e3, rf = 0, seed = 42) {
	let a = seed >>> 0;
	const rng = () => {
		a += 1831565813;
		let t = a;
		t = Math.imul(t ^ t >>> 15, t | 1);
		t ^= t + Math.imul(t ^ t >>> 7, t | 61);
		return ((t ^ t >>> 14) >>> 0) / 4294967296;
	};
	const rows = [];
	const weights = [];
	for (let i = 0; i < n; i++) {
		const w = simplex(rng, avg.length);
		const r = portRet(w, avg);
		const v = portVol(w, cov);
		rows.push({
			ret: r,
			vol: v,
			sharpe: v > 0 ? (r - rf) / v : 0
		});
		weights.push(w);
	}
	return {
		rows,
		weights
	};
}
function bestSharpe(mc) {
	let i = 0;
	for (let k = 1; k < mc.rows.length; k++) if (mc.rows[k].sharpe > mc.rows[i].sharpe) i = k;
	return {
		i,
		...mc.rows[i],
		w: mc.weights[i]
	};
}
function minVol(mc) {
	let i = 0;
	for (let k = 1; k < mc.rows.length; k++) if (mc.rows[k].vol < mc.rows[i].vol) i = k;
	return {
		i,
		...mc.rows[i],
		w: mc.weights[i]
	};
}
function equalWeight(k) {
	return Array.from({ length: k }, () => 1 / k);
}
function backtestMetrics(rets, rf = 0) {
	const n = rets.length;
	if (!n) return {
		cagr: NaN,
		vol: NaN,
		sharpe: NaN,
		sortino: NaN,
		maxDd: NaN,
		calmar: NaN
	};
	let wealth = 1;
	let peak = 1;
	let maxDd = 0;
	const path = [];
	for (const r of rets) {
		wealth *= 1 + r;
		peak = Math.max(peak, wealth);
		maxDd = Math.min(maxDd, wealth / peak - 1);
		path.push(wealth);
	}
	const years = n / 252;
	const cagr_ = years > 0 ? path[path.length - 1] ** (1 / years) - 1 : NaN;
	const vol = stdev(rets) * Math.sqrt(252);
	const sharpe = vol ? (mean(rets) * 252 - rf) / vol : NaN;
	const down = rets.filter((r) => r < 0);
	const dvol = down.length ? stdev(down) * Math.sqrt(252) : NaN;
	const sortino = dvol ? (mean(rets) * 252 - rf) / dvol : NaN;
	const calmar = maxDd ? cagr_ / Math.abs(maxDd) : NaN;
	return {
		cagr: cagr_,
		vol,
		sharpe,
		sortino,
		maxDd,
		calmar,
		path
	};
}
/** Walk-forward: optimize on the trailing window only, hold until next rebalance. */
function walkForward(rets, lookback = 252, every = 21, rf = 0) {
	const n = rets[0]?.length ?? 0;
	const k = rets.length;
	const out = [];
	let w = equalWeight(k);
	for (let t = lookback; t < n; t++) {
		if ((t - lookback) % every === 0) {
			const { avg, cov } = annStats(rets.map((r) => r.slice(t - lookback, t)));
			w = bestSharpe(monteCarlo(avg, cov, 1200, rf, t)).w;
		}
		out.push(w.reduce((s, x, i) => s + x * rets[i][t], 0));
	}
	return out;
}
function alignedCloses(series) {
	if (!series.length) return [];
	const maps = series.map((s) => {
		const m = /* @__PURE__ */ new Map();
		for (const p of s) m.set(new Date(p.t).toISOString().slice(0, 10), p.v);
		return m;
	});
	return [...maps[0].keys()].filter((d) => maps.every((m) => m.has(d) && (m.get(d) ?? 0) > 0)).sort().map((d) => ({
		t: Date.parse(d + "T00:00:00Z"),
		px: maps.map((m) => m.get(d))
	}));
}
var fetchFundamentals = createServerFn({ method: "POST" }).validator((d) => d).handler(createSsrRpc("db955a0490cf7be5879448950cc18558f4a819f2056ce4f728a75e3c12de5c4c"));
var fetchPrices = createServerFn({ method: "POST" }).validator((d) => d).handler(createSsrRpc("d728ad1655e8e901133fa8a89ca17b0d6467e1636696518247e35034545b2368"));
var fetchCongressTape = createServerFn({ method: "POST" }).handler(createSsrRpc("c01b34ecf5f59b56070435c353a8744c40c3ca0ead9d3aba4656cdad90bf202f"));
function InvestView() {
	const [tab, setTab] = (0, import_react.useState)("dcf");
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(IntelPage, {
		title: "Invest",
		kicker: "DCF · Markowitz · STOCK Act — port of the desk toolkit",
		actions: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "flex gap-1",
			children: [
				"dcf",
				"book",
				"congress"
			].map((t) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
				type: "button",
				onClick: () => setTab(t),
				className: cn("h-7 px-2 font-mono text-[10px] uppercase", tab === t ? "text-fg" : "text-fg-muted"),
				children: t === "dcf" ? "DCF" : t === "book" ? "Portfolio" : "Congress"
			}, t))
		}),
		children: [
			tab === "dcf" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DcfPanel, {}),
			tab === "book" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(BookPanel, {}),
			tab === "congress" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CongressPanel, {})
		]
	});
}
function DcfPanel() {
	const nav = useNavigate();
	const add = useTerminal((s) => s.addThesis);
	const [ticker, setTicker] = (0, import_react.useState)("AAPL");
	const [years, setYears] = (0, import_react.useState)(5);
	const [gOver, setGOver] = (0, import_react.useState)("");
	const [tgOver, setTgOver] = (0, import_react.useState)("");
	const [busy, setBusy] = (0, import_react.useState)(false);
	const [err, setErr] = (0, import_react.useState)(null);
	const [pack, setPack] = (0, import_react.useState)(null);
	const [rep, setRep] = (0, import_react.useState)(null);
	const [rat, setRat] = (0, import_react.useState)(null);
	const run = async () => {
		setBusy(true);
		setErr(null);
		try {
			const r = await fetchFundamentals({ data: { ticker } });
			if (!r.ok) {
				setErr(r.error);
				return;
			}
			const p = r.packet;
			setPack(p);
			const report = runDcf({
				ticker: p.ticker,
				price: p.price,
				fcfHistory: p.fcfHistory,
				netDebt: p.netDebt,
				shares: p.shares,
				beta: p.beta,
				rf: p.rf,
				rm: p.rm,
				marketCap: p.marketCap,
				totalDebt: p.totalDebt,
				interest: p.interest,
				taxRate: p.taxRate,
				years,
				fcfG: gOver ? Number(gOver) : void 0,
				terminalG: tgOver ? Number(tgOver) : void 0
			}, p.source);
			setRep(report);
			const f = p.cur && p.prev ? piotroski(p.cur, p.prev) : null;
			setRat(ratiosFrom({
				ticker: p.ticker,
				price: p.price,
				marketCap: p.marketCap,
				shares: p.shares,
				revenue: p.revenue,
				gp: p.gp,
				opInc: p.opInc,
				ni: p.ni,
				equity: p.equity,
				assets: p.assets,
				ca: p.ca,
				cl: p.cl,
				debt: p.totalDebt,
				cash: p.cash,
				eps: p.eps,
				piotroski: f
			}));
		} catch (e) {
			setErr(e instanceof Error ? e.message : "DCF failed");
		} finally {
			setBusy(false);
		}
	};
	const saveThesis = () => {
		if (!rep) return;
		const t = newUserThesis({
			title: `${rep.ticker} DCF ${rep.rec} — IV ${rep.intrinsic.toFixed(2)} vs ${rep.price.toFixed(2)}`,
			instrument: rep.ticker,
			domain: "Equities",
			type: "Trade",
			entry: rep.price,
			target: rep.intrinsic,
			last: rep.price,
			unit: "px",
			horizon: `${years}y explicit`,
			memo: `DCF two-stage (FCF + Gordon terminal). WACC ${(rep.wacc * 100).toFixed(2)}%, FCF g ${(rep.fcfG * 100).toFixed(1)}%, terminal ${(rep.terminalG * 100).toFixed(1)}%, β ${rep.beta.toFixed(2)}. MOS ${fmtPct(rep.mos * 100)}. Source ${rep.source}. Look-ahead: beta and spot are current; FCF is historical annual.`,
			supports: [
				`Intrinsic ${rep.intrinsic.toFixed(2)}`,
				`WACC ${(rep.wacc * 100).toFixed(2)}%`,
				rat?.piotroski != null ? `Piotroski ${rat.piotroski}/9` : "F-score n/a"
			],
			cuts: [
				"Yahoo TTM is not point-in-time",
				"Terminal g is a desk choice",
				"No control premium"
			],
			changeMind: ["FCF g revised below WACC − 200bp", "Net debt jump that the model did not see"],
			analyst: "Invest · DCF",
			links: [{
				label: "Invest",
				href: "/invest"
			}]
		});
		add(t);
		nav({
			to: "/theses/$id",
			params: { id: t.id }
		});
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "p-3 md:p-4",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
				className: "text-[12px] text-fg-muted",
				children: [
					"Engine is the TypeScript port of ",
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "font-mono",
						children: "dcf_model.py"
					}),
					". Financials from Yahoo timeseries (annual FCF, net debt, shares). Price/β from the daily chart vs SPY. CAGR of ^GSPC for Rm, ^TNX for Rf."
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-3 flex flex-wrap items-end gap-2",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
						className: "flex flex-col gap-1 font-mono text-[10px] text-fg-subtle",
						children: ["Ticker", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							value: ticker,
							onChange: (e) => setTicker(e.target.value.toUpperCase()),
							className: "h-8 w-24 border border-border bg-bg-panel px-2 text-[12px] text-fg"
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
						className: "flex flex-col gap-1 font-mono text-[10px] text-fg-subtle",
						children: ["Years", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							type: "number",
							value: years,
							onChange: (e) => setYears(Number(e.target.value)),
							className: "h-8 w-16 border border-border bg-bg-panel px-2 text-[12px] text-fg"
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
						className: "flex flex-col gap-1 font-mono text-[10px] text-fg-subtle",
						children: ["FCF g override", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							value: gOver,
							onChange: (e) => setGOver(e.target.value),
							placeholder: "auto",
							className: "h-8 w-20 border border-border bg-bg-panel px-2 text-[12px] text-fg"
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
						className: "flex flex-col gap-1 font-mono text-[10px] text-fg-subtle",
						children: ["Terminal g", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							value: tgOver,
							onChange: (e) => setTgOver(e.target.value),
							placeholder: "auto",
							className: "h-8 w-20 border border-border bg-bg-panel px-2 text-[12px] text-fg"
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						onClick: () => void run(),
						disabled: busy,
						className: "h-8 rounded-sm border border-border px-3 font-mono text-[11px] hover:bg-bg-hover",
						children: busy ? "Running…" : "Run DCF"
					})
				]
			}),
			err && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-2 font-mono text-[11px] text-bear",
				children: err
			}),
			rep && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Tile, {
							k: "Price",
							v: rep.price.toFixed(2)
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Tile, {
							k: "Intrinsic",
							v: rep.intrinsic.toFixed(2)
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Tile, {
							k: "MOS",
							v: fmtPct(rep.mos * 100),
							tone: rep.mos >= 0 ? "bull" : "bear"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Tile, {
							k: "Rec",
							v: rep.rec,
							tone: rep.rec === "BUY" ? "bull" : rep.rec === "SELL" ? "bear" : void 0
						})
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("dl", {
					className: "mt-3 grid grid-cols-2 gap-2 font-mono text-[12px] sm:grid-cols-4",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(KV, {
							k: "WACC",
							v: `${(rep.wacc * 100).toFixed(2)}%`
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(KV, {
							k: "Ke / Kd",
							v: `${(rep.ke * 100).toFixed(2)} / ${(rep.kd * 100).toFixed(2)}`
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(KV, {
							k: "β / Rf / Rm",
							v: `${rep.beta.toFixed(2)} / ${(rep.rf * 100).toFixed(2)} / ${(rep.rm * 100).toFixed(1)}`
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(KV, {
							k: "g / g∞",
							v: `${(rep.fcfG * 100).toFixed(1)} / ${(rep.terminalG * 100).toFixed(1)}`
						})
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mt-4 grid gap-4 lg:grid-cols-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "h-52 overflow-hidden rounded-md border border-border bg-bg-elevated p-2",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(BoundBar, {
							data: rep.projected.map((v, i) => ({
								y: `Y${i + 1}`,
								v: v / 1e9
							})),
							xKey: "y",
							yKey: "v"
						})
					}), pack && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "h-52 overflow-hidden rounded-md border border-border bg-bg-elevated p-2",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(BoundArea, {
							data: pack.px.slice(-252).map((p, i) => ({
								d: i,
								v: p.v,
								iv: rep.intrinsic
							})),
							xKey: "d",
							yKey: "v"
						})
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-1 font-mono text-[10px] text-fg-subtle",
					children: "Left: projected FCF ($bn). Right: last 252 sessions vs model (area = spot)."
				}),
				rat && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "mt-4 overflow-x-auto",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("table", {
						className: "w-full min-w-[640px] text-left font-mono text-[12px]",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("thead", {
							className: "text-[10px] text-fg-subtle uppercase",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tr", { children: [
								"GM",
								"OM",
								"NM",
								"ROE",
								"Lev",
								"CR",
								"P/E",
								"P/B",
								"Graham",
								"F"
							].map((h) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
								className: "px-2 py-1",
								children: h
							}, h)) })
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tbody", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
							className: "border-t border-border",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
									className: "px-2 py-2",
									children: pctOrDash(rat.grossMargin)
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
									className: "px-2",
									children: pctOrDash(rat.opMargin)
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
									className: "px-2",
									children: pctOrDash(rat.netMargin)
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
									className: "px-2",
									children: pctOrDash(rat.roe)
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
									className: "px-2",
									children: numOrDash(rat.leverage)
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
									className: "px-2",
									children: numOrDash(rat.currentRatio)
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
									className: "px-2",
									children: numOrDash(rat.pe)
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
									className: "px-2",
									children: numOrDash(rat.pb)
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
									className: "px-2",
									children: rat.graham?.toFixed(1) ?? "—"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
									className: "px-2",
									children: rat.piotroski ?? "—"
								})
							]
						}) })]
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					type: "button",
					onClick: saveThesis,
					className: "mt-4 h-8 rounded-sm border border-border px-3 font-mono text-[11px] hover:bg-bg-hover",
					children: "Save as thesis"
				})
			] })
		]
	});
}
function BookPanel() {
	const [raw, setRaw] = (0, import_react.useState)("META, AMZN, AAPL, NFLX, GOOG");
	const [busy, setBusy] = (0, import_react.useState)(false);
	const [err, setErr] = (0, import_react.useState)(null);
	const [tickers, setTickers] = (0, import_react.useState)([]);
	const [avg, setAvg] = (0, import_react.useState)([]);
	const [mcRows, setMcRows] = (0, import_react.useState)([]);
	const [sh, setSh] = (0, import_react.useState)(null);
	const [mv, setMv] = (0, import_react.useState)(null);
	const [ew, setEw] = (0, import_react.useState)(null);
	const [wf, setWf] = (0, import_react.useState)(null);
	const run = async () => {
		setBusy(true);
		setErr(null);
		try {
			const ts = raw.split(/[,\s]+/).map((s) => s.trim().toUpperCase()).filter(Boolean);
			const r = await fetchPrices({ data: {
				tickers: ts,
				range: "3y"
			} });
			if (!r.ok) {
				setErr(r.error);
				return;
			}
			const aligned = alignedCloses(ts.map((t) => r.series[t] ?? []));
			if (aligned.length < 80) {
				setErr("Not enough overlapping history.");
				return;
			}
			const rets = pctReturns(ts.map((_, i) => aligned.map((row) => row.px[i])));
			const stats = annStats(rets);
			const mc = monteCarlo(stats.avg, stats.cov, 3500, 0, 7);
			const b = bestSharpe(mc);
			const m = minVol(mc);
			const ewRets = rets[0].map((_, t) => equalWeight(ts.length).reduce((s, w, i) => s + w * rets[i][t], 0));
			const wfRets = walkForward(rets, 180, 21, 0);
			setTickers(ts);
			setAvg(stats.avg);
			setMcRows(mc.rows);
			setSh(b);
			setMv(m);
			setEw(backtestMetrics(ewRets));
			setWf(backtestMetrics(wfRets));
		} catch (e) {
			setErr(e instanceof Error ? e.message : "Book failed");
		} finally {
			setBusy(false);
		}
	};
	const scatter = (0, import_react.useMemo)(() => mcRows.map((r) => ({
		x: r.vol * 100,
		y: r.ret * 100
	})), [mcRows]);
	const hi = (0, import_react.useMemo)(() => {
		const pts = [];
		if (sh) pts.push({
			x: sh.vol * 100,
			y: sh.ret * 100
		});
		if (mv) pts.push({
			x: mv.vol * 100,
			y: mv.ret * 100
		});
		return pts;
	}, [sh, mv]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "p-3 md:p-4",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
				className: "text-[12px] text-fg-muted",
				children: [
					"Port of ",
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "font-mono",
						children: "portfolio_optimization.py"
					}),
					". Monte Carlo long-only simplex (no scipy). Walk-forward uses only the trailing 180 sessions — no look-ahead."
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-3 flex flex-wrap gap-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
					value: raw,
					onChange: (e) => setRaw(e.target.value),
					className: "h-8 min-w-[240px] flex-1 border border-border bg-bg-panel px-2 font-mono text-[12px]"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					type: "button",
					onClick: () => void run(),
					disabled: busy,
					className: "h-8 rounded-sm border border-border px-3 font-mono text-[11px] hover:bg-bg-hover",
					children: busy ? "Optimising…" : "Build book"
				})]
			}),
			err && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-2 font-mono text-[11px] text-bear",
				children: err
			}),
			sh && mv && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "mt-4 h-64 overflow-hidden rounded-md border border-border bg-bg-elevated p-2",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(BoundScatter, {
						data: scatter,
						xKey: "x",
						yKey: "y",
						highlight: hi
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-1 font-mono text-[10px] text-fg-subtle",
					children: "X = ann. vol % · Y = ann. return %. Gold = max-Sharpe and min-vol."
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "mt-4 overflow-x-auto",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("table", {
						className: "w-full min-w-[520px] text-left font-mono text-[12px]",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("thead", {
							className: "text-[10px] text-fg-subtle uppercase",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", { children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
									className: "px-2 py-1",
									children: "Asset"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", { children: "E[r]" }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", { children: "Max Sharpe" }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", { children: "Min vol" }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", { children: "1/N" })
							] })
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tbody", { children: tickers.map((t, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
							className: "border-t border-border",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
									className: "px-2 py-2",
									children: t
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", { children: fmtPct(avg[i] * 100) }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", { children: fmtPct(sh.w[i] * 100, 1, false) }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", { children: fmtPct(mv.w[i] * 100, 1, false) }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", { children: fmtPct(100 / tickers.length, 1, false) })
							]
						}, t)) })]
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mt-4 grid gap-3 sm:grid-cols-2",
					children: [ew && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(MetricCard, {
						title: "Equal weight (in-sample)",
						m: ew
					}), wf && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(MetricCard, {
						title: "Walk-forward max-Sharpe",
						m: wf
					})]
				})
			] })
		]
	});
}
function CongressPanel() {
	const nav = useNavigate();
	const add = useTerminal((s) => s.addThesis);
	const [trades, setTrades] = (0, import_react.useState)([]);
	const [live, setLive] = (0, import_react.useState)(false);
	const [busy, setBusy] = (0, import_react.useState)(false);
	const [ticker, setTicker] = (0, import_react.useState)("");
	const load = async () => {
		setBusy(true);
		try {
			const r = await fetchCongressTape();
			setTrades(r.trades);
			setLive(r.live);
		} finally {
			setBusy(false);
		}
	};
	(0, import_react.useEffect)(() => {
		load();
	}, []);
	const rows = ticker ? trades.filter((t) => t.ticker.includes(ticker.toUpperCase())) : trades;
	const sent = tickerSentiment(trades);
	const fromTicker = (sym) => {
		const s = sent.find((x) => x.ticker === sym);
		if (!s) return;
		const t = newUserThesis({
			title: `Congress tape: ${sym} net ${s.net >= 0 ? "bought" : "sold"}`,
			instrument: sym,
			domain: "Equities",
			type: "Trade",
			horizon: "45d lag",
			memo: `STOCK Act cluster. ${s.n} prints, ${s.buys} buys / ${s.sells} sells, ${s.members} members, net $${(s.net / 1e3).toFixed(0)}k mid. Disclosure can lag 45 days — context, not a real-time signal. Source: public-tape cache (Capitol Trades is challenge-walled; Disclosed Capitol is the paid/free-tier API).`,
			supports: [`Net ${s.net >= 0 ? "buy" : "sell"}`, `${s.members} distinct members`],
			cuts: ["Up to 45-day legal lag", "Amount is a range, not a fill"],
			changeMind: ["Subsequent filings reverse the net", "Ticker is a fund/option, not the common"],
			analyst: "Invest · Congress",
			links: [{
				label: "Invest",
				href: "/invest"
			}]
		});
		add(t);
		nav({
			to: "/theses/$id",
			params: { id: t.id }
		});
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "p-3 md:p-4",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
				className: cn("font-mono text-[11px]", live ? "text-bull" : "text-warn"),
				children: [live ? "LIVE" : "CACHE", " · STOCK Act disclosures. Lag is the point. Not a trade signal."]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-3 flex flex-wrap gap-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
					value: ticker,
					onChange: (e) => setTicker(e.target.value.toUpperCase()),
					placeholder: "Filter ticker",
					className: "h-8 w-32 border border-border bg-bg-panel px-2 font-mono text-[12px]"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					type: "button",
					onClick: () => void load(),
					disabled: busy,
					className: "h-8 rounded-sm border border-border px-3 font-mono text-[11px]",
					children: "Reload"
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
				className: "mt-4 font-mono text-[10px] tracking-wider text-fg-subtle uppercase",
				children: "Sentiment by ticker"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
				className: "mt-2 divide-y divide-border rounded-md border border-border",
				children: sent.slice(0, 8).map((s) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
					className: "flex items-center justify-between gap-2 px-3 py-2 font-mono text-[12px]",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: s.ticker }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
							className: "text-fg-muted",
							children: [
								s.buys,
								"B/",
								s.sells,
								"S · ",
								s.members,
								" names"
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
							className: s.net >= 0 ? "text-bull" : "text-bear",
							children: [
								"$",
								(s.net / 1e3).toFixed(0),
								"k"
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "button",
							onClick: () => fromTicker(s.ticker),
							className: "text-[11px] text-accent",
							children: "Thesis"
						})
					]
				}, s.ticker))
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mt-4 overflow-x-auto",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("table", {
					className: "w-full min-w-[760px] text-left font-mono text-[12px]",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("thead", {
						className: "text-[10px] text-fg-subtle uppercase",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tr", { children: [
							"Member",
							"Ch",
							"Ticker",
							"Side",
							"Mid $",
							"Tx",
							"Filed",
							"Lag"
						].map((h) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
							className: "px-2 py-1",
							children: h
						}, h)) })
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tbody", { children: rows.map((t) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
						className: "border-t border-border",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
								className: "px-2 py-2",
								children: t.politician
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
								className: "px-2 text-fg-muted",
								children: t.chamber[0]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
								className: "px-2",
								children: t.ticker
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
								className: cn("px-2", t.tradeType === "Buy" ? "text-bull" : "text-bear"),
								children: t.tradeType
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
								className: "px-2",
								children: amountMid(t).toLocaleString()
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
								className: "px-2 text-fg-muted",
								children: t.txDate
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
								className: "px-2 text-fg-muted",
								children: t.discDate
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("td", {
								className: "px-2",
								children: [disclosureLag(t) ?? "—", "d"]
							})
						]
					}, t.id)) })]
				})
			})
		]
	});
}
function Tile({ k, v, tone }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "rounded-md border border-border bg-bg-elevated p-3",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "font-mono text-[10px] text-fg-subtle",
			children: k
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: cn("mt-1 font-mono text-lg tabular", tone === "bull" && "text-bull", tone === "bear" && "text-bear"),
			children: v
		})]
	});
}
function KV({ k, v }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "rounded-sm bg-bg-panel px-2 py-2",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "text-[10px] text-fg-subtle",
			children: k
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { children: v })]
	});
}
function MetricCard({ title, m }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "rounded-md border border-border bg-bg-elevated p-3",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "font-mono text-[10px] text-fg-subtle",
				children: title
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("dl", {
				className: "mt-2 grid grid-cols-2 gap-1 font-mono text-[12px]",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: ["CAGR ", fmtPct((m.cagr ?? 0) * 100)] }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: ["Vol ", fmtPct((m.vol ?? 0) * 100, 1, false)] }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: ["Sharpe ", Number.isFinite(m.sharpe) ? m.sharpe.toFixed(2) : "—"] }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: ["Sortino ", Number.isFinite(m.sortino) ? m.sortino.toFixed(2) : "—"] }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: ["Max DD ", fmtPct((m.maxDd ?? 0) * 100)] }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: ["Calmar ", Number.isFinite(m.calmar) ? m.calmar.toFixed(2) : "—"] })
				]
			}),
			m.path && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mt-2 h-24",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(BoundArea, {
					data: m.path.map((v, i) => ({
						d: i,
						v
					})),
					xKey: "d",
					yKey: "v"
				})
			})
		]
	});
}
function pctOrDash(n) {
	return Number.isFinite(n) ? fmtPct(n * 100, 1, false) : "—";
}
function numOrDash(n) {
	return Number.isFinite(n) ? n.toFixed(2) : "—";
}
var SplitComponent = InvestView;
//#endregion
export { SplitComponent as component };
