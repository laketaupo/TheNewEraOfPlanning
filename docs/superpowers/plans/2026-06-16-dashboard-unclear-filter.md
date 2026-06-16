# Dashboard Filter-by-State Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Make the progress dashboard's three header stat tiles (complete / unclear / remaining) act as single-select toggle filters that prune the tree to matching topics and auto-expand the branches that contain them.

**Architecture:** All changes are confined to one component, `src/components/UserDashboard.astro` — its markup, its `<style>` block, and its inline `<script>`. A new `activeFilter` variable drives row filtering inside the existing `updatePillarView` / `updateRoleView` render functions and the existing `refreshDashboard`. No new files, no data-model or storage changes. The filter is session-only (resets on panel open).

**Tech Stack:** Astro 4, Tailwind CSS 3, vanilla DOM JS in an inline `<script define:vars>`. No test runner — verification is `npm run build` plus manual browser checks.

---

## Verification model (read first)

There is no test framework in this repo. For every task:
- **Build gate:** `npm run build` must complete without error (output goes to `.vercel/output/static/`).
- **Manual gate:** `npm run dev`, open http://localhost:4321, open the dashboard (person icon at `top-3 right-28`, or press the trigger). To create test data, paste this in the browser console once, then reload:

```js
localStorage.setItem('platform-progress', JSON.stringify({
  // pick real ids of form "chapterSlug/topicSlug" — open the dashboard,
  // expand any chapter, and copy two topic ids from the topic links if unsure.
  'sop-process/01-sop-fundamentals': 'unclear',
  'soe-process/soe-exception-management': 'unclear',
  '01-understanding-basics/01-understanding-basics': 'complete'
}));
```

(Use ids that exist in your build; the exact slugs above are illustrative. Any two `unclear` + one `complete` works.)

## File structure

- **Modify only:** `src/components/UserDashboard.astro`
  - `<style>` block (lines ~110–115): add stat-tile active-state CSS.
  - Stat tiles markup (lines ~184–198): convert the three tile `<div>`s into `<button>`s with `data-stat-filter`.
  - Insert a filter-indicator chip row between the stats section and the tree (after line ~206).
  - Add a `#dash-filter-empty` element inside the scrollable tree area (near the existing `#dash-empty`, ~line 274).
  - `<script>` (lines ~293–560): add filter state, wiring, and pruning inside `updatePillarView` / `updateRoleView` / `refreshDashboard`.

Line numbers are from the current file and will drift as edits land — match on the surrounding code shown in each step, not the numbers.

---

## Task 1: Markup + CSS for clickable tiles, chip, and empty state

**Files:**
- Modify: `src/components/UserDashboard.astro`

- [ ] **Step 1: Add active-tile CSS to the existing `<style>` block**

Find:

```html
<style>
  .dash-tree details > summary { list-style: none; cursor: pointer; }
  .dash-tree details > summary::-webkit-details-marker { display: none; }
  .dash-tree .dash-chevron { transition: transform 0.15s ease; }
  .dash-tree details[open] > summary .dash-chevron { transform: rotate(90deg); }
</style>
```

Replace with (adds four rules; plain CSS so Tailwind purge is not a concern):

```html
<style>
  .dash-tree details > summary { list-style: none; cursor: pointer; }
  .dash-tree details > summary::-webkit-details-marker { display: none; }
  .dash-tree .dash-chevron { transition: transform 0.15s ease; }
  .dash-tree details[open] > summary .dash-chevron { transform: rotate(90deg); }

  .dash-stat-tile { cursor: pointer; }
  .dash-stat-tile-active { background: rgba(0, 0, 0, 0.03); }
  .dash-stat-tile-active[data-stat-filter="complete"] { box-shadow: inset 0 0 0 1.5px rgb(16 185 129); }
  .dash-stat-tile-active[data-stat-filter="unclear"]  { box-shadow: inset 0 0 0 1.5px rgb(245 158 11); }
  .dash-stat-tile-active[data-stat-filter="none"]     { box-shadow: inset 0 0 0 1.5px rgb(148 163 184); }
</style>
```

