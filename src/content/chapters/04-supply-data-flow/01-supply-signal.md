---
title: "What Is a Supply Signal?"
description: "Once demand has been netted and time-phased, the planning engine generates supply responses — planned orders that move downstream through the network."
order: 1
chapter: "04-supply-data-flow"
estimatedMinutes: 3
---

## Supply is the response to demand

In the previous chapter, you saw how a 100-unit forecast travels **upstream** from Item J to Items A and B. Now the planning engine runs in the other direction: it generates **planned orders** — decisions about what to produce, transport, or procure — and these decisions flow **downstream**, from raw material inputs toward the customer.

Supply flow is the physical answer to the demand signal. Where demand propagates as information, supply propagates as inventory: seeds being grown, cleaned, calibrated, primed, coated, packed, and shipped.

## What a planned order contains

A planned order is a structured record attached to a node in the network. It specifies:

| Field | Meaning |
|-------|---------|
| **Item + Location** | What is being made and where |
| **Quantity** | How many units to produce or move |
| **Start date** | When the process must begin |
| **Completion date** | When the output will be available |
| **Source** | Which upstream node provides the input |

In o9 these records are called **line items** or **supply line items**. They are the supply-side counterpart to the demand line items you saw in Chapter 3.

## Two supply sources

Every node in the network can receive supply from one of two places:

1. **Existing inventory** — on-hand stock already at the location, available immediately (up to the amount not reserved for safety stock).
2. **Planned order** — a new production run, transportation, or purchase that must be triggered and will arrive after the process lead time.

The planning engine prefers inventory: it only creates planned orders for the net requirement after available inventory has been applied. This is the inventory netting you read about at the end of Chapter 3, now seen from the supply side.

## Downstream propagation

Once a planned order is placed for Seed Production (Item C), its expected output becomes available supply for the next downstream process — Cleaning. Cleaning's planned order, in turn, feeds Calibrating, which feeds Priming, and so on. Each planned order unlocks supply for the next stage, creating a **downstream cascade** of commitments that eventually delivers Item J to the customer.
