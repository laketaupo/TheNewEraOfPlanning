---
title: "Why FMS and MDM Are Supporting Systems"
description: "FMS and MDM are grouped not because they are similar, but because neither manages transactions or planning calculations — they supply the reference data and field signals that make ERP and Planning software work correctly."
chapter: "fms-mdm-in-the-landscape"
estimatedMinutes: 4
topicLayout: "prose-topic"
---

FMS and MDM sit in the same module not because they do the same thing, but because they play the same structural role in the planning landscape: they are the systems that ERP and Planning software depend on for accurate inputs, yet they do not own transactions and they do not run planning calculations.

**ERP** records what happens. **Planning Software** calculates what should happen. **FMS and MDM** provide the reference reality that both of those systems plan and execute against.

Without FMS, Planning software cannot see supply coming from the field — it is planning blind until product arrives at a warehouse gate. Without MDM, the item codes, BOMs, and planning parameters that ERP and Planning software use may be out of sync, inconsistent, or missing — corrupting every plan that touches an affected item.

The grouping reflects a governance reality as much as a technical one: issues in FMS and MDM tend to surface in ERP and Planning software, making the root cause harder to find. A planner who understands both supporting systems can trace discrepancies to their origin rather than treating them as planning-tool problems.
