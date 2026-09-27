---
title: calendar
description: The data-control twin renders a localized, keyboard-operable month grid with ISO binding, range constraints, marks, and month events.
order: 3
section: components
element: calendar
category: input
scope: library
platforms: web,ios,android
properties: [{"name":"bind","type":"expr","default":null},{"name":"color","type":"color","default":"var(--dsx-accent)"},{"name":"disabled","type":"bool","default":"false"},{"name":"disabled-if","type":"expr","default":null},{"name":"markColorField","type":"string","default":"color"},{"name":"markDateField","type":"string","default":"date"},{"name":"marks","type":"expr","default":null},{"name":"max","type":"iso-date","default":null},{"name":"min","type":"iso-date","default":null},{"name":"on:month","type":"action","default":null}]
actions: ["month"]
catalog: 0.1.0
commit: 84cb9c827f770fb520dfb95c4dc8186476512631
generator: ClosedSource/scripts/generate_component_docs.rb
---

# calendar

The data-control twin renders a localized, keyboard-operable month grid with ISO binding, range constraints, marks, and month events.

<RefMeta platforms="Web,iOS,Android">
Category: Input - Live specimens: the [System gallery](/system).
</RefMeta>

## Usage

```dsx
<calendar bind="dsx.variable.day"/>
```

`calendar` takes no children.

## Catalog specimen

`CalendarDefault.dsx`, verbatim from the catalog:

```dsx
<calendar bind="dsx.variable.day" style="width: 100%">
  <head>
    <variable as="day">return ''</variable>
  </head>
</calendar>
```

Every component in the library is authored at four rungs in the catalog (default, system words, one property override, fully custom), so the cost of leaving the system design is visible in one place. The [System gallery](/system) runs them.

## States

