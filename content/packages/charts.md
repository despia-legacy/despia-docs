---
title: Charts
description: Draw line, bar, area and point charts from your data with a single chart element.
package: charts
---

Draw line, bar, area and point charts from your data with a single chart element.

Adds the chart element. You bind it to a list of rows and name the fields for the horizontal and vertical axes, and it draws the chart with the platform's own charting: Swift Charts on iOS, with the same markup on Android. It supports several series, stacked or grouped bars, a second axis on the right, reference lines, a legend and tapping a point to select it. Your web code ships no charting library. On iOS 15 and earlier the chart renders empty.

Open package. License: Apache-2.0. Version 0.1.0.

## When to use it

Use it when you want to show numbers over time or by category, such as sales per month or usage by region, inside a native UI app. Skip it for heavy analysis dashboards that need custom interactions the element does not offer.

## Install

```sh
despia add Core/Charts
```

## Where it runs

| Target | Available |
| --- | --- |
| ios | yes |
| android | yes |
| web | no |
| macos | yes |

Device classes: phone, desktop.

## Actions

_This package declares no actions._

## Versions

| Version | Channel | Summary |
| --- | --- | --- |
| 0.1.0 | checkpoint |  |
