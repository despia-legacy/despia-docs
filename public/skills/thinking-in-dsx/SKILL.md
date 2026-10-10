---
name: thinking-in-dsx
description: "The React and React Native to DSX translation table: props to attributes, hooks to declarations, refs to bound values, navigation libraries to the route table, plus the habits to drop entirely. Use whenever React or React Native fluency is shaping DSX code."
---

<!-- GENERATED from OpenSource/Skills/thinking-in-dsx.md in despia-native/despia.
     Edit the source, then: ruby ClosedSource/scripts/generate_agent_skills.rb -->

# Thinking in DSX when you were trained on React

> Audience: developers and AI agents fluent in React / React Native who are about to write
> DSX app code. Your product instincts transfer whole; your syntax instincts are the main
> source of broken markup. This file is the mapping. Its sibling for porting entire npm
> packages is [`porting-a-react-native-library.md`](https://docs.despia.com/framework/skills/porting-a-react-native-library),
> whose law applies here too: **carry over the design, never the code.** Where a JavaScript
> instinct produces DSX that runs and answers wrongly (`==`, `+`, a falsy check, `await` in a
> ternary, `try` in a lambda), the ledger is [`dsx-runtime-traps.md`](../dsx-runtime-traps/SKILL.md).

## 1. The posture

React renders a component tree from function calls and hooks; DSX declares a document.
There is no runtime you write, no render function, no hook rules, no dependency arrays,
no memoization layer. The document IS the program: the head declares the contract, state
and logic; the body declares the pixels; the kernel makes it reactive. When you feel the
urge to "wire something up", stop: in DSX the wiring is what the declaration already
means.

## 2. The translation table

| React / React Native | DSX | Note |
|---|---|---|
| JSX expression braces `{x}` | `{{ x }}` in any attribute | every attribute interpolates |
| props | `<attribute as="x"/>`, read `dsx.attribute.x` | read-only inside the component |
| `children`, compound `Card.Header` | one `<slot/>`; a stack inside it | slot content binds in the caller's scope; a named slot only for a positioned region (`trailing`, `bottom`, ...), Article 18 |
| `useState` | `<variable as="x">return 0</variable>` | store-backed, inspectable |
| `useMemo` / derived render values | `<variable computed="true">` | recomputed per read, never stale |
| a function taking row fields | `<formula as="f" a="dsx.this.x">` | the per-row derivation |
| `onPress={fn}` | `on:tap="dsx.action.fn()"` | inline handlers hold ONE call or assignment |
| `useEffect(fn, [dep])` | `<watch value="dep" on:change="..."/>` | side effects only; derived values are computed |
| `useEffect(fn, [])` | `on:appear` on the element | teardown is `on:disappear` |
| conditional render `{cond && <X/>}` | `visible-if="cond"` | plus `transition=` for free animation |
| `list.map(row => <Row/>)` | `<list bind="dsx.variable.list" key="id">` + row template | row scope is `dsx.this` |
| `FlatList` / `SectionList` | `<list>` / `<grid>` | virtualization is the element's job |
| `StyleSheet.create` / `className` | standard CSS in `style="..."`, or a `.card` rule in the document's `<style>` sheet + `class="card"` | tokens over hex: [`designing-an-app.md`](../designing-dsx-apps/SKILL.md) |
| context provider + `useContext()` | `<context as="session"/>` in the provider's head, `<context from="session" use="user cart"/>` in the consumer, read `dsx.context.user` | declared, linted, scoped to the subtree; [`structuring-an-app.md`](../structuring-dsx-apps/SKILL.md) |
| `useTheme()` | semantic color tokens (`var(--dsx-label)`) | the theme is the token plane, not a provider |
| React Navigation | the route table + `href` + `dsx.module.route.*` | navigation is state, not a library |
| `navigation.navigate('X', params)` | `dsx.component.push('X', { attrs: { ... } })` | `attrs` seeds declared attributes |
| modal libraries | `dsx.component.present('X', { as: 'sheet' })`, `<sheet>`, `<alert>` | detents included |
| `ref` + `ref.current.clear()` | **a bound value** | see section 3, the important one |
| `Animated` / Reanimated | `enter=` / `transition=` / `animationCurve=` + keyframes | the motion kernel, one duration ramp |
| PanResponder / gesture-handler | universal `on:drag*`, `on:pinch`, `on:longpress` | [`custom-ux.md`](https://docs.despia.com/framework/skills/custom-ux) |
| `SafeAreaView` | `<scaffold>` | |
| `Platform.OS === 'ios'` | attribute suffixes `label:ios=`, or `visible-if="dsx.platform.os == 'ios'"`; for a capability, `@supports` | a bare `os` reads null on every lane; losing suffixes are dropped at compile |
| `accessibilityLabel` | `aria-label` (and `role`, `aria-*` for the rest) | all renderers; the older `a11yLabel` spelling is read until 1.0.0, never write it |
| toast/haptic/storage hooks | `dsx.module.toast.*`, `dsx.module.haptic.*`, module calls | a capability is a module, not a hook |
| `fetch` in the component | a declared `<api>` block, or a `<server>` route | data declares itself; logic stays off the wire |

## 3. The imperative-handle rule

React hands you methods on a ref because it has no other channel. DSX has one: the value.
Before inventing an action, ask what state the method changes, and let the author write
that state.

```xml
<Signature bind="dsx.variable.sig" placeholder="Sign here"/>
<button label="Clear" on:tap="dsx.variable.sig = []" disabled-if="dsx.variable.sig.length == 0"/>
<button label="Undo" on:tap="dsx.variable.sig = dsx.variable.sig.slice(0, dsx.variable.sig.length - 1)"/>
```

Two methods became zero API, and what remains can be persisted, diffed, seeded in a test
or sent to a server. A method survives this test only when it changes something that is
not state (start the camera, present a sheet), and then it is a module action on the bus.

## 4. Habits to drop entirely

- **No `import`.** Elements exist; components resolve by file name; capabilities are
  module calls. Nothing is imported into a `.dsx` file, ever.
- **No state management library.** The store is the kernel's. `dsx.variable` is surface
  state, a `<context>` key is what a subtree shares, `dsx.global` is what has no mount tree,
  and all three are reactive everywhere they are read.
- **No effect choreography.** The dependency-array bug class does not exist: computed
  values cannot go stale and watches fire on real changes.
- **No per-platform component forks.** One markup runs on iOS, Android, web and desktop.
  Divergence is an attribute suffix or a `visible-if`, not a second file.
- **No pixel-pushing custom controls for things that are elements.** `<toggle>`,
  `<picker>`, `<datepicker>`, `<segmented>` are the platform's own controls. Rebuilding
  one out of stacks loses accessibility, dark mode and future OS updates in one move.

## 5. Habits to keep

- Component decomposition, props-down-events-up, controlled inputs: DSX's component
  grammar is deliberately the same shape (`<attribute>` in, `dsx.event` out).
- Designing the value shape first. The wire shape of a bound value is the real API.
- Empty, loading and error states as first-class UI. The bar is
  [`designing-an-app.md`](../designing-dsx-apps/SKILL.md); it applies verbatim, and every `<api>` has the
  three faces [`building-ui-that-does-not-flash.md`](../dsx-ui-without-flashing/SKILL.md) draws.
- The verification loop. Where you would have reloaded the simulator, run
  `despia dev`, open the page, and look at it. Lint (`despia lint`) replaces
  the type-checker reflex after every edit, and `despia describe` replaces opening the file to
  find out what a component takes ([`review-your-app.md`](../reviewing-dsx-apps/SKILL.md)). The whole command surface, including the two
  commands 0.1.0 does not ship, is [`using-the-cli.md`](../using-the-despia-cli/SKILL.md).
