---
name: integrating-a-native-sdk
description: "Wrap a vendor's proprietary native SDK (an OEM Bluetooth device, a reader, a scanner, a vendor framework) as a DSX package the right way: despia package new --vendor-sdk, one vendor seam file per lane, adapt the capability owner instead of duplicating it, one owner per OS integration, the feature call that asks for its own permission, data in as attributes with the look as a registered CSS knob, the three platform states with a named degradation, tests and fixtures, and the despia package check coaching loop. Use when asked to integrate a native SDK, a vendor SDK or a library into Despia, before writing any package that calls a third-party native framework."
---

<!-- GENERATED from OpenSource/Skills/integrating-a-native-sdk.md in despia-native/despia.
     Edit the source, then: ruby ClosedSource/scripts/generate_agent_skills.rb -->

# Integrating a vendor's native SDK the DSX way

> Audience: anyone handed a proprietary native SDK (an OEM's Bluetooth ring, a payments reader, a
> scanner vendor's framework) and asked to make it work in a Despia app. This walks one package from
> `despia package new` to a package that ships, using the example `AcmeRing`, an imaginary ring that
> talks Bluetooth through Acme's own iOS and Android libraries. Companions:
> [writing-a-module.md](https://docs.despia.com/framework/skills/writing-a-module) (the recipe),
> [package-as-sdk.md](https://docs.despia.com/framework/skills/package-as-sdk) (how to make a good package),
> [native-components.md](https://docs.despia.com/framework/skills/native-components) (a vendor view on screen),
> [porting-a-react-native-library.md](https://docs.despia.com/framework/skills/porting-a-react-native-library) (when the starting point is a
> React Native wrapper) and [package-check-coaching.md](https://docs.despia.com/framework/skills/package-check-coaching) (every refusal the
> checker prints, with the conforming shape).

## 1. What you are building

A vendor SDK becomes a **package**: a folder with a `dsx.json` manifest and one lane per platform.
The app never imports the SDK. It calls `dsx.module.acmering.connect(...)`, reads `dsx.module.acmering.context`
and listens for the package's broadcasts, and the same line works on web, iOS, Android and desktop.

Three decisions come before any code, and the checker enforces each:

| decision | the rule | what it means for the ring |
|---|---|---|
| a package is a capability, not an app (K19) | no login screen, no trial policy, no page | the package connects and reads the ring; the app decides what to do with a heart rate |
| one owner per capability (K1, K3) and per OS integration (K2) | a vendor adapts the owner, never duplicates it | Bluetooth already has an owner, so `AcmeRing` declares `"adapts": "bluetooth"` and depends on it; it never links CoreBluetooth to scan |
| the feature call owns its permission (Article 13 clause 3) | the call that needs a grant asks just in time | `connect` asks for the Bluetooth grant itself; `setup()` only reads |

## 2. Start from a package that already passes

```bash
despia package new AcmeRing --vendor-sdk Acme
cd AcmeRing && despia package check .
```

The scaffold passes `check` as written (the package's own test runs it through the same rules), so every
later refusal is something you introduced. `--vendor-sdk` adds the adapter seam. The files:

| file | what it is |
|---|---|
| `dsx.json` | the manifest: `command`, `adapts`/`dependencies`, `context` (`ready`, `state`, `permission`), `actions` (`connect`, `disconnect`, `permission.status`, `permission.request`, `permission.openSettings`), `errors`, and the iOS and Android permission strings |
| `config.json` | the per-app knob for the permission prompt text (`usage_description`) |
| `swift/AcmeRing.swift`, `kotlin/AcmeRing.kt` | the DSX contract: the actions, the context, the typed results. They never name the vendor |
| `swift/AcmeRingVendor.swift`, `kotlin/AcmeRingVendor.kt` | THE ONE SEAM: every call into the vendor's SDK lives here, in one file per lane |
| `web/index.js` | the web lane, platform-limited with a named degradation (section 7) |
| `Components/AcmeRingStatus.dsx` | an island: a small piece of UI whose data comes in as attributes and whose look is a registered knob (section 6) |
| `README.md` | the same laws, for the next person |

`--owns <word>` or `--adapts <word>` overrides the capability word; `--adapts` is refused unless a
first-party package owns that word (`despia packages --capabilities` lists them).

## 3. Fill the seam

Add the vendor's libraries to the manifest the way any package does
([manifest-dsl.md](https://docs.despia.com/framework/skills/manifest-dsl)): `spm` (or `pods`) for iOS and `gradle.dependencies` for Android.

```json
"spm": [ { "url": "https://github.com/acme/acme-ring-ios", "from": "2.1.0", "products": ["AcmeRingSDK"] } ],
"gradle": { "dependencies": ["com.acme:ring:2.1.0"] }
```

Then replace the bodies marked `VENDOR` in the two seam files with the SDK's own calls. Two shapes in the
scaffold are deliberate:

- **The rest of the lane speaks DSX and never imports the vendor.** `AcmeRing.swift` calls
  `vendor.connect(deviceId:)` and resolves `{ state }`; only `AcmeRingVendor.swift` knows what a ring
  object is. Replacing the vendor later, or mocking it in a test, is one file.
- **A missing SDK is a typed state, not a crash (Article 7).** Without the SDK in the build every call
  answers `{ state: "idle", fallback: "none" }`, and `context.ready` is `false`, so the app can show its
  own message instead of ending.

Translate the vendor's event callbacks into declared output, never into an ad hoc channel: put the
reading in `context` (what the app reads now) or in a declared broadcast (what the app reacts to), and a
page receives it through `dsx.on`. A page callback such as `window.onRing`, injected JavaScript, a
base64 payload or a file path handed to the page are refused (rule list in
[MODERN-PACKAGE-RULES.md](https://github.com/despia-native/despia/blob/main/OpenSource/Documentation/architecture/MODERN-PACKAGE-RULES.md)); files travel as opaque
Core/Files handles.

### One owner per OS integration

The vendor SDK may own its own transport (a ring usually speaks a proprietary GATT service), but the
operating system accepts one party for each of a few integrations: the call UI (CallKit, Telecom), push
registration, the notification delegate, picture in picture, and the audio session. The checker refuses a
second party and names the owner to call instead. For the audio session that owner is Core/Audio:
post a claim, never `setCategory` or `requestAudioFocus`
(see [`ClosedSource/DSX/Modules/Core/Audio/README.md`](https://github.com/despia-native/despia/tree/main/ClosedSource/DSX/Modules/Core/Audio/README.md)).
Link the radio yourself to scan and `check` says so, naming the Bluetooth package.

## 4. The feature call asks for the permission

The scaffold's `connect` is the pattern. It reads the grant, asks just in time, refuses with a typed
state, and only then touches the vendor:

```swift
dsx.action("connect") { [self] dsx in
    vendor.requestPermission { wire in
        dsx.context.set("permission", wire)
        guard (wire["status"] as? String) == "granted" else {
            dsx.fail("permission_denied", message: "...", recoverable: true); return
        }
        self.vendor.connect(deviceId: dsx.args("deviceId") as? String ?? "") { state in
            dsx.context.set("state", state)
            dsx.resolve(JSON(["state": state]))
        }
    }
}
```

The permission state is the shared contract `{ status, canAsk }`, where `status` is one of
`undetermined`, `granted`, `limited`, `denied`, `restricted` or `unavailable`
([permissions-unified](https://github.com/despia-native/despia/blob/main/OpenSource/Documentation/architecture/proposals/permissions-unified.md)). Map the vendor's
own authorization onto it in `permissionWire()`, and keep these three beside the feature call:

- `permission.status` reads and never prompts, so a settings screen may call it on every appear;
- `permission.request` is the explicit ask;
- `permission.openSettings` opens the app's page in Settings, from a user action only.

`setup()` only reads. A request at launch is refused. If another package already owns the grant (the
Bluetooth radio's), list it in `dependencies` and ask through it instead of declaring your own request
API. The purpose strings an app ships (`NSBluetoothAlwaysUsageDescription`, the Android permissions) are
declared in your manifest and cleared or kept by the app's `permissions.json`
([module-permissions.md](https://docs.despia.com/framework/skills/module-permissions)).

## 5. Data comes in as attributes, the look is CSS

If the package ships UI, ship it at three levels (K16): the headless capability first (`context` and
`actions` that drive everything), then each piece of UI as a public island, then, optionally, a complete
component built only from those islands and declared in `composites`.

Inside a component, attributes carry **data** and CSS carries **style** (Article 12). The scaffold's island
shows both:

```xml
<head>
  <attribute as="title" default="''" sample='"Ring"'/>
  <attribute as="state" default="'idle'" sample='"connected"'/>
  <style>
    @property --dsx-acmering-status-radius { syntax: "<length>"; inherits: true; initial-value: 12px }
  </style>
</head>
<stack style="border-radius: var(--dsx-acmering-status-radius)"> ... </stack>
```

An app tunes the look at the mount, `<AcmeRing.Status style="--dsx-acmering-status-radius: 20px"/>`.
Never declare `radius`, `color`, `padding` or `ignoreSafeArea` as an attribute, read the published inset
variables instead of writing them, and never ship an `enable`, `disable` or hide-all action: the app
decides what renders with `visible-if` over your state. If the vendor ships its own view (a camera
preview, a chart), it is an SDK host component, the one kind of native UI a package may own besides a
platform control mapping ([native-components.md](https://docs.despia.com/framework/skills/native-components)).

## 6. Three platform states, on every lane

Constitution Article 10: a capability that ships on one renderer ships on all of them. Every action is
one of three things:

| state | meaning | how it is declared |
|---|---|---|
| supported | the real implementation on that lane | nothing to declare |
| polyfilled | the same behaviour from different parts | nothing to declare |
| platform-limited | the lane cannot do it, with the degradation named | `platforms` on the action plus `_note_platforms` naming the missing OS or Web API and what the author gets instead |

"Unsupported" and "not yet" are descriptions, not states: a lane that answers with a shell is refused
(`A10-shell`). The scaffold's web lane is the legal form for a vendor-only radio: it services every call and
resolves `fallback: "none"`, and the manifest says why.

```json
"connect": {
  "platforms": ["ios", "android"],
  "_note_platforms": "no Web API reaches the vendor ring: navigator.bluetooth cannot open its proprietary GATT service"
}
```

The web is exhausted before it is limited: the note must name the Web API you checked, and "not built"
is not a reason. Hardware that may be absent on a device declares `errors.unsupported_device` and a probe.

## 7. Prove it

- **Rows beside the action.** Each action carries `tests` in `dsx.json` (name, args, expected
  `resolve`); the scaffold ships one for `connect` and one for `disconnect`
  ([writing-unit-tests.md](https://docs.despia.com/framework/skills/writing-unit-tests)). The build gate checks every row against the
  action's own `args` and `resolves`.
- **A fixture, contract first.** In the framework repository a behaviour with logic in it (a state
  machine, a unit conversion, a fold over the vendor's readings) lands as a JSON fixture under
  `OpenSource/Conformance/<word>/` before the code, and the TypeScript, Kotlin and Swift lanes all run
  it ([`OpenSource/Conformance/README.md`](https://github.com/despia-native/despia/tree/main/OpenSource/Conformance/README.md)).
  Keep the vendor call a thin seam and put the logic where a fixture can reach it.
- **A device.** The seam is the part a corpus cannot prove. Run the exported app on a real device with
  the real ring and write down what you saw.

## 8. The coaching loop

```bash
despia package check .          # after every edit
despia package check . --json   # the same findings, for a tool
```

Every refusal names where it found the violation, the article, why the law exists and the conforming
pattern with a snippet; the same text for all of them is in
[package-check-coaching.md](https://docs.despia.com/framework/skills/package-check-coaching). The loop is: edit, `check`, read the refusal,
apply the pattern it shows, `check` again. Do not silence a rule; each one is cheaper to satisfy at the
start than to retrofit after the app depends on it.

Once it is green, the release verbs take over (`despia package verify`, `diff`, `compat`, `history`,
`release`: the release ledger and the compatibility proof, described by `despia package`).

## 9. Checklist

- [ ] `despia package new <Name> --vendor-sdk <Vendor>` and `despia package check .` green before the first edit
- [ ] `adapts` plus `dependencies` on the capability's owner, or `owns` if you are the owner (K1, K3)
- [ ] No second owner of an OS integration: call the owner, or post a claim (K2)
- [ ] Every vendor call in the seam file of its lane; nothing else imports the SDK
- [ ] `permission.status`, `permission.request`, `permission.openSettings` and an object `permission` context; the feature call asks, `setup()` reads
- [ ] A missing SDK resolves a typed state (`ready: false`, `fallback: "none"`), never an exit
- [ ] Attributes carry data; every look is an `@property --dsx-<component>-<knob>`; no enable or disable switch
- [ ] Every action supported, polyfilled, or platform-limited with `platforms` and `_note_platforms`
- [ ] `tests` rows on the actions, a fixture for any logic, and a run on a real device
