---
title: "Planning software ↔ FMS & MDM system"
description: "FMS feeds field-level supply signals into Planning software; MDM system feeds the master data that makes those signals interpretable. Understanding these integrations is essential for data quality management."
chapter: "arch-how-systems-connect"
estimatedMinutes: 4
topicLayout: "prose-topic"
---

## FMS → Planning software

FMS is the Field Management System (FMS) that tracks grower activity: contracted planting areas, field operations, crop development stage, and expected harvest quantities. This data is the supply-side foundation of the planning model — Planning software plans against what growers are expected to produce.

**What flows from FMS to Planning software:**
- **Grower contracts** — which growers are contracted for which crop varieties, quantities, and delivery timing
- **Planted area** — confirmed hectares planted per variety and location
- **Crop stage and forecast** — current development stage and projected yield, updated as the season progresses
- **Expected harvest dates** — when produce is expected to arrive at the first collection or processing point

**Integration frequency:** Typically weekly at the start of the season, moving to daily as harvest approaches and field conditions become more dynamic.

**Key dependency:** The crop variety codes in FMS must match the item codes in Planning software (and MDM system). If FMS uses a different naming convention than Planning software, a mapping table in the middleware must translate between them. This mapping is a common source of integration failures when new varieties are introduced.

## MDM system → Planning software

MDM system is the Master Data Management (MDM) system — the single source of truth for product attributes, item hierarchies, and planning parameters. Planning software does not maintain its own master data; it receives it from MDM system.

**What flows from MDM system to Planning software:**
- **Item master** — item codes, descriptions, units of measure, product hierarchy
- **BOMs** — bill of material structures (which inputs go into which outputs, in what ratios)
- **BODs** — bill of distribution structures (how products flow through the distribution network)
- **Planning parameters** — lead times, minimum order quantities, safety stock targets, lot sizes

**Integration frequency:** Daily (for parameter changes) or triggered on change (for new items and structural changes).

**Key dependency:** Any item that exists in MDM system but has not yet been synchronised to Planning software cannot be planned. New product introductions require a MDM system → Planning software sync to complete before Planning software can include them in the planning model.

## The master data dependency chain

The full dependency for a new item to be plannable end-to-end:
1. Item created in MDM system with correct attributes
2. Item synced to Planning software (MDM system → Planning software interface)
3. Item synced to ERP (MDM system → ERP interface)
4. If applicable: item set up in FMS with grower contract linkage
5. Planning parameters reviewed and confirmed in Planning software

Missing any step in this chain results in an item that appears in one system but not another — creating reconciliation exceptions and planning gaps.
