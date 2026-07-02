// Port of src/components/widgets/OrgTreeNode.astro — recursive org-chart tree node renderer.
// Internal helper used by org-chart.js; not registered as its own widget (no render()/init()
// pair, no widget contract — just a plain recursive template function).
//
// `node.title` originates from topic frontmatter (topic.orgChart), so it is untrusted content
// and must be escaped before interpolation (see CONTRACTS.md §2 / §6).
import { escapeHtml } from '../markdown.js';

/**
 * Renders one org-tree branch (a node button plus its children's <ul>), recursively.
 * `treeNode` has the shape { node: OrgNode & { children?: string[] }, children: TreeNode[] }
 * built by org-chart.js's `buildTree()`.
 */
export function renderNode(treeNode) {
  const { node: data, children } = treeNode;
  const hasSiblingsBus = children.length > 1;

  const childrenHtml = children.length > 0
    ? `<ul class="org-children${hasSiblingsBus ? ' has-siblings' : ''}">${children.map(renderNode).join('')}</ul>`
    : '';

  return `
    <li class="org-branch list-none">
      <button
        type="button"
        data-node-id="${escapeHtml(data.id)}"
        aria-pressed="false"
        class="org-node border border-gray-200 dark:border-neutral-700 rounded-xl px-4 py-3 text-sm font-medium bg-white dark:bg-neutral-900 hover:border-amber-400 dark:hover:border-amber-500 transition-colors cursor-pointer text-gray-900 dark:text-neutral-100"
      >
        ${escapeHtml(data.title)}
      </button>
      ${childrenHtml}
    </li>
  `;
}
