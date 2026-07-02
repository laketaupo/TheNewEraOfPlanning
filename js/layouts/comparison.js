// Port of src/layouts/ComparisonLayout.astro — left/right two-column comparison.
import { escapeHtml } from '../markdown.js';
import { getColors, renderTopHeader, renderBottomNav, renderChapterMeta, themeFilter } from './shared.js';

function renderSide(side, accentColor, accentSubtle) {
  if (!side) return '';
  const points = side.points ?? [];
  return `
            <div class="rounded-2xl border border-gray-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 overflow-hidden">
              <div class="px-6 py-4 border-b border-gray-100 dark:border-neutral-800" style="background: ${accentSubtle};">
                <h2 class="text-base font-semibold text-gray-900 dark:text-white">${escapeHtml(side.title)}</h2>
              </div>
              <ul class="p-6 space-y-3">
                ${points.map((point) => `
                  <li class="flex items-start gap-3">
                    <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4 mt-0.5 shrink-0" style="color: ${accentColor};" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M9 5l7 7-7 7"/>
                    </svg>
                    <span class="text-sm text-gray-700 dark:text-neutral-300 leading-relaxed">${escapeHtml(point)}</span>
                  </li>`).join('')}
              </ul>
            </div>`;
}

export function render(props) {
  const { accentColor, accentSubtle, badgeBgClass, dotColorClass } = getColors(props.chapterColor);

  return `
${renderTopHeader(props)}

  <main
    class="min-h-screen pt-12 pb-32"
    style="--accent: ${accentColor}; --accent-subtle: ${accentSubtle};"
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
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-5">
          ${renderSide(props.left, accentColor, accentSubtle)}
          ${renderSide(props.right, accentColor, accentSubtle)}
        </div>
      </div>
    </div>
  </main>

${renderBottomNav(props)}`;
}
