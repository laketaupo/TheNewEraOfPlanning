# Topic Page Rich Design

**Date:** 2026-06-04
**Scope:** `src/layouts/TopicLayout.astro` — visual redesign to match landing page style

---

## Goal

Make text-only topic pages feel as polished as the landing page. The landing page uses a grid background, radial gradient, chapter-colored badges, and card components. Topic pages should use the same visual language: hero header with the full landing treatment, clean reading area using the same card/color vocabulary.

---

## Approach

**B — Header match + clean reading area.**

The topic hero gets the full landing page treatment. The body reading area is clean white/gray with no background pattern, but all prose components (blockquotes, tables, headings) use the same card style and color system as the landing page.

---

## Section 1 — Topic Hero

Replaces the current flat `<article>` header.

**Structure:**
- Wrapping `<div>` with `relative overflow-hidden` to contain the background layers
- Grid background layer: same `bg-[linear-gradient(to_right,...)]` as landing
- Radial gradient overlay: `bg-radial-gradient` from landing page CSS
- Top accent line: 3px `linear-gradient` from chapter accent color to transparent
- Inner content div: `max-w-3xl mx-auto px-6 pt-14 pb-16`

**Content (top to bottom):**
1. Chapter badge — same pill as landing's "Interactive Learning Guide":
   - `inline-flex items-center gap-2 text-xs font-medium rounded-full px-3 py-1`
   - Chapter-colored bg tint, border, and text (e.g. `bg-indigo-50 border-indigo-200 text-indigo-600`)
   - Pulsing dot: `w-1.5 h-1.5 rounded-full bg-{color}-500 animate-pulse`
   - Text: `{chapterTitle} · Topic {topicOrder}`
2. Title: `text-4xl sm:text-5xl font-bold tracking-tight leading-tight text-gray-900 dark:text-white`
3. Description: `text-lg text-gray-600 dark:text-gray-400 leading-relaxed max-w-2xl`

**Chapter color system:**
Add `accentColorMap` to the frontmatter mapping chapter color names to hex values (indigo `#6366f1`, violet `#8b5cf6`, sky `#0ea5e9`, emerald `#10b981`). Add badge bg/border/text class maps (same pattern as landing page `colorBgMap` / `colorTextMap`). Set `--accent: {hex}` as inline CSS variable on `<main>` so all child elements can reference it.

---

## Section 2 — Reading Area

Replaces the current `<article>` body.

**Structure:**
- `<div class="bg-white dark:bg-gray-950">` wrapping the article
- `<article class="max-w-3xl mx-auto px-6 py-14">`
- `.topic-prose` div with Tailwind prose classes (no change to class list, styling via `is:global` CSS)

**Prose element styles (`<style is:global>`):**

| Element | Treatment |
|---|---|
| `h2` | Bold, `font-size: 1.5rem`, bottom border `#e5e7eb` + short accent underline using `var(--accent)` via `::after` pseudo |
| `h3` | `font-size: 1.0625rem`, left border `2px solid var(--accent)` with `padding-left: 0.75rem` |
| `blockquote` | Chapter card style: `rounded-2xl`, `border`, `border-left: 4px solid var(--accent)`, bg `var(--accent-subtle)` in both light and dark, `font-style: normal` |
| `table` | `rounded-2xl border` with `box-shadow`, `border-collapse: separate; border-spacing: 0`, thead bg `#f9fafb`, th uppercase small-caps, zebra rows, hover tinted with accent |
| `code` (inline) | Accent-colored text, tinted bg, `border`, `border-radius: 0.375rem` |
| `pre` | Dark `#1e1e2e` card, `border-radius: 0.875rem`, `box-shadow` |
| `ul/ol markers` | `var(--accent)` color |
| `hr` | Gradient fade `transparent → #e5e7eb → transparent` |
| `strong` | `font-weight: 700`, chapter accent color |

**CSS variables:** Two variables set on `<main>` via inline style:
- `--accent` — the chapter's primary color hex (e.g. `#6366f1` for indigo)
- `--accent-subtle` — a very light tint for backgrounds (e.g. `rgba(99,102,241,0.07)` for indigo)

Both are precomputed in the frontmatter via `accentColorMap` and `accentSubtleMap`. All `is:global` CSS rules reference these variables so every element adapts per chapter automatically.

---

## Files Changed

- `src/layouts/TopicLayout.astro` — all changes contained here

---

## Out of Scope

- `NodeTopicLayout.astro` (interactive/graph topics) — not changed
- Content `.md` files — not changed
- Landing page, chapter index pages — not changed
