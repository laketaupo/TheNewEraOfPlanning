---
title: "How FMS and MDM Interact"
description: "FMS and MDM are not directly integrated with each other — but they share a critical dependency: FMS uses item codes that must match the MDM master record exactly, or the integration to Planning software breaks."
chapter: "fms-mdm-in-the-landscape"
estimatedMinutes: 4
topicLayout: "prose-topic"
---

FMS and MDM do not have a direct integration with each other in most implementations. They each connect independently to Planning software. But they share a dependency that is easy to overlook: **item codes**.

FMS records grower activity against crop variety codes — the codes it uses internally to identify what is planted. Planning software maps those codes to item records that Planning software received from MDM. If the variety code in FMS does not match the item code in MDM (and therefore in Planning software), the FMS supply signal arrives at Planning software referencing an item it cannot recognise.

The result is a silent planning gap: the supply signal is received but cannot be applied to any planning record. No error is raised in FMS. No error is raised in Planning software. The supply simply disappears from the plan.

**The dependency chain for a new crop variety to be plannable end-to-end:**

1. Item created in MDM with the correct variety code and planning parameters
2. Item synced from MDM to Planning software
3. Item synced from MDM to ERP
4. Grower contract set up in FMS using the same variety code
5. FMS → Planning software integration tested with the new variety code

Skipping or partially completing any step creates a ghost variety: present in one system, absent from another, with no automatic alert.
