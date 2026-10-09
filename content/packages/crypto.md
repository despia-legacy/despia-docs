---
title: Crypto
description: Hash, sign, encrypt and generate random values with the phone's own crypto.
package: crypto
---

Hash, sign, encrypt and generate random values with the phone's own crypto.

Gives you digests, HMAC, secure random numbers and UUIDs (v4 and time-sortable v7), plus Ed25519 and P-256 signing and AES-256-GCM encryption. Keys are created and kept in the secure store, in secure hardware when the device has it, and you only ever hold a reference. The package uses each platform's own implementation and adds no crypto of its own.

Open package. License: Apache-2.0. Version 0.1.0.

## When to use it

Use it to hash or sign data, make unique ids, draw fair random numbers or encrypt small values with a key the device protects. For storing a secret between launches, use the secure storage package instead.

## What native adds

Keys can live in the Secure Enclave or StrongBox and never leave the device, which a web page cannot guarantee.

## Install

```sh
despia add Core/Crypto
```

## Where it runs

| Target | Available |
| --- | --- |
| ios | yes |
| android | yes |
| web | yes |
| macos | yes |

Device classes: phone, desktop.

## Actions

### decrypt

`dsx.module.crypto.decrypt`

Decrypts data made by encrypt. A wrong key and tampered data give the same error on purpose.

Since 0.1.0.

**Parameters**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `aad` | string | no | The same extra text that was given when encrypting, if any. |
| `ciphertext` | string | yes | The encrypted data from encrypt. |
| `keyRef` | string | yes | The reference to the key used to encrypt. |
| `nonce` | string | yes | The nonce returned by encrypt. |
| `output` | string | no | How the plain data is returned: utf8 (the default) or base64. |
| `tag` | string | yes | The tag returned by encrypt. |

**Resolves with**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `data` | string | yes | The original data recovered by decrypting. |
| `output` | string | yes | The form the data is returned in. |

**Errors**

| Code | Meaning | What to do |
| --- | --- | --- |
| `decrypt_failed` | The message could not be decrypted. | Not recoverable by retrying. |
| `invalid_encoding` | `ciphertext`, `nonce` and `tag` must be base64. | Not recoverable by retrying. |
| `key_not_found` | No key is stored under that reference. | Not recoverable by retrying. |
| `unsupported_platform` | This surface has no way to do the requested operation. | Check dsx.has before calling, or use a platform that supports it. |

**Example: round-trips what encrypt produced**

```js
const result = await dsx.module.crypto.decrypt({"ciphertext":"3q2+7w==","keyRef":"dsx.key:notes","nonce":"AAAAAAAAAAAAAAAA","tag":"AAAAAAAAAAAAAAAAAAAAAA=="});
// resolves {"data":"secret","output":"utf8"}
```

### digest

`dsx.module.crypto.digest`

Hashes some data once and returns the hash. SHA-256 is the usual choice; SHA-1 and MD5 are there only for checks against old servers.

Since 0.1.0.

**Parameters**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `algorithm` | string | yes | The hash to use, such as sha256, sha384 or sha512. |
| `data` | string | yes | The text that will be hashed. |
| `encoding` | string | no | How the input text is encoded: utf8 (the default) or base64. |
| `output` | string | no | How the result is written: hex (the default, lowercase) or base64. |

**Resolves with**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `algorithm` | string | yes | The algorithm that was used. |
| `hash` | string | yes | The hash of the data in the requested output form. |
| `output` | string | yes | The output form that was used, hex or base64. |

**Errors**

| Code | Meaning | What to do |
| --- | --- | --- |
| `invalid_encoding` | `encoding` must be utf8, base64 or hex, and `data` must actually be in it. | Not recoverable by retrying. |
| `unsupported_algorithm` | That hash algorithm is not available. Use sha256, sha384, sha512, sha1 or md5. | Not recoverable by retrying. |
| `unsupported_platform` | This surface has no cryptographic digest. | Not recoverable by retrying. |

**Example: sha256 of "abc" is the RFC 6234 vector**

