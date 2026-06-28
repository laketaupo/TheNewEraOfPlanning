# Technology Pillar Overlap Cleanup — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Eliminate four structural overlaps in the technology pillar: remove redundant per-module best-practices chapters, clarify arch-chapter scope vs system data-flow chapters, add missing FMS/MDM symmetry chapters plus a bridging chapter, and lock down the scope of each system's `-01` basics chapter.

**Architecture:** Phase 1 runs four task groups in parallel (each touches distinct files). Phase 2 is a single sequential task that reconciles the two shared registry files (`order.json`, `chapter-phases.json`). Phase 3 verifies the build.

**Tech Stack:** Astro 4 static site, MDX, JSON content registries. Build command: `npm run build`. No automated tests — a clean build is the pass/fail signal.

## Global Constraints

- Never add numeric prefixes (`NN-`) to topic filenames — the content loader matches by slug without prefix.
- `theme` and `module` are required in every `_meta.json`.
- All new chapter slugs must be registered in `src/content/order.json` (chapters and topics sections) **and** `src/content/chapter-phases.json` before the build will pass.
- `hidden: true` chapters are invisible in nav but still built — don't use it here.
- Build with `npm run build` (runs `astro build` then `pagefind --site dist`). A clean build with 0 errors = done.

---

## Phase 1 — Parallel Tasks (run all four simultaneously)

---

### Task 1A: Delete Per-Module Best-Practices Chapter Folders

**Context:** Three chapter folders exist solely as structural placeholders — all have 0 topics and `comingSoon: true`. Removing them eliminates the best-practices fragmentation. The `adoption-and-usage-quality` module becomes the sole home for cross-cutting guidance.

**Files:**
- Delete: `src/content/chapters/planning-software-best-practices/` (entire folder)
- Delete: `src/content/chapters/erp-best-practices/` (entire folder)
- Delete: `src/content/chapters/supporting-systems-best-practices/` (entire folder)
- *(Do NOT touch `order.json` or `chapter-phases.json` yet — that is Task 2)*

- [ ] **Step 1: Confirm folder contents before deleting**

```bash
ls src/content/chapters/planning-software-best-practices/
ls src/content/chapters/erp-best-practices/
ls src/content/chapters/supporting-systems-best-practices/
```

Expected: each folder contains only `_meta.json` (no topic files).

- [ ] **Step 2: Delete all three folders**

```bash
rm -rf src/content/chapters/planning-software-best-practices
rm -rf src/content/chapters/erp-best-practices
rm -rf src/content/chapters/supporting-systems-best-practices
```

- [ ] **Step 3: Verify deletion**

```bash
ls src/content/chapters/ | grep best-practices
```

Expected: no output (folders gone).

---

### Task 1B: Clarify Arch Chapter Scope vs System Data-Flow Chapters

**Context:** `arch-how-systems-connect` has two integration topics that overlap with the per-system data-flow chapters (`erp-03/04`, `fms-04`, `mdm-04`). The arch topics already cover the right ground (batch timing, governance controls, failure modes, dependency chains) — they just need their descriptions scoped to *technical integration mechanics* so learners don't feel they're repeating the same material from the ERP/FMS/MDM modules.

**Files:**
- Modify: `src/content/chapters/arch-how-systems-connect/_meta.json`
- Modify: `src/content/chapters/arch-how-systems-connect/erp-planning-software-integration.md` (frontmatter description only)
- Modify: `src/content/chapters/arch-how-systems-connect/planning-software-fms-mdm.md` (frontmatter description only)
- Modify: `src/content/chapters/erp-03-data-flow-into-erp/_meta.json`
- Modify: `src/content/chapters/erp-04-data-flow-out-of-erp/_meta.json`
- Modify: `src/content/chapters/fms-04-data-flow-out-of-fms/_meta.json`
- Modify: `src/content/chapters/mdm-04-data-flow-out-of-mdm/_meta.json`

- [ ] **Step 1: Update arch-how-systems-connect chapter description**

Edit `src/content/chapters/arch-how-systems-connect/_meta.json`:

