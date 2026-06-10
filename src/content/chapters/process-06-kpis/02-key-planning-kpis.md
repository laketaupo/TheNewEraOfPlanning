---
title: "Key Planning KPIs Defined"
description: "Precise definitions for the most important supply chain planning KPIs — what each metric measures, how it is calculated, and what a good result looks like."
order: 2
chapter: "process-06-kpis"
estimatedMinutes: 5
topicLayout: "prose-topic"
---

## On-Time In-Full (OTIF)

**What it measures:** The percentage of customer orders delivered both on time (by the confirmed delivery date) and in full (at the ordered quantity).

**Formula:** `OTIF % = (Orders delivered on time AND in full) / (Total orders) × 100`

**Why it matters:** OTIF is the most direct measure of customer service. A customer who receives 95% of their order on time and the other 5% late has experienced a service failure — OTIF captures this where simpler metrics might not.

**Typical benchmarks:** World-class OTIF is 95–98%. Below 90% generally indicates a structural supply-demand alignment problem.

---

## Forecast Accuracy (MAPE)

**What it measures:** The average magnitude of the difference between the forecast and actual demand, expressed as a percentage of actual demand.

**Formula:** `MAPE = (1/n) × Σ |Actual − Forecast| / Actual × 100`

**Why it matters:** Forecast accuracy drives safety stock requirements. A planner who can forecast within 10% needs far less safety stock than one who is regularly 30% off. Improving forecast accuracy is often the highest-leverage action available to reduce working capital while maintaining service levels.

**Typical benchmarks:** MAPE below 20% at the monthly/product-family level is good. At the weekly/SKU level, below 30% is typically considered acceptable for seasonal agricultural products. Always interpret MAPE alongside forecast bias.

---

## Forecast Bias

**What it measures:** Whether the forecast is systematically over- or under-predicting demand.

**Formula:** `Bias % = (Forecast − Actual) / Actual × 100` (averaged over time)

**Why it matters:** MAPE can be low while bias is high if errors are consistent in one direction. A persistent positive bias (over-forecasting) builds excess inventory. A persistent negative bias (under-forecasting) causes chronic shortfalls. Bias often indicates a process problem — a commercial team that inflates forecasts as a buffer, or a system that anchors on last year's actuals — rather than random uncertainty.

---

## Inventory Days on Hand (DoH)

**What it measures:** How many days of forward demand is currently in stock.

**Formula:** `DoH = Current stock / Average daily demand`

**Why it matters:** DoH translates an inventory balance (a financial number) into a supply chain reality (how long can we sustain service without replenishment). High DoH indicates potential excess; low DoH indicates potential shortage risk.

---

## Plan Adherence

**What it measures:** The percentage of planned orders that are executed as planned — in the right quantity, at the right time.

**Formula:** `Plan adherence % = (Orders executed per plan) / (Total planned orders) × 100`

**Why it matters:** Low plan adherence indicates that the planning model is not being followed — either because the plan is wrong and teams are correcting it informally, or because execution is undisciplined. Either is a problem. Plan adherence below 80% typically signals that the planning process is not embedded in operational behaviour.
