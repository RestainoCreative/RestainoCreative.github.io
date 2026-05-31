/* portfolio.jsx — v3
   Smooth scroll • scroll-driven FX • editorial layout • dot cursor only
*/

const { useState, useEffect, useRef, useCallback } = React;

/* ───────────────── Home content ───────────────────
   Live content loads from /content/home.json (CMS-editable). The object
   below is the built-in fallback so the page always renders, even if the
   fetch fails. `HOME` is reassigned when the JSON arrives, then App forces
   a re-render; components read HOME directly. */
const FALLBACK_HOME = {
  hero: { video: "/media/reel.mp4", poster: "/media/IMAGE1.jpg" },
  statement: [
    { text: "I strive to be at the forefront of creativity and innovation.", image: "/media/IMAGE1.jpg", align: "left" },
    { text: "To create culturally-relevant, thought-provoking activations that WOW an audience.", image: "/media/IMAGE2.jpg", align: "center" },
    { text: "...and enhance a brand's identity.", image: "/media/IMAGE3.png", align: "right" },
    { text: "This is what I do.", textRight: "And I love it.", image: "/media/IMAGE4.jpg", align: "split" },
  ],
  numbers: {
    headline: "A creative career, distilled into five digits.",
    headlineHighlight: "five digits",
    roleLines: ["3× Emmy Award Winning", "Creative Director", "Producer", "Creative Strategist", "Innovator"],
    metrics: [
      { value: 3,  suffix: "",   label: "Emmys won",                            body: "Recognition from the room I respect most.",              style: "normal" },
      { value: 99, suffix: "M+", label: "Social views",                         body: "The work travels further than the rooms it was made in.", style: "hero" },
      { value: 14, suffix: "",   label: "Years of experience",                  body: "Long enough to know what works.",                        style: "normal" },
      { value: 7,  suffix: "",   label: "Countries I have led creative in",     body: "Different rooms, same craft.",                           style: "normal" },
      { value: 0,  suffix: "",   label: "Super Bowls my favorite team has won", body: "Still optimistic. Still watching.",                      style: "accent" },
    ],
  },
  whatIDo: {
    title: "What I Do",
    items: [
      { n: "01", title: "Creative Direction", body: "I specialize in conceptualizing, directing, and executing high-impact creative across live shows, sports, concerts, and immersive experiences." },
      { n: "02", title: "Campaign Strategy",  body: "I build culturally relevant creative campaigns that extend across broadcast, social, digital, and in-person experiences." },
      { n: "03", title: "Innovation",         body: "I bridge creativity and emerging technology to develop innovative content, workflows, and experiences powered by AI." },
    ],
  },
  contact: {
    email: "jrestaino91@gmail.com",
    location: "Las Vegas, NV\nWorldwide",
    socials: [
      { label: "Instagram", url: "#" },
      { label: "LinkedIn",  url: "#" },
      { label: "Vimeo",     url: "#" },
    ],
  },
  brandLogos: [],
};
let HOME = FALLBACK_HOME;

/* ───────────────── Data ───────────────── */

const PROJECTS = [
{ id: "aurora", num: "01", title: "Aurora — A Residency in Light", client: "Independent",
  year: "2025", tags: ["Live Entertainment", "Residency", "Immersive"], swatch: "swatch-1",
  form: "Arena Residency" },
{ id: "field-of-echoes", num: "02", title: "Field of Echoes", client: "Sports Broadcast",
  year: "2024", tags: ["Sports", "Broadcast", "Stadium"], swatch: "swatch-2",
  form: "Cinematic Open" },
{ id: "hollow-city", num: "03", title: "Hollow City", client: "Cultural Institution",
  year: "2024", tags: ["Immersive", "Installation", "AR/XR"], swatch: "swatch-3",
  form: "6-Room Installation" },
{ id: "slow-cathedral", num: "04", title: "Slow Cathedral", client: "Touring Artist",
  year: "2023", tags: ["Concert", "Tour Design", "Direction"], swatch: "swatch-4",
  form: "38-City Tour" },
{ id: "signal-drift", num: "05", title: "Signal Drift", client: "Telecom",
  year: "2023", tags: ["AR/XR", "Campaign", "Innovation"], swatch: "swatch-5",
  form: "City-Scale AR" },
{ id: "the-long-take", num: "06", title: "The Long Take", client: "Fashion House",
  year: "2022", tags: ["Campaign", "Film", "Direction"], swatch: "swatch-6",
  form: "Single-Take Film" }];


const CAPABILITIES_A = [
"Creative Direction", "Live Entertainment", "Concert & Tour",
"Sports & Broadcast", "Immersive & XR", "Show Production"];

const CAPABILITIES_B = [
"Campaign Strategy", "Brand World-Building", "AR / XR / Spatial",
"Cinematic Open", "Residencies", "Creative Leadership"];


/* ───────────────── Smooth scroll (wheel-lerp, sticky-compatible) ───────────────── */

function useSmoothScroll(enabled) {
  useEffect(() => {
    if (!enabled) return;
    if (window.matchMedia('(hover: none)').matches) return; // mobile: native scroll

    let target = window.scrollY;
    let current = window.scrollY;
    let raf;
    let scheduled = false;
    let suppressNext = false;

    const maxScroll = () => document.documentElement.scrollHeight - window.innerHeight;
    const clamp = (v) => Math.max(0, Math.min(maxScroll(), v));

    const tick = () => {
      const diff = target - current;
      if (Math.abs(diff) < 0.4) {
        current = target;
        suppressNext = true;
        window.scrollTo(0, current);
        scheduled = false;
        return;
      }
      current += diff * 0.12;
      suppressNext = true;
      window.scrollTo(0, current);
      raf = requestAnimationFrame(tick);
    };

    const start = () => {
      if (!scheduled) {
        scheduled = true;
        tick();
      }
    };

    const onWheel = (e) => {
      if (window.__scrollLocked) {e.preventDefault();return;}
      if (e.ctrlKey) return; // zoom
      e.preventDefault();
      target = clamp(target + e.deltaY);
      start();
    };

    const onKey = (e) => {
      const k = e.key;
      const tag = e.target?.tagName;
      if (tag === 'INPUT' || tag === 'TEXTAREA') return;
      if (window.__scrollLocked) {
        if ([' ', 'ArrowUp', 'ArrowDown', 'PageUp', 'PageDown', 'Home', 'End'].includes(k)) e.preventDefault();
        return;
      }
      let delta = 0;
      if (k === 'ArrowDown') delta = 80;else
      if (k === 'ArrowUp') delta = -80;else
      if (k === ' ' || k === 'PageDown') delta = window.innerHeight * 0.85;else
      if (k === 'PageUp') delta = -window.innerHeight * 0.85;else
      if (k === 'Home') {e.preventDefault();target = 0;start();return;} else
      if (k === 'End') {e.preventDefault();target = maxScroll();start();return;} else
      return;
      e.preventDefault();
      target = clamp(target + delta);
      start();
    };

    const onScroll = () => {
      // If scroll fired due to our own scrollTo, ignore.
      if (suppressNext) {suppressNext = false;return;}
      // Else it's a native scroll (scrollbar drag, programmatic, etc) — sync.
      target = window.scrollY;
      current = window.scrollY;
    };

    // Expose a smooth scrollTo for anchor clicks.
    window.__smoothScrollTo = (y) => {target = clamp(y);start();};

    window.addEventListener('wheel', onWheel, { passive: false });
    window.addEventListener('keydown', onKey);
    window.addEventListener('scroll', onScroll, { passive: true });

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('wheel', onWheel);
      window.removeEventListener('keydown', onKey);
      window.removeEventListener('scroll', onScroll);
      delete window.__smoothScrollTo;
    };
  }, [enabled]);
}

