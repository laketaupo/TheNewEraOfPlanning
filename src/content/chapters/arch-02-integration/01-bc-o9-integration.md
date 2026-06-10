---
title: "BC ↔ o9 Integration"
description: "Business Central and o9 exchange transactional data in both directions. BC sends actuals; o9 sends planned orders. Understanding the flow prevents discrepancies between what is planned and what is being executed."
order: 1
chapter: "arch-02-integration"
estimatedMinutes: 4
topicLayout: "prose-topic"
---

## The two directions

The BC ↔ o9 integration is bidirectional but asymmetric:

**BC → o9** carries actuals: what has already happened or is currently in progress in the ERP.
**o9 → BC** carries proposals: what the planning engine recommends should happen.

## BC → o9: what flows

The following data flows from BC to o9 on a daily basis (typically as part of the overnight batch):

- **Inventory positions** — on-hand stock by item and location. These replace o9's projected inventory with confirmed actual quantities, grounding the planning model in reality.
- **Goods receipts** — confirmed deliveries from suppliers, which consume open purchase order lines in o9.
- **Production order completions** — finished production quantities posted in BC, which update the supply-side of the planning model.
- **Open purchase orders** — current open orders with their expected delivery dates, giving o9 visibility of committed incoming supply.
- **Open production orders** — in-progress production jobs with their target completion dates.

## o9 → BC: what flows

o9 generates planned orders — recommendations for what should be ordered or produced. These flow to BC as:

- **Purchase order proposals** — recommendations to place orders with specific suppliers for specific quantities and dates
- **Production order proposals** — recommendations to produce specific items at specific facilities and dates

The flow from o9 to BC is not automatic. Planners review planned orders in o9, decide which to release, and trigger the creation of actual orders in BC. This review step is a governance control point — not all planned orders should be released without human review.

## Common integration issues

**Inventory discrepancy** — o9 shows a different stock level than BC. Usually caused by a batch import failure or a timing gap (BC updated after o9's last import). Resolve by checking the last import timestamp and triggering a manual refresh if needed.

**Ghost orders** — an order exists in o9 but not in BC (or vice versa). Usually caused by an order being created or cancelled in one system without the other being updated. Requires manual reconciliation.

**Duplicate planned orders** — o9 generates a planned order, it is released to BC, but o9 then generates it again because the BC confirmation has not yet fed back. Usually a timing issue in the integration cycle.
