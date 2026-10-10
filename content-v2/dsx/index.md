---
title: What is DSX
description: DSX is Despia's framework for real native apps. One document per screen, one API on every platform, and a structure AI agents can operate.
---

DSX is how you build an app with Despia V4. A screen is a `.dsx` document: its markup, its CSS and its logic in one file. The same documents run on iOS, Android and the web, and native features come from packages you call through `dsx.module`.

```dsx title="Components/Counter.dsx"
<stack class="counter">
  <head>
    <variable as="count">return 0</variable>
    <action as="add">
      dsx.variable.count = dsx.variable.count + 1;
      await dsx.module.haptic.light();
    </action>
    <style>
      .counter { gap: 12px; padding: 32px; align-items: center; }
      .count { font-size: 48px; font-weight: 600; }
    </style>
  </head>
  <text class="count" value="{{ dsx.variable.count }}"/>
  <button label="Add one" on:tap="dsx.action.add()"/>
</stack>
```

That is a whole screen. Tapping the button adds one to the count, the text shows it, and the phone gives a light tap through its own vibration hardware.

## One document, three languages

Each part of a document is a language you already know:

| Part | Language | What it does |
| :-- | :-- | :-- |
| Elements and attributes | Markup | The structure: `stack`, `text`, `button` and your own components |
| `<style>` and `style=` | Standard CSS | The look. There are no styling attributes |
| Code bodies and `{{ }}` holes | JavaScript | State, actions and calls to native features |

Attributes carry data, never presentation. A colour, a padding or a radius is always CSS, so a designer, a developer and an agent all change the look in the same place.

## The model in six ideas

DSX keeps the number of ideas small, so the model still reads clearly when the app gets large.

- **State.** Variables hold values; formulas derive new values from them. The screen updates when they change.
- **Actions.** Named pieces of code that change state or call native features.
- **Components.** Your own elements, built from documents, used like any other element.
- **Slots.** The places a component lets its user put content.
- **Context.** Values a component provides to everything inside it.
- **Packages.** Native features, called as `dsx.module.<package>.<action>()`.

## Native on every platform

DSX is not a web view around a website. Native features run through the platform's own SDKs, maintained in packages, and each package says on which platforms it works. One call works the same everywhere it is supported:

```js
await dsx.module.haptic.success();
```

::: note Where DSX is today
Despia V4 0.0.2 renders DSX documents with the DSX DOM on iOS, Android and the web. Rendering with the platform's own UI toolkits (SwiftUI and Jetpack Compose) is in alpha and reaches production with DSX 1.0.0.
:::

## Built for AI agents

A DSX app is a structure, not only text. The grammar is closed, `despia lint` checks every document, and every package has a known contract. An agent works through the `despia` CLI and its MCP server, and the project refuses a change that breaks the model before it lands.

::: cards
- [Quickstart](/dsx/quickstart) {bolt} Scaffold an app, run it, change it and build it.
- [Pages and components](/dsx/documents) {doc.plaintext} How a document is put together.
- [Native features](/dsx/packages) {shippingbox} Add a package and call it from any page.
- [Use Despia with your AI agent](/dsx/agents) {sparkles} Connect mcp.despia.com and install the skills.
:::
