import "server-only";
import { desc, eq, sql, inArray } from "drizzle-orm";
import { getDb } from "@/db";
import { orders, orderItems, products, type Order, type OrderItem } from "@/db/schema";
import { requireAdmin } from "@/lib/auth";

export type OrderWithItems = Order & { items: OrderItem[] };

/**
 * Public: fetch an order + its items by order number (for the confirmation
 * page). Not admin-gated — the order number is the buyer's reference — but it
 * exposes no other customer's data because it's looked up by that number.
 */
export async function getOrderByNumber(
  orderNumber: string,
): Promise<OrderWithItems | null> {
  const db = await getDb();
  const row = await db.query.orders.findFirst({
    where: eq(orders.orderNumber, orderNumber),
    with: { items: true },
  });
  return row ?? null;
}

/* --------------------------------------------------------------- admin */

export type AdminOrderRow = Order & { itemCount: number };

export async function adminListOrders(): Promise<AdminOrderRow[]> {
  await requireAdmin();
  const db = await getDb();
  const rows = await db
    .select({
      order: orders,
      itemCount: sql<number>`coalesce(sum(${orderItems.quantity}), 0)::int`,
    })
    .from(orders)
    .leftJoin(orderItems, eq(orderItems.orderId, orders.id))
    .groupBy(orders.id)
    .orderBy(desc(orders.createdAt));
  return rows.map((r) => ({ ...r.order, itemCount: r.itemCount }));
}

export async function adminGetOrder(id: string): Promise<OrderWithItems | null> {
  await requireAdmin();
  const db = await getDb();
  const row = await db.query.orders.findFirst({
    where: eq(orders.id, id),
    with: { items: true },
  });
  return row ?? null;
}

export type DashboardStats = {
  ordersByStatus: Record<string, number>;
  totalOrders: number;
  pendingCount: number;
  paidRevenueCents: number;
  productCount: number;
  activeCount: number;
  lowStock: { id: string; title: string; slug: string; stock: number }[];
  recentOrders: AdminOrderRow[];
};

export async function getDashboardStats(): Promise<DashboardStats> {
  await requireAdmin();
  const db = await getDb();

  const statusRows = await db
    .select({
      status: orders.status,
      count: sql<number>`count(*)::int`,
      revenue: sql<number>`coalesce(sum(${orders.totalCents}), 0)::int`,
    })
    .from(orders)
    .groupBy(orders.status);

  const ordersByStatus: Record<string, number> = {};
  let totalOrders = 0;
  let paidRevenueCents = 0;
  for (const r of statusRows) {
    ordersByStatus[r.status] = r.count;
    totalOrders += r.count;
    if (r.status === "paid" || r.status === "fulfilled") {
      paidRevenueCents += r.revenue;
    }
  }

  const [productAgg] = await db
    .select({
      total: sql<number>`count(*)::int`,
      active: sql<number>`coalesce(sum(case when ${products.status} = 'active' then 1 else 0 end), 0)::int`,
    })
    .from(products);

  const lowStock = await db
    .select({
      id: products.id,
      title: products.title,
      slug: products.slug,
      stock: products.stock,
    })
    .from(products)
    .where(inArray(products.status, ["active", "draft"]))
    .orderBy(products.stock)
    .limit(5);

  const recent = await db
    .select({
      order: orders,
      itemCount: sql<number>`coalesce(sum(${orderItems.quantity}), 0)::int`,
    })
    .from(orders)
    .leftJoin(orderItems, eq(orderItems.orderId, orders.id))
    .groupBy(orders.id)
    .orderBy(desc(orders.createdAt))
    .limit(6);

  return {
    ordersByStatus,
    totalOrders,
    pendingCount: ordersByStatus["pending_payment"] ?? 0,
    paidRevenueCents,
    productCount: productAgg?.total ?? 0,
    activeCount: productAgg?.active ?? 0,
    lowStock: lowStock.filter((p) => p.stock <= 5),
    recentOrders: recent.map((r) => ({ ...r.order, itemCount: r.itemCount })),
  };
}
