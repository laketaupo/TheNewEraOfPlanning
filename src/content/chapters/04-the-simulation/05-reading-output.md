---
title: "Reading Simulation Output"
description: "How to interpret the numbers and signals that o9 produces after running a scenario."
order: 5
chapter: "04-the-simulation"
estimatedMinutes: 3
widget: ""
---

## What Does a Scenario Produce?

After running a scenario, o9 generates a full set of planned supply orders and associated metrics. Here's how to read the most important outputs:

## Plan Summary Metrics

| Metric | What it tells you |
|---|---|
| **OTIF (On Time In Full)** | % of demand lines fulfilled at the right time, right quantity |
| **Projected inventory** | Inventory position by item/location across the planning horizon |
| **Capacity utilization** | % of each resource's available capacity consumed per period |
| **Total supply cost** | Estimated cost of all planned orders (production + procurement + transport) |
| **Demand fulfillment gap** | Quantity and value of demand that cannot be met in this plan |

## Exception Colours

o9 uses a traffic-light system for exceptions:

- **Red** — critical: action required to avoid a stockout or capacity violation
- **Amber** — warning: within threshold, monitor closely
- **Green** — within plan: no action needed

## Scenario Comparison View

When comparing a scenario to the baseline, o9 shows delta columns:

```
               Baseline    Scenario    Delta
OTIF           94.2%       96.8%       +2.6pp
Inventory (days)  18        22          +4
Supply cost     €4.2M      €4.5M       +€300k
```

This lets you quantify the trade-off: *"+2.6pp service level for +€300k cost — is that worth it?"*

## The Decision

Every scenario ends with a decision:

- **Accept** — make this scenario the new baseline, trigger order release
- **Modify** — adjust inputs and re-run
- **Discard** — the scenario is not viable; return to the current baseline

## Placeholder Content

*Add real scenario output examples — screenshots of your comparison view, or a table of a recent S&OP decision supported by scenario analysis in o9.*
