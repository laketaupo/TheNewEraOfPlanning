// Port of src/layouts/UiTrainingLayout.astro — full-viewport screenshot + description +
// static steps sidebar.
import { escapeHtml } from '../markdown.js';
import { url } from '../base-url.js';
import { getColors, renderTopHeader, renderBottomNav, renderChapterMeta, themeFilter } from './shared.js';

export function render(props) {
  const { accentColor, accentSubtle, badgeBgClass, dotColorClass } = getColors(props.chapterColor);
  const steps = props.steps ?? [];
  // Content-authored screenshot paths are root-absolute (e.g. "/ui-training/foo.png"); strip the
  // leading slash and let url() apply the correct BASE prefix.
  const screenshotSrc = url((props.screenshot ?? '').replace(/^\//, ''));

  return `
${renderTopHeader(props)}

  <div
    class="flex flex-col overflow-hidden"
    style="height: 100dvh; padding-top: 48px; padding-bottom: 48px; --accent: ${accentColor}; --accent-subtle: ${accentSubtle};"
    data-pagefind-body
    data-pagefind-filter="${themeFilter(props)}"
  >
    ${renderChapterMeta(props)}
    <div class="shrink-0 bg-gray-50 dark:bg-neutral-950 border-b border-gray-100 dark:border-neutral-800">
      <div class="h-[3px]" style="background: linear-gradient(90deg, ${accentColor}, ${accentColor}44 60%, transparent)"></div>
      <div class="px-6 pt-4 pb-5">
        <div class="inline-flex items-center gap-2 text-xs font-medium border rounded-full px-3 py-1 mb-2 ${badgeBgClass}">
          <span class="w-1.5 h-1.5 rounded-full ${dotColorClass}"></span>
          ${escapeHtml(props.chapterTitle)} · Topic ${escapeHtml(props.topicOrder)}
        </div>
        <h1 class="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white mb-1 leading-tight tracking-tight">${escapeHtml(props.title)}</h1>
        <p class="text-sm text-gray-600 dark:text-neutral-400 leading-relaxed">${escapeHtml(props.description)}</p>
      </div>
    </div>

    <div class="flex-1 min-h-0 flex p-16 bg-gray-950">
      <div class="flex flex-1 rounded-xl overflow-hidden border border-gray-800">

        <div class="flex flex-col flex-1 min-w-0 border-r border-gray-800">
          <div class="flex-1 min-h-0 overflow-hidden bg-gray-900">
            <img
              src="${escapeHtml(screenshotSrc)}"
              alt="${escapeHtml(props.title)}"
              class="w-full h-full object-cover object-top"
            />
          </div>

          <div class="shrink-0 bg-gray-950 border-t border-gray-800 px-6 py-4">
            <p class="text-xs font-semibold uppercase tracking-wider text-gray-500 mb-2">What you're looking at</p>
            <div class="text-sm text-gray-400 leading-relaxed prose prose-sm prose-invert max-w-none">
              ${props.bodyHtml ?? ''}
            </div>
          </div>
        </div>

        <div class="shrink-0 w-60 flex flex-col bg-gray-950 px-5 py-5">
          <p class="text-xs font-semibold uppercase tracking-wider text-gray-500 mb-4 shrink-0">Steps</p>
          <ol class="flex flex-col flex-1 justify-between list-none p-0 m-0">
            ${steps.map((step, i) => `
              <li class="flex items-start gap-3">
                <div class="flex flex-col items-center shrink-0">
                  <span class="flex items-center justify-center w-6 h-6 rounded-full border border-indigo-500/40 bg-indigo-500/10 text-indigo-400 text-xs font-bold leading-none">
                    ${i + 1}
                  </span>
                  ${i < steps.length - 1 ? `<div class="w-px flex-1 bg-gray-800 mt-1 min-h-[12px]"></div>` : ''}
                </div>
                <span class="text-sm text-gray-300 leading-snug pt-0.5">${escapeHtml(step)}</span>
              </li>`).join('')}
          </ol>
        </div>

      </div>
    </div>
  </div>

${renderBottomNav(props)}`;
}
