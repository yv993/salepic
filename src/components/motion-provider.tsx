"use client";

import { MotionConfig } from "motion/react";

/**
 * Makes every `motion` animation honour the OS "reduce motion" setting:
 * transform-based motion (slides, marquees, springs) is disabled while opacity
 * fades remain. Pairs with the CSS `prefers-reduced-motion` block in globals.css
 * and the WebGL shader's static-frame fallback.
 */
export function MotionProvider({ children }: { children: React.ReactNode }) {
  return <MotionConfig reducedMotion="user">{children}</MotionConfig>;
}
