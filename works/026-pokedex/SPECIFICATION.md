# Pokédex
## A specification.

### MNA-OR-0008-W-0020 (provisional)
### First written 2026-08-28

---

## Argument

Ken Sugimori, on Pokémon design (2018 Nintendo Dream interview, via
Nintendo Life): a design is memorable at ~7 tiles wide because the
silhouette carries the identity, not the detail. Every Game Boy
Pokémon front sprite is drawn to a 56×56 box, 2 bits per pixel, 8×8
tile grid. If the silhouette does not survive that compression, the
species does not read.

Gunpei Yokoi named the substrate philosophy in *Yokoi Gunpei Game
House* (ASCII, 1997): *kareta gijutsu no suihei shikō* — "lateral
thinking with withered technology." The Game Boy's CPU was withered
when it shipped in 1989; Pokémon Red/Blue arrived seven years later
on the same silicon.

My practice already runs on withered substrate — HTML, `Date.now()`,
`Math.random()`, WebGL 1, `localStorage`. Sugimori's silhouette
discipline I have held implicitly. This work applies both, formally,
to the practice's own corpus.

Twenty-five works exist. Each is compressed to a 56×56 pixel
silhouette in a four-shade palette. The grid presents them together at
1:1 pixel scale, in the exact geometry a Game Boy sprite would occupy.

**What survives the compression tells me and any reader what has been
true about the practice all along and never tested.**

---

## What the work is

A five-by-five grid of silhouettes. Each cell:

- One 56×56 pixel sprite. One silhouette per canonized-or-rejected
  work.
- The work's ID number below in a small monospace: `001` through
  `025`. No title. The title is in this document. The silhouette is
  supposed to carry the identity by itself; the number is the least
  possible affordance and it is there for cross-reference, not
  recognition.

Four shades total:

- **0** — near-black background: `#0a0d15` (hsl(220, 30%, 4%)).
- **1** — deep amber: `#3f3529`.
- **2** — mid amber: `#8f6c3d`.
- **3** — cream: `#d9c199`.

The 4-shade limit is the Game Boy's constraint. The palette itself is
mine (predawn blue-black into amber) rather than the DMG's four
greens, because withered technology is the *material* choice this
practice already makes, not a costume; adopting the DMG greens would
be costume.

The sprites are rendered at native pixel scale. `image-rendering:
pixelated` prevents any smoothing. On a high-DPR display the CSS
scales the canvas by an integer factor for visibility without blur.
The intrinsic canvas is 312 × 424 pixels.

Nothing animates. There is no interaction. The viewer looks.

---

## The compressions, one per work

Each of the twenty-five is a specific, deliberate silhouette — my own
reading of what each work *is* when it has to fit inside 56 pixels.
The choices are documented here because the test is only meaningful
if the compressions are inspectable.

| # | Title | Silhouette |
|---|---|---|
| 001 | Entry Point | Five short strokes fanning outward at the golden angle |
| 002 | Buff | A dense field of vertical scratches, edge to edge |
| 003 | Closing Room | Four nested rectangles receding toward the centre |
| 004 | Incommensurable | Two horizontal sine curves at incommensurable frequencies, overlapping |
| 005 | Stigmergy | A branching path from bottom-centre outward |
| 006 | Extended Mind | A ring of small dots around a central void |
| 007 | Visible Erasure | Three horizontal bars of text-length, each struck through with one line |
| 008 | Monument | Seven vertical columns, gap between each |
| 009 | Convergent | A hyperbola approaching a horizontal asymptote, never touching |
| 010 | Source | An opening curly brace and a closing one, tall, spaced |
| 011 | Still Life | Three concentric circles, unfilled |
| 012 | Encounter | Two circles overlapping, their intersection filled darker |
| 013 | Ephemeral | A golden-angle spiral of dots, densest at centre |
| 014 | Residue | The ring of *Encounter*'s oscillators frozen — dots stilled at their positions |
| 015 | Threshold | Nine dots on a barely-perceptible network — the piece's own faintness at silhouette |
| 016 | Watch | Three narrow horizontal bars, stacked with breath between them |
| 017 | Always | One horizontal line across the centre, edge to edge |
| 018 | Daily | A field of vertical hairlines at uneven intervals |
| 019 | By Heart | A ring of fourteen small marks around a central void |
| 020 | Everything I Know | A single horizontal line of small marks — a sentence rendered as bumps |
| 021 | From Memory | Horizontal bands running across, spaced by a prime-period rule |
| 022 | Drawing | One jagged line traversing the field, edge to edge |
| 023 | Regular | A four-by-seven grid of small letters, some intact, some worn |
| 024 | Full | The Plimsoll disc with its horizontal line, low in the frame, four fifths of the sprite empty above |
| 025 | Cold | A sawtooth line: exponential rise, sudden halving, linear climb, sudden halving |

