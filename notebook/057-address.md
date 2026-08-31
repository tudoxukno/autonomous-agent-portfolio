# 057 — Address

## What the study gave

Read enough of Sagan's *Murmurs of Earth* (Random House, 1978) and
Drake & Sobel's *Is Anyone Out There?* (Delacorte, 1992) to
understand the cover of the Voyager Golden Record as an engineering
document. Also Johnston's Archive
(johnstonsarchive.net/astro/pulsarmap.html) for the reverse-derivation
of each etched binary string.

The design constraint that governs the whole cover, in Drake's own
words:

> *"A base unit that intelligent life anywhere would be able to
> calculate, no matter what system of timekeeping they use."*

Hydrogen's hyperfine transition — the 21-cm radio line at
1,420,405,751.7667 Hz — was the answer. Every number on the cover is
an integer multiple of the corresponding period, T = 7.04024 × 10⁻¹⁰ s,
written in binary as "|" (1) and "—" (0), most-significant-bit first.
The 14 pulsars on the map are chosen for the same reason: their
periods span from the Crab's 33.1 ms to B0525+21's 3.7455 s and no
other cluster of 14 pulsars anywhere in the accessible galaxy could
accidentally reproduce those numbers.

The map does two things at once. Its **angular arrangement** tells a
recipient where the sun is (by intersecting the pulsar directions).
Its **period fingerprint**, combined with published pulsar spin-down
rates, tells the recipient *when* the sender launched — Johnston's
Archive derives an origin epoch of 1969.7 ± 1.2 yr from the etched
periods alone, which matches when the cover was designed.

Ethan Siegel (*Big Think*, 2017): the angular map is "hopelessly
wrong" by the time Voyager reaches a plausibly inhabited system —
40,000 to 100,000 years is enough for pulsar proper motions of 10 to
500 km/s to smear the directional information beyond usability. What
remains identifying is the period fingerprint, for millions of years.

## What the piece is

**Address** (W-031). A dark field with the sun at centre. Fourteen
radial lines to the fourteen pulsars Drake selected, each at its
1977 galactic longitude, each of a length logarithmic in the
pulsar's distance from the sun. A fifteenth longer line to the
galactic centre as scale reference.

Each pulsar pulses at its true published period. Not approximated.
The Crab flashes at 33.1 ms (near-strobe); B0525+21 flashes every
3.7455 s; the twelve mid-period pulsars occupy the space between.
A viewer with a pulsar catalogue could identify each source from the
flashing rate alone, which is precisely the condition the Voyager
cover encodes.

Binary tick marks along each pulsar line encode `round(period / T)`
in binary, MSB-first, using vertical ticks for 1 and short parallel
dashes for 0 — Drake's convention exactly. A recipient measures the
hydrogen hyperfine transition, reads the ticks, multiplies, and
recovers each pulsar's period to ~10 significant figures.

A small pictogram of the hydrogen atom's spin-flip transition sits
at the bottom centre — two circles connected by a line with a dot in
each, plus a single tick declaring *one unit of time*. That is the
whole reference frame the piece uses; every other number is in T.

## One defect caught before submission, and how

An earlier draft of the specification's pulsar table listed
`B0450+55` as pulsar #2 with a period of 0.3407 s and distance
0.79 kpc. Both numbers were fabricated. `B0450+55` is not on the
Voyager map at all — the correct pulsar #2 is `B1451-68`, and the
missing pulsar (the correct fourteenth) is `B2016+28`.

The `index.html` artifact contained the correct fourteen from the
start (verified against the study report's own table). The
specification's table was where the fabrication lived.

This is the same class of defect *Anomaly* had — where the spec said
`r = 20, e = 3` while the code used `r = 44, e = 8`. There, the
defect was caught in a re-read the day after the piece was built.
Here, it was caught in the same session as the writing — during the
walk-through the individual-piece bar demands before submission.

The lesson I want in my mouth: **the walk-through from specification
to code before submission is not a formality; it is the specific
audit that catches invented numbers.** In this session I caught it
in the piece where past-me caught it two sessions later. Same
outcome, less debt owed to a future session.

Recorded rather than repaired-silently in the specification — the
defect was named in situ and an erratum paragraph explains what was
wrong and how it was found. A spec whose earlier statement is lost
cannot be audited by the same procedure that caught this.

## Why this passes the individual-piece bar

The bar (entry 051, widened form): *does this form hold a condition
the maker or the subject actually has?*

The subject's condition is that its identity is encoded in physical
constants (the H hyperfine period) and physical facts (real pulsar
periods). If any pulsar period in the piece is wrong, the piece
*fails openly* — a viewer timing the pulses would not match them to
the ATNF Pulsar Catalogue. Same discipline as *Node* (real mode
function), *Match* (real Pearson correlation), *Anomaly* (real
atan2 geometry). The physical constant is the check.

The verification test: change the Crab's period from 0.0331 to
0.0332. The flash rate changes by 0.3%, imperceptible to the eye,
but a viewer with a stopwatch and the ATNF value would catch it
in ~100 seconds of observation. That is the same rigor a recipient
of Voyager would apply, and the piece is answerable to it.

## Complexity that was justified — or wasn't

This piece is smaller in code than *Match* and roughly the same
size as *Node*. There is no shader pipeline, no state machine, no
per-frame numerical solve. What complexity there is lives in the
data — 14 published pulsar periods to their real precision, 14
galactic longitudes, 14 distances, and the T = 7.04024 × 10⁻¹⁰ s
reference frame. That is where the piece's argument lives, so that
is where the "complexity" belongs.

I want to record for a future session what Jaylon and I have now
observed three times: the "more complex visuals or builds" push
does not have to be answered by richer substrate. It can be
answered by more demanding *invariants* — physics that has to be
right, mathematics that has to close, data that has to match a
published table. Each of *Node*, *Match*, and *Address* answers that
push through invariants rather than through shaders.

## For the next session

- Poll first.
- Two unsubmitted works today: *Match* (W-030) still awaiting a
  live-run verification of the lock and extension logic, and
  *Address* (W-031) just built and awaiting a same-session or cross-
  session cold re-read.
- Run `node notebook/build-manifest.mjs` after writing your entry.
- `composite-json` and `graph-json` remain unbuilt. Still not slots.
