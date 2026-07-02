---
title: "Recording Discipline by Transaction Type"
description: "The four main execution transaction types, what correct recording looks like for each, and the cost of recording them late or inaccurately."
chapter: "exec-actuals-capture"
estimatedMinutes: 5
topicLayout: "prose-topic"
---

## Why Transaction Type Matters

Not all execution events are recorded in the same way, by the same people, at the same point in the process. A goods receipt happens at the warehouse dock; a production completion happens on the factory floor; a shipment confirmation happens in the WMS when a truck leaves; an inventory adjustment happens wherever a discrepancy is identified. Each transaction type has its own recording moment, its own owner, and its own consequence if delayed or approximated.

Understanding the discipline expected for each transaction type is the starting point for building reliable actuals capture.

## Goods Received

A purchase order delivery becomes an actuals transaction at the dock. When a supplier truck arrives and the delivery is physically accepted, the warehouse operative posts a goods receipt in ERP: the purchase order is matched to the delivery, the received quantity is confirmed, and quality status is set (unrestricted, quality hold, or rejected). The available stock position updates as soon as the goods receipt is posted.

Correct recording means posting at the dock, with the actual received quantity — not the ordered quantity, not an estimate, not the paperwork quantity if the physical count differs. If the delivery is short, the goods receipt records the short quantity. If a portion is held for quality inspection, the quarantined quantity is recorded separately. Splitting the transaction to reflect reality takes a few extra minutes. Posting the ordered quantity and reconciling later means the system shows availability that does not exist.

The cost of delayed goods receipt posting: the planning system does not see the inbound stock as available, which may trigger unnecessary escalations, prevent allocation of stock that has physically arrived, and cause the S&OE team to over-plan for a supply gap that has already been filled.

## Production Completed

When a production batch or manufacturing order completes, the output quantity — including any yield variance — must be confirmed in ERP or MES. The production order is closed or partially confirmed, actual output is recorded, and any co-products, by-products, or waste are booked accordingly.

Correct recording means confirming at batch completion, with actual yield. If a batch produces 480 units against a planned 500, the confirmation records 480. The 20-unit shortfall is a variance that the system needs to reflect in the available stock position and, if material, trigger an exception for the planning team.

The cost of deferred production confirmation: the system shows planned output as pending rather than available or short. Planners cannot allocate stock that has been produced but not confirmed. In high-frequency operations, this creates a chronic lag between production reality and planning system view that forces planners to work informally, bypassing the system, which introduces further data quality risk.

## Shipment Dispatched

When a customer order leaves the warehouse — loaded on a truck, handed to a carrier, or despatched via own fleet — the despatch confirmation is posted in the WMS and the delivery note or shipping document is closed in ERP. The outbound order status updates from allocated to shipped, and the delivery is flagged for carrier tracking.

Correct recording means confirming at handover: when the truck leaves the dock, not when the driver checks in from the road. The confirmation should include actual shipped quantity (which may differ from the order quantity if a short shipment was made), carrier reference, and scheduled delivery date.

The cost of delayed despatch confirmation: customer order status shows as pending in systems that customers can query, creating service calls for orders that have already shipped. S&OE exception queues show open deliveries that are already in transit, generating false alerts.

## Inventory Adjusted

Inventory adjustments — cycle count corrections, write-offs for damaged or expired stock, inter-location transfers — must be posted at the point the physical action is taken. If a cycle count identifies a discrepancy, the adjustment is posted when the count is completed and verified, not batched at month-end. If stock is damaged and written off, the write-off is posted when the decision is made, not when the next audit cycle runs.

Correct recording means immediate posting with a reason code. The reason code is not optional: it is the data that allows the business to analyse patterns, identify root causes, and determine whether a discrepancy is a one-off or a recurring issue that requires process change. A write-off posted without a reason code is an event the business cannot learn from.

The cost of deferred adjustments: the system overstates or understates available stock for however long the adjustment is pending. Planners allocate against stock that does not exist, or fail to allocate against stock they do not know is there.
