// Boot entry point (loaded as <script type="module" src="js/app.js">).
import { BASE, url } from './base-url.js';
import { initContentIndex, getIndex } from './content.js';
import { initRouter } from './router.js';
import { mountSiteOverlay } from './shell/site-overlay.js';
import { mountUserDashboard } from './shell/user-dashboard.js';
import { mountRoleMatrix } from './shell/role-matrix.js';
import { mountThemeToggle } from './shell/theme-toggle.js';
import { mountIntroOverlay } from './shell/intro-overlay.js';
import { mountSearch } from './shell/search.js';
import { initTopicProgress } from './shell/topic-progress.js';

// Restores the real deep-link URL encoded by 404.html's redirect trick (see 404.html) before the
// router's first render, so a direct navigation/refresh to a nested route resolves correctly.
function restoreDeepLinkFromRedirect() {
  const params = new URLSearchParams(window.location.search);
  const p = params.get('p');
  if (p == null) return;
  const decoded = decodeURIComponent(p);
  const [pathAndQuery, hash] = decoded.split('#');
  const [path, qs] = pathAndQuery.split('?');
  const newUrl = BASE + path.replace(/^\/+/, '') + (qs ? '?' + qs : '') + (hash ? '#' + hash : '');
  history.replaceState({}, '', newUrl);
}

async function boot() {
  restoreDeepLinkFromRedirect();
  document.querySelector('link[rel="icon"]')?.setAttribute('href', url('favicon.svg'));
  document.querySelector('meta[name="base-url"]')?.setAttribute('content', BASE);

  await initContentIndex();
  const index = getIndex();

  const glossaryDataEl = document.getElementById('glossary-data');
  if (glossaryDataEl) glossaryDataEl.textContent = JSON.stringify(index.glossaryTerms);
  const topicMapEl = document.getElementById('topic-map');
  if (topicMapEl) topicMapEl.textContent = JSON.stringify(index.topicMap);

  // Shell modules mount their own DOM once; they do not depend on route state.
  mountSiteOverlay(document.body);
  mountRoleMatrix(document.body);
  mountUserDashboard(document.body);
  mountThemeToggle(document.getElementById('theme-toggle-slot'));
  mountIntroOverlay(document.body);
  mountSearch(document.body);

  // Per-route behavior (re-queries route-rendered DOM, so it must re-run after every render,
  // unlike the mount*() calls above which target fixed chrome mounted once at boot).
  window.addEventListener('page-rendered', () => initTopicProgress());

  initRouter();
}

boot();
