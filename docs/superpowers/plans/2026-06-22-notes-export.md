# Notes Export Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a "Copy all" button to the Notes tab in the UserDashboard that copies all the user's notes — with Pillar › Chapter › Topic breadcrumbs — to the clipboard as plain text.

**Architecture:** All changes live in a single file (`src/components/UserDashboard.astro`). Two helper functions are added to the existing inline `<script>` block: `formatNotesForClipboard()` builds the plain-text string, and `copyAllNotes(btn)` writes it to the clipboard and drives the button's visual state. `buildNotesTab()` is extended to prepend the button element and wire up the click handler.

**Tech Stack:** Astro 4, Tailwind CSS 3, vanilla TypeScript in an inline `<script define:vars>` block. No build tools beyond `npm run build`. No test framework — verification is manual via the dev server.

## Global Constraints

- All JS lives inside the existing `<script define:vars={{ topicsForClient, totalTopics, rolesForClient }}>` block in `src/components/UserDashboard.astro` — do not create new files.
- Tailwind classes must appear as complete literal strings — no string interpolation (the purger will strip dynamic class names).
- No new npm packages.
- Run `npm run build` before marking work done to confirm zero build errors.

---

### Task 1: Add `formatNotesForClipboard()` helper

**Files:**
- Modify: `src/components/UserDashboard.astro` — add function to the `<script>` block

**Interfaces:**
- Consumes: `topicsForClient` (array, already in scope), `getComments()` (already defined in same script block, returns `Record<string, string>`)
- Produces: `formatNotesForClipboard(): string` — used by Task 2

- [ ] **Step 1: Locate insertion point**

Open `src/components/UserDashboard.astro`. Find the line that reads:

```js
function getComments() {
```

The new function goes **directly after** the closing `}` of `getComments()` (around line 337).

- [ ] **Step 2: Add the function**

Insert immediately after `getComments()`:

```js
  function formatNotesForClipboard() {
    const comments = getComments();
    const now   = new Date();
    const day   = now.getDate();
    const month = now.toLocaleString('en-GB', { month: 'long' });
    const year  = now.getFullYear();

    const lines = [
      'My Learning Notes',
      `Exported ${day} ${month} ${year}`,
      '================================',
    ];

    let first = true;
    topicsForClient.forEach(t => {
      const comment = comments[t.id];
      if (!comment) return;
      if (!first) lines.push('');
      first = false;
      lines.push(`${t.pillarKey.toUpperCase()} › ${t.chapterTitle}`);
      lines.push(t.title);
      comment.split('\n').forEach(l => lines.push(`  ${l}`));
    });

    return lines.join('\n');
  }
```

- [ ] **Step 3: Smoke-test the function in the browser console**

Run the dev server:
```bash
npm run dev
```

Open the app at `http://localhost:4321`, add a note to any topic (use the pencil button on a topic page), then open the browser console on any page and run:

```js
// The function is scoped inside the <script> block so inspect indirectly:
// Open the dashboard (person icon, top right), switch to Notes tab, then in console:
console.log(document.getElementById('user-dashboard').innerHTML)
```

Verify no JS errors appear in the console. (Full clipboard test happens in Task 3.)

- [ ] **Step 4: Commit**

```bash
git add src/components/UserDashboard.astro
git commit -m "feat: add formatNotesForClipboard helper"
```

---

### Task 2: Add `copyAllNotes(btn)` with clipboard logic and visual feedback

**Files:**
- Modify: `src/components/UserDashboard.astro` — add function to the `<script>` block

**Interfaces:**
- Consumes: `formatNotesForClipboard(): string` (from Task 1)
- Produces: `copyAllNotes(btn: HTMLButtonElement): Promise<void>` — used by Task 3

- [ ] **Step 1: Add the function**

Insert directly after `formatNotesForClipboard()`:

```js
  async function copyAllNotes(btn) {
    const text = formatNotesForClipboard();

    try {
      await navigator.clipboard.writeText(text);
    } catch {
      // execCommand fallback for non-HTTPS / older browsers
      const ta = document.createElement('textarea');
      ta.value = text;
      ta.style.cssText = 'position:fixed;opacity:0;pointer-events:none';
      document.body.appendChild(ta);
      ta.select();
      try { document.execCommand('copy'); } catch { /* silent fail */ }
      document.body.removeChild(ta);
    }

    // Visual feedback: switch to "Copied!" state
    const icon  = btn.querySelector('svg');
    const label = btn.querySelector('[data-copy-label]');
    if (!icon || !label) return;

    btn.disabled = true;
    btn.classList.remove(
      'border-gray-300', 'dark:border-neutral-700',
      'text-gray-400', 'dark:text-neutral-500',
      'hover:border-amber-400', 'hover:text-amber-600', 'dark:hover:text-amber-400'
    );
    btn.classList.add(
      'border-emerald-400', 'text-emerald-600', 'dark:text-emerald-400',
      'bg-emerald-50', 'dark:bg-emerald-500/10'
    );
    icon.innerHTML = '<path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7"/>';
    icon.setAttribute('stroke-width', '2.5');
    label.textContent = 'Copied!';

    setTimeout(() => {
      btn.disabled = false;
      btn.classList.add(
        'border-gray-300', 'dark:border-neutral-700',
        'text-gray-400', 'dark:text-neutral-500',
        'hover:border-amber-400', 'hover:text-amber-600', 'dark:hover:text-amber-400'
      );
      btn.classList.remove(
        'border-emerald-400', 'text-emerald-600', 'dark:text-emerald-400',
        'bg-emerald-50', 'dark:bg-emerald-500/10'
      );
      icon.innerHTML = '<rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1"/>';
      icon.setAttribute('stroke-width', '2');
      label.textContent = 'Copy all';
    }, 2000);
  }
```

