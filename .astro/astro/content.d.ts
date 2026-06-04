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
"01-understanding-basics/01-items.md": {
	id: "01-understanding-basics/01-items.md";
  slug: "01-understanding-basics/01-items";
  body: string;
  collection: "chapters";
  data: any
} & { render(): Render[".md"] };
"01-understanding-basics/02-transformation-processes.md": {
	id: "01-understanding-basics/02-transformation-processes.md";
  slug: "01-understanding-basics/02-transformation-processes";
  body: string;
  collection: "chapters";
  data: any
} & { render(): Render[".md"] };
"01-understanding-basics/03-transportation-processes.md": {
	id: "01-understanding-basics/03-transportation-processes.md";
  slug: "01-understanding-basics/03-transportation-processes";
  body: string;
  collection: "chapters";
  data: any
} & { render(): Render[".md"] };
"01-understanding-basics/04-resources.md": {
	id: "01-understanding-basics/04-resources.md";
  slug: "01-understanding-basics/04-resources";
  body: string;
  collection: "chapters";
  data: any
} & { render(): Render[".md"] };
"01-understanding-basics/05-resource-consumptions.md": {
	id: "01-understanding-basics/05-resource-consumptions.md";
  slug: "01-understanding-basics/05-resource-consumptions";
  body: string;
  collection: "chapters";
  data: any
} & { render(): Render[".md"] };
"01-understanding-basics/06-calendars-and-time.md": {
	id: "01-understanding-basics/06-calendars-and-time.md";
  slug: "01-understanding-basics/06-calendars-and-time";
  body: string;
  collection: "chapters";
  data: any
} & { render(): Render[".md"] };
"02-the-network/01-graph-data-model.md": {
	id: "02-the-network/01-graph-data-model.md";
  slug: "02-the-network/01-graph-data-model";
  body: string;
  collection: "chapters";
  data: any
} & { render(): Render[".md"] };
"02-the-network/02-nodes-and-relationships.md": {
	id: "02-the-network/02-nodes-and-relationships.md";
  slug: "02-the-network/02-nodes-and-relationships";
  body: string;
  collection: "chapters";
  data: any
} & { render(): Render[".md"] };
"02-the-network/03-data-flow.md": {
	id: "02-the-network/03-data-flow.md";
  slug: "02-the-network/03-data-flow";
  body: string;
  collection: "chapters";
  data: any
} & { render(): Render[".md"] };
"02-the-network/04-real-time-ingestion.md": {
	id: "02-the-network/04-real-time-ingestion.md";
  slug: "02-the-network/04-real-time-ingestion";
  body: string;
  collection: "chapters";
  data: any
} & { render(): Render[".md"] };
"02-the-network/05-digital-twin.md": {
	id: "02-the-network/05-digital-twin.md";
  slug: "02-the-network/05-digital-twin";
  body: string;
  collection: "chapters";
  data: any
} & { render(): Render[".md"] };
"03-the-logic/01-planning-engine.md": {
	id: "03-the-logic/01-planning-engine.md";
  slug: "03-the-logic/01-planning-engine";
  body: string;
  collection: "chapters";
  data: any
} & { render(): Render[".md"] };
"03-the-logic/02-constraint-optimization.md": {
	id: "03-the-logic/02-constraint-optimization.md";
  slug: "03-the-logic/02-constraint-optimization";
  body: string;
  collection: "chapters";
  data: any
} & { render(): Render[".md"] };
"03-the-logic/03-ml-and-ai.md": {
	id: "03-the-logic/03-ml-and-ai.md";
  slug: "03-the-logic/03-ml-and-ai";
  body: string;
  collection: "chapters";
  data: any
} & { render(): Render[".md"] };
"03-the-logic/04-plan-vs-actuals.md": {
	id: "03-the-logic/04-plan-vs-actuals.md";
  slug: "03-the-logic/04-plan-vs-actuals";
  body: string;
  collection: "chapters";
  data: any
} & { render(): Render[".md"] };
"03-the-logic/05-hierarchies-rollups.md": {
	id: "03-the-logic/05-hierarchies-rollups.md";
  slug: "03-the-logic/05-hierarchies-rollups";
  body: string;
  collection: "chapters";
  data: any
} & { render(): Render[".md"] };
"04-the-simulation/01-scenario-planning.md": {
	id: "04-the-simulation/01-scenario-planning.md";
  slug: "04-the-simulation/01-scenario-planning";
  body: string;
  collection: "chapters";
  data: any
} & { render(): Render[".md"] };
"04-the-simulation/02-what-if-interactive.md": {
	id: "04-the-simulation/02-what-if-interactive.md";
  slug: "04-the-simulation/02-what-if-interactive";
  body: string;
  collection: "chapters";
  data: any
} & { render(): Render[".md"] };
"04-the-simulation/03-demand-shock-sim.md": {
	id: "04-the-simulation/03-demand-shock-sim.md";
  slug: "04-the-simulation/03-demand-shock-sim";
  body: string;
  collection: "chapters";
  data: any
} & { render(): Render[".md"] };
"04-the-simulation/04-step-by-step-walkthrough.md": {
	id: "04-the-simulation/04-step-by-step-walkthrough.md";
  slug: "04-the-simulation/04-step-by-step-walkthrough";
  body: string;
  collection: "chapters";
  data: any
} & { render(): Render[".md"] };
"04-the-simulation/05-reading-output.md": {
	id: "04-the-simulation/05-reading-output.md";
  slug: "04-the-simulation/05-reading-output";
  body: string;
  collection: "chapters";
  data: any
} & { render(): Render[".md"] };
};

	};

	type DataEntryMap = {
		
	};

	type AnyEntryMap = ContentEntryMap & DataEntryMap;

	export type ContentConfig = never;
}
