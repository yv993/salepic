"use client";

import { motion, useReducedMotion } from "motion/react";
import { CheckCircle2 } from "lucide-react";

// Deterministic confetti params (no Math.random in render → no hydration drift).
const COLORS = ["#d9a441", "#c1543a", "#5d6f74"];
const PARTICLES = Array.from({ length: 16 }, (_, i) => {
  const angle = (i / 16) * Math.PI * 2;
  const dist = 58 + (i % 3) * 24;
  return {
    x: Math.round(Math.cos(angle) * dist),
    y: Math.round(Math.sin(angle) * dist),
    color: COLORS[i % COLORS.length],
    rot: (i % 2 ? 1 : -1) * (90 + (i % 4) * 40),
    delay: (i % 4) * 0.03,
  };
});

/**
 * Order-confirmation "sealed & sent" moment: the success seal springs in with a
 * ring pulse and a one-shot confetti burst. Reduced-motion → a plain static
 * seal. Transform/opacity only.
 */
export function ConfirmationSuccess() {
  const reduce = useReducedMotion();

  if (reduce) {
    return (
      <span className="mx-auto grid size-14 place-items-center rounded-full bg-success/15 text-success">
        <CheckCircle2 className="size-8" />
      </span>
    );
  }

  return (
    <div className="relative mx-auto grid size-14 place-items-center">
      {/* confetti */}
      {PARTICLES.map((p, i) => (
        <motion.span
          key={i}
          aria-hidden
          className="absolute left-1/2 top-1/2 size-2 rounded-[2px]"
          style={{ backgroundColor: p.color }}
          initial={{ x: 0, y: 0, scale: 0, opacity: 1 }}
          animate={{ x: p.x, y: p.y, scale: [0, 1, 0.9], opacity: [1, 1, 0], rotate: p.rot }}
          transition={{ duration: 1.1, delay: 0.15 + p.delay, ease: "easeOut" }}
        />
      ))}
      {/* ring pulse */}
      <motion.span
        aria-hidden
        className="absolute inset-0 rounded-full ring-2 ring-success/50"
        initial={{ scale: 0.5, opacity: 0.7 }}
        animate={{ scale: 2.1, opacity: 0 }}
        transition={{ duration: 1, ease: "easeOut", delay: 0.1 }}
      />
      {/* seal */}
      <motion.span
        className="relative grid size-14 place-items-center rounded-full bg-success/15 text-success"
        initial={{ scale: 0, rotate: -20 }}
        animate={{ scale: 1, rotate: 0 }}
        transition={{ type: "spring", stiffness: 320, damping: 15 }}
      >
        <motion.span
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.25, type: "spring", stiffness: 420, damping: 14 }}
        >
          <CheckCircle2 className="size-8" />
        </motion.span>
      </motion.span>
    </div>
  );
}
