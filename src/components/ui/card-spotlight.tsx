"use client";

import { useRef } from "react";
import {
  motion,
  useMotionValue,
  useSpring,
  useMotionTemplate,
  useReducedMotion,
} from "motion/react";
import { cn } from "@/lib/utils";

/**
 * Card wrapper with a cursor-following spotlight + gentle 3D tilt (Aceternity-
 * style, recolored to the warm palette). Hover-only enhancement: content is
 * fully usable without it, and reduced-motion / touch get a plain card.
 */
export function CardSpotlight({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  const reduce = useReducedMotion();
  const ref = useRef<HTMLElement>(null);
  const mx = useMotionValue(50);
  const my = useMotionValue(50);
  const rx = useSpring(useMotionValue(0), { stiffness: 150, damping: 16 });
  const ry = useSpring(useMotionValue(0), { stiffness: 150, damping: 16 });

  const spotlight = useMotionTemplate`radial-gradient(240px circle at ${mx}% ${my}%, color-mix(in oklab, var(--color-clay) 22%, transparent), transparent 62%)`;

  function onMove(e: React.MouseEvent<HTMLElement>) {
    if (reduce || !ref.current) return;
    const r = ref.current.getBoundingClientRect();
    const px = (e.clientX - r.left) / r.width;
    const py = (e.clientY - r.top) / r.height;
    mx.set(px * 100);
    my.set(py * 100);
    ry.set((px - 0.5) * 7);
    rx.set((0.5 - py) * 7);
  }
  function reset() {
    rx.set(0);
    ry.set(0);
  }

  if (reduce) {
    return <article className={className}>{children}</article>;
  }

  return (
    <motion.article
      ref={ref}
      onMouseMove={onMove}
      onMouseLeave={reset}
      style={{ rotateX: rx, rotateY: ry, transformPerspective: 900 }}
      className={cn("relative", className)}
    >
      {children}
      <motion.span
        aria-hidden
        style={{ background: spotlight }}
        className="pointer-events-none absolute inset-0 z-10 rounded-[inherit] opacity-0 transition-opacity duration-300 group-hover/card:opacity-100"
      />
    </motion.article>
  );
}
