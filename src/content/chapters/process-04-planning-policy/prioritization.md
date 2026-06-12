---
title: "Prioritization Frameworks"
description: "Prioritization determines which orders, products, and customers are served first when resources are constrained. A clear framework prevents conflict and ensures the planning system reflects actual business strategy."
chapter: "process-04-planning-policy"
estimatedMinutes: 4
topicLayout: "prose-topic"
---

## What prioritization is

Prioritization is the set of rules that determines which demand gets served first when supply or capacity cannot cover everything. It answers the question every constrained supply chain faces: "If we can't do everything, what do we do first?"

Prioritization operates at multiple levels in the planning model:
- **Customer-level** — which customers receive supply before others
- **Product-level** — which SKUs or product families are prioritised for production
- **Order-level** — within a customer's order portfolio, which lines are most urgent
- **Geography/channel** — which markets or routes to market receive supply first

## Prioritization criteria

Common criteria for prioritization include:

**Commercial value** — margin per unit, strategic account status, or total revenue contribution. High-value customers and products are prioritised.

**Contractual obligation** — orders with binding contracts or penalties for non-delivery take priority over discretionary orders.

**Demand timing** — orders with earlier delivery commitments are prioritised over future orders when supply is limited.

**Downstream criticality** — in supply chains where products are intermediate inputs (seed going to a grower who has a committed planting window), the downstream consequence of a miss amplifies the commercial risk and increases the priority.

**Recovery cost** — some shortages are recoverable (a customer can wait a week), others are not (a grower cannot delay planting). Irrecoverable situations carry higher priority.

## Connecting prioritization to the planning system

Prioritization policy needs to be encoded in the planning system — not left as a manual override. If prioritization is only applied after the plan is published (by a sales manager changing an order priority in the ERP), then the planning system is generating plans that don't reflect business reality, and the value of the planning model is degraded.

In Planning software, demand signals can carry priority attributes that the planning engine uses to sequence fulfilment. Setting these attributes correctly — and keeping them current — is a joint responsibility between the commercial team (who knows the priority) and the planning team (who maintains the system).

## Prioritization is a governance decision

Because prioritization decisions have commercial consequences — choosing not to serve one customer in order to serve another — they cannot be made by planners alone. The prioritization framework needs to be agreed in S&OP and signed off by commercial and operations leadership. Individual exceptions may then be delegated to the S&OE process, but the framework itself is an executive-level decision.
