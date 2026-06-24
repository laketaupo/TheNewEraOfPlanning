# IntroOverlay Full-Build Sync — Design Spec

**Date:** 2026-06-24
**Status:** Approved

## Context

The IntroOverlay (`src/components/IntroOverlay.astro`) was originally designed with four sections covering the four-pillar structure, navigation, progress tracking, and role-based learning paths. Since then the build has added:

- **Personal notes** — amber pen button on every topic page (add/edit/hover-preview)
- **Note search** — the `/` search modal surfaces matching notes alongside content
- **Notes tab + copy-all export** — dashboard Notes tab, "Copy all" to clipboard
- **Glossary tooltips** — hover any underlined term for an inline definition
- **FAQ page** — `?` icon in the top-right nav, or `/faq`

None of these appear in the current overlay. This spec updates it to reflect the full current build.

## Approach

Keep the four existing sections. Add one new **Personal notes** section (after "Tracking your progress"). Update the **Getting around** body to mention Glossary tooltips and FAQ. All other sections, the overlay shell, header, footer, and animation are untouched.

## Section Structure

| # | Section | Change |
|---|---|---|
| 1 | Four learning pillars | unchanged |
| 2 | Getting around | body updated |
| 3 | Tracking your progress | unchanged |
| 4 | Personal notes | **new** |
| 5 | Role-based learning paths | unchanged (moves from position 4) |

## Section 2 — Getting around (updated body)

> Press **O** at any time to open the full navigation menu and jump to any topic directly. Use **/** to search by keyword across all content — it also searches your personal notes. Inside a topic, the previous and next arrows at the bottom move you through the chapter in sequence. Hover any underlined term to see its definition inline from the Glossary. For quick answers to common questions, use the **?** icon in the top-right nav or visit `/faq`.

Changes from current: `/` sentence gains "— it also searches your personal notes"; two new sentences added for Glossary tooltips and FAQ.

## Section 4 — Personal notes (new)

**Icon:** Pencil/edit SVG — `<path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 013 3L7 19l-4 1 1-4L16.5 3.5z"/>` — same icon used on the note button in topic-progress.ts.

**Heading:** Personal notes

**Body:**

> On any topic page, the amber pen button next to the progress controls lets you write a note — a thought, a question, something to follow up on. Hover the button to preview your note without opening it. The search bar (**/**) finds notes alongside content results, so you can locate a note by what you wrote rather than where you wrote it. To review everything in one place, open the progress dashboard (the person icon, top-right), switch to the **Notes** tab, and use **Copy all** to export your notes as plain text.

## Files Changed

| File | Change |
|---|---|
| `src/components/IntroOverlay.astro` | Update Section 2 body; add Section 4 (Personal notes) between existing sections 3 and 4 |

No other files change. No new routes, components, or localStorage keys.

## Out of Scope

- Changing the overlay shell, header, footer, or animation
- Adding a dedicated "Glossary" or "FAQ" section (covered briefly in Getting around)
- Any changes to the notes, search, glossary, or FAQ features themselves
