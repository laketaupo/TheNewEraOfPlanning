---
title: "Service Level Targets"
description: "Service level targets define how reliably the organisation commits to fulfilling customer demand. They are a policy decision that balances customer satisfaction against inventory cost."
order: 1
chapter: "process-04-planning-policy"
estimatedMinutes: 4
topicLayout: "prose-topic"
---

## What a service level target is

A service level target is a policy commitment: the percentage of customer demand the organisation aims to fulfil on time, in full. A 95% service level target means the organisation accepts that 5% of demand will not be met as promised — either delivered late, in partial quantity, or not at all.

Service level targets are not aspirational goals — they are inputs to the planning system. When a target is set, the system uses it to calculate how much safety stock is required to achieve that level of availability, given the variability of demand and supply.

## Why the target is a trade-off

Higher service levels require more inventory. A 98% service level requires significantly more safety stock than a 95% target because you are covering a much thinner tail of demand variability. The relationship is non-linear: moving from 90% to 95% costs less than moving from 95% to 99%.

The business needs to decide: how much inventory cost (and associated working capital, storage, and obsolescence risk) is it willing to accept to achieve a given service level? That decision is different for different products and different customers.

## Differentiating service level targets

Not all products and customers warrant the same service level commitment. A well-designed service level policy differentiates:

- **By customer tier** — strategic customers may be committed to 98% while standard customers get 95%
- **By product ABC class** — high-volume, high-margin products are held to higher standards than slow-movers
- **By channel** — own distribution may be held to different standards than export or spot sales
- **By season** — peak season may require elevated targets that are relaxed in the off-season

In Planning software, service level targets can be set at the item-location level, allowing differentiated policies to be encoded directly in the planning parameters rather than applied as manual overrides.

## Reviewing and updating targets

Service level targets are not set-and-forget. They should be reviewed in the S&OP cycle against actual performance: what service level did the organisation actually achieve, and does the target need to be adjusted — either up (because the business is ready to invest more in inventory) or down (because carrying costs are too high relative to the commercial benefit)?
