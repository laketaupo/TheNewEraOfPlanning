# Site Structure Reorganisation Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Restructure all four pillars (People, Process, Data, Technology) into a new module/chapter hierarchy matching the approved content outline, with visible "coming soon" stubs for future chapters.

**Architecture:** `order.json` is the authoritative ordering source; chapter `_meta.json` files declare which module (and theme) each chapter belongs to; module index pages are static Astro files per module slug. New `comingSoon: true` flag on `ChapterMeta` drives non-clickable stub cards and a "coming soon" chapter page.

**Tech Stack:** Astro 4, TypeScript, Tailwind CSS 3, static site generation. No test suite — verification is `npm run build` (runs `astro build` + `pagefind --site dist`).

## Global Constraints

- Theme slugs in code and URLs never change: `people`, `process`, `data`, `technology`
- URL shape stays `/{theme}/{module}/{chapter}/{topic}` — no topic files are touched
- `order.json` controls ordering; `_meta.json` `order` field and `NN-` filename prefixes are overridden by it
- Tailwind: never build class names with string interpolation — use complete literal strings only
- All internal links must use `import.meta.env.BASE_URL` as prefix
- `comingSoon` chapters are visible in nav but not clickable and have no topic content
- No new topic `.md` files in this plan

---

## File Map

**Modified:**
- `src/lib/chapters.ts` — add `comingSoon?: boolean` to `ChapterMeta`
- `src/content/order.json` — full rewrite of `modules` and `chapters` keys
- `src/pages/[theme]/[module]/[chapter]/index.astro` — comingSoon rendering + moduleBackMap replacement
- `src/components/SiteOverlay.astro` — moduleLabels replacement
- `src/pages/people/index.astro` — new module cards
- `src/pages/process/index.astro` — new module cards
- `src/pages/data/index.astro` — new module cards
- `src/pages/technology/index.astro` — new module cards
- `src/pages/people/roles-and-responsibilities/index.astro` — updated in place (same slug, new content)
- 30 existing chapter `_meta.json` files — module/theme field changes

**Created:**
- `src/pages/people/decision-making-and-ownership/index.astro`
- `src/pages/people/collaboration-and-ways-of-working/index.astro`
- `src/pages/people/capabilities-and-skills/index.astro`
- `src/pages/process/planning-fundamentals/index.astro`
- `src/pages/process/planning-cycles-and-governance/index.astro`
- `src/pages/process/sop/index.astro`
- `src/pages/process/soe/index.astro`
- `src/pages/process/execution/index.astro`
- `src/pages/process/advanced-planning/index.astro`
- `src/pages/data/data-foundations/index.astro`
- `src/pages/data/planning-data-domains/index.astro`
- `src/pages/data/planning-parameters-and-assumptions/index.astro`
- `src/pages/data/signals-and-insights/index.astro`
- `src/pages/data/performance-and-measurement/index.astro`
- `src/pages/data/data-quality-and-governance/index.astro`
- `src/pages/technology/tool-landscape/index.astro`
- `src/pages/technology/adoption-and-usage-quality/index.astro`
- ~61 stub chapter folders, each with only `_meta.json`

**Deleted:**
- `src/pages/people/organisation/` (entire directory)
- `src/pages/people/implementation-and-change/` (entire directory, if it exists)
- `src/pages/process/process-fundamentals/`
- `src/pages/process/scenario-planning/`
- `src/pages/process/sop-process/`
- `src/pages/process/soe-process/`
- `src/pages/process/execution-process/`
- `src/pages/data/data-fundamentals/`
- `src/pages/data/data-driven-planning/`
- `src/pages/data/data-governance/`
- `src/pages/technology/architecture/`

---

## Task 1: Add `comingSoon` to ChapterMeta and update chapter index page

**Files:**
- Modify: `src/lib/chapters.ts`
- Modify: `src/pages/[theme]/[module]/[chapter]/index.astro`

**Interfaces:**
- Produces: `ChapterMeta.comingSoon?: boolean` — consumed by all module index pages and `[chapter]/index.astro`

- [ ] **Step 1: Add `comingSoon` to `ChapterMeta` interface in `src/lib/chapters.ts`**

In `src/lib/chapters.ts`, add `comingSoon?: boolean;` to the `ChapterMeta` interface after `hidden?: boolean`:

```typescript
export interface ChapterMeta {
  title: string;
  description: string;
  icon: string;
  color: string;
  order: number;
  slug: string;
  theme?: string;
  module?: string;
  hidden?: boolean;
  comingSoon?: boolean;
}
```

The `getChapters()` function already spreads all `_meta.json` fields via `{ ...mod, slug, order }`, so no other change is needed in `chapters.ts`.

- [ ] **Step 2: Replace `moduleBackMap` and add comingSoon rendering in `src/pages/[theme]/[module]/[chapter]/index.astro`**

Replace the `moduleBackMap` object (lines 53–70 in the current file) with:

```typescript
const moduleBackMap: Record<string, { href: string; label: string }> = {
  // Technology
  'planning-software':                  { href: `${BASE_URL}technology/planning-software`,                  label: 'Planning Software' },
  'erp':                                { href: `${BASE_URL}technology/erp`,                                label: 'ERP' },
  'tool-landscape':                     { href: `${BASE_URL}technology/tool-landscape`,                     label: 'Tool Landscape & Architecture' },
  'fms':                                { href: `${BASE_URL}technology/fms`,                                label: 'Farm Management System' },
  'mdm':                                { href: `${BASE_URL}technology/mdm`,                                label: 'MDM' },
  'adoption-and-usage-quality':         { href: `${BASE_URL}technology/adoption-and-usage-quality`,         label: 'Adoption & Usage Quality' },
  // Data
  'data-foundations':                   { href: `${BASE_URL}data/data-foundations`,                         label: 'Data Foundations' },
  'planning-data-domains':              { href: `${BASE_URL}data/planning-data-domains`,                    label: 'Planning Data Domains' },
  'planning-parameters-and-assumptions':{ href: `${BASE_URL}data/planning-parameters-and-assumptions`,     label: 'Planning Parameters & Assumptions' },
  'signals-and-insights':               { href: `${BASE_URL}data/signals-and-insights`,                    label: 'Signals & Insights' },
  'performance-and-measurement':        { href: `${BASE_URL}data/performance-and-measurement`,              label: 'Performance & Measurement' },
  'data-quality-and-governance':        { href: `${BASE_URL}data/data-quality-and-governance`,              label: 'Data Quality & Governance' },
  // Process
  'planning-fundamentals':              { href: `${BASE_URL}process/planning-fundamentals`,                 label: 'Planning Fundamentals' },
  'planning-cycles-and-governance':     { href: `${BASE_URL}process/planning-cycles-and-governance`,        label: 'Planning Cycles & Governance' },
  'sop':                                { href: `${BASE_URL}process/sop`,                                   label: 'S&OP' },
  'soe':                                { href: `${BASE_URL}process/soe`,                                   label: 'S&OE' },
  'execution':                          { href: `${BASE_URL}process/execution`,                             label: 'Execution' },
  'advanced-planning':                  { href: `${BASE_URL}process/advanced-planning`,                     label: 'Advanced Planning' },
  // People
  'roles-and-responsibilities':         { href: `${BASE_URL}people/roles-and-responsibilities`,             label: 'Roles & Responsibilities' },
  'decision-making-and-ownership':      { href: `${BASE_URL}people/decision-making-and-ownership`,          label: 'Decision Making & Ownership' },
  'collaboration-and-ways-of-working':  { href: `${BASE_URL}people/collaboration-and-ways-of-working`,     label: 'Collaboration & Ways of Working' },
  'capabilities-and-skills':            { href: `${BASE_URL}people/capabilities-and-skills`,               label: 'Capabilities & Skills' },
};
```

- [ ] **Step 3: Add comingSoon rendering in the chapter index page main content**

In `src/pages/[theme]/[module]/[chapter]/index.astro`, replace the `<!-- Topic list -->` section and `<!-- Start chapter CTA -->` section with:

```astro
{chapter.comingSoon ? (
  <div class="py-16 text-center">
    <div class="inline-flex items-center justify-center w-14 h-14 rounded-full bg-gray-100 dark:bg-neutral-800 mb-6">
      <svg xmlns="http://www.w3.org/2000/svg" class="w-7 h-7 text-gray-400 dark:text-neutral-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/>
      </svg>
    </div>
    <p class="text-lg font-semibold text-gray-700 dark:text-neutral-300 mb-2">Content coming soon</p>
    <p class="text-sm text-gray-400 dark:text-neutral-500 mb-8">This chapter is part of the new structure and will be available shortly.</p>
    <a href={back.href} class="inline-flex items-center gap-2 text-sm text-blue-600 dark:text-blue-400 hover:underline">
      <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"/>
      </svg>
      Back to {back.label}
    </a>
  </div>
) : (
  <>
    <!-- Topic list -->
    <ol class="space-y-3">
      {topics.map((topic, i) => (
        <li>
          <a
            href={topic.url}
            class={`group flex items-start gap-4 p-4 rounded-xl border ${borderClass} bg-white dark:bg-neutral-900 hover:bg-gray-50 dark:hover:bg-neutral-900/70 transition-all`}
          >
            <span class={`text-sm font-mono font-bold ${textClass} w-6 shrink-0 mt-0.5`}>{String(i + 1).padStart(2, '0')}</span>
            <div class="flex-1 min-w-0">
              <p class="text-gray-900 dark:text-white font-medium">{topic.title}</p>
              <p class="text-sm text-gray-500 dark:text-neutral-500 mt-0.5">{topic.description}</p>
            </div>
            <div class="flex items-center gap-3 shrink-0 mt-0.5">
              {topic.widget && (
                <span class="text-xs text-blue-600 dark:text-blue-500 bg-blue-50 dark:bg-blue-500/10 px-2 py-0.5 rounded-full">interactive</span>
              )}
              <span class="text-xs text-gray-400 dark:text-neutral-600">{topic.estimatedMinutes} min</span>
              <span
                class="topic-completion-dot w-2 h-2 rounded-full bg-gray-200 dark:bg-neutral-700 transition-colors"
                data-topic-id={`${chapter.slug}/${topic.slug}`}
              ></span>
            </div>
          </a>
        </li>
      ))}
    </ol>

    <!-- Start chapter CTA -->
    <div class="mt-10 flex items-center gap-4">
      <a
        href={topics[0]?.url ?? import.meta.env.BASE_URL}
        class={`inline-flex items-center gap-2 ${bgClass} ${textClass} font-semibold px-5 py-2.5 rounded-xl border ${borderClass} hover:opacity-90 transition-opacity`}
      >
        Start chapter
        <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/>
        </svg>
      </a>
      <a id="chapter-back-overview" href={back.href} class="text-sm text-gray-400 dark:text-neutral-500 hover:text-gray-600 dark:hover:text-neutral-300 transition-colors">Back to overview</a>
    </div>
  </>
)}
```

