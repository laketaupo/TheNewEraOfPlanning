#!/usr/bin/env node
// Generates /data/search-index.json: {url,title,description,text}[] per topic.
// Replaces Pagefind — matched client-side by js/shell/search.js via simple substring scoring.
import { readFileSync, writeFileSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import matter from 'gray-matter';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const CONTENT_DIR = join(ROOT, 'content');
const index = JSON.parse(readFileSync(join(ROOT, 'data/content-index.json'), 'utf8'));

function stripMarkdown(md) {
  return md
    .replace(/```[\s\S]*?```/g, ' ')
    .replace(/`[^`]*`/g, ' ')
    .replace(/!\[[^\]]*\]\([^)]*\)/g, ' ')
    .replace(/\[([^\]]*)\]\([^)]*\)/g, '$1')
    .replace(/[#>*_~-]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

const entries = index.topics.map((t) => {
  let text = '';
  try {
    const raw = readFileSync(join(CONTENT_DIR, 'chapters', t.chapterSlug, t.file), 'utf8');
    const { content } = matter(raw);
    text = stripMarkdown(content);
  } catch {
    text = '';
  }
  // Fold in frontmatter-derived prose fields so node-topic/card-grid/etc. topics (which have no body) are searchable too.
  const extra = [t.summary, ...(t.bullets ?? []), ...(t.cards ?? []).map((c) => `${c.title} ${c.description}`)]
    .filter(Boolean)
    .join(' ');
  return { url: t.url, title: t.title, description: t.description, text: `${extra} ${text}`.trim().slice(0, 2000) };
});

// FAQ + configuration entries are also searchable.
for (const f of index.faq) {
  entries.push({ url: `faq#${f.slug}`, title: f.question, description: f.answer.slice(0, 160), text: f.answer });
}
for (const c of index.configuration) {
  entries.push({ url: `technology/configuration#${c.slug}`, title: c.title, description: c.description, text: c.body.replace(/<[^>]+>/g, ' ') });
}

writeFileSync(join(ROOT, 'data/search-index.json'), JSON.stringify(entries));
console.log(`Wrote data/search-index.json: ${entries.length} entries.`);
