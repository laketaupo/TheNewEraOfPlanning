# Hierarchy Lift Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Promote the S&OP/S&OE/Execution process hierarchy one level — L2 processes become chapters, L3 steps become topics, L4 tasks shown inline — while moving the six fundamentals chapters to Process Foundations.

**Architecture:** Content-only restructure plus one new layout. No routing changes needed (the dynamic `[pillar]/[module]/[chapter]/[topic].astro` route handles everything generically). Chapter module reassignment is done by editing `_meta.json` `module` fields + `order.json`; new topic files carry their data as top-level frontmatter fields.

**Tech Stack:** Astro 4 (static), Tailwind CSS 3, TypeScript, YAML frontmatter.

---

## File map

### Delete
- `src/content/chapters/sop-03-sop-process-steps/` — entire directory (5 topic files + `_meta.json`)
- `src/layouts/ProcessStepsLayout.astro`

### Modify
- `src/content/order.json` — restructure chapters/topics arrays
- `src/content/chapters/sop-01-sop-fundamentals/_meta.json` — `module` → `process-foundations`
- `src/content/chapters/sop-02-running-sop/_meta.json` — `module` → `process-foundations`
- `src/content/chapters/soe-01-soe-fundamentals/_meta.json` — `module` → `process-foundations`
- `src/content/chapters/soe-02-running-soe/_meta.json` — `module` → `process-foundations`
- `src/content/chapters/exec-01-execution-fundamentals/_meta.json` — `module` → `process-foundations`
- `src/content/chapters/exec-02-daily-execution/_meta.json` — `module` → `process-foundations`
- `src/lib/chapters.ts` — `TopicMeta` interface + `getTopics()` mapping
- `src/pages/[pillar]/[module]/[chapter]/[topic].astro` — add `process-step-detail` case, remove `process-steps` case

### Create
- `src/content/chapters/sop-demand-forecasting/_meta.json` + 5 topic files
- `src/content/chapters/sop-inventory-planning/_meta.json` + 4 topic files
- `src/content/chapters/sop-supply-planning/_meta.json` + 5 topic files
- `src/content/chapters/sop-resource-planning/_meta.json` + 4 topic files
- `src/content/chapters/sop-sop-review/_meta.json` + 4 topic files
- `src/content/chapters/soe-demand-monitoring/_meta.json` (stub)
- `src/content/chapters/soe-supply-monitoring/_meta.json` (stub)
- `src/content/chapters/soe-exception-management/_meta.json` (stub)
- `src/content/chapters/soe-integrated-review/_meta.json` (stub)
- `src/content/chapters/exec-order-prioritisation/_meta.json` (stub)
- `src/content/chapters/exec-execution-monitoring/_meta.json` (stub)
- `src/content/chapters/exec-actuals-capture/_meta.json` (stub)
- `src/content/chapters/exec-feedback-to-planning/_meta.json` (stub)
- `src/layouts/ProcessStepDetailLayout.astro`

---

## Task 1: Restructure `order.json`

**Files:**
- Modify: `src/content/order.json`

- [ ] **Step 1: Replace the `chapters` entries for the four affected modules and the `topics` section**

Replace the entire file content. The full new content is:

