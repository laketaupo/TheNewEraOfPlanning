---
title: "What to Monitor"
description: "The demand signals an S&OE planner watches each week and why each one matters."
chapter: "soe-demand-monitoring"
estimatedMinutes: 5
topicLayout: "prose-topic"
---

## The S&OE planner's demand picture

Demand monitoring in S&OE is not about forecasting the future — that belongs to S&OP. It is about tracking what is actually happening against the plan that was agreed last month, and catching deviations early enough to do something about them. The S&OE planner does this by watching a set of near-term demand signals every week.

## Actual orders vs. plan by SKU and location

The primary signal is the comparison of confirmed customer orders against the demand plan at the SKU and location level. At the aggregate family level, noise often cancels out. At the SKU level, it does not. A product that is running 30% above plan for three consecutive weeks is not noise — it is a signal that the plan is wrong and supply needs to respond.

The S&OE planner reviews this comparison weekly, not to revise the forecast (that happens in S&OP), but to assess whether current supply commitments can still be met, and whether exceptions need to be raised now.

## Near-term forecast deviation

Most planning systems maintain a rolling short-horizon forecast — typically a 4-to-8-week view updated from actual order intake. Where the near-term forecast has shifted materially since the last S&OE cycle, the planner flags this as a deviation. A positive deviation (demand higher than planned) creates a supply risk. A negative deviation (demand lower than planned) may signal inventory build-up or the need to defer production.

## Demand spikes and dips

Sudden one-week spikes and dips are tracked separately from trend deviations. A spike may represent a large customer order, a promotion pulling forward demand, or a data entry error. A dip may indicate a customer delivery delay, order cancellation, or an inventory correction at the customer's end. The planner's job is to determine the cause before taking action — responding to a data error as if it were a real demand shift causes unnecessary disruption.

## Customer order confirmation rate

For make-to-order environments, the share of expected customer orders that have been formally confirmed by a given point in the horizon is an early-warning signal. Low confirmation rates in the near term may mean demand will fall short of plan, or that orders will arrive later than committed — both of which affect production scheduling.

## Order-to-delivery lead time vs. commitment

The S&OE planner also tracks whether confirmed orders can actually be delivered within the lead time the customer was promised. When supply constraints are tightening, committed delivery dates can become at risk even before a formal exception is raised. Monitoring the gap between the agreed lead time and the current available-to-promise date is an early indicator of service failure risk.

## Why these signals are monitored together

No single signal tells the whole story. An above-plan order intake combined with a confirmed lead time slipping is a service risk. The same above-plan order intake with ample available stock may be absorbed without any action. The S&OE planner reads these signals as a set, not in isolation, to form a view of whether the near-term plan remains executable or needs a response.
