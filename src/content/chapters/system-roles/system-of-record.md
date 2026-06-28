---
title: "System of Record"
description: "What 'system of record' means, which systems own which data types in the planning landscape, and what happens when that discipline breaks down."
chapter: "system-roles"
estimatedMinutes: 8
topicLayout: "prose-topic"
---

## What "System of Record" Actually Means

A system of record is not simply "the main system" or "the system most people use." It has a specific and consequential meaning: it is the system where a piece of data is *created*, where it is *authoritative*, and where it *wins* when two systems disagree.

This distinction matters because in any integrated planning landscape, the same data appears in multiple systems simultaneously. Inventory quantities exist in ERP, in Planning Software, in reporting dashboards, and potentially in spreadsheets maintained by finance. A purchase order status is visible in ERP, replicated into Planning Software, and summarised in supplier scorecards. A product lead time is held in the MDM system, pushed into ERP, and loaded into Planning Software as a planning parameter.

When these values agree, no one thinks about any of this. When they disagree, the system of record is what determines who is right — not consensus, not whoever speaks loudest in the weekly review, and not the system that shows the number that makes the plan look better.

Without a declared system of record for each data type, every system becomes its own authority. Disagreements become disputes rather than investigations. Teams spend time arguing about the number instead of acting on it. And because no one is definitively wrong, no one is definitively accountable for fixing it. Trust in the data collapses, people build shadow spreadsheets to keep their own version, and the integrated landscape stops behaving like one.

The system-of-record declaration is what makes a multi-system landscape governable.

## Which Systems Own Which Data

| Data domain | System of record | Examples |
|---|---|---|
| Transactional data — what has happened | **ERP** | On-hand inventory, goods receipts, confirmed production orders, purchase order status, goods issues |
| Master data — what exists and how it behaves | **MDM system** | Item codes and attributes, bills of material, bills of distribution, planning parameters |
| Scenario and simulation data — what might happen | **Planning Software** | Planning runs, what-if versions, projected inventory, recommended orders |
| Field actuals and grower data | **FMS** | Crop forecasts, field yield actuals, harvest schedules, grower contract volumes |

## ERP as the System of Record for Transactional Data

ERP is the system of record for everything that has happened as a business transaction. Goods receipts, goods issues, production order confirmations, inventory adjustments, purchase order creation and updates — these are execution facts. They represent real physical or financial events in the business.

When ERP records that 500 units were received into a warehouse location at 14:32 on a given date, that is the authoritative fact. Planning Software may have planned for 480 units, or forecasted 520. What actually happened is what ERP says happened. The plan was an expectation; the ERP posting is the reality.

The transactional data that ERP owns in this way includes:

**On-hand inventory by location.** Stock positions are maintained in ERP as the result of goods movements — receipts, issues, transfers, write-offs. Every posting updates the inventory balance. Planning Software receives a copy of these balances on whatever schedule the integration runs, but the live position is always in ERP.

**Open purchase orders.** When a purchase order is raised and confirmed, it exists in ERP with a quantity, a supplier, an expected delivery date, and a status. As goods arrive and are receipted, ERP records the partial or full fulfilment. The open quantity and expected date that Planning Software uses to project future supply come from ERP.

**Confirmed production orders.** Production orders in ERP carry a planned quantity, a start date, and a completion date. When production is confirmed, the order is updated — the actual output quantity is posted, the consumed components are issued, and the finished goods are received into inventory. All of this happens in ERP first.

**Historical goods movements.** Every goods receipt, goods issue, transfer order, and inventory adjustment creates a document in ERP. This history is the basis for actuals reporting, for variance analysis against the plan, and for statistical forecasting that needs real consumption data.

The practical implication: when a planner sees a different inventory figure in Planning Software than in ERP, the ERP figure is correct by definition. Planning Software holds a replicated copy, refreshed at integration intervals. The copy can be stale; ERP cannot lie about what was posted.

## MDM System as the System of Record for Master Data

Master data is the reference data that describes the business: what products exist, what they're called, how they're structured, how they move, and how they should be planned. The MDM system is the system of record for all of it.

**Item master records.** The item code, the description, the unit of measure, the product classification, the shelf life, the storage conditions, the procurement type — all of this is maintained in the MDM system and distributed to ERP and Planning Software. If the unit of measure is wrong in the MDM system, it is wrong everywhere.

