---
title: "How Data Flows into a Plan"
description: "From raw data load to a calculated plan — the sequence of how Planning software processes incoming data and translates it into planning outputs."
order: 4
chapter: "data-01-planning-data-fundamentals"
estimatedMinutes: 4
topicLayout: "prose-topic"
---

## The planning cycle in four steps

Understanding how data moves through Planning software helps you understand where things can go wrong — and what to check when a plan looks wrong.

**Step 1: Data load**
Source system data is pushed or pulled into Planning software on a schedule (nightly, weekly, or on-demand). This includes inventory snapshots, open orders, demand forecasts, and master data updates. The data lands in staging tables before it is applied to the planning model.

**Step 2: Data validation**
Planning software checks loaded data for completeness and consistency. Missing BOM links, invalid item codes, or quantities below zero are flagged. Depending on configuration, some errors block the load; others log a warning and continue.

**Step 3: Planning run**
Once data is applied, the planning engine executes. It traverses the supply chain graph, applies demand signals to each node, nets against available inventory, checks resource capacity, and generates planned orders. This can take seconds for small networks or minutes for large ones.

**Step 4: Review and release**
The plan lands in planner workbenches as recommendations — planned production orders, purchase requisitions, transfer orders. Planners review, adjust, and release approved actions back to execution systems (the ERP, WMS, or directly to suppliers).

## Why the sequence matters

A planning cycle is only as current as its most recent data load. If inventory was loaded yesterday and a large shipment arrived this morning, the plan is working with stale inventory. The plan will recommend orders that may already be unnecessary.

Knowing when data was last loaded — and from which sources — is essential context for interpreting any planning output.
