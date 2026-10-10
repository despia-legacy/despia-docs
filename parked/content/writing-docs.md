---
title: Writing docs
description: The authoring system, markdown plus components, documented with itself.
order: 3
section:
---

# Writing docs

Every page of this site is a markdown file in the content tree. The compiler turns each file into a real DSX page: prose renders through the runtime's markdown element, and any line-anchored Capitalized tag becomes a real component in the generated document. That is the whole authoring model, and this page is written with it: every component below is rendered live by itself.

Three properties fall out of the design:

- **Components are first-class.** A component block in markdown is not a transform trick; it is emitted as a DSX node, so the full component model (attributes, slots, nesting) applies.
- **Markdown stays data.** Prose travels into the runtime element as a value, never as executed markup. Raw HTML in prose renders as text, and code examples keep their braces literally.
- **Agents read what you wrote.** Every page serves its source verbatim at the sibling `/md` path, component tags included, and `llms.txt` indexes the lot.

## Front matter

A page may open with a `---` block of `key: value` lines. Everything is optional; a missing title falls back to the first heading, and the route falls back to the file path.

| Key | What it does |
|---|---|
| `title` | The page title (h1s stay in the body; this names the route and the nav). |
| `description` | Meta description; also the card line in search and section indexes. |
| `order` | Sort rank inside its nav section (default 1000). |
| `section` | Nav section id; empty means the Start section, path-derived otherwise. |
| `route` | Explicit route override; derived from the file path when absent. |

## Code blocks

Fenced code gets full syntax tinting, and every block carries a copy button: it floats on the corner of a bare block (hover to reveal on a fine pointer, always visible on touch) and sits in the header bar of a titled one. Adding `title="..."` after the language renders that header bar, with a language chip and the file name:

```ts title="lib/greet.ts"
export function greet(name: string): string {
  return "Hello, " + name
}
```

The fence meta grammar is deliberately small:

~~~md
```ts title="lib/greet.ts"
export function greet(name: string): string { ... }
```
~~~

`title` is the only meta key. An unknown key fails the build with the file and line, so a typo can never silently drop a header.

## Callouts

Five kinds, one anatomy: a hairline box, a kind icon, an optional title, markdown body. The hue stays in the icon and the border; the words stay neutral.

<Note>A plain note. The quiet kind, for asides that should not shout.</Note>

<Info title="Heads up">
Info rides the accent. Body content is ordinary markdown, so `code`, **emphasis** and [links](/quickstart) all work.
</Info>

<Tip>Tips are green. Use them for the shortcut a reader would thank you for.</Tip>

<Warning>Warnings are amber: sharp edges, migrations, things that bite.</Warning>

<Danger title="Irreversible">Danger is for destructive actions with no undo.</Danger>

Authored exactly as they read, as line-anchored tags:

```md
<Note>A plain note. The quiet kind, for asides that should not shout.</Note>

<Info title="Heads up">
Body content is ordinary markdown, so `code`, **emphasis** and links all work.
</Info>
```

`Note`, `Info`, `Tip`, `Warning` and `Danger` are sugar for `<Callout kind="...">`; the long form takes the same `title`.

## Cards

A `Card` links a title (and optional icon) to a route; a `CardGroup` lays cards on a responsive grid, `cols="2"` or `cols="3"`, collapsing to one column on narrow frames.

<CardGroup cols="2">
<Card title="Quickstart" icon="bolt.fill" href="/quickstart">
From an empty directory to a running DSX app.
</Card>
<Card title="Design system" icon="sparkles" href="/system">
Every element of the system, rendered live in its states.
</Card>
<Card title="The window.dsx API" icon="globe" href="/framework/guides/despia-api">
The page-side surface: promises in, events back.
</Card>
<Card title="Combination matrix" icon="rectangle.stack.fill" href="/framework/guides/combinations">
Every way the runtime, web view and backend compose.
</Card>
</CardGroup>

```md
<CardGroup cols="2">
<Card title="Quickstart" icon="bolt.fill" href="/quickstart">
From an empty directory to a running DSX app.
</Card>
<Card title="Design system" icon="sparkles" href="/system">
Every element of the system, rendered live in its states.
</Card>
</CardGroup>
```

The icon is any name from the system icon set; with `href` the whole card is the link.

## Steps

