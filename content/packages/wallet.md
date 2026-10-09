---
title: Wallet
description: Let people add a boarding pass, ticket or card to Apple Wallet.
package: wallet
---

Let people add a boarding pass, ticket or card to Apple Wallet.

Downloads a pass file from a web address and shows the system sheet to add it to Apple Wallet on iOS. On Android and the web it hands the pass to the system or browser handler. You host the pass file yourself. Only iOS tells you when the sheet closes.

Open package. License: Apache-2.0. Version 0.1.0.

## When to use it

Use it to offer an Add to Wallet button for a ticket, coupon, loyalty card or boarding pass you already generate as a pass file. It does not create passes.

## What native adds

On iOS the pass is added with Apple's own add-pass sheet, so it lands in the person's real Wallet.

## Install

```sh
despia add Core/Wallet
```

## Where it runs

| Target | Available |
| --- | --- |
| ios | yes |
| android | yes |
| web | yes |
| macos | no |

## Actions

### pkpass

`dsx.module.wallet.pkpass`

Gets a .pkpass file from a web address and hands it to the system so the person can add it to Wallet. On iOS the Apple add-pass sheet is shown.

**When not to.** Do not treat a finished call as the pass being added. Only your pass server's own registration callback tells you that.

Since 0.1.0.

**Parameters**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `url` | string | yes | The http or https address of the .pkpass file to add. |

**Resolves with**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `action` | string | yes | Always pkpass, naming what was done. |
| `status` | string | yes | Always presented, meaning the system handler is on screen. |

**Errors**

| Code | Meaning | What to do |
| --- | --- | --- |
| `cannot_add_passes` | This device cannot add passes to Apple Wallet. | Not recoverable by retrying. |
| `download_failed` | The pass couldn't be downloaded. |  |
| `invalid_pass` | The downloaded file is not a readable .pkpass. | Not recoverable by retrying. |
| `invalid_url` | The pass URL isn't valid. | Not recoverable by retrying. |
| `missing_or_invalid_url` | pkpass needs an http(s) url pointing at a .pkpass file. | Not recoverable by retrying. |
| `no_presenter` | Couldn't find a screen to present the pass from. |  |

**Example: presents the pass then resolves on dismiss**

```js
const result = await dsx.module.wallet.pkpass({"url":"https://example.com/boarding.pkpass"});
// resolves {"action":"pkpass","status":"dismissed"}
```

## Events

Read with `dsx.on(name, handler)`.

### presented

Fires when the system pass handler is on screen, with the same details as the call result.

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `action` | string | yes | Always pkpass, naming what was done. |
| `status` | string | yes | Always presented, meaning the handler is on screen. |

## Versions

| Version | Channel | Summary |
| --- | --- | --- |
| 0.1.0 | checkpoint |  |
