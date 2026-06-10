---
title: "Data Definitions & Single Source of Truth"
description: "When the same concept means different things in different systems or to different people, planning decisions get made on inconsistent data. Clear definitions and a single source of truth are the foundation of data reliability."
order: 3
chapter: "data-04-data-governance"
estimatedMinutes: 4
topicLayout: "prose-topic"
---

## The definition problem

In any organisation with multiple systems and multiple functions, the same term can mean different things to different people. "Available inventory" might mean:
- Total on-hand stock (warehouse view)
- On-hand minus safety stock (planning view)
- On-hand minus safety stock minus open customer orders (commercial view)
- On-hand minus all holds and reservations (quality view)

If the planning team and the commercial team use the same word but different definitions, their numbers will never match — and the resulting conversation is not a data quality discussion, it is a definition alignment discussion. Until the definition is agreed, the data quality question cannot even be properly assessed.

## Common definition conflicts in planning

**Lead time** — is this supplier lead time only, or does it include internal processing time? Does it include weekends and holidays or working days only? Is it the average, the median, or a pessimistic estimate?

**Forecast** — is this the statistical forecast, the adjusted forecast, the consensus demand plan, or the financial budget? These can differ significantly and using the wrong one in the planning model has immediate consequences.

**Stock** — on-hand only, or including in-transit? Including goods in quality hold, or excluding them? Including finished goods at field collection points, or only stock in registered warehouses?

**Order quantity** — gross quantity ordered, or net quantity confirmed? Including returns, or excluding them?

Each of these distinctions seems minor in isolation. Collectively, they represent major sources of planning error.

## The single source of truth principle

The single source of truth (SSoT) principle is that for any given data element, there is exactly one authoritative source — one system, one version, one number that is the agreed reference. All other representations of that data should be derived from or consistent with the SSoT.

In the four-system landscape:
- **Item master** → SSoT is MDM system. The Planning software and ERP item records are derived from MDM system.
- **Inventory positions** → SSoT is ERP. The Planning software planning model uses ERP's inventory as its starting point.
- **Demand signals** → SSoT is Planning software. The demand plan in Planning software is the authoritative planning version; Excel spreadsheets used in commercial discussions are not.
- **Grower contracts** → SSoT is FMS. The contracted supply figures used in planning come from FMS.

The SSoT principle breaks down when people maintain parallel versions of the same data in different systems — a commercial team that maintains its own demand forecast in Excel alongside the official Planning software forecast, or a planner who adjusts lead times directly in Planning software without updating MDM system. These parallel versions create conflicting "authoritative" numbers and undermine trust in the planning process.

## Establishing definitions in practice

Data definitions do not need to be complex. A simple data dictionary — even a shared spreadsheet — that records the agreed definition for each key planning metric is sufficient. The important thing is that it is agreed (not just written by one function and ignored by others), accessible to all who use the data, and reviewed periodically as the business evolves.

When a definition conflict is discovered, resolve it at the right level: the S&OP process is the appropriate forum for aligning commercial and planning on demand definitions; a cross-functional data governance review is the forum for broader definitional conflicts. Do not leave definition conflicts unresolved — they compound over time and erode the credibility of the planning model.
