---
title: "Statistical Baseline Generation"
description: "Run the statistical forecasting model on the cleansed history. Review model fit and flag product families where accuracy falls below the agreed threshold. Select the best-performing algorithm per family."
topicLayout: "process-step-detail"
inputs:
  - "Cleansed demand history"
  - "Forecasting model configuration"
  - "Seasonality index"
outputs:
  - "Statistical baseline forecast"
  - "Model accuracy report (MAPE by family)"
  - "Exception list for manual review"
roles:
  - "Demand Planner"
  - "Planning Software Administrator"
systems:
  - "Planning Software"
tasks:
  - "Trigger statistical forecast run in planning software"
  - "Review MAPE scores by product family"
  - "Identify families where forecast error exceeds threshold"
  - "Override algorithm for underperforming families"
  - "Export baseline for commercial review"
---
