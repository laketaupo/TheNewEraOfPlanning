---
title: "Demand Forecasting"
description: "Turning raw sales history into a single consensus demand number — from data cleansing through statistical modelling, commercial review, and final lock."
chapter: "sop-03-sop-process-steps"
estimatedMinutes: 12
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
  - title: "Statistical Baseline Generation"
    description: "Run the statistical forecasting model on the cleansed history. Review model fit and flag product families where accuracy falls below the agreed threshold. Select the best-performing algorithm per family."
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
  - title: "Commercial Overlay"
    description: "The commercial team reviews the statistical baseline and applies adjustments based on market intelligence the model cannot see — promotions, pipeline changes, new distribution wins, or lost accounts."
    inputs:
      - "Statistical baseline forecast"
      - "Sales pipeline data"
      - "Promotion plan"
      - "Key account updates"
    outputs:
      - "Commercially adjusted forecast"
      - "Assumption log (one entry per material override)"
    roles:
      - "Sales Manager"
      - "Key Account Manager"
      - "Demand Planner"
    systems:
      - "Planning Software"
      - "CRM"
    tasks:
      - "Distribute baseline forecast to commercial team for review"
      - "Collect commercial override proposals with documented assumptions"
      - "Validate overrides are within governance thresholds"
      - "Apply approved overrides in planning software"
      - "Produce assumption log for audit trail"
  - title: "Consensus Forecast Review"
    description: "Commercial and supply chain align on a single consensus number. Disagreements are surfaced and resolved in the meeting — not after it. The output is one agreed forecast, not a range or multiple versions."
    inputs:
      - "Commercially adjusted forecast"
      - "Supply constraints summary"
      - "Prior month actuals vs. forecast"
    outputs:
      - "Consensus forecast (locked)"
      - "Meeting minutes with decisions and owners"
    roles:
      - "Demand Planner"
      - "Supply Planner"
      - "Commercial Lead"
      - "S&OP Process Owner"
    systems:
      - "Planning Software"
    tasks:
      - "Circulate pre-meeting pack 48 hours before review"
      - "Review actuals vs. prior forecast and document bias"
      - "Present statistical baseline and commercial overlays"
      - "Surface and resolve material disagreements in the meeting"
      - "Formally lock consensus forecast in planning software"
  - title: "Forecast Lock & Distribution"
    description: "The agreed consensus forecast is locked in the system and distributed to downstream planning processes. Any post-lock revision requires a formal change request with an owner and documented reason."
    inputs:
      - "Locked consensus forecast"
      - "Downstream planning calendar"
    outputs:
      - "Distributed forecast (supply, inventory, finance)"
      - "Change request log"
    roles:
      - "Demand Planner"
      - "S&OP Process Owner"
    systems:
      - "Planning Software"
      - "ERP"
    tasks:
      - "Lock forecast in planning software for the agreed horizon"
      - "Trigger automated distribution to supply and inventory planning"
      - "Notify finance of final demand plan for reconciliation"
      - "Publish change request procedure to stakeholders"
      - "Archive assumption log and meeting minutes"
---
