---
title: Packages
description: Every package you can add to a Despia app, with what it does and where it runs.
---

A package adds a native capability to your app. Add one with `despia add`, then call it from your page or your markup.

| Package | What it does | Runs on | Actions |
| --- | --- | --- | --- |
| [ActionSheet](/packages/actionsheet) | Show the system's own action sheet and find out which option the user picked. | ios, android, web, macos | 1 |
| [Adjust](/packages/adjust) | Find out which ad or campaign brought each install, using Adjust. | ios, android, web | 1 |
| [AdMob](/packages/admob) | Show banner, interstitial, rewarded and native ads from Google AdMob. | ios, android | 4 |
| [AgeAssurance](/packages/ageassurance) | Ask the phone's operating system for the user's age range. | ios, android, web | 4 |
| [Airbridge](/packages/airbridge) | Attribute installs to ad campaigns and open deep links with Airbridge. | ios, android, web | 24 |
| [Alarms](/packages/alarms) | Set alarms and timers that ring even when the phone is on silent or locked. | ios, android, web | 12 |
| [Amplitude](/packages/amplitude) | Send your app's analytics events to Amplitude. | ios, android, web, macos | 1 |
| [Analytics](/packages/analytics) | Send user properties and events to Google Analytics for Firebase. | ios, android, web, macos | 6 |
| [Announcements](/packages/announcements) | Show announcements in your app as a dismissible banner and a What's new list. | ios, android, web, macos | 0 |
| [App](/packages/app) | The app's own identity: its links, domains, copyright and export settings. | ios | 0 |
| [AppCheck](/packages/appcheck) | Get Firebase App Check tokens so Firebase and your backend accept only your real app. | ios, android, web | 1 |
| [AppClip](/packages/appclip) | Offer a small App Clip that loads part of your app without a full install. | ios | 1 |
| [Appearance](/packages/appearance) | Let people choose light, dark or the system look for the whole app. | ios, android, web, macos | 3 |
| [AppIcon](/packages/appicon) | Let people choose the app icon shown on their home screen. | ios, android, web | 4 |
| [AppleAuth](/packages/appleauth) | Let people sign in to your app with their Apple ID. | ios, macos | 1 |
| [AppLock](/packages/applock) | Lock your app behind Face ID, Touch ID or the device passcode. | ios, android, web, macos | 0 |
| [AppRating](/packages/apprating) | Ask the system to show its in-app rating prompt. | ios, android, macos | 1 |
| [Apps](/packages/apps) | See which Despia app surfaces are on the screen right now. | web | 2 |
| [AppsFlyer](/packages/appsflyer) | Attribute installs and purchases to ad campaigns with AppsFlyer. | ios, android, web | 10 |
| [AppTracking](/packages/apptracking) | Ask the user for tracking permission and read their answer. | ios, android | 3 |
| [AppUpdate](/packages/appupdate) | Tell users when a newer version is available and take them to it. | ios, android, web | 3 |
| [AR](/packages/ar) | Run an augmented reality session on the phone camera. | ios, web | 15 |
| [SceneAR](/packages/scene-modules-ar) | Place 3D scene content on real surfaces seen through the camera. | ios, android | 0 |
| [Assistants](/packages/assistants) | Let Siri, Shortcuts, Spotlight and Gemini run actions from your app. | ios, android | 1 |
| [Audio](/packages/audio) | Play music, podcasts and audiobooks with lock screen controls and background playback. | ios, android, web, macos | 12 |
| [LegacyAudioPlayer](/packages/audioplayer) | Keeps the old audio:// player calls from version 3 pages working. | ios, android | 17 |
| [Auth](/packages/auth) | Add sign-in to your app with one set of screens and actions, whichever service holds the account. | ios, android, web, macos | 13 |
| [AuthFirebase](/packages/authfirebase) | Sign people in with Firebase Authentication using email and password, Google or Apple. | ios, android, web, macos | 0 |
| [AuthIdentity](/packages/authidentity) | Sign people in with emailed codes using your own self-hosted identity service. | ios, android, web, macos | 0 |
| [Automotive](/packages/automotive) | Run your app on cars that have Android built in, using Android Automotive OS. | android | 1 |
| [Backend](/packages/calllivekit-modules-backend) | The server side of LiveKit calls: it creates join tokens and receives LiveKit events. |  | 2 |
| [Backend](/packages/calltwilio-modules-backend) | The server half of Twilio voice calls: hands out call tokens and answers Twilio's webhooks. |  | 3 |
| [Backend](/packages/chatsendbird-modules-backend) | Run the small server relay that lets your app chat through Sendbird without exposing your keys. |  | 7 |
| [Backend](/packages/chatstream-modules-backend) | The server half of Stream chat and video that keeps your Stream secret off devices. |  | 4 |
| [Backend](/packages/files-modules-backend) | Let devices upload files straight to your own storage bucket with short-lived signed links. |  | 1 |
| [Backend](/packages/growth-modules-backend) | Receive Apple ad postbacks and mint deep links on your own server. |  | 5 |
| [Backend](/packages/integrity-modules-backend) | Server-side half of device integrity: reads and writes per-device flags that survive reinstalls. |  | 1 |
| [Backend](/packages/payments-modules-stripe-modules-backend) | The server side of Stripe: payments, checkout, Connect, Identity and Issuing. |  | 20 |
| [Backend](/packages/store-modules-backend) | The server side of App Store promotional offers. |  | 1 |
| [Background](/packages/background) | Runs your app's declared tasks in the background and tells you honestly when they ran. | ios, android, web | 5 |
| [Background Location](/packages/backgroundlocation) | Add the declarations an app needs to track location in the background. | ios | 0 |
| [Base](/packages/base) | A private on-device database for your app's own data, with documents, queries, backups and vector search. | ios, android, web, macos | 21 |
| [Biometric](/packages/biometric) | Confirm it is really the user with Face ID, Touch ID or the device passcode. | ios, android, web, macos | 1 |
| [Blocks](/packages/blocks) | Add a Notion-style editor where people write notes and documents in blocks. | android, web | 23 |
| [Bluetooth](/packages/bluetooth) | Connect your app to nearby Bluetooth Low Energy devices. | ios, android, web, macos | 16 |
| [Bluetooth](/packages/webplatform-bluetooth) | Lets your web page ask for Bluetooth on iOS by adding the permission text the system requires. | ios, macos | 0 |
| [Branch](/packages/branch) | Find out which Branch link brought each install. | ios, android, web | 1 |
| [Braze](/packages/braze) | Send events to Braze and show its push, content cards and in-app messages. | ios, android, web | 7 |
| [ScreenBrightness](/packages/brightness) | Raise or lower the screen brightness and put it back afterwards. | ios, android | 3 |
| [Browser](/packages/browser) | Open web links in the system's in-app browser tab. | ios, android, web | 1 |
| [Bugsnag](/packages/bugsnag) | Send your app's crash and error reports to your own Bugsnag project. | ios, android, web, macos | 1 |
| [Calendar](/packages/calendar) | Add events to the user's calendar and read events and reminders. | ios, android, web, macos | 18 |
| [Call](/packages/call) | Add voice and video calls that ring like real phone calls. | ios, android, web, macos | 18 |
| [CallDespia](/packages/calldespia) | Carry your app's calls over WebRTC through your own Despia Calls service. | ios, android, web, macos | 0 |
| [CallLiveKit](/packages/calllivekit) | Run your app's calls and group rooms on LiveKit. | ios, android, web, macos | 1 |
| [CallTwilio](/packages/calltwilio) | Make and receive voice calls with Twilio. | ios, android, web | 3 |
| [Camera](/packages/camera) | Capture photos from the camera in code, with no preview screen. | ios, android, web | 13 |
| [Camera](/packages/webplatform-camera) | Lets web pages inside your app use the camera with getUserMedia. | ios, macos | 0 |
| [Capture](/packages/capture) | Turn any element or screen into an image, a PDF or a screen recording. | ios, android, web, macos | 6 |
| [Car](/packages/car) | Show lists, grids and messages on the car's screen with CarPlay and Android Auto. | ios, android | 3 |
| [Cast](/packages/cast) | Let users play your app's video and audio on a TV or speaker. | ios, android, web | 12 |
| [ContentServer](/packages/cdn) | Keeps the old local content server and file store working for apps converted from the previous Despia version. | ios, android | 11 |
| [Charts](/packages/charts) | Draw line, bar, area and point charts from your data with a single chart element. | ios, android, macos | 0 |
| [Chat](/packages/chat) | Add messaging to your app with conversations, replies, attachments and typing. | ios, android, web, macos | 20 |
| [ChatDespia](/packages/chatdespia) | Run your app's chat on your own self-hosted Despia Chat service. | ios, android, web, macos | 0 |
| [ChatMLS](/packages/chatmls) | Make chat messages end-to-end encrypted so only the people in the conversation can read them. | ios, android, web, macos | 0 |
| [ChatSendbird](/packages/chatsendbird) | Run your app's chat on Sendbird. | ios, android, web, macos | 0 |
| [ChatStream](/packages/chatstream) | Run your app's chat on Stream. | ios, android, web, macos | 0 |
| [Clerk](/packages/clerk) | Add sign-in, sign-up and account screens to your app with Clerk. | ios, android, web, macos | 21 |
| [Clipboard](/packages/clipboard) | Read from and write to the system clipboard, with a way to peek without triggering the paste alert. | ios, android, web, macos | 3 |
| [Commerce](/packages/commerce) | Verify purchases and keep entitlements on your own server, with no third party in between. | ios, android, web, macos | 3 |
| [Compose](/packages/compose) | Opens the system text message or email composer with your message filled in, for the user to send. | ios, android, web, macos | 3 |
| [Connect](/packages/connect) | Put Stripe's onboarding, payouts and payments screens for connected accounts inside your platform app. | ios, android, web | 4 |
| [Consent](/packages/consent) | Ask users for tracking consent and hold back analytics events until they agree. | ios, android, web, macos | 3 |
| [Console](/packages/console) | See what your telemetry would send, written to the log with nothing leaving the device. | ios, android, web, macos | 1 |
| [Contacts](/packages/contacts) | Let users share a contact, or read and edit the address book. | ios, android, web, macos | 12 |
| [ContentSafety](/packages/contentsafety) | Detect explicit images on the device so your content rules can hold or block them. | ios, android, web, macos | 0 |
| [Converse](/packages/converse) | Hold a spoken conversation with an AI model entirely on the device, with no network. | ios, android, macos | 4 |
| [Crashlytics](/packages/crashlytics) | Report app crashes to Firebase Crashlytics. | ios, android, macos | 7 |
| [CriticalAlerts](/packages/criticalalerts) | Let urgent push notifications break through silent mode and Do Not Disturb on iPhone. | ios, macos | 0 |
| [Crypto](/packages/crypto) | Hash, sign, encrypt and generate random values with the phone's own crypto. | ios, android, web, macos | 11 |
| [CustomerIO](/packages/customerio) | Send your app's analytics events to Customer.io. | ios, android, web, macos | 1 |
| [Data](/packages/data) | Declare the data tables your packages need, once, for any database you choose. |  | 0 |
| [Datadog](/packages/datadog) | Send your app's error and event logs to Datadog through your own relay. | ios, android, web | 1 |
| [DevSettings](/packages/dev) | A hidden developer panel for switching a test build between staging and production. | ios, android, macos | 4 |
| [Device](/packages/device) | Read the device, the app's own identity, the screen, locale, battery and display capabilities. | ios, android, web, macos | 6 |
| [DeviceUsage](/packages/deviceusage) | Block chosen apps and websites for a set time, on a daily schedule, or after a daily limit is used up. | ios, android | 10 |
| [Dom](/packages/dom) | Control the web view that shows your web app: load pages, navigate, run scripts. | ios, android, web, macos | 17 |
| [Downloads](/packages/downloads) | Watch file downloads as they start, progress and finish. | ios, android, macos | 1 |
| [DSXView](/packages/dsxview) | Show a screen fetched from your server as a native view inside the app. | ios, macos | 0 |
| [DSXWebView](/packages/dsxwebview) | Show your web pages inside the app in one shared web view. | ios, macos | 0 |
| [Ecosystem](/packages/ecosystem) | Remember a value across all of a person's own devices, with no sign-in. | ios, android, web, macos | 0 |
| [Edit](/packages/edit) | Mixes an audio project down to a file, and measures loudness, peaks and silences in a file. | ios, android, web, macos | 2 |
| [ExternalApps](/packages/externalapps) | Hand a link to another app on the phone, such as Maps, Instagram or the phone dialer. | ios, android, web, macos | 1 |
| [WatchFace](/packages/face) | Show a short text and value on the watch face complication. | ios, android | 2 |
| [Files](/packages/files) | Save, read, download, upload and zip files in your app's own storage. | ios, android, web, macos | 23 |
| [FileSharing](/packages/filesharing) | Send a file to other apps through the system share sheet. | ios, android, web, macos | 1 |
| [FileUpload](/packages/fileupload) | Make file inputs in your web pages open the camera, photo library, scanner or file picker. | ios, android, macos | 2 |
| [FileViewer](/packages/fileviewer) | Preview PDFs, images and documents in a native viewer. | ios, android, web, macos | 2 |
| [Firebase](/packages/firebase) | Send push notifications to your app's users through Firebase Cloud Messaging. | ios, android, web, macos | 5 |
| [FirebasePerformance](/packages/firebaseperformance) | Measure how long key flows and network requests take with Firebase Performance Monitoring. | ios, android, web | 5 |
| [Firestore](/packages/firestore) | Store your server data in Google Cloud Firestore and get matching access rules. |  | 0 |
| [Flashlight](/packages/flashlight) | Turn the device flashlight on and off. | ios, android, web | 1 |
| [Focus](/packages/focus) | Know when the app moves to the foreground or the background. | ios, android, web, macos | 0 |
| [Fonts](/packages/font) | Use custom fonts in your app and measure text before it is drawn. | ios, android, web, macos | 3 |
| [Foundation](/packages/foundation) | The built-in set of screen building blocks every DSX app uses. | ios, android, web, macos | 0 |
| [Geo](/packages/geo) | Get the user's location, track movement and trigger geofences. | ios, android, web | 22 |
| [State](/packages/global) | Read, write and watch the app-wide shared store from your web page. | ios, android, web, macos | 4 |
| [Google](/packages/google) | Let people sign in to your app with their Google account. | ios, android, web, macos | 0 |
| [GoogleAdsConversions](/packages/googleadsconversions) | Send purchases and sign-ups to Google Ads as conversions, from your server. |  | 1 |
| [GoogleCast](/packages/googlecast) | Cast your app's media to Chromecast and other Google Cast TVs. | ios, android, web, macos | 0 |
| [Growth](/packages/growth) | Track what users do in your app and send it to the analytics tool you pick. | ios, android, web, macos | 8 |
| [LegacyGyroscope](/packages/gyroscope) | Keeps old pages that read the gyroscope and compass heading working. | ios, android | 2 |
| [Handoff](/packages/handoff) | Let people start in your app on an iPhone and continue on a Mac or iPad. | ios, macos | 3 |
| [Haptics](/packages/haptic) | Add vibration feedback to taps and results. | ios, android, web | 7 |
| [WatchHealth](/packages/health) | Read heart rate, steps, workouts and other health readings from the paired watch. | ios, android | 4 |
| [HealthKit](/packages/healthkit) | Read and write Apple Health and Android Health Connect data. | ios, android | 10 |
| [Http](/packages/server-modules-http) | Server routes for health checks, webhooks, live updates and a small notes example. |  | 7 |
| [Http](/packages/telemetry-modules-http) | Sends your app's error and crash reports to a web address you control, with no outside service. | ios, android, web, macos | 1 |
| [LegacyIAP](/packages/iap) | Keeps old v1 and v2 in-app purchase links working by answering them with the store package. | ios, android | 4 |
| [IdentityVault](/packages/identityvault) | Stores small secrets on the device in the system keychain, with an optional Face ID or fingerprint lock. | ios, android, web, macos | 3 |
| [LegacyWidgets](/packages/imagewidget) | Keep your V3 image home-screen widget working after moving your app over from V3. | ios, android | 2 |
| [IMessage](/packages/imessage) | Add an iMessage app to your product that renders your own screens inside Messages. | ios | 14 |
| [Import](/packages/import) | Use an npm package from your backend code. |  | 0 |
| [Integrity](/packages/integrity) | Prove to your server that a request comes from a genuine, unmodified copy of your app. | ios, android, web, macos | 4 |
| [LocalAI](/packages/intelligence) | Run a language model and speech-to-text directly on the user's device, with no server. | ios, android, web, macos | 29 |
| [Intents](/packages/intents) | Open Android system screens and other apps by intent, and check which apps can handle one. | ios, android, web | 3 |
| [Intercom](/packages/intercom) | Add Intercom's Messenger so users can chat with support, read help articles and track tickets. | ios, android, web | 6 |
| [Issuing](/packages/issuing) | Let people add your Stripe-issued cards to Apple Wallet or Google Wallet. | ios, android, web | 3 |
| [JsEngine](/packages/jsengine) | Run heavier page logic safely in a separate JavaScript sandbox on Android. | android | 0 |
| [KeepAwake](/packages/keepawake) | Keep the screen from dimming or locking while something on screen needs to stay visible. | ios, android, web, macos | 4 |
| [Keyboard](/packages/keyboard) | Ship your own system-wide iOS keyboard, drawn from your own layout. | ios, android | 5 |
| [Kiosk](/packages/kiosk) | Lock an Android device to your app so people cannot leave it, for shared or public devices. | android | 6 |
| [Legacy](/packages/legacy) | Keep the old window.despia calls from your V3 app working after you move to V4. | ios, android | 19 |
| [LegacyCrypto](/packages/legacycrypto) | Lets Android check the signatures on over-the-air updates that use the Ed25519 signing algorithm. | android | 0 |
| [LicenseCheck](/packages/licensecheck) | Check your app's license on launch and show a blocking screen if it was revoked. | ios, android, web, macos | 1 |
| [Lifecycle](/packages/lifecycle) | The app shell's shared lifecycle and screen-ready events. | ios, android, macos | 0 |
| [LightSensor](/packages/light) | Read the ambient light level around the device, in lux and in simple words like dark or sunlight. | android, web | 3 |
| [ActivityKit](/packages/liveactivity) | Show live progress on the iPhone Lock Screen and Dynamic Island, and as ongoing notifications on Android. | ios, android | 5 |
| [OneSignalLiveActivity](/packages/liveactivitypush) | Update a running iPhone Live Activity from your server through OneSignal. | ios | 0 |
| [LivePreview](/packages/livepreview) | Shows a live, safe, working DSX example inside a document or page. | web | 1 |
| [LegacyLocalPush](/packages/localpush) | Keeps the old local push calls working for web pages written for the previous Despia version. | ios, android | 6 |
| [LegacyLocation](/packages/legacy-modules-location) | Keeps old location tracking pages working on the new location package. | ios, android | 4 |
| [Location](/packages/webplatform-location) | Lets a web page in your app ask for the person's location through the browser's own location call. | ios, macos | 0 |
| [LoginHelper](/packages/loginhelper) | Keeps Google and Facebook sign-in links out of your web view and opens them in the system sign-in sheet. | ios, android, macos | 0 |
| [LogRocket](/packages/logrocket) | Send errors and logs to LogRocket, with optional session replay. | ios, android, web | 3 |
| [Lottie](/packages/lottie) | Play Lottie animations in your screens, such as onboarding art, empty states and success moments. | ios, android, web, macos | 0 |
| [Mac](/packages/mac) | Give your app a proper Mac window with sensible minimum size and the standard reload shortcut. | ios, macos | 0 |
| [Maps](/packages/map) | Show maps with pins, routes and your user's location. | ios, android, web, macos | 5 |
| [Mapbox](/packages/mapbox) | Draw your app's maps with Mapbox styles and tiles. | ios, android, web | 0 |
| [MapLibre](/packages/maplibre) | Draw your app's maps with the open source MapLibre renderer. | ios, android, web | 0 |
| [Math](/packages/math) | Show math formulas, written in TeX, as properly typeset equations in your app. | ios, android, web | 0 |
| [MCP](/packages/mcp) | Let AI agents call chosen actions of your app as Model Context Protocol tools. | ios, android, macos | 5 |
| [Media](/packages/media) | Let users pick, crop, save and upload photos and videos. | ios, android, web | 21 |
| [MenuBar](/packages/menubar) | A native bottom menu bar and a slide-over sidebar that your web page controls. | ios, android, web, macos | 5 |
| [Meta](/packages/meta) | Let people sign in to your iOS app with Facebook. | ios, android, web | 0 |
| [MetaAudienceNetwork](/packages/metaads) | Show full-screen Meta Audience Network ads in your app. | ios, android | 2 |
| [MetaConversions](/packages/metaconversions) | Send your app's conversion events to Meta ads from your own server. |  | 1 |
| [Microphone](/packages/microphone) | Let your web page use the microphone, with the permission text and Android grant it needs. | ios, macos | 0 |
| [Mixpanel](/packages/mixpanel) | Send your app's analytics events to Mixpanel. | ios, android, web, macos | 1 |
| [Motion](/packages/motion) | Read accelerometer, gyroscope, steps and activity from the device. | ios, android, web | 10 |
| [Mount](/packages/mount) | Places a component or a piece of markup over your screen or web page and tells you how much space it uses. | web | 4 |
| [Mux](/packages/mux) | Measure how well your videos play with Mux Data. | ios, android, web | 1 |
| [Nearby](/packages/nearby) | Connect two phones running your app directly and send them data, with no server. | ios, android | 10 |
| [Net](/packages/net) | Know what kind of connection the device has and whether your app can really reach the internet. | ios, android, web, macos | 5 |
| [NFC](/packages/nfc) | Read and write NFC tags from your app. | ios, android, web | 6 |
| [NFC](/packages/webplatform-nfc) | Adds the NFC permission text iOS needs when a page or package touches NFC. | ios | 0 |
| [Notify](/packages/notify) | Receive and show push and local notifications in your app without a third-party push SDK. | ios, android, web, macos | 20 |
| [OAuth](/packages/oauth) | Sign users in with Google, Apple, GitHub or any other OAuth provider in the system sign-in sheet. | ios, android, web, macos | 4 |
| [OneSignal](/packages/onesignal) | Send push notifications to your app's users through OneSignal. | ios, android, web, macos | 15 |
| [Orientation](/packages/orientation) | Lock or unlock the screen orientation while the app runs. | ios, android, web | 5 |
| [Passkeys](/packages/passkeys) | Sign people in with passkeys from the phone's own authenticator, with any backend. | ios, android, web, macos | 4 |
| [Pay](/packages/pay) | Take payments with the Apple Pay and Google Pay sheet. | ios, android, web, macos | 8 |
| [Payments](/packages/payments) | Take payments in your app with one set of calls, whichever payment provider you use. | ios, android, web, macos | 8 |
| [Permissions](/packages/permissions) | Find out which permissions your app build is allowed to ask for, so you can hide features it can never turn on. | ios, android, web | 1 |
| [Persona](/packages/persona) | Verify your users' identity with Persona's checks inside your app. | ios, android, web | 1 |
| [PhotoLibrary](/packages/photolibrary) | Lets your web pages pick photos from, and save images to, the user's photo library. | ios, macos | 0 |
| [Plaid](/packages/plaid) | Let users link their bank account with Plaid. | ios, android, web, macos | 2 |
| [Platform](/packages/platform) | Despia's own hosted platform backend, written in DSX, kept as a working example of a full server. | ios, macos | 0 |
| [Player](/packages/player) | Play videos and streams in your app, with offline downloads. | ios, android, web, macos | 5 |
| [Policy](/packages/policy) | Set your own rules for what users may send, and flag, hold or block anything that breaks them. | ios, android, web, macos | 2 |
| [Postgres](/packages/postgres) | Store your server data in a Postgres database with row-level security. |  | 0 |
| [PostHog](/packages/growth-modules-posthog) | Send your app's analytics events to PostHog. | ios, android, web, macos | 1 |
| [PostHog](/packages/telemetry-modules-posthog) | Sends your app's error and crash reports to PostHog. | ios, android, web, macos | 1 |
| [PreventDefault](/packages/preventdefault) | Stop iOS from scrolling the page when the keyboard opens. | ios, android, web, macos | 1 |
| [Preview](/packages/preview) | Turn a pasted web link into a preview card with title, description and picture. | ios, android, web, macos | 1 |
| [Preview](/packages/scanner-components-preview) | Show a live camera view inside your own screen that reads QR codes and barcodes. | ios, macos | 0 |
| [PrintDocuments](/packages/print) | Print a PDF or other document through the system print sheet. | ios, android, web, macos | 1 |
| [PushToTalk](/packages/ptt) | Add walkie-talkie voice channels where people hold a button to speak. | ios, android, web | 7 |
| [PullToRefresh](/packages/pulltorefresh) | Let people pull down on a web page in your app to reload it. | ios, android, web, macos | 2 |
| [PushRouting](/packages/pushrouting) | Delivers the notification a user tapped to your app's pages once they are ready. | ios, android, web, macos | 2 |
| [Pushwoosh](/packages/pushwoosh) | Send push notifications to your app's users through Pushwoosh. | ios, android, web, macos | 9 |
| [QuickActions](/packages/quickactions) | Add shortcuts to your app icon's long-press menu on the Home screen. | ios, android | 3 |
| [Record](/packages/record) | Record a voice note or audio message and get the file back, with a live level meter. | ios, android, web, macos | 10 |
| [RemoteConfig](/packages/remoteconfig) | Change app settings and switch features off without releasing a new version. | ios, android, web, macos | 7 |
| [RemoteHosts](/packages/remotehosts) | Move your app to a new domain without shipping a new app version. | ios, android, macos | 1 |
| [RevenueCat](/packages/revenuecat) | Sell subscriptions and in-app purchases with RevenueCat. | ios, android, web, macos | 24 |
| [RevenueCat](/packages/store-modules-revenuecat) | Sell subscriptions and in-app purchases with RevenueCat. | ios, android, web, macos | 24 |
| [Rive](/packages/rive) | Add interactive Rive animations that react to your app's data and send events back. | ios, android, web | 6 |
| [Routing](/packages/routing) | Keeps your app's list of screens and addresses up to date from your server, even over the air. | ios, android, web, macos | 0 |
| [RudderStack](/packages/rudderstack) | Send your app's analytics events to your RudderStack data plane. | ios, android, web, macos | 1 |
| [Scanner](/packages/scanner) | Scan QR codes, barcodes and paper documents with the camera. | ios, android, web, macos | 1 |
| [Scene](/packages/scene) | Inspect and control the 3D scenes on screen from code, markup or an AI agent. | ios, android, web, macos | 10 |
| [Scene3D](/packages/scene3d) | Show 3D models people can spin and zoom, and place them in the real world with AR. | ios, android, web | 12 |
| [ScreenShield](/packages/screenshield) | Hide your app's content in screenshots and screen recordings, and find out when someone tries. | ios, android | 0 |
| [Spotlight](/packages/search) | Make your app's content findable from the phone's own search, and open the right screen when it is tapped. | ios, android, web, macos | 4 |
| [Security](/packages/security) | Switch on app security policies such as blocking jailbroken devices and screenshots. | ios, android, macos | 0 |
| [See](/packages/see) | Describe and understand images with an AI model that runs on the device. | ios, android, web, macos | 1 |
| [Segment](/packages/segment) | Send your app's analytics events to Segment. | ios, android, web, macos | 1 |
| [Sentry](/packages/sentry) | Send your app's errors and crash reports to your own Sentry project. | ios, android, web, macos | 1 |
| [Server](/packages/server) | The backend settings for your app: sign-in, data, address and where it is deployed. |  | 0 |
| [AppSettings](/packages/settings) | Open your app's page in the system Settings. | ios, android | 9 |
| [SocialShare](/packages/share) | Let people share text, links and files from your app through the phone's share sheet. | ios, android, web, macos | 1 |
| [SharedSession](/packages/sharedsession) | Let people watch or listen together with playback in sync. | ios, android, web, macos | 5 |
| [SharePlay](/packages/shareplay) | Start shared sessions from FaceTime with SharePlay. | ios | 0 |
| [ShareExtension](/packages/sharetarget) | Lets people share text, links, photos and files into your app from the system share sheet. | ios, android, web, macos | 3 |
| [LegacySiri](/packages/siri) | Let people add a spoken Siri phrase that opens your app and tells it what to do. | ios | 1 |
| [SnapConversions](/packages/snapconversions) | Send purchases and sign-ups to Snapchat as conversions, from your server. |  | 1 |
| [Sounds](/packages/sounds) | Ship your own notification sounds with the app. | ios, macos | 0 |
| [SpeechRecognition](/packages/speechrecognition) | Turn the user's speech into text with the standard web speech API. | ios, android, web, macos | 8 |
| [SpeechSynthesis](/packages/speechsynthesis) | Speaks text aloud with the device voices, or turns text into audio files. | ios, android, web, macos | 4 |
| [Spinner](/packages/spinner) | Show or hide the page-load activity indicator. | ios, android, web, macos | 2 |
| [Splash](/packages/splash) | The launch screen shown while your app starts, with your logo and background. | ios, android, web, macos | 0 |
| [ValueStore](/packages/storage) | Save small settings and values on the device so they are still there next time the app opens. | ios, android, web, macos | 9 |
| [Store](/packages/store) | Sell subscriptions and purchases with a native paywall and one simple way to check what a user owns. | ios, android, web, macos | 17 |
| [Stream](/packages/devsettings-modules-livestream) | Watch your app's logs live from a test device on your own relay. | ios, android, web, macos | 4 |
| [Stream](/packages/stream) | Run your app's video calls on Stream. | ios, android, web, macos | 10 |
| [Stripe](/packages/stripe) | Take card, Apple Pay and bank payments with Stripe. | ios, android, web, macos | 11 |
| [Supabase](/packages/supabase) | Give every visitor an account from first launch with Supabase and keep it when they sign in. | ios, android, web, macos | 16 |
| [SwiftyGif](/packages/swiftygif) | Add the SwiftyGif library so iOS apps can play animated GIF images. | ios, android, macos | 0 |
| [SystemBars](/packages/systembars) | Control the status bar, the navigation bar and fullscreen mode from your screens. | ios, android, web | 4 |
| [TabletSupport](/packages/tabletsupport) | Make your iOS app run natively on iPad as well as iPhone. | ios | 0 |
| [TapToPay](/packages/taptopay) | Turn the phone itself into a card reader for in-person payments. | ios, android | 1 |
| [Telemetry](/packages/telemetry) | Report crashes, hangs and errors from your app to the monitoring service you choose. | ios, android, web, macos | 8 |
| [Terminal](/packages/terminal) | Take in-person card payments with Stripe card readers. | ios, android, web | 17 |
| [Terra](/packages/terra) | Pull Apple Health and wearable data into your app through Terra. | ios, android, web | 8 |
| [TikTokEvents](/packages/tiktokevents) | Report purchases and sign-ups to TikTok from your server, only for people who agreed. |  | 1 |
| [Toast](/packages/toast) | Show short messages and undo bars that disappear on their own. | ios, android, web, macos | 3 |
| [Translate](/packages/translate) | Translate text between languages, on the device first. | ios, android, web | 1 |
| [TV](/packages/tv) | Ship your app to Apple TV and Android TV with screens you write once in DSX. | ios | 0 |
| [DeviceUUID](/packages/uuid) | Gives your app a stable anonymous id for each install, with no permission prompt. | ios, android, web, macos | 1 |
| [Verification](/packages/verification) | Check who your users are with an ID document and selfie, using Stripe Identity. | ios, android, web | 1 |
| [VerticalPlayerStack](/packages/verticalplayer) | A full-screen vertical video player for short dramas, with paywalls, coins and offline downloads. | ios, android, web, macos | 12 |
| [Video](/packages/video) | A video player element you place in a screen and drive from state. | ios, macos | 0 |
| [Viewport](/packages/viewport) | Keep chat boxes and footers visible when the on-screen keyboard opens. | ios, android, web, macos | 2 |
| [Vision](/packages/vision) | Read text out of photos and scans, and track body movement from the camera, on the device. | ios, android, web | 4 |
| [Voice](/packages/voice) | Speak text aloud and list the available voices. | ios, android, web, macos | 4 |
| [Wallet](/packages/wallet) | Let people add a boarding pass, ticket or card to Apple Wallet. | ios, android, web | 1 |
| [Watch](/packages/watch) | Adds an Apple Watch and Wear OS companion to your app and lets the phone control it. | ios, android | 27 |
| [WebExtension](/packages/webextension) | Ship a Safari web extension with your app and share state and a sign-in with it. | ios, web | 7 |
| [WebSocket](/packages/websocket) | Keep a WebSocket connection open that reconnects by itself and never loses a message. | ios, android, web, macos | 6 |
| [WebView](/packages/webview) | Show any web page inside your app. | ios, android, web, macos | 0 |
| [Widgets](/packages/widget) | Put your app on the home screen and lock screen with widgets you design in DSX. | ios, android | 5 |
