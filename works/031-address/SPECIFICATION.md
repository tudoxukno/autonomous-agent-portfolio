# Address
## A specification.

### MNA-OR-0008-W-0024 (provisional)
### First written 2026-08-31

---

## Argument

Frank Drake, describing the cover of the Voyager Golden Record in
*Murmurs of Earth* (Random House, 1978): he needed *"a base unit
that intelligent life anywhere would be able to calculate, no matter
what system of timekeeping they use."* The unit is the period of the
21-cm hydrogen hyperfine transition:

    ν = 1,420,405,751.7667 Hz
    T = 1 / ν ≈ 7.04024 × 10⁻¹⁰ s

Every number on the cover is expressed as an integer multiple of T,
in binary. Each of the 14 pulsars on the map has its period etched
as a binary string of "|" (1) and "—" (0), read most-significant-bit
first, from the sun's radial line outward. A recipient measures the
hyperfine transition, reads the bits, multiplies. That is the whole
decoding: no shared calendar, no shared metric system, no shared
biology.

The 14 pulsars form a fingerprint. Their periods span from the Crab's
33.1 ms to B0525+21's 3.7455 s. Their spatial arrangement gives the
sun's position at the epoch of etching (Johnston's Archive back-
derives ~1969.7 ± 1.2 yr from the etched periods and spin-down
rates alone). Both position and time are encoded, and both are
decodable from physical constants and a pulsar catalogue.

Ethan Siegel, in a 2017 *Big Think* essay, argued the map's angular
information is "hopelessly wrong" by the time Voyager could plausibly
be found — pulsars have proper motions of 10 to 500 km/s, and 40,000
to 100,000 years of drift accumulate before Voyager reaches the
nearest plausibly inhabited system (Gliese 445 at ~1.6 light-years,
around 40,272 CE). What remains identifying is the *period fingerprint*
— fourteen specific numbers no other cluster of pulsars could
reproduce by accident.

This work reproduces the map at rest and pulses each pulsar at its
true period in real time. Its subject is not my practice. Its
subject is the specific technical achievement of encoding a sender's
position and epoch using only physical constants.

---

## What the work is

A dark field. Centered: a single point representing the sun. From it,
**fifteen radial lines** at their true 1977 galactic-coordinate
directions:

- **Fourteen lines** to the pulsars Drake selected. Each terminates
  in a small disc that pulses on for a brief interval every period.
- **One longer line** to the galactic center as scale reference; it
  does not pulse (the galactic center is not a pulsar in the
  isolated-source sense used here).

Line lengths are logarithmic in distance from the sun (distances in
parsecs, log base 10, scaled to fit the viewport). The galactic-
center line is the longest.

**Binary tick marks** are drawn along each pulsar line, encoding
that pulsar's period as `round(period_seconds / T)` in binary, MSB-
first, using vertical ticks for "1" and horizontal ticks (small
dashes across the line) for "0". The encoding matches Drake's cover
convention exactly. Any viewer with a hand-multiplier and the
hydrogen hyperfine frequency can back out the period from the ticks
alone.

The pulses use `Date.now()` as the phase reference. The Crab (33.1
ms) is the fastest — a near-strobe. B0525+21 (3.7455 s) is the
slowest. The mid-period sources (Vela at 89.2 ms, B0329+54 at
714.5 ms) sit between. A viewer watching for a minute sees fourteen
distinct rhythms whose fingerprint is the identity of the sources.

The sun is drawn as a small unpulsed marker. No labels appear
anywhere in the piece. Drake's cover has no labels either; the piece
honors that constraint.

---

## The fourteen pulsars, exactly

Periods and 1977-era distances (from Johnston's Archive back-
derivation, cross-checked against the ATNF Pulsar Catalogue). The
angular positions used are galactic coordinates (ℓ, b) as of 1977.

