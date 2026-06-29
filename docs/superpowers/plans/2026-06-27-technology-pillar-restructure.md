# Technology Pillar Restructure — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Restructure the Technology pillar from 36 chapters across 6 modules to 28 chapters across 5 modules — dissolving FMS/MDM into Supporting Systems, merging arch chapters, distributing adoption content, and removing the Config Manual chapter.

**Architecture:** Five parallel tracks plus one post-parallel step. Tracks A (Tasks A-1 through A-4), B, C, D, E run simultaneously — each modifies a distinct set of files with no overlap. Task A-5 (role file updates) runs AFTER Tracks B and C complete, because it references `arch-how-systems-connect` and `planning-logic` which don't exist until those tracks finish. Final verification runs after all tracks and A-5 complete.

**Tech Stack:** Astro 4, MDX/Markdown frontmatter, JSON config files. No tests exist — verification is `npm run build` (must pass with 0 errors).

## Global Constraints

- Verification command: `npm run build` — must complete with 0 errors after every track
- Content repo root: `src/content/chapters/` — each chapter is a folder with `_meta.json` + topic `.md` files
- `_meta.json` fields: `title`, `description`, `icon`, `color`, `theme`, `module` — required. `hidden: true` and `comingSoon: true` — optional
- `theme` must always be `"technology"` for all chapters in this pillar
- Topic `.md` frontmatter has a `chapter` field that must match the chapter folder name
- `order.json` is the authoritative source for module membership and ordering — the `module` field in `_meta.json` must match what order.json uses
- Never hardcode `/` as root prefix — use `import.meta.env.BASE_URL`
- All Tailwind color classes must appear as complete strings — no string interpolation
- Worktree is at: `/Users/stefanbakker/Documents/AI/Github/Development/.claude/worktrees/Review+review-technology-pillar/`

---

## Track A: Infrastructure

**Files modified:**
- Modify: `src/content/order.json`
- Modify: `src/pages/technology/index.astro`
- Create: `src/pages/technology/supporting-systems/index.astro`
- Delete: `src/pages/technology/fms/index.astro`
- Delete: `src/pages/technology/mdm/index.astro`
- Delete: `src/pages/technology/adoption-and-usage-quality/index.astro`
- Modify: `src/pages/[theme]/[module]/[chapter]/index.astro` (lines 53–60)
- Modify: `src/components/SiteOverlay.astro` (lines 18–25)
- Modify: `src/content/roles/strategic-planner.json`
- Modify: `src/content/roles/tactical-planner.json`
- Modify: `src/content/roles/operational-planner.json`

### Task A-1: Update order.json

- [ ] **Step 1: Open `src/content/order.json` and replace the entire `"technology"` entry in `"modules"` (line ~9)**

Replace:
```json
"technology": ["tool-landscape", "planning-software", "erp", "fms", "mdm", "adoption-and-usage-quality"]
```
With:
```json
"technology": ["tool-landscape", "planning-software", "erp", "supporting-systems"]
```

- [ ] **Step 2: Replace the chapter lists for technology modules in `"chapters"`**

Replace the six technology module chapter arrays:
```json
"tool-landscape":                      ["tool-landscape-overview", "system-roles", "arch-01-end-to-end", "arch-02-integration"],
"planning-software":                   ["01-understanding-basics", "02-the-network", "03-data-flow", "03-the-logic", "04-the-simulation", "05-navigation-and-ui", "08-configuration-manual", "99-layout-showcase"],
"erp":                                 ["erp-01-erp-basics", "erp-02-the-data-model", "erp-03-data-flow-into-erp", "erp-04-data-flow-out-of-erp", "erp-05-the-logic", "erp-06-key-erp-workflows", "erp-07-navigation-and-ui"],
"fms":                                 ["fms-01-understanding-basics", "fms-02-the-data-model", "fms-03-data-flow-into-fms", "fms-04-data-flow-out-of-fms", "fms-05-the-logic", "fms-06-key-fms-workflows", "fms-07-navigation-and-ui"],
"mdm":                                 ["mdm-01-understanding-basics", "mdm-02-the-data-model", "mdm-03-data-flow-into-mdm", "mdm-04-data-flow-out-of-mdm", "mdm-05-the-logic", "mdm-06-key-mdm-workflows", "mdm-07-navigation-and-ui"],
"adoption-and-usage-quality":          ["common-tool-mistakes", "best-practices", "tool-usage-by-role", "faq-and-troubleshooting"]
```
With:
```json
"tool-landscape":     ["tool-landscape-overview", "system-roles", "arch-how-systems-connect", "tool-usage-by-role"],
"planning-software":  ["01-understanding-basics", "02-the-network", "03-data-flow", "planning-logic", "04-the-simulation", "05-navigation-and-ui", "planning-software-best-practices", "99-layout-showcase"],
"erp":                ["erp-01-erp-basics", "erp-02-the-data-model", "erp-03-data-flow-into-erp", "erp-04-data-flow-out-of-erp", "erp-05-the-logic", "erp-06-key-erp-workflows", "erp-07-navigation-and-ui", "erp-best-practices"],
"supporting-systems": ["fms-01-understanding-basics", "fms-02-the-data-model", "fms-04-data-flow-out-of-fms", "fms-logic-and-workflows", "mdm-01-understanding-basics", "mdm-02-the-data-model", "mdm-04-data-flow-out-of-mdm", "mdm-logic-and-workflows", "supporting-systems-best-practices"]
```

- [ ] **Step 3: Update the `"topics"` key for renamed chapter `03-the-logic` → `planning-logic`**

Find the key `"03-the-logic"` in the `"topics"` section and rename it to `"planning-logic"`. The value stays the same:
```json
"planning-logic": [
  "disaggregation-variety-to-item", "disaggregation-year-to-month", "backward-consumption",
  "scheduled-receipt", "push", "pull", "safety-stock", "demand-slicing"
],
```

- [ ] **Step 4: Add topic entries for new chapters in the `"topics"` section**

