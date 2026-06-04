---
title: "Demand Shock Simulation"
description: "Watch how a sudden demand spike propagates through the supply chain network step by step."
order: 3
chapter: "04-the-simulation"
estimatedMinutes: 5
widget: "demand-shock"
---

## What is a Demand Shock?

A **demand shock** is a sudden, unexpected increase (or decrease) in demand — a large promotional uplift, a competitor going out of stock, a viral moment, or a crisis-driven panic buy.

Demand shocks are the scenario planners fear most, because they:

1. Arrive faster than supply can respond
2. Cascade up through every BOM and BOD level
3. Compete for the same constrained resources as the baseline plan

## Watch It Happen

The animation below shows a +40% demand shock entering the network and propagating upstream:

<!-- Widget rendered by the page layout when widget = "demand-shock" -->

## What to Watch For

- **Finished goods** deplete first (no buffer)
- **DC replenishment** orders are generated immediately
- **Plant production** increases — but hits capacity constraint
- **Component procurement** POs are placed — but lead time means they arrive later
- **Service level** dips during the gap, then recovers as supply catches up

## How o9 Responds

When a demand shock is detected:

1. Net requirements spike at the finished good level
2. The engine re-explodes requirements through the BOM and BOD
3. Capacity overloads are flagged on the critical resources
4. Planner is alerted with the prioritized exception list and suggested actions

## Placeholder Content

*Replace the animation parameters with values from a real demand shock scenario in your business — e.g., the peak volume uplift, the lead time of your critical component, and the recovery time observed.*
