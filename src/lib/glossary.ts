import glossaryRaw from '../content/glossary.json';
import { getTopics } from './chapters';

export interface GlossaryTerm {
  slug: string;
  term: string;
  definition: string;
  aliases: string[];
  related: string[];
  seeAlso: string[];
}

export function getGlossaryTerms(): GlossaryTerm[] {
  return (glossaryRaw as GlossaryTerm[]).map(t => ({
    ...t,
    aliases: t.aliases ?? [],
    related: t.related ?? [],
    seeAlso: t.seeAlso ?? [],
  }));
}

export function validateGlossary(): void {
  const terms = getGlossaryTerms();
  const topics = getTopics();
  const topicIds = new Set(topics.map(t => `${t.chapterSlug}/${t.slug}`));
  const termSlugs = new Set(terms.map(t => t.slug));

  for (const term of terms) {
    for (const ref of term.seeAlso) {
      if (!topicIds.has(ref)) {
        throw new Error(
          `Glossary "${term.slug}": invalid seeAlso reference "${ref}". ` +
          `Check that the chapter-slug/topic-slug exists in src/content/chapters/.`
        );
      }
    }
    for (const ref of term.related) {
      if (!termSlugs.has(ref)) {
        throw new Error(
          `Glossary "${term.slug}": invalid related reference "${ref}". ` +
          `No glossary term with that slug exists.`
        );
      }
    }
  }
}

export function getGlossaryMap(): Record<string, GlossaryTerm> {
  return Object.fromEntries(getGlossaryTerms().map(t => [t.slug, t]));
}
