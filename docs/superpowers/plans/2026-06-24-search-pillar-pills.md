# Search Overlay — Pillar Pills Filter Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the auto-generated Pagefind pillar filter dropdown with coloured pill buttons that sit below the search bar and filter results via the raw Pagefind JS API.

**Architecture:** All changes are in `src/components/Search.astro`. The pill strip is static HTML rendered by Astro. When a pill is active, a CSS class hides PagefindUI's native result list and a separate `#filtered-results` div shows custom-rendered results driven by the raw `pagefind.js` module (dynamic `import()`). Notes search is untouched.

**Tech Stack:** Astro 4 (static, `is:inline` script), Pagefind UI + raw pagefind.js API, Tailwind-free inline CSS in `<style is:global>`.

## Global Constraints

- All changes confined to `src/components/Search.astro` — no other files.
- Script tag must stay `is:inline` (Astro's inline script, not a module script).
- Dynamic `import()` is valid inside `is:inline` scripts in all modern browsers — do not add `type="module"`.
- Build command: `npm run build` — run this to verify. No automated test suite.
- Preview command: `npm run preview` — use to visually verify in browser.
- Pillar slugs are exactly: `technology`, `process`, `data`, `people`.
- Do not add an "All" pill — clicking the active pill again clears the filter.

---

### Task 1: Add HTML Structure

**Files:**
- Modify: `src/components/Search.astro:16`

Add the pill strip and filtered-results container between the dev-notice paragraph and the notes-results div.

- [ ] **Step 1: Edit the HTML template in `src/components/Search.astro`**

Find this exact block (lines 13–16):

```html
    <p id="search-dev-notice" class="hidden text-center text-sm text-gray-500 dark:text-neutral-400 px-6 py-10">
      Search is available after running <code class="font-mono bg-gray-100 dark:bg-neutral-800 px-1.5 py-0.5 rounded">npm run build</code>.
    </p>
    <div id="notes-results" class="hidden px-2 pb-2"></div>
```

Replace it with:

```html
    <p id="search-dev-notice" class="hidden text-center text-sm text-gray-500 dark:text-neutral-400 px-6 py-10">
      Search is available after running <code class="font-mono bg-gray-100 dark:bg-neutral-800 px-1.5 py-0.5 rounded">npm run build</code>.
    </p>
    <div id="pillar-pills">
      <button class="pillar-pill" data-pillar="technology">Technology</button>
      <button class="pillar-pill" data-pillar="process">Process</button>
      <button class="pillar-pill" data-pillar="data">Data</button>
      <button class="pillar-pill" data-pillar="people">People</button>
    </div>
    <div id="filtered-results" class="hidden"></div>
    <div id="notes-results" class="hidden px-2 pb-2"></div>
```

- [ ] **Step 2: Build and verify structure renders**

```bash
npm run build
```

Expected: build completes with no errors. The pill buttons exist in the HTML output (grep to confirm):

```bash
grep -c "pillar-pill" .vercel/output/static/index.html || grep -rn "pillar-pill" .vercel/output/static/ | head -3
```

Expected: output contains `pillar-pill` class references.

- [ ] **Step 3: Commit**

```bash
git add src/components/Search.astro
git commit -m "feat: add pillar pill strip and filtered-results container to search modal"
```

---

### Task 2: Add CSS Styles

**Files:**
- Modify: `src/components/Search.astro` — `<style is:global>` block (after line 314)

Add all pill styles, the `.filtering` helper class, filtered-results container styles, and empty/no-results message styles.

- [ ] **Step 1: Add CSS to the `<style is:global>` block**

Find the closing `</style>` tag at the end of `Search.astro` and insert the following CSS block immediately before it:

```css
  /* ── Pillar pill strip ── */
  #pillar-pills {
    display: flex;
    gap: 8px;
    padding: 6px 12px 8px;
    border-bottom: 1px solid rgb(243 244 246);
  }
  .dark #pillar-pills {
    border-bottom-color: rgb(38 38 38);
  }

  /* Base pill reset */
  .pillar-pill {
    border-radius: 9999px;
    padding: 3px 12px;
    font-size: 13px;
    font-weight: 500;
    cursor: pointer;
    border: 1.5px solid;
    background: transparent;
    transition: background 120ms, color 120ms;
    line-height: 1.5;
  }

  /* Technology — green */
  .pillar-pill[data-pillar="technology"] { border-color: #15803d; color: #15803d; }
  .pillar-pill[data-pillar="technology"]:hover:not(.active) { background: #dcfce7; }
  .pillar-pill[data-pillar="technology"].active { background: #15803d; color: white; }

  /* Process — blue */
  .pillar-pill[data-pillar="process"] { border-color: #1d4ed8; color: #1d4ed8; }
  .pillar-pill[data-pillar="process"]:hover:not(.active) { background: #dbeafe; }
  .pillar-pill[data-pillar="process"].active { background: #1d4ed8; color: white; }

  /* Data — amber */
  .pillar-pill[data-pillar="data"] { border-color: #b45309; color: #b45309; }
  .pillar-pill[data-pillar="data"]:hover:not(.active) { background: #fef3c7; }
  .pillar-pill[data-pillar="data"].active { background: #b45309; color: white; }

  /* People — red */
  .pillar-pill[data-pillar="people"] { border-color: #b91c1c; color: #b91c1c; }
  .pillar-pill[data-pillar="people"]:hover:not(.active) { background: #fee2e2; }
  .pillar-pill[data-pillar="people"].active { background: #b91c1c; color: white; }

  /* Dark mode — lighter accent variants */
  .dark .pillar-pill[data-pillar="technology"] { border-color: #86efac; color: #86efac; }
  .dark .pillar-pill[data-pillar="technology"]:hover:not(.active) { background: rgba(134,239,172,0.12); }
  .dark .pillar-pill[data-pillar="technology"].active { background: #15803d; color: white; }

  .dark .pillar-pill[data-pillar="process"] { border-color: #93c5fd; color: #93c5fd; }
  .dark .pillar-pill[data-pillar="process"]:hover:not(.active) { background: rgba(147,197,253,0.12); }
  .dark .pillar-pill[data-pillar="process"].active { background: #1d4ed8; color: white; }

  .dark .pillar-pill[data-pillar="data"] { border-color: #fcd34d; color: #fcd34d; }
  .dark .pillar-pill[data-pillar="data"]:hover:not(.active) { background: rgba(252,211,77,0.12); }
  .dark .pillar-pill[data-pillar="data"].active { background: #b45309; color: white; }

  .dark .pillar-pill[data-pillar="people"] { border-color: #fca5a5; color: #fca5a5; }
  .dark .pillar-pill[data-pillar="people"]:hover:not(.active) { background: rgba(252,165,165,0.12); }
  .dark .pillar-pill[data-pillar="people"].active { background: #b91c1c; color: white; }

  /* Hide PagefindUI's own result list when a pill filter is active */
  #search-container.filtering .pagefind-ui__results {
    display: none;
  }

  /* Filtered results container */
  #filtered-results {
    padding: 0 4px 4px;
  }

  /* Empty-state and no-results messages inside #filtered-results */
  .filter-state-msg {
    font-size: 13px;
    color: rgb(156 163 175);
    text-align: center;
    padding: 16px 12px;
    margin: 0;
  }
  .dark .filter-state-msg {
    color: rgb(115 115 115);
  }

  /* Filtered result rows — reuse pagefind-ui__result visual treatment */
  .filtered-result {
    display: block;
    text-decoration: none;
    color: inherit;
  }
```

- [ ] **Step 2: Build and verify no CSS errors**

```bash
npm run build
```

Expected: build completes with no errors.

- [ ] **Step 3: Preview and visually verify pills appear**

```bash
npm run preview
```

Open `http://localhost:4321` in a browser. Press `/` or `Cmd+K` to open the search modal. Confirm:
- Four pills labelled Technology, Process, Data, People appear below the search input.
- Each pill has its correct border colour (green, blue, amber, red).
- Hovering a pill shows a light tint.
- Clicking a pill turns it solid-filled with white text.
- Clicking the same pill again returns it to ghost state (style only — filtering logic comes in Task 3).

- [ ] **Step 4: Commit**

```bash
git add src/components/Search.astro
git commit -m "feat: add pillar pill styles and filtering CSS to search modal"
```

---

### Task 3: Add JavaScript Logic

**Files:**
- Modify: `src/components/Search.astro` — `<script is:inline>` block (lines 27–174)

Three insertion points in the existing IIFE:
1. State variables after `let initialized = false;`
2. Helper functions + `setActivePillar` + `runFilteredSearch` after `highlightMatch`
3. `closeModal` update, `initPagefind` update (raw pagefind import + filter input listener), pill click listeners

- [ ] **Step 1: Add state variables**

Find:

```js
  let initialized = false;
```

Replace with:

```js
  let initialized = false;
  let activePillar = null;
  let pagefindRaw = null;
```

- [ ] **Step 2: Add helper functions after `highlightMatch`**

Find the closing brace of `highlightMatch` followed by the blank line before `searchNotes`:

```js
    return escaped.replace(new RegExp('(' + escapedQuery + ')', 'gi'), '<mark>$1</mark>');
  }

  function searchNotes(query) {
```

Replace with:

```js
    return escaped.replace(new RegExp('(' + escapedQuery + ')', 'gi'), '<mark>$1</mark>');
  }

  function pillarLabel(slug) {
    return { technology: 'Technology', process: 'Process', data: 'Data', people: 'People' }[slug] || slug;
  }

  function renderFilteredResult(r) {
    return '<a class="pagefind-ui__result filtered-result" href="' + escapeHtml(r.url) + '">' +
      '<div class="pagefind-ui__result-inner">' +
      '<p class="pagefind-ui__result-link">' + escapeHtml(r.meta.title || '') + '</p>' +
      '<p class="pagefind-ui__result-excerpt">' + (r.excerpt || '') + '</p>' +
      '</div></a>';
  }

  function setActivePillar(slug) {
    activePillar = slug;
    document.querySelectorAll('.pillar-pill').forEach(function (btn) {
      btn.classList.toggle('active', btn.dataset.pillar === slug);
    });
    if (slug) {
      container.classList.add('filtering');
    } else {
      container.classList.remove('filtering');
      var fp = document.getElementById('filtered-results');
      if (fp) { fp.classList.add('hidden'); fp.innerHTML = ''; }
    }
  }

  function runFilteredSearch(query) {
    var panel = document.getElementById('filtered-results');
    if (!panel || !pagefindRaw) return;
    var q = (query || '').trim();
    if (q.length < 2) {
      panel.innerHTML = '<p class="filter-state-msg">Type to search within ' + pillarLabel(activePillar) + '</p>';
      panel.classList.remove('hidden');
      return;
    }
    pagefindRaw.search(q, { filters: { pillar: activePillar } }).then(function (search) {
      return Promise.all(search.results.slice(0, 10).map(function (r) { return r.data(); }));
    }).then(function (results) {
      panel.innerHTML = results.length > 0
        ? results.map(renderFilteredResult).join('')
        : '<p class="filter-state-msg">No results in ' + pillarLabel(activePillar) + '</p>';
      panel.classList.remove('hidden');
    });
  }

  function searchNotes(query) {
```

- [ ] **Step 3: Update `closeModal` to reset pill state on close**

Find:

```js
  function closeModal() {
    modal.close();
    const panel = document.getElementById('notes-results');
    if (panel) { panel.classList.add('hidden'); panel.innerHTML = ''; }
  }
```

Replace with:

```js
  function closeModal() {
    modal.close();
    const panel = document.getElementById('notes-results');
    if (panel) { panel.classList.add('hidden'); panel.innerHTML = ''; }
    setActivePillar(null);
  }
```

- [ ] **Step 4: Import raw pagefind module after PagefindUI initialises**

Find the line immediately after the `PagefindUI({...})` call closing brace and the `setTimeout` block:

```js
      });
      setTimeout(() => {
        const input = container.querySelector('input');
        if (input) input.focus();
      }, 50);

      let noteDebounce = null;
```

Replace with:

```js
      });
      import('/pagefind/pagefind.js').then(function (pf) { pagefindRaw = pf; });
      setTimeout(() => {
        const input = container.querySelector('input');
        if (input) input.focus();
      }, 50);

      let noteDebounce = null;
```

- [ ] **Step 5: Add filter input listener inside the MutationObserver callback**

Find the observer's input listener block and the `observer.observe` line:

```js
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
```

Replace with:

```js
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

        var filterDebounce = null;
        input.addEventListener('input', function () {
          if (!activePillar) return;
          clearTimeout(filterDebounce);
          var val = input.value;
          filterDebounce = setTimeout(function () { runFilteredSearch(val); }, 150);
        });
      });
      observer.observe(container, { childList: true, subtree: true });
```

- [ ] **Step 6: Wire pill click listeners**

Find:

```js
  if (trigger) trigger.addEventListener('click', openModal);
  window.openSearch = openModal;
```

Replace with:

```js
  document.querySelectorAll('.pillar-pill').forEach(function (btn) {
    btn.addEventListener('click', function () {
      var pillar = btn.dataset.pillar;
      if (pillar === activePillar) {
        setActivePillar(null);
      } else {
        setActivePillar(pillar);
        var input = container.querySelector('input');
        if (input) runFilteredSearch(input.value);
      }
    });
  });

  if (trigger) trigger.addEventListener('click', openModal);
  window.openSearch = openModal;
```

- [ ] **Step 7: Build**

```bash
npm run build
```

Expected: build completes with no errors.

- [ ] **Step 8: Preview and verify end-to-end behaviour**

```bash
npm run preview
```

Open `http://localhost:4321`. Open search modal (`/` or `Cmd+K`). Verify each scenario:

| Action | Expected |
|---|---|
| Modal opens | Pills visible, no filter active, normal search works |
| Click "Technology" pill | Pill turns solid green; type a query → only Technology results appear in `#filtered-results`; normal Pagefind results hidden |
| Type query while Technology active | Results update with 150 ms debounce |
| Type < 2 chars while Technology active | "Type to search within Technology" message |
| Click "Technology" again | Pill returns to ghost; `#filtered-results` hidden; Pagefind results reappear |
| Click "Process" while Technology is active | Process pill becomes active (Technology deactivates); filtered results update |
| Press Esc to close and reopen | No pill is active; everything resets |
| Notes search | Unaffected — notes still appear below filtered results when query matches |
| Dark mode (toggle theme) | Pills use lighter accent colours |

- [ ] **Step 9: Commit**

```bash
git add src/components/Search.astro
git commit -m "feat: add pillar pill filter logic to search modal using raw pagefind API"
```
