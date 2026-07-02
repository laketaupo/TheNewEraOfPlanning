---
title: "Setting Up a Simulation"
description: "Before running a simulation in Planning software, you need to define what you are testing, create the scenario, and make the right input changes. Preparation determines whether the output is useful."
chapter: "04-the-simulation"
estimatedMinutes: 4
topicLayout: "prose-topic"
---

## Start with a clear question

The most common mistake in simulation setup is starting with the tool rather than the question. Before opening Planning software, you should be able to state: "I want to know what happens to my supply plan if [specific assumption changes]." The more specific the question, the more useful the simulation.

Vague question: "What if demand is higher?"  
Good question: "What happens to inventory and shortage risk for Variety X if the June demand signal increases by 25%?"

## Creating the scenario

A simulation runs within a scenario. To set one up:

1. **Create a new scenario** — copy the current baseline into a new named scenario. Use a name that describes the assumption being tested, not a generic label (e.g., "June demand +25% Variety X" not "Scenario 3").
2. **Set the planning horizon** — confirm the time range you want the simulation to cover. For most supply risk or demand uncertainty questions, a 12–26 week horizon is appropriate.
3. **Lock the baseline** — before making changes, note the key baseline metrics you will compare against: total shortage volume, inventory DoH, planned order quantities. These are your reference points.

## Making input changes

With the scenario created, make the specific changes that reflect your assumption:

- Navigate to the relevant demand signal, supply parameter, or lead time field
- Change the value to reflect your assumption
- Document what you changed and why — this makes the scenario interpretable to anyone who reviews it later

Keep the change set as small as possible. A simulation that changes five things simultaneously is hard to interpret. Test one assumption at a time; if you need to model combined effects, start with the individual components and layer them.

## Pre-run checklist

Before triggering the planning engine:
- [ ] Scenario is named descriptively
- [ ] Input changes are documented
- [ ] Baseline metrics are noted for comparison
- [ ] Planning horizon is set appropriately
- [ ] Only intended changes have been made (no accidental edits)
