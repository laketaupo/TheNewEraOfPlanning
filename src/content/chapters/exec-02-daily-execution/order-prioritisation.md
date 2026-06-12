---
title: "Order Prioritisation"
description: "When supply is constrained, execution teams must decide which orders to fulfil first. Good prioritisation is governed by policy, not individual judgment."
chapter: "exec-02-daily-execution"
estimatedMinutes: 4
topicLayout: "prose-topic"
---

## Why prioritisation matters in execution

Execution rarely has the luxury of fulfilling every order in full, on time. Supply shortfalls, production delays, and transport capacity constraints create situations where execution teams must choose which orders to prioritise. Without a clear framework, these decisions are made ad-hoc — often based on whoever shouted loudest, rather than what is best for the business.

Good order prioritisation is governed by policy. The policy is set in S&OP and S&OE; execution applies it.

## Common prioritisation criteria

**Customer tier**
Most businesses have a tiered customer structure — key accounts, strategic partners, and standard customers. Key account orders typically have the highest priority due to contractual commitments, strategic relationship value, or revenue significance.

**Contractual obligations**
Some customer contracts include penalty clauses for late or short delivery. Orders with contractual delivery windows should be surfaced as high priority automatically by the planning or order management system.

**Product criticality**
Some products are more critical than others: life-critical items, regulatory-mandated products, or items for which there are no substitutes. Criticality should be captured in the item master and used as a weighting factor in prioritisation.

**Order age**
Older orders generally have higher priority than newer ones. FIFO (first in, first out) is the default rule for allocation when other factors are equal.

**Margin and revenue**
In businesses with highly variable margin by customer or product, the commercial team may apply margin weighting to prioritisation during periods of scarcity. This should be a defined policy, not a case-by-case commercial override.

## Allocation policy in planning software

Planning software supports prioritisation through allocation policy: rules that govern how constrained supply is distributed across orders. A well-configured allocation policy means execution receives pre-allocated orders — they do not have to apply judgment to each individual case. Exceptions surface when orders fall outside the policy rules and require human review.

## Escalating priority conflicts

When two orders of equal priority compete for the same constrained supply and the policy does not resolve the conflict, execution should escalate to the S&OE planner rather than making an ad-hoc commercial decision. These conflicts may have implications beyond the current day's shipping plan.
