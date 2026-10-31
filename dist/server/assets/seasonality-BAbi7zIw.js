import { W as cn, Y as fmtSigned, d as useClock } from "./shell-B4EHQ9b6.js";
import { n as IntelPage } from "./page-Crv803Pc.js";
import { n as BoundBar } from "./chart-BfgsPjdW.js";
import { n as seasonality, t as seasonHistory } from "./seasonality-CSHrAXBD.js";
import { useMemo, useState } from "react";
import { jsx, jsxs } from "react/jsx-runtime";
//#region src/components/intel/seasonality-view.tsx
function SeasonalityView() {
	const asOf = useClock();
	const rows = useMemo(() => seasonality(asOf), [asOf]);
	const [sel, setSel] = useState(rows[0]?.symbol ?? "WTI");
	const card = rows.find((r) => r.symbol === sel) ?? rows[0];
	const hist = seasonHistory(sel);
	const month = new Date(asOf).toLocaleString("en-GB", {
		month: "long",
		timeZone: "UTC"
	});
	return /* @__PURE__ */ jsxs(IntelPage, {
		title: "Seasonality",
		kicker: `${month} · how the book usually behaves now`,
		children: [/* @__PURE__ */ jsx("div", {
			className: "overflow-x-auto",
			children: /* @__PURE__ */ jsxs("table", {
				className: "w-full min-w-[760px] text-left font-mono text-[12px]",
				children: [/* @__PURE__ */ jsx("thead", {
					className: "text-[10px] tracking-wider text-fg-subtle uppercase",
					children: /* @__PURE__ */ jsx("tr", { children: [
						"Asset",
						"Class",
						"This m avg",
						"Win %",
						"σ",
						"Now",
						"vs season",
						"Next m"
					].map((h) => /* @__PURE__ */ jsx("th", {
						className: "px-3 py-2",
						children: h
					}, h)) })
				}), /* @__PURE__ */ jsx("tbody", { children: rows.map((r) => /* @__PURE__ */ jsxs("tr", {
					className: "cursor-pointer border-t border-border hover:bg-bg-hover",
					onClick: () => setSel(r.symbol),
					children: [
						/* @__PURE__ */ jsx("td", {
							className: "px-3 py-2",
							children: r.symbol
						}),
						/* @__PURE__ */ jsx("td", {
							className: "px-3 text-fg-muted",
							children: r.cls
						}),
						/* @__PURE__ */ jsxs("td", {
							className: cn("px-3", r.thisMonth.avg >= 0 ? "text-bull" : "text-bear"),
							children: [fmtSigned(r.thisMonth.avg, 2), "%"]
						}),
						/* @__PURE__ */ jsxs("td", {
							className: "px-3",
							children: [r.thisMonth.win, "%"]
						}),
						/* @__PURE__ */ jsx("td", {
							className: "px-3 text-fg-muted",
							children: r.thisMonth.std
						}),
						/* @__PURE__ */ jsxs("td", {
							className: cn("px-3", r.now >= 0 ? "text-bull" : "text-bear"),
							children: [fmtSigned(r.now, 2), "%"]
						}),
						/* @__PURE__ */ jsx("td", {
							className: cn("px-3", r.vsSeason >= 0 ? "text-bull" : "text-bear"),
							children: fmtSigned(r.vsSeason, 2)
						}),
						/* @__PURE__ */ jsxs("td", {
							className: "px-3 text-fg-muted",
							children: [fmtSigned(r.nextMonth.avg, 2), "%"]
						})
					]
				}, r.symbol)) })]
			})
		}), /* @__PURE__ */ jsxs("div", {
			className: "border-t border-border p-3 md:p-4",
			children: [
				/* @__PURE__ */ jsxs("h2", {
					className: "text-sm font-medium",
					children: [
						card.symbol,
						" · ",
						card.name
					]
				}),
				/* @__PURE__ */ jsxs("p", {
					className: "mt-1 text-[12px] text-fg-muted",
					children: [
						card.thisMonth.label,
						": mean ",
						card.thisMonth.avg,
						"% over ",
						card.thisMonth.n,
						" years · win ",
						card.thisMonth.win,
						"% · best ",
						card.thisMonth.best,
						"% / worst ",
						card.thisMonth.worst,
						"%. Current session vs that mean: ",
						fmtSigned(card.vsSeason, 2),
						"."
					]
				}),
				/* @__PURE__ */ jsx("div", {
					className: "mt-3 h-48 rounded-md border border-border bg-bg-elevated p-2",
					children: /* @__PURE__ */ jsx(BoundBar, {
						data: hist,
						xKey: "m",
						yKey: "avg",
						color: "var(--accent)"
					})
				}),
				/* @__PURE__ */ jsx("div", {
					className: "mt-4 grid grid-cols-6 gap-1 sm:grid-cols-12",
					children: card.heatmap.map((m) => /* @__PURE__ */ jsxs("div", {
						className: "rounded-xs px-1 py-2 text-center font-mono text-[10px]",
						style: { background: m.avg > .4 ? "color-mix(in oklab, var(--bull) 45%, transparent)" : m.avg < -.3 ? "color-mix(in oklab, var(--bear) 45%, transparent)" : "var(--bg-panel)" },
						children: [/* @__PURE__ */ jsx("div", {
							className: cn(m.month === card.currentMonth && "text-accent"),
							children: m.label.slice(0, 3)
						}), /* @__PURE__ */ jsx("div", { children: m.avg.toFixed(1) })]
					}, m.month))
				})
			]
		})]
	});
}
//#endregion
//#region src/routes/seasonality.tsx?tsr-split=component
var SplitComponent = SeasonalityView;
//#endregion
export { SplitComponent as component };
