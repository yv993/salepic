"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Minus, Plus, ShoppingBag, Loader2, Check } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { addToCart } from "@/features/cart/actions";

export function BuyBox({
  productId,
  title,
  stock,
}: {
  productId: string;
  title: string;
  stock: number;
}) {
  const soldOut = stock <= 0;
  const max = Math.max(1, Math.min(stock, 99));
  const [qty, setQty] = useState(1);
  const [pending, startTransition] = useTransition();
  const [done, setDone] = useState(false);
  const router = useRouter();

  function add() {
    startTransition(async () => {
      const res = await addToCart(productId, qty);
      if (!res.ok) {
        toast.error(res.error ?? "Couldn't add to cart.");
        return;
      }
      toast.success(`Added ${qty} × “${title}” to your cart.`, {
        action: { label: "View cart", onClick: () => router.push("/cart") },
      });
      setDone(true);
      setTimeout(() => setDone(false), 1600);
      router.refresh();
    });
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center gap-4">
        <div className="inline-flex items-center rounded-lg border border-input bg-card">
          <button
            type="button"
            aria-label="Decrease quantity"
            disabled={soldOut || qty <= 1}
            onClick={() => setQty((q) => Math.max(1, q - 1))}
            className="grid size-10 place-items-center text-foreground/70 transition-colors hover:text-foreground disabled:opacity-40"
          >
            <Minus className="size-4" />
          </button>
          <span className="w-10 text-center text-sm font-semibold tabular-nums">
            {qty}
          </span>
          <button
            type="button"
            aria-label="Increase quantity"
            disabled={soldOut || qty >= max}
            onClick={() => setQty((q) => Math.min(max, q + 1))}
            className="grid size-10 place-items-center text-foreground/70 transition-colors hover:text-foreground disabled:opacity-40"
          >
            <Plus className="size-4" />
          </button>
        </div>
        <span
          className={cn(
            "text-sm",
            soldOut
              ? "text-destructive"
              : stock <= 5
                ? "text-warning"
                : "text-muted-foreground",
          )}
        >
          {soldOut
            ? "Sold out"
            : stock <= 5
              ? `Only ${stock} left`
              : `${stock} in stock`}
        </span>
      </div>

      <Button size="lg" disabled={soldOut || pending} onClick={add}>
        {pending ? (
          <>
            <Loader2 className="size-4 animate-spin" /> Adding…
          </>
        ) : done ? (
          <>
            <Check className="size-4" /> Added to cart
          </>
        ) : soldOut ? (
          "Sold out"
        ) : (
          <>
            <ShoppingBag className="size-4" /> Add to cart
          </>
        )}
      </Button>
    </div>
  );
}
