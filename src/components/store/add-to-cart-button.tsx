"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { addToCart } from "@/features/cart/actions";
import { PremiumCartButton, type CartButtonState } from "./premium-cart-button";

type Props = {
  productId: string;
  title: string;
  qty?: number;
  soldOut?: boolean;
  className?: string;
  size?: "sm" | "default" | "lg";
  label?: string;
};

export function AddToCartButton({
  productId,
  title,
  qty = 1,
  soldOut = false,
  className,
  size = "default",
  label = "Add to cart",
}: Props) {
  const [pending, startTransition] = useTransition();
  const [done, setDone] = useState(false);
  const router = useRouter();

  function onClick() {
    if (soldOut) return;
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

  const state: CartButtonState = soldOut
    ? "soldout"
    : pending
      ? "pending"
      : done
        ? "done"
        : "idle";

  return (
    <PremiumCartButton
      state={state}
      onClick={onClick}
      label={label}
      size={size}
      className={className}
      ariaLabel={`Add ${title} to cart`}
    />
  );
}
