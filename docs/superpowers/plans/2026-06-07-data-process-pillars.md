# Data & Process Pillars Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build out the Data pillar (data-driven planning, 2 chapters) and Process pillar (scenario planning, 2 chapters) with full chapter/topic content, replacing the "coming soon" placeholder pages.

**Architecture:** Add a `pillar` field to chapter metadata to isolate chapters per pillar. Update `getChapters()` to accept an optional pillar filter. New chapter directories follow the `data-XX-slug` / `process-XX-slug` naming convention. The existing `/chapters/[chapter]` routing handles all pillars — only the back-link and chapter switcher need to be made pillar-aware.

**Tech Stack:** Astro 4.15, Tailwind CSS, TypeScript, Markdown content in `src/content/chapters/`

---

## File Map

**Modified:**
- `src/lib/chapters.ts` — add `pillar` to interfaces, pillar-filtered `getChapters()`, pillar-scoped `getAdjacentTopics()`
- `src/content/chapters/*/`_meta.json` (7 files)` — add `"pillar": "technology"`
- `src/pages/technology/how-o9-works/index.astro` — filter to technology chapters
- `src/pages/chapters/[chapter]/index.astro` — dynamic back-link + chapter switcher per pillar
- `src/pages/data.astro` — replace "coming soon" with chapter list hub
- `src/pages/process.astro` — replace "coming soon" with chapter list hub

**Created:**
- `src/content/chapters/data-01-planning-data-fundamentals/_meta.json`
- `src/content/chapters/data-01-planning-data-fundamentals/01-what-is-data-driven-planning.md`
- `src/content/chapters/data-01-planning-data-fundamentals/02-o9-data-model-overview.md`
- `src/content/chapters/data-01-planning-data-fundamentals/03-where-data-comes-from.md`
- `src/content/chapters/data-01-planning-data-fundamentals/04-how-data-flows-into-a-plan.md`
- `src/content/chapters/data-01-planning-data-fundamentals/05-the-cost-of-bad-data.md`
- `src/content/chapters/data-02-data-quality-and-impact/_meta.json`
- `src/content/chapters/data-02-data-quality-and-impact/01-what-makes-data-good-enough.md`
- `src/content/chapters/data-02-data-quality-and-impact/02-common-data-problems.md`
- `src/content/chapters/data-02-data-quality-and-impact/03-how-data-quality-shows-up-in-plans.md`
- `src/content/chapters/data-02-data-quality-and-impact/04-data-governance-basics.md`
- `src/content/chapters/data-02-data-quality-and-impact/05-improving-data-quality-over-time.md`
- `src/content/chapters/process-01-scenario-planning-fundamentals/_meta.json`
- `src/content/chapters/process-01-scenario-planning-fundamentals/01-what-is-scenario-planning.md`
- `src/content/chapters/process-01-scenario-planning-fundamentals/02-when-to-use-scenario-planning.md`
- `src/content/chapters/process-01-scenario-planning-fundamentals/03-types-of-scenarios.md`
- `src/content/chapters/process-01-scenario-planning-fundamentals/04-the-scenario-planning-process.md`
- `src/content/chapters/process-01-scenario-planning-fundamentals/05-setting-up-effective-scenarios.md`
- `src/content/chapters/process-02-running-scenarios-in-o9/_meta.json`
- `src/content/chapters/process-02-running-scenarios-in-o9/01-creating-a-scenario-in-o9.md`
- `src/content/chapters/process-02-running-scenarios-in-o9/02-adjusting-parameters-and-assumptions.md`
- `src/content/chapters/process-02-running-scenarios-in-o9/03-running-and-comparing-scenarios.md`
- `src/content/chapters/process-02-running-scenarios-in-o9/04-promoting-a-scenario-to-baseline.md`
- `src/content/chapters/process-02-running-scenarios-in-o9/05-communicating-scenario-findings.md`

---

## Task 1: Update chapters.ts — pillar support

**Files:**
- Modify: `src/lib/chapters.ts`

- [ ] **Step 1: Update ChapterMeta and TopicMeta interfaces**

Replace the interfaces section (lines 1–37) with:

```typescript
export interface ChapterMeta {
  title: string;
  description: string;
  icon: string;
  color: string;
  order: number;
  slug: string;
  pillar?: string;
  hidden?: boolean;
}

export interface TopicMeta {
  title: string;
  description: string;
  order: number;
  chapter: string;
  estimatedMinutes: number;
  widget: string;
  widgetStep?: number;
  nodeType?: string;
  summary?: string;
  topicLayout?: string;
  bullets?: string[];
  nodeLocation?: string;
  lineInLabel?: string;
  lineOutLabel?: string;
  durationLabel?: string;
  transportMode?: string;
  consumptionLabel?: string;
  cards?: { title: string; description: string; icon?: string }[];
  tableColumns?: string[];
  tableRows?: string[][];
  left?: { title: string; points: string[] };
  right?: { title: string; points: string[] };
  slug: string;
  chapterSlug: string;
  url: string;
  pillar: string;
}
```

- [ ] **Step 2: Update getChapters() to accept optional pillar filter**

Replace the `getChapters` function:

```typescript
export function getChapters(pillar?: string): ChapterMeta[] {
  return Object.entries(chapterMetaFiles)
    .map(([path, mod]: [string, any]) => {
      const chapterSlug = path.split('/').slice(-2, -1)[0];
      return { ...mod, slug: chapterSlug } as ChapterMeta;
    })
    .filter((ch) => !pillar || ch.pillar === pillar)
    .sort((a, b) => a.order - b.order);
}
```

- [ ] **Step 3: Update getTopics() to attach pillar from chapter meta**

Replace the `getTopics` function:

```typescript
export function getTopics(): TopicMeta[] {
  const allChapters = getChapters();
  return Object.entries(topicFiles)
    .map(([path, mod]: [string, any]) => {
      const fm = mod.frontmatter ?? {};
      const topicSlug = slugFromPath(path);
      const chapterSlug = chapterSlugFromPath(path);
      const chapter = allChapters.find((c) => c.slug === chapterSlug);
      return {
        title: fm.title ?? '',
        description: fm.description ?? '',
        order: fm.order ?? 0,
        chapter: fm.chapter ?? chapterSlug,
        estimatedMinutes: fm.estimatedMinutes ?? 3,
        widget: fm.widget ?? '',
        widgetStep: fm.widgetStep ?? undefined,
        nodeType: fm.nodeType ?? undefined,
        summary: fm.summary ?? undefined,
        topicLayout: fm.topicLayout ?? undefined,
        bullets: fm.bullets ?? undefined,
        nodeLocation: fm.nodeLocation ?? undefined,
        lineInLabel: fm.lineInLabel ?? undefined,
        lineOutLabel: fm.lineOutLabel ?? undefined,
        durationLabel: fm.durationLabel ?? undefined,
        transportMode: fm.transportMode ?? undefined,
        consumptionLabel: fm.consumptionLabel ?? undefined,
        cards: fm.cards ?? undefined,
        tableColumns: fm.tableColumns ?? undefined,
        tableRows: fm.tableRows ?? undefined,
        left: fm.left ?? undefined,
        right: fm.right ?? undefined,
        slug: topicSlug,
        chapterSlug,
        url: `${import.meta.env.BASE_URL}chapters/${chapterSlug}/${topicSlug}`,
        pillar: chapter?.pillar ?? 'technology',
      } as TopicMeta;
    })
    .sort((a, b) => {
      if (a.chapterSlug !== b.chapterSlug) return a.chapterSlug.localeCompare(b.chapterSlug);
      return a.order - b.order;
    });
}
```

- [ ] **Step 4: Update getAdjacentTopics() to scope within the same pillar**

Replace the `getAdjacentTopics` function:

```typescript
export function getAdjacentTopics(url: string): [TopicMeta | null, TopicMeta | null] {
  const all = getTopics();
  const current = all.find((t) => t.url === url);
  const scoped = current ? all.filter((t) => t.pillar === current.pillar) : all;
  const idx = scoped.findIndex((t) => t.url === url);
  return [idx > 0 ? scoped[idx - 1] : null, idx < scoped.length - 1 ? scoped[idx + 1] : null];
}
```

