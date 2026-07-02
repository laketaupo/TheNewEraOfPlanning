// Port of src/components/sim/DemandShockSim.astro — animated SVG supply-chain shock timeline.
// Static widget markup + seed STEP data authored verbatim from the Astro source; no
// frontmatter-derived content, so nothing here needs escapeHtml().

function timelineDots(count) {
  let html = '';
  for (let i = 0; i < count; i++) {
    html += `<div class="ds-dot w-2 h-2 rounded-full bg-gray-700 transition-colors" data-step="${i}"></div>`;
  }
  return html;
}

export function render() {
  return `
    <div id="demand-shock-widget" class="rounded-2xl border border-violet-200 dark:border-violet-500/20 bg-violet-50/50 dark:bg-neutral-900 p-6">
      <div class="flex items-center justify-between mb-6">
        <h3 class="text-sm font-semibold text-violet-400 flex items-center gap-2">
          <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"/>
          </svg>
          Demand Shock Simulation
        </h3>
        <div class="flex items-center gap-2">
          <button id="ds-play" class="text-xs font-medium px-3 py-1.5 rounded-lg bg-violet-600 hover:bg-violet-500 text-white transition-colors">
            ▶ Play
          </button>
          <button id="ds-reset" class="text-xs font-medium px-3 py-1.5 rounded-lg bg-gray-700 hover:bg-gray-600 text-gray-300 transition-colors">
            Reset
          </button>
        </div>
      </div>

      <div id="ds-step-label" class="text-xs text-gray-500 dark:text-neutral-500 mb-4 min-h-[1.25rem]"></div>

      <div class="overflow-x-auto">
        <svg id="ds-svg" viewBox="0 0 720 260" class="w-full max-w-2xl mx-auto" style="min-width:480px">
          <line x1="90" y1="130" x2="190" y2="130" stroke="#374151" stroke-width="2" stroke-dasharray="6 4" id="edge-0"/>
          <line x1="310" y1="130" x2="410" y2="130" stroke="#374151" stroke-width="2" stroke-dasharray="6 4" id="edge-1"/>
          <line x1="530" y1="130" x2="630" y2="130" stroke="#374151" stroke-width="2" stroke-dasharray="6 4" id="edge-2"/>

          <g id="node-customer">
            <rect x="10" y="105" width="80" height="50" rx="10" fill="#444444" stroke="#374151" stroke-width="1.5"/>
            <text x="50" y="127" text-anchor="middle" fill="#9ca3af" font-size="9" font-family="Inter,sans-serif">Customer</text>
            <text x="50" y="142" text-anchor="middle" fill="#f3f4f6" font-size="11" font-weight="600" font-family="Inter,sans-serif" id="qty-customer">1,000</text>
            <text x="50" y="154" text-anchor="middle" fill="#6b7280" font-size="8" font-family="Inter,sans-serif">units/wk</text>
          </g>

          <g id="node-dc">
            <rect x="190" y="90" width="120" height="80" rx="10" fill="#444444" stroke="#374151" stroke-width="1.5"/>
            <text x="250" y="112" text-anchor="middle" fill="#9ca3af" font-size="9" font-family="Inter,sans-serif">Finished Good / DC</text>
            <text x="250" y="135" text-anchor="middle" fill="#f3f4f6" font-size="16" font-weight="700" font-family="Inter,sans-serif" id="qty-dc">420</text>
            <text x="250" y="148" text-anchor="middle" fill="#6b7280" font-size="8" font-family="Inter,sans-serif">units on hand</text>
            <text x="250" y="163" text-anchor="middle" fill="#6b7280" font-size="8" font-family="Inter,sans-serif" id="label-dc">18 days cover</text>
          </g>

          <g id="node-plant">
            <rect x="410" y="90" width="120" height="80" rx="10" fill="#444444" stroke="#374151" stroke-width="1.5"/>
            <text x="470" y="112" text-anchor="middle" fill="#9ca3af" font-size="9" font-family="Inter,sans-serif">Production Plant</text>
            <text x="470" y="135" text-anchor="middle" fill="#f3f4f6" font-size="16" font-weight="700" font-family="Inter,sans-serif" id="qty-plant">1,000</text>
            <text x="470" y="148" text-anchor="middle" fill="#6b7280" font-size="8" font-family="Inter,sans-serif">units/wk capacity</text>
            <text x="470" y="163" text-anchor="middle" fill="#6b7280" font-size="8" font-family="Inter,sans-serif" id="label-plant">72% utilized</text>
          </g>

          <g id="node-supplier">
            <rect x="630" y="105" width="80" height="50" rx="10" fill="#444444" stroke="#374151" stroke-width="1.5"/>
            <text x="670" y="127" text-anchor="middle" fill="#9ca3af" font-size="9" font-family="Inter,sans-serif">Supplier</text>
            <text x="670" y="142" text-anchor="middle" fill="#f3f4f6" font-size="11" font-weight="600" font-family="Inter,sans-serif" id="qty-supplier">4 wk</text>
            <text x="670" y="154" text-anchor="middle" fill="#6b7280" font-size="8" font-family="Inter,sans-serif">lead time</text>
          </g>

          <g id="shock-arrow" opacity="0">
            <polygon points="50,80 38,60 62,60" fill="#f87171"/>
            <text x="50" y="56" text-anchor="middle" fill="#f87171" font-size="9" font-weight="700" font-family="Inter,sans-serif">+40%</text>
          </g>
        </svg>
      </div>

      <div class="flex items-center gap-1 mt-4 justify-center">
        ${timelineDots(6)}
      </div>
    </div>
  `;
}

