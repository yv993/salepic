"use server";

import { eq } from "drizzle-orm";
import { updateTag } from "next/cache";
import { getDb } from "@/db";
import { orders, type OrderStatus } from "@/db/schema";
import { requireAdmin } from "@/lib/auth";

/** Admin: move an order along its lifecycle. Read-your-own-writes via updateTag. */
export async function updateOrderStatus(
  id: string,
  status: OrderStatus,
): Promise<{ ok: boolean; error?: string }> {
  await requireAdmin();
  const db = await getDb();

  // Stamp paidAt when transitioning into a paid state (and clear it if reverted).
  const paidAt =
    status === "paid" || status === "fulfilled" ? new Date() : null;

  await db
    .update(orders)
    .set({
      status,
      paidAt: status === "pending_payment" || status === "cancelled" ? null : paidAt,
      updatedAt: new Date(),
    })
    .where(eq(orders.id, id));

  updateTag("orders");
  return { ok: true };
}
