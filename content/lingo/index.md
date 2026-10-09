---
title: Lingo
description: The dictionary of DSX words: what each one refers to, which word we use in the console, the docs and in code, and which words to avoid.
route: /lingo
section: lingo
order: 1
---

# Lingo

The words DSX uses, 81 of them, and what each one means. The console and public conversation say **package**; code and APIs say **module** (`dsx.module.*`). It is the same thing: read [Package or module?](/lingo/package-vs-module).

The same dictionary is available to tools: `despia define <term>`, `despia glossary --json`, and the toolchain MCP tools `glossary` and `define`.

Lingo 0.1.0, 81 terms. Generated from the glossary dataset; edit the dataset, not this file.

## The units you build with

### package

An installable piece of functionality for a DSX app: a folder with a dsx.json manifest that can bring actions, events, components, facets and native code.

We say **package**. In code it is `dsx.module`, `dsx.json`, `Modules/`.

Package is the common word: the console, the docs prose, support and public conversation all say package. In code and APIs the very same thing is called a module (`dsx.module.<command>`), because `package` is a reserved word on Android (Kotlin and Java) and Swift overloads it. A package is a module and a module is a package. One package can hold more than one thing: several actions, events and context values, DSX components, a backend, and the Swift, Kotlin and web code that implements it on each platform. The word package also names three unrelated things in other tools (npm, Swift Package Manager, Gradle and Maven); never use it for those without saying which.

Meanings:

1. **DSX package (ours)**: An installable unit of functionality for a DSX app, a folder with a dsx.json manifest. We say: package in the console, docs and conversation; module in code.
2. **npm package**: A JavaScript distribution unit published to the npm registry, such as @despia-native/cli. We say: npm package.
3. **Swift Package Manager package**: A Swift source distribution described by a Package.swift file. We say: Swift package.
4. **Gradle or Maven artifact**: A versioned library resolved by Maven coordinates (group:name:version) in Android builds. We say: Gradle artifact, or Maven coordinate.
5. **Android package name**: The unique application id of an Android app, like com.example.app. We say: Android package name (app id).
6. **Kotlin or Java package statement**: The namespace line at the top of a source file. We say: package statement.

| Where | How we say it |
|---|---|
| ui | package: the console's Packages screens, install and remove buttons. |
| cli | package: `despia packages`, `despia add`, `despia remove`, `despia package check`. |
| code | module: `dsx.module.<command>.<action>()`, the `Module` class, `ModuleRegistry`, the `modules` key of dsx.config.json, the `Modules/` folder. |
| api | module in the runtime API (`dsx.module.*`); package for the things you pin, version, install and publish. |
| docs | package when talking to people about choosing and installing one; module when showing code. First mention: "package (called a module in code)". |
| conversation | package, always. |

Do not say:

- "plugin" (ui, cli, docs, conversation): DSX has no plugin API (ADR 0003): what you install is a package.
- "add-on" (ui, cli, docs, conversation): an add-on is not a DSX word; say package.
- "addon" (ui, cli, docs, conversation): an addon is not a DSX word; say package.
- "module" (ui, conversation): people hear package; module is the code word.

Reserved or overloaded:

- Android (Kotlin and Java): `package`. a reserved keyword in both languages, so no type or API can be named package on the Android lane.
- Swift: `package`. Swift Package Manager packages, and the `package` access modifier since Swift 5.9, overload the word.

Also heard: module.

Retired words: plugin, add-on, addon.

Related: module, command, manifest, facet, first-party-package, npm-package, swift-package, gradle-artifact, android-application-id.

### package

The code and API name of a package: what you call as dsx.module.<command> and what extends the Module base class.

We say **package**. In code it is `dsx.module`, `Module`, `ModuleRegistry`, `dsx.module.<command>`.

Module is the one name that works on iOS, Android and the web, which is why code uses it. It is reserved on none of our targets, whereas `package` is a keyword in Kotlin and Java and is overloaded by Swift. Everything in the runtime uses module: the call root `dsx.module.<chain>.<action>()`, the `Module` base class, `ModuleRegistry`, the `modules` key in dsx.config.json, the `Modules/` folders. A module is a package: the console shows the same thing under the name package. Say module when you write code or an API name, and package when you talk to people.

| Where | How we say it |
|---|---|
| ui | package (never module). |
| cli | package for the thing you pin and install; module appears in call paths such as dsx.module.camera. |
| code | module, always: dsx.module.*, class Module, ModuleRegistry. |
| api | module: dsx.module.*. |
| docs | module in code samples and in the guide for authors (Build a module); package in prose for readers who install. |
| conversation | say package; if a developer asks what it is called in code, it is a module. |

Do not say:

- "package" (code, api): package is a keyword in Kotlin and Java and overloaded by Swift: never name a type, folder or API package in code.

Reserved or overloaded:

- Android (Kotlin and Java): `package`. a reserved keyword; the reason code says module.
- Swift: `package`. overloaded by Swift Package Manager and the `package` access modifier.

Also heard: module.

Retired words: scheme module, plugin.

Related: package, dsx-module-call, chain, command, facet.

### command

A package's callable name: the key "command" in its dsx.json, and the word that follows dsx.module. when you call it.

We say **command**. In code it is `command`, `dsx.module.<command>`.

A package answers to exactly one command (a nested package answers to a dotted chain). The older word scheme is retired for this meaning: no manifest reader accepts a "scheme" key any more, although a package may still own a real URL scheme such as scheme:// for OS hand-offs. A command of a package is not a CLI command (despia build is a verb of the toolchain).

