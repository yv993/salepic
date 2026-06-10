"use client";

import { useTransition } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Minus, Plus, Trash2, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { formatPrice } from "@/lib/format";
import { setCartQty, removeFromCart } from "@/features/cart/actions";

export function CartLineItem({
  productId,
  slug,
  title,
  imageUrl,
  unitPriceCents,
  qty,
  stock,
  currency,
}: {
  productId: string;
  slug: string;
  title: string;
  imageUrl: string;
  unitPriceCents: number;
  qty: number;
  stock: number;
  currency: string;
}) {
  const [pending, startTransition] = useTransition();
  const router = useRouter();
  const max = Math.min(stock, 99);

  function change(next: number) {
    startTransition(async () => {
      await setCartQty(productId, next);
      router.refresh();
    });
  }

  function remove() {
    startTransition(async () => {
      await removeFromCart(productId);
      toast.success(`Removed “${title}” from your cart.`);
      router.refresh();
    });
  }

  return (
    <div className="flex gap-4 py-5">
      <Link
        href={`/postcards/${slug}`}
        className="relative aspect-[1.41/1] w-28 shrink-0 overflow-hidden rounded-lg bg-muted grain"
      >
        <Image
          src={imageUrl}
          alt={title}
          fill
          sizes="112px"
          className="object-cover"
        />
      </Link>

      <div className="flex min-w-0 flex-1 flex-col">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <h3 className="truncate font-heading text-base font-semibold">
              <Link href={`/postcards/${slug}`} className="hover:text-primary">
                {title}
              </Link>
            </h3>
            <p className="mt-0.5 text-sm text-muted-foreground">
              {formatPrice(unitPriceCents, currency)} each
            </p>
          </div>
          <p className="shrink-0 font-heading font-semibold text-primary">
            {formatPrice(unitPriceCents * qty, currency)}
          </p>
        </div>

        <div className="mt-auto flex items-center justify-between pt-3">
          <div className="inline-flex items-center rounded-lg border border-input bg-card">
            <button
              type="button"
              aria-label="Decrease quantity"
              disabled={pending || qty <= 1}
              onClick={() => change(qty - 1)}
              className="grid size-9 place-items-center text-foreground/70 hover:text-foreground disabled:opacity-40"
            >
              <Minus className="size-4" />
            </button>
            <span className="w-9 text-center text-sm font-semibold tabular-nums">
              {pending ? <Loader2 className="mx-auto size-4 animate-spin" /> : qty}
            </span>
            <button
              type="button"
              aria-label="Increase quantity"
              disabled={pending || qty >= max}
              onClick={() => change(qty + 1)}
              className="grid size-9 place-items-center text-foreground/70 hover:text-foreground disabled:opacity-40"
            >
              <Plus className="size-4" />
            </button>
          </div>

          <button
            type="button"
            onClick={remove}
            disabled={pending}
            className="inline-flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-destructive disabled:opacity-40"
          >
            <Trash2 className="size-4" />
            Remove
          </button>
        </div>
      </div>
    </div>
  );
}
