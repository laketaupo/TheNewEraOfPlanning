// Port of src/layouts/RasciTableLayout.astro — RASCI responsibility matrix.
import { escapeHtml } from '../markdown.js';
import { getColors, renderTopHeader, renderBottomNav, renderChapterMeta, themeFilter } from './shared.js';

const rasciColorMap = {
  R: 'bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-300',
  A: 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900/40 dark:text-indigo-300',
  S: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300',
  C: 'bg-violet-100 text-violet-700 dark:bg-violet-900/40 dark:text-violet-300',
  I: 'bg-gray-100 text-gray-600 dark:bg-neutral-800 dark:text-neutral-400',
};

const rasciLegend = [
  { key: 'R', label: 'Responsible' },
  { key: 'A', label: 'Accountable' },
  { key: 'S', label: 'Supporting' },
  { key: 'C', label: 'Consulted' },
  { key: 'I', label: 'Informed' },
];

export function render(props) {
  const { accentColor, accentSubtle, badgeBgClass, dotColorClass } = getColors(props.chapterColor);
  const roles = props.roles ?? [];
  const steps = props.steps ?? [];

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
            ${roles.length > 0 ? `
              <thead>
                <tr class="bg-gray-50 dark:bg-neutral-900">
                  <th class="sticky left-0 bg-gray-50 dark:bg-neutral-900 z-10 text-left px-5 py-3.5 text-xs font-semibold text-gray-500 dark:text-neutral-400 uppercase tracking-wider border-b border-gray-200 dark:border-neutral-800 whitespace-nowrap">
                    Step
                  </th>
                  ${roles.map((role) => `
                    <th class="text-center px-5 py-3.5 text-xs font-semibold text-gray-500 dark:text-neutral-400 uppercase tracking-wider border-b border-gray-200 dark:border-neutral-800 whitespace-nowrap">
                      ${escapeHtml(role)}
                    </th>`).join('')}
                </tr>
              </thead>` : ''}
            <tbody class="bg-white dark:bg-neutral-900 divide-y divide-gray-100 dark:divide-neutral-800">
              ${steps.map((step) => `
                <tr class="hover:bg-(--accent-subtle) transition-colors">
                  <td class="sticky left-0 bg-white dark:bg-neutral-900 hover:bg-(--accent-subtle) z-10 px-5 py-3.5 font-medium text-gray-900 dark:text-white leading-relaxed whitespace-nowrap">
                    ${escapeHtml(step.label)}
                  </td>
                  ${roles.map((role) => {
                    const value = step.assignments ? step.assignments[role] : undefined;
                    const badgeClass = value ? rasciColorMap[value] : undefined;
                    return `
                    <td class="px-5 py-3.5 text-center">
                      ${(value && badgeClass) ? `<span class="${badgeClass} inline-flex items-center justify-center w-7 h-7 rounded-full text-xs font-bold">${escapeHtml(value)}</span>` : ''}
                    </td>`;
                  }).join('')}
                </tr>`).join('')}
            </tbody>
          </table>
        </div>

        <div class="mt-6 flex flex-wrap items-center gap-x-6 gap-y-3">
          ${rasciLegend.map(({ key, label }) => `
            <div class="flex items-center gap-2 text-sm text-gray-600 dark:text-neutral-400">
              <span class="${rasciColorMap[key]} inline-flex items-center justify-center w-7 h-7 rounded-full text-xs font-bold">
                ${key}
              </span>
              ${label}
            </div>`).join('')}
        </div>
      </div>
    </div>
  </main>

${renderBottomNav(props)}`;
}