- [ ] **Step 4: Build to verify**

```bash
npm run build
```

Expected: build succeeds. No new stub chapters exist yet so no comingSoon pages are generated, but the type and moduleBackMap changes are validated.

- [ ] **Step 5: Commit**

```bash
git add src/lib/chapters.ts src/pages/\[theme\]/\[module\]/\[chapter\]/index.astro
git commit -m "feat: add comingSoon flag to ChapterMeta; update moduleBackMap for new structure"
```

---

## Task 2: Rewrite `order.json`

**Files:**
- Modify: `src/content/order.json`

**Interfaces:**
- Produces: new module arrays for all four themes; chapter arrays for all new modules

- [ ] **Step 1: Replace `themes`, `modules`, and `chapters` keys in `src/content/order.json`**

The `topics` key is unchanged — copy it verbatim from the existing file. Only `themes`, `modules`, and `chapters` change:

```json
{
  "themes": ["people", "process", "data", "technology"],
  "modules": {
    "people":     ["roles-and-responsibilities", "decision-making-and-ownership", "collaboration-and-ways-of-working", "capabilities-and-skills"],
    "process":    ["planning-fundamentals", "planning-cycles-and-governance", "sop", "soe", "execution", "advanced-planning"],
    "data":       ["data-foundations", "planning-data-domains", "planning-parameters-and-assumptions", "signals-and-insights", "performance-and-measurement", "data-quality-and-governance"],
    "technology": ["tool-landscape", "planning-software", "erp", "fms", "mdm", "adoption-and-usage-quality"]
  },
  "chapters": {
    "roles-and-responsibilities":          ["people-04-roles-overview", "people-01-planning-team", "demand-planner", "supply-planner", "production-planner", "master-planner", "sales", "operations", "finance", "management", "subject-matter-expert"],
    "decision-making-and-ownership":       ["people-02-accountability", "decision-rights", "decision-frameworks", "escalation-behaviour", "ownership-of-planning-decisions"],
    "collaboration-and-ways-of-working":   ["people-03-planning-cadences", "collaboration-model", "planning-meeting-behaviour", "stakeholder-alignment", "communication-standards"],
    "capabilities-and-skills":             ["planning-capabilities", "data-literacy", "decision-making-skills", "continuous-improvement-mindset"],

    "planning-fundamentals":               ["process-03-operating-model", "planning-horizons", "integrated-planning-concept", "decision-flow-overview"],
    "planning-cycles-and-governance":      ["sop-01-sop-fundamentals", "soe-01-soe-fundamentals", "planning-cadence", "meeting-structure", "process-05-governance-and-escalation", "process-04-planning-policy"],
    "sop":                                 ["sop-02-running-sop", "sop-demand-forecasting", "sop-supply-planning", "sop-inventory-planning", "sop-resource-planning", "sop-sop-review", "product-lifecycle-planning"],
    "soe":                                 ["soe-02-running-soe", "soe-demand-monitoring", "soe-supply-monitoring", "soe-exception-management", "soe-integrated-review", "master-production-scheduling", "rough-cut-capacity-planning", "material-planning", "atp"],
    "execution":                           ["exec-01-execution-fundamentals", "exec-02-daily-execution", "exec-order-prioritisation", "exec-execution-monitoring", "exec-actuals-capture", "exec-feedback-to-planning", "lot-selection"],
    "advanced-planning":                   ["process-01-scenario-planning-fundamentals", "process-02-running-scenarios", "exception-management", "constraint-management"],

    "data-foundations":                    ["data-01-planning-data-fundamentals", "data-03-data-types", "data-04-data-governance", "data-05-data-sources-and-model"],
    "planning-data-domains":               ["forecast-data", "inventory-data", "capacity-data", "supply-and-production-data", "lifecycle-data"],
    "planning-parameters-and-assumptions": ["planning-parameters", "scenario-assumptions", "forecast-assumptions", "business-rules"],
    "signals-and-insights":               ["demand-signals", "supply-signals", "inventory-signals", "capacity-signals", "exception-signals"],
    "performance-and-measurement":         ["process-06-kpis", "kpi-definitions", "kpi-interpretation", "root-cause-analysis", "performance-dashboards"],
    "data-quality-and-governance":         ["data-02-data-quality-and-impact", "common-data-issues", "data-validation-routines", "impact-of-poor-data"],

    "tool-landscape":                      ["tool-landscape-overview", "system-roles", "arch-01-end-to-end", "arch-02-integration"],
    "planning-software":                   ["01-understanding-basics", "02-the-network", "03-data-flow", "03-the-logic", "04-the-simulation", "05-navigation-and-ui", "08-configuration-manual", "99-layout-showcase"],
    "erp":                                 ["erp-01-erp-basics", "erp-02-the-data-model", "erp-03-data-flow-into-erp", "erp-04-data-flow-out-of-erp", "erp-05-the-logic", "erp-06-key-erp-workflows", "erp-07-navigation-and-ui"],
    "fms":                                 ["fms-01-understanding-basics", "fms-02-the-data-model", "fms-03-data-flow-into-fms", "fms-04-data-flow-out-of-fms", "fms-05-the-logic", "fms-06-key-fms-workflows", "fms-07-navigation-and-ui"],
    "mdm":                                 ["mdm-01-understanding-basics", "mdm-02-the-data-model", "mdm-03-data-flow-into-mdm", "mdm-04-data-flow-out-of-mdm", "mdm-05-the-logic", "mdm-06-key-mdm-workflows", "mdm-07-navigation-and-ui"],
    "adoption-and-usage-quality":          ["common-tool-mistakes", "best-practices", "tool-usage-by-role", "faq-and-troubleshooting"]
  },
  "topics": {
    ... KEEP THE EXISTING topics KEY VERBATIM — do not change any topic arrays ...
  }
}
```

**Important:** copy the entire existing `"topics": { ... }` block from the current file without any changes.

- [ ] **Step 2: Build to verify**

```bash
npm run build
```

