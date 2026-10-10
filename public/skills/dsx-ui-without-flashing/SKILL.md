---
name: dsx-ui-without-flashing
description: "Build DSX screens that never flash, jump or draw a blank, around the eight stable UI laws the runtime keeps on every lane (one action one frame, loading only with nothing to show, swaps in one place, removals that shrink, controls that keep their size, reads that land together, nothing opening onto nothing, a settled first paint) and the part of each that is still yours: the loading, empty and error faces of every api at one height, literal conditional labels, entry and exit poses, framed media, a scroll around a list that can outgrow the page, drawing the state an answer was asked for, and the lint warnings and drive counters that catch each one. Use when a screen loads data, when anything appears, disappears or animates, and before calling a screen done."
---

<!-- GENERATED from OpenSource/Skills/building-ui-that-does-not-flash.md in despia-native/despia.
     Edit the source, then: ruby ClosedSource/scripts/generate_agent_skills.rb -->

# Building UI that does not flash, jump or draw a blank

> Audience: anyone writing a DSX screen that loads data, appears, disappears or changes. The
> design bar is [`designing-an-app.md`](../designing-dsx-apps/SKILL.md) section 5 (every screen has four
> states); the layering is [`structuring-an-app.md`](../structuring-dsx-apps/SKILL.md) section 4b (every
> api has three faces before its happy path); the loop that measures all of it is
> [`review-your-app.md`](../reviewing-dsx-apps/SKILL.md). The motion law is
> [`reference/style/motion.md`](https://github.com/despia-native/despia/blob/main/OpenSource/Documentation/reference/style/motion.md).

A screen that works can still look broken, and the frames between two correct screens are where
it breaks. `despia verify --drive` counts every defect below after every state change and every
press, rather than leaving it to a person to notice:

| defect | what a person sees | what the drive counts |
|---|---|---|
| **flash** | a region goes blank and comes back | an element drawn empty and then full in the page's first frames, or one that was full, went empty and came back |
| **jump** | content shoves itself down or sideways after it has drawn | a sample in which an element's layout box moved more than 2 px without its parent carrying it (transforms are not counted) |
| **press shift** | a control, or what is next to it, moves for a moment after a press | a box that moves within 600 ms of a press, which the web's own layout-shift metric forgives |
| **remount** | a field loses its caret, a list its scroll, an editor its state | an element removed and added again under the same identity inside one gesture |
| **stack** | two faces on screen at once, then a collapse | a frame in which a leaving element and its replacement both take space |
| **refusal as content** | somebody else's error sentence where the answer belongs | a text node whose whole content is an api envelope's error string |
| **dead press** | a control that does nothing | a press that changes no state, no address, no request and no text |

Zero is the bar for all of them. Most of that zero is the runtime's job now: DSX owns the
conditional, the list, the fetch, the action runner and all three renderers, so it makes the
right behaviour the default. Section 0 is the nine laws it keeps and the part of each one that
is still yours; the rest of this page is how to write a screen that meets them.

## 0 · The nine laws

The design is [`proposals/stable-ui.md`](https://github.com/despia-native/despia/blob/main/OpenSource/Documentation/architecture/proposals/stable-ui.md).
Each law says what the runtime does on the web, on iOS and on Android, what is left to you, and
what `despia lint` tells you when you write the spelling that breaks it.

1. **One action, one frame.** The writes of one synchronous stretch of an action are seen
   together, so `dsx.variable.x = false; …; dsx.variable.x = true` over a `visible-if` tears
   nothing down and rebuilds nothing. Yours: nothing. The drive counts a **remount** if
   something still flips.
2. **Loaded content is never hidden behind loading again.** `.loading` is true only while a read
   has nothing to show yet. A read that starts while `.data` is present (an input in its url
   changed, it was called, a gate holds it) publishes `.refreshing` and keeps the old data
   drawn. Yours: gate the loading face on `.loading` (section 1); if a readout must also show
   during a refresh, gate it on `.loading || .refreshing` in a row that is always there. A
   submit (any method but GET) is `.loading` for every send.
3. **A swap happens in one place.** When one face leaves and another enters in its place, the
   newcomer lays out alone and the leaving face fades over it, out of the layout. Yours: declare
   the exit pose (section 4). The drive counts a **stack** if two faces ever take space at once.
4. **A removal shrinks; it does not snap.** A leaving element with an exit pose gives its space
   back as it fades. Yours: the same exit pose.
5. **A control keeps its size across its states.** A control's `label=`, or a single-line
   `<text>` inside a control, whose value is a conditional between literals keeps the widest
   literal's box in every state (section 5). Yours: spell the pending state that way.
   `pending-resizes-control` warns when a control's class, style or child `visible-if` reads a
   pending flag instead.
6. **Reads started together show up together.** Reads started by one commit (one write that
   changes several api inputs, one route) commit their answers together, when the last one
   settles or 300 ms after the first one did. Yours: draw the state your answer was ASKED FOR,
   not the selection that asked (section 6).
7. **Nothing opens onto nothing.** A disclosure over a list that can be empty draws a "none" row
   or does not open. `disclosure-empty-body` warns on a body a toggle opens whose only content is
   a list.
8. **First paint is the settled paint.** A persisted value is on the first frame, fonts never
   reflow the first screen, and an empty `{{ }}` text keeps its line on every lane. Yours: never
   reveal content on appear (section 2), give media a box (`media-without-size`), and put a list
   that can outgrow a full-height page in a `<scroll>` (`content-overflow-page`).
9. **A pending state appears late and leaves gently.** The framework's own waiting states, an
   api's `.loading` and `.refreshing` and a declared action's read-only
   `dsx.action.<name>.pending`, are revealed 150 ms after the wait starts, held for at least
   400 ms once revealed, and replaced by a 150 ms crossfade (instant with reduced motion). A wait
   shorter than the reveal paints no frame of its face. Logic, formulas, watches and
   `disabled-if` read the raw state at once. Yours: draw the wait from `.pending` or `.loading`,
   never from a word you write before an await (section 8). `transient-pending-write` warns on
   the word; it never delays it, because a value you write is yours.

One more warning belongs to Law 2's family: `clear-before-await` reports an action that empties
a key, awaits, and writes it again, which draws the empty value for the whole wait. Write the
key once, after the await.

## 1 · Every api draws four faces, and each one holds the space (Law 2)

A request is in four states: in flight, answered empty, failed, answered. The reserved reads
are `dsx.api.<as>.loading`, `.data`, `.error` (an object: `{ status, message, body }`),
`.refreshing` and `.status` ([`reference/jse.md`](https://github.com/despia-native/despia/blob/main/OpenSource/Documentation/reference/jse.md)). Gate one
face on each, and give the faces the SAME minimum height, so moving from one to the next is a
repaint and never a reflow:

```dsx
<vstack style="gap: 12px">
  <head>
    <api as="orders" url="https://example.com/orders"/>
    <style>
      .face { min-height: 240px; gap: 8px }
      .placeholder { height: 56px; border-radius: 12px; background: var(--dsx-fill) }
    </style>
  </head>
  <vstack class="face" visible-if="dsx.api.orders.loading">
    <vstack class="placeholder"/>
    <vstack class="placeholder"/>
    <vstack class="placeholder"/>
  </vstack>
  <vstack class="face" visible-if="dsx.api.orders.error">
    <text value="The orders could not be loaded."/>
    <text value="{{ dsx.api.orders.error.message }}" style="color: var(--dsx-secondary-label)"/>
    <button label="Try again" on:tap="dsx.api.orders()"/>
  </vstack>
  <vstack class="face" visible-if="dsx.api.orders.data.length === 0">
    <text value="No orders yet"/>
  </vstack>
  <list bind="dsx.api.orders.data" key="id">
    <text value="{{ dsx.this.title }}" lineLimit="1"/>
  </list>
</vstack>
```

What each part is for:

- **The loading face is placeholders shaped like the content**, 56 px rows where 56 px rows will
  land, not a lone spinner in a void. When the answer arrives the rows repaint in place.
- **The error face says what failed in the person's words first**, then the runtime's message
  in a secondary colour, then the way out. `dsx.api.orders()` is the re-read: calling a GET
  block runs it again.
- **The error text sits inside a gate on the same error.** An element that draws
  `dsx.api.x.error` with nothing gating it is `api-error-as-content`, an ERROR that refuses the
  build, because it is blank when nothing failed and a refusal drawn as data when something
  did. `{{ dsx.api.orders.error }}` on its own draws `[object Object]`; draw `.message`.
- **The empty face is a gate on the data**, `data.length === 0`, which is the only shape that
  can draw something when the answer arrives with nothing in it.
- **`on:error` on the `<api>` counts as the error face** when a failure is better handled than
  drawn (a toast, a redirect to sign in).
- **You decide what an error is.** A 200 whose body says it failed is still an error to the
  person. Say so on the block with `error-if="{{ dsx.this.data.success === false }}"`. It is judged
  once per answer, with `dsx.this.status`, `dsx.this.headers` and `dsx.this.data` in scope, and it
  replaces the status test both ways: an expected 404 can be a success. The error face, `on:error`
  and the stale data you keep all follow from it.
- **`retry=` only re-sends a request that never got an answer.** "What to do with an answer you
  don't like is yours, in on:error." A retry on a bad answer is your own state and your own
  condition, then the call again:

  ```xml
  <variable as="attempts">return 0</variable>
  <api as="report" url="https://example.com/report" error-if="{{ dsx.this.data.status === 'pending' }}"
       on:error="if (dsx.variable.attempts < 3) { dsx.variable.attempts = dsx.variable.attempts + 1; await dsx.wait(1000); dsx.api.report() }"
       on:success="dsx.variable.attempts = 0"/>
  ```

- **An action reacts to its OWN call** by awaiting it (`const r = await dsx.api.save({ … });
  if (r.ok) …`), or by handing the call its own handlers:
  `dsx.api.feed(null, { message: () => { … dsx.this.data … } })`. The tag's `on:*` stays the
  default for every call.

The drive sets five states per api: `default`, `<as>:loading`, `<as>:empty`, `<as>:error` and
`<as>:refused` (the call succeeded and the answer said no, status 403). It sets each one by
answering the api's own request in the page: loading holds it in flight, empty answers 200 with
`[]`, error answers 500 and refused 403, so the kernel builds the real envelope from a real
response. A face you declared that draws exactly what the default drew fails the row ("the face
did not render"), and the screenshots in `.despia/drive/<run>/` are one picture per face.

**`.loading` means nothing to show yet** (stable UI Law 2). A read that starts while `.data` is
present, because an input in its url changed, because it was called, or because a gate holds it,
publishes `.refreshing` and keeps the old rows drawn until the answer replaces them. So the
loading face above never appears over a list that is still on screen and never shoves it down.
If a readout must also show during a refresh (a small "Updating" line in a reserved row), gate it
on `.loading || .refreshing`. A submit is `.loading` for every send, which is what a `Saving…`
label reads.

`api-without-faces` counts a gate on `.loading`, `.refreshing` or `.status` as the loading face,
which is what all three lanes publish; a gate on `isLoading`, which no lane publishes, is not
one, and the notice tells you to write `.loading`.

## 2 · Never fake an entry by hiding what is already there

The most common flash is written on purpose: a flag that starts false, flips true on appear,
and gates the content, so the page draws empty and then full:

```text
<vstack on:appear="dsx.variable.ready = true">
  <head>
    <variable as="ready">return false</variable>
  </head>
  <vstack visible-if="dsx.variable.ready">
    <text value="Welcome back"/>
  </vstack>
</vstack>
```

That is a flash by definition and it lints clean, but **the drive catches it**: its sampler
runs from navigation start, so content that was ready at load and revealed on appear is one
flash (measured on exactly this document: `/appear  default  1` in the flash column, and the
run fails against the zero budget). Content that is ready at load is drawn at load. An
entrance belongs to things that ARRIVE after the page has settled, and DSX already knows the
difference.

## 3 · Entry poses never play on the first render (Law 8)

Write the entry pose freely with `@starting-style` in the component's sheet, or `enter=` on the
element. An element present when the document first composes never matches it and simply
appears; an element inserted afterwards animates in. On the web the sheet compiler gates every
`@starting-style` rule on `[data-dsx-settled]`, which the runtime stamps two frames after the
first composition; on iOS and Android the lowering resolves no entry pose for a node in the
first composition. One law, three lanes, recorded in
`OpenSource/Conformance/motion/starting-style-settle.json`.

```dsx
<vstack style="gap: 12px">
  <head>
    <variable as="saved">return false</variable>
    <style>
      .toast { opacity: 1; transition: opacity 160ms ease }
      @starting-style {
        .toast { opacity: 0 }
      }
      @ending-style {
        .toast { opacity: 0 }
      }
    </style>
  </head>
  <button label="Save" on:tap="dsx.variable.saved = true"/>
  <vstack style="min-height: 24px">
    <text class="toast" visible-if="dsx.variable.saved" value="Saved"/>
  </vstack>
  <button label="Dismiss" on:tap="dsx.variable.saved = false"/>
</vstack>
```

The toast fades in when `saved` turns true, fades out through `@ending-style` when it turns
false, and never plays at load. Its row keeps `min-height: 24px` whether or not it is showing,
so the Dismiss button under it never moves (section 5).

Keep motion short and quiet: a fade or a small offset, under about 200 ms. Never scale a control
down on press.

## 4 · Exits fade, they never pop (Laws 3 and 4)

A surface that leaves animates out as surely as one that arrives. Three spellings, the same
pose underneath:

- **`@ending-style`** in the sheet, the CSS spelling, as in the block above;
- **`transition="fade"`** (or `scale`, `slide-top`, `slide-bottom`, `slide-left`,
  `slide-right`) on an element whose `visible-if` flips, which animates both directions;
- **`exit=`** on a page root, the way out of a presented surface.

`keep="true"` keeps an element mounted and fades its opacity instead of inserting and removing
it. Use it for glass and for anything expensive to rebuild, so showing it again is never a
re-initialisation and never a flash.

You do not position the leaving element yourself. When a face swaps for another in one change,
the runtime takes the leaver out of the layout while it fades, so the two never stack; when an
element leaves with nothing in its place, its space closes over the fade. Declaring the pose is
the whole of your part.

## 5 · Nothing moves once it has drawn (Laws 5 and 8)

A jump is almost always something appearing ABOVE content that has already drawn. The fixes are
all ways of saying where things go before they arrive:

- **Reserve the slot.** A status line, a banner or a toast that can appear gets a row with a
  `min-height` that is there whether or not it is showing (the toast above).
- **Give media a frame.** An image, a video or an avatar declares its box, so the load fills a
  frame instead of growing one:

```dsx
<hstack style="gap: 12px">
  <head>
    <attribute as="photo" default="''"/>
    <attribute as="name" default="''"/>
  </head>
  <image src="{{ dsx.attribute.photo }}" style="width: 48px; min-width: 48px; height: 48px; min-height: 48px; border-radius: 24px"/>
  <text value="{{ dsx.attribute.name }}" lineLimit="1"/>
</hstack>
```

- **Faces share one height** (section 1), so loading to content is a repaint.
- **A control's pending state is a literal choice.** Write the label as a conditional between
  words and the control keeps the widest word's box whether it is saving or not, on every lane
  (Law 5). Swapping a spinner in and a word out as children of the control changes its size, and
  `pending-resizes-control` says so:

```dsx
<hstack style="gap: 8px; align-items: center">
  <head>
    <api as="save" method="POST" url="https://example.com/notes"
         on:error="dsx.log('the note was not saved')"/>
  </head>
  <button label="{{ dsx.api.save.loading ? 'Saving…' : 'Save' }}"
          disabled-if="dsx.api.save.loading" on:tap="dsx.api.save()"/>
  <text value="Changes are saved to your account"/>
  <text value="Saved" visible-if="dsx.api.save.data != null"/>
</hstack>
```

A submit is `.loading` for every send (Law 2), so the label reads the request itself and there is
no flag to keep in step with it.

- **A list that can outgrow the page scrolls.** A `repeat=` or a `<list scroll="false">` in a page
  that fills the screen runs past the bottom and overlaps whatever follows once there are enough
  rows. Put it in a `<scroll>`; `content-overflow-page` warns where one is missing.
- **Truncate, do not wrap**, where a line's length depends on data: `lineLimit="1"`.
- **Overlay what is transient**: a sheet, a popover or an `<alert>` is drawn above the page and
  moves nothing in it.
- **`enter=` is layout-stable**: the element is at its final layout from the first frame and
  the animation is offset, opacity and scale only.

## 6 · Draw the state your answer was asked for (Law 6)

The runtime lands reads that one commit started in one commit, so a panel over three reads never
paints a mix of old and new answers. What it cannot hold is a write that happens AT the press.
The Canvas showed the class: picking a document flipped its `level` at once, so the inspector
drew the new level's sections over the old document's head for the few hundred milliseconds the
head read took, three painted states for one press. The fix is a line of state: record, when the
answer lands, what it was asked for, and draw from that.

```dsx
<vstack style="gap: 8px">
  <head>
    <variable as="picked">return 'a'</variable>
    <variable as="shownFor">return 'a'</variable>
    <api as="doc" url="https://example.com/docs/{{ dsx.variable.picked }}"
         on:success="dsx.action.answered()"/>
    <action as="answered">dsx.variable.shownFor = dsx.variable.picked</action>
  </head>
  <pressable on:tap="dsx.variable.picked = dsx.variable.picked == 'a' ? 'b' : 'a'">
    <text value="Switch"/>
  </pressable>
  <text value="Document {{ dsx.variable.shownFor }}"/>
  <text value="{{ dsx.api.doc.data.title }}" visible-if="dsx.api.doc.data != null"/>
  <text value="Loading" visible-if="dsx.api.doc.loading"/>
  <text value="Could not load" visible-if="dsx.api.doc.error"/>
</vstack>
```

The heading and the body now change in the same commit as the answer. Measured on the Canvas,
every pick went from three painted states to two: the old document, then the new one.

## 7 · How the drive measures it

```sh
despia verify --drive <route>            # every route, every api face, every control pressed once
despia verify --drive <route> --no-press # the states and the shots, pressing nothing
despia verify --device ios               # the same drive on the booted simulator, the release gate
```

Per route and per state, the drive (`OpenSource/Engine/TypeScript/packages/cli/src/drive.ts`):

1. sets an api face by answering the api's own request (section 1), before it navigates;
2. samples EVERY element from navigation start, with the sampler installed before the page's
   own scripts: every animation frame for the first **1.5 s**, then every **100 ms**, and each
   state gets **2 s** to settle before the row is read. An element drawn empty and then full
   in those first frames, or one that was full, went empty and came back, is one **flash**,
   counted at the topmost element; a sample in which some element's layout box moved more
   than **2 px** without its parent carrying it is one **jump** (a font swap that reflows
   every line is one jump, and a transform is an animation you chose, so it is not counted);
3. walks every text node for an api error string drawn as content (a **refusal**): the words
   of the bodies it served, and the kernel's own `error.message` for that api. The message
   drawn INSIDE that api's declared error face (an element gated on `dsx.api.<as>.error`) is
   the face doing its job and is not counted; the same words anywhere else are, which is the
   law `api-error-as-content` enforces at lint time;
4. presses every visible control once, each on the route as a person arrives at it, and
   compares the page's signature (state, address, requests made, text, the router's frames)
   before and after: no change is a **dead press**. A link to `mailto:`, `tel:` or another
   origin is a hand-off, counted as pressed and never dead. For 600 ms after each press it
   samples every frame, and a layout box that moves in that window is a **press shift**, the
   "button jumps when pressed" class the web's own layout-shift metric forgives within 500 ms
   of input; the pressed element's own declared transition or animation is not counted. In
   the same window a MutationObserver counts a **remount** (an element removed and added
   again under the same identity, which loses its caret, scroll and state even when no frame
   shows it) and every frame counts a **stack** (a leaving element and its replacement both
   taking space);
5. takes a screenshot as the face arrives, before any press, and writes the row. A face is
   judged by which of its api's gated elements are drawn as well as by the picture, so a face
   below the fold is not called unrendered.

The budgets are the project's, in `dsx.config.json`, and default to zero:

```json
{ "drive": { "flash": 0, "jump": 0, "deadPress": 0, "pressShift": 0, "remount": 0, "stack": 0 } }
```

Raising one is a decision a reviewer reads in the diff; it is never the fix.

**What the counters see, measured on the blocks of this page.** Section 2's reveal on appear
reads `flash 1`; section 5's toast with its reserved row removed reads a press shift once Save
is pressed; a still page reads `0 0`, padded root or not. Zeros are still the floor, not the
proof: the screenshots and your own eyes in `despia dev` are the rest of it.

A route whose controls could not be addressed is reported as "NO ADDRESSABLE CONTROL" and
driven for its states only, which is not the same as clean. A redirect row is reported with
the status and location the server answered and is not driven, and a dynamic route is driven
at a link one of your pages draws, or named as not driven when none does.

## 8 · A fast await paints nothing: keep the old, reveal the wait late

The owner's observation, 2026-09-25, on the push proof app: tapping Register made the status line
flash "asking" and flash back. The action wrote a waiting word, awaited, and wrote the answer.
Law 1 flushes at every real `await`, so the word is on screen for exactly as long as the await
lasts. Measured on the web (`evidence/stable-ui-pending-2026-09-25/`): a 50 ms await paints it in
2 to 3 frames at 60 Hz, a 200 ms await in 11 to 12, and an 800 ms await in 47 to 48. Two frames is
a flash, and a person sees it.

Most waits after a tap are fast: a permission already granted, a cached read, a local module
call. Present them in this order:

1. **Data applies at once, and the drawn value changes once.** Keep what is on screen until the
   answer lands, and write it once, after the await. Never write a waiting word into the value you
   display.
2. **If the wait needs a face, draw it from the framework's wait (Law 9).** Gate it on
   `dsx.action.<name>.pending` for an action, or on `.loading` for an api, in a slot that is
   always laid out (a `min-height`, or an overlay), so it moves nothing. The runtime reveals it
   150 ms late, holds it at least 400 ms once shown, and crossfades it out. A wait that ends
   sooner paints no frame of it. Nobody writes `.pending`: the runner derives it from the
   action's own entries, awaits included, so an early `return` or a `throw` clears it too.
3. **Let it leave gently.** The presenter's crossfade does it. An explicit exit pose of yours
   (`@ending-style`) plays instead.
4. **A control's own pending label is a literal choice** (section 5, Law 5), so it never resizes.

```dsx
<vstack style="gap: 8px">
  <head>
    <variable as="status">return 'no push token available'</variable>
    <action as="register">
      const t = await dsx.module.notify.token({});
      dsx.variable.status = t.ok ? 'token ' + t.data.kind : 'token error ' + t.error;
    </action>
    <style>
      .wait-slot { min-height: 18px }
      .wait { opacity: 0.6 }
    </style>
  </head>
  <text value="{{ dsx.variable.status }}"/>
  <vstack class="wait-slot">
    <text class="wait" value="Registering…" visible-if="dsx.action.register.pending"/>
  </vstack>
  <button label="Register" on:tap="dsx.action.register()"/>
</vstack>
```

Measured on the exported web app (`evidence/stable-law9-runtime/`): a 50 ms wait paints zero
frames of the waiting word (a hand-written word painted five), a 200 ms wait reveals it at about
157 ms and holds it to about 549 ms instead of pulsing, and an 800 ms wait draws it from the
reveal to the answer. The button keeps its width throughout. The same clock and corpus
(`OpenSource/Conformance/state/pending-presenter.json`) run on iOS, Android and Compose Desktop.

**What not to do.** Do not write `'asking'`, `'… calling x'` or `'sending…'` into the line that
shows the result. Do not clear a value before an await (`clear-before-await` warns). Do not swap
a spinner in as a child of a control (`pending-resizes-control` warns). Do not put the wait in a
new row that pushes content down when it appears.

**If you write a waiting word anyway.** `transient-pending-write` warns when an action writes a
key before an await and replaces it after, and when it keeps a `busy` flag by hand around one: it
names `dsx.action.<name>.pending` as the replacement. It is a warning; the runtime never delays or
reinterprets a value you write. The design is `proposals/stable-ui.md` §11.

## The checklist

- Every `<api>`: a loading face shaped like the content, an empty face with words and a way
  forward, an error face that says what failed and offers a retry, all the same height. A
  readout that must also show during a refresh reads `.loading || .refreshing`.
- No `.error` drawn outside a gate on `.error`; draw `.error.message`.
- No flag flipped `on:appear` to reveal content that was ready at load.
- Entry poses in `@starting-style` or `enter=`, exits in `@ending-style`, `transition=` or
  `exit=`; short, quiet, never a pop, never a press scale.
- Every slot that can appear is reserved; every image has a frame.
- A control's pending state is a literal conditional label, never a child that comes and goes.
- A disclosure over a list draws "none" when the list is empty, or does not open.
- An action writes a key once, after its await, never empty before it.
- A fast await paints nothing: the drawn value changes once, after the await, and a wait face
  sits in a reserved slot gated on `dsx.action.<name>.pending` or `.loading` (Law 9).
- A list that can outgrow a full-height page sits in a `<scroll>`.
- A surface draws the state its answer was asked for.
- `despia verify --drive` at zero, and the screenshots looked at.
