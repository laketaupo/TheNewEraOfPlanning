// Port of src/lib/roles.ts for the build-free SPA.
import { getIndex } from '../content.js';
import { getChapters, getTopicsForChapter } from './chapters.js';

const CATEGORY_LABELS = {
  people: 'People',
  process: 'Process',
  data: 'Data',
  technology: 'Technology',
};

const CATEGORY_ORDER = ['people', 'process', 'data', 'technology'];

function categoryOf(chapterSlug) {
  if (chapterSlug.startsWith('people-')) return 'people';
  if (chapterSlug.startsWith('data-')) return 'data';
  if (
    chapterSlug.startsWith('sop-') ||
    chapterSlug.startsWith('soe-') ||
    chapterSlug.startsWith('exec-') ||
    chapterSlug.startsWith('process-')
  ) return 'process';
  return 'technology';
}

export function getLearningPhases() {
  return getIndex().learningPhases;
}

export function getRoles() {
  return getIndex().roles;
}

export function getRole(slug) {
  return getRoles().find((r) => r.slug === slug);
}

/**
 * Resolves a chapter slug to a ResolvedRoleSection.
 * Bad references (unknown slug, hidden chapter, duplicate reference) are logged and skipped
 * instead of throwing — hard validation now lives in scripts/validate-refs.mjs (build-time,
 * not runtime), so a bad ref here degrades gracefully in the browser rather than breaking the page.
 */
function resolveChapter(chapterSlug, roleSlug, allChapters, seen) {
  const warn = (reason) => {
    console.warn(`[roles] Role "${roleSlug}", chapter "${chapterSlug}": ${reason}`);
    return null;
  };
  if (seen.has(chapterSlug)) return warn('duplicate chapter reference');
  seen.add(chapterSlug);

  const chapter = allChapters.find((c) => c.slug === chapterSlug);
  if (!chapter) return warn('unknown chapter slug');
  if (chapter.hidden) return warn('reference into hidden chapter');

  const theme = chapter.theme ?? 'technology';
  const topics = getTopicsForChapter(chapterSlug).map((topic) => ({
    ...topic,
    topicId: `${chapterSlug}/${topic.slug}`,
    chapterTitle: chapter.title,
    chapterColor: chapter.color,
    themeLabel: theme.charAt(0).toUpperCase() + theme.slice(1),
  }));

  return {
    title: chapter.title,
    description: chapter.description,
    topics,
    chapterSlug,
  };
}

export function resolveRolePhases(role) {
  if (!role.phases) return null;
  const allLearningPhases = getLearningPhases();
  const allChapters = getChapters();
  const seen = new Set();

  return allLearningPhases.map((lp) => {
    const rolePhase = role.phases.find((rp) => rp.phaseId === lp.id);
    if (!rolePhase || rolePhase.chapters.length === 0) {
      return {
        phaseId: lp.id,
        title: lp.title,
        goal: lp.goal,
        keyAreas: lp.keyAreas,
        behaviors: lp.behaviors,
        sections: [],
        categoryGroups: [],
        isEmpty: true,
      };
    }
    const sections = rolePhase.chapters
      .map((slug) => resolveChapter(slug, role.slug, allChapters, seen))
      .filter((section) => section !== null);
    const grouped = new Map();
    for (const section of sections) {
      const cat = categoryOf(section.chapterSlug);
      if (!grouped.has(cat)) grouped.set(cat, []);
      grouped.get(cat).push(section);
    }
    const categoryGroups = CATEGORY_ORDER
      .filter((cat) => grouped.has(cat))
      .map((cat) => ({ category: cat, label: CATEGORY_LABELS[cat], sections: grouped.get(cat) }));
    return {
      phaseId: lp.id,
      title: lp.title,
      goal: lp.goal,
      keyAreas: rolePhase.keyAreas ?? lp.keyAreas,
      behaviors: lp.behaviors,
      sections,
      categoryGroups,
      isEmpty: false,
    };
  });
}

export function resolveRoleSections(role) {
  const phases = resolveRolePhases(role);
  if (phases) return phases.flatMap((p) => p.sections);
  return [];
}

export function getRoleStats(sections) {
  const topics = sections.flatMap((s) => s.topics);
  return {
    topicCount: topics.length,
    totalMinutes: topics.reduce((sum, t) => sum + t.estimatedMinutes, 0),
  };
}
