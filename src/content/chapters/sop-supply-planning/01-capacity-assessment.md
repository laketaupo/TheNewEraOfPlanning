---
title: "Capacity Assessment"
description: "Assess available production and procurement capacity for the planning horizon against the locked demand forecast. Identify bottlenecks and headroom before running the constrained plan."
topicLayout: "process-step-detail"
inputs:
  - "Locked demand forecast"
  - "Production capacity data"
  - "Supplier capacity confirmations"
  - "Current open orders (ERP)"
outputs:
  - "Capacity utilisation report"
  - "Bottleneck list"
  - "Available headroom by resource"
roles:
  - "Supply Planner"
  - "Production Planner"
systems:
  - "Planning Software"
  - "ERP"
tasks:
  - "Load current capacity data into planning software"
  - "Run unconstrained supply run against consensus demand"
  - "Identify resources at or above 85% utilisation"
  - "Flag supplier capacity limits from latest confirmations"
  - "Produce capacity utilisation summary for review"
---
