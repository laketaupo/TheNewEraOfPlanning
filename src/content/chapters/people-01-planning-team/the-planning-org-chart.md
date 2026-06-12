---
title: "The Planning Org Chart"
description: "See how the planning team is structured, who reports to whom, and where cross-functional roles connect."
chapter: "people-01-planning-team"
estimatedMinutes: 5
topicLayout: "full-widget"
widget: "org-chart"
orgChart:
  nodes:
    - id: sop-lead
      title: S&OP Lead
      description: Owns the end-to-end planning cycle and drives cross-functional alignment.
      responsibilities:
        - Facilitate the monthly S&OP cadence
        - Drive consensus across demand, supply, and finance
        - Own the integrated business plan
        - Escalate unresolved planning conflicts to executive team
      competencies:
        - Cross-functional leadership
        - Scenario thinking and decision framing
        - Executive communication
        - Planning process design
      children:
        - demand-mgr
        - supply-mgr
        - analyst
    - id: demand-mgr
      title: Demand Planning Manager
      description: Leads the demand team and owns the demand plan output.
      responsibilities:
        - Own the statistical and consensus demand forecast
        - Coach demand planners on methodology and tool use
        - Lead the demand review meeting
      competencies:
        - Statistical forecasting
        - Team leadership
        - Stakeholder management
      children:
        - demand-planner
    - id: demand-planner
      title: Demand Planner
      description: Generates forecasts and manages the demand signal.
      responsibilities:
        - Run the statistical baseline forecast
        - Incorporate market intelligence into the plan
        - Manage forecast exceptions and alerts
        - Prepare demand review materials
      competencies:
        - Statistical forecasting methods
        - Data literacy and Excel/Planning software proficiency
        - Business acumen and market awareness
        - Structured communication
    - id: supply-mgr
      title: Supply Planning Manager
      description: Leads the supply team and owns the supply plan output.
      responsibilities:
        - Own the supply plan and capacity allocation
        - Coach supply planners on constraint management
        - Lead the supply review meeting
      competencies:
        - Constraint-based planning
        - Team leadership
        - Manufacturing and logistics knowledge
      children:
        - supply-planner
    - id: supply-planner
      title: Supply Planner
      description: Translates demand into feasible supply across the network.
      responsibilities:
        - Convert the demand plan into production and replenishment orders
        - Balance inventory targets with capacity constraints
        - Identify and escalate supply risks
        - Maintain supplier lead time and capacity data
      competencies:
        - Supply chain fundamentals
        - Constraint management
        - Data accuracy and attention to detail
        - Risk identification
    - id: analyst
      title: Planning Analyst
      description: Maintains data quality and analytical infrastructure for the planning team.
      responsibilities:
        - Maintain master data accuracy
        - Build and maintain planning reports and dashboards
        - Support root-cause analysis on planning exceptions
        - Automate repetitive data tasks
      competencies:
        - Advanced data skills (SQL, Excel, BI tools)
        - Process documentation
        - Attention to detail
        - Planning software administration
  crossFunctional:
    - id: finance-bp
      title: Finance Business Partner
      description: Connects the volume plan to financial performance.
      responsibilities:
        - Validate that supply chain decisions align with budget
        - Provide financial perspective in S&OP reviews
        - Own the financial reconciliation between volume and value plans
      competencies:
        - Financial modelling
        - Business partnering
        - P&L understanding
    - id: commercial-lead
      title: Commercial Lead
      description: Brings market and customer context into the demand plan.
      responsibilities:
        - Provide sales and promotional input to the forecast
        - Represent customer commitments in supply discussions
        - Own new product launch planning from a commercial perspective
      competencies:
        - Sales planning
        - Customer relationship management
        - Market intelligence
---

## What this chart shows

The diagram below maps a typical supply chain planning organisation. The **S&OP Lead** sits at the top, not because they manage everyone, but because they own the process that ties the team together. Reporting into the planning function are the demand and supply lines — each with a manager and the planners who do the day-to-day work — alongside a planning analyst who supports both sides with data and reporting.

Off to the side sit the **cross-functional roles**: Finance and Commercial. These people don't report into the planning team, but the plan can't be agreed without them. They join the S&OP reviews, bring their function's perspective, and own specific inputs to the plan.

## How to use it

Click any role to see its core responsibilities and the competencies that role needs. Use it to understand where accountability sits, where the handoffs between roles happen, and where your own role fits in the wider picture. Every organisation structures this slightly differently — treat it as a reference model rather than a rigid template.
