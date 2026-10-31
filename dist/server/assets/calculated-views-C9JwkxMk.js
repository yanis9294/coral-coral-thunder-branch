import { A as useTerminal, J as fmtPct, O as iceDxy, T as bbdxy, W as cn, Y as fmtSigned, a as SeverityPill, b as yieldSpreads, d as useClock, et as utcDate, f as FX_BASE_SPOTS, h as pxOf, m as fxSpots, n as Delta, nt as utcStamp, o as Spark, x as BBDXY_2026 } from "./shell-B4EHQ9b6.js";
import { n as IntelPage, t as Drawer } from "./page-Crv803Pc.js";
import { a as microHeat, i as leadLag, l as trendMatrix, n as fxBoard, o as newsFeed, s as pmMarkets, t as anomalies } from "./calculated-DX17ibxV.js";
import { a as impactWindow, c as printHistory, i as cotTimingCopy, l as scorecards, n as cotTffPulse, o as impliedMove, r as cotTffRows, s as macroCalendar, t as cotFeatureHistory } from "./cot-tff-iWn_4ltx.js";
import { n as BoundBar, t as BoundArea } from "./chart-BfgsPjdW.js";
import { i as MODEL_VERSION, n as METHODOLOGY, r as MODEL_UPDATED, t as CHANGELOG } from "./methodology-DOqfsOFU.js";
import { useMemo, useState } from "react";
import { Link } from "@tanstack/react-router";
import { jsx, jsxs } from "react/jsx-runtime";
//#region src/components/intel/calculated-views.tsx
function CotView() {
	const asOf = useClock();
	const [yrs, setYrs] = useState(3);
	const [sel, setSel] = useState(null);
	const rows = useMemo(() => cotTffRows(asOf), [asOf]);
	const pulse = cotTffPulse(rows);
	const timing = cotTimingCopy(asOf);
	const row = rows.find((r) => r.market === sel);
	return /* @__PURE__ */ jsxs(IntelPage, {
		title: "COT",
		kicker: "CFTC TFF · Williams 156w · no look-ahead",
		actions: /* @__PURE__ */ jsx("div", {
			className: "flex gap-1",
			children: [
				1,
				2,
				3,
				5
			].map((y) => /* @__PURE__ */ jsxs("button", {
				type: "button",
				onClick: () => setYrs(y),
				className: cn("h-7 px-2 font-mono text-[10px]", yrs === y ? "text-fg" : "text-fg-muted"),
				children: [y, "Y"]
			}, y))
		}),
		children: [
			/* @__PURE__ */ jsxs("p", {
				className: "border-b border-border px-3 py-2 font-mono text-[11px] text-warn md:px-4",
				children: ["SYNTHETIC TFF (quantdesk/cot.py). ", timing.note]
			}),
			/* @__PURE__ */ jsx("div", {
				className: "grid grid-cols-2 gap-2 p-3 md:grid-cols-6",
				children: pulse.map((p) => /* @__PURE__ */ jsxs("div", {
					className: "rounded-md border border-border bg-bg-elevated p-3",
					children: [/* @__PURE__ */ jsx("div", {
						className: "font-mono text-[10px] text-fg-subtle",
						children: p.cls
					}), /* @__PURE__ */ jsx("div", {
						className: cn("tabular font-mono text-lg", p.crowding >= 0 ? "text-bull" : "text-bear"),
						children: fmtSigned(p.crowding, 1)
					})]
				}, p.cls))
			}),
			/* @__PURE__ */ jsx("div", {
				className: "overflow-x-auto",
				children: /* @__PURE__ */ jsxs("table", {
					className: "w-full min-w-[980px] text-left font-mono text-[12px]",
					children: [/* @__PURE__ */ jsx("thead", {
						className: "text-[10px] tracking-wider text-fg-subtle uppercase",
						children: /* @__PURE__ */ jsx("tr", { children: [
							"Market",
							"Class",
							"Net LF",
							"Idx",
							"Z",
							"Extreme",
							"Sig",
							"d4",
							"d13",
							"Dealer",
							"AM",
							"Net COT"
						].map((h) => /* @__PURE__ */ jsx("th", {
							className: "px-3 py-2",
							children: h
						}, h)) })
					}), /* @__PURE__ */ jsx("tbody", { children: rows.map((r) => /* @__PURE__ */ jsxs("tr", {
						className: "cursor-pointer border-t border-border hover:bg-bg-hover",
						onClick: () => setSel(r.market),
						children: [
							/* @__PURE__ */ jsx("td", {
								className: "px-3 py-2 text-fg",
								children: r.market
							}),
							/* @__PURE__ */ jsx("td", {
								className: "px-3 text-fg-muted",
								children: r.cls
							}),
							/* @__PURE__ */ jsx("td", {
								className: "px-3",
								children: r.last.net_lf.toFixed(1)
							}),
							/* @__PURE__ */ jsx("td", {
								className: "px-3",
								children: Number.isFinite(r.last.idx_lf) ? Math.round(r.last.idx_lf * 100) : "—"
							}),
							/* @__PURE__ */ jsx("td", {
								className: "px-3",
								children: Number.isFinite(r.last.z_lf) ? r.last.z_lf.toFixed(2) : "—"
							}),
							/* @__PURE__ */ jsx("td", {
								className: cn("px-3", r.extreme.includes("CRWD") && "text-high"),
								children: r.extreme
							}),
							/* @__PURE__ */ jsx("td", {
								className: cn("px-3", r.sig > 0 ? "text-bull" : r.sig < 0 ? "text-bear" : "text-fg-muted"),
								children: r.sig
							}),
							/* @__PURE__ */ jsx("td", {
								className: "px-3",
								children: Number.isFinite(r.last.d4_lf) ? r.last.d4_lf.toFixed(1) : "—"
							}),
							/* @__PURE__ */ jsx("td", {
								className: "px-3",
								children: Number.isFinite(r.last.d13_lf) ? r.last.d13_lf.toFixed(1) : "—"
							}),
							/* @__PURE__ */ jsx("td", {
								className: "px-3",
								children: r.last.net_dealer.toFixed(1)
							}),
							/* @__PURE__ */ jsx("td", {
								className: "px-3",
								children: r.last.net_am.toFixed(1)
							}),
							/* @__PURE__ */ jsx("td", {
								className: "px-3",
								children: r.last.net_cot.toFixed(1)
							})
						]
					}, r.market)) })]
				})
			}),
			row && /* @__PURE__ */ jsx(CotDrawer, {
				row,
				years: yrs,
				asOf,
				onClose: () => setSel(null)
			})
		]
	});
}
function CotDrawer({ row, years, asOf, onClose }) {
	const hist = cotFeatureHistory(row.market, asOf, years);
	return /* @__PURE__ */ jsxs(Drawer, {
		title: `${row.market} · ${row.cls} · TFF`,
		onClose,
		children: [
			/* @__PURE__ */ jsx("div", {
				className: "h-44",
				children: /* @__PURE__ */ jsx(BoundArea, {
					data: hist,
					xKey: "w",
					yKey: "idx",
					color: "var(--warn)"
				})
			}),
			/* @__PURE__ */ jsx("p", {
				className: "mt-2 font-mono text-[10px] text-fg-subtle",
				children: "Williams leveraged-funds index (0–100). Y-axis is the index, not a price."
			}),
			/* @__PURE__ */ jsx("div", {
				className: "mt-3 h-36",
				children: /* @__PURE__ */ jsx(BoundArea, {
					data: hist,
					xKey: "w",
					yKey: "net",
					color: "var(--accent)"
				})
			}),
			/* @__PURE__ */ jsx("p", {
				className: "mt-2 font-mono text-[10px] text-fg-subtle",
				children: "net_cot = net_lf − net_dealer (% of OI)."
			}),
			/* @__PURE__ */ jsxs("dl", {
				className: "mt-3 space-y-1 font-mono text-[12px]",
				children: [
					/* @__PURE__ */ jsxs("div", {
						className: "flex justify-between",
						children: [/* @__PURE__ */ jsx("span", {
							className: "text-fg-subtle",
							children: "Report Tuesday"
						}), /* @__PURE__ */ jsx("span", { children: utcDate(row.reportTue) })]
					}),
					/* @__PURE__ */ jsxs("div", {
						className: "flex justify-between",
						children: [/* @__PURE__ */ jsx("span", {
							className: "text-fg-subtle",
							children: "Publish Friday"
						}), /* @__PURE__ */ jsx("span", { children: utcDate(row.publishFri) })]
					}),
					/* @__PURE__ */ jsxs("div", {
						className: "flex justify-between",
						children: [/* @__PURE__ */ jsx("span", {
							className: "text-fg-subtle",
							children: "Tradable (exec_lag=2)"
						}), /* @__PURE__ */ jsx("span", { children: utcDate(row.tradable) })]
					}),
					/* @__PURE__ */ jsxs("div", {
						className: "flex justify-between",
						children: [/* @__PURE__ */ jsx("span", {
							className: "text-fg-subtle",
							children: "Source"
						}), /* @__PURE__ */ jsx("span", {
							className: "text-warn",
							children: row.source
						})]
					})
				]
			})
		]
	});
}
function MacroView() {
	const asOf = useClock();
	const [tier, setTier] = useState("T2+");
	const cal = useMemo(() => {
		const all = macroCalendar(asOf);
		if (tier === "T3") return all.filter((c) => c.tier === "T3");
		if (tier === "T2+") return all.filter((c) => c.tier !== "T1");
		return all;
	}, [asOf, tier]);
	const cards = scorecards(asOf);
	const impact = impactWindow(cal, asOf);
	const [sel, setSel] = useState(null);
	const rel = cal.find((c) => c.id === sel);
	return /* @__PURE__ */ jsxs(IntelPage, {
		title: "Macro",
		kicker: "G8 scorecards · consensus · high/low · probabilities",
		actions: /* @__PURE__ */ jsx("div", {
			className: "flex gap-1",
			children: [
				"T3",
				"T2+",
				"ALL"
			].map((t) => /* @__PURE__ */ jsx("button", {
				type: "button",
				onClick: () => setTier(t),
				className: cn("h-7 px-2 font-mono text-[10px]", tier === t ? "text-fg" : "text-fg-muted"),
				children: t
			}, t))
		}),
		children: [/* @__PURE__ */ jsxs("div", {
			className: "p-3 md:p-4",
			children: [
				/* @__PURE__ */ jsx("div", {
					className: "h-40 rounded-md border border-border bg-bg-elevated p-2",
					children: /* @__PURE__ */ jsx(BoundBar, {
						data: impact,
						xKey: "label",
						yKey: "w"
					})
				}),
				/* @__PURE__ */ jsx("p", {
					className: "mt-1 font-mono text-[10px] text-fg-subtle",
					children: "Impact window — sum of print weights over the next 14 UTC days. Axis is weight, not a price."
				}),
				/* @__PURE__ */ jsx("div", {
					className: "mt-4 grid gap-2 sm:grid-cols-2 lg:grid-cols-4",
					children: cards.map((c) => /* @__PURE__ */ jsxs("div", {
						className: "rounded-md border border-border bg-bg-elevated p-3",
						children: [/* @__PURE__ */ jsxs("div", {
							className: "flex items-baseline justify-between",
							children: [/* @__PURE__ */ jsx("span", {
								className: "font-medium",
								children: c.ccy
							}), /* @__PURE__ */ jsx("span", {
								className: "font-mono text-[10px] text-fg-subtle",
								children: c.regime
							})]
						}), /* @__PURE__ */ jsxs("div", {
							className: "mt-2 grid grid-cols-2 gap-1 font-mono text-[11px] text-fg-muted",
							children: [
								/* @__PURE__ */ jsxs("span", { children: ["BEAT Z ", c.beatZ] }),
								/* @__PURE__ */ jsxs("span", { children: ["MISS Z ", c.missZ] }),
								/* @__PURE__ */ jsxs("span", { children: [
									"BEAT ",
									c.beatPct,
									"%"
								] }),
								/* @__PURE__ */ jsxs("span", { children: ["MOM ", c.momentum] }),
								/* @__PURE__ */ jsxs("span", { children: ["STREAK ", c.streak] })
							]
						})]
					}, c.ccy))
				}),
				/* @__PURE__ */ jsx("h3", {
					className: "mt-6 font-mono text-[10px] tracking-wider text-fg-subtle uppercase",
					children: "Timeline"
				}),
				/* @__PURE__ */ jsx("div", {
					className: "mt-2 overflow-x-auto",
					children: /* @__PURE__ */ jsxs("table", {
						className: "w-full min-w-[920px] text-left font-mono text-[12px]",
						children: [/* @__PURE__ */ jsx("thead", {
							className: "text-[10px] tracking-wider text-fg-subtle uppercase",
							children: /* @__PURE__ */ jsx("tr", { children: [
								"When",
								"CCY",
								"Print",
								"Cons.",
								"Low",
								"High",
								"Act.",
								"P beat",
								"P miss",
								"P hi",
								"Hist beat",
								"Related"
							].map((h) => /* @__PURE__ */ jsx("th", {
								className: "px-2 py-2",
								children: h
							}, h)) })
						}), /* @__PURE__ */ jsx("tbody", { children: cal.slice(0, 48).map((c) => /* @__PURE__ */ jsxs("tr", {
							className: "cursor-pointer border-t border-border hover:bg-bg-hover",
							onClick: () => setSel(c.id),
							children: [
								/* @__PURE__ */ jsxs("td", {
									className: "px-2 py-2 text-fg-subtle",
									children: [
										utcDate(c.ts),
										" ",
										utcStamp(c.ts)
									]
								}),
								/* @__PURE__ */ jsx("td", {
									className: "px-2",
									children: c.ccy
								}),
								/* @__PURE__ */ jsxs("td", {
									className: "px-2",
									children: [
										c.name,
										" ",
										/* @__PURE__ */ jsx("span", {
											className: "text-fg-subtle",
											children: c.tier
										})
									]
								}),
								/* @__PURE__ */ jsx("td", {
									className: "px-2",
									children: c.consensus
								}),
								/* @__PURE__ */ jsx("td", {
									className: "px-2 text-fg-muted",
									children: c.low
								}),
								/* @__PURE__ */ jsx("td", {
									className: "px-2 text-fg-muted",
									children: c.high
								}),
								/* @__PURE__ */ jsx("td", {
									className: cn("px-2", c.surpriseZ != null && (c.surpriseZ >= 0 ? "text-bull" : "text-bear")),
									children: c.actual ?? "—"
								}),
								/* @__PURE__ */ jsxs("td", {
									className: "px-2 text-bull",
									children: [Math.round(c.pBeat * 100), "%"]
								}),
								/* @__PURE__ */ jsxs("td", {
									className: "px-2 text-bear",
									children: [Math.round(c.pMiss * 100), "%"]
								}),
								/* @__PURE__ */ jsxs("td", {
									className: "px-2",
									children: [(c.pAboveHigh * 100).toFixed(1), "%"]
								}),
								/* @__PURE__ */ jsx("td", {
									className: "px-2",
									children: fmtSigned(c.histBeatMove, 0)
								}),
								/* @__PURE__ */ jsx("td", {
									className: "px-2 text-fg-muted",
									children: c.related.join(" ")
								})
							]
						}, c.id)) })]
					})
				})
			]
		}), rel && /* @__PURE__ */ jsx(MacroDrawer, {
			relId: rel.id,
			cal,
			asOf,
			onClose: () => setSel(null)
		})]
	});
}
function MacroDrawer({ relId, cal, asOf, onClose }) {
	const rel = cal.find((c) => c.id === relId);
	if (!rel) return null;
	const hist = printHistory(rel, asOf);
	const impl = impliedMove(rel);
	return /* @__PURE__ */ jsxs(Drawer, {
		title: `${rel.ccy} ${rel.name}`,
		onClose,
		children: [
			/* @__PURE__ */ jsxs("p", {
				className: "text-[13px] text-fg-muted",
				children: [
					rel.country,
					" · ",
					rel.domain,
					" · ",
					rel.tier,
					" · ",
					rel.unit
				]
			}),
			/* @__PURE__ */ jsxs("dl", {
				className: "mt-3 space-y-1 font-mono text-[12px]",
				children: [
					/* @__PURE__ */ jsxs("div", {
						className: "flex justify-between",
						children: [/* @__PURE__ */ jsx("span", {
							className: "text-fg-subtle",
							children: "Consensus"
						}), /* @__PURE__ */ jsx("span", { children: rel.consensus })]
					}),
					/* @__PURE__ */ jsxs("div", {
						className: "flex justify-between",
						children: [/* @__PURE__ */ jsx("span", {
							className: "text-fg-subtle",
							children: "Previous"
						}), /* @__PURE__ */ jsx("span", { children: rel.previous })]
					}),
					/* @__PURE__ */ jsxs("div", {
						className: "flex justify-between",
						children: [/* @__PURE__ */ jsx("span", {
							className: "text-fg-subtle",
							children: "Low / High (10th/90th)"
						}), /* @__PURE__ */ jsxs("span", { children: [
							rel.low,
							" / ",
							rel.high
						] })]
					}),
					/* @__PURE__ */ jsxs("div", {
						className: "flex justify-between",
						children: [/* @__PURE__ */ jsx("span", {
							className: "text-fg-subtle",
							children: "Actual"
						}), /* @__PURE__ */ jsx("span", { children: rel.actual ?? "pending" })]
					}),
					/* @__PURE__ */ jsxs("div", {
						className: "flex justify-between",
						children: [/* @__PURE__ */ jsx("span", {
							className: "text-fg-subtle",
							children: "Surprise z"
						}), /* @__PURE__ */ jsx("span", { children: rel.surpriseZ ?? "—" })]
					}),
					/* @__PURE__ */ jsxs("div", {
						className: "flex justify-between",
						children: [/* @__PURE__ */ jsx("span", {
							className: "text-fg-subtle",
							children: "P(beat) / P(miss) / P(inline)"
						}), /* @__PURE__ */ jsxs("span", { children: [
							Math.round(rel.pBeat * 100),
							" / ",
							Math.round(rel.pMiss * 100),
							" / ",
							Math.round(rel.pInline * 100)
						] })]
					}),
					/* @__PURE__ */ jsxs("div", {
						className: "flex justify-between",
						children: [/* @__PURE__ */ jsx("span", {
							className: "text-fg-subtle",
							children: "P(above high) / P(below low)"
						}), /* @__PURE__ */ jsxs("span", { children: [
							(rel.pAboveHigh * 100).toFixed(1),
							" / ",
							(rel.pBelowLow * 100).toFixed(1)
						] })]
					}),
					/* @__PURE__ */ jsxs("div", {
						className: "flex justify-between",
						children: [/* @__PURE__ */ jsx("span", {
							className: "text-fg-subtle",
							children: "Hist 30m beat / miss"
						}), /* @__PURE__ */ jsxs("span", { children: [
							fmtSigned(rel.histBeatMove, 0),
							" / ",
							fmtSigned(rel.histMissMove, 0)
						] })]
					}),
					/* @__PURE__ */ jsxs("div", {
						className: "flex justify-between",
						children: [/* @__PURE__ */ jsx("span", {
							className: "text-fg-subtle",
							children: "E[|move|] (bp or %)"
						}), /* @__PURE__ */ jsx("span", { children: impl.expectedAbs })]
					}),
					/* @__PURE__ */ jsxs("div", {
						className: "flex justify-between",
						children: [/* @__PURE__ */ jsx("span", {
							className: "text-fg-subtle",
							children: "Related"
						}), /* @__PURE__ */ jsx("span", { children: rel.related.join(" · ") })]
					}),
					/* @__PURE__ */ jsxs("div", {
						className: "flex justify-between",
						children: [/* @__PURE__ */ jsx("span", {
							className: "text-fg-subtle",
							children: "n lookback"
						}), /* @__PURE__ */ jsx("span", { children: rel.histN })]
					})
				]
			}),
			/* @__PURE__ */ jsx("h3", {
				className: "mt-4 font-mono text-[10px] text-fg-subtle uppercase",
				children: "Prior prints — surprise z"
			}),
			/* @__PURE__ */ jsx("div", {
				className: "mt-2 h-40",
				children: /* @__PURE__ */ jsx(BoundBar, {
					data: hist,
					xKey: "i",
					yKey: "z",
					color: "var(--info)"
				})
			}),
			/* @__PURE__ */ jsx("h3", {
				className: "mt-4 font-mono text-[10px] text-fg-subtle uppercase",
				children: "Prior 30m impulse"
			}),
			/* @__PURE__ */ jsx("div", {
				className: "mt-2 h-36",
				children: /* @__PURE__ */ jsx(BoundBar, {
					data: hist,
					xKey: "i",
					yKey: "move",
					color: "var(--accent)"
				})
			}),
			/* @__PURE__ */ jsx(Link, {
				to: "/trend",
				className: "mt-4 inline-block font-mono text-[11px] text-accent no-underline",
				children: "Trend matrix →"
			})
		]
	});
}
function MarketsView() {
	const asOf = useClock();
	const [lens, setLens] = useState("movers");
	const [win, setWin] = useState("24H");
	const [cat, setCat] = useState("All");
	const rows = useMemo(() => pmMarkets(asOf), [asOf]);
	const cats = ["All", ...Array.from(new Set(rows.map((r) => r.category)))];
	const filtered = rows.filter((r) => cat === "All" || r.category === cat);
	const delta = (m) => win === "1H" ? m.delta1h : win === "4H" ? m.delta4h : win === "7D" ? m.delta7d : m.delta24h;
	const sorted = [...filtered].sort((a, b) => {
		if (lens === "whales") return Math.abs(b.whaleNet) - Math.abs(a.whaleNet);
		if (lens === "volatile") return b.realizedVol - a.realizedVol;
		return Math.abs(delta(b)) - Math.abs(delta(a));
	});
	const [sel, setSel] = useState(null);
	const m = rows.find((x) => x.id === sel);
	return /* @__PURE__ */ jsxs(IntelPage, {
		title: "Markets",
		kicker: "Polymarket · unified prediction tape",
		actions: /* @__PURE__ */ jsx("div", {
			className: "flex gap-1",
			children: [
				"movers",
				"whales",
				"volatile"
			].map((l) => /* @__PURE__ */ jsx("button", {
				type: "button",
				onClick: () => setLens(l),
				className: cn("h-7 px-2 font-mono text-[10px] uppercase", lens === l ? "text-fg" : "text-fg-muted"),
				children: l
			}, l))
		}),
		children: [
			/* @__PURE__ */ jsxs("div", {
				className: "flex flex-wrap gap-2 border-b border-border px-3 py-2",
				children: [/* @__PURE__ */ jsx("select", {
					value: cat,
					onChange: (e) => setCat(e.target.value),
					className: "h-8 rounded-sm border border-border bg-bg-panel px-2 font-mono text-[11px]",
					children: cats.map((c) => /* @__PURE__ */ jsx("option", { children: c }, c))
				}), [
					"1H",
					"4H",
					"24H",
					"7D"
				].map((w) => /* @__PURE__ */ jsx("button", {
					type: "button",
					onClick: () => setWin(w),
					className: cn("h-8 px-2 font-mono text-[11px]", win === w ? "text-fg" : "text-fg-muted"),
					children: w
				}, w))]
			}),
			/* @__PURE__ */ jsx("div", {
				className: "grid gap-2 p-3 sm:grid-cols-2 lg:grid-cols-3",
				children: sorted.map((r) => /* @__PURE__ */ jsxs("button", {
					type: "button",
					onClick: () => setSel(r.id),
					className: "rounded-md border border-border bg-bg-elevated p-3 text-left hover:border-border-strong",
					children: [
						/* @__PURE__ */ jsx("div", {
							className: "font-mono text-[10px] text-fg-subtle",
							children: r.category
						}),
						/* @__PURE__ */ jsx("div", {
							className: "mt-1 text-[13px] leading-snug",
							children: r.title
						}),
						/* @__PURE__ */ jsxs("div", {
							className: "mt-2 flex items-end justify-between",
							children: [/* @__PURE__ */ jsxs("span", {
								className: "tabular font-mono text-xl",
								children: [Math.round(r.prob * 100), "%"]
							}), /* @__PURE__ */ jsx(Spark, { data: r.spark })]
						}),
						/* @__PURE__ */ jsxs("div", {
							className: "mt-2 flex justify-between font-mono text-[10px] text-fg-muted",
							children: [/* @__PURE__ */ jsx(Delta, { n: delta(r) }), /* @__PURE__ */ jsxs("span", { children: [
								"vol $",
								r.volume,
								"m · oi $",
								r.oi,
								"m"
							] })]
						})
					]
				}, r.id))
			}),
			m && /* @__PURE__ */ jsxs(Drawer, {
				title: m.title,
				onClose: () => setSel(null),
				children: [
					/* @__PURE__ */ jsx("div", {
						className: "h-36",
						children: /* @__PURE__ */ jsx(BoundArea, {
							data: m.spark.map((v, i) => ({
								i,
								v: v * 100
							})),
							xKey: "i",
							yKey: "v"
						})
					}),
					/* @__PURE__ */ jsxs("dl", {
						className: "mt-3 grid grid-cols-2 gap-2 font-mono text-[12px]",
						children: [
							/* @__PURE__ */ jsxs("div", { children: ["Flow ", fmtSigned(m.whaleNet, 2)] }),
							/* @__PURE__ */ jsxs("div", { children: ["Vol ratio ", m.volRatio] }),
							/* @__PURE__ */ jsxs("div", { children: [
								"Realized ",
								m.realizedVol,
								"%"
							] }),
							/* @__PURE__ */ jsxs("div", { children: [
								"OI $",
								m.oi,
								"m"
							] })
						]
					}),
					/* @__PURE__ */ jsx("ul", {
						className: "mt-3 text-[12px]",
						children: m.issues.map((i) => /* @__PURE__ */ jsxs("li", {
							className: "flex justify-between",
							children: [/* @__PURE__ */ jsx("span", { children: i.name }), /* @__PURE__ */ jsxs("span", {
								className: "font-mono",
								children: [Math.round(i.prob * 100), "%"]
							})]
						}, i.name))
					}),
					/* @__PURE__ */ jsx(Link, {
						to: "/theses",
						className: "mt-4 inline-block font-mono text-[11px] text-accent no-underline",
						children: "Related theses →"
					})
				]
			})
		]
	});
}
function MicroView() {
	const asOf = useClock();
	const heat = microHeat(asOf);
	const ll = leadLag(asOf);
	return /* @__PURE__ */ jsx(IntelPage, {
		title: "Micro",
		kicker: "Vol regimes and lead-lag on 44 assets",
		children: /* @__PURE__ */ jsxs("div", {
			className: "p-3 md:p-4",
			children: [
				/* @__PURE__ */ jsx("div", {
					className: "grid grid-cols-8 gap-1 sm:grid-cols-11",
					children: heat.map((h) => /* @__PURE__ */ jsx("div", {
						title: `${h.s} ${h.vol}`,
						className: "flex aspect-square flex-col items-center justify-center rounded-xs font-mono text-[9px]",
						style: { background: h.vol > .4 ? "color-mix(in oklab, var(--bear) 55%, transparent)" : h.vol < -.2 ? "color-mix(in oklab, var(--bull) 35%, transparent)" : "var(--bg-panel)" },
						children: h.s
					}, h.s))
				}),
				/* @__PURE__ */ jsx("h3", {
					className: "mt-6 font-mono text-[10px] tracking-wider text-fg-subtle uppercase",
					children: "Lead-lag (optimal minutes)"
				}),
				/* @__PURE__ */ jsx("ul", {
					className: "mt-2 divide-y divide-border rounded-md border border-border",
					children: ll.map((p) => /* @__PURE__ */ jsxs("li", {
						className: "flex items-center justify-between px-3 py-2 font-mono text-[12px]",
						children: [/* @__PURE__ */ jsxs("span", { children: [
							p.lead,
							" leads ",
							p.lead === p.a ? p.b : p.a
						] }), /* @__PURE__ */ jsxs("span", {
							className: "text-fg-muted",
							children: [
								p.lagMin,
								"m · ρ ",
								p.corr
							]
						})]
					}, p.a + p.b))
				})
			]
		})
	});
}
function FxView() {
	const asOf = useClock();
	const rows = fxBoard(asOf);
	const spots = fxSpots(asOf);
	const ice = iceDxy(spots);
	const bb = bbdxy(spots, FX_BASE_SPOTS);
	const dxyChg = pxOf("DXY", asOf).chg;
	const bbChg = pxOf("BBDXY", asOf).chg;
	const ySpreads = yieldSpreads(asOf).slice(0, 6);
	return /* @__PURE__ */ jsxs(IntelPage, {
		title: "FX",
		kicker: "G10 · BBDXY 2026 weights · yield spreads",
		children: [
			/* @__PURE__ */ jsxs("div", {
				className: "grid gap-2 border-b border-border p-3 sm:grid-cols-2 lg:grid-cols-4 md:px-4",
				children: [
					/* @__PURE__ */ jsxs("div", {
						className: "rounded-md border border-border bg-bg-elevated p-3",
						children: [
							/* @__PURE__ */ jsx("div", {
								className: "font-mono text-[10px] text-fg-subtle",
								children: "BBDXY"
							}),
							/* @__PURE__ */ jsx("div", {
								className: "mt-1 font-mono text-lg tabular",
								children: bb.toFixed(2)
							}),
							/* @__PURE__ */ jsx("div", {
								className: cn("font-mono text-[11px]", bbChg >= 0 ? "text-bull" : "text-bear"),
								children: fmtPct(bbChg)
							})
						]
					}),
					/* @__PURE__ */ jsxs("div", {
						className: "rounded-md border border-border bg-bg-elevated p-3",
						children: [
							/* @__PURE__ */ jsx("div", {
								className: "font-mono text-[10px] text-fg-subtle",
								children: "ICE DXY"
							}),
							/* @__PURE__ */ jsx("div", {
								className: "mt-1 font-mono text-lg tabular",
								children: ice.toFixed(2)
							}),
							/* @__PURE__ */ jsx("div", {
								className: cn("font-mono text-[11px]", dxyChg >= 0 ? "text-bull" : "text-bear"),
								children: fmtPct(dxyChg)
							})
						]
					}),
					ySpreads.slice(0, 2).map((s) => /* @__PURE__ */ jsxs("div", {
						className: "rounded-md border border-border bg-bg-elevated p-3",
						children: [
							/* @__PURE__ */ jsx("div", {
								className: "font-mono text-[10px] text-fg-subtle",
								children: s.name
							}),
							/* @__PURE__ */ jsxs("div", {
								className: "mt-1 font-mono text-lg tabular",
								children: [s.value.toFixed(1), " bp"]
							}),
							/* @__PURE__ */ jsxs("div", {
								className: cn("font-mono text-[11px]", s.chg >= 0 ? "text-bear" : "text-bull"),
								children: [fmtSigned(s.chg, 1), " bp"]
							})
						]
					}, s.id))
				]
			}),
			/* @__PURE__ */ jsxs("p", {
				className: "px-3 py-2 font-mono text-[10px] text-fg-subtle md:px-4",
				children: [
					"BBDXY basket: ",
					BBDXY_2026.map((c) => `${c.name} ${c.w}`).join(" · "),
					". CNH capped at 7. Full strip on STIR."
				]
			}),
			/* @__PURE__ */ jsx("div", {
				className: "overflow-x-auto p-3",
				children: /* @__PURE__ */ jsxs("table", {
					className: "w-full min-w-[640px] text-left font-mono text-[12px]",
					children: [/* @__PURE__ */ jsx("thead", {
						className: "text-[10px] tracking-wider text-fg-subtle uppercase",
						children: /* @__PURE__ */ jsx("tr", { children: [
							"Pair",
							"Spot",
							"Chg",
							"Signal",
							"Score",
							"Carry",
							"Cross"
						].map((h) => /* @__PURE__ */ jsx("th", {
							className: "px-3 py-2",
							children: h
						}, h)) })
					}), /* @__PURE__ */ jsx("tbody", { children: rows.map((r) => /* @__PURE__ */ jsxs("tr", {
						className: "border-t border-border",
						children: [
							/* @__PURE__ */ jsx("td", {
								className: "px-3 py-2",
								children: r.pair
							}),
							/* @__PURE__ */ jsx("td", {
								className: "px-3",
								children: r.px
							}),
							/* @__PURE__ */ jsx("td", {
								className: cn("px-3", r.chg >= 0 ? "text-bull" : "text-bear"),
								children: fmtPct(r.chg)
							}),
							/* @__PURE__ */ jsx("td", {
								className: cn("px-3", r.signal === "LONG" ? "text-bull" : r.signal === "SHORT" ? "text-bear" : "text-fg-muted"),
								children: r.signal
							}),
							/* @__PURE__ */ jsx("td", {
								className: "px-3",
								children: r.score
							}),
							/* @__PURE__ */ jsxs("td", {
								className: "px-3",
								children: [r.carry, "%"]
							}),
							/* @__PURE__ */ jsx("td", {
								className: "px-3 text-fg-muted",
								children: r.cross
							})
						]
					}, r.pair)) })]
				})
			})
		]
	});
}
function NewsView() {
	const asOf = useClock();
	const [sev, setSev] = useState("ALL");
	const rows = newsFeed(asOf).filter((n) => sev === "ALL" || n.severity === sev);
	return /* @__PURE__ */ jsx(IntelPage, {
		title: "News",
		kicker: "Geolocated tape, ranked",
		actions: /* @__PURE__ */ jsx("select", {
			value: sev,
			onChange: (e) => setSev(e.target.value),
			className: "h-8 border border-border bg-bg-panel px-2 font-mono text-[11px]",
			children: [
				"ALL",
				"CRITICAL",
				"HIGH",
				"MEDIUM",
				"LOW",
				"INFO"
			].map((s) => /* @__PURE__ */ jsx("option", { children: s }, s))
		}),
		children: /* @__PURE__ */ jsx("ul", {
			className: "divide-y divide-border",
			children: rows.map((n) => /* @__PURE__ */ jsxs("li", {
				className: "px-3 py-3 md:px-4",
				children: [
					/* @__PURE__ */ jsxs("div", {
						className: "flex flex-wrap items-center gap-2",
						children: [
							/* @__PURE__ */ jsx(SeverityPill, { value: n.severity }),
							/* @__PURE__ */ jsx("span", {
								className: "font-mono text-[10px] text-fg-subtle",
								children: n.source
							}),
							/* @__PURE__ */ jsx("span", {
								className: "font-mono text-[10px] text-fg-subtle",
								children: n.domain
							}),
							/* @__PURE__ */ jsx("span", {
								className: "ml-auto font-mono text-[10px] text-fg-subtle",
								children: utcStamp(n.ts)
							})
						]
					}),
					/* @__PURE__ */ jsx("div", {
						className: "mt-1 text-sm",
						children: n.title
					}),
					/* @__PURE__ */ jsx("p", {
						className: "mt-1 text-[12px] text-fg-muted",
						children: n.summary
					})
				]
			}, n.id))
		})
	});
}
function MethodologyView() {
	return /* @__PURE__ */ jsx(IntelPage, {
		title: "Methodology",
		kicker: `${MODEL_VERSION} · updated ${MODEL_UPDATED}`,
		children: /* @__PURE__ */ jsxs("div", {
			className: "mx-auto max-w-3xl space-y-4 p-3 md:p-6",
			children: [
				/* @__PURE__ */ jsx("p", {
					className: "text-[13px] leading-relaxed text-fg-muted",
					children: "Public, versioned model cards. Weights on the Trend matrix are user-overridable; everything else is desk-calibrated. Raw scores export as JSON from Workbench."
				}),
				METHODOLOGY.map((m) => /* @__PURE__ */ jsxs("article", {
					className: "rounded-md border border-border bg-bg-elevated p-4",
					children: [/* @__PURE__ */ jsx("h3", {
						className: "text-sm font-medium",
						children: m.name
					}), /* @__PURE__ */ jsxs("dl", {
						className: "mt-2 space-y-1 text-[12px] text-fg-muted",
						children: [
							/* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("span", {
								className: "text-fg-subtle",
								children: "Lookback · "
							}), m.lookback] }),
							/* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("span", {
								className: "text-fg-subtle",
								children: "Sources · "
							}), m.sources] }),
							/* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("span", {
								className: "text-fg-subtle",
								children: "Formula · "
							}), /* @__PURE__ */ jsx("span", {
								className: "font-mono text-[11px] text-fg",
								children: m.formula
							})] }),
							/* @__PURE__ */ jsx("p", {
								className: "pt-1",
								children: m.notes
							})
						]
					})]
				}, m.id)),
				/* @__PURE__ */ jsx("h3", {
					className: "pt-4 text-sm font-medium",
					children: "Changelog"
				}),
				/* @__PURE__ */ jsx("ul", {
					className: "space-y-2 text-[12px] text-fg-muted",
					children: CHANGELOG.map((c) => /* @__PURE__ */ jsxs("li", { children: [
						/* @__PURE__ */ jsx("span", {
							className: "font-mono text-fg",
							children: c.v
						}),
						" · ",
						c.date,
						" — ",
						c.text
					] }, c.v))
				})
			]
		})
	});
}
var WIDGETS = [
	{
		id: "trend-top",
		label: "Trend top"
	},
	{
		id: "cot-pulse",
		label: "COT pulse"
	},
	{
		id: "pm-movers",
		label: "PM movers"
	},
	{
		id: "macro-impact",
		label: "Macro impact"
	},
	{
		id: "bank-tape",
		label: "Bank tape"
	},
	{
		id: "fx-cross",
		label: "FX board"
	},
	{
		id: "alerts",
		label: "Alerts"
	},
	{
		id: "brief-arcs",
		label: "Brief arcs"
	},
	{
		id: "ticker-board",
		label: "Pulse"
	},
	{
		id: "mini-map",
		label: "Monitor link"
	}
];
function WorkbenchView() {
	const slots = useTerminal((s) => s.workbench);
	const set = useTerminal((s) => s.setWorkbench);
	const asOf = useClock();
	const exportJson = () => {
		const blob = new Blob([JSON.stringify({
			asOf,
			trend: trendMatrix(asOf),
			cot: cotTffRows(asOf),
			ts: Date.now()
		}, null, 2)], { type: "application/json" });
		const url = URL.createObjectURL(blob);
		const a = document.createElement("a");
		a.href = url;
		a.download = "argos-scores.json";
		a.click();
		URL.revokeObjectURL(url);
	};
	return /* @__PURE__ */ jsx(IntelPage, {
		title: "Workbench",
		kicker: "Compose a layout · export scores",
		actions: /* @__PURE__ */ jsx("button", {
			type: "button",
			onClick: exportJson,
			className: "h-7 rounded-sm border border-border px-2 font-mono text-[11px]",
			children: "Export JSON"
		}),
		children: /* @__PURE__ */ jsx("div", {
			className: "grid gap-3 p-3 md:grid-cols-2 md:p-4",
			children: slots.map((id, i) => /* @__PURE__ */ jsxs("div", {
				className: "min-h-[200px] rounded-md border border-border bg-bg-elevated p-3",
				children: [/* @__PURE__ */ jsx("select", {
					value: id,
					onChange: (e) => {
						const next = [...slots];
						next[i] = e.target.value;
						set(next);
					},
					className: "mb-2 h-8 w-full border border-border bg-bg-panel px-2 font-mono text-[11px]",
					children: WIDGETS.map((w) => /* @__PURE__ */ jsx("option", {
						value: w.id,
						children: w.label
					}, w.id))
				}), /* @__PURE__ */ jsx(Widget, {
					id,
					asOf
				})]
			}, i))
		})
	});
}
function Widget({ id, asOf }) {
	if (id === "trend-top") {
		const rows = trendMatrix(asOf).slice(0, 6);
		return /* @__PURE__ */ jsx("ul", {
			className: "space-y-1 font-mono text-[12px]",
			children: rows.map((r) => /* @__PURE__ */ jsxs("li", {
				className: "flex justify-between",
				children: [/* @__PURE__ */ jsx("span", { children: r.symbol }), /* @__PURE__ */ jsx("span", {
					className: r.overall >= 0 ? "text-bull" : "text-bear",
					children: fmtSigned(r.overall, 0)
				})]
			}, r.symbol))
		});
	}
	if (id === "cot-pulse") {
		const rows = cotTffRows(asOf);
		const p = cotTffPulse(rows);
		return /* @__PURE__ */ jsx("ul", {
			className: "space-y-1 font-mono text-[12px]",
			children: p.map((x) => /* @__PURE__ */ jsxs("li", {
				className: "flex justify-between",
				children: [/* @__PURE__ */ jsx("span", { children: x.cls }), /* @__PURE__ */ jsx("span", {
					className: x.crowding >= 0 ? "text-bull" : "text-bear",
					children: fmtSigned(x.crowding, 1)
				})]
			}, x.cls))
		});
	}
	if (id === "pm-movers") {
		const rows = [...pmMarkets(asOf)].sort((a, b) => Math.abs(b.delta24h) - Math.abs(a.delta24h)).slice(0, 5);
		return /* @__PURE__ */ jsx("ul", {
			className: "space-y-2 text-[12px]",
			children: rows.map((r) => /* @__PURE__ */ jsxs("li", {
				className: "flex justify-between gap-2",
				children: [/* @__PURE__ */ jsx("span", {
					className: "truncate",
					children: r.title
				}), /* @__PURE__ */ jsx(Delta, { n: r.delta24h })]
			}, r.id))
		});
	}
	if (id === "alerts") return /* @__PURE__ */ jsx("ul", {
		className: "space-y-2 text-[12px]",
		children: anomalies(asOf).map((a) => /* @__PURE__ */ jsxs("li", { children: [/* @__PURE__ */ jsx(SeverityPill, { value: a.severity }), /* @__PURE__ */ jsx("div", {
			className: "mt-1",
			children: a.title
		})] }, a.id))
	});
	if (id === "bank-tape") return /* @__PURE__ */ jsx(BankTapeWidget, {});
	if (id === "fx-cross") return /* @__PURE__ */ jsx("ul", {
		className: "space-y-1 font-mono text-[12px]",
		children: fxBoard(asOf).map((r) => /* @__PURE__ */ jsxs("li", {
			className: "flex justify-between",
			children: [/* @__PURE__ */ jsx("span", { children: r.pair }), /* @__PURE__ */ jsx("span", { children: r.signal })]
		}, r.pair))
	});
	if (id === "brief-arcs") return /* @__PURE__ */ jsx("p", {
		className: "text-[12px] text-fg-muted",
		children: "Today’s arcs: Iran · Hormuz, Russia · Ukraine, Macro · Rates, China · Tech. Open Brief for the note."
	});
	if (id === "mini-map") return /* @__PURE__ */ jsx(Link, {
		to: "/",
		className: "font-mono text-[12px] text-accent no-underline",
		children: "Open Monitor →"
	});
	if (id === "macro-impact") {
		const cal = macroCalendar(asOf);
		const imp = impactWindow(cal, asOf);
		return /* @__PURE__ */ jsx("div", {
			className: "h-32",
			children: /* @__PURE__ */ jsx(BoundBar, {
				data: imp,
				xKey: "label",
				yKey: "w"
			})
		});
	}
	if (id === "ticker-board") return /* @__PURE__ */ jsx("p", {
		className: "font-mono text-[12px] text-fg-muted",
		children: "Pulse lives in the bottom ticker. Toggle TICKER on Monitor."
	});
	return null;
}
function BankTapeWidget() {
	const articles = useTerminal((s) => s.bankArticles);
	if (!articles.length) return /* @__PURE__ */ jsx("a", {
		href: "/bank",
		className: "font-mono text-[12px] text-accent no-underline",
		children: "Open Bank — tape not pulled yet →"
	});
	return /* @__PURE__ */ jsx("ul", {
		className: "space-y-1 text-[12px]",
		children: articles.slice(0, 5).map((a) => /* @__PURE__ */ jsxs("li", {
			className: "flex justify-between gap-2",
			children: [/* @__PURE__ */ jsx("span", {
				className: "truncate",
				children: a.title
			}), /* @__PURE__ */ jsx("span", {
				className: "shrink-0 font-mono text-[10px] text-fg-subtle",
				children: a.house
			})]
		}, a.id))
	});
}
//#endregion
export { MethodologyView as a, WorkbenchView as c, MarketsView as i, FxView as n, MicroView as o, MacroView as r, NewsView as s, CotView as t };
