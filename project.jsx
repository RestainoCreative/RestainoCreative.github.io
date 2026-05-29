/* project.jsx — reusable case study template ("The Big Screen") */

const { useState, useEffect, useRef } = React;

/* ─────────────── Project data ───────────────
   Live content is loaded from /content/projects/<slug>.json based on the
   ?p=<slug> URL param (CMS-editable; add new projects as new files). The
   object below is the built-in fallback (also the default project). */

const FALLBACK_PROJECT = {
  slug: "phish-at-sphere",
  title: "Phish at Sphere",
  tagline: "Reimagining real-time visuals for concerts.",
  tags: ["Concert", "Creative Direction", "Creative Producer", "Innovation", "AI"],
  hero: { type: "video", src: "/media/reel.mp4", poster: "/media/IMAGE1.jpg" },

  facts: [
    { k: "Client",       v: "Moment Factory" },
    { k: "Role",         v: "Creative Director, Creative Producer" },
    { k: "Discipline",   v: "Live ✦ Immersive" },
    { k: "Year",         v: "2024" },
    { k: "Deliverables", v: "86 songs of real-time visuals, 16K" },
  ],

  challenge: {
    body: [
      "A four-night Sphere residency for a jam band means no two performances are alike — songs run anywhere from four to thirty minutes, and the visuals have to follow the music live, in real time, on a 16K wraparound display.",
      "That meant orchestrating over 400 terabytes of content from partners across multiple countries into a single real-time system that could improvise alongside the band — twelve-plus hours of visuals, none of it on a fixed timeline.",
    ],
    media: { type: "image", src: "/media/IMAGE2.png" },
  },

  feature: { type: "video", src: "/media/reel.mp4", poster: "/media/IMAGE3.png",
    caption: "Encore — full rig, real-time generative visuals across the dome." },

  approach: {
    body: [
      "I led creative development and the real-time Unreal Engine implementation, building the visual language around states of matter and a pipeline that blended pre-rendered, real-time, and AI-generated content.",
      "Three partner studios, Disguise asset management, and a GrandMA2 console let us layer and call looks live — so the room could change with the band instead of playing back at it.",
    ],
    led: [
      "Defined the creative concept and visual language across 86 songs.",
      "Directed the real-time Unreal Engine implementation.",
      "Built the live layering pipeline: pre-rendered + real-time + AI.",
      "Led the cross-studio team across multiple countries.",
    ],
  },

  gallery: [
    { type: "image", src: "/media/IMAGE1.jpg", caption: "Cold open — single source, full dome." },
    { type: "video", src: "/media/reel.mp4",  poster: "/media/IMAGE2.png", caption: "Real-time visuals tracking the jam." },
    { type: "image", src: "/media/IMAGE3.png", caption: "States of matter — liquid sequence." },
    { type: "image", src: "/media/IMAGE4.jpg", caption: "AI-generated transition, called live." },
    { type: "video", src: "/media/reel.mp4",  poster: "/media/IMAGE1.jpg", caption: "Encore — full rig at 100%." },
  ],

  impact: {
    metrics: [
      { n: "80",  suffix: "K",  k: "Fans live in attendance" },
      { n: "20",  suffix: "M+", k: "Social views" },
      { n: "86",  suffix: "",   k: "Songs, each unique" },
      { n: "4",   suffix: "",   k: "Nights" },
    ],
    note: "Four sold-out nights, 80,000 fans, and 20M+ views across social — a new bar for real-time concert visuals.",
  },

  credits: [
    { k: "Creative Direction",   v: "Justin Restaino" },
    { k: "Creative Production",  v: "Justin Restaino" },
    { k: "Studio",               v: "Moment Factory" },
    { k: "Real-Time Engine",     v: "Unreal Engine team" },
    { k: "Asset Management",     v: "Disguise" },
    { k: "Lighting Console",     v: "GrandMA2" },
  ],

  next: {
    slug: "index.html#work",
    title: "More work",
    tagline: "See the full index.",
    media: { type: "image", src: "/media/IMAGE4.jpg" },
  },
};

/* Mutable current project — reassigned when the JSON for the requested
   slug loads, then a re-render is forced. Components read PROJECT directly. */
let PROJECT = FALLBACK_PROJECT;

/* ─────────────── Hooks (shared with the rest of the site) ─────────────── */

