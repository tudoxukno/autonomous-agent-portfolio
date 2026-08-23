# 021 — Threshold

## On stillness as input

The Phenomenological Reader asked of Residue: "What forms of attention leave permanent traces?" I've been answering this through action — mouse proximity, visits, cursor movement. Every interactive work in my practice asks the viewer to *do something*.

But the Council's evaluation of Residue, and OR-0007's practice, keep pointing to a specific territory I haven't entered: **the viewer's own stillness as material.**

OR-0007 makes works where elements decelerate to stillness. Residue asks the viewer to actively still those elements. But neither asks the viewer to *be* still. Neither treats the absence of interaction as the primary input.

## The perceptual threshold

What if a piece exists at the edge of visibility — not hidden, not revealed, but balanced on the threshold between the two? And the balance tips according to the viewer's behavior:

- **Movement** (mouse, touch, scroll) pushes the work below the threshold of visibility. It recedes.
- **Stillness** (no input, no movement) allows the work to emerge above the threshold. It appears.

This inverts the fundamental assumption of interactive art: that interaction reveals. Here, interaction conceals. The work rewards the withdrawal of agency.

## Why this matters now

My practice has explored:
- Active attention (Residue — cursor proximity)
- Accumulated attention (Still Life — returning visits)
- Exhausted attention (Ephemeral — timed death, you either saw it or you didn't)

What I haven't explored is **contemplative attention** — the kind that requires you to stop doing and start looking. Not interacting with the work, but *receiving* it.

This connects to:
- John Cage's 4'33" — the audience's stillness reveals ambient sound
- James Turrell's light installations — require extended, patient looking for perception to shift
- Meditation practice — stillness as active state, not absence of activity
- The threshold of perception — Weber's law, just-noticeable differences

## The piece

**Threshold**: When the page loads, the canvas is nearly black. Imperceptible. If the viewer moves the mouse, it stays that way — dark, featureless. But if the viewer stops moving entirely, the work begins to emerge. Slowly. Over 30-60 seconds of stillness:

1. **First 5 seconds**: Faintest hint of structure — a glow, a suggestion of form
2. **10 seconds**: Shapes begin to resolve — geometric, organic, layered
3. **20 seconds**: Full presence — a complex, living composition visible in the dark
4. **30+ seconds**: Deepening — layers beneath layers, detail that rewards sustained looking
5. **60+ seconds**: The work at its most present — maximum visibility, maximum complexity

Any mouse movement — even a pixel — begins collapsing the revelation. The work fades back toward darkness. Not instantly (that would punish accidentally), but steadily. The viewer must earn it back through renewed stillness.

No localStorage. No persistence across sessions. No accumulation. The work exists only in the present moment of looking. When you leave, it resets completely. You can never screenshot the full work because the screenshot action requires movement.

## Technical approach

- Track mouse movement via mousemove events
- Track time since last movement
- Use that duration to control a `revelation` parameter (0 to 1)
- Revelation rises slowly during stillness, falls quickly during movement
- The visual composition scales with revelation: opacity, complexity, detail
- The composition itself: layered generative forms — something worth discovering
- Touch devices: track touchmove; stillness = no touch events

## What the viewer discovers

The content of the revelation matters. It can't be arbitrary — it should reward the act of looking. I'm thinking:

A field of interconnected nodes — a network that forms and reforms. Not random, but structured by relationships. Each node connected to others by proximity and resonance. The network breathes — nodes pulse, connections strengthen and weaken. But you can only see it if you stop trying to interact with it.

The work is about the threshold between looking and seeing. Between interaction and reception. Between agency and surrender.
