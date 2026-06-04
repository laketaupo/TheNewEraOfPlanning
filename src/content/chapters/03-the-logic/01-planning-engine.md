---
title: "How the Planning Engine Works"
description: "The core planning loop — from demand signal to feasible supply plan."
order: 1
chapter: "03-the-logic"
estimatedMinutes: 5
widget: ""
---

## The Planning Problem

Given:
- A set of **demand requirements** (customer orders, forecasts)
- A **network** of items, processes, resources, and locations
- A set of **constraints** (capacity, lead time, MOQ, shelf life)

The planning engine must produce:
- A set of **supply orders** (production, procurement, transfer) that satisfies demand
- A **feasible schedule** that respects all constraints
- A **priority ranking** when not all demand can be met

## The Planning Loop

o9 runs a multi-pass planning loop:

```
1. Demand netting
   Gross demand − existing supply (inventory + open orders) = Net requirements

2. Supply explosion
   Trace net requirements upstream through BOMs and BODs to compute component needs

3. Capacity check
   Map supply orders to resources via Resource Consumptions
   Flag overloads and underloads

4. Optimization
   Adjust order quantities, timing, and sourcing to minimize cost / maximize service
   within constraints

5. Output
   Planned production orders, purchase requisitions, transfer orders
```

## Unconstrained vs. Constrained Planning

o9 supports both modes:

| Mode | What it does | When to use |
|---|---|---|
| **Unconstrained** | Ignores capacity — shows what demand requires | Demand review, budget planning |
| **Constrained** | Respects capacity limits — shows what is feasible | Supply review, execution planning |

Planners typically run unconstrained first to see the full picture, then run constrained to build the executable plan.

## Placeholder Content

*Describe the specific planning cycle (S&OP, S&OE) used in your organization and where each planning mode is applied.*