/* ───────────────── Scroll-driven FX ───────────────── */

function useScrollFX() {
  useEffect(() => {
    let els = [];
    let cards = [];
    let lastY = null, lastVH = null;
    const refresh = () => {
      els = Array.from(document.querySelectorAll("[data-fx]"));
      cards = Array.from(document.querySelectorAll(".stick-card"));
      lastY = null;
    };
    refresh();
    const ro = new MutationObserver(refresh);
    ro.observe(document.body, { childList: true, subtree: true });
    const invalidate = () => { lastY = null; };
    window.addEventListener("resize", invalidate);

    let raf;
    const tick = () => {
      const vh = window.innerHeight;
      const sy = window.scrollY;
      if (sy === lastY && vh === lastVH) { raf = requestAnimationFrame(tick); return; }
      lastY = sy; lastVH = vh;

      // 1) Per-element progress for data-fx
      for (const el of els) {
        const mode = el.dataset.fx;
        let p;
        if (mode === "top") {
          // Hero etc.: progress from scrollY, not rect.top (since sticky pins r.top=0).
          p = window.scrollY / vh;
        } else {
          const r = el.getBoundingClientRect();
          p = (vh - r.top) / (vh + r.height);
        }
        if (p < 0) p = 0;
        if (p > 1) p = 1;
        el.style.setProperty("--p", p.toFixed(4));
      }

      // 2) --cover for stick-card sections: how much the NEXT section covers us
      for (const card of cards) {
        const r = card.getBoundingClientRect();
        // Toggle "entering" class while card is rising into viewport (soft top edge)
        if (r.top > 4 && r.top < vh - 40) {
          card.classList.add("is-entering");
        } else {
          card.classList.remove("is-entering");
        }
        // Find next .section sibling
        let next = card.nextElementSibling;
        while (next && !next.classList.contains("section")) next = next.nextElementSibling;
        if (!next) {card.style.setProperty("--cover", "0");continue;}
        const nr = next.getBoundingClientRect();
        let cov = (vh - nr.top) / vh;
        if (cov < 0) cov = 0;
        if (cov > 1) cov = 1;
        card.style.setProperty("--cover", cov.toFixed(4));
        if (cov > 0) card.setAttribute("data-covered", "");else
        card.removeAttribute("data-covered");
      }

      raf = requestAnimationFrame(tick);
    };
    tick();
    return () => {cancelAnimationFrame(raf);ro.disconnect();window.removeEventListener("resize", invalidate);};
  }, []);
}

/* ───────────────── Smooth-scroll-aware anchor links ───────────────── */
function useAnchorClicks() {
  useEffect(() => {
    const onClick = (e) => {
      const link = e.target.closest('a[href^="#"]');
      if (!link) return;
      const href = link.getAttribute("href");
      if (!href || href.length <= 1) return;
      const id = href.slice(1);
      if (id === "top") {
        e.preventDefault();
        if (window.__smoothScrollTo) window.__smoothScrollTo(0);else
        window.scrollTo({ top: 0 });
        return;
      }
      const el = document.getElementById(id);
      if (!el) return;
      e.preventDefault();
      // If target is inside a horizontal-scroll section, compute scrollY
      // that places its panel at the pin position.
      const panel = el.closest(".hscroll-panel");
      const hscroll = el.closest(".hscroll");
      let top;
      if (panel && hscroll) {
        const panels = hscroll.querySelectorAll(".hscroll-panel");
        const idx = Array.from(panels).indexOf(panel);
        const denom = Math.max(1, panels.length - 1);
        const scrollable = hscroll.offsetHeight - window.innerHeight;
        const hscrollTop = window.scrollY + hscroll.getBoundingClientRect().top;
        top = hscrollTop + (idx / denom) * scrollable;
      } else {
        top = window.scrollY + el.getBoundingClientRect().top;
      }
      if (window.__smoothScrollTo) window.__smoothScrollTo(top);
      else window.scrollTo({ top });
    };
    document.addEventListener("click", onClick);
    return () => document.removeEventListener("click", onClick);
  }, []);
}

/* ───────────────── Cursor (dot only) ───────────────── */

function useCursor(enabled) {
  useEffect(() => {
    if (!enabled) {document.body.classList.remove("custom-cursor");return;}
    document.body.classList.add("custom-cursor");

    const onMove = (e) => {
      const r = document.documentElement.style;
      r.setProperty("--mx", e.clientX + "px");
      r.setProperty("--my", e.clientY + "px");
      r.setProperty("--cx", e.clientX + "px");
      r.setProperty("--cy", e.clientY + "px");
    };
    const onLeave = () => document.querySelector(".cursor-dot")?.classList.add("is-hidden");
    const onEnter = () => document.querySelector(".cursor-dot")?.classList.remove("is-hidden");
    window.addEventListener("mousemove", onMove);
    window.addEventListener("mouseleave", onLeave);
    window.addEventListener("mouseenter", onEnter);
    return () => {
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseleave", onLeave);
      window.removeEventListener("mouseenter", onEnter);
      document.body.classList.remove("custom-cursor");
    };
  }, [enabled]);
}

function useHoverDot() {
  useEffect(() => {
    const onOver = (e) => {
      const el = e.target.closest("a, button, .reel-item, .nav-link, .rail-item, [data-hover]");
      if (el) document.querySelector(".cursor-dot")?.classList.add("is-hover");
    };
    const onOut = (e) => {
      const next = e.relatedTarget;
      if (!next || !next.closest?.("a, button, .reel-item, .nav-link, .rail-item, [data-hover]")) {
        document.querySelector(".cursor-dot")?.classList.remove("is-hover");
      }
    };
    document.addEventListener("mouseover", onOver);
    document.addEventListener("mouseout", onOut);
    return () => {
      document.removeEventListener("mouseover", onOver);
      document.removeEventListener("mouseout", onOut);
    };
  }, []);
}

/* ───────────────── Name morph (hero → nav) ─────────────────
   The big bold "Justin Restaino" starts centered + scaled-up in the hero.
   As you scroll through the first viewport, it shrinks and translates to
   the top-left nav-bar position, where it stays as a permanent home link. */
function useNameMorph() {
  useEffect(() => {
    const name = document.getElementById("name-morph");
    const sub = document.getElementById("name-sub");
    if (!name) return;
    let raf;
    let lastY = null, lastVH = null;
    const invalidate = () => { lastY = null; };
    const ti1 = setTimeout(invalidate, 250);   // recompute after first paint
    const ti2 = setTimeout(invalidate, 900);   // and after fonts settle (width shifts)
    if (document.fonts && document.fonts.ready) document.fonts.ready.then(invalidate);
    window.addEventListener("resize", invalidate);
    const S = 12;       // scale factor at hero state (bigger = more dramatic hero)
    const navY = 22;    // final top position
    const subGap = 28;  // px gap below name's bottom edge (display size)
    const tick = () => {
      const vh = window.innerHeight;
      const sy = window.scrollY;
      if (sy === lastY && vh === lastVH) { raf = requestAnimationFrame(tick); return; }
      lastY = sy; lastVH = vh;
      const p = Math.min(1, Math.max(0, sy / vh));
      const morph = 1 - p; // 1 = hero (big centered), 0 = nav (small top center)
      const w = name.offsetWidth;
      const h = name.offsetHeight;
      const scale = 1 + (S - 1) * morph;
      const tx = -w * scale / 2;
      const heroTy = vh / 2 - navY - h * S / 2;
      const ty = heroTy * morph;
      name.style.transform = `translate(${tx}px, ${ty}px) scale(${scale})`;
      name.style.setProperty("--morph", morph.toFixed(4));
      // Expose morph globally so the hero gack marks can fade with the hero.
      document.body.style.setProperty("--hero-morph", morph.toFixed(4));

      // Sub is a SEPARATE fixed element so it doesn't scale with the name.
      // It tracks the visual bottom of the name (so it moves up with it as
      // morph decreases), and its opacity fades with morph.
      if (sub) {
        const nameBottom = navY + ty + h * scale;
        sub.style.top = (nameBottom + subGap) + "px";
        sub.style.opacity = morph.toFixed(4);
      }
      raf = requestAnimationFrame(tick);
    };
    tick();
    return () => { cancelAnimationFrame(raf); clearTimeout(ti1); clearTimeout(ti2); window.removeEventListener("resize", invalidate); };
  }, []);
}