```json
{
  "pillars": ["process", "people", "technology", "data"],
  "modules": {
    "technology": ["planning-software", "erp", "architecture", "mdm", "fms"],
    "data": ["data-fundamentals", "data-driven-planning", "data-governance"],
    "process": ["process-foundations", "scenario-planning", "sop-process", "soe-process", "execution-process"],
    "people": ["organisation-and-roles", "implementation-and-change"]
  },
  "chapters": {
    "planning-software": [
      "01-understanding-basics",
      "02-the-network",
      "03-demand-data-flow",
      "04-supply-data-flow",
      "03-the-logic",
      "04-the-simulation",
      "05-navigation-and-ui",
      "08-configuration-manual",
      "99-layout-showcase"
    ],
    "erp": [
      "erp-01-erp-basics",
      "erp-02-the-data-model",
      "erp-03-data-flow-into-erp",
      "erp-04-data-flow-out-of-erp",
      "erp-05-the-logic",
      "erp-06-key-erp-workflows",
      "erp-07-navigation-and-ui"
    ],
    "architecture": [
      "arch-01-end-to-end",
      "arch-02-integration"
    ],
    "mdm": [
      "mdm-01-understanding-basics",
      "mdm-02-the-data-model",
      "mdm-03-data-flow-into-mdm",
      "mdm-04-data-flow-out-of-mdm",
      "mdm-05-the-logic",
      "mdm-06-key-mdm-workflows",
      "mdm-07-navigation-and-ui"
    ],
    "fms": [
      "fms-01-understanding-basics",
      "fms-02-the-data-model",
      "fms-03-data-flow-into-fms",
      "fms-04-data-flow-out-of-fms",
      "fms-05-the-logic",
      "fms-06-key-fms-workflows",
      "fms-07-navigation-and-ui"
    ],
    "data-fundamentals": [
      "data-03-data-types",
      "data-05-data-sources-and-model"
    ],
    "data-driven-planning": [
      "data-01-planning-data-fundamentals",
      "data-02-data-quality-and-impact"
    ],
    "data-governance": [
      "data-04-data-governance"
    ],
    "process-foundations": [
      "process-03-operating-model",
      "process-04-planning-policy",
      "process-05-governance-and-escalation",
      "process-06-kpis",
      "sop-01-sop-fundamentals",
      "sop-02-running-sop",
      "soe-01-soe-fundamentals",
      "soe-02-running-soe",
      "exec-01-execution-fundamentals",
      "exec-02-daily-execution"
    ],
    "scenario-planning": [
      "process-01-scenario-planning-fundamentals",
      "process-02-running-scenarios"
    ],
    "sop-process": [
      "sop-demand-forecasting",
      "sop-inventory-planning",
      "sop-supply-planning",
      "sop-resource-planning",
      "sop-sop-review"
    ],
    "soe-process": [
      "soe-demand-monitoring",
      "soe-supply-monitoring",
      "soe-exception-management",
      "soe-integrated-review"
    ],
    "execution-process": [
      "exec-order-prioritisation",
      "exec-execution-monitoring",
      "exec-actuals-capture",
      "exec-feedback-to-planning"
    ],
    "organisation-and-roles": [
      "people-01-planning-team",
      "people-02-accountability"
    ],
    "implementation-and-change": []
  },
  "topics": {
    "01-understanding-basics": [
      "item", "item-at-location", "bom", "bom-input-output", "bom-lead-time",
      "bod", "bod-transport-mode", "bod-transport-lead-time", "resource", "resource-consumed"
    ],
    "02-the-network": [
      "starting-items", "shipping-items-to-grower", "seed-production", "shipping-seeds-back",
      "cleaning", "calibrating", "priming", "coating", "packing", "final-shipment", "full-network"
    ],
    "03-demand-data-flow": ["demand-signal", "forecast-origin", "upstream-cascade", "timing-and-netting"],
    "04-supply-data-flow": ["supply-signal", "inventory-netting", "parent-line-items", "downstream-cascade"],
    "03-the-logic": [
      "disaggregation-variety-to-item", "disaggregation-year-to-month", "backward-consumption",
      "scheduled-receipt", "push", "pull", "safety-stock", "demand-slicing"
    ],
    "04-the-simulation": [
      "what-is-a-workflow-simulation", "setting-up-a-simulation", "running-the-simulation",
      "reading-simulation-results", "promoting-a-simulation"
    ],
    "05-navigation-and-ui": ["navigating-planning-software", "the-user-interface", "reading-plan-output"],
    "08-configuration-manual": [
      "getting-started", "configuring-items", "configuring-boms",
      "configuring-bods", "configuring-resources", "planning-parameters"
    ],
    "99-layout-showcase": [
      "prose-topic", "card-grid", "data-table", "comparison",
      "full-widget", "node-topic", "topic-with-widget"
    ],
    "erp-01-erp-basics": ["what-is-erp", "erp-vs-legacy-erp", "core-erp-concepts"],
    "erp-02-the-data-model": ["how-erp-structures-data", "key-master-data-in-erp", "key-transactional-data-in-erp"],
    "erp-03-data-flow-into-erp": ["where-data-originates", "how-operational-data-enters-erp", "data-validation-and-posting"],
    "erp-04-data-flow-out-of-erp": ["what-erp-sends-to-planning", "erp-output-to-other-systems", "reconciling-erp-and-planning-data"],
    "erp-05-the-logic": ["erp-business-rules", "order-management-logic", "inventory-management-logic"],
    "erp-06-key-erp-workflows": ["creating-and-managing-orders", "goods-receipt-and-issue", "reporting-and-extraction"],
    "erp-07-navigation-and-ui": ["navigating-erp", "the-erp-interface", "reading-erp-output"],
    "arch-01-end-to-end": ["interfaces", "batchrun", "data-upload"],
    "arch-02-integration": ["erp-planning-software-integration", "planning-software-fms-mdm"],
    "mdm-01-understanding-basics": ["what-is-mdm", "why-mdm-matters", "core-mdm-concepts"],
    "mdm-02-the-data-model": ["how-mdm-structures-data", "key-master-data-entities", "data-hierarchies-and-relationships"],
    "mdm-03-data-flow-into-mdm": ["where-master-data-originates", "how-data-enters-mdm", "data-validation-in-mdm"],
    "mdm-04-data-flow-out-of-mdm": ["what-mdm-sends-to-planning", "mdm-output-to-other-systems", "keeping-master-data-in-sync"],
    "mdm-05-the-logic": ["mdm-governance-rules", "data-matching-and-deduplication", "approval-workflows"],
    "mdm-06-key-mdm-workflows": ["creating-and-maintaining-records", "managing-data-changes", "auditing-and-reporting"],
    "mdm-07-navigation-and-ui": ["navigating-mdm", "the-mdm-interface", "reading-mdm-output"],
    "fms-01-understanding-basics": ["what-is-fms", "why-field-management-matters", "core-fms-concepts"],
    "fms-02-the-data-model": ["how-fms-structures-data", "key-field-data-entities", "field-to-plan-data-mapping"],
    "fms-03-data-flow-into-fms": ["where-field-data-originates", "how-field-activity-enters-fms", "data-capture-and-validation"],
    "fms-04-data-flow-out-of-fms": ["what-fms-sends-to-planning", "fms-output-to-other-systems", "reconciling-field-data-with-the-plan"],
    "fms-05-the-logic": ["fms-business-rules", "field-assignment-logic", "yield-and-activity-tracking"],
    "fms-06-key-fms-workflows": ["managing-field-activities", "recording-actuals", "reporting-and-extraction"],
    "fms-07-navigation-and-ui": ["navigating-fms", "the-fms-interface", "reading-fms-output"],
    "data-03-data-types": ["master-data", "transactional-data", "planning-parameters"],
    "data-05-data-sources-and-model": ["data-model-overview", "where-data-comes-from"],
    "data-01-planning-data-fundamentals": [
      "what-is-data-driven-planning", "how-data-flows-into-a-plan", "the-cost-of-bad-data"
    ],
    "data-02-data-quality-and-impact": [
      "what-makes-data-good-enough", "common-data-problems",
      "how-data-quality-shows-up-in-plans", "improving-data-quality-over-time"
    ],
    "data-04-data-governance": ["data-confidence", "data-ownership", "data-definitions", "data-governance-basics"],
    "process-03-operating-model": ["what-is-sop", "what-is-soe", "execution", "the-cadence"],
    "process-04-planning-policy": ["service-level-targets", "safety-stock", "allocation", "prioritization"],
    "process-05-governance-and-escalation": ["decision-framework", "escalation-paths", "management-by-exception"],
    "process-06-kpis": [
      "kpi-framework-overview", "key-planning-kpis", "kpi-ownership-and-review", "kpis-and-exception-management"
    ],
    "process-01-scenario-planning-fundamentals": [
      "what-is-scenario-planning", "when-to-use-scenario-planning", "types-of-scenarios",
      "the-scenario-planning-process", "setting-up-effective-scenarios", "supply-risks", "demand-uncertainty"
    ],
    "process-02-running-scenarios": [
      "creating-a-scenario", "adjusting-parameters-and-assumptions", "running-and-comparing-scenarios",
      "promoting-a-scenario-to-baseline", "communicating-scenario-findings"
    ],
    "sop-01-sop-fundamentals": [
      "what-is-sop", "the-sop-cycle", "sop-roles", "sop-outputs", "sop-in-planning-software"
    ],
    "sop-02-running-sop": [
      "demand-review", "supply-review", "pre-sop", "executive-sop", "sop-failure-modes"
    ],
    "sop-demand-forecasting": [
      "data-collection", "statistical-baseline", "commercial-overlay", "consensus-review", "forecast-lock"
    ],
    "sop-inventory-planning": [
      "coverage-analysis", "safety-stock-review", "inventory-target-setting", "exception-resolution"
    ],
    "sop-supply-planning": [
      "capacity-assessment", "constrained-supply-run", "gap-identification", "option-development", "supply-plan-submission"
    ],
    "sop-resource-planning": [
      "resource-demand-projection", "capacity-mapping", "constraint-identification", "resource-allocation"
    ],
    "sop-sop-review": [
      "pre-sop-alignment", "financial-reconciliation", "executive-sop-review", "plan-distribution"
    ],
    "soe-01-soe-fundamentals": [
      "what-is-soe", "weekly-cadence", "soe-roles", "exception-management", "escalating-to-sop"
    ],
    "soe-02-running-soe": [
      "monitoring-the-plan", "adjustments-and-resets", "integrated-soe-review", "handoff-to-execution"
    ],
    "exec-01-execution-fundamentals": [
      "what-is-execution", "from-plan-to-action", "execution-exceptions", "execution-kpis", "execution-and-erp"
    ],
    "exec-02-daily-execution": [
      "order-prioritisation", "real-time-visibility", "execution-discipline", "feedback-to-planning"
    ],
    "people-01-planning-team": [
      "who-is-in-the-planning-team", "planning-roles-overview", "the-planning-org-chart",
      "role-competencies", "building-an-effective-planning-team", "broader-org-structure"
    ],
    "people-02-accountability": [
      "what-is-rasci", "demand-review-rasci", "supply-review-rasci", "executive-sop-rasci", "making-rasci-work"
    ]
  }
}
```

