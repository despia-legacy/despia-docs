---
title: Bluetooth
description: Connect your app to nearby Bluetooth Low Energy devices.
package: Core/Bluetooth
section: packages
group: Connectivity
icon: network
order: 143
---

# Bluetooth

Scans for Bluetooth Low Energy devices, connects, discovers services and reads, writes and subscribes to their data. Use it for wearables, sensors and other accessories. Asks for Bluetooth permission the first time it is used, with text you set. Works on phones and desktop.

**When to use it.** Use it to talk to Bluetooth Low Energy accessories such as heart rate straps, sensors and smart devices. It does not handle classic Bluetooth audio or pairing screens.

<PackageSample/>

## Known limits

- Android: no background delivery; connections live while the app process does.
- Not included yet: the peripheral role, pairing control, L2CAP channels, Bluetooth Classic and beacons.
- Device ids are opaque and differ by platform.
- After an automatic reconnect (`autoConnect: true`), call `discover` and `subscribe` again.

<PackageReference/>
