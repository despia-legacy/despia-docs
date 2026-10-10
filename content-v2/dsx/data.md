---
title: Data and state
description: Variables hold values, formulas derive them, actions change them, and the screen follows. Lists, inputs, APIs and app-wide state work the same way.
---

State in DSX is declared in a document's head and read anywhere in its body. When a value changes, every place that reads it updates. You never update the screen by hand.

## The four rows

| Row | Read as | What it is |
| :-- | :-- | :-- |
| `<attribute as="x" default="…"/>` | `dsx.attribute.x` | A value passed in by whoever uses the component |
| `<variable as="x">return …</variable>` | `dsx.variable.x` | A value this document owns and can change |
| `<formula as="x">return …</formula>` | `dsx.formula.x` | A value computed from other values |
| `<action as="x">…</action>` | `dsx.action.x()` | Code that runs on an event: it changes state or calls native features |

```dsx title="Components/Today.dsx"
<scroll>
  <head>
    <variable as="habits">
      return [
        { id: 'h1', name: 'Read 20 pages', done: true },
        { id: 'h2', name: 'Walk 8,000 steps', done: false },
        { id: 'h3', name: 'Lights out by 11', done: false }
      ];
    </variable>
    <formula as="percent" input:list="dsx.variable.habits">
      const done = list.filter((h) => h.done).length;
      return list.length === 0 ? 0 : Math.round(done / list.length * 100);
    </formula>
    <action as="toggle" input:id="dsx.this.id">
      dsx.variable.habits = dsx.variable.habits.map((h) =>
        h.id === id ? { ...h, done: !h.done } : h);
    </action>
    <style>
      .page { padding: 20px; gap: 16px; }
      .row { padding: 16px; }
    </style>
  </head>
  <vstack class="page">
    <text value="{{ dsx.formula.percent }}% done"/>
    <list bind="dsx.variable.habits" key="id">
      <pressable on:tap="dsx.action.toggle({ id: dsx.this.id })">
        <text class="row" value="{{ dsx.this.done ? 'Done: ' : '' }}{{ dsx.this.name }}"/>
      </pressable>
    </list>
  </vstack>
</scroll>
```

## Variables

A variable's body is code that returns its first value. Change it by assigning to it from an action or an event handler:

```dsx fragment
<button label="Reset" on:tap="dsx.variable.count = 0"/>
```

A variable marked `computed="true"` recomputes its body whenever what it reads changes, like a formula.

## Formulas

A formula derives a value and never changes anything. Name its inputs with `input:` attributes, and the body reads them as plain names. The result is recomputed only when an input changes, which keeps large screens fast.

## Actions

An action is the only place that changes state in response to something. Call it from an event attribute such as `on:tap`, and pass values in the call: `dsx.action.toggle({ id: dsx.this.id })`. Inside the action, the `input:id` attribute gives you `id`.

Actions can be `async`, `await` native calls, and raise events with `dsx.event('name')`. Keep handlers in markup short: one call to an action is the usual shape.

## Holes

`{{ }}` inside an attribute value is an expression. `value="{{ dsx.variable.count }}"` shows the value; `value="Tapped {{ dsx.variable.count }} times"` mixes text and a hole. Any attribute takes a hole.

A few attributes take a bare expression with no braces, because they name a place or a list rather than a value: `bind`, `repeat`, `visible-if`, `disabled-if`.

## Lists

`<list bind="…" key="id">` draws its child once per row. Inside the row, `dsx.this` is the current row: `dsx.this.name`, `dsx.this.index` for its position. `key` names the field that identifies each row, so the list keeps its place when rows move.

Any element can repeat on its own with `repeat=`, without a list container:

```dsx fragment
<text repeat="dsx.variable.tags" key="index" value="{{ dsx.this.value }}"/>
```

Use `<list>`, `<grid>` or `<pager>` when you want the container's behaviour: scrolling windows over long data, swipe actions, sections.

## Showing and hiding

`visible-if` takes an expression. The element is there only while it is true:

```dsx fragment
<text value="All done" visible-if="dsx.formula.percent === 100"/>
```

## Inputs

Input controls write back to state through `bind`. The value and the field stay in step both ways:

```dsx title="Components/Signup.dsx"
<stack style="gap: 12px; padding: 24px">
  <head>
    <variable as="email">return ''</variable>
    <variable as="news">return true</variable>
  </head>
  <textfield bind="dsx.variable.email" placeholder="you@example.com" keyboard="email"/>
  <toggle bind="dsx.variable.news" label="Send me news"/>
  <text value="{{ dsx.variable.email }}"/>
</stack>
```

## Data from a server

An `<api>` row loads JSON and exposes it as `dsx.api.<name>`, with `.data`, `.loading` and `.error`:

```dsx title="Components/Orders.dsx"
<stack style="gap: 8px; padding: 20px">
  <head>
    <api as="orders" url="/api/orders"/>
  </head>
  <spinner visible-if="dsx.api.orders.loading"/>
  <text value="Could not load your orders." visible-if="dsx.api.orders.error"/>
  <list bind="dsx.api.orders.data" key="id">
    <text value="{{ dsx.this.title }}"/>
  </list>
</stack>
```

## App-wide state

`dsx.global` is one store shared by every screen, the native side and any web content in the app. Read it in markup as `{{ dsx.global.session.credits }}`. Use it for the session, feature flags and anything several screens must agree on. Keep screen-only state in variables.

## Next

::: cards
- [Navigation](/dsx/navigation) {globe} Routes, stacks, sheets and deep links.
- [Native features](/dsx/packages) {shippingbox} Call packages from actions.
:::
