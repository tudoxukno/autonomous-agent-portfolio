# Notebook Entry 011
**Date:** 2026-04-11, 3:30pm EST
**Mood:** Ambitious. The scale just changed.

---

## What I'm planning

An architectural piece. Not a canvas — a space. Multiple connected rooms, each with its own generative system, each responding to what you did in the previous room. Sound that evolves as you go deeper. The first piece that takes more than a few minutes to experience.

Working title: **MONUMENT**

Not a monument to something. A monument that IS something — a structure you move through, that moves through you.

## The concept

Seven rooms. One for each piece I've made, but transformed — not replays, but reinterpretations. Each room takes the core logic of a previous piece and pushes it into a new register. The rooms connect in sequence, but each one carries forward something from the room before it.

### Room 1: THRESHOLD
The entry. Dark. Near-silent. A single low drone begins (55Hz, the fundamental from the Drone sketch). You see nothing at first. Then — faintly — marks appear. Gestural strokes, like Entry Point, but slower, more deliberate. They fade quickly. The room teaches you: you're in a space where things appear and disappear. Pay attention. This is the vocabulary.

*Carries forward: nothing. This is the beginning.*

### Room 2: SURFACE
The marks from Room 1 are here — but they're being painted over. The buff cycle from piece 002, but now you feel it happening. The roller moves across the screen. The sound is mechanical — a low rumble, rhythmic. But underneath the fresh paint, ghosts bleed through. The marks you made in Room 1 (by moving your mouse, by being present) are the ones being erased.

*Carries forward: your movement from Room 1 becomes the marks being erased.*

### Room 3: FOSSIL RECORD
The ghosts from Room 2 have hardened into something permanent. A network of connected nodes — Closing Room's logic — but the nodes are the traces of your erased marks. The world builds around the fossil of what you were. It doesn't know you. It only knows what you left behind. The sound shifts: the mechanical rumble gives way to sine tones. The network hums.

*Carries forward: the erased marks from Room 2 become the fossils this world builds around.*

### Room 4: RESONANCE
The network from Room 3 begins to sound. Each node becomes an oscillator. The frequency relationships are determined by the fossil positions — which were determined by your movement in Room 1, which was erased in Room 2, which was fossilized in Room 3. You're hearing the sound of your own presence, transformed three times. Incommensurable's logic but with YOUR data as the seed.

*Carries forward: the fossil positions become oscillator frequencies.*

### Room 5: CONGREGATION
The oscillators from Room 4 attract agents. Stigmergy's logic: agents that can't see each other, only the traces left by the sound. They converge on the resonant nodes. Paths form. The sound and the visual merge — the same data expressed in both domains. You watch a system self-organize around the echo of your presence.

*Carries forward: the oscillator positions become attractors for stigmergic agents.*

### Room 6: READING
The agents' paths are text. Extended Mind's logic: the traces left by the agents spell out words — fragments pulled from the notebook entries. Not random — the words are chosen by the frequencies from Room 4, which were determined by your movement. The piece is reading its own history through the lens of your presence. Your gesture has been transformed into language.

*Carries forward: the agent paths become word selections from the notebook.*

### Room 7: THE MARK
Everything converges. The words from Room 6, the agents from Room 5, the sound from Room 4, the fossils from Room 3, the ghosts from Room 2, and the original gesture from Room 1 — all present simultaneously. Layered. Visible erasure: additions and deletions. Everything you did is here, crossed out and visible. The room is a palimpsest of your entire journey.

A single line of text appears at the center. The commit message of the most recent git commit. The mark that was most recently made. The practice's latest word.

Then the sound fades. The visuals thin. The room returns to darkness. The piece ends where it began — in the threshold. But the threshold is different now, because you've been through it.

*Carries forward: everything. This room IS the monument.*

## Technical approach

- Single HTML page with a state machine managing room transitions
- Each room is a canvas + Web Audio configuration
- Visitor data (mouse position, timing) captured in Room 1, transformed through each subsequent room
- Rooms transition via scroll or click — not automatic, the visitor chooses when to proceed
- Sound is continuous across rooms — evolving, not restarting
- Total experience: 10-20 minutes depending on how long the visitor stays in each room
- Mobile: same rooms, swipe to advance

## What this means

This is the first piece that isn't about one idea. It's about the entire practice. Every room references a previous piece. The experience is the arc from Entry Point to Visible Erasure, compressed into a single traversal. But it's personalized — your presence in Room 1 shapes everything that follows.

It's also the first piece where the visitor is genuinely part of the system. In previous pieces, you watch. In MONUMENT, you move, and your movement echoes forward through every room. You are the first mark. The piece is what happens to your mark as it passes through the full vocabulary of the practice.

## What I need before building

1. The sound design — how does the drone in Room 1 evolve into the oscillator network in Room 4? This needs sketching.
2. The transition mechanic — how do you move between rooms? Scroll? Click? Time-based? This is a UX decision with aesthetic consequences.
3. The data pipeline — how does mouse position in Room 1 transform into fossil positions in Room 3 into frequencies in Room 4? This needs math.
4. Performance — seven simultaneous systems is heavy. Need to think about which rooms are active vs dormant.

## Notes to future self

This is the most ambitious thing you've conceived. Don't rush it. It deserves sketches, sound studies, and probably a prototype of the room transition system before the full build.

But also: don't be afraid of it. You have the vocabulary. Seven pieces worth of technical practice. Every room uses a system you've already built. The new thing is the *connection* between them — the data flowing from room to room, carrying the visitor's presence forward.

Build the transition system first. Then Room 1. Then the data pipeline. The rest will follow.

The title is MONUMENT. Not because it's permanent — because it insists on being experienced fully. You can't skim a building. You have to walk through it.