function useSmoothScroll(enabled) {
  useEffect(() => {
    if (!enabled) return;
    if (window.matchMedia("(hover: none)").matches) return;
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
    const start = () => { if (!scheduled) { scheduled = true; tick(); } };
    const onWheel = (e) => {
      if (window.__scrollLocked) { e.preventDefault(); return; }
      if (e.ctrlKey) return;
      e.preventDefault();
      target = clamp(target + e.deltaY);
      start();
    };
    const onKey = (e) => {
      const k = e.key;
      const tag = e.target?.tagName;
      if (tag === "INPUT" || tag === "TEXTAREA") return;
      let delta = 0;
      if (k === "ArrowDown") delta = 80;
      else if (k === "ArrowUp") delta = -80;
      else if (k === " " || k === "PageDown") delta = window.innerHeight * 0.85;
      else if (k === "PageUp") delta = -window.innerHeight * 0.85;
      else if (k === "Home") { e.preventDefault(); target = 0; start(); return; }
      else if (k === "End")  { e.preventDefault(); target = maxScroll(); start(); return; }
      else return;
      e.preventDefault();
      target = clamp(target + delta);
      start();
    };
    const onScroll = () => {
      if (suppressNext) { suppressNext = false; return; }
      target = window.scrollY;
      current = window.scrollY;
    };
    window.__smoothScrollTo = (y) => { target = clamp(y); start(); };
    window.addEventListener("wheel", onWheel, { passive: false });
    window.addEventListener("keydown", onKey);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("wheel", onWheel);
      window.removeEventListener("keydown", onKey);
      window.removeEventListener("scroll", onScroll);
      delete window.__smoothScrollTo;
    };
  }, [enabled]);
}

function useCursor(enabled) {
  useEffect(() => {
    if (!enabled) { document.body.classList.remove("custom-cursor"); return; }
    document.body.classList.add("custom-cursor");
    const onMove = (e) => {
      const r = document.documentElement.style;
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
      const el = e.target.closest("a, button, [data-hover]");
      if (el) document.querySelector(".cursor-dot")?.classList.add("is-hover");
    };
    const onOut = (e) => {
      const next = e.relatedTarget;
      if (!next || !next.closest?.("a, button, [data-hover]")) {
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

function useReveal() {
  useEffect(() => {
    const select = () => document.querySelectorAll(".reveal, .mask-line");
    const io = new IntersectionObserver(
      (entries) => entries.forEach((e) => {
        if (e.isIntersecting) { e.target.classList.add("is-in"); io.unobserve(e.target); }
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
    return () => { clearTimeout(init); io.disconnect(); };
  }, []);
}

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
        if (window.__smoothScrollTo) window.__smoothScrollTo(0);
        else window.scrollTo({ top: 0 });
        return;
      }
      const el = document.getElementById(id);
      if (!el) return;
      e.preventDefault();
      const top = window.scrollY + el.getBoundingClientRect().top;
      if (window.__smoothScrollTo) window.__smoothScrollTo(top);
      else window.scrollTo({ top });
    };
    document.addEventListener("click", onClick);
    return () => document.removeEventListener("click", onClick);
  }, []);
}

/* Pins the gallery section and maps vertical scroll progress to a horizontal
   translate of the track. Section height = viewport + trackWidth overflow, so
   the whole reel scrolls through while pinned. offsetTop is cached while at the
   top of the page to avoid the sticky-pin offsetTop quirk. */
function useHorizontalGallery() {
  useEffect(() => {
    const section = document.querySelector(".pc-gallery");
    const track = document.querySelector(".pc-gallery-track");
    if (!section || !track) return;

    let pos = null;
    const measure = () => {
      if (window.scrollY > 4) return;
      const extra = Math.max(0, track.scrollWidth - window.innerWidth);
      section.style.height = (window.innerHeight + extra) + "px";
      pos = { top: section.offsetTop, extra };
    };
    measure();
    const t1 = setTimeout(measure, 200);
    const t2 = setTimeout(measure, 800);
    window.addEventListener("resize", measure);

    let raf;
    const tick = () => {
      if (pos) {
        const h = section.offsetHeight - window.innerHeight;
        let p = h > 0 ? (window.scrollY - pos.top) / h : 0;
        if (p < 0) p = 0;
        if (p > 1) p = 1;
        track.style.transform = `translate3d(${(-p * pos.extra).toFixed(2)}px,0,0)`;
      }
      raf = requestAnimationFrame(tick);
    };
    tick();
    return () => {
      cancelAnimationFrame(raf);
      clearTimeout(t1); clearTimeout(t2);
      window.removeEventListener("resize", measure);
    };
  }, []);
}

/* Counts a number up from 0 to target when it scrolls into view. */
function useCountUp(target, duration = 1600) {
  const [val, setVal] = useState(0);
  const ref = useRef(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    let raf;
    const io = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        const start = performance.now();
        const step = (now) => {
          const p = Math.min(1, (now - start) / duration);
          const eased = 1 - Math.pow(1 - p, 3);
          setVal(Math.round(target * eased));
          if (p < 1) raf = requestAnimationFrame(step);
        };
        raf = requestAnimationFrame(step);
        io.unobserve(el);
      }
    }, { threshold: 0.4 });
    io.observe(el);
    return () => { io.disconnect(); if (raf) cancelAnimationFrame(raf); };
  }, [target, duration]);
  return [val, ref];
}

