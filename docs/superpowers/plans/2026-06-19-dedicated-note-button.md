# Dedicated Note Button Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the modal-on-mark-unclear flow with a dedicated always-visible pencil icon button that opens an add/edit note modal independently of the topic's progress state.

**Architecture:** All changes are in `src/scripts/topic-progress.ts`. The file is imported once in `BaseLayout.astro` and runs `initTopicProgress()` on every page; the function guards itself with `if (!completeBtn) return` so it is a no-op on non-topic pages. No layout files need to change.

**Tech Stack:** TypeScript, Tailwind CSS 3 (classes in JS string literals are scanned by Tailwind's content scanner), localStorage, vanilla DOM.

## Global Constraints

- No test framework — verification is `npm run build` (must exit 0 with "Indexed 228 pages") plus manual browser check.
- Build output goes to `.vercel/output/static/`. Run `npm run build` from `/Users/stefanbakker/Documents/Github/Development/`.
- Tailwind class safety: all classes must appear as complete literal strings. Never use string interpolation to build class names.
- `localStorage` key `platform-comments` shape is unchanged: `{ [topicId: string]: string }`.
- `platform-progress` key and shape are unchanged.
- `_modalOpen` race-condition guard must be preserved on the new modal function.
- `topicId` format is `"chapterSlug/topicSlug"` — unchanged.
- Do NOT touch `UserDashboard.astro`. Dashboard rendering of comments (unclear topics only) is out of scope.

---

### Task 1: Rewrite `src/scripts/topic-progress.ts`

**Files:**
- Modify: `src/scripts/topic-progress.ts` (full replacement)

**Interfaces:**
- Consumes: `localStorage` keys `platform-progress` and `platform-comments`
- Produces: DOM buttons `#complete-btn`, `#unclear-btn`, and an injected note button; dispatches `platform-progress-changed` custom event

- [ ] **Step 1: Replace the file with the new implementation**

Write the complete contents of `src/scripts/topic-progress.ts`:

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
let _modalOpen = false;
let _noteEl: HTMLButtonElement | null = null;

function getModal(): HTMLDivElement {
  if (_modalEl) return _modalEl;
  const el = document.createElement('div');
  el.id = 'note-modal';
  el.setAttribute('role', 'dialog');
  el.setAttribute('aria-modal', 'true');
  el.setAttribute('aria-label', 'Add a note');
  el.style.display = 'none';
  el.className = 'fixed inset-0 z-9999 flex items-center justify-center p-4';
  el.innerHTML = `
    <div class="absolute inset-0 bg-black/40 backdrop-blur-sm" data-modal-backdrop></div>
    <div class="relative w-full max-w-sm bg-white dark:bg-gray-900 rounded-xl shadow-2xl border border-gray-200 dark:border-gray-700 p-5">
      <div class="flex items-center justify-between mb-4">
        <span data-modal-title class="text-sm font-semibold text-gray-900 dark:text-white">Add a note</span>
        <button data-modal-close class="text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 transition-colors" aria-label="Cancel">
          <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
          </svg>
        </button>
      </div>
      <textarea
        data-modal-textarea
        rows="3"
        placeholder="What's on your mind? (optional)"
        class="w-full text-sm text-gray-700 dark:text-gray-200 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg px-3 py-2.5 resize-none focus:outline-none focus:ring-2 focus:ring-amber-400/40 placeholder-gray-400 dark:placeholder-gray-500"
      ></textarea>
      <div class="flex justify-end gap-2 mt-4">
        <button data-modal-cancel class="text-xs font-medium px-3 py-1.5 rounded-full border border-gray-300 dark:border-gray-700 text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
          Cancel
        </button>
        <button data-modal-save class="text-xs font-medium px-3 py-1.5 rounded-full border border-amber-400 bg-amber-50 text-amber-700 dark:bg-amber-500/10 dark:text-amber-400 hover:bg-amber-100 dark:hover:bg-amber-500/20 transition-colors">
          Save
        </button>
      </div>
    </div>
  `;
  document.body.appendChild(el);
  _modalEl = el;
  return el;
}

// Resolves with:
//   null         → cancelled (×, Escape, backdrop) — no change
//   ''           → saved with empty textarea — delete existing comment
//   'some text'  → saved with text — save/update comment
function openNoteModal(existing: string): Promise<string | null> {
  if (_modalOpen) return Promise.resolve(null);
  _modalOpen = true;
  return new Promise(resolve => {
    const modal     = getModal();
    const titleEl   = modal.querySelector('[data-modal-title]')    as HTMLSpanElement;
    const textarea  = modal.querySelector('[data-modal-textarea]') as HTMLTextAreaElement;
    const cancelBtn = modal.querySelector('[data-modal-cancel]')   as HTMLButtonElement;
    const saveBtn   = modal.querySelector('[data-modal-save]')     as HTMLButtonElement;
    const closeBtn  = modal.querySelector('[data-modal-close]')    as HTMLButtonElement;
    const backdrop  = modal.querySelector('[data-modal-backdrop]') as HTMLDivElement;

    titleEl.textContent = existing ? 'Edit note' : 'Add a note';
    textarea.value = existing;
    modal.style.display = 'flex';
    textarea.focus();

    function cleanup() {
      _modalOpen = false;
      modal.style.display = 'none';
      cancelBtn.removeEventListener('click',  onCancel);
      saveBtn.removeEventListener('click',    onSave);
      closeBtn.removeEventListener('click',   onCancel);
      backdrop.removeEventListener('click',   onCancel);
      document.removeEventListener('keydown', onKeydown);
    }

    function onSave()   { cleanup(); resolve(textarea.value.trim()); }
    function onCancel() { cleanup(); resolve(null); }
    function onKeydown(e: KeyboardEvent) { if (e.key === 'Escape') onCancel(); }

    cancelBtn.addEventListener('click',  onCancel);
    saveBtn.addEventListener('click',    onSave);
    closeBtn.addEventListener('click',   onCancel);
    backdrop.addEventListener('click',   onCancel);
    document.addEventListener('keydown', onKeydown);
  });
}

function getNoteButton(anchor: HTMLButtonElement): HTMLButtonElement {
  if (_noteEl) return _noteEl;
  const btn = document.createElement('button');
  btn.type = 'button';
  btn.setAttribute('aria-label', 'Add or edit note');
  btn.className = 'relative flex items-center py-1.5 px-2 rounded-full border border-gray-300 dark:border-gray-700 text-gray-500 dark:text-gray-400 hover:border-amber-400 hover:text-amber-600 dark:hover:text-amber-400 transition-colors';
  btn.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 013 3L7 19l-4 1 1-4L16.5 3.5z"/></svg><span data-note-tooltip style="display:none" class="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 max-w-[180px] bg-gray-900 dark:bg-gray-800 text-white text-xs rounded-lg px-2.5 py-1.5 shadow-lg pointer-events-none whitespace-normal text-left leading-snug z-9998"></span>`;
  anchor.insertAdjacentElement('afterend', btn);
  btn.addEventListener('mouseenter', () => {
    const tip = btn.querySelector('[data-note-tooltip]') as HTMLSpanElement;
    if (tip && tip.textContent) tip.style.display = 'block';
  });
  btn.addEventListener('mouseleave', () => {
    const tip = btn.querySelector('[data-note-tooltip]') as HTMLSpanElement;
    if (tip) tip.style.display = 'none';
  });
  _noteEl = btn;
  return btn;
}

function initTopicProgress() {
  const completeBtn   = document.getElementById('complete-btn')   as HTMLButtonElement | null;
  const completeLabel = document.getElementById('complete-label');
  const unclearBtn    = document.getElementById('unclear-btn')    as HTMLButtonElement | null;
  const unclearLabel  = document.getElementById('unclear-label');

  if (!completeBtn || !completeLabel || !unclearBtn || !unclearLabel) return;

  const topicId = completeBtn.getAttribute('data-topic-id');
  if (!topicId) return;

  const noteBtn = getNoteButton(unclearBtn);

  function updateNoteButton() {
    const comment = getComments()[topicId!];
    const tip = noteBtn.querySelector('[data-note-tooltip]') as HTMLSpanElement | null;
    if (comment) {
      noteBtn.classList.remove('border-gray-300', 'dark:border-gray-700', 'text-gray-500', 'dark:text-gray-400');
      noteBtn.classList.add('border-amber-400', 'text-amber-600', 'bg-amber-50', 'dark:bg-amber-500/10', 'dark:text-amber-400');
      if (tip) tip.textContent = comment;
    } else {
      noteBtn.classList.add('border-gray-300', 'dark:border-gray-700', 'text-gray-500', 'dark:text-gray-400');
      noteBtn.classList.remove('border-amber-400', 'text-amber-600', 'bg-amber-50', 'dark:bg-amber-500/10', 'dark:text-amber-400');
      if (tip) tip.textContent = '';
    }
  }

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
    updateNoteButton();
  }

  function applyComplete() {
    const p = getProgress();
    const wasSet = p[topicId!] === 'complete';
    if (wasSet) {
      delete p[topicId!];
    } else {
      p[topicId!] = 'complete';
    }
    saveProgress(p);
    updateButtons(p[topicId!]);
    window.dispatchEvent(new CustomEvent('platform-progress-changed'));
    if (!wasSet) advanceToNext();
  }

  function handleUnclear() {
    const p = getProgress();
    const wasUnclear = p[topicId!] === 'unclear';
    if (wasUnclear) {
      delete p[topicId!];
    } else {
      p[topicId!] = 'unclear';
    }
    saveProgress(p);
    updateButtons(p[topicId!]);
    window.dispatchEvent(new CustomEvent('platform-progress-changed'));
    if (!wasUnclear) advanceToNext();
  }

  async function handleNote() {
    const existing = getComments()[topicId!] ?? '';
    const result = await openNoteModal(existing);
    if (result === null) return;
    if (result === '') {
      deleteComment(topicId!);
    } else {
      saveComment(topicId!, result);
    }
    updateNoteButton();
    window.dispatchEvent(new CustomEvent('platform-progress-changed'));
  }

  updateButtons(getProgress()[topicId]);
  completeBtn.addEventListener('click', applyComplete);
  unclearBtn.addEventListener('click', handleUnclear);
  noteBtn.addEventListener('click', handleNote);
}

initTopicProgress();
```

- [ ] **Step 2: Verify the build passes**

```bash
cd /Users/stefanbakker/Documents/Github/Development && npm run build 2>&1 | tail -15
```

Expected output includes:
```
Indexed 228 pages
Finished in ...
```

No TypeScript errors, no "build failed" lines.

- [ ] **Step 3: Commit**

```bash
git add src/scripts/topic-progress.ts
git commit -m "feat: dedicated note button, decouple comment from mark-unclear"
```
