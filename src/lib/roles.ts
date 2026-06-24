import { getChapters, getTopics, getTopicsForChapter, type TopicMeta } from './chapters';

export interface RolePhaseConfig {
  phaseId: string;
  chapters: string[]; // chapter slugs, e.g. "sop-01-sop-fundamentals"
  keyAreas?: string[]; // role-specific overrides; falls back to global learning-phases.json
}

export interface RoleConfig {
  title: string;
  description: string;
  icon: string;
  color: string;
  order: number;
  department?: string;
  comingSoon?: boolean;
  sections?: never; // removed; kept as never to catch stale JSON
  phases?: RolePhaseConfig[];
  slug: string;
  url: string;
}

export interface LearningPhase {
  id: string;
  title: string;
  goal: string;
  keyAreas: string[];
  behaviors: string[];
}

export interface RoleTopic extends TopicMeta {
  topicId: string;
  chapterTitle: string;
  chapterColor: string;
  themeLabel: string;
}

export interface ResolvedRoleSection {
  title: string;
  description?: string;
  topics: RoleTopic[];
}

export interface ResolvedRolePhase {
  phaseId: string;
  title: string;
  goal: string;
  keyAreas: string[];
  behaviors: string[];
  sections: ResolvedRoleSection[];
  isEmpty: boolean;
}

// Eagerly load all role config files
const roleFiles = import.meta.glob('../content/roles/*.json', { eager: true });

// Eagerly load the global learning phases definition
const learningPhasesFile = import.meta.glob('../content/learning-phases.json', { eager: true });

export function getLearningPhases(): LearningPhase[] {
  const mod = Object.values(learningPhasesFile)[0] as any;
  return (mod?.default ?? mod) as LearningPhase[];
}

export function getRoles(): RoleConfig[] {
  return Object.entries(roleFiles)
    .map(([path, mod]: [string, any]) => {
      const data = mod.default ?? mod;
      const slug = path.split('/').pop()!.replace(/\.json$/, '');
      return {
        ...data,
        slug,
        url: `${import.meta.env.BASE_URL}roles/${slug}`,
      } as RoleConfig;
    })
    .sort((a, b) => a.order - b.order);
}

export function getRole(slug: string): RoleConfig | undefined {
  return getRoles().find((r) => r.slug === slug);
}

/**
 * Resolves a chapter slug to a ResolvedRoleSection.
 * Throws at build time if the chapter slug is unknown or hidden.
 * All topics in the chapter are included in order.json order.
 */
function resolveChapter(
  chapterSlug: string,
  roleSlug: string,
  allChapters: ReturnType<typeof getChapters>,
  seen: Set<string>,
): ResolvedRoleSection {
  const fail = (reason: string): never => {
    throw new Error(`[roles] Role "${roleSlug}", chapter "${chapterSlug}": ${reason}`);
  };
  if (seen.has(chapterSlug)) fail('duplicate chapter reference');
  seen.add(chapterSlug);

  const chapter = allChapters.find((c) => c.slug === chapterSlug);
  if (!chapter) fail('unknown chapter slug');
  if (chapter!.hidden) fail('reference into hidden chapter');

  const theme = chapter!.theme ?? 'technology';
  const topics = getTopicsForChapter(chapterSlug).map((topic) => ({
    ...topic,
    topicId: `${chapterSlug}/${topic.slug}`,
    chapterTitle: chapter!.title,
    chapterColor: chapter!.color,
    themeLabel: theme.charAt(0).toUpperCase() + theme.slice(1),
  })) as RoleTopic[];

  return {
    title: chapter!.title,
    description: chapter!.description,
    topics,
  };
}

export function resolveRolePhases(role: RoleConfig): ResolvedRolePhase[] | null {
  if (!role.phases) return null;
  const allLearningPhases = getLearningPhases();
  const allChapters = getChapters();
  const seen = new Set<string>();

  return allLearningPhases.map((lp) => {
    const rolePhase = role.phases!.find((rp) => rp.phaseId === lp.id);
    if (!rolePhase || rolePhase.chapters.length === 0) {
      return {
        phaseId: lp.id,
        title: lp.title,
        goal: lp.goal,
        keyAreas: lp.keyAreas,
        behaviors: lp.behaviors,
        sections: [],
        isEmpty: true,
      };
    }
    return {
      phaseId: lp.id,
      title: lp.title,
      goal: lp.goal,
      keyAreas: rolePhase.keyAreas ?? lp.keyAreas,
      behaviors: lp.behaviors,
      sections: rolePhase.chapters.map((slug) =>
        resolveChapter(slug, role.slug, allChapters, seen),
      ),
      isEmpty: false,
    };
  });
}

export function resolveRoleSections(role: RoleConfig): ResolvedRoleSection[] {
  const phases = resolveRolePhases(role);
  if (phases) return phases.flatMap((p) => p.sections);
  return [];
}

export function getRoleStats(sections: ResolvedRoleSection[]): { topicCount: number; totalMinutes: number } {
  const topics = sections.flatMap((s) => s.topics);
  return {
    topicCount: topics.length,
    totalMinutes: topics.reduce((sum, t) => sum + t.estimatedMinutes, 0),
  };
}
