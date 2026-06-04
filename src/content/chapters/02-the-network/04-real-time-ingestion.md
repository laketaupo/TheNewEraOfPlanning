---
title: "Real-Time Data Ingestion"
description: "How o9 pulls live data from ERP, WMS, and other source systems into the Digital Brain."
order: 4
chapter: "02-the-network"
estimatedMinutes: 3
widget: ""
---

## The Data Challenge

A supply chain plan is only as good as the data behind it. o9 connects to multiple source systems — ERP, WMS, TMS, demand signal repositories, supplier portals — and keeps the Digital Brain continuously updated.

## Ingestion Patterns

| Pattern | Description | Use case |
|---|---|---|
| **Batch ETL** | Scheduled file or API transfer (hourly/daily) | ERP master data, historical sales |
| **Event streaming** | Near-real-time message queue (Kafka, etc.) | Order confirmations, shipment scans |
| **Direct API** | On-demand pull from source system | Ad-hoc queries, manual refreshes |
| **Flat file** | CSV/Excel upload via UI or SFTP | Supplier commitments, market data |

## Data Entities Ingested

- **Master data** — items, BOMs, BODs, resources, locations (typically from ERP)
- **Transactional data** — open orders, inventory positions, GR/GI movements
- **External signals** — market demand, weather, macroeconomic indicators
- **Supplier data** — confirmed quantities, lead time updates, capacity offers

## Data Quality & Governance

o9 includes data validation rules at ingestion time. Errors are surfaced to the responsible data owner rather than silently corrupting the plan. Clean master data is a prerequisite for a reliable plan.

## Placeholder Content

*Describe your specific integration landscape — which systems feed o9 in your environment, and at what frequency.*
