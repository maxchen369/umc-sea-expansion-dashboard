# Data QA Report

Generated: 2026-06-15  
Scope: JSON data update from `RESEARCH_ECOSYSTEM_EXPANSION_2026.md`

## Validation Summary

- JSON parse status: pass
- `source_ids` resolution across updated files: pass
- Duplicate ecosystem entity IDs: none
- Missing required ecosystem entity fields: none
- Placeholder source/entity/case records remaining: none
- Countries with fewer than 5 ecosystem entities: none

## Ecosystem Entity Counts

| Country | Entity count | Unique source count |
|---|---:|---:|
| Singapore | 7 | 8 |
| Malaysia | 8 | 10 |
| Vietnam | 7 | 7 |
| Thailand | 6 | 6 |
| Philippines | 6 | 6 |
| Indonesia | 6 | 6 |

Total ecosystem entities: 40  
Total sources: 43  
Total case studies: 14  
Total policies: 6  
Total location clusters: 13

## Missing Fields

None found in `data/ecosystem_entities.json` for the required fields:

- `id`
- `name`
- `country`
- `location`
- `ecosystem_layer`
- `value_chain_position`
- `relevant_expansion_modes`
- `relevance_to_umc`
- `fab12i_next_step_relevance`
- `sales_relevance_score`
- `customer_support_relevance_score`
- `foundry_relevance_score`
- `advanced_packaging_relevance_score`
- `fab12i_synergy_score`
- `source_ids`
- `published_date`
- `retrieved_date`
- `data_year`
- `confidence`
- `source_type`

## Low-Confidence Items

| File | Item | Reason |
|---|---|---|
| `data/ecosystem_entities.json` | `vietnam_semiconductor_strategy` | Research file identified Vietnam semiconductor strategy details as needing stronger official source-specific verification. |
| `data/policies.json` | Vietnam policy entry | Uses the same low-confidence strategy reference plus stronger supporting sources for NIC and Amkor. |

## Placeholders Replaced

Removed or replaced placeholder-backed records and references:

- `src_ase_penang`
- `src_vietnam_placeholder`
- `src_thailand_boi_placeholder`
- `src_indonesia_placeholder`
- Vietnam EMS placeholder entity replaced by Samsung, Intel, Amkor, Hana Micron, FPT, NIC, and Vietnam strategy entries.
- Thailand BOI/EEC placeholders replaced with BOI, EEC, Analog Devices, UTAC, Stars Microelectronics, and precision electronics cluster entries.
- Indonesia placeholder demand entity replaced with Batam, Sat Nusapersada, Infineon, BKPM, Batamindo, and Danantara-backed entries.
- ASE Penang placeholder case replaced with an ASE Technology company-profile-backed case.

## Sources Still Needing Verification

These were not promoted into high-confidence records:

- Indonesia Danantara + Arm / Arm Total Access semiconductor design workforce partnership: not added as a sourced claim; Danantara is included only as a sovereign investment platform.
- Thailand 2026 national semiconductor strategy focused on power semiconductors, sensors, photonics, discrete devices, and analog chips: not added as a sourced claim.
- Philippines 2026 US-Philippines New Clark City AI / semiconductor supply-chain security hub: not added as a sourced claim.
- Singapore official 2026 Micron Fab 10B / HBM source: current record remains medium-confidence because it uses credible secondary reporting.
- Malaysia current ASE Penang advanced packaging expansion amount and scope: current record avoids investment amount claims and uses company-profile evidence.

## Updated Files

- `data/ecosystem_entities.json`
- `data/case_studies.json`
- `data/sources.json`
- `data/policies.json`
- `data/location_clusters.json`
- `data/update_log.json`

