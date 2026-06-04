---
title: "Items"
description: "The products, materials, and SKUs that flow through your supply chain network."
order: 1
chapter: "01-understanding-basics"
estimatedMinutes: 3
widget: ""
nodeType: "item"
summary: "An Item is the most fundamental building block in o9 — anything that can be planned, produced, stored, bought, or sold. It can be a raw material, a semi-finished good, a finished product, or a packaging component. Every supply and demand signal, every production order, and every purchase requisition in o9 is tied to an item. Think of items as the nouns of your supply chain: everything else acts on them or connects them."
---

## What is an Item?

An **Item** is the most fundamental building block in o9. It represents anything that can be planned, produced, stored, bought, or sold — a raw material, semi-finished good, finished product, or packaging component.

In o9, every item has a unique identifier and a set of attributes that drive planning behavior:

- **Item ID** — unique key across the network
- **Item type** — raw material, WIP, finished good
- **Unit of measure** — kg, units, liters, pallets
- **Shelf life** — how long it can be stored before expiry
- **Planning horizon** — how far ahead to plan this item

## Why Items Matter

The o9 planning engine generates supply and demand signals at the item level. Everything — from demand forecasts to production orders to purchase requisitions — is tied to an item.

> Think of items as the **nouns** of your supply chain. Everything else (processes, resources, networks) acts on them or connects them.

## Key Relationships

| Relationship | What it means |
|---|---|
| Item → BOM | An item can be *output of* a transformation process |
| Item → BOD | An item can be *transported* via a distribution process |
| Item → Location | An item is *stocked at* one or more nodes in the network |

## Placeholder Content

*This topic is ready for your detailed content. Replace this section with specific o9 item attributes, screenshots, or examples from your environment.*
