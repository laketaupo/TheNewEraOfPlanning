# Unclear Comment Feature Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** When a user marks a topic "unclear", open a modal letting them type an optional note; show that note in the progress dashboard alongside the unclear topic.

**Architecture:** Two files are touched. `topic-progress.ts` gains comment storage helpers and a modal (injected once into `<body>` on first use, reused thereafter). `UserDashboard.astro`'s client `<script>` reads the same `platform-comments` key and renders any comment below the topic title row. A "Reset all progress" click also clears `platform-comments`.

**Tech Stack:** TypeScript (compiled by Astro/Vite), Tailwind CSS, browser `localStorage`, no test framework — verification is manual in the dev server.

## Global Constraints

- Tailwind classes must appear as complete, uninterpolated strings (no template-literal class building).
- The `platform-progress` localStorage key shape is NOT changed — no migration.
- New key: `platform-comments = { [topicId: string]: string }`.
- `topicId` format: `"chapterSlug/topicSlug"` — identical to the existing progress key format.
- `npm run dev` starts the dev server at `http://localhost:4321`.
- `npm run build` must pass with zero errors before the final commit.

---

### Task 1: Update `topic-progress.ts` — comment storage + modal + updated toggle logic

**Files:**
- Modify: `src/scripts/topic-progress.ts`

**Interfaces:**
- Produces: `COMMENTS_KEY` constant and `platform-comments` localStorage entries consumed by Task 2.
- Produces: Modal DOM (`#unclear-comment-modal`) appended to `<body>` on first unclear click.

