//
//  home.mjs - the docs home: the Despia V4 vision first, then the two routes (DSX first, Convert second).
//  The copy mirrors content-v2/index.md (the home's Markdown twin and its entry in docs-index.json).
//
import { highlightHtml, escapeHtml } from "./highlight.mjs";
import { icon } from "./icons.mjs";
import { loadPackages } from "../scripts/packages-lib.mjs";
import { iconFor } from "./packages.mjs";

export const HOME_SAMPLE = `<stack class="counter">
  <head>
    <variable as="count">return 0</variable>
    <action as="add">
      dsx.variable.count = dsx.variable.count + 1;
      await dsx.module.haptic.light();
    </action>
    <style>
      .counter { gap: 12px; padding: 32px; align-items: center; }
      .count { font-size: 48px; font-weight: 600; }
    </style>
  </head>
  <text class="count" value="{{ dsx.variable.count }}"/>
  <button label="Add one" on:tap="dsx.action.add()"/>
</stack>`;

const code = (src, lang, title) => `<figure class="code" data-lang="${lang}"><figcaption><span class="code-title">${escapeHtml(title)}</span><span class="code-lang">${lang === "dsx" ? "DSX" : "JavaScript"}</span><button class="code-copy" type="button" aria-label="Copy code">${icon("doc.on.doc")}</button></figcaption><pre><code>${highlightHtml(src, lang)}</code></pre></figure>`;

export function homePage() {
  const pk = loadPackages().packages;
  const pick = ["haptic", "appleauth", "push", "camera", "revenuecat", "biometrics", "share", "geolocation"]
    .map((c) => pk.find((p) => p.command === c || p.slug === c)).filter(Boolean).slice(0, 4);
  const tiles = pick.map((p) => `<a class="card" href="${p.url}"><span class="pk-icon${iconFor(p).brand ? " brand" : ""}" style="margin-bottom:10px">${iconFor(p).svg}</span><span class="card-title">${escapeHtml(p.title)}</span><span class="card-text">${escapeHtml(p.summary)}</span></a>`).join("");

  return `<main class="home" id="content">
<section class="hero">
  <a class="hero-eyebrow" href="/dsx"><span class="badge badge-accent">Despia V4</span>One framework for native apps</a>
  <h1>Build real native apps from one document.</h1>
  <p>Despia V4 is a framework for iOS, Android and the web. You write DSX: markup, CSS and JavaScript in one file. Native features come from packages with one API on every platform, and AI agents can read, change and check the whole app.</p>
</section>

<div class="routes">
  <a class="route route-primary" href="/dsx">
    <div class="route-head"><span class="route-icon">${icon("iphone")}</span><span class="badge badge-accent">Research preview</span></div>
    <h2>Build a native app with DSX</h2>
    <p>Start from nothing and build the whole app in DSX: screens, navigation, data and native features, for every platform at once.</p>
    <ul>
      <li>${icon("checkmark")}One document per screen: structure, style and logic together</li>
      <li>${icon("checkmark")}Native UI and native features through real SDKs</li>
      <li>${icon("checkmark")}A closed, checkable language your agent can operate</li>
    </ul>
    <span class="route-cta">Start with DSX ${icon("arrow.right")}</span>
  </a>
  <a class="route" href="/convert">
    <div class="route-head"><span class="route-icon">${icon("globe")}</span><span class="badge badge-green"><span class="dot"></span>Available today</span></div>
    <h2>Convert your web app</h2>
    <p>Already have a web app? Put it in a native iOS and Android app and call native features from the JavaScript you already write.</p>
    <ul>
      <li>${icon("checkmark")}Keep your stack: React, Next.js or plain JavaScript</li>
      <li>${icon("checkmark")}Sign in with Apple, payments, push and more</li>
      <li>${icon("checkmark")}Built and shipped to the stores from the console</li>
    </ul>
    <span class="route-cta">Convert a web app ${icon("arrow.right")}</span>
  </a>
</div>

<section class="home-section">
  <header><div><h2>One document, three languages</h2><p>A <code>.dsx</code> file holds the screen's markup, its CSS and its logic. The same document runs on iOS, Android and the web.</p></div>
  <a class="link-more" href="/dsx/documents">How documents work ${icon("arrow.right")}</a></header>
  <div class="split-feature">
    ${code(HOME_SAMPLE, "dsx", "Components/Counter.dsx")}
    <div class="points">
      <div class="point"><span class="point-icon">${icon("chevron.left.forwardslash.chevron.right")}</span><div><h3>Markup is the structure</h3><p>Elements like <code>stack</code>, <code>text</code> and <code>button</code>, composed into your own components with slots.</p></div></div>
      <div class="point"><span class="point-icon">${icon("paintbrush")}</span><div><h3>Styling is standard CSS</h3><p>Classes in a <code>&lt;style&gt;</code> sheet or a <code>style=</code> attribute. No styling attributes to learn.</p></div></div>
      <div class="point"><span class="point-icon">${icon("curlybraces")}</span><div><h3>Logic is JavaScript</h3><p>Variables, actions and <code>{{ }}</code> holes read and write state. <code>dsx.module</code> calls native code.</p></div></div>
    </div>
  </div>
</section>

<section class="home-section">
  <header><div><h2>Why Despia V4</h2><p>High level enough for fast work and for AI, without the ceiling high-level tools usually have.</p></div></header>
  <div class="pillars">
    <div class="pillar"><span class="point-icon">${icon("iphone")}</span><h3>Native, not a web view</h3><p>Real platform features through maintained native SDKs: payments, sign-in, push, camera, health and more.</p></div>
    <div class="pillar"><span class="point-icon">${icon("square.grid.2x2")}</span><h3>One API on every platform</h3><p>The same component and the same <code>dsx.module</code> call on iOS, Android and the web. Every package says where it works.</p></div>
    <div class="pillar"><span class="point-icon">${icon("sparkles")}</span><h3>Built for AI agents</h3><p>A closed grammar, a complete linter and known contracts. Agents work through the CLI and MCP, and the app checks what they change.</p></div>
  </div>
</section>

<section class="home-section">
  <header><div><h2>Native features</h2><p>Every package has one example that works in a DSX app and in a converted web app.</p></div>
  <a class="link-more" href="/packages">All packages ${icon("arrow.right")}</a></header>
  <div class="tile-row">${tiles}</div>
</section>

<section class="home-section">
  <header><div><h2>Build and ship</h2><p>From a project to the App Store and Google Play.</p></div></header>
  <div class="tile-row">
    <a class="card" href="/ship/app-store-connect"><span class="card-icon">${icon("appstore.logo")}</span><span class="card-title">App Store Connect key</span><span class="card-text">The API key Despia uses to sign and upload iOS builds.</span></a>
    <a class="card" href="/ship/google-play"><span class="card-icon">${icon("google.play.logo")}</span><span class="card-title">Google Play account</span><span class="card-text">The service account Despia uses to upload Android builds.</span></a>
    <a class="card" href="/dsx/cli"><span class="card-icon">${icon("terminal")}</span><span class="card-title">The despia CLI</span><span class="card-text">Create, run, lint, build and ship from the terminal.</span></a>
    <a class="card" href="/dsx/agents"><span class="card-icon">${icon("sparkles")}</span><span class="card-title">Use your AI agent</span><span class="card-text">Connect mcp.despia.com and install the skills.</span></a>
  </div>
</section>
</main>`;
}
