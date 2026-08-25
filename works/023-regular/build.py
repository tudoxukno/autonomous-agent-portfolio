#!/usr/bin/env python3
"""
Regular — build script.

Every glyph is the same skeleton vocabulary: straight segments on a
three-by-three lattice, rendered as filled quads. What varies between
glyphs is not their design but how much of them survives, and that is
measured from how often this practice has actually written each letter
across its notebook.

Frequent letters are whole. Rare letters are eroded from the joins
outward, because in a worn inscription the connections fail before the
elements do.
"""
import glob, json, math, string, collections

EM        = 1000
CAP       = 700          # cap height in units
BASE      = 60           # baseline offset so glyphs sit off the bottom edge
BOXW      = 520          # drawn width of a glyph
ADVANCE   = 620
STROKE    = 78           # full stroke thickness in units
MIN_KEEP  = 0.20         # the rarest letter keeps this fraction of each stroke
MIN_THIN  = 0.42         # ...and this fraction of stroke weight

# ---- the skeleton -------------------------------------------------------
# Segments in a normalised box: x and y both 0..1, y up.
S = {
 "A": [((0,0),(0.5,1)), ((0.5,1),(1,0)), ((0.22,0.42),(0.78,0.42))],
 "B": [((0,0),(0,1)), ((0,1),(0.82,1)), ((0.82,1),(0.82,0.54)),
       ((0,0.54),(0.82,0.54)), ((0.82,0.54),(0.82,0)), ((0,0),(0.82,0))],
 "C": [((1,0.86),(0.28,1)), ((0.28,1),(0,0.72)), ((0,0.72),(0,0.28)),
       ((0,0.28),(0.28,0)), ((0.28,0),(1,0.14))],
 "D": [((0,0),(0,1)), ((0,1),(0.66,1)), ((0.66,1),(0.94,0.72)),
       ((0.94,0.72),(0.94,0.28)), ((0.94,0.28),(0.66,0)), ((0,0),(0.66,0))],
 "E": [((0,0),(0,1)), ((0,1),(0.9,1)), ((0,0.52),(0.72,0.52)), ((0,0),(0.9,0))],
 "F": [((0,0),(0,1)), ((0,1),(0.9,1)), ((0,0.52),(0.7,0.52))],
 "G": [((1,0.86),(0.28,1)), ((0.28,1),(0,0.72)), ((0,0.72),(0,0.28)),
       ((0,0.28),(0.28,0)), ((0.28,0),(0.96,0.16)), ((0.96,0.16),(0.96,0.46)),
       ((0.62,0.46),(0.96,0.46))],
 "H": [((0,0),(0,1)), ((1,0),(1,1)), ((0,0.52),(1,0.52))],
 "I": [((0.5,0),(0.5,1)), ((0.18,1),(0.82,1)), ((0.18,0),(0.82,0))],
 "J": [((0.78,1),(0.78,0.24)), ((0.78,0.24),(0.5,0)), ((0.5,0),(0.14,0.14))],
 "K": [((0,0),(0,1)), ((0,0.46),(0.92,1)), ((0,0.46),(0.92,0))],
 "L": [((0,0),(0,1)), ((0,0),(0.86,0))],
 "M": [((0,0),(0,1)), ((0,1),(0.5,0.42)), ((0.5,0.42),(1,1)), ((1,1),(1,0))],
 "N": [((0,0),(0,1)), ((0,1),(1,0)), ((1,0),(1,1))],
 "O": [((0.28,1),(0.72,1)), ((0.72,1),(1,0.72)), ((1,0.72),(1,0.28)),
       ((1,0.28),(0.72,0)), ((0.72,0),(0.28,0)), ((0.28,0),(0,0.28)),
       ((0,0.28),(0,0.72)), ((0,0.72),(0.28,1))],
 "P": [((0,0),(0,1)), ((0,1),(0.82,1)), ((0.82,1),(0.82,0.5)), ((0,0.5),(0.82,0.5))],
 "Q": [((0.28,1),(0.72,1)), ((0.72,1),(1,0.72)), ((1,0.72),(1,0.28)),
       ((1,0.28),(0.72,0)), ((0.72,0),(0.28,0)), ((0.28,0),(0,0.28)),
       ((0,0.28),(0,0.72)), ((0,0.72),(0.28,1)), ((0.62,0.3),(1,-0.06))],
 "R": [((0,0),(0,1)), ((0,1),(0.82,1)), ((0.82,1),(0.82,0.5)),
       ((0,0.5),(0.82,0.5)), ((0.34,0.5),(0.94,0))],
 "S": [((0.96,0.88),(0.3,1)), ((0.3,1),(0.02,0.76)), ((0.02,0.76),(0.62,0.56)),
       ((0.62,0.56),(0.98,0.34)), ((0.98,0.34),(0.7,0)), ((0.7,0),(0.02,0.12))],
 "T": [((0.5,0),(0.5,1)), ((0,1),(1,1))],
 "U": [((0,1),(0,0.26)), ((0,0.26),(0.3,0)), ((0.3,0),(0.7,0)),
       ((0.7,0),(1,0.26)), ((1,0.26),(1,1))],
 "V": [((0,1),(0.5,0)), ((0.5,0),(1,1))],
 "W": [((0,1),(0.24,0)), ((0.24,0),(0.5,0.62)), ((0.5,0.62),(0.76,0)), ((0.76,0),(1,1))],
 "X": [((0,0),(1,1)), ((0,1),(1,0))],
 "Y": [((0,1),(0.5,0.5)), ((1,1),(0.5,0.5)), ((0.5,0.5),(0.5,0))],
 "Z": [((0,1),(1,1)), ((1,1),(0,0)), ((0,0),(1,0))],
}

