# Glossary/FAQ Combined Navigation — Design Spec

Date: 2026-06-23

## Overview

Combine the separate Glossary and FAQ nav icons into a single icon in the top-right bar, and add a two-tab bar (`Glossary | FAQ`) to the top of both reference pages. The pages remain separate Astro files at `/glossary` and `/faq` — tabs are plain `<a>` links between them, no JS required.

---

## Changes

### 1. `src/layouts/BaseLayout.astro` — Combined icon

Replace the two separate icons (Glossary book icon + FAQ question-mark icon) with a single icon:

- **Icon:** book SVG (same as the existing Glossary icon)
- **href:** `/glossary`
- **aria-label:** `"Open Glossary/FAQ"`
- **Tooltip:** `"Glossary/FAQ"`
- **Position:** same slot in the icon bar (between Search and Theme toggle)
- **Classes:** identical to the existing Glossary icon link classes

### 2. `src/pages/glossary.astro` — Tab bar

Add a tab bar immediately after the page `<h1>` / subtitle `<p>` block, before the A-Z jump nav:

```
[ Glossary ]  [ FAQ ]
  ^active        ^inactive
```

- **Glossary tab:** active state — indigo text + bottom border underline
- **FAQ tab:** muted gray, links to `/faq`
- No JS — plain anchor links

### 3. `src/pages/faq.astro` — Tab bar

Add the same tab bar immediately after the page `<h1>` / subtitle `<p>` block, before the filter input:

```
[ Glossary ]  [ FAQ ]
  ^inactive     ^active
```

- **Glossary tab:** muted gray, links to `/glossary`
- **FAQ tab:** active state — indigo text + bottom border underline
- No JS — plain anchor links

### 4. `src/components/SiteOverlay.astro` — Footer link

Replace the current two-link group (`<div class="flex items-center gap-3">` with Glossary + FAQ anchors) with a single anchor:

- **Text:** `Glossary/FAQ`
- **href:** `/glossary`
- **Classes:** same `text-xs text-indigo-600 dark:text-indigo-400 hover:underline`

---

## Tab Bar HTML Pattern

Both pages use identical tab bar markup, with only the active/inactive state swapped:

```html
<div class="flex gap-1 mb-8 border-b border-gray-100 dark:border-neutral-800">
  <a
    href="/glossary"
    class="px-4 py-2 text-sm font-semibold [ACTIVE or INACTIVE classes]"
  >Glossary</a>
  <a
    href="/faq"
    class="px-4 py-2 text-sm font-semibold [ACTIVE or INACTIVE classes]"
  >FAQ</a>
</div>
```

**Active tab classes:** `text-indigo-600 dark:text-indigo-400 border-b-2 border-indigo-600 dark:border-indigo-400 -mb-px`

**Inactive tab classes:** `text-gray-400 dark:text-neutral-500 hover:text-gray-700 dark:hover:text-neutral-300 transition-colors`

The `-mb-px` on the active tab pulls it down by 1px to overlap the container's bottom border, creating the standard "connected tab" visual.

---

## Out of Scope

- No URL changes — `/glossary` and `/faq` remain as-is
- No client-side tab switching or JS state management
- No changes to the glossary or FAQ data/lib files
- No changes to other layout files or topic pages
