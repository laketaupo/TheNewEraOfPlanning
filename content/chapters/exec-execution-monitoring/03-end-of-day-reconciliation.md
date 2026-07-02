---
title: "End-of-Day Reconciliation"
description: "The end-of-period reconciliation discipline: what it covers, how it is done, and why it is the starting point for the S&OE planner's next day."
chapter: "exec-execution-monitoring"
estimatedMinutes: 5
topicLayout: "prose-topic"
---

## Why Reconciliation Is a Discipline, Not a Report

At the end of each operating period, the gap between what the system shows and what physically happened during the day must be closed. This is end-of-day reconciliation — the structured process of confirming open transactions, resolving discrepancies, and updating the system so that the planning model begins the next period with an accurate picture of where the business actually is.

Reconciliation is sometimes treated as an administrative task: run the report, tick the boxes, file it away. That framing misses the point. The output of the end-of-day reconciliation is the input to the next planning cycle. If the reconciliation is incomplete — if production shortfalls are unrecorded, inventory discrepancies are deferred, or shipment confirmations are still pending — the S&OE planner starts the following morning with a distorted starting position. Every decision they make based on that position carries the accumulated error forward.

## What the Reconciliation Checklist Covers

A standard end-of-period reconciliation covers five areas.

**Open production orders not yet confirmed** — any batch or production run that was scheduled for the current period but has not been closed in the system. For each open order, the execution team confirms whether production completed (full quantity, partial quantity, or not at all), records the actual output and any yield variance, and closes or reschedules the order accordingly.

**Open purchase orders with expected receipts** — any supplier delivery that was scheduled for receipt today but has not been confirmed in the system. For each, the team confirms whether the delivery arrived (full, partial, or no delivery), records the received quantity, and updates supply availability accordingly. Short deliveries that affect tomorrow's despatch commitments are flagged for S&OE.

**Open outbound deliveries not yet confirmed** — any customer order that was scheduled for despatch today but does not yet have a despatch confirmation and, where applicable, a carrier handover confirmation. Deliveries still outstanding at end of day must be assessed: have they actually gone and the confirmation is just delayed, or are they genuinely unshipped? Unshipped orders affect the customer delivery commitment and must be communicated.

**Inventory discrepancies** — differences identified during the day between system quantities and physical counts. Every discrepancy must be resolved before the period closes: either confirmed as a system error (corrected by adjustment) or confirmed as a physical variance (recorded with a reason code and flagged for investigation if above threshold).

**Exception cases deferred from the day's monitoring** — any exception that was identified during the day but not resolved during operating hours. Each deferred exception must have a clear status: what it is, why it was not resolved, and what action is required first thing the next period.

## How Reconciliation Feeds the S&OE Start-of-Day View

The end-of-day reconciliation output is the single most important input to the S&OE planner's start-of-day review. Before looking at the exception queue, before reviewing demand signals, and before assessing constraint risks for the coming days, the S&OE planner needs an accurate picture of the actual starting position: what inventory is available, what production completed or fell short, what is in transit, and what customer commitments are at risk from yesterday's events.

In practice, this means the end-of-day reconciliation must be completed before the S&OE team's working day begins — which typically means execution teams reconciling at end of shift, with a final sign-off that confirms the system position is accurate and the planning model can be trusted for the next day's decision-making.

## The Connection to Planning Model Accuracy

The longer the gap between physical events and system confirmation, the less accurate the planning model becomes. Reconciliation discipline is the mechanism that keeps the model aligned with reality. A business that reconciles thoroughly every day — and where planners trust that the system position is accurate — makes faster, higher-quality decisions. A business where reconciliation is inconsistent, deferred, or treated as a formality operates under a constant cloud of uncertainty: the plan might be right, or it might be based on data that has not been updated in 36 hours. That uncertainty has a cost, and it compounds across every decision made under it.
