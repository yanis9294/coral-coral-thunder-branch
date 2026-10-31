# ARGOS — calculations and sources

Model version **2026.10.1**. In-app copy: Docs (D) and Methodology (H). This file is the same audit trail in markdown.

## Policy

Prices, COT, STIR, calendar, seasonality and the risk book are seeded simulations (`mulberry32`, GARCH-t) so the engines can be audited. Desk epoch `2026-09-19T12:13:00Z`. A `SYNTHETIC` banner is binding.

Two surfaces do go to the network:

- **Bank** pulls ING Think RSS, Fed press XML, ECB press RSS, and Google News house queries. If every feed fails, the tape falls back to desk reconstructions and the banner says CACHE.
- **Invest** reads Yahoo chart + fundamentals-timeseries for DCF and the book. Congress stays a labeled public-tape cache.

## ICE DXY

Published NYBOT factor `50.14348112`. Geometric:

```
DXY = 50.14348112
    · EURUSD^-0.576 · USDJPY^0.136 · GBPUSD^-0.119
    · USDCAD^0.091  · USDSEK^0.042 · USDCHF^0.042
```

Code: `src/data/dxy.ts` (`iceDxy`).

## Bloomberg Dollar Spot (BBDXY)

2026 **target** weights, effective after the close of **30 Jun 2026**. Mix is 50% Fed trade / 50% BIS FX liquidity. **CNH capped at 7.00**. Geometric, USD-strength quotes, rebased **1240** at the terminal’s September-2026 central spots.

| CCY | Pair   | Weight % |
|-----|--------|----------|
| EUR | EURUSD | 29.01 |
| JPY | USDJPY | 12.80 |
| CAD | USDCAD | 11.01 |
| MXN | USDMXN |  9.83 |
| GBP | GBPUSD |  8.98 |
| CNH | USDCNH |  7.00 |
| CHF | USDCHF |  5.41 |
| AUD | AUDUSD |  4.37 |
| KRW | USDKRW |  3.22 |
| INR | USDINR |  3.14 |
| SGD | USDSGD |  2.73 |
| TWD | USDTWD |  2.50 |

```
BBDXY = 1240 · Π (S_t / S_0)^{w/100}
```

MXN/CAD/CNH/KRW/INR/SGD/TWD are in BBDXY and **not** in ICE DXY. Code: `bbdxy`, `BBDXY_2026`.

## Yield spreads

Seeded US/DE/JP/GB curves (`src/data/yields.ts`). Spreads in **basis points**: 2s10s, 5s30s, 10s30s, 2s30s, US–DE 10Y, US–JP 10Y, US–GB 10Y, US 10Y real (nominal − 10Y BEI), SOFR−FF, IORB−FF.

## STIR

SOFR / FF / Euribor / SONIA / TONA / CORRA quarterly strips. `implied = 100 − price`. Meeting odds: tilted Bernoulli on ±25 bp. FRA–OIS proxy = 3M SOFR − EFFR. Code: `src/data/stir.ts`.

## COT (TFF)

Port of `vendor/quantdesk/cot.py` → `src/data/cot-tff.ts`.

```
net_k   = (long_k − short_k) / OI × 100
net_cot = net_lf − net_dealer
idx     = Williams (x − min)/(max − min) over 156 weeks
z       over 156 weeks
d4, d13 weekly diffs
lf_am_div = z_lf − z_am
extreme ±1 at idx ≥ 0.85 / ≤ 0.15, contrarian
```

**Timing (no look-ahead)**

- Positions as-of **Tuesday**
- CFTC publishes **Friday 15:30 ET** (`release_lag = 3`)
- Default `exec_lag = 2` → **Monday close**
- Trading Tuesday on Tuesday is a **3-day look-ahead**

Sandbox has no CFTC feed. `source` is always `synthetic`. Crypto = CME futures only.

## Risk (VaR / ES / Kelly)

Port of `vendor/quantdesk/risk.py` + `kelly.py` → `src/data/risk.ts`. Losses **positive**. 1,260 synthetic GARCH-t sessions, 500-day rolling backtest.

