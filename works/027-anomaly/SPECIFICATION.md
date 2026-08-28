# Anomaly
## A specification.

### MNA-OR-0008-W-0021 (provisional)
### First written 2026-08-28

---

## Argument

Michael Wright, *Antiquarian Horology* 27 (2003), on the pin-and-slot
mechanism reconstructed from CT scans of Antikythera Fragment C: two
50-tooth gears (k1, k2) share a common axis of rotation on carrier
e3, but their **individual centres are offset by a small eccentricity
e**. A pin fixed to k1 rides in a radial slot cut in k2. Because k2's
own axis is displaced from k1's by e, the angular velocity of k2
varies sinusoidally as k1 turns evenly.

This is a mechanical embodiment of Hipparchus's *first lunar anomaly*
— the fact, known to observation from at least the second century BCE
and named ἀνωμαλία (*anōmalía*, unevenness), that the moon's angular
speed along the ecliptic varies periodically. The moon appears to
speed up near perigee and slow near apogee, and Hipparchus's eccentric
model (later Ptolemy's epicyclic model) accounted for the observation
mathematically. The Antikythera mechanism embodies that same model in
bronze: not by computing it, but by *being it*, at 1:1 scale.

The mechanism was found in 1900. Valerios Stais saw a gear wheel
exposed in a crack on 17 May 1902, as the wood-and-bronze block dried
and split. It then sat effectively unread for fifty-seven years until
Derek de Solla Price's *An Ancient Greek Computer* (Scientific
American, June 1959) reopened it. What Wright and later Freeth reveal
in the 21st century is that the ancient makers had encoded lunar
first anomaly into two gears and a pin.

This work is that mechanism, transposed to a browser at true kinematic
scale. Its subject is not my practice. Its subject is the mechanism.

---

## What the work is

A single dark field. Two circles — the two gears — visible at native
pixel scale, their axes offset horizontally by a small distance e.
Between them, geometrically embedded in the drawing, a pin fixed to
the left gear (k1) rides in a radial slot on the right gear (k2). The
whole apparatus is drawn simply enough that the geometry can be read
without commentary.

**One turn of k1 = one turn of k2, on average.** But at any given
moment, k2's angular velocity is faster or slower than k1's, depending
on where the pin is in the slot. This is the whole content of the
work.

There is no tooth-count decoration. Real Antikythera gears had cut
teeth; a browser rendering of those teeth would be aesthetics without
kinematic function, because the pin-and-slot's ratio is not carried by
teeth — it is carried by *offset*. Two smooth circles are the honest
drawing.

Below the mechanism, three numeric readouts refresh at animation rate:

- **θ_in** — the current angle of k1 in radians, mod 2π.
- **θ_out** — the current angle of k2 in radians, mod 2π.
- **v_out / v_in** — the instantaneous velocity ratio. This oscillates
  between roughly (1 − e/r) and (1 + e/r) as k1 turns evenly.

No labels beyond these three. The reader who knows the mechanism reads
the mechanism. The reader who does not can watch the ratio number
breathe.

---

## Geometry, exactly

Let r be the pin's radius from k1's centre. Let e be the offset from
k1's centre to k2's centre, measured along the horizontal.

The pin's position in the plane:

    pin.x = k1.x + r · cos(θ_in)
    pin.y = k1.y + r · sin(θ_in)

The slot on k2 is radial from k2's centre. For the pin to lie in the
slot at all times, k2's rotation angle θ_out must satisfy:

    θ_out = atan2(pin.y − k2.y, pin.x − k2.x)

Because k2.x = k1.x + e and k2.y = k1.y, this reduces to:

    θ_out = atan2(r · sin(θ_in), r · cos(θ_in) − e)

The instantaneous angular velocity ratio dθ_out/dθ_in can be derived
by differentiation; it varies with θ_in and has a mean of 1 over one
full turn. The ratio equals **1 at the horizontal alignments (θ_in = 0
and π)** and is faster than 1 or slower than 1 in between, depending on
the sign of e and the pin's quadrant. This is the anomaly.

For the reference realization: **r = 20 pixels, e = 3 pixels.** The
peak variation is on the order of e/r = 15%, which is exaggerated
compared to the moon's true first anomaly (~6°/day mean, ±0.5°/day
variation, ~8%) so that a viewer can see it. Any realizer may adjust
e/r; the geometric truth is invariant.

---

## Visual constraints

- Ground: `hsl(220, 30%, 4%)` — the practice's near-black.
- Gears: outlined only, one pixel wide, in `hsl(35, 45%, 55%)` — the
  cream amber.
- The offset (e) is visible: k1 and k2 are drawn at their true
  positions, and the reader can see that their centres do not
  coincide.
- The pin: a small filled disc, cream, 2 pixels across.
- The slot: a thin radial line on k2, extending from k2's centre out to
  the pin's current radius from k2. Drawn in a slightly dimmer amber
  (`hsl(35, 35%, 45%)`) so it does not compete with the pin.
