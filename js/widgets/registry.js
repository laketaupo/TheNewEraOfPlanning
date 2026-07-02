// Port of the `topic.widget` -> component dispatch previously done inline in
// src/pages/[theme]/[module]/[chapter]/[topic].astro (see CONTRACTS.md §3).
import * as whatIf from './what-if.js';
import * as demandShock from './demand-shock.js';
import * as walkthrough from './walkthrough.js';
import * as graph from './graph.js';
import * as demandFlow from './demand-flow.js';
import * as supplyFlow from './supply-flow.js';
import * as orgChart from './org-chart.js';
import * as demandSlicing from './demand-slicing.js';
import * as varietyDisagg from './variety-disagg.js';
import * as seasonalDisagg from './seasonal-disagg.js';

const registry = {
  'what-if': whatIf,
  'demand-shock': demandShock,
  'walkthrough': walkthrough,
  'graph': graph,
  'demand-flow': demandFlow,
  'supply-flow': supplyFlow,
  'org-chart': orgChart,
  'demand-slicing': demandSlicing,
  'variety-disagg': varietyDisagg,
  'seasonal-disagg': seasonalDisagg,
};

/** Looks up a widget module by `topic.widget` key. Returns null if unknown/unset. */
export function getWidget(widgetKey) {
  return registry[widgetKey] ?? null;
}
