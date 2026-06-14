# Findability: Search + Glossary — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add full-text site search (Pagefind, Cmd+K modal) and a glossary page with inline tooltips on planning terms across all topic layouts.

**Architecture:** Pagefind runs as a post-build CLI step, indexing the built HTML into a static `pagefind/` directory served at `/pagefind/`. The glossary is a single `glossary.json` file loaded at build time; the glossary page renders it statically, and a client-side TreeWalker script injected in `BaseLayout` wraps first-occurrences of glossary terms in topic prose with tooltip spans.

**Tech Stack:** Astro 4, Tailwind CSS 3, Pagefind CLI (`pagefind` npm package), no new runtime dependencies.

---

## File Map

**Create:**
- `src/content/glossary.json` — glossary term data (slug, term, definition, related, seeAlso)
- `src/lib/glossary.ts` — load and validate glossary; export typed helpers
- `src/pages/glossary.astro` — `/glossary` page, A-Z sorted, anchor-linked terms
- `src/components/Search.astro` — search button + modal (loads Pagefind UI)

**Modify:**
- `package.json` — add `pagefind` devDep, add `postbuild` script
- `src/layouts/BaseLayout.astro` — add `<Search />`, add glossary tooltip script
- `src/layouts/TopicLayout.astro` — add `data-pagefind-body` + meta to `<main>`
- `src/layouts/NodeTopicLayout.astro` — add `data-pagefind-body` + meta to `<main>`
- `src/layouts/CardGridLayout.astro` — add `data-pagefind-body` + meta to `<main>`
- `src/layouts/ComparisonLayout.astro` — add `data-pagefind-body` + meta to `<main>`
- `src/layouts/DataTableLayout.astro` — add `data-pagefind-body` + meta to `<main>`
- `src/layouts/FullWidthWidgetLayout.astro` — add `data-pagefind-body` + meta to `<main>`
- `src/layouts/RasciTableLayout.astro` — add `data-pagefind-body` + meta to `<main>`
- `src/layouts/ProcessStepDetailLayout.astro` — add `data-pagefind-body` + meta to `<main>`
- `src/layouts/UiTrainingLayout.astro` — add `data-pagefind-body` + meta to outer `<div>`
- `src/components/SiteOverlay.astro` — add Glossary link in footer area

---

## Task 1: Install Pagefind and wire the build

**Files:**
- Modify: `package.json`

- [ ] **Step 1: Install pagefind as a dev dependency**

```bash
npm install --save-dev pagefind
```

Expected output: pagefind added to `devDependencies` in `package.json`.

- [ ] **Step 2: Add postbuild script to package.json**

Open `package.json`. Replace the `scripts` block with:

```json
"scripts": {
  "dev": "astro dev",
  "build": "astro build",
  "postbuild": "pagefind --site .vercel/output/static",
  "preview": "astro preview"
},
```

- [ ] **Step 3: Run the build and verify pagefind index is created**

```bash
npm run build
```

Expected: build succeeds, and the directory `.vercel/output/static/pagefind/` exists and contains `pagefind-ui.js`, `pagefind-ui.css`, and `pagefind.js`.

```bash
ls .vercel/output/static/pagefind/
```

Expected output includes: `pagefind-ui.js`, `pagefind-ui.css`, `pagefind.js`, `pagefind.en_us.pdb`.

- [ ] **Step 4: Commit**

```bash
git add package.json package-lock.json
git commit -m "feat: install pagefind and wire postbuild index"
```

---

## Task 2: Add Pagefind scope attributes to all topic layouts

**Files:**
- Modify: `src/layouts/TopicLayout.astro:161`
- Modify: `src/layouts/NodeTopicLayout.astro:149`
- Modify: `src/layouts/CardGridLayout.astro:186`
- Modify: `src/layouts/ComparisonLayout.astro:166`
- Modify: `src/layouts/DataTableLayout.astro:161`
- Modify: `src/layouts/FullWidthWidgetLayout.astro:159`
- Modify: `src/layouts/RasciTableLayout.astro:177`
- Modify: `src/layouts/ProcessStepDetailLayout.astro:168`
- Modify: `src/layouts/UiTrainingLayout.astro` (outer div wrapper)

Pagefind only indexes content inside `data-pagefind-body`. Hidden `span` elements with `data-pagefind-meta` inject structured metadata into search results without displaying anything. `data-pagefind-filter` enables pillar filtering in the Pagefind UI.

- [ ] **Step 1: Add attributes to TopicLayout.astro**

Find the `<main>` opening tag (line ~161):
```astro
<main class="min-h-screen pt-16 pb-32" style={`--accent: ${accentColor}; --accent-subtle: ${accentSubtle};`}>
```

Replace with:
```astro
<main
  class="min-h-screen pt-16 pb-32"
  style={`--accent: ${accentColor}; --accent-subtle: ${accentSubtle};`}
  data-pagefind-body
  data-pagefind-filter={`pillar:${pillar ?? 'technology'}`}
>
  <span class="sr-only" data-pagefind-meta="chapter">{chapterTitle}</span>
```

- [ ] **Step 2: Add attributes to NodeTopicLayout.astro**

Find the `<main>` opening tag (line ~149):
```astro
<main class="min-h-screen pt-16 pb-32 flex flex-col items-center">
```

Replace with:
```astro
<main
  class="min-h-screen pt-16 pb-32 flex flex-col items-center"
  data-pagefind-body
  data-pagefind-filter={`pillar:${pillar ?? 'technology'}`}
>
  <span class="sr-only" data-pagefind-meta="chapter">{chapterTitle}</span>
```

- [ ] **Step 3: Add attributes to CardGridLayout.astro**

Find the `<main>` opening tag (line ~186):
```astro
<main class="min-h-screen pt-16 pb-32" style={`--accent: ${accentColor}; --accent-subtle: ${accentSubtle};`}>
```

