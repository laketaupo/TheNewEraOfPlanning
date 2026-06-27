---
title: "Data Upload"
description: "Not all data flows through automated interfaces. Manual data uploads handle one-off corrections, new data sources, and situations where the automated interface is not yet available."
chapter: "arch-how-systems-connect"
estimatedMinutes: 3
topicLayout: "prose-topic"
---

## When manual uploads are needed

Automated interfaces handle the steady-state data flow. Manual uploads are needed for:
- **One-off corrections** — a single item's parameter needs updating immediately, outside the next overnight batch cycle
- **Historical data loads** — when setting up Planning software or adding a new product line, historical demand data may need to be loaded from a spreadsheet
- **New data sources** — when a new supplier or grower is onboarded before the automated interface is configured
- **Interface outages** — when an interface fails and data needs to be loaded manually to keep the planning cycle running

## Upload formats in Planning software

Planning software supports data uploads via:
- **Excel templates** — pre-formatted spreadsheets with defined column structures for each data type (demand signals, supply orders, inventory positions, planning parameters)
- **CSV import** — structured flat files that map to the Planning software data model
- **API upload** — for technical users, the Planning software API allows programmatic data upload for larger volumes

Each upload type has a defined schema. Uploading data in the wrong format or with missing required fields will fail with a validation error. Always use the latest template from the Planning software configuration rather than a copy from a previous upload.

## Upload governance

Manual uploads bypass the standard data quality controls in the automated interface. They require governance:

- **Who can upload** — data uploads should be restricted to trained users who understand the impact. An incorrect demand signal upload can corrupt the planning model immediately.
- **What is uploaded** — uploads should be documented: what data, what reason, what time period. This creates an audit trail for when discrepancies are investigated.
- **Review after upload** — after a manual upload, trigger a partial planning run (scoped to the affected items) and review the impact on planned orders and exceptions before the full overnight batch runs.

## Upload vs. interface correction

If a manual upload is being used regularly to compensate for a broken or missing automated interface, that is a system maintenance issue — not a normal data management task. Repeated manual uploads indicate that the underlying interface needs to be fixed or built. Track manual upload frequency; a trend of increasing uploads is a signal that the interface landscape needs attention.
