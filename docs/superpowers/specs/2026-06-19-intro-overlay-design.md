# Intro Overlay — Design Spec

**Date:** 2026-06-19  
**Status:** Approved

---

## Context

New users land on the app with no onboarding. There is no explanation of the four-pillar structure, how navigation works, how progress tracking works, or that role-based learning paths exist. This overlay addresses that gap by showing a concise, one-page welcome on the user's first visit.

---

## What We're Building

A full-screen overlay panel that:
- Auto-shows on a user's first visit (never again after that)
- Can be re-opened at any time via a new **ⓘ info button** in the top-right icon bar
- Is a single scrollable panel — no wizard steps, no hero section
- Covers four content areas: pillars, navigation, progress tracking, and role-based courses

---

## Visual Design

**Panel:** `w-[92vw] max-w-4xl`, `max-h-[88vh]`, `rounded-2xl shadow-2xl`, `bg-white dark:bg-gray-900`. Centered with `flex items-center justify-center`.

**Backdrop:** `bg-black/50 backdrop-blur-sm`. Clicking it closes the panel.

**Header:** `px-10 pt-10 pb-6`. A small uppercase label ("Planning Hub"), then an `h1` title ("Welcome — here's what you can do here"). Close ✕ button top-right of the header row.

**Content sections:** Four rows separated by `border-b border-gray-100 dark:border-gray-800`, each `py-6`. Each row is a flex row: a small monochrome icon (`w-7`, `text-gray-400 dark:text-gray-500`) on the left, then a heading (`text-base font-semibold`) and a full prose paragraph (`text-sm text-gray-500 dark:text-gray-400 leading-relaxed`) on the right.

**Footer:** `border-t`, `px-10 py-5`. Right-aligned: "Get started →" button (`bg-gray-900 dark:bg-white`, inverted colors).

**Animation:** `fadeUp` — `opacity: 0 → 1`, `translateY: 8px → 0` over `0.2s ease-out`.

**Fully monochrome** — no pillar-color accents anywhere in the overlay.

---

## Content

| Section | Icon | Heading | Body |
|---|---|---|---|
| Pillars | grid/squares | Four learning pillars | Explains Technology, Process, Data, People structure — pillars → modules → chapters → topics |
| Navigate | arrow/compass | Getting around | `O` for nav menu, `/` for search, prev/next arrows inside topics |
| Progress | checkmark | Tracking your progress | Mark Complete or Unclear at the bottom of each topic; person icon (top-right) opens the dashboard |
| Roles | group/people | Role-based learning paths | Learning paths from the home page, curated by role, five phases, progress tracked separately |

---

## Behaviour

### ⓘ Button
- Added to the existing icon bar in `BaseLayout.astro`: `fixed top-2 right-4 z-55`
- Positioned after the dashboard button (rightmost)
- Same style as existing buttons: `w-8 h-8 rounded-lg`, icon-only, hover `bg-gray-200 dark:bg-gray-800`
- Icon: info circle (`circle + path d="M12 16v-4M12 8h.01"`)

### Auto-show on first visit
- On `DOMContentLoaded`, check `localStorage.getItem('platform-intro-seen')`
- If absent → open the overlay
- On close (any method) → `localStorage.setItem('platform-intro-seen', 'true')`

### Close methods
1. Click the ✕ button
2. Click the backdrop
3. Press `Escape`
4. Click "Get started →"

All four set `platform-intro-seen` in `localStorage` and hide the overlay.

### z-index
`z-9995` — above the dashboard (`z-9990`), below the site overlay (`z-9999`).

---

## Files to Create / Modify

| Action | File |
|---|---|
| **Create** | `src/components/IntroOverlay.astro` |
| **Modify** | `src/layouts/BaseLayout.astro` — import + render `<IntroOverlay />`, add ⓘ button to icon bar |

---

## Verification

1. `npm run dev` — open the app in a private/incognito window (no `platform-intro-seen` in localStorage)
2. Overlay should appear automatically on load
3. Close via all four methods and confirm it does not re-appear on page refresh
4. Clear `platform-intro-seen` from localStorage → overlay should appear again
5. Click the ⓘ button → overlay opens (even after the auto-show flag is set)
6. Test dark mode — all text and borders should render correctly
7. `npm run build` — confirm build passes with no errors