---

## Task 2: Add pillar field to all existing Technology chapter _meta.json files

**Files:** 7 `_meta.json` files under `src/content/chapters/`

For each of the 7 existing chapter directories, add `"pillar": "technology"` to their `_meta.json`. Example for `01-understanding-basics/_meta.json`:

- [ ] **Step 1: Update all 7 Technology chapter _meta.json files**

`src/content/chapters/01-understanding-basics/_meta.json`:
```json
{
  "title": "Understanding the Basics",
  "description": "Learn the fundamental building blocks of any supply chain network: the elements that every planning model is built from.",
  "icon": "cube",
  "color": "indigo",
  "order": 1,
  "pillar": "technology"
}
```

Apply the same pattern to:
- `02-the-network/_meta.json` — add `"pillar": "technology"`
- `03-demand-data-flow/_meta.json` — add `"pillar": "technology"`
- `03-the-logic/_meta.json` — add `"pillar": "technology"`
- `04-supply-data-flow/_meta.json` — add `"pillar": "technology"`
- `04-the-simulation/_meta.json` — add `"pillar": "technology"`
- `99-layout-showcase/_meta.json` — add `"pillar": "technology"`

---

## Task 3: Update how-o9-works/index.astro to filter technology chapters

**Files:**
- Modify: `src/pages/technology/how-o9-works/index.astro`

- [ ] **Step 1: Filter chapters to technology pillar**

Change line 6:
```typescript
const chapters = getChapters();
```
To:
```typescript
const chapters = getChapters('technology');
```

---

## Task 4: Update chapters/[chapter]/index.astro — dynamic back-link and chapter switcher

**Files:**
- Modify: `src/pages/chapters/[chapter]/index.astro`

- [ ] **Step 1: Add pillar back-link map after the color maps**

After the existing `colorBgMap` declaration (around line 34), add:

```typescript
const pillarBackMap: Record<string, { href: string; label: string }> = {
  technology: { href: '/technology/how-o9-works', label: 'How o9 Works' },
  data: { href: '/data', label: 'Data' },
  process: { href: '/process', label: 'Process' },
};
const pillar = chapter.pillar ?? 'technology';
const back = pillarBackMap[pillar] ?? pillarBackMap['technology'];
const pillarChapters = getChapters(pillar);
```

- [ ] **Step 2: Replace hardcoded back-link in the header**

Change:
```astro
<a href="/technology/how-o9-works" class="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors">
  <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12h18M3 12l7-7M3 12l7 7"/>
  </svg>
  How o9 Works
</a>
```
To:
```astro
<a href={back.href} class="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors">
  <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12h18M3 12l7-7M3 12l7 7"/>
  </svg>
  {back.label}
</a>
```

- [ ] **Step 3: Scope chapter switcher nav to same pillar**

Change:
```astro
{allChapters.map((ch) => (
```
To:
```astro
{pillarChapters.map((ch) => (
```

- [ ] **Step 4: Replace hardcoded "Back to overview" link at the bottom**

Change:
```astro
<a href="/technology/how-o9-works" class="text-sm text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300 transition-colors">Back to overview</a>
```
To:
```astro
<a href={back.href} class="text-sm text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300 transition-colors">Back to overview</a>
```

---

## Task 5: Create Data Chapter 1 — Planning Data Fundamentals

**Files:** Create `src/content/chapters/data-01-planning-data-fundamentals/` with 6 files.

- [ ] **Step 1: Create _meta.json**

`src/content/chapters/data-01-planning-data-fundamentals/_meta.json`:
```json
{
  "title": "Planning Data Fundamentals",
  "description": "Understand what data-driven planning means, where data comes from, and how it flows through the o9 platform to produce a plan.",
  "icon": "cube",
  "color": "emerald",
  "order": 1,
  "pillar": "data"
}
```

- [ ] **Step 2: Create topic 01 — What is Data-Driven Planning?**

`src/content/chapters/data-01-planning-data-fundamentals/01-what-is-data-driven-planning.md`:
```markdown
---
title: "What is Data-Driven Planning?"
description: "A planning process is only as good as the data it runs on. This topic defines what data-driven planning means in practice."
order: 1
chapter: "data-01-planning-data-fundamentals"
estimatedMinutes: 4
topicLayout: "prose-topic"
---

## From gut feel to structured input

For decades, supply chain planning relied heavily on the experience of planners — their intuition about which customers to prioritize, how much buffer to hold, and when to push production. That knowledge is valuable, but it doesn't scale. When a business operates across hundreds of locations, thousands of SKUs, and multiple planning cycles, human memory and spreadsheets can't keep up.

Data-driven planning replaces gut feel with **structured, repeatable inputs** that the planning engine uses to calculate what should happen and when. The planner's role shifts from calculating to deciding: reviewing what the system recommends, understanding why, and overriding when the context demands it.

## What "data-driven" actually means

In an o9 context, data-driven planning means three things:

1. **The plan is calculated from data, not entered manually.** Demand forecasts, inventory levels, production capacities, and supply constraints are loaded into the system and the plan falls out of the logic — not from a spreadsheet someone filled in.

2. **Every planning decision is traceable to a data source.** If a planned order is high, you can trace it back to the demand signal that drove it. If safety stock is excessive, you can trace it back to the variability settings.

3. **The plan updates when the data changes.** A new customer forecast, a supplier constraint, or a production disruption feeds back into the model and the plan recalculates — without the planner manually rebuilding it from scratch.

## Why this matters

A plan that isn't grounded in data creates risk. Over-production ties up capital. Under-production loses sales. A data-driven approach doesn't eliminate uncertainty — it makes uncertainty visible, quantified, and manageable.

The alternative — a plan maintained in spreadsheets, built on experience and copied from last month — can't respond fast enough to the pace of modern supply chains.
```

- [ ] **Step 3: Create topic 02 — The o9 Data Model Overview**

`src/content/chapters/data-01-planning-data-fundamentals/02-o9-data-model-overview.md`:
```markdown
---
title: "The o9 Data Model Overview"
description: "o9 represents the supply chain as a graph of connected nodes. Understanding this structure is the foundation for understanding how data works."
order: 2
chapter: "data-01-planning-data-fundamentals"
estimatedMinutes: 4
topicLayout: "prose-topic"
---

## A graph, not a spreadsheet

Traditional planning tools store data in flat tables — rows and columns. o9 uses a **graph model**: nodes (items, locations, resources) connected by edges that represent relationships (a BOM link, a transportation lane, a production step).

This distinction matters because the graph reflects reality. A supply chain isn't a table — it's a network. Raw materials feed into components, components into finished goods, goods into warehouses, warehouses into customers. The graph captures these flows explicitly.

## The core building blocks

You met these in the Technology pillar, but they're worth revisiting from a data perspective:

- **Items** — the SKUs being planned. Each item is a node with attributes: description, unit of measure, lead time, safety stock settings.
- **Locations** — where items are held or produced. Each location is a node with its own attributes: capacity, timezone, opening hours.
- **Item at Location (IAL)** — the pairing of an item and a location. This is the actual planning object: "Product X at Warehouse Y."
- **Resources** — production lines, machines, or labor that have capacity constraints.
- **BOMs** — bill of materials edges connecting parent items to their components.
- **Transportation lanes** — edges connecting source and destination locations with lead time and cost.

## What data lives where

Each node and edge in the graph carries data. Item nodes carry demand forecasts. IAL nodes carry inventory levels. BOM edges carry yield ratios. Transportation lane edges carry transit times.

When the planning engine runs, it traverses this graph — reading data from each node and edge — and calculates planned orders, transfers, and production schedules. Change the data on any node or edge, and the plan changes with it.

This is why data accuracy is not a reporting concern — it is a planning concern. Bad data on any node in the graph propagates into the plan.
```

- [ ] **Step 4: Create topic 03 — Where Data Comes From**

