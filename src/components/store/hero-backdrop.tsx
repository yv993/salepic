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
 * Backmost hero layer: the recolored WebGL shader behind a readability scrim
 * (radial darken + bottom-to-top gradient + edge blur) so the headline/CTAs
 * keep WCAG AA contrast. DARK MODE ONLY — in light the hero falls back to its
 * existing glow/grid (this renders nothing, so three.js never loads in light).
 * pointer-events-none throughout, so it never blocks clicks.
 */
export function HeroBackdrop() {
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMounted(true);
  }, []);

  if (!mounted || resolvedTheme !== "dark") return null;

  return (
    <div
      aria-hidden
      className="pointer-events-none absolute inset-0 -z-20 overflow-hidden"
    >
      <WebGLShader />

      {/* Readability scrim — keeps hero text AA over the animated canvas. */}
      <div className="absolute inset-0 bg-[radial-gradient(75%_60%_at_30%_42%,rgba(12,10,6,0.30),rgba(12,10,6,0.72))]" />
      <div className="absolute inset-0 bg-gradient-to-t from-[#0c0a06] via-[#0c0a06]/45 to-[#0c0a06]/25" />
      {/* soft bottom edge so it blends into the page below */}
      <ProgressiveBlur
        direction="bottom"
        blurIntensity={0.4}
        className="absolute inset-x-0 bottom-0 h-28"
      />
    </div>
  );
}
