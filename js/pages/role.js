// Port of src/pages/roles/[role].astro for the build-free SPA.
// Route: /roles/:role — a role's full course overview (all phases, or flat topic list for
// roles without a `phases` config).
import { url } from '../base-url.js';
import { escapeHtml } from '../markdown.js';
import { getRole, resolveRoleSections, resolveRolePhases, getRoleStats } from '../lib/roles.js';
import { render as renderNotFound, afterMount as afterMountNotFound } from './not-found.js';

const colorTextMap = {
  indigo: 'text-blue-600 dark:text-blue-400',
  violet: 'text-blue-600 dark:text-blue-400',
  sky: 'text-blue-600 dark:text-blue-400',
  emerald: 'text-blue-600 dark:text-blue-400',
  amber: 'text-blue-600 dark:text-blue-400',
  teal: 'text-blue-600 dark:text-blue-400',
};
const colorBgMap = {
  indigo: 'bg-blue-50 dark:bg-neutral-900',
  violet: 'bg-blue-50 dark:bg-neutral-900',
  sky: 'bg-blue-50 dark:bg-neutral-900',
  emerald: 'bg-blue-50 dark:bg-neutral-900',
  amber: 'bg-blue-50 dark:bg-neutral-900',
  teal: 'bg-blue-50 dark:bg-neutral-900',
};
const colorBorderMap = {
  indigo: 'border-blue-200 dark:border-blue-500/30',
  violet: 'border-blue-200 dark:border-blue-500/30',
  sky: 'border-blue-200 dark:border-blue-500/30',
  emerald: 'border-blue-200 dark:border-blue-500/30',
  amber: 'border-blue-200 dark:border-blue-500/30',
  teal: 'border-blue-200 dark:border-blue-500/30',
};
const colorDotMap = {
  indigo: 'bg-blue-500',
  violet: 'bg-blue-500',
  sky: 'bg-blue-500',
  emerald: 'bg-blue-500',
  amber: 'bg-blue-500',
  teal: 'bg-blue-500',
};
const colorGradientMap = {
  indigo: 'from-blue-500 to-blue-500',
  violet: 'from-blue-500 to-blue-500',
  sky: 'from-blue-500 to-blue-500',
  emerald: 'from-blue-500 to-blue-500',
  amber: 'from-blue-500 to-blue-500',
  teal: 'from-blue-500 to-blue-500',
};
const colorBarMap = {
  indigo: 'bg-blue-500',
  violet: 'bg-blue-500',
  sky: 'bg-blue-500',
  emerald: 'bg-blue-500',
  amber: 'bg-blue-500',
  teal: 'bg-blue-500',
};

function timeLabel(mins) {
  const halfHours = Math.round(mins / 30) * 0.5;
  return mins >= 60 ? `~${halfHours} hrs` : `~${mins} min`;
}

// getStaticPaths in the original astro page only ever generated routes for
// `!role.comingSoon` roles — visiting a comingSoon (or unknown) role's URL 404s in the
// static build. Reproduce that by treating both cases as "not found" here.
function lookupRole(roleSlug) {
  const role = getRole(roleSlug);
  if (!role || role.comingSoon) return null;
  return role;
}

