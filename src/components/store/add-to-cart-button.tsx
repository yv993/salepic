"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Loader2, Check, ShoppingBag } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { addToCart } from "@/features/cart/actions";

type Props = {
  productId: string;
  title: string;
  qty?: number;
  soldOut?: boolean;
  className?: string;
  size?: "sm" | "default" | "lg";
  variant?: "default" | "secondary" | "outline";
  label?: string;
};

export function AddToCartButton({
  productId,
  title,
  qty = 1,
  soldOut = false,
  className,
  size = "default",
  variant = "default",
  label = "Add to cart",
}: Props) {
  const [pending, startTransition] = useTransition();
  const [done, setDone] = useState(false);
  const router = useRouter();

  function onClick() {
    startTransition(async () => {
      const res = await addToCart(productId, qty);
      if (!res.ok) {
        toast.error(res.error ?? "Couldn't add to cart.");
        return;
      }
      toast.success(`Added “${title}” to your cart.`, {
        action: { label: "View cart", onClick: () => router.push("/cart") },
      });
      setDone(true);
      setTimeout(() => setDone(false), 1600);
      // Refresh so the server-rendered <CartBadge> reflects the new count.
      router.refresh();
    });
  }

  return (
    <Button
      type="button"
      onClick={onClick}
      disabled={pending || soldOut}
      size={size}
      variant={variant}
      className={className}
    >
      {soldOut ? (
        "Sold out"
      ) : pending ? (
        <>
          <Loader2 className="size-4 animate-spin" />
          Adding…
        </>
      ) : done ? (
        <>
          <Check className="size-4" />
          Added
        </>
      ) : (
        <>
          <ShoppingBag className="size-4" />
          {label}
        </>
      )}
    </Button>
  );
}
