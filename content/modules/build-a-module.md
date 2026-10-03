---
title: Build a module
description: Write your own Despia module, from an empty folder to a release: the manifest, the Swift, Kotlin and web facets, components, state, tests, versioning and publishing.
route: /framework/guides/build-a-module
section: modules
label: Build a module
order: 2
---

# Build a module

A module is the unit that brings a capability into a Despia app. It can be a native API (the
camera, haptics, a payment sheet), a set of DSX components, a backend, or all three. This guide
builds one complete module, `greeter`, step by step, then covers state, tests, versioning,
publishing and the rules the build enforces.

Building with a coding agent instead? Point it at [the skill](/framework/skills/writing-a-module):
it carries the same recipe, written for an agent.

## Why "module"

You will see two words. The thing you write is a **module**: its base class is `Module` and apps
call it through `dsx.module.<command>`. The thing you distribute is often called a **package**, and
the command line uses that word (`despia package check`, `despia add`). The code never names a type
`package`, because `package` is a reserved word in Java and Kotlin, and the same module has to
compile on the Android lane.

## Anatomy

A module is a folder. In your own app it lives at `Modules/<Name>/` in the project root, where
`despia export` reads it ([reserved directories](/framework/guides/reserved-directories)).

| Part | What it is |
|---|---|
| `dsx.json` | The manifest: the module's name, icon, `command`, version, licence, declared `context` (state), `actions` (verbs, with their args, what they resolve and their tests) and the platform rows (`infoPlist`, `androidManifest`, pods, gradle). An unknown key aborts the build. |
| `swift/` | The iOS (and macOS) facet: a `Module` subclass. |
| `kotlin/` | The Android (and desktop) facet: the same class in Kotlin. |
| `web/index.js` | The web facet: the same verbs for the browser. |
| `Components/*.dsx` | DSX components the module ships. |
| `web/server/*.dsx` | Optional, for a full-stack module: a `<server>` document with routes, entities and workers ([writing a backend](/framework/skills/writing-a-backend)). |
| `config.json` | Optional: values an app can set per app, read in the manifest as `{{ dsx.config.<key> }}` (usage strings, SDK keys). |
| `README.md` | The caller-facing page ([documenting a module](/framework/skills/documenting-a-module)). |

No platform is the default: Swift lives only in `swift/`, Kotlin only in `kotlin/`. A file's
presence is the switch, so leaving a module out of a build removes its files. There is no `#if`
in module code.

## Step 1: create the project and the folder

```bash
despia init --dir my-app --name "My App"
cd my-app
mkdir -p Modules/Greeter/swift Modules/Greeter/kotlin Modules/Greeter/web Modules/Greeter/Components
```

## Step 2: write the manifest

`Modules/Greeter/dsx.json`:

```json
{
  "name": "Greeter",
  "icon": "chat-bubble",
  "command": "greeter",
  "version": "0.1.0",
  "license": "Apache-2.0",
  "context": {
    "count": { "type": "number", "default": 0 }
  },
  "actions": {
    "hello": {
      "args": { "name": "string" },
      "resolves": { "text": "string" },
      "tests": [
        { "name": "greets by name", "args": { "name": "Ada" }, "resolve": { "text": "Hello, Ada" } }
      ]
    }
  }
}
```

- `command` is the module's identity, the word apps call: `dsx.module.greeter.hello(...)`. It is
  lower case, letters, digits and underscores, never a hyphen.
- `context` declares state other code can read: `dsx.module.greeter.context.count`.
- Each action declares its `args`, what it `resolves`, and its tests, next to each other. The build
  checks every test against the action's own shapes.
