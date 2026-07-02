---
title: "What Is Exception Management"
description: "The discipline of reviewing only deviations from plan beyond acceptable bounds — and trusting that in-tolerance items do not need intervention."
chapter: "exception-management"
estimatedMinutes: 5
topicLayout: "prose-topic"
---

## The Scale Problem in Planning

A modern supply chain planning model can carry tens of thousands of active SKUs across dozens of locations. If a planner attempted to manually review every item every day, they would finish around the time the next planning run arrived. This is not a workflow problem — it is a mathematical impossibility. The planning discipline that resolves it is called exception management, or management by exception.

The core principle is simple: the planning system monitors everything, flags what falls outside acceptable bounds, and presents only those deviations to the planner. Items within tolerance are assumed to be proceeding as planned. The planner's job is not to confirm that 95% of the plan is fine — it is to decide on the 5% that genuinely needs human judgment.

## What Exception Management Actually Means

Exception management is a discipline, not a feature. The feature is the exception queue in the planning system. The discipline is the commitment — by planners, team leads, and the planning manager — to trust that in-tolerance items can be left alone. An organisation that runs an exception queue but still manually checks items that did not appear in it has not adopted exception-based working. It has added a layer of work without removing any.

At its heart, management by exception is a form of delegation to the system. The planner defines the rules (thresholds, priorities, owner assignments), the system applies them continuously across the entire item base, and the planner acts on the output. This is only sustainable if the planner trusts the rules they have set.

## The Concept vs the Implementation

It is worth separating the concept from its implementation in software.

The concept — management by exception — predates planning software by decades. It appears in management theory as the practice of directing leadership attention only to situations that deviate significantly from expectations. In supply chain planning, it became the dominant operating model as plan sizes grew beyond human-reviewable scale.

The implementation is an exception queue: a prioritised list in the planning application that surfaces items breaching defined thresholds. Most enterprise planning tools support configurable exception types, tolerance bands, and owner routing. The queue is typically reviewed at the start of each planning session and worked through before any other activity.

## The Planner's Role in an Exception-Based Model

In an exception-based model, the planner's role shifts from reviewer to decision-maker. The system does the reviewing. The planner does the deciding.

This shift has implications for what skills matter. A planner who is good at exception-based working learns to read an exception quickly — to distinguish a data error from a real operational problem, to know which exceptions can be resolved autonomously and which need escalation, and to resist the instinct to investigate items that look slightly unusual but have not actually breached a threshold.

It also has implications for how performance is measured. A planner who resolves fifty exceptions a day with good decisions is outperforming a planner who reviews five hundred items and makes the same decisions. Volume of review is not a proxy for quality of decision.

## Why This Chapter Exists

Exception management is not limited to S&OE — it runs across the full planning cycle. Demand exceptions surface in demand review. Supply exceptions appear in supply and S&OE reviews. Escalated exceptions reach the S&OP executive meeting. Understanding exception management as a cross-cycle capability is more useful than treating it as a feature of any single planning step.

The following topics cover exception types in detail, the resolution workflow, and how to calibrate thresholds so the exception queue stays actionable over time.