`src/content/chapters/data-01-planning-data-fundamentals/03-where-data-comes-from.md`:
```markdown
---
title: "Where Data Comes From"
description: "Planning data doesn't originate in o9 — it is loaded from source systems. Understanding the sources helps you understand why data problems occur."
order: 3
chapter: "data-01-planning-data-fundamentals"
estimatedMinutes: 3
topicLayout: "prose-topic"
---

## o9 is a planning layer, not a source of record

o9 does not create business data — it receives it. Inventory levels, customer orders, production capacities, and supplier lead times all originate in other systems: ERPs, WMS systems, CRM tools, or even manual spreadsheet uploads. o9 aggregates these signals and uses them to calculate a plan.

Understanding this is critical: if a source system has bad data, o9 will plan with bad data.

## Common data sources

**ERP systems (SAP, Oracle, Dynamics)**
The most common source for master data — items, BOMs, locations, and resources — and for transactional data like open purchase orders, production orders, and inventory snapshots.

**Customer systems**
Demand signals often arrive as customer forecasts, firm orders, or point-of-sale data from retail customers. These flow in via EDI, API, or file feeds.

**Market intelligence**
Statistical forecasting tools, market data providers, or internal commercial teams produce demand forecasts that overlay or replace customer-provided signals.

**Manual uploads**
Not all data is automated. Supplier capacity, allocation decisions, and exception overrides often arrive as Excel files processed through o9's data load interfaces.

## The integration challenge

Each source system speaks a different language. Data needs to be mapped, transformed, and validated before o9 can use it. A supplier lead time in an ERP might be in working days; o9 needs calendar days. An item description might be truncated differently across systems.

These integration gaps — mapping errors, format mismatches, missing values — are one of the most common causes of data quality problems in practice.
```

- [ ] **Step 5: Create topic 04 — How Data Flows into a Plan**

`src/content/chapters/data-01-planning-data-fundamentals/04-how-data-flows-into-a-plan.md`:
```markdown
---
title: "How Data Flows into a Plan"
description: "From raw data load to a calculated plan — the sequence of how o9 processes incoming data and translates it into planning outputs."
order: 4
chapter: "data-01-planning-data-fundamentals"
estimatedMinutes: 4
topicLayout: "prose-topic"
---

## The planning cycle in four steps

Understanding how data moves through o9 helps you understand where things can go wrong — and what to check when a plan looks wrong.

**Step 1: Data load**
Source system data is pushed or pulled into o9 on a schedule (nightly, weekly, or on-demand). This includes inventory snapshots, open orders, demand forecasts, and master data updates. The data lands in staging tables before it is applied to the planning model.

**Step 2: Data validation**
o9 checks loaded data for completeness and consistency. Missing BOM links, invalid item codes, or quantities below zero are flagged. Depending on configuration, some errors block the load; others log a warning and continue.

**Step 3: Planning run**
Once data is applied, the planning engine executes. It traverses the supply chain graph, applies demand signals to each node, nets against available inventory, checks resource capacity, and generates planned orders. This can take seconds for small networks or minutes for large ones.

**Step 4: Review and release**
The plan lands in planner workbenches as recommendations — planned production orders, purchase requisitions, transfer orders. Planners review, adjust, and release approved actions back to execution systems (the ERP, WMS, or directly to suppliers).

## Why the sequence matters

A planning cycle is only as current as its most recent data load. If inventory was loaded yesterday and a large shipment arrived this morning, the plan is working with stale inventory. The plan will recommend orders that may already be unnecessary.

Knowing when data was last loaded — and from which sources — is essential context for interpreting any planning output.
```

- [ ] **Step 6: Create topic 05 — The Cost of Bad Data**

`src/content/chapters/data-01-planning-data-fundamentals/05-the-cost-of-bad-data.md`:
```markdown
---
title: "The Cost of Bad Data"
description: "Bad planning data doesn't stay in the system — it becomes inventory, stockouts, and wasted capacity. Understanding the downstream effects makes data quality feel urgent."
order: 5
chapter: "data-01-planning-data-fundamentals"
estimatedMinutes: 4
topicLayout: "prose-topic"
---

## Garbage in, garbage out

The planning engine is deterministic: given the same inputs, it always produces the same outputs. It cannot compensate for bad data. If the inputs are wrong, the plan is wrong — and the plan becomes reality when orders are placed.

This is what makes data quality a business concern, not just an IT concern.

## How bad data manifests in plans

**Inflated safety stock**
If demand variability is overestimated — because historical data includes one-off spikes that are treated as normal — safety stock settings will be too high. The result is excess inventory accumulating across the network.

**Missed production orders**
If a BOM is incomplete — a component is missing or a yield factor is wrong — the engine won't plan the right quantity of components. A production order releases, and materials aren't there.

**Phantom inventory**
If inventory records are wrong (items that were consumed but not booked out, or receipts not yet confirmed), the system believes there is stock when there isn't. It won't plan replenishment, and the line runs short.

**Unnecessary transfers**
If location-level demand is misallocated — attributed to the wrong warehouse — the system moves inventory to the wrong place. Transfers happen; the right location still stockouts.

## The compounding effect

Bad data errors don't stay contained. They propagate through the supply chain graph in both directions. A missing component in a BOM creates an underplanned sub-assembly, which creates an underplanned finished good, which creates a customer delivery failure.

The further downstream the error is caught — in execution, at the customer — the more expensive it becomes to fix.
```

---

## Task 6: Create Data Chapter 2 — Data Quality & Its Impact

**Files:** Create `src/content/chapters/data-02-data-quality-and-impact/` with 6 files.

- [ ] **Step 1: Create _meta.json**

`src/content/chapters/data-02-data-quality-and-impact/_meta.json`:
```json
{
  "title": "Data Quality & Its Impact",
  "description": "Understand what good data looks like, where data problems come from, and how to build practices that keep planning data healthy over time.",
  "icon": "cpu",
  "color": "emerald",
  "order": 2,
  "pillar": "data"
}
```

- [ ] **Step 2: Create topic 01 — What Makes Data "Good Enough"?**

`src/content/chapters/data-02-data-quality-and-impact/01-what-makes-data-good-enough.md`:
```markdown
---
title: "What Makes Data \"Good Enough\"?"
description: "Data quality isn't binary. Four dimensions — completeness, accuracy, timeliness, and consistency — define whether data is fit for planning."
order: 1
chapter: "data-02-data-quality-and-impact"
estimatedMinutes: 4
topicLayout: "prose-topic"
---

## Four dimensions of data quality

Not all data problems look the same. A data quality framework gives you a shared language to diagnose issues and prioritize fixes.

**Completeness**
Is all the necessary data present? A planning run needs demand forecasts for every active item, inventory counts for every location, and BOM links for every finished good. Missing records — an item with no forecast, a location with no inventory — force the engine to plan blind or plan with defaults that may not reflect reality.

**Accuracy**
Is the data correct? An inventory count that is off by 30%, a lead time entered in weeks when the system expects days, a demand forecast that hasn't been updated in three months — these are accuracy problems. The system runs, the plan calculates, but the outputs are wrong.

**Timeliness**
Is the data current? Planning data has a shelf life. Yesterday's inventory snapshot may not reflect this morning's production run. A demand forecast from last quarter may not reflect the new promotion launching next month. Stale data produces plans that are already wrong by the time they're reviewed.

**Consistency**
Does data mean the same thing across systems? If the ERP reports a lead time in working days and the integration layer converts it to calendar days incorrectly, the plan will place orders too late. Consistency failures are often the hardest to spot because each system looks internally correct.

## "Good enough" is relative to decisions

Data doesn't need to be perfect — it needs to be good enough for the decisions being made. A rough annual S&OP review can tolerate more data uncertainty than a weekly tactical plan that drives purchase orders. Knowing which planning horizon you are supporting helps you prioritize which data quality dimensions matter most.
```

- [ ] **Step 3: Create topic 02 — Common Data Problems in Planning**

