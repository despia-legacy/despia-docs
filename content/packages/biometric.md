---
title: Biometric
description: Confirm it is really the user with Face ID, Touch ID or the device passcode.
package: Core/Biometric
section: packages
group: Sign-in and identity
icon: faceid
order: 106
---

# Biometric

Shows the system prompt so the user can confirm it is them with biometrics, falling back to the device passcode. Without a challenge the answer is a yes or no for the interface (a modified client can fake it, so it never protects data); pass a server challenge and the answer is a passkey assertion your server verifies. To keep a secret behind biometrics use the vault's locked records. You write the reason text shown in the prompt.

**When to use it.** Use it to confirm the person holding the phone before showing a screen or acting on a tap. For anything that protects data or money, pass a server challenge so your server can verify the answer.

<PackageSample/>

<PackageReference/>
