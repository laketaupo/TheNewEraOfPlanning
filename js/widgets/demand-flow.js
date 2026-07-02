// Port of src/components/sim/DemandFlowGraph.astro — animated upstream demand propagation
// (right → left) over a static seed network. Static widget chrome + seed NODES/EDGES/STEPS
// data authored verbatim from the Astro source (not frontmatter-derived), so none of it
// needs escapeHtml().

function progressDots(count) {
  let html = '';
  for (let i = 0; i < count; i++) {
    html += `<div class="dfg-dot w-2 h-2 rounded-full bg-gray-200 dark:bg-neutral-700 transition-colors" data-idx="${i}"></div>`;
  }
  return html;
}

export function render() {
  return `
    <div id="dfg-widget" class="rounded-2xl border border-amber-200 dark:border-amber-500/20 bg-white dark:bg-neutral-900 p-6" style="width:80vw; margin-left:calc(50% - 40vw);">

      <div class="flex flex-wrap items-start justify-between gap-3 mb-5">
        <div>
          <h3 class="text-sm font-semibold text-amber-500 mb-3 flex items-center gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 17l-5-5m0 0l5-5m-5 5h12"/>
            </svg>
            Demand Flow — Upstream Signal
          </h3>
          <div class="flex flex-wrap gap-x-5 gap-y-2 text-xs text-gray-500 dark:text-neutral-400">
            <span class="flex items-center gap-1.5">
              <span class="inline-block w-3 h-3 rounded-full bg-amber-400 opacity-90"></span>
              Active demand node
            </span>
            <span class="flex items-center gap-1.5">
              <svg width="24" height="6" viewBox="0 0 24 6" aria-hidden="true">
                <line x1="24" y1="3" x2="0" y2="3" stroke="#f59e0b" stroke-width="2.5" stroke-dasharray="5 3"/>
              </svg>
              Demand signal direction
            </span>
            <span class="flex items-center gap-1.5">
              <span class="inline-block w-3 h-3 rounded-full bg-gray-300 dark:bg-neutral-600 opacity-60"></span>
              Not yet reached
            </span>
          </div>
        </div>
        <div class="flex items-center gap-2">
          <button id="dfg-prev" class="px-3 py-1.5 text-xs rounded-lg border border-gray-300 dark:border-neutral-600 text-gray-600 dark:text-neutral-400 hover:border-amber-400 hover:text-amber-600 dark:hover:text-amber-400 transition-colors disabled:opacity-30 disabled:cursor-not-allowed">← Prev</button>
          <button id="dfg-play" class="px-4 py-1.5 text-xs font-medium rounded-lg bg-amber-500 text-white hover:bg-amber-600 transition-colors">Play</button>
          <button id="dfg-next" class="px-3 py-1.5 text-xs rounded-lg border border-gray-300 dark:border-neutral-600 text-gray-600 dark:text-neutral-400 hover:border-amber-400 hover:text-amber-600 dark:hover:text-amber-400 transition-colors disabled:opacity-30 disabled:cursor-not-allowed">Next →</button>
        </div>
      </div>

      <div class="flex items-center gap-2 mb-4">
        <div class="flex gap-1.5">
          ${progressDots(10)}
        </div>
        <span id="dfg-step-label" class="text-xs text-gray-400 dark:text-neutral-500 ml-1">Step 0 of 9</span>
      </div>

      <div class="rounded-xl overflow-hidden border border-gray-200 dark:border-neutral-700 mb-4 bg-gray-50 dark:bg-neutral-950">
        <svg id="dfg-svg" viewBox="0 0 1660 360" class="w-full select-none" style="touch-action: none;">
          <defs>
            <marker id="dfg-arrow-demand" markerWidth="8" markerHeight="6" refX="7" refY="3" orient="auto">
              <polygon points="8,0 0,3 8,6" fill="#f59e0b"/>
            </marker>
          </defs>
          <g id="dfg-edges"></g>
          <g id="dfg-pulses"></g>
          <g id="dfg-nodes"></g>
        </svg>
      </div>

      <div class="rounded-xl border border-gray-200 dark:border-neutral-700 bg-gray-50 dark:bg-neutral-800/40 px-5 py-4 min-h-[80px]">
        <p id="dfg-desc" class="text-sm text-gray-700 dark:text-neutral-300 leading-relaxed"></p>
      </div>

    </div>
  `;
}

