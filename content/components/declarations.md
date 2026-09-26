---
title: Declarations
description: The tags that render nothing and declare everything: state, actions, formulas, events, styles and slots.
order: 3
section: components
element: 
category: structural
scope: structural
platforms: web,ios,android,desktop
properties: []
actions: []
catalog: 0.1.0
commit: 10ab2358e69fe64fac0e57c6dd9f31d042cc4d86
generator: ClosedSource/scripts/generate_component_docs.rb
---

# Declarations

A declaration tag renders no DOM root on any renderer. It is logic, not markup, and it lives in the component's `<head>` in one canonical order: attributes, expects, events, api, variables (plain, then computed), formulas, actions, watch, style.

## `action`

Named, reusable logic (side effects, no return value) invoked as `<as>`() / dsx.action.`<as>`(). Parameterized like `<formula>`: as= plus named-input attributes bound in the caller scope. Body is bounded JS statements, read 1:1 (no XML escaping).

```dsx
<action as="addToCart" input:id="dsx.this.id" input:qty="1">dsx.variable.cart.push({ id: id, qty: qty }); dsx.module.haptic.success()</action>
```

| Attribute | Type | Default | Notes |
|---|---|---|---|
| `as` | `string` |  | The action name. |

## `attribute`

Declares a component attribute (prop) this component consumes: `dsx.attribute.<as>` with an optional default expression; `on:change` watches the consumer-supplied value. The machine-readable Props: table.

```dsx
<attribute as="accent" default="'#FF2D55'"/>
```

| Attribute | Type | Default | Notes |
|---|---|---|---|
| `as` | `string` |  | The attribute name (the identifier is as=, everywhere). |
| `default` | `expr` |  | JSE expression used when the consumer omits the attribute. |
| `login` | `merge` \| `account-wins` \| `device-wins` \| `ask` |  | PROPOSED (proposals/cloud-state.md section 4.1). What signing in does to this variable when its persist= scope is the account: merge (the default) lands the account's value when it holds one and otherwise carries this device's value up; account-wins the same on the version 1 rules; device-wins uploads this device's value over the account's. Before anybody signs in, an account value is kept on this device, and that is the value login= decides about. ask (proposals/cloud-state.md section 4.2) keeps the device's value on screen when both sides hold one and publishes the question on dsx.module.sync.context.asks for the app to answer with dsx.module.sync.resolve; login= on a scope that never leaves the device is an error. |
| `logout` | `clear` \| `keep` |  | PROPOSED (proposals/cloud-state.md section 4.1). What signing out does to this variable when its persist= scope is the account: clear (the default, privacy first) returns it to its declared default and leaves nothing of the account on the device; keep demotes the value to this device, as if it had been written before sign-in. keep-ecosystem is refused by name until the ecosystem scope lands (CS4). |
| `on:change` | `action` |  | Watches the consumer-supplied value. |
| `type` | `string` |  | PROPOSED (proposals/types-on-declarations.md). The SHAPE the value this attribute holds, out of the census's eighteen conventions.types words with four marks: `?` (optional: absent or null admitted), `[]` (a list of), `{ key: shape, … }` (a dict with exactly those keys) and `\|` between single-quoted string literals (a closed set, e.g. 'compact' \| 'full'). Absent is the default and is exactly what has always happened: no shape, no refusal. The shape decides the control for this declaration's VALUE rows (default=, sample=) while a body stays the code editor, and derives a sample when none is written. Refused by the linter: a word outside the eighteen (int, any, boolean), an unparseable shape, type="" (type-unknown-word); a literal default= or sample= the shape cannot hold. Nothing happens at run time: no coercion, no throw, no dropped write. See conventions.declarationTypes. |

## `component`

Inline component definition: registers its subtree as a reusable component scoped to the current module (exactly like a Components/`<Name>`.dsx file) and renders nothing where it stands. Idempotent; shadows a same-name file component in its scope.

```dsx
<component as="Badge"><text value="{{ dsx.attribute.label }}"/></component>
```

| Attribute | Type | Default | Notes |
|---|---|---|---|
| `as` | `string` |  | The component name (Capitalized tag). |

## `context`

