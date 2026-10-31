import { useEffect } from "react";
import { HeadContent, Outlet, Scripts, createFileRoute, createRootRoute, createRouter, lazyRouteComponent, redirect, useRouter } from "@tanstack/react-router";
import { Fragment, jsx, jsxs } from "react/jsx-runtime";
import { TriangleAlert } from "lucide-react";
import { z } from "zod";
//#region \0rolldown/runtime.js
var __defProp = Object.defineProperty;
var __exportAll = (all, no_symbols) => {
	let target = {};
	for (var name in all) __defProp(target, name, {
		get: all[name],
		enumerable: true
	});
	if (!no_symbols) __defProp(target, Symbol.toStringTag, { value: "Module" });
	return target;
};
//#endregion
//#region src/lib/error-component.tsx
var FALLBACK_MESSAGE = "An unexpected error occurred. Try reloading the page.";
function errorMessage(error) {
	if (error instanceof Error && error.message) return error.message;
	if (typeof error === "string" && error) return error;
	return FALLBACK_MESSAGE;
}
function AppErrorComponent({ error }) {
	return /* @__PURE__ */ jsxs("main", {
		className: "flex min-h-screen flex-col items-center justify-center gap-3 bg-bg px-6 text-center text-fg",
		children: [
			/* @__PURE__ */ jsx("span", {
				className: "text-bear",
				"aria-hidden": "true",
				children: /* @__PURE__ */ jsx(TriangleAlert, {
					className: "size-8",
					strokeWidth: 1.75
				})
			}),
			/* @__PURE__ */ jsx("h1", {
				className: "font-sans text-base font-medium tracking-tight",
				children: "Terminal fault"
			}),
			/* @__PURE__ */ jsx("p", {
				className: "max-w-md font-mono text-xs break-words text-fg-muted",
				children: errorMessage(error)
			})
		]
	});
}
//#endregion
//#region src/lib/auth/provider.tsx
/**
* App-wide client provider mounted once near the root (in `src/routes/__root.tsx`):
*
*   <AuthProvider><Outlet /></AuthProvider>
*
* Better Auth's React client (`@/lib/auth/client`) needs NO context provider —
* its `useSession()` works standalone — so this is a passthrough today. It's
* kept as the single, stable mount point for any future client-side providers
* (e.g. a toast or theme provider) without churning the root shell.
*/
function AuthProvider({ children }) {
	return /* @__PURE__ */ jsx(Fragment, { children });
}
//#endregion
//#region src/lib/app-data/types.ts
var CONNECTOR_TOKEN_READY_EVENT = "grok:connector-token-ready";
//#endregion
//#region src/lib/preview-embedder-origin.ts
function isGrokEmbedderOrigin(origin) {
	try {
		const url = new URL(origin);
		if (url.protocol !== "https:" && url.protocol !== "http:") return false;
		const host = url.hostname.toLowerCase();
		if (host === "grok.com" || host.endsWith(".grok.com")) return true;
		if (host === "localhost" || host === "127.0.0.1" || host === "[::1]") return true;
		return false;
	} catch {
		return false;
	}
}
function isSandboxPreviewGuestHost(hostname) {
	const host = hostname.toLowerCase();
	return host === "grok-sandbox.com" || host.endsWith(".grok-sandbox.com");
}
function isRemintPreviewPair(guestHost, parentHost) {
	const guest = guestHost.toLowerCase();
	const parent = parentHost.toLowerCase();
	const i = guest.indexOf(".preview.");
	if (i <= 0) return false;
	const label = guest.slice(0, i);
	const rest = guest.slice(i + 9);
	if (label.includes(".") || !rest.includes(".")) return false;
	return parent === rest || parent === `grok.${rest}`;
}
function resolveParentEmbedderOrigin(parentIsSelf, referrer, ancestorOrigin, guestHostname = "") {
	if (parentIsSelf) return null;
	for (const candidate of [referrer, ancestorOrigin ?? ""].filter(Boolean)) try {
		const url = new URL(candidate.includes("://") ? candidate : `https://${candidate}`);
		if (url.protocol !== "https:" && url.protocol !== "http:") continue;
		if (isGrokEmbedderOrigin(url.origin)) return url.origin;
		if (isSandboxPreviewGuestHost(guestHostname) || isRemintPreviewPair(guestHostname, url.hostname)) return url.origin;
	} catch {}
	return null;
}
//#endregion
//#region src/lib/preview-host-bridge.ts
/**
* Guest side of the grok-web ↔ sandbox preview postMessage bridge.
*
* Activates only when this page is framed by an allowlisted Grok embedder.
* Top-level runs (download/export, local `npm run dev`, deployed sites) noop.
*/
var PREVIEW_BRIDGE_CHANNEL = "grok-preview-bridge";
var EnvelopeSchema = z.object({
	channel: z.literal(PREVIEW_BRIDGE_CHANNEL),
	version: z.number().int().positive(),
	type: z.string().min(1)
});
var HelloSchema = EnvelopeSchema.extend({ type: z.literal("hello") });
var NavigateSchema = EnvelopeSchema.extend({
	type: z.literal("navigate"),
	path: z.string().min(1)
});
var HistorySchema = EnvelopeSchema.extend({
	type: z.literal("history"),
	delta: z.union([z.literal(-1), z.literal(1)])
});
var ConnectorTokenReadySchema = EnvelopeSchema.extend({ type: z.literal("connector-token-ready") });
function isSafeBridgePath(path) {
	if (!path.startsWith("/") || path.startsWith("//") || path.includes("\\")) return false;
	try {
		return new URL(path, "https://preview.invalid").origin === "https://preview.invalid";
	} catch {
		return false;
	}
}
/**
* Origin of the Grok embedder framing this page, or null when the page runs
* top-level (download/export, local `npm run dev`, deployed sites) or under a
* non-Grok parent. Client-only; null during SSR.
*/
function resolveCurrentEmbedderOrigin() {
	if (typeof window === "undefined") return null;
	const ancestorOrigin = typeof location.ancestorOrigins !== "undefined" && location.ancestorOrigins.length > 0 ? location.ancestorOrigins[0] : null;
	return resolveParentEmbedderOrigin(window.parent === window, document.referrer, ancestorOrigin, window.location.hostname);
}
/**
* Install host↔guest messaging. Returns a dispose function.
* Noops (returns a no-op dispose) when not embedded under a Grok parent.
*/
function installPreviewHostBridge(options = {}) {
	const parentOrigin = resolveCurrentEmbedderOrigin();
	if (parentOrigin === null) return () => {};
	const ROOT_STATE_KEY = "__grokPreviewBridgeRoot";
	const originalPushState = window.history.pushState.bind(window.history);
	const originalReplaceState = window.history.replaceState.bind(window.history);
	const isAtHistoryRoot = () => {
		const state = window.history.state;
		return Boolean(state && typeof state === "object" && state[ROOT_STATE_KEY] === true);
	};
	try {
		const current = window.history.state;
		if (!(current !== null && typeof current === "object" && Object.prototype.hasOwnProperty.call(current, ROOT_STATE_KEY))) {
			const isRoot = window.history.length <= 1;
			originalReplaceState(current && typeof current === "object" ? {
				...current,
				[ROOT_STATE_KEY]: isRoot
			} : { [ROOT_STATE_KEY]: isRoot }, "", window.location.href);
		}
	} catch {}
	const post = (message) => {
		window.parent.postMessage(message, parentOrigin);
	};
	const reportLocation = () => {
		post({
			channel: PREVIEW_BRIDGE_CHANNEL,
			version: 1,
			type: "location",
			path: window.location.pathname || "/",
			search: window.location.search,
			hash: window.location.hash
		});
	};
	const reportRoutes = () => {
		const paths = options.getRoutePaths?.() ?? [];
		post({
			channel: PREVIEW_BRIDGE_CHANNEL,
			version: 1,
			type: "routes",
			paths
		});
	};
	const defaultNavigate = (path) => {
		if (!isSafeBridgePath(path)) return;
		try {
			const url = new URL(path, window.location.origin);
			if (url.origin !== window.location.origin) return;
			const next = `${url.pathname}${url.search}${url.hash}`;
			window.history.pushState(window.history.state, "", next);
			window.dispatchEvent(new PopStateEvent("popstate", { state: window.history.state }));
		} catch {}
	};
	const navigate = (path) => {
		if (!isSafeBridgePath(path)) return;
		if (options.navigate) {
			options.navigate(path);
			return;
		}
		defaultNavigate(path);
	};
	const announce = () => {
		reportLocation();
		reportRoutes();
		post({
			channel: PREVIEW_BRIDGE_CHANNEL,
			version: 1,
			type: "ready"
		});
	};
	const onHello = (data) => {
		if (!HelloSchema.safeParse(data).success) return;
		announce();
	};
	const onNavigate = (data) => {
		const parsed = NavigateSchema.safeParse(data);
		if (!parsed.success) return;
		navigate(parsed.data.path);
		queueMicrotask(reportLocation);
	};
	const onHistory = (data) => {
		const parsed = HistorySchema.safeParse(data);
		if (!parsed.success) return;
		if (parsed.data.delta === -1 && isAtHistoryRoot()) return;
		window.history.go(parsed.data.delta);
	};
	const onConnectorTokenReady = (data) => {
		if (!ConnectorTokenReadySchema.safeParse(data).success) return;
		window.dispatchEvent(new Event(CONNECTOR_TOKEN_READY_EVENT));
	};
	const hostMessageHandlers = /* @__PURE__ */ new Map([
		["hello", onHello],
		["navigate", onNavigate],
		["history", onHistory],
		["connector-token-ready", onConnectorTokenReady]
	]);
	const onMessage = (event) => {
		if (event.source !== window.parent) return;
		if (event.origin !== parentOrigin) return;
		const envelope = EnvelopeSchema.safeParse(event.data);
		if (!envelope.success || envelope.data.version !== 1) return;
		hostMessageHandlers.get(envelope.data.type)?.(event.data);
	};
	const onPopState = () => {
		reportLocation();
	};
	const onHashChange = () => {
		reportLocation();
	};
	window.history.pushState = (data, unused, url) => {
		const next = data && typeof data === "object" ? {
			...data,
			[ROOT_STATE_KEY]: false
		} : data;
		originalPushState(next, unused, url);
		reportLocation();
	};
	window.history.replaceState = (data, unused, url) => {
		const next = isAtHistoryRoot() ? {
			...data && typeof data === "object" ? data : {},
			[ROOT_STATE_KEY]: true
		} : data;
		originalReplaceState(next, unused, url);
		reportLocation();
	};
	window.addEventListener("message", onMessage);
	window.addEventListener("popstate", onPopState);
	window.addEventListener("hashchange", onHashChange);
	announce();
	return () => {
		window.removeEventListener("message", onMessage);
		window.removeEventListener("popstate", onPopState);
		window.removeEventListener("hashchange", onHashChange);
		window.history.pushState = originalPushState;
		window.history.replaceState = originalReplaceState;
	};
}
/** Collect static path patterns from a TanStack route tree (best-effort). */
function collectRoutePathsFromTree(routeTree) {
	const paths = /* @__PURE__ */ new Set();
	const walk = (node) => {
		if (!node || typeof node !== "object") return;
		const record = node;
		const full = typeof record.fullPath === "string" ? record.fullPath : typeof record.path === "string" ? record.path : null;
		if (full !== null && full !== "") paths.add(full.startsWith("/") ? full : `/${full}`);
		else if (full === "") paths.add("/");
		const children = record.children;
		if (Array.isArray(children)) for (const child of children) walk(child);
		else if (children && typeof children === "object") for (const child of Object.values(children)) walk(child);
	};
	walk(routeTree);
	return [...paths];
}
//#endregion
//#region src/components/preview-host-bridge.tsx
/**
* Mount once in `__root.tsx` so the Grok preview chrome can drive navigation
* (and later receive registered routes). Noops when the app is not embedded.
*/
function PreviewHostBridge() {
	const router = useRouter();
	useEffect(() => {
		return installPreviewHostBridge({
			navigate: (path) => {
				router.history.push(path);
			},
			getRoutePaths: () => collectRoutePathsFromTree(router.routeTree)
		});
	}, [router]);
	return null;
}
//#endregion
//#region src/styles.css?url
var styles_default = "/coral-coral-thunder-branch/assets/styles-ByREDP2K.css";
//#endregion
//#region src/routes/__root.tsx
var APP_NAME = "ARGOS";
var Route$21 = createRootRoute({
	head: () => ({
		meta: [
			{ charSet: "utf-8" },
			{
				name: "viewport",
				content: "width=device-width, initial-scale=1"
			},
			{ title: APP_NAME },
			{
				name: "description",
				content: "ARGOS — markets & geopolitics intelligence terminal. Monitor the tape. Locate the edge."
			},
			{
				name: "theme-color",
				content: "#08090b"
			}
		],
		links: [
			{
				rel: "icon",
				type: "image/svg+xml",
				href: "/favicon.svg"
			},
			{
				rel: "stylesheet",
				href: styles_default
			},
			{
				rel: "manifest",
				href: "/__grok/manifest.webmanifest"
			},
			{
				rel: "apple-touch-icon",
				href: "/__grok/icon-180.png"
			},
			{
				rel: "preconnect",
				href: "https://fonts.googleapis.com"
			},
			{
				rel: "preconnect",
				href: "https://fonts.gstatic.com",
				crossOrigin: "anonymous"
			},
			{
				rel: "stylesheet",
				href: "https://fonts.googleapis.com/css2?family=IBM+Plex+Mono:wght@400;500;600&family=IBM+Plex+Sans:ital,wght@0,400;0,500;0,600;1,400&display=swap"
			}
		]
	}),
	component: () => /* @__PURE__ */ jsxs("html", {
		lang: "en",
		className: "antialiased",
		suppressHydrationWarning: true,
		children: [/* @__PURE__ */ jsx("head", { children: /* @__PURE__ */ jsx(HeadContent, {}) }), /* @__PURE__ */ jsxs("body", { children: [
			/* @__PURE__ */ jsx(PreviewHostBridge, {}),
			/* @__PURE__ */ jsx(AuthProvider, { children: /* @__PURE__ */ jsx(Outlet, {}) }),
			/* @__PURE__ */ jsx(Scripts, {})
		] })]
	})
});
//#endregion
//#region src/routes/index.tsx
var $$splitComponentImporter$19 = () => import("./routes-DaN4w8v7.js");
var Route$20 = createFileRoute("/")({
	validateSearch: (s) => ({ sel: typeof s.sel === "string" ? s.sel : void 0 }),
	component: lazyRouteComponent($$splitComponentImporter$19, "component")
});
//#endregion
//#region src/routes/bank.tsx
var $$splitComponentImporter$18 = () => import("./bank-B-gGb4SZ.js");
var Route$19 = createFileRoute("/bank")({ component: lazyRouteComponent($$splitComponentImporter$18, "component") });
//#endregion
//#region src/routes/brief.tsx
var $$splitComponentImporter$17 = () => import("./brief-3U6a1Eiy.js");
var Route$18 = createFileRoute("/brief")({ component: lazyRouteComponent($$splitComponentImporter$17, "component") });
//#endregion
//#region src/routes/cot.tsx
var $$splitComponentImporter$16 = () => import("./cot-RzbjDIEC.js");
var Route$17 = createFileRoute("/cot")({ component: lazyRouteComponent($$splitComponentImporter$16, "component") });
//#endregion
//#region src/routes/docs.tsx
var $$splitComponentImporter$15 = () => import("./docs-DA2NsFWi.js");
var Route$16 = createFileRoute("/docs")({ component: lazyRouteComponent($$splitComponentImporter$15, "component") });
//#endregion
//#region src/routes/fx.tsx
var $$splitComponentImporter$14 = () => import("./fx-5WCgpmAY.js");
var Route$15 = createFileRoute("/fx")({ component: lazyRouteComponent($$splitComponentImporter$14, "component") });
//#endregion
//#region src/routes/invest.tsx
var $$splitComponentImporter$13 = () => import("./invest-PmHk0ktg.js");
var Route$14 = createFileRoute("/invest")({ component: lazyRouteComponent($$splitComponentImporter$13, "component") });
//#endregion
//#region src/routes/macro.tsx
var $$splitComponentImporter$12 = () => import("./macro-q22H_0MD.js");
var Route$13 = createFileRoute("/macro")({ component: lazyRouteComponent($$splitComponentImporter$12, "component") });
//#endregion
//#region src/routes/markets.tsx
var $$splitComponentImporter$11 = () => import("./markets-CLGKHKHO.js");
var Route$12 = createFileRoute("/markets")({ component: lazyRouteComponent($$splitComponentImporter$11, "component") });
//#endregion
//#region src/routes/methodology.tsx
var $$splitComponentImporter$10 = () => import("./methodology-qVcUwNze.js");
var Route$11 = createFileRoute("/methodology")({ component: lazyRouteComponent($$splitComponentImporter$10, "component") });
//#endregion
//#region src/routes/micro.tsx
var $$splitComponentImporter$9 = () => import("./micro-ELorXCoI.js");
var Route$10 = createFileRoute("/micro")({ component: lazyRouteComponent($$splitComponentImporter$9, "component") });
//#endregion
//#region src/routes/news.tsx
var $$splitComponentImporter$8 = () => import("./news-Csf-dIpa.js");
var Route$9 = createFileRoute("/news")({ component: lazyRouteComponent($$splitComponentImporter$8, "component") });
//#endregion
//#region src/routes/risk.tsx
var $$splitComponentImporter$7 = () => import("./risk-D3glrDMd.js");
var Route$8 = createFileRoute("/risk")({ component: lazyRouteComponent($$splitComponentImporter$7, "component") });
//#endregion
//#region src/routes/seasonality.tsx
var $$splitComponentImporter$6 = () => import("./seasonality-BAbi7zIw.js");
var Route$7 = createFileRoute("/seasonality")({ component: lazyRouteComponent($$splitComponentImporter$6, "component") });
//#endregion
//#region src/routes/stir.tsx
var $$splitComponentImporter$5 = () => import("./stir-7WCmnaAw.js");
var Route$6 = createFileRoute("/stir")({ component: lazyRouteComponent($$splitComponentImporter$5, "component") });
//#endregion
//#region src/routes/tdi.tsx
var Route$5 = createFileRoute("/tdi")({ beforeLoad: () => {
	throw redirect({ to: "/invest" });
} });
//#endregion
//#region src/routes/trend.tsx
var $$splitComponentImporter$4 = () => import("./trend-CuozsEn8.js");
var Route$4 = createFileRoute("/trend")({ component: lazyRouteComponent($$splitComponentImporter$4, "component") });
//#endregion
//#region src/routes/watch.tsx
var $$splitComponentImporter$3 = () => import("./watch-wMXXGqNc.js");
var Route$3 = createFileRoute("/watch")({ component: lazyRouteComponent($$splitComponentImporter$3, "component") });
//#endregion
//#region src/routes/workbench.tsx
var $$splitComponentImporter$2 = () => import("./workbench-BLAMDsJ-.js");
var Route$2 = createFileRoute("/workbench")({ component: lazyRouteComponent($$splitComponentImporter$2, "component") });
//#endregion
//#region src/routes/theses/index.tsx
var $$splitComponentImporter$1 = () => import("./theses-D4N_njnd.js");
var Route$1 = createFileRoute("/theses/")({ component: lazyRouteComponent($$splitComponentImporter$1, "component") });
//#endregion
//#region src/routes/theses/$id.tsx
var $$splitComponentImporter = () => import("./_id-CyWp-fVV.js");
var Route = createFileRoute("/theses/$id")({ component: lazyRouteComponent($$splitComponentImporter, "component") });
//#endregion
//#region src/routeTree.gen.ts
var IndexRoute = Route$20.update({
	id: "/",
	path: "/",
	getParentRoute: () => Route$21
});
var BankRoute = Route$19.update({
	id: "/bank",
	path: "/bank",
	getParentRoute: () => Route$21
});
var BriefRoute = Route$18.update({
	id: "/brief",
	path: "/brief",
	getParentRoute: () => Route$21
});
var CotRoute = Route$17.update({
	id: "/cot",
	path: "/cot",
	getParentRoute: () => Route$21
});
var DocsRoute = Route$16.update({
	id: "/docs",
	path: "/docs",
	getParentRoute: () => Route$21
});
var FxRoute = Route$15.update({
	id: "/fx",
	path: "/fx",
	getParentRoute: () => Route$21
});
var InvestRoute = Route$14.update({
	id: "/invest",
	path: "/invest",
	getParentRoute: () => Route$21
});
var MacroRoute = Route$13.update({
	id: "/macro",
	path: "/macro",
	getParentRoute: () => Route$21
});
var MarketsRoute = Route$12.update({
	id: "/markets",
	path: "/markets",
	getParentRoute: () => Route$21
});
var MethodologyRoute = Route$11.update({
	id: "/methodology",
	path: "/methodology",
	getParentRoute: () => Route$21
});
var MicroRoute = Route$10.update({
	id: "/micro",
	path: "/micro",
	getParentRoute: () => Route$21
});
var NewsRoute = Route$9.update({
	id: "/news",
	path: "/news",
	getParentRoute: () => Route$21
});
var RiskRoute = Route$8.update({
	id: "/risk",
	path: "/risk",
	getParentRoute: () => Route$21
});
var SeasonalityRoute = Route$7.update({
	id: "/seasonality",
	path: "/seasonality",
	getParentRoute: () => Route$21
});
var StirRoute = Route$6.update({
	id: "/stir",
	path: "/stir",
	getParentRoute: () => Route$21
});
var TdiRoute = Route$5.update({
	id: "/tdi",
	path: "/tdi",
	getParentRoute: () => Route$21
});
var TrendRoute = Route$4.update({
	id: "/trend",
	path: "/trend",
	getParentRoute: () => Route$21
});
var WatchRoute = Route$3.update({
	id: "/watch",
	path: "/watch",
	getParentRoute: () => Route$21
});
var WorkbenchRoute = Route$2.update({
	id: "/workbench",
	path: "/workbench",
	getParentRoute: () => Route$21
});
var ThesesIndexRoute = Route$1.update({
	id: "/theses/",
	path: "/theses/",
	getParentRoute: () => Route$21
});
var rootRouteChildren = {
	IndexRoute,
	BankRoute,
	BriefRoute,
	CotRoute,
	DocsRoute,
	FxRoute,
	InvestRoute,
	MacroRoute,
	MarketsRoute,
	MethodologyRoute,
	MicroRoute,
	NewsRoute,
	RiskRoute,
	SeasonalityRoute,
	StirRoute,
	TdiRoute,
	TrendRoute,
	WatchRoute,
	WorkbenchRoute,
	ThesesIdRoute: Route.update({
		id: "/theses/$id",
		path: "/theses/$id",
		getParentRoute: () => Route$21
	}),
	ThesesIndexRoute
};
var routeTree = Route$21._addFileChildren(rootRouteChildren)._addFileTypes();
//#endregion
//#region src/router.tsx
var router_exports = /* @__PURE__ */ __exportAll({ getRouter: () => getRouter });
var basepath = "/coral-coral-thunder-branch/".replace(/\/$/, "");
function getRouter() {
	return createRouter({
		routeTree,
		basepath,
		defaultErrorComponent: AppErrorComponent
	});
}
//#endregion
export { getRouter, Route as n, Route$20 as r, router_exports as t };
