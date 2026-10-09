---
title: Package or module?
description: Why the console says package and the code says module, and how to tell a DSX package from an npm package, a Swift package and a Gradle artifact.
route: /lingo/package-vs-module
section: lingo
order: 2
---

# Package or module?

**A package is a module, and a module is a package.** An installable piece of functionality for a DSX app: a folder with a dsx.json manifest that can bring actions, events, components, facets and native code.

Module is the one name that works on iOS, Android and the web, which is why code uses it. It is reserved on none of our targets, whereas `package` is a keyword in Kotlin and Java and is overloaded by Swift. Everything in the runtime uses module: the call root `dsx.module.<chain>.<action>()`, the `Module` base class, `ModuleRegistry`, the `modules` key in dsx.config.json, the `Modules/` folders. A module is a package: the console shows the same thing under the name package. Say module when you write code or an API name, and package when you talk to people.

## Which word, where

| Where you are | Say | How |
|---|---|---|
| The console | package | package: the console's Packages screens, install and remove buttons. |
| Talking about it | package | package, always. |
| The command line | package | package: `despia packages`, `despia add`, `despia remove`, `despia package check`. |
| These docs | package | package when talking to people about choosing and installing one; module when showing code. First mention: "package (called a module in code)". |
| Code | module | module: `dsx.module.<command>.<action>()`, the `Module` class, `ModuleRegistry`, the `modules` key of dsx.config.json, the `Modules/` folder. |
| APIs | module | module in the runtime API (`dsx.module.*`); package for the things you pin, version, install and publish. |

## Why the code says module

- **Android (Kotlin and Java)**: `package` cannot be the name. A reserved keyword; the reason code says module.
- **Swift**: `package` cannot be the name. Overloaded by Swift Package Manager and the `package` access modifier.

`module` is reserved on none of our targets, so one name works on iOS, Android and the web. That is why the call root is `dsx.module.*` everywhere, even though the console shows the same thing as a package.

## The other things called a package

The word is used by many tools. Here is what each means and what we call it, so none is mistaken for a DSX package.

| Meaning | What it is | What we call it |
|---|---|---|
| DSX package (ours) | An installable unit of functionality for a DSX app, a folder with a dsx.json manifest. | package in the console, docs and conversation; module in code |
| npm package | A JavaScript distribution unit published to the npm registry, such as @despia-native/cli. | npm package |
| Swift Package Manager package | A Swift source distribution described by a Package.swift file. | Swift package |
| Gradle or Maven artifact | A versioned library resolved by Maven coordinates (group:name:version) in Android builds. | Gradle artifact, or Maven coordinate |
| Android package name | The unique application id of an Android app, like com.example.app. | Android package name (app id) |
| Kotlin or Java package statement | The namespace line at the top of a source file. | package statement |

### npm package

A JavaScript distribution unit published to the npm registry; the DSX CLI, the compiler and the other @despia-native libraries are npm packages, not DSX packages.

When someone says package in a JavaScript context they mean this. The @despia-native/cli and @despia-native/kernel libraries are npm packages (workspaces under OpenSource/Engine/TypeScript/packages). `despia add npm:decimal.js@10.4.3` pins an npm package for a backend, which is a DSX concept applied to an npm coordinate, not a DSX package. Always say npm package for this meaning.

### Swift package

A Swift Package Manager source distribution described by a Package.swift file; unrelated to a DSX package.

Swift calls its dependency unit a package, and Swift 5.9 also added a `package` access level. Some DSX packages vendor or depend on Swift packages for their native code (the open runtime folders OpenSource/MCP, Local and AI carry a Package.swift). Say Swift package for this meaning.

### Gradle artifact

A versioned Android or JVM library resolved by Maven coordinates in a Gradle build; unrelated to a DSX package.

Native dependencies of a DSX package on Android are Gradle artifacts, written as Maven coordinates (group:name:version). The DSX package declares them; the Android build resolves them. Say Gradle artifact or Maven coordinate, never package, for this meaning.

See the full [Lingo](/lingo) for every word.

_Generated from the DSX glossary (lingo 0.1.0). The same data answers `despia define package`._
