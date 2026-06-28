---
title: "How the Landscape Fits Together"
description: "How ERP, Planning Software, MDM system, and FMS connect — what flows between them, when, and what breaks when it doesn't."
chapter: "tool-landscape-overview"
estimatedMinutes: 8
topicLayout: "prose-topic"
---

The four systems — ERP, Planning Software, MDM system, and FMS — are not alternatives to each other. They are interdependent, and each one does something the others cannot. The planning process only works when data moves cleanly between them at the right time.

## The Direction of Data Flow

Understanding which system sends to which — and why — matters more than memorising the names of the interfaces.

**MDM sends to both Planning Software and ERP.** Both systems need reference data to function: item descriptions, bill-of-materials structures, bill-of-distribution networks, planning parameters like lead times and lot sizes. But they use that data differently. ERP needs the item master to create a purchase order and route it to the right vendor. Planning Software needs the BOM to know how to break a finished goods demand signal into component requirements. The same master record, used in two different ways. When MDM pushes an update — say, a revised lead time for a component — both systems need to receive it, or they will disagree about when supply will arrive.

**ERP sends transactional actuals to Planning Software.** This is the most important flow to understand correctly. Planning Software does not observe what happens in the warehouse or on the production floor — it only knows what was planned. To update its picture of reality, it depends entirely on ERP telling it what happened: how much inventory is actually on hand, which open purchase orders are still outstanding, what was confirmed as received, what was produced and confirmed. Without this feed, Planning Software is running its logic on top of a plan from a previous cycle rather than on current facts. It would be like navigating with last week's map.

**FMS sends supply signals to Planning Software, not to ERP.** This distinction matters. A field planting or a grower harvest estimate is not a confirmed transaction — it is a forward-looking projection. It belongs in the planning layer, not in the execution layer. FMS tracks what is contracted, what is in the ground, what is expected to be harvested and when. Planning Software uses those signals as the supply side input for seasonal demand and supply matching. ERP will only see the supply once it has been harvested, graded, and received into inventory — at that point it becomes a confirmed transaction, and ERP records it.

**Planning Software sends approved orders back to ERP.** Once the planning run is complete and the plan is approved, Planning Software releases planned orders — purchase orders, production orders, transfer orders — into ERP for execution. ERP then manages those orders through to completion and reports the results back. This closes the loop.

## What Integration Actually Means

Most organisations do not connect these systems directly to each other. Instead, they use a middleware layer — sometimes called an iPaaS (integration platform as a service), an API hub, or an ESB (enterprise service bus). Middleware sits between the source system and the target system and does several things that neither system is designed to do for itself.

It **transforms data formats**. ERP may export inventory positions as a flat file in one schema; Planning Software expects them in a different structure. Middleware maps the fields, converts formats, and ensures the data arrives in a shape the target system can ingest.

It **handles failures gracefully**. If Planning Software is undergoing maintenance when ERP tries to push actuals, middleware queues the message and retries it when the target system is available. Without this, a brief outage in one system would cause a silent data gap in another.

It **logs what was sent and when**. This audit trail is critical for diagnosing problems. When a planner notices that their inventory figures look wrong, the first question is: did the feed run? Middleware logs answer that question. They show exactly what payload was sent, at what time, and whether it was acknowledged.

This matters for planners because when data does not arrive, the problem is usually not in the source system or the target system — it is in the middleware. A failed job, a mapping error, a schema change that was not communicated. Knowing that middleware exists, and that it is the likely failure point, helps you ask the right question when something looks wrong.

## Integration Timing and Its Consequences

The most important thing to understand about integration is that most of it does not run in real time.

MDM typically pushes master data on a nightly batch or on a triggered basis when a record is approved. ERP sends transactional actuals — inventory positions, confirmed receipts, production completions — in an overnight batch. FMS updates field supply signals daily or weekly, depending on the organisation. Planning Software is therefore always working with a snapshot of reality that is some hours old.

In practice, this means the following. If a planner in ERP receives a large batch of goods at 2pm — say, a supplier delivery that changes the on-hand quantity significantly — Planning Software will not know about that receipt until the overnight feed runs. Any planning decision made before that batch runs is based on yesterday's inventory position. If a planner in Planning Software sees a shortage exception and investigates, the exception may already have been resolved by an ERP transaction that has not yet arrived.

This is not a failure of the systems. It is the normal operating mode of a batch-integrated landscape. Experienced planners know to factor it in. When you are looking at an exception list at 9am, you are effectively looking at end-of-yesterday's position, updated by whatever the overnight batch captured. If you suspect a figure is stale, the first check is the middleware log to confirm when the last feed ran.

## What Breaks When an Integration Fails

Integration failures are not abstract IT problems — they have direct consequences for planning decisions.

**If the overnight ERP-to-Planning-Software feed fails**, planners arrive the next morning looking at inventory positions from two days ago. Exceptions on the planning board may be stale — a shortage that was already resolved, or a surplus that has since been consumed. Any planned orders released on that data will be based on wrong on-hand quantities. If an order was placed for stock that is already in the warehouse, the result is an overstock. If a shortage was already covered by a late receipt that ERP captured but Planning Software never received, a duplicate order may go out.

**If MDM fails to push a BOM change**, Planning Software continues to generate supply recommendations based on the old structure. If a component was substituted, Planning Software will still plan demand for the old component and place orders for it. The new component will be undersupplied. The error will not be obvious immediately — it will surface when production tries to consume the component that is no longer in the BOM.

**If FMS does not update**, seasonal supply projections become stale. A crop that is tracking below estimate — due to weather, disease, or grower non-performance — will not appear as a supply risk in Planning Software until FMS pushes the revised estimate. The plan will show supply it cannot rely on.

## The Single Version of Truth

One of the goals of an integrated landscape is that everyone in the organisation is working from the same numbers. A planner in Planning Software and a supply manager in ERP should be able to look at the same order, the same quantity, the same expected date. A master data team in MDM and a procurement analyst in ERP should be looking at the same lead time for the same supplier.

That coherence is only achievable under two conditions: integration is healthy and running on schedule, and the data quality at each system of record is high. If the master data in MDM has been updated but the feed has not run, the two systems will disagree. If ERP holds inventory positions that have not been confirmed against physical counts, Planning Software is planning against figures that nobody trusts.

When organisations lose confidence in their plan, the cause is usually one of these two things. Not a failure of the planning process itself — but a failure of the data foundations that the process depends on. Understanding the integration architecture, and knowing where each type of data originates and how it reaches Planning Software, is what allows a planner to diagnose those failures rather than simply distrust the output.

## Interface Summary

| Source | Target | What Flows | Typical Frequency |
|---|---|---|---|
| MDM | Planning Software | Item master, BOMs, BODs, planning parameters | Daily batch or triggered |
| MDM | ERP | Item master, vendor master, BOMs | Daily batch or triggered |
| ERP | Planning Software | On-hand inventory, open orders, confirmed receipts, production actuals | Overnight batch |
| FMS | Planning Software | Grower contracts, field supply estimates, harvest projections | Daily or weekly |
| Planning Software | ERP | Approved purchase orders, production orders, transfer orders | On approval / scheduled release |
