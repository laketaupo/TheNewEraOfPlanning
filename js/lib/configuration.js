// Port of src/lib/configuration.ts for the build-free SPA.
// scripts/gen-content-index.mjs already compiles + sanitizes each entry's markdown body into
// `body` HTML and sorts by `order`, so this is just a passthrough onto the cached index.
import { getIndex } from '../content.js';

export function getConfigurationEntries() {
  return getIndex().configuration;
}
