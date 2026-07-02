// Port of src/components/sim/SeasonalDisaggWidget.astro — year → month disaggregation
// simulator. Static widget chrome + seed COUNTRIES/BASE profile data authored verbatim from
// the Astro source (not frontmatter-derived), so none of it needs escapeHtml().

export function render() {
  return `
    <div id="sdw" class="rounded-2xl border border-sky-200 dark:border-sky-500/20 bg-white dark:bg-neutral-900 p-6 select-none">

      <div class="flex flex-wrap items-center justify-between gap-4 mb-5">
        <h3 class="text-sm font-semibold text-sky-500 flex items-center gap-2">
          <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/>
          </svg>
          Year → Month Disaggregation
        </h3>
        <div class="text-right">
          <span class="text-sm text-gray-400">Annual total&nbsp;</span>
          <span class="text-lg font-bold text-sky-500 tabular-nums">1,000</span>
          <span class="text-xs text-gray-400">units</span>
        </div>
      </div>

      <p class="text-xs text-gray-400 dark:text-neutral-500 uppercase tracking-wide font-medium mb-3">Select a country</p>
      <div id="sdw-grid" class="grid grid-cols-2 sm:grid-cols-3 gap-2 mb-6"></div>

      <div class="flex items-baseline justify-between mb-3">
        <p class="text-xs text-gray-400 dark:text-neutral-500 uppercase tracking-wide font-medium">
          Monthly split — <span id="sdw-active-name" class="text-sky-500 font-semibold normal-case">Netherlands</span>
        </p>
        <p class="text-xs text-gray-400">Peak: <span id="sdw-active-peak" class="font-semibold text-sky-500">—</span></p>
      </div>
      <div class="flex items-end gap-1.5 h-48" id="sdw-chart"></div>
      <div class="flex gap-1.5 mt-1" id="sdw-labels"></div>

      <p class="text-xs text-gray-400 mt-5 pt-4 border-t border-gray-100 dark:border-neutral-800">
        Northern and Southern hemisphere profiles are phase-shifted ~6 months — switch between a Northern and a Southern country and watch the peak jump to the opposite side of the year.
      </p>
    </div>
  `;
}

export function init(root) {
  const widget = root.querySelector('#sdw');
  if (!widget || widget.dataset.bound === '1') return;
  widget.dataset.bound = '1';

  const TOTAL = 1000;
  const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  // Fiscal year runs September → August. ORDER maps display column → calendar index.
  const ORDER = [8, 9, 10, 11, 0, 1, 2, 3, 4, 5, 6, 7];
  const ACCENT = '#0ea5e9';

  // Base seasonal shape — vegetable demand peaks in spring / early summer.
  // Index 4 (May) is the peak of the base curve.
  const BASE = [40, 50, 95, 150, 175, 140, 95, 70, 60, 50, 40, 35];

  const COUNTRIES = [
    { id: 'nl', name: 'Netherlands',  hemi: 'N', flag: '🇳🇱', shift: 0 },
    { id: 'de', name: 'Germany',      hemi: 'N', flag: '🇩🇪', shift: -1 },
    { id: 'us', name: 'USA',          hemi: 'N', flag: '🇺🇸', shift: 1 },
    { id: 'cl', name: 'Chile',        hemi: 'S', flag: '🇨🇱', shift: 6 },
    { id: 'nz', name: 'New Zealand',  hemi: 'S', flag: '🇳🇿', shift: 7 },
    { id: 'za', name: 'South Africa', hemi: 'S', flag: '🇿🇦', shift: 5 },
  ];

  let selected = 'nl';

  const profileFor = (id) => {
    const shift = COUNTRIES.find((c) => c.id === id).shift;
    return BASE.map((_, m) => BASE[(m - shift + 12) % 12]);
  };
  const peakMonthFor = (id) => {
    const p = profileFor(id);
    return MONTHS[p.indexOf(Math.max(...p))];
  };
  const fmt = (n) => Math.round(n).toLocaleString('en-US');

  function buildGrid() {
    const el = widget.querySelector('#sdw-grid');
    el.innerHTML = '';
    COUNTRIES.forEach((c) => {
      const btn = document.createElement('button');
      btn.id = `sdw-card-${c.id}`;
      btn.className = 'text-left rounded-xl border px-3 py-2.5 transition-all';
      btn.innerHTML = `
        <div class="flex items-center gap-2">
          <span class="text-lg leading-none">${c.flag}</span>
          <span class="text-sm font-semibold">${c.name}</span>
        </div>
        <div class="text-xs mt-1 opacity-70">
          ${c.hemi === 'N' ? 'Northern' : 'Southern'} · peak ${peakMonthFor(c.id)}
        </div>`;
      btn.addEventListener('click', () => { selected = c.id; renderState(); });
      el.appendChild(btn);
    });
  }

  function buildChart() {
    const chart = widget.querySelector('#sdw-chart');
    const labels = widget.querySelector('#sdw-labels');
    chart.innerHTML = '';
    labels.innerHTML = '';
    for (let p = 0; p < 12; p++) {
      const col = document.createElement('div');
      col.className = 'flex-1 flex flex-col justify-end items-center h-full';
      col.innerHTML = `
        <span id="sdw-val-${p}" class="text-[9px] font-medium text-gray-500 dark:text-neutral-400 mb-1 tabular-nums"></span>
        <div id="sdw-bar-${p}" class="w-full rounded-t transition-all duration-500" style="height:0%;background:${ACCENT}"></div>`;
      chart.appendChild(col);

      const lbl = document.createElement('span');
      lbl.className = 'flex-1 text-center text-[10px] text-gray-400 dark:text-neutral-500';
      lbl.textContent = MONTHS[ORDER[p]][0];
      labels.appendChild(lbl);
    }
  }

  function renderState() {
    const prof = profileFor(selected);
    const sum = prof.reduce((a, b) => a + b, 0);
    const peak = Math.max(...prof);
    const country = COUNTRIES.find((c) => c.id === selected);

    widget.querySelector('#sdw-active-name').textContent = country.name;
    widget.querySelector('#sdw-active-peak').textContent = peakMonthFor(selected);

    for (let p = 0; p < 12; p++) {
      const cal = ORDER[p];
      const units = TOTAL * (prof[cal] / sum);
      widget.querySelector(`#sdw-bar-${p}`).style.height = `${(prof[cal] / peak) * 100}%`;
      widget.querySelector(`#sdw-val-${p}`).textContent = fmt(units);
    }

    COUNTRIES.forEach((c) => {
      const card = widget.querySelector(`#sdw-card-${c.id}`);
      if (c.id === selected) {
        card.className = 'text-left rounded-xl border-2 border-sky-500 bg-sky-50 dark:bg-sky-500/10 text-sky-700 dark:text-sky-300 px-3 py-2.5 transition-all';
      } else {
        card.className = 'text-left rounded-xl border border-gray-200 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-gray-600 dark:text-neutral-300 hover:border-sky-300 dark:hover:border-sky-600 px-3 py-2.5 transition-all';
      }
    });
  }

  buildGrid();
  buildChart();
  renderState();
}
