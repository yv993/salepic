import { Suspense } from "react";
import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { CheckCircle2, Clock, ExternalLink, Package } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { formatPrice } from "@/lib/format";
import { getOrderByNumber } from "@/features/orders/queries";
import { ORDER_STATUS_META } from "@/features/orders/constants";

export const metadata: Metadata = {
  title: "Order confirmation",
  robots: { index: false },
};

type Params = Promise<{ orderNumber: string }>;

export default function OrderConfirmationPage({ params }: { params: Params }) {
  return (
    <Suspense fallback={<ConfirmationSkeleton />}>
      <Confirmation params={params} />
    </Suspense>
  );
}

async function Confirmation({ params }: { params: Params }) {
  const { orderNumber } = await params;
  const order = await getOrderByNumber(orderNumber);
  if (!order) notFound();

  const status = ORDER_STATUS_META[order.status];
  const pending = order.status === "pending_payment";

  return (
    <div className="mx-auto max-w-2xl px-4 py-14 sm:px-6">
      <div className="text-center">
        <span className="mx-auto grid size-14 place-items-center rounded-full bg-success/15 text-success">
          <CheckCircle2 className="size-8" />
        </span>
        <h1 className="mt-5 font-heading text-3xl font-bold tracking-tight sm:text-4xl">
          Thank you, {order.buyerName.split(" ")[0]}!
        </h1>
        <p className="mt-2 text-muted-foreground">
          Your order{" "}
          <span className="font-mono font-semibold text-foreground">
            {order.orderNumber}
          </span>{" "}
          has been received.
        </p>
        <span
          className={`mt-4 inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold ${status.className}`}
        >
          {status.label}
        </span>
      </div>

      {/* Payment section — data-driven: link if present, else instructions. */}
      <div className="surface mt-8 rounded-2xl p-6">
        <h2 className="flex items-center gap-2 font-heading text-lg font-semibold">
          <Clock className="size-5 text-primary" />
          {pending ? "Complete your payment" : "Payment"}
        </h2>
        {order.paymentLink ? (
          <>
            <p className="mt-2 text-sm text-muted-foreground">
              Your order is reserved. Use the secure link below to pay — your
              postcards ship as soon as it clears.
            </p>
            <Button
              size="lg"
              className="mt-4"
              render={
                <a href={order.paymentLink} target="_blank" rel="noreferrer" />
              }
            >
              Pay now
              <ExternalLink className="size-4" />
            </Button>
          </>
        ) : pending ? (
          <p className="mt-2 text-sm text-muted-foreground">
            Payoneer checkout is being set up — you&apos;ll receive a secure
            payment link shortly. We&apos;ve emailed a copy of this order to{" "}
            <span className="font-medium text-foreground">
              {order.buyerEmail}
            </span>
            .
          </p>
        ) : (
          <p className="mt-2 text-sm text-muted-foreground">
            Payment received — thank you! Your order is on its way.
          </p>
        )}
      </div>

      {/* Items */}
      <div className="surface mt-6 rounded-2xl p-6">
        <h2 className="flex items-center gap-2 font-heading text-lg font-semibold">
          <Package className="size-5 text-primary" />
          Your postcards
        </h2>
        <ul className="mt-4 divide-y divide-border/70">
          {order.items.map((item) => (
            <li key={item.id} className="flex items-center gap-3 py-3">
              {item.imageUrlSnapshot && (
                <div className="relative aspect-[1.41/1] w-16 shrink-0 overflow-hidden rounded-md bg-muted">
                  <Image
                    src={item.imageUrlSnapshot}
                    alt={item.titleSnapshot}
                    fill
                    sizes="64px"
                    className="object-cover"
                  />
                </div>
              )}
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium">
                  {item.titleSnapshot}
                </p>
                <p className="text-xs text-muted-foreground">
                  {formatPrice(item.unitPriceCents, order.currency)} × {item.quantity}
                </p>
              </div>
              <p className="shrink-0 text-sm font-medium">
                {formatPrice(item.lineTotalCents, order.currency)}
              </p>
            </li>
          ))}
        </ul>

        <dl className="mt-4 space-y-2 border-t border-border/70 pt-4 text-sm">
          <div className="flex justify-between">
            <dt className="text-muted-foreground">Subtotal</dt>
            <dd>{formatPrice(order.subtotalCents, order.currency)}</dd>
          </div>
          <div className="flex justify-between">
            <dt className="text-muted-foreground">Shipping</dt>
            <dd>
              {order.shippingCents === 0
                ? "Free"
                : formatPrice(order.shippingCents, order.currency)}
            </dd>
          </div>
          <div className="flex justify-between border-t border-border/70 pt-2">
            <dt className="font-heading text-base font-semibold">Total</dt>
            <dd className="font-heading text-base font-semibold text-primary">
              {formatPrice(order.totalCents, order.currency)}
            </dd>
          </div>
        </dl>
      </div>

      {/* Shipping address */}
      <div className="surface mt-6 rounded-2xl p-6">
        <h2 className="stamp-label text-muted-foreground">Shipping to</h2>
        <address className="mt-3 text-sm not-italic leading-relaxed">
          {order.buyerName}
          <br />
          {order.shippingLine1}
          {order.shippingLine2 && (
            <>
              <br />
              {order.shippingLine2}
            </>
          )}
          <br />
          {order.shippingCity}
          {order.shippingState ? `, ${order.shippingState}` : ""}{" "}
          {order.shippingPostal}
          <br />
          {order.shippingCountry}
        </address>
      </div>

      <div className="mt-8 text-center">
        <Button variant="outline" render={<Link href="/postcards" />}>
          Continue shopping
        </Button>
      </div>
    </div>
  );
}

function ConfirmationSkeleton() {
  return (
    <div className="mx-auto max-w-2xl px-4 py-14 sm:px-6">
      <div className="flex flex-col items-center gap-4">
        <Skeleton className="size-14 rounded-full" />
        <Skeleton className="h-9 w-64" />
        <Skeleton className="h-5 w-48" />
      </div>
      <Skeleton className="mt-8 h-32 rounded-2xl" />
      <Skeleton className="mt-6 h-48 rounded-2xl" />
    </div>
  );
}
