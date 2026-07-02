---
title: "Systematic Variances and Escalation"
description: "The difference between one-off execution variances and systematic ones — and when a variance must be escalated to S&OE or S&OP rather than absorbed as an operational adjustment."
chapter: "exec-feedback-to-planning"
estimatedMinutes: 5
topicLayout: "prose-topic"
---

## Noise vs Signal

Not every execution variance is a problem that requires upstream escalation. Supply chains operate in a world of inherent variability — a delivery that arrives a day late, a production batch that yields 2% below target, a shipment that is delayed by traffic. These are noise: individual deviations that fall within the expected range of operational variability and can be handled at the execution level without changing the plan.

The challenge is distinguishing noise from signal: identifying when a variance is systematic — when it reflects a structural issue in the supply chain rather than a one-off event — and escalating it appropriately rather than absorbing it indefinitely.

A single missed delivery is an execution event. A supplier who misses 30% of deliveries over six weeks is a structural reliability problem. The execution team can handle the first. The planning team, with input from procurement and possibly the supplier themselves, must address the second.

## How Execution Teams Identify Systematic Variances

Three tools are available to execution teams for identifying systematic patterns.

**Threshold rules** set a performance boundary: if a supplier's on-time delivery rate falls below a defined threshold (say, 85%) over a rolling period (say, four weeks), the system flags this as a systematic exception requiring escalation rather than individual event handling. Threshold rules must be defined in advance, set at levels that reflect genuine performance concern rather than ordinary variability, and reviewed periodically to ensure they remain relevant.

**Trend views in planning software** show how performance has moved over time. A supplier with 95% delivery reliability in January, 88% in February, and 79% in March is not just underperforming this week — they are on a trajectory that will continue to deteriorate unless addressed. Trend views make this visible in a way that individual exception handling cannot.

**Exception frequency analysis** tracks how often the same type of exception recurs for the same source. If the exception queue shows twelve short-receipt exceptions in a month from the same supplier, each handled individually, the pattern is invisible until someone counts the occurrences. Frequency analysis surfaces this pattern explicitly: this is not twelve separate events. It is one structural problem that has occurred twelve times.

## What Constitutes an Escalation to S&OE

An escalation to S&OE is warranted when a variance is systematic enough to require plan adjustment but is within the near-term horizon that S&OE manages. The most common triggers:

A supplier whose delivery reliability has deteriorated to the point where the confirmed supply position for the next two to four weeks is materially overstated. The S&OE team needs to know this because it affects their ability to commit to customer deliveries and manage short-term allocation.

A production constraint that has emerged during execution — a line running below capacity, a quality hold on a batch that represents a significant proportion of the week's planned output — that is too large to absorb within the current confirmed schedule and requires S&OE to reprioritise near-term production.

An execution pattern — recurring last-minute order changes, systematic short picks, consistent late despatch from a specific warehouse shift — that is affecting service levels and cannot be resolved without a process or policy change above the execution team's authority.

When escalating to S&OE, the execution team should provide: the specific variance, how long it has been occurring, the pattern data that demonstrates it is systematic, the downstream impact on customer commitments or supply position, and a recommendation for what needs to change.

## What Constitutes an Escalation to S&OP

An escalation to S&OP is warranted when the variance is systematic enough to require a change to planning parameters — not just a short-term plan adjustment, but a structural update to the assumptions the planning model runs on.

A supplier whose actual lead time is consistently three days longer than the planning system's parameter. A production line whose actual yield is consistently 8% below the standard yield rate used for planning. A SKU whose demand pattern has shifted structurally — a step change in volume, a new seasonal profile — that the statistical forecast is no longer capturing.

These are not execution problems. They are planning model calibration problems. Execution teams identify them through systematic variance analysis; the escalation path to S&OP ensures that the planning model is updated to reflect reality, rather than execution teams continuing to absorb the gap cycle after cycle.

The test for an S&OP escalation is whether the variance, if it continues unchanged, will cause the plan to be systematically wrong over the next planning horizon — not just this week or next, but over the next month or quarter. If yes, it is a planning parameter issue and belongs in S&OP. If no, it is a near-term supply and demand management issue and belongs in S&OE.