Replace with:
```astro
<main
  class="min-h-screen pt-16 pb-32"
  style={`--accent: ${accentColor}; --accent-subtle: ${accentSubtle};`}
  data-pagefind-body
  data-pagefind-filter={`pillar:${pillar ?? 'technology'}`}
>
  <span class="sr-only" data-pagefind-meta="chapter">{chapterTitle}</span>
```

- [ ] **Step 4: Add attributes to ComparisonLayout.astro**

Find the `<main>` opening tag (line ~166):
```astro
<main class="min-h-screen pt-16 pb-32" style={`--accent: ${accentColor}; --accent-subtle: ${accentSubtle};`}>
```

Replace with:
```astro
<main
  class="min-h-screen pt-16 pb-32"
  style={`--accent: ${accentColor}; --accent-subtle: ${accentSubtle};`}
  data-pagefind-body
  data-pagefind-filter={`pillar:${pillar ?? 'technology'}`}
>
  <span class="sr-only" data-pagefind-meta="chapter">{chapterTitle}</span>
```

- [ ] **Step 5: Add attributes to DataTableLayout.astro**

Find the `<main>` opening tag (line ~161):
```astro
<main class="min-h-screen pt-16 pb-32" style={`--accent: ${accentColor}; --accent-subtle: ${accentSubtle};`}>
```

Replace with:
```astro
<main
  class="min-h-screen pt-16 pb-32"
  style={`--accent: ${accentColor}; --accent-subtle: ${accentSubtle};`}
  data-pagefind-body
  data-pagefind-filter={`pillar:${pillar ?? 'technology'}`}
>
  <span class="sr-only" data-pagefind-meta="chapter">{chapterTitle}</span>
```

- [ ] **Step 6: Add attributes to FullWidthWidgetLayout.astro**

Find the `<main>` opening tag (line ~159):
```astro
<main class="min-h-screen pt-16 pb-32" style={`--accent: ${accentColor}; --accent-subtle: ${accentSubtle};`}>
```

Replace with:
```astro
<main
  class="min-h-screen pt-16 pb-32"
  style={`--accent: ${accentColor}; --accent-subtle: ${accentSubtle};`}
  data-pagefind-body
  data-pagefind-filter={`pillar:${pillar ?? 'technology'}`}
>
  <span class="sr-only" data-pagefind-meta="chapter">{chapterTitle}</span>
```

- [ ] **Step 7: Add attributes to RasciTableLayout.astro**

Find the `<main>` opening tag (line ~177):
```astro
<main class="min-h-screen pt-16 pb-32" style={`--accent: ${accentColor}; --accent-subtle: ${accentSubtle};`}>
```

Replace with:
```astro
<main
  class="min-h-screen pt-16 pb-32"
  style={`--accent: ${accentColor}; --accent-subtle: ${accentSubtle};`}
  data-pagefind-body
  data-pagefind-filter={`pillar:${pillar ?? 'technology'}`}
>
  <span class="sr-only" data-pagefind-meta="chapter">{chapterTitle}</span>
```

- [ ] **Step 8: Add attributes to ProcessStepDetailLayout.astro**

Find the `<main>` opening tag (line ~168):
```astro
<main class="min-h-screen pt-16 pb-32" style={`--accent: ${accentColor}; --accent-subtle: ${accentSubtle};`}>
```

Replace with:
```astro
<main
  class="min-h-screen pt-16 pb-32"
  style={`--accent: ${accentColor}; --accent-subtle: ${accentSubtle};`}
  data-pagefind-body
  data-pagefind-filter={`pillar:${pillar ?? 'technology'}`}
>
  <span class="sr-only" data-pagefind-meta="chapter">{chapterTitle}</span>
```

- [ ] **Step 9: Add attributes to UiTrainingLayout.astro**

UiTrainingLayout uses a `<div>` wrapper instead of `<main>`. Find the outer viewport div (around line ~142):
```astro
<div
  class="flex flex-col overflow-hidden"
  style={`height: 100dvh; padding-top: 44px; padding-bottom: 48px; --accent: ${accentColor}; --accent-subtle: ${accentSubtle};`}
>
```

Replace with:
```astro
<div
  class="flex flex-col overflow-hidden"
  style={`height: 100dvh; padding-top: 44px; padding-bottom: 48px; --accent: ${accentColor}; --accent-subtle: ${accentSubtle};`}
  data-pagefind-body
  data-pagefind-filter={`pillar:${pillar ?? 'technology'}`}
>
  <span class="sr-only" data-pagefind-meta="chapter">{chapterTitle}</span>
```

- [ ] **Step 10: Build and verify indexing**

```bash
npm run build && ls .vercel/output/static/pagefind/
```

Expected: build succeeds with no errors. Pagefind directory exists. Check that pagefind indexed pages by looking at the build output — it should report something like "Indexed N pages".

- [ ] **Step 11: Commit**

```bash
git add src/layouts/
git commit -m "feat: add pagefind scope attributes to all topic layouts"
```

---

## Task 3: Build the Search modal component

**Files:**
- Create: `src/components/Search.astro`

The component renders a search icon button and a `<dialog>` modal. It dynamically loads the Pagefind UI from the generated `/pagefind/pagefind-ui.js` and `/pagefind/pagefind-ui.css` files (only available after `npm run build`, not in `npm run dev`).

- [ ] **Step 1: Create src/components/Search.astro**

