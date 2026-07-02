// Derives the site base path from where this script is loaded, so the same
// files work whether served at "/" (local dev) or "/TheNewEraOfPlanning/" (GitHub Pages).
function detectBase() {
  const el = document.currentScript || document.querySelector('script[src*="base-url.js"]');
  if (el && el.src) {
    const u = new URL(el.src);
    // .../BASE/js/base-url.js -> BASE (with trailing slash)
    return u.pathname.replace(/js\/base-url\.js$/, '');
  }
  return '/';
}

export const BASE = detectBase();

/** Joins BASE with a relative path (no leading slash expected on `path`). */
export function url(path = '') {
  return BASE + path.replace(/^\/+/, '');
}

/** Strips BASE from an absolute pathname, returning the route-relative path (no leading/trailing slash). */
export function stripBase(pathname) {
  let rel = pathname.startsWith(BASE) ? pathname.slice(BASE.length) : pathname.replace(/^\/+/, '');
  return rel.replace(/^\/+|\/+$/g, '');
}
