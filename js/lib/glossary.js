// Port of src/lib/glossary.ts for the build-free SPA.
// validateGlossary() is intentionally not ported — that check now lives in
// scripts/validate-refs.mjs and runs at build/index-generation time, not in the browser.
import { getIndex } from '../content.js';

export function getGlossaryTerms() {
  return getIndex().glossary;
}

export function getGlossaryMap() {
  return Object.fromEntries(getGlossaryTerms().map((t) => [t.slug, t]));
}
