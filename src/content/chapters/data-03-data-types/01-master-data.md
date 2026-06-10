---
title: "Master Data"
description: "Master data is the stable, reference information that describes the objects in the planning model — items, locations, customers, suppliers. It changes slowly but when it's wrong, everything built on it is wrong."
order: 1
chapter: "data-03-data-types"
estimatedMinutes: 4
topicLayout: "prose-topic"
---

## What master data is

Master data is the foundational reference information that describes the entities the business operates with. It is not about what happened (that's transactional data) or what should happen (that's a plan). It is about what exists: which products are sold, which locations handle them, which suppliers provide them, and what the relationships between these entities are.

In supply chain planning, the core master data entities are:

- **Items / SKUs** — the products being planned. Each item has attributes: a code, a description, a unit of measure, a product family, and planning-specific attributes like lead time and lot size.
- **Locations** — the nodes in the supply network: factories, warehouses, distribution centres, and customer delivery points. Each location has attributes: capacity, handling capabilities, lead time to and from other nodes.
- **Customers** — who receives the product. Customer master data includes delivery addresses, service level commitments, and commercial tier.
- **Suppliers** — who provides inputs. Supplier master data includes lead times, minimum order quantities, and approved item-supplier pairings.
- **BOM / BOD structures** — the relationships between items (what inputs make what outputs) and between locations (how products flow through the network). These are sometimes treated as separate entities but are part of the master data ecosystem.

## Why master data quality is critical

The planning model is built entirely on master data. If an item's lead time is wrong, the plan will schedule orders at the wrong time. If a BOM ratio is incorrect, the plan will calculate the wrong raw material requirements. If a location's capacity is missing, the plan will ignore a real constraint.

Master data errors are particularly dangerous because they are structural: a wrong parameter doesn't cause a one-time planning mistake, it causes every planning run to produce a wrong result until the parameter is corrected.

## Master data ownership

In the four-system landscape, MDM system is the master data management system — the authoritative source for item, BOM, and BOD master data. Changes to master data should always start in MDM system, not in Planning software or ERP. A change made directly in Planning software will be overwritten by the next MDM system sync.

Master data has defined owners — typically a data management team rather than the planning team. When a planner identifies a master data error, the correct process is to raise it with the data owner, not to apply a manual workaround in Planning software.

## Master data change management

Master data changes are not trivial. A new item needs to be set up in MDM system, synced to Planning software and ERP, and have its planning parameters validated before it appears correctly in the planning model. A lead time change affects every future planned order for that item. Changes need to be managed through a structured process — not made ad hoc by whoever notices a discrepancy first.
