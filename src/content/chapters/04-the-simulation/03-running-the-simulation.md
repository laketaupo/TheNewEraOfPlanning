---
title: "Running the Simulation"
description: "Triggering the Planning software planning engine recalculates the supply plan end-to-end. Understanding what happens during the run helps you interpret the output correctly."
order: 3
chapter: "04-the-simulation"
estimatedMinutes: 3
topicLayout: "prose-topic"
---

## What happens when you run the simulation

When you trigger a planning run in Planning software, the engine executes the supply planning logic across the entire network, in the sequence defined by the Bill of Distribution and Bill of Material:

1. **Demand netting** — the gross demand signals are processed against existing inventory and scheduled receipts to determine net requirements at each node
2. **MRP / DRP propagation** — net requirements are exploded upstream through the BOM and BOD: what needs to be produced, what needs to be shipped, what needs to be ordered
3. **Constraint application** — capacity limits, minimum order quantities, lead times, and safety stock targets are applied to generate constrained planned orders
4. **Exception generation** — items that fall short of their targets (stock-outs, late orders) or exceed their limits (excess inventory) are flagged as exceptions

The output is a complete regeneration of the planning model based on the modified inputs.

## Run time and scope

Planning run time depends on network complexity. For typical mid-size networks, a scenario run takes seconds to a few minutes. For large networks with many levels and long horizons, it may take longer.

You can usually scope the run to a subset of the network (e.g., a specific product family or region) to speed up iteration. This is useful for exploratory analysis; for a final simulation that will be compared against the full baseline, run the full network.

## During the run

While the run is executing:
- Do not make further changes to the scenario — modifications during a run may not be captured in the output
- If the run fails or produces unexpected exceptions, check the input changes for data errors before re-running

## After the run completes

The system will indicate that the run is complete. At this point, the scenario contains a fully calculated plan based on your modified assumptions. The next step is to review and interpret the output — comparing it against the baseline to understand the consequences of the assumption change.
