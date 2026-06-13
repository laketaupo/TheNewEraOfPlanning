---
title: "Supply Planning"
description: "Translating the consensus demand plan into a feasible, constrained production and procurement schedule — identifying gaps and preparing costed options for resolution."
chapter: "sop-03-sop-process-steps"
estimatedMinutes: 12
topicLayout: "process-steps"
processSteps:
  - title: "Capacity Assessment"
    description: "Assess available production and procurement capacity for the planning horizon against the locked demand forecast. Identify bottlenecks and headroom before running the constrained plan."
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
  - title: "Constrained Supply Run"
    description: "Run the constrained supply plan in planning software to generate a feasible production and procurement schedule. The system applies prioritisation rules to allocate constrained capacity to demand."
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
  - title: "Gap Identification"
    description: "Identify where the constrained supply plan cannot meet the consensus demand plan. Gaps are quantified by volume, value, and timing and classified by root cause to guide option development."
    inputs:
      - "Constrained supply plan"
      - "Consensus demand forecast"
      - "Inventory coverage report"
    outputs:
      - "Gap report (volume, value, timing)"
      - "Root cause classification by gap"
      - "Items requiring escalation to pre-S&OP"
    roles:
      - "Supply Planner"
      - "Demand Planner"
    systems:
      - "Planning Software"
    tasks:
      - "Compare constrained plan against demand forecast by family and time bucket"
      - "Calculate gap volume and value for each shortfall"
      - "Classify each gap (capacity, material, lead time, or policy constrained)"
      - "Identify gaps closable within operations authority"
      - "Flag gaps requiring cross-functional decision for pre-S&OP"
  - title: "Option Development"
    description: "For each significant gap, develop costed options that could close it. The supply review should never present a gap without a proposed solution — even if none of the options are ideal."
    inputs:
      - "Gap report"
      - "Supplier flexibility data"
      - "Overtime and subcontracting costs"
      - "Logistics cost data"
    outputs:
      - "Costed options list per gap"
      - "Recommended option per gap"
      - "Items with no viable option (escalation)"
    roles:
      - "Supply Planner"
      - "Procurement Manager"
      - "Logistics Manager"
    systems:
      - "Planning Software"
      - "ERP"
    tasks:
      - "Engage suppliers on flexibility for critical material gaps"
      - "Cost overtime and additional shift scenarios for capacity gaps"
      - "Evaluate subcontracting options where available"
      - "Model expedited logistics scenarios for timing-constrained gaps"
      - "Compile options with cost and lead time for each gap"
  - title: "Supply Plan Submission"
    description: "Finalise and submit the supply plan for the pre-S&OP review, accompanied by the gap report and options list so the pre-S&OP team can make informed decisions."
    inputs:
      - "Constrained supply plan"
      - "Costed options list"
      - "Gap report"
    outputs:
      - "Submitted supply plan"
      - "Pre-S&OP briefing pack"
    roles:
      - "Supply Planner"
      - "S&OP Process Owner"
    systems:
      - "Planning Software"
    tasks:
      - "Review and sign off constrained supply plan"
      - "Prepare gap and options summary for pre-S&OP"
      - "Load supply plan into planning software for distribution"
      - "Distribute pre-S&OP briefing pack to participants"
      - "Archive supply plan version for audit trail"
---
