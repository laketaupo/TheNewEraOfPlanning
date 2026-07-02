// Port of src/pages/faq.astro for the build-free SPA.
// Static route (no params). validateFaq() is intentionally not ported here — see
// js/lib/faq.js header comment: that check now lives in scripts/validate-refs.mjs
// and runs at content-index generation time, not in the browser.
//
// The original page's inline <script> (text-filter behavior) is ported into afterMount()
// instead of a literal <script> tag — script tags assigned via innerHTML never execute.
import { url } from '../base-url.js';
import { escapeHtml } from '../markdown.js';
import { getFaqEntries } from '../lib/faq.js';
import { getTopics } from '../lib/chapters.js';
import { getGlossaryTerms } from '../lib/glossary.js';

const THEME_ORDER = ['technology', 'process', 'data', 'people'];
const THEME_LABELS = {
  technology: 'Technology',
  process: 'Process',
  data: 'Data',
  people: 'People',
};

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
  const entries = getFaqEntries();
  const topics = getTopics();
  const glossaryTerms = getGlossaryTerms();
  const topicMap = Object.fromEntries(topics.map((t) => [`${t.chapterSlug}/${t.slug}`, t]));
  const glossaryMap = Object.fromEntries(glossaryTerms.map((t) => [t.slug, t]));

  const themesWithEntries = THEME_ORDER.filter((p) => entries.some((e) => e.theme === p));

  const jumpNav = themesWithEntries.map((theme) => `
    <a href="#theme-${escapeHtml(theme)}" class="px-3 h-7 flex items-center justify-center rounded text-xs font-semibold text-gray-500 dark:text-neutral-400 hover:bg-indigo-50 dark:hover:bg-indigo-500/10 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">${escapeHtml(THEME_LABELS[theme])}</a>`).join('');

  const sections = THEME_ORDER.map((theme) => {
    const group = entries.filter((e) => e.theme === theme);
    if (group.length === 0) return '';

    const items = group.map((entry) => {
      const seeAlsoTopics = entry.seeAlso.map((ref) => topicMap[ref]).filter(Boolean);
      const relatedTerms = entry.related.map((slug) => glossaryMap[slug]).filter(Boolean);
      const searchText = `${entry.question} ${entry.answer}`.toLowerCase();

      const seeAlsoHtml = seeAlsoTopics.length > 0 ? `
        <p class="text-xs text-gray-400 dark:text-neutral-600">
          See: ${seeAlsoTopics.map((t, i) => `<a href="${url(t.url)}" class="text-indigo-600 dark:text-indigo-400 hover:underline">${escapeHtml(t.title)}</a>${i < seeAlsoTopics.length - 1 ? ', ' : ''}`).join('')}
        </p>` : '';

      const relatedHtml = relatedTerms.length > 0 ? `
        <p class="text-xs text-gray-400 dark:text-neutral-600 mt-0.5">
          Related: ${relatedTerms.map((t, i) => `<a href="${url('glossary')}#${escapeHtml(t.slug)}" class="text-indigo-600 dark:text-indigo-400 hover:underline">${escapeHtml(t.term)}</a>${i < relatedTerms.length - 1 ? ', ' : ''}`).join('')}
        </p>` : '';

      return `
        <div id="${escapeHtml(entry.slug)}" class="scroll-mt-20 faq-entry" data-search="${escapeHtml(searchText)}">
          <dt class="text-base font-semibold text-gray-900 dark:text-white mb-1">${escapeHtml(entry.question)}</dt>
          <dd class="text-sm text-gray-600 dark:text-neutral-400 leading-relaxed mb-2">${escapeHtml(entry.answer)}</dd>
          ${seeAlsoHtml}
          ${relatedHtml}
        </div>`;
    }).join('');

    return `
      <section id="theme-${escapeHtml(theme)}" class="mb-10 faq-section">
        <h2 class="text-xs font-bold uppercase tracking-widest text-gray-400 dark:text-neutral-600 mb-4 border-b border-gray-100 dark:border-neutral-800 pb-2">${escapeHtml(THEME_LABELS[theme])}</h2>
        <dl class="space-y-6">${items}</dl>
      </section>`;
  }).join('');

  return `
    ${pageHeader()}
    <main class="max-w-3xl mx-auto px-6 pt-24 pb-32">
      <h1 class="text-3xl font-bold text-gray-900 dark:text-white mb-2">Frequently Asked Questions</h1>
      <p class="text-gray-500 dark:text-neutral-400 mb-4">${entries.length} questions across ${themesWithEntries.length} pillars.</p>

      ${tabBar('faq')}

      <div class="mb-8">
        <input
          id="faq-filter"
          type="search"
          placeholder="Filter questions…"
          class="w-full rounded-lg border border-gray-200 dark:border-neutral-700 bg-white dark:bg-neutral-900 px-4 py-2 text-sm text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-neutral-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400"
        />
      </div>

      <nav class="flex flex-wrap gap-1.5 mb-10" aria-label="Jump to pillar">${jumpNav}</nav>

      <p id="faq-empty" class="hidden text-sm text-gray-400 dark:text-neutral-500 text-center py-10">No questions matched.</p>

      ${sections}
    </main>`;
}

export async function afterMount(root) {
  const input = root.querySelector('#faq-filter');
  const empty = root.querySelector('#faq-empty');
  const sections = root.querySelectorAll('.faq-section');
  if (!input || !empty) return;

  function runFilter() {
    const query = input.value.toLowerCase().trim();
    let totalVisible = 0;

    sections.forEach((section) => {
      const entries = section.querySelectorAll('.faq-entry');
      let sectionVisible = 0;

      entries.forEach((entry) => {
        const text = entry.dataset.search ?? '';
        const matches = !query || text.includes(query);
        entry.style.display = matches ? '' : 'none';
        if (matches) sectionVisible++;
      });

      section.style.display = sectionVisible > 0 ? '' : 'none';
      totalVisible += sectionVisible;
    });

    empty.classList.toggle('hidden', totalVisible > 0);
  }

  input.addEventListener('input', runFilter);
  input.addEventListener('search', runFilter);
}
