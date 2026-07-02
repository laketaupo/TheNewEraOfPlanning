# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

> **Architecture note (read first):** This project is a **build-free vanilla-JavaScript single-page app**, not an Astro site. Earlier revisions were built with Astro; that toolchain has been fully removed. Many `js/*.js` files carry `// Port of src/...astro` comments describing their Astro ancestor — those comments are historical and the `src/` tree no longer exists. The authoritative runtime spec is **[CONTRACTS.md](CONTRACTS.md)**; when this file and CONTRACTS.md disagree about runtime behaviour, CONTRACTS.md wins.

## Working Style

### Parallel Agents
When a task splits into 2 or more independent subtasks, always dispatch parallel agents rather than working sequentially. If subtasks share no state and don't depend on each other's output, run them simultaneously.

### Agent Model Selection
Match agent model to task complexity — don't default everything to the most expensive model:

| Task type | Model |
|---|---|
| File reads, searches, simple edits, navigation | `claude-haiku-4-5-20251001` |
| Complex implementation, multi-file features | `claude-sonnet-4-6` |
| Planning / design / architecture decisions | `claude-sonnet-4-6` or `claude-opus-4-8` |
| Debugging, root-cause analysis | `claude-sonnet-4-6` |
| Code review, security audits, cross-file analysis | `claude-sonnet-4-6` |

When spawning agents via the `Agent` tool, pass the appropriate `model` parameter. Default to Haiku for lightweight work; escalate to Sonnet or Opus only when the task warrants it.

## Commands

```bash
npm run dev        # Serve the site locally at http://localhost:8080 (scripts/gh-pages-like-server.mjs)
npm run generate   # Regenerate data/content-index.json, data/search-index.json, and css/site.css
npm run validate   # Validate all cross-references (roles, glossary, faq) — throws on bad refs
npm test           # Headless Playwright smoke + interaction tests (scripts/test.mjs)
```

There is **no `build` step** — the site is served as static files straight from the repo root. `npm run generate` is the closest equivalent: it runs three scripts in sequence:

- `scripts/gen-content-index.mjs` → writes `data/content-index.json` (chapters, topics with compiled+sanitized HTML bodies, roles, glossary, faq).
- `scripts/gen-search-index.mjs` → writes `data/search-index.json` (the search corpus).
- `scripts/gen-css.mjs` → runs the Tailwind CLI over `js/`+`index.html` → `css/site.css`.

**Generated artifacts are committed.** `data/*.json` and `css/site.css` are checked in and served as-is. **After any content, glossary, faq, role, or `order.json` change you MUST run `npm run generate` and commit the regenerated files** — otherwise the live site won't reflect your change. Run `npm run validate` (or `npm test`) to catch broken references before committing.

**Dependencies:** the generator/test scripts need the devDependencies installed (`npm install`): `marked` + `dompurify` + `jsdom` (markdown → sanitized HTML in `gen-content-index.mjs`), `gray-matter` (frontmatter), `playwright` (tests), `tailwindcss` (CSS). The browser runtime itself has **zero dependencies** — plain ES modules.

## Architecture

**Stack:** Static `index.html` shell + ES-module JavaScript under `js/`, Tailwind-generated `css/site.css`, Markdown content under `content/` compiled to a JSON index at generate-time. No framework, no bundler, no server.

**Entry point:** `index.html` loads `<script type="module" src="js/app.js">`. [js/app.js](js/app.js) boots: restores deep-link redirects (see `404.html`), awaits `initContentIndex()` (fetches `data/content-index.json` once), mounts the fixed shell chrome (`js/shell/*.js`), then starts the router.

**Deployment:** GitHub Pages via [.github/workflows/deploy.yml](.github/workflows/deploy.yml) on push to `main`. The workflow does **not** build — it copies the already-committed static files (`index.html`, `404.html`, `favicon.svg`, `css`, `js`, `content`, `data`, `ui-training`) into `_site/` and publishes. Compilation happens locally via `npm run generate`, not in CI.

