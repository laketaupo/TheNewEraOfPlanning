# Notes Search Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Surface user notes from localStorage alongside Pagefind content results in the search modal — notes appear above content results with an amber "Note" badge when the query matches their text.

**Architecture:** Inject a build-time topic map (`topicId → { title, url }`) into every page as a JSON script element, following the existing glossary-data pattern. At runtime, the search modal watches for Pagefind's input via MutationObserver and runs a client-side note search on each keystroke, rendering matches in a styled block directly above Pagefind's content results.

**Tech Stack:** Astro 4, Tailwind CSS 3, Pagefind (existing static search), localStorage (existing note storage)

## Global Constraints

- No test framework — verification is `npm run build` + `npm run preview` + manual browser checks
- Never build Tailwind classes via string interpolation; all dynamic styling uses inline CSS properties or lookup maps
- `platform-comments` in localStorage stores `{ [chapterSlug/topicSlug]: string }` — this is the authoritative note storage format, matching `COMMENTS_KEY` in `src/scripts/topic-progress.ts`
- Topic IDs are `${chapterSlug}/${topicSlug}`, matching the `data-topic-id` attribute on topic page buttons
- All inline scripts in `.astro` files use `is:inline` — plain JavaScript only, no TypeScript

---

### Task 1: Inject topic map into BaseLayout.astro

**Files:**
- Modify: `src/layouts/BaseLayout.astro`

**Interfaces:**
- Consumes: `getTopics()` from `src/lib/chapters.ts` — returns `TopicMeta[]`, each with `chapterSlug: string`, `slug: string`, `title: string`, `url: string`
- Produces: `<script type="application/json" id="topic-map">` in every page's HTML, containing `Record<string, { title: string; url: string }>` keyed by `"chapterSlug/topicSlug"`

- [ ] **Step 1: Add the import and topic map in BaseLayout.astro frontmatter**

Open `src/layouts/BaseLayout.astro`. In the frontmatter (between `---` fences), the current last import is on line 8:
```js
import { getGlossaryTerms } from '../lib/glossary';
```

Add immediately after it:
```js
import { getTopics } from '../lib/chapters';
const topicMap = Object.fromEntries(
  getTopics().map(t => [`${t.chapterSlug}/${t.slug}`, { title: t.title, url: t.url }])
);
```

- [ ] **Step 2: Inject the topic map as a JSON script element**

In `src/layouts/BaseLayout.astro`, find the existing glossary data script element (currently line 121):
```html
<script type="application/json" id="glossary-data" set:html={JSON.stringify(glossaryTerms)}></script>
```

Add the topic map script element immediately after it:
```html
<script type="application/json" id="topic-map" set:html={JSON.stringify(topicMap)}></script>
```

- [ ] **Step 3: Build to verify no errors**

```bash
npm run build
```

Expected: build completes with no TypeScript or Astro errors. Exit code 0.

- [ ] **Step 4: Spot-check the output**

```bash
grep -c 'id="topic-map"' .vercel/output/static/index.html
```

Expected output: `1`

- [ ] **Step 5: Commit**

```bash
git add src/layouts/BaseLayout.astro
git commit -m "feat: inject topic map JSON for client-side note search"
```

---

### Task 2: Add notes-results container and styles to Search.astro

**Files:**
- Modify: `src/components/Search.astro`

**Interfaces:**
- Consumes: nothing yet — this task creates the DOM structure and CSS that Task 3's script will populate
- Produces: `<div id="notes-results">` inside the modal (hidden by default); CSS classes `.notes-section-header`, `.note-result`, `.note-result-title`, `.note-badge`, `.note-excerpt`, `.note-excerpt mark`

- [ ] **Step 1: Add the notes-results div to the modal**

In `src/components/Search.astro`, find the footer div on line 16:
```html
    <div class="flex items-center gap-4 border-t border-gray-100 dark:border-neutral-800 bg-gray-50 dark:bg-neutral-950 px-4 py-2.5 text-xs text-gray-400 dark:text-neutral-500">
```

Insert the following div immediately before it (between `<p id="search-dev-notice"...>` and the footer):
```html
    <div id="notes-results" class="hidden px-2 pb-2"></div>
```

The modal inner div children should now be in this order:
1. `<div id="search-container" ...>` — Pagefind mounts here
2. `<p id="search-dev-notice" ...>` — dev fallback notice
3. `<div id="notes-results" ...>` ← new
4. `<div class="flex items-center gap-4 ...">` — keyboard hint footer

