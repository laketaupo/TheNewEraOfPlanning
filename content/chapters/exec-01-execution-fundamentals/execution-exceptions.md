---
title: "Managing Execution Exceptions"
description: "Execution rarely runs exactly to plan. Real-time exceptions — machine breakdowns, missing stock, transport failures — require fast, structured responses to protect service level."
chapter: "exec-01-execution-fundamentals"
estimatedMinutes: 5
topicLayout: "prose-topic"
---

## Why execution exceptions are different

Execution exceptions are different from planning exceptions. In S&OE, a planner has time to analyse an exception, model options, and make a considered decision. In execution, the timeline is compressed: a machine breakdown at 7am must be dealt with before the production run was supposed to finish. The response must be fast, and it must be pre-authorised — there is rarely time to escalate through a planning cycle.

## Common execution exceptions

**Order priority conflict**
Two customer orders compete for the same available stock. Which ships first? The answer should come from the allocation policy set in S&OP and S&OE — but if the policy does not cover the specific situation, someone in execution must decide.

**Inbound receipt shortfall**
A supplier delivery arrives short: 800 units instead of 1,000. Execution must immediately determine which orders can still be fulfilled and which need to be rescheduled or partially fulfilled.

**Quality hold**
A batch of finished goods or raw materials is quarantined pending quality inspection. Available inventory drops suddenly. Execution must replan fulfillment for orders that depended on the quarantined stock.

**Equipment breakdown**
A production line or warehouse piece of equipment fails. The current shift's output plan must be revised, and the operations team must decide whether to run overtime, transfer work to another line, or accept a shortfall.

**Transport failure**
A carrier cancels or delays a collection. Orders scheduled for dispatch today must be rerouted to an alternative carrier or rescheduled.

## Decision authority in execution

A key principle of effective execution is that decision authority must be pre-delegated. Execution teams should have clear rules for the most common exception scenarios — so that a team leader or warehouse supervisor can make the right call without escalating to a planner or manager.

Decision rules should be documented and maintained as part of the operating model. They cover: which customers get priority when stock is short, how many units below plan triggers an escalation, what constitutes a quality hold versus a minor non-conformance.

## Escalating from execution to S&OE

When an execution exception is too large for the pre-delegated decision rules to handle — a significant stock-out, a multi-day production outage, a major transport disruption — it should be escalated to the S&OE planner on duty immediately. The planner can activate the planning tools to assess the impact and determine the appropriate response across the near-term horizon.
