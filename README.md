# Internship Portfolio — Treasury & Corporate Finance, UMC Singapore

**Max Chen** · Intern, Treasury, Corporate Finance & FinTech Initiatives · UMC Singapore · 2026

This portfolio documents the analytical work I produced during my internship, organized as four case studies. Each one follows the same structure — **question → approach → output → takeaways → skills** — and states clearly what is included and what is only summarized.

> **Confidentiality.** Everything here is either built from public sources or rewritten in de-identified, illustrative form. No company-internal figures, transactions, tax positions or management recommendations are included. Internal deliverables are described, not attached.

## Portfolio map

| # | Case study | Business question | What I produced | Included here |
|---|---|---|---|---|
| [01](01_SEA_Semiconductor_Landscape/README.md) | Southeast Asia semiconductor landscape | For a specialty foundry already anchored in Singapore, which public facts about the rest of Southeast Asia should actually change a judgment? | Plain-language, evidence-graded web dashboard: key takeaways, a country × supply-chain overview and country profiles, built on 99 graded data points from 24 sources; five iterations | Runnable dashboard, screenshots |
| [02](02_Cross-Border_Funding_and_Tax/README.md) | Cross-border funding structure & withholding tax | How should a Taiwan head office fund its Singapore branch, and what does each route cost after tax? | Two decision decks and a withholding-tax operating framework (internal) | De-identified case study |
| [03](03_Borrowing_Cost_and_FX_Sensitivity/README.md) | Borrowing cost & FX sensitivity | When does borrowing in the lower-rate currency stop being cheaper once FX moves are included? | Two parameterized Excel models and a break-even heatmap | 2 models, heatmap |
| [04](04_Treasury_Green_Finance_and_AI/README.md) | Treasury operations, fundraising, green bonds, AI for tax | How can reporting, funding comparisons, green finance and tax support be made more reliable? | Reporting packages, bank-quote comparison, green bond research, RAG use case | Summary |

## Skills at a glance

| Skill | 01 | 02 | 03 | 04 |
|---|:-:|:-:|:-:|:-:|
| Industry and policy research, source verification | ● | | | ● |
| Corporate finance: capital structure, cost of funding | | ● | ● | ● |
| Cross-border tax: Singapore withholding tax, permanent establishments, economic substance | | ● | | |
| Financial modeling and sensitivity analysis | | | ● | |
| Data modeling and front-end development (HTML, CSS, JavaScript, JSON) | ● | | | |
| Decision frameworks and executive communication (English / Mandarin Chinese) | ● | ● | ● | ● |
| Treasury operations and liquidity management | | | | ● |
| Applied AI: retrieval-augmented generation | | | | ● |

## Folder structure

```text
UMCSG_Internship_Portfolio/
├── README.md                                   ← you are here
├── 01_SEA_Semiconductor_Landscape/
│   ├── README.md                               ← case study
│   ├── dashboard/                              ← runnable static web app (public data only)
│   └── assets/                                 ← screenshots
├── 02_Cross-Border_Funding_and_Tax/
│   └── README.md                               ← de-identified case study
├── 03_Borrowing_Cost_and_FX_Sensitivity/
│   ├── README.md
│   ├── borrowing_cost_sensitivity_model.xlsx
│   ├── fx_rate_sensitivity_model.xlsx
│   └── fx_borrowing_cost_heatmap.png
└── 04_Treasury_Green_Finance_and_AI/
    └── README.md
```

## Viewing the dashboard

The dashboard loads its data with `fetch`, so it needs to be served over HTTP:

```bash
cd 01_SEA_Semiconductor_Landscape/dashboard
python -m http.server 8000
```

Then open <http://localhost:8000>. See the [dashboard README](01_SEA_Semiconductor_Landscape/dashboard/README.md) for details.

## Notes

- The Excel models and heatmap keep their original Chinese labels; case study 03 explains them in English.
- Tax content describes public rules in simplified, illustrative form. It is not tax or legal advice.
