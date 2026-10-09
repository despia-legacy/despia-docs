---
title: Firestore
description: Store your server data in Google Cloud Firestore and get matching access rules.
package: firestore
---

Store your server data in Google Cloud Firestore and get matching access rules.

Cloud Firestore reads, writes and live queries.

Commercial package. License: Despia-Commercial-Source-1.0. Version 0.1.0.

## When to use it

Use it when your server runs on Firebase and your data should live in Cloud Firestore. It turns your data schema into Firestore security rules and indexes. Skip it if you want Postgres, or if your server drains a work queue, which this provider does not support yet.

## Install

```sh
despia add Core/Server/Providers/Firestore
```

A commercial package: it is added the same way, and the build checks your plan includes it.

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
