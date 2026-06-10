---
title: "ERP vs. legacy ERP"
description: "ERP is the evolution of legacy ERP. Understanding what changed — and what stayed the same — sets the foundation for working effectively in the new ERP."
order: 1
chapter: "bc-01-erp-basics"
estimatedMinutes: 4
topicLayout: "prose-topic"
---

## What legacy ERP was

legacy ERP was an on-premises ERP system used widely by mid-size manufacturing and distribution businesses. It handled core transactional processes: purchase orders, production orders, sales orders, inventory transactions, and financial posting. Many organisations used legacy ERP for years with heavily customised setups — local adaptations, country-specific tax logic, industry-specific extensions.

## What changed with ERP

ERP (ERP) is the cloud-based successor to legacy ERP. The core transactional logic is largely the same — the data model, the posting logic, the flow from purchase order to goods receipt to invoice is recognisable to anyone who used legacy ERP. What changed is the deployment model, the interface, and the integration architecture.

**Cloud-first** — ERP runs in the Microsoft Azure cloud. There is no on-premises server to maintain. Updates are managed by Microsoft on a continuous release cadence, not deployed by IT.

**Modern interface** — the web client replaces the Windows client. The layout is cleaner and works in a browser or on mobile. Role centres replace the old menu structure — the landing page you see depends on your assigned role.

**API-first integration** — ERP has a well-documented REST API, which makes integration with other systems (including Planning software) more standardised than the custom connector approaches often used with legacy ERP.

**Extension model** — customisations are now built as "extensions" (AL code on top of the base application) rather than modifications to the base code. This makes it possible to upgrade ERP without losing customisations.

## What stayed the same

The core posting logic, ledger structure, item cards, BOM structures, and production order flows are recognisable to legacy ERP users. The same transactional events — receiving a purchase order, completing a production order, shipping to a customer — happen in ERP the same way they did in legacy ERP. The vocabulary is the same: item cards, posting groups, dimensions, locations.

## What this means for planners

Planners interact with ERP primarily to:
- Release planned orders from Planning software as purchase orders or production orders in ERP
- Monitor the status of open orders (on-time delivery, production progress)
- Review actual inventory quantities at specific locations

The interface has changed from legacy ERP; the underlying logic has not. If you worked in legacy ERP, ERP will feel familiar after a short adjustment period.
