import { B as mulberry32, D as destination, E as dayKey, F as hashStr, I as hourKey, Q as ticker, Y as series, x as clamp } from "./shell-B4EHQ9b6.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/calculated-DX17ibxV.js
var LANES = [
	{
		name: "Hormuz",
		lat: 26.57,
		lng: 56.25,
		heading: 125,
		dest: "Fujairah"
	},
	{
		name: "Hormuz",
		lat: 26.4,
		lng: 56.5,
		heading: 300,
		dest: "Basra"
	},
	{
		name: "Malacca",
		lat: 2.5,
		lng: 101.8,
		heading: 140,
		dest: "Singapore"
	},
	{
		name: "Malacca",
		lat: 4.2,
		lng: 100.1,
		heading: 320,
		dest: "Port Klang"
	},
	{
		name: "Suez",
		lat: 30,
		lng: 32.5,
		heading: 180,
		dest: "Port Said"
	},
	{
		name: "Bab el-Mandeb",
		lat: 12.6,
		lng: 43.4,
		heading: 200,
		dest: "Djibouti"
	},
	{
		name: "English Channel",
		lat: 50.7,
		lng: 1.2,
		heading: 250,
		dest: "Rotterdam"
	},
	{
		name: "S. China Sea",
		lat: 15.2,
		lng: 114.2,
		heading: 30,
		dest: "Hong Kong"
	},
	{
		name: "Cape",
		lat: -34.3,
		lng: 18.4,
		heading: 90,
		dest: "Durban"
	},
	{
		name: "Panama",
		lat: 9.1,
		lng: -79.7,
		heading: 90,
		dest: "Colon"
	},
	{
		name: "Bosporus",
		lat: 41.12,
		lng: 29.07,
		heading: 10,
		dest: "Odessa"
	},
	{
		name: "Taiwan Strait",
		lat: 24.5,
		lng: 119.3,
		heading: 20,
		dest: "Keelung"
	},
	{
		name: "N. Atlantic",
		lat: 42,
		lng: -40,
		heading: 70,
		dest: "Rotterdam"
	},
	{
		name: "N. Pacific",
		lat: 35,
		lng: 160,
		heading: 80,
		dest: "Long Beach"
	},
	{
		name: "Gulf of Guinea",
		lat: 4,
		lng: 3,
		heading: 220,
		dest: "Houston"
	}
];
var VESSEL_NAMES = [
	"FRONT SUEZ",
	"COSCO SILK",
	"MAERSK HORMUZ",
	"IRISL BANDAR",
	"EVER GIVEN",
	"NORDIC AURORA",
	"OCEAN GLORY",
	"PACIFIC DAWN",
	"AL SAHAM",
	"STI MAGNUS",
	"CMA CGM NILE",
	"HAPAG ANTWERP",
	"MOL TRIBUTE",
	"NYK VENUS",
	"DHT TIGER",
	"MARAN ARIES",
	"MINERVA KARTINI",
	"SEAWAYS RIO",
	"BW LOTUS",
	"SCORPIO TANK"
];
var FLAGS = [
	"PA",
	"MH",
	"LR",
	"SG",
	"GR",
	"CN",
	"NO",
	"JP",
	"MT",
	"HK",
	"IR",
	"SA"
];
var TYPES = [
	"Crude tanker",
	"Product tanker",
	"Boxship",
	"LNG",
	"Bulk",
	"RoRo",
	"VLCC"
];
function ships(asOf) {
	const out = [];
	LANES.forEach((lane, i) => {
		for (let j = 0; j < 5; j++) {
			const seed = hashStr(`${lane.name}-${i}-${j}`) ^ hourKey(asOf);
			const r = mulberry32(seed);
			const heading = lane.heading + (r() - .5) * 30;
			const speed = 10 + r() * 12;
			const ageH = r() * 48;
			const [lat, lng] = destination(lane.lat, lane.lng, heading, speed * 1.852 * ageH);
			const id = `ais-${i}-${j}`;
			out.push({
				id,
				name: VESSEL_NAMES[(i * 5 + j) % VESSEL_NAMES.length],
				flag: FLAGS[(i + j * 3) % FLAGS.length],
				type: TYPES[(i + j) % TYPES.length],
				lat,
				lng,
				heading,
				speedKn: +speed.toFixed(1),
				dest: lane.dest,
				draught: +(8 + r() * 12).toFixed(1),
				lane: lane.name
			});
		}
	});
	return out;
}
var FLIGHT_TEMPLATES = [
	{
		id: "mil-1",
		callsign: "RCH265",
		operator: "USAF",
		type: "C-17",
		heading: 85,
		altFt: 34e3,
		speedKt: 450,
		from: "Ramstein",
		to: "Ali Al Salem"
	},
	{
		id: "mil-2",
		callsign: "NATO03",
		operator: "NATO AEW",
		type: "E-3A",
		heading: 12,
		altFt: 31e3,
		speedKt: 420,
		from: "Geilenkirchen",
		to: "orbit-Baltics"
	},
	{
		id: "mil-3",
		callsign: "IRON23",
		operator: "USAF",
		type: "B-52H",
		heading: 270,
		altFt: 36e3,
		speedKt: 480,
		from: "Diego Garcia",
		to: "Al Udeid"
	},
	{
		id: "mil-4",
		callsign: "RFF7214",
		operator: "RuAF",
		type: "Tu-95",
		heading: 95,
		altFt: 28e3,
		speedKt: 410,
		from: "Engels",
		to: "patrol-Barents"
	},
	{
		id: "mil-5",
		callsign: "PLAAF9",
		operator: "PLAAF",
		type: "H-6",
		heading: 140,
		altFt: 3e4,
		speedKt: 470,
		from: "Quzhou",
		to: "ADIZ-TW"
	},
	{
		id: "mil-6",
		callsign: "IAF118",
		operator: "IAF",
		type: "F-15I",
		heading: 80,
		altFt: 28e3,
		speedKt: 520,
		from: "Hatzerim",
		to: "Golan"
	},
	{
		id: "mil-7",
		callsign: "RAF23",
		operator: "RAF",
		type: "Typhoon",
		heading: 70,
		altFt: 32e3,
		speedKt: 490,
		from: "Akrotiri",
		to: "CAP-EastMed"
	},
	{
		id: "mil-8",
		callsign: "AFA45",
		operator: "Armée de l'Air",
		type: "Rafale",
		heading: 160,
		altFt: 29e3,
		speedKt: 500,
		from: "Solenzara",
		to: "Sahel-det"
	},
	{
		id: "mil-9",
		callsign: "RCH441",
		operator: "USAF",
		type: "KC-135",
		heading: 45,
		altFt: 33e3,
		speedKt: 440,
		from: "Incirlik",
		to: "tanker-track"
	},
	{
		id: "mil-10",
		callsign: "JASDF2",
		operator: "JASDF",
		type: "F-15J",
		heading: 220,
		altFt: 31e3,
		speedKt: 510,
		from: "Naha",
		to: "Senkaku-CAP"
	},
	{
		id: "mil-11",
		callsign: "ROKAF7",
		operator: "ROKAF",
		type: "F-35A",
		heading: 350,
		altFt: 3e4,
		speedKt: 530,
		from: "Cheongju",
		to: "DMZ"
	},
	{
		id: "mil-12",
		callsign: "UAF11",
		operator: "UkrAF",
		type: "F-16",
		heading: 10,
		altFt: 22e3,
		speedKt: 480,
		from: "west-UA",
		to: "Kharkiv"
	},
	{
		id: "mil-13",
		callsign: "IRIAF4",
		operator: "IRIAF",
		type: "F-14",
		heading: 190,
		altFt: 26e3,
		speedKt: 460,
		from: "Isfahan",
		to: "Bushehr"
	},
	{
		id: "mil-14",
		callsign: "RSAF9",
		operator: "RSAF",
		type: "F-15SA",
		heading: 30,
		altFt: 3e4,
		speedKt: 500,
		from: "Khamis Mushait",
		to: "Yemen-border"
	},
	{
		id: "mil-15",
		callsign: "HVA66",
		operator: "USN",
		type: "P-8A",
		heading: 260,
		altFt: 24e3,
		speedKt: 420,
		from: "Kadena",
		to: "SCS-patrol"
	},
	{
		id: "mil-16",
		callsign: "NATO11",
		operator: "Luftwaffe",
		type: "Eurofighter",
		heading: 80,
		altFt: 32e3,
		speedKt: 510,
		from: "Ämari",
		to: "CAP-EST"
	},
	{
		id: "mil-17",
		callsign: "RCH090",
		operator: "USAF",
		type: "C-5M",
		heading: 100,
		altFt: 35e3,
		speedKt: 460,
		from: "Dover",
		to: "Ramstein"
	},
	{
		id: "mil-18",
		callsign: "PLAAF2",
		operator: "PLAAF",
		type: "J-16",
		heading: 170,
		altFt: 28e3,
		speedKt: 540,
		from: "Shantou",
		to: "Bashi"
	},
	{
		id: "mil-19",
		callsign: "USN-CVN",
		operator: "USN",
		type: "E-2D",
		heading: 310,
		altFt: 18e3,
		speedKt: 300,
		from: "CVN-69",
		to: "Med-orbit"
	},
	{
		id: "mil-20",
		callsign: "QTRAF1",
		operator: "QEAF",
		type: "C-17",
		heading: 310,
		altFt: 33e3,
		speedKt: 450,
		from: "Al Udeid",
		to: "Incirlik"
	}
];
var FLIGHT_ORIGINS = [
	[49.44, 7.6],
	[50.97, 6.04],
	[-7.3, 72.4],
	[51.47, 46.2],
	[28.97, 118.87],
	[31.27, 34.66],
	[34.59, 32.99],
	[41.92, 9.4],
	[37, 35.43],
	[26.36, 127.75],
	[36.72, 127.5],
	[49.8, 24],
	[32.75, 51.86],
	[18.3, 42.8],
	[26.35, 127.77],
	[59.26, 24.21],
	[39.13, -75.47],
	[23.4, 116.7],
	[35.2, 16.5],
	[25.12, 51.31]
];
function flights(asOf) {
	return FLIGHT_TEMPLATES.map((f, i) => {
		const [lat0, lng0] = FLIGHT_ORIGINS[i];
		const ageH = (asOf / 1e3 + i * 7919) % 18e3 / 3600;
		const [lat, lng] = destination(lat0, lng0, f.heading, f.speedKt * 1.852 * ageH);
		return {
			...f,
			lat,
			lng
		};
	});
}
var QUAKE_SEEDS = [
	{
		place: "Vanuatu Islands",
		lat: -16.5,
		lng: 168,
		mag: 6.2,
		depth: 32
	},
	{
		place: "Offshore Chiapas, Mexico",
		lat: 14.8,
		lng: -93.2,
		mag: 5.4,
		depth: 48
	},
	{
		place: "Kerman, Iran",
		lat: 29.6,
		lng: 57.4,
		mag: 4.9,
		depth: 18
	},
	{
		place: "Near the coast of Honshu",
		lat: 37.5,
		lng: 141.8,
		mag: 5.1,
		depth: 42
	},
	{
		place: "Hindu Kush, Afghanistan",
		lat: 36.4,
		lng: 70.8,
		mag: 5.6,
		depth: 190
	},
	{
		place: "South of Fiji",
		lat: -23.1,
		lng: 179.4,
		mag: 6,
		depth: 540
	},
	{
		place: "Crete, Greece",
		lat: 34.9,
		lng: 25.4,
		mag: 4.6,
		depth: 28
	},
	{
		place: "Mindanao, Philippines",
		lat: 6.2,
		lng: 126.4,
		mag: 5.3,
		depth: 55
	},
	{
		place: "Reykjanes Ridge",
		lat: 63.8,
		lng: -22.7,
		mag: 4.4,
		depth: 8
	},
	{
		place: "Tarapaca, Chile",
		lat: -20.2,
		lng: -69.1,
		mag: 5,
		depth: 96
	},
	{
		place: "Taiwan region",
		lat: 23.8,
		lng: 121.6,
		mag: 4.8,
		depth: 22
	},
	{
		place: "Caucasus, Georgia",
		lat: 42.5,
		lng: 44,
		mag: 4.2,
		depth: 14
	},
	{
		place: "Andreanof Islands, Alaska",
		lat: 51.6,
		lng: -174.8,
		mag: 5.5,
		depth: 36
	},
	{
		place: "Western Turkey",
		lat: 38.3,
		lng: 27.1,
		mag: 4.5,
		depth: 10
	},
	{
		place: "Solomon Islands",
		lat: -9.6,
		lng: 160.2,
		mag: 5.8,
		depth: 44
	},
	{
		place: "Baja California",
		lat: 31.8,
		lng: -115.3,
		mag: 4.3,
		depth: 12
	},
	{
		place: "Java, Indonesia",
		lat: -8.4,
		lng: 112.6,
		mag: 4.7,
		depth: 88
	},
	{
		place: "South Sandwich Islands",
		lat: -58.4,
		lng: -26,
		mag: 6.1,
		depth: 70
	}
];
function quakes(asOf) {
	return QUAKE_SEEDS.map((q, i) => {
		const r = mulberry32(hashStr(q.place) ^ hourKey(asOf));
		const mag = +(q.mag + (r() - .5) * .4).toFixed(1);
		const severity = mag >= 6 ? "HIGH" : mag >= 5 ? "MEDIUM" : "LOW";
		return {
			id: `seis-${i}`,
			lat: q.lat + (r() - .5) * .4,
			lng: q.lng + (r() - .5) * .4,
			mag,
			depthKm: q.depth,
			place: q.place,
			ts: asOf - Math.floor(r() * 72) * 36e5,
			severity
		};
	});
}
function zones(asOf) {
	return [
		{
			id: "zone-hormuz",
			name: "Strait of Hormuz",
			arc: "Iran · Hormuz",
			lat: 26.6,
			lng: 56.3,
			severity: "CRITICAL",
			risk: 9.2,
			radiusKm: 180,
			note: "Desk cluster: AIS slowdown + IRGC fast-boat chatter + PM war-risk bid. Oil premia sticky.",
			updated: asOf - 108e4
		},
		{
			id: "zone-donbas",
			name: "Kharkiv–Donbas",
			arc: "Russia · Ukraine",
			lat: 49.6,
			lng: 36.8,
			severity: "HIGH",
			risk: 7.4,
			radiusKm: 220,
			note: "Grid strikes overnight. Energy infrastructure targeting continues. Grain corridor secondary.",
			updated: asOf - 252e4
		},
		{
			id: "zone-taiwan",
			name: "Taiwan Strait",
			arc: "China · Tech",
			lat: 24.5,
			lng: 119.5,
			severity: "HIGH",
			risk: 7.1,
			radiusKm: 200,
			note: "PLA aircraft transits above median line. TSMC disruption still the unpriced tail.",
			updated: asOf - 33e5
		},
		{
			id: "zone-mandeb",
			name: "Bab el-Mandeb",
			arc: "Iran · Hormuz",
			lat: 12.55,
			lng: 43.35,
			severity: "HIGH",
			risk: 7.8,
			radiusKm: 160,
			note: "Insurance premia elevated. Cape re-route share still >40% of boxships.",
			updated: asOf - 162e4
		},
		{
			id: "zone-suwalki",
			name: "Suwałki Gap",
			arc: "NATO · East",
			lat: 54.3,
			lng: 23.2,
			severity: "MEDIUM",
			risk: 5.1,
			radiusKm: 90,
			note: "NATO rotation + Zapad residue. Not a trade; a watch.",
			updated: asOf - 108e5
		},
		{
			id: "zone-sahel",
			name: "Sahel corridor",
			arc: "Africa · Coups",
			lat: 15.5,
			lng: 1,
			severity: "MEDIUM",
			risk: 5.6,
			radiusKm: 400,
			note: "Junta belt. Gold/uranium logistics, not a liquid tape.",
			updated: asOf - 216e5
		},
		{
			id: "zone-scs",
			name: "Second Thomas Shoal",
			arc: "China · Tech",
			lat: 9.9,
			lng: 115.5,
			severity: "MEDIUM",
			risk: 5.8,
			radiusKm: 80,
			note: "Water-cannon incidents. PHL resupply window.",
			updated: asOf - 144e5
		},
		{
			id: "zone-nsr",
			name: "Arctic NSR",
			arc: "Russia · Energy",
			lat: 74,
			lng: 80,
			severity: "LOW",
			risk: 3.2,
			radiusKm: 500,
			note: "Seasonal traffic + dual-use ports. Structural, not acute.",
			updated: asOf - 72e6
		}
	];
}
function pmGeos() {
	return [
		{
			id: "pm-iran",
			title: "Iran kinetic event vs US/Israel assets, 2026",
			lat: 32,
			lng: 53,
			prob: .31,
			delta24: .04,
			volume: 18.4,
			category: "Geopolitics"
		},
		{
			id: "pm-hormuz",
			title: "Hormuz fully closed ≥7 days this year",
			lat: 26.6,
			lng: 56.3,
			prob: .12,
			delta24: .02,
			volume: 9.1,
			category: "Energy"
		},
		{
			id: "pm-tw",
			title: "China blockade of Taiwan by Dec 2026",
			lat: 24.5,
			lng: 121,
			prob: .08,
			delta24: -.01,
			volume: 22,
			category: "Geopolitics"
		},
		{
			id: "pm-fed",
			title: "Fed cuts ≥50bp by year-end",
			lat: 38.9,
			lng: -77,
			prob: .41,
			delta24: -.03,
			volume: 44.2,
			category: "Macro"
		},
		{
			id: "pm-ua",
			title: "Ukraine ceasefire by March 2027",
			lat: 50.45,
			lng: 30.52,
			prob: .27,
			delta24: .01,
			volume: 15.6,
			category: "Geopolitics"
		},
		{
			id: "pm-oil",
			title: "WTI above $100 before 2027",
			lat: 29.7,
			lng: -95.3,
			prob: .29,
			delta24: .05,
			volume: 12.8,
			category: "Energy"
		},
		{
			id: "pm-xi",
			title: "Xi remains CCP General Secretary through 2027",
			lat: 39.9,
			lng: 116.4,
			prob: .86,
			delta24: 0,
			volume: 6.4,
			category: "Geopolitics"
		},
		{
			id: "pm-ecb",
			title: "ECB on hold through Q1 2027",
			lat: 50.11,
			lng: 8.68,
			prob: .48,
			delta24: .02,
			volume: 7.2,
			category: "Macro"
		},
		{
			id: "pm-gold",
			title: "Gold prints $3,000 in 2026",
			lat: 40.7,
			lng: -74,
			prob: .37,
			delta24: .03,
			volume: 11.5,
			category: "Commodities"
		},
		{
			id: "pm-sk",
			title: "DPRK nuclear test before 2027",
			lat: 41,
			lng: 129,
			prob: .22,
			delta24: -.02,
			volume: 3.1,
			category: "Geopolitics"
		},
		{
			id: "pm-suez",
			title: "Suez transit <50% of 2023 run-rate, Q4",
			lat: 30.45,
			lng: 32.35,
			prob: .34,
			delta24: .01,
			volume: 4.8,
			category: "Trade"
		},
		{
			id: "pm-ai",
			title: "NVIDIA still #1 GPU vendor by rev, 2027",
			lat: 37.37,
			lng: -121.97,
			prob: .72,
			delta24: -.01,
			volume: 19,
			category: "Tech"
		}
	];
}
var NEWS_SEEDS = [
	{
		id: "n1",
		lat: 26.6,
		lng: 56.3,
		title: "IRGC naval drills announced inside Hormuz TSS",
		source: "IRNA / desk confirm",
		severity: "CRITICAL",
		domain: "Geopolitics",
		summary: "Notice to mariners + AIS clustering. War-risk underwriters already widening."
	},
	{
		id: "n2",
		lat: 50.45,
		lng: 30.52,
		title: "Overnight strikes on Kharkiv energy nodes",
		source: "Ukrenergo",
		severity: "HIGH",
		domain: "Geopolitics",
		summary: "Grid frequency instability. Winter-risk premium into TTF still contained."
	},
	{
		id: "n3",
		lat: 24.5,
		lng: 119,
		title: "PLA 39 aircraft crossed the median line",
		source: "MND Taiwan",
		severity: "HIGH",
		domain: "Geopolitics",
		summary: "Largest day this month. TSMC ADR implied vol +1.2pt."
	},
	{
		id: "n4",
		lat: 38.89,
		lng: -77.04,
		title: "Treasury 20Y tails poorly; dealers lean short duration",
		source: "Desk tape",
		severity: "MEDIUM",
		domain: "Macro",
		summary: "Not a Hormuz story — a supply story. Watch the 10s30s."
	},
	{
		id: "n5",
		lat: 51.51,
		lng: -.13,
		title: "Lloyd's war-risk surcharge raised on Hormuz calls",
		source: "Lloyd's List",
		severity: "HIGH",
		domain: "Energy",
		summary: "Direct transmission into dirty tanker TC rates."
	},
	{
		id: "n6",
		lat: 25.27,
		lng: 55.3,
		title: "Fujairah product stocks draw 1.4mb",
		source: "Vortexa",
		severity: "MEDIUM",
		domain: "Energy",
		summary: "East-of-Suez tightness, not a demand shock."
	},
	{
		id: "n7",
		lat: 39.9,
		lng: 116.4,
		title: "MOFCOM rare-earth license window delayed",
		source: "Caixin",
		severity: "HIGH",
		domain: "Commodities",
		summary: "NdPr chatter. Magnet-chain names to watch, not the index."
	},
	{
		id: "n8",
		lat: 48.86,
		lng: 2.35,
		title: "EDF flags two reactors offline extra 11 days",
		source: "RTE",
		severity: "LOW",
		domain: "Energy",
		summary: "French power curve bid; TTF second-order."
	},
	{
		id: "n9",
		lat: 40.67,
		lng: -74,
		title: "Gold ETF create 4.2t overnight",
		source: "GLD",
		severity: "MEDIUM",
		domain: "Commodities",
		summary: "Safe-haven bid, not jewelry. Cross-asset with DXY fade."
	},
	{
		id: "n10",
		lat: 1.29,
		lng: 103.85,
		title: "Malacca congestion index at 8-month high",
		source: "MPA",
		severity: "MEDIUM",
		domain: "Geopolitics",
		summary: "Boxships bunching. Not kinetic — weather + bunkering."
	},
	{
		id: "n11",
		lat: 35.68,
		lng: 139.69,
		title: "MoF unattributed yen bids flagged by desks",
		source: "Nikkei",
		severity: "MEDIUM",
		domain: "FX",
		summary: "Verbal, not intervention. USDJPY still offered above 150."
	},
	{
		id: "n12",
		lat: 52.23,
		lng: 21.01,
		title: "Poland requests additional Patriot rotation",
		source: "PAP",
		severity: "LOW",
		domain: "Geopolitics",
		summary: "Suwałki watch, not a tape-mover."
	},
	{
		id: "n13",
		lat: 29.76,
		lng: -95.37,
		title: "WTI crack spreads widen on product tightness",
		source: "Argus",
		severity: "MEDIUM",
		domain: "Energy",
		summary: "Refinery outages Gulf Coast more than geopolitics — for now."
	},
	{
		id: "n14",
		lat: 12.6,
		lng: 43.4,
		title: "Two product tankers alter course north of Bab el-Mandeb",
		source: "AIS desk",
		severity: "HIGH",
		domain: "Energy",
		summary: "Pattern matches last month's harassment cluster."
	},
	{
		id: "n15",
		lat: 41.9,
		lng: 12.5,
		title: "BTPs cheapen 6bp vs Bunds on budget chatter",
		source: "MTS",
		severity: "LOW",
		domain: "Rates",
		summary: "Local, not systemic. Watch if 10Y spread > 140."
	},
	{
		id: "n16",
		lat: -26.2,
		lng: 28.04,
		title: "Amplats furnace incident; PGMs spike",
		source: "company",
		severity: "MEDIUM",
		domain: "Commodities",
		summary: "Idiosyncratic supply. Not a SA risk story."
	},
	{
		id: "n17",
		lat: 55.75,
		lng: 37.62,
		title: "Finance ministry raises OFZ issuance this quarter",
		source: "MinFin",
		severity: "LOW",
		domain: "Macro",
		summary: "War-economy fiscal. Rub still a function of export receipts."
	},
	{
		id: "n18",
		lat: 37.57,
		lng: 126.98,
		title: "SK Hynix flags HBM allocations sold through 1H27",
		source: "company",
		severity: "INFO",
		domain: "Equities",
		summary: "AI capex still the equity overlay. Not geopolitics."
	}
];
function geoNews(asOf) {
	return NEWS_SEEDS.map((n, i) => ({
		...n,
		ts: asOf - (20 + i * 13) * 6e4
	}));
}
function liveStudios() {
	return [
		{
			id: "live-bbc",
			name: "BBC News",
			city: "London",
			lat: 51.51,
			lng: -.22,
			onAir: true,
			headline: "Hormuz: insurers raise war-risk"
		},
		{
			id: "live-cnn",
			name: "CNN",
			city: "Atlanta",
			lat: 33.75,
			lng: -84.39,
			onAir: true,
			headline: "Fed speakers lean cautious"
		},
		{
			id: "live-aj",
			name: "Al Jazeera",
			city: "Doha",
			lat: 25.29,
			lng: 51.53,
			onAir: true,
			headline: "IRGC drills — live pictures"
		},
		{
			id: "live-sky",
			name: "Sky News",
			city: "London",
			lat: 51.49,
			lng: -.14,
			onAir: true,
			headline: "Gilt selloff into the close"
		},
		{
			id: "live-cgtn",
			name: "CGTN",
			city: "Beijing",
			lat: 39.93,
			lng: 116.4,
			onAir: true,
			headline: "Strait patrols 'routine'"
		},
		{
			id: "live-f24",
			name: "France 24",
			city: "Paris",
			lat: 48.83,
			lng: 2.27,
			onAir: true,
			headline: "EMU industrial prints mix"
		},
		{
			id: "live-nhk",
			name: "NHK World",
			city: "Tokyo",
			lat: 35.66,
			lng: 139.7,
			onAir: true,
			headline: "Yen, intervention watch"
		},
		{
			id: "live-dw",
			name: "DW",
			city: "Berlin",
			lat: 52.51,
			lng: 13.39,
			onAir: false,
			headline: "Off-air — morning slot"
		}
	];
}
function tradeFlows() {
	return [
		{
			id: "tr-oil-me-asia",
			from: {
				name: "Ras Tanura",
				lat: 26.64,
				lng: 50.16
			},
			to: {
				name: "Ningbo",
				lat: 29.87,
				lng: 121.55
			},
			commodity: "Crude",
			usdBn: 118
		},
		{
			id: "tr-oil-me-eu",
			from: {
				name: "Ras Tanura",
				lat: 26.64,
				lng: 50.16
			},
			to: {
				name: "Rotterdam",
				lat: 51.95,
				lng: 4.14
			},
			commodity: "Crude",
			usdBn: 64
		},
		{
			id: "tr-lng-qa-eu",
			from: {
				name: "Ras Laffan",
				lat: 25.91,
				lng: 51.58
			},
			to: {
				name: "Zeebrugge",
				lat: 51.33,
				lng: 3.2
			},
			commodity: "LNG",
			usdBn: 22
		},
		{
			id: "tr-chip-tw-us",
			from: {
				name: "Hsinchu",
				lat: 24.81,
				lng: 120.97
			},
			to: {
				name: "Phoenix",
				lat: 33.45,
				lng: -112.07
			},
			commodity: "Semiconductors",
			usdBn: 86
		},
		{
			id: "tr-ore-au-cn",
			from: {
				name: "Port Hedland",
				lat: -20.31,
				lng: 118.58
			},
			to: {
				name: "Qingdao",
				lat: 36.07,
				lng: 120.38
			},
			commodity: "Iron ore",
			usdBn: 74
		},
		{
			id: "tr-soy-br-cn",
			from: {
				name: "Santos",
				lat: -23.96,
				lng: -46.33
			},
			to: {
				name: "Dalian",
				lat: 38.92,
				lng: 121.64
			},
			commodity: "Soy",
			usdBn: 31
		},
		{
			id: "tr-gas-no-de",
			from: {
				name: "Nyhamna",
				lat: 62.85,
				lng: 6.95
			},
			to: {
				name: "Emden",
				lat: 53.37,
				lng: 7.2
			},
			commodity: "Pipeline gas",
			usdBn: 28
		},
		{
			id: "tr-ree-cn-eu",
			from: {
				name: "Ganzhou",
				lat: 25.83,
				lng: 114.93
			},
			to: {
				name: "Hamburg",
				lat: 53.54,
				lng: 9.98
			},
			commodity: "Rare earths",
			usdBn: 9
		},
		{
			id: "tr-grain-ua-eg",
			from: {
				name: "Odesa",
				lat: 46.48,
				lng: 30.73
			},
			to: {
				name: "Alexandria",
				lat: 31.2,
				lng: 29.92
			},
			commodity: "Wheat",
			usdBn: 6
		},
		{
			id: "tr-lng-us-eu",
			from: {
				name: "Sabine Pass",
				lat: 29.73,
				lng: -93.87
			},
			to: {
				name: "Dunkerque",
				lat: 51.05,
				lng: 2.37
			},
			commodity: "LNG",
			usdBn: 19
		}
	];
}
var REF_POINTS = [
	{
		id: "c-ua",
		layer: "conflicts",
		name: "Ukraine war",
		lat: 48.4,
		lng: 37.8,
		note: "Active, industrial-scale",
		severity: "HIGH"
	},
	{
		id: "c-gaza",
		layer: "conflicts",
		name: "Gaza / Israel",
		lat: 31.5,
		lng: 34.45,
		note: "Active",
		severity: "HIGH"
	},
	{
		id: "c-sudan",
		layer: "conflicts",
		name: "Sudan civil war",
		lat: 15.5,
		lng: 32.5,
		note: "Active",
		severity: "MEDIUM"
	},
	{
		id: "c-mm",
		layer: "conflicts",
		name: "Myanmar",
		lat: 21.9,
		lng: 96.1,
		note: "Active",
		severity: "MEDIUM"
	},
	{
		id: "c-sahel",
		layer: "conflicts",
		name: "Sahel insurgency",
		lat: 16,
		lng: -2,
		note: "Active",
		severity: "MEDIUM"
	},
	{
		id: "c-ye",
		layer: "conflicts",
		name: "Yemen",
		lat: 15.3,
		lng: 44.2,
		note: "Active + Red Sea",
		severity: "HIGH"
	},
	{
		id: "b-diego",
		layer: "bases",
		name: "Diego Garcia",
		lat: -7.31,
		lng: 72.41,
		note: "US/UK bomber staging"
	},
	{
		id: "b-ramstein",
		layer: "bases",
		name: "Ramstein",
		lat: 49.44,
		lng: 7.6,
		note: "USAFE HQ"
	},
	{
		id: "b-incirlik",
		layer: "bases",
		name: "Incirlik",
		lat: 37,
		lng: 35.43,
		note: "US/TR, nuclear-capable"
	},
	{
		id: "b-yokosuka",
		layer: "bases",
		name: "Yokosuka",
		lat: 35.29,
		lng: 139.67,
		note: "US 7th Fleet"
	},
	{
		id: "b-djibouti",
		layer: "bases",
		name: "Camp Lemonnier",
		lat: 11.55,
		lng: 43.15,
		note: "US AFRICOM / Mandeb"
	},
	{
		id: "b-tartus",
		layer: "bases",
		name: "Tartus",
		lat: 34.9,
		lng: 35.87,
		note: "Russian navy"
	},
	{
		id: "b-aludeid",
		layer: "bases",
		name: "Al Udeid",
		lat: 25.12,
		lng: 51.31,
		note: "US CENTCOM"
	},
	{
		id: "b-andersen",
		layer: "bases",
		name: "Andersen AFB",
		lat: 13.58,
		lng: 144.93,
		note: "Guam bomber"
	},
	{
		id: "p-rotterdam",
		layer: "ports",
		name: "Rotterdam",
		lat: 51.95,
		lng: 4.14,
		note: "Europe's energy door"
	},
	{
		id: "p-singapore",
		layer: "ports",
		name: "Singapore",
		lat: 1.26,
		lng: 103.84,
		note: "Malacca / bunker"
	},
	{
		id: "p-shanghai",
		layer: "ports",
		name: "Shanghai",
		lat: 31.37,
		lng: 121.55,
		note: "Boxship #1"
	},
	{
		id: "p-houston",
		layer: "ports",
		name: "Houston",
		lat: 29.74,
		lng: -95.02,
		note: "US energy export"
	},
	{
		id: "p-fujairah",
		layer: "ports",
		name: "Fujairah",
		lat: 25.17,
		lng: 56.35,
		note: "East-of-Hormuz bunker"
	},
	{
		id: "p-ningbo",
		layer: "ports",
		name: "Ningbo-Zhoushan",
		lat: 29.87,
		lng: 121.55,
		note: "Crude / boxes"
	},
	{
		id: "w-hormuz",
		layer: "waterways",
		name: "Strait of Hormuz",
		lat: 26.57,
		lng: 56.25,
		note: "20mbpd chokepoint",
		severity: "CRITICAL"
	},
	{
		id: "w-suez",
		layer: "waterways",
		name: "Suez Canal",
		lat: 30.45,
		lng: 32.35,
		note: "12% world trade",
		severity: "HIGH"
	},
	{
		id: "w-malacca",
		layer: "waterways",
		name: "Malacca Strait",
		lat: 2.5,
		lng: 101.8,
		note: "25% world trade",
		severity: "HIGH"
	},
	{
		id: "w-mandeb",
		layer: "waterways",
		name: "Bab el-Mandeb",
		lat: 12.58,
		lng: 43.33,
		note: "Red Sea gate",
		severity: "HIGH"
	},
	{
		id: "w-panama",
		layer: "waterways",
		name: "Panama Canal",
		lat: 9.12,
		lng: -79.72,
		note: "Drought residual",
		severity: "MEDIUM"
	},
	{
		id: "w-bosporus",
		layer: "waterways",
		name: "Bosporus",
		lat: 41.12,
		lng: 29.07,
		note: "Grain / oil",
		severity: "MEDIUM"
	},
	{
		id: "w-taiwan",
		layer: "waterways",
		name: "Taiwan Strait",
		lat: 24.5,
		lng: 119.5,
		note: "Chips + PLA",
		severity: "HIGH"
	},
	{
		id: "a-dxb",
		layer: "airports",
		name: "DXB",
		lat: 25.25,
		lng: 55.36,
		note: "Regional hub"
	},
	{
		id: "a-lhr",
		layer: "airports",
		name: "LHR",
		lat: 51.47,
		lng: -.45,
		note: "Long-haul"
	},
	{
		id: "a-sin",
		layer: "airports",
		name: "SIN",
		lat: 1.36,
		lng: 103.99,
		note: "Asia node"
	},
	{
		id: "a-fra",
		layer: "airports",
		name: "FRA",
		lat: 50.04,
		lng: 8.56,
		note: "EU cargo"
	},
	{
		id: "pl-nord",
		layer: "pipelines",
		name: "Nord Stream",
		lat: 54.5,
		lng: 14,
		note: "Inactive / residual"
	},
	{
		id: "pl-druzhba",
		layer: "pipelines",
		name: "Druzhba",
		lat: 51,
		lng: 24,
		note: "RU → EU crude"
	},
	{
		id: "pl-tap",
		layer: "pipelines",
		name: "TAP",
		lat: 40.5,
		lng: 19.5,
		note: "Caspian gas to EU"
	},
	{
		id: "pl-cpc",
		layer: "pipelines",
		name: "CPC",
		lat: 44.7,
		lng: 37.8,
		note: "Kazakh crude to Black Sea"
	},
	{
		id: "pl-espo",
		layer: "pipelines",
		name: "ESPO",
		lat: 55,
		lng: 124,
		note: "RU crude to China"
	},
	{
		id: "cb-marea",
		layer: "cables",
		name: "MAREA",
		lat: 39,
		lng: -30,
		note: "US–ES, 160Tbps class"
	},
	{
		id: "cb-2afr",
		layer: "cables",
		name: "2Africa",
		lat: 0,
		lng: 10,
		note: "Africa ring"
	},
	{
		id: "cb-seamewe",
		layer: "cables",
		name: "SEA-ME-WE 5",
		lat: 15,
		lng: 65,
		note: "Europe–Asia"
	},
	{
		id: "cb-sjc",
		layer: "cables",
		name: "SJC2",
		lat: 18,
		lng: 118,
		note: "SE Asia–Japan"
	},
	{
		id: "nu-natanz",
		layer: "nuclear",
		name: "Natanz",
		lat: 33.72,
		lng: 51.73,
		note: "Enrichment",
		severity: "HIGH"
	},
	{
		id: "nu-fordow",
		layer: "nuclear",
		name: "Fordow",
		lat: 34.88,
		lng: 50.99,
		note: "Fordow FC",
		severity: "HIGH"
	},
	{
		id: "nu-yong",
		layer: "nuclear",
		name: "Yongbyon",
		lat: 39.8,
		lng: 125.75,
		note: "DPRK",
		severity: "MEDIUM"
	},
	{
		id: "nu-dimona",
		layer: "nuclear",
		name: "Dimona",
		lat: 31,
		lng: 35.15,
		note: "Israel complex"
	},
	{
		id: "nu-zapo",
		layer: "nuclear",
		name: "Zaporizhzhia",
		lat: 47.51,
		lng: 34.59,
		note: "Occupied NPP",
		severity: "HIGH"
	},
	{
		id: "nu-bushehr",
		layer: "nuclear",
		name: "Bushehr",
		lat: 28.83,
		lng: 50.89,
		note: "Power reactor"
	},
	{
		id: "gpu-iad",
		layer: "gpu",
		name: "N. Virginia",
		lat: 39,
		lng: -77.5,
		note: "Largest AI cluster"
	},
	{
		id: "gpu-dal",
		layer: "gpu",
		name: "Dallas–Fort Worth",
		lat: 32.9,
		lng: -97,
		note: "Power-constrained"
	},
	{
		id: "gpu-dub",
		layer: "gpu",
		name: "Dublin",
		lat: 53.33,
		lng: -6.4,
		note: "EU training"
	},
	{
		id: "gpu-sin",
		layer: "gpu",
		name: "Singapore / Johor",
		lat: 1.4,
		lng: 103.9,
		note: "SE Asia inference"
	},
	{
		id: "gpu-ice",
		layer: "gpu",
		name: "Iceland",
		lat: 64.1,
		lng: -21.9,
		note: "Hydro / cool"
	},
	{
		id: "fin-nyc",
		layer: "finance",
		name: "New York",
		lat: 40.7,
		lng: -74,
		note: "USD / equities"
	},
	{
		id: "fin-lon",
		layer: "finance",
		name: "London",
		lat: 51.51,
		lng: -.09,
		note: "FX / metals"
	},
	{
		id: "fin-hk",
		layer: "finance",
		name: "Hong Kong",
		lat: 22.28,
		lng: 114.16,
		note: "CNH"
	},
	{
		id: "fin-sg",
		layer: "finance",
		name: "Singapore",
		lat: 1.28,
		lng: 103.85,
		note: "Asia dollar"
	},
	{
		id: "fin-fra",
		layer: "finance",
		name: "Frankfurt",
		lat: 50.11,
		lng: 8.68,
		note: "ECB / Bunds"
	},
	{
		id: "fin-tyo",
		layer: "finance",
		name: "Tokyo",
		lat: 35.68,
		lng: 139.77,
		note: "JGB / yen"
	},
	{
		id: "fin-zur",
		layer: "finance",
		name: "Zurich",
		lat: 47.37,
		lng: 8.54,
		note: "Wealth / CH"
	},
	{
		id: "ir-oak",
		layer: "irradiators",
		name: "Oak Ridge",
		lat: 35.93,
		lng: -84.31,
		note: "Isotope / research"
	},
	{
		id: "ir-saclay",
		layer: "irradiators",
		name: "Saclay",
		lat: 48.73,
		lng: 2.15,
		note: "CEA"
	},
	{
		id: "ir-mayak",
		layer: "irradiators",
		name: "Mayak",
		lat: 55.7,
		lng: 60.8,
		note: "RU complex"
	}
];
var REF_SECTIONS = [
	{
		section: "Military",
		layers: [{
			id: "conflicts",
			label: "Conflicts"
		}, {
			id: "bases",
			label: "Bases"
		}]
	},
	{
		section: "Infra",
		layers: [
			{
				id: "ports",
				label: "Ports"
			},
			{
				id: "waterways",
				label: "Waterways"
			},
			{
				id: "airports",
				label: "Airports"
			},
			{
				id: "pipelines",
				label: "Pipelines"
			},
			{
				id: "cables",
				label: "Cables"
			}
		]
	},
	{
		section: "Strategic",
		layers: [
			{
				id: "nuclear",
				label: "Nuclear"
			},
			{
				id: "gpu",
				label: "GPU / AI"
			},
			{
				id: "finance",
				label: "Finance"
			},
			{
				id: "irradiators",
				label: "Irradiators"
			}
		]
	}
];
var POP_CITIES = [
	{
		name: "Tokyo",
		lat: 35.68,
		lng: 139.69,
		popM: 37
	},
	{
		name: "Delhi",
		lat: 28.61,
		lng: 77.21,
		popM: 32
	},
	{
		name: "Shanghai",
		lat: 31.23,
		lng: 121.47,
		popM: 29
	},
	{
		name: "São Paulo",
		lat: -23.55,
		lng: -46.63,
		popM: 22
	},
	{
		name: "Mexico City",
		lat: 19.43,
		lng: -99.13,
		popM: 22
	},
	{
		name: "Cairo",
		lat: 30.04,
		lng: 31.24,
		popM: 22
	},
	{
		name: "Dhaka",
		lat: 23.81,
		lng: 90.41,
		popM: 22
	},
	{
		name: "Beijing",
		lat: 39.9,
		lng: 116.4,
		popM: 21
	},
	{
		name: "Mumbai",
		lat: 19.08,
		lng: 72.88,
		popM: 21
	},
	{
		name: "Osaka",
		lat: 34.69,
		lng: 135.5,
		popM: 19
	},
	{
		name: "NYC",
		lat: 40.71,
		lng: -74,
		popM: 19
	},
	{
		name: "Karachi",
		lat: 24.86,
		lng: 67.01,
		popM: 17
	},
	{
		name: "Buenos Aires",
		lat: -34.6,
		lng: -58.38,
		popM: 15
	},
	{
		name: "Chongqing",
		lat: 29.56,
		lng: 106.55,
		popM: 17
	},
	{
		name: "Istanbul",
		lat: 41.01,
		lng: 28.98,
		popM: 16
	},
	{
		name: "Lagos",
		lat: 6.52,
		lng: 3.38,
		popM: 16
	},
	{
		name: "Manila",
		lat: 14.6,
		lng: 120.98,
		popM: 14
	},
	{
		name: "Rio",
		lat: -22.91,
		lng: -43.17,
		popM: 13
	},
	{
		name: "Lahore",
		lat: 31.52,
		lng: 74.36,
		popM: 13
	},
	{
		name: "Paris",
		lat: 48.86,
		lng: 2.35,
		popM: 11
	},
	{
		name: "London",
		lat: 51.51,
		lng: -.13,
		popM: 11
	},
	{
		name: "Lima",
		lat: -12.05,
		lng: -77.04,
		popM: 11
	},
	{
		name: "Bangkok",
		lat: 13.76,
		lng: 100.5,
		popM: 11
	},
	{
		name: "Tehran",
		lat: 35.69,
		lng: 51.39,
		popM: 9
	}
];
function verdictOf(overall) {
	const a = Math.abs(overall);
	if (a >= 70) return "EXTREME";
	if (a >= 45) return "STRONG";
	if (a >= 25) return "MODERATE";
	if (a >= 10) return "MILD";
	return "NEUTRAL";
}
var TREND_UNIVERSE = [
	{
		symbol: "EURUSD",
		name: "Euro",
		assetClass: "FX",
		bias: -8
	},
	{
		symbol: "USDJPY",
		name: "Dollar-yen",
		assetClass: "FX",
		bias: 12
	},
	{
		symbol: "GBPUSD",
		name: "Sterling",
		assetClass: "FX",
		bias: -4
	},
	{
		symbol: "USDCHF",
		name: "Dollar-swiss",
		assetClass: "FX",
		bias: 6
	},
	{
		symbol: "AUDUSD",
		name: "Aussie",
		assetClass: "FX",
		bias: -10
	},
	{
		symbol: "USDCAD",
		name: "Dollar-cad",
		assetClass: "FX",
		bias: 8
	},
	{
		symbol: "NZDUSD",
		name: "Kiwi",
		assetClass: "FX",
		bias: -6
	},
	{
		symbol: "USDTRY",
		name: "Dollar-lira",
		assetClass: "FX",
		bias: 22
	},
	{
		symbol: "SPX",
		name: "S&P 500",
		assetClass: "Index",
		bias: 6
	},
	{
		symbol: "NDX",
		name: "Nasdaq 100",
		assetClass: "Index",
		bias: 10
	},
	{
		symbol: "DAX",
		name: "DAX",
		assetClass: "Index",
		bias: -4
	},
	{
		symbol: "NKY",
		name: "Nikkei",
		assetClass: "Index",
		bias: 8
	},
	{
		symbol: "HSI",
		name: "Hang Seng",
		assetClass: "Index",
		bias: -12
	},
	{
		symbol: "STOXX",
		name: "Euro Stoxx 50",
		assetClass: "Index",
		bias: -2
	},
	{
		symbol: "WTI",
		name: "WTI crude",
		assetClass: "Energy",
		bias: 38
	},
	{
		symbol: "BRENT",
		name: "Brent",
		assetClass: "Energy",
		bias: 36
	},
	{
		symbol: "NATGAS",
		name: "Henry Hub",
		assetClass: "Energy",
		bias: -14
	},
	{
		symbol: "GASOIL",
		name: "Gasoil",
		assetClass: "Energy",
		bias: 28
	},
	{
		symbol: "XAU",
		name: "Gold",
		assetClass: "Metals",
		bias: 32
	},
	{
		symbol: "XAG",
		name: "Silver",
		assetClass: "Metals",
		bias: 18
	},
	{
		symbol: "HG",
		name: "Copper",
		assetClass: "Metals",
		bias: 8
	},
	{
		symbol: "PL",
		name: "Platinum",
		assetClass: "Metals",
		bias: 14
	},
	{
		symbol: "US10Y",
		name: "UST 10Y yield",
		assetClass: "Rates",
		bias: 10
	},
	{
		symbol: "US2Y",
		name: "UST 2Y yield",
		assetClass: "Rates",
		bias: 4
	},
	{
		symbol: "DE10Y",
		name: "Bund 10Y",
		assetClass: "Rates",
		bias: 6
	},
	{
		symbol: "C",
		name: "Corn",
		assetClass: "Ags",
		bias: -8
	},
	{
		symbol: "W",
		name: "Wheat",
		assetClass: "Ags",
		bias: 6
	},
	{
		symbol: "S",
		name: "Soy",
		assetClass: "Ags",
		bias: -2
	},
	{
		symbol: "BTC",
		name: "Bitcoin",
		assetClass: "Crypto",
		bias: 4
	},
	{
		symbol: "ETH",
		name: "Ether",
		assetClass: "Crypto",
		bias: 2
	},
	{
		symbol: "HYG",
		name: "HY credit",
		assetClass: "Credit",
		bias: -6
	},
	{
		symbol: "LQD",
		name: "IG credit",
		assetClass: "Credit",
		bias: -2
	},
	{
		symbol: "BBDXY",
		name: "Bloomberg dollar",
		assetClass: "FX",
		bias: 8
	},
	{
		symbol: "DXY",
		name: "ICE DXY",
		assetClass: "FX",
		bias: 6
	},
	{
		symbol: "SOFR",
		name: "SOFR",
		assetClass: "Rates",
		bias: -4
	}
];
function trendMatrix(asOf, weights = {
	macro: 30,
	pos: 25,
	risk: 20,
	flow: 25
}) {
	const px = ticker(asOf);
	const wsum = weights.macro + weights.pos + weights.risk + weights.flow || 1;
	return TREND_UNIVERSE.map((a) => {
		const r = mulberry32(hashStr(a.symbol) ^ dayKey(asOf));
		const macro = clamp(a.bias * .4 + (r() - .5) * 50, -100, 100);
		const pos = clamp(a.bias * .2 + (r() - .5) * 70, -100, 100);
		const risk = clamp(-a.bias * .15 + (r() - .5) * 40, -100, 100);
		const flow = clamp(a.bias * .5 + (r() - .5) * 55, -100, 100);
		const overall = (macro * weights.macro + pos * weights.pos + risk * weights.risk + flow * weights.flow) / wsum;
		const t = px.find((p) => p.pair === a.symbol);
		const drivers = [
			macro > 20 ? "macro tailwind" : macro < -20 ? "macro drag" : "macro mixed",
			pos > 40 ? "crowded long" : pos < -40 ? "crowded short" : "positioning mid",
			flow > 20 ? "flow with" : "flow fading"
		];
		return {
			symbol: a.symbol,
			name: a.name,
			assetClass: a.assetClass,
			last: t?.px ?? +(50 + r() * 50).toFixed(2),
			chg: t?.chg ?? +((r() - .5) * 2).toFixed(2),
			overall: +overall.toFixed(1),
			macro: +macro.toFixed(1),
			pos: +pos.toFixed(1),
			risk: +risk.toFixed(1),
			flow: +flow.toFixed(1),
			verdict: verdictOf(overall),
			crowding: +clamp(Math.abs(pos), 0, 100).toFixed(0),
			regimeP: +clamp(55 + overall * .25 + (r() - .5) * 10, 5, 95).toFixed(0),
			drivers
		};
	}).sort((a, b) => Math.abs(b.overall) - Math.abs(a.overall));
}
function globalRegime(rows) {
	const eq = rows.filter((r) => r.assetClass === "Index");
	const avg = eq.reduce((s, r) => s + r.overall, 0) / Math.max(1, eq.length);
	if (avg > 12) return "RISK-ON";
	if (avg < -12) return "RISK-OFF";
	return "BALANCED";
}
function trendHistory(symbol, asOf) {
	return series(`trend-${symbol}`, 90, 0, 8, asOf).map((v, i) => ({
		d: i,
		v: clamp(v, -100, 100)
	}));
}
function pmMarkets(asOf) {
	return [
		{
			id: "pm-iran",
			title: "Iran kinetic event vs US/Israel assets, 2026",
			category: "Geopolitics",
			prob: .31
		},
		{
			id: "pm-hormuz",
			title: "Hormuz fully closed ≥7 days this year",
			category: "Geopolitics",
			prob: .12
		},
		{
			id: "pm-tw",
			title: "China blockade of Taiwan by Dec 2026",
			category: "Geopolitics",
			prob: .08
		},
		{
			id: "pm-fed",
			title: "Fed cuts ≥50bp by year-end",
			category: "Macro",
			prob: .41
		},
		{
			id: "pm-ua",
			title: "Ukraine ceasefire by March 2027",
			category: "Geopolitics",
			prob: .27
		},
		{
			id: "pm-oil",
			title: "WTI above $100 before 2027",
			category: "Energy",
			prob: .29
		},
		{
			id: "pm-xi",
			title: "Xi remains CCP General Secretary through 2027",
			category: "Geopolitics",
			prob: .86
		},
		{
			id: "pm-ecb",
			title: "ECB on hold through Q1 2027",
			category: "Macro",
			prob: .48
		},
		{
			id: "pm-gold",
			title: "Gold prints $3,000 in 2026",
			category: "Commodities",
			prob: .37
		},
		{
			id: "pm-sk",
			title: "DPRK nuclear test before 2027",
			category: "Geopolitics",
			prob: .22
		},
		{
			id: "pm-suez",
			title: "Suez transit <50% of 2023 run-rate, Q4",
			category: "Trade",
			prob: .34
		},
		{
			id: "pm-ai",
			title: "NVIDIA still #1 GPU vendor by rev, 2027",
			category: "Tech",
			prob: .72
		},
		{
			id: "pm-uk",
			title: "UK general election called by Jun 2027",
			category: "Politics",
			prob: .19
		},
		{
			id: "pm-btc",
			title: "BTC above $80k in 2026",
			category: "Crypto",
			prob: .33
		},
		{
			id: "pm-opec",
			title: "OPEC+ unwind remaining cuts in 2026",
			category: "Energy",
			prob: .24
		},
		{
			id: "pm-re",
			title: "China rare-earth export licenses stay tight through Q4",
			category: "Commodities",
			prob: .61
		}
	].map((s) => {
		const r = mulberry32(hashStr(s.id) ^ dayKey(asOf));
		const spark = series(s.id, 30, s.prob * 100, 3, asOf).map((v) => clamp(v, 1, 99));
		const d1 = (r() - .5) * 4;
		const d4 = (r() - .5) * 6;
		const d24 = (r() - .45) * 8;
		const d7 = (r() - .5) * 14;
		return {
			...s,
			prob: +(s.prob + d24 / 400).toFixed(3),
			delta1h: +d1.toFixed(1),
			delta4h: +d4.toFixed(1),
			delta24h: +d24.toFixed(1),
			delta7d: +d7.toFixed(1),
			volume: +(3 + r() * 48).toFixed(1),
			oi: +(8 + r() * 90).toFixed(1),
			spark,
			issues: [{
				name: "Yes",
				prob: s.prob
			}, {
				name: "No",
				prob: 1 - s.prob
			}],
			volRatio: +(.7 + r() * 1.6).toFixed(2),
			realizedVol: +(4 + r() * 18).toFixed(1),
			whaleNet: +((r() - .5) * 6).toFixed(2)
		};
	});
}
var MICRO_ASSETS = [
	"EUR",
	"JPY",
	"GBP",
	"AUD",
	"CAD",
	"NZD",
	"CHF",
	"MXN",
	"SPX",
	"NDX",
	"DAX",
	"NKY",
	"HSI",
	"STOXX",
	"UKX",
	"ES",
	"WTI",
	"BRENT",
	"NG",
	"GASOIL",
	"HO",
	"RB",
	"XAU",
	"XAG",
	"HG",
	"PL",
	"PA",
	"AL",
	"US10Y",
	"US2Y",
	"DE10Y",
	"GB10Y",
	"JP10Y",
	"BTC",
	"ETH",
	"SOL",
	"HYG",
	"LQD",
	"EMB",
	"W",
	"C",
	"S",
	"KC",
	"CT"
];
function microHeat(asOf) {
	return MICRO_ASSETS.map((s) => {
		return {
			s,
			vol: +((mulberry32(hashStr(`mh-${s}`) ^ dayKey(asOf))() - .35) * 2).toFixed(2)
		};
	});
}
function leadLag(asOf) {
	return [
		{
			a: "WTI",
			b: "CAD"
		},
		{
			a: "XAU",
			b: "USDCHF"
		},
		{
			a: "NDX",
			b: "USDJPY"
		},
		{
			a: "US10Y",
			b: "SPX"
		},
		{
			a: "DXY",
			b: "XAU"
		},
		{
			a: "WTI",
			b: "USDCAD"
		},
		{
			a: "HSI",
			b: "AUD"
		},
		{
			a: "BTC",
			b: "NDX"
		},
		{
			a: "NG",
			b: "EUR"
		},
		{
			a: "HG",
			b: "AUD"
		}
	].map((p) => {
		const r = mulberry32(hashStr(p.a + p.b) ^ dayKey(asOf));
		return {
			...p,
			lagMin: Math.floor(r() * 40) * 5,
			corr: +((r() - .2) * .9).toFixed(2),
			lead: r() > .5 ? p.a : p.b
		};
	});
}
function fxBoard(asOf) {
	const pairs = [
		"EURUSD",
		"USDJPY",
		"GBPUSD",
		"USDCHF",
		"AUDUSD",
		"USDCAD",
		"NZDUSD",
		"USDMXN",
		"USDCNH"
	];
	const rows = ticker(asOf);
	return pairs.map((p) => {
		const t = rows.find((x) => x.pair === p);
		const r = mulberry32(hashStr(`fx-${p}`) ^ dayKey(asOf));
		const signal = r() > .66 ? "LONG" : r() > .33 ? "FLAT" : "SHORT";
		return {
			pair: p,
			px: t?.px ?? 0,
			chg: t?.chg ?? 0,
			signal,
			score: +((r() - .5) * 80).toFixed(0),
			carry: +((r() - .4) * 4).toFixed(2),
			cross: r() > .5 ? "with BBDXY" : "vs oil"
		};
	});
}
function newsFeed(asOf) {
	return geoNews(asOf);
}
function anomalies(asOf) {
	return [
		{
			id: "an-1",
			title: "Hormuz AIS velocity z = −2.4",
			body: "Multivariate isolation: speed + density + heading entropy. Auto-pushed to ZONE.",
			severity: "CRITICAL",
			href: "/?sel=zone:zone-hormuz"
		},
		{
			id: "an-2",
			title: "MXN COT percentile 4th — reversal cluster",
			body: "Crowding + velocity sign-flip. Open COT.",
			severity: "HIGH",
			href: "/cot"
		},
		{
			id: "an-3",
			title: "PLA ADIZ transits z = +2.1 vs 90d",
			body: "Count anomaly, not a new ZONE. Desk already covering.",
			severity: "MEDIUM",
			href: "/?sel=zone:zone-taiwan"
		}
	].map((a, i) => ({
		...a,
		ts: asOf - (i * 17 + 8) * 6e4
	}));
}
//#endregion
export { tradeFlows as _, flights as a, zones as b, globalRegime as c, microHeat as d, newsFeed as f, ships as g, quakes as h, anomalies as i, leadLag as l, pmMarkets as m, REF_POINTS as n, fxBoard as o, pmGeos as p, REF_SECTIONS as r, geoNews as s, POP_CITIES as t, liveStudios as u, trendHistory as v, trendMatrix as y };
