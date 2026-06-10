---
title: "Where Data Comes From"
description: "Planning data doesn't originate in Planning software — it is loaded from source systems. Understanding the sources helps you understand why data problems occur."
order: 3
chapter: "data-01-planning-data-fundamentals"
estimatedMinutes: 3
topicLayout: "prose-topic"
---

## Planning software is a planning layer, not a source of record

Planning software does not create business data — it receives it. Inventory levels, customer orders, production capacities, and supplier lead times all originate in other systems: ERPs, WMS systems, CRM tools, or even manual spreadsheet uploads. Planning software aggregates these signals and uses them to calculate a plan.

Understanding this is critical: if a source system has bad data, Planning software will plan with bad data.

## Common data sources

**ERP systems (SAP, Oracle, Dynamics)**
The most common source for master data — items, BOMs, locations, and resources — and for transactional data like open purchase orders, production orders, and inventory snapshots.

**Customer systems**
Demand signals often arrive as customer forecasts, firm orders, or point-of-sale data from retail customers. These flow in via EDI, API, or file feeds.

**Market intelligence**
Statistical forecasting tools, market data providers, or internal commercial teams produce demand forecasts that overlay or replace customer-provided signals.

**Manual uploads**
Not all data is automated. Supplier capacity, allocation decisions, and exception overrides often arrive as Excel files processed through Planning software's data load interfaces.

## The integration challenge

Each source system speaks a different language. Data needs to be mapped, transformed, and validated before Planning software can use it. A supplier lead time in an ERP might be in working days; Planning software needs calendar days. An item description might be truncated differently across systems.

These integration gaps — mapping errors, format mismatches, missing values — are one of the most common causes of data quality problems in practice.
