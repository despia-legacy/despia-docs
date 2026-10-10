---
title: Styling is CSS
description: The look of a DSX app is standard CSS, in a style attribute, a sheet in the head, or a sheet beside the component. There are no styling attributes.
---

You style DSX with the CSS you already know. `padding`, `gap`, `color`, `border-radius`, `font-size`, flexbox and grid all work, on iOS, Android and the web. An unknown property or a malformed value is a build error, never a silent no-op.

## Where styles live

From weakest to strongest:

| Place | Use it for |
| :-- | :-- |
| Tokens in `:root` | App-wide values: your accent colour, radii, your own spacing scale |
| A `<style>` sheet in the head, or `Name.css` beside `Name.dsx` | A look you reuse, written as classes |
| `style="…"` on the element | The genuinely one-off |

When the same class exists at several layers, the nearest scope wins. There is no specificity arithmetic to reason about.

```dsx title="Components/Plan.dsx"
<stack class="plan">
  <head>
    <attribute as="name" default="'Pro'"/>
    <attribute as="price" default="'$9'"/>
    <style>
      .plan { gap: 4px; padding: 20px; border-radius: 16px; background: var(--dsx-secondary-grouped-background); }
      .name { font-size: 17px; font-weight: 600; }
      .price { font-size: 34px; font-weight: 700; color: var(--dsx-accent); }
    </style>
  </head>
  <text class="name" value="{{ dsx.attribute.name }}"/>
  <text class="price" value="{{ dsx.attribute.price }}"/>
  <text value="per month" style="color: var(--dsx-secondary-label)"/>
</stack>
```

## Layout is flexbox

Every element is a flex box. `<stack>` is the general container: a column by default, a row with `flex-direction: row`, a grid with `display: grid` and real tracks.

```dsx fragment
<stack style="flex-direction: row; column-gap: 1rem; align-items: baseline">
  <text value="32" style="font-size: 2rem"/>
  <text value="pt tall"/>
</stack>
```

On `<stack>` the defaults are the web's: no gap unless you set one, and `align-items` decides cross-axis alignment. `justify-content`, `flex-grow`, `*-reverse` and `position: absolute` children all lay out as they do in a browser.

Each axis has three sizing modes: fixed (`width: 120px`), fill (`flex-grow`, a percentage) and hug, the default, which fits the content.

## Design tokens

The platform's colours, radii and type come from `--dsx-*` custom properties. Use them by reference so your app follows light and dark mode and the platform's look:

```css
.card { background: var(--dsx-secondary-grouped-background); border-color: var(--dsx-separator); }
.hint { color: var(--dsx-secondary-label); }
```

To restyle every built-in control at once, re-pin a token in `:root`. To give your own sheets a shared value, declare a new property next to it:

```css
:root {
  --dsx-accent: #0a84ff;
  --dsx-radius-card: 14px;
  --pad: 1rem;
}
@media (prefers-color-scheme: dark) {
  :root { --dsx-accent: #4da3ff; }
}
```

Re-pinning a `--dsx-*` name restyles the controls that read it. A name you invent styles only what you write with it.

## Light and dark

The semantic tokens (`--dsx-label`, `--dsx-secondary-label`, `--dsx-background`, `--dsx-grouped-background`, `--dsx-separator`, `--dsx-accent`) already have a light and a dark value. Use them and dark mode works with nothing else to write. For your own colours, add a `@media (prefers-color-scheme: dark)` block.

## Component knobs

A component can expose a setting to whoever uses it as a custom property. Built-in components do this already: `<Card>` reads `--dsx-card-` properties for its background, radius and padding. Set one inline where you use the component:

```dsx fragment
<Card title="Today" style="--dsx-card-border-radius: 8px"/>
```

Custom properties inherit, so a knob set on a parent reaches every component inside it.

## No styling attributes

Presentation never rides on an attribute. There is no `padding="12"`, `spacing=`, `radius=` or colour word. If you write one, `despia lint` fails with the exact CSS to write instead:

| Do not write | Write |
| :-- | :-- |
| `padding="12"` | `style="padding: 12px"` |
| `spacing="8"` | `style="gap: 8px"` |
| `radius="10"` | `style="border-radius: 10px"` |
| `background="secondary"` | `style="background: var(--dsx-secondary-background)"` |

This keeps one place for the look, so a designer, a developer and an agent all change it the same way. See [Attributes are data](/dsx/attributes).
