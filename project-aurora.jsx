/* project-aurora.jsx — Aurora case study (editorial, long-scroll, no section takeover) */

const { useState, useEffect, useRef } = React;

/* ─────────────── Data ─────────────── */

const PROJECT = {
  id: "aurora",
  num: "01",
  title: "Aurora",
  subtitle: "A Residency in Light",
  client: "Independent",
  year: "2025",
  form: "12-Night Arena Residency",
  city: "Brooklyn, NY",
  venue: "Barclays Center",
  duration: "134 min",
  role: "Creative Direction, Show Design",
  tags: ["Live Entertainment", "Residency", "Immersive"],
  briefCells: [
    { k: "Client",  v: "Independent ✦ Self-Produced" },
    { k: "Venue",   v: "Barclays Center, Brooklyn" },
    { k: "Run",     v: "12 Nights ✦ Mar — Apr 2025" },
    { k: "My role", v: "Creative Direction, Show Design" },
  ],
  body1: [
    "Aurora began as a question with no obvious answer: what would it look like to make light itself the lead performer? Not lighting design as a craft serving music, but lighting as the narrator — choosing what the audience saw, when, and how long they were allowed to keep looking.",
    "Twelve nights. One body of work. The brief from the artist was unusually short, and the budget unusually long. The rest, we made up.",
  ],
  approach: [
    "The architecture of the show was decided before any music or staging — a seven-act run of show that mapped the rise and fall of light across one room. From a single follow spot in the cold open to a 1,400-unit floor wash that ignited like sunrise in Act VI, every cue was scored to feel inevitable.",
    "What changed across the twelve nights was the order of revelation. Songs found new architecture, weather, endings. By Night 9 the audience knew the geometry well enough to anticipate it; by Night 12 we had broken it on purpose.",
  ],
  ledBy: [
    "Defining the show's narrative through-line and committing to it across departments.",
    "Directing show design alongside production and lighting design — the three sat in the same room from week one.",
    "Calling cue notes in the truck, every night, for twelve nights.",
    "Working with the music director to retime two songs around the show's biggest visual moment.",
  ],
  cues: [
    { tc: "00:00:00", n: "Q-01", kicker: "Act I",     name: "Cold Open",    point: "House to half. Audio drone in B-flat under the seats. One follow spot on an empty stage.", look: "1 spot" },
    { tc: "00:04:12", n: "Q-08", kicker: "Act II",    name: "First Light",  point: "1.4k LED battens — slow bloom from upstage. House lifts in 14 seconds. Audience reads the room.", look: "Amber wash" },
    { tc: "00:21:48", n: "Q-22", kicker: "Act III",   name: "Procession",   point: "Floor units track audience-left to right. Performers enter behind the wash; revealed only on the turn.", look: "Sodium cross-fade" },
    { tc: "00:46:00", n: "Q-41", kicker: "Act IV",    name: "Storm",        point: "Hard strobe on the downbeat. 12-frame chase across the upstage truss. Smoke at full. No follows.", look: "Strobe ✦ Cold white" },
    { tc: "01:08:30", n: "Q-57", kicker: "Act V",     name: "Eclipse",      point: "Full blackout. 22 seconds. The room holds its breath. A single bulb falls on a string from the grid.", look: "Black ✦ Practical" },
    { tc: "01:30:14", n: "Q-69", kicker: "Act VI",    name: "Dawn",         point: "120 floor washes ignite in a 6-second sweep, audience-left to right, mapping a true sunrise across the seats.", look: "Sunrise sweep" },
    { tc: "02:04:38", n: "Q-82", kicker: "Encore",    name: "Aurora",       point: "Full rig at 100%. Volumetric haze for the duration. Audience faces lit by reflection only.", look: "Full rig ✦ Volumetric" },
  ],
  numbers: [
    { k: "Run",      n: "12",  unit: "nights",  l: "Consecutive performances, Mar → Apr 2025." },
    { k: "Audience", n: "216", unit: "K",       l: "Tickets across the run, ~18,000 per night." },
    { k: "Cues",     n: "824", unit: "calls",   l: "Lighting cues called nightly from the SM console." },
    { k: "Crew",     n: "38",  unit: "person",  l: "Touring production crew plus venue locals." },
  ],
  credits: [
    { k: "Creative Direction",  v: "Justin Restaino" },
    { k: "Show Design",         v: "Justin Restaino, with Owen Park" },
    { k: "Show Producer",       v: "Halle Vance" },
    { k: "Production Design",   v: "Studio Bellwether" },
    { k: "Lighting Design",     v: "Manon Reyes ✦ FALCONER LX" },
    { k: "Video Design",        v: "Atelier Mesa" },
    { k: "Music Direction",     v: "Idris Cole" },
    { k: "Sound Design",        v: "Auger Audio" },
    { k: "Choreography",        v: "Romy Sato" },
    { k: "Costume Design",      v: "House of Quill" },
    { k: "Technical Direction", v: "K. Adachi" },
    { k: "Stage Management",    v: "Eve Marot" },
  ],
  press: [
    { src: "The Standard — Critic's Pick", q: "A residency that ", mark: "treats light as a member of the band", q2: " — and never lets you forget it." },
    { src: "Atlas Quarterly",              q: "Twelve nights feel like ", mark: "twelve drafts of the same prayer", q2: ", each one wider." },
    { src: "Stage Review Weekly",          q: "The ", mark: "dawn-sweep in Act VI", q2: " is the closest the form has come to a sunrise indoors." },
  ],
  next: {
    num: "02",
    id: "holdout",
    title: "Holdout",
    form: "Main Stage Show",
    year: "2026",
    client: "Music Festival",
  },
};

