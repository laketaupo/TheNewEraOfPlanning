# Process Flow Visualization — Design Spec

**Date:** 2026-06-07  
**Pillar:** Process  
**Status:** Approved

---

## Context

The Process pillar needs an interactive way to communicate the full business process framework (L1–L4 hierarchy). Learners need to explore the structure at their own pace, drilling from high-level domains down to individual process steps. This is a foundational reference that lives in its own dedicated chapter rather than being buried inside a conceptual or how-to chapter.

---

## What We're Building

A new Process pillar chapter — **"Process Framework"** — containing a single interactive topic. The topic renders a full-width drill-down visualization: horizontal pill nodes connected by arrows, breadcrumb navigation across four hierarchy levels, and a floating modal detail pane at L4.

---

## Data

**File:** `src/data/process-flow.csv`

One row per L4 process step. Eight columns:

```
l1,l1Description,l2,l2Description,l3,l3Description,l4,l4Description
Plan,"Establish demand and supply plans...",Demand Planning,"Translate market signals...","Statistical Forecasting","Use historical data to generate...","Run Forecast Model","Execute the statistical algorithm..."
```

A realistic sample (~20 rows) ships with the implementation. The user replaces it with real data by dropping in the actual CSV — no code changes needed.

**Parsing:** Imported as a raw string at build time using Vite's `?raw` suffix (`import rawCsv from '../../data/process-flow.csv?raw'`), split on newlines, headers stripped, rows mapped to typed objects. No external CSV library — the format is simple enough for manual parsing.

---

## Site Structure

| What | Path |
|---|---|
| Chapter metadata | `src/content/chapters/process-03-process-framework/_meta.json` |
| Topic file | `src/content/chapters/process-03-process-framework/01-process-flow.md` |
| Widget component | `src/components/sim/ProcessFlowWidget.astro` |
| Sample data | `src/data/process-flow.csv` |
| Router wire-up | `src/pages/chapters/[chapter]/[topic].astro` |

**Chapter metadata** (`_meta.json`):
```json
{
  "title": "Process Framework",
  "description": "Explore the end-to-end process hierarchy — from high-level domains down to individual process steps.",
  "icon": "network",
  "color": "violet",
  "order": 3,
  "pillar": "process"
}
```

**Topic frontmatter** (`01-process-flow.md`):
```yaml
title: "Process Flow"
description: "Navigate the full L1–L4 process hierarchy interactively."
order: 1
chapter: "process-03-process-framework"
estimatedMinutes: 5
widget: "process-flow"
topicLayout: "full-widget"
```

---

## UI Behaviour

### Navigation model — breadcrumb drill-down

- **Default (L1 view):** All unique L1 values rendered as violet pill nodes, connected left-to-right by arrow connectors. Horizontally scrollable if overflow.
- **Click L1 node:** Breadcrumb gains the L1 label; view replaces with L2 nodes filtered to that L1.
- **Click L2 node:** Breadcrumb grows; view replaces with L3 nodes filtered to that L1 + L2.
- **Click L3 node:** View replaces with L4 nodes filtered to L1 + L2 + L3.
- **Click breadcrumb segment:** Navigates back to that level (clears deeper selection state).

### L4 detail — floating modal

- Clicking an L4 node opens a modal overlay.
- Modal shows: node name (heading) + L4 description (body).
- Dismissed by clicking ✕ or anywhere outside the modal.
- Background nodes are dimmed (opacity reduced) while modal is open.

### Node descriptions (L1–L3)

- Shown as a tooltip on hover — keeps the flow layout uncluttered.
- Tooltip appears above the node with the level's description text.

### Visual style

- Node shape: rounded pill (`border-radius: 9999px`), matching site button aesthetic.
- Active / selected node: violet background (`bg-violet-600`), white text.
- Inactive nodes: dark surface (`bg-slate-800`), muted text, slate border.
- Connectors: short horizontal line + `▶` arrowhead, violet for active path, slate for inactive.
- Dark mode: fully supported via Tailwind `dark:` classes and `document.documentElement.classList.contains('dark')` checks in JS.
- Color source: violet (Process pillar color), consistent with `chapterColor` prop passed from layout.

---

## Component Architecture

**`ProcessFlowWidget.astro`**

- Imports and parses `process-flow.csv` at build time.
- Renders an HTML container (flexbox pill layout — no SVG needed).
- Inline `<script>` block manages all state: current level, selected L1/L2/L3 values, active modal.
- No external JS dependencies.
- Follows the same vanilla-JS + DOM pattern as `InteractiveGraph.astro` and `StepWalkthrough.astro`.

**State (in script scope):**
```js
let level = 1;           // 1–4
let selected = {         // path selected so far
  l1: null,
  l2: null,
  l3: null
};
let activeModal = null;  // L4 row object or null
```

**Render cycle:** A single `render()` function clears and rebuilds the node row and breadcrumb on every state change.

---

## Router Wire-up

In `src/pages/chapters/[chapter]/[topic].astro`, add to the widget slot:

```astro
{topic.widget === 'process-flow' && <ProcessFlowWidget />}
```

Import: `import ProcessFlowWidget from '../../../components/sim/ProcessFlowWidget.astro'`

---

## Verification

1. Run `npm run dev` — navigate to the Process pillar, open the "Process Framework" chapter, and confirm the topic renders.
2. Verify L1 nodes appear horizontally connected.
3. Click an L1 node — confirm breadcrumb updates and L2 nodes appear.
4. Drill to L4 — confirm modal opens with correct description.
5. Click ✕ and click outside modal — confirm both dismiss correctly.
6. Click a breadcrumb segment — confirm navigation back works.
7. Toggle dark mode — confirm all colors adapt correctly.
8. Run `npm run build` — confirm no build errors.
