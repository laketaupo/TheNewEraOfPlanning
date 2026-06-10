---
title: "The User Interface"
description: "The o9 interface is built around a grid-and-chart model. Understanding the core UI components — grids, filters, charts, and the exception panel — makes every workspace easier to use."
order: 2
chapter: "05-navigation-and-ui"
estimatedMinutes: 5
topicLayout: "prose-topic"
---

## The grid view

The grid is the most common view type in o9. It presents planning data in a row-column structure: rows represent items (products, locations, customers) and columns represent time periods. Cells contain values — inventory quantities, planned order volumes, demand signals.

Key grid features:
- **Freeze panes** — the left column (item hierarchy) and time headers can be frozen while scrolling
- **Inline editing** — many cells are directly editable; changes trigger a recalculation of dependent values
- **Color coding** — cells are color-coded to indicate status: green for on-target, yellow for at-risk, red for exception
- **Row grouping** — items can be grouped and collapsed by product family, location, or customer to manage visual complexity

## Filters and slicers

Every workspace has a filter panel that lets you narrow the data visible in the grid or chart. Common filters:
- **Product / SKU** — show only specific items or item groups
- **Location** — filter to a site, warehouse, or distribution node
- **Time horizon** — show only the near-term (e.g., next 13 weeks) or a specific period
- **Exception type** — show only items with active exceptions (shortage, excess, late order)

Filters are applied at the workspace level and persist while you navigate within the workspace. Be aware of active filters — viewing a workspace with a narrow filter applied can make the model look smaller or simpler than it is.

## Charts and visualisations

Chart views in o9 typically show:
- **Inventory waterfall** — stock projection over time, showing opening stock, receipts, demand, and closing stock per period
- **Demand vs. supply bar chart** — side-by-side comparison of demand signal and supply plan by period
- **Exception trend** — the number and type of exceptions over time, useful for tracking whether the planning process is improving or degrading

Charts are linked to the grid: selecting a row in the grid updates the chart to show that item's profile. This allows quick visual inspection without switching views.

## The exception panel

Most workspaces have an exception panel — a sidebar or tab that lists active exceptions for the current view. Exceptions are prioritised by severity and due date. Clicking an exception navigates directly to the affected item.

The exception panel is the starting point for exception-based working: open the workspace, review the exception panel, work through the list from most urgent to least. Items not in the exception panel do not need intervention.

## Saving and sharing views

o9 allows personalised view configurations — filter settings, column arrangements, chart types — to be saved and shared. Creating a saved view for your standard daily exception check saves time and ensures consistency across the team.
