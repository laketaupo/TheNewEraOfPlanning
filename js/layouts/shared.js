// Shared helpers for js/layouts/*.js — factored out because all 9 topic layouts render an
// identical fixed top header, an identical fixed bottom prev/next nav (with the mark-complete /
// mark-unclear buttons), and the same chapter-color -> Tailwind-class lookup maps. Keeping one
// copy here (instead of 9 duplicated literal copies) avoids drift while still only ever using
// literal class strings from these maps (never string-interpolated Tailwind classes).
import { escapeHtml } from '../markdown.js';
import { url } from '../base-url.js';

export const colorMap = {
  indigo:  'text-indigo-600 dark:text-indigo-400 border-indigo-400 dark:border-indigo-500',
  violet:  'text-violet-600 dark:text-violet-400 border-violet-400 dark:border-violet-500',
  sky:     'text-sky-600 dark:text-sky-400 border-sky-400 dark:border-sky-500',
  emerald: 'text-emerald-600 dark:text-emerald-400 border-emerald-400 dark:border-emerald-500',
  amber:   'text-amber-600 dark:text-amber-400 border-amber-400 dark:border-amber-500',
  teal:    'text-teal-600 dark:text-teal-400 border-teal-400 dark:border-teal-500',
  yellow:  'text-yellow-600 dark:text-yellow-400 border-yellow-400 dark:border-yellow-500',
  blue:    'text-blue-600 dark:text-blue-400 border-blue-400 dark:border-blue-500',
  red:     'text-red-600 dark:text-red-400 border-red-400 dark:border-red-500',
};

const accentColorMap = {
  indigo:  '#6366f1',
  violet:  '#8b5cf6',
  sky:     '#0ea5e9',
  emerald: '#10b981',
  amber:   '#f59e0b',
  teal:    '#14b8a6',
  yellow:  '#eab308',
  blue:    '#3b82f6',
  red:     '#ef4444',
};

const accentSubtleMap = {
  indigo:  'rgba(99, 102, 241, 0.07)',
  violet:  'rgba(139, 92, 246, 0.07)',
  sky:     'rgba(14, 165, 233, 0.07)',
  emerald: 'rgba(16, 185, 129, 0.07)',
  amber:   'rgba(245, 158, 11, 0.07)',
  teal:    'rgba(20, 184, 166, 0.07)',
  yellow:  'rgba(234, 179, 8, 0.07)',
  blue:    'rgba(59, 130, 246, 0.07)',
  red:     'rgba(239, 68, 68, 0.07)',
};

const badgeBgMap = {
  indigo:  'bg-indigo-50 dark:bg-indigo-500/10 border-indigo-200 dark:border-indigo-500/30 text-indigo-600 dark:text-indigo-400',
  violet:  'bg-violet-50 dark:bg-violet-500/10 border-violet-200 dark:border-violet-500/30 text-violet-600 dark:text-violet-400',
  sky:     'bg-sky-50 dark:bg-sky-500/10 border-sky-200 dark:border-sky-500/30 text-sky-600 dark:text-sky-400',
  emerald: 'bg-emerald-50 dark:bg-emerald-500/10 border-emerald-200 dark:border-emerald-500/30 text-emerald-600 dark:text-emerald-400',
  amber:   'bg-amber-50 dark:bg-amber-500/10 border-amber-200 dark:border-amber-500/30 text-amber-600 dark:text-amber-400',
  teal:    'bg-teal-50 dark:bg-teal-500/10 border-teal-200 dark:border-teal-500/30 text-teal-600 dark:text-teal-400',
  yellow:  'bg-yellow-50 dark:bg-yellow-500/10 border-yellow-200 dark:border-yellow-500/30 text-yellow-600 dark:text-yellow-400',
  blue:    'bg-blue-50 dark:bg-blue-500/10 border-blue-200 dark:border-blue-500/30 text-blue-600 dark:text-blue-400',
  red:     'bg-red-50 dark:bg-red-500/10 border-red-200 dark:border-red-500/30 text-red-600 dark:text-red-400',
};

export const dotColorMap = {
  indigo:  'bg-indigo-500',
  violet:  'bg-violet-500',
  sky:     'bg-sky-500',
  emerald: 'bg-emerald-500',
  amber:   'bg-amber-500',
  teal:    'bg-teal-500',
  yellow:  'bg-yellow-500',
  blue:    'bg-blue-500',
  red:     'bg-red-500',
};

/** Resolves the chapter-color -> Tailwind-class bundle used by (almost) every layout. */
export function getColors(chapterColor) {
  return {
    chapterColorClass: colorMap[chapterColor] ?? 'text-brand-600 dark:text-brand-400 border-brand-500',
    accentColor: accentColorMap[chapterColor] ?? '#6366f1',
    accentSubtle: accentSubtleMap[chapterColor] ?? 'rgba(99, 102, 241, 0.07)',
    badgeBgClass: badgeBgMap[chapterColor] ?? badgeBgMap.indigo,
    dotColorClass: dotColorMap[chapterColor] ?? dotColorMap.indigo,
  };
}

