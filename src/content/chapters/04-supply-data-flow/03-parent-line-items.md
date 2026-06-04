---
title: "Parent Line Items"
description: "Every item in the network has a parent — the upstream source that must supply it. Understanding this hierarchy is the key to reading supply plans."
order: 3
chapter: "04-supply-data-flow"
estimatedMinutes: 4
---

## What is a parent line item?

A **parent line item** is the supply source for a given item. In o9, the relationship is defined by the network graph:

- The **BOD edge** from Ship [A] to Item A at the Grower makes Item A (Central Warehouse) the parent of Item A (Grower).
- The **BOM edge** from Seed Production to Item C makes Seed Production the parent of Item C.

When the planning engine needs Item C at the Grower, it looks at Item C's parent — Seed Production — and creates a planned order there. When it needs Items A and B at the Grower, their parents are the Ship [A] and Ship [B] processes, which in turn pull from Items A and B at the Central Warehouse.

## The parent hierarchy for Item J

Tracing from customer delivery back to raw materials:

```
Item J (customer, out)
  └─ Ship [J]                    ← BOD transportation
       └─ Item J (Central Warehouse)
            └─ Packing             ← BOM transformation
                 └─ Item I
                      └─ Coating
                           └─ Item H
                                └─ Priming
                                     └─ Item F
                                          └─ Calibrating   (co-products: E, F, G)
                                               └─ Item D
                                                    └─ Cleaning
                                                         └─ Item C (Central Warehouse)
                                                              └─ Ship [C]
                                                                   └─ Item C (Grower)
                                                                        └─ Seed Production
                                                                             ├─ Item A (Grower)
                                                                             │    └─ Ship [A]
                                                                             │         └─ Item A (CW)
                                                                             └─ Item B (Grower)
                                                                                  └─ Ship [B]
                                                                                       └─ Item B (CW)
```

Each planned order at one level automatically schedules its parent node, creating a fully interlocked plan across the entire network.

## Co-products and the parent relationship

Calibrating is a special case: it has **three outputs** (Items E, F, G) but only Item F continues downstream through Priming. Items E and G are co-products — they are produced as a by-product of processing Item D, and their planned production is determined by the ratio set in the BOM for Calibrating.

From a supply perspective, Items E and G are "free" — their production is driven by Item F's demand, not by independent demand signals of their own (unless they also appear in downstream processes). The planning engine tracks their projected inventory separately; if they accumulate beyond a threshold, the planner may need to find alternate uses or reduce Calibrating run sizes.

## Firm vs. planned orders

Not every supply order is flexible. Some may already be **firmed** — confirmed with a supplier or already in production. Firmed orders appear in the plan as fixed quantities on specific dates; the engine works around them rather than rescheduling them. Planned orders, by contrast, are suggestions: the engine may shift, split, or cancel them as the demand picture evolves each planning cycle.