export function init(root) {
  const widget = root.querySelector('#demand-shock-widget');
  if (!widget || widget.dataset.bound === '1') return;
  widget.dataset.bound = '1';

  const STEPS = [
    {
      label: 'Baseline plan: steady state. Demand is 1,000 units/week.',
      customer: '1,000', dc: '420', dcLabel: '18 days cover',
      plant: '1,000', plantLabel: '72% utilized', plantStroke: '#374151',
      supplier: '4 wk', shockOpacity: 0,
      edgeColors: ['#374151', '#374151', '#374151'],
    },
    {
      label: 'Demand shock! Orders spike +40% to 1,400 units/week.',
      customer: '1,400', dc: '420', dcLabel: '18 days cover',
      plant: '1,000', plantLabel: '72% utilized', plantStroke: '#374151',
      supplier: '4 wk', shockOpacity: 1,
      edgeColors: ['#f87171', '#374151', '#374151'],
    },
    {
      label: 'DC inventory depletes fast — down to 6 days of cover. DC urgently replenishes from plant.',
      customer: '1,400', dc: '140', dcLabel: '⚠ 6 days cover',
      plant: '1,000', plantLabel: '72% utilized', plantStroke: '#374151',
      supplier: '4 wk', shockOpacity: 1,
      edgeColors: ['#f87171', '#f59e0b', '#374151'],
    },
    {
      label: 'Plant ramps to 1,400 units/week — hitting 100% capacity. Resource overload flagged!',
      customer: '1,400', dc: '140', dcLabel: '⚠ 6 days cover',
      plant: '1,400', plantLabel: '🔴 100% — overload!', plantStroke: '#ef4444',
      supplier: '4 wk', shockOpacity: 1,
      edgeColors: ['#f87171', '#f59e0b', '#f59e0b'],
    },
    {
      label: 'Emergency POs placed with supplier. Components arrive in 4 weeks.',
      customer: '1,400', dc: '140', dcLabel: '⚠ 6 days cover',
      plant: '1,400', plantLabel: '🔴 100% — overload!', plantStroke: '#ef4444',
      supplier: '4 wk', shockOpacity: 1,
      edgeColors: ['#f87171', '#f59e0b', '#a78bfa'],
    },
    {
      label: 'Week 5: Components arrive. Plant produces at full rate. DC recovers. Service level stabilises.',
      customer: '1,400', dc: '320', dcLabel: '✓ 16 days cover',
      plant: '1,400', plantLabel: '95% utilized', plantStroke: '#374151',
      supplier: '4 wk', shockOpacity: 0,
      edgeColors: ['#34d399', '#34d399', '#34d399'],
    },
  ];

  let current = 0;
  let timer = null;

  function setNodeRect(id, stroke) {
    const rect = widget.querySelector(`#${id} rect`);
    if (rect) rect.setAttribute('stroke', stroke);
  }

  function setEdge(id, color) {
    const el = widget.querySelector(`#${id}`);
    if (el) el.setAttribute('stroke', color);
  }

  function renderStep(n) {
    const s = STEPS[n];
    widget.querySelector('#ds-step-label').textContent = `Step ${n + 1}/6: ${s.label}`;
    widget.querySelector('#qty-customer').textContent = s.customer;
    widget.querySelector('#qty-dc').textContent = s.dc;
    widget.querySelector('#label-dc').textContent = s.dcLabel;
    widget.querySelector('#qty-plant').textContent = s.plant;
    widget.querySelector('#label-plant').textContent = s.plantLabel;
    widget.querySelector('#qty-supplier').textContent = s.supplier;

    const dcQty = widget.querySelector('#qty-dc');
    dcQty.setAttribute('fill', parseInt(s.dc.replace(',', '')) < 200 ? '#f87171' : '#f3f4f6');

    const plantQty = widget.querySelector('#qty-plant');
    plantQty.setAttribute('fill', s.plantLabel.includes('🔴') ? '#ef4444' : '#f3f4f6');

    setNodeRect('node-plant', s.plantStroke);
    setEdge('edge-0', s.edgeColors[0]);
    setEdge('edge-1', s.edgeColors[1]);
    setEdge('edge-2', s.edgeColors[2]);

    const shockArrow = widget.querySelector('#shock-arrow');
    if (shockArrow) shockArrow.setAttribute('opacity', String(s.shockOpacity));

    widget.querySelectorAll('.ds-dot').forEach((dot) => {
      const step = parseInt(dot.dataset.step ?? '0', 10);
      dot.classList.toggle('bg-violet-500', step === n);
      dot.classList.toggle('bg-gray-700', step !== n);
    });
  }

  function play() {
    if (timer) return;
    timer = window.setInterval(() => {
      current = (current + 1) % STEPS.length;
      renderStep(current);
      if (current === STEPS.length - 1) {
        clearInterval(timer);
        timer = null;
        widget.querySelector('#ds-play').textContent = '▶ Play';
      }
    }, 2200);
    widget.querySelector('#ds-play').textContent = '⏸ Pause';
  }

  function pause() {
    if (timer) { clearInterval(timer); timer = null; }
    widget.querySelector('#ds-play').textContent = '▶ Play';
  }

  widget.querySelector('#ds-play')?.addEventListener('click', () => {
    if (timer) { pause(); } else { play(); }
  });

  widget.querySelector('#ds-reset')?.addEventListener('click', () => {
    pause();
    current = 0;
    renderStep(0);
  });

  renderStep(0);
}
