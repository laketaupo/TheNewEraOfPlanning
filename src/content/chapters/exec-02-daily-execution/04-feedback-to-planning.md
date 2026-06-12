---
title: "Feeding Actuals Back to Planning"
description: "Execution generates the actuals that planning runs on. Without a clean feedback loop, the planning model drifts from reality and decisions are made on stale information."
order: 4
chapter: "exec-02-daily-execution"
estimatedMinutes: 4
topicLayout: "prose-topic"
---

## The feedback loop is not optional

The planning cycle — S&OP → S&OE → execution — is only as good as the actuals that flow back upstream. If execution transactions are not accurately recorded, or if the data integration between ERP and planning software is delayed, the planning model works with yesterday's reality. Decisions made on stale data produce plans that are wrong from the moment they are published.

## What execution feeds back to planning

**Shipment actuals**
Each confirmed despatch updates the demand consumption record in the planning system. The demand plan is depleted by actual shipments — this is how the system knows how much of the monthly plan has already been fulfilled versus how much remains.

**Production actuals**
Confirmed production orders update the inventory position: what has been made, what is in process, and what yield was achieved. A yield lower than planned means available supply is less than the system predicted.

**Goods receipt actuals**
Inbound receipts from suppliers update the available stock position and — where received later than planned — trigger supply delay exceptions in S&OE.

**Inventory adjustments**
Cycle counts, write-offs, quality destructions, and inter-location transfers all affect the physical inventory position. Each should be recorded immediately in the ERP and flow to the planning model.

## The integration time lag

Even with good discipline in execution, there is always some lag between a physical event and its appearance in the planning model — data integration runs on a schedule, batch processes have a cycle time, and some manual entry will always take minutes or hours.

Planners need to understand the lag in their system: if the planning model only refreshes once per day, decisions made at 2pm are based on a snapshot from 7am. This is manageable — but it must be known and accounted for in how planners interpret real-time exceptions.

## Continuous improvement through feedback

Beyond the immediate planning cycle, execution actuals are the raw material for continuous improvement. Systematic analysis of why the plan was not met — reasons codes from deviation events, supplier performance trends, production yield variability — feeds back into better planning parameters, more accurate forecasts, and more realistic supply plans.

## The full cycle

You have now seen the complete operating model: S&OP sets the monthly plan, S&OE manages the weekly reality, and execution delivers the daily actions — feeding actuals back upstream to keep the cycle honest.

One capability runs across all three horizons: scenario planning. When demand is uncertain, when supply is disrupted, or when leadership needs to stress-test a strategy before committing, scenario planning is the tool that explores the options. The Scenario Planning module shows how to build, run, and communicate what-if analyses inside the planning model.