```js
const result = await dsx.module.crypto.digest({"algorithm":"sha256","data":"abc"});
// resolves {"algorithm":"sha256","hash":"ba7816bf8f01cfea414140de5dae2223b00361a396177a9cb410ff61f20015ad","output":"hex"}
```

**Example: sha512 of the empty string is the RFC 6234 vector**

```js
const result = await dsx.module.crypto.digest({"algorithm":"sha512","data":""});
// resolves {"algorithm":"sha512","hash":"cf83e1357eefb8bdf1542850d66d8007d620e4050b5715dc83f4a921d36ce9ce47d0d13c5d85f2b0ff8318d2877eec2f63b931bd47417a81a538327af927da3e","output":"hex"}
```

### encrypt

`dsx.module.crypto.encrypt`

Encrypts data with AES-256-GCM using a stored key. A fresh nonce is made for every call and returned to you, so you never choose one.

Since 0.1.0.

**Parameters**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `aad` | string | no | Extra text that must be presented again to decrypt, but is not itself encrypted. |
| `data` | string | yes | The text that will be encrypted. |
| `encoding` | string | no | How the input text is encoded: utf8 (the default) or base64. |
| `keyRef` | string | yes | The reference to a key made by secretKey. |

**Resolves with**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `algorithm` | string | yes | The cipher used, aes-256-gcm. |
| `ciphertext` | string | yes | The encrypted data, base64 encoded. |
| `nonce` | string | yes | The one-time value used for this encryption. Keep it with the ciphertext. |
| `tag` | string | yes | The authentication tag that proves the data was not changed. Keep it with the ciphertext. |

**Errors**

| Code | Meaning | What to do |
| --- | --- | --- |
| `invalid_encoding` | `encoding` must be utf8, base64 or hex, and `data` must actually be in it. | Not recoverable by retrying. |
| `invalid_key` | That reference does not name a symmetric key. | Not recoverable by retrying. |
| `key_not_found` | No key is stored under that reference. | Not recoverable by retrying. |
| `unsupported_platform` | This surface has no way to do the requested operation. | Check dsx.has before calling, or use a platform that supports it. |

**Example: encrypts under a stored key and returns nonce and tag separately**

```js
const result = await dsx.module.crypto.encrypt({"data":"secret","keyRef":"dsx.key:notes"});
// resolves {"algorithm":"aes-256-gcm","ciphertext":"3q2+7w==","nonce":"AAAAAAAAAAAAAAAA","tag":"AAAAAAAAAAAAAAAAAAAAAA=="}
```

### hmac

`dsx.module.crypto.hmac`

Computes a keyed hash, for example to check a webhook signature. Give the key either directly or as a reference to a key in the secure store.

Since 0.1.0.

**Parameters**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `algorithm` | string | yes | The hash to use, such as sha256. |
| `data` | string | yes | The text that will be authenticated. |
| `encoding` | string | no | How the input text is encoded: utf8 (the default) or base64. |
| `key` | string | no | The secret key as text. Use this or keyRef, not both. |
| `keyEncoding` | string | no | How the key text is encoded: utf8 (the default) or base64. |
| `keyRef` | string | no | A reference to a stored key, so the key bytes never leave the secure store. Use this or key, not both. |
| `output` | string | no | How the result is written: hex (the default, lowercase) or base64. |

**Resolves with**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `algorithm` | string | yes | The algorithm that was used. |
| `mac` | string | yes | The computed code in the requested output form. |
| `output` | string | yes | The output form that was used, hex or base64. |

**Errors**

| Code | Meaning | What to do |
| --- | --- | --- |
| `invalid_encoding` | `encoding` must be utf8, base64 or hex, and the value must actually be in it. | Not recoverable by retrying. |
| `invalid_key` | Supply exactly one of `key` or `keyRef`. | Not recoverable by retrying. |
| `key_not_found` | No key is stored under that reference. | Not recoverable by retrying. |
| `unsupported_algorithm` | That MAC algorithm is not available. Use sha256, sha384, sha512 or sha1. | Not recoverable by retrying. |
| `unsupported_platform` | This surface has no HMAC implementation. | Not recoverable by retrying. |

