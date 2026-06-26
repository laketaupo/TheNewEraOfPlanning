# Site Structure Reorganisation — Design Spec

**Date:** 2026-06-26  
**Scope:** Structural reorganisation only — no new topic content. Existing chapters are reassigned to new modules. New chapter slots become `comingSoon: true` stubs (visible in nav, no topic files).

---

## 1. Overview

The four pillars (People, Process, Data, Technology/Tool) are being restructured to match a new content outline. The URL hierarchy remains **`/{theme}/{module}/{chapter}/{topic}`**. Theme slugs in code are unchanged. Module slugs are replaced. Existing chapter folder names and topic files are unchanged.

The key changes per pillar:

| Pillar | Old module count | New module count |
|---|---|---|
| People | 3 | 4 |
| Process | 5 | 6 |
| Data | 3 | 6 |
| Technology | 5 | 6 |

---

## 2. New Module Structure

### People (`theme: "people"`)

| Slug | Display name |
|---|---|
| `roles-and-responsibilities` | Roles & Responsibilities |
| `decision-making-and-ownership` | Decision Making & Ownership |
| `collaboration-and-ways-of-working` | Collaboration & Ways of Working |
| `capabilities-and-skills` | Capabilities & Skills |

### Process (`theme: "process"`)

| Slug | Display name |
|---|---|
| `planning-fundamentals` | Planning Fundamentals |
| `planning-cycles-and-governance` | Planning Cycles & Governance |
| `sop` | S&OP |
| `soe` | S&OE |
| `execution` | Execution |
| `advanced-planning` | Advanced Planning |

### Data (`theme: "data"`)

| Slug | Display name |
|---|---|
| `data-foundations` | Data Foundations |
| `planning-data-domains` | Planning Data Domains |
| `planning-parameters-and-assumptions` | Planning Parameters & Assumptions |
| `signals-and-insights` | Signals & Insights |
| `performance-and-measurement` | Performance & Measurement |
| `data-quality-and-governance` | Data Quality & Governance |

### Technology (`theme: "technology"`)

Theme slug and URLs stay `technology/`. Display label may update to "Tool" separately.

| Slug | Display name | Notes |
|---|---|---|
| `tool-landscape` | Tool Landscape & Architecture | Replaces `architecture` |
| `planning-software` | Planning Software | Unchanged |
| `erp` | ERP | Unchanged |
| `fms` | Farm Management System | Slug kept; display label updates |
| `mdm` | MDM | Unchanged |
| `adoption-and-usage-quality` | Adoption & Usage Quality | New |

---

## 3. Existing Chapter Reassignments

`_meta.json` `module` (and occasionally `theme`) fields are updated. Chapter folder names and topic files are not touched.

### People

| Chapter folder | Old module | New module |
|---|---|---|
| `people-01-planning-team` | `organisation` | `roles-and-responsibilities` |
| `people-04-roles-overview` | `roles-and-responsibilities` | `roles-and-responsibilities` *(no change needed — slug already matches)* |
| `people-02-accountability` | `organisation` | `decision-making-and-ownership` |
| `people-03-planning-cadences` | `organisation` | `collaboration-and-ways-of-working` |

### Process

| Chapter folder | New module |
|---|---|
| `process-03-operating-model` | `planning-fundamentals` |
| `sop-01-sop-fundamentals` | `planning-cycles-and-governance` |
| `soe-01-soe-fundamentals` | `planning-cycles-and-governance` |
| `process-04-planning-policy` | `planning-cycles-and-governance` |
| `process-05-governance-and-escalation` | `planning-cycles-and-governance` |
| `sop-02-running-sop` | `sop` |
| `sop-demand-forecasting` | `sop` |
| `sop-supply-planning` | `sop` |
| `sop-inventory-planning` | `sop` |
| `sop-resource-planning` | `sop` |
| `sop-sop-review` | `sop` |
| `soe-02-running-soe` | `soe` |
| `soe-demand-monitoring` | `soe` |
| `soe-supply-monitoring` | `soe` |
| `soe-exception-management` | `soe` |
| `soe-integrated-review` | `soe` |
| `exec-01-execution-fundamentals` | `execution` |
| `exec-02-daily-execution` | `execution` |
| `exec-order-prioritisation` | `execution` |
| `exec-execution-monitoring` | `execution` |
| `exec-actuals-capture` | `execution` |
| `exec-feedback-to-planning` | `execution` |
| `process-01-scenario-planning-fundamentals` | `advanced-planning` |
| `process-02-running-scenarios` | `advanced-planning` |

