// Port of src/pages/[theme]/[module]/[chapter]/index.astro for the build-free SPA.
// Route: /:theme/:module/:chapter — the per-chapter topic list / chapter overview page.
import { url } from '../base-url.js';
import { escapeHtml } from '../markdown.js';
import { getChapters, getTopicsForChapter } from '../lib/chapters.js';
import { getRoles, resolveRolePhases } from '../lib/roles.js';
import { getModuleMeta } from '../lib/module-meta.js';
import { render as renderNotFound } from './not-found.js';

// All chapter colors render identically blue today (see js/layouts/shared.js and CLAUDE.md's
// "unify pillar colors to blue" note) — kept as a lookup (not a hardcoded literal) to match the
// original's per-chapter-color indirection and make future divergence a one-line change.
const textClass = 'text-blue-600 dark:text-blue-400';
const borderClass = 'border-blue-200 dark:border-blue-500/40 hover:border-blue-400';
const bgClass = 'bg-blue-50 dark:bg-neutral-900';

function lookupChapter(params) {
  // Hidden chapters (e.g. 99-layout-showcase) are excluded from nav-building code (module.js,
  // site-overlay.js, etc. all filter `hidden!` themselves) but must still render on direct URL —
  // per CLAUDE.md: "included in builds, invisible in nav". The original Astro getStaticPaths()
  // excluded hidden chapters entirely (a pre-existing bug that made this reference chapter 404
  // even by direct URL, contradicting its own documented purpose) — fixed here since there's no
  // reason to carry it forward in a from-scratch route handler.
  const chapter = getChapters().find((c) => c.slug === params.chapter);
  if (!chapter) return null;
  return chapter;
}

export async function render(params, query) {
  const chapter = lookupChapter(params);
  if (!chapter) return renderNotFound(params, query);

  const topics = getTopicsForChapter(chapter.slug);
  const currentModule = chapter.module ?? params.module ?? 'planning-software';
  const meta = getModuleMeta(currentModule) ?? { href: `${chapter.theme}/${currentModule}`, label: currentModule };

  if (chapter.comingSoon) {
    return `
      ${renderHeader(meta)}
      <div class="relative min-h-screen overflow-hidden">
        <div class="absolute inset-0 bg-[linear-gradient(to_right,#e5e7eb_1px,transparent_1px),linear-gradient(to_bottom,#e5e7eb_1px,transparent_1px)] dark:bg-[linear-gradient(to_right,#444444_1px,transparent_1px),linear-gradient(to_bottom,#444444_1px,transparent_1px)] bg-size-[64px_64px] opacity-60 dark:opacity-40 pointer-events-none"></div>
        <div class="absolute inset-0 pointer-events-none chapter-radial-bg"></div>
        <main class="relative z-10 max-w-3xl mx-auto px-6 pt-24 pb-16 animate-slide-up">
          <p class="text-sm font-medium ${textClass} mb-2">Chapter ${chapter.order}</p>
          <h1 class="text-4xl font-bold text-gray-900 dark:text-white mb-4">${escapeHtml(chapter.title)}</h1>
          <p class="text-lg text-gray-500 dark:text-neutral-400 mb-10">${escapeHtml(chapter.description)}</p>
          <div class="py-16 text-center">
            <div class="inline-flex items-center justify-center w-14 h-14 rounded-full bg-gray-100 dark:bg-neutral-800 mb-6">
              <svg xmlns="http://www.w3.org/2000/svg" class="w-7 h-7 text-gray-400 dark:text-neutral-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/>
              </svg>
            </div>
            <p class="text-lg font-semibold text-gray-700 dark:text-neutral-300 mb-2">Content coming soon</p>
            <p class="text-sm text-gray-400 dark:text-neutral-500 mb-8">This chapter is part of the new structure and will be available shortly.</p>
            <a href="${url(meta.href)}" class="inline-flex items-center gap-2 text-sm text-blue-600 dark:text-blue-400 hover:underline">
              <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"/>
              </svg>
              Back to ${escapeHtml(meta.label)}
            </a>
          </div>
        </main>
      </div>
      <style>${chapterRadialCss()}</style>
    `;
  }

  const topicsHtml = topics
    .map(
      (topic, i) => `
        <li>
          <a href="${url(topic.url)}" class="group flex items-start gap-4 p-4 rounded-xl border ${borderClass} bg-white dark:bg-neutral-900 hover:bg-gray-50 dark:hover:bg-neutral-900/70 transition-all">
            <span class="text-sm font-mono font-bold ${textClass} w-6 shrink-0 mt-0.5">${String(i + 1).padStart(2, '0')}</span>
            <div class="flex-1 min-w-0">
              <p class="text-gray-900 dark:text-white font-medium">${escapeHtml(topic.title)}</p>
              <p class="text-sm text-gray-500 dark:text-neutral-500 mt-0.5">${escapeHtml(topic.description)}</p>
            </div>
            <div class="flex items-center gap-3 shrink-0 mt-0.5">
              ${topic.widget ? `<span class="text-xs text-blue-600 dark:text-blue-500 bg-blue-50 dark:bg-blue-500/10 px-2 py-0.5 rounded-full">interactive</span>` : ''}
              <span class="text-xs text-gray-400 dark:text-neutral-600">${topic.estimatedMinutes} min</span>
              <span class="topic-completion-dot w-2 h-2 rounded-full bg-gray-200 dark:bg-neutral-700 transition-colors" data-topic-id="${escapeHtml(chapter.slug + '/' + topic.slug)}"></span>
            </div>
          </a>
        </li>
      `,
    )
    .join('');

  return `
    ${renderHeader(meta)}
    <div class="relative min-h-screen overflow-hidden">
      <div class="absolute inset-0 bg-[linear-gradient(to_right,#e5e7eb_1px,transparent_1px),linear-gradient(to_bottom,#e5e7eb_1px,transparent_1px)] dark:bg-[linear-gradient(to_right,#444444_1px,transparent_1px),linear-gradient(to_bottom,#444444_1px,transparent_1px)] bg-size-[64px_64px] opacity-60 dark:opacity-40 pointer-events-none"></div>
      <div class="absolute inset-0 pointer-events-none chapter-radial-bg"></div>

      <main class="relative z-10 max-w-3xl mx-auto px-6 pt-24 pb-16 animate-slide-up">
        <p class="text-sm font-medium ${textClass} mb-2">Chapter ${chapter.order}</p>
        <h1 class="text-4xl font-bold text-gray-900 dark:text-white mb-4">${escapeHtml(chapter.title)}</h1>
        <p class="text-lg text-gray-500 dark:text-neutral-400 mb-10">${escapeHtml(chapter.description)}</p>

        <ol class="space-y-3">${topicsHtml}</ol>

        <div class="mt-10 flex items-center gap-4">
          <a href="${topics[0] ? url(topics[0].url) : url('')}" class="inline-flex items-center gap-2 ${bgClass} ${textClass} font-semibold px-5 py-2.5 rounded-xl border ${borderClass} hover:opacity-90 transition-opacity">
            Start chapter
            <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/>
            </svg>
          </a>
          <a id="chapter-back-overview" href="${url(meta.href)}" class="text-sm text-gray-400 dark:text-neutral-500 hover:text-gray-600 dark:hover:text-neutral-300 transition-colors">Back to overview</a>
        </div>
      </main>
    </div>
    <style>${chapterRadialCss()}</style>
  `;
}

