"use client";

import Link from "next/link";
import { Stamp } from "lucide-react";
import { motion, useReducedMotion } from "motion/react";
import { cn } from "@/lib/utils";

/**
 * Brand mark. Animated motion graphic: the stamp draws in on first mount and
 * does a playful "press" wobble on hover; the dot pops. All gated on
 * reduced-motion (then it's a plain static mark).
 */
export function Brand({
  className,
  withWordmark = true,
  href,
}: {
  className?: string;
  withWordmark?: boolean;
  href?: string;
}) {
  const reduce = useReducedMotion();

  const content = (
    <motion.span
      className={cn("group/brand inline-flex items-center gap-2.5", className)}
      initial={reduce ? false : { opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      <motion.span
        className="grid size-9 place-items-center rounded-lg bg-primary/10 text-primary ring-1 ring-primary/25 [clip-path:polygon(0_6%,6%_0,94%_0,100%_6%,100%_94%,94%_100%,6%_100%,0_94%)]"
        initial={reduce ? false : { scale: 0.6, rotate: -12, opacity: 0 }}
        animate={{ scale: 1, rotate: 0, opacity: 1 }}
        transition={{ type: "spring", stiffness: 320, damping: 16 }}
        whileHover={reduce ? undefined : { rotate: [0, -8, 6, 0], scale: 1.06 }}
      >
        <Stamp className="size-5" />
      </motion.span>
      {withWordmark && (
        <span className="font-heading text-xl font-bold tracking-tight text-foreground">
          Posted
          <motion.span
            className="inline-block text-primary"
            initial={reduce ? false : { scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.18, type: "spring", stiffness: 500, damping: 14 }}
          >
            .
          </motion.span>
        </span>
      )}
    </motion.span>
  );

  return href ? (
    <Link href={href} className="inline-flex" aria-label="Posted. — home">
      {content}
    </Link>
  ) : (
    content
  );
}
