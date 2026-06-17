# UMC Southeast Asia Expansion Dashboard

Static single-page web app for evaluating UMC-specific expansion options in Southeast Asia.

The model now centers on:

- UMC Singapore Fab 12i as the regional manufacturing anchor
- UMC's global foundry footprint
- 22/28nm and specialty technology demand
- Communication, consumer, automotive, IoT, display, power, and connectivity customer coverage
- Upstream and downstream semiconductor ecosystem adjacency
- Sales office and B2B customer engineering support needs
- Packaging / OSAT partnership options before any greenfield back-end investment
- Stage 0 diligence questions for ROIC, capex, customer validation, partner validation, incentives, utilities, and talent

The app uses only HTML, CSS, and vanilla JavaScript. There is no backend, build step, package manager, or external library.

## Project Structure

```text
index.html
styles.css
app.js
data/countries.json
data/expansion_modes.json
data/scoring_lenses.json
data/ecosystem_cases.json
data/sources.json
data/decision_readiness.json
README.md
CHANGELOG.md
```

## Run Locally

Because the app loads JSON files with `fetch`, run it through a local static server:

```powershell
cd C:\Users\maxch\GPT
python -m http.server 8000
```

Open:

```text
http://localhost:8000
```

## Deploy on GitHub Pages

1. Create a GitHub repository.
2. Upload the project files to the repository root.
3. Go to `Settings` > `Pages`.
4. Set source to `Deploy from a branch`.
5. Choose the `main` branch and `/root`.
6. Save and open the GitHub Pages URL after deployment finishes.

All paths are relative, so the app can run from GitHub Pages without configuration.

## Update JSON Data

- `data/countries.json`: country scores, UMC-specific scores, risks, source IDs, and data freshness.
- `data/expansion_modes.json`: four practical expansion modes used by the screening model.
- `data/scoring_lenses.json`: lens-specific weights.
- `data/ecosystem_cases.json`: merged ecosystem evidence, comparable cases, policy anchors, customer clusters, and partner candidates.
- `data/decision_readiness.json`: decision readiness labels, unvalidated diligence fields, and next diligence questions.
- `data/sources.json`: source metadata. Replace low-confidence items before formal investment committee use.

## Methodology Notes

Scores are preliminary strategic estimates, not investment advice. The dashboard is a Stage 0 strategic screening tool and should not be reused as a generic semiconductor country ranking.

Foundry / manufacturing expansion, packaging / OSAT partnership, sales office, and customer engineering hub should not use the same decision logic. Each has different capex intensity, ecosystem requirements, risk profile, and time-to-market logic.

Data freshness badges show published date, retrieved date, data year, and source confidence for cards that rely on structured data.
