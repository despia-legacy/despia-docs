---
name: reviewing-dsx-apps
description: "The loop to run before and after every change to a DSX project: despia describe the project and the document, despia graph state --names, despia lint, despia checkpoint before a large change, fix every finding by address with the editing verbs over a revision instead of rewriting files, despia verify --drive every route and api face, then build or deploy. What each finding means and the verb that fixes it, with a real run. Use before editing an existing project, before calling any change done, and before build, export, deploy or ota."
---

<!-- GENERATED from OpenSource/Skills/review-your-app.md in despia-native/despia.
     Edit the source, then: ruby ClosedSource/scripts/generate_agent_skills.rb -->

# Review your app: the loop before and after every change

> Audience: an agent (or a person) about to change a DSX project, and about to call the change
> done. The layering it checks is [`structuring-an-app.md`](../structuring-dsx-apps/SKILL.md); the motion
> it checks is [`building-ui-that-does-not-flash.md`](../dsx-ui-without-flashing/SKILL.md); every
> command and flag is [`using-the-cli.md`](../using-the-despia-cli/SKILL.md), and when that page and
> `despia --help` disagree, the help is right, because it is read from
> `OpenSource/Engine/TypeScript/packages/cli/src/despia.cli.dsx`.

An agent builds what it can see. A project it has to read whole is a project it has read
badly: the window fills with bytes, the change lands against a stale picture, and what is left
behind is half-done state (a flag nothing writes, a variable nothing reads, an api with no
error face) that nobody asked for and nothing reported. The toolchain now answers every one of
those questions directly. This is the order to ask them in.

## The loop

Run it BEFORE a change, to know what is there, and AFTER, to know what you did.

1. **Describe** the project, then the document you will touch. Read the contract, not the
   file.
2. **Graph the state**: every name with its writers, its readers and the faces it gates.
3. **Lint.** Every finding has an id, a level and a fix.
4. **Checkpoint** before a large change, so going back is one command.
5. **Fix by address** with the editing verbs, over the revision you read. Never rewrite a file
   to change a value.
6. **Describe, graph and lint again.** The lists you read in steps 1 and 2 should now be empty
   or smaller, never longer.
7. **Drive** the routes and every api's faces: `despia verify --drive`. Read the table, then
   open the screenshots.
8. **Review the held change**, approve it, and only then **build, export, deploy or ota**.

```sh
despia describe                                  # the project
despia describe Components/App.dsx               # one document, as a contract and a map
despia graph state --names                       # every name, who writes it, who reads it
despia lint                                      # the findings, with their levels
despia checkpoint --label "before the orders faces"
despia revision Components/App.dsx               # the precondition every editing verb states
despia set --rev <rev> Components/App.dsx 2 visible-if "dsx.api.orders.error"
despia verify --drive App                        # every route in every state, driven
despia change list                               # what this worktree holds for review
despia change approve <id> --rev <rev>
despia build                                     # climbs the guardian, takes a checkpoint
```

### 1 · Describe: the contract instead of the file

`despia describe` with no argument answers the project: documents biggest first with their
line and declaration counts, routes, every api with its method and url, packages and config.
`despia describe <document>` answers one document, by its project-relative path
(`Components/App.dsx`; a bare component name is refused as `no_such_document`):

- **the head as a contract**: the boundary (attributes in, events out), variables (computed,
  plain, persisted), every `<api>` with the three faces it draws or does not draw;
- **what the state graph says** about those names (the same lists step 2 prints);
- **the body as addresses**: `1`, `3.0`, `3.0.0`, each with its tag, the words it carries and
  the attributes it has. The address is what every editing verb takes. Address `0` is the head,
  so the first body element is `1`;
- **the size**, measured against the split signals of
  [`structuring-an-app.md`](../structuring-dsx-apps/SKILL.md) section 4.

The answer is bounded by construction (a fixed set of questions has the same size whether the
document is 200 lines or 20,000), and `--json` carries every row. It is also an MCP tool
(`despia mcp`), with the same answer.