```astro
---
// No props — fully self-contained
---

<!-- Search trigger button -->
<button
  id="search-trigger"
  aria-label="Search"
  title="Search (⌘K)"
  class="flex items-center justify-center w-8 h-8 rounded-md text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
>
  <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
    <path stroke-linecap="round" stroke-linejoin="round" d="M21 21l-4.35-4.35M17 11A6 6 0 1 1 5 11a6 6 0 0 1 12 0z"/>
  </svg>
</button>

<!-- Search modal -->
<dialog
  id="search-modal"
  class="fixed inset-0 z-[200] w-full h-full m-0 max-w-none max-h-none bg-black/60 backdrop-blur-sm p-4 flex items-start justify-center pt-[15vh]"
>
  <div class="w-full max-w-2xl bg-white dark:bg-gray-900 rounded-xl shadow-2xl border border-gray-200 dark:border-gray-700 overflow-hidden">
    <div id="search-container" class="p-2"></div>
    <p id="search-dev-notice" class="hidden text-sm text-gray-500 dark:text-gray-400 px-4 py-3">
      Search is only available after running <code class="font-mono bg-gray-100 dark:bg-gray-800 px-1 rounded">npm run build</code>.
    </p>
  </div>
</dialog>

<script is:inline>
(function () {
  const trigger = document.getElementById('search-trigger');
  const modal = document.getElementById('search-modal');
  const container = document.getElementById('search-container');
  const devNotice = document.getElementById('search-dev-notice');

  let initialized = false;

  function openModal() {
    modal.showModal();
    if (!initialized) {
      initialized = true;
      initPagefind();
    } else {
      // Re-focus the input if already initialized
      const input = container.querySelector('input');
      if (input) input.focus();
    }
  }

  function closeModal() {
    modal.close();
  }

  function initPagefind() {
    // Load Pagefind CSS
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = '/pagefind/pagefind-ui.css';
    document.head.appendChild(link);

    // Load Pagefind UI script
    const script = document.createElement('script');
    script.src = '/pagefind/pagefind-ui.js';
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
      // Focus the input after init
      setTimeout(() => {
        const input = container.querySelector('input');
        if (input) input.focus();
      }, 50);
    };
    script.onerror = function () {
      container.classList.add('hidden');
      devNotice.classList.remove('hidden');
    };
    document.head.appendChild(script);
  }

  // Trigger button
  trigger.addEventListener('click', openModal);

  // Cmd+K or /
  document.addEventListener('keydown', function (e) {
    const tag = document.activeElement && document.activeElement.tagName;
    if ((e.key === 'k' && (e.metaKey || e.ctrlKey)) || (e.key === '/' && tag !== 'INPUT' && tag !== 'TEXTAREA')) {
      e.preventDefault();
      openModal();
    }
    if (e.key === 'Escape') closeModal();
  });

  // Click backdrop to close
  modal.addEventListener('click', function (e) {
    if (e.target === modal) closeModal();
  });
})();
</script>

<style is:global>
  /* Pagefind UI theming */
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
  .dark #search-container {
    --pagefind-ui-text: rgb(243 244 246);
    --pagefind-ui-border: rgb(55 65 81);
    --pagefind-ui-tag: rgb(31 41 55);
  }
  /* Reset dialog built-in styles */
  #search-modal {
    background: transparent;
    border: none;
    padding: 1rem;
    display: none;
  }
  #search-modal[open] {
    display: flex;
    align-items: flex-start;
    justify-content: center;
    padding-top: 15vh;
  }
</style>
```

- [ ] **Step 2: Commit**

```bash
git add src/components/Search.astro
git commit -m "feat: add Search modal component with Pagefind UI"
```

---

## Task 4: Wire Search into BaseLayout

**Files:**
- Modify: `src/layouts/BaseLayout.astro`

`BaseLayout` renders the `<html>`, `<head>`, and `<body>`. The Search component needs to be imported and rendered in the body. Because the search button is rendered directly inside each layout's own `<header>` (not in BaseLayout), the modal `<dialog>` itself lives in BaseLayout so it's always in the DOM.

> **Note:** The `<Search />` component renders both the button AND the modal. The button placement in the top bar is handled per-layout in Task 5. In this task, we only add the modal to BaseLayout's body so the dialog element is always available.

Actually — simpler approach: add the full `<Search />` component (button + modal) to BaseLayout's body. Each topic layout's header *also* has a search button that triggers the same `search-modal` dialog by ID. This avoids duplicating the dialog across 8 layouts.

- [ ] **Step 1: Import Search into BaseLayout and add to body**

Open `src/layouts/BaseLayout.astro`. Replace the entire file with:

```astro
---
import SiteOverlay from '../components/SiteOverlay.astro';
import UserDashboard from '../components/UserDashboard.astro';
import Search from '../components/Search.astro';

export interface Props {
  title?: string;
  description?: string;
}

const { title = 'How Planning Software Works', description = 'An interactive guide to the Planning software.' } = Astro.props;
---
<!doctype html>
<html lang="en" class="scroll-smooth">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <meta name="description" content={description} />
    <title>{title}</title>

    <!-- Apply saved theme before render to avoid flash -->
    <script is:inline>
      if (localStorage.getItem('platform-theme') === 'dark') {
        document.documentElement.classList.add('dark');
      }
    </script>

    <!-- Inter font -->
    <link rel="preconnect" href="https://fonts.googleapis.com" />
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet" />
  </head>
  <body class="bg-gray-50 text-gray-900 dark:bg-gray-950 dark:text-gray-100 font-sans antialiased min-h-screen transition-colors duration-200">
    <slot />
    <SiteOverlay />
    <UserDashboard />
    <Search />
  </body>
</html>
```

- [ ] **Step 2: Add a search trigger button to each topic layout's header**

Each topic layout has its own `<header>` with a `<div class="flex items-center gap-3">` containing `<ThemeToggle />`. Add a search trigger button before `<ThemeToggle />` in each layout.

The button doesn't need the modal (that lives in BaseLayout) — it just triggers the `search-modal` dialog by ID. In `TopicLayout.astro`, find:

```astro
    <div class="flex items-center gap-3">
      <ThemeToggle />
    </div>
  </header>
```

