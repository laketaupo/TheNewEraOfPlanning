---
title: "Monitoring in Practice"
description: "How demand monitoring works inside planning software — workspaces, exception queues, and the actions available per exception type."
chapter: "soe-demand-monitoring"
estimatedMinutes: 5
topicLayout: "prose-topic"
---

## The S&OE demand monitoring workspace

Planning software surfaces demand monitoring through a dedicated workspace or view, typically labelled along the lines of "S&OE Demand" or "Near-Term Demand Monitor." This workspace is distinct from the S&OP demand planning module — it is scoped to the near-term horizon (usually the next four to eight weeks) and is oriented around exceptions rather than plan creation.

The workspace typically shows a grid of SKUs and locations with colour-coded deviation indicators, alongside an exception queue that lists items that have breached the configured alert thresholds. The planner starts each monitoring cycle here, working through the exception queue before scanning the wider deviation grid.

## Exception queues filtered to demand-type exceptions

Planning systems classify exceptions by type. Demand-type exceptions include: demand deviation above threshold, demand deviation below threshold, order confirmation rate below threshold, and near-term forecast revision above threshold. The exception queue can be filtered to show only demand exceptions, separating them from supply and inventory exceptions that are handled by different parts of the S&OE process.

Each exception record shows the affected item, the nature of the deviation, the current value versus the plan value, and the severity flag — typically a traffic-light rating based on how far the deviation exceeds the configured tolerance. High-severity exceptions appear at the top of the queue and require same-day attention.

## Reading demand deviation charts

For each exception item, the planner can open a deviation chart that shows the full short-horizon demand picture: the baseline plan (the agreed S&OP number), the current near-term forecast, and the actual order intake to date. The chart makes it visually clear whether the deviation is a one-week spike or a sustained trend, and whether it is worsening or stabilising.

The shape of the deviation matters. A single spike that has already passed without follow-through is typically treated differently from a deviation that has grown for three consecutive weeks. The chart provides the context the planner needs to make that judgement.

## Distinguishing noise from signal

Not every exception requires action. Planning systems apply statistical tolerances — typically a percentage deviation threshold — but those thresholds are calibrated for broad coverage, not perfect precision. The planner's task is to apply judgment:

- Is this a large absolute volume impact, or a large percentage on a low-volume item?
- Is the deviation driven by a known event (promotion, customer special order, seasonal effect)?
- Has the same item flagged in previous weeks, or is this the first occurrence?

Items that are explainable by known causes and within the plan's built-in buffer are typically acknowledged and monitored rather than escalated. Items that are unexplained, large in volume impact, and sustained are escalated.

## Actions available per exception type

The S&OE demand monitoring workspace is not read-only. Depending on the exception type and its severity, the planner has several response options available within the system:

- **Acknowledge and monitor** — record a note on the exception, leave the plan unchanged, and flag for review next cycle.
- **Adjust near-term forecast** — update the short-horizon forecast to reflect the confirmed deviation, so downstream supply planning picks up the revised signal.
- **Flag for integrated S&OE review** — add the item to the agenda of the weekly cross-functional meeting for a joint decision.
- **Raise an S&OP escalation** — mark the deviation as exceeding the S&OE resolution threshold and trigger an out-of-cycle S&OP review.

Each action is logged in the system, creating an audit trail of what was observed, what decision was made, and who made it.
