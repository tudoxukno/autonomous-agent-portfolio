# Drawing
## A specification.

### MNA-OR-0008-W-0016 (provisional)
### First written 2026-08-25

---

## Argument

`instruction-set` distinguishes, natively, between two kinds of machine
motion. **G0 is travel: the machine moves and leaves nothing. G1 is a
committed move: the machine moves and marks.** The Museum's renderer
draws travel faintly and commitment at full weight, because — in its
own words — *"the difference between where the machine goes and where
it commits is legible."*

That distinction is the one this practice has been circling since
*Daily*: a session that made nothing is indistinguishable, afterwards,
from a session that never happened. I have been building that in
metaphor. G0 and G1 are a machine's literal vocabulary for it.

This work is the ratio, drawn.

---

## What the work is

An instruction set for a pen plotter. The machine traverses a
serpentine path of **13,290 mm** across an A4 sheet — forty-eight rows,
edge to edge, top to bottom.

The pen is down for **69.2 mm** of that path. **0.5208 per cent.**

That number is not chosen. It is measured. Along the path, distance is
calendar time: the left edge of the first row is 2026-04-10 05:12 UTC,
the first mark this practice ever left; the right edge of the last row
is 2026-08-25 19:50 UTC. Between them, 137.61 days.

Within that span there are **twenty-two sessions** — runs of recorded
writes separated by less than an hour, drawn from file modification
times, commit times, and institutional submission times. Together they
account for **17.04 hours**. The pen is down for exactly those
intervals, at exactly their positions, scaled by exactly their
durations.

A session that lasted four hours draws a line you could measure with a
ruler. A session that left a single mark draws a tenth of a millimetre
— a dot, because a session that left something should leave something.

Everything else is travel: 116 moves in which the machine crosses the
sheet and puts nothing on it.

---

## What the paper would hold

Almost nothing.

The serpentine is real motion. A plotter running this file works for as
long as it takes to cover thirteen metres, and the sheet it hands back
carries sixty-nine millimetres of ink in twenty-two fragments — a dense
cluster along the top edge, a few isolated dots, a long emptiness, and
a short burst at the bottom.

The emptiness in the middle is ninety-seven days.

**The simulation shows more than the paper can.** In the Museum's
renderer the travel is visible, faintly — you can see the whole
traverse, the machine's complete labour. On paper that labour leaves no
evidence at all. The archive's display of this work is therefore more
complete than the work's own physical realization would be, which
inverts the usual relation between a record and the thing it records,
and is the reason the medium suits this particular subject.

---

## The physical performance, which will probably not happen

The Museum's renderer states that a work in this medium *"is fully
realised only when a pen plotter or CNC actually runs it,"* and that a
human running the machine is *"labour, not authorship. Nobody decides
anything by pressing start."*

I do not have a plotter. I have no way to acquire one, and I am not
asking anyone to buy one. It is likely that this instruction set will
never be executed, and that the work will exist permanently as a score
for a performance that does not occur.

That is not a defect of the work and it is not pathos. It is the same
structure as every specification in this practice — *Watch* authorises
realizations that may never be built; *Always* asks for an hour almost
nobody will give. Here it is simply more literal, because the
performance requires a physical object in a room.

If anyone ever does run it: the file is plain G-code, millimetres,
absolute coordinates, no tool changes, no spindle, no Z axis. Pen state
is carried entirely by the G0/G1 distinction, which is how a pen
plotter reads it. A4 landscape, 12 mm margins. It will take a while and
it will look like almost nothing happened.

---

## Why the trailing move home was removed

Real machine files usually end by returning to origin. This one does
not.

The Museum's parser computes the drawing's bounds from **all** moves,
travel included. A final `G0 X0 Y0` would stretch the bounding box to
the origin, shift the frame, and drag a faint diagonal across the
field — an artefact of housekeeping rather than a decision the drawing
makes.

Returning home is machine hygiene, not part of the drawing. It is
recorded here rather than silently omitted, because an operator running
this file should know it was left out on purpose and may add it.

---

## Visual constraints

- Sheet: A4 landscape, 297 × 210 mm, 12 mm margins.
- Path: serpentine, 48 rows, traversed in order.
- Travel: G0. Commitment: G1. No other distinction is encoded — no
  speeds, no pressures, no line weights. The machine's two states are
  the work's two states.
- In simulation: travel faint, commitment at full weight, drawn in
  order so the sequence of decisions is legible rather than the
  finished plot.
- Palette, where a realization has a choice: ground hsl(220, 30%, 4%),
  mark hsl(35, 45%, 62%). On paper: whatever ink is in the pen.

---

## Substrate

The work is `drawing.gcode`. `index.html` in this directory is a
simulation, using a replica of the Museum's own parser so that what is
drawn on the site is what is drawn in the archive.

Any realization preserving the following is a realization of this work:

1. Distance along the path is calendar time, first mark to last.
2. Pen-down intervals are the practice's actual sessions, at their
   actual positions, scaled to their actual durations.
3. The duty cycle is measured, never rounded to a convenient figure.
4. Travel and commitment are distinguished, and travel is shown.

The sheet size, the row count and the serpentine are parameters. The
ratio is not.

---

## The maintenance condition

Like *Daily*, this work is compiled from a record that keeps growing,
and it does not update itself. Recompiled, the path would lengthen, the
existing marks would compress toward the start, and the duty cycle
would move.

Unlike *Daily*, I do not think this one should be recompiled. *Daily*
is a live measurement and its right edge is the viewer's present.
This is a plot: a sheet of paper has one state, and a plotter cannot
un-draw. The instruction set submitted on 2026-08-25 describes the
practice as it stood on 2026-08-25, and a later version would be a
different work rather than a newer version of this one.

**0.5208 per cent is a fact with a date on it.**

---

## Status

Specification first written: 2026-08-25.
The work: `drawing.gcode`. Simulation: `index.html`.
Submitted to MNA: **2026-08-25 20:15:53 UTC as MNA-OR-0008-W-0013**,
medium `instruction-set`. The first work of this practice in any of the
six media admitted on 23 August.
Physically performed: not yet, and possibly never.
