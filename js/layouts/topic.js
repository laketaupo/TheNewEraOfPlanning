// Port of src/layouts/TopicLayout.astro (the default/fallback layout — `undefined` topicLayout
// falls through to this in layout-registry.js). Renders prose body content (`bodyHtml`) plus an
// optional widget slot (`widgetHtml`) above it.
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

    <!-- Hero: landing-page treatment -->
    <div class="bg-gray-50 dark:bg-neutral-950 border-b border-gray-100 dark:border-neutral-800">
      <div class="h-[3px]" style="background: linear-gradient(90deg, ${accentColor}, ${accentColor}44 60%, transparent)"></div>

      <div class="max-w-3xl mx-auto px-6 pt-6 pb-7 animate-fade-in">
        <div class="inline-flex items-center gap-2 text-xs font-medium border rounded-full px-3 py-1 mb-3 ${badgeBgClass}">
          <span class="w-1.5 h-1.5 rounded-full animate-pulse ${dotColorClass}"></span>
          ${escapeHtml(props.chapterTitle)} · Topic ${escapeHtml(props.topicOrder)}
        </div>

        <h1 class="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-2 leading-tight tracking-tight">${escapeHtml(props.title)}</h1>

        <p class="text-sm text-gray-600 dark:text-neutral-400 leading-relaxed max-w-2xl">${escapeHtml(props.description)}</p>
      </div>
    </div>

    ${hasWidget ? `
    <div class="bg-gray-50 dark:bg-neutral-950 border-b border-gray-100 dark:border-neutral-800">
      <div class="max-w-7xl mx-auto px-6 py-10">
        ${props.widgetHtml ?? ''}
      </div>
    </div>` : ''}

    <div class="bg-gray-50 dark:bg-neutral-950">
      <article class="max-w-3xl mx-auto px-6 pt-6 pb-14 animate-slide-up">
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
    /* ── H2: bottom-border section break with accent underline ── */
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

    /* ── H3: left accent bar ── */
    .topic-prose h3 {
      font-size: 1.0625rem;
      font-weight: 600;
      color: #444444;
      margin-top: 2.25rem;
      margin-bottom: 0.625rem;
      padding-left: 0.875rem;
      border-left: 2px solid var(--accent, #6366f1);
    }
    .dark .topic-prose h3 {
      color: #f3f4f6;
    }

    /* ── Blockquote: chapter card style ── */
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
    .topic-prose blockquote p {
      margin: 0;
      font-size: 0.9375rem;
      line-height: 1.75;
    }

    /* ── Inline code ── */
    .topic-prose code:not(pre code) {
      background: rgba(0,0,0,0.04);
      color: var(--accent, #6366f1);
      padding: 0.15em 0.45em;
      border-radius: 0.375rem;
      font-size: 0.85em;
      font-weight: 500;
      border: 1px solid rgba(0,0,0,0.07);
    }
    .dark .topic-prose code:not(pre code) {
      background: rgba(255,255,255,0.06);
      border-color: rgba(255,255,255,0.1);
    }

    /* ── Code blocks ── */
    .topic-prose pre {
      background: #1e1e2e !important;
      border: none !important;
      border-radius: 0.875rem !important;
      padding: 1.5rem !important;
      box-shadow: 0 4px 24px rgba(0,0,0,0.15) !important;
    }
    .topic-prose pre code {
      background: none !important;
      border: none !important;
      color: #cdd6f4;
      font-size: 0.875em;
      padding: 0 !important;
    }

    /* ── Table ── */
    .topic-prose table {
      width: 100%;
      border-collapse: separate;
      border-spacing: 0;
      border-radius: 0.875rem;
      overflow: hidden;
      border: 1px solid #e5e7eb;
      box-shadow: 0 1px 4px rgba(0,0,0,0.05);
      font-size: 0.9375rem;
    }
    .dark .topic-prose table {
      border-color: rgba(255,255,255,0.08);
      box-shadow: none;
    }
    .topic-prose thead {
      background: #f9fafb;
    }
    .dark .topic-prose thead {
      background: #444444;
    }
    .topic-prose th {
      font-weight: 600;
      text-align: left;
      padding: 0.75rem 1.125rem;
      font-size: 0.75rem;
      text-transform: uppercase;
      letter-spacing: 0.06em;
      color: #6b7280;
      border-bottom: 1px solid #e5e7eb;
    }
    .dark .topic-prose th {
      color: #9ca3af;
      border-bottom-color: rgba(255,255,255,0.08);
    }
    .topic-prose td {
      padding: 0.75rem 1.125rem;
      border-top: 1px solid #f3f4f6;
      line-height: 1.6;
    }
    .dark .topic-prose td {
      border-top-color: rgba(255,255,255,0.04);
    }
    .topic-prose tbody tr:nth-child(even) {
      background: #fafafa;
    }
    .dark .topic-prose tbody tr:nth-child(even) {
      background: rgba(255,255,255,0.02);
    }
    .topic-prose tbody tr:hover {
      background: var(--accent-subtle, rgba(99,102,241,0.05));
    }

    /* ── HR ── */
    .topic-prose hr {
      border: none;
      height: 1px;
      background: linear-gradient(90deg, transparent, #e5e7eb 20%, #e5e7eb 80%, transparent);
      margin: 2.5rem 0;
    }
    .dark .topic-prose hr {
      background: linear-gradient(90deg, transparent, rgba(255,255,255,0.08) 20%, rgba(255,255,255,0.08) 80%, transparent);
    }

    /* ── List markers ── */
    .topic-prose ul > li {
      padding-left: 0.25rem;
    }
    .topic-prose ul > li::marker {
      color: var(--accent, #6366f1);
    }
    .topic-prose ol > li::marker {
      color: var(--accent, #6366f1);
      font-weight: 700;
    }

    /* ── Strong ── */
    .topic-prose strong {
      font-weight: 700;
      color: #111827;
    }
    .dark .topic-prose strong {
      color: #f9fafb;
    }
  </style>`;
}
