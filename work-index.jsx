/* work-index.jsx — Justin Restaino / Work — stacked full-bleed reel */

const { useState, useEffect, useRef } = React;

/* ─────────────── Data (swap media/titles/links per project) ─────────────── */

const WORKS = [
  { num: "01", title: "Phish at Sphere",   client: "Moment Factory",       year: 2024,
    tags: ["Concert", "Creative Direction", "Innovation"],
    media: { type: "video", src: "reel.mp4", poster: "IMAGE1.jpg" }, href: "project.html" },
  { num: "02", title: "Field of Echoes",   client: "Sports Broadcast",     year: 2024,
    tags: ["Sports", "Broadcast", "Cinematic Open"],
    media: { type: "image", src: "IMAGE2.png" }, href: "project.html" },
  { num: "03", title: "Pulse Atlas",       client: "League Broadcast",     year: 2023,
    tags: ["Sports", "Identity", "Campaign Strategy"],
    media: { type: "image", src: "IMAGE3.png" }, href: "project.html" },
  { num: "04", title: "Hollow City",       client: "Cultural Institution", year: 2023,
    tags: ["Immersive", "AR / XR", "Innovation"],
    media: { type: "image", src: "IMAGE4.jpg" }, href: "project.html" },
  { num: "05", title: "Signal Drift",      client: "Telecom",              year: 2023,
    tags: ["Campaign", "AR / XR", "Strategy"],
    media: { type: "video", src: "reel.mp4", poster: "IMAGE2.png" }, href: "project.html" },
  { num: "06", title: "Slow Cathedral",    client: "Touring Artist",       year: 2022,
    tags: ["Concert", "Production Design", "Tour"],
    media: { type: "image", src: "IMAGE1.jpg" }, href: "project.html" },
  { num: "07", title: "The Long Take",     client: "Fashion House",        year: 2022,
    tags: ["Campaign", "Film", "Direction"],
    media: { type: "image", src: "IMAGE3.png" }, href: "project.html" },
  { num: "08", title: "Lighthouse Protocol", client: "Tech Startup",       year: 2022,
    tags: ["Innovation", "AI", "Launch Campaign"],
    media: { type: "video", src: "reel.mp4", poster: "IMAGE4.jpg" }, href: "project.html" },
];

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

/* ─────────────── Media slot (video | image) ─────────────── */

function Media({ item, className = "", fit = "cover" }) {
  const ref = useRef(null);
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
          muted loop playsInline autoPlay preload="metadata" style={{ objectFit: fit }} />
      </div>
    );
  }
  return (
    <div className={"pc-media pc-media-image " + className}>
      <div className="pc-media-img" style={{ backgroundImage: `url(${item.src})`, backgroundSize: fit }}></div>
    </div>
  );
}

/* ─────────────── Nav ─────────────── */

function Nav({ time }) {
  return (
    <nav className="nav">
      <div className="nav-links">
        <a href="index.html" className="nav-link" data-hover>
          <span className="idx">←</span>
          <span className="lbl"><span className="lbl-inner" data-text="Home">Home</span></span>
        </a>
        <span className="nav-link is-current" data-hover>
          <span className="lbl"><span className="lbl-inner" data-text="Work">Work</span></span>
        </span>
      </div>
      <div className="nav-links">
        <a href="index.html#contact" className="nav-link" data-hover>
          <span className="lbl"><span className="lbl-inner">{time || "LAS VEGAS"}</span></span>
        </a>
      </div>
    </nav>
  );
}

/* ─────────────── Header ─────────────── */

function WorkHeader({ count }) {
  return (
    <header className="wi-header" id="top">
      <span className="vert-label right">Selected work ✦ Creative Director</span>
      <div className="wi-header-inner">
        <div className="wi-header-eyebrow reveal">— Selected work</div>
        <h1 className="wi-header-title">
          <span className="mask-line"><span>Selected</span></span>
          <span className="mask-line d1"><span><span className="reel-em">work.</span></span></span>
        </h1>
        <div className="wi-header-meta reveal reveal-d-2">
          <span><span className="strong">{count}</span> projects</span>
          <span className="sep">✦</span>
          <span>Concert · Sports · Immersive · Innovation</span>
        </div>
      </div>
      <div className="pc-scrollcue reveal reveal-d-2" aria-hidden="true">
        <span>Scroll</span><span className="pc-scrollcue-line"></span>
      </div>
    </header>
  );
}

/* ─────────────── Reel band ─────────────── */

function ReelBand({ project, total }) {
  return (
    <a className="wi-band" href={project.href} data-hover>
      <div className="wi-band-media" aria-hidden="true">
        <Media item={project.media} />
        <div className="wi-band-scrim"></div>
      </div>
      <div className="wi-band-overlay">
        <div className="wi-band-top">
          <span className="wi-band-num">{project.num}<span className="of"> / {String(total).padStart(2, "0")}</span></span>
          <span className="wi-band-tags">{project.tags.join("  ✦  ")}</span>
        </div>
        <div className="wi-band-bottom">
          <h2 className="wi-band-title">{project.title}</h2>
          <div className="wi-band-foot">
            <span className="wi-band-client">{project.client} ✦ {project.year}</span>
            <span className="wi-band-cta">Read case <span className="arr">→</span></span>
          </div>
        </div>
      </div>
    </a>
  );
}

function Reel() {
  return (
    <section className="wi-reel" id="reel">
      {WORKS.map((p) => (
        <ReelBand key={p.num} project={p} total={WORKS.length} />
      ))}
    </section>
  );
}

/* ─────────────── Footer ─────────────── */

function Footer({ time }) {
  return (
    <footer className="wi-foot" id="footer">
      <a href="index.html" data-hover>← Back home</a>
      <span>© Justin Restaino</span>
      <a href="index.html#contact" data-hover>Contact ✦ {time}</a>
    </footer>
  );
}

/* ─────────────── App ─────────────── */

const SETTINGS = { font: "unbounded", cursor: true, grain: true, smooth: true };

function App() {
  const t = SETTINGS;
  const [time, setTime] = useState("");

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

      <Nav time={time} />

      <main className="wi-page">
        <WorkHeader count={WORKS.length} />
        <Reel />
        <Footer time={time} />
      </main>
    </React.Fragment>
  );
}

ReactDOM.createRoot(document.getElementById("root")).render(<App />);