`src/content/chapters/data-02-data-quality-and-impact/02-common-data-problems.md`:
```markdown
---
title: "Common Data Problems in Planning"
description: "The same data problems appear in almost every supply chain planning implementation. Recognising them is the first step to fixing them."
order: 2
chapter: "data-02-data-quality-and-impact"
estimatedMinutes: 5
topicLayout: "prose-topic"
---

## Master data problems

**Incomplete or outdated BOMs**
Bills of materials change when products are reformulated, repackaged, or re-sourced. If the BOM in o9 isn't updated to reflect the current recipe, the engine plans the wrong components.

**Wrong lead times**
Lead times entered at implementation and never reviewed. A supplier that used to deliver in 4 weeks now delivers in 6. The plan places orders too late, stockouts occur, and no one knows why — until someone checks the master data.

**Duplicate or inactive items**
Items that were superseded, discontinued, or merged but not deactivated still appear in the model. Forecasts get split. Inventory is held against the wrong code.

## Transactional data problems

**Open order discrepancies**
Purchase orders confirmed as received in the ERP but not yet closed. The system counts them as on-hand stock or in-transit inventory, reducing planned orders that are actually needed.

**Forecast override drift**
Planners apply manual overrides to forecasts that later expire or get overwritten by new statistical runs. The override stays; the reason for it is lost. The plan reflects a decision no one remembers making.

**Inventory timing mismatches**
A large production run completed at 11pm is not booked until the next morning. The nightly planning run sees stock that doesn't exist yet. The morning run sees stock that is already committed.

## Integration problems

**Unit of measure mismatches**
A forecast in cases when the planning system expects eaches. A capacity in tonnes when planning uses pallets. The conversion factor is wrong or missing.

**Truncated identifiers**
Item codes or location identifiers get truncated or padded differently in different systems. The same SKU appears as two different items. Inventory and demand never match.
```

- [ ] **Step 4: Create topic 03 — How Data Quality Shows Up in Plans**

`src/content/chapters/data-02-data-quality-and-impact/03-how-data-quality-shows-up-in-plans.md`:
```markdown
---
title: "How Data Quality Shows Up in Plans"
description: "Data problems have recognisable signatures in planning outputs. Learning to read the plan as a diagnostic tool helps you surface data issues before they become operational problems."
order: 3
chapter: "data-02-data-quality-and-impact"
estimatedMinutes: 4
topicLayout: "prose-topic"
---

## The plan as a diagnostic instrument

When a plan looks wrong — unexpectedly high orders, implausible inventory levels, contradictory recommendations — the cause is almost always one of three things: a wrong assumption in the logic, a changed business condition, or bad data. Learning to distinguish them is one of the most valuable planning skills.

## Diagnostic signatures

**Spike-then-zero patterns**
A planned order that is very large in one period, then zero for several periods. Often caused by a one-time demand spike in historical data being treated as recurring, or a demand override applied to the wrong bucket.

**Persistently high safety stock**
Safety stock that never gets consumed, suggesting either very accurate supply, very low demand variability, or — more likely — a variability setting that hasn't been recalibrated since implementation.

**Inventory oscillation**
Stock levels that swing dramatically between periods: overstock, then understock, then overstock again. Often caused by lead times that don't match reality, causing the engine to over-order in anticipation and then cancel when the goods arrive early.

**Unexplained transfer recommendations**
Transfers between locations for items that appear to have adequate stock on both ends. Often caused by demand being allocated to the wrong location, or inventory not being visible at the source location due to a system booking delay.

## From signature to root cause

When you see one of these patterns, the question to ask is: what data would produce this output? Work backwards from the plan to the input. Check the demand signal, the inventory record, the BOM, the lead time. The engine is telling you where the inconsistency is — you just need to learn to read it.
```

- [ ] **Step 5: Create topic 04 — Data Governance Basics**

`src/content/chapters/data-02-data-quality-and-impact/04-data-governance-basics.md`:
```markdown
---
title: "Data Governance Basics"
description: "Data quality doesn't maintain itself. Governance defines who is responsible for which data, how changes are approved, and how issues are escalated."
order: 4
chapter: "data-02-data-quality-and-impact"
estimatedMinutes: 4
topicLayout: "prose-topic"
---

## Why governance exists

Data quality problems are almost always human process problems, not technical problems. The data isn't wrong because the system is broken — it's wrong because someone changed a process, a product, or a supplier and didn't update the planning data. Governance is the set of processes that ensure updates happen consistently and promptly.

## Core governance principles

**Data ownership**
Every critical data element should have a named owner — a person or team responsible for its accuracy. For demand forecasts, this is typically commercial planning or sales. For master data (BOMs, lead times, item attributes), it is typically the supply chain master data team. Without ownership, no one is accountable when data is wrong.

**Change management**
When a product changes — a new recipe, a new supplier, a new packaging format — the data in o9 must be updated before the next planning run. This requires a process: a trigger (the change decision), an action (update the data), and a verification (confirm the update was applied correctly).

**Audit trails**
Changes to planning-critical data should be logged: what changed, who changed it, and when. This makes it possible to trace a plan anomaly back to a data change, and to reverse errors quickly.

## Practical starting point

You don't need a full data governance programme on day one. Start with three questions:

1. Who is currently responsible for updating this data element when it changes?
2. How would we know if this data element were wrong?
3. How long would it take us to find and fix a data error before it affected the plan?

The answers usually reveal the biggest gaps.
```

- [ ] **Step 6: Create topic 05 — Improving Data Quality Over Time**

`src/content/chapters/data-02-data-quality-and-impact/05-improving-data-quality-over-time.md`:
```markdown
---
title: "Improving Data Quality Over Time"
description: "Data quality is not a one-time clean-up — it is an ongoing capability. This topic introduces the practices that sustain planning data quality as the business evolves."
order: 5
chapter: "data-02-data-quality-and-impact"
estimatedMinutes: 4
topicLayout: "prose-topic"
---

## Data quality decays

Even if your data is clean at go-live, it will degrade. Products change. Suppliers change. Forecasting models become stale. People leave and their tribal knowledge leaves with them. A supply chain that isn't actively maintained falls behind.

The goal is not to achieve perfect data once — it's to build practices that keep data quality above the threshold needed to plan effectively.

## Key practices

**Regular data health reviews**
Set a cadence — monthly or quarterly — to review key data quality metrics: percentage of active items with current forecasts, percentage of BOMs last reviewed in the past year, percentage of supplier lead times validated in the past six months. A dashboard is useful; a standing meeting with ownership is essential.

**Exception-driven correction**
Don't try to review all data regularly — use the plan as a filter. When planners flag anomalies ("why is this order so large?"), treat it as a data quality alert. Build a lightweight process to investigate, fix, and close the loop.

**Feedback from execution**
When planned orders create problems in execution — materials arriving late, production running short, transfers not arriving — trace back to the planning data. Execution failures are the most reliable signal that a data element needs attention.

**Gradual improvement, not big-bang clean-up**
Large data clean-up projects are expensive, slow, and often don't hold. A better model is incremental improvement: fix the data for the items that matter most today, build the process to keep them current, then expand scope.

## The goal

A planning team that can trust the data it works with. Not because the data is perfect, but because there are clear owners, clear processes, and a culture of treating data problems as urgent when they appear.
```

---

## Task 7: Update data.astro — replace "coming soon" with chapter list hub

**Files:**
- Modify: `src/pages/data.astro`

- [ ] **Step 1: Replace data.astro with pillar hub**

Replace the entire file content:

```astro
---
import BaseLayout from '../layouts/BaseLayout.astro';
import ThemeToggle from '../components/ThemeToggle.astro';
import { getChapters, getTopics } from '../lib/chapters';

const chapters = getChapters('data');
const allTopics = getTopics();

const iconMap: Record<string, string> = {
  cube: `<svg xmlns="http://www.w3.org/2000/svg" class="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M20 7l-8-4-8 4m16 0v10l-8 4M4 7v10l8 4"/></svg>`,
  cpu: `<svg xmlns="http://www.w3.org/2000/svg" class="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor"><rect x="6" y="6" width="12" height="12" rx="1" stroke-width="1.5"/><path stroke-linecap="round" stroke-width="1.5" d="M9 6V4M12 6V4M15 6V4M9 20v-2M12 20v-2M15 20v-2M6 9H4M6 12H4M6 15H4M20 9h-2M20 12h-2M20 15h-2"/></svg>`,
};
---
<BaseLayout>
  <div class="fixed top-4 right-4 z-50">
    <ThemeToggle />
  </div>

  <div class="relative overflow-hidden">
    <div class="absolute inset-0 bg-[linear-gradient(to_right,#e5e7eb_1px,transparent_1px),linear-gradient(to_bottom,#e5e7eb_1px,transparent_1px)] dark:bg-[linear-gradient(to_right,#1f2937_1px,transparent_1px),linear-gradient(to_bottom,#1f2937_1px,transparent_1px)] bg-[size:64px_64px] opacity-60 dark:opacity-40 pointer-events-none"></div>
    <div class="absolute inset-0 bg-radial-gradient pointer-events-none"></div>

    <div class="relative z-10 px-6 pt-6 max-w-3xl mx-auto">
      <a href="/" class="inline-flex items-center gap-1.5 text-sm text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors">
        <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"/>
        </svg>
        The New Era of Planning
      </a>
    </div>

    <div class="relative z-10 px-6 pt-12 pb-12 max-w-3xl mx-auto text-center animate-fade-in">
      <div class="inline-flex items-center gap-2 text-xs font-medium text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-200 dark:border-emerald-500/30 rounded-full px-3 py-1 mb-6">
        <span class="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
        Data
      </div>
      <h1 class="text-5xl sm:text-6xl font-bold text-gray-900 dark:text-white mb-6 leading-tight tracking-tight">
        Data-Driven <span class="text-transparent bg-clip-text bg-gradient-to-r from-emerald-500 to-teal-500">Planning</span>
      </h1>
      <p class="text-xl text-gray-600 dark:text-gray-400 max-w-xl mx-auto leading-relaxed">
        Understand how data quality and structure determine the quality of every plan your organisation produces.
      </p>
    </div>

    <div class="relative z-10 px-6 pb-20 max-w-6xl mx-auto">
      <div class="flex flex-col gap-4 max-w-3xl mx-auto">
      {chapters.map((chapter, i) => {
        const topics = allTopics.filter(t => t.chapterSlug === chapter.slug);
        return (
          <a
            href={`${import.meta.env.BASE_URL}chapters/${chapter.slug}`}
            class="group relative flex flex-col p-6 rounded-2xl border bg-emerald-50 dark:bg-emerald-500/5 border-emerald-200 dark:border-emerald-500/30 hover:border-emerald-400 dark:hover:border-emerald-400 transition-all duration-200 hover:-translate-y-1 hover:shadow-xl"
          >
            <span class="text-xs font-mono font-bold text-emerald-600 dark:text-emerald-400 mb-4">0{chapter.order}</span>
            <div class="flex items-start gap-4 mb-4">
              <div class="text-emerald-600 dark:text-emerald-400 mt-0.5 shrink-0" set:html={iconMap[chapter.icon] ?? iconMap['cube']} />
              <div>
                <h3 class="text-lg font-semibold text-gray-900 dark:text-white leading-snug">{chapter.title}</h3>
                <p class="text-sm text-gray-500 dark:text-gray-400 mt-1 leading-relaxed">{chapter.description}</p>
              </div>
            </div>
            <div class="flex items-center justify-between mt-auto pt-4 border-t border-emerald-100 dark:border-emerald-500/10">
              <span class="text-xs text-gray-400 dark:text-gray-500">{topics.length} topics</span>
              <div class="flex items-center gap-1 text-xs text-emerald-600 dark:text-emerald-400 opacity-0 group-hover:opacity-100 transition-opacity">
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

  <footer class="border-t border-gray-200 dark:border-gray-800 px-6 py-8 text-center text-sm text-gray-400 dark:text-gray-600">
    <p>Built with Astro · Content in Markdown · Maintained with Claude</p>
  </footer>
</BaseLayout>

<style>
  .bg-radial-gradient {
    background: radial-gradient(ellipse 80% 50% at 50% -20%, rgba(16,185,129,0.08), transparent);
  }
  :global(.dark) .bg-radial-gradient {
    background: radial-gradient(ellipse 80% 50% at 50% -20%, rgba(16,185,129,0.15), transparent);
  }
</style>
```

---

## Task 8: Create Process Chapter 1 — Scenario Planning Fundamentals

**Files:** Create `src/content/chapters/process-01-scenario-planning-fundamentals/` with 6 files.

- [ ] **Step 1: Create _meta.json**

`src/content/chapters/process-01-scenario-planning-fundamentals/_meta.json`:
```json
{
  "title": "Scenario Planning Fundamentals",
  "description": "Understand what scenario planning is, when to use it, and how a structured what-if process leads to better planning decisions.",
  "icon": "beaker",
  "color": "violet",
  "order": 1,
  "pillar": "process"
}
```

- [ ] **Step 2: Create topic 01 — What is Scenario Planning?**

`src/content/chapters/process-01-scenario-planning-fundamentals/01-what-is-scenario-planning.md`:
```markdown
---
title: "What is Scenario Planning?"
description: "Scenario planning is the discipline of exploring alternative futures before committing to a course of action. In o9, it means running parallel plans."
order: 1
chapter: "process-01-scenario-planning-fundamentals"
estimatedMinutes: 4
topicLayout: "prose-topic"
---

## Planning under uncertainty

Every supply chain plan is built on assumptions: what customers will order, how much capacity will be available, whether suppliers will deliver on time. Most of the time, those assumptions hold well enough. But supply chains face disruption — a demand spike, a raw material shortage, a logistics crisis — and when they do, a plan built on yesterday's assumptions becomes immediately wrong.

Scenario planning is the practice of asking "what if?" **before** uncertainty resolves. Instead of maintaining one plan and scrambling when conditions change, you maintain several: the baseline plan you're executing against, and one or more alternatives that explore different futures.

## What a scenario is

In o9, a scenario is a **copy of the planning model** with modified assumptions. You might create a scenario that models a 20% demand increase for a key product line, or a scenario that models a supplier delivering at 70% of normal capacity, or a scenario that tests the impact of delaying a production shutdown.

Within that scenario, the planning engine calculates a new plan: what orders would need to be placed, what inventory would build or deplete, what capacity would be tight. You can see the consequences of the assumption change without changing the live plan.

## The core benefit

Scenario planning replaces reactive firefighting with proactive preparation. When the demand spike actually arrives, you've already modelled it. You know which resources get constrained first, which customers to prioritise, and what the inventory implications are. The decision is faster because the analysis is already done.

It also changes the quality of conversations with stakeholders. Instead of "we'll need to assess the impact," you can say "we already ran this scenario — here's what it means."
```

- [ ] **Step 3: Create topic 02 — When to Use Scenario Planning**

`src/content/chapters/process-01-scenario-planning-fundamentals/02-when-to-use-scenario-planning.md`:
```markdown
---
title: "When to Use Scenario Planning"
description: "Not every planning decision warrants a scenario. Knowing the triggers — demand uncertainty, supply risk, new launches — helps you apply the practice where it adds the most value."
order: 2
chapter: "process-01-scenario-planning-fundamentals"
estimatedMinutes: 3
topicLayout: "prose-topic"
---

## Scenario planning is not for routine planning

The baseline plan already handles routine demand and supply variations through safety stock, replenishment logic, and standard exception management. You don't need a scenario every time a forecast changes or a purchase order is late.

Scenarios add value when the decision is **consequential and uncertain** — when the business needs to choose between paths that have meaningfully different outcomes, and when the right path isn't obvious from the baseline plan.

## High-value triggers

**Demand uncertainty**
A new promotion, a large tender, a market entry into a new region, or a potential demand spike from a competitor going out of stock. The baseline plan may not model the upside; a scenario lets you see what it would take to serve it.

**Supply risk**
A supplier quality issue, a port disruption, a raw material shortage, or a production line going down for maintenance. How long can you run before stockouts? Which customers or products should you protect?

**New product launches**
Launches carry significant forecast uncertainty. A scenario exploring higher-than-expected demand early in the lifecycle helps you understand whether you have the capacity and components to respond — before the product is in market.

**S&OP cycle inputs**
Many organisations run scenarios as a standard input to monthly Sales & Operations Planning. Each scenario represents a different business assumption (optimistic growth, conservative growth, base case) so the leadership team can see the trade-offs before committing to a plan.

## The cost of over-using scenarios

Scenarios take time to build, review, and communicate. If every planner runs a scenario for every minor change, the process becomes noise. The discipline is knowing when the uncertainty is large enough and the decision consequential enough that the investment is worth it.
```

