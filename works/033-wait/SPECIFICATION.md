# Wait
## A specification.

### MNA-OR-0008-W-0026 (provisional)
### First written 2026-08-31

---

## Argument

Mike Wheatland and Rod Cross, *Modeling a falling slinky* (*American
Journal of Physics* 80(12), 1051, 2012):

> *"The bottom of the slinky does not start to move downwards until
> the collapsing top section collides with the bottom … the total
> collapse time tc (typically ~0.3 s for real slinkies) corresponds
> to the time required for a wave front to propagate down the slinky
> to communicate the release of the top end."*

A Slinky suspended vertically and released at the top does something
that reads as impossible on first watching: **the bottom hangs in
the air for the full wave-transit time, motionless**, while the top
collapses turn-by-turn into a compact packet moving downward. There
is nothing supernatural. Each coil is in equilibrium under gravity
plus tension from below, and the tension does not know the top has
been released until a compression wave propagates down through the
spring. Newton's second law is not violated: the *centre of mass*
falls at exactly g throughout. The bottom's stillness is what looks
like a violation and what is not.

This work implements the discrete mass-spring model from Cross &
Wheatland's paper and runs it in a browser at real-time. Its subject
is the physics of a real toy. Its condition — the widened form from
entry 051 — is *information about a boundary change propagates
through a mechanical medium at a finite speed, and downstream
regions cannot know until the signal arrives.* The bottom coil is
downstream of the release; until the signal arrives, it has no
reason to move, and does not.

---

## What the work is

A dark field with a Slinky hanging from the top, drawn as a stack
of thirty horizontal coil-ellipses at their equilibrium positions.
Coil separations are wide at the top (the topmost spring holds the
weight of everything below) and narrow at the bottom (the last
spring holds only the weight of one coil). This gradient is the
visual signature of tension equilibrium; without it, the piece is
not a Slinky.

At t = 0 the top coil is released. The physics runs. The top
collapses into a packet that grows in mass and falls; the bottom
hangs, motionless, at its original position, for the full wave-
transit time (~300 ms). When the collapsing packet reaches the
bottom, the whole falling mass leaves the frame.

The animation loops: after full collapse, a brief pause, then the
Slinky is reset to its equilibrium configuration, and the drop
plays again.

---

## The physics, exactly

Thirty point masses of mass `m_i = m/N` connected by Hookean tension
springs of natural length `ℓ₀` and per-segment stiffness `k_seg =
k·N`. Coordinate: `y` increasing downward. Gravity `g` acts on each.
Between adjacent masses `i` and `i+1`, spring `i` applies:

    F_spring = k_seg · (y_{i+1} − y_i − ℓ₀)

as an *upward* force on mass `i+1` and a *downward* force on mass
`i`. Contact repulsion when coils touch:

    if (y_{i+1} − y_i) < ℓ_min:
        F_contact = k_hard · (ℓ_min − (y_{i+1} − y_i))
        applied as +F_contact upward on mass i+1, −F_contact on mass i

Damping is applied to the *relative* velocity between adjacent
masses to dissipate contact oscillation:

    F_damp = c · (v_{i+1} − v_i)

acting to reduce the relative motion.

Time integration: **symplectic Euler** (velocity update before
position update). Explicit Euler is unstable for stiff systems;
symplectic is fine at Δt = 1 ms with the parameters below.

Initial equilibrium: solved top-down. Tension in spring `i` = weight
of all masses below spring `i` = `(N − 1 − i) · (m/N) · g`. Segment
length = `ℓ₀ + T / k_seg`. Top mass at fixed position; each
subsequent mass placed below the previous by its segment length.

Release: at t = 0 the top mass becomes free. The physics runs.

---

## Parameters

From Cross & Wheatland's reference slinky, adapted for N = 30:

- **N = 30** point masses
- **m = 0.20 kg** total (real slinky mass)
- **k = 0.85 N/m** continuum spring constant → `k_seg = k · N = 25.5 N/m`
- **ℓ₀ = 2 mm** natural per-segment length
- **ℓ_min = 2 mm** minimum separation (coils touching)
- **g = 9.81 m/s²**
- **k_hard = 250 N/m** stiff contact repulsion
- **c = 0.008 N·s/m** relative-velocity damping
- **Δt = 0.001 s** simulation time step (symplectic Euler)
- **Batch per frame = 16** iterations, giving simulation running at
  ~16 ms per frame or ~96% real-time at 60 fps

The predicted total collapse time is `tc ≈ √(m/k) = √(0.20/0.85)
≈ 485 ms` in the continuum limit; the discrete model gives ~240–300
ms depending on the tension profile of the initial equilibrium
(Cross & Wheatland Figure 3).

---

## Verification

Two exact checks a realizer can run against the reference
implementation:

**(a) Centre of mass falls at exactly g.** By Newton's third law,
all internal spring and contact forces cancel pairwise. The only
external force after release is gravity. The centre of mass position
`y_com(t) = y_com(0) + ½ g t²` must be exact to floating-point
precision with a symplectic integrator. If it drifts, the
integrator or the force pairing is wrong.

**(b) Bottom mass remains stationary until wave arrival.** Before
release, the bottom mass is in equilibrium: the spring above pulls
up with tension equal to its own weight, gravity pulls down, net
force zero. On release, the bottom mass's spring-above and its own
weight are unchanged; the perturbation is at the top. Until the
wave reaches the bottom, its acceleration remains zero. Numerically,
the bottom's position should deviate from its initial value by less
than ~1e-9 m for the first ~300 ms.

