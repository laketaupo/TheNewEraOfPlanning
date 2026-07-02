// Loads and caches /data/content-index.json once at boot. All js/lib/*.js modules
// query the cached object synchronously via getIndex() — see CONTRACTS.md for the schema.
import { url } from './base-url.js';

let _indexPromise = null;
let _index = null;

/** Kicks off (once) the fetch of content-index.json. Safe to call multiple times. */
function loadContentIndex() {
  if (!_indexPromise) {
    _indexPromise = fetch(url('data/content-index.json')).then((r) => {
      if (!r.ok) throw new Error(`Failed to load content-index.json: ${r.status}`);
      return r.json();
    });
  }
  return _indexPromise;
}

/** Must be awaited once during app boot before any page renders. */
export async function initContentIndex() {
  _index = await loadContentIndex();
  return _index;
}

/** Synchronous access to the cached index. Throws if initContentIndex() hasn't resolved yet. */
export function getIndex() {
  if (!_index) throw new Error('content-index not loaded — call and await initContentIndex() first');
  return _index;
}

let _searchIndexPromise = null;
/** Lazily loads the search index (only needed when the search modal is opened). */
export function loadSearchIndex() {
  if (!_searchIndexPromise) {
    _searchIndexPromise = fetch(url('data/search-index.json')).then((r) => {
      if (!r.ok) throw new Error(`Failed to load search-index.json: ${r.status}`);
      return r.json();
    });
  }
  return _searchIndexPromise;
}

/**
 * Fetches one topic's precompiled, sanitized body HTML from
 * content/chapters/<chapterSlug>/<topicSlug>.html (written by scripts/gen-content-index.mjs).
 * Called per-navigation from js/pages/topic.js — no caching, matches the lazy per-topic fetch
 * behavior this replaces the old baked-in-JSON bodyHtml with.
 */
export async function fetchTopicBodyHtml(chapterSlug, topicSlug) {
  const res = await fetch(url(`content/chapters/${chapterSlug}/${topicSlug}.html`));
  if (!res.ok) {
    console.error(`Failed to load topic body html for ${chapterSlug}/${topicSlug}: ${res.status}`);
    return '';
  }
  return res.text();
}
