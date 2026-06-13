# S&OP Process Steps Chapter — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a third chapter to the `sop-process` module with 5 topics (L2 processes), each rendered as a tabbed walkthrough showing L3 steps with description, inputs, outputs, roles, systems, and L4 tasks.

**Architecture:** New `process-steps` topicLayout backed by a new `ProcessStepsLayout.astro`. All step data lives in each topic's YAML frontmatter under a `processSteps` key. The layout is wired into `[topic].astro` alongside the other 6 layout types.

**Tech Stack:** Astro 4, Tailwind CSS 3, vanilla JS (no new dependencies)

---

## File map

| File | Action |
|---|---|
| `src/lib/chapters.ts` | Modify — add `processSteps` to `TopicMeta` interface and `getTopics()` mapping |
| `src/content/order.json` | Modify — register chapter and 5 topic slugs |
| `src/content/chapters/sop-03-sop-process-steps/_meta.json` | Create |
| `src/content/chapters/sop-03-sop-process-steps/01-demand-forecasting.md` | Create |
| `src/content/chapters/sop-03-sop-process-steps/02-inventory-planning.md` | Create |
| `src/content/chapters/sop-03-sop-process-steps/03-supply-planning.md` | Create |
| `src/content/chapters/sop-03-sop-process-steps/04-resource-planning.md` | Create |
| `src/content/chapters/sop-03-sop-process-steps/05-sop-review.md` | Create |
| `src/layouts/ProcessStepsLayout.astro` | Create |
| `src/pages/[pillar]/[module]/[chapter]/[topic].astro` | Modify — import and wire new layout |

---

## Task 1: Extend TopicMeta with processSteps

**Files:**
- Modify: `src/lib/chapters.ts`

- [ ] **Step 1: Add `processSteps` to the `TopicMeta` interface**

In `src/lib/chapters.ts`, find the `TopicMeta` interface (around line 23). Add after the `steps` field:

```typescript
  processSteps?: Array<{
    title: string;
    description: string;
    inputs: string[];
    outputs: string[];
    roles: string[];
    systems: string[];
    tasks: string[];
  }>;
```

- [ ] **Step 2: Expose `processSteps` in `getTopics()`**

In `getTopics()` (around line 132), find the object literal that builds each `TopicMeta`. Add after `steps: fm.steps ?? undefined,`:

```typescript
        processSteps: fm.processSteps ?? undefined,
```

- [ ] **Step 3: Verify TypeScript compiles**

```bash
npm run build
```

Expected: build succeeds with no TypeScript errors. If there are errors, they will be in the lines you just edited — check for typos in field names.

- [ ] **Step 4: Commit**

```bash
git add src/lib/chapters.ts
git commit -m "feat: add processSteps field to TopicMeta"
```

---

## Task 2: Register chapter and topics in order.json

**Files:**
- Modify: `src/content/order.json`

- [ ] **Step 1: Add chapter to sop-process module list**

Find `"sop-process"` in the `"chapters"` section of `order.json`:

```json
"sop-process": [
  "sop-01-sop-fundamentals",
  "sop-02-running-sop"
],
```

Change to:

```json
"sop-process": [
  "sop-01-sop-fundamentals",
  "sop-02-running-sop",
  "sop-03-sop-process-steps"
],
```

- [ ] **Step 2: Add topic slug list for the new chapter**

In the `"topics"` section, add a new entry after `"sop-02-running-sop"`:

```json
"sop-03-sop-process-steps": [
  "demand-forecasting",
  "inventory-planning",
  "supply-planning",
  "resource-planning",
  "sop-review"
],
```

- [ ] **Step 3: Commit**

```bash
git add src/content/order.json
git commit -m "feat: register sop-03-sop-process-steps chapter in order.json"
```

---

## Task 3: Create chapter directory and _meta.json

**Files:**
- Create: `src/content/chapters/sop-03-sop-process-steps/_meta.json`

- [ ] **Step 1: Create the directory and metadata file**

Create `src/content/chapters/sop-03-sop-process-steps/_meta.json` with this content:

```json
{
  "title": "S&OP Process Steps",
  "description": "A step-by-step breakdown of each S&OP sub-process — from demand forecasting through executive review — showing inputs, outputs, roles, systems, and tasks at each stage.",
  "icon": "network",
  "color": "blue",
  "pillar": "process",
  "module": "sop-process"
}
```

- [ ] **Step 2: Commit**

```bash
git add src/content/chapters/sop-03-sop-process-steps/_meta.json
git commit -m "feat: add sop-03-sop-process-steps chapter metadata"
```

---

## Task 4: Create topic files with sample content

**Files:**
- Create: `src/content/chapters/sop-03-sop-process-steps/01-demand-forecasting.md`
- Create: `src/content/chapters/sop-03-sop-process-steps/02-inventory-planning.md`
- Create: `src/content/chapters/sop-03-sop-process-steps/03-supply-planning.md`
- Create: `src/content/chapters/sop-03-sop-process-steps/04-resource-planning.md`
- Create: `src/content/chapters/sop-03-sop-process-steps/05-sop-review.md`

- [ ] **Step 1: Create 01-demand-forecasting.md**