- [ ] **Step 2: Convert the three stat tiles into buttons**

Find:

```html
      <div class="flex items-start gap-6 mb-3">
        <div>
          <div class="text-xl font-bold text-emerald-600 dark:text-emerald-400" id="dash-complete-num">0</div>
          <div class="text-[11px] text-gray-500 dark:text-gray-400 mt-0.5">complete</div>
        </div>
        <div>
          <div class="text-xl font-bold text-amber-500 dark:text-amber-400" id="dash-unclear-num">0</div>
          <div class="text-[11px] text-gray-500 dark:text-gray-400 mt-0.5">unclear</div>
        </div>
        <div>
          <div class="text-xl font-bold text-gray-300 dark:text-gray-600" id="dash-remaining-num">0</div>
          <div class="text-[11px] text-gray-500 dark:text-gray-400 mt-0.5">remaining</div>
        </div>
      </div>
```

Replace with:

```html
      <div class="flex items-start gap-2 mb-3">
        <button type="button" data-stat-filter="complete"
          class="dash-stat-tile flex-1 text-left rounded-lg px-2 py-1.5 ring-1 ring-transparent transition-colors hover:bg-gray-50 dark:hover:bg-gray-800/40">
          <div class="text-xl font-bold text-emerald-600 dark:text-emerald-400" id="dash-complete-num">0</div>
          <div class="text-[11px] text-gray-500 dark:text-gray-400 mt-0.5">complete</div>
        </button>
        <button type="button" data-stat-filter="unclear"
          class="dash-stat-tile flex-1 text-left rounded-lg px-2 py-1.5 ring-1 ring-transparent transition-colors hover:bg-gray-50 dark:hover:bg-gray-800/40">
          <div class="text-xl font-bold text-amber-500 dark:text-amber-400" id="dash-unclear-num">0</div>
          <div class="text-[11px] text-gray-500 dark:text-gray-400 mt-0.5">unclear</div>
        </button>
        <button type="button" data-stat-filter="none"
          class="dash-stat-tile flex-1 text-left rounded-lg px-2 py-1.5 ring-1 ring-transparent transition-colors hover:bg-gray-50 dark:hover:bg-gray-800/40">
          <div class="text-xl font-bold text-gray-300 dark:text-gray-600" id="dash-remaining-num">0</div>
          <div class="text-[11px] text-gray-500 dark:text-gray-400 mt-0.5">remaining</div>
        </button>
      </div>
```

- [ ] **Step 3: Add the filter-indicator chip row**

Find the closing of the stats section followed by the tree container open:

```html
      <div class="text-[11px] text-gray-400 dark:text-gray-500 mt-1.5" id="dash-overall-text">
        0 of {totalTopics} topics complete
      </div>
    </div>

    <!-- Hierarchy tree (scrollable) -->
    <div class="flex-1 overflow-y-auto py-1 dash-tree">
```

Replace with (inserts the chip row between the stats `</div>` and the tree):

```html
      <div class="text-[11px] text-gray-400 dark:text-gray-500 mt-1.5" id="dash-overall-text">
        0 of {totalTopics} topics complete
      </div>
    </div>

    <!-- Active-filter indicator chip (shown only while a state filter is active) -->
    <div id="dash-filter-chip" class="hidden items-center gap-2 px-5 py-2 border-b border-gray-100 dark:border-gray-800 shrink-0 bg-gray-50/70 dark:bg-gray-800/30">
      <span class="text-[11px] text-gray-500 dark:text-gray-400">
        Showing: <span id="dash-filter-label" class="font-semibold text-gray-700 dark:text-gray-200"></span>
      </span>
      <button id="dash-filter-clear" type="button" class="ml-auto inline-flex items-center gap-1 text-[11px] text-gray-400 hover:text-red-500 dark:hover:text-red-400 transition-colors">
        <svg xmlns="http://www.w3.org/2000/svg" class="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M6 18L18 6M6 6l12 12"/></svg>
        clear
      </button>
    </div>

    <!-- Hierarchy tree (scrollable) -->
    <div class="flex-1 overflow-y-auto py-1 dash-tree">
```