ONE TAG, TWO MOODS (PROPOSED, proposals/context.md). `as=` alone is the PROVIDER mood: it declares a context KEY, and `context="<key>"` on a `<variable>`, a `<formula>`, an `<action>` or an `<api>` enrols that declaration under it, so a descendant reads `dsx.context.<name>` or calls `dsx.context.<name>({ … })`. `from=` is the CONSUMER mood: the document declares what it takes from the NEAREST MOUNTED ANCESTOR that provides the key, and `use=` enumerates the names it takes, space-separated the way <event payload=> is. Nearest wins; a component never resolves to itself; slot content resolves at its mount position while its data stays the caller's; a routed screen and a presented component are context ROOTS that see the app root and never their pusher. Reads and calls only - a write is refused by name, because ownership stays with the provider and a component boundary cannot forward a two-way binding; a descendant changes shared state by calling the owner's action. A key no ancestor provides is a build refusal naming the actual ancestor chain, unless the row says optional="true", which makes it the typed absence.

```dsx
<context from="session" use="user cartCount addToCart"/>
```

| Attribute | Type | Default | Notes |
|---|---|---|---|
| `as` | `string` |  | PROVIDER mood (no from=): the context key this document declares, a string the way a component name is - serialisable, package-qualifiable, refactorable by rename. CONSUMER mood (beside from=): the ALIAS of the plane for this row, so two keys exposing the same word coexist - `as="board"` reads as dsx.context.board.`<name>`. |
| `from` | `string` |  | The context KEY this document takes from above. A key, never a component name: a package component can never name a component it has not seen, which is the direction a name-addressed design cannot express at all. A key that crosses a package boundary is scheme-prefixed (payments.checkout). |
| `optional` | `enum` |  | true turns a missing provider into a defined empty read (the typed absence) instead of a refusal, for a component that must render with or without an ancestor. |
| `use` | `string` |  | Space-separated names this document takes from the key. Mandatory and enumerated - there is no use="*" - because the declaration is the contract the app graph, the editor and three parsers read out of the document. A name read but not listed is an error; a name listed but never read is a warning. An enrolled `<api>` is read as its envelope, reads only: `use="head"` takes it and `dsx.context.head.loading`, `.error` and `.data` read it, while `dsx.context.head()` is refused as a write (proposals/context-api-envelope.md). A name is a declaration, never a path: `use="head.loading"` is refused. |

## `event`

Declares an event this component raises via dsx.event('`<as>`') - the outbound contract (lint-checked against the literal dsx.event calls in the file).

```dsx
<event as="select" payload="id"/>
```

| Attribute | Type | Default | Notes |
|---|---|---|---|
| `as` | `string` |  | The event name. |
| `payload` | `string` |  | Space-separated payload key names. |

## `expects`

The seed contract: state the mounting side must seed (ui.variable / vars:) or shared surface state a fragment reads. A missing seed logs one tick after mount.

```dsx
<expects variable="downloads"/>
```

| Attribute | Type | Default | Notes |
|---|---|---|---|
| `variable` | `string` |  | The store variable name this document expects to be seeded. |

## `formula`

A reactive function with named inputs: every attribute other than as= is an input expression evaluated where the formula is read; the body uses those names as locals. Read as a value (no parentheses).

```dsx
<formula as="lineTotal" input:qty="dsx.this.qty" input:price="dsx.this.price">return qty * price</formula>
```

| Attribute | Type | Default | Notes |
|---|---|---|---|
| `as` | `string` |  | The formula name. |
| `type` | `string` |  | PROPOSED (proposals/types-on-declarations.md). The SHAPE the value this formula produces holds, out of the census's eighteen conventions.types words with four marks: `?` (optional: absent or null admitted), `[]` (a list of), `{ key: shape, … }` (a dict with exactly those keys) and `\|` between single-quoted string literals (a closed set, e.g. 'compact' \| 'full'). Absent is the default and is exactly what has always happened: no shape, no refusal. The shape decides the control for this declaration's VALUE rows (sample=) while a body stays the code editor, and derives a sample when none is written. Refused by the linter: a word outside the eighteen (int, any, boolean), an unparseable shape, type="" (type-unknown-word); a literal sample= the shape cannot hold. Nothing happens at run time: no coercion, no throw, no dropped write. See conventions.declarationTypes. |

## `head`

