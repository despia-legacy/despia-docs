---
title: Postgres
description: Store your server data in a Postgres database with row-level security.
package: postgres
---

Store your server data in a Postgres database with row-level security.

Connects your server to a Postgres database, such as the one behind Supabase, and builds the tables, indexes and per-user access rules from the data you declare. There is nothing to call from the app. You provide the database address in the server settings.

Open package. License: Apache-2.0. Version 0.1.0.

## When to use it

Choose it when your server needs a real relational database with per-user row access rules. It runs only on your server, and the app never talks to it directly.

## Install

```sh
despia add Core/Server/Providers/Postgres
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
