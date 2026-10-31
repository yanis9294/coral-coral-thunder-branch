import { i as __toESM } from "../_runtime.mjs";
import { C as require_jsx_runtime, Z as require_react, b as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { a as Layers, l as ChevronDown, t as X } from "../_libs/lucide-react.mjs";
import { r as Route$20 } from "./router-DvyZGEHi.mjs";
import { C as cn, O as fmtNum, T as countryScore, _ as allCountryIntel, et as useClock, g as TerminalShell, i as Delta, it as utcStamp, nt as utcDate, p as SeverityPill, r as DESK_EPOCH, rt as utcFull, s as GRID_LAYERS, tt as useTerminal, w as countryIntel, x as clamp } from "./shell-B4EHQ9b6.mjs";
import { _ as tradeFlows, a as flights, b as zones, g as ships, h as quakes, i as anomalies, n as REF_POINTS, p as pmGeos, r as REF_SECTIONS, s as geoNews, t as POP_CITIES, u as liveStudios } from "./calculated-DX17ibxV.mjs";
import { a as contains_default, i as graticule10, n as naturalEarth1_default, o as centroid_default, r as path_default, t as orthographic_default } from "../_libs/d3-geo.mjs";
import { t as feature_default } from "../_libs/topojson-client.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/routes-3WnBMU8u.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var CADENCE = {
	SEIS: "5m",
	AIS: "30s",
	MIL: "30s",
	ZONE: "2m",
	PM: "2m",
	NEWS: "30s",
	TRADE: "struct",
	POP: "struct",
	POWER: "struct",
	LIVE: "load",
	TICKER: "live"
};
function LayerRail() {
	const grid = useTerminal((s) => s.grid);
	const toggleGrid = useTerminal((s) => s.toggleGrid);
	const ref = useTerminal((s) => s.ref);
	const toggleRef = useTerminal((s) => s.toggleRef);
	const mapMode = useTerminal((s) => s.mapMode);
	const setMapMode = useTerminal((s) => s.setMapMode);
	const topo = useTerminal((s) => s.topo);
	const setTopo = useTerminal((s) => s.setTopo);
	const fly = useTerminal((s) => s.fly);
	const setFly = useTerminal((s) => s.setFly);
	const countryColor = useTerminal((s) => s.countryColor);
	const setCountryColor = useTerminal((s) => s.setCountryColor);
	const lowPower = useTerminal((s) => s.lowPower);
	const setLowPower = useTerminal((s) => s.setLowPower);
	const asOf = useClock();
	const [open, setOpen] = (0, import_react.useState)(false);
	const counts = {
		SEIS: quakes(asOf).length,
		AIS: ships(asOf).length,
		MIL: flights(asOf).length,
		ZONE: zones(asOf).length,
		PM: pmGeos().length,
		NEWS: geoNews(asOf).length,
		LIVE: liveStudios().filter((s) => s.onAir).length
	};
	const body = /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "px-3 py-2 font-mono text-[10px] tracking-[0.16em] text-fg-subtle uppercase",
			children: "Grid"
		}),
		GRID_LAYERS.map((k) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
			className: "flex h-8 cursor-pointer items-center gap-2 px-3 text-[12px] hover:bg-bg-hover",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
					type: "checkbox",
					checked: grid[k],
					onChange: () => toggleGrid(k),
					className: "size-3.5 accent-accent"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "font-mono text-[11px] tracking-wide",
					children: k
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "ml-auto tabular font-mono text-[10px] text-fg-subtle",
					children: counts[k] ?? CADENCE[k]
				})
			]
		}, k)),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "mt-1 border-t border-border px-3 py-2 font-mono text-[10px] tracking-[0.16em] text-fg-subtle uppercase",
			children: "Reference"
		}),
		REF_SECTIONS.map((sec) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(RefGroup, {
			label: sec.section,
			children: sec.layers.map((l) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
				className: "flex h-8 cursor-pointer items-center gap-2 px-3 text-[12px] hover:bg-bg-hover",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
					type: "checkbox",
					checked: ref[l.id],
					onChange: () => toggleRef(l.id),
					className: "size-3.5 accent-accent"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: l.label })]
			}, l.id))
		}, sec.section)),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "mt-1 border-t border-border px-3 py-2 font-mono text-[10px] tracking-[0.16em] text-fg-subtle uppercase",
			children: "Display"
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "flex gap-1 px-3 pb-2",
			children: ["globe", "flat"].map((m) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
				type: "button",
				onClick: () => setMapMode(m),
				className: cn("h-7 flex-1 rounded-sm font-mono text-[10px] tracking-wide uppercase", mapMode === m ? "bg-accent text-accent-fg" : "bg-bg-panel text-fg-muted"),
				children: m
			}, m))
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "flex gap-1 px-3 pb-2",
			children: ["econ", "news"].map((m) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
				type: "button",
				onClick: () => setCountryColor(m),
				className: cn("h-7 flex-1 rounded-sm font-mono text-[10px] tracking-wide uppercase", countryColor === m ? "bg-accent text-accent-fg" : "bg-bg-panel text-fg-muted"),
				children: m
			}, m))
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ToggleRow, {
			label: "Topo",
			on: topo,
			set: setTopo
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ToggleRow, {
			label: "Fly",
			on: fly,
			set: setFly
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ToggleRow, {
			label: "Low power",
			on: lowPower,
			set: setLowPower
		})
	] });
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("aside", {
			className: "hidden w-[200px] shrink-0 flex-col overflow-y-auto border-r border-border bg-bg-elevated terminal-scroll md:flex",
			children: body
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
			type: "button",
			className: "absolute top-2 left-2 z-20 flex size-10 items-center justify-center rounded-sm border border-border bg-bg-elevated md:hidden",
			onClick: () => setOpen((v) => !v),
			"aria-label": "Layers",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Layers, { className: "size-4" })
		}),
		open && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "absolute inset-y-0 left-0 z-30 w-[220px] overflow-y-auto border-r border-border bg-bg-elevated md:hidden terminal-scroll",
			children: body
		})
	] });
}
function ToggleRow({ label, on, set }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
		type: "button",
		onClick: () => set(!on),
		className: "flex h-8 w-full items-center justify-between px-3 text-[12px] hover:bg-bg-hover",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: label }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
			className: cn("font-mono text-[10px]", on ? "text-bull" : "text-fg-subtle"),
			children: on ? "ON" : "OFF"
		})]
	});
}
function RefGroup({ label, children }) {
	const [open, setOpen] = (0, import_react.useState)(true);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
		type: "button",
		className: "flex h-8 w-full items-center justify-between px-3 font-mono text-[10px] tracking-wider text-fg-muted uppercase hover:bg-bg-hover",
		onClick: () => setOpen((v) => !v),
		children: [label, /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronDown, { className: cn("size-3.5 transition-transform", !open && "-rotate-90") })]
	}), open && children] });
}
var TABS = [
	{
		id: "feed",
		label: "Feed"
	},
	{
		id: "bank",
		label: "Bank"
	},
	{
		id: "desk",
		label: "Desk"
	},
	{
		id: "pm",
		label: "PM"
	}
];
function MonitorSide() {
	const panel = useTerminal((s) => s.sidePanel);
	const asOf = useClock();
	const setSelection = useTerminal((s) => s.setSelection);
	const bank = useTerminal((s) => s.bankArticles);
	const live = useTerminal((s) => s.bankFeedLive);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("aside", {
		className: "hidden w-[320px] shrink-0 flex-col border-l border-border bg-bg-elevated lg:flex",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "flex h-9 shrink-0 border-b border-border",
			children: TABS.map((t) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
				type: "button",
				onClick: () => useTerminal.setState({ sidePanel: t.id }),
				className: cn("relative flex-1 font-mono text-[10px] tracking-wider uppercase", panel === t.id ? "text-fg" : "text-fg-muted hover:text-fg"),
				children: [t.label, panel === t.id && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "absolute inset-x-3 bottom-0 h-px bg-accent" })]
			}, t.id))
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "min-h-0 flex-1 overflow-y-auto terminal-scroll",
			children: [
				panel === "feed" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("ul", { children: [anomalies(asOf).map((a) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
					className: "border-b border-border px-3 py-2.5",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "mb-1 flex items-center gap-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SeverityPill, { value: a.severity }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "ml-auto font-mono text-[10px] text-fg-subtle",
								children: utcStamp(a.ts)
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "text-[12px] leading-snug",
							children: a.title
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-1 text-[11px] leading-relaxed text-fg-muted",
							children: a.body
						})
					]
				}, a.id)), geoNews(asOf).map((n) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
					type: "button",
					className: "w-full border-b border-border px-3 py-2.5 text-left hover:bg-bg-hover",
					onClick: () => setSelection({
						kind: "news",
						id: n.id
					}),
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mb-1 flex items-center gap-2",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SeverityPill, { value: n.severity }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "font-mono text-[10px] text-fg-subtle",
								children: n.source
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "ml-auto font-mono text-[10px] text-fg-subtle",
								children: utcStamp(n.ts)
							})
						]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "text-[12px] leading-snug",
						children: n.title
					})]
				}) }, n.id))] }),
				panel === "bank" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("ul", { children: [
					bank.length === 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", {
						className: "p-3 text-[12px] text-fg-muted",
						children: "Open Bank (F12) to pull the live street tape."
					}),
					bank.slice(0, 18).map((n) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
						className: "border-b border-border px-3 py-2.5",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "mb-1 flex items-center gap-2 font-mono text-[10px] text-fg-subtle",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-accent",
								children: n.house
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "ml-auto",
								children: utcDate(n.ts)
							})]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "text-[12px] leading-snug",
							children: n.title
						})]
					}, n.id)),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", {
						className: "p-3",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
							to: "/bank",
							className: "font-mono text-[11px] text-accent no-underline",
							children: live ? "Open live Bank →" : "Open Bank →"
						})
					})
				] }),
				panel === "desk" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", { children: zones(asOf).map((z) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
					type: "button",
					className: "w-full border-b border-border px-3 py-2.5 text-left hover:bg-bg-hover",
					onClick: () => setSelection({
						kind: "zone",
						id: z.id
					}),
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "mb-1 flex items-center gap-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SeverityPill, { value: z.severity }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
								className: "font-mono text-[10px] text-fg-subtle",
								children: ["RISK ", z.risk.toFixed(1)]
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "text-[12px] font-medium",
							children: z.name
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "font-mono text-[10px] text-fg-subtle",
							children: z.arc
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-1 text-[11px] leading-relaxed text-fg-muted",
							children: z.note
						})
					]
				}) }, z.id)) }),
				panel === "pm" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", { children: pmGeos().slice().sort((a, b) => Math.abs(b.delta24) - Math.abs(a.delta24)).map((m) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
					to: "/markets",
					className: "flex w-full items-start justify-between gap-2 border-b border-border px-3 py-2.5 no-underline hover:bg-bg-hover",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "min-w-0",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "truncate text-[12px] text-fg",
							children: m.title
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "font-mono text-[10px] text-fg-subtle",
							children: m.category
						})]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "shrink-0 text-right",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "tabular font-mono text-[12px]",
							children: [Math.round(m.prob * 100), "%"]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Delta, { n: m.delta24 * 100 })]
					})]
				}) }, m.id)) })
			]
		})]
	});
}
function ObjectCard({ selection, asOf, onClose }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "absolute top-3 right-3 z-10 w-[min(340px,calc(100%-1.5rem))] rounded-md border border-border-strong bg-bg-elevated/95 shadow-xl",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex items-center justify-between border-b border-border px-3 py-2",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "font-mono text-[10px] tracking-[0.14em] text-fg-subtle uppercase",
				children: selection.kind
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
				type: "button",
				onClick: onClose,
				className: "flex size-7 items-center justify-center text-fg-muted hover:text-fg",
				"aria-label": "Close",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { className: "size-3.5" })
			})]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "max-h-[50vh] overflow-y-auto p-3 terminal-scroll",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Body, {
				selection,
				asOf
			})
		})]
	});
}
function Body({ selection, asOf }) {
	if (selection.kind === "country") {
		const c = countryIntel(selection.id, asOf);
		if (!c) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "text-sm text-fg-muted",
			children: "No desk brief for this territory."
		});
		return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "space-y-3",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "text-base font-medium tracking-tight",
					children: c.name
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "font-mono text-[11px] text-fg-subtle",
					children: [
						c.iso3,
						" · ",
						c.capital,
						" · ",
						c.region
					]
				})] }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-[12px] leading-relaxed text-fg-muted",
					children: c.brief
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("dl", {
					className: "grid grid-cols-2 gap-x-3 gap-y-2 font-mono text-[11px]",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Row, {
							k: "GDP",
							v: c.gdp
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Row, {
							k: "FX",
							v: c.fx
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Row, {
							k: "Yields",
							v: c.yields
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Row, {
							k: "Pop",
							v: `${c.populationM}m`
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Row, {
							k: "Power",
							v: String(c.power)
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Row, {
							k: "Econ",
							v: fmtNum(c.econ, 0),
							bull: c.econ
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Row, {
							k: "News",
							v: fmtNum(c.news, 0),
							bull: c.news
						})
					]
				})
			]
		});
	}
	if (selection.kind === "zone") {
		const z = zones(asOf).find((x) => x.id === selection.id);
		if (!z) return null;
		return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "space-y-2",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center gap-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SeverityPill, { value: z.severity }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
						className: "font-mono text-[11px] text-fg-subtle",
						children: ["RISK ", z.risk.toFixed(1)]
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "text-base font-medium",
					children: z.name
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "font-mono text-[11px] text-fg-subtle",
					children: z.arc
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-[12px] leading-relaxed text-fg-muted",
					children: z.note
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "font-mono text-[10px] text-fg-subtle",
					children: utcFull(z.updated)
				})
			]
		});
	}
	if (selection.kind === "ais") {
		const s = ships(asOf).find((x) => x.id === selection.id);
		if (!s) return null;
		return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("dl", {
			className: "space-y-1 font-mono text-[12px]",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "font-sans text-base font-medium",
					children: s.name
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Row, {
					k: "Flag",
					v: s.flag
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Row, {
					k: "Type",
					v: s.type
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Row, {
					k: "Lane",
					v: s.lane
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Row, {
					k: "Dest",
					v: s.dest
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Row, {
					k: "Speed",
					v: `${s.speedKn} kn`
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Row, {
					k: "Heading",
					v: `${Math.round(s.heading)}°`
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Row, {
					k: "Draught",
					v: `${s.draught} m`
				})
			]
		});
	}
	if (selection.kind === "mil") {
		const f = flights(asOf).find((x) => x.id === selection.id);
		if (!f) return null;
		return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("dl", {
			className: "space-y-1 font-mono text-[12px]",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "font-sans text-base font-medium",
					children: f.callsign
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Row, {
					k: "Op",
					v: f.operator
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Row, {
					k: "Type",
					v: f.type
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Row, {
					k: "Alt",
					v: `${fmtNum(f.altFt, 0)} ft`
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Row, {
					k: "Speed",
					v: `${f.speedKt} kt`
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Row, {
					k: "From",
					v: f.from
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Row, {
					k: "To",
					v: f.to
				})
			]
		});
	}
	if (selection.kind === "seis") {
		const q = quakes(asOf).find((x) => x.id === selection.id);
		if (!q) return null;
		return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "space-y-2",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SeverityPill, { value: q.severity }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "text-base font-medium",
					children: q.place
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("dl", {
					className: "font-mono text-[12px]",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Row, {
							k: "Mag",
							v: q.mag.toFixed(1)
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Row, {
							k: "Depth",
							v: `${q.depthKm} km`
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Row, {
							k: "Time",
							v: utcFull(q.ts)
						})
					]
				})
			]
		});
	}
	if (selection.kind === "pm") {
		const m = pmGeos().find((x) => x.id === selection.id);
		if (!m) return null;
		return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "space-y-2",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "text-sm font-medium leading-snug",
					children: m.title
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-baseline gap-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
						className: "tabular font-mono text-xl",
						children: [Math.round(m.prob * 100), "%"]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Delta, { n: m.delta24 * 100 })]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "font-mono text-[11px] text-fg-subtle",
					children: [
						m.category,
						" · vol $",
						m.volume,
						"m"
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
					to: "/markets",
					className: "inline-block font-mono text-[11px] text-accent no-underline",
					children: "Open Markets →"
				})
			]
		});
	}
	if (selection.kind === "news") {
		const n = geoNews(asOf).find((x) => x.id === selection.id);
		if (!n) return null;
		return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "space-y-2",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SeverityPill, { value: n.severity }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "text-sm font-medium leading-snug",
					children: n.title
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-[12px] leading-relaxed text-fg-muted",
					children: n.summary
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "font-mono text-[10px] text-fg-subtle",
					children: [
						n.source,
						" · ",
						utcFull(n.ts)
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
					to: "/news",
					className: "inline-block font-mono text-[11px] text-accent no-underline",
					children: "News view →"
				})
			]
		});
	}
	if (selection.kind === "live") {
		const s = liveStudios().find((x) => x.id === selection.id);
		if (!s) return null;
		return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "space-y-2",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "text-base font-medium",
					children: s.name
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "font-mono text-[11px] text-fg-subtle",
					children: [
						s.city,
						" · ",
						s.onAir ? "ON AIR" : "OFF AIR"
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-[12px] text-fg-muted",
					children: s.headline
				})
			]
		});
	}
	if (selection.kind === "ref") {
		const r = REF_POINTS.find((x) => x.id === selection.id);
		if (!r) return null;
		return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "space-y-2",
			children: [
				r.severity && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SeverityPill, { value: r.severity }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "text-base font-medium",
					children: r.name
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "font-mono text-[11px] text-fg-subtle",
					children: r.layer
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-[12px] text-fg-muted",
					children: r.note
				})
			]
		});
	}
	return null;
}
function Row({ k, v, bull }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex items-baseline justify-between gap-3 py-0.5",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("dt", {
			className: "text-fg-subtle",
			children: k
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("dd", {
			className: bull == null ? "text-fg" : bull >= 0 ? "text-bull" : "text-bear",
			children: v
		})]
	});
}
var WINDOW_MS = 6048e5;
function TimeSlider() {
	const stored = useTerminal((s) => s.asOf);
	const setAsOf = useTerminal((s) => s.setAsOf);
	const liveNow = useClock();
	const now = stored == null ? liveNow : Date.now();
	const min = DESK_EPOCH - WINDOW_MS;
	const max = Math.max(DESK_EPOCH, now);
	const value = stored ?? max;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "absolute inset-x-0 bottom-0 z-10 flex items-center gap-3 border-t border-border bg-bg-elevated/90 px-3 py-1.5",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
				type: "button",
				onClick: () => setAsOf(null),
				className: `h-6 shrink-0 rounded-xs px-2 font-mono text-[10px] tracking-wide ${stored == null ? "bg-bull/20 text-bull" : "text-fg-muted hover:text-fg"}`,
				children: "LIVE"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
				type: "range",
				min,
				max,
				step: 36e5,
				value,
				onChange: (e) => setAsOf(Number(e.target.value)),
				className: "h-1 flex-1 cursor-pointer accent-accent",
				"aria-label": "Time slider"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
				className: "hidden shrink-0 tabular font-mono text-[10px] text-fg-muted sm:inline",
				children: [
					utcDate(value),
					" ",
					utcStamp(value),
					" UTC"
				]
			})
		]
	});
}
function WorldMap() {
	const canvasRef = (0, import_react.useRef)(null);
	const wrapRef = (0, import_react.useRef)(null);
	const asOf = useClock();
	const { mapMode, topo, fly, countryColor, grid, ref, selection, setSelection, lowPower } = useTerminal();
	const [geo, setGeo] = (0, import_react.useState)(null);
	const rot = (0, import_react.useRef)([-20, -22]);
	const scaleMul = (0, import_react.useRef)(1);
	const pan = (0, import_react.useRef)([0, 0]);
	const hover = (0, import_react.useRef)(null);
	const [hoverUi, setHoverUi] = (0, import_react.useState)(null);
	const drag = (0, import_react.useRef)(null);
	const size = (0, import_react.useRef)({
		w: 0,
		h: 0
	});
	const geoRef = (0, import_react.useRef)(geo);
	geoRef.current = geo;
	const asOfRef = (0, import_react.useRef)(asOf);
	asOfRef.current = asOf;
	(0, import_react.useEffect)(() => {
		let dead = false;
		Promise.all([fetch("/geo/countries-110m.json").then((r) => r.json()), fetch("/geo/land-110m.json").then((r) => r.json())]).then(([c, l]) => {
			if (dead) return;
			const countries = feature_default(c, c.objects.countries);
			const land = feature_default(l, l.objects.land);
			setGeo({
				countries,
				land
			});
		});
		return () => {
			dead = true;
		};
	}, []);
	(0, import_react.useEffect)(() => {
		if (!fly || !selection || !geo) return;
		const target = centroidOf(selection, geo.countries, asOf);
		if (!target) return;
		const [lat, lng] = target;
		rot.current = [-lng, -lat];
		draw();
	}, [
		selection,
		fly,
		geo
	]);
	function projection(w, h) {
		if (mapMode === "globe") return orthographic_default().rotate([
			rot.current[0],
			rot.current[1],
			0
		]).translate([w / 2, h / 2]).scale(Math.min(w, h) * .42 * scaleMul.current).clipAngle(90);
		return naturalEarth1_default().translate([w / 2 + pan.current[0], h / 2 + pan.current[1]]).scale(Math.min(w, h) * .22 * scaleMul.current);
	}
	function draw() {
		const canvas = canvasRef.current;
		const g = geoRef.current;
		if (!canvas || !g) return;
		const ctx = canvas.getContext("2d");
		if (!ctx) return;
		const dpr = Math.min(window.devicePixelRatio || 1, lowPower ? 1 : 2);
		const w = size.current.w;
		const h = size.current.h;
		if (w < 2 || h < 2) return;
		canvas.width = Math.floor(w * dpr);
		canvas.height = Math.floor(h * dpr);
		canvas.style.width = `${w}px`;
		canvas.style.height = `${h}px`;
		ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
		const cs = getComputedStyle(document.documentElement);
		const ocean = cs.getPropertyValue("--map-ocean").trim() || "#0c1016";
		const landC = cs.getPropertyValue("--map-land").trim() || "#1a222c";
		const borderC = cs.getPropertyValue("--map-border").trim() || "rgba(183,201,212,0.22)";
		const grat = cs.getPropertyValue("--map-graticule").trim() || "rgba(183,201,212,0.08)";
		const fg = cs.getPropertyValue("--fg").trim() || "#e6e8eb";
		const bull = cs.getPropertyValue("--bull").trim() || "#3dba86";
		const bear = cs.getPropertyValue("--bear").trim() || "#e25c4a";
		const accent = cs.getPropertyValue("--accent").trim() || "#b7c9d4";
		const warn = cs.getPropertyValue("--warn").trim() || "#c9a36a";
		const high = cs.getPropertyValue("--high").trim() || "#d4784a";
		ctx.fillStyle = cs.getPropertyValue("--bg").trim() || "#08090b";
		ctx.fillRect(0, 0, w, h);
		const proj = projection(w, h);
		const path = path_default(proj, ctx);
		const t = asOfRef.current;
		if (mapMode === "globe") {
			if (!lowPower) {
				ctx.fillStyle = "rgba(230,232,235,0.18)";
				for (let i = 0; i < 90; i++) {
					const x = i * 97 % w + .5;
					const y = i * 53 % h + .5;
					const cx = w / 2;
					const cy = h / 2;
					const r = Math.min(w, h) * .42 * scaleMul.current;
					if (Math.hypot(x - cx, y - cy) > r + 8) ctx.fillRect(x, y, 1, 1);
				}
			}
			ctx.beginPath();
			path({ type: "Sphere" });
			ctx.fillStyle = ocean;
			ctx.fill();
			ctx.strokeStyle = accent;
			ctx.globalAlpha = .35;
			ctx.lineWidth = 1;
			ctx.stroke();
			ctx.globalAlpha = 1;
		} else {
			ctx.fillStyle = ocean;
			ctx.fillRect(0, 0, w, h);
		}
		ctx.beginPath();
		path(graticule10());
		ctx.strokeStyle = grat;
		ctx.lineWidth = .6;
		ctx.stroke();
		const mode = useTerminal.getState().countryColor;
		for (const f of g.countries.features) {
			const id = String(f.id ?? "");
			const score = countryScore(id, t, mode);
			ctx.beginPath();
			path(f);
			ctx.fillStyle = choropleth(score, landC, bull, bear, topo ? hashNoise(id) : 0);
			ctx.fill();
		}
		ctx.beginPath();
		path(g.countries);
		ctx.strokeStyle = borderC;
		ctx.lineWidth = .5;
		ctx.stroke();
		if (selection?.kind === "country") {
			const f = g.countries.features.find((x) => String(x.id) === selection.id);
			if (f) {
				ctx.beginPath();
				path(f);
				ctx.strokeStyle = accent;
				ctx.lineWidth = 1.6;
				ctx.stroke();
			}
		}
		const put = (lng, lat) => proj([lng, lat]);
		if (grid.TRADE) {
			ctx.lineWidth = 1;
			for (const tr of tradeFlows()) {
				const a = put(tr.from.lng, tr.from.lat);
				const b = put(tr.to.lng, tr.to.lat);
				if (!a || !b) continue;
				ctx.strokeStyle = accent;
				ctx.globalAlpha = .28;
				ctx.beginPath();
				ctx.moveTo(a[0], a[1]);
				const mx = (a[0] + b[0]) / 2;
				const my = (a[1] + b[1]) / 2 - 28;
				ctx.quadraticCurveTo(mx, my, b[0], b[1]);
				ctx.stroke();
				ctx.globalAlpha = 1;
			}
		}
		if (grid.POP) for (const c of POP_CITIES) {
			const p = put(c.lng, c.lat);
			if (!p) continue;
			ctx.beginPath();
			ctx.arc(p[0], p[1], Math.sqrt(c.popM) * 1.6, 0, Math.PI * 2);
			ctx.fillStyle = "rgba(183,201,212,0.12)";
			ctx.fill();
		}
		if (grid.POWER) for (const c of allCountryIntel(t)) {
			const p = put(c.lng, c.lat);
			if (!p) continue;
			ctx.beginPath();
			ctx.arc(p[0], p[1], c.power / 14, 0, Math.PI * 2);
			ctx.strokeStyle = accent;
			ctx.globalAlpha = .45;
			ctx.lineWidth = 1;
			ctx.stroke();
			ctx.globalAlpha = 1;
		}
		const activeRef = Object.entries(ref).filter(([, v]) => v).map(([k]) => k);
		for (const rp of REF_POINTS) {
			if (!activeRef.includes(rp.layer)) continue;
			const p = put(rp.lng, rp.lat);
			if (!p) continue;
			ctx.fillStyle = rp.severity === "CRITICAL" ? bear : rp.severity === "HIGH" ? high : accent;
			ctx.beginPath();
			ctx.rect(p[0] - 2.5, p[1] - 2.5, 5, 5);
			ctx.fill();
		}
		if (grid.ZONE) for (const z of zones(t)) {
			const p = put(z.lng, z.lat);
			if (!p) continue;
			const col = z.severity === "CRITICAL" ? bear : z.severity === "HIGH" ? high : warn;
			ctx.strokeStyle = col;
			ctx.globalAlpha = .55;
			ctx.lineWidth = 1.4;
			ctx.setLineDash([4, 3]);
			ctx.beginPath();
			ctx.arc(p[0], p[1], 18 + z.risk, 0, Math.PI * 2);
			ctx.stroke();
			ctx.setLineDash([]);
			ctx.globalAlpha = .18;
			ctx.fillStyle = col;
			ctx.fill();
			ctx.globalAlpha = 1;
			ctx.fillStyle = fg;
			ctx.font = "500 10px 'IBM Plex Sans', sans-serif";
			ctx.fillText(z.name, p[0] + 14, p[1] - 6);
		}
		if (grid.SEIS) for (const q of quakes(t)) {
			const p = put(q.lng, q.lat);
			if (!p) continue;
			ctx.beginPath();
			ctx.arc(p[0], p[1], q.mag * 1.6, 0, Math.PI * 2);
			ctx.strokeStyle = warn;
			ctx.globalAlpha = .7;
			ctx.lineWidth = 1;
			ctx.stroke();
			ctx.globalAlpha = 1;
			ctx.fillStyle = warn;
			ctx.beginPath();
			ctx.arc(p[0], p[1], 2, 0, Math.PI * 2);
			ctx.fill();
		}
		if (grid.AIS) for (const s of ships(t)) {
			const p = put(s.lng, s.lat);
			if (!p) continue;
			chevron(ctx, p[0], p[1], s.heading, accent);
		}
		if (grid.MIL) for (const f of flights(t)) {
			const p = put(f.lng, f.lat);
			if (!p) continue;
			triangle(ctx, p[0], p[1], f.heading, bear);
		}
		if (grid.PM) for (const m of pmGeos()) {
			const p = put(m.lng, m.lat);
			if (!p) continue;
			diamond(ctx, p[0], p[1], 5, m.delta24 >= 0 ? bull : bear);
		}
		if (grid.NEWS) for (const n of geoNews(t)) {
			const p = put(n.lng, n.lat);
			if (!p) continue;
			ctx.fillStyle = n.severity === "CRITICAL" ? bear : n.severity === "HIGH" ? high : fg;
			ctx.fillRect(p[0] - 2, p[1] - 2, 4, 4);
		}
		if (grid.LIVE) for (const s of liveStudios()) {
			const p = put(s.lng, s.lat);
			if (!p) continue;
			ctx.beginPath();
			ctx.arc(p[0], p[1], 3.5, 0, Math.PI * 2);
			ctx.fillStyle = s.onAir ? bull : "#5c6570";
			ctx.fill();
		}
		if (hover.current) {
			ctx.fillStyle = fg;
			ctx.font = "500 11px 'IBM Plex Sans', sans-serif";
		}
	}
	function hitTest(x, y) {
		const g = geoRef.current;
		const canvas = canvasRef.current;
		if (!g || !canvas) return null;
		const w = size.current.w;
		const h = size.current.h;
		const proj = projection(w, h);
		const t = asOfRef.current;
		const state = useTerminal.getState();
		const candidates = [];
		const consider = (lng, lat, hit) => {
			const p = proj([lng, lat]);
			if (!p) return;
			const d = Math.hypot(p[0] - x, p[1] - y);
			if (d < 12) candidates.push({
				hit,
				d
			});
		};
		if (state.grid.ZONE) for (const z of zones(t)) consider(z.lng, z.lat, {
			kind: "zone",
			id: z.id,
			label: z.name
		});
		if (state.grid.AIS) for (const s of ships(t)) consider(s.lng, s.lat, {
			kind: "ais",
			id: s.id,
			label: s.name
		});
		if (state.grid.MIL) for (const f of flights(t)) consider(f.lng, f.lat, {
			kind: "mil",
			id: f.id,
			label: f.callsign
		});
		if (state.grid.SEIS) for (const q of quakes(t)) consider(q.lng, q.lat, {
			kind: "seis",
			id: q.id,
			label: q.place
		});
		if (state.grid.PM) for (const m of pmGeos()) consider(m.lng, m.lat, {
			kind: "pm",
			id: m.id,
			label: m.title
		});
		if (state.grid.NEWS) for (const n of geoNews(t)) consider(n.lng, n.lat, {
			kind: "news",
			id: n.id,
			label: n.title
		});
		if (state.grid.LIVE) for (const s of liveStudios()) consider(s.lng, s.lat, {
			kind: "live",
			id: s.id,
			label: s.name
		});
		const activeRef = Object.entries(state.ref).filter(([, v]) => v).map(([k]) => k);
		for (const rp of REF_POINTS) if (activeRef.includes(rp.layer)) consider(rp.lng, rp.lat, {
			kind: "ref",
			id: rp.id,
			label: rp.name
		});
		candidates.sort((a, b) => a.d - b.d);
		if (candidates[0]) return candidates[0].hit;
		const inv = proj.invert?.([x, y]);
		if (!inv) return null;
		for (const f of g.countries.features) try {
			if (contains_default(f, inv)) {
				const name = f.properties?.name ?? String(f.id);
				return {
					kind: "country",
					id: String(f.id ?? name),
					label: name
				};
			}
		} catch {}
		return null;
	}
	(0, import_react.useEffect)(() => {
		const el = wrapRef.current;
		if (!el) return;
		const ro = new ResizeObserver((entries) => {
			const cr = entries[0]?.contentRect;
			if (!cr) return;
			size.current = {
				w: cr.width,
				h: cr.height
			};
			draw();
		});
		ro.observe(el);
		size.current = {
			w: el.clientWidth,
			h: el.clientHeight
		};
		draw();
		return () => ro.disconnect();
	}, [
		geo,
		mapMode,
		topo,
		countryColor,
		grid,
		ref,
		selection,
		asOf,
		lowPower
	]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		ref: wrapRef,
		className: "relative h-full min-h-0 w-full overflow-hidden bg-bg-sunken",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("canvas", {
				ref: canvasRef,
				className: "block h-full w-full touch-none",
				onPointerDown: (e) => {
					canvasRef.current.getBoundingClientRect();
					drag.current = {
						x: e.clientX,
						y: e.clientY,
						rot: [...rot.current],
						pan: [...pan.current]
					};
					e.target.setPointerCapture(e.pointerId);
				},
				onPointerMove: (e) => {
					const r = canvasRef.current.getBoundingClientRect();
					const x = e.clientX - r.left;
					const y = e.clientY - r.top;
					if (drag.current) {
						const dx = e.clientX - drag.current.x;
						const dy = e.clientY - drag.current.y;
						if (mapMode === "globe") rot.current = [drag.current.rot[0] + dx * .35, clamp(drag.current.rot[1] - dy * .35, -80, 80)];
						else pan.current = [drag.current.pan[0] + dx, drag.current.pan[1] + dy];
						draw();
						return;
					}
					const h = hitTest(x, y);
					if ((h ? `${h.kind}:${h.id}` : "") !== (hover.current ? `${hover.current.kind}:${hover.current.id}` : "")) {
						hover.current = h;
						setHoverUi(h);
						canvasRef.current.style.cursor = h ? "pointer" : "grab";
					}
				},
				onPointerUp: (e) => {
					const r = canvasRef.current.getBoundingClientRect();
					const x = e.clientX - r.left;
					const y = e.clientY - r.top;
					const moved = drag.current && Math.hypot(e.clientX - drag.current.x, e.clientY - drag.current.y) > 6;
					drag.current = null;
					if (moved) return;
					const h = hitTest(x, y);
					if (h) setSelection({
						kind: h.kind,
						id: h.id
					});
					else setSelection(null);
				},
				onWheel: (e) => {
					e.preventDefault();
					const next = clamp(scaleMul.current * (e.deltaY > 0 ? .92 : 1.08), .6, 4);
					scaleMul.current = next;
					draw();
				}
			}),
			hoverUi && !selection && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "pointer-events-none absolute top-3 left-3 rounded-sm border border-border bg-bg-elevated/90 px-2 py-1 font-mono text-[11px] text-fg",
				children: hoverUi.label
			}),
			selection && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ObjectCard, {
				selection,
				asOf,
				onClose: () => setSelection(null)
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TimeSlider, {}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Legend, {})
		]
	});
}
function Legend() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "pointer-events-none absolute right-3 bottom-14 hidden rounded-sm border border-border bg-bg-elevated/90 px-2 py-1.5 font-mono text-[9px] tracking-wide text-fg-muted md:block",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "mb-1 text-fg-subtle",
			children: "LAYERS"
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex flex-col gap-0.5",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "▲ MIL \xA0 › AIS \xA0 ● SEIS" }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "◆ PM \xA0 ■ NEWS \xA0 ◉ LIVE" }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "text-bear",
					children: "ZONE rings = desk cluster"
				})
			]
		})]
	});
}
function choropleth(score, land, bull, bear, noise) {
	const t = Math.min(1, Math.abs(score) / 80);
	const c = score >= 0 ? mix(land, bull, t * .75) : mix(land, bear, t * .75);
	if (!noise) return c;
	return c;
}
function mix(a, b, t) {
	const pa = parseHex(a);
	const pb = parseHex(b);
	if (!pa || !pb) return a;
	const m = (i) => Math.round(pa[i] + (pb[i] - pa[i]) * t);
	return `rgb(${m(0)},${m(1)},${m(2)})`;
}
function parseHex(s) {
	const h = s.trim();
	if (h.startsWith("#") && h.length === 7) return [
		parseInt(h.slice(1, 3), 16),
		parseInt(h.slice(3, 5), 16),
		parseInt(h.slice(5, 7), 16)
	];
	const m = h.match(/rgb\((\d+),\s*(\d+),\s*(\d+)\)/);
	if (m) return [
		Number(m[1]),
		Number(m[2]),
		Number(m[3])
	];
	return null;
}
function hashNoise(id) {
	let h = 0;
	for (let i = 0; i < id.length; i++) h = h * 31 + id.charCodeAt(i) | 0;
	return h % 13 / 100;
}
function chevron(ctx, x, y, heading, color) {
	ctx.save();
	ctx.translate(x, y);
	ctx.rotate(heading * Math.PI / 180);
	ctx.beginPath();
	ctx.moveTo(0, -5);
	ctx.lineTo(3.2, 4.5);
	ctx.lineTo(0, 2);
	ctx.lineTo(-3.2, 4.5);
	ctx.closePath();
	ctx.fillStyle = color;
	ctx.fill();
	ctx.restore();
}
function triangle(ctx, x, y, heading, color) {
	ctx.save();
	ctx.translate(x, y);
	ctx.rotate(heading * Math.PI / 180);
	ctx.beginPath();
	ctx.moveTo(0, -6);
	ctx.lineTo(4, 5);
	ctx.lineTo(-4, 5);
	ctx.closePath();
	ctx.fillStyle = color;
	ctx.fill();
	ctx.restore();
}
function diamond(ctx, x, y, s, color) {
	ctx.beginPath();
	ctx.moveTo(x, y - s);
	ctx.lineTo(x + s, y);
	ctx.lineTo(x, y + s);
	ctx.lineTo(x - s, y);
	ctx.closePath();
	ctx.fillStyle = color;
	ctx.fill();
}
function centroidOf(sel, countries, asOf) {
	if (sel.kind === "country") {
		const f = countries.features.find((x) => String(x.id) === sel.id);
		if (!f) return null;
		const c = centroid_default(f);
		return [c[1], c[0]];
	}
	const t = asOf;
	if (sel.kind === "zone") {
		const z = zones(t).find((x) => x.id === sel.id);
		return z ? [z.lat, z.lng] : null;
	}
	return null;
}
function MonitorHome() {
	const { sel } = Route$20.useSearch();
	const setSelection = useTerminal((s) => s.setSelection);
	(0, import_react.useEffect)(() => {
		if (!sel) return;
		const [kind, ...rest] = sel.split(":");
		const id = rest.join(":");
		if (kind && id) setSelection({
			kind,
			id
		});
	}, [sel, setSelection]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TerminalShell, { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(LayerRail, {}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "relative min-h-0 min-w-0 flex-1",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(WorldMap, {})
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(MonitorSide, {})
	] });
}
//#endregion
export { MonitorHome as component };
