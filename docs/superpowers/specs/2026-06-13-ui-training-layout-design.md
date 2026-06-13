# UI Training Layout — Design Spec

**Date:** 2026-06-13
**Status:** Approved

## Overview

A new Astro layout for UI training topics. Each topic shows a full-size screenshot of a software interface, a description block below it, and a static numbered steps list in a right sidebar. The three boxes together fill the viewport, inset by 64px on all sides from the screen edge.

## Layout Component

- **File:** `src/layouts/UiTrainingLayout.astro`
- **Selector:** `topicLayout: "ui-training"` in topic frontmatter
- **Wired in:** `src/pages/[pillar]/[module]/[chapter]/[topic].astro` alongside existing 7 layouts

## Page Structure

Full-viewport shell (`height: 100vh`, no scroll). Four fixed regions stacked vertically:

| Region | Height | Notes |
|---|---|---|
| Top nav | 44px fixed | Back link, chapter badge, theme toggle — identical to all other layouts |
| Hero header | auto | Chapter pill, topic title, topic description — identical to all other layouts |
| Content area | flex: 1 (fills remainder) | 64px padding on all four sides |
| Bottom nav | 48px fixed | Prev/next links and topic counter — identical to all other layouts |

## Content Area

A single rounded box (`border-radius: 10px`, `border: 1px solid #1e293b`) divided into two columns:

### Left column (flex: 1)

1. **Screenshot frame** — fills all remaining height (`flex: 1`). Has a macOS-style titlebar strip (three dots + filename label). The image itself fills the frame; in production this is an `<img>` tag pointing to the `screenshot` frontmatter path.
2. **Description block** — fixed height at the bottom of the left column, flush with the screenshot (no gap, shared border). Contains a small "What you're looking at" heading and a prose paragraph.

### Right column (240px fixed)

A **Steps panel** spanning the full height of the content area (top of screenshot to bottom of description). Contains:
- A small uppercase "Steps" heading
- A numbered list of steps, spaced evenly top-to-bottom with connector lines between numbers
- Steps are static/read-only — no interaction, no checkboxes

## Frontmatter Schema

Three new fields in addition to the standard shared props passed by `[topic].astro`:

```yaml
topicLayout: "ui-training"
screenshot: "/ui-training/demand-workspace.png"   # path under /public/
steps:
  - "Open the Demand workspace from the left menu"
  - "Set the Location filter to your site"
  - "Set the Horizon to 13 weeks"
  - "Expand a product family row to see SKU-level data"
  - "Review any red cells — these are exceptions"
  - "Save the view with your filter settings"
```

- `screenshot` — required. Path to an image stored in `public/`. No default.
- `steps` — required. Array of strings. No enforced count; panel spaces them evenly top-to-bottom.

## Standard Props (passed by [topic].astro)

Same `sharedProps` object as all other layouts:

```
title, description, chapterTitle, chapterSlug, chapterColor, chapterUrl,
topicOrder, topicSlug, chapterOrder, prevUrl, nextUrl, prevTitle, nextTitle,
pillar, module, totalTopics
```

`chapterColor` drives the accent line and chapter pill colour, identical to existing layouts.

## moduleBackMap

Defined inline in `UiTrainingLayout.astro` — same full map as all other layouts. No new module entries required; this layout serves existing modules.

## Files to Create / Modify

| Action | File |
|---|---|
| Create | `src/layouts/UiTrainingLayout.astro` |
| Modify | `src/pages/[pillar]/[module]/[chapter]/[topic].astro` — add `ui-training` case |
| Modify | `CLAUDE.md` — add `ui-training` row to the topicLayout table |
| Create (optional) | `src/content/chapters/05-navigation-and-ui/the-user-interface-walkthrough.md` — sample topic to verify the layout end-to-end |

## Screenshot Storage Convention

Screenshots go in `public/ui-training/<chapter-slug>/<filename>.png`. This keeps them grouped by chapter and out of the general `public/` root.

## Visual Reference

Mockup saved at `.superpowers/brainstorm/79971-1781377376/content/full-design-v5.html`.
