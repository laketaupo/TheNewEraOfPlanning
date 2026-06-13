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

**New role course:** add `src/content/roles/{slug}.json`. Topic references use `"chapter-slug/topic-slug"` format; bad refs throw at build time.
