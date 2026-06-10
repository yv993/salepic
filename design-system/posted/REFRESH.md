# Posted — Visual Refresh Spec (extends MASTER.md)

Skill-derived (ui-ux-pro-max): styles **Layered-Depth + Skeuomorphic/Realistic + Parallax-Storytelling**
for premium products → multi-layer shadows, richer gradients, grain/texture, tactile press,
parallax `translateY(scroll)`, IntersectionObserver scroll-reveal, transform/opacity only,
lazy 3D, everything gated on `prefers-reduced-motion`.

## Gap analysis (per page)
- **Home** — hero reads flat against the shader; sections appear all-at-once (no reveal); featured
  cards lack depth/tactility. → parallax hero layers, scroll-stagger reveals, deeper cards, magnetic CTA.
- **Gallery** — cards flat, weak hover affordance, plain skeletons. → framed/perforated card with
  hover tilt+zoom+grain, stamp accent, richer skeleton shimmer, reveal on scroll.
- **Detail** — solid; gallery thumbs + buy box fine. → add image grain/frame, reveal, sticky-feel buy box.
- **Cart/Checkout** — functional; summary could read as a "receipt". → elevation + rhythm + reveal.
- **Order** — good; add a celebratory reveal + clearer "stamped" status chip.
- **About/404** — fine; align type scale + reveal.
- **Admin** — utilitarian; deepen table rows, stat cards elevation, consistent focus.
- **Global** — type not fluid; single shadow; gradients 3-stop; no scroll motion; links no underline anim.

## Palette refresh — "Sealing Wax & Sun" (keeps warm postage soul, AA-safe)
Light: paper `#faf5ec`, ink `#281f15`, **clay/sealing-wax** primary `#ad4429`, **marigold gold** accent
`#d98a2b`, **sage** `#6f7d5e`, rose-whisper grain. Dark: ink-paper `#1a1410`, parchment text `#f3e9d8`,
warm-clay primary `#dd7a55`, gold `#e0972e`. Richer 6–10 stop gradients for hero/text/CTA.
Elevation scale `--shadow-1..4` (warm, multi-layer). All token-driven — no one-off colors.

## Type scale (fluid, clamp)
- display `clamp(2.5rem, 6vw, 4.5rem)` · h1 `clamp(2rem,4vw,3.25rem)` · h2 `clamp(1.6rem,3vw,2.5rem)`
- body 1rem/1.65, measure max-w-prose (65–75ch). Playfair display italic for accents; Inter body.

## Motion language (motion lib, gated)
- Hero **parallax**: grid/spotlight + postcard stack move at different scroll speeds (`useScroll`/`useTransform`).
- **Scroll-reveal**: each home section fades/slides up, `whileInView once`, ~80ms stagger.
- **Micro**: magnetic primary CTA, animated link underline, cart-badge pop on add, tactile press,
  smooth accordion height. Durations 180–300ms (UI) / 300–500ms (decor). reduced-motion → no transform.
- three.js hero accent **lazy-loaded** (`next/dynamic`, no SSR) + static frame under reduced-motion.
