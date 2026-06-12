---
title: "Where Demand Enters the Network"
description: "The customer forecast lands on Item J — the finished packed seed — and this single number sets the entire upstream plan in motion."
chapter: "03-demand-data-flow"
estimatedMinutes: 3
---

## Item J: the entry point

Every demand signal needs a place to land. In the seed-treatment network that entry point is **Item J** — the packed, coated, primed, calibrated seed that is shipped from the Central Warehouse to the customer via the final BOD lane.

A forecast of **100 units of Item J** in a given planning period is the starting assumption for everything downstream. Until that number exists, the planning engine has no reason to schedule Packing, Coating, Priming, or any upstream process.

## Forecast vs. demand plan

The raw forecast from the ML model is a probability distribution — for example, "90 % confidence the customer will need between 85 and 115 units." The **demand plan** is the single number committed to by the commercial team: 100 units. This is the number that the planning engine uses.

In Planning software the demand plan lives on the Item J **line item** at the customer location. A line item is a (item, location, time) combination, and the demand plan is one of its key attributes alongside on-hand inventory, safety stock, and lead time.

## The parent line item relationship

Item J at the customer is a **child** demand node. The planning engine traces back through the BOD edge (Ship [J] process) to find Item J at the Central Warehouse — the **parent line item**. The 100-unit forecast propagates to the parent: the Central Warehouse must have 100 units ready to ship.

This parent → child relationship repeats all the way up the network. Each step upstream creates a new parent that must be planned to satisfy the child.

## Time offsets begin here

The customer expects delivery by a specific date. The Ship [J] process has a lead time — say, 3 days. So the Central Warehouse must have Item J ready **3 days before** the customer needs it. Every hop upstream shifts the required start date back by the process lead time, creating a cascade of time-offset requirements across the whole network.
