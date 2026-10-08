// docs.js - progressive enhancement for the documentation shell. The page is fully
// usable without it (SSR markup, real anchors); this layer adds the details the
// runtime cannot express declaratively yet:
//   1. anchor ids: `doc-anchor-<slug>` class tokens promote to real element ids
//      (the web renderer emits no id attribute), scoped to the active route frame
//   2. rail scroll-spy: the "On this page" link for the section in view
//   4. cmd/ctrl+K or "/" focuses the sidebar search
//   5. rail clicks scroll in place (smooth only when motion is welcome)
//   6. Copy for AI (the page's markdown sibling) and the lazy Support widget
//      (Ask AI, Ask a human, Propose an edit, Request a feature)
// Everything visible is stock DSX; nothing here draws.
(function () {
  "use strict";

  var reduced = window.matchMedia ? window.matchMedia("(prefers-reduced-motion: reduce)") : { matches: false };

  function activeFrame() {
    var frames = document.querySelectorAll(".dsx-frame:not([inert])");
    return frames.length > 0 ? frames[frames.length - 1] : document;
  }

  function promoteAnchors() {
    var frame = activeFrame();
    document.querySelectorAll('[class*="doc-anchor-"]').forEach(function (el) {
      var inFrame = frame === document || frame.contains(el);
      if (!inFrame) { if (el.id) el.removeAttribute("id"); return; }
      var token = null;
      el.classList.forEach(function (t) { if (token === null && t.indexOf("doc-anchor-") === 0) token = t; });
      if (token !== null) el.id = token.slice("doc-anchor-".length);
    });
  }


  var spyTicking = false;
  function spy() {
    spyTicking = false;
    var frame = activeFrame();
    var root = frame === document ? document.body : frame;
    var sections = root.querySelectorAll(".doc-section[id]");
    if (sections.length === 0) return;
    var currentId = sections[0].id;
    for (var i = 0; i < sections.length; i += 1) {
      if (sections[i].getBoundingClientRect().top <= 104) currentId = sections[i].id;
    }
    // the On this page row in view is aria-current (DocShell.css draws it); the heading in view
    // is a scroll position, which no DSX binding reads yet (framework gap 22)
    root.querySelectorAll('.doc-outline a[href^="#"]').forEach(function (link) {
      var current = link.getAttribute("href").slice(1) === currentId;
      if (current) link.setAttribute("aria-current", "true");
      else link.removeAttribute("aria-current");
    });
  }
  function queueSpy() {
    if (spyTicking) return;
    spyTicking = true;
    requestAnimationFrame(spy);
  }

  document.addEventListener("click", function (event) {
    var link = event.target && event.target.closest ? event.target.closest('.doc-outline a[href^="#"]') : null;
    if (link === null) return;
    var id = (link.getAttribute("data-dsx-href") || link.getAttribute("href")).slice(1);
    var target = document.getElementById(id);
    if (target === null) return;
    event.preventDefault();
    target.scrollIntoView({ behavior: reduced.matches ? "auto" : "smooth", block: "start" });
    history.replaceState(history.state, "", "#" + id);
  });

  // A region that scrolls its overflow must be keyboard-reachable (axe
  // scrollable-region-focusable). Sweep the active frame for scrollable boxes with
  // no focusable child and make them tabbable; the shell CSS carries the ring.
  var FOCUSABLE = 'a[href], button, input, select, textarea, [tabindex]';
  function focusableScrollRegions() {
    var frame = activeFrame();
    var root = frame === document ? document.body : frame;
    root.querySelectorAll("pre, .dsx-md-table-wrap, .dsx-tab-panels").forEach(function (el) {
      if (el.hasAttribute("tabindex") || el.querySelector(FOCUSABLE) !== null) return;
      var scrollsX = el.scrollWidth > el.clientWidth + 1;
      var scrollsY = el.scrollHeight > el.clientHeight + 1;
      var style = getComputedStyle(el);
      var scrollable = /(auto|scroll)/.test(style.overflowX + " " + style.overflowY);
      if (scrollable && (scrollsX || scrollsY)) el.setAttribute("tabindex", "0");
    });
  }

  // ── the sidebar's current page: the link to this path is aria-current="page" (DocShell.css
  // draws the selection). The list's own selection= is not drawn by the SSR (framework gap).
  function markCurrentPage() {
    var path = location.pathname.replace(/\/+$/, "") || "/";
    document.querySelectorAll(".doc-nav a.dsx-pressable[href]").forEach(function (link) {
      if (link.getAttribute("href") === path) link.setAttribute("aria-current", "page");
      else link.removeAttribute("aria-current");
    });
  }
  markCurrentPage();
  window.addEventListener("popstate", markCurrentPage);

  // ── page actions: "Copy page" copies the page's markdown sibling ────────────
  // The sibling is the page's own path plus .md (/ -> /index.md), the same bytes
  // the "View as Markdown" row opens. The label confirms for two seconds.
  function mdUrl() {
    var path = location.pathname.replace(/\/+$/, "");
    return (path === "" ? "/index" : path) + ".md";
  }
  function copyText(text) {
    if (navigator.clipboard && navigator.clipboard.writeText) return navigator.clipboard.writeText(text);
    return new Promise(function (resolve, reject) {
      var area = document.createElement("textarea");
      area.value = text;
      area.setAttribute("readonly", "");
      area.style.position = "fixed";
      area.style.opacity = "0";
      document.body.appendChild(area);
      area.select();
      var ok = false;
      try { ok = document.execCommand("copy"); } catch (e) { ok = false; }
      document.body.removeChild(area);
      if (ok) resolve(); else reject(new Error("copy refused"));
    });
  }
  document.addEventListener("click", function (event) {
    var copy = event.target.closest && event.target.closest(".doc-actions-copy");
    if (copy === null || copy === undefined) return;
    fetch(mdUrl()).then(function (res) { return res.ok ? res.text() : Promise.reject(new Error(String(res.status))); })
      .then(copyText)
      .then(function () {
        var bar = document.querySelector(".doc-help .doc-actions-copy");
        if (bar === null) return;
        var label = bar.querySelector('[data-dsx-part="label"]');
        var before = label !== null ? label.textContent : "";
        if (label !== null) label.textContent = "Copied";
        setTimeout(function () { if (label !== null) label.textContent = before; }, 2000);
      })
      .catch(function () { /* nothing copied: the View as Markdown row still works */ });
  });

  // ── Ask AI: the Despia Support widget, docs mode, loaded on first use ───────
  // Origin: <meta name="despia-support-origin"> (dsx.config.json web.head), else
  // https://support.despia.com. The script loads once, on the first tap, never
  // before; <despia-support mode="docs"> mounts when the element is defined. A
  // missing script or element leaves the button inert (aria-disabled), no error face.
  var support = { state: "idle", el: null };
  function supportOrigin() {
    var meta = document.querySelector('meta[name="despia-support-origin"]');
    var origin = meta !== null ? meta.getAttribute("content") : "";
    return (origin || "https://support.despia.com").replace(/\/+$/, "");
  }
  function currentSpace() {
    var root = document.querySelector('[class*="doc-space-"]');
    var m = root !== null ? /doc-space-([a-z]+)/.exec(root.className) : null;
    return m !== null ? m[1] : "modern";
  }
  function inertAsk() {
    support.state = "unavailable";
    document.querySelectorAll('.doc-ask-btn-inline, [aria-label="Ask AI"], .doc-ask-human, .doc-propose-edit, .doc-request-feature').forEach(function (b) {
      b.setAttribute("aria-disabled", "true");
      b.setAttribute("title", "The assistant is not reachable right now");
    });
  }
  var INTENTS = [
    [".doc-ask-human", "ask-human"], [".doc-propose-edit", "propose-edit"],
    [".doc-request-feature", "request-feature"], ['.doc-ask-btn-inline, [aria-label="Ask AI"]', "ask-ai"],
  ];
  var pendingIntent = "ask-ai";
  function openWidget() {
    if (support.el === null) {
      support.el = document.createElement("despia-support");
      support.el.setAttribute("mode", "docs");
      support.el.setAttribute("origin", supportOrigin());
      document.body.appendChild(support.el);
    }
    // the conversation's context: which space and page, and what the reader asked for
    // (ask-ai, ask-human, propose-edit, request-feature). The widget uses the shared
    // despia.com session when the reader is signed in.
    support.el.setAttribute("space", currentSpace());
    support.el.setAttribute("page", location.href);
    support.el.setAttribute("markdown", location.origin + mdUrl());
    support.el.setAttribute("intent", pendingIntent);
    if (typeof support.el.open === "function") support.el.open();
    else support.el.setAttribute("open", "true");
  }
  document.addEventListener("click", function (event) {
    if (!event.target.closest) return;
    var ask = null;
    for (var i = 0; i < INTENTS.length && ask === null; i += 1) {
      var el = event.target.closest(INTENTS[i][0]);
      if (el !== null) { ask = el; pendingIntent = INTENTS[i][1]; }
    }
    if (ask === null || support.state === "unavailable") return;
    if (support.state === "ready") { openWidget(); return; }
    if (support.state === "loading") return;
    support.state = "loading";
    var script = document.createElement("script");
    script.src = supportOrigin() + "/widget.js";
    script.async = true;
    var timer = setTimeout(inertAsk, 8000);
    script.onerror = function () { clearTimeout(timer); inertAsk(); };
    script.onload = function () {
      if (!window.customElements) { clearTimeout(timer); inertAsk(); return; }
      window.customElements.whenDefined("despia-support").then(function () {
        clearTimeout(timer);
        support.state = "ready";
        openWidget();
      });
    };
    document.head.appendChild(script);
  });

  document.addEventListener("keydown", function (event) {
    var typing = event.target && (event.target.tagName === "INPUT" || event.target.tagName === "TEXTAREA" || event.target.isContentEditable);
    if ((event.key === "k" && (event.metaKey || event.ctrlKey)) || (event.key === "/" && !typing)) {
      var field = document.querySelector(".doc-sidebar input");
      if (field !== null) { event.preventDefault(); field.focus(); }
    }
  });

  var refreshQueued = false;
  function refresh() {
    refreshQueued = false;
    promoteAnchors();
    focusableScrollRegions();
    spy();
    if (location.hash.length > 1) {
      var target = document.getElementById(location.hash.slice(1));
      if (target !== null && target.getBoundingClientRect().top > window.innerHeight) {
        target.scrollIntoView({ behavior: "auto", block: "start" });
      }
    }
  }
  function queueRefresh() {
    if (refreshQueued) return;
    refreshQueued = true;
    requestAnimationFrame(refresh);
  }

  document.addEventListener("scroll", queueSpy, { passive: true, capture: true });
  window.addEventListener("popstate", queueRefresh);
  if (typeof MutationObserver !== "undefined") {
    new MutationObserver(queueRefresh).observe(document.body, { childList: true, subtree: true });
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", refresh);
  else refresh();
})();
