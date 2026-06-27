# Process Pillar Restructure — Design Spec

**Date:** 2026-06-27
**Scope:** Process pillar only (`src/content/chapters/` entries with `"theme": "process"`)
**Goal:** Eliminate content overlap, establish parallel structure across the three planning cycles (S&OP / S&OE / Execution), and create a clean 6-module architecture.

---

## Problem Statement

The current Process pillar has three categories of overlap:

1. **Summary vs. detail duplication** — `sop-02-running-sop` summarises the same steps that `sop-demand-forecasting`, `sop-supply-planning`, `sop-inventory-planning`, `sop-resource-planning`, and `sop-sop-review` cover in full detail. `exec-02-daily-execution` has the same relationship with four stub execution chapters.

2. **Same concept at multiple levels** — "Exception management" appears as a topic in `soe-01-soe-fundamentals`, as `management-by-exception` in `process-05-governance-and-escalation`, and as a separate stub chapter `exception-management` under advanced-planning.

3. **Structural asymmetry** — S&OP has 5 detailed step chapters; S&OE has 2 overview chapters and 4 empty stubs; Execution has 2 overview chapters and 4 empty stubs. The three cycles don't follow a consistent pattern.

---

## Target Architecture

Six modules, each with one clearly bounded job.

| # | Module slug | Job |
|---|---|---|
| 1 | `planning-fundamentals` | What integrated planning is — gateway before any cycle |
| 2 | `sop` | Monthly cycle — fundamentals then step-by-step execution |
| 3 | `soe` | Weekly cycle — fundamentals then monitoring and review |
| 4 | `execution` | Daily cycle — fundamentals then operational detail |
| 5 | `planning-governance` | Standing rules, escalation paths, KPIs — cross-cycle reference |
| 6 | `advanced-planning` | Scenarios, exceptions, constraints — cross-cycle techniques |

**Replaces** the current live modules (`process-fundamentals`, `scenario-planning`, `sop-process`, `soe-process`, `execution-process`) and the `order.json` planned module `planning-cycles-and-governance` (which was an awkward hybrid of fundamentals and governance content).

---

## Module 1 — Planning Foundations

**Purpose:** The single entry point into Process. A learner reads this before touching any cycle content.

| Chapter slug | Status | Action |
|---|---|---|
| `process-03-operating-model` | ✅ has content | Rename title to "Planning Overview" — slug unchanged |
| `planning-horizons` | 🔲 stub | Build out |
| `integrated-planning-concept` | 🔲 stub | Build out |

`process-03-operating-model` acts as the gateway: it introduces S&OP, S&OE, and Execution at a high level and points learners toward the relevant cycle module. It does not attempt to fully explain each cycle (that job belongs to `sop-01`, `soe-01`, and `exec-01`).

---

## Module 2 — S&OP

**Purpose:** Everything needed to understand and run the monthly S&OP cycle.

| Chapter slug | Status | Action |
|---|---|---|
| `sop-01-sop-fundamentals` | ✅ has content | No change |
| `sop-demand-forecasting` | ✅ has content | No change |
| `sop-supply-planning` | ✅ has content | No change |
| `sop-inventory-planning` | ✅ has content | No change |
| `sop-resource-planning` | ✅ has content | No change |
| `sop-sop-review` | ✅ has content | No change |
| `sop-02-running-sop` | ✅ has content | **Delete** — redundant; the 5 detail chapters replace it |

`sop-01` covers what S&OP is, roles, outputs, and how it appears in the planning tool. The five step chapters (`sop-demand-forecasting` through `sop-sop-review`) cover step-by-step execution. No summary layer sits between them.

---

## Module 3 — S&OE

**Purpose:** Everything needed to understand and run the weekly S&OE cycle.

| Chapter slug | Status | Action |
|---|---|---|
| `soe-01-soe-fundamentals` | ✅ has content | Remove `exception-management` topic; add cross-reference to Advanced Planning |
| `soe-02-running-soe` | ✅ has content | No change |
| `soe-demand-monitoring` | 🔲 stub | Build out |
| `soe-supply-monitoring` | 🔲 stub | Build out |
| `soe-integrated-review` | 🔲 stub | Build out |
| `soe-exception-management` | 🔲 stub | **Delete** — covered by the advanced-planning exception chapter |

`soe-01` covers what S&OE is, the weekly cadence, roles, and how to escalate to S&OP. The `exception-management` topic is removed from `soe-01` because exception management is a cross-cycle concept that belongs in Advanced Planning; `soe-01` instead references it. The three monitoring chapters parallel the S&OP step chapters.

---

## Module 4 — Execution

**Purpose:** Everything needed to understand and run the daily execution cycle.

