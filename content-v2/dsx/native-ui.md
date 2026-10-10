---
title: Native UI
description: The elements and components DSX ships, grouped by what they are for, and how each one takes the look of the platform it runs on.
---

DSX gives you two kinds of building blocks. **Elements** are the lowercase tags the renderers draw directly: `stack`, `text`, `button`, `list`. **Components** are capitalised tags built from elements: `Card`, `SettingsRow`, `EmptyState`. Both are available in every project with nothing to install.

## Platform look by default

An unstyled control looks like the platform it runs on: a `<toggle>` is the iOS switch on an iPhone and the Material 3 switch on Android, a `<sheet>` is the system sheet, a `<button>` with no CSS is the system's borderless accent button. Add CSS and your declarations win.

To give every built-in control one look of your own on every platform, set `"design": "custom"` in `App.json`. The controls then draw from the design tokens you set in `:root` (see [Styling is CSS](/dsx/styling)).

## Elements

| Group | Elements |
| :-- | :-- |
| Layout | `stack`, `vstack`, `hstack`, `zstack`, `scroll`, `spacer`, `divider`, `card`, `chip` |
| Content | `text`, `markdown`, `image`, `button`, `pressable`, `progress`, `spinner` |
| Inputs | `textfield`, `textarea`, `toggle`, `slider`, `picker`, `segmented`, `datepicker`, `stepper` |
| Structure | `scaffold`, `tabs`, `split`, `sheet`, `list`, `grid`, `pager`, `flow`, `refreshable` |
| Media | `video`, `audio` |
| Forms | `form`, `field` |
| Drawing | `canvas`, `ink` |

Inputs are two-way: `bind` names the variable they read and write.

```dsx title="Components/Settings.dsx"
<scroll>
  <head>
    <variable as="wifi">return true</variable>
    <variable as="volume">return 0.6</variable>
    <variable as="name">return ''</variable>
    <style>
      .form { gap: 16px; padding: 20px; }
    </style>
  </head>
  <vstack class="form">
    <toggle bind="dsx.variable.wifi" label="Wi-Fi"/>
    <slider bind="dsx.variable.volume"/>
    <textfield bind="dsx.variable.name" placeholder="Your name"/>
    <text value="Hello {{ dsx.variable.name }}" visible-if="dsx.variable.name !== ''"/>
  </vstack>
</scroll>
```

## Components

The built-in components cover the patterns most apps need. A few of them:

| Component | What it is |
| :-- | :-- |
| `Card` | A rounded container around its children, with an optional title |
| `ListGroup`, `SettingsRow` | Grouped rows with icons, values and disclosure, like a settings screen |
| `EmptyState` | The "nothing here yet" block, with an optional action |
| `Callout`, `Banner` | A message with a tone: info, success, warning or error |
| `LinkCard` | A link as a card; a real link on the web |
| `Steps`, `Timeline` | Numbered steps or a sequence of events |
| `Swipe` | A row that slides aside to reveal actions |
| `NavBar` | The page's title bar, drawn the platform's way |
| `Skeleton` | A loading placeholder |
| `CopyButton`, `CopyRow` | Copy a value with one tap |
| `PromptInput`, `Answer`, `ToolCall` | The parts of an AI chat screen |
| `AuthLogin`, `AuthSignup` | Sign-in and sign-up forms |

```dsx title="Components/Inbox.dsx"
<stack style="padding: 20px">
  <head>
    <variable as="messages">return []</variable>
  </head>
  <EmptyState title="No messages" message="When someone writes to you, it shows up here." icon="tray" visible-if="dsx.variable.messages.length === 0"/>
</stack>
```

## Lists that scale

`<list>` and `<grid>` keep only the rows near the screen drawn, so a list of ten thousand items scrolls like a list of ten. They also give you sections, swipe actions and loading more when the end is reached (`on:reachEnd`). Wrap a list in `<refreshable>` for pull to refresh.

## Accessibility

Accessibility is ARIA. `role`, `aria-label`, `aria-hidden` and `aria-live` work on any element and map to VoiceOver on iOS, TalkBack on Android and the browser's own accessibility tree. Built-in controls already carry their roles and labels. Any element with `on:tap` announces as a button.

```dsx fragment
<image icon="star.fill" aria-label="Favourite"/>
```

## How it is drawn today

In Despia V4 0.0.2, DSX documents are drawn by the DSX DOM renderer on iOS, Android and the web. Drawing with SwiftUI and Jetpack Compose (DSX View) is in alpha and reaches production with DSX 1.0.0. Your documents do not change between the two. See [iOS, Android and web](/dsx/platforms).
