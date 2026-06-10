import { Suspense } from "react";
import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { redirect } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { NumberTicker } from "@/components/ui/number-ticker";
import { formatPrice } from "@/lib/format";
import { getCart } from "@/features/cart/cart";
import { computeShippingCents } from "@/features/checkout/constants";
import { CheckoutForm } from "@/components/store/checkout-form";

export const metadata: Metadata = { title: "Checkout" };

export default function CheckoutPage() {
  return (
    <div className="mx-auto max-w-5xl px-4 py-12 sm:px-6">
      <Link
        href="/cart"
        className="inline-flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground"
      >
        <ArrowLeft className="size-4" />
        Back to cart
      </Link>
      <h1 className="mt-4 font-heading text-3xl font-bold tracking-tight sm:text-4xl">
        Checkout
      </h1>

      <Suspense fallback={<CheckoutSkeleton />}>
        <CheckoutContents />
      </Suspense>
    </div>
  );
}

async function CheckoutContents() {
  const cart = await getCart();
  if (cart.lines.length === 0) redirect("/cart");

  const shippingCents = computeShippingCents(cart.subtotalCents);
  const totalCents = cart.subtotalCents + shippingCents;

  return (
    <div className="mt-8 grid gap-10 lg:grid-cols-[1.4fr_1fr]">
      <div className="order-2 lg:order-1">
        <CheckoutForm />
      </div>

      <aside className="order-1 h-fit lg:order-2 lg:sticky lg:top-24">
        <div className="surface rounded-2xl p-6">
          <h2 className="font-heading text-lg font-semibold">Order summary</h2>

          <ul className="mt-4 divide-y divide-border/70">
            {cart.lines.map((line) => (
              <li key={line.product.id} className="flex items-center gap-3 py-3">
                <div className="relative aspect-[1.41/1] w-16 shrink-0 overflow-hidden rounded-md bg-muted">
                  <Image
                    src={line.product.imageUrl}
                    alt={line.product.title}
                    fill
                    sizes="64px"
                    className="object-cover"
                  />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium">
                    {line.product.title}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Qty {line.qty}
                  </p>
                </div>
                <p className="shrink-0 text-sm font-medium">
                  {formatPrice(line.lineTotalCents, cart.currency)}
                </p>
              </li>
            ))}
          </ul>

          <dl className="mt-4 space-y-2.5 border-t border-border/70 pt-4 text-sm">
            <div className="flex justify-between">
              <dt className="text-muted-foreground">Subtotal</dt>
              <dd className="font-medium">
                {formatPrice(cart.subtotalCents, cart.currency)}
              </dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-muted-foreground">Shipping</dt>
              <dd className="font-medium">
                {shippingCents === 0 ? (
                  <span className="text-success">Free</span>
                ) : (
                  formatPrice(shippingCents, cart.currency)
                )}
              </dd>
            </div>
            <div className="flex justify-between border-t border-border/70 pt-2.5">
              <dt className="font-heading text-base font-semibold">Total</dt>
              <dd className="font-heading text-base font-semibold text-primary">
                <NumberTicker value={totalCents} kind="price" currency={cart.currency} />
              </dd>
            </div>
          </dl>
        </div>
      </aside>
    </div>
  );
}

function CheckoutSkeleton() {
  return (
    <div className="mt-8 grid gap-10 lg:grid-cols-[1.4fr_1fr]">
      <div className="space-y-4">
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-28 w-full" />
        <Skeleton className="h-12 w-full" />
      </div>
      <Skeleton className="h-72 rounded-2xl" />
    </div>
  );
}
