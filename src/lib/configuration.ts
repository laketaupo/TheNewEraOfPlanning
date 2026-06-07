export interface ConfigurationEntry {
  title: string;
  description: string;
  order: number;
  screenshot: string;
  slug: string;
  body: string;
}

const entryFiles = import.meta.glob('../content/configuration/*.md', { eager: true });

export function getConfigurationEntries(): ConfigurationEntry[] {
  return Object.entries(entryFiles)
    .map(([path, mod]: [string, any]) => {
      const fm = mod.frontmatter ?? {};
      const slug = path.split('/').pop()?.replace(/\.md$/, '') ?? '';
      return {
        title: fm.title ?? '',
        description: fm.description ?? '',
        order: fm.order ?? 0,
        screenshot: fm.screenshot ?? '',
        slug,
        body: mod.compiledContent?.() ?? '',
      } as ConfigurationEntry;
    })
    .sort((a, b) => a.order - b.order);
}
