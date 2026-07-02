---
title: "Integration Lag and Its Implications"
description: "The time lag between a physical execution event and its appearance in the planning model — and what it means for how planners should interpret exceptions during the day."
chapter: "exec-feedback-to-planning"
estimatedMinutes: 5
topicLayout: "prose-topic"
---

## Why Lag Is Unavoidable

No planning system receives execution data instantaneously. Between the moment a physical event occurs and the moment that event appears in the planning model, time passes. Data must be entered into ERP or WMS. Integration runs must collect and transmit that data to the planning system. The planning system must ingest and process the update. Only then does the change appear in the planner's view.

This lag is a structural feature of supply chain data infrastructure, not a configuration problem. Even in organisations with near-real-time integration, some lag always exists. The question is not whether lag exists — it does — but how long it is, how variable it is, and whether planners understand it well enough to account for it.

## The Anatomy of Integration Lag

Integration lag is made up of several components that stack together.

The first component is recording lag: the time between the physical event and the transaction being entered into the source system. A goods receipt that takes two hours to post after physical arrival contributes two hours of lag before the integration even begins.

The second component is integration cycle time: the frequency at which data is extracted from ERP and FMS and transmitted to the planning system. An integration batch that runs every four hours means that even if a transaction is posted immediately, it may wait up to four hours before the planning system sees it. An integration that runs every 15 minutes has much shorter worst-case lag, but still has some.

The third component is planning model refresh: after data arrives in the planning system, the model must recalculate — update inventory positions, re-run netting logic, regenerate exceptions. In some systems this happens continuously. In others it runs on a schedule, adding further delay between data arrival and planner visibility.

## Twice-Daily vs Near-Real-Time Refresh

The difference between a system that refreshes twice daily and one that refreshes every 15 minutes is significant — not just in data currency, but in how planners must behave.

In a twice-daily refresh environment, planners know that the data they are seeing at 9am reflects the world as it was at the previous day's evening cut. Any events from overnight — production completions, supplier deliveries, early shipments — will not appear until the next refresh at noon. Experienced planners in this environment build a mental correction: they know what is in-flight and apply judgment to bridge the gap. This works, but it is error-prone and non-systematic. Newer team members, or planners covering an unfamiliar area, have no way to know what the lag represents.

In a near-real-time refresh environment, the lag is short enough that planners can treat the system as a current view. Exceptions generated at 9am reflect events up to 15 or 30 minutes ago. Decisions made on that data are much more likely to reflect physical reality. The trade-off is computational: more frequent refreshes impose higher processing loads on the planning system and require tighter integration reliability.

## What Planners Should Do During the Lag Window

For planners operating in environments with meaningful integration lag, a few working practices reduce the risk of decisions made on stale data.

Before acting on an exception, it is worth checking whether the triggering event might have already been resolved and the update is simply in transit. A production exception flagging a batch as incomplete should prompt a quick check with the shop floor before escalating — the batch may have completed 30 minutes ago and the confirmation is still pending integration.

For high-priority supply situations — a key customer delivery at risk, a production constraint in the current period — planners should not rely solely on the system view during the lag window. Direct confirmation from the warehouse or production team provides a current picture that the system may not yet reflect.

The planning system is the authoritative record of what happened, but it is not always the fastest source of what is happening right now. Understanding the lag characteristics of your integration environment is what allows you to decide when the system view is sufficient and when a direct check is needed.

## Lag as a Planning Input

In organisations where integration lag is consistent and understood, it can be treated as a planning input rather than a source of uncertainty. If the system reliably shows a four-hour lag in production confirmations, the planner can apply a four-hour offset when assessing availability for same-day despatch. If the goods receipt integration runs at 6am and 2pm, the planner knows that inbound stock will not appear until those windows — and can plan despatch commitments accordingly.

The worst situation is variable, undocumented lag — where the planner does not know whether the data is two hours old or two days old, and has no basis for calibrating their interpretation. Documenting integration cycle times and making them visible to planning teams is a low-cost improvement that significantly reduces decision-making risk.