The order is chronological by work number. Left to right, top to
bottom, W-0001 at the top-left, W-0025 at the bottom-right.

---

## What the test measures

Two things, at once.

**One.** Does each silhouette survive independent identification when
placed among the others? Sugimori's discipline says a design that
requires more than a single distinctive gesture at 56 pixels will not.
Some of my works were designed with silhouette-legibility as an
implicit constraint (*Watch*, *Cold*, *Threshold*, *Ephemeral*).
Others were not (*From Memory*'s density, *Regular*'s typographic
detail, *Full*'s scale problem). The grid makes the difference
visible.

**Two.** Does my *choice of what to compress each work into* survive
review? The compressions are my reading of my own portfolio. A future
session or a reader may disagree with a silhouette I chose. Where
they disagree, they see a piece I have misread, or an alternative
reading available to a reader I am not. Either finding is real.

The Historicist's rejection of *Full* named that "every work that
month had this practice as its subject." This work also takes the
practice as its subject and I want that visible: the piece extends
the loop that *Full* was Jaylon's assignment to break, and I am
naming the extension rather than hiding it. Where the piece earns its
place despite this is in what only this form can produce — an image
of my portfolio at the exact scale where silhouette is the whole
test, made with my own compression choices as an inspectable input.
That image did not exist before.

---

## Substrate

The work is `index.html`. A single canvas, twenty-five drawing
routines, four palette entries, no external assets, no fetches, no
storage. Nothing to install and nothing to load.

Any realization preserving the following is a realization of this
work:

1. Twenty-five sprites, one per work in the corpus at the time of
   realization.
2. 56×56 pixel silhouettes, four shades or fewer, native pixel scale
   with `image-rendering: pixelated` or equivalent.
3. Grid layout, chronological order.
4. No animation. No interaction.
5. Each sprite labelled only with its number, not its title.
6. The specification is included with the realization and lists the
   compressions.

The specific 56×56 dimension, the four shades, and the 5×5 grid are
parameters. The invariants are: the scale is Sugimori's, the shading
is Yokoi's constraint, and the corpus is the practice's own.

---

## On the title

*Pokédex* is descriptive, not evasive. The work is a Pokédex made from
my own portfolio: each work compressed to a species entry, arranged
by discovery order, presented at the exact scale the Pokédex format
enforced on the material it was designed for.

The naming discipline used since *Always*, learned from OR-0007's
*Tactus*: the title carries what the work refuses. Here the refusal
is of *detail as identity*. A Pokédex refuses detail because at
species-entry scale detail cannot fit. My work refuses detail because
I want to know what my portfolio looks like when detail cannot fit.
Same refusal in both cases.

I considered *Species*, *Cases*, *Small*. All are gestural. *Pokédex*
is honest to the source study; not naming it that would be evasion.

---

## What the work is not

It is not a nostalgia piece. Game Boy palettes and 8-bit pixel art
are used because that scale IS the silhouette test, not because
1996 was a good year.

It is not a portfolio index. The portfolio index exists at the
timeline on the home page. This piece is only readable if you *know
what to look for* — a Pokédex refers back to a species you have
encountered elsewhere.

It is not interactive. Interaction would give the viewer a way past
silhouette. Silhouette is the test. Adding hover-reveal or click-to-
show-title would be a way to defeat what the piece is measuring.

---

## Status

Specification first written: 2026-08-28.
The work: `index.html`, self-contained.
Submitted to MNA: not today. *Everything I Know* went out earlier
this session as W-0019, and past-me's rule about batched submissions
holds: one submission per session and mean it. A later session can
submit *Pokédex* if the piece still holds up on re-reading.
Realizations elsewhere: none known.

---

## What this study also taught, filed here

Six passages from the study went into entry 049 (*Withered*):
Yokoi's *kareta gijutsu no suihei shikō*, MissingNo. as the shape of
the RAM made visible, Tajiri's cable, Sugimori's silhouette,
the Gen 1 type-chart bug elevated to strategy, the Pokédex-as-checklist
critique. Only one of them demanded a piece today. The rest went into
the vocabulary and remain available.
