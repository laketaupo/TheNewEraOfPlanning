---
title: "Execution and ERP"
description: "ERP is the system of record for execution. Understanding how planning software and ERP interact — and where each one's authority begins and ends — is essential for clean execution."
chapter: "exec-01-execution-fundamentals"
estimatedMinutes: 4
topicLayout: "prose-topic"
---

## The ERP as execution backbone

Enterprise Resource Planning (ERP) systems are built to manage operational transactions: purchase orders, production orders, goods receipts, sales orders, and financial postings. Execution happens in the ERP — it is where the physical movement of goods is recorded and where financial commitments are made.

Planning software, by contrast, is optimised for modelling future states and running constrained plans across a multi-period horizon. The two systems serve different purposes and operate at different speeds.

## How planning software and ERP interact

The integration between planning software and ERP typically works in two directions:

**Planning software → ERP (plan release)**
Confirmed replenishment orders, production orders, and purchase requisitions are transferred from planning software to ERP for execution. The ERP converts these into actionable operational documents: POs, work orders, transfer orders.

**ERP → Planning software (actuals feedback)**
Stock movements, production confirmations, goods receipts, and sales order dispatches flow from ERP back into the planning system as actuals. This keeps the planning model aligned with what has physically happened.

## The master data dependency

Both systems depend on clean master data to operate correctly: item master, supplier master, BOM, routing, and location data. If the ERP and planning software are not synchronised on master data — different UoMs, different lead times, missing BOM entries — the integration breaks and both systems produce inaccurate results.

## What planners need to understand about ERP

Planners do not need to be ERP experts, but they do need to understand:

- **Which orders live where** — which orders are managed in the planning system versus which are committed in ERP
- **The lead time for ERP processing** — how long does it take for a planned order in the system to become a released PO in ERP? This affects how far ahead decisions need to be made.
- **The freeze horizon** — most ERP implementations have a period in the near term where orders cannot be changed without exception processing. Planners must know this horizon to avoid creating rework.

## Resolving planning-ERP discrepancies

When the planning system and ERP show different stock levels or order statuses, the discrepancy must be investigated rather than ignored. Common causes: goods receipts not yet processed in ERP, partial deliveries not updated, manual adjustments made in ERP outside the planning process. These discrepancies erode trust in the plan and should be resolved at their root cause rather than worked around.
