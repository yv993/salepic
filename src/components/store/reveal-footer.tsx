"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform, useReducedMotion } from "motion/react";

/**
 * Sticky scroll-reveal parallax footer. The footer is pinned to the bottom
 * (CSS `sticky bottom-0`, z-0) BEHIND the page content (which carries an opaque
 * background at z-10), so it's revealed as the content scrolls up off it. A
 * GIANT kinetic wordmark parallaxes inside as it appears. Reduced-motion → no
 * parallax (the gentle CSS reveal remains; it isn't nausea-inducing).
 *
 * Wraps the existing <StoreFooter/> (passed as children) — it stays a server
 * component; this only adds the pinned shell + wordmark.
 */
export function RevealFooter({ children }: { children: React.ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end end"],
  });
  const wordY = useTransform(scrollYProgress, [0, 1], ["38%", "-6%"]);
  const wordOpacity = useTransform(scrollYProgress, [0.1, 0.7], [0, 1]);

  return (
    <div
      ref={ref}
      className="sticky bottom-0 z-0 overflow-hidden bg-[#1a1410] text-[#f3e9d8]"
    >
      <div className="relative">
        {/* giant kinetic wordmark, behind the columns */}
        <motion.span
          aria-hidden
          style={reduce ? { opacity: 0.06 } : { y: wordY, opacity: wordOpacity }}
          className="pointer-events-none absolute inset-x-0 bottom-[-1.5vw] select-none text-center font-heading text-[24vw] leading-none font-bold tracking-tight text-[#ce9e62]/[0.10]"
        >
          Posted.
        </motion.span>
        <div className="relative z-10">{children}</div>
      </div>
    </div>
  );
}
