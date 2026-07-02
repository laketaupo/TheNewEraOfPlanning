// History-API client-side router. Shell-once, swap-#app-main model.
// See CONTRACTS.md §5 for the full post-render lifecycle this drives.
import { stripBase } from './base-url.js';
import { getIndex } from './content.js';
import { scanGlossary } from './shell/glossary-tooltip.js';
import { applyRoleNav } from './shell/role-phase-nav.js';

const mainEl = () => document.getElementById('app-main');

// Ordered route table: literal segments win before the generic `:theme...` patterns.
// Each entry: { pattern: string[] (':name' = param), load: () => import(module), skipGlossary? }
// skipGlossary: true suppresses inline glossary-term tooltips on pillar/module/chapter overview
// pages and learn-by-role phase pages — tooltips stay active inside actual topic content.
const routes = [
  { pattern: [], load: () => import('./pages/home.js') },
  { pattern: ['about'], load: () => import('./pages/about.js') },
  { pattern: ['progress'], load: () => import('./pages/progress.js') },
  // Route is 'pillars', not 'themes' — the site was renamed from /themes to /pillars (see git
  // history); CLAUDE.md's routing table is stale on this point. js/pages/themes.js keeps its
  // filename (matches the internal "theme" terminology used throughout the codebase) but is
  // mounted at the real /pillars URL.
  { pattern: ['pillars'], load: () => import('./pages/themes.js') },
  { pattern: ['glossary'], load: () => import('./pages/glossary.js') },
  { pattern: ['faq'], load: () => import('./pages/faq.js') },
  { pattern: ['roles'], load: () => import('./pages/roles-index.js') },
  { pattern: ['roles', ':role'], load: () => import('./pages/role.js'), skipGlossary: true },
  { pattern: ['roles', ':role', ':phase'], load: () => import('./pages/role-phase.js'), skipGlossary: true },
  { pattern: ['technology', 'configuration'], load: () => import('./pages/configuration.js') },
  { pattern: [':theme', ':module', ':chapter', ':topic'], load: () => import('./pages/topic.js') },
  { pattern: [':theme', ':module', ':chapter'], load: () => import('./pages/chapter-index.js'), skipGlossary: true },
  { pattern: [':theme', ':module'], load: () => import('./pages/module.js'), skipGlossary: true },
  { pattern: [':theme'], load: () => import('./pages/pillar.js'), skipGlossary: true },
];

function matchRoute(segments) {
  for (const route of routes) {
    if (route.pattern.length !== segments.length) continue;
    const params = {};
    let ok = true;
    for (let i = 0; i < route.pattern.length; i++) {
      const p = route.pattern[i];
      if (p.startsWith(':')) params[p.slice(1)] = segments[i];
      else if (p !== segments[i]) { ok = false; break; }
    }
    if (!ok) continue;
    // `:theme` must be a real theme, otherwise literal routes like /roles or /about would
    // never be reachable if they happened to share a segment count with the generic pattern.
    if (params.theme && !getIndex().themes.includes(params.theme)) continue;
    return { route, params };
  }
  return null;
}

async function render(pathname, search) {
  const rel = stripBase(pathname);
  const segments = rel ? rel.split('/') : [];
  const query = new URLSearchParams(search);
  const main = mainEl();

  const matched = matchRoute(segments);
  let mod;
  try {
    mod = matched ? await matched.route.load() : await import('./pages/not-found.js');
  } catch (err) {
    console.error('Route module failed to load', err);
    mod = await import('./pages/not-found.js');
  }

  const params = matched ? matched.params : {};
  const html = await mod.render(params, query);
  main.innerHTML = html;

  if (typeof mod.afterMount === 'function') {
    await mod.afterMount(main, params, query);
  }

  if (!matched?.route.skipGlossary) {
    scanGlossary(main.querySelector('[data-pagefind-body]') ?? main);
  }
  if (query.get('from')) applyRoleNav(query.get('from'));

  window.scrollTo(0, 0);
  window.dispatchEvent(new CustomEvent('page-rendered', { detail: { pathname, params, query } }));
}

function navigate(pathname, search = '') {
  if (window.location.pathname === pathname && window.location.search === search) {
    render(pathname, search);
    return;
  }
  history.pushState({}, '', pathname + search);
  render(pathname, search);
}

function onLinkClick(e) {
  if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
  const a = e.target.closest('a[href]');
  if (!a) return;
  const href = a.getAttribute('href');
  if (!href || href.startsWith('http://') || href.startsWith('https://') || href.startsWith('#') || href.startsWith('mailto:') || a.target === '_blank') return;
  const urlObj = new URL(a.href, window.location.href);
  if (urlObj.origin !== window.location.origin) return;
  e.preventDefault();
  navigate(urlObj.pathname, urlObj.search);
}

export function initRouter() {
  document.addEventListener('click', onLinkClick);
  window.addEventListener('popstate', () => render(window.location.pathname, window.location.search));
  render(window.location.pathname, window.location.search);
}

export { navigate };
