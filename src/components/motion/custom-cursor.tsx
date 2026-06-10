"use client";

import { useEffect, useState } from "react";
import { motion, useMotionValue, useSpring } from "motion/react";

/**
 * Bespoke cursor: a steel ring + rusted-red dot that spring-follows the pointer
 * and GROWS over interactive elements. Hidden on touch devices and under
 * reduced-motion (native cursor restored). pointer-events-none, so it never
 * blocks clicks. Mounted only when it should be active (no SSR cursor).
 */
export function CustomCursor() {
  const [active, setActive] = useState(false);
  const [hovering, setHovering] = useState(false);
  const x = useMotionValue(-100);
  const y = useMotionValue(-100);
  const rx = useSpring(x, { stiffness: 380, damping: 30, mass: 0.4 });
  const ry = useSpring(y, { stiffness: 380, damping: 30, mass: 0.4 });

  useEffect(() => {
    const fine = window.matchMedia("(pointer: fine)").matches;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (!fine || reduce) return;
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setActive(true);
    document.documentElement.classList.add("has-custom-cursor");

    const move = (e: PointerEvent) => {
      x.set(e.clientX);
      y.set(e.clientY);
      const t = e.target as Element | null;
      setHovering(
        !!t?.closest?.(
          'a, button, [role="button"], input, select, textarea, [data-cursor="grow"]',
        ),
      );
    };
    window.addEventListener("pointermove", move, { passive: true });
    return () => {
      window.removeEventListener("pointermove", move);
      document.documentElement.classList.remove("has-custom-cursor");
    };
  }, [x, y]);

  if (!active) return null;

  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 z-[100]">
      {/* ring */}
      <motion.div
        style={{ x: rx, y: ry }}
        className="absolute -ml-4 -mt-4 size-8 rounded-full border border-[#7d96a3] mix-blend-difference"
        animate={{ scale: hovering ? 1.9 : 1, opacity: hovering ? 0.9 : 0.6 }}
        transition={{ type: "spring", stiffness: 260, damping: 20 }}
      />
      {/* dot */}
      <motion.div
        style={{ x, y }}
        className="absolute -ml-[3px] -mt-[3px] size-1.5 rounded-full bg-[#c1432e]"
        animate={{ scale: hovering ? 0.5 : 1 }}
        transition={{ type: "spring", stiffness: 320, damping: 22 }}
      />
    </div>
  );
}