/* ─────────────── Hooks ─────────────── */

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

/* ─────────────── Nav ─────────────── */

function Nav({ time }) {
  return (
    <nav className="nav">
      <a href="index.html" className="brand" data-hover>
        <span className="dot"></span>Justin Restaino
      </a>
      <div className="nav-links">
        <span className="nav-link" data-hover style={{ background: "rgba(255,255,255,0.08)" }}>
          <span className="idx">{PROJECT.num}</span>
          <span className="lbl"><span className="lbl-inner">{PROJECT.title}</span></span>
        </span>
      </div>
      <div className="nav-links">
        <a href="work.html" className="nav-link" data-hover>
          <span className="lbl"><span className="lbl-inner">← Index</span></span>
        </a>
        <a href="index.html#contact" className="nav-link" data-hover>
          <span className="lbl"><span className="lbl-inner">{time || "NY"}</span></span>
        </a>
      </div>
    </nav>
  );
}

/* ─────────────── Editorial sections ─────────────── */

function CaseHeader() {
  return (
    <header className="case-header" id="top">
      <div className="container">
        <div className="case-slug reveal">
          <span><span className="strong">File 01 / 18</span></span>
          <span className="sep">✦</span>
          <span>{PROJECT.tags.join(" / ")}</span>
          <span className="sep">✦</span>
          <span>{PROJECT.year}</span>
        </div>
        <h1 className="case-title">
          <span className="mask-line"><span>{PROJECT.title}</span></span>
          <span className="mask-line d1 case-sub"><span>{PROJECT.subtitle}.</span></span>
        </h1>
        <div className="case-byline reveal reveal-d-2">
          <span>By {PROJECT.role}</span>
          <span className="sep">·</span>
          <span>{PROJECT.duration} ✦ {PROJECT.venue} ✦ {PROJECT.city}</span>
        </div>
      </div>
      <figure className="case-plate" data-fx-parallax>
        <div className="case-plate-stage swatch-1"></div>
        <div className="case-plate-grain"></div>
        <div className="case-plate-cap">
          <span><span className="dot"></span>PLATE 01 ✦ Q-82 ✦ Encore "Aurora"</span>
          <span>02:04:38 ✦ 4.2K · 23.976</span>
        </div>
      </figure>
    </header>
  );
}

function Opening() {
  return (
    <section className="case-opening" id="brief">
      <div className="container case-twocol">
        <aside className="case-side reveal">
          <div className="case-side-eyebrow">— Quick facts</div>
          <dl className="case-side-list">
            {PROJECT.briefCells.map((c) => (
              <div key={c.k} className="case-side-row">
                <dt>{c.k}</dt>
                <dd>{c.v}</dd>
              </div>
            ))}
          </dl>
        </aside>
        <div className="case-body">
          <div className="case-section-label reveal">— § I. The brief</div>
          <p className="case-lead reveal">
            <span className="dropcap">A</span>{PROJECT.body1[0].slice(1)}
          </p>
          <p className="case-p reveal reveal-d-1">{PROJECT.body1[1]}</p>
        </div>
      </div>
    </section>
  );
}

