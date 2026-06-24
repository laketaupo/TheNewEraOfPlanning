import faqRaw from '../content/faq.json';
import { getTopics } from './chapters';
import { getGlossaryTerms } from './glossary';

export interface FaqEntry {
  slug: string;
  question: string;
  answer: string;
  theme: string;
  seeAlso: string[];
  related: string[];
}

const VALID_THEMES = new Set(['technology', 'process', 'data', 'people']);

export function getFaqEntries(): FaqEntry[] {
  return (faqRaw as FaqEntry[]).map(e => ({
    ...e,
    seeAlso: e.seeAlso ?? [],
    related: e.related ?? [],
  }));
}

export function validateFaq(): void {
  const entries = getFaqEntries();
  const topics = getTopics();
  const topicIds = new Set(topics.map(t => `${t.chapterSlug}/${t.slug}`));
  const glossaryTerms = getGlossaryTerms();
  const termSlugs = new Set(glossaryTerms.map(t => t.slug));

  for (const entry of entries) {
    if (!VALID_THEMES.has(entry.theme)) {
      throw new Error(
        `FAQ "${entry.slug}": invalid theme "${entry.theme}". ` +
        `Must be one of: technology, process, data, people.`
      );
    }
    for (const ref of entry.seeAlso) {
      if (!topicIds.has(ref)) {
        throw new Error(
          `FAQ "${entry.slug}": invalid seeAlso reference "${ref}". ` +
          `Check that the chapter-slug/topic-slug exists in src/content/chapters/.`
        );
      }
    }
    for (const ref of entry.related) {
      if (!termSlugs.has(ref)) {
        throw new Error(
          `FAQ "${entry.slug}": invalid related reference "${ref}". ` +
          `No glossary term with that slug exists.`
        );
      }
    }
  }
}
