// Port of src/layouts/ProcessStepDetailLayout.astro — step execution layout with
// inputs/outputs/roles/systems/tasks metadata panels.
import { escapeHtml } from '../markdown.js';
import { getColors, renderTopHeader, renderBottomNav, renderChapterMeta, themeFilter } from './shared.js';

export function render(props) {
  const { accentColor, accentSubtle, badgeBgClass, dotColorClass } = getColors(props.chapterColor);
  const inputs = props.inputs ?? [];
  const outputs = props.outputs ?? [];
  const roles = props.roles ?? [];
  const systems = props.systems ?? [];
  const tasks = props.tasks ?? [];

  const inputsOutputsBlock = (inputs.length > 0 || outputs.length > 0) ? `
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-5">
          ${inputs.length > 0 ? `
            <div class="rounded-xl border border-gray-200 dark:border-neutral-800 bg-gray-50 dark:bg-neutral-900 p-5">
              <h4 class="text-xs font-semibold uppercase tracking-wider text-[var(--accent)] mb-4">Inputs</h4>
              <ul class="space-y-2.5">
                ${inputs.map((inp) => `
                  <li class="flex items-start gap-2.5 text-sm text-gray-700 dark:text-neutral-300">
                    <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4 flex-shrink-0 mt-0.5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/>
                    </svg>
                    ${escapeHtml(inp)}
                  </li>`).join('')}
              </ul>
            </div>` : ''}
          ${outputs.length > 0 ? `
            <div class="rounded-xl border border-gray-200 dark:border-neutral-800 bg-gray-50 dark:bg-neutral-900 p-5">
              <h4 class="text-xs font-semibold uppercase tracking-wider text-[var(--accent)] mb-4">Outputs</h4>
              <ul class="space-y-2.5">
                ${outputs.map((out) => `
                  <li class="flex items-start gap-2.5 text-sm text-gray-700 dark:text-neutral-300">
                    <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4 flex-shrink-0 mt-0.5 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/>
                    </svg>
                    ${escapeHtml(out)}
                  </li>`).join('')}
              </ul>
            </div>` : ''}
        </div>` : '';

  const rolesSystemsBlock = (roles.length > 0 || systems.length > 0) ? `
        <div class="flex flex-wrap gap-2">
          ${roles.map((r) => `<span class="inline-flex items-center text-xs font-medium px-2.5 py-1 rounded-full bg-indigo-50 dark:bg-indigo-500/10 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-500/30">${escapeHtml(r)}</span>`).join('')}
          ${systems.map((s) => `<span class="inline-flex items-center text-xs font-medium px-2.5 py-1 rounded-full bg-rose-50 dark:bg-rose-500/10 text-rose-700 dark:text-rose-300 border border-rose-200 dark:border-rose-500/30">${escapeHtml(s)}</span>`).join('')}
        </div>` : '';

  const tasksBlock = tasks.length > 0 ? `
        <div class="rounded-xl border border-gray-200 dark:border-neutral-800 bg-gray-50 dark:bg-neutral-900 p-5">
          <h4 class="text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-neutral-400 mb-4">Tasks</h4>
          <ol class="space-y-3">
            ${tasks.map((task, i) => `
              <li class="flex items-start gap-3 text-sm text-gray-700 dark:text-neutral-300">
                <span class="flex-shrink-0 w-5 h-5 rounded-full border border-gray-300 dark:border-neutral-600 flex items-center justify-center text-xs font-semibold text-gray-500 dark:text-neutral-400 mt-0.5">${i + 1}</span>
                ${escapeHtml(task)}
              </li>`).join('')}
          </ol>
        </div>` : '';

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
          ${escapeHtml(props.chapterTitle)} · Step ${escapeHtml(props.topicOrder)}
        </div>
        <h1 class="text-4xl sm:text-5xl font-bold text-gray-900 dark:text-white mb-5 leading-tight tracking-tight">${escapeHtml(props.title)}</h1>
        <p class="text-lg text-gray-600 dark:text-neutral-400 leading-relaxed max-w-2xl">${escapeHtml(props.description)}</p>
      </div>
    </div>

    <div class="bg-white dark:bg-neutral-950">
      <div class="max-w-5xl mx-auto px-6 pt-6 pb-10 space-y-6">
        ${inputsOutputsBlock}
        ${rolesSystemsBlock}
        ${tasksBlock}
      </div>
    </div>
  </main>

${renderBottomNav(props)}`;
}