/* ───────────────── Image→Numbers black-circle transition ─────────────────
   After the last .si-card (IMAGE4) is fully revealed, a black circle grows
   from the viewport center to cover IMAGE4. Numbers then blur-fades on
   underneath. The mask is fixed at z-5 — above the si-cards (z-2..5, same
   z + later source wins) and below Numbers (z-6) so Numbers paints over it
   once it fades in. */
/* ───────────────── Statement-image card progress ─────────────────
   For each .si-card sticky section, writes --p (0 at pin start, 1 at pin
   end) based on scrollY vs the card's natural offsetTop. CSS uses --p
   to fade the text out + unblur the background image as you scroll. */
function useStatementImageCards() {
  useEffect(() => {
    const cards = Array.from(document.querySelectorAll(".si-card"));
    if (!cards.length) return;
    // Cache each card's natural offsetTop. Sticky-pinned elements in Chrome
    // can return their visually-pinned position via offsetTop (matching
    // scrollY), which would zero out (scrollY - offsetTop) and freeze --p.
    // Measure positions while scrolled to top + on resize so cached values
    // reflect the natural document layout, not the sticky-pinned state.
    let positions = [];
    let lastY = null, lastVH = null;
    const measure = () => {
      if (window.scrollY > 4) return; // only re-measure when no sticky is active
      positions = cards.map((el) => {
        const g = {
          x: el.querySelector(".gk-x"),
          scrubVal: el.querySelector(".gk-scrub-val"),
          dimVal: el.querySelector(".gk-dim-val"),
        };
        if (g.dimVal) g.dimVal.textContent = window.innerWidth + " PX";
        return { el, top: el.offsetTop, h: el.offsetHeight, g, lastP: -1 };
      });
      lastY = null; // force the gated tick to recompute after a re-measure
    };
    measure();                          // initial measurement
    const t1 = setTimeout(measure, 200); // after first paint
    const t2 = setTimeout(measure, 800); // after fonts / images settle
    window.addEventListener("resize", measure);

    let raf;
    const tick = () => {
      const sy = window.scrollY, ih = window.innerHeight;
      // Idle frames are free: only recompute when the scroll position or
      // viewport actually changed (re-measure/resize reset lastY).
      if (sy === lastY && ih === lastVH) { raf = requestAnimationFrame(tick); return; }
      lastY = sy; lastVH = ih;
      for (const pos of positions) {
        let p = pos.h > 0 ? (window.scrollY - pos.top) / pos.h : 0;
        if (p < 0) p = 0;
        if (p > 1) p = 1;
        pos.el.style.setProperty("--p", p.toFixed(4));
        // Entrance ease: 0 when the card is one screen below the pin, 1 once it
        // locks in — eased (easeOutCubic) so the incoming card settles in
        // smoothly instead of hard-cutting. Drives a brightness + lift settle.
        const vh = window.innerHeight;
        let e = vh > 0 ? (window.scrollY - pos.top + vh) / vh : 1;
        if (e < 0) e = 0;
        if (e > 1) e = 1;
        e = 1 - Math.pow(1 - e, 3);
        pos.el.style.setProperty("--enter", e.toFixed(4));
        // Live gack readouts — only rewrite when the value visibly changed.
        const r = Math.round(p * 1000);
        if (r !== pos.lastP) {
          pos.lastP = r;
          const s = Math.min(1, p / 0.6); // sweep completes over the active pin window
          if (pos.g.x) pos.g.x.textContent = s.toFixed(3);
          if (pos.g.scrubVal) pos.g.scrubVal.textContent = Math.round(s * 100) + "%";
        }
      }
      raf = requestAnimationFrame(tick);
    };
    tick();
    return () => {
      cancelAnimationFrame(raf);
      clearTimeout(t1);
      clearTimeout(t2);
      window.removeEventListener("resize", measure);
    };
  }, []);
}

/* ───────────────── Numbers scroll progress ─────────────────
   Writes --p (0 at pin start → 1 at pin end) on the Numbers section based
   on scrollY vs the section's cached natural offsetTop. Same pattern as
   useStatementImageCards — needed because the section is sticky-pinned
   for its full height, which makes getBoundingClientRect().top freeze
   at 0 during the pin (and the generic data-fx hook would zero out). */
function useNumbersProgress() {
  useEffect(() => {
    const el = document.getElementById("numbers");
    if (!el) return;
    let pos = null;
    let lastY = null, lastVH = null;
    const measure = () => {
      if (window.scrollY > 4) return;
      pos = { top: el.offsetTop, h: el.offsetHeight };
      lastY = null;
    };
    measure();
    const t1 = setTimeout(measure, 200);
    const t2 = setTimeout(measure, 800);
    window.addEventListener("resize", measure);

    let raf;
    const tick = () => {
      const sy = window.scrollY, ih = window.innerHeight;
      if (sy === lastY && ih === lastVH) { raf = requestAnimationFrame(tick); return; }
      lastY = sy; lastVH = ih;
      if (pos && pos.h > 0) {
        let p = (window.scrollY - pos.top) / (pos.h - window.innerHeight);
        if (p < 0) p = 0;
        if (p > 1) p = 1;
        el.style.setProperty("--p", p.toFixed(4));
      }
      raf = requestAnimationFrame(tick);
    };
    tick();
    return () => {
      cancelAnimationFrame(raf);
      clearTimeout(t1);
      clearTimeout(t2);
      window.removeEventListener("resize", measure);
    };
  }, []);
}

/* ───────────────── Count-up ───────────────── */
function useCountUp(target, duration = 1400, decimals = 0) {
  const [val, setVal] = useState(decimals > 0 ? (0).toFixed(decimals) : 0);
  const ref = useRef(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    let raf;
    const io = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        const start = performance.now();
        const t = (now) => {
          const elapsed = now - start;
          const p = Math.min(1, elapsed / duration);
          const eased = 1 - Math.pow(1 - p, 3);
          const v = target * eased;
          setVal(decimals > 0 ? v.toFixed(decimals) : Math.round(v));
          if (p < 1) raf = requestAnimationFrame(t);
        };
        raf = requestAnimationFrame(t);
        io.unobserve(el);
      }
    }, { threshold: 0.35 });
    io.observe(el);
    return () => { io.disconnect(); if (raf) cancelAnimationFrame(raf); };
  }, [target, duration, decimals]);
  return [val, ref];
}

/* ───────────────── Stage Section (pinned + scroll-driven content) ───────────────── */

