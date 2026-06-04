---
title: "Transformation Processes (BOM)"
description: "How items are made — the Bill of Materials and the manufacturing logic behind production."
order: 2
chapter: "01-understanding-basics"
estimatedMinutes: 4
widget: ""
nodeType: "transformation"
summary: "A Transformation Process is the recipe that defines how items are made. It specifies which input items are consumed, which output items are produced, the yield per unit, the lead time, and the facility where it happens. In o9 this is known as the Bill of Materials (BOM) — and unlike traditional ERP, BOM and routing are unified into a single object. Processes can be chained: the output of one becomes the input of another, allowing o9 to resolve multi-level structures automatically when generating supply plans."
---

## What is a Transformation Process?

A **Transformation Process** describes how one or more *input items* are converted into one or more *output items*. This is essentially the **Bill of Materials (BOM)** in o9 — the recipe that defines production.

Every transformation process has:

- **Inputs** — raw materials or components consumed
- **Outputs** — finished or semi-finished goods produced
- **Yield** — how much output you get per unit of input
- **Lead time** — how long the transformation takes
- **Process location** — which facility or node performs it

## BOM vs. Routing

In traditional ERP, BOM and routing are separate. In o9 they are unified under the **Transformation Process**:

| Traditional ERP | o9 |
|---|---|
| BOM (what to use) | Transformation input items |
| Routing (how to make it) | Resource consumptions on the process |
| Work center | Resource |

## Multi-level BOMs

Transformation processes can be chained — the output of one becomes the input of another. o9 resolves these multi-level structures automatically when generating supply plans.

```
Raw Material A ──┐
                 ├──► Semi-finished X ──► Finished Product Z
Raw Material B ──┘
```

## Placeholder Content

*Replace this section with your specific BOM examples, screenshots from o9, or industry-specific transformation logic.*
