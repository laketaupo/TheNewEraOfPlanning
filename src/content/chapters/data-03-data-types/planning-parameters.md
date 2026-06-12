---
title: "Planning Parameters"
description: "Planning parameters are the settings that control how the planning engine behaves for each item: lead times, safety stock, minimum order quantities, lot sizes. Getting them right is as important as having good data."
chapter: "data-03-data-types"
estimatedMinutes: 5
topicLayout: "prose-topic"
---

## What planning parameters are

Planning parameters are the configuration inputs that tell Planning software how to plan for each item at each location. They are distinct from master data (which describes what exists) and transactional data (which records what happened). Parameters describe the planning rules: how much lead time to allow, how much safety stock to hold, how orders should be sized.

Getting planning parameters right is one of the most impactful — and most neglected — aspects of supply chain planning. A wrong lead time parameter causes systematic late ordering. A wrong minimum order quantity causes systematic over-procurement. Unlike a wrong transaction (which causes a one-time error), a wrong parameter causes every planning run to produce wrong results until it is fixed.

## The key planning parameters

**Lead time** — the time between placing an order and receiving the goods, or between starting production and finishing it. Lead time is used to determine when a planned order needs to be placed to meet a future demand date. If the actual lead time is longer than the parameter, orders will be placed too late.

**Safety stock** — the minimum inventory buffer held to protect against uncertainty. In Planning software, safety stock can be set as a fixed quantity, a number of days of demand, or a statistical calculation based on variability. The parameter determines the floor below which Planning software will generate a replenishment order.

**Minimum order quantity (MOQ)** — the smallest quantity that can be ordered in a single purchase or production run. MOQ constraints cause the planning engine to round up planned orders, which can lead to inventory peaks when demand is low.

**Lot size / order multiples** — production or purchase quantities must be in multiples of a defined lot size. For agricultural seed, this may reflect packaging constraints (pallets, bags) or production economics (minimum batch size).

**Reorder point** — the inventory level that triggers a new order. In some planning systems, this is calculated dynamically based on lead time and safety stock. In Planning software, it is typically derived from the planning engine's requirements calculation rather than set as a static parameter.

**Shelf life / expiry** — for perishable items (seed lots have a limited germination validity period), the shelf life parameter controls how far into the future demand can be served from a given production lot. This prevents the system from planning delivery of seed that would arrive after its usable window.

## Parameter review process

Planning parameters should be reviewed on a defined cycle — at minimum annually, and ideally before each major planning cycle (e.g., before the new season's production programme is confirmed). The review should check:

- Are lead times still accurate, or have supplier or logistics lead times changed?
- Are safety stock levels calibrated to the current service level targets?
- Are MOQs and lot sizes still correct, or have production or packaging setups changed?

Parameters that are wrong and never reviewed create a planning model that gradually diverges from reality — producing plans that cannot be executed without constant manual override.

## Where parameters live

In the four-system landscape, planning parameters are defined in MDM system and synced to Planning software. Changes should be made in MDM system, not directly in Planning software, to ensure they persist through the next synchronisation cycle. If a parameter needs to be adjusted urgently (e.g., a supplier's lead time has changed immediately), the correct process is to update MDM system and trigger a sync — not to change it directly in Planning software and wait for MDM system to be updated later.
