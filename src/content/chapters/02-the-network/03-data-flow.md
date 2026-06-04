---
title: "How Data Flows Through the Network"
description: "From demand signal to supply order — how information travels across the graph."
order: 3
chapter: "02-the-network"
estimatedMinutes: 4
widget: ""
---

## Demand Flows Downstream → Upstream

In o9, demand originates at the **customer-facing end** of the network (finished goods, stores, distribution centres) and is propagated **upstream** through the graph until every raw material and resource need is quantified.

```
Customer Demand
      │
      ▼
Finished Good (Item)
      │  [via BOD — Transportation Process]
      ▼
Distribution Centre
      │  [via BOM — Transformation Process]
      ▼
Semi-finished Good
      │  [via BOM — Transformation Process]
      ▼
Raw Materials   +   Resources
```

Each hop in this chain is a graph traversal — o9 follows edges automatically to explode demand into component-level requirements.

## Supply Signals Flow in Reverse

When the engine creates supply orders, confirmation and availability signals flow **downstream** — from suppliers to finished goods — updating inventory projections and flagging any gaps.

## Real-Time Propagation

Because the data model is a graph, changes propagate in real time:

1. A supplier confirms a delay → the relevant **Sources** edge is updated
2. The engine re-traverses all downstream paths that depend on this supplier
3. Affected items, production orders, and customer commitments are flagged
4. Planners see alerts on their workbench — no overnight batch required

## Placeholder Content

*Add a flow diagram specific to your supply chain, or describe a real scenario where this propagation helped your team.*
