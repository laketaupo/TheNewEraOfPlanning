---
title: "Constraint-Based Optimization"
description: "How o9 balances supply, demand, and capacity constraints to generate the best possible plan."
order: 2
chapter: "03-the-logic"
estimatedMinutes: 4
widget: ""
---

## What is Constraint-Based Optimization?

When resources are limited, you cannot always make everything you need when you need it. **Constraint-based optimization** is the process of finding the best plan given these limits.

o9 uses mathematical optimization (linear programming and heuristics) to:

1. **Identify bottlenecks** — which resource or item constrains the plan
2. **Prioritize demand** — decide which demand to fulfill first when supply is short
3. **Minimize cost** — choose the cheapest sourcing option that meets service targets
4. **Maximize service** — fill the highest-priority demand first

## Common Constraints

| Constraint type | Example |
|---|---|
| Capacity | Bottling line can run max 8 hours/day |
| Lead time | Supplier needs 6 weeks minimum |
| MOQ / MOI | Minimum order quantity of 1,000 units per PO |
| Shelf life | Finished good expires in 90 days |
| Storage | DC can hold max 500 pallets of frozen goods |
| Budget | Procurement spend capped per quarter |

## Priority Rules

When demand exceeds supply, o9 applies **priority rules** to decide what to fulfill:

- Customer tier (strategic > standard > spot)
- Order commit date (earliest first)
- Margin contribution (highest margin first)
- Configurable rules per business unit

## Placeholder Content

*Add your organization's specific priority rules, bottleneck resources, or optimization objectives here.*
