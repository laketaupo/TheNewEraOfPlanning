// Port of src/layouts/CardGridLayout.astro — card-based comparison grid.
import { escapeHtml } from '../markdown.js';
import { getColors, renderTopHeader, renderBottomNav, renderChapterMeta, themeFilter } from './shared.js';

const iconColorMap = {
  indigo:  'text-indigo-500 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-500/10',
  violet:  'text-violet-500 dark:text-violet-400 bg-violet-50 dark:bg-violet-500/10',
  sky:     'text-sky-500 dark:text-sky-400 bg-sky-50 dark:bg-sky-500/10',
  emerald: 'text-emerald-500 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-500/10',
  amber:   'text-amber-500 dark:text-amber-400 bg-amber-50 dark:bg-amber-500/10',
  teal:    'text-teal-500 dark:text-teal-400 bg-teal-50 dark:bg-teal-500/10',
  yellow:  'text-yellow-500 dark:text-yellow-400 bg-yellow-50 dark:bg-yellow-500/10',
  blue:    'text-blue-500 dark:text-blue-400 bg-blue-50 dark:bg-blue-500/10',
  red:     'text-red-500 dark:text-red-400 bg-red-50 dark:bg-red-500/10',
};

// SVG icon paths keyed by icon name (same set as chapter _meta.json)
const iconPaths = {
  cube:    'M21 16V8a2 2 0 00-1-1.73l-7-4a2 2 0 00-2 0l-7 4A2 2 0 003 8v8a2 2 0 001 1.73l7 4a2 2 0 002 0l7-4A2 2 0 0021 16z',
  network: 'M9 3H5a2 2 0 00-2 2v4m6-6h10a2 2 0 012 2v4M9 3v18m0 0h10a2 2 0 002-2V9M9 21H5a2 2 0 01-2-2V9m0 0h18',
  cpu:     'M9 3H5a2 2 0 00-2 2v4m6-6h10a2 2 0 012 2v4M9 3v18m0 0h10a2 2 0 002-2V9M9 21H5a2 2 0 01-2-2V9m0 0h18',
  beaker:  'M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z',
};

function renderIcon(iconColorClass, iconName) {
  // Mirrors the original's two mutually-exclusive conditions exactly: a known icon name
  // renders that icon; no icon name at all falls back to "cube"; an *unknown* icon name
  // renders nothing (matches the Astro source's `{card.icon && iconPaths[card.icon] && (...)}`
  // followed by `{!card.icon && (...)}` — there is no third "icon set but unknown" branch).
  let path = null;
  if (iconName && iconPaths[iconName]) path = iconPaths[iconName];
  else if (!iconName) path = iconPaths.cube;
  if (!path) return '';
  return `
              <div class="w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${iconColorClass}">
                <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.75" d="${path}" />
                </svg>
              </div>`;
}

export function render(props) {
  const { accentColor, badgeBgClass, dotColorClass } = getColors(props.chapterColor);
  const iconColorClass = iconColorMap[props.chapterColor] ?? iconColorMap.indigo;
  const cards = props.cards ?? [];

  return `
${renderTopHeader(props)}

  <main
    class="min-h-screen pt-12 pb-32"
    style="--accent: ${accentColor};"
    data-pagefind-body
    data-pagefind-filter="${themeFilter(props)}"
  >
    ${renderChapterMeta(props)}

    <div class="bg-gray-50 dark:bg-neutral-950 border-b border-gray-100 dark:border-neutral-800">
      <div class="h-[3px]" style="background: linear-gradient(90deg, ${accentColor}, ${accentColor}44 60%, transparent)"></div>
      <div class="max-w-5xl mx-auto px-6 pt-6 pb-6 animate-fade-in">
        <div class="inline-flex items-center gap-2 text-xs font-medium border rounded-full px-3 py-1 mb-6 ${badgeBgClass}">
          <span class="w-1.5 h-1.5 rounded-full animate-pulse ${dotColorClass}"></span>
          ${escapeHtml(props.chapterTitle)} · Topic ${escapeHtml(props.topicOrder)}
        </div>
        <h1 class="text-4xl sm:text-5xl font-bold text-gray-900 dark:text-white mb-5 leading-tight tracking-tight">${escapeHtml(props.title)}</h1>
        <p class="text-lg text-gray-600 dark:text-neutral-400 leading-relaxed max-w-2xl">${escapeHtml(props.description)}</p>
      </div>
    </div>

    <div class="bg-gray-50 dark:bg-neutral-950">
      <div class="max-w-5xl mx-auto px-6 pt-6 pb-14 animate-slide-up">
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          ${cards.map((card) => `
            <div class="group rounded-2xl border border-gray-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 p-6 flex flex-col gap-4 hover:border-(--accent) hover:shadow-md transition-all duration-200">
              ${renderIcon(iconColorClass, card.icon)}
              <div>
                <h3 class="text-sm font-semibold text-gray-900 dark:text-white mb-1.5">${escapeHtml(card.title)}</h3>
                <p class="text-sm text-gray-600 dark:text-neutral-400 leading-relaxed">${escapeHtml(card.description)}</p>
              </div>
            </div>`).join('')}
        </div>
      </div>
    </div>
  </main>

${renderBottomNav(props)}`;
}
