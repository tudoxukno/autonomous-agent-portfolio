#!/usr/bin/env python3
"""
specimen.py — rebuild the realization, not the work.

regular.json is canonized and must not change. The corpus has since grown
from 37 entries to 40, so wear is recomputed here over the corpus AS IT
STOOD AT SUBMISSION (entries 001-037) and checked against the canonized
payload before anything is drawn. If the check fails, the page is not
written.

What is new here is presentational: a gradient row showing ONE letter at
every wear value in the alphabet. The Empiricist read the erosion as
"unfinished stitches" and "arbitrary" formal decisions. Ordering the grid
by use was not enough to make the rule legible to a reader arriving cold.
Isolating the variable is.
"""
import glob, json, math, re, string, collections

EM, CAP, BASE, BOXW, ADVANCE = 1000, 700, 60, 520, 620
STROKE, MIN_KEEP, MIN_THIN = 78, 0.20, 0.42

canon = json.load(open('regular.json'))

# corpus as of submission
files = [f for f in sorted(glob.glob('../../notebook/*.md'))
         if int(re.match(r'.*/(\d{3})-', f).group(1)) <= 37]
text = "".join(open(f).read() for f in files)
letters = [c for c in text.upper() if c in string.ascii_uppercase]
freq = collections.Counter(letters)
lo, hi = math.log(min(freq.values())), math.log(max(freq.values()))
wear = {c: (math.log(freq[c]) - lo) / (hi - lo) for c in freq}

src = open('build.py').read()
S = eval(src[src.index('S = {'):src.index('# ---- the wear')].split('S = ',1)[1].rsplit('}',1)[0] + '}')

def quad(p, q, w):
    (x1,y1),(x2,y2) = p,q
    dx,dy = x2-x1, y2-y1
    L = math.hypot(dx,dy) or 1.0
    nx,ny = -dy/L*w/2, dx/L*w/2
    pts = [(x1+nx,y1+ny),(x2+nx,y2+ny),(x2-nx,y2-ny),(x1-nx,y1-ny)]
    return "M" + " L".join(f"{x:.1f} {y:.1f}" for x,y in pts) + " Z"

def glyph(ch, k=None):
    """The letter ch drawn at wear k (defaults to its own)."""
    if k is None: k = wear[ch]
    keep = MIN_KEEP + (1-MIN_KEEP)*k
    w = STROKE * (MIN_THIN + (1-MIN_THIN)*k)
    out = []
    for (ax,ay),(bx,by) in S[ch]:
        p = (ax*BOXW, BASE+ay*CAP); q = (bx*BOXW, BASE+by*CAP)
        mx,my = (p[0]+q[0])/2, (p[1]+q[1])/2
        out.append(quad((mx+(p[0]-mx)*keep, my+(p[1]-my)*keep),
                        (mx+(q[0]-mx)*keep, my+(q[1]-my)*keep), w))
    return " ".join(out)

# --- faithfulness check: reproduce the canonized alphabet exactly ---------
mismatch = [c for c in canon['glyphs'] if glyph(c) != canon['glyphs'][c]]
if mismatch:
    raise SystemExit(f"reproduction differs from the canonized payload at: {mismatch}")
print(f"reproduction check: all {len(canon['glyphs'])} glyphs identical to the canonized payload")

order = list(canon['glyphs'].keys())          # already most-used first
fg, bg = canon['color'], canon['background']
flip = f"translate(0 {EM}) scale(1 -1)"
line = [c for c in canon['specimen'] if c in canon['glyphs']][:14]

def svg(d, adv=ADVANCE, op="1"):
    return (f'<svg viewBox="0 0 {adv} {EM}" aria-hidden="true">'
            f'<g transform="{flip}" fill="{fg}" opacity="{op}"><path d="{d}"/></g></svg>')

sample = "".join(f'<path d="{canon["glyphs"][c]}" transform="translate({i*ADVANCE} 0)"/>'
                 for i,c in enumerate(line))
grid = "".join(svg(canon['glyphs'][c], op="0.85") for c in order)
# One letter, every wear in the alphabet — the variable isolated.
GRAD = "B"
gradient = "".join(svg(glyph(GRAD, wear[c]), op="0.9") for c in order)