- [ ] **Step 2: Verify the JSON is valid**

```bash
node -e "JSON.parse(require('fs').readFileSync('src/content/order.json','utf8')); console.log('valid')"
```

Expected: `valid`

- [ ] **Step 3: Commit**

```bash
git add src/content/order.json
git commit -m "refactor: restructure order.json for hierarchy lift"
```

---

## Task 2: Move six fundamentals chapters to Process Foundations

**Files:**
- Modify: `src/content/chapters/sop-01-sop-fundamentals/_meta.json`
- Modify: `src/content/chapters/sop-02-running-sop/_meta.json`
- Modify: `src/content/chapters/soe-01-soe-fundamentals/_meta.json`
- Modify: `src/content/chapters/soe-02-running-soe/_meta.json`
- Modify: `src/content/chapters/exec-01-execution-fundamentals/_meta.json`
- Modify: `src/content/chapters/exec-02-daily-execution/_meta.json`

Each file needs only one field changed: `"module"` → `"process-foundations"`.

- [ ] **Step 1: Update sop-01-sop-fundamentals/_meta.json**

```json
{
  "title": "S&OP Fundamentals",
  "description": "Understand what Sales & Operations Planning is, why it exists, who participates, and how it creates a single agreed plan for the business.",
  "icon": "calendar",
  "color": "blue",
  "pillar": "process",
  "module": "process-foundations"
}
```

- [ ] **Step 2: Update sop-02-running-sop/_meta.json**

```json
{
  "title": "Running S&OP Effectively",
  "description": "How to run each step of the S&OP cycle well — from demand review through executive sign-off — and the failure modes that derail even well-designed processes.",
  "icon": "beaker",
  "color": "blue",
  "pillar": "process",
  "module": "process-foundations"
}
```

- [ ] **Step 3: Update soe-01-soe-fundamentals/_meta.json**

```json
{
  "title": "S&OE Fundamentals",
  "description": "Understand what Sales & Operations Execution is, how it differs from S&OP, and how the weekly cadence keeps supply and demand aligned between monthly planning cycles.",
  "icon": "calendar",
  "color": "blue",
  "pillar": "process",
  "module": "process-foundations"
}
```

