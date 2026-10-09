---
title: Toast
description: Show short messages and undo bars that disappear on their own.
package: toast
---

Show short messages and undo bars that disappear on their own.

Shows a small card with a message, an optional action button and an icon, which slides in, waits and goes away by itself. The call finishes when the card ends and tells you how: dismissed, the action was tapped, it timed out or it was replaced, so an Undo button needs one line. Cards queue one at a time on phones and lift above the tab bar, a floating button and the keyboard. You write the message text.

Open package. License: Apache-2.0. Version 0.1.0.

## When to use it

Use it for quick feedback such as saved, copied or an Undo after a delete. For a message the person must answer, use a dialog or alert instead.

## What native adds

The card is drawn natively above your content, lifts clear of the keyboard and home indicator, and lets touches elsewhere pass through.

## Install

```sh
despia add Core/Toast
```

## Where it runs

| Target | Available |
| --- | --- |
| ios | yes |
| android | yes |
| web | yes |
| macos | yes |

Device classes: phone, desktop.

## Actions

### hide

`dsx.module.toast.hide`

Closes the card that is showing, or removes a waiting card from the queue by its id.

Since 0.1.0.

**Parameters**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `id` | string | no | The id of a card to remove; leave out to close the one that is showing. |

**Resolves with**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `hidden` | boolean | no | True when a card was closed or removed, false when nothing matched. |
| `shown` | boolean | yes | True when a card was showing before the call. |

**Example: dismisses the current toast**

```js
const result = await dsx.module.toast.hide({});
// resolves {"hidden":true,"shown":false}
```

**Example: hide with nothing on screen is a no-op**

```js
const result = await dsx.module.toast.hide({});
// resolves {"hidden":false,"shown":false}
```

### queue

`dsx.module.toast.queue`

Tells you how many cards are waiting behind the one that is showing.

Since 0.1.0.

**Parameters**

_None._

**Resolves with**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `pending` | number | yes | The number of cards still waiting to be shown. |

**Example: nothing pending when the queue is empty**

```js
const result = await dsx.module.toast.queue({});
// resolves {"pending":0}
```

**Example: reports the cards waiting behind the visible one**

```js
const result = await dsx.module.toast.queue({});
// resolves {"pending":2}
```

### show

`dsx.module.toast.show`

Shows a message card and finishes when it ends, telling you whether it was dismissed, its action was tapped, it timed out or it was replaced.

**When to use it.** Use it for feedback and for undo: a result of action means the person tapped your button.

Since 0.1.0.

**Parameters**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `action` | object | no | A button on the card, for example Undo. |
| `action.id` | string | no | An id for the button, handy when you offer several actions. |
| `action.label` | string | yes | The text on the button. |
| `dismissible` | boolean | no | Set false to stop the person swiping the card away. |
| `duration` | number | no | How many seconds the card stays before it times out. |
| `icon` | string | no | The name of an icon shown on the card. |
| `length` | string | no | short (about 4 seconds) or long (about 10 seconds); duration takes precedence. |
| `message` | string | no | The text of the card. A card needs a title, a message or both. |
| `position` | string | no | Where the card appears, bottom or top. |
| `replace` | boolean | no | Set true to swap the card now on screen for this one instead of waiting in line. |
| `style` | string | no | An older name for tone, still accepted. |
| `text` | string | no | An older name for message, still accepted. |
| `title` | string | no | The bold first line of the card. |
| `tone` | string | no | The look of the card: default, success, error, warning or info. |

**Resolves with**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `deferred` | boolean | no | True when the app was in the background, so the card will appear when the app returns and no result is given. |
| `id` | string | no | The id of the card, which you can pass to hide. |
| `result` | string | no | How the card ended: dismissed, action, timeout or replaced. |
| `shown` | boolean | yes | False when the card could not be shown, for example because the message was empty. |

**Example: shows a snackbar and settles when its time is up**

```js
const result = await dsx.module.toast.show({"message":"Saved"});
// resolves {"result":"timeout","shown":true}
```

**Example: the shipped `text` spelling still routes**

```js
const result = await dsx.module.toast.show({"style":"success","text":"Saved"});
// resolves {"result":"timeout","shown":true}
```

## Versions

| Version | Channel | Summary |
| --- | --- | --- |
| 0.1.0 | checkpoint |  |
