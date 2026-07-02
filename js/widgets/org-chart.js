// Port of src/components/widgets/OrgChart.astro — data-driven org chart (tree + detail panel
// on desktop, accordion on mobile). Deviates from the plain widget contract per CONTRACTS.md
// §3 / job brief: org charts are driven by topic.orgChart frontmatter, not static markup, so
// this module exports render(orgChart) and init(root, { orgChart }) instead of render()/init(root).
//
// Every string that originates from topic.orgChart (node titles/descriptions/responsibilities/
// competencies) is untrusted frontmatter content and MUST be escaped before interpolation —
// see CONTRACTS.md §2 / §6. The one exception is the `<script type="application/json"
// data-org-detail>` blob: JSON.stringify()'d structured data inside a non-executing script tag
// is safe to emit as-is (it never becomes HTML), matching the original's `set:html={JSON.stringify(...)}`.
import { escapeHtml } from '../markdown.js';
import { renderNode } from './org-tree-node.js';

function buildTree(nodes) {
  const childIds = new Set();
  for (const n of nodes) {
    for (const c of n.children ?? []) childIds.add(c);
  }
  const root = nodes.find((n) => !childIds.has(n.id));
  const byId = new Map(nodes.map((n) => [n.id, n]));

  const seen = new Set();
  function build(node) {
    if (!node || seen.has(node.id)) return null;
    seen.add(node.id);
    const children = [];
    for (const cid of node.children ?? []) {
      const child = build(byId.get(cid));
      if (child) children.push(child);
    }
    return { node, children };
  }
  return build(root);
}

export function render(orgChart) {
  const nodes = orgChart?.nodes ?? [];
  const crossFunctional = orgChart?.crossFunctional ?? [];
  const hasData = nodes.length > 0 || crossFunctional.length > 0;

  if (!hasData) {
    return `
      <div class="rounded-2xl border border-gray-200 dark:border-neutral-700 bg-white dark:bg-neutral-900 p-6 text-sm text-gray-500 dark:text-neutral-400">
        No org chart data provided.
      </div>
    `;
  }

  const tree = buildTree(nodes);

  const detailData = [...nodes, ...crossFunctional].map((n) => ({
    id: n.id,
    title: n.title,
    description: n.description ?? null,
    responsibilities: n.responsibilities ?? [],
    competencies: n.competencies ?? [],
  }));

  const treeHtml = tree
    ? `<ul class="org-root flex justify-center">${renderNode(tree)}</ul>`
    : '';

  const crossFunctionalHtml = crossFunctional.length > 0
    ? `
      <div class="border-t border-dashed border-gray-300 dark:border-neutral-700 mt-8 pt-6">
        <p class="text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-neutral-400 mb-3">
          Cross-functional
        </p>
        <div class="flex flex-wrap gap-3">
          ${crossFunctional.map((n) => `
            <button
              type="button"
              data-node-id="${escapeHtml(n.id)}"
              aria-pressed="false"
              class="org-node border border-gray-200 dark:border-neutral-700 rounded-xl px-4 py-3 text-sm font-medium bg-white dark:bg-neutral-900 hover:border-amber-400 dark:hover:border-amber-500 transition-colors cursor-pointer text-gray-900 dark:text-neutral-100"
            >
              ${escapeHtml(n.title)}
            </button>
          `).join('')}
        </div>
      </div>
    `
    : '';

  const mobileAccordionHtml = [...nodes, ...crossFunctional].map((n) => {
    const hasResp = n.responsibilities && n.responsibilities.length > 0;
    const hasComp = n.competencies && n.competencies.length > 0;
    return `
      <details class="group border border-gray-200 dark:border-neutral-700 rounded-xl bg-white dark:bg-neutral-900 open:border-amber-400 dark:open:border-amber-500">
        <summary class="flex items-center justify-between px-4 py-3 text-sm font-medium text-gray-900 dark:text-neutral-100 cursor-pointer list-none">
          <span>${escapeHtml(n.title)}</span>
          <svg class="w-4 h-4 text-gray-400 transition-transform group-open:rotate-180" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
          </svg>
        </summary>
        <div class="px-4 pb-4 pt-1 border-t border-gray-100 dark:border-neutral-800">
          ${n.description ? `<p class="text-sm text-gray-600 dark:text-neutral-300 mt-2">${escapeHtml(n.description)}</p>` : ''}
          ${hasResp ? `
            <div class="mt-3">
              <p class="text-xs font-semibold uppercase tracking-wide text-amber-600 dark:text-amber-400 mb-1">Responsibilities</p>
              <ul class="list-disc pl-5 space-y-1 text-sm text-gray-700 dark:text-neutral-300">
                ${n.responsibilities.map((r) => `<li>${escapeHtml(r)}</li>`).join('')}
              </ul>
            </div>
          ` : ''}
          ${hasComp ? `
            <div class="mt-3">
              <p class="text-xs font-semibold uppercase tracking-wide text-amber-600 dark:text-amber-400 mb-1">Competencies</p>
              <ul class="list-disc pl-5 space-y-1 text-sm text-gray-700 dark:text-neutral-300">
                ${n.competencies.map((c) => `<li>${escapeHtml(c)}</li>`).join('')}
              </ul>
            </div>
          ` : ''}
        </div>
      </details>
    `;
  }).join('');

  return `
    <div class="org-chart" data-org-chart>
      <script type="application/json" data-org-detail>${JSON.stringify(detailData)}</script>

      <div class="hidden md:flex md:gap-6 md:items-start">
        <div class="flex-1 overflow-x-auto">
          <div class="org-tree inline-block min-w-full">
            ${treeHtml}
          </div>
          ${crossFunctionalHtml}
        </div>

        <aside class="w-80 shrink-0">
          <div
            data-detail-panel
            class="bg-white dark:bg-neutral-900 border border-gray-200 dark:border-neutral-700 rounded-2xl p-6 sticky top-6"
          >
            <p data-detail-empty class="text-sm text-gray-500 dark:text-neutral-400">
              Select a role to see its details.
            </p>
            <div data-detail-body aria-live="polite" aria-atomic="true" class="hidden">
              <h3 data-detail-title class="text-lg font-semibold text-gray-900 dark:text-white"></h3>
              <p data-detail-description class="mt-2 text-sm text-gray-600 dark:text-neutral-300"></p>
              <div data-detail-resp class="mt-4">
                <p class="text-xs font-semibold uppercase tracking-wide text-amber-600 dark:text-amber-400 mb-2">Responsibilities</p>
                <ul data-detail-resp-list class="list-disc pl-5 space-y-1 text-sm text-gray-700 dark:text-neutral-300"></ul>
              </div>
              <div data-detail-comp class="mt-4">
                <p class="text-xs font-semibold uppercase tracking-wide text-amber-600 dark:text-amber-400 mb-2">Competencies</p>
                <ul data-detail-comp-list class="list-disc pl-5 space-y-1 text-sm text-gray-700 dark:text-neutral-300"></ul>
              </div>
            </div>
          </div>
        </aside>
      </div>

      <div class="md:hidden space-y-2">
        ${mobileAccordionHtml}
      </div>
    </div>
  `;
}

