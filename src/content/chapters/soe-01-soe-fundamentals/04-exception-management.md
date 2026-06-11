---
title: "Exception-Based Working in S&OE"
description: "S&OE cannot review every SKU every week. Exception management focuses planner attention on the items that matter — and lets the rest run to plan."
order: 4
chapter: "soe-01-soe-fundamentals"
estimatedMinutes: 5
topicLayout: "prose-topic"
---

## Why exception management is essential

A supply chain with thousands of SKUs across multiple locations cannot be manually reviewed every week. S&OE only works at scale if planners are focused on exceptions — deviations from plan that require human judgment — rather than reviewing everything.

Exception-based working is the practice of configuring the planning system to surface only the items that need attention and letting everything else run automatically. The goal is a planner who spends their time on the 5% of items that need decisions, not on confirming that the other 95% are fine.

## What triggers an exception

Planning software generates exceptions when actual or projected values deviate from targets by more than a configured threshold. Common exception types in S&OE:

- **Demand spike / dip** — actual orders or near-term forecast exceeds or falls below the weekly plan by a defined percentage
- **Stock-out risk** — projected inventory will fall below the safety stock target within the planning horizon
- **Overstock** — projected inventory exceeds the maximum stock target
- **Supply delay** — an expected inbound delivery is late or at risk of delay
- **Capacity constraint** — the production schedule cannot meet confirmed demand within the available capacity
- **Quality hold** — a batch or lot has been quarantined, reducing available supply

## The exception queue

Planning software presents exceptions in a prioritised queue. The planner reviews the queue, investigates the root cause of each exception, decides on the appropriate response, and either resolves it or escalates it. In a well-configured system, the most critical exceptions — imminent stock-outs, large demand spikes — surface at the top; minor deviations that are self-correcting appear lower or are filtered out entirely.

## Exception resolution

For each exception, the planner has a set of available actions:

- **Expedite** — ask a supplier to bring forward a delivery
- **Reallocate** — move available stock from one location or customer to another
- **Adjust the production schedule** — bring forward or push back a production run
- **Override the plan** — manually adjust the replenishment recommendation with a documented reason
- **Escalate** — flag for the integrated S&OE review or, if the issue is material enough, for S&OP

## Tuning exception thresholds

Exception thresholds require calibration. Set them too tight and the exception queue is flooded with noise — planners spend time on trivial deviations. Set them too loose and genuine problems are missed. Exception management is not a one-time setup; it requires periodic review as the business and supply chain evolve.
