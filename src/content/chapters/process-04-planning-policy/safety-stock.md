---
title: "Safety Stock Policy"
description: "Safety stock is the buffer inventory held to absorb demand and supply variability. The policy determines how much to hold, where to hold it, and when to replenish it."
chapter: "process-04-planning-policy"
estimatedMinutes: 5
topicLayout: "prose-topic"
---

## What safety stock does

Safety stock is inventory held specifically to protect against uncertainty — demand that comes in higher than forecast, supply that arrives later than planned, or both simultaneously. Without safety stock, any deviation from plan results in a stock-out. With it, the system absorbs a defined range of variability before service is affected.

Safety stock is not the same as cycle stock (the inventory used to meet average demand between replenishment cycles). It is an additional buffer that sits on top of the cycle stock and is only consumed when deviations occur.

## How safety stock is calculated

The standard safety stock formula takes three inputs:
1. **Demand variability** — the standard deviation of demand over the lead time period
2. **Lead time variability** — how much the replenishment lead time varies from its average
3. **Service level target** — the desired probability of not stocking out (expressed as a Z-score)

The formula: `SS = Z × √(LT × σ_demand² + D_avg² × σ_LT²)`

In practice, Planning software handles this calculation using the planning parameters set for each item-location. The planner's role is to set the right service level target and ensure that demand and lead time variability data is accurate.

## Safety stock as a policy decision

The calculation is mechanical, but the inputs are policy decisions:

- **Which items get safety stock?** Not every item warrants a buffer. Highly predictable items, items with very short lead times, or items where stock-outs carry low commercial cost may be planned without safety stock.
- **Where in the network is safety stock held?** Holding safety stock upstream (as raw material or work-in-progress) is cheaper per unit but takes longer to convert to finished goods. Holding it downstream (as finished product) gives faster response but at higher cost.
- **How often are targets reviewed?** Demand and supply variability change over time. Safety stock parameters that were right last year may be too high (wasting working capital) or too low (causing service failures) today.

## Safety stock in an agricultural context

Seed production supply chains have asymmetric safety stock challenges: production quantities are determined seasons in advance, and finished seed cannot be held indefinitely (germination rates decline over time). Safety stock policy in this context must balance service level protection against the risk of carrying stock past its usable window — making the policy more conservative than standard FMCG approaches.