**Example: RFC 4231 test case 2 for hmac-sha256**

```js
const result = await dsx.module.crypto.hmac({"algorithm":"sha256","data":"what do ya want for nothing?","key":"Jefe"});
// resolves {"algorithm":"sha256","mac":"5bdcc146bf60754e6a042426089575c75a003f089d2739839dec58b964ec3843","output":"hex"}
```

**Example: RFC 4231 test case 2 for hmac-sha512**

```js
const result = await dsx.module.crypto.hmac({"algorithm":"sha512","data":"what do ya want for nothing?","key":"Jefe"});
// resolves {"algorithm":"sha512","mac":"164b7a7bfcf819e2e395fbe73b56e0a387bd64222e831fd610270cd7ea2505549758bf75c05a994a6d034f65f8f0e6fdcaeab1a34d4a6b4b636e070a38bce737","output":"hex"}
```

### keypair

`dsx.module.crypto.keypair`

Creates a signing key pair, Ed25519 or P-256. By default the private half stays in the secure store and you get a reference to it.

Since 0.1.0.

**Parameters**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `algorithm` | string | yes | The key type: ed25519 or p256. |
| `id` | string | no | A name for the stored key, so you can find it again. |
| `store` | boolean | no | True (the default) keeps the private key in the secure store. False returns it to you, held in memory only. |

**Resolves with**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `algorithm` | string | yes | The key type that was made. |
| `hardware` | boolean | yes | True when the private key is protected by secure hardware. |
| `keyRef` | string | no | The reference to the stored private key, present when store is true. |
| `privateKey` | string | no | The private key itself, present only when store is false. |
| `publicKey` | string | yes | The public key, to share with whoever verifies your signatures. |
| `storage` | string | yes | Where the private key is kept: secureEnclave, strongBox, keychain, keystore or memory. |

**Errors**

| Code | Meaning | What to do |
| --- | --- | --- |
| `secure_hardware_unavailable` | This device has no secure element, so the private key is stored in the OS keystore instead. |  |
| `unsupported_algorithm` | Only ed25519 and p256 key pairs are available. | Not recoverable by retrying. |
| `unsupported_platform` | This surface cannot generate a stored key pair. | Not recoverable by retrying. |

**Example: a stored p256 pair returns a reference and no private material**

```js
const result = await dsx.module.crypto.keypair({"algorithm":"p256"});
// resolves {"algorithm":"p256","hardware":true,"keyRef":"dsx.key:p256-1","publicKey":"BFy0mS5m0Q0kQb5x0iVQ7fT0m0nqKf1U4h9r2v3s4t5u6v7w8x9y0z1A2B3C4D5E6F7G8H9I0J1K2L3M4N5O6P","storage":"secureEnclave"}
```

**Example: a stored ed25519 pair discloses the keychain fallback instead of pretending**

```js
const result = await dsx.module.crypto.keypair({"algorithm":"ed25519"});
// resolves {"algorithm":"ed25519","hardware":false,"keyRef":"dsx.key:ed25519-1","publicKey":"3q2+7wAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA=","storage":"keychain"}
```

### randomBytes

`dsx.module.crypto.randomBytes`

Returns secure random bytes, base64 encoded, from the system's cryptographic generator.

Since 0.1.0.

**Parameters**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `length` | int | yes | How many random bytes to produce. |

**Resolves with**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `bytes` | string | yes | The random bytes, base64 encoded. |
| `length` | int | yes | How many bytes were produced. |

**Errors**

| Code | Meaning | What to do |
| --- | --- | --- |
| `invalid_length` | `length` must be a whole number between 1 and 1048576. | Not recoverable by retrying. |
| `unsupported_platform` | This surface has no secure random source. | Not recoverable by retrying. |

**Example: returns the requested number of bytes as base64**

