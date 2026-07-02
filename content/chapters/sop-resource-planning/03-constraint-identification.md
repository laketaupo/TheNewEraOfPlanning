---
title: "Constraint Identification"
description: "Identify which resource constraints are binding — those that will prevent the supply plan from being executed as planned. Not all constraints require action; only those that create plan risk."
topicLayout: "process-step-detail"
inputs:
  - "Capacity vs. demand map"
  - "Supply plan"
  - "Service level targets"
outputs:
  - "Binding constraint list"
  - "Risk-ranked constraint summary"
roles:
  - "Resource Planner"
  - "Supply Planner"
  - "Operations Manager"
systems:
  - "Planning Software"
tasks:
  - "Filter capacity map to resources at or above 100% utilisation"
  - "Assess whether binding constraints affect prioritised demand"
  - "Rank constraints by service level impact"
  - "Identify constraints resolvable within operations vs. those requiring escalation"
  - "Prepare constraint summary for pre-S&OP"
---
