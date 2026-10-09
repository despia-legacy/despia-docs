---
title: Content policy
description: Set your own rules for what users may send, and flag, hold or block anything that breaks them.
package: policy
---

Set your own rules for what users may send, and flag, hold or block anything that breaks them.

You load rules written as data, such as words to flag or limits to enforce, and each decision is recorded. With the Chat package, every message sent or received is checked, and blocked messages are refused or hidden. It ships with no rules of its own, so you write them.

Commercial package. License: Despia-Commercial-Source-1.0. Version 0.1.0.

## When to use it

Add it when you need rules about what people may send, such as flagging payment requests or blocking abuse. It comes with no rules, so you write the packs; with the Chat package every message is checked. For one-off moderation of your own content you could just write the check in your app.

## Install

```sh
despia add Core/Policy
```

A commercial package: it is added the same way, and the build checks your plan includes it.

## Where it runs

| Target | Available |
| --- | --- |
| ios | yes |
| android | yes |
| web | yes |
| macos | yes |

Device classes: phone, desktop.

## Actions

### evaluate

`dsx.module.policy.evaluate`

Checks something against all loaded rules for one hook and returns the strictest decision.

**When to use it.** Call it before showing or sending content to decide whether to allow, flag, hold or block it.

Since 0.1.0.

**Parameters**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `admitted` | string | no | The security mode of the conversation, which decides which hooks may run. |
| `hook` | string | yes | The point in the flow being checked, such as inspect-local. |
| `subject` | object | yes | The thing to check, for example an object with the message text. |

**Resolves with**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `decision` | string | yes | What to do: allow, flag, hold or block. |
| `reason` | string | yes | The reason you wrote on that rule. |
| `rule` | string | yes | The id of the rule that decided, empty when none matched. |

**Errors**

| Code | Meaning | What to do |
| --- | --- | --- |
| `hook_refused` | This conversation's security mode does not allow that hook, so nothing was checked. | Use a hook the conversation allows, or treat the content as unchecked. |
| `invalid_pack` | A loaded pack has a rule the policy language does not allow. | Reload a corrected pack. |

**Example: Check a message against the loaded rules**

```js
const result = await dsx.module.policy.evaluate({"hook":"inspect-local","subject":{"text":"venmo me"}});
// resolves {"decision":"flag","reason":"Payment outside the platform","rule":"offsite"}
```

### load

`dsx.module.policy.load`

Loads a pack of rules, replacing any pack with the same id.

**When to use it.** Call it at launch or when your rules change.

Since 0.1.0.

**Parameters**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `pack` | object | yes | A rule pack with an id and a list of rules. |
| `pack.id` | string | yes | A name for the pack; loading the same id again replaces it. |
| `pack.rules` | array of object | yes | The rules; each has an id, a hook, a condition, an action and a reason. |

**Resolves with**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `packs` | array of object | yes | The packs now loaded, each with its id and how many rules it has. |

**Errors**

| Code | Meaning | What to do |
| --- | --- | --- |
| `invalid_pack` | A rule uses an unknown action or a condition outside what the policy language allows, so the whole pack was refused. | Fix the rule named in the error data and load the pack again. |

**Example: Load a pack with one rule**

```js
const result = await dsx.module.policy.load({"pack":{"id":"marketplace","rules":[{"action":"flag","hook":"inspect-local","id":"offsite","reason":"Payment outside the platform","when":{"containsAny":["pay me outside","venmo"],"field":"text"}}]}});
// resolves {"packs":[{"id":"marketplace","rules":1}]}
```

## Errors

| Code | Meaning | What to do |
| --- | --- | --- |
| `hook_refused` | This conversation's security mode does not admit that hook, so nothing was evaluated. |  |
| `invalid_pack` | That policy pack has a rule with an unknown action or a condition outside the vocabulary. |  |

## Related packages

- Used by: [ContentSafety](/packages/contentsafety)

## Versions

| Version | Channel | Summary |
| --- | --- | --- |
| 0.1.0 | checkpoint |  |