```js
const result = await dsx.module.crypto.randomBytes({"length":32});
// resolves {"bytes":"3q2+7wAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA=","length":32}
```

### randomInt

`dsx.module.crypto.randomInt`

Returns a fair random whole number between min and max, both included. It avoids the bias that a simple remainder would add.

Since 0.1.0.

**Parameters**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `max` | int | yes | The largest number that can be returned. |
| `min` | int | yes | The smallest number that can be returned. |

**Resolves with**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `value` | int | yes | The random number, between min and max. |

**Errors**

| Code | Meaning | What to do |
| --- | --- | --- |
| `invalid_range` | `min` and `max` must be whole numbers with min <= max, and the range must fit in 32 bits. | Not recoverable by retrying. |
| `unsupported_platform` | This surface has no secure random source. | Not recoverable by retrying. |

**Example: returns a value inside the inclusive range**

```js
const result = await dsx.module.crypto.randomInt({"max":6,"min":1});
// resolves {"value":4}
```

**Example: a single-value range is that value**

```js
const result = await dsx.module.crypto.randomInt({"max":7,"min":7});
// resolves {"value":7}
```

### randomUUID

`dsx.module.crypto.randomUUID`

Makes a new UUID. Version 4 is fully random; version 7 starts with the time, so ids sort in creation order and suit database keys.

Since 0.1.0.

**Parameters**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `version` | int | no | The UUID version to make: 4 (random, the default) or 7 (time-sortable). |

**Resolves with**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `uuid` | string | yes | The new UUID as text. |
| `version` | int | yes | The UUID version that was made. |

**Errors**

| Code | Meaning | What to do |
| --- | --- | --- |
| `unsupported_algorithm` | Only UUID versions 4 and 7 are available. | Not recoverable by retrying. |
| `unsupported_platform` | This surface has no secure random source. | Not recoverable by retrying. |

**Example: defaults to v4**

```js
const result = await dsx.module.crypto.randomUUID({});
// resolves {"uuid":"de305d54-75b4-431b-adb2-eb6b9e546014","version":4}
```

**Example: mints a v7 whose version nibble is 7**

```js
const result = await dsx.module.crypto.randomUUID({"version":7});
// resolves {"uuid":"018f7c2e-1a2b-7c3d-8e4f-5a6b7c8d9e0f","version":7}
```

### secretKey

`dsx.module.crypto.secretKey`

Creates an AES-256 key inside the secure store and gives you a reference to it. The key itself can never be read out, which makes encrypt and decrypt safe to use from markup.

Since 0.1.0.

**Parameters**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `id` | string | no | A name for the key, so you can find it again. One is made up if you leave it out. |

**Resolves with**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `algorithm` | string | yes | The key type, aes-256-gcm. |
| `hardware` | boolean | yes | True when the key is protected by secure hardware, false when the system fell back to software storage. |
| `keyRef` | string | yes | The reference to pass to encrypt, decrypt or hmac. |
| `storage` | string | yes | Where the key is kept: secureEnclave, strongBox, keychain, keystore or memory. |

**Errors**

| Code | Meaning | What to do |
| --- | --- | --- |
| `secure_hardware_unavailable` | This device has no secure element, so the key is stored in the OS keystore instead. |  |
| `unsupported_platform` | This surface cannot store a key outside the page. | Not recoverable by retrying. |

**Example: mints a referenced key and never returns its bytes**

```js
const result = await dsx.module.crypto.secretKey({"id":"notes"});
// resolves {"algorithm":"aes-256-gcm","hardware":false,"keyRef":"dsx.key:notes","storage":"keystore"}
```

### sign

`dsx.module.crypto.sign`

Signs data with a private key, given as a stored reference or as the raw key from a store false pair. P-256 signatures are standard DER encoded, which servers expect.

Since 0.1.0.

**Parameters**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `algorithm` | string | no | The key type, ed25519 or p256, when it cannot be read from the reference. |
| `data` | string | yes | The text that will be signed. |
| `encoding` | string | no | How the input text is encoded: utf8 (the default) or base64. |
| `keyRef` | string | no | The reference to a stored private key. |
| `privateKey` | string | no | The raw private key, for a pair made with store false. |