**Base URL:** the site works both at `/` (local dev) and `/TheNewEraOfPlanning/` (GitHub Pages). [js/base-url.js](js/base-url.js) detects `BASE` at runtime from the `<script src>` path — there is no config file. **All internal URLs must be built with `url(path)` or prefixed with `BASE`** from `js/base-url.js`; never hardcode a leading `/`. Index/data structures store BASE-free paths and prefix at consumption time (see CONTRACTS.md §5b).

### Site Structure

A four-pillar learning hub (Technology, Process, Data, People). Each pillar has one or more **modules**, each module has one or more **chapters**, each chapter has one or more **topics**. The full URL shape is:

```
/{theme}/{module}/{chapter-slug}/{topic-slug}
```

> **"Pillar" vs "theme":** The product calls these four areas "pillars", but the codebase calls them **themes** — in `_meta.json`, `order.json`, function names, URL parameters, and `localStorage`. Always use `theme` in code. (The browser route is `/pillars`, though the page module keeps the filename `js/pages/themes.js`.)

Current modules per pillar (authoritative order from `content/order.json`):

| Pillar | Modules |
|---|---|
| `people` | `roles-and-responsibilities`, `decision-making-and-ownership`, `collaboration-and-ways-of-working`, `capabilities-and-skills` |
| `process` | `planning-fundamentals`, `sop`, `soe`, `execution`, `planning-governance`, `advanced-planning` |
| `data` | `data-foundations`, `planning-data-domains`, `planning-parameters-and-assumptions`, `performance-and-measurement`, `data-quality-and-governance` |
| `technology` | `tool-landscape`, `planning-software`, `erp`, `supporting-systems`, `adoption-and-usage-quality` |

> The technology pillar's former standalone `fms` and `mdm` modules were consolidated into a single **`supporting-systems`** module.

The Configuration Manual is available both as a standalone page at `/technology/configuration` (content in `content/configuration/`, page in `js/pages/configuration.js`) and as a hidden chapter `08-configuration-manual` within the `planning-software` module (content in `content/chapters/08-configuration-manual/`).

### Content Model

**Chapter content** lives in `content/chapters/<chapter-slug>/`:
- `_meta.json` — chapter metadata. Required fields: `title`, `description`, `icon`, `color`, `theme`, `module`. Optional: `hidden` (bool).
- `topic-slug.md` — one file per topic, frontmatter-heavy. A committed `topic-slug.html` sits beside each `.md`; both are (re)written by `npm run generate` — the `.html` is the compiled+sanitized body embedded in `content-index.json`. Edit the `.md`; never hand-edit the `.html`.
- **Numeric filename prefixes are allowed.** `gen-content-index.mjs` derives the topic slug by stripping a leading `NN-` (`the-four-systems.md` and `01-the-four-systems.md` both yield slug `the-four-systems`) and reads the actual file directly, so a `NN-` prefix works fine and is used across the content set. Chapter directory names may also carry an `NN-` prefix.

Both `theme` and `module` are required in every `_meta.json` — a chapter whose `module` value isn't one of the real modules in `order.json` won't appear on any module index page.

`99-layout-showcase/` is a hidden dev-reference chapter (`"hidden": true`) — included in the index, invisible in nav.

**Topic frontmatter** — the key field is `topicLayout`, which selects the layout module ([js/layouts/layout-registry.js](js/layouts/layout-registry.js)):

| `topicLayout` value | Layout module |
|---|---|
| `node-topic` | `js/layouts/node-topic.js` — network node diagram with summary + bullets |
| `card-grid` | `js/layouts/card-grid.js` — card-based comparison |
| `comparison` | `js/layouts/comparison.js` — left/right two-column |
| `data-table` | `js/layouts/data-table.js` — tabular data |
| `full-widget` | `js/layouts/full-width-widget.js` — interactive simulation |
| `rasci-table` | `js/layouts/rasci-table.js` — RASCI responsibility matrix |
| `ui-training` | `js/layouts/ui-training.js` — full-viewport screenshot + steps sidebar |
| `process-step-detail` | `js/layouts/process-step-detail.js` — step layout with inputs/outputs/roles/systems/tasks panels |
| `prose-topic` or omitted | `js/layouts/topic.js` — generic prose + optional widget (the fallback) |