Replace with:
```astro
    <div class="flex items-center gap-3">
      <button
        onclick="document.getElementById('search-modal').showModal()"
        aria-label="Search"
        title="Search (⌘K)"
        class="flex items-center justify-center w-8 h-8 rounded-md text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
      >
        <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
          <path stroke-linecap="round" stroke-linejoin="round" d="M21 21l-4.35-4.35M17 11A6 6 0 1 1 5 11a6 6 0 0 1 12 0z"/>
        </svg>
      </button>
      <ThemeToggle />
    </div>
  </header>
```

Repeat this exact replacement in all 8 topic layout files:
- `NodeTopicLayout.astro`
- `CardGridLayout.astro`
- `ComparisonLayout.astro`
- `DataTableLayout.astro`
- `FullWidthWidgetLayout.astro`
- `RasciTableLayout.astro`
- `ProcessStepDetailLayout.astro`
- `UiTrainingLayout.astro`

Each file has the same `<div class="flex items-center gap-3"><ThemeToggle /></div>` pattern in its header.

- [ ] **Step 3: Verify dev build renders the button**

```bash
npm run dev
```

Open `http://localhost:4321`. Navigate to any topic page. Verify the magnifying glass icon appears in the top bar next to the theme toggle. Click it — the modal should open but show the dev notice ("Search is only available after running npm run build").

Press `Esc` to close. Press `Cmd+K` to open. Both should work.

- [ ] **Step 4: Verify production build has working search**

```bash
npm run build && npm run preview
```

Open `http://localhost:4321` (preview). Navigate to any topic page. Press `Cmd+K`. Type "safety stock". Expect results showing matching topics.

- [ ] **Step 5: Commit**

```bash
git add src/layouts/ src/layouts/BaseLayout.astro
git commit -m "feat: wire search trigger into all layout headers"
```

---

## Task 5: Create glossary.json with initial terms

**Files:**
- Create: `src/content/glossary.json`

- [ ] **Step 1: Create src/content/glossary.json**