- `icon` is an [iconoir.com](https://iconoir.com) name.

## Step 3: implement the action on each platform

`Modules/Greeter/swift/Greeter.swift`:

```swift
final class Greeter: Module {
    private var count = 0

    override func setup() {
        dsx.context.set("count", 0)
        dsx.action("hello") { [self] dsx in
            let name = dsx.args("name") as? String ?? "there"
            count += 1
            dsx.context.set("count", count)
            dsx.resolve(JSON(["text": "Hello, \(name)"]))
        }
    }
}
```

`Modules/Greeter/kotlin/Greeter.kt`:

```kotlin
package despia.modules.greeter

import despia.engine.JSON
import despia.engine.Module

class Greeter : Module() {
    private var count = 0

    override fun setup() {
        dsx.context.set("count", 0)
        dsx.action("hello") { dsx ->
            val name = dsx.args("name") as? String ?: "there"
            count += 1
            dsx.context.set("count", count)
            dsx.resolve(JSON(mapOf("text" to "Hello, $name")))
        }
    }
}
```

`Modules/Greeter/web/index.js`:

```js
let count = 0;

export default {
  scheme: "greeter",
  state: { count: 0 },

  boot(dsx) {
    dsx.context.set("count", 0);
  },

  actions: {
    hello(ctx) {
      count += 1;
      ctx.dsx.context.set("count", count);
      return { text: `Hello, ${ctx.args("name") ?? "there"}` };
    },
  },
};
```

The three facets are one contract. The scheme comes from `dsx.json`, so the Swift and Kotlin
classes do not repeat it. When an action fails, answer with a stable code the caller can branch
on: `dsx.fail(code, message:, recoverable:, data:)` on the native lanes.

## Step 4: call it from markup

`Modules/Greeter/Components/GreetButton.dsx`:

```xml
<vstack style="gap: 8px">
  <head>
    <attribute as="name" default="'there'"/>
    <variable as="text">return ''</variable>
    <action as="greet">
      const r = await dsx.module.greeter.hello({ name: dsx.attribute.name })
      if (r.ok) { dsx.variable.text = r.data.text }
    </action>
  </head>
  <button label="Say hello" variant="prominent" on:tap="dsx.action.greet()"/>
  <text value="{{ dsx.variable.text }}"/>
  <text type="footnote" value="{{ 'Greeted ' + dsx.module.greeter.context.count + ' times' }}"/>
</vstack>
```

- `await dsx.module.greeter.hello(...)` answers the envelope: `ok`, and `data` when it worked.
- A call your page makes without `await` is fire and forget.
- `dsx.module.greeter.context.count` reads the declared state and updates when the module publishes
  a new value.

A module with a `command` scopes its components to it, so pages use the qualified tag:
`<greeter.GreetButton name="Ada"/>`. A module with no `command` that ships only components makes
them global (`<GreetButton/>`).

## Step 5: check, lint and look at it

```bash
despia package check Modules/Greeter   # the package rules and the markup lint, on this module
despia lint                            # the whole project
despia describe Modules/Greeter/Components/GreetButton.dsx   # the component as a contract
despia dev                             # run it in the browser
despia verify <route>                  # render a route and compare it with its reference
```

`despia package check` exits with 1 on any finding and names the rule. Fix every finding before
you ship.

## Step 6: test it

Component and action logic runs headless with [`despia test`](/framework/guides/testing). A
module call your test does not declare is refused with `not_mocked`, so a test never reaches a real
device API.

`tests/greet-button.test.js`:

```js
import { test } from "node:test";
import assert from "node:assert/strict";
import { mount } from "@despia-native/cli/test";

test("greets by name", async () => {
  const button = await mount("greeter.GreetButton", {
    attributes: { name: "Ada" },
    modules: { "greeter.hello": () => ({ text: "Hello, Ada" }) },
  });
  await button.action("greet");
  assert.equal(button.variable("text"), "Hello, Ada");
});
```

```bash
despia test
```

## Permissions and platform rows

A module that needs an OS permission declares it in its manifest, never in app code. The usage
string is a config token, so each app can word it:

```json
{
  "infoPlist": { "NSCameraUsageDescription": "{{ dsx.config.usage_description }}" },
  "androidManifest": { "permissions": ["CAMERA"] }
}
```

The default for `usage_description` lives in the module's `config.json`. Per-app native settings
are covered in [dynamic modules](/framework/skills/dynamic-modules).

## A component other sites can embed

```bash
despia expose greeter.GreetButton
```

`expose` makes the component a custom element that any website or framework can embed (the tag
defaults to `greeter-greetbutton`). See [embed anywhere](/framework/guides/embed-anywhere).

## Versioning and publishing

Every module carries `releases.json`, its release ledger. The package commands compute what
changed and refuse to understate it:

```bash
despia package diff old/Greeter Modules/Greeter    # the semantic diff: major, minor or patch
despia package release Modules/Greeter             # plan the next entry (add --apply to write it)
```

Publish the module folder as its own git repository, tagged with the version. An app installs it
by pinning that tag:

```bash
despia add github:you/greeter@0.1.0
```

`despia add` records the pin in `dsx.lock.json` by its tree hash, so the bytes an app builds with
never change under it.

## Forking a complete component

A module that ships a complete component built from smaller public pieces declares it in
`composites`. An app that wants to change it beyond its theme copies it into its own code:

```bash
despia own greeter.GreetButton
```

The copy is the app's own DSX from then on, and records where it came from.

## The rules that bite

- **One spelling.** The `command` is the module's only name. A nested module (a child folder under
  a parent's `Modules/`) gets a dotted chain derived from the tree, such as `watch.health`. Never
  write a chain by hand: in native code, read it as `Self.resolvedScheme`.
- **Reserved words.** `on`, `available`, `excluded`, `state`, `context`, `object`, `delegate`, `dsx`
  and `then` are members of every module handle, so none of them can be a command segment or an
  action name. Neither can `dsx`, `route` or `self`, and `post` and `invoke` can appear nowhere in
  an action path.
- **Calling another module.** Use `dsx.module.<command>.<action>(args)`. Await it for the result,
  call it bare for fire and forget, and on Swift write `try?`, so the call is a no-op when that
  module is not in the build.
  - To announce something any number of modules may care about, use `dsx.fire("name")` and
    `dsx.hook("name")`. Never use a fire as a disguised call.
  - [Calling another module](/framework/skills/cross-module-calls) covers all three shapes.
- **Reading another module's value.** Read the state it declares,
  `dsx.module.<command>.context.<var>`, never a magic string
  ([module context](/framework/skills/module-state)).
- **One owner per capability.** If a module already owns a concept, yours is an adapter:
  `"adapts": "<word>"`, with the owner in `dependencies`. Only one module owns each OS integration
  (calls, push, picture in picture); call that owner instead of linking the SDK yourself.
- **Declared and introspectable.** Every state value is in `context`, every verb in `actions`, every
  event you emit is declared. An unknown manifest key aborts the build.
- **File presence is the gate.** Keep Swift in `swift/` and Kotlin in `kotlin/`. Never write
  `#if FEATURE_ENABLED` to switch a module on or off.

## Next

- [The skill](/framework/skills/writing-a-module): the same recipe for your coding agent.
- [Extracting a module](/framework/skills/extracting-a-module): turn code you already have into a
  module.
- [Module catalogue](https://despia.com/modules): modules you can install today.