function renderHeader(meta) {
  return `
    <header class="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 py-3">
      <div class="flex items-center gap-3">
        <a href="${url('')}" title="Home" class="flex h-5 items-center text-gray-500 dark:text-neutral-400 hover:text-gray-900 dark:hover:text-white transition-colors">
          <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"/>
          </svg>
        </a>
        <a id="nav-back-link" href="${url(meta.href)}" class="flex items-center gap-2 text-sm text-gray-500 dark:text-neutral-400 hover:text-gray-900 dark:hover:text-white transition-colors">
          <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12h18M3 12l7-7M3 12l7 7"/>
          </svg>
          ${escapeHtml(meta.label)}
        </a>
      </div>
    </header>
  `;
}

function chapterRadialCss() {
  return `
    .chapter-radial-bg { background: radial-gradient(ellipse 80% 50% at 50% -20%, rgba(59,130,246,0.08), transparent); }
    .dark .chapter-radial-bg { background: radial-gradient(ellipse 80% 50% at 50% -20%, rgba(59,130,246,0.15), transparent); }
  `;
}

export async function afterMount(root, params) {
  const chapter = lookupChapter(params);
  if (!chapter) return;

  // Per-role-phase chapter context, computed live from the content index (was Astro-injected at
  // build time — see CONTRACTS.md §5/"tricky spots"). Consumed by shell/role-phase-nav.js via the
  // same window.__chapterPhaseCtx global the original inline script used.
  const chapterPhaseCtxMap = {};
  for (const role of getRoles().filter((r) => !r.comingSoon && r.phases)) {
    const phases = resolveRolePhases(role);
    if (!phases) continue;
    phases.forEach((phase, pi) => {
      if (phase.isEmpty) return;
      const slugsInPhase = phase.sections.map((s) => s.topics[0]?.chapterSlug).filter(Boolean);
      if (!slugsInPhase.includes(chapter.slug)) return;
      const key = `${role.slug}/${pi + 1}`;
      chapterPhaseCtxMap[key] = {
        roleTitle: role.title,
        roleUrl: role.url,
        chapters: phase.sections.map((s) => ({
          slug: s.topics[0]?.chapterSlug ?? '',
          title: s.title,
          url: (s.topics[0]?.chapterUrl ?? '') + `?from=roles/${key}`,
        })),
      };
    });
  }
  window.__chapterPhaseCtx = {
    currentChapterSlug: chapter.slug,
    bgClass,
    textClass,
    map: chapterPhaseCtxMap,
  };

  if (chapter.comingSoon) return;

  const STORAGE_KEY = 'platform-progress';
  function getProgress() {
    try { return JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}'); }
    catch { return {}; }
  }
  const progress = getProgress();
  root.querySelectorAll('.topic-completion-dot').forEach((dot) => {
    const id = dot.dataset.topicId ?? '';
    if (progress[id]) {
      dot.classList.remove('bg-gray-200', 'dark:bg-neutral-700');
      dot.classList.add('bg-blue-500');
    }
  });
}