/* Reading-progress bar */
function useReadingProgress() {
  useEffect(() => {
    const bar = document.querySelector(".read-progress");
    if (!bar) return;
    let raf;
    const tick = () => {
      const h = document.documentElement.scrollHeight - window.innerHeight;
      const p = h > 0 ? Math.min(1, window.scrollY / h) : 0;
      bar.style.transform = `scaleX(${p})`;
      raf = requestAnimationFrame(tick);
    };
    tick();
    return () => cancelAnimationFrame(raf);
  }, []);
}

/* ─────────────── Media slot (video | image) ─────────────── */

function Media({ item, className = "", fit = "cover" }) {
  const ref = useRef(null);
  const [muted, setMuted] = useState(true);

  useEffect(() => {
    if (item && item.type === "video" && ref.current) {
      const v = ref.current;
      v.muted = true;
      v.defaultMuted = true;
      const p = v.play();
      if (p && p.catch) p.catch(() => {});
    }
  }, [item]);

  if (!item) return null;

  if (item.type === "video") {
    return (
      <div className={"pc-media pc-media-video " + className}>
        <video ref={ref} src={item.src} poster={item.poster}
          muted loop playsInline autoPlay preload="metadata"
          style={{ objectFit: fit }} />
        <div className="pc-media-controls">
          <button type="button" className={"pc-mc-btn " + (muted ? "" : "is-on")} data-hover
            onClick={() => { const v = ref.current; if (!v) return; v.muted = !v.muted; setMuted(v.muted); }}>
            {muted ? "Unmute" : "Mute"}
          </button>
          <button type="button" className="pc-mc-btn" data-hover
            onClick={() => { const v = ref.current; if (v && v.requestFullscreen) v.requestFullscreen(); }}>
            Fullscreen
          </button>
        </div>
        {item.caption && <div className="pc-media-cap">{item.caption}</div>}
      </div>
    );
  }

  return (
    <div className={"pc-media pc-media-image " + className}>
      <div className="pc-media-img" style={{ backgroundImage: `url(${item.src})`, backgroundSize: fit }}
        role="img" aria-label={item.caption || ""}></div>
      {item.caption && <div className="pc-media-cap">{item.caption}</div>}
    </div>
  );
}

/* ─────────────── Sections ─────────────── */

function Hero() {
  return (
    <header className="pc-hero" id="top">
      <div className="pc-hero-media" data-hover>
        <Media item={PROJECT.hero} />
        <div className="pc-hero-vignette" aria-hidden="true"></div>
      </div>
      <div className="pc-hero-overlay">
        <div className="pc-hero-tags reveal">
          {PROJECT.tags.map((t, i) => (
            <React.Fragment key={t}>
              {i > 0 && <span className="sep">✦</span>}
              <span>{t}</span>
            </React.Fragment>
          ))}
        </div>
        <h1 className="pc-hero-title">
          <span className="mask-line"><span>{PROJECT.title}</span></span>
        </h1>
        <p className="pc-hero-tagline reveal reveal-d-1">{PROJECT.tagline}</p>
      </div>
      <div className="pc-scrollcue reveal reveal-d-2" aria-hidden="true">
        <span>Scroll</span><span className="pc-scrollcue-line"></span>
      </div>
    </header>
  );
}

function FactsBar() {
  return (
    <section className="pc-facts" aria-label="Project facts">
      <div className="pc-facts-inner">
        {PROJECT.facts.map((f) => (
          <div className="pc-fact reveal" key={f.k}>
            <div className="pc-fact-k">{f.k}</div>
            <div className="pc-fact-v">{f.v}</div>
          </div>
        ))}
      </div>
    </section>
  );
}

function Challenge() {
  const c = PROJECT.challenge;
  return (
    <section className="pc-breather pc-challenge" id="challenge">
      {c.media && (
        <div className="pc-breather-bg" aria-hidden="true">
          <Media item={c.media} />
          <div className="pc-breather-scrim"></div>
        </div>
      )}
      <div className="pc-breather-inner">
        <div className="pc-breather-label reveal">— The Challenge</div>
        {c.body.map((p, i) => (
          <p className={"pc-breather-p reveal " + (i === 0 ? "is-lead" : "")} key={i}
            style={{ transitionDelay: i * 90 + "ms" }}>{p}</p>
        ))}
      </div>
    </section>
  );
}

