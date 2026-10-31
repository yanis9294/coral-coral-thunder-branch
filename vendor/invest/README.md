# Toolkit d'investissement

Fusion, correction et extension de `DCF.ipynb` et `MVO_1_.ipynb`.

## Contenu

| Fichier | Rôle |
|---|---|
| `dcf_model.py` | Valorisation DCF, WACC/CAPM, Gordon-Shapiro, ratios financiers, Piotroski F-score |
| `portfolio_optimization.py` | Monte Carlo, frontière efficiente (scipy + cvxpy en option), HRP/PyPortfolioOpt en option, backtest |
| `congress_trading.py` | Transactions boursières déclarées par les membres du Congrès (STOCK Act) |
| `Investment_Toolkit.ipynb` | Notebook de démonstration qui importe et enchaîne les trois modules |

Chaque module documente en tête ses propres bugs corrigés par rapport aux notebooks
d'origine (liste précise, pas seulement "nettoyé").

## Installation

```bash
pip install -r requirements.txt
```

Les dépendances `cvxpy`, `PyPortfolioOpt` et `quantstats` sont optionnelles : les
fonctions qui en dépendent lèvent une erreur explicite si le paquet manque, le
reste du toolkit fonctionne sans elles.

## Suivi des transactions du Congrès

Les anciens dumps gratuits (`senate-stock-watcher-data`, `house-stock-watcher-data`
sur S3) ne sont plus maintenus/accessibles. Le module utilise par défaut l'API
**Disclosed Capitol**, qui a un palier gratuit (750 crédits offerts, pas de carte
bancaire) :

1. Créez un compte sur https://www.disclosedcapitol.com/developers
2. Récupérez votre clé API
3. `export DC_API_KEY="votre_cle"` (ou passez `api_key=...` directement au client)

Alternative 100 % gratuite et sans clé mais plus rustique : `fetch_house_disclosure_index()`
télécharge l'index brut des dépôts de la Chambre (qui a déposé, quand — pas le détail
des transactions, qui est dans des PDF individuels à parser séparément).

## Points d'attention

- **Biais de look-ahead** : `yfinance.Ticker.info` (beta, prix, capitalisation) reflète
  l'état actuel du marché, pas l'état historique à la date des états financiers utilisés
  pour la projection de FCF. `walk_forward_backtest()` dans `portfolio_optimization.py`
  montre comment séparer strictement fenêtre d'estimation et fenêtre de test pour le
  volet portefeuille ; côté DCF, ce biais reste présent (limite de yfinance, pas du code).
- **Décalage de déclaration du Congrès** : jusqu'à 45 jours légalement entre la
  transaction et sa déclaration — une transaction "récente" peut avoir été exécutée
  bien plus tôt. À traiter comme un indicateur de contexte, pas un signal temps réel.
