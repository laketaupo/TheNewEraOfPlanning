// Port of the `?from=roles/x/y` navigation-override inline script from src/layouts/BaseLayout.astro.
// Called by router.js after every render when `?from=` is present in the query string (see
// CONTRACTS.md §5). Reads the same window.__chapterPhaseCtx / window.__topicRoleCtx globals that
// js/pages/chapter-index.js and js/pages/topic.js compute live per CONTRACTS.md "tricky spots" #1
// (these replace what Astro used to inject at build time per-route).
import { url } from '../base-url.js';
import { escapeHtml } from '../markdown.js';

function setNavLabel(a, longLabel, shortLabel) {
  const spans = a.querySelectorAll('span');
  if (spans.length > 0) {
    spans.forEach((s) => {
      const cls = s.className.split(' ');
      s.textContent = cls.includes('hidden') ? longLabel : shortLabel;
    });
  } else {
    const textNodes = Array.from(a.childNodes).filter((n) => n.nodeType === Node.TEXT_NODE);
    if (textNodes.length > 0) textNodes[0].textContent = longLabel;
    else a.textContent = longLabel;
  }
}

/** `fromParam` is the raw `?from=` value (e.g. "roles/supply-planner/2"), already URL-decoded by URLSearchParams. */
export function applyRoleNav(fromParam) {
  if (!fromParam) return;

  const fromUrl = url(fromParam.replace(/^\//, ''));
  const rolesMatch = fromParam.match(/^roles\/([^/]+)\/(\d+)$/);
  const roleKey = rolesMatch ? `${rolesMatch[1]}/${rolesMatch[2]}` : null;
  const backUrl = rolesMatch ? url(`roles/${rolesMatch[1]}`) : fromUrl;

  const chapterPhaseCtx = window.__chapterPhaseCtx || null;
  const topicRoleCtx = window.__topicRoleCtx || null;
  const ctxEntry =
    (roleKey && ((chapterPhaseCtx && chapterPhaseCtx.map && chapterPhaseCtx.map[roleKey]) || (topicRoleCtx && topicRoleCtx[roleKey]))) || null;
  const roleTitle = ctxEntry ? ctxEntry.roleTitle : null;
  const fromLabel = roleTitle || (rolesMatch ? `Phase ${rolesMatch[2]}` : 'Back');

  // Override header back link -> role overview page.
  const backLink = document.getElementById('nav-back-link');
  if (backLink) {
    backLink.setAttribute('href', backUrl);
    const textNode = Array.from(backLink.childNodes).find((n) => n.nodeType === Node.TEXT_NODE && n.textContent.trim().length > 0);
    if (textNode) textNode.textContent = ` ${fromLabel}`;
  }

  // Override chapter index "Back to overview" link -> role overview page.
  const chapterBackOverview = document.getElementById('chapter-back-overview');
  if (chapterBackOverview) {
    chapterBackOverview.setAttribute('href', backUrl);
    chapterBackOverview.textContent = `Back to ${fromLabel}`;
  }

  // Swap chapter tab bar with phase chapters (chapter index page only). #chapter-tab-bar is not
  // actually rendered anywhere in the site today (confirmed: no such id exists in any page) — this
  // mirrors that same dead branch faithfully rather than inventing a new UI element.
  if (roleKey && chapterPhaseCtx && chapterPhaseCtx.map) {
    const phaseEntry = chapterPhaseCtx.map[roleKey];
    const tabBar = document.getElementById('chapter-tab-bar');
    if (tabBar && phaseEntry) {
      tabBar.innerHTML = phaseEntry.chapters
        .map((ch, i) => {
          const isActive = ch.slug === chapterPhaseCtx.currentChapterSlug;
          const cls = isActive
            ? `text-xs px-3 py-1 rounded-full transition-colors ${chapterPhaseCtx.bgClass} ${chapterPhaseCtx.textClass} font-medium`
            : 'text-xs px-3 py-1 rounded-full transition-colors text-gray-500 dark:text-neutral-500 hover:text-gray-900 dark:hover:text-neutral-300';
          return `<a href="${escapeHtml(url(ch.url))}" class="${cls}">${i + 1}. ${escapeHtml(ch.title)}</a>`;
        })
        .join('');
    }
  }

  // Handle [data-role-nav] prev/next links on topic pages.
  const nav = document.querySelector('[data-role-nav]');
  if (nav) {
    const topicEntry = roleKey && topicRoleCtx ? topicRoleCtx[roleKey] : null;
    const navLinks = Array.from(nav.querySelectorAll('a[href]'));
    const prevA = navLinks[0] || null;
    const nextA = navLinks.length > 1 ? navLinks[navLinks.length - 1] : null;

    if (topicEntry) {
      if (prevA) {
        if (topicEntry.prevUrl) {
          prevA.setAttribute('href', url(topicEntry.prevUrl));
          setNavLabel(prevA, topicEntry.prevTitle || 'Previous', 'Prev');
        } else {
          prevA.setAttribute('href', backUrl);
          setNavLabel(prevA, fromLabel, fromLabel);
        }
      }
      if (nextA && nextA !== prevA) {
        if (topicEntry.nextUrl) {
          nextA.setAttribute('href', url(topicEntry.nextUrl));
          setNavLabel(nextA, topicEntry.nextTitle || 'Next', 'Next');
        } else {
          nextA.setAttribute('href', backUrl);
          const finishSpan = nextA.querySelector('span');
          if (finishSpan) finishSpan.textContent = 'Complete phase';
          else nextA.textContent = 'Complete phase ✓';
        }
      }
    } else {
      // Fallback: original cross-chapter logic.
      const pathParts = window.location.pathname.replace(/\/$/, '').split('/').filter(Boolean);
      const currentChapter = pathParts.length >= 2 ? pathParts[pathParts.length - 2] : null;

      navLinks.forEach((a) => {
        const href = a.getAttribute('href');
        if (!href) return;
        const cleanHref = href.split('?')[0].replace(/\/$/, '');

        if (cleanHref === fromUrl.replace(/\/$/, '') || cleanHref === '') {
          a.setAttribute('href', fromUrl);
          setNavLabel(a, fromLabel, fromLabel);
          return;
        }

        const linkChapterParts = cleanHref.split('/').filter(Boolean);
        const linkChapter = linkChapterParts.length >= 2 ? linkChapterParts[linkChapterParts.length - 2] : null;
        if (currentChapter && linkChapter !== currentChapter) {
          a.setAttribute('href', fromUrl);
          setNavLabel(a, fromLabel, fromLabel);
        } else {
          a.setAttribute('href', `${cleanHref}?from=${encodeURIComponent(fromParam)}`);
        }
      });
    }
  }

  // On chapter index page: propagate ?from= to all topic/start links in main.
  const main = document.querySelector('main');
  if (main && !nav) {
    main.querySelectorAll('a[href]').forEach((a) => {
      if (a.id === 'chapter-back-overview') return;
      const href = a.getAttribute('href');
      if (!href || href.startsWith('http') || href.startsWith('#') || href.startsWith('mailto:')) return;
      const cleanHref = href.split('?')[0];
      a.setAttribute('href', `${cleanHref}?from=${encodeURIComponent(fromParam)}`);
    });
  }
}
