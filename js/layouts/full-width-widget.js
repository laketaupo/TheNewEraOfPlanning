// Port of src/layouts/FullWidthWidgetLayout.astro — widget-focused layout with a compact header
// strip (not a tall hero) so the interactive simulation is the visual focus, plus a secondary
// narrower prose section below. Registry key is `full-widget` (see layout-registry.js) even
// though this file is named full-width-widget.js.
import { escapeHtml } from '../markdown.js';
import { getColors, renderTopHeader, renderBottomNav, renderChapterMeta, themeFilter } from './shared.js';

export function render(props) {
  const { accentColor, accentSubtle, badgeBgClass, dotColorClass } = getColors(props.chapterColor);
  const hasWidget = !!(props.widget && props.widget !== '');

  return `
${renderTopHeader(props)}

  <main
    class="min-h-screen pt-12 pb-32"
    style="--accent: ${accentColor}; --accent-subtle: ${accentSubtle};"
    data-pagefind-body
    data-pagefind-filter="${themeFilter(props)}"
  >
    ${renderChapterMeta(props)}

    <!-- Compact header strip (no tall hero — widget is the focus) -->
    <div class="bg-gray-50 dark:bg-neutral-950 border-b border-gray-100 dark:border-neutral-800">
      <div class="relative h-[3px]" style="background: linear-gradient(90deg, ${accentColor}, ${accentColor}44 60%, transparent)"></div>
      <div class="max-w-7xl mx-auto px-6 py-4 flex flex-wrap items-center gap-4">
        <div class="inline-flex items-center gap-2 text-xs font-medium border rounded-full px-3 py-1 shrink-0 ${badgeBgClass}">
          <span class="w-1.5 h-1.5 rounded-full ${dotColorClass}"></span>
          ${escapeHtml(props.chapterTitle)} · Topic ${escapeHtml(props.topicOrder)}
        </div>
        <div>
          <h1 class="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white leading-tight">${escapeHtml(props.title)}</h1>
          <p class="text-sm text-gray-500 dark:text-neutral-400 mt-0.5">${escapeHtml(props.description)}</p>
        </div>
      </div>
    </div>

    ${hasWidget ? `
    <div class="bg-gray-50 dark:bg-neutral-900 border-b border-gray-100 dark:border-neutral-800">
      <div class="max-w-7xl mx-auto px-6 py-10">
        ${props.widgetHtml ?? ''}
      </div>
    </div>` : ''}

    <div class="bg-gray-50 dark:bg-neutral-950">
      <article class="max-w-3xl mx-auto px-6 pt-6 pb-12">
        <div class="topic-prose prose prose-gray dark:prose-invert prose-lg max-w-none
          prose-headings:font-bold prose-headings:tracking-tight
          prose-p:leading-[1.85] prose-p:text-gray-700 dark:prose-p:text-gray-300
          prose-li:text-gray-700 dark:prose-li:text-gray-300
          prose-a:text-indigo-600 dark:prose-a:text-indigo-400 prose-a:no-underline hover:prose-a:underline prose-a:font-medium
          prose-strong:text-gray-900 dark:prose-strong:text-white prose-strong:font-semibold">
          ${props.bodyHtml ?? ''}
        </div>
      </article>
    </div>
  </main>

${renderBottomNav(props)}

  <style>
    .topic-prose h2 {
      font-size: 1.5rem;
      font-weight: 700;
      color: #111827;
      margin-top: 3.5rem;
      margin-bottom: 1rem;
      padding-bottom: 0.875rem;
      border-bottom: 1px solid #e5e7eb;
      position: relative;
    }
    .topic-prose h2::after {
      content: '';
      position: absolute;
      left: 0;
      bottom: -1px;
      width: 2.5rem;
      height: 2px;
      background: var(--accent, #6366f1);
      border-radius: 9999px;
    }
    .dark .topic-prose h2 {
      color: #f9fafb;
      border-bottom-color: rgba(255,255,255,0.08);
    }
    .topic-prose h3 {
      font-size: 1.0625rem;
      font-weight: 600;
      color: #444444;
      margin-top: 2.25rem;
      margin-bottom: 0.625rem;
      padding-left: 0.875rem;
      border-left: 2px solid var(--accent, #6366f1);
    }
    .dark .topic-prose h3 { color: #f3f4f6; }
    .topic-prose blockquote {
      background: var(--accent-subtle, rgba(99,102,241,0.07));
      border: 1px solid rgba(0,0,0,0.06);
      border-left: 4px solid var(--accent, #6366f1);
      border-radius: 0.75rem;
      padding: 1.25rem 1.5rem;
      font-style: normal;
      color: #374151;
      margin-left: 0;
      margin-right: 0;
    }
    .dark .topic-prose blockquote {
      border-color: rgba(255,255,255,0.06);
      border-left-color: var(--accent, #818cf8);
      color: #d1d5db;
    }
    .topic-prose blockquote p { margin: 0; font-size: 0.9375rem; line-height: 1.75; }
    .topic-prose ul > li::marker { color: var(--accent, #6366f1); }
    .topic-prose ol > li::marker { color: var(--accent, #6366f1); font-weight: 700; }
    .topic-prose strong { font-weight: 700; color: #111827; }
    .dark .topic-prose strong { color: #f9fafb; }
  </style>`;
}
