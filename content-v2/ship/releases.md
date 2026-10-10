---
title: Releases
description: Send a build to TestFlight or a Google Play testing track, invite testers, submit for review and release, from the console or the CLI.
---

After a build, the path to the stores is the same every time: testers first, then review, then release.

## Testers

```sh
npx despia testers add ada@example.com --target ios --apply
npx despia testers add testers@example.com --target android --track internal --apply
npx despia testers list --target ios
```

On iOS, Apple emails the tester an invitation to TestFlight. On Android, the address is a Google Group, and everyone in it can install from the testing track.

To upload a build to testing as soon as it is built, add `--publish testflight` (iOS) or `--publish internal` (Android) to `despia build`.

## Submit for review

```sh
npx despia submit --project <project-id>
npx despia submit --project <project-id> --apply
```

`submit` first prints a checklist: the build, the store version, the listing, the privacy answers. With `--apply` it submits the newest finished release build. On iOS the release stays manual by default, so you choose when the approved version goes live.

## Follow a submission

```sh
npx despia releases list
npx despia releases show --submission <submission-id>
npx despia releases refresh --submission <submission-id>
```

`releases list` shows every submission and what is live now.

## When a review is rejected

Copy the reviewer's message from App Store Connect or Play Console into a file, then:

```sh
npx despia releases rejection --submission <submission-id> --reason-file rejection.txt
```

Despia attaches the message to the submission and prints the fixes that match it. [App Review](/app-review) explains the guidelines apps run into most, with a fix and a reply for each.

## Release

When a version is approved, release it from the console or with `despia publish release`. A rollout below 100 percent releases to a share of your users first: a phased release on iOS, a staged rollout on Android. A rollout of 0 halts an Android rollout.

## The next version

```sh
npx despia releases new --bump minor --apply
```

This creates the next store version, numbered above every version the store knows. On iOS it is created in App Store Connect.