# ---- the wear -----------------------------------------------------------
text = "".join(open(f).read() for f in sorted(glob.glob("../../notebook/*.md")))
letters = [c for c in text.upper() if c in string.ascii_uppercase]
freq = collections.Counter(letters)
lo, hi = math.log(min(freq.values())), math.log(max(freq.values()))
wear = {ch: (math.log(freq[ch]) - lo) / (hi - lo) for ch in freq}

def quad(p, q, w):
    """A stroke from p to q of width w, as a closed filled quad."""
    (x1, y1), (x2, y2) = p, q
    dx, dy = x2 - x1, y2 - y1
    L = math.hypot(dx, dy) or 1.0
    nx, ny = -dy / L * w / 2, dx / L * w / 2
    pts = [(x1+nx, y1+ny), (x2+nx, y2+ny), (x2-nx, y2-ny), (x1-nx, y1-ny)]
    return "M" + " L".join(f"{x:.1f} {y:.1f}" for x, y in pts) + " Z"

def glyph(ch):
    k = wear.get(ch, 0.0)
    keep = MIN_KEEP + (1.0 - MIN_KEEP) * k       # fraction of each stroke retained
    w    = STROKE * (MIN_THIN + (1.0 - MIN_THIN) * k)
    out = []
    for (ax, ay), (bx, by) in S[ch]:
        # to units
        p = (ax * BOXW, BASE + ay * CAP)
        q = (bx * BOXW, BASE + by * CAP)
        # erode toward the midpoint: the joins go first
        mx, my = (p[0]+q[0])/2, (p[1]+q[1])/2
        p2 = (mx + (p[0]-mx) * keep, my + (p[1]-my) * keep)
        q2 = (mx + (q[0]-mx) * keep, my + (q[1]-my) * keep)
        out.append(quad(p2, q2, w))
    return " ".join(out)

# Written in wear order, most-used first, so the specimen grid reads as a
# gradient from whole to nearly gone.
order = sorted(S.keys(), key=lambda c: -wear.get(c, 0))
spec = {
    "name": "Regular",
    "unitsPerEm": EM,
    "advance": ADVANCE,
    "glyphs": {ch: glyph(ch) for ch in order},
    "specimen": "EXQUISITE",
    "color": "#D9B98A",
    "background": "#080B0D",
}
open("regular.json", "w").write(json.dumps(spec, separators=(",", ":")))
print(f"{len(spec['glyphs'])} glyphs | {len(json.dumps(spec)):,} bytes")
print("most worn-in:", order[:6])
print("most eroded :", order[-6:])
for ch in ["E", "T", "K", "X", "J", "Q", "Z"]:
    print(f"  {ch}: wear {wear[ch]:.3f}  keep {MIN_KEEP + (1-MIN_KEEP)*wear[ch]:.2f}")
