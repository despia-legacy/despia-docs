---
name: structuring-dsx-apps
description: "Where DSX state goes and when one document has become two: local state in the head, attributes down and events up at every boundary, a declared context key for state a subtree shares, dsx.global only for what has no mount tree, every api's loading, empty and error faces, the context, state, loop and api-face lint rules with their levels, and measuring a document with despia describe and despia graph state --names. Use before adding state, before sharing a value between components, and before splitting or growing a document."
---

<!-- GENERATED from OpenSource/Skills/structuring-an-app.md in despia-native/despia.
     Edit the source, then: ruby ClosedSource/scripts/generate_agent_skills.rb -->

# Structuring an app: three layers, and when to split a document

> Audience: app authors writing `.dsx`. This is the layering skill - WHICH state goes
> WHERE, and when one document has become two. The markup hygiene rules are
> [`dsx-best-practices.md`](https://docs.despia.com/framework/skills/dsx-best-practices); the app-wide store is
> [`global-state.md`](https://docs.despia.com/framework/skills/global-state); the props/state split at one boundary is
> [`component-props-and-state.md`](https://docs.despia.com/framework/skills/component-props-and-state).
>
> The decision this document teaches is
> [`architecture/adr/0013-context.md`](https://github.com/despia-native/despia/blob/main/OpenSource/Documentation/architecture/adr/0013-context.md).

Every mature UI framework converged on the same three layers. DSX has all three, and the
third one - the ambient layer - is the one authors get wrong, because for a long time the
only thing in it was one undeclared global bag.

| Layer | Spelling | Reach | Use for |
|---|---|---|---|
| **Local** | `<variable>`, `<formula>`, `<action>` in the head | this document | a flag, a draft, a derivation, this file's own logic |
| **Boundary** | `<attribute as= default=>` down, `<event as= payload=>` up | one hop, parent to child | what the parent CHOSE for this instance; what the child tells the parent |
| **Ambient** | `<context as=>` provides, `<context from= use=>` consumes | every descendant of the provider, at any depth | state a whole subtree shares: the session, the cart, the board, the editor's selection |
| **App-wide** | `dsx.global.<key>` | the whole app, including the web layer and route guards | auth, entitlements, theme, flags - and anything a `<server>`, a `<cli>` or a route guard must read |

**Use the smallest layer that fits, and go up only when the layer below cannot reach.**

---

## 1 · Local state stays in the head

State one document owns, initialises and mutates is a `<variable>`. A value that FOLLOWS
from other state is `computed="true"` or a `<formula>`, never a `<watch>` that maintains it.
Nothing else is a decision.

```dsx
<stack>
  <head>
    <variable as="draft">return ''</variable>
    <variable as="clean" computed="true">return dsx.variable.draft == ''</variable>
    <action as="clear">dsx.variable.draft = ''</action>
  </head>
  <vstack>
    <field bind="dsx.variable.draft"/>
    <button visible-if="dsx.variable.clean == false" on:tap="dsx.action.clear()">Clear</button>
  </vstack>
</stack>
```

If a value is read by exactly one document, it belongs here and nowhere else. Moving it up a
layer "in case someone needs it" is how a head reaches six hundred variables.

### A set of flags is one mode, and the head says what shape a name holds

When two or more booleans of one document are never true together, and every write of one clears
the others, they are ONE value with a closed set: write it as a mode, a `<variable>` whose
`type=` is a union of string literals, with its legal transitions in `moves=`.

```dsx
<stack>
  <head>
    <variable as="panel" type="'none' | 'filters' | 'share'" moves="none>filters none>share filters>none share>none">return 'none'</variable>
  </head>
  <vstack>
    <button visible-if="dsx.variable.panel == 'none'" on:tap="dsx.variable.panel = 'filters'">Filters</button>
    <sheet visible-if="dsx.variable.panel == 'filters'" on:dismiss="dsx.variable.panel = 'none'"><text value="Filters"/></sheet>
    <sheet visible-if="dsx.variable.panel == 'share'" on:dismiss="dsx.variable.panel = 'none'"><text value="Share"/></sheet>
  </vstack>
</stack>
```

The linter then refuses a value outside the set, a comparison that can never be true and a move
`moves=` does not name, and `despia graph state --names` prints the mode as its values, its moves
and the faces each value draws. `type=` works the same way on any head declaration
(`type="number"`, `type="{ id: string }[]"`), and a typed declaration with no `sample=` has one
derived from its shape. The grammar, the ten rules and the verbs are
[`typing-declarations.md`](https://docs.despia.com/framework/skills/typing-declarations).

## 2 · Attributes down and events up at EVERY boundary

An attribute is read-only inside the component; the component talks back with `dsx.event` and
the caller wires `on:<name>`. This is the whole contract of one hop, and it is the right tool
when the value is **this instance's**: what the parent chose for this card, this row, this
field.

```dsx
<stack>
  <head>
    <attribute as="title" default="''"/>
    <event as="chose"/>
  </head>
  <pressable on:tap="dsx.event('chose')">
    <text value="{{ dsx.attribute.title }}"/>
  </pressable>
</stack>
```

The rule holds at every boundary, including the ones a split creates. What it is NOT good at
is the same value reaching four levels down: see rule 4.

## 3 · Context is for state declared once where its consumers meet

A **provider** declares a context KEY in its head and enrols declarations under it. A
**consumer**, at any depth below, declares what it takes. Nothing in between declares
anything.

```dsx
<stack>
  <head>
    <context as="session"/>
    <variable as="user" context="session" sample='{"id": "u1"}'>return null</variable>
    <variable as="cart" context="session">return []</variable>
    <formula as="cartCount" context="session">return dsx.variable.cart.length</formula>
    <action as="addToCart" context="session" input:id="dsx.this.id">
      dsx.variable.cart = dsx.variable.cart.concat([{ id: id, qty: 1 }])
    </action>
    <action as="signOut" context="session">dsx.variable.user = null</action>
  </head>
  <vstack>
    <slot/>
  </vstack>
</stack>
```

The key is a **string**, the way a component name is: serialisable, package-qualifiable,
refactorable by rename. It is never a component name - a package component can never name a
component it has not seen, which is the direction a name-addressed design cannot express at
all. A key that crosses a package boundary is scheme-prefixed: `payments.checkout`.

A consumer four levels down reads it as though it were local:

```dsx
<stack>
  <head>
    <attribute as="product" default="null"/>
    <context from="session" use="user cartCount addToCart"/>
  </head>
  <vstack>
    <text value="{{ dsx.context.cartCount }} in cart"/>
    <button visible-if="dsx.context.user != null"
            on:tap="dsx.context.addToCart({ id: dsx.attribute.product.id })">Add</button>
  </vstack>
</stack>
```

Read the plane exactly as you read a local declaration: a variable reads reactively, a
formula is a value, an action is called with its inputs. **Reads and calls only.**

**An `<api>` enrols its ENVELOPE, read only.** `context="<key>"` on an `<api>` puts the whole
envelope under the key, the way it puts a `<variable>` there, so a descendant reads the
provider's `loading`, `error`, `data` and `status` with no forwarding formula in between. The
fetch stays the provider's: enrol an `<action>` that calls the api, and call that.

```dsx
<!-- the provider -->
<head>
  <context as="canvas.session"/>
  <api as="head" context="canvas.session" url="/__dsx/head"/>
  <action as="refresh" context="canvas.session">dsx.api.head()</action>
</head>

<!-- a consumer, any depth below -->
<head>
  <context from="canvas.session" use="head refresh"/>
</head>
<vstack>
  <text visible-if="dsx.context.head.loading" value="Reading the head"/>
  <text visible-if="dsx.context.head.error != null" value="{{ dsx.context.head.error.body.message }}"/>
  <button label="Reload" on:tap="dsx.context.refresh()"/>
</vstack>
```

`use=` names the api's `as`, never a path into it: `use="head.loading"` is
`context-unknown-name`. `dsx.context.head()` and `dsx.context.head.cancel()` are refused as
writes (`context-write`): an invoke moves the provider's envelope, and ownership stays with the
provider. The api's `on:success` and `on:error` run in the provider, never in a consumer. The
decision is `OpenSource/Documentation/architecture/proposals/context-api-envelope.md`.

The eleven facts that decide where a read resolves:

1. **Nearest wins.** Two instances of one provider each answer their own descendants.
2. **Depth is irrelevant.** The components in between declare nothing and know nothing.
3. **A component never resolves to itself** - the walk starts at its parent - so a component
   may consume a key an ancestor instance of its own name provides.
4. **Slot content resolves at its MOUNT position**: content you pass into a provider's slot
   sees that provider's context, while its data still comes from the caller's document.
5. **A declared sheet, dialog, popover or overlay is a logical descendant of its presenter**,
   on all three lanes.
6. **A routed screen is a context ROOT.** A route push starts a fresh store and runner; it
   sees the app root's providers and never its pusher.
7. **A component mounted by `dsx.component.present` is also a root**, because the runtime
   cannot know its presenter.
8. **Resolution is synchronous and once, at mount**, before the consumer's own `<variable>`
   initialisers, providers outermost first. There is no late re-dispatch, which is what keeps
   SSR and hydration in agreement.
9. **`as=` on a consumer row aliases the plane for that row**, so two keys exposing the same
   word coexist: `<context from="board" use="picked" as="board"/>` reads as
   `dsx.context.board.picked`.
10. **`optional="true"` turns a missing provider into the typed absence** instead of a
    refusal, for a component that must render with or without an ancestor.
11. **One subscription per used declaration, never a bundle.** A provider write wakes only
    the consumers that read that key, so a provider with twenty exposed values costs a
    consumer of one exactly one subscription.

> **Landed on all three lanes, each proven in an exported app.** The web lane, then Kotlin
> (proven on an Android emulator: a consumer four components deep calling the root's action,
> a declared sheet reading the same value, a routed screen taking the typed absence) and
> Swift (the same three on an iPhone simulator). The lanes' own notes and deviations are in
> the proposal's Kotlin and Swift sections; the decision record is
> [`adr/0013-context.md`](https://github.com/despia-native/despia/blob/main/OpenSource/Documentation/architecture/adr/0013-context.md).

## 4 · When to split a document

Three shapes say a document has become two, and every one of them is measurable rather than
a matter of taste.

**A head that carries more than one concern.** One document, one job. When the head declares
the session AND the cart AND the board AND the panel layout, those are four documents and
four keys, not one file with four groups of variables and a comment between them.

**A value forwarded through a component that does nothing with it.** If a component declares
`<attribute as="wideChrome"/>`, never reads it, and passes it straight down, that attribute
is not a contract - it is plumbing, and the hop exists only because the language could not
reach past it. Measured in `ClosedSource/Dashboard` before context landed: **63 of 125
`<attribute>` declarations (50.4%) re-declared a name another component already declared**,
and one value was computed once and forwarded through six files. Every one of those chains
collapses to one `<context as=>` and one `<context from= use=>` per real reader.

**A mode flag read by many faces.** A flag with one writer and many readers - a theme, a
selected tool, an open-panel id - is ambient by definition. It is `dsx.global` only if a
route guard or a `<server>` document must read it; otherwise it is a context key, because
context is declared, linted and scoped, and the global bag is none of the three.

### Measure before you split: describe, then graph

None of the three shapes is a judgement you make by scrolling. Two read-only verbs answer them
on the document in front of you, and an agent reads their answer instead of the file:

```sh
despia describe                                   # the project: documents biggest first, routes, apis, config
despia describe Components/App.dsx                # one document: head as a contract, body as addresses, faces, size
despia graph state --names                        # every name: writers, readers, faces it gates
despia graph state --names --document Components/App.dsx
```

`despia describe <document>` takes the project-relative path (`Components/App.dsx`) and prints
the head as a contract (the boundary, variables, apis with the faces each one draws), what the
state graph says about those names, and the body as ADDRESSES (`1`, `3.0.0`), which are what
every editing verb takes. `despia graph state --names` answers the three lists section 4 is
about: **never read**, **written and never read**, **never written but their initializer**,
plus the **mode flags** (a name read only where it gates a face) and anything written from more
than `--writers` units of logic (default 3).

How to read them against the shapes above:

- **More than one concern**: the head's variables fall into groups that no body element reads
  together, or `document-size` fires. Split along the groups, one key per group.
- **A forwarded value**: an `<attribute>` the describe answer lists and the graph shows read by
  nothing but a child's attribute. That hop is a context key.
- **A mode flag read by many faces**: the graph's mode-flag list, with its gated faces. More
  than one document reads it: a context key.

The loop that runs these on every change, and fixes each finding by address, is
[`review-your-app.md`](../reviewing-dsx-apps/SKILL.md).

The counter-examples matter as much:

- **Do not split to make files smaller.** A 300-line document with one concern is one
  document.
- **Do not use context for one hop.** If the child is the parent's own child, the value is an
  `<attribute>`. Context exists for the hops you cannot name.
- **Do not use context for what only one document reads.** That is a `<variable>`.

## 4b · Every api has three faces before its happy path

A `<variable>` is in one state. A request is in four: in flight, empty, failed, answered. A
document that draws only the fourth is blank while it waits, blank when the answer is empty,
and - the case that got this written - draws somebody else's refusal sentence where the
content goes. The Canvas did exactly that: a door refused with "this channel asks for the
session's credential…", the `<api>`'s `error` was bound into a `<text>` with no error face,
and the editor drew the refusal where the Changes rows belong. Nothing crashed and nothing
logged.

So: **loading, empty, error, and then the answer.** Four faces, gated.

```dsx
<stack>
  <head>
    <api as="records" url="https://example.com/records"/>
  </head>
  <vstack>
    <spinner visible-if="dsx.api.records.loading"/>
    <text visible-if="dsx.api.records.data.length === 0" value="Nothing here yet"/>
    <vstack visible-if="dsx.api.records.error">
      <text value="{{ dsx.api.records.error.message }}"/>
    </vstack>
    <list bind="dsx.api.records.data" key="id"><text value="{{ dsx.this.title }}"/></list>
  </vstack>
</stack>
```

The reserved reads are the ones [`reference/jse.md`](https://github.com/despia-native/despia/blob/main/OpenSource/Documentation/reference/jse.md) lists:
`.data`, `.loading`, `.refreshing`, `.error`, `.status`. `.loading` is what all three lanes
publish while a request is in flight with nothing to show yet (the web kernel's `api.ts`,
`ApiBlock.swift`, `ApiBlock.kt`). A read that starts while `.data` is present publishes
`.refreshing` instead and keeps the data drawn, so a loading face never appears over content
that is still on screen; a face that must also show during a refresh reads
`.loading || .refreshing`. A submit is `.loading` for every send. `.error` is an OBJECT, `{ status, message, body }`, so a face draws
`.error.message`; `{{ dsx.api.records.error }}` draws `[object Object]`.

`api-without-faces` counts the loading face the way the lanes publish it: a gate on
`.loading`, `.refreshing` or `.status`. A gate on `isLoading`, which no lane sets, is not a
loading face, and the notice says to gate on `.loading`.

The error text sits INSIDE a gate on the same error. That is the whole difference between an
error face and a refusal drawn as data, and it is what
[`api-error-as-content`](https://github.com/despia-native/despia/blob/main/OpenSource/Conformance/lint/facts.json) refuses. A gate anywhere up the
ancestor chain counts, so one wrapper can hold a whole error panel. `on:error` counts as the
error face too - a handler that runs on a failure is the document saying what a failure means.

## 5 · The shop, whole

The five shapes an app actually has, in one tree. `App` provides; `ProductCard` consumes four
levels down; a sheet consumes because it is a descendant of its presenter; a routed screen
consumes with `optional="true"` because a route push is a root and the key may not be seeded
there; and a package component consumes a scheme-prefixed key the host app provides from
wherever it likes.

**The provider** - `Components/App.dsx`:

```dsx
<stack>
  <head>
    <context as="session"/>
    <variable as="user" context="session" sample='{"id": "u1", "email": "a@b.c"}'>return null</variable>
    <variable as="cart" context="session" persist="device">return []</variable>
    <formula as="cartCount" context="session">return dsx.variable.cart.length</formula>
    <action as="addToCart" context="session" input:id="dsx.this.id">
      dsx.variable.cart = dsx.variable.cart.concat([{ id: id, qty: 1 }])
    </action>
    <action as="signOut" context="session">dsx.variable.user = null</action>
  </head>
  <vstack>
    <slot/>
  </vstack>
</stack>
```

The shop's screens render into that `<slot/>`, which is what makes `App` consumable at all
(`context-unconsumable`). The provider's `cartCount` is read only by consumers in other
documents, and that is enough: a name enrolled with `context=` is read across the boundary, so
neither the state rules nor the dead-code pass (`despia impact --unreachable`, which `despia
lint` runs) reports it, even with no consumer in the project yet
(`OpenSource/Conformance/impact/unreachable.json` pins it).

**The deep consumer** - `Components/ProductCard.dsx`, four levels down, with no attribute
chain for the shared state and an `<attribute>` for what IS this instance's:

```dsx
<stack>
  <head>
    <attribute as="product" default="null"/>
    <context from="session" use="user cartCount addToCart"/>
  </head>
  <vstack>
    <text value="{{ dsx.context.cartCount }} in cart"/>
    <button visible-if="dsx.context.user != null"
            on:tap="dsx.context.addToCart({ id: dsx.attribute.product.id })">Add</button>
  </vstack>
</stack>
```

**The sheet consumer** - a declared sheet keeps its presenter's chain, so it resolves the same
key with no seeding and no re-passing:

```dsx
<stack>
  <head>
    <context from="session" use="cartCount signOut"/>
    <variable as="open">return false</variable>
  </head>
  <vstack>
    <button on:tap="dsx.variable.open = true">Basket</button>
    <sheet present="dsx.variable.open" on:dismiss="dsx.variable.open = false">
      <text value="{{ dsx.context.cartCount }} items"/>
      <button on:tap="dsx.context.signOut()">Sign out</button>
    </sheet>
  </vstack>
</stack>
```

**The routed consumer** - a route push is a context ROOT. It sees the app root's providers and
never its pusher, so a key seeded halfway down the tree is not there. Say so on the row:

```dsx
<stack>
  <head>
    <context from="checkout" use="total" optional="true"/>
  </head>
  <vstack>
    <text value="Total: {{ dsx.context.total }}"/>
  </vstack>
</stack>
```

With `optional="true"` the absent key is the typed absence and the screen renders. Without it,
the build refuses and names the actual ancestor chain - which is the refusal you want when the
key really should have been there.

**The package consumer** - a component shipped in a package cannot name a component in the
host app, so it names a scheme-prefixed KEY and the host provides it from whichever component
it likes:

```dsx
<stack>
  <head>
    <context from="payments.checkout" use="total" as="checkout"/>
  </head>
  <vstack>
    <text value="{{ dsx.context.checkout.total }}"/>
  </vstack>
</stack>
```

A package lists the keys it consumes and provides in its `dsx.json`, beside its existing
`context` block. See [`package-as-sdk.md`](https://docs.despia.com/framework/skills/package-as-sdk).

## 6 · What is refused, and by whom

Eight context rules, with their ids and levels from
[`Conformance/lint/facts.json`](https://github.com/despia-native/despia/blob/main/OpenSource/Conformance/lint/facts.json). Six are decided over ONE
FILE by the linter you already run. Two need to read the provider's document, so they are
the BUILD's, derived over the app graph's provides/consumes edges - the shipped linter runs
with no repo checkout and cannot read another document.

| id | level | who | what it says |
|---|---|---|---|
| `context-write` | error | linter | `dsx.context.x = v` and `bind="dsx.context.x"` - ownership stays with the provider |
| `context-unknown-name` | error | linter (+ build) | a `dsx.context.<name>` no `use=` carries; a `use=` name the key does not carry; two unaliased rows carrying one word |
| `context-unconsumable` | error | linter | a provider with no `<slot/>` and no component child - nothing can ever consume it |
| `context-outside-head` | error | linter | a `<context>` row in the body; the head law's one exception is `<watch>` in a row template |
| `context-in-config-residence` | error | linter | `dsx.context` in a route guard, a `<server>`, a `<cli>` or a workflow document - no mount tree |
| `context-unused-name` | warning | linter | a name listed in `use=` and never read |
| `context-unknown-key` | error | build | `from=` names a key no document declares, or no ancestor on this mount path provides |
| `context-not-exposed` | error | build | the provider carries the name but never enrolled it, or a `context=` mark names a key its head does not declare |

### And thirteen more, about the shapes sections 4 and 4b measure

Section 4 tells you when a document has become two. These say it without being asked, over
the same measurement `despia describe` prints - the reads are counted by the state graph's own
fold ([`graph/names.ts`](https://github.com/despia-native/despia/blob/main/OpenSource/Engine/TypeScript/packages/compiler/src/graph/names.ts)), which is
what `despia graph state --names` answers, so a rule and the report can never disagree about
what a read is. The `document-size` ceilings are DATA, in `facts.json`
`severityTable.documentSize` (120 declarations, 1200 lines, 3 writers), and a project may
declare its own in `dsx.config.json` `"lint": { "documentSize": { ... } }`. The state rules live in
`OpenSource/Engine/TypeScript/packages/compiler/src/state-lint.ts`, the loop and budget rules
in `OpenSource/Engine/TypeScript/packages/compiler/src/loop-lint.ts`.

The LEVEL is the column that matters to a build: an error and a warning each refuse an
artifact (`build`, `export`, `deploy`, `ota`); a notice is printed and never counted. The state
family lands as notices for one minor and is promoted by editing one row of `facts.json`, so
read the level from there, never from memory.

| id | level | what it says | the fix |
|---|---|---|---|
| `api-error-as-content` | error | `dsx.api.x.error` drawn as content with nothing gating it - a refusal rendered as data | gate the element (or an ancestor) on `dsx.api.x.error` and draw `.error.message` |
| `api-without-faces` | notice | an `<api>` with no loading, no empty or no error face (section 4b) | add the missing face, gated |
| `variable-unread` | notice | a `<variable>` no expression, binding, handler, repeat, bind or watch reads | read it where it matters, or `despia undeclare` it |
| `variable-write-only` | notice | a `<variable>` written from N places and read from none | the same: a reader, or remove the writes and then the declaration |
| `state-mode-unreachable` | notice | a flag that only gates faces, and nothing writes it | write it from the control that should reach that face |
| `state-control-orphaned` | notice | a control visible only when a flag nothing writes is true | the same write, or delete the control |
| `state-handler-inert` | notice | a handler that changes no key, emits nothing, calls nothing: a dead press | make it do something, or take the handler off |
| `document-size` | notice | past `documentSize.declarations` or `documentSize.lines` | the three shapes of section 4 |
| `global-undeclared` | notice | a `dsx.global.<key>` read that no document in the project writes | write it somewhere, or it was a context key all along |
| `loop-action-self` | error | an action that calls itself, or a ring of actions that calls it back | break the ring; a guard on the path stands it down to a notice |
| `loop-watch-writes-read` | warning | a `<watch>` whose `on:change` writes what it watches, one or more calls away | derive with `computed="true"` instead of maintaining it |
| `loop-computed-cycle` | error | a derivation reading a derivation that reads it back | one of them is state, assigned somewhere |
| `budget-unbounded-repeat` | error | a `repeat` over a collection whose own body writes that collection | write the collection from outside the repeat |

Two riders. `global-undeclared` is a NOTICE on purpose, because a key can legitimately be
seeded from outside the document set a runner was handed - an SSR seed, a host app, a test,
and a rule with an escape hatch is worse than a rule that reports; it is project-level by
construction, since no `<global>` tag exists and "does anything write this" is the only
statement that can be made about a key. And the read-counting rules are named in
`lint_conformance.rb`'s `PENDING_RULES`: the Ruby runner does not own them, because a Ruby port
of the read-counting fold would be the second opinion these rules exist to prevent.
`document-size` is a count of bytes with no read semantics in it, so `lint_dsx.rb` carries a
real twin and all three runners own it.

Two consequences worth stating on their own:

- **A write is refused, always.** A descendant changes shared state by calling the provider's
  `<action>`. Without the refusal the write would not even be visible - it would mint a
  surface variable on the CONSUMER, a write that succeeds and changes nothing.
- **A missing provider is a BUILD failure with the chain printed**, wherever the mount paths
  are enumerable. Where they are not (a `dsx.component.present` string, a `visible-if` gate),
  the build warns naming the site and the runtime answers the typed absence with one named
  log. `despia verify` answers the same fact as a `failed` verdict.

### And ten about declared shapes and modes

`type=` and `moves=` carry five rules each, `type-*` and `mode-*` in `facts.json`, all literal
only and all decided in one document but one: a consumer's `sample:<name>=` is held to the shape
its PROVIDER declares, which is the build's, over the same key join as the context refusals, and
`despia verify` answers it as a `failed` verdict. The table, the levels and the fixes are in
[`typing-declarations.md`](https://docs.despia.com/framework/skills/typing-declarations) section 4.

## 7 · Testing a consumer alone

A consumer resolves against a mounted tree, so testing one without its provider is the
question every framework with this primitive has to answer. DSX answers it from the
DOCUMENT, with no test harness and no editor involved:

- `sample=` on the PROVIDER's declaration is the stand-in value. A consumer framed alone
  renders from the provider's samples through the key index, with no extra authoring.
- `sample:<name>=` on the CONSUMER's own row overrides it for that one name, the way
  `default=` overrides an attribute.

```dsx
<stack>
  <head>
    <context from="session" use="user cartCount" sample:cartCount="3"/>
  </head>
  <vstack>
    <text value="{{ dsx.context.cartCount }} in cart"/>
    <text value="{{ dsx.context.user }}"/>
  </vstack>
</stack>
```

Mounted under its real provider, `cartCount` is the provider's formula. Mounted alone - in a
unit test, a thumbnail, an isolated render - it is `3`. The same sample seeds both, which is
why the value lives in the document rather than in a fixture file that can go stale. See
[`sample-values.md`](https://docs.despia.com/framework/skills/sample-values) and
[`writing-unit-tests.md`](https://docs.despia.com/framework/skills/writing-unit-tests).

## 8 · Anti-patterns

**The global bag.** `dsx.global.<key>` for everything shared. It is undeclared, untyped,
unscoped and unlinted: nothing tells you who writes it, nothing tells you who reads it, and
nothing tells you when you have broken one. Measured before context landed: **98 documents
carried the byte-identical guard** `dsx.global.docs && dsx.global.docs.theme ? … : ''` on
line 1, for one value with one writer and no declaration anywhere. That is one context key
with one declaration and a linted `use=`. Keep `dsx.global` for what genuinely is app-wide
and must be readable where there is no mount tree - auth, entitlements, theme, and anything a
route guard or a `<server>` document reads. Context never replaces it, and it never replaces
context.

**The six-hundred-variable head.** One document that grew until it was the app. Measured:
`OpenSource/Canvas/Components/Canvas.dsx` was 18,878 lines and ONE component - 605 variables,
295 actions, zero `<attribute>`, zero `<event>`, 116 flag-shaped variables, 76 written from
more than three actions, and a 142-line hand-written z-order ladder over 22 open flags. Its
own header said splitting it "would mean either passing the same three values down four
attribute chains or seeding a shared store", which were exactly the two options the language
offered. Now there is a third: the root head becomes the provider and each panel becomes a
consumer of the one key it actually uses.

**Reaching into a child's state.** A parent that reads or writes what a child owns has
deleted the boundary. The child raises an event and the parent decides; or the value was
never the child's and belongs one layer up, at the provider. There is no spelling for reading
down, on purpose.

**A context key derived from a component name.** There is none, and there will not be: half a
codebase would then be addressed by component name, which is the coupling context exists to
remove. Name the key for the CONTRACT (`session`, `checkout`, `board`), never for the file
that happens to provide it today.

**A `use="*"`.** There is none. The enumeration IS the contract - it is what the app graph,
the editor and three parsers read out of the document, and it is what makes removing an
exposed name a named refusal in every consumer instead of a silent null.

## See also

- [`architecture/adr/0013-context.md`](https://github.com/despia-native/despia/blob/main/OpenSource/Documentation/architecture/adr/0013-context.md) - the decision, its consequences and what is not enforced yet.
- [`reference/StackReference.md`](https://github.com/despia-native/despia/blob/main/OpenSource/Documentation/reference/StackReference.md) - the head declarations table and the state section.
- [`reference/jse.md`](https://github.com/despia-native/despia/blob/main/OpenSource/Documentation/reference/jse.md) - the `dsx.context` plane beside every other plane.
- [`typing-declarations.md`](https://docs.despia.com/framework/skills/typing-declarations) - `type=` on a declaration, and a set of flags written as one mode.
- [`components-and-reuse.md`](../dsx-components-and-reuse/SKILL.md) - the other cut: one root, panels and configurable primitives, the copies `despia describe --reuse` ranks, and `despia extract` and `despia split`.
- [`global-state.md`](https://docs.despia.com/framework/skills/global-state) - `dsx.global.*`, the layer above this one.
- [`component-props-and-state.md`](https://docs.despia.com/framework/skills/component-props-and-state) - the props/state split at one boundary.
- [`dsx-best-practices.md`](https://docs.despia.com/framework/skills/dsx-best-practices) - the markup rules the linter enforces.
