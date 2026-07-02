// Maps a topic's `topicLayout` frontmatter value to its rendering module.
// Port of the layout-selection ternary chain in src/pages/[theme]/[module]/[chapter]/[topic].astro.
import * as topic from './topic.js';
import * as nodeTopic from './node-topic.js';
import * as cardGrid from './card-grid.js';
import * as comparison from './comparison.js';
import * as dataTable from './data-table.js';
import * as fullWidthWidget from './full-width-widget.js';
import * as rasciTable from './rasci-table.js';
import * as processStepDetail from './process-step-detail.js';
import * as uiTraining from './ui-training.js';

const registry = {
  'node-topic': nodeTopic,
  'card-grid': cardGrid,
  'comparison': comparison,
  'data-table': dataTable,
  // Registry key is `full-widget` (the frontmatter value used in content), even though the
  // module file is named full-width-widget.js.
  'full-widget': fullWidthWidget,
  'rasci-table': rasciTable,
  'process-step-detail': processStepDetail,
  'ui-training': uiTraining,
};

/** Resolves a topic's layout module. `undefined`/unknown/`'prose-topic'` all fall back to `topic`. */
export function getLayout(topicLayout) {
  return registry[topicLayout] ?? topic;
}
