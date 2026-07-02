// Port of src/components/Search.astro. The original was powered by Pagefind, a build-time
// search index over compiled HTML. Pagefind is dropped entirely in the vanilla SPA: instead we
// fetch a small precompiled data/search-index.json (see scripts/gen-search-index.mjs) — an array
// of {url, title, description, text} covering topics, FAQ entries, and configuration-manual
// entries — and do simple client-side substring matching against it on each keystroke.
//
// Fixed-chrome shell module (CONTRACTS.md §4b): mountSearch(container) is called exactly once
// at boot by js/app.js. It builds the modal DOM, appends it to `container`, and exposes
// window.openSearch() for the fixed icon bar's inline onclick + the `/` keyboard shortcut.
import { url } from '../base-url.js';
import { escapeHtml } from '../markdown.js';
import { loadSearchIndex } from '../content.js';

const MAX_RESULTS = 20;
const DEBOUNCE_MS = 120;

let modalEl = null;
let inputEl = null;
let resultsEl = null;
let indexPromise = null;
let debounceTimer = null;

/** Simple relevance ranking: exact/prefix title match first, then title/description/text contains. */
function scoreItem(item, q) {
  const title = (item.title || '').toLowerCase();
  const description = (item.description || '').toLowerCase();
  const text = (item.text || '').toLowerCase();
  if (title === q) return 5;
  if (title.startsWith(q)) return 4;
  if (title.includes(q)) return 3;
  if (description.includes(q)) return 2;
  if (text.includes(q)) return 1;
  return 0;
}

function renderResults(items, q) {
  if (items.length === 0) {
    resultsEl.innerHTML = `<p class="px-4 py-10 text-center text-sm text-gray-500 dark:text-neutral-400">No results for &ldquo;${escapeHtml(q)}&rdquo;</p>`;
    return;
  }
  // SECURITY: item.title/description come from a runtime-fetched JSON file (content-derived,
  // not authored here) — must be escaped before this innerHTML assignment (CONTRACTS.md §6).
  resultsEl.innerHTML = items
    .map(
      (item) => `
      <a href="${url(item.url)}" class="block rounded-xl px-4 py-2.5 hover:bg-indigo-50 dark:hover:bg-indigo-900/25">
        <p class="text-[15px] font-semibold text-gray-900 dark:text-white">${escapeHtml(item.title || '')}</p>
        ${item.description ? `<p class="text-[13px] text-gray-500 dark:text-neutral-400 leading-snug mt-0.5">${escapeHtml(item.description)}</p>` : ''}
      </a>`
    )
    .join('');
}

async function runQuery(raw) {
  const q = (raw || '').trim().toLowerCase();
  if (q.length < 2) {
    resultsEl.innerHTML = '';
    return;
  }
  if (!indexPromise) indexPromise = loadSearchIndex();
  let items;
  try {
    items = await indexPromise;
  } catch (err) {
    console.error('Failed to load search index', err);
    resultsEl.innerHTML = '<p class="px-4 py-10 text-center text-sm text-gray-500 dark:text-neutral-400">Search is unavailable.</p>';
    return;
  }
  const results = items
    .map((item) => ({ item, s: scoreItem(item, q) }))
    .filter((x) => x.s > 0)
    .sort((a, b) => b.s - a.s)
    .slice(0, MAX_RESULTS)
    .map((x) => x.item);
  renderResults(results, q);
}

function openModal() {
  if (!modalEl.open) modalEl.showModal();
  inputEl.value = '';
  resultsEl.innerHTML = '';
  inputEl.focus();
}

function closeModal() {
  if (modalEl.open) modalEl.close();
}

export function mountSearch(container) {
  const wrap = document.createElement('div');
  wrap.innerHTML = `
    <dialog
      id="search-modal"
      class="fixed inset-0 z-200 w-full h-full m-0 max-w-none max-h-none bg-black/60 backdrop-blur-sm p-4"
    >
      <div class="relative w-full max-w-[760px] bg-white dark:bg-neutral-900 rounded-2xl shadow-2xl border border-gray-200 dark:border-neutral-700 overflow-hidden">
        <span class="pointer-events-none absolute right-3 top-3 z-10 rounded-md border border-b-2 border-gray-200 dark:border-neutral-700 bg-gray-50 dark:bg-neutral-800 px-2 py-1 text-[11px] font-semibold text-gray-400 dark:text-neutral-500">ESC</span>
        <div class="relative px-4 pt-4 pb-2">
          <svg xmlns="http://www.w3.org/2000/svg" class="pointer-events-none absolute left-8 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 dark:text-neutral-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
            <path stroke-linecap="round" stroke-linejoin="round" d="M21 21l-4.35-4.35M17 11A6 6 0 1 1 5 11a6 6 0 0 1 12 0z"/>
          </svg>
          <input
            id="search-input"
            type="text"
            autocomplete="off"
            spellcheck="false"
            placeholder="Search topics, chapters, concepts…"
            class="w-full rounded-xl border border-gray-200 dark:border-neutral-700 bg-transparent py-3 pl-11 pr-20 text-[18px] text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-neutral-500 focus:outline-none"
          />
        </div>
        <div id="search-results" class="max-h-[50vh] overflow-y-auto px-2 pb-2"></div>
        <div class="flex items-center gap-4 border-t border-gray-100 dark:border-neutral-800 bg-gray-50 dark:bg-neutral-950 px-4 py-2.5 text-xs text-gray-400 dark:text-neutral-500">
          <span class="flex items-center gap-1.5">
            <kbd class="rounded border border-b-2 border-gray-200 dark:border-neutral-700 bg-white dark:bg-neutral-800 px-1.5 py-0.5 font-semibold">esc</kbd>
            to close
          </span>
        </div>
      </div>
    </dialog>
  `;
  const modal = wrap.firstElementChild;
  container.appendChild(modal);

  // <dialog> is display:none by default per the UA stylesheet, but only while no author-origin
  // rule sets `display` on it unconditionally — author styles always beat UA styles regardless of
  // specificity, so a bare `flex` utility class on the dialog itself would defeat the native
  // hidden-until-shown behavior entirely (confirmed: this broke the port initially). Gate the
  // flex layout behind `[open]`, exactly like the original Search.astro's scoped CSS did.
  const style = document.createElement('style');
  style.textContent = `
    #search-modal { display: none; }
    #search-modal[open] { display: flex; align-items: flex-start; justify-content: center; padding-top: 15vh; }
  `;
  container.appendChild(style);

  modalEl = modal;
  inputEl = modal.querySelector('#search-input');
  resultsEl = modal.querySelector('#search-results');

  inputEl.addEventListener('input', () => {
    clearTimeout(debounceTimer);
    const val = inputEl.value;
    debounceTimer = setTimeout(() => runQuery(val), DEBOUNCE_MS);
  });

  // Click on the backdrop (the <dialog> element itself, outside the inner panel) closes it.
  modal.addEventListener('click', (e) => {
    if (e.target === modal) closeModal();
  });

  document.addEventListener('keydown', (e) => {
    const t = e.target;
    const inField = t && (t.tagName === 'INPUT' || t.tagName === 'TEXTAREA' || t.isContentEditable);
    if ((e.key === 'k' && (e.metaKey || e.ctrlKey)) || (e.key === '/' && !inField)) {
      e.preventDefault();
      openModal();
    } else if (e.key === 'Escape') {
      closeModal();
    }
  });

  window.openSearch = openModal;
}