- [ ] **Step 1: Replace the entire contents of `src/scripts/topic-progress.ts`**

  The new file adds `COMMENTS_KEY`, three comment helpers (`getComments`, `saveComment`, `deleteComment`), a lazily-created modal (`getModal`, `openUnclearModal`), and splits the single `toggle` into `applyComplete` and `handleUnclear`.

  ```typescript
  const STORAGE_KEY      = 'platform-progress';
  const COMMENTS_KEY     = 'platform-comments';
  const ADVANCE_DELAY_MS = 400;

  type ProgressState = 'complete' | 'unclear';
  type ProgressMap   = Record<string, ProgressState>;
  type CommentsMap   = Record<string, string>;

  function getProgress(): ProgressMap {
    try {
      const raw = JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}');
      const result: ProgressMap = {};
      for (const [k, v] of Object.entries(raw)) {
        if (v === 'complete' || v === 'unclear') result[k] = v;
        else if (v === true) result[k] = 'complete';
      }
      return result;
    } catch {
      return {};
    }
  }

  function saveProgress(p: ProgressMap) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(p));
  }

  function getComments(): CommentsMap {
    try {
      return JSON.parse(localStorage.getItem(COMMENTS_KEY) || '{}') as CommentsMap;
    } catch {
      return {};
    }
  }

  function saveComment(id: string, text: string) {
    const c = getComments();
    c[id] = text;
    localStorage.setItem(COMMENTS_KEY, JSON.stringify(c));
  }

  function deleteComment(id: string) {
    const c = getComments();
    if (!(id in c)) return;
    delete c[id];
    localStorage.setItem(COMMENTS_KEY, JSON.stringify(c));
  }

  function advanceToNext() {
    const nav = document.querySelector('[data-role-nav]');
    if (!nav) return;
    const links = nav.querySelectorAll('a[href]');
    const nextA = links[links.length - 1] as HTMLAnchorElement | undefined;
    const href = nextA?.getAttribute('href');
    if (href) setTimeout(() => { window.location.href = href; }, ADVANCE_DELAY_MS);
  }

  let _modalEl: HTMLDivElement | null = null;

  function getModal(): HTMLDivElement {
    if (_modalEl) return _modalEl;
    const el = document.createElement('div');
    el.id = 'unclear-comment-modal';
    el.setAttribute('role', 'dialog');
    el.setAttribute('aria-modal', 'true');
    el.setAttribute('aria-label', 'Add a note');
    el.style.display = 'none';
    el.className = 'fixed inset-0 z-9999 flex items-center justify-center p-4';
    el.innerHTML = `
      <div class="absolute inset-0 bg-black/40 backdrop-blur-sm" data-modal-backdrop></div>
      <div class="relative w-full max-w-sm bg-white dark:bg-gray-900 rounded-xl shadow-2xl border border-gray-200 dark:border-gray-700 p-5">
        <div class="flex items-center justify-between mb-4">
          <span class="text-sm font-semibold text-gray-900 dark:text-white">Add a note</span>
          <button data-modal-close class="text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 transition-colors" aria-label="Cancel">
            <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
            </svg>
          </button>
        </div>
        <textarea
          data-modal-textarea
          rows="3"
          placeholder="What's unclear? (optional)"
          class="w-full text-sm text-gray-700 dark:text-gray-200 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg px-3 py-2.5 resize-none focus:outline-none focus:ring-2 focus:ring-amber-400/40 placeholder-gray-400 dark:placeholder-gray-500"
        ></textarea>
        <div class="flex justify-end gap-2 mt-4">
          <button data-modal-skip class="text-xs font-medium px-3 py-1.5 rounded-full border border-gray-300 dark:border-gray-700 text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
            Skip
          </button>
          <button data-modal-save class="text-xs font-medium px-3 py-1.5 rounded-full border border-amber-400 bg-amber-50 text-amber-700 dark:bg-amber-500/10 dark:text-amber-400 hover:bg-amber-100 dark:hover:bg-amber-500/20 transition-colors">
            Save &amp; next
          </button>
        </div>
      </div>
    `;
    document.body.appendChild(el);
    _modalEl = el;
    return el;
  }

  // Resolves with:
  //   null         → cancelled (×, Escape, backdrop) — do NOT mark unclear
  //   ''           → skip clicked — mark unclear, no comment
  //   'some text'  → save clicked — mark unclear, save comment
  function openUnclearModal(): Promise<string | null> {
    return new Promise(resolve => {
      const modal    = getModal();
      const textarea = modal.querySelector('[data-modal-textarea]') as HTMLTextAreaElement;
      const skipBtn  = modal.querySelector('[data-modal-skip]')     as HTMLButtonElement;
      const saveBtn  = modal.querySelector('[data-modal-save]')     as HTMLButtonElement;
      const closeBtn = modal.querySelector('[data-modal-close]')    as HTMLButtonElement;
      const backdrop = modal.querySelector('[data-modal-backdrop]') as HTMLDivElement;

      textarea.value = '';
      modal.style.display = 'flex';
      textarea.focus();

      function cleanup() {
        modal.style.display = 'none';
        skipBtn.removeEventListener('click',    onSkip);
        saveBtn.removeEventListener('click',    onSave);
        closeBtn.removeEventListener('click',   onCancel);
        backdrop.removeEventListener('click',   onCancel);
        document.removeEventListener('keydown', onKeydown);
      }

      function onSkip()   { cleanup(); resolve(''); }
      function onSave()   { cleanup(); resolve(textarea.value.trim()); }
      function onCancel() { cleanup(); resolve(null); }
      function onKeydown(e: KeyboardEvent) { if (e.key === 'Escape') onCancel(); }

      skipBtn.addEventListener('click',    onSkip);
      saveBtn.addEventListener('click',    onSave);
      closeBtn.addEventListener('click',   onCancel);
      backdrop.addEventListener('click',   onCancel);
      document.addEventListener('keydown', onKeydown);
    });
  }

  function initTopicProgress() {
    const completeBtn   = document.getElementById('complete-btn');
    const completeLabel = document.getElementById('complete-label');
    const unclearBtn    = document.getElementById('unclear-btn');
    const unclearLabel  = document.getElementById('unclear-label');

    if (!completeBtn || !completeLabel || !unclearBtn || !unclearLabel) return;

    const topicId = completeBtn.getAttribute('data-topic-id');
    if (!topicId) return;

    function updateButtons(state: ProgressState | undefined) {
      if (state === 'complete') {
        completeBtn!.classList.remove('border-gray-300', 'dark:border-gray-700', 'text-gray-500', 'dark:text-gray-400');
        completeBtn!.classList.add('border-emerald-500', 'text-emerald-600', 'bg-emerald-50', 'dark:bg-emerald-500/10', 'dark:text-emerald-400');
        completeLabel!.textContent = 'Completed';
      } else {
        completeBtn!.classList.add('border-gray-300', 'dark:border-gray-700', 'text-gray-500', 'dark:text-gray-400');
        completeBtn!.classList.remove('border-emerald-500', 'text-emerald-600', 'bg-emerald-50', 'dark:bg-emerald-500/10', 'dark:text-emerald-400');
        completeLabel!.textContent = 'Mark complete';
      }
      if (state === 'unclear') {
        unclearBtn!.classList.remove('border-gray-300', 'dark:border-gray-700', 'text-gray-500', 'dark:text-gray-400');
        unclearBtn!.classList.add('border-amber-400', 'text-amber-600', 'bg-amber-50', 'dark:bg-amber-500/10', 'dark:text-amber-400');
        unclearLabel!.textContent = 'Unclear';
      } else {
        unclearBtn!.classList.add('border-gray-300', 'dark:border-gray-700', 'text-gray-500', 'dark:text-gray-400');
        unclearBtn!.classList.remove('border-amber-400', 'text-amber-600', 'bg-amber-50', 'dark:bg-amber-500/10', 'dark:text-amber-400');
        unclearLabel!.textContent = 'Mark unclear';
      }
    }

    function applyComplete() {
      const p = getProgress();
      const wasSet = p[topicId!] === 'complete';
      if (wasSet) {
        delete p[topicId!];
      } else {
        if (p[topicId!] === 'unclear') deleteComment(topicId!);
        p[topicId!] = 'complete';
      }
      saveProgress(p);
      updateButtons(p[topicId!]);
      window.dispatchEvent(new CustomEvent('platform-progress-changed'));
      if (!wasSet) advanceToNext();
    }

    async function handleUnclear() {
      const p = getProgress();
      if (p[topicId!] === 'unclear') {
        delete p[topicId!];
        deleteComment(topicId!);
        saveProgress(p);
        updateButtons(undefined);
        window.dispatchEvent(new CustomEvent('platform-progress-changed'));
        return;
      }
      const comment = await openUnclearModal();
      if (comment === null) return;
      p[topicId!] = 'unclear';
      if (comment) saveComment(topicId!, comment);
      saveProgress(p);
      updateButtons('unclear');
      window.dispatchEvent(new CustomEvent('platform-progress-changed'));
      advanceToNext();
    }

    updateButtons(getProgress()[topicId]);
    completeBtn.addEventListener('click', applyComplete);
    unclearBtn.addEventListener('click', handleUnclear);
  }

  initTopicProgress();
  ```

