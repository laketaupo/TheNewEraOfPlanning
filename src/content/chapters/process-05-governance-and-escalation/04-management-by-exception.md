---
title: "Management by Exception"
description: "Exception-based working is the practice of directing planner attention to deviations from plan rather than reviewing everything. It makes a large planning model manageable and focuses effort where it matters most."
order: 4
chapter: "process-05-governance-and-escalation"
estimatedMinutes: 5
topicLayout: "prose-topic"
---

## The core principle

A modern supply chain planning model can contain tens of thousands of items, locations, and time buckets. No planner can review all of them. Management by exception (MbE) — also called exception-based working — is the discipline of reviewing only the items that have deviated from plan beyond acceptable bounds, and trusting that items within tolerance do not need intervention.

This is not laziness. It is the correct application of limited planning capacity. The planner's job is not to review every item — it is to make the right decisions on the items that matter.

## What constitutes an exception

An exception is any planning situation that falls outside a defined tolerance. Common exception types in supply chain planning:

- **Shortage exception** — projected stock below minimum or zero within the planning horizon
- **Excess inventory exception** — projected stock above maximum, indicating overproduction or demand shortfall
- **Lead time exception** — a supply order at risk of arriving late relative to need date
- **Forecast deviation exception** — actual demand deviating from forecast by more than a defined percentage
- **Plan change exception** — a significant change to a planned order (quantity, timing) since the last planning run

Each exception type should have a defined tolerance (e.g., "flag as exception if projected stock drops below 2 weeks of forward demand") and a defined owner.

## Exception-based working in Planning software

Planning software is designed to support exception-based working. The workspace can be configured to surface exceptions automatically on the planner's dashboard — grouped by type, severity, and due date. This means the planner opens Planning software each morning and sees not a full inventory of the planning model, but a prioritised list of issues that need attention.

The discipline is not just in the system configuration. It requires that planners trust the exceptions list — if an item is not on the exceptions list, it does not need daily review. Planners who override this and review everything "just in case" are defeating the model and creating a false sense of control.

## Keeping exceptions actionable

Exception-based working only works if exceptions are actionable. An exceptions list that is consistently too long (because tolerances are set too tight) trains planners to ignore it. One that is too short (because tolerances are too loose) misses real problems.

Exception tolerances should be reviewed regularly — at least quarterly — and adjusted based on experience. The target is a daily exceptions list that the planner can work through in a defined period (e.g., one hour) and resolve within their authority or escalate as appropriate.

## The connection to escalation

Exception-based working and escalation paths are complementary. The exception flags the issue. The decision framework determines whether the planner can resolve it. The escalation path determines who it goes to if they cannot. The three elements together form a coherent governance structure for the planning process.
