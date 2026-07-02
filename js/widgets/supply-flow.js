// Port of src/components/sim/SupplyFlowGraph.astro — animated downstream supply propagation
// (left → right) over a static seed network. Static widget chrome + seed NODES/EDGES/STEPS
// data authored verbatim from the Astro source (not frontmatter-derived), so none of it
// needs escapeHtml().

function progressDots(count) {
  let html = '';
  for (let i = 0; i < count; i++) {
    html += `<div class="sfg-dot w-2 h-2 rounded-full bg-gray-200 dark:bg-neutral-700 transition-colors" data-idx="${i}"></div>`;
  }
  return html;
}

export function render() {
  return `
    <div id="sfg-widget" class="rounded-2xl border border-teal-200 dark:border-teal-500/20 bg-white dark:bg-neutral-900 p-6" style="width:80vw; margin-left:calc(50% - 40vw);">

      <div class="flex flex-wrap items-start justify-between gap-3 mb-5">
        <div>
          <h3 class="text-sm font-semibold text-teal-500 mb-3 flex items-center gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7l5 5m0 0l-5 5m5-5H6"/>
            </svg>
            Supply Flow — Downstream Planned Orders
          </h3>
          <div class="flex flex-wrap gap-x-5 gap-y-2 text-xs text-gray-500 dark:text-neutral-400">
            <span class="flex items-center gap-1.5">
              <span class="inline-block w-3 h-3 rounded-full bg-teal-400 opacity-90"></span>
              Active supply node
            </span>
            <span class="flex items-center gap-1.5">
              <svg width="24" height="6" viewBox="0 0 24 6" aria-hidden="true">
                <line x1="0" y1="3" x2="24" y2="3" stroke="#14b8a6" stroke-width="2.5" stroke-dasharray="5 3"/>
              </svg>
              Supply flow direction
            </span>
            <span class="flex items-center gap-1.5">
              <span class="inline-block w-3 h-3 rounded-full bg-amber-300 opacity-80"></span>
              Inventory netting applied
            </span>
          </div>
        </div>
        <div class="flex items-center gap-2">
          <button id="sfg-prev" class="px-3 py-1.5 text-xs rounded-lg border border-gray-300 dark:border-neutral-600 text-gray-600 dark:text-neutral-400 hover:border-teal-400 hover:text-teal-600 dark:hover:text-teal-400 transition-colors disabled:opacity-30 disabled:cursor-not-allowed">← Prev</button>
          <button id="sfg-play" class="px-4 py-1.5 text-xs font-medium rounded-lg bg-teal-500 text-white hover:bg-teal-600 transition-colors">Play</button>
          <button id="sfg-next" class="px-3 py-1.5 text-xs rounded-lg border border-gray-300 dark:border-neutral-600 text-gray-600 dark:text-neutral-400 hover:border-teal-400 hover:text-teal-600 dark:hover:text-teal-400 transition-colors disabled:opacity-30 disabled:cursor-not-allowed">Next →</button>
        </div>
      </div>

      <div class="flex items-center gap-2 mb-4">
        <div class="flex gap-1.5">
          ${progressDots(11)}
        </div>
        <span id="sfg-step-label" class="text-xs text-gray-400 dark:text-neutral-500 ml-1">Step 0 of 10</span>
      </div>

      <div class="rounded-xl overflow-hidden border border-gray-200 dark:border-neutral-700 mb-4 bg-gray-50 dark:bg-neutral-950">
        <svg id="sfg-svg" viewBox="0 0 1660 360" class="w-full select-none" style="touch-action: none;">
          <g id="sfg-edges"></g>
          <g id="sfg-pulses"></g>
          <g id="sfg-nodes"></g>
        </svg>
      </div>

      <div class="rounded-xl border border-gray-200 dark:border-neutral-700 bg-gray-50 dark:bg-neutral-800/40 px-5 py-4 min-h-[80px]">
        <p id="sfg-desc" class="text-sm text-gray-700 dark:text-neutral-300 leading-relaxed"></p>
      </div>

    </div>
  `;
}

