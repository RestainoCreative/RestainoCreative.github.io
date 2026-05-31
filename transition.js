/* ────────────────────────────────────────────────────────────────────────
   Page-to-page "light-show curtain" transition (multi-page, full reloads).

   On an internal navigation a full-screen panel of the stage-light gradient
   sweeps IN to cover the current page, then we navigate; the destination page
   (flagged via sessionStorage) starts with the curtain already covering and
   sweeps it OUT — a continuous colored wipe that masks the hard cut.

   The arrival curtain is injected by a tiny inline <head> snippet (before
   first paint, so there's no flash); this deferred script only reveals it and
   intercepts outgoing clicks. Falls back to a normal navigation if anything
   is unsupported.
   ──────────────────────────────────────────────────────────────────────── */
(function () {
  var DUR = 480;            // keep in sync with .page-curtain transition (.48s)
  var FLAG = "pt:nav";

  /* ── Arrival: reveal the curtain the inline head snippet left covering. ── */
  var enter = window.__ptEnter;
  if (enter) {
    var revealed = false;
    var reveal = function () {
      if (revealed) return;
      revealed = true;
      // Commit the covering state for a frame, then sweep it away.
      requestAnimationFrame(function () {
        requestAnimationFrame(function () {
          enter.classList.remove("is-cover");
          enter.classList.add("is-revealing");
          setTimeout(function () {
            if (enter.parentNode) enter.parentNode.removeChild(enter);
          }, DUR + 120);
        });
      });
    };
    if (document.readyState === "complete") reveal();
    else window.addEventListener("load", reveal);
    setTimeout(reveal, 1500); // safety: never leave the page covered
  }

  /* ── Departure: cover, then navigate, on internal cross-page links. ── */
  document.addEventListener(
    "click",
    function (e) {
      if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
      var a = e.target.closest && e.target.closest("a[href]");
      if (!a || (a.target && a.target !== "_self") || a.hasAttribute("download")) return;
      var href = a.getAttribute("href") || "";
      if (!href || href.charAt(0) === "#") return; // in-page anchor
      var url;
      try { url = new URL(a.href, location.href); } catch (err) { return; }
      if (url.origin !== location.origin) return; // external / mailto / tel
      // Same document (only a hash/nothing changed) → let normal handling run.
      if (url.pathname === location.pathname && url.search === location.search) return;

      e.preventDefault();
      try { sessionStorage.setItem(FLAG, "1"); } catch (err2) {}

      var exit = document.createElement("div");
      exit.className = "page-curtain"; // starts parked off-screen left
      (document.body || document.documentElement).appendChild(exit);
      void exit.offsetWidth;            // commit the start state
      exit.classList.add("is-cover");   // sweep in to cover

      var gone = false;
      var go = function () {
        if (gone) return;
        gone = true;
        location.href = url.href;
      };
      exit.addEventListener("transitionend", go, { once: true });
      setTimeout(go, DUR + 160);        // fallback if transitionend doesn't fire
    },
    true
  );
})();
