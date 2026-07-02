---
title: "Calibrating Exception Thresholds"
description: "Why exception thresholds require ongoing calibration — and how to tune them so the queue stays actionable without missing real problems."
chapter: "exception-management"
estimatedMinutes: 5
topicLayout: "prose-topic"
---

## The Calibration Problem

Exception thresholds determine what the planning system considers worth surfacing to a planner. Set them too tight, and the exception queue fills with noise — minor deviations that require no action. Set them too loose, and real problems are missed until they become crises. Neither extreme is acceptable, and neither is avoidable without deliberate calibration.

The goal is a queue that a planner can work through in a defined period — a common target is sixty minutes at the start of each planning session. If it routinely takes three hours, the thresholds are too tight. If planners finish in ten minutes and regularly discover problems that did not appear in the queue, the thresholds are too loose.

## Starting with Industry Defaults

Most planning systems ship with default exception thresholds based on common industry practice. These are reasonable starting points, not correct settings. A business with long-lead-time commodities, high demand volatility, or tight capacity constraints will need different thresholds than the defaults assume.

Initial thresholds should be set during the planning system configuration phase, ideally with reference to historical data: what percentage of items have deviated by more than X% in the past twelve months? If the answer is forty percent, a threshold of X% will produce an unworkable queue on a typical day. The threshold needs to be set where the historical breach rate produces a manageable daily volume.

## Observing Volume and Adjusting

Once the system is live, the right calibration approach is empirical: observe queue volume for four to six weeks, measure the ratio of actionable exceptions to noise, and adjust thresholds accordingly.

Actionable exceptions are those where the planner investigated and took a resolution action or escalated. Noise exceptions are those where the planner reviewed and confirmed no action was needed. If more than thirty to forty percent of exceptions are noise, the thresholds are too tight and should be loosened for the relevant exception types.

Threshold adjustments should be made by exception type, not globally. A stock-out risk exception might be well-calibrated while a forecast deviation exception is generating excessive noise. Blanket adjustments will fix one problem while breaking another.

## Quarterly Review

Exception thresholds are not a one-time setup. The business changes — new products are introduced, demand patterns shift, supplier lead times change, capacity expands or contracts. Thresholds that were well-calibrated twelve months ago may be wrong today.

A quarterly threshold review is a reasonable minimum for most businesses. The review should include: queue volume trends over the quarter, the actionable-to-noise ratio by exception type, any new exception types that should be added, and any types that are generating consistent noise and should be adjusted.

The quarterly review is also the right moment to assess whether the exception taxonomy itself is still appropriate. As planning maturity increases, organisations often add more granular exception types — distinguishing, for example, between a stock-out risk that will breach in three days and one that will breach in three weeks.

## The Cultural Dimension

Threshold calibration is a technical task, but it depends on a cultural commitment to exception-based working. If planners routinely review items that did not appear in the exception queue — because they feel uncomfortable leaving anything unreviewed — the calibration effort is undermined. The queue becomes a formality rather than the primary navigation tool.

This behaviour usually reflects one of two things: distrust of the planning model (the parameters are known to be wrong, so the planner does not trust the system to catch problems) or habit (the planner was trained to review everything and has not adapted to the new model). Both need to be addressed, but they require different responses.

Distrust is resolved by improving data quality and model accuracy until the planner has evidence that the system catches what it is supposed to catch. Habit is resolved by coaching, team lead reinforcement, and — in some cases — making the extra review visible to management so it can be challenged.

The objective is a team that treats the exception queue as a complete picture of what needs attention, not as one signal among many. That trust is built gradually and lost quickly, which is why threshold calibration and model accuracy are inseparable from exception management culture.
