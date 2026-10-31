import type { Thesis } from "./types";

export const THESES: Thesis[] = [
  {
    id: "th-hormuz",
    title: "Oil holds a Hormuz premium — stay long WTI into year-end",
    domain: "Energy",
    type: "Trade",
    status: "Open",
    state: "WINNING",
    instrument: "WTI",
    entry: 74.2,
    target: 92,
    last: 81.4,
    unit: "px",
    opened: "12 Jun 2026",
    horizon: "Dec 2026",
    edgeCaptured: 0.41,
    analyst: "N. Rahmani",
    memo: "The market still treats Hormuz as a 48-hour headline. The desk treats it as a regime. Spare capacity is thinner than the 2010s, IRGC has a demonstrated harassment toolkit, and insurers now price the option continuously. We are long WTI on the basis, not on a war bet. A kinetic event is upside, not the thesis. Invalidation is a durable US-Iran de-escalation that collapses war-risk, or a US SPR dump that caps the front.",
    changeMind: [
      "Sustained IRGC stand-down + war-risk premia back to 2023 medians for 15 sessions",
      "OPEC+ adding ≥1.5mbpd with Saudi confirmation of spare",
      "US SPR release >30mb announced",
    ],
    supports: [
      "Lloyd's surcharge print today",
      "Fujairah product draw",
      "AIS slowdown in TSS vs 30d median",
      "PM Hormuz-closed still only 12% — cheap tail vs our view",
    ],
    cuts: [
      "IEA still flags 'adequate' stocks in OECD",
      "US production at record — caps the blow-off",
      "No confirmed boarding in 9 days",
    ],
    log: [
      { date: "19 Sep", text: "Surcharge + drills. Hold. Raise stop to 76.8." },
      { date: "11 Sep", text: "Mandeb harassment cluster. Adds to network thesis, not size." },
      { date: "02 Sep", text: "Fade the first $78 print; reloaded 77.4." },
      { date: "12 Jun", text: "Opened 74.20. Thesis note v1." },
    ],
    links: [
      { label: "Trend · WTI", href: "/trend?id=WTI" },
      { label: "Markets · Hormuz", href: "/markets?id=pm-hormuz" },
      { label: "Monitor", href: "/?sel=zone:zone-hormuz" },
    ],
  },
  {
    id: "th-tsmc",
    title: "Buy the Taiwan blockade tail on Polymarket — still too cheap",
    domain: "Geopolitics",
    type: "Market",
    status: "Open",
    state: "FLAT",
    instrument: "pm-tw",
    entry: 0.09,
    target: 0.18,
    last: 0.08,
    unit: "prob",
    opened: "03 Mar 2026",
    horizon: "Dec 2026",
    edgeCaptured: -0.11,
    analyst: "L. Chen",
    memo: "A 2026 blockade remains a low-probability, high-severity event. The market at 8–9% is pricing a round number, not a process. PLA cadence, legal warfare, and customs-inspection 'gray blockade' are the path, not amphibious assault. We own the contract as cheap catastrophe insurance that also pays if the narrative gap closes. This is not a prediction that it happens; it is a statement that 8% is the wrong digit.",
    changeMind: [
      "US-China military-to-military channels restored with a durable ADIZ de-escalation",
      "TSMC geographic diversification materially reduces single-point-of-failure (AZ/JPN capacity >25% of leading edge)",
      "Contract implied vol collapsing with 90d realized",
    ],
    supports: [
      "Median-line transits at 2026 highs",
      "Export-control ratchet still in force",
      "No TSMC leading-edge diversification that changes the math this year",
    ],
    cuts: [
      "Xi succession PM very high — stability preference",
      "US election now behind us; less 'madman' premium",
      "Mark-to-market is slightly negative",
    ],
    log: [
      { date: "19 Sep", text: "39 aircraft. Hold. Do not chase the 1pt vol pop in TSM." },
      { date: "14 Aug", text: "Trimmed 1/5 on 11¢ spike. Core remains." },
      { date: "03 Mar", text: "Opened 9¢. Size: 2% NAV." },
    ],
    links: [
      { label: "Markets", href: "/markets?id=pm-tw" },
      { label: "Monitor · Strait", href: "/?sel=zone:zone-taiwan" },
    ],
  },
  {
    id: "th-gold",
    title: "Gold as the cross-asset hedge — $2,800 still in play",
    domain: "Commodities",
    type: "Trade",
    status: "Open",
    state: "WINNING",
    instrument: "XAU",
    entry: 2410,
    target: 2800,
    last: 2642,
    unit: "px",
    opened: "18 Nov 2025",
    horizon: "Mar 2027",
    edgeCaptured: 0.59,
    analyst: "M. Okonkwo",
    memo: "Official-sector buying + structural fiscal + geopolitics. We are not gold bugs; we are short the idea that real rates dominate this cycle. ETF creates overnight confirm the Western bid is back, not just the Shanghai one. Trim on $2,700; do not exit.",
    changeMind: [
      "Real rates sustainably >2.5% with a strong DXY",
      "Official-sector (EM + official) buying going to zero for two quarters",
      "A true end-of-cycle disinflation that collapses all premia",
    ],
    supports: ["GLD create 4.2t overnight", "DXY fade vs oil bid", "EM official accounts still in"],
    cuts: ["Positioning on COMEX not extreme yet — room, but also not a squeeze", "Real rates not collapsing"],
    log: [
      { date: "19 Sep", text: "ETF create. Hold. Trailing stop 2520." },
      { date: "18 Nov 2025", text: "Opened." },
    ],
    links: [
      { label: "Trend · XAU", href: "/trend?id=XAU" },
      { label: "COT · Gold", href: "/cot?id=GC" },
    ],
  },
  {
    id: "th-mxn",
    title: "Fade crowded MXN carry — COT extreme",
    domain: "FX",
    type: "Trade",
    status: "Open",
    state: "LOSING",
    instrument: "USDMXN",
    entry: 18.72,
    target: 20.4,
    last: 19.4,
    unit: "px",
    opened: "22 Apr 2026",
    horizon: "Oct 2026",
    edgeCaptured: 0.4,
    analyst: "S. Alvarez",
    memo: "The peso is a carry darling with COT in the left tail of the last decade. USMCA politics and a late-cycle US labor market are the fundamental pair. We are long USDMXN as a crowding-risk trade, sized as such. Pain is the last 200 pips of carry; the payoff is a disorderly unwind. Do not add.",
    changeMind: [
      "CFTC non-commercials back inside the 40–60 percentile for 4 prints",
      "Banxico hiking cycle re-opens in a way that re-widens real carry",
    ],
    supports: ["COT crowding still extreme", "US labor softening in the scorecard"],
    cuts: ["Carry still paying", "Remittances resilient", "Mark-to-market mixed after the bounce"],
    log: [
      { date: "19 Sep", text: "Still crowded. Hold, no add." },
      { date: "22 Apr", text: "Opened 18.72." },
    ],
    links: [
      { label: "COT · MXN", href: "/cot?id=MXN" },
      { label: "FX", href: "/fx" },
    ],
  },
  {
    id: "th-fed",
    title: "Fade year-end 50bp cut — issuance, not a put",
    domain: "Macro",
    type: "Market",
    status: "Open",
    state: "WINNING",
    instrument: "pm-fed",
    entry: 0.58,
    target: 0.25,
    last: 0.41,
    unit: "prob",
    opened: "09 Jul 2026",
    horizon: "Dec 2026",
    edgeCaptured: 0.52,
    analyst: "J. Hart",
    memo: "The 50bp-by-year-end contract was a narrative leftover. Housing and labor are cooling, not collapsing. Today's 20Y tail is a reminder that the Treasury is the supply story. We are short the contract (sold 58¢, cover below 30¢). Do not confuse a Hormuz risk-off day with a Fed put.",
    changeMind: [
      "Payrolls <50k for two prints with unemployment +0.4 in a quarter",
      "Credit event that closes issuance markets",
      "Core PCE ≤2.1% three months running",
    ],
    supports: ["20Y tail", "Labor scorecard still 'cooling' not 'breaking'", "PM bid-offer offered today"],
    cuts: ["Housing is the residual risk", "Oil spike could do the Fed's job in reverse if it hits core"],
    log: [
      { date: "19 Sep", text: "PM −3pp. Hold the short." },
      { date: "09 Jul", text: "Sold 58¢." },
    ],
    links: [
      { label: "Macro", href: "/macro" },
      { label: "Markets", href: "/markets?id=pm-fed" },
    ],
  },
  {
    id: "th-yen",
    title: "USDJPY offered into 150 — MoF is a floor, not a thesis",
    domain: "FX",
    type: "Trade",
    status: "Open",
    state: "FLAT",
    instrument: "USDJPY",
    entry: 151.2,
    target: 142,
    last: 149.8,
    unit: "px",
    opened: "28 Jul 2026",
    horizon: "Jan 2027",
    edgeCaptured: 0.15,
    analyst: "K. Saito",
    memo: "Intervention is a tactic. The thesis is BoJ real-rate normalization plus a less one-way carry. We are modestly short USDJPY with a wide stop. Verbal bids today are not a reason to add. Size stays small because carry bleeds.",
    changeMind: ["BoJ returning to YCC-like language", "US exceptionalism re-acceleration that re-opens the rate gap"],
    supports: ["Verbal bids flagged", "JGB 10Y holding above 1%"],
    cuts: ["Carry still the world's favorite", "MoF can pin spot without changing the trend"],
    log: [
      { date: "19 Sep", text: "Verbal, not actual. Hold." },
      { date: "28 Jul", text: "Opened 151.20." },
    ],
    links: [
      { label: "FX", href: "/fx" },
      { label: "Trend · USDJPY", href: "/trend?id=USDJPY" },
    ],
  },
  {
    id: "th-ua-close",
    title: "Ukraine ceasefire 1H26 — closed, stopped",
    domain: "Geopolitics",
    type: "Market",
    status: "Closed",
    state: "STOPPED",
    instrument: "pm-ua",
    entry: 0.34,
    target: 0.55,
    last: 0.19,
    unit: "prob",
    opened: "12 Jan 2026",
    closed: "18 Jun 2026",
    horizon: "Jun 2026",
    edgeCaptured: -1,
    analyst: "N. Rahmani",
    memo: "Wrong on timing. The attritional equilibrium was more stable than the winter commentary implied. Stopped at 19¢ per the rule. Lesson: do not fade a war on a calendar. The 2027 contract is a different animal and is not auto-reopened.",
    changeMind: ["n/a — closed"],
    supports: ["Was: energy-grid stress, aid politics"],
    cuts: ["Front static, US politics less decisive than assumed", "Process, not a date"],
    log: [
      { date: "18 Jun", text: "Stopped 19¢. Post-mortem filed." },
      { date: "12 Jan", text: "Opened 34¢." },
    ],
    links: [{ label: "Methodology", href: "/methodology" }],
  },
  {
    id: "th-hy",
    title: "Long HYG into Q1 disinflation — closed, hit",
    domain: "Rates",
    type: "Trade",
    status: "Closed",
    state: "HIT",
    instrument: "HYG",
    entry: 76.4,
    target: 80.5,
    last: 80.5,
    unit: "px",
    opened: "03 Oct 2025",
    closed: "22 Feb 2026",
    horizon: "Mar 2026",
    edgeCaptured: 1,
    analyst: "J. Hart",
    memo: "Worked. Spreads compressed as the landing printed. Exited at target. Would not re-enter here: carry is no longer the edge, it is the crowding.",
    changeMind: ["n/a — closed"],
    supports: ["Landing path", "Default cycle delayed"],
    cuts: ["Was already crowded by January"],
    log: [
      { date: "22 Feb", text: "Hit 80.50. Closed." },
      { date: "03 Oct 2025", text: "Opened." },
    ],
    links: [{ label: "Trend", href: "/trend" }],
  },
  {
    id: "th-gas",
    title: "TTF winter squeeze 25/26 — closed, missed",
    domain: "Energy",
    type: "Trade",
    status: "Closed",
    state: "STOPPED",
    instrument: "TTF",
    entry: 41,
    target: 62,
    last: 32.5,
    unit: "px",
    opened: "08 Sep 2025",
    closed: "11 Jan 2026",
    horizon: "Feb 2026",
    edgeCaptured: -1,
    analyst: "M. Okonkwo",
    memo: "Weather and LNG cover were the story. We were long a squeeze that the storage math never quite allowed. Stopped. The 26/27 winter is a new look, not a re-run.",
    changeMind: ["n/a — closed"],
    supports: ["Was: storage optics in October"],
    cuts: ["Norwegian flows, US LNG, warm Dec"],
    log: [
      { date: "11 Jan 2026", text: "Stopped 32.5." },
      { date: "08 Sep 2025", text: "Opened." },
    ],
    links: [{ label: "Bank", href: "/bank" }],
  },
  {
    id: "th-btc",
    title: "BTC as liquidity residual, not a macro hedge — closed, hit",
    domain: "Crypto",
    type: "Trade",
    status: "Closed",
    state: "HIT",
    instrument: "BTC",
    entry: 49200,
    target: 62000,
    last: 62840,
    unit: "px",
    opened: "04 Apr 2025",
    closed: "19 Jan 2026",
    horizon: "Jan 2026",
    edgeCaptured: 1.05,
    analyst: "L. Chen",
    memo: "Treated BTC as a liquidity sponge, not as digital gold. Worked into the ETF residual. Closed at target+. Not a standing long — the crowding in 2026 is different.",
    changeMind: ["n/a — closed"],
    supports: ["ETF flow", "USD liquidity"],
    cuts: ["Correlation to NDX too high to be a hedge"],
    log: [
      { date: "19 Jan 2026", text: "Closed above target." },
      { date: "04 Apr 2025", text: "Opened." },
    ],
    links: [{ label: "Trend · BTC", href: "/trend?id=BTC" }],
  },
];

