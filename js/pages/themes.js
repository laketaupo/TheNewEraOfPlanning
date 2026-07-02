// Port of src/pages/pillars/index.astro for the build-free SPA. Route: /themes (and /pillars alias — see router.js).
import { url } from '../base-url.js';
import { escapeHtml } from '../markdown.js';
import { getThemes, getModulesForTheme } from '../lib/chapters.js';

const THEME_META = {
  technology: {
    title: 'Technology',
    desc: 'From building blocks to live scenario simulation — a guided tour of the Planning software.',
    icon: `<svg xmlns="http://www.w3.org/2000/svg" class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M20 7l-8-4-8 4m16 0v10l-8 4M4 7v10l8 4"/></svg>`,
  },
  data: {
    title: 'Data',
    desc: 'Data models, signals, and structures that feed intelligent planning decisions.',
    icon: `<svg xmlns="http://www.w3.org/2000/svg" class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/></svg>`,
  },
  process: {
    title: 'Process',
    desc: 'How planning workflows are structured, governed, and continuously improved.',
    icon: `<svg xmlns="http://www.w3.org/2000/svg" class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"/><circle cx="12" cy="12" r="3" stroke-width="1.5"/></svg>`,
  },
  people: {
    title: 'People',
    desc: 'Roles, mindsets, and collaboration patterns that drive planning success.',
    icon: `<svg xmlns="http://www.w3.org/2000/svg" class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M17 20h5v-2a4 4 0 00-5-3.87M9 20H4v-2a4 4 0 015-3.87m6-4.13a4 4 0 10-8 0 4 4 0 008 0zm6 0a3 3 0 11-6 0 3 3 0 016 0z"/></svg>`,
  },
};

export async function render() {
  const cardsHtml = getThemes()
    .map((slug) => {
      const meta = THEME_META[slug] ?? { title: slug, desc: '', icon: '' };
      const moduleCount = getModulesForTheme(slug).length;
      return `
        <a href="${url(slug)}" class="group theme-card theme-${slug}">
          <div class="theme-icon">${meta.icon}</div>
          <h2 class="theme-title">${escapeHtml(meta.title)}</h2>
          <p class="theme-desc">${escapeHtml(meta.desc)}</p>
          <span class="theme-badge">
            <span class="live-dot"></span>
            ${moduleCount} modules available
          </span>
        </a>
      `;
    })
    .join('');

  return `
    <header class="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 py-3">
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

    <div class="relative min-h-screen">
      <div class="absolute inset-0 bg-[linear-gradient(to_right,#e5e7eb_1px,transparent_1px),linear-gradient(to_bottom,#e5e7eb_1px,transparent_1px)] dark:bg-[linear-gradient(to_right,#444444_1px,transparent_1px),linear-gradient(to_bottom,#444444_1px,transparent_1px)] bg-[size:64px_64px] opacity-60 dark:opacity-40 pointer-events-none"></div>
      <div class="absolute inset-0 bg-radial-gradient pointer-events-none"></div>

      <div class="relative z-10 px-6 pt-16 pb-20 max-w-5xl mx-auto">
        <div class="mb-12">
          <h1 class="text-4xl font-bold text-gray-900 dark:text-white mb-3 tracking-tight">Learn by pillar</h1>
          <p class="text-gray-500 dark:text-neutral-400 text-lg">Explore all four pillars — each broken into modules, chapters and topics.</p>
        </div>

        <div class="grid grid-cols-2 gap-6">${cardsHtml}</div>
      </div>
    </div>

    <style>
      .bg-radial-gradient { background: radial-gradient(ellipse 80% 50% at 50% -20%, rgba(99,102,241,0.08), transparent); }
      .dark .bg-radial-gradient { background: radial-gradient(ellipse 80% 50% at 50% -20%, rgba(99,102,241,0.15), transparent); }

      .theme-card {
        display: flex; flex-direction: column; border-radius: 1rem; transition: all 0.2s;
        cursor: pointer; text-decoration: none; padding: 2.5rem; border-top-width: 4px; border-top-style: solid;
      }
      .theme-card:hover { transform: translateY(-4px); }

      .theme-people, .theme-process, .theme-technology, .theme-data { background:#eff6ff; border:1.5px solid #bfdbfe; border-top:4px solid #93c5fd; }
      .theme-people:hover, .theme-process:hover, .theme-technology:hover, .theme-data:hover { box-shadow: 0 6px 24px rgba(59,130,246,0.12); }
      .dark .theme-people, .dark .theme-process, .dark .theme-technology, .dark .theme-data { background:#2c2c2c; border-color:rgba(59,130,246,0.18); border-top-color:rgba(147,197,253,0.5); }
      .dark .theme-people:hover, .dark .theme-process:hover, .dark .theme-technology:hover, .dark .theme-data:hover { background:#363636; box-shadow:0 6px 28px rgba(59,130,246,0.12); }

      .theme-icon { width: 3.5rem; height: 3.5rem; border-radius: 0.75rem; display: flex; align-items: center; justify-content: center; margin-bottom: 1.25rem; }
      .theme-people .theme-icon, .theme-process .theme-icon, .theme-technology .theme-icon, .theme-data .theme-icon { background:#dbeafe; color:#1d4ed8; }
      .dark .theme-people .theme-icon, .dark .theme-process .theme-icon, .dark .theme-technology .theme-icon, .dark .theme-data .theme-icon { background:rgba(59,130,246,0.12); color:#93c5fd; }

      .theme-title { font-size: 1.25rem; font-weight: 700; margin-bottom: 0.5rem; color:#111827; }
      .dark .theme-title { color:#f3f4f6; }
      .theme-desc { font-size: 0.875rem; line-height: 1.625; margin-bottom: 1.25rem; flex: 1; color:#6b7280; }
      .dark .theme-desc { color:rgba(243,244,246,0.45); }

      .theme-badge { display: inline-flex; align-items: center; gap: 0.375rem; font-size: 0.75rem; font-weight: 600; padding: 0.375rem 0.75rem; border-radius: 9999px; align-self: flex-start; }
      .theme-people .theme-badge, .theme-process .theme-badge, .theme-technology .theme-badge, .theme-data .theme-badge { background:#dbeafe; color:#1e40af; }
      .dark .theme-people .theme-badge, .dark .theme-process .theme-badge, .dark .theme-technology .theme-badge, .dark .theme-data .theme-badge { background:rgba(59,130,246,0.12); color:#93c5fd; }

      .live-dot { width: 0.375rem; height: 0.375rem; border-radius: 9999px; background: currentColor; animation: pulse 2s infinite; display: inline-block; }
      @keyframes pulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.4; } }
    </style>
  `;
}
