---
title: "Common Data Problems in Planning"
description: "The same data problems appear in almost every supply chain planning implementation. Recognising them is the first step to fixing them."
chapter: "data-02-data-quality-and-impact"
estimatedMinutes: 5
topicLayout: "prose-topic"
---

## Master data problems

**Incomplete or outdated BOMs**
Bills of materials change when products are reformulated, repackaged, or re-sourced. If the BOM in Planning software isn't updated to reflect the current recipe, the engine plans the wrong components.

**Wrong lead times**
Lead times entered at implementation and never reviewed. A supplier that used to deliver in 4 weeks now delivers in 6. The plan places orders too late, stockouts occur, and no one knows why — until someone checks the master data.

**Duplicate or inactive items**
Items that were superseded, discontinued, or merged but not deactivated still appear in the model. Forecasts get split. Inventory is held against the wrong code.

## Transactional data problems

**Open order discrepancies**
Purchase orders confirmed as received in the ERP but not yet closed. The system counts them as on-hand stock or in-transit inventory, reducing planned orders that are actually needed.

**Forecast override drift**
Planners apply manual overrides to forecasts that later expire or get overwritten by new statistical runs. The override stays; the reason for it is lost. The plan reflects a decision no one remembers making.

**Inventory timing mismatches**
A large production run completed at 11pm is not booked until the next morning. The nightly planning run sees stock that doesn't exist yet. The morning run sees stock that is already committed.

## Integration problems

**Unit of measure mismatches**
A forecast in cases when the planning system expects eaches. A capacity in tonnes when planning uses pallets. The conversion factor is wrong or missing.

**Truncated identifiers**
Item codes or location identifiers get truncated or padded differently in different systems. The same SKU appears as two different items. Inventory and demand never match.
