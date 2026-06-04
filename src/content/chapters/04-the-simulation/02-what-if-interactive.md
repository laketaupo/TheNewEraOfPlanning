---
title: "What-If Analysis"
description: "Adjust demand, supply, and capacity levers and instantly see how the plan responds."
order: 2
chapter: "04-the-simulation"
estimatedMinutes: 5
widget: "what-if"
---

## Try It: What-If Simulator

Use the interactive widget below to explore how changes to key planning inputs affect the resulting supply plan.

**How to use:**
- Drag the sliders to adjust demand, supply capacity, and lead time
- The plan metrics update in real time
- Watch which KPI turns red first — that's your binding constraint

*The numbers below are illustrative and based on a simplified planning model.*

<!-- Widget rendered by the page layout when widget = "what-if" -->

## What You're Seeing

| Metric | Meaning |
|---|---|
| **Service level** | % of demand fulfilled on time and in full (OTIF) |
| **Inventory days** | Average days of cover across all SKUs |
| **Capacity utilization** | Peak resource load as % of available capacity |
| **Plan feasibility** | Whether the plan can be executed without violations |

## Key Insights

- **Demand up + same capacity** → service level drops, inventory depletes, capacity overloads
- **Lead time increase** → more safety stock needed to maintain service level
- **Capacity reduction** → constrained plan shifts volume to later periods or drops low-priority demand

## Placeholder Content

*Customize the widget's baseline numbers to reflect your actual planning parameters. See the widget source in `src/components/sim/WhatIfWidget.astro`.*
