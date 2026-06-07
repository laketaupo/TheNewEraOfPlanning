# Org Chart Hierarchy Redesign Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Extend the planning org chart with two new senior roles (Supply Director, Head of Supply Chain), replace the click-to-detail panel with a hover tooltip, add per-level color coding, and remove the cross-functional section.

**Architecture:** Three file changes only — the markdown data file gains two new YAML nodes (making Supply Director the new root), OrgTreeNode gains a `depth` prop that selects a color from a lookup array, and OrgChart strips the cross-functional section and detail panel, adds a fixed-position tooltip div, and rewrites its client script for mouseover/mouseleave.

**Tech Stack:** Astro 4, Tailwind CSS 3, vanilla TypeScript (in Astro `<script>` blocks), no external libraries.

---

## File Map

| File | Change |
|---|---|
| `src/content/chapters/people-01-planning-team/03-the-planning-org-chart.md` | Add two new nodes at top of `nodes` array; remove `crossFunctional` block |
| `src/components/widgets/OrgTreeNode.astro` | Add `depth` prop; apply tier color from lookup array; pass `depth + 1` to children |
| `src/components/widgets/OrgChart.astro` | Remove cross-functional section and detail panel; add tooltip div; rewrite client script; pass `depth={0}` to root node |

---

### Task 1: Add new roles to the markdown data file

**Files:**
- Modify: `src/content/chapters/people-01-planning-team/03-the-planning-org-chart.md`

- [ ] **Step 1: Insert two new nodes at the top of the `nodes:` array**

Open the file. The `nodes:` array currently starts with `- id: sop-lead`. Insert the following two entries **before** that line (as the first and second items in the array). The root-detection logic in `OrgChart.astro` finds the node not referenced in any other node's `children` — adding these two nodes with the correct `children` references makes `supply-director` the new root automatically.

```yaml
    - id: supply-director
      title: Supply Director
      description: Owns supply chain strategy and organisational performance at the senior leadership level.
      responsibilities:
        - Set supply chain strategy aligned to business objectives
        - Own supply chain investment decisions and performance targets
        - Represent supply chain at executive and board level
        - Build and develop leadership capability across the function
        - Drive transformation and continuous improvement agenda
      competencies:
        - Strategic leadership and vision
        - Financial acumen and P&L ownership
        - Executive stakeholder management
        - Organisational development
        - Deep supply chain expertise
      children:
        - head-of-supply-chain
    - id: head-of-supply-chain
      title: Head of Supply Chain
      description: Translates strategic direction into operational planning and execution.
      responsibilities:
        - Translate business strategy into supply chain plans and KPIs
        - Oversee integrated planning across demand, supply, and inventory
        - Drive cross-functional alignment between supply chain, commercial, and finance
        - Manage the planning leadership team and develop talent
        - Report supply chain performance to the Supply Director
      competencies:
        - Integrated business planning
        - Cross-functional leadership
        - Performance management and KPIs
        - Change management
        - Supply chain operations knowledge
      children:
        - sop-lead
```

- [ ] **Step 2: Remove the `crossFunctional:` section**

Delete the entire `crossFunctional:` block from the frontmatter. It starts at the line `  crossFunctional:` and ends after the `commercial-lead` node's last `competencies` entry. The section to delete looks like this (delete all of it):

```yaml
  crossFunctional:
    - id: finance-bp
      title: Finance Business Partner
      ...
    - id: commercial-lead
      title: Commercial Lead
      ...
```

- [ ] **Step 3: Verify the build compiles**

```bash
cd /Users/stefanbakker/Documents/Github/Development && npm run build
```

Expected: Build completes with no errors.

- [ ] **Step 4: Commit**

```bash
git add src/content/chapters/people-01-planning-team/03-the-planning-org-chart.md
git commit -m "feat(people): add Supply Director and Head of Supply Chain to org chart, remove cross-functional roles"
```

---

### Task 2: Add depth-based tier colors to OrgTreeNode

**Files:**
- Modify: `src/components/widgets/OrgTreeNode.astro`

- [ ] **Step 1: Replace the full file content**

