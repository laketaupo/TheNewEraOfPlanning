# Home Screen Centered Cards Layout Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Restructure `src/pages/index.astro` so the title/subtitle sit near the top of the viewport and the two nav cards are always vertically and horizontally centered in the viewport, with stacked layout on mobile.

**Architecture:** Mobile-first Tailwind responsive classes switch the outer container from `flex flex-col` (mobile normal flow) to `block` (desktop) at the `md` breakpoint. On desktop, title and cards divs are both absolutely positioned within the `relative min-h-screen` outer container — title anchored `top-12`, cards centered via `inset-0 flex items-center justify-center`. On mobile, both divs remain in normal flow, stacking vertically.

**Tech Stack:** Astro 4, Tailwind CSS 3. No JavaScript changes.

## Global Constraints

- Never hardcode `/` as a root-relative URL prefix — always use `import.meta.env.BASE_URL`
- Tailwind color classes must appear as complete strings — no string interpolation
- Dark mode variants must be preserved on every element that already has them
- Run `npm run build` (not just `npm run dev`) as the final verification step — it also runs Pagefind indexing

---

### Task 1: Rewrite `src/pages/index.astro` with responsive centered layout

**Files:**
- Modify: `src/pages/index.astro`

**Interfaces:**
- Consumes: nothing (self-contained page)
- Produces: updated page at `/` with new layout

- [ ] **Step 1: Replace the full HTML content of `src/pages/index.astro`**

Replace everything between (and including) `<BaseLayout title="The New Era of Planning">` and the closing `</BaseLayout>` tag — plus the entire `<style>` block — with the content below. The frontmatter (`---` block at the top) is unchanged.

The key structural changes vs. the original:
- Logo div (`Planning Hub` dot + text) is deleted
- Outer container: was a nested 5-row CSS grid; now `relative min-h-screen flex flex-col items-center px-6 pt-12 pb-12` on mobile, switching to `md:block md:p-0` on desktop
- Title div: `relative z-10` in normal flow on mobile; `md:absolute md:top-12 md:inset-x-0` on desktop
- Cards wrapper: `relative z-10 mt-10 w-full max-w-md` in normal flow on mobile; `md:absolute md:inset-0 md:flex md:items-center md:justify-center md:mt-0 md:max-w-none` on desktop
- Inner card grid: `flex flex-col gap-6 w-full` (stacked) on mobile; `md:grid md:grid-cols-2 md:max-w-3xl` on desktop

