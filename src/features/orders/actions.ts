"use server";

import { and, eq, sql } from "drizzle-orm";
import { redirect } from "next/navigation";
import { updateTag } from "next/cache";
import { z } from "zod";
import { getDb } from "@/db";
import { orders, type OrderStatus } from "@/db/schema";
import { requireAdmin } from "@/lib/auth";
import { type ActionState } from "@/lib/action-state";
import { rateLimit, isHoneypotTripped } from "@/lib/spam";

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

const lookupSchema = z.object({
  orderNumber: z.string().trim().min(3, "Enter your order number.").max(40),
  email: z.string().trim().email("Enter the email used at checkout."),
});

/**
 * Public order lookup: find an order by its number + the email used at
 * checkout. Returns to the confirmation page only when BOTH match (so an order
 * number alone never leaks another buyer's details). Honeypot + rate-limited.
 */
export async function lookupOrder(
  _prev: ActionState,
  formData: FormData,
): Promise<ActionState> {
  if (isHoneypotTripped(formData)) return { ok: true }; // silently drop bots
  const parsed = lookupSchema.safeParse({
    orderNumber: formData.get("orderNumber"),
    email: formData.get("email"),
  });
  if (!parsed.success) {
    return {
      error: "Please check the details.",
      fieldErrors: Object.fromEntries(
        parsed.error.issues.map((i) => [String(i.path[0]), i.message]),
      ),
    };
  }
  const { orderNumber, email } = parsed.data;
  if (!rateLimit(`lookup:${email.toLowerCase()}`, 8, 60_000)) {
    return { error: "Too many attempts — please wait a minute and try again." };
  }

  const db = await getDb();
  const [row] = await db
    .select({ orderNumber: orders.orderNumber })
    .from(orders)
    .where(
      and(
        eq(orders.orderNumber, orderNumber.toUpperCase()),
        sql`lower(${orders.buyerEmail}) = ${email.toLowerCase()}`,
      ),
    )
    .limit(1);

  if (!row) {
    return { error: "No order found with that number and email." };
  }
  redirect(`/orders/${row.orderNumber}`);
}
