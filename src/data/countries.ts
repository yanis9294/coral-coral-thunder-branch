import { hashStr, mulberry32, dayKey } from "@/lib/utils";
import type { CountryIntel } from "./types";

type Seed = Omit<CountryIntel, "econ" | "news"> & { econ0: number; news0: number };

const SEEDS: Seed[] = [
  { id: "840", iso2: "US", iso3: "USA", name: "United States", capital: "Washington", lat: 38.91, lng: -77.04, region: "North America", populationM: 341, power: 92, econ0: 18, news0: -8, brief: "Soft-landing narrative intact but late-cycle cracks in labor. Fiscal impulse still large; dollar bid on Hormuz hedges. Elections priced; policy path is the residual.", gdp: "$29.2tn", fx: "DXY 104.8", yields: "10Y 4.12%" },
  { id: "156", iso2: "CN", iso3: "CHN", name: "China", capital: "Beijing", lat: 39.9, lng: 116.4, region: "East Asia", populationM: 1410, power: 86, econ0: -12, news0: 6, brief: "Property drag persists; industrial policy and rare-earth licenses remain the geopolitical lever. Taiwan Strait optionality is the desk's unpriced tail.", gdp: "$18.6tn", fx: "USDCNY 7.18", yields: "10Y 1.92%" },
  { id: "643", iso2: "RU", iso3: "RUS", name: "Russia", capital: "Moscow", lat: 55.75, lng: 37.62, region: "Eurasia", populationM: 144, power: 71, econ0: -22, news0: -34, brief: "War economy still absorbing manpower. Energy fiscal break-even creeping higher. Arctic NSR traffic is the quiet structural story.", gdp: "$2.1tn", fx: "USDRUB 94.2", yields: "OFZ 10Y 15.4%" },
  { id: "364", iso2: "IR", iso3: "IRN", name: "Iran", capital: "Tehran", lat: 35.69, lng: 51.39, region: "Middle East", populationM: 91, power: 54, econ0: -41, news0: -72, brief: "Organizing principle of the tape. Enrichment, militia network, and Hormuz option. Oil risk premia sticky; any kinetic event reprices WTI $8–12.", gdp: "$0.4tn", fx: "IRR unofficial", yields: "n/a" },
  { id: "682", iso2: "SA", iso3: "SAU", name: "Saudi Arabia", capital: "Riyadh", lat: 24.71, lng: 46.68, region: "Middle East", populationM: 37, power: 62, econ0: 8, news0: -14, brief: "Swing producer with a political oil function. Spare capacity is the global shock absorber — and it is thinner than the 2010s.", gdp: "$1.1tn", fx: "USDSAR 3.75", yields: "Sukuk 10Y 4.8%" },
  { id: "376", iso2: "IL", iso3: "ISR", name: "Israel", capital: "Jerusalem", lat: 31.77, lng: 35.22, region: "Middle East", populationM: 10, power: 58, econ0: -6, news0: -28, brief: "Northern front and Iran arc dominate risk. Tech complex resilient; shekel used as a regional barometer more than a local story.", gdp: "$0.53tn", fx: "USDILS 3.72", yields: "10Y 4.55%" },
  { id: "804", iso2: "UA", iso3: "UKR", name: "Ukraine", capital: "Kyiv", lat: 50.45, lng: 30.52, region: "Europe", populationM: 37, power: 44, econ0: -28, news0: -38, brief: "Attrition phase. Grain corridor and energy grid remain market-relevant. Aid fatigue is the 2026 political risk, not the front itself.", gdp: "$0.18tn", fx: "USDUAH 41.2", yields: "n/a" },
  { id: "792", iso2: "TR", iso3: "TUR", name: "Turkey", capital: "Ankara", lat: 39.93, lng: 32.86, region: "Eurasia", populationM: 87, power: 52, econ0: -4, news0: -12, brief: "Straits, NATO flank, and a lira that still trades as a high-beta EM. Black Sea grain and energy transit keep it on the desk.", gdp: "$1.1tn", fx: "USDTRY 34.8", yields: "10Y 27%" },
  { id: "784", iso2: "AE", iso3: "ARE", name: "United Arab Emirates", capital: "Abu Dhabi", lat: 24.45, lng: 54.38, region: "Middle East", populationM: 10, power: 48, econ0: 22, news0: -6, brief: "Regional safe-haven and gold/re-export hub. ADNOC barrels and DIFC flows make it a live node when Hormuz tightens.", gdp: "$0.54tn", fx: "USDAED 3.67", yields: "5Y 4.1%" },
  { id: "818", iso2: "EG", iso3: "EGY", name: "Egypt", capital: "Cairo", lat: 30.04, lng: 31.24, region: "Middle East", populationM: 114, power: 42, econ0: -16, news0: -18, brief: "Suez and FX shortage. Canal receipts are a high-frequency read on Red Sea risk. IMF program still the fiscal backstop.", gdp: "$0.39tn", fx: "USDEGP 48.1", yields: "USD bond 9.4%" },
  { id: "887", iso2: "YE", iso3: "YEM", name: "Yemen", capital: "Sana'a", lat: 15.35, lng: 44.21, region: "Middle East", populationM: 35, power: 18, econ0: -54, news0: -46, brief: "Bab el-Mandeb kinetic risk. Ansar Allah attacks remain the Red Sea premium. Shipping re-route around the Cape is the observable.", gdp: "n/a", fx: "n/a", yields: "n/a" },
  { id: "826", iso2: "GB", iso3: "GBR", name: "United Kingdom", capital: "London", lat: 51.51, lng: -0.13, region: "Europe", populationM: 68, power: 64, econ0: 4, news0: 2, brief: "Gilt market and North Sea. Sterling still a risk barometer. London remains the FX/commodities matching engine of Europe.", gdp: "$3.6tn", fx: "GBPUSD 1.312", yields: "10Y 4.28%" },
  { id: "276", iso2: "DE", iso3: "DEU", name: "Germany", capital: "Berlin", lat: 52.52, lng: 13.4, region: "Europe", populationM: 84, power: 68, econ0: -8, news0: -4, brief: "Industrial recession-or-not is the EMU question. Energy mix still the strategic vulnerability. Bunds price the ECB path.", gdp: "$4.6tn", fx: "EURUSD 1.084", yields: "Bund 2.38%" },
  { id: "250", iso2: "FR", iso3: "FRA", name: "France", capital: "Paris", lat: 48.86, lng: 2.35, region: "Europe", populationM: 68, power: 66, econ0: -2, news0: 4, brief: "Fiscal politics and nuclear complex. Sahel residual and Indo-Pacific deployments keep it on the military overlay.", gdp: "$3.2tn", fx: "EURUSD 1.084", yields: "OAT 3.12%" },
  { id: "380", iso2: "IT", iso3: "ITA", name: "Italy", capital: "Rome", lat: 41.9, lng: 12.5, region: "Europe", populationM: 59, power: 50, econ0: -10, news0: -6, brief: "BTPs as the EMU stress gauge. Mediterranean energy landing point for TAP/EastMed optionality.", gdp: "$2.3tn", fx: "EURUSD 1.084", yields: "BTP 3.72%" },
  { id: "724", iso2: "ES", iso3: "ESP", name: "Spain", capital: "Madrid", lat: 40.42, lng: -3.7, region: "Europe", populationM: 48, power: 48, econ0: 6, news0: 2, brief: "Growth outperformer in EMU. LNG import capacity is the quiet energy-security asset.", gdp: "$1.7tn", fx: "EURUSD 1.084", yields: "Bonos 3.18%" },
  { id: "528", iso2: "NL", iso3: "NLD", name: "Netherlands", capital: "Amsterdam", lat: 52.37, lng: 4.89, region: "Europe", populationM: 18, power: 46, econ0: 10, news0: 4, brief: "Rotterdam and TTF. The European energy price-setters sit here more than in Brussels.", gdp: "$1.2tn", fx: "EURUSD 1.084", yields: "DSL 2.52%" },
  { id: "616", iso2: "PL", iso3: "POL", name: "Poland", capital: "Warsaw", lat: 52.23, lng: 21.01, region: "Europe", populationM: 38, power: 50, econ0: 12, news0: -10, brief: "NATO eastern flank and Suwałki. Defense spend is structural. Zloty as a regional risk sensor.", gdp: "$0.84tn", fx: "EURPLN 4.28", yields: "10Y 5.4%" },
  { id: "392", iso2: "JP", iso3: "JPN", name: "Japan", capital: "Tokyo", lat: 35.68, lng: 139.69, region: "East Asia", populationM: 123, power: 72, econ0: 2, news0: 8, brief: "BoJ path and JGB market still the world's most important rates puzzle after the Fed. Yen as funding currency — squeeze risk is live.", gdp: "$4.1tn", fx: "USDJPY 149.8", yields: "JGB 10Y 1.08%" },
  { id: "410", iso2: "KR", iso3: "KOR", name: "South Korea", capital: "Seoul", lat: 37.57, lng: 126.98, region: "East Asia", populationM: 52, power: 56, econ0: 6, news0: -8, brief: "Semiconductors and the northern threat. Won is a high-beta Asia risk proxy. Memory cycle turning.", gdp: "$1.8tn", fx: "USDKRW 1348", yields: "10Y 3.05%" },
  { id: "408", iso2: "KP", iso3: "PRK", name: "North Korea", capital: "Pyongyang", lat: 39.03, lng: 125.75, region: "East Asia", populationM: 26, power: 36, econ0: -60, news0: -22, brief: "Missile tests as a vol event for KRW and NKY. Nuclear overlay. Not a market, a tail.", gdp: "n/a", fx: "n/a", yields: "n/a" },
  { id: "158", iso2: "TW", iso3: "TWN", name: "Taiwan", capital: "Taipei", lat: 25.03, lng: 121.57, region: "East Asia", populationM: 23, power: 54, econ0: 8, news0: -24, brief: "TSMC as a single point of failure for AI capex. Strait risk is the decade's largest geopolitical premium. Desk tracks PLA drills weekly.", gdp: "$0.79tn", fx: "USDTWD 32.1", yields: "10Y 1.48%" },
  { id: "356", iso2: "IN", iso3: "IND", name: "India", capital: "New Delhi", lat: 28.61, lng: 77.21, region: "South Asia", populationM: 1440, power: 70, econ0: 28, news0: 6, brief: "Growth compounder and Russia oil absorber. Rupee managed. The structural long of the decade — crowded, still intact.", gdp: "$3.9tn", fx: "USDINR 83.9", yields: "10Y 6.82%" },
  { id: "586", iso2: "PK", iso3: "PAK", name: "Pakistan", capital: "Islamabad", lat: 33.68, lng: 73.05, region: "South Asia", populationM: 241, power: 38, econ0: -24, news0: -16, brief: "IMF patient, nuclear overlay, Gwadar as a China node. Not a liquid market — a stability sensor.", gdp: "$0.37tn", fx: "USDPKR 278", yields: "n/a" },
  { id: "682", iso2: "SA", iso3: "SAU", name: "Saudi Arabia", capital: "Riyadh", lat: 24.71, lng: 46.68, region: "Middle East", populationM: 37, power: 62, econ0: 8, news0: -14, brief: "OPEC+ whip. Vision 2030 capex vs oil price needed to fund it. That's the constraint.", gdp: "$1.1tn", fx: "USDSAR 3.75", yields: "Sukuk 4.8%" },
  { id: "036", iso2: "AU", iso3: "AUS", name: "Australia", capital: "Canberra", lat: -35.28, lng: 149.13, region: "Oceania", populationM: 27, power: 52, econ0: 4, news0: 2, brief: "Iron ore, LNG, and AUKUS. AUD as a China/risk hybrid. Critical minerals policy is the 2026 overlay.", gdp: "$1.7tn", fx: "AUDUSD 0.668", yields: "10Y 4.18%" },
  { id: "076", iso2: "BR", iso3: "BRA", name: "Brazil", capital: "Brasília", lat: -15.79, lng: -47.88, region: "LatAm", populationM: 216, power: 54, econ0: 14, news0: 8, brief: "Soft commodity powerhouse and China iron-ore pair. BRL high-beta. Fiscal is the local residual.", gdp: "$2.2tn", fx: "USDBRL 5.48", yields: "DI 10Y 12.4%" },
  { id: "484", iso2: "MX", iso3: "MEX", name: "Mexico", capital: "Mexico City", lat: 19.43, lng: -99.13, region: "LatAm", populationM: 130, power: 48, econ0: 10, news0: -4, brief: "Nearshoring residual and USMCA politics. Banxico as a real-rate story. Peso still a carry favorite — crowding risk flagged in COT.", gdp: "$1.8tn", fx: "USDMXN 19.4", yields: "Mbono 10Y 9.6%" },
  { id: "124", iso2: "CA", iso3: "CAN", name: "Canada", capital: "Ottawa", lat: 45.42, lng: -75.7, region: "North America", populationM: 41, power: 58, econ0: 6, news0: 2, brief: "Oil sands, potash, and a G7 housing hangover. CAD tracks WTI more than BoC rhetoric.", gdp: "$2.2tn", fx: "USDCAD 1.358", yields: "10Y 3.42%" },
  { id: "710", iso2: "ZA", iso3: "ZAF", name: "South Africa", capital: "Pretoria", lat: -25.75, lng: 28.19, region: "Africa", populationM: 63, power: 40, econ0: -14, news0: -8, brief: "PGMs, gold, and Cape re-route beneficiary when Red Sea closes. ZAR is the EM vol instrument.", gdp: "$0.40tn", fx: "USDZAR 17.6", yields: "R2035 10.8%" },
  { id: "566", iso2: "NG", iso3: "NGA", name: "Nigeria", capital: "Abuja", lat: 9.08, lng: 7.4, region: "Africa", populationM: 227, power: 36, econ0: -18, news0: -10, brief: "Gulf of Guinea barrels and FX reform unfinished. Sahel spillover is the security overlay.", gdp: "$0.25tn", fx: "USDNGN 1540", yields: "n/a" },
  { id: "012", iso2: "DZ", iso3: "DZA", name: "Algeria", capital: "Algiers", lat: 36.75, lng: 3.06, region: "Africa", populationM: 46, power: 38, econ0: 2, news0: -6, brief: "Med gas supplier to Europe. Quiet strategic — becomes loud if Ukraine winter is tight.", gdp: "$0.25tn", fx: "USDDZD 134", yields: "n/a" },
  { id: "360", iso2: "ID", iso3: "IDN", name: "Indonesia", capital: "Jakarta", lat: -6.21, lng: 106.85, region: "SE Asia", populationM: 279, power: 50, econ0: 16, news0: 4, brief: "Nickel, coal, and Malacca-adjacent. Downstream industrial policy is the long. Palm oil is the quiet ag input.", gdp: "$1.4tn", fx: "USDIDR 15480", yields: "10Y 6.55%" },
  { id: "702", iso2: "SG", iso3: "SGP", name: "Singapore", capital: "Singapore", lat: 1.35, lng: 103.82, region: "SE Asia", populationM: 6, power: 44, econ0: 20, news0: 6, brief: "Malacca node, refining hub, Asian dollar. When shipping insurance spikes, this is where it prints.", gdp: "$0.53tn", fx: "USDSGD 1.312", yields: "SGS 10Y 2.72%" },
  { id: "458", iso2: "MY", iso3: "MYS", name: "Malaysia", capital: "Kuala Lumpur", lat: 3.14, lng: 101.69, region: "SE Asia", populationM: 34, power: 40, econ0: 8, news0: 2, brief: "Malacca and LNG. Quiet, until it isn't — the strait is a 25% world-trade chokepoint.", gdp: "$0.44tn", fx: "USDMYR 4.38", yields: "10Y 3.78%" },
  { id: "764", iso2: "TH", iso3: "THA", name: "Thailand", capital: "Bangkok", lat: 13.76, lng: 100.5, region: "SE Asia", populationM: 72, power: 38, econ0: 4, news0: 0, brief: "Tourism and a baht that still behaves like an Asia beta. Not a thesis, a sensor.", gdp: "$0.51tn", fx: "USDTHB 33.4", yields: "10Y 2.55%" },
  { id: "704", iso2: "VN", iso3: "VNM", name: "Vietnam", capital: "Hanoi", lat: 21.03, lng: 105.85, region: "SE Asia", populationM: 100, power: 42, econ0: 18, news0: 4, brief: "China+1 manufacturing. SCS exposure. Dong managed. The industrial relocation trade, still running.", gdp: "$0.46tn", fx: "USDVND 25120", yields: "n/a" },
  { id: "608", iso2: "PH", iso3: "PHL", name: "Philippines", capital: "Manila", lat: 14.6, lng: 120.98, region: "SE Asia", populationM: 117, power: 40, econ0: 10, news0: -12, brief: "SCS flashpoint with China. Second Thomas Shoal is a ZONE candidate any given week.", gdp: "$0.46tn", fx: "USDPHP 56.2", yields: "10Y 6.1%" },
  { id: "578", iso2: "NO", iso3: "NOR", name: "Norway", capital: "Oslo", lat: 59.91, lng: 10.75, region: "Europe", populationM: 5.6, power: 46, econ0: 14, news0: 4, brief: "NCS barrels and Troll gas. Europe's energy insurance policy. NOK oil-beta.", gdp: "$0.49tn", fx: "EURNOK 11.6", yields: "10Y 3.48%" },
  { id: "752", iso2: "SE", iso3: "SWE", name: "Sweden", capital: "Stockholm", lat: 59.33, lng: 18.07, region: "Europe", populationM: 10.5, power: 44, econ0: 2, news0: 2, brief: "NATO accession residual, defense industrial. Krona still a high-beta G10.", gdp: "$0.59tn", fx: "EURSEK 11.3", yields: "10Y 2.12%" },
  { id: "756", iso2: "CH", iso3: "CHE", name: "Switzerland", capital: "Bern", lat: 46.95, lng: 7.44, region: "Europe", populationM: 8.9, power: 48, econ0: 8, news0: 6, brief: "Safe-haven CHF and commodity trading houses. When risk-off prints, this is a bid, not a story.", gdp: "$0.94tn", fx: "USDCHF 0.862", yields: "10Y 0.52%" },
  { id: "792", iso2: "TR", iso3: "TUR", name: "Turkey", capital: "Ankara", lat: 39.93, lng: 32.86, region: "Eurasia", populationM: 87, power: 52, econ0: -4, news0: -12, brief: "Bosporus chokepoint and NATO's southern hinge.", gdp: "$1.1tn", fx: "USDTRY 34.8", yields: "10Y 27%" },
  { id: "368", iso2: "IQ", iso3: "IRQ", name: "Iraq", capital: "Baghdad", lat: 33.32, lng: 44.37, region: "Middle East", populationM: 45, power: 34, econ0: -20, news0: -26, brief: "Kirkuk-Ceyhan and Basra barrels. Militia risk is the Iran-arc transmission into oil.", gdp: "$0.25tn", fx: "n/a", yields: "n/a" },
  { id: "414", iso2: "KW", iso3: "KWT", name: "Kuwait", capital: "Kuwait City", lat: 29.38, lng: 47.99, region: "Middle East", populationM: 4.4, power: 36, econ0: 4, news0: -16, brief: "Spare capacity neighbour. Hormuz-adjacent. Quiet unless the strait closes.", gdp: "$0.16tn", fx: "USDKWD 0.307", yields: "n/a" },
  { id: "634", iso2: "QA", iso3: "QAT", name: "Qatar", capital: "Doha", lat: 25.29, lng: 51.53, region: "Middle East", populationM: 2.7, power: 40, econ0: 12, news0: -10, brief: "LNG that keeps European winters solvable. North Field expansion is structural supply.", gdp: "$0.22tn", fx: "USDQAR 3.64", yields: "n/a" },
  { id: "512", iso2: "OM", iso3: "OMN", name: "Oman", capital: "Muscat", lat: 23.59, lng: 58.41, region: "Middle East", populationM: 4.6, power: 32, econ0: 2, news0: -20, brief: "East of Hormuz. The alternative load point if the strait seizes. Quietly strategic.", gdp: "$0.11tn", fx: "USDOMR 0.385", yields: "n/a" },
  { id: "400", iso2: "JO", iso3: "JOR", name: "Jordan", capital: "Amman", lat: 31.95, lng: 35.93, region: "Middle East", populationM: 11, power: 28, econ0: -8, news0: -14, brief: "Buffer state. Not a market — a corridor.", gdp: "$0.05tn", fx: "USDJOD 0.71", yields: "n/a" },
  { id: "760", iso2: "SY", iso3: "SYR", name: "Syria", capital: "Damascus", lat: 33.51, lng: 36.29, region: "Middle East", populationM: 23, power: 24, econ0: -70, news0: -40, brief: "Fragmented battlespace. Base presence (Hmeimim, al-Tanf) is the MIL overlay.", gdp: "n/a", fx: "n/a", yields: "n/a" },
  { id: "422", iso2: "LB", iso3: "LBN", name: "Lebanon", capital: "Beirut", lat: 33.89, lng: 35.5, region: "Middle East", populationM: 5.5, power: 22, econ0: -48, news0: -32, brief: "Northern front sensor. Not investable; informative.", gdp: "n/a", fx: "n/a", yields: "n/a" },
  { id: "275", iso2: "PS", iso3: "PSE", name: "Palestine", capital: "Ramallah", lat: 31.9, lng: 35.2, region: "Middle East", populationM: 5.5, power: 12, econ0: -66, news0: -50, brief: "Humanitarian and kinetic overlay. Oil and risk assets still reprice on headline days.", gdp: "n/a", fx: "n/a", yields: "n/a" },
  { id: "004", iso2: "AF", iso3: "AFG", name: "Afghanistan", capital: "Kabul", lat: 34.53, lng: 69.17, region: "South Asia", populationM: 43, power: 20, econ0: -58, news0: -12, brief: "Residual terror overlay. Lithium narrative overstated.", gdp: "n/a", fx: "n/a", yields: "n/a" },
  { id: "398", iso2: "KZ", iso3: "KAZ", name: "Kazakhstan", capital: "Astana", lat: 51.17, lng: 71.45, region: "Eurasia", populationM: 20, power: 38, econ0: 8, news0: -4, brief: "CPC pipeline barrels to Novorossiysk. Uranium. The quiet energy state.", gdp: "$0.26tn", fx: "USDKZT 478", yields: "n/a" },
  { id: "031", iso2: "AZ", iso3: "AZE", name: "Azerbaijan", capital: "Baku", lat: 40.41, lng: 49.87, region: "Eurasia", populationM: 10, power: 36, econ0: 10, news0: -2, brief: "TAP/TANAP gas to Europe. Corridor politics with Armenia. Strategic, not liquid.", gdp: "$0.07tn", fx: "USDAZN 1.70", yields: "n/a" },
  { id: "268", iso2: "GE", iso3: "GEO", name: "Georgia", capital: "Tbilisi", lat: 41.72, lng: 44.83, region: "Eurasia", populationM: 3.7, power: 24, econ0: 4, news0: -8, brief: "Caucasus corridor. BTC pipeline. A map node, not a book.", gdp: "$0.03tn", fx: "n/a", yields: "n/a" },
  { id: "804", iso2: "UA", iso3: "UKR", name: "Ukraine", capital: "Kyiv", lat: 50.45, lng: 30.52, region: "Europe", populationM: 37, power: 44, econ0: -28, news0: -38, brief: "Attrition and grain. Zaporizhzhia nuclear remains a ZONE.", gdp: "$0.18tn", fx: "USDUAH 41.2", yields: "n/a" },
];