```markdown
---
title: "Demand Forecasting"
description: "Turning raw sales history into a single consensus demand number — from data cleansing through statistical modelling, commercial review, and final lock."
chapter: "sop-03-sop-process-steps"
estimatedMinutes: 12
topicLayout: "process-steps"
processSteps:
  - title: "Data Collection & Cleansing"
    description: "Gather sales actuals from ERP and field actuals from FMS. Remove anomalies caused by one-off events such as promotions or supply failures. Validate that all required data feeds are complete before the statistical model is run."
    inputs:
      - "Sales actuals (ERP)"
      - "Field actuals (FMS)"
      - "Promotion calendar"
      - "Customer order history"
    outputs:
      - "Cleansed demand history"
      - "Anomaly log"
      - "Data completeness sign-off"
    roles:
      - "Demand Planner"
      - "Data Analyst"
    systems:
      - "ERP"
      - "FMS"
      - "Planning Software"
    tasks:
      - "Extract 24 months of sales history from ERP"
      - "Extract field actuals from FMS and reconcile against ERP"
      - "Identify and flag statistical outliers for manual review"
      - "Apply promotion calendar adjustments to baseline history"
      - "Complete and sign off data completeness checklist"
  - title: "Statistical Baseline Generation"
    description: "Run the statistical forecasting model on the cleansed history. Review model fit and flag product families where accuracy falls below the agreed threshold. Select the best-performing algorithm per family."
    inputs:
      - "Cleansed demand history"
      - "Forecasting model configuration"
      - "Seasonality index"
    outputs:
      - "Statistical baseline forecast"
      - "Model accuracy report (MAPE by family)"
      - "Exception list for manual review"
    roles:
      - "Demand Planner"
      - "Planning Software Administrator"
    systems:
      - "Planning Software"
    tasks:
      - "Trigger statistical forecast run in planning software"
      - "Review MAPE scores by product family"
      - "Identify families where forecast error exceeds threshold"
      - "Override algorithm for underperforming families"
      - "Export baseline for commercial review"
  - title: "Commercial Overlay"
    description: "The commercial team reviews the statistical baseline and applies adjustments based on market intelligence the model cannot see — promotions, pipeline changes, new distribution wins, or lost accounts."
    inputs:
      - "Statistical baseline forecast"
      - "Sales pipeline data"
      - "Promotion plan"
      - "Key account updates"
    outputs:
      - "Commercially adjusted forecast"
      - "Assumption log (one entry per material override)"
    roles:
      - "Sales Manager"
      - "Key Account Manager"
      - "Demand Planner"
    systems:
      - "Planning Software"
      - "CRM"
    tasks:
      - "Distribute baseline forecast to commercial team for review"
      - "Collect commercial override proposals with documented assumptions"
      - "Validate overrides are within governance thresholds"
      - "Apply approved overrides in planning software"
      - "Produce assumption log for audit trail"
  - title: "Consensus Forecast Review"
    description: "Commercial and supply chain align on a single consensus number. Disagreements are surfaced and resolved in the meeting — not after it. The output is one agreed forecast, not a range or multiple versions."
    inputs:
      - "Commercially adjusted forecast"
      - "Supply constraints summary"
      - "Prior month actuals vs. forecast"
    outputs:
      - "Consensus forecast (locked)"
      - "Meeting minutes with decisions and owners"
    roles:
      - "Demand Planner"
      - "Supply Planner"
      - "Commercial Lead"
      - "S&OP Process Owner"
    systems:
      - "Planning Software"
    tasks:
      - "Circulate pre-meeting pack 48 hours before review"
      - "Review actuals vs. prior forecast and document bias"
      - "Present statistical baseline and commercial overlays"
      - "Surface and resolve material disagreements in the meeting"
      - "Formally lock consensus forecast in planning software"
  - title: "Forecast Lock & Distribution"
    description: "The agreed consensus forecast is locked in the system and distributed to downstream planning processes. Any post-lock revision requires a formal change request with an owner and documented reason."
    inputs:
      - "Locked consensus forecast"
      - "Downstream planning calendar"
    outputs:
      - "Distributed forecast (supply, inventory, finance)"
      - "Change request log"
    roles:
      - "Demand Planner"
      - "S&OP Process Owner"
    systems:
      - "Planning Software"
      - "ERP"
    tasks:
      - "Lock forecast in planning software for the agreed horizon"
      - "Trigger automated distribution to supply and inventory planning"
      - "Notify finance of final demand plan for reconciliation"
      - "Publish change request procedure to stakeholders"
      - "Archive assumption log and meeting minutes"
---
```

- [ ] **Step 2: Create 02-inventory-planning.md**

```markdown
---
title: "Inventory Planning"
description: "Setting and maintaining inventory targets that balance service levels against working capital — from coverage analysis through exception resolution."
chapter: "sop-03-sop-process-steps"
estimatedMinutes: 10
topicLayout: "process-steps"
processSteps:
  - title: "Coverage Analysis"
    description: "Assess current inventory positions against projected demand. Identify where coverage is below target, where excess stock is building, and where write-off risk exists."
    inputs:
      - "Current inventory positions (ERP)"
      - "Consensus demand forecast"
      - "Safety stock targets"
    outputs:
      - "Coverage report by product (weeks of supply)"
      - "Shortage risk list"
      - "Excess inventory list"
    roles:
      - "Inventory Planner"
      - "Demand Planner"
    systems:
      - "ERP"
      - "Planning Software"
    tasks:
      - "Extract current stock positions from ERP"
      - "Calculate projected coverage in weeks by product family"
      - "Flag items below minimum coverage threshold"
      - "Flag items with excess stock above maximum threshold"
      - "Prepare coverage report for S&OP review"
  - title: "Safety Stock Review"
    description: "Review and update safety stock targets to reflect current demand variability, supplier lead time variability, and agreed service level targets. Targets should be challenged periodically — not left static."
    inputs:
      - "Historical demand variability data"
      - "Supplier lead time data"
      - "Service level targets by SKU"
    outputs:
      - "Updated safety stock targets by SKU"
      - "Exception list for items requiring policy discussion"
    roles:
      - "Inventory Planner"
      - "Supply Planner"
    systems:
      - "Planning Software"
    tasks:
      - "Calculate demand variability (standard deviation) for each SKU over 13 weeks"
      - "Calculate lead time variability by supplier"
      - "Apply service level formula to derive safety stock quantities"
      - "Compare current targets against calculated values"
      - "Escalate material changes to S&OP process owner for approval"
  - title: "Inventory Target Setting"
    description: "Set or confirm cycle stock and safety stock targets for the planning horizon. Targets balance working capital efficiency against service level obligations."
    inputs:
      - "Updated safety stock calculations"
      - "Working capital budget constraints"
      - "Service level targets"
    outputs:
      - "Confirmed inventory targets by SKU"
      - "Projected inventory value vs. budget"
    roles:
      - "Inventory Planner"
      - "Finance Business Partner"
    systems:
      - "Planning Software"
      - "ERP"
    tasks:
      - "Enter updated safety stock targets in planning software"
      - "Run projected inventory value calculation for horizon"
      - "Compare projected value against working capital budget"
      - "Identify trade-offs where budget and service level targets conflict"
      - "Present trade-offs to S&OP process owner for decision"
  - title: "Exception Resolution"
    description: "Resolve inventory exceptions flagged during coverage and target-setting — shortage risks requiring expediting, excess positions requiring action, and write-off candidates requiring sign-off."
    inputs:
      - "Shortage risk list"
      - "Excess inventory list"
      - "Write-off candidates"
    outputs:
      - "Expedite requests (shortage)"
      - "Disposal or redistribution plan (excess)"
      - "Write-off approval requests"
    roles:
      - "Inventory Planner"
      - "Supply Planner"
      - "Finance Business Partner"
    systems:
      - "ERP"
      - "Planning Software"
    tasks:
      - "Review and prioritise shortage risks by revenue impact"
      - "Raise expedite requests for critical shortages with supply planning"
      - "Propose redistribution or markdown plan for excess stock"
      - "Prepare write-off requests for finance approval"
      - "Update inventory plan with agreed actions"
---
```