- [ ] **Step 4: Add the filtered empty-state element**

Find:

```html
      <!-- Empty state when a role has no matching topics in a section -->
      <div id="dash-empty" class="hidden px-5 py-8 text-center text-xs text-gray-400 dark:text-gray-500">
        No topics for this role yet.
      </div>
```

Replace with (adds a sibling for the filtered-empty case):

```html
      <!-- Empty state when a role has no matching topics in a section -->
      <div id="dash-empty" class="hidden px-5 py-8 text-center text-xs text-gray-400 dark:text-gray-500">
        No topics for this role yet.
      </div>

      <!-- Empty state when an active state filter matches nothing in scope -->
      <div id="dash-filter-empty" class="hidden px-5 py-8 text-center text-xs text-gray-400 dark:text-gray-500"></div>
```

- [ ] **Step 5: Build gate**

Run: `npm run build`
Expected: completes with no errors. (Tiles are now buttons but not yet wired — clicking does nothing, which is fine for this task.)

- [ ] **Step 6: Commit**

```bash
git add src/components/UserDashboard.astro
git commit -m "feat(dashboard): stat-tile buttons, filter chip, filtered empty state (markup)"
```

---

## Task 2: Filter state, wiring, and chip/empty/tile rendering

**Files:**
- Modify: `src/components/UserDashboard.astro` (inline `<script>`)

- [ ] **Step 1: Add filter state and label map near the top of the script**

Find:

```js
  const dotClass = {
    complete: 'bg-emerald-500',
    unclear:  'bg-amber-400',
    none:     'bg-gray-300 dark:bg-gray-600',
  };
```

Replace with (adds `activeFilter`, `openSnapshot`, label map, and `matchesFilter`):

```js
  const dotClass = {
    complete: 'bg-emerald-500',
    unclear:  'bg-amber-400',
    none:     'bg-gray-300 dark:bg-gray-600',
  };

  // Session-only state filter: '' (all) | 'complete' | 'unclear' | 'none' (remaining).
  let activeFilter = '';
  let openSnapshot = null; // <details> open states captured when entering filter mode

  const filterLabels = { complete: 'Complete', unclear: 'Unclear', none: 'Remaining' };
  const filterEmptyText = {
    complete: 'No completed topics yet',
    unclear:  'No unclear topics 🎉',
    none:     'Nothing remaining — all done! 🎉',
  };

  function matchesFilter(state) {
    return !activeFilter || state === activeFilter;
  }
```

- [ ] **Step 2: Grab the new DOM elements**

Find:

```js
  const roleSelect = document.getElementById('dash-role-select');
  const pillarView = document.getElementById('dash-pillar-view');
  const roleView   = document.getElementById('dash-role-view');
```

Replace with:

```js
  const roleSelect = document.getElementById('dash-role-select');
  const pillarView = document.getElementById('dash-pillar-view');
  const roleView   = document.getElementById('dash-role-view');
  const filterChip   = document.getElementById('dash-filter-chip');
  const filterLabel  = document.getElementById('dash-filter-label');
  const filterClear  = document.getElementById('dash-filter-clear');
  const filterEmpty  = document.getElementById('dash-filter-empty');
  const statTiles    = Array.from(document.querySelectorAll('.dash-stat-tile'));
```

- [ ] **Step 3: Add snapshot/restore + setFilter helpers**

Insert immediately after the `matchesFilter` function added in Step 1:

```js
  // The currently visible tree root (role view or pillar view).
  function currentTreeRoot() {
    return roleView.classList.contains('hidden') ? pillarView : roleView;
  }

  // Capture each <details> open state so clearing the filter restores the
  // user's own expand/collapse layout instead of leaving everything expanded.
  function snapshotOpen() {
    openSnapshot = new Map();
    currentTreeRoot().querySelectorAll('details').forEach(d => openSnapshot.set(d, d.open));
  }
  function restoreOpen() {
    if (openSnapshot) {
      openSnapshot.forEach((wasOpen, d) => { if (d.isConnected) d.open = wasOpen; });
      openSnapshot = null;
    }
  }

  function setFilter(next) {
    if (activeFilter === '' && next !== '')      snapshotOpen();
    else if (activeFilter !== '' && next === '') restoreOpen();
    activeFilter = next;
    refreshDashboard();
  }
```

