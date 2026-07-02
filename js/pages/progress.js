// Port of src/pages/progress.astro for the build-free SPA.
//
// The original page renders <UserDashboard standalone={true} /> — a large, stateful Astro
// component (role selector, notes tab, session-only state filter, collapsible tree with live
// counts) that lives at src/components/UserDashboard.astro. js/shell/user-dashboard.js (the
// fixed-chrome flyout panel port of that same component, mounted once by app.js per CONTRACTS.md
// §4b) is being written in parallel by another agent and does not exist yet in this checkout, so
// there is nothing importable to reuse: no `js/shell/user-dashboard.js` file, and therefore no
// confirmed exported render/stats function. Per the task brief's documented fallback, this page
// is self-contained: it reads `platform-progress` / `platform-comments` from localStorage
// directly and renders its own theme -> module -> chapter -> topic tree with overall stats,
// per-chapter completion bars, and state filter tiles — the behaviour CLAUDE.md's own "Client-
// Side Persistence" section describes for the dashboard ("per-chapter completion bars, overall
// stats, and a list of topics marked unclear"), rather than reproducing every feature of the
// original component (role selector, notes tab) from scratch, unverified, against a module that
// doesn't exist yet.
import { url } from '../base-url.js';
import { escapeHtml } from '../markdown.js';
import { getChapters, getTopics } from '../lib/chapters.js';

const STORAGE_KEY = 'platform-progress';
const COMMENTS_KEY = 'platform-comments';

const THEME_LABELS = {
  technology: 'Technology',
  process: 'Process',
  data: 'Data',
  people: 'People',
};

const MODULE_LABELS = {
  'planning-software': 'Planning Software',
  'erp': 'ERP',
  'tool-landscape': 'Tool Landscape & Architecture',
  'supporting-systems': 'Supporting Systems',
  'adoption-and-usage-quality': 'Adoption & Usage Quality',
  'data-foundations': 'Data Foundations',
  'planning-data-domains': 'Planning Data Domains',
  'planning-parameters-and-assumptions': 'Planning Parameters & Assumptions',
  'performance-and-measurement': 'Performance & Measurement',
  'data-quality-and-governance': 'Data Quality & Governance',
  'planning-fundamentals': 'Planning Fundamentals',
  'planning-governance': 'Planning Cycles & Governance',
  'planning-cycles-and-governance': 'Planning Cycles & Governance',
  sop: 'S&OP',
  soe: 'S&OE',
  execution: 'Execution',
  'advanced-planning': 'Advanced Planning',
  'roles-and-responsibilities': 'Roles & Responsibilities',
  'decision-making-and-ownership': 'Decision Making & Ownership',
  'collaboration-and-ways-of-working': 'Collaboration & Ways of Working',
  'capabilities-and-skills': 'Capabilities & Skills',
};

function getProgress() {
  try {
    const raw = JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}');
    const result = {};
    for (const [k, v] of Object.entries(raw)) {
      if (v === 'complete' || v === 'unclear') result[k] = v;
      else if (v === true) result[k] = 'complete';
    }
    return result;
  } catch {
    return {};
  }
}

function getComments() {
  try {
    return JSON.parse(localStorage.getItem(COMMENTS_KEY) || '{}');
  } catch {
    return {};
  }
}

// theme -> [{ key: module, label, chapters: [{ slug, title, topics: [...] }] }]
function buildHierarchy() {
  const allChapters = getChapters().filter((c) => !c.hidden);
  const allTopics = getTopics();

  const themeOrder = [];
  const byTheme = new Map();

  for (const ch of allChapters) {
    const theme = ch.theme ?? 'technology';
    const mod = ch.module ?? 'planning-software';
    const topics = allTopics.filter((t) => t.chapterSlug === ch.slug).sort((a, b) => a.order - b.order);
    if (topics.length === 0) continue;

    if (!byTheme.has(theme)) {
      byTheme.set(theme, new Map());
      themeOrder.push(theme);
    }
    const byModule = byTheme.get(theme);
    if (!byModule.has(mod)) byModule.set(mod, []);
    byModule.get(mod).push({ slug: ch.slug, title: ch.title, topics });
  }

  return themeOrder.map((theme) => ({
    key: theme,
    label: THEME_LABELS[theme] ?? theme,
    modules: [...byTheme.get(theme).entries()].map(([modKey, chapters]) => ({
      key: modKey,
      label: MODULE_LABELS[modKey] ?? modKey,
      chapters,
    })),
  }));
}

