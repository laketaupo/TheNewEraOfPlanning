---
title: "What Is MDM?"
description: "MDM system is the single source of truth for product master data. Understanding its role — and what breaks without it — is the foundation for working cleanly across Planning software, ERP, and FMS."
chapter: "mdm-01-understanding-basics"
estimatedMinutes: 4
topicLayout: "prose-topic"
---

## What MDM system does

MDM system is the Master Data Management (MDM) platform. Its job is to be the single source of truth for product and item data — ensuring that the description, attributes, hierarchy, and identifiers for every product are defined once, kept current, and distributed to all downstream systems consistently.

Without a central MDM, each system maintains its own item master. Over time, these diverge: Planning software uses one item code, ERP uses a slightly different description, FMS uses a field variety name that doesn't map cleanly. The MDM exists to prevent this divergence.

## What data lives in MDM system

**Item master:** The core record for each product: item code, name, description, unit of measure, product family, and crop variety attributes. Every item that will be planned, transacted, or contracted must have a record in MDM system first.

**Product hierarchy:** How items are grouped — into product families, categories, and reporting hierarchies. These hierarchies are used in Planning software for aggregated planning views and in ERP for reporting.

**Planning parameters:** Lead times, minimum order quantities, lot sizes, and shelf-life constraints are stored in MDM system and distributed to Planning software. This means a change to a planning parameter should be made in MDM system, not directly in Planning software — otherwise the next sync will overwrite the manual change.

**BOM and BOD structures:** The bill of material (what inputs make what outputs) and bill of distribution (how products flow through the supply network) are defined in MDM system and synchronised to Planning software.

## Planner interactions with MDM system

Planners typically do not work directly in MDM system — that is the responsibility of the master data team. But planners need to understand when a master data change is needed and how to request it through the correct process.

Common situations requiring a MDM system update:
- A new crop variety needs to be added before the planning cycle starts
- A lead time parameter has changed based on a supplier agreement revision
- A product hierarchy is being restructured for a new reporting requirement

**The key rule:** If a parameter in Planning software is being manually overridden repeatedly, the correct fix is to update it in MDM system — not to keep overriding it in Planning software. Manual overrides in Planning software are temporary; they will be overwritten by the next MDM system sync.

## Data stewardship

MDM system data quality is maintained by data stewards — typically a business-facing data management team rather than IT. Each data domain (items, hierarchies, parameters) has a defined owner responsible for accuracy and completeness. Planners who identify data quality issues should route them through the data steward, not fix them directly in Planning software or ERP.
