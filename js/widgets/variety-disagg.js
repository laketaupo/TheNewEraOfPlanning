// Port of src/components/sim/VarietyDisaggWidget.astro — variety → item disaggregation
// simulator. Static widget chrome + seed KEYS/ITEMS data authored verbatim from the Astro
// source (not frontmatter-derived), so none of it needs escapeHtml().

export function render() {
  return `
    <div id="vdw" class="rounded-2xl border border-sky-200 dark:border-sky-500/20 bg-white dark:bg-neutral-900 p-6 select-none">

      <div class="flex flex-wrap items-center justify-between gap-4 mb-5">
        <h3 class="text-sm font-semibold text-sky-500 flex items-center gap-2">
          <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h7"/>
          </svg>
          Variety → Item Disaggregation
        </h3>
      </div>

      <p class="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Disaggregation key</p>
      <div id="vdw-keys" class="grid grid-cols-1 sm:grid-cols-3 gap-2 mb-3"></div>
      <p id="vdw-key-desc" class="text-xs text-gray-400 mb-6 min-h-4"></p>

      <div class="flex flex-col md:flex-row items-stretch gap-3 md:gap-4 mb-6">

        <div class="flex-1 rounded-xl border border-gray-200 dark:border-neutral-700 bg-gray-50 dark:bg-neutral-800/60 p-4">
          <p id="vdw-mix-title" class="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">Sales volume mix</p>
          <div class="flex items-end justify-around gap-4 h-32" id="vdw-hist-chart"></div>
          <div class="flex justify-around gap-4 mt-2" id="vdw-hist-labels"></div>
        </div>

        <div class="flex items-center justify-center shrink-0">
          <span class="text-3xl font-light text-gray-300 dark:text-neutral-600">×</span>
        </div>

        <div class="flex-1 rounded-xl border border-sky-200 dark:border-sky-500/30 bg-sky-50 dark:bg-sky-500/10 p-4 flex flex-col items-center justify-center text-center">
          <p class="text-xs font-semibold text-sky-600 dark:text-sky-400 uppercase tracking-wide mb-2">Variety forecast</p>
          <p class="text-sm font-semibold text-gray-700 dark:text-neutral-200">🥕 Carrot</p>
          <p class="text-4xl font-bold text-sky-500 tabular-nums leading-none mt-2">1,000</p>
          <p class="text-xs text-gray-400 mt-1.5">pieces · fixed</p>
        </div>
      </div>

      <div class="flex items-center gap-3 mb-5">
        <span class="text-2xl font-light text-gray-300 dark:text-neutral-600">=</span>
        <p class="text-xs font-semibold text-gray-500 uppercase tracking-wide">Disaggregated forecast per item</p>
      </div>

      <div id="vdw-results" class="space-y-4"></div>

      <div class="mt-5 pt-3 border-t border-gray-100 dark:border-neutral-800 flex justify-between text-sm">
        <span class="text-gray-400 dark:text-neutral-500">Sum of items</span>
        <span id="vdw-check" class="font-bold tabular-nums text-emerald-600 dark:text-emerald-400">1,000 pcs</span>
      </div>
    </div>
  `;
}

