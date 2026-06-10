import { Suspense } from "react";
import type { Metadata } from "next";
import Link from "next/link";
import { ShoppingBag, ArrowRight, Truck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { NumberTicker } from "@/components/ui/number-ticker";
import { formatPrice } from "@/lib/format";
import { getCart } from "@/features/cart/cart";
import {
  computeShippingCents,
  FREE_SHIPPING_THRESHOLD_CENTS,
} from "@/features/checkout/constants";
import { CartLineItem } from "@/components/store/cart-line-item";

export const metadata: Metadata = { title: "Your cart" };

export default function CartPage() {
  return (
    <div className="mx-auto max-w-5xl px-4 py-12 sm:px-6">
      <h1 className="font-heading text-3xl font-bold tracking-tight sm:text-4xl">
        Your cart
      </h1>
      {/* Cart reads the cookie (runtime data) → must stream inside <Suspense>. */}
      <Suspense fallback={<CartSkeleton />}>
        <CartContents />
      </Suspense>
    </div>
  );
}

async function CartContents() {
  const cart = await getCart();

  if (cart.lines.length === 0) {
    return (
      <div className="surface mt-8 flex flex-col items-center gap-4 rounded-2xl px-6 py-20 text-center">
        <span className="grid size-14 place-items-center rounded-full bg-muted text-muted-foreground">
          <ShoppingBag className="size-7" />
        </span>
        <div>
          <p className="font-heading text-xl font-semibold">Your cart is empty</p>
          <p className="mt-1 text-sm text-muted-foreground">
            Find a little something worth sending.
          </p>
        </div>
        <Button render={<Link href="/postcards" />}>
          Browse postcards
          <ArrowRight className="size-4" />
        </Button>
      </div>
    );
  }

  const shippingCents = computeShippingCents(cart.subtotalCents);
  const totalCents = cart.subtotalCents + shippingCents;
  const toFree = FREE_SHIPPING_THRESHOLD_CENTS - cart.subtotalCents;

  return (
    <div className="mt-8 grid gap-8 lg:grid-cols-[1.6fr_1fr]">
      <div className="surface divide-y divide-border/70 rounded-2xl px-5">
        {cart.lines.map((line) => (
          <CartLineItem
            key={line.product.id}
            productId={line.product.id}
            slug={line.product.slug}
            title={line.product.title}
            imageUrl={line.product.imageUrl}
            unitPriceCents={line.product.priceCents}
            qty={line.qty}
            stock={line.product.stock}
            currency={line.product.currency}
          />
        ))}
      </div>

      <aside className="h-fit lg:sticky lg:top-24">
        <div className="surface rounded-2xl p-6">
          <h2 className="font-heading text-lg font-semibold">Summary</h2>
          <dl className="mt-4 space-y-2.5 text-sm">
            <Row label={`Subtotal (${cart.count} ${cart.count === 1 ? "item" : "items"})`}>
              {formatPrice(cart.subtotalCents, cart.currency)}
            </Row>
            <Row label="Shipping">
              {shippingCents === 0 ? (
                <span className="text-success">Free</span>
              ) : (
                formatPrice(shippingCents, cart.currency)
              )}
            </Row>
            <div className="my-2 h-px bg-border" />
            <Row label="Total" strong>
              <NumberTicker value={totalCents} kind="price" currency={cart.currency} />
            </Row>
          </dl>

          {toFree > 0 && (
            <p className="mt-4 flex items-center gap-2 rounded-lg bg-muted/60 px-3 py-2 text-xs text-muted-foreground">
              <Truck className="size-4 shrink-0 text-primary" />
              Add {formatPrice(toFree, cart.currency)} more for free shipping.
            </p>
          )}

          <Button size="lg" className="mt-5 w-full" render={<Link href="/checkout" />}>
            Checkout
            <ArrowRight className="size-4" />
          </Button>
          <Link
            href="/postcards"
            className="mt-3 block text-center text-sm text-muted-foreground hover:text-foreground"
          >
            Continue shopping
          </Link>
        </div>
      </aside>
    </div>
  );
}

function Row({
  label,
  children,
  strong,
}: {
  label: string;
  children: React.ReactNode;
  strong?: boolean;
}) {
  return (
    <div className="flex items-center justify-between">
      <dt className={strong ? "font-heading text-base font-semibold" : "text-muted-foreground"}>
        {label}
      </dt>
      <dd className={strong ? "font-heading text-base font-semibold text-primary" : "font-medium"}>
        {children}
      </dd>
    </div>
  );
}

function CartSkeleton() {
  return (
    <div className="mt-8 grid gap-8 lg:grid-cols-[1.6fr_1fr]">
      <div className="surface space-y-5 rounded-2xl p-5">
        {Array.from({ length: 2 }).map((_, i) => (
          <div key={i} className="flex gap-4">
            <Skeleton className="aspect-[1.41/1] w-28 rounded-lg" />
            <div className="flex-1 space-y-3 py-1">
              <Skeleton className="h-5 w-40" />
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-9 w-32" />
            </div>
          </div>
        ))}
      </div>
      <Skeleton className="h-64 rounded-2xl" />
    </div>
  );
}
