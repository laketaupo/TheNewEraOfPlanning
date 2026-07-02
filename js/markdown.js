// Markdown rendering (marked + DOMPurify) now happens exclusively at generation time in Node
// (see scripts/gen-content-index.mjs) — topic bodies arrive on the content index pre-sanitized
// as `bodyHtml`. This module now only holds the plain-string escaping helper still used by
// layouts to escape frontmatter-derived strings at render time (see CONTRACTS.md §6).

/** Escapes a plain string for safe insertion as HTML text (use when innerHTML is unavoidable). */
export function escapeHtml(str) {
  return String(str ?? '').replace(/[&<>"']/g, (c) => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;',
  }[c]));
}
