---
title: "The Demand Planner's Tool Interactions"
description: "How a demand planner uses Planning Software, ERP, MDM system, and FMS — building forecasts, applying overlays, calibrating against actuals, and understanding supply constraints."
chapter: "tool-usage-by-role"
estimatedMinutes: 9
topicLayout: "prose-topic"
---

## System Interactions at a Glance

| System | What they read | What they enter | What they are responsible for |
|---|---|---|---|
| **Planning Software** | Statistical forecast, demand signals, exception list, over/under-forecast alerts, consensus demand plan | Commercial overlays, promotional uplifts, manual forecast adjustments, new product introduction volumes | Producing an accurate, consensus-approved demand plan; acting on forecast exceptions |
| **ERP** | Sales order history, returns, recent shipment data | Nothing — read-only | Using ERP actuals to calibrate and validate the forecast |
| **MDM system** | Product hierarchy, customer segmentation, item attributes | Nothing — read-only | Flagging hierarchy or segmentation errors to the data team for correction in MDM system |
| **FMS** | Crop forecasts and seasonal field supply signals (via Planning Software) | Nothing — no direct FMS access | Escalating stale or inconsistent field supply signals to the FMS team |

## Planning Software: The Primary Working Environment

Planning Software is where a demand planner spends the majority of their time, and understanding how to use it well is the difference between a planner who reacts to the forecast and one who genuinely owns it.

The system generates a statistical baseline automatically. Depending on its configuration, this might use a moving average, an exponential smoothing model, or a machine-learning approach that factors in seasonality, trend, and promotional lift. Whatever the method, the output is the algorithm's best prediction given the historical data it can see. That is a meaningful starting point — but it is only a starting point. The algorithm does not know that your largest retail customer has told the account manager they are shifting to a competitor next quarter. It does not know that marketing has pulled forward a promotional campaign from Q3 to Q2. It does not know that the item introduced eighteen months ago is now entering maturity and should no longer be trending upward. The demand planner's job is to bring that knowledge into the system.

This is done through overlays — adjustments applied on top of the statistical baseline for specific products, customer segments, or time periods. A planned promotional price reduction in week 8 should lift demand: by how much, based on the uplift observed from similar promotions in the past? The planner records that estimate as an overlay. A new product launching in Q3 has no history to forecast from, so the planner seeds an initial volume using reference products or launch analogues. A major customer has indicated they are reducing orders for the next two months: the planner applies a downward adjustment for that customer segment. None of this replaces the statistical model — it improves on it by adding information the model cannot access.

Alongside the overlays, the exception list is where a demand planner spends much of their diagnostic effort. Planning Software monitors forecast performance continuously and flags products where actuals are significantly above or below forecast, where statistical accuracy metrics have deteriorated over recent periods, or where the demand pattern appears to have shifted in a way that may invalidate the historical model. Each exception is an invitation to investigate. A product consistently under-forecasting might have a structural demand increase that the baseline hasn't caught. A product consistently over-forecasting might reflect a one-off bulk order that has been incorrectly projected as ongoing demand. The planner reviews each flag, decides whether the underlying pattern has genuinely changed, and adjusts the plan — or the model parameters — accordingly.

Once a month, the demand planner facilitates the consensus demand review as part of the S&OP cycle. This is one of the most important moments in their calendar. The planner presents the current demand plan to sales, marketing, and commercial leadership — not to validate their own work, but to collect the intelligence that sits in those teams and nowhere in the system. Sales has pipeline visibility on large accounts. Marketing knows which campaigns are tracking ahead or behind. Commercial has pricing and promotion plans that haven't been formally loaded yet. The planner synthesises all of this, updates the plan in Planning Software, and locks the consensus demand plan that will drive the supply review. After that lock, the demand plan becomes the formal input to supply planning, so the quality of that conversation — and the rigour of what the planner loads into the system — has direct consequences for whether the organisation builds the right inventory.

Between monthly S&OP cycles, the demand planner keeps an eye on forecast accuracy at a more granular level. Planning Software tracks forecast error by product, by time horizon, and over rolling periods. A product with high and worsening forecast error is costing the business — either through excess stock or through shortfalls. Tracking this is not a retrospective exercise performed once a quarter; it is an ongoing signal about which parts of the plan need closer attention and which forecasting models may need recalibrating.

## ERP: The Source of Actuals

ERP is the demand planner's ground truth for what actually happened. Sales order history — confirmed orders, shipped quantities, returns, cancellations — lives in ERP and feeds into Planning Software through an automated integration. But when the numbers don't add up, the planner often needs to go directly to the source.