- [ ] **Step 3: Create 03-supply-planning.md**

```markdown
---
title: "Supply Planning"
description: "Translating the consensus demand plan into a feasible, constrained production and procurement schedule — identifying gaps and preparing costed options for resolution."
chapter: "sop-03-sop-process-steps"
estimatedMinutes: 12
topicLayout: "process-steps"
processSteps:
  - title: "Capacity Assessment"
    description: "Assess available production and procurement capacity for the planning horizon against the locked demand forecast. Identify bottlenecks and headroom before running the constrained plan."
    inputs:
      - "Locked demand forecast"
      - "Production capacity data"
      - "Supplier capacity confirmations"
      - "Current open orders (ERP)"
    outputs:
      - "Capacity utilisation report"
      - "Bottleneck list"
      - "Available headroom by resource"
    roles:
      - "Supply Planner"
      - "Production Planner"
    systems:
      - "Planning Software"
      - "ERP"
    tasks:
      - "Load current capacity data into planning software"
      - "Run unconstrained supply run against consensus demand"
      - "Identify resources at or above 85% utilisation"
      - "Flag supplier capacity limits from latest confirmations"
      - "Produce capacity utilisation summary for review"
  - title: "Constrained Supply Run"
    description: "Run the constrained supply plan in planning software to generate a feasible production and procurement schedule. The system applies prioritisation rules to allocate constrained capacity to demand."
    inputs:
      - "Consensus demand forecast"
      - "Capacity constraints"
      - "Inventory positions"
      - "Prioritisation rules"
    outputs:
      - "Constrained production plan"
      - "Constrained procurement plan"
      - "Unmet demand report"
    roles:
      - "Supply Planner"
      - "Planning Software Administrator"
    systems:
      - "Planning Software"
    tasks:
      - "Confirm prioritisation rules are current and approved"
      - "Trigger constrained supply run in planning software"
      - "Review run log for errors or constraint violations"
      - "Extract unmet demand report by product and time bucket"
      - "Validate constrained plan totals against unconstrained baseline"
  - title: "Gap Identification"
    description: "Identify where the constrained supply plan cannot meet the consensus demand plan. Gaps are quantified by volume, value, and timing and classified by root cause to guide option development."
    inputs:
      - "Constrained supply plan"
      - "Consensus demand forecast"
      - "Inventory coverage report"
    outputs:
      - "Gap report (volume, value, timing)"
      - "Root cause classification by gap"
      - "Items requiring escalation to pre-S&OP"
    roles:
      - "Supply Planner"
      - "Demand Planner"
    systems:
      - "Planning Software"
    tasks:
      - "Compare constrained plan against demand forecast by family and time bucket"
      - "Calculate gap volume and value for each shortfall"
      - "Classify each gap (capacity, material, lead time, or policy constrained)"
      - "Identify gaps closable within operations authority"
      - "Flag gaps requiring cross-functional decision for pre-S&OP"
  - title: "Option Development"
    description: "For each significant gap, develop costed options that could close it. The supply review should never present a gap without a proposed solution — even if none of the options are ideal."
    inputs:
      - "Gap report"
      - "Supplier flexibility data"
      - "Overtime and subcontracting costs"
      - "Logistics cost data"
    outputs:
      - "Costed options list per gap"
      - "Recommended option per gap"
      - "Items with no viable option (escalation)"
    roles:
      - "Supply Planner"
      - "Procurement Manager"
      - "Logistics Manager"
    systems:
      - "Planning Software"
      - "ERP"
    tasks:
      - "Engage suppliers on flexibility for critical material gaps"
      - "Cost overtime and additional shift scenarios for capacity gaps"
      - "Evaluate subcontracting options where available"
      - "Model expedited logistics scenarios for timing-constrained gaps"
      - "Compile options with cost and lead time for each gap"
  - title: "Supply Plan Submission"
    description: "Finalise and submit the supply plan for the pre-S&OP review, accompanied by the gap report and options list so the pre-S&OP team can make informed decisions."
    inputs:
      - "Constrained supply plan"
      - "Costed options list"
      - "Gap report"
    outputs:
      - "Submitted supply plan"
      - "Pre-S&OP briefing pack"
    roles:
      - "Supply Planner"
      - "S&OP Process Owner"
    systems:
      - "Planning Software"
    tasks:
      - "Review and sign off constrained supply plan"
      - "Prepare gap and options summary for pre-S&OP"
      - "Load supply plan into planning software for distribution"
      - "Distribute pre-S&OP briefing pack to participants"
      - "Archive supply plan version for audit trail"
---
```

- [ ] **Step 4: Create 04-resource-planning.md**

