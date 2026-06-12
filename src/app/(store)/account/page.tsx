import Link from "next/link";
import Image from "next/image";
import { Receipt, ArrowRight } from "lucide-react";
import { getBuyer } from "@/lib/auth";
import { getMyOrders } from "@/features/account/queries";
import { ORDER_STATUS_META } from "@/features/orders/constants";
import { formatPrice, formatDate } from "@/lib/format";
import { Button } from "@/components/ui/button";

export default async function AccountOverviewPage() {
  const buyer = await getBuyer();
  if (!buyer) return null;
  const orders = await getMyOrders(buyer.email);

  return (
    <section>
      <h2 className="font-heading text-xl font-bold tracking-tight">Order history</h2>
      <p className="mt-1 text-sm text-muted-foreground">
        Orders placed with <span className="font-medium text-foreground">{buyer.email}</span>{" "}
        — including any you made as a guest.
      </p>

      {orders.length === 0 ? (
        <div className="surface mt-6 flex flex-col items-center gap-3 rounded-2xl px-6 py-14 text-center">
          <span className="grid size-12 place-items-center rounded-full bg-muted text-muted-foreground">
            <Receipt className="size-6" />
          </span>
          <p className="font-heading text-lg font-semibold">No orders yet</p>
          <p className="max-w-sm text-sm text-muted-foreground">
            When you place an order it will appear here, ready to track.
          </p>
          <Button className="mt-2" render={<Link href="/postcards" />}>
            Browse postcards
          </Button>
        </div>
      ) : (
        <ul className="mt-6 space-y-4">
          {orders.map((o) => {
            const status = ORDER_STATUS_META[o.status];
            const itemCount = o.items.reduce((n, i) => n + i.quantity, 0);
            return (
              <li key={o.id} className="surface rounded-2xl p-5">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <Link
                      href={`/orders/${o.orderNumber}`}
                      className="font-mono font-semibold hover:text-primary"
                    >
                      {o.orderNumber}
                    </Link>
                    <p className="text-xs text-muted-foreground">
                      {formatDate(o.createdAt)} · {itemCount} {itemCount === 1 ? "item" : "items"}
                    </p>
                  </div>
                  <span
                    className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${status.className}`}
                  >
                    {status.label}
                  </span>
                  <span className="font-heading font-semibold text-primary">
                    {formatPrice(o.totalCents, o.currency)}
                  </span>
                </div>
                <div className="mt-3 flex items-center gap-2">
                  {o.items.slice(0, 5).map((it) =>
                    it.imageUrlSnapshot ? (
                      <div
                        key={it.id}
                        className="relative aspect-[1.41/1] w-14 overflow-hidden rounded-md bg-muted ring-1 ring-border/70"
                      >
                        <Image
                          src={it.imageUrlSnapshot}
                          alt={it.titleSnapshot}
                          fill
                          sizes="56px"
                          className="object-cover"
                        />
                      </div>
                    ) : null,
                  )}
                  <Link
                    href={`/orders/${o.orderNumber}`}
                    className="ml-auto inline-flex items-center gap-1 text-sm font-medium text-primary hover:underline"
                  >
                    View <ArrowRight className="size-4" />
                  </Link>
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </section>
  );
}