export function init(root) {
  const widget = root.querySelector('#dfg-widget');
  if (!widget || widget.dataset.bound === '1') return;
  widget.dataset.bound = '1';

  // ─── NETWORK DATA (same layout as InteractiveGraph) ───────────────────────
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

  // ─── DEMAND FLOW STEPS (upstream: right → left) ───────────────────────────
  const STEPS = [
    {
      activeNodes: [],
      demandEdges: [],
      description: 'The complete seed treatment network. A customer forecast for Item J (packed seed) is about to arrive. Demand will propagate upstream — against the direction of physical flow.',
    },
    {
      activeNodes: ['item-j-out', 'proc-ship-j', 'item-j'],
      demandEdges: [
        { from: 'item-j-out', to: 'proc-ship-j' },
        { from: 'proc-ship-j', to: 'item-j' },
      ],
      description: '100 units of Item J are forecasted by the customer. The demand signal enters at Item J (out) and propagates upstream through Ship [J] to Item J at the Central Warehouse — which must now have 100 units ready to ship.',
    },
    {
      activeNodes: ['item-j', 'proc-packing', 'item-i'],
      demandEdges: [
        { from: 'item-j', to: 'proc-packing' },
        { from: 'proc-packing', to: 'item-i' },
      ],
      description: 'Demand for Item J triggers a planned order for Packing. Packing requires 100 units of Item I (coated seed) as input. The demand signal reaches Item I.',
    },
    {
      activeNodes: ['item-i', 'proc-coating', 'item-h'],
      demandEdges: [
        { from: 'item-i', to: 'proc-coating' },
        { from: 'proc-coating', to: 'item-h' },
      ],
      description: 'Demand for Item I triggers Coating. 100 units of Item H (primed seed) are needed as input. The demand signal propagates further upstream to Item H.',
    },
    {
      activeNodes: ['item-h', 'proc-priming', 'item-f'],
      demandEdges: [
        { from: 'item-h', to: 'proc-priming' },
        { from: 'proc-priming', to: 'item-f' },
      ],
      description: 'Demand for Item H triggers Priming. Priming needs 100 units of Item F (calibrated seed). The demand signal reaches Item F.',
    },
    {
      activeNodes: ['item-f', 'proc-calibrating', 'item-d'],
      demandEdges: [
        { from: 'item-f', to: 'proc-calibrating' },
        { from: 'proc-calibrating', to: 'item-d' },
      ],
      description: 'Demand for Item F triggers Calibrating. Calibrating produces Item F at ~60 % yield — so ~167 units of Item D (cleaned seed) must enter Calibrating to yield 100 units of Item F. Demand jumps to 167 units from here upstream.',
    },
    {
      activeNodes: ['item-d', 'proc-cleaning', 'item-c-cw'],
      demandEdges: [
        { from: 'item-d', to: 'proc-cleaning' },
        { from: 'proc-cleaning', to: 'item-c-cw' },
      ],
      description: '167 units of Item D require Cleaning to run. Cleaning needs ~167 units of Item C at the Central Warehouse. The demand signal reaches Item C-CW.',
    },
    {
      activeNodes: ['item-c-cw', 'proc-ship-c', 'item-c'],
      demandEdges: [
        { from: 'item-c-cw', to: 'proc-ship-c' },
        { from: 'proc-ship-c', to: 'item-c' },
      ],
      description: 'Item C at the Central Warehouse must be transported from the Grower. Ship [C] receives demand to carry ~167 units. The demand signal reaches Item C at the Grower.',
    },
    {
      activeNodes: ['item-c', 'proc-seed', 'item-a-gr', 'item-b-gr'],
      demandEdges: [
        { from: 'item-c', to: 'proc-seed' },
        { from: 'proc-seed', to: 'item-a-gr' },
        { from: 'proc-seed', to: 'item-b-gr' },
      ],
      description: 'Item C at the Grower is produced by Seed Production. Seed Production needs ~167 units each of Items A and B as inputs. The demand signal reaches Items A and B at the Grower.',
    },
    {
      activeNodes: ['item-a-gr', 'item-b-gr', 'proc-ship-a', 'proc-ship-b', 'item-a', 'item-b'],
      demandEdges: [
        { from: 'item-a-gr', to: 'proc-ship-a' },
        { from: 'proc-ship-a', to: 'item-a' },
        { from: 'item-b-gr', to: 'proc-ship-b' },
        { from: 'proc-ship-b', to: 'item-b' },
      ],
      description: 'Items A and B at the Grower must be transported from the Central Warehouse. Ship [A] and Ship [B] receive demand simultaneously — each carrying ~167 units. The demand signal has reached the raw material inputs. The full upstream picture is complete.',
    },
  ];

  const NODE_BASE_COLOR = {
    item:           '#6366f1',
    transformation: '#0ea5e9',
    transportation: '#8b5cf6',
  };

  const DEMAND_COLOR = '#f59e0b';
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

    const demandEdgeSet = new Set(stepDef.demandEdges.map((e) => `${e.from}::${e.to}`));

    const isDark = document.documentElement.classList.contains('dark');
    const bgFill = isDark ? '#222222' : '#ffffff';

    // ── Edges ────────────────────────────────────────────────────────────────
    const eg = widget.querySelector('#dfg-edges');
    eg.innerHTML = '';
    for (const edge of EDGES) {
      const f = NODES.find((n) => n.id === edge.from);
      const t = NODES.find((n) => n.id === edge.to);
      const isDemand = demandEdgeSet.has(`${edge.from}::${edge.to}`) || demandEdgeSet.has(`${edge.to}::${edge.from}`);
      const isActive = activeSet.has(edge.from) || activeSet.has(edge.to);

      const color = isDemand ? DEMAND_COLOR : (currentStep === 0 ? '#6366f133' : (isActive ? '#6366f155' : '#6366f115'));
      const width = isDemand ? 2.5 : 1.5;
      const dashArray = isDemand ? '7 4' : (edge.type === 'bom' ? 'none' : '4 3');

      eg.appendChild(svgEl('line', {
        x1: f.x, y1: f.y, x2: t.x, y2: t.y,
        stroke: color, 'stroke-width': width,
        'stroke-dasharray': dashArray,
        opacity: isDemand ? '1' : (currentStep === 0 ? '0.6' : (isActive ? '0.4' : '0.15')),
      }));
    }

    // ── Animated demand pulses (marching dashes on demand edges) ─────────────
    const pg = widget.querySelector('#dfg-pulses');
    pg.innerHTML = '';
    for (const de of stepDef.demandEdges) {
      const fNode = NODES.find((n) => n.id === de.from);
      const tNode = NODES.find((n) => n.id === de.to);
      const len = Math.hypot(tNode.x - fNode.x, tNode.y - fNode.y);
      const animLine = svgEl('line', {
        x1: fNode.x, y1: fNode.y, x2: tNode.x, y2: tNode.y,
        stroke: DEMAND_COLOR, 'stroke-width': '3',
        'stroke-dasharray': `8 ${len}`,
        'stroke-dashoffset': '0',
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

    // ── Nodes ────────────────────────────────────────────────────────────────
    const ng = widget.querySelector('#dfg-nodes');
    ng.innerHTML = '';
    for (const node of NODES) {
      const isActive = activeSet.has(node.id);
      const color = currentStep === 0
        ? (NODE_BASE_COLOR[node.type] ?? '#6366f1')
        : (isActive ? DEMAND_COLOR : DIM_COLOR);
      const sw = isActive ? '2.5' : '1.5';

      const g = svgEl('g', {});

      if (node.type === 'transformation' || node.type === 'transportation') {
        if (isActive) {
          g.appendChild(svgEl('circle', { cx: node.x, cy: node.y, r: 36, fill: DEMAND_COLOR, opacity: '0.12' }));
        }
        g.appendChild(svgEl('circle', { cx: node.x, cy: node.y, r: 28, fill: bgFill, stroke: color, 'stroke-width': sw }));
        const txt = svgEl('text', {
          x: node.x, y: node.y + 4, 'text-anchor': 'middle',
          fill: color, 'font-size': '10', 'font-family': 'Inter,system-ui,sans-serif',
          'pointer-events': 'none',
        });
        txt.textContent = node.label;
        g.appendChild(txt);
      } else {
        if (isActive) {
          g.appendChild(svgEl('polygon', {
            points: upTriPoints(node.x, node.y - 4),
            fill: DEMAND_COLOR, opacity: '0.12',
            'stroke-linejoin': 'round',
          }));
        }
        g.appendChild(svgEl('polygon', {
          points: upTriPoints(node.x, node.y),
          fill: bgFill, stroke: color, 'stroke-width': sw, 'stroke-linejoin': 'round',
        }));
        addLabel(g, node.label, node.x, node.y + 33, color);
      }

      ng.appendChild(g);
    }

    // ── Description ──────────────────────────────────────────────────────────
    widget.querySelector('#dfg-desc').textContent = stepDef.description;

    // ── Step dots ────────────────────────────────────────────────────────────
    widget.querySelectorAll('.dfg-dot').forEach((dot, idx) => {
      if (idx === currentStep) {
        dot.style.backgroundColor = DEMAND_COLOR;
        dot.style.transform = 'scale(1.4)';
      } else {
        dot.style.backgroundColor = '';
        dot.style.transform = '';
      }
    });

    widget.querySelector('#dfg-step-label').textContent = `Step ${currentStep} of ${STEPS.length - 1}`;

    widget.querySelector('#dfg-prev').disabled = currentStep === 0;
    widget.querySelector('#dfg-next').disabled = currentStep === STEPS.length - 1;
  }

  function setStep(s) {
    currentStep = Math.max(0, Math.min(STEPS.length - 1, s));
    drawFrame();
  }

  function togglePlay() {
    const btn = widget.querySelector('#dfg-play');
    if (playInterval) {
      clearInterval(playInterval);
      playInterval = null;
      btn.textContent = 'Play';
      btn.classList.replace('bg-gray-500', 'bg-amber-500');
    } else {
      btn.textContent = 'Pause';
      btn.classList.replace('bg-amber-500', 'bg-gray-500');
      if (currentStep === STEPS.length - 1) setStep(0);
      playInterval = setInterval(() => {
        if (currentStep < STEPS.length - 1) {
          setStep(currentStep + 1);
        } else {
          clearInterval(playInterval);
          playInterval = null;
          btn.textContent = 'Play';
          btn.classList.replace('bg-gray-500', 'bg-amber-500');
        }
      }, 2000);
    }
  }

  widget.querySelector('#dfg-prev').addEventListener('click', () => { if (playInterval) togglePlay(); setStep(currentStep - 1); });
  widget.querySelector('#dfg-next').addEventListener('click', () => { if (playInterval) togglePlay(); setStep(currentStep + 1); });
  widget.querySelector('#dfg-play').addEventListener('click', togglePlay);

  drawFrame();
  new MutationObserver(() => drawFrame()).observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });
}
