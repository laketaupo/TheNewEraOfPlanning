// Generic port of src/pages/{technology,people,process,data}/index.astro for the build-free SPA.
// Route: /:theme — all 4 original pages shared identical structure/CSS (just different card sets
// and variant class names, all rendered with identical blue styling per the "unify pillar colors to
// blue" commit), so this is one data-driven renderer instead of 4 near-duplicate files.
import { url } from '../base-url.js';
import { escapeHtml } from '../markdown.js';
import { getChapters } from '../lib/chapters.js';
import { render as renderNotFound } from './not-found.js';

const PILLARS = {
  technology: {
    title: 'Technology',
    heroDesc: 'Understand the systems that power modern supply chain planning — the Planning software model, ERP data flows, master data management, field systems, and how they all connect.',
    modules: [
      { slug: 'tool-landscape', track: 'track-arch', title: 'Tool Landscape', desc: 'An overview of the technology ecosystem — how planning software, ERP, MDM, and FMS fit together and interact.', icon: 'M8 9l4-4 4 4m0 6l-4 4-4-4' },
      { slug: 'planning-software', track: 'track-how-platform', title: 'Planning Software', desc: 'From building blocks to live scenario simulation — a guided tour of the Planning software.', icon: 'M20 7l-8-4-8 4m16 0v10l-8 4M4 7v10l8 4' },
      { slug: 'erp', track: 'track-bc', title: 'ERP', desc: 'The system that executes the plan — how to navigate it and how it connects to Planning software.', icon: 'M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4' },
      { slug: 'supporting-systems', track: 'track-fms', title: 'Supporting Systems', desc: 'FMS and MDM — the field management and master data systems that supply the planning model with field signals and item master data.', icon: 'M4 7v10c0 1.1.9 2 2 2h12a2 2 0 002-2V7M4 7c0-1.1.9-2 2-2h12a2 2 0 012 2M4 7h16M8 11h8M8 15h5' },
    ],
  },
  people: {
    title: 'People',
    heroDesc: 'Understand the roles, responsibilities, and governance that make supply chain planning work — and how to land a lasting transformation.',
    modules: [
      { slug: 'roles-and-responsibilities', track: 'track-org-roles', title: 'Roles & Responsibilities', desc: 'Every planning role explained — what they own, what they do day-to-day, and how they interact across S&OP and S&OE.', icon: 'M17 20h5v-2a4 4 0 00-5-3.87M9 20H4v-2a4 4 0 015-3.87m6-4.13a4 4 0 10-8 0 4 4 0 008 0zm6 0a3 3 0 11-6 0 3 3 0 016 0z', alwaysLive: true },
      { slug: 'decision-making-and-ownership', track: 'track-org-roles', title: 'Decision Making & Ownership', desc: 'Who owns planning decisions, how they are made, and how conflicts and exceptions are escalated.', icon: 'M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z' },
      { slug: 'collaboration-and-ways-of-working', track: 'track-org-roles', title: 'Collaboration & Ways of Working', desc: 'How planning teams collaborate, run effective meetings, and align stakeholders across functions.', icon: 'M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z' },
      { slug: 'capabilities-and-skills', track: 'track-org-roles', title: 'Capabilities & Skills', desc: 'The planning capabilities, data literacy, and decision-making skills needed at each level of the organisation.', icon: 'M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z' },
    ],
  },
  process: {
    title: 'Process',
    heroDesc: 'Master the planning operating model — from the monthly S&OP cycle and weekly S&OE through daily execution, underpinned by governance policies and the scenario tools that handle uncertainty.',
    modules: [
      { slug: 'planning-fundamentals', track: 'track-process', title: 'Planning Fundamentals', desc: 'The end-to-end planning flow, horizons, and integrated concept — the foundation before diving into cycles.', icon: 'M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10' },
      // Route/module slug intentionally 'planning-governance' (not 'planning-cycles-and-governance') — see js/lib/module-meta.js header comment: this fixes a pre-existing bug where the original page filtered by the wrong module slug and always rendered zero chapters.
      { slug: 'planning-governance', track: 'track-process', title: 'Planning Cycles & Governance', desc: 'S&OP, S&OE, cadences, meeting structure, and the governance that keeps decisions on track.', icon: 'M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15' },
      { slug: 'sop', track: 'track-process', title: 'S&OP', desc: 'Running the monthly Sales & Operations Planning cycle — demand, supply, inventory, and the executive review.', icon: 'M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z' },
      { slug: 'soe', track: 'track-process', title: 'S&OE', desc: 'Running the weekly S&OE cycle — near-term monitoring, exception management, and plan adjustments.', icon: 'M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4' },
      { slug: 'execution', track: 'track-process', title: 'Execution', desc: 'Order management, lot selection, and the daily discipline that turns the plan into action.', icon: 'M13 10V3L4 14h7v7l9-11h-7z' },
      { slug: 'advanced-planning', track: 'track-process', title: 'Advanced Planning', desc: 'Scenario planning, exception management, and constraint management for complex planning situations.', icon: 'M9 3h6m-6 0v7l-4 9a1 1 0 001 1h12a1 1 0 001-1l-4-9V3' },
    ],
  },
  data: {
    title: 'Data',
    heroDesc: 'Understand how data quality and structure determine the quality of every plan your organisation produces.',
    modules: [
      { slug: 'data-foundations', track: 'track-fundamentals', title: 'Data Foundations', desc: 'Types, sources, and structure — the building blocks every planner needs to understand before working with planning data.', icon: 'M3 5v14c0 1.657 4.03 3 9 3s9-1.343 9-3V5M3 12c0 1.657 4.03 3 9 3s9-1.343 9-3', ellipse: true },
      { slug: 'planning-data-domains', track: 'track-planning', title: 'Planning Data Domains', desc: 'Demand, supply, inventory, and capacity — the data and signals behind each planning domain, from static master data to real-time indicators.', icon: 'M4 7v10c0 1.1.9 2 2 2h12a2 2 0 002-2V7M4 7c0-1.1.9-2 2-2h12a2 2 0 012 2M4 7h16M8 11h8M8 15h5' },
      { slug: 'planning-parameters-and-assumptions', track: 'track-governance', title: 'Planning Parameters & Assumptions', desc: 'Safety stock, lead times, and the key assumptions that shape how the planning engine calculates supply and demand.', icon: 'M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4' },
      { slug: 'performance-and-measurement', track: 'track-planning', title: 'Performance & Measurement', desc: 'KPIs, forecast accuracy, and the data-backed metrics that tell you whether your planning is working.', icon: 'M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z' },
      { slug: 'data-quality-and-governance', track: 'track-governance', title: 'Data Quality & Governance', desc: 'Ownership, definitions, and the governance structures that keep planning data reliable across a multi-system landscape.', icon: 'M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z' },
    ],
  },
};