**Interactive widgets** are selected by the frontmatter `widget:` field and dispatched through [js/widgets/registry.js](js/widgets/registry.js) (see CONTRACTS.md §3). Registered keys: `what-if`, `graph`, `demand-flow`, `supply-flow`, `org-chart`, `demand-slicing`, `variety-disagg`, `seasonal-disagg`. A `widget:` value with no registry entry renders nothing.

**Configuration manual** lives in `content/configuration/` — one `.md` per screen with frontmatter fields `title`, `description`, `order`, `screenshot`.

**`content/chapter-phases.json`** — maps every non-hidden chapter to one of the five learning phases, organized as `pillar → module → chapter-slug: "phase"`. A content-author reference used when building/reviewing role learning paths. Update it manually whenever a chapter is added or deleted.

**Roles** live in `content/roles/<slug>.json` — role-based courses referencing chapter slugs per phase. Bad references throw in `npm run validate`.

### Data Loading

There are **no** framework content collections and no `import.meta.glob`. Content flows: Markdown/JSON under `content/` → `scripts/gen-content-index.mjs` → **`data/content-index.json`** → fetched once at boot by [js/content.js](js/content.js) (`initContentIndex()` / `getIndex()`) → queried synchronously by the `js/lib/*.js` accessors:

- [js/lib/chapters.js](js/lib/chapters.js) — `getChapters(theme?)`, `getTopics()`, `getTopicsForChapter(slug)`, `getAdjacentTopics(url)`, `getChapterUrl(ch)`, `getThemes()`, `getModulesForTheme(theme)`.
- [js/lib/configuration.js](js/lib/configuration.js) — configuration-manual entries.
- [js/lib/faq.js](js/lib/faq.js) — `getFaqEntries()`.
- [js/lib/glossary.js](js/lib/glossary.js) — `getGlossaryTerms()`.
- [js/lib/roles.js](js/lib/roles.js) — role loading + `resolveRoleSections()` hydration.
- [js/lib/module-meta.js](js/lib/module-meta.js) — module back-link/label lookup.

See CONTRACTS.md §1 for the exact `content-index.json` schema.

**`content/order.json`** is the authoritative source for ordering. It defines `themes` (array), `modules` (per-theme arrays), `chapters` (per-module arrays), and `topics` (per-chapter arrays). The `order` field in `_meta.json` and the `NN-` numeric prefix are both overridden by this file — items not listed get index 9999 and sort to the end. **When adding a chapter or topic, register it in `order.json` to control its position** (and re-run `npm run generate`).

### Routing

Client-side history-API routing lives in [js/router.js](js/router.js). It swaps `#app-main`'s innerHTML per route; the shell chrome is mounted once at boot and persists. The route table (literal segments win over `:param` patterns):

| Route pattern | Page module |
|---|---|
| `/` | `js/pages/home.js` |
| `/about` | `js/pages/about.js` |
| `/progress` | `js/pages/progress.js` |
| `/pillars` | `js/pages/themes.js` (pillar/module browser) |
| `/glossary` | `js/pages/glossary.js` |
| `/faq` | `js/pages/faq.js` |
| `/roles` | `js/pages/roles-index.js` |
| `/roles/{role}` | `js/pages/role.js` |
| `/roles/{role}/{phase}` | `js/pages/role-phase.js` |
| `/technology/configuration` | `js/pages/configuration.js` |
| `/{theme}/{module}/{chapter}/{topic}` | `js/pages/topic.js` |
| `/{theme}/{module}/{chapter}` | `js/pages/chapter-index.js` |
| `/{theme}/{module}` | `js/pages/module.js` |
| `/{theme}` | `js/pages/pillar.js` |

The four generic `:theme…` routes handle every pillar/module/chapter/topic uniformly — there are no per-module page files. `:theme` only matches a real theme from the index, so literal routes stay reachable. After every render the router runs `scanGlossary()` and `applyRoleNav()`; see CONTRACTS.md §5.

