// Port of src/components/SiteOverlay.astro — full-site navigation palette, toggled by 'O'.
// Fixed-chrome shell module (see CONTRACTS.md §4b): mountSiteOverlay(container) is called
// exactly once at boot by js/app.js. It builds its own DOM once and self-manages all
// interaction (toggle, filter, chapter expand/collapse, keyboard shortcut) via listeners
// bound at mount time — there is no per-route re-render for this module.
import { getChapters, getTopics, getChapterUrl, getThemes, getModulesForTheme } from '../lib/chapters.js';
import { getRoles } from '../lib/roles.js';
import { url } from '../base-url.js';
import { escapeHtml } from '../markdown.js';

const themeMeta = {
  technology: { label: 'Technology', accent: 'text-blue-600 dark:text-blue-400', line: 'bg-blue-100 dark:bg-blue-500/20' },
  process:    { label: 'Process',    accent: 'text-blue-600 dark:text-blue-400', line: 'bg-blue-100 dark:bg-blue-500/20' },
  data:       { label: 'Data',       accent: 'text-blue-600 dark:text-blue-400', line: 'bg-blue-100 dark:bg-blue-500/20' },
  people:     { label: 'People',     accent: 'text-blue-600 dark:text-blue-400', line: 'bg-blue-100 dark:bg-blue-500/20' },
};

// TODO: consolidate with module-meta.js (Phase 2 integration step — see CLAUDE.md note on
// keeping SiteOverlay's moduleLabels in sync with moduleBackMap elsewhere).
const moduleLabels = {
  // Technology
  'planning-software':                   'Planning Software',
  'erp':                                 'ERP',
  'tool-landscape':                      'Tool Landscape & Architecture',
  'supporting-systems':                  'Supporting Systems',
  // Data
  'data-foundations':                    'Data Foundations',
  'planning-data-domains':               'Planning Data Domains',
  'planning-parameters-and-assumptions': 'Planning Parameters & Assumptions',
  'performance-and-measurement':         'Performance & Measurement',
  'data-quality-and-governance':         'Data Quality & Governance',
  // Process
  'planning-fundamentals':               'Planning Fundamentals',
  'planning-cycles-and-governance':      'Planning Cycles & Governance',
  'sop':                                 'S&OP',
  'soe':                                 'S&OE',
  'execution':                           'Execution',
  'advanced-planning':                   'Advanced Planning',
  // People
  'roles-and-responsibilities':          'Roles & Responsibilities',
  'decision-making-and-ownership':       'Decision Making & Ownership',
  'collaboration-and-ways-of-working':   'Collaboration & Ways of Working',
  'capabilities-and-skills':             'Capabilities & Skills',
};

function buildData() {
  const allChapters = getChapters().filter((c) => !c.hidden);
  const allTopics = getTopics();
  const liveRoles = getRoles().filter((r) => !r.comingSoon);
  const themeOrder = getThemes();
  const totalTopics = allTopics.length;

  const themes = themeOrder
    .map((theme) => {
      const themeChapters = allChapters.filter((c) => c.theme === theme);
      // Module order comes straight from order.json (via getModulesForTheme), scoped to
      // modules that actually have a chapter under this theme.
      const modules = getModulesForTheme(theme).filter((mod) => themeChapters.some((c) => c.module === mod));
      return {
        theme,
        ...themeMeta[theme],
        multiModule: modules.length > 1,
        modules: modules.map((mod) => ({
          key: mod,
          label: moduleLabels[mod] ?? mod,
          chapters: themeChapters
            .filter((c) => c.module === mod)
            .map((ch) => ({
              slug: ch.slug,
              title: ch.title,
              url: getChapterUrl(ch),
              topics: allTopics.filter((t) => t.chapterSlug === ch.slug),
            })),
        })),
      };
    })
    .filter((p) => p.modules.length > 0);

  return { themes, liveRoles, totalTopics };
}