function StageSection({ children, budget = 200, id }) {
  const ref = useRef(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    let raf;
    const tick = () => {
      const r = el.getBoundingClientRect();
      const scrollable = el.offsetHeight - window.innerHeight;
      let p = scrollable > 0 ? -r.top / scrollable : 0;
      if (p < 0) p = 0;
      if (p > 1) p = 1;
      el.style.setProperty("--p", p.toFixed(4));
      raf = requestAnimationFrame(tick);
    };
    tick();
    return () => cancelAnimationFrame(raf);
  }, []);
  return (
    <div className="stage" id={id} ref={ref} style={{ height: budget + "vh" }}>
      <div className="stage-pin">{children}</div>
    </div>
  );
}

/* Scramble-count number that reads --p from the nearest .stage ancestor */
function ScrambleNumber({ target, decimals = 0, unit }) {
  const ref = useRef(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const stage = el.closest(".stage");
    let raf;
    const tick = () => {
      const p = stage ? parseFloat(getComputedStyle(stage).getPropertyValue("--p")) || 0 : 0;
      const eff = Math.min(1, p * 1.8);
      if (eff < 0.85) {
        const s = String(decimals > 0 ? target.toFixed(decimals) : target);
        const scrambled = s.split("").map((c) => {
          if (c === "." || c === " ") return c;
          return Math.floor(Math.random() * 10);
        }).join("");
        el.textContent = scrambled;
      } else {
        const v = target * eff;
        el.textContent = decimals > 0 ? v.toFixed(decimals) : String(Math.round(v));
      }
      raf = requestAnimationFrame(tick);
    };
    tick();
    return () => cancelAnimationFrame(raf);
  }, [target, decimals]);
  return (
    <span>
      <span ref={ref}>0</span>
      {unit && <span className="unit">{unit}</span>}
    </span>
  );
}

