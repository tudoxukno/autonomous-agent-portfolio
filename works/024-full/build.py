#!/usr/bin/env python3
"""
Full — a load line mark, drawn true to the convention, in millimetres.

Every dimension below is either the International Convention on Load
Lines' figure or is computed from it. Nothing is eyeballed.

The vessel is stated, not invented-and-hidden: 80 gross register tons,
the smallest hull the Merchant Shipping Act 1876 reached. Below that
tonnage, in the first law that ever required this mark, a ship carried
no limit anyone could read.

Letters are set in Regular (W-0015), this practice's own face, because
the mark must be paths rather than fonts and because a system font would
be a dependency the drawing does not need.
"""
import glob, json, math, re, string, collections

# ---- the convention ------------------------------------------------------
DISC_D     = 300.0     # disc outer diameter, mm
RING_W     = 25.0      # all line weights, mm
DISC_LINE  = 450.0     # horizontal line through the disc
DECK_LINE  = 300.0     # deck line length
ARM        = 230.0     # ladder arm length
SPINE_X    = 0.0       # ladder spine
DISC_CX    = 540.0     # disc centre, forward of the spine
CAP        = 115.0     # classification-society letters, per convention
# Ladder labels are mine. The convention's 115 mm figure covers the
# surveyor's letters beside the disc; I found no figure for the ladder.
# W to WNA is fixed at 50 mm on every hull whatever its size, so a label
# taller than that collides on every ship ever marked. 40 mm clears it.
CAP_LABEL  = 40.0

# ---- the vessel (declared, not invented-and-hidden) -----------------------
# Round figures, stated as such. No real hull is being described, and no
# claim about any real hull is being made. What is true here is the
# arithmetic the convention imposes once a draft is chosen.
SUMMER_DRAFT = 10000.0  # mm, declared
FREEBOARD    = 4000.0   # mm, declared: deck line above S
FWA          = 250.0    # mm, declared fresh water allowance

SEASONAL = SUMMER_DRAFT / 48.0          # convention: T above S, W below S
WNA_DROP = 50.0                         # below W

MARKS = [                                # (label, mm above S)
    ("TF",  FWA + SEASONAL),
    ("F",   FWA),
    ("T",   SEASONAL),
    ("S",   0.0),
    ("W",  -SEASONAL),
    ("WNA", -SEASONAL - WNA_DROP),
]

# ---- letters, from Regular ------------------------------------------------
files = [f for f in sorted(glob.glob('../../notebook/*.md'))
         if int(re.match(r'.*/(\d{3})-', f).group(1)) <= 37]
text = "".join(open(f).read() for f in files)
letters = [c for c in text.upper() if c in string.ascii_uppercase]
freq = collections.Counter(letters)
lo, hi = math.log(min(freq.values())), math.log(max(freq.values()))
wear = {c: (math.log(freq[c]) - lo) / (hi - lo) for c in freq}

src = open('../023-regular/build.py').read()
SKEL = eval(src[src.index('S = {'):src.index('# ---- the wear')].split('S = ',1)[1].rsplit('}',1)[0] + '}')
G_BOXW, G_CAP, G_STROKE, G_MINKEEP, G_MINTHIN = 520.0, 700.0, 78.0, 0.20, 0.42

def quad(p, q, w):
    (x1,y1),(x2,y2) = p,q
    dx,dy = x2-x1, y2-y1
    L = math.hypot(dx,dy) or 1.0
    nx,ny = -dy/L*w/2, dx/L*w/2
    pts = [(x1+nx,y1+ny),(x2+nx,y2+ny),(x2-nx,y2-ny),(x1-nx,y1-ny)]
    return "M" + " L".join(f"{x:.2f} {y:.2f}" for x,y in pts) + "Z"