**Cross-pillar move:** `process-06-kpis` moves to `theme: "data"`, `module: "performance-and-measurement"`. Both `theme` and `module` fields in its `_meta.json` change. Its topics (kpi-framework-overview, key-planning-kpis, kpi-ownership-and-review, kpis-and-exception-management) are unchanged.

### Data

| Chapter folder | New module |
|---|---|
| `data-01-planning-data-fundamentals` | `data-foundations` |
| `data-03-data-types` | `data-foundations` |
| `data-04-data-governance` | `data-foundations` |
| `data-05-data-sources-and-model` | `data-foundations` |
| `data-02-data-quality-and-impact` | `data-quality-and-governance` |

### Technology

| Chapter folder | Old module | New module |
|---|---|---|
| `arch-01-end-to-end` | `architecture` | `tool-landscape` |
| `arch-02-integration` | `architecture` | `tool-landscape` |

All other technology chapters (`01-understanding-basics` through `05-navigation-and-ui`, `08-configuration-manual`, `99-layout-showcase`, `erp-*`, `fms-*`, `mdm-*`) stay in their current modules — no `_meta.json` change needed.

---

## 4. New Stub Chapters (~61 total)

Each stub is a folder with only `_meta.json`. Fields: `title`, `description` (placeholder), `icon`, `color`, `theme`, `module`, `"comingSoon": true`. No topic `.md` files.

### People stubs

**`roles-and-responsibilities`**
`demand-planner`, `supply-planner`, `production-planner`, `master-planner`, `sales`, `operations`, `finance`, `management`, `subject-matter-expert`

**`decision-making-and-ownership`**
`decision-rights`, `decision-frameworks`, `escalation-behaviour`, `ownership-of-planning-decisions`

**`collaboration-and-ways-of-working`**
`collaboration-model`, `planning-meeting-behaviour`, `stakeholder-alignment`, `communication-standards`

**`capabilities-and-skills`**
`planning-capabilities`, `data-literacy`, `decision-making-skills`, `continuous-improvement-mindset`

### Process stubs

**`planning-fundamentals`**
`planning-horizons`, `integrated-planning-concept`, `decision-flow-overview`

**`planning-cycles-and-governance`**
`planning-cadence`, `meeting-structure`

**`sop`**
`product-lifecycle-planning`

**`soe`**
`master-production-scheduling`, `rough-cut-capacity-planning`, `material-planning`, `atp`

**`execution`**
`lot-selection`

**`advanced-planning`**
`exception-management`, `constraint-management`

### Data stubs

**`planning-data-domains`**
`forecast-data`, `inventory-data`, `capacity-data`, `supply-and-production-data`, `lifecycle-data`

**`planning-parameters-and-assumptions`**
`planning-parameters`, `scenario-assumptions`, `forecast-assumptions`, `business-rules`

**`signals-and-insights`**
`demand-signals`, `supply-signals`, `inventory-signals`, `capacity-signals`, `exception-signals`

**`performance-and-measurement`**
`kpi-definitions`, `kpi-interpretation`, `root-cause-analysis`, `performance-dashboards`

**`data-quality-and-governance`**
`common-data-issues`, `data-validation-routines`, `impact-of-poor-data`

### Technology stubs

**`tool-landscape`**
`tool-landscape-overview`, `system-roles`

**`adoption-and-usage-quality`**
`common-tool-mistakes`, `best-practices`, `tool-usage-by-role`, `faq-and-troubleshooting`