export function init(root) {
  root.querySelectorAll('[data-org-chart]').forEach((widget) => {
    if (widget.dataset.bound === '1') return;
    widget.dataset.bound = '1';

    const dataEl = widget.querySelector('[data-org-detail]');
    if (!dataEl) return;

    let details = [];
    try {
      details = JSON.parse(dataEl.textContent || '[]');
    } catch {
      details = [];
    }
    const byId = new Map(details.map((d) => [d.id, d]));

    const buttons = widget.querySelectorAll('.org-node');
    const panel = widget.querySelector('[data-detail-panel]');
    if (!panel) return;

    const empty = panel.querySelector('[data-detail-empty]');
    const body = panel.querySelector('[data-detail-body]');
    const titleEl = panel.querySelector('[data-detail-title]');
    const descEl = panel.querySelector('[data-detail-description]');
    const respWrap = panel.querySelector('[data-detail-resp]');
    const respList = panel.querySelector('[data-detail-resp-list]');
    const compWrap = panel.querySelector('[data-detail-comp]');
    const compList = panel.querySelector('[data-detail-comp-list]');

    const SELECTED = [
      'border-amber-500',
      'bg-amber-50',
      'dark:bg-amber-900/20',
      'dark:border-amber-400',
      'text-amber-900',
      'dark:text-amber-200',
    ];

    function fillList(ul, items) {
      if (!ul) return;
      ul.innerHTML = '';
      for (const item of items) {
        const li = document.createElement('li');
        li.textContent = item;
        ul.appendChild(li);
      }
    }

    function select(id) {
      const detail = byId.get(id);
      if (!detail) return;

      buttons.forEach((b) => {
        const active = b.dataset.nodeId === id;
        b.classList.toggle('text-gray-900', !active);
        b.classList.toggle('dark:text-neutral-100', !active);
        SELECTED.forEach((cls) => b.classList.toggle(cls, active));
        b.setAttribute('aria-pressed', active ? 'true' : 'false');
      });

      empty?.classList.add('hidden');
      body?.classList.remove('hidden');

      if (titleEl) titleEl.textContent = detail.title;
      if (descEl) {
        descEl.textContent = detail.description || '';
        descEl.classList.toggle('hidden', !detail.description);
      }
      fillList(respList, detail.responsibilities);
      respWrap?.classList.toggle('hidden', detail.responsibilities.length === 0);
      fillList(compList, detail.competencies);
      compWrap?.classList.toggle('hidden', detail.competencies.length === 0);
    }

    buttons.forEach((btn) => {
      btn.addEventListener('click', () => {
        const id = btn.dataset.nodeId;
        if (id) select(id);
      });
    });
  });
}