- [ ] **Step 2: Add CSS for the notes results block**

In `src/components/Search.astro`, inside the `<style is:global>` block, append these rules after the last existing rule (after the `#search-modal[open]` block):

```css
  #notes-results {
    padding: 0 0 4px;
  }
  .notes-section-header {
    font-size: 10px;
    font-weight: 600;
    letter-spacing: 0.08em;
    text-transform: uppercase;
    color: rgb(156 163 175);
    padding: 8px 12px 4px;
    margin: 0;
  }
  .dark .notes-section-header {
    color: rgb(115 115 115);
  }
  .note-result {
    display: block;
    padding: 10px 12px;
    border-radius: 10px;
    text-decoration: none;
    color: inherit;
  }
  .note-result:hover {
    background: rgb(238 242 255);
  }
  .dark .note-result:hover {
    background: rgb(49 46 129 / 0.25);
  }
  .note-result-title {
    display: flex;
    align-items: center;
    gap: 8px;
    font-size: 14px;
    font-weight: 600;
    color: rgb(17 24 39);
    margin-bottom: 3px;
  }
  .dark .note-result-title {
    color: rgb(243 244 246);
  }
  .note-badge {
    font-size: 10px;
    font-weight: 600;
    padding: 1px 6px;
    border-radius: 9999px;
    border: 1px solid rgb(251 191 36);
    color: rgb(180 83 9);
    background: rgb(255 251 235);
    shrink: 0;
  }
  .dark .note-badge {
    color: rgb(251 191 36);
    background: rgb(245 158 11 / 0.1);
  }
  .note-excerpt {
    display: block;
    font-size: 13px;
    color: rgb(107 114 128);
    line-height: 1.4;
  }
  .dark .note-excerpt {
    color: rgb(163 163 163);
  }
  .note-excerpt mark {
    background: rgb(254 243 199);
    color: rgb(146 64 14);
    border-radius: 2px;
    padding: 0 1px;
  }
  .dark .note-excerpt mark {
    background: rgb(245 158 11 / 0.25);
    color: rgb(252 211 77);
  }
```

- [ ] **Step 3: Commit**

```bash
git add src/components/Search.astro
git commit -m "feat: add notes-results container and styles to search modal"
```

---

### Task 3: Add note search script logic to Search.astro

**Files:**
- Modify: `src/components/Search.astro`

**Interfaces:**
- Consumes: `#topic-map` JSON element (Task 1), `platform-comments` in localStorage, `#notes-results` div (Task 2), Pagefind's `<input>` (inserted by PagefindUI after `initPagefind`)
- Produces: populated `#notes-results` on each debounced keystroke when query ≥ 2 chars; hidden when query is shorter or has no matches

- [ ] **Step 1: Add helper functions inside the IIFE in the inline script**

In `src/components/Search.astro`, inside the `<script is:inline>` block, the IIFE currently opens with:
```js
(function () {
  const trigger = document.getElementById('search-trigger');
  const modal   = document.getElementById('search-modal');
  const container = document.getElementById('search-container');
  const devNotice = document.getElementById('search-dev-notice');

  let initialized = false;

  function openModal() {
```

Add the four helper functions between `let initialized = false;` and `function openModal()`:

