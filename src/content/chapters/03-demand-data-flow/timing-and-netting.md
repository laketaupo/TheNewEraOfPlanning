---
title: "Lead Times and Demand Netting"
description: "How process lead times shift demand backward in time, and how on-hand inventory reduces the quantity that must be planned."
chapter: "03-demand-data-flow"
estimatedMinutes: 4
---

## Demand netting: inventory first

Before a demand signal triggers a new planned order, the planning engine checks whether existing inventory can already cover it. This step is called **netting**.

For example, if the Central Warehouse has 40 units of Item D on hand and 167 units are demanded, the net requirement is only 127 units. Cleaning only needs to be scheduled for 127 units, not 167. The same netting logic applies at every node in the network, using the on-hand inventory recorded on each line item.

Safety stock is treated as a floor: the engine will not net below it. If Item D has a safety stock of 30 units, those 30 units are reserved and cannot be used to satisfy gross demand.

## Time-phased demand

Planning software plans in discrete time buckets — typically days or weeks. The demand signal is not just a quantity; it is a **quantity at a specific time**. The planning engine must ensure that each upstream node completes its work in time to feed the next downstream node.

Each process has a **lead time** attribute (set on the Transformation or Transportation Process node). When the engine places demand upstream, it subtracts the lead time to find the latest possible start date:

```
Required start = Required delivery − Process lead time
```

For the seed-treatment network, process lead times stack significantly:

| Process | Typical lead time |
|---------|------------------|
| Ship [J] to customer | 3 days |
| Packing | 1 day |
| Coating | 2 days |
| Priming | 5 days |
| Calibrating | 1 day |
| Cleaning | 1 day |
| Ship [C] from Grower | 7 days |
| Seed Production (growing season) | 90–120 days |
| Ship [A/B] to Grower | 5 days |

Adding these up, a customer forecast for delivery in Week 30 may require Items A and B to leave the Central Warehouse in **Week 10** — 20 weeks earlier. This is the core reason why long-horizon planning matters in agriculture: the demand signal must be visible far enough upstream to trigger procurement and growing decisions in time.

## What the plan looks like

After netting and time-phasing, each node in the network has a time-phased **planned order**: a quantity to produce or transport, starting on a specific date. These planned orders collectively form the supply plan — which is the subject of the next chapter.