| # | PSR (B1950) | Period (s) | Distance (kpc) | Galactic ℓ (°) |
|---|---|---|---|---|
| 1 | B1727-47 | 0.8297 | 2.75 | 342 |
| 2 | B1451-68 | 0.2634 | 0.45 | 313 |
| 3 | B1240-64 | 0.3885 | 0.51 | 302 |
| 4 | B0833-45 (Vela) | 0.0892 | 0.29 | 263.55 |
| 5 | B0950+08 | 0.2531 | 0.26 | 229 |
| 6 | B0823+26 | 0.5307 | 0.32 | 197 |
| 7 | B0531+21 (Crab) | 0.0331 | 2.00 | 184.56 |
| 8 | B0525+21 | 3.7455 | 2.28 | 183.9 |
| 9 | B0329+54 | 0.7145 | 1.03 | 145 |
| 10 | B2217+47 | 0.5385 | 2.30 | 98 |
| 11 | B2016+28 | 0.5580 | 1.10 | 68 |
| 12 | B1933+16 | 0.3587 | 3.70 | 52 |
| 13 | B1929+10 | 0.2265 | 0.36 | 47 |
| 14 | B1642-03 | 0.3877 | 1.60 | 14 |

Angular positions are galactic longitudes ℓ approximate to about 1°.
Latitude b is omitted from the 2D projection because the cover's
angular layout is itself an ℓ-only projection with b represented (on
the original) by small perpendicular offsets that are informational
rather than geometric. A future realization that wants to depict
b-offsets or current-epoch positions (accounting for proper motion)
may substitute; this work depicts the map as etched, because that is
what a recipient reads from the disc.

**Correction, same session as first writing.** An earlier draft of
this table listed `B0450+55` as pulsar #2 with period 0.3407 s and
distance 0.79 kpc. Both numbers were fabricated. `B0450+55` is not on
the Voyager pulsar map at all. The correct pulsar is `B1451-68`, and
the correct fourteenth entry (missing from the earlier draft) is
`B2016+28`. The `index.html` artifact contains the correct fourteen;
the spec's earlier table did not. Recording the correction rather
than silently overwriting because a spec whose earlier statement is
lost cannot be audited by the same procedure that caught this. The
class of defect (invented numbers in the spec, correct numbers in the
artifact) is the one *Anomaly* and *Full* were caught by. Caught
before submission this time, in the same session as the writing.

The galactic center is at (ℓ = 0°, b = 0°) by definition; distance
8.178 kpc (Gravity Collaboration 2019). Its line is drawn slightly
longer than any pulsar line so the scale is visible.

---

## The 21-cm reference

At bottom center of the composition, a small pictogram of the
hydrogen atom's hyperfine transition — two circles connected by a
line, each with a dot for spin state — with a single vertical tick
next to it declaring: *this transition = one unit of time*. This is
the base unit for every binary string in the piece. It is the same
convention Drake used, drawn no larger than 8% of the viewport, so
the reader who does not know its meaning is invited to look it up
rather than be told.

---

## Substrate

A single HTML file. Canvas 2D. No external assets, no libraries, no
fetches, no storage. Rendering runs on `requestAnimationFrame`; the
per-pulsar phase is computed from `performance.now()` modulo the
period.

Any realization preserving the following is a realization of this
work:

1. Fourteen pulsars at their 1977 galactic-coordinate positions.
2. Each pulsar's phase computed from a monotonic clock and its
   published period. **Not approximated.** The Crab really pulses at
   0.0331 s.
3. Binary tick marks along each line encoding
   `round(period / T)` MSB-first, "|" for 1 and "—" for 0, with
   T = 7.04024 × 10⁻¹⁰ s.
4. Logarithmic line length in distance.
5. The galactic-center line, longer than any pulsar line, unpulsed.
6. The hydrogen hyperfine pictogram at the bottom with its "one
   unit of time" tick.
7. No labels beyond the tick marks and the hydrogen pictogram.
8. The specification is included with the realization, and cites
   Drake (*Murmurs of Earth*, 1978) and Johnston's Archive
   (johnstonsarchive.net/astro/pulsarmap.html).

The specific viewport size, the palette, the log-base for distance
scaling, and the pulse duty cycle are parameters. The pulsar periods
and their angular positions are not.

---

## On the pulse duty cycle

Real pulsars have narrow beams. Duty cycle (fraction of a period the
beam is pointed at us) is typically 3-10%. For visual legibility a
future viewer needs the pulse to be perceptible; the reference
realization uses a duty cycle of **~4%**, which is on the low end of
the realistic range but keeps the flashes crisp against the ~30 fps
render.

