//#region src/data/bank-sources.ts
var BANK_SOURCES = [
	{
		id: "ing-fx-talk",
		house: "ING",
		kind: "IB",
		desk: "FX",
		title: "FX Talking — soft landing or recession",
		href: "https://think.ing.com/reports/fx-talking-soft-landing-or-recession-report/",
		note: "Flagship FX Talking. Free on ING Think; PDF of the September 2024 issue is also linked."
	},
	{
		id: "ing-portal",
		house: "ING",
		kind: "IB",
		desk: "All",
		title: "ING Research portal",
		href: "https://research.ing.com/portal/ING_Research.html",
		note: "House portal. Daily FX/rates notes sit under Global Markets."
	},
	{
		id: "ing-fx-pdf",
		house: "ING",
		kind: "IB",
		desk: "FX",
		title: "FX Talking (PDF, Sep 2024)",
		href: "https://think.ing.com/uploads/reports/FX_Talking_September_2024.pdf",
		note: "Direct PDF. Use as a template for the monthly cross-asset FX pack."
	},
	{
		id: "citi-fx",
		house: "Citi",
		kind: "Commercial",
		desk: "FX",
		title: "Citigold FX insights",
		href: "https://www.citibank.com.hk/english/wealth-management/citigold/insights/foreign-exchange/",
		note: "Wealth-channel FX. Not the institutional Citi GPS feed."
	},
	{
		id: "citi-fx-pdf",
		house: "Citi",
		kind: "Commercial",
		desk: "FX",
		title: "Citi FX insight (PDF)",
		href: "https://www.citibank.com.hk/global_docs/mobile/investment/pdf/fx_insight_e.pdf",
		note: "Mobile/wealth PDF. Pair with the HTML insights page."
	},
	{
		id: "scotia-fx",
		house: "Scotiabank",
		kind: "IB",
		desk: "FX",
		title: "Global foreign exchange",
		href: "https://www.gbm.scotiabank.com/en/market-insights/global-foreign-exchange.html",
		note: "GBM market insights. Daily FX plus LatAm/CAD specialty."
	},
	{
		id: "ubs-cio",
		house: "UBS",
		kind: "IB",
		desk: "All",
		title: "CIO House View — daily",
		href: "https://www.ubs.com/global/en/wealth-management/insights/chief-investment-office/house-view/daily/2023/latest-27092023.html",
		note: "Wealth CIO daily. Dated landing; navigate to latest from the House View hub."
	},
	{
		id: "ocbc-fx",
		house: "OCBC",
		kind: "Commercial",
		desk: "FX",
		title: "FX & rates research",
		href: "https://www.ocbc.com/group/research/research-with-filter.page?category=fxandrates",
		note: "Asia G10 + AXJ. Filter is pre-set to FX and rates."
	},
	{
		id: "danske-article",
		house: "Danske Bank",
		kind: "IB",
		desk: "FX",
		title: "FX Strategy article",
		href: "https://research.danskebank.com/research/#/Research/article/aa64c35a-8d01-4b2f-8a68-b09d686adf17/EN",
		note: "Single-article permalink. Use the list below for the full FX Strategy stack."
	},
	{
		id: "danske-list",
		house: "Danske Bank",
		kind: "IB",
		desk: "FX",
		title: "FX Strategy article list",
		href: "https://research.danskebank.com/research/#/Research/articlelist/FX-Strategy",
		note: "Daily/weekly FX Strategy. Best Danske entry point."
	},
	{
		id: "danske-preview",
		house: "Danske Bank",
		kind: "IB",
		desk: "FX",
		title: "FX Strategy preview",
		href: "https://research.danskebank.com/research/#/Research/articlepreview/5e382d60-fbca-4e95-9244-c8700b67767c/EN",
		note: "Preview card of a Strategy note."
	},
	{
		id: "mufg-fx",
		house: "MUFG",
		kind: "IB",
		desk: "FX",
		title: "MUFG FX research",
		href: "https://www.mufgresearch.com/fx/",
		note: "Tokyo/London FX. Strong JPY and Asia flow colour."
	},
	{
		id: "nbk",
		house: "NBK",
		kind: "Regional",
		desk: "Macro",
		title: "Economic research",
		href: "https://www.nbk.com/news-and-insights/economic-reports/economic-research.html",
		note: "Kuwait / GCC macro. Oil-fiscal and KWD peg context."
	},
	{
		id: "uob",
		house: "UOB",
		kind: "Commercial",
		desk: "All",
		title: "UOB research",
		href: "https://www.uobgroup.com/research/index.page",
		note: "Daily FX/rates plus ASEAN macro. Open access on most notes."
	},
	{
		id: "anz",
		house: "ANZ",
		kind: "IB",
		desk: "Macro",
		title: "Data Wrap",
		href: "https://www.anz.co.nz/about-us/economic-markets-research/data-wrap/",
		note: "ANZ NZ Data Wrap. AU/NZ rates and AUD crosses."
	},
	{
		id: "dbs",
		house: "DBS",
		kind: "Commercial",
		desk: "Macro",
		title: "DBS Treasures economics",
		href: "https://www.dbs.com.sg/treasures/aics/economics/index.page",
		note: "AICS economics. SGD NEER and Asia credit overlap."
	},
	{
		id: "mizuho",
		house: "Mizuho",
		kind: "IB",
		desk: "All",
		title: "Market outlooks",
		href: "https://www.mizuhogroup.com/bank/insights/information?tab=market-outlooks",
		note: "Tab pre-selected to market outlooks. JPY rates/FX."
	},
	{
		id: "sucden",
		house: "Sucden Financial",
		kind: "Broker",
		desk: "FX",
		title: "Daily FX analysis",
		href: "https://www.sucdenfinancial.com/en/market-insights/fx-outlook/daily-fx-analysis/2023-08-31/",
		note: "Broker daily. Dated example — click through to the latest from FX outlook."
	},
	{
		id: "fxdaily",
		house: "FX Daily Report",
		kind: "Broker",
		desk: "Metals",
		title: "Gold needs a safe-haven bid",
		href: "https://fxdailyreport.com/gold-needs-a-safe-haven-bid-for-the-year-end-boost/",
		note: "Independent tape. Useful colour, not a house view."
	}
];
var BANK_NOTES = [
	{
		id: "n-ing",
		house: "ING",
		date: "19 Sep",
		tag: "FX",
		title: "Dollar: the 2026 weights are the story, not the smile",
		body: "BBDXY’s Jun-2026 rebalance lifted MXN/CAD and capped CNH at 7. ICE DXY still talks EUR. If you hedge ‘the dollar’ with DXY you are short a 1973 basket. We stay with BBDXY for trade-weighted USD and DXY only as the futures overlay.",
		href: "https://think.ing.com/reports/fx-talking-soft-landing-or-recession-report/"
	},
	{
		id: "n-danske",
		house: "Danske",
		date: "18 Sep",
		tag: "STIR",
		title: "Whites are pricing cuts the funds rate has not earned",
		body: "SFRZ6–SFRU6 is a cut strip, not a data strip. Payrolls still have veto power. We would rather sell the 2nd white vs funds than chase EURUSD on the same view.",
		href: "https://research.danskebank.com/research/#/Research/articlelist/FX-Strategy"
	},
	{
		id: "n-mufg",
		house: "MUFG",
		date: "18 Sep",
		tag: "JPY",
		title: "USDJPY is the rate gap until it is MoF",
		body: "US–JP 10Y still explains the level. Verbal intervention is a pin, not a trend. COT leveraged-money on JPY is not extreme enough to be the fade.",
		href: "https://www.mufgresearch.com/fx/"
	},
	{
		id: "n-scotia",
		house: "Scotiabank",
		date: "17 Sep",
		tag: "MXN",
		title: "Carry is the identity — positioning is the risk",
		body: "USDMXN TFF: lev-funds at the short-MXN extreme. The carry still pays. We would rather be late than the last in. Banxico hold is in the forward, not a surprise.",
		href: "https://www.gbm.scotiabank.com/en/market-insights/global-foreign-exchange.html"
	},
	{
		id: "n-ubs",
		house: "UBS CIO",
		date: "17 Sep",
		tag: "All",
		title: "House view: stay long quality, own the gold overlay",
		body: "Equities can grind with a Fed that cuts into an expansion. The hedge that still works in this mix is gold, not duration. 10s30s is the US rates expression, not 2s.",
		href: "https://www.ubs.com/global/en/wealth-management/insights/chief-investment-office/house-view/daily/2023/latest-27092023.html"
	},
	{
		id: "n-ocbc",
		house: "OCBC",
		date: "16 Sep",
		tag: "AXJ",
		title: "CNH cap in BBDXY is a feature",
		body: "A 7% CNH weight is a policy number. It understates the true dollar-bloc for Asian importers. SGD NEER remains the cleaner regional dollar proxy than USDCNH.",
		href: "https://www.ocbc.com/group/research/research-with-filter.page?category=fxandrates"
	},
	{
		id: "n-uob",
		house: "UOB",
		date: "16 Sep",
		tag: "Asia",
		title: "Asia FX: fade the crowded high-yielder, not the low-beta",
		body: "KRW and INR are in the BBDXY basket now at 3%+ each. That is a Bloomberg fact, not a flow forecast. We watch USDKRW through the Seoul fix, not through DXY.",
		href: "https://www.uobgroup.com/research/index.page"
	},
	{
		id: "n-sucden",
		house: "Sucden",
		date: "15 Sep",
		tag: "Gold",
		title: "Gold still needs the bid, not the narrative",
		body: "Real 10s are not collapsing and gold is bid anyway — the 2022 template is stale. Year-end needs a genuine haven bid or the seasonal tail does not pay.",
		href: "https://fxdailyreport.com/gold-needs-a-safe-haven-bid-for-the-year-end-boost/"
	},
	{
		id: "n-anz",
		house: "ANZ",
		date: "15 Sep",
		tag: "AUD",
		title: "Data Wrap: labour still the AUD veto",
		body: "China impulse is the beta, labour is the veto. We would not pre-empt RBA on the whites. AUDUSD COT is not yet a crowding event.",
		href: "https://www.anz.co.nz/about-us/economic-markets-research/data-wrap/"
	},
	{
		id: "n-dbs",
		house: "DBS",
		date: "14 Sep",
		tag: "SGD",
		title: "NEER in the upper half — no hurry to chase USDSGD",
		body: "MAS slope is the policy, not the level of USDSGD. Treat SGD as the Asia dollar, not as a G10 cousin of AUD.",
		href: "https://www.dbs.com.sg/treasures/aics/economics/index.page"
	},
	{
		id: "n-mizuho",
		house: "Mizuho",
		date: "14 Sep",
		tag: "Rates",
		title: "BoJ is a path, not a meeting",
		body: "TONA whites are barely pricing hikes. That is consistent with MoF’s USDJPY pin. We own the US–JP 10Y gap, not a BoJ surprise.",
		href: "https://www.mizuhogroup.com/bank/insights/information?tab=market-outlooks"
	},
	{
		id: "n-nbk",
		house: "NBK",
		date: "12 Sep",
		tag: "Oil",
		title: "GCC fiscal breakeven still sits under the Hormuz premium",
		body: "A $80s WTI funds the Gulf. The option is the strait, not OPEC spare. KWD peg keeps local rates as a Fed story.",
		href: "https://www.nbk.com/news-and-insights/economic-reports/economic-research.html"
	}
];
//#endregion
export { BANK_SOURCES as n, BANK_NOTES as t };
