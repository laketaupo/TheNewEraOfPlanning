---
title: "Supply Signals"
description: "The supply signals an S&OE planner tracks each week and how each feeds the monitoring picture."
chapter: "soe-supply-monitoring"
estimatedMinutes: 5
topicLayout: "prose-topic"
---

## What supply monitoring covers

Supply monitoring in S&OE is the counterpart to demand monitoring. Where demand monitoring asks "is what customers want aligned with what the plan said they would want?", supply monitoring asks "is what the supply chain is delivering aligned with what the plan said it would deliver?" Both questions must be answered weekly for the integrated S&OE picture to be complete.

Supply monitoring tracks four categories of signal: inbound purchase orders, production output, inventory position, and quality holds.

## Inbound purchase orders

For each active purchase order in the near-term horizon, the S&OE planner monitors two metrics: on-time delivery rate and quantity confirmation.

On-time delivery rate measures whether suppliers are confirming delivery on the committed date. A supplier who has delivered on time for twelve consecutive weeks is a low-risk item in the monitoring picture. A supplier who has missed three of the last five committed dates is a risk that requires active tracking, regardless of whether there is currently a confirmed delay for the next delivery.

Quantity confirmation tracks whether the supplier has confirmed they will deliver the full ordered quantity. Partial confirmations — suppliers signalling they will deliver less than ordered — are a leading indicator of potential stock-outs and need to be resolved well before the delivery date arrives.

## Production output vs. schedule

Where supply involves internal manufacturing or co-manufacturing, the planner tracks actual production output against the production schedule. Underperformance against schedule depletes available inventory faster than the plan assumed. Overperformance, while often welcome, can create inventory build-up if demand is running below plan.

The relevant metrics are schedule adherence (percentage of scheduled production completed on time) and yield rate (units produced as a proportion of units started, where quality losses reduce usable output). Both affect the supply picture and need to be visible to the S&OE planner even if they sit primarily within the operations function.

## Inventory position by SKU and location

Inventory position is the integrated result of supply and demand: it reflects everything that has flowed in and everything that has flowed out. The S&OE planner monitors two inventory metrics: days of cover and stock-out risk.

Days of cover measures how many days of current demand rate the existing stock can satisfy. A SKU with twenty days of cover and a two-week replenishment lead time has a comfortable buffer. A SKU with ten days of cover and a three-week lead time is already at risk if nothing in the supply pipeline is confirmed.

Stock-out risk is typically surfaced as a flag or alert in the planning system when the projected inventory position (accounting for confirmed supply receipts and the demand plan) drops below the safety stock level within the monitoring horizon.

## Quality holds and their impact on available supply

Inventory that has been quarantined for quality reasons appears in total stock figures but is not available to satisfy orders. Quality holds in the monitoring window — especially on high-volume or constrained materials — can create a supply gap that is not visible from inventory position alone.

The S&OE planner tracks active quality holds and their expected resolution dates. A hold expected to clear within 48 hours may be manageable. A hold with an uncertain release date on a fast-moving item must be escalated immediately, as it effectively removes supply that the plan is counting on.

## Reading the supply picture as a whole

Like demand signals, supply signals are most useful when read together. A supplier running below confirmed quantity, combined with a low days-of-cover position and no alternative supply source in the pipeline, is a high-severity supply risk. The same supplier shortfall, where stock is adequate and a secondary supplier can cover, may be a low-priority exception. The S&OE planner's value lies in integrating these signals into a coherent near-term supply picture and acting proportionately.
