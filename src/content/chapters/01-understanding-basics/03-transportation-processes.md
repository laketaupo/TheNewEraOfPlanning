---
title: "Transportation Processes (BOD)"
description: "How items move between locations — the Bill of Distribution defining your distribution network."
order: 3
chapter: "01-understanding-basics"
estimatedMinutes: 3
widget: ""
nodeType: "transportation"
summary: "A Transportation Process defines how an item moves from one location to another — without changing its form or identity. This is the Bill of Distribution (BOD) in o9, and it defines origin, destination, transit time, and shipment constraints. When demand exists at a downstream node, o9 traces back through transportation lanes to find the upstream source. Unlike a transformation process, which happens at a node and changes an item, a transportation process happens between nodes and simply relocates it."
---

## What is a Transportation Process?

A **Transportation Process** defines how items move from one location to another. This is the **Bill of Distribution (BOD)** in o9 — the lanes and routes that form your distribution network.

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

When demand exists at a downstream node, o9 traces back through transportation processes to find the upstream source. The planner can configure **sourcing rules** to prioritize lanes — e.g., ship from the nearest DC first, then escalate to the plant.

## Placeholder Content

*Replace this section with your specific distribution lanes, screenshots, or BOD examples from your network.*