- [ ] **Step 2: Start the dev server and verify the modal**

  Run: `npm run dev`

  Navigate to any topic page (e.g. `http://localhost:4321/technology/planning-software/01-understanding-basics/what-is-a-planning-tool`).

  Expected:
  - Clicking **Mark unclear** opens the modal (dark backdrop, white card, textarea, Skip + Save & next buttons).
  - Pressing **Escape** or clicking the backdrop or **×** dismisses the modal — topic stays unmarked.
  - Clicking **Skip** marks the topic unclear and auto-advances. No entry appears in `localStorage.getItem('platform-comments')`.
  - Clicking **Save & next** with text typed marks the topic unclear and saves the comment. In the browser console: `JSON.parse(localStorage.getItem('platform-comments'))` should show `{ "chapterSlug/topicSlug": "your text" }`.
  - Clicking the amber **Unclear** button again (toggling off) clears both the progress state and the comment from `platform-comments`.
  - Marking a topic **complete** that was previously unclear also removes the comment from `platform-comments`.

- [ ] **Step 3: Commit**

  ```bash
  git add src/scripts/topic-progress.ts
  git commit -m "feat: open comment modal when marking a topic unclear"
  ```

---

### Task 2: Update `UserDashboard.astro` — show comments in topic rows + clear on reset

**Files:**
- Modify: `src/components/UserDashboard.astro` (client `<script>` block only)

**Interfaces:**
- Consumes: `platform-comments` localStorage key written by Task 1.
- Produces: Comment text rendered below the topic title in the dashboard tree for unclear topics.

- [ ] **Step 1: Add `COMMENTS_KEY` constant and `getComments` helper**

  In the `<script>` block, after the line `const ROLE_KEY = 'platform-dashboard-role';` (line 304), add:

  ```js
  const COMMENTS_KEY = 'platform-comments';

  function getComments() {
    try { return JSON.parse(localStorage.getItem(COMMENTS_KEY) || '{}'); }
    catch { return {}; }
  }
  ```

- [ ] **Step 2: Update `topicRow` to accept and render a comment**

  Replace the existing `topicRow` function:

  ```js
  // A topic row used in both views
  function topicRow(t, state) {
    const dot = dotClass[state] ?? dotClass.none;
    return `<a href="${esc(t.url)}"
               class="flex items-center gap-2 py-0.5 group"
               onclick="document.getElementById('user-dashboard').classList.add('hidden');document.body.style.overflow='';">
              <span class="w-1.5 h-1.5 rounded-full ${dot} shrink-0"></span>
              <span class="text-[11px] text-gray-600 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white leading-snug truncate">${esc(t.title)}</span>
            </a>`;
  }
  ```

  With:

  ```js
  // A topic row used in both views
  function topicRow(t, state, comment) {
    const dot = dotClass[state] ?? dotClass.none;
    const commentLine = (state === 'unclear' && comment)
      ? `<span class="block text-[10px] italic text-amber-600 dark:text-amber-400 truncate" title="${esc(comment)}">${esc(comment)}</span>`
      : '';
    return `<a href="${esc(t.url)}"
               class="flex items-start gap-2 py-0.5 group"
               onclick="document.getElementById('user-dashboard').classList.add('hidden');document.body.style.overflow='';">
              <span class="w-1.5 h-1.5 rounded-full ${dot} shrink-0 mt-1"></span>
              <span class="flex-1 min-w-0">
                <span class="block text-[11px] text-gray-600 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white leading-snug truncate">${esc(t.title)}</span>
                ${commentLine}
              </span>
            </a>`;
  }
  ```

