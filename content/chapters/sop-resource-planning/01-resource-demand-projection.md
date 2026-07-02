---
title: "Resource Demand Projection"
description: "Translate the supply plan into resource requirements — labour, equipment, and warehouse capacity — across the planning horizon. This projection forms the basis for capacity mapping and constraint identification."
topicLayout: "process-step-detail"
inputs:
  - "Constrained supply plan"
  - "Resource consumption rates (BOM/BOD)"
  - "Resource calendar"
outputs:
  - "Resource demand projection by resource type"
  - "Planning horizon load profile"
roles:
  - "Resource Planner"
  - "Supply Planner"
systems:
  - "Planning Software"
tasks:
  - "Run resource requirements projection in planning software"
  - "Extract load profile by resource type for the horizon"
  - "Review projection against known calendar exceptions (holidays, shutdowns)"
  - "Flag resources projected to exceed available capacity"
  - "Distribute projection to resource owners for validation"
---
