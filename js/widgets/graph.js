// Port of src/components/sim/InteractiveGraph.astro — draggable/clickable SVG network graph.
// Static widget chrome + seed NODES/EDGES data authored verbatim from the Astro source (not
// frontmatter-derived), so none of it needs escapeHtml().
//
// Special case (see CONTRACTS.md §3 / job brief): the original took a `step` Astro prop
// (topic.widgetStep) that gated which nodes/edges are visible and highlighted, applied at
// *render* time via a `data-step` attribute read back out of the DOM. Since render() here
// takes no args, the same gating is instead applied inside init(root, { step }) — the static
// markup is always the same, and init() computes the STEP-scoped view before drawing.

export function render() {
  return `
    <div id="ig-widget" class="rounded-2xl border border-indigo-200 dark:border-indigo-500/20 bg-white dark:bg-neutral-900 p-6" style="width:80vw; margin-left:calc(50% - 40vw);">

      <div class="flex flex-wrap items-start justify-between gap-3 mb-5">
        <div>
          <h3 class="text-sm font-semibold text-indigo-400 mb-3 flex items-center gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a2 2 0 01-2 2H6a2 2 0 01-2-2V4z"/>
            </svg>
            Supply Chain Network Graph
          </h3>
          <div class="flex flex-wrap gap-x-5 gap-y-2 text-xs text-gray-500 dark:text-neutral-400">
            <span class="flex items-center gap-1.5">
              <svg width="12" height="11" viewBox="0 0 12 11" aria-hidden="true"><polygon points="6,0 12,11 0,11" fill="none" stroke="#6366f1" stroke-width="1.5" stroke-linejoin="round"/></svg>
              Item
            </span>
            <span class="flex items-center gap-1.5">
              <svg width="14" height="14" viewBox="0 0 14 14" aria-hidden="true"><circle cx="7" cy="7" r="6" fill="none" stroke="#ef4444" stroke-width="1.5"/></svg>
              BOM
            </span>
            <span class="flex items-center gap-1.5">
              <svg width="14" height="14" viewBox="0 0 14 14" aria-hidden="true"><circle cx="7" cy="7" r="6" fill="none" stroke="#8b5cf6" stroke-width="1.5"/></svg>
              BOD
            </span>
            <span class="flex items-center gap-1.5">
              <svg width="12" height="11" viewBox="0 0 12 11" aria-hidden="true"><polygon points="0,0 12,0 6,11" fill="none" stroke="#10b981" stroke-width="1.5" stroke-linejoin="round"/></svg>
              Resource
            </span>
            <span class="flex items-center gap-1.5">
              <svg width="20" height="4" viewBox="0 0 20 4" aria-hidden="true"><line x1="0" y1="2" x2="20" y2="2" stroke="#10b981" stroke-width="1.5" stroke-dasharray="4 3"/></svg>
              Resource consumption
            </span>
          </div>
        </div>
        <span class="text-xs text-gray-400 dark:text-neutral-600 shrink-0">Drag nodes to reposition</span>
      </div>

      <div class="rounded-xl overflow-hidden border border-gray-200 dark:border-neutral-700 mb-4 bg-gray-50 dark:bg-neutral-950">
        <svg
          id="ig-svg"
          viewBox="0 0 1660 360"
          class="w-full select-none"
          style="touch-action: none; cursor: default;"
        >
          <g id="ig-edges"></g>
          <g id="ig-nodes"></g>
        </svg>
      </div>

    </div>
  `;
}

