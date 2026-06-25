# Role Matrix Phase View — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a "Phase view" to the Role × Chapter Matrix overlay that groups chapter rows by learning phase (Awareness → Conceptual → Practical → Embedded → Optimization) instead of Pillar → Module.

**Architecture:** All changes are confined to a single Astro component (`RoleMatrix.astro`). The Astro frontmatter computes a canonical phase assignment for every chapter at build time (majority-vote across role JSON files). Two `<tbody>` elements are rendered — one for the existing Pillar view, one for the new Phase view — and a JS view-toggle swaps their visibility. Phase row collapse mirrors the existing theme-row collapse pattern exactly.

**Tech Stack:** Astro 4 (SSG), TypeScript, Tailwind CSS 3, inline `<style is:global>` for dark-mode-aware CSS, vanilla JS in `<script>` block.

## Global Constraints

- No new files — all changes in `src/components/RoleMatrix.astro` only.
- Dark mode must work: every new background/colour must have a `.dark` CSS rule.
- `npm run build` must pass without errors after every task (it runs `astro build` then `pagefind`).
- No Tailwind string interpolation — use lookup maps or inline CSS variables for dynamic colours.
- Verify commands: `npm run build` (build check) and `npm run dev` + browser (visual check).

---

### Task 1: Compute phase groups in the Astro frontmatter

**Files:**
- Modify: `src/components/RoleMatrix.astro:1-125` (frontmatter section)

**Interfaces:**
- Consumes: `getLearningPhases()` from `../lib/roles` (returns `LearningPhase[]` with `id` and `title` fields); `allRoles` (already in scope, `RoleConfig[]` each with optional `phases: RolePhaseConfig[]`); `allChapters` (already in scope)
- Produces:
  - `canonicalPhaseMap: Map<string, string>` — maps chapter slug → phase id
  - `phaseGroups: { id: string; title: string; chapters: ChapterMeta[] }[]` — ordered by phase, empty phases omitted
  - `unassignedChapters: ChapterMeta[]` — chapters with no phase assignment
  - `phaseMeta` — colour lookup used in Task 2
  - `phaseCss: string` — injected as `<style is:global>` in Task 2

- [ ] **Step 1: Add `getLearningPhases` to the existing import**

In `src/components/RoleMatrix.astro`, line 2, change:
```typescript
import { getChapters } from '../lib/chapters';
import { getRoles } from '../lib/roles';
```
to:
```typescript
import { getChapters } from '../lib/chapters';
import { getRoles, getLearningPhases } from '../lib/roles';
```

- [ ] **Step 2: Add phase computation block after line 7 (`const allRoles = getRoles();`)**

Insert the following block immediately after `const allRoles = getRoles();`:

