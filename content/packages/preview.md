---
title: Preview
description: Turn a pasted web link into a preview card with title, description and picture.
package: preview
---

Turn a pasted web link into a preview card with title, description and picture.

Fetches a web page and gives you its title, description, main image, site name, icon and canonical address, decided by one consistent set of rules on every platform. It reads the page once, runs no scripts from it and caches nothing. You draw the card and decide whether to keep the result.

Open package. License: Apache-2.0. Version 0.1.0.

## When to use it

Use it when someone pastes a link into a chat, note or bookmark list and you want a preview card. For a full web page view, open the link instead.

## What native adds

On iOS it uses the system's own link metadata provider, and everywhere the page is read natively, so there are no browser cross-origin limits to work around.

## Install

```sh
despia add Core/Preview
```

## Where it runs

| Target | Available |
| --- | --- |
| ios | yes |
| android | yes |
| web | yes |
| macos | yes |

Device classes: phone, tablet, desktop.

## Actions

### link

`dsx.module.preview.link`

Reads a web page and returns the title, description, image and other details for a preview card.

**When to use it.** Use it right after a link is pasted. It does not cache, so save the result yourself if you will show it again.

Since 0.1.0.

**Parameters**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `timeout` | int | no | The most milliseconds to wait, from 1000 to 30000; it defaults to 8000. |
| `url` | string | yes | The http or https address of the page to preview. |

**Resolves with**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `canonical` | string | yes | The page's preferred address, which may differ from the one you passed. |
| `description` | string | yes | The short description of the page. |
| `favicon` | string | yes | The address of the website's small icon. |
| `image` | string | yes | The address of the main picture of the page. |
| `siteName` | string | yes | The display name of the website the page belongs to. |
| `title` | string | yes | The page title, as the page announces it. |
| `type` | string | yes | What kind of page it is, such as article or website. |

**Errors**

| Code | Meaning | What to do |
| --- | --- | --- |
| `credentials_in_url` | A URL carrying a username or password is never fetched. | Not recoverable by retrying. |
| `invalid_url` | That is not a URL a preview can be fetched from. | Not recoverable by retrying. |
| `not_html` | That URL is not a web page, so it has no preview to read. | Not recoverable by retrying. |
| `too_many_redirects` | That link redirected too many times. | Not recoverable by retrying. |
| `unreachable` | That page could not be reached. |  |
| `unsupported_platform` | This browser could not read that page: the site did not allow a cross-origin read. Fetch the preview from your own backend and pass the result in. | Not recoverable by retrying. |
| `unsupported_scheme` | Link previews are only fetched over http and https. | Not recoverable by retrying. |

**Example: reads a fully tagged page, Open Graph wins every field it declares**

```js
const result = await dsx.module.preview.link({"url":"https://example.com/blog/post.html"});
// resolves {"canonical":"https://example.com/blog/post","description":"The OG description","favicon":"https://example.com/favicon-32.png","image":"https://example.com/hero.png","siteName":"Example Press","title":"Open Graph title","type":"article"}
```

**Example: an untagged page still resolves, every field falls back, nothing is null**

```js
const result = await dsx.module.preview.link({"url":"https://www.example.com/a/b"});
// resolves {"canonical":"https://www.example.com/a/b","description":"","favicon":"https://www.example.com/favicon.ico","image":"","siteName":"example.com","title":"","type":"website"}
```

## Versions

| Version | Channel | Summary |
| --- | --- | --- |
| 0.1.0 | checkpoint |  |
