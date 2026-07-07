# Changelog

## 2026-07-07

- Repositioned the dashboard as a Strategic Overview for UMC Southeast Asia options after Singapore Fab 12i P3.
- Replaced Management Conclusion with Strategic Overview language: baseline assumption, option landscape, discussion aid, and diligence roadmap.
- Replaced Strategic Options & Gate Status with a Strategic Option Map using five option families: Optimize Existing Fab 12i P3, Sales Office, Customer Engineering Hub, Packaging / OSAT Partnership, and Foundry / Manufacturing Expansion.
- Added `data/strategic_options.json` for purpose, business logic, capex level, execution complexity, relevant countries, UMC relevance, and data needed before action.
- Renamed the active metrics surface to Country Fact Base and ordered non-Singapore countries as Malaysia, Vietnam, Thailand, Indonesia, and Philippines.
- Reworked active evidence display as an Option Evidence Matrix grouped by strategic option first and country second.
- Added option mapping, direct/proxy/background evidence strength, what-it-proves, and what-it-does-not-prove fields to all active evidence records.
- Made Case Dossiers option-linked and collapsible by default, grouped by option and country.
- Added `data/diligence_workplan.json` and replaced approval-gate tracker UI with a Diligence Workplan organized by workstream and output needed.
- Updated README to reflect the new strategic overview objective and active data files.

## 2026-07-05

- Refactored the app from a score-driven dashboard into a Stage 0 Screening & Diligence Dashboard.
- Added a Management Conclusion section: focus on Singapore Fab 12i P3 execution and defer new non-Singapore expansion.
- Replaced scorecard UI with Strategic Options & Gate Status cards using decision statuses, blockers, required validation, owners, and next actions.
- Added `data/objective_country_metrics.json` and an Objective Country Metrics section with sortable table, comparison cards, metric details, estimate flags, and data gaps.
- Added `data/case_dossiers.json` and promoted only fact-bearing cases with implications, limitations, and validation steps.
- Added `data/diligence_tracker.json` and an Open Diligence Tracker for Stage 0-to-Stage 1 gaps.
- Enriched all evidence records with explicit `evidence_role` and `factual_detail` fields.
- Removed scoring lenses, custom weights, score matrix, and score explanation modal from the active UI.
- Updated README for the new Stage 0 data model and GitHub Pages-compatible static structure.

## 2026-06-23

- Renamed Evidence Library to "Evidence-to-Decision Map".
- Reorganized evidence by decision claim rather than country, industry category, or evidence type.
- Added `data/decision_claims.json` for claim summaries, evidence strength, recommended action, and validation gaps.
- Updated `data/evidence_library.json` to use simplified claim-oriented fields: `decision_claim_id`, `what_it_supports`, `decision_implication`, `limitation`, `industry_category`, and `what_to_validate_next`.
- Removed evidence role and evidence type from the Evidence-to-Decision Map to reduce management-reader burden.
- Linked Decision Funnel cards to supporting evidence counts, evidence strength, top evidence, unresolved gaps, and a "View supporting evidence" action.
- Removed the standalone Universal Investment Gates section.
- Refactored Decision Funnel into strategy-level gate cards with status, next action, and suggested owner.
- Refactored Country Deep Dive into Country Profiles focused on country thesis, role, risks, triggers, evidence, and evidence gaps.

## 2026-06-21

- Added "Optimize Existing Fab 12i P3 / No New External Expansion" as an eligible expansion mode.
- Updated recommendation logic so the dashboard can rank no new external expansion above non-Singapore options.
- Reclassified Malaysia Packaging / OSAT Partnership as a conditional watchlist pending customer demand, attach-rate, partner economics, incentives, and ROIC validation.
- Added TSMC-Amkor Arizona model comparison evidence to clarify why Malaysia OSAT ecosystem strength alone does not justify UMC expansion.
- Updated the decision funnel around Fab 12i P3 execution first, with Malaysia, Vietnam, Thailand, Philippines, and Indonesia as trigger-gated watchlist options.

## 2026-06-17

- Simplified Singapore baseline handling to one toggle: "Treat Singapore Fab 12i as existing baseline".
- Merged Ecosystem Map and Peer Case Studies into one "Ecosystem & Comparable Cases" section.
- Replaced the long transparency section with a compact "How to read the score" disclosure.
- Added a decision funnel that separates strategic attractiveness, financial feasibility, decision readiness, unvalidated items, and next diligence questions.
- Renamed Advanced Packaging to "Packaging / OSAT Partnership" and shifted wording toward partnership-first diligence rather than greenfield investment.
- Added `data/ecosystem_cases.json` as the merged evidence file.
- Added `data/decision_readiness.json` for management-oriented diligence fields.
- Reduced the page to six sections: Executive Summary, Strategic Scorecard, Ecosystem & Comparable Cases, Decision Funnel, Country Deep Dive, and Sources & Data Freshness.