Add these entries (key order doesn't matter):
```json
"arch-how-systems-connect": ["interfaces", "batchrun", "data-upload", "erp-planning-software-integration", "planning-software-fms-mdm"],
"planning-software-best-practices": [],
"erp-best-practices": [],
"fms-logic-and-workflows": ["fms-business-rules", "field-assignment-logic", "yield-and-activity-tracking", "managing-field-activities", "recording-actuals", "reporting-and-extraction"],
"mdm-logic-and-workflows": ["mdm-governance-rules", "data-matching-and-deduplication", "approval-workflows", "creating-and-maintaining-records", "managing-data-changes", "auditing-and-reporting"],
"supporting-systems-best-practices": []
```

- [ ] **Step 5: Run build to verify order.json parses correctly**

```bash
npm run build 2>&1 | grep -E "error|Error|warn" | head -20
```
Expected: 0 errors (warnings about comingSoon chapters are fine).

- [ ] **Step 6: Commit**

```bash
git add src/content/order.json
git commit -m "feat(tech): update order.json — add supporting-systems module, rename planning-logic"
```

---

### Task A-2: Update technology pillar index page

- [ ] **Step 1: Open `src/pages/technology/index.astro` and replace the frontmatter variable block (lines 5–11)**

Replace:
```astro
const toolLandscapeCount = chapters.filter(c => !c.hidden && c.module === 'tool-landscape' && !c.comingSoon).length;
const planningSwCount    = chapters.filter(c => !c.hidden && c.module === 'planning-software' && !c.comingSoon).length;
const erpCount           = chapters.filter(c => !c.hidden && c.module === 'erp' && !c.comingSoon).length;
const fmsCount           = chapters.filter(c => !c.hidden && c.module === 'fms' && !c.comingSoon).length;
const mdmCount           = chapters.filter(c => !c.hidden && c.module === 'mdm' && !c.comingSoon).length;
const adoptionCount      = chapters.filter(c => !c.hidden && c.module === 'adoption-and-usage-quality' && !c.comingSoon).length;
```
With:
```astro
const toolLandscapeCount    = chapters.filter(c => !c.hidden && c.module === 'tool-landscape' && !c.comingSoon).length;
const planningSwCount       = chapters.filter(c => !c.hidden && c.module === 'planning-software' && !c.comingSoon).length;
const erpCount              = chapters.filter(c => !c.hidden && c.module === 'erp' && !c.comingSoon).length;
const supportingSystemCount = chapters.filter(c => !c.hidden && c.module === 'supporting-systems' && !c.comingSoon).length;
```

- [ ] **Step 2: Replace the FMS card, MDM card, and Adoption card with a single Supporting Systems card**

Find the block starting with `<!-- FMS -->` and ending just before the closing `</div>` of the grid (after the Adoption card). Replace those three cards with:
```astro
<!-- Supporting Systems -->
<a href={`${import.meta.env.BASE_URL}technology/supporting-systems`} class="group track-card track-fms">
  <div class="track-icon">
    <svg xmlns="http://www.w3.org/2000/svg" class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M4 7v10c0 1.1.9 2 2 2h12a2 2 0 002-2V7M4 7c0-1.1.9-2 2-2h12a2 2 0 012 2M4 7h16M8 11h8M8 15h5"/>
    </svg>
  </div>
  <h2 class="track-title">Supporting Systems</h2>
  <p class="track-desc">FMS and MDM — the field management and master data systems that supply the planning model with field signals and item master data.</p>
  {supportingSystemCount > 0 ? (
    <span class="track-badge track-badge-live"><span class="live-dot"></span>{supportingSystemCount} chapters available</span>
  ) : (
    <span class="track-badge track-badge-soon">
      <svg xmlns="http://www.w3.org/2000/svg" class="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
      Content coming soon
    </span>
  )}
</a>
```

- [ ] **Step 3: Commit**

```bash
git add src/pages/technology/index.astro
git commit -m "feat(tech): replace FMS/MDM/Adoption cards with Supporting Systems on pillar index"
```

---

### Task A-3: Create supporting-systems module page

- [ ] **Step 1: Create `src/pages/technology/supporting-systems/index.astro`**

```astro
---
import BaseLayout from '../../../layouts/BaseLayout.astro';
import { getChapters, getTopics } from '../../../lib/chapters';

const chapters = getChapters('technology').filter(ch => ch.module === 'supporting-systems');
const allTopics = getTopics();

const colorBgMap: Record<string, string> = {
  sky:    'bg-blue-50 dark:bg-neutral-900 border-blue-200 dark:border-blue-500/30 hover:border-blue-400 dark:hover:border-blue-400',
  emerald:'bg-blue-50 dark:bg-neutral-900 border-blue-200 dark:border-blue-500/30 hover:border-blue-400 dark:hover:border-blue-400',
  indigo: 'bg-blue-50 dark:bg-neutral-900 border-blue-200 dark:border-blue-500/30 hover:border-blue-400 dark:hover:border-blue-400',
  violet: 'bg-blue-50 dark:bg-neutral-900 border-blue-200 dark:border-blue-500/30 hover:border-blue-400 dark:hover:border-blue-400',
};
const colorTextMap: Record<string, string> = {
  sky:    'text-blue-600 dark:text-blue-400',
  emerald:'text-blue-600 dark:text-blue-400',
  indigo: 'text-blue-600 dark:text-blue-400',
  violet: 'text-blue-600 dark:text-blue-400',
};
---
<BaseLayout title="Supporting Systems — Technology">
  <header class="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-4 py-3">
    <div class="flex items-center gap-3">
      <a href={import.meta.env.BASE_URL} title="Home" class="flex h-5 items-center text-gray-500 dark:text-neutral-400 hover:text-gray-900 dark:hover:text-white transition-colors">
        <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"/>
        </svg>
      </a>
      <a href={`${import.meta.env.BASE_URL}technology`} class="flex items-center gap-1.5 text-sm text-gray-500 dark:text-neutral-400 hover:text-gray-900 dark:hover:text-white transition-colors">
        <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"/>
        </svg>
        Technology
      </a>
    </div>
  </header>

  <div class="relative overflow-hidden pt-12">
    <div class="absolute inset-0 bg-[linear-gradient(to_right,#e5e7eb_1px,transparent_1px),linear-gradient(to_bottom,#e5e7eb_1px,transparent_1px)] dark:bg-[linear-gradient(to_right,#444444_1px,transparent_1px),linear-gradient(to_bottom,#444444_1px,transparent_1px)] bg-[size:64px_64px] opacity-60 dark:opacity-40 pointer-events-none"></div>
    <div class="absolute inset-0 bg-radial-gradient pointer-events-none"></div>

    <div class="relative z-10 px-6 pt-12 pb-12 max-w-3xl mx-auto text-center animate-fade-in">
      <div class="inline-flex items-center gap-2 text-xs font-medium text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-500/10 border border-blue-200 dark:border-blue-500/30 rounded-full px-3 py-1 mb-6">
        <span class="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse"></span>
        Technology · Supporting Systems
      </div>
      <h1 class="text-5xl sm:text-6xl font-bold text-gray-900 dark:text-white mb-6 leading-tight tracking-tight">
        <span class="text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-blue-500">Supporting Systems</span>
      </h1>
      <p class="text-xl text-gray-600 dark:text-neutral-400 max-w-xl mx-auto leading-relaxed">
        FMS and MDM — the field management and master data systems that supply Planning software with field signals and item master data.
      </p>
    </div>

    <div class="relative z-10 px-6 pb-20 max-w-6xl mx-auto">
      <div class="flex flex-col gap-5 max-w-3xl mx-auto">
      {chapters.map((chapter) => {
        const topics = allTopics.filter(t => t.chapterSlug === chapter.slug);
        const bgClass = colorBgMap[chapter.color] ?? 'bg-blue-50 dark:bg-neutral-900 border-blue-200 dark:border-blue-500/30';
        const textClass = colorTextMap[chapter.color] ?? 'text-blue-600 dark:text-blue-400';
        return (
          <a
            href={`${import.meta.env.BASE_URL}technology/supporting-systems/${chapter.slug}`}
            class={`group relative flex flex-col p-8 rounded-2xl border ${bgClass} bg-white dark:bg-neutral-900 transition-all duration-200 hover:-translate-y-1 hover:shadow-xl dark:hover:shadow-2xl`}
          >
            <span class={`text-xs font-mono font-bold ${textClass} mb-4`}>0{chapter.order}</span>
            <div>
              <h3 class="text-lg font-semibold text-gray-900 dark:text-white leading-snug">{chapter.title}</h3>
              <p class="text-sm text-gray-500 dark:text-neutral-400 mt-1 leading-relaxed">{chapter.description}</p>
            </div>
            <div class="flex items-center justify-between mt-4 pt-4 border-t border-gray-100 dark:border-white/5">
              <span class="text-xs text-gray-400 dark:text-neutral-500">{topics.length} topics</span>
              <div class={`flex items-center gap-1 text-xs ${textClass} opacity-0 group-hover:opacity-100 transition-opacity`}>
                Open chapter
                <svg xmlns="http://www.w3.org/2000/svg" class="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/>
                </svg>
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

- [ ] **Step 2: Remove old module pages that are now dead ends**

```bash
rm src/pages/technology/fms/index.astro
rm src/pages/technology/mdm/index.astro
rm src/pages/technology/adoption-and-usage-quality/index.astro
rmdir src/pages/technology/fms src/pages/technology/mdm src/pages/technology/adoption-and-usage-quality 2>/dev/null || true
```

- [ ] **Step 3: Commit**

```bash
git add src/pages/technology/supporting-systems/index.astro
git add -u src/pages/technology/
git commit -m "feat(tech): add supporting-systems module page, remove dissolved module pages"
```

---

### Task A-4: Update moduleBackMap and moduleLabels

- [ ] **Step 1: Open `src/pages/[theme]/[module]/[chapter]/index.astro` and update the `moduleBackMap` (lines 53–60)**

Replace:
```typescript
'fms':                                { href: `${BASE_URL}technology/fms`,                                label: 'Farm Management System' },
'mdm':                                { href: `${BASE_URL}technology/mdm`,                                label: 'MDM' },
'adoption-and-usage-quality':         { href: `${BASE_URL}technology/adoption-and-usage-quality`,         label: 'Adoption & Usage Quality' },
```
With:
```typescript
'supporting-systems':                 { href: `${BASE_URL}technology/supporting-systems`,                 label: 'Supporting Systems' },
```

- [ ] **Step 2: Open `src/components/SiteOverlay.astro` and update `moduleLabels` (lines 18–25)**

Replace:
```typescript
'fms':                                 'Farm Management System',
'mdm':                                 'MDM',
'adoption-and-usage-quality':          'Adoption & Usage Quality',
```
With:
```typescript
'supporting-systems':                  'Supporting Systems',
```

- [ ] **Step 3: Commit**

```bash
git add src/pages/\[theme\]/\[module\]/\[chapter\]/index.astro src/components/SiteOverlay.astro
git commit -m "feat(tech): update moduleBackMap and moduleLabels for supporting-systems"
```

---

### Task A-5: Update role files

Three role files reference chapters being renamed or hidden. Replace `03-the-logic` → `planning-logic` and `arch-01-end-to-end`/`arch-02-integration` → `arch-how-systems-connect` in each.

- [ ] **Step 1: Update `src/content/roles/strategic-planner.json`**

In the `conceptual` phase `chapters` array, apply these replacements:
- `"03-the-logic"` → `"planning-logic"`
- `"arch-01-end-to-end"` → `"arch-how-systems-connect"`

The conceptual chapters array becomes:
```json
"chapters": [
  "sop-01-sop-fundamentals",
  "process-01-scenario-planning-fundamentals",
  "people-02-accountability",
  "01-understanding-basics",
  "02-the-network",
  "03-data-flow",
  "planning-logic",
  "data-03-data-types",
  "data-02-data-quality-and-impact",
  "data-05-data-sources-and-model",
  "erp-02-the-data-model",
  "erp-04-data-flow-out-of-erp",
  "arch-how-systems-connect"
]
```

- [ ] **Step 2: Update `src/content/roles/tactical-planner.json`**

In the `conceptual` phase `chapters` array:
- `"03-the-logic"` → `"planning-logic"`
- `"arch-01-end-to-end"` → `"arch-how-systems-connect"`

The conceptual chapters array becomes:
```json
"chapters": [
  "soe-01-soe-fundamentals",
  "sop-01-sop-fundamentals",
  "01-understanding-basics",
  "02-the-network",
  "03-data-flow",
  "planning-logic",
  "erp-02-the-data-model",
  "erp-03-data-flow-into-erp",
  "erp-04-data-flow-out-of-erp",
  "people-02-accountability",
  "data-03-data-types",
  "data-02-data-quality-and-impact",
  "arch-how-systems-connect"
]
```

In the `embedded` phase `chapters` array:
- `"arch-02-integration"` → `"arch-how-systems-connect"` (already added in conceptual, so remove from embedded to avoid duplicate)

The embedded chapters array becomes:
```json
"chapters": [
  "process-04-planning-policy",
  "process-05-governance-and-escalation",
  "process-06-kpis",
  "data-04-data-governance"
]
```

- [ ] **Step 3: Update `src/content/roles/operational-planner.json`**

In the `conceptual` phase `chapters` array:
- `"arch-01-end-to-end"` → `"arch-how-systems-connect"`

The conceptual chapters array becomes:
```json
"chapters": [
  "exec-01-execution-fundamentals",
  "soe-01-soe-fundamentals",
  "erp-02-the-data-model",
  "erp-03-data-flow-into-erp",
  "erp-04-data-flow-out-of-erp",
  "data-03-data-types",
  "data-02-data-quality-and-impact",
  "arch-how-systems-connect"
]
```

In the `embedded` phase `chapters` array:
- `"arch-02-integration"` → remove (already covered by `arch-how-systems-connect` in conceptual)

The embedded chapters array becomes:
```json
"chapters": [
  "process-04-planning-policy",
  "process-05-governance-and-escalation",
  "process-06-kpis",
  "data-04-data-governance"
]
```

- [ ] **Step 4: Verify build passes (roles validation runs at build time)**

```bash
npm run build 2>&1 | grep -E "error|Error" | head -20
```
Expected: 0 errors.

- [ ] **Step 5: Commit**

```bash
git add src/content/roles/strategic-planner.json src/content/roles/tactical-planner.json src/content/roles/operational-planner.json
git commit -m "feat(tech): update role chapter references — planning-logic, arch-how-systems-connect"
```

---

## Track B: Tool Landscape

**Files created/modified:**
- Create: `src/content/chapters/arch-how-systems-connect/_meta.json`
- Create: `src/content/chapters/arch-how-systems-connect/interfaces.md`
- Create: `src/content/chapters/arch-how-systems-connect/batchrun.md`
- Create: `src/content/chapters/arch-how-systems-connect/data-upload.md`
- Create: `src/content/chapters/arch-how-systems-connect/erp-planning-software-integration.md`
- Create: `src/content/chapters/arch-how-systems-connect/planning-software-fms-mdm.md`
- Modify: `src/content/chapters/arch-01-end-to-end/_meta.json` (add `hidden: true`)
- Modify: `src/content/chapters/arch-02-integration/_meta.json` (add `hidden: true`)
- Modify: `src/content/chapters/tool-usage-by-role/_meta.json` (change module)

### Task B-1: Create arch-how-systems-connect chapter

- [ ] **Step 1: Create `src/content/chapters/arch-how-systems-connect/_meta.json`**

```json
{
  "title": "How the Systems Connect",
  "description": "How ERP, Planning software, FMS, and MDM connect — the interfaces, batch runs, data uploads, and integration patterns that keep the four-system landscape in sync.",
  "icon": "switch-horizontal",
  "color": "emerald",
  "theme": "technology",
  "module": "tool-landscape"
}
```

- [ ] **Step 2: Create `src/content/chapters/arch-how-systems-connect/interfaces.md`**

Copy content from `arch-01-end-to-end/interfaces.md` but update the `chapter` frontmatter field:

```markdown
---
title: "System Interfaces Overview"
description: "The four systems in the landscape — ERP, Planning software, FMS, and MDM system — are connected by a set of defined interfaces. Understanding what flows where is the foundation for troubleshooting and governance."
chapter: "arch-how-systems-connect"
estimatedMinutes: 5
topicLayout: "prose-topic"
---

## The four-system landscape

The planning technology landscape consists of four systems, each with a distinct role:

| System | Role |
|---|---|
| **Planning software** | Planning engine — demand signals, supply plan, scenario simulation |
| **ERP** | ERP — transactional execution, purchase orders, production orders, inventory posting |
| **MDM system** | Master Data Management (MDM) — product master, item attributes, hierarchy management |
| **FMS** | Field Management System (FMS) — grower contracts, field activity, crop forecasting |

No single system has the full picture. The planning capability of Planning software depends on accurate master data from MDM system, transactional actuals from ERP, and field-level supply signals from FMS. The interfaces between these systems are what make the integrated landscape function.

## Interface directions

Each interface carries data in a defined direction:

**MDM system → Planning software** — product master data: item codes, descriptions, BOMs, BODs, planning parameters. MDM system is the single source of truth for master data; Planning software receives it rather than maintaining its own copy.

**FMS → Planning software** — field supply signals: grower contracts, planted area, expected harvest quantities and timing. These become supply-side demand signals in the Planning software planning model.

**ERP → Planning software** — transactional actuals: open purchase orders, production order completions, inventory positions, goods receipts. Planning software uses these to reconcile its planned view against what has actually happened.

**Planning software → ERP** — planned orders for execution: purchase order proposals, production order proposals. These are reviewed by planners and released as actual orders in ERP.

**MDM system → ERP** — item master synchronisation: ensuring ERP's item cards reflect the same attributes and hierarchy as MDM system.

## Integration middleware

Direct system-to-system connections in a four-system landscape create a maintenance burden. Most implementations use a middleware layer — an integration platform (iPaaS) or custom API hub — that sits between the systems and manages the data flows. This middleware handles:
- Message routing and transformation
- Error handling and retry logic
- Logging and monitoring of interface health
- Schema mapping between source and target formats

Understanding the middleware layer is important for troubleshooting: when data does not arrive in Planning software as expected, the issue may be in the source system, the middleware, or the target system configuration.

## Interface frequency

Not all interfaces run at the same frequency:

| Interface | Typical frequency |
|---|---|
| MDM system → Planning software (master data) | Daily or on change |
| FMS → Planning software (field signals) | Weekly or daily |
| ERP → Planning software (transactional actuals) | Daily (overnight) |
| Planning software → ERP (planned orders) | On planner release (manual trigger) |
| MDM system → ERP (item master) | Daily or on change |
```

- [ ] **Step 3: Create `src/content/chapters/arch-how-systems-connect/batchrun.md`**

Copy content from `arch-01-end-to-end/batchrun.md`, update `chapter` field only:

```markdown
---
title: "Batch Runs"
description: "Batch runs are the scheduled jobs that keep the planning model current — refreshing transactional data, triggering planning engine recalculations, and synchronising master data."
chapter: "arch-how-systems-connect"
estimatedMinutes: 4
topicLayout: "prose-topic"
---
```
Then copy the full body content unchanged from `src/content/chapters/arch-01-end-to-end/batchrun.md` (everything after the `---` closing frontmatter).

- [ ] **Step 4: Create `src/content/chapters/arch-how-systems-connect/data-upload.md`**

Copy content from `arch-01-end-to-end/data-upload.md`, update `chapter` field only:

```markdown
---
title: "Data Upload"
description: "Not all data flows through automated interfaces. Manual data uploads handle one-off corrections, new data sources, and situations where the automated interface is not yet available."
chapter: "arch-how-systems-connect"
estimatedMinutes: 3
topicLayout: "prose-topic"
---
```
Then copy the full body content unchanged from `src/content/chapters/arch-01-end-to-end/data-upload.md`.

- [ ] **Step 5: Create `src/content/chapters/arch-how-systems-connect/erp-planning-software-integration.md`**

Copy content from `arch-02-integration/erp-planning-software-integration.md`, update `chapter` field only:

```markdown
---
title: "ERP ↔ Planning software Integration"
description: "ERP and Planning software exchange transactional data in both directions. ERP sends actuals; Planning software sends planned orders. Understanding the flow prevents discrepancies between what is planned and what is being executed."
chapter: "arch-how-systems-connect"
estimatedMinutes: 4
topicLayout: "prose-topic"
---
```
Then copy the full body content unchanged from `src/content/chapters/arch-02-integration/erp-planning-software-integration.md`.

- [ ] **Step 6: Create `src/content/chapters/arch-how-systems-connect/planning-software-fms-mdm.md`**

Copy content from `arch-02-integration/planning-software-fms-mdm.md`, update `chapter` field only:

```markdown
---
title: "Planning software ↔ FMS & MDM system"
description: "FMS feeds field-level supply signals into Planning software; MDM system feeds the master data that makes those signals interpretable. Understanding these integrations is essential for data quality management."
chapter: "arch-how-systems-connect"
estimatedMinutes: 4
topicLayout: "prose-topic"
---
```
Then copy the full body content unchanged from `src/content/chapters/arch-02-integration/planning-software-fms-mdm.md`.

- [ ] **Step 7: Hide old arch chapters**

Edit `src/content/chapters/arch-01-end-to-end/_meta.json` — add `"hidden": true`:
```json
{
  "title": "End-to-End Architecture",
  "description": "How ERP, Planning software, FMS, and MDM system connect: the interfaces, batch runs, and data upload processes that keep the system landscape in sync.",
  "icon": "arrows-expand",
  "color": "emerald",
  "theme": "technology",
  "module": "tool-landscape",
  "hidden": true
}
```

Edit `src/content/chapters/arch-02-integration/_meta.json` — add `"hidden": true`:
```json
{
  "title": "System Integration",
  "description": "How ERP, Planning software, FMS, and MDM system are integrated — the data flows, trigger points, and responsibilities for keeping the four-system landscape in sync.",
  "icon": "switch-horizontal",
  "color": "emerald",
  "theme": "technology",
  "module": "tool-landscape",
  "hidden": true
}
```

- [ ] **Step 8: Update tool-usage-by-role module field**

Edit `src/content/chapters/tool-usage-by-role/_meta.json` — change `"module"` from `"adoption-and-usage-quality"` to `"tool-landscape"`:
```json
{ "title": "Tool Usage by Role", "description": "How each planning role interacts with the tools — what they read, what they enter, and what they are responsible for.", "icon": "shield-check", "color": "emerald", "theme": "technology", "module": "tool-landscape", "comingSoon": true }
```

- [ ] **Step 9: Commit**

```bash
git add src/content/chapters/arch-how-systems-connect/ src/content/chapters/arch-01-end-to-end/_meta.json src/content/chapters/arch-02-integration/_meta.json src/content/chapters/tool-usage-by-role/_meta.json
git commit -m "feat(tech/tool-landscape): create arch-how-systems-connect, hide old arch chapters, move tool-usage-by-role"
```

---

## Track C: Planning Software

**Files created/modified:**
- Create: `src/content/chapters/planning-logic/_meta.json`
- Create: `src/content/chapters/planning-logic/disaggregation-variety-to-item.md`
- Create: `src/content/chapters/planning-logic/disaggregation-year-to-month.md`
- Create: `src/content/chapters/planning-logic/backward-consumption.md`
- Create: `src/content/chapters/planning-logic/scheduled-receipt.md`
- Create: `src/content/chapters/planning-logic/push.md`
- Create: `src/content/chapters/planning-logic/pull.md`
- Create: `src/content/chapters/planning-logic/safety-stock.md`
- Create: `src/content/chapters/planning-logic/demand-slicing.md`
- Modify: `src/content/chapters/03-the-logic/_meta.json` (add `hidden: true`)
- Create: `src/content/chapters/planning-software-best-practices/_meta.json`
- Modify: `src/content/chapters/08-configuration-manual/_meta.json` (add `hidden: true`)

### Task C-1: Create planning-logic chapter

- [ ] **Step 1: Create `src/content/chapters/planning-logic/_meta.json`**

```json
{
  "title": "How the Planning Engine Works",
  "description": "How the Planning software planning engine turns network data into optimized, constrained supply plans.",
  "icon": "cpu",
  "color": "emerald",
  "theme": "technology",
  "module": "planning-software"
}
```

- [ ] **Step 2: Copy all 8 topic files from `03-the-logic/` to `planning-logic/`, updating the `chapter` field in each**

For each file, the only change is `chapter: "03-the-logic"` → `chapter: "planning-logic"`. Copy all 8 files:

```bash
for f in disaggregation-variety-to-item disaggregation-year-to-month backward-consumption scheduled-receipt push pull safety-stock demand-slicing; do
  sed 's/chapter: "03-the-logic"/chapter: "planning-logic"/' \
    src/content/chapters/03-the-logic/$f.md \
    > src/content/chapters/planning-logic/$f.md
done
```

- [ ] **Step 3: Verify all 8 files were created**

```bash
ls src/content/chapters/planning-logic/
```
Expected: `_meta.json` plus 8 `.md` files.

- [ ] **Step 4: Hide `03-the-logic`**

Edit `src/content/chapters/03-the-logic/_meta.json` — add `"hidden": true`:
```json
{
  "title": "How the Planning Engine Works",
  "description": "How the Planning software planning engine turns network data into optimized, constrained supply plans.",
  "icon": "cpu",
  "color": "emerald",
  "theme": "technology",
  "module": "planning-software",
  "hidden": true
}
```

- [ ] **Step 5: Commit**

```bash
git add src/content/chapters/planning-logic/ src/content/chapters/03-the-logic/_meta.json
git commit -m "feat(tech/planning-software): rename 03-the-logic to planning-logic"
```

---

### Task C-2: Add best-practices chapter and hide config manual

- [ ] **Step 1: Create `src/content/chapters/planning-software-best-practices/_meta.json`**

```json
{
  "title": "Working Effectively with Planning Software",
  "description": "How high-performing planning teams use Planning software — best practices, common mistakes to avoid, and answers to the most frequent questions.",
  "icon": "shield-check",
  "color": "emerald",
  "theme": "technology",
  "module": "planning-software",
  "comingSoon": true
}
```

- [ ] **Step 2: Hide `08-configuration-manual`**

Edit `src/content/chapters/08-configuration-manual/_meta.json` — add `"hidden": true`:
```json
{
  "title": "Configuration Manual",
  "description": "Step-by-step configuration of Planning software for your business — items, BOMs, BODs, resources, parameters, and network setup.",
  "icon": "document-text",
  "color": "emerald",
  "theme": "technology",
  "module": "planning-software",
  "hidden": true
}
```

- [ ] **Step 3: Commit**

```bash
git add src/content/chapters/planning-software-best-practices/ src/content/chapters/08-configuration-manual/_meta.json
git commit -m "feat(tech/planning-software): add best-practices chapter stub, hide config-manual from module"
```

---

## Track D: ERP

**Files created:**
- Create: `src/content/chapters/erp-best-practices/_meta.json`

### Task D-1: Create erp-best-practices chapter

- [ ] **Step 1: Create `src/content/chapters/erp-best-practices/_meta.json`**

```json
{
  "title": "Working Effectively with ERP",
  "description": "How planners and execution teams get the most from ERP — best practices for order management, common mistakes that corrupt the planning model, and answers to frequent questions.",
  "icon": "shield-check",
  "color": "emerald",
  "theme": "technology",
  "module": "erp",
  "comingSoon": true
}
```

- [ ] **Step 2: Commit**

```bash
git add src/content/chapters/erp-best-practices/
git commit -m "feat(tech/erp): add erp-best-practices chapter stub"
```

---

## Track E: Supporting Systems

**Files created/modified:**

FMS chapters — module field change:
- Modify: `src/content/chapters/fms-01-understanding-basics/_meta.json`
- Modify: `src/content/chapters/fms-02-the-data-model/_meta.json`
- Modify: `src/content/chapters/fms-04-data-flow-out-of-fms/_meta.json`

FMS chapters — hide:
- Modify: `src/content/chapters/fms-03-data-flow-into-fms/_meta.json`
- Modify: `src/content/chapters/fms-05-the-logic/_meta.json`
- Modify: `src/content/chapters/fms-06-key-fms-workflows/_meta.json`
- Modify: `src/content/chapters/fms-07-navigation-and-ui/_meta.json`

FMS merged chapter — create:
- Create: `src/content/chapters/fms-logic-and-workflows/_meta.json`
- Create: `src/content/chapters/fms-logic-and-workflows/fms-business-rules.md`
- Create: `src/content/chapters/fms-logic-and-workflows/field-assignment-logic.md`
- Create: `src/content/chapters/fms-logic-and-workflows/yield-and-activity-tracking.md`
- Create: `src/content/chapters/fms-logic-and-workflows/managing-field-activities.md`
- Create: `src/content/chapters/fms-logic-and-workflows/recording-actuals.md`
- Create: `src/content/chapters/fms-logic-and-workflows/reporting-and-extraction.md`

MDM chapters — module field change:
- Modify: `src/content/chapters/mdm-01-understanding-basics/_meta.json`
- Modify: `src/content/chapters/mdm-02-the-data-model/_meta.json`
- Modify: `src/content/chapters/mdm-04-data-flow-out-of-mdm/_meta.json`

MDM chapters — hide:
- Modify: `src/content/chapters/mdm-03-data-flow-into-mdm/_meta.json`
- Modify: `src/content/chapters/mdm-05-the-logic/_meta.json`
- Modify: `src/content/chapters/mdm-06-key-mdm-workflows/_meta.json`
- Modify: `src/content/chapters/mdm-07-navigation-and-ui/_meta.json`

MDM merged chapter — create:
- Create: `src/content/chapters/mdm-logic-and-workflows/_meta.json` + 6 topic files

Shared:
- Create: `src/content/chapters/supporting-systems-best-practices/_meta.json`

### Task E-1: Move FMS chapters to supporting-systems module

- [ ] **Step 1: Update `fms-01-understanding-basics/_meta.json`** — change `"module"` to `"supporting-systems"`:

```json
{
  "title": "FMS Basics",
  "description": "What FMS is, why field management matters for supply chain planning, and the core concepts that connect field activity to the supply plan.",
  "icon": "globe",
  "color": "emerald",
  "theme": "technology",
  "module": "supporting-systems"
}
```

- [ ] **Step 2: Update `fms-02-the-data-model/_meta.json`** — change `"module"` to `"supporting-systems"`:

```json
{
  "title": "FMS Data Model",
  "description": "How FMS organises field data — growers, contracts, fields, and crops — and how these entities map to the items and locations Planning software uses.",
  "icon": "globe",
  "color": "emerald",
  "theme": "technology",
  "module": "supporting-systems"
}
```

- [ ] **Step 3: Update `fms-04-data-flow-out-of-fms/_meta.json`** — change `"module"` to `"supporting-systems"`:

```json
{
  "title": "What FMS Sends to Planning",
  "description": "The supply signals that flow from FMS into Planning software — yield forecasts, harvest schedules, and the actuals that close the loop on planned supply.",
  "icon": "globe",
  "color": "emerald",
  "theme": "technology",
  "module": "supporting-systems"
}
```

- [ ] **Step 4: Hide removed FMS chapters**

`fms-03-data-flow-into-fms/_meta.json` — add `"hidden": true`:
```json
{
  "title": "Data Flow: Into FMS",
  "description": "Where field data originates and how it enters FMS — from contract setup to crop monitoring records and harvest reporting.",
  "icon": "globe",
  "color": "emerald",
  "theme": "technology",
  "module": "fms",
  "hidden": true
}
```

`fms-05-the-logic/_meta.json` — add `"hidden": true`:
```json
{
  "title": "How FMS Calculates Yield",
  "description": "The rules and calculations FMS applies to field data — how yield forecasts are generated, how field assignments work, and how harvest schedules are derived.",
  "icon": "globe",
  "color": "emerald",
  "theme": "technology",
  "module": "fms",
  "hidden": true
}
```

`fms-06-key-fms-workflows/_meta.json` — add `"hidden": true`:
```json
{
  "title": "Key FMS Workflows",
  "description": "Managing field activities, recording actuals, and extracting supply signals — the workflows that connect grower operations to the planning system.",
  "icon": "globe",
  "color": "emerald",
  "theme": "technology",
  "module": "fms",
  "hidden": true
}
```

`fms-07-navigation-and-ui/_meta.json` — add `"hidden": true`:
```json
{
  "title": "Navigating FMS",
  "description": "How to move around FMS efficiently — finding grower records, reading crop status, and navigating to the supply signals that matter for planning.",
  "icon": "globe",
  "color": "emerald",
  "theme": "technology",
  "module": "fms",
  "hidden": true
}
```

- [ ] **Step 5: Commit**

```bash
git add src/content/chapters/fms-01-understanding-basics/_meta.json \
        src/content/chapters/fms-02-the-data-model/_meta.json \
        src/content/chapters/fms-04-data-flow-out-of-fms/_meta.json \
        src/content/chapters/fms-03-data-flow-into-fms/_meta.json \
        src/content/chapters/fms-05-the-logic/_meta.json \
        src/content/chapters/fms-06-key-fms-workflows/_meta.json \
        src/content/chapters/fms-07-navigation-and-ui/_meta.json
git commit -m "feat(tech/supporting-systems): move FMS chapters to supporting-systems, hide removed chapters"
```

---

### Task E-2: Create fms-logic-and-workflows merged chapter

- [ ] **Step 1: Create `src/content/chapters/fms-logic-and-workflows/_meta.json`**

```json
{
  "title": "FMS Logic & Workflows",
  "description": "How FMS calculates yield and manages field operations — the business rules that govern field assignments and yield forecasting, plus the key workflows for recording actuals and extracting supply signals.",
  "icon": "globe",
  "color": "emerald",
  "theme": "technology",
  "module": "supporting-systems"
}
```

- [ ] **Step 2: Copy all 6 topic files (3 from fms-05, 3 from fms-06), updating `chapter` field**

```bash
for f in fms-business-rules field-assignment-logic yield-and-activity-tracking; do
  sed 's/chapter: "fms-05-the-logic"/chapter: "fms-logic-and-workflows"/' \
    src/content/chapters/fms-05-the-logic/$f.md \
    > src/content/chapters/fms-logic-and-workflows/$f.md
done

for f in managing-field-activities recording-actuals reporting-and-extraction; do
  sed 's/chapter: "fms-06-key-fms-workflows"/chapter: "fms-logic-and-workflows"/' \
    src/content/chapters/fms-06-key-fms-workflows/$f.md \
    > src/content/chapters/fms-logic-and-workflows/$f.md
done
```

- [ ] **Step 3: Verify**

```bash
ls src/content/chapters/fms-logic-and-workflows/
```
Expected: `_meta.json` + 6 `.md` files.

- [ ] **Step 4: Commit**

```bash
git add src/content/chapters/fms-logic-and-workflows/
git commit -m "feat(tech/supporting-systems): create fms-logic-and-workflows merged chapter"
```

---

### Task E-3: Move MDM chapters to supporting-systems module

- [ ] **Step 1: Update `mdm-01-understanding-basics/_meta.json`** — change `"module"` to `"supporting-systems"`:

```json
{
  "title": "MDM Basics",
  "description": "What MDM is, why master data management matters, and the core concepts that underpin how MDM serves the rest of the system landscape.",
  "icon": "database",
  "color": "emerald",
  "theme": "technology",
  "module": "supporting-systems"
}
```

- [ ] **Step 2: Update `mdm-02-the-data-model/_meta.json`** — change `"module"` to `"supporting-systems"`:

```json
{
  "title": "MDM Data Model",
  "description": "How MDM organises product data — item hierarchies, attribute structures, and the relationships between entities that downstream systems rely on.",
  "icon": "database",
  "color": "emerald",
  "theme": "technology",
  "module": "supporting-systems"
}
```

- [ ] **Step 3: Update `mdm-04-data-flow-out-of-mdm/_meta.json`** — change `"module"` to `"supporting-systems"`, update title:

```json
{
  "title": "What MDM Sends to Planning",
  "description": "How MDM distributes master data to Planning software, ERP, FMS, and other systems — and what to do when systems fall out of sync.",
  "icon": "database",
  "color": "emerald",
  "theme": "technology",
  "module": "supporting-systems"
}
```

- [ ] **Step 4: Hide removed MDM chapters**

`mdm-03-data-flow-into-mdm/_meta.json` — add `"hidden": true`:
```json
{
  "title": "Data Flow: Into MDM",
  "description": "Where master data originates and how it enters MDM — from new product requests to attribute updates and hierarchy changes.",
  "icon": "database",
  "color": "emerald",
  "theme": "technology",
  "module": "mdm",
  "hidden": true
}
```

`mdm-05-the-logic/_meta.json` — add `"hidden": true`:
```json
{
  "title": "How MDM Governs Data",
  "description": "The governance rules and automated processes that control how MDM maintains data quality — matching, deduplication, and approval workflows.",
  "icon": "database",
  "color": "emerald",
  "theme": "technology",
  "module": "mdm",
  "hidden": true
}
```

`mdm-06-key-mdm-workflows/_meta.json` — add `"hidden": true`:
```json
{
  "title": "Key MDM Workflows",
  "description": "Creating new items, managing attribute changes, retiring obsolete records — the core workflows that keep the master data foundation current and accurate.",
  "icon": "database",
  "color": "emerald",
  "theme": "technology",
  "module": "mdm",
  "hidden": true
}
```

`mdm-07-navigation-and-ui/_meta.json` — add `"hidden": true`:
```json
{
  "title": "Navigating MDM",
  "description": "How to move around MDM efficiently — finding records, using search and filters, and reading the output that confirms data has been distributed correctly.",
  "icon": "database",
  "color": "emerald",
  "theme": "technology",
  "module": "mdm",
  "hidden": true
}
```

- [ ] **Step 5: Commit**

```bash
git add src/content/chapters/mdm-01-understanding-basics/_meta.json \
        src/content/chapters/mdm-02-the-data-model/_meta.json \
        src/content/chapters/mdm-04-data-flow-out-of-mdm/_meta.json \
        src/content/chapters/mdm-03-data-flow-into-mdm/_meta.json \
        src/content/chapters/mdm-05-the-logic/_meta.json \
        src/content/chapters/mdm-06-key-mdm-workflows/_meta.json \
        src/content/chapters/mdm-07-navigation-and-ui/_meta.json
git commit -m "feat(tech/supporting-systems): move MDM chapters to supporting-systems, hide removed chapters"
```

---

### Task E-4: Create mdm-logic-and-workflows merged chapter

- [ ] **Step 1: Create `src/content/chapters/mdm-logic-and-workflows/_meta.json`**

```json
{
  "title": "MDM Logic & Workflows",
  "description": "How MDM governs master data and manages record changes — the governance rules and approval workflows that maintain data quality, plus the core workflows for creating, updating, and auditing records.",
  "icon": "database",
  "color": "emerald",
  "theme": "technology",
  "module": "supporting-systems"
}
```

- [ ] **Step 2: Copy all 6 topic files (3 from mdm-05, 3 from mdm-06), updating `chapter` field**

```bash
for f in mdm-governance-rules data-matching-and-deduplication approval-workflows; do
  sed 's/chapter: "mdm-05-the-logic"/chapter: "mdm-logic-and-workflows"/' \
    src/content/chapters/mdm-05-the-logic/$f.md \
    > src/content/chapters/mdm-logic-and-workflows/$f.md
done

for f in creating-and-maintaining-records managing-data-changes auditing-and-reporting; do
  sed 's/chapter: "mdm-06-key-mdm-workflows"/chapter: "mdm-logic-and-workflows"/' \
    src/content/chapters/mdm-06-key-mdm-workflows/$f.md \
    > src/content/chapters/mdm-logic-and-workflows/$f.md
done
```

- [ ] **Step 3: Verify**

```bash
ls src/content/chapters/mdm-logic-and-workflows/
```
Expected: `_meta.json` + 6 `.md` files.

- [ ] **Step 4: Commit**

```bash
git add src/content/chapters/mdm-logic-and-workflows/
git commit -m "feat(tech/supporting-systems): create mdm-logic-and-workflows merged chapter"
```

---

### Task E-5: Create supporting-systems-best-practices shared chapter

- [ ] **Step 1: Create `src/content/chapters/supporting-systems-best-practices/_meta.json`**

```json
{
  "title": "Working Effectively with Supporting Systems",
  "description": "Best practices for planners working with FMS and MDM — how to read field signals accurately, how to raise master data issues, and the most common mistakes that create discrepancies between the planning model and operational reality.",
  "icon": "shield-check",
  "color": "emerald",
  "theme": "technology",
  "module": "supporting-systems",
  "comingSoon": true
}
```

- [ ] **Step 2: Commit**

```bash
git add src/content/chapters/supporting-systems-best-practices/
git commit -m "feat(tech/supporting-systems): add supporting-systems-best-practices chapter stub"
```

---

## Final Verification (after all tracks complete)

- [ ] **Step 1: Run full build**

```bash
npm run build 2>&1
```
Expected: Build completes with 0 errors. Pagefind indexes ~250+ pages.

- [ ] **Step 2: Verify module structure in build output**

```bash
ls dist/technology/
```
Expected directories: `configuration`, `erp`, `planning-software`, `supporting-systems`, `tool-landscape` (and possibly `fms`, `mdm`, `adoption-and-usage-quality` if static pages still exist — Track A removes those).

- [ ] **Step 3: Spot-check key URLs in built output**

```bash
# New pages exist
ls dist/technology/supporting-systems/
ls dist/technology/supporting-systems/fms-01-understanding-basics/
ls dist/technology/supporting-systems/arch-how-systems-connect/ 2>/dev/null || echo "arch in tool-landscape"
ls dist/technology/tool-landscape/arch-how-systems-connect/

# Old pages are gone or empty
ls dist/technology/fms/ 2>/dev/null && echo "WARNING: fms page still exists" || echo "OK: fms page removed"
```

- [ ] **Step 4: Final commit**

```bash
git add -A
git commit -m "feat(tech): complete technology pillar restructure — 36 → 28 chapters, supporting-systems module" --allow-empty
```
