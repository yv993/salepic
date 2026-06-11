"use client";

import { useRef } from "react";
import {
  motion,
  AnimatePresence,
  useMotionValue,
  useSpring,
  useReducedMotion,
} from "motion/react";
import { Loader2, Check, ShoppingBag } from "lucide-react";
import { cn } from "@/lib/utils";

export type CartButtonState = "idle" | "pending" | "done" | "soldout";

const SIZE: Record<string, string> = {
  sm: "h-9 px-3 text-sm gap-1.5",
  default: "h-10 px-4 text-sm gap-2",
  lg: "h-12 px-6 text-base gap-2",
};

/**
 * Premium, magnetic add-to-cart button with a cart-fill micro-interaction and a
 * success state. PRESENTATIONAL ONLY — the addToCart action, toast, badge
 * refresh, and sold-out/disabled logic stay in the parent (buy-box /
 * add-to-cart-button), which passes `state` + `onClick`. Magnet + sweep are
 * gated on prefers-reduced-motion.
 */
export function PremiumCartButton({
  state,
  onClick,
  label = "Add to cart",
  size = "default",
  className,
  ariaLabel,
}: {
  state: CartButtonState;
  onClick: () => void;
  label?: string;
  size?: "sm" | "default" | "lg";
  className?: string;
  ariaLabel?: string;
}) {
  const reduce = useReducedMotion();
  const ref = useRef<HTMLButtonElement>(null);
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const x = useSpring(mx, { stiffness: 250, damping: 18, mass: 0.4 });
  const y = useSpring(my, { stiffness: 250, damping: 18, mass: 0.4 });

  const disabled = state === "pending" || state === "soldout";
  const done = state === "done";

  function handleMove(e: React.PointerEvent) {
    if (reduce || disabled) return;
    const el = ref.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    mx.set(((e.clientX - (r.left + r.width / 2)) / r.width) * 16);
    my.set(((e.clientY - (r.top + r.height / 2)) / r.height) * 10);
  }
  function reset() {
    mx.set(0);
    my.set(0);
  }

  return (
    <motion.button
      ref={ref}
      type="button"
      onClick={onClick}
      onPointerMove={handleMove}
      onPointerLeave={reset}
      disabled={disabled}
      aria-label={ariaLabel ?? label}
      data-cursor="grow"
      style={reduce ? undefined : { x, y }}
      whileTap={reduce || disabled ? undefined : { scale: 0.97 }}
      className={cn(
        "group/cart relative inline-flex select-none items-center justify-center overflow-hidden rounded-xl font-medium shadow-2 ring-1 transition-colors duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:pointer-events-none",
        SIZE[size],
        state === "soldout"
          ? "cursor-not-allowed bg-muted text-muted-foreground ring-border"
          : done
            ? "bg-success text-white ring-success/40"
            : "cursor-pointer bg-primary text-primary-foreground ring-primary/30",
        className,
      )}
    >
      {/* sheen sweep on hover */}
      {!reduce && state === "idle" && (
        <span className="pointer-events-none absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/25 to-transparent transition-transform duration-700 ease-out group-hover/cart:translate-x-full" />
      )}

      <span className="relative inline-flex items-center gap-2">
        <AnimatePresence mode="popLayout" initial={false}>
          {state === "soldout" ? (
            <motion.span key="so" className="inline-flex items-center gap-2">
              Sold out
            </motion.span>
          ) : state === "pending" ? (
            <motion.span
              key="pending"
              initial={reduce ? false : { opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={reduce ? undefined : { opacity: 0, y: -6 }}
              className="inline-flex items-center gap-2"
            >
              <Loader2 className="size-4 animate-spin" />
              Adding…
            </motion.span>
          ) : done ? (
            <motion.span
              key="done"
              initial={reduce ? false : { opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              className="inline-flex items-center gap-2"
            >
              <motion.span
                initial={reduce ? false : { scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 400, damping: 14 }}
                className="inline-flex"
              >
                <Check className="size-4" />
              </motion.span>
              Added
            </motion.span>
          ) : (
            <motion.span
              key="idle"
              initial={reduce ? false : { opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={reduce ? undefined : { opacity: 0, y: -6 }}
              className="inline-flex items-center gap-2"
            >
              <motion.span
                className="inline-flex"
                animate={reduce ? undefined : {}}
                whileHover={reduce ? undefined : { rotate: [0, -12, 8, 0], y: [0, -2, 0] }}
                transition={{ duration: 0.5 }}
              >
                <ShoppingBag className="size-4" />
              </motion.span>
              {label}
            </motion.span>
          )}
        </AnimatePresence>
      </span>
    </motion.button>
  );
}
