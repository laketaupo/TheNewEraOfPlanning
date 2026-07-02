// Port of src/pages/technology/configuration/index.astro for the build-free SPA.
// Static route (no params). scripts/gen-content-index.mjs already compiled + sanitized each
// entry's markdown body into `body` HTML and sorted entries by `order` (see js/lib/configuration.js),
// so `entry.body` is interpolated directly — it is already DOMPurify-sanitized, never re-escaped.
import { url } from '../base-url.js';
import { escapeHtml } from '../markdown.js';
import { getConfigurationEntries } from '../lib/configuration.js';

function entryHtml(entry, index, total) {
  const description = entry.description
    ? `<p class="text-sm text-gray-500 dark:text-neutral-400 mt-1">${escapeHtml(entry.description)}</p>`
    : '';

  const screenshot = entry.screenshot
    ? `
      <div class="rounded-xl overflow-hidden border border-gray-200 dark:border-neutral-700 mb-6 shadow-sm">
        <img src="${url(entry.screenshot)}" alt="Screenshot: ${escapeHtml(entry.title)}" class="w-full h-auto" loading="lazy" />
      </div>`
    : `
      <div class="flex flex-col items-center justify-center rounded-xl border-2 border-dashed border-gray-200 dark:border-neutral-700 bg-gray-50 dark:bg-neutral-900 py-16 text-center mb-6">
        <svg xmlns="http://www.w3.org/2000/svg" class="w-8 h-8 text-gray-300 dark:text-neutral-600 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"/>
        </svg>
        <span class="text-sm text-gray-400 dark:text-neutral-500">Screenshot coming soon</span>
      </div>`;

  const body = entry.body ? `<div class="config-prose prose prose-gray dark:prose-invert max-w-none">${entry.body}</div>` : '';
  const divider = index < total - 1 ? '<div class="mt-16 border-t border-gray-100 dark:border-neutral-800"></div>' : '';

  return `
    <div class="entry">
      <div class="flex items-start gap-4 mb-6">
        <span class="text-xs font-mono font-bold text-blue-500 dark:text-blue-400 shrink-0 mt-1">${String(index + 1).padStart(2, '0')}</span>
        <div>
          <h2 class="text-xl font-bold text-gray-900 dark:text-white leading-snug">${escapeHtml(entry.title)}</h2>
          ${description}
        </div>
      </div>
      ${screenshot}
      ${body}
      ${divider}
    </div>`;
}

export async function render() {
  const entries = getConfigurationEntries();

  const entriesHtml = entries.length === 0
    ? `
      <div class="text-center py-20 text-gray-400 dark:text-neutral-600">
        <p class="text-lg">No entries yet. Add Markdown files to <code class="text-sm bg-gray-100 dark:bg-neutral-800 px-1.5 py-0.5 rounded">content/configuration/</code>.</p>
      </div>`
    : `<div class="space-y-16">${entries.map((entry, i) => entryHtml(entry, i, entries.length)).join('')}</div>`;

  return `
    <header class="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-4 py-3">
      <div class="flex items-center gap-3">
        <a href="${url('')}" title="Home" class="flex h-5 items-center text-gray-500 dark:text-neutral-400 hover:text-gray-900 dark:hover:text-white transition-colors">
          <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"/>
          </svg>
        </a>
        <a href="${url('technology')}" class="flex items-center gap-1.5 text-sm text-gray-500 dark:text-neutral-400 hover:text-gray-900 dark:hover:text-white transition-colors">
          <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"/>
          </svg>
          Technology
        </a>
      </div>
    </header>

    <div class="relative overflow-hidden pt-12">
      <div class="absolute inset-0 bg-[linear-gradient(to_right,#e5e7eb_1px,transparent_1px),linear-gradient(to_bottom,#e5e7eb_1px,transparent_1px)] dark:bg-[linear-gradient(to_right,#444444_1px,transparent_1px),linear-gradient(to_bottom,#444444_1px,transparent_1px)] bg-size-[64px_64px] opacity-60 dark:opacity-40 pointer-events-none"></div>
      <div class="absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_-20%,rgba(59,130,246,0.08),transparent)] dark:bg-[radial-gradient(ellipse_80%_50%_at_50%_-20%,rgba(59,130,246,0.15),transparent)] pointer-events-none"></div>

      <div class="relative z-10 px-6 pt-12 pb-12 max-w-3xl mx-auto text-center animate-fade-in">
        <div class="inline-flex items-center gap-2 text-xs font-medium text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-500/10 border border-blue-200 dark:border-blue-500/30 rounded-full px-3 py-1 mb-6">
          <span class="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse"></span>
          Configuration Manual
        </div>
        <h1 class="text-4xl sm:text-5xl font-bold text-gray-900 dark:text-white mb-4 leading-tight tracking-tight">
          Business Configuration
        </h1>
        <p class="text-lg text-gray-600 dark:text-neutral-400 max-w-lg mx-auto leading-relaxed">
          Step-by-step screenshots and explanations for configuring Planning software for your business.
        </p>
      </div>

      <div class="relative z-10 px-6 pb-24 max-w-3xl mx-auto">
        ${entriesHtml}
      </div>
    </div>

    <style>
      /* Plain CSS (not @apply) — this <style> tag is injected via innerHTML at runtime with no
         Tailwind/PostCSS pass over it, unlike the original Astro scoped <style> block. Scoped to
         .config-prose rather than the bare "prose" class so it can't leak onto other pages'
         prose bodies (topic.js/full-width-widget.js use their own .topic-prose class the same way). */
      .config-prose h1, .config-prose h2, .config-prose h3 { color: #111827; }
      .dark .config-prose h1, .dark .config-prose h2, .dark .config-prose h3 { color: #ffffff; }
      .config-prose p, .config-prose li { color: #4b5563; }
      .dark .config-prose p, .dark .config-prose li { color: #d4d4d4; }
      .config-prose strong { color: #111827; }
      .dark .config-prose strong { color: #ffffff; }
      .config-prose code {
        background: #f3f4f6;
        border-radius: 0.25rem;
        padding: 0.125rem 0.25rem;
        font-size: 0.875rem;
      }
      .dark .config-prose code { background: #363636; }
    </style>`;
}
