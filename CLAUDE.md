# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev      # Start dev server at http://localhost:4321
npm run build    # Build to dist/ (run this to verify before committing)
npm run preview  # Preview the built site
```

There are no tests or linters configured. Always run `npm run build` to verify changes compile without errors before considering a task done.

## Architecture

**Stack:** Astro 4 (static site generation) + Tailwind CSS 3 + MDX. Deployed via GitHub Pages.

### Site Structure

The site is a four-pillar learning hub. The root landing page (`/`) lets users choose between **People**, **Process**, **Technology**, and **Data**.

Live pillars and their content:
- **Technology** (`/technology`) — two tracks: **How o9 Works** (`/technology/how-o9-works`, chapter-based interactive content with ~36 topics across 6 chapters) and **Configuration Manual** (`/technology/configuration`, screenshot + explanation entries)
- **Data** (`/data`) — data-driven planning (2 chapters, 10 topics)
- **Process** (`/process`) — scenario planning (2 chapters, 10 topics)
- **People** (`/people`) — coming soon placeholder

### Content Model

**Chapter content** lives in `src/content/chapters/<chapter-slug>/`:
- `_meta.json` — chapter metadata (`title`, `description`, `icon`, `color`, `order`, `pillar`, `hidden?`)
- `NN-topic-slug.md` — one file per topic, frontmatter-heavy

Chapter slug naming convention encodes the pillar: Technology chapters use numeric prefixes (`01-`, `02-`…), Data chapters use `data-01-`, `data-02-`…, Process chapters use `process-01-`, `process-02-`…. The `pillar` field in `_meta.json` is what actually drives filtering — slugs are just a naming aid.

`src/content/chapters/99-layout-showcase/` is a hidden chapter (`"hidden": true` in `_meta.json`) used as a development reference for all layout types. It is included in static builds but not surfaced in any navigation UI.

Topic frontmatter drives rendering. The key field is `topicLayout`, which selects the layout component used to display that topic. Valid values:
- `node-topic` — network node diagram with summary + bullets
- `card-grid` — card-based comparison layout
- `comparison` — left/right two-column layout
- `data-table` — tabular data layout
- `full-widget` — full-width interactive simulation
- `prose-topic` — falls through to the default `TopicLayout` (used by Data and Process chapters)
- *(omitted)* — defaults to `TopicLayout` (generic prose + optional widget)

**Configuration manual content** lives in `src/content/configuration/`:
- One `.md` file per screen: frontmatter fields are `title`, `description`, `order`, `screenshot` (path under `/public/`). The body is rendered as HTML on the configuration page.
- Screenshots go in `public/configuration/`.

### Data Loading Pattern

Content is **not** loaded via Astro's content collections API. Instead, `src/lib/chapters.ts` uses `import.meta.glob` at module level to eagerly load `_meta.json` files and topic `.md` frontmatter. The same pattern is used in `src/lib/configuration.ts` for the configuration manual.

All helper functions live in these two lib files and can be imported directly in any `.astro` page:
- `getChapters(pillar?: string)` — returns all chapters, or only those matching the given pillar string
- `getTopics()` — all topics across all pillars, each with a `pillar` field derived from its chapter's `_meta.json`
- `getTopicsForChapter(slug)` — topics for a single chapter
- `getAdjacentTopics(url)` — returns `[prev, next]` scoped to the **same pillar** (not cross-pillar)
- `getConfigurationEntries()` — configuration manual entries

When adding a new pillar or chapter, the `pillar` field in `_meta.json` is required for filtering to work correctly. Omitting it causes topics to silently fall back to the `'technology'` pillar.

### Routing

| Route | File |
|---|---|
| `/` | `src/pages/index.astro` |
| `/people`, `/process`, `/data` | `src/pages/people.astro`, `process.astro`, `data.astro` |
| `/technology` | `src/pages/technology/index.astro` |
| `/technology/how-o9-works` | `src/pages/technology/how-o9-works/index.astro` |
| `/technology/configuration` | `src/pages/technology/configuration/index.astro` |
| `/chapters/[chapter]/` | `src/pages/chapters/[chapter]/index.astro` |
| `/chapters/[chapter]/[topic]` | `src/pages/chapters/[chapter]/[topic].astro` |

The `[topic].astro` page dynamically imports the MDX file at request time (non-eager glob) and passes the `Content` component to the appropriate layout based on `topicLayout`.

### Layout Prop Flow

`[topic].astro` computes a `sharedProps` object in `getStaticPaths` and passes it to whichever layout is selected. All topic layouts accept the same base set of props:

```
title, description, chapterTitle, chapterSlug, chapterColor,
topicOrder, chapterOrder, prevUrl, nextUrl, prevTitle, nextTitle,
pillar, totalTopics
```

`pillar` and `totalTopics` are used by every layout to render the correct back-link in the top nav (via a `pillarBackMap`) and to show an accurate progress counter (`N / totalTopics topics`). If you add a new layout, include these two props.

The `pillarBackMap` pattern used in layouts and `[chapter]/index.astro`:
```typescript
const pillarBackMap = {
  technology: { href: `${BASE_URL}technology/how-o9-works`, label: 'How o9 Works' },
  data:       { href: `${BASE_URL}data`,                    label: 'Data' },
  process:    { href: `${BASE_URL}process`,                 label: 'Process' },
  people:     { href: `${BASE_URL}people`,                  label: 'People' },
};
```

### Layouts

All topic layouts live in `src/layouts/` and share the prop interface above. `BaseLayout.astro` is the HTML shell used by every page — it handles the theme persistence script (reads `o9-theme` from localStorage) and loads the Inter font.

### Dark Mode

Class-based (`darkMode: 'class'` in Tailwind). The `ThemeToggle` component toggles the `dark` class on `<html>` and persists to `localStorage` under the key `o9-theme`. `BaseLayout` applies the saved theme before first render to prevent flash.

### Progress Tracking

Chapter progress rings and topic completion dots are purely client-side, stored in `localStorage` under the key `o9-progress` as a flat object of `{ [topicId]: boolean }`. Topic IDs follow the pattern `ch{chapterOrder}-t{topicOrder}`.

### Colors

Each pillar and chapter has a color (indigo / violet / sky / emerald). Color-specific Tailwind classes are built via lookup maps (`colorBgMap`, `colorTextMap`, etc.) defined inline in each page — Tailwind requires full class strings to avoid purging. Don't use string interpolation to construct partial class names.