function topicRow(topic, state, comment) {
  const dotClass = state === 'complete' ? 'bg-emerald-500' : state === 'unclear' ? 'bg-amber-400' : 'bg-gray-300 dark:bg-neutral-600';
  const noteHtml = state === 'unclear' && comment
    ? `<span class="block text-[11px] italic text-amber-600 dark:text-amber-400 truncate" title="${escapeHtml(comment)}">${escapeHtml(comment)}</span>`
    : '';
  return `
    <a href="${url(topic.url)}" data-topic-row data-topic-state="${state}" class="flex items-start gap-2 py-1 group">
      <span class="w-1.5 h-1.5 rounded-full ${dotClass} shrink-0 mt-1.5"></span>
      <span class="flex-1 min-w-0">
        <span class="block text-xs text-gray-600 dark:text-neutral-400 group-hover:text-gray-900 dark:group-hover:text-white leading-snug truncate">${escapeHtml(topic.title)}</span>
        ${noteHtml}
      </span>
    </a>`;
}

function chapterHtml(chapter, progress, comments) {
  const total = chapter.topics.length;
  const done = chapter.topics.filter((t) => progress[`${t.chapterSlug}/${t.slug}`] === 'complete').length;
  const unclear = chapter.topics.filter((t) => progress[`${t.chapterSlug}/${t.slug}`] === 'unclear').length;
  const rows = chapter.topics.map((t) => {
    const id = `${t.chapterSlug}/${t.slug}`;
    return topicRow(t, progress[id] ?? 'none', comments[id]);
  }).join('');

  return `
    <details data-chapter-node class="mb-1">
      <summary class="flex items-center gap-2 pl-4 pr-2 py-1.5 select-none rounded hover:bg-gray-50 dark:hover:bg-neutral-800/40 cursor-pointer">
        <svg xmlns="http://www.w3.org/2000/svg" class="w-2.5 h-2.5 shrink-0 text-gray-400 dark:text-neutral-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="9 18 15 12 9 6"/></svg>
        <span class="text-sm text-gray-700 dark:text-neutral-300 flex-1 truncate">${escapeHtml(chapter.title)}</span>
        <span class="text-xs text-gray-400 dark:text-neutral-500 tabular-nums shrink-0">${done}/${total}</span>
      </summary>
      <div class="h-1 mt-0.5 mb-1.5 ml-8 mr-2 bg-gray-100 dark:bg-neutral-800 rounded-full overflow-hidden flex">
        <div class="h-full bg-emerald-500" style="width: ${total > 0 ? (done / total) * 100 : 0}%"></div>
        <div class="h-full bg-amber-400" style="width: ${total > 0 ? (unclear / total) * 100 : 0}%"></div>
      </div>
      <div class="pl-8 pr-2 pb-2 space-y-0.5">${rows}</div>
    </details>`;
}

function moduleHtml(mod, progress, comments) {
  return `
    <div class="mb-3">
      <div class="text-[10px] font-bold uppercase tracking-widest text-gray-400 dark:text-neutral-500 mb-1 pl-1">${escapeHtml(mod.label)}</div>
      ${mod.chapters.map((ch) => chapterHtml(ch, progress, comments)).join('')}
    </div>`;
}

function themeHtml(theme, progress, comments) {
  return `
    <section class="mb-8">
      <h2 class="text-xs font-bold uppercase tracking-widest text-indigo-600 dark:text-indigo-400 mb-3 border-b border-gray-100 dark:border-neutral-800 pb-2">${escapeHtml(theme.label)}</h2>
      ${theme.modules.map((mod) => moduleHtml(mod, progress, comments)).join('')}
    </section>`;
}

