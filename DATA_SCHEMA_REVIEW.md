# Data Schema Review

## Scope

Reviewed all files in `data/`:

- `countries.json`
- `case_studies.json`
- `sources.json`
- `expansion_modes.json`
- `customer_segments.json`
- `ecosystem_entities.json`
- `location_clusters.json`
- `policies.json`
- `scoring_lenses.json`
- `update_log.json`

No existing data or application files were modified.

## Core Schemas

### `countries.json`

Current schema supports country-level scoring and UMC-specific scoring.

Fields used:

- Identity: `id`, `name`, `key_locations`
- Generic country scores: `policy_score`, `ecosystem_score`, `talent_score`, `infrastructure_score`, `customer_proximity_score`, `cost_efficiency_score`, `geopolitical_stability_score`, `time_to_market_score`, `esg_readiness_score`
- UMC-specific scores: `fab12i_synergy_score`, `umc_global_layout_fit_score`, `ecosystem_adjacency_score`, `customer_coverage_score`, `partner_potential_score`, `execution_risk_penalty`
- Narrative: `summary`, `strengths`, `risks`, `recommended_modes`
- Provenance: `source_ids`, `published_date`, `retrieved_date`, `data_year`, `confidence`

### `case_studies.json`

Current schema supports UMC-relevant peer cases and data freshness.

Fields used:

- `company`, `country`, `location`, `year`
- `investment_amount`
- `ecosystem_layer`
- `value_chain_position`
- `relevance_to_umc`
- `relevant_expansion_modes`
- `source_ids`
- `published_date`, `retrieved_date`, `data_year`, `confidence`

### `sources.json`

Current schema supports source lookup by `source_ids`.

Fields used:

- `id`
- `title`
- `publisher`
- `year`
- `url`
- `note`

### `expansion_modes.json`

Current schema supports broad mode-level assumptions.

Fields used:

- `id`
- `name`
- `capex_level`
- `execution_complexity`
- `strategic_relevance_to_umc`
- `description`
- `best_fit_conditions`
- `key_risks`

## Support For Required Evaluation Areas

### UMC Fab 12i Synergy

Partially strong. `countries.json` includes `fab12i_synergy_score`, and Singapore has explicit Fab 12i positioning. `case_studies.json` includes UMC Singapore Fab 12i as a direct case. `scoring_lenses.json` includes a dedicated `UMC Fab 12i Synergy` lens.

Missing detail: no structured Fab 12i capacity, process-node, customer segment, or dependency fields.

### Sales Office Evaluation

Moderate. `recommended_modes`, `customer_coverage_score`, `customer_proximity_score`, and `sales_support_coverage` lens support basic sales office ranking.

Missing detail: no named customer clusters, regional HQ density, direct account coverage, distributor/channel presence, or travel/connectivity metrics.

### Customer Engineering Support Evaluation

Moderate. `customer_support_call_center` mode is defined as technical/FAE support, and `customer_segments.json` captures support needs.

Missing detail: no FAE talent depth, language capability, application engineering skills, response-time assumptions, or support cost benchmarks by country.

### Advanced Packaging Ecosystem

Moderate to strong. `advanced_packaging_ecosystem` lens, `ecosystem_adjacency_score`, `partner_potential_score`, and OSAT-related cases support this.

Missing detail: no structured OSAT company list, packaging technology capabilities, substrate availability, test capacity, customer qualification status, or partner readiness score.

### Upstream And Downstream Ecosystem

Partial. `ecosystem_entities.json` has a useful start, but coverage is thin.

Missing ecosystem layers or sparse coverage:

- upstream materials
- semiconductor equipment
- IC design
- EMS
- logistics
- end customers beyond Thailand
- customer engineering support beyond the Philippines

### Data Freshness From 2025-2026

Partial. Countries include `retrieved_date` in 2026 and several `data_year` values in 2025. Some sources are 2024 or earlier, and several source URLs are placeholders.

Missing detail: no per-field freshness, no last-verified status, no source confidence rationale, no distinction between source publication year and modeled estimate year.

## Main Schema Gaps

1. Add location-level scoring, not just country-level scoring.
2. Add structured ecosystem entity coverage for all required layers.
3. Add customer segment-to-country and segment-to-expansion-mode mappings.
4. Add source freshness metadata to `sources.json`: `published_date`, `retrieved_date`, `confidence`, `data_year`, `is_placeholder`.
5. Add mode-specific scoring requirements to `expansion_modes.json`, such as required ecosystem layers and UMC-relevant gating criteria.
6. Add partner-specific fields for OSAT, packaging, testing, EMS, equipment, and logistics entities.
7. Add quantitative or semi-quantitative evidence fields behind each score.

## Conclusion

The current data structure can support a first-pass UMC-specific strategic dashboard, especially for Fab 12i synergy, high-level country ranking, and broad expansion-mode comparison. It is not yet detailed enough for rigorous site selection, partner screening, or 2025-2026 investment committee use without more granular location, ecosystem, partner, customer, and source-freshness fields.
