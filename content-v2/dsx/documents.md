---
title: Pages and components
description: A .dsx document is one screen or one component, with its markup, its CSS and its logic in a single file.
---

Everything you build in DSX is a document: a file in `Components/` with one root element. A document that a route points at is a page. A document you use as a tag inside another one is a component. They are the same thing.

## The parts of a document

```dsx title="Components/Profile.dsx"
<stack class="profile">
  <head>
    <attribute as="name" default="'Ada'"/>
    <variable as="following">return false</variable>
    <action as="follow">
      dsx.variable.following = !dsx.variable.following;
    </action>
    <style>
      .profile { gap: 12px; padding: 24px; }
      .name { font-size: 22px; font-weight: 600; }
    </style>
  </head>
  <text class="name" value="{{ dsx.attribute.name }}"/>
  <button label="{{ dsx.variable.following ? 'Following' : 'Follow' }}" on:tap="dsx.action.follow()"/>
</stack>
```

- **The root element** is the outermost tag, here `<stack>`. A document has exactly one.
- **The head** declares what the document has: attributes it accepts, variables it keeps, formulas it derives, actions it runs, and its `<style>` sheet. It renders nothing.
- **The body** is the elements after the head. Built-in elements are lowercase (`stack`, `text`, `button`); components are capitalised (`Card`, `TrailRow`).
- **Holes** are `{{ }}` inside an attribute value. What is inside is an expression that reads state.
- **Code bodies** are the JavaScript inside `<variable>`, `<formula>` and `<action>`.

The head reads top to bottom in a fixed order: attributes, context, events, then data (APIs and variables), formulas, actions, and the style sheet last. `despia lint` tells you when a row is out of place.

## Escaping

A document is XML, so `&`, `<` and `>` are written `&amp;`, `&lt;` and `&gt;` in attribute values and in code bodies. `a && b` becomes `a &amp;&amp; b`; `count < 3` becomes `count &lt; 3`.

## Pages

A page is a document a route points at. Routes live in `dsx.config.json`:

```json title="dsx.config.json"
{
  "entry": "myapp.App",
  "routes": [
    { "path": "/", "component": "myapp.App", "meta": { "title": "Home" } },
    { "path": "/profile", "component": "myapp.Profile", "meta": { "title": "Profile" } }
  ]
}
```

The component name is your project's command, a dot, and the file name. `npx despia create Profile --route /profile` writes the document and its route together. [Navigation](/dsx/navigation) covers moving between pages.

## Components

Any document in `Components/` is also a tag. `Components/TrailRow.dsx` is used as `<TrailRow/>`. The file name is the tag name.

```dsx title="Components/TrailRow.dsx"
<pressable class="row" on:tap="dsx.event('open')">
  <head>
    <attribute as="name" default="''"/>
    <attribute as="distance" default="''"/>
    <event as="open"/>
    <style>
      .row { flex-direction: row; justify-content: space-between; padding: 12px 16px; }
      .distance { color: var(--dsx-secondary-label); }
    </style>
  </head>
  <text value="{{ dsx.attribute.name }}"/>
  <text class="distance" value="{{ dsx.attribute.distance }}"/>
</pressable>
```

A component talks to the page that uses it in two directions:

- **Data goes down** through attributes. `<TrailRow name="Ridge loop"/>` sets `dsx.attribute.name` inside the component.
- **Events go up.** The component raises `dsx.event('open')`; the page listens with `on:open="..."`.

```dsx title="Components/Trails.dsx"
<stack>
  <head>
    <variable as="opened">return ''</variable>
  </head>
  <TrailRow name="Ridge loop" distance="6 km" on:open="dsx.variable.opened = 'Ridge loop'"/>
  <TrailRow name="Lake path" distance="3 km" on:open="dsx.variable.opened = 'Lake path'"/>
  <text value="{{ dsx.variable.opened }}"/>
</stack>
```

## Slots

A component that wraps content renders the caller's children where it places `<slot/>`. The children keep the caller's data, so they can read the caller's variables.

```dsx fragment
<Card title="Today">
  <vstack style="gap: 8px">
    <text value="Ridge loop"/>
    <text value="Lake path"/>
  </vstack>
</Card>
```

A wrapper has one slot, and you arrange what goes in it with a stack. A second, named slot exists only for a region a stack cannot place, named for where it sits: `leading`, `trailing`, `top`, `bottom`, `center`, `accessory` or `overlay`. A child fills it with `slot="trailing"`.

## Built-in components

DSX ships a set of components every project can use without adding anything: `Card`, `ListGroup`, `SettingsRow`, `EmptyState`, `Callout`, `LinkCard`, `Steps`, `Timeline`, `CopyButton` and many more. [Native UI](/dsx/native-ui) lists the elements and components by what they are for.

## Next

::: cards
- [Data and state](/dsx/data) {curlybraces} Variables, formulas, actions, lists and APIs.
- [Styling is CSS](/dsx/styling) {paintbrush} The `<style>` sheet, classes and tokens.
:::
