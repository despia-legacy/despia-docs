---
name: dsx-components-and-reuse
description: "Cut a DSX app into one root, panels and a library of configurable primitives, and never write the same markup twice: the InputField worked example (typed attributes down, an event up, no parent binding), despia describe --reuse to rank every group of copies, despia extract --all to make one component of them with attributes and events inferred, despia split to move a panel out with its state as context, the repeated-subtree, attribute-forwarded-unused and flag-family notices, and the advice field editing verbs return. Use before writing markup that looks like markup already written, before adding a component, and whenever lint or a verb's advice names one of those rules."
---

<!-- GENERATED from OpenSource/Skills/components-and-reuse.md in despia-native/despia.
     Edit the source, then: ruby ClosedSource/scripts/generate_agent_skills.rb -->

# Components and reuse: one root, panels, and a library of configurable primitives

> Audience: app authors and agents writing `.dsx`. This is the MODULARITY skill: how a DSX app
> is cut into components, how to find the copies that want to be one, and the verbs that make
> them one. Where state goes once a document is split is
> [`structuring-an-app.md`](../structuring-dsx-apps/SKILL.md); the props and state split at one boundary is
> [`component-props-and-state.md`](https://docs.despia.com/framework/skills/component-props-and-state); the loop that runs all of this
> on every change is [`review-your-app.md`](../reviewing-dsx-apps/SKILL.md).
>
> The design this teaches is
> [`architecture/proposals/modularity.md`](https://github.com/despia-native/despia/blob/main/OpenSource/Documentation/architecture/proposals/modularity.md).

Three kinds of document make a DSX app, and every good one has all three:

| Kind | What it is | How many |
|---|---|---|
| **The root** | the entry document: it composes panels and owns the state they share | one |
| **Panels** | one job each: the inspector, the cart, the settings sheet | a handful |
| **Primitives** | small, configurable, reused everywhere: `InputField`, `Row`, `Badge` | as few as possible, each mounted many times |

The rule the whole skill serves:

> **Reuse, reuse, reuse. Never two components where one configurable one does, and never the
> same markup written twice where one component does.**

A primitive is configured by its `<attribute>`s and answers with its `<event>`s. It never reads
its parent's state, so it can be mounted anywhere, five times on one screen, in a package, in a
test with its `sample=` values.

---

## 1 · The worked example: one InputField, five places

The copies, the way a form grows when nobody stops it. Three fields, each four lines, each the
same shape with different words:

```dsx
<stack>
  <head>
    <variable as="name">return ''</variable>
    <variable as="email">return ''</variable>
    <variable as="phone">return ''</variable>
    <action as="submit">dsx.global.before = [dsx.variable.name, dsx.variable.email, dsx.variable.phone]</action>
  </head>
  <vstack class="form">
    <vstack class="input-field">
      <text class="label" value="Name *"/>
      <textfield bind="dsx.variable.name" placeholder="Ada Lovelace"/>
    </vstack>
    <vstack class="input-field">
      <text class="label" value="Email *"/>
      <textfield bind="dsx.variable.email" placeholder="ada@example.com"/>
    </vstack>
    <vstack class="input-field">
      <text class="label" value="Phone"/>
      <textfield bind="dsx.variable.phone" placeholder="Optional"/>
    </vstack>
    <button label="Create account" on:tap="dsx.action.submit()"/>
  </vstack>
</stack>
```

`despia lint` says so, as a notice, with the verb that fixes it:

```
Components/Before.dsx:9: notice: <vstack> subtree repeated 3 times with one shape (lines 9, 13,
17; 3 elements each, 3 attribute values differ (value, bind, placeholder)) - one component
configured by attributes, not 3 copies. `despia extract Components/Before.dsx 1.0 --as <Name>
--all` makes it one.
```

And `despia extract` refuses this one by name, which is the lesson:

```
despia extract: binds_parent_state - <textfield bind=> at line 11 writes the document's own
state, and a two-way binding cannot cross a component boundary as a value. Give the component
an attribute for the value and an <event> for the change, ...
```

A field that binds its PARENT's variable is not a primitive: it can only ever be mounted where
that variable exists. So the primitive owns its draft and says when it changed. This is the
whole of it, with its schema in the head:

```dsx
<vstack class="input-field">
  <head>
    <attribute as="label" type="string" default="''"/>
    <attribute as="kind" type="'text' | 'email' | 'password'" default="'text'"/>
    <attribute as="placeholder" type="string" default="''"/>
    <attribute as="required" type="bool" default="false"/>
    <attribute as="value" type="string" default="''" on:change="dsx.variable.draft = dsx.attribute.value"/>
    <event as="changed" payload="value"/>
    <variable as="draft">return dsx.attribute.value</variable>
  </head>
  <text class="label" value="{{ dsx.attribute.label }}{{ dsx.attribute.required ? ' *' : '' }}"/>
  <textfield bind="dsx.variable.draft"
             placeholder="{{ dsx.attribute.placeholder }}"
             secure="{{ dsx.attribute.kind == 'password' }}"
             on:change="dsx.event('changed', { value: dsx.variable.draft })"/>
</vstack>
```

And the form is five mounts, each one line of configuration:

```dsx
<stack>
  <head>
    <variable as="name">return ''</variable>
    <variable as="email">return ''</variable>
    <variable as="password">return ''</variable>
    <variable as="company">return ''</variable>
    <variable as="phone">return ''</variable>
    <action as="submit">
      dsx.global.signup = {
        name: dsx.variable.name, email: dsx.variable.email, password: dsx.variable.password,
        company: dsx.variable.company, phone: dsx.variable.phone
      }</action>
  </head>
  <vstack class="form">
    <InputField label="Name" placeholder="Ada Lovelace" required="true"
                on:changed="dsx.variable.name = dsx.this.value"/>
    <InputField label="Email" kind="email" placeholder="ada@example.com" required="true"
                on:changed="dsx.variable.email = dsx.this.value"/>
    <InputField label="Password" kind="password" required="true"
                on:changed="dsx.variable.password = dsx.this.value"/>
    <InputField label="Company" placeholder="Optional"
                on:changed="dsx.variable.company = dsx.this.value"/>
    <InputField label="Phone" placeholder="Optional"
                on:changed="dsx.variable.phone = dsx.this.value"/>
    <button label="Create account" on:tap="dsx.action.submit()"/>
  </vstack>
</stack>
```

Both documents lint with 0 errors, 0 warnings and 0 notices. What changed, and why each part
is the way it is:

- **The schema is the head.** `label`, `kind`, `placeholder`, `required` are typed attributes
  with defaults; a caller sets only what differs. `kind` is a union of the three values the
  primitive knows how to draw, and `despia describe Components/InputField.dsx` prints that
  contract without anyone reading the file.
- **The value goes up as an event, never down as a binding.** `changed` carries `value`, and
  the caller reads it as `dsx.this.value` in `on:changed`. The primitive never names the
  caller's state, so it mounts anywhere.
- **And the value comes down as an attribute.** `value` seeds the draft, and its `on:change`
  reseeds it when the caller moves the value under a mounted field (a selection change, a reset
  after submit); without that row the field shows the last draft. Value down, change up: this is
  the whole contract of a field primitive, and it is the contract `despia split` looks for
  (§3). The design system's `DespiaField` has the same two rows.
- **A new field is one line.** A sixth field is a sixth mount, and a change to how every field
  looks is one edit in one document.

## 2 · The loop: find the copies, rank them, make them one

Three read-only questions first, then one verb:

```sh
despia lint                                    # repeated-subtree, attribute-forwarded-unused, flag-family
despia describe --reuse                        # every group of copies, ranked by what extracting gives back
despia describe Components/App.dsx --reuse     # only the groups this document takes part in
```

`despia describe --reuse` on a copy of this repository's own website, verbatim:

```
reuse: 22 groups of copies, 101 copies, 1118 lines back if every one is extracted
   1  <stack> ×4 · 53 elements · 344 → 133 lines (211 back) · 41 values differ
      Components/SiteBase44.dsx:159  Components/SiteHome.dsx:164  Components/SiteLovable.dsx:159  Components/SiteMain.dsx:122
      despia extract Components/SiteBase44.dsx 1.0.0.3.0.0.1 --as <Name> --all
```

Then the verb it names, with a name you choose and the revision you read:

```sh
despia extract Components/SiteBase44.dsx 1.0.0.3.0.0.1 --as FeatureCard --all \
  --rev "$(despia revision Components/SiteBase44.dsx)"
```

What `despia extract` does, in order:

1. **A checkpoint first.** `despia checkpoint back --to <id>` puts every document back.
2. **One component** at `Components/<Name>.dsx`, cut from the first copy.
3. **One attribute per value that differs**, typed from the values (`string`, `number`,
   `bool`); a value that reads the document's own state becomes an attribute the mount hands in,
   because a mount evaluates in the caller's scope.
4. **One event per handler that differs or reads the document**: inside, `dsx.event('<name>')`;
   on the mount, `on:<name>` with the handler's own body.
5. **Every copy replaced by its mount**, in every document, in ONE held change, judged by the
   guardian; `despia change approve <id>` keeps it.

On the website copy that one command made `FeatureCard` from four copies in four documents: the
four pages went from 2,295 lines to 1,955, the component is 129, and `despia lint` and
`despia build` stayed green.

What it refuses, by name, with the way out: `binds_parent_state` (a two-way `bind=` on the
document's state, the example above), `reads_row_item` (a differing value reads `dsx.this` of a
repeat inside the copy), `body_reads_parent_state` (a code body reads the document), and every
refusal the extract door has (`name_taken`, `stale_revision`, `bad_address`, ...).

## 3 · Panels: `despia split`

A panel is the other cut: not a copy, but one job that has grown inside the root. Move it out
with the state it reads:

```sh
despia split Components/App.dsx 2.1 --as Inspector --rev "$(despia revision Components/App.dsx)"
```

- what the panel **reads** of the root (`<variable>`, `<formula>`, `<action>`) is enrolled under
  a context key the root provides, and the panel takes it with `<context from= use=>`;
- what the panel **writes** becomes an enrolled `<action>` of the root with the handler's own
  body, and the panel calls it, because context is reads and calls only;
- a root `<attribute>` the panel reads is handed to it on the mount (one hop is an attribute);
- a root `<api>` the panel reads is enrolled as its envelope, read only (`dsx.context.items.data`,
  `dsx.context.items.loading`), and a handler that INVOKES it (`dsx.api.items()`) is lifted into
  an enrolled action like any other write.

**A panel's field is the field primitive, never a bind to the root.** A context consumer reads
and calls, it never writes (`proposals/context.md` Decision 5), so a panel cannot keep
`<textfield bind="dsx.variable.x">` over the root's `x`. `despia split` makes the right shape
itself:

- a `<list bind=>` / `<grid bind=>` over the root's state is a READ of its rows: it becomes
  `<list bind="dsx.context.rows">` and `rows` is enrolled like any read. It stays refused only
  when the collection writes back: `reorder=`, or a row that binds or assigns `dsx.this.…`
  (a nested `<list bind="dsx.this.options">` reads its row and is fine);
- a `<textfield bind="dsx.variable.x">` becomes a mount of the project's field primitive, value
  down and change up, and the root gains ONE enrolled setter per bound name, shared by every
  panel that binds it:

```dsx
<InputField value="{{ dsx.context.x }}"
            on:changed="dsx.context.inspectorSetX({ value: dsx.this.value })" placeholder="…"/>

<!-- in the root -->
<action as="inspectorSetX" context="app" input:value="''">dsx.variable.x = value</action>
```

The field primitive is `--field <Name>`, or else the one component whose head declares
`<attribute as="value">` and exactly one `<event>` whose `payload=` names `value` (the
InputField of §1). Every other attribute and handler of the site is carried; one the field does
not declare, and a mount does not consume itself (`visible-if`, `key`, `slot`, `scroll`), is
refused `field_contract`, naming it. With no field primitive the verb keeps refusing
`binds_parent_state`, prints the field document to add, and never writes a component you did
not choose.

It also refuses an api invoked outside an `on:` handler (`reads_parent_api`) and a `dsx.this` of
a repeat outside the panel (`reads_repeat_item`). Measured on this repository's editor, 69
candidate panels: 5 split before, 24 once a collection's bind was a read, and 66 with a field
primitive in the project (the other three: two `reads_repeat_item`, one list that really
reorders).

And the runtime agrees on every lane: a field bound to `dsx.context.x`, a row write under a
collection bound to the plane, and a reorder of one are each refused with the `context-write`
phrase and move nothing, on the web, iOS and Android (`OpenSource/Conformance/composition/context.json`
`writeBack`).

## 4 · The three rules, and what each one means

All three are **notices** for this minor: they never stop a build. They become warnings once
this repository's own projects are clean of them.

| Rule | What it found | What to do |
|---|---|---|
| `repeated-subtree` | a subtree whose tags, nesting and attribute names repeat three or more times, only the values differing; in one document, or across documents | `despia extract <document> <address> --as <Name> --all`, the command the message prints |
| `attribute-forwarded-unused` | an `<attribute>` this document only passes to a child mount's attribute, doing nothing with it | **a slot first**: let the caller pass the child in through `<slot/>`, whose content binds in the caller's scope, so nothing is forwarded (Kit parts do not read context, so this is the usual answer). A context key only when the value must cross several levels to many readers |
| `flag-family` | three or more booleans set by exactly the same handlers, or each alone gating one of three sibling faces | one union-typed `<variable>` with `moves=`, the spelling the message prints (see [`typing-declarations.md`](https://docs.despia.com/framework/skills/typing-declarations)) |

## 5 · The MCP warns you at the moment you write the copy

Every editing verb's `--json` answer (`despia set`, `insert`, `move`, `wrap`, ...) carries an
`advice` array when the write INTRODUCED one of the three findings, and `despia describe --json`
carries the described document's. An agent that inserts a third copy of a row reads, in the
very answer it parses for the next revision:

```json
{"command":"insert","ok":true,"document":"Components/Two.dsx","rev":"3b36d1342084105b7531ceb8f98c5bb7",
 "advice":[{"rule":"repeated-subtree","document":"Components/Two.dsx","line":3,
 "message":"<hstack> subtree repeated 3 times with one shape (lines 3, 7, 11; ...) ..."}]}
```

Advice never refuses: the write landed. Act on it before the fourth copy.

## 6 · The counter-examples

- **Do not extract two copies.** Two is a coincidence; three is a component. The threshold is
  data (`severityTable.reuse` in `OpenSource/Conformance/lint/facts.json`).
- **Do not make a component out of one element.** A repeated `<text>` is a sentence, not a
  component; a subtree counts from three elements.
- **Do not make one component with a `mode` attribute that switches between two unrelated
  bodies.** That is two components wearing one name. Configure what varies; split what differs.
- **Do not reach up from a primitive.** A primitive that reads `dsx.context` or its parent's
  names cannot be mounted anywhere else. Attributes down, events up.

## 7 · A component other apps embed: `despia expose`

A component can also leave the app. `despia expose Paywall` turns it into a custom element
(`<shop-paywall>`) that any website or framework can embed, and `despia build` writes that
element as an installable package under `dist/embed/<command>/`. The package holds typings, the
React 18 wrappers, an SSR helper and a `USAGE.md` with one example per host. The guide is
`OpenSource/Documentation/guides/embed-anywhere.md`.

Its head is the contract other teams build against, so write it as one:

- **Type every attribute and every event field.** `type=` on `<attribute>` decides how the
  attribute's text is read (bool the HTML way, number, JSON for lists and dicts). It is also
  what types the property in the host's TypeScript, and `type:<name>=` on `<event>` types the
  event's `detail`. An untyped attribute is `unknown` to every host.
- **Attributes in, events out, nothing else.** An `<expects>` is refused, because an embed only
  takes attributes. A call to your own module needs a web entry to answer it.
- **Declare `value` if it is an input.** The element then joins the host's `<form>`, and any
  event that carries `value` updates the form value.
- **Removing or retyping an attribute or event field is a major version.** The build prints
  the change from `app-description.json`: bump `dsx.json` `version`.
- **Prove it where it will run.** `node packages/element/proof/hosts.ts` drives the Paywall in
  plain HTML, React 19, React 18, Vue and a server-rendered Next.js page.