- [ ] **Step 4: Update soe-02-running-soe/_meta.json**

```json
{
  "title": "Running S&OE",
  "description": "How to run the weekly S&OE cycle in practice — monitoring performance, resolving exceptions, adjusting the near-term plan, and keeping the handoff to execution clean.",
  "icon": "beaker",
  "color": "blue",
  "pillar": "process",
  "module": "process-foundations"
}
```

- [ ] **Step 5: Update exec-01-execution-fundamentals/_meta.json**

```json
{
  "title": "Execution Fundamentals",
  "description": "Understand what execution means in a planning context — the daily operational layer that turns confirmed plans into shipped orders, produced batches, and delivered commitments.",
  "icon": "lightning-bolt",
  "color": "blue",
  "pillar": "process",
  "module": "process-foundations"
}
```

- [ ] **Step 6: Update exec-02-daily-execution/_meta.json**

```json
{
  "title": "Daily Execution Management",
  "description": "How to manage the operational day — order prioritisation, real-time decision-making, and the discipline that keeps execution aligned with the plan when reality does not cooperate.",
  "icon": "beaker",
  "color": "blue",
  "pillar": "process",
  "module": "process-foundations"
}
```

- [ ] **Step 7: Commit**

```bash
git add src/content/chapters/sop-01-sop-fundamentals/_meta.json \
        src/content/chapters/sop-02-running-sop/_meta.json \
        src/content/chapters/soe-01-soe-fundamentals/_meta.json \
        src/content/chapters/soe-02-running-soe/_meta.json \
        src/content/chapters/exec-01-execution-fundamentals/_meta.json \
        src/content/chapters/exec-02-daily-execution/_meta.json
git commit -m "refactor: move fundamentals chapters to process-foundations"
```

---

## Task 3: Create S&OP Demand Forecasting and Inventory Planning chapters

**Files:**
- Create: `src/content/chapters/sop-demand-forecasting/_meta.json`
- Create: `src/content/chapters/sop-demand-forecasting/01-data-collection.md`
- Create: `src/content/chapters/sop-demand-forecasting/02-statistical-baseline.md`
- Create: `src/content/chapters/sop-demand-forecasting/03-commercial-overlay.md`
- Create: `src/content/chapters/sop-demand-forecasting/04-consensus-review.md`
- Create: `src/content/chapters/sop-demand-forecasting/05-forecast-lock.md`
- Create: `src/content/chapters/sop-inventory-planning/_meta.json`
- Create: `src/content/chapters/sop-inventory-planning/01-coverage-analysis.md`
- Create: `src/content/chapters/sop-inventory-planning/02-safety-stock-review.md`
- Create: `src/content/chapters/sop-inventory-planning/03-inventory-target-setting.md`
- Create: `src/content/chapters/sop-inventory-planning/04-exception-resolution.md`

Note on slug derivation: `slugFromPath` in `src/lib/chapters.ts` strips the leading `\d+-` prefix, so `01-data-collection.md` → slug `data-collection`. These slugs must match the `order.json` topics array exactly.

- [ ] **Step 1: Create sop-demand-forecasting/_meta.json**

```json
{
  "title": "Demand Forecasting",
  "description": "Turning raw sales history into a single consensus demand number — from data cleansing through statistical modelling, commercial review, and final lock.",
  "icon": "network",
  "color": "blue",
  "pillar": "process",
  "module": "sop-process"
}
```

- [ ] **Step 2: Create sop-demand-forecasting/01-data-collection.md**

```markdown
---
title: "Data Collection & Cleansing"
description: "Gather sales actuals from ERP and field actuals from FMS. Remove anomalies caused by one-off events such as promotions or supply failures. Validate that all required data feeds are complete before the statistical model is run."
topicLayout: "process-step-detail"
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
---
```

- [ ] **Step 3: Create sop-demand-forecasting/02-statistical-baseline.md**

```markdown
---
title: "Statistical Baseline Generation"
description: "Run the statistical forecasting model on the cleansed history. Review model fit and flag product families where accuracy falls below the agreed threshold. Select the best-performing algorithm per family."
topicLayout: "process-step-detail"
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
---
```

- [ ] **Step 4: Create sop-demand-forecasting/03-commercial-overlay.md**

```markdown
---
title: "Commercial Overlay"
description: "The commercial team reviews the statistical baseline and applies adjustments based on market intelligence the model cannot see — promotions, pipeline changes, new distribution wins, or lost accounts."
topicLayout: "process-step-detail"
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
---
```

- [ ] **Step 5: Create sop-demand-forecasting/04-consensus-review.md**

```markdown
---
title: "Consensus Forecast Review"
description: "Commercial and supply chain align on a single consensus number. Disagreements are surfaced and resolved in the meeting — not after it. The output is one agreed forecast, not a range or multiple versions."
topicLayout: "process-step-detail"
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
---
```

- [ ] **Step 6: Create sop-demand-forecasting/05-forecast-lock.md**

