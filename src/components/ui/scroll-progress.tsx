"use client";

import { motion, useScroll, useSpring } from "motion/react";

/**
 * Thin reading-progress bar pinned to the very top of the viewport. Uses the
 * compositor-only `scaleX` transform (no layout work). The spring is harmless
 * under reduced-motion (the bar still tracks; just no easing).
 */
export function ScrollProgress() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 140,
    damping: 30,
    restDelta: 0.001,
  });

  return (
    <motion.div
      aria-hidden
      style={{ scaleX }}
      className="fixed inset-x-0 top-0 z-[60] h-0.5 origin-left bg-gradient-to-r from-primary via-amber-500 to-primary/60"
    />
  );
}
