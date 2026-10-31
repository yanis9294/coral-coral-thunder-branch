import { create } from "zustand";
import { persist } from "zustand/middleware";
import type {
  CountryColor,
  GridLayer,
  MapMode,
  MapSelection,
  RefLayer,
  SidePanel,
  Thesis,
} from "@/data/types";
import type { RiskAsset } from "@/data/risk";
import { DEFAULT_WEIGHTS } from "@/data/risk";
import type { BankArticle } from "@/data/bank-article";

export const GRID_LAYERS: GridLayer[] = [
  "SEIS",
  "AIS",
  "MIL",
  "ZONE",
  "PM",
  "NEWS",
  "TRADE",
  "POP",
  "POWER",
  "LIVE",
  "TICKER",
];

export const DEFAULT_GRID: Record<GridLayer, boolean> = {
  SEIS: true,
  AIS: true,
  MIL: true,
  ZONE: true,
  PM: true,
  NEWS: true,
  TRADE: false,
  POP: false,
  POWER: false,
  LIVE: true,
  TICKER: true,
};

export const DEFAULT_REF: Record<RefLayer, boolean> = {
  conflicts: true,
  bases: false,
  ports: false,
  waterways: true,
  airports: false,
  pipelines: false,
  cables: false,
  nuclear: false,
  gpu: false,
  finance: false,
  irradiators: false,
};

export type WidgetId =
  | "trend-top"
  | "cot-pulse"
  | "pm-movers"
  | "macro-impact"
  | "mini-map"
  | "brief-arcs"
  | "bank-tape"
  | "fx-cross"
  | "alerts"
  | "ticker-board";

interface Weights {
  macro: number;
  pos: number;
  risk: number;
  flow: number;
}

interface TerminalState {
  grid: Record<GridLayer, boolean>;
  ref: Record<RefLayer, boolean>;
  mapMode: MapMode;
  topo: boolean;
  fly: boolean;
  countryColor: CountryColor;
  sidePanel: SidePanel;
  selection: MapSelection | null;
  asOf: number | null;
  lowPower: boolean;
  cmdOpen: boolean;
  weights: Weights;
  workbench: WidgetId[];
  drawer: { view: string; id: string } | null;
  replayThesis: string | null;
  userTheses: Thesis[];
  watchSymbol: string | null;
  watchlist: string[];
  riskWeights: Record<RiskAsset, number>;
  riskAlpha: 0.99 | 0.95;
  riskCapital: number;
  riskBudget: number;
  moreOpen: boolean;
  bankArticles: BankArticle[];
  bankFeedAt: number | null;
  bankFeedLive: boolean;
  toggleGrid: (k: GridLayer) => void;
  toggleRef: (k: RefLayer) => void;
  setMapMode: (m: MapMode) => void;
  setTopo: (v: boolean) => void;
  setFly: (v: boolean) => void;
  setCountryColor: (v: CountryColor) => void;
  setSidePanel: (v: SidePanel) => void;
  setSelection: (s: MapSelection | null) => void;
  setAsOf: (v: number | null) => void;
  setLowPower: (v: boolean) => void;
  setCmdOpen: (v: boolean) => void;
  setWeights: (w: Partial<Weights>) => void;
  setWorkbench: (w: WidgetId[]) => void;
  setDrawer: (d: { view: string; id: string } | null) => void;
  setReplayThesis: (id: string | null) => void;
  addThesis: (t: Thesis) => void;
  removeThesis: (id: string) => void;
  setWatchSymbol: (s: string | null) => void;
  addWatch: (s: string) => void;
  removeWatch: (s: string) => void;
  setRiskWeights: (w: Partial<Record<RiskAsset, number>>) => void;
  setRiskAlpha: (a: 0.99 | 0.95) => void;
  setRiskCapital: (n: number) => void;
  setRiskBudget: (n: number) => void;
  setMoreOpen: (v: boolean) => void;
  setBankFeed: (arts: BankArticle[], live: boolean, at: number) => void;
}