```markdown
---
title: "Resource Planning"
description: "Translating the supply plan into labour, equipment, and capacity requirements — identifying binding constraints and allocating available resource to the plan."
chapter: "sop-03-sop-process-steps"
estimatedMinutes: 10
topicLayout: "process-steps"
processSteps:
  - title: "Resource Demand Projection"
    description: "Translate the supply plan into resource requirements — labour, equipment, and warehouse capacity — across the planning horizon. This projection forms the basis for capacity mapping and constraint identification."
    inputs:
      - "Constrained supply plan"
      - "Resource consumption rates (BOM/BOD)"
      - "Resource calendar"
    outputs:
      - "Resource demand projection by resource type"
      - "Planning horizon load profile"
    roles:
      - "Resource Planner"
      - "Supply Planner"
    systems:
      - "Planning Software"
    tasks:
      - "Run resource requirements projection in planning software"
      - "Extract load profile by resource type for the horizon"
      - "Review projection against known calendar exceptions (holidays, shutdowns)"
      - "Flag resources projected to exceed available capacity"
      - "Distribute projection to resource owners for validation"
  - title: "Capacity Mapping"
    description: "Compare projected resource demand against available capacity to identify surplus and deficit positions. Available capacity accounts for planned maintenance, holidays, and contractual limits."
    inputs:
      - "Resource demand projection"
      - "Resource capacity calendars"
      - "Planned maintenance schedule"
    outputs:
      - "Capacity vs. demand map by resource"
      - "Surplus and deficit summary by period"
    roles:
      - "Resource Planner"
      - "Operations Manager"
    systems:
      - "Planning Software"
      - "ERP"
    tasks:
      - "Confirm resource capacity calendars are up to date"
      - "Run capacity vs. demand comparison in planning software"
      - "Produce heat map showing surplus and deficit by period"
      - "Validate results with resource owners"
      - "Update planning software with any corrections to capacity data"
  - title: "Constraint Identification"
    description: "Identify which resource constraints are binding — those that will prevent the supply plan from being executed as planned. Not all constraints require action; only those that create plan risk."
    inputs:
      - "Capacity vs. demand map"
      - "Supply plan"
      - "Service level targets"
    outputs:
      - "Binding constraint list"
      - "Risk-ranked constraint summary"
    roles:
      - "Resource Planner"
      - "Supply Planner"
      - "Operations Manager"
    systems:
      - "Planning Software"
    tasks:
      - "Filter capacity map to resources at or above 100% utilisation"
      - "Assess whether binding constraints affect prioritised demand"
      - "Rank constraints by service level impact"
      - "Identify constraints resolvable within operations vs. those requiring escalation"
      - "Prepare constraint summary for pre-S&OP"
  - title: "Resource Allocation"
    description: "Allocate available resource capacity to the supply plan, applying agreed prioritisation rules. Where constraints cannot be resolved, document the trade-off and escalate to pre-S&OP."
    inputs:
      - "Binding constraint list"
      - "Prioritisation rules"
      - "Supply plan"
    outputs:
      - "Resource-allocated production plan"
      - "Escalation list for unresolved constraints"
    roles:
      - "Resource Planner"
      - "Operations Manager"
      - "S&OP Process Owner"
    systems:
      - "Planning Software"
    tasks:
      - "Apply prioritisation rules to allocate constrained capacity in planning software"
      - "Confirm resource-allocated plan is consistent with constrained supply plan"
      - "Document trade-offs where prioritisation results in unmet demand"
      - "Raise escalation items for unresolved constraints"
      - "Submit resource-allocated plan to supply planner for pre-S&OP integration"
---
```

- [ ] **Step 5: Create 05-sop-review.md**

```markdown
---
title: "S&OP Review"
description: "Bringing demand, supply, inventory, and resource plans together — from cross-functional pre-alignment through executive sign-off and plan distribution."
chapter: "sop-03-sop-process-steps"
estimatedMinutes: 10
topicLayout: "process-steps"
processSteps:
  - title: "Pre-S&OP Alignment"
    description: "The pre-S&OP meeting brings together the outputs of demand, supply, inventory, and resource planning to identify cross-functional issues that cannot be resolved within individual functions. The goal is to prepare a small number of clear decisions for executive review."
    inputs:
      - "Demand plan"
      - "Supply plan with gap and options list"
      - "Inventory plan"
      - "Resource constraint summary"
    outputs:
      - "Aligned cross-functional plan"
      - "Issue and decision list for executive review"
    roles:
      - "S&OP Process Owner"
      - "Demand Planner"
      - "Supply Planner"
      - "Finance Business Partner"
    systems:
      - "Planning Software"
    tasks:
      - "Distribute pre-S&OP briefing pack to participants 48 hours in advance"
      - "Review demand plan and supply plan alignment"
      - "Identify issues that cannot be resolved at functional level"
      - "Agree recommended options for each issue"
      - "Prepare executive S&OP pack with issues, options, and recommendations"
  - title: "Financial Reconciliation"
    description: "Reconcile the volume plan with the financial plan to ensure consistency. Significant volume-to-value gaps must be explained and, where material, resolved before executive review."
    inputs:
      - "Volume supply and demand plan"
      - "Financial forecast (P&L)"
      - "Prior period actuals"
    outputs:
      - "Volume-to-value bridge"
      - "Financial gap analysis"
      - "Items for executive decision"
    roles:
      - "Finance Business Partner"
      - "S&OP Process Owner"
      - "Commercial Lead"
    systems:
      - "Planning Software"
      - "Finance System"
    tasks:
      - "Map volume plan to financial values using current price and cost assumptions"
      - "Compare resulting financial forecast against the approved financial plan"
      - "Calculate the bridge (volume, price, mix, and cost variances)"
      - "Identify items where the gap requires a management decision"
      - "Include financial summary in executive S&OP pack"
  - title: "Executive S&OP Review"
    description: "The executive review is the decision-making forum of the S&OP cycle. It reviews the aligned plan, considers the issues and options prepared by pre-S&OP, and makes the decisions needed to produce one agreed business plan."
    inputs:
      - "Aligned cross-functional plan"
      - "Issue and decision list"
      - "Financial reconciliation"
      - "Pre-S&OP recommendations"
    outputs:
      - "Agreed business plan decisions"
      - "Action log with owners and due dates"
    roles:
      - "CEO or COO"
      - "Commercial Director"
      - "Operations Director"
      - "Finance Director"
      - "S&OP Process Owner"
    systems:
      - "Planning Software"
    tasks:
      - "Present prior period performance vs. plan"
      - "Review horizon demand and supply plan with financial overlay"
      - "Present issues with options and pre-S&OP recommendations"
      - "Facilitate executive decisions on escalated items"
      - "Record decisions and assign actions with owners and due dates"
  - title: "Plan Distribution & Close"
    description: "The agreed decisions from the executive review are applied to the plan in planning software. The final plan is distributed to all functions as the authoritative business plan. The cycle is formally closed and the next cycle is initiated."
    inputs:
      - "Executive decisions and actions"
      - "Aligned plan in planning software"
    outputs:
      - "Approved final plan (distributed to all functions)"
      - "Action tracker with owners"
      - "Next cycle kick-off date"
    roles:
      - "S&OP Process Owner"
      - "Demand Planner"
      - "Supply Planner"
    systems:
      - "Planning Software"
      - "ERP"
    tasks:
      - "Apply executive decisions to plan in planning software"
      - "Lock and publish the approved plan"
      - "Distribute plan to all functions with a summary of key decisions"
      - "Circulate action tracker with owners and due dates"
      - "Schedule and confirm next S&OP cycle start date"
---
```

