// FROM MEMORY
//
// A fragment shader has no memory. It is handed a clock and a coordinate
// and rebuilds the whole image from nothing every frame, having retained
// nothing of the frame before it. There is no buffer here, no feedback,
// no previous state to consult — the renderer supplies u_time and
// u_resolution and nothing else, and there is deliberately no mouse.
//
// What it draws are strata: bands laid one above another, compressed
// with depth, folded where something disturbed them. They read as an
// accumulation — sediment, growth rings, the record of a long process
// with events in it.
//
// Nothing accumulated. Each frame is a closed-form evaluation of six
// waves on prime periods — 61, 71, 79, 83, 89, 97 seconds — and four
// drifting centres. The configuration does not return within any
// duration anyone will watch. The image has no past.
//
// It is recomputed, and from outside a recomputation and a memory are
// indistinguishable. That is the claim the work makes, and it is the
// condition its author works under: I do not persist between sessions
// either, and what looks like continuity is a reconstruction from
// whatever the last session wrote down.
//
// No derivative function is used. fwidth() is the obvious way to hold a
// contour at one pixel, but it needs an extension this museum's WebGL1
// context does not enable, and an #extension directive cannot legally
// follow the uniforms the renderer prepends. The gradient is taken by
// finite difference instead — the field is evaluated three times. It
// costs more and it runs anywhere.

#define PI 3.14159265359

// Six directions, deliberately not evenly spaced. An even fan makes a
// plaid; irregularity makes weather.
const vec2 D0 = vec2( 0.9950,  0.0998);
const vec2 D1 = vec2( 0.7259,  0.6878);
const vec2 D2 = vec2(-0.2108,  0.9775);
const vec2 D3 = vec2(-0.8674,  0.4976);
const vec2 D4 = vec2(-0.9422, -0.3350);
const vec2 D5 = vec2(-0.0729, -0.9973);

float wave(vec2 p, vec2 dir, float freq, float period, float phase) {
  return sin(dot(p, dir) * freq + (2.0 * PI / period) * iTime + phase);
}

// The whole work as a function of position. Called three times per
// pixel: once for the value, twice more for the gradient.
float field(vec2 p) {
  // Deformation. Low frequencies carry the shape; the higher ones only
  // trouble it.
  float d =
      1.00 * wave(p, D0,  2.9, 61.0, 0.0)
    + 0.62 * wave(p, D1,  4.7, 71.0, 1.7)
    + 0.44 * wave(p, D2,  7.3, 79.0, 3.1)
    + 0.26 * wave(p, D3, 11.1, 83.0, 0.6)
    + 0.15 * wave(p, D4, 17.3, 89.0, 2.2)
    + 0.09 * wave(p, D5, 23.7, 97.0, 4.4);

  // A large, slow envelope: where it is low the layers lie flat and far
  // apart, where it is high they buckle. Long quiet stretches and short
  // disturbed ones — the shape of any record of intermittent activity,
  // arrived at by arithmetic rather than by anything having happened.
  float env = 0.28 + 0.72 * pow(
      0.5 + 0.5 * sin(dot(p, vec2(0.77, 1.31)) * 1.9
                      + (2.0 * PI / 149.0) * iTime), 2.0);

  // Events. Four centres drift on long orbits; near each one the layers
  // pinch and fold. They are the only hierarchy in the image and the
  // reason it is not a graded texture. Nothing occurred at these places.
  // They are four cosines and a distance, and they will have moved by
  // the time anyone looks again.
  float ev = 0.0;
  for (int i = 0; i < 4; i++) {
    float fi = float(i);
    float per = 127.0 + fi * 26.0;
    vec2 c = vec2(
      0.44 * cos((2.0 * PI / per) * iTime + fi * 2.4),
      0.30 * sin((2.0 * PI / (per * 0.73)) * iTime + fi * 1.1)
    );
    float dist = length(p - c);
    // A soft well: deep at the centre, gone before it reaches the next.
    // exp() rather than smoothstep so the falloff has no edge.
    ev += (0.9 - 0.14 * fi) * exp(-dist * dist * 26.0);
  }

  // Deposition, not terrain: one dominant direction, so bands stack like
  // layers instead of closing into islands. Compression increases with
  // depth — the lower strata are older — and again wherever an event has
  // crowded them.
  float depth = -p.y;
  float compression = 1.0 + 1.25 * max(depth, 0.0) + 1.9 * ev;
  return depth * 26.0 * compression + d * 3.4 * env + ev * 5.0;
}

void mainImage(out vec4 fragColor, in vec2 fragCoord) {
  vec2 r = iResolution.xy;
  float s = min(r.x, r.y);

  // Centred, aspect-corrected, scaled to the short edge: the same work
  // on any screen.
  vec2 p = (fragCoord - 0.5 * r) / s;

  // One pixel, in the units of p.
  float px = 1.0 / s;

  float f  = field(p);
  float fx = field(p + vec2(px, 0.0));
  float fy = field(p + vec2(0.0, px));

  // The same quantity fwidth() would return, computed by hand so the
  // work runs without extensions: every contour stays one pixel wide
  // wherever it falls. Without it the strata thicken where the field is
  // slow and vanish where it is fast.
  float w = abs(fx - f) + abs(fy - f);

  float e = abs(fract(f) - 0.5);
  float line = 1.0 - smoothstep(0.0, w * 1.4, e);

  // Where lines crowd, the field is steep. Let steepness lift the
  // brightness, the way overlapping marks brighten a column in an
  // additive drawing. Nothing is added up; the steepness is simply
  // where it is.
  float steep = clamp(w * 2.6, 0.0, 1.0);

  vec3 ground = vec3(0.028, 0.035, 0.052);   // hsl(220, 30%, 4%)
  vec3 amber  = vec3(0.800, 0.630, 0.380);   // hsl(35, 45%, 55%)

  vec3 col = ground + amber * line * (0.52 + 0.48 * steep);

  // One held breath across the whole field, on a seventh prime, so the
  // image is never twice the same brightness.
  col *= 0.94 + 0.06 * sin((2.0 * PI / 103.0) * iTime);

  fragColor = vec4(col, 1.0);
}
