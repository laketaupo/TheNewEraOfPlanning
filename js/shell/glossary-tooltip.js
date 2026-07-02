// Port of the glossary-tooltip inline <script is:inline> block from src/layouts/BaseLayout.astro
// (original ~lines 149-291): scans rendered topic content for glossary terms/aliases and wraps
// matches in <span class="glossary-term"> elements with hover-tooltip behavior, reading
// definitions from the #glossary-data JSON script block and showing them in the shared
// #glossary-tooltip card (both fixed chrome in index.html; js/app.js populates #glossary-data
// at boot from content-index.glossaryTerms).
//
// Per-route behavior binder (CONTRACTS.md §4b / §5): the original ran once via IIFE on full page
// load. Here, router.js calls scanGlossary(container) after EVERY route render, where `container`
// is document.querySelector('[data-pagefind-body]') ?? root — i.e. always fresh DOM produced by
// the most recent innerHTML swap of #app-main. Because that DOM node is brand new each time
// (the previous page's content, and any listeners bound to it, were discarded along with it),
// re-running the same wrap + rebind logic on it every call cannot double-wrap and cannot leak
// listeners onto stale nodes — there is nothing "already processed" to guard against.
import { url } from '../base-url.js';

// Parsed once and cached at module scope: #glossary-data itself is static chrome that never
// changes across navigations, so there's no need to re-read/re-parse the JSON script block
// (and definitely no need to re-fetch anything) on every scanGlossary() call.
let cachedMatchers = null;

// The shared #glossary-tooltip card is fixed chrome that persists across navigations (it's never
// part of the #app-main swap), so its hover-intent listeners only need to be bound once, lazily,
// guarded by this module-level flag.
let tooltipChromeBound = false;
let hideTimer = null;

function getMatchers() {
  if (cachedMatchers) return cachedMatchers;
  const dataEl = document.getElementById('glossary-data');
  if (!dataEl) return (cachedMatchers = []);

  let terms;
  try {
    terms = JSON.parse(dataEl.textContent);
  } catch {
    return (cachedMatchers = []);
  }
  if (!terms || terms.length === 0) return (cachedMatchers = []);

  // Flat list of { matchStr, slug, definition, term } covering term + aliases.
  const matchers = [];
  for (const t of terms) {
    matchers.push({ matchStr: t.term, slug: t.slug, definition: t.definition, term: t.term });
    for (const alias of t.aliases || []) {
      matchers.push({ matchStr: alias, slug: t.slug, definition: t.definition, term: t.term });
    }
  }
  // Sort longest match first so multi-word strings win over abbreviations.
  matchers.sort((a, b) => b.matchStr.length - a.matchStr.length);
  cachedMatchers = matchers;
  return matchers;
}

