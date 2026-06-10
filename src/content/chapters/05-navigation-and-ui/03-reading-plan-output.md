---
title: "Reading Plan Output"
description: "Plan output is what the o9 planning engine produces: planned orders, inventory projections, exception flags. Knowing how to read these outputs is the core skill of working in o9."
order: 3
chapter: "05-navigation-and-ui"
estimatedMinutes: 5
topicLayout: "prose-topic"
---

## The three types of plan output

The o9 planning engine produces three main types of output:

**1. Planned orders** — recommendations to order, produce, or transfer material. Each planned order has a quantity, a due date, a source (supplier, production resource, sending location), and a destination. Planned orders are proposals until they are released to the ERP as purchase orders, production orders, or transfer orders.

**2. Inventory projections** — the calculated stock position at each node, for each period, given the planned orders and demand signals. The projection shows whether stock is expected to be above or below the safety stock target, and identifies periods where stock is projected to reach zero (a shortage).

**3. Exception flags** — items where the calculated plan does not meet a defined target. Examples: projected stock below safety stock, a planned order that cannot be fulfilled by the required date, demand that exceeds available supply.

## Reading a planned order list

The planned order list shows all pending recommendations in date order. For each order, verify:
- **Item and location** — is this the right product at the right site?
- **Quantity** — does the quantity match the net requirement? Is it a round number due to minimum order quantity (MOQ) rounding?
- **Due date** — when does the order need to arrive? Is the due date within the supplier's lead time?
- **Source** — which supplier or production resource is assigned? Is this the intended source?

Items that appear unexpected in the planned order list (very large quantities, unusual timing, wrong source) should be investigated before release to ERP.

## Reading the inventory projection

The inventory projection is most readable as a waterfall chart or a time-bucketed grid row. Read it from left to right through time:

- **Opening stock** — what the plan starts with in the first period
- **Receipts** — planned order arrivals scheduled for each period
- **Demand** — expected consumption per period (from demand signals)
- **Closing stock** — opening + receipts − demand, carried forward as the next period's opening

A closing stock that drops below zero in any period is a projected shortage. A closing stock that significantly exceeds the safety stock target for many periods indicates excess inventory.

## Understanding exception flags

Exceptions in o9 use a standard severity coding:

- **Red / Critical** — the item will stock out within the actionable horizon (typically 4–6 weeks); a decision must be made now
- **Amber / Warning** — the item is at risk of stocking out within the planning horizon; action is needed soon
- **Green / Informational** — the item is within targets; no action required

An exception flag tells you *that* there is an issue. The inventory projection and planned order list tell you *why* — whether the shortage is caused by insufficient supply orders, a demand spike, a delayed shipment, or inadequate safety stock.

## Connecting output to action

The plan output is only valuable if it drives decisions. For each exception, the question is: what action resolves it? That action might be placing an expedited order, reducing a demand commitment, adjusting a safety stock parameter, or escalating to the S&OE meeting. The plan output tells you where the problem is; the planning process determines what to do about it.
