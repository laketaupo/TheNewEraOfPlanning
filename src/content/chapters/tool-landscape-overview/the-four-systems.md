---
title: "The Four Systems"
description: "What ERP, Planning Software, MDM system, and FMS each do — and why the planning landscape needs all four."
chapter: "tool-landscape-overview"
estimatedMinutes: 8
topicLayout: "prose-topic"
---

Modern supply chain planning does not run on a single system. It runs on four — each with a distinct purpose, a distinct data domain, and a distinct relationship to the others. Understanding what each system does, and what it cannot do, is the foundation for understanding why planning breaks down when any one of them is absent, poorly configured, or out of sync.

## ERP — The Transactional Backbone

**ERP** (Enterprise Resource Planning — SAP and Microsoft D365 are the most common examples in agricultural and FMCG contexts) is the system in which the business executes its plans. When a planner decides that 500 tonnes of raw material should be ordered, it is ERP that raises the purchase order: it records the supplier, the quantity, the expected delivery date, the unit price, and the warehouse location it should be received into. When that delivery arrives, ERP records the goods receipt — updating on-hand stock in real time. When production draws down that stock to manufacture finished goods, ERP records the goods issue. When product moves to a distribution centre, ERP records the stock transfer. At every step, ERP writes a transactional fact into its ledger.

This makes ERP the **system of record for what actually happened**. It does not predict. It does not optimise. It records, executes, and accounts. The financial accounting module lives here because the cost of every transaction — the value of stock on hand, the accrued cost of goods received, the revenue recognised on despatch — flows directly from those transactional postings.

The implications for planning are significant. ERP is where confirmed orders, on-hand inventory, open purchase orders, and production orders exist as authoritative facts. Planning Software depends entirely on ERP to know where the business stands right now. If ERP's inventory positions are wrong — because goods receipts have not been posted, or because a stock adjustment was entered with the wrong date — the planning engine will build its recommendations on a false picture of reality.

ERP's weakness is that it is designed for execution, not foresight. It can tell you that you have 400 tonnes of Product A in Warehouse B today, but it has no native capability to tell you whether that is the right amount relative to expected demand over the next twelve weeks, or whether you should be raising more purchase orders now. That is the job of Planning Software.

## Planning Software — The Planning Engine

**Planning Software** (also called APS — Advanced Planning and Scheduling — or IBP — Integrated Business Planning — tools; examples include o9 Solutions, Kinaxis, and Blue Yonder) is the system in which a planner thinks about the future. It ingests supply and demand signals from all the other systems in the landscape — sales forecasts, confirmed orders, open purchase orders, on-hand stock, production schedules, supplier lead times — and applies optimisation and netting logic to produce a forward-looking plan.

The core function of Planning Software is to answer a deceptively simple question: given what we know about future demand and current supply constraints, what do we need to do, when, and where? It does this by netting demand against available supply (on-hand plus open orders), identifying gaps, proposing replenishment or production orders to close those gaps, checking those proposals against capacity and lead time constraints, and surfacing exceptions where the plan cannot be met without a decision. The planner's job is to work those exceptions — to make the trade-offs that optimisation logic alone cannot make.

Planning Software also supports the structured planning cycles that govern how the business reviews and adjusts its plan. **S&OP** (Sales and Operations Planning) and **S&OE** (Sales and Operations Execution) workflows are built around the planning engine: the demand review, the supply review, the integrated reconciliation, the executive sign-off. Scenario simulation — the ability to ask "what if demand is 20% higher than forecast, can we respond?" — is another core capability.

What Planning Software cannot do is execute. It can recommend that a purchase order be raised for 500 tonnes of raw material, but the order does not exist until it is written into ERP. The planning engine is a recommendation machine. Execution happens elsewhere.

## MDM System — The Source of Reference Data