function renderMarkup({ themes, liveRoles, totalTopics }) {
  const themeSections = themes
    .map(
      (theme, pi) => `
        <section class="theme-section" data-theme="${escapeHtml(theme.theme)}">
          <div class="flex items-center gap-2 px-5 py-2 ${pi > 0 ? 'mt-2' : ''}">
            <span class="text-[10px] font-bold uppercase tracking-widest ${theme.accent}">${escapeHtml(theme.label)}</span>
            <div class="flex-1 h-px ${theme.line}"></div>
          </div>
          ${theme.modules
            .map(
              (mod) => `
            <div class="module-group" data-module="${escapeHtml(mod.key)}">
              ${
                theme.multiModule
                  ? `<div class="flex items-center gap-2 pl-8 pr-5 py-1.5">
                       <span class="text-[10px] font-semibold uppercase tracking-wider text-gray-400 dark:text-neutral-500">${escapeHtml(mod.label)}</span>
                       <div class="flex-1 h-px bg-gray-100 dark:bg-neutral-800"></div>
                     </div>`
                  : ''
              }
              ${mod.chapters
                .map(
                  (ch) => `
                <div class="chapter-card" data-chapter="${escapeHtml(ch.title.toLowerCase())}">
                  <div class="chapter-toggle flex items-center gap-2 pl-9 pr-5 py-1 cursor-pointer group" role="button" tabindex="0" aria-expanded="false">
                    <svg class="chapter-chevron w-3 h-3 shrink-0 text-gray-300 dark:text-neutral-600 group-hover:text-gray-500 dark:group-hover:text-gray-400 transition-colors" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                      <path d="M9 18l6-6-6-6"/>
                    </svg>
                    <a href="${url(ch.url)}" class="chapter-link flex-1 text-sm font-semibold text-gray-700 dark:text-neutral-200 hover:text-gray-900 dark:hover:text-white transition-colors leading-snug py-0.5" data-search="${escapeHtml(ch.title.toLowerCase())}">
                      ${escapeHtml(ch.title)}
                    </a>
                    ${ch.topics.length > 0 ? `<span class="text-[10px] text-gray-300 dark:text-neutral-700 shrink-0 tabular-nums">${ch.topics.length}</span>` : ''}
                  </div>
                  <ul class="topics-list">
                    ${ch.topics
                      .map(
                        (t) => `
                      <li class="topic-item" data-search="${escapeHtml(`${ch.title} ${t.title}`.toLowerCase())}">
                        <a href="${url(t.url)}" class="flex items-center gap-2 pl-16 pr-5 py-0.5 group">
                          <span class="w-0.5 h-0.5 rounded-full bg-gray-200 dark:bg-neutral-700 shrink-0"></span>
                          <span class="text-xs text-gray-500 dark:text-neutral-400 group-hover:text-gray-800 dark:group-hover:text-gray-100 transition-colors leading-snug truncate">
                            ${escapeHtml(t.title)}
                          </span>
                        </a>
                      </li>`,
                      )
                      .join('')}
                  </ul>
                </div>`,
                )
                .join('')}
            </div>`,
            )
            .join('')}
        </section>`,
    )
    .join('');

  const rolesSection =
    liveRoles.length > 0
      ? `
        <section class="theme-section" data-theme="roles">
          <div class="flex items-center gap-2 px-5 py-2 mt-2">
            <span class="text-[10px] font-bold uppercase tracking-widest text-teal-600 dark:text-teal-400">Roles</span>
            <div class="flex-1 h-px bg-teal-100 dark:bg-teal-500/20"></div>
          </div>
          <div class="module-group" data-module="roles">
            ${liveRoles
              .map(
                (role) => `
              <div class="chapter-card" data-chapter="${escapeHtml(`${role.title} role course`.toLowerCase())}">
                <a href="${url(role.url)}" class="chapter-link flex items-center gap-2 pl-12 pr-5 py-1 group" data-search="${escapeHtml(role.title.toLowerCase())}">
                  <span class="w-1 h-1 rounded-full bg-gray-300 dark:bg-neutral-600 shrink-0 group-hover:bg-gray-500 dark:group-hover:bg-gray-400 transition-colors"></span>
                  <span class="text-sm font-semibold text-gray-700 dark:text-neutral-200 group-hover:text-gray-900 dark:group-hover:text-white transition-colors leading-snug">
                    ${escapeHtml(role.title)}
                  </span>
                </a>
              </div>`,
              )
              .join('')}
          </div>
        </section>`
      : '';

  return `
    <style>
      .chapter-card:not([data-expanded]) .topics-list { display: none; }
      .chapter-chevron { transition: transform 0.15s ease; }
      .chapter-card[data-expanded] .chapter-chevron { transform: rotate(90deg); }
    </style>
    <div id="site-overlay" class="fixed inset-0 z-[9999] hidden" role="dialog" aria-modal="true" aria-label="Site overview">
      <div id="site-overlay-backdrop" class="absolute inset-0 bg-black/60 backdrop-blur-sm"></div>
      <div class="relative z-10 flex flex-col h-full max-w-2xl mx-auto px-4 py-6 pointer-events-none">
        <div class="flex flex-col bg-white dark:bg-neutral-900 rounded-2xl shadow-2xl overflow-hidden pointer-events-auto max-h-full">
          <div class="flex items-center gap-3 px-5 py-4 border-b border-gray-100 dark:border-neutral-800 shrink-0">
            <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4 text-gray-400 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-4.35-4.35M17 11A6 6 0 111 11a6 6 0 0116 0z"/>
            </svg>
            <input
              id="site-overlay-search"
              type="text"
              placeholder="Filter pagina's…"
              autocomplete="off"
              spellcheck="false"
              class="flex-1 bg-transparent text-sm text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-neutral-500 outline-none"
            />
            <span class="text-xs text-gray-400 dark:text-neutral-500 shrink-0 tabular-nums">${totalTopics} topics</span>
            <button id="site-overlay-close" class="text-gray-400 hover:text-gray-700 dark:hover:text-neutral-200 transition-colors shrink-0 ml-1" aria-label="Sluiten">
              <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
              </svg>
            </button>
          </div>
          <div id="site-overlay-content" class="overflow-y-auto flex-1 py-3">
            ${themeSections}
            ${rolesSection}
            <p id="site-overlay-empty" class="hidden text-sm text-gray-400 dark:text-neutral-500 text-center py-10">Geen pagina's gevonden.</p>
          </div>
          <div class="px-5 py-2.5 border-t border-gray-100 dark:border-neutral-800 shrink-0 flex items-center justify-between">
            <span class="text-xs text-gray-400 dark:text-neutral-600">
              <kbd class="font-mono bg-gray-100 dark:bg-neutral-800 px-1.5 py-0.5 rounded text-gray-500 dark:text-neutral-400">O</kbd> openen/sluiten
              &nbsp;·&nbsp;
              <kbd class="font-mono bg-gray-100 dark:bg-neutral-800 px-1.5 py-0.5 rounded text-gray-500 dark:text-neutral-400">Esc</kbd> sluiten
            </span>
            <a href="${url('glossary')}" class="text-xs text-indigo-600 dark:text-indigo-400 hover:underline">Glossary/FAQ</a>
          </div>
        </div>
      </div>
    </div>`;
}

