# Design: Data & Process Pillar Content

**Date:** 2026-06-07
**Author:** Stefan Bakker

## Context

The o9 Solutions educational platform currently has four pillars: Technology (live), People, Process, and Data (all coming soon). Stefan has been assigned to train a mixed audience — new employees, experienced planners, and managers/stakeholders — on two topics:

1. **Data-driven planning** — how data quality and structure determine planning outcomes (Data pillar)
2. **Scenario planning** — how to use o9's what-if simulation feature to make better decisions (Process pillar)

Both pillars will follow the same chapter/topic structure as the Technology pillar, using existing Astro markdown content components.

---

## Audience

Mixed:
- **New employees** — need conceptual grounding before platform specifics
- **Supply chain planners & analysts** — want depth on tools and techniques
- **Managers/stakeholders** — need the "why" without hands-on detail

Content is sequenced so Chapter 1 of each pillar serves all audiences; Chapter 2 goes deeper for planners and analysts.

---

## Data Pillar

**Core message:** Data quality and structure directly determine the quality of your planning outcomes — garbage in, garbage out.

### Chapter 1 — Planning Data Fundamentals
*Concept-first. Accessible to all audiences.*

| # | Topic | Format |
|---|-------|--------|
| 1 | What is Data-Driven Planning? | prose-topic |
| 2 | The o9 Data Model Overview | node-topic (links to Technology pillar concepts) |
| 3 | Where Data Comes From (sources & signals) | prose-topic |
| 4 | How Data Flows into a Plan | prose-topic |
| 5 | The Cost of Bad Data | prose-topic |

### Chapter 2 — Data Quality & Its Impact
*Deeper dive for planners and analysts.*

| # | Topic | Format |
|---|-------|--------|
| 1 | What Makes Data "Good Enough"? | prose-topic |
| 2 | Common Data Problems in Planning | prose-topic |
| 3 | How Data Quality Shows Up in Plans | prose-topic |
| 4 | Data Governance Basics | prose-topic |
| 5 | Improving Data Quality Over Time | prose-topic |

---

## Process Pillar

**Core message:** Scenario planning is a structured way to explore "what if" questions in o9 — run alternatives, compare outcomes, and commit to the best plan.

### Chapter 1 — Scenario Planning Fundamentals
*Concept-first. Accessible to all audiences.*

| # | Topic | Format |
|---|-------|--------|
| 1 | What is Scenario Planning? | prose-topic |
| 2 | When to Use Scenario Planning | prose-topic |
| 3 | Types of Scenarios in Supply Chain | prose-topic |
| 4 | The Scenario Planning Process (define → model → compare → decide) | prose-topic |
| 5 | Setting Up Effective Scenarios | prose-topic |

### Chapter 2 — Running Scenarios in o9
*Hands-on. For planners actively using the platform.*

| # | Topic | Format |
|---|-------|--------|
| 1 | Creating a Scenario in o9 | prose-topic |
| 2 | Adjusting Parameters & Assumptions | prose-topic |
| 3 | Running & Comparing Scenarios | prose-topic |
| 4 | Promoting a Scenario to Baseline | prose-topic |
| 5 | Communicating Scenario Findings to Stakeholders | prose-topic |

---

## Content Structure (Astro)

Follows the existing Technology pillar pattern:

```
src/content/chapters/
  data-01-planning-data-fundamentals/
    _meta.json
    01-what-is-data-driven-planning.md
    02-o9-data-model-overview.md
    03-where-data-comes-from.md
    04-how-data-flows-into-a-plan.md
    05-the-cost-of-bad-data.md
  data-02-data-quality-and-impact/
    _meta.json
    01-what-makes-data-good-enough.md
    02-common-data-problems.md
    03-how-data-quality-shows-up-in-plans.md
    04-data-governance-basics.md
    05-improving-data-quality-over-time.md
  process-01-scenario-planning-fundamentals/
    _meta.json
    01-what-is-scenario-planning.md
    02-when-to-use-scenario-planning.md
    03-types-of-scenarios.md
    04-the-scenario-planning-process.md
    05-setting-up-effective-scenarios.md
  process-02-running-scenarios-in-o9/
    _meta.json
    01-creating-a-scenario-in-o9.md
    02-adjusting-parameters-and-assumptions.md
    03-running-and-comparing-scenarios.md
    04-promoting-a-scenario-to-baseline.md
    05-communicating-scenario-findings.md
```

The `/data` and `/process` pillar pages need to be updated from "coming soon" placeholders to chapter list views (same as `/technology/index.astro`).

The chapter loader (`src/lib/chapters.ts`) currently loads all chapters without pillar filtering — the Technology pillar would accidentally show Data and Process chapters. The chapter slug prefix convention (`data-01-`, `process-01-`, `tech-01-` for existing chapters) will be used to filter per pillar. Existing Technology chapter slugs may need renaming or the loader needs a prefix filter parameter.

---

## Verification

1. Run `npm run dev` and confirm `/data` and `/process` render chapter lists
2. Navigate into each chapter and verify all topic pages load
3. Confirm breadcrumb navigation works back to pillar hub
4. Confirm progress dots track correctly per topic
5. Spot-check on mobile layout