```json
{
  "title": "How the Systems Connect",
  "description": "The technical plumbing between ERP, Planning software, FMS, and MDM — interface types, batch run timing, data upload patterns, and what breaks when integrations fail. For what data each system sends or receives, see the data-flow chapters within each system's module.",
  "icon": "switch-horizontal",
  "color": "emerald",
  "theme": "technology",
  "module": "tool-landscape"
}
```

- [ ] **Step 2: Update erp-planning-software-integration.md frontmatter description**

In `src/content/chapters/arch-how-systems-connect/erp-planning-software-integration.md`, replace only the `description` field in frontmatter:

```
description: "How the ERP ↔ Planning software link works technically — what triggers the exchange, the batch cycle that drives it, common failure modes, and the governance control that prevents unreviewed planned orders from auto-releasing to ERP."
```

- [ ] **Step 3: Update planning-software-fms-mdm.md frontmatter description**

In `src/content/chapters/arch-how-systems-connect/planning-software-fms-mdm.md`, replace only the `description` field in frontmatter:

```
description: "How Planning software connects to FMS and MDM technically — integration frequency, the master data dependency chain that must complete before a new item is plannable, and why item-code mapping between systems is a recurring failure point."
```

- [ ] **Step 4: Update ERP data-flow chapter descriptions to scope them as business-data perspective**

Edit `src/content/chapters/erp-03-data-flow-into-erp/_meta.json`:

```json
{
  "title": "Data Flow: Into ERP",
  "description": "What operational data enters ERP, why it matters for planning, and where each data type originates — covering manual entry, system-generated transactions, and integration feeds. For the technical integration mechanics, see How the Systems Connect in the Tool Landscape module.",
  "icon": "office-building",
  "color": "emerald",
  "theme": "technology",
  "module": "erp"
}
```

Edit `src/content/chapters/erp-04-data-flow-out-of-erp/_meta.json`:

```json
{
  "title": "Data Flow: Out of ERP",
  "description": "What ERP sends to Planning software and other systems — the actuals, confirmations, and inventory signals that keep the plan grounded in reality, and what each signal means for the planning model. For the technical integration mechanics, see How the Systems Connect in the Tool Landscape module.",
  "icon": "office-building",
  "color": "emerald",
  "theme": "technology",
  "module": "erp"
}
```

- [ ] **Step 5: Update FMS and MDM data-flow chapter descriptions**

Edit `src/content/chapters/fms-04-data-flow-out-of-fms/_meta.json`:

```json
{
  "title": "What FMS Sends to Planning",
  "description": "The supply signals that flow from FMS into Planning software — yield forecasts, harvest schedules, and the actuals that close the loop on planned supply. For the technical integration mechanics, see How the Systems Connect in the Tool Landscape module.",
  "icon": "globe",
  "color": "emerald",
  "theme": "technology",
  "module": "supporting-systems"
}
```

Edit `src/content/chapters/mdm-04-data-flow-out-of-mdm/_meta.json`:

```json
{
  "title": "What MDM Sends to Planning",
  "description": "How MDM distributes master data to Planning software, ERP, FMS, and other systems — and what to do when systems fall out of sync. For the technical integration mechanics, see How the Systems Connect in the Tool Landscape module.",
  "icon": "database",
  "color": "emerald",
  "theme": "technology",
  "module": "supporting-systems"
}
```

---

### Task 1C: Create Missing FMS/MDM Chapters and Bridging Chapter

**Context:** `supporting-systems` has FMS and MDM chapters numbered 01, 02, 04 — the "03" (data flow *into* each system) is missing, creating asymmetry with the ERP module (which has 03 and 04). A new bridging chapter also makes the module cohesive by explaining why FMS and MDM are grouped and how they differ.

