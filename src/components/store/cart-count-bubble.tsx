"use client";

/**
 * The cart count bubble. Keyed by `count` so it remounts and replays the `pop`
 * keyframe whenever the count changes (e.g. after add-to-cart → router.refresh).
 * Reduced-motion users get no pop (CSS zeroes the animation duration).
 */
export function CartCountBubble({ count }: { count: number }) {
  if (count <= 0) return null;
  return (
    <span
      key={count}
      className="animate-pop absolute -top-1 -right-1 grid min-w-4.5 place-items-center rounded-full bg-primary px-1 text-[10px] font-semibold leading-4.5 text-primary-foreground shadow-1 ring-2 ring-background tabular-nums"
    >
      {count > 99 ? "99+" : count}
    </span>
  );
}