- [ ] **Step 3: Update `updateRoleView` to accept and pass comments**

  Change the function signature from:
  ```js
  function updateRoleView(role, progress) {
  ```
  to:
  ```js
  function updateRoleView(role, progress, comments) {
  ```

  Change the inner `topicRow` call from:
  ```js
          return matchesFilter(state) ? topicRow(t, state) : '';
  ```
  to:
  ```js
          return matchesFilter(state) ? topicRow(t, state, comments[t.id]) : '';
  ```

- [ ] **Step 4: Update `updatePillarView` to accept and pass comments**

  Change the function signature from:
  ```js
  function updatePillarView(progress) {
  ```
  to:
  ```js
  function updatePillarView(progress, comments) {
  ```

  Change the inner `topicRow` call from:
  ```js
          .map(t => topicRow(t, progress[t.id] ?? 'none')).join('');
  ```
  to:
  ```js
          .map(t => topicRow(t, progress[t.id] ?? 'none', comments[t.id])).join('');
  ```

- [ ] **Step 5: Update `refreshDashboard` to load comments and pass them through**

  Change:
  ```js
  function refreshDashboard() {
    const progress = getProgress();
    const role = activeRole ? roleBySlug[activeRole] : null;
  ```
  to:
  ```js
  function refreshDashboard() {
    const progress = getProgress();
    const comments = getComments();
    const role = activeRole ? roleBySlug[activeRole] : null;
  ```

  Change the two view-update call sites:
  ```js
      updateRoleView(role, progress);
  ```
  →
  ```js
      updateRoleView(role, progress, comments);
  ```

  ```js
      updatePillarView(progress);
  ```
  →
  ```js
      updatePillarView(progress, comments);
  ```

- [ ] **Step 6: Clear `platform-comments` on progress reset**

  Find the reset button handler:
  ```js
  document.getElementById('dash-reset-btn').addEventListener('click', () => {
    if (confirm('Reset all progress? This cannot be undone.')) {
      localStorage.removeItem(STORAGE_KEY);
      refreshDashboard();
      location.reload();
    }
  });
  ```

  Replace with:
  ```js
  document.getElementById('dash-reset-btn').addEventListener('click', () => {
    if (confirm('Reset all progress? This cannot be undone.')) {
      localStorage.removeItem(STORAGE_KEY);
      localStorage.removeItem(COMMENTS_KEY);
      refreshDashboard();
      location.reload();
    }
  });
  ```

- [ ] **Step 7: Verify in the dev server**

  With the dev server still running (restart if needed: `npm run dev`):

  1. Navigate to a topic, click **Mark unclear**, type a note, click **Save & next**.
  2. Open the progress dashboard (person icon, top-right).
  3. Expand the chapter containing the topic you just marked.
  4. Expected: the topic row shows the note in italic amber text below the title. Hovering it shows the full text in a tooltip.
  5. Navigate to a second topic, click **Mark unclear**, click **Skip**.
  6. In the dashboard, verify the second topic has no comment line — only the amber dot and title.
  7. Click **Reset all progress** and confirm. Check the console: both `localStorage.getItem('platform-progress')` and `localStorage.getItem('platform-comments')` should return `null`.

- [ ] **Step 8: Commit**

  ```bash
  git add src/components/UserDashboard.astro
  git commit -m "feat: show unclear comments in progress dashboard"
  ```

---

### Task 3: Build verification

**Files:** (none modified — verification only)

- [ ] **Step 1: Run the production build**

  ```bash
  npm run build
  ```

  Expected: build completes with no TypeScript errors, no Astro errors, and output written to `.vercel/output/static/`.

- [ ] **Step 2: Commit if any build-time fixes were needed**

  If the build surfaced any TypeScript errors that required changes, fix them, then:

  ```bash
  git add <changed files>
  git commit -m "fix: resolve build errors from unclear comment feature"
  ```

  If the build passed cleanly in Step 1, no additional commit is needed.
