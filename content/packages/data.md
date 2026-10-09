---
title: Data
description: Declare the data tables your packages need, once, for any database you choose.
package: data
---

Declare the data tables your packages need, once, for any database you choose.

Lets a package declare its own entities with named fields, indexes and an ownership rule, and compiles them for whichever database the build uses. Field types come from a small fixed list so the same declaration works everywhere. This package defines the schema word only; nothing in an app calls it at runtime, and you write the entities in the packages that need them.

Open package. License: Apache-2.0. Version 0.1.0.

## When to use it

Use it when you author a server package that stores its own records and want them created in the configured database without writing SQL or security rules. App builders who only use finished packages never need to touch it.

## Install

```sh
despia add Core/Server/Modules/Data
```

## Where it runs

| Target | Available |
| --- | --- |
| ios | no |
| android | no |
| web | no |
| macos | no |

## Actions

_This package declares no actions._

## Versions

| Version | Channel | Summary |
| --- | --- | --- |
| 0.1.0 | checkpoint |  |
