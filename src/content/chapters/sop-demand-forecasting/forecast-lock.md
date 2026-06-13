---
title: "Forecast Lock & Distribution"
description: "The agreed consensus forecast is locked in the system and distributed to downstream planning processes. Any post-lock revision requires a formal change request with an owner and documented reason."
chapter: "sop-demand-forecasting"
estimatedMinutes: 5
topicLayout: "process-steps"
processSteps:
  - title: "Forecast Lock & Distribution"
    description: "The agreed consensus forecast is locked in the system and distributed to downstream planning processes. Any post-lock revision requires a formal change request with an owner and documented reason."
    inputs:
      - "Locked consensus forecast"
      - "Downstream planning calendar"
    outputs:
      - "Distributed forecast (supply, inventory, finance)"
      - "Change request log"
    roles:
      - "Demand Planner"
      - "S&OP Process Owner"
    systems:
      - "Planning Software"
      - "ERP"
    tasks:
      - "Lock forecast in planning software for the agreed horizon"
      - "Trigger automated distribution to supply and inventory planning"
      - "Notify finance of final demand plan for reconciliation"
      - "Publish change request procedure to stakeholders"
      - "Archive assumption log and meeting minutes"
---