export function init(root) {
  const widget = root.querySelector('#vdw');
  if (!widget || widget.dataset.bound === '1') return;
  widget.dataset.bound = '1';

  const FORECAST = 1000;
  const ITEMS = [
    { id: 'x', name: 'Item X', pack: '250 g pack', color: '#ef4444' },
    { id: 'y', name: 'Item Y', pack: '500 g pack', color: '#f59e0b' },
    { id: 'z', name: 'Item Z', pack: '1 kg pack',  color: '#10b981' },
  ];

  const KEYS = [
    {
      id: 'ex1',
      label: 'Example 1',
      mixTitle: 'Example 1 · mix',
      desc: 'Small packs sold the most last year — the count skews toward Item X.',
      unit: 'pcs',
      basis: { x: 5000, y: 3000, z: 2000 },
    },
    {
      id: 'ex2',
      label: 'Example 2',
      mixTitle: 'Example 2 · mix',
      desc: 'A different sales history — the large pack (Item Z) sold the most pieces.',
      unit: 'pcs',
      basis: { x: 2000, y: 3000, z: 5000 },
    },
    {
      id: 'ex3',
      label: 'Example 3',
      mixTitle: 'Example 3 · mix',
      desc: 'All three pack sizes sold roughly the same — the forecast splits evenly.',
      unit: 'pcs',
      basis: { x: 3000, y: 3000, z: 3000 },
    },
  ];

  let activeKey = KEYS[0].id;

  const fmt = (n) => Math.round(n).toLocaleString('en-US');
  const fmtBasis = (n, unit) =>
    unit === '€' ? `€${fmt(n)}` : unit ? `${fmt(n)} ${unit}` : fmt(n);

  function key() { return KEYS.find((k) => k.id === activeKey); }

  function buildKeyTabs() {
    const el = widget.querySelector('#vdw-keys');
    el.innerHTML = '';
    KEYS.forEach((k) => {
      const btn = document.createElement('button');
      btn.id = `vdw-key-${k.id}`;
      btn.className = 'rounded-lg border px-3 py-2 text-sm font-medium transition-all';
      btn.textContent = k.label;
      btn.addEventListener('click', () => { activeKey = k.id; renderState(); });
      el.appendChild(btn);
    });
  }

  function buildResultsShell() {
    const el = widget.querySelector('#vdw-results');
    el.innerHTML = '';
    ITEMS.forEach((it) => {
      el.innerHTML += `
        <div>
          <div class="flex justify-between items-baseline mb-1 text-sm">
            <span class="font-medium text-gray-700 dark:text-neutral-300 flex items-center gap-2">
              <span class="w-2.5 h-2.5 rounded-sm inline-block" style="background:${it.color}"></span>
              ${it.name} <span class="text-gray-400 font-normal text-xs">· ${it.pack}</span>
            </span>
            <span class="tabular-nums text-gray-400">
              1,000 × <span id="vdw-rpct-${it.id}" class="font-semibold" style="color:${it.color}">0%</span>
              = <span id="vdw-units-${it.id}" class="font-bold text-gray-700 dark:text-neutral-200">0</span> pcs
            </span>
          </div>
          <div class="h-4 bg-gray-100 dark:bg-neutral-800 rounded-full overflow-hidden">
            <div id="vdw-bar-${it.id}" class="h-full rounded-full transition-all duration-300"
                 style="width:0%;background:${it.color}"></div>
          </div>
        </div>`;
    });
  }

  function renderState() {
    const k = key();
    const total = ITEMS.reduce((a, it) => a + k.basis[it.id], 0) || 1;
    const maxShare = Math.max(...ITEMS.map((it) => k.basis[it.id])) / total;

    KEYS.forEach((kk) => {
      const btn = widget.querySelector(`#vdw-key-${kk.id}`);
      btn.className = kk.id === activeKey
        ? 'rounded-lg border-2 border-sky-500 bg-sky-50 dark:bg-sky-500/10 text-sky-700 dark:text-sky-300 px-3 py-2 text-sm font-medium transition-all'
        : 'rounded-lg border border-gray-200 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-gray-600 dark:text-neutral-300 hover:border-sky-300 dark:hover:border-sky-600 px-3 py-2 text-sm font-medium transition-all';
    });

    widget.querySelector('#vdw-key-desc').textContent = k.desc;
    widget.querySelector('#vdw-mix-title').textContent = k.mixTitle;

    const chart = widget.querySelector('#vdw-hist-chart');
    const labels = widget.querySelector('#vdw-hist-labels');
    chart.innerHTML = '';
    labels.innerHTML = '';
    ITEMS.forEach((it) => {
      const share = k.basis[it.id] / total;
      const col = document.createElement('div');
      col.className = 'flex-1 max-w-[64px] flex flex-col justify-end items-center h-full';
      col.innerHTML = `
        <span class="text-xs font-bold tabular-nums" style="color:${it.color}">${Math.round(share * 100)}%</span>
        <span class="text-[10px] text-gray-400 tabular-nums mb-1">${fmtBasis(k.basis[it.id], k.unit)}</span>
        <div class="w-full rounded-t transition-all duration-300" style="height:${(share / maxShare) * 100}%;background:${it.color}"></div>`;
      chart.appendChild(col);

      const lbl = document.createElement('div');
      lbl.className = 'flex-1 max-w-[64px] text-center';
      lbl.innerHTML = `<span class="text-xs font-medium text-gray-600 dark:text-neutral-300">${it.name}</span>`;
      labels.appendChild(lbl);
    });

    let shownSum = 0;
    ITEMS.forEach((it) => {
      const share = k.basis[it.id] / total;
      const units = Math.round(FORECAST * share);
      shownSum += units;
      widget.querySelector(`#vdw-rpct-${it.id}`).textContent = `${Math.round(share * 100)}%`;
      widget.querySelector(`#vdw-units-${it.id}`).textContent = fmt(units);
      widget.querySelector(`#vdw-bar-${it.id}`).style.width = `${share * 100}%`;
    });
    widget.querySelector('#vdw-check').textContent = `${fmt(shownSum)} pcs`;
  }

  buildKeyTabs();
  buildResultsShell();
  renderState();
}