- [ ] **Step 4: Reset the filter when the panel opens**

Find:

```js
  function openDashboard() {
    refreshDashboard();
    panel.classList.remove('hidden');
    document.body.style.overflow = 'hidden';
  }
```

Replace with:

```js
  function openDashboard() {
    activeFilter = '';
    openSnapshot = null;
    refreshDashboard();
    panel.classList.remove('hidden');
    document.body.style.overflow = 'hidden';
  }
```

- [ ] **Step 5: Render chip, tile-active state, and filtered empty state in `refreshDashboard`**

Find the tail of `refreshDashboard`:

```js
    // Swap views and update the active one
    if (role) {
      pillarView.classList.add('hidden');
      roleView.classList.remove('hidden');
      updateRoleView(role, progress);
    } else {
      roleView.classList.add('hidden');
      pillarView.classList.remove('hidden');
      updatePillarView(progress);
    }

    document.getElementById('dash-empty').classList.toggle('hidden', scopeTotal > 0);
    updateBadge();
  }
```

Replace with:

```js
    // Swap views and update the active one
    if (role) {
      pillarView.classList.add('hidden');
      roleView.classList.remove('hidden');
      updateRoleView(role, progress);
    } else {
      roleView.classList.add('hidden');
      pillarView.classList.remove('hidden');
      updatePillarView(progress);
    }

    // Active-filter chip + tile highlight
    if (activeFilter) {
      filterChip.classList.remove('hidden');
      filterChip.classList.add('flex');
      filterLabel.textContent = filterLabels[activeFilter];
    } else {
      filterChip.classList.add('hidden');
      filterChip.classList.remove('flex');
    }
    statTiles.forEach(btn =>
      btn.classList.toggle('dash-stat-tile-active', btn.dataset.statFilter === activeFilter)
    );

    // Filtered-empty state: hide the tree and show a friendly line when the
    // active filter matches nothing in scope.
    const filterMatchCount =
      activeFilter === 'complete' ? completedCount :
      activeFilter === 'unclear'  ? unclearCount   :
      activeFilter === 'none'     ? remainingCount : scopeTotal;
    const showFilterEmpty = !!activeFilter && scopeTotal > 0 && filterMatchCount === 0;
    if (showFilterEmpty) {
      filterEmpty.textContent = filterEmptyText[activeFilter];
      filterEmpty.classList.remove('hidden');
      pillarView.classList.add('hidden');
      roleView.classList.add('hidden');
    } else {
      filterEmpty.classList.add('hidden');
    }

    document.getElementById('dash-empty').classList.toggle('hidden', scopeTotal > 0);
    updateBadge();
  }
```

- [ ] **Step 6: Wire tile clicks and the chip clear button**

Find:

```js
  triggerBtn.addEventListener('click', () =>
    panel.classList.contains('hidden') ? openDashboard() : closeDashboard()
  );
```

Insert immediately BEFORE it:

```js
  statTiles.forEach(btn => {
    btn.addEventListener('click', () => {
      const f = btn.dataset.statFilter;
      setFilter(activeFilter === f ? '' : f);
    });
  });
  filterClear.addEventListener('click', () => setFilter(''));

```

- [ ] **Step 7: Reset the filter on role change**

Find:

```js
    roleSelect.addEventListener('change', () => {
      activeRole = roleSelect.value;
      if (activeRole) {
        localStorage.setItem(ROLE_KEY, activeRole);
        buildRoleView(roleBySlug[activeRole]); // rebuild structure, collapsed, on role change
      } else {
        localStorage.removeItem(ROLE_KEY);
      }
      refreshDashboard();
    });
```

