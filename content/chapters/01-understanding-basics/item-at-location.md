---
title: "Item @ Location"
description: "How an item is represented at a specific node in the network, and what that means for planning."
chapter: "01-understanding-basics"
estimatedMinutes: 3
widget: ""
nodeType: "item"
nodeLocation: "Central Warehouse"
topicLayout: "node-topic"
summary: "An Item @ Location is the planning unit in Planning software — the combination of a specific item stocked at a specific node in the network. Every inventory balance, safety stock policy, and supply or demand signal exists at this level. The same physical product can behave differently at different locations: one node might hold safety stock, another might operate make-to-order. Planning software plans each item-location pair independently, then reconciles them across the network."
bullets:
  - "Represents a specific item stocked at a specific network node"
  - "The item + location pair is the fundamental planning unit"
  - "Each location can have its own stock policy — min, max, safety stock"
  - "Inventory balances and on-hand quantities are tracked at this level"
  - "Planning software generates supply and demand signals per item-location combination"
---
