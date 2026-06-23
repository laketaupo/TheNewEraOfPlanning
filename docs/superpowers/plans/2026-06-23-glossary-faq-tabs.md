# Glossary/FAQ Combined Navigation Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the two separate Glossary and FAQ nav icons with a single combined icon, and add a `Glossary | FAQ` tab bar to both reference pages.

**Architecture:** Pure HTML/Astro changes across four files — no new files, no JS, no data changes. The two existing pages (`/glossary`, `/faq`) stay at their URLs; tab switching is plain `<a>` links between them.

**Tech Stack:** Astro 4, Tailwind CSS 3, static site generation.

## Global Constraints

- No test runner configured — verify with `npm run build` (zero errors required).
- Tailwind classes must be complete strings in source — no interpolation.
- No JS for tab switching — plain anchor links only.
- Active tab: `text-indigo-600 dark:text-indigo-400 border-b-2 border-indigo-600 dark:border-indigo-400 -mb-px`
- Inactive tab: `text-gray-400 dark:text-neutral-500 hover:text-gray-700 dark:hover:text-neutral-300 transition-colors`
- Tab container: `flex gap-1 mb-8 border-b border-gray-100 dark:border-neutral-800`

---

## File Map

| Action | Path | Change |
|---|---|---|
| Modify | `src/layouts/BaseLayout.astro` | Replace two icon blocks (lines 61–87) with one combined icon |
| Modify | `src/components/SiteOverlay.astro` | Replace two-link div (lines 217–220) with single link |
| Modify | `src/pages/glossary.astro` | Reduce subtitle margin, insert tab bar after subtitle |
| Modify | `src/pages/faq.astro` | Reduce subtitle margin, insert tab bar after subtitle |

---

## Task 1: Combined nav icon + SiteOverlay footer

**Files:**
- Modify: `src/layouts/BaseLayout.astro:61–87`
- Modify: `src/components/SiteOverlay.astro:217–220`

**Interfaces:**
- Produces: single `<!-- Glossary/FAQ -->` icon block; simplified overlay footer link — consumed visually by the browser, referenced by Task 2 only for context.

- [ ] **Step 1: Replace the two icon blocks in `src/layouts/BaseLayout.astro`**

Find and replace the entire `<!-- Glossary -->` block and `<!-- FAQ -->` block (lines 61–87, currently two separate `<div class="relative group/tip">` blocks):

Old (lines 61–87):
```html
      <!-- Glossary -->
      <div class="relative group/tip">
        <a
          href="/glossary"
          aria-label="Open glossary"
          class="p-2 rounded-lg text-gray-500 hover:text-gray-900 dark:text-neutral-400 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-neutral-800 transition-colors flex"
        >
          <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.247m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.247"/>
          </svg>
        </a>
        <span class="pointer-events-none absolute top-full right-0 mt-1.5 whitespace-nowrap rounded-md bg-gray-900 dark:bg-neutral-700 text-white text-[11px] px-2 py-1 opacity-0 group-hover/tip:opacity-100 transition-opacity">Glossary</span>
      </div>

      <!-- FAQ -->
      <div class="relative group/tip">
        <a
          href="/faq"
          aria-label="Open FAQ"
          class="p-2 rounded-lg text-gray-500 hover:text-gray-900 dark:text-neutral-400 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-neutral-800 transition-colors flex"
        >
          <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
            <path stroke-linecap="round" stroke-linejoin="round" d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
          </svg>
        </a>
        <span class="pointer-events-none absolute top-full right-0 mt-1.5 whitespace-nowrap rounded-md bg-gray-900 dark:bg-neutral-700 text-white text-[11px] px-2 py-1 opacity-0 group-hover/tip:opacity-100 transition-opacity">FAQ</span>
      </div>
```

New (single combined block):
```html
      <!-- Glossary/FAQ -->
      <div class="relative group/tip">
        <a
          href="/glossary"
          aria-label="Open Glossary/FAQ"
          class="p-2 rounded-lg text-gray-500 hover:text-gray-900 dark:text-neutral-400 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-neutral-800 transition-colors flex"
        >
          <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.247m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.247"/>
          </svg>
        </a>
        <span class="pointer-events-none absolute top-full right-0 mt-1.5 whitespace-nowrap rounded-md bg-gray-900 dark:bg-neutral-700 text-white text-[11px] px-2 py-1 opacity-0 group-hover/tip:opacity-100 transition-opacity">Glossary/FAQ</span>
      </div>
```

Also update the comment on line 43 from:
```html
    <!-- Fixed icon bar (top-right): search · glossary · theme · dashboard -->
```
to:
```html
    <!-- Fixed icon bar (top-right): search · glossary/faq · theme · dashboard -->
```