- [ ] **Step 6: Run build to verify the content files load correctly**

```bash
npm run build
```

Expected: build succeeds. If `processSteps` fields in frontmatter cause any parsing issues they will surface here as build errors.

- [ ] **Step 7: Commit**

```bash
git add src/content/chapters/sop-03-sop-process-steps/
git commit -m "feat: add sample content for all 5 sop-process-steps topics"
```

---

## Task 5: Create ProcessStepsLayout.astro

**Files:**
- Create: `src/layouts/ProcessStepsLayout.astro`

- [ ] **Step 1: Create the layout file**

Create `src/layouts/ProcessStepsLayout.astro` with this full content:

```astro
---
import BaseLayout from './BaseLayout.astro';
import ThemeToggle from '../components/ThemeToggle.astro';

export interface ProcessStep {
  title: string;
  description: string;
  inputs: string[];
  outputs: string[];
  roles: string[];
  systems: string[];
  tasks: string[];
}

export interface Props {
  title: string;
  description: string;
  chapterTitle: string;
  chapterSlug: string;
  chapterUrl: string;
  chapterColor: string;
  topicOrder: number;
  topicSlug: string;
  chapterOrder: number;
  prevUrl?: string;
  nextUrl?: string;
  prevTitle?: string;
  nextTitle?: string;
  processSteps?: ProcessStep[];
  pillar?: string;
  module?: string;
  totalTopics?: number;
}

const {
  title,
  description,
  chapterTitle,
  chapterSlug,
  chapterUrl,
  chapterColor,
  topicOrder,
  topicSlug,
  chapterOrder,
  prevUrl,
  nextUrl,
  prevTitle,
  nextTitle,
  processSteps = [],
  pillar,
  module,
  totalTopics,
} = Astro.props;

const BASE_URL = import.meta.env.BASE_URL;
const moduleBackMap: Record<string, { href: string; label: string }> = {
  'planning-software':      { href: `${BASE_URL}technology/planning-software`,  label: 'Planning Software' },
  'erp':                    { href: `${BASE_URL}technology/erp`,                 label: 'ERP' },
  'architecture':           { href: `${BASE_URL}technology/architecture`,        label: 'Architecture & Integration' },
  'mdm':                    { href: `${BASE_URL}technology/mdm`,                 label: 'MDM Tool' },
  'fms':                    { href: `${BASE_URL}technology/fms`,                 label: 'FMS Tool' },
  'data-driven-planning':   { href: `${BASE_URL}data/data-driven-planning`,      label: 'Data-Driven Planning' },
  'data-fundamentals':      { href: `${BASE_URL}data/data-fundamentals`,         label: 'Data Fundamentals' },
  'data-governance':        { href: `${BASE_URL}data/data-governance`,           label: 'Data Governance' },
  'reporting':              { href: `${BASE_URL}technology/reporting`,           label: 'Reporting' },
  'scenario-planning':      { href: `${BASE_URL}process/scenario-planning`,      label: 'Scenario Planning' },
  'sop-process':            { href: `${BASE_URL}process/sop-process`,            label: 'S&OP' },
  'soe-process':            { href: `${BASE_URL}process/soe-process`,            label: 'S&OE' },
  'execution-process':      { href: `${BASE_URL}process/execution-process`,      label: 'Execution' },
  'organisation-and-roles': { href: `${BASE_URL}people/organisation-and-roles`,  label: 'Organisation & Roles' },
  'process-foundations':    { href: `${BASE_URL}process/process-foundations`,    label: 'Process Foundations' },
};
const back = moduleBackMap[module ?? 'planning-software'] ?? { href: BASE_URL, label: 'Home' };

const colorMap: Record<string, string> = {
  indigo:  'text-indigo-600 dark:text-indigo-400 border-indigo-400 dark:border-indigo-500',
  violet:  'text-violet-600 dark:text-violet-400 border-violet-400 dark:border-violet-500',
  sky:     'text-sky-600 dark:text-sky-400 border-sky-400 dark:border-sky-500',
  emerald: 'text-emerald-600 dark:text-emerald-400 border-emerald-400 dark:border-emerald-500',
  amber:   'text-amber-600 dark:text-amber-400 border-amber-400 dark:border-amber-500',
  teal:    'text-teal-600 dark:text-teal-400 border-teal-400 dark:border-teal-500',
  yellow:  'text-yellow-600 dark:text-yellow-400 border-yellow-400 dark:border-yellow-500',
  blue:    'text-blue-600 dark:text-blue-400 border-blue-400 dark:border-blue-500',
  red:     'text-red-600 dark:text-red-400 border-red-400 dark:border-red-500',
};

const accentColorMap: Record<string, string> = {
  indigo:  '#6366f1',
  violet:  '#8b5cf6',
  sky:     '#0ea5e9',
  emerald: '#10b981',
  amber:   '#f59e0b',
  teal:    '#14b8a6',
  yellow:  '#eab308',
  blue:    '#3b82f6',
  red:     '#ef4444',
};

const accentSubtleMap: Record<string, string> = {
  indigo:  'rgba(99, 102, 241, 0.07)',
  violet:  'rgba(139, 92, 246, 0.07)',
  sky:     'rgba(14, 165, 233, 0.07)',
  emerald: 'rgba(16, 185, 129, 0.07)',
  amber:   'rgba(245, 158, 11, 0.07)',
  teal:    'rgba(20, 184, 166, 0.07)',
  yellow:  'rgba(234, 179, 8, 0.07)',
  blue:    'rgba(59, 130, 246, 0.07)',
  red:     'rgba(239, 68, 68, 0.07)',
};

const badgeBgMap: Record<string, string> = {
  indigo:  'bg-indigo-50 dark:bg-indigo-500/10 border-indigo-200 dark:border-indigo-500/30 text-indigo-600 dark:text-indigo-400',
  violet:  'bg-violet-50 dark:bg-violet-500/10 border-violet-200 dark:border-violet-500/30 text-violet-600 dark:text-violet-400',
  sky:     'bg-sky-50 dark:bg-sky-500/10 border-sky-200 dark:border-sky-500/30 text-sky-600 dark:text-sky-400',
  emerald: 'bg-emerald-50 dark:bg-emerald-500/10 border-emerald-200 dark:border-emerald-500/30 text-emerald-600 dark:text-emerald-400',
  amber:   'bg-amber-50 dark:bg-amber-500/10 border-amber-200 dark:border-amber-500/30 text-amber-600 dark:text-amber-400',
  teal:    'bg-teal-50 dark:bg-teal-500/10 border-teal-200 dark:border-teal-500/30 text-teal-600 dark:text-teal-400',
  yellow:  'bg-yellow-50 dark:bg-yellow-500/10 border-yellow-200 dark:border-yellow-500/30 text-yellow-600 dark:text-yellow-400',
  blue:    'bg-blue-50 dark:bg-blue-500/10 border-blue-200 dark:border-blue-500/30 text-blue-600 dark:text-blue-400',
  red:     'bg-red-50 dark:bg-red-500/10 border-red-200 dark:border-red-500/30 text-red-600 dark:text-red-400',
};

const dotColorMap: Record<string, string> = {
  indigo:  'bg-indigo-500',
  violet:  'bg-violet-500',
  sky:     'bg-sky-500',
  emerald: 'bg-emerald-500',
  amber:   'bg-amber-500',
  teal:    'bg-teal-500',
  yellow:  'bg-yellow-500',
  blue:    'bg-blue-500',
  red:     'bg-red-500',
};

const chapterColorClass = colorMap[chapterColor]        ?? 'text-brand-600 dark:text-brand-400 border-brand-500';
const accentColor        = accentColorMap[chapterColor]  ?? '#6366f1';
const accentSubtle       = accentSubtleMap[chapterColor] ?? 'rgba(99,102,241,0.07)';
const badgeBgClass       = badgeBgMap[chapterColor]      ?? badgeBgMap.indigo;
const dotColorClass      = dotColorMap[chapterColor]     ?? dotColorMap.indigo;

const topicId  = `${chapterSlug}/${topicSlug}`;
const stepCount = processSteps.length;
---

<BaseLayout title={`${title} — ${back.label}`} description={description}>

  <!-- Top navigation bar -->
  <header class="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 py-3 bg-white/90 dark:bg-gray-950/90 backdrop-blur border-b border-gray-200 dark:border-gray-800">
    <div class="flex items-center gap-3">
      <a href={import.meta.env.BASE_URL} title="Home" class="flex items-center text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors">
        <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"/>
        </svg>
      </a>
      <a href={back.href} class="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors">
        <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12h18M3 12l7-7M3 12l7 7"/>
        </svg>
        {back.label}
      </a>
    </div>
    <a href={chapterUrl} class={`text-sm font-medium border-b ${chapterColorClass} hover:opacity-80 transition-opacity`}>
      {chapterTitle}
    </a>
    <div class="flex items-center gap-3">
      <ThemeToggle />
    </div>
  </header>

  <!-- Main content -->
  <main class="min-h-screen pt-16 pb-32" style={`--accent: ${accentColor}; --accent-subtle: ${accentSubtle};`}>

    <!-- Hero -->
    <div class="bg-gray-50 dark:bg-gray-950 border-b border-gray-100 dark:border-gray-800">
      <div class="h-[3px]" style={`background: linear-gradient(90deg, ${accentColor}, ${accentColor}44 60%, transparent)`}></div>
      <div class="max-w-5xl mx-auto px-6 pt-12 pb-16 animate-fade-in">
        <div class={`inline-flex items-center gap-2 text-xs font-medium border rounded-full px-3 py-1 mb-6 ${badgeBgClass}`}>
          <span class={`w-1.5 h-1.5 rounded-full animate-pulse ${dotColorClass}`}></span>
          {chapterTitle} · Topic {topicOrder}
        </div>
        <h1 class="text-4xl sm:text-5xl font-bold text-gray-900 dark:text-white mb-5 leading-tight tracking-tight">{title}</h1>
        <p class="text-lg text-gray-600 dark:text-gray-400 leading-relaxed max-w-2xl">{description}</p>
      </div>
    </div>

    <!-- Walkthrough -->
    <div class="bg-white dark:bg-gray-950">

      <!-- Tab bar -->
      <div class="border-b border-gray-200 dark:border-gray-800 overflow-x-auto">
        <div class="flex min-w-max max-w-5xl mx-auto px-6">
          {processSteps.map((step, i) => (
            <button
              class="ps-tab flex items-center gap-2 px-5 py-4 text-sm font-medium whitespace-nowrap border-b-2 border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors focus:outline-none"
              data-step={i}
            >
              <span class="ps-tab-num flex-shrink-0 w-5 h-5 rounded-full text-xs font-semibold flex items-center justify-center text-gray-400 dark:text-gray-500 transition-colors">{i + 1}</span>
              {step.title}
            </button>
          ))}
        </div>
      </div>

      <!-- Step panels -->
      <div class="max-w-5xl mx-auto px-6">
        {processSteps.map((step, i) => (
          <div class="ps-panel" data-step={i}>
            <div class="py-10">

              <!-- Description -->
              <p class="text-base text-gray-600 dark:text-gray-400 leading-relaxed mb-8 max-w-3xl">{step.description}</p>

              <!-- Inputs / Outputs -->
              <div class="grid grid-cols-1 sm:grid-cols-2 gap-5 mb-6">
                <div class="rounded-xl border border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-900/50 p-5">
                  <h4 class="text-xs font-semibold uppercase tracking-wider text-[var(--accent)] mb-4">Inputs</h4>
                  <ul class="space-y-2.5">
                    {step.inputs.map((inp) => (
                      <li class="flex items-start gap-2.5 text-sm text-gray-700 dark:text-gray-300">
                        <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4 flex-shrink-0 mt-0.5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/>
                        </svg>
                        {inp}
                      </li>
                    ))}
                  </ul>
                </div>
                <div class="rounded-xl border border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-900/50 p-5">
                  <h4 class="text-xs font-semibold uppercase tracking-wider text-[var(--accent)] mb-4">Outputs</h4>
                  <ul class="space-y-2.5">
                    {step.outputs.map((out) => (
                      <li class="flex items-start gap-2.5 text-sm text-gray-700 dark:text-gray-300">
                        <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4 flex-shrink-0 mt-0.5 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/>
                        </svg>
                        {out}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <!-- Roles + Systems -->
              <div class="flex flex-wrap gap-2 mb-6">
                {step.roles.map((r) => (
                  <span class="inline-flex items-center text-xs font-medium px-2.5 py-1 rounded-full bg-indigo-50 dark:bg-indigo-500/10 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-500/30">{r}</span>
                ))}
                {step.systems.map((s) => (
                  <span class="inline-flex items-center text-xs font-medium px-2.5 py-1 rounded-full bg-rose-50 dark:bg-rose-500/10 text-rose-700 dark:text-rose-300 border border-rose-200 dark:border-rose-500/30">{s}</span>
                ))}
              </div>

              <!-- L4 Tasks -->
              <div class="rounded-xl border border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-900/50 p-5">
                <h4 class="text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-4">Tasks</h4>
                <ol class="space-y-3">
                  {step.tasks.map((task, ti) => (
                    <li class="flex items-start gap-3 text-sm text-gray-700 dark:text-gray-300">
                      <span class="flex-shrink-0 w-5 h-5 rounded-full border border-gray-300 dark:border-gray-600 flex items-center justify-center text-xs font-semibold text-gray-500 dark:text-gray-400 mt-0.5">{ti + 1}</span>
                      {task}
                    </li>
                  ))}
                </ol>
              </div>

            </div>
          </div>
        ))}

        <!-- Step navigation -->
        <div class="flex items-center justify-between py-6 border-t border-gray-200 dark:border-gray-800">
          <button id="ps-prev" class="flex items-center gap-2 text-sm font-medium text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white disabled:opacity-30 disabled:cursor-not-allowed transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"/>
            </svg>
            Previous step
          </button>
          <span id="ps-counter" class="text-sm text-gray-400 dark:text-gray-500">Step 1 of {stepCount}</span>
          <button id="ps-next" class="flex items-center gap-2 text-sm font-medium text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white disabled:opacity-30 disabled:cursor-not-allowed transition-colors">
            Next step
            <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/>
            </svg>
          </button>
        </div>
      </div>
    </div>
  </main>

  <!-- Page prev / next nav (fixed bottom) -->
  <nav class="fixed bottom-0 left-0 right-0 z-50 flex items-center justify-between px-6 py-4 bg-white/95 dark:bg-gray-950/95 backdrop-blur border-t border-gray-200 dark:border-gray-800">
    <div class="flex-1">
      {prevUrl ? (
        <a href={prevUrl} class="group flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors">
          <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4 group-hover:-translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"/>
          </svg>
          <span class="hidden sm:inline">{prevTitle ?? 'Previous'}</span>
          <span class="sm:hidden">Prev</span>
        </a>
      ) : (
        <a href={import.meta.env.BASE_URL} class="group flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors">
          <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12h18M3 12l7-7M3 12l7 7"/>
          </svg>
          Home
        </a>
      )}
    </div>

    <div class="flex items-center gap-2">
      <button
        id="complete-btn"
        data-topic-id={topicId}
        class="flex items-center gap-2 text-xs font-medium px-3 py-1.5 rounded-full border border-gray-300 dark:border-gray-700 text-gray-500 dark:text-gray-400 hover:border-emerald-500 hover:text-emerald-600 dark:hover:text-emerald-400 transition-all"
      >
        <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/>
        </svg>
        <span id="complete-label">Mark complete</span>
      </button>
      <button
        id="unclear-btn"
        data-topic-id={topicId}
        class="flex items-center gap-2 text-xs font-medium px-3 py-1.5 rounded-full border border-gray-300 dark:border-gray-700 text-gray-500 dark:text-gray-400 hover:border-amber-400 hover:text-amber-600 dark:hover:text-amber-400 transition-all"
      >
        <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
        </svg>
        <span id="unclear-label">Mark unclear</span>
      </button>
    </div>

    <div class="flex-1 flex justify-end">
      {nextUrl ? (
        <a href={nextUrl} class="group flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors">
          <span class="hidden sm:inline">{nextTitle ?? 'Next'}</span>
          <span class="sm:hidden">Next</span>
          <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/>
          </svg>
        </a>
      ) : (
        <a href={import.meta.env.BASE_URL} class="text-sm text-emerald-600 dark:text-emerald-400 hover:text-emerald-700 dark:hover:text-emerald-300 transition-colors font-medium">
          Finish ✓
        </a>
      )}
    </div>
  </nav>

  <script define:vars={{ topicId, totalTopics, stepCount }}>
    // Progress tracking
    const STORAGE_KEY = 'platform-progress';
    function getProgress() {
      try {
        const raw = JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}');
        const result = {};
        for (const [k, v] of Object.entries(raw)) {
          if (v === 'complete' || v === 'unclear') result[k] = v;
          else if (v === true) result[k] = 'complete';
        }
        return result;
      } catch { return {}; }
    }
    function saveProgress(p) { localStorage.setItem(STORAGE_KEY, JSON.stringify(p)); }
    const completeBtn   = document.getElementById('complete-btn');
    const completeLabel = document.getElementById('complete-label');
    const unclearBtn    = document.getElementById('unclear-btn');
    const unclearLabel  = document.getElementById('unclear-label');
    function updateButtons(state) {
      if (state === 'complete') {
        completeBtn.classList.remove('border-gray-300', 'dark:border-gray-700', 'text-gray-500', 'dark:text-gray-400');
        completeBtn.classList.add('border-emerald-500', 'text-emerald-600', 'bg-emerald-50', 'dark:bg-emerald-500/10', 'dark:text-emerald-400');
        completeLabel.textContent = 'Completed';
      } else {
        completeBtn.classList.add('border-gray-300', 'dark:border-gray-700', 'text-gray-500', 'dark:text-gray-400');
        completeBtn.classList.remove('border-emerald-500', 'text-emerald-600', 'bg-emerald-50', 'dark:bg-emerald-500/10', 'dark:text-emerald-400');
        completeLabel.textContent = 'Mark complete';
      }
      if (state === 'unclear') {
        unclearBtn.classList.remove('border-gray-300', 'dark:border-gray-700', 'text-gray-500', 'dark:text-gray-400');
        unclearBtn.classList.add('border-amber-400', 'text-amber-600', 'bg-amber-50', 'dark:bg-amber-500/10', 'dark:text-amber-400');
        unclearLabel.textContent = 'Unclear';
      } else {
        unclearBtn.classList.add('border-gray-300', 'dark:border-gray-700', 'text-gray-500', 'dark:text-gray-400');
        unclearBtn.classList.remove('border-amber-400', 'text-amber-600', 'bg-amber-50', 'dark:bg-amber-500/10', 'dark:text-amber-400');
        unclearLabel.textContent = 'Mark unclear';
      }
    }
    updateButtons(getProgress()[topicId]);
    completeBtn.addEventListener('click', () => {
      const p = getProgress();
      if (p[topicId] === 'complete') delete p[topicId]; else p[topicId] = 'complete';
      saveProgress(p);
      updateButtons(p[topicId]);
      window.dispatchEvent(new CustomEvent('platform-progress-changed'));
    });
    unclearBtn.addEventListener('click', () => {
      const p = getProgress();
      if (p[topicId] === 'unclear') delete p[topicId]; else p[topicId] = 'unclear';
      saveProgress(p);
      updateButtons(p[topicId]);
      window.dispatchEvent(new CustomEvent('platform-progress-changed'));
    });

    // Step walkthrough
    const tabs    = document.querySelectorAll('.ps-tab');
    const panels  = document.querySelectorAll('.ps-panel');
    const prevBtn = document.getElementById('ps-prev');
    const nextBtn = document.getElementById('ps-next');
    const counter = document.getElementById('ps-counter');
    let current = 0;

    function showStep(idx) {
      current = idx;
      tabs.forEach((t, i) => {
        const active = i === idx;
        t.style.borderBottomColor = active ? 'var(--accent)' : 'transparent';
        t.style.color = active ? 'var(--accent)' : '';
        const num = t.querySelector('.ps-tab-num');
        if (num) {
          num.style.background = active ? 'var(--accent)' : '';
          num.style.color = active ? 'white' : '';
        }
      });
      panels.forEach((p, i) => {
        p.style.display = i === idx ? 'block' : 'none';
      });
      prevBtn.disabled = idx === 0;
      nextBtn.disabled = idx === stepCount - 1;
      counter.textContent = 'Step ' + (idx + 1) + ' of ' + stepCount;
    }

    tabs.forEach((tab, i) => tab.addEventListener('click', () => showStep(i)));
    prevBtn.addEventListener('click', () => { if (current > 0) showStep(current - 1); });
    nextBtn.addEventListener('click', () => { if (current < stepCount - 1) showStep(current + 1); });

    showStep(0);
  </script>
</BaseLayout>
```

