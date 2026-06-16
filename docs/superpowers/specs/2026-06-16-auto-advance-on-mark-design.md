# Auto-advance to next topic on "mark complete" / "mark unclear"

**Date:** 2026-06-16
**Status:** Approved (design)

## Goal

When the user clicks **Mark complete** or **Mark unclear** on a topic page, automatically navigate to the next topic — respecting the active route:

- If the topic was reached through a **role course** (`?from=roles/<role>/<phase>`), advance along that role-phase route.
- Otherwise, advance along the **pillar → module → chapter** route.

## Key insight: reuse the existing "Next" link

The bottom nav bar on every topic page (`nav[data-role-nav]`) already contains a **Next** anchor. On page load, `src/layouts/BaseLayout.astro` (the `?from=` handler, ~lines 339–396) rewrites that anchor's `href`:

- Role context → next topic in the role-phase (or "Complete phase" → role overview page at the end).
- No role context → next topic in pillar/module/chapter order (or Home at the end), via server-rendered `nextUrl` from `getAdjacentTopics`.

So the correct destination is already resolved into the Next link's `href` by click time. The buttons simply read that `href` and navigate. No routing logic is duplicated.

## Behavior

- Clicking a button to **set** a mark (complete or unclear): save state, update button UI, dispatch `platform-progress-changed`, then after **~400ms** navigate to the Next link's current `href`.
- Clicking an **already-active** button (to un-mark): clear the flag and stay on the page. No navigation. (Un-marking is a correction, not progress.)
- On the last topic of a route, the Next link is the Finish / "Complete phase" link — advancing there (Home or role page) is the natural end of the route.
- The ~400ms pause lets the button's new color (emerald / amber) register as visual confirmation before the page changes.

## Implementation

The progress + button-handler script is currently **duplicated verbatim** across all 9 topic layouts as a `<script define:vars={{ topicId, totalTopics }}>` block:

`TopicLayout`, `NodeTopicLayout`, `CardGridLayout`, `DataTableLayout`, `ComparisonLayout`, `FullWidthWidgetLayout`, `RasciTableLayout`, `ProcessStepDetailLayout`, `UiTrainingLayout`.

(`totalTopics` is passed but never used — it is dropped.)

### Changes

1. **New shared script** `src/scripts/topic-progress.ts`. A bundled (module) client script that:
   - Reads `topicId` from `data-topic-id` on `#complete-btn` (already present in markup).
   - No-ops if the buttons are absent (non-topic pages).
   - Contains `getProgress` (with legacy `true → 'complete'` migration), `saveProgress`, and `updateButtons` (the existing Tailwind class swaps — must keep the exact complete-string classes so Tailwind doesn't purge them).
   - On load, reflects saved state via `updateButtons`.
   - Wires both click handlers: toggle state, save, `updateButtons`, dispatch `platform-progress-changed`; **if a mark was newly set**, call `advanceToNext()`.
   - `advanceToNext()`: find `nav[data-role-nav]`, take the **last** `a[href]` (the Next link, matching BaseLayout's `navLinks[navLinks.length - 1]`), read its `href`, and `setTimeout(() => location.href = href, 400)`.

2. **Wire once** in `BaseLayout.astro`: add `<script>import '../scripts/topic-progress';</script>` (Astro bundles/dedupes; runs as a deferred module after the DOM is parsed). Lives alongside the existing `?from=` handler — order is irrelevant because navigation only happens on click, long after both load-time scripts have run.

3. **Remove** the duplicated `<script define:vars={{ topicId, totalTopics }}>…</script>` block from all 9 layouts. The buttons' `data-topic-id={topicId}` attributes stay (they are the script's input).

### Non-goals

- No change to the `platform-progress` storage format, to `UserDashboard`, or to the BaseLayout `?from=` rewrite logic.
- No change to button appearance or to which topics show buttons.

## Verification

- `npm run build` succeeds.
- Manual: mark complete → advances to next chapter/pillar topic; same from a role course advances along the phase; un-marking stays put; last topic advances to Home / role page.