**Files to create:**
- `src/content/chapters/fms-03-data-flow-into-fms/_meta.json`
- `src/content/chapters/fms-03-data-flow-into-fms/where-field-data-originates.md`
- `src/content/chapters/fms-03-data-flow-into-fms/how-field-activity-enters-fms.md`
- `src/content/chapters/fms-03-data-flow-into-fms/data-capture-and-validation.md`
- `src/content/chapters/mdm-03-data-flow-into-mdm/_meta.json`
- `src/content/chapters/mdm-03-data-flow-into-mdm/where-master-data-originates.md`
- `src/content/chapters/mdm-03-data-flow-into-mdm/how-data-enters-mdm.md`
- `src/content/chapters/mdm-03-data-flow-into-mdm/data-validation-in-mdm.md`
- `src/content/chapters/fms-mdm-in-the-landscape/_meta.json`
- `src/content/chapters/fms-mdm-in-the-landscape/why-they-are-grouped.md`
- `src/content/chapters/fms-mdm-in-the-landscape/fms-vs-mdm-key-differences.md`
- `src/content/chapters/fms-mdm-in-the-landscape/how-fms-and-mdm-interact.md`

*(Do NOT touch `order.json` or `chapter-phases.json` yet — that is Task 2)*

- [ ] **Step 1: Create fms-03-data-flow-into-fms chapter**

Create `src/content/chapters/fms-03-data-flow-into-fms/_meta.json`:

```json
{
  "title": "Data Flow: Into FMS",
  "description": "Where field-level data originates — grower contracts, planting records, and agronomic inputs — and how that data enters FMS to become usable supply signals for Planning software.",
  "icon": "globe",
  "color": "emerald",
  "theme": "technology",
  "module": "supporting-systems"
}
```

Create `src/content/chapters/fms-03-data-flow-into-fms/where-field-data-originates.md`:

```markdown
---
title: "Where Field Data Originates"
description: "Field data does not start in a system — it starts in a field. Understanding where each type of field data comes from is the foundation for understanding what FMS can and cannot tell the planning model."
chapter: "fms-03-data-flow-into-fms"
estimatedMinutes: 4
topicLayout: "prose-topic"
---

*Content coming soon.*
```

Create `src/content/chapters/fms-03-data-flow-into-fms/how-field-activity-enters-fms.md`:

```markdown
---
title: "How Field Activity Enters FMS"
description: "Grower contracts, planting declarations, and crop progress updates each enter FMS through a different pathway — manual entry, mobile capture, or integration from agronomic tools."
chapter: "fms-03-data-flow-into-fms"
estimatedMinutes: 4
topicLayout: "prose-topic"
---

*Content coming soon.*
```

Create `src/content/chapters/fms-03-data-flow-into-fms/data-capture-and-validation.md`:

```markdown
---
title: "Data Capture and Validation in FMS"
description: "FMS applies validation rules at entry to prevent bad field data from propagating into the supply plan — what those rules are and what happens when data fails them."
chapter: "fms-03-data-flow-into-fms"
estimatedMinutes: 4
topicLayout: "prose-topic"
---

*Content coming soon.*
```

- [ ] **Step 2: Create mdm-03-data-flow-into-mdm chapter**

Create `src/content/chapters/mdm-03-data-flow-into-mdm/_meta.json`:

```json
{
  "title": "Data Flow: Into MDM",
  "description": "Where master data originates and how it enters MDM — from product creation requests and supplier updates to system-generated changes — before it is distributed to Planning software, ERP, and FMS.",
  "icon": "database",
  "color": "emerald",
  "theme": "technology",
  "module": "supporting-systems"
}
```

Create `src/content/chapters/mdm-03-data-flow-into-mdm/where-master-data-originates.md`:

```markdown
---
title: "Where Master Data Originates"
description: "Master data is created by people making product decisions — new product development, supplier onboarding, or organisational restructuring. Understanding who triggers master data creation is the first step to governing it."
chapter: "mdm-03-data-flow-into-mdm"
estimatedMinutes: 4
topicLayout: "prose-topic"
---

*Content coming soon.*
```

Create `src/content/chapters/mdm-03-data-flow-into-mdm/how-data-enters-mdm.md`:

```markdown
---
title: "How Data Enters MDM"
description: "Master data enters MDM through creation requests, bulk imports, or integration feeds — each with different governance requirements and risk profiles for the downstream planning model."
chapter: "mdm-03-data-flow-into-mdm"
estimatedMinutes: 4
topicLayout: "prose-topic"
---

*Content coming soon.*
```

