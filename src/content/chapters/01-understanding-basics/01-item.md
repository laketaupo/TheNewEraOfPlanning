---
title: "Item"
description: "The products, materials, and SKUs that flow through your supply chain network."
order: 1
chapter: "01-understanding-basics"
estimatedMinutes: 3
widget: ""
nodeType: "item"
topicLayout: "node-topic"
summary: "An Item is the most fundamental building block in Planning software — anything that can be planned, produced, stored, bought, or sold. It can be a raw material, a semi-finished good, a finished product, or a packaging component. Every supply and demand signal, every production order, and every purchase requisition in Planning software is tied to an item. Think of items as the nouns of your supply chain: everything else acts on them or connects them."
bullets:
  - "Has a unique Item ID across the entire network"
  - "Classified as raw material, WIP, or finished good"
  - "Carries unit of measure, shelf life, and planning horizon"
  - "Can be stocked at multiple network locations"
  - "Every supply and demand signal in Planning software is tied to an item"
---

## What is an Item?

An **Item** is the most fundamental building block in Planning software. It represents anything that can be planned, produced, stored, bought, or sold — a raw material, semi-finished good, finished product, or packaging component.

In Planning software, every item has a unique identifier and a set of attributes that drive planning behavior:

- **Item ID** — unique key across the network
- **Item type** — raw material, WIP, finished good
- **Unit of measure** — kg, units, liters, pallets
- **Shelf life** — how long it can be stored before expiry
- **Planning horizon** — how far ahead to plan this item

## Why Items Matter

The Planning software planning engine generates supply and demand signals at the item level. Everything — from demand forecasts to production orders to purchase requisitions — is tied to an item.

> Think of items as the **nouns** of your supply chain. Everything else (processes, resources, networks) acts on them or connects them.

## Key Relationships

| Relationship | What it means |
|---|---|
| Item → BOM | An item can be *output of* a transformation process |
| Item → BOD | An item can be *transported* via a distribution process |
| Item → Location | An item is *stocked at* one or more nodes in the network |

## Placeholder Content

*This topic is ready for your detailed content. Replace this section with specific Planning software item attributes, screenshots, or examples from your environment.*
