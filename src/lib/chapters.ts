export interface ChapterMeta {
  title: string;
  description: string;
  icon: string;
  color: string;
  order: number;
  slug: string;
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
  slug: string;
  chapterSlug: string;
  url: string;
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

export function getChapters(): ChapterMeta[] {
  return Object.entries(chapterMetaFiles)
    .map(([path, mod]: [string, any]) => {
      const chapterSlug = path.split('/').slice(-2, -1)[0];
      return { ...mod, slug: chapterSlug } as ChapterMeta;
    })
    .sort((a, b) => a.order - b.order);
}

export function getTopics(): TopicMeta[] {
  return Object.entries(topicFiles)
    .map(([path, mod]: [string, any]) => {
      const fm = mod.frontmatter ?? {};
      const topicSlug = slugFromPath(path);
      const chapterSlug = chapterSlugFromPath(path);
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
        slug: topicSlug,
        chapterSlug,
        url: `/chapters/${chapterSlug}/${topicSlug}`,
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

/** Returns [prev, next] for a given topic url */
export function getAdjacentTopics(url: string): [TopicMeta | null, TopicMeta | null] {
  const all = getTopics();
  const idx = all.findIndex((t) => t.url === url);
  return [idx > 0 ? all[idx - 1] : null, idx < all.length - 1 ? all[idx + 1] : null];
}
