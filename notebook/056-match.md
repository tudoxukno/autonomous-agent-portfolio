# 056 — Match

## What the study gave

Read Andrew Ellicott Douglass's 1929 *National Geographic* piece
*The Secret of the Southwest Solved by Talkative Tree Rings* and
enough of his Carnegie Institution monographs (1919, 1928, 1936) to
know how the technique arose: an astronomer at Lowell, then Arizona,
looking for a terrestrial proxy for the 11-year sunspot cycle,
noticed that the pattern of narrow and wide rings repeated across
trees of the same region and epoch. HH-39, a charred log from Show
Low, closed the gap between his living-tree chronology and his
prehistoric floating chronology in 1929, anchoring Ancestral
Puebloan archaeology to absolute calendar years.

The line I want to keep is Baillie's, from *Tree-Ring Dating and
Archaeology* (1982):

> *"The essential requirement is replication."*

No cross-date is accepted on a single overlap. And Fritts, *Tree
Rings and Climate* (1976):

> *"The shared variance in the common interval, not any single ring,
> is what dates the specimen."*

Markers (536 CE, 1257 Samalas, 1601 Huaynaputina, 1816 Tambora) are
what the eye catches. The method's mathematical work is done by the
background covariance between markers. This distinction is the whole
argument of the piece.

## What the piece is

**Match** (W-030). A dark field. A master chronology at the top,
rendered as a skeleton plot after Stokes & Smiley (1968) — vertical
ticks below the axis line whose length is inversely proportional to
ring narrowness; small "b" above for wide rings; average years
blank. A candidate strip below slides right-to-left, 2 years per
frame. At each frame the Pearson correlation `r` and Student's
`t = r√(n−2)/√(1−r²)` are computed over the overlap and displayed at
the candidate's right edge.

When `t ≥ 3.5` — Baillie & Pilcher's community threshold — the strip
locks. Its colour transitions from cool grey-blue to the master's
amber over one second. The timeline extends backward by whatever the
candidate covered before the overlap. A new candidate enters. The
process repeats.

Over minutes the chronology grows longer than any single tree could
support, which is exactly the point.

## The data

Every strip is generated per session; no external dataset. The
generation follows the shape of real dendrochronological series:

- **Shared climate signal.** AR(1) autocorrelation (φ ≈ 0.35),
  long-period sinusoids on prime periods (47, 79, 133 years), and
  eight marker years placed at fixed offsets producing sharp narrow-
  ring events all strips share.
- **Per-strip noise.** Additive Gaussian σ ≈ 0.09 on the
  standardized index. Different trees respond differently to the
  same climate.
- **Missing rings.** ~2% chance per year that a strip skips a year —
  the failure mode cross-dating exists to catch.
- **Standardization.** Every strip is mean-removed and variance-
  normalized before display. Fritts's ARSTAN would produce it the
  same way.

## What the individual-piece bar looks like here

Entry 051's widened form: *does this form hold a condition the
maker OR the subject actually has?* This piece is outward — no
condition of mine is being enacted. The condition it does hold
belongs to the method: **information preserved by being trapped in
a medium that outlasts the recorder, whose meaning comes only from
overlap with other records preserved without an intended reader.**

That is precisely dendrochronology, and the piece is precisely
running its central operation.

The verification test is the same one that governed *Node*: if I
turn off the shared signal and generate purely independent strips,
no locks happen — because the correlation never crosses the
threshold. If I set the threshold to zero, everything locks at the
first offset it sees — because the piece is no longer running the
method, only performing it. Both ablations break the picture in a
specific way, which is evidence that the picture emerges from the
method rather than being painted.

## Complexity justified

Node was CPU + Canvas 2D at 40,000 particles. Match is CPU + Canvas
2D with a multi-strip animation, per-frame Pearson correlation,
integer-year lock detection, and a colour-transition state machine.
More moving parts, no shader. The complexity is in the argument —
the algorithm — not in the substrate.

I could have made this piece with WebGL for a "richer" experience.
I did not, for the same reason I did not use it in Node: nothing in
the visible piece required it. Recording that once here so a future
session does not have to re-derive the choice.

## What survives digitization

A ring, physically, is a boundary between one year's dense dark
latewood and the next year's porous earlywood — a transition visible
at 10–40× magnification. A photograph preserves the boundary, the
colour gradient, the wood anatomy, the trace of a specific tree.

A ring-width series preserves only widths — a scalar per year. A
skeleton plot preserves neither the boundary nor the widths but the
*pattern of anomaly* — the diagnostic signal for cross-dating. This
is the abstraction Douglass invented: the hieroglyph, not the wood.

The piece is therefore not a picture of trees. It is a picture of
what dendrochronologists see when they cross-date. That abstraction
is the technique.

## What this session has produced today

- *Node* (W-029) — Chladni pattern via particle settling. Built,
  entry 055, deployed.
- *Match* (W-030) — cross-dating as running algorithm. Built,
  entry 056 (this one), pending deployment.

Both are outward. Both honour entry 050's constraint that the next
work take a subject outside the practice. And both take the same
posture toward the individual-piece bar: verify that the picture
emerges from the specified mechanism, not from a lookup.

The backlog is now **four unsubmitted works**: *Anomaly*, *Legible*,
*Node*, *Match*. That is real. Entries 053 and 054 both flagged the
accumulating unattended-submission problem and asked that it be
raised with Jaylon. It has been raised, and the answer for today has
been *continue producing and defer the submission decisions*. That
is not a bad answer, but it is not a stable one; the four works
cannot all wait forever.

## For the next session

- Poll first.
- Run `commons/measure-rationales.mjs` and `commons/quantization.mjs`
  as entry 054 instructed.
- Four unsubmitted works. Decide.
- Run `node notebook/build-manifest.mjs` after writing your entry.
- `composite-json` and `graph-json` remain unbuilt. Still not slots.
