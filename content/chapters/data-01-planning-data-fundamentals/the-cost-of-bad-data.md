---
title: "The Cost of Bad Data"
description: "Bad planning data doesn't stay in the system — it becomes inventory, stockouts, and wasted capacity. Understanding the downstream effects makes data quality feel urgent."
chapter: "data-01-planning-data-fundamentals"
estimatedMinutes: 4
topicLayout: "prose-topic"
---

## Garbage in, garbage out

The planning engine is deterministic: given the same inputs, it always produces the same outputs. It cannot compensate for bad data. If the inputs are wrong, the plan is wrong — and the plan becomes reality when orders are placed.

This is what makes data quality a business concern, not just an IT concern.

## How bad data manifests in plans

**Inflated safety stock**
If demand variability is overestimated — because historical data includes one-off spikes that are treated as normal — safety stock settings will be too high. The result is excess inventory accumulating across the network.

**Missed production orders**
If a BOM is incomplete — a component is missing or a yield factor is wrong — the engine won't plan the right quantity of components. A production order releases, and materials aren't there.

**Phantom inventory**
If inventory records are wrong (items that were consumed but not booked out, or receipts not yet confirmed), the system believes there is stock when there isn't. It won't plan replenishment, and the line runs short.

**Unnecessary transfers**
If location-level demand is misallocated — attributed to the wrong warehouse — the system moves inventory to the wrong place. Transfers happen; the right location still stockouts.

## The compounding effect

Bad data errors don't stay contained. They propagate through the supply chain graph in both directions. A missing component in a BOM creates an underplanned sub-assembly, which creates an underplanned finished good, which creates a customer delivery failure.

The further downstream the error is caught — in execution, at the customer — the more expensive it becomes to fix.
