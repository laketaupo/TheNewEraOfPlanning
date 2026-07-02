---
title: "Prioritisation Criteria"
description: "The standard criteria used to rank orders when supply is constrained, and how those criteria stack when two high-priority orders compete."
chapter: "exec-order-prioritisation"
estimatedMinutes: 5
topicLayout: "prose-topic"
---

## The Building Blocks of a Prioritisation Policy

No two organisations prioritise exactly the same way, but most mature supply chains use a consistent set of criteria as the building blocks of their allocation policy. Understanding each criterion — what it measures, when it applies, and what it signals — is the foundation for configuring a defensible and practical prioritisation system.

## Customer Tier

The most common primary criterion is customer tier: a pre-agreed classification of customers by strategic and commercial importance. Tier 1 typically includes key accounts and strategic partners — customers with long-term contracts, high volumes, or significant strategic value. Tier 2 covers established accounts with standard terms. Tier 3 covers smaller or transactional accounts.

Tiering is defined by commercial and supply chain leadership jointly, not by operations. It should be documented, reviewed periodically, and reflected in planning system configuration. When supply is short, Tier 1 customers are served before Tier 2, and Tier 2 before Tier 3. This is not a judgment call made at execution time — it is a policy applied by the system.

## Contractual Obligations and Penalty Clauses

Some customers carry contractual delivery terms with financial penalty clauses for non-performance. These create a clear, auditable reason to prioritise ahead of tier in specific situations. If a customer has an on-time delivery clause with a 5% penalty per late shipment, that obligation is a hard constraint, not a preference. The planning system should record contractual delivery windows and flag orders approaching their SLA deadline so allocation logic can account for them.

## Product Criticality

Certain products carry an inherent priority regardless of customer tier. Life-critical products — medical supplies, food ingredients with short remaining shelf life, regulatory compliance items — may be subject to priority rules that override commercial criteria entirely. Similarly, products with no available substitute (single-source materials, proprietary formulations) carry higher consequences for non-delivery and may be treated as automatic Tier 1 regardless of the ordering customer.

Product criticality should be encoded in item master data, not applied at the point of exception. If a product is life-critical, that attribute should drive its allocation behaviour systematically.

## Order Age (FIFO)

When two orders share the same tier, same product criticality, and no distinguishing contractual terms, age of order is the default tiebreaker: first in, first out. FIFO is administratively clean, commercially defensible, and easy to explain to customers. It also prevents a recurring failure mode where newer, larger, or more vocal orders systematically displace older, smaller ones, causing indefinite deferral for certain accounts.

## Margin Weighting

Some organisations incorporate margin or profitability weighting into their prioritisation criteria, particularly where product margins vary significantly across the portfolio. When supply is constrained across products with different margin profiles, the policy may specify that higher-margin products are maintained at target availability levels before lower-margin items.

Margin weighting introduces complexity and should be applied selectively. It is most appropriate at the product or category level, not the order level — and should be agreed with commercial and finance before being encoded in policy.

## When Two High-Priority Orders Compete

The toughest scenario is two orders that score equally across all criteria: same customer tier, same product, same contractual terms, ordered the same day. In these cases, the policy must define a deterministic final rule — most commonly FIFO on order entry time, or proportional allocation where available supply is split pro-rata across qualifying orders rather than given fully to one.

The key principle is that the resolution rule must be pre-defined and documented. An execution planner should never face a genuine tie with no policy guidance — that is a policy gap, not an execution problem.
