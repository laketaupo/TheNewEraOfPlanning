---
title: "Disaggregation: Variety to Item"
description: "How a high-level variety forecast is broken down into individual item-level demand signals."
chapter: "planning-logic"
estimatedMinutes: 4
topicLayout: "full-widget"
widget: "variety-disagg"
---

## What disaggregation solves

Planners rarely forecast at the level of every individual item — there are too many. Instead they forecast at an aggregate **variety** level (the parent), and the engine breaks that single number down into the individual **items** (the children) underneath it.

## How the split is calculated

The driver is **historical sales share**. Each item carries a percentage based on how it has sold in the past relative to its siblings. The engine multiplies the variety forecast by each item's share:

> Item forecast = Variety forecast × (Item's historical share ÷ sum of all shares)

Because the shares always sum to 100%, the item-level numbers always add back up to the variety total — disaggregation never creates or loses demand, it only distributes it.

## The disaggregation key matters

The percentages are not fixed truths — they come from a chosen **disaggregation key**. The same variety forecast splits very differently depending on the key: the three examples each use a different historical sales mix, so the item-level forecast shifts even though the parent total never changes.

## Try it

The widget above shows the calculation end to end. Switch between the three disaggregation keys and watch the left-hand mix — and the disaggregated item forecast at the bottom — change shape. Whatever key you choose, the **1,000-piece variety forecast** is preserved: the item-level numbers always sum back to 1,000.
