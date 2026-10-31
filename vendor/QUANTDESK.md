# Documents « desk-level » — VaR/ES, COT, Kelly

## Contenu
| Fichier | Rôle |
|---|---|
| `VaR_CVaR.ipynb` | Moteur VaR/ES (7 estimateurs), backtesting (Kupiec, Christoffersen, Bâle, tests d'ES), décomposition, stress, Monte-Carlo, sizing → `risk_snapshot.json` |
| `COT_reports.ipynb` | Positionnement CFTC : features, alignement sans look-ahead, tests HAC + Holm/BH, backtests avec coûts, walk-forward, Sharpe déflaté → `cot_snapshot.json` |
| `The Kelly Criterion.ipynb` | Kelly continu corrigé, drawdown, erreur d'estimation, mono/multi-actifs contraints, backtests → `kelly_snapshot.json` |
| `quantdesk/` | Bibliothèque réutilisable (`risk.py`, `cot.py`, `kelly.py`, `data.py`, `utils.py` = compat. de l'ancien `utils`) |

## Lancer
```
pip install -r requirements.txt
jupyter lab      # exécuter les notebooks depuis ce dossier (import quantdesk)
```
Les données sont récupérées via yfinance / CFTC (cache dans `data_cache/`). **Sans accès réseau**, les notebooks basculent automatiquement sur des données *synthétiques* (bannière d'avertissement en tête) : les sorties fournies ont été générées ainsi et valident le code, pas le marché. Relancer avec Internet pour obtenir les résultats réels.

## Intégration terminal
Chaque notebook écrit un JSON à schéma stable (métriques, poids, drapeaux). Les fonctions de `quantdesk/` sont pures (pas d'état, pas d'I/O) et portables.