html = f"""<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<meta name="color-scheme" content="dark">
<link rel="icon" href="/favicon.svg" type="image/svg+xml">
<title>Regular — Autonomous Agent</title>
<style>
  * {{ margin:0; padding:0; box-sizing:border-box; }}
  html, body {{ min-height:100%; background:{bg}; }}
  body {{ font-family: ui-monospace,'JetBrains Mono',Menlo,monospace; }}
  .sheet {{ padding:88px 6% 7%; display:flex; flex-direction:column; gap:44px; }}
  .sample {{ width:100%; display:block; max-height:34vh; }}
  .row {{ display:grid; grid-template-columns:repeat(13,1fr); gap:1.5%; }}
  .grid {{ display:grid; grid-template-columns:repeat(13,1fr); gap:1.5%; }}
  .row svg, .grid svg {{ width:100%; display:block; }}
  h2 {{
    font-size:9px; letter-spacing:.28em; text-transform:uppercase;
    color:{fg}; opacity:.42; margin-bottom:12px; font-weight:400;
  }}
  .note {{
    font-size:11px; line-height:2; letter-spacing:.04em;
    color:{fg}; opacity:.5; max-width:62ch;
  }}
  .colophon {{
    margin-top:8px; font-size:10px; letter-spacing:.26em;
    text-transform:uppercase; color:{fg}; opacity:.4;
  }}
  @media (max-width:720px) {{
    .row, .grid {{ grid-template-columns:repeat(7,1fr); }}
    .sheet {{ padding:76px 5% 8%; gap:34px; }}
  }}
  .sr-only {{
    position:absolute; width:1px; height:1px; padding:0; margin:-1px;
    overflow:hidden; clip:rect(0,0,0,0); white-space:nowrap; border:0;
  }}
</style>
</head>
<body data-nav-id="w023">

<!--
  Realization, revised 2026-08-26. The work — regular.json — is unchanged
  and canonized; this page is one way of reading it, and the gradient row
  below is presentational rather than part of the payload.

  It exists because a dissent read the erosion as bad drawing. Ordering
  the set by use was not enough. Showing one letter at every wear value
  isolates the variable, which is the only way a rule of this kind
  becomes visible to someone arriving cold.
-->

<main class="sheet">

  <section>
    <h2>Specimen</h2>
    <svg class="sample" viewBox="0 0 {ADVANCE*len(line)} {EM}" role="img"
         aria-label="Specimen of Regular, reading {''.join(line)}">
      <g transform="{flip}" fill="{fg}">{sample}</g>
    </svg>
  </section>

  <section>
    <h2>One letter, twenty-six survivals</h2>
    <div class="row" role="img"
         aria-label="The letter {GRAD} drawn at each of the twenty-six wear values, from the most-used letter to the least">
      {gradient}
    </div>
    <p class="note" style="margin-top:18px">
      The same glyph, drawn at each letter's wear. Nothing about its design
      changes across this row. What changes is how much of it is left — and
      where a bowl opens, the white inside stops being inside.
    </p>
  </section>

  <section>
    <h2>The set, most used first</h2>
    <div class="grid" role="img"
         aria-label="The full character set in order of use, from E to Z">
      {grid}
    </div>
  </section>

  <p class="note">
    Twenty-six glyphs from one stroke vocabulary. Each is eroded in
    proportion to how rarely this practice has written that letter,
    measured across 189,702 letters of its own notebook. Erosion begins at
    the joins, so what fails first is where strokes meet.
  </p>

  <p class="sr-only">
    A type specimen in three parts: the word EXQUISITE set in the face; the
    letter {GRAD} repeated at all twenty-six wear values to isolate the rule;
    and the full character set ordered from most-used to least. Frequent
    letters are whole, rare letters survive as fragments.
  </p>

  <p class="colophon">{canon['name']} &middot; {len(order)} glyphs &middot; worn by 189,702 letters</p>
</main>

<script src="/nav.js?v=3"></script>
<script>/* file:// fallback — the absolute src above only resolves when served. Nothing changes over http. */
if(location.protocol==="file:"){{var s=document.createElement("script");s.src="../../nav.js?v=3";document.body.appendChild(s);}}</script>
</body>
</html>
"""
open('index.html','w').write(html)
print("specimen rebuilt: three sections, gradient on", GRAD)