Expected: build succeeds. Chapters with old module slugs in their `_meta.json` will still load (they get order 9999 but don't error). New stub chapters listed in `order.json` don't exist yet and are simply absent from the site.

- [ ] **Step 3: Commit**

```bash
git add src/content/order.json
git commit -m "feat: rewrite order.json with new pillar/module/chapter structure"
```

---

## Task 3: Reassign existing chapter `_meta.json` — People

**Files:**
- Modify: `src/content/chapters/people-01-planning-team/_meta.json`
- Modify: `src/content/chapters/people-02-accountability/_meta.json`
- Modify: `src/content/chapters/people-03-planning-cadences/_meta.json`

(`people-04-roles-overview` already has `"module": "roles-and-responsibilities"` — no change needed.)

- [ ] **Step 1: Update `people-01-planning-team/_meta.json`**

Change `"module": "organisation"` → `"module": "roles-and-responsibilities"`. Full file:

```json
{
  "title": "The Planning Team",
  "description": "The roles, responsibilities, and structure of a supply chain planning team — who does what and how they work together.",
  "icon": "users",
  "color": "red",
  "theme": "people",
  "module": "roles-and-responsibilities"
}
```

- [ ] **Step 2: Update `people-02-accountability/_meta.json`**

```json
{
  "title": "Accountability & Governance",
  "description": "How responsibility is assigned across the S&OP cycle — who owns each step, who supports, and who needs to be kept informed.",
  "icon": "network",
  "color": "red",
  "theme": "people",
  "module": "decision-making-and-ownership"
}
```

- [ ] **Step 3: Update `people-03-planning-cadences/_meta.json`**

```json
{
  "title": "Planning Cadences",
  "description": "A week, month, and quarter in the life of the three planning horizons — what each planner does, when, and why.",
  "icon": "calendar",
  "color": "orange",
  "theme": "people",
  "module": "collaboration-and-ways-of-working"
}
```

- [ ] **Step 4: Build to verify**

```bash
npm run build
```

Expected: build succeeds. These chapters now appear under their new modules.

- [ ] **Step 5: Commit**

```bash
git add src/content/chapters/people-01-planning-team/_meta.json \
        src/content/chapters/people-02-accountability/_meta.json \
        src/content/chapters/people-03-planning-cadences/_meta.json
git commit -m "feat: reassign People chapter modules to new structure"
```

---

## Task 4: Reassign existing chapter `_meta.json` — Process and cross-pillar move

**Files:** 24 `_meta.json` files in Process chapters, plus `process-06-kpis` cross-pillar move.

- [ ] **Step 1: Update Process chapters — `planning-fundamentals` module**

`src/content/chapters/process-03-operating-model/_meta.json` — change module to `planning-fundamentals`:
```json
{
  "title": "The Operating Model",
  "description": "How S&OP, S&OE, and Execution fit together — the integrated planning model and its cadence.",
  "icon": "document-text",
  "color": "blue",
  "theme": "process",
  "module": "planning-fundamentals"
}
```

- [ ] **Step 2: Update Process chapters — `planning-cycles-and-governance` module**

`src/content/chapters/sop-01-sop-fundamentals/_meta.json`:
```json
{
  "title": "S&OP Fundamentals",
  "description": "What S&OP is, the monthly cycle, the roles involved, and how it produces one agreed plan.",
  "icon": "calendar",
  "color": "blue",
  "theme": "process",
  "module": "planning-cycles-and-governance"
}
```

`src/content/chapters/soe-01-soe-fundamentals/_meta.json`:
```json
{
  "title": "S&OE Fundamentals",
  "description": "The weekly S&OE cadence — monitoring, exception management, and escalating to S&OP.",
  "icon": "document-text",
  "color": "blue",
  "theme": "process",
  "module": "planning-cycles-and-governance"
}
```

`src/content/chapters/process-04-planning-policy/_meta.json`:
```json
{
  "title": "Planning Policy",
  "description": "Service level targets, safety stock rules, allocation logic, and prioritisation — the policies that govern how the plan is built.",
  "icon": "shield-check",
  "color": "blue",
  "theme": "process",
  "module": "planning-cycles-and-governance"
}
```

`src/content/chapters/process-05-governance-and-escalation/_meta.json`:
```json
{
  "title": "Governance & Escalation",
  "description": "Decision frameworks, escalation paths, and management-by-exception — how planning decisions get made and surfaced.",
  "icon": "shield-check",
  "color": "blue",
  "theme": "process",
  "module": "planning-cycles-and-governance"
}
```

- [ ] **Step 3: Update Process chapters — `sop` module**

Update these six chapters by changing only the `"module"` field to `"sop"` in each:
- `src/content/chapters/sop-02-running-sop/_meta.json`
- `src/content/chapters/sop-demand-forecasting/_meta.json`
- `src/content/chapters/sop-supply-planning/_meta.json`
- `src/content/chapters/sop-inventory-planning/_meta.json`
- `src/content/chapters/sop-resource-planning/_meta.json`
- `src/content/chapters/sop-sop-review/_meta.json`

Read each file first, then update only the `module` field value from `"sop-process"` → `"sop"`. All other fields stay unchanged.

- [ ] **Step 4: Update Process chapters — `soe` module**

Update these five chapters by changing `"module"` to `"soe"`:
- `src/content/chapters/soe-02-running-soe/_meta.json`
- `src/content/chapters/soe-demand-monitoring/_meta.json`
- `src/content/chapters/soe-supply-monitoring/_meta.json`
- `src/content/chapters/soe-exception-management/_meta.json`
- `src/content/chapters/soe-integrated-review/_meta.json`

- [ ] **Step 5: Update Process chapters — `execution` module**

Update these six chapters by changing `"module"` to `"execution"`:
- `src/content/chapters/exec-01-execution-fundamentals/_meta.json`
- `src/content/chapters/exec-02-daily-execution/_meta.json`
- `src/content/chapters/exec-order-prioritisation/_meta.json`
- `src/content/chapters/exec-execution-monitoring/_meta.json`
- `src/content/chapters/exec-actuals-capture/_meta.json`
- `src/content/chapters/exec-feedback-to-planning/_meta.json`

- [ ] **Step 6: Update Process chapters — `advanced-planning` module**

Update these two chapters by changing `"module"` to `"advanced-planning"`:
- `src/content/chapters/process-01-scenario-planning-fundamentals/_meta.json`
- `src/content/chapters/process-02-running-scenarios/_meta.json`

- [ ] **Step 7: Cross-pillar move — `process-06-kpis` → Data**

`src/content/chapters/process-06-kpis/_meta.json` — change both `theme` and `module`:
```json
{
  "title": "Planning KPIs",
  "description": "KPI framework, ownership, and review cadence — the metrics that track planning health.",
  "icon": "chart-bar",
  "color": "yellow",
  "theme": "data",
  "module": "performance-and-measurement"
}
```

- [ ] **Step 8: Build to verify**

```bash
npm run build
```

Expected: build succeeds.

- [ ] **Step 9: Commit**

```bash
git add src/content/chapters/process-*/  src/content/chapters/sop-*/  src/content/chapters/soe-*/  src/content/chapters/exec-*/
git commit -m "feat: reassign Process chapter modules to new structure; move KPIs chapter to Data"
```

---

## Task 5: Reassign existing chapter `_meta.json` — Data and Technology

**Files:** 5 Data `_meta.json` files + 2 Technology `_meta.json` files.

- [ ] **Step 1: Update Data chapters — `data-foundations` module**

Update these four chapters by changing `"module"` to `"data-foundations"` (and keeping `"theme": "data"`):
- `src/content/chapters/data-01-planning-data-fundamentals/_meta.json` — old module: `data-driven-planning`
- `src/content/chapters/data-03-data-types/_meta.json` — old module: `data-fundamentals`
- `src/content/chapters/data-04-data-governance/_meta.json` — old module: `data-governance`
- `src/content/chapters/data-05-data-sources-and-model/_meta.json` — old module: `data-fundamentals`

Read each file first, then change only the `"module"` field.

- [ ] **Step 2: Update Data chapters — `data-quality-and-governance` module**

`src/content/chapters/data-02-data-quality-and-impact/_meta.json` — change `"module"` from `"data-driven-planning"` → `"data-quality-and-governance"`.

- [ ] **Step 3: Update Technology chapters — `tool-landscape` module**

Update these two chapters by changing `"module"` from `"architecture"` → `"tool-landscape"`:
- `src/content/chapters/arch-01-end-to-end/_meta.json`
- `src/content/chapters/arch-02-integration/_meta.json`

- [ ] **Step 4: Build to verify**

```bash
npm run build
```

Expected: build succeeds.

- [ ] **Step 5: Commit**

```bash
git add src/content/chapters/data-*/  src/content/chapters/arch-*/
git commit -m "feat: reassign Data and Technology chapter modules to new structure"
```

---

## Task 6: Create stub chapters — People (21 stubs)

**Files:** 21 new chapter folders, each containing only `_meta.json`.

Each stub `_meta.json` follows this template:
```json
{
  "title": "<Title>",
  "description": "<Description>",
  "icon": "<icon>",
  "color": "<color>",
  "theme": "<theme>",
  "module": "<module>",
  "comingSoon": true
}
```

- [ ] **Step 1: Create `roles-and-responsibilities` stubs**

Create these 9 folders and `_meta.json` files:

`src/content/chapters/demand-planner/_meta.json`:
```json
{ "title": "Demand Planner", "description": "Role profile for the Demand Planner — responsibilities, day-to-day tasks, and interactions across S&OP and S&OE.", "icon": "user", "color": "red", "theme": "people", "module": "roles-and-responsibilities", "comingSoon": true }
```

`src/content/chapters/supply-planner/_meta.json`:
```json
{ "title": "Supply Planner", "description": "Role profile for the Supply Planner — capacity constraints, supply plan ownership, and escalation.", "icon": "user", "color": "red", "theme": "people", "module": "roles-and-responsibilities", "comingSoon": true }
```

`src/content/chapters/production-planner/_meta.json`:
```json
{ "title": "Production Planner", "description": "Role profile for the Production Planner — scheduling, shop floor liaison, and execution feedback.", "icon": "user", "color": "red", "theme": "people", "module": "roles-and-responsibilities", "comingSoon": true }
```

`src/content/chapters/master-planner/_meta.json`:
```json
{ "title": "Master Planner", "description": "Role profile for the Master Planner — cross-functional planning coordination and plan integrity.", "icon": "user", "color": "red", "theme": "people", "module": "roles-and-responsibilities", "comingSoon": true }
```

`src/content/chapters/sales/_meta.json`:
```json
{ "title": "Sales", "description": "How the Sales function participates in demand review and S&OP — commercial inputs, forecast ownership, and plan commitments.", "icon": "users", "color": "red", "theme": "people", "module": "roles-and-responsibilities", "comingSoon": true }
```

`src/content/chapters/operations/_meta.json`:
```json
{ "title": "Operations", "description": "How Operations engages in supply review and execution — capacity ownership, constraint escalation, and feedback to planning.", "icon": "users", "color": "red", "theme": "people", "module": "roles-and-responsibilities", "comingSoon": true }
```

`src/content/chapters/finance/_meta.json`:
```json
{ "title": "Finance", "description": "Finance's role in S&OP — financial reconciliation, volume-to-value conversion, and executive review input.", "icon": "users", "color": "red", "theme": "people", "module": "roles-and-responsibilities", "comingSoon": true }
```

`src/content/chapters/management/_meta.json`:
```json
{ "title": "Management", "description": "Leadership's role in the planning process — decision rights at executive S&OP, escalation resolution, and strategic alignment.", "icon": "users", "color": "red", "theme": "people", "module": "roles-and-responsibilities", "comingSoon": true }
```

`src/content/chapters/subject-matter-expert/_meta.json`:
```json
{ "title": "Subject Matter Expert", "description": "The SME role in planning transformation — knowledge transfer, process design, and capability building.", "icon": "users", "color": "red", "theme": "people", "module": "roles-and-responsibilities", "comingSoon": true }
```

- [ ] **Step 2: Create `decision-making-and-ownership` stubs**

`src/content/chapters/decision-rights/_meta.json`:
```json
{ "title": "Decision Rights", "description": "Who has authority to make which planning decisions — and how those rights are defined and protected.", "icon": "network", "color": "red", "theme": "people", "module": "decision-making-and-ownership", "comingSoon": true }
```

`src/content/chapters/decision-frameworks/_meta.json`:
```json
{ "title": "Decision Frameworks", "description": "The frameworks planners use to structure complex decisions — trade-off tools, criteria hierarchies, and consensus models.", "icon": "network", "color": "red", "theme": "people", "module": "decision-making-and-ownership", "comingSoon": true }
```

`src/content/chapters/escalation-behaviour/_meta.json`:
```json
{ "title": "Escalation Behaviour", "description": "How and when to escalate planning issues — the triggers, the path, and expected response.", "icon": "network", "color": "red", "theme": "people", "module": "decision-making-and-ownership", "comingSoon": true }
```

`src/content/chapters/ownership-of-planning-decisions/_meta.json`:
```json
{ "title": "Ownership of Planning Decisions", "description": "How planning decision ownership is assigned, tracked, and enforced across roles and functions.", "icon": "network", "color": "red", "theme": "people", "module": "decision-making-and-ownership", "comingSoon": true }
```

- [ ] **Step 3: Create `collaboration-and-ways-of-working` stubs**

`src/content/chapters/collaboration-model/_meta.json`:
```json
{ "title": "Collaboration Model", "description": "How planning functions collaborate — cross-functional interfaces, shared accountability, and meeting norms.", "icon": "calendar", "color": "orange", "theme": "people", "module": "collaboration-and-ways-of-working", "comingSoon": true }
```

`src/content/chapters/planning-meeting-behaviour/_meta.json`:
```json
{ "title": "Planning Meeting Behaviour", "description": "What good looks like in planning meetings — preparation, participation, and follow-through.", "icon": "calendar", "color": "orange", "theme": "people", "module": "collaboration-and-ways-of-working", "comingSoon": true }
```

`src/content/chapters/stakeholder-alignment/_meta.json`:
```json
{ "title": "Stakeholder Alignment", "description": "How to align stakeholders on planning priorities, assumptions, and decisions before and after key meetings.", "icon": "calendar", "color": "orange", "theme": "people", "module": "collaboration-and-ways-of-working", "comingSoon": true }
```

`src/content/chapters/communication-standards/_meta.json`:
```json
{ "title": "Communication Standards", "description": "Planning communication norms — how to report, escalate, and close the loop across functions.", "icon": "calendar", "color": "orange", "theme": "people", "module": "collaboration-and-ways-of-working", "comingSoon": true }
```

- [ ] **Step 4: Create `capabilities-and-skills` stubs**

`src/content/chapters/planning-capabilities/_meta.json`:
```json
{ "title": "Planning Capabilities", "description": "The core planning capabilities required at each level — analytical, process, and tool competencies.", "icon": "chart-bar", "color": "red", "theme": "people", "module": "capabilities-and-skills", "comingSoon": true }
```

`src/content/chapters/data-literacy/_meta.json`:
```json
{ "title": "Data Literacy", "description": "Understanding data well enough to plan with confidence — reading outputs, questioning assumptions, and spotting errors.", "icon": "chart-bar", "color": "red", "theme": "people", "module": "capabilities-and-skills", "comingSoon": true }
```

`src/content/chapters/decision-making-skills/_meta.json`:
```json
{ "title": "Decision-Making Skills", "description": "How effective planners make decisions under uncertainty — structured thinking, bias awareness, and trade-off clarity.", "icon": "chart-bar", "color": "red", "theme": "people", "module": "capabilities-and-skills", "comingSoon": true }
```

`src/content/chapters/continuous-improvement-mindset/_meta.json`:
```json
{ "title": "Continuous Improvement Mindset", "description": "How planning teams build a culture of review, learning, and improvement — retrospectives, KPI ownership, and change adoption.", "icon": "chart-bar", "color": "red", "theme": "people", "module": "capabilities-and-skills", "comingSoon": true }
```

- [ ] **Step 5: Build to verify**

```bash
npm run build
```

Expected: build succeeds. People stubs generate chapter pages with "Coming soon" content.

- [ ] **Step 6: Commit**

```bash
git add src/content/chapters/demand-planner/ src/content/chapters/supply-planner/ \
        src/content/chapters/production-planner/ src/content/chapters/master-planner/ \
        src/content/chapters/sales/ src/content/chapters/operations/ \
        src/content/chapters/finance/ src/content/chapters/management/ \
        src/content/chapters/subject-matter-expert/ src/content/chapters/decision-rights/ \
        src/content/chapters/decision-frameworks/ src/content/chapters/escalation-behaviour/ \
        src/content/chapters/ownership-of-planning-decisions/ src/content/chapters/collaboration-model/ \
        src/content/chapters/planning-meeting-behaviour/ src/content/chapters/stakeholder-alignment/ \
        src/content/chapters/communication-standards/ src/content/chapters/planning-capabilities/ \
        src/content/chapters/data-literacy/ src/content/chapters/decision-making-skills/ \
        src/content/chapters/continuous-improvement-mindset/
git commit -m "feat: add People stub chapters (21 coming-soon stubs)"
```

---

## Task 7: Create stub chapters — Process (13 stubs)

- [ ] **Step 1: Create `planning-fundamentals` stubs**

`src/content/chapters/planning-horizons/_meta.json`:
```json
{ "title": "Planning Horizons", "description": "Long-term, mid-term, and short-term planning horizons — what each covers, who owns it, and how they connect.", "icon": "calendar", "color": "blue", "theme": "process", "module": "planning-fundamentals", "comingSoon": true }
```

`src/content/chapters/integrated-planning-concept/_meta.json`:
```json
{ "title": "Integrated Planning Concept", "description": "How S&OP, S&OE, and Execution form one integrated planning system — the logic, the hand-offs, and the dependencies.", "icon": "document-text", "color": "blue", "theme": "process", "module": "planning-fundamentals", "comingSoon": true }
```

`src/content/chapters/decision-flow-overview/_meta.json`:
```json
{ "title": "Decision Flow Overview", "description": "How decisions flow from strategic to operational — the decision architecture across planning horizons.", "icon": "document-text", "color": "blue", "theme": "process", "module": "planning-fundamentals", "comingSoon": true }
```

- [ ] **Step 2: Create `planning-cycles-and-governance` stubs**

`src/content/chapters/planning-cadence/_meta.json`:
```json
{ "title": "Planning Cadence", "description": "The rhythm of planning — monthly S&OP, weekly S&OE, and daily execution cycles and how they align.", "icon": "calendar", "color": "blue", "theme": "process", "module": "planning-cycles-and-governance", "comingSoon": true }
```

`src/content/chapters/meeting-structure/_meta.json`:
```json
{ "title": "Meeting Structure", "description": "How planning meetings are structured — agenda, participants, inputs, and outputs for each cycle.", "icon": "calendar", "color": "blue", "theme": "process", "module": "planning-cycles-and-governance", "comingSoon": true }
```

- [ ] **Step 3: Create `sop` stub**

`src/content/chapters/product-lifecycle-planning/_meta.json`:
```json
{ "title": "Product Lifecycle Planning", "description": "How new product introductions and phase-outs are planned — NPI process, demand ramp-up, and end-of-life wind-down.", "icon": "beaker", "color": "blue", "theme": "process", "module": "sop", "comingSoon": true }
```

- [ ] **Step 4: Create `soe` stubs**

`src/content/chapters/master-production-scheduling/_meta.json`:
```json
{ "title": "Master Production Scheduling", "description": "Building and maintaining the master production schedule — inputs, time fences, and freeze logic.", "icon": "chart-bar", "color": "blue", "theme": "process", "module": "soe", "comingSoon": true }
```

`src/content/chapters/rough-cut-capacity-planning/_meta.json`:
```json
{ "title": "Rough-Cut Capacity Planning", "description": "RCCP — validating the MPS against key resources before committing to the plan.", "icon": "chart-bar", "color": "blue", "theme": "process", "module": "soe", "comingSoon": true }
```

`src/content/chapters/material-planning/_meta.json`:
```json
{ "title": "Material Planning", "description": "MRP and material requirements — translating the production schedule into component and raw material needs.", "icon": "chart-bar", "color": "blue", "theme": "process", "module": "soe", "comingSoon": true }
```

`src/content/chapters/atp/_meta.json`:
```json
{ "title": "ATP", "description": "Available-to-Promise — how committed supply is tracked and protected for customer orders.", "icon": "chart-bar", "color": "blue", "theme": "process", "module": "soe", "comingSoon": true }
```

- [ ] **Step 5: Create `execution` stub**

`src/content/chapters/lot-selection/_meta.json`:
```json
{ "title": "Lot Selection", "description": "How lots are selected for fulfilment — quality status, FEFO/FIFO logic, and allocation rules.", "icon": "shield-check", "color": "blue", "theme": "process", "module": "execution", "comingSoon": true }
```

- [ ] **Step 6: Create `advanced-planning` stubs**

`src/content/chapters/exception-management/_meta.json`:
```json
{ "title": "Exception Management", "description": "How planning exceptions are identified, prioritised, and resolved — the exception-based planning discipline.", "icon": "beaker", "color": "blue", "theme": "process", "module": "advanced-planning", "comingSoon": true }
```

`src/content/chapters/constraint-management/_meta.json`:
```json
{ "title": "Constraint Management", "description": "Identifying and managing binding constraints across the supply chain — capacity, material, and regulatory constraints.", "icon": "beaker", "color": "blue", "theme": "process", "module": "advanced-planning", "comingSoon": true }
```

- [ ] **Step 7: Build to verify**

```bash
npm run build
```

- [ ] **Step 8: Commit**

```bash
git add src/content/chapters/planning-horizons/ src/content/chapters/integrated-planning-concept/ \
        src/content/chapters/decision-flow-overview/ src/content/chapters/planning-cadence/ \
        src/content/chapters/meeting-structure/ src/content/chapters/product-lifecycle-planning/ \
        src/content/chapters/master-production-scheduling/ src/content/chapters/rough-cut-capacity-planning/ \
        src/content/chapters/material-planning/ src/content/chapters/atp/ \
        src/content/chapters/lot-selection/ src/content/chapters/exception-management/ \
        src/content/chapters/constraint-management/
git commit -m "feat: add Process stub chapters (13 coming-soon stubs)"
```

---

## Task 8: Create stub chapters — Data (21 stubs)

- [ ] **Step 1: Create `planning-data-domains` stubs**

`src/content/chapters/forecast-data/_meta.json`:
```json
{ "title": "Forecast Data", "description": "The data that drives demand forecasting — statistical inputs, commercial overlays, and consensus signals.", "icon": "database", "color": "yellow", "theme": "data", "module": "planning-data-domains", "comingSoon": true }
```

`src/content/chapters/inventory-data/_meta.json`:
```json
{ "title": "Inventory Data", "description": "Stock positions, coverage calculations, and safety stock parameters — the data behind inventory decisions.", "icon": "database", "color": "yellow", "theme": "data", "module": "planning-data-domains", "comingSoon": true }
```

`src/content/chapters/capacity-data/_meta.json`:
```json
{ "title": "Capacity Data", "description": "Resource availability, utilisation rates, and constraint data — the numbers behind capacity planning.", "icon": "database", "color": "yellow", "theme": "data", "module": "planning-data-domains", "comingSoon": true }
```

`src/content/chapters/supply-and-production-data/_meta.json`:
```json
{ "title": "Supply and Production Data", "description": "Purchase orders, production orders, and receipts — the supply-side data that feeds the plan.", "icon": "database", "color": "yellow", "theme": "data", "module": "planning-data-domains", "comingSoon": true }
```

`src/content/chapters/lifecycle-data/_meta.json`:
```json
{ "title": "Lifecycle Data", "description": "New product introductions, phase-outs, and lifecycle status — the data that tracks what is active in the plan.", "icon": "database", "color": "yellow", "theme": "data", "module": "planning-data-domains", "comingSoon": true }
```

- [ ] **Step 2: Create `planning-parameters-and-assumptions` stubs**

`src/content/chapters/planning-parameters/_meta.json`:
```json
{ "title": "Planning Parameters", "description": "Lead times, lot sizes, safety stock levels, and other parameters that shape how the planning engine calculates.", "icon": "server", "color": "yellow", "theme": "data", "module": "planning-parameters-and-assumptions", "comingSoon": true }
```

`src/content/chapters/scenario-assumptions/_meta.json`:
```json
{ "title": "Scenario Assumptions", "description": "The assumptions that underpin scenarios — demand growth, yield changes, capacity upgrades, and risk events.", "icon": "server", "color": "yellow", "theme": "data", "module": "planning-parameters-and-assumptions", "comingSoon": true }
```

`src/content/chapters/forecast-assumptions/_meta.json`:
```json
{ "title": "Forecast Assumptions", "description": "The commercial and statistical assumptions built into the demand forecast — growth rates, seasonality, and market conditions.", "icon": "server", "color": "yellow", "theme": "data", "module": "planning-parameters-and-assumptions", "comingSoon": true }
```

`src/content/chapters/business-rules/_meta.json`:
```json
{ "title": "Business Rules", "description": "The policies encoded into the planning system — allocation rules, priority logic, and constraint hierarchy.", "icon": "server", "color": "yellow", "theme": "data", "module": "planning-parameters-and-assumptions", "comingSoon": true }
```

- [ ] **Step 3: Create `signals-and-insights` stubs**

`src/content/chapters/demand-signals/_meta.json`:
```json
{ "title": "Demand Signals", "description": "The data signals that indicate demand — orders, forecasts, bookings, and market intelligence.", "icon": "chart-bar", "color": "yellow", "theme": "data", "module": "signals-and-insights", "comingSoon": true }
```

`src/content/chapters/supply-signals/_meta.json`:
```json
{ "title": "Supply Signals", "description": "The data signals that indicate supply availability — receipts, production completions, and supplier confirmations.", "icon": "chart-bar", "color": "yellow", "theme": "data", "module": "signals-and-insights", "comingSoon": true }
```

`src/content/chapters/inventory-signals/_meta.json`:
```json
{ "title": "Inventory Signals", "description": "The data signals that indicate inventory health — coverage, shortfall, and excess flags.", "icon": "chart-bar", "color": "yellow", "theme": "data", "module": "signals-and-insights", "comingSoon": true }
```

`src/content/chapters/capacity-signals/_meta.json`:
```json
{ "title": "Capacity Signals", "description": "The data signals that indicate capacity pressure — utilisation alerts, queue build-up, and constraint proximity.", "icon": "chart-bar", "color": "yellow", "theme": "data", "module": "signals-and-insights", "comingSoon": true }
```

`src/content/chapters/exception-signals/_meta.json`:
```json
{ "title": "Exception Signals", "description": "The data signals that trigger exception management — threshold breaches, plan deviations, and system alerts.", "icon": "chart-bar", "color": "yellow", "theme": "data", "module": "signals-and-insights", "comingSoon": true }
```

- [ ] **Step 4: Create `performance-and-measurement` stubs**

`src/content/chapters/kpi-definitions/_meta.json`:
```json
{ "title": "KPI Definitions", "description": "Precise definitions of each planning KPI — what it measures, how it is calculated, and what good looks like.", "icon": "chart-bar", "color": "yellow", "theme": "data", "module": "performance-and-measurement", "comingSoon": true }
```

`src/content/chapters/kpi-interpretation/_meta.json`:
```json
{ "title": "KPI Interpretation", "description": "How to read planning KPIs in context — trend analysis, benchmarking, and avoiding misleading conclusions.", "icon": "chart-bar", "color": "yellow", "theme": "data", "module": "performance-and-measurement", "comingSoon": true }
```

`src/content/chapters/root-cause-analysis/_meta.json`:
```json
{ "title": "Root-Cause Analysis", "description": "How to diagnose what is driving a KPI — the analytical approach to understanding planning performance.", "icon": "chart-bar", "color": "yellow", "theme": "data", "module": "performance-and-measurement", "comingSoon": true }
```

`src/content/chapters/performance-dashboards/_meta.json`:
```json
{ "title": "Performance Dashboards", "description": "How to build and use planning performance dashboards — the right metrics, the right views, for the right audience.", "icon": "chart-bar", "color": "yellow", "theme": "data", "module": "performance-and-measurement", "comingSoon": true }
```

- [ ] **Step 5: Create `data-quality-and-governance` stubs**

`src/content/chapters/common-data-issues/_meta.json`:
```json
{ "title": "Common Data Issues", "description": "The most common data quality problems in planning environments — what they are, where they come from, and their impact.", "icon": "database", "color": "yellow", "theme": "data", "module": "data-quality-and-governance", "comingSoon": true }
```

`src/content/chapters/data-validation-routines/_meta.json`:
```json
{ "title": "Data Validation Routines", "description": "The checks and routines used to validate planning data before it enters the plan.", "icon": "database", "color": "yellow", "theme": "data", "module": "data-quality-and-governance", "comingSoon": true }
```

`src/content/chapters/impact-of-poor-data/_meta.json`:
```json
{ "title": "Impact of Poor Data", "description": "How bad data shows up in the plan — the downstream consequences of data quality failures.", "icon": "database", "color": "yellow", "theme": "data", "module": "data-quality-and-governance", "comingSoon": true }
```

- [ ] **Step 6: Build to verify**

```bash
npm run build
```

- [ ] **Step 7: Commit**

```bash
git add src/content/chapters/forecast-data/ src/content/chapters/inventory-data/ \
        src/content/chapters/capacity-data/ src/content/chapters/supply-and-production-data/ \
        src/content/chapters/lifecycle-data/ src/content/chapters/planning-parameters/ \
        src/content/chapters/scenario-assumptions/ src/content/chapters/forecast-assumptions/ \
        src/content/chapters/business-rules/ src/content/chapters/demand-signals/ \
        src/content/chapters/supply-signals/ src/content/chapters/inventory-signals/ \
        src/content/chapters/capacity-signals/ src/content/chapters/exception-signals/ \
        src/content/chapters/kpi-definitions/ src/content/chapters/kpi-interpretation/ \
        src/content/chapters/root-cause-analysis/ src/content/chapters/performance-dashboards/ \
        src/content/chapters/common-data-issues/ src/content/chapters/data-validation-routines/ \
        src/content/chapters/impact-of-poor-data/
git commit -m "feat: add Data stub chapters (21 coming-soon stubs)"
```

---

## Task 9: Create stub chapters — Technology (6 stubs)

- [ ] **Step 1: Create `tool-landscape` stubs**

`src/content/chapters/tool-landscape-overview/_meta.json`:
```json
{ "title": "Tool Landscape", "description": "An overview of all tools in the planning technology stack — what each does, and how they relate.", "icon": "cube", "color": "emerald", "theme": "technology", "module": "tool-landscape", "comingSoon": true }
```

`src/content/chapters/system-roles/_meta.json`:
```json
{ "title": "System Roles", "description": "The role each system plays in the planning landscape — system of record, system of engagement, system of intelligence.", "icon": "cube", "color": "emerald", "theme": "technology", "module": "tool-landscape", "comingSoon": true }
```

- [ ] **Step 2: Create `adoption-and-usage-quality` stubs**

`src/content/chapters/common-tool-mistakes/_meta.json`:
```json
{ "title": "Common Tool Mistakes", "description": "The most common misuses of planning tools — workarounds, data entry errors, and process bypasses.", "icon": "shield-check", "color": "emerald", "theme": "technology", "module": "adoption-and-usage-quality", "comingSoon": true }
```

`src/content/chapters/best-practices/_meta.json`:
```json
{ "title": "Best Practices", "description": "How high-performing planning teams use the tools — discipline, consistency, and process adherence.", "icon": "shield-check", "color": "emerald", "theme": "technology", "module": "adoption-and-usage-quality", "comingSoon": true }
```

`src/content/chapters/tool-usage-by-role/_meta.json`:
```json
{ "title": "Tool Usage by Role", "description": "How each planning role interacts with the tools — what they read, what they enter, and what they are responsible for.", "icon": "shield-check", "color": "emerald", "theme": "technology", "module": "adoption-and-usage-quality", "comingSoon": true }
```

`src/content/chapters/faq-and-troubleshooting/_meta.json`:
```json
{ "title": "FAQ and Troubleshooting", "description": "Answers to the most common questions about tool usage — and how to resolve the most frequent issues.", "icon": "shield-check", "color": "emerald", "theme": "technology", "module": "adoption-and-usage-quality", "comingSoon": true }
```

- [ ] **Step 3: Build to verify**

```bash
npm run build
```

- [ ] **Step 4: Commit**

```bash
git add src/content/chapters/tool-landscape-overview/ src/content/chapters/system-roles/ \
        src/content/chapters/common-tool-mistakes/ src/content/chapters/best-practices/ \
        src/content/chapters/tool-usage-by-role/ src/content/chapters/faq-and-troubleshooting/
git commit -m "feat: add Technology stub chapters (6 coming-soon stubs)"
```

---

## Task 10: Update `SiteOverlay.astro` moduleLabels

**Files:**
- Modify: `src/components/SiteOverlay.astro`

- [ ] **Step 1: Replace `moduleLabels` in `src/components/SiteOverlay.astro`**

Find the `const moduleLabels` object (currently lines 18–35) and replace it entirely:

```typescript
const moduleLabels: Record<string, string> = {
  // Technology
  'planning-software':                   'Planning Software',
  'erp':                                 'ERP',
  'tool-landscape':                      'Tool Landscape & Architecture',
  'fms':                                 'Farm Management System',
  'mdm':                                 'MDM',
  'adoption-and-usage-quality':          'Adoption & Usage Quality',
  // Data
  'data-foundations':                    'Data Foundations',
  'planning-data-domains':               'Planning Data Domains',
  'planning-parameters-and-assumptions': 'Planning Parameters & Assumptions',
  'signals-and-insights':               'Signals & Insights',
  'performance-and-measurement':         'Performance & Measurement',
  'data-quality-and-governance':         'Data Quality & Governance',
  // Process
  'planning-fundamentals':               'Planning Fundamentals',
  'planning-cycles-and-governance':      'Planning Cycles & Governance',
  'sop':                                 'S&OP',
  'soe':                                 'S&OE',
  'execution':                           'Execution',
  'advanced-planning':                   'Advanced Planning',
  // People
  'roles-and-responsibilities':          'Roles & Responsibilities',
  'decision-making-and-ownership':       'Decision Making & Ownership',
  'collaboration-and-ways-of-working':   'Collaboration & Ways of Working',
  'capabilities-and-skills':             'Capabilities & Skills',
};
```

Note: `&` is the unicode escape for `&`. Use literal `&` if the template handles it correctly — check existing file for the pattern used (e.g., `'S&OP'` vs `'S&OP'`).

- [ ] **Step 2: Build to verify**

```bash
npm run build
```

- [ ] **Step 3: Commit**

```bash
git add src/components/SiteOverlay.astro
git commit -m "feat: update SiteOverlay moduleLabels for new pillar structure"
```

---

## Task 11: Replace module index pages — People

All module index pages use an identical structure. The reference template is at the bottom of this task. Differences between pages: `MODULE_SLUG`, `MODULE_TITLE`, `MODULE_DESCRIPTION`, `PILLAR` (label + href), `ACCENT_COLOR_CLASS`.

For People, accent is blue (same as all pillars).

**Icon SVGs used in People module pages:**

```
users: <svg xmlns="http://www.w3.org/2000/svg" class="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M17 20h5v-2a4 4 0 00-5-3.87M9 20H4v-2a4 4 0 015-3.87m6-4.13a4 4 0 10-8 0 4 4 0 008 0zm6 0a3 3 0 11-6 0 3 3 0 016 0z"/></svg>

user: <svg xmlns="http://www.w3.org/2000/svg" class="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/></svg>

network: <svg xmlns="http://www.w3.org/2000/svg" class="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor"><circle cx="12" cy="5" r="2" stroke-width="1.5"/><circle cx="5" cy="19" r="2" stroke-width="1.5"/><circle cx="19" cy="19" r="2" stroke-width="1.5"/><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M12 7v4m0 4l-5 2m10-2l-5 2"/></svg>

calendar: <svg xmlns="http://www.w3.org/2000/svg" class="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/></svg>

chart-bar: <svg xmlns="http://www.w3.org/2000/svg" class="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"/></svg>
```

- [ ] **Step 1: Update `src/pages/people/roles-and-responsibilities/index.astro`** (in place — same slug)

```astro
---
import BaseLayout from '../../../layouts/BaseLayout.astro';
import { getChapters, getTopics, getChapterUrl } from '../../../lib/chapters';

const chapters = getChapters('people').filter(c => c.module === 'roles-and-responsibilities');
const allTopics = getTopics();

const iconMap: Record<string, string> = {
  users:     `<svg xmlns="http://www.w3.org/2000/svg" class="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M17 20h5v-2a4 4 0 00-5-3.87M9 20H4v-2a4 4 0 015-3.87m6-4.13a4 4 0 10-8 0 4 4 0 008 0zm6 0a3 3 0 11-6 0 3 3 0 016 0z"/></svg>`,
  user:      `<svg xmlns="http://www.w3.org/2000/svg" class="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/></svg>`,
  network:   `<svg xmlns="http://www.w3.org/2000/svg" class="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor"><circle cx="12" cy="5" r="2" stroke-width="1.5"/><circle cx="5" cy="19" r="2" stroke-width="1.5"/><circle cx="19" cy="19" r="2" stroke-width="1.5"/><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M12 7v4m0 4l-5 2m10-2l-5 2"/></svg>`,
  calendar:  `<svg xmlns="http://www.w3.org/2000/svg" class="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/></svg>`,
  'chart-bar': `<svg xmlns="http://www.w3.org/2000/svg" class="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"/></svg>`,
};
---
<BaseLayout title="Roles &amp; Responsibilities — People">
  <header class="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-4 py-3">
    <div class="flex items-center gap-3">
      <a href={import.meta.env.BASE_URL} title="Home" class="flex h-5 items-center text-gray-500 dark:text-neutral-400 hover:text-gray-900 dark:hover:text-white transition-colors">
        <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"/>
        </svg>
      </a>
      <a href={`${import.meta.env.BASE_URL}people/`} class="flex items-center gap-1.5 text-sm text-gray-500 dark:text-neutral-400 hover:text-gray-900 dark:hover:text-white transition-colors">
        <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"/>
        </svg>
        People
      </a>
    </div>
  </header>

  <div class="relative overflow-hidden pt-12">
    <div class="absolute inset-0 bg-[linear-gradient(to_right,#e5e7eb_1px,transparent_1px),linear-gradient(to_bottom,#e5e7eb_1px,transparent_1px)] dark:bg-[linear-gradient(to_right,#444444_1px,transparent_1px),linear-gradient(to_bottom,#444444_1px,transparent_1px)] bg-[size:64px_64px] opacity-60 dark:opacity-40 pointer-events-none"></div>
    <div class="absolute inset-0 bg-radial-gradient pointer-events-none"></div>

    <div class="relative z-10 px-6 pt-12 pb-12 max-w-3xl mx-auto text-center animate-fade-in">
      <div class="inline-flex items-center gap-2 text-xs font-medium text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-500/10 border border-blue-200 dark:border-blue-500/30 rounded-full px-3 py-1 mb-6">
        <span class="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse"></span>
        People
      </div>
      <h1 class="text-5xl sm:text-6xl font-bold text-gray-900 dark:text-white mb-6 leading-tight tracking-tight">
        <span class="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-blue-600">Roles &amp; Responsibilities</span>
      </h1>
      <p class="text-xl text-gray-600 dark:text-neutral-400 max-w-xl mx-auto leading-relaxed">
        Every planning role explained — what they own, what they do day-to-day, and how they interact across S&amp;OP and S&amp;OE.
      </p>
    </div>

    <div class="relative z-10 px-6 pb-20 max-w-6xl mx-auto">
      <div class="flex flex-col gap-5 max-w-3xl mx-auto">
      {chapters.map((chapter) => {
        const topics = allTopics.filter(t => t.chapterSlug === chapter.slug);
        return chapter.comingSoon ? (
          <div class="relative flex flex-col p-8 rounded-2xl border bg-gray-50 dark:bg-neutral-900/40 border-gray-200 dark:border-neutral-800 opacity-60 cursor-default select-none">
            <span class="text-xs font-mono font-bold text-gray-400 dark:text-neutral-600 mb-4">0{chapter.order}</span>
            <div class="flex items-start gap-4 mb-4">
              <div class="text-gray-400 dark:text-neutral-600 mt-0.5 shrink-0" set:html={iconMap[chapter.icon] ?? iconMap['users']} />
              <div>
                <h3 class="text-lg font-semibold text-gray-500 dark:text-neutral-400 leading-snug">{chapter.title}</h3>
              </div>
            </div>
            <div class="flex items-center mt-auto pt-4 border-t border-gray-100 dark:border-neutral-800">
              <span class="inline-flex items-center gap-1.5 text-xs font-medium text-gray-400 dark:text-neutral-500">
                <svg xmlns="http://www.w3.org/2000/svg" class="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
                Coming soon
              </span>
            </div>
          </div>
        ) : (
          <a href={getChapterUrl(chapter)} class="group relative flex flex-col p-8 rounded-2xl border bg-blue-50 dark:bg-neutral-900 border-blue-200 dark:border-blue-500/30 hover:border-blue-400 dark:hover:border-blue-400 transition-all duration-200 hover:-translate-y-1 hover:shadow-xl">
            <span class="text-xs font-mono font-bold text-blue-600 dark:text-blue-400 mb-4">0{chapter.order}</span>
            <div class="flex items-start gap-4 mb-4">
              <div class="text-blue-600 dark:text-blue-400 mt-0.5 shrink-0" set:html={iconMap[chapter.icon] ?? iconMap['users']} />
              <div>
                <h3 class="text-lg font-semibold text-gray-900 dark:text-white leading-snug">{chapter.title}</h3>
                <p class="text-sm text-gray-500 dark:text-neutral-400 mt-1 leading-relaxed">{chapter.description}</p>
              </div>
            </div>
            <div class="flex items-center justify-between mt-auto pt-4 border-t border-blue-100 dark:border-blue-500/10">
              <span class="text-xs text-gray-400 dark:text-neutral-500">{topics.length} topics</span>
              <div class="flex items-center gap-1 text-xs text-blue-600 dark:text-blue-400 opacity-0 group-hover:opacity-100 transition-opacity">
                Open chapter
                <svg xmlns="http://www.w3.org/2000/svg" class="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/></svg>
              </div>
            </div>
          </a>
        );
      })}
      </div>
    </div>
  </div>