```js
  function escapeHtml(str) {
    return String(str).replace(/[&<>"']/g, c =>
      ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]
    );
  }

  function highlightMatch(rawText, query) {
    const lower = rawText.toLowerCase();
    const idx = lower.indexOf(query.toLowerCase());
    let text = rawText;
    if (rawText.length > 120) {
      const start = Math.max(0, idx - 40);
      const end = Math.min(rawText.length, start + 120);
      text = (start > 0 ? '…' : '') + rawText.slice(start, end) + (end < rawText.length ? '…' : '');
    }
    const escaped = escapeHtml(text);
    const escapedQuery = escapeHtml(query).replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    return escaped.replace(new RegExp('(' + escapedQuery + ')', 'gi'), '<mark>$1</mark>');
  }

  function searchNotes(query) {
    const mapEl = document.getElementById('topic-map');
    if (!mapEl) return [];
    let topicMap;
    try { topicMap = JSON.parse(mapEl.textContent); } catch (e) { return []; }
    let comments;
    try { comments = JSON.parse(localStorage.getItem('platform-comments') || '{}'); } catch (e) { return []; }
    const q = query.toLowerCase();
    return Object.entries(comments)
      .filter(([, noteText]) => noteText && noteText.toLowerCase().includes(q))
      .map(([topicId, noteText]) => {
        const topic = topicMap[topicId];
        if (!topic) return null;
        return { topicId, noteText, title: topic.title, url: topic.url };
      })
      .filter(Boolean);
  }

  function renderNoteResults(matches, query) {
    const panel = document.getElementById('notes-results');
    if (!panel) return;
    if (matches.length === 0) {
      panel.classList.add('hidden');
      panel.innerHTML = '';
      return;
    }
    const rows = matches.map(m =>
      `<a class="note-result" href="${escapeHtml(m.url)}">` +
      `<span class="note-result-title">${escapeHtml(m.title)}<span class="note-badge">Note</span></span>` +
      `<span class="note-excerpt">${highlightMatch(m.noteText, query)}</span>` +
      `</a>`
    );
    panel.innerHTML = '<p class="notes-section-header">Your notes</p>' + rows.join('');
    panel.classList.remove('hidden');
  }
```

- [ ] **Step 2: Wire up the MutationObserver inside initPagefind's script.onload**

In `src/components/Search.astro`, find the current `script.onload` block inside `initPagefind`:

```js
    script.onload = function () {
      new PagefindUI({
        element: '#search-container',
        showSubResults: false,
        showImages: false,
        translations: {
          placeholder: 'Search topics, chapters, concepts…',
          zero_results: 'No results for [SEARCH_TERM]',
        },
      });
      setTimeout(() => {
        const input = container.querySelector('input');
        if (input) input.focus();
      }, 50);
    };
```

Replace it in full with:

```js
    script.onload = function () {
      new PagefindUI({
        element: '#search-container',
        showSubResults: false,
        showImages: false,
        translations: {
          placeholder: 'Search topics, chapters, concepts…',
          zero_results: 'No results for [SEARCH_TERM]',
        },
      });
      setTimeout(() => {
        const input = container.querySelector('input');
        if (input) input.focus();
      }, 50);

      let noteDebounce = null;
      const observer = new MutationObserver(() => {
        const input = container.querySelector('input');
        if (!input) return;
        observer.disconnect();
        input.addEventListener('input', () => {
          clearTimeout(noteDebounce);
          const val = input.value;
          noteDebounce = setTimeout(() => {
            const q = val.trim();
            if (q.length < 2) {
              const panel = document.getElementById('notes-results');
              if (panel) { panel.classList.add('hidden'); panel.innerHTML = ''; }
              return;
            }
            renderNoteResults(searchNotes(q), q);
          }, 150);
        });
      });
      observer.observe(container, { childList: true, subtree: true });
    };
```

- [ ] **Step 3: Clear notes results when the modal closes**

In `src/components/Search.astro`, find the current `closeModal` function:

```js
  function closeModal() {
    modal.close();
  }
```

Replace it with:

```js
  function closeModal() {
    modal.close();
    const panel = document.getElementById('notes-results');
    if (panel) { panel.classList.add('hidden'); panel.innerHTML = ''; }
  }
```

- [ ] **Step 4: Build to verify no errors**

```bash
npm run build
```

Expected: build completes with exit code 0 and no errors.

- [ ] **Step 5: Seed a test note and verify end-to-end**

Start the preview server:
```bash
npm run preview
```

Open the site in a browser. Open DevTools → Console. First print the topic map to get a valid topic ID:

```js
JSON.parse(document.getElementById('topic-map').textContent)
```

Pick any key from the output (e.g. `"01-understanding-basics/bod"`). Then seed a test note:

```js
localStorage.setItem('platform-comments', JSON.stringify({
  "01-understanding-basics/bod": "This is a test note about bill of distribution"
}));
```

Open the search modal (press `/`). Type `test note`.

Expected: a "Your notes" section appears above the Pagefind content results, with one row showing the topic title, an amber "Note" badge, and the excerpt `"This is a test note about bill of distribution"` with `test note` highlighted in amber.

Click the result. Expected: browser navigates to the correct topic page.

Type a query that does not match the note (e.g. `zzz`). Expected: the "Your notes" section disappears.

- [ ] **Step 6: Commit**

```bash
git add src/components/Search.astro
git commit -m "feat: add client-side note search to search modal"
```