Tailwind requires full class strings — no interpolation. The `tierClasses` array contains the complete class string for each depth level. `Math.min` ensures depth values beyond 4 fall back to emerald.

```astro
---
import type { OrgNode } from '../../lib/chapters';
import OrgTreeNode from './OrgTreeNode.astro';

interface TreeNode {
  node: OrgNode & { children?: string[] };
  children: TreeNode[];
}

export interface Props {
  node: TreeNode;
  depth?: number;
}

const { node, depth = 0 } = Astro.props;
const { node: data, children } = node;
const hasSiblingsBus = children.length > 1;

const tierClasses: string[] = [
  'border-l-4 border-amber-500 bg-amber-50 dark:bg-amber-500/10 text-amber-900 dark:text-amber-100',
  'border-l-4 border-violet-500 bg-violet-50 dark:bg-violet-500/10 text-violet-900 dark:text-violet-100',
  'border-l-4 border-indigo-500 bg-indigo-50 dark:bg-indigo-500/10 text-indigo-900 dark:text-indigo-100',
  'border-l-4 border-sky-500 bg-sky-50 dark:bg-sky-500/10 text-sky-900 dark:text-sky-100',
  'border-l-4 border-emerald-500 bg-emerald-50 dark:bg-emerald-500/10 text-emerald-900 dark:text-emerald-100',
];
const tierClass = tierClasses[Math.min(depth, tierClasses.length - 1)];
---

<li class="org-branch list-none">
  <button
    type="button"
    data-node-id={data.id}
    class={`org-node rounded-xl px-4 py-3 text-sm font-medium cursor-pointer ${tierClass}`}
  >
    {data.title}
  </button>

  {children.length > 0 && (
    <ul class:list={['org-children', { 'has-siblings': hasSiblingsBus }]}>
      {children.map((child) => <OrgTreeNode node={child} depth={depth + 1} />)}
    </ul>
  )}
</li>
```

- [ ] **Step 2: Verify the build compiles**

```bash
cd /Users/stefanbakker/Documents/Github/Development && npm run build
```

Expected: Build completes with no errors.

- [ ] **Step 3: Commit**

```bash
git add src/components/widgets/OrgTreeNode.astro
git commit -m "feat(org-chart): add depth-based tier color coding to OrgTreeNode"
```

---

### Task 3: Rework OrgChart — remove panel, add hover tooltip

**Files:**
- Modify: `src/components/widgets/OrgChart.astro`

- [ ] **Step 1: Replace the full file content**

Key changes from the current file:
- `crossFunctional` removed from Props, data serialization, desktop section, and mobile accordion
- `<aside>` detail panel removed
- Desktop wrapper changed from `md:flex` to `md:block` (no side panel to flex against)
- `depth={0}` passed to root `OrgTreeNode`
- Tooltip div added with `position:fixed` so it sits above all content regardless of scroll
- Client script: click-select logic replaced with `mouseover`/`mouseleave` on each `.org-node` button

