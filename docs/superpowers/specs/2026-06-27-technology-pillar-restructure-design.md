# Technology Pillar Restructure — Design Spec

**Date:** 2026-06-27  
**Branch:** worktree-Review+review-technology-pillar  
**Status:** Approved

---

## Context

The Technology pillar currently has 6 modules and 36 non-hidden chapters (a 37th chapter, `99-layout-showcase`, is hidden and excluded from all counts). The primary audience is planning software end users who also need to understand ERP, FMS, and MDM — but not necessarily operate them. Strategic planners live primarily in Planning Software; execution planners live primarily in ERP. FMS is for field-facing roles only; MDM is for MDM-adjacent roles only.

Three structural problems were identified:
1. ERP, FMS, and MDM each follow an identical 7-chapter template, creating heavy duplication and inappropriate depth for an audience that primarily uses planning software
2. The integration story is told four times: twice in arch chapters under Tool Landscape, and once each in the Data Flow In/Out chapters of ERP, FMS, and MDM
3. Adoption content (best practices, common mistakes, FAQ) sits in a standalone module with no system context, making it harder to apply

---

## Goal

Reduce from 36 to 28 non-hidden chapters across 5 modules (down from 6), eliminating duplication and right-sizing depth per system based on audience need.

---

## Module Map

| Module | Current chapters | Proposed chapters |
|---|---|---|
| `tool-landscape` | 4 | 4 |
| `planning-software` | 7 | 7 |
| `erp` | 7 | 8 |
| `fms` | 7 | dissolved → supporting-systems |
| `mdm` | 7 | dissolved → supporting-systems |
| `supporting-systems` *(new)* | — | 9 |
| `adoption-and-usage-quality` | 4 | dissolved → distributed |

---

## Module Detail

### 1. Tool Landscape (4 chapters)

| Chapter slug | Title | Change |
|---|---|---|
| `tool-landscape-overview` | Tool Landscape | Keep (comingSoon) |
| `system-roles` | System Roles | Keep (comingSoon) |
| `arch-how-systems-connect` | How the Systems Connect | **NEW** — merge `arch-01-end-to-end` + `arch-02-integration` |
| `tool-usage-by-role` | Tool Usage by Role | Move in from `adoption-and-usage-quality` (comingSoon) |

**Merge detail:** `arch-how-systems-connect` combines topics from both arch chapters — interfaces, batch runs, data upload (from arch-01) and ERP↔Planning Software, Planning Software↔FMS/MDM integration patterns (from arch-02). Single chapter, single URL, no duplication.

---

### 2. Planning Software (7 chapters)

| Chapter slug | Title | Change |
|---|---|---|
| `01-understanding-basics` | Planning Software Building Blocks | Keep |
| `02-the-network` | The Supply Chain Network Graph | Keep |
| `03-data-flow` | Data Flow | Keep |
| `planning-logic` | How the Planning Engine Works | Rename slug: `03-the-logic` → `planning-logic` (avoids collision with `04-the-simulation`) |
| `04-the-simulation` | The Simulation | Keep |
| `05-navigation-and-ui` | Navigating Planning Software | Keep |
| `planning-software-best-practices` | Working Effectively with Planning Software | **NEW** — absorbs planning-software-scoped best practices, common mistakes, FAQ |
| ~~`08-configuration-manual`~~ | ~~Configuration Manual~~ | **Remove** from module — stays at `/technology/configuration` as standalone |

**Slug rename note:** `03-the-logic` folder must be renamed to `planning-logic`. Using `04-the-logic` would create confusing collision with the existing `04-the-simulation` folder. All references in `order.json` and role JSON files must be updated accordingly.

---

### 3. ERP (8 chapters)

| Chapter slug | Title | Change |
|---|---|---|
| `erp-01-erp-basics` | ERP Basics | Keep |
| `erp-02-the-data-model` | ERP Data Model | Keep |
| `erp-03-data-flow-into-erp` | Data Flow: Into ERP | Keep — execution planners need this |
| `erp-04-data-flow-out-of-erp` | Data Flow: Out of ERP | Keep |
| `erp-05-the-logic` | How ERP Processes Transactions | Keep |
| `erp-06-key-erp-workflows` | Key ERP Workflows | Keep |
| `erp-07-navigation-and-ui` | Navigating ERP | Keep |
| `erp-best-practices` | Working Effectively with ERP | **NEW** — absorbs ERP-scoped best practices, common mistakes, FAQ |

ERP retains full depth. Execution planners use ERP daily and need every chapter.

---

### 4. Supporting Systems (9 chapters — new module)

Replaces the separate `fms` and `mdm` modules. Each system gets 4 chapters (down from 7), plus one shared chapter.

**FMS (4 chapters)**

