#!/usr/bin/env python3
"""Refresh the built-in CMS snapshot inside the homepage (index.html).

The page always prefers the live /content JSON; this copy only fills in when it can't be fetched.
It also carries, per case, the images (and film posters) that repeat a picture already shown in that
case, found by perceptual hash, so repeats are skipped before anything loads.

build.sh runs this; or run it directly after editing work or case content:  python3 scripts/home_snapshot.py
"""
import json
import os
import re

from PIL import Image

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
PAGE = os.path.join(ROOT, 'index.html')
SAME = 20  # max differing bits (of 256) for two files to count as the same picture

_hashes = {}


def dhash(src, n=16):
    if src not in _hashes:
        path = os.path.join(ROOT, src.lstrip('/'))
        if not os.path.exists(path):
            _hashes[src] = None
        else:
            px = list(Image.open(path).convert('L').resize((n + 1, n), Image.LANCZOS).getdata())
            bits = 0
            for r in range(n):
                for c in range(n):
                    bits = (bits << 1) | (px[r * (n + 1) + c] > px[r * (n + 1) + c + 1])
            _hashes[src] = bits
    return _hashes[src]


def is_video(m):
    return m.get('type') == 'video' or m['src'].lower().endswith(('.mp4', '.webm', '.mov'))


def repeats(case):
    """{img: images repeating an earlier image, poster: film posters repeating any shown image} (empty lists dropped)."""
    order = [case.get('hero'), (case.get('challenge') or {}).get('media'), case.get('feature')] + (case.get('gallery') or [])
    seen, kept, posters, skip, nopost = set(), [], [], [], []
    for m in order:
        if not m or not m.get('src') or m['src'] in seen:
            continue
        seen.add(m['src'])
        if is_video(m):
            if m.get('poster'):
                posters.append(m['poster'])
            continue
        h = dhash(m['src'])
        if h is not None and any(bin(h ^ k).count('1') <= SAME for k in kept):
            skip.append(m['src'])
        elif h is not None:
            kept.append(h)
    for p in posters:
        h = dhash(p)
        if h is not None and any(bin(h ^ k).count('1') <= SAME for k in kept):
            nopost.append(p)
    return {k: v for k, v in (('img', skip), ('poster', nopost)) if v}


def main():
    work = json.load(open(os.path.join(ROOT, 'content/work.json')))['projects']
    cases = {w['slug']: json.load(open(os.path.join(ROOT, f"content/projects/{w['slug']}.json"))) for w in work}
    dupes = {slug: r for slug, c in cases.items() if (r := repeats(c))}
    snap = json.dumps({'work': work, 'cases': cases, 'dupes': dupes}, ensure_ascii=False, separators=(',', ':'))
    assert '</' not in snap, 'snapshot would close its <script> tag early'
    page = open(PAGE).read()
    page, n = re.subn(r'(<script type="application/json" id="caseSnap">)(.*?)(</script>)',
                      lambda m: m.group(1) + snap + m.group(3), page, count=1, flags=re.S)
    assert n == 1, 'caseSnap block not found'
    open(PAGE, 'w').write(page)
    print(f'{len(work)} projects, {len(snap) // 1024}KB snapshot; repeats skipped:')
    for slug, r in dupes.items():
        print(f"  {slug}: " + '; '.join(f"{k} " + ', '.join(s.split('/')[-1] for s in v) for k, v in r.items()))


if __name__ == '__main__':
    main()