export const useTerminal = create<TerminalState>()(
  persist(
    (set, get) => ({
      grid: { ...DEFAULT_GRID },
      ref: { ...DEFAULT_REF },
      mapMode: "globe",
      topo: false,
      fly: true,
      countryColor: "econ",
      sidePanel: "feed",
      selection: null,
      asOf: null,
      lowPower: false,
      cmdOpen: false,
      weights: { macro: 30, pos: 25, risk: 20, flow: 25 },
      workbench: ["trend-top", "pm-movers", "cot-pulse", "alerts"],
      drawer: null,
      replayThesis: null,
      userTheses: [],
      watchSymbol: null,
      watchlist: [],
      riskWeights: { ...DEFAULT_WEIGHTS },
      riskAlpha: 0.99,
      riskCapital: 10_000_000,
      riskBudget: 0.01,
      moreOpen: false,
      bankArticles: [],
      bankFeedAt: null,
      bankFeedLive: false,
      toggleGrid: (k) => set({ grid: { ...get().grid, [k]: !get().grid[k] } }),
      toggleRef: (k) => set({ ref: { ...get().ref, [k]: !get().ref[k] } }),
      setMapMode: (mapMode) => set({ mapMode }),
      setTopo: (topo) => set({ topo }),
      setFly: (fly) => set({ fly }),
      setCountryColor: (countryColor) => set({ countryColor }),
      setSidePanel: (sidePanel) =>
        set({ sidePanel: get().sidePanel === sidePanel ? null : sidePanel }),
      setSelection: (selection) => set({ selection }),
      setAsOf: (asOf) => set({ asOf }),
      setLowPower: (lowPower) => set({ lowPower }),
      setCmdOpen: (cmdOpen) => set({ cmdOpen }),
      setWeights: (w) => set({ weights: { ...get().weights, ...w } }),
      setWorkbench: (workbench) => set({ workbench }),
      setDrawer: (drawer) => set({ drawer }),
      setReplayThesis: (replayThesis) => set({ replayThesis }),
      addThesis: (t) => set({ userTheses: [t, ...get().userTheses] }),
      removeThesis: (id) => set({ userTheses: get().userTheses.filter((x) => x.id !== id) }),
      setWatchSymbol: (watchSymbol) => set({ watchSymbol }),
      addWatch: (s) => {
        const list = get().watchlist.includes(s) ? get().watchlist : [...get().watchlist, s];
        set({ watchlist: list, watchSymbol: s });
      },
      removeWatch: (s) => {
        const watchlist = get().watchlist.filter((x) => x !== s);
        set({
          watchlist,
          watchSymbol: get().watchSymbol === s ? (watchlist[0] ?? null) : get().watchSymbol,
        });
      },
      setRiskWeights: (w) => set({ riskWeights: { ...get().riskWeights, ...w } }),
      setRiskAlpha: (riskAlpha) => set({ riskAlpha }),
      setRiskCapital: (riskCapital) => set({ riskCapital }),
      setRiskBudget: (riskBudget) => set({ riskBudget }),
      setMoreOpen: (moreOpen) => set({ moreOpen }),
      setBankFeed: (bankArticles, bankFeedLive, bankFeedAt) => set({ bankArticles, bankFeedLive, bankFeedAt }),
    }),
    {
      name: "argos-terminal",
      skipHydration: true,
      version: 1,
      migrate: (persisted) => {
        const p = persisted as { workbench?: string[] };
        if (Array.isArray(p.workbench)) {
          p.workbench = p.workbench.map((id) => (id === "tdi-div" ? "bank-tape" : id));
        }
        return p as typeof persisted;
      },
      partialize: (s) => ({
        grid: s.grid,
        ref: s.ref,
        mapMode: s.mapMode,
        topo: s.topo,
        fly: s.fly,
        countryColor: s.countryColor,
        lowPower: s.lowPower,
        weights: s.weights,
        workbench: s.workbench,
        userTheses: s.userTheses,
        watchSymbol: s.watchSymbol,
        watchlist: s.watchlist,
        riskWeights: s.riskWeights,
        riskAlpha: s.riskAlpha,
        riskCapital: s.riskCapital,
        riskBudget: s.riskBudget,
      }),
    },
  ),
);

export function useAsOf() {
  return useTerminal((s) => s.asOf);
}
