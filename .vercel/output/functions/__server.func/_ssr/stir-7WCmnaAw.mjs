import { i as __toESM } from "../_runtime.mjs";
import { C as require_jsx_runtime, Z as require_react } from "../_libs/@tanstack/react-router+[...].mjs";
import { A as fmtSigned, B as mulberry32, C as cn, E as dayKey, F as hashStr, L as iceDxy, U as pxOf, a as FX_BASE_SPOTS, ct as yieldLevels, et as useClock, j as fxSpots, k as fmtPct, lt as yieldSpreads, ot as yieldCurve, st as yieldHistory, t as BBDXY_2026, v as bbdxy, y as bbdxyContrib } from "./shell-B4EHQ9b6.mjs";
import { n as IntelPage } from "./page-Crv803Pc.mjs";
import { r as BoundLine } from "./chart-BfgsPjdW.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/stir-7WCmnaAw.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var QUARTERS = [
	{
		code: "U6",
		expiry: "Sep 2026",
		ts: Date.parse("2026-09-16T00:00:00Z")
	},
	{
		code: "Z6",
		expiry: "Dec 2026",
		ts: Date.parse("2026-12-16T00:00:00Z")
	},
	{
		code: "H7",
		expiry: "Mar 2027",
		ts: Date.parse("2027-03-17T00:00:00Z")
	},
	{
		code: "M7",
		expiry: "Jun 2027",
		ts: Date.parse("2027-06-16T00:00:00Z")
	},
	{
		code: "U7",
		expiry: "Sep 2027",
		ts: Date.parse("2027-09-15T00:00:00Z")
	},
	{
		code: "Z7",
		expiry: "Dec 2027",
		ts: Date.parse("2027-12-15T00:00:00Z")
	},
	{
		code: "H8",
		expiry: "Mar 2028",
		ts: Date.parse("2028-03-15T00:00:00Z")
	},
	{
		code: "M8",
		expiry: "Jun 2028",
		ts: Date.parse("2028-06-21T00:00:00Z")
	}
];
var CURVES = [
	{
		id: "sofr",
		name: "3M SOFR",
		ccy: "USD",
		fixing: "SOFR",
		root: "SFR",
		spot: 4.18,
		drift: -.22
	},
	{
		id: "ff",
		name: "30D Fed Funds",
		ccy: "USD",
		fixing: "EFFR",
		root: "ZQ",
		spot: 4.33,
		drift: -.18
	},
	{
		id: "euribor",
		name: "3M Euribor",
		ccy: "EUR",
		fixing: "EURIBOR",
		root: "ER",
		spot: 1.92,
		drift: -.08
	},
	{
		id: "sonia",
		name: "3M SONIA",
		ccy: "GBP",
		fixing: "SONIA",
		root: "SO3",
		spot: 3.98,
		drift: -.14
	},
	{
		id: "tona",
		name: "3M TONA",
		ccy: "JPY",
		fixing: "TONA",
		root: "TON",
		spot: .52,
		drift: .06
	},
	{
		id: "corra",
		name: "3M CORRA",
		ccy: "CAD",
		fixing: "CORRA",
		root: "CRA",
		spot: 2.68,
		drift: -.1
	}
];
function impliedAt(curve, i, asOf) {
	const r = mulberry32(hashStr(curve.id + QUARTERS[i].code) ^ dayKey(asOf));
	const tYears = (i + 1) * .25;
	return curve.spot + curve.drift * (1 - Math.exp(-tYears / 1.4)) + (r() - .5) * .08;
}
function stirCurves(asOf) {
	return CURVES.map((c) => {
		const contracts = QUARTERS.map((q, i) => {
			const r = mulberry32(hashStr(c.root + q.code) ^ dayKey(asOf));
			const implied = +impliedAt(c, i, asOf).toFixed(3);
			const yImp = +impliedAt(c, i, asOf - 864e5).toFixed(3);
			return {
				id: `${c.root}${q.code}`,
				root: c.root,
				code: `${c.root}${q.code}`,
				expiry: q.expiry,
				implied,
				chg: +((implied - yImp) * 100).toFixed(1),
				settle: +(100 - implied).toFixed(3),
				volume: Math.round(8e4 + r() * 22e4),
				oi: Math.round(4e5 + r() * 9e5),
				curve: c.id
			};
		});
		return {
			id: c.id,
			name: c.name,
			ccy: c.ccy,
			fixing: c.fixing,
			root: c.root,
			spot: +impliedAt(c, 0, asOf).toFixed(3),
			contracts
		};
	});
}
function policyPath(asOf) {
	const y = yieldLevels(asOf);
	const meetings = [
		{
			ccy: "USD",
			bank: "FOMC",
			date: "29 Oct 2026",
			ts: Date.parse("2026-10-29T18:00:00Z"),
			current: y.effr
		},
		{
			ccy: "USD",
			bank: "FOMC",
			date: "10 Dec 2026",
			ts: Date.parse("2026-12-10T19:00:00Z"),
			current: y.effr
		},
		{
			ccy: "USD",
			bank: "FOMC",
			date: "28 Jan 2027",
			ts: Date.parse("2027-01-28T19:00:00Z"),
			current: y.effr
		},
		{
			ccy: "USD",
			bank: "FOMC",
			date: "18 Mar 2027",
			ts: Date.parse("2027-03-18T18:00:00Z"),
			current: y.effr
		},
		{
			ccy: "EUR",
			bank: "ECB",
			date: "17 Oct 2026",
			ts: Date.parse("2026-10-17T12:15:00Z"),
			current: 2
		},
		{
			ccy: "EUR",
			bank: "ECB",
			date: "12 Dec 2026",
			ts: Date.parse("2026-12-12T13:15:00Z"),
			current: 2
		},
		{
			ccy: "GBP",
			bank: "BoE",
			date: "06 Nov 2026",
			ts: Date.parse("2026-11-06T12:00:00Z"),
			current: 4
		},
		{
			ccy: "JPY",
			bank: "BoJ",
			date: "30 Oct 2026",
			ts: Date.parse("2026-10-30T03:00:00Z"),
			current: .5
		}
	];
	let usdCum = 0;
	let eurCum = 0;
	return meetings.map((m, i) => {
		const r = mulberry32(hashStr(m.bank + m.date) ^ dayKey(asOf));
		const pCut = +(.18 + r() * .45).toFixed(2);
		const pHike = +(.04 + r() * .12).toFixed(2);
		const pHold = +(1 - pCut - pHike).toFixed(2);
		const step = -25 * pCut + 25 * pHike;
		if (m.ccy === "USD") usdCum += step;
		if (m.ccy === "EUR") eurCum += step;
		const cum = m.ccy === "USD" ? usdCum : m.ccy === "EUR" ? eurCum : step;
		return {
			id: `mtg-${i}`,
			...m,
			implied: +(m.current + cum / 100).toFixed(3),
			pCut25: pCut,
			pHold,
			pHike25: pHike,
			cumulativeBp: +cum.toFixed(1)
		};
	});
}
function stirSpreads(asOf) {
	const curves = stirCurves(asOf);
	const sofr = curves.find((c) => c.id === "sofr");
	const ff = curves.find((c) => c.id === "ff");
	const er = curves.find((c) => c.id === "euribor");
	const so3 = curves.find((c) => c.id === "sonia");
	const y = yieldLevels(asOf);
	const redGreen = (a, b) => +((a.implied - b.implied) * 100).toFixed(1);
	return [
		{
			id: "fraois",
			name: "3M SOFR − EFFR",
			value: +((sofr.spot - y.effr) * 100).toFixed(1),
			unit: "bp",
			note: "FRA/OIS proxy (fixing vs funds)."
		},
		{
			id: "sfrffz",
			name: "SFRZ6 − ZQZ6",
			value: redGreen(sofr.contracts[1], ff.contracts[1]),
			unit: "bp",
			note: "Dec SOFR vs FF basis."
		},
		{
			id: "edslp",
			name: "SFRZ6 − SFRU6",
			value: redGreen(sofr.contracts[1], sofr.contracts[0]),
			unit: "bp",
			note: "Near whites slope (cuts priced)."
		},
		{
			id: "eurusd3m",
			name: "3M EURUSD implied",
			value: +((sofr.spot - er.spot) * 100).toFixed(1),
			unit: "bp",
			note: "Short-rate gap, not the NDF."
		},
		{
			id: "gbpusd3m",
			name: "3M GBPUSD implied",
			value: +((sofr.spot - so3.spot) * 100).toFixed(1),
			unit: "bp",
			note: "SONIA vs SOFR."
		}
	];
}
function stirStripHistory(root, asOf, n = 60) {
	const out = [];
	for (let i = n - 1; i >= 0; i--) {
		const ts = asOf - i * 864e5;
		const c = stirCurves(ts).find((c) => c.root === root || c.id === root.toLowerCase() || c.contracts[0]?.root === root) ?? stirCurves(ts)[0];
		out.push({
			d: n - 1 - i,
			u6: c.contracts[0].implied,
			z6: c.contracts[1].implied,
			h7: c.contracts[2].implied,
			m7: c.contracts[3].implied
		});
	}
	return out;
}
function StirView() {
	const asOf = useClock();
	const [curveId, setCurveId] = (0, import_react.useState)("sofr");
	const curves = (0, import_react.useMemo)(() => stirCurves(asOf), [asOf]);
	const curve = curves.find((c) => c.id === curveId) ?? curves[0];
	const meetings = (0, import_react.useMemo)(() => policyPath(asOf), [asOf]);
	const spreads = (0, import_react.useMemo)(() => stirSpreads(asOf), [asOf]);
	const ySpreads = (0, import_react.useMemo)(() => yieldSpreads(asOf), [asOf]);
	const yCurve = (0, import_react.useMemo)(() => yieldCurve(asOf), [asOf]);
	const hist = (0, import_react.useMemo)(() => stirStripHistory(curve.root, asOf), [curve.root, asOf]);
	const sprHist = (0, import_react.useMemo)(() => yieldHistory("2s10s", asOf), [asOf]);
	const spots = fxSpots(asOf);
	const ice = iceDxy(spots);
	const bb = bbdxy(spots, FX_BASE_SPOTS);
	const contrib = bbdxyContrib(spots, FX_BASE_SPOTS);
	const dxyChg = pxOf("DXY", asOf).chg;
	const bbChg = pxOf("BBDXY", asOf).chg;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(IntelPage, {
		title: "STIR",
		kicker: "SOFR / FF / Euribor / SONIA · BBDXY · yield spreads",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "grid gap-3 p-3 md:grid-cols-4 md:p-4",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stat, {
						k: "BBDXY",
						v: bb.toFixed(2),
						chg: bbChg,
						sub: "Bloomberg 2026 weights"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stat, {
						k: "ICE DXY",
						v: ice.toFixed(2),
						chg: dxyChg,
						sub: "6-currency geometric"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stat, {
						k: "US 2s10s",
						v: `${ySpreads[0].value.toFixed(1)} bp`,
						chg: ySpreads[0].chg,
						sub: "curve",
						bp: true
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stat, {
						k: "SOFR−FF",
						v: `${spreads[0].value.toFixed(1)} bp`,
						sub: spreads[0].note
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "border-t border-border px-3 py-4 md:px-4",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "font-mono text-[10px] tracking-wider text-fg-subtle uppercase",
					children: "Policy path"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "mt-2 overflow-x-auto",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("table", {
						className: "w-full min-w-[720px] text-left font-mono text-[12px]",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("thead", {
							className: "text-[10px] tracking-wider text-fg-subtle uppercase",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tr", { children: [
								"Bank",
								"Date",
								"Current",
								"Implied",
								"P(cut 25)",
								"P(hold)",
								"P(hike 25)",
								"Cum bp"
							].map((h) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
								className: "px-3 py-2",
								children: h
							}, h)) })
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tbody", { children: meetings.map((m) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
							className: "border-t border-border",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
									className: "px-3 py-2",
									children: m.bank
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
									className: "px-3 text-fg-muted",
									children: m.date
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
									className: "px-3",
									children: m.current.toFixed(2)
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
									className: "px-3",
									children: m.implied.toFixed(3)
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("td", {
									className: "px-3 text-bull",
									children: [Math.round(m.pCut25 * 100), "%"]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("td", {
									className: "px-3",
									children: [Math.round(m.pHold * 100), "%"]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("td", {
									className: "px-3 text-bear",
									children: [Math.round(m.pHike25 * 100), "%"]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
									className: cn("px-3", m.cumulativeBp < 0 ? "text-bull" : "text-fg"),
									children: fmtSigned(m.cumulativeBp, 1)
								})
							]
						}, m.id)) })]
					})
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "border-t border-border px-3 py-4 md:px-4",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "flex flex-wrap gap-1",
						children: curves.map((c) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "button",
							onClick: () => setCurveId(c.id),
							className: cn("h-7 px-2 font-mono text-[10px]", curveId === c.id ? "text-fg" : "text-fg-muted"),
							children: c.name
						}, c.id))
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "mt-3 h-48 rounded-md border border-border bg-bg-elevated p-2",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(BoundLine, {
							data: hist,
							xKey: "d",
							series: [
								{
									key: "u6",
									color: "var(--accent)",
									name: "U6"
								},
								{
									key: "z6",
									color: "var(--warn)",
									name: "Z6"
								},
								{
									key: "h7",
									color: "var(--info)",
									name: "H7"
								},
								{
									key: "m7",
									color: "var(--bull)",
									name: "M7"
								}
							]
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-2 font-mono text-[10px] text-fg-subtle",
						children: "Implied 3m rate (%). Y-axis is the rate, not the price. Whites → reds."
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "mt-3 overflow-x-auto",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("table", {
							className: "w-full min-w-[640px] text-left font-mono text-[12px]",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("thead", {
								className: "text-[10px] tracking-wider text-fg-subtle uppercase",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tr", { children: [
									"Contract",
									"Expiry",
									"Implied %",
									"Δ bp",
									"Settle",
									"Vol",
									"OI"
								].map((h) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
									className: "px-3 py-2",
									children: h
								}, h)) })
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tbody", { children: curve.contracts.map((c) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
								className: "border-t border-border",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
										className: "px-3 py-2",
										children: c.code
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
										className: "px-3 text-fg-muted",
										children: c.expiry
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
										className: "px-3",
										children: c.implied.toFixed(3)
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
										className: cn("px-3", c.chg >= 0 ? "text-bear" : "text-bull"),
										children: fmtSigned(c.chg, 1)
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
										className: "px-3",
										children: c.settle.toFixed(3)
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
										className: "px-3 text-fg-muted",
										children: c.volume.toLocaleString()
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
										className: "px-3 text-fg-muted",
										children: c.oi.toLocaleString()
									})
								]
							}, c.id)) })]
						})
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "grid gap-4 border-t border-border p-3 md:grid-cols-2 md:p-4",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						className: "font-mono text-[10px] tracking-wider text-fg-subtle uppercase",
						children: "Yield spreads"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
						className: "mt-2 divide-y divide-border rounded-md border border-border",
						children: ySpreads.map((s) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
							className: "flex items-baseline justify-between gap-3 px-3 py-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "font-mono text-[12px]",
								children: s.name
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "text-[11px] text-fg-muted",
								children: s.note
							})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "text-right font-mono text-[12px]",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [s.value.toFixed(1), " bp"] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: s.chg >= 0 ? "text-bear" : "text-bull",
									children: fmtSigned(s.chg, 1)
								})]
							})]
						}, s.id))
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "mt-3 h-40 rounded-md border border-border bg-bg-elevated p-2",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(BoundLine, {
							data: sprHist,
							xKey: "d",
							series: [{
								key: "v",
								color: "var(--accent)",
								name: "2s10s bp"
							}]
						})
					})
				] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						className: "font-mono text-[10px] tracking-wider text-fg-subtle uppercase",
						children: "BBDXY 2026 weights"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-1 text-[12px] text-fg-muted",
						children: "Effective after close 30 Jun 2026. CNH capped at 7.00. Geometric, rebased 1240 at central spots."
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
						className: "mt-2 divide-y divide-border rounded-md border border-border",
						children: contrib.map((c) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
							className: "flex items-center gap-3 px-3 py-1.5 font-mono text-[11px]",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "w-10",
									children: c.name
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
									className: "w-16 text-fg-muted",
									children: [c.w.toFixed(2), "%"]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "flex-1",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "block h-1.5 rounded-full bg-bg-panel",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "block h-1.5 rounded-full bg-accent",
											style: { width: `${c.w / BBDXY_2026[0].w * 100}%` }
										})
									})
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: cn("w-16 text-right", c.relPct >= 0 ? "text-bull" : "text-bear"),
									children: fmtPct(c.relPct)
								})
							]
						}, c.pair))
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "mt-3 h-40 rounded-md border border-border bg-bg-elevated p-2",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(BoundLine, {
							data: yCurve.map((p) => ({
								d: p.years,
								us: p.us,
								de: p.de,
								jp: p.jp,
								gb: p.gb
							})),
							xKey: "d",
							series: [
								{
									key: "us",
									color: "var(--accent)",
									name: "US"
								},
								{
									key: "de",
									color: "var(--info)",
									name: "DE"
								},
								{
									key: "jp",
									color: "var(--warn)",
									name: "JP"
								},
								{
									key: "gb",
									color: "var(--bull)",
									name: "GB"
								}
							]
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-1 font-mono text-[10px] text-fg-subtle",
						children: "Nominal curves (%). X = years."
					})
				] })]
			})
		]
	});
}
function Stat({ k, v, chg, sub, bp }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "rounded-md border border-border bg-bg-elevated p-3",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "font-mono text-[10px] text-fg-subtle",
				children: k
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mt-1 font-mono text-lg tabular",
				children: v
			}),
			chg != null && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: cn("font-mono text-[11px]", chg >= 0 ? bp ? "text-bear" : "text-bull" : bp ? "text-bull" : "text-bear"),
				children: bp ? `${fmtSigned(chg, 1)} bp` : fmtPct(chg)
			}),
			sub && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mt-1 text-[11px] text-fg-muted",
				children: sub
			})
		]
	});
}
var SplitComponent = StirView;
//#endregion
export { SplitComponent as component };