Create `src/content/chapters/mdm-03-data-flow-into-mdm/data-validation-in-mdm.md`:

```markdown
---
title: "Data Validation in MDM"
description: "MDM validates new records against completeness rules, duplicate checks, and approval workflows before they are released to downstream systems — what those controls are and what bypassing them costs."
chapter: "mdm-03-data-flow-into-mdm"
estimatedMinutes: 4
topicLayout: "prose-topic"
---

*Content coming soon.*
```

- [ ] **Step 3: Create fms-mdm-in-the-landscape bridging chapter**

Create `src/content/chapters/fms-mdm-in-the-landscape/_meta.json`:

```json
{
  "title": "FMS and MDM in the Landscape",
  "description": "Why FMS and MDM are grouped as supporting systems, how they differ from each other, and how they interact — the context needed before diving into either system's detail.",
  "icon": "collection",
  "color": "emerald",
  "theme": "technology",
  "module": "supporting-systems"
}
```

Create `src/content/chapters/fms-mdm-in-the-landscape/why-they-are-grouped.md`:

```markdown
---
title: "Why FMS and MDM Are Supporting Systems"
description: "FMS and MDM are grouped not because they are similar, but because neither manages transactions or planning calculations — they supply the reference data and field signals that make ERP and Planning software work correctly."
chapter: "fms-mdm-in-the-landscape"
estimatedMinutes: 4
topicLayout: "prose-topic"
---

FMS and MDM sit in the same module not because they do the same thing, but because they play the same structural role in the planning landscape: they are the systems that ERP and Planning software depend on for accurate inputs, yet they do not own transactions and they do not run planning calculations.

**ERP** records what happens. **Planning Software** calculates what should happen. **FMS and MDM** provide the reference reality that both of those systems plan and execute against.

Without FMS, Planning software cannot see supply coming from the field — it is planning blind until product arrives at a warehouse gate. Without MDM, the item codes, BOMs, and planning parameters that ERP and Planning software use may be out of sync, inconsistent, or missing — corrupting every plan that touches an affected item.

The grouping reflects a governance reality as much as a technical one: issues in FMS and MDM tend to surface in ERP and Planning software, making the root cause harder to find. A planner who understands both supporting systems can trace discrepancies to their origin rather than treating them as planning-tool problems.
```

Create `src/content/chapters/fms-mdm-in-the-landscape/fms-vs-mdm-key-differences.md`:

```markdown
---
title: "FMS vs MDM: Key Differences"
description: "FMS and MDM are often confused because both feed Planning software — but they manage entirely different data types and serve entirely different planning needs."
chapter: "fms-mdm-in-the-landscape"
estimatedMinutes: 5
topicLayout: "prose-topic"
---

| Dimension | FMS | MDM |
|---|---|---|
| **Data type** | Operational field data (what is growing, where, when) | Reference master data (what products are, how they are structured) |
| **Data owner** | Field operations / agronomists | Product management / data stewardship teams |
| **Change frequency** | Daily to weekly (as growing conditions evolve) | Event-driven (new product, supplier change, reformulation) |
| **Effect on planning** | Changes supply-side quantity and timing in Planning software | Changes the structural rules Planning software and ERP use to plan and execute |
| **Risk if wrong** | Supply plan is built on incorrect yield or timing data | Plans and transactions use wrong parameters, BOMs, or item codes |
| **Who notices first** | Supply planner (unexpected supply signal change) | Demand or supply planner (item missing from plan, wrong netting logic) |

The practical implication: FMS errors tend to surface as **quantity or timing surprises** in the plan. MDM errors tend to surface as **structural gaps** — items that cannot be planned, transactions that fail validation, or parameters that produce nonsensical plan outputs.
```

Create `src/content/chapters/fms-mdm-in-the-landscape/how-fms-and-mdm-interact.md`:

```markdown
---
title: "How FMS and MDM Interact"
description: "FMS and MDM are not directly integrated with each other — but they share a critical dependency: FMS uses item codes that must match the MDM master record exactly, or the integration to Planning software breaks."
chapter: "fms-mdm-in-the-landscape"
estimatedMinutes: 4
topicLayout: "prose-topic"
---

FMS and MDM do not have a direct integration with each other in most implementations. They each connect independently to Planning software. But they share a dependency that is easy to overlook: **item codes**.

FMS records grower activity against crop variety codes — the codes it uses internally to identify what is planted. Planning software maps those codes to item records that Planning software received from MDM. If the variety code in FMS does not match the item code in MDM (and therefore in Planning software), the FMS supply signal arrives at Planning software referencing an item it cannot recognise.

The result is a silent planning gap: the supply signal is received but cannot be applied to any planning record. No error is raised in FMS. No error is raised in Planning software. The supply simply disappears from the plan.

**The dependency chain for a new crop variety to be plannable end-to-end:**

1. Item created in MDM with the correct variety code and planning parameters
2. Item synced from MDM to Planning software
3. Item synced from MDM to ERP
4. Grower contract set up in FMS using the same variety code
5. FMS → Planning software integration tested with the new variety code

Skipping or partially completing any step creates a ghost variety: present in one system, absent from another, with no automatic alert.
```

- [ ] **Step 4: Verify all new folders exist**

```bash
ls src/content/chapters/fms-03-data-flow-into-fms/
ls src/content/chapters/mdm-03-data-flow-into-mdm/
ls src/content/chapters/fms-mdm-in-the-landscape/
```

Expected: each lists `_meta.json` plus 3 topic files.

---

### Task 1D: Scope-Clarify the System *-01 Basics Chapters

**Context:** The `tool-landscape-overview` chapter (specifically `the-four-systems.md`) already covers what each system does and why the landscape needs all four. The per-system `-01` basics chapters risk repeating that same "what is X" content. Fix: update each `-01` chapter description to anchor it at *mechanics* (how the system is structured internally) rather than re-explaining the system's purpose. Add a cross-reference in each description back to the overview.

**Files:**
- Modify: `src/content/chapters/tool-landscape-overview/_meta.json`
- Modify: `src/content/chapters/erp-01-erp-basics/_meta.json`
- Modify: `src/content/chapters/fms-01-understanding-basics/_meta.json`
- Modify: `src/content/chapters/mdm-01-understanding-basics/_meta.json`
- Modify: `src/content/chapters/01-understanding-basics/_meta.json`

- [ ] **Step 1: Read current _meta.json files before editing**

```bash
cat src/content/chapters/tool-landscape-overview/_meta.json
cat src/content/chapters/erp-01-erp-basics/_meta.json
cat src/content/chapters/fms-01-understanding-basics/_meta.json
cat src/content/chapters/mdm-01-understanding-basics/_meta.json
cat src/content/chapters/01-understanding-basics/_meta.json
```

- [ ] **Step 2: Update tool-landscape-overview to lock its scope at "what exists and why"**

Edit `src/content/chapters/tool-landscape-overview/_meta.json` — update only the `description` field:

```
"description": "What the four systems are, why the planning landscape needs all four, and what breaks when any one is absent — the 'what exists and why' layer before diving into any system's mechanics."
```

- [ ] **Step 3: Update erp-01-erp-basics to anchor at mechanics**

Edit `src/content/chapters/erp-01-erp-basics/_meta.json` — update only the `description` field:

```
"description": "How ERP works internally — its evolution from legacy systems, the core concepts that govern transaction processing, and the structural assumptions that downstream planning depends on. For a high-level introduction to what ERP is and why it exists, see The Four Systems in the Tool Landscape module."
```

- [ ] **Step 4: Update fms-01-understanding-basics to anchor at mechanics**

Edit `src/content/chapters/fms-01-understanding-basics/_meta.json` — update only the `description` field:

```
"description": "How FMS works internally — what it tracks, why field management matters for supply chain planning, and the core concepts that connect field activity to the supply plan. For a high-level introduction to what FMS is and why it exists, see The Four Systems in the Tool Landscape module."
```