</BaseLayout>

<style>
  .bg-radial-gradient {
    background: radial-gradient(ellipse 80% 50% at 50% -20%, rgba(59,130,246,0.08), transparent);
  }
  :global(.dark) .bg-radial-gradient {
    background: radial-gradient(ellipse 80% 50% at 50% -20%, rgba(59,130,246,0.15), transparent);
  }
</style>
```

- [ ] **Step 2: Create `src/pages/people/decision-making-and-ownership/index.astro`**

Use the same file as Step 1, changing:
- `filter(c => c.module === 'decision-making-and-ownership')`
- `title="Decision Making &amp; Ownership — People"`
- `<span>People</span>` breadcrumb (unchanged)
- `<h1>` gradient text: `Decision Making &amp; Ownership`
- description: `Who owns planning decisions, how they are made, and how conflicts are escalated.`
- `iconMap` default fallback: `iconMap['network']`

- [ ] **Step 3: Create `src/pages/people/collaboration-and-ways-of-working/index.astro`**

Same pattern, changing:
- `filter(c => c.module === 'collaboration-and-ways-of-working')`
- title: `Collaboration &amp; Ways of Working — People`
- h1: `Collaboration &amp; Ways of Working`
- description: `How planning teams collaborate, run effective meetings, and align stakeholders.`

- [ ] **Step 4: Create `src/pages/people/capabilities-and-skills/index.astro`**

Same pattern, changing:
- `filter(c => c.module === 'capabilities-and-skills')`
- title: `Capabilities &amp; Skills — People`
- h1: `Capabilities &amp; Skills`
- description: `The planning capabilities, data literacy, and decision-making skills needed to perform effectively.`

- [ ] **Step 5: Delete old People module pages**

```bash
rm -rf src/pages/people/organisation
rm -rf src/pages/people/implementation-and-change
```

- [ ] **Step 6: Build to verify**

```bash
npm run build
```

Expected: build succeeds. People pillar now resolves all four new module URLs.

- [ ] **Step 7: Commit**

```bash
git add src/pages/people/
git commit -m "feat: replace People module pages with new structure (4 modules)"
```

---

## Task 12: Replace module index pages — Process

**Additional icon SVGs for Process pages:**

```
document-text: <svg xmlns="http://www.w3.org/2000/svg" class="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/></svg>

