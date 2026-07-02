---
title: "Exception Types"
description: "The standard exception categories across S&OP, S&OE, and Execution — what each signals, what triggers it, and who owns it."
chapter: "exception-management"
estimatedMinutes: 6
topicLayout: "prose-topic"
---

## Organising Exceptions by Type

Not all exceptions are equal in urgency, owner, or required response. Planning systems typically categorise exceptions to support triage and routing. The standard taxonomy groups exceptions into four areas: demand, supply, quality, and plan change. Each has a different meaning, a different tolerance trigger, and a different primary owner.

## Demand Exceptions

**Demand spike or dip** signals that actual demand in the near term has deviated significantly from the near-term plan. It is triggered when actuals exceed or fall below the planned figure by more than a configured percentage within a defined horizon (commonly 0–4 weeks). A spike suggests a risk of stock-out or unfulfillable orders; a dip suggests excess inventory building. The primary owner is the demand planner or commercial planning team.

**Forecast deviation** signals that the statistical forecast has diverged materially from recent actuals over a rolling window. It is triggered when the mean absolute percentage error (MAPE) or a similar accuracy metric breaches the threshold for a given item. This exception prompts a review of the demand model rather than an immediate operational response. The primary owner is the demand planner.

**Order confirmation shortfall** signals that confirmed customer orders are tracking significantly below the forecast within the confirmed horizon. It may indicate a commercial relationship at risk, a pricing issue, or a market shift. The primary owner is the account planning or commercial team, with demand planning informed.

## Supply Exceptions

**Stock-out risk** signals that projected inventory is forecast to fall below the safety stock level within the planning horizon. The threshold is typically configured as: projected stock at or below safety stock within X days. This is a high-priority exception in most businesses because it directly threatens customer service. The primary owner is the supply planner.

**Excess inventory** signals that projected stock exceeds a defined maximum (often expressed as weeks of cover above target). It indicates overproduction, a demand downturn, or a failed promotion. Excess inventory exceptions are lower urgency than stock-out risk but matter for working capital and storage capacity. The primary owner is the supply planner.

**Supply delay** signals that an inbound purchase order or production order is at risk of arriving later than the confirmed date. It may be triggered by a supplier-reported delay, a lead-time flag from the system, or a missed milestone in a production sequence. The primary owner is procurement or production planning, with supply planning informed.

**Capacity constraint** signals that the confirmed production demand for a resource exceeds its available capacity within the near-term horizon. This exception is typically generated during a supply run when the unconstrained plan cannot be met. It requires a decision: reduce the plan, move demand, source externally, or escalate. The primary owner is the supply planner, with production management involved in resolution.

## Quality Exceptions

**Quality hold** signals that a batch or lot of material has been placed on quality hold, reducing available supply below the planned figure. Planning systems that integrate with quality management receive these holds as inventory adjustments. The primary owner is the quality team for the hold itself; the supply planner owns the downstream planning response.

**Yield below plan** signals that production output is running below the planned yield rate, meaning less finished product is being produced per unit of input than expected. It is triggered when actual yield falls below the planning parameter by a configured margin. The primary owner is the production team for the operational response; the supply planner adjusts planned output quantities.

## Plan Change Exceptions

**Significant plan change** signals that a planned order — purchase order, production order, or transfer — has changed materially since the last confirmed run. Changes may be in quantity, date, or both. This exception type supports change management: it ensures planners are aware of large automated changes the system has made and can confirm or override them. The primary owner is the supply planner responsible for the affected item or resource.

## Using the Taxonomy

In practice, planning tools allow organisations to configure which exception types are active, what the thresholds are, and how exceptions are prioritised in the queue. A common default prioritisation is: supply delay and stock-out risk first (service impact), capacity constraint and demand spike second (requires rapid decision), excess inventory and forecast deviation third (important but less time-sensitive), plan change exceptions last (informational unless large).

Understanding this taxonomy is the foundation for calibrating the exception system — covered in the final topic in this chapter.