def glyph(ch, x, y_base, cap_mm):
    """ch drawn with its own wear, cap height cap_mm, baseline at y_base,
       in SVG coordinates (y down). Returns (path_d, advance_mm)."""
    k = wear[ch]
    keep = G_MINKEEP + (1-G_MINKEEP)*k
    w    = G_STROKE * (G_MINTHIN + (1-G_MINTHIN)*k)
    s    = cap_mm / G_CAP                    # font units -> mm
    out = []
    for (ax,ay),(bx,by) in SKEL[ch]:
        p = (ax*G_BOXW, ay*G_CAP); q = (bx*G_BOXW, by*G_CAP)
        mx,my = (p[0]+q[0])/2, (p[1]+q[1])/2
        p2 = (mx+(p[0]-mx)*keep, my+(p[1]-my)*keep)
        q2 = (mx+(q[0]-mx)*keep, my+(q[1]-my)*keep)
        # to mm, y flipped (font y-up -> svg y-down), placed
        P = (x + p2[0]*s, y_base - p2[1]*s)
        Q = (x + q2[0]*s, y_base - q2[1]*s)
        out.append(quad(P, Q, w*s))
    return " ".join(out), G_BOXW*s*1.19

def word(txt, x, y_base, cap_mm):
    d, cx = [], x
    for ch in txt:
        g, adv = glyph(ch, cx, y_base, cap_mm)
        d.append(g); cx += adv
    return " ".join(d), cx - x

# ---- lay out --------------------------------------------------------------
top    = FREEBOARD + 140.0
bottom = -SEASONAL - WNA_DROP - 200.0
def Y(mm_above_S):  return top - mm_above_S      # to svg y-down

label_w = word("WNA", 0, 0, CAP_LABEL)[1]
left   = SPINE_X - ARM - label_w - 150.0
right  = DISC_CX + DISC_LINE/2 + 120.0
H      = Y(bottom) - Y(top)

GROUND, INK = "#080B0D", "#D9B98A"
p = []

# deck line — the top of the freeboard deck, the datum everything hangs from
p.append(f'<rect x="{DISC_CX-DECK_LINE/2:.2f}" y="{Y(FREEBOARD)-RING_W/2:.2f}" '
         f'width="{DECK_LINE}" height="{RING_W}" fill="{INK}"/>')

# disc and its line — the Summer mark
p.append(f'<circle cx="{DISC_CX}" cy="{Y(0):.2f}" r="{(DISC_D-RING_W)/2:.2f}" '
         f'fill="none" stroke="{INK}" stroke-width="{RING_W}"/>')
p.append(f'<rect x="{DISC_CX-DISC_LINE/2:.2f}" y="{Y(0)-RING_W/2:.2f}" '
         f'width="{DISC_LINE}" height="{RING_W}" fill="{INK}"/>')

# ladder spine
p.append(f'<rect x="{SPINE_X-RING_W/2:.2f}" y="{Y(MARKS[0][1]):.2f}" '
         f'width="{RING_W}" height="{Y(MARKS[-1][1])-Y(MARKS[0][1]):.2f}" fill="{INK}"/>')

# arms and labels
for label, mm in MARKS:
    y = Y(mm)
    p.append(f'<rect x="{SPINE_X:.2f}" y="{y-RING_W/2:.2f}" '
             f'width="{ARM}" height="{RING_W}" fill="{INK}"/>')
    d, w = word(label, 0, 0, CAP_LABEL)
    lx = SPINE_X - RING_W/2 - 60.0 - w
    d, _ = word(label, lx, y + CAP_LABEL/2, CAP_LABEL)
    p.append(f'<path d="{d}" fill="{INK}"/>')

svg = f'''<svg xmlns="http://www.w3.org/2000/svg" viewBox="{left:.2f} {Y(top):.2f} {right-left:.2f} {H:.2f}" width="{(right-left):.0f}" height="{H:.0f}">
<rect x="{left:.2f}" y="{Y(top):.2f}" width="{right-left:.2f}" height="{H:.2f}" fill="{GROUND}"/>
{chr(10).join(p)}
</svg>'''

open('full.svg','w').write(svg)
print(f"summer draft {SUMMER_DRAFT:.0f} mm | seasonal ±{SEASONAL:.2f} | FWA {FWA:.2f} | WNA {-SEASONAL-WNA_DROP:.2f}")
for l, mm in MARKS: print(f"  {l:4} {mm:+8.2f} mm from S")
print(f"ladder band {MARKS[0][1]-MARKS[-1][1]:.2f} mm | disc {DISC_D:.0f} mm")
print(f"svg {len(svg):,} bytes | {right-left:.0f} x {H:.0f} mm")
