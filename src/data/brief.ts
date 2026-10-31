import type { BriefArc, BriefEvent } from "./types";

export const BRIEF_DATE = "19 Sep 2026";
export const BRIEF_TITLE = "Straits & spreads";
export const BRIEF_KICKER =
  "Hormuz risk premia hold the tape. The desk keeps the Iran arc as the day's organizing principle; rates are the residual, not the lead.";

export const BRIEF_ARCS: BriefArc[] = [
  { id: "iran", name: "Iran · Hormuz", kicker: "War-risk bid, sticky barrels", severity: "CRITICAL" },
  { id: "ua", name: "Russia · Ukraine", kicker: "Grid, not front, is the print", severity: "HIGH" },
  { id: "macro", name: "Macro · Rates", kicker: "Supply tails, not a pivot", severity: "MEDIUM" },
  { id: "china", name: "China · Tech", kicker: "Licenses and the median line", severity: "HIGH" },
];

export const BRIEF_EVENTS: BriefEvent[] = [
  {
    id: "e1",
    arc: "Iran · Hormuz",
    title: "IRGC announces TSS drills; Lloyd's surcharge up",
    body: "A notice to mariners plus an insurer print is how Hormuz usually telegraphs. AIS in the TSS is slower than the 30-day median. The desk does not need a kinetic event to keep the oil basis bid — the option is already being paid for. Watch Fujairah draws and dirty TC rates, not the next speech.",
    severity: "CRITICAL",
    metric: { label: "WTI Hormuz premia", value: "+$6.8", dir: "up" },
    pmId: "pm-hormuz",
    links: [
      { label: "Monitor · ZONE", href: "/?sel=zone:zone-hormuz" },
      { label: "Trend · WTI", href: "/trend?id=WTI" },
      { label: "Thesis · Hormuz call", href: "/theses/th-hormuz" },
    ],
  },
  {
    id: "e2",
    arc: "Iran · Hormuz",
    title: "Two product tankers alter course north of Bab el-Mandeb",
    body: "Pattern-match to last month's harassment cluster. Cape re-route share on boxships still north of 40%. This is a second-order Hormuz: same network, different gate. Insurance is the leading indicator; AIS is the confirmation.",
    severity: "HIGH",
    metric: { label: "Cape share (boxes)", value: "41%", dir: "up" },
    pmId: "pm-suez",
    links: [
      { label: "Monitor · Mandeb", href: "/?sel=zone:zone-mandeb" },
      { label: "Markets · Suez", href: "/markets?id=pm-suez" },
    ],
  },
  {
    id: "e3",
    arc: "Iran · Hormuz",
    title: "East-of-Suez product tightness, not a demand shock",
    body: "Fujairah stocks −1.4mb. Cracks are doing the talking. If this were demand, gasoline would not be the leader. Keep the oil long in the book; fade the 'global recovery' narrative that will try to attach to the print.",
    severity: "MEDIUM",
    metric: { label: "Fujairah draw", value: "−1.4mb", dir: "down" },
    links: [{ label: "Trend · BRENT", href: "/trend?id=BRENT" }],
  },
  {
    id: "e4",
    arc: "Russia · Ukraine",
    title: "Kharkiv energy nodes hit overnight",
    body: "Ukrenergo reporting frequency instability. This is the winter playbook, not a new front. TTF contained — Europe's storage and LNG cover still the shock absorber. The market-relevant residual is grain-corridor insurance, not European power.",
    severity: "HIGH",
    metric: { label: "TTF", value: "€34.2", dir: "flat" },
    links: [
      { label: "Monitor · Donbas", href: "/?sel=zone:zone-donbas" },
      { label: "COT", href: "/cot" },
    ],
  },
  {
    id: "e5",
    arc: "Russia · Ukraine",
    title: "OFZ issuance stepped up; war-economy fiscal",
    body: "MinFin raising the quarterly program. Rub is still a function of export receipts and the China oil channel, not OFZ supply. No action. A reminder that the fiscal cost is compounding even when the front is static.",
    severity: "LOW",
    metric: { label: "USDRUB", value: "94.20", dir: "up" },
    links: [{ label: "FX · EM", href: "/fx" }],
  },
  {
    id: "e6",
    arc: "Macro · Rates",
    title: "20Y tails poorly; dealers lean short duration",
    body: "This is a supply story, not a Hormuz story, and the desk should keep them in separate drawers. 10s30s is the tell. Fed-cut PM is offered today — the market is not pricing a panic put, it is pricing an issuance problem. That can coexist with a risk-off oil bid.",
    severity: "MEDIUM",
    metric: { label: "US10Y", value: "4.12%", dir: "up" },
    pmId: "pm-fed",
    links: [
      { label: "Macro", href: "/macro" },
      { label: "Trend · US10Y", href: "/trend?id=US10Y" },
      { label: "Markets · Fed", href: "/markets?id=pm-fed" },
    ],
  },
  {
    id: "e7",
    arc: "Macro · Rates",
    title: "Gilt cheapening into the London close",
    body: "Local more than global. Watch if it infects OATs. Sterling is still a risk barometer; it is not the story. No change to the G10 FX board.",
    severity: "LOW",
    metric: { label: "GBPUSD", value: "1.312", dir: "down" },
    links: [{ label: "FX", href: "/fx" }],
  },
  {
    id: "e8",
    arc: "China · Tech",
    title: "PLA 39 aircraft across the median line",
    body: "Largest day this month. TSMC ADR implied vol +1.2pt. This is a cadence story: the desk treats weekly ADIZ prints as a ZONE, not a headline. The unpriced tail remains a blockade, not a flyby. PM on a 2026 blockade is still in the high-single digits — that is the mispricing, if any.",
    severity: "HIGH",
    metric: { label: "PM blockade", value: "8%", dir: "down" },
    pmId: "pm-tw",
    links: [
      { label: "Monitor · Strait", href: "/?sel=zone:zone-taiwan" },
      { label: "Theses · TSMC tail", href: "/theses/th-tsmc" },
      { label: "Markets", href: "/markets?id=pm-tw" },
    ],
  },
  {
    id: "e9",
    arc: "China · Tech",
    title: "Rare-earth license window delayed again",
    body: "NdPr chatter, magnet-chain names, not the index. Industrial policy as a geopolitical lever — this is how Beijing prefers to squeeze, not with a blockade. Keep it in Commodities, not in Equities beta.",
    severity: "HIGH",
    metric: { label: "NdPr", value: "+4.1%", dir: "up" },
    links: [{ label: "Trend · COPPER", href: "/trend?id=HG" }],
  },
  {
    id: "e10",
    arc: "China · Tech",
    title: "HBM allocations sold through 1H27",
    body: "SK Hynix print. The AI capex overlay is intact and still crowded. It is not today's geopolitics, but it is why GPU datacenters stay on the Strategic layer. Power, not silicon, is the 2027 constraint.",
    severity: "INFO",
    metric: { label: "NDX", value: "+0.4%", dir: "up" },
    pmId: "pm-ai",
    links: [
      { label: "Monitor · GPU", href: "/" },
      { label: "Bank", href: "/bank" },
    ],
  },
];

export const BRIEF_CLOCK: { utc: string; label: string; where: string }[] = [
  { utc: "06:00", label: "China MOC", where: "Beijing" },
  { utc: "08:30", label: "UK GfK", where: "London" },
  { utc: "12:00", label: "ECB speakers", where: "Frankfurt" },
  { utc: "12:30", label: "US housing", where: "Washington" },
  { utc: "14:00", label: "Baker Hughes", where: "Houston" },
  { utc: "16:00", label: "API crude", where: "US" },
  { utc: "21:00", label: "RBA minutes", where: "Sydney" },
];