function PullQuote() {
  return (
    <section className="case-pull">
      <div className="container">
        <blockquote className="case-pullquote reveal">
          <span className="open-q">"</span>
          Build a residency that uses <em className="reel-em">light</em> as the narrator —
          twelve nights, <span className="dim">one body of work,</span> no two endings the same.
          <span className="close-q">"</span>
        </blockquote>
        <div className="case-pull-attr reveal reveal-d-1">— From the original brief, January 2025</div>
      </div>
    </section>
  );
}

function ApproachSpread() {
  return (
    <section className="case-approach" id="approach">
      <div className="container case-twocol case-twocol-flip">
        <div className="case-body">
          <div className="case-section-label reveal">— § II. The approach</div>
          {PROJECT.approach.map((p, i) => (
            <p className={"case-p reveal " + (i === 0 ? "case-lead-light" : "")} key={i} style={{ transitionDelay: i * 80 + "ms" }}>{p}</p>
          ))}
        </div>
        <aside className="case-side reveal">
          <div className="case-side-eyebrow">— I led</div>
          <ol className="case-led">
            {PROJECT.ledBy.map((l, i) => (
              <li key={i}>
                <span className="num">{String(i + 1).padStart(2, "0")}</span>
                <span className="t">{l}</span>
              </li>
            ))}
          </ol>
        </aside>
      </div>
    </section>
  );
}

function PlateRow({ idx, swatch, label, sub, tc, size = "full" }) {
  return (
    <figure className={"case-figure case-fig-" + size}>
      <div className={"case-figure-img " + swatch}>
        <div className="case-figure-overlay">
          <span><span className="dot"></span>{label}</span>
          <span>{tc}</span>
        </div>
      </div>
      <figcaption>
        <span className="case-fig-num">Fig. {String(idx).padStart(2, "0")}</span>
        <span className="case-fig-cap">{sub}</span>
      </figcaption>
    </figure>
  );
}

function PhotoEssay() {
  return (
    <section className="case-essay" id="plates">
      <PlateRow idx={2} swatch="swatch-2" label="PLATE 02 ✦ Q-08 First Light" sub="Amber bloom — house lifts in 14 seconds. The audience reads the room." tc="00:04:12 ✦ 23.976" size="full" />
      <div className="container case-twocol case-essay-pair">
        <PlateRow idx={3} swatch="swatch-3" label="PLATE 03 ✦ Q-22 Procession" sub="Sodium cross-fade. Performers revealed only on the turn." tc="00:21:48 ✦ 23.976" size="half" />
        <PlateRow idx={4} swatch="swatch-4" label="PLATE 04 ✦ Q-41 Storm" sub="Strobe on the downbeat. Cold white. No follows." tc="00:46:00 ✦ 23.976" size="half" />
      </div>
      <PlateRow idx={5} swatch="swatch-5" label="PLATE 05 ✦ Q-57 Eclipse" sub="22-second blackout. A single practical bulb falls on a string from the grid." tc="01:08:30 ✦ 23.976" size="full" />
    </section>
  );
}

