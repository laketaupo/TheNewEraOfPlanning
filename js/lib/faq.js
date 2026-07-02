// Port of src/lib/faq.ts for the build-free SPA.
// validateFaq() is intentionally not ported — that check now lives in
// scripts/validate-refs.mjs and runs at build/index-generation time, not in the browser.
import { getIndex } from '../content.js';

export function getFaqEntries() {
  return getIndex().faq;
}
