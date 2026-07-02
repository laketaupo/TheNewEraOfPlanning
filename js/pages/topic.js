// SPA equivalent of src/pages/[theme]/[module]/[chapter]/[topic].astro — the topic page renderer.
// Route: /:theme/:module/:chapter/:topic. Owns layout-registry + widget-registry dispatch,
// adjacency, and role-phase context. The topic body is fetched per-navigation, pre-sanitized,
// from content/chapters/<chapterSlug>/<topicSlug>.html (see fetchTopicBodyHtml in ../content.js
// and CONTRACTS.md §6).
import { getIndex, fetchTopicBodyHtml } from '../content.js';
import { getAdjacentTopics, getTopics } from '../lib/chapters.js';
import { getRoles, resolveRolePhases } from '../lib/roles.js';
import { getLayout } from '../layouts/layout-registry.js';
import { getWidget } from '../widgets/registry.js';
import { render as renderNotFound } from './not-found.js';

function lookupTopic(params) {
  const index = getIndex();
  const topic = index.topics.find(
    (t) => t.theme === params.theme && t.module === params.module && t.chapterSlug === params.chapter && t.slug === params.topic,
  );
  if (!topic) return null;
  const chapter = index.chapters[topic.chapterSlug];
  // Hidden chapters (e.g. 99-layout-showcase) still render on direct URL — see the matching
  // comment in js/pages/chapter-index.js's lookupChapter().
  if (!chapter) return null;
  return { topic, chapter };
}

// Per-role-phase topic navigation context (mirrors the topicRoleCtxMap loop in the original
// [topic].astro) — consumed by shell/role-phase-nav.js via window.__topicRoleCtx, exactly as the
// original build-time-injected global was consumed.
function buildTopicRoleCtxMap(topicUrl) {
  const map = {};
  for (const role of getRoles().filter((r) => !r.comingSoon && r.phases)) {
    const phases = resolveRolePhases(role);
    if (!phases) continue;
    phases.forEach((phase, pi) => {
      if (phase.isEmpty) return;
      const phaseTopics = phase.sections.flatMap((s) => s.topics);
      const idx = phaseTopics.findIndex((t) => t.url === topicUrl);
      if (idx === -1) return;
      const key = `${role.slug}/${pi + 1}`;
      const from = `?from=roles/${key}`;
      map[key] = {
        roleTitle: role.title,
        roleUrl: role.url,
        prevUrl: idx > 0 ? phaseTopics[idx - 1].url + from : null,
        prevTitle: idx > 0 ? phaseTopics[idx - 1].title : null,
        nextUrl: idx < phaseTopics.length - 1 ? phaseTopics[idx + 1].url + from : null,
        nextTitle: idx < phaseTopics.length - 1 ? phaseTopics[idx + 1].title : null,
      };
    });
  }
  return map;
}

async function buildSharedProps(topic, chapter) {
  const [prev, next] = getAdjacentTopics(topic.url);
  const totalTopics = getTopics().filter((t) => t.theme === topic.theme).length;

  const bodyHtml = await fetchTopicBodyHtml(topic.chapterSlug, topic.slug);

  const widgetMod = topic.widget ? getWidget(topic.widget) : null;
  const widgetHtml = widgetMod ? (topic.widget === 'org-chart' ? widgetMod.render(topic.orgChart) : widgetMod.render()) : '';

  return {
    ...topic,
    title: topic.title,
    description: topic.description,
    chapterTitle: chapter.title,
    chapterSlug: topic.chapterSlug,
    chapterColor: chapter.color,
    chapterUrl: topic.chapterUrl,
    topicOrder: topic.order,
    topicSlug: topic.slug,
    chapterOrder: chapter.order,
    prevUrl: prev?.url,
    nextUrl: next?.url,
    prevTitle: prev?.title,
    nextTitle: next?.title,
    theme: topic.theme,
    module: topic.module,
    totalTopics,
    bodyHtml,
    widgetHtml,
  };
}

export async function render(params, query) {
  const resolved = lookupTopic(params);
  if (!resolved) return renderNotFound(params, query);
  const { topic, chapter } = resolved;

  const sharedProps = await buildSharedProps(topic, chapter);
  const layoutMod = getLayout(topic.topicLayout);
  return layoutMod.render(sharedProps);
}

export async function afterMount(root, params) {
  const resolved = lookupTopic(params);
  if (!resolved) return;
  const { topic } = resolved;

  // Role-phase nav context — see buildTopicRoleCtxMap() above and CONTRACTS.md "tricky spots" #1.
  window.__topicRoleCtx = buildTopicRoleCtxMap(topic.url);

  const layoutMod = getLayout(topic.topicLayout);
  if (typeof layoutMod.afterMount === 'function') await layoutMod.afterMount(root, topic);

  if (topic.widget) {
    const widgetMod = getWidget(topic.widget);
    if (widgetMod && typeof widgetMod.init === 'function') {
      widgetMod.init(root, { step: topic.widgetStep, orgChart: topic.orgChart });
    }
  }
}
