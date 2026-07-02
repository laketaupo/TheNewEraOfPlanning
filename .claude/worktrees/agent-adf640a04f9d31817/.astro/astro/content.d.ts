declare module 'astro:content' {
	interface Render {
		'.mdx': Promise<{
			Content: import('astro').MarkdownInstance<{}>['Content'];
			headings: import('astro').MarkdownHeading[];
			remarkPluginFrontmatter: Record<string, any>;
			components: import('astro').MDXInstance<{}>['components'];
		}>;
	}
}

declare module 'astro:content' {
	interface RenderResult {
		Content: import('astro/runtime/server/index.js').AstroComponentFactory;
		headings: import('astro').MarkdownHeading[];
		remarkPluginFrontmatter: Record<string, any>;
	}
	interface Render {
		'.md': Promise<RenderResult>;
	}

	export interface RenderedContent {
		html: string;
		metadata?: {
			imagePaths: Array<string>;
			[key: string]: unknown;
		};
	}
}

declare module 'astro:content' {
	type Flatten<T> = T extends { [K: string]: infer U } ? U : never;

	export type CollectionKey = keyof AnyEntryMap;
	export type CollectionEntry<C extends CollectionKey> = Flatten<AnyEntryMap[C]>;

	export type ContentCollectionKey = keyof ContentEntryMap;
	export type DataCollectionKey = keyof DataEntryMap;

	type AllValuesOf<T> = T extends any ? T[keyof T] : never;
	type ValidContentEntrySlug<C extends keyof ContentEntryMap> = AllValuesOf<
		ContentEntryMap[C]
	>['slug'];

	/** @deprecated Use `getEntry` instead. */
	export function getEntryBySlug<
		C extends keyof ContentEntryMap,
		E extends ValidContentEntrySlug<C> | (string & {}),
	>(
		collection: C,
		// Note that this has to accept a regular string too, for SSR
		entrySlug: E,
	): E extends ValidContentEntrySlug<C>
		? Promise<CollectionEntry<C>>
		: Promise<CollectionEntry<C> | undefined>;

	/** @deprecated Use `getEntry` instead. */
	export function getDataEntryById<C extends keyof DataEntryMap, E extends keyof DataEntryMap[C]>(
		collection: C,
		entryId: E,
	): Promise<CollectionEntry<C>>;

	export function getCollection<C extends keyof AnyEntryMap, E extends CollectionEntry<C>>(
		collection: C,
		filter?: (entry: CollectionEntry<C>) => entry is E,
	): Promise<E[]>;
	export function getCollection<C extends keyof AnyEntryMap>(
		collection: C,
		filter?: (entry: CollectionEntry<C>) => unknown,
	): Promise<CollectionEntry<C>[]>;

	export function getEntry<
		C extends keyof ContentEntryMap,
		E extends ValidContentEntrySlug<C> | (string & {}),
	>(entry: {
		collection: C;
		slug: E;
	}): E extends ValidContentEntrySlug<C>
		? Promise<CollectionEntry<C>>
		: Promise<CollectionEntry<C> | undefined>;
	export function getEntry<
		C extends keyof DataEntryMap,
		E extends keyof DataEntryMap[C] | (string & {}),
	>(entry: {
		collection: C;
		id: E;
	}): E extends keyof DataEntryMap[C]
		? Promise<DataEntryMap[C][E]>
		: Promise<CollectionEntry<C> | undefined>;
	export function getEntry<
		C extends keyof ContentEntryMap,
		E extends ValidContentEntrySlug<C> | (string & {}),
	>(
		collection: C,
		slug: E,
	): E extends ValidContentEntrySlug<C>
		? Promise<CollectionEntry<C>>
		: Promise<CollectionEntry<C> | undefined>;
	export function getEntry<
		C extends keyof DataEntryMap,
		E extends keyof DataEntryMap[C] | (string & {}),
	>(
		collection: C,
		id: E,
	): E extends keyof DataEntryMap[C]
		? Promise<DataEntryMap[C][E]>
		: Promise<CollectionEntry<C> | undefined>;

	/** Resolve an array of entry references from the same collection */
	export function getEntries<C extends keyof ContentEntryMap>(
		entries: {
			collection: C;
			slug: ValidContentEntrySlug<C>;
		}[],
	): Promise<CollectionEntry<C>[]>;
	export function getEntries<C extends keyof DataEntryMap>(
		entries: {
			collection: C;
			id: keyof DataEntryMap[C];
		}[],
	): Promise<CollectionEntry<C>[]>;

	export function render<C extends keyof AnyEntryMap>(
		entry: AnyEntryMap[C][string],
	): Promise<RenderResult>;

	export function reference<C extends keyof AnyEntryMap>(
		collection: C,
	): import('astro/zod').ZodEffects<
		import('astro/zod').ZodString,
		C extends keyof ContentEntryMap
			? {
					collection: C;
					slug: ValidContentEntrySlug<C>;
				}
			: {
					collection: C;
					id: keyof DataEntryMap[C];
				}
	>;
	// Allow generic `string` to avoid excessive type errors in the config
	// if `dev` is not running to update as you edit.
	// Invalid collection names will be caught at build time.
	export function reference<C extends string>(
		collection: C,
	): import('astro/zod').ZodEffects<import('astro/zod').ZodString, never>;

	type ReturnTypeOrOriginal<T> = T extends (...args: any[]) => infer R ? R : T;
	type InferEntrySchema<C extends keyof AnyEntryMap> = import('astro/zod').infer<
		ReturnTypeOrOriginal<Required<ContentConfig['collections'][C]>['schema']>
	>;