export async function render(params, query) {
  const role = lookupRole(params.role);
  if (!role) return renderNotFound(params, query);

  const sections = resolveRoleSections(role);
  const phases = resolveRolePhases(role);
  const stats = getRoleStats(sections);
  const hours = timeLabel(stats.totalMinutes);

  const accentText = colorTextMap[role.color] ?? colorTextMap.indigo;
  const accentBg = colorBgMap[role.color] ?? colorBgMap.indigo;
  const accentBorder = colorBorderMap[role.color] ?? colorBorderMap.indigo;
  const accentDot = colorDotMap[role.color] ?? colorDotMap.indigo;
  const accentBar = colorBarMap[role.color] ?? colorBarMap.indigo;
  const accentGradient = colorGradientMap[role.color] ?? colorGradientMap.indigo;

  // Per-phase topic counts/times, for the phase overview cards.
  const phaseStats = phases?.map((phase) => {
    const topics = phase.sections.flatMap((s) => s.topics);
    const mins = topics.reduce((sum, t) => sum + t.estimatedMinutes, 0);
    return { topicCount: topics.length, time: timeLabel(mins), topicIds: topics.map((t) => t.topicId) };
  });

  // All topic ids, for the overall progress bar (works for both phase overview and flat sections).
  const allTopicIds = sections.flatMap((s) => s.topics.map((t) => t.topicId));

  const mainHtml = phases
    ? renderPhaseOverview(role, phases, phaseStats, accentText, accentBg, accentBorder, accentDot, accentBar)
    : renderFlatSections(role, sections, accentText, accentBg, accentBorder);

  return `
    <header class="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-4 py-3">
      <div class="flex items-center gap-3">
        <a href="${url('')}" title="Home" class="flex h-5 items-center text-gray-500 dark:text-neutral-400 hover:text-gray-900 dark:hover:text-white transition-colors">
          <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"/>
          </svg>
        </a>
        <a href="${url('roles')}" class="flex items-center gap-1.5 text-sm text-gray-500 dark:text-neutral-400 hover:text-gray-900 dark:hover:text-white transition-colors">
          <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"/>
          </svg>
          Roles
        </a>
      </div>
    </header>

    <div class="relative overflow-hidden pt-12">
      <div class="absolute inset-0 bg-[linear-gradient(to_right,#e5e7eb_1px,transparent_1px),linear-gradient(to_bottom,#e5e7eb_1px,transparent_1px)] dark:bg-[linear-gradient(to_right,#444444_1px,transparent_1px),linear-gradient(to_bottom,#444444_1px,transparent_1px)] bg-size-[64px_64px] opacity-60 dark:opacity-40 pointer-events-none"></div>
      <div class="absolute inset-0 bg-radial-gradient pointer-events-none"></div>

      <div class="relative z-10 px-6 pt-12 pb-10 max-w-3xl mx-auto text-center animate-fade-in">
        <div class="inline-flex items-center gap-2 text-xs font-medium ${accentText} ${accentBg} border ${accentBorder} rounded-full px-3 py-1 mb-6">
          <span class="w-1.5 h-1.5 rounded-full ${accentDot} animate-pulse"></span>
          Role-based course
        </div>
        <h1 class="text-5xl sm:text-6xl font-bold text-gray-900 dark:text-white mb-6 leading-tight tracking-tight">
          <span class="text-transparent bg-clip-text bg-linear-to-r ${accentGradient}">${escapeHtml(role.title)}</span>
        </h1>
        <p class="text-xl text-gray-600 dark:text-neutral-400 max-w-xl mx-auto leading-relaxed">
          ${escapeHtml(role.description)}
        </p>
        <p class="text-sm text-gray-400 dark:text-neutral-500 mt-4">${stats.topicCount} topics · ${escapeHtml(hours)}</p>
      </div>

      <div class="relative z-10 px-6 pb-10 max-w-3xl mx-auto" data-all-topic-ids="${allTopicIds.join(',')}">
        <div class="h-2 rounded-full bg-gray-200 dark:bg-neutral-800 overflow-hidden">
          <div id="role-progress-fill" class="h-full rounded-full ${accentBar} transition-all duration-500" style="width:0%"></div>
        </div>
        <p id="role-progress-text" class="text-sm text-gray-500 dark:text-neutral-400 mt-2 text-center">0 of ${stats.topicCount} topics completed</p>
      </div>

      <main class="relative z-10 max-w-3xl mx-auto px-6 pb-20 animate-slide-up">
        ${mainHtml}
      </main>
    </div>
  `;
}

