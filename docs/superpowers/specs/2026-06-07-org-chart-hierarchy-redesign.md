# Org Chart Hierarchy Redesign

**Date:** 2026-06-07  
**Pillar:** People  
**File:** `src/content/chapters/people-01-planning-team/03-the-planning-org-chart.md`

---

## Summary

Extend the planning org chart with two new senior roles (Supply Director and Head of Supply Chain) above the existing S&OP Lead, remove the cross-functional section, and rebuild the widget with per-level color coding and hover tooltips replacing the click-to-detail-panel interaction.

---

## 1. Data Changes

### New nodes

**Supply Director** (new root)

- `id`: `supply-director`
- `title`: Supply Director
- `description`: Owns supply chain strategy and organisational performance at the senior leadership level.
- `responsibilities`:
  - Set supply chain strategy aligned to business objectives
  - Own supply chain investment decisions and performance targets
  - Represent supply chain at executive and board level
  - Build and develop leadership capability across the function
  - Drive transformation and continuous improvement agenda
- `competencies`:
  - Strategic leadership and vision
  - Financial acumen and P&L ownership
  - Executive stakeholder management
  - Organisational development
  - Deep supply chain expertise
- `children`: `[head-of-supply-chain]`

**Head of Supply Chain** (level 2)

- `id`: `head-of-supply-chain`
- `title`: Head of Supply Chain
- `description`: Translates strategic direction into operational planning and execution.
- `responsibilities`:
  - Translate business strategy into supply chain plans and KPIs
  - Oversee integrated planning across demand, supply, and inventory
  - Drive cross-functional alignment between supply chain, commercial, and finance
  - Manage the planning leadership team and develop talent
  - Report supply chain performance to the Supply Director
- `competencies`:
  - Integrated business planning
  - Cross-functional leadership
  - Performance management and KPIs
  - Change management
  - Supply chain operations knowledge
- `children`: `[sop-lead]`

### Removals

- The `crossFunctional` section (Finance Business Partner, Commercial Lead) is removed entirely from the frontmatter.

### Full hierarchy after changes

```
Supply Director (amber)
└── Head of Supply Chain (violet)
    └── S&OP Lead (indigo)
        ├── Demand Planning Manager (sky)
        │   └── Demand Planner (emerald)
        ├── Supply Planning Manager (sky)
        │   └── Supply Planner (emerald)
        └── Planning Analyst (sky)
```

---

## 2. Visual Design

### Color per tier

| Depth | Role(s) | Tailwind color |
|---|---|---|
| 0 | Supply Director | `amber` |
| 1 | Head of Supply Chain | `violet` |
| 2 | S&OP Lead | `indigo` |
| 3 | Demand Planning Manager, Supply Planning Manager, Planning Analyst | `sky` |
| 4 | Demand Planner, Supply Planner | `emerald` |

Each card uses:
- A colored left border (`border-l-4 border-{color}-500`)
- A light background tint (`bg-{color}-50 dark:bg-{color}-500/10`)
- Matching text accent for the title (`text-{color}-900 dark:text-{color}-100`)
- All cards are the same size

Color classes must be written as full strings (no interpolation) to avoid Tailwind purging.

### Layout

- Top-down tree, same CSS connector technique as the current implementation
- No cross-functional section

---

## 3. Interaction

### Desktop — hover tooltip

- Hovering a card shows a floating tooltip positioned below (or above if near viewport bottom)
- Tooltip contains:
  - Role title (bold)
  - Description (one line, muted)
  - Responsibilities (labeled list)
  - Competencies (labeled list)
- Tooltip is implemented in vanilla JS (no library): `mouseover` / `mouseleave` on each `.org-node` button; a single shared `<div id="org-tooltip">` is positioned absolutely relative to the page using `getBoundingClientRect()` + `window.scrollY`
- The existing click-to-detail side panel is removed entirely

### Mobile — accordion fallback

- `<details>` / `<summary>` accordion pattern (unchanged from current implementation)
- Shows title, description, responsibilities, competencies inline
- Tooltip is not shown on mobile (touch devices don't have hover)

---

## 4. Components Changed

### `src/content/chapters/people-01-planning-team/03-the-planning-org-chart.md`
- Add `supply-director` and `head-of-supply-chain` nodes
- Remove `crossFunctional` block

### `src/components/widgets/OrgTreeNode.astro`
- Accept a `depth: number` prop
- Apply tier color classes via a lookup array (full class strings, not interpolated)
- Pass `depth + 1` to child `OrgTreeNode` instances

### `src/components/widgets/OrgChart.astro`
- Remove cross-functional section (markup, data serialization, mobile accordion entries)
- Remove detail panel markup (`<aside>`, `[data-detail-panel]`, etc.)
- Add shared tooltip `<div>` to the DOM
- Rewrite client `<script>`: replace click-select logic with `mouseover` / `mouseleave` tooltip logic
- Pass `depth={0}` to the root `OrgTreeNode`

---

## 5. Out of Scope

- No changes to other topic pages, layouts, or pillar pages
- No routing changes
- No new content collections or lib functions
- No animation or transition effects beyond what Tailwind provides
