//#region node_modules/.nitro/vite/services/ssr/assets/methodology-DOqfsOFU.js
var MODEL_VERSION = "2026.10.1";
var MODEL_UPDATED = "16 Oct 2026";
var METHODOLOGY = [
	{
		id: "trend",
		name: "Trend matrix",
		lookback: "90 sessions (scores), 3y (z-score universe)",
		sources: "Macro prints, CFTC TFF (quantdesk), cross-asset vol, ETF/futures flow",
		formula: "Overall = wM·MACRO + wP·POS + wR·RISK + wF·FLOW, weights default 0.30 / 0.25 / 0.20 / 0.25, user-overridable, renormalized.",
		notes: "Each factor is a z-score clipped at ±3 then scaled to −100/+100. Verdict bands: 10 / 25 / 45 / 70. Regime probability is a two-state HMM on the index complex (risk-on vs risk-off), not a call."
	},
	{
		id: "cot",
		name: "Commitments of Traders (TFF)",
		lookback: "156 weeks (Williams index & z-score), 1–5Y chart",
		sources: "CFTC Traders in Financial Futures — synthetic in this sandbox (quantdesk/cot.py)",
		formula: "net_k = (long_k − short_k)/OI × 100; net_cot = net_lf − net_dealer; idx = Williams (x−min)/(max−min) over 156w; z over 156w; d4/d13 diffs; lf_am_div = z_lf − z_am. Extreme signal ±1 at idx ≥0.85 / ≤0.15, contrarian.",
		notes: "Timing: Tuesday positions, Friday 15:30 ET release (release_lag=3), default exec_lag=2 (Monday close). Using Tuesday to trade Tuesday is a 3-day look-ahead. Crypto is CME futures only. Source flag is always 'synthetic' here."
	},
	{
		id: "dxy",
		name: "Dollar indices",
		lookback: "Spot, hourly seed",
		sources: "ICE DXY published factor; BBDXY 2026 target weights (effective after close 30 Jun 2026)",
		formula: "ICE DXY = 50.14348112 · EURUSD^-0.576 · USDJPY^0.136 · GBPUSD^-0.119 · USDCAD^0.091 · USDSEK^0.042 · USDCHF^0.042. BBDXY = 1240 · Π (S_t/S_0)^{w} with USD-strength quotes, weights EUR 29.01 JPY 12.80 CAD 11.01 MXN 9.83 GBP 8.98 CNH 7.00 (cap) CHF 5.41 AUD 4.37 KRW 3.22 INR 3.14 SGD 2.73 TWD 2.50. 50% Fed trade / 50% BIS liquidity.",
		notes: "DXY futures overlay ≠ trade-weighted dollar. MXN/CAD/CNH are in BBDXY and not in ICE DXY."
	},
	{
		id: "stir",
		name: "STIR",
		lookback: "8 quarterly whites/reds, meeting-by-meeting path",
		sources: "CME SOFR & FF, ICE Euribor, ICE SONIA, SGX TONA, Montréal CORRA — synthetic strips here",
		formula: "Implied = 100 − future price. Meeting odds from a tilted Bernoulli on ±25 bp. Cumulative path is the sum of expected steps. FRA–OIS proxy = 3M SOFR − EFFR.",
		notes: "Not a live CME feed. Use as a desk layout; wire a real strip before trading it."
	},
	{
		id: "risk",
		name: "VaR / ES / Kelly",
		lookback: "1,260 synthetic sessions, 500d rolling backtest",
		sources: "quantdesk/risk.py + kelly.py. GARCH-t book, no live prices.",
		formula: "Losses positive. hist = −Q_{1−α}(r), ES = −E[r | r≤q]. Normal, Student-t (ν from excess kurtosis), Cornish-Fisher, EVT POT (GPD MOM), EWMA λ=0.94. Kupiec POF, Christoffersen independence, Basel traffic light on last 250d. Kelly f* = (μ−r)/σ²; empirical max Σ log(1+fR); Bayes shrink of Sharpe toward 0 (τ=0.4). f_binary = p/L − (1−p)/W. P(touch x) = x^{2/c − 1}. Size = capital × budget / ES.",
		notes: "GARCH-FHS (arch) is not ported in-browser. Synthetic book only — validates the engine, not the market."
	},
	{
		id: "macro",
		name: "Macro calendar",
		lookback: "26 prints / series; 12–26 historical surprises in the drawer",
		sources: "National stats agencies (when live); synthetic survey here",
		formula: "Surprise z = (actual−consensus)/σ_survey. High/low = consensus ± 1.2816 σ (10th/90th). P(beat)/P(miss)/P(inline) from a biased split. P(above high)=1−Φ(z_high − bias). Historical 30m move is the mean beat/miss impulse of the primary related asset.",
		notes: "FX reaction stats in the drawer. Not a Bloomberg ECO calendar."
	},
	{
		id: "season",
		name: "Seasonality",
		lookback: "12 years of synthetic monthly returns, asset-specific seasonal mean",
		sources: "Desk calendar effects (oil, gold, gas, equities, BTC) — not a live CRB/BLS series",
		formula: "For each month: mean, win rate, σ, best, worst. vsSeason = this-month % chg − seasonal mean.",
		notes: "September oil strength and December equity strength are injected means, not estimated from a live sample."
	},
	{
		id: "bank",
		name: "Bank tape",
		lookback: "Latest 80 RSS items, pulled on Bank open and on Refresh",
		sources: "ING Think RSS, Federal Reserve press XML, ECB press RSS, Google News queries for the directory houses. Fallback: BANK_NOTES desk reconstructions if every feed fails.",
		formula: "Deduped by canonical URL and title, sorted newest first. House label from the feed when known, else hostname match against the directory.",
		notes: "Make thesis is a desk heuristic (not a model). Draft with Grok is user-initiated and only runs when XAI_API_KEY is present — never on page load, never mocked."
	},
	{
		id: "invest",
		name: "Invest (DCF / MVO / Congress)",
		lookback: "Yahoo chart 5y (DCF) or 3y (book); FCF annual history; Congress cache of public STOCK Act prints",
		sources: "Yahoo chart + fundamentals-timeseries (no crumb). Congress: labeled cache — Capitol Trades is challenge-walled.",
		formula: "DCF: FCF CAGR clipped −50/+50, WACC = E/(D+E)·Ke + D/(D+E)·Kd·(1−t), Ke = Rf + β·(Rm−Rf), terminal Gordon if WACC > g. Rec BUY/SELL outside ±5% MOS. Portfolio: Dirichlet Monte Carlo, max Sharpe and min vol, walk-forward 180d lookback / 21d rebalance on trailing returns only. Congress sentiment = signed mid of amount ranges.",
		notes: "Beta and spot are current (look-ahead vs historical FCF). Walk-forward does not peek. Disclosure lag up to 45 days. Port of vendor/invest dcf_model.py, portfolio_optimization.py, congress_trading.py."
	},
	{
		id: "anomaly",
		name: "Anomaly engine",
		lookback: "Rolling 14d multivariate",
		sources: "AIS velocity/density, MIL counts, NEWS embeddings, PM delta, FX realized",
		formula: "z-score gate (|z|>2.0) then isolation forest (contam. 0.02). Surviving points page the desk and the Feed.",
		notes: "Does not replace ZONE authorship. Desk can dismiss; dismissed ids are suppressed for 24h."
	},
	{
		id: "pm",
		name: "Markets (prediction)",
		lookback: "30d spark, 7d delta default",
		sources: "Polymarket (primary); Kalshi/Manifold mapped when a contract exists",
		formula: "Probability = last mid. Whale net = flow from wallets tagged >$50k cumulative on that event.",
		notes: "Dials on Brief/Theses are the same object. Click-through is the contract, not a copy."
	}
];
var CHANGELOG = [
	{
		v: "2026.10.1",
		date: "16 Oct 2026",
		text: "Bank pulls live RSS (ING, Fed, ECB, house queries) and can open a thesis from a note. Invest tab: Yahoo DCF, long-only Monte Carlo, Congress cache. TDI removed."
	},
	{
		v: "2026.09.3",
		date: "23 Sep 2026",
		text: "Wired STIR, Risk, Watch, Seasonality, Docs. User theses. TFF COT UI. Calendar high/low + probabilities. Bank directory. Local Qwen stub. Chart Y-axes."
	},
	{
		v: "2026.09.2",
		date: "21 Sep 2026",
		text: "STIR strip, BBDXY 2026 weights, yield spreads, TFF COT (quantdesk), VaR/ES/Kelly, calendar bounds & probabilities, seasonality, Watch, Bank directory, local Qwen stub, chart axes."
	},
	{
		v: "2026.09.1",
		date: "12 Sep 2026",
		text: "Recalibrated POS lookback on metals after CFTC format change. HMM prior nudged toward risk-off given oil-gold covariance."
	},
	{
		v: "2026.06.3",
		date: "21 Jun 2026",
		text: "Isolation forest added to ZONE candidates. False-positive rate on AIS weather clusters cut ~40%."
	},
	{
		v: "2026.03.0",
		date: "03 Mar 2026",
		text: "User-overridable Trend weights. Crowding-risk column joined to COT percentile."
	},
	{
		v: "2025.11.2",
		date: "18 Nov 2025",
		text: "Initial public methodology page."
	}
];
//#endregion
export { MODEL_VERSION as i, METHODOLOGY as n, MODEL_UPDATED as r, CHANGELOG as t };