| Method | Notes |
|--------|--------|
| Historical | −Q_{1−α}(r); ES = −E[r \| r ≤ q] |
| Normal | |
| Student-t | ν from excess kurtosis |
| Cornish-Fisher | skipped if not monotone |
| EVT POT | GPD MOM |
| EWMA | λ = 0.94 (in-browser conditional vol) |

GARCH-FHS (`arch`) is **not** ported in-browser.

Backtest: Kupiec POF, Christoffersen independence, Basel traffic light on last 250d.

Kelly: `f* = (μ − r)/σ²`; empirical `max Σ log(1+fR)`; Bayes shrink of Sharpe toward 0 (τ = 0.4); binary `p/L − (1−p)/W`. `P(touch x) = x^{2/c − 1}`. Size = `capital × budget / ES`. Full Kelly ≈ 50% chance of drawing down to half capital (GBM). **Do not size live risk off this tape.**

## Macro calendar

`src/data/calendar.ts`.

```
surprise z     = (actual − consensus) / σ_survey
high / low     = consensus ± 1.2816 σ   (10th / 90th)
P(above high)  = 1 − Φ(z_high − bias)
P(below low)   = Φ(z_low − bias)
```

P(beat)/P(miss)/P(inline) from a biased split. Historical 30m move = mean beat/miss impulse of the primary related asset (FX bp, yields bp, or index %). Not a Bloomberg ECO calendar.

## Seasonality

12 years of synthetic monthly returns. vsSeason = this-month % change − seasonal mean. September oil / December equity strength are **injected** means, not live-sample estimates. Code: `src/data/seasonality.ts`.

## Trend matrix

```
Overall = wM·MACRO + wP·POS + wR·RISK + wF·FLOW
```

Defaults 0.30 / 0.25 / 0.20 / 0.25, user-overridable, renormalized. Factors are z-scores clipped at ±3 then scaled to −100/+100. Verdict bands 10 / 25 / 45 / 70.

## Bank tape

`src/lib/bank-feed.ts`. Feeds: `https://think.ing.com/rss`, Federal Reserve `press_all.xml`, ECB press RSS, plus Google News queries for the houses in `src/data/bank-sources.ts`. Deduped by URL and title, newest first, cap 80. **Make thesis** is a keyword heuristic. **Draft with Grok** is a user click against `api.x.ai` and returns an error if `XAI_API_KEY` is absent — it is never called on page load and never mocked.

## Invest

TypeScript port of `vendor/invest/` (`dcf_model.py`, `portfolio_optimization.py`, `congress_trading.py`).

```
WACC = E/(D+E)·Ke + D/(D+E)·Kd·(1−t)
Ke   = Rf + β·(Rm − Rf)
IV   = Σ FCF_t / (1+WACC)^t  +  TV / (1+WACC)^n
TV   = FCF_n·(1+g) / (WACC − g)     only if WACC > g
```

FCF growth is the historical CAGR clipped to ±50%. Recommendation is BUY/SELL outside a ±5% margin of safety. Beta and the spot are current; annual FCF is historical (labeled look-ahead). Portfolio Monte Carlo is long-only Dirichlet. Walk-forward uses a 180-session trailing window and rebalances every 21 sessions — no future returns. Congress net is the signed midpoint of the disclosed amount range; legal lag up to 45 days.

## Charts

Bounded series use `BoundArea` / `BoundLine` / `BoundBar` (`src/lib/chart.tsx`): Cartesian grid + Y-axis with a 10% padded domain so amplitude is readable.

## Local Qwen

OpenAI-compatible `POST {baseUrl}/chat/completions`. Off by default. Config in `localStorage` key `argos-qwen`. See Docs panel.

## Bank sources

Free HTML/PDF doors listed in `src/data/bank-sources.ts` (ING Think, Citi wealth FX, Scotia GBM, UBS CIO, OCBC, Danske, MUFG, NBK, UOB, ANZ Data Wrap, DBS, Mizuho, Sucden, FX Daily Report). Dated URLs are landings.

## Python reference

`vendor/quantdesk/` is the original library (`cot.py`, `risk.py`, `kelly.py`, `data.py`, `utils.py`). Notebooks in the attached desk pack fall back to synthetic data without network — they validate the engine, not the market.
