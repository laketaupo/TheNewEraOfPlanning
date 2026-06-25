# Role Matrix Phase View — Design Spec

**Date:** 2026-06-25  
**Status:** Approved

---

## Overview

Add a **Phase view** to the existing Role × Chapter Matrix overlay. The current "Pillar view" groups chapter rows by Pillar → Module → Chapter. The new Phase view groups the same chapter rows by Phase → Chapter, letting users read the matrix from a learning-journey perspective rather than a content-taxonomy perspective.

---

## User Need

Users want to answer questions like: "Which chapters does each role cover in the Awareness phase?" and "Which roles have the most Practical content?" The current pillar grouping does not surface this.

---

## Design

### View Toggle

Add a **"Pillar | Phase"** segmented control to the matrix header, placed to the left of the existing **"Modules | Chapters"** depth control.

- Selecting **Pillar** shows the existing tbody (Pillar → Module → Chapter rows). The Modules/Chapters depth control is visible and functional.
- Selecting **Phase** shows the new phase tbody (Phase → Chapter rows). The Modules/Chapters depth control is hidden (it has no meaning in Phase view).
- Default on open: **Pillar** (no change to current behaviour).

### Phase View Row Structure

Five top-level phase header rows, in order:

1. Awareness & Context Setting
2. Conceptual Understanding
3. Practical Application
4. Embedded Adoption
5. Optimization & Continuous Improvement

Under each phase header: chapter rows for chapters canonically assigned to that phase.

An **Unassigned** section at the bottom collects chapters not assigned to any phase by any role. It is collapsed by default.

Phase header rows are clickable to collapse/expand their chapters, identical to the existing theme row toggle behaviour.

### Canonical Phase Assignment

Each chapter is assigned to exactly one phase for the purposes of row placement. The canonical phase is determined at build time in the Astro frontmatter:

1. Collect every `{ chapterSlug, phaseId }` pair from all role JSON files.
2. For each chapter slug, tally phase assignments across roles and pick the **most common** phase (majority vote).
3. Ties broken by phase order (earlier phase wins).
4. Chapters with zero assignments across all roles → Unassigned.

This logic runs once in the Astro frontmatter; no runtime cost.

### Dots

Dots are identical to the current pillar view: a filled dot appears if the role has that chapter anywhere in its learning path (in any phase). Since the user's data model treats chapters as belonging to a single canonical phase, this is consistent.

### Collapse Behaviour

- Phase header rows toggle their child chapter rows (same pattern as theme rows).
- No "depth" control in Phase view — there is no intermediate module level.

### Styling

- Phase header rows use a neutral grey background (consistent with the existing theme row style) with the phase name in small-caps. Each phase gets a colour accent derived from the 5-phase palette:
  - Awareness: amber
  - Conceptual: blue
  - Practical: green
  - Embedded: purple
  - Optimization: orange
- Chapter rows under phases use the same styling as current chapter rows (white background, small font, sticky first column).

---

## Implementation

### Files Changed

- **`src/components/RoleMatrix.astro`** — only file changed.

### Astro Frontmatter Additions

1. Import `learningPhases` from `src/content/learning-phases.json`.
2. Compute `canonicalPhaseMap: Map<chapterSlug, phaseId>` using the majority-vote logic.
3. Build `phaseGroups`: ordered array of `{ phaseId, label, chapters[] }` using the existing `allChapters` list filtered by canonical phase.

### HTML Additions

Render a second `<tbody id="rm-phase-body">` after the existing `<tbody id="rm-pillar-body">`, hidden by default (`display: none`). It contains:
- One `<tr class="rm-phase-row">` per phase (collapsible header).
- One `<tr class="rm-chapter-row rm-phase-chapter-row">` per chapter under that phase.

The existing tbody gets `id="rm-pillar-body"`.

### JS Additions

- **View toggle handler**: clicking Pillar/Phase buttons swaps `display` on the two tbodies and shows/hides the Modules/Chapters depth control.
- **Phase row collapse**: same pattern as the existing theme row toggle — click toggles `data-collapsed` and shows/hides child chapter rows.
- Phase view is independent from the existing collapse state of the pillar view. Switching views preserves each view's own collapse state.

### No New Files

All changes are contained in `RoleMatrix.astro`. No new components, no new data files, no routing changes.

---

## Out of Scope

- Showing which phase a role assigns a chapter to (colour-coded dots). The canonical phase placement in the row grouping is sufficient.
- Filtering the matrix by phase (a phase-filter pill UI). The collapsible phase sections serve this need adequately.
- Persisting the selected view (Pillar vs Phase) across sessions.
