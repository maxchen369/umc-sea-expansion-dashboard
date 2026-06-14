# Data QA Report

Generated: 2026-06-14  
Scope: `data/*.json`

## Files Validated

- `case_studies.json`: 9 records
- `countries.json`: 6 records
- `customer_segments.json`: 4 records
- `ecosystem_entities.json`: 15 records
- `expansion_modes.json`: 4 records
- `location_clusters.json`: 9 records
- `policies.json`: 6 records
- `scoring_lenses.json`: 6 records
- `sources.json`: 20 records
- `update_log.json`: 1 record

## Checks Performed

- Invalid JSON
- Duplicate `id` values
- Missing `source_ids`
- `source_ids` not found in `sources.json`
- Missing `published_date`
- Missing `retrieved_date`
- Missing `data_year`
- Missing `confidence`
- Inconsistent country names
- Inconsistent expansion mode IDs

## Errors Found And Fixed

Two broken source references were found in `countries.json`:

- Malaysia referenced `src_asean_investment_report`, which no longer exists in `sources.json`.
  - Fixed to `src_malaysia_wsj_chip_hub`.

- Thailand referenced `src_thailand_placeholder`, which no longer exists in `sources.json`.
  - Fixed to `src_thailand_boi_placeholder`.

No scoring logic was changed.

## Final QA Result

Final validation result: `QA_PASS`

All JSON files parse successfully. No duplicate IDs, broken source references, missing required freshness fields, inconsistent country names, or inconsistent expansion mode IDs remain under the current QA rules.
