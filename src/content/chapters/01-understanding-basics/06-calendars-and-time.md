---
title: "Calendars & Time"
description: "How o9 models time — planning horizons, time buckets, and operational calendars."
order: 6
chapter: "01-understanding-basics"
estimatedMinutes: 3
widget: ""
---

## Why Time Matters in Planning

o9 is a **time-phased** planning system. Every supply, demand, and inventory quantity is associated with a specific time bucket. Understanding how time is structured in o9 is essential to interpreting any plan.

## Time Buckets

A **time bucket** is the smallest unit of time the planner works in. Common configurations:

| Bucket | Typical use |
|---|---|
| Day | Short-term execution (1–8 weeks) |
| Week | Mid-term planning (2–6 months) |
| Month | Long-range planning (6–24 months) |

o9 supports **mixed granularity** — daily buckets in the near horizon, weekly further out, monthly at the horizon edge.

## Planning Horizon

The **planning horizon** defines how far into the future the plan extends. It is set per item or item group and should reflect:

- **Cumulative lead time** — how long it takes to procure → produce → deliver the item
- **Demand visibility** — how far ahead demand signals are reliable
- **Business review cadence** — monthly S&OP, weekly S&OE cycles

## Calendars

A **Calendar** defines when a resource, supplier, or plant is available. Calendars are attached to:

- **Resources** — shifts, maintenance windows, holidays
- **Suppliers** — lead time offsets, delivery days
- **Transportation lanes** — shipping days, transit delays

The planning engine uses calendars to schedule orders on valid working days and to respect production windows.

## Placeholder Content

*Add your company's specific time bucket configuration, fiscal calendar, or planning horizon settings here.*
