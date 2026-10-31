import { i as __toESM } from "../_runtime.mjs";
import { C as require_jsx_runtime, Z as require_react, b as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { C as cn, U as pxOf, Y as series, et as useClock, h as THESES, k as fmtPct, tt as useTerminal } from "./shell-B4EHQ9b6.mjs";
import { n as IntelPage } from "./page-Crv803Pc.mjs";
import { t as BoundArea } from "./chart-BfgsPjdW.mjs";
import { r as cotTffRows, s as macroCalendar, t as cotFeatureHistory } from "./cot-tff-iWn_4ltx.mjs";
import { n as seasonality, t as seasonHistory } from "./seasonality-CSHrAXBD.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/watch-wMXXGqNc.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var WATCH_UNIVERSE = [
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
		symbol: "GBPUSD",
		name: "Sterling",
		cls: "FX"
	},
	{
		symbol: "USDCHF",
		name: "Dollar-swiss",
		cls: "FX"
	},
	{
		symbol: "AUDUSD",
		name: "Aussie",
		cls: "FX"
	},
	{
		symbol: "USDCAD",
		name: "Dollar-cad",
		cls: "FX"
	},
	{
		symbol: "USDMXN",
		name: "Peso",
		cls: "FX"
	},
	{
		symbol: "USDCNH",
		name: "Offshore yuan",
		cls: "FX"
	},
	{
		symbol: "BBDXY",
		name: "Bloomberg dollar",
		cls: "FX"
	},
	{
		symbol: "DXY",
		name: "ICE dollar index",
		cls: "FX"
	},
	{
		symbol: "WTI",
		name: "WTI crude",
		cls: "Energy"
	},
	{
		symbol: "BRENT",
		name: "Brent",
		cls: "Energy"
	},
	{
		symbol: "NATGAS",
		name: "Henry Hub",
		cls: "Energy"
	},
	{
		symbol: "XAU",
		name: "Gold",
		cls: "Metals"
	},
	{
		symbol: "XAG",
		name: "Silver",
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
		symbol: "US10Y",
		name: "UST 10Y",
		cls: "Rates"
	},
	{
		symbol: "SOFR",
		name: "SOFR",
		cls: "STIR"
	},
	{
		symbol: "BTC",
		name: "Bitcoin",
		cls: "Crypto"
	},
	{
		symbol: "2s10s",
		name: "US 2s10s",
		cls: "Rates"
	}
];
function WatchView() {
	const asOf = useClock();
	const symbol = useTerminal((s) => s.watchSymbol);
	const list = useTerminal((s) => s.watchlist);
	const add = useTerminal((s) => s.addWatch);
	const remove = useTerminal((s) => s.removeWatch);
	const setSym = useTerminal((s) => s.setWatchSymbol);
	const [q, setQ] = (0, import_react.useState)("");
	const matches = WATCH_UNIVERSE.filter((a) => a.symbol.toLowerCase().includes(q.toLowerCase()) || a.name.toLowerCase().includes(q.toLowerCase()));
	const px = symbol ? pxOf(symbol, asOf) : null;
	const hist = (0, import_react.useMemo)(() => {
		if (!symbol) return [];
		const last = pxOf(symbol, asOf).px || 100;
		return series(`watch-${symbol}`, 90, last, Math.max(Math.abs(last) * .008, .05), asOf).map((v, i) => ({
			d: i,
			v
		}));
	}, [symbol, asOf]);
	const season = (0, import_react.useMemo)(() => symbol ? seasonHistory(symbol) : [], [symbol]);
	const card = (0, import_react.useMemo)(() => seasonality(asOf).find((s) => s.symbol === symbol), [asOf, symbol]);
	const cot = (0, import_react.useMemo)(() => {
		const mkt = symbol?.replace("USD", "").replace("USD", "") ?? "";
		return cotTffRows(asOf).find((r) => symbol?.includes(r.market) || r.market === mkt);
	}, [asOf, symbol]);
	const cotHist = (0, import_react.useMemo)(() => cot ? cotFeatureHistory(cot.market, asOf, 2) : [], [cot, asOf]);
	const cal = (0, import_react.useMemo)(() => macroCalendar(asOf).filter((c) => c.related.includes(symbol ?? "") || (symbol?.includes(c.ccy) ?? false)).slice(0, 8), [asOf, symbol]);
	const related = THESES.filter((t) => t.instrument === symbol || t.title.includes(symbol ?? "___"));
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(IntelPage, {
		title: "Watch",
		kicker: "One asset, full blotter — start empty",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex flex-wrap items-center gap-2 border-b border-border px-3 py-2 md:px-4",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
					value: q,
					onChange: (e) => setQ(e.target.value),
					placeholder: "Add an asset — EURUSD, WTI, BBDXY, SOFR…",
					className: "h-9 min-w-[220px] flex-1 rounded-sm border border-border bg-bg-panel px-3 font-mono text-[12px] outline-none"
				}), q && matches.slice(0, 6).map((m) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					type: "button",
					onClick: () => {
						add(m.symbol);
						setQ("");
					},
					className: "h-8 rounded-sm border border-border px-2 font-mono text-[11px] hover:bg-bg-hover",
					children: m.symbol
				}, m.symbol))]
			}),
			list.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "flex flex-wrap gap-1 border-b border-border px-3 py-2",
				children: list.map((s) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
					type: "button",
					onClick: () => setSym(s),
					className: cn("h-7 rounded-sm border px-2 font-mono text-[11px]", symbol === s ? "border-accent text-fg" : "border-border text-fg-muted"),
					children: [s, /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "ml-2 text-fg-subtle",
						onClick: (e) => {
							e.stopPropagation();
							remove(s);
						},
						children: "×"
					})]
				}, s))
			}),
			!symbol && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex flex-1 flex-col items-center justify-center px-6 py-24 text-center",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-sm text-fg-muted",
					children: "No asset selected."
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-2 max-w-md text-[13px] text-fg-subtle",
					children: "Search above and pin a contract. The blotter fills with price, seasonality, COT (if TFF), the next related prints, and linked theses."
				})]
			}),
			symbol && px && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "grid gap-4 p-3 md:grid-cols-[1.3fr_0.7fr] md:p-4",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-baseline gap-3",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
								className: "text-xl font-medium",
								children: symbol
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "font-mono text-lg tabular",
								children: px.px
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: cn("font-mono text-[13px]", px.chg >= 0 ? "text-bull" : "text-bear"),
								children: fmtPct(px.chg)
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "font-mono text-[10px] text-fg-subtle",
								children: WATCH_UNIVERSE.find((a) => a.symbol === symbol)?.cls
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "mt-3 h-52 rounded-md border border-border bg-bg-elevated p-2",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(BoundArea, {
							data: hist,
							xKey: "d",
							yKey: "v"
						})
					}),
					season.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
							className: "mt-4 font-mono text-[10px] tracking-wider text-fg-subtle uppercase",
							children: "Seasonal monthly mean %"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "mt-2 h-40 rounded-md border border-border bg-bg-elevated p-2",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(BoundArea, {
								data: season.map((s, i) => ({
									d: i,
									v: s.avg
								})),
								xKey: "d",
								yKey: "v",
								color: "var(--warn)"
							})
						}),
						card && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "mt-2 text-[12px] text-fg-muted",
							children: [
								"This month ",
								card.thisMonth.label,
								": avg ",
								card.thisMonth.avg,
								"% · win ",
								card.thisMonth.win,
								"% · vs season ",
								card.vsSeason > 0 ? "+" : "",
								card.vsSeason
							]
						})
					] })
				] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "space-y-3",
					children: [
						cot && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "rounded-md border border-border bg-bg-elevated p-3",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "font-mono text-[10px] text-fg-subtle",
									children: ["TFF ", cot.market]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "mt-1 font-mono text-sm",
									children: [
										"idx ",
										((cot.last.idx_lf || 0) * 100).toFixed(0),
										" · z ",
										cot.last.z_lf?.toFixed(2) ?? "—"
									]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "text-[12px] text-fg-muted",
									children: [
										cot.extreme,
										" · net_cot ",
										cot.last.net_cot.toFixed(1)
									]
								}),
								cotHist.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "mt-2 h-24",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(BoundArea, {
										data: cotHist,
										xKey: "w",
										yKey: "idx",
										color: "var(--warn)"
									})
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
									to: "/cot",
									className: "mt-2 inline-block font-mono text-[11px] text-accent no-underline",
									children: "Open COT →"
								})
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "rounded-md border border-border bg-bg-elevated p-3",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "font-mono text-[10px] text-fg-subtle",
									children: "Next related prints"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("ul", {
									className: "mt-2 space-y-1 font-mono text-[11px]",
									children: [cal.length === 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", {
										className: "text-fg-muted",
										children: "None in the window."
									}), cal.map((c) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
										className: "flex justify-between gap-2",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
											className: "truncate",
											children: [
												c.ccy,
												" ",
												c.name
											]
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "text-fg-subtle",
											children: c.tier
										})]
									}, c.id))]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
									to: "/macro",
									className: "mt-2 inline-block font-mono text-[11px] text-accent no-underline",
									children: "Calendar →"
								})
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "rounded-md border border-border bg-bg-elevated p-3",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "font-mono text-[10px] text-fg-subtle",
								children: "Theses"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("ul", {
								className: "mt-2 space-y-1 text-[12px]",
								children: [related.length === 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", {
									className: "text-fg-muted",
									children: "None tagged."
								}), related.map((t) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
									to: "/theses/$id",
									params: { id: t.id },
									className: "text-fg no-underline hover:text-accent",
									children: t.title
								}) }, t.id))]
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex flex-wrap gap-2 font-mono text-[11px]",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
									to: "/stir",
									className: "text-accent no-underline",
									children: "STIR →"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
									to: "/risk",
									className: "text-accent no-underline",
									children: "Risk →"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
									to: "/seasonality",
									className: "text-accent no-underline",
									children: "Seasonality →"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
									to: "/fx",
									className: "text-accent no-underline",
									children: "FX →"
								})
							]
						})
					]
				})]
			})
		]
	});
}
var SplitComponent = WatchView;
//#endregion
export { SplitComponent as component };
