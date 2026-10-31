import { A as useTerminal, J as fmtPct, M as riskSnapshot, N as wealthPath, W as cn, d as useClock, j as RISK_ASSETS } from "./shell-B4EHQ9b6.js";
import { n as IntelPage } from "./page-Crv803Pc.js";
import { n as BoundBar, t as BoundArea } from "./chart-BfgsPjdW.js";
import { useMemo } from "react";
import { jsx, jsxs } from "react/jsx-runtime";
//#region src/components/intel/risk-view.tsx
function RiskView() {
	const asOf = useClock();
	const w = useTerminal((s) => s.riskWeights);
	const setW = useTerminal((s) => s.setRiskWeights);
	const alpha = useTerminal((s) => s.riskAlpha);
	const setAlpha = useTerminal((s) => s.setRiskAlpha);
	const capital = useTerminal((s) => s.riskCapital);
	const setCap = useTerminal((s) => s.setRiskCapital);
	const budget = useTerminal((s) => s.riskBudget);
	const setBud = useTerminal((s) => s.setRiskBudget);
	const snap = useMemo(() => riskSnapshot(w, alpha, capital, budget), [
		w,
		alpha,
		capital,
		budget
	]);
	const path = useMemo(() => wealthPath(snap.port, 1), [snap.port]);
	const btSeries = snap.bt.vars.map((v) => ({
		d: v.t,
		ret: v.ret * 100,
		var: -v.VaR * 100
	}));
	const sumW = RISK_ASSETS.reduce((s, a) => s + (w[a] ?? 0), 0);
	return /* @__PURE__ */ jsxs(IntelPage, {
		title: "Risk",
		kicker: `VaR / ES / Kelly · α=${alpha} · synthetic book · as-of ${new Date(asOf).toISOString().slice(0, 10)}`,
		children: [
			/* @__PURE__ */ jsx("p", {
				className: "border-b border-border px-3 py-2 font-mono text-[11px] text-warn md:px-4",
				children: "SYNTHETIC returns (GARCH-t). Engine is a TypeScript port of quantdesk/risk.py + kelly.py. Do not size live risk off this tape."
			}),
			/* @__PURE__ */ jsxs("div", {
				className: "grid gap-3 p-3 md:grid-cols-4 md:p-4",
				children: [
					/* @__PURE__ */ jsx(Tile, {
						k: `VaR ${alpha * 100}% 1d`,
						v: fmtPct(snap.hist.VaR * 100, 2, false)
					}),
					/* @__PURE__ */ jsx(Tile, {
						k: "ES (CVaR) 1d",
						v: fmtPct(snap.hist.ES * 100, 2, false)
					}),
					/* @__PURE__ */ jsx(Tile, {
						k: "Ann. vol / Sharpe",
						v: `${(snap.volAnn * 100).toFixed(1)}% · ${snap.sharpe.toFixed(2)}`
					}),
					/* @__PURE__ */ jsx(Tile, {
						k: "Notional @ budget",
						v: (snap.size / 1e6).toFixed(2) + "m",
						sub: `${(budget * 100).toFixed(1)}% of ${(capital / 1e6).toFixed(1)}m / ES`
					})
				]
			}),
			/* @__PURE__ */ jsxs("section", {
				className: "grid gap-4 border-t border-border p-3 md:grid-cols-[1fr_1.2fr] md:p-4",
				children: [/* @__PURE__ */ jsxs("div", { children: [
					/* @__PURE__ */ jsxs("h2", {
						className: "font-mono text-[10px] tracking-wider text-fg-subtle uppercase",
						children: [
							"Weights (Σ ",
							sumW.toFixed(2),
							")"
						]
					}),
					RISK_ASSETS.map((a) => /* @__PURE__ */ jsxs("label", {
						className: "mt-2 flex items-center gap-2 font-mono text-[11px]",
						children: [
							/* @__PURE__ */ jsx("span", {
								className: "w-14",
								children: a
							}),
							/* @__PURE__ */ jsx("input", {
								type: "range",
								min: 0,
								max: 60,
								value: Math.round((w[a] ?? 0) * 100),
								onChange: (e) => setW({ [a]: Number(e.target.value) / 100 }),
								className: "flex-1 accent-accent"
							}),
							/* @__PURE__ */ jsxs("span", {
								className: "w-10 text-right",
								children: [Math.round((w[a] ?? 0) * 100), "%"]
							})
						]
					}, a)),
					/* @__PURE__ */ jsxs("div", {
						className: "mt-4 grid grid-cols-2 gap-2 font-mono text-[11px]",
						children: [
							/* @__PURE__ */ jsxs("label", {
								className: "flex flex-col gap-1",
								children: [/* @__PURE__ */ jsx("span", {
									className: "text-fg-subtle",
									children: "α"
								}), /* @__PURE__ */ jsxs("select", {
									value: alpha,
									onChange: (e) => setAlpha(Number(e.target.value)),
									className: "h-8 border border-border bg-bg-panel px-2",
									children: [/* @__PURE__ */ jsx("option", {
										value: .99,
										children: "0.99"
									}), /* @__PURE__ */ jsx("option", {
										value: .95,
										children: "0.95"
									})]
								})]
							}),
							/* @__PURE__ */ jsxs("label", {
								className: "flex flex-col gap-1",
								children: [/* @__PURE__ */ jsx("span", {
									className: "text-fg-subtle",
									children: "Capital"
								}), /* @__PURE__ */ jsx("input", {
									type: "number",
									value: capital,
									onChange: (e) => setCap(Number(e.target.value)),
									className: "h-8 border border-border bg-bg-panel px-2"
								})]
							}),
							/* @__PURE__ */ jsxs("label", {
								className: "flex flex-col gap-1",
								children: [/* @__PURE__ */ jsx("span", {
									className: "text-fg-subtle",
									children: "Risk budget"
								}), /* @__PURE__ */ jsx("input", {
									type: "number",
									step: "0.001",
									value: budget,
									onChange: (e) => setBud(Number(e.target.value)),
									className: "h-8 border border-border bg-bg-panel px-2"
								})]
							})
						]
					})
				] }), /* @__PURE__ */ jsx("div", {
					className: "h-56 rounded-md border border-border bg-bg-elevated p-2",
					children: /* @__PURE__ */ jsx(BoundArea, {
						data: path,
						xKey: "d",
						yKey: "v",
						color: "var(--accent)"
					})
				})]
			}),
			/* @__PURE__ */ jsxs("section", {
				className: "border-t border-border px-3 py-4 md:px-4",
				children: [/* @__PURE__ */ jsx("h2", {
					className: "font-mono text-[10px] tracking-wider text-fg-subtle uppercase",
					children: "Estimators (1-day, losses +)"
				}), /* @__PURE__ */ jsx("div", {
					className: "mt-2 overflow-x-auto",
					children: /* @__PURE__ */ jsxs("table", {
						className: "w-full min-w-[520px] text-left font-mono text-[12px]",
						children: [/* @__PURE__ */ jsx("thead", {
							className: "text-[10px] tracking-wider text-fg-subtle uppercase",
							children: /* @__PURE__ */ jsx("tr", { children: [
								"Method",
								"VaR",
								"ES",
								"Notes"
							].map((h) => /* @__PURE__ */ jsx("th", {
								className: "px-3 py-2",
								children: h
							}, h)) })
						}), /* @__PURE__ */ jsx("tbody", { children: snap.methods.map((m) => /* @__PURE__ */ jsxs("tr", {
							className: "border-t border-border",
							children: [
								/* @__PURE__ */ jsx("td", {
									className: "px-3 py-2",
									children: m.method
								}),
								/* @__PURE__ */ jsx("td", {
									className: "px-3",
									children: Number.isFinite(m.VaR) ? fmtPct(m.VaR * 100, 2, false) : "—"
								}),
								/* @__PURE__ */ jsx("td", {
									className: "px-3",
									children: Number.isFinite(m.ES) ? fmtPct(m.ES * 100, 2, false) : "—"
								}),
								/* @__PURE__ */ jsxs("td", {
									className: "px-3 text-fg-muted",
									children: [
										m.extra?.nu != null && `ν=${Number(m.extra.nu).toFixed(1)} `,
										m.extra?.valid === false && "CF not monotone ",
										m.extra?.xi != null && `ξ=${Number(m.extra.xi).toFixed(2)} `
									]
								})
							]
						}, m.method)) })]
					})
				})]
			}),
			/* @__PURE__ */ jsxs("section", {
				className: "grid gap-4 border-t border-border p-3 md:grid-cols-2 md:p-4",
				children: [/* @__PURE__ */ jsxs("div", { children: [
					/* @__PURE__ */ jsx("h2", {
						className: "font-mono text-[10px] tracking-wider text-fg-subtle uppercase",
						children: "Backtest (hist, 500d window)"
					}),
					/* @__PURE__ */ jsxs("dl", {
						className: "mt-2 grid grid-cols-2 gap-2 font-mono text-[12px]",
						children: [
							/* @__PURE__ */ jsx(KV, {
								k: "N",
								v: String(snap.bt.n)
							}),
							/* @__PURE__ */ jsx(KV, {
								k: "Exceptions",
								v: `${snap.bt.kupiec.exceptions} / exp ${snap.bt.kupiec.expected.toFixed(1)}`
							}),
							/* @__PURE__ */ jsx(KV, {
								k: "Kupiec p",
								v: snap.bt.kupiec.p.toFixed(3)
							}),
							/* @__PURE__ */ jsx(KV, {
								k: "Christoffersen p",
								v: snap.bt.christoffersen.p.toFixed(3)
							}),
							/* @__PURE__ */ jsx(KV, {
								k: "CC p",
								v: snap.bt.pCC.toFixed(3)
							}),
							/* @__PURE__ */ jsx(KV, {
								k: "Basel 250d",
								v: snap.bt.basel.zone.toUpperCase()
							})
						]
					}),
					/* @__PURE__ */ jsx("div", {
						className: "mt-3 h-40 rounded-md border border-border bg-bg-elevated p-2",
						children: /* @__PURE__ */ jsx(BoundArea, {
							data: btSeries,
							xKey: "d",
							yKey: "ret",
							color: "var(--info)"
						})
					})
				] }), /* @__PURE__ */ jsxs("div", { children: [
					/* @__PURE__ */ jsx("h2", {
						className: "font-mono text-[10px] tracking-wider text-fg-subtle uppercase",
						children: "Euler VaR decomposition"
					}),
					/* @__PURE__ */ jsx("ul", {
						className: "mt-2 divide-y divide-border rounded-md border border-border",
						children: snap.decomp.map((d) => /* @__PURE__ */ jsxs("li", {
							className: "flex justify-between px-3 py-2 font-mono text-[12px]",
							children: [/* @__PURE__ */ jsx("span", { children: d.name }), /* @__PURE__ */ jsxs("span", {
								className: "text-fg-muted",
								children: [
									d.pct.toFixed(1),
									"% · w ",
									Math.round(d.weight * 100)
								]
							})]
						}, d.name))
					}),
					/* @__PURE__ */ jsx("h2", {
						className: "mt-4 font-mono text-[10px] tracking-wider text-fg-subtle uppercase",
						children: "Stress P&L"
					}),
					/* @__PURE__ */ jsx("div", {
						className: "mt-2 h-40 rounded-md border border-border bg-bg-elevated p-2",
						children: /* @__PURE__ */ jsx(BoundBar, {
							data: snap.stress.map((s) => ({
								label: s.id,
								v: +(s.pnl * 100).toFixed(2)
							})),
							xKey: "label",
							yKey: "v",
							color: "var(--bear)"
						})
					})
				] })]
			}),
			/* @__PURE__ */ jsxs("section", {
				className: "border-t border-border px-3 py-4 md:px-4",
				children: [
					/* @__PURE__ */ jsx("h2", {
						className: "font-mono text-[10px] tracking-wider text-fg-subtle uppercase",
						children: "Kelly"
					}),
					/* @__PURE__ */ jsxs("div", {
						className: "mt-2 grid gap-2 sm:grid-cols-4",
						children: [
							/* @__PURE__ */ jsx(Tile, {
								k: "f* continuous",
								v: snap.kelly.fStar.toFixed(2),
								sub: "(μ−r)/σ² daily"
							}),
							/* @__PURE__ */ jsx(Tile, {
								k: "f empirical",
								v: snap.kelly.fEmp.toFixed(2),
								sub: "max Σ log(1+fR)"
							}),
							/* @__PURE__ */ jsx(Tile, {
								k: "f Bayes-shrunk",
								v: snap.kelly.fBayes.toFixed(2),
								sub: "τ=0.4 on Sharpe"
							}),
							/* @__PURE__ */ jsx(Tile, {
								k: "from trades",
								v: Number.isFinite(snap.kelly.fromTrades.f_kelly) ? snap.kelly.fromTrades.f_kelly.toFixed(2) : "—",
								sub: `W=${((snap.kelly.fromTrades.win_rate ?? 0) * 100).toFixed(0)}%`
							})
						]
					}),
					/* @__PURE__ */ jsxs("table", {
						className: "mt-3 w-full text-left font-mono text-[12px]",
						children: [/* @__PURE__ */ jsx("thead", {
							className: "text-[10px] text-fg-subtle uppercase",
							children: /* @__PURE__ */ jsxs("tr", { children: [
								/* @__PURE__ */ jsx("th", {
									className: "py-2",
									children: "c × f*"
								}),
								/* @__PURE__ */ jsx("th", { children: "f" }),
								/* @__PURE__ */ jsx("th", { children: "P(touch 50%)" }),
								/* @__PURE__ */ jsx("th", { children: "g (ann.)" })
							] })
						}), /* @__PURE__ */ jsx("tbody", { children: snap.kelly.dd.map((d) => /* @__PURE__ */ jsxs("tr", {
							className: "border-t border-border",
							children: [
								/* @__PURE__ */ jsxs("td", {
									className: "py-2",
									children: [d.c, "×"]
								}),
								/* @__PURE__ */ jsx("td", { children: d.f.toFixed(2) }),
								/* @__PURE__ */ jsxs("td", { children: [(d.p50 * 100).toFixed(1), "%"] }),
								/* @__PURE__ */ jsxs("td", { children: [(d.g * 100).toFixed(2), "%"] })
							]
						}, d.c)) })]
					}),
					/* @__PURE__ */ jsx("p", {
						className: "mt-3 max-w-3xl text-[12px] text-fg-muted",
						children: "Full Kelly has a 50% chance of drawing down to half the capital (continuous GBM). Desk default is 0.25–0.5×. Position size uses historical ES so that a 1-day tail equals the risk budget."
					})
				]
			})
		]
	});
}
function Tile({ k, v, sub }) {
	return /* @__PURE__ */ jsxs("div", {
		className: "rounded-md border border-border bg-bg-elevated p-3",
		children: [
			/* @__PURE__ */ jsx("div", {
				className: "font-mono text-[10px] text-fg-subtle",
				children: k
			}),
			/* @__PURE__ */ jsx("div", {
				className: "mt-1 font-mono text-lg tabular",
				children: v
			}),
			sub && /* @__PURE__ */ jsx("div", {
				className: "mt-1 text-[11px] text-fg-muted",
				children: sub
			})
		]
	});
}
function KV({ k, v }) {
	return /* @__PURE__ */ jsxs("div", {
		className: "rounded-sm bg-bg-panel px-2 py-2",
		children: [/* @__PURE__ */ jsx("div", {
			className: "text-[10px] text-fg-subtle",
			children: k
		}), /* @__PURE__ */ jsx("div", {
			className: cn("text-fg", v === "RED" && "text-bear", v === "YELLOW" && "text-warn", v === "GREEN" && "text-bull"),
			children: v
		})]
	});
}
//#endregion
//#region src/routes/risk.tsx?tsr-split=component
var SplitComponent = RiskView;
//#endregion
export { SplitComponent as component };