Replace with (clears the state filter so the snapshot never references stale nodes from a rebuilt role view):

```js
    roleSelect.addEventListener('change', () => {
      activeRole = roleSelect.value;
      activeFilter = '';
      openSnapshot = null;
      if (activeRole) {
        localStorage.setItem(ROLE_KEY, activeRole);
        buildRoleView(roleBySlug[activeRole]); // rebuild structure, collapsed, on role change
      } else {
        localStorage.removeItem(ROLE_KEY);
      }
      refreshDashboard();
    });
```

- [ ] **Step 8: Build gate**

Run: `npm run build`
Expected: completes with no errors.

- [ ] **Step 9: Manual gate**

`npm run dev`, seed progress (see "Verification model"), open dashboard. Click the **unclear** tile: the chip `Showing: Unclear ✕ clear` appears and the tile gets an amber ring. Click it again (or **clear**): chip disappears, ring clears. The tree does NOT prune yet (next tasks) — verify only the chip/highlight/clear behavior and that nothing errors in the console.

- [ ] **Step 10: Commit**

```bash
git add src/components/UserDashboard.astro
git commit -m "feat(dashboard): filter state, tile wiring, chip + filtered empty state"
```

---

## Task 3: Prune & auto-expand the pillar view

**Files:**
- Modify: `src/components/UserDashboard.astro` — `updatePillarView`

- [ ] **Step 1: Count filter matches per chapter/module/pillar in the existing loop**

Find:

```js
  function updatePillarView(progress) {
    const chapterComplete = {}, chapterUnclear = {};
    const moduleComplete  = {}, pillarComplete = {};
    const chapterTotal    = {}, moduleTotal    = {}, pillarTotal = {};
    const byChapter = {};

    topicsForClient.forEach(t => {
      (byChapter[t.chapterSlug] ??= []).push(t);
      chapterTotal[t.chapterSlug] = (chapterTotal[t.chapterSlug] ?? 0) + 1;
      moduleTotal[t.moduleKey]    = (moduleTotal[t.moduleKey]    ?? 0) + 1;
      pillarTotal[t.pillarKey]    = (pillarTotal[t.pillarKey]    ?? 0) + 1;
      const state = progress[t.id];
      if (state === 'complete') {
        chapterComplete[t.chapterSlug] = (chapterComplete[t.chapterSlug] ?? 0) + 1;
        moduleComplete[t.moduleKey]    = (moduleComplete[t.moduleKey]    ?? 0) + 1;
        pillarComplete[t.pillarKey]    = (pillarComplete[t.pillarKey]    ?? 0) + 1;
      } else if (state === 'unclear') {
        chapterUnclear[t.chapterSlug] = (chapterUnclear[t.chapterSlug] ?? 0) + 1;
      }
    });
```

Replace with (adds `*Match` tallies):

```js
  function updatePillarView(progress) {
    const chapterComplete = {}, chapterUnclear = {};
    const moduleComplete  = {}, pillarComplete = {};
    const chapterTotal    = {}, moduleTotal    = {}, pillarTotal = {};
    const chapterMatch    = {}, moduleMatch    = {}, pillarMatch = {};
    const byChapter = {};

    topicsForClient.forEach(t => {
      (byChapter[t.chapterSlug] ??= []).push(t);
      chapterTotal[t.chapterSlug] = (chapterTotal[t.chapterSlug] ?? 0) + 1;
      moduleTotal[t.moduleKey]    = (moduleTotal[t.moduleKey]    ?? 0) + 1;
      pillarTotal[t.pillarKey]    = (pillarTotal[t.pillarKey]    ?? 0) + 1;
      const state = progress[t.id];
      if (state === 'complete') {
        chapterComplete[t.chapterSlug] = (chapterComplete[t.chapterSlug] ?? 0) + 1;
        moduleComplete[t.moduleKey]    = (moduleComplete[t.moduleKey]    ?? 0) + 1;
        pillarComplete[t.pillarKey]    = (pillarComplete[t.pillarKey]    ?? 0) + 1;
      } else if (state === 'unclear') {
        chapterUnclear[t.chapterSlug] = (chapterUnclear[t.chapterSlug] ?? 0) + 1;
      }
      if (matchesFilter(state ?? 'none')) {
        chapterMatch[t.chapterSlug] = (chapterMatch[t.chapterSlug] ?? 0) + 1;
        moduleMatch[t.moduleKey]    = (moduleMatch[t.moduleKey]    ?? 0) + 1;
        pillarMatch[t.pillarKey]    = (pillarMatch[t.pillarKey]    ?? 0) + 1;
      }
    });
```

