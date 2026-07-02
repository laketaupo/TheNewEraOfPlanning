---
title: "Disaggregation: Year to Month"
description: "How an annual plan is distributed across months using seasonal profiles and planning rules."
chapter: "planning-logic"
estimatedMinutes: 4
topicLayout: "full-widget"
widget: "seasonal-disagg"
---

## From an annual number to a monthly plan

A yearly volume target is not a plan you can execute against — production, procurement and inventory all happen month by month. The engine spreads the annual total across the 12 months using a **seasonal profile**: a set of monthly indices describing the typical shape of demand through the year.

> Month forecast = Annual total × (Month's seasonal index ÷ sum of all 12 indices)

The indices sum back to the annual total, so no demand is created or lost — only its *timing* changes.

## Seasonality is local

The same product can have completely different seasonal shapes in different markets. For fresh produce, demand follows the **sowing and growing season** — which is mirrored between hemispheres. When the Northern hemisphere peaks in spring, the Southern hemisphere is heading into autumn, roughly six months out of phase.

## Try it

The widget above splits a fixed 1,000-unit annual total across the 12 months. Select different countries from the grid and watch the chart — and the peak month — update. Switch between a Northern and a Southern hemisphere country and the peak jumps to the opposite side of the year. This is why a single global annual forecast must be disaggregated *per market*, not with one shared profile.