```typescript
// ── Phase view data ──────────────────────────────────────────────────────────

const learningPhases = getLearningPhases(); // [{id, title, ...}, ...]
const phaseOrder = learningPhases.map(p => p.id); // tie-break order

// Tally how many roles assign each chapter to each phase
const phaseTally = new Map<string, Map<string, number>>();
for (const role of allRoles) {
  if (!role.phases) continue;
  for (const phase of role.phases) {
    for (const chSlug of phase.chapters) {
      if (!phaseTally.has(chSlug)) phaseTally.set(chSlug, new Map());
      const t = phaseTally.get(chSlug)!;
      t.set(phase.phaseId, (t.get(phase.phaseId) ?? 0) + 1);
    }
  }
}

// Pick canonical phase: highest count, tie-break by phase order (earlier wins)
const canonicalPhaseMap = new Map<string, string>();
for (const [chSlug, tally] of phaseTally) {
  let bestPhase = '';
  let bestCount = 0;
  for (const phaseId of phaseOrder) {
    const count = tally.get(phaseId) ?? 0;
    if (count > bestCount) { bestCount = count; bestPhase = phaseId; }
  }
  canonicalPhaseMap.set(chSlug, bestPhase);
}

// Build ordered phase groups (empty phases omitted from the rendered table)
type PhaseGroup = { id: string; title: string; chapters: typeof allChapters };
const phaseGroupMap = new Map<string, PhaseGroup>();
for (const lp of learningPhases) {
  phaseGroupMap.set(lp.id, { id: lp.id, title: lp.title, chapters: [] });
}
for (const ch of allChapters) {
  const pid = canonicalPhaseMap.get(ch.slug);
  if (pid && phaseGroupMap.has(pid)) phaseGroupMap.get(pid)!.chapters.push(ch);
}
const phaseGroups: PhaseGroup[] = learningPhases
  .map(lp => phaseGroupMap.get(lp.id)!)
  .filter(g => g.chapters.length > 0);

// Chapters assigned to no phase (shown collapsed at the bottom of Phase view)
const unassignedChapters = allChapters.filter(ch => !canonicalPhaseMap.has(ch.slug));

// Phase row colours (light + dark)
const phaseMeta: Record<string, { lBg: string; lFg: string; dBg: string; dFg: string }> = {
  awareness:    { lBg: '#fffbeb', lFg: '#b45309', dBg: '#451a03', dFg: '#fcd34d' },
  conceptual:   { lBg: '#eff6ff', lFg: '#1d4ed8', dBg: '#172554', dFg: '#60a5fa' },
  practical:    { lBg: '#f0fdf4', lFg: '#15803d', dBg: '#052e16', dFg: '#4ade80' },
  embedded:     { lBg: '#faf5ff', lFg: '#7e22ce', dBg: '#3b0764', dFg: '#d8b4fe' },
  optimization: { lBg: '#fff7ed', lFg: '#c2410c', dBg: '#431407', dFg: '#fdba74' },
};

let phaseCss = '';
for (const [id, m] of Object.entries(phaseMeta)) {
  phaseCss += `#role-matrix .rm-phase-row[data-phase="${id}"]{background:${m.lBg};}`;
  phaseCss += `#role-matrix .rm-phase-row[data-phase="${id}"] .rm-phase-sticky{background:${m.lBg};color:${m.lFg};}`;
  phaseCss += `.dark #role-matrix .rm-phase-row[data-phase="${id}"]{background:${m.dBg};}`;
  phaseCss += `.dark #role-matrix .rm-phase-row[data-phase="${id}"] .rm-phase-sticky{background:${m.dBg};color:${m.dFg};}`;
}
```

- [ ] **Step 3: Build to verify frontmatter compiles**

```bash
npm run build
```

Expected: build succeeds, no TypeScript errors. If you see "Property 'phases' does not exist" check that `getLearningPhases` is imported from `../lib/roles`, not re-declared locally.

- [ ] **Step 4: Commit**

```bash
git add src/components/RoleMatrix.astro
git commit -m "feat(matrix): compute canonical phase groups at build time"
```

---

### Task 2: Render the Phase view HTML (tbody + CSS + view toggle)

**Files:**
- Modify: `src/components/RoleMatrix.astro` (style block, header, existing tbody, new phase tbody, phaseCss style tag)

**Interfaces:**
- Consumes: `phaseGroups`, `unassignedChapters`, `phaseCss`, `phaseMeta`, `allRoles`, `roleChapterSets`, `groupBoundarySlugs`, `FIRST_COL_W`, `ROLE_COL_W` — all from Task 1 / existing frontmatter
- Produces:
  - CSS classes `.rm-view-seg`, `.rm-view-btn`, `.rm-view-active`
  - HTML: `id="rm-depth-control"` on depth seg, `id="rm-view-seg"` view toggle in header
  - HTML: `id="rm-pillar-body"` on existing tbody
  - HTML: `<tbody id="rm-phase-body">` with phase header rows and chapter rows

- [ ] **Step 1: Add view-toggle CSS to the `<style is:global>` block**

Inside the existing `<style is:global>` block (after the `.rm-depth-btn.rm-depth-active` rule near line 196), add:

```css
  /* View selector — Pillar | Phase */
  #role-matrix .rm-view-seg { display: inline-flex; align-items: center; border: 1px solid var(--rm-border); border-radius: 6px; overflow: hidden; }
  #role-matrix .rm-view-btn {
    background: transparent;
    color: var(--rm-text-muted);
    border: none;
    cursor: pointer;
    font-size: 11px;
    font-weight: 500;
    line-height: 1;
    padding: 4px 9px;
    transition: background 0.12s, color 0.12s;
  }
  #role-matrix .rm-view-btn + .rm-view-btn { border-left: 1px solid var(--rm-border); }
  #role-matrix .rm-view-btn:hover { background: var(--rm-surface); color: var(--rm-text); }
  #role-matrix .rm-view-btn.rm-view-active { background: var(--rm-dot); color: #fff; }
