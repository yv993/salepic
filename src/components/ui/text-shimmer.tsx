"use client";

import { useReducedMotion } from "motion/react";
import { cn } from "@/lib/utils";

/**
 * Heading text with a slow warm gold shimmer sweep (background-clip text).
 * Reduced-motion → plain foreground text (no animation). Decorative only; the
 * text content is always present + readable.
 */
export function TextShimmer({
  children,
  as: Tag = "span",
  className,
}: {
  children: React.ReactNode;
  as?: "span" | "h1" | "h2" | "h3";
  className?: string;
}) {
  const reduce = useReducedMotion();
  return (
    <Tag className={cn(reduce ? undefined : "text-shimmer", className)}>
      {children}
    </Tag>
  );
}