| Renderer | Audited | Dated | Evidence |
|---|---|---|---|
| web | yes | 2026-08-18 | probe: month grid renders, day click writes store (cal=2026-08-16), selected day fill + today ring, day/page hover rules, prev/next buttons - w8 Chromium probe (compileComponent->bootDsx, full skin), scratchpad/w8/*.mjs, shots/w8-audit-* |
| ios | review | 2026-08-18 | Selection circle + today ring + min/max day dimming with native .disabled + control-level W9 disabled grammar (dayCell, ClosedSource/DSX/Modules/Mandatory/Foundation/Components/Basics/Calendar/swift/Calendar.swift); month paging fires on:month {month}; CI-asserted on iPad: paging both ways, native-disabled days, selection writes yyyy-MM-dd + isSelected (ClosedSource/RuntimeUITests/RuntimeLaunchUITests.swift testIPadFoundationCalendarUsesNativeButtonsNavigationAndDisabledState) and Catalyst day tap (inspector matrix). Verified-by-review; the visual capture awaits the iOS capture lane. |
| android | review | 2026-08-18 | VERIFIED-BY-REVIEW: day cells are selectable with selected state, min/max out-of-range days dimmed + inert, today ring, selection circle (DateElements.kt calendar grid; dsxAccessibleSelectable on day cells DateElements.kt:475); month chevrons are activations (DateElements.kt:509); disabled= in the contract. |
| desktop | unaudited | unaudited | none recorded |

Rest, hover on a fine pointer, pressed, focus visible and disabled, in both colour schemes, plus loading, error and empty where the component has them.

## Attributes

| Attribute | Type | Default | Notes |
|---|---|---|---|
| `bind` | `expr` |  |  |
| `color` | `color` | `var(--dsx-accent)` |  |
| `disabled` | `bool` | `false` |  |
| `disabled-if` | `expr` |  | Disabled when this expression is truthy. `disabled=` binds as TEXT, and the string "false" is TRUE - so a bound boolean belongs here, never there. |
| `markColorField` | `string` | `color` |  |
| `markDateField` | `string` | `date` |  |
| `marks` | `expr` |  |  |
| `max` | `iso-date` |  |  |
| `min` | `iso-date` |  |  |
| `on:month` | `action` |  |  |

Every element also carries the [universal attributes](/components/attributes): accessibility, animation, `class`, `style` and the platform suffixes.

## Events

| Event | Handler |
|---|---|
| `month` | `on:month="..."` |

A payload arrives FLAT in the handler scope, so a declared action names the key bare (`message="message"`), never through an `event` plane.

## Platform notes

| Renderer | Grammar | What that means |
|---|---|---|
| web | `supported` | the built in renderer implements this element |
| ios | `reference` | the reference renderer this element is specified against |
| android | `enforced` | implemented and pinned by the element parity test |
| desktop | `uncaptured` | no desktop capture has measured it, which claims nothing in either direction |

The data-control twin renders a localized, keyboard-operable month grid with ISO binding, range constraints, marks, and month events.

**Known limits on the web**

- The visible surface is one month at a time and mark input is bounded.

**Implementation notes.** Wire format fixed at en_US_POSIX yyyy-MM-dd (Calendar.swift:40-44) - Android-identical by design; display localization from the system calendar.

Declared platforms: `ios`, `android`.

**Adaptivity (web, 2026-08-18).** identical presentation at 390 touch and 1366 fine pointer by declaration (probed both, page overflow 0; only density tokens move); RTL mount: overflow 0, leading alignment mirrors (btn right edge flush) - w8 Chromium probe (compileComponent->bootDsx, full skin), scratchpad/w8/*.mjs, shots/w8-audit-*

## Theming

DSX has one styling vocabulary and it is CSS. Three doors reach this element, and they differ only in how often the look repeats: `style="..."` for a declaration list on one element, `class="..."` for a name declared in a `<style>` block, and the component's own sheet for everything a whole screen shares.

On the web this element's root carries `dsx-calendar`, the stable class the contract application CSS targets. It is a rendering fact you can read, not a styling hook to depend on: style the element, not the class the renderer stamps.

Web runtime: `data`.

## Accessibility

| Renderer | Audited | Dated | Evidence |
|---|---|---|---|
| web | yes | 2026-08-18 | the filed axe critical (aria-required-children/-parent) CLOSED: the weekday header row and every week now render as role=row children INSIDE the role=grid with aria-rowindex/aria-rowcount (the `<grid>` element's aria-row mechanics); keyboard day-walk unchanged; axe serious/critical = 0 over the probe page incl. an enabled and a disabled calendar - w9 Chromium probe (compileComponent->bootDsx, full skin incl. globals/native/data sheets), scratchpad/w9/density-probe.mjs, shots/w9-density-controls.png + -390.png |
| ios | review | 2026-08-18 | Each day announces its full date (accessibilityLabel(Text(date, style: .date))) + isSelected; chevrons labeled Previous/Next month; the month title carries .isHeader; the one-letter weekday row is deliberately hidden as noise (ClosedSource/DSX/Modules/Mandatory/Foundation/Components/Basics/Calendar/swift/Calendar.swift); CI-asserted labeled days + native disabled + selected (ClosedSource/RuntimeUITests/RuntimeLaunchUITests.swift). Verified-by-review; the visual capture awaits the iOS capture lane. |
| android | review | 2026-08-18 | VERIFIED-BY-REVIEW: day cells ride dsxAccessibleSelectable (role + selected + Enter/Space, DateElements.kt:475); chevrons dsxAccessibleActivation(Role.Button) (DateElements.kt:509); marks are decorative dots. |
| desktop | unaudited | unaudited | none recorded |

Every element carries `a11yLabel`, `a11yHint`, `a11yValue`, `a11yTrait`, `a11yGroup` and `a11yHidden`. A control that draws an icon beside text is one group with one label, never two announcements; see the [universal attributes](/components/attributes).

This page is GENERATED by ClosedSource/scripts/generate_component_docs.rb. A hand edit here is overwritten on the next run by design: fix the ledger instead (the attribute and event contract in `OpenSource/Documentation/reference/stack-elements.json`, the platform support and the audit in `OpenSource/Conformance/library/matrix.json`, the description and the web limits in `OpenSource/Engine/TypeScript/support/element-support.json`, the specimen in `OpenSource/Catalog`).

