// docs.js - progressive enhancement for the documentation shell. The page is fully
// usable without it (SSR markup, real anchors); this layer adds the details the
// runtime cannot express declaratively yet:
//   1. anchor ids: `doc-anchor-<slug>` class tokens promote to real element ids
//      (the web renderer emits no id attribute), scoped to the active route frame
//   2. rail scroll-spy: the "On this page" link for the section in view
//   3. aria-current="page" on the active sidebar link (the visual state is SSR'd)
//   4. cmd/ctrl+K or "/" focuses search; ArrowUp/ArrowDown rove an accent highlight
//      over the result rows, Enter opens the highlighted (else first) hit, Escape
//      clears the query then closes the panel
//   5. rail clicks scroll in place (smooth only when motion is welcome)
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

  function markNav() {
    var path = location.pathname.replace(/\/+$/, "") || "/";
    document.querySelectorAll(".doc-nav-link").forEach(function (link) {
      var href = (link.getAttribute("data-dsx-href") || link.getAttribute("href") || "").replace(/\/+$/, "") || "/";
      if (href === path) link.setAttribute("aria-current", "page");
      else link.removeAttribute("aria-current");
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
    root.querySelectorAll('.doc-toc [data-dsx-href^="#"], .doc-toc a[href^="#"]').forEach(function (link) {
      var target = (link.getAttribute("data-dsx-href") || link.getAttribute("href")).slice(1);
      var current = target === currentId;
      link.classList.toggle("is-current", current);
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
    var link = event.target && event.target.closest ? event.target.closest('.doc-toc [data-dsx-href^="#"], .doc-toc a[href^="#"]') : null;
    if (link === null) return;
    var id = (link.getAttribute("data-dsx-href") || link.getAttribute("href")).slice(1);
    var target = document.getElementById(id);
    if (target === null) return;
    event.preventDefault();
    target.scrollIntoView({ behavior: reduced.matches ? "auto" : "smooth", block: "start" });
    history.replaceState(history.state, "", "#" + id);
  });

  function searchInput() {
    var frame = activeFrame();
    var root = frame === document ? document : frame;
    var inline = root.querySelector(".doc-search-inline input");
    if (inline !== null && inline.offsetParent !== null) return inline;
    var row = root.querySelector(".doc-search-row input");
    if (row !== null && row.offsetParent !== null) return row;
    return null;
  }
  function searchToggle() {
    var frame = activeFrame();
    var toggle = (frame === document ? document : frame).querySelector(".doc-search-toggle");
    return toggle !== null && toggle.offsetParent !== null ? toggle : null;
  }
  function searchPanel() {
    var frame = activeFrame();
    var panel = (frame === document ? document : frame).querySelector(".doc-search-panel");
    return panel !== null && panel.offsetParent !== null ? panel : null;
  }
  function panelRows(panel) {
    return Array.prototype.slice.call(panel.querySelectorAll(".dsx-pressable"));
  }

  // The roving keyboard highlight over the result rows: docs.js owns the index, the
  // shell CSS paints `.is-active` as the accent wash pill. Any query edit or refocus
  // resets it (twice: now, and again after the runtime re-renders kept rows).
  var hitIndex = -1;
  function resetHit() {
    hitIndex = -1;
    document.querySelectorAll(".doc-search-panel .is-active").forEach(function (row) {
      row.classList.remove("is-active");
    });
  }
  function paintHit(rows) {
    rows.forEach(function (row, i) { row.classList.toggle("is-active", i === hitIndex); });
    if (hitIndex >= 0 && rows[hitIndex] !== undefined) rows[hitIndex].scrollIntoView({ block: "nearest" });
  }
  document.addEventListener("input", function (event) {
    var target = event.target;
    if (target === null || !target.closest || target.closest(".doc-search-inline, .doc-search-row") === null) return;
    resetHit();
    requestAnimationFrame(resetHit);
  });
  document.addEventListener("focusin", function (event) {
    var target = event.target;
    if (target === null || !target.closest || target.closest(".doc-search-inline, .doc-search-row") === null) return;
    resetHit();
  });

  document.addEventListener("keydown", function (event) {
    var key = event.key ? event.key.toLowerCase() : "";
    var meta = event.metaKey || event.ctrlKey;
    var active = document.activeElement;
    var inField = /^(input|textarea|select)$/i.test(active ? active.tagName : "");
    var inSearch = inField && active.closest && active.closest(".doc-search-inline, .doc-search-row") !== null;
    if ((meta && key === "k") || (!meta && !inField && key === "/")) {
      var input = searchInput();
      if (input === null) {
        var toggle = searchToggle();
        if (toggle !== null) {
          toggle.click();
          requestAnimationFrame(function () {
            var opened = searchInput();
            if (opened !== null) opened.focus();
          });
          event.preventDefault();
        }
        return;
      }
      input.focus();
      input.select();
      event.preventDefault();
    } else if ((key === "arrowdown" || key === "arrowup") && inSearch) {
      var panel = searchPanel();
      if (panel === null) return;
      var rows = panelRows(panel);
      if (rows.length === 0) return;
      if (key === "arrowdown") hitIndex = hitIndex >= rows.length - 1 ? 0 : hitIndex + 1;
      else hitIndex = hitIndex <= 0 ? rows.length - 1 : hitIndex - 1;
      paintHit(rows);
      event.preventDefault();
    } else if (key === "enter" && inSearch) {
      var open = searchPanel();
      if (open === null) return;
      var hits = panelRows(open);
      if (hits.length === 0) return;
      hits[hitIndex >= 0 && hitIndex < hits.length ? hitIndex : 0].click();
      event.preventDefault();
    } else if (key === "escape") {
      if (inSearch && active.value !== "") {
        active.value = "";
        active.dispatchEvent(new Event("input", { bubbles: true }));
      } else if (inSearch) {
        // already empty: dismiss - the compact toggle closes the row, blur closes
        // the wide prompt (the shell's on:blur drops the panel)
        var compact = searchToggle();
        if (compact !== null) compact.click();
        active.blur();
        resetHit();
      } else if (searchPanel() !== null) {
        // panel left open without focus (typed, then clicked away): close it whole.
        // The compact row, when open, closes through its toggle (the shell clears the
        // query too); otherwise clear the query through any bound field - the bind
        // drives the panel, visible or not.
        var frame = activeFrame();
        var root = frame === document ? document : frame;
        var rowField = root.querySelector(".doc-search-row input");
        if (rowField !== null && rowField.offsetParent !== null) {
          var rowToggle = searchToggle();
          if (rowToggle !== null) rowToggle.click();
        } else {
          var field = root.querySelector(".doc-search-inline input, .doc-search-row input");
          if (field !== null) {
            field.value = "";
            field.dispatchEvent(new Event("input", { bubbles: true }));
          }
        }
        resetHit();
      }
    }
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

  // ── the code copy affordance ───────────────────────────────────────────────
  // Every fenced block gets a copy button: injected into the compile-time header
  // bar when one exists (.doc-codeblock / .doc-codegroup), else the bare pre is
  // wrapped in .doc-pre and the button floats on its corner (hover-reveal on fine
  // pointers, always visible on coarse - DocShell.css). Clipboard API first,
  // execCommand fallback; the icon morphs to a checkmark and the aria-label
  // announces the state change (aria-live on the button).
  var COPY_MARKUP =
    '<svg class="doc-copy-icon" viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="9" y="9" width="11" height="11" rx="2"/><path d="M5 15H4a1.8 1.8 0 0 1-1.8-1.8V4A1.8 1.8 0 0 1 4 2.2h9.2A1.8 1.8 0 0 1 15 4v1"/></svg>' +
    '<svg class="doc-copy-check" viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M4.5 12.8l5 5L19.5 6.5"/></svg>';

  function makeCopyButton() {
    var btn = document.createElement("button");
    btn.type = "button";
    btn.className = "doc-copy";
    btn.setAttribute("aria-label", "Copy code");
    btn.setAttribute("aria-live", "polite");
    btn.innerHTML = COPY_MARKUP;
    return btn;
  }

  function enhanceCode() {
    document.querySelectorAll("pre.dsx-md-code").forEach(function (pre) {
      var block = pre.closest(".doc-codeblock");
      if (block !== null) {
        var bar = block.querySelector(".doc-codebar");
        if (bar !== null && bar.querySelector(".doc-copy") === null) bar.appendChild(makeCopyButton());
        return;
      }
      var group = pre.closest(".doc-codegroup");
      if (group !== null) {
        var tabsRoot = group.querySelector(".dsx-tabs");
        if (tabsRoot !== null && tabsRoot.querySelector(":scope > .doc-copy") === null) tabsRoot.appendChild(makeCopyButton());
        return;
      }
      if (pre.parentElement !== null && pre.parentElement.classList.contains("doc-pre")) return;
      var wrap = document.createElement("div");
      wrap.className = "doc-pre";
      pre.parentNode.insertBefore(wrap, pre);
      wrap.appendChild(pre);
      wrap.appendChild(makeCopyButton());
    });
  }

  function codeTextFor(btn) {
    var scope = btn.closest(".doc-codeblock, .doc-codegroup, .doc-pre");
    if (scope === null) return null;
    var pre = scope.classList.contains("doc-codegroup")
      ? scope.querySelector(".dsx-tab-panel:not([hidden]) pre.dsx-md-code")
      : scope.querySelector("pre.dsx-md-code");
    if (pre === null) return null;
    var code = pre.querySelector("code");
    return (code !== null ? code : pre).innerText.replace(/\n$/, "");
  }

  function fallbackCopy(text) {
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
    return ok;
  }

  function writeClipboard(text, done) {
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(text).then(function () { done(true); }, function () { done(fallbackCopy(text)); });
      return;
    }
    done(fallbackCopy(text));
  }

  document.addEventListener("click", function (event) {
    var btn = event.target && event.target.closest ? event.target.closest(".doc-copy") : null;
    if (btn === null) return;
    var text = codeTextFor(btn);
    if (text === null) return;
    writeClipboard(text, function (ok) {
      if (!ok) return;
      btn.classList.add("is-copied");
      btn.setAttribute("aria-label", "Copied");
      clearTimeout(btn.__docCopyTimer);
      btn.__docCopyTimer = setTimeout(function () {
        btn.classList.remove("is-copied");
        btn.setAttribute("aria-label", "Copy code");
      }, 1800);
    });
  });

  // Content tabs (.doc-tabs / .doc-codegroup) render the tabs primitive's strip
  // horizontally at EVERY width; above the primitive's own wide breakpoint it
  // declares vertical and swaps its arrow axis, so re-declare the rendered
  // orientation and translate Left/Right (the runtime keeps Up/Down; a handled
  // event arrives defaultPrevented and is left alone).
  var tabsWide = window.matchMedia ? window.matchMedia("(min-width: 69rem)") : { matches: false };
  function levelTabStrips() {
    document.querySelectorAll(".doc-tabs .dsx-tablist, .doc-codegroup .dsx-tablist").forEach(function (strip) {
      if (strip.getAttribute("aria-orientation") !== "horizontal") strip.setAttribute("aria-orientation", "horizontal");
    });
  }
  document.addEventListener("keydown", function (event) {
    if (event.key !== "ArrowLeft" && event.key !== "ArrowRight") return;
    if (event.defaultPrevented || !tabsWide.matches) return;
    var tab = event.target && event.target.closest ? event.target.closest(".doc-tabs .dsx-tab, .doc-codegroup .dsx-tab") : null;
    if (tab === null || tab.parentElement === null) return;
    var tabs = Array.prototype.slice.call(tab.parentElement.querySelectorAll(".dsx-tab"));
    var at = tabs.indexOf(tab);
    if (at === -1) return;
    var next = event.key === "ArrowRight" ? (at + 1) % tabs.length : (at - 1 + tabs.length) % tabs.length;
    event.preventDefault();
    tabs[next].click();
    tabs[next].focus();
  });

  var refreshQueued = false;
  function refresh() {
    refreshQueued = false;
    promoteAnchors();
    markNav();
    focusableScrollRegions();
    enhanceCode();
    levelTabStrips();
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
