// Generic port of the ~21 per-module index pages (e.g. src/pages/technology/erp/index.astro,
// src/pages/process/sop/index.astro, ...) for the build-free SPA. Route: /:theme/:module.
// All ~21 original pages shared one identical structure (hero + chapter-card list with icon/topic-count/
// comingSoon states, all rendered blue), differing only in which chapters they filter to — so this is one
// data-driven renderer instead of 21 near-duplicate files.
import { url } from '../base-url.js';
import { escapeHtml } from '../markdown.js';
import { getChapters, getTopics, getChapterUrl } from '../lib/chapters.js';
import { getModuleMeta } from '../lib/module-meta.js';
import { render as renderNotFound } from './not-found.js';

// Heroicons-outline paths, matching the icon set used across every chapter _meta.json (falls back to
// 'users' for any name not listed here, matching the original `iconMap[chapter.icon] ?? iconMap['users']`).
const ICON_PATHS = {
  users: 'M17 20h5v-2a4 4 0 00-5-3.87M9 20H4v-2a4 4 0 015-3.87m6-4.13a4 4 0 10-8 0 4 4 0 008 0zm6 0a3 3 0 11-6 0 3 3 0 016 0z',
  user: 'M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z',
  network: 'M12 7v4m0 4l-5 2m10-2l-5 2',
  calendar: 'M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z',
  'chart-bar': 'M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z',
  'document-text': 'M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z',
  'shield-check': 'M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z',
  beaker: 'M9 3h6m-6 0v7l-4 9a1 1 0 001 1h12a1 1 0 001-1l-4-9V3',
  cube: 'M20 7l-8-4-8 4m16 0v10l-8 4M4 7v10l8 4',
  database: 'M4 7v10c0 1.1.9 2 2 2h12a2 2 0 002-2V7M4 7c0-1.1.9-2 2-2h12a2 2 0 012 2M4 7h16M8 11h8M8 15h5',
  server: 'M5 12h14M5 12a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v4a2 2 0 01-2 2M5 12a2 2 0 00-2 2v4a2 2 0 002 2h14a2 2 0 002-2v-4a2 2 0 00-2-2m-14 -4h.01M5 16h.01',
  cpu: 'M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 7h10v10H7z',
  globe: 'M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z',
  'lightning-bolt': 'M13 10V3L4 14h7v7l9-11h-7z',
  'switch-horizontal': 'M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4',
  collection: 'M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10',
  'cursor-click': 'M9.75 9.75l6.163 13.416a.25.25 0 00.463-.017l2.34-6.257 6.257-2.34a.25.25 0 00.017-.463L11.574 7.926',
  'office-building': 'M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4',
  'arrows-expand': 'M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4',
};

function iconSvg(iconName) {
  const path = ICON_PATHS[iconName] ?? ICON_PATHS.users;
  return `<svg xmlns="http://www.w3.org/2000/svg" class="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="${path}"/></svg>`;
}

