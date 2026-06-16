# Progress Dashboard — Filter by Topic State

**Date:** 2026-06-16
**Component:** `src/components/UserDashboard.astro`
**Status:** Approved design

## Problem

The progress dashboard shows three header stat tiles (complete / unclear / remaining)
and a collapsible tree (pillar → module → chapter → topic, or, in role view,
phase → section → topic). Topics marked `unclear` appear only as scattered amber
dots inside the tree — there is no way to isolate them. The user wants to filter
the dashboard down to just the unclear topics (and, by extension, the other states)
in a low-friction way.

Note: `CLAUDE.md` and project memory both describe the dashboard as showing "a list
of topics marked unclear." That list does not currently exist in the code; this
feature fills that documented-but-missing gap.

## Approach

Turn the three existing header stat tiles into single-select toggle filters. No new
panel chrome beyond a small active-filter indicator chip. Chosen over filter
chips/segmented control and a pinned "needs review" list because it reuses real
estate already on screen.

## Behavior

### Tiles as toggles
- The complete / unclear / remaining tiles become clickable toggle buttons
  (`data-stat-filter` = `complete` | `unclear` | `none`; `remaining` maps to the
  `none` state, i.e. topics with no recorded progress).
- Single-select: tapping a tile activates that filter; tapping a different tile
  switches; tapping the active tile clears.
- Active tile gets a visible active treatment (ring + intensified accent color).

### Tree pruning ("prune & auto-expand")
- When a filter is active, each topic container is filled with only the topics whose
  state matches the active filter.
- Each ancestor `<details>` (chapter/module/pillar, or section/phase in role view) is
  shown and forced `open` only if it contains at least one matching topic; otherwise
  it is hidden.
- When no filter is active, the tree renders exactly as today (full structure, user's
  own expand/collapse state preserved).

### Indicator chip
- While a filter is active, a small row appears above the tree:
  `Showing: <label>  ✕ clear`. Clicking it (or the active tile) clears the filter.

### Empty state
- If the active filter matches zero topics in the current scope, the tree area shows a
  friendly message (e.g. `No unclear topics 🎉`) instead of a blank panel.

## Scope & composition

- Applies to **both** the pillar view and the role view — both fill topics through the
  same `topicRow` render path, so the filter logic is shared.
- Composes with the existing **role selector**: the role narrows which topics exist;
  the tile filter narrows by state within that scope. Tile counts already reflect role
  scope, so the numbers stay consistent with what the filter shows.

## Decisions

- **Non-persistent:** the active state filter resets to "All" each time the panel
  opens. A sticky filter that silently hides most of the tree on a later visit is a
  footgun. The role selector keeps its existing `localStorage` persistence
  (`platform-dashboard-role`); only the new state filter is session-only.
- **Single-select** state filter (not multi).

## Affected code (all in `UserDashboard.astro`)

1. Markup: wrap/convert the three stat tiles into buttons carrying `data-stat-filter`;
   add the active-filter indicator chip row above the tree; add an empty-state element
   for the filtered case.
2. Script: add an `activeFilter` variable (`'' | 'complete' | 'unclear' | 'none'`).
3. `updatePillarView` / `updateRoleView`: filter the rows written into each container
   by `activeFilter`; after filling, toggle each ancestor `<details>` `open` / hidden
   based on whether it received any matching topic.
4. `refreshDashboard`: reset `activeFilter` on open; render the indicator chip and
   empty state; wire tile clicks to set/clear `activeFilter` and re-render.

## Out of scope

- Multi-state filtering.
- Persisting the state filter across sessions.
- Any change to the role selector, badge, reset button, or progress storage model.
