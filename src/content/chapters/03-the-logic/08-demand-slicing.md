---
title: "Demand slicing"
description: "How splitting demand into equal micro-buckets creates a fair, rotation-based inventory allocation when supply is constrained."
order: 8
chapter: "03-the-logic"
estimatedMinutes: 5
topicLayout: "full-widget"
widget: "demand-slicing"
---

## Why demand slicing exists

When inventory is short, the engine must decide who gets what. Without slicing, a strict country priority would fully satisfy the first country before the second country receives anything. Demand slicing solves this by splitting each country's demand into N equal buckets and allocating them in a rotating sequence — so every country receives a proportional share of whatever stock is available.

## How the rotation works

Each country's demand is divided into N equal slices. The engine then works through the sequence one slice at a time, cycling through all countries before returning to the first:

> A₁ → B₁ → C₁ → A₂ → B₂ → C₂ → A₃ → …

If inventory runs out mid-sequence, allocation stops at that exact point. Every country that was reached in the rotation receives something; no single country can monopolise the available stock.

## The key insight

A higher slicing factor does not change the *total* inventory allocated — it changes the *granularity* of fairness. With N = 1, the first country in the sequence can receive 100% of its demand before anyone else gets anything. With N = 10, the worst-case difference between any two countries shrinks to at most one slice worth of inventory — a fraction of total demand.

The simulator above lets you explore this directly. Set the slider to 1 and watch how Country A gets served first. Increase it toward 10 and observe how the imbalance narrows with each additional slice.
