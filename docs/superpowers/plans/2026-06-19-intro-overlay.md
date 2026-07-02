# Intro Overlay Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a first-visit welcome overlay explaining the four pillars, navigation, progress tracking, and role-based courses — triggered by a new ⓘ button in the top-right icon bar.

**Architecture:** One new Astro component (`IntroOverlay.astro`) handles all markup, styles, and JS for the overlay. `BaseLayout.astro` imports it, renders it in the body, and adds the ⓘ trigger button to the existing icon bar. Auto-show-on-first-visit is handled via `localStorage` entirely in the component's inline script.

**Tech Stack:** Astro 4, Tailwind CSS 3, vanilla JS (no external dependencies).

## Global Constraints

- Tailwind class safety: never use string interpolation for class names — use full class strings only.
- z-index ladder: icon bar `z-55`, dashboard `z-9990`, **intro overlay `z-9995`**, site overlay `z-9999`.
- localStorage key: `platform-intro-seen` — set to `'true'` on any dismiss.
- Toggle mechanism: `.hidden` class on the root overlay element (same pattern as `SiteOverlay` and `UserDashboard`).
- Dark mode: all elements must use `dark:` variants; panel background `bg-white dark:bg-gray-900`.
- Build must pass: run `npm run build` as the final verification step.

---

### Task 1: Create IntroOverlay component

**Files:**
- Create: `src/components/IntroOverlay.astro`

- [ ] **Step 1: Create the file with the full component**

`src/components/IntroOverlay.astro`:

```astro
---
// No props needed
---

<div
  id="intro-overlay"
  class="fixed inset-0 z-9995 hidden flex items-center justify-center p-4 sm:p-8"
>
  <!-- Backdrop -->
  <div id="intro-backdrop" class="absolute inset-0 bg-black/50 backdrop-blur-sm"></div>

  <!-- Panel -->
  <div class="relative z-10 w-[92vw] max-w-4xl max-h-[88vh] flex flex-col bg-white dark:bg-gray-900 rounded-2xl shadow-2xl overflow-hidden">

    <!-- Header -->
    <div class="shrink-0 flex items-start justify-between px-10 pt-10 pb-6">
      <div>
        <p class="text-[11px] font-bold uppercase tracking-widest text-gray-400 dark:text-gray-500 mb-3">Planning Hub</p>
        <h1 class="text-2xl font-semibold text-gray-900 dark:text-white leading-snug">
          Welcome — here's what you can do here
        </h1>
      </div>
      <button
        id="intro-close"
        aria-label="Close intro"
        class="ml-6 mt-1 shrink-0 w-7 h-7 flex items-center justify-center rounded-lg text-gray-300 dark:text-gray-600 hover:text-gray-600 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
          <path d="M18 6 6 18M6 6l12 12"/>
        </svg>
      </button>
    </div>

    <!-- Divider -->
    <div class="shrink-0 h-px bg-gray-100 dark:bg-gray-800 mx-10"></div>

    <!-- Sections -->
    <div class="flex-1 overflow-y-auto px-10 py-6 space-y-0">

      <!-- Pillars -->
      <div class="py-6 flex gap-8 border-b border-gray-100 dark:border-gray-800">
        <div class="shrink-0 w-7 pt-0.5">
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" class="text-gray-400 dark:text-gray-500">
            <rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/>
          </svg>
        </div>
        <div class="flex-1">
          <h2 class="text-base font-semibold text-gray-900 dark:text-white mb-2">Four learning pillars</h2>
          <p class="text-sm text-gray-500 dark:text-gray-400 leading-relaxed">
            All content is organized across four pillars — <strong class="text-gray-700 dark:text-gray-300 font-medium">Technology</strong>, <strong class="text-gray-700 dark:text-gray-300 font-medium">Process</strong>, <strong class="text-gray-700 dark:text-gray-300 font-medium">Data</strong>, and <strong class="text-gray-700 dark:text-gray-300 font-medium">People</strong> — covering the full landscape of supply chain planning. Each pillar contains modules, which are divided into chapters, which contain individual topics you work through at your own pace.
          </p>
        </div>
      </div>

      <!-- Navigate -->
      <div class="py-6 flex gap-8 border-b border-gray-100 dark:border-gray-800">
        <div class="shrink-0 w-7 pt-0.5">
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" class="text-gray-400 dark:text-gray-500">
            <polygon points="3 11 22 2 13 21 11 13 3 11"/>
          </svg>
        </div>
        <div class="flex-1">
          <h2 class="text-base font-semibold text-gray-900 dark:text-white mb-2">Getting around</h2>
          <p class="text-sm text-gray-500 dark:text-gray-400 leading-relaxed">
            Press <kbd class="inline-block px-1.5 py-0.5 text-[11px] font-semibold rounded border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-600 dark:text-gray-400">O</kbd> at any time to open the full navigation menu and jump to any topic directly. Use <kbd class="inline-block px-1.5 py-0.5 text-[11px] font-semibold rounded border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-600 dark:text-gray-400">/</kbd> to search by keyword. Inside a topic, the previous and next arrows at the bottom move you through the chapter in sequence.
          </p>
        </div>
      </div>

      <!-- Progress -->
      <div class="py-6 flex gap-8 border-b border-gray-100 dark:border-gray-800">
        <div class="shrink-0 w-7 pt-0.5">
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" class="text-gray-400 dark:text-gray-500">
            <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/>
          </svg>
        </div>
        <div class="flex-1">
          <h2 class="text-base font-semibold text-gray-900 dark:text-white mb-2">Tracking your progress</h2>
          <p class="text-sm text-gray-500 dark:text-gray-400 leading-relaxed">
            At the bottom of every topic you can mark it as <strong class="text-gray-700 dark:text-gray-300 font-medium">Complete</strong> once you've understood it, or flag it as <strong class="text-gray-700 dark:text-gray-300 font-medium">Unclear</strong> if you want to revisit it later. Your progress dashboard — the person icon in the top-right — shows a full breakdown of your completion across every chapter and module.
          </p>
        </div>
      </div>

      <!-- Roles -->
      <div class="py-6 flex gap-8">
        <div class="shrink-0 w-7 pt-0.5">
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" class="text-gray-400 dark:text-gray-500">
            <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>
          </svg>
        </div>
        <div class="flex-1">
          <h2 class="text-base font-semibold text-gray-900 dark:text-white mb-2">Role-based learning paths</h2>
          <p class="text-sm text-gray-500 dark:text-gray-400 leading-relaxed">
            Not sure where to start? Choose a role from the learning paths on the home page to get a curated sequence of chapters built around your responsibilities — from awareness through to optimisation. Each role course is structured in five phases, and your progress is tracked separately for each.
          </p>
        </div>
      </div>

    </div>

    <!-- Footer -->
    <div class="shrink-0 border-t border-gray-100 dark:border-gray-800 px-10 py-5 flex items-center justify-end">
      <button
        id="intro-get-started"
        class="inline-flex items-center gap-2 text-sm font-medium px-5 py-2 rounded-lg bg-gray-900 dark:bg-white text-white dark:text-gray-900 hover:bg-gray-700 dark:hover:bg-gray-100 transition-colors"
      >
        Get started
        <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
          <path d="M5 12h14M12 5l7 7-7 7"/>
        </svg>
      </button>
    </div>

  </div>
</div>

<style>
  @keyframes introFadeUp {
    from { opacity: 0; transform: translateY(8px); }
    to   { opacity: 1; transform: translateY(0); }
  }
  #intro-overlay:not(.hidden) > div:last-child {
    animation: introFadeUp 0.2s ease-out;
  }
</style>

<script>
  const overlay    = document.getElementById('intro-overlay')!;
  const backdrop   = document.getElementById('intro-backdrop')!;
  const closeBtn   = document.getElementById('intro-close')!;
  const startBtn   = document.getElementById('intro-get-started')!;

  function openIntro() {
    overlay.classList.remove('hidden');
  }

  function closeIntro() {
    overlay.classList.add('hidden');
    localStorage.setItem('platform-intro-seen', 'true');
  }

  // Auto-show on first visit
  document.addEventListener('DOMContentLoaded', () => {
    if (!localStorage.getItem('platform-intro-seen')) {
      openIntro();
    }
  });

  // Close triggers
  closeBtn.addEventListener('click', closeIntro);
  startBtn.addEventListener('click', closeIntro);
  backdrop.addEventListener('click', closeIntro);
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && !overlay.classList.contains('hidden')) closeIntro();
  });

  // Expose opener for the ⓘ button in BaseLayout
  (window as any).openIntro = openIntro;
</script>
```

