# UMC Southeast Asia Expansion Dashboard

Static single-page web app for evaluating UMC-specific expansion options in Southeast Asia.

The model now centers on:

- UMC Singapore Fab 12i as the regional manufacturing anchor
- UMC's global foundry footprint
- 22/28nm and specialty technology demand
- Communication, consumer, automotive, IoT, display, power, and connectivity customer coverage
- Upstream and downstream semiconductor ecosystem adjacency
- Sales office and B2B customer engineering support needs
- Advanced packaging, OSAT, assembly, and test partnerships

The app uses only HTML, CSS, and vanilla JavaScript. There is no backend, build step, package manager, or external library.

## Project Structure

```text
index.html
styles.css
app.js
data/countries.json
data/expansion_modes.json
data/case_studies.json
data/sources.json
data/ecosystem_entities.json
data/customer_segments.json
data/policies.json
data/location_clusters.json
data/scoring_lenses.json
data/update_log.json
README.md
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
- `data/case_studies.json`: peer cases with ecosystem layer, value-chain position, UMC relevance, source IDs, dates, and confidence.
- `data/ecosystem_entities.json`: ecosystem map entries for filters.
- `data/customer_segments.json`: UMC-relevant customer segments and technology fit.
- `data/policies.json`: policy summaries and UMC implications.
- `data/location_clusters.json`: location-level expansion fit.
- `data/scoring_lenses.json`: lens-specific weights.
- `data/sources.json`: source metadata. Replace placeholder URLs before formal use.
- `data/update_log.json`: model update notes.

## Methodology Notes

Scores are preliminary strategic estimates, not investment advice. The model is UMC-specific and should not be reused as a generic semiconductor country ranking.

Foundry, advanced packaging, sales office, and customer engineering support should not use the same weights. Each has different capex intensity, ecosystem requirements, risk profile, and time-to-market logic.

Data freshness badges show published date, retrieved date, data year, and source confidence for cards that rely on structured data.
