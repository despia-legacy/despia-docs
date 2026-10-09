---
title: RemoteHosts
description: Move your app to a new domain without shipping a new app version.
package: remotehosts
---

Move your app to a new domain without shipping a new app version.

Lets the app refresh its list of web hosts from a file you control, so you can change domains without an App Store rebuild. It is off until your app settings give a refresh address, and if the fetch fails the bundled hosts stay in use. You host the file and edit it when you migrate.

Commercial package. License: Despia-Commercial-Source-1.0. Version 0.1.0.

## When to use it

Use it when you may need to change the domain your app loads from, for example during a rebrand or a client move. If your domain will never change you can leave it out.

## What native adds

The app picks up the new hosts on its next launch, which a store-reviewed native build otherwise needs a full release to do.

## Install

```sh
despia add Core/RemoteHosts
```

A commercial package: it is added the same way, and the build checks your plan includes it.

## Where it runs

| Target | Available |
| --- | --- |
| ios | yes |
| android | yes |
| web | no |
| macos | yes |

Device classes: phone, desktop.

## Actions

### status

`dsx.module.remotehosts.status`

Reports whether remote host refreshing is set up, whether a saved copy exists and which host is in use.

**When to use it.** Use it in a debug or settings screen to check that a domain move reached this device.

Since 0.1.0.

**Parameters**

_None._

**Resolves with**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `configured` | boolean | yes | True when the app settings carry a refresh address. |
| `has_cache` | boolean | yes | True when a refreshed host list has been saved on this device. |
| `host` | string | yes | The main host the app is using now. |

**Errors**

| Code | Meaning | What to do |
| --- | --- | --- |
| `unsupported_platform` | A web build has no dynamic host manifest: its host is the origin it was served from. | Not recoverable by retrying. |

**Example: reports the remote-host status**

```js
const result = await dsx.module.remotehosts.status({});
// resolves {"configured":false,"has_cache":false,"host":""}
```

## Versions

| Version | Channel | Summary |
| --- | --- | --- |
| 0.1.0 | checkpoint |  |
