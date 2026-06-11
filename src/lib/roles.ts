import { getChapters, getTopics, type TopicMeta } from './chapters';

export interface RoleSectionConfig {
  title: string;
  description?: string;
  topics: string[]; // "chapter-slug/topic-slug" references into src/content/chapters/
}

export interface RoleConfig {
  title: string;
  description: string;
  icon: string;
  color: string;
  order: number;
  department?: string;
  comingSoon?: boolean;
  sections: RoleSectionConfig[];
  slug: string;
  url: string;
}

export interface RoleTopic extends TopicMeta {
  topicId: string;
  chapterTitle: string;
  chapterColor: string;
  pillarLabel: string;
}

export interface ResolvedRoleSection {
  title: string;
  description?: string;
  topics: RoleTopic[];
}

// Eagerly load all role config files
const roleFiles = import.meta.glob('../content/roles/*.json', { eager: true });

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
 * Resolves a role's "chapter-slug/topic-slug" references to full topic metadata.
 * Throws on bad references so `npm run build` fails loudly instead of silently
 * dropping topics from a course.
 *
 * Note: topicId uses the site-wide `ch{chapterOrder}-t{topicOrder}` scheme.
 * Chapter orders restart per module, so IDs collide across pillars (e.g. two
 * different topics can both be `ch1-t1`) — completing one ticks both. That is
 * existing site-wide behavior of the platform-progress store; migrating to
 * collision-free IDs is intentionally out of scope here.
 */
export function resolveRoleSections(role: RoleConfig): ResolvedRoleSection[] {
  const allTopics = getTopics();
  const allChapters = getChapters();
  const seen = new Set<string>();

  return role.sections.map((section) => ({
    title: section.title,
    description: section.description,
    topics: section.topics.map((ref) => {
      const fail = (reason: string): never => {
        throw new Error(`[roles] Role "${role.slug}", section "${section.title}": ${reason}: "${ref}"`);
      };
      if (seen.has(ref)) fail('duplicate topic reference');
      seen.add(ref);

      const slashIdx = ref.indexOf('/');
      if (slashIdx === -1) fail('malformed topic reference (expected "chapter-slug/topic-slug")');
      const chapterSlug = ref.slice(0, slashIdx);
      const topicSlug = ref.slice(slashIdx + 1);

      const chapter = allChapters.find((c) => c.slug === chapterSlug);
      const topic = allTopics.find((t) => t.chapterSlug === chapterSlug && t.slug === topicSlug);
      if (!chapter || !topic) fail('unknown topic reference');
      if (chapter!.hidden) fail('reference into hidden chapter');

      const pillar = topic!.pillar ?? 'technology';
      return {
        ...topic!,
        topicId: `ch${chapter!.order}-t${topic!.order}`,
        chapterTitle: chapter!.title,
        chapterColor: chapter!.color,
        pillarLabel: pillar.charAt(0).toUpperCase() + pillar.slice(1),
      } as RoleTopic;
    }),
  }));
}

export function getRoleStats(sections: ResolvedRoleSection[]): { topicCount: number; totalMinutes: number } {
  const topics = sections.flatMap((s) => s.topics);
  return {
    topicCount: topics.length,
    totalMinutes: topics.reduce((sum, t) => sum + t.estimatedMinutes, 0),
  };
}
