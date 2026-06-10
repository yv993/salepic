"use client";

import { useEffect, useRef } from "react";
import { useInView, useReducedMotion, animate } from "motion/react";

function format(
  n: number,
  kind: "price" | "int",
  currency: string,
  prefix: string,
) {
  const body =
    kind === "price"
      ? new Intl.NumberFormat("en-US", { style: "currency", currency }).format(
          n / 100,
        )
      : Math.round(n).toLocaleString("en-US");
  return prefix + body;
}

/**
 * Counts up to `value` when scrolled into view. Props are primitives only
 * (serializable) so it drops into Server Components. SSR renders the REAL value
 * (no-JS / crawler safe); the count-up is a progressive enhancement done
 * imperatively via textContent (no React state). Reduced-motion → no animation.
 */
export function NumberTicker({
  value,
  kind = "int",
  currency = "USD",
  prefix = "",
  className,
  duration = 1.1,
}: {
  value: number;
  kind?: "price" | "int";
  currency?: string;
  prefix?: string;
  className?: string;
  duration?: number;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "0px 0px -10% 0px" });
  const reduce = useReducedMotion();

  useEffect(() => {
    if (!inView || reduce) return;
    const node = ref.current;
    if (!node) return;
    const controls = animate(0, value, {
      duration,
      ease: [0.22, 1, 0.36, 1],
      onUpdate: (v) => {
        node.textContent = format(v, kind, currency, prefix);
      },
    });
    return () => controls.stop();
  }, [inView, value, reduce, duration, kind, currency, prefix]);

  return (
    <span ref={ref} className={className}>
      {format(value, kind, currency, prefix)}
    </span>
  );
}
