// Port of src/pages/glossary.astro for the build-free SPA.
// Static route (no params). validateGlossary() is intentionally not ported here — see
// js/lib/glossary.js header comment: that check now lives in scripts/validate-refs.mjs
// and runs at content-index generation time, not in the browser.
import { url } from '../base-url.js';
import { escapeHtml } from '../markdown.js';
import { getGlossaryTerms } from '../lib/glossary.js';
import { getTopics } from '../lib/chapters.js';

function pageHeader() {
  return `
    <header class="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 py-3">
      <div class="flex items-center gap-3">
        <a href="${url('')}" title="Home" class="flex h-5 items-center text-gray-500 dark:text-neutral-400 hover:text-gray-900 dark:hover:text-white transition-colors">
          <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"/>
          </svg>
        </a>
        <a href="${url('')}" class="flex items-center gap-1.5 text-sm text-gray-500 dark:text-neutral-400 hover:text-gray-900 dark:hover:text-white transition-colors">
          <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"/>
          </svg>
          The New Era of Planning
        </a>
      </div>
    </header>`;
}

function tabBar(active) {
  const glossaryClasses = active === 'glossary'
    ? 'px-4 py-2 text-sm font-semibold text-indigo-600 dark:text-indigo-400 border-b-2 border-indigo-600 dark:border-indigo-400 -mb-px'
    : 'px-4 py-2 text-sm font-semibold text-gray-400 dark:text-neutral-500 hover:text-gray-700 dark:hover:text-neutral-300 transition-colors';
  const faqClasses = active === 'faq'
    ? 'px-4 py-2 text-sm font-semibold text-indigo-600 dark:text-indigo-400 border-b-2 border-indigo-600 dark:border-indigo-400 -mb-px'
    : 'px-4 py-2 text-sm font-semibold text-gray-400 dark:text-neutral-500 hover:text-gray-700 dark:hover:text-neutral-300 transition-colors';
  return `
    <div class="flex gap-1 mb-8 border-b border-gray-100 dark:border-neutral-800">
      <a href="${url('glossary')}" ${active === 'glossary' ? 'aria-current="page"' : ''} class="${glossaryClasses}">Glossary</a>
      <a href="${url('faq')}" ${active === 'faq' ? 'aria-current="page"' : ''} class="${faqClasses}">FAQ</a>
    </div>`;
}

export async function render() {
  const terms = [...getGlossaryTerms()].sort((a, b) => a.term.localeCompare(b.term));
  const topics = getTopics();
  const topicMap = Object.fromEntries(topics.map((t) => [`${t.chapterSlug}/${t.slug}`, t]));

  const letters = [...new Set(terms.map((t) => t.term[0].toUpperCase()))].sort();

  const jumpNav = letters.map((letter) => `
    <a href="#letter-${escapeHtml(letter)}" class="w-7 h-7 flex items-center justify-center rounded text-xs font-semibold text-gray-500 dark:text-neutral-400 hover:bg-indigo-50 dark:hover:bg-indigo-500/10 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">${escapeHtml(letter)}</a>`).join('');

  const sections = letters.map((letter) => {
    const group = terms.filter((t) => t.term[0].toUpperCase() === letter);
    const items = group.map((term) => {
      const seeAlsoTopics = term.seeAlso.map((ref) => topicMap[ref]).filter(Boolean);
      const relatedTerms = term.related.map((slug) => terms.find((t) => t.slug === slug)).filter(Boolean);

      const seeAlsoHtml = seeAlsoTopics.length > 0 ? `
        <p class="text-xs text-gray-400 dark:text-neutral-600">
          See: ${seeAlsoTopics.map((t, i) => `<a href="${url(t.url)}" class="text-indigo-600 dark:text-indigo-400 hover:underline">${escapeHtml(t.title)}</a>${i < seeAlsoTopics.length - 1 ? ', ' : ''}`).join('')}
        </p>` : '';

      const relatedHtml = relatedTerms.length > 0 ? `
        <p class="text-xs text-gray-400 dark:text-neutral-600 mt-0.5">
          Related: ${relatedTerms.map((t, i) => `<a href="#${escapeHtml(t.slug)}" class="text-indigo-600 dark:text-indigo-400 hover:underline">${escapeHtml(t.term)}</a>${i < relatedTerms.length - 1 ? ', ' : ''}`).join('')}
        </p>` : '';

      return `
        <div id="${escapeHtml(term.slug)}" class="scroll-mt-20">
          <dt class="text-base font-semibold text-gray-900 dark:text-white mb-1">${escapeHtml(term.term)}</dt>
          <dd class="text-sm text-gray-600 dark:text-neutral-400 leading-relaxed mb-2">${escapeHtml(term.definition)}</dd>
          ${seeAlsoHtml}
          ${relatedHtml}
        </div>`;
    }).join('');

    return `
      <section id="letter-${escapeHtml(letter)}" class="mb-10">
        <h2 class="text-xs font-bold uppercase tracking-widest text-gray-400 dark:text-neutral-600 mb-4 border-b border-gray-100 dark:border-neutral-800 pb-2">${escapeHtml(letter)}</h2>
        <dl class="space-y-6">${items}</dl>
      </section>`;
  }).join('');

  return `
    ${pageHeader()}
    <main class="max-w-3xl mx-auto px-6 pt-24 pb-32">
      <h1 class="text-3xl font-bold text-gray-900 dark:text-white mb-2">Glossary</h1>
      <p class="text-gray-500 dark:text-neutral-400 mb-4">${terms.length} planning terms defined.</p>

      ${tabBar('glossary')}

      <nav class="flex flex-wrap gap-1.5 mb-10" aria-label="Jump to letter">${jumpNav}</nav>

      ${sections}
    </main>`;
}
