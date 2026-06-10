---
title: "Data Governance Basics"
description: "Data quality doesn't maintain itself. Governance defines who is responsible for which data, how changes are approved, and how issues are escalated."
order: 4
chapter: "data-02-data-quality-and-impact"
estimatedMinutes: 4
topicLayout: "prose-topic"
---

## Why governance exists

Data quality problems are almost always human process problems, not technical problems. The data isn't wrong because the system is broken — it's wrong because someone changed a process, a product, or a supplier and didn't update the planning data. Governance is the set of processes that ensure updates happen consistently and promptly.

## Core governance principles

**Data ownership**
Every critical data element should have a named owner — a person or team responsible for its accuracy. For demand forecasts, this is typically commercial planning or sales. For master data (BOMs, lead times, item attributes), it is typically the supply chain master data team. Without ownership, no one is accountable when data is wrong.

**Change management**
When a product changes — a new recipe, a new supplier, a new packaging format — the data in Planning software must be updated before the next planning run. This requires a process: a trigger (the change decision), an action (update the data), and a verification (confirm the update was applied correctly).

**Audit trails**
Changes to planning-critical data should be logged: what changed, who changed it, and when. This makes it possible to trace a plan anomaly back to a data change, and to reverse errors quickly.

## Practical starting point

You don't need a full data governance programme on day one. Start with three questions:

1. Who is currently responsible for updating this data element when it changes?
2. How would we know if this data element were wrong?
3. How long would it take us to find and fix a data error before it affected the plan?

The answers usually reveal the biggest gaps.
