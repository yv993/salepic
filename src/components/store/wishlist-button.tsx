"use client";

import { useEffect, useState } from "react";
import { Heart } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { readWishlist, toggleWishlist, onWishlistChange } from "@/lib/wishlist";

/**
 * Heart toggle backed by the wishlist cookie (client-side, instant). Syncs
 * across instances via the wishlist:changed event. Variant "icon" for card
 * overlays, "labelled" for the product page.
 */
export function WishlistButton({
  productId,
  title,
  variant = "icon",
  className,
}: {
  productId: string;
  title: string;
  variant?: "icon" | "labelled";
  className?: string;
}) {
  const [active, setActive] = useState(false);

  useEffect(() => {
    const sync = () => setActive(readWishlist().includes(productId));
    sync();
    return onWishlistChange(sync);
  }, [productId]);

  function onClick(e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();
    const now = toggleWishlist(productId);
    setActive(now);
    toast[now ? "success" : "message"](
      now ? `Saved “${title}” to your wishlist.` : `Removed “${title}”.`,
    );
  }

  if (variant === "labelled") {
    return (
      <button
        type="button"
        onClick={onClick}
        aria-pressed={active}
        className={cn(
          "inline-flex items-center gap-2 rounded-xl border px-4 py-2.5 text-sm font-medium transition-colors",
          active
            ? "border-primary/40 bg-primary/10 text-primary"
            : "border-border text-foreground/80 hover:border-foreground/30",
          className,
        )}
      >
        <Heart className={cn("size-4", active && "fill-current")} />
        {active ? "Saved" : "Save"}
      </button>
    );
  }

  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      aria-label={active ? `Remove ${title} from wishlist` : `Save ${title} to wishlist`}
      className={cn(
        "grid size-9 place-items-center rounded-full bg-background/80 text-foreground/80 shadow-2 ring-1 ring-border backdrop-blur transition-colors hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
        active && "text-primary",
        className,
      )}
    >
      <Heart className={cn("size-4", active && "fill-current")} />
    </button>
  );
}
