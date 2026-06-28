# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Working Style

### Parallel Agents
When a task splits into 2 or more independent subtasks, always dispatch parallel agents rather than working sequentially.

### Agent Model Selection
| Task type | Model |
|---|---|
| File reads, searches, simple edits | `claude-haiku-4-5-20251001` |
| Complex implementation, multi-file features | `claude-sonnet-4-6` |
| Planning / design / architecture decisions | `claude-sonnet-4-6` or `claude-opus-4-8` |
| Debugging, code review, cross-file analysis | `claude-sonnet-4-6` |

## Commands

```bash
npm run dev      # Start dev server at http://localhost:4321
npm run build    # Build to dist/ — always run before considering a task done
npm run preview  # Preview the built site
```

`npm run build` runs `astro build` then `pagefind --site dist`. No tests or linters configured.

## Architecture

**Stack:** Astro 4 (static site) + Tailwind CSS 3 + MDX. Deployed to GitHub Pages via CI.

**Base URL:** `astro.config.mjs` sets `base: '/TheNewEraOfPlanning/'`. Always use `import.meta.env.BASE_URL` for internal links — never hardcode `/` as root-relative prefix.

### Site Structure

A four-pillar learning hub. URL shape: `/{theme}/{module}/{chapter-slug}/{topic-slug}`

> **"Pillar" vs "theme":** Product calls them "pillars", code calls them **themes** — in `_meta.json`, `order.json`, function names, URL params, `localStorage`. Always use `theme` in code.

| Pillar | Modules |
|---|---|
| `people` | `roles-and-responsibilities`, `decision-making-and-ownership`, `collaboration-and-ways-of-working`, `capabilities-and-skills` |
| `process` | `planning-fundamentals`, `sop`, `soe`, `execution`, `planning-governance`, `advanced-planning` |
| `data` | `data-foundations`, `planning-data-domains`, `planning-parameters-and-assumptions`, `performance-and-measurement`, `data-quality-and-governance` |
| `technology` | `tool-landscape`, `planning-software`, `erp`, `fms`, `mdm`, `adoption-and-usage-quality` |

### Content Model

**Chapters** live in `src/content/chapters/<chapter-slug>/`:
- `_meta.json` — required fields: `title`, `description`, `icon`, `color`, `theme`, `module`. Omitting `theme`/`module` causes silent wrong behaviour.
- `NN-topic-slug.md` — one file per topic, frontmatter-heavy.

**Topic frontmatter** — `topicLayout` selects the layout:

| `topicLayout` | Layout |
|---|---|
| `node-topic` | Network node diagram |
| `card-grid` | Card-based comparison |
| `comparison` | Left/right two-column |
| `data-table` | Tabular data |
| `full-widget` | Interactive simulation |
| `rasci-table` | RASCI responsibility matrix |
| `ui-training` | Full-viewport screenshot + steps sidebar |
| `process-step-detail` | Step execution with inputs/outputs/roles/systems |
| `prose-topic` or omitted | Generic prose + optional widget |

**`src/content/order.json`** is the authoritative source for ordering (themes, modules, chapters, topics). Always register new chapters/topics here — items not listed sort to the end.

**Roles** live in `src/content/roles/<slug>.json`. Bad chapter references throw at build time.

**Configuration manual** lives in `src/content/configuration/` — separate from the pillar system.

### Data Loading

Content loaded via `import.meta.glob` (not Astro content collections). Key modules:
- `src/lib/chapters.ts` — `getChapters()`, `getTopics()`, `getTopicsForChapter()`, `getAdjacentTopics()`, `getThemes()`, `getModulesForTheme()`
- `src/lib/roles.ts` — `resolveRoleSections()` validates and hydrates topic references
- `src/lib/configuration.ts`, `src/lib/faq.ts`, `src/lib/glossary.ts`

### Routing

Dynamic routes: `src/pages/[theme]/[module]/[chapter]/index.astro` and `[topic].astro` handle all themes generically. Technology and Data modules have dedicated static index pages in `src/pages/technology/` and `src/pages/data/`. Roles: `src/pages/roles/[role].astro` and `[role]/[phase].astro`.

### Key Patterns

**`moduleBackMap`** — maps module slug → back-link. Defined in `src/pages/[theme]/[module]/[chapter]/index.astro`. When adding a new module, also add to `moduleLabels` in `SiteOverlay.astro`.

**Tailwind class safety** — color classes must appear as complete strings. Never use string interpolation (`` `bg-${color}-500` ``) — Tailwind will purge them. Use lookup maps (`colorBgMap`, `colorTextMap`, etc.) inline per page.

**Client-side persistence** — three `localStorage` keys:
- `platform-theme` — `'dark'` or absent
- `platform-progress` — `{ [topicId]: 'complete' | 'unclear' }`. Topic ID = `{chapterSlug}/{topicSlug}`. Legacy `true` values migrate to `'complete'` on read.
- `platform-comments` — `{ [topicId]: string }` per-topic notes

After changes, dispatch `window.dispatchEvent(new CustomEvent('platform-progress-changed'))` so `UserDashboard.astro` re-renders.

### Adding Content

**New topic:** add `NN-slug.md` in the chapter folder, set `topicLayout`, register in `order.json`.

**New chapter:** create `src/content/chapters/<slug>/` with `_meta.json` (include `theme` and `module`), register in `order.json`. Dynamic routing picks it up automatically.

**New module:** create `src/pages/{theme}/{module}/index.astro`, add card to pillar index, add to `moduleBackMap` in `[chapter]/index.astro`, add to `moduleLabels` in `SiteOverlay.astro`, register in `order.json`.

**New role:** add `src/content/roles/{slug}.json` with `title`, `description`, `icon`, `color`, `order`, `department`, optional `comingSoon: true`, and `phases` array. Each phase has `phaseId` and `chapters` array. Five phases: `awareness`, `conceptual`, `practical`, `embedded`, `optimization`. Phases defined globally in `src/content/learning-phases.json`.
