---
title: "Inventory Netting"
description: "On-hand inventory is the first source of supply. The planning engine nets available stock before triggering any new planned order."
order: 2
chapter: "04-supply-data-flow"
estimatedMinutes: 4
---

## Netting in detail

Before the planning engine creates a new planned order, it calculates the **net requirement** at each node:

```
Net requirement = Gross demand − On-hand inventory + Safety stock floor
```

If net requirement ≤ 0, existing inventory covers the demand and no planned order is needed. If net requirement > 0, the engine schedules a planned order for exactly that quantity (or rounded up to the minimum order quantity if one is set on the process).

## Example: Item D at the Central Warehouse

Recall from Chapter 3 that Calibrating needs ~167 units of Item D. Suppose the Central Warehouse already holds **40 units** of Item D with a safety stock of **20 units**:

| Component | Quantity |
|-----------|---------|
| Gross demand (from Calibrating) | 167 units |
| On-hand inventory | 40 units |
| Safety stock floor | 20 units |
| Available to net | 40 − 20 = **20 units** |
| **Net requirement** | 167 − 20 = **147 units** |

Cleaning is therefore scheduled to produce 147 units of Item D, not 167. The existing 20 units above safety stock cover the remainder.

## Safety stock as a buffer

Safety stock is not a luxury — in agriculture, it protects against forecast error, crop failures, and shipment delays. If actual demand comes in higher than forecast, the safety stock absorbs the shock. If a growing season yields less than expected, safety stock at Item C buys time while an emergency supply is arranged.

Setting safety stock correctly is a planning decision. Too high and capital is tied up in idle inventory; too low and a single disruption propagates stockouts downstream.

## Time-phased inventory

Inventory is not just a static number — it changes period by period as planned orders arrive and demand consumes stock. Planning software maintains a **projected inventory profile** for each line item, showing the expected on-hand balance week by week across the planning horizon.

The engine nets against this time-phased profile, not just today's snapshot. A planned order arriving in Week 12 contributes to the available balance from Week 12 onwards, potentially eliminating the need for a further order in Week 13.

## Parent line items driving netting

The parent line item relationship (introduced in Chapter 3) is equally important on the supply side. The output of each planned order — say, 147 units of Item D from Cleaning — becomes part of the projected inventory of Item D at the Central Warehouse. That projected inventory is then available to net against the gross demand from Calibrating in the same or later periods.

This chain of netting across parent line items is what the planning engine optimises: it seeks the sequence of planned orders that satisfies all demand, respects all safety stocks and capacity limits, and minimises total cost.
