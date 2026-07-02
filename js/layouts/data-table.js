// Port of src/layouts/DataTableLayout.astro — tabular data display.
import { escapeHtml } from '../markdown.js';
import { getColors, renderTopHeader, renderBottomNav, renderChapterMeta, themeFilter } from './shared.js';

export function render(props) {
  const { accentColor, accentSubtle, badgeBgClass, dotColorClass } = getColors(props.chapterColor);
  const tableColumns = props.tableColumns ?? [];
  const tableRows = props.tableRows ?? [];

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
        <div class="overflow-x-auto rounded-2xl border border-gray-200 dark:border-neutral-800 shadow-sm">
          <table class="w-full border-collapse text-sm">
            ${tableColumns.length > 0 ? `
              <thead>
                <tr class="bg-gray-50 dark:bg-neutral-900">
                  ${tableColumns.map((col) => `
                    <th class="text-left px-5 py-3.5 text-xs font-semibold text-gray-500 dark:text-neutral-400 uppercase tracking-wider border-b border-gray-200 dark:border-neutral-800 whitespace-nowrap">
                      ${escapeHtml(col)}
                    </th>`).join('')}
                </tr>
              </thead>` : ''}
            <tbody class="bg-white dark:bg-neutral-900 divide-y divide-gray-100 dark:divide-neutral-800">
              ${tableRows.map((row) => `
                <tr class="hover:bg-[var(--accent-subtle)] transition-colors">
                  ${row.map((cell, cellIdx) => `
                    <td class="px-5 py-3.5 text-gray-700 dark:text-neutral-300 leading-relaxed ${cellIdx === 0 ? 'font-medium text-gray-900 dark:text-white' : ''}">
                      ${escapeHtml(cell)}
                    </td>`).join('')}
                </tr>`).join('')}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </main>

${renderBottomNav(props)}`;
}
