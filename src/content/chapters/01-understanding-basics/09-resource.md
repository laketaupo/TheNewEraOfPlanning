---
title: "Resource"
description: "The machines, lines, and people whose capacity constrains how much you can produce."
order: 9
chapter: "01-understanding-basics"
estimatedMinutes: 3
widget: ""
nodeType: "resource"
topicLayout: "node-topic"
summary: "A Resource is anything with limited capacity that gets consumed during a transformation process — a machine, a production line, a crew, or a tank. Resources are what turn an unconstrained supply explosion into a feasible, real-world plan. A resource's availability is governed by a calendar that captures shifts, planned maintenance, and holidays. When Planning software checks feasibility, it uses available capacity — not theoretical maximum — to determine whether the plan can actually be executed."
bullets:
  - "Has available capacity per time bucket (hours or units)"
  - "Governed by a calendar: shifts, maintenance, and holidays"
  - "Types: machine, labor, storage, or utility"
  - "Belongs to a specific location in the network"
  - "Consumed by transformation processes via resource consumptions"
---

## What is a Resource?

A **Resource** in Planning software represents anything with limited capacity that is consumed during a transformation process — a machine, a production line, a workforce, a tank, or a tool.

Resources are what turn an unconstrained explosion (infinite supply) into a **constrained plan** (limited by reality).

Core attributes:

- **Resource ID & name** — unique identifier
- **Capacity** — available hours/units per time bucket
- **Calendar** — when the resource is available (shifts, downtime, holidays)
- **Location** — which node the resource belongs to
- **Type** — machine, labor, storage, utility

## Resource Types

| Type | Example |
|---|---|
| Machine | Bottling line, injection molder, mixer |
| Labor | Packing crew, QA inspector |
| Storage | Cold room, silo, tank farm |
| Utility | Steam, electricity, water |

## Capacity vs. Availability

A resource has two dimensions:

1. **Theoretical capacity** — maximum output if run 100% of the time
2. **Available capacity** — actual hours available after applying the calendar (shifts, planned maintenance, holidays)

Planning software uses **available capacity** when checking feasibility and generating constrained plans.

## Placeholder Content

*Replace this section with your actual resource definitions, capacity numbers, or screenshots from your Planning software environment.*
