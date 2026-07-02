---
title: "What Is a Workflow Simulation?"
description: "A workflow simulation in Planning software is an end-to-end what-if run that lets you change assumptions, recalculate the plan, and compare the result against the baseline — without touching the live plan."
chapter: "04-the-simulation"
estimatedMinutes: 4
topicLayout: "prose-topic"
---

## The purpose of a simulation

In Planning software, a simulation is a controlled environment for testing planning assumptions before committing to them. It works like this: you take a copy of the current plan, change one or more inputs (a demand signal, a supply constraint, a lead time), let the planning engine recalculate, and then compare the new plan against the baseline.

The key property is isolation. The simulation runs in its own workspace — the live plan is unaffected until you explicitly choose to promote the simulation to the baseline.

## Simulation vs. scenario

The terms are related but refer to different scopes. A **scenario** in Planning software is a named planning version with modified assumptions — it is the object you work with. A **simulation** (or workflow simulation) is the act of running the planning engine to calculate the consequences of those modified assumptions. In practice, running a simulation means: create a scenario, modify inputs, trigger the planning engine, review the output.

## What you can simulate

The planning engine responds to changes across all parts of the supply network. Common simulation inputs include:

- **Demand changes** — increase or decrease a demand signal by product, customer, or region
- **Supply constraints** — cap a supplier's available quantity or delay an inbound shipment
- **Lead time changes** — extend or compress transit or production lead times
- **Capacity changes** — reduce a production resource's available hours or throughput
- **Inventory changes** — adjust opening stock to test the impact of a delayed shipment or quality hold

The output is a recalculated plan: new planned order quantities and dates, updated inventory projections, revised shortage or excess flags.

## Why end-to-end matters

The "end-to-end" aspect of the simulation means that changes propagate through the entire network — from raw material through production, packaging, and distribution to the customer-facing inventory position. A change to a supplier's delivery schedule does not just affect the input — it ripples through every downstream step. This is the value of a network-based planning model: you see the full consequence, not just the immediate impact.
