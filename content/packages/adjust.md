---
title: Adjust
description: Find out which ad or campaign brought each install, using Adjust.
package: adjust
---

Find out which ad or campaign brought each install, using Adjust.

Works with the Product analytics package: on first launch it asks Adjust where the install came from and passes the campaign details on to your analytics destination. Needs an Adjust account and your app token. You also pick sandbox or production. Phones only.

Commercial package. License: Despia-Commercial-Source-1.0. Version 0.1.0.

## When to use it

Use it when you buy installs through Adjust and want each install tied to its campaign in your analytics. Skip it if you do not use Adjust, or if probabilistic matching is on for your Adjust app and you cannot declare deterministic-only matching, because no install is attributed then.

## Install

```sh
despia add Core/Growth/Modules/Adjust
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

`dsx.module.adjust.install`

Asks Adjust where this install came from and returns the campaign details. Growth calls it once on first launch; it returns nothing for organic installs, rejected installs, or when you have not declared deterministic-only matching.

**Parameters**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `token` | string | no | Not used by this action. It is accepted so every attribution source shares one call shape. |

**Resolves with**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `adGroup` | string | no | The ad group inside the campaign that brought the install. |
| `campaign` | string | no | The name of the campaign that brought the install. |
| `creative` | string | no | The ad creative that the person tapped before installing. |
| `method` | string | yes | How the install was matched. It is always deterministic, which means the install was matched to a specific device. |
| `referrer` | string | no | The ad network that brought the install, as Adjust reports it. |
| `source` | string | yes | The attribution source that answered. It is always adjust. |

**Example: answers a declared deterministic install's touch**

```js
const result = await dsx.module.adjust.install({});
// resolves {"method":"deterministic","referrer":"tiktok","source":"adjust"}
```

## Configuration

| Key | Type | Default | What it does |
| --- | --- | --- | --- |
| `app_token` | string | `` | Your Adjust app token (12 characters, from the Adjust dashboard's app settings). Public: it ships in every Adjust app. |
| `environment` | string | `sandbox` | sandbox while testing, production for store builds. |
| `matching` | string | `unknown` | deterministic_only when probabilistic modeling is off for this Adjust app; unknown otherwise. Adjust never tells the app which method matched, so only deterministic_only lets the row claim a touch. |

## Related packages

- Needs: [Growth](/packages/growth)

## Versions

| Version | Channel | Summary |
| --- | --- | --- |
| 0.1.0 | checkpoint |  |
