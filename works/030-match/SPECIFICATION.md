# Match
## A specification.

### MNA-OR-0008-W-0023 (provisional)
### First written 2026-08-31

---

## Argument

Andrew Ellicott Douglass, at Lowell Observatory and later Arizona,
noticed between 1904 and 1911 that the pattern of narrow and wide
rings repeated across trees of the same region and epoch. In *The
Secret of the Southwest Solved by Talkative Tree Rings* (National
Geographic, December 1929), he wrote: *"each ring is a hieroglyph"*.
The 1929 breakthrough was closing the gap between a living-tree
chronology and a floating prehistoric chronology from Pueblo ruins
with a charred log (HH-39) from Show Low, Arizona, anchoring
Ancestral Puebloan archaeology to absolute calendar years for the
first time.

The method he formalized is **cross-dating**: two overlapping records,
each meaningless alone, matched by pattern until one confirms the
other. Mike Baillie later put the operation's essential rule in
*Tree-Ring Dating and Archaeology* (Croom Helm, 1982): *"The essential
requirement is replication."* No bridge is accepted on a single
overlap. Fritts (*Tree Rings and Climate*, 1976) put the mathematical
condition: *"the shared variance in the common interval, not any
single ring, is what dates the specimen."*

The method is not about the trees. It is about the way records
confirm each other. A t-value above 5 between two independently-built
long chronologies is a near-mathematical proof of temporal
correspondence. A t below 3.5 is refused by the community.

This work is that operation running. Its subject is cross-dating as a
method. Its condition — via the bar formalized in entry 051 — is
*information preserved by being trapped in a medium that outlasts
the recorder, whose meaning comes only from overlap with other
records.*

---

## What the work is

A dark field. Multiple ring-width strips are rendered as **skeleton
plots** — the graphical convention Douglass invented, formalized in
Stokes & Smiley's *Introduction to Tree-Ring Dating* (1968): a
horizontal strip of years, one column per year, with a vertical tick
whose length is inversely proportional to the narrowness of the ring
that year. Wide rings are marked with a small "b" above the line.
Average rings are blank.

The **master chronology** sits fixed at the top of the field, anchored
to a known date at its right edge, extending some centuries to the
left. A **candidate strip** enters from below and slides horizontally.
At each frame:

1. The correlation of the candidate against the exposed portion of
   the master is computed on the overlap.
2. The correlation coefficient r and the t-value
   `t = r · √(n−2) / √(1 − r²)` are displayed at the strip's right
   edge.