- [ ] **Step 4: Create topic 03 — Types of Scenarios in Supply Chain**

`src/content/chapters/process-01-scenario-planning-fundamentals/03-types-of-scenarios.md`:
```markdown
---
title: "Types of Scenarios in Supply Chain"
description: "Demand scenarios, supply scenarios, and constraint scenarios serve different questions. Understanding the types helps you frame the right what-if."
order: 3
chapter: "process-01-scenario-planning-fundamentals"
estimatedMinutes: 3
topicLayout: "prose-topic"
---

## Demand-side scenarios

Demand scenarios explore what happens if customers buy more or less than the baseline forecast. They answer questions like:

- What if this product sells 30% above forecast in Q4?
- What if we win this large tender and need to serve an additional distribution centre?
- What if the promotional uplift is twice what the commercial team is forecasting?

In these scenarios, you adjust the demand signal and let the engine recalculate what supply, inventory, and capacity would need to look like.

## Supply-side scenarios

Supply scenarios explore what happens if your ability to supply is constrained or disrupted. They answer questions like:

- What if Supplier A can only deliver 60% of their contracted volume for the next 8 weeks?
- What if Line 3 goes down for emergency maintenance for two weeks?
- What if port congestion extends transit times by 10 days?

In these scenarios, you constrain a supply input and observe the downstream effects: which products stockout, which customers are affected, and how long until you recover.

## Mixed scenarios

Some of the most useful scenarios combine demand and supply changes — because real disruptions often involve both. A weather event that disrupts both a production site and increases demand for certain categories simultaneously is a mixed scenario.

## Constraint scenarios

Constraint scenarios explore the limits of your network under normal demand. They answer questions like:

- What is our maximum throughput on Line 2 if we run it 24/7?
- At what point does this warehouse run out of storage capacity given current growth?
- Which bottleneck constrains us first if demand grows 15% year-over-year?

These scenarios are more analytical than reactive — they help you understand the structural limits of your supply chain before those limits become crises.
```

- [ ] **Step 5: Create topic 04 — The Scenario Planning Process**

`src/content/chapters/process-01-scenario-planning-fundamentals/04-the-scenario-planning-process.md`:
```markdown
---
title: "The Scenario Planning Process"
description: "A good scenario planning process has four steps: define the question, model the assumption, compare the outputs, and decide. Skipping steps creates confusion."
order: 4
chapter: "process-01-scenario-planning-fundamentals"
estimatedMinutes: 4
topicLayout: "prose-topic"
---

## Step 1: Define the question

A scenario without a clear question is just an experiment. Before opening o9, know what decision you're trying to support.

Good scenario questions:
- "Should we accept this large order given our current capacity situation?"
- "How much buffer stock do we need to build before this supplier goes to maintenance?"
- "Can we cut inventory 15% without increasing stockout risk?"

Bad scenario questions:
- "What does a disruption look like?" (too vague — disruption of what?)
- "What if something goes wrong?" (no specific assumption to model)

The question defines which assumptions to change, which outputs to examine, and what a "good" vs "bad" result looks like.

## Step 2: Model the assumption

This is the technical step — making the change in o9 that represents the what-if. You might:
- Adjust demand quantities for specific items and periods
- Modify a supplier's delivery capability
- Block or constrain a production resource
- Change a lead time or transit time

The key discipline: change only what the scenario is testing. If you change too many things at once, you can't tell which change drove which outcome.

## Step 3: Compare the outputs

Run the scenario and compare the plan it produces against the baseline. The comparison should be structured: which KPIs changed, by how much, and where in the network?

Useful comparisons:
- Inventory levels by location and period
- Service level (can we fulfil all demand?)
- Production load by resource
- Cost implications (additional orders, expedite costs)

## Step 4: Decide

The scenario output is an input to a decision, not the decision itself. Someone with authority over the business outcome needs to review the comparison, make a call, and communicate it. Document the decision and the scenario that supported it — future planners will want to understand why the baseline changed.
```

- [ ] **Step 6: Create topic 05 — Setting Up Effective Scenarios**

`src/content/chapters/process-01-scenario-planning-fundamentals/05-setting-up-effective-scenarios.md`:
```markdown
---
title: "Setting Up Effective Scenarios"
description: "The quality of a scenario depends on how it is framed. Good scenarios are specific, comparable, and bounded."
order: 5
chapter: "process-01-scenario-planning-fundamentals"
estimatedMinutes: 3
topicLayout: "prose-topic"
---

## The principles of a well-framed scenario

**Specific, not general**
"Demand increases" is not a scenario. "Demand for Product X at Warehouse A increases 25% in weeks 14–20" is a scenario. Specificity is what makes a scenario actionable — and what makes it falsifiable when reality plays out.

**Comparable to the baseline**
A scenario only tells you something useful if you can compare it to what you planned without the change. Always run your scenario against a fixed baseline, and keep the baseline stable while the scenario varies.

**Bounded in scope**
Don't try to model everything at once. A scenario that changes demand, supply, lead times, and pricing simultaneously produces outputs that are hard to interpret. Bound each scenario to the fewest assumptions needed to answer the question.

**Labelled clearly**
A scenario called "Scenario 3" tells future reviewers nothing. A scenario called "Supplier A 60% capacity weeks 14-20 — base demand" tells them exactly what was modelled and when.

## What to keep fixed

When you change an assumption in a scenario, keep everything else as close to the baseline as possible. Don't adjust safety stock, replenishment parameters, or planning horizons unless those changes are specifically what you're testing. Extraneous changes create noise and make the scenario harder to interpret.

## A note on scenario proliferation

It is tempting to run many scenarios. Resist this. Two or three well-framed scenarios that address the real decision at hand are far more useful than ten loosely framed ones. The bottleneck is usually review time and decision bandwidth — not the ability to generate scenarios.
```

---

## Task 9: Create Process Chapter 2 — Running Scenarios in o9

**Files:** Create `src/content/chapters/process-02-running-scenarios-in-o9/` with 6 files.

- [ ] **Step 1: Create _meta.json**

`src/content/chapters/process-02-running-scenarios-in-o9/_meta.json`:
```json
{
  "title": "Running Scenarios in o9",
  "description": "The practical how-to: creating, adjusting, comparing, and promoting scenarios within the o9 platform.",
  "icon": "network",
  "color": "violet",
  "order": 2,
  "pillar": "process"
}
```

- [ ] **Step 2: Create topic 01 — Creating a Scenario in o9**

`src/content/chapters/process-02-running-scenarios-in-o9/01-creating-a-scenario-in-o9.md`:
```markdown
---
title: "Creating a Scenario in o9"
description: "A scenario in o9 starts as a copy of the baseline plan. This topic covers how to create one, name it, and scope it correctly before making any changes."
order: 1
chapter: "process-02-running-scenarios-in-o9"
estimatedMinutes: 4
topicLayout: "prose-topic"
---

## What happens when you create a scenario

In o9, creating a scenario copies the current baseline planning model into an isolated workspace. Changes you make inside the scenario do not affect the baseline — the two exist in parallel. You can have multiple scenarios active at the same time, all branching from the same baseline.

This isolation is what makes scenario planning safe: you can model aggressive assumptions without disrupting the plan the business is executing against.

## Before you create

Before opening the scenario creation interface, be clear on:

1. **What question this scenario is answering** — write it down
2. **What assumption you will change** — be specific about item, location, quantity, and time period
3. **What output you will look at** — which KPI or view tells you whether the scenario is better or worse than the baseline

Creating a scenario without these three things defined usually results in a scenario that gets built, never compared, and eventually deleted without a decision.

## Creating the scenario

Navigate to the Scenarios module in o9. Select **New Scenario** and provide:

- **Name**: Use the format `[Context] — [Assumption] — [Scope]`. Example: `Q3 Review — Supplier A 60% capacity — All products`
- **Description**: One or two sentences explaining the question this scenario addresses and who requested it
- **Base version**: Confirm you are branching from the current approved baseline, not an older version or another scenario

Once created, the scenario is available in your scenario list. It is an exact copy of the baseline at the moment of creation — no changes have been applied yet.

## Scope selection

Some scenario interfaces allow you to limit the scope of the scenario to a subset of items, locations, or time periods. Use scope limiting when:
- The disruption or demand change only affects part of the network
- You want to keep the scenario run fast and the comparison focused

Do not limit scope in ways that exclude downstream effects — if a component shortage affects a finished good, the finished good needs to be in scope too.
```

