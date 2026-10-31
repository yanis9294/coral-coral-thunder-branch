# ARGOS

Markets and geopolitics intelligence terminal. Monitor the tape. Locate the edge.

Auth and database are **off**. Everything persists in the browser (`localStorage`).

## Run locally

Requires **Node 22**.

```bash
npm install
npm run dev
```

The app binds `0.0.0.0:8080`. Open that origin in a browser.

```bash
npm run build
npm run preview
```

No `.env` is required. Do not point a local LLM at port 8080 — ARGOS owns it.

## Optional: local Qwen Code

Off by default. In the terminal open **Docs → Local Qwen Code**, enable it, set:

| Server    | Base URL                     |
|-----------|------------------------------|
| Ollama    | `http://127.0.0.1:11434/v1`  |
| LM Studio | `http://127.0.0.1:1234/v1`   |
| llama.cpp | `http://127.0.0.1:8081/v1`   |
| vLLM      | `http://127.0.0.1:8000/v1`   |

Default model `qwen2.5-coder:7b`. Config is stored under `argos-qwen`. Ping from the same panel.

## Data

**Mostly synthetic.** Prices, COT, STIR, calendar, seasonality and the risk book are seeded simulations so the engines can be audited. They are not a live vendor feed. Bank pulls live RSS when the network answers. Invest reads Yahoo for DCF and the book; Congress is a labeled cache. Formulas, weights and sources: in-app **Docs** (D) and [ARGOS.md](./ARGOS.md).

CFTC TFF and VaR/ES/Kelly are TypeScript ports of `vendor/quantdesk/` (`cot.py`, `risk.py`, `kelly.py`).

## Views

| Key | View |
|-----|------|
| F1 | Monitor |
| F2 | Brief |
| F3 | Theses (add your own) |
| F4 | Trend |
| F5 | COT TFF |
| F6 | Macro calendar |
| F7 | Markets |
| F8 | Micro |
| F9 | FX / DXY / BBDXY |
| F10 | News |
| F11 | Invest (DCF / portfolio / Congress) |
| F12 | Bank (live street RSS) |
| S | STIR |
| R | Risk |
| A | Watch |
| Y | Seasonality |
| D | Docs |
| W | Workbench |
| H | Methodology |
