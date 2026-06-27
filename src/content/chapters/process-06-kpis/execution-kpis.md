---
title: "Execution KPIs"
description: "Execution KPIs measure what actually happened — they are the feedback signal and early warning system that connects daily operations back to the planning cycle."
chapter: "process-06-kpis"
estimatedMinutes: 5
topicLayout: "prose-topic"
---

## What makes execution KPIs different

Planning KPIs measure the quality of the plan — forecast accuracy, schedule attainment, inventory targets. Execution KPIs measure what actually happened. That distinction matters: execution metrics are not an assessment of whether the plan was good; they are the feedback signal that tells you whether the plan was executed and where the system broke down.

A fill rate miss that lasts one week is an operational blip. A fill rate miss that persists for three weeks is an S&OE exception that requires a response. A structural OTIF problem that appears cycle after cycle is an S&OP escalation — it signals that either the plan is unachievable or the execution process cannot reliably deliver against it. KPIs only improve planning if they feed back into the cycle at the right level and at the right cadence.

## The core execution KPIs

**Order fill rate** measures the percentage of customer orders fulfilled completely from available stock at the time of request. It reflects whether inventory and supply plans translated into actual availability on the shelf or in the warehouse when customers needed it.

**On-time in-full (OTIF)** is the percentage of orders delivered on the committed date with the full quantity. It is the most customer-facing execution KPI because it captures both the timing and the completeness of delivery in a single number. A partial shipment or a one-day late delivery both count as OTIF failures.

**Production schedule adherence** measures the percentage of the confirmed production schedule that was actually completed on time. It distinguishes between capacity planning failures (the schedule was unrealistic) and execution failures (the plan was achievable but not delivered).

**Inbound receipt accuracy** tracks the percentage of purchase orders received on time and in full from suppliers. It is the upstream mirror of OTIF — just as the business owes its customers complete and on-time delivery, suppliers owe the business the same. Inbound shortfalls cascade directly into fill rate and OTIF problems downstream.

**Inventory record accuracy (IRA)** measures the percentage of inventory locations where the physical count matches the system record. IRA below 98–99% creates systemic planning errors: the system believes stock exists that does not, leading to sales orders being confirmed against phantom inventory. IRA problems are often invisible until fill rate collapses.

**Order-to-ship cycle time** is the elapsed time between order confirmation and shipment. It reveals whether fulfilment processes are running within the lead times that the plan assumed, and whether promised service windows are achievable in practice.

## Closing the loop

Execution KPIs are only useful if they drive action in the planning cycle. A persistent fill rate miss is a trigger for the S&OE team to investigate and respond — is it an inventory problem, a supplier problem, or a demand spike the plan did not anticipate? A structural OTIF shortfall that recurs across S&OP cycles should prompt a formal review of whether capacity, supplier commitments, or lead time assumptions in the plan are realistic.

The cadence matters as much as the metric. Execution KPIs should be reviewed at every S&OE cycle — typically weekly — so that exceptions surface quickly. KPIs that are only reviewed monthly lose their early-warning value and reduce to a post-mortem.
