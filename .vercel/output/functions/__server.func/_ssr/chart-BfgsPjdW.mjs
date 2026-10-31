import { C as require_jsx_runtime } from "../_libs/@tanstack/react-router+[...].mjs";
import { a as YAxis, c as Area, d as Bar, f as ResponsiveContainer, i as LineChart, l as Line, n as ScatterChart, o as XAxis, p as Tooltip, r as BarChart, s as Scatter, t as AreaChart, u as CartesianGrid } from "../_libs/recharts+[...].mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/chart-BfgsPjdW.js
var import_jsx_runtime = require_jsx_runtime();
var TOOLTIP_STYLE = {
	background: "#101214",
	border: "1px solid rgba(230,232,235,0.12)",
	fontSize: 11,
	color: "#e6e8eb",
	fontFamily: "IBM Plex Mono, ui-monospace, monospace"
};
var TICK = {
	fill: "#8b939e",
	fontSize: 10,
	fontFamily: "IBM Plex Mono, ui-monospace, monospace"
};
function padDomain(values, pad = .1) {
	const finite = values.filter((v) => Number.isFinite(v));
	if (!finite.length) return [0, 1];
	const lo = Math.min(...finite);
	const hi = Math.max(...finite);
	const span = hi - lo || Math.abs(hi) * .08 || 1;
	return [lo - span * pad, hi + span * pad];
}
function fmtTick(v) {
	const a = Math.abs(v);
	if (a >= 1e3) return v.toFixed(0);
	if (a >= 100) return v.toFixed(1);
	if (a >= 10) return v.toFixed(1);
	if (a >= 1) return v.toFixed(2);
	return v.toFixed(3);
}
function BoundArea({ data, xKey, yKey, color = "var(--accent)", xFormatter, yFormatter }) {
	const domain = padDomain(data.map((d) => Number(d[yKey])));
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ResponsiveContainer, {
		width: "100%",
		height: "100%",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AreaChart, {
			data,
			margin: {
				top: 10,
				right: 12,
				left: 0,
				bottom: 4
			},
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CartesianGrid, {
					stroke: "rgba(230,232,235,0.06)",
					vertical: false
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(XAxis, {
					dataKey: xKey,
					tick: TICK,
					stroke: "rgba(230,232,235,0.16)",
					tickLine: false,
					tickFormatter: xFormatter
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(YAxis, {
					domain,
					tick: TICK,
					stroke: "rgba(230,232,235,0.16)",
					tickLine: false,
					width: 52,
					tickFormatter: yFormatter ?? fmtTick
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Tooltip, { contentStyle: TOOLTIP_STYLE }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Area, {
					type: "monotone",
					dataKey: yKey,
					stroke: color,
					fill: color,
					fillOpacity: .12
				})
			]
		})
	});
}
function BoundLine({ data, xKey, series, xFormatter }) {
	const domain = padDomain(data.flatMap((d) => series.map((s) => Number(d[s.key]))));
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ResponsiveContainer, {
		width: "100%",
		height: "100%",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(LineChart, {
			data,
			margin: {
				top: 10,
				right: 12,
				left: 0,
				bottom: 4
			},
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CartesianGrid, {
					stroke: "rgba(230,232,235,0.06)",
					vertical: false
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(XAxis, {
					dataKey: xKey,
					tick: TICK,
					stroke: "rgba(230,232,235,0.16)",
					tickLine: false,
					tickFormatter: xFormatter
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(YAxis, {
					domain,
					tick: TICK,
					stroke: "rgba(230,232,235,0.16)",
					tickLine: false,
					width: 52,
					tickFormatter: fmtTick
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Tooltip, { contentStyle: TOOLTIP_STYLE }),
				series.map((s) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Line, {
					type: "monotone",
					dataKey: s.key,
					name: s.name ?? s.key,
					stroke: s.color,
					dot: false,
					strokeWidth: 1.5
				}, s.key))
			]
		})
	});
}
function BoundBar({ data, xKey, yKey, color = "var(--accent)" }) {
	const domain = padDomain(data.map((d) => Number(d[yKey])), .05);
	domain[0] = Math.min(0, domain[0]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ResponsiveContainer, {
		width: "100%",
		height: "100%",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(BarChart, {
			data,
			margin: {
				top: 10,
				right: 8,
				left: 0,
				bottom: 4
			},
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CartesianGrid, {
					stroke: "rgba(230,232,235,0.06)",
					vertical: false
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(XAxis, {
					dataKey: xKey,
					tick: TICK,
					stroke: "rgba(230,232,235,0.16)",
					tickLine: false
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(YAxis, {
					domain,
					tick: TICK,
					stroke: "rgba(230,232,235,0.16)",
					tickLine: false,
					width: 40,
					tickFormatter: fmtTick
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Tooltip, { contentStyle: TOOLTIP_STYLE }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Bar, {
					dataKey: yKey,
					fill: color
				})
			]
		})
	});
}
function BoundScatter({ data, xKey, yKey, color = "var(--accent)", highlight }) {
	const xs = data.map((d) => Number(d[xKey]));
	const ys = data.map((d) => Number(d[yKey]));
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ResponsiveContainer, {
		width: "100%",
		height: "100%",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(ScatterChart, {
			margin: {
				top: 10,
				right: 12,
				left: 0,
				bottom: 4
			},
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CartesianGrid, { stroke: "rgba(230,232,235,0.06)" }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(XAxis, {
					dataKey: xKey,
					type: "number",
					domain: padDomain(xs),
					tick: TICK,
					stroke: "rgba(230,232,235,0.16)",
					tickLine: false,
					tickFormatter: fmtTick
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(YAxis, {
					dataKey: yKey,
					type: "number",
					domain: padDomain(ys),
					tick: TICK,
					stroke: "rgba(230,232,235,0.16)",
					tickLine: false,
					width: 52,
					tickFormatter: fmtTick
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Tooltip, { contentStyle: TOOLTIP_STYLE }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Scatter, {
					data,
					fill: color,
					fillOpacity: .35
				}),
				highlight && highlight.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Scatter, {
					data: highlight,
					fill: "var(--warn)"
				})
			]
		})
	});
}
//#endregion
export { BoundScatter as i, BoundBar as n, BoundLine as r, BoundArea as t };
