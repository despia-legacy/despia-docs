---
title: IdentityVault
description: Stores small secrets on the device in the system keychain, with an optional Face ID or fingerprint lock.
package: Core/IdentityVault
section: packages
group: Sign-in and identity
icon: lock.shield
order: 107
---

# IdentityVault

Writes and reads small pieces of text, such as an anonymous user id or a token, in the secure store of the device. Records can be locked so they release only after Face ID, Touch ID or the passcode, and can follow the user to a new phone through iCloud Keychain or Google Block Store. It also reports honestly how long a record will last.

**When to use it.** Use it for small secrets that must survive reinstalls or follow the user, such as an anonymous identity behind a purchase. Do not use it for large data or ordinary settings.

<PackageSample/>

<PackageReference/>
