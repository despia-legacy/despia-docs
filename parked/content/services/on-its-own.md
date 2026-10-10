---
title: Using a Despia service on its own
description: Every Despia service runs alone. Use Despia push with your own sign-in (Clerk, Supabase, Firebase, Auth0) or with no sign-in at all.
section: services
order: 1
---

# Using a Despia service on its own

Each Despia service, such as push, payments or chat, is a part of your project's back end that you
turn on by itself. None of them needs another Despia service to start. If you already have sign-in
somewhere else, keep it: the services check your provider's sessions directly.

This page sets up **push** (the Messaging service) for an app whose users sign in with Clerk.

## 1. Turn the service on

```sh
npx despia services enable messaging
```

Without `--apply` you see the plan first: the release it pins, the database tables it adds and the
secrets it still needs. Run it again with `--apply` to install it into your project's back end.

## 2. Add the store keys

Push needs Apple's and Google's keys. Each one is set by name and goes straight to your provider's
secret store; it is never written to a file.

```sh
npx despia services keys messaging PUSH_APNS_KEY --stdin --apply < AuthKey.p8
npx despia services keys messaging PUSH_FCM_PRIVATE_KEY --stdin --apply < fcm-key.pem
```

| Name | What it is |
|---|---|
| `PUSH_APNS_KEY`, `PUSH_APNS_KEY_ID`, `PUSH_APNS_TEAM_ID`, `PUSH_APNS_BUNDLE_ID` | Your APNs auth key (`.p8`) and its ids |
| `PUSH_FCM_PROJECT_ID`, `PUSH_FCM_CLIENT_EMAIL`, `PUSH_FCM_PRIVATE_KEY` | A Firebase service account |
| `PUSH_API_KEY` | The send key your own back end presents |

## 3. Point it at your sign-in

Tell the service where your provider publishes its keys. It then accepts your users' existing
session tokens.

| Provider | Settings |
|---|---|
| Clerk | `AUTH_JWKS_URL=https://<frontend-api>/.well-known/jwks.json`, `AUTH_ISSUER=https://<frontend-api>` |
| Supabase | `AUTH_JWKS_URL=https://<ref>.supabase.co/auth/v1/.well-known/jwks.json`, `AUTH_ISSUER=https://<ref>.supabase.co/auth/v1`, `AUTH_AUDIENCE=authenticated` |
| Firebase | `AUTH_JWKS_URL=https://www.googleapis.com/service_accounts/v1/jwk/securetoken@system.gserviceaccount.com`, `AUTH_ISSUER=https://securetoken.google.com/<project>`, `AUTH_AUDIENCE=<project>` |
| Auth0 | `AUTH_JWKS_URL=https://<tenant>/.well-known/jwks.json`, `AUTH_ISSUER=https://<tenant>/`, `AUTH_AUDIENCE=<api>` |

The user id is the token's `sub`. If yours lives in another claim, set `AUTH_SUBJECT_CLAIM`.

## 4. Register a device

The app registers on every launch, because tokens change. With a session, the device is bound to
the user the token names, and to no one else:

```http
POST /push/devices
Authorization: Bearer <your Clerk session token>

{ "platform": "ios", "token": "<apns token>", "externalUserId": "user_8412" }
```

No sign-in yet? Register without the header. The device is anonymous until your back end binds it
with the send key (`x-push-key`).

## 5. Send from your back end

```http
POST /push/send
x-push-key: <PUSH_API_KEY>

{ "externalUserIds": ["user_8412"], "payload": { "title": "Order shipped", "body": "It is on its way" } }
```

The answer is `202` with a message id. Every device that user has, phone, tablet and browser,
receives it.

## What you give up without Despia Identity

Almost nothing. Two things need Identity, and the service says so when you ask for them:

- **Per-installation slots** (one app install as its own target) answer `installation_required`.
- **Consent for marketing pushes** comes from your back end instead: it sends `consent: "granted"`
  with the message. Transactional pushes need no consent.

To add Identity later, see [Connecting Despia services together](/services/connecting).