**The App Description is the project answer, kept.** Every build writes it beside its output as
`dist/app-description.json`: routes, every document's kind and public contract (attributes,
events, apis and the faces each draws), components, context edges, mounts and modules, sorted
and with no timestamp ([`app-description.md`](https://github.com/despia-native/despia/blob/main/OpenSource/Documentation/reference/app-description.md)).
Read it before a change as the map of the app, and diff it after one: a line gone from
`routes`, `attributes` or `events` is something a caller, a link or a parent document may still
use. `despia describe --json` carries the last build's copy as `appDescription`, with `current`
false when a document changed after that build.

### 2 · Graph the state

`despia graph state --names` prints every declared name in the project (`--document` narrows
it to one) and the lists a reviewer asks for: **never read**, **written and never read**,
**never written but their initializer**, the **mode flags** (a name read only where it gates a
face), and names **written from more than N units of logic** (`--writers`, default 3). The
lint rules below count reads with this same walker, so a rule and the report never disagree
about what a read is.

### 3 · Lint, and what the level means

`despia lint` prints `file:line: level: sentence`, and every sentence names its fix. The level
is data, in `OpenSource/Conformance/lint/facts.json` `severityTable`, and it decides what a
build does:

- **error** and **warning** each REFUSE an artifact: `build`, `export`, `deploy` and `ota` stop
  with "No artifact was written".
- **notice** is printed and never counted. The state family lands as notices for one minor, so
  a clean exit code is not a clean project: read the notices.

**Stock only.** A reference app, or any app that wants the platform look and nothing else, declares
`"lint": { "stockOnly": true }` in `dsx.config.json`. `despia review` then reports every authored
`style=` (S1) and every `--dsx-*` custom property the app sets, in markup or in its own sheets (S2),
as an ERROR. The fix is never in the app: a stock component that needs re-pinning is a DSX defect,
fixed in the framework so every app gets it (the Despia console runs this way).

### 4 · Checkpoint before a large change

`despia checkpoint --label "<sentence>"` stores the authored tree (documents, sheets, config,
assets; never `node_modules`, `dist` or `.despia`) under an id and a sentence.
`despia checkpoint list` shows them newest first; `despia checkpoint back` shows the diff and
asks, `--to <id>` names one, `--yes` does not ask. A restore is itself a checkpoint, so going
back is reversible too. Checkpoints are also taken on their own before every `build`,
`export`, `deploy` and `ota`, on every approved change and before any `--force`. In a project
with a repository they live on a private ref nobody walks or pushes; without one, in a store
under `.despia`. Neither is anything you manage. The decision is
[`adr/0014-checkpoints.md`](https://github.com/despia-native/despia/blob/main/OpenSource/Documentation/architecture/adr/0014-checkpoints.md).

### 5 · Fix by address, over a revision

Thirteen verbs, one act each, each one call to the same document-model door the MCP tools
write through, so a verb and an agent's tool call write the same bytes:

| verb | what it writes |
|---|---|
| `despia revision <document>` | nothing: the revision of the exact bytes, which every writer below states |
| `despia set <document> <address> <attribute> <value>` | one attribute on one element |
| `despia unset <document> <address> <attribute>` | takes one attribute off |
| `despia declare <document> <kind> <name>` | one head row (`attribute`, `context`, `event`, `api`, `variable`, `formula`, `action`); `--value`, `--computed`, `--mode provide\|consume` |
| `despia value <document> <kind> <name> <value>` | one declaration's value or body in place; `--field` picks an api's attribute or handler |
| `despia rename <document> <kind> <name> <to>` | one declaration's `as=`, refused while the document still reads the old name |
| `despia undeclare <document> <kind> <name>` | one head row out, refused while anything still reads it |
| `despia create <name> --route <path>` | a new `Components/<Name>.dsx`, and the route row when the config has a `routes` list |
| `despia insert <document> <tag> --into\|--before\|--after <address>` | one new node; `--copy` duplicates the node at the address |
| `despia move <document> <address> --into\|--before\|--after <address>` | one node elsewhere; a move into its own subtree is refused |
| `despia wrap <document> <address> <tag>` | one node inside a new parent |
| `despia delete <document> <address>` | one node and its subtree (never the head; that is the head verbs' region) |
| `despia rule add\|remove\|rename <selector> [body] --sheet <sheet>` | one rule in a sheet the project declares |

Every writer takes `--rev <rev>`, the revision of the bytes you read, and answers the new
one. That is the whole safety of the family:

- **no revision** is `incomplete_edit` (exit 3): "a write with no revision is a write over
  whatever is there now";
- **a revision that moved** is `stale_revision` (exit 3), with the revision that is there now.
  Read again (`despia describe` or `despia revision`), check your address still points where you
  think, and write again. Never retry blindly: an insert above your node moved its address;
- **a read that is still there** is `still_used` (exit 3) on `rename` and `undeclare`, naming the
  first reader. Change the readers first; the door will not rewrite expressions nobody looked at;
- **a write that would bring a new error or warning** is `guardian_refused` (exit 1), with the
  finding in the rule's own words, and "Nothing was kept". The verbs climb the guardian's parse,
  lint, state and loop tiers and judge only what the write INTRODUCED, so you can always fix a
  project that already has findings.

Every write lands on the held change plane: `despia change list` shows one change per worktree
with its before and after revision, `despia change approve <id> --rev <rev>` lands it (and
takes a checkpoint), `despia change revert <id>` puts the bytes back. Inside a development
session approval is a PERSON'S: the approve and revert doors open to the review grant alone, so
an agent hands the id to the person who asked for the work
([`using-the-cli.md`](../using-the-despia-cli/SKILL.md), "Your writes are a proposal"). In your own project at a
terminal, with no session, the command lands it directly, as in the run below.

**Why never a file rewrite.** An agent that rewrites a document to change one attribute
re-reads the whole file into its window, writes every other byte back from memory, loses a
concurrent edit silently, and leaves no held change, no revision check and no guardian pass.
The verb writes the one attribute, refuses on a moved revision, and is refused when it would
break the app. Write whole files only when you create them.

### 6 · Describe, graph and lint again

The same three reads. What you fixed should be gone from the lists, and nothing new should be
there. A clean `despia lint` that still prints notices means the work is not finished.

### 7 · Drive it: `despia verify --drive <route>`

The drive builds the project, serves it, and USES it: every route of the screen graph in the
default state and in each api's `loading`, `empty`, `error` and `refused` face, each set by
answering the api's own request (held, 200 `[]`, 500, 403); from navigation start it samples
every element, counting a region drawn empty then full or full then empty then full (a
**flash**) and a sample in which a layout box moves more than 2 px without its parent carrying
it (a **jump**); it presses every visible control once, each on the route as a person arrives
at it, and counts the presses that change nothing (a **dead press**) and the layout that moves
in the 600 ms after a press (a **press shift**, the class the web's own layout-shift metric
forgives), the elements one press destroys and rebuilds under the same identity (a
**remount**) and the frames in which a leaving element and its replacement both take space (a
**stack**); it refuses by name any text node whose content IS an api's error string, the
kernel's own `error.message` included, drawn outside that api's declared error face (a
**refusal** drawn as content: inside the face, the message is the face doing its job, which is
the same law `api-error-as-content` enforces); and it fails a face the document declares that
drew exactly what the default drew, judged by which of the api's gated elements are drawn as
well as by the picture. A `mailto:`, `tel:` or other-origin link is a hand-off, pressed and
never dead; a redirect row is reported with its status and location and not driven; a dynamic
route is driven at a link your pages draw, or named as not driven. Budgets come from
`dsx.config.json` `"drive": { "flash", "jump", "deadPress", "pressShift", "remount", "stack" }`
and default to zero, because zero is the bar. Evidence, a screenshot per route per state and `index.json`,
lands under `.despia/drive/<run>/`. `--no-press` measures without pressing.

Read the table, then **open the screenshots and check that the faces differ.** A row the drive
could not press says "NO ADDRESSABLE CONTROL" and was driven for its states only, which is not
the same as clean. How to build screens that pass it is
[`building-ui-that-does-not-flash.md`](../dsx-ui-without-flashing/SKILL.md).

`despia verify --device ios|android` is the release gate per lane: it exports the project,
builds it, installs it on the ALREADY BOOTED simulator or emulator, launches it, drives the same
routes and reads the app's `[DSXPROBE]` lines and screenshots back into the same folder. It
never boots a device; a lane with nothing booted is refused with the lock script to take one
with. A green web drive is not proof a native lane works.

### 8 · Only then build, export, deploy or ota

`build`, `export`, `deploy` and `ota` climb one guardian pass, in cost order: parse, lint,
state, loop, a build in memory, and (for `deploy` and `ota`, when declared) the drive. A
refusal prints every finding and "No artifact was written". `--force` is never silent: it takes
a checkpoint first, prints every overridden finding in full and marks the checkpoint forced, so
`despia checkpoint back` returns to where you were. It never overrides a document that does not
parse. The design is [`proposals/guardian.md`](https://github.com/despia-native/despia/blob/main/OpenSource/Documentation/architecture/proposals/guardian.md).

A build that removed a route, a document's public contract, a public attribute or an event
says so as a notice, with the diff against the App Description the previous build left, and
still builds: `notice: the app's public surface lost 2 things since the last build`, one
`- route /about (About)` line per loss. Read it as a question to answer before shipping: is
anything still linking to that route, or passing that attribute?

## What each finding means, and the verb that fixes it

| id | level | means | fix by address |
|---|---|---|---|
| `api-error-as-content` | error | `dsx.api.x.error` drawn by an element nothing gates on that error: blank when it has not failed, a refusal sentence as content when it has | `set <doc> <addr> visible-if "dsx.api.x.error"` on it or an ancestor, and draw `.error.message` |
| `api-without-faces` | notice | an `<api>` with no loading, empty or error face | `insert` the face, then `set` its `visible-if` on `.loading`, `.data.length === 0`, `.error` |
| `variable-unread` | notice | declared and read by nothing | read it where it matters (`insert` + `set`), or `undeclare` it |
| `variable-write-only` | notice | written and read by nothing | a reader, or remove the writes (`set`/`unset` the handlers), then `undeclare` |
| `state-mode-unreachable` | notice | a flag that only gates faces and nothing writes | `set <doc> <addr> on:tap "dsx.variable.flag = ..."` on the control that should reach the face |
| `state-control-orphaned` | notice | a control visible only when a never-written flag is true | the same write, or `delete` the control |
| `state-handler-inert` | notice | a dead press: the handler changes no key, emits nothing, calls nothing | `set` the handler to do something, or `unset` it |
| `document-size` | notice | past the declarations or lines ceiling | split along the shapes of [`structuring-an-app.md`](../structuring-dsx-apps/SKILL.md) section 4: `create`, `move` |
| `global-undeclared` | notice | a `dsx.global.<key>` read nothing in the project writes | write it, or make it a `<context>` key |
| `disclosure-empty-body` | warning | a body a toggle opens (`x = !x`) whose only child is a list: opened over an empty list it draws chrome around nothing | `insert` a row gated on the list being empty ("none"), or `set` the body's `visible-if` to need a non-empty list |
| `clear-before-await` | warning | an action empties a key, awaits, then writes it again: the empty value is drawn for the whole wait | write the key once, after the await (`set` the action body) |
| `pending-resizes-control` | warning | a control whose class, style or child `visible-if` reads `.loading`, `.refreshing` or a pending flag changes size while it waits | a literal conditional `label=` (Law 5 reserves the widest), or an overlay that takes no space |
| `media-without-size` | warning | an `<image>`/`<video>` whose style and local classes state no box grows when its source loads | `set` its style: width and height, aspect-ratio, or the stretch its layout gives it |
| `content-overflow-page` | warning | a `repeat=` or `<list scroll="false">` in a full-height page with no `<scroll>` above it runs past the page | `wrap` it in `<scroll>` |
| `loop-action-self` | error | an action that calls itself, or a ring that calls it back | break the ring with `value <doc> action <name> <body>` |
| `loop-watch-writes-read` | warning | a watch whose `on:change` writes what it watches | `undeclare` the watch; `declare ... variable <name> --computed` |
| `loop-computed-cycle` | error | two derivations that read each other | make one of them assigned state |
| `budget-unbounded-repeat` | error | a `repeat` whose own body writes its collection | move the write outside the repeated element |
| `context-*` | error, warning | the eight context rules | [`structuring-an-app.md`](../structuring-dsx-apps/SKILL.md) section 6 |
| `repeated-subtree` | notice | one subtree's shape written three or more times, only values differing, in one document or across documents | the `despia extract <doc> <addr> --as <Name> --all` the message prints; rank first with `despia describe --reuse` ([`components-and-reuse.md`](../dsx-components-and-reuse/SKILL.md)) |
| `attribute-forwarded-unused` | notice | an `<attribute>` this document only passes to a child mount | the caller passes the child in through `<slot/>`; a context key only when the value crosses several levels to many readers |
| `flag-family` | notice | three or more booleans the same handlers set, or that each gate one of three sibling faces | one union-typed `<variable>` with `moves=`, as the message spells it |

## A worked example, from a real run

A small orders screen, made the way generated code usually makes it: the api drawn with no
faces, its error printed raw, a tap handler writing a variable nothing reads, and a help text
behind a flag nothing sets. Run on 2026-09-22 against the CLI source at `68323c5e9`, and again
at `06ac4566d` with the same output, in a project made by `despia init`. The scratch path is
trimmed from the output, lines this page drops are marked, and the CLI's em dash is printed
here as a hyphen, because this page ships in the installable skills pack, whose prose carries
none. The refused and forced builds and the `checkpoint back` at the end are the same two
files in sibling scratch copies, run earlier the same day with the built CLI in
`OpenSource/Engine/TypeScript/packages/cli/dist`, which then predated `68323c5e9` (the commit
that makes the editing verbs climb the guardian); that is why the main run is the source.

The file before (it does not pass lint, on purpose):

```text
<stack style="padding: 24px; gap: 12px">
  <head>
    <api as="orders" url="https://example.com/orders"/>
    <variable as="lastTap">return 0</variable>
    <variable as="showHelp">return false</variable>
  </head>
  <text value="Orders" style="font-size: 28px; font-weight: 700"/>
  <text value="{{ dsx.api.orders.error }}"/>
  <list bind="dsx.api.orders.data" key="id">
    <pressable on:tap="dsx.variable.lastTap = dsx.this.id">
      <text value="{{ dsx.this.title }}"/>
    </pressable>
  </list>
  <text visible-if="dsx.variable.showHelp" value="Tap an order to open it."/>
</stack>
```

**Describe it.** The faces, the names and the addresses, without opening the file:

```text
$ despia describe Components/App.dsx
despia describe Components/App.dsx
  route / · App · scheme orders · language 0
  16 lines (5 head, 11 body) · 3 declarations · 7 elements · 589 bytes

  the head, as a contract
    boundary  no <attribute> and no <event>: nothing crosses in, nothing crosses out
  variables (2: 0 computed, 2 plain, 0 persisted)
    lastTap  showHelp
  apis (1) - faces: loading · empty · error
    orders  GET https://example.com/orders
      NO loading · NO empty · NO error

  what the state graph says about these names
    never read (1)
      lastTap
    written and never read (1)
      lastTap
    never written but their initializer: 1
    mode flags - read only where they gate a face (1)
      showHelp  gates text[visible-if]

  the body, as addresses (7 elements)
    ·  <stack> (6)
      1  <text>  Orders
      2  <text>  •  [{{ }}]
      3  <list> (2)  [bind key]
        3.0  <pressable> (1)  [on:tap]
          3.0.0  <text>  •  [{{ }}]
      4  <text>  Tap an order to open it.  [visible-if]
  what it is made of
    text·4  list·1  pressable·1  stack·1
```

**Graph it.**

```text
$ despia graph state --names
despia graph state --names
  3 declared names · 0 reached and never declared · written from more than 3 units of logic: 0

  never read (1)
    App.lastTap
  written and never read (1)
    App.lastTap
  never written but their initializer (1)
    App.showHelp

  mode flags - read only where they gate a face (1)
    App.showHelp  gates text[visible-if]

  in full, the first few that earn it
    App.showHelp
      written by  
      read by     text[visible-if] App.dsx:14
      gates       text[visible-if]
```

**Lint it.** One error (a build would refuse) and four notices (a build would not):

```text
$ despia lint
Components/App.dsx:3: notice: <api as="orders"> draws no loading and no empty and no error face - every api has three faces before its happy path: loading, empty, error. [...]
Components/App.dsx:4: notice: <variable as="lastTap"> is written from 1 place and read from none - every one of those writes is maintained for a value nothing asks for. [...]
Components/App.dsx:5: notice: <variable as="showHelp"> gates 1 face (text[visible-if]) and nothing writes it - the mode can only ever hold the value its declaration gave it, so every other face it gates has no way in. [...]
Components/App.dsx:8: error: dsx.api.orders.error is drawn as content by <text> and nothing gates it - when the request has not failed this draws blank, and when it has it draws the refusal sentence as though it were the answer. Put the text inside an error face: visible-if="dsx.api.orders.error".
Components/App.dsx:14: notice: <text> is visible only when dsx.variable.showHelp is true, and dsx.variable.showHelp is declared false and written by nothing - there is no value anywhere in this document that puts this control on screen. [...]
despia lint: 1 files · 1 errors · 0 warnings · 4 notices
[exit 1]
```

(`[...]` stands for the rest of each sentence, which names the verb that measures it.)

**Checkpoint, then read the revision.**

```text
$ despia checkpoint --label "before the orders faces"
[despia checkpoint] 1  before the orders faces - manual, just now
[despia checkpoint] `despia checkpoint back` returns here; `despia checkpoint list` shows every one.

$ despia revision Components/App.dsx
f1a51f1e2a503552419b1fcb4b6e4cdd
```

**Fix the error by address.** A write without the revision, and one over a revision that has
moved, are both refused before any byte moves:

```text
$ despia set Components/App.dsx 2 visible-if "dsx.api.orders.error"
despia set: incomplete_edit - an edit names its document, its element address, the attribute, the value and the revision of the bytes the panel read. A write with no revision is a write over whatever is there now, which is the one thing this door exists to refuse.
[exit 3]

$ despia set --rev f1a51f1e2a503552419b1fcb4b6e4cdd Components/App.dsx 2 visible-if "dsx.api.orders.error"
despia set: Components/App.dsx  ·  revision 904e24298284b3230a7dc58dc353f26e  ·  change 0mucwzqa4-1-canvas

$ despia set --rev 904e24298284b3230a7dc58dc353f26e Components/App.dsx 2 value "{{ dsx.api.orders.error.message }}"
despia set: Components/App.dsx  ·  revision 52b5b1997ff4307d6074927ebc5ae9a6  ·  change 0mucwzqa4-1-canvas

$ despia set --rev f1a51f1e2a503552419b1fcb4b6e4cdd Components/App.dsx 2 value "x"
despia set: stale_revision - Components/App.dsx has moved since this panel read it. Re-read the element and write again.
  the revision there now is 52b5b1997ff4307d6074927ebc5ae9a6
[exit 3]
```

**Add the loading and empty faces.** `insert` answers the address the new node landed at, and
the addresses after it shift by one; the describe answer above is how you know where you are:

```text
$ despia insert --rev 52b5b1997ff4307d6074927ebc5ae9a6 --before 2 Components/App.dsx spinner
despia insert: Components/App.dsx  ·  address 2  ·  revision 052e6e116c7851b0246ddbfebfaf519a  ·  change 0mucwzqa4-1-canvas

$ despia set --rev 052e6e116c7851b0246ddbfebfaf519a Components/App.dsx 2 visible-if "dsx.api.orders.loading"
despia set: Components/App.dsx  ·  revision 3e2dce6cc02ad8e10fbf43014894ed04  ·  change 0mucwzqa4-1-canvas

$ despia insert --rev 3e2dce6cc02ad8e10fbf43014894ed04 --after 3 Components/App.dsx text
despia insert: Components/App.dsx  ·  address 4  ·  revision 2be9ed006e78fd8501ed48ab4a76d2eb  ·  change 0mucwzqa4-1-canvas

$ despia set --rev 2be9ed006e78fd8501ed48ab4a76d2eb Components/App.dsx 4 value "Nothing here yet"
despia set: Components/App.dsx  ·  revision 11353a36ea499a2114fc735f1325181e  ·  change 0mucwzqa4-1-canvas

$ despia set --rev 11353a36ea499a2114fc735f1325181e Components/App.dsx 4 visible-if "dsx.api.orders.data.length === 0"
despia set: Components/App.dsx  ·  revision be116954aa805e447193ab0f7b97396c  ·  change 0mucwzqa4-1-canvas
```

**The guardian refuses a write that would break it.** Drawing the error in the title, ungated:

```text
$ despia set --rev be116954aa805e447193ab0f7b97396c Components/App.dsx 1 value "{{ dsx.api.orders.error.message }}"
despia set: guardian_refused - this write would bring 1 finding(s) the project did not have (the state tier):
  Components/App.dsx:7: error: dsx.api.orders.error is drawn as content by <text> and nothing gates it - when the request has not failed this draws blank, and when it has it draws the refusal sentence as though it were the answer. Put the text inside an error face: visible-if="dsx.api.orders.error".
Nothing was kept: Components/App.dsx is as it was.
[exit 1]
```

**A variable something still writes cannot be taken out.** So `lastTap` gets a reader instead,
and `showHelp` gets a writer:

```text
$ despia undeclare --rev be116954aa805e447193ab0f7b97396c Components/App.dsx variable lastTap
despia undeclare: still_used - Components/App.dsx still reads `dsx.variable.lastTap` in 1 place, the first at <pressable on:tap=>. Change those first, or ask the agent to, because a removal this door swept for you would rewrite expressions nobody looked at.
[exit 3]

$ despia insert --rev be116954aa805e447193ab0f7b97396c --after 5 Components/App.dsx text
despia insert: Components/App.dsx  ·  address 6  ·  revision f3d5ceafc9f21fd59031cca1ae9eafd3  ·  change 0mucwzqa4-1-canvas

$ # each set below answers the next revision, as above; only the last answer is shown
$ despia set --rev f3d5ceafc9f21fd59031cca1ae9eafd3 Components/App.dsx 6 visible-if "dsx.variable.lastTap != 0"
$ despia set --rev a7908fb4820929431e975c94ba576048 Components/App.dsx 6 value "Order {{ dsx.variable.lastTap }} selected"
$ despia insert --rev 58f54d028c09e13c6b92b155659b0ac4 --before 7 Components/App.dsx button
$ despia set --rev 10ecf60a1c033d5e56e673122cc2ebe2 Components/App.dsx 7 label "Help"
$ despia set --rev 540d8316bace464e3dbfbb87dc1c57a8 Components/App.dsx 7 on:tap "dsx.variable.showHelp = !dsx.variable.showHelp"
despia set: Components/App.dsx  ·  revision 13a0fd87e1c57a88213099b8c1e108ed  ·  change 0mucwzqa4-1-canvas
```

The file after, every byte of it written by the verbs:

```dsx
<stack style="padding: 24px; gap: 12px">
  <head>
    <api as="orders" url="https://example.com/orders"/>
    <variable as="lastTap">return 0</variable>
    <variable as="showHelp">return false</variable>
  </head>
  <text value="Orders" style="font-size: 28px; font-weight: 700"/>
  <spinner visible-if="dsx.api.orders.loading"/>
  <text value="{{ dsx.api.orders.error.message }}" visible-if="dsx.api.orders.error"/>
  <text value="Nothing here yet" visible-if="dsx.api.orders.data.length === 0"/>
  <list bind="dsx.api.orders.data" key="id">
    <pressable on:tap="dsx.variable.lastTap = dsx.this.id">
      <text value="{{ dsx.this.title }}"/>
    </pressable>
  </list>
  <text visible-if="dsx.variable.lastTap != 0" value="Order {{ dsx.variable.lastTap }} selected"/>
  <button label="Help" on:tap="dsx.variable.showHelp = !dsx.variable.showHelp"></button>
  <text visible-if="dsx.variable.showHelp" value="Tap an order to open it."/>
</stack>
```

**Read again.** The graph's three lists are empty, and lint is clean:

```text
$ despia graph state --names
despia graph state --names
  3 declared names · 0 reached and never declared · written from more than 3 units of logic: 0

  never read (0)
  written and never read (0)
  never written but their initializer (0)
  [...]

$ despia lint
despia lint: 1 files · 0 errors · 0 warnings · 0 notices
[exit 0]
```

The spinner is gated on `.loading`, which is what all three lanes publish and what
`api-without-faces` counts. A gate on `isLoading` would draw the notice, because no lane sets it
and that spinner would never show.

**Review the held change, drive, build.**

```text
$ despia change list
0mucwzqa4-1-canvas  human         held      edit Components/App.dsx
              intent: Set visible-if on Components/App.dsx#2
              Components/App.dsx  f1a51f1e2a503552419b1fcb4b6e4cdd to 13a0fd87e1c57a88213099b8c1e108ed

$ despia change approve 0mucwzqa4-1-canvas --rev 13a0fd87e1c57a88213099b8c1e108ed
[despia change] 0mucwzqa4-1-canvas is approved

$ despia verify --drive App
[despia verify] route  state           flash  jump  presses  dead  shift  remount  stack  refusals
[despia verify] -----  --------------  -----  ----  -------  ----  -----  -------  -----  --------
[despia verify] /      default         0      0     1        0     0      0        0      0
[despia verify] /      orders:loading  0      0     1        0     0      0        0      0
[despia verify] /      orders:empty    0      0     1        0     0      0        0      0
[despia verify] /      orders:error    0      0     1        0     0      0        0      0
[despia verify] /      orders:refused  0      0     1        0     0      0        0      0
[despia verify] budgets: flash 0, jump 0, dead press 0, press shift 0, remount 0, stacked frame 0
[despia verify] same: 5 row(s) driven, every counter within budget.
[despia verify] evidence: .despia/drive/20260922T205650/index.json
```

Five rows, five faces, and the five screenshots differ, one per face. The error face draws the
kernel's own message, `http 500`, and that is not a refusal drawn as content: it is inside the
element gated on `dsx.api.orders.error`, the face the lint rule asked for, and the drive reads
the same law (the same message drawn anywhere else fails the run, by name). Drawing your own
words beside it, or instead of it, is a design choice and not a fix. The root's `padding:
24px` reads `jump 0`: nothing on this page moves, and the drive says so.

```text
$ despia build
[despia build] checkpoint 3: build · 6 authored files - `despia checkpoint back` returns here.
[despia build] Orders (orders) - 1 components
[despia build] 13 files → dist

$ despia checkpoint list
[despia checkpoint] 3  build · 6 authored files - build, just now
[despia checkpoint] 2  edit Components/App.dsx - change, just now
[despia checkpoint] 1  before the orders faces - manual, just now
```

(Trimmed: the change plane's two hint lines, the drive's per-state progress lines and the
build's observability line.) The
same `despia build` on the file BEFORE the fix is refused, and `--force` says what it overrode:

```text
$ despia build
Components/App.dsx:8: error: dsx.api.orders.error is drawn as content by <text> and nothing gates it - [...]
despia build: refused: 1 error(s), 0 warning(s) in 1 file(s). No artifact was written; run `despia lint` for the full report.
[exit 1]

$ despia build --force
Components/App.dsx:8: error: dsx.api.orders.error is drawn as content by <text> and nothing gates it - [...]
[despia build] checkpoint 1: build · forced (forced) - `despia checkpoint back` returns here.
despia build: --force - the 1 finding(s) above are being OVERRIDDEN, not fixed. The artifact is written anyway, the checkpoint above is where the project was before it, and `despia checkpoint back` returns there.
```

And going back, which is itself a checkpoint:

```text
$ despia checkpoint back --to 1 --apply
[despia checkpoint] back to: 1  before the orders faces - manual, 3 minutes ago
[despia checkpoint]   ~ Components/App.dsx
[...]
[despia checkpoint] restored. Where you were is stored as "back to before the orders faces", so this is reversible too.
```

## See also

- [`structuring-an-app.md`](../structuring-dsx-apps/SKILL.md): which state goes where, and when a document
  is two.
- [`components-and-reuse.md`](../dsx-components-and-reuse/SKILL.md): the copies that want to be one
  component, ranked, and the verbs that make them one (`extract`, `split`).
- [`building-ui-that-does-not-flash.md`](../dsx-ui-without-flashing/SKILL.md): the faces, the
  motion law and what the drive counts.
- [`deleting-safely.md`](../deleting-dsx-safely/SKILL.md): `despia impact` before removing anything.
- [`using-the-cli.md`](../using-the-despia-cli/SKILL.md): every command and flag.
- [`mcp-agent-transport.md`](https://docs.despia.com/framework/skills/mcp-agent-transport): the same verbs as MCP tools.
- [`app-description.md`](https://github.com/despia-native/despia/blob/main/OpenSource/Documentation/reference/app-description.md): the file every build
  writes beside its output, and who reads it.