**Resolves with**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `algorithm` | string | yes | The key type that was used. |
| `signature` | string | yes | The signature, base64 encoded, to send along with the data. |

**Errors**

| Code | Meaning | What to do |
| --- | --- | --- |
| `invalid_encoding` | `encoding` must be utf8, base64 or hex, and `data` must actually be in it. | Not recoverable by retrying. |
| `invalid_key` | Supply exactly one of `keyRef` or `privateKey`. | Not recoverable by retrying. |
| `key_not_found` | No key is stored under that reference. | Not recoverable by retrying. |
| `unsupported_algorithm` | Only ed25519 and p256 signing is available. | Not recoverable by retrying. |
| `unsupported_platform` | This surface has no way to do the requested operation. | Check dsx.has before calling, or use a platform that supports it. |

**Example: signs with a stored reference**

```js
const result = await dsx.module.crypto.sign({"data":"hello","keyRef":"dsx.key:ed25519-1"});
// resolves {"algorithm":"ed25519","signature":"3q2+7wAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA="}
```

### verify

`dsx.module.crypto.verify`

Checks a signature against a public key. A wrong signature returns valid false instead of an error.

Since 0.1.0.

**Parameters**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `algorithm` | string | no | The key type, ed25519 or p256. |
| `data` | string | yes | The data that was signed. |
| `encoding` | string | no | How the input text is encoded: utf8 (the default) or base64. |
| `keyRef` | string | no | A reference to a stored key to check against, instead of publicKey. |
| `publicKey` | string | no | The public key to check against. |
| `signature` | string | yes | The signature to check, base64 encoded. |

**Resolves with**

| Name | Type | Required | What it is |
| --- | --- | --- | --- |
| `algorithm` | string | yes | The key type that was used. |
| `valid` | boolean | yes | True when the signature matches the data and key. |

**Errors**

| Code | Meaning | What to do |
| --- | --- | --- |
| `invalid_key` | Supply exactly one of `publicKey` or `keyRef`. | Not recoverable by retrying. |
| `key_not_found` | No key is stored under that reference. | Not recoverable by retrying. |
| `unsupported_algorithm` | Only ed25519 and p256 verification is available. | Not recoverable by retrying. |
| `unsupported_platform` | This surface cannot verify signatures. | Not recoverable by retrying. |

**Example: accepts a good signature**

```js
const result = await dsx.module.crypto.verify({"algorithm":"ed25519","data":"hello","publicKey":"3q2+7wAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA=","signature":"3q2+7wAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA="});
// resolves {"algorithm":"ed25519","valid":true}
```

**Example: a forged signature is false, not an error**

```js
const result = await dsx.module.crypto.verify({"algorithm":"ed25519","data":"hello","publicKey":"3q2+7wAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA=","signature":"AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA="});
// resolves {"algorithm":"ed25519","valid":false}
```

## Configuration

| Key | Type | Default | What it does |
| --- | --- | --- | --- |
| `allow_legacy_digests` | boolean | `true` | Keep the two broken-but-still-required hash algorithms available. Turn this off for an app that must never emit one, for example under a security review that treats their presence as a finding. |
| `default_uuid_version` | number | `4` | Which UUID version dsx.module.crypto.randomUUID() mints when the caller does not ask for one. 4 is the familiar random UUID; 7 is time-sortable and is the better choice for ids your own database will index. |
| `require_secure_hardware` | boolean | `false` | Refuse to create a stored key at all when the device has no Secure Enclave or StrongBox, instead of falling back to the OS keystore. |

## Errors

| Code | Meaning | What to do |
| --- | --- | --- |
| `secure_hardware_unavailable` | This device has no secure element, so keys are stored in the OS keystore instead. |  |

## Versions

| Version | Channel | Summary |
| --- | --- | --- |
| 0.1.0 | checkpoint |  |
