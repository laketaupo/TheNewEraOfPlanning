---
title: "ERP ↔ Planning software Integration"
description: "ERP and Planning software exchange transactional data in both directions. ERP sends actuals; Planning software sends planned orders. Understanding the flow prevents discrepancies between what is planned and what is being executed."
chapter: "arch-02-integration"
estimatedMinutes: 4
topicLayout: "prose-topic"
---

## The two directions

The ERP ↔ Planning software integration is bidirectional but asymmetric:

**ERP → Planning software** carries actuals: what has already happened or is currently in progress in the ERP.
**Planning software → ERP** carries proposals: what the planning engine recommends should happen.

## ERP → Planning software: what flows

The following data flows from ERP to Planning software on a daily basis (typically as part of the overnight batch):

- **Inventory positions** — on-hand stock by item and location. These replace Planning software's projected inventory with confirmed actual quantities, grounding the planning model in reality.
- **Goods receipts** — confirmed deliveries from suppliers, which consume open purchase order lines in Planning software.
- **Production order completions** — finished production quantities posted in ERP, which update the supply-side of the planning model.
- **Open purchase orders** — current open orders with their expected delivery dates, giving Planning software visibility of committed incoming supply.
- **Open production orders** — in-progress production jobs with their target completion dates.

## Planning software → ERP: what flows

Planning software generates planned orders — recommendations for what should be ordered or produced. These flow to ERP as:

- **Purchase order proposals** — recommendations to place orders with specific suppliers for specific quantities and dates
- **Production order proposals** — recommendations to produce specific items at specific facilities and dates

The flow from Planning software to ERP is not automatic. Planners review planned orders in Planning software, decide which to release, and trigger the creation of actual orders in ERP. This review step is a governance control point — not all planned orders should be released without human review.

## Common integration issues

**Inventory discrepancy** — Planning software shows a different stock level than ERP. Usually caused by a batch import failure or a timing gap (ERP updated after Planning software's last import). Resolve by checking the last import timestamp and triggering a manual refresh if needed.

**Ghost orders** — an order exists in Planning software but not in ERP (or vice versa). Usually caused by an order being created or cancelled in one system without the other being updated. Requires manual reconciliation.

**Duplicate planned orders** — Planning software generates a planned order, it is released to ERP, but Planning software then generates it again because the ERP confirmation has not yet fed back. Usually a timing issue in the integration cycle.
