import type { NavItem } from "./types";

export const NAV: NavItem[] = [
  { id: "monitor", path: "/", label: "Monitor", fkey: "F1", group: "monitor" },
  { id: "brief", path: "/brief", label: "Brief", fkey: "F2", group: "intel" },
  { id: "theses", path: "/theses", label: "Theses", fkey: "F3", group: "intel" },
  { id: "trend", path: "/trend", label: "Trend", fkey: "F4", group: "intel" },
  { id: "cot", path: "/cot", label: "COT", fkey: "F5", group: "intel" },
  { id: "macro", path: "/macro", label: "Macro", fkey: "F6", group: "intel" },
  { id: "markets", path: "/markets", label: "Markets", fkey: "F7", group: "intel" },
  { id: "micro", path: "/micro", label: "Micro", fkey: "F8", group: "intel" },
  { id: "fx", path: "/fx", label: "FX", fkey: "F9", group: "intel" },
  { id: "news", path: "/news", label: "News", fkey: "F10", group: "intel" },
  { id: "invest", path: "/invest", label: "Invest", fkey: "F11", group: "intel" },
  { id: "bank", path: "/bank", label: "Bank", fkey: "F12", group: "intel" },
];

export const MORE_NAV: NavItem[] = [
  { id: "stir", path: "/stir", label: "STIR", fkey: "S", group: "intel" },
  { id: "risk", path: "/risk", label: "Risk", fkey: "R", group: "intel" },
  { id: "watch", path: "/watch", label: "Watch", fkey: "A", group: "intel" },
  { id: "seasonality", path: "/seasonality", label: "Seasonality", fkey: "Y", group: "intel" },
  { id: "docs", path: "/docs", label: "Docs", fkey: "D", group: "intel" },
  { id: "workbench", path: "/workbench", label: "Workbench", fkey: "W", group: "intel" },
  { id: "methodology", path: "/methodology", label: "Methodology", fkey: "H", group: "intel" },
];
