// Port of src/lib/chapters.ts for the build-free SPA.
// All sorting/ordering logic that used to derive from content/order.json now reads
// pre-sorted/pre-indexed data out of content-index.json (see CONTRACTS.md §1) — this module
// just re-applies the theme/module ordering (chapter.order itself is already precomputed by
// scripts/gen-content-index.mjs) and exposes the same function surface as the original.
import { getIndex } from '../content.js';

function themeOrderIndex(theme) {
  const idx = getIndex().themes.indexOf(theme);
  return idx >= 0 ? idx : 9999;
}

function moduleOrderIndex(module, theme) {
  const list = getIndex().modules[theme] ?? [];
  const idx = list.indexOf(module);
  return idx >= 0 ? idx : 9999;
}

export function getThemes() {
  return getIndex().themes;
}

export function getModulesForTheme(theme) {
  return getIndex().modules[theme] ?? [];
}

export function getChapters(theme) {
  return Object.entries(getIndex().chapters)
    .map(([slug, meta]) => ({ ...meta, slug }))
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
      return a.order - b.order;
    });
}

export function getChapterUrl(ch) {
  const theme = ch.theme ?? 'technology';
  const module = ch.module ?? 'planning-software';
  return `${theme}/${module}/${ch.slug}`;
}

export function getTopics() {
  return [...getIndex().topics];
}

export function getTopicsForChapter(chapterSlug) {
  return getTopics().filter((t) => t.chapterSlug === chapterSlug);
}

/** Returns [prev, next] for a given topic url, scoped to the same theme (precomputed in content-index.json's adjacency map). */
export function getAdjacentTopics(url) {
  const adj = getIndex().adjacency[url];
  if (!adj) return [null, null];
  const all = getIndex().topics;
  const prev = adj.prevUrl ? all.find((t) => t.url === adj.prevUrl) ?? null : null;
  const next = adj.nextUrl ? all.find((t) => t.url === adj.nextUrl) ?? null : null;
  return [prev, next];
}
