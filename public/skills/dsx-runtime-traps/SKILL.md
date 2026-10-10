---
name: dsx-runtime-traps
description: "The DSX spellings that run, report success and do the wrong thing: equality that numbers both operands, plus as total arithmetic, a stored null that is truthy, await in a ternary arm, try inside a lambda, a bare name in setInterval, a positional argument a declared action drops, a watch that settles a tick later, an event payload read through a plane that does not exist, and the data and render traps no gate catches. Use when DSX code runs without an error and produces the wrong value, and before debugging a null, an empty list, a dead handler or a missing style."
---

<!-- GENERATED from OpenSource/Skills/dsx-runtime-traps.md in despia-native/despia.
     Edit the source, then: ruby ClosedSource/scripts/generate_agent_skills.rb -->

# DSX runtime traps: the ones that fail silently

Every entry here is a spelling that RUNS. No error, no warning, no red gate: the app boots, the
action returns, the handler fires, and the result is wrong. That is the whole selection rule. A
mistake the linter catches is not a trap, it is a typo; this file collects the ones where the
wrong spelling and the right spelling are equally plausible and only one of them works.

Two ledgers are merged here: the framework's own runtime findings, and the ledger the flagship
short-drama template kept while it was built against a live kernel on three renderers. Both were
paid for the same way, by a defect that shipped.

**How to read an entry.** Symptom first, because that is what you have: the thing you can see on
the screen or in the log. Then the cause, then the spelling that works, then the citation. No
entry appears here without a citation, and a citation is a place you can go and check:

- `runtime-pressure.md R<n>` is a row of
  [`Documentation/architecture/runtime-pressure.md`](https://github.com/despia-native/despia/blob/main/OpenSource/Documentation/architecture/runtime-pressure.md),
  the framework's own pressure ledger.
- `short-drama-app PLAN.md section 6.<n>` is a row of the short-drama template's upstream ledger.
  Rows with no number were measured probes; those say so and name the date.
- A path plus a symbol is the code that decides the behaviour today.

**When you hit a new one.** Do not work around it in your markup and move on. File it
(`runtime-pressure.md`, the procedure is at the top of that file), bridge it loudly in place, or
degrade with the degradation named in the UI. A dodge you leave behind is a second opinion about
how the runtime behaves, held by one caller and tested by nobody.

**When you FIX one.** A fix is not a fix until a case in `OpenSource/Conformance/**` drives the
real path an author takes. A test that calls a helper the author never calls proves the helper.

---

## 1. Values and comparisons

### `'4' == '4.0'` is true, and the string compare you meant is a number compare

**Symptom.** Two ids that are not the same string select the same row. A guard on a version
string (`v == '1.10'`) passes for `'1.1'`.

**Cause.** `jseEquals` numbers both operands first and compares the numbers when BOTH parse.
Only when one side does not parse does it fall through to structural equality (plain dicts and
arrays, deep and key order insensitive) and then to string equality. That is `==`, and only
`==`: `===` compares the kind first and never coerces (`'1' === '1.0'` is false, `1 === '1'` is
false), which is the JavaScript meaning.

**Write.** `===` whenever the text or the kind must match exactly: `v === '1.10'`,
`row.id === dsx.variable.selected`. Keep `==` for the deliberate loose read, a field that may
hold `3` or `'3'`. The linter notes a number-like string literal under `==`
(`eq-numeric-string-literal`).

Cited: `OpenSource/Engine/TypeScript/packages/kernel/src/jse/values.ts`, `jseEquals`; the comparison rules in
[`Documentation/reference/jse.md`](https://github.com/despia-native/despia/blob/main/OpenSource/Documentation/reference/jse.md).

### `'' + n` is the NUMBER n, so a zero pad renders `0:4`

**Symptom.** A clock shows `0:4` instead of `0:04`. A padded order number renders `7` where the
code clearly builds `"07"`.

**Cause.** JSE `+` is total arithmetic: when both operands number coerce, it adds. The empty
string numbers as zero, so `'' + 4` is `4`, and every later `+` on that value keeps adding.
Building a pad the JavaScript way (`let ss = '' + sec; if (sec < 10) { ss = '0' + ss }`) yields
`4`, on every renderer, so it is a language law and not a renderer defect.

**Write.** Grow the string from an anchor that can never parse as a number, then every later `+`
is a concatenation:

```js
let out = m + ':'      // ':' cannot number coerce, so out is a string from here on
if (sec < 10) { out = out + '0' }
out = out + sec
```

Cited: short-drama-app PLAN.md section 6.81; `OpenSource/Engine/TypeScript/packages/kernel/src/jse/values.ts`,
`arith`.

### A stored null is not `null` to `!x`, so an absence check is `x == null`

**Symptom.** A rejection branch never runs. A "no card on file" guard passes for an account with
no card. A toast draws nothing where a value was expected and the code that was supposed to
prevent it ran.

**Cause.** A bound but null lambda parameter, const or destructured key is stored as the scope
sentinel (NSNull on the native lanes, its twin in the TS runner). The sentinel is TRUTHY, it does
not number coerce, and it has no text at all (its string coercion is "", the same as null's, so
the absence is INVISIBLE rather than loud), so `!x` is false for it while `x == null` is
true (equality folds the sentinel to null on purpose, and every derived operation, `includes`,
`indexOf`, `switch`, Map and Set, rides that same function).

**Write.** `if (x == null) { ... }` for any possibly absent value. Reserve `!x` for a boolean flag
you declared yourself.

Cited: runtime-pressure.md R11; short-drama-app PLAN.md section 6.8;
`OpenSource/Engine/TypeScript/packages/kernel/src/jse/values.ts`, the sentinel note above `jseEquals`.

### A repeater bound to strings renders `[object Object]` and collapses to one row

**Symptom.** A `<list>` of recent searches shows a single row reading `[object Object]`.

**Cause.** A repeater row is a DICT scope, never a scalar: `item` is the reserved row scope
object, so binding an array of strings hands each row a scope whose stringification is the object,
and under `key="index"` the web keys rows by that string value, so they dedupe to one.

**Write.** Store rows as dicts and read a field: `[{ term: 'x' }]` with `item.term`.

Cited: short-drama-app AGENTS.md house idiom, measured on the search overlay; the scalar row key
divergence is short-drama-app PLAN.md section 6.162.

---

## 2. Statements in an action body

### `await` in a ternary arm settles to null, and the `.ok` you read is false

**Symptom.** A server action reports failure for a request that succeeded. `r.ok` is false and
`r.data` is null, while the identical call in an `if` works.

**Cause.** `await` is a STATEMENT, not an expression operand. `x = c ? await f() : await g()`
resolves to something whose `.ok` is falsy, silently, on the server tier. Isolated against the
identical if and else, which works.

**Write.**

```js
let r = null
if (c) { r = await f() } else { r = await g() }
```

Cited: short-drama-app PLAN.md section 6.31.

### A `try` in an EXPRESSION block aborts the whole body to null

**Symptom.** Every pill in a computed renders `null`, including values assigned BEFORE the `try`.
The same spelling in an `<action>` body works, which is what makes the cause invisible: the symptom
appears far from it.

**Cause.** The grammar split is between the two executors of one language. The statement runner
carries `try` / `catch` / `finally`; the block grammar (a `<variable computed>` body, a
`<formula>` body, a block bodied lambda, an IIFE) never learned them, so the body abandons at the
unknown statement and answers null with no diagnostic. Measured:
`let x = 1; try { x = 2 } catch (e) { x = 3 } return x` gives null, not 2 and not 1.

**Write.** In an expression block, do not reach for `try` at all: the JSE stdlib is TOTAL by
design, errors are values, so `JSON.parse` returns null on malformed input rather than throwing.
Branch on the value. Keep `try` for the action body, where feature detection (a module that is not
in this build) is exactly what it is for.

Cited: runtime-pressure.md R15 (OPEN); the two grammars in
[`Documentation/reference/jse.md`](https://github.com/despia-native/despia/blob/main/OpenSource/Documentation/reference/jse.md).

### `setInterval(tick, 1000)` never ticks when `tick` is a name

**Symptom.** A poller that "definitely started" produces nothing. No timer, no log, no error, and
`clearInterval` on the key finds nothing to cancel.

**Cause.** `timerStatement` takes the first argument and returns immediately unless it is a
lambda. A bare identifier, even the name of a declared `<action>`, is not a lambda, so the
statement is a silent no op.

**Write.** Always pass an arrow, and call the action from inside it:

```js
setInterval(() => { tick() }, 1000, 'poll')
```

Cited: `OpenSource/Engine/TypeScript/packages/kernel/src/runner.ts`, `timerStatement`
(`if (!isLambda(fn)) return`).

### `.push()` inside a lambda a formula calls pushes into a copy

**Symptom.** A `<formula>` or a `{{ }}` binding that collects rows through `forEach` or `map`
answers an empty accumulator, while the same lines in an `<action>` body work.

**Cause.** The context of the CALL decides. A lambda called from an action body is action context
(proposals/action-array-methods.md, decision 5): its mutators write the store, and a `let` the
action declared is one binding with the lambda's, as a JavaScript closure, so
`let acc = []; xs.forEach(x => acc.push(x))` fills `acc` on all three lanes. A lambda called from
a pure context (a `<formula>` or `<variable>` body, `bind`, `visible-if`, markup `{{ }}`) stays
pure, even when an action reads that formula: `push` there reads, copies and writes back into the
lambda's own frame, and `pop()` answers the last element without removing it. JSE has value
semantics, so an assignment through a second name never aliases the first.

**Write.** In a pure context, collect with the pure combinators and use the RESULT, which is the
sanctioned accumulator idiom:

```js
out = out.concat(rows.filter(r => r.active).map(r => r.id))
byId = rows.reduce((m, r) => { m[r.id] = r; return m }, {})   // the reduce accumulator is real
```

In an action body, `forEach` with a `push` into a captured `let` or a `dsx.variable` path writes
as it does in JavaScript.

Cited: runtime-pressure.md R11 (the landed block-scope mutation law);
`OpenSource/Conformance/jse/core-003.json`, case `value-semantics-boundary`;
`OpenSource/Conformance/actions/actions.json`, cases `array-method-an-arrow-writes-a-captured-authored-local`
and `array-method-an-arrow-inside-a-formula-stays-pure`.

### `xs.forEach(x => dsx.action.put({ … }))` does nothing, and the build now refuses it

**Symptom.** A seed or sync action loops over rows with `forEach` / `map` and calls an action, a module or `await`s inside the arrow. It runs, reports success, writes nothing.

**Cause.** An array method runs its callback as a pure lambda. Store writes land; calls, awaits, events and `fetch` are not effects that evaluator performs. Same on all three lanes.

**Write.** A loop: `for (const x of xs) { await dsx.action.put({ … }) }`. The compile step names this sentence (`lambda-effect-refusal`).

### `byKey[k].push(v)` writes nothing when `k` is a variable

**Symptom.** A grouping pass finishes and every bucket is empty or missing. No error anywhere.

**Cause.** Bracket read mutation through a variable key is a silent no op: the read produces a
value, the mutation lands on it, and nothing is written back to the container. A literal path
(`obj.list.push(v)`) does work, which is exactly why the bug survives review.

**Write.** Rebuild and assign:

```js
byKey[k] = (byKey[k] == null ? [] : byKey[k]).concat([v])
```

Cited: short-drama-app PLAN.md section 6.9.

### A bracket write whose key contains a dot becomes a nested path

**Symptom.** `map[key] = v` with `key = 'a.b'` does not produce a key `a.b`. Reading `map['a.b']`
gives null; the value is at `map.a.b`.

**Cause.** The write goes through the same path law as a dotted literal, so the dot in the KEY is
read as a path separator, silently, and a computed key carrying a dot (a locale tag, a filename, a
version) writes a nested object instead of one entry.

**Write.** Normalize the key before writing (replace the dot), or store `[{ key, value }]` rows
and look up by scan.

Cited: short-drama-app PLAN.md section 6.93.

### A statement ends at the newline, unless the next line begins with an operator

**Symptom.** Half of a computation applies, and the value assigned is the first half. Measured on a
refusal sentence built across two lines with the `+` at the start of the second: it shipped as `seat
DSP-2ST2-N4BY-Z3FB is a compose lane seat and com.acme.fitness is ios` and stopped there, losing the
half that said what to do about it. No error and no warning.

**Cause.** A body is statement per line: a newline ends a statement unless the line is clearly
unfinished (a trailing operator) or the next line can only continue it. A leading `.`, `?`, `:`, `&&`
and `||` always counted; a leading `+`, `-`, `*`, `/` and `%` did not, which is the layout every
formatter produces for a long concatenation.

**Write.** Either break, on every lane: a line that begins with a binary operator continues the
expression now, as every JavaScript engine reads it, and the join is one expression so precedence
reads across the break (`1 + 2` then `* 3` is 7).

```js
const why = 'seat ' + seat.key + ' is a ' + seat.lane + ' lane seat'
  + ' and ' + app.bundleId + ' runs on the ' + appLane + ' lane.'
```

`++` and `--` at the start of a line still split, because JavaScript splits them too. All three
kernels read it the same way, row by row, in `OpenSource/Conformance/jse/syntax-001.json`:
`lineContinues` is one function in `tokens.ts`, `JSE.swift` and `Jse.kt`.

Cited: the ASI paragraph ("Multiline is first-class") in
[`Documentation/reference/jse.md`](https://github.com/despia-native/despia/blob/main/OpenSource/Documentation/reference/jse.md);
`OpenSource/Engine/TypeScript/packages/kernel/src/jse/tokens.ts`, `lineContinues`.

### An apostrophe in a `//` comment fails the lint as an unterminated string

**Symptom.** `despia lint` reports `unbalanced (){}[] or unterminated string` and points
at an action whose code is fine. The offending character is in a comment.

**Cause.** `jse_balanced?` walks the body character by character and opens a string on any `'` or
`"`. It does not skip `//` comments, so one possessive in a comment ("the route's own ceiling")
leaves a string open to the end of the body.

**Write.** No apostrophe in a `//` comment inside a code body. Reword it ("the ceiling of the
route").

Cited: short-drama-app PLAN.md section 6.17 (the linter reads identifiers out of `//` comments);
`ClosedSource/scripts/lint_dsx.rb`, `jse_balanced?`.

### A local named `item` or `attribute` is not your local

**Symptom.** A `let item = ...` guard behaves as though the value were never null: `item == null`
is false, and every read returns a whole scope object rather than the value you assigned.

**Cause.** `item` and `attribute` are the explicit LOCAL SCOPE heads in the path resolver. A path
whose first segment is either name is answered from the row and attribute scope, so your local is
shadowed rather than read. A component head is covered (the linter refuses a declaration named
`item` there); a `let` in a body is not.

**Write.** Name the local `row`, `picked` or `match`.

Cited: short-drama-app PLAN.md section 6.192 (which names upstream issue 242);
`OpenSource/Engine/TypeScript/packages/kernel/src/jse/jse.ts`, the `first === "item" || first === "attribute"`
branch.

### A per row sweep dies at 64 module calls, with the work half done

**Symptom.** A cleanup or migration returns 503 partway. Measured once: an account deletion
removed 20 unlocks and abandoned the wallet.

**Cause.** A request gets 64 module calls (`ACTION_CALL_CAP`; a spec may lower it, never raise
it). Anything that touches a row per iteration exhausts it.

**Write.** Make the sweep BOUNDED and RESUMABLE: do a fixed slice, return a `done` flag, and let
the caller loop. Size the route's `rate=` to the SWEEP and not to the intent, or the second pass
is rate limited out of finishing (`3/h` on a one decision action locked a viewer out of completing
their own deletion).

Cited: short-drama-app PLAN.md section 6.87;
`OpenSource/Engine/TypeScript/packages/server/src/actions.ts`, `ACTION_CALL_CAP` (a document may ask for less,
never more).

---

## 3. Declarations and scope

### `dsx.attribute.title` reads the ROW's title inside a repeater

**Symptom.** A component mounted as a row template shows the row's field where you passed an
attribute, or the reverse, depending on which names happen to collide.

**Cause.** `attribute.*` and `item.*` are the same explicit local scope in the resolver: it walks
the ROW scope first and only falls back to the runtime attribute dict when that read is null. A
row field with the same name as an attribute wins.

**Write.** Do not reuse a row field name for a component attribute. When a collision is
unavoidable, rename the attribute at the mount (`cardTitle=`), not at the reader.

Cited: `OpenSource/Engine/TypeScript/packages/kernel/src/jse/jse.ts`, the explicit local scope branch of the
path resolver.

### A `<formula>` is read by BARE NAME, never called

**Symptom.** An element renders at its intrinsic size because its whole `style=""` came out empty.
Measured once: 78x104 poster cells rendered at 360x480 and ate an entire hero band. The linter
does not catch it.

**Cause.** A `<formula>` is a reactive VALUE with declared inputs, not a function: the resolver
answers the bare name by evaluating each declared input in the CURRENT scope and running the body
over those locals. There is no call position for it, so `dsx.formula.coverCell(dsx.this.rank)` produces
nothing and the attribute that held it becomes empty.

**Write.** `style="{{ dsx.formula.coverCell }}"`, with the formula declaring `input:r="dsx.this.rank"`. Inside a
repeater the inputs bind from the row scope automatically.

Cited: [`Documentation/reference/state-and-computation.md`](https://github.com/despia-native/despia/blob/main/OpenSource/Documentation/reference/state-and-computation.md)
("`dsx.formula.name` reads a `<formula>` (a value, no `()`)");
`OpenSource/Engine/TypeScript/packages/kernel/src/jse/jse.ts`, the parameterized formula branch.

### `overArt="true"` is four characters, and `default="false"` is a boolean

**Symptom.** A component ignores the flag the caller obviously set. `dsx.attribute.overArt == true`
is false for `overArt="true"`.

**Cause.** A markup attribute arrives as a STRING; `default=` is a JSE EXPRESSION evaluated as
written. So the declared default is a real boolean and the caller's literal is not, and a strict
comparison between them is false.

**Write.** Interpolate a real value at the mount (`overArt="{{ true }}"`), and accept both
spellings in the consumer, because a component cannot make its callers remember:
`{{ dsx.attribute.overArt == true || dsx.attribute.overArt == 'true' }}`.

Cited: short-drama-app AGENTS.md house idiom, measured on the poster card;
`OpenSource/Engine/TypeScript/packages/kernel/src/jse/jse.ts`, `attrDefaults` (a default is evaluated, an
attribute is not).

### A route param reads empty in a plain `<variable>` initializer

**Symptom.** `/browse/Revenge` server renders the "all series" state, with no error anywhere. The
same read works in markup and in an action body.

**Cause.** An initializer runs before the route param is in scope, so it reads empty and the
variable keeps that empty seed.

**Write.** Seed from a `computed="true"` variable instead, which re evaluates in the current
scope on every read.

Cited: short-drama-app PLAN.md section 6.32.

### The parameterised route must be declared BEFORE its bare sibling

**Symptom.** `/browse/Revenge` renders the right screen but writes `/browse` into history, so a
reload shows something else.

**Cause.** First match wins in declaration order, and the bare route matches the prefix.

**Write.** Declare `/browse/:genre` above `/browse`.

Cited: short-drama-app PLAN.md section 6.32.

### An attribute nobody declared is accepted, ignored and invisible

**Symptom.** `<api as="drawing" gate="body != null" url="..."/>` fires the request with a hole in
its URL and the panel renders its empty state. There is no `gate` attribute. No error, no warning.

**Cause.** An attribute a declaration does not know is dropped rather than refused, so a typo
(`urls=`), a wrong word (`gate=`) and an attribute that belongs on a different tag all land the
same way. The ELEMENT half of this is closed: the attribute census gates per element vocabulary on
three runners, with a known confusion or a near miss of a real word as an ERROR and any other
unknown as a NOTICE naming the census. HEAD grammar and the extension dialects are scoped out of
the census, so those vocabularies are still silent.

**Write.** Read the notices, not just the errors. On a head declaration, check the word against the
element census reference before you trust it, and remember the feature you want may exist under a
different spelling (in the example above, an `<api>` block already gates itself on an unresolved
hole).

Cited: runtime-pressure.md R9 (landed 2026-08-22 as the attribute census, head grammar scoped out).

---

## 4. Events, watches and gestures

### A `<watch>` handler settles a tick later, so the assertion after the event is early

**Symptom.** An oracle or a follow up statement reads the state a watch was supposed to write and
sees the previous value. The app is right a moment later; the check is wrong now.

**Cause.** A watch fires from the store's change notification, not inline with the write. The
handler observes the POST write store, which is the contract, but WHEN it runs is renderer timing:
the natives run an entry's statements synchronously and settle one fire, the web runner awaits
between statements and fires per meaningfully changed microtask tick. The terminal store state is
the contract; the fire count inside one entry is deliberately unpinned.

**Write.** In a test or an oracle, yield before asserting (await a tick, or await the runner's own
settle). In app code, never assume the watch has already run in the same statement list.

Cited: `OpenSource/Conformance/actions/watch-dispatch.json`, case
`watch-observes-settled-value-across-entry-writes`.

### A watch payload: an object rides `dsx.this` as is, a scalar arrives as `{ value }`

**Symptom.** `dsx.this.value` is null for a watch on an object, or `dsx.this` stringifies as a
number when you expected a dict.

**Cause.** The payload law is shape dependent by design: an object value rides `dsx.this`
unchanged so its fields read directly, anything else is wrapped so there is always a name to read.

**Write.** For a scalar watch, read `value`. For an object watch, read the field. Do not write
`dsx.this.value.field`.

Cited: `OpenSource/Conformance/actions/watch-dispatch.json`, the corpus note and case
`watch-scalar-payload-rides-value`.

### A watch never fires on subscribe, so a seed that "obviously ran" did not

**Symptom.** A component that seeds a writable local from a read only prop through a watch starts
empty and only corrects itself when the prop next changes.

**Cause.** Watches attach after mount and never fire on subscribe. That is the reference
semantics, and `immediate` is the declared opt in that also fires once at mount.

**Write.** `<watch value="dsx.attribute.x" immediate="true" on:change="...">` for a seed.

Cited: `OpenSource/Conformance/actions/watch-dispatch.json`, case
`watch-never-fires-on-subscribe`; `OpenSource/Engine/TypeScript/packages/dom/src/mount.ts`, the watch wiring.

### A write of the same value does not re fire a watch

**Symptom.** A handler that should run on every save runs only when the value changed. A "mark
dirty" watch misses a re selection of the same row.

**Cause.** A watch fires when its value MEANINGFULLY changed, compared through the deep watch key,
so a structurally equal write is elided.

**Write.** Watch something that actually changes (a counter, a timestamp), or move the work to the
writer.

Cited: `OpenSource/Conformance/actions/watch-dispatch.json`, case
`watch-elided-equal-write-does-not-fire`.

### An event payload arrives FLAT, so a declared input names the key bare

**Symptom.** A toast draws an empty value. A cookie comes back empty. The guard that
should have caught the absence passed.

**Cause.** The runner spreads the payload into the handler scope and passes that scope as the
callee's caller scope, so the bare key is the only spelling that resolves. There is no `event`
plane: `message="event.message"` reads nothing, the miss resolves to the scope sentinel, and the
sentinel is stored rather than raising, so it is truthy, `== null` is false, and it draws as
nothing.

**Write.** `<action as="failed" message="message">`. Inside a handler BODY, `dsx.this.message` is
the documented alternative.

Cited: short-drama-app AGENTS.md house idiom, found 2026-09-01 across five sites;
`OpenSource/Engine/TypeScript/packages/kernel/src/runner.ts`, `callAction` (`{ ...callerScope, ...payload }`).

### A declared input at an ENTRY point names a payload key, not an expression

**Symptom.** A `<server>` action declaring `inputs="title, total"` receives null for both, so
declaring the contract is strictly worse than omitting it.

**Cause.** The two readings of `inputs="message"` are both correct and they are not the same: at a
surface call site the caller HAS a `message` in scope and the action means "take that one"; at an
entry the value arrives from outside and the action means "I accept one". Collapsing them
evaluated the input against an empty scope and overwrote the host's payload with the absent
sentinel.

**Write.** Nothing at the call site: the runner now distinguishes them, and a supplied payload key
wins while a default expression still resolves when the payload is silent. Know which reading
applies before you debug a null, and test entries through the real entry path.

Cited: runtime-pressure.md R1; `OpenSource/Engine/TypeScript/packages/kernel/src/runner.ts`, the
`options.entry` branch of `callAction`.

### A declared input spelled `platform` reads the runtime, not the caller

**Symptom.** A `<server>` action declaring `inputs="name, bundleId, platform"` sees
`platform == 'web'` on every request, whatever the caller sent. Not null and not an error: a string
of the right type, so `typeof platform == 'string'` passes, `trim()` passes, and the route answers
400 saying the platform must be one of the two values it was just given.

**Cause.** A declared input binds a SCOPE name, and the path resolver answers a handful of bare
heads itself ahead of any local: `attribute`, `cookie`, `dsx`, `env`, `global`, `item`, `module`,
`nav`, `os`, `platform`, `route`. Every other binding failure in this framework is loud; this one
produces a plausible value, so the guards a careful author writes all pass.

**Write.** Nothing, in a document the build accepts: the compile step refuses the declaration now
and names both ways out. Rename the input, or read `dsx.input.<name>`, which is a string key no
scope name can shadow and which answers the caller's own value at an entry.

Cited: `OpenSource/Engine/TypeScript/packages/kernel/src/jse/jse.ts`, `JSE_RUNTIME_SCOPE_NAMES` and the
`dsx.input.` branch of `lookup`; `OpenSource/Engine/TypeScript/packages/cli/src/server-document.ts`, `readAction`.

### A one statement `on:tap` body was routed by its punctuation, not by its grammar

**Symptom.** `on:tap="throw 'wires crossed'"` recorded nothing: no ledger entry, no `dsx.lastError`,
no move in `dsx.errorCount`. The same body written as `throw { code: 'x' }` recorded normally, and so
did either of them with a second statement after a `;`. `on:tap="out = await dsx.action.compute()"`
had the same shape: the target took null and nothing said why.

**Cause.** An entry with a single statement has none of the punctuation the router keys on, so it
took the bare-verb path, which dispatches a package call and can neither throw nor await. A `{` from
an object literal, a `;` from a second statement, or a newline all carried a body in by accident,
which is why every longer body worked and only the shortest ones did not.

**Write.** Nothing: `throw` and `await` are named in the routing condition on both native runners
now, and the web runner has no fast path there and never had the hole. Worth knowing because it is
the shape of the whole family: if a one statement body behaves differently from the same body with a
second statement after it, the router and not the grammar is deciding.

Cited: `OpenSource/Engine/Swift/Stack.swift` and
`OpenSource/Engine/Kotlin/core/src/main/kotlin/despia/engine/JseRunner.kt`, each `run`;
`ClosedSource/RuntimeParityTests/ErrorsCorpusTests`, which drives the raw body the way an `on:tap`
does, because a corpus that registers each body as a named action cannot see this.

### A declared action has no positional parameters, and the build says so now

**Symptom.** `dsx.action.save(id)` ran the action with no `id`. Measured on the live sign in page:
`dsx.action.post('/v1/auth/email', { email: address }, '')` against
`<action as="post" inputs="path, payload, bearer">` ran

    PROBE {"fetch":"","bodyIsNull":true,"bearerIsNull":true,"typeofPath":"undefined"}

All three declared inputs unbound, `typeof path` reading `"undefined"`, and a POST to the empty
string. No warning, no log, no unbound-input diagnostic.

**Cause.** The call site takes `args[0]` only when it is a dict and drops anything else, and there is
no positional parameter for the rest to land in: positional arguments are not part of the declared
action contract on any lane. Swift and Kotlin cast and drop identically.

**Write.** `dsx.action.save({ id: item.id })`, with `<action as="save" id="id">` reading the key
bare. The compile step refuses the positional form now, on a surface and in a `<server>` document
alike, and the sentence spells the write form out of the callee's own declared input names:

```
Activate: action "requestCode": line 2: dsx.action.post('/v1/auth/email', ...) passes a positional
first argument, and a declared action has no positional parameters: the runner binds a first
argument only when it is an object and drops anything else with no diagnostic, so "post" would run
with all 3 of its declared inputs unbound. Write dsx.action.post({ path: ..., payload: ...,
bearer: ... }), naming the inputs it declares (path, payload, bearer). A second argument is still
the event-callback dict.
```

A call with NO arguments stays legal, and it is the reading a declared input exists for
(`inputs="id: item.id"` computes from the caller's scope). So do an object literal, a name, and a
dotted path. The SECOND argument is still the event-callback dict and is never inspected. A callee
that declares no inputs is not judged: there is no contract for an argument to replace.

Cited: `OpenSource/Engine/TypeScript/packages/compiler/src/component.ts`, `scanActionCalls` and
`droppedActionArgument`; `OpenSource/Engine/TypeScript/packages/cli/src/server-document.ts`,
`readServerDocument`'s closing pass.

### `on:drag` never sees phase `start` on the web, and the press arrives as `move`

**Symptom.** A custom scrubber built on `on:drag` never runs its "grab" branch, and a state
machine keyed on `phase == 'start'` is dead code in the browser.

**Cause.** The declared phase vocabulary is `start | move | end`, but the web adapter fires
`dragStart` with phase `start` on pointerdown and IMMEDIATELY fires `drag` with phase `move`
(minimum distance zero, so the press itself is a move, which is what makes tap to seek work). An
`on:drag` handler therefore sees `move` first and `end` last, never `start`.

**Write.** Take the grab in `on:dragStart` and treat `on:drag` as move only. With no `on:dragEnd`
declared, the release runs the `on:drag` handler with phase `end`.

Cited: `OpenSource/Engine/TypeScript/packages/dom/src/mount.ts`, the `on:drag` block;
`OpenSource/Conformance/input/gestures.json` (the phase vocabulary).

### `on:longPress` beside `on:tap` eats the tap

**Symptom.** A control with both handlers stops responding to a slow press: the hold fires, the
finger lifts, and the tap handler never runs.

**Cause.** Once the hold is recognized (400 ms with the camel pair, 500 ms for the legacy
lowercase word), the recognizer sets a suppression flag that the click and pointerup paths consume,
so a recognized hold can never read as a tap too.

**Write.** Design for it: the long press is a different action, not a slower tap. If both must
fire, put the tap work in a shared action and call it from both handlers, with the long press
branch deciding whether to include it.

Cited: `OpenSource/Engine/TypeScript/packages/dom/src/mount.ts`, the `on:longPress` recognizer and
`suppressTap`.

### A field's `on:change` fires per keystroke

**Symptom.** A validation call, an analytics event, or a network request per character typed.

**Cause.** The web adapter binds the DOM `input` event, writes back the bound value, marks the
field dirty, validates, then calls the `change` handler with `{ value }`. It is a change stream,
not a commit.

**Write.** Debounce in the handler with the keyed timer (`setTimeout(() => { ... }, 400, 'search')`
replaces the pending one), and do commit work on submit or on blur.

Cited: `OpenSource/Engine/TypeScript/packages/dom/src/forms.ts`, the `input` listener.

### `&amp;` inside a string literal stays six characters

**Symptom.** A rendered label reads `Tom &amp; Jerry`. A comparison against `'&'` never matches.

**Cause.** Code bodies arrive raw from the markup reader, so the three OPERATOR entities
(`&amp;`, `&lt;`, `&gt;`) are decoded by the shared source preprocessor to keep `&&`, `<`, `>` and
friends working in a code position. String and template literals are NEVER decoded: the author's
characters are the program's characters.

**Write.** Put the real character in the string. Reach for `&amp;` only where XML forces it, which
is an ATTRIBUTE value, not a code body.

Cited: `OpenSource/Conformance/jse/syntax-006.json`, case `string-literal-never-decodes`.

---

## 5. Data, modules and the server tier

### A sibling action call answers the value, and only `dsx.module.*` is enveloped

**Symptom.** A guard reading a sibling's own verdict never fires. `const who = await
dsx.action.signedIn(); if (!who.ok)` was false whatever the action decided, so a route with no
bearer token registered its row at 201 instead of refusing at 401, and every line read correctly.
Probed:

    PROBE 418 {"who":{"ok":true,"data":{"ok":true,"account":{...}}},"t":"object"}

**Cause.** An awaited sibling call used to bind the module envelope `{ ok: true, data }`, so an
action returning its own `{ ok, refusal }` verdict had TWO `ok` fields one level apart and the
envelope's shadowed the action's. The shape was invisible at the call site.

**Write.** Read the value. `await dsx.action.x()` answers what the sibling returned, null when it
never returned, and a sibling that throws unwinds the caller the way a thrown body does. An
un-awaited call is fire and forget and answers null. `await dsx.module.x.y()` keeps the envelope,
because a seam's failure has no other channel: check `.ok` there and nowhere else.

Cited: `OpenSource/Engine/TypeScript/packages/kernel/src/runner.ts`, the `dsx.action.` branch;
`OpenSource/Engine/Swift/Stack.swift` and
`OpenSource/Engine/Kotlin/core/src/main/kotlin/despia/engine/JseRunner.kt`, each
`callActionForValue`; pinned on every lane by the `await-action-*` cases in
`OpenSource/Conformance/actions/actions.json`.

### An absent value crossed a package seam as an object, not as a null

**Symptom.** A declared package reads a field a body left absent as though it were sent.
`listEntitlements({ appId: asked })` with `asked` null returned zero rows instead of all of them,
and a signer that wanted a date answered 400 having been handed an object. No error and no field
name in either failure.

**Cause.** A JSE scope binds an absence to a SENTINEL object, so `=== null` and `=== undefined` on
the TypeScript side of the seam were both false.

**Write.** Nothing: the seam renders it as a real `null` now, in both directions and at every depth,
including inside an array. A document that normalised an absent value to the empty string before it
crossed can drop that line.

Cited: `OpenSource/Engine/TypeScript/packages/server/src/packages.ts`, the `isNSNull` arm of `sanitize` and the
inbound pass in `callPackage`.

### `dsx.api.<as>(payload)` posts the payload as the body

**Symptom.** The server receives `{ body: { ... } }` and every declared input reads null.

**Cause.** Calling the block posts its argument verbatim: the argument IS the body.

**Write.** `dsx.api.<as>({ id: x })`, never `dsx.api.<as>({ body: { id: x } })`.

Cited: short-drama-app PLAN.md section 6.11.

### `list` clamps `limit` to 100 and says nothing

**Symptom.** Every show past the hundredth episode row displays `EP 0`. A count that should read
340 reads 100, and there is no flag saying so.

**Cause.** The repository's list limit is deliberate policy, but there is no truncation flag, no
cursor and no count operation, so a read past 100 rows is unreachable and a caller cannot tell a
full page from a complete set.

**Write.** Never `limit: 1000`. Read per parent (one bounded query per show), and where a total is
genuinely wanted, render `100+` and say why in the UI.

Cited: short-drama-app PLAN.md section 6.20.

### Dynamic module dispatch resolves null or returns zero rows, and reports SUCCESS

**Symptom.** A loop over table names completes, reports success and does nothing. Or a helper that
takes a table as a parameter runs, returns no rows, and no branch reports an error.

**Cause.** Two spellings, two different silent failures. `dsx.module.data[name]` (a bracket read on
the module namespace) resolves the WHOLE expression to null, so `await` yields null and every `.ok`
reads false. Passing the table object into a lambda (`count(dsx.module.data.favorite)`) is worse:
the call succeeds and returns ZERO rows, because the object loses the caller's row level scope
travelling as a value. Probed on a live origin: literal path 5 rows, bracket read null, via lambda
0.

**Write.** Name every entity literally, even when that means unrolling twelve near identical
blocks. Verbose beats a sweep that lies.

Cited: short-drama-app PLAN.md section 6.87.

---

## 6. Rendering and copy

### A hydrated `<scroll>` has no scroll plane, so the affordance dies on the landing page

**Symptom.** A scroll driven header, progress bar or fade works when you navigate to the screen and
does nothing on a cold load of that same URL.

**Cause.** A server rendered screen's OUTERMOST scroller comes back without the scroll axis stamp,
without the inline overflow, without the scroll linked custom properties and without `on:scroll`
dispatch, while the identical component mounted by a client side route change has all of it.
Nested scrollers are fine; only the hydrated root is affected.

**Write.** Design the root scroller's chrome to be correct statically, or verify the affordance on
a COLD load specifically, not just after a route change.

Cited: short-drama-app PLAN.md section 6.40.

### A page taller than its box squeezes a stack below its own lines

**Symptom.** On a phone a bordered stack that holds a paragraph (an inline chip, `word-break`) is
shorter than the lines it painted: the last line hangs under the border and runs into the next
caption. The same page in a tall window is clean, and the paragraph measures correctly in
isolation.

**Cause.** A stack is `min-height: 0` and `flex-shrink: 1`, and a `<vstack style="height: 100%">`
whose children add up to more than the screen shrinks every stack child to share the overflow. The
web does exactly this (a Chromium 390x844 render of the nativewrap page gave the box 10px for
73px of content), so nothing is wrong in the renderer; leaf `<text>` does not shrink, which is why
only the boxed paragraphs were hit.

**Spelling that works.** Put content that can outgrow the screen inside a `<scroll>` (and give the
column no `height: 100%`), or give the box `flex-shrink: 0`. Citation:
`evidence/native-css-degradations-eliminate/fixture/NativeWrap.dsx`,
`DesktopSoftWrapParagraphUiTest.aMixedParagraphBoxHoldsItsLinesInAPhoneViewport`.

### `style="{{ chunk }}; extras"` silently drops the chunk

**Symptom.** Half the declarations apply. The static half works, the interpolated half is missing,
and no gate says anything.

**Cause.** The style attribute is split on `;` BEFORE interpolation, so the colon free fragment
`{{ chunk }}` is discarded as an invalid declaration. Only the whole attribute spelling reaches the
declaration list door.

**Write.** One computed value used as the WHOLE attribute: `style="{{ oneComputedList }}"`.
Single value holes inside one declaration (`max-width: {{ n }}px`) are fine.

Cited: short-drama-app PLAN.md section 6.17 (a bare `{{ var }}` fragment in a compound style
attribute is silently discarded).

### Copy reaches the string table only at a DISPLAY point

**Symptom.** A fully translated app still shows English in a handful of places: a label built in an
action, a string concatenated in a computed, a caption assembled from parts.

**Cause.** The localization seam is wired at the display bindings and only there. `bindDisplay`
looks up the whole attribute TEMPLATE, normalized with numbered holes (`Unlock for {{ coins }}
coins` becomes `Unlock for {0} coins`); on a miss it tries the RENDERED form, which is the legacy
door tables were written against, so a ternary over bare literals still hits on the arm it
rendered. A string you COMPUTED reaches neither key, because it never passes a display binding.

**Write.** Keep copy in the attribute where it is displayed. For a string you must compute (a
picker row built in a function library), use the explicit `localize('Save')` door. And remember
that copy you hand a component is displayed by the CHILD: the key is the value the caller wrote,
or the child's `default=` at a mount that omits the attribute.

Cited: `OpenSource/Engine/TypeScript/packages/dom/src/mount.ts`, `bindDisplay`;
`OpenSource/Engine/TypeScript/packages/kernel/src/strings.ts`, `localizeTemplate` and its legacy door;
[`localization.md`](https://docs.despia.com/framework/skills/localization).

---

## Related

- [`dsx-best-practices.md`](https://docs.despia.com/framework/skills/dsx-best-practices), the rules the linter enforces.
- [`writing-an-app.md`](../writing-dsx-apps/SKILL.md), the language itself.
- [`thinking-in-dsx.md`](../thinking-in-dsx/SKILL.md), if React fluency is shaping the code.
- [`Documentation/architecture/runtime-pressure.md`](https://github.com/despia-native/despia/blob/main/OpenSource/Documentation/architecture/runtime-pressure.md),
  the procedure for filing the next one.

## A transition that never animates, and a name that flies nowhere

**Symptom.** `dsx.transition(() => { ... })` changes the state and nothing animates; or a
`view-transition-name` is on the thumbnail and the detail and the push plays the plain slide.

**Cause, first shape.** The awaited envelope said why and nobody read it:
`{ ok: true, data: { skipped: true, reason: 'reduced-motion' | 'unsupported' | 'superseded' | 'skipped' | 'joined' } }`.
Reduced motion skips every `dsx.transition` animation and cannot be opted out of; a satellite, the
desktop lane and a server render are `unsupported`; a second call while the first animates
supersedes it; a call from inside a running update joins it.

**Cause, second shape.** The name resolves on one side only (a media query set it to `none` at
this width, a class is missing on the detail), or the same name appears twice in one frame and
the first occurrence won, or the route declares `motion: "none"`. An unmatched name is silent by
design; the lint reports a duplicate.

**Cause, third shape (web).** The update pushed a frame and the list under the new frame still
named `photo-3`, so the browser saw two participants with one name and skipped. The runtime
neutralizes covered frames' names for you; if you built your own layer of covered content
outside the router's frames, name it `none` while covered.

**Spelling that works.** Read `r.data.reason` when it matters; name both sides from the same
sheet; keep one name per frame. Citation: `OpenSource/Conformance/router/transition.json`,
`packages/dom/oracle/view-transition-api-browser.ts`,
[`Documentation/guides/transitions.md`](https://docs.despia.com/framework/guides/transitions).

## An `await` inside a `dsx.transition` update that finishes after the capture

**Symptom.** On iOS or Android the state an `await` wrote inside the update callback shows up
after the transition ended, with no animation; on the web the same callback animates.

**Cause.** The native runners run the update callback synchronously and continue an inner
`await` after the capture; the browser waits for the callback's promise.

**Spelling that works.** Fetch before, transition after:
`const r = await fetch(...); dsx.transition(() => { dsx.variable.items = r.data })`.
Citation: `Stack.swift runTransition`, `JseRunner.kt runTransition`,
[`Documentation/guides/transitions.md`](https://docs.despia.com/framework/guides/transitions).