function RunOfShow() {
  return (
    <section className="case-runofshow" id="cuesheet">
      <div className="container">
        <div className="case-section-label reveal">— § III. Run of show</div>
        <div className="case-runhead reveal">
          <h2 className="case-h2">From the stage manager's book.</h2>
          <div className="case-runhead-meta">
            <div><span className="k">Acts</span><span className="v">{PROJECT.cues.length}</span></div>
            <div><span className="k">Length</span><span className="v">134 min</span></div>
            <div><span className="k">Cues</span><span className="v">824</span></div>
          </div>
        </div>
        <table className="case-cuesheet">
          <thead>
            <tr>
              <th>Timecode</th>
              <th>Cue</th>
              <th>Act</th>
              <th>Name</th>
              <th>Point</th>
              <th>Look</th>
            </tr>
          </thead>
          <tbody>
            {PROJECT.cues.map((c) => (
              <tr key={c.n} className="reveal">
                <td className="tc">{c.tc}</td>
                <td className="cn">{c.n}</td>
                <td className="ac"><span className="kicker">{c.kicker}</span></td>
                <td className="nm">{c.name}.</td>
                <td className="pt">{c.point}</td>
                <td className="lk">{c.look}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}

function Closer() {
  return (
    <section className="case-closer">
      <PlateRow idx={6} swatch="swatch-6" label="PLATE 06 ✦ Q-69 Dawn" sub="120-unit floor sweep — sunrise mapped indoors, audience-left to right." tc="01:30:14 ✦ 23.976" size="full" />
    </section>
  );
}

function Receipts() {
  return (
    <section className="case-receipts" id="numbers">
      <div className="container">
        <div className="case-section-label reveal">— § IV. The receipts</div>
        <div className="case-receipts-row">
          {PROJECT.numbers.map((s, i) => (
            <div className="case-receipts-cell reveal" key={s.k} style={{ transitionDelay: i * 80 + "ms" }}>
              <div className="r-k">— {s.k}</div>
              <div className="r-n">
                <span>{s.n}</span>
                <span className="unit">{s.unit}</span>
              </div>
              <div className="r-l">{s.l}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function Press() {
  return (
    <section className="case-press" id="press">
      <div className="container">
        <div className="case-section-label reveal">— § V. Press</div>
        <ul className="case-press-list">
          {PROJECT.press.map((p, i) => (
            <li className="case-press-item reveal" key={i} style={{ transitionDelay: i * 80 + "ms" }}>
              <div className="src">{p.src}</div>
              <blockquote>
                <span className="q">"</span>{p.q}<em className="mark">{p.mark}</em>{p.q2}<span className="q">"</span>
              </blockquote>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

function Credits() {
  const cols = [[], [], []];
  PROJECT.credits.forEach((c, i) => cols[i % 3].push(c));
  return (
    <section className="case-credits" id="credits">
      <div className="container">
        <div className="case-section-label reveal">— § VI. Credits</div>
        <div className="case-credits-head reveal">
          <h2 className="case-h2">Built by a long room. Crew of {PROJECT.credits.length}+.</h2>
        </div>
        <div className="case-credits-cols">
          {cols.map((col, i) => (
            <div className="case-credits-col" key={i}>
              {col.map((c) => (
                <div className="cr-row reveal" key={c.k}>
                  <div className="cr-k">{c.k}</div>
                  <div className="cr-v">{c.v}</div>
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function NextProject({ time }) {
  const n = PROJECT.next;
  return (
    <section className="case-next" id="next">
      <div className="container">
        <div className="case-next-eyebrow reveal">
          <span>— § VII.</span>
          <span className="rule"></span>
          <span>Next file ✦ {n.num} of 18</span>
        </div>
        <a className="case-next-link" href={"index.html#" + n.id} data-hover>
          <div className="case-next-row">
            <span className="case-next-num">{n.num}<span className="of">/18</span></span>
            <h2 className="case-next-title">
              {n.title}
              <span className="arrow">[ READ CASE → ]</span>
            </h2>
            <div className="case-next-meta">
              <span className="strong">{n.form}</span><br />
              {n.client} ✦ {n.year}
            </div>
          </div>
        </a>
        <div className="case-next-foot">
          <a href="work.html" data-hover>← Back to the Index</a>
          <span>© Justin Restaino ✦ All Worlds Reserved</span>
          <a href="index.html#contact" data-hover>Contact ✦ {time}</a>
        </div>
      </div>
    </section>
  );
}

/* ─────────────── App ─────────────── */

const SETTINGS = {
  font: "unbounded",
  cursor: true,
  grain: true,
  smooth: true,
};

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
  useReadingProgress();

  useEffect(() => {
    const update = () => {
      try {
        const fmt = new Intl.DateTimeFormat("en-US", {
          timeZone: "America/New_York",
          hour: "2-digit", minute: "2-digit", hour12: false,
        });
        setTime(fmt.format(new Date()) + " EST");
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

      <main className="case-page">
        <CaseHeader />
        <Opening />
        <PullQuote />
        <ApproachSpread />
        <PhotoEssay />
        <RunOfShow />
        <Closer />
        <Receipts />
        <Press />
        <Credits />
        <NextProject time={time} />
      </main>

    </React.Fragment>
  );
}

ReactDOM.createRoot(document.getElementById("root")).render(<App />);
