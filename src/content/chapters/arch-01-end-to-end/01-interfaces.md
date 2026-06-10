---
title: "System Interfaces Overview"
description: "The four systems in the landscape — ERP, Planning software, FMS, and MDM system — are connected by a set of defined interfaces. Understanding what flows where is the foundation for troubleshooting and governance."
order: 1
chapter: "arch-01-end-to-end"
estimatedMinutes: 5
topicLayout: "prose-topic"
---

## The four-system landscape

The planning technology landscape consists of four systems, each with a distinct role:

| System | Role |
|---|---|
| **Planning software** | Planning engine — demand signals, supply plan, scenario simulation |
| **ERP** | ERP — transactional execution, purchase orders, production orders, inventory posting |
| **MDM system** | Master Data Management (MDM) — product master, item attributes, hierarchy management |
| **FMS** | Field Management System (FMS) — grower contracts, field activity, crop forecasting |

No single system has the full picture. The planning capability of Planning software depends on accurate master data from MDM system, transactional actuals from ERP, and field-level supply signals from FMS. The interfaces between these systems are what make the integrated landscape function.

## Interface directions

Each interface carries data in a defined direction:

**MDM system → Planning software** — product master data: item codes, descriptions, BOMs, BODs, planning parameters. MDM system is the single source of truth for master data; Planning software receives it rather than maintaining its own copy.

**FMS → Planning software** — field supply signals: grower contracts, planted area, expected harvest quantities and timing. These become supply-side demand signals in the Planning software planning model.

**ERP → Planning software** — transactional actuals: open purchase orders, production order completions, inventory positions, goods receipts. Planning software uses these to reconcile its planned view against what has actually happened.

**Planning software → ERP** — planned orders for execution: purchase order proposals, production order proposals. These are reviewed by planners and released as actual orders in ERP.

**MDM system → ERP** — item master synchronisation: ensuring ERP's item cards reflect the same attributes and hierarchy as MDM system.

## Integration middleware

Direct system-to-system connections in a four-system landscape create a maintenance burden. Most implementations use a middleware layer — an integration platform (iPaaS) or custom API hub — that sits between the systems and manages the data flows. This middleware handles:
- Message routing and transformation
- Error handling and retry logic
- Logging and monitoring of interface health
- Schema mapping between source and target formats

Understanding the middleware layer is important for troubleshooting: when data does not arrive in Planning software as expected, the issue may be in the source system, the middleware, or the target system configuration.

## Interface frequency

Not all interfaces run at the same frequency:

| Interface | Typical frequency |
|---|---|
| MDM system → Planning software (master data) | Daily or on change |
| FMS → Planning software (field signals) | Weekly or daily |
| ERP → Planning software (transactional actuals) | Daily (overnight) |
| Planning software → ERP (planned orders) | On planner release (manual trigger) |
| MDM system → ERP (item master) | Daily or on change |
