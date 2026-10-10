---
title: Attributes are data
description: An attribute carries data into an element or a component. The look is always CSS, so every attribute you see means something about the data.
---

DSX keeps two things apart: what an element is about, and how it looks. Attributes say what it is about. CSS says how it looks.

```dsx fragment
<button label="Save draft" icon="tray.and.arrow.down" on:tap="dsx.action.save()" style="padding: 8px 14px"/>
```

`label`, `icon` and `on:tap` are data: the words, the symbol, what happens. `padding` is presentation, so it is CSS.

## Why it matters

- **One place for the look.** Every visual change is a CSS change, in a sheet or a `style` attribute. Nobody hunts for a colour hidden in an attribute.
- **Agents change the right thing.** An agent that edits the look edits CSS; one that edits the content edits attributes. The two never collide.
- **The same everywhere.** Standard CSS means the same declaration on iOS, Android and the web.

## Declaring the attributes a component accepts

A component lists the attributes it accepts in its head. Each has a name and a default:

```dsx title="Components/Badge.dsx"
<stack class="badge">
  <head>
    <attribute as="label" default="'New'"/>
    <attribute as="count" default="0"/>
    <style>
      .badge { padding: 2px 8px; border-radius: 999px; background: var(--dsx-accent); }
      .label { font-size: 12px; font-weight: 600; color: white; }
    </style>
  </head>
  <text class="label" value="{{ dsx.attribute.label }}"/>
</stack>
```

The default is an expression, so a text default keeps its quotes: `default="'New'"`. A number is `default="0"`.

Whoever uses the component passes values the same way they would to a built-in element:

```dsx fragment
<Badge label="Beta"/>
<Badge label="{{ dsx.variable.unread }} new"/>
```

Inside the component, `dsx.attribute.label` reads the value. When the caller's value changes, the component updates.

## When the look depends on data

Keep the data in an attribute and let CSS decide the look. Toggle a class from state with `class:`:

```dsx fragment
<text class="status" class:late="dsx.this.overdue" value="{{ dsx.this.title }}"/>
```

```css
.status.late { color: #d70015; }
```

The attribute says the item is overdue. The sheet says what overdue looks like.

## What lint enforces

`despia lint` refuses the retired styling attributes (`padding`, `spacing`, `radius`, `background`, `fontSize`, `fontWeight` and the rest) with an error that names the CSS to write at that exact value. A style attribute fails the build, so it never reaches a user.