- [ ] **Step 2: Verify the file exists**

```bash
ls src/components/IntroOverlay.astro
```
Expected: file listed with no error.

---

### Task 2: Wire IntroOverlay into BaseLayout

**Files:**
- Modify: `src/layouts/BaseLayout.astro`

- [ ] **Step 1: Add the import at the top of the frontmatter block**

In `src/layouts/BaseLayout.astro`, the frontmatter currently reads:

```astro
---
import SiteOverlay from '../components/SiteOverlay.astro';
import UserDashboard from '../components/UserDashboard.astro';
import RoleMatrix from '../components/RoleMatrix.astro';
import Search from '../components/Search.astro';
import ThemeToggle from '../components/ThemeToggle.astro';
```

Add `IntroOverlay` as the last import in that list:

```astro
---
import SiteOverlay from '../components/SiteOverlay.astro';
import UserDashboard from '../components/UserDashboard.astro';
import RoleMatrix from '../components/RoleMatrix.astro';
import Search from '../components/Search.astro';
import ThemeToggle from '../components/ThemeToggle.astro';
import IntroOverlay from '../components/IntroOverlay.astro';
```

- [ ] **Step 2: Add the ⓘ button to the icon bar**

Find the closing `</button>` of the user-dashboard button and the closing `</div>` of the icon bar:

```astro
        <span
          id="dash-badge"
          class="hidden absolute -top-1 -right-1 min-w-[16px] h-4 bg-emerald-500 rounded-full text-[9px] text-white font-bold flex items-center justify-center px-1 leading-none pointer-events-none"
        ></span>
      </button>

    </div>
```

Replace with:

```astro
        <span
          id="dash-badge"
          class="hidden absolute -top-1 -right-1 min-w-[16px] h-4 bg-emerald-500 rounded-full text-[9px] text-white font-bold flex items-center justify-center px-1 leading-none pointer-events-none"
        ></span>
      </button>

      <!-- Intro / help -->
      <button
        onclick="window.openIntro && window.openIntro()"
        aria-label="About this app"
        title="About this app"
        class="p-2 rounded-lg text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
      >
        <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
          <circle cx="12" cy="12" r="10"/>
          <path stroke-linecap="round" stroke-linejoin="round" d="M12 16v-4M12 8h.01"/>
        </svg>
      </button>

    </div>
```

- [ ] **Step 3: Render the IntroOverlay component in the body**

Find where `<UserDashboard />` is rendered (just after the icon bar closing `</div>`):

```astro
    <UserDashboard />
    <Search />
```

Add `<IntroOverlay />` after `<UserDashboard />`:

```astro
    <UserDashboard />
    <IntroOverlay />
    <Search />
```

- [ ] **Step 4: Run the dev server and verify manually**

```bash
npm run dev
```

Open `http://localhost:4321` in a **private/incognito** window (no existing localStorage).

Check:
1. Overlay auto-appears on load.
2. Close via ✕ button → overlay hides, `platform-intro-seen` set in DevTools > Application > localStorage.
3. Reload → overlay does NOT re-appear.
4. Click the ⓘ button (rightmost in top-right bar) → overlay opens again.
5. Close via backdrop click → hides.
6. Close via Escape key → hides.
7. Close via "Get started" button → hides.
8. Toggle dark mode → all text and borders render correctly.
9. Clear `platform-intro-seen` from localStorage → reload → overlay auto-appears again.

- [ ] **Step 5: Run the build**

```bash
npm run build
```

Expected: build completes with no errors.
