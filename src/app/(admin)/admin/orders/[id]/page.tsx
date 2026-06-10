import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { ArrowLeft, Mail, MapPin, CreditCard } from "lucide-react";
import { cn } from "@/lib/utils";
import { formatPrice, formatDate } from "@/lib/format";
import { adminGetOrder } from "@/features/orders/queries";
import { ORDER_STATUS_META } from "@/features/orders/constants";
import { OrderStatusSelect } from "@/components/admin/order-status-select";

export const metadata: Metadata = { title: "Order" };

export default async function AdminOrderDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const order = await adminGetOrder(id);
  if (!order) notFound();

  const status = ORDER_STATUS_META[order.status];

  return (
    <div className="mx-auto max-w-4xl">
      <Link
        href="/admin/orders"
        className="inline-flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground"
      >
        <ArrowLeft className="size-4" />
        Back to orders
      </Link>

      <div className="mt-4 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-heading text-2xl font-bold tracking-tight">
            Order{" "}
            <span className="font-mono">{order.orderNumber}</span>
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Placed {formatDate(order.createdAt)}
            {order.paidAt ? ` · Paid ${formatDate(order.paidAt)}` : ""}
          </p>
        </div>
        <div className="flex flex-col items-start gap-2 sm:items-end">
          <span
            className={cn(
              "inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium",
              status.className,
            )}
          >
            {status.label}
          </span>
          <OrderStatusSelect id={order.id} status={order.status} />
        </div>
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-[1.6fr_1fr]">
        {/* Items */}
        <div className="rounded-2xl border border-border bg-card">
          <div className="border-b border-border px-5 py-3">
            <h2 className="font-heading text-sm font-semibold">Items</h2>
          </div>
          <ul className="divide-y divide-border px-5">
            {order.items.map((item) => (
              <li key={item.id} className="flex items-center gap-3 py-4">
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
                    /{item.slugSnapshot}
                  </p>
                </div>
                <div className="shrink-0 text-right text-sm">
                  <p className="font-medium">
                    {formatPrice(item.lineTotalCents, order.currency)}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {formatPrice(item.unitPriceCents, order.currency)} ×{" "}
                    {item.quantity}
                  </p>
                </div>
              </li>
            ))}
          </ul>
          <dl className="space-y-2 border-t border-border px-5 py-4 text-sm">
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
            <div className="flex justify-between border-t border-border pt-2">
              <dt className="font-heading text-base font-semibold">Total</dt>
              <dd className="font-heading text-base font-semibold text-primary">
                {formatPrice(order.totalCents, order.currency)}
              </dd>
            </div>
          </dl>
        </div>

        {/* Customer + shipping + payment */}
        <div className="space-y-6">
          <Panel icon={Mail} title="Customer">
            <p className="font-medium text-foreground">{order.buyerName}</p>
            <a
              href={`mailto:${order.buyerEmail}`}
              className="text-primary hover:underline"
            >
              {order.buyerEmail}
            </a>
          </Panel>

          <Panel icon={MapPin} title="Ship to">
            <address className="not-italic leading-relaxed">
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
          </Panel>

          <Panel icon={CreditCard} title="Payment">
            <p className="capitalize text-foreground">
              {order.paymentProvider}
            </p>
            {order.paymentReference && (
              <p className="text-xs text-muted-foreground">
                Ref: {order.paymentReference}
              </p>
            )}
            {order.paymentLink && (
              <a
                href={order.paymentLink}
                target="_blank"
                rel="noreferrer"
                className="text-primary hover:underline"
              >
                Payment link
              </a>
            )}
          </Panel>

          {order.notes && (
            <Panel title="Order notes">
              <p className="whitespace-pre-wrap">{order.notes}</p>
            </Panel>
          )}
        </div>
      </div>
    </div>
  );
}

function Panel({
  icon: Icon,
  title,
  children,
}: {
  icon?: typeof Mail;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-2xl border border-border bg-card p-5">
      <h3 className="flex items-center gap-2 stamp-label text-muted-foreground">
        {Icon && <Icon className="size-3.5" />}
        {title}
      </h3>
      <div className="mt-3 space-y-1 text-sm text-muted-foreground">
        {children}
      </div>
    </div>
  );
}
