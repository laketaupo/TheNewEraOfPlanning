---
title: "BOD: Transport lead time"
description: "The time an item spends in transit on a distribution lane, from departure at origin to arrival at destination."
order: 8
chapter: "01-understanding-basics"
estimatedMinutes: 3
widget: ""
nodeType: "transportation"
topicLayout: "node-topic"
durationLabel: "1 week"
summary: "Transport Lead Time is the time an item spends in transit on a distribution lane — from the moment it departs the origin node to the moment it arrives at the destination node. The planning engine uses transit time to offset shipment release dates: if a DC needs stock on day 10 and transit takes 3 days, the shipment must leave the warehouse on day 7. Accurate transit times prevent phantom supply — situations where the plan assumes goods are available before they actually arrive."
bullets:
  - "Time from departure at origin to arrival at destination"
  - "Drives shipment release dates — when o9 must trigger a transfer order"
  - "Expressed in days or hours depending on the distribution network"
  - "Longer transit times increase in-transit (pipeline) inventory"
  - "Varies by transport mode — air is faster, sea and road are slower"
---
