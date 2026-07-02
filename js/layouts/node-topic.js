// Port of src/layouts/NodeTopicLayout.astro — network node diagram (item / transformation /
// transportation / resource) with a summary paragraph + bullet-point characteristics panel.
import { escapeHtml } from '../markdown.js';
import { colorMap, renderTopHeader, renderBottomNav, renderChapterMeta, themeFilter } from './shared.js';

const svgColorMap = {
  indigo:  'text-indigo-500 dark:text-indigo-400',
  violet:  'text-violet-500 dark:text-violet-400',
  sky:     'text-sky-500 dark:text-sky-400',
  emerald: 'text-emerald-500 dark:text-emerald-400',
  amber:   'text-amber-500 dark:text-amber-400',
  teal:    'text-teal-500 dark:text-teal-400',
  yellow:  'text-yellow-500 dark:text-yellow-400',
  blue:    'text-blue-500 dark:text-blue-400',
  red:     'text-red-500 dark:text-red-400',
};

const dotColorMap = {
  indigo:  'bg-indigo-500 dark:bg-indigo-400',
  violet:  'bg-violet-500 dark:bg-violet-400',
  sky:     'bg-sky-500 dark:bg-sky-400',
  emerald: 'bg-emerald-500 dark:bg-emerald-400',
  amber:   'bg-amber-500 dark:bg-amber-400',
  teal:    'bg-teal-500 dark:bg-teal-400',
  yellow:  'bg-yellow-500 dark:bg-yellow-400',
  blue:    'bg-blue-500 dark:bg-blue-400',
  red:     'bg-red-500 dark:bg-red-400',
};

function renderNodeSvg(props) {
  const { nodeType, nodeLocation, lineInLabel, lineOutLabel, durationLabel, transportMode, consumptionLabel } = props;

  if (nodeType === 'item') {
    return `
            <svg viewBox="0 0 280 ${nodeLocation ? 185 : 165}" class="w-full" aria-label="Item node — upward triangle">
              <polygon points="140,20 230,140 50,140" fill="none" stroke="currentColor" stroke-width="2" stroke-linejoin="round"/>
              <text x="140" y="158" text-anchor="middle" fill="currentColor" font-size="13" font-family="Inter,sans-serif" opacity="0.6">Item</text>
              ${nodeLocation ? `<text x="140" y="176" text-anchor="middle" fill="currentColor" font-size="11" font-family="Inter,sans-serif" opacity="0.4">${escapeHtml(nodeLocation)}</text>` : ''}
            </svg>`;
  }

  if (nodeType === 'transformation') {
    return `
            <svg viewBox="0 0 400 128" class="w-full" aria-label="Transformation process — two item triangles connected via a circle">
              <polygon points="75,15 110,95 40,95" fill="none" stroke="currentColor" stroke-width="2" stroke-linejoin="round"/>
              <text x="75" y="113" text-anchor="middle" fill="currentColor" font-size="12" font-family="Inter,sans-serif" opacity="0.6">Item A</text>
              <line x1="93" y1="55" x2="165" y2="55" stroke="currentColor" stroke-width="2"/>
              ${lineInLabel ? `<text x="129" y="47" text-anchor="middle" fill="currentColor" font-size="10" font-family="Inter,sans-serif" opacity="0.5">${escapeHtml(lineInLabel)}</text>` : ''}
              <circle cx="200" cy="55" r="35" fill="none" stroke="currentColor" stroke-width="2"/>
              <text x="200" y="59" text-anchor="middle" fill="currentColor" font-size="12" font-family="Inter,sans-serif" opacity="0.6">BOM</text>
              ${durationLabel ? `<text x="200" y="103" text-anchor="middle" fill="currentColor" font-size="11" font-family="Inter,sans-serif" opacity="0.5">${escapeHtml(durationLabel)}</text>` : ''}
              <line x1="235" y1="55" x2="307" y2="55" stroke="currentColor" stroke-width="2"/>
              ${lineOutLabel ? `<text x="271" y="47" text-anchor="middle" fill="currentColor" font-size="10" font-family="Inter,sans-serif" opacity="0.5">${escapeHtml(lineOutLabel)}</text>` : ''}
              <polygon points="325,15 360,95 290,95" fill="none" stroke="currentColor" stroke-width="2" stroke-linejoin="round"/>
              <text x="325" y="113" text-anchor="middle" fill="currentColor" font-size="12" font-family="Inter,sans-serif" opacity="0.6">Item B</text>
            </svg>`;
  }

  if (nodeType === 'transportation') {
    return `
            <svg viewBox="0 0 400 148" class="w-full" aria-label="Transportation process — same item at two locations connected via a circle">
              <polygon points="75,15 110,95 40,95" fill="none" stroke="currentColor" stroke-width="2" stroke-linejoin="round"/>
              <text x="75" y="113" text-anchor="middle" fill="currentColor" font-size="12" font-family="Inter,sans-serif" opacity="0.6">Item B</text>
              <text x="75" y="129" text-anchor="middle" fill="currentColor" font-size="10" font-family="Inter,sans-serif" opacity="0.45">Location 1</text>
              <line x1="93" y1="55" x2="165" y2="55" stroke="currentColor" stroke-width="2"/>
              <circle cx="200" cy="55" r="35" fill="none" stroke="currentColor" stroke-width="2"/>
              <text x="200" y="59" text-anchor="middle" fill="currentColor" font-size="12" font-family="Inter,sans-serif" opacity="0.6">BOD</text>
              ${transportMode ? `<text x="200" y="103" text-anchor="middle" fill="currentColor" font-size="11" font-family="Inter,sans-serif" opacity="0.5">${escapeHtml(transportMode)}</text>` : ''}
              ${durationLabel ? `<text x="200" y="103" text-anchor="middle" fill="currentColor" font-size="11" font-family="Inter,sans-serif" opacity="0.5">${escapeHtml(durationLabel)}</text>` : ''}
              <line x1="235" y1="55" x2="307" y2="55" stroke="currentColor" stroke-width="2"/>
              <polygon points="325,15 360,95 290,95" fill="none" stroke="currentColor" stroke-width="2" stroke-linejoin="round"/>
              <text x="325" y="113" text-anchor="middle" fill="currentColor" font-size="12" font-family="Inter,sans-serif" opacity="0.6">Item B</text>
              <text x="325" y="129" text-anchor="middle" fill="currentColor" font-size="10" font-family="Inter,sans-serif" opacity="0.45">Location 2</text>
            </svg>`;
  }

  if (nodeType === 'resource') {
    return `
            <svg viewBox="0 0 400 228" class="w-full" aria-label="Resource — downward triangle connected to top of transformation circle, with two input/output items">
              <text x="200" y="16" text-anchor="middle" fill="currentColor" font-size="12" font-family="Inter,sans-serif" opacity="0.6">Resource</text>
              <polygon points="165,25 235,25 200,75" fill="none" stroke="currentColor" stroke-width="2" stroke-linejoin="round"/>
              <line x1="200" y1="75" x2="200" y2="120" stroke="currentColor" stroke-width="2"/>
              ${consumptionLabel ? `<text x="210" y="101" text-anchor="start" fill="currentColor" font-size="11" font-family="Inter,sans-serif" opacity="0.5">${escapeHtml(consumptionLabel)}</text>` : ''}
              <circle cx="200" cy="155" r="35" fill="none" stroke="currentColor" stroke-width="2"/>
              <text x="200" y="159" text-anchor="middle" fill="currentColor" font-size="12" font-family="Inter,sans-serif" opacity="0.6">BOM</text>
              <polygon points="75,115 110,195 40,195" fill="none" stroke="currentColor" stroke-width="2" stroke-linejoin="round"/>
              <line x1="93" y1="155" x2="165" y2="155" stroke="currentColor" stroke-width="2"/>
              <text x="75" y="212" text-anchor="middle" fill="currentColor" font-size="12" font-family="Inter,sans-serif" opacity="0.6">Item A</text>
              <polygon points="325,115 360,195 290,195" fill="none" stroke="currentColor" stroke-width="2" stroke-linejoin="round"/>
              <line x1="235" y1="155" x2="307" y2="155" stroke="currentColor" stroke-width="2"/>
              <text x="325" y="212" text-anchor="middle" fill="currentColor" font-size="12" font-family="Inter,sans-serif" opacity="0.6">Item B</text>
            </svg>`;
  }

  return '';
}

