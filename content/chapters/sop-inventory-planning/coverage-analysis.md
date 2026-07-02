---
title: "Coverage Analysis"
description: "Assess current inventory positions against projected demand. Identify where coverage is below target, where excess stock is building, and where write-off risk exists."
topicLayout: "process-step-detail"
inputs:
  - "Current inventory positions (ERP)"
  - "Consensus demand forecast"
  - "Safety stock targets"
outputs:
  - "Coverage report by product (weeks of supply)"
  - "Shortage risk list"
  - "Excess inventory list"
roles:
  - "Inventory Planner"
  - "Demand Planner"
systems:
  - "ERP"
  - "Planning Software"
tasks:
  - "Extract current stock positions from ERP"
  - "Calculate projected coverage in weeks by product family"
  - "Flag items below minimum coverage threshold"
  - "Flag items with excess stock above maximum threshold"
  - "Prepare coverage report for S&OP review"
---
