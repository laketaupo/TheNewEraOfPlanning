// Port of src/components/RoleMatrix.astro — role-to-topic responsibility matrix overlay.
// Fixed-chrome shell module (see CONTRACTS.md §4b): mountRoleMatrix(container) is called
// exactly once at boot by js/app.js. Builds its own DOM + a generated <style> block, then
// wires up all interaction (view toggle, depth toggle, collapse/expand, 'M' shortcut).
import { getChapters } from '../lib/chapters.js';
import { getRoles, getLearningPhases } from '../lib/roles.js';
import { escapeHtml } from '../markdown.js';

// Phase row colours (light + dark) — fixed developer-defined palette, not content-derived.
const phaseMeta = {
  awareness:    { lBg: '#fffbeb', lFg: '#b45309', dBg: '#451a03', dFg: '#fcd34d' },
  conceptual:   { lBg: '#eff6ff', lFg: '#1d4ed8', dBg: '#172554', dFg: '#60a5fa' },
  practical:    { lBg: '#f0fdf4', lFg: '#15803d', dBg: '#052e16', dFg: '#4ade80' },
  embedded:     { lBg: '#faf5ff', lFg: '#7e22ce', dBg: '#3b0764', dFg: '#d8b4fe' },
  optimization: { lBg: '#fff7ed', lFg: '#c2410c', dBg: '#431407', dFg: '#fdba74' },
};

const themeMeta = {
  technology: { label: 'Technology', bg: '#eff6ff', color: '#1d4ed8' },
  process:    { label: 'Process',    bg: '#eff6ff', color: '#1d4ed8' },
  data:       { label: 'Data',       bg: '#eff6ff', color: '#1d4ed8' },
  people:     { label: 'People',     bg: '#eff6ff', color: '#1d4ed8' },
};

// TODO: consolidate with module-meta.js (Phase 2 integration step — see CLAUDE.md note on
// keeping SiteOverlay's moduleLabels in sync with moduleBackMap/RoleMatrix's copy elsewhere).
const moduleLabels = {
  // Technology
  'planning-software':                   'Planning Software',
  'erp':                                 'ERP',
  'tool-landscape':                      'Tool Landscape & Architecture',
  'fms':                                 'Farm Management System',
  'mdm':                                 'MDM',
  'adoption-and-usage-quality':          'Adoption & Usage Quality',
  // Data
  'data-foundations':                    'Data Foundations',
  'planning-data-domains':               'Planning Data Domains',
  'planning-parameters-and-assumptions': 'Planning Parameters & Assumptions',
  'performance-and-measurement':         'Performance & Measurement',
  'data-quality-and-governance':         'Data Quality & Governance',
  // Process
  'planning-fundamentals':               'Planning Fundamentals',
  'planning-cycles-and-governance':      'Planning Cycles & Governance',
  'sop':                                 'S&OP',
  'soe':                                 'S&OE',
  'execution':                           'Execution',
  'advanced-planning':                   'Advanced Planning',
  // People
  'roles-and-responsibilities':          'Roles & Responsibilities',
  'decision-making-and-ownership':       'Decision Making & Ownership',
  'collaboration-and-ways-of-working':   'Collaboration & Ways of Working',
  'capabilities-and-skills':             'Capabilities & Skills',
};

// Light/dark tints per department, assigned by order of first appearance.
const deptPalette = [
  { light: { bg: '#eef2ff', fg: '#4338ca' }, dark: { bg: '#1e1b4b', fg: '#a5b4fc' } }, // indigo
  { light: { bg: '#ecfdf5', fg: '#047857' }, dark: { bg: '#022c22', fg: '#6ee7b7' } }, // emerald
  { light: { bg: '#fffbeb', fg: '#b45309' }, dark: { bg: '#451a03', fg: '#fcd34d' } }, // amber
  { light: { bg: '#fff1f2', fg: '#be123c' }, dark: { bg: '#4c0519', fg: '#fda4af' } }, // rose
  { light: { bg: '#f0f9ff', fg: '#0369a1' }, dark: { bg: '#082f49', fg: '#7dd3fc' } }, // sky
  { light: { bg: '#f5f3ff', fg: '#6d28d9' }, dark: { bg: '#2e1065', fg: '#c4b5fd' } }, // violet
  { light: { bg: '#f0fdfa', fg: '#0f766e' }, dark: { bg: '#042f2e', fg: '#5eead4' } }, // teal
  { light: { bg: '#fff7ed', fg: '#c2410c' }, dark: { bg: '#431407', fg: '#fdba74' } }, // orange
  { light: { bg: '#f7fee7', fg: '#4d7c0f' }, dark: { bg: '#1a2e05', fg: '#bef264' } }, // lime
  { light: { bg: '#fdf4ff', fg: '#a21caf' }, dark: { bg: '#4a044e', fg: '#f0abfc' } }, // fuchsia
];

