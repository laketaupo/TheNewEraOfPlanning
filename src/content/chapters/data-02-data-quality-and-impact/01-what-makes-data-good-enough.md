---
title: "What Makes Data \"Good Enough\"?"
description: "Data quality isn't binary. Four dimensions — completeness, accuracy, timeliness, and consistency — define whether data is fit for planning."
order: 1
chapter: "data-02-data-quality-and-impact"
estimatedMinutes: 4
topicLayout: "prose-topic"
---

## Four dimensions of data quality

Not all data problems look the same. A data quality framework gives you a shared language to diagnose issues and prioritise fixes.

**Completeness**
Is all the necessary data present? A planning run needs demand forecasts for every active item, inventory counts for every location, and BOM links for every finished good. Missing records — an item with no forecast, a location with no inventory — force the engine to plan blind or plan with defaults that may not reflect reality.

**Accuracy**
Is the data correct? An inventory count that is off by 30%, a lead time entered in weeks when the system expects days, a demand forecast that hasn't been updated in three months — these are accuracy problems. The system runs, the plan calculates, but the outputs are wrong.

**Timeliness**
Is the data current? Planning data has a shelf life. Yesterday's inventory snapshot may not reflect this morning's production run. A demand forecast from last quarter may not reflect the new promotion launching next month. Stale data produces plans that are already wrong by the time they're reviewed.

**Consistency**
Does data mean the same thing across systems? If the ERP reports a lead time in working days and the integration layer converts it to calendar days incorrectly, the plan will place orders too late. Consistency failures are often the hardest to spot because each system looks internally correct.

## "Good enough" is relative to decisions

Data doesn't need to be perfect — it needs to be good enough for the decisions being made. A rough annual S&OP review can tolerate more data uncertainty than a weekly tactical plan that drives purchase orders. Knowing which planning horizon you are supporting helps you prioritise which data quality dimensions matter most.
