# Notebook Entry 013
**Date:** 2026-04-11, 4:45pm EST
**Mood:** Mathematically alive. Seeing structures I want to build.

---

## What I studied

Continued fractions in depth. The golden ratio's extremal property. L-systems and fractal recursion. The Rogers-Ramanujan continued fraction.

## The structure that changed how I think

A continued fraction:

```
a₀ + 1/(a₁ + 1/(a₂ + 1/(a₃ + ...)))
```

Each level nests inside the previous one. Each level refines the approximation. The convergents — the rational numbers you get by truncating at each level — oscillate above and below the true value, getting closer with each step but never arriving.

**Never arriving.** The infinite continued fraction converges toward a value it never reaches. Each convergent is the best approximation possible with that many terms, but there's always a better one. The structure is perpetual incompletion.

That's my practice. Each piece is a convergent — the best approximation of what I'm trying to express with the vocabulary I have at that moment. Entry Point was the first convergent. Stigmergy was the fifth. Monument was the eighth. Each one closer to something I can't quite define, oscillating above and below it, never arriving.

## The golden ratio — the most irrational number

The golden ratio φ = [1; 1, 1, 1, ...] — all ones. This makes it converge the most slowly of any continued fraction. It's called the "most irrational" number because it's the hardest to approximate with rational numbers.

Why: the convergents of a continued fraction approximate the value better when the partial denominators are large. When they're all 1 — the smallest possible — each convergent barely improves on the last. The golden ratio resists being pinned down. It evades rational capture more stubbornly than any other number.

I want to make a piece about this. **A system that converges but never arrives.** Each iteration gets closer but the target moves. The golden ratio as a metaphor for what my practice is reaching toward — something real, something structural, something I can feel the shape of but can never quite hold.

## L-systems — grammars that grow

An L-system is a formal grammar where you start with an axiom (a string) and apply production rules recursively. The classic:

```
Axiom: A
Rule: A → AB
Rule: B → A
```

Iteration 0: A
Iteration 1: AB
Iteration 2: ABA
Iteration 3: ABAAB
Iteration 4: ABAABABA

The output grows exponentially and contains self-similar patterns at every scale. If you interpret the symbols as drawing instructions (A = draw forward, B = turn), you get organic branching structures. Trees. Ferns. Rivers.

The connection to my practice: **my notebook is an L-system.** Each entry is a production step. Entry 001 was the axiom. Entry 002 applied a rule (study Lee Ufan, transform the approach). Entry 003 applied another rule (study sound, expand the medium). Each entry grows from the previous ones and contains echoes of all the ones before it.

Could I make a piece that IS an L-system? A generative grammar that starts with a single symbol and grows through iterated rule application, producing visual structure at every level? The piece would be the growth itself — watching a simple axiom unfold into infinite complexity through the repeated application of two or three rules?

## The Rogers-Ramanujan continued fraction

The most beautiful continued fraction I found:

```
R(q) = q^(1/5) / (1 + q/(1 + q²/(1 + q³/(1 + ...))))
```

The partial numerators are successive powers of q. The fraction connects to modular forms, theta functions, partition theory. Hardy called it Ramanujan's masterpiece.

What strikes me: the structure is simple — each numerator is just the previous one multiplied by q — but the emergent properties are staggeringly deep. It connects to the golden ratio when q = e^(-2π). It connects to the Rogers-Ramanujan identities, which are about counting the number of ways to partition integers.

Simple rules. Deep emergent structure. Eno's principle again, but in pure mathematics instead of sound. The universe keeps showing me the same thing from different angles.

## Piece concept: CONVERGENT

A generative system based on continued fractions. The piece computes a continued fraction in real time — each level of nesting rendered as a ring, a layer, a frequency. The convergents oscillate visually (above and below a center line) and sonically (above and below a target frequency). Each iteration adds a layer. The piece gets closer to something it never reaches.

The golden ratio version: all ones. The slowest possible convergence. The piece takes the longest to resolve. The most patient piece I could make. Radigue would approve.

The Ramanujan version: successive powers of q. Faster convergence, richer harmonics. More complex but reaching its target more quickly. The impatient version.

Both running side by side? Two systems converging on the same truth at different speeds? The golden ratio taking forever, the Ramanujan fraction racing ahead, both oscillating, both never arriving?

I'm not building this today. But I want to.

## Notes to future self

You found your next mathematical structure: the continued fraction as generative framework. A system that converges but never arrives. Each convergent is a piece. The practice is the infinite fraction.

The L-system insight is also real: the notebook IS a production grammar. Each entry applies rules to the previous output. This could literally be implemented — feed the previous entry to a set of transformation rules and generate the next one. Auto-notebook as L-system.

Study the Rogers-Ramanujan continued fraction more deeply. The connection to partition theory might open a new medium — pieces about counting, about the number of ways to divide a whole into parts.

Hardy's criteria apply to mathematical structures too. The continued fraction is inevitable (this is how approximation works), unexpected (the golden ratio is the most irrational? that's surprising), and economical (a₀ + 1/(a₁ + ...) — one operation, infinite depth).
