---
title: "Data Ownership"
description: "Every data element needs an owner — someone accountable for its accuracy, completeness, and currency. Without clear ownership, data quality degrades and no one is responsible for fixing it."
order: 2
chapter: "data-04-data-governance"
estimatedMinutes: 3
topicLayout: "prose-topic"
---

## What data ownership means

A data owner is the person or role responsible for a specific data element or data domain. Ownership means being accountable for:
- Ensuring the data is accurate and up to date
- Reviewing and approving changes to the data
- Investigating and resolving data quality issues
- Defining the standards and rules that govern how the data is managed

Data ownership is not the same as data entry. An operations manager may own the production capacity data even if they do not personally input it into MDM system. The owner defines what the data should be; others may maintain the technical records.

## Data ownership in the planning context

For supply chain planning, the key data domains and their typical owners are:

| Data domain | Typical owner |
|---|---|
| Item master / product hierarchy | Master Data Manager / Product team |
| BOM and BOD structures | Engineering / Supply Chain design |
| Planning parameters (lead times, MOQs) | Planning Manager / Supply Chain |
| Demand forecast | Demand Planner / Commercial |
| Customer master | Commercial / Sales Operations |
| Supplier master | Procurement |
| Inventory positions | Warehouse / Operations |
| Grower contracts and field data | Agricultural / Field team |

## Why ownership gaps cause data problems

When data has no clear owner, it accumulates errors over time. No one is responsible for noticing when a lead time becomes outdated, when a BOM ratio changes after a product reformulation, or when a new customer location is missing from the network. The data silently becomes wrong, and the planning model silently produces wrong outputs.

Ownership gaps are especially common at the boundaries between functions. Who owns the planning parameters that sit at the intersection of procurement (supplier lead times) and planning (how those times are used in the model)? If the answer is "both" or "neither," there is a governance gap.

## Operationalising data ownership

Data ownership only has value if it is exercised. Owners need:
- A defined process for how data change requests are submitted and approved
- A review cadence — when do they review their data domain to check for accuracy?
- Escalation authority — if someone uses data incorrectly (e.g., overrides a parameter in Planning software without updating MDM system), the owner has the authority to require correction

Documenting data owners in a data catalogue (even a simple spreadsheet) and reviewing it in the S&OP cycle is enough to make ownership operational. The goal is not bureaucracy — it is ensuring that someone can be called when a data problem is found.