---

## 5. Coming-Soon UI Mechanism

### Data model
Add optional `"comingSoon": true` to `_meta.json`. The `getChapters()` loader in `chapters.ts` must be updated to read and expose this field on the chapter type.

### Chapter cards on module index pages
When `ch.comingSoon === true`:
- Card renders without an `<a>` link (non-clickable)
- Shows a "Coming soon" badge in place of topic count / progress indicator
- Muted visual treatment (e.g., reduced opacity or greyed title) to distinguish from active chapters

### Exclusions for `comingSoon` chapters
- `getAdjacentTopics` — skip (no topics to navigate to/from)
- `UserDashboard` progress list — skip
- `RoleMatrix` — skip
- Pagefind search index — no action needed (no topic files = no indexed content)
- `[chapter]/index.astro` — if a chapter has `comingSoon: true` and no topics, render a visible "Coming soon" page with the chapter title, a brief "content coming soon" message, and a back-link to the module. Not a 404.

---

## 6. Routing & Navigation

### New module index pages to create

Pattern: copy the closest existing sibling page and update the module slug and display label.

**People**
- `src/pages/people/roles-and-responsibilities/index.astro`
- `src/pages/people/decision-making-and-ownership/index.astro`
- `src/pages/people/collaboration-and-ways-of-working/index.astro`
- `src/pages/people/capabilities-and-skills/index.astro`

**Process**
- `src/pages/process/planning-fundamentals/index.astro`
- `src/pages/process/planning-cycles-and-governance/index.astro`
- `src/pages/process/sop/index.astro`
- `src/pages/process/soe/index.astro`
- `src/pages/process/execution/index.astro`
- `src/pages/process/advanced-planning/index.astro`

**Data**
- `src/pages/data/data-foundations/index.astro`
- `src/pages/data/planning-data-domains/index.astro`
- `src/pages/data/planning-parameters-and-assumptions/index.astro`
- `src/pages/data/signals-and-insights/index.astro`
- `src/pages/data/performance-and-measurement/index.astro`
- `src/pages/data/data-quality-and-governance/index.astro`

**Technology**
- `src/pages/technology/tool-landscape/index.astro` (replaces `architecture/`)
- `src/pages/technology/adoption-and-usage-quality/index.astro`

### Old module pages to delete or replace

- `src/pages/people/roles-and-responsibilities/index.astro` — **update in place** (slug reused; page content changes to list new chapters)
- Delete: `src/pages/people/organisation/`, `src/pages/people/implementation-and-change/`
- Delete: `src/pages/process/process-fundamentals/`, `src/pages/process/scenario-planning/`, `src/pages/process/sop-process/`, `src/pages/process/soe-process/`, `src/pages/process/execution-process/`
- Delete: `src/pages/data/data-fundamentals/`, `src/pages/data/data-driven-planning/`, `src/pages/data/data-governance/`
- Delete: `src/pages/technology/architecture/` (replaced by `tool-landscape/`)

### `moduleBackMap` — `src/pages/[theme]/[module]/[chapter]/index.astro`

Add entries for all new module slugs. Remove old module slug entries.

### `moduleLabels` — `src/components/SiteOverlay.astro`

Add entries for all new module slugs. Remove old entries.

### Pillar index pages

Update the module card lists on `/people`, `/process`, `/data`, `/technology` index pages to reflect new module slugs and display names.

### `order.json`

Full replacement of the `modules` and `chapters` keys to reflect new structure. Topic arrays within existing chapters are unchanged.

---

## 7. What Is Not Changing

- Theme slugs (`people`, `process`, `data`, `technology`) — no URL changes at the pillar level
- All existing chapter folder names and topic `.md` files
- Topic content, frontmatter, and `topicLayout` values
- Role JSON files under `src/content/roles/`
- Learning phases (`learning-phases.json`)
- Glossary, FAQ, configuration manual
- `localStorage` keys and progress data format
- CI/CD pipeline