export async function render(params, query) {
  const meta = getModuleMeta(params.module);
  if (!meta || meta.theme !== params.theme) return renderNotFound(params, query);

  // Hidden chapters (e.g. 99-layout-showcase) are excluded from this listing — "invisible in
  // nav" per CLAUDE.md — but still render on direct URL (see js/pages/chapter-index.js).
  const chapters = getChapters(params.theme).filter((c) => c.module === params.module && !c.hidden);
  const allTopics = getTopics();

  const cardsHtml = chapters
    .map((chapter) => {
      const topics = allTopics.filter((t) => t.chapterSlug === chapter.slug);
      const orderLabel = String(chapter.order).padStart(2, '0');
      if (chapter.comingSoon) {
        return `
          <div class="relative flex flex-col p-8 rounded-2xl border bg-blue-50 dark:bg-neutral-900 border-blue-200 dark:border-blue-500/30 cursor-default select-none">
            <span class="text-xs font-mono font-bold text-blue-600 dark:text-blue-400 mb-4">${orderLabel}</span>
            <div class="flex items-start gap-4 mb-4">
              <div class="text-blue-600 dark:text-blue-400 mt-0.5 shrink-0">${iconSvg(chapter.icon)}</div>
              <div>
                <h3 class="text-lg font-semibold text-gray-900 dark:text-white leading-snug">${escapeHtml(chapter.title)}</h3>
                <p class="text-sm text-gray-500 dark:text-neutral-400 mt-1 leading-relaxed">${escapeHtml(chapter.description)}</p>
              </div>
            </div>
            <div class="flex items-center mt-auto pt-4 border-t border-blue-100 dark:border-blue-500/10">
              <span class="inline-flex items-center gap-1.5 text-xs font-medium text-gray-400 dark:text-neutral-500">
                <svg xmlns="http://www.w3.org/2000/svg" class="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
                Coming soon
              </span>
            </div>
          </div>
        `;
      }
      return `
        <a href="${url(getChapterUrl(chapter))}" class="group relative flex flex-col p-8 rounded-2xl border bg-blue-50 dark:bg-neutral-900 border-blue-200 dark:border-blue-500/30 hover:border-blue-400 dark:hover:border-blue-400 transition-all duration-200 hover:-translate-y-1 hover:shadow-xl">
          <span class="text-xs font-mono font-bold text-blue-600 dark:text-blue-400 mb-4">${orderLabel}</span>
          <div class="flex items-start gap-4 mb-4">
            <div class="text-blue-600 dark:text-blue-400 mt-0.5 shrink-0">${iconSvg(chapter.icon)}</div>
            <div>
              <h3 class="text-lg font-semibold text-gray-900 dark:text-white leading-snug">${escapeHtml(chapter.title)}</h3>
              <p class="text-sm text-gray-500 dark:text-neutral-400 mt-1 leading-relaxed">${escapeHtml(chapter.description)}</p>
            </div>
          </div>
          <div class="flex items-center justify-between mt-auto pt-4 border-t border-blue-100 dark:border-blue-500/10">
            <span class="text-xs text-gray-400 dark:text-neutral-500">${topics.length} topics</span>
            <div class="flex items-center gap-1 text-xs text-blue-600 dark:text-blue-400 opacity-0 group-hover:opacity-100 transition-opacity">
              Open chapter
              <svg xmlns="http://www.w3.org/2000/svg" class="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/></svg>
            </div>
          </div>
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
        <a href="${url(params.theme)}" class="flex items-center gap-1.5 text-sm text-gray-500 dark:text-neutral-400 hover:text-gray-900 dark:hover:text-white transition-colors">
          <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"/>
          </svg>
          ${escapeHtml(params.theme[0].toUpperCase() + params.theme.slice(1))}
        </a>
      </div>
    </header>

    <div class="relative overflow-hidden pt-12">
      <div class="absolute inset-0 bg-[linear-gradient(to_right,#e5e7eb_1px,transparent_1px),linear-gradient(to_bottom,#e5e7eb_1px,transparent_1px)] dark:bg-[linear-gradient(to_right,#444444_1px,transparent_1px),linear-gradient(to_bottom,#444444_1px,transparent_1px)] bg-size-[64px_64px] opacity-60 dark:opacity-40 pointer-events-none"></div>
      <div class="absolute inset-0 bg-radial-gradient pointer-events-none"></div>

      <div class="relative z-10 px-6 pt-12 pb-12 max-w-3xl mx-auto text-center animate-fade-in">
        <div class="inline-flex items-center gap-2 text-xs font-medium text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-500/10 border border-blue-200 dark:border-blue-500/30 rounded-full px-3 py-1 mb-6">
          <span class="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse"></span>
          ${escapeHtml(params.theme[0].toUpperCase() + params.theme.slice(1))}
        </div>
        <h1 class="text-5xl sm:text-6xl font-bold text-gray-900 dark:text-white mb-6 leading-tight tracking-tight">
          <span class="text-transparent bg-clip-text bg-linear-to-r from-blue-400 to-blue-600">${escapeHtml(meta.label)}</span>
        </h1>
        <p class="text-xl text-gray-600 dark:text-neutral-400 max-w-xl mx-auto leading-relaxed">
          ${chapters.length} chapter${chapters.length === 1 ? '' : 's'} in this module.
        </p>
      </div>

      <div class="relative z-10 px-6 pb-20 max-w-6xl mx-auto">
        <div class="flex flex-col gap-5 max-w-3xl mx-auto">${cardsHtml}</div>
      </div>
    </div>

    <style>
      .bg-radial-gradient { background: radial-gradient(ellipse 80% 50% at 50% -20%, rgba(59,130,246,0.08), transparent); }
      .dark .bg-radial-gradient { background: radial-gradient(ellipse 80% 50% at 50% -20%, rgba(59,130,246,0.15), transparent); }
    </style>
  `;
}