- [ ] **Step 5: Update mdm-01-understanding-basics to anchor at mechanics**

Edit `src/content/chapters/mdm-01-understanding-basics/_meta.json` — update only the `description` field:

```
"description": "How MDM works internally — what master data is, why data management matters across the system landscape, and the core concepts that underpin how MDM serves ERP, Planning software, and FMS. For a high-level introduction to what MDM is and why it exists, see The Four Systems in the Tool Landscape module."
```

- [ ] **Step 6: Update 01-understanding-basics (planning software) to anchor at mechanics**

Edit `src/content/chapters/01-understanding-basics/_meta.json` — update only the `description` field:

```
"description": "The fundamental building blocks of any supply chain network in Planning software — the elements every planning model is built from. For a high-level introduction to what Planning software is and why it exists, see The Four Systems in the Tool Landscape module."
```

---

## Phase 2 — Sequential: Update Shared Registry Files

**Prerequisite:** All four Phase 1 tasks must be complete before starting this task.

### Task 2: Update order.json and chapter-phases.json

**Context:** Both registry files are shared by all Phase 1 tasks. This task makes all structural changes in one place to avoid merge conflicts.

**Changes summary:**
- Remove 3 best-practices chapter slugs from `chapters` and their empty arrays from `topics`
- Remove 3 best-practices entries from `chapter-phases.json`
- Add `fms-03-data-flow-into-fms`, `mdm-03-data-flow-into-mdm`, `fms-mdm-in-the-landscape` to `chapters.supporting-systems` with correct ordering
- Add topic slug arrays for the 3 new chapters to `topics`
- Add the 3 new chapters to `chapter-phases.json` with correct phases

**Files:**
- Modify: `src/content/order.json`
- Modify: `src/content/chapter-phases.json`

- [ ] **Step 1: Update order.json — chapters.planning-software**

In `src/content/order.json`, in the `"chapters"` object, change `"planning-software"` array from:

```json
"planning-software": ["01-understanding-basics", "02-the-network", "03-data-flow", "planning-logic", "04-the-simulation", "05-navigation-and-ui", "planning-software-best-practices", "99-layout-showcase"]
```

to:

```json
"planning-software": ["01-understanding-basics", "02-the-network", "03-data-flow", "planning-logic", "04-the-simulation", "05-navigation-and-ui", "99-layout-showcase"]
```

- [ ] **Step 2: Update order.json — chapters.erp**

Change `"erp"` array from:

```json
"erp": ["erp-01-erp-basics", "erp-02-the-data-model", "erp-03-data-flow-into-erp", "erp-04-data-flow-out-of-erp", "erp-05-the-logic", "erp-06-key-erp-workflows", "erp-07-navigation-and-ui", "erp-best-practices"]
```

to:

```json
"erp": ["erp-01-erp-basics", "erp-02-the-data-model", "erp-03-data-flow-into-erp", "erp-04-data-flow-out-of-erp", "erp-05-the-logic", "erp-06-key-erp-workflows", "erp-07-navigation-and-ui"]
```

- [ ] **Step 3: Update order.json — chapters.supporting-systems**

Change `"supporting-systems"` array from:

```json
"supporting-systems": ["fms-01-understanding-basics", "fms-02-the-data-model", "fms-04-data-flow-out-of-fms", "fms-logic-and-workflows", "mdm-01-understanding-basics", "mdm-02-the-data-model", "mdm-04-data-flow-out-of-mdm", "mdm-logic-and-workflows", "supporting-systems-best-practices"]
```

to:

```json
"supporting-systems": ["fms-mdm-in-the-landscape", "fms-01-understanding-basics", "fms-02-the-data-model", "fms-03-data-flow-into-fms", "fms-04-data-flow-out-of-fms", "fms-logic-and-workflows", "mdm-01-understanding-basics", "mdm-02-the-data-model", "mdm-03-data-flow-into-mdm", "mdm-04-data-flow-out-of-mdm", "mdm-logic-and-workflows"]
```

- [ ] **Step 4: Update order.json — topics section: remove deleted chapters**

