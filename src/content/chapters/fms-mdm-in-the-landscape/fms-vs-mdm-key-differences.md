---
title: "FMS vs MDM: Key Differences"
description: "FMS and MDM are often confused because both feed Planning software — but they manage entirely different data types and serve entirely different planning needs."
chapter: "fms-mdm-in-the-landscape"
estimatedMinutes: 5
topicLayout: "prose-topic"
---

| Dimension | FMS | MDM |
|---|---|---|
| **Data type** | Operational field data (what is growing, where, when) | Reference master data (what products are, how they are structured) |
| **Data owner** | Field operations / agronomists | Product management / data stewardship teams |
| **Change frequency** | Daily to weekly (as growing conditions evolve) | Event-driven (new product, supplier change, reformulation) |
| **Effect on planning** | Changes supply-side quantity and timing in Planning software | Changes the structural rules Planning software and ERP use to plan and execute |
| **Risk if wrong** | Supply plan is built on incorrect yield or timing data | Plans and transactions use wrong parameters, BOMs, or item codes |
| **Who notices first** | Supply planner (unexpected supply signal change) | Demand or supply planner (item missing from plan, wrong netting logic) |

The practical implication: FMS errors tend to surface as **quantity or timing surprises** in the plan. MDM errors tend to surface as **structural gaps** — items that cannot be planned, transactions that fail validation, or parameters that produce nonsensical plan outputs.
