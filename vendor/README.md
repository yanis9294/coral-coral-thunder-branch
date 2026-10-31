# vendor/quantdesk

Python source of truth for ARGOS COT / VaR / Kelly.

The in-browser engines are TypeScript ports:

- `src/data/cot-tff.ts` ← `quantdesk/cot.py`
- `src/data/risk.ts` ← `quantdesk/risk.py` + `kelly.py`

Do not import this package from the web app. Audit formulas here, run notebooks from the original desk pack if you have network.

See [QUANTDESK.md](./QUANTDESK.md) and [../ARGOS.md](../ARGOS.md).