export function render(props) {
  const svgColor = svgColorMap[props.chapterColor] ?? 'text-indigo-500 dark:text-indigo-400';
  const dotColor = dotColorMap[props.chapterColor] ?? 'bg-indigo-500';
  const chapterColorClass = colorMap[props.chapterColor] ?? 'text-brand-600 dark:text-brand-400 border-brand-500';
  const breadcrumbColorClass = chapterColorClass.split(' ')[0];
  const bullets = props.bullets ?? [];

  return `
${renderTopHeader(props)}

  <main
    class="min-h-screen pt-12 pb-32 flex flex-col items-center"
    data-pagefind-body
    data-pagefind-filter="${themeFilter(props)}"
  >
    ${renderChapterMeta(props)}
    <article class="w-full max-w-5xl px-6 py-7 animate-slide-up">

      <p class="text-sm font-medium mb-1 ${breadcrumbColorClass}">
        Chapter ${escapeHtml(props.chapterOrder)} · Topic ${escapeHtml(props.topicOrder)}
      </p>

      <h1 class="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-5 leading-tight">${escapeHtml(props.title)}</h1>

      <div class="grid grid-cols-1 lg:grid-cols-[2fr_1fr] gap-4 mb-4">

        <div class="rounded-2xl border border-gray-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 p-12 flex flex-col min-h-[520px] ${svgColor}">
          <div class="flex-1 flex items-center justify-center">
          ${renderNodeSvg(props)}
          </div>
        </div>

        <div class="rounded-2xl border border-gray-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 p-6">
          <ul class="space-y-4">
            ${bullets.map((bullet) => `
              <li class="flex items-start gap-3">
                <span class="mt-2 w-1.5 h-1.5 rounded-full shrink-0 ${dotColor}"></span>
                <span class="text-sm text-gray-700 dark:text-neutral-300 leading-relaxed">${escapeHtml(bullet)}</span>
              </li>`).join('')}
          </ul>
        </div>
      </div>

      <div class="rounded-2xl border border-gray-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 p-6">
        <p class="text-gray-600 dark:text-neutral-300 leading-relaxed text-[15px]">${escapeHtml(props.summary ?? '')}</p>
      </div>

    </article>
  </main>

${renderBottomNav(props)}`;
}