export async function render() {
  const hierarchy = buildHierarchy();
  const allTopics = getTopics();
  const progress = getProgress();
  const comments = getComments();

  const total = allTopics.length;
  let completeCount = 0;
  let unclearCount = 0;
  for (const t of allTopics) {
    const state = progress[`${t.chapterSlug}/${t.slug}`];
    if (state === 'complete') completeCount++;
    else if (state === 'unclear') unclearCount++;
  }
  const remainingCount = total - completeCount - unclearCount;
  const completePct = total > 0 ? (completeCount / total) * 100 : 0;
  const unclearPct = total > 0 ? (unclearCount / total) * 100 : 0;

  const treeHtml = hierarchy.map((theme) => themeHtml(theme, progress, comments)).join('');

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
    </header>

    <div class="min-h-screen pt-16">
      <div class="max-w-4xl mx-auto px-8 py-10">
        <h1 class="text-3xl font-bold text-gray-900 dark:text-white mb-8 tracking-tight">My Progress</h1>

        <div class="bg-white dark:bg-neutral-900 border border-gray-100 dark:border-neutral-800 rounded-2xl p-6 mb-8">
          <div class="flex items-start gap-2 mb-3">
            <button type="button" data-progress-filter="complete" class="progress-stat-tile flex-1 text-left rounded-lg px-3 py-2 ring-1 ring-transparent transition-colors hover:bg-gray-50 dark:hover:bg-neutral-800/40">
              <div class="text-2xl font-bold text-emerald-600 dark:text-emerald-400">${completeCount}</div>
              <div class="text-xs text-gray-500 dark:text-neutral-400 mt-0.5">complete</div>
            </button>
            <button type="button" data-progress-filter="unclear" class="progress-stat-tile flex-1 text-left rounded-lg px-3 py-2 ring-1 ring-transparent transition-colors hover:bg-gray-50 dark:hover:bg-neutral-800/40">
              <div class="text-2xl font-bold text-amber-500 dark:text-amber-400">${unclearCount}</div>
              <div class="text-xs text-gray-500 dark:text-neutral-400 mt-0.5">unclear</div>
            </button>
            <button type="button" data-progress-filter="none" class="progress-stat-tile flex-1 text-left rounded-lg px-3 py-2 ring-1 ring-transparent transition-colors hover:bg-gray-50 dark:hover:bg-neutral-800/40">
              <div class="text-2xl font-bold text-gray-300 dark:text-neutral-600">${remainingCount}</div>
              <div class="text-xs text-gray-500 dark:text-neutral-400 mt-0.5">remaining</div>
            </button>
          </div>
          <div class="h-2 bg-gray-100 dark:bg-neutral-800 rounded-full overflow-hidden flex">
            <div class="h-full bg-emerald-500" style="width: ${completePct}%"></div>
            <div class="h-full bg-amber-400" style="width: ${unclearPct}%"></div>
          </div>
          <div class="text-xs text-gray-400 dark:text-neutral-500 mt-2">${completeCount} of ${total} topics complete</div>
        </div>

        <div id="progress-tree">${treeHtml}</div>

        <div id="progress-filter-empty" class="hidden text-center text-sm text-gray-400 dark:text-neutral-500 py-10"></div>

        <div class="mt-8 pt-4 border-t border-gray-100 dark:border-neutral-800">
          <button id="progress-reset-btn" type="button" class="text-xs text-gray-400 dark:text-neutral-600 hover:text-red-500 dark:hover:text-red-400 transition-colors">
            Reset all progress
          </button>
        </div>
      </div>
    </div>

    <style>
      .progress-stat-tile-active[data-progress-filter="complete"] { box-shadow: inset 0 0 0 1.5px rgb(16 185 129); }
      .progress-stat-tile-active[data-progress-filter="unclear"]  { box-shadow: inset 0 0 0 1.5px rgb(245 158 11); }
      .progress-stat-tile-active[data-progress-filter="none"]     { box-shadow: inset 0 0 0 1.5px rgb(148 163 184); }
    </style>`;
}

export async function afterMount(root) {
  const tiles = Array.from(root.querySelectorAll('.progress-stat-tile'));
  const tree = root.querySelector('#progress-tree');
  const filterEmpty = root.querySelector('#progress-filter-empty');
  const resetBtn = root.querySelector('#progress-reset-btn');

  const filterEmptyText = {
    complete: 'No completed topics yet.',
    unclear: 'No unclear topics.',
    none: 'Nothing remaining — all done!',
  };

  let activeFilter = '';

  function applyFilter() {
    tiles.forEach((btn) => btn.classList.toggle('progress-stat-tile-active', btn.dataset.progressFilter === activeFilter));

    if (!tree) return;
    let anyVisible = false;
    tree.querySelectorAll('[data-chapter-node]').forEach((node) => {
      let chapterVisible = false;
      node.querySelectorAll('[data-topic-row]').forEach((row) => {
        const matches = !activeFilter || row.dataset.topicState === activeFilter;
        row.style.display = matches ? '' : 'none';
        if (matches) chapterVisible = true;
      });
      node.style.display = chapterVisible ? '' : 'none';
      if (chapterVisible) {
        anyVisible = true;
        if (activeFilter) node.open = true;
      }
    });
    tree.querySelectorAll('section').forEach((section) => {
      const visible = section.querySelectorAll('[data-chapter-node]:not([style*="display: none"])').length > 0;
      section.style.display = visible ? '' : 'none';
    });

    if (filterEmpty) {
      if (activeFilter && !anyVisible) {
        filterEmpty.textContent = filterEmptyText[activeFilter] ?? '';
        filterEmpty.classList.remove('hidden');
      } else {
        filterEmpty.classList.add('hidden');
      }
    }
  }

  tiles.forEach((btn) => {
    btn.addEventListener('click', () => {
      const f = btn.dataset.progressFilter;
      activeFilter = activeFilter === f ? '' : f;
      applyFilter();
    });
  });

  if (resetBtn) {
    resetBtn.addEventListener('click', () => {
      if (confirm('Reset all progress? This cannot be undone.')) {
        localStorage.removeItem(STORAGE_KEY);
        localStorage.removeItem(COMMENTS_KEY);
        window.dispatchEvent(new CustomEvent('platform-progress-changed'));
        location.reload();
      }
    });
  }
}
