---
title: "Resource Consumptions"
description: "The link between transformation processes and resources — how much capacity each process uses."
order: 5
chapter: "01-understanding-basics"
estimatedMinutes: 3
widget: ""
---

## What is a Resource Consumption?

A **Resource Consumption** connects a **Transformation Process** to a **Resource**. It defines *how much* of a resource is used when the process runs.

This is the link that makes capacity planning possible. Without resource consumptions, the planning engine has no way to know that producing 1,000 units of Product X will occupy Bottling Line 3 for 8 hours.

Key attributes:

- **Process** — which transformation process uses the resource
- **Resource** — which resource is consumed
- **Consumption rate** — how much capacity is used per unit of output (e.g., 0.5 hours/unit)
- **Consumption type** — fixed (setup time) or variable (run rate)

## Fixed vs. Variable Consumption

| Type | Meaning | Example |
|---|---|---|
| **Fixed** | Consumed once per batch, regardless of quantity | 2-hour setup per production run |
| **Variable** | Consumed proportionally to output quantity | 0.05 hours per unit produced |

Most processes have both: a fixed setup component and a variable run component.

## How It Fits Together

```
Transformation Process  ──uses──►  Resource
       │                            │
       │  Resource Consumption      │
       │  (rate: 0.5 hr/unit)       │
       └────────────────────────────┘
```

When o9 generates a production plan, it sums all resource consumptions across all planned batches and compares them to available capacity — flagging overloads or underutilization.

## Placeholder Content

*Replace this section with specific consumption rates, bottleneck analysis, or o9 screenshots from your environment.*
