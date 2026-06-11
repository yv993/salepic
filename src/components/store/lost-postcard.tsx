"use client";

import { motion, useReducedMotion } from "motion/react";

/**
 * 404 motion graphic: a little postcard drifting along a dashed airmail path
 * that draws itself in. Reduced-motion → a static postcard. Transform/opacity
 * (+ a one-shot SVG stroke) only.
 */
export function LostPostcard() {
  const reduce = useReducedMotion();

  return (
    <div className="relative mx-auto mb-2 h-28 w-56" aria-hidden>
      {/* dashed flight path */}
      <svg viewBox="0 0 224 112" className="absolute inset-0 h-full w-full">
        <motion.path
          d="M8 96 C 60 96, 70 24, 116 40 S 180 96, 216 28"
          fill="none"
          stroke="var(--color-clay)"
          strokeWidth="2"
          strokeDasharray="3 7"
          strokeLinecap="round"
          opacity="0.5"
          initial={reduce ? { pathLength: 1 } : { pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 1.4, ease: "easeInOut" }}
        />
      </svg>

      {/* drifting postcard */}
      <motion.div
        className="surface absolute left-1/2 top-1/2 grid w-24 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-lg p-1.5 shadow-3"
        style={{ rotate: -8 }}
        animate={reduce ? undefined : { y: [0, -8, 0], rotate: [-8, -4, -8] }}
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
      >
        <div className="relative aspect-[1.41/1] w-full overflow-hidden rounded bg-gradient-to-br from-primary/25 via-muted to-secondary">
          <span className="absolute right-1 top-1 size-3 rounded-[2px] bg-primary/40 ring-1 ring-primary/40" />
          <span className="absolute bottom-1.5 left-1.5 h-0.5 w-8 rounded bg-foreground/20" />
          <span className="absolute bottom-3 left-1.5 h-0.5 w-10 rounded bg-foreground/20" />
        </div>
      </motion.div>
    </div>
  );
}