| Where | How we say it |
|---|---|
| code | command: dsx.module.camera.capture(), and "command": "camera" in dsx.json. |
| docs | command for a package's callable name; scheme only for a real URL scheme such as https://. |
| cli | a CLI command is a verb of the toolchain: say CLI command or verb. |

Do not say:

- "scheme" (docs, ui): the manifest key is command; scheme is retired for the callable name.

Retired words: scheme.

Related: package, module, chain, cli, dsx-module-call.

### chain

The dotted identity of a nested package, derived from where it sits under Modules/ (for example watch.health) and resolved by the longest known prefix.

In code: `chain`.

Nothing hand-writes a full chain: a manifest declares only its local segment and the folder nesting supplies the rest, so a package can move and its chain re-derives. The chain is both the API face (dsx.module.watch.health.heartRate()) and the wire token (watch.health://heartRate). It has at most four segments.

| Where | How we say it |
|---|---|
| code | chain: dsx.module.<chain>.<action>(). |
| docs | chain, after a first mention of nested packages. |

Related: module, command, nested-module, dsx-module-call.

### nested package

A package that lives inside another package's Modules/ folder; it is a full citizen with its own chain, and excluding the parent excludes it.

We say **nested package**. In code it is `Modules/ container`.

Childhood is earned: a child is nested when it only makes sense with its parent (a provider under the capability it adapts, a feature under a family). Exclusion cascades from parent to children.

| Where | How we say it |
|---|---|
| ui | a package inside a package family. |
| code | a module under Modules/. |

Related: module, chain, exclusion, provider.

### first-party package

A package that ships with Despia, in one of three tiers: Mandatory (always present), Core (excludable per build) or Custom (per app).

We say **first-party package**. In code it is `Core/`, `Mandatory/`, `Custom/`.

Mandatory is a tier, never a privilege: a Mandatory package gets no kernel shortcut. Core packages are the large shelf you choose from. A first-party package is addressed as Core/Camera when you pin it by path. Community packages are the ones not made by Despia.

| Where | How we say it |
|---|---|
| cli | first-party package, pinned as Core/Camera@1.4.0. |
| code | folders Core/ and Mandatory/ under Modules/. |

Also heard: built-in package.

Retired words: plugin.

Related: package, exclusion, catalog.

### facet

A registered word that binds a folder name inside a package to a target, so one package can carry native code for the app, a watch, a widget and the web side by side.

In code: `facet`, `facets`.

A package is one organ with one command but may run in several runtimes: the app process, the watch process, a clip. Each runtime's code sits in a facet folder. No facet name is known to the kernel: the package that owns a target binds the word (the host binds app; a watch package binds watch). A facet is not a platform, a lane or a target: a facet names the KIND of residence, a target is the declared deployment, a lane is the toolchain folder (swift, kotlin, web).

| Where | How we say it |
|---|---|
| code | "facet": "watch" in dsx.json; the watch/ folder of a package. |
| docs | facet, introduced as: the part of a package that runs in one runtime. |

Retired words: feature.

Related: target, lane, module, platform.

### manifest

The dsx.json file that declares a package or a project: its command, actions, context, facets, config and dependencies, in a closed key vocabulary.

We say **manifest**. In code it is `dsx.json`.

dsx.json is the only manifest filename; manifest.json is retired. A project's dsx.json carries its name, version and template pin; a package's carries what it offers. Do not confuse it with App.json (the app identity manifest), dsx.config.json (the project build config) or CapabilityManifest.json (a generated aggregate of every capability).

| Where | How we say it |
|---|---|
| code | dsx.json |
| docs | the manifest (dsx.json). |

Retired words: manifest.json.

Related: package, project-config, lockfile, capability.

### project config

The dsx.config.json file of a project: its entry component, per-package config overrides, web scripts and head rows, and deploy blocks.

We say **project config**. In code it is `dsx.config.json`.

The packages a project uses are listed under "modules" (code spelling) and tuned under moduleConfig, keyed by the package command. It is read by the CLI at build time.

| Where | How we say it |
|---|---|
| code | dsx.config.json: "modules", "moduleConfig". |
| docs | the project config (dsx.config.json). |

Related: manifest, package, lockfile.

### lockfile

The dsx.lock.json file that pins the exact packages a project uses by version, tree hash and provenance.

We say **lockfile**. In code it is `dsx.lock.json`.

despia add writes a pin (a git tag by its tree hash, an npm package by its integrity hash) and despia remove deletes it; the cache keeps the bytes. A package may also carry its own dsx.lock.json that pins its native binary dependencies.

| Where | How we say it |
|---|---|
| cli | despia add / despia remove change the lockfile. |

Related: package, project-config.

### capability

What an app can do (messaging, payments, camera): a single word that one package owns and other packages may adapt.

We say **capability**. In code it is `owns`, `adapts`, `CapabilityManifest.json`.

A capability is the user-facing word, a package is the thing you install. About two hundred packages implement roughly two dozen capabilities, so people should learn capabilities and let the console and the CLI show the packages behind them. A capability is not a package: one capability can have an owner package and several provider packages. CapabilityManifest.json is the generated machine-readable aggregate.

| Where | How we say it |
|---|---|
| ui | capability, when grouping what an app can do. |
| code | owns: ["word"] in the owner's dsx.json. |

Related: package, capability-owner, provider.

### owner package

The one package that owns a capability: it holds the API, the normalised shapes, the provider seam and the typed refusals, and imports no vendor SDK.

We say **owner package**. In code it is `owns`.

Dependency direction is always provider to owner, never owner to vendor SDK and never provider to provider. Including a provider brings in the owner; including the owner brings in no provider.

| Where | How we say it |
|---|---|
| code | owns: ["<word>"] (ADR 0019 K1). |

Related: capability, provider.

### provider

A package that adapts one vendor or backend to a capability owner's seam, bringing its own SDK, permissions and store declarations.

We say **provider**. In code it is `adapts`, `provider facet`.

Choosing a provider is configuration, not code. The word provider has two other meanings: a deploy provider (Cloudflare, Supabase, Vercel, GitHub Actions: where you deploy to) and the data backend providers under the server package. Say provider package, deploy provider or data provider to keep them apart.

| Where | How we say it |
|---|---|
| code | adapts: "<word>" in the provider's dsx.json. |
| ui | provider, in the capability's settings. |

Related: capability, capability-owner, deploy-target, package.

### catalog

A browsable list: the package catalog (every package with its settings) or the component catalogue; say which.

We say **catalog**. In code it is `PackageCatalog.json`, `OpenSource/Catalog`.

The package catalog is generated from every package's config schema so settings screens can be built from data. The component catalogue is the library of ready components. Neither is the same as the community registry list.

| Where | How we say it |
|---|---|
| ui | the package catalog |
| docs | package catalog or component catalogue |

Related: package, component, first-party-package.

## The language

### action

A named, callable unit of behaviour: a package declares actions in dsx.json, and a DSX document declares them as workflows with <action>.

We say **action**. In code it is `<action>`, `actions`.

An action runs the full statement grammar and can call other actions, so actions are workflows: chaining, branching, looping and emitting events, with a depth cap. return, break and continue are local to the action; only a throw reaches the caller. A package's actions are what other code reaches through dsx.module.<chain>.<action>().

| Where | How we say it |
|---|---|
| code | <action as="save"> in a document; "actions" in dsx.json. |

Related: dsx-module-call, event, manifest.

### JSE

JavaScript Expressions: the expression and logic engine of DSX, the same grammar on every renderer, budgeted so a loop cannot hang a render.

We say **JSE**. In code it is `JSE`.

Authors write JSE in variables, actions and bindings. It is a language of its own, not the platform's JavaScript: its semantics are fixed by a conformance corpus that runs on the Swift, Kotlin and TypeScript executors.

| Where | How we say it |
|---|---|
| docs | JSE |

Related: dsx, action.

### DSX

The Despia language and runtime: XML-style markup, JSE expressions and JSON, styled with standard CSS, running natively on web, iOS, Android and desktop.

We say **DSX**. In code it is `DSX`, `DespiaScript`.

DSX is the language and the project's declarations; Despia is the tool, the account and its state. DespiaScript is an older name for the language; the module-authoring pattern in Swift and Kotlin is also described under that name in some skills.

| Where | How we say it |
|---|---|
| docs | DSX |

Also heard: DespiaScript.

Related: dsx-document, dsx-css, jse, component.

### DSX document

A .dsx file: a head that declares contract, state and logic, and a body of pure markup; screens, components, servers and commands are all documents.

We say **DSX document**. In code it is `.dsx`.

One .dsx file is one component and the file name is the component name. The document kinds are the screen or component, <server>, <cli>, <film> and the deploy document.

| Where | How we say it |
|---|---|
| docs | DSX document, or .dsx file |

Also heard: .dsx file.

Related: component, server-document, cli-document, dsx.

### component

A reusable piece of interface written as a .dsx document over primitives, running unchanged on every renderer.

We say **component**. In code it is `Components/`, `<Name/>`.

A primitive is native because it wraps a platform capability markup cannot reach (a text input, a camera preview); a component is DSX over primitives. A component is not a package: a package may ship components, and a project's own screens are components too.

| Where | How we say it |
|---|---|
| docs | component |

Related: dsx-document, package, primitive.

### primitive

A building block that is native because it wraps a platform capability markup cannot express, and so exists on every renderer.

The test is one question: does it need a platform capability markup cannot express? If it only draws shapes, it is a component written in DSX.

| Where | How we say it |
|---|---|
| docs | primitive |

Related: component, renderer.

### DSX-CSS

The standard-CSS styling of DSX with a closed property vocabulary: an unknown property or malformed value is a build error.

We say **DSX-CSS**. In code it is `dsx-css-properties.json`.

Presentation is standard CSS and only standard CSS, written as a style attribute or a class. The old attribute dialect (padding="20", radius="8") is deleted and refused by the linters.

| Where | How we say it |
|---|---|
| docs | DSX-CSS, or just CSS |

Related: dsx, component.

### server document

A .dsx document whose head declares entities, secrets, egress and actions and whose body declares routes and workers: how backend logic is authored in DSX.

We say **server document**. In code it is `<server>`.

The server is the fourth node of the model. A <tool> row on a server document is served at /mcp by @despia-native/server, which is how an app gets its own MCP face.

| Where | How we say it |
|---|---|
| docs | server document |

Related: dsx-document, app-mcp, service.

### command document

A .dsx document whose body is a command-line program's command surface; the despia CLI itself is one.

We say **command document**. In code it is `<cli>`, `despia.cli.dsx`.

One command table has three faces: the argv parser, --help and the toolchain MCP, so a verb cannot exist in one and be missing in another. A package may carry a fragment of it (ADR 0003).

| Where | How we say it |
|---|---|
| docs | command document |

Related: cli, mcp, dsx-document.

## The runtime

### dsx.module.<chain>.<action>(args)

The point-to-point call of one named package's action, the first of the module bus's four verbs (call, decide, announce, detect).

In code: `dsx.module.<chain>.<action>(args)`.

Use it when you can name the package you want. It resolves a promise. The module proxy has nine reserved member names (on, available, excluded, availability, context, object, delegate, dsx, then) that are never a segment or an action. A fan-out to many is N call lines, never a disguised event.

| Where | How we say it |
|---|---|
| code | await dsx.module.camera.capture() |
| api | dsx.module.* is the runtime call API. |

Related: module, chain, action, delegate, broadcast, context.

### event

A named announcement inside a DSX document: one emission, dsx.event(name, payload), and one handler, on:<name>.

We say **event**. In code it is `dsx.event`, `on:<name>`.

The document bus has exactly one emission and one handler. The module bus is separate: dsx.delegate asks a question, dsx.broadcast announces to anyone. The old verbs fire, claim, fireAny, collect and hook are deleted from the kernel; some older skill pages still show them and are stale.

| Where | How we say it |
|---|---|
| code | dsx.event("saved", payload) and on:saved="...". |

Do not say:

- "dsx.fire" (code, docs): deleted; use dsx.event in a document or dsx.broadcast between packages.
- "dsx.hook" (code, docs): deleted; use on:<name> in a document or dsx.delegate.listen between packages.

Retired words: fire, hook, fireAny, collect.

Related: delegate, broadcast, dsx-module-call.

### dsx.delegate.send

The module bus's decision verb: send asks a named question, listeners answer, and the owner declares how the answers combine (claim, veto, any, collect, void).

In code: `dsx.delegate.send`, `dsx.delegate.listen`.

A delegate is a named native event with a folded answer. listen and send are the only pair of verbs on this plane. The module that owns an OS surface owns its delegate. claim survives only as a combine policy (the first non-nil answer wins), not as a verb.

| Where | How we say it |
|---|---|
| code | dsx.delegate.listen("name", fn) and dsx.delegate.send("name", args). |

Retired words: claim.

Related: broadcast, event, dsx-module-call.

### dsx.broadcast

The module bus's announcement verb: dsx.broadcast tells anyone who cares, and nobody answers; web pages read it with dsx.on.

In code: `dsx.broadcast`, `dsx.on`.

Use broadcast for facts (a download finished), delegate for decisions (may we?) and dsx.module for a call you can name.

| Where | How we say it |
|---|---|
| code | dsx.broadcast("name", payload); dsx.on("name", fn) on a page. |

Related: delegate, event, dsx-module-call.

### context

A typed value a package declares in dsx.json and publishes live, which other code reads as dsx.module.<chain>.context.<var>.

We say **context**. In code it is `context`, `dsx.module.<chain>.context.<var>`, `dsx.context.set`.

Context replaced cross-package reads by magic strings. Reads are exclusion-safe: if the package is not in the build the read says so instead of failing. Do not confuse it with the component context of ADR 0013 (a state key a component offers to its descendants through <context>).

| Where | How we say it |
|---|---|
| code | dsx.module.camera.context.authorized |

Related: module, dsx-module-call.

### dsx

The one handle, dsx, through which everything reaches everything else: DSX is a native message bus where packages provide and surfaces consume.

In code: `dsx`, `window.dsx`.

There is exactly one handle and it is never aliased. A module never reaches the kernel another way (no ModuleRegistry.shared, no NotificationCenter channel, no global singleton). On a web page the same surface is window.dsx. Do not confuse the bus with an event bus: it carries calls, decisions and announcements.

| Where | How we say it |
|---|---|
| code | dsx. |
| docs | the dsx bus, or window.dsx on a page. |

Related: dsx-module-call, delegate, broadcast, handle.

### object handle

A live in-process object a package shares through the bus (held weakly), such as the web view, reached by casting it, never by importing it.

We say **object handle**. In code it is `dsx.shared`, `dsx.module.dom.object("view")`.

Handles are how a package gives another package a native object without exposing its class. They are not the dsx handle (the bus itself).

| Where | How we say it |
|---|---|
| code | dsx.module.dom.object("view") |

Related: bus, module.

### kernel

The open runtime core: the bus and its primitives only, naming no package, scheme, component or WebKit, and implemented three times (Swift, Kotlin, TypeScript).

We say **kernel**. In code it is `OpenSource/Engine`, `@despia-native/kernel`.

Everything else is a package. kernel names three things: the concept; the folders OpenSource/Engine/Swift, Kotlin and TypeScript; and the npm package @despia-native/kernel, the TypeScript twin. Do not confuse it with an OS kernel.

| Where | How we say it |
|---|---|
| docs | the kernel; the TypeScript kernel for @despia-native/kernel. |

Also heard: engine.

Related: engine, npm-package, bus, renderer, project-library.

### engine

The folder OpenSource/Engine, the one home of the kernel, with one subfolder per language (Swift, Kotlin, TypeScript).

We say **engine**. In code it is `OpenSource/Engine`.

In conversation engine usually means the kernel. It also appears for the JSE interpreter, a package's own engine (an on-device AI package bundles its inference engine) and the Stack UI engine inside the kernel. Say which.

| Where | How we say it |
|---|---|
| docs | engine only for the folder; otherwise kernel. |

Also heard: kernel.

Related: kernel, jse.

### renderer

One of the four implementations of the DSX contract: Swift/SwiftUI, Kotlin/Compose, Compose Desktop and TypeScript/DOM.

We say **renderer**. In code it is `Swift/SwiftUI`, `Kotlin/Compose`, `Compose Desktop`, `TypeScript/DOM`.

Article 10 requires one feature on every renderer: the same behaviour and look, even though the four implementations differ. A renderer is not a platform (a platform is the OS you ship to) and not a package. The four renderers run on three kernel implementations (Swift, Kotlin, TypeScript): Compose Desktop shares the Kotlin kernel. Phrases like all three renderers in older pages mean those three kernels.

| Where | How we say it |
|---|---|
| docs | renderer; name the four when it matters. |

Also heard: runner.

Related: platform, degradation, polyfill, kernel, dsx-dom.

### surface

What the user sees: the web surface (DSX WebView) and native UI (DSX View) are equal consumers of the bus.

We say **surface**. In code it is `<DSXWebView/>`, `<DSXView/>`.

Surface has several established senses: the web surface (the web view a package named dom owns), the app's root plan entry.surfaces, a deployment surface (watch, widget, TV), the public surface of the API (the frozen contract) and snapshot surfaces (widgets, Live Activities). Say which one.

| Where | How we say it |
|---|---|
| docs | surface, always with its kind. |

Related: dsx-webview, dsx-view, bus, target.

### WebView

The bare web view primitive: a web view with no bridge to the app, by construction.

We say **WebView**. In code it is `<WebView/>`.

Use it to show a page that must not be able to call the app. The bridged one is DSX WebView.

| Where | How we say it |
|---|---|
| code | <WebView/> |

Related: dsx-webview, surface.

### Dom package

The package that owns the web surfaces of a native app and the origin-gated bridge; the only package that may touch WebKit.

We say **Dom package**. In code it is `Core/Dom`, `dsx.module.dom`.

Every other package reaches the web view only through dsx.module.dom. Not the same as DSX DOM, the web renderer library.

| Where | How we say it |
|---|---|
| code | dsx.module.dom.load(...) |
| docs | the Dom package |

Related: dsx-dom, dsx-webview, bridge.

### bridge

The page-to-native channel inside DSX WebView: one message shell between window.dsx on the page and the bus.

We say **bridge**. In code it is `BridgeKit`, `window.__dsxWire`.

It exists only inside DSX WebView. Not related to the React Native bridge.

| Where | How we say it |
|---|---|
| docs | the DSX bridge |

Related: dsx-webview, bus.

### host

The thin native shell of an app: it only translates operating-system callbacks onto the bus, and all behaviour lives in packages.

We say **host**. In code it is `Host/`, `bootloader`.

Hosts are bootloaders. Not to be confused with a server host or a deploy host.

| Where | How we say it |
|---|---|
| docs | the host app (the bootloader) |

Also heard: bootloader.

Related: module, bus.

### availability

Whether a package, action or component is usable in this build, on this operating system and on this device, with the first failing reason reported.

We say **availability**. In code it is `available`, `excluded`, `dsx.has`.

The reasons are checked in order: excluded from the build, unsupported platform, unsupported OS version, unsupported device. dsx.has asks without branching on the platform. available, excluded and availability are reserved members of every package proxy.

| Where | How we say it |
|---|---|
| code | dsx.has("camera"), dsx.module.camera.available |

Related: exclusion, degradation, platform.

### excluded

The on/off switch of a package: a package left out of a build has its files absent, and the exclusion cascades to its nested packages.

We say **excluded**. In code it is `excluded.json`, `DespiaExcluded.json`.

File presence is the gate, never a compile flag. Mandatory packages cannot be excluded. A call to an excluded package answers excluded rather than crashing.

| Where | How we say it |
|---|---|
| docs | left out of the build |

Related: availability, first-party-package, nested-module.

### named degradation

What an author gets, written down, when an operating system genuinely lacks a concept: the closest coherent thing, never a silent gap.

Article 10 allows exactly three states for a feature on a renderer: supported, polyfilled, or platform-limited with a named degradation. Words like unsupported, inert or deferred are descriptions, not states.

| Where | How we say it |
|---|---|
| docs | named degradation |

Related: polyfill, renderer, availability.

### polyfill

The same observable behaviour built out of different parts on a platform that lacks the native one; a first-class implementation, not a consolation.

Also the role of the Legacy package for old v3 pages. A shim (a package that only forwards) is banned.

| Where | How we say it |
|---|---|
| docs | polyfill |

Do not say:

- "shim" (docs): a shim that only forwards is banned; say polyfill or adapter.

Related: degradation, legacy, renderer.

## Platforms and targets

### platform

The operating system an app runs on or ships to: iOS, Android, web, desktop, watch.

We say **platform**. In code it is `dsx.platform.os`.

Authors must not branch on the platform. Ask for the capability with dsx.has, which answers for the member (package or action) rather than for a name. The platform is not a renderer, a lane or a facet.

| Where | How we say it |
|---|---|
| docs | platform |

Related: renderer, lane, facet, availability.

### lane

The toolchain folder inside a package for one native language: swift/, kotlin/ or web/; each lane spans several operating systems.

We say **lane**. In code it is `swift/`, `kotlin/`, `web/`.

ios/ and android/ remain accepted legacy aliases. This is the native lane. The word lane is also used inside Despia's own engineering for a parallel work stream; that is not a DSX concept.

| Where | How we say it |
|---|---|
| code | swift/, kotlin/, web/ folders |

Related: facet, target, platform.

### target

A declared deployment target of an app, such as a watch app or a widget, owned by the package that declares it.

We say **target**. In code it is `extensionTargets`.

Target has three senses: a deployment target (extensionTargets), an availability constraint set, and a target row in the deploy document. Say deployment target, availability target or deploy target. A target is not a facet: the facet word names the kind of residence, the target is the declared thing.

| Where | How we say it |
|---|---|
| docs | deployment target |

Related: facet, lane, extension, deploy-target, availability.

### app extension

An operating-system extension target bundled with an app, such as a widget, watch app, App Clip, keyboard or share extension.

We say **app extension**. In code it is `Core/Extensions`, `extensionTargets`.

In DSX, extension never means the installable unit (that is a package). The packages under Core/Extensions each ship one extension target. Browser extensions (Safari, Chrome) are a different thing again; say browser extension.

| Where | How we say it |
|---|---|
| docs | app extension (or widget, watch app...) |

Do not say:

- "extension" (ui, cli, conversation): extension means an OS extension target or a browser extension, never a package.

Retired words: plugin.

Related: target, package, watch, widget.

### watch app

A live node on the wrist: a real process that can host a DSX runtime, on Apple Watch or Wear OS.

We say **watch app**. In code it is `Core/Extensions/Watch`.

A live node (watch, keyboard, App Clip) runs code; a snapshot node (widget, Live Activity) is state rendered by the OS.

| Where | How we say it |
|---|---|
| docs | watch app |

Related: widget, extension, facet.

### widget

A snapshot surface rendered by the operating system from a .dsx description: a home-screen widget, a lock-screen widget or a Live Activity.

We say **widget**. In code it is `<activity>`, `Live Activity`.

The OS archives and renders the state; the app does not run inside it.

| Where | How we say it |
|---|---|
| docs | widget, or Live Activity |

Related: watch, extension, surface.

### web origin

The real origin a bundled web app loads from on each platform, because file:// cannot run absolute paths or history routing.

We say **web origin**. In code it is `web_source: bundled`.

On iOS it is an HTTPS loopback origin with a per-install certificate; on Android it is the reserved https://appassets.androidplatform.net host.

| Where | How we say it |
|---|---|
| docs | web origin |

Related: dsx-webview, content-server.

## Tooling

### CLI

The despia command line: every verb is declared in one command document, and the CLI, --help and the toolchain MCP are generated from it.

We say **CLI**. In code it is `despia`, `@despia-native/cli`, `dsx`.

dsx is an older spelling of the binary. The CLI is deterministic: authors bring their own agents.

| Where | How we say it |
|---|---|
| docs | the CLI, or the despia command |

Related: cli-document, mcp, package.

### toolchain MCP

The Model Context Protocol server of the toolchain: it exposes every despia verb as a tool to a coding agent.

We say **toolchain MCP**. In code it is `despia mcp`.

There are three different MCPs: the toolchain MCP (despia mcp, for coding agents), an application's own MCP face (a <tool> row on a server document, served at /mcp) and the runtime MCP package (OpenSource/MCP: an app being, or talking to, an MCP server). Say which. Docs sites may also offer their own docs MCP.

| Where | How we say it |
|---|---|
| docs | toolchain MCP |

Related: cli, app-mcp, cli-document.

### app MCP

The MCP face of an application's own backend: a <tool> row on a server document is served at /mcp by @despia-native/server.

We say **app MCP**. In code it is `/mcp`, `<tool>`.

Not the toolchain MCP, which serves the despia verbs to coding agents.

| Where | How we say it |
|---|---|
| docs | the app's MCP endpoint |

Related: mcp, server-document.

### application graph

The structured model of an app that authoring operates on: describe and graph read it, the structural verbs change it, and verify checks the result.

We say **application graph**. In code it is `despia describe`, `despia graph`.

Authoring is CLI and MCP through this graph; there is no editor deliverable. The CLI and docs call it the application graph (despia graph <kind>, despia describe). The derived structure underneath is the DSXGraph, never a second editable source.

| Where | How we say it |
|---|---|
| docs | application graph |
| cli | despia graph, despia describe |

Do not say:

- "ADT graph" (ui, cli, docs, conversation): the public name is application graph.
- "project graph" (ui, cli, docs, conversation): the public name is application graph.

Retired words: ADT graph, project graph.

Related: cli, mcp.

### @despia-native/project-core

The pure domain core of a Despia project (render, parse, validate, diff, three-way merge, dependency resolution) that the CLI, the api Worker, CI and the tests share; an npm workspace library, not a DSX module or package.

In code: `@despia-native/project-core`.

It has no IO, no clock, no randomness and no dependencies, so every surface reads the same rules. It is private to the monorepo today. Decided 2026-10-09: the shared library every surface imports becomes the published pure library @despia-native/project (see project-library), which takes over this role; until it lands, project-core is what the CLI, api Worker and CI import. Never call it a module or a package of an app.

| Where | How we say it |
|---|---|
| docs | project-core (an npm workspace library) |

Related: store-core, engine-library, npm-package, kernel.

### @despia-native/store-core

The pure store-release core (review state machine, rejection catalogue, store listing as code, declarations, submit checklist) that the CLI and the api Worker share.

In code: `@despia-native/store-core`.

Released alongside the CLI. An npm library, not a DSX package.

| Where | How we say it |
|---|---|
| docs | store-core (an npm library) |

Related: project-core, engine-library, project-library.

### engine library

The TypeScript npm workspace under OpenSource/Engine/TypeScript that holds the web kernel, compiler, DOM renderer, server, CLI and the shared cores.

We say **engine library**. In code it is `OpenSource/Engine/TypeScript`, `dsx-web-workspace`.

Everything in it is an npm package (@despia-native/*). None of them is a DSX package or module; @despia-native/modules only carries the browser lanes of first-party packages.

| Where | How we say it |
|---|---|
| docs | the engine library (an npm workspace) |

Related: npm-package, kernel, project-core, dsx-dom, project-library.

### @despia-native/project

The shared TypeScript core that every surface imports: a published, pure npm library (@despia-native/project) for reading, validating, diffing and changing a project; an npm workspace library, not a DSX module or package. _(proposed)_

In code: `@despia-native/project`.

Decided 2026-10-09 (hybrid): the library is @despia-native/project, and the name Core/Project is reserved for a later thin wrapper package that exposes it to apps. It replaces the role project-core has today. The skeleton is being created on the branch wip/claude/build-sot-1; until it lands, use project-core. Never call it a module.

| Where | How we say it |
|---|---|
| docs | the project library (@despia-native/project), an npm library |

Related: project-core, store-core, engine-library, npm-package, kernel.

## The product and the cloud

### DSX WebView

The component that shows the app's website with the DSX bridge attached: a bare web view plus BridgeKit, the app's web surface.

We say **DSX WebView**. In code it is `<DSXWebView/>`.

It is the surface a Web App to Mobile App app shows. It is not the bare <WebView/> primitive, which has no bridge by construction.

| Where | How we say it |
|---|---|
| docs | DSX WebView |
| code | <DSXWebView/> |

Related: webview, bridge, dom-module, surface.

### DSX View

The product name for native UI rendering of .dsx on SwiftUI and Compose; the <DSXView/> component is only the part that renders one screen natively.

We say **DSX View**. In code it is `<DSXView/>`.

DSX View (native UI rendering) is early alpha: usable to experiment, not production ready, and hidden from new-app templates until it is stable. Say DSX View for the capability and <DSXView/> only for the component. It is the native counterpart of DSX WebView.

| Where | How we say it |
|---|---|
| docs | DSX View |

Related: dsx-webview, dsx-dom, renderer.

### DSX DOM

The DSX web renderer: the library that renders .dsx documents as a web page, shipped as the npm package @despia-native/dom.

We say **DSX DOM**. In code it is `@despia-native/dom`.

It is the only package that touches the browser DOM. Do not confuse it with the Dom package (Core/Dom, chain dom), which owns the web surfaces inside a native app. Say DSX DOM for the web renderer and Dom package for the native web-surface owner.

| Where | How we say it |
|---|---|
| docs | DSX DOM |
| code | @despia-native/dom |

Do not say:

- "the DOM module" (docs): ambiguous: say DSX DOM (web renderer) or the Dom package (native web-surface owner).

Related: dom-module, renderer, npm-package, dsx-webview.

### template

A starting point for a new app expressed entirely as data: a project whose dsx.json carries a template section, inheriting everything else from packages.

We say **template**. In code it is `listing.release`.

There is no template-specific code. Web App to Mobile App (web-view) is the stable template; the starter and native templates are alpha.

| Where | How we say it |
|---|---|
| ui | template |
| cli | despia template, despia new --template |

Related: project, package, manifest.

### project

A folder of DSX sources and declarations (dsx.json, dsx.config.json, Components/) that builds into an app; the same word names its record in the Despia account.

We say **project**. In code it is `dsx.json`, `dsx.config.json`.

A project is the source; an app is what ships to a store. In the console the two are shown together.

| Where | How we say it |
|---|---|
| ui | project or app, per screen |
| cli | project root |

Related: app, manifest, project-config, workspace.

### app

The application a person ships: the primary object of Despia, identified by App.json (bundle id, name, icons) and built from a project.

We say **app**. In code it is `App.json`.

The product cycle is Build, Ship, Observe, Understand, Act, Grow, all about the app.

| Where | How we say it |
|---|---|
| ui | app |

Related: project, package, template.

### workspace

An account organisation in Despia that owns projects, store connections and scoped API tokens.

We say **workspace**. In code it is `workspace token`.

Also an npm workspace (the monorepo under OpenSource/Engine/TypeScript). In the console and the API it means the account organisation; say npm workspace for the other.

| Where | How we say it |
|---|---|
| ui | workspace |
| api | workspace |

Related: project, npm-package, api.

### service

A separate deployable DSX project (messaging, commerce, chat, sync, identity) that runs in your own infrastructure and is linked to an app through declared typed links.

We say **service**. In code it is `OpenSource/Services`.

Despia does not host services. A service is not a package, though a package may talk to one.

| Where | How we say it |
|---|---|
| docs | service |

Related: server-document, package.

### Legacy package

The optional package that keeps v3 web pages working: it translates window.despia calls and old globals into modern dsx.module calls.

We say **Legacy package**. In code it is `Core/Legacy`, `window.despia`.

An app that does not list it ships none of it. It translates; it does not shape the modern design. The modern page surface is window.dsx.

| Where | How we say it |
|---|---|
| ui | Legacy (compatibility with V3 pages) |
| code | Core/Legacy |

Also heard: compatibility package.

Related: v3, content-server, polyfill.

### ContentServer

The v3 local static HTTP server, kept as an optional Legacy package for v3 apps; nothing modern depends on it.

We say **ContentServer**. In code it is `Core/Legacy/Modules/ContentServer`.

The serving of bundled web files for modern apps moved to the kernel's content plane.

| Where | How we say it |
|---|---|
| docs | ContentServer (Legacy) |

Related: legacy, web-origin.

### console

The Despia web dashboard where you manage apps, packages, builds and store connections.

We say **console**. In code it is `console.despia.com`.

It is the UI face of the same project data as the CLI and the API. Older words for it (dashboard, editor) are not used.

| Where | How we say it |
|---|---|
| ui | the console |
| conversation | the Despia console |

Also heard: dashboard.

Related: api, cli, package.

### API

The Despia REST API (api.despia.com/v1) for projects, templates, builds, tokens and stores, the same data the console and the CLI show.

We say **API**. In code it is `api.despia.com`.

Do not confuse it with window.dsx (the page API) or the dsx.module runtime API inside an app.

| Where | How we say it |
|---|---|
| api | the Despia API |

Related: console, cli, workspace.

### OTA update

An over-the-air content update: new web or DSX content delivered to installed apps without an app-store release, served from a host you own.

We say **OTA update**. In code it is `despia ota`.

Not an app-store update. Despia never hosts the content.

| Where | How we say it |
|---|---|
| cli | despia ota build, publish, rollback |

Related: deploy-target, content-server.

### deploy target

A row of the deploy document that says what to build for which platform and track, and where it goes.

We say **deploy target**. In code it is `deploy.dsx`.

Deploy providers (Cloudflare, Vercel, Netlify, Supabase, your own storage) are chosen separately; the word provider also names a capability provider package.

| Where | How we say it |
|---|---|
| cli | despia deploy |

Related: target, provider, ota.

### V3

The previous Despia product and runtime, whose web pages call window.despia; V3 apps keep working through the Legacy package.

We say **V3**. In code it is `despia-native`, `window.despia`.

V4 is the DSX platform. Not all V3 words carry over: scheme became command, and window.despia exists only through Legacy.

| Where | How we say it |
|---|---|
| docs | V3 (the previous version) |

Related: v4, legacy.

### V4

The current Despia platform built on DSX and the dsx.module bus.

We say **V4**. In code it is `@despia-native/*`, `window.dsx`.

The first public release is 0.1.0, a pre-release that is stable for the web view; native UI rendering is early alpha until 1.0.0.

| Where | How we say it |
|---|---|
| docs | Despia V4 |

Related: v3, dsx.

## How we work

### constitution

The architecture law of the runtime, in numbered Articles; every change is judged against it.

We say **constitution**. In code it is `constitution.md`.

The constitution states the law and an ADR records the decision behind it. Article 10 (one feature, every platform) is the one most likely to change what you were about to do.

| Where | How we say it |
|---|---|
| docs | the constitution |

Related: adr, article-10, degradation.

### ADR

An Architecture Decision Record: a numbered, never-reused page recording one decision and why.

We say **ADR**. In code it is `architecture/adr/`.

There is no second place an architecture decision may live.

| Where | How we say it |
|---|---|
| docs | ADR |

Related: constitution.

### Article 10

The constitutional rule of one feature on every platform: a capability that ships on one renderer ships on all of them, supported, polyfilled or with a named degradation.

We say **Article 10**. In code it is `check_platform_parity.rb`.

It is gated by the parity checker and its register of debts, which only shrinks.

| Where | How we say it |
|---|---|
| docs | Article 10 |

Related: constitution, renderer, degradation, polyfill.

### Canvas

The retired editor of DSX; authoring is now CLI and MCP. _(deprecated)_

Do not confuse it with the <canvas> drawing primitive, which stays.

| Where | How we say it |
|---|---|
| docs | not used |

Related: application-graph, cli.

## Words that mean something else elsewhere

### npm package

A JavaScript distribution unit published to the npm registry; the DSX CLI, the compiler and the other @despia-native libraries are npm packages, not DSX packages.

We say **npm package**. In code it is `package.json`, `@despia-native/*`.

When someone says package in a JavaScript context they mean this. The @despia-native/cli and @despia-native/kernel libraries are npm packages (workspaces under OpenSource/Engine/TypeScript/packages). `despia add npm:decimal.js@10.4.3` pins an npm package for a backend, which is a DSX concept applied to an npm coordinate, not a DSX package. Always say npm package for this meaning.

| Where | How we say it |
|---|---|
| docs | npm package. |
| code | npm package; its manifest is package.json. |

Related: package, engine-library, project-core, project-library.

### Swift package

A Swift Package Manager source distribution described by a Package.swift file; unrelated to a DSX package.

We say **Swift package**. In code it is `Package.swift`, `SwiftPM`.

Swift calls its dependency unit a package, and Swift 5.9 also added a `package` access level. Some DSX packages vendor or depend on Swift packages for their native code (the open runtime folders OpenSource/MCP, Local and AI carry a Package.swift). Say Swift package for this meaning.

| Where | How we say it |
|---|---|
| docs | Swift package. |

Reserved or overloaded:

- Swift: `package`. also a contextual access modifier since Swift 5.9.

Related: package, module.

### Gradle artifact

A versioned Android or JVM library resolved by Maven coordinates in a Gradle build; unrelated to a DSX package.

We say **Gradle artifact**. In code it is `group:name:version`, `build.gradle`.

Native dependencies of a DSX package on Android are Gradle artifacts, written as Maven coordinates (group:name:version). The DSX package declares them; the Android build resolves them. Say Gradle artifact or Maven coordinate, never package, for this meaning.

| Where | How we say it |
|---|---|
| docs | Gradle artifact, or Maven coordinate. |

Related: package, android-application-id.

### Android package name

The unique identifier of an Android app (for example com.example.app), also called its package name; not a DSX package.

We say **Android package name**. In code it is `applicationId`, `package-name`.

Google calls an Android app's id its package name, and the CLI mirrors that in flags such as --package-name and --bundle-id. It identifies an app in Play. A DSX package is something you add to an app. Say Android package name or app id for this meaning.

| Where | How we say it |
|---|---|
| cli | Android package name (--package-name), or app id. |
| docs | Android package name or app id. |

Related: package.

_Generated from the DSX glossary (lingo 0.1.0, 81 terms)._
