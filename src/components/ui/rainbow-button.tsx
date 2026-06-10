"use client";

import * as React from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";

/**
 * Animated neon rainbow-border button (Magic UI), converted from styled-jsx to
 * the `.rainbow-btn` utility + `@keyframes rainbow` in globals.css. The neon
 * gradient is kept as-is (the one intentional bold accent). Animation
 * slows/stops under prefers-reduced-motion via the global CSS rule.
 *
 * Reserved for primary CTAs only. Renders a <Link> when `href` is set, else a
 * <button>. Visible focus ring; accepts children + onClick + type.
 */
type RainbowButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  children: React.ReactNode;
  /** When set, renders a Next <Link> instead of a <button>. */
  href?: string;
  /** Inner fill colour; defaults to the brand primary. */
  fill?: string;
};

const base =
  "rainbow-btn group/rainbow relative inline-flex h-12 items-center justify-center gap-2 rounded-full px-7 text-sm font-semibold text-primary-foreground shadow-paper transition-[filter,transform] duration-200 outline-none hover:brightness-105 active:translate-y-px focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:pointer-events-none disabled:opacity-60 [&_svg]:size-4 [&_svg]:shrink-0";

export function RainbowButton({
  children,
  className,
  href,
  fill,
  ...props
}: RainbowButtonProps) {
  const style = fill
    ? ({ "--rainbow-fill": fill } as React.CSSProperties)
    : undefined;

  if (href) {
    return (
      <Link href={href} className={cn(base, className)} style={style}>
        {children}
      </Link>
    );
  }

  return (
    <button className={cn(base, className)} style={style} {...props}>
      {children}
    </button>
  );
}