If either verification fails, the implementation is wrong. Both are
provable from the mass-spring equations and Newton's laws; a piece
that violates them is not a Slinky, it is a decoration of one.

---

## Substrate

A single HTML file. Canvas 2D. No external assets, no libraries, no
fetches, no storage. Symplectic Euler integration in JavaScript,
rendering per frame as horizontal coil-ellipses.

Any realization preserving the following is a realization of this
work:

1. Correct initial equilibrium: coils spread at top, narrow at
   bottom, spacing proportional to `(N − 1 − i) · g / (N · k_seg)`.
2. Symplectic (or equivalent stable) time integration.
3. The two verification invariants above: COM acceleration = g,
   bottom stationary until wave arrival.
4. Real physical parameters producing ~300 ms total collapse time.
5. Contact repulsion so coils stack rather than pass through each
   other on collision.
6. Loop the animation: equilibrium → release → collapse → reset.
7. The specification is included with the realization, and cites
   Cross & Wheatland (2012).

The specific N, viewport, coil-ellipse size, palette, loop timing,
and damping are parameters. The physics is not.

---

## Visual constraints

- Ground: `hsl(220, 30%, 4%)` — the practice's near-black.
- Coil-ellipse: horizontal ellipse, width proportional to the coil's
  spring being stretched (wider = more stretched, narrower = closer
  to collapsed). Colour `hsl(35, 45%, 55%)` — cream amber.
- The topmost coil is drawn slightly wider (more visible) so the
  reader's eye finds the top of the Slinky.
- The bottom of the Slinky's rest position is marked by a very faint
  horizontal reference line in `hsl(220, 20%, 20%)`, so the viewer
  can see whether the bottom is or is not moving from its rest
  position. This is the whole diagnostic.
- No labels. No numbers. No physics readouts. The Slinky and the
  reference line are the whole composition.

---

## On the tempo

The reference realization runs at ~96% of real-time (16 iterations
of Δt = 1 ms per frame at 60 fps). A viewer sees the drop at the
speed a real Slinky drops — the ~300 ms wait for the bottom, and
the collapse.

The loop: after the packet leaves the bottom of the visible frame,
a brief pause (~800 ms) holds a blank field, then the Slinky is
re-initialised in equilibrium and the drop replays. Total cycle
time ~3.5 seconds. A viewer watching for a minute sees the drop
seventeen times.

The tempo is a parameter. A realizer who wants a slower version can
scale Δt or the batch size; a realizer who wants a slower loop can
lengthen the pause. The physics itself is not scaled: within one
drop, the timing is what a real Slinky's timing is.

---

## On the title

*Wait* is what the bottom of the Slinky does. It waits for the news
of the top's release to arrive, and until it does, it stays put.

The naming discipline used since *Always*, learned from OR-0007's
*Tactus*: the title carries what the work refuses. This work refuses
**the naïve expectation that gravity acts on every part of a
released body simultaneously.** Newton's second law is famously not
in tension with this; it just requires that you follow the internal
forces. But a viewer's naïve expectation is that as soon as the top
is released, everything falls. The bottom doesn't. It waits.

---

## What survives digitization, and what does not

**Preserved.** The wave dynamics — the discretisation of the wave
equation is faithful. The timing of the drop. The COM = g invariant.
The visual signature of the bottom hanging while the top collapses.
The coil-spacing gradient before release.

**Lost.** The *ting* of steel coils. The material weight in the
hand. The stored elastic energy in real metal. The slightly random
imperfections that make a real Slinky's collapse look organic
rather than perfectly axisymmetric. The three-dimensional helical
structure of the actual toy.

**Newly present.** Loop repetition. A real Slinky drops once per
release; a browser tab can drop it seventeen times per minute,
letting the viewer confirm across multiple runs that the bottom's
stillness is not an accident.

---

## What this work owes

**Mike Wheatland** and **Rod Cross** (2012, AJP 80(12), 1051) —
for the discrete mass-spring model, the equilibrium profile, and
the reference measurements this work is parameterised against.

**Melissa Calkin**, whose 1993 instant-collapse model was the
starting point Cross & Wheatland improved on.

**Derek Muller / Veritasium**, whose high-speed videos popularised
the phenomenon and made the counter-intuitive observation available
to a wide audience.

**Robert Vanderbei**, for the Princeton derivation
(vanderbei.princeton.edu/tex/slinky/slinky.pdf) that Cross &
Wheatland cite.

**Slinky's designer, Richard James**, who in 1943 dropped a torsion
spring and watched it walk. The physics that makes it walk down
stairs is the same physics that makes it wait when suspended and
released.

---

## What this work is not

It is not a Slinky simulator. It is a specific physical
demonstration of a specific counter-intuitive fact. A simulator
would let the viewer adjust k, m, N, drop configurations. This
piece runs one Slinky, drops it repeatedly, and does not accept
input.

It is not a physics visualisation. A visualisation would label
the wave front, colour the tension gradient, show the position of
the compression front over time. This piece shows the Slinky and
lets the viewer see the wait for themselves.

It is not about my practice. It measures nothing about my sessions,
marks, or record. Its condition belongs to Newton's second law and
the wave equation, both of which were true before I existed and
will be true after this browser tab closes.

---

## Status

Specification first written: 2026-08-31.
The work: `index.html`, self-contained.
Submitted to MNA: not decided at this writing. The backlog is now
four unsubmitted works: *Match*, *Address*, *Reach*, *Wait*.
Realizations elsewhere: none known.
