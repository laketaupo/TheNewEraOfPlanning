# Dark Theme: Gray → Neutral Palette

**Date:** 2026-06-19  
**Status:** Approved — implementing

## Problem

Tailwind's `gray` palette has a noticeable cool blue cast. The dark theme uses `dark:*-gray-*` throughout, giving the app a "dark blue" feel rather than true dark grey.

## Solution

Replace all `dark:*-gray-*` Tailwind classes with their `dark:*-neutral-*` equivalents (same numeric step). Also update the three hardcoded hex values in the scrollbar CSS in `BaseLayout.astro`.

## Colour Mapping

| Step | gray (old) | neutral (new) | Role |
|------|-----------|--------------|------|
| 950  | #030712   | #0a0a0a      | Body background |
| 900  | #111827   | #171717      | Surface (sidebar, cards) |
| 800  | #1f2937   | #262626      | Elevated / hover states |
| 700  | #374151   | #404040      | Borders |
| 600  | #4b5563   | #525252      | Muted / dimmed |
| 500  | #6b7280   | #737373      | Secondary text |
| 400  | #9ca3af   | #a3a3a3      | Secondary text |
| 300  | #d1d5db   | #d4d4d4      | Text |
| 200  | #e5e7eb   | #e5e5e5      | Text |
| 100  | #f3f4f6   | #f5f5f5      | Body text |

## Scope

- All files in `src/layouts/` (7 layout files + BaseLayout)
- All files in `src/components/`
- Any page files with dark mode gray classes
- Light mode classes (`bg-gray-*`, `text-gray-*` without `dark:` prefix) are **not changed**
- Chapter/pillar accent colours (emerald, indigo, teal, etc.) are **not changed**
- Brand indigo for interactive elements is **not changed**

## Scrollbar hex values (BaseLayout.astro)

| Old hex | New hex | Tailwind step |
|---------|---------|---------------|
| #111827 | #171717 | neutral-900 |
| #374151 | #404040 | neutral-700 |
| #4b5563 | #525252 | neutral-600 |