- [ ] **Step 2: Simplify the footer link in `src/components/SiteOverlay.astro`**

Find and replace lines 217–220:

Old:
```html
        <div class="flex items-center gap-3">
          <a href="/glossary" class="text-xs text-indigo-600 dark:text-indigo-400 hover:underline">Glossary</a>
          <a href="/faq" class="text-xs text-indigo-600 dark:text-indigo-400 hover:underline">FAQ</a>
        </div>
```

New:
```html
        <a href="/glossary" class="text-xs text-indigo-600 dark:text-indigo-400 hover:underline">Glossary/FAQ</a>
```

- [ ] **Step 3: Run build to verify**

```bash
npm run build
```

Expected: succeeds with zero errors.

- [ ] **Step 4: Commit**

```bash
git add src/layouts/BaseLayout.astro src/components/SiteOverlay.astro
git commit -m "feat: combine Glossary and FAQ into single nav icon"
```

---

## Task 2: Tab bar on Glossary and FAQ pages

**Files:**
- Modify: `src/pages/glossary.astro:28–30`
- Modify: `src/pages/faq.astro:39–42`

**Interfaces:**
- Consumes: `/glossary` and `/faq` routes (both exist from prior work)
- Produces: tab bar visible on both pages; active tab highlighted per-page

- [ ] **Step 1: Add tab bar to `src/pages/glossary.astro`**

The subtitle `<p>` is currently on line 28 with `mb-8`. Reduce its margin to `mb-4` and insert the tab bar immediately after it (before the `<!-- A-Z jump links -->` comment).

Old (line 28):
```html
    <p class="text-gray-500 dark:text-neutral-400 mb-8">{terms.length} planning terms defined.</p>
```

New (line 28 + inserted tab bar):
```html
    <p class="text-gray-500 dark:text-neutral-400 mb-4">{terms.length} planning terms defined.</p>

    <!-- Tab bar -->
    <div class="flex gap-1 mb-8 border-b border-gray-100 dark:border-neutral-800">
      <a href="/glossary" class="px-4 py-2 text-sm font-semibold text-indigo-600 dark:text-indigo-400 border-b-2 border-indigo-600 dark:border-indigo-400 -mb-px">Glossary</a>
      <a href="/faq" class="px-4 py-2 text-sm font-semibold text-gray-400 dark:text-neutral-500 hover:text-gray-700 dark:hover:text-neutral-300 transition-colors">FAQ</a>
    </div>
```

- [ ] **Step 2: Add tab bar to `src/pages/faq.astro`**

The subtitle `<p>` is currently on line 39 with `mb-6`. Reduce its margin to `mb-4` and insert the tab bar immediately after it (before the `<!-- Text filter -->` comment).

Old (line 39):
```html
    <p class="text-gray-500 dark:text-neutral-400 mb-6">{entries.length} questions across {pillarsWithEntries.length} pillars.</p>
```

New (line 39 + inserted tab bar):
```html
    <p class="text-gray-500 dark:text-neutral-400 mb-4">{entries.length} questions across {pillarsWithEntries.length} pillars.</p>

    <!-- Tab bar -->
    <div class="flex gap-1 mb-8 border-b border-gray-100 dark:border-neutral-800">
      <a href="/glossary" class="px-4 py-2 text-sm font-semibold text-gray-400 dark:text-neutral-500 hover:text-gray-700 dark:hover:text-neutral-300 transition-colors">Glossary</a>
      <a href="/faq" class="px-4 py-2 text-sm font-semibold text-indigo-600 dark:text-indigo-400 border-b-2 border-indigo-600 dark:border-indigo-400 -mb-px">FAQ</a>
    </div>
```

- [ ] **Step 3: Run build to verify**

```bash
npm run build
```

Expected: succeeds with zero errors.

- [ ] **Step 4: Verify visually in browser**

```bash
npm run dev
```

Open `http://localhost:4321/glossary`. Confirm:
- Tab bar appears below the subtitle with "Glossary" tab active (indigo, underlined) and "FAQ" tab muted gray
- Clicking "FAQ" navigates to `http://localhost:4321/faq` with the FAQ tab now active and Glossary tab muted
- The top-right icon bar shows one book icon (not two); hovering shows "Glossary/FAQ" tooltip
- The SiteOverlay footer (press `O`) shows a single "Glossary/FAQ" link

- [ ] **Step 5: Commit**

```bash
git add src/pages/glossary.astro src/pages/faq.astro
git commit -m "feat: add Glossary/FAQ tab bar to both reference pages"
```