- [ ] **Step 2: Commit**

```bash
git add src/components/UserDashboard.astro
git commit -m "feat: add copyAllNotes with clipboard and visual feedback"
```

---

### Task 3: Inject button into `buildNotesTab()` and wire up click handler

**Files:**
- Modify: `src/components/UserDashboard.astro` — extend `buildNotesTab()`

**Interfaces:**
- Consumes: `copyAllNotes(btn: HTMLButtonElement)` (from Task 2), `notesTab` (existing DOM reference, `HTMLElement`)
- Produces: rendered "Copy all" button in the Notes tab, functional end-to-end

- [ ] **Step 1: Locate `buildNotesTab()` in the file**

Find the function (around line 466). It has this early-return for the empty state:

```js
    if (chapterGroups.length === 0) {
      notesTab.innerHTML = '<div class="px-5 py-10 text-center text-xs text-gray-400 dark:text-neutral-500">No notes yet — add one from any topic page.</div>';
      return;
    }
```

The button must **not** appear in the empty state — the early return already handles that correctly, so no change is needed there.

- [ ] **Step 2: Replace the `notesTab.innerHTML` assignment**

Find this block (the final assignment in `buildNotesTab()`):

```js
    notesTab.innerHTML = chapterGroups.map(group => {
```

Replace it with:

```js
    const copyBtnHtml = `
      <div class="px-5 pt-3 pb-2.5 flex justify-end">
        <button data-copy-notes-btn type="button"
          class="flex items-center gap-1.5 text-xs px-2.5 py-1 rounded-full border border-gray-300 dark:border-neutral-700 text-gray-400 dark:text-neutral-500 hover:border-amber-400 hover:text-amber-600 dark:hover:text-amber-400 transition-colors">
          <svg class="w-3 h-3 shrink-0" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
            <rect x="9" y="9" width="13" height="13" rx="2"/>
            <path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1"/>
          </svg>
          <span data-copy-label>Copy all</span>
        </button>
      </div>`;

    notesTab.innerHTML = copyBtnHtml + chapterGroups.map(group => {
```

- [ ] **Step 3: Wire up the click handler**

`buildNotesTab()` ends with `}).join('');`. Add the following **immediately after** that closing line (still inside `buildNotesTab()`):

```js
    const copyBtn = notesTab.querySelector('[data-copy-notes-btn]');
    if (copyBtn) copyBtn.addEventListener('click', () => copyAllNotes(copyBtn));
```

- [ ] **Step 4: Manual end-to-end test**

With the dev server running (`npm run dev`):

1. Navigate to any topic page (e.g. `http://localhost:4321/process/scenario-planning/process-01-scenario-planning-fundamentals/01-what-is-scenario-planning`).
2. Click the pencil (note) button and save a note.
3. Open the dashboard (person icon, top-right). Switch to the **Notes** tab.
4. Confirm the "Copy all" button appears right-aligned below the tabs bar, above the first chapter group.
5. Click "Copy all". Confirm the button changes to a checkmark + "Copied!" in emerald.
6. After 2 seconds, confirm the button reverts to its default state.
7. Paste into a text editor. Confirm the output matches:

```
My Learning Notes
Exported {today's date}
================================

{PILLAR} › {Chapter title}
{Topic title}
  {your note text}
```

8. Add notes on two different topics in the same chapter. Copy again. Confirm both appear in the output with the chapter header repeated for each note.

- [ ] **Step 5: Test dark mode**

Click the theme toggle. Confirm the button colours render correctly in dark mode (muted border/text at rest, emerald on activation).

- [ ] **Step 6: Test empty state**

Open browser DevTools → Application → Local Storage. Delete the `platform-comments` key (or clear all notes via the note button on each topic page). Re-open the Notes tab. Confirm the "No notes yet" message appears and the "Copy all" button is **absent**.

- [ ] **Step 7: Run build**

```bash
npm run build
```

Expected: zero errors, output written to `.vercel/output/static/`.

- [ ] **Step 8: Commit**

```bash
git add src/components/UserDashboard.astro
git commit -m "feat: copy all notes to clipboard from Notes tab"
```

---

### Task 4: Cleanup

- [ ] **Step 1: Delete the mockup file**

```bash
git rm mockup-notes-export.html
git commit -m "chore: remove notes export mockup"
```