**Bills of material.** A bill of material defines what goes into a finished product: which raw materials or semi-finished goods, in what quantities, with what expected yields. Planning Software uses the BOM to calculate what components it needs to produce a given volume of finished goods. ERP uses the BOM when production orders are confirmed and components are issued. The BOM in the MDM system is the source for both.

**Bills of distribution.** A bill of distribution defines how a product flows from where it is produced to where it is sold — which distribution centres serve which customers, in what sequence. Planning Software uses this to model the supply network. When the network changes — a new DC is opened, a sourcing rule changes — the update happens in the MDM system and flows downstream.

**Planning parameters.** This is perhaps the most consequential category. Lead times, minimum order quantities, lot sizes, safety stock targets, reorder points, planning horizons — every parameter that shapes how Planning Software generates a recommendation originates in the MDM system. If a safety stock target is set to 10 days in the MDM system and the actual business requirement is 15 days, Planning Software has been generating under-stocked recommendations every day until someone notices and the MDM system value is corrected. The problem doesn't live in Planning Software; it lives in the source.

## What Happens When SoR Discipline Breaks Down

These are not hypothetical scenarios. They happen regularly in organisations that treat system-of-record discipline as a documentation exercise rather than an operational principle.

**Scenario A: The manual override that gets overwritten.** A planner notices that Planning Software is using a lead time of 14 days for a supplier that now delivers in 10 days. The planner doesn't have access to the MDM system, so they edit the value directly in Planning Software. The plan improves. A week later, the MDM system sync runs and pushes the original 14-day value back into Planning Software. The plan reverts. The planner doesn't know why. They override it again. This cycle continues until someone raises a formal master data change request to update the value in the MDM system — which is what should have happened first.

**Scenario B: Two systems, two numbers, a meeting to decide.** Finance reports that on-hand inventory for a key product is 1,200 units. Operations reports 1,350 units. A meeting is called to "agree on the number." This is the wrong response. There is no agreeing to be done — one of these numbers is right and one is wrong, and the way to find out which is to go to ERP, which is the system of record for inventory. If ERP shows 1,350, then the finance figure is either stale or being sourced from somewhere other than ERP. Investigate why, then fix the source. If ERP shows 1,200, then operations is using a cached or incorrect figure. Same answer.

**Scenario C: The BOM change that gets overwritten.** A data manager notices that a product's BOM in ERP is incorrect — the yield factor is wrong, causing production orders to underissue raw materials. The manager makes the correction directly in ERP because they have access and it's faster. The change works — production orders immediately start using the corrected yield. But the MDM system, which is the system of record for BOMs, still holds the old yield factor. On the next nightly sync, the MDM system pushes the old value back into ERP, overwriting the correction. The production issue returns. The change needed to be made in the MDM system first, then allowed to flow to ERP through the normal integration path.

These scenarios share a structure: someone makes a change in the wrong place, the integration cycle restores the original value, and the person doesn't understand what happened. The system-of-record concept is what makes the cause visible.

## Governance Follows the Data

The system-of-record assignment is also an accountability assignment. The team that owns the system of record owns the accuracy of that data domain.

ERP transactional data is an operations and finance accountability. If on-hand inventory is wrong in ERP, that is an operations investigation — what was posted incorrectly, what physical count is needed, what process failed. It is not a Planning Software problem or an MDM problem.

Master data accuracy is a data governance accountability. If a planning parameter is wrong in the MDM system, the data governance team owns the investigation and the fix. The planner who noticed the problem and the planning manager who is affected by it are stakeholders, not owners.

Scenario data in Planning Software is a planning team accountability. Planning runs, what-if versions, and demand overrides are the planning team's domain. When a planning recommendation looks wrong, the first question is whether the input data from ERP and MDM system is correct. If it is, the issue is in the planning logic or the planning team's judgements. If it isn't, the investigation goes upstream.

Knowing who owns what matters most when something goes wrong. The investigation starts with the system-of-record owner for the affected data type — not with whoever noticed the problem, and not with whoever is most affected by it. This structure makes root-cause analysis faster and makes accountability clear enough that problems actually get resolved rather than managed around.