```json
[
  {
    "slug": "bill-of-materials",
    "term": "Bill of Materials",
    "aliases": ["BOM", "bills of materials"],
    "definition": "A structured list of components, subassemblies, and raw materials required to produce a finished product, including quantities and lead times. In planning software, the BOM drives how demand is exploded upstream through the supply chain.",
    "related": ["bill-of-distribution"],
    "seeAlso": ["01-understanding-basics/bom"]
  },
  {
    "slug": "bill-of-distribution",
    "term": "Bill of Distribution",
    "aliases": ["BOD", "bills of distribution"],
    "definition": "Defines the distribution network: which locations supply which other locations, in what quantities, and with what lead times. The BOD drives how supply signals cascade downstream to distribution centres and customers.",
    "related": ["bill-of-materials"],
    "seeAlso": ["01-understanding-basics/bod"]
  },
  {
    "slug": "sop",
    "term": "Sales & Operations Planning",
    "aliases": ["S&OP"],
    "definition": "A monthly cross-functional process that aligns demand, supply, inventory, and financial plans into a single agreed business plan. Typically runs over a multi-week cycle culminating in an executive review meeting.",
    "related": ["soe", "demand-review", "supply-review"],
    "seeAlso": ["sop-01-sop-fundamentals/what-is-sop"]
  },
  {
    "slug": "soe",
    "term": "Sales & Operations Execution",
    "aliases": ["S&OE"],
    "definition": "A weekly operational process that monitors execution against the agreed S&OP plan, identifies short-term deviations, and triggers corrective actions. Sits between S&OP and day-to-day execution.",
    "related": ["sop"],
    "seeAlso": ["soe-01-soe-fundamentals/what-is-soe"]
  },
  {
    "slug": "safety-stock",
    "term": "Safety Stock",
    "definition": "A buffer of inventory held above the expected demand to protect against variability in demand or supply lead times. Calculated per item-at-location and configured as a planning parameter.",
    "related": ["item-at-location"],
    "seeAlso": ["03-the-logic/safety-stock"]
  },
  {
    "slug": "item-at-location",
    "term": "Item-at-Location",
    "definition": "The combination of a product (item) and a specific supply chain node (location). Most planning parameters — safety stock, lead time, reorder policies — are set at the item-at-location level rather than globally per item.",
    "related": ["safety-stock"],
    "seeAlso": ["01-understanding-basics/item-at-location"]
  },
  {
    "slug": "demand-signal",
    "term": "Demand Signal",
    "definition": "The input that drives the planning engine: typically customer orders, forecasts, or a combination of both. The demand signal is the starting point for all downstream supply calculations.",
    "related": ["forecast", "supply-signal"],
    "seeAlso": ["03-demand-data-flow/demand-signal"]
  },
  {
    "slug": "supply-signal",
    "term": "Supply Signal",
    "definition": "The output of the planning engine that tells each node in the supply chain what to produce, purchase, or transfer. Supply signals cascade upstream through the BOM and BOD in response to the demand signal.",
    "related": ["demand-signal"],
    "seeAlso": ["04-supply-data-flow/supply-signal"]
  },
  {
    "slug": "forecast",
    "term": "Forecast",
    "definition": "A statistical or judgement-based estimate of future demand used as an input to the planning engine. Forecasts can be generated at different levels of aggregation (variety, item, location) and disaggregated for planning.",
    "related": ["demand-signal", "disaggregation"],
    "seeAlso": ["03-demand-data-flow/forecast-origin"]
  },
  {
    "slug": "disaggregation",
    "term": "Disaggregation",
    "definition": "The process of splitting a high-level plan (e.g. an annual variety forecast) into lower-level detail (e.g. monthly item-at-location quantities). Planning software handles disaggregation automatically using configured ratios.",
    "related": ["forecast"],
    "seeAlso": ["03-the-logic/disaggregation-variety-to-item"]
  },
  {
    "slug": "demand-slicing",
    "term": "Demand Slicing",
    "definition": "Splitting a single demand quantity across multiple time buckets or sources based on configured rules. Used to spread a lump-sum order or forecast across the planning horizon.",
    "related": ["disaggregation"],
    "seeAlso": ["03-the-logic/demand-slicing"]
  },
  {
    "slug": "backward-consumption",
    "term": "Backward Consumption",
    "definition": "A netting logic where actual sales consume forecast in prior periods before consuming future forecast. Prevents double-counting of demand when orders arrive earlier than the forecast period.",
    "related": ["demand-signal"],
    "seeAlso": ["03-the-logic/backward-consumption"]
  },
  {
    "slug": "scheduled-receipt",
    "term": "Scheduled Receipt",
    "definition": "An expected incoming supply — a purchase order, production order, or transfer order — that is already confirmed and dated. The planning engine nets scheduled receipts against demand before generating new supply proposals.",
    "related": ["supply-signal"],
    "seeAlso": ["03-the-logic/scheduled-receipt"]
  },
  {
    "slug": "push-planning",
    "term": "Push Planning",
    "definition": "A supply strategy where production or procurement is triggered by a forecast, pushing supply down the chain before demand materialises. Suitable for long-lead-time items where waiting for actual orders is too late.",
    "related": ["pull-planning"],
    "seeAlso": ["03-the-logic/push"]
  },
  {
    "slug": "pull-planning",
    "term": "Pull Planning",
    "definition": "A supply strategy where production or procurement is triggered only by actual demand signals (orders). Reduces inventory risk but requires short enough lead times to respond in time.",
    "related": ["push-planning"],
    "seeAlso": ["03-the-logic/pull"]
  },
  {
    "slug": "simulation",
    "term": "Simulation (Workflow Simulation)",
    "definition": "A what-if version of the plan created by copying the current plan and applying changes. Simulations allow planners to explore scenarios without affecting the live plan, then promote the best outcome.",
    "related": [],
    "seeAlso": ["04-the-simulation/what-is-a-workflow-simulation"]
  },
  {
    "slug": "erp",
    "term": "Enterprise Resource Planning",
    "aliases": ["ERP"],
    "definition": "The system of record for transactional business data: purchase orders, production orders, inventory movements, and financials. The planning tool reads master data and actuals from the ERP and writes supply proposals back to it.",
    "related": ["mdm"],
    "seeAlso": ["erp-01-erp-basics/what-is-erp"]
  },
  {
    "slug": "mdm",
    "term": "Master Data Management",
    "aliases": ["MDM"],
    "definition": "The process and tooling for creating, maintaining, and governing the core reference data used across systems — items, locations, BOMs, BODs, and resources. Clean master data is a prerequisite for accurate planning.",
    "related": ["erp"],
    "seeAlso": ["mdm-01-understanding-basics/what-is-mdm"]
  },
  {
    "slug": "rasci",
    "term": "RASCI",
    "definition": "A responsibility assignment matrix defining who is Responsible, Accountable, Supporting, Consulted, and Informed for each activity in a process. Used in S&OP and S&OE to clarify cross-functional ownership.",
    "related": ["sop"],
    "seeAlso": ["people-02-accountability/what-is-rasci"]
  },
  {
    "slug": "demand-review",
    "term": "Demand Review",
    "definition": "The S&OP meeting (or pre-meeting) where commercial teams align on the consensus demand forecast. Output is a single agreed demand number used as the basis for supply planning.",
    "related": ["sop", "supply-review"],
    "seeAlso": ["sop-demand-forecasting/demand-review"]
  },
  {
    "slug": "supply-review",
    "term": "Supply Review",
    "definition": "The S&OP meeting where supply teams assess capacity and inventory against the agreed demand plan, identify gaps, and propose resolution options before the executive S&OP meeting.",
    "related": ["sop", "demand-review"],
    "seeAlso": ["sop-supply-planning/supply-review"]
  },
  {
    "slug": "kpi",
    "term": "Key Performance Indicator",
    "aliases": ["KPI", "KPIs"],
    "definition": "A quantitative measure used to evaluate planning performance. Common planning KPIs include forecast accuracy, inventory days-of-supply, service level (fill rate), and planning cycle adherence.",
    "related": [],
    "seeAlso": ["process-06-kpis/planning-kpis"]
  },
  {
    "slug": "resource",
    "term": "Resource",
    "definition": "A constrained capacity entity — typically a machine, line, or team — that the planning engine must schedule against. Resources have available capacity per time bucket and are consumed by production BOMs.",
    "related": ["bill-of-materials"],
    "seeAlso": ["01-understanding-basics/resource"]
  }
]
```

- [ ] **Step 2: Commit**

```bash
git add src/content/glossary.json
git commit -m "feat: add initial glossary.json with 23 planning terms"
```

---

## Task 6: Create glossary.ts lib

**Files:**
- Create: `src/lib/glossary.ts`

- [ ] **Step 1: Create src/lib/glossary.ts**

```typescript
import glossaryRaw from '../content/glossary.json';
import { getTopics } from './chapters';

export interface GlossaryTerm {
  slug: string;
  term: string;
  definition: string;
  aliases: string[];
  related: string[];
  seeAlso: string[];
}

export function getGlossaryTerms(): GlossaryTerm[] {
  return (glossaryRaw as GlossaryTerm[]).map(t => ({
    ...t,
    aliases: t.aliases ?? [],
    related: t.related ?? [],
    seeAlso: t.seeAlso ?? [],
  }));
}

export function validateGlossary(): void {
  const terms = getGlossaryTerms();
  const topics = getTopics();
  const topicIds = new Set(topics.map(t => `${t.chapterSlug}/${t.slug}`));
  const termSlugs = new Set(terms.map(t => t.slug));

  for (const term of terms) {
    for (const ref of term.seeAlso) {
      if (!topicIds.has(ref)) {
        throw new Error(
          `Glossary "${term.slug}": invalid seeAlso reference "${ref}". ` +
          `Check that the chapter-slug/topic-slug exists in src/content/chapters/.`
        );
      }
    }
    for (const ref of term.related) {
      if (!termSlugs.has(ref)) {
        throw new Error(
          `Glossary "${term.slug}": invalid related reference "${ref}". ` +
          `No glossary term with that slug exists.`
        );
      }
    }
  }
}

export function getGlossaryMap(): Record<string, GlossaryTerm> {
  return Object.fromEntries(getGlossaryTerms().map(t => [t.slug, t]));
}
```

