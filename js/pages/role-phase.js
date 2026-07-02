// Port of src/pages/roles/[role]/[phase].astro for the build-free SPA.
// Route: /roles/:role/:phase — a single phase of a role's course (1-based phase number).
import { url } from '../base-url.js';
import { escapeHtml } from '../markdown.js';
import { getRole, resolveRolePhases } from '../lib/roles.js';
import { render as renderNotFound, afterMount as afterMountNotFound } from './not-found.js';

const colorTextMap = {
  indigo: 'text-blue-600 dark:text-blue-400', violet: 'text-blue-600 dark:text-blue-400',
  sky: 'text-blue-600 dark:text-blue-400', emerald: 'text-blue-600 dark:text-blue-400',
  amber: 'text-blue-600 dark:text-blue-400', teal: 'text-blue-600 dark:text-blue-400',
};
const colorBgMap = {
  indigo: 'bg-blue-50 dark:bg-neutral-900', violet: 'bg-blue-50 dark:bg-neutral-900',
  sky: 'bg-blue-50 dark:bg-neutral-900', emerald: 'bg-blue-50 dark:bg-neutral-900',
  amber: 'bg-blue-50 dark:bg-neutral-900', teal: 'bg-blue-50 dark:bg-neutral-900',
};
const colorBorderMap = {
  indigo: 'border-blue-200 dark:border-blue-500/30', violet: 'border-blue-200 dark:border-blue-500/30',
  sky: 'border-blue-200 dark:border-blue-500/30', emerald: 'border-blue-200 dark:border-blue-500/30',
  amber: 'border-blue-200 dark:border-blue-500/30', teal: 'border-blue-200 dark:border-blue-500/30',
};
const colorDotMap = {
  indigo: 'bg-blue-500', violet: 'bg-blue-500', sky: 'bg-blue-500',
  emerald: 'bg-blue-500', amber: 'bg-blue-500', teal: 'bg-blue-500',
};
const colorGradientMap = {
  indigo: 'from-blue-500 to-blue-500', violet: 'from-blue-500 to-blue-500', sky: 'from-blue-500 to-blue-500',
  emerald: 'from-blue-500 to-blue-500', amber: 'from-blue-500 to-blue-500', teal: 'from-blue-500 to-blue-500',
};
const colorBarMap = {
  indigo: 'bg-blue-500', violet: 'bg-blue-500', sky: 'bg-blue-500',
  emerald: 'bg-blue-500', amber: 'bg-blue-500', teal: 'bg-blue-500',
};

function timeLabel(mins) {
  const halfHours = Math.round(mins / 30) * 0.5;
  return mins >= 60 ? `~${halfHours} hrs` : `~${mins} min`;
}

// getStaticPaths in the original only ever generated routes for non-empty phases of
// non-comingSoon roles with a `phases` config. Reproduce that as a lookup that returns
// null (-> not-found) for anything else, instead of a build-time path list.
function lookupPhase(roleSlug, phaseStr) {
  const role = getRole(roleSlug);
  if (!role || role.comingSoon || !role.phases) return null;
  const phases = resolveRolePhases(role);
  if (!phases) return null;
  const phaseIndex = Number.parseInt(phaseStr, 10) - 1;
  if (!Number.isInteger(phaseIndex) || phaseIndex < 0 || phaseIndex >= phases.length) return null;
  const phase = phases[phaseIndex];
  if (phase.isEmpty) return null;
  return { role, phase, phaseIndex, phases };
}