	type ContentEntryMap = {
		"chapters": {
"01-understanding-basics/bod-transport-lead-time.md": {
	id: "01-understanding-basics/bod-transport-lead-time.md";
  slug: "01-understanding-basics/bod-transport-lead-time";
  body: string;
  collection: "chapters";
  data: any
} & { render(): Render[".md"] };
"01-understanding-basics/bod-transport-mode.md": {
	id: "01-understanding-basics/bod-transport-mode.md";
  slug: "01-understanding-basics/bod-transport-mode";
  body: string;
  collection: "chapters";
  data: any
} & { render(): Render[".md"] };
"01-understanding-basics/bod.md": {
	id: "01-understanding-basics/bod.md";
  slug: "01-understanding-basics/bod";
  body: string;
  collection: "chapters";
  data: any
} & { render(): Render[".md"] };
"01-understanding-basics/bom-input-output.md": {
	id: "01-understanding-basics/bom-input-output.md";
  slug: "01-understanding-basics/bom-input-output";
  body: string;
  collection: "chapters";
  data: any
} & { render(): Render[".md"] };
"01-understanding-basics/bom-lead-time.md": {
	id: "01-understanding-basics/bom-lead-time.md";
  slug: "01-understanding-basics/bom-lead-time";
  body: string;
  collection: "chapters";
  data: any
} & { render(): Render[".md"] };
"01-understanding-basics/bom.md": {
	id: "01-understanding-basics/bom.md";
  slug: "01-understanding-basics/bom";
  body: string;
  collection: "chapters";
  data: any
} & { render(): Render[".md"] };
"01-understanding-basics/item-at-location.md": {
	id: "01-understanding-basics/item-at-location.md";
  slug: "01-understanding-basics/item-at-location";
  body: string;
  collection: "chapters";
  data: any
} & { render(): Render[".md"] };
"01-understanding-basics/item.md": {
	id: "01-understanding-basics/item.md";
  slug: "01-understanding-basics/item";
  body: string;
  collection: "chapters";
  data: any
} & { render(): Render[".md"] };
"01-understanding-basics/resource-consumed.md": {
	id: "01-understanding-basics/resource-consumed.md";
  slug: "01-understanding-basics/resource-consumed";
  body: string;
  collection: "chapters";
  data: any
} & { render(): Render[".md"] };
"01-understanding-basics/resource.md": {
	id: "01-understanding-basics/resource.md";
  slug: "01-understanding-basics/resource";
  body: string;
  collection: "chapters";
  data: any
} & { render(): Render[".md"] };
"02-the-network/calibrating.md": {
	id: "02-the-network/calibrating.md";
  slug: "02-the-network/calibrating";
  body: string;
  collection: "chapters";
  data: any
} & { render(): Render[".md"] };
"02-the-network/cleaning.md": {
	id: "02-the-network/cleaning.md";
  slug: "02-the-network/cleaning";
  body: string;
  collection: "chapters";
  data: any
} & { render(): Render[".md"] };
"02-the-network/coating.md": {
	id: "02-the-network/coating.md";
  slug: "02-the-network/coating";
  body: string;
  collection: "chapters";
  data: any
} & { render(): Render[".md"] };
"02-the-network/final-shipment.md": {
	id: "02-the-network/final-shipment.md";
  slug: "02-the-network/final-shipment";
  body: string;
  collection: "chapters";
  data: any
} & { render(): Render[".md"] };
"02-the-network/full-network.md": {
	id: "02-the-network/full-network.md";
  slug: "02-the-network/full-network";
  body: string;
  collection: "chapters";
  data: any
} & { render(): Render[".md"] };
"02-the-network/packing.md": {
	id: "02-the-network/packing.md";
  slug: "02-the-network/packing";
  body: string;
  collection: "chapters";
  data: any
} & { render(): Render[".md"] };
"02-the-network/priming.md": {
	id: "02-the-network/priming.md";
  slug: "02-the-network/priming";
  body: string;
  collection: "chapters";
  data: any
} & { render(): Render[".md"] };
"02-the-network/seed-production.md": {
	id: "02-the-network/seed-production.md";
  slug: "02-the-network/seed-production";
  body: string;
  collection: "chapters";
  data: any
} & { render(): Render[".md"] };
"02-the-network/shipping-items-to-grower.md": {
	id: "02-the-network/shipping-items-to-grower.md";
  slug: "02-the-network/shipping-items-to-grower";
  body: string;
  collection: "chapters";
  data: any
} & { render(): Render[".md"] };
"02-the-network/shipping-seeds-back.md": {
	id: "02-the-network/shipping-seeds-back.md";
  slug: "02-the-network/shipping-seeds-back";
  body: string;
  collection: "chapters";
  data: any
} & { render(): Render[".md"] };
"02-the-network/starting-items.md": {
	id: "02-the-network/starting-items.md";
  slug: "02-the-network/starting-items";
  body: string;
  collection: "chapters";
  data: any
} & { render(): Render[".md"] };
"03-data-flow/demand-signal.md": {
	id: "03-data-flow/demand-signal.md";
  slug: "03-data-flow/demand-signal";
  body: string;
  collection: "chapters";
  data: any
} & { render(): Render[".md"] };
"03-data-flow/downstream-cascade.md": {
	id: "03-data-flow/downstream-cascade.md";
  slug: "03-data-flow/downstream-cascade";
  body: string;
  collection: "chapters";
  data: any
} & { render(): Render[".md"] };
"03-data-flow/forecast-origin.md": {
	id: "03-data-flow/forecast-origin.md";
  slug: "03-data-flow/forecast-origin";
  body: string;
  collection: "chapters";
  data: any
} & { render(): Render[".md"] };
"03-data-flow/inventory-netting.md": {
	id: "03-data-flow/inventory-netting.md";
  slug: "03-data-flow/inventory-netting";
  body: string;
  collection: "chapters";
  data: any
} & { render(): Render[".md"] };
"03-data-flow/parent-line-items.md": {
	id: "03-data-flow/parent-line-items.md";
  slug: "03-data-flow/parent-line-items";
  body: string;
  collection: "chapters";
  data: any
} & { render(): Render[".md"] };
"03-data-flow/supply-signal.md": {
	id: "03-data-flow/supply-signal.md";
  slug: "03-data-flow/supply-signal";
  body: string;
  collection: "chapters";
  data: any
} & { render(): Render[".md"] };
"03-data-flow/timing-and-netting.md": {
	id: "03-data-flow/timing-and-netting.md";
  slug: "03-data-flow/timing-and-netting";
  body: string;
  collection: "chapters";
  data: any
} & { render(): Render[".md"] };
"03-data-flow/upstream-cascade.md": {
	id: "03-data-flow/upstream-cascade.md";
  slug: "03-data-flow/upstream-cascade";
  body: string;
  collection: "chapters";
  data: any
} & { render(): Render[".md"] };
"03-the-logic/backward-consumption.md": {
	id: "03-the-logic/backward-consumption.md";
  slug: "03-the-logic/backward-consumption";
  body: string;
  collection: "chapters";
  data: any
} & { render(): Render[".md"] };
"03-the-logic/demand-slicing.md": {
	id: "03-the-logic/demand-slicing.md";
  slug: "03-the-logic/demand-slicing";
  body: string;
  collection: "chapters";
  data: any
} & { render(): Render[".md"] };
"03-the-logic/disaggregation-variety-to-item.md": {
	id: "03-the-logic/disaggregation-variety-to-item.md";
  slug: "03-the-logic/disaggregation-variety-to-item";
  body: string;
  collection: "chapters";
  data: any
} & { render(): Render[".md"] };
"03-the-logic/disaggregation-year-to-month.md": {
	id: "03-the-logic/disaggregation-year-to-month.md";
  slug: "03-the-logic/disaggregation-year-to-month";
  body: string;
  collection: "chapters";
  data: any
} & { render(): Render[".md"] };
"03-the-logic/pull.md": {
	id: "03-the-logic/pull.md";
  slug: "03-the-logic/pull";
  body: string;
  collection: "chapters";
  data: any
} & { render(): Render[".md"] };
"03-the-logic/push.md": {
	id: "03-the-logic/push.md";
  slug: "03-the-logic/push";
  body: string;
  collection: "chapters";
  data: any
} & { render(): Render[".md"] };
"03-the-logic/safety-stock.md": {
	id: "03-the-logic/safety-stock.md";
  slug: "03-the-logic/safety-stock";
  body: string;
  collection: "chapters";
  data: any
} & { render(): Render[".md"] };
"03-the-logic/scheduled-receipt.md": {
	id: "03-the-logic/scheduled-receipt.md";
  slug: "03-the-logic/scheduled-receipt";
  body: string;
  collection: "chapters";
  data: any
} & { render(): Render[".md"] };
"04-the-simulation/promoting-a-simulation.md": {
	id: "04-the-simulation/promoting-a-simulation.md";
  slug: "04-the-simulation/promoting-a-simulation";
  body: string;
  collection: "chapters";
  data: any
} & { render(): Render[".md"] };
"04-the-simulation/reading-simulation-results.md": {
	id: "04-the-simulation/reading-simulation-results.md";
  slug: "04-the-simulation/reading-simulation-results";
  body: string;
  collection: "chapters";
  data: any
} & { render(): Render[".md"] };
"04-the-simulation/running-the-simulation.md": {
	id: "04-the-simulation/running-the-simulation.md";
  slug: "04-the-simulation/running-the-simulation";
  body: string;
  collection: "chapters";
  data: any
} & { render(): Render[".md"] };
"04-the-simulation/setting-up-a-simulation.md": {
	id: "04-the-simulation/setting-up-a-simulation.md";
  slug: "04-the-simulation/setting-up-a-simulation";
  body: string;
  collection: "chapters";
  data: any
} & { render(): Render[".md"] };
"04-the-simulation/what-is-a-workflow-simulation.md": {
	id: "04-the-simulation/what-is-a-workflow-simulation.md";
  slug: "04-the-simulation/what-is-a-workflow-simulation";
  body: string;
  collection: "chapters";
  data: any
} & { render(): Render[".md"] };
"05-navigation-and-ui/navigating-planning-software.md": {
	id: "05-navigation-and-ui/navigating-planning-software.md";
  slug: "05-navigation-and-ui/navigating-planning-software";
  body: string;
  collection: "chapters";
  data: any
} & { render(): Render[".md"] };
"05-navigation-and-ui/reading-plan-output.md": {
	id: "05-navigation-and-ui/reading-plan-output.md";
  slug: "05-navigation-and-ui/reading-plan-output";
  body: string;
  collection: "chapters";
  data: any
} & { render(): Render[".md"] };
"05-navigation-and-ui/the-user-interface-walkthrough.md": {
	id: "05-navigation-and-ui/the-user-interface-walkthrough.md";
  slug: "05-navigation-and-ui/the-user-interface-walkthrough";
  body: string;
  collection: "chapters";
  data: any
} & { render(): Render[".md"] };
"05-navigation-and-ui/the-user-interface.md": {
	id: "05-navigation-and-ui/the-user-interface.md";
  slug: "05-navigation-and-ui/the-user-interface";
  body: string;
  collection: "chapters";
  data: any
} & { render(): Render[".md"] };
"08-configuration-manual/configuring-bods.md": {
	id: "08-configuration-manual/configuring-bods.md";
  slug: "08-configuration-manual/configuring-bods";
  body: string;
  collection: "chapters";
  data: any
} & { render(): Render[".md"] };
"08-configuration-manual/configuring-boms.md": {
	id: "08-configuration-manual/configuring-boms.md";
  slug: "08-configuration-manual/configuring-boms";
  body: string;
  collection: "chapters";
  data: any
} & { render(): Render[".md"] };
"08-configuration-manual/configuring-items.md": {
	id: "08-configuration-manual/configuring-items.md";
  slug: "08-configuration-manual/configuring-items";
  body: string;
  collection: "chapters";
  data: any
} & { render(): Render[".md"] };
"08-configuration-manual/configuring-resources.md": {
	id: "08-configuration-manual/configuring-resources.md";
  slug: "08-configuration-manual/configuring-resources";
  body: string;
  collection: "chapters";
  data: any
} & { render(): Render[".md"] };
"08-configuration-manual/getting-started.md": {
	id: "08-configuration-manual/getting-started.md";
  slug: "08-configuration-manual/getting-started";
  body: string;
  collection: "chapters";
  data: any
} & { render(): Render[".md"] };
"08-configuration-manual/planning-parameters.md": {
	id: "08-configuration-manual/planning-parameters.md";
  slug: "08-configuration-manual/planning-parameters";
  body: string;
  collection: "chapters";
  data: any
} & { render(): Render[".md"] };
"99-layout-showcase/card-grid.md": {
	id: "99-layout-showcase/card-grid.md";
  slug: "99-layout-showcase/card-grid";
  body: string;
  collection: "chapters";
  data: any
} & { render(): Render[".md"] };
"99-layout-showcase/comparison.md": {
	id: "99-layout-showcase/comparison.md";
  slug: "99-layout-showcase/comparison";
  body: string;
  collection: "chapters";
  data: any
} & { render(): Render[".md"] };
"99-layout-showcase/data-table.md": {
	id: "99-layout-showcase/data-table.md";
  slug: "99-layout-showcase/data-table";
  body: string;
  collection: "chapters";
  data: any
} & { render(): Render[".md"] };
"99-layout-showcase/full-widget.md": {
	id: "99-layout-showcase/full-widget.md";
  slug: "99-layout-showcase/full-widget";
  body: string;
  collection: "chapters";
  data: any
} & { render(): Render[".md"] };
"99-layout-showcase/node-topic.md": {
	id: "99-layout-showcase/node-topic.md";
  slug: "99-layout-showcase/node-topic";
  body: string;
  collection: "chapters";
  data: any
} & { render(): Render[".md"] };
"99-layout-showcase/prose-topic.md": {
	id: "99-layout-showcase/prose-topic.md";
  slug: "99-layout-showcase/prose-topic";
  body: string;
  collection: "chapters";
  data: any
} & { render(): Render[".md"] };
"99-layout-showcase/topic-with-widget.md": {
	id: "99-layout-showcase/topic-with-widget.md";
  slug: "99-layout-showcase/topic-with-widget";
  body: string;
  collection: "chapters";
  data: any
} & { render(): Render[".md"] };
"arch-01-end-to-end/batchrun.md": {
	id: "arch-01-end-to-end/batchrun.md";
  slug: "arch-01-end-to-end/batchrun";
  body: string;
  collection: "chapters";
  data: any
} & { render(): Render[".md"] };
"arch-01-end-to-end/data-upload.md": {
	id: "arch-01-end-to-end/data-upload.md";
  slug: "arch-01-end-to-end/data-upload";
  body: string;
  collection: "chapters";
  data: any
} & { render(): Render[".md"] };
"arch-01-end-to-end/interfaces.md": {
	id: "arch-01-end-to-end/interfaces.md";
  slug: "arch-01-end-to-end/interfaces";
  body: string;
  collection: "chapters";
  data: any
} & { render(): Render[".md"] };
"arch-02-integration/erp-planning-software-integration.md": {
	id: "arch-02-integration/erp-planning-software-integration.md";
  slug: "arch-02-integration/erp-planning-software-integration";
  body: string;
  collection: "chapters";
  data: any
} & { render(): Render[".md"] };
"arch-02-integration/planning-software-fms-mdm.md": {
	id: "arch-02-integration/planning-software-fms-mdm.md";
  slug: "arch-02-integration/planning-software-fms-mdm";
  body: string;
  collection: "chapters";
  data: any
} & { render(): Render[".md"] };
"data-01-planning-data-fundamentals/how-data-flows-into-a-plan.md": {
	id: "data-01-planning-data-fundamentals/how-data-flows-into-a-plan.md";
  slug: "data-01-planning-data-fundamentals/how-data-flows-into-a-plan";
  body: string;
  collection: "chapters";
  data: any
} & { render(): Render[".md"] };
"data-01-planning-data-fundamentals/the-cost-of-bad-data.md": {
	id: "data-01-planning-data-fundamentals/the-cost-of-bad-data.md";
  slug: "data-01-planning-data-fundamentals/the-cost-of-bad-data";
  body: string;
  collection: "chapters";
  data: any
} & { render(): Render[".md"] };
"data-01-planning-data-fundamentals/what-is-data-driven-planning.md": {
	id: "data-01-planning-data-fundamentals/what-is-data-driven-planning.md";
  slug: "data-01-planning-data-fundamentals/what-is-data-driven-planning";
  body: string;
  collection: "chapters";
  data: any
} & { render(): Render[".md"] };
"data-02-data-quality-and-impact/common-data-problems.md": {
	id: "data-02-data-quality-and-impact/common-data-problems.md";
  slug: "data-02-data-quality-and-impact/common-data-problems";
  body: string;
  collection: "chapters";
  data: any
} & { render(): Render[".md"] };
"data-02-data-quality-and-impact/how-data-quality-shows-up-in-plans.md": {
	id: "data-02-data-quality-and-impact/how-data-quality-shows-up-in-plans.md";
  slug: "data-02-data-quality-and-impact/how-data-quality-shows-up-in-plans";
  body: string;
  collection: "chapters";
  data: any
} & { render(): Render[".md"] };
"data-02-data-quality-and-impact/improving-data-quality-over-time.md": {
	id: "data-02-data-quality-and-impact/improving-data-quality-over-time.md";
  slug: "data-02-data-quality-and-impact/improving-data-quality-over-time";
  body: string;
  collection: "chapters";
  data: any
} & { render(): Render[".md"] };
"data-02-data-quality-and-impact/what-makes-data-good-enough.md": {
	id: "data-02-data-quality-and-impact/what-makes-data-good-enough.md";
  slug: "data-02-data-quality-and-impact/what-makes-data-good-enough";
  body: string;
  collection: "chapters";
  data: any
} & { render(): Render[".md"] };
"data-03-data-types/master-data.md": {
	id: "data-03-data-types/master-data.md";
  slug: "data-03-data-types/master-data";
  body: string;
  collection: "chapters";
  data: any
} & { render(): Render[".md"] };
"data-03-data-types/planning-parameters.md": {
	id: "data-03-data-types/planning-parameters.md";
  slug: "data-03-data-types/planning-parameters";
  body: string;
  collection: "chapters";
  data: any
} & { render(): Render[".md"] };
"data-03-data-types/transactional-data.md": {
	id: "data-03-data-types/transactional-data.md";
  slug: "data-03-data-types/transactional-data";
  body: string;
  collection: "chapters";
  data: any
} & { render(): Render[".md"] };
"data-04-data-governance/data-confidence.md": {
	id: "data-04-data-governance/data-confidence.md";
  slug: "data-04-data-governance/data-confidence";
  body: string;
  collection: "chapters";
  data: any
} & { render(): Render[".md"] };
"data-04-data-governance/data-definitions.md": {
	id: "data-04-data-governance/data-definitions.md";
  slug: "data-04-data-governance/data-definitions";
  body: string;
  collection: "chapters";
  data: any
} & { render(): Render[".md"] };
"data-04-data-governance/data-governance-basics.md": {
	id: "data-04-data-governance/data-governance-basics.md";
  slug: "data-04-data-governance/data-governance-basics";
  body: string;
  collection: "chapters";
  data: any
} & { render(): Render[".md"] };
"data-04-data-governance/data-ownership.md": {
	id: "data-04-data-governance/data-ownership.md";
  slug: "data-04-data-governance/data-ownership";
  body: string;
  collection: "chapters";
  data: any
} & { render(): Render[".md"] };
"data-05-data-sources-and-model/data-model-overview.md": {
	id: "data-05-data-sources-and-model/data-model-overview.md";
  slug: "data-05-data-sources-and-model/data-model-overview";
  body: string;
  collection: "chapters";
  data: any
} & { render(): Render[".md"] };
"data-05-data-sources-and-model/where-data-comes-from.md": {
	id: "data-05-data-sources-and-model/where-data-comes-from.md";
  slug: "data-05-data-sources-and-model/where-data-comes-from";
  body: string;
  collection: "chapters";
  data: any
} & { render(): Render[".md"] };
"erp-01-erp-basics/core-erp-concepts.md": {
	id: "erp-01-erp-basics/core-erp-concepts.md";
  slug: "erp-01-erp-basics/core-erp-concepts";
  body: string;
  collection: "chapters";
  data: any
} & { render(): Render[".md"] };
"erp-01-erp-basics/erp-vs-legacy-erp.md": {
	id: "erp-01-erp-basics/erp-vs-legacy-erp.md";
  slug: "erp-01-erp-basics/erp-vs-legacy-erp";
  body: string;
  collection: "chapters";
  data: any
} & { render(): Render[".md"] };
"erp-01-erp-basics/what-is-erp.md": {
	id: "erp-01-erp-basics/what-is-erp.md";
  slug: "erp-01-erp-basics/what-is-erp";
  body: string;
  collection: "chapters";
  data: any
} & { render(): Render[".md"] };
"erp-02-the-data-model/how-erp-structures-data.md": {
	id: "erp-02-the-data-model/how-erp-structures-data.md";
  slug: "erp-02-the-data-model/how-erp-structures-data";
  body: string;
  collection: "chapters";
  data: any
} & { render(): Render[".md"] };
"erp-02-the-data-model/key-master-data-in-erp.md": {
	id: "erp-02-the-data-model/key-master-data-in-erp.md";
  slug: "erp-02-the-data-model/key-master-data-in-erp";
  body: string;
  collection: "chapters";
  data: any
} & { render(): Render[".md"] };
"erp-02-the-data-model/key-transactional-data-in-erp.md": {
	id: "erp-02-the-data-model/key-transactional-data-in-erp.md";
  slug: "erp-02-the-data-model/key-transactional-data-in-erp";
  body: string;
  collection: "chapters";
  data: any
} & { render(): Render[".md"] };
"erp-03-data-flow-into-erp/data-validation-and-posting.md": {
	id: "erp-03-data-flow-into-erp/data-validation-and-posting.md";
  slug: "erp-03-data-flow-into-erp/data-validation-and-posting";
  body: string;
  collection: "chapters";
  data: any
} & { render(): Render[".md"] };
"erp-03-data-flow-into-erp/how-operational-data-enters-erp.md": {
	id: "erp-03-data-flow-into-erp/how-operational-data-enters-erp.md";
  slug: "erp-03-data-flow-into-erp/how-operational-data-enters-erp";
  body: string;
  collection: "chapters";
  data: any
} & { render(): Render[".md"] };
"erp-03-data-flow-into-erp/where-data-originates.md": {
	id: "erp-03-data-flow-into-erp/where-data-originates.md";
  slug: "erp-03-data-flow-into-erp/where-data-originates";
  body: string;
  collection: "chapters";
  data: any
} & { render(): Render[".md"] };
"erp-04-data-flow-out-of-erp/erp-output-to-other-systems.md": {
	id: "erp-04-data-flow-out-of-erp/erp-output-to-other-systems.md";
  slug: "erp-04-data-flow-out-of-erp/erp-output-to-other-systems";
  body: string;
  collection: "chapters";
  data: any
} & { render(): Render[".md"] };
"erp-04-data-flow-out-of-erp/reconciling-erp-and-planning-data.md": {
	id: "erp-04-data-flow-out-of-erp/reconciling-erp-and-planning-data.md";
  slug: "erp-04-data-flow-out-of-erp/reconciling-erp-and-planning-data";
  body: string;
  collection: "chapters";
  data: any
} & { render(): Render[".md"] };
"erp-04-data-flow-out-of-erp/what-erp-sends-to-planning.md": {
	id: "erp-04-data-flow-out-of-erp/what-erp-sends-to-planning.md";
  slug: "erp-04-data-flow-out-of-erp/what-erp-sends-to-planning";
  body: string;
  collection: "chapters";
  data: any
} & { render(): Render[".md"] };
"erp-05-the-logic/erp-business-rules.md": {
	id: "erp-05-the-logic/erp-business-rules.md";
  slug: "erp-05-the-logic/erp-business-rules";
  body: string;
  collection: "chapters";
  data: any
} & { render(): Render[".md"] };
"erp-05-the-logic/inventory-management-logic.md": {
	id: "erp-05-the-logic/inventory-management-logic.md";
  slug: "erp-05-the-logic/inventory-management-logic";
  body: string;
  collection: "chapters";
  data: any
} & { render(): Render[".md"] };
"erp-05-the-logic/order-management-logic.md": {
	id: "erp-05-the-logic/order-management-logic.md";
  slug: "erp-05-the-logic/order-management-logic";
  body: string;
  collection: "chapters";
  data: any
} & { render(): Render[".md"] };
"erp-06-key-erp-workflows/creating-and-managing-orders.md": {
	id: "erp-06-key-erp-workflows/creating-and-managing-orders.md";
  slug: "erp-06-key-erp-workflows/creating-and-managing-orders";
  body: string;
  collection: "chapters";
  data: any
} & { render(): Render[".md"] };
"erp-06-key-erp-workflows/goods-receipt-and-issue.md": {
	id: "erp-06-key-erp-workflows/goods-receipt-and-issue.md";
  slug: "erp-06-key-erp-workflows/goods-receipt-and-issue";
  body: string;
  collection: "chapters";
  data: any
} & { render(): Render[".md"] };
"erp-06-key-erp-workflows/reporting-and-extraction.md": {
	id: "erp-06-key-erp-workflows/reporting-and-extraction.md";
  slug: "erp-06-key-erp-workflows/reporting-and-extraction";
  body: string;
  collection: "chapters";
  data: any
} & { render(): Render[".md"] };
"erp-07-navigation-and-ui/navigating-erp.md": {
	id: "erp-07-navigation-and-ui/navigating-erp.md";
  slug: "erp-07-navigation-and-ui/navigating-erp";
  body: string;
  collection: "chapters";
  data: any
} & { render(): Render[".md"] };
"erp-07-navigation-and-ui/reading-erp-output.md": {
	id: "erp-07-navigation-and-ui/reading-erp-output.md";
  slug: "erp-07-navigation-and-ui/reading-erp-output";
  body: string;
  collection: "chapters";
  data: any
} & { render(): Render[".md"] };
"erp-07-navigation-and-ui/the-erp-interface.md": {
	id: "erp-07-navigation-and-ui/the-erp-interface.md";
  slug: "erp-07-navigation-and-ui/the-erp-interface";
  body: string;
  collection: "chapters";
  data: any
} & { render(): Render[".md"] };
"exec-01-execution-fundamentals/execution-and-erp.md": {
	id: "exec-01-execution-fundamentals/execution-and-erp.md";
  slug: "exec-01-execution-fundamentals/execution-and-erp";
  body: string;
  collection: "chapters";
  data: any
} & { render(): Render[".md"] };
"exec-01-execution-fundamentals/execution-exceptions.md": {
	id: "exec-01-execution-fundamentals/execution-exceptions.md";
  slug: "exec-01-execution-fundamentals/execution-exceptions";
  body: string;
  collection: "chapters";
  data: any
} & { render(): Render[".md"] };
"exec-01-execution-fundamentals/execution-kpis.md": {
	id: "exec-01-execution-fundamentals/execution-kpis.md";
  slug: "exec-01-execution-fundamentals/execution-kpis";
  body: string;
  collection: "chapters";
  data: any
} & { render(): Render[".md"] };
"exec-01-execution-fundamentals/from-plan-to-action.md": {
	id: "exec-01-execution-fundamentals/from-plan-to-action.md";
  slug: "exec-01-execution-fundamentals/from-plan-to-action";
  body: string;
  collection: "chapters";
  data: any
} & { render(): Render[".md"] };
"exec-01-execution-fundamentals/what-is-execution.md": {
	id: "exec-01-execution-fundamentals/what-is-execution.md";
  slug: "exec-01-execution-fundamentals/what-is-execution";
  body: string;
  collection: "chapters";
  data: any
} & { render(): Render[".md"] };
"exec-02-daily-execution/execution-discipline.md": {
	id: "exec-02-daily-execution/execution-discipline.md";
  slug: "exec-02-daily-execution/execution-discipline";
  body: string;
  collection: "chapters";
  data: any
} & { render(): Render[".md"] };
"exec-02-daily-execution/feedback-to-planning.md": {
	id: "exec-02-daily-execution/feedback-to-planning.md";
  slug: "exec-02-daily-execution/feedback-to-planning";
  body: string;
  collection: "chapters";
  data: any
} & { render(): Render[".md"] };
"exec-02-daily-execution/order-prioritisation.md": {
	id: "exec-02-daily-execution/order-prioritisation.md";
  slug: "exec-02-daily-execution/order-prioritisation";
  body: string;
  collection: "chapters";
  data: any
} & { render(): Render[".md"] };
"exec-02-daily-execution/real-time-visibility.md": {
	id: "exec-02-daily-execution/real-time-visibility.md";
  slug: "exec-02-daily-execution/real-time-visibility";
  body: string;
  collection: "chapters";
  data: any
} & { render(): Render[".md"] };
"fms-01-understanding-basics/core-fms-concepts.md": {
	id: "fms-01-understanding-basics/core-fms-concepts.md";
  slug: "fms-01-understanding-basics/core-fms-concepts";
  body: string;
  collection: "chapters";
  data: any
} & { render(): Render[".md"] };
"fms-01-understanding-basics/what-is-fms.md": {
	id: "fms-01-understanding-basics/what-is-fms.md";
  slug: "fms-01-understanding-basics/what-is-fms";
  body: string;
  collection: "chapters";
  data: any
} & { render(): Render[".md"] };
"fms-01-understanding-basics/why-field-management-matters.md": {
	id: "fms-01-understanding-basics/why-field-management-matters.md";
  slug: "fms-01-understanding-basics/why-field-management-matters";
  body: string;
  collection: "chapters";
  data: any
} & { render(): Render[".md"] };
"fms-02-the-data-model/field-to-plan-data-mapping.md": {
	id: "fms-02-the-data-model/field-to-plan-data-mapping.md";
  slug: "fms-02-the-data-model/field-to-plan-data-mapping";
  body: string;
  collection: "chapters";
  data: any
} & { render(): Render[".md"] };
"fms-02-the-data-model/how-fms-structures-data.md": {
	id: "fms-02-the-data-model/how-fms-structures-data.md";
  slug: "fms-02-the-data-model/how-fms-structures-data";
  body: string;
  collection: "chapters";
  data: any
} & { render(): Render[".md"] };
"fms-02-the-data-model/key-field-data-entities.md": {
	id: "fms-02-the-data-model/key-field-data-entities.md";
  slug: "fms-02-the-data-model/key-field-data-entities";
  body: string;
  collection: "chapters";
  data: any
} & { render(): Render[".md"] };
"fms-03-data-flow-into-fms/data-capture-and-validation.md": {
	id: "fms-03-data-flow-into-fms/data-capture-and-validation.md";
  slug: "fms-03-data-flow-into-fms/data-capture-and-validation";
  body: string;
  collection: "chapters";
  data: any
} & { render(): Render[".md"] };
"fms-03-data-flow-into-fms/how-field-activity-enters-fms.md": {
	id: "fms-03-data-flow-into-fms/how-field-activity-enters-fms.md";
  slug: "fms-03-data-flow-into-fms/how-field-activity-enters-fms";
  body: string;
  collection: "chapters";
  data: any
} & { render(): Render[".md"] };
"fms-03-data-flow-into-fms/where-field-data-originates.md": {
	id: "fms-03-data-flow-into-fms/where-field-data-originates.md";
  slug: "fms-03-data-flow-into-fms/where-field-data-originates";
  body: string;
  collection: "chapters";
  data: any
} & { render(): Render[".md"] };
"fms-04-data-flow-out-of-fms/fms-output-to-other-systems.md": {
	id: "fms-04-data-flow-out-of-fms/fms-output-to-other-systems.md";
  slug: "fms-04-data-flow-out-of-fms/fms-output-to-other-systems";
  body: string;
  collection: "chapters";
  data: any
} & { render(): Render[".md"] };
"fms-04-data-flow-out-of-fms/reconciling-field-data-with-the-plan.md": {
	id: "fms-04-data-flow-out-of-fms/reconciling-field-data-with-the-plan.md";
  slug: "fms-04-data-flow-out-of-fms/reconciling-field-data-with-the-plan";
  body: string;
  collection: "chapters";
  data: any
} & { render(): Render[".md"] };
"fms-04-data-flow-out-of-fms/what-fms-sends-to-planning.md": {
	id: "fms-04-data-flow-out-of-fms/what-fms-sends-to-planning.md";
  slug: "fms-04-data-flow-out-of-fms/what-fms-sends-to-planning";
  body: string;
  collection: "chapters";
  data: any
} & { render(): Render[".md"] };
"fms-05-the-logic/field-assignment-logic.md": {
	id: "fms-05-the-logic/field-assignment-logic.md";
  slug: "fms-05-the-logic/field-assignment-logic";
  body: string;
  collection: "chapters";
  data: any
} & { render(): Render[".md"] };
"fms-05-the-logic/fms-business-rules.md": {
	id: "fms-05-the-logic/fms-business-rules.md";
  slug: "fms-05-the-logic/fms-business-rules";
  body: string;
  collection: "chapters";
  data: any
} & { render(): Render[".md"] };
"fms-05-the-logic/yield-and-activity-tracking.md": {
	id: "fms-05-the-logic/yield-and-activity-tracking.md";
  slug: "fms-05-the-logic/yield-and-activity-tracking";
  body: string;
  collection: "chapters";
  data: any
} & { render(): Render[".md"] };
"fms-06-key-fms-workflows/managing-field-activities.md": {
	id: "fms-06-key-fms-workflows/managing-field-activities.md";
  slug: "fms-06-key-fms-workflows/managing-field-activities";
  body: string;
  collection: "chapters";
  data: any
} & { render(): Render[".md"] };
"fms-06-key-fms-workflows/recording-actuals.md": {
	id: "fms-06-key-fms-workflows/recording-actuals.md";
  slug: "fms-06-key-fms-workflows/recording-actuals";
  body: string;
  collection: "chapters";
  data: any
} & { render(): Render[".md"] };
"fms-06-key-fms-workflows/reporting-and-extraction.md": {
	id: "fms-06-key-fms-workflows/reporting-and-extraction.md";
  slug: "fms-06-key-fms-workflows/reporting-and-extraction";
  body: string;
  collection: "chapters";
  data: any
} & { render(): Render[".md"] };
"fms-07-navigation-and-ui/navigating-fms.md": {
	id: "fms-07-navigation-and-ui/navigating-fms.md";
  slug: "fms-07-navigation-and-ui/navigating-fms";
  body: string;
  collection: "chapters";
  data: any
} & { render(): Render[".md"] };
"fms-07-navigation-and-ui/reading-fms-output.md": {
	id: "fms-07-navigation-and-ui/reading-fms-output.md";
  slug: "fms-07-navigation-and-ui/reading-fms-output";
  body: string;
  collection: "chapters";
  data: any
} & { render(): Render[".md"] };
"fms-07-navigation-and-ui/the-fms-interface.md": {
	id: "fms-07-navigation-and-ui/the-fms-interface.md";
  slug: "fms-07-navigation-and-ui/the-fms-interface";
  body: string;
  collection: "chapters";
  data: any
} & { render(): Render[".md"] };
"mdm-01-understanding-basics/core-mdm-concepts.md": {
	id: "mdm-01-understanding-basics/core-mdm-concepts.md";
  slug: "mdm-01-understanding-basics/core-mdm-concepts";
  body: string;
  collection: "chapters";
  data: any
} & { render(): Render[".md"] };
"mdm-01-understanding-basics/what-is-mdm.md": {
	id: "mdm-01-understanding-basics/what-is-mdm.md";
  slug: "mdm-01-understanding-basics/what-is-mdm";
  body: string;
  collection: "chapters";
  data: any
} & { render(): Render[".md"] };
"mdm-01-understanding-basics/why-mdm-matters.md": {
	id: "mdm-01-understanding-basics/why-mdm-matters.md";
  slug: "mdm-01-understanding-basics/why-mdm-matters";
  body: string;
  collection: "chapters";
  data: any
} & { render(): Render[".md"] };
"mdm-02-the-data-model/data-hierarchies-and-relationships.md": {
	id: "mdm-02-the-data-model/data-hierarchies-and-relationships.md";
  slug: "mdm-02-the-data-model/data-hierarchies-and-relationships";
  body: string;
  collection: "chapters";
  data: any
} & { render(): Render[".md"] };
"mdm-02-the-data-model/how-mdm-structures-data.md": {
	id: "mdm-02-the-data-model/how-mdm-structures-data.md";
  slug: "mdm-02-the-data-model/how-mdm-structures-data";
  body: string;
  collection: "chapters";
  data: any
} & { render(): Render[".md"] };
"mdm-02-the-data-model/key-master-data-entities.md": {
	id: "mdm-02-the-data-model/key-master-data-entities.md";
  slug: "mdm-02-the-data-model/key-master-data-entities";
  body: string;
  collection: "chapters";
  data: any
} & { render(): Render[".md"] };
"mdm-03-data-flow-into-mdm/data-validation-in-mdm.md": {
	id: "mdm-03-data-flow-into-mdm/data-validation-in-mdm.md";
  slug: "mdm-03-data-flow-into-mdm/data-validation-in-mdm";
  body: string;
  collection: "chapters";
  data: any
} & { render(): Render[".md"] };
"mdm-03-data-flow-into-mdm/how-data-enters-mdm.md": {
	id: "mdm-03-data-flow-into-mdm/how-data-enters-mdm.md";
  slug: "mdm-03-data-flow-into-mdm/how-data-enters-mdm";
  body: string;
  collection: "chapters";
  data: any
} & { render(): Render[".md"] };
"mdm-03-data-flow-into-mdm/where-master-data-originates.md": {
	id: "mdm-03-data-flow-into-mdm/where-master-data-originates.md";
  slug: "mdm-03-data-flow-into-mdm/where-master-data-originates";
  body: string;
  collection: "chapters";
  data: any
} & { render(): Render[".md"] };
"mdm-04-data-flow-out-of-mdm/keeping-master-data-in-sync.md": {
	id: "mdm-04-data-flow-out-of-mdm/keeping-master-data-in-sync.md";
  slug: "mdm-04-data-flow-out-of-mdm/keeping-master-data-in-sync";
  body: string;
  collection: "chapters";
  data: any
} & { render(): Render[".md"] };
"mdm-04-data-flow-out-of-mdm/mdm-output-to-other-systems.md": {
	id: "mdm-04-data-flow-out-of-mdm/mdm-output-to-other-systems.md";
  slug: "mdm-04-data-flow-out-of-mdm/mdm-output-to-other-systems";
  body: string;
  collection: "chapters";
  data: any
} & { render(): Render[".md"] };
"mdm-04-data-flow-out-of-mdm/what-mdm-sends-to-planning.md": {
	id: "mdm-04-data-flow-out-of-mdm/what-mdm-sends-to-planning.md";
  slug: "mdm-04-data-flow-out-of-mdm/what-mdm-sends-to-planning";
  body: string;
  collection: "chapters";
  data: any
} & { render(): Render[".md"] };
"mdm-05-the-logic/approval-workflows.md": {
	id: "mdm-05-the-logic/approval-workflows.md";
  slug: "mdm-05-the-logic/approval-workflows";
  body: string;
  collection: "chapters";
  data: any
} & { render(): Render[".md"] };
"mdm-05-the-logic/data-matching-and-deduplication.md": {
	id: "mdm-05-the-logic/data-matching-and-deduplication.md";
  slug: "mdm-05-the-logic/data-matching-and-deduplication";
  body: string;
  collection: "chapters";
  data: any
} & { render(): Render[".md"] };
"mdm-05-the-logic/mdm-governance-rules.md": {
	id: "mdm-05-the-logic/mdm-governance-rules.md";
  slug: "mdm-05-the-logic/mdm-governance-rules";
  body: string;
  collection: "chapters";
  data: any
} & { render(): Render[".md"] };
"mdm-06-key-mdm-workflows/auditing-and-reporting.md": {
	id: "mdm-06-key-mdm-workflows/auditing-and-reporting.md";
  slug: "mdm-06-key-mdm-workflows/auditing-and-reporting";
  body: string;
  collection: "chapters";
  data: any
} & { render(): Render[".md"] };
"mdm-06-key-mdm-workflows/creating-and-maintaining-records.md": {
	id: "mdm-06-key-mdm-workflows/creating-and-maintaining-records.md";
  slug: "mdm-06-key-mdm-workflows/creating-and-maintaining-records";
  body: string;
  collection: "chapters";
  data: any
} & { render(): Render[".md"] };
"mdm-06-key-mdm-workflows/managing-data-changes.md": {
	id: "mdm-06-key-mdm-workflows/managing-data-changes.md";
  slug: "mdm-06-key-mdm-workflows/managing-data-changes";
  body: string;
  collection: "chapters";
  data: any
} & { render(): Render[".md"] };
"mdm-07-navigation-and-ui/navigating-mdm.md": {
	id: "mdm-07-navigation-and-ui/navigating-mdm.md";
  slug: "mdm-07-navigation-and-ui/navigating-mdm";
  body: string;
  collection: "chapters";
  data: any
} & { render(): Render[".md"] };
"mdm-07-navigation-and-ui/reading-mdm-output.md": {
	id: "mdm-07-navigation-and-ui/reading-mdm-output.md";
  slug: "mdm-07-navigation-and-ui/reading-mdm-output";
  body: string;
  collection: "chapters";
  data: any
} & { render(): Render[".md"] };
"mdm-07-navigation-and-ui/the-mdm-interface.md": {
	id: "mdm-07-navigation-and-ui/the-mdm-interface.md";
  slug: "mdm-07-navigation-and-ui/the-mdm-interface";
  body: string;
  collection: "chapters";
  data: any
} & { render(): Render[".md"] };
"people-01-planning-team/broader-org-structure.md": {
	id: "people-01-planning-team/broader-org-structure.md";
  slug: "people-01-planning-team/broader-org-structure";
  body: string;
  collection: "chapters";
  data: any
} & { render(): Render[".md"] };
"people-01-planning-team/building-an-effective-planning-team.md": {
	id: "people-01-planning-team/building-an-effective-planning-team.md";
  slug: "people-01-planning-team/building-an-effective-planning-team";
  body: string;
  collection: "chapters";
  data: any
} & { render(): Render[".md"] };
"people-01-planning-team/the-planning-org-chart.md": {
	id: "people-01-planning-team/the-planning-org-chart.md";
  slug: "people-01-planning-team/the-planning-org-chart";
  body: string;
  collection: "chapters";
  data: any
} & { render(): Render[".md"] };
"people-01-planning-team/who-is-in-the-planning-team.md": {
	id: "people-01-planning-team/who-is-in-the-planning-team.md";
  slug: "people-01-planning-team/who-is-in-the-planning-team";
  body: string;
  collection: "chapters";
  data: any
} & { render(): Render[".md"] };
"people-02-accountability/demand-review-rasci.md": {
	id: "people-02-accountability/demand-review-rasci.md";
  slug: "people-02-accountability/demand-review-rasci";
  body: string;
  collection: "chapters";
  data: any
} & { render(): Render[".md"] };
"people-02-accountability/executive-sop-rasci.md": {
	id: "people-02-accountability/executive-sop-rasci.md";
  slug: "people-02-accountability/executive-sop-rasci";
  body: string;
  collection: "chapters";
  data: any
} & { render(): Render[".md"] };
"people-02-accountability/making-rasci-work.md": {
	id: "people-02-accountability/making-rasci-work.md";
  slug: "people-02-accountability/making-rasci-work";
  body: string;
  collection: "chapters";
  data: any
} & { render(): Render[".md"] };
"people-02-accountability/supply-review-rasci.md": {
	id: "people-02-accountability/supply-review-rasci.md";
  slug: "people-02-accountability/supply-review-rasci";
  body: string;
  collection: "chapters";
  data: any
} & { render(): Render[".md"] };
"people-02-accountability/what-is-rasci.md": {
	id: "people-02-accountability/what-is-rasci.md";
  slug: "people-02-accountability/what-is-rasci";
  body: string;
  collection: "chapters";
  data: any
} & { render(): Render[".md"] };
"people-03-planning-cadences/01-week-in-the-life.md": {
	id: "people-03-planning-cadences/01-week-in-the-life.md";
  slug: "people-03-planning-cadences/01-week-in-the-life";
  body: string;
  collection: "chapters";
  data: any
} & { render(): Render[".md"] };
"people-03-planning-cadences/02-month-in-the-life.md": {
	id: "people-03-planning-cadences/02-month-in-the-life.md";
  slug: "people-03-planning-cadences/02-month-in-the-life";
  body: string;
  collection: "chapters";
  data: any
} & { render(): Render[".md"] };
"people-03-planning-cadences/03-quarter-in-the-life.md": {
	id: "people-03-planning-cadences/03-quarter-in-the-life.md";
  slug: "people-03-planning-cadences/03-quarter-in-the-life";
  body: string;
  collection: "chapters";
  data: any
} & { render(): Render[".md"] };
"process-01-scenario-planning-fundamentals/demand-uncertainty.md": {
	id: "process-01-scenario-planning-fundamentals/demand-uncertainty.md";
  slug: "process-01-scenario-planning-fundamentals/demand-uncertainty";
  body: string;
  collection: "chapters";
  data: any
} & { render(): Render[".md"] };
"process-01-scenario-planning-fundamentals/setting-up-effective-scenarios.md": {
	id: "process-01-scenario-planning-fundamentals/setting-up-effective-scenarios.md";
  slug: "process-01-scenario-planning-fundamentals/setting-up-effective-scenarios";
  body: string;
  collection: "chapters";
  data: any
} & { render(): Render[".md"] };
"process-01-scenario-planning-fundamentals/supply-risks.md": {
	id: "process-01-scenario-planning-fundamentals/supply-risks.md";
  slug: "process-01-scenario-planning-fundamentals/supply-risks";
  body: string;
  collection: "chapters";
  data: any
} & { render(): Render[".md"] };
"process-01-scenario-planning-fundamentals/the-scenario-planning-process.md": {
	id: "process-01-scenario-planning-fundamentals/the-scenario-planning-process.md";
  slug: "process-01-scenario-planning-fundamentals/the-scenario-planning-process";
  body: string;
  collection: "chapters";
  data: any
} & { render(): Render[".md"] };
"process-01-scenario-planning-fundamentals/types-of-scenarios.md": {
	id: "process-01-scenario-planning-fundamentals/types-of-scenarios.md";
  slug: "process-01-scenario-planning-fundamentals/types-of-scenarios";
  body: string;
  collection: "chapters";
  data: any
} & { render(): Render[".md"] };
"process-01-scenario-planning-fundamentals/what-is-scenario-planning.md": {
	id: "process-01-scenario-planning-fundamentals/what-is-scenario-planning.md";
  slug: "process-01-scenario-planning-fundamentals/what-is-scenario-planning";
  body: string;
  collection: "chapters";
  data: any
} & { render(): Render[".md"] };
"process-01-scenario-planning-fundamentals/when-to-use-scenario-planning.md": {
	id: "process-01-scenario-planning-fundamentals/when-to-use-scenario-planning.md";
  slug: "process-01-scenario-planning-fundamentals/when-to-use-scenario-planning";
  body: string;
  collection: "chapters";
  data: any
} & { render(): Render[".md"] };
"process-02-running-scenarios/adjusting-parameters-and-assumptions.md": {
	id: "process-02-running-scenarios/adjusting-parameters-and-assumptions.md";
  slug: "process-02-running-scenarios/adjusting-parameters-and-assumptions";
  body: string;
  collection: "chapters";
  data: any
} & { render(): Render[".md"] };
"process-02-running-scenarios/communicating-scenario-findings.md": {
	id: "process-02-running-scenarios/communicating-scenario-findings.md";
  slug: "process-02-running-scenarios/communicating-scenario-findings";
  body: string;
  collection: "chapters";
  data: any
} & { render(): Render[".md"] };
"process-02-running-scenarios/creating-a-scenario.md": {
	id: "process-02-running-scenarios/creating-a-scenario.md";
  slug: "process-02-running-scenarios/creating-a-scenario";
  body: string;
  collection: "chapters";
  data: any
} & { render(): Render[".md"] };
"process-02-running-scenarios/promoting-a-scenario-to-baseline.md": {
	id: "process-02-running-scenarios/promoting-a-scenario-to-baseline.md";
  slug: "process-02-running-scenarios/promoting-a-scenario-to-baseline";
  body: string;
  collection: "chapters";
  data: any
} & { render(): Render[".md"] };
"process-02-running-scenarios/running-and-comparing-scenarios.md": {
	id: "process-02-running-scenarios/running-and-comparing-scenarios.md";
  slug: "process-02-running-scenarios/running-and-comparing-scenarios";
  body: string;
  collection: "chapters";
  data: any
} & { render(): Render[".md"] };
"process-03-operating-model/execution.md": {
	id: "process-03-operating-model/execution.md";
  slug: "process-03-operating-model/execution";
  body: string;
  collection: "chapters";
  data: any
} & { render(): Render[".md"] };
"process-03-operating-model/the-cadence.md": {
	id: "process-03-operating-model/the-cadence.md";
  slug: "process-03-operating-model/the-cadence";
  body: string;
  collection: "chapters";
  data: any
} & { render(): Render[".md"] };
"process-03-operating-model/what-is-soe.md": {
	id: "process-03-operating-model/what-is-soe.md";
  slug: "process-03-operating-model/what-is-soe";
  body: string;
  collection: "chapters";
  data: any
} & { render(): Render[".md"] };
"process-03-operating-model/what-is-sop.md": {
	id: "process-03-operating-model/what-is-sop.md";
  slug: "process-03-operating-model/what-is-sop";
  body: string;
  collection: "chapters";
  data: any
} & { render(): Render[".md"] };
"process-04-planning-policy/allocation.md": {
	id: "process-04-planning-policy/allocation.md";
  slug: "process-04-planning-policy/allocation";
  body: string;
  collection: "chapters";
  data: any
} & { render(): Render[".md"] };
"process-04-planning-policy/prioritization.md": {
	id: "process-04-planning-policy/prioritization.md";
  slug: "process-04-planning-policy/prioritization";
  body: string;
  collection: "chapters";
  data: any
} & { render(): Render[".md"] };
"process-04-planning-policy/safety-stock.md": {
	id: "process-04-planning-policy/safety-stock.md";
  slug: "process-04-planning-policy/safety-stock";
  body: string;
  collection: "chapters";
  data: any
} & { render(): Render[".md"] };
"process-04-planning-policy/service-level-targets.md": {
	id: "process-04-planning-policy/service-level-targets.md";
  slug: "process-04-planning-policy/service-level-targets";
  body: string;
  collection: "chapters";
  data: any
} & { render(): Render[".md"] };
"process-05-governance-and-escalation/decision-framework.md": {
	id: "process-05-governance-and-escalation/decision-framework.md";
  slug: "process-05-governance-and-escalation/decision-framework";
  body: string;
  collection: "chapters";
  data: any
} & { render(): Render[".md"] };
"process-05-governance-and-escalation/escalation-paths.md": {
	id: "process-05-governance-and-escalation/escalation-paths.md";
  slug: "process-05-governance-and-escalation/escalation-paths";
  body: string;
  collection: "chapters";
  data: any
} & { render(): Render[".md"] };
"process-05-governance-and-escalation/management-by-exception.md": {
	id: "process-05-governance-and-escalation/management-by-exception.md";
  slug: "process-05-governance-and-escalation/management-by-exception";
  body: string;
  collection: "chapters";
  data: any
} & { render(): Render[".md"] };
"process-06-kpis/key-planning-kpis.md": {
	id: "process-06-kpis/key-planning-kpis.md";
  slug: "process-06-kpis/key-planning-kpis";
  body: string;
  collection: "chapters";
  data: any
} & { render(): Render[".md"] };
"process-06-kpis/kpi-framework-overview.md": {
	id: "process-06-kpis/kpi-framework-overview.md";
  slug: "process-06-kpis/kpi-framework-overview";
  body: string;
  collection: "chapters";
  data: any
} & { render(): Render[".md"] };
"process-06-kpis/kpi-ownership-and-review.md": {
	id: "process-06-kpis/kpi-ownership-and-review.md";
  slug: "process-06-kpis/kpi-ownership-and-review";
  body: string;
  collection: "chapters";
  data: any
} & { render(): Render[".md"] };
"process-06-kpis/kpis-and-exception-management.md": {
	id: "process-06-kpis/kpis-and-exception-management.md";
  slug: "process-06-kpis/kpis-and-exception-management";
  body: string;
  collection: "chapters";
  data: any
} & { render(): Render[".md"] };
"soe-01-soe-fundamentals/escalating-to-sop.md": {
	id: "soe-01-soe-fundamentals/escalating-to-sop.md";
  slug: "soe-01-soe-fundamentals/escalating-to-sop";
  body: string;
  collection: "chapters";
  data: any
} & { render(): Render[".md"] };
"soe-01-soe-fundamentals/exception-management.md": {
	id: "soe-01-soe-fundamentals/exception-management.md";
  slug: "soe-01-soe-fundamentals/exception-management";
  body: string;
  collection: "chapters";
  data: any
} & { render(): Render[".md"] };
"soe-01-soe-fundamentals/soe-roles.md": {
	id: "soe-01-soe-fundamentals/soe-roles.md";
  slug: "soe-01-soe-fundamentals/soe-roles";
  body: string;
  collection: "chapters";
  data: any
} & { render(): Render[".md"] };
"soe-01-soe-fundamentals/weekly-cadence.md": {
	id: "soe-01-soe-fundamentals/weekly-cadence.md";
  slug: "soe-01-soe-fundamentals/weekly-cadence";
  body: string;
  collection: "chapters";
  data: any
} & { render(): Render[".md"] };
"soe-01-soe-fundamentals/what-is-soe.md": {
	id: "soe-01-soe-fundamentals/what-is-soe.md";
  slug: "soe-01-soe-fundamentals/what-is-soe";
  body: string;
  collection: "chapters";
  data: any
} & { render(): Render[".md"] };
"soe-02-running-soe/adjustments-and-resets.md": {
	id: "soe-02-running-soe/adjustments-and-resets.md";
  slug: "soe-02-running-soe/adjustments-and-resets";
  body: string;
  collection: "chapters";
  data: any
} & { render(): Render[".md"] };
"soe-02-running-soe/handoff-to-execution.md": {
	id: "soe-02-running-soe/handoff-to-execution.md";
  slug: "soe-02-running-soe/handoff-to-execution";
  body: string;
  collection: "chapters";
  data: any
} & { render(): Render[".md"] };
"soe-02-running-soe/integrated-soe-review.md": {
	id: "soe-02-running-soe/integrated-soe-review.md";
  slug: "soe-02-running-soe/integrated-soe-review";
  body: string;
  collection: "chapters";
  data: any
} & { render(): Render[".md"] };
"soe-02-running-soe/monitoring-the-plan.md": {
	id: "soe-02-running-soe/monitoring-the-plan.md";
  slug: "soe-02-running-soe/monitoring-the-plan";
  body: string;
  collection: "chapters";
  data: any
} & { render(): Render[".md"] };
"sop-01-sop-fundamentals/sop-in-planning-software.md": {
	id: "sop-01-sop-fundamentals/sop-in-planning-software.md";
  slug: "sop-01-sop-fundamentals/sop-in-planning-software";
  body: string;
  collection: "chapters";
  data: any
} & { render(): Render[".md"] };
"sop-01-sop-fundamentals/sop-outputs.md": {
	id: "sop-01-sop-fundamentals/sop-outputs.md";
  slug: "sop-01-sop-fundamentals/sop-outputs";
  body: string;
  collection: "chapters";
  data: any
} & { render(): Render[".md"] };
"sop-01-sop-fundamentals/sop-roles.md": {
	id: "sop-01-sop-fundamentals/sop-roles.md";
  slug: "sop-01-sop-fundamentals/sop-roles";
  body: string;
  collection: "chapters";
  data: any
} & { render(): Render[".md"] };
"sop-01-sop-fundamentals/the-sop-cycle.md": {
	id: "sop-01-sop-fundamentals/the-sop-cycle.md";
  slug: "sop-01-sop-fundamentals/the-sop-cycle";
  body: string;
  collection: "chapters";
  data: any
} & { render(): Render[".md"] };
"sop-01-sop-fundamentals/what-is-sop.md": {
	id: "sop-01-sop-fundamentals/what-is-sop.md";
  slug: "sop-01-sop-fundamentals/what-is-sop";
  body: string;
  collection: "chapters";
  data: any
} & { render(): Render[".md"] };
"sop-02-running-sop/demand-review.md": {
	id: "sop-02-running-sop/demand-review.md";
  slug: "sop-02-running-sop/demand-review";
  body: string;
  collection: "chapters";
  data: any
} & { render(): Render[".md"] };
"sop-02-running-sop/executive-sop.md": {
	id: "sop-02-running-sop/executive-sop.md";
  slug: "sop-02-running-sop/executive-sop";
  body: string;
  collection: "chapters";
  data: any
} & { render(): Render[".md"] };
"sop-02-running-sop/pre-sop.md": {
	id: "sop-02-running-sop/pre-sop.md";
  slug: "sop-02-running-sop/pre-sop";
  body: string;
  collection: "chapters";
  data: any
} & { render(): Render[".md"] };
"sop-02-running-sop/sop-failure-modes.md": {
	id: "sop-02-running-sop/sop-failure-modes.md";
  slug: "sop-02-running-sop/sop-failure-modes";
  body: string;
  collection: "chapters";
  data: any
} & { render(): Render[".md"] };
"sop-02-running-sop/supply-review.md": {
	id: "sop-02-running-sop/supply-review.md";
  slug: "sop-02-running-sop/supply-review";
  body: string;
  collection: "chapters";
  data: any
} & { render(): Render[".md"] };
"sop-demand-forecasting/commercial-overlay.md": {
	id: "sop-demand-forecasting/commercial-overlay.md";
  slug: "sop-demand-forecasting/commercial-overlay";
  body: string;
  collection: "chapters";
  data: any
} & { render(): Render[".md"] };
"sop-demand-forecasting/consensus-review.md": {
	id: "sop-demand-forecasting/consensus-review.md";
  slug: "sop-demand-forecasting/consensus-review";
  body: string;
  collection: "chapters";
  data: any
} & { render(): Render[".md"] };
"sop-demand-forecasting/data-collection.md": {
	id: "sop-demand-forecasting/data-collection.md";
  slug: "sop-demand-forecasting/data-collection";
  body: string;
  collection: "chapters";
  data: any
} & { render(): Render[".md"] };
"sop-demand-forecasting/forecast-lock.md": {
	id: "sop-demand-forecasting/forecast-lock.md";
  slug: "sop-demand-forecasting/forecast-lock";
  body: string;
  collection: "chapters";
  data: any
} & { render(): Render[".md"] };
"sop-demand-forecasting/statistical-baseline.md": {
	id: "sop-demand-forecasting/statistical-baseline.md";
  slug: "sop-demand-forecasting/statistical-baseline";
  body: string;
  collection: "chapters";
  data: any
} & { render(): Render[".md"] };
"sop-inventory-planning/coverage-analysis.md": {
	id: "sop-inventory-planning/coverage-analysis.md";
  slug: "sop-inventory-planning/coverage-analysis";
  body: string;
  collection: "chapters";
  data: any
} & { render(): Render[".md"] };
"sop-inventory-planning/exception-resolution.md": {
	id: "sop-inventory-planning/exception-resolution.md";
  slug: "sop-inventory-planning/exception-resolution";
  body: string;
  collection: "chapters";
  data: any
} & { render(): Render[".md"] };
"sop-inventory-planning/inventory-target-setting.md": {
	id: "sop-inventory-planning/inventory-target-setting.md";
  slug: "sop-inventory-planning/inventory-target-setting";
  body: string;
  collection: "chapters";
  data: any
} & { render(): Render[".md"] };
"sop-inventory-planning/safety-stock-review.md": {
	id: "sop-inventory-planning/safety-stock-review.md";
  slug: "sop-inventory-planning/safety-stock-review";
  body: string;
  collection: "chapters";
  data: any
} & { render(): Render[".md"] };
"sop-resource-planning/01-resource-demand-projection.md": {
	id: "sop-resource-planning/01-resource-demand-projection.md";
  slug: "sop-resource-planning/01-resource-demand-projection";
  body: string;
  collection: "chapters";
  data: any
} & { render(): Render[".md"] };
"sop-resource-planning/02-capacity-mapping.md": {
	id: "sop-resource-planning/02-capacity-mapping.md";
  slug: "sop-resource-planning/02-capacity-mapping";
  body: string;
  collection: "chapters";
  data: any
} & { render(): Render[".md"] };
"sop-resource-planning/03-constraint-identification.md": {
	id: "sop-resource-planning/03-constraint-identification.md";
  slug: "sop-resource-planning/03-constraint-identification";
  body: string;
  collection: "chapters";
  data: any
} & { render(): Render[".md"] };
"sop-resource-planning/04-resource-allocation.md": {
	id: "sop-resource-planning/04-resource-allocation.md";
  slug: "sop-resource-planning/04-resource-allocation";
  body: string;
  collection: "chapters";
  data: any
} & { render(): Render[".md"] };
"sop-sop-review/01-pre-sop-alignment.md": {
	id: "sop-sop-review/01-pre-sop-alignment.md";
  slug: "sop-sop-review/01-pre-sop-alignment";
  body: string;
  collection: "chapters";
  data: any
} & { render(): Render[".md"] };
"sop-sop-review/02-financial-reconciliation.md": {
	id: "sop-sop-review/02-financial-reconciliation.md";
  slug: "sop-sop-review/02-financial-reconciliation";
  body: string;
  collection: "chapters";
  data: any
} & { render(): Render[".md"] };
"sop-sop-review/03-executive-sop-review.md": {
	id: "sop-sop-review/03-executive-sop-review.md";
  slug: "sop-sop-review/03-executive-sop-review";
  body: string;
  collection: "chapters";
  data: any
} & { render(): Render[".md"] };
"sop-sop-review/04-plan-distribution.md": {
	id: "sop-sop-review/04-plan-distribution.md";
  slug: "sop-sop-review/04-plan-distribution";
  body: string;
  collection: "chapters";
  data: any
} & { render(): Render[".md"] };
"sop-supply-planning/01-capacity-assessment.md": {
	id: "sop-supply-planning/01-capacity-assessment.md";
  slug: "sop-supply-planning/01-capacity-assessment";
  body: string;
  collection: "chapters";
  data: any
} & { render(): Render[".md"] };
"sop-supply-planning/02-constrained-supply-run.md": {
	id: "sop-supply-planning/02-constrained-supply-run.md";
  slug: "sop-supply-planning/02-constrained-supply-run";
  body: string;
  collection: "chapters";
  data: any
} & { render(): Render[".md"] };
"sop-supply-planning/03-gap-identification.md": {
	id: "sop-supply-planning/03-gap-identification.md";
  slug: "sop-supply-planning/03-gap-identification";
  body: string;
  collection: "chapters";
  data: any
} & { render(): Render[".md"] };
"sop-supply-planning/04-option-development.md": {
	id: "sop-supply-planning/04-option-development.md";
  slug: "sop-supply-planning/04-option-development";
  body: string;
  collection: "chapters";
  data: any
} & { render(): Render[".md"] };
"sop-supply-planning/05-supply-plan-submission.md": {
	id: "sop-supply-planning/05-supply-plan-submission.md";
  slug: "sop-supply-planning/05-supply-plan-submission";
  body: string;
  collection: "chapters";
  data: any
} & { render(): Render[".md"] };
};
"configuration": {
"01-example-screen.md": {
	id: "01-example-screen.md";
  slug: "01-example-screen";
  body: string;
  collection: "configuration";
  data: any
} & { render(): Render[".md"] };
"01-example.md": {
	id: "01-example.md";
  slug: "01-example";
  body: string;
  collection: "configuration";
  data: any
} & { render(): Render[".md"] };
};

	};