```markdown
---
title: "Forecast Lock & Distribution"
description: "The agreed consensus forecast is locked in the system and distributed to downstream planning processes. Any post-lock revision requires a formal change request with an owner and documented reason."
topicLayout: "process-step-detail"
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

- [ ] **Step 7: Create sop-inventory-planning/_meta.json**

```json
{
  "title": "Inventory Planning",
  "description": "Setting and maintaining inventory targets that balance service levels against working capital — from coverage analysis through exception resolution.",
  "icon": "network",
  "color": "blue",
  "pillar": "process",
  "module": "sop-process"
}
```

- [ ] **Step 8: Create sop-inventory-planning/01-coverage-analysis.md**

```markdown
---
title: "Coverage Analysis"
description: "Assess current inventory positions against projected demand. Identify where coverage is below target, where excess stock is building, and where write-off risk exists."
topicLayout: "process-step-detail"
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
---
```

- [ ] **Step 9: Create sop-inventory-planning/02-safety-stock-review.md**

```markdown
---
title: "Safety Stock Review"
description: "Review and update safety stock targets to reflect current demand variability, supplier lead time variability, and agreed service level targets. Targets should be challenged periodically — not left static."
topicLayout: "process-step-detail"
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
---
```

- [ ] **Step 10: Create sop-inventory-planning/03-inventory-target-setting.md**

```markdown
---
title: "Inventory Target Setting"
description: "Set or confirm cycle stock and safety stock targets for the planning horizon. Targets balance working capital efficiency against service level obligations."
topicLayout: "process-step-detail"
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
---
```

- [ ] **Step 11: Create sop-inventory-planning/04-exception-resolution.md**

```markdown
---
title: "Exception Resolution"
description: "Resolve inventory exceptions flagged during coverage and target-setting — shortage risks requiring expediting, excess positions requiring action, and write-off candidates requiring sign-off."
topicLayout: "process-step-detail"
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

- [ ] **Step 12: Commit**

```bash
git add src/content/chapters/sop-demand-forecasting/ src/content/chapters/sop-inventory-planning/
git commit -m "feat: add demand forecasting and inventory planning chapters"
```

---

## Task 4: Create S&OP Supply Planning, Resource Planning, and S&OP Review chapters

**Files:**
- Create: `src/content/chapters/sop-supply-planning/_meta.json` + 5 topic files
- Create: `src/content/chapters/sop-resource-planning/_meta.json` + 4 topic files
- Create: `src/content/chapters/sop-sop-review/_meta.json` + 4 topic files

- [ ] **Step 1: Create sop-supply-planning/_meta.json**

```json
{
  "title": "Supply Planning",
  "description": "Translating the consensus demand plan into a feasible, constrained production and procurement schedule — identifying gaps and preparing costed options for resolution.",
  "icon": "network",
  "color": "blue",
  "pillar": "process",
  "module": "sop-process"
}
```

- [ ] **Step 2: Create sop-supply-planning/01-capacity-assessment.md**

```markdown
---
title: "Capacity Assessment"
description: "Assess available production and procurement capacity for the planning horizon against the locked demand forecast. Identify bottlenecks and headroom before running the constrained plan."
topicLayout: "process-step-detail"
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
---
```

- [ ] **Step 3: Create sop-supply-planning/02-constrained-supply-run.md**

```markdown
---
title: "Constrained Supply Run"
description: "Run the constrained supply plan in planning software to generate a feasible production and procurement schedule. The system applies prioritisation rules to allocate constrained capacity to demand."
topicLayout: "process-step-detail"
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
---
```

- [ ] **Step 4: Create sop-supply-planning/03-gap-identification.md**

```markdown
---
title: "Gap Identification"
description: "Identify where the constrained supply plan cannot meet the consensus demand plan. Gaps are quantified by volume, value, and timing and classified by root cause to guide option development."
topicLayout: "process-step-detail"
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
---
```

- [ ] **Step 5: Create sop-supply-planning/04-option-development.md**

```markdown
---
title: "Option Development"
description: "For each significant gap, develop costed options that could close it. The supply review should never present a gap without a proposed solution — even if none of the options are ideal."
topicLayout: "process-step-detail"
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
---
```

- [ ] **Step 6: Create sop-supply-planning/05-supply-plan-submission.md**

```markdown
---
title: "Supply Plan Submission"
description: "Finalise and submit the supply plan for the pre-S&OP review, accompanied by the gap report and options list so the pre-S&OP team can make informed decisions."
topicLayout: "process-step-detail"
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

- [ ] **Step 7: Create sop-resource-planning/_meta.json**

```json
{
  "title": "Resource Planning",
  "description": "Translating the supply plan into labour, equipment, and capacity requirements — identifying binding constraints and allocating available resource to the plan.",
  "icon": "network",
  "color": "blue",
  "pillar": "process",
  "module": "sop-process"
}
```

- [ ] **Step 8: Create sop-resource-planning/01-resource-demand-projection.md**

```markdown
---
title: "Resource Demand Projection"
description: "Translate the supply plan into resource requirements — labour, equipment, and warehouse capacity — across the planning horizon. This projection forms the basis for capacity mapping and constraint identification."
topicLayout: "process-step-detail"
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
---
```

- [ ] **Step 9: Create sop-resource-planning/02-capacity-mapping.md**

```markdown
---
title: "Capacity Mapping"
description: "Compare projected resource demand against available capacity to identify surplus and deficit positions. Available capacity accounts for planned maintenance, holidays, and contractual limits."
topicLayout: "process-step-detail"
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
---
```

- [ ] **Step 10: Create sop-resource-planning/03-constraint-identification.md**

```markdown
---
title: "Constraint Identification"
description: "Identify which resource constraints are binding — those that will prevent the supply plan from being executed as planned. Not all constraints require action; only those that create plan risk."
topicLayout: "process-step-detail"
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
---
```

- [ ] **Step 11: Create sop-resource-planning/04-resource-allocation.md**

```markdown
---
title: "Resource Allocation"
description: "Allocate available resource capacity to the supply plan, applying agreed prioritisation rules. Where constraints cannot be resolved, document the trade-off and escalate to pre-S&OP."
topicLayout: "process-step-detail"
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

- [ ] **Step 12: Create sop-sop-review/_meta.json**

