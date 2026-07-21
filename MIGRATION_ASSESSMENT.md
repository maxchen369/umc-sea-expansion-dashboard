# Migration Assessment: Astro and/or Tailwind

**Status: Do not migrate yet.** This is an evaluation, not a migration plan.

**Scope reviewed:** `index.html` (134 lines), `app.js` (216 lines), `styles.css` (510 lines), and five JSON data files (~37 KB) under `data/`. Vanilla HTML/CSS/JS + JSON, served statically on GitHub Pages with no build step.

---

## 1. Where the pain actually is

Ranked by how much they slow down the current priorities (information architecture, appendix-derived data migration, case dossiers, decision usefulness):

**Data model — the real pain point.** Five hand-maintained JSON files with cross-references by string ID (each case and country carries `source_ids` that must match an `id` in `sources_overview.json`). Nothing enforces those links; a mistyped or deleted ID fails silently at render time. During the recent refactor these references had to be validated by hand. Because the data model is the thing changing most often, this is where errors and rework concentrate.

**Component reuse — secondary pain.** `app.js` builds every card and table by concatenating HTML template-literal strings inside render functions (six `article` blocks, ten `innerHTML` assignments). It works at the current size, but each new section is copy-paste-and-tweak, and there is no shared "card" or "table" primitive. This friction grows as sections are added.

**UI styling — minor.** `styles.css` is 510 lines of readable, custom-property-based CSS. Its main issue is dead code: classes from the earlier decision/scoring version (`status-conditional`, `status-watchlist`, `status-gated`, `gate-pill`, etc.) are no longer used. This is cleanup, not a structural problem.

**Information architecture — not a tooling problem.** IA is the current active focus and is being revised on management feedback. That is content and layout work; no framework unblocks it, and changing tools mid-revision would slow it down.

**Deployment — not a pain point; it is an asset.** Zero-config, no build step, pushes straight to GitHub Pages, and is close to a single-file offline artifact. This simplicity is worth protecting.

---

## 2. What Astro would improve

- **Schema-validated data.** Astro content collections let you define a schema (Zod) for countries, cases, value-chain layers and sources. Broken `source_ids`, missing fields, or malformed estimates would fail the **build** instead of rendering blank. This directly targets the top pain point.
- **Real components.** Card, table row, filter bar and source group become reusable components with typed props and slots, replacing string concatenation in `app.js`.
- **Less client JavaScript.** Static content can be rendered at build time; only the interactive filters need to ship as "islands," shrinking the runtime code.
- **Still static.** `astro build` produces a static site that GitHub Pages can host.

## 3. What Tailwind would improve

- **Faster styling iteration** via utility classes, useful while the UI is still moving.
- **Kills the dead-CSS problem.** Styling lives next to markup, so unused rules do not accumulate the way the decision-era classes did.
- **Design consistency** through a shared token config (spacing, color, type) instead of ad-hoc values.

Note: the current CSS already uses custom properties for tokens, so Tailwind's marginal benefit here is smaller than in a codebase with no design system.

## 4. Risks they introduce

- **They add a build step and a Node toolchain.** This is the central conflict. It breaks the current push-to-deploy model and requires a GitHub Action to build Astro for Pages.
- **Locked-down corporate laptops.** `npm install`, Node, and registry access may be restricted or blocked. A vanilla project needs only a text editor and a browser; an Astro/Tailwind project needs a working Node build environment on every machine that edits it.
- **Offline single-file version gets harder.** Vanilla is already close to a self-contained artifact. Astro emits multiple files and expects a server or `fetch`; producing one inlined HTML file becomes an extra build concern. Tailwind's CDN/"play" build avoids a compile step but pulls a runtime dependency — bad for offline and locked-down use. Neither path is as clean as today's.
- **Churn on churn.** Migrating while IA, data, and dossiers are actively changing risks stalling the actual priorities and rewriting components that are still in flux.
- **Onboarding cost.** Whoever maintains the dashboard now needs framework familiarity, not just HTML/CSS/JS.

## 5. Migrate now or later?

**Later.** None of the current priorities — IA, appendix data migration, case dossiers, decision usefulness — is blocked by the absence of Astro or Tailwind, and both tools introduce a build step that fights the hard constraints (locked-down laptops, no backend, GitHub Pages simplicity, a possible offline single-file version). The data-model pain is real but can be addressed **without** a framework (see below), which also de-risks any future migration.

Revisit the decision once (a) the data model and IA have stabilized and (b) the section/component count has grown enough that string-templating is genuinely costly. At that point **Astro is the stronger candidate than Tailwind**, because the primary pain is data integrity and reuse, not styling — and Astro can still ship a static site to Pages via a GitHub Action.

## 6. What to fix first — before any migration

1. **Define and enforce the data model.** Write down the shape of each JSON file and add a small, dependency-free validator (a plain `validate.js` run by hand, or later in CI) that checks required fields and that every `source_id` resolves. This removes the biggest source of silent errors and becomes the exact schema an Astro content collection would use.
2. **Delete dead CSS.** Remove the unused decision-era classes so a future Tailwind move (or continued vanilla work) starts clean.
3. **Extract one render helper in `app.js`.** Collapse the repeated card/table string-building into a small shared function. This clarifies what "components" a framework would need and shrinks the migration surface.
4. **Decide the offline single-file requirement explicitly.** If a self-contained HTML file is a real deliverable, that constraint alone argues for staying vanilla (or for a build that inlines everything); resolve it before choosing tooling.
5. **Lock the IA / section structure.** Settle the six-section layout so components are not rebuilt repeatedly, then reassess.

**Bottom line:** stay on vanilla for now, invest the effort in data-model discipline and light cleanup, and treat Astro (not Tailwind) as the option to reconsider once the data and IA stop moving.
