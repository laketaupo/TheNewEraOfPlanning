---
title: "What Is a Constraint"
description: "What constraints are in supply chain planning, how they arise, and how they are represented in the planning model."
chapter: "constraint-management"
estimatedMinutes: 5
topicLayout: "prose-topic"
---

## The Definition

A constraint is any resource, material, or rule that limits the output of the supply chain below what unconstrained demand would require. The supply chain can only produce as much as its most limiting factor allows, regardless of what demand asks for or what every other part of the system could theoretically deliver.

This idea was formalised by Eliyahu Goldratt in the Theory of Constraints, first published in the 1984 novel *The Goal*. The central insight is that every system has at least one constraint, and improving any part of the system other than the constraint does not increase total throughput. A factory with ten production steps, one of which runs at half the speed of the others, will not produce more by speeding up the other nine. Total output is bounded by step ten.

Supply chain planning is the practical application of this logic at scale. Every supply plan is either constrained or unconstrained. Unconstrained plans assume infinite capacity and availability — useful as a demand signal but not executable. Constrained plans reflect what can actually be produced, procured, and delivered given real limits.

## Types of Constraints

**Capacity constraints** are the most common type in manufacturing and distribution planning. They occur when a production resource — a machine, a production line, a warehouse zone, a fleet of vehicles — has limited throughput and demand exceeds that throughput. Capacity constraints are defined by rate (units per hour), availability (hours per week), and yield (proportion of output that meets quality standards). Planning systems represent capacity constraints as finite resources with a defined weekly or daily availability profile.

**Material constraints** arise when a critical input is limited in supply — a single-source component, a long-lead-time raw material, or a regulated ingredient with restricted availability. Unlike capacity constraints, which are typically persistent structural features of the production environment, material constraints are often temporary: a supply disruption, an allocation from a sole-source supplier, or a seasonal shortage. They are represented in the planning model as limited inventory or capped procurement quantities.

**Regulatory constraints** include import quotas, export licences, shelf-life limits, and compliance requirements that cap how much of a product can be produced, imported, or sold in a given period. These are harder to represent in standard planning tools but are increasingly important in businesses operating across regulated markets. They are often modelled as maximum order quantities or sourcing restrictions on specific supply routes.

## How Constraints Are Represented in the Planning Model

Planning software represents constraints as finite resources attached to supply routes or production steps. A bottleneck machine, for example, is modelled with a defined capacity of hours per week and an efficiency factor. When the supply plan runs, the system allocates demand to that resource up to its capacity limit and flags the shortfall as a constraint exception.

The key distinction in the planning model is between **infinite capacity planning** and **finite capacity planning**. In infinite mode, the system assumes every resource can meet whatever is asked of it — it is used to calculate the unconstrained demand signal. In finite mode, the system respects resource limits and produces a plan that is actually executable, even if it cannot fulfil all demand. Most production planning environments use finite capacity in the near-term horizon and infinite capacity beyond it, where decisions have not yet been locked.

The quality of constraint management depends directly on the quality of the planning model. Resources must be modelled accurately — capacity that is entered optimistically (assuming maximum availability, no downtime, no changeover time) produces plans that look executable on paper but fail in execution. Realistic capacity modelling, including planned maintenance, changeover time, and shift patterns, is a prerequisite for useful constraint management.
