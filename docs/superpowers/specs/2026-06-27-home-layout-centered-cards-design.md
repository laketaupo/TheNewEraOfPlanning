# Home Screen Layout Redesign

**Date:** 2026-06-27
**Branch:** `feat/home-layout-centered-cards`
**File affected:** `src/pages/index.astro`

## Goal

Reposition the home screen so that:
- The title and subtitle are anchored to the top center of the viewport with breathing room from the top edge.
- The two navigation cards are always vertically and horizontally centered in the full viewport, independent of the title position.
- The layout adapts cleanly to all screen sizes and ratios.

## What Gets Removed

- The "Planning Hub" dot + text logo in the top-left corner (the `<div>` wrapping the purple dot and `<span>` with "Planning Hub").

## Layout: Mobile (below `md`, < 768px)

Normal document flow — no absolute positioning:

- Outer container: `min-h-screen flex flex-col items-center px-6 pt-12 pb-12`
- Title block: centered, at the top after `pt-12`
- Cards: stacked vertically (`flex flex-col gap-6 w-full max-w-md`) below the title with `mt-10` top margin

Cards fill the available width up to a `max-w-md` constraint so they don't become too narrow on small phones.

## Layout: Desktop (md and above, ≥ 768px)

Two independently positioned layers inside a `relative min-h-screen` container:

### Title layer
```
position: absolute
top: 3rem (pt-12)
inset-x: 0
text-align: center
z-index: 10
padding: 0 2rem
```
Title and subtitle sit near the top of the viewport, horizontally centered, independent of the cards.

### Cards layer
```
position: absolute
inset: 0
display: flex
align-items: center
justify-content: center
z-index: 10
padding: 0 2rem
```
Cards are a 2-column grid (`grid grid-cols-2 gap-6`) with a `max-w-3xl` constraint to prevent excessive width on ultrawide screens. This centers them precisely at the vertical and horizontal midpoint of the viewport.

## Responsive Breakpoint Summary

| Breakpoint | Title | Cards layout | Cards position |
|---|---|---|---|
| < md (mobile) | Normal flow, top of page | Single column, stacked | Below title in flow |
| ≥ md (desktop) | Absolute, top 3rem | Two columns, side by side | Absolute center of viewport |

## What Stays Unchanged

- Grid background pattern and radial glow overlay
- All `.lcard` styles: colors, border, hover animation, dark mode variants
- Card content: titles, descriptions, links, icons
- `BASE_URL` prefixing on card `href` attributes
- Dark mode support throughout

## Implementation Notes

- The outer container switches from the current 5-row CSS grid to `relative min-h-screen` — the grid rows are no longer needed.
- On mobile, the container switches to `flex flex-col items-center` to stack content naturally.
- Use Tailwind responsive prefixes (`md:`) to switch between the two modes.
- No JavaScript changes required — purely CSS/HTML restructuring.
