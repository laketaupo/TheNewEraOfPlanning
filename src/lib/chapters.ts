export interface ChapterMeta {
  title: string;
  description: string;
  icon: string;
  color: string;
  order: number;
  slug: string;
  pillar?: string;
  module?: string;
  hidden?: boolean;
}

export interface OrgNode {
  id: string;
  title: string;
  description?: string;
  responsibilities?: string[];
  competencies?: string[];
}

export interface TopicMeta {
  title: string;
  description: string;
  order: number;
  chapter: string;
  estimatedMinutes: number;
  widget: string;
  widgetStep?: number;
  nodeType?: string;
  summary?: string;
  topicLayout?: string;
  bullets?: string[];
  nodeLocation?: string;
  lineInLabel?: string;
  lineOutLabel?: string;
  durationLabel?: string;
  transportMode?: string;
  consumptionLabel?: string;
  cards?: { title: string; description: string; icon?: string }[];
  tableColumns?: string[];
  tableRows?: string[][];
  left?: { title: string; points: string[] };
  right?: { title: string; points: string[] };
  orgChart?: {
    nodes: Array<OrgNode & { children?: string[] }>;
    crossFunctional?: Array<OrgNode>;
  };
  roles?: string[];
  steps?: Array<{
    label: string;
    assignments: Record<string, string>;
  }>;
  slug: string;
  chapterSlug: string;
  url: string;
  chapterUrl: string;
  pillar?: string;
  module?: string;
}

// Eagerly load all chapter _meta.json files
const chapterMetaFiles = import.meta.glob('../content/chapters/*/_meta.json', { eager: true });

// Eagerly load all topic .md files (frontmatter only via glob)
const topicFiles = import.meta.glob('../content/chapters/*/*.md', { eager: true });

function slugFromPath(path: string): string {
  const parts = path.split('/');
  return parts[parts.length - 1].replace(/\.md$/, '');
}

function chapterSlugFromPath(path: string): string {
  const parts = path.split('/');
  // path looks like: ../content/chapters/01-understanding-basics/01-items.md
  return parts[parts.length - 2];
}

export function getChapters(pillar?: string): ChapterMeta[] {
  return Object.entries(chapterMetaFiles)
    .map(([path, mod]: [string, any]) => {
      const chapterSlug = path.split('/').slice(-2, -1)[0];
      return { ...mod, slug: chapterSlug } as ChapterMeta;
    })
    .filter((ch) => !pillar || ch.pillar === pillar)
    .sort((a, b) => a.order - b.order);
}

export function getChapterUrl(ch: ChapterMeta): string {
  const pillar = ch.pillar ?? 'technology';
  const module = ch.module ?? 'planning-software';
  return `${import.meta.env.BASE_URL}${pillar}/${module}/${ch.slug}`;
}

export function getTopics(): TopicMeta[] {
  const allChapters = getChapters();
  return Object.entries(topicFiles)
    .map(([path, mod]: [string, any]) => {
      const fm = mod.frontmatter ?? {};
      const topicSlug = slugFromPath(path);
      const chapterSlug = chapterSlugFromPath(path);
      const chapter = allChapters.find((c) => c.slug === chapterSlug);
      const pillar = chapter?.pillar ?? 'technology';
      const module = chapter?.module ?? 'planning-software';
      return {
        title: fm.title ?? '',
        description: fm.description ?? '',
        order: fm.order ?? 0,
        chapter: fm.chapter ?? chapterSlug,
        estimatedMinutes: fm.estimatedMinutes ?? 3,
        widget: fm.widget ?? '',
        widgetStep: fm.widgetStep ?? undefined,
        nodeType: fm.nodeType ?? undefined,
        summary: fm.summary ?? undefined,
        topicLayout: fm.topicLayout ?? undefined,
        bullets: fm.bullets ?? undefined,
        nodeLocation: fm.nodeLocation ?? undefined,
        lineInLabel: fm.lineInLabel ?? undefined,
        lineOutLabel: fm.lineOutLabel ?? undefined,
        durationLabel: fm.durationLabel ?? undefined,
        transportMode: fm.transportMode ?? undefined,
        consumptionLabel: fm.consumptionLabel ?? undefined,
        cards: fm.cards ?? undefined,
        tableColumns: fm.tableColumns ?? undefined,
        tableRows: fm.tableRows ?? undefined,
        left: fm.left ?? undefined,
        right: fm.right ?? undefined,
        orgChart: fm.orgChart ?? undefined,
        roles: fm.roles ?? undefined,
        steps: fm.steps ?? undefined,
        slug: topicSlug,
        chapterSlug,
        url: `${import.meta.env.BASE_URL}${pillar}/${module}/${chapterSlug}/${topicSlug}`,
        chapterUrl: `${import.meta.env.BASE_URL}${pillar}/${module}/${chapterSlug}`,
        pillar,
        module,
      } as TopicMeta;
    })
    .sort((a, b) => {
      if (a.chapterSlug !== b.chapterSlug) return a.chapterSlug.localeCompare(b.chapterSlug);
      return a.order - b.order;
    });
}

export function getTopicsForChapter(chapterSlug: string): TopicMeta[] {
  return getTopics().filter((t) => t.chapterSlug === chapterSlug);
}

/** Returns [prev, next] for a given topic url, scoped to the same pillar */
export function getAdjacentTopics(url: string): [TopicMeta | null, TopicMeta | null] {
  const all = getTopics();
  const current = all.find((t) => t.url === url);
  if (!current) return [null, null];
  const scoped = all.filter((t) => t.pillar === current.pillar);
  const idx = scoped.findIndex((t) => t.url === url);
  return [idx > 0 ? scoped[idx - 1] : null, idx < scoped.length - 1 ? scoped[idx + 1] : null];
}