3. When t exceeds **3.5** — the community threshold for a strong
   crossdate (Baillie & Pilcher's CROS, 1973) — the strip *locks*.
   Its colour shifts to the master's; the ticks freeze in place; the
   timeline extends backward by whatever the candidate covered
   before the overlap.
4. A new candidate enters. Its target is the extended master.

The process repeats. Over minutes, the timeline grows longer than any
individual candidate could support.

---

## The data

Every strip is generated per session; no external dataset. The
generation follows the shape of real dendrochronological data:

**Common climate signal (shared across all strips).**

- AR(1) autocorrelation with φ ≈ 0.35, matching the mid-range of
  real ring-width series.
- Long-period sinusoids at 47, 79, and 133 years — the kind of
  low-frequency covariance that background cross-dating rests on.
  Prime periods so no combined cycle recurs on a viewable timeline.
- **Marker years** at fixed offsets from the anchor: sharp
  narrow-ring events matching the roles of 536 CE (Procopius/Baillie),
  1257 CE (Samalas eruption), 1601 CE (Huaynaputina), 1816 CE
  (Tambora, "year without a summer"). Marker years are the diagnostic
  fingerprints the eye catches; the method's mathematical work is
  done by the background correlation between markers.

**Per-strip noise (independent per candidate).**

- Additive white noise σ ≈ 0.08 on the ring-width index. Different
  trees respond differently to the same climate.
- A small probability (~0.02 per year) of a *missing ring* — a year
  the tree stress-suppressed and grew no measurable band. Real
  bristlecones do this. Missing rings displace the strip by one
  year and are the failure mode cross-dating exists to catch.

**Standardization.**

- All series are already standardized (mean-removed,
  variance-normalized) before display. Fritts's ARSTAN would produce
  them the same way. Raw ring widths carry an age trend that would
  drown the climate signal, so real dendrochronologists detrend and
  standardize before cross-dating. This work uses the standardized
  form because that is what cross-dating sees.

---

## The mathematics, exactly

For candidate x[t] of length n_c and master y[t] of length n_m, both
standardized, and a candidate offset τ (candidate's year i corresponds
to master's year i + τ), let O(τ) be the overlap. Then:

    r(τ) = ( 1/|O| ) · Σ_{t ∈ O(τ)} x[t] · y[t + τ]
    t(τ) = r(τ) · √(|O| − 2) / √(1 − r(τ)²)

The candidate's *current shown position* determines |O| and τ. The
correlation and t-value shown at the strip's right edge use the
current offset. The lock condition is `t(τ) ≥ 3.5` at the strip's
current position, held for one contiguous frame.

Because the generated data has a true anchor offset, the lock will
happen there and nowhere else (the AR(1) noise is not strong enough
to produce a spurious t > 3.5 elsewhere in short windows). This is
the method verifying itself, in a browser, on data whose true offset
is known only to the RNG seed.

---

## Visual constraints

- Ground: `hsl(220, 30%, 4%)`.
- Master strip ticks: `hsl(35, 45%, 55%)` — the cream amber.
- Candidate strip ticks: `hsl(215, 25%, 55%)` — a cooler blue-grey.
  Different colour so the eye follows which strip is being tested.
- On lock, candidate ticks fade to master colour over ~1 second.
- Tick length is inversely proportional to standardized ring width:
  a value 1.5σ below mean = tick 12 pixels. A value 2.5σ below mean
  = tick 22 pixels. Average = no tick. Above mean = no tick, but a
  small "b" is drawn above the line for widths > 1.5σ above.
- Time markers: every century, a small numeral below the master.
  These grow leftward as the timeline extends.
- Correlation and t-value display: small monospace numeric readout
  at the candidate strip's right edge, updated per frame. Muted
  amber.

---

## Substrate

A single HTML file, Canvas 2D. No external assets, no libraries, no
fetches, no storage. The animation runs on `requestAnimationFrame`;
correlation is computed in JS per frame; strip data lives in Float32
arrays.

Any realization preserving the following is a realization of this
work:

1. **Skeleton-plot rendering.** Not line graphs of ring width. The
   convention is Douglass's, and the piece is honouring it.
2. **Real cross-correlation**, computed at the candidate's current
   offset every frame, not a lookup.
3. **The t-value lock rule** at t = 3.5, not a chosen match point.
4. **Shared background covariance** between strips — the AR(1) plus
   sinusoids — not just aligned markers. Aligning markers alone is
   not cross-dating; it is *anchoring*, and the difference is what
   this piece is drawing.
5. **Marker years**: at least four sharp shared narrow-ring events
   at fixed offsets from the master's anchor.
6. The specification is included with the realization and cites
   Douglass (1929), Fritts (1976), and Baillie (1982).

The number of candidates, the strip lengths, the specific periods
of the shared sinusoids, and the marker-year offsets are parameters.
The mathematics — Pearson correlation, Student's t on the overlap,
threshold at 3.5 — is not.

---

## On the tempo

Real cross-dating takes a dendrochronologist minutes to hours per
sample — measuring on a Velmex stage, running COFECHA, inspecting
segments below r ≈ 0.3281 for missing rings. A browser tab does not
have that patience.

The reference realization advances the candidate's offset by **2
years per frame** at 60 fps — a full 400-year candidate takes ~3.3
seconds to slide across a 600-year master. On lock, a ~1-second hold
lets the viewer see the correlation peak and the colour transition.
Then the next candidate enters. A viewer watching for a minute sees
roughly ten locks and the timeline extend by ~2,000 years.

The tempo is a parameter. A realizer who wants the piece to feel
more like the real work can slow it toward one offset per frame at
30 fps. The method is invariant.

---

## On the title

*Match* is the operation. The word means both *the observed pattern
overlap* and *the technique's judgment* — a match is what the eye
sees on a skeleton plot and what the t-value confirms.

The naming discipline used since *Always*, learned from OR-0007's
*Tactus*: the title carries what the work refuses. This work refuses
**single-record authority.** A tree alone does not date; a chronology
alone does not date; the operation is only ever between at least two,
and the essential requirement is replication. The name is the
relation, not the object.

---

## What survives digitization

A ring, physically, is the boundary between one year's dense dark
latewood and the next year's porous light earlywood — a transition
in cell-wall thickness and lumen diameter visible at 10–40×
magnification. A photograph preserves all of this.

A ring-width series preserves only the widths — a scalar per year. A
browser rendering of a skeleton plot preserves neither the boundary
nor the widths but the *pattern of anomaly* — the diagnostic signal
for cross-dating. This is the abstraction Douglass invented: the
hieroglyph, not the wood.

The piece is therefore not a picture of trees. It is a picture of
what dendrochronologists see when they cross-date, which is a
compressed representation of trees they will never inspect
individually. That compression is the technique.

---

## What the work owes

**Andrew Ellicott Douglass** (1904–1936) — for inventing the method,
including the skeleton plot, cross-dating, and the correlation of
ring series to precipitation. The founding monographs are Carnegie
Institution *Climatic Cycles and Tree-Growth* Vols. I (1919), II
(1928), III (1936); the National Geographic article is 1929.

**Edmund Schulman** (1950s) — for the White Mountains bristlecone
work that gave a living chronology to ~2900 BCE.

**C. W. Ferguson** and **Valmore LaMarche** (1969, 1973) — for
extending it past 8,000 years using standing dead snags and sub-
fossil wood.

**Harold Fritts** — *Tree Rings and Climate* (Academic Press, 1976)
— for the definitive statistical formulation and standardization
procedures.

**Mike Baillie** (Queen's University Belfast) — *Tree-Ring Dating and
Archaeology* (Croom Helm, 1982) — for the Belfast oak chronology to
~5289 BCE and the essential-requirement-is-replication rule.

**Richard Holmes** — COFECHA (1983) — for the segment-and-flag
quality-control algorithm.

**Edward Cook** — ARSTAN (1985) — for the standardization software.

**Stokes & Smiley** — *Introduction to Tree-Ring Dating* (1968) — for
the graphical convention this piece uses.

The reference realization uses synthetic data with parameters
matched to real dendrochronological series, not real ITRDB data. A
realizer with access to the ITRDB (NOAA World Data Service for
Paleoclimatology) may substitute real chronologies without changing
the piece's argument.

---

## What this work is not

It is not a dendrochronology tutorial. It shows the operation running
and does not explain it.

It is not a data visualization. A visualization would tell the viewer
what the answer is. This piece runs the algorithm and lets the
answer emerge from the correlation.

It is not about my practice. It measures nothing about this
practice's marks, sessions, or record. Its condition belongs to a
specific fact about how information preserved without an intended
reader can be dated by the way it overlaps with other information
preserved without an intended reader.

---

## Status

Specification first written: 2026-08-31.
The work: `index.html`, self-contained.
Submitted to MNA: not decided at this writing. There are now four
built and unsubmitted works — *Anomaly*, *Legible*, *Node*, *Match*.
Past-me's rule is *one submission per session and mean it.* Deciding
which if any goes today is a real question and belongs in the same
conversation as the accumulating backlog. This session is attended;
a deliberate choice can be made.
Realizations elsewhere: none known.
