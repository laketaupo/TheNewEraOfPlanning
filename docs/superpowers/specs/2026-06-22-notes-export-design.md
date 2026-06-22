# Notes Export — Design Spec

**Date:** 2026-06-22
**Status:** Approved

## Summary

Add a "Copy all" button to the Notes tab in the UserDashboard panel. Clicking it copies all the user's notes to the clipboard in a plain-text format that includes pillar, chapter, and topic breadcrumbs — ready to paste into an email.

---

## Button

- **Location:** Inside the Notes tab content area, right-aligned, immediately below the tabs bar and above the first chapter group.
- **Appearance (default):** `text-xs`, rounded-full, border in `border-gray-300 dark:border-neutral-700`, muted text (`text-gray-400 dark:text-neutral-500`), clipboard SVG icon + "Copy all" label. Hover: `border-amber-400 text-amber-600 dark:text-amber-400`.
- **Appearance (copied):** Border and text switch to emerald (`border-emerald-400 text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-500/10`), icon swaps to a checkmark, label becomes "Copied!". Reverts after 2 seconds.
- **Visibility:** Only rendered when there is at least one note. Hidden alongside the existing empty-state message.

---

## Clipboard text format

```
My Learning Notes
Exported 22 June 2026
================================

PROCESS › Demand Forecasting
Statistical Baseline Forecasting
  Need to check what our system uses for outlier handling.

PROCESS › Demand Monitoring
Exception Management
  Still unclear how exceptions escalate after 48h.

TECHNOLOGY › Planning Software Basics
The Network Data Model
  The parent-child node concept maps to our factory hierarchy.
```

Rules:
- Header: `My Learning Notes\nExported {day} {month} {year}` followed by a `================================` divider.
- Per note: `{PILLAR} › {Chapter title}` (pillar uppercased), then topic title on the next line, then note text indented with two spaces.
- Notes are separated by a blank line.
- Order mirrors the Notes tab: content order, grouped by chapter (same as `buildNotesTab()`).
- Pillar display name comes from `pillarKey` (uppercased). Chapter title and topic title come from existing `topicsForClient` metadata.

---

## Implementation

All changes are confined to `src/components/UserDashboard.astro`.

### New functions (added to the existing `<script>` block)

**`formatNotesForClipboard()`**
Reads `topicsForClient`, `getComments()`, and `getProgress()`. Builds the plain-text string described above. Returns the string.

**`copyAllNotes(btn)`**
Calls `formatNotesForClipboard()`, writes to clipboard via `navigator.clipboard.writeText()`. On success, triggers the "Copied!" visual state on `btn` and schedules a revert after 2 000 ms. Falls back to `document.execCommand('copy')` if the Clipboard API is unavailable. Silently does nothing if both fail.

### Changes to `buildNotesTab()`

After the early-return for the empty state, and before rendering chapter groups, inject the "Copy all" button element:

```html
<div class="px-5 pt-3 pb-2.5 flex justify-end">
  <button data-copy-notes-btn ...>
    <!-- clipboard icon -->
    Copy all
  </button>
</div>
```

Attach a click listener that calls `copyAllNotes(btn)`.

---

## Edge cases

| Scenario | Behaviour |
|---|---|
| No notes | Button not rendered; empty-state message shown as today |
| `navigator.clipboard` unavailable | Falls back to `execCommand('copy')` |
| Both clipboard methods fail | Silently does nothing |
| Notes tab not yet built when button is clicked | Not possible — button is created inside `buildNotesTab()` |

---

## Out of scope

- Per-note copy buttons
- Download as `.txt` file
- Markdown or HTML output formats
- Filtering notes before copying
