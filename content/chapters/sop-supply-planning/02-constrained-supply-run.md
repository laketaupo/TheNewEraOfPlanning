---
title: "Constrained Supply Run"
description: "Run the constrained supply plan in planning software to generate a feasible production and procurement schedule. The system applies prioritisation rules to allocate constrained capacity to demand."
topicLayout: "process-step-detail"
inputs:
  - "Consensus demand forecast"
  - "Capacity constraints"
  - "Inventory positions"
  - "Prioritisation rules"
outputs:
  - "Constrained production plan"
  - "Constrained procurement plan"
  - "Unmet demand report"
roles:
  - "Supply Planner"
  - "Planning Software Administrator"
systems:
  - "Planning Software"
tasks:
  - "Confirm prioritisation rules are current and approved"
  - "Trigger constrained supply run in planning software"
  - "Review run log for errors or constraint violations"
  - "Extract unmet demand report by product and time bucket"
  - "Validate constrained plan totals against unconstrained baseline"
---
