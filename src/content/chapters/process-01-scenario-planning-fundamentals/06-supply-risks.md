---
title: "Scenarios for Supply Risks"
description: "Supply-side disruptions — supplier failures, capacity shortfalls, logistics delays — require specific scenario types that model constrained supply and test your planning resilience."
order: 6
chapter: "process-01-scenario-planning-fundamentals"
estimatedMinutes: 4
topicLayout: "prose-topic"
---

## Why supply risk needs its own scenario lens

Demand uncertainty asks "what if customers want more or less?" Supply risk asks a different question: "what if we can't deliver even if demand stays the same?" The two scenarios need different inputs, different levers, and different responses.

Supply risk scenarios are most valuable when uncertainty is structural — a supplier is in financial difficulty, a production site is approaching maintenance, a key raw material has limited global availability — rather than temporary noise.

## Common supply risk scenario types

**Supplier unavailability** models what happens if a supplier delivers at a reduced percentage of their contracted volume, or fails entirely. The key outputs are: which finished goods become constrained, how far into the future the shortage projects, and whether alternative sourcing can cover the gap.

**Capacity constraints** model a production resource running at reduced throughput — because of maintenance, labour shortages, or equipment issues. The scenario reveals which products compete for the constrained resource and what sequencing decisions need to be made.

**Lead time extensions** model suppliers or transport legs taking longer than normal. Because Planning software plans using Bill of Distribution lead times, extending a leg shifts all downstream due dates and can surface capacity bottlenecks that were previously hidden.

**Multi-node disruptions** model the compounding effect of simultaneous failures — a supplier shortage combined with a logistics delay, for example. These are harder to anticipate but the scenarios that most often reveal systemic fragility.

## Setting up a supply risk scenario in Planning software

A supply risk scenario typically starts by modifying one or more of:
- **Supplier capacity parameters** — capping available supply from a specific node
- **Lead time parameters** — extending transport or production lead times
- **Opening inventory** — reducing starting stock to model a delayed shipment

After running the scenario, the planner reviews exception flags: which items move into shortage, which customer orders are at risk, and what the total demand-at-risk volume is. This output feeds the escalation and prioritisation process.

## What to do with the results

A well-run supply risk scenario should produce a concrete decision: accept the risk, activate a contingency (alternative supplier, expedite, demand reallocation), or escalate to leadership. The scenario is only useful if it connects to a response. Scenarios that sit in a spreadsheet and never drive action are planning theatre.
