---
title: "What Is an FMS?"
description: "FMS tracks grower activity, contracts, and crop development. For supply chain planners, it is the primary source of supply-side signals for agricultural produce."
chapter: "fms-01-understanding-basics"
estimatedMinutes: 4
topicLayout: "prose-topic"
---

## What FMS does

FMS is a Field Management System (FMS) built for agricultural supply chains. It tracks everything that happens in the field: which growers are contracted, what has been planted, how the crop is developing, and when and how much is expected to be harvested.

For supply chain planners, FMS is the primary source of supply-side data. The demand side of the plan is driven by customer orders and forecasts. The supply side — particularly for agricultural inputs — is driven by what the field produces, and FMS is where that data lives.

## Key data in FMS

**Grower contracts:** The formal agreements between the organisation and individual growers: which crop varieties, what quantity, what quality standard, what price, and what expected delivery timing. Contracts are the committed supply base.

**Planted area:** After planting, FMS records confirmed hectares per grower per variety. This replaces the contracted quantity with an observed quantity — an important distinction when conditions differ from what was contracted.

**Field activities:** Irrigation records, fertiliser applications, pest management interventions. These provide context for understanding crop health and yield trajectory.

**Crop stage and yield forecast:** As the season progresses, FMS tracks crop development stage (germination, vegetative growth, flowering, maturity) and generates updated yield forecasts. Early in the season, the yield forecast is based on historical averages and planted area. As the crop matures, the forecast is updated with observed crop conditions.

**Harvest scheduling:** Expected harvest dates and volumes by field and variety, used to plan logistics and processing capacity.

## How planners use FMS data

Planners typically do not work directly in FMS — the field team and agronomists manage it. Planners consume the output: the supply signals that flow from FMS into Planning software via the integration.

The most important signal is the **yield forecast update**: when FMS's latest crop assessment suggests that expected harvest volumes will be higher or lower than the contracted quantity, this needs to be reflected in the Planning software supply plan quickly.

**Key monitoring question:** Is the supply signal in Planning software current? If the latest FMS harvest forecast was updated three days ago but the Planning software integration has not run since then, the supply plan is stale. Check the interface timestamp before drawing conclusions from the supply plan.

## FMS and planning decisions

When FMS data indicates a supply shortfall (poor germination, weather damage, yield below expectation), the planning response is immediate: the shortfall needs to be reflected in the Planning software plan, scenarios should be built to assess customer impact, and allocation decisions may need to be triggered.

The interface between FMS and Planning software is the critical link. A delay or failure in this interface during a supply disruption event — when timely data is most important — can significantly reduce the organisation's ability to respond before commitments become irreversible.