```

- [ ] **Step 2: Inject phaseCss as a second style tag**

After the existing `<style is:global set:html={deptCss}></style>` line (around line 198), add:

```html
<style is:global set:html={phaseCss}></style>
```

- [ ] **Step 3: Add the "Pillar | Phase" view toggle to the header**

In the header `<div class="flex items-center gap-3">` block (around line 209), the current content starts with `<h2>`, then a `<span>`, then the depth seg. Insert the view toggle **between the span and the depth seg**, and add `id="rm-depth-control"` to the depth seg div:

Change:
```html
      <div class="rm-depth-seg" role="group" aria-label="Collapse depth">
        <button type="button" class="rm-depth-btn" data-depth="modules">Modules</button>
        <button type="button" class="rm-depth-btn rm-depth-active" data-depth="chapters">Chapters</button>
      </div>
```

To:
```html
      <div class="rm-view-seg" role="group" aria-label="View">
        <button type="button" class="rm-view-btn rm-view-active" data-view="pillar">Pillar</button>
        <button type="button" class="rm-view-btn" data-view="phase">Phase</button>
      </div>
      <div id="rm-depth-control" class="rm-depth-seg" role="group" aria-label="Collapse depth">
        <button type="button" class="rm-depth-btn" data-depth="modules">Modules</button>
        <button type="button" class="rm-depth-btn rm-depth-active" data-depth="chapters">Chapters</button>
      </div>
```

- [ ] **Step 4: Add `id="rm-pillar-body"` to the existing `<tbody>`**

Find the existing `<tbody>` opening tag (around line 281) and change it to:

```html
      <tbody id="rm-pillar-body">
