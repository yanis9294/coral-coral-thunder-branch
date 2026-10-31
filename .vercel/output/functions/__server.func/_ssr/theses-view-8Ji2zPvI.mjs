import { i as __toESM } from "../_runtime.mjs";
import { C as require_jsx_runtime, Z as require_react, b as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { $ as trackRecord, C as cn, O as fmtNum, S as closedTheses, V as newUserThesis, Y as series, Z as thesisById, f as ScoreBar, h as THESES, k as fmtPct, tt as useTerminal } from "./shell-B4EHQ9b6.mjs";
import { n as IntelPage } from "./page-Crv803Pc.mjs";
import { t as BoundArea } from "./chart-BfgsPjdW.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/theses-view-8Ji2zPvI.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var DOMAINS = [
	"All",
	"Geopolitics",
	"Macro",
	"Commodities",
	"FX",
	"Energy",
	"Equities",
	"Rates",
	"Crypto"
];
function ThesesList() {
	const user = useTerminal((s) => s.userTheses);
	const addThesis = useTerminal((s) => s.addThesis);
	const [domain, setDomain] = (0, import_react.useState)("All");
	const [type, setType] = (0, import_react.useState)("All");
	const [status, setStatus] = (0, import_react.useState)("Open");
	const [form, setForm] = (0, import_react.useState)(false);
	const rows = [...user, ...THESES].filter((t) => {
		if (domain !== "All" && t.domain !== domain) return false;
		if (type !== "All" && t.type !== type) return false;
		if (status !== "All" && t.status !== status) return false;
		return true;
	});
	const tr = trackRecord(user);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(IntelPage, {
		title: "Theses",
		kicker: "Desk calls — directional trades and Polymarket",
		actions: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex items-center gap-3",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
				className: "font-mono text-[11px] text-fg-muted",
				children: [
					"Closed hit rate ",
					Math.round(tr.hitRate * 100),
					"% · n=",
					tr.n
				]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
				type: "button",
				onClick: () => setForm((v) => !v),
				className: "h-7 rounded-sm border border-border px-2 font-mono text-[11px] hover:bg-bg-hover",
				children: form ? "Close form" : "Add thesis"
			})]
		}),
		children: [
			form && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ThesisForm, {
				onAdd: (t) => {
					addThesis(t);
					setForm(false);
				},
				onCancel: () => setForm(false)
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex flex-wrap gap-2 border-b border-border px-3 py-2 md:px-4",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Select, {
						value: domain,
						onChange: setDomain,
						opts: DOMAINS
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Select, {
						value: type,
						onChange: setType,
						opts: [
							"All",
							"Market",
							"Trade"
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Select, {
						value: status,
						onChange: setStatus,
						opts: [
							"All",
							"Open",
							"Closed"
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
						href: "#track",
						className: "ml-auto font-mono text-[11px] text-accent no-underline",
						children: "Public track-record"
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "grid gap-3 p-3 md:grid-cols-2 md:p-4",
				children: [rows.map((t) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ThesisCard, { t }, t.id)), rows.length === 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "col-span-full py-12 text-center text-sm text-fg-muted",
					children: "No theses in this filter."
				})]
			}),
			status !== "Open" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				id: "track",
				className: "border-t border-border px-3 py-6 md:px-4",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						className: "text-sm font-medium",
						children: "Closed book"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "mt-1 text-[12px] text-fg-muted",
						children: [
							"Hit ",
							tr.hits,
							" / stopped ",
							tr.stopped,
							" · average edge captured ",
							tr.avgEdge.toFixed(2)
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "mt-3 overflow-x-auto",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("table", {
							className: "w-full min-w-[640px] text-left font-mono text-[12px]",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("thead", {
								className: "text-[10px] tracking-wider text-fg-subtle uppercase",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", { children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
										className: "py-2",
										children: "Thesis"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", { children: "State" }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", { children: "Domain" }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", { children: "Edge" }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", { children: "Closed" })
								] })
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tbody", { children: closedTheses(user).map((t) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
								className: "border-t border-border",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
										className: "py-2",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
											to: "/theses/$id",
											params: { id: t.id },
											className: "text-fg no-underline hover:text-accent",
											children: t.title
										})
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
										className: t.state === "HIT" ? "text-bull" : "text-bear",
										children: t.state
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
										className: "text-fg-muted",
										children: t.domain
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", { children: t.edgeCaptured.toFixed(2) }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
										className: "text-fg-muted",
										children: t.closed
									})
								]
							}, t.id)) })]
						})
					})
				]
			})
		]
	});
}
function ThesisForm({ onAdd, onCancel }) {
	const [title, setTitle] = (0, import_react.useState)("");
	const [instrument, setInstrument] = (0, import_react.useState)("");
	const [domain, setDomain] = (0, import_react.useState)("Macro");
	const [type, setType] = (0, import_react.useState)("Trade");
	const [unit, setUnit] = (0, import_react.useState)("px");
	const [entry, setEntry] = (0, import_react.useState)("");
	const [target, setTarget] = (0, import_react.useState)("");
	const [last, setLast] = (0, import_react.useState)("");
	const [horizon, setHorizon] = (0, import_react.useState)("3m");
	const [memo, setMemo] = (0, import_react.useState)("");
	const [supports, setSupports] = (0, import_react.useState)("");
	const [cuts, setCuts] = (0, import_react.useState)("");
	const [changeMind, setChangeMind] = (0, import_react.useState)("");
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
		className: "border-b border-border bg-bg-elevated px-3 py-4 md:px-4",
		onSubmit: (e) => {
			e.preventDefault();
			if (!title.trim() || !instrument.trim()) return;
			const split = (s) => s.split(/[;\n]/).map((x) => x.trim()).filter(Boolean);
			onAdd(newUserThesis({
				title,
				instrument,
				domain,
				type,
				unit,
				entry: Number(entry) || 0,
				target: Number(target) || Number(entry) || 0,
				last: Number(last) || Number(entry) || 0,
				horizon,
				memo,
				supports: split(supports),
				cuts: split(cuts),
				changeMind: split(changeMind)
			}));
		},
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
				className: "font-mono text-[10px] tracking-wider text-fg-subtle uppercase",
				children: "New thesis"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-1 text-[12px] text-fg-muted",
				children: "Stored locally on this machine. Desk book below is unchanged."
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-3 grid gap-2 sm:grid-cols-2 lg:grid-cols-4",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
						className: "flex flex-col gap-1 font-mono text-[11px] sm:col-span-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "text-fg-subtle",
							children: "Title"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							required: true,
							value: title,
							onChange: (e) => setTitle(e.target.value),
							className: "h-8 border border-border bg-bg-panel px-2"
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
						className: "flex flex-col gap-1 font-mono text-[11px]",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "text-fg-subtle",
							children: "Instrument"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							required: true,
							value: instrument,
							onChange: (e) => setInstrument(e.target.value),
							placeholder: "WTI, EURUSD, pm-fed",
							className: "h-8 border border-border bg-bg-panel px-2"
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
						className: "flex flex-col gap-1 font-mono text-[11px]",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "text-fg-subtle",
							children: "Horizon"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							value: horizon,
							onChange: (e) => setHorizon(e.target.value),
							className: "h-8 border border-border bg-bg-panel px-2"
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
						className: "flex flex-col gap-1 font-mono text-[11px]",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "text-fg-subtle",
							children: "Domain"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("select", {
							value: domain,
							onChange: (e) => setDomain(e.target.value),
							className: "h-8 border border-border bg-bg-panel px-2",
							children: DOMAINS.filter((d) => d !== "All").map((d) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", { children: d }, d))
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
						className: "flex flex-col gap-1 font-mono text-[11px]",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "text-fg-subtle",
							children: "Type"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
							value: type,
							onChange: (e) => setType(e.target.value),
							className: "h-8 border border-border bg-bg-panel px-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", { children: "Trade" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", { children: "Market" })]
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
						className: "flex flex-col gap-1 font-mono text-[11px]",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "text-fg-subtle",
							children: "Unit"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
							value: unit,
							onChange: (e) => setUnit(e.target.value),
							className: "h-8 border border-border bg-bg-panel px-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
								value: "px",
								children: "Price"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
								value: "prob",
								children: "Probability"
							})]
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
						className: "flex flex-col gap-1 font-mono text-[11px]",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "text-fg-subtle",
							children: "Entry"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							type: "number",
							step: "any",
							value: entry,
							onChange: (e) => setEntry(e.target.value),
							className: "h-8 border border-border bg-bg-panel px-2"
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
						className: "flex flex-col gap-1 font-mono text-[11px]",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "text-fg-subtle",
							children: "Last"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							type: "number",
							step: "any",
							value: last,
							onChange: (e) => setLast(e.target.value),
							className: "h-8 border border-border bg-bg-panel px-2"
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
						className: "flex flex-col gap-1 font-mono text-[11px]",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "text-fg-subtle",
							children: "Target"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							type: "number",
							step: "any",
							value: target,
							onChange: (e) => setTarget(e.target.value),
							className: "h-8 border border-border bg-bg-panel px-2"
						})]
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
				className: "mt-2 flex flex-col gap-1 font-mono text-[11px]",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "text-fg-subtle",
					children: "Memo"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("textarea", {
					value: memo,
					onChange: (e) => setMemo(e.target.value),
					rows: 3,
					className: "border border-border bg-bg-panel px-2 py-2"
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-2 grid gap-2 md:grid-cols-3",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
						className: "flex flex-col gap-1 font-mono text-[11px]",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "text-fg-subtle",
							children: "Supports (semicolon)"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							value: supports,
							onChange: (e) => setSupports(e.target.value),
							className: "h-8 border border-border bg-bg-panel px-2"
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
						className: "flex flex-col gap-1 font-mono text-[11px]",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "text-fg-subtle",
							children: "Cuts against"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							value: cuts,
							onChange: (e) => setCuts(e.target.value),
							className: "h-8 border border-border bg-bg-panel px-2"
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
						className: "flex flex-col gap-1 font-mono text-[11px]",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "text-fg-subtle",
							children: "What would change our mind"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							value: changeMind,
							onChange: (e) => setChangeMind(e.target.value),
							className: "h-8 border border-border bg-bg-panel px-2"
						})]
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-3 flex gap-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					type: "submit",
					className: "h-8 rounded-sm bg-accent px-3 font-mono text-[11px] text-accent-fg",
					children: "Book it"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					type: "button",
					onClick: onCancel,
					className: "h-8 rounded-sm border border-border px-3 font-mono text-[11px]",
					children: "Cancel"
				})]
			})
		]
	});
}
function ThesisCard({ t }) {
	const prog = progress(t);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
		to: "/theses/$id",
		params: { id: t.id },
		className: "block rounded-md border border-border bg-bg-elevated p-4 no-underline hover:border-border-strong",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-center gap-2",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(StateChip, { s: t.state }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
						className: "font-mono text-[10px] text-fg-subtle",
						children: [
							t.domain,
							" · ",
							t.type,
							t.user ? " · YOU" : ""
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "ml-auto font-mono text-[10px] text-fg-subtle",
						children: t.status
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
				className: "mt-2 text-sm font-medium leading-snug text-fg",
				children: t.title
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-3 grid grid-cols-3 gap-2 font-mono text-[11px]",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "text-fg-subtle",
						children: "Entry"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { children: fmtLevel(t, t.entry) })] }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "text-fg-subtle",
						children: "Last"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { children: fmtLevel(t, t.last) })] }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "text-fg-subtle",
						children: "Target"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { children: fmtLevel(t, t.target) })] })
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-3",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mb-1 flex justify-between font-mono text-[10px] text-fg-subtle",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Progress" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [Math.round(prog * 100), "%"] })]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ScoreBar, { n: prog * 100 })]
			})
		]
	});
}
function ThesisDetail({ id }) {
	const user = useTerminal((s) => s.userTheses);
	const remove = useTerminal((s) => s.removeThesis);
	const t = thesisById(id, user);
	const setAsOf = useTerminal((s) => s.setAsOf);
	const chart = (0, import_react.useMemo)(() => {
		if (!t) return [];
		return series(t.id, 90, t.entry, Math.abs(t.target - t.entry) / 18, Date.now()).map((v, i) => ({
			i,
			v
		}));
	}, [t]);
	if (!t) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(IntelPage, {
		title: "Thesis",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "p-6 text-sm text-fg-muted",
			children: "Unknown thesis."
		})
	});
	const prog = progress(t);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(IntelPage, {
		title: t.instrument,
		kicker: t.analyst,
		actions: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex gap-2",
			children: [t.user && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
				type: "button",
				className: "h-7 rounded-sm border border-bear/40 px-2 font-mono text-[11px] text-bear hover:bg-bg-hover",
				onClick: () => {
					remove(t.id);
					window.location.href = "/theses";
				},
				children: "Delete"
			}), t.status === "Closed" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
				type: "button",
				className: "h-7 rounded-sm border border-border px-2 font-mono text-[11px] hover:bg-bg-hover",
				onClick: () => {
					const ts = Date.parse(`${t.opened} UTC`);
					if (!Number.isNaN(ts)) setAsOf(ts);
					window.location.href = "/";
				},
				children: "Replay at entry"
			}) : null]
		}),
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mx-auto grid max-w-6xl gap-6 p-3 md:grid-cols-[1.2fr_0.8fr] md:p-6",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(StateChip, { s: t.state }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "mt-2 text-xl font-medium tracking-tight",
					children: t.title
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-3 text-[13px] leading-relaxed text-fg-muted",
					children: t.memo
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "mt-4 h-48 rounded-md border border-border bg-bg-elevated p-2",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(BoundArea, {
						data: chart,
						xKey: "i",
						yKey: "v"
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
					className: "mt-6 text-sm font-medium",
					children: "State of play"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("dl", {
					className: "mt-2 grid grid-cols-2 gap-2 font-mono text-[12px] md:grid-cols-4",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(KV, {
							k: "Opened",
							v: t.opened
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(KV, {
							k: "Horizon",
							v: t.horizon
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(KV, {
							k: "Progress",
							v: fmtPct(prog * 100, 0, false)
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(KV, {
							k: "Edge cap.",
							v: t.edgeCaptured.toFixed(2)
						})
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
					className: "mt-6 text-sm font-medium",
					children: "What would change our mind"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
					className: "mt-2 list-disc space-y-1 pl-4 text-[13px] text-fg-muted",
					children: t.changeMind.map((x) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: x }, x))
				})
			] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "space-y-4",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "rounded-md border border-border bg-bg-elevated p-3",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "font-mono text-[10px] tracking-wider text-bull uppercase",
							children: "Supports the call"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
							className: "mt-2 space-y-1 text-[12px] text-fg-muted",
							children: t.supports.map((x) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", { children: ["· ", x] }, x))
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "rounded-md border border-border bg-bg-elevated p-3",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "font-mono text-[10px] tracking-wider text-bear uppercase",
							children: "Cuts against"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
							className: "mt-2 space-y-1 text-[12px] text-fg-muted",
							children: t.cuts.map((x) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", { children: ["· ", x] }, x))
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "rounded-md border border-border bg-bg-elevated p-3",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "font-mono text-[10px] tracking-wider text-fg-subtle uppercase",
							children: "Daily log"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
							className: "mt-2 space-y-2 text-[12px]",
							children: t.log.map((l) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "font-mono text-[10px] text-fg-subtle",
								children: l.date
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "text-fg-muted",
								children: l.text
							})] }, l.date))
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "flex flex-wrap gap-2",
						children: t.links.map((l) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
							href: l.href,
							className: "font-mono text-[11px] text-accent no-underline",
							children: l.label
						}, l.href))
					})
				]
			})]
		})
	});
}
function progress(t) {
	const span = t.target - t.entry;
	if (span === 0) return 0;
	return Math.max(0, Math.min(1, (t.last - t.entry) / span));
}
function fmtLevel(t, n) {
	return t.unit === "prob" ? `${Math.round(n * 100)}%` : fmtNum(n, n > 100 ? 0 : 2);
}
function StateChip({ s }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
		className: cn("rounded-xs border px-1.5 py-0.5 font-mono text-[10px]", s === "WINNING" || s === "HIT" ? "text-bull border-bull/30 bg-bull/10" : s === "LOSING" || s === "STOPPED" ? "text-bear border-bear/30 bg-bear/10" : "text-fg-muted border-border bg-bg-panel"),
		children: s
	});
}
function KV({ k, v }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "rounded-sm bg-bg-panel px-2 py-2",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "text-[10px] text-fg-subtle",
			children: k
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "text-fg",
			children: v
		})]
	});
}
function Select({ value, onChange, opts }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("select", {
		value,
		onChange: (e) => onChange(e.target.value),
		className: "h-8 rounded-sm border border-border bg-bg-panel px-2 font-mono text-[11px] text-fg",
		children: opts.map((o) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
			value: o,
			children: o
		}, o))
	});
}
//#endregion
export { ThesisDetail as n, ThesesList as t };
