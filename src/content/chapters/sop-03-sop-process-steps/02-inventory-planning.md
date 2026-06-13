---
title: "Inventory Planning"
description: "Setting and maintaining inventory targets that balance service levels against working capital — from coverage analysis through exception resolution."
chapter: "sop-03-sop-process-steps"
estimatedMinutes: 10
topicLayout: "process-steps"
processSteps:
  - title: "Coverage Analysis"
    description: "Assess current inventory positions against projected demand. Identify where coverage is below target, where excess stock is building, and where write-off risk exists."
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
  - title: "Safety Stock Review"
    description: "Review and update safety stock targets to reflect current demand variability, supplier lead time variability, and agreed service level targets. Targets should be challenged periodically — not left static."
    inputs:
      - "Historical demand variability data"
      - "Supplier lead time data"
      - "Service level targets by SKU"
    outputs:
      - "Updated safety stock targets by SKU"
      - "Exception list for items requiring policy discussion"
    roles:
      - "Inventory Planner"
      - "Supply Planner"
    systems:
      - "Planning Software"
    tasks:
      - "Calculate demand variability (standard deviation) for each SKU over 13 weeks"
      - "Calculate lead time variability by supplier"
      - "Apply service level formula to derive safety stock quantities"
      - "Compare current targets against calculated values"
      - "Escalate material changes to S&OP process owner for approval"
  - title: "Inventory Target Setting"
    description: "Set or confirm cycle stock and safety stock targets for the planning horizon. Targets balance working capital efficiency against service level obligations."
    inputs:
      - "Updated safety stock calculations"
      - "Working capital budget constraints"
      - "Service level targets"
    outputs:
      - "Confirmed inventory targets by SKU"
      - "Projected inventory value vs. budget"
    roles:
      - "Inventory Planner"
      - "Finance Business Partner"
    systems:
      - "Planning Software"
      - "ERP"
    tasks:
      - "Enter updated safety stock targets in planning software"
      - "Run projected inventory value calculation for horizon"
      - "Compare projected value against working capital budget"
      - "Identify trade-offs where budget and service level targets conflict"
      - "Present trade-offs to S&OP process owner for decision"
  - title: "Exception Resolution"
    description: "Resolve inventory exceptions flagged during coverage and target-setting — shortage risks requiring expediting, excess positions requiring action, and write-off candidates requiring sign-off."
    inputs:
      - "Shortage risk list"
      - "Excess inventory list"
      - "Write-off candidates"
    outputs:
      - "Expedite requests (shortage)"
      - "Disposal or redistribution plan (excess)"
      - "Write-off approval requests"
    roles:
      - "Inventory Planner"
      - "Supply Planner"
      - "Finance Business Partner"
    systems:
      - "ERP"
      - "Planning Software"
    tasks:
      - "Review and prioritise shortage risks by revenue impact"
      - "Raise expedite requests for critical shortages with supply planning"
      - "Propose redistribution or markdown plan for excess stock"
      - "Prepare write-off requests for finance approval"
      - "Update inventory plan with agreed actions"
---