**MDM** (Master Data Management) is the system that answers the question: what exactly is this product? Every item that flows through the business — every raw material, every semi-finished good, every SKU — has an identity: a code, a name, a unit of measure, a pack configuration, a shelf life, a weight, a customs classification. That identity is a **master data record**, and it must be consistent across every system that uses it.

Without MDM, ERP and Planning Software each maintain their own version of "what Product A is." The ERP system might record the lead time for a raw material as 14 days because that was the agreed parameter when the item was set up two years ago. The planning engine might be running with 21 days because a planner updated the parameter locally and it was never reconciled. The result is a plan that ERP cannot execute because the assumptions it was built on do not match the rules ERP applies.

MDM governs the data structures that all other systems depend on. This includes **item master records** (the identity of every product), **bills of material** (BOMs — what a finished product is made from, in what quantities), **bills of distribution** (BODs — how a product flows through the distribution network), **product hierarchies** (how items group up for planning, forecasting, and reporting), and **planning parameters** (lead times, safety stock targets, lot sizes, reorder points). These parameters are not operational preferences — they are the constants that the planning engine's mathematics rely on. A wrong lead time in MDM propagates through every plan that uses that item.

MDM is often the least visible system in the landscape, but it is the one that breaks everything else when it is wrong. Data quality issues in ERP and Planning Software can frequently be traced back to a root cause in MDM: a parameter that was never updated after a supplier change, a BOM that was not maintained after a product reformulation, a new SKU that was created in ERP but never given a planning parameter set.

## FMS — Field-Level Supply Visibility

**FMS** (Field Management System) is specific to businesses where supply originates in the field rather than in a factory or a supplier's warehouse. In agricultural, fresh produce, and soft commodity planning, supply visibility does not begin at the point of harvest or receipt — it begins weeks or months earlier, in the field, with a crop that is growing.

FMS is the system that captures this early supply signal. It records **grower contracts** (which growers have committed to supply what volumes, of what product, over what period), **planted area and crop progress** (what is in the ground, at what growth stage), **harvest estimates** (based on agronomic data, inspection records, or yield models), and **field actuals** (what was actually harvested and when). From these records, FMS generates supply forecasts that can be fed into Planning Software weeks before any physical product exists.

The planning implications are substantial. A fresh-produce planner who relies only on ERP for supply visibility is essentially planning blind until the moment product is received into a warehouse — at which point it may already be too late to adjust customer commitments, production schedules, or logistics. FMS moves the planning horizon backwards: instead of knowing what you have, you begin to know what you will have, and when.

FMS also captures the variability that is inherent in agricultural supply. Yield is not deterministic. A crop estimate can change because of weather, pest pressure, or water availability. FMS tracks that progression and allows the planning engine to incorporate updated estimates as the growing season advances, narrowing the uncertainty in the supply plan as harvest approaches.

## How the Four Systems Connect

The four systems are not alternatives to each other — they are complementary layers of a single capability. MDM provides the reference data that gives every transaction and every plan its meaning. ERP records what the business has done and what it has committed to do. FMS provides early supply signals before those signals have become ERP transactions. Planning Software synthesises all of this into a coherent forward-looking plan and surfaces the decisions that humans need to make.

| System | Primary function | System of record for | Cannot do |
|---|---|---|---|
| ERP | Transactional execution | What actually happened | Optimise future plans |
| Planning Software | Forward planning & optimisation | Recommended plans & scenarios | Execute transactions |
| MDM | Master data governance | What every product and entity is | Process transactions or plans |
| FMS | Field supply visibility | What is growing and when it will arrive | Manage finished goods or execute orders |

When any one of these systems is absent, poorly maintained, or out of sync with the others, the planning process degrades in predictable ways. Bad master data in MDM means plans built on false assumptions. Slow or incomplete transaction posting in ERP means the planning engine netting against a stale inventory position. No FMS means fresh-produce supply remains invisible until it arrives at the warehouse gate. Understanding which system owns which data — and why — is the first step toward understanding where to look when a plan does not match reality.
