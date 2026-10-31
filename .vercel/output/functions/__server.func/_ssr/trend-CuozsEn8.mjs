import { i as __toESM } from "../_runtime.mjs";
import { C as require_jsx_runtime, Z as require_react, b as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { A as fmtSigned, C as cn, et as useClock, f as ScoreBar, m as Spark, o as FactorChip, tt as useTerminal } from "./shell-B4EHQ9b6.mjs";
import { n as IntelPage, t as Drawer } from "./page-Crv803Pc.mjs";
import { t as BoundArea } from "./chart-BfgsPjdW.mjs";
import { c as globalRegime, v as trendHistory, y as trendMatrix } from "./calculated-DX17ibxV.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/trend-CuozsEn8.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function TrendView() {
	const asOf = useClock();
	const weights = useTerminal((s) => s.weights);
	const setWeights = useTerminal((s) => s.setWeights);
	const rows = (0, import_react.useMemo)(() => trendMatrix(asOf, weights), [asOf, weights]);
	const regime = globalRegime(rows);
	const [sel, setSel] = (0, import_react.useState)(null);
	const row = rows.find((r) => r.symbol === sel);
	const bulls = [...rows].sort((a, b) => b.overall - a.overall).slice(0, 4);
	const bears = [...rows].sort((a, b) => a.overall - b.overall).slice(0, 4);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(IntelPage, {
		title: "Trend matrix",
		kicker: `${rows.length} assets · regime ${regime}`,
		actions: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
			className: cn("rounded-xs border px-2 py-0.5 font-mono text-[10px] tracking-wide", regime === "RISK-ON" && "border-bull/40 text-bull", regime === "RISK-OFF" && "border-bear/40 text-bear", regime === "BALANCED" && "border-border text-fg-muted"),
			children: regime
		}),
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "grid gap-3 border-b border-border p-3 md:grid-cols-3 md:p-4",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "rounded-md border border-border bg-bg-elevated p-3",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "font-mono text-[10px] text-fg-subtle",
							children: "TOP BULL"
						}), bulls.map((r) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
							type: "button",
							className: "mt-1 flex w-full justify-between font-mono text-[12px]",
							onClick: () => setSel(r.symbol),
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: r.symbol }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-bull",
								children: fmtSigned(r.overall, 0)
							})]
						}, r.symbol))]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "rounded-md border border-border bg-bg-elevated p-3",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "font-mono text-[10px] text-fg-subtle",
							children: "TOP BEAR"
						}), bears.map((r) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
							type: "button",
							className: "mt-1 flex w-full justify-between font-mono text-[12px]",
							onClick: () => setSel(r.symbol),
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: r.symbol }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-bear",
								children: fmtSigned(r.overall, 0)
							})]
						}, r.symbol))]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "rounded-md border border-border bg-bg-elevated p-3",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "font-mono text-[10px] text-fg-subtle",
							children: "WEIGHTS (user)"
						}), [
							"macro",
							"pos",
							"risk",
							"flow"
						].map((k) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
							className: "mt-1 flex items-center gap-2 font-mono text-[11px] uppercase",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "w-10 text-fg-subtle",
									children: k
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
									type: "range",
									min: 0,
									max: 50,
									value: weights[k],
									onChange: (e) => setWeights({ [k]: Number(e.target.value) }),
									className: "flex-1 accent-accent"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "tabular w-6 text-right",
									children: weights[k]
								})
							]
						}, k))]
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "overflow-x-auto",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("table", {
					className: "w-full min-w-[880px] text-left text-[12px]",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("thead", {
						className: "sticky top-0 bg-bg font-mono text-[10px] tracking-wider text-fg-subtle uppercase",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tr", { children: [
							"Asset",
							"Class",
							"Last",
							"Chg",
							"Overall",
							"Verdict",
							"MACRO",
							"POS",
							"RISK",
							"FLOW",
							"Crowd",
							"Reg%"
						].map((h) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
							className: "px-3 py-2 font-medium",
							children: h
						}, h)) })
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tbody", { children: rows.map((r) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
						className: "cursor-pointer border-t border-border hover:bg-bg-hover",
						onClick: () => setSel(r.symbol),
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
								className: "px-3 py-2 font-medium",
								children: r.symbol
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
								className: "px-3 text-fg-muted",
								children: r.assetClass
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
								className: "tabular px-3 font-mono",
								children: r.last
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("td", {
								className: cn("tabular px-3 font-mono", r.chg >= 0 ? "text-bull" : "text-bear"),
								children: [fmtSigned(r.chg, 2), "%"]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
								className: "px-3",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex items-center gap-2",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: cn("tabular w-10 font-mono", r.overall >= 0 ? "text-bull" : "text-bear"),
										children: fmtSigned(r.overall, 0)
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ScoreBar, {
										n: r.overall,
										className: "w-16"
									})]
								})
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
								className: "px-3 font-mono text-[10px] text-fg-muted",
								children: r.verdict
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Num, { n: r.macro }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Num, { n: r.pos }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Num, { n: r.risk }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Num, { n: r.flow }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
								className: "tabular px-3 font-mono text-fg-muted",
								children: r.crowding
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
								className: "tabular px-3 font-mono text-fg-muted",
								children: r.regimeP
							})
						]
					}, r.symbol)) })]
				})
			}),
			row && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TrendDrawer, {
				row,
				asOf,
				onClose: () => setSel(null)
			})
		]
	});
}
function Num({ n }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
		className: cn("tabular px-3 font-mono", n >= 0 ? "text-bull" : "text-bear"),
		children: fmtSigned(n, 0)
	});
}
function TrendDrawer({ row, asOf, onClose }) {
	const hist = trendHistory(row.symbol, asOf);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Drawer, {
		title: `${row.symbol} · ${row.name}`,
		onClose,
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "h-36",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(BoundArea, {
					data: hist,
					xKey: "d",
					yKey: "v"
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-4 grid grid-cols-2 gap-3",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FactorChip, {
						label: "MACRO",
						n: row.macro
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FactorChip, {
						label: "POS",
						n: row.pos
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FactorChip, {
						label: "RISK",
						n: row.risk
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FactorChip, {
						label: "FLOW",
						n: row.flow
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
				className: "mt-4 text-[12px] text-fg-muted",
				children: ["Drivers: ", row.drivers.join(" · ")]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
				className: "mt-2 text-[12px] text-fg-muted",
				children: [
					"Crowding ",
					row.crowding,
					" · regime probability ",
					row.regimeP,
					"% (HMM)"
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
				to: "/cot",
				className: "mt-4 inline-block font-mono text-[11px] text-accent no-underline",
				children: "Open COT →"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Spark, {
				data: hist.map((h) => h.v),
				className: "mt-3 h-8 w-full"
			})
		]
	});
}
var SplitComponent = TrendView;
//#endregion
export { SplitComponent as component };
