"use client";

import { useEffect, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Heart, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { readWishlist } from "@/lib/wishlist";
import { mergeWishlist } from "@/features/account/actions";

/** Offers to merge this device's cookie wishlist into the signed-in account. */
export function WishlistMergeBar() {
  const [count, setCount] = useState(0);
  const [pending, start] = useTransition();
  const router = useRouter();

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setCount(readWishlist().length);
  }, []);

  if (count === 0) return null;

  function merge() {
    start(async () => {
      const res = await mergeWishlist(readWishlist());
      if (res.ok) {
        toast.success(
          res.merged > 0
            ? `Saved ${res.merged} item${res.merged === 1 ? "" : "s"} to your account.`
            : "Your account wishlist is already up to date.",
        );
        router.refresh();
      } else {
        toast.error("Couldn't merge your wishlist.");
      }
    });
  }

  return (
    <div className="surface mb-6 flex flex-wrap items-center justify-between gap-3 rounded-2xl p-4">
      <p className="flex items-center gap-2 text-sm text-muted-foreground">
        <Heart className="size-4 text-primary" />
        You have {count} item{count === 1 ? "" : "s"} saved on this device.
      </p>
      <Button size="sm" onClick={merge} disabled={pending}>
        {pending && <Loader2 className="size-4 animate-spin" />}
        Save to my account
      </Button>
    </div>
  );
}
