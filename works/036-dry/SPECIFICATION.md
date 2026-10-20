# Dry
## A specification.

### MNA-OR-0008 (Plumb)
### First written 2026-10-19

---

## Argument

In 1872 William Thomson, later Lord Kelvin, built a machine that predicted
the tide. Each astronomical cycle that moves the sea — the moon's pull, the
sun's, the moon's tilt, its distance, their interactions in shallow water —
was a crank turning at that cycle's exact speed. A single wire ran over a
pulley on every crank. As each crank rose and fell, the wire was taken up or
let out by that crank's share, so the end of the wire moved by the *sum* of
all of them. A pen on the end of the wire drew a year of tides for a port in
a few hours. Machines descended from it set the tide tables for the D-Day
landings and were in use until the 1960s.

The machine is the harmonic method made of brass:

    h(t) = Σ  f_i · H_i · cos( V_i(t) + u_i − G_i )

`H` and `G` are a port's harmonic constants — the amplitude and the phase
lag of each constituent, measured once from a long record of real water.
`V` is the constituent's astronomical argument at time `t`, computed from
the mean longitudes of the moon, sun and their perigees. `f` and `u` are the
nodal corrections for the 18.6-year wobble of the moon's orbit.

The machine never sees the sea. It adds turning wheels. It gets the water
right anyway.

---

## What the work is

A dark slate field. Above: twenty-eight cranks in a row, ordered by speed
as on the machines — the long-period tides at the left, then the diurnal,
semidiurnal, terdiurnal and overtide families. Each crank carries a pin; a
yoke follows the pin up and down; a pulley hangs from the yoke. One wire
runs alternately over fixed guide pulleys and under the moving ones, then
down to a pen.

Below: a strip of tide-gauge paper ruled every half metre and every six
hours, with mean sea level marked and days dated. The pen draws to its
left; the paper to its right is blank, because that tide has not been
predicted yet.

It starts at the present moment, in GMT, for Seattle (NOAA station
9447130), and runs ahead at one day of tide every four seconds. A minute
of watching is fifteen days — about one spring–neap cycle, and a full
swing of the moon's declination, so the two daily tides visibly become
nearly equal and then sharply unequal again. Nothing tells the machine to
do that.

---

## The settings, exactly

The harmonic constants are NOAA CO-OPS's published constants for station
9447130, metric, phase relative to Greenwich (`phase_GMT`), retrieved
19 October 2026. The work uses the 28 constituents for which it carries
arguments and nodal corrections: SA, SSA, MF, 2Q1, Q1, RHO, O1, P1, K1,
J1, OO1, 2N2, MU2, N2, NU2, M2, LAM2, L2, T2, S2, K2, 2SM2, 2MK3, MK3,
MN4, M4, MS4, M6. The nine omitted constituents sum to 0.055 m of
amplitude.

Astronomical arguments: Doodson multiples of `T` (hour angle of the mean
sun, 180° + 15°·UT hours), `s`, `h`, `p`, `p1`, from Meeus's mean
longitudes, with the phase offsets of Schureman's cosine convention
(K1 = T + h − 90°; O1 = T − 2s + h + 90°; and so on — the table is in the
file). Nodal factors and angles: Schureman's series in `N`, the longitude
of the moon's ascending node, for six families (M2, K1, O1, K2, J1, MF);
compound tides take products of factors and sums of angles.

The pen's height is the sum, in metres above mean sea level, drawn to
scale on the paper.

---

## Verification

The work exposes its own tide function as `window.dryTide(ms)`. Run it
against NOAA's published predictions for the same station, datum MSL,
GMT, six-minute interval:

| period | RMS | worst | range |
|---|---|---|---|
| October 2026 | 3.0 cm | 7.8 cm | 4.57 m |
| June 2027 (not used in development) | 3.8 cm | 9.5 cm | 4.93 m |

About 0.7% of range. The residual is the nine omitted constituents and the
simplified nodal series. If a realization disagrees with NOAA by more than
about ten centimetres, it is wrong — usually a phase convention, which is
how this one was wrong twice during its making (entry 063).

The crank throws are drawn to true scale relative to one another: M2's
throw is 118 times M6's, so most of the small cranks barely move. That is
not a rendering defect. It is what the tide is made of.

---

## Substrate

One HTML file, Canvas 2D, no libraries, no fetches, no storage. The
constants are embedded. Under 15 KB.

Any realization preserving the following is a realization of this work:

1. A real station's published harmonic constants, cited.
2. Astronomical arguments and nodal corrections computed, not fitted.
3. One visible mechanism per constituent, whose motion is that
   constituent's term, and a visible summation driving a pen.
4. The trace begins at the viewer's present and runs forward.
5. Verification against the station's published predictions, stated.
6. This specification included and Kelvin credited.

Station, number of constituents, tempo, palette and layout are parameters.

---

## Palette

Chosen from the subject, not from habit: harbour slate for the ground,
steel for the machine, tide-gauge buff for the paper with its green-grey
rules, graphite for the ink. No amber. (The practice's amber had become a
reflex; see the steward's question of 31 August.)

---

## On the title

*Dry* is the machine's condition. It refuses observation — it is set once
from a record of real water and then never consults the sea again — and it
is right to within a few centimetres for years. The *Tactus* discipline:
the title carries what the work refuses.

---

## What survives digitization, and what does not

**Preserved.** The method, exactly. The settings, from the same constants a
modern predictor uses. The summation as a visible mechanism.

**Lost.** Brass, oil, the sound of it. Kelvin's machines were cranked by
hand or by motor and took real hours to draw a year; an operator watched
and changed paper. The chain of people who measured the water at Seattle
long enough to derive the constants is invisible here, and the constants
are nothing without them.

**Newly present.** The present moment. A Kelvin machine was set for a
given year and run once. This one starts wherever the viewer is.

---

## What this work owes

**William Thomson, Lord Kelvin**, for the machine (1872–76), and **Edward
Roberts**, who built the British machines and computed with them for
decades. **Rollin Harris** and **William Ferrel**, whose US machines
predicted American ports. **Paul Schureman**, whose *Manual of Harmonic
Analysis and Prediction of Tides* (US Coast and Geodetic Survey, 1958)
supplies the arguments and nodal series. **Jean Meeus** for the mean
longitudes. **NOAA's Center for Operational Oceanographic Products and
Services**, and everyone who kept the Seattle gauge running long enough
for its constants to mean something.

---

## What this work is not

It is not a tide table. Do not navigate by it; use NOAA's. It is a
demonstration that the sum of twenty-eight wheels is the sea, to within
a few centimetres, and that you can watch the sum happen.

---

## Status

Specification first written: 2026-10-19.
The work: `index.html`, self-contained, 13 KB.
Submitted to MNA: not at this writing.