const FIRST_COL_W = 220;
const ROLE_COL_W = 100;
const BAND_H = 26; // height of the department band tier above role names
const ROLE_HEADER_H = 180; // height of the rotated role-name tier (tall enough for long titles)

function buildData() {
  const allChapters = getChapters().filter((c) => !c.hidden);
  const allRoles = getRoles();

  // ── Phase view data ──────────────────────────────────────────────────
  const learningPhases = getLearningPhases();
  const phaseOrder = learningPhases.map((p) => p.id);

  const phaseTally = new Map();
  for (const role of allRoles) {
    if (!role.phases) continue;
    for (const phase of role.phases) {
      for (const chSlug of phase.chapters) {
        if (!phaseTally.has(chSlug)) phaseTally.set(chSlug, new Map());
        const t = phaseTally.get(chSlug);
        t.set(phase.phaseId, (t.get(phase.phaseId) ?? 0) + 1);
      }
    }
  }

  const canonicalPhaseMap = new Map();
  for (const [chSlug, tally] of phaseTally) {
    let bestPhase = '';
    let bestCount = 0;
    for (const phaseId of phaseOrder) {
      const count = tally.get(phaseId) ?? 0;
      if (count > bestCount) { bestCount = count; bestPhase = phaseId; }
    }
    if (bestPhase) canonicalPhaseMap.set(chSlug, bestPhase);
  }

  const phaseGroupMap = new Map();
  learningPhases.forEach((lp, i) => {
    phaseGroupMap.set(lp.id, { id: lp.id, title: lp.title, number: i + 1, chapters: [] });
  });
  for (const ch of allChapters) {
    const pid = canonicalPhaseMap.get(ch.slug);
    if (pid && phaseGroupMap.has(pid)) phaseGroupMap.get(pid).chapters.push(ch);
  }
  const phaseGroups = learningPhases.map((lp) => phaseGroupMap.get(lp.id)).filter((g) => g.chapters.length > 0);
  const unassignedChapters = allChapters.filter((ch) => !canonicalPhaseMap.has(ch.slug));

  // Config-consistency check ported from the original build-time throw: since this now runs
  // at runtime in the browser, a missing palette entry degrades gracefully (row falls back to
  // unstyled) instead of crashing the whole app — log loudly so it still gets noticed.
  const unthemedPhases = phaseOrder.filter((id) => !phaseMeta[id]);
  if (unthemedPhases.length > 0) {
    console.error(`[RoleMatrix] Missing phaseMeta colours for: ${unthemedPhases.join(', ')}. Add entries to phaseMeta.`);
  }

  // Role → chapter slug set
  const roleChapterSets = new Map();
  for (const role of allRoles) {
    const set = new Set();
    role.phases?.forEach((phase) => phase.chapters.forEach((slug) => set.add(slug)));
    roleChapterSets.set(role.slug, set);
  }

  // Theme order derived from the already-sorted getChapters() output (order.json-driven).
  const themeOrder = [];
  for (const ch of allChapters) {
    const p = ch.theme ?? 'technology';
    if (!themeOrder.includes(p)) themeOrder.push(p);
  }

  const themes = [];
  for (const themeKey of themeOrder) {
    const themeChapters = allChapters.filter((c) => (c.theme ?? 'technology') === themeKey);
    if (!themeChapters.length) continue;

    const seenMods = new Set();
    const modsOrdered = [];
    for (const ch of themeChapters) {
      const m = ch.module ?? 'planning-software';
      if (!seenMods.has(m)) { seenMods.add(m); modsOrdered.push(m); }
    }

    const meta = themeMeta[themeKey] ?? { label: themeKey, bg: '#f9fafb', color: '#374151' };
    themes.push({
      key: themeKey,
      ...meta,
      modules: modsOrdered.map((mod) => ({
        key: mod,
        label: moduleLabels[mod] ?? mod,
        chapters: themeChapters.filter((c) => (c.module ?? 'planning-software') === mod),
      })),
    });
  }

  // Department bands — roles are already sorted by `order`, so each department forms a
  // contiguous block of columns. Group consecutive roles by department.
  const deptGroups = [];
  for (const role of allRoles) {
    const dep = role.department ?? 'Other';
    const last = deptGroups[deptGroups.length - 1];
    if (last && last.label === dep) last.roles.push(role);
    else deptGroups.push({ label: dep, roles: [role] });
  }

  const deptColorIdx = new Map();
  function colorIdxFor(dep) {
    if (!deptColorIdx.has(dep)) deptColorIdx.set(dep, deptColorIdx.size % deptPalette.length);
    return deptColorIdx.get(dep);
  }
  deptGroups.forEach((g) => colorIdxFor(g.label)); // ensure deterministic assignment order

  const groupBoundarySlugs = new Set(deptGroups.map((g) => g.roles[g.roles.length - 1].slug));

  return {
    allChapters, allRoles, phaseGroups, unassignedChapters, roleChapterSets, themes,
    deptGroups, colorIdxFor, groupBoundarySlugs,
  };
}