	type DataEntryMap = {
		"roles": {
"business-controller": {
	id: "business-controller";
  collection: "roles";
  data: any
};
"category-manager": {
	id: "category-manager";
  collection: "roles";
  data: any
};
"commercial-lead": {
	id: "commercial-lead";
  collection: "roles";
  data: any
};
"country-manager": {
	id: "country-manager";
  collection: "roles";
  data: any
};
"demand-planner": {
	id: "demand-planner";
  collection: "roles";
  data: any
};
"finance-bp": {
	id: "finance-bp";
  collection: "roles";
  data: any
};
"local-planning-lead": {
	id: "local-planning-lead";
  collection: "roles";
  data: any
};
"logistics-coordinator": {
	id: "logistics-coordinator";
  collection: "roles";
  data: any
};
"operational-planner": {
	id: "operational-planner";
  collection: "roles";
  data: any
};
"operations-manager": {
	id: "operations-manager";
  collection: "roles";
  data: any
};
"planning-analyst": {
	id: "planning-analyst";
  collection: "roles";
  data: any
};
"product-manager": {
	id: "product-manager";
  collection: "roles";
  data: any
};
"production-planner": {
	id: "production-planner";
  collection: "roles";
  data: any
};
"sales-planner": {
	id: "sales-planner";
  collection: "roles";
  data: any
};
"sop-lead": {
	id: "sop-lead";
  collection: "roles";
  data: any
};
"strategic-planner": {
	id: "strategic-planner";
  collection: "roles";
  data: any
};
"tactical-planner": {
	id: "tactical-planner";
  collection: "roles";
  data: any
};
};

	};

	type AnyEntryMap = ContentEntryMap & DataEntryMap;

	export type ContentConfig = never;
}