export async function render(params, query) {
  const resolved = lookupPhase(params.role, params.phase);
  if (!resolved) return renderNotFound(params, query);
  const { role, phase, phaseIndex, phases } = resolved;

  const phaseTopics = phase.sections.flatMap((s) => s.topics);
  const phaseMins = phaseTopics.reduce((sum, t) => sum + t.estimatedMinutes, 0);
  const phaseTime = timeLabel(phaseMins);

  // Navigate only among non-empty phases.
  const nonEmptyIndices = phases.map((p, i) => (!p.isEmpty ? i : -1)).filter((i) => i >= 0);
  const posInNonEmpty = nonEmptyIndices.indexOf(phaseIndex);
  const nextPhaseIdx = posInNonEmpty < nonEmptyIndices.length - 1 ? nonEmptyIndices[posInNonEmpty + 1] : null;
  const nextPhaseUrl = nextPhaseIdx !== null ? url(`roles/${role.slug}/${nextPhaseIdx + 1}`) : null;
  const nextPhaseTitle = nextPhaseIdx !== null ? phases[nextPhaseIdx].title : null;
  const nextPhaseNumber = nextPhaseIdx !== null ? nextPhaseIdx + 1 : null;

  const accentText = colorTextMap[role.color] ?? colorTextMap.indigo;
  const accentBg = colorBgMap[role.color] ?? colorBgMap.indigo;
  const accentBorder = colorBorderMap[role.color] ?? colorBorderMap.indigo;
  const accentDot = colorDotMap[role.color] ?? colorDotMap.indigo;
  const accentBar = colorBarMap[role.color] ?? colorBarMap.indigo;
  const accentGradient = colorGradientMap[role.color] ?? colorGradientMap.indigo;

  const fromParam = `roles/${role.slug}/${phaseIndex + 1}`;
  const topicIds = phaseTopics.map((t) => t.topicId);

  const chaptersHtml = phase.sections
    .map((section, si) => {
      const firstTopic = section.topics[0];
      const chapterUrl = firstTopic?.chapterUrl;
      const cc = firstTopic?.chapterColor ?? role.color;
      const time = timeLabel(section.topics.reduce((s, t) => s + t.estimatedMinutes, 0));
      const chapterTopicIds = section.topics.map((t) => t.topicId).join(',');
      const href = chapterUrl ? `${url(chapterUrl)}?from=${fromParam}` : url('');
      return `
        <a
          href="${href}"
          class="block p-5 rounded-2xl border ${colorBorderMap[cc] ?? colorBorderMap.indigo} bg-white dark:bg-neutral-900 hover:bg-gray-50 dark:hover:bg-neutral-900/70 transition-all"
          data-chapter-topic-ids="${chapterTopicIds}"
        >
          <div class="flex items-center justify-between mb-3">
            <span class="text-xs font-mono font-bold text-gray-400 dark:text-neutral-600">${String(si + 1).padStart(2, '0')}</span>
            <span class="text-xs text-gray-400 dark:text-neutral-500">${section.topics.length} topics · ${escapeHtml(time)}</span>
          </div>
          <h3 class="text-base font-semibold text-gray-900 dark:text-white mb-1">${escapeHtml(section.title)}</h3>
          ${section.description ? `<p class="text-sm text-gray-500 dark:text-neutral-400 leading-relaxed">${escapeHtml(section.description)}</p>` : ''}
          <div class="flex items-center gap-3 mt-4">
            <div class="flex-1 h-1.5 rounded-full bg-gray-100 dark:bg-neutral-800 overflow-hidden">
              <div class="chapter-progress-bar h-full rounded-full ${colorBarMap[cc] ?? colorBarMap.indigo} transition-all duration-500" style="width:0%"></div>
            </div>
            <span class="chapter-progress-text text-xs text-gray-400 dark:text-neutral-500 shrink-0 w-12 text-right">
              0 / ${section.topics.length}
            </span>
            <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4 ${colorTextMap[cc] ?? colorTextMap.indigo} shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/>
            </svg>
          </div>
        </a>
      `;
    })
    .join('');

  const startHref = phase.sections[0]?.topics[0]?.chapterUrl
    ? `${url(phase.sections[0].topics[0].chapterUrl)}?from=${fromParam}`
    : url('');

  return `
    <header class="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-4 py-3">
      <div class="flex items-center gap-3">
        <a href="${url('')}" title="Home" class="flex h-5 items-center text-gray-500 dark:text-neutral-400 hover:text-gray-900 dark:hover:text-white transition-colors">
          <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"/>
          </svg>
        </a>
        <a href="${url('roles/' + role.slug)}" class="flex items-center gap-1.5 text-sm text-gray-500 dark:text-neutral-400 hover:text-gray-900 dark:hover:text-white transition-colors">
          <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"/>
          </svg>
          ${escapeHtml(role.title)}
        </a>
      </div>
    </header>

    <div class="relative overflow-hidden pt-12">
      <div class="absolute inset-0 bg-[linear-gradient(to_right,#e5e7eb_1px,transparent_1px),linear-gradient(to_bottom,#e5e7eb_1px,transparent_1px)] dark:bg-[linear-gradient(to_right,#444444_1px,transparent_1px),linear-gradient(to_bottom,#444444_1px,transparent_1px)] bg-[size:64px_64px] opacity-60 dark:opacity-40 pointer-events-none"></div>
      <div class="absolute inset-0 bg-radial-gradient pointer-events-none"></div>

      <div class="relative z-10 px-6 pt-12 pb-8 max-w-3xl mx-auto text-center animate-fade-in">
        <div class="inline-flex items-center gap-2 text-xs font-medium ${accentText} ${accentBg} border ${accentBorder} rounded-full px-3 py-1 mb-6">
          <span class="w-1.5 h-1.5 rounded-full ${accentDot} animate-pulse"></span>
          Phase ${phaseIndex + 1} of ${phases.length}
        </div>
        <h1 class="text-4xl sm:text-5xl font-bold text-gray-900 dark:text-white mb-4 leading-tight tracking-tight">
          <span class="text-transparent bg-clip-text bg-gradient-to-r ${accentGradient}">${escapeHtml(phase.title)}</span>
        </h1>
        <p class="text-lg text-gray-600 dark:text-neutral-400 max-w-xl mx-auto leading-relaxed">${escapeHtml(phase.goal)}</p>
        <p class="text-sm text-gray-400 dark:text-neutral-500 mt-4">${phaseTopics.length} topics · ${escapeHtml(phaseTime)}</p>
      </div>

      <div class="relative z-10 px-6 pb-10 max-w-3xl mx-auto" data-phase-topic-ids="${topicIds.join(',')}">
        <div class="h-2 rounded-full bg-gray-200 dark:bg-neutral-800 overflow-hidden">
          <div id="phase-progress-fill" class="h-full rounded-full ${accentBar} transition-all duration-500" style="width:0%"></div>
        </div>
        <p id="phase-progress-text" class="text-sm text-gray-500 dark:text-neutral-400 mt-2 text-center">0 of ${phaseTopics.length} topics completed</p>
      </div>

      <main class="relative z-10 max-w-3xl mx-auto px-6 pb-20 animate-slide-up">
        <div class="space-y-3">${chaptersHtml}</div>

        <div class="mt-12 flex items-center justify-between gap-4 flex-wrap">
          <div class="flex items-center gap-4">
            <a
              href="${startHref}"
              class="inline-flex items-center gap-2 ${accentBg} ${accentText} font-semibold px-5 py-2.5 rounded-xl border ${accentBorder} hover:opacity-90 transition-opacity"
            >
              Start phase
              <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/>
              </svg>
            </a>
            <a href="${url('roles/' + role.slug)}" class="text-sm text-gray-400 dark:text-neutral-500 hover:text-gray-600 dark:hover:text-neutral-300 transition-colors">
              All phases
            </a>
          </div>

          ${nextPhaseUrl ? `
            <a href="${nextPhaseUrl}" class="flex items-center gap-2 text-sm text-gray-500 dark:text-neutral-400 hover:text-gray-900 dark:hover:text-white transition-colors">
              <span>Phase ${nextPhaseNumber}: ${escapeHtml(nextPhaseTitle)}</span>
              <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/>
              </svg>
            </a>
          ` : ''}
        </div>
      </main>
    </div>
  `;
}

