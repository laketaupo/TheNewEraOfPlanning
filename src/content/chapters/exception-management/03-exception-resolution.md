---
title: "Exception Resolution"
description: "The workflow for investigating and resolving exceptions — from queue triage to root cause to escalation decision."
chapter: "exception-management"
estimatedMinutes: 5
topicLayout: "prose-topic"
---

## The Resolution Workflow

An exception in the queue is a question, not an answer. It tells the planner that something has deviated from plan beyond an acceptable threshold. What to do about it depends on why the deviation occurred. The resolution workflow has four stages: surface, investigate, act, and close.

## Stage 1: Surface and Prioritise

The planning session begins with the exception queue, sorted by priority. Most systems present a count by type and severity — a planner can see at a glance that there are, say, three stock-out risks, seven supply delays, and two capacity constraints before they have read a single item.

The planner works through the highest-priority exceptions first. In a well-calibrated system, high-priority exceptions are genuinely urgent. A planner who has learned to trust the queue can move quickly because they are not second-guessing whether unlisted items also need attention.

## Stage 2: Investigate Root Cause

Before acting on an exception, the planner identifies what caused it. Three root causes cover most cases:

**Data error.** The exception exists because a planning parameter is wrong — a safety stock level that has not been updated, a lead time that does not reflect actual supplier performance, or a demand history contaminated by an outlier event. Data errors produce persistent exceptions that resolution actions will not fix; the parameter must be corrected.

**Genuine operational deviation.** A real event has occurred that the plan did not anticipate — a supplier delay, a demand spike, a quality hold. The plan was correct at time of setting; conditions have changed. This is the core case the exception system is designed to surface.

**Structural problem.** The exception reflects a persistent gap between supply capability and demand — a capacity constraint that cannot be resolved within the current planning cycle, or a product range that systematically generates excess. Structural problems cannot be resolved at the planner level and require S&OP or strategic input.

Distinguishing these three causes is the skill that separates experienced planners from inexperienced ones. It requires reading the planning system's context — trend data, the planning run log, notes from the previous session — not just the exception itself.

## Stage 3: Resolution Actions

Once the root cause is identified, the planner selects from the available resolution actions:

**Expedite.** Move an inbound order forward — request earlier delivery from the supplier or advance the production date. Appropriate for supply delays where the relationship and flexibility exist.

**Reallocate stock.** Redirect available inventory from a lower-priority demand destination to address a stock-out risk. Requires clear allocation rules and, often, commercial awareness of which customers take precedence.

**Adjust the production schedule.** Change the planned production sequence or quantity for an upcoming run. Appropriate for capacity constraint exceptions where the plan needs to be re-sequenced.

**Override the plan with a documented reason.** The planning system's calculation is overridden by a planner judgment. This is a legitimate tool — it is how human knowledge about unusual circumstances enters the plan. It must be documented so future runs do not re-raise the exception and so the decision is visible to team leads.

**Escalate.** Pass the exception to a higher decision-making forum — the S&OE review, the supply review, or, for structural issues, the S&OP cycle. Escalation is not a failure; it is the correct response when the decision exceeds the planner's authority or requires cross-functional input.

## Stage 4: Close

After resolution, the exception is closed — either by the system (the re-run no longer generates it) or by the planner (manually acknowledged with a note). Exceptions should not sit open indefinitely. An exception that cannot be closed is usually either a data error that has not been fixed or a structural problem that has not been escalated.

## Decision Authority

The resolution workflow depends on clear decision authority. Planners need to know what they can resolve independently and what requires sign-off or escalation. A common structure:

- Planners own: data correction, expediting within pre-approved supplier terms, minor schedule adjustments within confirmed capacity.
- S&OE review owns: cross-functional allocation decisions, short-term exceptions with service implications, decisions that affect confirmed orders.
- S&OP owns: structural supply/demand imbalances, decisions that require capacity investment or significant demand-shaping.

Without explicit authority guidance, planners either escalate too much (creating bottlenecks in the review forum) or too little (making decisions outside their remit). Documenting the authority matrix is a planning governance task — it belongs with the operating model, not inside the planning tool.
