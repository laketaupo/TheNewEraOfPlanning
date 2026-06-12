---
title: "Supply Flowing Downstream"
description: "Watch planned orders and inventory flow step by step from Items A and B all the way to the customer."
chapter: "04-supply-data-flow"
estimatedMinutes: 5
widget: "supply-flow"
---

## From inputs to customer

The animation below traces supply moving **downstream** through the seed-treatment network. Each step shows planned orders being executed and inventory advancing through the chain. Use **Next** to step through each stage, or **Play** to watch the full flow automatically.

Notice how inventory netting reduces quantities at each node before triggering a new planned order, and how co-product splits at Calibrating determine what flows into Priming versus what accumulates as Item E and Item G inventory.

## The downstream sequence

| Stage | Supply event | Quantity |
|-------|-------------|---------|
| Items A + B (Central Warehouse) | Available stock confirmed | 167 units each |
| Ship [A] / Ship [B] | Transportation planned orders released | 167 units each |
| Items A + B (Grower) | Inputs arrive at Grower | 167 units each |
| Seed Production | Production order runs | → 167 units of Item C |
| Ship [C] | Transportation order | → 167 units to Central Warehouse |
| Cleaning | Production order (net of 20 on-hand) | → 147 units of Item D |
| Calibrating | Production order; co-product split | → 100 units F, 33 units E, 33 units G |
| Priming | Production order | → 100 units of Item H |
| Coating | Production order | → 100 units of Item I |
| Packing | Production order | → 100 units of Item J |
| Ship [J] | Transportation order | → 100 units delivered to customer |

## Reading the supply plan

The table above is a simplified, single-period snapshot. In practice, the planning engine calculates this for every time bucket in the horizon — often 52+ weeks — simultaneously. The output is a **time-phased supply plan**: a complete schedule of when each node starts and completes its work, and how much inventory is projected at each location in each period.

This plan is the foundation for everything in the next chapters: the constraint optimisation that refines it, the scenario simulation that stress-tests it, and the plan-vs-actuals comparison that measures how well reality tracked the plan.
