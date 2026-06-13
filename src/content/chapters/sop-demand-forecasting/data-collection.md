---
title: "Data Collection & Cleansing"
description: "Gather sales actuals from ERP and field actuals from FMS. Remove anomalies caused by one-off events such as promotions or supply failures. Validate that all required data feeds are complete before the statistical model is run."
chapter: "sop-demand-forecasting"
estimatedMinutes: 5
topicLayout: "process-steps"
processSteps:
  - title: "Data Collection & Cleansing"
    description: "Gather sales actuals from ERP and field actuals from FMS. Remove anomalies caused by one-off events such as promotions or supply failures. Validate that all required data feeds are complete before the statistical model is run."
    inputs:
      - "Sales actuals (ERP)"
      - "Field actuals (FMS)"
      - "Promotion calendar"
      - "Customer order history"
    outputs:
      - "Cleansed demand history"
      - "Anomaly log"
      - "Data completeness sign-off"
    roles:
      - "Demand Planner"
      - "Data Analyst"
    systems:
      - "ERP"
      - "FMS"
      - "Planning Software"
    tasks:
      - "Extract 24 months of sales history from ERP"
      - "Extract field actuals from FMS and reconcile against ERP"
      - "Identify and flag statistical outliers for manual review"
      - "Apply promotion calendar adjustments to baseline history"
      - "Complete and sign off data completeness checklist"
---