```

- [ ] **Step 5: Add the phase `<tbody>` after the closing `</tbody>` of the pillar body**

Insert the following immediately after the existing `</tbody>` (around line 347):

```astro
      <tbody id="rm-phase-body" style="display: none;">
        {phaseGroups.map(group => (
          <>
            <tr class="rm-phase-row" data-phase={group.id} style="cursor: pointer;">
              <td
                class="rm-phase-sticky"
                style={`position: sticky; left: 0; z-index: 10; width: ${FIRST_COL_W}px; min-width: ${FIRST_COL_W}px; padding: 5px 10px; border-right: 1px solid var(--rm-border-strong); border-bottom: 1px solid var(--rm-border-strong); font-weight: 700; font-size: 11px; text-transform: uppercase; letter-spacing: 0.06em; white-space: nowrap; user-select: none;`}
              >
                <span class="rm-chevron" style="display: inline-block; font-size: 8px; margin-right: 5px; transition: transform 0.15s; transform: rotate(90deg);">▶</span>
                {group.title}
              </td>
              {allRoles.map(role => (
                <td style={`border-right: ${groupBoundarySlugs.has(role.slug) ? '2px solid var(--rm-border-strong)' : '1px solid var(--rm-border)'}; border-bottom: 1px solid var(--rm-border-strong);`}></td>
              ))}
            </tr>
            {group.chapters.map(ch => (
              <tr class="rm-phase-chapter-row" data-phase={group.id}>
                <td
                  title={ch.title}
                  style={`position: sticky; left: 0; z-index: 10; background: var(--rm-bg); width: ${FIRST_COL_W}px; min-width: ${FIRST_COL_W}px; max-width: ${FIRST_COL_W}px; padding: 3px 10px 3px 36px; border-right: 1px solid var(--rm-border); border-bottom: 1px solid var(--rm-border-light); font-size: 12px; color: var(--rm-text); white-space: nowrap; overflow: hidden; text-overflow: ellipsis;`}
                >
                  {ch.title}
                </td>
                {allRoles.map(role => {
                  const assigned = roleChapterSets.get(role.slug)?.has(ch.slug) ?? false;
                  return (
                    <td style={`border-right: ${groupBoundarySlugs.has(role.slug) ? '2px solid var(--rm-border-strong)' : '1px solid var(--rm-border-light)'}; border-bottom: 1px solid var(--rm-border-light); text-align: center; padding: 3px 0; opacity: ${role.comingSoon ? 0.45 : 1};`}>
                      {assigned && (
                        <div style="width: 8px; height: 8px; border-radius: 50%; background: var(--rm-dot); margin: 0 auto;"></div>
                      )}
                    </td>
                  );
                })}
              </tr>
            ))}
          </>
        ))}
        {unassignedChapters.length > 0 && (
          <>
            <tr class="rm-phase-row" data-phase="unassigned" data-collapsed="" style="cursor: pointer;">
              <td
                class="rm-phase-sticky"
                style={`position: sticky; left: 0; z-index: 10; background: var(--rm-surface); color: var(--rm-text-faint); width: ${FIRST_COL_W}px; min-width: ${FIRST_COL_W}px; padding: 5px 10px; border-right: 1px solid var(--rm-border-strong); border-bottom: 1px solid var(--rm-border-strong); font-weight: 700; font-size: 11px; text-transform: uppercase; letter-spacing: 0.06em; white-space: nowrap; user-select: none;`}
              >
                <span class="rm-chevron" style="display: inline-block; font-size: 8px; margin-right: 5px; transition: transform 0.15s;">▶</span>
                Unassigned
              </td>
              {allRoles.map(role => (
                <td style={`background: var(--rm-surface); border-right: ${groupBoundarySlugs.has(role.slug) ? '2px solid var(--rm-border-strong)' : '1px solid var(--rm-border)'}; border-bottom: 1px solid var(--rm-border-strong);`}></td>
              ))}
            </tr>
            {unassignedChapters.map(ch => (
              <tr class="rm-phase-chapter-row" data-phase="unassigned" style="display: none;">
                <td
                  title={ch.title}
                  style={`position: sticky; left: 0; z-index: 10; background: var(--rm-bg); width: ${FIRST_COL_W}px; min-width: ${FIRST_COL_W}px; max-width: ${FIRST_COL_W}px; padding: 3px 10px 3px 36px; border-right: 1px solid var(--rm-border); border-bottom: 1px solid var(--rm-border-light); font-size: 12px; color: var(--rm-text); white-space: nowrap; overflow: hidden; text-overflow: ellipsis;`}
                >
                  {ch.title}
                </td>
                {allRoles.map(role => {
                  const assigned = roleChapterSets.get(role.slug)?.has(ch.slug) ?? false;
                  return (
                    <td style={`border-right: ${groupBoundarySlugs.has(role.slug) ? '2px solid var(--rm-border-strong)' : '1px solid var(--rm-border-light)'}; border-bottom: 1px solid var(--rm-border-light); text-align: center; padding: 3px 0; opacity: ${role.comingSoon ? 0.45 : 1};`}>
                      {assigned && (
                        <div style="width: 8px; height: 8px; border-radius: 50%; background: var(--rm-dot); margin: 0 auto;"></div>
                      )}
                    </td>
                  );
                })}
              </tr>
            ))}
          </>
        )}
      </tbody>
