---
title: "Identifying Binding Constraints"
description: "How to distinguish a binding constraint from a non-binding one, and how planning software surfaces constraint information during supply review."
chapter: "constraint-management"
estimatedMinutes: 5
topicLayout: "prose-topic"
---

## Binding vs Non-Binding Constraints

Not every limit in a supply chain is a constraint in the planning sense. A resource that is limited but still has unused capacity is not constraining current output — it is simply a limit that has not been reached. The distinction matters because constraint management effort should be focused on binding constraints: the limits that are actually preventing the supply chain from meeting demand right now.

A **binding constraint** is a resource or material where demand equals or exceeds available capacity or supply. It is the reason the supply plan cannot fulfil unconstrained demand. Improving the performance of anything else in the system without addressing the binding constraint does not increase throughput.

A **non-binding constraint** is a resource or material that is limited but currently operating below its maximum. Improving its performance may reduce cost or improve resilience, but it will not increase total output until the binding constraint is addressed.

In practice, the binding constraint shifts over time. A machine that is the bottleneck in Q1 may not be the bottleneck in Q2 if demand mix shifts toward products that use a different resource. Effective constraint management requires identifying the current binding constraint, not the permanent one.

## How Planning Software Surfaces Constraints

Enterprise planning tools provide several mechanisms for identifying constraints:

**Utilisation reports** show the percentage of available capacity consumed by the plan for each resource across the planning horizon. A resource running at or above 90% utilisation for an extended period is likely a binding constraint. Resources running well below capacity are candidates for rebalancing.

**Constraint exception alerts** are generated when the planning run cannot allocate all demand to a resource within its available capacity. These appear in the exception queue with the resource name, the period of infeasibility, and the quantity of unplanned demand. They are one of the most direct signals that a binding constraint exists.

**Supply plan infeasibility flags** indicate that the constrained supply plan cannot meet confirmed demand commitments within the defined horizon. These are higher severity than capacity exception alerts and typically require immediate escalation.

**Gantt-style scheduling views** (in more detailed production planning tools) show the sequence of production orders against resource availability. Gaps and overlaps in the schedule reveal where constraints are creating problems in execution.

## The Constraint Identification Workflow in S&OP

Constraints are formally surfaced during the supply review step of the S&OP cycle. The supply review asks: given the demand plan, what can the supply chain actually deliver?

The typical workflow is:

1. The planning team runs the constrained supply plan before the supply review meeting.
2. Utilisation reports and constraint exceptions are prepared as agenda inputs.
3. In the supply review, the team presents: which resources are binding constraints, in which periods, and by how much demand exceeds supply.
4. The options for addressing each constraint are tabled — typically using the three strategies covered in the following topic (exploit, subordinate, elevate).
5. Decisions are documented with owners and timelines.

Not all constraints surface cleanly in the first run. Some are hidden by upstream assumptions. If the demand plan includes volumes that the supply team knows cannot be produced, the constrained run may appear to balance on paper but will fail in execution. Good constraint identification depends on planners who know the physical reality of the operation as well as the model, and who raise discrepancies between the two.

## What to Do Before the Meeting

The most useful pre-work for a supply review is to read the constraint exception queue and the utilisation report side by side. This gives the planner a sense of: how many binding constraints exist, which are material (affecting significant volumes), and whether any are new since the last cycle.

New constraints are often the most important — they may indicate a change in demand mix, a reduction in resource availability, or a supplier problem that has propagated into the plan. Persistent constraints that were present in the last cycle are typically under active management; new constraints need fresh analysis.

Coming into the supply review with this preparation makes the meeting a decision session rather than a discovery session — which is what it should be.