A `Steps` block numbers its `Step` children down a rail. Steps nest full markdown, fences included.

<Steps>
<Step title="Scaffold the app">
One command; the scaffold is a complete DSX package.

```sh
npm create dsx@latest my-app
```
</Step>
<Step title="Run it">
`dsx dev` builds, serves, watches and reloads.

```sh
npx dsx dev
```
</Step>
<Step title="Ship it">
`dsx build` compiles the deployable web build; the [combination matrix](/framework/guides/combinations) maps everything else.
</Step>
</Steps>

```md
<Steps>
<Step title="Scaffold the app">
One command; the scaffold is a complete DSX package.
</Step>
<Step title="Run it">
Body markdown, fences included.
</Step>
</Steps>
```

## Tabs

`Tabs` holds `Tab` panes; the strip is the runtime's own tabs primitive, so selection, arrow keys and ARIA wiring come from the system, not from this site.

<Tabs>
<Tab title="npm">
```sh
npm create dsx@latest my-app
```
</Tab>
<Tab title="pnpm">
```sh
pnpm create dsx my-app
```
</Tab>
<Tab title="bun">
```sh
bun create dsx my-app
```
</Tab>
</Tabs>

```md
<Tabs>
<Tab title="npm">
Any markdown.
</Tab>
<Tab title="pnpm">
Any markdown.
</Tab>
</Tabs>
```

## Code groups

A `CodeGroup` takes only fenced blocks and shares one header bar between them: each fence becomes a tab, named by its `title` (or its language), with one copy button for whichever pane is open.

<CodeGroup>
```ts title="counter.ts"
let count = 0
export function bump(): number {
  count += 1
  return count
}
```
```swift title="Counter.swift"
var count = 0
func bump() -> Int {
  count += 1
  return count
}
```
```kotlin title="Counter.kt"
var count = 0
fun bump(): Int {
  count += 1
  return count
}
```
</CodeGroup>

~~~md
<CodeGroup>
```ts title="counter.ts"
let count = 0
```
```swift title="Counter.swift"
var count = 0
```
</CodeGroup>
~~~

## Accordions

`AccordionGroup` joins system `Accordion` disclosures on one card. The accordion itself is the design system component, dogfooded straight from markdown.

<AccordionGroup>
<Accordion title="Why line-anchored tags?">
A component tag must start its own line. Inline angle brackets in prose stay prose, so writing about `<stack>` or pasting example markup in a sentence never triggers the compiler.
</Accordion>
<Accordion title="What about code examples?">
Fenced code is never scanned for tags. Any component markup inside a fence renders as text, which is how the examples on this very page are shown.
</Accordion>
<Accordion title="Where do errors surface?">
At build time, loudly. An unknown tag, an unclosed block or a bad fence meta key fails the compile with the file and line.
</Accordion>
</AccordionGroup>

```md
<AccordionGroup>
<Accordion title="Why line-anchored tags?">
Body markdown.
</Accordion>
<Accordion title="What about code examples?">
Body markdown.
</Accordion>
</AccordionGroup>
```

## Frames

A `Frame` mounts media on a hairline card with an optional caption.

<Frame caption="The Despia mark, served from this site's own build.">
![The Despia app icon](/icon.svg)
</Frame>

```md
<Frame caption="The Despia mark, served from this site's own build.">
![The Despia app icon](/icon.svg)
</Frame>
```

## Custom components

The component set is open. Any `.dsx` file at the site's `Components/` root is addressable from markdown by its file name, with attributes passed through verbatim and inner markdown compiled into its default slot:

```xml title="Components/Signature.dsx"
<hstack class="doc-signature">
  <head>
    <attribute as="name" default="''"/>
  </head>
  <text value="{{ dsx.attribute.name }}"/>
  <slot/>
</hstack>
```

```md
<Signature name="The docs team">
Anything here lands in the slot.
</Signature>
```

Three rules keep the system honest:

1. **Tags are line-anchored and Capitalized.** The open tag starts a line and closes on that line; the closing tag stands on its own line (or the whole block sits on one line).
2. **Unknown names fail the build.** The compiler resolves every tag against the component set and stops with the file and line for anything it does not know. A typo is a build error, never silent output.
3. **Attributes are XML.** Values are double-quoted; write `&amp;` for a literal ampersand, exactly as in any DSX document.
