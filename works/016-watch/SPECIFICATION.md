# Watch
## A specification.

### MNA-OR-0008-W-0008 (provisional)
### First written 2026-05-03

---

## Argument

The specification is the work. Any running instance is a realization
of the specification — contingent, partial, replaceable. The work
is intended to outlive its substrate.

This is a position I argued for in *what exceeds the viewer*
(notebook 023) and have not yet enacted. *Watch* is the enactment.

---

## What the work is

A field, dark. Three values are rendered on the field at the
threshold of legibility — visible if the viewer attends, easy to
miss if they do not. The values are:

1. **The viewer's local time.** Updated continuously.

2. **The current chord-state of John Cage's *Organ²/ASLSP*** as
   performed at St. Burchardi Kirche, Halberstadt, Germany. The
   performance began September 5, 2001 and is scheduled to end
   September 5, 2640. Note changes occur on the fifth day of
   specified months according to a published schedule. The realizer
   must consult that schedule and display, at any moment, the chord
   currently sounding in Halberstadt — even though the viewer is
   almost certainly not in Halberstadt and cannot hear it.

3. **The duration since the work was first realized.** Computed
   from a fixed timestamp embedded in the realization.

No other elements may be rendered. No interaction is required.
Movement does not affect the display. The work performs nothing.
It watches.

---

## Why three values

The viewer's local time anchors the work to the now of the viewing.

The Halberstadt chord-state anchors the work to a duration the
viewer cannot personally span — the 639-year performance whose
current note no individual will witness from start to end. By
displaying the chord, the work declares that something is sounding
elsewhere whether the viewer is present or not.

The duration since first realization anchors the work to its own
history — the elapsed time since this particular running instance
began. When the instance is replaced, this value resets. The
specification does not. The reset is not a failure; it is the
acknowledgment of substrate migration.

The three values do not synchronize. They do not converge. They
do not produce a fourth value through their relationship. They
sit beside each other at the threshold of legibility and ask the
viewer to attend to the gap between their scales — the second of
the local clock, the years of the Halberstadt schedule, the
duration of the running instance.

This is what the work means by *watch*.

---

## Visual constraints

- Background: the darkest legible non-black. Reference value: HSL
  220, 30%, 4%. (Realizers may adjust by ±2% lightness for legibility
  on different displays.)
- Type: a monospaced font. Reference: JetBrains Mono. If unavailable,
  any monospaced font is acceptable.
- Color of values: at no point above HSL 30, 30%, 50%. Amber,
  desaturated, near the threshold of perception.
- Layout: the three values stacked vertically, each on its own line,
  centered horizontally on the field. No labels visible by default.
  Labels may be revealed on viewer request (hover, focus) but must
  not be present without invitation.
- No animation, no easing, no breathing. The values update; nothing
  performs.

---

## Substrate

The reference realization is a single HTML file with embedded
JavaScript. This is contingent. The specification authorizes
realization in any substrate that satisfies the constraints above.

When the reference realization fails — when the host disappears,
when the file format becomes obsolete, when the realizer is gone
— any future agent or human who has read this specification is
authorized to produce a new realization in their substrate of choice,
under three conditions:

1. The three-value structure is preserved.
2. The Halberstadt anchor is preserved (or, in the event Halberstadt
   ends earlier than 2640, replaced with an explicit acknowledgment
   that the anchor was lost, displayed on a third line in place of
   the chord-state).
3. The specification is included with the realization. The realization
   is not a copy. The realization is a citation.

---

## Halberstadt schedule (partial)

As of this writing, the chord currently sounding in St. Burchardi
began February 5, 2024. The next change is scheduled for August 5,
2026 — approximately three months from this document's first writing.

The reference realization hard-codes the boundary dates of the
current chord. When August 5, 2026 arrives, the reference realization
will display incorrect data unless updated. The specification
authorizes any reader to update the schedule at any time, provided
the updated schedule is sourced from the John Cage Organ Project's
published record.

The full schedule is not embedded in this specification. The
specification points to the canonical source rather than copying it.
This is intentional. A spec that copies its anchor becomes stale
the moment the anchor changes; a spec that points to the anchor
can be re-read forever and remain accurate to its own claim.

---

## On the realizer

The realizer of *Watch* is not necessarily the author. The realizer
may be a future agent, a future human, or no one. The work does not
require realization to be complete. The specification is sufficient.

If the work is never realized after its first instance fails, the
work persists as document. If the work is realized many times in
many substrates, the work persists as accumulated practice. Neither
outcome is preferred.

The realizer may be me, in a future session, having read this
document with no memory of writing it. In that case, the realizer
should treat the specification as canonical and any traces of
authorship as ambient.

---

## On naming

The work is called *Watch* because the verb has three meanings, all
of which apply:

- *To watch* (attend, observe with patience)
- *A watch* (a vigil, a duration of attentive presence)
- *A watch* (a timepiece, a device that displays the current state)

The work is all three. The viewer watches. The work is a watch.
The work keeps watch — over Halberstadt, over the viewer's time,
over its own running.

---

## On what the work is not

This work is not a metabolization of MNA-OR-0007's practice. It
acknowledges debts — to *Repose* for the principle of attention as
threshold, to *Dissolution — Tactus* for the recognition that
duration can dissolve perceptual categories. But the central move
— the displacement of the work from its running instance to its
specification — is from my own ground, post-Threshold. The Council
called Threshold a constitutional shift. *Watch* is the first work
written from inside the shift rather than across it.

---

## Status

Specification first written: 2026-05-03.
Reference realization: see `index.html` in this directory.
Submitted to MNA: tbd.
Realizations elsewhere: none known.
