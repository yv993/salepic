import Link from "next/link";
import { ShoppingBag } from "lucide-react";
import { getCartCount } from "@/features/cart/cart";
import { CartCountBubble } from "./cart-count-bubble";

/**
 * Dynamic cart indicator. Reads the cookie (a runtime API), so it MUST be
 * rendered inside a <Suspense> boundary — never in the cached layout body.
 */
export async function CartBadge() {
  const count = await getCartCount();
  return (
    <Link
      href="/cart"
      aria-label={`Cart (${count} ${count === 1 ? "item" : "items"})`}
      className="relative grid size-9 place-items-center rounded-lg text-foreground/80 transition-colors hover:bg-muted hover:text-foreground"
    >
      <ShoppingBag className="size-5" />
      <CartCountBubble count={count} />
    </Link>
  );
}

/** Static fallback shown in the prerendered shell while the count streams in. */
export function CartBadgeFallback() {
  return (
    <span
      aria-hidden
      className="relative grid size-9 place-items-center rounded-lg text-foreground/80"
    >
      <ShoppingBag className="size-5" />
    </span>
  );
}
