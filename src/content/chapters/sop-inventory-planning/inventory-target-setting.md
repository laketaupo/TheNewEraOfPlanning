---
title: "Inventory Target Setting"
description: "Set or confirm cycle stock and safety stock targets for the planning horizon. Targets balance working capital efficiency against service level obligations."
chapter: "sop-inventory-planning"
estimatedMinutes: 5
topicLayout: "process-steps"
processSteps:
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
---