export function thesisById(id: string, extra: Thesis[] = []) {
  return extra.concat(THESES).find((t) => t.id === id);
}

export function openTheses(extra: Thesis[] = []) {
  return extra.concat(THESES).filter((t) => t.status === "Open");
}

export function closedTheses(extra: Thesis[] = []) {
  return extra.concat(THESES).filter((t) => t.status === "Closed");
}

export function trackRecord(extra: Thesis[] = []) {
  const closed = closedTheses(extra);
  const hits = closed.filter((t) => t.state === "HIT").length;
  const stopped = closed.filter((t) => t.state === "STOPPED").length;
  const avg = closed.reduce((a, t) => a + t.edgeCaptured, 0) / Math.max(1, closed.length);
  return { n: closed.length, hits, stopped, hitRate: hits / Math.max(1, closed.length), avgEdge: avg };
}

export function newUserThesis(p: {
  title: string;
  instrument: string;
  domain?: Thesis["domain"];
  type?: Thesis["type"];
  entry?: number;
  target?: number;
  last?: number;
  unit?: Thesis["unit"];
  horizon?: string;
  memo?: string;
  changeMind?: string[];
  supports?: string[];
  cuts?: string[];
  analyst?: string;
  links?: { label: string; href: string }[];
}): Thesis {
  const today = new Date().toISOString().slice(0, 10);
  const entry = p.entry ?? 0;
  return {
    id: `th-user-${Date.now().toString(36)}`,
    title: p.title.trim(),
    domain: p.domain ?? "Macro",
    type: p.type ?? "Trade",
    status: "Open",
    state: "FLAT",
    instrument: p.instrument.trim().toUpperCase(),
    entry,
    target: p.target ?? entry,
    last: p.last ?? entry,
    unit: p.unit ?? "px",
    opened: today,
    horizon: p.horizon?.trim() || "3m",
    edgeCaptured: 0,
    memo: p.memo?.trim() || "User thesis. No desk memo yet.",
    changeMind: p.changeMind?.length ? p.changeMind : ["Fill invalidation."],
    supports: p.supports?.length ? p.supports : ["User entry."],
    cuts: p.cuts?.length ? p.cuts : ["No contrary evidence logged."],
    log: [{ date: today, text: "Opened (manual)." }],
    analyst: p.analyst?.trim() || "Desk",
    links: p.links?.length
      ? p.links
      : [
          { label: "Trend", href: "/trend" },
          { label: "Watch", href: "/watch" },
        ],
    user: true,
  };
}

