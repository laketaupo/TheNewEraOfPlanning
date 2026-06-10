---
title: "System Interfaces Overview"
description: "The four systems in the landscape — BC, o9, Cropin Grow, and Pimcore — are connected by a set of defined interfaces. Understanding what flows where is the foundation for troubleshooting and governance."
order: 1
chapter: "arch-01-end-to-end"
estimatedMinutes: 5
topicLayout: "prose-topic"
---

## The four-system landscape

The planning technology landscape consists of four systems, each with a distinct role:

| System | Role |
|---|---|
| **o9** | Planning engine — demand signals, supply plan, scenario simulation |
| **Business Central (BC)** | ERP — transactional execution, purchase orders, production orders, inventory posting |
| **Pimcore** | Master Data Management (MDM) — product master, item attributes, hierarchy management |
| **Cropin Grow** | Field Management System (FMS) — grower contracts, field activity, crop forecasting |

No single system has the full picture. The planning capability of o9 depends on accurate master data from Pimcore, transactional actuals from BC, and field-level supply signals from Cropin Grow. The interfaces between these systems are what make the integrated landscape function.

## Interface directions

Each interface carries data in a defined direction:

**Pimcore → o9** — product master data: item codes, descriptions, BOMs, BODs, planning parameters. Pimcore is the single source of truth for master data; o9 receives it rather than maintaining its own copy.

**Cropin Grow → o9** — field supply signals: grower contracts, planted area, expected harvest quantities and timing. These become supply-side demand signals in the o9 planning model.

**BC → o9** — transactional actuals: open purchase orders, production order completions, inventory positions, goods receipts. o9 uses these to reconcile its planned view against what has actually happened.

**o9 → BC** — planned orders for execution: purchase order proposals, production order proposals. These are reviewed by planners and released as actual orders in BC.

**Pimcore → BC** — item master synchronisation: ensuring BC's item cards reflect the same attributes and hierarchy as Pimcore.

## Integration middleware

Direct system-to-system connections in a four-system landscape create a maintenance burden. Most implementations use a middleware layer — an integration platform (iPaaS) or custom API hub — that sits between the systems and manages the data flows. This middleware handles:
- Message routing and transformation
- Error handling and retry logic
- Logging and monitoring of interface health
- Schema mapping between source and target formats

Understanding the middleware layer is important for troubleshooting: when data does not arrive in o9 as expected, the issue may be in the source system, the middleware, or the target system configuration.

## Interface frequency

Not all interfaces run at the same frequency:

| Interface | Typical frequency |
|---|---|
| Pimcore → o9 (master data) | Daily or on change |
| Cropin Grow → o9 (field signals) | Weekly or daily |
| BC → o9 (transactional actuals) | Daily (overnight) |
| o9 → BC (planned orders) | On planner release (manual trigger) |
| Pimcore → BC (item master) | Daily or on change |