- [ ] **Step 2: Verify the lib builds without errors**

```bash
npm run build
```

Expected: build succeeds. Any bad `seeAlso` or `related` references in `glossary.json` will throw with a descriptive error. If you see a throw, fix the reference in `glossary.json` and re-run.

- [ ] **Step 3: Commit**

```bash
git add src/lib/glossary.ts
git commit -m "feat: add glossary lib with typed terms and build-time validation"
```

---

## Task 7: Create the /glossary page

**Files:**
- Create: `src/pages/glossary.astro`

- [ ] **Step 1: Create src/pages/glossary.astro**

```astro
---
import BaseLayout from '../layouts/BaseLayout.astro';
import { getGlossaryTerms, validateGlossary } from '../lib/glossary';
import { getTopics } from '../lib/chapters';

validateGlossary();

const terms = getGlossaryTerms().sort((a, b) => a.term.localeCompare(b.term));
const topics = getTopics();
const topicMap = Object.fromEntries(topics.map(t => [`${t.chapterSlug}/${t.slug}`, t]));

const letters = [...new Set(terms.map(t => t.term[0].toUpperCase()))].sort();
---

<BaseLayout title="Glossary — How Planning Software Works" description="Definitions of key planning terms used throughout this learning platform.">
  <header class="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 py-3 bg-white/90 dark:bg-gray-950/90 backdrop-blur border-b border-gray-200 dark:border-gray-800">
    <div class="flex items-center gap-3">
      <a href={import.meta.env.BASE_URL} title="Home" class="flex h-5 items-center text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors">
        <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"/>
        </svg>
      </a>
    </div>
    <span class="text-sm font-semibold text-gray-700 dark:text-gray-200">Glossary</span>
    <div class="w-8"></div>
  </header>

  <main class="max-w-3xl mx-auto px-6 pt-24 pb-32">
    <h1 class="text-3xl font-bold text-gray-900 dark:text-white mb-2">Glossary</h1>
    <p class="text-gray-500 dark:text-gray-400 mb-8">{terms.length} planning terms defined.</p>

    <!-- A-Z jump links -->
    <nav class="flex flex-wrap gap-1.5 mb-10" aria-label="Jump to letter">
      {letters.map(letter => (
        <a
          href={`#letter-${letter}`}
          class="w-7 h-7 flex items-center justify-center rounded text-xs font-semibold text-gray-500 dark:text-gray-400 hover:bg-indigo-50 dark:hover:bg-indigo-500/10 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
        >
          {letter}
        </a>
      ))}
    </nav>

    <!-- Terms grouped by first letter -->
    {letters.map(letter => {
      const group = terms.filter(t => t.term[0].toUpperCase() === letter);
      return (
        <section id={`letter-${letter}`} class="mb-10">
          <h2 class="text-xs font-bold uppercase tracking-widest text-gray-400 dark:text-gray-600 mb-4 border-b border-gray-100 dark:border-gray-800 pb-2">{letter}</h2>
          <dl class="space-y-6">
            {group.map(term => {
              const seeAlsoTopics = term.seeAlso.map(ref => topicMap[ref]).filter(Boolean);
              const relatedTerms = term.related.map(slug => terms.find(t => t.slug === slug)).filter(Boolean);
              return (
                <div id={term.slug} class="scroll-mt-20">
                  <dt class="text-base font-semibold text-gray-900 dark:text-white mb-1">{term.term}</dt>
                  <dd class="text-sm text-gray-600 dark:text-gray-400 leading-relaxed mb-2">{term.definition}</dd>
                  {seeAlsoTopics.length > 0 && (
                    <p class="text-xs text-gray-400 dark:text-gray-600">
                      See:{' '}
                      {seeAlsoTopics.map((t, i) => (
                        <>
                          <a href={t.url} class="text-indigo-600 dark:text-indigo-400 hover:underline">{t.title}</a>
                          {i < seeAlsoTopics.length - 1 ? ', ' : ''}
                        </>
                      ))}
                    </p>
                  )}
                  {relatedTerms.length > 0 && (
                    <p class="text-xs text-gray-400 dark:text-gray-600 mt-0.5">
                      Related:{' '}
                      {relatedTerms.map((t, i) => (
                        <>
                          <a href={`#${t.slug}`} class="text-indigo-600 dark:text-indigo-400 hover:underline">{t.term}</a>
                          {i < relatedTerms.length - 1 ? ', ' : ''}
                        </>
                      ))}
                    </p>
                  )}
                </div>
              );
            })}
          </dl>
        </section>
      );
    })}
  </main>
</BaseLayout>
```

- [ ] **Step 2: Verify the page builds**

```bash
npm run build
```

Expected: build succeeds. Check that `.vercel/output/static/glossary/index.html` exists.

- [ ] **Step 3: Preview the glossary page**

```bash
npm run preview
```

Open `http://localhost:4321/glossary`. Verify:
- Terms appear alphabetically
- A-Z jump links are shown
- Each term has its definition
- "See:" links navigate to topic pages
- "Related:" links scroll to sibling terms on the same page

- [ ] **Step 4: Commit**

```bash
git add src/pages/glossary.astro
git commit -m "feat: add /glossary page with A-Z sorted terms and topic links"
```

---

