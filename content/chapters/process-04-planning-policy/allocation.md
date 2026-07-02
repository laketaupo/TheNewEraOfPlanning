---
title: "Allocation Policy"
description: "When supply cannot meet all demand, allocation policy determines which customers get which quantities. Defining this in advance prevents ad hoc decisions under pressure and ensures commercial priorities are respected."
chapter: "process-04-planning-policy"
estimatedMinutes: 4
topicLayout: "prose-topic"
---

## Why allocation policy matters

Allocation is the process of distributing available supply across competing demand when total supply is insufficient to fulfil everything. This happens regularly in supply-constrained environments: a poor crop year, a production shortfall, a delayed shipment.

Without an explicit allocation policy, the decision defaults to whoever is most persistent, most senior, or most connected — not necessarily the customer or channel that creates the most value for the business. An allocation policy replaces this ad hoc process with a documented set of rules applied consistently.

## Common allocation approaches

**Proportional allocation** — each customer receives supply in proportion to their ordered quantity. If 80% of supply is available, every customer gets 80% of their order. Simple and defensible, but ignores commercial differentiation.

**Priority-based allocation** — customers are ranked by a priority tier (strategic, standard, spot) and supply is allocated in full to higher tiers before lower tiers receive any. Higher service for key customers, but lower tiers may receive very little in a severe shortage.

**Commitment-based allocation** — customers with long-term volume commitments or contractual obligations receive their committed quantities first. Excess supply is then allocated to spot orders or top-up requests. Protects contractual relationships but requires accurate commitment tracking.

**Profitability-based allocation** — supply is allocated to maximise margin contribution. Requires a clear view of margin by customer-product combination and a willingness to act on it.

In practice, most businesses use a hybrid: a priority tier structure with proportional allocation within each tier.

## Encoding allocation in Planning software

In Planning software, allocation rules can be encoded at the demand signal or customer level. The system respects these priorities during planning, ensuring that the plan reflects the intended allocation logic before orders are confirmed. This is preferable to allocating manually after the plan has been published — by then, commitments may already have been communicated.

## When to invoke allocation

Allocation is not a routine process — it is invoked when supply is projected to fall short of total demand. The signal to trigger allocation comes from the planning model: when a product shows a shortage exception across one or more customer-periods, the planner reviews whether the shortage is real, its duration, and then applies the allocation policy to determine the fair distribution of available supply.
