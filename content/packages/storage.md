---
title: ValueStore
description: Save small settings and values on the device so they are still there next time the app opens.
package: Core/Basics/ValueStore
section: packages
group: Data and contacts
icon: externaldrive
order: 146
---

# ValueStore

A simple store for things like a theme choice, a language or a last-seen date. Values keep their type: a number comes back a number. Read or write one value or many at once in a single call, list keys by prefix a page at a time, and every change is announced so two screens never disagree. Values stay on the device, with no account or keys needed.

**When to use it.** Reach for it to remember small things between launches, such as a theme, a language or the last screen. It is not meant for large files or secrets; use files for big data and a secure store for credentials.

<PackageSample/>

<PackageReference/>
