---
title: "S&OP Review"
description: "Bringing demand, supply, inventory, and resource plans together — from cross-functional pre-alignment through executive sign-off and plan distribution."
chapter: "sop-03-sop-process-steps"
estimatedMinutes: 10
topicLayout: "process-steps"
processSteps:
  - title: "Pre-S&OP Alignment"
    description: "The pre-S&OP meeting brings together the outputs of demand, supply, inventory, and resource planning to identify cross-functional issues that cannot be resolved within individual functions. The goal is to prepare a small number of clear decisions for executive review."
    inputs:
      - "Demand plan"
      - "Supply plan with gap and options list"
      - "Inventory plan"
      - "Resource constraint summary"
    outputs:
      - "Aligned cross-functional plan"
      - "Issue and decision list for executive review"
    roles:
      - "S&OP Process Owner"
      - "Demand Planner"
      - "Supply Planner"
      - "Finance Business Partner"
    systems:
      - "Planning Software"
    tasks:
      - "Distribute pre-S&OP briefing pack to participants 48 hours in advance"
      - "Review demand plan and supply plan alignment"
      - "Identify issues that cannot be resolved at functional level"
      - "Agree recommended options for each issue"
      - "Prepare executive S&OP pack with issues, options, and recommendations"
  - title: "Financial Reconciliation"
    description: "Reconcile the volume plan with the financial plan to ensure consistency. Significant volume-to-value gaps must be explained and, where material, resolved before executive review."
    inputs:
      - "Volume supply and demand plan"
      - "Financial forecast (P&L)"
      - "Prior period actuals"
    outputs:
      - "Volume-to-value bridge"
      - "Financial gap analysis"
      - "Items for executive decision"
    roles:
      - "Finance Business Partner"
      - "S&OP Process Owner"
      - "Commercial Lead"
    systems:
      - "Planning Software"
      - "Finance System"
    tasks:
      - "Map volume plan to financial values using current price and cost assumptions"
      - "Compare resulting financial forecast against the approved financial plan"
      - "Calculate the bridge (volume, price, mix, and cost variances)"
      - "Identify items where the gap requires a management decision"
      - "Include financial summary in executive S&OP pack"
  - title: "Executive S&OP Review"
    description: "The executive review is the decision-making forum of the S&OP cycle. It reviews the aligned plan, considers the issues and options prepared by pre-S&OP, and makes the decisions needed to produce one agreed business plan."
    inputs:
      - "Aligned cross-functional plan"
      - "Issue and decision list"
      - "Financial reconciliation"
      - "Pre-S&OP recommendations"
    outputs:
      - "Agreed business plan decisions"
      - "Action log with owners and due dates"
    roles:
      - "CEO or COO"
      - "Commercial Director"
      - "Operations Director"
      - "Finance Director"
      - "S&OP Process Owner"
    systems:
      - "Planning Software"
    tasks:
      - "Present prior period performance vs. plan"
      - "Review horizon demand and supply plan with financial overlay"
      - "Present issues with options and pre-S&OP recommendations"
      - "Facilitate executive decisions on escalated items"
      - "Record decisions and assign actions with owners and due dates"
  - title: "Plan Distribution & Close"
    description: "The agreed decisions from the executive review are applied to the plan in planning software. The final plan is distributed to all functions as the authoritative business plan. The cycle is formally closed and the next cycle is initiated."
    inputs:
      - "Executive decisions and actions"
      - "Aligned plan in planning software"
    outputs:
      - "Approved final plan (distributed to all functions)"
      - "Action tracker with owners"
      - "Next cycle kick-off date"
    roles:
      - "S&OP Process Owner"
      - "Demand Planner"
      - "Supply Planner"
    systems:
      - "Planning Software"
      - "ERP"
    tasks:
      - "Apply executive decisions to plan in planning software"
      - "Lock and publish the approved plan"
      - "Distribute plan to all functions with a summary of key decisions"
      - "Circulate action tracker with owners and due dates"
      - "Schedule and confirm next S&OP cycle start date"
---
