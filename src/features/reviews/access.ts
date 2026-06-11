import "server-only";
import { and, eq, inArray, sql } from "drizzle-orm";
import { getDb } from "@/db";
import { orders, orderItems } from "@/db/schema";

/**
 * Whether the current viewer may review a given postcard. Reads Clerk auth, so
 * it MUST stay OUT of any `use cache` scope — call it from dynamic (Suspense)
 * server components only. Degrades to "signed-out" when Clerk isn't configured.
 */
export type ReviewAccess =
  | { state: "signed-out" }
  | { state: "not-buyer" }
  | { state: "can-review"; name: string; location: string };

/** Pull the viewer's verified email + display name from Clerk, if signed in. */
async function currentBuyer(): Promise<{ email: string; name: string } | null> {
  try {
    const { currentUser } = await import("@clerk/nextjs/server");
    const user = await currentUser();
    if (!user) return null;
    const email =
      user.emailAddresses.find((e) => e.id === user.primaryEmailAddressId)
        ?.emailAddress ?? user.emailAddresses[0]?.emailAddress;
    if (!email) return null;
    const name =
      [user.firstName, user.lastName].filter(Boolean).join(" ") ||
      user.username ||
      "Verified buyer";
    return { email, name };
  } catch {
    // No Clerk middleware / not configured → treat as signed out.
    return null;
  }
}

/** True if `email` has a paid/fulfilled order containing `productId`. */
export async function hasPurchased(
  email: string,
  productId: string,
): Promise<boolean> {
  const db = await getDb();
  const rows = await db
    .select({ id: orders.id })
    .from(orders)
    .innerJoin(orderItems, eq(orderItems.orderId, orders.id))
    .where(
      and(
        sql`lower(${orders.buyerEmail}) = ${email.toLowerCase()}`,
        inArray(orders.status, ["paid", "fulfilled"]),
        eq(orderItems.productId, productId),
      ),
    )
    .limit(1);
  return rows.length > 0;
}

export async function getReviewAccess(productId: string): Promise<ReviewAccess> {
  const buyer = await currentBuyer();
  if (!buyer) return { state: "signed-out" };
  const bought = await hasPurchased(buyer.email, productId);
  if (!bought) return { state: "not-buyer" };
  return { state: "can-review", name: buyer.name, location: "" };
}
