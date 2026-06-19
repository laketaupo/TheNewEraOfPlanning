# Design: Dedicated Note Button

**Date:** 2026-06-19
**Status:** Approved

## Problem

Comments are currently coupled to the "Mark unclear" action — clicking "Mark unclear" opens a modal that asks for an optional note before marking the topic and advancing. This conflates two separate concerns: flagging a topic as unclear and adding a note. Users want to add notes to any topic, independently of its progress state.

## Decisions

| Question | Decision |
|---|---|
| When is the note button available? | Always — any topic, any progress state |
| Where does the button live? | Replaces the existing ⓘ icon next to "Mark unclear" (always visible) |
| What does "Mark unclear" do? | Simple synchronous toggle + auto-advance, no modal |
| Modal pre-fill when editing? | Yes — textarea pre-filled with existing comment |
| Save with empty textarea? | Deletes the comment |
| Auto-advance after saving a note? | No — note is independent; user stays on the topic |

## UI

### Note button (always visible, next to "Mark unclear")

| State | Appearance |
|---|---|
| No comment | Gray border, gray pencil icon — same default style as other buttons |
| Has comment | Amber border, amber pencil icon |
| Has comment (hover) | Tooltip shows the comment text |

### Modal

```
┌─────────────────────────────────────┐
│  Add a note  (or "Edit note")  [×]  │
├─────────────────────────────────────┤
│  ┌───────────────────────────────┐  │
│  │ What's on your mind?          │  │
│  │   (pre-filled when editing)   │  │
│  └───────────────────────────────┘  │
│                                     │
│               [Cancel]  [Save]      │
└─────────────────────────────────────┘
```

- Title: "Add a note" when no existing comment; "Edit note" when pre-filled
- **Save with text** → saves/updates the comment
- **Save with empty** → deletes the comment
- **Cancel / × / Escape** → no change, modal closes

## Data Layer

`platform-comments` key and shape are **unchanged**: `{ [topicId: string]: string }`.

Comments remain independent of progress state — a topic can have a note regardless of whether it is complete, unclear, or unmarked.

## Code Changes

One file: **`src/scripts/topic-progress.ts`**

### 1. `handleUnclear()` — make synchronous

Remove `await openUnclearModal()` and comment-saving logic. Becomes a simple synchronous toggle (identical pattern to `applyComplete`): if unclear → clear state, else → set unclear. Auto-advance on set. No modal.

### 2. `openUnclearModal()` → `openNoteModal(existing: string)`

- Accepts the current comment text (empty string if none)
- Pre-fills the textarea with `existing`
- Title changes to "Add a note" / "Edit note" based on whether `existing` is non-empty
- Removes the "Skip" button
- Buttons: "Cancel" (resolve `null`) and "Save" (resolve `textarea.value.trim()`)
- Returns `string | null`: `null` = cancelled (no change), any string (including `''`) = save intent

### 3. `getInfoIndicator()` → `getNoteButton()`

- Always injected after `#unclear-btn` on `initTopicProgress()`, not lazily on first comment
- Always visible (not toggled by state)
- Appearance driven solely by comment presence: gray (no comment) vs. amber (has comment)
- Hover tooltip still shows comment text when present
- Click opens `openNoteModal(existingComment)`; on non-null result: save or delete

### 4. `updateButtons(state)`

- Note button appearance updated at end of `updateButtons` based on `getComments()[topicId]`
- Independent of `state` — comment can exist on any topic

## Out of Scope

- Dashboard showing notes on non-unclear topics — the dashboard currently only surfaces unclear topics; notes on complete or unmarked topics will not appear there
- Per-note timestamps
- Export or sync of notes