```astro
---
import type { OrgNode } from '../../lib/chapters';
import OrgTreeNode from './OrgTreeNode.astro';

export interface Props {
  orgChart?: {
    nodes: Array<OrgNode & { children?: string[] }>;
  };
}

const { orgChart } = Astro.props;

const nodes = orgChart?.nodes ?? [];
const hasData = nodes.length > 0;

const childIds = new Set<string>();
for (const n of nodes) {
  for (const c of n.children ?? []) childIds.add(c);
}
const root = nodes.find((n) => !childIds.has(n.id));

const byId = new Map(nodes.map((n) => [n.id, n] as const));

interface TreeNode {
  node: OrgNode & { children?: string[] };
  children: TreeNode[];
}

const seen = new Set<string>();
function build(node: (OrgNode & { children?: string[] }) | undefined): TreeNode | null {
  if (!node || seen.has(node.id)) return null;
  seen.add(node.id);
  const children: TreeNode[] = [];
  for (const cid of node.children ?? []) {
    const child = build(byId.get(cid));
    if (child) children.push(child);
  }
  return { node, children };
}
const tree = build(root);

const detailData = nodes.map((n) => ({
  id: n.id,
  title: n.title,
  description: n.description ?? null,
  responsibilities: n.responsibilities ?? [],
  competencies: n.competencies ?? [],
}));
---

{!hasData ? (
  <div class="rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 p-6 text-sm text-gray-500 dark:text-gray-400">
    No org chart data provided.
  </div>
) : (
  <div class="org-chart" data-org-chart>
    <script type="application/json" data-org-detail set:html={JSON.stringify(detailData)} />

    <!-- Desktop: scrollable tree -->
    <div class="hidden md:block overflow-x-auto">
      <div class="org-tree inline-block min-w-full">
        {tree && (
          <ul class="org-root flex justify-center">
            <OrgTreeNode node={tree} depth={0} />
          </ul>
        )}
      </div>
    </div>

    <!-- Tooltip (desktop hover, fixed position so it clears overflow containers) -->
    <div
      data-org-tooltip
      style="display:none; position:fixed; z-index:50;"
      class="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl p-4 shadow-xl w-72 pointer-events-none"
    >
      <h4 data-tt-title class="text-sm font-semibold text-gray-900 dark:text-white mb-1"></h4>
      <p data-tt-desc class="text-xs text-gray-500 dark:text-gray-400 mb-2"></p>
      <div class="mt-2">
        <p class="text-xs font-semibold uppercase tracking-wide text-amber-600 dark:text-amber-400 mb-1">Responsibilities</p>
        <ul data-tt-resp-list class="list-disc pl-4 space-y-0.5 text-xs text-gray-700 dark:text-gray-300"></ul>
      </div>
      <div class="mt-3">
        <p class="text-xs font-semibold uppercase tracking-wide text-amber-600 dark:text-amber-400 mb-1">Competencies</p>
        <ul data-tt-comp-list class="list-disc pl-4 space-y-0.5 text-xs text-gray-700 dark:text-gray-300"></ul>
      </div>
    </div>

    <!-- Mobile: accordion -->
    <div class="md:hidden space-y-2">
      {nodes.map((n) => (
        <details class="group border border-gray-200 dark:border-gray-700 rounded-xl bg-white dark:bg-gray-900 open:border-amber-400 dark:open:border-amber-500">
          <summary class="flex items-center justify-between px-4 py-3 text-sm font-medium text-gray-900 dark:text-gray-100 cursor-pointer list-none">
            <span>{n.title}</span>
            <svg class="w-4 h-4 text-gray-400 transition-transform group-open:rotate-180" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
            </svg>
          </summary>
          <div class="px-4 pb-4 pt-1 border-t border-gray-100 dark:border-gray-800">
            {n.description && <p class="text-sm text-gray-600 dark:text-gray-300 mt-2">{n.description}</p>}
            {n.responsibilities && n.responsibilities.length > 0 && (
              <div class="mt-3">
                <p class="text-xs font-semibold uppercase tracking-wide text-amber-600 dark:text-amber-400 mb-1">Responsibilities</p>
                <ul class="list-disc pl-5 space-y-1 text-sm text-gray-700 dark:text-gray-300">
                  {n.responsibilities.map((r) => <li>{r}</li>)}
                </ul>
              </div>
            )}
            {n.competencies && n.competencies.length > 0 && (
              <div class="mt-3">
                <p class="text-xs font-semibold uppercase tracking-wide text-amber-600 dark:text-amber-400 mb-1">Competencies</p>
                <ul class="list-disc pl-5 space-y-1 text-sm text-gray-700 dark:text-gray-300">
                  {n.competencies.map((c) => <li>{c}</li>)}
                </ul>
              </div>
            )}
          </div>
        </details>
      ))}
    </div>
  </div>
)}

<style>
  .org-root {
    list-style: none;
    margin: 0;
    padding: 0;
  }
  .org-root,
  .org-children {
    display: flex;
    justify-content: center;
  }
  .org-branch {
    display: flex;
    flex-direction: column;
    align-items: center;
    list-style: none;
  }
  .org-children {
    margin: 0;
    padding: 1.5rem 0 0 0;
    list-style: none;
    position: relative;
  }
  .org-children::before {
    content: '';
    position: absolute;
    top: 0;
    left: 50%;
    width: 1px;
    height: 0.75rem;
    background: theme('colors.gray.300');
  }
  :global(.dark) .org-children::before {
    background: theme('colors.gray.700');
  }
  .org-children > .org-branch {
    position: relative;
    padding: 1.5rem 1rem 0 1rem;
  }
  .org-children > .org-branch::before {
    content: '';
    position: absolute;
    top: 0;
    left: 50%;
    width: 1px;
    height: 1.5rem;
    background: theme('colors.gray.300');
  }
  :global(.dark) .org-children > .org-branch::before {
    background: theme('colors.gray.700');
  }
  .org-children.has-siblings > .org-branch::after {
    content: '';
    position: absolute;
    top: 0;
    height: 1px;
    width: 100%;
    left: 0;
    background: theme('colors.gray.300');
  }
  :global(.dark) .org-children.has-siblings > .org-branch::after {
    background: theme('colors.gray.700');
  }
  .org-children.has-siblings > .org-branch:first-child::after {
    left: 50%;
    width: 50%;
  }
  .org-children.has-siblings > .org-branch:last-child::after {
    width: 50%;
  }
</style>

<script>
  document.querySelectorAll<HTMLElement>('[data-org-chart]').forEach((widget) => {
    const dataEl = widget.querySelector<HTMLScriptElement>('[data-org-detail]');
    if (!dataEl) return;

    interface Detail {
      id: string;
      title: string;
      description: string | null;
      responsibilities: string[];
      competencies: string[];
    }

    let details: Detail[] = [];
    try {
      details = JSON.parse(dataEl.textContent || '[]');
    } catch {
      details = [];
    }
    const byId = new Map(details.map((d) => [d.id, d]));

    const tooltip = widget.querySelector<HTMLElement>('[data-org-tooltip]');
    if (!tooltip) return;

    const ttTitle = tooltip.querySelector<HTMLElement>('[data-tt-title]');
    const ttDesc = tooltip.querySelector<HTMLElement>('[data-tt-desc]');
    const ttRespList = tooltip.querySelector<HTMLElement>('[data-tt-resp-list]');
    const ttCompList = tooltip.querySelector<HTMLElement>('[data-tt-comp-list]');

    function fillList(ul: HTMLElement | null, items: string[]) {
      if (!ul) return;
      ul.innerHTML = '';
      for (const item of items) {
        const li = document.createElement('li');
        li.textContent = item;
        ul.appendChild(li);
      }
    }

    function showTooltip(btn: HTMLElement, detail: Detail) {
      if (ttTitle) ttTitle.textContent = detail.title;
      if (ttDesc) {
        ttDesc.textContent = detail.description || '';
        ttDesc.classList.toggle('hidden', !detail.description);
      }
      fillList(ttRespList, detail.responsibilities);
      fillList(ttCompList, detail.competencies);

      const rect = btn.getBoundingClientRect();
      tooltip.style.top = `${rect.bottom + 8}px`;
      tooltip.style.left = `${rect.left}px`;
      tooltip.style.display = 'block';
    }

    const buttons = widget.querySelectorAll<HTMLButtonElement>('.org-node');
    buttons.forEach((btn) => {
      btn.addEventListener('mouseover', () => {
        const id = btn.dataset.nodeId;
        const detail = id ? byId.get(id) : undefined;
        if (detail) showTooltip(btn, detail);
      });
      btn.addEventListener('mouseleave', () => {
        tooltip.style.display = 'none';
      });
    });
  });
</script>
```

- [ ] **Step 2: Verify the build compiles**

```bash
cd /Users/stefanbakker/Documents/Github/Development && npm run build
```

Expected: Build completes with no errors.

- [ ] **Step 3: Commit**

```bash
git add src/components/widgets/OrgChart.astro
git commit -m "feat(org-chart): replace detail panel with hover tooltip, remove cross-functional section"
```