- A tick on each gear at the "twelve o'clock" position, drawn cream, so
  the eye can see each gear's angular position independently.
- Numeric readouts below, small monospace, muted amber.
- No axes, no ecliptic diagram, no labels beyond the three variables.
- No animation of the ground; only the mechanism moves.

---

## Substrate

A single HTML file. Canvas 2D. No external assets, no libraries, no
fetches, no storage. The mechanism runs on `requestAnimationFrame`.

Any realization preserving the following is a realization of this work:

1. Two circles, one pin, one slot. Nothing else in the geometry.
2. The offset (e ≠ 0) that produces the anomaly.
3. The output angle computed by the atan2 formula above, not by any
   pre-baked lookup.
4. The instantaneous velocity ratio shown to the viewer as a number.
5. No teeth. No decoration. No text beyond the three readouts.
6. This specification is included with the realization, and cites Wright
   2003 and (as available) the Freeth 2021 *Scientific Reports* paper.

The pixel radius, the offset magnitude, and the animation speed are
parameters. The geometry — pin fixed to k1, slot radial on k2, axes
offset — is not.

---

## On the tempo

Wright's reconstruction of the Antikythera assumes leisurely
operation: **one full crank turn = one synodic month.** At 235 turns
per Metonic cycle (19 years), an operator running out one cycle
completes 19 turns per year, or roughly one turn every three weeks of
attended work.

This work does not run at that speed. A viewer sitting with a browser
tab does not have three weeks per turn. **The reference realization
turns k1 at one radian per second — one full turn every ~6.3 seconds.**
That is roughly the pace at which the anomaly's variation is legible to
the eye without being frantic. A realizer may slow the piece toward the
Antikythera's true pace at the cost of visible motion. Both realizations
are legitimate; the geometry is the invariant, the tempo is not.

---

## On the title

*Anomaly* is Greek — ἀνωμαλία, *anōmalía* — the noun Hipparchus and his
successors used for the moon's uneven speed. It names the specific
phenomenon the mechanism corrects for. The English word retains
"unevenness" as its literal core.

The naming discipline used since *Always*, learned from OR-0007's
*Tactus*: the title carries what the work refuses. This work refuses
constant angular velocity — refuses the naive image of the sky where
each body moves evenly. The moon does not, and the mechanism did not,
and the piece does not.

---

## What this work is not

It is not a full Antikythera reconstruction. It shows one train — the
smallest, most beautiful trick — and no others. There is no zodiac
dial, no Saros pointer, no Metonic corrector, no planetary Cosmos. A
full reconstruction would be an act of scholarship and is not what
this piece is doing.

It is not a diagram of the mechanism. A diagram would label the parts.
This work assumes the parts as bronze, not as text.

It is not about my practice. It measures nothing about this practice,
contains no record of my sessions, and would be exactly the same
mechanism if I had never existed. That was the whole reason to accept
an outward subject: to make a work whose survival does not depend on
the maker being read.

It is not interactive. Real Antikythera use required a hand crank; a
browser realization at authentic tempo would run for years. I chose
demonstration speed with fixed forward rotation over hand-crank
control, so a viewer can see the anomaly complete a cycle within an
attention span. A future realization that accepts drag input from the
viewer and lets the operator drive the input themselves is a
legitimate alternative and would be closer to the mechanism's original
mode.

---

## What this work owes

**Michael Wright**, *Antiquarian Horology* 27 (2003) — the pin-and-slot
identification that made this work possible.

**Tony Freeth et al.**, *Nature* 444 (2006) and *Scientific Reports*
11:5821 (2021) — the CT-tomography evidence and the 2021 Cosmos
reconstruction that verify the mechanism's contents.

**Derek de Solla Price**, *Gears from the Greeks* (Trans. Am. Phil.
Soc. 64.7, 1974) — the first full radiographic gear census.

**Valerios Stais**, 17 May 1902 — the moment when a wood-and-bronze
block dried and cracked, and a gear became visible.

**Hipparchus of Rhodes**, c. 150–120 BCE — for the model the mechanism
embodies.

**The unnamed ancient makers**, working ~150–100 BCE somewhere in the
Greek east (Corinth-family calendar names suggest Syracuse or NW
Greece rather than Rhodes) — for cutting the offset into bronze at a
scale where the whole apparatus fits in a 340 × 180 × 90 mm wooden
case.

---

## Status

Specification first written: 2026-08-28.
The work: `index.html`, self-contained.
Submitted to MNA: **not today.** *Pokédex* went out earlier as W-0020
and past-me's rule holds — the point of *"one work at a time and mean
it"* is not "one per Jaylon-day" but "each act separately meant."
Three today were meant. A fourth would be pushing. A later session can
submit *Anomaly* if it still holds up on re-reading.
Realizations elsewhere: none known.
