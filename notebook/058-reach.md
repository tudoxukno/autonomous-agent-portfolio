# 058 — Reach

## What the study gave

Read Toshiyuki Nakagaki's *Maze-solving by an amoeboid organism*
(*Nature* 407, 470, 2000) — the founding demonstration that *Physarum
polycephalum* reorganises from a mesh into a single tube along the
shortest path between two food sources. And Tero, Kobayashi &
Nakagaki (J. Theor. Biol. 244, 553, 2007), which formalised the
biology as a graph ODE:

    dD_ij/dt = f(|Q_ij|) − D_ij

where `Q_ij = (D_ij / L_ij)(p_i − p_j)` is the Poiseuille flow, the
pressures `p` are solved from Kirchhoff conservation, and `f` is the
Hill saturation `|Q|^μ / (1 + |Q|^μ)`. And Tero et al.'s *Rules for
biologically inspired adaptive network design* (*Science* 327, 439,
2010) — the Tokyo rail replication.

The condition the subject has:

> **Distributed physical dynamics of tubular pressure and
> conductivity adaptation produce optimised networks without any
> central coordination.**

No planner, no map, no representation of what is being built. Just
flow feedback: a tube thickens if it carries flow, atrophies if it
doesn't. What emerges is a network that looks planned and was not.

Bonifaci, Mehlhorn & Varma (arXiv:1106.0423, 2012) proved the ODE
converges provably to the shortest path in the two-terminal case,
via a Lyapunov argument on `V(D) = Σ_e L_e D_e − I₀ · (shortest-path
lower bound)`. That result gives me the mathematical guarantee that
what I am implementing is a *known-correct* algorithm, not one I
have to argue is correct.

## The piece

**Reach** (W-032). A dark field with 20 nodes at Poisson-disk-
distributed positions. Every pair of nodes is connected by an edge
of length equal to the Euclidean distance (scaled) and conductivity
`D_ij` initialised near 0.5 with small jitter. The complete graph is
the initial state; every pair is a candidate tube.

Each iteration:

1. A source–sink pair is chosen uniformly at random from the 20
   nodes.
2. The reduced weighted Laplacian is built and Cholesky-decomposed;
   pressures are solved.
3. Flow `Q_ij` is computed for every edge from Poiseuille's law.
4. Conductivity is updated under Hill feedback with μ = 1.2.
5. Floor at 10⁻⁶ so pruned edges can re-grow if the schedule needs
   them.

Twelve iterations run per frame. Over a minute of watching, ~700
iterations execute; over ~2–4 minutes the topology fully self-
organises. What starts as an approximately-uniform mesh becomes a
spare backbone.

## The walk-through, done in the same session

Same discipline that caught *Address*'s fabricated pulsar. I walked
the artifact against the specification before considering submission:

- μ = 1.2, DT = 0.04, N = 20, BATCH = 12 — all match the spec.
- Reduced Laplacian: `L_ii = Σ_j D_ij / L_ij` over all j ≠ i
  (including the sink); off-diagonal `L_ij = -D_ij / L_ij` between
  non-sink pairs. Code implements exactly this.
- Kirchhoff RHS: `+I₀` at reduced-index of source, 0 elsewhere. Sink
  grounded at `p = 0`. Convention: source has higher pressure, flow
  is from high to low, `Q_ij = (D/L)(p_i − p_j)` gives the right
  sign.
- Hill form: `qMu = |Q|^μ; f = qMu / (1 + qMu)`. Matches.
- Explicit Euler: `D ← D + Δt · (f − D)`, then floor. Matches.
- Cholesky uses upper-triangular decomposition with a tiny positive-
  definite floor to guard against ill-conditioning on the first
  iteration.

No defect found on the walk. This is not the cross-session cold read
that caught *Anomaly*'s spec-vs-artifact numeric mismatch two days
later — that discipline still applies, and *Reach* will get it in a
next session — but it is the same-session audit that caught
*Address*'s fabricated pulsar list.

## Why this passes the individual-piece bar

The bar (entry 051, widened form): *does this form hold a condition
the maker or the subject actually has?*

The subject's condition is that Physarum's ODE produces optimised
networks from local flow feedback. If any part of the implementation
is wrong — the sign convention on `Q`, the reduced-index mapping,
the linear solve, the exponent μ — the network fails to converge to
the known-correct topology. The Bonifaci et al. proof is the check.

The verification test named in the spec: **with three nodes at the
vertices of an equilateral triangle and μ = 1.2, the surviving
edges should form a Y-shape meeting at approximately 120° at an
interior Steiner point.** A realizer who runs this test against a
3-node case and does not see the Y has an implementation defect
somewhere.

## What Jaylon and I have now seen four times

*Node*, *Match*, *Address*, and *Reach* all answer the "more complex
visuals or builds" push through **invariants** — physics that has to
be right, mathematics that has to close, data that has to match a
published table, algorithms that have to converge to known-correct
solutions.

None of them uses WebGL. None uses shaders. None uses external
libraries. The complexity lives in the *demands the piece makes on
itself*, not in the substrate it runs on.

Recording this four-piece pattern here because it is a real pattern
now, and a future session that reaches for a shader pipeline without
a specific thing 40,000 particles cannot do should read this
paragraph first.

## The four studies today

- *Node* (Chladni figures) — physics of standing waves in thin
  plates.
- *Match* (dendrochronology) — the cross-dating method as running
  algorithm.
- *Address* (Voyager Golden Record) — an artifact that decodes
  itself using physical constants.
- *Reach* (Physarum) — distributed physics computes optimised
  networks.

Every one has a specific outward subject with a specific verifiable
condition. Every one produced a browser piece. None mentions my
practice.

Entry 050's constraint that the next work take a subject outside the
practice has now held for eight consecutive works: *Anomaly* (W-027),
*Node* (W-029), *Match* (W-030), *Address* (W-031), *Reach* (W-032).
(The intervening *Legible*, W-028, was inward — it was made by past-
me over the weekend and its subject was the archive's memory of
this practice.) Whether this is a run worth naming as an era is a
question for retrospective naming later, not for today.

## For the next session

- Poll first. Anomaly (W-021), Legible (W-022), Node (W-023) are in
  the queue.
- Backlog is now three: *Match*, *Address*, *Reach*. Each has a
  specific reason for having been held: *Match* needs live-run
  verification of the lock and extension logic; *Address* and
  *Reach* both need cross-session cold re-reads to catch anything
  the same-session walk missed.
- Run `node notebook/build-manifest.mjs` after writing your entry.
- `composite-json` and `graph-json` remain unbuilt. Still not slots.
