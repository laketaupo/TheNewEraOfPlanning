---
title: "Transactional Data"
description: "Transactional data records what has happened: inventory movements, order receipts, production completions. It is the evidence of execution — and the foundation for keeping the plan grounded in reality."
order: 2
chapter: "data-03-data-types"
estimatedMinutes: 4
topicLayout: "prose-topic"
---

## What transactional data is

Transactional data records business events: a goods receipt posted in ERP, a production order completed, a customer shipment confirmed, an inventory count performed. Each transaction has a timestamp, a quantity, and a reference to the master data entities involved (item, location, supplier, customer).

Unlike master data, transactional data is high-volume and high-velocity. Hundreds or thousands of transactions may be posted in ERP on a given day. It is also immutable — once posted, a transaction is part of the permanent record. Corrections are made through reversal transactions, not by editing existing ones.

## Transactional data in the planning context

For the planning model in Planning software, transactional data serves two purposes:

**Grounding the plan in actuals** — inventory positions in Planning software are updated from ERP's actual posted inventory levels. Open purchase orders in Planning software reflect what is actually open in ERP. Without this actuals feed, Planning software would plan against its own projected positions, which drift from reality over time as transactions are posted.

**Measuring planning performance** — actual deliveries, production quantities, and order fulfilment events allow the organisation to measure how well the plan was executed. The KPI of Plan Adherence, for example, is calculated by comparing planned orders (from Planning software) against actual transactions (from ERP).

## Common transactional data issues

**Timing gaps** — transactional data flows from ERP to Planning software via the nightly batch. Events posted in ERP after the batch runs are not visible in Planning software until the next cycle. Planners should be aware of this: the inventory position in Planning software at 9am reflects ERP's position as of the previous night's batch, not the current minute.

**Posting backlogs** — if the operations team is behind on posting transactions (a production order completed two days ago but not posted in ERP yet), Planning software will not reflect it. The plan will show a projected stock that is lower than the actual stock.

**Quality holds** — inventory that is in a quality hold in ERP is not available for planning purposes, but may appear as available in Planning software if the hold status is not correctly reflected in the integration. This causes the plan to show available supply that cannot actually be used.

## Transactional data vs. master data corrections

A common confusion: a planning problem that looks like a transactional issue may actually be a master data problem. If a purchase order is always arriving later than planned, the issue may not be the individual transaction — it may be that the lead time in the master data is wrong. Diagnosing whether a planning discrepancy is caused by a bad transaction or bad master data is an important skill for planners.