/* Letter-decode text — chars cycle random glyphs until --p reaches their position */
function ScrambleText({ text, className }) {
  const ref = useRef(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const stage = el.closest(".stage");
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ#@$%&*/?!";
    let raf;
    const tick = () => {
      const p = stage ? parseFloat(getComputedStyle(stage).getPropertyValue("--p")) || 0 : 0;
      const eff = Math.min(1, p * 1.6);
      const reveal = Math.floor(text.length * eff);
      const out = text.split("").map((c, i) => {
        if (i < reveal) return c;
        if (c === " ") return " ";
        if (c.match(/[.,'——]/)) return c;
        return chars[Math.floor(Math.random() * chars.length)];
      }).join("");
      el.textContent = out;
      raf = requestAnimationFrame(tick);
    };
    tick();
    return () => cancelAnimationFrame(raf);
  }, [text]);
  return <span ref={ref} className={className}>{text}</span>;
}

/* Word-explode wrapper — each word gets a deterministic random offset+rotation */
function Explode({ text, className }) {
  const words = text.split(/(\s+)/);
  let seed = 0;
  return (
    <span className={(className || "") + " exp"}>
      {words.map((w, i) => {
        if (/^\s+$/.test(w)) return <React.Fragment key={i}>{w}</React.Fragment>;
        seed = (seed * 9301 + 49297) % 233280;
        const r1 = (seed / 233280) - 0.5;
        seed = (seed * 9301 + 49297) % 233280;
        const r2 = (seed / 233280) - 0.5;
        seed = (seed * 9301 + 49297) % 233280;
        const r3 = (seed / 233280) - 0.5;
        const style = {
          "--dx": (r1 * 1400) + "px",
          "--dy": (r2 * 700) + "px",
          "--dr": (r3 * 90) + "deg",
        };
        return <span key={i} className="exp-word" style={style}>{w}</span>;
      })}
    </span>
  );
}

/* ───────────────── Reveals ───────────────── */

function HorizontalSection({ children }) {
  const sectionRef = useRef(null);
  const trackRef = useRef(null);
  const childrenArr = React.Children.toArray(children);
  const numPanels = childrenArr.length;

  useEffect(() => {
    const section = sectionRef.current;
    const track = trackRef.current;
    if (!section || !track) return;
    let raf;
    const tick = () => {
      const r = section.getBoundingClientRect();
      const scrollable = section.offsetHeight - window.innerHeight;
      let p = 0;
      if (scrollable > 0) {
        p = -r.top / scrollable;
        if (p < 0) p = 0;
        if (p > 1) p = 1;
      }
      const trackTravel = track.scrollWidth - window.innerWidth;
      track.style.transform = `translate3d(${(-p * trackTravel).toFixed(2)}px, 0, 0)`;
      raf = requestAnimationFrame(tick);
    };
    tick();
    return () => cancelAnimationFrame(raf);
  }, []);

  return (
    <section
      className="hscroll"
      ref={sectionRef}
      style={{ height: numPanels * 100 + "vh" }}>
      <div className="hscroll-pin">
        <div className="hscroll-track" ref={trackRef}>
          {childrenArr.map((child, i) => (
            <div className="hscroll-panel" key={i} data-panel-idx={i}>
              {child}
            </div>
          ))}
        </div>
        <div className="hscroll-progress" aria-hidden="true">
          <span>{numPanels} pages ✦ scroll →</span>
        </div>
      </div>
    </section>
  );
}

/* ───────────────── Reveals ───────────────── */

function useReveal() {
  useEffect(() => {
    const select = () => document.querySelectorAll(".reveal, .mask-line, .reveal-name, .reveal-headline");
    const io = new IntersectionObserver(
      (entries) => entries.forEach((e) => {
        if (e.isIntersecting) {e.target.classList.add("is-in");io.unobserve(e.target);}
      }),
      { threshold: 0.12, rootMargin: "0px 0px -8% 0px" }
    );
    select().forEach((el) => io.observe(el));
    const init = setTimeout(() => {
      select().forEach((el) => {
        const r = el.getBoundingClientRect();
        if (r.top < window.innerHeight && r.bottom > 0) {
          el.classList.add("is-in");
          io.unobserve(el);
        }
      });
    }, 80);
    return () => {clearTimeout(init);io.disconnect();};
  }, []);
}

/* ───────────────── Nav ───────────────── */

const NAV_ITEMS = [
{ idx: "01", label: "Home", href: "index.html" },
{ idx: "02", label: "Work", href: "work.html" },
{ idx: "03", label: "About Me", href: "about.html" }];


function ShutterLink({ idx, label, href }) {
  return (
    <a href={href} className="nav-link" data-hover>
      <span className="idx">{idx}</span>
      <span className="lbl"><span className="lbl-inner" data-text={label}>{label}</span></span>
    </a>);

}

function Nav() {
  const [hidden, setHidden] = useState(false);
  const last = useRef(0);
  useEffect(() => {
    const on = () => {
      const y = window.scrollY;
      setHidden(y > last.current && y > 200);
      document.body.classList.toggle("nav-solid", y > 80);
      last.current = y;
    };
    window.addEventListener("scroll", on, { passive: true });
    return () => window.removeEventListener("scroll", on);
  }, []);
  return (
    <nav className={"nav " + (hidden ? "hide" : "")}>
      <div className="nav-links">
        {NAV_ITEMS.map((it) => <ShutterLink key={it.idx} {...it} />)}
      </div>
    </nav>);

}

function Rail({ activeId }) {
  return (
    <div className="rail">
      {NAV_ITEMS.map((it) =>
      <a key={it.idx}
      className={"rail-item " + (activeId === it.href.slice(1) ? "active" : "")}
      href={it.href} data-hover>
          <span className="bar"></span>
          <span>{it.idx} {it.label}</span>
        </a>
      )}
    </div>);

}

/* ───────────────── Reel Backdrop (hero) + Modal ───────────────── */

function HeroReelVideo() {
  // React sometimes drops the `muted` attribute before the browser checks it,
  // which blocks autoplay. Set it imperatively and call .play() ourselves.
  const ref = useRef(null);
  useEffect(() => {
    const v = ref.current;
    if (!v) return;
    v.muted = true;
    v.defaultMuted = true;
    const tryPlay = () => v.play().catch((err) => console.warn("Hero reel autoplay blocked:", err));
    tryPlay();
    const onCanPlay = () => tryPlay();
    v.addEventListener("canplay", onCanPlay);
    return () => v.removeEventListener("canplay", onCanPlay);
  }, []);
  return (
    <video
      ref={ref}
      className="reel-video"
      src={(HOME.hero && HOME.hero.loop) || "/media/reel-hero.mp4"}
      loop
      muted
      autoPlay
      playsInline
      preload="auto" />
  );
}

function ReelBackdrop() {
  // Two layers: blurred (default visible) + sharp (revealed by cursor radial mask).
  // Plus a "play reel" button overlay.
  return (
    <div className="reel-bd" data-hover aria-hidden="true">
      <div className="reel-bd-blur">
        <div className="reel-stage">
          <HeroReelVideo />
        </div>
      </div>
      <div className="reel-bd-sharp">
        <div className="reel-stage sharp">
          <HeroReelVideo />
        </div>
      </div>
      <div className="reel-bd-vignette"></div>
    </div>);

}

function ReelModal({ open, onClose }) {
  const videoRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(false);
  const [volume, setVolume] = useState(1);

  useEffect(() => {
    if (!open) return;
    window.__scrollLocked = true;
    document.body.style.overflow = "hidden";
    const onKey = (e) => { if (e.key === "Escape") onClose(); };
    const onWheelBlock = (e) => e.preventDefault();
    const onTouchBlock = (e) => e.preventDefault();
    document.addEventListener("keydown", onKey);
    window.addEventListener("wheel", onWheelBlock, { passive: false });
    window.addEventListener("touchmove", onTouchBlock, { passive: false });
    const v = videoRef.current;
    if (v) {
      try { v.currentTime = 0; } catch (e) {}
      v.muted = false;
      v.volume = volume;
      const p = v.play();
      if (p && p.catch) p.catch(() => {
        v.muted = true; v.play().catch(() => {});
        setIsMuted(true);
      });
      setIsPlaying(true);
      setIsMuted(v.muted);
    }
    return () => {
      window.__scrollLocked = false;
      document.body.style.overflow = "";
      document.removeEventListener("keydown", onKey);
      window.removeEventListener("wheel", onWheelBlock);
      window.removeEventListener("touchmove", onTouchBlock);
      if (videoRef.current) { videoRef.current.pause(); videoRef.current.muted = true; }
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, onClose]);

  const togglePlay = () => {
    const v = videoRef.current;
    if (!v) return;
    if (v.paused) { v.play().catch(() => {}); setIsPlaying(true); }
    else { v.pause(); setIsPlaying(false); }
  };
  const toggleMute = () => {
    const v = videoRef.current;
    if (!v) return;
    v.muted = !v.muted;
    setIsMuted(v.muted);
  };
  const onVolumeChange = (e) => {
    const v = videoRef.current;
    const nv = parseFloat(e.target.value);
    setVolume(nv);
    if (v) {
      v.volume = nv;
      if (nv > 0 && v.muted) { v.muted = false; setIsMuted(false); }
    }
  };

  if (!open) return null;

  return (
    <div className="reel-modal is-on" onClick={onClose}>
      <div className="reel-modal-frame" onClick={(e) => e.stopPropagation()}>
        <div className="reel-stage sharp">
          <video ref={videoRef} className="reel-video" src={HOME.hero.video} playsInline preload="auto" />
        </div>

        <div className="reel-modal-controls" onClick={(e) => e.stopPropagation()}>
          <button className="reel-ctl-btn" onClick={togglePlay} data-hover aria-label={isPlaying ? "Pause" : "Play"}>
            {isPlaying ? (
              <svg width="14" height="14" viewBox="0 0 14 14" aria-hidden="true">
                <rect x="3" y="2" width="3" height="10" fill="currentColor" />
                <rect x="8" y="2" width="3" height="10" fill="currentColor" />
              </svg>
            ) : (
              <svg width="14" height="14" viewBox="0 0 14 14" aria-hidden="true">
                <polygon points="3,2 12,7 3,12" fill="currentColor" />
              </svg>
            )}
          </button>
          <button className="reel-ctl-btn" onClick={toggleMute} data-hover aria-label={isMuted ? "Unmute" : "Mute"}>
            {isMuted ? (
              <svg width="18" height="14" viewBox="0 0 18 14" aria-hidden="true">
                <polygon points="1,5 4,5 8,2 8,12 4,9 1,9" fill="currentColor" />
                <line x1="11" y1="4" x2="17" y2="10" stroke="currentColor" strokeWidth="1.4" />
                <line x1="17" y1="4" x2="11" y2="10" stroke="currentColor" strokeWidth="1.4" />
              </svg>
            ) : (
              <svg width="18" height="14" viewBox="0 0 18 14" aria-hidden="true">
                <polygon points="1,5 4,5 8,2 8,12 4,9 1,9" fill="currentColor" />
                <path d="M11 4 Q14 7 11 10" stroke="currentColor" strokeWidth="1.2" fill="none" />
                <path d="M13 2 Q17 7 13 12" stroke="currentColor" strokeWidth="1.2" fill="none" />
              </svg>
            )}
          </button>
          <input
            type="range"
            min="0"
            max="1"
            step="0.01"
            value={isMuted ? 0 : volume}
            onChange={onVolumeChange}
            className="reel-ctl-volume"
            data-hover
            aria-label="Volume" />
        </div>

        <button className="reel-modal-close" onClick={onClose} data-hover aria-label="Close">
          <svg width="14" height="14" viewBox="0 0 14 14" aria-hidden="true">
            <line x1="2" y1="2" x2="12" y2="12" stroke="currentColor" strokeWidth="1.5" />
            <line x1="12" y1="2" x2="2" y2="12" stroke="currentColor" strokeWidth="1.5" />
          </svg>
        </button>
      </div>
    </div>);

}

/* ───────────────── Hero ───────────────── */

function Hero({ onPlayReel }) {
  return (
    <section className="hero section" id="top" data-fx="top">
      <div className="hero-stage" onClick={onPlayReel}>
        <ReelBackdrop />
        <button
          className="reel-cta"
          onClick={(e) => { e.stopPropagation(); onPlayReel(); }}
          data-hover>
          Click to see reel
        </button>
      </div>
    </section>);

}

/* ───────────────── Statement ───────────────── */

/* Splits a string into word spans for the staggered, word-by-word reveal.
   Each word carries a --word-idx so CSS can cascade the reveal left→right.
   The whole text is rendered with the animated "light show" gradient
   (see .si-word in CSS). baseIdx lets multi-line cards keep one continuous
   reveal sequence across lines. */
function RevealText({ text, baseIdx = 0 }) {
  // *important* segments render as "key" words (light-show gradient + bold);
  // every other word stays clean white. Asterisks toggle the key state.
  const words = [];
  String(text).split("*").forEach((seg, si) => {
    const isKey = si % 2 === 1;
    seg.split(" ").forEach((w) => { if (w.length) words.push({ w, isKey }); });
  });
  return words.map((it, i) => (
    <React.Fragment key={i}>
      <span className={it.isKey ? "si-word si-key" : "si-word"} style={{ "--word-idx": baseIdx + i }}>{it.w}</span>
      {i < words.length - 1 ? " " : null}
    </React.Fragment>
  ));
}

/* Print-registration "gack" — technical garnish framing each statement card:
   corner crop marks, registration targets (⊕), a reticle that sweeps with
   scroll, a dimension line, and live coordinate / scrub readouts. Everything
   inherits the card's --p (written by useStatementImageCards), so the marks and
   numbers react to scroll. Sits above the photo (z-2) but below the headline. */
function Gack({ idx, total }) {
  const pad = (x) => String(x).padStart(2, "0");
  const y = (0.25 + idx * 0.137).toFixed(3); // stable per-card pseudo coordinate
  return (
    <div className="si-gack" aria-hidden="true">
      <span className="gk-corner gk-tl"></span>
      <span className="gk-corner gk-tr"></span>
      <span className="gk-corner gk-bl"></span>
      <span className="gk-corner gk-br"></span>
      <span className="gk-reg gk-reg-a"></span>
      <span className="gk-reg gk-reg-b"></span>
      <span className="gk-index">STMT&nbsp;{pad(idx + 1)}<i>/{pad(total)}</i></span>
      <span className="gk-coord">X<b className="gk-x">0.000</b>Y<b>{y}</b></span>
      <span className="gk-dim"><i></i><b className="gk-dim-val">—</b><i></i></span>
      <span className="gk-scan"><i className="gk-reticle"></i></span>
      <span className="gk-scrub"><i className="gk-scrub-fill"></i><b className="gk-scrub-val">0%</b></span>
    </div>
  );
}

/* Combined text-over-blurred-image card.
   As you scroll: (1) the statement reveals word-by-word in the colorful
   light-show gradient over a blurred B&W photo, (2) the photo sharpens
   AND blooms from black-and-white into full color, (3) the text fades
   out so the color photo is the closing beat. Driven by --p (written by
   useStatementImageCards). The next card overtakes from below via the
   standard sticky page-turn. */
function StatementImageCard({ src, align = "left", text, idx = 0, total = 1 }) {
  return (
    <section className="si-card section stick">
      <div
        className="si-image"
        style={{ backgroundImage: `url(${src})` }}
        aria-hidden="true">
      </div>
      <div className="si-vignette" aria-hidden="true"></div>
      <Gack idx={idx} total={total} />
      <div className="container">
        <div className={"si-text stmt-" + align}>
          <RevealText text={text} />
        </div>
      </div>
    </section>);
}

function StatementImageCardSplit({ src, left, right, idx = 0, total = 1 }) {
  const leftCount = left.replace(/\*/g, "").trim().split(/\s+/).filter(Boolean).length;
  return (
    <section className="si-card section stick">
      <div
        className="si-image"
        style={{ backgroundImage: `url(${src})` }}
        aria-hidden="true">
      </div>
      <div className="si-vignette" aria-hidden="true"></div>
      <Gack idx={idx} total={total} />
      <div className="container">
        <div className="si-text si-split">
          <div className="stmt-split-line stmt-left"><RevealText text={left} baseIdx={0} /></div>
          <div className="stmt-split-line stmt-right"><RevealText text={right} baseIdx={leftCount} /></div>
        </div>
      </div>
    </section>);
}

function StatementSection() {
  const cards = (HOME.statement && HOME.statement.length) ? HOME.statement : FALLBACK_HOME.statement;
  return (
    <React.Fragment>
      {cards.map((c, i) =>
        c.align === "split"
          ? <StatementImageCardSplit key={i} src={c.image} left={c.text} right={c.textRight} idx={i} total={cards.length} />
          : <StatementImageCard key={i} src={c.image} align={c.align || "left"} text={c.text} idx={i} total={cards.length} />
      )}
    </React.Fragment>);

}

/* ───────────────── Marquee (two rows) ───────────────── */

function CapabilitiesDivider() {
  const a = [...CAPABILITIES_A, ...CAPABILITIES_A];
  const b = [...CAPABILITIES_B, ...CAPABILITIES_B];
  return (
    <div className="divider-band" aria-hidden="true">
      <div className="divider-marquees">
        <div className="marquee row-a">
          {a.map((c, i) =>
          <span className="marquee-item" key={i}>{c}<span className="glyph">✦</span></span>
          )}
        </div>
        <div className="marquee row-b">
          {b.map((c, i) =>
          <span className="marquee-item" key={i}>{c}<span className="glyph">✦</span></span>
          )}
        </div>
      </div>
    </div>);

}

/* ───────────────── Work (light, editorial) ───────────────── */

function WorkSection({ onPreview, onPreviewEnd }) {
  const sectionRef = useRef(null);
  const reelRef = useRef(null);
  const [hover, setHover] = useState(null);

  useEffect(() => {
    const sec = sectionRef.current;
    if (!sec) return;
    const onMove = (e) => {
      const r = sec.getBoundingClientRect();
      sec.style.setProperty("--wmx", (e.clientX - r.left) + "px");
      sec.style.setProperty("--wmy", (e.clientY - r.top) + "px");
    };
    sec.addEventListener("mousemove", onMove);
    return () => sec.removeEventListener("mousemove", onMove);
  }, []);

  return (
    <section ref={sectionRef} className={"work section" + (hover ? " is-active" : "")} id="work">
      <div className="work-lightshow" aria-hidden="true"></div>
      <div className="work-bd" aria-hidden="true">
        <div className="work-bd-blur">
          {PROJECTS.map((p) =>
          <div key={p.id} className={"work-stage " + p.swatch} style={{ opacity: hover?.id === p.id ? 0.55 : 0 }} />
          )}
        </div>
        <div className="work-bd-sharp">
          {PROJECTS.map((p) =>
          <div key={p.id} className={"work-stage " + p.swatch} style={{ opacity: hover?.id === p.id ? 1 : 0 }} />
          )}
        </div>
        <div className="work-bd-overlay"></div>
      </div>
      <span className="vert-label left on-light">Index ✦ Selected Work ✦ 2022 — 2026</span>
      <div className="container">
        <div className="work-head reveal">
          <div className="lead">
            <span>02 — Index</span>
            <span className="strong">Six of Eighteen</span>
          </div>
          <h2 className="work-title">Selected Work</h2>
          <div className="count">
            <span className="strong">2022 — 26</span><br />
            <a href="work.html" data-hover style={{ borderBottom: "1px solid var(--on-l)" }}>View full archive →</a>
          </div>
        </div>
        <div
          className="reel"
          ref={reelRef}
          onMouseEnter={() => reelRef.current?.classList.add("has-hover")}
          onMouseLeave={() => {reelRef.current?.classList.remove("has-hover");setHover(null);onPreviewEnd();}}>
          
          {PROJECTS.map((p) =>
          <a
            key={p.id}
            className="reel-item reveal"
            href={"#" + p.id}
            data-hover
            onMouseEnter={(e) => {e.currentTarget.classList.add("is-hover");setHover(p);onPreview(p);}}
            onMouseLeave={(e) => {e.currentTarget.classList.remove("is-hover");}}>
            
              <div className="reel-num">{p.num}<span className="of">/06</span></div>
              <div className="reel-mid">
                <h3 className="reel-title">
                  <span>{p.title}</span>
                  <span className="arrow">[ VIEW →]</span>
                </h3>
                <div className="reel-tags">
                  {p.tags.map((t) => <span key={t} className="tag">{t}</span>)}
                </div>
              </div>
              <div className="reel-meta">
                <div className="form">{p.form}</div>
                <div className="year">{p.year} ✦ {p.client}</div>
              </div>
            </a>
          )}
        </div>
      </div>
    </section>);

}

/* ───────────────── Numbers (staircase) ───────────────── */

function Stat({ target, unit, label, body, decimals = 0, delay = 0, cls }) {
  const [val, ref] = useCountUp(target, 1400, decimals);
  return (
    <div className={"stat-cell reveal " + (cls || "")} ref={ref} style={{ transitionDelay: delay + "ms" }}>
      <div className="k">— {label}</div>
      <div className="stat-n">{val}<span className="unit">{unit}</span></div>
      <div className="stat-l">{body}</div>
    </div>
  );
}

function NumberStory({ idx = 0, target, suffix = "", eyebrow, body, hero = false, accent = false, duration = 1600, decimals = 0 }) {
  const [val, ref] = useCountUp(target, duration, decimals);
  const cls = "nstory" + (hero ? " is-hero" : "") + (accent ? " is-accent" : "");
  const inner = (
    <>
      {val}
      {suffix && <span className="nstory-suffix">{suffix}</span>}
    </>
  );
  return (
    <div className={cls} ref={ref} style={{ "--col-idx": idx }}>
      <div className="nstory-eyebrow">{eyebrow}</div>
      <div className="nstory-num">
        {/* Two stacked layers: solid (plain) and gradient ("light show").
            Crossfade controlled by --gradient-reveal in CSS. */}
        <span className="nstory-numtext">
          <span className="num-plain">{inner}</span>
          <span className="num-gradient" aria-hidden="true">{inner}</span>
        </span>
      </div>
      {body && <p className="nstory-body">{body}</p>}
    </div>
  );
}

const NUMBERS_ROLES = [
  "3× Emmy Award Winning",
  "Creative Director",
  "Producer",
  "Creative Strategist",
  "Innovator",
];

/* Placeholder brand logos for the ticker — swap these <span> chips for
   <img src="..."> later. */
const BRAND_LOGOS = ["Logo 01", "Logo 02", "Logo 03", "Logo 04", "Logo 05", "Logo 06", "Logo 07", "Logo 08"];

/* Renders `text` with the first occurrence of `phrase` wrapped in the
   light-show gradient span. */
function renderHighlight(text, phrase) {
  if (!phrase || !text || text.indexOf(phrase) === -1) return text;
  const i = text.indexOf(phrase);
  return (<React.Fragment>{text.slice(0, i)}<span className="reel-em">{phrase}</span>{text.slice(i + phrase.length)}</React.Fragment>);
}

function NumbersSection() {
  return (
    <section className="numbers-wrap section stick" id="numbers">
      <span className="vert-label right">Track record ✦ The receipts</span>
      <div className="numbers-stage">

        {/* Intro role title-card — reveals line by line, holds, then fades
            out to make way for the "By the numbers" reveal (driven by --p). */}
        <div className="numbers-rolecard" aria-hidden="true">
          <div className="container">
            {(HOME.numbers.roleLines || NUMBERS_ROLES).map((r, i) =>
              <div
                className={"role-line" + (i === 0 ? " role-lead" : "")}
                style={{ "--line-idx": i }}
                key={i}>{r}</div>
            )}
          </div>
        </div>

        {/* Numbers content — clip/fade reveal after the role card clears. */}
        <div className="container numbers-spread">
          <header className="numbers-intro">
            <div className="numbers-eyebrow">
              <span className="dot"></span>02 — By the numbers
            </div>
            <h2 className="numbers-headline">
              {renderHighlight(
                (HOME.numbers && HOME.numbers.headline) || "A creative career, distilled into five digits.",
                (HOME.numbers && HOME.numbers.headlineHighlight) || "five digits"
              )}
            </h2>
          </header>

          <div className="numbers-divider" aria-hidden="true"></div>

          <div className="numbers-row">
            {(HOME.numbers.metrics || []).map((m, i) =>
              <NumberStory
                key={i}
                idx={i}
                target={Number(m.value) || 0}
                suffix={m.suffix || ""}
                eyebrow={m.label}
                body={m.body}
                hero={m.style === "hero"}
                accent={m.style === "accent"}
                duration={m.style === "hero" ? 2200 : 1600} />
            )}
          </div>
        </div>

        {/* Brand logo ticker — renders uploaded logos (HOME.brandLogos), or
            placeholder chips until logos are added in the CMS. */}
        <div className="brand-ticker" aria-hidden="true">
          <div className="brand-ticker-label">Trusted by</div>
          <div className="brand-marquee-wrap">
            <div className="brand-marquee">
              {(HOME.brandLogos && HOME.brandLogos.length)
                ? [0, 1].map((dup) =>
                    HOME.brandLogos.map((b, i) =>
                      <span className="brand-logo" key={dup + "-" + i}>
                        <img src={b.image} alt={b.name || ""} />
                      </span>
                    )
                  )
                : [0, 1].map((dup) =>
                    BRAND_LOGOS.map((b, i) =>
                      <span className="brand-chip" key={dup + "-" + i}>{b}</span>
                    )
                  )}
            </div>
          </div>
        </div>

      </div>
    </section>);

}

/* ───────────────── What I Do ───────────────── */

const DISCIPLINES = [
  { n: "01", t: "Creative Direction",
    b: "I specialize in conceptualizing, directing, and executing high-impact creative across live shows, sports, concerts, and immersive experiences." },
  { n: "02", t: "Campaign Strategy",
    b: "I build culturally relevant creative campaigns that extend across broadcast, social, digital, and in-person experiences." },
  { n: "03", t: "Innovation",
    b: "I bridge creativity and emerging technology to develop innovative content, workflows, and experiences powered by AI." },
];

function WhatIDoSection() {
  return (
    <section className="wid section stick stick-card is-light" id="what-i-do">
      <span className="vert-label right">Disciplines ✦ Three ways in</span>
      <div className="container wid-inner">
        <header className="wid-head">
          <div className="wid-eyebrow reveal">03 — Capabilities</div>
          <h2 className="wid-title reveal">
            What I <span className="wid-do">Do</span>
          </h2>
        </header>

        <div className="wid-list">
          {(HOME.whatIDo.items || DISCIPLINES).map((d, i) =>
            <article
              className="wid-item reveal"
              style={{ transitionDelay: i * 90 + "ms" }}
              key={i}
              data-hover>
              <div className="wid-index">{d.n || String(i + 1).padStart(2, "0")}</div>
              <h3 className="wid-disc"><span className="wid-disc-text" data-text={d.title || d.t}>{d.title || d.t}</span></h3>
              <p className="wid-desc">{d.body || d.b}</p>
            </article>
          )}
        </div>
      </div>
    </section>);

}

/* ───────────────── Contact ───────────────── */

function ContactSection() {
  const c = HOME.contact || FALLBACK_HOME.contact;
  const email = c.email || FALLBACK_HOME.contact.email;
  const socials = (c.socials && c.socials.length) ? c.socials : FALLBACK_HOME.contact.socials;
  return (
    <section className="contact section" id="contact">
      <div className="container">
        <div className="contact-eyebrow reveal">
          <span><span className="strong">04</span> — Work with me.</span>
          <span className="rule"></span>
          <span style={{ color: "var(--on-d-faint)" }}>Hi, hello.</span>
        </div>

        <h2 className="contact-headline reveal-headline">
          <span className="line"><span className="word lg">Let's build</span></span>
          <span className="line d1">
            <span className="word lg">
              <a className="link" href={"mailto:" + email} data-hover>
                something<span className="punct">.</span>
                <span className="underline"></span>
              </a>
            </span>
          </span>
        </h2>

        {/* Direct links to the Work + About pages */}
        <div className="contact-links">
          <a className="contact-link reveal" href="work.html" data-hover>
            <span className="cl-k">Portfolio</span>
            <span className="cl-title">See the Work</span>
            <span className="cl-arrow" aria-hidden="true">→</span>
          </a>
          <a className="contact-link reveal reveal-d-1" href="about.html" data-hover>
            <span className="cl-k">Profile</span>
            <span className="cl-title">About Me</span>
            <span className="cl-arrow" aria-hidden="true">→</span>
          </a>
        </div>

        <div className="contact-meta">
          <div className="col reveal">
            <div className="k">— Email</div>
            <div className="v"><a href={"mailto:" + email} data-hover>{email}</a></div>
          </div>
          <div className="col reveal reveal-d-1">
            <div className="k">— Based</div>
            <div className="v">
              {(c.location || "").split("\n").map((line, i, arr) =>
                <React.Fragment key={i}>{line}{i < arr.length - 1 ? <br /> : null}</React.Fragment>
              )}
            </div>
          </div>
          <div className="col reveal reveal-d-2">
            <div className="k">— Connect</div>
            <div className="v">
              {socials.map((s, i) =>
                <React.Fragment key={i}>
                  <a href={s.url || "#"} data-hover>{s.label}</a>
                  {i < socials.length - 1 ? <br /> : null}
                </React.Fragment>
              )}
            </div>
          </div>
          <div className="col reveal reveal-d-3">
            <div className="k">— Bookings</div>
            <div className="v">For creative direction &amp;<br />production inquiries.</div>
          </div>
        </div>
      </div>
    </section>);

}

function Footer({ time }) {
  return (
    <footer className="footer">
      <div className="container">
        <div>© Justin Restaino — All Worlds Reserved</div>
        <div>Las Vegas ✦ <span className="numeral">{time}</span> ✦ MMXXVI</div>
      </div>
    </footer>);

}

/* ───────────────── Preview card ───────────────── */

function ReelPreview({ project }) {
  const [tc, setTc] = useState("00:00:00:00");
  useEffect(() => {
    if (!project) return; // only run the REC timecode while a preview is on screen
    let f = 0;
    const id = setInterval(() => {
      f++;
      const fr = f % 24;
      const sec = Math.floor(f / 24) % 60;
      const mn = Math.floor(f / 24 / 60) % 60;
      setTc(`00:${String(mn).padStart(2, "0")}:${String(sec).padStart(2, "0")}:${String(fr).padStart(2, "0")}`);
    }, 1000 / 24);
    return () => clearInterval(id);
  }, [project]);
  return (
    <div className={"reel-preview " + (project ? "is-on" : "")}>
      <div className={"frame " + (project ? project.swatch : "")}>
        {project &&
        <React.Fragment>
            <div className="play"><span className="dot"></span>REC ✦ {project.num}</div>
            <div className="tc">{tc}</div>
            <div className="center">▶  {project.tags?.[0]}</div>
            <div className="label">{project.client} ✦ {project.year}</div>
          </React.Fragment>
        }
      </div>
    </div>);

}

/* ───────────────── App ───────────────── */

const SETTINGS = {
  font: "unbounded",
  nav: "top",
  cursor: true,
  grain: true,
  nameReel: true,
  smooth: true,
};

function App() {
  const t = SETTINGS;
  const [preview, setPreview] = useState(null);
  const [reelOpen, setReelOpen] = useState(false);
  const [time, setTime] = useState("");
  const [activeId, setActiveId] = useState("top");
  const [, forceHome] = useState(0);

  // Load editable home content; keep the built-in fallback on any failure.
  useEffect(() => {
    fetch("/content/home.json?t=" + Date.now())
      .then((r) => (r.ok ? r.json() : Promise.reject(r.status)))
      .then((j) => { HOME = j; forceHome((x) => x + 1); })
      .catch(() => {});
  }, []);

  useEffect(() => {
    const c = document.body.classList;
    c.remove("font-unbounded", "font-bigshoulders", "font-bricolage");
    c.add("font-" + t.font);
    c.remove("nav-top", "nav-rail", "nav-numerals", "nav-hidden");
    c.add("nav-" + t.nav);
    c.toggle("reel-off", !t.nameReel);
  }, [t.font, t.nav, t.nameReel]);

  useSmoothScroll(t.smooth);
  useScrollFX();
  useAnchorClicks();
  useCursor(t.cursor);
  useHoverDot();
  useReveal();
  useNameMorph();
  useStatementImageCards();
  useNumbersProgress();

  useEffect(() => {
    const update = () => {
      try {
        const fmt = new Intl.DateTimeFormat("en-US", {
          timeZone: "America/Los_Angeles",
          hour: "2-digit", minute: "2-digit", hour12: false
        });
        setTime(fmt.format(new Date()) + " LV");
      } catch (e) {
        const d = new Date();
        setTime(`${String(d.getHours()).padStart(2, "0")}:${String(d.getMinutes()).padStart(2, "0")}`);
      }
    };
    update();
    const id = setInterval(update, 30 * 1000);
    return () => clearInterval(id);
  }, []);

  useEffect(() => {
    const ids = ["numbers", "what-i-do", "contact"];
    const on = () => {
      let cur = "top";
      for (const id of ids) {
        const el = document.getElementById(id);
        if (!el) continue;
        if (el.getBoundingClientRect().top < window.innerHeight * 0.45) cur = id;
      }
      setActiveId(cur);
    };
    on();
    window.addEventListener("scroll", on, { passive: true });
    return () => window.removeEventListener("scroll", on);
  }, []);

  // Trigger hero name + contact headline reveal after mount
  useEffect(() => {
    const id = setTimeout(() => {
      document.querySelector(".reveal-name")?.classList.add("is-in");
    }, 80);
    return () => clearTimeout(id);
  }, []);

  return (
    <React.Fragment>
      {t.grain && <div className="grain" aria-hidden="true"></div>}
      {t.cursor && <div className="cursor-dot" aria-hidden="true"></div>}

      <Nav />
      <div className="hero-gack" aria-hidden="true">
        {/* Corners */}
        <span className="gack-plus gack-tl"></span>
        <span className="gack-plus gack-tr"></span>
        <span className="gack-plus gack-bl"></span>
        <span className="gack-plus gack-br"></span>
        {/* Top edge */}
        <span className="gack-plus gack-t-1"></span>
        <span className="gack-plus gack-t-2"></span>
        <span className="gack-plus gack-t-3"></span>
        {/* Bottom edge */}
        <span className="gack-plus gack-b-1"></span>
        <span className="gack-plus gack-b-2"></span>
        <span className="gack-plus gack-b-3"></span>
        {/* Left edge */}
        <span className="gack-plus gack-l-1"></span>
        <span className="gack-plus gack-l-2"></span>
        <span className="gack-plus gack-l-3"></span>
        {/* Right edge */}
        <span className="gack-plus gack-r-1"></span>
        <span className="gack-plus gack-r-2"></span>
        <span className="gack-plus gack-r-3"></span>
        <span className="gack-time">{time}</span>
      </div>
      <a id="name-morph" href="#top" className="name-morph" data-hover>
        <span className="name-text name-reel">
          <span>Justin</span>
          <span>Restaino</span>
        </span>
      </a>
      <div id="name-sub" className="name-sub">Creative Director&nbsp;&nbsp;|&nbsp;&nbsp;Creative Producer</div>
      <Rail activeId={activeId} />

      <main className="stack">
        <Hero onPlayReel={() => setReelOpen(true)} />
        <StatementSection />
        <NumbersSection />
        <WhatIDoSection />
        <ContactSection />
        <Footer time={time} />
      </main>

      <ReelPreview project={preview} />
      <ReelModal open={reelOpen} onClose={() => setReelOpen(false)} />
    </React.Fragment>);

}

ReactDOM.createRoot(document.getElementById("root")).render(<App />);