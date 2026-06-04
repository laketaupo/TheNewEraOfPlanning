---
title: "Nodes & Relationships"
description: "The types of nodes in the o9 network and how they relate to each other."
order: 2
chapter: "02-the-network"
estimatedMinutes: 3
widget: ""
---

## Node Types in the Network

Every entity in o9 is a node in the graph. The four primary node types map directly to the building blocks you learned in Chapter 1:

| Node Type | Represents | Example |
|---|---|---|
| **Item Node** | A product, material, or SKU | "Finished Good — 500ml Bottle" |
| **Location Node** | A physical or logical place | "Plant Amsterdam", "DC Rotterdam" |
| **Resource Node** | A constrained capacity unit | "Filling Line 2" |
| **Process Node** | A transformation or transportation step | "Fill & Cap Process", "Amsterdam → Rotterdam Lane" |

## Relationship Types (Edges)

Nodes are connected by typed edges that carry planning data:

| Edge | From → To | Data carried |
|---|---|---|
| **Produces** | Process → Item | Yield, lead time |
| **Consumes** | Process → Item | Input quantity, scrap rate |
| **Uses** | Process → Resource | Consumption rate, type |
| **Sources** | Location → Location | Transit time, MOQ |
| **Stocks** | Item → Location | Safety stock, reorder point |

## Reading the Network

A fully wired network lets you ask:

- *"What is needed to produce 1,000 units of Product A at Plant X?"* → traverse **Consumes** edges
- *"Which resources are loaded above 90% in week 12?"* → traverse **Uses** edges with capacity data
- *"What is the fastest path from Supplier to Customer?"* → traverse **Sources** edges

## Placeholder Content

*Add a node diagram or network map from your o9 environment here.*