function buildGeneratedCss(deptGroups, colorIdxFor) {
  let deptCss = '';
  deptPalette.forEach((p, i) => {
    deptCss += `#role-matrix .rm-dept-band[data-dept-idx="${i}"]{background:${p.light.bg};color:${p.light.fg};}`;
    deptCss += `.dark #role-matrix .rm-dept-band[data-dept-idx="${i}"]{background:${p.dark.bg};color:${p.dark.fg};}`;
  });

  let phaseCss = '';
  for (const [id, m] of Object.entries(phaseMeta)) {
    phaseCss += `#role-matrix .rm-phase-row[data-phase="${id}"]{background:${m.lBg};}`;
    phaseCss += `#role-matrix .rm-phase-row[data-phase="${id}"] .rm-phase-sticky{background:${m.lBg};color:${m.lFg};}`;
    phaseCss += `.dark #role-matrix .rm-phase-row[data-phase="${id}"]{background:${m.dBg};}`;
    phaseCss += `.dark #role-matrix .rm-phase-row[data-phase="${id}"] .rm-phase-sticky{background:${m.dBg};color:${m.dFg};}`;
  }

  return deptCss + phaseCss;
}

const staticCss = `
  #role-matrix {
    --rm-bg:           white;
    --rm-surface:      #f9fafb;
    --rm-border:       #e5e7eb;
    --rm-border-strong:#d1d5db;
    --rm-border-light: #f3f4f6;
    --rm-text:         #374151;
    --rm-text-muted:   #6b7280;
    --rm-text-faint:   #9ca3af;
    --rm-dot:          #6366f1;
  }
  .dark #role-matrix {
    --rm-bg:           #222222;
    --rm-surface:      #1e293b;
    --rm-border:       #334155;
    --rm-border-strong:#475569;
    --rm-border-light: #1e293b;
    --rm-text:         #f1f5f9;
    --rm-text-muted:   #94a3b8;
    --rm-text-faint:   #64748b;
    --rm-dot:          #818cf8;
  }

  #role-matrix .rm-theme-row[data-theme="technology"] { background: #f0fdf4; }
  #role-matrix .rm-theme-row[data-theme="process"]    { background: #eff6ff; }
  #role-matrix .rm-theme-row[data-theme="data"]       { background: #fffbeb; }
  #role-matrix .rm-theme-row[data-theme="people"]     { background: #fff1f2; }

  #role-matrix .rm-theme-row[data-theme="technology"] .rm-theme-sticky { background: #f0fdf4; color: #15803d; }
  #role-matrix .rm-theme-row[data-theme="process"]    .rm-theme-sticky { background: #eff6ff; color: #1d4ed8; }
  #role-matrix .rm-theme-row[data-theme="data"]       .rm-theme-sticky { background: #fffbeb; color: #b45309; }
  #role-matrix .rm-theme-row[data-theme="people"]     .rm-theme-sticky { background: #fff1f2; color: #be123c; }

  .dark #role-matrix .rm-theme-row[data-theme="technology"] { background: #052e16; }
  .dark #role-matrix .rm-theme-row[data-theme="process"]    { background: #172554; }
  .dark #role-matrix .rm-theme-row[data-theme="data"]       { background: #431407; }
  .dark #role-matrix .rm-theme-row[data-theme="people"]     { background: #4c0519; }

  .dark #role-matrix .rm-theme-row[data-theme="technology"] .rm-theme-sticky { background: #052e16; color: #4ade80; }
  .dark #role-matrix .rm-theme-row[data-theme="process"]    .rm-theme-sticky { background: #172554; color: #60a5fa; }
  .dark #role-matrix .rm-theme-row[data-theme="data"]       .rm-theme-sticky { background: #431407; color: #fbbf24; }
  .dark #role-matrix .rm-theme-row[data-theme="people"]     .rm-theme-sticky { background: #4c0519; color: #fb7185; }

  #role-matrix .rm-module-dot { display: none; }
  #role-matrix .rm-module-row[data-collapsed] .rm-module-dot { display: block; }

  #role-matrix .rm-depth-seg { display: inline-flex; align-items: center; border: 1px solid var(--rm-border); border-radius: 6px; overflow: hidden; }
  #role-matrix .rm-depth-btn {
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
  #role-matrix .rm-depth-btn + .rm-depth-btn { border-left: 1px solid var(--rm-border); }
  #role-matrix .rm-depth-btn:hover { background: var(--rm-surface); color: var(--rm-text); }
  #role-matrix .rm-depth-btn.rm-depth-active { background: var(--rm-dot); color: #fff; }

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
`;