- [ ] **Step 2: Hide/auto-open pillar nodes**

Find:

```js
    pillarView.querySelectorAll('[data-pillar-node]').forEach(node => {
      const key = node.dataset.pillarNode;
      const countEl = node.querySelector('[data-pillar-count]');
      if (countEl) countEl.textContent = `${pillarComplete[key] ?? 0}/${pillarTotal[key] ?? 0}`;
    });
```

Replace with:

```js
    pillarView.querySelectorAll('[data-pillar-node]').forEach(node => {
      const key = node.dataset.pillarNode;
      const countEl = node.querySelector('[data-pillar-count]');
      if (countEl) countEl.textContent = `${pillarComplete[key] ?? 0}/${pillarTotal[key] ?? 0}`;
      if (activeFilter) {
        node.classList.toggle('hidden', (pillarMatch[key] ?? 0) === 0);
        if ((pillarMatch[key] ?? 0) > 0) node.open = true;
      } else {
        node.classList.remove('hidden');
      }
    });
```

- [ ] **Step 3: Hide/auto-open module nodes**

Find:

```js
    pillarView.querySelectorAll('[data-module-node]').forEach(node => {
      const key = node.dataset.moduleNode;
      const countEl = node.querySelector('[data-module-count]');
      if (countEl) countEl.textContent = `${moduleComplete[key] ?? 0}/${moduleTotal[key] ?? 0}`;
    });
```

Replace with:

```js
    pillarView.querySelectorAll('[data-module-node]').forEach(node => {
      const key = node.dataset.moduleNode;
      const countEl = node.querySelector('[data-module-count]');
      if (countEl) countEl.textContent = `${moduleComplete[key] ?? 0}/${moduleTotal[key] ?? 0}`;
      if (activeFilter) {
        node.classList.toggle('hidden', (moduleMatch[key] ?? 0) === 0);
        if ((moduleMatch[key] ?? 0) > 0) node.open = true;
      } else {
        node.classList.remove('hidden');
      }
    });
```

- [ ] **Step 4: Filter rows + hide/auto-open chapter nodes**

Find:

```js
    pillarView.querySelectorAll('[data-chapter-node]').forEach(node => {
      const slug    = node.dataset.chapterNode;
      const total   = chapterTotal[slug] ?? 0;
      const done    = chapterComplete[slug] ?? 0;
      const unclear = chapterUnclear[slug] ?? 0;
      const countEl = node.querySelector('[data-chapter-count]');
      if (countEl) countEl.textContent = `${done}/${total}`;
      const cBar = node.querySelector('[data-chapter-complete-bar]');
      if (cBar) cBar.style.width = `${total > 0 ? (done / total) * 100 : 0}%`;
      const uBar = node.querySelector('[data-chapter-unclear-bar]');
      if (uBar) uBar.style.width = `${total > 0 ? (unclear / total) * 100 : 0}%`;
      const container = node.querySelector('[data-chapter-topics]');
      if (container) {
        container.innerHTML = (byChapter[slug] ?? [])
          .sort((a, b) => a.order - b.order)
          .map(t => topicRow(t, progress[t.id] ?? 'none')).join('');
      }
    });
  }
```

Replace with:

