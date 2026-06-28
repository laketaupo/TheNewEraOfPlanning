---
title: "System of Intelligence"
description: "How Planning Software generates exceptions and recommendations, why SoI outputs are only as good as their inputs, and how to diagnose when the intelligence layer gets it wrong."
chapter: "system-roles"
estimatedMinutes: 8
topicLayout: "prose-topic"
---

## What "System of Intelligence" Actually Means

The three-system model maps cleanly onto what any planning organisation is trying to do. A **system of record** holds what is true: the confirmed purchase order, the current stock on hand, the bill of materials for a product. A **system of engagement** is where work happens: a planner logs into Planning Software to review exceptions, a buyer opens ERP to confirm an order, a field technician records a harvest in FMS. A **system of intelligence** does something different — it takes data from both of those layers, runs logic against it, and surfaces an answer to the question *what should we do next?*

The critical word is *derivative*. SoI systems do not originate data. They interpret it. This is both their power and their vulnerability. Planning Software can run a sophisticated algorithm that nets supply against demand across 50,000 product-location combinations in minutes — but if the inventory positions it is consuming from ERP are twelve hours stale, or if a lead time in MDM was entered incorrectly, the algorithm produces a wrong answer with the same confidence it would produce a right one. The intelligence is in the logic. The quality is entirely in the inputs.

This distinction matters for how you govern the system. SoR governance asks: is this data correct? SoI governance asks something harder: is this recommendation right? And because planners often cannot answer that second question without tracing back to the first, SoI governance and SoR governance are not separate concerns — they are the same discipline looked at from different angles.

## How Planning Software Generates Intelligence

Planning Software generates intelligence through a process of continuous netting — matching expected future demand against all available supply signals, across every product, every location, and every time bucket in the horizon.

Demand signals enter the engine as a statistical baseline (generated from historical sales patterns), adjusted by commercial overlays where the sales or commercial team has introduced a view of market conditions, promotions, or new business. The result is a forward-looking demand forecast that represents what the organisation expects to need.

Supply signals come from multiple sources simultaneously: open purchase orders and production orders pulled from ERP, current inventory positions at every stocking location, Bills of Distribution and Bills of Materials from MDM that define how supply flows through the network, and field supply estimates from FMS representing crops, harvests, or field production that have not yet become confirmed orders. Planning Software aggregates all of this and compares it against the demand forecast, bucket by bucket, working forward through time.

Where demand exceeds available supply — accounting for lead times, safety stock targets, minimum order quantities, and supplier constraints — the planning engine flags a shortfall and generates a planned order to close the gap. Where supply is in excess of demand, it flags potential overstock or proposes delaying or cancelling open orders. This netting calculation runs across the full bill of materials, meaning a shortfall at a finished goods level propagates downward to component and raw material requirements automatically.

The scenario simulation layer extends this further. A planner can modify an assumption — change a supplier's confirmed quantity, adjust a forecast uplift, apply a capacity constraint — and ask the engine to recalculate. Planning Software reruns the full netting logic under the new assumption and makes the revised plan available for comparison against the baseline. This is where the intelligence becomes genuinely useful to senior planners: not just a picture of the current state, but a model for testing consequences before committing to a decision.

## Exception Management as the Primary Intelligence Output

The exception list is the mechanism that makes Planning Software valuable as an SoI. Without it, a planner would need to manually review the full supply plan every day to find the decisions that need attention — an impossible task at scale.

Exceptions surface the decisions that matter: this purchase order is past its release date, this product is projected to breach its safety stock threshold in week three, this production line has more capacity allocated than demand requires. Each exception represents a point where the plan is no longer self-managing and a human decision is required.

The quality of the SoI depends heavily on how exceptions are configured. Thresholds set too wide generate noise — planners see hundreds of exceptions each morning and begin ignoring them, which defeats the purpose. Thresholds set too narrow miss genuine problems until they become urgent. Getting exception configuration right is not a technical exercise; it is a process design exercise. It requires planners and planning managers to agree on what constitutes an actionable signal versus background variation, and it requires regular review as business conditions change.

