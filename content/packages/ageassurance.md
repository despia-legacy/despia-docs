---
title: AgeAssurance
description: Ask the phone's operating system for the user's age range.
package: Core/AgeAssurance
section: packages
group: Compliance
icon: person.crop.circle
order: 148
---

# AgeAssurance

Uses Apple's Declared Age Range on iOS and Google's Play Age Signals on Android to learn which age band the user is in, without asking for a birthdate. Both give the same answer shape, with a yes, no or unknown result for each age you test. It asks the system to show its own prompt. You write what your app does for each age group.

**When to use it.** Use it when you must treat under-age users differently, for example to show or hide adult content. Check for yes with a strict true test, because unknown is not the same as no. If the system cannot answer, ask for a birthdate yourself.

<PackageSample/>

<PackageReference/>