```astro
---
import BaseLayout from '../layouts/BaseLayout.astro';
---
<BaseLayout title="The New Era of Planning">
  <div class="relative min-h-screen flex flex-col items-center px-6 pt-12 pb-12 md:block md:p-0">

    <!-- Grid background -->
    <div class="absolute inset-0 bg-[linear-gradient(to_right,#e5e7eb_1px,transparent_1px),linear-gradient(to_bottom,#e5e7eb_1px,transparent_1px)] dark:bg-[linear-gradient(to_right,#444444_1px,transparent_1px),linear-gradient(to_bottom,#444444_1px,transparent_1px)] bg-[size:64px_64px] opacity-60 dark:opacity-40 pointer-events-none"></div>
    <!-- Radial glow -->
    <div class="absolute inset-0 bg-home-radial pointer-events-none"></div>

    <!-- Title: normal flow on mobile, absolute top-center on desktop -->
    <div class="relative z-10 w-full text-center md:absolute md:top-12 md:inset-x-0 md:px-8">
      <h1 class="text-5xl sm:text-6xl font-bold tracking-tight leading-tight text-gray-900 dark:text-white mb-4">
        The New Era of <span style="color:#635CFA">Planning</span>
      </h1>
      <p class="text-gray-500 dark:text-neutral-400 text-lg leading-relaxed max-w-lg mx-auto">
        A structured learning platform covering the people, processes, data, and technology behind modern supply chain planning.
      </p>
    </div>

    <!-- Cards: stacked below title on mobile, absolute centered on desktop -->
    <div class="relative z-10 mt-10 w-full max-w-md md:absolute md:inset-0 md:flex md:items-center md:justify-center md:mt-0 md:max-w-none md:px-8">
      <div class="flex flex-col gap-6 w-full md:grid md:grid-cols-2 md:max-w-3xl">

        <a href={`${import.meta.env.BASE_URL}themes`} class="lcard">
          <div class="lcard-header">
            <h3 class="lcard-title">Learn by pillar</h3>
            <div class="lcard-icon">🏛️</div>
          </div>
          <p class="lcard-desc">Explore content across four pillars — People, Process, Data and Technology — each broken into modules and topics.</p>
          <span class="lcard-link">Browse by pillar →</span>
        </a>

        <a href={`${import.meta.env.BASE_URL}roles`} class="lcard">
          <div class="lcard-header">
            <h3 class="lcard-title">Learn by role</h3>
            <div class="lcard-icon">👤</div>
          </div>
          <p class="lcard-desc">Choose your role and follow a guided path through five phases — from awareness to hands-on execution.</p>
          <span class="lcard-link">Browse by role →</span>
        </a>

      </div>
    </div>

  </div>
</BaseLayout>

<style>
  .bg-home-radial {
    background: radial-gradient(ellipse 80% 50% at 50% -20%, rgba(59,130,246,0.08), transparent);
  }
  :global(.dark) .bg-home-radial {
    background: radial-gradient(ellipse 80% 50% at 50% -20%, rgba(59,130,246,0.15), transparent);
  }

  .lcard {
    background: #eff6ff;
    border: 1.5px solid #bfdbfe;
    border-top: 4px solid #93c5fd;
    border-radius: 20px;
    padding: 2.75rem;
    text-decoration: none;
    color: inherit;
    display: flex;
    flex-direction: column;
    gap: 1.1rem;
    transition: transform 0.2s, box-shadow 0.25s, border-color 0.2s;
  }
  .lcard:hover {
    transform: translateY(-4px);
    box-shadow: 0 6px 24px rgba(59,130,246,0.12);
  }

  :global(.dark) .lcard {
    background: #2c2c2c;
    border-color: rgba(59,130,246,0.18);
    border-top-color: rgba(147,197,253,0.5);
  }
  :global(.dark) .lcard:hover {
    background: #363636;
    box-shadow: 0 6px 28px rgba(59,130,246,0.12);
  }

  .lcard-header {
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    gap: 1rem;
  }
  .lcard-icon {
    width: 60px; height: 60px;
    border-radius: 14px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 1.75rem;
    flex-shrink: 0;
    background: #dbeafe;
  }
  :global(.dark) .lcard-icon { background: rgba(59,130,246,0.12); }

  .lcard-title {
    font-size: 1.25rem;
    font-weight: 700;
    color: #111827;
    letter-spacing: -0.02em;
  }
  :global(.dark) .lcard-title { color: #f3f4f6; }

  .lcard-desc {
    font-size: 0.93rem;
    color: #6b7280;
    line-height: 1.7;
  }
  :global(.dark) .lcard-desc { color: rgba(243,244,246,0.45); }

  .lcard-link {
    display: inline-flex;
    align-items: center;
    font-size: 0.85rem;
    font-weight: 600;
    margin-top: auto;
    color: #1d4ed8;
  }
  :global(.dark) .lcard-link { color: #93c5fd; }
</style>
```

- [ ] **Step 2: Run the build to verify no Astro errors**

```bash
npm run build
```

Expected: build completes with no errors. The Pagefind postbuild step will also run — ignore any "indexed N pages" output, that's normal.

If the build fails with a Tailwind purge warning (classes not found), check that all class names appear as complete strings — no template literals constructing class names.

- [ ] **Step 3: Spot-check the layout in the browser**

```bash
npm run preview
```

Open `http://localhost:4321/TheNewEraOfPlanning/` and verify:

| Check | Expected |
|---|---|
| Desktop (≥ 768px wide) | Title near top-center; cards centered vertically and horizontally in viewport |
| Resize to tall viewport (e.g. 1080px height) | Cards stay at screen midpoint, title stays near top |
| Resize to short viewport (e.g. 500px height) | Cards stay at midpoint; title and cards may be close but should not fully overlap |
| Narrow (< 768px wide) | Title at top, cards stacked vertically below with gap |
| Dark mode (toggle with site's dark toggle) | Card backgrounds, text, borders all correct |
| Click "Browse by pillar" | Navigates to `/TheNewEraOfPlanning/themes` |
| Click "Browse by role" | Navigates to `/TheNewEraOfPlanning/roles` |

- [ ] **Step 4: Commit**

```bash
git add src/pages/index.astro
git commit -m "feat: center cards in viewport, move title to top on home screen"
```
