#!/usr/bin/env node
// Replacement for build-time validateGlossary()/validateFaq()/role-chapter-ref checks (src/lib/*.ts).
// Run before committing content/role/glossary/faq changes; exits non-zero on any bad reference.
import { readFileSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const index = JSON.parse(readFileSync(join(ROOT, 'data/content-index.json'), 'utf8'));

const errors = [];

const topicIds = new Set(index.topics.map((t) => `${t.chapterSlug}/${t.slug}`));
const termSlugs = new Set(index.glossary.map((t) => t.slug));
const VALID_THEMES = new Set(['technology', 'process', 'data', 'people']);

for (const term of index.glossary) {
  for (const ref of term.seeAlso) {
    if (!topicIds.has(ref)) errors.push(`Glossary "${term.slug}": invalid seeAlso reference "${ref}"`);
  }
  for (const ref of term.related) {
    if (!termSlugs.has(ref)) errors.push(`Glossary "${term.slug}": invalid related reference "${ref}" (no such glossary term)`);
  }
}

for (const entry of index.faq) {
  if (!VALID_THEMES.has(entry.theme)) errors.push(`FAQ "${entry.slug}": invalid theme "${entry.theme}"`);
  for (const ref of entry.seeAlso) {
    if (!topicIds.has(ref)) errors.push(`FAQ "${entry.slug}": invalid seeAlso reference "${ref}"`);
  }
  for (const ref of entry.related) {
    if (!termSlugs.has(ref)) errors.push(`FAQ "${entry.slug}": invalid related reference "${ref}" (no such glossary term)`);
  }
}

// Role -> chapter reference validation (mirrors src/lib/roles.ts resolveChapter()).
const chaptersBySlug = index.chapters;
for (const role of index.roles) {
  if (!role.phases) continue;
  const seen = new Set();
  for (const phase of role.phases) {
    for (const chapterSlug of phase.chapters) {
      if (seen.has(chapterSlug)) { errors.push(`Role "${role.slug}": duplicate chapter reference "${chapterSlug}"`); continue; }
      seen.add(chapterSlug);
      const chapter = chaptersBySlug[chapterSlug];
      if (!chapter) { errors.push(`Role "${role.slug}": unknown chapter slug "${chapterSlug}"`); continue; }
      if (chapter.hidden) errors.push(`Role "${role.slug}": reference into hidden chapter "${chapterSlug}"`);
    }
  }
}

if (errors.length > 0) {
  console.error(`validate-refs: ${errors.length} error(s):`);
  for (const e of errors) console.error(`  - ${e}`);
  process.exit(1);
}
console.log('validate-refs: all references valid.');
