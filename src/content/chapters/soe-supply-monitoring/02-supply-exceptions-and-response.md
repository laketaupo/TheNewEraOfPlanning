---
title: "Supply Exceptions and Response"
description: "How supply exceptions surface in planning software, what responses are available, and when the planner acts versus escalates."
chapter: "soe-supply-monitoring"
estimatedMinutes: 5
topicLayout: "prose-topic"
---

## How supply exceptions surface

Planning software surfaces supply exceptions through the same exception queue mechanism used for demand exceptions, but filtered to supply-type alerts. Common supply exception types include: late inbound PO, quantity shortfall on confirmed PO, inventory below safety stock, projected stock-out within horizon, and schedule adherence below threshold.

Each exception appears with the affected item, the nature of the problem, the severity rating, and the relevant planning data — current stock position, open supply orders, and projected inventory trajectory. The planner works through the supply exception queue as part of the weekly S&OE cycle, typically after the demand monitoring review, so that the demand picture is already established when assessing supply responses.

## Response options available in planning software

Planning software gives the S&OE planner several direct response actions for supply exceptions. The right action depends on the nature of the exception and the alternatives available in the current supply picture.

**Expediting an inbound PO** involves contacting the supplier (or routing the request through procurement) to pull forward a confirmed delivery date. In the planning system, the planner can update the expected receipt date to reflect the expedited commitment, which immediately updates the projected inventory position. Expediting has a cost — it may incur premium freight charges or disrupt the supplier's own schedule — and should be reserved for situations where the inventory risk justifies that cost.

**Reallocating available stock** is the appropriate response when one location or customer segment has a surplus and another has a shortfall. The planner identifies available stock in the system, initiates a stock transfer order, and updates the allocation to redirect supply toward the at-risk demand. This is a purely internal action with no supplier involvement, and it can often resolve a localised stock-out risk without any external escalation.

**Adjusting the production schedule** applies in manufacturing environments where the planner has authority (or can request) a change to near-term production priorities. If a product with a supply gap can be moved earlier in the production sequence, the supply position improves without new material or additional capacity. Conversely, if overproduction is building unwanted stock, the planner may request a schedule reduction or deferral.

**Placing an emergency order** is the highest-cost response: it means committing to new supply outside the normal replenishment cycle, typically with a premium on price or lead time. This action is reserved for situations where all other responses are insufficient and the service risk of not acting outweighs the cost of the emergency order.

## Criteria for each response action

The choice between response options is not arbitrary. Each action has a set of conditions under which it is appropriate:

- Expedite when: the supplier can realistically pull forward, the cost is justified by service risk, and there is no available stock alternative.
- Reallocate when: there is an identifiable surplus elsewhere in the network, and the transfer lead time is shorter than the replenishment lead time.
- Adjust schedule when: production flexibility exists within the current period, and the bottleneck is sequencing rather than capacity or material.
- Emergency order when: no existing supply can be redirected, the service impact is significant, and the planner or their manager has authority to commit the cost.

## When the planner acts vs. when they escalate

The S&OE planner has direct authority to acknowledge exceptions, adjust near-term planning parameters, and initiate internal reallocation. Actions that involve supplier commitments (expediting, emergency orders) or production schedule changes that affect other products typically require coordination with procurement or operations, even if the planner initiates the request.

Escalation to the integrated S&OE review is triggered when: no available response action can close the supply gap within the horizon, multiple products are affected simultaneously creating prioritisation conflicts, or the supply risk has a customer service impact that needs cross-functional sign-off. Escalation to S&OP is triggered when the supply gap reflects a structural capacity or supply base problem that the near-term plan cannot absorb.