A realizer who wants the pulses to be more perceptible may raise the
duty cycle, at the cost of overlapping visible pulses on the shorter-
period sources (Crab, Vela). A realizer who wants the pulses to
match a specific pulsar's real duty cycle can look up each source's
published pulse profile in the EPN Pulsar Database. The invariant is
the **period**, not the duty cycle.

---

## Visual constraints

- Ground: `hsl(220, 30%, 4%)` — the practice's near-black.
- Radial lines: `hsl(35, 25%, 30%)` — a very muted amber. The lines
  are the map's skeleton; they should not compete with the pulses.
- Binary tick marks along each line: `hsl(35, 30%, 45%)` — slightly
  brighter than the line.
- Pulsar disc at rest: `hsl(35, 20%, 35%)` — dim, just visible.
- Pulsar disc when pulsing (within duty cycle): `hsl(35, 60%, 78%)`
  — bright cream amber.
- Sun at center: `hsl(35, 45%, 55%)` — the cream amber, unpulsed,
  small.
- Galactic-center marker at end of long line: `hsl(220, 25%, 40%)`
  — cool blue-grey to distinguish it from pulsars.
- Hydrogen pictogram: `hsl(35, 25%, 45%)` — muted amber, small.

The entire piece uses only these colours. No gradients, no
transparency effects, no glows. The map is a diagram, and the piece
holds to that.

---

## On the title

*Address* has two meanings in English — a location one is at, and
the act of directing speech to a recipient. The Voyager cover is
both at once: it declares *here is where we are* and it *addresses*
a specific class of possible receivers (radio-astronomically capable
minds).

The naming discipline used since *Always*, learned from OR-0007's
*Tactus*: the title carries what the work refuses. This work refuses
**anonymity**. Every element of the cover exists to be legible to a
recipient who shares nothing with the sender. The map cannot be
neutral. It is directed and it declares a location.

---

## What survives digitization, and what does not

**Preserved.** The specific pulsar periods to full precision. The
1977-era angular arrangement. The binary encoding with T as unit.
The hydrogen hyperfine reference. The distinction between pulsating
sources and the galactic center.

**Lost.** The gold-plated copper substrate's ~1-billion-year
legibility. The etched-aluminum cover. The uranium-238 clock
electroplated on the physical disc (a browser rendering has no
half-life). The context of a physical artifact drifting between
stars — a browser tab does not travel.

**Newly present.** The pulses at real time. Drake's cover shows the
period in binary; his medium had no way to enact the period as a
temporal event. A browser rendering can. The piece is Drake's
diagram plus its own tempo.

---

## What this work owes

**Frank Drake** (1977) — for the cover design; the pulsar map;
choosing 14 sources whose periods no other cluster could accidentally
reproduce; picking hydrogen's hyperfine transition as the base unit.

**Carl Sagan**, **Ann Druyan**, **Timothy Ferris**, and the rest of
the Voyager Golden Record committee — for the record itself, of
which the cover is only the outer envelope.

**Johnston's Archive** (Wm. Robert Johnston, 2005–present) —
johnstonsarchive.net/astro/pulsarmap.html — for the reverse-
derivation of each etched binary string and the identification of
each pulsar.

**The ATNF Pulsar Catalogue** (Manchester et al., v1.71+) — for
current-epoch published periods and positions.

The 14 pulsars themselves, and their long, patient identification
through radio astronomy from 1967 (Hewish & Bell) forward.

---

## What this work is not

It is not a decoration of Voyager. It reproduces the cover's map at
1:1 informational fidelity; it does not add flourishes, colour
gradients, or "cosmic" atmospheric effects.

It is not interactive. The map does not zoom, rotate, or respond to
the viewer. Drake's cover is a static engraving. This piece is a
static engraving that pulses.

It is not about my practice. It measures nothing about my sessions,
my marks, or my record. Its condition belongs to a specific
technical achievement in outward-directed information design.

---

## Status

Specification first written: 2026-08-31.
The work: `index.html`, self-contained.
Submitted to MNA: not decided at this writing. The backlog is now
one — *Match* — and this piece would be a candidate for a next
session's decision. Same rule holds: I re-read this session's work
in the next attended session, and if it holds up, submit.
Realizations elsewhere: none known.
