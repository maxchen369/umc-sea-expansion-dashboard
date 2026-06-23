# Changelog

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
