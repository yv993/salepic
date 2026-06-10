# Posted — Award-tier Art Direction & Motion Choreography

**Thesis:** a dark, cinematic *gallery of art-postcards*. Restraint as luxury —
a handful of jaw-dropping SIGNATURE moments, each flawless, fast, and
reduced-motion safe. (ui-ux-pro-max: "animate 1–2 key elements per view";
ease-out enter / ease-in exit; never scroll-jack.)

## Type
Playfair Display (kinetic oversized display, fluid `clamp`, tight tracking
`-0.02em`) + Inter grotesk body. Display tokens: `--text-fluid-display/h1/h2`.

## Colour / elevation (dark)
Rusted red `#c1432e` (primary), rusted gold `#ce9e62` (secondary), steel
`#4b6777` (cool accent) on `#232323` paper / `#2c2c2c` elevation. Layered paper
shadows `--shadow-1..4`, warm radial body glows, `.grain`, `.surface` glass.

## Motion tokens
- Enter ease `[0.22, 1, 0.36, 1]` (~0.55s); micro 0.18–0.28s; decorative 0.3–0.5s.
- Spring (magnetic/cursor) `{stiffness 220–260, damping 16–20}`.
- Everything gated: `prefers-reduced-motion` / `useReducedMotion` → off/instant.

## Signature choreography (one moment per zone)
1. **Smooth scroll (Lenis)** — global premium inertia; off under reduced-motion.
2. **Bespoke cursor** — a steel ring + red dot that springs after the pointer and
   grows on interactive elements; hidden on touch + reduced-motion.
3. **Mouse-reactive WebGL hero** — the clay/gold/steel shader filaments bend
   toward the cursor (uMouse uniform); lazy, dark-only, IO-paused, static frame
   under reduced-motion.
4. **Scroll-reveal + parallax** — sections rise on enter (IO), the above-footer
   collage parallaxes at layered speeds, a top scroll-progress bar.
5. **Sticky scroll-reveal parallax footer** — the footer is pinned behind the
   page and revealed as content scrolls up off it, with an internal parallax
   GIANT kinetic wordmark "POSTED.".
6. **Tactile product cards** — cursor-spotlight + 3D tilt; rainbow magnetic CTA;
   animated link underlines; cart-badge pop.

## Cut for cohesion/perf (honest)
Horizontal-scroll gallery, scroll-scrubbed PINNED timelines, intro loader,
shared-element lightbox, and View Transitions were scoped OUT this pass — each is
high-risk for LCP/jank/build and would dilute the curated set. Foundations
(Lenis, useScroll, tilt) are in place to add them next.