| Chapter slug | Status | Action |
|---|---|---|
| `exec-01-execution-fundamentals` | ✅ has content | Remove `execution-kpis` topic; add cross-reference to Planning Governance |
| `exec-order-prioritisation` | 🔲 stub | Build out |
| `exec-execution-monitoring` | 🔲 stub | Build out |
| `exec-actuals-capture` | 🔲 stub | Build out |
| `exec-feedback-to-planning` | 🔲 stub | Build out |
| `exec-02-daily-execution` | ✅ has content | **Delete** — expanded into 4 standalone chapters |

Mirrors the S&OP structure: one fundamentals chapter followed by detailed operational chapters. `exec-01` covers what execution is, from plan to action, and how execution connects to ERP. The `execution-kpis` topic moves out of `exec-01` (it belongs in Planning Governance alongside all other KPI content).

---

## Module 5 — Planning Governance

**Purpose:** Standing policy decisions, escalation structures, and KPIs — the reference layer that the three cycles operate within.

| Chapter slug | Status | Action |
|---|---|---|
| `process-04-planning-policy` | ✅ has content | No change — "what the rules are" angle (service levels, safety stock thresholds, allocation, prioritisation policy) |
| `process-05-governance-and-escalation` | ✅ has content | Remove `management-by-exception` topic; add cross-reference to Advanced Planning |
| `process-06-kpis` | ✅ has content | No change |

`process-04` defines the standing rules. `process-05` defines how decisions are made and how issues escalate when they can't be resolved in-cycle. `management-by-exception` is removed from `process-05` because exception management as a technique belongs in Advanced Planning; `process-05` retains escalation paths and governance structure. `process-06` covers the KPI framework, ownership, and review cadence.

**Intent boundary with cycle chapters:** `process-04` answers "what is the policy" (the definition). The cycle chapters (`sop-inventory-planning`, etc.) answer "how do you apply this policy in the cycle". Both are kept; the angle is different.

---

## Module 6 — Advanced Planning

**Purpose:** Cross-cycle techniques used in S&OP, S&OE, and Execution that don't belong inside any single cycle.

| Chapter slug | Status | Action |
|---|---|---|
| `process-01-scenario-planning-fundamentals` | ✅ has content | No change |
| `process-02-running-scenarios` | ✅ has content | No change |
| `exception-management` | 🔲 stub | **Build into a full chapter** — consolidates content currently split across `soe-01` (exception-management topic) and `process-05` (management-by-exception topic) |
| `constraint-management` | 🔲 stub | Build out |

Scenario planning (two chapters), exception management, and constraint management are all cross-cycle techniques — used across S&OP, S&OE, and Execution — and none belong inside a single cycle module. Exception management consolidates content currently split across `soe-01` and `process-05`.

---

## Changes Summary

### Deletions
| Item | Type | Reason |
|---|---|---|
| `sop-02-running-sop` | Chapter | Replaced by 5 detail chapters |
| `exec-02-daily-execution` | Chapter | Replaced by 4 standalone chapters |
| `soe-exception-management` | Chapter (stub) | Replaced by `exception-management` in Advanced Planning |

### Topic removals from existing chapters
| Topic | From chapter | Reason |
|---|---|---|
| `exception-management` | `soe-01-soe-fundamentals` | Moves to Advanced Planning; soe-01 adds a cross-reference |
| `management-by-exception` | `process-05-governance-and-escalation` | Moves to Advanced Planning; process-05 adds a cross-reference |
| `execution-kpis` | `exec-01-execution-fundamentals` | Moves into `process-06-kpis` in Planning Governance; exec-01 adds a cross-reference |

### Rename
| Current title | New title | Slug | Reason |
|---|---|---|---|
| "S&OP, S&OE, Execution Operating Model" | "Planning Overview" | `process-03-operating-model` (unchanged) | Reflects its gateway role |

### Stub chapters to build (11 chapters)
`planning-horizons`, `integrated-planning-concept`, `soe-demand-monitoring`, `soe-supply-monitoring`, `soe-integrated-review`, `exec-order-prioritisation`, `exec-execution-monitoring`, `exec-actuals-capture`, `exec-feedback-to-planning`, `exception-management` (full), `constraint-management`

### order.json changes
- Remove module `planning-cycles-and-governance`
- Add module `planning-governance` with chapters: `process-04-planning-policy`, `process-05-governance-and-escalation`, `process-06-kpis`
- Confirm module `planning-fundamentals` exists with chapters: `process-03-operating-model`, `planning-horizons`, `integrated-planning-concept`
- Update chapter lists for `sop`, `soe`, `execution`, `advanced-planning` to reflect deletions and additions above

---

## What This Does Not Change

- Chapter slugs (no URL changes for existing content)
- Topic slugs within chapters (no broken links or progress store keys)
- Content of the five S&OP step chapters
- `process-04`, `process-05`, `process-06` content (except the topic removals noted above)
- Scenario planning chapters (process-01, process-02)
- The four other pillars (Technology, Data, People)
