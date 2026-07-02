#!/usr/bin/env node
// Generates /data/content-index.json from content/**.
// Reproduces the ordering/derivation logic of src/lib/{chapters,roles,glossary,faq,configuration}.ts
// exactly, so the browser can query pre-sorted, pre-derived data with zero runtime glob/import.meta usage.
// Also writes each topic's compiled HTML to content/chapters/<chapterSlug>/<topicSlug>.html alongside
// the source .md files — this per-topic .html file is the ONLY place the compiled/sanitized body
// lives; content-index.json carries frontmatter/metadata only (no body content), and the app fetches
// these .html files directly at runtime (see js/content.js's fetchTopicBodyHtml).
// Run manually (or in CI) whenever content/roles/glossary/faq/order.json change; commit the output.
import { readFileSync, readdirSync, statSync, writeFileSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import matter from 'gray-matter';
import { marked } from 'marked';
import { JSDOM } from 'jsdom';
import createDOMPurify from 'dompurify';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const CONTENT_DIR = join(ROOT, 'content');

const DOMPurify = createDOMPurify(new JSDOM('').window);
marked.setOptions({ gfm: true, breaks: false });

function readJson(relPath) {
  return JSON.parse(readFileSync(join(CONTENT_DIR, relPath), 'utf8'));
}

const siteOrder = readJson('order.json');
const glossaryRaw = readJson('glossary.json');
const faqRaw = readJson('faq.json');
const learningPhases = readJson('learning-phases.json');

function themeOrderIndex(theme) {
  const idx = siteOrder.themes.indexOf(theme);
  return idx >= 0 ? idx : 9999;
}
function moduleOrderIndex(module, theme) {
  const list = siteOrder.modules[theme] ?? [];
  const idx = list.indexOf(module);
  return idx >= 0 ? idx : 9999;
}
function chapterOrderIndex(chapterSlug, module) {
  const list = siteOrder.chapters[module] ?? [];
  const idx = list.indexOf(chapterSlug);
  return idx >= 0 ? idx : 9999;
}

// ---- Chapters (_meta.json) ----
const chapterDirs = readdirSync(join(CONTENT_DIR, 'chapters')).filter((d) =>
  statSync(join(CONTENT_DIR, 'chapters', d)).isDirectory(),
);

const chapters = {}; // slug -> meta
for (const slug of chapterDirs) {
  const metaPath = join(CONTENT_DIR, 'chapters', slug, '_meta.json');
  const meta = readJson(join('chapters', slug, '_meta.json').replace(/\\/g, '/'));
  const module = meta.module ?? 'planning-software';
  const orderIdx = chapterOrderIndex(slug, module);
  chapters[slug] = { ...meta, slug, order: orderIdx + 1 };
}

function chapterTheme(ch) { return ch.theme ?? 'technology'; }
function chapterModule(ch) { return ch.module ?? 'planning-software'; }

// ---- Topics (*.md frontmatter per chapter) ----
function slugFromFilename(filename) {
  return filename.replace(/\.md$/, '').replace(/^\d+-/, '');
}

const topics = [];
for (const chapterSlug of chapterDirs) {
  const chapter = chapters[chapterSlug];
  const dir = join(CONTENT_DIR, 'chapters', chapterSlug);
  const files = readdirSync(dir).filter((f) => f.endsWith('.md'));
  for (const file of files) {
    const raw = readFileSync(join(dir, file), 'utf8');
    const { data: fm, content } = matter(raw);
    const bodyHtml = DOMPurify.sanitize(marked.parse(content), { USE_PROFILES: { html: true } });
    const topicSlug = slugFromFilename(file);
    // This is the runtime data source — the app fetches this file directly on topic navigation
    // (see js/content.js's fetchTopicBodyHtml). It's also human-inspectable/diffable as a build artifact.
    writeFileSync(join(CONTENT_DIR, 'chapters', chapterSlug, `${topicSlug}.html`), bodyHtml);
    const theme = chapterTheme(chapter);
    const module = chapterModule(chapter);
    const topicList = siteOrder.topics[chapterSlug] ?? [];
    const topicIdx = topicList.indexOf(topicSlug);
    const order = topicIdx >= 0 ? topicIdx + 1 : 9999;
    topics.push({
      slug: topicSlug,
      file,
      chapterSlug,
      theme,
      module,
      url: `${theme}/${module}/${chapterSlug}/${topicSlug}`,
      chapterUrl: `${theme}/${module}/${chapterSlug}`,
      order,
      title: fm.title ?? '',
      description: fm.description ?? '',
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
      screenshot: fm.screenshot ?? undefined,
    });
  }
}

function sortKey(t) {
  return [themeOrderIndex(t.theme), moduleOrderIndex(t.module, t.theme), chapterOrderIndex(t.chapterSlug, t.module), t.order];
}
function cmp(a, b) {
  const ka = sortKey(a), kb = sortKey(b);
  for (let i = 0; i < ka.length; i++) if (ka[i] !== kb[i]) return ka[i] - kb[i];
  return 0;
}
topics.sort(cmp);

const chaptersSorted = Object.values(chapters).sort((a, b) => {
  const at = chapterTheme(a), bt = chapterTheme(b);
  const am = chapterModule(a), bm = chapterModule(b);
  const themeDiff = themeOrderIndex(at) - themeOrderIndex(bt);
  if (themeDiff !== 0) return themeDiff;
  const moduleDiff = moduleOrderIndex(am, at) - moduleOrderIndex(bm, bt);
  if (moduleDiff !== 0) return moduleDiff;
  return chapterOrderIndex(a.slug, am) - chapterOrderIndex(b.slug, bm);
});
void chaptersSorted; // chapters is consumed as a keyed object; order is derived client-side from `order` field

// ---- Adjacency (prev/next, scoped per theme) ----
const adjacency = {};
for (const theme of siteOrder.themes) {
  const scoped = topics.filter((t) => t.theme === theme);
  scoped.forEach((t, i) => {
    adjacency[t.url] = {
      prevUrl: i > 0 ? scoped[i - 1].url : null,
      prevTitle: i > 0 ? scoped[i - 1].title : null,
      nextUrl: i < scoped.length - 1 ? scoped[i + 1].url : null,
      nextTitle: i < scoped.length - 1 ? scoped[i + 1].title : null,
    };
  });
}

// ---- Roles ----
const roleFiles = readdirSync(join(CONTENT_DIR, 'roles')).filter((f) => f.endsWith('.json'));
const roles = roleFiles
  .map((f) => {
    const data = readJson(join('roles', f).replace(/\\/g, '/'));
    const slug = f.replace(/\.json$/, '');
    return { ...data, slug, url: `roles/${slug}` };
  })
  .sort((a, b) => a.order - b.order);

// ---- Glossary / FAQ ----
const glossary = glossaryRaw.map((t) => ({ ...t, aliases: t.aliases ?? [], related: t.related ?? [], seeAlso: t.seeAlso ?? [] }));
const faq = faqRaw.map((e) => ({ ...e, seeAlso: e.seeAlso ?? [], related: e.related ?? [] }));

const topicMap = Object.fromEntries(topics.map((t) => [`${t.chapterSlug}/${t.slug}`, { title: t.title, url: t.url }]));
const glossaryTerms = glossary.map((t) => ({ term: t.term, aliases: t.aliases, slug: t.slug, definition: t.definition }));

// ---- Configuration manual (precompiled sanitized bodies) ----
const configDir = join(CONTENT_DIR, 'configuration');
const configFiles = readdirSync(configDir).filter((f) => f.endsWith('.md'));
const configuration = configFiles
  .map((f) => {
    const raw = readFileSync(join(configDir, f), 'utf8');
    const { data: fm, content } = matter(raw);
    const slug = f.replace(/\.md$/, '');
    const html = DOMPurify.sanitize(marked.parse(content), { USE_PROFILES: { html: true } });
    return { title: fm.title ?? '', description: fm.description ?? '', order: fm.order ?? 0, screenshot: fm.screenshot ?? '', slug, body: html };
  })
  .sort((a, b) => a.order - b.order);

// ---- Assemble & write ----
const index = {
  themes: siteOrder.themes,
  modules: siteOrder.modules,
  chapters,
  topics,
  adjacency,
  roles,
  learningPhases,
  glossary,
  faq,
  topicMap,
  glossaryTerms,
  configuration,
};

writeFileSync(join(ROOT, 'data/content-index.json'), JSON.stringify(index));
console.log(`Wrote data/content-index.json: ${topics.length} topics, ${Object.keys(chapters).length} chapters, ${roles.length} roles.`);
