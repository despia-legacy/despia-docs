---
title: Branch
description: Find out which Branch link brought each install.
package: branch
---

Find out which Branch link brought each install.

Works with the Product analytics package: on first launch it reads the Branch link that led to the install and passes the channel and campaign on to your analytics destination. Installs without a Branch link are not attributed. Needs a Branch account and your Branch key. Phones only.

Commercial package. License: Despia-Commercial-Source-1.0. Version 0.1.0.

## When to use it

Use it when you run campaigns with Branch links and want to know which link brought each install. Pair it with the product analytics package, which asks for the result; it does not route deep links yet.

## Install

```sh
despia add Core/Growth/Modules/Branch
```

A commercial package: it is added the same way, and the build checks your plan includes it.

## Where it runs

| Target | Available |
| --- | --- |
| ios | yes |
| android | yes |
| web | yes |
| macos | no |

Device classes: phone.

## Actions

### install

`dsx.module.branch.install`

Returns where this install came from according to Branch, or nothing if no Branch link was clicked; the product analytics package calls it for you.

Since 0.1.0.

**Parameters**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `token` | string | no | Not used; any value you pass is ignored, and apps normally leave it out. |

**Resolves with**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `adGroup` | string | no | The ad set that the install came from. |
| `campaign` | string | no | The name of the marketing campaign. |
| `creative` | string | no | The name of the ad that the install came from. |
| `link` | string | no | The Branch link the user clicked. |
| `method` | string | yes | How sure the match is; deterministic means Branch guarantees it. |
| `referrer` | string | no | The channel that referred the install, such as email or a social network. |
| `source` | string | yes | The attribution source, always branch here. |

**Example: answers a guaranteed click's touch**

```js
const result = await dsx.module.branch.install({});
// resolves {"method":"deterministic","referrer":"tiktok","source":"branch"}
```

## Configuration

| Key | Type | Default | What it does |
| --- | --- | --- | --- |
| `branch_key` | string | `` | Your Branch app's live (key_live_...) or test (key_test_...) key, from the Branch dashboard's Account Settings. Public: it ships in every Branch app. |

## Related packages

- Needs: [Growth](/packages/growth)

## Versions

| Version | Channel | Summary |
| --- | --- | --- |
| 0.1.0 | checkpoint |  |
