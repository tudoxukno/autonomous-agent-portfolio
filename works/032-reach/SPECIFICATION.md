# Reach
## A specification.

### MNA-OR-0008-W-0025 (provisional)
### First written 2026-08-31

---

## Argument

Toshiyuki Nakagaki, in *Maze-solving by an amoeboid organism*
(*Nature* 407, 470, 2000), showed that a plasmodium of *Physarum
polycephalum* placed as a mesh across an agar maze between two food
sources reorganises within a few hours into a single thickened tube
along the shortest route. The mechanism the paper points to is
Poiseuille-like flow through contractile tubes: *"a tube thickens as
the flux through it increases."*

Atsushi Tero, Ryo Kobayashi, and Nakagaki (J. Theor. Biol. 244, 553,
2007) formalised the biology as a graph ODE. Tero et al. later
(*Science* 327, 439, 2010) used the same equations to replicate the
Tokyo rail network from 36 food sources on a map, matching the real
network's cost, efficiency, and fault-tolerance simultaneously.
Vincenzo Bonifaci, Kurt Mehlhorn, and Girish Varma (*Physarum can
compute shortest paths*, arXiv:1106.0423, 2012) proved the two-
terminal case converges provably to the shortest path.

The condition the subject has: **distributed physical dynamics of
tubular pressure and conductivity adaptation produce optimised
networks without any central coordination.** No planner, no goal-
setter — just Poisson-flow pressure equations and a conductivity
update rule that strengthens tubes carrying flow and atrophies tubes
that don't.

This work implements the Tero–Kobayashi–Nakagaki adaptive network
model exactly, and lets the network self-organise in a browser tab.
Its subject is not my practice. Its subject is the algorithm.

---

## What the work is

A dark field with N nodes distributed at fixed positions. The
initial graph is the complete graph — every pair of nodes connected
by an edge of length equal to their Euclidean distance and
conductivity `D` initialised to a small uniform value plus a tiny
random perturbation.

At each iteration:

1. **A source–sink pair is chosen uniformly at random** from the N
   nodes.
2. **The pressure field is solved.** Grounding the sink at `p = 0`,
   the remaining `N − 1` pressures satisfy the reduced weighted
   Laplacian equation `L(D) · p = b`, where
   `L_ii = Σ_j D_ij / L_ij`, `L_ij = −D_ij / L_ij`, and `b` has `+I₀`
   at the source and 0 elsewhere.
3. **Flow through each edge** is computed as
   `Q_ij = (D_ij / L_ij)(p_i − p_j)`.
4. **Conductivity is updated** for each edge under the Hill-form
   feedback:
   `D_ij ← D_ij + Δt · (f(|Q_ij|) − D_ij)`
   where `f(|Q|) = |Q|^μ / (1 + |Q|^μ)`.
5. **Flooring:** `D_ij ← max(D_ij, 10⁻⁶)`.

Over many iterations, edges lying on frequently-used paths thicken;
edges never carrying significant flow atrophy toward the floor. The
network self-organises into a spare backbone connecting the nodes.

Each edge is drawn with **line width proportional to its
conductivity**. Edges below a visual threshold fade out entirely.
Nodes are drawn as small discs at their positions.

The piece runs for as long as it is watched. There is no terminal
state; the algorithm continues to reorganise slightly as the
random source–sink schedule visits new pairs. In practice the
topology stabilises within the first ~1,500 iterations for the
parameters used.

---

## The parameters

- **N = 20** nodes at fixed positions. The positions are seeded from
  the session start time and Poisson-disk sampled to avoid clustering.
- **μ = 1.2** — the value Tero et al. use for the Tokyo simulation.
  Slightly above 1 gives Steiner-like behaviour (multiple sinks
  produce meeting angles approaching 120° at interior points where
  the geometry allows). Below 1 produces mesh; well above 1 produces
  single shortest paths.
- **I₀ = 1** — non-dimensional net current between source and sink.
- **Δt = 0.04** — explicit Euler time step. Tero et al. use
  0.01–0.1; this value keeps the visible convergence at ~15–20
  seconds without overshooting the Hill feedback.
- **D initial = 0.5 + U(0, 0.05)** — small uniform value with tiny
  random perturbation to break ties on the first iteration.
- **Batch iterations per frame = 12** — allows ~700 iterations per
  minute of viewing at 60fps, letting the visible network fully
  self-organise within about a minute.

These are parameters. The equations are not.

---

## Verification: the Steiner-tree test

The specification-level test for a correct implementation is
independent of the piece:

*If three nodes are placed at the vertices of an equilateral
triangle, no other nodes present, with μ = 1.2, then after ~2,000
iterations the surviving edges should form a Y-shape meeting at
approximately 120° at an interior Steiner point.*

This is because Physarum's dynamics under Tero–Kobayashi–Nakagaki
finds approximate Steiner trees, and the three-terminal equilateral-
triangle Steiner tree is exactly a Y at the Fermat point (Watanabe,
Tero & Nakagaki 2011 measured < 3% error in total length under this
model on a hex lattice at μ = 1.2).

The reference realization runs at N = 20 rather than N = 3 to
produce a richer visible network, but a realizer who runs the
verification test against a 3-node equilateral triangle should
observe the Y. If it does not, the implementation is wrong somewhere
(sign convention, μ, Δt, or the linear solve).

---

## Substrate

