---
title: Rive animations
description: Add interactive Rive animations that react to your app's data and send events back.
package: rive
---

Add interactive Rive animations that react to your app's data and send events back.

Adds a rive element that plays a .riv file from a link or the app bundle. Its state machine inputs can follow your app's variables, so an animated cart or onboarding figure changes as the data does, and animation events can trigger actions in your app. Use it when you need animation that responds, rather than one that only plays. Needs a .riv file made in Rive.

Open package. License: Apache-2.0. Version 0.1.0.

## When to use it

Use it when you want an animated figure that reacts to your data, such as an onboarding character, an animated cart or a game-like control, and your designer works in Rive. For a plain looping graphic an image or video is simpler.

## What native adds

Rive's own native runtime draws the animation at full frame rate and runs its state machine, with a matching web runtime, so the same file behaves the same everywhere.

## Install

```sh
despia add Core/Rive
```

## Where it runs

| Target | Available |
| --- | --- |
| ios | yes |
| android | yes |
| web | yes |
| macos | no |

Device classes: phone, tablet.

## Actions

### inputs

`dsx.module.rive.inputs`

Sets several state machine inputs at once, by name.

**When to use it.** Use it when your own code decides the values. For values that simply follow your app's variables, bind them with the inputs attribute instead.

Since 0.1.0.

**Parameters**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `ref` | string | no | The name of the rive animation to control; it can be left out when only one is on screen. |
| `values` | object | yes | The inputs to set, by name, each a number, a true or false value, or text; a trigger fires when its value becomes true. |

**Resolves with**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `applied` | int | yes | How many inputs the animation accepted. |
| `ref` | string | yes | The name of the animation that was controlled. |
| `refused` | int | yes | How many names the animation did not declare and so refused. |

**Errors**

| Code | Meaning | What to do |
| --- | --- | --- |
| `ambiguous` | several <rive> surfaces are mounted; pass ref to say which |  |
| `not_found` | no <rive> with that ref is mounted |  |

**Example: applies two declared inputs**

```js
const result = await dsx.module.rive.inputs({"ref":"cart","values":{"isEmpty":false,"itemCount":3}});
// resolves {"applied":2,"ref":"cart","refused":0}
```

**Example: an undeclared name is refused and the rest still apply**

```js
const result = await dsx.module.rive.inputs({"ref":"cart","values":{"itemCount":3,"nope":true}});
// resolves {"applied":1,"ref":"cart","refused":1}
```

### pause

`dsx.module.rive.pause`

Stops the animation from advancing while keeping its current state.

**When to use it.** Use it for an explicit pause control. Animations that scroll off screen already pause by themselves.

Since 0.1.0.

**Parameters**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `ref` | string | no | The name of the rive animation to control; it can be left out when only one is on screen. |

**Resolves with**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `playing` | boolean | yes | True while the animation is advancing. |
| `ref` | string | yes | The name of the animation that was controlled. |

**Errors**

| Code | Meaning | What to do |
| --- | --- | --- |
| `ambiguous` | several <rive> surfaces are mounted; pass ref to say which |  |
| `not_found` | no <rive> with that ref is mounted |  |

**Example: pauses a named surface**

```js
const result = await dsx.module.rive.pause({"ref":"cart"});
// resolves {"playing":false,"ref":"cart"}
```

### play

`dsx.module.rive.play`

Starts or resumes the animation's state machine.

**When to use it.** Use it for a play button, or to resume after a pause. Playing something that already plays does no harm.

Since 0.1.0.

**Parameters**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `ref` | string | no | The name of the rive animation to control; it can be left out when only one is on screen. |

**Resolves with**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `playing` | boolean | yes | True while the animation is advancing. |
| `ref` | string | yes | The name of the animation that was controlled. |

**Errors**

| Code | Meaning | What to do |
| --- | --- | --- |
| `ambiguous` | several <rive> surfaces are mounted; pass ref to say which |  |
| `not_found` | no <rive> with that ref is mounted |  |

**Example: plays the only mounted surface without a ref**

