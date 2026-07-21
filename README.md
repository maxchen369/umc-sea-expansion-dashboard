# Southeast Asia Semiconductor — Consultant Dashboard

A static, single-page dashboard that organizes messy public data on the Southeast Asian semiconductor landscape into a systematic, decision-useful framework.

It is built **outside-in**, from public data only, from the viewpoint of an external industry-research consultant advising a specialty (mature-node) foundry that already has a Singapore anchor. It uses **no internal customer, capacity, or financial data**. It does not rank countries, score them, or recommend an investment; it makes the demand, competitive, and infrastructure layers visible and honestly quality-tagged so a human can form a judgment.

## Organizing principle

Modules are ordered by **decision driver**, not by data category. Every figure must change how a reader would judge; anything that does not is cut or demoted. Demand and competition (Modules 2–3) carry the most decision weight and are the least documented, so they lead. Infrastructure facts (Module 5) are the best documented but move the decision least, so they are demoted and every value is quality-tagged.

Structural finding that frames everything: **none of the five countries (Malaysia, Vietnam, Thailand, Indonesia, Philippines) has a confirmed commercial 300mm front-end fab; the region's only front-end anchor is Singapore.** So the "SEA ex-Singapore" question is a back-end adjacency, demand-sensing, and China+1 optionality question — not a front-end siting question.

## Modules

1. **Reading Frame** — outside-in caveat, the structural finding, and the A–D evidence-quality legend.
2. **Demand & Strategic Drivers** — China+1, tariffs, Taiwan-concentration risk, and end-market gravity by country. *(the largest, least-documented driver)*
3. **Competitive & Capacity Map** — peer foundry / IDM / OSAT footprints, split by front-end vs back-end, each read as validating / crowding / context.
4. **Value-Chain Credibility Matrix** — where each country is credible / emerging / absent across six layers, referenced to Singapore.
5. **Feasibility Inputs** — decision-magnitude inputs only (firm power availability, reliability, electricity price, experienced-engineer pool, EMC graduate share, supply-chain adjacency, incentives, binding constraint).
6. **Cases & Policy Signals** — split into real manufacturing gravity vs signals not yet actionable (e.g., ARM × Danantara).
7. **View-Changing Gaps** — the unknowns that would flip a judgment, ordered by decision weight, plus a compact source index.

## Evidence quality tags

Every value carries a tag (the spine of the dashboard):

- **A** — Comparable / directly citable (source, year, definition clear).
- **B** — Verified but not cross-comparable (definitions differ across countries/years).
- **C** — Estimate / proxy (range, non-semiconductor role, or secondary source).
- **D** — Author judgment / data gap (no unified public quantitative data).

## Tech

HTML, CSS, and vanilla JavaScript only. No backend, build step, package manager, or external library. Data lives in `data/*.json` and is loaded with `fetch`.

## Project structure

```text
index.html
styles.css
app.js
data/frame.json                    # Module 1: reading frame + quality legend
data/demand_drivers.json           # Module 2: structural drivers + end-market gravity
data/competitive_map.json          # Module 3: competitor / capacity moves
data/valuechain_credibility.json   # Module 4: credibility matrix
data/feasibility_inputs.json       # Module 5: decision-magnitude inputs
data/cases_signals.json            # Module 6: manufacturing cases vs signals
data/view_changing_gaps.json       # Module 7: view-changing unknowns
data/source_index.json             # source index
data/archive/                      # superseded data files (not loaded)
README.md
CHANGELOG.md
```

Primary source basis: `SEA_semiconductor_infra_verified_revised.docx` (July 2026 verified/revised appendix). The dashboard reflects its corrections — removed the erroneous Malaysia "sub-2-minute SAIDI" and "~600,000 E&E engineers" claims, reframed "~13%" as activity/market share (not physical capacity), updated EMC graduate shares to 2024, and downgraded the unconfirmed ARM × Danantara figures.

## Run locally

The app loads JSON with `fetch`, so it must be served over HTTP (not opened via `file://`):

```powershell
cd C:\Users\maxch\GPT
python -m http.server 8000
```

Open `http://localhost:8000`.

## Deploy on GitHub Pages

1. Push the project files to a GitHub repository root.
2. `Settings` > `Pages` > source `Deploy from a branch`, `main` / `/root`.
3. Open the GitHub Pages URL after deployment. All paths are relative, so no configuration is needed.

## Scope and limits

This is orientation and structured-judgment material, not a decision engine. Its ceiling is set by what is publicly visible: Module 2 (demand) reaches only proxy / B–C confidence because real customer pull sits in internal data. Time-sensitive 2025–2026 competitive items (e.g., VIS–NXP ramp) are tagged C/D pending primary-source verification.
