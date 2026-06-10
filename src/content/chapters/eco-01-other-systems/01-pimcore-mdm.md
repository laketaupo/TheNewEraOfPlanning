---
title: "Pimcore: Master Data Management"
description: "Pimcore is the MDM system — the authoritative source for product master data, item attributes, and the data structures that other systems depend on. Understanding its role prevents data quality issues."
order: 1
chapter: "eco-01-other-systems"
estimatedMinutes: 4
topicLayout: "prose-topic"
---

## What Pimcore does

Pimcore is the Master Data Management (MDM) platform. Its job is to be the single source of truth for product and item data — ensuring that the description, attributes, hierarchy, and identifiers for every product are defined once, kept current, and distributed to all downstream systems consistently.

Without a central MDM, each system maintains its own item master. Over time, these diverge: o9 uses one item code, BC uses a slightly different description, Cropin uses a field variety name that doesn't map cleanly. The MDM exists to prevent this divergence.

## What data lives in Pimcore

**Item master:** The core record for each product: item code, name, description, unit of measure, product family, and crop variety attributes. Every item that will be planned, transacted, or contracted must have a record in Pimcore first.

**Product hierarchy:** How items are grouped — into product families, categories, and reporting hierarchies. These hierarchies are used in o9 for aggregated planning views and in BC for reporting.

**Planning parameters:** Lead times, minimum order quantities, lot sizes, and shelf-life constraints are stored in Pimcore and distributed to o9. This means a change to a planning parameter should be made in Pimcore, not directly in o9 — otherwise the next sync will overwrite the manual change.

**BOM and BOD structures:** The bill of material (what inputs make what outputs) and bill of distribution (how products flow through the supply network) are defined in Pimcore and synchronised to o9.

## Planner interactions with Pimcore

Planners typically do not work directly in Pimcore — that is the responsibility of the master data team. But planners need to understand when a master data change is needed and how to request it through the correct process.

Common situations requiring a Pimcore update:
- A new crop variety needs to be added before the planning cycle starts
- A lead time parameter has changed based on a supplier agreement revision
- A product hierarchy is being restructured for a new reporting requirement

**The key rule:** If a parameter in o9 is being manually overridden repeatedly, the correct fix is to update it in Pimcore — not to keep overriding it in o9. Manual overrides in o9 are temporary; they will be overwritten by the next Pimcore sync.

## Data stewardship

Pimcore data quality is maintained by data stewards — typically a business-facing data management team rather than IT. Each data domain (items, hierarchies, parameters) has a defined owner responsible for accuracy and completeness. Planners who identify data quality issues should route them through the data steward, not fix them directly in o9 or BC.
