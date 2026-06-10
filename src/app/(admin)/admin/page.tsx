import type { Metadata } from "next";
import type { ReactNode } from "react";
import Link from "next/link";
import {
  Receipt,
  Clock,
  DollarSign,
  Image as ImageIcon,
  AlertTriangle,
  ArrowRight,
  type LucideIcon,
} from "lucide-react";
import { PageHeader } from "@/components/page-header";
import { NumberTicker } from "@/components/ui/number-ticker";
import { cn } from "@/lib/utils";
import { formatPrice, formatDate } from "@/lib/format";
import { getDashboardStats } from "@/features/orders/queries";
import { ORDER_STATUS_META } from "@/features/orders/constants";

export const metadata: Metadata = { title: "Dashboard" };

export default async function AdminDashboardPage() {
  const stats = await getDashboardStats();

  return (
    <div className="mx-auto max-w-6xl">
      <PageHeader
        title="Studio dashboard"
        description="A quick read on orders, revenue, and what needs restocking."
      />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Stat
          icon={Receipt}
          label="Total orders"
          value={<NumberTicker value={stats.totalOrders} kind="int" />}
          href="/admin/orders"
        />
        <Stat
          icon={Clock}
          label="Pending payment"
          value={<NumberTicker value={stats.pendingCount} kind="int" />}
          tone={stats.pendingCount > 0 ? "warning" : undefined}
          href="/admin/orders"
        />
        <Stat
          icon={DollarSign}
          label="Revenue (paid)"
          value={<NumberTicker value={stats.paidRevenueCents} kind="price" />}
        />
        <Stat
          icon={ImageIcon}
          label="Active postcards"
          value={
            <>
              <NumberTicker value={stats.activeCount} kind="int" />
              {" / "}
              {stats.productCount}
            </>
          }
          href="/admin/products"
        />
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-[1.5fr_1fr]">
        {/* Recent orders */}
        <section className="rounded-2xl border border-border bg-card">
          <div className="flex items-center justify-between border-b border-border px-5 py-3">
            <h2 className="font-heading text-sm font-semibold">Recent orders</h2>
            <Link
              href="/admin/orders"
              className="inline-flex items-center gap-1 text-xs text-primary hover:underline"
            >
              View all <ArrowRight className="size-3.5" />
            </Link>
          </div>
          {stats.recentOrders.length === 0 ? (
            <p className="px-5 py-10 text-center text-sm text-muted-foreground">
              No orders yet.
            </p>
          ) : (
            <ul className="divide-y divide-border">
              {stats.recentOrders.map((o) => {
                const status = ORDER_STATUS_META[o.status];
                return (
                  <li key={o.id}>
                    <Link
                      href={`/admin/orders/${o.id}`}
                      className="flex items-center justify-between gap-3 px-5 py-3 transition-colors hover:bg-muted/40"
                    >
                      <div className="min-w-0">
                        <p className="font-mono text-sm font-medium">
                          {o.orderNumber}
                        </p>
                        <p className="truncate text-xs text-muted-foreground">
                          {o.buyerName} · {formatDate(o.createdAt)}
                        </p>
                      </div>
                      <div className="flex shrink-0 items-center gap-3">
                        <span
                          className={cn(
                            "hidden rounded-full px-2 py-0.5 text-xs font-medium sm:inline-flex",
                            status.className,
                          )}
                        >
                          {status.label}
                        </span>
                        <span className="text-sm font-medium">
                          {formatPrice(o.totalCents, o.currency)}
                        </span>
                      </div>
                    </Link>
                  </li>
                );
              })}
            </ul>
          )}
        </section>

        {/* Low stock */}
        <section className="rounded-2xl border border-border bg-card">
          <div className="flex items-center justify-between border-b border-border px-5 py-3">
            <h2 className="flex items-center gap-2 font-heading text-sm font-semibold">
              <AlertTriangle className="size-4 text-warning" />
              Low stock
            </h2>
            <Link
              href="/admin/products"
              className="inline-flex items-center gap-1 text-xs text-primary hover:underline"
            >
              Manage <ArrowRight className="size-3.5" />
            </Link>
          </div>
          {stats.lowStock.length === 0 ? (
            <p className="px-5 py-10 text-center text-sm text-muted-foreground">
              Everything&apos;s well stocked. 🎉
            </p>
          ) : (
            <ul className="divide-y divide-border">
              {stats.lowStock.map((p) => (
                <li key={p.id}>
                  <Link
                    href={`/admin/products/${p.id}/edit`}
                    className="flex items-center justify-between gap-3 px-5 py-3 transition-colors hover:bg-muted/40"
                  >
                    <span className="truncate text-sm font-medium">
                      {p.title}
                    </span>
                    <span
                      className={cn(
                        "shrink-0 text-sm font-semibold",
                        p.stock === 0 ? "text-destructive" : "text-warning",
                      )}
                    >
                      {p.stock} left
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>
    </div>
  );
}

function Stat({
  icon: Icon,
  label,
  value,
  href,
  tone,
}: {
  icon: LucideIcon;
  label: string;
  value: ReactNode;
  href?: string;
  tone?: "warning";
}) {
  const body = (
    <div className="surface hover-lift rounded-2xl p-5">
      <div className="flex items-center justify-between">
        <span className="stamp-label text-muted-foreground">{label}</span>
        <span
          className={cn(
            "grid size-9 place-items-center rounded-lg bg-primary/10 text-primary",
            tone === "warning" && "bg-warning/15 text-warning",
          )}
        >
          <Icon className="size-4" />
        </span>
      </div>
      <p className="mt-3 font-heading text-3xl font-bold tracking-tight">
        {value}
      </p>
    </div>
  );
  return href ? <Link href={href}>{body}</Link> : body;
}