Exception management also deteriorates silently if input data quality falls. A planner who sees the same late-order exception appear and resolve itself over several days may eventually begin discounting it — not knowing that the exception is flickering because the ERP integration feed is running inconsistently and inventory positions are being overwritten back and forth with each run. The exception was real; the pattern trained the planner to ignore it.

## BI and Reporting as a Secondary Intelligence Layer

BI tools — Power BI dashboards, embedded analytics, custom management reports — sit above Planning Software and ERP and combine their outputs to surface KPIs, trends, and historical performance. They are a secondary SoI layer, and an important distinction applies: they are read-only intelligence. They observe and surface patterns; they do not recommend or simulate.

A well-designed planning dashboard can show a planning manager the current OTIF performance, forecast accuracy trends, exception volumes by product category, and inventory coverage across the network — all drawn from data that has already been processed by ERP and Planning Software. This is genuinely valuable. But it creates a specific governance risk: a metric that looks correct on a dashboard may be calculated from data that contains gaps, inconsistencies, or classification errors that are invisible to the viewer.

Forecast accuracy reported at 87% may reflect a calculation that excludes new product introductions, or that measures against a revised forecast rather than an original baseline. Inventory coverage that shows fourteen weeks may include committed stock that has effectively already been allocated. The BI layer surfaces numbers; it does not audit the logic that produced them. This is why data governance and SoI governance have to be designed together — the credibility of a KPI is only as strong as the data model and business rules behind it.

## Why SoI Governance Is Harder Than SoR Governance

SoR governance has a clear verification path. You check whether a purchase order number is correct. You confirm whether a lead time in MDM matches the supplier's contract. The answer is binary: the data is right or it is wrong.

SoI governance has no equivalent simple test. A Planning Software recommendation to release a planned order for 2,400 units may be completely correct — or it may be based on a demand forecast that has not been updated in three weeks, an inventory position that does not reflect yesterday's goods receipt, and a safety stock parameter that was set for a product profile that no longer applies. Each of those inputs could be wrong in a way that makes the total recommendation look plausible to a planner who does not know to question it.

The failure mode is not obvious errors. It is credible-looking recommendations that are wrong for non-obvious reasons. An experienced planner with cross-system knowledge will catch these through intuition — "that recommendation doesn't feel right for this time of year" — and trace back to find the broken input. A less experienced planner, or a planner under time pressure, will release the order. The planning logic generated the recommendation correctly; the problem was never visible in the SoI.

This is the governance risk of SoI: the system looks like it is working right up until the moment the wrong decision reaches execution. The cost of that failure — an emergency procurement, a stockout, a write-off — is almost always higher than the cost of the input data problem that caused it.

## The Diagnostic Sequence

When a Planning Software recommendation looks wrong — or when the plan has clearly gone off track — the investigation needs to move bottom-up through the dependency stack. Starting at the SoI and trying to fix it there is the most expensive and least effective approach.

The correct sequence is:

**Step 1 — Check SoR data quality.** Are ERP inventory positions current? Have goods receipts been processed? Is the demand forecast up to date? Are the relevant MDM master data fields — lead times, Bills of Materials, safety stock levels — correctly maintained? If any of these contain errors or gaps, those errors will propagate through every layer above.

**Step 2 — Check integration health.** Did the ERP-to-Planning-Software feed run in the last scheduled window? Did it complete without errors? Are there any records that failed validation and were excluded from the load? Integration failures are silent — Planning Software will continue to display data and generate recommendations based on whatever it last received, without flagging that its information is out of date.

**Step 3 — Investigate planning logic or configuration.** Only once steps 1 and 2 confirm that the underlying data is sound and the feeds ran cleanly should you consider whether the planning logic, exception thresholds, or system configuration are the source of the problem. In practice, the majority of Planning Software issues trace back to steps 1 or 2.

Skipping the first two steps and going straight to planning logic is a common mistake, particularly when the visible symptom is a strange recommendation or an unexpected exception. The system *is* the intelligence layer — it draws attention and therefore draws suspicion. But it is also the layer least likely to be the root cause. Fixing a symptom at the SoI level, by overriding a recommendation or manually adjusting a plan number, addresses nothing in the underlying system. The same wrong recommendation will reappear next planning cycle.

The SoI is the top of the stack. Almost every failure starts at the bottom.