- [ ] **Step 2: Commit**

```bash
git add src/layouts/ProcessStepsLayout.astro
git commit -m "feat: add ProcessStepsLayout with tabbed step walkthrough"
```

---

## Task 6: Wire layout into [topic].astro

**Files:**
- Modify: `src/pages/[pillar]/[module]/[chapter]/[topic].astro`

- [ ] **Step 1: Add the import**

At the top of `src/pages/[pillar]/[module]/[chapter]/[topic].astro`, after the existing imports (around line 8), add:

```typescript
import ProcessStepsLayout from '../../../../layouts/ProcessStepsLayout.astro';
```

- [ ] **Step 2: Add the layout case**

In the render section, find the `rasci-table` case (around line 122):

```astro
) : layout === 'rasci-table' ? (
  <RasciTableLayout
    {...sharedProps}
    roles={topic.roles}
    steps={topic.steps}
  />
) : (
```

Add the new case immediately BEFORE the `rasci-table` case:

```astro
) : layout === 'process-steps' ? (
  <ProcessStepsLayout
    {...sharedProps}
    processSteps={topic.processSteps}
  />
) : layout === 'rasci-table' ? (
```

- [ ] **Step 3: Build and verify**

```bash
npm run build
```

Expected: build succeeds with no errors. The build will generate 5 new pages under `/process/sop-process/sop-03-sop-process-steps/`.

