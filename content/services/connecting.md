---
title: Connecting Despia services together
description: Services that run alone also link up. Connect chat to push, and push to Despia Identity, by setting one address each.
section: services
order: 2
---

# Connecting Despia services together

Every service runs on its own. When you run more than one, you can link them so each does more:
chat sends a push for a new message, and push uses Despia Identity's sign-in and consent. A link is
optional, set by one address, and you can add or remove it at any time.

## The links

| Service | Optional link | Without it | With it |
|---|---|---|---|
| Chat | Messaging (`MESSAGING_ENDPOINT`) | Stores and serves messages; members see new ones on their next sync | A new message also sends a push |
| Messaging (push) | Identity (`IDENTITY_ENDPOINT`) | Sessions from your own provider, or anonymous devices | Despia sign-in, per-installation targets, consent and sign-out everywhere |
| Commerce | Identity (`IDENTITY_ENDPOINT`) | Customers proved by your provider's session | Customers are Despia Identity users |

## Link one service to another

Each service declares its links in its own `dsx.config.json`. The `?` marks a link as optional:

```json title="messaging/dsx.config.json"
{
  "deploy": {
    "target": "cloudflare",
    "remotes": { "identity": "IDENTITY_ENDPOINT?" }
  }
}
```

The value is the name of a setting. Set it to the other service's address and the link is on;
leave it unset and the service runs alone.

<Steps>
<Step title="Turn on both services">
```sh
npx despia services enable identity --apply
npx despia services enable messaging --apply
```
</Step>
<Step title="Set the link">
Give Messaging the address of Identity. The two services sign every call between them, so
Messaging also needs its own service key, and Identity lists Messaging as a trusted caller
(`GATEWAY_ISSUERS`).

| On | Setting | Value |
|---|---|---|
| Messaging | `IDENTITY_ENDPOINT` | Identity's address |
| Messaging | `DESPIA_SERVICE_KEY` | Messaging's own signing key |
| Identity | `GATEWAY_ISSUERS` | Includes Messaging's address |
</Step>
<Step title="Check it">
```sh
npx despia services check messaging
```

The check reads the link and says what is missing. A link that is set but cannot be used stops
the service at start, with the name of the missing setting, rather than half working.
</Step>
</Steps>

## A full stack: Identity, Messaging and Chat

1. **Identity** signs people in and owns their devices.
2. **Messaging** links to Identity: a signed-in device is bound to the person, and signing out on
   one device is seen by push at once.
3. **Chat** links to Messaging: every new message also reaches the recipient's phone.

Each step is optional. Remove a link and the service goes back to running alone, with its data
kept.

## Next

- [Using a Despia service on its own](/services/on-its-own): push with your own sign-in.
