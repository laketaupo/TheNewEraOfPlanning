---
title: "Running & Comparing Scenarios"
description: "After making adjustments, you run the planning engine inside the scenario and compare the results against the baseline. This is where the value of scenario planning becomes visible."
chapter: "process-02-running-scenarios"
estimatedMinutes: 5
topicLayout: "prose-topic"
---

## Running the planning engine in a scenario

Once your adjustments are in place, trigger a planning run inside the scenario. In Planning software this is typically a **recalculate** or **run plan** action available within the scenario workbench.

The engine will process your scenario's modified inputs — demand, supply, capacity — and produce a new set of planned orders, inventory projections, and resource loads. Depending on the size of your network and the scope of the scenario, this may take seconds to several minutes.

Do not compare results until the run is complete and the status shows as finished. Partial results can be misleading.

## What to compare

The comparison between your scenario and the baseline should be structured around the question you defined before creating the scenario. Typical comparison points:

**Inventory levels**
Does the scenario result in more or less inventory? Where in the network does the difference concentrate? Are there locations that stockout in the scenario but not the baseline?

**Service level**
Can all demand be fulfilled in the scenario? Which items or customers are affected if supply is constrained?

**Production and purchase orders**
What additional orders would need to be placed to fulfil demand in the scenario? Are there orders that could be reduced? What is the cost difference?

**Resource utilisation**
Which production resources become bottlenecks under the scenario assumptions? Are any resources over 100% utilised (infeasible)?

## Using the comparison view

Planning software provides side-by-side and delta views for comparing a scenario against the baseline. Use the delta view — which shows only the differences — to focus your attention on what changed rather than reviewing everything from scratch.

Filter the comparison by time period and location to narrow to the part of the network most affected by your scenario assumption.

## Documenting findings

Before presenting or deciding on a scenario, write a short summary of what the comparison shows: the key differences, their magnitude, and their business implications. This summary becomes the input to the decision conversation.
