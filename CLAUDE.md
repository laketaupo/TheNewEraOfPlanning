# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev      # Start dev server at http://localhost:4321
npm run build    # Build to dist/ — always run this to verify before considering a task done
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
| `data` | `data-driven-planning` |
| `process` | `scenario-planning` |
| `people` | `people-and-planning` |

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
- `src/lib/configuration.ts` — loads configuration manual entries.
- `src/lib/roles.ts` — loads role JSON files; `resolveRoleSections()` validates and hydrates topic references.

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
| `/{pillar}/{module}` (data/process/people) | `src/pages/{pillar}/{module}/index.astro` |
| `/{pillar}/{module}/{chapter}/` | `src/pages/[pillar]/[module]/[chapter]/index.astro` |
| `/{pillar}/{module}/{chapter}/{topic}` | `src/pages/[pillar]/[module]/[chapter]/[topic].astro` |
| `/roles/{role}` | `src/pages/roles/[role].astro` |

The module index pages for Technology each filter `getChapters('technology')` by `ch.module === '{module-slug}'`. The dynamic `[pillar]/[module]/[chapter]/` pages handle all pillars generically.

### Key Patterns

**`moduleBackMap`** — used in `[chapter]/index.astro` to resolve the back-link for each module. When adding a new module, add an entry here:

```typescript
const moduleBackMap: Record<string, { href: string; label: string }> = {
  'planning-software': { href: `${BASE_URL}technology/planning-software`, label: 'Planning Software' },
  'erp':              { href: `${BASE_URL}technology/erp`,                label: 'ERP' },
  // ... all modules must be listed
};
```

**`moduleLabels`** — used in `SiteOverlay.astro` to map module slugs to display names. Must be kept in sync with `moduleBackMap`.

**Layout prop flow** — `[topic].astro` builds a `sharedProps` object passed to whichever layout is selected. All layouts accept:
```
title, description, chapterTitle, chapterSlug, chapterColor, chapterUrl,
topicOrder, chapterOrder, prevUrl, nextUrl, prevTitle, nextTitle,
pillar, totalTopics
```
`pillar` drives the back-link in topic layouts (via a `pillarBackMap` inside each layout that maps pillar → module URL). **Note:** topic layouts currently map all `technology` topics back to Planning Software — ERP/Architecture/MDM/FMS topics inherit this; it's a known gap.

**Tailwind class safety** — color-specific classes must appear as complete strings in source. Never build them with string interpolation (e.g. `` `bg-${color}-500` ``) — Tailwind will purge them. Use lookup maps (`colorBgMap`, `colorTextMap`, etc.) defined inline per page.

### Dark Mode & Persistence

- Dark mode: class-based (`darkMode: 'class'`). `ThemeToggle` toggles `.dark` on `<html>` and persists to `localStorage` key `o9-theme`. `BaseLayout` applies it before first render to prevent flash.
- Progress tracking: client-side only, `localStorage` key `o9-progress` as `{ [topicId]: boolean }`. Topic IDs: `ch{chapterOrder}-t{topicOrder}`. Chapter orders restart per module, so IDs can collide across modules — this is existing behaviour.

### Adding Content

**New topic:** add `NN-slug.md` in the relevant chapter folder. Set `topicLayout` to one of the valid values above.

**New chapter in an existing module:** create `src/content/chapters/<slug>/` with `_meta.json` (including `pillar` and `module`) and topic files. No routing changes needed — the dynamic `[pillar]/[module]/[chapter]/` route picks it up automatically.

**New module in Technology:** also create `src/pages/technology/{module}/index.astro`, add a card to `src/pages/technology/index.astro`, and add the module to `moduleBackMap` in `[chapter]/index.astro` and `moduleLabels` in `SiteOverlay.astro`.

**New role course:** add `src/content/roles/{slug}.json`. Topic references use `"chapter-slug/topic-slug"` format; bad refs throw at build time.
