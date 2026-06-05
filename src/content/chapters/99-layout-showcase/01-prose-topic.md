---
title: "Standard Prose Layout"
description: "The default reading layout — markdown content rendered as structured prose with chapter-coloured headings and pull quotes."
order: 1
chapter: "99-layout-showcase"
estimatedMinutes: 3
widget: ""
---

## What this layout is for

The default `topic` layout is the workhorse of the site. Every topic that doesn't declare a `topicLayout:` in its frontmatter lands here. It's optimised for flowing explanations, definitions, and narrative content.

Use it when you have a few paragraphs to write and don't need any special structure.

## Formatting options

### Headings

`h2` gets a bottom border with a short accent underline — good for major sections. `h3` gets a left accent bar — good for sub-points within a section.

### Blockquotes

> This is a pull quote. Use it to call out a key insight, a definition, or a "remember this" statement. It gets a left border in the chapter accent colour.

### Lists

- Each bullet marker picks up the chapter accent colour.
- Lists are great for enumerable facts that don't need prose connective tissue.
- Three items feels right; more than six starts to look like a dump.

### Inline code

Refer to o9 objects like `Item`, `BOM`, or `BOD` inline without breaking the sentence flow.

### Tables

| Field | Type | Purpose |
|---|---|---|
| `order` | number | Sort position within the chapter |
| `topicLayout` | string | Which layout component to render |
| `estimatedMinutes` | number | Shown on the chapter index page |

## When to switch layouts

If you're presenting a list of concepts — use **card-grid**. If you need to compare two approaches side-by-side — use **comparison**. If you have tabular reference data — use **data-table**. If the interactive widget is the main event — use **full-widget**.