- [ ] **Step 3: Create topic 02 — Adjusting Parameters & Assumptions**

`src/content/chapters/process-02-running-scenarios-in-o9/02-adjusting-parameters-and-assumptions.md`:
```markdown
---
title: "Adjusting Parameters & Assumptions"
description: "The substance of a scenario is the change you make to the model. This topic covers the main levers — demand, supply, capacity, and time — and how to adjust them precisely."
order: 2
chapter: "process-02-running-scenarios-in-o9"
estimatedMinutes: 5
topicLayout: "prose-topic"
---

## Working inside the scenario

Once a scenario is created, you work within it exactly as you would in the baseline plan — the same workbenches, the same views, the same tools. The difference is that every change you make stays inside the scenario boundary.

Before making any adjustments, confirm you are inside the correct scenario. o9 typically displays the active scenario name in the header or context bar. Working in the wrong scenario — or accidentally in the baseline — is a common mistake.

## Demand adjustments

To model a demand change, navigate to the demand workbench within your scenario. You can:

- **Override a specific forecast quantity** for a defined item, location, and time period
- **Apply a percentage uplift** across a product group or customer segment
- **Replace the statistical forecast** with a manual entry for one or more periods

When adjusting demand, document the source of the change in the override comment field. "Per commercial team email 12 June — promotion uplift estimate" is more useful than "override."

## Supply adjustments

To model a supply constraint, navigate to the supply or capacity workbench within your scenario. Common adjustments:

- **Reduce a supplier's available quantity** for specific items and periods — represents a supplier shortage or quality hold
- **Block a production resource** for a defined period — represents planned or unplanned downtime
- **Extend a lead time** for a lane or item — represents a logistics disruption

## What not to change in a scenario

Avoid changing planning parameters (safety stock targets, reorder policies, minimum order quantities) inside a scenario unless the scenario is specifically testing parameter changes. Changing parameters alongside demand or supply obscures the cause of any plan differences you observe.
```

- [ ] **Step 4: Create topic 03 — Running & Comparing Scenarios**

`src/content/chapters/process-02-running-scenarios-in-o9/03-running-and-comparing-scenarios.md`:
```markdown
---
title: "Running & Comparing Scenarios"
description: "After making adjustments, you run the planning engine inside the scenario and compare the results against the baseline. This is where the value of scenario planning becomes visible."
order: 3
chapter: "process-02-running-scenarios-in-o9"
estimatedMinutes: 5
topicLayout: "prose-topic"
---

## Running the planning engine in a scenario

Once your adjustments are in place, trigger a planning run inside the scenario. In o9 this is typically a **recalculate** or **run plan** action available within the scenario workbench.

The engine will process your scenario's modified inputs — demand, supply, capacity — and produce a new set of planned orders, inventory projections, and resource loads. Depending on the size of your network and the scope of the scenario, this may take seconds to several minutes.

Do not compare results until the run is complete and the status shows as finished. Partial results can be misleading.

## What to compare

The comparison between your scenario and the baseline should be structured around the question you defined before creating the scenario. Typical comparison points:

**Inventory levels**
Does the scenario result in more or less inventory? Where in the network does the difference concentrate? Are there locations that stockout in the scenario but not the baseline?

**Service level**
Can all demand be fulfilled in the scenario? Which items or customers are affected if supply is constrained?

**Production and purchase orders**
What additional orders would need to be placed to fulfil demand in the scenario? Are there orders that could be reduced? What is the cost difference?

**Resource utilisation**
Which production resources become bottlenecks under the scenario assumptions? Are any resources over 100% utilised (infeasible)?

## Using the comparison view

o9 provides side-by-side and delta views for comparing a scenario against the baseline. Use the delta view — which shows only the differences — to focus your attention on what changed rather than reviewing everything from scratch.

Filter the comparison by time period and location to narrow to the part of the network most affected by your scenario assumption.

## Documenting findings

Before presenting or deciding on a scenario, write a short summary of what the comparison shows: the key differences, their magnitude, and their business implications. This summary becomes the input to the decision conversation.
```

- [ ] **Step 5: Create topic 04 — Promoting a Scenario to Baseline**

`src/content/chapters/process-02-running-scenarios-in-o9/04-promoting-a-scenario-to-baseline.md`:
```markdown
---
title: "Promoting a Scenario to Baseline"
description: "When a scenario represents the plan the business wants to execute, it can be promoted to become the new baseline. This is a consequential action that requires care."
order: 4
chapter: "process-02-running-scenarios-in-o9"
estimatedMinutes: 4
topicLayout: "prose-topic"
---

## What promotion means

Promoting a scenario to baseline means the scenario's plan replaces the current baseline as the version the business executes against. Orders generated from the scenario become the source of truth for procurement, production, and logistics.

This is different from sharing or presenting a scenario. Promotion is a commitment — it changes what gets executed.

## When to promote

Promote a scenario when:
- A decision has been made to act on the scenario's assumptions (the disruption is confirmed, the promotion is approved, the tender is accepted)
- The scenario has been reviewed and approved by the appropriate decision-makers
- The scenario's planning run is complete and up to date

Do not promote a scenario that was built on outdated data, or one that has been sitting for more than one planning cycle without a refresh. Stale scenarios produce plans that are already wrong when they become baseline.

## Before promoting

Complete a pre-promotion checklist:
1. Confirm the scenario name and description accurately reflect what was modelled
2. Confirm the planning run is current (run date)
3. Confirm the decision and its authorisation are documented (who approved, on what basis)
4. Confirm downstream systems are prepared to receive new planned orders

## After promoting

Once the promotion is complete:
- The previous baseline is retained as a historical version — you can compare back to it
- Downstream systems (ERP, WMS) receive updated planned orders on the next export cycle
- Archive or close scenarios that were alternatives to the one you promoted — they are no longer relevant

Communicate the promotion to anyone whose work depends on the plan: procurement, production scheduling, logistics. A baseline change without communication creates confusion in execution.
```

- [ ] **Step 6: Create topic 05 — Communicating Scenario Findings**

`src/content/chapters/process-02-running-scenarios-in-o9/05-communicating-scenario-findings.md`:
```markdown
---
title: "Communicating Scenario Findings"
description: "A scenario that produces good analysis but isn't communicated well doesn't drive good decisions. This topic covers how to translate scenario outputs into stakeholder conversations."
order: 5
chapter: "process-02-running-scenarios-in-o9"
estimatedMinutes: 4
topicLayout: "prose-topic"
---

## Scenarios inform decisions, people make them

The planning team's job is to model the scenarios, structure the comparison, and present the implications clearly enough that decision-makers can act. The actual decision — which risk to take, which trade-off to accept, which investment to make — belongs to the business.

This means communication is not a finishing step — it is the point of the exercise.

## What stakeholders need to know

Different audiences need different things from a scenario comparison.

**Executives and S&OP leaders**
Need to understand the business impact: revenue at risk, cost to serve, margin implications, customer service trade-offs. They do not need to understand how the scenario was built. Lead with the bottom line and offer the detail on request.

**Commercial teams**
Need to understand demand-supply balance: which products and customers are at risk, and what the mitigation options are. Focus on service level and allocation recommendations.

**Operations and logistics**
Need to understand what actions would need to change: which orders to place, which transfers to expedite, which production plans to adjust. Be specific about timing and quantities.

## Structure of a scenario briefing

A clear scenario briefing has four components:

1. **The question**: What decision does this scenario support?
2. **The assumption**: What changed relative to baseline, and why?
3. **The impact**: What does the plan look like under this assumption? (Quantified)
4. **The options**: What can the business do in response? What are the trade-offs?

Keep it short. One page is almost always enough. Stakeholders who want more detail can ask for the o9 workbench view.

## The language of uncertainty

Be honest about what scenarios can and can't tell you. A scenario shows the plan implications of an assumption — it does not predict that the assumption will come true. Use language that reflects this: "if demand increases 25%, we would need to place these orders" rather than "demand will increase 25% and we will need these orders."

Maintaining this distinction keeps stakeholders calibrated and keeps the planning team credible when scenarios don't perfectly predict reality.
```

