---
title: "Execution: Translating Plans into Action"
description: "Execution is where the plan becomes reality — purchase orders, production runs, shipments. Understanding how plans flow into execution systems prevents the gap between what was planned and what was done."
order: 3
chapter: "process-03-operating-model"
estimatedMinutes: 4
topicLayout: "prose-topic"
---

## The execution layer

Execution is the operational layer where plans become physical actions: purchase orders are placed with suppliers, production batches are started, shipments are dispatched. In the operating model, execution operates at the shortest time horizon — days and shifts rather than weeks and months.

The key challenge in execution is not generating the plan — it is ensuring that the plan generated in Planning software translates faithfully into the ERP (ERP) and actually gets executed in the field.

## How the plan flows into execution

The Planning software planning model produces planned orders: what should be ordered, produced, or shipped, when, and in what quantity. These planned orders are the output of the planning engine. But planned orders are proposals — they only become real actions when they are released into the ERP as purchase orders, production orders, or transfer orders.

This handoff is a critical control point. It requires:

- **Plan-to-ERP integration** — planned orders from Planning software must flow into ERP either automatically or via a release process. The integration timing and filters determine how much of the plan gets executed.
- **Execution ownership** — someone in the organisation must own the release decision: reviewing planned orders before release, overriding quantities where field conditions differ, and confirming the order is aligned with current reality.
- **Feedback loop** — execution outcomes (actual quantities, completion dates, deviations) must flow back into Planning software to keep the plan current. Without this, the planning model diverges from operational reality.

## Where plans break down

Most execution failures are not failures of planning — they are failures of handoff. Common patterns:

- **Plan published but not released** — the S&OP plan is agreed but no one converts planned orders into purchase orders in ERP. The plan exists on paper but nothing happens.
- **Execution deviations not fed back** — production runs 20% less than planned, but Planning software is not updated. The next S&OE meeting reviews a plan that no longer reflects reality.
- **ERP overrides without plan alignment** — an operations team adjusts a production order directly in ERP without updating Planning software. The planning model now shows a different picture from what is actually being executed.

## The planner's role in execution

Planners do not execute — they enable execution. The planner's responsibility is to ensure that:
1. The plan in Planning software is current and credible
2. Planned orders are released to ERP on time and with the right parameters
3. Execution deviations are surfaced and reconciled promptly in S&OE
4. Where execution is structurally unable to follow the plan, the plan is revised and the deviation is escalated
