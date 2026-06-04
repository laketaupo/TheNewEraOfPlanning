---
title: "What Is a Demand Signal?"
description: "Demand in IBP is not a physical flow — it is an information signal that travels upstream through the network to trigger planning."
order: 1
chapter: "03-demand-data-flow"
estimatedMinutes: 3
---

## Demand is information, not inventory

In everyday language, "demand" feels like a pull — customers want things, so we make them. In o9 IBP, demand is modelled more precisely: it is a **signal** — a quantity and a time — that propagates backwards through the supply chain graph.

When a customer forecast lands on Item J (the finished packed seed), that number doesn't stay there. The planning engine reads the network graph, follows the edges upstream, and derives what every upstream node must contribute to satisfy that forecast.

## Why upstream?

The graph you built in Chapter 2 flows physically **downstream**: raw inputs at the left, finished goods at the right. Demand moves in the **opposite** direction. A signal at Item J creates demand for Packing, which creates demand for Item I, which creates demand for Coating — and so on, all the way back to Items A and B.

This reverse traversal is sometimes called **demand explosion** or **MRP netting** in traditional planning systems. o9 performs the same logic natively on its graph model, but extends it to handle co-products, multi-echelon transportation, and probabilistic forecasts.

## Two kinds of demand input

| Type | Where it comes from | Typical horizon |
|------|---------------------|-----------------|
| **Statistical forecast** | ML model trained on history and market signals | Weeks to months ahead |
| **Sales order** | Confirmed customer commitment | Days to weeks ahead |

In the seed-treatment network, the planning horizon is measured in growing seasons, so statistical forecasts dominate the long-range signal. Confirmed orders net against the forecast as they arrive, replacing uncertainty with hard commitments.

## What you will see in this chapter

The next two topics trace a **100-unit customer forecast** as it travels upstream, step by step, through every node in the seed-treatment network — from Item J all the way back to Items A and B. You will also see how lead times shift the demand signal back in time at each hop.
