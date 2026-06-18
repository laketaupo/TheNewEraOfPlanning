# Design: Unclear Comment Feature

**Date:** 2026-06-18
**Status:** Approved

## Problem

When a user marks a topic as "unclear" they have no way to capture *why* it was unclear. The note is lost, making the dashboard's list of unclear topics less actionable when reviewing.

## Decisions

| Question | Decision |
|---|---|
| When is the comment entered? | Modal that opens on clicking "Mark unclear" |
| Auto-advance after modal? | Yes — same as today's behavior |
| Comment visible in dashboard? | Yes — shown below the topic title when present |
| Re-click on already-unclear topic | Clears state + comment (same as today) |

## Data Layer

New `localStorage` key: **`platform-comments`**

```ts
// shape
{ [topicId: string]: string }  // topicId = "chapterSlug/topicSlug"
```

- Key is written only when the user types a comment and clicks "Save & next"
- Key is absent (never written) when the user clicks "Skip"
- Key is deleted when the unclear state is cleared (toggle off, or when the topic is subsequently marked complete)
- The existing `platform-progress` key is unchanged — no migration needed

## Modal

Injected into `<body>` by `topic-progress.ts` on first use (lazy, one-time). This avoids touching all 7 topic layout files.

```
┌─────────────────────────────────────┐
│  Add a note                    [×]  │
├─────────────────────────────────────┤
│                                     │
│  ┌───────────────────────────────┐  │
│  │ What's unclear? (optional)    │  │
│  │                               │  │
│  └───────────────────────────────┘  │
│                                     │
│              [Skip]  [Save & next]  │
└─────────────────────────────────────┘
```

### Button behaviour

| Button | Action |
|---|---|
| **[×] / Cancel** | Dismiss modal; topic stays unmarked; no auto-advance |
| **[Skip]** | Mark unclear, no comment written, auto-advance |
| **[Save & next]** | Mark unclear, comment written to `platform-comments`, auto-advance |

Textarea is focused automatically when the modal opens. Enter key does not submit (allows multi-line notes). Escape closes the modal (same as Cancel).

## Code Changes

### 1. `src/scripts/topic-progress.ts`

- Add `COMMENTS_KEY = 'platform-comments'` constant
- Add `getComments()` / `saveComment(id, text)` / `deleteComment(id)` helpers
- Add `injectModal()` — creates and appends the modal DOM once, returns references to its elements
- Update `toggle('unclear')` to:
  1. Open modal instead of immediately saving
  2. On Save: write comment + existing progress logic + advance
  3. On Skip: existing progress logic (no comment) + advance
  4. On Cancel/Escape: do nothing
- Update `toggle('complete')` to delete any existing comment for the topic (covers the case where a topic transitions from unclear → complete)

### 2. `src/components/UserDashboard.astro` (client `<script>`)

- Add `COMMENTS_KEY` constant and `getComments()` helper
- Update `topicRow(t, state)` to accept an optional `comment` string
- When `state === 'unclear'` and a comment exists, append a small line below the title:
  - Italic, amber-tinted text, truncated at ~60 chars with `title` attribute for full text on hover
- Update all call-sites of `topicRow()` to pass the comment

## Out of Scope

- Editing a comment after the fact (re-opening modal for an already-unclear topic)
- Export or sync of comments
- Comments on "complete" topics