function renderPhaseOverview(role, phases, phaseStats, accentText, accentBg, accentBorder, accentDot, accentBar) {
  const cardsHtml = phases
    .map((phase, pi) => {
      if (phase.isEmpty) {
        return `
          <div class="block p-6 rounded-2xl border border-gray-200 dark:border-neutral-800 bg-gray-50 dark:bg-neutral-900 opacity-60">
            <div class="flex items-center justify-between mb-4">
              <span class="text-xs font-bold uppercase tracking-widest text-gray-400 dark:text-neutral-600 bg-gray-100 dark:bg-neutral-800 border border-gray-200 dark:border-neutral-700 rounded-full px-2.5 py-0.5">
                Phase ${pi + 1}
              </span>
              <span class="text-xs text-gray-400 dark:text-neutral-600 italic">Coming soon</span>
            </div>
            <h2 class="text-xl font-semibold text-gray-400 dark:text-neutral-600 mb-1">${escapeHtml(phase.title)}</h2>
            <p class="text-sm text-gray-400 dark:text-neutral-600 leading-relaxed">${escapeHtml(phase.goal)}</p>
          </div>
        `;
      }

      const ps = phaseStats[pi];
      const keyAreasHtml = phase.keyAreas
        .map(
          (area) => `
            <li class="flex items-start gap-2.5 text-sm text-gray-600 dark:text-neutral-300">
              <span class="mt-1.5 w-1.5 h-1.5 rounded-full ${accentDot} shrink-0"></span>
              ${escapeHtml(area)}
            </li>
          `,
        )
        .join('');

      return `
        <a
          href="${url(role.url + '/' + (pi + 1))}"
          class="block p-6 rounded-2xl border ${accentBorder} bg-white dark:bg-neutral-900 hover:bg-gray-50 dark:hover:bg-neutral-900/70 transition-all"
          data-phase-topic-ids="${ps.topicIds.join(',')}"
        >
          <div class="flex items-center justify-between mb-4">
            <span class="text-xs font-bold uppercase tracking-widest ${accentText} ${accentBg} border ${accentBorder} rounded-full px-2.5 py-0.5">
              Phase ${pi + 1}
            </span>
            <span class="text-xs text-gray-400 dark:text-neutral-500">${ps.topicCount} topics · ${escapeHtml(ps.time)}</span>
          </div>

          <h2 class="text-xl font-semibold text-gray-900 dark:text-white mb-1">${escapeHtml(phase.title)}</h2>
          <p class="text-sm text-gray-500 dark:text-neutral-400 leading-relaxed mb-5">${escapeHtml(phase.goal)}</p>

          <ul class="space-y-2 mb-6">${keyAreasHtml}</ul>

          <div class="flex items-center gap-3">
            <div class="flex-1 h-1.5 rounded-full bg-gray-100 dark:bg-neutral-800 overflow-hidden">
              <div class="phase-progress-bar h-full rounded-full ${accentBar} transition-all duration-500" style="width:0%"></div>
            </div>
            <span class="phase-progress-text text-xs text-gray-400 dark:text-neutral-500 shrink-0 w-16 text-right">
              0 / ${ps.topicCount}
            </span>
            <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4 ${accentText} shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/>
            </svg>
          </div>
        </a>
      `;
    })
    .join('');

  return `<div class="space-y-4">${cardsHtml}</div>`;
}

