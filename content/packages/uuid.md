---
title: DeviceUUID
description: Gives your app a stable anonymous id for each install, with no permission prompt.
package: Core/DeviceUUID
section: packages
group: Device and system
icon: faceid
order: 117
---

# DeviceUUID

Returns one identifier that stays the same across launches. It uses the vendor id on iOS, and a generated id kept safely on Android, desktop and the web. It is not an advertising id and cannot be used to fingerprint the device.

**When to use it.** Use it to recognise the same install across launches, for example to attach anonymous settings or sessions to a device. Do not use it as an advertising id or for tracking across other companies' apps.

<PackageSample/>

<PackageReference/>