Remove these three entries from the `"topics"` object:

```json
"planning-software-best-practices": [],
"erp-best-practices": [],
"supporting-systems-best-practices": [],
```

- [ ] **Step 5: Update order.json — topics section: add new chapters**

Add these three entries to the `"topics"` object (place them near the other FMS/MDM topic entries):

```json
"fms-03-data-flow-into-fms": ["where-field-data-originates", "how-field-activity-enters-fms", "data-capture-and-validation"],
"mdm-03-data-flow-into-mdm": ["where-master-data-originates", "how-data-enters-mdm", "data-validation-in-mdm"],
"fms-mdm-in-the-landscape": ["why-they-are-grouped", "fms-vs-mdm-key-differences", "how-fms-and-mdm-interact"],
```

- [ ] **Step 6: Update chapter-phases.json — remove best-practices entries**

In `src/content/chapter-phases.json`:

Remove from `technology.planning-software`:
```json
"planning-software-best-practices": "optimization"
```

Remove from `technology.erp`:
```json
"erp-best-practices": "optimization"
```

Remove from `technology.supporting-systems`:
```json
"supporting-systems-best-practices": "optimization"
```

- [ ] **Step 7: Update chapter-phases.json — add new chapters**

In `technology.supporting-systems`, add:

```json
"fms-mdm-in-the-landscape": "awareness",
"fms-03-data-flow-into-fms": "conceptual",
"mdm-03-data-flow-into-mdm": "conceptual",
```

Place `"fms-mdm-in-the-landscape"` before `"fms-01-understanding-basics"`, `"fms-03-data-flow-into-fms"` after `"fms-02-the-data-model"`, and `"mdm-03-data-flow-into-mdm"` after `"mdm-02-the-data-model"`.

- [ ] **Step 8: Commit**

```bash
git add src/content/order.json src/content/chapter-phases.json
git commit -m "feat(technology): restructure supporting-systems and remove per-module best-practices chapters"
```

---

## Phase 3 — Build Verification

### Task 3: Verify Full Build

- [ ] **Step 1: Run the full build**

```bash
npm run build
```

Expected: exits with code 0, no errors in output. Pagefind index is generated after the Astro build.

- [ ] **Step 2: Confirm deleted chapters are gone from nav**

```bash
npm run preview
```

Open http://localhost:4321/TheNewEraOfPlanning/technology/planning-software/ and confirm there is no "Working Effectively with Planning Software" chapter card. Repeat for `/technology/erp/` and `/technology/supporting-systems/`.

- [ ] **Step 3: Confirm new chapters appear in nav**

On the Supporting Systems module page, confirm these chapter cards are present:
- "FMS and MDM in the Landscape" (first card)
- "Data Flow: Into FMS" (after FMS Data Model)
- "Data Flow: Into MDM" (after MDM Data Model)

- [ ] **Step 4: Commit all Phase 1 + Phase 3 file changes**

```bash
git add src/content/chapters/
git commit -m "feat(technology): add fms/mdm bridging chapter, fill fms-03/mdm-03 gaps, clarify arch and -01 chapter scopes"
```

---

## Self-Review Checklist

**Spec coverage:**

| Overlap | Solution | Task(s) |
|---|---|---|
| Overlap 1: Best practices fragmentation | Delete 3 per-module BP chapters; adoption-and-usage-quality is sole home | 1A + 2 |
| Overlap 2: Arch vs system data-flow scope | Arch description + topic descriptions scoped to technical mechanics | 1B |
| Overlap 3: FMS/MDM mirror without cohesion | Add fms-03, mdm-03, bridging chapter | 1C + 2 |
| Overlap 4: *-01 chapters re-explaining purpose | Update descriptions to anchor at mechanics; add cross-ref to four-systems | 1D |

**Placeholder scan:** All topic files with `*Content coming soon.*` body text are intentional stubs matching the existing pattern in `fms-04` and `mdm-04` topics. No other placeholders exist in the plan.

**Type consistency:** All new chapter slugs in `order.json` match their folder names exactly. All topic slugs in `order.json` match their filenames (without extension) exactly.
