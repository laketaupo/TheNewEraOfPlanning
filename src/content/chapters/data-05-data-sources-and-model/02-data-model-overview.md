---
title: "The Planning software Data Model Overview"
description: "Planning software represents the supply chain as a graph of connected nodes. Understanding this structure is the foundation for understanding how data works."
order: 2
chapter: "data-05-data-sources-and-model"
estimatedMinutes: 4
topicLayout: "prose-topic"
---

## A graph, not a spreadsheet

Traditional planning tools store data in flat tables — rows and columns. Planning software uses a **graph model**: nodes (items, locations, resources) connected by edges that represent relationships (a BOM link, a transportation lane, a production step).

This distinction matters because the graph reflects reality. A supply chain isn't a table — it's a network. Raw materials feed into components, components into finished goods, goods into warehouses, warehouses into customers. The graph captures these flows explicitly.

## The core building blocks

You met these in the Technology pillar, but they're worth revisiting from a data perspective:

- **Items** — the SKUs being planned. Each item is a node with attributes: description, unit of measure, lead time, safety stock settings.
- **Locations** — where items are held or produced. Each location is a node with its own attributes: capacity, timezone, opening hours.
- **Item at Location (IAL)** — the pairing of an item and a location. This is the actual planning object: "Product X at Warehouse Y."
- **Resources** — production lines, machines, or labor that have capacity constraints.
- **BOMs** — bill of materials edges connecting parent items to their components.
- **Transportation lanes** — edges connecting source and destination locations with lead time and cost.

## What data lives where

Each node and edge in the graph carries data. Item nodes carry demand forecasts. IAL nodes carry inventory levels. BOM edges carry yield ratios. Transportation lane edges carry transit times.

When the planning engine runs, it traverses this graph — reading data from each node and edge — and calculates planned orders, transfers, and production schedules. Change the data on any node or edge, and the plan changes with it.

This is why data accuracy is not a reporting concern — it is a planning concern. Bad data on any node in the graph propagates into the plan.
