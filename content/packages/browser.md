---
title: Browser
description: Open web links in the system's in-app browser tab.
package: browser
---

Open web links in the system's in-app browser tab.

Opens a web address in Safari's in-app tab on iOS, a Chrome Custom Tab on Android and a new tab on the web, with the same checks everywhere. Phone, mail and other safe app links are handed to the system. Unsafe addresses such as javascript: are refused.

Open package. License: Apache-2.0. Version 0.1.0.

## When to use it

Use it for links that leave your app, such as articles, terms or a payment page. For screens inside your own app, use navigation instead.

## What native adds

The in-app tab shares the person's saved logins and autofill and gives them a familiar close button, which a plain web view does not.

## Install

```sh
despia add Mandatory/Browser
```

## Where it runs

| Target | Available |
| --- | --- |
| ios | yes |
| android | yes |
| web | yes |
| macos | no |

## Actions

### open

`dsx.module.browser.open`

Opens a link outside the app's own screens. Web addresses open in an in-app browser tab, and safe links such as phone or mail are passed to the system.

**When to use it.** Use it for any link that should leave your app, from a button or a link tap.

Since 0.1.0.

**Parameters**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `target` | string | no | On the web only: blank opens a new tab (the default) and self replaces the current page. |
| `url` | string | yes | The address to open. It can be a web address, a bare host such as example.com, or a safe app link like tel: or mailto:. |

**Resolves with**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `opened` | boolean | yes | True when the link was opened. |

**Errors**

| Code | Meaning | What to do |
| --- | --- | --- |
| `blocked` | The browser blocked the new tab. Open it from a tap handler. |  |
| `invalid_target` | Use blank or self for the browser target. | Not recoverable by retrying. |
| `invalid_url` | Use an HTTP(S) URL, a host, or a safe external app link. | Not recoverable by retrying. |
| `missing_url` | A non-empty "url" is required. | Not recoverable by retrying. |

**Example: opens a url in an in-app browser tab**

```js
const result = await dsx.module.browser.open({"url":"https://example.com"});
// resolves {"opened":true}
```

**Example: opens a validated web URL in the current tab without a popup**

```js
const result = await dsx.module.browser.open({"target":"self","url":"https://example.com"});
// resolves {"opened":true}
```

## Versions

| Version | Channel | Summary |
| --- | --- | --- |
| 0.1.0 | checkpoint |  |
