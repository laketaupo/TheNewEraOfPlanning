# Glossary Tooltip & Search Overlay Restyle — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Restyle the glossary hover tooltip (caret popover, theme-aware, clickable link) and the ⌘K/`/` search overlay (760px Pagefind restyle) so both fit the light theme, flip cleanly to dark mode, and are larger/more legible.

**Architecture:** Two self-contained presentational changes. (1) The glossary tooltip lives entirely inside [src/layouts/BaseLayout.astro](../../../src/layouts/BaseLayout.astro) — markup, a `<style is:global>` block, and an inline `<script>`; we restyle the card, add a term heading, add a caret, and replace the immediate-hide logic with hover-intent. (2) The search overlay lives entirely inside [src/components/Search.astro](../../../src/components/Search.astro) — we widen the modal, add an ESC pill + footer, tidy the dev-mode notice, and restyle Pagefind's native UI through its CSS variables and generated classes. No new files, no content/data changes.

**Tech Stack:** Astro 4, Tailwind CSS 3 (arbitrary-value classes), Pagefind UI, vanilla inline JS.

**Testing note:** This repo has no unit-test framework or linter (per CLAUDE.md), and Pagefind UI is only active after `npm run build`. Each task is verified by (a) a clean `npm run build` and (b) a specific manual check in `npm run preview` (served at http://localhost:4321). Commit after each task.

---

## File Structure

- **Modify:** [src/layouts/BaseLayout.astro](../../../src/layouts/BaseLayout.astro)
  - Tooltip markup block (lines ~44–52): add term heading, change classes.
  - Matcher build loop (lines ~64–70) and span creation (lines ~119–123): carry the canonical term.
  - Tooltip script (lines ~138–168): hover-intent show/hide + caret placement.
  - `<style is:global>` block (lines ~172–181): caret pseudo-element.
- **Modify:** [src/components/Search.astro](../../../src/components/Search.astro)
  - Modal wrapper markup (lines ~22–27): width, ESC pill, footer, dev-notice styling.
  - `<style is:global>` block (lines ~102–131): Pagefind scale/input/result-row overrides.

---

## Task 1: Tooltip card restyle + term heading element

**Files:**
- Modify: `src/layouts/BaseLayout.astro` (tooltip markup, lines ~44–52)

- [ ] **Step 1: Replace the tooltip markup**

Replace this block:

```html
    <!-- Tooltip container -->
    <div
      id="glossary-tooltip"
      role="tooltip"
      class="pointer-events-none fixed z-[300] hidden max-w-xs rounded-lg bg-gray-900 dark:bg-gray-800 text-white text-xs px-3 py-2 shadow-lg"
    >
      <p id="glossary-tooltip-def" class="leading-relaxed"></p>
      <a id="glossary-tooltip-link" href="/glossary" class="pointer-events-auto mt-1 block text-indigo-300 hover:text-indigo-200">→ Glossary</a>
    </div>
```

with:

```html
    <!-- Tooltip container -->
    <div
      id="glossary-tooltip"
      role="tooltip"
      data-placement="bottom"
      class="pointer-events-auto fixed z-[300] hidden max-w-sm rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-4 shadow-xl"
    >
      <p id="glossary-tooltip-term" class="mb-1 text-sm font-bold text-gray-900 dark:text-white"></p>
      <p id="glossary-tooltip-def" class="text-sm leading-relaxed text-gray-600 dark:text-gray-300"></p>
      <a id="glossary-tooltip-link" href="/glossary" class="mt-2 inline-block text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:text-indigo-500">View in Glossary →</a>
    </div>
```

Key changes: `pointer-events-none` → `pointer-events-auto` (card is hoverable/clickable), dark sticker → white/dark-gray themed card, `text-xs` → `text-sm`, `max-w-xs` → `max-w-sm`, `p-4` padding, new `#glossary-tooltip-term` heading, `data-placement` attribute for the caret (added in Task 3).

- [ ] **Step 2: Build**

Run: `npm run build`
Expected: completes without errors (exit 0).

- [ ] **Step 3: Manual check**

Run `npm run preview`, open http://localhost:4321, navigate to any topic page, and hover an underlined glossary term.
Expected: a **white** card (in light mode) with the definition in larger text and a "View in Glossary →" link. (The bold term line is still empty — wired in Task 2. No caret yet — added in Task 3.)

- [ ] **Step 4: Commit**

```bash
git add src/layouts/BaseLayout.astro
git commit -m "Restyle glossary tooltip as themed card with term heading"
```

---

## Task 2: Carry the canonical term into the tooltip

**Files:**
- Modify: `src/layouts/BaseLayout.astro` (matcher build ~64–70, span creation ~119–123)

- [ ] **Step 1: Add `term` to each matcher**

Replace this block:

```js
      // Build a flat list of { matchStr, slug, definition } covering term + aliases
      const matchers = [];
      for (const t of terms) {
        matchers.push({ matchStr: t.term, slug: t.slug, definition: t.definition });
        for (const alias of (t.aliases || [])) {
          matchers.push({ matchStr: alias, slug: t.slug, definition: t.definition });
        }
      }
```

with:

```js
      // Build a flat list of { matchStr, slug, definition, term } covering term + aliases
      const matchers = [];
      for (const t of terms) {
        matchers.push({ matchStr: t.term, slug: t.slug, definition: t.definition, term: t.term });
        for (const alias of (t.aliases || [])) {
          matchers.push({ matchStr: alias, slug: t.slug, definition: t.definition, term: t.term });
        }
      }
```

- [ ] **Step 2: Store the term on the wrapped span**

Replace this block:

```js
            const span = document.createElement('span');
            span.className = 'glossary-term';
            span.dataset.slug = termDef.slug;
            span.dataset.def = termDef.definition;
            span.textContent = matched;
```

with:

```js
            const span = document.createElement('span');
            span.className = 'glossary-term';
            span.dataset.slug = termDef.slug;
            span.dataset.def = termDef.definition;
            span.dataset.term = termDef.term;
            span.textContent = matched;
```

(The mouseover handler that reads `dataset.term` is updated in Task 3. Setting the attribute now is harmless on its own.)

- [ ] **Step 3: Build**

Run: `npm run build`
Expected: completes without errors (exit 0).

- [ ] **Step 4: Commit**

```bash
git add src/layouts/BaseLayout.astro
git commit -m "Carry canonical glossary term onto wrapped spans"
```

---

## Task 3: Tooltip hover-intent + caret

**Files:**
- Modify: `src/layouts/BaseLayout.astro` (tooltip script ~138–168, `<style is:global>` ~172–181)

- [ ] **Step 1: Replace the tooltip show/hide script**

Replace this block:

```js
      // Tooltip show/hide logic
      const tooltip = document.getElementById('glossary-tooltip');
      const tooltipDef = document.getElementById('glossary-tooltip-def');
      const tooltipLink = document.getElementById('glossary-tooltip-link');

      body.addEventListener('mouseover', function (e) {
        const target = e.target.closest('.glossary-term');
        if (!target) return;
        tooltipDef.textContent = target.dataset.def;
        tooltipLink.href = '/glossary#' + target.dataset.slug;
        tooltip.classList.remove('hidden');
        positionTooltip(target);
      });

      body.addEventListener('mouseout', function (e) {
        if (!e.relatedTarget || !e.relatedTarget.closest('.glossary-term')) {
          tooltip.classList.add('hidden');
        }
      });

      function positionTooltip(el) {
        const rect = el.getBoundingClientRect();
        const ttWidth = tooltip.offsetWidth || 288;
        const ttHeight = tooltip.offsetHeight || 80;
        let left = rect.left;
        let top = rect.bottom + 6;
        if (left + ttWidth > window.innerWidth - 12) left = window.innerWidth - ttWidth - 12;
        if (top + ttHeight > window.innerHeight - 12) top = rect.top - ttHeight - 6;
        tooltip.style.left = left + 'px';
        tooltip.style.top = top + 'px';
      }
```

with:

```js
      // Tooltip show/hide logic (hover-intent: stays open while moving to the card)
      const tooltip = document.getElementById('glossary-tooltip');
      const tooltipTerm = document.getElementById('glossary-tooltip-term');
      const tooltipDef = document.getElementById('glossary-tooltip-def');
      const tooltipLink = document.getElementById('glossary-tooltip-link');
      let hideTimer = null;

      function showTooltip(target) {
        clearTimeout(hideTimer);
        tooltipTerm.textContent = target.dataset.term || '';
        tooltipDef.textContent = target.dataset.def;
        tooltipLink.href = '/glossary#' + target.dataset.slug;
        tooltip.classList.remove('hidden');
        positionTooltip(target);
      }

      function scheduleHide() {
        clearTimeout(hideTimer);
        hideTimer = setTimeout(function () { tooltip.classList.add('hidden'); }, 150);
      }

      body.addEventListener('mouseover', function (e) {
        const target = e.target.closest('.glossary-term');
        if (!target) return;
        showTooltip(target);
      });

      body.addEventListener('mouseout', function (e) {
        const rel = e.relatedTarget;
        const toTerm = rel && rel.closest && rel.closest('.glossary-term');
        const toTooltip = rel && rel.closest && rel.closest('#glossary-tooltip');
        if (!toTerm && !toTooltip) scheduleHide();
      });

      // Keep open while the pointer is over the card; dismiss when it leaves.
      tooltip.addEventListener('mouseenter', function () { clearTimeout(hideTimer); });
      tooltip.addEventListener('mouseleave', function () { scheduleHide(); });

      function positionTooltip(el) {
        const rect = el.getBoundingClientRect();
        const ttWidth = tooltip.offsetWidth || 340;
        const ttHeight = tooltip.offsetHeight || 100;
        let left = rect.left;
        let top = rect.bottom + 8;
        let placement = 'bottom';
        if (left + ttWidth > window.innerWidth - 12) left = window.innerWidth - ttWidth - 12;
        if (left < 12) left = 12;
        if (top + ttHeight > window.innerHeight - 12) {
          top = rect.top - ttHeight - 8;
          placement = 'top';
        }
        tooltip.dataset.placement = placement;
        tooltip.style.left = left + 'px';
        tooltip.style.top = top + 'px';
      }
```

- [ ] **Step 2: Add the caret to the global style block**

Replace this block:

```html
    <style is:global>
      .glossary-term {
        border-bottom: 1px dotted currentColor;
        cursor: help;
        opacity: 0.9;
      }
      .glossary-term:hover {
        opacity: 1;
      }
    </style>
```

with:

```html
    <style is:global>
      .glossary-term {
        border-bottom: 1px dotted currentColor;
        cursor: help;
        opacity: 0.9;
      }
      .glossary-term:hover {
        opacity: 1;
      }
      #glossary-tooltip::before {
        content: '';
        position: absolute;
        left: 18px;
        width: 12px;
        height: 12px;
        background-color: inherit;
        border-top: 1px solid;
        border-left: 1px solid;
        border-color: inherit;
      }
      #glossary-tooltip[data-placement='bottom']::before {
        top: -7px;
        transform: rotate(45deg);
      }
      #glossary-tooltip[data-placement='top']::before {
        bottom: -7px;
        transform: rotate(225deg);
      }
    </style>
```

The caret inherits the card's background and border colors, so it tracks light/dark automatically. `data-placement` flips it: caret on top pointing up when the card is below the term, caret on the bottom pointing down when the card flips above.

- [ ] **Step 3: Build**

Run: `npm run build`
Expected: completes without errors (exit 0).

- [ ] **Step 4: Manual check — content, caret, and the clickable link**

Run `npm run preview`, open http://localhost:4321 on a topic page.
Expected:
1. Hovering a term shows the **bold term name**, definition, link, and a **caret** pointing at the word.
2. Moving the pointer from the word down onto the card and clicking **"View in Glossary →"** navigates to `/glossary#<slug>` — the tooltip no longer vanishes before the click. (This is the reported bug; confirm it's fixed.)
3. Moving the pointer away from both the word and the card dismisses the tooltip.
4. Hover a term near the bottom of the viewport — the card flips above the word and the caret points down.

- [ ] **Step 5: Commit**

```bash
git add src/layouts/BaseLayout.astro
git commit -m "Add hover-intent and caret to glossary tooltip"
```

---

## Task 4: Search modal shell — width, ESC pill, footer, dev notice

**Files:**
- Modify: `src/components/Search.astro` (modal wrapper, lines ~22–27)

- [ ] **Step 1: Replace the modal inner wrapper**

Replace this block:

```html
    <div class="w-full max-w-[75vw] bg-white dark:bg-gray-900 rounded-xl shadow-2xl border border-gray-200 dark:border-gray-700 overflow-hidden">
      <div id="search-container" class="p-2"></div>
      <p id="search-dev-notice" class="hidden text-sm text-gray-500 dark:text-gray-400 px-4 py-3">
        Search is only available after running <code class="font-mono bg-gray-100 dark:bg-gray-800 px-1 rounded">npm run build</code>.
      </p>
    </div>
```

with:

```html
    <div class="relative w-full max-w-[760px] bg-white dark:bg-gray-900 rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-700 overflow-hidden">
      <span class="pointer-events-none absolute right-3 top-3 z-10 rounded-md border border-b-2 border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 px-2 py-1 text-[11px] font-semibold text-gray-400 dark:text-gray-500">ESC</span>
      <div id="search-container" class="px-2 pt-2"></div>
      <p id="search-dev-notice" class="hidden text-center text-sm text-gray-500 dark:text-gray-400 px-6 py-10">
        Search is available after running <code class="font-mono bg-gray-100 dark:bg-gray-800 px-1.5 py-0.5 rounded">npm run build</code>.
      </p>
      <div class="flex items-center gap-4 border-t border-gray-100 dark:border-gray-800 bg-gray-50 dark:bg-gray-950/60 px-4 py-2.5 text-xs text-gray-400 dark:text-gray-500">
        <span class="flex items-center gap-1.5">
          <kbd class="rounded border border-b-2 border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 px-1.5 py-0.5 font-semibold">esc</kbd>
          to close
        </span>
      </div>
    </div>
```

Changes: `max-w-[75vw]` → `max-w-[760px]`; `relative` added so the ESC pill can be absolutely positioned; ESC pill top-right; footer with an `esc` hint (honest scope — only `esc`, which works); dev notice centered/padded so it reads as intentional. Pagefind input gets right-padding in Task 5 so its text doesn't run under the ESC pill.

- [ ] **Step 2: Build**

Run: `npm run build`
Expected: completes without errors (exit 0).

- [ ] **Step 3: Manual check**

Run `npm run preview`, open http://localhost:4321, press `⌘K` (and separately `/`).
Expected: modal opens at ~760px (not full-width), with an **ESC** pill top-right and a footer reading "esc to close". Pressing `Esc` and clicking the dimmed backdrop both close it.

- [ ] **Step 4: Commit**

```bash
git add src/components/Search.astro
git commit -m "Resize search modal to 760px with ESC pill and footer"
```

---

## Task 5: Restyle Pagefind UI — scale, input, result rows

**Files:**
- Modify: `src/components/Search.astro` (`<style is:global>` block, lines ~102–131)

- [ ] **Step 1: Bump the scale and add Pagefind element overrides**

Replace this block:

```css
  #search-container {
    --pagefind-ui-scale: 0.9;
    --pagefind-ui-primary: #6366f1;
    --pagefind-ui-text: rgb(17 24 39);
    --pagefind-ui-background: transparent;
    --pagefind-ui-border: rgb(229 231 235);
    --pagefind-ui-tag: rgb(243 244 246);
    --pagefind-ui-border-width: 1px;
    --pagefind-ui-border-radius: 8px;
    --pagefind-ui-font: inherit;
  }
```

with:

```css
  #search-container {
    --pagefind-ui-scale: 1;
    --pagefind-ui-primary: #6366f1;
    --pagefind-ui-text: rgb(17 24 39);
    --pagefind-ui-background: transparent;
    --pagefind-ui-border: rgb(229 231 235);
    --pagefind-ui-tag: rgb(243 244 246);
    --pagefind-ui-border-width: 1px;
    --pagefind-ui-border-radius: 10px;
    --pagefind-ui-font: inherit;
  }
  /* Larger input, with right padding so text clears the ESC pill */
  #search-container .pagefind-ui__search-input {
    font-size: 17px;
    padding: 14px 92px 14px 16px;
    background: transparent;
  }
  /* Keep Pagefind's clear (×) button left of the ESC pill */
  #search-container .pagefind-ui__search-clear {
    right: 60px;
    background: transparent;
  }
  /* Comfortable, rounded result rows with a hover highlight */
  #search-container .pagefind-ui__result {
    padding: 10px 12px;
    border: 0;
    border-radius: 10px;
  }
  #search-container .pagefind-ui__result:hover {
    background: rgb(238 242 255); /* indigo-50 */
  }
  #search-container .pagefind-ui__result-link {
    font-weight: 600;
  }
```

- [ ] **Step 2: Add dark-mode result-hover to the existing `.dark` rule**

Replace this block:

```css
  .dark #search-container {
    --pagefind-ui-text: rgb(243 244 246);
    --pagefind-ui-border: rgb(55 65 81);
    --pagefind-ui-tag: rgb(31 41 55);
  }
```

with:

```css
  .dark #search-container {
    --pagefind-ui-text: rgb(243 244 246);
    --pagefind-ui-border: rgb(55 65 81);
    --pagefind-ui-tag: rgb(31 41 55);
  }
  .dark #search-container .pagefind-ui__result:hover {
    background: rgb(49 46 129 / 0.25); /* indigo, dark */
  }
```

- [ ] **Step 3: Build**

Run: `npm run build`
Expected: completes without errors (exit 0).

- [ ] **Step 4: Manual check — built Pagefind UI, both themes**

Run `npm run preview`, open http://localhost:4321, press `⌘K`, and type a query (e.g. "bill of materials").
Expected:
1. Input text is full-size (~17px) and does **not** run under the ESC pill; the clear (×) button sits to the left of the ESC pill.
2. Result rows have comfortable padding, rounded corners, and an indigo-tinted hover.
3. Toggle dark mode (the theme toggle) and reopen search — text, borders, and the result hover all read correctly on the dark card.

- [ ] **Step 5: Commit**

```bash
git add src/components/Search.astro
git commit -m "Restyle Pagefind UI: full-size input and rounded result rows"
```

---

## Final verification

- [ ] **Step 1: Clean build**

Run: `npm run build`
Expected: exit 0, no errors.

- [ ] **Step 2: Full manual pass in `npm run preview` (http://localhost:4321), in BOTH light and dark mode**

- Tooltip: hover a term → themed card with term heading + definition + caret; move onto the card and click "View in Glossary →" → navigates without the tooltip disappearing first; moving away dismisses it; near the viewport bottom it flips above with the caret pointing down.
- Search: `⌘K` and `/` open the 760px modal; full-size input clear of the ESC pill; rounded result rows with indigo hover; `esc` and backdrop-click close it.

- [ ] **Step 3: Confirm dev-mode fallback looks intentional**

Run `npm run dev`, open http://localhost:4321, press `⌘K`.
Expected: the centered, padded "Search is available after running `npm run build`" notice inside the 760px card (not a tiny broken-looking line).
