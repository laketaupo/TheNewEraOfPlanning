# Glossary tooltip & search overlay restyle — design

**Date:** 2026-06-14
**Status:** Approved (pending spec review)

## Problem

Two floating UI surfaces don't fit the site's light theme and feel off:

1. **Glossary tooltip** — the hover popover for underlined glossary terms ([src/layouts/BaseLayout.astro](../../../src/layouts/BaseLayout.astro), lines 44–52). It's a hardcoded dark sticker (`bg-gray-900 … text-white`) in *both* themes, uses tiny `text-xs` (12px) text and a narrow `max-w-xs`, and shows only the definition (no term name). It also has an interaction bug: moving the pointer from the term toward the "→ Glossary" link dismisses the tooltip before it can be clicked.
2. **Search overlay** (⌘K / `/`) — the Pagefind-powered modal ([src/components/Search.astro](../../../src/components/Search.astro)). It's `max-w-[75vw]` (oversized on wide screens), shrinks all text with `--pagefind-ui-scale: 0.9`, and its dev-mode fallback notice looks broken.

## Goals

- Both surfaces read as native parts of the light theme, and flip cleanly to dark mode.
- Larger, more legible type and better-proportioned sizing.
- The tooltip's "View in Glossary" link is reliably clickable.

## Non-goals (explicitly dropped)

- Custom search result rendering: **no** pillar color-dots, breadcrumbs, or custom arrow-key row navigation. We restyle Pagefind's native UI rather than replacing it. (Revisitable later.)
- No changes to glossary content, term matching, or which elements get wrapped.

---

## Part 1 — Glossary tooltip (direction C: caret popover)

### Visual

Restyle the existing `#glossary-tooltip` element in place. Target look:

- **Card:** white background, `1px` subtle gray border, `rounded-xl`, soft shadow. Flips to a dark-gray card (`bg-gray-800`/`bg-gray-900`) with light text in dark mode.
- **Caret:** a small arrow (CSS pseudo-element, rotated square) pointing toward the term — up when the card is below the term, down when it's flipped above.
- **Term heading (new):** the canonical glossary term in bold (`text-gray-900` / dark: `text-white`), ~14–15px.
- **Definition:** ~14px (`text-sm`), comfortable `leading-relaxed`, `text-gray-600` / dark: `text-gray-300`.
- **Link:** "View in Glossary →" in indigo (`text-indigo-600` / dark: `text-indigo-400`), with hover state.
- **Sizing:** width `max-w-xs` → ~`max-w-sm` (~340px); padding from `px-3 py-2` → ~`p-4`.

### Term heading data

The mouseover handler currently sets only `tooltipDef.textContent` from `span.dataset.def`. To show the canonical term (not the matched alias or its casing):

- In the matcher-build loop, include `term: t.term` on each matcher entry (for both the term and its aliases).
- When wrapping, set `span.dataset.term = termDef.term`.
- Add a `#glossary-tooltip-term` heading element; in `mouseover`, set its `textContent` from `target.dataset.term`.

### Interaction (fixes the dismiss-before-click bug)

Root cause: the container is `pointer-events-none`, and `mouseout` hides the tooltip immediately unless the pointer lands on another `.glossary-term`. Crossing the gap to the link counts as "left."

Fix — a hover-intent model:

- Make the tooltip **card** `pointer-events-auto` so it can receive hover/click.
- Introduce a hide timer: on term `mouseout`, **wait ~150ms** before hiding instead of hiding immediately.
- On tooltip `mouseenter`, **clear the timer** (keep it open). On tooltip `mouseleave`, hide (after the same short delay, so moving back to the term keeps it open).
- Keep the term→card gap small / visually bridged by the caret so the short delay is enough to cross it.

Net effect: the popover stays open while the pointer travels to the link, and still dismisses when the pointer moves away from both the term and the card.

### Files

- [src/layouts/BaseLayout.astro](../../../src/layouts/BaseLayout.astro) — tooltip markup (add term heading + caret), classes, the `<style is:global>` block (caret + theming), and the inline `mouseover`/`mouseout` script (term data, hide-timer, placement flag for caret direction).

---

## Part 2 — Search overlay (restyle Pagefind)

Keep Pagefind's UI and native result rows; restyle the modal shell and Pagefind's generated elements via CSS variables and class overrides.

### Changes

- **Width:** modal `max-w-[75vw]` → `max-w-[760px]` (with `w-full` + the dialog's padding this resolves to ~`min(760px, 92vw)`).
- **Scale:** `--pagefind-ui-scale: 0.9` → `1` (full-size text). Bump the search input font-size if needed via the Pagefind input class.
- **Input chrome:** an **ESC** pill in the input area (added as our own element in the modal wrapper; Pagefind already renders a search icon).
- **Footer:** a static footer bar inside the modal with an `esc` hint. Honest scope — only `esc` (which works); no faked ↑↓ row-nav.
- **Result rows:** restyle Pagefind's native rows (`.pagefind-ui__result` and friends) for comfortable padding, rounded hover, and correct light/dark colors via the existing `--pagefind-ui-*` variables (already themed at lines 102–118).
- **Dev notice:** style the "Search is only available after running `npm run build`" fallback ([src/components/Search.astro](../../../src/components/Search.astro), lines 24–26) so it looks intentional (centered, muted, padded) rather than broken.

### Note on exact selectors

Pagefind generates its own DOM (`.pagefind-ui__search-input`, `.pagefind-ui__result`, etc.). The precise class overrides are finalized during implementation against the built (`npm run build`) output, since Pagefind UI isn't active in `npm run dev`.

### Files

- [src/components/Search.astro](../../../src/components/Search.astro) — modal wrapper markup (ESC pill + footer), width class, and the `<style is:global>` block (scale, input, result-row, and dev-notice overrides).

---

## Verification

- `npm run build` succeeds (required to exercise the real Pagefind UI).
- `npm run preview` and manually check, in **both light and dark mode**:
  - Tooltip: hover a glossary term → card matches the theme, shows term heading + definition + link; move the pointer onto the card and click "View in Glossary" → navigates without the tooltip vanishing first.
  - Search: ⌘K and `/` open the modal at ~760px with full-size text, ESC pill + footer visible, results legible, `esc`/backdrop-click close it.
- Confirm the dev-mode fallback notice (in `npm run dev`) looks intentional.
