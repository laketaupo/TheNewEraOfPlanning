---
title: "Safety Stock Review"
description: "Review and update safety stock targets to reflect current demand variability, supplier lead time variability, and agreed service level targets. Targets should be challenged periodically — not left static."
topicLayout: "process-step-detail"
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
---