shield-check: <svg xmlns="http://www.w3.org/2000/svg" class="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"/></svg>

beaker: <svg xmlns="http://www.w3.org/2000/svg" class="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M9 3h6m-6 0v7l-4 9a1 1 0 001 1h12a1 1 0 001-1l-4-9V3"/></svg>

chart-bar: (same as People section above)
calendar: (same as People section above)
```

Create all six new Process module pages following the exact same template as Task 11 Step 1, with the `filter` slug, title, h1, and description changed per module:

- [ ] **Step 1: Create `src/pages/process/planning-fundamentals/index.astro`**
  - filter: `'planning-fundamentals'`
  - title: `Planning Fundamentals — Process`
  - h1: `Planning Fundamentals`
  - desc: `The end-to-end planning flow, horizons, and integrated planning concept that underpins S&amp;OP, S&amp;OE, and Execution.`

- [ ] **Step 2: Create `src/pages/process/planning-cycles-and-governance/index.astro`**
  - filter: `'planning-cycles-and-governance'`
  - title: `Planning Cycles &amp; Governance — Process`
  - h1: `Planning Cycles &amp; Governance`
  - desc: `S&amp;OP, S&amp;OE, planning cadences, meeting structures, and the governance that keeps decisions on track.`

- [ ] **Step 3: Create `src/pages/process/sop/index.astro`**
  - filter: `'sop'`
  - title: `S&amp;OP — Process`
  - h1: `S&amp;OP`
  - desc: `Running the monthly Sales &amp; Operations Planning cycle — demand, supply, inventory, resources, and the executive review.`

- [ ] **Step 4: Create `src/pages/process/soe/index.astro`**
  - filter: `'soe'`
  - title: `S&amp;OE — Process`
  - h1: `S&amp;OE`
  - desc: `Running the weekly Sales &amp; Operations Execution cycle — monitoring, exception management, and near-term plan adjustments.`

- [ ] **Step 5: Create `src/pages/process/execution/index.astro`**
  - filter: `'execution'`
  - title: `Execution — Process`
  - h1: `Execution`
  - desc: `Order management, lot selection, and the daily execution discipline that translates the plan into action.`

- [ ] **Step 6: Create `src/pages/process/advanced-planning/index.astro`**
  - filter: `'advanced-planning'`
  - title: `Advanced Planning — Process`
  - h1: `Advanced Planning`
  - desc: `Scenario planning, exception management, and constraint management — the advanced techniques for handling uncertainty.`

- [ ] **Step 7: Delete old Process module pages**

```bash
rm -rf src/pages/process/process-fundamentals
rm -rf src/pages/process/scenario-planning
rm -rf src/pages/process/sop-process
rm -rf src/pages/process/soe-process
rm -rf src/pages/process/execution-process
```

- [ ] **Step 8: Build to verify**

```bash
npm run build
```

- [ ] **Step 9: Commit**

```bash
git add src/pages/process/
git commit -m "feat: replace Process module pages with new structure (6 modules)"
```

---

## Task 13: Replace module index pages — Data

**Additional icon SVGs for Data pages:**

```
database: <svg xmlns="http://www.w3.org/2000/svg" class="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor"><ellipse cx="12" cy="5" rx="9" ry="3" stroke-width="1.5"/><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M3 5v14c0 1.657 4.03 3 9 3s9-1.343 9-3V5"/><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M3 12c0 1.657 4.03 3 9 3s9-1.343 9-3"/></svg>

