# S&OP Process Steps Chapter — Design Spec

**Date:** 2026-06-13  
**Status:** Approved

## Overview

Add a third chapter to the `sop-process` module that presents S&OP as a hierarchy of processes. Each L2 process is a topic; each topic renders its L3 steps as a tabbed walkthrough with full L4 task detail per step.

## Content structure

**New chapter:** `sop-03-sop-process-steps`  
- Pillar: `process`, Module: `sop-process`, Color: `blue`  
- Sits after the two existing SOP chapters in `order.json`

**Five topics (L2 processes):**

| Slug | Title |
|---|---|
| `01-demand-forecasting` | Demand Forecasting |
| `02-inventory-planning` | Inventory Planning |
| `03-supply-planning` | Supply Planning |
| `04-resource-planning` | Resource Planning |
| `05-sop-review` | S&OP Review |

**Frontmatter schema per topic:**

```yaml
title: string
description: string
chapter: "sop-03-sop-process-steps"
estimatedMinutes: number
topicLayout: "process-steps"
steps:
  - title: string
    description: string
    inputs: string[]
    outputs: string[]
    roles: string[]
    systems: string[]
    tasks: string[]
```

All data lives in frontmatter — no separate data files. Sample content is used for all 5 topics; the user will replace it with real data later.

## Layout & component

**New file:** `src/layouts/ProcessStepsLayout.astro`

Accepts standard `sharedProps` from `[topic].astro` plus `steps` from frontmatter.

**Page structure:**
- **Header zone:** chapter breadcrumb, topic title, description, prev/next navigation, theme toggle — identical pattern to other layouts.
- **Body zone:** tabbed walkthrough
  - Tab bar across the top: one tab per L3 step (step number + title), scrolls horizontally on narrow screens
  - Active step panel:
    - Description paragraph
    - Two-column grid: Inputs list | Outputs list
    - Tag row: Roles (indigo) + Systems (red/rose)
    - Numbered L4 task list
  - Previous / Next step buttons + "Step X of Y" counter
  - Tab switching: vanilla JS, no external dependencies

**Wiring:**
- `src/pages/[pillar]/[module]/[chapter]/[topic].astro` — add `'process-steps'` case to the layout switch, passing `steps: frontmatter.steps`
- `src/content/order.json` — register chapter slug under `sop-process` and all 5 topic slugs under the chapter key
- `moduleBackMap` inside `ProcessStepsLayout` includes `sop-process → /process/sop-process` (same as all other layouts)

## Files to create or modify

| File | Action |
|---|---|
| `src/content/chapters/sop-03-sop-process-steps/_meta.json` | Create |
| `src/content/chapters/sop-03-sop-process-steps/01-demand-forecasting.md` | Create |
| `src/content/chapters/sop-03-sop-process-steps/02-inventory-planning.md` | Create |
| `src/content/chapters/sop-03-sop-process-steps/03-supply-planning.md` | Create |
| `src/content/chapters/sop-03-sop-process-steps/04-resource-planning.md` | Create |
| `src/content/chapters/sop-03-sop-process-steps/05-sop-review.md` | Create |
| `src/layouts/ProcessStepsLayout.astro` | Create |
| `src/pages/[pillar]/[module]/[chapter]/[topic].astro` | Modify — add layout case |
| `src/content/order.json` | Modify — register chapter and topics |

## Out of scope

- L4 as a separate drill-down page (L4 tasks are shown inline within each L3 step)
- Interactive tab switching on mobile beyond horizontal scroll
- Real data (user will supply later)
