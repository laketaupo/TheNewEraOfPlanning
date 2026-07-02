// Port of src/components/sim/WhatIfWidget.astro — self-contained slider-driven KPI simulator.
// No props, no frontmatter-derived data — all markup here is static UI chrome authored
// verbatim from the Astro source, so none of it needs escapeHtml().

export function render() {
  return `
    <div id="what-if-widget" class="rounded-2xl border border-emerald-200 dark:border-emerald-500/20 bg-emerald-50/50 dark:bg-neutral-900 p-6">
      <h3 class="text-sm font-semibold text-emerald-400 mb-6 flex items-center gap-2">
        <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4"/>
        </svg>
        What-If Simulator
      </h3>

      <div class="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-8">
        <div>
          <label class="flex items-center justify-between text-xs text-gray-500 dark:text-neutral-400 mb-2">
            <span>Demand uplift</span>
            <span id="demand-val" class="font-mono text-gray-900 dark:text-white">+0%</span>
          </label>
          <input id="demand-slider" type="range" min="-30" max="60" value="0" step="5"
            class="w-full h-2 bg-gray-200 dark:bg-neutral-700 rounded-full appearance-none cursor-pointer accent-emerald-500" />
          <div class="flex justify-between text-xs text-gray-400 dark:text-neutral-600 mt-1"><span>-30%</span><span>+60%</span></div>
        </div>

        <div>
          <label class="flex items-center justify-between text-xs text-gray-500 dark:text-neutral-400 mb-2">
            <span>Capacity available</span>
            <span id="capacity-val" class="font-mono text-gray-900 dark:text-white">100%</span>
          </label>
          <input id="capacity-slider" type="range" min="50" max="100" value="100" step="5"
            class="w-full h-2 bg-gray-200 dark:bg-neutral-700 rounded-full appearance-none cursor-pointer accent-sky-500" />
          <div class="flex justify-between text-xs text-gray-400 dark:text-neutral-600 mt-1"><span>50%</span><span>100%</span></div>
        </div>

        <div>
          <label class="flex items-center justify-between text-xs text-gray-500 dark:text-neutral-400 mb-2">
            <span>Supplier lead time</span>
            <span id="leadtime-val" class="font-mono text-gray-900 dark:text-white">4 wk</span>
          </label>
          <input id="leadtime-slider" type="range" min="2" max="12" value="4" step="1"
            class="w-full h-2 bg-gray-200 dark:bg-neutral-700 rounded-full appearance-none cursor-pointer accent-violet-500" />
          <div class="flex justify-between text-xs text-gray-400 dark:text-neutral-600 mt-1"><span>2 wk</span><span>12 wk</span></div>
        </div>
      </div>

      <div class="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div class="rounded-xl bg-white dark:bg-neutral-800/60 p-4 border border-gray-200 dark:border-neutral-700">
          <p class="text-xs text-gray-500 mb-1">Service level</p>
          <p id="kpi-service" class="text-2xl font-bold text-white">98.5%</p>
          <p id="kpi-service-delta" class="text-xs text-gray-500 mt-1"></p>
        </div>
        <div class="rounded-xl bg-white dark:bg-neutral-800/60 p-4 border border-gray-200 dark:border-neutral-700">
          <p class="text-xs text-gray-500 mb-1">Inventory days</p>
          <p id="kpi-inventory" class="text-2xl font-bold text-white">18</p>
          <p id="kpi-inventory-delta" class="text-xs text-gray-500 mt-1"></p>
        </div>
        <div class="rounded-xl bg-white dark:bg-neutral-800/60 p-4 border border-gray-200 dark:border-neutral-700">
          <p class="text-xs text-gray-500 mb-1">Capacity load</p>
          <p id="kpi-capacity" class="text-2xl font-bold text-white">72%</p>
          <p id="kpi-capacity-delta" class="text-xs text-gray-500 mt-1"></p>
        </div>
        <div class="rounded-xl bg-white dark:bg-neutral-800/60 p-4 border border-gray-200 dark:border-neutral-700">
          <p class="text-xs text-gray-500 mb-1">Plan status</p>
          <p id="kpi-feasible" class="text-sm font-semibold text-emerald-400 mt-1">Feasible</p>
        </div>
      </div>

      <div class="mt-4 flex justify-end">
        <button id="reset-btn" class="text-xs text-gray-500 hover:text-gray-300 transition-colors">Reset to baseline</button>
      </div>
    </div>
  `;
}