export async function afterMount(root, params, query) {
  const resolved = lookupPhase(params.role, params.phase);
  if (!resolved) {
    if (typeof afterMountNotFound === 'function') await afterMountNotFound(root, params, query);
    return;
  }

  const STORAGE_KEY = 'platform-progress';
  function getProgress() {
    try { return JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}'); }
    catch { return {}; }
  }
  const progress = getProgress();

  const container = root.querySelector('[data-phase-topic-ids]');
  const topicIds = container?.dataset.phaseTopicIds?.split(',').filter(Boolean) ?? [];
  const done = topicIds.filter((id) => progress[id]).length;
  const fill = root.querySelector('#phase-progress-fill');
  const text = root.querySelector('#phase-progress-text');
  if (fill && topicIds.length > 0) fill.style.width = `${Math.round((done / topicIds.length) * 100)}%`;
  if (text) text.textContent = `${done} of ${topicIds.length} topics completed`;

  root.querySelectorAll('[data-chapter-topic-ids]').forEach((card) => {
    const ids = card.dataset.chapterTopicIds?.split(',').filter(Boolean) ?? [];
    const chapterDone = ids.filter((id) => progress[id]).length;
    const bar = card.querySelector('.chapter-progress-bar');
    const label = card.querySelector('.chapter-progress-text');
    if (bar && ids.length > 0) bar.style.width = `${Math.round((chapterDone / ids.length) * 100)}%`;
    if (label) label.textContent = `${chapterDone} / ${ids.length}`;
  });
}
