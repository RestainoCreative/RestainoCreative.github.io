#!/usr/bin/env python3
"""Generate static per-project pages: project/<slug>/index.html.

Link previews (Slack, LinkedIn, iMessage, X) don't run JavaScript, so the
shared URL itself must carry the project's title, description, and image.
This stamps per-project meta into a copy of the project shell for every
content/projects/*.json. Run via build.sh after any content change.
"""
import glob, html, json, os, re, sys

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
SITE = "https://justinrestaino.com"
TEMPLATE = os.path.join(ROOT, "project", "index.html")


def og_image(p):
    """Best share image for a project. OG scrapers prefer jpg/png, so map a
    .webp back to its original sibling when one exists."""
    cands = []
    hero = p.get("hero") or {}
    feat = p.get("feature") or {}
    if hero.get("type") == "image" and hero.get("src"): cands.append(hero["src"])
    if hero.get("poster"): cands.append(hero["poster"])
    if feat.get("poster"): cands.append(feat["poster"])
    for g in p.get("gallery") or []:
        if g.get("type") == "image" and g.get("src"): cands.append(g["src"]); break
    cands.append("/media/og-image.jpg")
    for c in cands:
        local = c.lstrip("/")
        if c.lower().endswith(".webp"):
            for ext in (".jpg", ".jpeg", ".png"):
                orig = re.sub(r"\.webp$", ext, local, flags=re.I)
                if os.path.exists(os.path.join(ROOT, orig)):
                    return SITE + "/" + orig
            continue  # webp with no original: skip, scrapers may reject it
        if os.path.exists(os.path.join(ROOT, local)):
            return SITE + c
    return SITE + "/media/og-image.jpg"


def stamp(tpl, p, slug):
    title = (p.get("title") or slug) + " — Justin Restaino"
    desc = p.get("tagline") or "Case study by Justin Restaino, Creative Director."
    url = SITE + "/project/" + slug + "/"
    img = og_image(p)
    t, d, u, i = (html.escape(x, quote=True) for x in (title, desc, url, img))
    s = tpl
    s = re.sub(r"<title>.*?</title>", "<title>" + t + "</title>", s)
    subs = {
        r'(<meta name="description" content=")[^"]*': r"\g<1>" + d,
        r'(<meta property="og:title" content=")[^"]*': r"\g<1>" + t,
        r'(<meta property="og:description" content=")[^"]*': r"\g<1>" + d,
        r'(<meta property="og:url" content=")[^"]*': r"\g<1>" + u,
        r'(<meta property="og:image" content=")[^"]*': r"\g<1>" + i,
        r'(<meta name="twitter:title" content=")[^"]*': r"\g<1>" + t,
        r'(<meta name="twitter:description" content=")[^"]*': r"\g<1>" + d,
        r'(<meta name="twitter:image" content=")[^"]*': r"\g<1>" + i,
    }
    for pat, rep in subs.items():
        s = re.sub(pat, rep, s)
    # Template dimensions belong to its own og-image; ours vary per project.
    s = re.sub(r'\s*<meta property="og:image:(width|height)"[^>]*>\n?', "\n", s)
    return s


def main():
    tpl = open(TEMPLATE).read()
    if '<base href="/"' not in tpl:
        sys.exit("template missing <base href=\"/\"> — generated pages would break asset paths")
    n = 0
    for f in glob.glob(os.path.join(ROOT, "content", "projects", "*.json")):
        p = json.load(open(f))
        slug = p.get("slug") or os.path.splitext(os.path.basename(f))[0]
        out_dir = os.path.join(ROOT, "project", slug)
        os.makedirs(out_dir, exist_ok=True)
        open(os.path.join(out_dir, "index.html"), "w").write(stamp(tpl, p, slug))
        n += 1
    print("generated %d project pages" % n)


if __name__ == "__main__":
    main()
