---
name: writing-dsx-apps
description: "Write correct DSX app markup: the mental model, the element vocabulary, state in order of preference, lists, navigation (back and close POP, never href), and the mistakes generated code actually makes. Use before writing or editing any .dsx file. DSX is not React, React Native, HTML or Vue; do not guess syntax from adjacent frameworks."
---

<!-- GENERATED from OpenSource/Skills/writing-an-app.md in despia-native/despia.
     Edit the source, then: ruby ClosedSource/scripts/generate_agent_skills.rb -->

# Writing an app in DSX

> Audience: anyone (human or agent) building an APP in DSX markup, as opposed to building
> the framework. The normative document shape is
> [`dsx-anatomy.md`](https://github.com/despia-native/despia/blob/main/OpenSource/Documentation/reference/dsx-anatomy.md); every element, attribute
> and value is [`StackReference.md`](https://github.com/despia-native/despia/blob/main/OpenSource/Documentation/reference/StackReference.md); markup
> hygiene is [`dsx-best-practices.md`](https://docs.despia.com/framework/skills/dsx-best-practices). This file is the working
> knowledge between them: the mental model, the vocabulary map, and the mistakes that cost
> the most time. If you know React or React Native, read
> [`thinking-in-dsx.md`](../thinking-in-dsx/SKILL.md) first; before styling anything, read
> [`designing-an-app.md`](../designing-dsx-apps/SKILL.md).
>
> A complete worked app (list, detail, settings, onboarding, paywall) lives in
> [`examples/`](https://github.com/despia-native/despia/tree/main/OpenSource/Skills/examples) as a real project you can lint, build and run.

## 0. The one warning that saves hours

DSX is newer than every model's training data and resembles several things it is not.
There is no JSX, no `import`, no hooks, no `className`, no HTML tags, no `div`. Guessed
syntax fails the linter, and the linter is the contract: `despia lint` after
every edit is faster than any amount of reasoning about whether markup is legal.

```sh
npx despia lint     # zero errors, zero warnings, or it is not done
npx despia review   # the design bar's objective floor (a11y, tap targets, type scale)
npx despia build             # compile Components/**.dsx
npx despia dev               # serve + watch; open it and LOOK at the screen
npx despia doctor            # when a project will not build, this says why
```

Those five are the loop for writing. The loop for CHANGING a project that already exists is
[`review-your-app.md`](../reviewing-dsx-apps/SKILL.md), and it is the one an agent runs most:

```sh
npx despia describe Components/App.dsx   # the document as a contract and a map, not its bytes
npx despia graph state --names           # every name: who writes it, who reads it, what it gates
npx despia checkpoint --label "before X" # one command back, before a large change
npx despia set --rev <rev> Components/App.dsx 3 visible-if "dsx.api.orders.error"
npx despia verify --drive App            # every route in every api state, driven and counted
```

**Change an existing document by address, never by rewriting it.** `set`, `unset`, `declare`,
`value`, `rename`, `undeclare`, `insert`, `move`, `wrap`, `delete` and `rule` each write one
thing over the revision you read, refuse a stale one, and are refused when the write would
bring a new error. Write whole files only when you create them. Every other command the
toolchain has, with its flags and the two that 0.1.0 does not ship, is
[`using-the-cli.md`](../using-the-despia-cli/SKILL.md).

## 1. The mental model

- **One `.dsx` file is one component.** The file basename is the component name;
  capitalized tags mount components (`Components/Card.dsx` renders as `<Card/>`),
  lowercase tags are built-in elements.
- **A document is head + body.** The `<head>` (first child of the root, at most one) is
  the contract and the logic; the body is pure markup. Head order is canonical:
  `attribute · expects · event · variable (plain, then computed) · formula · action ·
  script · watch · style · component`.
- **Each screen is a surface with its own store.** `dsx.variable.*` is local to the
  surface; a pushed screen keeps its state while covered and restores it on pop. State a
  subtree shares is a declared `<context>` key; `dsx.global.*` is only for what has no mount
  tree (auth, entitlements, theme, anything a route guard or a `<server>` reads). Which goes
  where is [`structuring-an-app.md`](../structuring-dsx-apps/SKILL.md).
- **Logic is JSE**, a JavaScript subset: expressions, `if`/`for`/`while`, arrow lambdas,
  the array/string stdlib. No classes, no imports, no DOM, no `fetch` by default.
  Arithmetic is total (`1/0` is `0`). `{{ ... }}` interpolates any attribute.
- **Capabilities are modules on the bus**: `dsx.module.<name>.<action>(args)`, awaited
  for the result. Haptics, storage, camera, routing: everything native is a module call,
  never an import.

## 2. The vocabulary map

Do not guess tag names; these are the families and where the full tables live.

| Family | Tags | Reference |
|---|---|---|
| Layout | `stack` (axis by content), `vstack`, `hstack`, `zstack`, `scroll`, `spacer`, `grid`, `flow`, `scaffold` (safe areas) | [Elements · Layout](https://github.com/despia-native/despia/blob/main/OpenSource/Documentation/reference/StackReference.md#elements) |
| Content | `text`, `image` (`icon=` draws a symbol), `progress`, `spinner`, `divider`, `qrcode`, `Skeleton` | Elements · Content |
| Inputs (two-way) | `textfield`, `textarea`, `toggle`, `slider`, `picker`, `stepper`, `datepicker`, `segmented`, all with `bind=`; array-backed choices ride `optionsKey=` + `labelField`/`valueField` (`options=` is CSV) | Elements · Inputs |
| Collections | `list`, `grid` with `bind=` + `key=`; the row template is the child markup, row scope is `item` | [Lists](https://github.com/despia-native/despia/blob/main/OpenSource/Documentation/reference/StackReference.md#lists) |
| Structure | `button`, `pressable`, `row`, `sheet`, `popover`, `alert`, `tabs`, `form`/`field` | Elements · Structure |
| Media | `video`, `audio`, `canvas`, `lottie`, `rive` | Elements · Media |

`textfield` (and `textarea`) also take `enterkeyhint="enter|done|go|next|previous|search|send"`
and `autocapitalize="off|none|on|sentences|words|characters"`, the exact HTML attribute names
and values, so they read the same whether you know them from the web or are meeting them here
first. They set the soft keyboard's return-key label and auto-capitalization, and they work on
every lane (iOS, Android, web): `enterkeyhint` beats the label `keyboard=` would otherwise imply
for the return key, and an unrecognized value on either just leaves the platform default alone.

A `<button>` takes `variant="bordered|prominent|glass|glass-prominent"`: the word selects
among the platform's own button renderings, so `variant="glass"` and
`variant="glass-prominent"` give real Liquid Glass on iOS 26 and later and fall back to the
tonal and filled system buttons everywhere else, with no work from you.

Universal attributes work on every element: `visible-if`, `on:tap`, `href`, `id`, `ref`,
`enter`/`transition`/`anim`, `measure`/`container`, `tooltip`, `shortcut`, the
accessibility set (`role` and the `aria-*` words such as `aria-label`; the older `a11y*`
spellings are read until 1.0.0, never write them), and per-platform
suffixes (`icon:android="notifications"`).

Styling is standard CSS in the `style=` attribute, not a bespoke prop set: `border-radius: 24px;
corner-shape: squircle` rounds a corner with a superellipse instead of a circle, on every lane,
with a DSX polyfill on the two browser engines that do not yet render `corner-shape` natively.
Borders and box shadows follow the shaped corner automatically. See
[Corner shapes](https://docs.despia.com/framework/guides/styling#corner-shapes) in the styling guide.

## 3. State, in order of preference

1. **`<attribute as="x" default="expr"/>`** for anything the consumer passes in. The
   default is a JSE expression, so a string literal keeps its quotes:
   `default="'Hello'"`. Read as `dsx.attribute.x`, never write it.
2. **`<variable as="x">return 0</variable>`** for state this file owns. The body is the
   initializer.
3. **`computed="true"`** for every derivation. If a value follows from other state, it
   is computed, full stop. A `<watch>` that maintains a value is a lint finding and a
   bug factory.
4. **`<formula as="f" input:a="dsx.this.x">`** for a parameterized derivation used per row.
   An input wears `input:`; a bare attribute belongs to DSX and declares nothing. Read the
   formula by its plane: `{{ dsx.formula.f }}`, never bare and never called.
5. **`<action as="do">`** for named logic; the body runs the full statement grammar and
   can call other actions (`dsx.action.other()`).
6. **`<watch value="expr" on:change="...">`** for genuine side effects only (fire a
   haptic, log, kick a module call).
7. **`<context as="key"/>`** in a provider's head, and `<context from="key" use="a b"/>` in a
   consumer at any depth, for state a whole subtree shares. Read it as `dsx.context.a`, never
   write it; call the provider's action instead. `dsx.global` is the last resort, not the
   default ([`structuring-an-app.md`](../structuring-dsx-apps/SKILL.md)).

With a head present, every `dsx.variable.x` the file touches must be declared (as
`variable` or `expects`); the linter enforces it, which makes a file's state surface
enumerable by reading the head.

## 4. Lists

```xml
<list bind="dsx.variable.episodes" key="id">
  <hstack class="row" role="group" on:tap="dsx.module.route.push({ path: '/episode/' + dsx.this.id })" style="gap: 12px">
    <image src="{{ dsx.this.poster }}" style="width: 44px; min-width: 44px; height: 44px; min-height: 44px; border-radius: 8px"/>
    <vstack style="gap: 2px">
      <text value="{{ dsx.this.title }}" style="font-weight: 600"/>
      <text value="{{ dsx.this.subtitle }}" style="font-size: 13px; color: var(--dsx-secondary-label)"/>
    </vstack>
    <spacer/>
  </hstack>
</list>
```

- `bind=` names the array, `key=` the stable id field (`key="index"` for data with none).
- Row scope: `dsx.this` (the row's dict, `dsx.this.id`). A bare `item` reads null on every
  lane. A formula reads row fields via its inputs.
- Every list bound to an `<api>` needs its loading, empty and error faces, gated on
  `dsx.api.<as>.loading`, `dsx.api.<as>.data.length === 0` and `dsx.api.<as>.error`, all the
  same height (`.loading` is only true while there is no data yet; a refetch over kept data is
  `.refreshing`); the error face draws `dsx.api.<as>.error.message`, never the bare `.error`. See
  [`building-ui-that-does-not-flash.md`](../dsx-ui-without-flashing/SKILL.md) section 1 and
  [`designing-an-app.md`](../designing-dsx-apps/SKILL.md) section 5.

**The list-row laws.** Each of these was learned by looking at a rendered feed in a real
browser, and the worked example's oracle now asserts them structurally:

1. **Row text truncates, it never wraps**: `lineLimit="1"` on every line. A wrapped meta
   line with a dangling separator at the line end is the single fastest way to look broken.
2. **The LIST is the card.** The container around `<list>` owns the grouped surface
   (background, radius, `style="overflow: hidden"` so row highlights clip at the corners);
   rows paint no background of their own, so the platform's separators and highlight read
   correctly.
3. **One trailing element**: a value (a rating, a count) OR a disclosure chevron, never
   both. Two trailing elements starve the text column and everything ellipsizes.
4. **A list supplies its rows' horizontal inset** - the platform's own, and the same
   measure its separators use. A row template that adds its own `padding-inline` doubles
   it: the content lands twice as far in as the hairline, so every separator starts visibly
   left of the row's leading icon. A row owns its VERTICAL rhythm (`padding-block`) only.
5. **Give the flexible column `style="flex-grow: 1"`.** At the call site,
   give the row component `style="align-self: stretch"` so its actual root participates in
   the pressable's known column layout. A row that hugs its content leaves its trailing value
   floating short of the card edge.
6. **Budget the row for a 390pt phone.** Fewer facts rendered whole beat many facts
   ellipsized; move the overflow to the detail screen.
7. **Declared sizes are fixed frames.** `style="width: 36px"` measures 36 on every
   renderer; if a row feels cramped the fix is the content budget, never trusting a tile to
   shrink.

## 5. Navigation

- **Routes are state.** The route table lives in `dsx.config.json`; `route.path = '/x'`
  is a replace. The back stack is the route module:
  `dsx.module.route.push({ path })` · `pop()` · `replace({ path })` · `reset({ path })`.
- **`href` is the anchor attribute** on any element: declarative push, a real `<a>` on
  web (crawlable), interpolates (`href="/orders/{{ dsx.this.id }}"`). Prefer it for plain
  "go here" taps.
- **Component screens** (path-less) use the component verbs:
  `dsx.component.push('Detail', { attrs: { id: dsx.this.id } })` for a nav frame,
  `dsx.component.present('Paywall', { as: 'sheet', attrs: { plan: 'pro' } })` for a
  modal. `attrs` seeds the target's declared `<attribute>`s; `vars:` is legacy.
- **Back, Close and Skip POP; they are never `href`.** `href` always pushes, so a back
  affordance spelled `href="/"` stacks a second copy of where you came from under every
  tap (found in a real browser, not in the linter). The pattern that always works, on
  every renderer, reads the router's published `nav` plane:

```xml
<action as="back">
  if (dsx.variable.nav.canPop) { dsx.module.route.pop() }
  else { dsx.module.route.replace({ path: '/' }) }
</action>
```

  Pop when there is history; replace when deep-linked. A dismissed screen lands on the
  screen that opened it, never teleports home. The worked app uses this on every back,
  close and skip.

## 6. Components you write

- Attributes down, events up: the tag's attributes arrive as `dsx.attribute.*`; the
  component raises `dsx.event('save', { id })` and the consumer wires `on:save`.
- `<slot/>` renders the children the caller passed, in the caller's scope. A wrapper has
  ONE slot and the author arranges it with a stack (constitution Article 18); add a named
  slot (`<slot name="trailing"/>` + `slot="trailing"` on the child) only for a positioned
  region a stack cannot place, named for its position, never for its content (`footer`,
  `header` and `actions` are refused by `despia lint`).
- A page-local part that will never be reused elsewhere can be declared inline:
  `<component as="Row">...</component>` in the head registers it for this file's scope.
- A component boundary cannot forward a two-way `bind`; a reusable input takes `value`
  in and raises `on:change`.
- Components also arrive from packages: `despia search <query>` finds one,
  `despia add github:owner/repo` pins it, and its components join your tag namespace.
  A bare scaffolded project resolves only its own `Components/` plus the built-in
  elements; library components (`<Card>`, `<NavBar>`, ...) ship with framework packages.

## 7. The mistakes that actually happen

Each of these is a real failure mode observed in generated DSX; the linter catches most,
the build catches the rest.

1. **HTML or JSX leaking in**: `div`, `span`, `img`, `onClick`, `className`,
   `style={{...}}`. The spellings are `vstack`/`text`/`image`, `on:tap`, `class`,
   `style="..."`.
2. **Multi-statement inline handlers.** An inline `on:` holds one call or one
   assignment. More than that is a named `<action>`.
3. **Watch-maintained values.** Derived state is `computed="true"`.
4. **Mutating an attribute** (`dsx.attribute.x = ...`). Attributes are read-only inputs;
   the component raises an event and the owner changes the value.
5. **Imperative handles.** There is no `ref.current.clear()`. Design the value instead:
   clearing a signature is `dsx.variable.sig = []`. A method survives only when it changes something
   that is not state, and then it is a module action.
6. **Undeclared state.** With a head present, every touched variable is declared. The
   error reads like bureaucracy and is actually the feature: heads are the API.
7. **Guessed attribute names.** Presentation is STANDARD CSS and nothing else, so it is
   `style="font-size: 17px"` or a rule in the document's own `<style>` sheet, never a
   `fontSize=` attribute: the camelCase style dialect is deleted from the language and the
   linter refuses it, naming the CSS property to write. For the non-style words: `visible-if`,
   not `if`; `bind`, not `value=` plus `onChange` on two-way inputs.
8. **Rebuilding system controls out of stacks.** If it is a toggle, use `<toggle>`. The
   unstyled element already renders the platform's own control on every renderer.
9. **Skipping the loop.** Lint after every edit, build before done, open `despia dev`
   and look. A screen nobody looked at is not finished.
10. **Rewriting a whole document to change one value.** It re-reads the file into the window,
    writes every other byte back from memory and loses a concurrent edit silently. Use the
    editing verbs with `--rev` ([`review-your-app.md`](../reviewing-dsx-apps/SKILL.md)).
11. **An api drawn only on its happy path.** Blank while loading, blank when empty, and
    `{{ dsx.api.x.error }}` drawn raw is `api-error-as-content`, an error that refuses the
    build. Four faces, each gated.
12. **Half-done state.** A flag nothing writes, a variable nothing reads, a handler that does
    nothing. `despia graph state --names` lists them; the state rules report them as notices,
    which a build does not stop on, so read them.
13. **Revealing content on appear.** A flag flipped `on:appear` to show what was ready at load
    is a flash. Draw it at load; entry poses (`@starting-style`, `enter=`) never play on the
    first render anyway.

### Device and state you do not control: ask the member, show the reason, offer the remedy

Never branch on the platform or write your own "not supported" text. Ask the member:
`dsx.module.<chain>.availability.<member>` carries `available`, `ready`, `settled`, `condition`,
`degradation`, `remedy` and `explain` on every lane. Hold the control back until `settled`, enable
it on `ready`, show `explain` (one localized sentence, true on this device), and make the remedy
button call the member when `remedy.inCall` (it performs the fix: a system dialog or permission
prompt) or `permission.openSettings()` when `remedy.kind` is `open_settings`:

```xml
<button label="Scan" visible-if="dsx.module.bluetooth.availability.scan.settled"
        disabled-if="!dsx.module.bluetooth.availability.scan.ready" on:tap="dsx.module.bluetooth.scan()"/>
<text visible-if="dsx.module.bluetooth.availability.scan.explain !== null"
      value="{{ dsx.module.bluetooth.availability.scan.explain }}"/>
```

Run `despia describe <member> --target <t>` (with `--conditions condition:<member>=switched_off` to simulate
a state) to read what a member can report before you write the markup.
`dsx-best-practices.md` section 15 has the full pattern and every remedy kind.

## 8. Where deeper knowledge lives

- The whole CLI surface, command by command: [`using-the-cli.md`](../using-the-despia-cli/SKILL.md)
- Anatomy + a worked golden template: [`dsx-anatomy.md`](https://github.com/despia-native/despia/blob/main/OpenSource/Documentation/reference/dsx-anatomy.md)
- Every element and attribute: [`StackReference.md`](https://github.com/despia-native/despia/blob/main/OpenSource/Documentation/reference/StackReference.md)
- Design quality bar: [`designing-an-app.md`](../designing-dsx-apps/SKILL.md)
- The review loop before and after every change: [`review-your-app.md`](../reviewing-dsx-apps/SKILL.md)
- Where state goes, and when a document is two: [`structuring-an-app.md`](../structuring-dsx-apps/SKILL.md)
- Faces, motion and what the drive counts: [`building-ui-that-does-not-flash.md`](../dsx-ui-without-flashing/SKILL.md)
- Coming from React Native: [`thinking-in-dsx.md`](../thinking-in-dsx/SKILL.md)
- Custom gesture-driven controls: [`custom-ux.md`](https://docs.despia.com/framework/skills/custom-ux)
- Offline + caching behavior: [`offline-best-practices.md`](https://docs.despia.com/framework/skills/offline-best-practices)
- Backend routes and entities in the same project: [`writing-a-backend.md`](https://docs.despia.com/framework/skills/writing-a-backend)

## Transitions: names in CSS, the call in JSE

A thumbnail that grows into its photo, a card that expands in place, a viewer you pull down to
dismiss: all of it is two things, and only two.

1. **Name the participant in CSS**, with the standard property, from a sheet or an inline style:
   `.thumb { view-transition-name: photo-{{ dsx.this.id }}; }`. A name that resolves on both sides of a
   push, pop or present pairs automatically on web, iOS and Android. Nothing is called.
2. **Wrap a same screen state change in `dsx.transition`**, the JSE twin of the browser's
   `document.startViewTransition`: `dsx.transition(() => { dsx.variable.open = true })`. Awaited,
   it binds `{ ok, data: { skipped, backend, reason? } }` and never throws; the update always
   runs, whatever the lane animates.

The full screen viewer is a cover presented with the one new option:
`dsx.component.present('PhotoViewer', { as: 'cover', interactive: 'drag', attrs: { id } })`.
It arrives with the pair's flight, the photo follows a pull, and the release commits or springs
back on every lane; the close control, Escape, Back and the predictive gesture all play the same
departure.

Do not write `document.startViewTransition` in markup (there is no such door), do not give a
name to one side only and expect a flight (an unmatched name is silent by design), and do not
expect `::view-transition-group(x)` timing off the web (wrap it in `@supports selector(...)`; the
native lanes fly on the corpus schedule). Every rule with its case:
[`Documentation/guides/transitions.md`](https://docs.despia.com/framework/guides/transitions).