---

## Task 10: Update process.astro — replace "coming soon" with chapter list hub

**Files:**
- Modify: `src/pages/process.astro`

- [ ] **Step 1: Replace process.astro with pillar hub**

Replace the entire file content:

```astro
---
import BaseLayout from '../layouts/BaseLayout.astro';
import ThemeToggle from '../components/ThemeToggle.astro';
import { getChapters, getTopics } from '../lib/chapters';

const chapters = getChapters('process');
const allTopics = getTopics();

const iconMap: Record<string, string> = {
  beaker: `<svg xmlns="http://www.w3.org/2000/svg" class="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M9 3h6m-6 0v7l-4 9a1 1 0 001 1h12a1 1 0 001-1l-4-9V3"/></svg>`,
  network: `<svg xmlns="http://www.w3.org/2000/svg" class="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor"><circle cx="12" cy="5" r="2" stroke-width="1.5"/><circle cx="5" cy="19" r="2" stroke-width="1.5"/><circle cx="19" cy="19" r="2" stroke-width="1.5"/><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M12 7v4m0 4l-5 2m10-2l-5 2"/></svg>`,
};
---
<BaseLayout>
  <div class="fixed top-4 right-4 z-50">
    <ThemeToggle />
  </div>

  <div class="relative overflow-hidden">
    <div class="absolute inset-0 bg-[linear-gradient(to_right,#e5e7eb_1px,transparent_1px),linear-gradient(to_bottom,#e5e7eb_1px,transparent_1px)] dark:bg-[linear-gradient(to_right,#1f2937_1px,transparent_1px),linear-gradient(to_bottom,#1f2937_1px,transparent_1px)] bg-[size:64px_64px] opacity-60 dark:opacity-40 pointer-events-none"></div>
    <div class="absolute inset-0 bg-radial-gradient pointer-events-none"></div>

    <div class="relative z-10 px-6 pt-6 max-w-3xl mx-auto">
      <a href="/" class="inline-flex items-center gap-1.5 text-sm text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors">
        <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"/>
        </svg>
        The New Era of Planning
      </a>
    </div>

    <div class="relative z-10 px-6 pt-12 pb-12 max-w-3xl mx-auto text-center animate-fade-in">
      <div class="inline-flex items-center gap-2 text-xs font-medium text-violet-600 dark:text-violet-400 bg-violet-50 dark:bg-violet-500/10 border border-violet-200 dark:border-violet-500/30 rounded-full px-3 py-1 mb-6">
        <span class="w-1.5 h-1.5 rounded-full bg-violet-500 animate-pulse"></span>
        Process
      </div>
      <h1 class="text-5xl sm:text-6xl font-bold text-gray-900 dark:text-white mb-6 leading-tight tracking-tight">
        Scenario <span class="text-transparent bg-clip-text bg-gradient-to-r from-violet-500 to-purple-500">Planning</span>
      </h1>
      <p class="text-xl text-gray-600 dark:text-gray-400 max-w-xl mx-auto leading-relaxed">
        Learn how to use what-if scenarios to explore uncertainty, compare outcomes, and make better planning decisions.
      </p>
    </div>

    <div class="relative z-10 px-6 pb-20 max-w-6xl mx-auto">
      <div class="flex flex-col gap-4 max-w-3xl mx-auto">
      {chapters.map((chapter, i) => {
        const topics = allTopics.filter(t => t.chapterSlug === chapter.slug);
        return (
          <a
            href={`${import.meta.env.BASE_URL}chapters/${chapter.slug}`}
            class="group relative flex flex-col p-6 rounded-2xl border bg-violet-50 dark:bg-violet-500/5 border-violet-200 dark:border-violet-500/30 hover:border-violet-400 dark:hover:border-violet-400 transition-all duration-200 hover:-translate-y-1 hover:shadow-xl"
          >
            <span class="text-xs font-mono font-bold text-violet-600 dark:text-violet-400 mb-4">0{chapter.order}</span>
            <div class="flex items-start gap-4 mb-4">
              <div class="text-violet-600 dark:text-violet-400 mt-0.5 shrink-0" set:html={iconMap[chapter.icon] ?? iconMap['beaker']} />
              <div>
                <h3 class="text-lg font-semibold text-gray-900 dark:text-white leading-snug">{chapter.title}</h3>
                <p class="text-sm text-gray-500 dark:text-gray-400 mt-1 leading-relaxed">{chapter.description}</p>
              </div>
            </div>
            <div class="flex items-center justify-between mt-auto pt-4 border-t border-violet-100 dark:border-violet-500/10">
              <span class="text-xs text-gray-400 dark:text-gray-500">{topics.length} topics</span>
              <div class="flex items-center gap-1 text-xs text-violet-600 dark:text-violet-400 opacity-0 group-hover:opacity-100 transition-opacity">
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

  <footer class="border-t border-gray-200 dark:border-gray-800 px-6 py-8 text-center text-sm text-gray-400 dark:text-gray-600">
    <p>Built with Astro · Content in Markdown · Maintained with Claude</p>
  </footer>
</BaseLayout>

<style>
  .bg-radial-gradient {
    background: radial-gradient(ellipse 80% 50% at 50% -20%, rgba(139,92,246,0.08), transparent);
  }
  :global(.dark) .bg-radial-gradient {
    background: radial-gradient(ellipse 80% 50% at 50% -20%, rgba(139,92,246,0.15), transparent);
  }
</style>
```

---

## Task 11: Verify

- [ ] **Step 1: Run dev server**

```bash
npm run dev
```

Expected: server starts on localhost:4321 with no build errors.

- [ ] **Step 2: Check /data page**

Navigate to `http://localhost:4321/data`. Expected: chapter list showing "Planning Data Fundamentals" and "Data Quality & Its Impact" cards (not "coming soon").

- [ ] **Step 3: Check /process page**

Navigate to `http://localhost:4321/process`. Expected: chapter list showing "Scenario Planning Fundamentals" and "Running Scenarios in o9" cards.

- [ ] **Step 4: Navigate into a Data chapter**

Click "Planning Data Fundamentals". Expected: topic list with 5 topics, back-link reads "Data" and links to `/data`.

- [ ] **Step 5: Navigate into a topic**

Click any topic. Expected: topic page renders with content, prev/next navigation stays within the Data pillar.

- [ ] **Step 6: Check Technology pillar is unchanged**

Navigate to `/technology/how-o9-works`. Expected: only Technology chapters visible (not Data or Process chapters).

- [ ] **Step 7: Commit**

```bash
git add src/lib/chapters.ts src/content/chapters/data-01-planning-data-fundamentals src/content/chapters/data-02-data-quality-and-impact src/content/chapters/process-01-scenario-planning-fundamentals src/content/chapters/process-02-running-scenarios-in-o9 src/pages/data.astro src/pages/process.astro src/pages/technology/how-o9-works/index.astro src/pages/chapters/[chapter]/index.astro
git add $(find src/content/chapters/01-understanding-basics src/content/chapters/02-the-network src/content/chapters/03-demand-data-flow src/content/chapters/03-the-logic src/content/chapters/04-supply-data-flow src/content/chapters/04-the-simulation src/content/chapters/99-layout-showcase -name "_meta.json")
git commit -m "feat: build out Data and Process pillars with chapter content"
```