| Chapter slug | Title | Change |
|---|---|---|
| `fms-01-understanding-basics` | FMS Basics | Keep — move to new module |
| `fms-02-the-data-model` | FMS Data Model | Keep — move to new module |
| `fms-04-data-flow-out-of-fms` | What FMS Sends to Planning | Keep — move to new module |
| `fms-logic-and-workflows` | FMS Logic & Workflows | **NEW** — merge `fms-05-the-logic` + `fms-06-key-fms-workflows` |
| ~~`fms-03-data-flow-into-fms`~~ | ~~Data Flow: Into FMS~~ | **Remove** — not relevant to planning software users |
| ~~`fms-07-navigation-and-ui`~~ | ~~Navigating FMS~~ | **Remove** — role-specific depth not needed at this level |

**MDM (4 chapters)**

| Chapter slug | Title | Change |
|---|---|---|
| `mdm-01-understanding-basics` | MDM Basics | Keep — move to new module |
| `mdm-02-the-data-model` | MDM Data Model | Keep — move to new module |
| `mdm-04-data-flow-out-of-mdm` | What MDM Sends to Planning | Keep — move to new module |
| `mdm-logic-and-workflows` | MDM Logic & Workflows | **NEW** — merge `mdm-05-the-logic` + `mdm-06-key-mdm-workflows` |
| ~~`mdm-03-data-flow-into-mdm`~~ | ~~Data Flow: Into MDM~~ | **Remove** — not relevant to planning software users |
| ~~`mdm-07-navigation-and-ui`~~ | ~~Navigating MDM~~ | **Remove** — role-specific depth not needed at this level |

**Shared (1 chapter)**

| Chapter slug | Title | Change |
|---|---|---|
| `supporting-systems-best-practices` | Working Effectively with Supporting Systems | **NEW** — shared best practices, common mistakes, FAQ for FMS & MDM |

---

### 5. Adoption & Usage Quality — dissolved

| Chapter | Disposition |
|---|---|
| `tool-usage-by-role` | Move to `tool-landscape` module |
| `best-practices` | Split: content absorbed into Working Effectively chapters per module |
| `common-tool-mistakes` | Split: content absorbed into Working Effectively chapters per module |
| `faq-and-troubleshooting` | Split: content absorbed into Working Effectively chapters per module |

Module `adoption-and-usage-quality` removed from `order.json` and all page references.

---

## Removed Content Summary

| Chapter | Topics removed | Reason |
|---|---|---|
| `08-configuration-manual` | 6 | Different content type — stays as standalone at `/technology/configuration` |
| `arch-01-end-to-end` | 3 | Merged into `arch-how-systems-connect` |
| `arch-02-integration` | 2 | Merged into `arch-how-systems-connect` |
| `fms-03-data-flow-into-fms` | 3 | Not relevant to planning software users |
| `fms-05-the-logic` | 3 | Merged into `fms-logic-and-workflows` |
| `fms-06-key-fms-workflows` | 3 | Merged into `fms-logic-and-workflows` |
| `fms-07-navigation-and-ui` | 3 | Role-specific depth not needed |
| `mdm-03-data-flow-into-mdm` | 3 | Not relevant to planning software users |
| `mdm-05-the-logic` | 3 | Merged into `mdm-logic-and-workflows` |
| `mdm-06-key-mdm-workflows` | 3 | Merged into `mdm-logic-and-workflows` |
| `mdm-07-navigation-and-ui` | 3 | Role-specific depth not needed |

---

## New Content Required

| Chapter | Topics to write | Notes |
|---|---|---|
| `arch-how-systems-connect` | ~5 | Combine existing topics from arch-01 + arch-02 |
| `planning-software-best-practices` | ~3 | New content |
| `erp-best-practices` | ~3 | New content |
| `fms-logic-and-workflows` | ~4 | Combine existing topics from fms-05 + fms-06 |
| `mdm-logic-and-workflows` | ~4 | Combine existing topics from mdm-05 + mdm-06 |
| `supporting-systems-best-practices` | ~3 | New content |

---

## Implementation Notes

- `order.json` must be updated: remove `fms`, `mdm`, `adoption-and-usage-quality` module entries; add `supporting-systems`; update chapter lists per module
- `03-the-logic` folder rename to `planning-logic` requires updating all role JSON files that reference `03-the-logic/` topic paths
- `src/pages/technology/` needs a new `supporting-systems/index.astro` module page
- `src/pages/technology/fms/` and `src/pages/technology/mdm/` index pages can be removed
- `moduleBackMap` in `[chapter]/index.astro` and `moduleLabels` in `SiteOverlay.astro` must be updated
- Role courses referencing `fms-*` and `mdm-*` chapters must have their module context updated (chapter slugs stay the same, only the module they belong to changes)
- Configuration Manual page at `src/pages/technology/configuration/` is unaffected
