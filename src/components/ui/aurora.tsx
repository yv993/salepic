"use client";

import { useReducedMotion } from "motion/react";
import { cn } from "@/lib/utils";

/**
 * Warm aurora glow — drifting clay/amber/gold blobs behind a section. Pure CSS
 * transform animation (compositor-only), pointer-events-none. Reduced-motion →
 * static glow (no drift). Recolored to the brand palette (no neon).
 */
export function Aurora({ className }: { className?: string }) {
  const reduce = useReducedMotion();
  const anim = reduce ? "" : "[animation:aurora-drift_14s_ease-in-out_infinite]";
  const anim2 = reduce ? "" : "[animation:aurora-drift_18s_ease-in-out_infinite_reverse]";

  return (
    <div
      aria-hidden
      className={cn(
        "pointer-events-none absolute inset-0 -z-10 overflow-hidden",
        className,
      )}
    >
      <div
        className={cn(
          "absolute -left-1/4 top-0 h-[28rem] w-[28rem] rounded-full opacity-50 blur-3xl",
          "bg-[radial-gradient(circle,color-mix(in_oklab,var(--color-clay)_55%,transparent),transparent_70%)]",
          anim,
        )}
      />
      <div
        className={cn(
          "absolute -right-1/4 top-1/4 h-[26rem] w-[26rem] rounded-full opacity-45 blur-3xl",
          "bg-[radial-gradient(circle,color-mix(in_oklab,var(--color-gold)_55%,transparent),transparent_70%)]",
          anim2,
        )}
      />
      <div
        className={cn(
          "absolute bottom-0 left-1/3 h-[22rem] w-[22rem] rounded-full opacity-40 blur-3xl",
          "bg-[radial-gradient(circle,color-mix(in_oklab,var(--color-rose)_50%,transparent),transparent_70%)]",
          anim,
        )}
      />
    </div>
  );
}