server: <svg xmlns="http://www.w3.org/2000/svg" class="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor"><rect x="2" y="3" width="20" height="7" rx="1" stroke-width="1.5"/><rect x="2" y="14" width="20" height="7" rx="1" stroke-width="1.5"/><path stroke-linecap="round" stroke-width="1.5" d="M6 7h.01M6 18h.01"/></svg>
```

Create all six new Data module pages following the same template, with `theme="data"` in the breadcrumb back-link (`${import.meta.env.BASE_URL}data/`), and accent colour `text-yellow-600 dark:text-yellow-400` for the pillar badge — actually, look at the existing `data/data-fundamentals/index.astro` to confirm the colour used and replicate it. Replace `text-blue-*` classes in the badge and card with `text-yellow-*` equivalents if the existing data pages do so; otherwise keep blue if the data pages already use blue.

Check `src/pages/data/data-fundamentals/index.astro` (already read partially above — it uses the same blue scheme as other pages).

- [ ] **Step 1: Create `src/pages/data/data-foundations/index.astro`**
  - filter: `'data-foundations'` on `getChapters('data')`
  - title: `Data Foundations — Data`
  - h1: `Data Foundations`
  - desc: `The fundamentals of planning data — data overview, master data, data structures, and data ownership.`

- [ ] **Step 2: Create `src/pages/data/planning-data-domains/index.astro`**
  - filter: `'planning-data-domains'`
  - title: `Planning Data Domains — Data`
  - h1: `Planning Data Domains`
  - desc: `Forecast, inventory, capacity, supply, and lifecycle data — the domains that feed the planning model.`

- [ ] **Step 3: Create `src/pages/data/planning-parameters-and-assumptions/index.astro`**
  - filter: `'planning-parameters-and-assumptions'`
  - title: `Planning Parameters &amp; Assumptions — Data`
  - h1: `Planning Parameters &amp; Assumptions`
  - desc: `The parameters and assumptions that shape how the plan is calculated — from lead times to business rules.`

- [ ] **Step 4: Create `src/pages/data/signals-and-insights/index.astro`**
  - filter: `'signals-and-insights'`
  - title: `Signals &amp; Insights — Data`
  - h1: `Signals &amp; Insights`
  - desc: `Demand, supply, inventory, capacity, and exception signals — the data that drives planning decisions.`

- [ ] **Step 5: Create `src/pages/data/performance-and-measurement/index.astro`**
  - filter: `'performance-and-measurement'`
  - title: `Performance &amp; Measurement — Data`
  - h1: `Performance &amp; Measurement`
  - desc: `KPI definitions, interpretation, root-cause analysis, and dashboards — how to measure and improve planning performance.`

- [ ] **Step 6: Create `src/pages/data/data-quality-and-governance/index.astro`**
  - filter: `'data-quality-and-governance'`
  - title: `Data Quality &amp; Governance — Data`
  - h1: `Data Quality &amp; Governance`
  - desc: `Data quality management, common issues, validation routines, and the impact of poor data on planning.`

- [ ] **Step 7: Delete old Data module pages**

```bash
rm -rf src/pages/data/data-fundamentals
rm -rf src/pages/data/data-driven-planning
rm -rf src/pages/data/data-governance
```

- [ ] **Step 8: Build to verify**

```bash
npm run build
```

- [ ] **Step 9: Commit**

```bash
git add src/pages/data/
git commit -m "feat: replace Data module pages with new structure (6 modules)"
```

---

## Task 14: Replace Technology module pages

**Additional icon SVGs for Technology pages:**

```
cube: <svg xmlns="http://www.w3.org/2000/svg" class="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M20 7l-8-4-8 4m16 0v10l-8 4M4 7v10l8 4"/></svg>
```

- [ ] **Step 1: Create `src/pages/technology/tool-landscape/index.astro`**

Use the same module index page template, with:
- `getChapters('technology').filter(c => c.module === 'tool-landscape')`
- title: `Tool Landscape &amp; Architecture — Technology`
- breadcrumb back: `${import.meta.env.BASE_URL}technology/`
- h1: `Tool Landscape &amp; Architecture`
- desc: `An overview of the planning technology stack — the tools, their roles, and how data flows between them.`

- [ ] **Step 2: Create `src/pages/technology/adoption-and-usage-quality/index.astro`**

- `getChapters('technology').filter(c => c.module === 'adoption-and-usage-quality')`
- title: `Adoption &amp; Usage Quality — Technology`
- h1: `Adoption &amp; Usage Quality`
- desc: `Best practices, common mistakes, role-based tool usage, and troubleshooting for planning tools.`

- [ ] **Step 3: Delete the old `architecture` module page**

```bash
rm -rf src/pages/technology/architecture
```

- [ ] **Step 4: Build to verify**

```bash
npm run build
```

- [ ] **Step 5: Commit**

```bash
git add src/pages/technology/
git commit -m "feat: add Technology tool-landscape and adoption-and-usage-quality module pages; remove architecture"
```

---

## Task 15: Update pillar index pages

**Files:**
- Modify: `src/pages/people/index.astro`
- Modify: `src/pages/process/index.astro`
- Modify: `src/pages/data/index.astro`
- Modify: `src/pages/technology/index.astro`

- [ ] **Step 1: Rewrite `src/pages/people/index.astro`**

Replace the entire frontmatter variables and the grid of module cards. The 4 new People modules:

```astro
---
import BaseLayout from '../../layouts/BaseLayout.astro';
import { getChapters } from '../../lib/chapters';