export function init(root, extra) {
  const widget = root.querySelector('#ig-widget');
  if (!widget || widget.dataset.bound === '1') return;
  widget.dataset.bound = '1';

  const step = extra?.step;

  // ─── SEED PRODUCTION NETWORK DATA ───────────────────────────────────────────
  const NODES = [
    { id: 'item-a',     type: 'item', label: 'Item A', x: 150,  y: 125,
      info: { 'Item type': 'Seed input', 'Location': 'Central Warehouse', 'Used in': 'Seed Production' } },
    { id: 'item-b',     type: 'item', label: 'Item B', x: 150,  y: 255,
      info: { 'Item type': 'Seed input', 'Location': 'Central Warehouse', 'Used in': 'Seed Production' } },
    { id: 'item-a-gr',  type: 'item', label: 'Item A', x: 310,  y: 125,
      info: { 'Item type': 'Seed input', 'Location': 'Grower', 'State': 'Transported' } },
    { id: 'item-b-gr',  type: 'item', label: 'Item B', x: 310,  y: 255,
      info: { 'Item type': 'Seed input', 'Location': 'Grower', 'State': 'Transported' } },
    { id: 'item-c',     type: 'item', label: 'Item C', x: 475,  y: 190,
      info: { 'Item type': 'Raw seed', 'Location': 'Grower', 'Produced by': 'Seed Production' } },
    { id: 'item-c-cw',  type: 'item', label: 'Item C', x: 625,  y: 190,
      info: { 'Item type': 'Raw seed', 'Location': 'Central Warehouse', 'State': 'Transported' } },
    { id: 'item-d',     type: 'item', label: 'Item D', x: 790,  y: 190,
      info: { 'Item type': 'Cleaned seed', 'Location': 'Central Warehouse', 'Produced by': 'Cleaning' } },
    { id: 'item-e',     type: 'item', label: 'Item E', x: 960,  y: 115,
      info: { 'Item type': 'Calibrated seed (E)', 'Location': 'Central Warehouse', 'Produced by': 'Calibrating' } },
    { id: 'item-f',     type: 'item', label: 'Item F', x: 960,  y: 190,
      info: { 'Item type': 'Calibrated seed (F)', 'Location': 'Central Warehouse', 'Used in': 'Priming' } },
    { id: 'item-g',     type: 'item', label: 'Item G', x: 960,  y: 265,
      info: { 'Item type': 'Calibrated seed (G)', 'Location': 'Central Warehouse', 'Produced by': 'Calibrating' } },
    { id: 'item-h',     type: 'item', label: 'Item H', x: 1125, y: 190,
      info: { 'Item type': 'Primed seed', 'Location': 'Central Warehouse', 'Produced by': 'Priming' } },
    { id: 'item-i',     type: 'item', label: 'Item I', x: 1285, y: 190,
      info: { 'Item type': 'Coated seed', 'Location': 'Central Warehouse', 'Produced by': 'Coating' } },
    { id: 'item-j',     type: 'item', label: 'Item J', x: 1445, y: 190,
      info: { 'Item type': 'Packed seed', 'Location': 'Central Warehouse', 'Produced by': 'Packing' } },
    { id: 'item-j-out', type: 'item', label: 'Item J', x: 1615, y: 190,
      info: { 'Item type': 'Packed seed', 'Location': 'In transit', 'State': 'Shipped to customer' } },
    { id: 'proc-ship-a',      type: 'transportation', label: 'Ship [A]',   x: 230,  y: 125,
      info: { 'BOD type': 'BOD', 'Location': 'In transit', 'Carries': 'Item A' } },
    { id: 'proc-ship-b',      type: 'transportation', label: 'Ship [B]',   x: 230,  y: 255,
      info: { 'BOD type': 'BOD', 'Location': 'In transit', 'Carries': 'Item B' } },
    { id: 'proc-seed',        type: 'transformation', label: 'Seed Prod.', x: 395,  y: 190,
      info: { 'BOM type': 'BOM', 'Location': 'Grower', 'Input': 'Item A; Item B', 'Output': 'Item C' } },
    { id: 'proc-ship-c',      type: 'transportation', label: 'Ship [C]',   x: 555,  y: 190,
      info: { 'BOD type': 'BOD', 'Location': 'In transit', 'Carries': 'Item C' } },
    { id: 'proc-cleaning',    type: 'transformation', label: 'Cleaning',   x: 710,  y: 190,
      info: { 'BOM type': 'BOM', 'Location': 'Central Warehouse', 'Input': 'Item C', 'Output': 'Item D' } },
    { id: 'proc-calibrating', type: 'transformation', label: 'Calibrate',  x: 875,  y: 190,
      info: { 'BOM type': 'BOM', 'Location': 'Central Warehouse', 'Input': 'Item D', 'Output': 'Item E; Item F; Item G' } },
    { id: 'proc-priming',     type: 'transformation', label: 'Priming',    x: 1045, y: 190,
      info: { 'BOM type': 'BOM', 'Location': 'Central Warehouse', 'Input': 'Item F', 'Output': 'Item H' } },
    { id: 'proc-coating',     type: 'transformation', label: 'Coating',    x: 1205, y: 190,
      info: { 'BOM type': 'BOM', 'Location': 'Central Warehouse', 'Input': 'Item H', 'Output': 'Item I' } },
    { id: 'proc-packing',     type: 'transformation', label: 'Packing',    x: 1365, y: 190,
      info: { 'BOM type': 'BOM', 'Location': 'Central Warehouse', 'Input': 'Item I', 'Output': 'Item J' } },
    { id: 'proc-ship-j',      type: 'transportation', label: 'Ship [J]',   x: 1530, y: 190,
      info: { 'BOD type': 'BOD', 'Location': 'In transit', 'Carries': 'Item J' } },
    { id: 'res-seed',        type: 'resource', label: 'Grow Field', x: 395,  y: 90,
      info: { 'Resource type': 'Land',     'Consumed per': '1 ha / season',  'Location': 'Grower' } },
    { id: 'res-cleaning',    type: 'resource', label: 'Cleaner',    x: 710,  y: 90,
      info: { 'Resource type': 'Machine',  'Consumed per': '1 hr / 100 kg',  'Location': 'Central Warehouse' } },
    { id: 'res-calibrating', type: 'resource', label: 'Calibrator', x: 875,  y: 90,
      info: { 'Resource type': 'Machine',  'Consumed per': '0.5 hr / batch', 'Location': 'Central Warehouse' } },
    { id: 'res-priming',     type: 'resource', label: 'Primer',     x: 1045, y: 90,
      info: { 'Resource type': 'Machine',  'Consumed per': '2 hr / batch',   'Location': 'Central Warehouse' } },
    { id: 'res-coating',     type: 'resource', label: 'Coater',     x: 1205, y: 90,
      info: { 'Resource type': 'Machine',  'Consumed per': '1 hr / batch',   'Location': 'Central Warehouse' } },
    { id: 'res-packing',     type: 'resource', label: 'Packer',     x: 1365, y: 90,
      info: { 'Resource type': 'Machine',  'Consumed per': '0.25 hr / unit', 'Location': 'Central Warehouse' } },
  ];

  const EDGES = [
    { id: 'e3',  from: 'item-a',           to: 'proc-ship-a',   type: 'bod', label: 'BOD input',   info: { 'Item': 'Item A',            'Type': 'BOD input' } },
    { id: 'e4',  from: 'item-b',           to: 'proc-ship-b',   type: 'bod', label: 'BOD input',   info: { 'Item': 'Item B',            'Type': 'BOD input' } },
    { id: 'e5',  from: 'proc-ship-a',      to: 'item-a-gr',     type: 'bod', label: 'BOD output',  info: { 'Delivers': 'Item A to Grower',              'Type': 'BOD output' } },
    { id: 'e5b', from: 'item-a-gr',        to: 'proc-seed',     type: 'bom', label: 'BOM input',   info: { 'Item': 'Item A (Grower)',   'Type': 'BOM input' } },
    { id: 'e6',  from: 'proc-ship-b',      to: 'item-b-gr',     type: 'bod', label: 'BOD output',  info: { 'Delivers': 'Item B to Grower',              'Type': 'BOD output' } },
    { id: 'e6b', from: 'item-b-gr',        to: 'proc-seed',     type: 'bom', label: 'BOM input',   info: { 'Item': 'Item B (Grower)',   'Type': 'BOM input' } },
    { id: 'e7',  from: 'proc-seed',        to: 'item-c',        type: 'bom', label: 'BOM output',  info: { 'Process': 'Seed Production','Type': 'BOM output' } },
    { id: 'e8',  from: 'item-c',           to: 'proc-ship-c',   type: 'bod', label: 'BOD input',   info: { 'Item': 'Item C',            'Type': 'BOD input' } },
    { id: 'e9',  from: 'proc-ship-c',      to: 'item-c-cw',     type: 'bod', label: 'BOD output',  info: { 'Delivers': 'Item C to Central Warehouse',   'Type': 'BOD output' } },
    { id: 'e9b', from: 'item-c-cw',        to: 'proc-cleaning', type: 'bom', label: 'BOM input',   info: { 'Item': 'Item C (CW)',       'Type': 'BOM input' } },
    { id: 'e10', from: 'proc-cleaning',    to: 'item-d',        type: 'bom', label: 'BOM output',  info: { 'Process': 'Cleaning',       'Type': 'BOM output' } },
    { id: 'e11', from: 'item-d',           to: 'proc-calibrating', type: 'bom', label: 'BOM input', info: { 'Item': 'Item D',           'Type': 'BOM input' } },
    { id: 'e12', from: 'proc-calibrating', to: 'item-e',        type: 'bom', label: 'BOM output',  info: { 'Process': 'Calibrating',    'Type': 'BOM output (co-product)' } },
    { id: 'e13', from: 'proc-calibrating', to: 'item-f',        type: 'bom', label: 'BOM output',  info: { 'Process': 'Calibrating',    'Type': 'BOM output (co-product)' } },
    { id: 'e14', from: 'proc-calibrating', to: 'item-g',        type: 'bom', label: 'BOM output',  info: { 'Process': 'Calibrating',    'Type': 'BOM output (co-product)' } },
    { id: 'e15', from: 'item-f',           to: 'proc-priming',  type: 'bom', label: 'BOM input',   info: { 'Item': 'Item F',            'Type': 'BOM input' } },
    { id: 'e16', from: 'proc-priming',     to: 'item-h',        type: 'bom', label: 'BOM output',  info: { 'Process': 'Priming',        'Type': 'BOM output' } },
    { id: 'e17', from: 'item-h',           to: 'proc-coating',  type: 'bom', label: 'BOM input',   info: { 'Item': 'Item H',            'Type': 'BOM input' } },
    { id: 'e18', from: 'proc-coating',     to: 'item-i',        type: 'bom', label: 'BOM output',  info: { 'Process': 'Coating',        'Type': 'BOM output' } },
    { id: 'e19', from: 'item-i',           to: 'proc-packing',  type: 'bom', label: 'BOM input',   info: { 'Item': 'Item I',            'Type': 'BOM input' } },
    { id: 'e20', from: 'proc-packing',     to: 'item-j',        type: 'bom', label: 'BOM output',  info: { 'Process': 'Packing',        'Type': 'BOM output' } },
    { id: 'e21', from: 'item-j',           to: 'proc-ship-j',   type: 'bod', label: 'BOD input',   info: { 'Item': 'Item J',            'Type': 'BOD input' } },
    { id: 'e22', from: 'proc-ship-j',      to: 'item-j-out',    type: 'bod', label: 'BOD output',  info: { 'Delivers': 'Item J to customer',            'Type': 'BOD output' } },
    { id: 'er2', from: 'res-seed',        to: 'proc-seed',        type: 'resource-consumption', label: 'Resource consumption', info: { 'Rate': '1 ha / season',  'Efficiency': '—' } },
    { id: 'er3', from: 'res-cleaning',    to: 'proc-cleaning',    type: 'resource-consumption', label: 'Resource consumption', info: { 'Rate': '1 hr / 100 kg',  'Efficiency': '95%' } },
    { id: 'er4', from: 'res-calibrating', to: 'proc-calibrating', type: 'resource-consumption', label: 'Resource consumption', info: { 'Rate': '0.5 hr / batch', 'Efficiency': '98%' } },
    { id: 'er5', from: 'res-priming',     to: 'proc-priming',     type: 'resource-consumption', label: 'Resource consumption', info: { 'Rate': '2 hr / batch',   'Efficiency': '90%' } },
    { id: 'er6', from: 'res-coating',     to: 'proc-coating',     type: 'resource-consumption', label: 'Resource consumption', info: { 'Rate': '1 hr / batch',   'Efficiency': '97%' } },
    { id: 'er7', from: 'res-packing',     to: 'proc-packing',     type: 'resource-consumption', label: 'Resource consumption', info: { 'Rate': '0.25 hr / unit', 'Efficiency': '99%' } },
  ];
  // ─── END DATA ─────────────────────────────────────────────────────────────────

  const NODE_COLOR = {
    item:           '#6366f1',
    transformation: '#ef4444',
    transportation: '#8b5cf6',
    resource:       '#10b981',
  };

  const EDGE_COLOR = {
    bom:                    '#9ca3af',
    bod:                    '#9ca3af',
    'resource-consumption': '#10b981',
  };

  // ─── STEP MAP — which node IDs are introduced at each step ──────────────────
  const STEP_NODES = [
    [],
    ['item-a', 'item-b'],
    ['proc-ship-a', 'item-a-gr', 'proc-ship-b', 'item-b-gr'],
    ['proc-seed', 'item-c', 'res-seed'],
    ['proc-ship-c', 'item-c-cw'],
    ['proc-cleaning', 'item-d', 'res-cleaning'],
    ['proc-calibrating', 'item-e', 'item-f', 'item-g', 'res-calibrating'],
    ['proc-priming', 'item-h', 'res-priming'],
    ['proc-coating', 'item-i', 'res-coating'],
    ['proc-packing', 'item-j', 'res-packing'],
    ['proc-ship-j', 'item-j-out'],
  ];

  // ─── STEP HIGHLIGHT — item-in + process + item-out highlighted per step ──────
  const STEP_HIGHLIGHT = [
    [],
    ['item-a', 'item-b'],
    ['item-a', 'proc-ship-a', 'item-a-gr', 'item-b', 'proc-ship-b', 'item-b-gr'],
    ['item-a-gr', 'item-b-gr', 'proc-seed', 'item-c', 'res-seed'],
    ['item-c', 'proc-ship-c', 'item-c-cw'],
    ['item-c-cw', 'proc-cleaning', 'item-d', 'res-cleaning'],
    ['item-d', 'proc-calibrating', 'item-e', 'item-f', 'item-g', 'res-calibrating'],
    ['item-f', 'proc-priming', 'item-h', 'res-priming'],
    ['item-h', 'proc-coating', 'item-i', 'res-coating'],
    ['item-i', 'proc-packing', 'item-j', 'res-packing'],
    ['item-j', 'proc-ship-j', 'item-j-out'],
  ];

  const STEP = (step !== undefined && step !== null && step !== '') ? parseInt(step, 10) : null;

  const visibleIds = new Set();
  const highlightIds = new Set();
  if (STEP !== null) {
    for (let s = 1; s <= STEP && s < STEP_NODES.length; s++) {
      for (const id of STEP_NODES[s]) visibleIds.add(id);
    }
    for (const id of (STEP_HIGHLIGHT[STEP] ?? [])) highlightIds.add(id);
  }

  // Mutable node positions (updated on drag)
  const pos = {};
  for (const n of NODES) pos[n.id] = { x: n.x, y: n.y };

  let selectedId = null;
  let isDragging = false;
  let drag = null;

  const NS = 'http://www.w3.org/2000/svg';

  function el(tag, attrs) {
    const e = document.createElementNS(NS, tag);
    for (const [k, v] of Object.entries(attrs)) e.setAttribute(k, String(v));
    return e;
  }

  function svgPt(e) {
    const svg = widget.querySelector('#ig-svg');
    const pt = svg.createSVGPoint();
    pt.x = e.clientX; pt.y = e.clientY;
    const ctm = svg.getScreenCTM();
    if (!ctm) return { x: 0, y: 0 };
    return pt.matrixTransform(ctm.inverse());
  }

  function upTriPoints(cx, cy) {
    return `${cx},${cy - 32} ${cx - 28},${cy + 16} ${cx + 28},${cy + 16}`;
  }

  function dnTriPoints(cx, cy) {
    return `${cx - 28},${cy - 16} ${cx + 28},${cy - 16} ${cx},${cy + 32}`;
  }

  function addLabel(parent, text, cx, baseY, color) {
    const words = text.split(' ');
    const lines = [];
    let cur = '';
    for (const w of words) {
      const next = cur ? cur + ' ' + w : w;
      if (next.length <= 14) { cur = next; }
      else { if (cur) lines.push(cur); cur = w; }
    }
    if (cur) lines.push(cur);

    const t = el('text', {
      'text-anchor': 'middle', fill: color,
      'font-size': '10', 'font-family': 'Inter,system-ui,sans-serif',
      'pointer-events': 'none',
    });
    lines.forEach((line, i) => {
      const s = document.createElementNS(NS, 'tspan');
      s.setAttribute('x', String(cx));
      s.setAttribute('y', String(baseY + i * 13));
      s.textContent = line;
      t.appendChild(s);
    });
    parent.appendChild(t);
  }

  function drawGraph() {
    const eg = widget.querySelector('#ig-edges');
    const ng = widget.querySelector('#ig-nodes');
    eg.innerHTML = '';
    ng.innerHTML = '';

    // ── Edges ────────────────────────────────────────────────────────────────
    for (const edge of EDGES) {
      const f = pos[edge.from], t = pos[edge.to];
      if (!f || !t) continue;
      if (STEP !== null && (!visibleIds.has(edge.from) || !visibleIds.has(edge.to))) continue;
      const c = EDGE_COLOR[edge.type] ?? '#6b7280';
      const sel = selectedId === edge.id;
      const isNew = STEP !== null && (highlightIds.has(edge.from) && highlightIds.has(edge.to));
      const edgeOpacity = sel ? '1' : (STEP === null ? '0.5' : (isNew ? '0.8' : '0.2'));

      eg.appendChild(el('line', {
        x1: f.x, y1: f.y, x2: t.x, y2: t.y,
        stroke: 'transparent', 'stroke-width': 14,
        'data-edge-id': edge.id, style: 'cursor:pointer',
      }));

      eg.appendChild(el('line', {
        x1: f.x, y1: f.y, x2: t.x, y2: t.y,
        stroke: c,
        'stroke-width': sel ? 3.5 : (isNew ? 2.2 : 1.8),
        'stroke-dasharray': edge.type === 'resource-consumption' ? '6 4' : 'none',
        opacity: edgeOpacity,
        'pointer-events': 'none',
      }));
    }

    // ── Nodes ────────────────────────────────────────────────────────────────
    const isDark = document.documentElement.classList.contains('dark');
    const bgFill = isDark ? '#222222' : '#ffffff';

    for (const node of NODES) {
      if (STEP !== null && !visibleIds.has(node.id)) continue;
      const { x: cx, y: cy } = pos[node.id];
      const isDimmed = STEP !== null && !highlightIds.has(node.id);
      const baseColor = NODE_COLOR[node.type] ?? '#6b7280';
      const c = isDimmed ? 'rgba(156,163,175,0.3)' : baseColor;
      const sel = selectedId === node.id;
      const isNew = STEP !== null && highlightIds.has(node.id);
      const fill = bgFill;
      const sw = sel ? '2.5' : (isNew ? '2.5' : '1.8');

      const g = el('g', { 'data-node-id': node.id, style: 'cursor:grab' });

      if (node.type === 'transformation' || node.type === 'transportation') {
        g.appendChild(el('circle', { cx, cy, r: 28, fill, stroke: c, 'stroke-width': sw }));
        const t = el('text', {
          x: cx, y: cy + 4, 'text-anchor': 'middle',
          fill: c, 'font-size': '10', 'font-family': 'Inter,system-ui,sans-serif',
          'pointer-events': 'none',
        });
        t.textContent = node.label;
        g.appendChild(t);
      } else if (node.type === 'resource') {
        g.appendChild(el('polygon', {
          points: dnTriPoints(cx, cy),
          fill, stroke: c, 'stroke-width': sw, 'stroke-linejoin': 'round',
        }));
        addLabel(g, node.label, cx, cy - 30, c);
      } else {
        g.appendChild(el('polygon', {
          points: upTriPoints(cx, cy),
          fill, stroke: c, 'stroke-width': sw, 'stroke-linejoin': 'round',
        }));
        addLabel(g, node.label, cx, cy + 33, c);
      }

      ng.appendChild(g);
    }
  }

  function setSelected(id) {
    selectedId = id;
    drawGraph();
  }

  const svg = widget.querySelector('#ig-svg');

  svg.addEventListener('mousedown', (e) => {
    const nodeEl = e.target.closest('[data-node-id]');
    if (!nodeEl) return;
    isDragging = false;
    const nodeId = nodeEl.getAttribute('data-node-id');
    const { x, y } = svgPt(e);
    drag = { nodeId, startNx: pos[nodeId].x, startNy: pos[nodeId].y, startEx: x, startEy: y };
    svg.style.cursor = 'grabbing';
    e.preventDefault();
  });

  document.addEventListener('mousemove', (e) => {
    if (!drag) return;
    const { x, y } = svgPt(e);
    pos[drag.nodeId].x = drag.startNx + (x - drag.startEx);
    pos[drag.nodeId].y = drag.startNy + (y - drag.startEy);
    isDragging = true;
    drawGraph();
  });

  document.addEventListener('mouseup', () => {
    if (drag) { svg.style.cursor = 'default'; drag = null; }
  });

  svg.addEventListener('click', (e) => {
    const was = isDragging;
    isDragging = false;
    if (was) return;

    const nodeEl = e.target.closest('[data-node-id]');
    const edgeEl = e.target.closest('[data-edge-id]');

    if (nodeEl) setSelected(nodeEl.getAttribute('data-node-id'));
    else if (edgeEl) setSelected(edgeEl.getAttribute('data-edge-id'));
    else setSelected(null);
  });

  // ── Touch support ─────────────────────────────────────────────────────────────
  function touchSvgPt(touch) {
    const s = widget.querySelector('#ig-svg');
    const pt = s.createSVGPoint();
    pt.x = touch.clientX; pt.y = touch.clientY;
    const ctm = s.getScreenCTM();
    if (!ctm) return { x: 0, y: 0 };
    return pt.matrixTransform(ctm.inverse());
  }

  svg.addEventListener('touchstart', (e) => {
    const t = e.touches[0];
    const nodeEl = t.target.closest('[data-node-id]');
    if (!nodeEl) return;
    isDragging = false;
    const nodeId = nodeEl.getAttribute('data-node-id');
    const { x, y } = touchSvgPt(t);
    drag = { nodeId, startNx: pos[nodeId].x, startNy: pos[nodeId].y, startEx: x, startEy: y };
    e.preventDefault();
  }, { passive: false });

  svg.addEventListener('touchmove', (e) => {
    if (!drag) return;
    const { x, y } = touchSvgPt(e.touches[0]);
    pos[drag.nodeId].x = drag.startNx + (x - drag.startEx);
    pos[drag.nodeId].y = drag.startNy + (y - drag.startEy);
    isDragging = true;
    drawGraph();
    e.preventDefault();
  }, { passive: false });

  svg.addEventListener('touchend', () => {
    if (drag && !isDragging) setSelected(drag.nodeId);
    drag = null;
    isDragging = false;
  });

  // ── Init ──────────────────────────────────────────────────────────────────────
  drawGraph();
  // Re-render when dark/light mode toggles so node fill colour stays in sync
  new MutationObserver(() => drawGraph()).observe(document.documentElement, {
    attributes: true, attributeFilter: ['class'],
  });
}