```js
    pillarView.querySelectorAll('[data-chapter-node]').forEach(node => {
      const slug    = node.dataset.chapterNode;
      const total   = chapterTotal[slug] ?? 0;
      const done    = chapterComplete[slug] ?? 0;
      const unclear = chapterUnclear[slug] ?? 0;
      const countEl = node.querySelector('[data-chapter-count]');
      if (countEl) countEl.textContent = `${done}/${total}`;
      const cBar = node.querySelector('[data-chapter-complete-bar]');
      if (cBar) cBar.style.width = `${total > 0 ? (done / total) * 100 : 0}%`;
      const uBar = node.querySelector('[data-chapter-unclear-bar]');
      if (uBar) uBar.style.width = `${total > 0 ? (unclear / total) * 100 : 0}%`;
      const container = node.querySelector('[data-chapter-topics]');
      if (container) {
        container.innerHTML = (byChapter[slug] ?? [])
          .sort((a, b) => a.order - b.order)
          .filter(t => matchesFilter(progress[t.id] ?? 'none'))
          .map(t => topicRow(t, progress[t.id] ?? 'none')).join('');
      }
      if (activeFilter) {
        node.classList.toggle('hidden', (chapterMatch[slug] ?? 0) === 0);
        if ((chapterMatch[slug] ?? 0) > 0) node.open = true;
      } else {
        node.classList.remove('hidden');
      }
    });
  }
```

- [ ] **Step 5: Build gate**

Run: `npm run build`
Expected: completes with no errors.

- [ ] **Step 6: Manual gate (pillar view)**

`npm run dev`, seed progress, open dashboard with **All topics** selected (no role). Click **unclear**: only chapters/modules/pillars containing an unclear topic remain, each auto-expanded, showing just the amber topics. Click **complete** / **remaining**: tree re-prunes to those states. Click **clear**: full tree returns with your prior expand/collapse layout restored. Seed a state that matches nothing (e.g. mark nothing `complete`, then filter **complete**) and confirm `No completed topics yet` shows in place of the tree.

- [ ] **Step 7: Commit**

```bash
git add src/components/UserDashboard.astro
git commit -m "feat(dashboard): prune & auto-expand pillar view by state filter"
```

---

## Task 4: Prune & auto-expand the role view

**Files:**
- Modify: `src/components/UserDashboard.astro` — `updateRoleView`

- [ ] **Step 1: Filter section rows and hide/auto-open section + phase nodes**

Find:

```js
  function updateRoleView(role, progress) {
    role.phases.forEach((phase, pi) => {
      let phaseDone = 0, phaseTotal = 0;
      phase.sections.forEach((section, si) => {
        let secDone = 0;
        const rows = section.topics.map(t => {
          const state = progress[t.id] ?? 'none';
          if (state === 'complete') secDone++;
          return topicRow(t, state);
        }).join('');
        const cont = roleView.querySelector(`[data-rolesec-topics="${pi}-${si}"]`);
        if (cont) cont.innerHTML = rows;
        const cnt = roleView.querySelector(`[data-rolesec-count="${pi}-${si}"]`);
        if (cnt) cnt.textContent = `${secDone}/${section.topics.length}`;
        phaseDone += secDone; phaseTotal += section.topics.length;
      });
      const pCnt = roleView.querySelector(`[data-rolephase-count="${pi}"]`);
      if (pCnt) pCnt.textContent = `${phaseDone}/${phaseTotal}`;
    });
  }
```

Replace with (adds per-section/per-phase match counts, row filtering, and hide/auto-open):