const BY_ID: Record<string, Seed> = {};
for (const s of SEEDS) BY_ID[s.id] = s;

export function countryIntel(id: string | undefined, asOf: number): CountryIntel | null {
  if (!id) return null;
  const s = BY_ID[id];
  if (!s) return null;
  const r = mulberry32(hashStr(id) ^ dayKey(asOf));
  const econ = clampScore(s.econ0 + (r() - 0.5) * 10);
  const news = clampScore(s.news0 + (r() - 0.5) * 14);
  return { ...s, econ, news };
}

export function countryScore(id: string | undefined, asOf: number, mode: "econ" | "news"): number {
  const c = countryIntel(id, asOf);
  if (c) return mode === "econ" ? c.econ : c.news;
  if (!id) return 0;
  const r = mulberry32(hashStr(id) ^ dayKey(asOf) ^ (mode === "econ" ? 1 : 2));
  return clampScore((r() - 0.5) * 70);
}

function clampScore(n: number) {
  return Math.max(-100, Math.min(100, n));
}

export function allCountryIntel(asOf: number): CountryIntel[] {
  const seen = new Set<string>();
  const out: CountryIntel[] = [];
  for (const s of SEEDS) {
    if (seen.has(s.id)) continue;
    seen.add(s.id);
    const c = countryIntel(s.id, asOf);
    if (c) out.push(c);
  }
  return out;
}
