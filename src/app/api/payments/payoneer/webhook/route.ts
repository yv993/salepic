import { and, eq } from "drizzle-orm";
import { revalidateTag } from "next/cache";
import { getDb } from "@/db";
import { orders } from "@/db/schema";
import { serverEnv } from "@/lib/env";
import { payoneerProvider } from "@/features/checkout/payment/payoneer-provider";

/**
 * Payoneer payment webhook. Verifies the signature, then flips the matching
 * pending order to `paid`. Inert (503) until PAYONEER_WEBHOOK_SECRET is set, so
 * it's safe to deploy before Payoneer is configured.
 */
export async function POST(req: Request) {
  if (!serverEnv().PAYONEER_WEBHOOK_SECRET) {
    return new Response("Payoneer webhook not configured", { status: 503 });
  }

  const raw = await req.text();
  const signature =
    req.headers.get("payoneer-signature") ??
    req.headers.get("x-payoneer-signature") ??
    undefined;

  let result: { orderNumber: string; paid: boolean };
  try {
    result = await payoneerProvider.verifyCallback!(raw, signature);
  } catch (err) {
    console.error("[payoneer webhook] verification failed:", err);
    return new Response("Invalid signature", { status: 400 });
  }

  if (!result.orderNumber) {
    return new Response("Missing order reference", { status: 400 });
  }

  if (result.paid) {
    const db = await getDb();
    await db
      .update(orders)
      .set({ status: "paid", paidAt: new Date(), updatedAt: new Date() })
      .where(
        and(
          eq(orders.orderNumber, result.orderNumber),
          eq(orders.status, "pending_payment"),
        ),
      );
    revalidateTag("orders", "max");
  }

  return new Response("ok", { status: 200 });
}