```js
  function updateRoleView(role, progress) {
    role.phases.forEach((phase, pi) => {
      let phaseDone = 0, phaseTotal = 0, phaseMatch = 0;
      phase.sections.forEach((section, si) => {
        let secDone = 0, secMatch = 0;
        const rows = section.topics.map(t => {
          const state = progress[t.id] ?? 'none';
          if (state === 'complete') secDone++;
          if (matchesFilter(state)) secMatch++;
          return matchesFilter(state) ? topicRow(t, state) : '';
        }).join('');
        const cont = roleView.querySelector(`[data-rolesec-topics="${pi}-${si}"]`);
        if (cont) cont.innerHTML = rows;
        const cnt = roleView.querySelector(`[data-rolesec-count="${pi}-${si}"]`);
        if (cnt) cnt.textContent = `${secDone}/${section.topics.length}`;
        const secNode = roleView.querySelector(`[data-rolesec-node="${pi}-${si}"]`);
        if (secNode) {
          if (activeFilter) {
            secNode.classList.toggle('hidden', secMatch === 0);
            if (secMatch > 0) secNode.open = true;
          } else {
            secNode.classList.remove('hidden');
          }
        }
        phaseDone += secDone; phaseTotal += section.topics.length; phaseMatch += secMatch;
      });
      const pCnt = roleView.querySelector(`[data-rolephase-count="${pi}"]`);
      if (pCnt) pCnt.textContent = `${phaseDone}/${phaseTotal}`;
      const phaseNode = roleView.querySelector(`[data-rolephase-node="${pi}"]`);
      if (phaseNode) {
        if (activeFilter) {
          phaseNode.classList.toggle('hidden', phaseMatch === 0);
          if (phaseMatch > 0) phaseNode.open = true;
        } else {
          phaseNode.classList.remove('hidden');
        }
      }
    });
  }
```

Note: untitled-phase roles render sections with no `[data-rolephase-node]` wrapper, so `phaseNode` is `null` and the phase block is skipped — section-level pruning still applies. This is correct.

- [ ] **Step 2: Build gate**

Run: `npm run build`
Expected: completes with no errors.

- [ ] **Step 3: Manual gate (role view)**

`npm run dev`, seed progress, open dashboard, pick a role from **View as role** whose topics include your seeded unclear ones. Click **unclear**: only sections (and phases, where present) containing an unclear topic remain, auto-expanded, showing just those topics. Click **clear**: full role tree returns. Switch roles while a filter is active and confirm the filter resets to All and no console errors appear.

- [ ] **Step 4: Commit**

```bash
git add src/components/UserDashboard.astro
git commit -m "feat(dashboard): prune & auto-expand role view by state filter"
```

---

## Task 5: Final cross-cutting verification

**Files:** none (verification only)

- [ ] **Step 1: Full build**

Run: `npm run build`
Expected: no errors.

- [ ] **Step 2: Regression sweep in `npm run dev`**

Confirm all of the following with seeded progress:
1. Opening the panel always starts unfiltered (filter does not persist across closes/reloads).
2. Badge count, overall stats bar, and per-chapter mini-bars are unchanged by filtering (they reflect totals, not the filter).
3. `Reset all progress` still works and reloads.
4. Pressing `O` (SiteOverlay) and the theme toggle are unaffected.
5. Toggling between the three tiles, then clearing, restores the original expand/collapse layout.

- [ ] **Step 3: Spec sign-off**

Re-read `docs/superpowers/specs/2026-06-16-dashboard-unclear-filter-design.md` and confirm every behavior is present: clickable tiles (all three), single-select, prune & auto-expand in both views, role-selector composition, non-persistent, friendly empty state, indicator chip.

---

## Self-review notes

- **Spec coverage:** clickable tiles → Task 1/2; all three filterable → Task 2 (`data-stat-filter` on each); single-select → `setFilter` toggle logic; prune & auto-expand pillar → Task 3; role view → Task 4; role composition → Task 2 Step 7 + role view only shows role topics; non-persistent → `openDashboard` reset (Task 2 Step 4); empty state → Task 2 Step 5; indicator chip → Task 1 Step 3 + Task 2 Step 5. All covered.
- **Type/name consistency:** `activeFilter`, `matchesFilter`, `setFilter`, `snapshotOpen`/`restoreOpen`/`openSnapshot`, `currentTreeRoot`, `filterChip`/`filterLabel`/`filterClear`/`filterEmpty`, `statTiles`, `chapterMatch`/`moduleMatch`/`pillarMatch`, `secMatch`/`phaseMatch` — used consistently across tasks. Data attributes (`data-stat-filter`, `data-rolesec-node`, `data-rolephase-node`) match existing markup.
- **No placeholders:** every code step shows complete find/replace blocks.
```