const allPeopleChapters = getChapters('people').filter(c => !c.hidden);
const rolesCount         = allPeopleChapters.filter(c => c.module === 'roles-and-responsibilities' && !c.comingSoon).length;
const decisionCount      = allPeopleChapters.filter(c => c.module === 'decision-making-and-ownership' && !c.comingSoon).length;
const collaborationCount = allPeopleChapters.filter(c => c.module === 'collaboration-and-ways-of-working' && !c.comingSoon).length;
const capabilitiesCount  = allPeopleChapters.filter(c => c.module === 'capabilities-and-skills' && !c.comingSoon).length;
---
```

Replace the grid section (inside `.grid`) with:

```astro
<!-- Roles & Responsibilities -->
<a href={`${import.meta.env.BASE_URL}people/roles-and-responsibilities`} class="group track-card track-org-roles">
  <div class="track-icon">
    <svg xmlns="http://www.w3.org/2000/svg" class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M17 20h5v-2a4 4 0 00-5-3.87M9 20H4v-2a4 4 0 015-3.87m6-4.13a4 4 0 10-8 0 4 4 0 008 0zm6 0a3 3 0 11-6 0 3 3 0 016 0z"/>
    </svg>
  </div>
  <h2 class="track-title">Roles &amp; Responsibilities</h2>
  <p class="track-desc">Every planning role explained — what they own, what they do day-to-day, and how they interact across S&amp;OP and S&amp;OE.</p>
  <span class="track-badge track-badge-live">
    <span class="live-dot"></span>
    {rolesCount} chapters available
  </span>
