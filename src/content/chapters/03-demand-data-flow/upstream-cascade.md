---
title: "Demand Propagating Upstream"
description: "Watch the 100-unit forecast travel step by step from Item J back to the raw material inputs Items A and B."
chapter: "03-demand-data-flow"
estimatedMinutes: 5
widget: "demand-flow"
---

## Following the signal

The animation below traces the demand signal as it moves upstream through the seed-treatment network. Use the **Next** button to step through each stage, or press **Play** to watch the full cascade automatically.

Notice two things as the signal travels:

- **Direction**: demand always moves against the physical flow — from right to left, from customer toward raw materials.
- **Quantity change at Calibrating**: because Calibrating yields co-products (Items E, F, and G), only a fraction of the output is Item F. To produce 100 units of Item F, roughly 167 units of Item D must enter the Calibrating process (assuming Item F represents about 60 % of the calibrated output by weight). Every node upstream of Calibrating therefore sees a higher quantity than the original 100 units.

## Key nodes in the cascade

| Stage | Item produced | Quantity demanded |
|-------|--------------|-------------------|
| Customer delivery | Item J (out) | 100 units |
| Ship [J] / Central Warehouse | Item J | 100 units |
| Packing → Coating → Priming | Items I, H, F | 100 units each |
| Calibrating (60 % F yield) | Item D → F | ~167 units of D |
| Cleaning → Ship [C] | Item C (CW + Grower) | ~167 units |
| Seed Production | Items A + B (at Grower) | ~167 units each |
| Ship [A] / Ship [B] | Items A + B (Central Warehouse) | ~167 units each |

The planning engine performs this calculation for every planning period in the horizon simultaneously, producing a full time-phased demand picture for each node in the network.