export function init(root) {
  const widget = root.querySelector('#what-if-widget');
  if (!widget || widget.dataset.bound === '1') return;
  widget.dataset.bound = '1';

  const BASE = { service: 98.5, inventory: 18, capacityLoad: 72 };

  const demandSlider = widget.querySelector('#demand-slider');
  const capacitySlider = widget.querySelector('#capacity-slider');
  const leadtimeSlider = widget.querySelector('#leadtime-slider');
  if (!demandSlider || !capacitySlider || !leadtimeSlider) return;

  function clamp(v, lo, hi) { return Math.max(lo, Math.min(hi, v)); }

  function compute() {
    const demandPct = parseInt(demandSlider.value, 10);
    const capPct = parseInt(capacitySlider.value, 10);
    const leadWeeks = parseInt(leadtimeSlider.value, 10);

    const demandFactor = 1 + demandPct / 100;
    const capFactor = capPct / 100;
    const ltFactor = leadWeeks / 4;

    const rawLoad = (BASE.capacityLoad * demandFactor) / capFactor;
    const capacityLoad = clamp(rawLoad, 0, 150);

    const ltPenalty = Math.max(0, (ltFactor - 1) * 8);
    const loadPenalty = Math.max(0, (capacityLoad - 100) * 0.25);
    const service = clamp(BASE.service - ltPenalty - loadPenalty, 40, 100);

    const inventory = clamp(BASE.inventory * ltFactor * (1 / demandFactor), 4, 60);

    const feasible = capacityLoad <= 100 && service >= 90;

    return { service, inventory, capacityLoad, feasible };
  }

  function fmt(v, decimals = 1) { return v.toFixed(decimals); }

  function delta(now, base, unit, higherIsBetter) {
    const diff = now - base;
    if (Math.abs(diff) < 0.1) return '';
    const sign = diff > 0 ? '+' : '';
    const color = (diff > 0) === higherIsBetter ? 'text-emerald-400' : 'text-red-400';
    return `<span class="${color}">${sign}${fmt(diff)}${unit} vs baseline</span>`;
  }

  function renderState() {
    const { service, inventory, capacityLoad, feasible } = compute();

    widget.querySelector('#demand-val').textContent =
      (parseInt(demandSlider.value, 10) >= 0 ? '+' : '') + demandSlider.value + '%';
    widget.querySelector('#capacity-val').textContent = capacitySlider.value + '%';
    widget.querySelector('#leadtime-val').textContent = leadtimeSlider.value + ' wk';

    const svcEl = widget.querySelector('#kpi-service');
    svcEl.textContent = fmt(service) + '%';
    svcEl.className = `text-2xl font-bold ${service < 90 ? 'text-red-400' : service < 95 ? 'text-amber-400' : 'text-white'}`;
    widget.querySelector('#kpi-service-delta').innerHTML = delta(service, BASE.service, '%', true);

    const invEl = widget.querySelector('#kpi-inventory');
    invEl.textContent = fmt(inventory, 0);
    invEl.className = `text-2xl font-bold ${inventory < 7 ? 'text-red-400' : 'text-white'}`;
    widget.querySelector('#kpi-inventory-delta').innerHTML = delta(inventory, BASE.inventory, ' days', true);

    const capEl = widget.querySelector('#kpi-capacity');
    capEl.textContent = fmt(capacityLoad, 0) + '%';
    capEl.className = `text-2xl font-bold ${capacityLoad > 100 ? 'text-red-400' : capacityLoad > 90 ? 'text-amber-400' : 'text-white'}`;
    widget.querySelector('#kpi-capacity-delta').innerHTML = delta(capacityLoad, BASE.capacityLoad, '%', false);

    const fEl = widget.querySelector('#kpi-feasible');
    fEl.textContent = feasible ? 'Feasible' : capacityLoad > 100 ? 'Capacity breach' : 'Low service risk';
    fEl.className = `text-sm font-semibold mt-1 ${feasible ? 'text-emerald-400' : 'text-red-400'}`;
  }

  [demandSlider, capacitySlider, leadtimeSlider].forEach((el) => el.addEventListener('input', renderState));

  widget.querySelector('#reset-btn')?.addEventListener('click', () => {
    demandSlider.value = '0';
    capacitySlider.value = '100';
    leadtimeSlider.value = '4';
    renderState();
  });

  renderState();
}