```

- [ ] **Step 6: Build to verify HTML renders**

```bash
npm run build
```

Expected: build succeeds. The phase tbody exists in the built HTML but is hidden (`display: none`). The Pillar view looks identical to before in the browser. Press `M` to open the matrix and confirm the new "Pillar | Phase" buttons appear in the header.

- [ ] **Step 7: Commit**

```bash
git add src/components/RoleMatrix.astro
git commit -m "feat(matrix): add phase tbody and view toggle UI"
```

---

### Task 3: Add JS for view switching and phase row collapse

**Files:**
- Modify: `src/components/RoleMatrix.astro` (`<script>` block, lines ~365–497)

**Interfaces:**
- Consumes HTML produced by Task 2: `#rm-pillar-body`, `#rm-phase-body`, `#rm-depth-control`, `.rm-view-btn[data-view]`, `.rm-phase-row[data-phase]`, `.rm-phase-chapter-row[data-phase]`, `.rm-chevron`
- Produces: working view toggle; phase section collapse/expand

- [ ] **Step 1: Add view-toggle JS at the top of the `<script>` block**

Inside the `<script>` block, immediately after the line `const depthBtns = overlay.querySelectorAll<HTMLElement>('.rm-depth-btn');` (around line 368), insert:

```typescript
  const viewBtns     = overlay.querySelectorAll<HTMLElement>('.rm-view-btn');
  const pillarBody   = document.getElementById('rm-pillar-body')!;
  const phaseBody    = document.getElementById('rm-phase-body')!;
  const depthControl = document.getElementById('rm-depth-control')!;

  function setView(view: string) {
    const inPhase = view === 'phase';
    pillarBody.style.display  = inPhase ? 'none' : '';
    phaseBody.style.display   = inPhase ? '' : 'none';
    depthControl.style.display = inPhase ? 'none' : '';
    viewBtns.forEach(b => b.classList.toggle('rm-view-active', b.dataset.view === view));
  }

  viewBtns.forEach(btn => {
    btn.addEventListener('click', () => setView(btn.dataset.view ?? 'pillar'));
  });
```

- [ ] **Step 2: Add phase row collapse JS**

At the end of the `<script>` block (after the `closeBtn.addEventListener('click', close);` line, before `</script>`), add:

```typescript
  // Phase row collapse (mirrors theme row collapse pattern)
  overlay.querySelectorAll<HTMLElement>('.rm-phase-row').forEach(row => {
    row.addEventListener('click', () => {
      const phaseId     = row.dataset.phase!;
      const isCollapsed = row.hasAttribute('data-collapsed');
      const chevron     = row.querySelector<HTMLElement>('.rm-chevron');
      const childRows   = overlay.querySelectorAll<HTMLElement>(`.rm-phase-chapter-row[data-phase="${phaseId}"]`);

      if (isCollapsed) {
        row.removeAttribute('data-collapsed');
        childRows.forEach(r => { r.style.display = ''; });
        if (chevron) chevron.style.transform = 'rotate(90deg)';
      } else {
        row.setAttribute('data-collapsed', '');
        childRows.forEach(r => { r.style.display = 'none'; });
        if (chevron) chevron.style.transform = '';
      }
    });
  });
```

- [ ] **Step 3: Build**

```bash
npm run build
```

Expected: build succeeds with no errors.

- [ ] **Step 4: Visual verification**

```bash
npm run dev
```

Open `http://localhost:4321` in the browser, then:

1. Press `M` — matrix opens. Confirm "Pillar | Phase" toggle appears to the left of "Modules | Chapters".
2. Click **Phase** — Pillar body hides, Phase body appears, "Modules | Chapters" control disappears.
3. Confirm 5 coloured phase header rows appear (amber Awareness, blue Conceptual, green Practical, purple Embedded, orange Optimization).
4. Click a phase header row — its chapter rows collapse. Click again — they expand.
5. Toggle dark mode — confirm phase header backgrounds and text switch to dark colours.
6. Click **Pillar** — returns to existing pillar view, "Modules | Chapters" reappears.
7. Confirm the existing collapse behaviour (theme rows, module rows, depth control) is unaffected.

- [ ] **Step 5: Commit**

```bash
git add src/components/RoleMatrix.astro
git commit -m "feat(matrix): add phase view with collapsible phase sections"
```