The most common reason a demand planner opens ERP is to understand a forecast discrepancy. Suppose the statistical baseline for a product has been over-forecasting consistently for three months. Before adjusting the model or applying a downward overlay, the planner wants to understand why. Is demand genuinely declining? Or is something wrong with the data that Planning Software has been ingesting? Pulling sales history directly from ERP allows the planner to check: are shipments being posted completely and on time? Are returns being correctly attributed and subtracted? Is there a large order from one customer that inflated one month's actuals and shouldn't be treated as a new baseline?

Conversely, when a statistical forecast shows a spike that doesn't appear in any commercial plan the planner is aware of, the first diagnostic step is to look at ERP. If there is a matching spike in recent sales orders — a bulk purchase from a single customer buying three months of stock in one order, for instance — the question becomes whether that pattern is likely to repeat. It usually isn't, and the planner will apply an overlay to prevent Planning Software from projecting that peak forward as if it were regular demand.

It is worth being clear about the boundary here. Demand planners do not push forecast data into ERP. The demand plan belongs in Planning Software and is owned there. ERP is a source of actuals, not a destination for forecasts. When a planner is in ERP, they are investigating history — not updating the plan.

## MDM System: Hierarchy and Segmentation

Demand forecasting is not a flat exercise. Planners work at multiple levels simultaneously: individual SKUs, product families, market segments, customer groups, geographic regions. The product hierarchy and customer hierarchy that underpin these levels are defined and maintained in MDM system, and they flow into Planning Software through a regular synchronisation.

This matters enormously because Planning Software's aggregation and disaggregation logic depends entirely on those hierarchies. When a demand planner sets a forecast at the product family level and asks Planning Software to disaggregate it to individual SKUs, the system uses the historical mix within that family — as it is defined by MDM system — to calculate how the volume should be split. If MDM system has a product assigned to the wrong family, it will receive the wrong share of the disaggregated forecast. The SKU-level number will look wrong, and it will be wrong, but the root cause is not in Planning Software — it is in MDM system.

New product introductions expose this dependency clearly. Before a new SKU can be added to the demand plan in Planning Software, it must exist as a record in MDM system with the correct attributes, lifecycle status, and product hierarchy assignments. If the data team has not yet created or fully configured the item record, the planner cannot plan for the launch. In markets where new product introductions are frequent, this dependency on MDM system completeness becomes a planning bottleneck. The demand planner needs to know the MDM system lead time — how long it takes to create and approve a new item record — and build that into the new product launch planning process.

The customer hierarchy has the same dynamics. When customers are correctly segmented in MDM system, the demand plan aggregated to segment level is meaningful — it tells you what the retail channel expects versus the wholesale channel, or what one region is expecting versus another. If a large customer is classified in the wrong segment, the forecast for both segments is wrong: one is inflated, the other is understated. The demand planner will see it when they look at segment-level forecast accuracy, but the fix must happen in MDM system, not in Planning Software. The planner flags it; the data team corrects it; the updated hierarchy propagates at the next sync.

The demand planner does not have write access to MDM system and should not be seeking it. Their role in relation to MDM system is diagnostic and escalatory: they notice when something in the hierarchy doesn't make sense, investigate whether it could be an MDM system issue, and raise it with the data team with enough context to fix it quickly.

## FMS: Seasonal Supply Context

In businesses where agricultural production or fresh-field supply shapes planning decisions — seasonal pack volumes, harvest-dependent production schedules, or fresh-produce allocation — the Field Management System provides a view of what the supply side can realistically deliver each season. This data reaches the demand planner not through a direct FMS login but through Planning Software, which ingests the field supply signals from FMS via an automated integration.

The demand planner's use of FMS data is contextual rather than operational. When building a seasonal volume plan — what quantities should we plan for this growing season? — the planner references the current field supply outlook as an upper constraint on the plan. The field data does not tell them what demand will be; it tells them what the ceiling is. If the crop forecast suggests the season will produce fifteen percent less volume than last year, and the demand plan is projecting volume in line with last year's demand, there is an alignment problem that needs to surface in the S&OP supply review — not something to discover at execution when stock simply isn't there.

Most demand planners do not need a direct FMS login to do this work effectively. The integration provides the key signals inside Planning Software, and that is typically sufficient for demand planning purposes. The exception is when those signals look stale, inconsistent, or out of step with what the planner is hearing from field operations or procurement. In that case, the right response is to escalate to the FMS team or the integration owner — not to work around the problem by adjusting the demand plan based on guesswork. A demand planner making supply assumptions without reliable field data is building on sand.

The broader point is that demand planners in supply-constrained, seasonally variable environments need enough literacy in FMS concepts to read what they are seeing in Planning Software and ask the right questions. They do not need to understand FMS deeply — but they do need to know when the supply signal they are relying on for the seasonal plan may not be current.