export function init(root) {
  const widget = root.querySelector('#sfg-widget');
  if (!widget || widget.dataset.bound === '1') return;
  widget.dataset.bound = '1';

  // ─── NETWORK DATA ─────────────────────────────────────────────────────────
  const NODES = [
    { id: 'item-a',     type: 'item',           label: 'Item A',     x: 150,  y: 125 },
    { id: 'item-b',     type: 'item',           label: 'Item B',     x: 150,  y: 255 },
    { id: 'item-a-gr',  type: 'item',           label: 'Item A',     x: 310,  y: 125 },
    { id: 'item-b-gr',  type: 'item',           label: 'Item B',     x: 310,  y: 255 },
    { id: 'item-c',     type: 'item',           label: 'Item C',     x: 475,  y: 190 },
    { id: 'item-c-cw',  type: 'item',           label: 'Item C',     x: 625,  y: 190 },
    { id: 'item-d',     type: 'item',           label: 'Item D',     x: 790,  y: 190 },
    { id: 'item-e',     type: 'item',           label: 'Item E',     x: 960,  y: 115 },
    { id: 'item-f',     type: 'item',           label: 'Item F',     x: 960,  y: 190 },
    { id: 'item-g',     type: 'item',           label: 'Item G',     x: 960,  y: 265 },
    { id: 'item-h',     type: 'item',           label: 'Item H',     x: 1125, y: 190 },
    { id: 'item-i',     type: 'item',           label: 'Item I',     x: 1285, y: 190 },
    { id: 'item-j',     type: 'item',           label: 'Item J',     x: 1445, y: 190 },
    { id: 'item-j-out', type: 'item',           label: 'Item J',     x: 1615, y: 190 },
    { id: 'proc-ship-a',      type: 'transportation', label: 'Ship [A]',   x: 230,  y: 125 },
    { id: 'proc-ship-b',      type: 'transportation', label: 'Ship [B]',   x: 230,  y: 255 },
    { id: 'proc-seed',        type: 'transformation', label: 'Seed Prod.', x: 395,  y: 190 },
    { id: 'proc-ship-c',      type: 'transportation', label: 'Ship [C]',   x: 555,  y: 190 },
    { id: 'proc-cleaning',    type: 'transformation', label: 'Cleaning',   x: 710,  y: 190 },
    { id: 'proc-calibrating', type: 'transformation', label: 'Calibrate',  x: 875,  y: 190 },
    { id: 'proc-priming',     type: 'transformation', label: 'Priming',    x: 1045, y: 190 },
    { id: 'proc-coating',     type: 'transformation', label: 'Coating',    x: 1205, y: 190 },
    { id: 'proc-packing',     type: 'transformation', label: 'Packing',    x: 1365, y: 190 },
    { id: 'proc-ship-j',      type: 'transportation', label: 'Ship [J]',   x: 1530, y: 190 },
  ];

  const EDGES = [
    { from: 'item-a',           to: 'proc-ship-a',      type: 'bod' },
    { from: 'proc-ship-a',      to: 'item-a-gr',        type: 'bod' },
    { from: 'item-a-gr',        to: 'proc-seed',        type: 'bom' },
    { from: 'item-b',           to: 'proc-ship-b',      type: 'bod' },
    { from: 'proc-ship-b',      to: 'item-b-gr',        type: 'bod' },
    { from: 'item-b-gr',        to: 'proc-seed',        type: 'bom' },
    { from: 'proc-seed',        to: 'item-c',           type: 'bom' },
    { from: 'item-c',           to: 'proc-ship-c',      type: 'bod' },
    { from: 'proc-ship-c',      to: 'item-c-cw',        type: 'bod' },
    { from: 'item-c-cw',        to: 'proc-cleaning',    type: 'bom' },
    { from: 'proc-cleaning',    to: 'item-d',           type: 'bom' },
    { from: 'item-d',           to: 'proc-calibrating', type: 'bom' },
    { from: 'proc-calibrating', to: 'item-e',           type: 'bom' },
    { from: 'proc-calibrating', to: 'item-f',           type: 'bom' },
    { from: 'proc-calibrating', to: 'item-g',           type: 'bom' },
    { from: 'item-f',           to: 'proc-priming',     type: 'bom' },
    { from: 'proc-priming',     to: 'item-h',           type: 'bom' },
    { from: 'item-h',           to: 'proc-coating',     type: 'bom' },
    { from: 'proc-coating',     to: 'item-i',           type: 'bom' },
    { from: 'item-i',           to: 'proc-packing',     type: 'bom' },
    { from: 'proc-packing',     to: 'item-j',           type: 'bom' },
    { from: 'item-j',           to: 'proc-ship-j',      type: 'bod' },
    { from: 'proc-ship-j',      to: 'item-j-out',       type: 'bod' },
  ];

  // ─── SUPPLY FLOW STEPS (downstream: left → right) ─────────────────────────
  const STEPS = [
    {
      activeNodes: [],
      supplyEdges: [],
      inventoryNodes: [],
      description: 'The complete seed treatment network. The planning engine has netted all demand and is about to release planned orders. Supply will flow downstream — in the same direction as physical product movement.',
    },
    {
      activeNodes: ['item-a', 'item-b'],
      supplyEdges: [],
      inventoryNodes: [],
      description: '167 units of Item A and 167 units of Item B are confirmed available at the Central Warehouse. These raw material inputs are the starting point of the supply chain. No planned orders are needed here — stock on hand covers the full requirement.',
    },
    {
      activeNodes: ['item-a', 'item-b', 'proc-ship-a', 'proc-ship-b', 'item-a-gr', 'item-b-gr'],
      supplyEdges: [
        { from: 'item-a', to: 'proc-ship-a' },
        { from: 'proc-ship-a', to: 'item-a-gr' },
        { from: 'item-b', to: 'proc-ship-b' },
        { from: 'proc-ship-b', to: 'item-b-gr' },
      ],
      inventoryNodes: [],
      description: 'Transportation planned orders are released for Ship [A] and Ship [B] simultaneously. After the transit lead time (5 days), 167 units of Item A and 167 units of Item B arrive at the Grower — ready as inputs for Seed Production.',
    },
    {
      activeNodes: ['item-a-gr', 'item-b-gr', 'proc-seed', 'item-c'],
      supplyEdges: [
        { from: 'item-a-gr', to: 'proc-seed' },
        { from: 'item-b-gr', to: 'proc-seed' },
        { from: 'proc-seed', to: 'item-c' },
      ],
      inventoryNodes: [],
      description: 'Seed Production runs at the Grower, consuming Items A and B to produce 167 units of Item C (raw seed) after the growing season (90–120 days).',
    },
    {
      activeNodes: ['item-c', 'proc-ship-c', 'item-c-cw'],
      supplyEdges: [
        { from: 'item-c', to: 'proc-ship-c' },
        { from: 'proc-ship-c', to: 'item-c-cw' },
      ],
      inventoryNodes: [],
      description: 'Ship [C] transports 167 units of Item C from the Grower to the Central Warehouse. Item C is now available as input for Cleaning.',
    },
    {
      activeNodes: ['item-c-cw', 'proc-cleaning', 'item-d'],
      supplyEdges: [
        { from: 'item-c-cw', to: 'proc-cleaning' },
        { from: 'proc-cleaning', to: 'item-d' },
      ],
      inventoryNodes: ['item-d'],
      description: 'Cleaning is scheduled — but 20 units of Item D are already on hand (above safety stock), so only 147 units need to be produced. Inventory netting reduces the planned order quantity.',
    },
    {
      activeNodes: ['item-d', 'proc-calibrating', 'item-e', 'item-f', 'item-g'],
      supplyEdges: [
        { from: 'item-d', to: 'proc-calibrating' },
        { from: 'proc-calibrating', to: 'item-e' },
        { from: 'proc-calibrating', to: 'item-f' },
        { from: 'proc-calibrating', to: 'item-g' },
      ],
      inventoryNodes: [],
      description: 'Calibrating processes 167 units of Item D, producing co-products: ~100 units of Item F (60 %), ~33 units of Item E (20 %), and ~33 units of Item G (20 %). Only Item F continues downstream through Priming. Items E and G accumulate in inventory.',
    },
    {
      activeNodes: ['item-f', 'proc-priming', 'item-h'],
      supplyEdges: [
        { from: 'item-f', to: 'proc-priming' },
        { from: 'proc-priming', to: 'item-h' },
      ],
      inventoryNodes: [],
      description: 'Priming processes 100 units of Item F (calibrated seed) to produce 100 units of Item H (primed seed).',
    },
    {
      activeNodes: ['item-h', 'proc-coating', 'item-i'],
      supplyEdges: [
        { from: 'item-h', to: 'proc-coating' },
        { from: 'proc-coating', to: 'item-i' },
      ],
      inventoryNodes: [],
      description: 'Coating processes 100 units of Item H (primed seed) to produce 100 units of Item I (coated seed).',
    },
    {
      activeNodes: ['item-i', 'proc-packing', 'item-j'],
      supplyEdges: [
        { from: 'item-i', to: 'proc-packing' },
        { from: 'proc-packing', to: 'item-j' },
      ],
      inventoryNodes: [],
      description: 'Packing processes 100 units of Item I (coated seed) into finished Item J (packed seed).',
    },
    {
      activeNodes: ['item-j', 'proc-ship-j', 'item-j-out'],
      supplyEdges: [
        { from: 'item-j', to: 'proc-ship-j' },
        { from: 'proc-ship-j', to: 'item-j-out' },
      ],
      inventoryNodes: [],
      description: 'Ship [J] delivers 100 units of packed seed to the customer. The supply chain has completed a full downstream cycle, from raw material inputs to customer delivery.',
    },
  ];

  const NODE_BASE_COLOR = {
    item:           '#6366f1',
    transformation: '#0ea5e9',
    transportation: '#8b5cf6',
  };

  const SUPPLY_COLOR = '#14b8a6';
  const INVENTORY_COLOR = '#f59e0b';
  const DIM_COLOR = 'rgba(156,163,175,0.25)';

  let currentStep = 0;
  let playInterval = null;

  const NS = 'http://www.w3.org/2000/svg';

  function svgEl(tag, attrs) {
    const e = document.createElementNS(NS, tag);
    for (const [k, v] of Object.entries(attrs)) e.setAttribute(k, String(v));
    return e;
  }

  function upTriPoints(cx, cy) {
    return `${cx},${cy - 32} ${cx - 28},${cy + 16} ${cx + 28},${cy + 16}`;
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
    const t = svgEl('text', {
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

  function drawFrame() {
    const stepDef = STEPS[currentStep];
    const activeSet = new Set(stepDef.activeNodes);
    const inventorySet = new Set(stepDef.inventoryNodes);
    const supplyEdgeSet = new Set(stepDef.supplyEdges.map((e) => `${e.from}::${e.to}`));

    const isDark = document.documentElement.classList.contains('dark');
    const bgFill = isDark ? '#222222' : '#ffffff';

    // ── Edges ─────────────────────────────────────────────────────────────────
    const eg = widget.querySelector('#sfg-edges');
    eg.innerHTML = '';
    for (const edge of EDGES) {
      const f = NODES.find((n) => n.id === edge.from);
      const t = NODES.find((n) => n.id === edge.to);
      const isSupply = supplyEdgeSet.has(`${edge.from}::${edge.to}`);
      const isActive = activeSet.has(edge.from) || activeSet.has(edge.to);

      const color = isSupply ? SUPPLY_COLOR : (currentStep === 0 ? '#6366f133' : (isActive ? '#6366f155' : '#6366f115'));
      const width = isSupply ? 2.5 : 1.5;

      eg.appendChild(svgEl('line', {
        x1: f.x, y1: f.y, x2: t.x, y2: t.y,
        stroke: color, 'stroke-width': width,
        'stroke-dasharray': isSupply ? '7 4' : (edge.type === 'bom' ? 'none' : '4 3'),
        opacity: isSupply ? '1' : (currentStep === 0 ? '0.6' : (isActive ? '0.4' : '0.15')),
      }));
    }

    // ── Animated supply pulses (marching dashes left → right) ─────────────────
    const pg = widget.querySelector('#sfg-pulses');
    pg.innerHTML = '';
    for (const se of stepDef.supplyEdges) {
      const fNode = NODES.find((n) => n.id === se.from);
      const tNode = NODES.find((n) => n.id === se.to);
      const len = Math.hypot(tNode.x - fNode.x, tNode.y - fNode.y);
      const animLine = svgEl('line', {
        x1: fNode.x, y1: fNode.y, x2: tNode.x, y2: tNode.y,
        stroke: SUPPLY_COLOR, 'stroke-width': '3',
        'stroke-dasharray': `8 ${len}`,
        'stroke-dashoffset': String(len),
        'stroke-linecap': 'round',
        opacity: '0.85',
      });
      const anim = document.createElementNS(NS, 'animate');
      anim.setAttribute('attributeName', 'stroke-dashoffset');
      anim.setAttribute('from', String(len));
      anim.setAttribute('to', '0');
      anim.setAttribute('dur', '1.2s');
      anim.setAttribute('repeatCount', 'indefinite');
      animLine.appendChild(anim);
      pg.appendChild(animLine);
    }

    // ── Nodes ─────────────────────────────────────────────────────────────────
    const ng = widget.querySelector('#sfg-nodes');
    ng.innerHTML = '';
    for (const node of NODES) {
      const isActive = activeSet.has(node.id);
      const isInventory = inventorySet.has(node.id);
      const nodeColor = currentStep === 0
        ? (NODE_BASE_COLOR[node.type] ?? '#6366f1')
        : (isInventory ? INVENTORY_COLOR : (isActive ? SUPPLY_COLOR : DIM_COLOR));
      const sw = isActive ? '2.5' : '1.5';

      const g = svgEl('g', {});

      if (node.type === 'transformation' || node.type === 'transportation') {
        if (isActive) {
          g.appendChild(svgEl('circle', { cx: node.x, cy: node.y, r: 36, fill: isInventory ? INVENTORY_COLOR : SUPPLY_COLOR, opacity: '0.12' }));
        }
        g.appendChild(svgEl('circle', { cx: node.x, cy: node.y, r: 28, fill: bgFill, stroke: nodeColor, 'stroke-width': sw }));
        const txt = svgEl('text', {
          x: node.x, y: node.y + 4, 'text-anchor': 'middle',
          fill: nodeColor, 'font-size': '10', 'font-family': 'Inter,system-ui,sans-serif',
          'pointer-events': 'none',
        });
        txt.textContent = node.label;
        g.appendChild(txt);
      } else {
        if (isActive) {
          g.appendChild(svgEl('polygon', {
            points: upTriPoints(node.x, node.y - 4),
            fill: isInventory ? INVENTORY_COLOR : SUPPLY_COLOR, opacity: '0.12',
            'stroke-linejoin': 'round',
          }));
        }
        g.appendChild(svgEl('polygon', {
          points: upTriPoints(node.x, node.y),
          fill: bgFill, stroke: nodeColor, 'stroke-width': sw, 'stroke-linejoin': 'round',
        }));
        addLabel(g, node.label, node.x, node.y + 33, nodeColor);
      }

      ng.appendChild(g);
    }

    // ── Description ───────────────────────────────────────────────────────────
    widget.querySelector('#sfg-desc').textContent = stepDef.description;

    // ── Step dots ─────────────────────────────────────────────────────────────
    widget.querySelectorAll('.sfg-dot').forEach((dot, idx) => {
      if (idx === currentStep) {
        dot.style.backgroundColor = SUPPLY_COLOR;
        dot.style.transform = 'scale(1.4)';
      } else {
        dot.style.backgroundColor = '';
        dot.style.transform = '';
      }
    });

    widget.querySelector('#sfg-step-label').textContent = `Step ${currentStep} of ${STEPS.length - 1}`;

    widget.querySelector('#sfg-prev').disabled = currentStep === 0;
    widget.querySelector('#sfg-next').disabled = currentStep === STEPS.length - 1;
  }

  function setStep(s) {
    currentStep = Math.max(0, Math.min(STEPS.length - 1, s));
    drawFrame();
  }

  function togglePlay() {
    const btn = widget.querySelector('#sfg-play');
    if (playInterval) {
      clearInterval(playInterval);
      playInterval = null;
      btn.textContent = 'Play';
      btn.classList.replace('bg-gray-500', 'bg-teal-500');
    } else {
      btn.textContent = 'Pause';
      btn.classList.replace('bg-teal-500', 'bg-gray-500');
      if (currentStep === STEPS.length - 1) setStep(0);
      playInterval = setInterval(() => {
        if (currentStep < STEPS.length - 1) {
          setStep(currentStep + 1);
        } else {
          clearInterval(playInterval);
          playInterval = null;
          btn.textContent = 'Play';
          btn.classList.replace('bg-gray-500', 'bg-teal-500');
        }
      }, 2000);
    }
  }

  widget.querySelector('#sfg-prev').addEventListener('click', () => { if (playInterval) togglePlay(); setStep(currentStep - 1); });
  widget.querySelector('#sfg-next').addEventListener('click', () => { if (playInterval) togglePlay(); setStep(currentStep + 1); });
  widget.querySelector('#sfg-play').addEventListener('click', togglePlay);

  drawFrame();
  new MutationObserver(() => drawFrame()).observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });
}