</a>

<!-- Decision Making & Ownership -->
<a href={`${import.meta.env.BASE_URL}people/decision-making-and-ownership`} class="group track-card track-org-roles">
  <div class="track-icon">
    <svg xmlns="http://www.w3.org/2000/svg" class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"/>
    </svg>
  </div>
  <h2 class="track-title">Decision Making &amp; Ownership</h2>
  <p class="track-desc">Who owns planning decisions, how they are made, and how conflicts and exceptions are escalated.</p>
  {decisionCount > 0 ? (
    <span class="track-badge track-badge-live"><span class="live-dot"></span>{decisionCount} chapters available</span>
  ) : (
    <span class="track-badge track-badge-soon">
      <svg xmlns="http://www.w3.org/2000/svg" class="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
      Content coming soon
    </span>
  )}
</a>

<!-- Collaboration & Ways of Working -->
<a href={`${import.meta.env.BASE_URL}people/collaboration-and-ways-of-working`} class="group track-card track-org-roles">
  <div class="track-icon">
    <svg xmlns="http://www.w3.org/2000/svg" class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/>
    </svg>
  </div>
  <h2 class="track-title">Collaboration &amp; Ways of Working</h2>
  <p class="track-desc">How planning teams collaborate, run effective meetings, and align stakeholders across functions.</p>
  {collaborationCount > 0 ? (
    <span class="track-badge track-badge-live"><span class="live-dot"></span>{collaborationCount} chapters available</span>
  ) : (
    <span class="track-badge track-badge-soon">
      <svg xmlns="http://www.w3.org/2000/svg" class="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
      Content coming soon
    </span>
  )}
</a>

<!-- Capabilities & Skills -->
<a href={`${import.meta.env.BASE_URL}people/capabilities-and-skills`} class="group track-card track-org-roles">
  <div class="track-icon">
    <svg xmlns="http://www.w3.org/2000/svg" class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"/>
    </svg>
  </div>
  <h2 class="track-title">Capabilities &amp; Skills</h2>
  <p class="track-desc">The planning capabilities, data literacy, and decision-making skills needed at each level of the organisation.</p>
  {capabilitiesCount > 0 ? (
    <span class="track-badge track-badge-live"><span class="live-dot"></span>{capabilitiesCount} chapters available</span>
  ) : (
    <span class="track-badge track-badge-soon">
      <svg xmlns="http://www.w3.org/2000/svg" class="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
      Content coming soon
    </span>
  )}
</a>
```

Keep all `<style>` content from the existing file unchanged.

- [ ] **Step 2: Rewrite `src/pages/process/index.astro`**

Replace the frontmatter count variables:
```astro
const allProcessChapters = getChapters('process').filter(c => !c.hidden);
const fundamentalsCount  = allProcessChapters.filter(c => c.module === 'planning-fundamentals' && !c.comingSoon).length;
const cyclesCount        = allProcessChapters.filter(c => c.module === 'planning-cycles-and-governance' && !c.comingSoon).length;
const sopCount           = allProcessChapters.filter(c => c.module === 'sop' && !c.comingSoon).length;
const soeCount           = allProcessChapters.filter(c => c.module === 'soe' && !c.comingSoon).length;
const executionCount     = allProcessChapters.filter(c => c.module === 'execution' && !c.comingSoon).length;
const advancedCount      = allProcessChapters.filter(c => c.module === 'advanced-planning' && !c.comingSoon).length;
```

Replace the grid with 6 module cards (same `track-card track-process` classes as current file):
- `planning-fundamentals` → title "Planning Fundamentals", href `process/planning-fundamentals`, desc "The end-to-end planning flow, horizons, and integrated concept — the foundation before diving into cycles."
- `planning-cycles-and-governance` → title "Planning Cycles &amp; Governance", desc "S&amp;OP, S&amp;OE, cadences, meeting structure, and the governance that keeps decisions on track."
- `sop` → title "S&amp;OP", desc "Running the monthly Sales &amp; Operations Planning cycle — demand, supply, inventory, and the executive review."
- `soe` → title "S&amp;OE", desc "Running the weekly S&amp;OE cycle — near-term monitoring, exception management, and plan adjustments."
- `execution` → title "Execution", desc "Order management, lot selection, and the daily discipline that turns the plan into action."
- `advanced-planning` → title "Advanced Planning", desc "Scenario planning, exception management, and constraint management for complex planning situations."

Each card uses the same count/badge pattern: `{count > 0 ? <live badge> : <coming soon badge>}`.

- [ ] **Step 3: Rewrite `src/pages/data/index.astro`**

Replace frontmatter to count chapters for the 6 new data modules. Replace the module card grid with 6 cards pointing to the new data module slugs and using the same badge pattern. Refer to the existing `data/index.astro` for the colour scheme and `track-data` CSS class.

- [ ] **Step 4: Rewrite `src/pages/technology/index.astro`**

Keep existing cards for `planning-software`, `erp`, `fms`, `mdm`. Replace the `architecture` card with `tool-landscape`. Add a new `adoption-and-usage-quality` card. Remove the `reporting` card if it appears (it is not in the new structure).

Update frontmatter counts:
```astro
const toolLandscapeCount        = chapters.filter(c => !c.hidden && c.module === 'tool-landscape' && !c.comingSoon).length;
const planningSwCount           = chapters.filter(c => !c.hidden && c.module === 'planning-software' && !c.comingSoon).length;
const erpCount                  = chapters.filter(c => !c.hidden && c.module === 'erp' && !c.comingSoon).length;
const fmsCount                  = chapters.filter(c => !c.hidden && c.module === 'fms' && !c.comingSoon).length;
const mdmCount                  = chapters.filter(c => !c.hidden && c.module === 'mdm' && !c.comingSoon).length;
const adoptionCount             = chapters.filter(c => !c.hidden && c.module === 'adoption-and-usage-quality' && !c.comingSoon).length;
```

- [ ] **Step 5: Build to verify**

```bash
npm run build
```

Expected: clean build.

- [ ] **Step 6: Commit**

```bash
git add src/pages/people/index.astro src/pages/process/index.astro \
        src/pages/data/index.astro src/pages/technology/index.astro
git commit -m "feat: update pillar index pages with new module structure"
```

---

## Task 16: Final verification

- [ ] **Step 1: Full build**

```bash
npm run build
```

Expected: zero errors. Pagefind indexes all non-comingSoon topic content.

- [ ] **Step 2: Spot-check generated URLs**

Check that these URLs exist in `dist/`:
- `dist/TheNewEraOfPlanning/people/roles-and-responsibilities/demand-planner/index.html` — should render "Coming soon"
- `dist/TheNewEraOfPlanning/people/decision-making-and-ownership/people-02-accountability/index.html` — should render topic list
- `dist/TheNewEraOfPlanning/process/planning-fundamentals/process-03-operating-model/index.html` — should render topic list
- `dist/TheNewEraOfPlanning/data/performance-and-measurement/process-06-kpis/index.html` — should render topic list (cross-pillar move)
- `dist/TheNewEraOfPlanning/technology/tool-landscape/arch-01-end-to-end/index.html` — should render topic list

```bash
ls dist/TheNewEraOfPlanning/people/roles-and-responsibilities/demand-planner/
ls dist/TheNewEraOfPlanning/data/performance-and-measurement/process-06-kpis/
ls dist/TheNewEraOfPlanning/technology/tool-landscape/arch-01-end-to-end/
```

Expected: `index.html` present in each.

- [ ] **Step 3: Final commit**

```bash
git add -A
git commit -m "chore: complete site structure reorganisation — all pillars restructured"
```