function renderFlatSections(role, sections, accentText, accentBg, accentBorder) {
  const sectionsHtml = sections
    .map((section, si) => {
      const topicsHtml = section.topics
        .map(
          (topic) => `
            <li>
              <a
                href="${url(topic.url)}"
                class="group flex items-start gap-4 p-4 rounded-xl border ${colorBorderMap[topic.chapterColor] ?? colorBorderMap.indigo} bg-white dark:bg-neutral-900 hover:bg-gray-50 dark:hover:bg-neutral-900/70 transition-all"
              >
                <div class="flex-1 min-w-0">
                  <p class="text-gray-900 dark:text-white font-medium">${escapeHtml(topic.title)}</p>
                  <p class="text-sm text-gray-500 dark:text-neutral-500 mt-0.5">${escapeHtml(topic.description)}</p>
                </div>
                <div class="flex items-center gap-3 shrink-0 mt-0.5">
                  <span class="hidden sm:inline text-xs ${colorTextMap[topic.chapterColor] ?? colorTextMap.indigo} ${colorBgMap[topic.chapterColor] ?? colorBgMap.indigo} px-2 py-0.5 rounded-full whitespace-nowrap">
                    ${escapeHtml(topic.themeLabel)} · ${escapeHtml(topic.chapterTitle)}
                  </span>
                  <span class="text-xs text-gray-400 dark:text-neutral-600">${topic.estimatedMinutes} min</span>
                  <span
                    class="topic-completion-dot w-2 h-2 rounded-full bg-gray-200 dark:bg-neutral-700 transition-colors"
                    data-topic-id="${escapeHtml(topic.topicId)}"
                  ></span>
                </div>
              </a>
            </li>
          `,
        )
        .join('');

      return `
        <section class="${si > 0 ? 'mt-12' : ''}">
          <div class="flex items-baseline gap-3 mb-1">
            <span class="text-sm font-mono font-bold ${accentText}">${String(si + 1).padStart(2, '0')}</span>
            <h2 class="text-xs font-bold uppercase tracking-widest ${accentText}">${escapeHtml(section.title)}</h2>
          </div>
          ${section.description ? `<p class="text-sm text-gray-500 dark:text-neutral-400 mb-4 ml-8">${escapeHtml(section.description)}</p>` : ''}
          <ol class="space-y-3">${topicsHtml}</ol>
        </section>
      `;
    })
    .join('');

  const startHref = sections[0]?.topics[0]?.url ? url(sections[0].topics[0].url) : url('');

  return `
    <div>
      ${sectionsHtml}
      <div class="mt-12 flex items-center gap-4">
        <a
          href="${startHref}"
          class="inline-flex items-center gap-2 ${accentBg} ${accentText} font-semibold px-5 py-2.5 rounded-xl border ${accentBorder} hover:opacity-90 transition-opacity"
        >
          Start course
          <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/>
          </svg>
        </a>
        <a href="${url('')}" class="text-sm text-gray-400 dark:text-neutral-500 hover:text-gray-600 dark:hover:text-neutral-300 transition-colors">Back to overview</a>
      </div>
    </div>
  `;
}

export async function afterMount(root, params, query) {
  const role = lookupRole(params.role);
  if (!role) {
    if (typeof afterMountNotFound === 'function') await afterMountNotFound(root, params, query);
    return;
  }

  // Clear role context when returning to the role overview (matches the original inline script).
  try { localStorage.removeItem('platform-role-context'); } catch {}

  const STORAGE_KEY = 'platform-progress';
  function getProgress() {
    try { return JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}'); }
    catch { return {}; }
  }
  const progress = getProgress();

  // Overall progress bar (works for both flat sections and phase overview).
  const container = root.querySelector('[data-all-topic-ids]');
  const allIds = container?.dataset.allTopicIds?.split(',').filter(Boolean) ?? [];

  // Per-topic dots (flat sections only).
  const dots = root.querySelectorAll('.topic-completion-dot');
  let done = 0;
  if (dots.length > 0) {
    dots.forEach((dot) => {
      const id = dot.dataset.topicId ?? '';
      if (progress[id]) {
        done++;
        dot.classList.remove('bg-gray-200', 'dark:bg-neutral-700');
        dot.classList.add('bg-blue-500');
      }
    });
  } else if (allIds.length > 0) {
    done = allIds.filter((id) => progress[id]).length;
  }

  const total = dots.length > 0 ? dots.length : allIds.length;
  const fill = root.querySelector('#role-progress-fill');
  const text = root.querySelector('#role-progress-text');
  if (fill && total > 0) fill.style.width = `${Math.round((done / total) * 100)}%`;
  if (text) text.textContent = `${done} of ${total} topics completed`;

  // Per-phase progress bars on phase cards.
  root.querySelectorAll('[data-phase-topic-ids]').forEach((card) => {
    const ids = card.dataset.phaseTopicIds?.split(',').filter(Boolean) ?? [];
    const phaseDone = ids.filter((id) => progress[id]).length;
    const bar = card.querySelector('.phase-progress-bar');
    const label = card.querySelector('.phase-progress-text');
    if (bar && ids.length > 0) bar.style.width = `${Math.round((phaseDone / ids.length) * 100)}%`;
    if (label) label.textContent = `${phaseDone} / ${ids.length}`;
  });
}