```json
{
  "title": "S&OP Review",
  "description": "Bringing demand, supply, inventory, and resource plans together — from cross-functional pre-alignment through executive sign-off and plan distribution.",
  "icon": "network",
  "color": "blue",
  "pillar": "process",
  "module": "sop-process"
}
```

- [ ] **Step 13: Create sop-sop-review/01-pre-sop-alignment.md**

```markdown
---
title: "Pre-S&OP Alignment"
description: "The pre-S&OP meeting brings together the outputs of demand, supply, inventory, and resource planning to identify cross-functional issues that cannot be resolved within individual functions. The goal is to prepare a small number of clear decisions for executive review."
topicLayout: "process-step-detail"
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
---
```

- [ ] **Step 14: Create sop-sop-review/02-financial-reconciliation.md**

```markdown
---
title: "Financial Reconciliation"
description: "Reconcile the volume plan with the financial plan to ensure consistency. Significant volume-to-value gaps must be explained and, where material, resolved before executive review."
topicLayout: "process-step-detail"
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
---
```

- [ ] **Step 15: Create sop-sop-review/03-executive-sop-review.md**

```markdown
---
title: "Executive S&OP Review"
description: "The executive review is the decision-making forum of the S&OP cycle. It reviews the aligned plan, considers the issues and options prepared by pre-S&OP, and makes the decisions needed to produce one agreed business plan."
topicLayout: "process-step-detail"
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
---
```

- [ ] **Step 16: Create sop-sop-review/04-plan-distribution.md**

```markdown
---
title: "Plan Distribution & Close"
description: "The agreed decisions from the executive review are applied to the plan in planning software. The final plan is distributed to all functions as the authoritative business plan. The cycle is formally closed and the next cycle is initiated."
topicLayout: "process-step-detail"
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

- [ ] **Step 17: Commit**

```bash
git add src/content/chapters/sop-supply-planning/ src/content/chapters/sop-resource-planning/ src/content/chapters/sop-sop-review/
git commit -m "feat: add supply planning, resource planning, and S&OP review chapters"
```

---

## Task 5: Create S&OE and Execution stub chapters

**Files:**
- Create: 4 × S&OE `_meta.json` files
- Create: 4 × Execution `_meta.json` files

No topic files — chapters are intentional stubs.

- [ ] **Step 1: Create soe-demand-monitoring/_meta.json**

```json
{
  "title": "Demand Monitoring",
  "description": "Tracking actual demand performance against the agreed plan, identifying deviations early, and escalating where the gap requires a planning response.",
  "icon": "network",
  "color": "teal",
  "pillar": "process",
  "module": "soe-process"
}
```

- [ ] **Step 2: Create soe-supply-monitoring/_meta.json**

```json
{
  "title": "Supply Monitoring",
  "description": "Tracking supply execution against the plan — production output, supplier deliveries, and inventory movements — and flagging constraint-driven deviations before they become service failures.",
  "icon": "network",
  "color": "teal",
  "pillar": "process",
  "module": "soe-process"
}
```

- [ ] **Step 3: Create soe-exception-management/_meta.json**

```json
{
  "title": "Exception Management",
  "description": "Identifying, prioritising, and resolving exceptions in the near-term plan — the discipline that separates reactive firefighting from structured weekly execution.",
  "icon": "network",
  "color": "teal",
  "pillar": "process",
  "module": "soe-process"
}
```

- [ ] **Step 4: Create soe-integrated-review/_meta.json**

```json
{
  "title": "Integrated S&OE Review",
  "description": "The weekly cross-functional review that aligns demand, supply, and operations on the near-term plan — the S&OE equivalent of the executive S&OP meeting.",
  "icon": "network",
  "color": "teal",
  "pillar": "process",
  "module": "soe-process"
}
```

- [ ] **Step 5: Create exec-order-prioritisation/_meta.json**

```json
{
  "title": "Order Prioritisation",
  "description": "Applying agreed prioritisation rules to sequence open orders when supply is constrained — ensuring the right customers and products are served first.",
  "icon": "network",
  "color": "amber",
  "pillar": "process",
  "module": "execution-process"
}
```

- [ ] **Step 6: Create exec-execution-monitoring/_meta.json**

```json
{
  "title": "Execution Monitoring",
  "description": "Tracking daily operational performance against the short-term plan — production throughput, shipment status, and inventory movements — and flagging deviations in time to act.",
  "icon": "network",
  "color": "amber",
  "pillar": "process",
  "module": "execution-process"
}
```

- [ ] **Step 7: Create exec-actuals-capture/_meta.json**

```json
{
  "title": "Actuals Capture",
  "description": "Recording what actually happened — production completions, shipments, receipts, and stock movements — into ERP and FMS so the planning system has accurate starting positions.",
  "icon": "network",
  "color": "amber",
  "pillar": "process",
  "module": "execution-process"
}
```

- [ ] **Step 8: Create exec-feedback-to-planning/_meta.json**

```json
{
  "title": "Feedback to Planning",
  "description": "Closing the loop between execution and planning — surfacing systematic variances, flagging constraint changes, and triggering plan updates where execution reality has diverged from the plan.",
  "icon": "network",
  "color": "amber",
  "pillar": "process",
  "module": "execution-process"
}
```

- [ ] **Step 9: Commit**

```bash
git add src/content/chapters/soe-demand-monitoring/ src/content/chapters/soe-supply-monitoring/ \
        src/content/chapters/soe-exception-management/ src/content/chapters/soe-integrated-review/ \
        src/content/chapters/exec-order-prioritisation/ src/content/chapters/exec-execution-monitoring/ \
        src/content/chapters/exec-actuals-capture/ src/content/chapters/exec-feedback-to-planning/
