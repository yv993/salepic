"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Heart } from "lucide-react";
import { readWishlist, onWishlistChange } from "@/lib/wishlist";

/** Nav wishlist indicator — reads the cookie client-side; live count bubble. */
export function WishlistBadge() {
  const [count, setCount] = useState(0);

  useEffect(() => {
    const sync = () => setCount(readWishlist().length);
    sync();
    return onWishlistChange(sync);
  }, []);

  return (
    <Link
      href="/wishlist"
      aria-label={`Wishlist (${count} saved)`}
      className="relative grid size-9 place-items-center rounded-lg text-foreground/80 transition-colors hover:bg-muted hover:text-foreground"
    >
      <Heart className={count > 0 ? "size-5 fill-primary text-primary" : "size-5"} />
      {count > 0 && (
        <span className="absolute -top-0.5 -right-0.5 grid min-w-4 place-items-center rounded-full bg-primary px-1 text-[10px] font-bold text-primary-foreground">
          {count}
        </span>
      )}
    </Link>
  );
}
