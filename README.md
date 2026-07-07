# UMC Southeast Asia Strategic Overview Dashboard

Static single-page dashboard for organizing UMC Southeast Asia strategic options after Singapore Fab 12i P3.

The dashboard is a management-facing discussion aid and diligence roadmap. It does not try to directly answer whether UMC should build a new fab or make a specific investment.

The active dashboard centers on:

- Strategic Overview: Singapore Fab 12i P3 as the existing baseline / anchor.
- Strategic Option Map: option families, business logic, capex level, complexity, relevant countries, and data needed before action.
- Country Fact Base: objective country facts, estimates, and data gaps for Malaysia, Vietnam, Thailand, Indonesia, and the Philippines.
- Option Evidence Matrix: evidence grouped by strategic option first and country second.
- Case Dossiers: option-linked cases with headline implication and expandable details.
- Diligence Workplan: workstreams, diligence items, related option/country, owners, next actions, and outputs needed.
- Short Country Fact Sheets: thesis, relevant options, strongest fact, biggest constraint, and data gap.

The app uses only HTML, CSS, and vanilla JavaScript. There is no backend, build step, package manager, or external library.

## Project Structure

```text
index.html
styles.css
app.js
data/strategic_options.json
data/objective_country_metrics.json
data/evidence_library.json
data/case_dossiers.json
data/diligence_workplan.json
data/country_profiles.json
data/sources.json
README.md
CHANGELOG.md
```

Legacy files such as `data/countries.json`, `data/expansion_modes.json`, `data/scoring_lenses.json`, `data/decision_claims.json`, `data/decision_strategies.json`, and `data/decision_readiness.json` may remain in the repository as historical appendix data, but the current dashboard does not load them.

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

All active paths are relative, so the app can run from GitHub Pages without configuration.

## Active Data Files

- `data/strategic_options.json`: five option families after Fab 12i P3.
- `data/objective_country_metrics.json`: country fact base with appendix-style objective facts, estimates, and data gaps.
- `data/evidence_library.json`: evidence records mapped to `option_id` with direct/proxy/background strength labels.
- `data/case_dossiers.json`: promoted option-linked cases with implications and expandable details.
- `data/diligence_workplan.json`: team workstreams and outputs needed for next diligence.
- `data/country_profiles.json`: short country thesis inputs used for country fact sheets.
- `data/sources.json`: source metadata and reference trail.

## Methodology Notes

This dashboard avoids subjective lenses, weighted ordering, final-answer framing, and numeric country grades as management outputs. Evidence is classified as:

- `direct`: directly relevant to an option.
- `proxy`: suggests relevance but requires UMC internal validation.
- `background`: useful context, not actionable alone.

Country facts preserve `est.` where values are estimated and show `data gap` where appendix data is missing.