> **Glossary tooltips on overview pages:** the pillar (`:theme`), module, chapter-index, role, and role-phase routes carry `skipGlossary: true` in the route table, so inline glossary-term tooltips are suppressed on overview pages and only appear inside topic content.

### Key Patterns

**Module labels / back-links** — module-slug → display label and back-link lookups live in [js/lib/module-meta.js](js/lib/module-meta.js) and the `MODULE_LABELS` map in [js/pages/progress.js](js/pages/progress.js). `js/shell/site-overlay.js` also carries module display names for the nav palette. Keep these in sync when adding/removing a module.

**Layout prop flow** — [js/pages/topic.js](js/pages/topic.js) builds a `sharedProps` object (`title, description, chapterTitle, chapterSlug, chapterColor, chapterUrl, topicOrder, chapterOrder, prevUrl, nextUrl, prevTitle, nextTitle, theme, module, totalTopics, …`) and passes it to the selected layout's `render()`. `chapterUrl` drives the topic back-link. See CONTRACTS.md §2 for the layout render contract.

**Tailwind class safety** — `css/site.css` is generated by scanning `js/` + `index.html`, so color-specific classes must appear as complete literal strings in source. Never build them by interpolation (e.g. `` `bg-${color}-500` ``) — use lookup maps (e.g. `badgeBgMap` in `js/layouts/shared.js`). After adding new classes, run `npm run generate`.

### Client-Side Persistence

Three `localStorage` keys (see CONTRACTS.md §4/§6):

- **`platform-theme`** — `'dark'` or absent. `js/shell/theme-toggle.js` writes it; `index.html` reads it inline before first paint to prevent flash.
- **`platform-progress`** — `{ [topicId]: 'complete' | 'unclear' }`. Topic IDs are `{chapterSlug}/{topicSlug}` (globally unique). The id is derived identically everywhere that reads/writes the store. Legacy boolean `true` is migrated to `'complete'` on read.
- **`platform-comments`** — `{ [topicId]: string }`. Per-topic freetext notes.

After any progress/comment change, [js/shell/topic-progress.js](js/shell/topic-progress.js) dispatches `window.dispatchEvent(new CustomEvent('platform-progress-changed'))` so `js/shell/user-dashboard.js` re-renders without a reload. `topic-progress.js` is re-initialised on every route render (via the `page-rendered` event) — it handles mark-complete, mark-unclear, the note modal, and auto-advance.

### Glossary System

**`content/glossary.json`** — flat array of term objects with fields `slug`, `term`, `definition`, `aliases`, `related`, `seeAlso`. Folded into `content-index.json` by the generator; `js/lib/glossary.js` exposes `getGlossaryTerms()`. Cross-reference validation runs in `scripts/validate-refs.mjs` (`npm run validate`), not in the browser.

**Inline tooltips** — `js/app.js` injects the glossary as `<script type="application/json" id="glossary-data">`; [js/shell/glossary-tooltip.js](js/shell/glossary-tooltip.js) (`scanGlossary`) wraps matching terms in rendered `p`/`li` content and shows the shared `#glossary-tooltip` card on hover. Suppressed on overview routes (see Routing note above).

### FAQ System

**`content/faq.json`** — flat array with fields `slug`, `question`, `answer`, `theme` (`technology`|`process`|`data`|`people`), `seeAlso` (`chapter-slug/topic-slug` refs), `related` (glossary slugs). `js/lib/faq.js` exposes `getFaqEntries()`. `scripts/validate-refs.mjs` throws on invalid theme, bad topic refs, or bad glossary refs — run `npm run validate`.

### Components

Fixed shell chrome lives in `js/shell/` (mounted once at boot by `app.js`); interactive content widgets live in `js/widgets/`:

- **`js/shell/site-overlay.js`** — full-site navigation palette (press `O`).
- **`js/shell/user-dashboard.js`** — progress dashboard panel; listens for `platform-progress-changed`.
- **`js/shell/theme-toggle.js`** — light/dark toggle (mounted into `#theme-toggle-slot`).
- **`js/shell/search.js`** — search modal backed by `data/search-index.json` (opens on `/`).
- **`js/shell/role-matrix.js`** — role-to-topic responsibility matrix overlay.
- **`js/shell/intro-overlay.js`** — first-visit welcome/help modal.
- **`js/shell/role-phase-nav.js`** — applies the `?from=roles/x/y` navigation override after render.
- **`js/shell/glossary-tooltip.js`**, **`js/shell/topic-progress.js`** — per-route behaviour binders (re-run after each render).
- **`js/widgets/`** — `graph`, `demand-flow`, `supply-flow`, `demand-slicing`, `variety-disagg`, `seasonal-disagg`, `what-if`, `org-chart` (+ `org-tree-node` helper), dispatched via `registry.js`.

### Adding Content

**New topic:** add `slug.md` (optionally `NN-slug.md`) in the chapter folder, set `topicLayout`, register the slug in `content/order.json` under the chapter key, then run `npm run generate`.

**New chapter in an existing module:** create `content/chapters/<slug>/` with `_meta.json` (including `theme` and `module`) and topic files. Register the chapter slug in `content/order.json` under the module key, add it to `content/chapter-phases.json`, and run `npm run generate`. No routing changes needed — the generic `[theme]/[module]/[chapter]` route picks it up.

**New module (any pillar):** register it in `content/order.json`, add its label to `js/lib/module-meta.js` and `MODULE_LABELS` in `js/pages/progress.js`, add its display name to `js/shell/site-overlay.js`, then run `npm run generate`. No new page file is required — `js/pages/module.js` renders every module and `js/pages/pillar.js` renders the pillar index generically.

**New role course:** add `content/roles/{slug}.json` (see structure below), then `npm run generate` + `npm run validate`.

### Removing Content

Reverse of the above, and **always re-run `npm run generate`** so the deleted item leaves `data/content-index.json` and `data/search-index.json`:

- **Topic:** delete `slug.md` (and its generated `slug.html`), remove the slug from `order.json`.
- **Chapter:** delete the folder, remove the slug from `order.json`, remove its entry from `chapter-phases.json`.
- **Module:** remove it from `order.json`, the module-label maps, and `site-overlay.js`.

> **Counters are dynamic.** "X chapters available" / "X topics" badges are computed at render time from the index — they update automatically after `npm run generate`.

### Role JSON Structure

Each role JSON at `content/roles/{slug}.json`:

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

- `comingSoon: true` hides the role from the learning paths.
- Phases with an empty `chapters` array render as "Coming soon".
- Phase order in the JSON doesn't matter — phases display in the global order from `learning-phases.json`.
- Chapter slugs must exist and must not be hidden — bad references throw in `npm run validate`.

### Learning Phases

The global phase definitions live in `content/learning-phases.json`. Five phases, in order:

| Phase ID | Title | Purpose |
|---|---|---|
| `awareness` | Awareness & Context Setting | Understand the "why" — high-level overview, what is changing, business drivers |
| `conceptual` | Conceptual Understanding | Understand the "what" — process flows, data objects, tool functionality, RASCI |
| `practical` | Practical Application | Learn the "how" — role-based execution, step-by-step workflows, hands-on tool use |
| `embedded` | Embedded Adoption | Make it business as usual — governance, KPIs, policy, data ownership |
| `optimization` | Optimization & Continuous Improvement | Drive best practice — advanced features, scenario analysis, SME development |

> The chapter-slug → phase mapping used when building roles lives in **`content/chapter-phases.json`**, the current source of truth for which chapter belongs to which phase. Verify any specific slug against `chapter-phases.json` and `order.json` before relying on it. Note the technology restructure replaced several older chapters: `03-the-logic` → `planning-logic`; `arch-01-end-to-end` + `arch-02-integration` → `arch-how-systems-connect`; `fms-05/06/07` and `mdm-05/06/07` → `fms-logic-and-workflows` / `mdm-logic-and-workflows` (module `supporting-systems`).
