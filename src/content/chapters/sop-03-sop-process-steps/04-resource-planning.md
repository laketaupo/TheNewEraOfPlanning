---
title: "Resource Planning"
description: "Translating the supply plan into labour, equipment, and capacity requirements — identifying binding constraints and allocating available resource to the plan."
chapter: "sop-03-sop-process-steps"
estimatedMinutes: 10
topicLayout: "process-steps"
processSteps:
  - title: "Resource Demand Projection"
    description: "Translate the supply plan into resource requirements — labour, equipment, and warehouse capacity — across the planning horizon. This projection forms the basis for capacity mapping and constraint identification."
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
  - title: "Capacity Mapping"
    description: "Compare projected resource demand against available capacity to identify surplus and deficit positions. Available capacity accounts for planned maintenance, holidays, and contractual limits."
    inputs:
      - "Resource demand projection"
      - "Resource capacity calendars"
      - "Planned maintenance schedule"
    outputs:
      - "Capacity vs. demand map by resource"
      - "Surplus and deficit summary by period"
    roles:
      - "Resource Planner"
      - "Operations Manager"
    systems:
      - "Planning Software"
      - "ERP"
    tasks:
      - "Confirm resource capacity calendars are up to date"
      - "Run capacity vs. demand comparison in planning software"
      - "Produce heat map showing surplus and deficit by period"
      - "Validate results with resource owners"
      - "Update planning software with any corrections to capacity data"
  - title: "Constraint Identification"
    description: "Identify which resource constraints are binding — those that will prevent the supply plan from being executed as planned. Not all constraints require action; only those that create plan risk."
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
  - title: "Resource Allocation"
    description: "Allocate available resource capacity to the supply plan, applying agreed prioritisation rules. Where constraints cannot be resolved, document the trade-off and escalate to pre-S&OP."
    inputs:
      - "Binding constraint list"
      - "Prioritisation rules"
      - "Supply plan"
    outputs:
      - "Resource-allocated production plan"
      - "Escalation list for unresolved constraints"
    roles:
      - "Resource Planner"
      - "Operations Manager"
      - "S&OP Process Owner"
    systems:
      - "Planning Software"
    tasks:
      - "Apply prioritisation rules to allocate constrained capacity in planning software"
      - "Confirm resource-allocated plan is consistent with constrained supply plan"
      - "Document trade-offs where prioritisation results in unmet demand"
      - "Raise escalation items for unresolved constraints"
      - "Submit resource-allocated plan to supply planner for pre-S&OP integration"
---
