---
title: "BOM: Input & Output"
description: "What goes into a transformation process, what comes out, and the yield that connects the two."
chapter: "01-understanding-basics"
estimatedMinutes: 4
widget: ""
nodeType: "transformation"
topicLayout: "node-topic"
lineInLabel: "100% in"
lineOutLabel: "80% out"
summary: "Every transformation process has two sides: what goes in and what comes out. The input side (consumed items) defines which raw materials or components are used and in what quantity. The output side (produced items) defines what is created and at what yield. Yield captures the efficiency gap — if you feed 100 units of input into a process and only 80 units of usable output emerge, the yield is 80%. That 20% loss is not a mistake in the model; it reflects real-world scrap, evaporation, trimming, or conversion losses. Planning software uses yield when exploding demand backwards: to produce 800 finished units at 80% yield, the plan must schedule enough input to cover 1,000 units of consumption."
bullets:
  - "Consumed items define which inputs are used and at what quantity per output"
  - "Produced items define which outputs are created when the process runs"
  - "Yield captures the efficiency gap between input consumed and output produced"
  - "A yield of 80% means 100 units in → 80 usable units out"
  - "Planning software divides required output by yield to calculate gross input requirements"
---