The ONE place declarations live - first child of the root, at most one per element. Renders nothing; its children are declarations in canonical order: attribute → expects → event/input/tool → api/variable (plain → computed) → formula → action → script → watch → style → component.

```dsx
<vstack><head><variable as="count">return 0</variable></head><text value="{{ dsx.variable.count }}"/></vstack>
```

## `node`

The data-driven tag: <node tag="{{ dsx.this.view }}"/> resolves to any tag compiled into this binary (an unknown tag renders nothing - remote content can never name a view the app can't render). A bare `<node>` renders its children.

```dsx
<node tag="{{ dsx.this.view }}"/>
```

| Attribute | Type | Default | Notes |
|---|---|---|---|
| `tag` | `expr` |  | The tag name to resolve (interpolatable). |

## `script`

A function library: every function name(params) { … } in the body registers as a callable (positional args, recursion depth-capped) usable in any expression or action body.

```dsx
<script>function double(n) { return n * 2 }</script>
```

## `slot`

Inside a component template: renders the children the caller passed (in the caller's data scope). name= for named slots; callers mark a child with slot="`<name>`".

```dsx
<slot name="footer"/>
```

| Attribute | Type | Default | Notes |
|---|---|---|---|
| `name` | `string` |  | The slot name (omit for the default slot). |

## `style`

A stylesheet: the body is standard CSS text, and a reusable look is an ordinary class rule in it, applied with class="`<name>`". The tag carries NO attributes at all: the self-closing <style as="card" padding="16"/> row that named a look through the style attribute dialect is DELETED, and component.ts refuses any attribute on a `<style>` block at parse time. An inline style= on an element outranks a class through the standard cascade.

```dsx
<style>.pill { border-radius: 16px; padding: 6px 12px }</style>
```

## `tool`

Declares an action this document exposes to an AI AGENT (WebMCP, proposals/webmcp.md). The row names one action the same head declares and carries NO schema: the descriptor an agent reads is derived from that action's declared inputs. On the web renderer the rows register with document.modelContext while the document is mounted; on a native surface the row is declarative.

```dsx
<tool action="addTodo" description="Add a new item to the user's todo list." mutates="todos"/>
```

| Attribute | Type | Default | Notes |
|---|---|---|---|
| `action` | `string` |  | The action this tool exposes. Must be declared by this same document (a stale target fails the build). |
| `as` | `string` |  | The tool name an agent sees. Defaults to the action name; 1 to 128 characters of ASCII letters, digits, "_", "-" or ".". |
| `description` | `string` |  | What the tool does, in plain language. This is what an agent reads to choose it, and it is untrusted text that changes no policy. |
| `mutates` | `string` |  | What this action changes when it changes anything. Its ABSENCE is what emits the read-only hint, and its presence is the approval gate. |

## `variable`

State: runs once for the initial value of a mutable store var (body is bounded JSE; a single expression is the value, multi-line returns via return). computed="true" makes it a reactive, read-only derivation evaluated per read in the current scope.

```dsx
<variable as="openCount" computed="true">dsx.variable.todos.filter(t => !t.done).length</variable>
```

| Attribute | Type | Default | Notes |
|---|---|---|---|
| `as` | `string` |  | The variable name (dsx.variable.`<as>`). |
| `computed` | `bool` | `false` | true → reactive read-only derivation (pure, bounded). |
| `merge` | `last-write-wins` \| `version-check` \| `server-authoritative` |  | PROPOSED (proposals/cloud-state.md section 3). How two devices' writes to a variable combine, required whenever its persist= scope carries the value off this device (account) and never defaulted: a scope that crosses devices without it is a build error (persist-merge). The words are the Sync protocol's own strategy names: last-write-wins (the latest write lands), version-check (a write made against an older version is refused and the conflict is state the app resolves) and server-authoritative (the device copy is a cache of the server's decision). field-merge, set-merge, counter-merge, max and min arrive with Sync version 2 and are refused by name until then. |
| `moves` | `string` |  | PROPOSED (proposals/union-typed-variables.md). The legal transitions of a MODE - a `<variable>` whose type= is a string-literal union - as from>to pairs separated by whitespace, with no spaces inside a pair: moves="cart>address address>pay pay>done". Absent is the default and means every transition is legal. Read only beside a string-literal union type=; both sides of every pair must be literals in the set, and the initial (the body's return) needs no move to reach it. moves="" is refused (a mode admitting no transition is a constant), as is moves= on an `<attribute>` (the consumer owns the from). The linter judges it (mode-bad-move, mode-unreachable-value); at run time nothing is enforced. The law is OpenSource/Conformance/language/modes.json. |
| `persist` | `session` \| `device` \| `account` |  | PROPOSED. WHERE this variable is remembered. Absent is the default and is what has always happened: in memory, per surface, lost on reload. The words are rows of the `persist` facet, owned by Mandatory/State, which contributes `session` and `device`; another package contributes its own word, and a word no package provides is a build error (proposals/cloud-state.md section 2). `account` is contributed by the Sync package: the signed-in person's account, on every device they use, which needs merge=. `session` means this run of the app, in memory on every lane: it survives the surface being mounted again (a navigation away and back) and not a relaunch or a page reload. `device` means it survives an app launch - this install only, not synced to another device, not secret - and it goes through the store that already owns that on all three lanes (Core/Basics/ValueStore: localStorage, UserDefaults.standard, SharedPreferences "dsx_storage"), never through a second door of its own. It is an ENUM and not a boolean because a boolean would have to pick a destination for you, and the destinations differ in whether a value survives a reinstall, whether it follows you to another device, and whether other software on the machine can read it - see proposals/persistence.md §5. The slot is keyed by the qualified component name (dsx.storage.var.`<scheme>`.`<name>`.`<as>`), so two documents that both declare as="theme" keep two values exactly as they do in memory. The body still runs on every launch, and a STORED value then wins on presence, never on truthiness: a stored false, 0 or "" is a stored value. A blocked store (Safari private mode, a full quota) degrades - the in-memory write always lands and the app behaves as if nothing was persisted; read dsx.module.storage.available to know. computed="true" with persist is a lint error, because a derivation has no state to keep. A secret belongs in dsx.module.identityvault and a value the server must see belongs in dsx.cookie; neither is a persist word. |
| `type` | `string` |  | PROPOSED (proposals/types-on-declarations.md). The SHAPE the value this variable holds, out of the census's eighteen conventions.types words with four marks: `?` (optional: absent or null admitted), `[]` (a list of), `{ key: shape, … }` (a dict with exactly those keys) and `\|` between single-quoted string literals (a closed set, e.g. 'compact' \| 'full'). Absent is the default and is exactly what has always happened: no shape, no refusal. The shape decides the control for this declaration's VALUE rows (sample=, the inline value box) while a body stays the code editor, and derives a sample when none is written. Refused by the linter: a word outside the eighteen (int, any, boolean), an unparseable shape, type="" (type-unknown-word); a literal sample= or write the shape cannot hold. Nothing happens at run time: no coercion, no throw, no dropped write. See conventions.declarationTypes. |

## `watch`

A reactive observer for side effects: runs on:change whenever value settles to a new value, in the watch's own scope (inside a list row it observes that row). immediate="true" also fires once on mount. The one declaration allowed OUTSIDE the head (inside a list/grid/pager row template).

```dsx
<watch value="dsx.variable.query" on:change="dsx.action.search()"/>
```

| Attribute | Type | Default | Notes |
|---|---|---|---|
| `detail` | `bool` | `false` | PROPOSED (proposals/cloud-state.md section 5). The change arrives as a descriptor in dsx.this for every value shape: dsx.this.value (the new value, an object included), dsx.this.previous (the value the watch last observed) and dsx.this.origin (local, remote, restore or transition: where the write came from, so a hand-written sync sends only local changes). With immediate="true" the mount fire carries previous null and origin restore. |
| `immediate` | `bool` | `false` | Also fire once on mount. |
| `on:change` | `action` |  | Runs when the value changes; dsx.this is the new value (an object as it is, anything else as { value }), or the change descriptor under detail="true". |
| `value` | `expr` |  | The observed expression. |

This page is GENERATED by ClosedSource/scripts/generate_component_docs.rb. A hand edit here is overwritten on the next run by design: fix the ledger instead (the attribute and event contract in `OpenSource/Documentation/reference/stack-elements.json`, the platform support and the audit in `OpenSource/Conformance/library/matrix.json`, the description and the web limits in `OpenSource/Engine/TypeScript/support/element-support.json`, the specimen in `OpenSource/Catalog`).

