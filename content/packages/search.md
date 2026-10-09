---
title: Spotlight
description: Make your app's content findable from the phone's own search, and open the right screen when it is tapped.
package: search
---

Make your app's content findable from the phone's own search, and open the right screen when it is tapped.

Adds your items, such as recipes or notes, to Spotlight on Apple devices and to system search on Android, so people can find them from outside your app. Tapping a result opens the screen you named for it. You choose which items to add, and you remove them when the person signs out.

Open package. License: Apache-2.0. Version 0.1.0.

## When to use it

Reach for it when your app has content people search for, such as recipes, contacts, documents or products. Do not add private content unless the person expects it to appear in system search, and clear it on sign-out.

## What native adds

Results appear in the system search field outside your app, which a web page cannot do.

## Install

```sh
despia add Core/Spotlight
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

### clear

`dsx.module.search.clear`

Removes a whole group of items from the phone's search, or everything your app added when no group is named.

**When to use it.** Call it on sign-out so one person's content does not appear in another person's search.

Since 0.1.0.

**Parameters**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `domain` | string | no | The group to clear. Leave it out to clear everything. |

**Resolves with**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `cleared` | boolean | yes | True when the items were removed. |
| `domain` | string | yes | The group that was cleared. |

**Errors**

| Code | Meaning | What to do |
| --- | --- | --- |
| `index_failed` | The system index refused that change. |  |
| `invalid_domain` | That is not a usable index domain. | Not recoverable by retrying. |

**Example: clears one feature's index**

```js
const result = await dsx.module.search.clear({"domain":"recipes"});
// resolves {"cleared":true,"domain":"recipes"}
```

**Example: no domain clears everything this app indexed, which is the sign-out path**

```js
const result = await dsx.module.search.clear({});
// resolves {"cleared":true,"domain":""}
```

### decode

`dsx.module.search.decode`

Turns the identifier the phone hands back when a result is tapped into its group, id and route.

**When to use it.** You rarely need it, because the tap is handled for you. Use it if your app receives the identifier through its own path.

Since 0.1.0.

**Parameters**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `id` | string | yes | The identifier from the tapped search result. |

**Resolves with**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `domain` | string | yes | The group the item belongs to. |
| `id` | string | yes | The id you gave the item when adding it. |

**Errors**

| Code | Meaning | What to do |
| --- | --- | --- |
| `invalid_id` | That is not a usable item id. | Not recoverable by retrying. |

**Example: the plain case**

```js
const result = await dsx.module.search.decode({"id":"recipes:42"});
// resolves {"domain":"recipes","id":"42"}
```

**Example: an id containing colons round-trips exactly, because the split is at the FIRST one**

```js
const result = await dsx.module.search.decode({"id":"links:https://example.com/a:b"});
// resolves {"domain":"links","id":"https://example.com/a:b"}
```

### index

`dsx.module.search.index`

Adds items to the phone's search, or replaces them if the same id was added before. It is safe to call on every launch.

**When to use it.** Call it when content is created or at launch. Every item needs a route, or tapping it would only open the home screen.

Since 0.1.0.

**Parameters**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `items` | array of object | yes | The items to add. Each needs an id, a title and a route, and can also have a domain, description, keywords, image and an expiry time in epoch milliseconds. |

**Resolves with**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `batches` | int | yes | How many groups the items were split into, for a progress bar. |
| `indexed` | int | yes | How many items were added. |

**Errors**

| Code | Meaning | What to do |
| --- | --- | --- |
| `index_failed` | The system index refused those items. |  |
| `invalid_domain` | That is not a usable index domain. | Not recoverable by retrying. |
| `invalid_id` | That is not a usable item id. | Not recoverable by retrying. |
| `invalid_route` | Every indexed item needs the absolute route its tap opens. | Not recoverable by retrying. |
| `invalid_title` | Every indexed item needs a title the OS can show. | Not recoverable by retrying. |

**Example: indexes a small batch in one transaction**

```js
const result = await dsx.module.search.index({"items":[{"domain":"recipes","id":"42","route":"/recipes/42","title":"Pasta carbonara"}]});
// resolves {"batches":1,"indexed":1}
```

**Example: a large batch is chunked, which is what a progress bar reads**

```js
const result = await dsx.module.search.index({"items":[{"id":"1","route":"/1","title":"One"}]});
// resolves {"batches":3,"indexed":250}
```

### remove

`dsx.module.search.remove`

Removes specific items from the phone's search by id. Removing an id that was never added is not an error.

Since 0.1.0.

**Parameters**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `domain` | string | no | The group the ids belong to. Defaults to the group used when adding. |
| `ids` | array of string | yes | The ids of the items to remove. |

**Resolves with**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `removed` | int | yes | How many items were removed. |

**Errors**

| Code | Meaning | What to do |
| --- | --- | --- |
| `index_failed` | The system index refused that change. |  |
| `invalid_domain` | That is not a usable index domain. | Not recoverable by retrying. |

**Example: removes two items**

```js
const result = await dsx.module.search.remove({"domain":"recipes","ids":["1","2"]});
// resolves {"removed":2}
```

**Example: removing an id that was never indexed is a no-op, so a delete path needs no bookkeeping**

```js
const result = await dsx.module.search.remove({"ids":["nope"]});
// resolves {"removed":1}
```

## Versions

| Version | Channel | Summary |
| --- | --- | --- |
| 0.1.0 | checkpoint |  |
