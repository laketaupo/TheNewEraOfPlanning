import siteOrder from '../content/order.json';

export interface ChapterMeta {
  title: string;
  description: string;
  icon: string;
  color: string;
  order: number;
  slug: string;
  theme?: string;
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
  inputs?: string[];
  outputs?: string[];
  systems?: string[];
  tasks?: string[];
  slug: string;
  chapterSlug: string;
  url: string;
  chapterUrl: string;
  theme?: string;
  module?: string;
}

// Eagerly load all chapter _meta.json files
const chapterMetaFiles = import.meta.glob('../content/chapters/*/_meta.json', { eager: true });

// Eagerly load all topic .md files (frontmatter only via glob)
const topicFiles = import.meta.glob('../content/chapters/*/*.md', { eager: true });

function slugFromPath(path: string): string {
  const parts = path.split('/');
  return parts[parts.length - 1].replace(/\.md$/, '').replace(/^\d+-/, '');
}

function chapterSlugFromPath(path: string): string {
  const parts = path.split('/');
  return parts[parts.length - 2];
}

function chapterOrderIndex(chapterSlug: string, module: string): number {
  const list = (siteOrder.chapters as Record<string, string[]>)[module] ?? [];
  const idx = list.indexOf(chapterSlug);
  return idx >= 0 ? idx : 9999;
}

function moduleOrderIndex(module: string, theme: string): number {
  const list = (siteOrder.modules as Record<string, string[]>)[theme] ?? [];
  const idx = list.indexOf(module);
  return idx >= 0 ? idx : 9999;
}

function themeOrderIndex(theme: string): number {
  const idx = siteOrder.themes.indexOf(theme);
  return idx >= 0 ? idx : 9999;
}

export function getThemes(): string[] {
  return siteOrder.themes;
}

export function getModulesForTheme(theme: string): string[] {
  return (siteOrder.modules as Record<string, string[]>)[theme] ?? [];
}

export function getChapters(theme?: string): ChapterMeta[] {
  return Object.entries(chapterMetaFiles)
    .map(([path, mod]: [string, any]) => {
      const chapterSlug = path.split('/').slice(-2, -1)[0];
      const module = mod.module ?? 'planning-software';
      const orderIdx = chapterOrderIndex(chapterSlug, module);
      return { ...mod, slug: chapterSlug, order: orderIdx + 1 } as ChapterMeta;
    })
    .filter((ch) => !theme || ch.theme === theme)
    .sort((a, b) => {
      const aTheme = a.theme ?? 'technology';
      const bTheme = b.theme ?? 'technology';
      const aModule = a.module ?? 'planning-software';
      const bModule = b.module ?? 'planning-software';
      const themeDiff = themeOrderIndex(aTheme) - themeOrderIndex(bTheme);
      if (themeDiff !== 0) return themeDiff;
      const moduleDiff = moduleOrderIndex(aModule, aTheme) - moduleOrderIndex(bModule, bTheme);
      if (moduleDiff !== 0) return moduleDiff;
      return chapterOrderIndex(a.slug, aModule) - chapterOrderIndex(b.slug, bModule);
    });
}

export function getChapterUrl(ch: ChapterMeta): string {
  const theme = ch.theme ?? 'technology';
  const module = ch.module ?? 'planning-software';
  return `${import.meta.env.BASE_URL}${theme}/${module}/${ch.slug}`;
}

export function getTopics(): TopicMeta[] {
  const allChapters = getChapters();
  return Object.entries(topicFiles)
    .map(([path, mod]: [string, any]) => {
      const fm = mod.frontmatter ?? {};
      const topicSlug = slugFromPath(path);
      const chapterSlug = chapterSlugFromPath(path);
      const chapter = allChapters.find((c) => c.slug === chapterSlug);
      const theme = chapter?.theme ?? 'technology';
      const module = chapter?.module ?? 'planning-software';
      const topicList = (siteOrder.topics as Record<string, string[]>)[chapterSlug] ?? [];
      const topicIdx = topicList.indexOf(topicSlug);
      const order = topicIdx >= 0 ? topicIdx + 1 : 9999;
      return {
        title: fm.title ?? '',
        description: fm.description ?? '',
        order,
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
        inputs: fm.inputs ?? undefined,
        outputs: fm.outputs ?? undefined,
        systems: fm.systems ?? undefined,
        tasks: fm.tasks ?? undefined,
        slug: topicSlug,
        chapterSlug,
        url: `${import.meta.env.BASE_URL}${theme}/${module}/${chapterSlug}/${topicSlug}`,
        chapterUrl: `${import.meta.env.BASE_URL}${theme}/${module}/${chapterSlug}`,
        theme,
        module,
      } as TopicMeta;
    })
    .sort((a, b) => {
      const aTheme = a.theme ?? 'technology';
      const bTheme = b.theme ?? 'technology';
      const aModule = a.module ?? 'planning-software';
      const bModule = b.module ?? 'planning-software';
      const themeDiff = themeOrderIndex(aTheme) - themeOrderIndex(bTheme);
      if (themeDiff !== 0) return themeDiff;
      const moduleDiff = moduleOrderIndex(aModule, aTheme) - moduleOrderIndex(bModule, bTheme);
      if (moduleDiff !== 0) return moduleDiff;
      const chapterDiff = chapterOrderIndex(a.chapterSlug, aModule) - chapterOrderIndex(b.chapterSlug, bModule);
      if (chapterDiff !== 0) return chapterDiff;
      return a.order - b.order;
    });
}

export function getTopicsForChapter(chapterSlug: string): TopicMeta[] {
  return getTopics().filter((t) => t.chapterSlug === chapterSlug);
}

/** Returns [prev, next] for a given topic url, scoped to the same theme */
export function getAdjacentTopics(url: string): [TopicMeta | null, TopicMeta | null] {
  const all = getTopics();
  const current = all.find((t) => t.url === url);
  if (!current) return [null, null];
  const scoped = all.filter((t) => t.theme === current.theme);
  const idx = scoped.findIndex((t) => t.url === url);
  return [idx > 0 ? scoped[idx - 1] : null, idx < scoped.length - 1 ? scoped[idx + 1] : null];
}
