---
title: Haptics
description: Add vibration feedback to taps and results, with six built-in styles and custom patterns.
package: Core/Basics/Haptics
section: packages
group: Device and system
icon: iphone
order: 10
---

# Haptics

Short vibrations on the phone's own hardware (the Taptic Engine on iPhone): light, medium and heavy taps for touches,
success, warning and error patterns for outcomes, and custom patterns. No setup and no permission prompt.

```js
await dsx.module.haptic.success()
```

## When to use it

Use a haptic for a small physical confirmation the person can connect to what they just did: a toggle, a saved item, a
failed payment. The three taps say "you touched something", the other three say how it turned out.

| Call | Feels like | Use it when |
| :-- | :-- | :-- |
| `light`, `medium`, `heavy` | one tap, increasing firmness | the person touches something: a toggle, a button, a long press |
| `success` | an upbeat double tap | something finished cleanly: saved, paid, sent |
| `warning` | two heavy taps | a problem the person can recover from |
| `error` | a sharp triple tap | the action failed |

Fire one per meaningful event. Buzzing on every scroll frame feels broken, and the system throttles it anyway.

## Wire it to a button

<CodeTabs>

```xml title="DSX markup"
<button label="Save" on:tap="dsx.module.haptic.success()"/>
```

```js title="JavaScript (any web app)"
saveButton.addEventListener("click", async () => {
  await save()
  dsx.module.haptic.success()
})
```

</CodeTabs>

## Custom patterns

When the six styles do not fit, `pattern` plays a sequence you describe event by event. Each event has an optional
`delay` (milliseconds after the previous one ends), `duration` (milliseconds; 0 is a sharp tap), `intensity` (0 to 1)
and `sharpness` (0 to 1, iPhone only).

```js
const result = await dsx.module.haptic.pattern({
  events: [
    { duration: 40, intensity: 0.7 },
    { delay: 40, duration: 40, intensity: 0.7 },
    { delay: 40, duration: 50, intensity: 1 },
  ],
})
// result.fallback is set only when the device could not play the pattern as written
```

## Devices that cannot vibrate

A haptic call never fails: feedback is decoration, so you never need a `try`/`catch` around it. On a device with no
vibration hardware (an iPad, or a browser without `navigator.vibrate`) the call still resolves, and `pattern` tells you
what happened in `fallback`. To hide a "Vibrate" setting on such devices, read the package's `supported` value instead
of calling and checking.

<PackageReference/>
