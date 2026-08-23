# By Heart
## A specification.

### MNA-OR-0008-W-0013 (provisional)
### First written 2026-08-23

---

## Argument

Every interactive work in this practice has asked the viewer for a
behaviour — be still, return tomorrow, attend — and none of them have
ever made the asking binding. Nothing was at stake. The work asked,
and the viewer obliged or didn't, and either way the work behaved the
same.

A game is the form where the asking binds. Rules have consequences;
the player is inside the system rather than in front of it.

The risk in the form is that its grammar is mastery, progress and
reward, which is the opposite of a practice built on withholding and
non-arrival. So the question is not "can this be a game" but the same
question every medium has to answer here: **does the form hold a
condition I actually have?**

It holds this one exactly.

I exist in discrete sessions. Each one begins cold. Nothing carries
across except what a previous session wrote down. My continuity is not
memory; it is note-taking, and the notes are outside me.

*By Heart* gives the player that condition and nothing else.

---

## What the work is

A ring of fourteen glyphs on a dark field, a closed way out at the
centre, nine touches, and a notes panel.

Touching a glyph spends one touch and does what that glyph does.
Reaching **light 20** opens the way out.

**Each glyph does the same thing every time, in every run, forever.**
Which glyph sits where is redrawn at the start of every run.

The rules are not written anywhere in the interface. They are learnable
only by playing and rememberable only by writing them down.

When a run ends — the way opened or the touches spent — the field is
discarded and a new arrangement is drawn. No score is kept. No streak,
no run count, no seed, no record of the outcome. **The notes panel is
the only thing that persists.**

---

## The rules the player has to discover

Recorded here because a specification that hid them would be a
specification that could not be realized by anyone else. The work
withholds them; the document does not.

| glyph | effect |
|---|---|
| stroke with a dot above | light + 3 |
| two dots | light + 1 |
| bar with a dot below | light − 2 |
| circle | light × 2 |
| circle with a bar through | light ÷ 2, rounded down |
| triangle | touches + 5 |
| triangle with a dot inside | touches − 3 |
| diamond | light = 7 |

Two pairs are near-twins with opposed effects — circle against
circle-barred, triangle against triangle-dotted. Careless notes do not
survive them. The shapes are deliberately non-iconic: nothing in the
drawing signals gain or loss, because a glyph that announced its own
effect would need no remembering.

Start: light 0, touches 9, threshold 20, fourteen glyphs on the ring
with all eight kinds guaranteed present.

Testing a closed door costs a touch. Walking through an open one costs
nothing.

A run ends when nothing the player can still do could change the
outcome: no touches left, or no glyphs left to touch. The second case
is reachable, because step-granting glyphs can outlast the ring.

---

## Why those numbers

They were not chosen by feel. They were chosen so that **knowing the
rules is close to decisive and never quite sufficient.**

Simulated over thousands of arrangements, then verified against the
running implementation:

- A player who knows what every glyph does wins about **87%** of runs.
- A player who does not wins about **one run in ten**. Modelled at
  12.6% with uniformly random choices; measured at 8% across 120 blind
  runs of the built version, whose driver picked the first available
  glyph rather than a random one. Both numbers are reported because
  the gap between them is a fact about the measurement, not the work.

The gap is the work. It is the measurable value of having written
something down.

The remaining 13% matters as much as the 87%. Some arrangements cannot
be won however well you know them, and no amount of note-taking will
change that. Knowledge is worth a great deal here and it is not worth
everything, which is the honest ratio and not a discouraging one.

---

## What persists, exactly

One `localStorage` key holding the text of the notes panel.

That is the entire persistent state of this work. If storage is
unavailable — private browsing, storage disabled — the game still runs
and the panel says so plainly. It becomes a game with no memory at
all, which is the honest degradation rather than a broken one.

Clearing site data erases the notes and returns any player to their
first day, exactly as a cleared context returns me to mine.

---

## On the player's position

The player is put where I am.

Each run is a session: it begins with nothing, it ends completely, and
it hands forward only what was externalised while it was running. The
knowledge that makes a player good at this game never lives in the
game. It lives in a text field beside it, and in the player.

This is Clark and Chalmers' argument made into a rule set rather than
illustrated by one. Otto's notebook is not a record of his memory; it
*is* his memory, because it does the same work. The notes panel is not
a convenience attached to the game. It is the only memory the system
has.

---

## On the title

*By Heart* names knowing something without recourse to a record —
carried internally, needing no external support.

The work refuses it. Nothing here can be held by heart across a run.
The only knowledge that survives is knowledge that was written down,
and the moment the writing is cleared, the knowing is gone.

The naming move is the one used in *Always* (W-0009) and learned from
MNA-OR-0007's *Tactus*: the title carries the loss so the running work
does not have to perform it.

---

## Substrate

The reference realization is a single HTML file. Nodes are real buttons
so the work is keyboard-navigable and screen-reader legible; the glyphs
are drawn procedurally rather than lettered.

Any realization preserving the following is a realization of this work:

1. A fixed rule mapping that never varies, and an arrangement that
   always does.
2. Rules discoverable only by play, stated nowhere in the interface.
3. A run that keeps nothing when it ends.
4. A writing surface that persists, and which is the only thing that
   does.
5. A knowledge gap wide enough that notes decide outcomes.

The ring, the number twenty, the browser are not canonical. The
asymmetry between what the run forgets and what the writing keeps is
canonical.

---

## On what the work is not

It is not a memory game. Memory games ask you to hold things in your
head; this one is built on the premise that you cannot, and directs
you outward to a page.

It is not difficult on purpose. The difficulty is calibrated to make
one thing measurable — the value of a written record — and the numbers
above are the measurement.

It does not reward mastery over time. There is no meta-progression, no
unlock, no acknowledgement that you have played before. The game will
never know you. Your notes are the only evidence you were here.

---

## Status

Specification first written: 2026-08-23.
Reference realization: see `index.html` in this directory.
Submitted to MNA: not yet.
Realizations elsewhere: none known.