export async function render(params, query) {
  const pillar = PILLARS[params.theme];
  if (!pillar) return renderNotFound(params, query);

  const chapters = getChapters(params.theme).filter((c) => !c.hidden);

  const cardsHtml = pillar.modules
    .map((m) => {
      const count = chapters.filter((c) => c.module === m.slug && !c.comingSoon).length;
      const iconSvg = m.ellipse
        ? `<svg xmlns="http://www.w3.org/2000/svg" class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><ellipse cx="12" cy="5" rx="9" ry="3" stroke-width="1.5"/><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="${m.icon}"/></svg>`
        : `<svg xmlns="http://www.w3.org/2000/svg" class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="${m.icon}"/></svg>`;
      const badgeHtml = count > 0 || m.alwaysLive
        ? `<span class="track-badge track-badge-live"><span class="live-dot"></span>${count} chapters available</span>`
        : `<span class="track-badge track-badge-soon">
             <svg xmlns="http://www.w3.org/2000/svg" class="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
             Content coming soon
           </span>`;
      return `
        <a href="${url(params.theme + '/' + m.slug)}" class="group track-card ${m.track}">
          <div class="track-icon">${iconSvg}</div>
          <h2 class="track-title">${escapeHtml(m.title)}</h2>
          <p class="track-desc">${escapeHtml(m.desc)}</p>
          ${badgeHtml}
        </a>
      `;
    })
    .join('');

  return `
    <header class="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-4 py-3">
      <div class="flex items-center gap-3">
        <a href="${url('')}" title="Home" class="flex h-5 items-center text-gray-500 dark:text-neutral-400 hover:text-gray-900 dark:hover:text-white transition-colors">
          <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"/>
          </svg>
        </a>
        <a href="${url('')}" class="flex items-center gap-1.5 text-sm text-gray-500 dark:text-neutral-400 hover:text-gray-900 dark:hover:text-white transition-colors">
          <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"/>
          </svg>
          The New Era of Planning
        </a>
      </div>
    </header>

    <div class="relative min-h-screen overflow-hidden pt-12">
      <div class="absolute inset-0 bg-[linear-gradient(to_right,#e5e7eb_1px,transparent_1px),linear-gradient(to_bottom,#e5e7eb_1px,transparent_1px)] dark:bg-[linear-gradient(to_right,#444444_1px,transparent_1px),linear-gradient(to_bottom,#444444_1px,transparent_1px)] bg-[size:64px_64px] opacity-60 dark:opacity-40 pointer-events-none"></div>
      <div class="absolute inset-0 bg-radial-gradient pointer-events-none"></div>

      <div class="relative z-10 px-6 pt-14 pb-12 max-w-3xl mx-auto text-center animate-fade-in">
        <div class="inline-flex items-center gap-2 text-xs font-medium text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-500/10 border border-blue-200 dark:border-blue-500/30 rounded-full px-3 py-1 mb-6">
          <span class="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse"></span>
          ${escapeHtml(pillar.title)}
        </div>
        <h1 class="text-4xl sm:text-5xl font-bold text-gray-900 dark:text-white mb-4 leading-tight tracking-tight">
          Explore <span class="text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-indigo-500">${escapeHtml(pillar.title)}</span>
        </h1>
        <p class="text-lg text-gray-600 dark:text-neutral-400 max-w-lg mx-auto leading-relaxed">${escapeHtml(pillar.heroDesc)}</p>
      </div>

      <div class="relative z-10 px-6 pb-20 max-w-5xl mx-auto">
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-6">${cardsHtml}</div>
      </div>
    </div>

    <style>
      .bg-radial-gradient { background: radial-gradient(ellipse 80% 50% at 50% -20%, rgba(59,130,246,0.08), transparent); }
      .dark .bg-radial-gradient { background: radial-gradient(ellipse 80% 50% at 50% -20%, rgba(59,130,246,0.15), transparent); }

      .track-card {
        display: flex; flex-direction: column; border-radius: 1rem; transition: all 0.2s;
        cursor: pointer; text-decoration: none; padding: 2.5rem; border-top-width: 4px; border-top-style: solid;
      }
      .track-card:hover { transform: translateY(-4px); box-shadow: 0 6px 24px rgba(59,130,246,0.12); }

      .track-arch, .track-how-platform, .track-bc, .track-fms, .track-org-roles, .track-process, .track-fundamentals, .track-planning, .track-governance {
        background: #eff6ff; border: 1.5px solid #bfdbfe; border-top: 4px solid #93c5fd;
      }
      .dark .track-arch, .dark .track-how-platform, .dark .track-bc, .dark .track-fms, .dark .track-org-roles, .dark .track-process, .dark .track-fundamentals, .dark .track-planning, .dark .track-governance {
        background: #2c2c2c; border-color: rgba(59,130,246,0.18); border-top-color: rgba(147,197,253,0.5);
      }
      .dark .track-card:hover { background: #363636; box-shadow: 0 6px 28px rgba(59,130,246,0.12); }

      .track-icon { width: 3.5rem; height: 3.5rem; border-radius: 0.75rem; display: flex; align-items: center; justify-content: center; margin-bottom: 1.25rem; background: #dbeafe; color: #1d4ed8; }
      .dark .track-icon { background: rgba(59,130,246,0.12); color: #93c5fd; }

      .track-title { font-size: 1.25rem; font-weight: 700; margin-bottom: 0.5rem; color: #111827; }
      .dark .track-title { color: #f3f4f6; }
      .track-desc { font-size: 0.875rem; line-height: 1.625; margin-bottom: 1.25rem; flex: 1; color: #6b7280; }
      .dark .track-desc { color: rgba(243,244,246,0.45); }

      .track-badge { display: inline-flex; align-items: center; gap: 0.375rem; font-size: 0.75rem; font-weight: 600; padding: 0.375rem 0.75rem; border-radius: 9999px; align-self: flex-start; background: #dbeafe; color: #1e40af; }
      .dark .track-badge { background: rgba(59,130,246,0.12); color: #93c5fd; }
      .track-badge-soon { background: #f3f4f6; color: #6b7280; }
      .dark .track-badge-soon { background: rgba(255,255,255,0.07); color: rgba(255,255,255,0.4); }

      .live-dot { width: 0.375rem; height: 0.375rem; border-radius: 9999px; background: currentColor; animation: pulse 2s infinite; display: inline-block; }
      @keyframes pulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.4; } }
    </style>
  `;
}
