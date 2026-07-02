---
title: "Supplier Performance Tracking"
description: "Monitoring supplier performance as part of S&OE supply monitoring and when persistent underperformance escalates to S&OP."
chapter: "soe-supply-monitoring"
estimatedMinutes: 5
topicLayout: "prose-topic"
---

## Why supplier performance belongs in S&OE

Supply monitoring at the S&OE level is primarily about what is happening right now: this week's deliveries, this week's exceptions, this week's stock position. But supplier performance cannot be assessed from a single data point. A supplier who misses this week's committed date may be responding to an exceptional situation. A supplier who has missed four of the last eight committed dates has a structural reliability problem — and that distinction matters for how the S&OE planner interprets and responds to each exception.

Tracking supplier performance over a rolling window — typically four to eight weeks — gives the S&OE planner the context to read individual exceptions correctly and to identify when an operational issue has become a structural one.

## The metrics the S&OE planner monitors

Three supplier performance metrics are relevant at the S&OE level:

**On-time delivery rate** measures the percentage of confirmed PO delivery dates actually met within a tolerance window (typically plus or minus one day). This is the single most important supplier reliability metric for near-term supply monitoring. A supplier with a consistently high on-time rate can be trusted to self-manage; a supplier with a declining rate requires active monitoring.

**Fill rate from supplier** measures the percentage of the ordered quantity actually delivered on or before the committed date. A supplier who delivers on time but consistently short-ships — delivering 80% of what was ordered — creates a supply gap that is just as disruptive as a late delivery, but shows up differently in the monitoring data. Fill rate underperformance often signals supplier-side capacity or raw material constraints that procurement needs to understand.

**Lead time variability** measures the spread in actual delivery lead times around the supplier's standard lead time. Even a supplier with an acceptable average lead time can cause planning problems if their lead times are highly variable — early deliveries drive inventory spikes, late deliveries drive stock-out risk. Low variability is as valuable as short lead times for planning predictability.

## What data the S&OE planner needs from procurement

Supplier performance monitoring at the S&OE level depends on having timely data on confirmed delivery dates, actual receipt dates, and confirmed quantities. In most organisations this data lives across two systems: the ERP (which records PO confirmations and goods receipts) and the planning system (which holds the planned receipt schedule).

The S&OE planner needs procurement to ensure that:
- Supplier delivery confirmations are entered into the system promptly when received.
- Changes to confirmed delivery dates (revisions, deferrals, early shipment notices) are updated in the system rather than communicated informally.
- Partial receipts are recorded accurately by line item, not aggregated in ways that mask shortfalls.

Without timely and accurate data from procurement, the supply monitoring picture is incomplete and the planner may miss developing risks until they are already causing service failures.

## When operational issues escalate to structural ones

A single missed delivery is an operational issue — it can usually be managed within S&OE through an expedite request, a reallocation, or a short-term adjustment. When the same supplier misses multiple consecutive commitments, or when fill rate underperformance is trending downward over several weeks, the issue has crossed from operational to structural.

Structural supplier underperformance — persistent low on-time delivery rate, chronic short-shipping, or widening lead time variability — is not something the S&OE planner can resolve alone. It requires a procurement response: a formal performance conversation with the supplier, a review of the sourcing strategy, or a temporary increase in safety stock to buffer against the unreliable supply.

The S&OE planner's role at this point is to document the trend clearly and escalate it to S&OP. The monthly S&OP cycle is the appropriate forum for reviewing supply base reliability, adjusting safety stock policies to reflect supplier risk, and making sourcing decisions that affect the structural supply picture. The S&OE planner surfaces the evidence; S&OP and procurement own the structural response.
