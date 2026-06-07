---
title: "How Data Quality Shows Up in Plans"
description: "Data problems have recognisable signatures in planning outputs. Learning to read the plan as a diagnostic tool helps you surface data issues before they become operational problems."
order: 3
chapter: "data-02-data-quality-and-impact"
estimatedMinutes: 4
topicLayout: "prose-topic"
---

## The plan as a diagnostic instrument

When a plan looks wrong — unexpectedly high orders, implausible inventory levels, contradictory recommendations — the cause is almost always one of three things: a wrong assumption in the logic, a changed business condition, or bad data. Learning to distinguish them is one of the most valuable planning skills.

## Diagnostic signatures

**Spike-then-zero patterns**
A planned order that is very large in one period, then zero for several periods. Often caused by a one-time demand spike in historical data being treated as recurring, or a demand override applied to the wrong bucket.

**Persistently high safety stock**
Safety stock that never gets consumed, suggesting either very accurate supply, very low demand variability, or — more likely — a variability setting that hasn't been recalibrated since implementation.

**Inventory oscillation**
Stock levels that swing dramatically between periods: overstock, then understock, then overstock again. Often caused by lead times that don't match reality, causing the engine to over-order in anticipation and then cancel when the goods arrive early.

**Unexplained transfer recommendations**
Transfers between locations for items that appear to have adequate stock on both ends. Often caused by demand being allocated to the wrong location, or inventory not being visible at the source location due to a system booking delay.

## From signature to root cause

When you see one of these patterns, the question to ask is: what data would produce this output? Work backwards from the plan to the input. Check the demand signal, the inventory record, the BOM, the lead time. The engine is telling you where the inconsistency is — you just need to learn to read it.