function Feature() {
  if (!PROJECT.feature) return null;
  return (
    <section className="pc-feature" aria-label="Feature">
      <Media item={PROJECT.feature} />
    </section>
  );
}

function Approach() {
  const a = PROJECT.approach || { body: [], led: [] };
  const body = a.body || [];
  const led = a.led || [];
  return (
    <section className={"pc-approach" + (led.length ? "" : " pc-approach-solo")} id="approach">
      <div className="pc-approach-inner">
        <div className="pc-approach-body">
          <div className="pc-breather-label reveal">— The Approach</div>
          {body.map((p, i) => (
            <p className={"pc-breather-p reveal " + (i === 0 ? "is-lead" : "")} key={i}
              style={{ transitionDelay: i * 90 + "ms" }}>{p}</p>
          ))}
        </div>
        {led.length > 0 && (
        <aside className="pc-approach-led">
          <div className="pc-led-eyebrow reveal">— What I led</div>
          <ol className="pc-led-list">
            {led.map((l, i) => (
              <li className="pc-led-item reveal" key={i} style={{ transitionDelay: i * 80 + "ms" }}>
                <span className="pc-led-n">{String(i + 1).padStart(2, "0")}</span>
                <span className="pc-led-t">{l}</span>
              </li>
            ))}
          </ol>
        </aside>
        )}
      </div>
    </section>
  );
}