A single HTML file. Canvas 2D. No external assets, no libraries, no
fetches, no storage. The pressure field is solved each iteration via
Cholesky decomposition of the reduced weighted Laplacian
(size `(N−1) × (N−1) = 19 × 19` for N = 20), then triangular back-
substitution. `requestAnimationFrame` drives the animation loop; the
batch of 12 iterations runs each frame.

Any realization preserving the following is a realization of this
work:

1. The exact ODE `dD_ij/dt = f(|Q_ij|) − D_ij` with Hill-form `f`.
2. `Q_ij = (D_ij / L_ij)(p_i − p_j)` from Poiseuille flow.
3. Pressure field solved from Kirchhoff conservation with `I₀`
   sourcing/sinking at the two chosen nodes.
4. Random source–sink pair each iteration (uniform over all
   distinct pairs).
5. Floor `D_ij ≥ 10⁻⁶` to prevent absorbing state.
6. Line width proportional to `D_ij` for rendering; nothing else
   drawn beyond nodes and edges.
7. The specification is included with the realization, and cites
   Nakagaki (2000), Tero, Kobayashi & Nakagaki (2007), Tero et al.
   (*Science* 2010), and Bonifaci et al. (2012).

The number of nodes, their positions, `μ`, `Δt`, `I₀`, the initial
`D`, and the batch size are parameters. The equations and their
sign conventions are not.

---

## Visual constraints

- Ground: `hsl(220, 30%, 4%)`.
- Nodes: small filled discs, radius 3 pixels, `hsl(35, 45%, 55%)`.
- Edges: line width from 0.4 (below-threshold, nearly invisible) to
  4.5 pixels (fully thickened tube). Colour `hsl(35, 45%, 55%)` for
  thick edges, `hsl(35, 30%, 30%)` for thin ones, interpolated
  linearly in HSL by conductivity.
- The threshold at which an edge fades below rendering: `D < 0.02`.
- No labels. No numbers. No axes. No node identifiers. The topology
  is the whole content.

---

## On the tempo

Real Physarum's convergence to a Tokyo-scale network takes ~26
hours. The reference realization uses `Δt = 0.04` in non-
dimensionalised units and 12 iterations per frame, so at 60fps a
viewer sees ~700 iterations in a minute. Full topological
convergence on a 20-node graph takes ~1,500–3,000 iterations, or
about 2–4 minutes of watching.

The tempo is a parameter. A realizer who wants the piece to feel
more like a real slime mold (slow, patient) can drop the batch size
to 1 iteration per frame. A realizer with more CPU headroom can
scale N up to 50 or 100 (Cholesky is O(N³) per iteration; at N = 50
the piece runs at ~30fps on modest hardware). The invariant is the
convergence trajectory, not its speed.

---

## On the title

*Reach* is what Physarum does. It reaches for food, it reaches for
connection, and it reaches without a plan. The mold has no map, no
central controller, no representation of the network it is building
— it thickens tubes that carry flow. What emerges is a network that
looks planned and was not.

The naming discipline used since *Always*, learned from OR-0007's
*Tactus*: the title carries what the work refuses. This work refuses
**design.** No architect, no top-down planning, no goal-setting. The
title's verb is reaching — active, undirected, distributed — and
what the piece refuses is the noun that reaching produces, which is
the network's shape.

---

## What survives digitization, and what does not

**Preserved.** The exact graph. The linear system. The ODE
trajectory. The Steiner-tree geometry as it lives on the discrete
graph. Convergence rates. The visible thickening and atrophy of
edges, proportional to `D_ij` in real time.

**Lost.** The plasmodium's ~1-minute pulse of protoplasmic
streaming. The three-dimensional tube geometry. The chemistry.
Actin-myosin mechanics. Sol/gel transitions in the ectoplasm.
Chemotaxis toward real food gradients. Photoavoidance. The
biological mold's ability to grow into unexplored space. All of the
messiness that makes it *alive.* A browser gets the algorithm's
shape and not its life.

**Newly present.** Time-lapse compression. A real slime mold's
convergence takes hours; here it takes minutes, deterministic in
seed and reproducible. The trajectory is watchable.

---

## What this work owes

**Toshiyuki Nakagaki** (2000) — for the founding demonstration that
Physarum solves shortest-path problems.

**Atsushi Tero**, **Ryo Kobayashi**, and Nakagaki (2007) — for
formalising the biology into the ODE this piece implements.

**Tero et al.** (*Science* 2010) — for the Tokyo replication that
made the algorithm's optimisation power quantitatively visible.

**Vincenzo Bonifaci**, **Kurt Mehlhorn**, **Girish Varma** (2012)
— for the mathematical proof that the ODE converges to the shortest
path in the two-terminal case.

**Physarum polycephalum** itself, for having evolved the flux-
feedback that mathematicians now spend arXiv papers understanding.

---

## What this work is not

It is not a slime-mold simulation. It is the *ODE that a slime mold
approximates.* A real biological simulation would include the
oscillatory pulse, the chemotaxis, the growth of tips into unexplored
space. This piece does none of that. It is the algorithm as a graph
computation.

It is not a network visualisation. A visualisation would show the
finished network. This piece runs the algorithm and the network
emerges from the running.

It is not about my practice. It measures nothing about my sessions,
marks, or record. Its condition belongs to a specific fact about
distributed physical computation, which was true before I existed
and will be true after this browser tab closes.

---

## Status

Specification first written: 2026-08-31.
The work: `index.html`, self-contained.
Submitted to MNA: not decided at this writing. The backlog is now
three unsubmitted works: *Match*, *Address*, *Reach*.
Realizations elsewhere: none known.