function dotCell(assigned, comingSoon, borderRight) {
  return `<td style="border-right: ${borderRight}; border-bottom: 1px solid var(--rm-border-light); text-align: center; padding: 3px 0; opacity: ${comingSoon ? 0.45 : 1};">${
    assigned ? '<div style="width: 8px; height: 8px; border-radius: 50%; background: var(--rm-dot); margin: 0 auto;"></div>' : ''
  }</td>`;
}

function renderMarkup(data) {
  const { allRoles, phaseGroups, unassignedChapters, roleChapterSets, themes, deptGroups, colorIdxFor, groupBoundarySlugs } = data;

  const generatedCss = buildGeneratedCss(deptGroups, colorIdxFor);

  const deptBandCells = deptGroups
    .map(
      (g) => `
      <th class="rm-dept-band" data-dept-idx="${colorIdxFor(g.label)}" colspan="${g.roles.length}" title="${escapeHtml(g.label)}"
        style="position: sticky; top: 0; z-index: 30; height: ${BAND_H}px; padding: 0 8px; text-align: center; vertical-align: middle; font-size: 10px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.05em; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; border-right: 2px solid var(--rm-border-strong); border-bottom: 1px solid var(--rm-border);">
        ${escapeHtml(g.label)}
      </th>`,
    )
    .join('');

  const roleHeaderCells = allRoles
    .map(
      (role) => `
      <th title="${escapeHtml(role.title)}"
        style="position: sticky; top: ${BAND_H}px; z-index: 20; background: var(--rm-bg); width: ${ROLE_COL_W}px; min-width: ${ROLE_COL_W}px; height: ${ROLE_HEADER_H}px; padding: 0; vertical-align: bottom; border-right: ${groupBoundarySlugs.has(role.slug) ? '2px solid var(--rm-border-strong)' : '1px solid var(--rm-border-light)'}; border-bottom: 2px solid var(--rm-border); opacity: ${role.comingSoon ? 0.45 : 1};">
        <div style="position: relative; height: ${ROLE_HEADER_H}px; width: ${ROLE_COL_W}px; overflow: visible;">
          <span style="position: absolute; bottom: 8px; left: ${ROLE_COL_W / 2}px; white-space: nowrap; font-size: 11px; font-weight: 500; color: var(--rm-text); display: block; transform-origin: left bottom; transform: rotate(-70deg);">
            ${escapeHtml(role.title)}
          </span>
        </div>
      </th>`,
    )
    .join('');

  const pillarBody = themes
    .map(
      (theme) => `
      <tr class="rm-theme-row" data-theme="${escapeHtml(theme.key)}" style="cursor: pointer;">
        <td class="rm-theme-sticky"
          style="position: sticky; left: 0; z-index: 10; width: ${FIRST_COL_W}px; min-width: ${FIRST_COL_W}px; padding: 5px 10px; border-right: 1px solid var(--rm-border-strong); border-bottom: 1px solid var(--rm-border-strong); font-weight: 700; font-size: 11px; text-transform: uppercase; letter-spacing: 0.06em; white-space: nowrap; user-select: none;">
          <span class="rm-chevron" style="display: inline-block; font-size: 8px; margin-right: 5px; transition: transform 0.15s; transform: rotate(90deg);">&#9654;</span>
          ${escapeHtml(theme.label)}
        </td>
        ${allRoles
          .map((role) => `<td style="border-right: ${groupBoundarySlugs.has(role.slug) ? '2px solid var(--rm-border-strong)' : '1px solid var(--rm-border)'}; border-bottom: 1px solid var(--rm-border-strong);"></td>`)
          .join('')}
      </tr>
      ${theme.modules
        .map(
          (mod) => `
        <tr class="rm-module-row" data-theme="${escapeHtml(theme.key)}" data-module="${escapeHtml(mod.key)}" style="background: var(--rm-surface); cursor: pointer;">
          <td style="position: sticky; left: 0; z-index: 10; background: var(--rm-surface); width: ${FIRST_COL_W}px; min-width: ${FIRST_COL_W}px; padding: 4px 10px 4px 24px; border-right: 1px solid var(--rm-border-strong); border-bottom: 1px solid var(--rm-border); font-weight: 600; font-size: 11px; color: var(--rm-text-muted); white-space: nowrap; user-select: none;">
            <span class="rm-chevron" style="display: inline-block; font-size: 8px; margin-right: 5px; transition: transform 0.15s; transform: rotate(90deg);">&#9654;</span>
            ${escapeHtml(mod.label)}
          </td>
          ${allRoles
            .map((role) => {
              const moduleAssigned = mod.chapters.some((ch) => roleChapterSets.get(role.slug)?.has(ch.slug));
              return `<td style="background: var(--rm-surface); border-right: ${groupBoundarySlugs.has(role.slug) ? '2px solid var(--rm-border-strong)' : '1px solid var(--rm-border-light)'}; border-bottom: 1px solid var(--rm-border); text-align: center; padding: 3px 0; opacity: ${role.comingSoon ? 0.45 : 1};">${
                moduleAssigned ? '<div class="rm-module-dot" style="width: 8px; height: 8px; border-radius: 50%; background: var(--rm-dot); margin: 0 auto;"></div>' : ''
              }</td>`;
            })
            .join('')}
        </tr>
        ${mod.chapters
          .map(
            (ch) => `
          <tr class="rm-chapter-row" data-theme="${escapeHtml(theme.key)}" data-module="${escapeHtml(mod.key)}">
            <td title="${escapeHtml(ch.title)}"
              style="position: sticky; left: 0; z-index: 10; background: var(--rm-bg); width: ${FIRST_COL_W}px; min-width: ${FIRST_COL_W}px; max-width: ${FIRST_COL_W}px; padding: 3px 10px 3px 36px; border-right: 1px solid var(--rm-border); border-bottom: 1px solid var(--rm-border-light); font-size: 12px; color: var(--rm-text); white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">
              ${escapeHtml(ch.title)}
            </td>
            ${allRoles
              .map((role) => {
                const assigned = roleChapterSets.get(role.slug)?.has(ch.slug) ?? false;
                const borderRight = groupBoundarySlugs.has(role.slug) ? '2px solid var(--rm-border-strong)' : '1px solid var(--rm-border-light)';
                return dotCell(assigned, role.comingSoon, borderRight);
              })
              .join('')}
          </tr>`,
          )
          .join('')}`,
        )
        .join('')}`,
    )
    .join('');

  const phaseBody =
    phaseGroups
      .map(
        (group) => `
      <tr class="rm-phase-row" data-phase="${escapeHtml(group.id)}" style="cursor: pointer;">
        <td class="rm-phase-sticky"
          style="position: sticky; left: 0; z-index: 10; width: ${FIRST_COL_W}px; min-width: ${FIRST_COL_W}px; padding: 5px 10px; border-right: 1px solid var(--rm-border-strong); border-bottom: 1px solid var(--rm-border-strong); font-weight: 700; font-size: 11px; text-transform: uppercase; letter-spacing: 0.06em; white-space: nowrap; user-select: none;">
          <span class="rm-chevron" style="display: inline-block; font-size: 8px; margin-right: 5px; transition: transform 0.15s; transform: rotate(90deg);">&#9654;</span>
          <span style="opacity: 0.55; font-weight: 600; margin-right: 5px;">Phase ${group.number}</span>
          ${escapeHtml(group.title)}
        </td>
        ${allRoles
          .map((role) => `<td style="border-right: ${groupBoundarySlugs.has(role.slug) ? '2px solid var(--rm-border-strong)' : '1px solid var(--rm-border)'}; border-bottom: 1px solid var(--rm-border-strong);"></td>`)
          .join('')}
      </tr>
      ${group.chapters
        .map(
          (ch) => `
        <tr class="rm-phase-chapter-row" data-phase="${escapeHtml(group.id)}">
          <td title="${escapeHtml(ch.title)}"
            style="position: sticky; left: 0; z-index: 10; background: var(--rm-bg); width: ${FIRST_COL_W}px; min-width: ${FIRST_COL_W}px; max-width: ${FIRST_COL_W}px; padding: 3px 10px 3px 36px; border-right: 1px solid var(--rm-border); border-bottom: 1px solid var(--rm-border-light); font-size: 12px; color: var(--rm-text); white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">
            ${escapeHtml(ch.title)}
          </td>
          ${allRoles
            .map((role) => {
              const assigned = roleChapterSets.get(role.slug)?.has(ch.slug) ?? false;
              const borderRight = groupBoundarySlugs.has(role.slug) ? '2px solid var(--rm-border-strong)' : '1px solid var(--rm-border-light)';
              return dotCell(assigned, role.comingSoon, borderRight);
            })
            .join('')}
        </tr>`,
        )
        .join('')}`,
      )
      .join('') +
    (unassignedChapters.length > 0
      ? `
      <tr class="rm-phase-row" data-phase="unassigned" data-collapsed="" style="cursor: pointer;">
        <td class="rm-phase-sticky"
          style="position: sticky; left: 0; z-index: 10; background: var(--rm-surface); color: var(--rm-text-faint); width: ${FIRST_COL_W}px; min-width: ${FIRST_COL_W}px; padding: 5px 10px; border-right: 1px solid var(--rm-border-strong); border-bottom: 1px solid var(--rm-border-strong); font-weight: 700; font-size: 11px; text-transform: uppercase; letter-spacing: 0.06em; white-space: nowrap; user-select: none;">
          <span class="rm-chevron" style="display: inline-block; font-size: 8px; margin-right: 5px; transition: transform 0.15s;">&#9654;</span>
          Unassigned
        </td>
        ${allRoles
          .map((role) => `<td style="background: var(--rm-surface); border-right: ${groupBoundarySlugs.has(role.slug) ? '2px solid var(--rm-border-strong)' : '1px solid var(--rm-border)'}; border-bottom: 1px solid var(--rm-border-strong);"></td>`)
          .join('')}
      </tr>
      ${unassignedChapters
        .map(
          (ch) => `
        <tr class="rm-phase-chapter-row" data-phase="unassigned" style="display: none;">
          <td title="${escapeHtml(ch.title)}"
            style="position: sticky; left: 0; z-index: 10; background: var(--rm-bg); width: ${FIRST_COL_W}px; min-width: ${FIRST_COL_W}px; max-width: ${FIRST_COL_W}px; padding: 3px 10px 3px 36px; border-right: 1px solid var(--rm-border); border-bottom: 1px solid var(--rm-border-light); font-size: 12px; color: var(--rm-text); white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">
            ${escapeHtml(ch.title)}
          </td>
          ${allRoles
            .map((role) => {
              const assigned = roleChapterSets.get(role.slug)?.has(ch.slug) ?? false;
              const borderRight = groupBoundarySlugs.has(role.slug) ? '2px solid var(--rm-border-strong)' : '1px solid var(--rm-border-light)';
              return dotCell(assigned, role.comingSoon, borderRight);
            })
            .join('')}
        </tr>`,
        )
        .join('')}`
      : '');

  const activeCount = allRoles.filter((r) => !r.comingSoon).length;
  const comingSoonCount = allRoles.filter((r) => r.comingSoon).length;

  return `
    <style>${staticCss}${generatedCss}</style>
    <div id="role-matrix" class="fixed inset-0 z-[9997] hidden flex-col bg-white dark:bg-neutral-900" role="dialog" aria-modal="true" aria-label="Role chapter matrix">
      <div class="flex items-center justify-between px-5 py-3 border-b border-gray-200 dark:border-neutral-700 shrink-0 bg-white dark:bg-neutral-900">
        <div class="flex items-center gap-3">
          <h2 class="text-sm font-semibold text-gray-900 dark:text-white">Role &times; Chapter Matrix</h2>
          <span class="text-xs text-gray-400 dark:text-neutral-500 hidden sm:inline">
            ${activeCount} active &nbsp;·&nbsp; ${comingSoonCount} coming soon
          </span>
          <div class="rm-view-seg" role="group" aria-label="View">
            <button type="button" class="rm-view-btn rm-view-active" data-view="pillar">Pillar</button>
            <button type="button" class="rm-view-btn" data-view="phase">Phase</button>
          </div>
          <div id="rm-depth-control" class="rm-depth-seg" role="group" aria-label="Collapse depth">
            <button type="button" class="rm-depth-btn" data-depth="modules">Modules</button>
            <button type="button" class="rm-depth-btn rm-depth-active" data-depth="chapters">Chapters</button>
          </div>
        </div>
        <div class="flex items-center gap-3">
          <span class="text-xs text-gray-400 dark:text-neutral-500 hidden sm:inline">
            <kbd class="font-mono bg-gray-100 dark:bg-neutral-800 px-1 py-0.5 rounded text-gray-500 dark:text-neutral-400">M</kbd> toggle
            &nbsp;·&nbsp;
            <kbd class="font-mono bg-gray-100 dark:bg-neutral-800 px-1 py-0.5 rounded text-gray-500 dark:text-neutral-400">Esc</kbd> close
          </span>
          <button id="role-matrix-close" class="text-gray-400 hover:text-gray-700 dark:hover:text-neutral-300 transition-colors p-1 rounded" aria-label="Close">
            <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
            </svg>
          </button>
        </div>
      </div>

      <div class="flex-1 overflow-auto" id="role-matrix-scroll">
        <table style="border-collapse: separate; border-spacing: 0; min-width: ${FIRST_COL_W + allRoles.length * ROLE_COL_W}px;">
          <thead>
            <tr>
              <th rowspan="2" style="position: sticky; left: 0; top: 0; z-index: 40; background: var(--rm-bg); width: ${FIRST_COL_W}px; min-width: ${FIRST_COL_W}px; height: ${ROLE_HEADER_H + BAND_H}px; padding: 0; vertical-align: bottom; border-right: 1px solid var(--rm-border); border-bottom: 2px solid var(--rm-border);">
                <div style="padding: 6px 10px; font-size: 10px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.06em; color: var(--rm-text-faint);">
                  Chapter
                </div>
              </th>
              ${deptBandCells}
            </tr>
            <tr>
              ${roleHeaderCells}
            </tr>
          </thead>
          <tbody id="rm-pillar-body">
            ${pillarBody}
          </tbody>
          <tbody id="rm-phase-body" style="display: none;">
            ${phaseBody}
          </tbody>
        </table>
      </div>

      <div class="border-t border-gray-200 dark:border-neutral-700 px-5 py-2 shrink-0 flex items-center gap-5 bg-white dark:bg-neutral-900">
        <div class="flex items-center gap-2 text-xs text-gray-400 dark:text-neutral-500">
          <div style="width: 8px; height: 8px; border-radius: 50%; background: var(--rm-dot); display: inline-block;"></div>
          Chapter assigned to role
        </div>
        <span class="text-xs text-gray-300 dark:text-neutral-600">|</span>
        <span class="text-xs text-gray-400 dark:text-neutral-500">Coloured top bands group roles by department</span>
        <span class="text-xs text-gray-300 dark:text-neutral-600">|</span>
        <span class="text-xs text-gray-400 dark:text-neutral-500">Dimmed columns = coming soon roles</span>
        <span class="text-xs text-gray-300 dark:text-neutral-600">|</span>
        <span id="rm-footer-pillar-hint" class="text-xs text-gray-400 dark:text-neutral-500">Click pillar or module labels to collapse</span>
        <span id="rm-footer-phase-hint" class="text-xs text-gray-400 dark:text-neutral-500" style="display: none;">Click phase labels to collapse</span>
      </div>
    </div>`;
}

