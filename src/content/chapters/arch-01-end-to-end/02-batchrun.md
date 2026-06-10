---
title: "Batch Runs"
description: "Batch runs are the scheduled jobs that keep the planning model current — refreshing transactional data, triggering planning engine recalculations, and synchronising master data."
order: 2
chapter: "arch-01-end-to-end"
estimatedMinutes: 4
topicLayout: "prose-topic"
---

## What a batch run is

A batch run is a scheduled, automated job that executes a defined set of operations on a recurring basis — typically overnight or at defined intervals during the day. In the planning context, batch runs do the work that would otherwise require manual intervention: pulling fresh data from source systems, running the planning engine, and surfacing updated exceptions for planners to review.

Batch runs are what make the daily planning cycle sustainable. Without them, planners would need to manually trigger data refreshes and planning runs — a time-consuming and error-prone process.

## The overnight planning cycle

A standard overnight batch cycle for the Planning software planning environment runs in sequence:

1. **Master data sync** — updated item master, BOMs, and BODs are pulled from MDM system into Planning software. Any new items, changed parameters, or updated lead times are applied.

2. **Transactional data import** — actual inventory positions, goods receipts, and production order completions from ERP are imported into Planning software. Open purchase orders and production orders are updated to reflect current status.

3. **Field signal refresh** — updated crop forecasts and grower contract data from FMS are loaded into Planning software as updated supply signals.

4. **Planning engine run** — Planning software recalculates the supply plan across the full network, incorporating the updated master data and transactional actuals. New planned orders are generated, existing orders are rescheduled where needed, and exception flags are updated.

5. **Exception report generation** — the updated exception list is made available to planners for the morning S&OE review.

## Monitoring batch run health

A failed batch run silently breaks the planning process. If the overnight transactional import fails, planners are working with yesterday's inventory positions — their exceptions may be stale and their planned orders wrong. Every batch run should produce a success/failure log that is reviewed at the start of the planning day.

Key indicators of batch run health:
- **Last successful run timestamp** — when did the batch last complete without errors?
- **Record count** — how many records were processed? A run that completes but processes zero records may indicate a connectivity issue.
- **Error log** — any records that failed to import should be flagged for investigation

## Common batch run issues

**Data format errors** — a change to the source system's data structure (e.g., a new field in MDM system) can break the interface mapping. The batch run fails on the records that don't conform to the expected schema.

**Timeout errors** — large data volumes combined with network latency can cause batch jobs to exceed their timeout window. This is common when a source system is upgraded or when a month-end close increases transaction volumes.

**Dependency failures** — if the master data sync fails, the planning run may run on stale master data. Batch jobs should be sequenced with dependency checks: only run the planning engine if the data import completed successfully.
