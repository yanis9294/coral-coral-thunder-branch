import { C as require_jsx_runtime } from "../_libs/@tanstack/react-router+[...].mjs";
import { g as TerminalShell } from "./shell-B4EHQ9b6.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/page-Crv803Pc.js
var import_jsx_runtime = require_jsx_runtime();
function IntelPage({ title, kicker, actions, children }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TerminalShell, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", {
		className: "flex min-h-0 min-w-0 flex-1 flex-col overflow-hidden bg-bg",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex h-10 shrink-0 items-center gap-3 border-b border-border px-3 md:px-4",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "font-mono text-[10px] tracking-[0.16em] text-fg-subtle",
					children: "INTEL"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					className: "text-sm font-medium tracking-tight",
					children: title
				}),
				kicker && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "hidden truncate text-[11px] text-fg-muted md:inline",
					children: kicker
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "ml-auto flex items-center gap-2",
					children: actions
				})
			]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "min-h-0 flex-1 overflow-y-auto terminal-scroll",
			children
		})]
	}) });
}
function Drawer({ title, onClose, children }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "fixed inset-0 z-40 flex justify-end bg-bg/50",
		onClick: onClose,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("aside", {
			className: "flex h-full w-full max-w-md flex-col border-l border-border bg-bg-elevated shadow-2xl",
			onClick: (e) => e.stopPropagation(),
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex h-11 shrink-0 items-center justify-between border-b border-border px-4",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "text-sm font-medium",
					children: title
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					type: "button",
					onClick: onClose,
					className: "font-mono text-[11px] text-fg-muted hover:text-fg",
					children: "ESC"
				})]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "min-h-0 flex-1 overflow-y-auto p-4 terminal-scroll",
				children
			})]
		})
	});
}
//#endregion
export { IntelPage as n, Drawer as t };
