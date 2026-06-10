import type { Metadata } from "next";
import Link from "next/link";
import { Receipt } from "lucide-react";
import { PageHeader } from "@/components/page-header";
import { cn } from "@/lib/utils";
import { formatPrice, formatDate } from "@/lib/format";
import { adminListOrders } from "@/features/orders/queries";
import { ORDER_STATUS_META } from "@/features/orders/constants";

export const metadata: Metadata = { title: "Orders" };

export default async function AdminOrdersPage() {
  const orders = await adminListOrders();

  return (
    <div className="mx-auto max-w-6xl">
      <PageHeader
        title="Orders"
        description={`${orders.length} ${orders.length === 1 ? "order" : "orders"} placed`}
      />

      {orders.length === 0 ? (
        <div className="flex flex-col items-center gap-4 rounded-2xl border border-dashed border-border px-6 py-20 text-center">
          <span className="grid size-12 place-items-center rounded-full bg-muted text-muted-foreground">
            <Receipt className="size-6" />
          </span>
          <div>
            <p className="font-heading text-lg font-semibold">No orders yet</p>
            <p className="mt-1 text-sm text-muted-foreground">
              When customers check out, their orders show up here.
            </p>
          </div>
        </div>
      ) : (
        <div className="overflow-hidden rounded-2xl border border-border bg-card">
          <table className="w-full text-sm">
            <thead className="border-b border-border bg-muted/50 text-left text-xs text-muted-foreground">
              <tr>
                <th className="px-4 py-3 font-medium">Order</th>
                <th className="hidden px-4 py-3 font-medium sm:table-cell">
                  Customer
                </th>
                <th className="hidden px-4 py-3 font-medium md:table-cell">
                  Date
                </th>
                <th className="px-4 py-3 font-medium">Total</th>
                <th className="px-4 py-3 font-medium">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {orders.map((o) => {
                const status = ORDER_STATUS_META[o.status];
                return (
                  <tr
                    key={o.id}
                    className="cursor-pointer transition-colors hover:bg-muted/40"
                  >
                    <td className="px-4 py-3">
                      <Link
                        href={`/admin/orders/${o.id}`}
                        className="font-mono font-medium hover:text-primary"
                      >
                        {o.orderNumber}
                      </Link>
                      <p className="text-xs text-muted-foreground">
                        {o.itemCount} {o.itemCount === 1 ? "item" : "items"}
                      </p>
                    </td>
                    <td className="hidden px-4 py-3 sm:table-cell">
                      <Link href={`/admin/orders/${o.id}`} className="block">
                        <span className="font-medium">{o.buyerName}</span>
                        <span className="block text-xs text-muted-foreground">
                          {o.buyerEmail}
                        </span>
                      </Link>
                    </td>
                    <td className="hidden px-4 py-3 text-muted-foreground md:table-cell">
                      {formatDate(o.createdAt)}
                    </td>
                    <td className="px-4 py-3 font-medium">
                      {formatPrice(o.totalCents, o.currency)}
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={cn(
                          "inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium",
                          status.className,
                        )}
                      >
                        {status.label}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
