---
title: "Adjusting Parameters & Assumptions"
description: "The substance of a scenario is the change you make to the model. This topic covers the main levers — demand, supply, capacity, and time — and how to adjust them precisely."
order: 2
chapter: "process-02-running-scenarios"
estimatedMinutes: 5
topicLayout: "prose-topic"
---

## Working inside the scenario

Once a scenario is created, you work within it exactly as you would in the baseline plan — the same workbenches, the same views, the same tools. The difference is that every change you make stays inside the scenario boundary.

Before making any adjustments, confirm you are inside the correct scenario. Planning software typically displays the active scenario name in the header or context bar. Working in the wrong scenario — or accidentally in the baseline — is a common mistake.

## Demand adjustments

To model a demand change, navigate to the demand workbench within your scenario. You can:

- **Override a specific forecast quantity** for a defined item, location, and time period
- **Apply a percentage uplift** across a product group or customer segment
- **Replace the statistical forecast** with a manual entry for one or more periods

When adjusting demand, document the source of the change in the override comment field. "Per commercial team email 12 June — promotion uplift estimate" is more useful than "override."

## Supply adjustments

To model a supply constraint, navigate to the supply or capacity workbench within your scenario. Common adjustments:

- **Reduce a supplier's available quantity** for specific items and periods — represents a supplier shortage or quality hold
- **Block a production resource** for a defined period — represents planned or unplanned downtime
- **Extend a lead time** for a lane or item — represents a logistics disruption

## What not to change in a scenario

Avoid changing planning parameters (safety stock targets, reorder policies, minimum order quantities) inside a scenario unless the scenario is specifically testing parameter changes. Changing parameters alongside demand or supply obscures the cause of any plan differences you observe.