/** Fixed top navigation bar: home icon + back-to-chapter link (`#nav-back-link`). Identical across all layouts. */
export function renderTopHeader(props) {
  return `
  <header class="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 py-3">
    <div class="flex items-center gap-3">
      <a href="${url('')}" title="Home (H)" class="flex h-5 items-center text-gray-500 dark:text-neutral-400 hover:text-gray-900 dark:hover:text-white transition-colors">
        <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"/>
        </svg>
      </a>
      <a id="nav-back-link" href="${url(props.chapterUrl ?? '')}" class="flex items-center gap-2 text-sm text-gray-500 dark:text-neutral-400 hover:text-gray-900 dark:hover:text-white transition-colors">
        <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12h18M3 12l7-7M3 12l7 7"/>
        </svg>
        ${escapeHtml(props.chapterTitle)}
      </a>
    </div>
  </header>`;
}

/** Fixed bottom prev/next nav (`[data-role-nav]`) + mark-complete/unclear buttons. Identical across all layouts. */
export function renderBottomNav(props) {
  const topicId = escapeHtml(`${props.chapterSlug}/${props.topicSlug}`);

  const prevBlock = props.prevUrl
    ? `<a href="${url(props.prevUrl)}" class="group flex items-center gap-2 text-sm text-gray-500 dark:text-neutral-400 hover:text-gray-900 dark:hover:text-white transition-colors">
        <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4 group-hover:-translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"/>
        </svg>
        <span class="hidden sm:inline">${escapeHtml(props.prevTitle ?? 'Previous')}</span>
        <span class="sm:hidden">Prev</span>
      </a>`
    : `<a href="${url('')}" class="group flex items-center gap-2 text-sm text-gray-500 dark:text-neutral-400 hover:text-gray-900 dark:hover:text-white transition-colors">
        <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12h18M3 12l7-7M3 12l7 7"/>
        </svg>
        Home
      </a>`;

  const nextBlock = props.nextUrl
    ? `<a href="${url(props.nextUrl)}" class="group flex items-center gap-2 text-sm text-gray-500 dark:text-neutral-400 hover:text-gray-900 dark:hover:text-white transition-colors">
        <span class="hidden sm:inline">${escapeHtml(props.nextTitle ?? 'Next')}</span>
        <span class="sm:hidden">Next</span>
        <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/>
        </svg>
      </a>`
    : `<a href="${url('')}" class="text-sm text-emerald-600 dark:text-emerald-400 hover:text-emerald-700 dark:hover:text-emerald-300 transition-colors font-medium">
        Finish ✓
      </a>`;

  return `
  <nav class="fixed bottom-0 left-0 right-0 z-50 flex items-center justify-between px-6 py-4 bg-white/60 dark:bg-neutral-950/60 backdrop-blur-md border-t border-gray-200 dark:border-neutral-800" data-role-nav>
    <div class="flex-1">
      ${prevBlock}
    </div>

    <div class="flex items-center gap-2">
      <button
        id="complete-btn"
        data-topic-id="${topicId}"
        class="flex items-center gap-2 text-xs font-medium px-3 py-1.5 rounded-full border border-gray-300 dark:border-neutral-700 text-gray-500 dark:text-neutral-400 hover:border-emerald-500 hover:text-emerald-600 dark:hover:text-emerald-400 transition-all"
      >
        <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/>
        </svg>
        <span id="complete-label">Mark complete</span>
      </button>
      <button
        id="unclear-btn"
        data-topic-id="${topicId}"
        class="flex items-center gap-2 text-xs font-medium px-3 py-1.5 rounded-full border border-gray-300 dark:border-neutral-700 text-gray-500 dark:text-neutral-400 hover:border-amber-400 hover:text-amber-600 dark:hover:text-amber-400 transition-all"
      >
        <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
        </svg>
        <span id="unclear-label">Mark unclear</span>
      </button>
    </div>

    <div class="flex-1 flex justify-end">
      ${nextBlock}
    </div>
  </nav>`;
}

/** `<span class="sr-only" data-pagefind-meta="chapter">` — chapter title marker used inside every main content block. */
export function renderChapterMeta(props) {
  return `<span class="sr-only" data-pagefind-meta="chapter">${escapeHtml(props.chapterTitle)}</span>`;
}

/** `theme:` filter value for `data-pagefind-filter` (kept for DOM-shape parity; Pagefind itself is gone). */
export function themeFilter(props) {
  return escapeHtml(`theme:${props.theme ?? 'technology'}`);
}
