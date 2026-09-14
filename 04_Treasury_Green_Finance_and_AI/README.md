# 04 · Treasury Operations, Fundraising, Green Bonds & AI for Tax

> Four further workstreams from the internship. They relied on internal systems and data and were presented internally, so no work samples are included. This page summarizes the scope, method and takeaways.

| Workstream | Focus |
|---|---|
| [Treasury operations](#treasury-operations) | Daily and weekly cash reporting; group cash mobilization |
| [Corporate fundraising](#corporate-fundraising-multi-bank-rfq) | Multi-bank request for quotation and all-in cost comparison |
| [Green bonds](#alternative-funding-green-bonds) | Fit, cost of capital and fund-flow implications |
| [AI for tax](#ai-for-tax-retrieval-augmented-gst-assistant) | Source-grounded answers to GST questions |

## Treasury operations

- **Daily report:** cash balances by entity and bank, FX positions, and the day's inflows and outflows.
- **Weekly report:** rolling liquidity outlook, funding gaps and upcoming settlements for management review.
- **My part:** pulling data from bank portals, reconciliation, variance checks, and preparing the final report package.
- **Cash mobilization logic:** forecast needs → pool surplus cash → fund deficit entities → invest or repay the surplus. Intercompany funding can replace costlier external debt, and netting reduces FX and transfer costs.

**Takeaway:** every funding decision rests on reliable, same-day treasury data.

## Corporate fundraising (multi-bank RFQ)

A structured request-for-quotation process for new bank financing:

1. **Define the ask:** amount, tenor, currency and purpose.
2. **Approach relationship banks** for indicative terms.
3. **Collect quotes:** margin, reference rate, fees, covenants and timeline.
4. **Normalize** every offer to a common all-in cost basis.
5. **Recommend** on cost, flexibility and relationship value.

**Takeaway:** the lowest headline margin is not necessarily the lowest cost. Upfront fees, drawdown flexibility and execution speed change the ranking once quotes are put on the same basis.

## Alternative funding: green bonds

- **Fit for a fab:** semiconductor manufacturing is energy- and water-intensive, so efficiency upgrades, renewable power purchase agreements, water reclamation and green buildings map naturally to eligible green projects.
- **Requirements:** a green bond framework, a second-party opinion, and annual allocation and impact reporting.
- **Cost of capital:** the research indicated the "greenium" (the yield discount versus a comparable conventional bond) has narrowed to single-digit basis points and is partly offset by second-party-opinion and structuring costs.
- **Treasury implication:** proceeds must be ring-fenced and tracked until spent on eligible projects, so they cannot be swept freely into the group cash pool.

**Takeaway:** the case for green bonds is strategic (investor diversification and ESG alignment) rather than a pricing saving.

## AI for tax: retrieval-augmented GST assistant

- **Problem:** a general-purpose language model can give outdated or uncited answers to tax questions.
- **Approach:** retrieval-augmented generation (RAG). Tax guidance such as IRAS e-Tax guides and the GST Act is split into chunks and embedded; vector search retrieves the passages relevant to a question; the model answers only from those passages and cites them.
- **Why it matters:** answers follow current rules, and every answer carries a citation the tax team can check.
- **Proposed next step:** extend coverage from GST to corporate tax and transfer pricing.

**Takeaway:** for compliance questions, grounding and traceability matter more than fluent answers.

## Skills demonstrated

Treasury reporting and reconciliation · liquidity and cash management · debt financing analysis · sustainable finance · applied AI for finance (RAG)
