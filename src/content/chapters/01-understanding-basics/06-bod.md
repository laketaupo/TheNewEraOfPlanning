---
title: "BOD (Bill of Distribution)"
description: "The Bill of Distribution — how items move between locations and what constraints govern each transport lane."
order: 6
chapter: "01-understanding-basics"
estimatedMinutes: 3
widget: ""
nodeType: "transportation"
topicLayout: "node-topic"
summary: "A Transportation Process defines how an item moves from one location to another — without changing its form or identity. This is the Bill of Distribution (BOD) in Planning software, and it defines origin, destination, transit time, and shipment constraints. When demand exists at a downstream node, Planning software traces back through transportation lanes to find the upstream source. Unlike a transformation process, which happens at a node and changes an item, a transportation process happens between nodes and simply relocates it."
bullets:
  - "Moves an item without changing its form or identity"
  - "Defines origin node, destination node, and allowed item(s)"
  - "Carries transit time, min/max order quantity, and transport mode"
  - "Generates transfer orders or shipments in the execution system"
  - "Sourcing rules can prioritize lanes — e.g. nearest DC first"
---

## What is a Transportation Process?

A **Transportation Process** defines how items move from one location to another. This is the **Bill of Distribution (BOD)** in Planning software — the lanes and routes that form your distribution network.

Key attributes:

- **Origin** — the source node (warehouse, plant, supplier)
- **Destination** — the target node (DC, customer, store)
- **Item(s)** — which items can travel this lane
- **Transit time** — how many days/hours the movement takes
- **Minimum / maximum order quantity** — shipment constraints
- **Transport mode** — truck, rail, air, sea

## BOD vs. BOM

| Transformation Process (BOM) | Transportation Process (BOD) |
|---|---|
| Changes the *form* of an item | Moves an item without changing it |
| Happens *at* a node | Happens *between* nodes |
| Consumes resources (machines, labor) | Consumes transport capacity |
| Generates production orders | Generates transfer orders / shipments |

## How the Planner Uses BODs

When demand exists at a downstream node, Planning software traces back through transportation processes to find the upstream source. The planner can configure **sourcing rules** to prioritize lanes — e.g., ship from the nearest DC first, then escalate to the plant.

## Placeholder Content

*Replace this section with your specific distribution lanes, screenshots, or BOD examples from your network.*