git commit -m "feat: add stub chapters for S&OE and Execution modules"
```

---

## Task 6: Update TypeScript — TopicMeta and getTopics()

**Files:**
- Modify: `src/lib/chapters.ts`

The `TopicMeta` interface currently has `processSteps?: Array<{...}>` (lines 55–63). Remove it and add four new fields. The `roles?: string[]` field already exists (line 50) — do not add it again.

In `getTopics()`, remove the `processSteps: fm.processSteps ?? undefined,` line and add the four new field mappings.

- [ ] **Step 1: Update the `TopicMeta` interface**

Find in `src/lib/chapters.ts` the block:
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
Replace with:
```typescript
  inputs?: string[];
  outputs?: string[];
  systems?: string[];
  tasks?: string[];
```

- [ ] **Step 2: Update the `getTopics()` mapping**

Find in `src/lib/chapters.ts`:
```typescript
        processSteps: fm.processSteps ?? undefined,
```
Replace with:
```typescript
        inputs: fm.inputs ?? undefined,
        outputs: fm.outputs ?? undefined,
        systems: fm.systems ?? undefined,
        tasks: fm.tasks ?? undefined,
```

- [ ] **Step 3: Verify TypeScript compiles**

```bash
npx tsc --noEmit
```

Expected: no errors (Astro 4 may not have a tsconfig that runs this cleanly standalone — if the command errors about tsconfig, run `npm run build` instead and look only for type errors, not build output).

- [ ] **Step 4: Commit**

```bash
git add src/lib/chapters.ts
git commit -m "refactor: replace processSteps with flat step fields in TopicMeta"
```

---

## Task 7: Create ProcessStepDetailLayout.astro

**Files:**
- Create: `src/layouts/ProcessStepDetailLayout.astro`

This layout renders a single L3 process step as a full topic page. It follows the same header/hero/footer pattern as `ProcessStepsLayout.astro` but has no tabs or JS step switching — only progress tracking.

- [ ] **Step 1: Create the file with the complete content below**

```astro
---
import BaseLayout from './BaseLayout.astro';
import ThemeToggle from '../components/ThemeToggle.astro';

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
  inputs?: string[];
  outputs?: string[];
  roles?: string[];
  systems?: string[];
  tasks?: string[];
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
  inputs = [],
  outputs = [],
  roles = [],
  systems = [],
  tasks = [],
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
  'process-foundations':    { href: `${BASE_URL}process/process-foundations`,    label: 'Process Foundations' },
  'sop-process':            { href: `${BASE_URL}process/sop-process`,            label: 'S&OP' },
  'soe-process':            { href: `${BASE_URL}process/soe-process`,            label: 'S&OE' },
  'execution-process':      { href: `${BASE_URL}process/execution-process`,      label: 'Execution' },
  'organisation-and-roles': { href: `${BASE_URL}people/organisation-and-roles`,  label: 'Organisation & Roles' },
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

