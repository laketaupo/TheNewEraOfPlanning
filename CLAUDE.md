# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev      # Start dev server at http://localhost:4321
npm run build    # Build to .vercel/output/static/ — always run this to verify before considering a task done
npm run preview  # Preview the built site
```

No tests or linters are configured.

## Architecture

**Stack:** Astro 4 (static site generation) + Tailwind CSS 3 + MDX. Deployed via Vercel (`@astrojs/vercel/static` adapter, v7.x — compatible with Astro 4).

### Site Structure

A four-pillar learning hub (Technology, Process, Data, People). Each pillar has one or more **modules**, each module has one or more **chapters**, each chapter has one or more **topics**. The full URL shape is:

```
/{pillar}/{module}/{chapter-slug}/{topic-slug}
```

Current modules per pillar:

| Pillar | Modules |
|---|---|
| `technology` | `planning-software`, `erp`, `architecture`, `mdm`, `fms` |
| `data` | `data-fundamentals`, `data-driven-planning`, `data-governance` |
| `process` | `scenario-planning`, `sop-process`, `soe-process`, `execution-process`, `process-foundations` |
| `people` | `organisation-and-roles`, `implementation-and-change` |

The Configuration Manual (`/technology/configuration`) is a separate content type surfaced via the Planning Software module page — it does not use the pillar/module/chapter/topic system.

### Content Model

**Chapter content** lives in `src/content/chapters/<chapter-slug>/`:
- `_meta.json` — chapter metadata. Required fields: `title`, `description`, `icon`, `color`, `order`, `pillar`, `module`. Optional: `hidden` (bool).
- `NN-topic-slug.md` — one file per topic, frontmatter-heavy.

Both `pillar` and `module` are required in every `_meta.json`. Omitting either causes silently wrong behaviour (pillar defaults to `'technology'`, module defaults to `'planning-software'`).

`99-layout-showcase/` is a hidden dev-reference chapter (`"hidden": true`) — included in builds, invisible in nav.

**Topic frontmatter** — the key field is `topicLayout`, which selects the layout component:

| `topicLayout` value | Layout used |
|---|---|
| `node-topic` | `NodeTopicLayout.astro` — network node diagram with summary + bullets |
| `card-grid` | `CardGridLayout.astro` — card-based comparison |
| `comparison` | `ComparisonLayout.astro` — left/right two-column |
| `data-table` | `DataTableLayout.astro` — tabular data |
| `full-widget` | `FullWidthWidgetLayout.astro` — interactive simulation |
| `rasci-table` | `RasciTableLayout.astro` — RASCI responsibility matrix |
| `ui-training` | `UiTrainingLayout.astro` — full-viewport screenshot + description + static steps sidebar |
| `prose-topic` or omitted | `TopicLayout.astro` — generic prose + optional widget |

**Configuration manual** lives in `src/content/configuration/` — one `.md` per screen with frontmatter fields `title`, `description`, `order`, `screenshot` (path under `/public/configuration/`).

**Roles** live in `src/content/roles/<slug>.json` — defines role-based courses as a list of `"chapter-slug/topic-slug"` references. Bad references throw at build time via `resolveRoleSections()`.

### Data Loading

Content is loaded via `import.meta.glob` (not Astro content collections):

- `src/lib/chapters.ts` — eagerly loads all `_meta.json` and topic frontmatter.
  - `getChapters(pillar?)` — all chapters, optionally filtered by pillar
  - `getTopics()` — all topics, each with derived `pillar`, `module`, `url`, `chapterUrl`
  - `getTopicsForChapter(slug)` — topics for one chapter
  - `getAdjacentTopics(url)` — `[prev, next]` scoped to same pillar
  - `getChapterUrl(ch)` — builds `/{pillar}/{module}/{slug}`
  - `getPillars()` — ordered list of pillars from `order.json`
  - `getModulesForPillar(pillar)` — ordered module list for a pillar from `order.json`
- `src/lib/configuration.ts` — loads configuration manual entries.
- `src/lib/roles.ts` — loads role JSON files; `resolveRoleSections()` validates and hydrates topic references.

**`src/content/order.json`** is the authoritative source for ordering. It defines `pillars` (array), `modules` (per-pillar arrays), `chapters` (per-module arrays), and `topics` (per-chapter arrays). The `order` field in `_meta.json` and the `NN-` numeric prefix in topic filenames are both overridden by this file — items not listed in `order.json` get order index 9999 and sort to the end. **When adding a new chapter or topic, register it in `order.json` to control its position.**

### Routing

| Route pattern | File |
|---|---|
| `/` | `src/pages/index.astro` |
| `/start` | `src/pages/start.astro` (redirects to first topic) |
| `/technology`, `/data`, `/process`, `/people` | `src/pages/{pillar}/index.astro` |
| `/technology/planning-software` | `src/pages/technology/planning-software/index.astro` |
| `/technology/erp` | `src/pages/technology/erp/index.astro` |
| `/technology/architecture` | `src/pages/technology/architecture/index.astro` |
| `/technology/mdm` | `src/pages/technology/mdm/index.astro` |
| `/technology/fms` | `src/pages/technology/fms/index.astro` |
| `/technology/configuration` | `src/pages/technology/configuration/index.astro` |
| `/data/data-fundamentals`, `/data/data-driven-planning`, `/data/data-governance` | `src/pages/data/{module}/index.astro` |
| `/{pillar}/{module}` (process/people) | `src/pages/{pillar}/{module}/index.astro` |
| `/{pillar}/{module}/{chapter}/` | `src/pages/[pillar]/[module]/[chapter]/index.astro` |
| `/{pillar}/{module}/{chapter}/{topic}` | `src/pages/[pillar]/[module]/[chapter]/[topic].astro` |
| `/roles/{role}` | `src/pages/roles/[role].astro` |

The module index pages for Technology each filter `getChapters('technology')` by `ch.module === '{module-slug}'`. The dynamic `[pillar]/[module]/[chapter]/` pages handle all pillars generically.

### Key Patterns

**`moduleBackMap`** — maps module slug → back-link href/label. Defined **inline in every topic layout file** (all 7 layouts in `src/layouts/`) and also in `src/pages/[pillar]/[module]/[chapter]/index.astro`. When adding a new module, add an entry to all of these plus `moduleLabels` in `SiteOverlay.astro`.

**`moduleLabels`** — used in `SiteOverlay.astro` to map module slugs to display names. Must be kept in sync with the `moduleBackMap` entries across layout files.

**Layout prop flow** — `[topic].astro` builds a `sharedProps` object passed to whichever layout is selected. All layouts accept:
```
title, description, chapterTitle, chapterSlug, chapterColor, chapterUrl,
topicOrder, chapterOrder, prevUrl, nextUrl, prevTitle, nextTitle,
pillar, totalTopics
```
`pillar` drives the back-link in topic layouts (via a `moduleBackMap` inside each layout). **Note:** topic layouts currently map all `technology` topics back to Planning Software — ERP/Architecture/MDM/FMS topics inherit this; it's a known gap.

**Tailwind class safety** — color-specific classes must appear as complete strings in source. Never build them with string interpolation (e.g. `` `bg-${color}-500` ``) — Tailwind will purge them. Use lookup maps (`colorBgMap`, `colorTextMap`, etc.) defined inline per page.

### Client-Side Persistence

Two `localStorage` keys:

- **`platform-theme`** — `'dark'` or absent. `ThemeToggle.astro` writes it; `BaseLayout.astro` reads it inline before first render to prevent flash.
- **`platform-progress`** — `{ [topicId]: 'complete' | 'unclear' }`. Topic IDs are `{chapterSlug}/{topicSlug}` (same format as role references). Chapter slugs are globally unique content-folder names and topic slugs are unique within a chapter, so IDs never collide across modules. This id is derived identically everywhere that reads/writes the store: the topic layouts, `UserDashboard.astro`, `roles.ts` (`topicId`), and the chapter/module index pages. Legacy values of `true` (boolean) are migrated to `'complete'` on read.

### Components

All shared components live in `src/components/`:

- **`SiteOverlay.astro`** — full-site navigation palette, toggled by pressing `O`. Added to `BaseLayout`.
- **`UserDashboard.astro`** — progress dashboard panel (slides in from right), toggled by a fixed person-icon button at `top-3 right-16`. Shows per-chapter completion bars, overall stats, and a list of topics marked unclear. Added to `BaseLayout`. Listens for the `platform-progress-changed` custom window event dispatched by topic layout scripts after each state change.
- **`ThemeToggle.astro`** — light/dark toggle button, included individually in each layout and pillar index page.
- **`src/components/sim/`** — interactive simulation components (demand/supply flow graphs, demand shock sim, slicing/disaggregation widgets, step walkthrough). Used by the `full-widget` layout and embedded in topic prose.
- **`src/components/widgets/`** — `OrgChart.astro` and `OrgTreeNode.astro`, used by the org-chart frontmatter field on people-pillar topics.

### Adding Content

**New topic:** add `NN-slug.md` in the relevant chapter folder. Set `topicLayout` to one of the valid values above. Register the topic slug in `src/content/order.json` under the chapter key to control its position.

**New chapter in an existing module:** create `src/content/chapters/<slug>/` with `_meta.json` (including `pillar` and `module`) and topic files. Register the chapter slug in `src/content/order.json` under the module key. No routing changes needed — the dynamic `[pillar]/[module]/[chapter]/` route picks it up automatically.

**New module in Technology:** also create `src/pages/technology/{module}/index.astro`, add a card to `src/pages/technology/index.astro`, and add the module to `moduleBackMap` in all 7 topic layout files and in `[chapter]/index.astro`, plus `moduleLabels` in `SiteOverlay.astro`.

**New role course:** add `src/content/roles/{slug}.json`. See the Role JSON structure and phase guidance below.

### Role JSON Structure

Each role JSON file at `src/content/roles/{slug}.json` has these fields:

```json
{
  "title": "Role Display Name",
  "description": "One-sentence description shown on the role card and course page.",
  "icon": "icon-name",
  "color": "teal",
  "order": 10,
  "department": "Supply Chain",
  "comingSoon": true,
  "phases": [
    { "phaseId": "awareness",    "chapters": ["chapter-slug-1", "chapter-slug-2"] },
    { "phaseId": "conceptual",   "chapters": ["chapter-slug-3"] },
    { "phaseId": "practical",    "chapters": ["chapter-slug-4"] },
    { "phaseId": "embedded",     "chapters": [] },
    { "phaseId": "optimization", "chapters": [] }
  ]
}
```

- `comingSoon: true` hides the role from the learning paths (omit when the role is ready).
- Phases with an empty `chapters` array (or absent from the array) render as "Coming soon" on the role page.
- Phase order in the JSON does not matter — phases always display in the global order defined in `learning-phases.json`.
- Chapter slugs must exist and must not be hidden — bad references throw at build time.

### Learning Phases

The global phase definitions live in `src/content/learning-phases.json`. There are five phases, in order:

| Phase ID | Title | Purpose |
|---|---|---|
| `awareness` | Awareness & Context Setting | Understand the "why" — high-level overview, what is changing, business drivers |
| `conceptual` | Conceptual Understanding | Understand the "what" — process flows, data objects, tool functionality, RASCI |
| `practical` | Practical Application | Learn the "how" — role-based execution, step-by-step workflows, hands-on tool use |
| `embedded` | Embedded Adoption | Make it business as usual — governance, KPIs, policy, data ownership |
| `optimization` | Optimization & Continuous Improvement | Drive best practice — advanced features, scenario analysis, SME development |

### Chapter-to-Phase Assignment Guide

Use the table below when building or reviewing a role. Chapters not relevant to a role are simply omitted.

**Phase 1 — Awareness** (what exists and why it matters)
- `process-03-operating-model` — S&OP / S&OE / Execution overview
- `people-01-planning-team` — who is in the planning team, high-level roles
- `data-01-planning-data-fundamentals` — why data matters, cost of bad data
- `erp-01-erp-basics` — what ERP is, its place in the system landscape
- `mdm-01-understanding-basics` — what MDM is and why it matters *(for MDM-adjacent roles)*
- `fms-01-understanding-basics` — what FMS is and why it matters *(for field-facing roles)*

**Phase 2 — Conceptual** (what things are and how they connect)
- `sop-01-sop-fundamentals` — S&OP cycle, roles, outputs
- `soe-01-soe-fundamentals` — S&OE cadence, roles, exception-based working
- `exec-01-execution-fundamentals` — execution fundamentals, from plan to action
- `people-02-accountability` — RASCI for demand/supply/exec S&OP reviews
- `01-understanding-basics` — planning software data objects (BOD, BOM, Item, Resource)
- `02-the-network` — the network/graph data model
- `03-data-flow` — demand/supply signals, inventory netting
- `03-the-logic` — push/pull, safety stock, disaggregation, backward consumption
- `data-03-data-types` — master data, transactional data, planning parameters
- `data-02-data-quality-and-impact` — what makes data good enough
- `data-05-data-sources-and-model` — where data comes from, the data model overview
- `erp-02-the-data-model` — how ERP structures master and transactional data
- `erp-03-data-flow-into-erp` — where data originates and how it enters ERP
- `erp-04-data-flow-out-of-erp` — what ERP sends to planning
- `arch-01-end-to-end` — system interfaces overview, batch runs, data upload
- `process-01-scenario-planning-fundamentals` — what scenario planning is, types
- `mdm-02-the-data-model` — MDM data structure *(MDM-adjacent roles)*
- `mdm-03-data-flow-into-mdm` — how master data enters MDM *(MDM-adjacent roles)*
- `mdm-04-data-flow-out-of-mdm` — what MDM sends to planning *(MDM-adjacent roles)*
- `fms-02-the-data-model` — FMS data structure *(field-facing roles)*
- `fms-03-data-flow-into-fms` — how field data enters FMS *(field-facing roles)*
- `fms-04-data-flow-out-of-fms` — what FMS sends to planning *(field-facing roles)*

**Phase 3 — Practical** (how to execute, step by step)
- `sop-02-running-sop` — running demand, supply, and executive S&OP reviews
- `sop-demand-forecasting` — data collection, statistical baseline, commercial overlay
- `sop-supply-planning` — capacity assessment, constrained run, gap identification
- `sop-inventory-planning` — target setting, coverage analysis, safety stock review
- `sop-resource-planning` — resource demand projection, capacity mapping
- `sop-sop-review` — pre-S&OP, financial reconciliation, executive review, plan close
- `soe-02-running-soe` — monitoring the near-term plan, integrated S&OE review
- `soe-demand-monitoring` — demand monitoring process
- `soe-supply-monitoring` — supply monitoring process
- `soe-exception-management` — exception identification and resolution
- `soe-integrated-review` — integrated S&OE review steps
- `exec-02-daily-execution` — order prioritisation, real-time visibility, execution discipline
- `exec-actuals-capture` — capturing actuals
- `exec-order-prioritisation` — order prioritisation workflow
- `exec-execution-monitoring` — monitoring execution
- `exec-feedback-to-planning` — feeding actuals back to planning
- `04-the-simulation` — setting up and running workflow simulations
- `05-navigation-and-ui` — navigating planning software, reading plan output
- `process-02-running-scenarios` — creating, comparing, and promoting scenarios
- `erp-05-the-logic` — ERP business rules, inventory and order management logic
- `erp-06-key-erp-workflows` — creating orders, goods receipt/issue, reporting
- `erp-07-navigation-and-ui` — navigating ERP, reading ERP output
- `mdm-05-the-logic` — MDM governance rules, deduplication, approval workflows *(MDM-adjacent roles)*
- `mdm-06-key-mdm-workflows` — creating/maintaining records, managing changes *(MDM-adjacent roles)*
- `mdm-07-navigation-and-ui` — navigating MDM *(MDM-adjacent roles)*
- `fms-05-the-logic` — FMS business rules, field assignment, yield tracking *(field-facing roles)*
- `fms-06-key-fms-workflows` — managing field activities, recording actuals *(field-facing roles)*
- `fms-07-navigation-and-ui` — navigating FMS *(field-facing roles)*

**Phase 4 — Embedded** (making new ways of working stick)
- `process-04-planning-policy` — safety stock policy, service levels, allocation, prioritisation
- `process-05-governance-and-escalation` — escalation paths, management by exception
- `process-06-kpis` — KPI framework, ownership, review cadence
- `data-04-data-governance` — data ownership, definitions, single source of truth
- `arch-02-integration` — ERP↔Planning Software↔FMS/MDM integration patterns

**Phase 5 — Optimization** (reserved for advanced/SME-level content; often empty for initial role builds)
