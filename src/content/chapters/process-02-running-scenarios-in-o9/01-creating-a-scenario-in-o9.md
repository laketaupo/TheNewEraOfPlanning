---
title: "Creating a Scenario in o9"
description: "A scenario in o9 starts as a copy of the baseline plan. This topic covers how to create one, name it, and scope it correctly before making any changes."
order: 1
chapter: "process-02-running-scenarios-in-o9"
estimatedMinutes: 4
topicLayout: "prose-topic"
---

## What happens when you create a scenario

In o9, creating a scenario copies the current baseline planning model into an isolated workspace. Changes you make inside the scenario do not affect the baseline — the two exist in parallel. You can have multiple scenarios active at the same time, all branching from the same baseline.

This isolation is what makes scenario planning safe: you can model aggressive assumptions without disrupting the plan the business is executing against.

## Before you create

Before opening the scenario creation interface, be clear on:

1. **What question this scenario is answering** — write it down
2. **What assumption you will change** — be specific about item, location, quantity, and time period
3. **What output you will look at** — which KPI or view tells you whether the scenario is better or worse than the baseline

Creating a scenario without these three things defined usually results in a scenario that gets built, never compared, and eventually deleted without a decision.

## Creating the scenario

Navigate to the Scenarios module in o9. Select **New Scenario** and provide:

- **Name**: Use the format `[Context] — [Assumption] — [Scope]`. Example: `Q3 Review — Supplier A 60% capacity — All products`
- **Description**: One or two sentences explaining the question this scenario addresses and who requested it
- **Base version**: Confirm you are branching from the current approved baseline, not an older version or another scenario

Once created, the scenario is available in your scenario list. It is an exact copy of the baseline at the moment of creation — no changes have been applied yet.

## Scope selection

Some scenario interfaces allow you to limit the scope of the scenario to a subset of items, locations, or time periods. Use scope limiting when:
- The disruption or demand change only affects part of the network
- You want to keep the scenario run fast and the comparison focused

Do not limit scope in ways that exclude downstream effects — if a component shortage affects a finished good, the finished good needs to be in scope too.
