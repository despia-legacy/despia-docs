---
title: WebView
description: The rich Web twin provides a policy-constrained iframe, lifecycle events, named controls, safe URL schemes, and ephemeral isolation.
order: 3
section: components
element: WebView
category: web
scope: library
platforms: web,ios,android
properties: [{"name":"ephemeral","type":"bool","default":"false"},{"name":"name","type":"string","default":null},{"name":"on:commit","type":"action","default":null},{"name":"on:fail","type":"action","default":null},{"name":"on:finish","type":"action","default":null},{"name":"on:message","type":"action","default":null},{"name":"on:start","type":"action","default":null},{"name":"origin","type":"string","default":null},{"name":"path","type":"string","default":"/"},{"name":"src","type":"url","default":null}]
actions: ["commit","fail","finish","message","start"]
catalog: 0.1.0
commit: 514fbe9725d913ddef906af0df3d86b557bb3972
generator: ClosedSource/scripts/generate_component_docs.rb
---

# WebView

The rich Web twin provides a policy-constrained iframe, lifecycle events, named controls, safe URL schemes, and ephemeral isolation.

<RefMeta platforms="Web,iOS,Android">
Category: Web - Live specimens: the [System gallery](/system).
</RefMeta>

## Usage

```dsx
<WebView name="checkout" src="https://example.com/pay"/>
```

`WebView` takes no children.

## Catalog specimen

`WebViewDefault.dsx`, verbatim from the catalog:

```dsx
<vstack style="gap: 6px; max-width: 260px">
  <head/>
  <text value="WebView loads a third party URL in a named web view."/>
  <text value="Web: partial. iOS and Android: the real thing." class="partial-note"/>
</vstack>
```

Every component in the library is authored at four rungs in the catalog (default, system words, one property override, fully custom), so the cost of leaving the system design is visible in one place. The [System gallery](/system) runs them.

## States

| Renderer | Audited | Dated | Evidence |
|---|---|---|---|
| web | n/a | 2026-08-18 | Non-interactive host embed (the bare policy-constrained iframe primitive, no bridge by construction): no interaction-state axis on the host; lifecycle events are value-driven data and the embedded document owns its own states (OpenSource/Engine/TypeScript/support/element-support.json WebView row; OpenSource/Documentation/architecture/web-surface-policy.md layer 0). |
| ios | review | 2026-08-18 | Navigation lifecycle is the state surface: on:start/commit/finish/fail with payloads + on:message via the neutral window.app.send channel; node-owned lifetime (created on mount, torn down on unmount via dismantleUIView; per-coordinator load dedup) (ClosedSource/DSX/Modules/Core/WebView/Components/Views/WebView/swift/WebView.swift). Verified-by-review; the visual capture awaits the iOS capture lane. |
| android | n/a | 2026-08-18 | bare web canvas BY CONSTRUCTION (WebViewComponent.kt header: events in, injections out, NO bridge): the load lifecycle is events (on:start/commit/finish/fail with payloads), error presentation belongs to the mounting markup; no component chrome or state axis of its own. |
| desktop | unaudited | unaudited | none recorded |

Rest, hover on a fine pointer, pressed, focus visible and disabled, in both colour schemes, plus loading, error and empty where the component has them.

## Attributes

| Attribute | Type | Default | Notes |
|---|---|---|---|
| `ephemeral` | `bool` | `false` |  |
| `name` | `string` |  |  |
| `on:commit` | `action` |  | Navigation committed - payload { url, surface }. |
| `on:fail` | `action` |  | Navigation failed - payload { url, surface, error, code }. |
| `on:finish` | `action` |  | Navigation finished - payload { url, surface }. |
| `on:message` | `action` |  | The page called window.app.send - payload { data, surface }. |
| `on:start` | `action` |  | Navigation started - payload { url, surface }. |
| `origin` | `string` |  |  |
| `path` | `string` | `/` |  |
| `src` | `url` |  |  |

Every element also carries the [universal attributes](/components/attributes): accessibility, animation, `class`, `style` and the platform suffixes.

## Events

| Event | Handler |
|---|---|
| `commit` | `on:commit="..."` |
| `fail` | `on:fail="..."` |
| `finish` | `on:finish="..."` |
| `message` | `on:message="..."` |
| `start` | `on:start="..."` |

A payload arrives FLAT in the handler scope, so a declared action names the key bare (`message="message"`), never through an `event` plane.

## Platform notes

| Renderer | Grammar | What that means |
|---|---|---|
| web | `partial` | a renderer exists and is narrower than the reference in the ways listed below |
| ios | `reference` | the reference renderer this element is specified against |
| android | `module-facet` | filled by the module facet when that module is registered |
| desktop | `unavailable` | the desktop build bundles no runtime for it and answers with a typed refusal |

The rich Web twin provides a policy-constrained iframe, lifecycle events, named controls, safe URL schemes, and ephemeral isolation.

**Known limits on the web**

- Script/call/set/css controls require same-origin access.
- Browser sandbox and storage behavior cannot duplicate WKWebView process/data-store guarantees.

**Fallback.** Mounts the functional policy-constrained iframe (lifecycle events, named controls, safe URL schemes, ephemeral isolation); cross-origin script controls are inert rather than throwing.

**Implementation notes.** The bare web-surface primitive - NO bridge by construction (web-surface-policy.md).

Declared platforms: `ios`, `android`.

**Adaptivity (web, 2026-08-18).** Pure fill-its-container embed host: the embedded document owns presentation at every width; the host declares no phone/tablet/desktop variance of its own (OpenSource/Engine/TypeScript/support/element-support.json WebView row).

## Theming

DSX has one styling vocabulary and it is CSS. Three doors reach this element, and they differ only in how often the look repeats: `style="..."` for a declaration list on one element, `class="..."` for a name declared in a `<style>` block, and the component's own sheet for everything a whole screen shares.

On the web this element's root carries `dsx-webview`, the stable class the contract application CSS targets. It is a rendering fact you can read, not a styling hook to depend on: style the element, not the class the renderer stamps.

Web runtime: `rich`.

## Accessibility

| Renderer | Audited | Dated | Evidence |
|---|---|---|---|
| web | yes | 2026-08-18 | iframe carries title='Web content' + policy sandbox attrs; axe 0 serious/critical on the chrome family page light + dark-390 |
| ios | review | 2026-08-18 | WKWebView exposes the page's accessibility tree (WebKit-owned); NO bridge by construction is a security posture, not an a11y surface; the component adds no native chrome. ClosedSource/DSX/Modules/Core/WebView/Components/Views/WebView/swift/WebView.swift. Verified-by-review; the visual capture awaits the iOS capture lane. |
| android | review | 2026-08-18 | VERIFIED-BY-REVIEW: the platform android.webkit.WebView exposes the loaded page's own web accessibility tree; the component adds no chrome (WebViewComponent.kt - no bridge, no controls by construction). |
| desktop | unaudited | unaudited | none recorded |

Every element carries `a11yLabel`, `a11yHint`, `a11yValue`, `a11yTrait`, `a11yGroup` and `a11yHidden`. A control that draws an icon beside text is one group with one label, never two announcements; see the [universal attributes](/components/attributes).

This page is GENERATED by ClosedSource/scripts/generate_component_docs.rb. A hand edit here is overwritten on the next run by design: fix the ledger instead (the attribute and event contract in `OpenSource/Documentation/reference/stack-elements.json`, the platform support and the audit in `OpenSource/Conformance/library/matrix.json`, the description and the web limits in `OpenSource/Engine/TypeScript/support/element-support.json`, the specimen in `OpenSource/Catalog`).

