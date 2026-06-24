# Notes Search — Design Spec

**Date:** 2026-06-24  
**Status:** Approved

## Summary

Extend the existing search modal to include the user's personal notes alongside Pagefind content results. Notes are stored client-side in `localStorage` and are invisible to Pagefind's build-time index, so note search runs entirely in the browser at runtime.

## Approach

Keep PagefindUI unchanged. Add a client-side note search that runs on every keystroke and renders matching notes in a styled block **above** Pagefind's content results inside the same modal. No separate tab, no new routes, no changes to Pagefind's DOM.

## Data: Topic Map

**Problem:** Notes in `localStorage` are keyed by topicId (`chapter-slug/topic-slug`). To show a useful result we need the topic's title and URL.

**Solution:** Inject a `<script type="application/json" id="topic-map">` element into `BaseLayout.astro` at build time, using `getTopics()` from `src/lib/chapters.ts`.

Shape:
```json
{
  "chapter-slug/topic-slug": { "title": "Topic Display Title", "url": "/pillar/module/chapter/topic" }
}
```

This follows the existing pattern used for glossary data (`id="glossary-data"`). Adds negligible page weight.

## Search Logic

Implemented inside the existing `Search.astro` inline script. No new files.

**Input detection:** Use a `MutationObserver` on `#search-container` to detect when PagefindUI inserts its `<input>`. Attach an `input` listener at that point.

**Query handling:**
- Query shorter than 2 characters → hide notes block, do nothing
- Otherwise: read `platform-comments` from `localStorage`, filter entries where the note text contains the full query string (case-insensitive substring match)
- Resolve each matching topicId via the `#topic-map` JSON blob
- Skip any topicId not present in the map (stale note for a deleted topic)
- Debounce at 150 ms

**No fuzzy matching** — simple `lowerCaseNote.includes(lowerCaseQuery)` is sufficient for personal notes.

## Result Rendering

**Placement:** A `<div id="notes-results">` inside the modal, inserted between `#search-container` and the footer hint bar. Hidden by default (`display: none`).

**When notes match:**
- Show a small section header: `Your notes` (light gray, small caps)
- One row per matching note, styled to match Pagefind's `.pagefind-ui__result` rows:
  - Same padding (`10px 12px`), same border-radius (`10px`), same hover highlight (indigo-50 / dark indigo)
  - Topic title (bold) + amber `Note` badge (pill, matching the existing amber note-button palette)
  - Excerpt: note text truncated to 120 chars with `…`, matched query term wrapped in `<mark>` for highlight (styled amber to match the note palette, not the browser default yellow)

**When no notes match:** hide `#notes-results` entirely — no empty-state message shown.

**Click:** `window.location.href = topicUrl` — navigates to the topic page and closes the modal naturally.

## Files Changed

| File | Change |
|---|---|
| `src/layouts/BaseLayout.astro` | Inject `<script type="application/json" id="topic-map">` built from `getTopics()` |
| `src/components/Search.astro` | Add `#notes-results` div; extend inline script with MutationObserver, note search logic, and result renderer |

No new files. No changes to Pagefind integration, routing, or build config.

## Out of Scope

- Fuzzy / ranked matching
- Highlighting matches within the modal before navigating
- Opening the note edit modal on click
- Searching notes independently from the main search (no separate tab or route)
