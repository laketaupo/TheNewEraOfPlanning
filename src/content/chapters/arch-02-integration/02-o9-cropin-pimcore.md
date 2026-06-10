---
title: "o9 ↔ Cropin Grow & Pimcore"
description: "Cropin Grow feeds field-level supply signals into o9; Pimcore feeds the master data that makes those signals interpretable. Understanding these integrations is essential for data quality management."
order: 2
chapter: "arch-02-integration"
estimatedMinutes: 4
topicLayout: "prose-topic"
---

## Cropin Grow → o9

Cropin Grow is the Field Management System (FMS) that tracks grower activity: contracted planting areas, field operations, crop development stage, and expected harvest quantities. This data is the supply-side foundation of the planning model — o9 plans against what growers are expected to produce.

**What flows from Cropin to o9:**
- **Grower contracts** — which growers are contracted for which crop varieties, quantities, and delivery timing
- **Planted area** — confirmed hectares planted per variety and location
- **Crop stage and forecast** — current development stage and projected yield, updated as the season progresses
- **Expected harvest dates** — when produce is expected to arrive at the first collection or processing point

**Integration frequency:** Typically weekly at the start of the season, moving to daily as harvest approaches and field conditions become more dynamic.

**Key dependency:** The crop variety codes in Cropin must match the item codes in o9 (and Pimcore). If Cropin uses a different naming convention than o9, a mapping table in the middleware must translate between them. This mapping is a common source of integration failures when new varieties are introduced.

## Pimcore → o9

Pimcore is the Master Data Management (MDM) system — the single source of truth for product attributes, item hierarchies, and planning parameters. o9 does not maintain its own master data; it receives it from Pimcore.

**What flows from Pimcore to o9:**
- **Item master** — item codes, descriptions, units of measure, product hierarchy
- **BOMs** — bill of material structures (which inputs go into which outputs, in what ratios)
- **BODs** — bill of distribution structures (how products flow through the distribution network)
- **Planning parameters** — lead times, minimum order quantities, safety stock targets, lot sizes

**Integration frequency:** Daily (for parameter changes) or triggered on change (for new items and structural changes).

**Key dependency:** Any item that exists in Pimcore but has not yet been synchronised to o9 cannot be planned. New product introductions require a Pimcore → o9 sync to complete before o9 can include them in the planning model.

## The master data dependency chain

The full dependency for a new item to be plannable end-to-end:
1. Item created in Pimcore with correct attributes
2. Item synced to o9 (Pimcore → o9 interface)
3. Item synced to BC (Pimcore → BC interface)
4. If applicable: item set up in Cropin Grow with grower contract linkage
5. Planning parameters reviewed and confirmed in o9

Missing any step in this chain results in an item that appears in one system but not another — creating reconciliation exceptions and planning gaps.
