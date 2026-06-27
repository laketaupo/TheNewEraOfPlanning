---
title: "What Actuals Capture Means"
description: "What actuals capture is, why it must happen at the point of the event, and why it is the foundation the entire planning cycle depends on."
chapter: "exec-actuals-capture"
estimatedMinutes: 5
topicLayout: "prose-topic"
---

## The Principle Behind Actuals Capture

Actuals capture is the discipline of recording every execution event in ERP and FMS as it happens. Not at the end of the shift. Not at the end of the day. Not approximated because the exact quantity was unclear. Not deferred because the team was busy with a more urgent problem.

Every shipment despatched, every production run completed, every goods receipt posted, every inventory adjustment made, every quality event recorded — each of these is an execution event that must be captured in the system at the point it occurs, with accurate data.

This is not a data hygiene task. It is the mechanism by which the planning cycle keeps in contact with reality. Planning software runs on data. The data it runs on is either a reflection of what has actually happened in the business, or it is not. There is no middle ground. If actuals are captured accurately and promptly, the plan runs on reality. If they are captured late, approximated, or omitted, the plan runs on a fiction that was true at some earlier point and has since diverged.

## Why Timing Matters as Much as Accuracy

Late actuals are not just a data quality issue — they create a specific, recurring type of operational error. When a planner reviews the exception queue at 9am and sees that a production batch completed overnight, they make decisions based on that availability. If the batch was actually completed at 6am but not confirmed in the system until 11am, there is a five-hour window where the planner is working with outdated data. Allocation decisions, customer commitment updates, and supply confirmations made during that window are all at risk.

In high-velocity operations — same-day despatch, daily replenishment cycles, short-horizon manufacturing — a five-hour data lag is not a minor inconvenience. It is a structural planning problem. The planning model is chronically behind the physical operation, and every decision made during the lag window has to be reconsidered when the data catches up.

## What Actuals Feed Back Into

Every actuals transaction feeds directly into the planning model's starting position for the next cycle. Shipment actuals reduce the open demand plan — if a customer order ships, the demand is consumed and the remaining requirement is what is left. Production actuals update inventory — if a batch completes with 90% yield rather than 100%, the available stock position is lower than planned and the shortfall must be assessed against open demand. Receipt actuals update inbound supply — if a supplier delivers 80% of an expected order, the planning model needs to know that before the next allocation run.

Without accurate and timely actuals, none of these updates happen correctly. The demand plan shows demand that has already been filled. The inventory position overstates available stock. The supply position assumes receipts that did not materialise. The planning model diverges from reality at each cycle, and the gap compounds.

## The Standard That Actuals Capture Sets

The standard for actuals capture is this: by the end of each operating period, every execution event that occurred during that period must be confirmed in the system, with accurate quantities, and (where applicable) reason codes for any deviation from plan. This is the minimum standard for the planning model to remain useful.

Organisations that maintain this standard consistently operate with planning models they can trust. Organisations that do not operate with a model they are constantly correcting — and the correction lag is always one cycle behind, which means they are always catching up rather than planning ahead.
