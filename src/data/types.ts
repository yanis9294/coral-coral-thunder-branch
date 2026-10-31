export type Severity = "CRITICAL" | "HIGH" | "MEDIUM" | "LOW" | "INFO";

export type Domain =
  | "Geopolitics"
  | "Macro"
  | "Commodities"
  | "FX"
  | "Equities"
  | "Rates"
  | "Crypto"
  | "Energy";

export type ThesisStatus = "Open" | "Closed";
export type ThesisType = "Market" | "Trade";
export type ThesisState = "WINNING" | "LOSING" | "FLAT" | "HIT" | "STOPPED";

export type FactorCat = "MACRO" | "POS" | "RISK" | "FLOW";
export type Regime = "RISK-ON" | "BALANCED" | "RISK-OFF";
export type Verdict = "EXTREME" | "STRONG" | "MODERATE" | "MILD" | "NEUTRAL";

export type SidePanel = "feed" | "bank" | "desk" | "pm" | null;
export type MapMode = "globe" | "flat";
export type CountryColor = "econ" | "news";

export type GridLayer =
  | "SEIS"
  | "AIS"
  | "MIL"
  | "ZONE"
  | "PM"
  | "NEWS"
  | "TRADE"
  | "POP"
  | "POWER"
  | "LIVE"
  | "TICKER";

export type RefSection = "Military" | "Infra" | "Strategic";
export type RefLayer =
  | "conflicts"
  | "bases"
  | "ports"
  | "waterways"
  | "airports"
  | "pipelines"
  | "cables"
  | "nuclear"
  | "gpu"
  | "finance"
  | "irradiators";

export type MapObjectKind =
  | "country"
  | "seis"
  | "ais"
  | "mil"
  | "zone"
  | "pm"
  | "news"
  | "live"
  | "ref"
  | "trade";

export interface MapSelection {
  kind: MapObjectKind;
  id: string;
}

export interface LatLng {
  lat: number;
  lng: number;
}

export interface CountryIntel {
  id: string;
  iso2: string;
  iso3: string;
  name: string;
  capital: string;
  lat: number;
  lng: number;
  region: string;
  populationM: number;
  power: number;
  econ: number;
  news: number;
  brief: string;
  gdp: string;
  fx: string;
  yields: string;
}

export interface Quake extends LatLng {
  id: string;
  mag: number;
  depthKm: number;
  place: string;
  ts: number;
  severity: Severity;
}

export interface Ship extends LatLng {
  id: string;
  name: string;
  flag: string;
  type: string;
  heading: number;
  speedKn: number;
  dest: string;
  draught: number;
  lane: string;
}

export interface Flight extends LatLng {
  id: string;
  callsign: string;
  operator: string;
  type: string;
  heading: number;
  altFt: number;
  speedKt: number;
  from: string;
  to: string;
}

export interface Zone extends LatLng {
  id: string;
  name: string;
  arc: string;
  severity: Severity;
  risk: number;
  radiusKm: number;
  note: string;
  updated: number;
}

export interface GeoNews extends LatLng {
  id: string;
  title: string;
  source: string;
  ts: number;
  severity: Severity;
  domain: Domain;
  summary: string;
}

export interface PmGeo extends LatLng {
  id: string;
  title: string;
  prob: number;
  delta24: number;
  volume: number;
  category: string;
}

export interface LiveStudio extends LatLng {
  id: string;
  name: string;
  city: string;
  onAir: boolean;
  headline: string;
}

export interface TradeFlow {
  id: string;
  from: LatLng & { name: string };
  to: LatLng & { name: string };
  commodity: string;
  usdBn: number;
}

export interface RefPoint extends LatLng {
  id: string;
  layer: RefLayer;
  name: string;
  note: string;
  severity?: Severity;
}

export interface TickerRow {
  pair: string;
  px: number;
  chg: number;
  spread: number;
  name: string;
}

export interface Thesis {
  id: string;
  title: string;
  domain: Domain;
  type: ThesisType;
  status: ThesisStatus;
  state: ThesisState;
  instrument: string;
  entry: number;
  target: number;
  last: number;
  unit: "px" | "prob";
  opened: string;
  closed?: string;
  horizon: string;
  edgeCaptured: number;
  memo: string;
  changeMind: string[];
  supports: string[];
  cuts: string[];
  log: { date: string; text: string }[];
  analyst: string;
  links: { label: string; href: string }[];
  user?: boolean;
}

export interface BriefEvent {
  id: string;
  arc: string;
  title: string;
  body: string;
  severity: Severity;
  metric: { label: string; value: string; dir?: "up" | "down" | "flat" };
  pmId?: string;
  links: { label: string; href: string }[];
}

export interface BriefArc {
  id: string;
  name: string;
  kicker: string;
  severity: Severity;
}

export interface TrendRow {
  symbol: string;
  name: string;
  assetClass: string;
  last: number;
  chg: number;
  overall: number;
  macro: number;
  pos: number;
  risk: number;
  flow: number;
  verdict: Verdict;
  crowding: number;
  regimeP: number;
  drivers: string[];
}

export interface CotRow {
  contract: string;
  cls: string;
  netLong: number;
  percentile: number;
  extreme: string;
  velocity: number;
  flow: number;
  reversal: number;
  streak: number;
  dLong: number;
  dShort: number;
}

export interface MacroRelease {
  id: string;
  ts: number;
  country: string;
  ccy: string;
  name: string;
  tier: "T3" | "T2" | "T1";
  domain: "Labor" | "Inflation" | "Growth" | "Policy" | "External";
  unit: string;
  consensus: number;
  previous: number;
  actual?: number;
  surpriseZ?: number;
  high: number;
  low: number;
  pBeat: number;
  pMiss: number;
  pInline: number;
  pAboveHigh: number;
  pBelowLow: number;
  histBeatMove: number;
  histMissMove: number;
  histN: number;
  related: string[];
  weight: number;
}

export interface CountryScorecard {
  ccy: string;
  country: string;
  beatZ: number;
  missZ: number;
  beatPct: number;
  momentum: number;
  streak: number;
  regime: "RE-ACCEL" | "COOLING" | "BOTTOMING" | "WORSENING";
}

export interface PmMarket {
  id: string;
  title: string;
  category: string;
  prob: number;
  delta1h: number;
  delta4h: number;
  delta24h: number;
  delta7d: number;
  volume: number;
  oi: number;
  spark: number[];
  issues: { name: string; prob: number }[];
  volRatio: number;
  realizedVol: number;
  whaleNet: number;
}

export interface TdiRow {
  id: string;
  name: string;
  kind: string;
  score: number;
  note: string;
  severity: Severity;
}

export interface AlertItem {
  id: string;
  ts: number;
  severity: Severity;
  title: string;
  body: string;
  href?: string;
}

export interface NavItem {
  id: string;
  path: string;
  label: string;
  fkey: string;
  group: "monitor" | "intel";
}