const INST_RE =
  /\b(EURUSD|USDJPY|GBPUSD|USDCAD|AUDUSD|USDMXN|USDCNH|BBDXY|DXY|WTI|BRENT|XAU|XAG|SPX|NDX|BTC|SOFR|US10Y|NVDA|AAPL|MSFT|GOOG|AMZN|META|TSLA|JPM|XOM|LMT|RTX)\b/i;

export function guessInstrument(text: string): string {
  const m = text.match(INST_RE);
  if (m) return m[1]!.toUpperCase();
  if (/\byen\b|boj|usd\/jpy/i.test(text)) return "USDJPY";
  if (/\beuro\b|ecb|eur\b/i.test(text)) return "EURUSD";
  if (/\bdollar\b|dxy|fed\b/i.test(text)) return "DXY";
  if (/\boil\b|crude|opec|hormuz/i.test(text)) return "WTI";
  if (/\bgold\b/i.test(text)) return "XAU";
  return "DXY";
}

export function guessDomain(text: string): Thesis["domain"] {
  if (/iran|taiwan|ukraine|hormuz|geopolit/i.test(text)) return "Geopolitics";
  if (/oil|wti|brent|gas|opec/i.test(text)) return "Energy";
  if (/gold|copper|metal/i.test(text)) return "Commodities";
  if (/fx|euro|yen|pound|peso|dollar|dxy/i.test(text)) return "FX";
  if (/rate|yield|sofr|bund|gilt|wacc/i.test(text)) return "Rates";
  if (/btc|crypto/i.test(text)) return "Crypto";
  if (/equity|nasdaq|s&p|stock|nvda|aapl/i.test(text)) return "Equities";
  return "Macro";
}