```js
const result = await dsx.module.rive.play({});
// resolves {"playing":true,"ref":"cart"}
```

**Example: plays a named surface**

```js
const result = await dsx.module.rive.play({"ref":"cart"});
// resolves {"playing":true,"ref":"cart"}
```

### reset

`dsx.module.rive.reset`

Puts the animation back in its starting state with every input at its default value.

**When to use it.** Use it to replay from the beginning, for example when a screen reopens.

Since 0.1.0.

**Parameters**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `ref` | string | no | The name of the rive animation to control; it can be left out when only one is on screen. |

**Resolves with**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `ref` | string | yes | The name of the animation that was reset. |
| `state` | string | yes | The state the animation is in after the reset. |

**Errors**

| Code | Meaning | What to do |
| --- | --- | --- |
| `ambiguous` | several <rive> surfaces are mounted; pass ref to say which |  |
| `not_found` | no <rive> with that ref is mounted |  |

**Example: resets to the machine's entry state**

```js
const result = await dsx.module.rive.reset({"ref":"cart"});
// resolves {"ref":"cart","state":"Idle"}
```

### status

`dsx.module.rive.status`

Reports what the animation is playing right now.

**When to use it.** Use it to read the current artboard, state machine and state, for example in a test or a debug panel.

Since 0.1.0.

**Parameters**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `ref` | string | no | The name of the rive animation to control; it can be left out when only one is on screen. |

**Resolves with**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `artboard` | string | yes | The name of the artboard that is currently drawn. |
| `playing` | boolean | yes | True while the animation is advancing. |
| `ref` | string | yes | The name of the animation that was read. |
| `state` | string | no | The state the machine is in, if known. |
| `stateMachine` | string | no | The state machine that is running, if any. |

**Errors**

| Code | Meaning | What to do |
| --- | --- | --- |
| `ambiguous` | several <rive> surfaces are mounted; pass ref to say which |  |
| `not_found` | no <rive> with that ref is mounted |  |

**Example: reports the artboard, the machine and the live state**

```js
const result = await dsx.module.rive.status({"ref":"cart"});
// resolves {"artboard":"Cart","playing":true,"ref":"cart","state":"Filling","stateMachine":"Cart"}
```

**Example: a linear animation reports no machine and no state**

```js
const result = await dsx.module.rive.status({"ref":"badge"});
// resolves {"artboard":"Badge","playing":false,"ref":"badge"}
```

### trigger

`dsx.module.rive.trigger`

Fires one trigger input of the state machine by name.

**When to use it.** Use it when the same trigger must fire again with no change in value, such as a retry button pressed twice.

Since 0.1.0.

**Parameters**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `name` | string | yes | The name of the trigger input to fire. |
| `ref` | string | no | The name of the rive animation to control; it can be left out when only one is on screen. |

**Resolves with**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `fired` | boolean | yes | True when the trigger was fired. |
| `ref` | string | yes | The name of the animation that was controlled. |

**Errors**

| Code | Meaning | What to do |
| --- | --- | --- |
| `ambiguous` | several <rive> surfaces are mounted; pass ref to say which |  |
| `not_found` | no <rive> with that ref is mounted |  |
| `unknown_input` | the state machine declares no trigger with that name | Not recoverable by retrying. |

**Example: fires a declared trigger**

```js
const result = await dsx.module.rive.trigger({"name":"celebrate","ref":"cart"});
// resolves {"fired":true,"ref":"cart"}
```

**Example: firing the same trigger twice fires twice, a call is not a transition**

```js
const result = await dsx.module.rive.trigger({"name":"celebrate","ref":"cart"});
// resolves {"fired":true,"ref":"cart"}
```

## Errors

| Code | Meaning | What to do |
| --- | --- | --- |
| `decode_failed` | this .riv file could not be decoded |  |
| `load_failed` | the .riv file could not be loaded |  |

## Versions

| Version | Channel | Summary |
| --- | --- | --- |
| 0.1.0 | checkpoint |  |
