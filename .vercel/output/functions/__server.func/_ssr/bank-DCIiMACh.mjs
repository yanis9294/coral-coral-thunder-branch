import { i as __toESM } from "../_runtime.mjs";
import { C as require_jsx_runtime, Z as require_react, x as useNavigate } from "../_libs/@tanstack/react-router+[...].mjs";
import { C as cn, N as guessDomain, P as guessInstrument, V as newUserThesis, it as utcStamp, nt as utcDate, tt as useTerminal } from "./shell-B4EHQ9b6.mjs";
import { n as IntelPage } from "./page-Crv803Pc.mjs";
import { t as createServerFn } from "./ssr.mjs";
import { n as BANK_SOURCES } from "./bank-sources-Cttxufcf.mjs";
import { t as createSsrRpc } from "./createSsrRpc-C1p7zOu_.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/bank-DCIiMACh.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var fetchBankFeed = createServerFn({ method: "POST" }).handler(createSsrRpc("8a1597edd1b073acd7ac88e6749b1bc240e86bb40e8b2b75f494c6879f9757f5"));
var draftThesisFromNote = createServerFn({ method: "POST" }).validator((d) => d).handler(createSsrRpc("10f155a706257f65b57ae66f23a19d2ca631149d50223f424d304533671c6c07"));
var KINDS = [
	"All",
	"IB",
	"Commercial",
	"Broker",
	"Regional"
];
function BankView() {
	const nav = useNavigate();
	const add = useTerminal((s) => s.addThesis);
	const articles = useTerminal((s) => s.bankArticles);
	const live = useTerminal((s) => s.bankFeedLive);
	const at = useTerminal((s) => s.bankFeedAt);
	const setFeed = useTerminal((s) => s.setBankFeed);
	const [busy, setBusy] = (0, import_react.useState)(false);
	const [err, setErr] = (0, import_react.useState)(null);
	const [kind, setKind] = (0, import_react.useState)("All");
	const [house, setHouse] = (0, import_react.useState)("All");
	const [q, setQ] = (0, import_react.useState)("");
	const [drafting, setDrafting] = (0, import_react.useState)(null);
	const houses = (0, import_react.useMemo)(() => ["All", ...Array.from(new Set(BANK_SOURCES.map((s) => s.house)))], []);
	const load = async () => {
		setBusy(true);
		setErr(null);
		try {
			const r = await fetchBankFeed();
			setFeed(r.articles, r.live, r.fetchedAt);
		} catch (e) {
			setErr(e instanceof Error ? e.message : "Feed failed");
		} finally {
			setBusy(false);
		}
	};
	(0, import_react.useEffect)(() => {
		if (!at) load();
	}, []);
	const filtered = articles.filter((a) => {
		if (house !== "All" && a.house !== house) return false;
		if (q && !`${a.title} ${a.house} ${a.tag}`.toLowerCase().includes(q.toLowerCase())) return false;
		return true;
	});
	const commit = (a) => {
		const t = newUserThesis({
			title: `${a.house}: ${a.title}`.slice(0, 160),
			instrument: guessInstrument(`${a.title} ${a.summary}`),
			domain: guessDomain(`${a.title} ${a.summary}`),
			type: "Trade",
			horizon: "6w",
			memo: `${a.summary}\n\nSourced ${a.house} · ${utcDate(a.ts)}. House colour, not a desk primary — size as such.`,
			supports: [`Street note — ${a.house}`, a.title],
			cuts: ["House view. Verify against the tape before sizing."],
			changeMind: ["Note withdrawn, or the print the house is hanging on reverses."],
			analyst: a.house,
			links: [{
				label: a.house,
				href: a.href
			}, {
				label: "Bank",
				href: "/bank"
			}]
		});
		add(t);
		nav({
			to: "/theses/$id",
			params: { id: t.id }
		});
	};
	const grokDraft = async (a) => {
		setDrafting(a.id);
		setErr(null);
		try {
			const r = await draftThesisFromNote({ data: {
				house: a.house,
				title: a.title,
				body: a.summary,
				href: a.href
			} });
			if (!r.ok) {
				setErr(r.error);
				return;
			}
			const t = newUserThesis({
				title: r.draft.title,
				instrument: r.draft.instrument,
				domain: r.draft.domain,
				type: r.draft.type,
				horizon: r.draft.horizon,
				memo: r.draft.memo,
				supports: r.draft.supports,
				cuts: r.draft.cuts,
				changeMind: r.draft.changeMind,
				analyst: `${a.house} · Grok`,
				links: [{
					label: a.house,
					href: a.href
				}, {
					label: "Bank",
					href: "/bank"
				}]
			});
			add(t);
			nav({
				to: "/theses/$id",
				params: { id: t.id }
			});
		} catch (e) {
			setErr(e instanceof Error ? e.message : "Draft failed");
		} finally {
			setDrafting(null);
		}
	};
	const src = BANK_SOURCES.filter((s) => (kind === "All" || s.kind === kind) && (house === "All" || s.house === house));
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(IntelPage, {
		title: "Bank",
		kicker: "Live street tape — ING / Fed / ECB / house RSS",
		actions: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
			type: "button",
			onClick: () => void load(),
			disabled: busy,
			className: "h-7 rounded-sm border border-border px-2 font-mono text-[11px] hover:bg-bg-hover disabled:opacity-50",
			children: busy ? "Fetching…" : "Refresh"
		}),
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
				className: cn("border-b border-border px-3 py-2 font-mono text-[11px] md:px-4", live ? "text-bull" : "text-warn"),
				children: [
					live ? "LIVE RSS" : "CACHE — desk reconstructions",
					at ? ` · pulled ${utcStamp(at)} UTC ${utcDate(at)}` : "",
					" · ",
					articles.length,
					" notes · Make thesis writes an Open call on Theses"
				]
			}),
			err && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "border-b border-border px-3 py-2 font-mono text-[11px] text-bear md:px-4",
				children: err
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex flex-wrap items-center gap-2 border-b border-border px-3 py-2 md:px-4",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
					value: q,
					onChange: (e) => setQ(e.target.value),
					placeholder: "Filter the tape…",
					className: "h-8 min-w-[160px] flex-1 rounded-sm border border-border bg-bg-panel px-2 font-mono text-[12px] outline-none"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("select", {
					value: house,
					onChange: (e) => setHouse(e.target.value),
					className: "h-8 border border-border bg-bg-panel px-2 font-mono text-[11px]",
					children: ["All", ...Array.from(new Set(articles.map((a) => a.house))).sort()].map((h) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", { children: h }, h))
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "border-b border-border px-3 py-4 md:px-4",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "font-mono text-[10px] tracking-wider text-fg-subtle uppercase",
					children: "Fresh notes"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mt-3 grid gap-3 md:grid-cols-2",
					children: [filtered.slice(0, 24).map((n) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("article", {
						className: "flex flex-col rounded-md border border-border bg-bg-elevated p-4",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center gap-2 font-mono text-[10px] text-fg-subtle",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "text-accent",
										children: n.house
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "·" }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: utcDate(n.ts) }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "ml-auto tracking-wider uppercase",
										children: n.tag
									})
								]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
								className: "mt-2 text-sm font-medium leading-snug",
								children: n.title
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "mt-2 flex-1 text-[13px] leading-relaxed text-fg-muted",
								children: n.summary
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "mt-3 flex flex-wrap gap-2 font-mono text-[11px]",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
										type: "button",
										onClick: () => commit(n),
										className: "h-8 rounded-sm border border-border px-2 hover:bg-bg-hover",
										children: "Make thesis"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
										type: "button",
										onClick: () => void grokDraft(n),
										disabled: drafting === n.id,
										className: "h-8 rounded-sm border border-border px-2 hover:bg-bg-hover disabled:opacity-50",
										children: drafting === n.id ? "Grok…" : "Draft with Grok"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
										href: n.href,
										target: "_blank",
										rel: "noreferrer",
										className: "inline-flex h-8 items-center text-accent no-underline",
										children: "Open →"
									})
								]
							})
						]
					}, n.id)), filtered.length === 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-[13px] text-fg-muted",
						children: "No notes in this filter."
					})]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "px-3 py-4 md:px-4",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex flex-wrap items-center gap-2",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
							className: "mr-4 font-mono text-[10px] tracking-wider text-fg-subtle uppercase",
							children: "Directory"
						}),
						KINDS.map((k) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "button",
							onClick: () => setKind(k),
							className: cn("h-7 px-2 font-mono text-[10px]", kind === k ? "text-fg" : "text-fg-muted"),
							children: k
						}, k)),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("select", {
							value: house,
							onChange: (e) => setHouse(e.target.value),
							className: "ml-auto h-8 border border-border bg-bg-panel px-2 font-mono text-[11px]",
							children: houses.map((h) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", { children: h }, h))
						})
					]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
					className: "mt-3 divide-y divide-border rounded-md border border-border",
					children: src.map((s) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
						className: "flex flex-col gap-1 px-3 py-3 sm:flex-row sm:items-baseline sm:justify-between",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "min-w-0",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex flex-wrap items-center gap-2",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "font-mono text-[11px] text-accent",
											children: s.house
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "rounded-xs border border-border px-1.5 font-mono text-[10px] text-fg-subtle",
											children: s.kind
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "font-mono text-[10px] text-fg-subtle",
											children: s.desk
										})
									]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "mt-1 text-sm",
									children: s.title
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "mt-1 text-[12px] text-fg-muted",
									children: s.note
								})
							]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
							href: s.href,
							target: "_blank",
							rel: "noreferrer",
							className: "shrink-0 font-mono text-[11px] text-accent no-underline",
							children: "Open →"
						})]
					}, s.id))
				})]
			})
		]
	});
}
var SplitComponent = BankView;
//#endregion
export { SplitComponent as component };
