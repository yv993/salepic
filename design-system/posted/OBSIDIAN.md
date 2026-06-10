# Posted — "Obsidian Atelier" (dark-first re-skin)

Premium **dark-luxury** re-skin in the spirit of top dark Dribbble work
(synthesized via ui-ux-pro-max: *Luxury e-commerce → deep black + gold accent*;
*Bold-minimalism → single vibrant accent, oversized type*; *Dark-mode → OLED
near-black, minimal glow*). Darker than the prior `#232323` scheme; a single
burnished-gold accent replaces the rusted red as primary. Dark is the identity;
the light/paper theme stays available via the toggle.

## References drawn from (directions)
- Dark luxury e-commerce — obsidian canvas + warm gold CTA, generous negative space.
- Dark editorial — oversized serif display, hairline rules, restrained palette.
- OLED/midnight UI — true near-black surfaces, soft single-color glow, high text contrast.

## Palette (dark) — AA verified
| Role | Hex | Contrast |
|---|---|---|
| Canvas (bg) | `#0b0b0d` | — |
| Elevated surface (card/popover/sidebar) | `#161518` | reads as elevation on bg |
| Foreground | `#ece8e1` | 14.9:1 on card |
| Muted text | `#a39c93` | 6.7:1 |
| **Primary — burnished gold** | `#d9a441` | 8.1:1 on card (usable as accent TEXT too) |
| Primary-foreground (on gold) | `#161310` | 8.2:1 |
| Secondary — terracotta clay | `#c1543a` | 4.0:1 (fills/large/large-text) |
| Tertiary — slate steel | `#5d6f74` | 3.5:1 (borders/icons/large) |
| Destructive | `#ef6a4f` | 5.9:1 (distinct from accents) |
| Border / input | `rgba(236,232,225,.10 / .14)` | hairline |

## Type
Playfair Display (oversized kinetic display, fluid `clamp`, tracking `-0.02em`)
+ Inter grotesk body. Tokens `--text-fluid-display/h1/h2` unchanged.

## Surfaces / depth
True-black canvas; warm-tinted `#161518` panels read as elevation. `.surface`
glass, `.grain` overlay, multi-layer black shadows `--shadow-1..4`. Body glow +
hero/spotlight mesh retuned to **gold → clay → steel** on obsidian.

## Motion (unchanged language, retuned colour)
Enter ease `[0.22,1,0.36,1]` ~0.55s; spring `{stiffness 220–380, damping 16–30}`.
ALL motion gated on `prefers-reduced-motion`.

## Preserved effects (re-themed, none removed)
Lenis smooth scroll · bespoke cursor (steel ring + **gold** dot) · mouse-reactive
WebGL shader (clay/**gold**/steel filaments) · scroll-reveal + parallax collage ·
scroll-progress bar · sticky reveal parallax footer (**gold** wordmark on obsidian)
· ProgressiveBlur · marquees · NumberTicker · card spotlight + 3D tilt · rainbow
CTA (kept as the one multi-hue moment) · kinetic gold-shimmer headings · Base UI
tab "bento" teaser.