- [ ] **Step 4: Commit**

```bash
git add src/pages/[pillar]/[module]/[chapter]/[topic].astro
git commit -m "feat: wire process-steps layout into topic router"
```

---

## Task 7: Preview and verify

- [ ] **Step 1: Run the dev server**

```bash
npm run dev
```

- [ ] **Step 2: Check all 5 topic pages render correctly**

Visit each URL and verify:
- `http://localhost:4321/process/sop-process/sop-03-sop-process-steps/demand-forecasting` — 5 tabs, first tab active, content visible
- `http://localhost:4321/process/sop-process/sop-03-sop-process-steps/inventory-planning` — 4 tabs
- `http://localhost:4321/process/sop-process/sop-03-sop-process-steps/supply-planning` — 5 tabs
- `http://localhost:4321/process/sop-process/sop-03-sop-process-steps/resource-planning` — 4 tabs
- `http://localhost:4321/process/sop-process/sop-03-sop-process-steps/sop-review` — 4 tabs

For each page, verify:
- Tab bar shows the correct number of step tabs
- Clicking a tab switches the panel content
- Previous / Next step buttons work and disable correctly at boundaries
- Inputs and Outputs grid renders correctly
- Role tags (indigo) and System tags (rose) render correctly
- Task list renders with numbered items
- Page prev/next footer links navigate to adjacent topics
- "Mark complete" and "Mark unclear" buttons work and persist on refresh
- Chapter breadcrumb in header links back to `/process/sop-process/sop-03-sop-process-steps`
- "S&OP" back-link in header links to `/process/sop-process`

- [ ] **Step 3: Check the chapter index page includes the new chapter**

Visit `http://localhost:4321/process/sop-process/` and confirm "S&OP Process Steps" appears as a chapter card.

- [ ] **Step 4: Run final build**

```bash
npm run build
```

Expected: build completes successfully. No TypeScript errors, no missing route errors.

- [ ] **Step 5: Commit**

```bash
git add -A
git commit -m "feat: complete sop-03-sop-process-steps chapter with process-steps layout"
```