const topicId = `${chapterSlug}/${topicSlug}`;
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
          {chapterTitle} · Step {topicOrder}
        </div>
        <h1 class="text-4xl sm:text-5xl font-bold text-gray-900 dark:text-white mb-5 leading-tight tracking-tight">{title}</h1>
        <p class="text-lg text-gray-600 dark:text-gray-400 leading-relaxed max-w-2xl">{description}</p>
      </div>
    </div>

    <!-- Content -->
    <div class="bg-white dark:bg-gray-950">
      <div class="max-w-5xl mx-auto px-6 py-10 space-y-6">

        <!-- Inputs / Outputs -->
        {(inputs.length > 0 || outputs.length > 0) && (
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {inputs.length > 0 && (
              <div class="rounded-xl border border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-900/50 p-5">
                <h4 class="text-xs font-semibold uppercase tracking-wider text-(--accent) mb-4">Inputs</h4>
                <ul class="space-y-2.5">
                  {inputs.map((inp) => (
                    <li class="flex items-start gap-2.5 text-sm text-gray-700 dark:text-gray-300">
                      <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4 shrink-0 mt-0.5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/>
                      </svg>
                      {inp}
                    </li>
                  ))}
                </ul>
              </div>
            )}
            {outputs.length > 0 && (
              <div class="rounded-xl border border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-900/50 p-5">
                <h4 class="text-xs font-semibold uppercase tracking-wider text-(--accent) mb-4">Outputs</h4>
                <ul class="space-y-2.5">
                  {outputs.map((out) => (
                    <li class="flex items-start gap-2.5 text-sm text-gray-700 dark:text-gray-300">
                      <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4 shrink-0 mt-0.5 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/>
                      </svg>
                      {out}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}

        <!-- Roles + Systems -->
        {(roles.length > 0 || systems.length > 0) && (
          <div class="flex flex-wrap gap-2">
            {roles.map((r) => (
              <span class="inline-flex items-center text-xs font-medium px-2.5 py-1 rounded-full bg-indigo-50 dark:bg-indigo-500/10 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-500/30">{r}</span>
            ))}
            {systems.map((s) => (
              <span class="inline-flex items-center text-xs font-medium px-2.5 py-1 rounded-full bg-rose-50 dark:bg-rose-500/10 text-rose-700 dark:text-rose-300 border border-rose-200 dark:border-rose-500/30">{s}</span>
            ))}
          </div>
        )}

        <!-- Tasks -->
        {tasks.length > 0 && (
          <div class="rounded-xl border border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-900/50 p-5">
            <h4 class="text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-4">Tasks</h4>
            <ol class="space-y-3">
              {tasks.map((task, i) => (
                <li class="flex items-start gap-3 text-sm text-gray-700 dark:text-gray-300">
                  <span class="shrink-0 w-5 h-5 rounded-full border border-gray-300 dark:border-gray-600 flex items-center justify-center text-xs font-semibold text-gray-500 dark:text-gray-400 mt-0.5">{i + 1}</span>
                  {task}
                </li>
              ))}
            </ol>
          </div>
        )}

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

  <script define:vars={{ topicId, totalTopics }}>
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
  </script>
</BaseLayout>
```

- [ ] **Step 2: Commit**

```bash
git add src/layouts/ProcessStepDetailLayout.astro
git commit -m "feat: add ProcessStepDetailLayout for L3 process step topics"
```

---

## Task 8: Update [topic].astro and delete ProcessStepsLayout

**Files:**
- Modify: `src/pages/[pillar]/[module]/[chapter]/[topic].astro`
- Delete: `src/layouts/ProcessStepsLayout.astro`
- Delete: `src/content/chapters/sop-03-sop-process-steps/` (entire directory)

- [ ] **Step 1: Remove the ProcessStepsLayout import from [topic].astro**

Find in `src/pages/[pillar]/[module]/[chapter]/[topic].astro`:
```typescript
import ProcessStepsLayout from '../../../../layouts/ProcessStepsLayout.astro';
```
Delete that line entirely.

- [ ] **Step 2: Add the ProcessStepDetailLayout import**

After the existing import block (after the `import RasciTableLayout` line), add:
```typescript
import ProcessStepDetailLayout from '../../../../layouts/ProcessStepDetailLayout.astro';
```

- [ ] **Step 3: Replace the process-steps layout case with process-step-detail**

Find in `src/pages/[pillar]/[module]/[chapter]/[topic].astro`:
```astro
) : layout === 'process-steps' ? (
  <ProcessStepsLayout
    {...sharedProps}
    processSteps={topic.processSteps}
  />
) : layout === 'rasci-table' ? (
```

Replace with:
```astro
) : layout === 'process-step-detail' ? (
  <ProcessStepDetailLayout
    {...sharedProps}
    inputs={topic.inputs}
    outputs={topic.outputs}
    roles={topic.roles}
    systems={topic.systems}
    tasks={topic.tasks}
  />
) : layout === 'rasci-table' ? (
```

- [ ] **Step 4: Delete ProcessStepsLayout.astro**

```bash
rm src/layouts/ProcessStepsLayout.astro
```

- [ ] **Step 5: Delete the old sop-03-sop-process-steps chapter**

```bash
rm -rf src/content/chapters/sop-03-sop-process-steps
```

- [ ] **Step 6: Run build to verify**

```bash
npm run build 2>&1 | tail -5
```

Expected output ends with something like:
```
[build] NNN page(s) built in X.XXs
[build] Complete!
```

No errors. The page count will be higher than before because the 22 new S&OP topic pages (5+4+5+4+4) replace the old 5. Stub chapters with no topics contribute 0 topic pages.

- [ ] **Step 7: Commit**

```bash
git add src/pages/[pillar]/[module]/[chapter]/[topic].astro
git add src/layouts/ProcessStepDetailLayout.astro
git commit -m "feat: wire process-step-detail layout; remove process-steps layout"
```

---

## Task 9: Verify build and spot-check URLs

**Files:** None (verification only)

- [ ] **Step 1: Run full build**

```bash
npm run build 2>&1 | grep -E 'error|warning|Complete|built'
```

Expected: `[build] Complete!` with no errors.

- [ ] **Step 2: Verify new S&OP topic pages exist in build output**

```bash
find .vercel/output/static/process/sop-process -name "index.html" | sort
```

Expected output includes (among others):
```
.vercel/output/static/process/sop-process/sop-demand-forecasting/index.html
.vercel/output/static/process/sop-process/sop-demand-forecasting/data-collection/index.html
.vercel/output/static/process/sop-process/sop-demand-forecasting/statistical-baseline/index.html
.vercel/output/static/process/sop-process/sop-demand-forecasting/commercial-overlay/index.html
.vercel/output/static/process/sop-process/sop-demand-forecasting/consensus-review/index.html
.vercel/output/static/process/sop-process/sop-demand-forecasting/forecast-lock/index.html
.vercel/output/static/process/sop-process/sop-inventory-planning/index.html
...
```

- [ ] **Step 3: Verify moved chapters now appear under process-foundations**

```bash
grep -l "sop-01-sop-fundamentals\|S.OP Fundamentals" .vercel/output/static/process/process-foundations/index.html | head -1
```

Expected: the file path (confirming it exists and contains that slug).

- [ ] **Step 4: Verify the old sop-03-sop-process-steps URL no longer exists**

```bash
ls .vercel/output/static/process/sop-process/sop-03-sop-process-steps 2>&1
```

Expected: `No such file or directory`

- [ ] **Step 5: Spot-check built HTML for inputs/outputs in a new topic**

```bash
grep -o 'Inputs\|Outputs\|Tasks' .vercel/output/static/process/sop-process/sop-demand-forecasting/data-collection/index.html | sort | uniq
```

Expected: `Inputs`, `Outputs`, `Tasks` (all three section headings present).

- [ ] **Step 6: Final commit**

```bash
git add docs/superpowers/specs/2026-06-13-hierarchy-lift-design.md docs/superpowers/plans/2026-06-13-hierarchy-lift.md
git commit -m "docs: add hierarchy lift spec and plan"
```
