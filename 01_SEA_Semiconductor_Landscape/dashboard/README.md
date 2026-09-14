# Southeast Asia Semiconductor Landscape — Dashboard

A static, single-page briefing built with HTML, CSS and vanilla JavaScript. No backend, build step, package manager or external library.

## Run locally

The page loads its JSON data with `fetch`, so it must be served over HTTP. Opening `index.html` directly (`file://`) will not load the data. From this folder:

```bash
python -m http.server 8000
```

Then open <http://localhost:8000>.

## Publish

All paths are relative. To publish on GitHub Pages or any static host, upload **this `dashboard/` folder only**.

## Page structure

The page reads top-down, from conclusions to evidence.

| Section | What it shows | Data |
|---|---|---|
| Key takeaways | Four plain-language conclusions, each with its evidence grade and a link to the proof | `data/summary.json` |
| Overview | Country × supply-chain table: established, emerging or not present across six layers; hover over or focus a cell for its note | `data/valuechain_credibility.json` |
| Country profiles | Role, strengths, constraints and what to watch, with the underlying data in a collapsible panel | `data/country_profiles.json` and the data files below |
| Evidence · Why companies look at Southeast Asia | Demand drivers and demand by country | `data/demand_drivers.json` |
| Evidence · Who is already investing | Seven company moves and what each one means for the region | `data/competitive_map.json` |
| Evidence · Practical constraints compared | Power, talent, suppliers and incentives by country | `data/feasibility_inputs.json` |
| Evidence · Real investments vs. announcements | Projects being built vs. plans that are not yet actionable | `data/cases_signals.json` |
| Evidence · What we still don't know | Six open questions and how to close them | `data/view_changing_gaps.json` |
| Evidence · Sources | 24 public sources | `data/source_index.json` |
| About the data | Scope, grade definitions and status definitions | `data/frame.json` |

Items cite sources by ID, for example `"sources": ["gf_singapore"]`; the page resolves each ID against `source_index.json` and links to the publisher. `summary.json` and `country_profiles.json` hold the plain-language layer, and every profile statement carries the grade of the data it summarizes.

## Evidence grades and the filter

| Grade | Meaning | Shown as |
|---|---|---|
| A | Comparable / directly citable | Full dot |
| B | Verified but not cross-comparable | Three-quarter dot |
| C | Estimate / proxy | Half dot |
| D | Author judgment / data gap | Empty ring |

The letter is always printed next to the dot. The switch at the top hides grades C and D across the page, leaving 45 of the 99 data points. Table cells keep their place and read "Hidden"; lists that end up empty say so.

## Design notes

- Supply-chain status uses one blue scale in two steps, plus an outline for "not present". The light- and dark-mode steps were checked with a palette validator (single hue, steadily increasing lightness, contrast against the background), and every color is paired with a text label.
- Tooltips add detail but never hold information exclusively: the same notes appear in the country profiles.
- Light and dark mode follow the system setting, and the layout works down to phone width.
- All text is inserted with `textContent`, never as HTML.

## Scope and limits

- Outside-in and public-data only. Demand-side evidence reaches proxy-level confidence at best, because real customer pull sits in internal data.
- Not a ranking, scoring or site-selection model.
- Data as of July 2026.

## Possible next steps

- Add a small, dependency-free validator that checks required fields and confirms every source ID resolves.
- Link each practical-constraint value to its source, cell by cell.