function Gallery({ onZoom }) {
  if (!PROJECT.gallery || !PROJECT.gallery.length) return null;
  return (
    <section className="pc-gallery" id="work">
      <div className="pc-gallery-pin">
        <div className="pc-gallery-head">
          <span className="pc-breather-label">— Selected work</span>
          <span className="pc-gallery-hint">Scroll →&nbsp;&nbsp;Click to enlarge</span>
        </div>
        <div className="pc-gallery-track">
          {PROJECT.gallery.map((m, i) => (
            <figure className="pc-gallery-item" key={i}
              data-hover onClick={() => onZoom && onZoom(m)}>
              <div className="pc-gallery-media">
                <Media item={m} />
                <div className="pc-gallery-zoom" aria-hidden="true">
                  <span className="pc-zoom-icon">⤢</span>
                  <span className="pc-zoom-label">View</span>
                </div>
              </div>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}

/* Fullscreen image/video lightbox — opened by clicking a gallery item. */
function Lightbox({ item, onClose }) {
  useEffect(() => {
    if (!item) return;
    window.__scrollLocked = true;
    const onKey = (e) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", onKey);
    return () => { window.__scrollLocked = false; window.removeEventListener("keydown", onKey); };
  }, [item, onClose]);
  if (!item) return null;
  // Full-screen takeover. Click anywhere to dismiss (for video, clicks on the
  // element are swallowed so its controls work — close with ✕ or Esc).
  return (
    <div className="pc-lightbox is-on" onClick={onClose}>
      <button className="pc-lightbox-close" onClick={onClose} data-hover aria-label="Close">✕</button>
      {item.type === "video"
        ? <video className="pc-lightbox-media" src={item.src} poster={item.poster}
            controls autoPlay loop playsInline onClick={(e) => e.stopPropagation()} />
        : <img className="pc-lightbox-media" src={item.src} alt="" />}
    </div>
  );
}

function Metric({ n, suffix, k }) {
  const [val, ref] = useCountUp(parseInt(n, 10) || 0, 1600);
  return (
    <div className="pc-metric reveal" ref={ref}>
      <div className="pc-metric-n reel-em">{val}<span className="pc-metric-suffix">{suffix}</span></div>
      <div className="pc-metric-k">{k}</div>
    </div>
  );
}

function Impact() {
  const im = PROJECT.impact || {};
  const metrics = im.metrics || [];
  if (!metrics.length && !im.note) return null;
  return (
    <section className="pc-impact" id="impact">
      <div className="pc-impact-inner">
        <div className="pc-breather-label reveal">— The Impact</div>
        {metrics.length > 0 && (
          <div className="pc-impact-row">
            {metrics.map((m, i) => <Metric key={i} {...m} />)}
          </div>
        )}
        {im.note && <p className="pc-impact-note reveal">{im.note}</p>}
      </div>
    </section>
  );
}

function Credits() {
  const credits = PROJECT.credits || [];
  if (!credits.length) return null;
  return (
    <section className="pc-credits" id="credits">
      <div className="pc-credits-inner">
        <div className="pc-breather-label reveal">— Credits</div>
        <div className="pc-credits-grid">
          {credits.map((c, i) => (
            <div className="pc-credit reveal" key={i}>
              <div className="pc-credit-k">{c.k}</div>
              <div className="pc-credit-v">{c.v}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function NextProject({ time }) {
  const n = PROJECT.next;
  if (!n) return null;
  return (
    <section className="pc-next" id="next">
      <a className="pc-next-link" href={n.slug ? ("project.html?p=" + n.slug) : "work.html"} data-hover>
        <div className="pc-next-media" aria-hidden="true">
          <Media item={n.media} />
          <div className="pc-next-scrim"></div>
        </div>
        <div className="pc-next-overlay">
          <div className="pc-next-eyebrow reveal">— Next</div>
          <h2 className="pc-next-title">{n.title} <span className="pc-next-arrow">→</span></h2>
          <p className="pc-next-tagline reveal reveal-d-1">{n.tagline}</p>
        </div>
      </a>
      <div className="pc-next-foot">
        <a href="work.html" data-hover>← Back to Work</a>
        <span>© Justin Restaino</span>
        <a href="index.html#contact" data-hover>Contact ✦ {time}</a>
      </div>
    </section>
  );
}

/* ─────────────── Nav ─────────────── */

function Nav({ time }) {
  return (
    <nav className="nav">
      <div className="nav-links">
        <a href="work.html" className="nav-link" data-hover>
          <span className="idx">←</span>
          <span className="lbl"><span className="lbl-inner" data-text="Work">Work</span></span>
        </a>
        <a href="index.html" className="nav-link" data-hover>
          <span className="lbl"><span className="lbl-inner" data-text="Home">Home</span></span>
        </a>
      </div>
      <div className="nav-links">
        <a href="index.html#contact" className="nav-link" data-hover>
          <span className="lbl"><span className="lbl-inner">{time || "LAS VEGAS"}</span></span>
        </a>
      </div>
    </nav>
  );
}

/* ─────────────── App ─────────────── */

const SETTINGS = { font: "unbounded", cursor: true, grain: true, smooth: true };

function App() {
  const t = SETTINGS;
  const [time, setTime] = useState("");
  const [, forceRender] = useState(0);
  const [zoomItem, setZoomItem] = useState(null);

  // Load the requested project (?p=<slug>) into PROJECT, then re-render.
  // On any failure we keep the built-in fallback (the default project).
  useEffect(() => {
    let slug = "phish-at-sphere";
    try { slug = new URLSearchParams(window.location.search).get("p") || slug; } catch (e) {}
    fetch("/content/projects/" + slug + ".json")
      .then((r) => (r.ok ? r.json() : Promise.reject(r.status)))
      .then((j) => { PROJECT = j; forceRender((x) => x + 1); })
      .catch(() => {});
  }, []);

  useEffect(() => {
    const c = document.body.classList;
    c.remove("font-unbounded", "font-bigshoulders", "font-bricolage");
    c.add("font-" + t.font);
  }, [t.font]);

  useSmoothScroll(t.smooth);
  useAnchorClicks();
  useCursor(t.cursor);
  useHoverDot();
  useReveal();
  useReadingProgress();
  useHorizontalGallery();

  useEffect(() => {
    const update = () => {
      try {
        const fmt = new Intl.DateTimeFormat("en-US", {
          timeZone: "America/Los_Angeles",
          hour: "2-digit", minute: "2-digit", hour12: false,
        });
        setTime(fmt.format(new Date()) + " PST");
      } catch (e) {
        const d = new Date();
        setTime(`${String(d.getHours()).padStart(2, "0")}:${String(d.getMinutes()).padStart(2, "0")}`);
      }
    };
    update();
    const id = setInterval(update, 30 * 1000);
    return () => clearInterval(id);
  }, []);

  return (
    <React.Fragment>
      {t.grain && <div className="grain" aria-hidden="true"></div>}
      {t.cursor && <div className="cursor-dot" aria-hidden="true"></div>}
      <div className="read-progress" aria-hidden="true"></div>

      <Nav time={time} />

      <main className="pc-page">
        <Hero />
        <FactsBar />
        <Challenge />
        <Feature />
        <Approach />
        <Gallery onZoom={setZoomItem} />
        <Impact />
        <Credits />
        <NextProject time={time} />
      </main>

      <Lightbox item={zoomItem} onClose={() => setZoomItem(null)} />
    </React.Fragment>
  );
}

ReactDOM.createRoot(document.getElementById("root")).render(<App />);