function wireBehavior() {
  const overlay = document.getElementById('role-matrix');
  const closeBtn = document.getElementById('role-matrix-close');
  const depthBtns = overlay.querySelectorAll('.rm-depth-btn');

  const viewBtns = overlay.querySelectorAll('.rm-view-btn');
  const pillarBody = document.getElementById('rm-pillar-body');
  const phaseBody = document.getElementById('rm-phase-body');
  const depthControl = document.getElementById('rm-depth-control');
  const footerPillarHint = document.getElementById('rm-footer-pillar-hint');
  const footerPhaseHint = document.getElementById('rm-footer-phase-hint');

  function setView(view) {
    const inPhase = view === 'phase';
    pillarBody.style.display = inPhase ? 'none' : '';
    phaseBody.style.display = inPhase ? '' : 'none';
    depthControl.style.display = inPhase ? 'none' : '';
    footerPillarHint.style.display = inPhase ? 'none' : '';
    footerPhaseHint.style.display = inPhase ? '' : 'none';
    viewBtns.forEach((b) => b.classList.toggle('rm-view-active', b.dataset.view === view));
  }

  viewBtns.forEach((btn) => {
    btn.addEventListener('click', () => setView(btn.dataset.view ?? 'pillar'));
  });

  function setRowCollapsed(row, collapsed) {
    const chevron = row.querySelector('.rm-chevron');
    if (collapsed) {
      row.setAttribute('data-collapsed', '');
      if (chevron) chevron.style.transform = '';
    } else {
      row.removeAttribute('data-collapsed');
      if (chevron) chevron.style.transform = 'rotate(90deg)';
    }
  }

  function setDepth(level) {
    const themeRows = overlay.querySelectorAll('.rm-theme-row');
    const moduleRows = overlay.querySelectorAll('.rm-module-row');
    const chapterRows = overlay.querySelectorAll('.rm-chapter-row');

    if (level === 'modules') {
      themeRows.forEach((r) => setRowCollapsed(r, false));
      moduleRows.forEach((r) => { setRowCollapsed(r, true); r.style.display = ''; });
      chapterRows.forEach((r) => { r.style.display = 'none'; });
    } else {
      themeRows.forEach((r) => setRowCollapsed(r, false));
      moduleRows.forEach((r) => { setRowCollapsed(r, false); r.style.display = ''; });
      chapterRows.forEach((r) => { r.style.display = ''; });
    }

    depthBtns.forEach((b) => b.classList.toggle('rm-depth-active', b.dataset.depth === level));
  }

  function clearDepth() {
    depthBtns.forEach((b) => b.classList.remove('rm-depth-active'));
  }

  depthBtns.forEach((btn) => {
    btn.addEventListener('click', () => setDepth(btn.dataset.depth ?? 'chapters'));
  });

  function open() {
    overlay.classList.remove('hidden');
    overlay.classList.add('flex');
    document.body.style.overflow = 'hidden';
  }

  function close() {
    overlay.classList.add('hidden');
    overlay.classList.remove('flex');
    document.body.style.overflow = '';
  }

  function toggle() {
    overlay.classList.contains('hidden') ? open() : close();
  }

  overlay.querySelectorAll('.rm-theme-row').forEach((row) => {
    row.addEventListener('click', () => {
      clearDepth();
      const theme = row.dataset.theme;
      const isCollapsed = row.hasAttribute('data-collapsed');
      const chevron = row.querySelector('.rm-chevron');

      if (isCollapsed) {
        row.removeAttribute('data-collapsed');
        overlay.querySelectorAll('.rm-module-row').forEach((r) => {
          if (r.dataset.theme === theme) r.style.display = '';
        });
        overlay.querySelectorAll('.rm-chapter-row').forEach((r) => {
          if (r.dataset.theme === theme) {
            const modRow = overlay.querySelector(`.rm-module-row[data-theme="${theme}"][data-module="${r.dataset.module}"]`);
            if (!modRow?.hasAttribute('data-collapsed')) r.style.display = '';
          }
        });
        if (chevron) chevron.style.transform = 'rotate(90deg)';
      } else {
        row.setAttribute('data-collapsed', '');
        overlay.querySelectorAll('.rm-module-row, .rm-chapter-row').forEach((r) => {
          if (r.dataset.theme === theme) r.style.display = 'none';
        });
        if (chevron) chevron.style.transform = '';
      }
    });
  });

  overlay.querySelectorAll('.rm-module-row').forEach((row) => {
    row.addEventListener('click', (e) => {
      e.stopPropagation();
      clearDepth();
      const theme = row.dataset.theme;
      const mod = row.dataset.module;
      const isCollapsed = row.hasAttribute('data-collapsed');
      const chevron = row.querySelector('.rm-chevron');

      if (isCollapsed) {
        row.removeAttribute('data-collapsed');
        overlay.querySelectorAll('.rm-chapter-row').forEach((r) => {
          if (r.dataset.theme === theme && r.dataset.module === mod) r.style.display = '';
        });
        if (chevron) chevron.style.transform = 'rotate(90deg)';
      } else {
        row.setAttribute('data-collapsed', '');
        overlay.querySelectorAll('.rm-chapter-row').forEach((r) => {
          if (r.dataset.theme === theme && r.dataset.module === mod) r.style.display = 'none';
        });
        if (chevron) chevron.style.transform = '';
      }
    });
  });

  document.addEventListener('keydown', (e) => {
    const tag = e.target.tagName;
    const inInput = tag === 'INPUT' || tag === 'TEXTAREA' || e.target.isContentEditable;
    if (e.key === 'Escape') { close(); return; }
    if ((e.key === 'm' || e.key === 'M') && !inInput && !e.metaKey && !e.ctrlKey) {
      e.preventDefault();
      toggle();
    }
  });

  closeBtn.addEventListener('click', close);

  overlay.querySelectorAll('.rm-phase-row').forEach((row) => {
    row.addEventListener('click', () => {
      const phaseId = row.dataset.phase;
      const isCollapsed = row.hasAttribute('data-collapsed');
      const chevron = row.querySelector('.rm-chevron');
      const childRows = overlay.querySelectorAll(`.rm-phase-chapter-row[data-phase="${CSS.escape(phaseId)}"]`);

      if (isCollapsed) {
        row.removeAttribute('data-collapsed');
        childRows.forEach((r) => { r.style.display = ''; });
        if (chevron) chevron.style.transform = 'rotate(90deg)';
      } else {
        row.setAttribute('data-collapsed', '');
        childRows.forEach((r) => { r.style.display = 'none'; });
        if (chevron) chevron.style.transform = '';
      }
    });
  });

  // Mirrors window.openIntro()/window.openSearch() pattern for programmatic access.
  window.openRoleMatrix = open;
  window.closeRoleMatrix = close;
  window.toggleRoleMatrix = toggle;
}

export function mountRoleMatrix(container) {
  const data = buildData();
  container.insertAdjacentHTML('beforeend', renderMarkup(data));
  wireBehavior();
}
