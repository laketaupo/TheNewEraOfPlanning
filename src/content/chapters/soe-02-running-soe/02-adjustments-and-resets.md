---
title: "Making Adjustments and Resetting the Plan"
description: "When exceptions cannot be auto-resolved, planners intervene — adjusting orders, schedules, and allocations to keep the near-term plan feasible."
order: 2
chapter: "soe-02-running-soe"
estimatedMinutes: 5
topicLayout: "prose-topic"
---

## Intervention tools in S&OE

When monitoring reveals a deviation from plan that requires action, the planner has several levers to work with. The choice of lever depends on the nature of the exception, the urgency, and the constraints in play.

### Order adjustment

The most direct lever: adjust the quantity or timing of a replenishment or production order. In planning software, the planner can accept, override, or cancel system-generated order recommendations. Every manual override should be documented — it forms part of the audit trail and helps calibrate the system's recommendations over time.

### Expediting

When a supply delay threatens to cause a stock-out, the planner works with procurement to bring forward an inbound delivery. Expediting has a cost — freight premium, supplier relationship strain — and should be used selectively. Planning software helps by calculating whether the expedite is actually necessary or whether available safety stock can absorb the delay.

### Reallocation

When stock is available in one location but not another, reallocation moves inventory to where demand is highest. This requires visibility of inventory across the network — a capability that planning software provides. Reallocation decisions should be governed by allocation policy (set in S&OP) to avoid the situation where one region consistently takes stock from another without authorisation.

### Production schedule adjustment

If demand is running above plan and capacity is available, the planner can request a production schedule change to bring forward output. This requires coordination with the operations team and must respect any minimum run sizes, changeover constraints, or material availability limitations.

### Demand shaping

When supply is constrained and demand exceeds available inventory, the planner may work with the commercial team to shape demand: offering substitutes, prioritising higher-margin or strategically important customers, or communicating lead time adjustments. This is a cross-functional action requiring commercial buy-in.

## Documenting adjustments

All manual adjustments should be documented in the planning system with a reason code. This serves two purposes: it creates accountability, and it feeds back into the system's ability to learn. An override that happens every week for the same reason is a signal that the planning parameters need adjustment.

## When to reset the baseline

If deviations from the S&OP plan are persistent — running above or below plan for three or more consecutive weeks — it may be time to reset the baseline rather than continue managing exceptions. A baseline reset should be escalated to S&OP as a formal revision request, not done unilaterally within the S&OE process.
