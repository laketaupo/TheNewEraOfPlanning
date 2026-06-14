# Findability: Search + Glossary

**Date:** 2026-06-14
**Pillar:** Platform features
**Goal:** Help users find specific content and understand planning terminology quickly — supporting role-based adoption.

---

## Context

The platform has 231 topics across 4 pillars (Technology, Process, Data, People) and is used by planning professionals learning to understand and execute their role. Content is rich but currently undiscoverable: there is no search, and planning jargon (BOM, BOD, S&OP, SOE, etc.) is used throughout without centralized definitions.

---

## Feature 1: Full-Text Search

### Approach

Use **Pagefind** — a static search library that indexes content at build time and runs entirely client-side. Standard choice for Astro static sites. Adds ~50kb to the bundle. No backend required.

### How It Works

- `npm run build` triggers Pagefind to crawl the built HTML and produce a search index in the output directory.
- A search modal is triggered by `Cmd+K` (or `/`).
- Results display: topic title, chapter name, pillar, and a matched text snippet.
- Clicking a result navigates to that topic page.

### What Gets Indexed

All rendered topic pages (titles, descriptions, prose body) and Configuration Manual pages.

### UI Placement

- Search icon button added to `BaseLayout.astro` top bar, alongside the existing theme toggle and dashboard button.
- Modal rendered inside `BaseLayout` so it is available on every page.
- Modal is a full-screen overlay with a centered input, result list below.

### Pagefind Integration Points

- Add `@pagefind/default-ui` package.
- Wrap built HTML in the Pagefind attribute `data-pagefind-body` on the main content element of each topic layout to scope indexing to content (not nav/chrome).
- Add `data-pagefind-meta` attributes for `title`, `chapter`, and `pillar` so results can display those fields.
- Call `PagefindUI` in a client-side script inside `BaseLayout`.

---

## Feature 2: Glossary

### Content Model

A single file: `src/content/glossary.json`

Each entry:
```json
{
  "slug": "bill-of-materials",
  "term": "Bill of Materials (BOM)",
  "definition": "A structured list of components, subassemblies, and raw materials required to produce a finished product, including quantities and lead times.",
  "related": ["bill-of-distribution"],
  "seeAlso": ["01-understanding-basics/bom"]
}
```

Fields:
- `slug` — URL-safe anchor identifier
- `term` — display name
- `definition` — one to three sentences
- `related` — optional array of other term slugs
- `seeAlso` — optional array of `chapter-slug/topic-slug` references. Validated at build time against the topic list from `getTopics()`; a bad reference throws a build error (same behaviour as `resolveRoleSections()` in `roles.ts`).

Starting scope: ~30–50 terms covering the planning jargon used across existing content.

### Page: `/glossary`

- New static page at `src/pages/glossary.astro`.
- Alphabetically sorted term list with A–Z jump links at the top.
- Each term rendered as an anchor target (`id="bill-of-materials"`) so direct links work: `/glossary#bill-of-materials`.
- `seeAlso` references rendered as links to the relevant topic pages.
- `related` references rendered as links to sibling anchors on the same page.

### Inline Tooltips in Topic Prose

- A client-side script (loaded once in `BaseLayout`) scans topic body text for matches against glossary terms.
- Matching is case-insensitive, exact string only (no fuzzy/stemming). Only the first occurrence per paragraph is wrapped, to avoid over-highlighting dense prose.
- Matched terms get a subtle dotted underline. On hover, a tooltip shows the short definition plus a "→ Glossary" link.
- Implementation: inject a small JSON blob of `{ term → { definition, slug } }` into the page at build time via a `<script>` tag, then match against text nodes client-side using a `TreeWalker`.
- Scope limited to the `[data-pagefind-body]` content area (same element used by Pagefind) to avoid matching nav/UI text.

---

## Architecture Notes

- Both features are fully static — no server-side rendering, no backend.
- Pagefind index is generated as part of `npm run build` and committed to `.vercel/output/static/` (the existing build target).
- Glossary JSON is a single source of truth — loaded by the glossary page at build time and serialised into a `<script>` tag for the tooltip script.
- No new routing patterns needed. `/glossary` is a static Astro page.

---

## Out of Scope

- Manager/team progress visibility (deferred)
- Knowledge checks / assessments (deferred)
- Guided onboarding / role picker flow (Bundle 2, separate spec)
- In-topic engagement features (Bundle 3, separate spec)
