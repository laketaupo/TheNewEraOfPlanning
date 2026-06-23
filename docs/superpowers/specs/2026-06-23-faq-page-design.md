# FAQ Page — Design Spec

Date: 2026-06-23

## Overview

Add a Frequently Asked Questions page at `/faq`, mirroring the structure and patterns of the existing `/glossary` page. FAQ entries are authored in a single JSON file, grouped on the page by pillar, with a client-side text filter and cross-references to topic pages and glossary terms.

---

## Data Model

**File:** `src/content/faq.json`

Flat JSON array of FAQ entry objects. Each entry:

```json
{
  "slug": "what-is-sop",
  "question": "What is S&OP and why does it matter?",
  "answer": "Sales & Operations Planning is a monthly cross-functional process that aligns demand, supply, inventory, and financial plans into one agreed business plan. It matters because it gives all functions a single source of truth for decisions over a 12–18 month horizon.",
  "pillar": "process",
  "seeAlso": ["sop-01-sop-fundamentals/01-what-is-sop"],
  "related": ["sop", "soe"]
}
```

### Fields

| Field | Type | Required | Description |
|---|---|---|---|
| `slug` | string | yes | Unique identifier; used for anchor links (`/faq#<slug>`) |
| `question` | string | yes | Full question text |
| `answer` | string | yes | Plain text answer (no markdown) |
| `pillar` | string | yes | One of `technology`, `process`, `data`, `people` |
| `seeAlso` | string[] | no | `chapter-slug/topic-slug` references; validated at build time |
| `related` | string[] | no | Glossary term slugs; validated at build time |

Entries with no `seeAlso` or `related` omit those fields (or leave them as empty arrays). Order within each pillar group follows the order in the JSON file.

---

## Library

**File:** `src/lib/faq.ts`

Mirrors `src/lib/glossary.ts` in structure and approach.

### Interface

```ts
export interface FaqEntry {
  slug: string;
  question: string;
  answer: string;
  pillar: string;
  seeAlso: string[];
  related: string[];
}
```

### Functions

- **`getFaqEntries(): FaqEntry[]`** — loads `faq.json`, defaults `seeAlso` and `related` to `[]` if absent.
- **`validateFaq(): void`** — called at build time from `faq.astro`. Throws a descriptive error if:
  - A `seeAlso` ref is not a valid `chapter-slug/topic-slug` from `getTopics()`
  - A `related` slug is not a valid glossary term slug from `getGlossaryTerms()`
  - A `pillar` value is not one of the four valid pillars

---

## Page

**File:** `src/pages/faq.astro`  
**URL:** `/faq`

### Structure

```
Fixed minimal header (home icon, top-left) — same as glossary
│
Main (max-w-3xl mx-auto px-6 pt-24 pb-32)
├── H1: "Frequently Asked Questions"
├── Entry count: "N questions across 4 pillars."
├── Text filter input (client-side, filters by question + answer text)
├── Pillar jump nav (Technology · Process · Data · People)
└── Per-pillar sections
    ├── Section heading (pillar label, same style as glossary letter headings)
    └── <dl> of entries
        ├── <dt> — question (semibold)
        ├── <dd> — answer (gray, small leading-relaxed)
        ├── "See: <topic links>" (optional, indigo, xs)
        └── "Related: <glossary links>" (optional, indigo, xs)
```

### Client-side filter

- A text `<input>` above the pillar nav filters the rendered Q&As in real time.
- Filtering hides non-matching `<div>` entries and hides pillar section headings when all entries in that section are hidden.
- Matching is case-insensitive, against concatenated `question + answer` text.
- When no entries match, a short "No questions matched." message is shown.
- The pillar jump nav remains visible during filtering (anchors still work if the section has visible entries).

### Pillar order

Sections appear in the canonical pillar order: Technology → Process → Data → People.

### Entry anchors

Each entry `<div>` has `id={entry.slug}` and `class="scroll-mt-20"` for anchor-link scrolling below the fixed header.

---

## Navigation

### BaseLayout top-right icon bar (`src/layouts/BaseLayout.astro`)

Add a FAQ icon button between the Glossary icon and the Theme toggle. Uses a question-mark SVG (`?` circle or similar), same `p-2 rounded-lg` hover style as the other icons, tooltip "FAQ", links to `/faq`.

### SiteOverlay footer (`src/components/SiteOverlay.astro`)

Add "FAQ" link next to the existing "Glossary" link in the overlay footer, same `text-xs text-indigo-600 dark:text-indigo-400 hover:underline` style.

---

## Validation & Build

`validateFaq()` is called during the build of `faq.astro` (same pattern as `validateGlossary()` in `glossary.astro`). Bad references throw at build time with a descriptive message pointing to the offending entry slug and field.

---

## Seed Content

The initial `faq.json` should include a handful of placeholder entries (2–3 per pillar) to validate the layout and cross-reference wiring. Real content can be expanded later.

---

## Out of Scope

- FAQ entries do not appear as inline hover tooltips (unlike glossary terms — no `data-faq` attribute system).
- No server-side search; client-side filter only.
- No per-entry "last updated" metadata.
- No user-submitted questions.
