// Consolidated module metadata — replaces the duplicated `moduleBackMap`
// (src/pages/[theme]/[module]/[chapter]/index.astro) and `moduleLabels` (src/components/SiteOverlay.astro)
// maps from the original Astro site, which had to be kept in sync by hand (see CLAUDE.md "Key Patterns").
//
// Route segments always equal the module's own `module` slug (from order.json / every chapter's
// `_meta.json`) — this intentionally FIXES a pre-existing bug documented in CLAUDE.md: the original
// `planning-cycles-and-governance` page lived at that URL but filtered chapters by
// `c.module === 'planning-cycles-and-governance'`, while every chapter's actual `module` field is
// `planning-governance`, so the page always rendered zero chapters. Since routing here is a flat table
// (no per-route folder), there's no reason to keep the URL segment and module slug different — the
// route for this module is `process/planning-governance`, matching order.json exactly.
import { getModulesForTheme } from './chapters.js';

const LABELS = {
  // Technology
  'tool-landscape': 'Tool Landscape & Architecture',
  'planning-software': 'Planning Software',
  erp: 'ERP',
  'supporting-systems': 'Supporting Systems',
  'adoption-and-usage-quality': 'Adoption & Usage Quality',
  // Data
  'data-foundations': 'Data Foundations',
  'planning-data-domains': 'Planning Data Domains',
  'planning-parameters-and-assumptions': 'Planning Parameters & Assumptions',
  'performance-and-measurement': 'Performance & Measurement',
  'data-quality-and-governance': 'Data Quality & Governance',
  // Process
  'planning-fundamentals': 'Planning Fundamentals',
  sop: 'S&OP',
  soe: 'S&OE',
  execution: 'Execution',
  'planning-governance': 'Planning Cycles & Governance',
  'advanced-planning': 'Advanced Planning',
  // People
  'roles-and-responsibilities': 'Roles & Responsibilities',
  'decision-making-and-ownership': 'Decision Making & Ownership',
  'collaboration-and-ways-of-working': 'Collaboration & Ways of Working',
  'capabilities-and-skills': 'Capabilities & Skills',
};

/** Returns { href, label, theme } for a module slug, or undefined if unknown. `href` is BASE-free (see CONTRACTS.md §5b) — wrap with url() before rendering. */
export function getModuleMeta(moduleSlug) {
  for (const theme of ['people', 'process', 'data', 'technology']) {
    if (getModulesForTheme(theme).includes(moduleSlug)) {
      return { href: `${theme}/${moduleSlug}`, label: LABELS[moduleSlug] ?? moduleSlug, theme };
    }
  }
  return undefined;
}
