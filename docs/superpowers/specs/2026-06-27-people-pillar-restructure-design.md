# People Pillar Restructure — Design Spec

**Date:** 2026-06-27
**Branch:** `review/people-pillar-restructure`
**Pillar:** People (`/people`)

---

## Problem

The People pillar has grown unevenly. Four modules and 25 chapters exist, but significant overlap and a partially-built placeholder layer create confusion about what each chapter is responsible for:

- `people-04-roles-overview` is a pure placeholder sitting alongside `people-01-planning-team`, which already serves as the role index
- `planning-capabilities` duplicates competency coverage that belongs inside individual role chapters
- `decision-rights` and `ownership-of-planning-decisions` restate ground already covered by the RASCI accountability chapter
- `people-03-planning-cadences` mixes two concerns: role-specific day-in-the-life content (which belongs in role chapters) and planning rhythm overview (which belongs in Collaboration)
- `people-01-planning-team` carries topics (`planning-roles-overview`, `role-competencies`) that will be duplicated once individual role chapters are built out

---

## Decisions

### Role chapters are deep profiles

Each individual role chapter (`demand-planner`, `supply-planner`, etc.) will be a full chapter with multiple topics covering: role overview, day-in-the-life, competencies, RASCI position, and systems used. This is the anchor decision that drives the rest of the restructure.

### `people-01-planning-team` becomes a lightweight team index

Scope: who is on the team, org chart, broader org structure, building an effective team. It acts as a signpost to the deep role chapters — not a role reference itself.

Topics to remove from `people-01-planning-team`:
- `planning-roles-overview` (card-grid) — replaced by the index function of the chapter itself
- `role-competencies` (card-grid) — competency detail moves into each role chapter

Topics to keep:
- `who-is-in-the-planning-team`
- `the-planning-org-chart`
- `broader-org-structure`
- `building-an-effective-planning-team`

### `people-04-roles-overview` is dropped

It is a placeholder whose function is fully covered by the refocused `people-01-planning-team`. No content to migrate.

### Accountability chapter absorbs decision-rights and ownership chapters

`people-02-accountability` is strengthened to cover three concerns in one chapter:
1. RASCI per S&OP step (existing topics: demand review, supply review, executive S&OP, making RASCI work, what is RASCI)
2. Authority model — who can decide at what threshold, delegation limits
3. Ownership enforcement — how accountability is sustained over time, not just defined

`decision-rights` and `ownership-of-planning-decisions` are removed as standalone chapters. Their content is absorbed into the expanded accountability chapter.

`decision-frameworks` and `escalation-behaviour` remain as their own chapters in the module.

### `people-03-planning-cadences` is split

- Role-specific day-in-the-life topics (`01-week-in-the-life`, `02-month-in-the-life`, `03-quarter-in-the-life`) move into the relevant deep role chapters (operational planner, tactical planner, strategic planner respectively)
- The chapter remains but is refocused as a **planning rhythm overview**: the S&OP/S&OE drumbeat, the cadence calendar, and how the three horizons connect — not role-specific

### `planning-capabilities` is dropped

With each role chapter carrying its own competency topics, a cross-role capability chapter adds no unique value. The remaining Capabilities & Skills chapters (`data-literacy`, `decision-making-skills`, `continuous-improvement-mindset`) are behavioural and cross-role; they stand on their own.

---

## Target Structure

### Module 1: Roles & Responsibilities

| Chapter | Status | Notes |
|---|---|---|
| `people-01-planning-team` | Refocus | Lightweight index: org chart + team overview + signposts. Remove `planning-roles-overview` and `role-competencies` topics. |
| `demand-planner` | Build out | Deep profile: overview, day-in-the-life (from cadences chapter), competencies, RASCI position, systems |
| `supply-planner` | Build out | Deep profile |
| `production-planner` | Build out | Deep profile |
| `master-planner` | Build out | Deep profile |
| `sales` | Build out | Deep profile |
| `operations` | Build out | Deep profile |
| `finance` | Build out | Deep profile |
| `management` | Build out | Deep profile |
| `subject-matter-expert` | Build out | Deep profile |
| ~~`people-04-roles-overview`~~ | **Drop** | Placeholder fully replaced by refocused `people-01` |

### Module 2: Decision-Making & Ownership

| Chapter | Status | Notes |
|---|---|---|
| `people-02-accountability` | Strengthen | Absorb `decision-rights` + `ownership-of-planning-decisions`. Add authority model and ownership enforcement topics. |
| `decision-frameworks` | Keep | No change |
| `escalation-behaviour` | Keep | No change |
| ~~`decision-rights`~~ | **Merge** | Content absorbed into `people-02-accountability` |
| ~~`ownership-of-planning-decisions`~~ | **Merge** | Content absorbed into `people-02-accountability` |

### Module 3: Collaboration & Ways of Working

| Chapter | Status | Notes |
|---|---|---|
| `people-03-planning-cadences` | Refocus | Remove role-specific day-in-the-life topics (migrate to role chapters). Refocus on planning rhythm overview: S&OP/S&OE drumbeat, cadence calendar, horizon connections. |
| `collaboration-model` | Keep | No change |
| `planning-meeting-behaviour` | Keep | No change |
| `stakeholder-alignment` | Keep | No change |
| `communication-standards` | Keep | No change |

### Module 4: Capabilities & Skills

| Chapter | Status | Notes |
|---|---|---|
| `data-literacy` | Keep | No change |
| `decision-making-skills` | Keep | No change |
| `continuous-improvement-mindset` | Keep | No change |
| ~~`planning-capabilities`~~ | **Drop** | Competency depth belongs in role chapters; no unique cross-role value |

---

## Net Change

| Metric | Before | After |
|---|---|---|
| Total chapters | 25 | 20 |
| Chapters dropped | — | 2 (`people-04-roles-overview`, `planning-capabilities`) |
| Chapters merged into another | — | 2 (`decision-rights`, `ownership-of-planning-decisions` → `people-02-accountability`) |
| Chapters refocused | — | 2 (`people-01-planning-team`, `people-03-planning-cadences`) |
| Topics relocated | — | 3 day-in-the-life topics → relevant role chapters; 2 competency topics removed from `people-01` |

---

## Topics to Migrate

> **Note on day-in-the-life destinations:** The three cadence topics use generic horizon labels ("operational planner", "tactical planner", "strategic planner") that do not map 1:1 to role chapter titles. The destinations below are provisional — confirm the best fit when the target role chapter scope is defined during implementation.

| Topic | From | To |
|---|---|---|
| `01-week-in-the-life` | `people-03-planning-cadences` | `production-planner` — content covers operational horizon: ERP actuals, order prioritisation, exception triage |
| `02-month-in-the-life` | `people-03-planning-cadences` | `master-planner` — content covers tactical horizon: S&OE cadence + handover into S&OP |
| `03-quarter-in-the-life` | `people-03-planning-cadences` | `demand-planner` — content covers strategic horizon: three full S&OP cycles, IBP refresh |
| `planning-roles-overview` | `people-01-planning-team` | Remove (function replaced by lightweight index) |
| `role-competencies` | `people-01-planning-team` | Remove (competency detail moves to individual role chapters) |

---

## What This Does Not Change

- Module names and slugs are unchanged
- URL structure is unchanged
- All `comingSoon` chapters not mentioned above are unaffected
- No changes to the Process, Technology, or Data pillars
- `order.json` will need updating to reflect dropped chapters and relocated topics

---

## Open Questions

None — all structural decisions have been confirmed by the user.
