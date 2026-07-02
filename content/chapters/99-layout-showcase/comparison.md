---
title: "Comparison Layout"
description: "Two columns side-by-side — use this when you want to contrast two approaches, modes, or concepts directly."
chapter: "99-layout-showcase"
estimatedMinutes: 4
widget: ""
topicLayout: "comparison"
left:
  title: "Unconstrained Planning"
  points:
    - "Generates supply orders without checking capacity or material availability"
    - "Fast to compute — no constraint solving required"
    - "Useful as a first pass to see the raw volume of supply needed"
    - "Output often needs manual review and adjustment before execution"
    - "Common in long-horizon S&OP where operational detail doesn't matter yet"
right:
  title: "Constrained Planning"
  points:
    - "Respects capacity limits, lead times, MOQs, and material availability"
    - "Produces a feasible, executable plan the first time"
    - "Requires complete and accurate master data to run correctly"
    - "More compute-intensive — especially with complex multi-level BOMs"
    - "Used in short-to-medium horizon supply and production planning"
---
