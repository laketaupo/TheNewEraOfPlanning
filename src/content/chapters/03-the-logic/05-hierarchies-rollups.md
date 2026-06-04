---
title: "Hierarchies & Rollups"
description: "How o9 organizes items, locations, and time into hierarchies for aggregated planning."
order: 5
chapter: "03-the-logic"
estimatedMinutes: 3
widget: ""
---

## Planning at Multiple Levels

Supply chain decisions happen at different levels of granularity:

- **Executive** wants to see revenue and margin by region
- **S&OP team** wants to see volume by product family and country
- **Supply planner** wants to see individual SKU inventory at a specific DC
- **Production scheduler** wants to see by machine and shift

o9 supports all of these views simultaneously through **hierarchies**.

## Item Hierarchies

Items are organized in a tree:

```
All Products
├── Category: Beverages
│   ├── Brand: Cola
│   │   ├── Product family: Cola Regular
│   │   │   ├── SKU: Cola Regular 500ml
│   │   │   └── SKU: Cola Regular 1.5L
│   │   └── Product family: Cola Zero
│   └── Brand: Water
└── Category: Snacks
```

Demand and supply can be planned at any level of this hierarchy. Higher-level plans are **disaggregated** down to the SKU level for execution.

## Location Hierarchies

Similarly, locations are nested:

```
Global
├── Region: Europe
│   ├── Country: Netherlands
│   │   ├── Plant: Amsterdam
│   │   └── DC: Rotterdam
│   └── Country: Germany
└── Region: North America
```

## Rollups in the Plan

Quantities at lower levels **roll up** automatically to higher levels. A planner working at the product-family level sees an aggregate of all SKU quantities, and any change is automatically disaggregated back down using a configurable **disaggregation rule** (e.g., by historical sales proportion).

## Placeholder Content

*Add your specific item and location hierarchy structure, or describe how your organization uses different hierarchy levels in different planning meetings.*
