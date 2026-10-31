import { $ as series, A as useTerminal, J as fmtPct, W as cn, d as useClock, h as pxOf, rt as THESES } from "./shell-B4EHQ9b6.js";
import { n as IntelPage } from "./page-Crv803Pc.js";
import { r as cotTffRows, s as macroCalendar, t as cotFeatureHistory } from "./cot-tff-iWn_4ltx.js";
import { t as BoundArea } from "./chart-BfgsPjdW.js";
import { n as seasonality, t as seasonHistory } from "./seasonality-CSHrAXBD.js";
import { useMemo, useState } from "react";
import { Link } from "@tanstack/react-router";
import { Fragment, jsx, jsxs } from "react/jsx-runtime";
//#region src/data/watch.ts
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
//#endregion
//#region src/components/intel/watch-view.tsx
function WatchView() {
	const asOf = useClock();
	const symbol = useTerminal((s) => s.watchSymbol);
	const list = useTerminal((s) => s.watchlist);
	const add = useTerminal((s) => s.addWatch);
	const remove = useTerminal((s) => s.removeWatch);
	const setSym = useTerminal((s) => s.setWatchSymbol);
	const [q, setQ] = useState("");
	const matches = WATCH_UNIVERSE.filter((a) => a.symbol.toLowerCase().includes(q.toLowerCase()) || a.name.toLowerCase().includes(q.toLowerCase()));
	const px = symbol ? pxOf(symbol, asOf) : null;
	const hist = useMemo(() => {
		if (!symbol) return [];
		const last = pxOf(symbol, asOf).px || 100;
		return series(`watch-${symbol}`, 90, last, Math.max(Math.abs(last) * .008, .05), asOf).map((v, i) => ({
			d: i,
			v
		}));
	}, [symbol, asOf]);
	const season = useMemo(() => symbol ? seasonHistory(symbol) : [], [symbol]);
	const card = useMemo(() => seasonality(asOf).find((s) => s.symbol === symbol), [asOf, symbol]);
	const cot = useMemo(() => {
		const mkt = symbol?.replace("USD", "").replace("USD", "") ?? "";
		return cotTffRows(asOf).find((r) => symbol?.includes(r.market) || r.market === mkt);
	}, [asOf, symbol]);
	const cotHist = useMemo(() => cot ? cotFeatureHistory(cot.market, asOf, 2) : [], [cot, asOf]);
	const cal = useMemo(() => macroCalendar(asOf).filter((c) => c.related.includes(symbol ?? "") || (symbol?.includes(c.ccy) ?? false)).slice(0, 8), [asOf, symbol]);
	const related = THESES.filter((t) => t.instrument === symbol || t.title.includes(symbol ?? "___"));
	return /* @__PURE__ */ jsxs(IntelPage, {
		title: "Watch",
		kicker: "One asset, full blotter — start empty",
		children: [
			/* @__PURE__ */ jsxs("div", {
				className: "flex flex-wrap items-center gap-2 border-b border-border px-3 py-2 md:px-4",
				children: [/* @__PURE__ */ jsx("input", {
					value: q,
					onChange: (e) => setQ(e.target.value),
					placeholder: "Add an asset — EURUSD, WTI, BBDXY, SOFR…",
					className: "h-9 min-w-[220px] flex-1 rounded-sm border border-border bg-bg-panel px-3 font-mono text-[12px] outline-none"
				}), q && matches.slice(0, 6).map((m) => /* @__PURE__ */ jsx("button", {
					type: "button",
					onClick: () => {
						add(m.symbol);
						setQ("");
					},
					className: "h-8 rounded-sm border border-border px-2 font-mono text-[11px] hover:bg-bg-hover",
					children: m.symbol
				}, m.symbol))]
			}),
			list.length > 0 && /* @__PURE__ */ jsx("div", {
				className: "flex flex-wrap gap-1 border-b border-border px-3 py-2",
				children: list.map((s) => /* @__PURE__ */ jsxs("button", {
					type: "button",
					onClick: () => setSym(s),
					className: cn("h-7 rounded-sm border px-2 font-mono text-[11px]", symbol === s ? "border-accent text-fg" : "border-border text-fg-muted"),
					children: [s, /* @__PURE__ */ jsx("span", {
						className: "ml-2 text-fg-subtle",
						onClick: (e) => {
							e.stopPropagation();
							remove(s);
						},
						children: "×"
					})]
				}, s))
			}),
			!symbol && /* @__PURE__ */ jsxs("div", {
				className: "flex flex-1 flex-col items-center justify-center px-6 py-24 text-center",
				children: [/* @__PURE__ */ jsx("p", {
					className: "text-sm text-fg-muted",
					children: "No asset selected."
				}), /* @__PURE__ */ jsx("p", {
					className: "mt-2 max-w-md text-[13px] text-fg-subtle",
					children: "Search above and pin a contract. The blotter fills with price, seasonality, COT (if TFF), the next related prints, and linked theses."
				})]
			}),
			symbol && px && /* @__PURE__ */ jsxs("div", {
				className: "grid gap-4 p-3 md:grid-cols-[1.3fr_0.7fr] md:p-4",
				children: [/* @__PURE__ */ jsxs("div", { children: [
					/* @__PURE__ */ jsxs("div", {
						className: "flex items-baseline gap-3",
						children: [
							/* @__PURE__ */ jsx("h2", {
								className: "text-xl font-medium",
								children: symbol
							}),
							/* @__PURE__ */ jsx("span", {
								className: "font-mono text-lg tabular",
								children: px.px
							}),
							/* @__PURE__ */ jsx("span", {
								className: cn("font-mono text-[13px]", px.chg >= 0 ? "text-bull" : "text-bear"),
								children: fmtPct(px.chg)
							}),
							/* @__PURE__ */ jsx("span", {
								className: "font-mono text-[10px] text-fg-subtle",
								children: WATCH_UNIVERSE.find((a) => a.symbol === symbol)?.cls
							})
						]
					}),
					/* @__PURE__ */ jsx("div", {
						className: "mt-3 h-52 rounded-md border border-border bg-bg-elevated p-2",
						children: /* @__PURE__ */ jsx(BoundArea, {
							data: hist,
							xKey: "d",
							yKey: "v"
						})
					}),
					season.length > 0 && /* @__PURE__ */ jsxs(Fragment, { children: [
						/* @__PURE__ */ jsx("h3", {
							className: "mt-4 font-mono text-[10px] tracking-wider text-fg-subtle uppercase",
							children: "Seasonal monthly mean %"
						}),
						/* @__PURE__ */ jsx("div", {
							className: "mt-2 h-40 rounded-md border border-border bg-bg-elevated p-2",
							children: /* @__PURE__ */ jsx(BoundArea, {
								data: season.map((s, i) => ({
									d: i,
									v: s.avg
								})),
								xKey: "d",
								yKey: "v",
								color: "var(--warn)"
							})
						}),
						card && /* @__PURE__ */ jsxs("p", {
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
				] }), /* @__PURE__ */ jsxs("div", {
					className: "space-y-3",
					children: [
						cot && /* @__PURE__ */ jsxs("div", {
							className: "rounded-md border border-border bg-bg-elevated p-3",
							children: [
								/* @__PURE__ */ jsxs("div", {
									className: "font-mono text-[10px] text-fg-subtle",
									children: ["TFF ", cot.market]
								}),
								/* @__PURE__ */ jsxs("div", {
									className: "mt-1 font-mono text-sm",
									children: [
										"idx ",
										((cot.last.idx_lf || 0) * 100).toFixed(0),
										" · z ",
										cot.last.z_lf?.toFixed(2) ?? "—"
									]
								}),
								/* @__PURE__ */ jsxs("div", {
									className: "text-[12px] text-fg-muted",
									children: [
										cot.extreme,
										" · net_cot ",
										cot.last.net_cot.toFixed(1)
									]
								}),
								cotHist.length > 0 && /* @__PURE__ */ jsx("div", {
									className: "mt-2 h-24",
									children: /* @__PURE__ */ jsx(BoundArea, {
										data: cotHist,
										xKey: "w",
										yKey: "idx",
										color: "var(--warn)"
									})
								}),
								/* @__PURE__ */ jsx(Link, {
									to: "/cot",
									className: "mt-2 inline-block font-mono text-[11px] text-accent no-underline",
									children: "Open COT →"
								})
							]
						}),
						/* @__PURE__ */ jsxs("div", {
							className: "rounded-md border border-border bg-bg-elevated p-3",
							children: [
								/* @__PURE__ */ jsx("div", {
									className: "font-mono text-[10px] text-fg-subtle",
									children: "Next related prints"
								}),
								/* @__PURE__ */ jsxs("ul", {
									className: "mt-2 space-y-1 font-mono text-[11px]",
									children: [cal.length === 0 && /* @__PURE__ */ jsx("li", {
										className: "text-fg-muted",
										children: "None in the window."
									}), cal.map((c) => /* @__PURE__ */ jsxs("li", {
										className: "flex justify-between gap-2",
										children: [/* @__PURE__ */ jsxs("span", {
											className: "truncate",
											children: [
												c.ccy,
												" ",
												c.name
											]
										}), /* @__PURE__ */ jsx("span", {
											className: "text-fg-subtle",
											children: c.tier
										})]
									}, c.id))]
								}),
								/* @__PURE__ */ jsx(Link, {
									to: "/macro",
									className: "mt-2 inline-block font-mono text-[11px] text-accent no-underline",
									children: "Calendar →"
								})
							]
						}),
						/* @__PURE__ */ jsxs("div", {
							className: "rounded-md border border-border bg-bg-elevated p-3",
							children: [/* @__PURE__ */ jsx("div", {
								className: "font-mono text-[10px] text-fg-subtle",
								children: "Theses"
							}), /* @__PURE__ */ jsxs("ul", {
								className: "mt-2 space-y-1 text-[12px]",
								children: [related.length === 0 && /* @__PURE__ */ jsx("li", {
									className: "text-fg-muted",
									children: "None tagged."
								}), related.map((t) => /* @__PURE__ */ jsx("li", { children: /* @__PURE__ */ jsx(Link, {
									to: "/theses/$id",
									params: { id: t.id },
									className: "text-fg no-underline hover:text-accent",
									children: t.title
								}) }, t.id))]
							})]
						}),
						/* @__PURE__ */ jsxs("div", {
							className: "flex flex-wrap gap-2 font-mono text-[11px]",
							children: [
								/* @__PURE__ */ jsx(Link, {
									to: "/stir",
									className: "text-accent no-underline",
									children: "STIR →"
								}),
								/* @__PURE__ */ jsx(Link, {
									to: "/risk",
									className: "text-accent no-underline",
									children: "Risk →"
								}),
								/* @__PURE__ */ jsx(Link, {
									to: "/seasonality",
									className: "text-accent no-underline",
									children: "Seasonality →"
								}),
								/* @__PURE__ */ jsx(Link, {
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
//#endregion
//#region src/routes/watch.tsx?tsr-split=component
var SplitComponent = WatchView;
//#endregion
export { SplitComponent as component };
