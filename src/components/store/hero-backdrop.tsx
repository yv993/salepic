"use client";

import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { useTheme } from "next-themes";
import { ProgressiveBlur } from "@/components/ui/progressive-blur";

// three.js is lazy-loaded (no SSR) so it stays out of the initial hero bundle
// and the hero still prerenders.
const WebGLShader = dynamic(
  () => import("@/components/ui/webgl-shader").then((m) => m.WebGLShader),
  { ssr: false },
);

/**
 * Backmost hero layer: the recolored WebGL shader behind a readability scrim.
 * Renders in BOTH themes — dark = glowing filaments on obsidian; light = warm
 * ink filaments on cream (lower intensity, paper-tuned scrim) so the headline
 * keeps WCAG AA contrast either way. Lazy-loaded, reduced-motion gated inside
 * the shader, pointer-events-none throughout. The shader remounts on theme
 * change (key) to recolour cleanly.
 */
export function HeroBackdrop() {
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMounted(true);
  }, []);

  // Avoid SSR/first-paint mismatch: render nothing until the theme is known.
  if (!mounted) return null;
  const light = resolvedTheme === "light";

  return (
    <div
      aria-hidden
      className="pointer-events-none absolute inset-0 -z-20 overflow-hidden"
    >
      <WebGLShader key={resolvedTheme} light={light} />

      {/* Readability scrim — keeps hero text AA over the animated canvas. */}
      {light ? (
        <>
          <div className="absolute inset-0 bg-[radial-gradient(75%_60%_at_30%_42%,rgba(244,238,225,0.20),rgba(244,238,225,0.66))]" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#f4eee1] via-[#f4eee1]/40 to-[#f4eee1]/20" />
        </>
      ) : (
        <>
          <div className="absolute inset-0 bg-[radial-gradient(75%_60%_at_30%_42%,rgba(12,10,6,0.30),rgba(12,10,6,0.72))]" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0b0b0d] via-[#0b0b0d]/45 to-[#0b0b0d]/25" />
        </>
      )}
      {/* soft bottom edge so it blends into the page below */}
      <ProgressiveBlur
        direction="bottom"
        blurIntensity={0.4}
        className="absolute inset-x-0 bottom-0 h-28"
      />
    </div>
  );
}
