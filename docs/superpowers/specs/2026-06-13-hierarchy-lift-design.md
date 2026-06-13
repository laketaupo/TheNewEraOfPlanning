# Hierarchy Lift — Design Spec

**Date:** 2026-06-13  
**Status:** Approved

## Overview

Promote the content hierarchy one level across S&OP, S&OE, and Execution process modules: L2 processes become chapters, L3 steps become topics, and L4 tasks are shown inline on each topic page. The six existing "fundamentals" and "running" chapters from those three modules move to Process Foundations.

## Structural changes

### Process Foundations — gains 6 chapters (module field only; files stay in place)

| Chapter slug | From module |
|---|---|
| `sop-01-sop-fundamentals` | `sop-process` → `process-foundations` |
| `sop-02-running-sop` | `sop-process` → `process-foundations` |
| `soe-01-soe-fundamentals` | `soe-process` → `process-foundations` |
| `soe-02-running-soe` | `soe-process` → `process-foundations` |
| `exec-01-execution-fundamentals` | `execution-process` → `process-foundations` |
| `exec-02-daily-execution` | `execution-process` → `process-foundations` |

### S&OP module — 5 new chapters (L2 → chapter, L3 → topic)

| Chapter slug | Topics (L3 step slugs) |
|---|---|
| `sop-demand-forecasting` | `data-collection`, `statistical-baseline`, `commercial-overlay`, `consensus-review`, `forecast-lock` |
| `sop-inventory-planning` | `coverage-analysis`, `safety-stock-review`, `inventory-target-setting`, `exception-resolution` |
| `sop-supply-planning` | `capacity-assessment`, `constrained-supply-run`, `gap-identification`, `option-development`, `supply-plan-submission` |
| `sop-resource-planning` | `resource-demand-projection`, `capacity-mapping`, `constraint-identification`, `resource-allocation` |
| `sop-sop-review` | `pre-sop-alignment`, `financial-reconciliation`, `executive-sop-review`, `plan-distribution` |

Content sourced from the `processSteps` arrays in the now-deleted `sop-03-sop-process-steps` topics.

### S&OE module — 4 stub chapters (no topics yet)

`soe-demand-monitoring`, `soe-supply-monitoring`, `soe-exception-management`, `soe-integrated-review`

### Execution module — 4 stub chapters (no topics yet)

`exec-order-prioritisation`, `exec-execution-monitoring`, `exec-actuals-capture`, `exec-feedback-to-planning`

### Deleted

- Chapter directory: `src/content/chapters/sop-03-sop-process-steps/`
- Layout file: `src/layouts/ProcessStepsLayout.astro`

## Layout — ProcessStepDetailLayout.astro

Single-step view with no tabs or JS step switching. Props beyond `sharedProps`:

```typescript
inputs?: string[];
outputs?: string[];
roles?: string[];    // reuses existing TopicMeta field
systems?: string[];
tasks?: string[];
```

Visual structure:
1. Header: back link → module, chapter breadcrumb, theme toggle
2. Hero: chapter badge, topic title, description
3. Body: inputs/outputs two-column grid, roles (indigo) + systems (rose) tags two-column, numbered task list
4. Footer (fixed bottom): prev/next page nav, mark-complete/unclear progress buttons

Progress tracking via `platform-progress` localStorage + `platform-progress-changed` event, same as all other layouts. No JS beyond progress tracking.

## Topic frontmatter (new format)

```yaml
title: Data Collection & Cleansing
description: "..."
topicLayout: process-step-detail
inputs:
  - ...
outputs:
  - ...
roles:
  - ...
systems:
  - ...
tasks:
  - ...
```

## TypeScript (TopicMeta)

Remove: `processSteps?: Array<{...}>` and its `getTopics()` mapping.  
Add: `inputs`, `outputs`, `systems`, `tasks` (all `string[] | undefined`).  
`roles?: string[]` already exists — no change.