/** Single regex matching any term or alias (case-insensitive, word-boundary). */
function buildPattern(matchers) {
  const escaped = matchers.map((m) => m.matchStr.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'));
  return new RegExp('\\b(' + escaped.join('|') + ')\\b', 'gi');
}

function wrapTermsInParagraph(el, matchers, pattern) {
  const seen = new Set();
  const walker = document.createTreeWalker(el, NodeFilter.SHOW_TEXT, null);
  const nodes = [];
  let node;
  while ((node = walker.nextNode())) nodes.push(node);

  for (const textNode of nodes) {
    // Skip inside links, code, headings, buttons, or data-no-gloss elements.
    let parent = textNode.parentElement;
    while (parent && parent !== el) {
      const tag = parent.tagName;
      if (
        tag === 'A' || tag === 'CODE' || tag === 'PRE' ||
        tag === 'H1' || tag === 'H2' || tag === 'H3' ||
        tag === 'BUTTON' || parent.hasAttribute('data-no-gloss')
      ) {
        parent = null;
        break;
      }
      parent = parent.parentElement;
    }
    if (parent === null) continue;

    const text = textNode.textContent;
    if (!pattern.test(text)) {
      pattern.lastIndex = 0;
      continue;
    }
    pattern.lastIndex = 0;

    const frag = document.createDocumentFragment();
    let last = 0;
    let match;
    while ((match = pattern.exec(text)) !== null) {
      const matched = match[0];
      const matchedLower = matched.toLowerCase();
      const termDef = matchers.find((m) => m.matchStr.toLowerCase() === matchedLower);
      if (!termDef || seen.has(termDef.slug)) continue;
      seen.add(termDef.slug);

      if (match.index > last) {
        frag.appendChild(document.createTextNode(text.slice(last, match.index)));
      }
      const span = document.createElement('span');
      span.className = 'glossary-term';
      span.dataset.slug = termDef.slug;
      span.dataset.def = termDef.definition;
      span.dataset.term = termDef.term;
      // .textContent (not innerHTML) — safe even though `matched` is sliced from rendered
      // content, since textContent never parses its argument as markup.
      span.textContent = matched;
      frag.appendChild(span);
      last = match.index + matched.length;
    }
    pattern.lastIndex = 0;
    if (last === 0) continue;
    if (last < text.length) frag.appendChild(document.createTextNode(text.slice(last)));
    textNode.parentNode.replaceChild(frag, textNode);
  }
}

function clearHideTimer() {
  clearTimeout(hideTimer);
}

function scheduleHide() {
  clearHideTimer();
  hideTimer = setTimeout(() => {
    document.getElementById('glossary-tooltip')?.classList.add('hidden');
  }, 200);
}

function positionTooltip(tooltip, el) {
  const rect = el.getBoundingClientRect();
  const ttWidth = tooltip.offsetWidth || 340;
  const ttHeight = tooltip.offsetHeight || 100;
  let left = rect.left;
  let top = rect.bottom + 6;
  let placement = 'bottom';
  if (left + ttWidth > window.innerWidth - 12) left = window.innerWidth - ttWidth - 12;
  if (left < 12) left = 12;
  if (top + ttHeight > window.innerHeight - 12) {
    top = rect.top - ttHeight - 6;
    placement = 'top';
  }
  tooltip.dataset.placement = placement;
  tooltip.style.left = left + 'px';
  tooltip.style.top = top + 'px';
}

function showTooltip(target) {
  const tooltip = document.getElementById('glossary-tooltip');
  const tooltipTerm = document.getElementById('glossary-tooltip-term');
  const tooltipDef = document.getElementById('glossary-tooltip-def');
  const tooltipLink = document.getElementById('glossary-tooltip-link');
  if (!tooltip || !tooltipTerm || !tooltipDef || !tooltipLink) return;

  clearHideTimer();
  // SECURITY: term/definition are glossary content read at runtime from #glossary-data — plain
  // .textContent assignment, never innerHTML, so no escaping step is needed here (CONTRACTS.md §6).
  tooltipTerm.textContent = target.dataset.term || '';
  tooltipDef.textContent = target.dataset.def || '';
  tooltipLink.href = url('glossary') + '#' + target.dataset.slug;
  tooltip.classList.remove('hidden');
  positionTooltip(tooltip, target);
}

/** Binds the shared tooltip card's own hover-intent listeners exactly once per page session. */
function bindTooltipChromeOnce() {
  if (tooltipChromeBound) return;
  const tooltip = document.getElementById('glossary-tooltip');
  if (!tooltip) return;
  tooltip.addEventListener('mouseenter', clearHideTimer);
  tooltip.addEventListener('mouseleave', scheduleHide);
  tooltipChromeBound = true;
}

/**
 * Re-scans `container` for glossary terms/aliases, wraps matches, and (re)wires delegated
 * hover listeners scoped to `container`. Must be called by the router after every route render.
 */
export function scanGlossary(container) {
  if (!container) return;
  const matchers = getMatchers();
  if (matchers.length === 0) return;
  const pattern = buildPattern(matchers);

  container.querySelectorAll('p, li').forEach((p) => wrapTermsInParagraph(p, matchers, pattern));

  bindTooltipChromeOnce();

  // `container` is a fresh DOM node every navigation (the router just replaced #app-main's
  // contents), so binding delegated listeners on it directly here is correct and cheap — the
  // previous container, and the listeners attached to it, were already discarded with it.
  container.addEventListener('mouseover', (e) => {
    const target = e.target.closest('.glossary-term');
    if (!target) return;
    showTooltip(target);
  });

  container.addEventListener('mouseout', (e) => {
    const rel = e.relatedTarget;
    const toTerm = rel && rel.closest && rel.closest('.glossary-term');
    const toTooltip = rel && rel.closest && rel.closest('#glossary-tooltip');
    if (!toTerm && !toTooltip) scheduleHide();
  });
}