## Task 8: Add Glossary link to SiteOverlay

**Files:**
- Modify: `src/components/SiteOverlay.astro`

- [ ] **Step 1: Add Glossary link in the SiteOverlay footer area**

In `src/components/SiteOverlay.astro`, find the footer hint div (around line ~209):

```astro
      <!-- Footer hint -->
      <div class="px-5 py-2.5 border-t border-gray-100 dark:border-gray-800 shrink-0">
        <span class="text-xs text-gray-400 dark:text-gray-600">
          <kbd class="font-mono bg-gray-100 dark:bg-gray-800 px-1.5 py-0.5 rounded text-gray-500 dark:text-gray-400">O</kbd> openen/sluiten
          &nbsp;·&nbsp;
          <kbd class="font-mono bg-gray-100 dark:bg-gray-800 px-1.5 py-0.5 rounded text-gray-500 dark:text-gray-400">Esc</kbd> sluiten
        </span>
      </div>
```

Replace with:
```astro
      <!-- Footer hint -->
      <div class="px-5 py-2.5 border-t border-gray-100 dark:border-gray-800 shrink-0 flex items-center justify-between">
        <span class="text-xs text-gray-400 dark:text-gray-600">
          <kbd class="font-mono bg-gray-100 dark:bg-gray-800 px-1.5 py-0.5 rounded text-gray-500 dark:text-gray-400">O</kbd> openen/sluiten
          &nbsp;·&nbsp;
          <kbd class="font-mono bg-gray-100 dark:bg-gray-800 px-1.5 py-0.5 rounded text-gray-500 dark:text-gray-400">Esc</kbd> sluiten
        </span>
        <a href="/glossary" class="text-xs text-indigo-600 dark:text-indigo-400 hover:underline">Glossary</a>
      </div>
```

- [ ] **Step 2: Verify in dev**

```bash
npm run dev
```

Open the site. Press `O` to open the site overlay. Verify a "Glossary" link appears in the bottom-right of the overlay footer. Click it — it should navigate to `/glossary`.

- [ ] **Step 3: Commit**

```bash
git add src/components/SiteOverlay.astro
git commit -m "feat: add Glossary link to SiteOverlay footer"
```

---

## Task 9: Add inline glossary tooltips to topic prose

**Files:**
- Modify: `src/layouts/BaseLayout.astro`

The tooltip script is injected once in `BaseLayout`. It reads a `glossary-data` JSON blob from a `<script>` tag (written at build time), then walks the DOM of `[data-pagefind-body]` content areas to find and wrap first-occurrences of glossary terms.

- [ ] **Step 1: Update BaseLayout.astro to inject glossary data and tooltip script**

Open `src/layouts/BaseLayout.astro`. Add the glossary import to the frontmatter and add the data + script before `</body>`:

```astro
---
import SiteOverlay from '../components/SiteOverlay.astro';
import UserDashboard from '../components/UserDashboard.astro';
import Search from '../components/Search.astro';
import { getGlossaryTerms } from '../lib/glossary';

export interface Props {
  title?: string;
  description?: string;
}

const { title = 'How Planning Software Works', description = 'An interactive guide to the Planning software.' } = Astro.props;

const glossaryTerms = getGlossaryTerms().map(t => ({ term: t.term, aliases: t.aliases, slug: t.slug, definition: t.definition }));
---
<!doctype html>
<html lang="en" class="scroll-smooth">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <meta name="description" content={description} />
    <title>{title}</title>

    <!-- Apply saved theme before render to avoid flash -->
    <script is:inline>
      if (localStorage.getItem('platform-theme') === 'dark') {
        document.documentElement.classList.add('dark');
      }
    </script>

    <!-- Inter font -->
    <link rel="preconnect" href="https://fonts.googleapis.com" />
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet" />
  </head>
  <body class="bg-gray-50 text-gray-900 dark:bg-gray-950 dark:text-gray-100 font-sans antialiased min-h-screen transition-colors duration-200">
    <slot />
    <SiteOverlay />
    <UserDashboard />
    <Search />

    <!-- Glossary tooltip data (injected at build time) -->
    <script type="application/json" id="glossary-data" set:html={JSON.stringify(glossaryTerms)}></script>

    <!-- Glossary tooltip tooltip -->
    <div
      id="glossary-tooltip"
      role="tooltip"
      class="pointer-events-none fixed z-[300] hidden max-w-xs rounded-lg bg-gray-900 dark:bg-gray-800 text-white text-xs px-3 py-2 shadow-lg"
    >
      <p id="glossary-tooltip-def" class="leading-relaxed"></p>
      <a id="glossary-tooltip-link" href="/glossary" class="pointer-events-auto mt-1 block text-indigo-300 hover:text-indigo-200">→ Glossary</a>
    </div>

    <script is:inline>
    (function () {
      const dataEl = document.getElementById('glossary-data');
      if (!dataEl) return;

      let terms;
      try { terms = JSON.parse(dataEl.textContent); } catch { return; }
      if (!terms || terms.length === 0) return;

      // Build a flat list of { matchStr, slug, definition } covering term + aliases
      const matchers = [];
      for (const t of terms) {
        matchers.push({ matchStr: t.term, slug: t.slug, definition: t.definition });
        for (const alias of (t.aliases || [])) {
          matchers.push({ matchStr: alias, slug: t.slug, definition: t.definition });
        }
      }
      // Sort longest match first so multi-word strings win over abbreviations
      matchers.sort((a, b) => b.matchStr.length - a.matchStr.length);

      // Build a single regex that matches any term or alias (case-insensitive)
      const escaped = matchers.map(m => m.matchStr.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'));
      const pattern = new RegExp(`\\b(${escaped.join('|')})\\b`, 'gi');

      // Only process [data-pagefind-body] content
      const body = document.querySelector('[data-pagefind-body]');
      if (!body) return;

      // Track which terms have been wrapped (first-occurrence-per-paragraph)
      function wrapTermsInParagraph(el) {
        const seen = new Set();
        const walker = document.createTreeWalker(el, NodeFilter.SHOW_TEXT, null);
        const nodes = [];
        let node;
        while ((node = walker.nextNode())) nodes.push(node);

        for (const textNode of nodes) {
          // Skip inside existing tooltips, links, code, headings
          let parent = textNode.parentElement;
          while (parent && parent !== el) {
            const tag = parent.tagName;
            if (tag === 'A' || tag === 'CODE' || tag === 'PRE' || tag === 'H1' || tag === 'H2' || tag === 'H3' || tag === 'BUTTON' || parent.hasAttribute('data-no-gloss')) return;
            parent = parent.parentElement;
          }

          const text = textNode.textContent;
          if (!pattern.test(text)) { pattern.lastIndex = 0; continue; }
          pattern.lastIndex = 0;

          const frag = document.createDocumentFragment();
          let last = 0;
          let match;
          while ((match = pattern.exec(text)) !== null) {
            const matched = match[0];
            const matchedLower = matched.toLowerCase();
            const termDef = matchers.find(m => m.matchStr.toLowerCase() === matchedLower);
            if (!termDef || seen.has(termDef.slug)) continue;
            seen.add(termDef.slug);

            if (match.index > last) {
              frag.appendChild(document.createTextNode(text.slice(last, match.index)));
            }
            const span = document.createElement('span');
            span.className = 'glossary-term';
            span.dataset.slug = termDef.slug;
            span.dataset.def = termDef.definition;
            span.textContent = matched;
            frag.appendChild(span);
            last = match.index + matched.length;
          }
          pattern.lastIndex = 0;
          if (last === 0) continue;
          if (last < text.length) frag.appendChild(document.createTextNode(text.slice(last)));
          textNode.parentNode.replaceChild(frag, textNode);
        }
      }

      // Process each paragraph-level element separately so "first occurrence" is per-paragraph
      const paragraphs = body.querySelectorAll('p, li');
      paragraphs.forEach(wrapTermsInParagraph);

      // Tooltip show/hide
      const tooltip = document.getElementById('glossary-tooltip');
      const tooltipDef = document.getElementById('glossary-tooltip-def');
      const tooltipLink = document.getElementById('glossary-tooltip-link');

      body.addEventListener('mouseover', function (e) {
        const target = e.target.closest('.glossary-term');
        if (!target) return;
        tooltipDef.textContent = target.dataset.def;
        tooltipLink.href = '/glossary#' + target.dataset.slug;
        tooltip.classList.remove('hidden');
        positionTooltip(e, target);
      });

      body.addEventListener('mousemove', function (e) {
        if (!e.target.closest('.glossary-term')) return;
        positionTooltip(e, e.target.closest('.glossary-term'));
      });

      body.addEventListener('mouseout', function (e) {
        if (!e.target.closest('.glossary-term')) return;
        tooltip.classList.add('hidden');
      });

      function positionTooltip(e, el) {
        const rect = el.getBoundingClientRect();
        const ttRect = tooltip.getBoundingClientRect();
        let left = rect.left;
        let top = rect.bottom + 6;
        if (left + ttRect.width > window.innerWidth - 12) left = window.innerWidth - ttRect.width - 12;
        if (top + ttRect.height > window.innerHeight - 12) top = rect.top - ttRect.height - 6;
        tooltip.style.left = left + 'px';
        tooltip.style.top = top + 'px';
      }
    })();
    </script>

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
  </body>
</html>
```

- [ ] **Step 2: Build and preview to test tooltips**

```bash
npm run build && npm run preview
```

Open `http://localhost:4321` and navigate to a topic page that contains planning terms — for example, a BOM or safety stock topic. Hover over the term "Bill of Materials" or "BOM" in the prose. A tooltip should appear below the term showing the definition and a "→ Glossary" link.

Verify:
- Only the first occurrence per paragraph is underlined (not every instance)
- Terms inside `<code>`, `<a>`, and headings are NOT wrapped
- Clicking "→ Glossary" navigates to `/glossary#bill-of-materials`
- Tooltip is readable in both light and dark mode

- [ ] **Step 3: Commit**

```bash
git add src/layouts/BaseLayout.astro
git commit -m "feat: add inline glossary tooltips to topic prose"
```

---

## Task 10: Final build verification

- [ ] **Step 1: Clean build**

```bash
npm run build
```

Expected: zero errors, zero warnings about missing files.

- [ ] **Step 2: Verify pagefind indexed pages**

During the build, pagefind prints a summary. Check that it indexed a meaningful number of pages (expect 200+):

```
[pagefind] Indexed NNN pages
```

If the count is 0 or unexpectedly low, verify that `data-pagefind-body` was added to all 8 layouts in Task 2.

- [ ] **Step 3: Verify glossary build validation works**

Temporarily add a bad seeAlso reference to `glossary.json` (e.g. `"seeAlso": ["bad/reference"]`), run `npm run build`, and confirm a clear error is thrown. Revert the change.

```bash
# After reverting, re-run to confirm clean build:
npm run build
```

- [ ] **Step 4: Preview end-to-end**

```bash
npm run preview
```

Checklist:
- [ ] `Cmd+K` opens search modal on any page
- [ ] Typing "safety stock" returns relevant topic results
- [ ] Clicking a result navigates to the correct topic
- [ ] `/glossary` page loads, shows A-Z jump links
- [ ] Clicking a letter jumps to that section
- [ ] "See:" links navigate to topic pages
- [ ] Hovering a glossary term in topic prose shows tooltip
- [ ] `Esc` closes the search modal
- [ ] Site overlay footer shows Glossary link

- [ ] **Step 5: Final commit**

```bash
git add -A
git commit -m "feat: complete findability feature (search + glossary)"
```
