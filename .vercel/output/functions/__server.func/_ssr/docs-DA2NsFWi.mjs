import { i as __toESM } from "../_runtime.mjs";
import { C as require_jsx_runtime, Z as require_react, b as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { C as cn, b as bbdxyWeightSum, c as ICE_DXY_FACTOR, l as ICE_DXY_WEIGHTS, n as BBDXY_REBASE, t as BBDXY_2026 } from "./shell-B4EHQ9b6.mjs";
import { n as IntelPage } from "./page-Crv803Pc.mjs";
import { n as BANK_SOURCES } from "./bank-sources-Cttxufcf.mjs";
import { i as MODEL_VERSION, n as METHODOLOGY, r as MODEL_UPDATED, t as CHANGELOG } from "./methodology-DOqfsOFU.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/docs-DA2NsFWi.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
/**
* Local Qwen Code / OpenAI-compatible client.
* Default: disabled. Endpoint and model live in localStorage (never env secrets).
* When enabled, POSTs to `{baseUrl}/chat/completions` — typical local servers:
*   Ollama        http://127.0.0.1:11434/v1
*   LM Studio     http://127.0.0.1:1234/v1
*   llama.cpp     http://127.0.0.1:8081/v1   (avoid 8080 — ARGOS binds that)
*   vLLM / Qwen   http://127.0.0.1:8000/v1
*/
var QWEN_STORAGE_KEY = "argos-qwen";
var DEFAULT_QWEN = {
	enabled: false,
	baseUrl: "http://127.0.0.1:11434/v1",
	model: "qwen2.5-coder:7b",
	apiKey: ""
};
function loadQwenConfig() {
	try {
		const raw = localStorage.getItem(QWEN_STORAGE_KEY);
		if (!raw) return { ...DEFAULT_QWEN };
		const p = JSON.parse(raw);
		return {
			...DEFAULT_QWEN,
			...p
		};
	} catch {
		return { ...DEFAULT_QWEN };
	}
}
function saveQwenConfig(cfg) {
	try {
		localStorage.setItem(QWEN_STORAGE_KEY, JSON.stringify(cfg));
	} catch {}
}
async function qwenChat(messages, cfg, opts) {
	if (!cfg.enabled) return {
		ok: false,
		error: "Local Qwen is off. Enable it in Docs → Local AI."
	};
	const url = `${cfg.baseUrl.replace(/\/$/, "")}/chat/completions`;
	const ctrl = new AbortController();
	const t = setTimeout(() => ctrl.abort(), opts?.timeoutMs ?? 2e4);
	try {
		const headers = { "Content-Type": "application/json" };
		if (cfg.apiKey) headers.Authorization = `Bearer ${cfg.apiKey}`;
		const res = await fetch(url, {
			method: "POST",
			headers,
			body: JSON.stringify({
				model: cfg.model,
				messages,
				temperature: .2,
				max_tokens: 800
			}),
			signal: ctrl.signal
		});
		if (!res.ok) {
			const body = await res.text().catch(() => "");
			return {
				ok: false,
				error: `Qwen HTTP ${res.status} ${body.slice(0, 180)}`
			};
		}
		const text = (await res.json()).choices?.[0]?.message?.content?.trim();
		if (!text) return {
			ok: false,
			error: "Empty completion from local model."
		};
		return {
			ok: true,
			text
		};
	} catch (e) {
		return {
			ok: false,
			error: `Cannot reach ${url} (${e instanceof Error ? e.message : "network"}). Start Qwen Code / Ollama locally, then retry.`
		};
	} finally {
		clearTimeout(t);
	}
}
var QWEN_SYSTEM = `You are the ARGOS desk assistant running locally. Be terse, numerical, and cite which ARGOS view (Monitor, COT, STIR, Risk, Macro) the user should open. Never invent live prints — the terminal's tape is synthetic unless a live feed is wired.`;
function DocsView() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(IntelPage, {
		title: "Docs",
		kicker: `${MODEL_VERSION} · verify every number`,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mx-auto max-w-4xl space-y-8 p-3 pb-16 md:p-6",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
					className: "text-[13px] leading-relaxed text-fg-muted",
					children: [
						"ARGOS is a markets and geopolitics terminal. This page is the audit trail: what is live, what is synthetic, which formula sits behind each tile, and how to run the desk on a machine you control. Model cards also live on",
						" ",
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
							to: "/methodology",
							className: "text-accent no-underline",
							children: "Methodology"
						}),
						"."
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Section, {
					id: "data",
					title: "1. Data policy",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", { children: [
						"Prices, COT, STIR strips, calendar prints, seasonality and the risk book are seeded simulations (mulberry32 + GARCH-t). They are internally consistent so you can verify engines, not so you can trade them. A banner that says",
						" ",
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "text-warn",
							children: "SYNTHETIC"
						}),
						" is binding. Bank and Invest are the exceptions: they fetch when you open them."
					] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("ul", {
						className: "mt-2 list-disc space-y-1 pl-4",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", { children: [
								"Clock seed: desk epoch ",
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "font-mono text-fg",
									children: "2026-09-19T12:13:00Z"
								}),
								". Time slider rewinds the same seed."
							] }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", { children: [
								"CFTC: no network. TFF rows come from ",
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "font-mono",
									children: "syntheticCotMarket"
								}),
								" in ",
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "font-mono",
									children: "src/data/cot-tff.ts"
								}),
								", a port of ",
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "font-mono",
									children: "vendor/quantdesk/cot.py"
								}),
								"."
							] }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", { children: [
								"VaR/ES/Kelly: port of ",
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "font-mono",
									children: "vendor/quantdesk/risk.py"
								}),
								" + ",
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "font-mono",
									children: "kelly.py"
								}),
								". GARCH-FHS (arch) is omitted in-browser."
							] }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: "Bank: live RSS (ING Think, Fed, ECB, Google News house queries). If every feed fails, the tape falls back to desk reconstructions and the banner says CACHE. Directory links stay below the tape. Make thesis is a heuristic; Draft with Grok only fires when you press it." }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: "Invest: Yahoo chart + fundamentals-timeseries for DCF and the book (no crumb). Congress is a labeled public-tape cache, not a live PTR feed." })
						]
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Section, {
					id: "local",
					title: "2. Run it locally",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: "Node 22, npm. From the project root:" }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("pre", {
							className: "mt-2 overflow-x-auto rounded-md border border-border bg-bg-sunken p-3 font-mono text-[11px] text-fg",
							children: `npm install
npm run dev
# binds 0.0.0.0:8080 — open that origin in a browser`
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "mt-2",
							children: [
								"Auth and database are off. Preferences (layers, theses, watchlist, risk weights, Qwen config) persist in",
								" ",
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "font-mono",
									children: "localStorage"
								}),
								" keys ",
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "font-mono",
									children: "argos-terminal"
								}),
								" and",
								" ",
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "font-mono",
									children: "argos-qwen"
								}),
								". Production build: ",
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "font-mono",
									children: "npm run build"
								}),
								" then",
								" ",
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "font-mono",
									children: "npm run preview"
								}),
								"."
							]
						})
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(QwenPanel, {}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Section, {
					id: "dxy",
					title: "4. Dollar indices",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", { children: [
							"ICE DXY is the NYBOT geometric 6-currency basket. Factor ",
							ICE_DXY_FACTOR,
							". Weights:"
						] }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
							className: "mt-2 space-y-0.5 font-mono text-[11px]",
							children: ICE_DXY_WEIGHTS.map((w) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", { children: [
								w.pair,
								" ^",
								w.invert ? "−" : "",
								w.w,
								w.invert ? " (invert XXXUSD)" : ""
							] }, w.pair))
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "mt-3",
							children: [
								"BBDXY is Bloomberg Dollar Spot, 2026 target weights effective after the close of 30 Jun 2026 (50% Fed trade / 50% BIS FX liquidity; CNH capped at 7.00). Geometric, USD-strength quotes, rebased ",
								BBDXY_REBASE,
								" at the terminal’s central spots. Weight sum ",
								bbdxyWeightSum().toFixed(2),
								"."
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "mt-2 overflow-x-auto",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("table", {
								className: "w-full min-w-[420px] text-left font-mono text-[11px]",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("thead", {
									className: "text-[10px] text-fg-subtle uppercase",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", { children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
											className: "py-1",
											children: "CCY"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", { children: "Pair" }),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", { children: "w %" })
									] })
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tbody", { children: BBDXY_2026.map((c) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
									className: "border-t border-border",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
											className: "py-1",
											children: c.name
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
											className: "text-fg-muted",
											children: c.pair
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", { children: c.w.toFixed(2) })
									]
								}, c.pair)) })]
							})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "mt-2",
							children: [
								"Formula: ",
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
									className: "font-mono text-fg",
									children: [
										"BBDXY = ",
										BBDXY_REBASE,
										" · Π (S_t / S_0)^w"
									]
								}),
								". MXN, CAD, CNH, KRW, INR, SGD, TWD are in BBDXY and not in ICE DXY. See STIR for the live tiles."
							]
						})
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Section, {
					id: "yields",
					title: "5. Yield spreads",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: "Levels are seeded US/DE/JP/GB curves. Spreads in basis points: 2s10s, 5s30s, 10s30s, 2s30s, US–DE 10Y, US–JP 10Y, US–GB 10Y, US 10Y real (nominal − 10Y BEI), SOFR−FF, IORB−FF. Ticker carries DXY, BBDXY, US10Y, 2s10s, SOFR, SOFR−FF." })
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Section, {
					id: "stir",
					title: "6. STIR",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: "Quarterly whites/reds for SOFR, FF, Euribor, SONIA, TONA, CORRA. Implied = 100 − future price. Meeting odds are a tilted Bernoulli on ±25 bp. Cumulative path is the sum of expected steps. FRA–OIS proxy = 3M SOFR − EFFR. Not a live CME feed." })
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Section, {
					id: "cot",
					title: "7. COT (TFF)",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", { children: [
							"Port of ",
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "font-mono",
								children: "quantdesk/cot.py"
							}),
							". Traders in Financial Futures: leveraged funds, dealers, asset managers, other. Features:"
						] }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("pre", {
							className: "mt-2 overflow-x-auto rounded-md border border-border bg-bg-sunken p-3 font-mono text-[11px]",
							children: `net_k = (long_k − short_k) / OI × 100
net_cot = net_lf − net_dealer
idx = Williams (x − min) / (max − min) over 156 weeks
z over 156 weeks; d4 / d13 diffs
lf_am_div = z_lf − z_am
extreme ±1 at idx ≥ 0.85 / ≤ 0.15, contrarian`
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "mt-2",
							children: [
								"Timing (no look-ahead): positions as-of Tuesday; CFTC publishes Friday 15:30 ET (",
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "font-mono",
									children: "release_lag=3"
								}),
								"). Default ",
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "font-mono",
									children: "exec_lag=2"
								}),
								" uses Monday close. Trading Tuesday on Tuesday is a 3-day look-ahead. Crypto is CME futures only. Source flag is always ",
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "font-mono",
									children: "synthetic"
								}),
								" here."
							]
						})
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Section, {
					id: "risk",
					title: "8. Risk (VaR / ES / Kelly)",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: "Losses are positive. 1,260 synthetic GARCH-t sessions, 500-day rolling backtest. Estimators: historical, normal, Student-t (ν from excess kurtosis), Cornish-Fisher, EVT POT (GPD MOM), EWMA λ=0.94. Kupiec POF, Christoffersen independence, Basel traffic light on last 250d. Kelly f* = (μ−r)/σ²; empirical max Σ log(1+fR); Bayes shrink of Sharpe toward 0 (τ=0.4). Binary f = p/L − (1−p)/W. P(touch x) = x^(2/c − 1). Size = capital × budget / ES." }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-2",
						children: "Do not size live risk off this tape. Full Kelly has ~50% chance of drawing down to half the capital (GBM)."
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Section, {
					id: "macro",
					title: "9. Economic calendar",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: "Surprise z = (actual − consensus) / σ_survey. High / low = consensus ± 1.2816 σ (10th / 90th). P(beat) / P(miss) / P(inline) from a biased split. P(above high) = 1 − Φ(z_high − bias). Historical 30m move is the mean beat/miss impulse of the primary related asset (FX bp, yields bp, or index %). Drawer lists related tickers and a lookback of 12–26 prints. Not a Bloomberg ECO calendar." })
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Section, {
					id: "season",
					title: "10. Seasonality",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: "Twelve years of synthetic monthly returns with asset-specific seasonal means (September oil strength, December equity strength are injected, not estimated from a live sample). vsSeason = this-month % change − seasonal mean. Win rate, σ, best, worst over n years." })
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Section, {
					id: "theses",
					title: "11. Theses",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", { children: [
						"Desk book is editorial. Add thesis writes to ",
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "font-mono",
							children: "localStorage"
						}),
						" (user flag). Hit rate is closed HIT / closed n. Replay at entry sets the Monitor time slider to the open date."
					] })
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Section, {
					id: "bank",
					title: "12. Bank tape",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", { children: [
						"Refresh pulls ING Think, the Fed press XML, the ECB press RSS, and Google News queries for the directory houses. Items are deduped and sorted newest first (cap 80). A LIVE RSS banner means at least one feed answered; CACHE means the desk reconstructions in ",
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "font-mono",
							children: "BANK_NOTES"
						}),
						". Make thesis writes an Open call from the headline. Draft with Grok calls xAI only on that click and refuses if the key is absent — it does not invent a draft."
					] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
						className: "mt-2 space-y-1 font-mono text-[11px]",
						children: BANK_SOURCES.map((s) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", { children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-accent",
								children: s.house
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
								className: "text-fg-subtle",
								children: [
									" · ",
									s.kind,
									" · "
								]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
								href: s.href,
								target: "_blank",
								rel: "noreferrer",
								className: "text-fg no-underline hover:text-accent",
								children: s.title
							})
						] }, s.id))
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Section, {
					id: "invest",
					title: "13. Invest",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", { children: [
						"Port of the desk toolkit (",
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "font-mono",
							children: "vendor/invest"
						}),
						"). DCF: annual FCF CAGR clipped to ±50%, WACC from equity beta vs SPY, Rf from ^TNX, Rm from 10y ^GSPC CAGR, Gordon terminal only if WACC exceeds g. BUY/SELL if the margin of safety is outside ±5%. Price and beta are current; FCF is historical — that is a look-ahead, labeled on the thesis. Portfolio: Dirichlet Monte Carlo, max-Sharpe and min-vol, walk-forward on the trailing 180 sessions only (rebalance every 21). Congress: signed mid of disclosed ranges. Legal lag up to 45 days. Not a live Capitol Trades scrape."
					] })
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Section, {
					id: "cards",
					title: "14. Model cards",
					children: [
						METHODOLOGY.map((m) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("article", {
							className: "mt-3 rounded-md border border-border bg-bg-elevated p-4",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
								className: "text-sm font-medium",
								children: m.name
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("dl", {
								className: "mt-2 space-y-1 text-[12px] text-fg-muted",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "text-fg-subtle",
										children: "Lookback · "
									}), m.lookback] }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "text-fg-subtle",
										children: "Sources · "
									}), m.sources] }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "text-fg-subtle",
										children: "Formula · "
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "font-mono text-[11px] text-fg",
										children: m.formula
									})] }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "pt-1",
										children: m.notes
									})
								]
							})]
						}, m.id)),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
							className: "mt-6 text-sm font-medium",
							children: "Changelog"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
							className: "mt-2 space-y-2 text-[12px] text-fg-muted",
							children: CHANGELOG.map((c) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", { children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "font-mono text-fg",
									children: c.v
								}),
								" · ",
								c.date,
								" — ",
								c.text
							] }, c.v))
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "mt-4 font-mono text-[11px] text-fg-subtle",
							children: ["Updated ", MODEL_UPDATED]
						})
					]
				})
			]
		})
	});
}
function Section({ id, title, children }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
		id,
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
			className: "font-mono text-[10px] tracking-wider text-fg-subtle uppercase",
			children: title
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "mt-2 text-[13px] leading-relaxed text-fg-muted",
			children
		})]
	});
}
function QwenPanel() {
	const [cfg, setCfg] = (0, import_react.useState)(DEFAULT_QWEN);
	const [ping, setPing] = (0, import_react.useState)(null);
	const [busy, setBusy] = (0, import_react.useState)(false);
	const [hydrated, setHydrated] = (0, import_react.useState)(false);
	(0, import_react.useEffect)(() => {
		setCfg(loadQwenConfig());
		setHydrated(true);
	}, []);
	const save = (next) => {
		setCfg(next);
		saveQwenConfig(next);
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Section, {
		id: "qwen",
		title: "3. Local Qwen Code",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", { children: [
			"Prepared, off by default. Talks OpenAI-compatible ",
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "font-mono",
				children: "/chat/completions"
			}),
			". Typical local servers: Ollama ",
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "font-mono",
				children: "http://127.0.0.1:11434/v1"
			}),
			", LM Studio",
			" ",
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "font-mono",
				children: ":1234/v1"
			}),
			", llama.cpp (not on 8080 — ARGOS binds that), vLLM",
			" ",
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "font-mono",
				children: ":8000/v1"
			}),
			". Endpoint and model live in localStorage, never in env secrets."
		] }), !hydrated ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "mt-2 font-mono text-[11px] text-fg-subtle",
			children: "Loading local config…"
		}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mt-3 grid gap-2 sm:grid-cols-2",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
					className: "flex items-center gap-2 font-mono text-[12px] sm:col-span-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
						type: "checkbox",
						checked: cfg.enabled,
						onChange: (e) => save({
							...cfg,
							enabled: e.target.checked
						})
					}), "Enable local Qwen"]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
					className: "flex flex-col gap-1 font-mono text-[11px]",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "text-fg-subtle",
						children: "Base URL"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
						value: cfg.baseUrl,
						onChange: (e) => save({
							...cfg,
							baseUrl: e.target.value
						}),
						className: "h-8 border border-border bg-bg-panel px-2"
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
					className: "flex flex-col gap-1 font-mono text-[11px]",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "text-fg-subtle",
						children: "Model"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
						value: cfg.model,
						onChange: (e) => save({
							...cfg,
							model: e.target.value
						}),
						className: "h-8 border border-border bg-bg-panel px-2"
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
					className: "flex flex-col gap-1 font-mono text-[11px] sm:col-span-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "text-fg-subtle",
						children: "API key (optional)"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
						type: "password",
						value: cfg.apiKey,
						onChange: (e) => save({
							...cfg,
							apiKey: e.target.value
						}),
						className: "h-8 border border-border bg-bg-panel px-2"
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "sm:col-span-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						disabled: busy,
						onClick: async () => {
							setBusy(true);
							setPing(null);
							const res = await qwenChat([{
								role: "system",
								content: QWEN_SYSTEM
							}, {
								role: "user",
								content: "Reply with exactly: PONG"
							}], cfg, { timeoutMs: 8e3 });
							setPing(res.ok ? res.text : res.error);
							setBusy(false);
						},
						className: cn("h-8 rounded-sm border border-border px-3 font-mono text-[11px]", busy && "opacity-60"),
						children: busy ? "Pinging…" : "Ping local model"
					}), ping && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-2 font-mono text-[11px] text-fg",
						children: ping
					})]
				})
			]
		})]
	});
}
var SplitComponent = DocsView;
//#endregion
export { SplitComponent as component };