function wireBehavior() {
  const overlay = document.getElementById('site-overlay');
  const backdrop = document.getElementById('site-overlay-backdrop');
  const closeBtn = document.getElementById('site-overlay-close');
  const search = document.getElementById('site-overlay-search');
  const empty = document.getElementById('site-overlay-empty');

  function collapseAll() {
    overlay.querySelectorAll('.chapter-card').forEach((card) => {
      card.removeAttribute('data-expanded');
      const toggle = card.querySelector('.chapter-toggle');
      if (toggle) toggle.setAttribute('aria-expanded', 'false');
    });
  }

  function setExpanded(card, expand) {
    const toggle = card.querySelector('.chapter-toggle');
    if (expand) {
      card.setAttribute('data-expanded', '');
      toggle?.setAttribute('aria-expanded', 'true');
    } else {
      card.removeAttribute('data-expanded');
      toggle?.setAttribute('aria-expanded', 'false');
    }
  }

  function open() {
    overlay.classList.remove('hidden');
    document.body.style.overflow = 'hidden';
    search.value = '';
    collapseAll();
    applyFilter('');
    setTimeout(() => search.focus(), 50);
  }

  function close() {
    overlay.classList.add('hidden');
    document.body.style.overflow = '';
  }

  function toggle() {
    overlay.classList.contains('hidden') ? open() : close();
  }

  function applyFilter(q) {
    const term = q.toLowerCase().trim();
    let anyVisible = false;

    overlay.querySelectorAll('.chapter-card').forEach((card) => {
      const chapterText = card.dataset.chapter ?? '';
      const topicItems = card.querySelectorAll('.topic-item');

      if (!term) {
        card.style.display = '';
        topicItems.forEach((t) => { t.style.display = ''; });
        setExpanded(card, false);
        anyVisible = true;
        return;
      }

      if (chapterText.includes(term)) {
        card.style.display = '';
        topicItems.forEach((t) => { t.style.display = ''; });
        setExpanded(card, topicItems.length > 0);
        anyVisible = true;
      } else {
        let chapterMatch = false;
        topicItems.forEach((t) => {
          const match = (t.dataset.search ?? '').includes(term);
          t.style.display = match ? '' : 'none';
          if (match) chapterMatch = true;
        });
        card.style.display = chapterMatch ? '' : 'none';
        setExpanded(card, chapterMatch);
        if (chapterMatch) anyVisible = true;
      }
    });

    overlay.querySelectorAll('.module-group').forEach((mod) => {
      const visible = Array.from(mod.querySelectorAll('.chapter-card')).some((c) => c.style.display !== 'none');
      mod.style.display = visible ? '' : 'none';
    });

    overlay.querySelectorAll('.theme-section').forEach((sec) => {
      const visible = Array.from(sec.querySelectorAll('.module-group')).some((m) => m.style.display !== 'none');
      sec.style.display = visible ? '' : 'none';
    });

    empty.classList.toggle('hidden', anyVisible);
  }

  overlay.querySelectorAll('.chapter-toggle').forEach((toggleEl) => {
    toggleEl.addEventListener('click', () => {
      const card = toggleEl.closest('.chapter-card');
      setExpanded(card, !card.hasAttribute('data-expanded'));
    });
    toggleEl.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        toggleEl.click();
      }
    });
  });

  overlay.querySelectorAll('.chapter-link').forEach((link) => {
    link.addEventListener('click', (e) => {
      e.stopPropagation();
      close();
    });
  });

  document.addEventListener('keydown', (e) => {
    const tag = e.target.tagName;
    const inInput = tag === 'INPUT' || tag === 'TEXTAREA' || e.target.isContentEditable;
    if (e.key === 'Escape') { close(); return; }
    if ((e.key === 'o' || e.key === 'O') && !inInput && !e.metaKey && !e.ctrlKey) {
      e.preventDefault();
      toggle();
    }
  });

  backdrop.addEventListener('click', close);
  closeBtn.addEventListener('click', close);
  overlay.querySelectorAll('.topic-item a').forEach((a) => a.addEventListener('click', close));
  search.addEventListener('input', () => applyFilter(search.value));

  // Expose the toggle globally in case other modules (fixed icon bar, keybindings) want to
  // trigger the overlay programmatically, mirroring the pattern used for window.openIntro()
  // / window.openSearch().
  window.openSiteOverlay = open;
  window.closeSiteOverlay = close;
  window.toggleSiteOverlay = toggle;
}

export function mountSiteOverlay(container) {
  const data = buildData();
  container.insertAdjacentHTML('beforeend', renderMarkup(data));
  wireBehavior();
}
