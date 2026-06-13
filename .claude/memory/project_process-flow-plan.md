---
name: process-flow-plan
description: Implementation plan for L1-L4 process flow visualization in the Process pillar — key design decisions
metadata:
  type: project
---

# Process Flow Visualization — Implementation Plan

An interactive L1→L4 drill-down process hierarchy for the Process pillar, driven by a flat CSV file. Design was finalized via brainstorming session.

**Key decisions:**
- New dedicated chapter: `process-03-process-framework` (violet, Process pillar, order 3)
- Single topic: `01-process-flow.md` with `topicLayout: full-widget`, `widget: process-flow`
- Data: `src/data/process-flow.csv` — flat file, one row per L4 step, 8 columns (l1/l1Description/.../l4/l4Description). User will replace sample data with real XLSX export later.
- Navigation: breadcrumb drill-down (click replaces view, breadcrumb shows path back)
- Node style: rounded violet pill nodes with arrow connectors
- L4 detail: floating modal overlay (centered, dismisses on ✕ or outside click)
- L1–L3 descriptions: hover tooltip following mouse cursor
- Component: `src/components/sim/ProcessFlowWidget.astro` — vanilla JS, no external deps, `?raw` CSV import

**Status:** Plan complete, ready to implement on request.
