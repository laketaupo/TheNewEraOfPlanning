# IntroOverlay Full-Build Sync Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Update the welcome overlay to reflect all features in the current build — adding a Personal notes section and extending Getting around to mention Glossary tooltips and FAQ.

**Architecture:** Single file edit to `src/components/IntroOverlay.astro`. Two changes: (1) replace the body text of Section 2 (Getting around), (2) insert a new Section 4 (Personal notes) between the existing "Tracking your progress" and "Role-based learning paths" sections.

**Tech Stack:** Astro 4, Tailwind CSS 3. No tests configured — verification is manual via `npm run build` + `npm run preview`.

## Global Constraints

- No new files, routes, components, or localStorage keys
- All section icons use `width="18" height="18"` `stroke-width="1.75"` `stroke-linecap="round"` `stroke-linejoin="round"` and `class="text-gray-400 dark:text-neutral-500"`
- Body text uses `class="text-sm text-gray-500 dark:text-neutral-400 leading-relaxed"`
- Headings use `class="text-base font-semibold text-gray-900 dark:text-white mb-2"`
- `<strong>` inside body text uses `class="text-gray-700 dark:text-neutral-300 font-medium"`
- `<kbd>` uses `class="inline-block px-1.5 py-0.5 text-[11px] font-semibold rounded border border-gray-200 dark:border-neutral-700 bg-gray-50 dark:bg-neutral-800 text-gray-600 dark:text-neutral-400"`
- All sections except the last have `border-b border-gray-100 dark:border-neutral-800`

---

### Task 1: Update IntroOverlay — Getting around body + add Personal notes section

**Files:**
- Modify: `src/components/IntroOverlay.astro:55-98`

**Interfaces:**
- Consumes: nothing (self-contained component)
- Produces: nothing (rendered at runtime via `window.openIntro()` and auto-show on first visit)

- [ ] **Step 1: Replace the "Getting around" section body text**

In `src/components/IntroOverlay.astro`, find the Getting around section (the `<div class="flex-1">` block that starts with the "Getting around" `<h2>`). Replace the `<p>` tag's content entirely:

Current:
```html
          <p class="text-sm text-gray-500 dark:text-neutral-400 leading-relaxed">
            Press <kbd class="inline-block px-1.5 py-0.5 text-[11px] font-semibold rounded border border-gray-200 dark:border-neutral-700 bg-gray-50 dark:bg-neutral-800 text-gray-600 dark:text-neutral-400">O</kbd> at any time to open the full navigation menu and jump to any topic directly. Use <kbd class="inline-block px-1.5 py-0.5 text-[11px] font-semibold rounded border border-gray-200 dark:border-neutral-700 bg-gray-50 dark:bg-neutral-800 text-gray-600 dark:text-neutral-400">/</kbd> to search by keyword. Inside a topic, the previous and next arrows at the bottom move you through the chapter in sequence.
          </p>
```

Replace with:
```html
          <p class="text-sm text-gray-500 dark:text-neutral-400 leading-relaxed">
            Press <kbd class="inline-block px-1.5 py-0.5 text-[11px] font-semibold rounded border border-gray-200 dark:border-neutral-700 bg-gray-50 dark:bg-neutral-800 text-gray-600 dark:text-neutral-400">O</kbd> at any time to open the full navigation menu and jump to any topic directly. Use <kbd class="inline-block px-1.5 py-0.5 text-[11px] font-semibold rounded border border-gray-200 dark:border-neutral-700 bg-gray-50 dark:bg-neutral-800 text-gray-600 dark:text-neutral-400">/</kbd> to search by keyword across all content — it also searches your personal notes. Inside a topic, the previous and next arrows at the bottom move you through the chapter in sequence. Hover any underlined term to see its definition inline from the Glossary. For quick answers to common questions, use the <strong class="text-gray-700 dark:text-neutral-300 font-medium">?</strong> icon in the top-right nav or visit <strong class="text-gray-700 dark:text-neutral-300 font-medium">/faq</strong>.
          </p>
```

- [ ] **Step 2: Add the Personal notes section between "Tracking your progress" and "Role-based learning paths"**

In `src/components/IntroOverlay.astro`, find the "Role-based learning paths" section. It currently opens with:
```html
      <!-- Roles -->
      <div class="py-6 flex gap-8">
```

Insert the following block immediately before that `<!-- Roles -->` comment:
```html
      <!-- Notes -->
      <div class="py-6 flex gap-8 border-b border-gray-100 dark:border-neutral-800">
        <div class="shrink-0 w-7 pt-0.5">
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" class="text-gray-400 dark:text-neutral-500">
            <path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 013 3L7 19l-4 1 1-4L16.5 3.5z"/>
          </svg>
        </div>
        <div class="flex-1">
          <h2 class="text-base font-semibold text-gray-900 dark:text-white mb-2">Personal notes</h2>
          <p class="text-sm text-gray-500 dark:text-neutral-400 leading-relaxed">
            On any topic page, the amber pen button next to the progress controls lets you write a note — a thought, a question, something to follow up on. Hover the button to preview your note without opening it. The search bar (<kbd class="inline-block px-1.5 py-0.5 text-[11px] font-semibold rounded border border-gray-200 dark:border-neutral-700 bg-gray-50 dark:bg-neutral-800 text-gray-600 dark:text-neutral-400">/</kbd>) finds notes alongside content results, so you can locate a note by what you wrote rather than where you wrote it. To review everything in one place, open the progress dashboard (the person icon, top-right), switch to the <strong class="text-gray-700 dark:text-neutral-300 font-medium">Notes</strong> tab, and use <strong class="text-gray-700 dark:text-neutral-300 font-medium">Copy all</strong> to export your notes as plain text.
          </p>
        </div>
      </div>

```

- [ ] **Step 3: Build and verify**

```bash
npm run build
```

Expected: build completes with no errors or warnings.

- [ ] **Step 4: Preview and manually verify the overlay**

```bash
npm run preview
```

Open the site in a browser. Clear `platform-intro-seen` from localStorage (DevTools → Application → Local Storage → delete the key) then reload. The overlay should appear automatically.

Check:
1. **Section 2 — Getting around:** body now mentions "it also searches your personal notes", glossary hover tooltip sentence, and the `?` icon / `/faq` sentence
2. **Section 4 — Personal notes:** appears between "Tracking your progress" and "Role-based learning paths" with the pencil icon, correct amber button description, search mention, and Notes tab / Copy all export mention
3. **Section 5 — Role-based learning paths:** still present, unchanged, no `border-b` (last section)
4. Dark mode: toggle dark mode and verify all text, borders, and the new icon render correctly
5. The overlay closes correctly via ✕, backdrop click, Escape, and "Get started"

- [ ] **Step 5: Commit**

```bash
git add src/components/IntroOverlay.astro
git commit -m "feat: update intro overlay with notes, glossary, and FAQ features"
```
