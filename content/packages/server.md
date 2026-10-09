---
title: Server
description: The backend settings for your app: sign-in, data, address and where it is deployed.
package: server
---

The backend settings for your app: sign-in, data, address and where it is deployed.

Holds the settings for your app's own backend, such as how logins are checked, which database it uses, the address the app talks to, the deploy target and request limits. It also lets other packages mark an action to run on your server instead of the phone. It adds no commands of its own. You fill in the settings and the packages that need a server use them.

Open package. License: Apache-2.0. Version 0.1.0.

## When to use it

Include it when your app has its own backend and you want to set its login checking, database and deploy target in one place. If your app has no server code, you do not need it.

## Install

```sh
despia add Core/Server
```

## Where it runs

| Target | Available |
| --- | --- |
| ios | no |
| android | no |
| web | no |
| macos | no |

## Actions

_This package declares no actions._

## Configuration

| Key | Type | Default | What it does |
| --- | --- | --- | --- |
| `auth_audience` | string | `` | Only accept tokens minted for this audience. Leave empty to accept any. |
| `auth_issuer` | string | `` | Only accept tokens minted by this exact issuer. Leave empty to accept any issuer whose signature checks out. |
| `auth_jwks_url` | url | `` | Where the backend fetches your login provider's public keys, when tokens are signed with a key pair instead of a shared secret. |
| `auth_mode` | string | `jwks` | How the backend decides who is calling: "secret" uses one shared signing key, "jwks" uses your login provider's public keys, "none" means the backend can never identify anyone. |
| `auth_secret` | secret | `` | The secret your login provider signs tokens with. Copy it from the provider's dashboard. |
| `aws_cloudfront_distribution` | string | `` | Optional. Invalidate this distribution after publishing. |
| `aws_s3_bucket` | string | `` | The bucket that serves your site. |
| `cloudflare_hyperdrive_id` | string | `` | The id of a Cloudflare Hyperdrive configuration pointing at your Postgres database. Create one in the Cloudflare dashboard and paste its id here. Leave empty to connect directly with the database address instead. |
| `cloudflare_pages_project` | string | `` | The Pages project name that serves your site. |
| `cloudflare_worker_name` | string | `dsx-server` | What your backend is called on Cloudflare. It appears in the workers.dev address and the dashboard. |
| `data_backend` | string | `postgres` | Which database your backend keeps its data in. The value none means the backend serves only code you wrote yourself, with no stored data. |
| `database_target` | string | `` | Which provider holds the database: supabase · firebase · convex · neon · planetscale · postgres, or "none". |
| `database_url` | secret | `` | The connection address of your Postgres database, copied from your database dashboard. It includes the password, so it is stored as a secret. |
| `deploy_target` | string | `none` | Which service hosts your backend. One button deploys to it. |
| `event_retention_hours` | number | `24` | How long live updates are kept so an app that was offline can catch up when it reconnects. Longer means a phone can be away longer without missing anything. |
| `firebase_project_id` | string | `` | Your Firebase project id. It is needed when you deploy to Firebase, and whenever Firestore is your data storage. |
| `firestore_service_token` | secret | `` | An access token letting the backend reach collections your security rules keep private. Leave it empty and those internal paths simply refuse, while everything your users do is unaffected. |
| `fly_app` | string | `` | The Fly.io app this deploy targets. |
| `gcloud_bucket` | string | `` | The Cloud Storage bucket that serves your site. |
| `github_pages_branch` | string | `gh-pages` | The Git branch of your repository that GitHub Pages publishes as your site. |
| `internal_key` | secret | `` | A password your scheduled background jobs use to reach the backend. Generate any long random string; nothing but your own server uses it. |
| `link_public_key` | string | `` | The public half of your signing key. It lets an installed app check that a backend update really came from you. Leave empty to keep using only what shipped in the app. |
| `max_body_bytes` | number | `1048576` | The biggest request body the backend will read, in bytes. Anything larger is refused before it is parsed. |
| `netlify_site_id` | string | `` | The Netlify site ID or name that serves your site. |
| `render_service_id` | string | `` | The Render service this deploy targets. |
| `runtime_target` | string | `` | Which provider runs the backend: cloudflare · docker · supabase · firebase · convex · render · railway · fly, or "none". |
| `server_url` | url | `` | Where your app should reach your backend. Change it here when you move the backend, and apps already installed will follow without a new release. |
| `service_roles` | list | `["service_role"]` | Which token roles count as the backend calling itself. Only these may reach internal jobs like queue drains. |
| `site_build_command` | string | `` | Run this before publishing the site. Leave empty when the site is already built. |
| `site_dir` | string | `dist` | The folder the site build writes, relative to the project root. |
| `site_target` | string | `` | Which provider serves the built site: cloudflare-pages · vercel · netlify · aws-s3 · github-pages · firebase-hosting · gcloud-storage · render · railway, or "none". |
| `spend_beacon_app` | string | `` | The app identity the spend doorbell rings as. The dashboard fills this when it mints the beacon key; the two travel together. |
| `spend_beacon_key` | secret | `` | The signing key for the spend doorbell. Set it together with the beacon URL, or the doorbell stays off. |
| `spend_beacon_url` | url | `` | Where a spend-ceiling trip rings a doorbell: one signed POST per transition, nothing else, ever. Leave empty to keep the deployment fully silent. |
| `spend_read_token` | secret | `` | A read-only token the dashboard uses to read this deployment's spend meters directly from the browser. It can read meters and nothing else. |
| `supabase_project_ref` | string | `` | The project reference from your Supabase dashboard URL. It is only needed when deploying to Supabase. |
| `webhook_secrets` | secret | `` | The secrets your webhook senders sign with, written as name=secret and separated by commas. Repeat a name with two secrets while you rotate one, so deliveries keep arriving during the change. |
| `webhook_tolerance_seconds` | number | `300` | How far a delivery's signed timestamp may be from your server's clock, in seconds. Deliveries outside the window are refused even when the signature is correct. |

## Versions

| Version | Channel | Summary |
| --- | --- | --- |
| 0.1.0 | checkpoint |  |
