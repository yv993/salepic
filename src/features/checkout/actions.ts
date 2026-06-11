"use server";

import { randomBytes } from "node:crypto";
import { eq, sql } from "drizzle-orm";
import { updateTag } from "next/cache";
import { redirect } from "next/navigation";
import { getDb } from "@/db";
import { orders, orderItems, products } from "@/db/schema";
import { type ActionState, zodToFieldErrors } from "@/lib/action-state";
import { getCart, writeCartCookie } from "@/features/cart/cart";
import { rateLimit, isHoneypotTripped } from "@/lib/spam";
import { sendOrderConfirmation } from "@/features/email/send";
import { checkoutInput } from "./schemas";
import { computeShippingCents } from "./constants";
import { paymentProvider } from "./payment";

/** Generate a unique "PC-XXXXXX" order number (retries on the rare collision). */
async function generateOrderNumber(): Promise<string> {
  const db = await getDb();
  for (let i = 0; i < 6; i++) {
    const candidate = `PC-${randomBytes(3).toString("hex").toUpperCase()}`;
    const existing = await db
      .select({ id: orders.id })
      .from(orders)
      .where(eq(orders.orderNumber, candidate))
      .limit(1);
    if (existing.length === 0) return candidate;
  }
  // Extremely unlikely fallback.
  return `PC-${randomBytes(5).toString("hex").toUpperCase()}`;
}

/**
 * Guest checkout. Recomputes ALL money from the DB (never trusts the client),
 * snapshots line items, kicks off payment, clears the cart, and redirects to
 * the confirmation page.
 */
export async function placeOrder(
  _prev: ActionState,
  formData: FormData,
): Promise<ActionState> {
  // Spam protection: drop bots that fill the hidden honeypot field.
  if (isHoneypotTripped(formData)) {
    return { error: "Something went wrong. Please try again." };
  }

  const parsed = checkoutInput.safeParse(Object.fromEntries(formData));
  if (!parsed.success) return zodToFieldErrors(parsed.error);
  const v = parsed.data;

  if (!rateLimit(`checkout:${v.buyerEmail.toLowerCase()}`, 5, 60_000)) {
    return { error: "Too many checkout attempts — please wait a moment." };
  }

  // Re-derive the cart (and prices) from the DB; drops inactive/out-of-stock.
  const cart = await getCart();
  if (cart.lines.length === 0) {
    return { error: "Your cart is empty — add a postcard before checking out." };
  }

  const subtotalCents = cart.subtotalCents;
  const shippingCents = computeShippingCents(subtotalCents);
  const totalCents = subtotalCents + shippingCents;
  const currency = cart.currency;

  const db = await getDb();
  const orderNumber = await generateOrderNumber();

  const [order] = await db
    .insert(orders)
    .values({
      orderNumber,
      status: "pending_payment",
      buyerName: v.buyerName,
      buyerEmail: v.buyerEmail,
      shippingLine1: v.shippingLine1,
      shippingLine2: v.shippingLine2,
      shippingCity: v.shippingCity,
      shippingState: v.shippingState,
      shippingPostal: v.shippingPostal,
      shippingCountry: v.shippingCountry,
      subtotalCents,
      shippingCents,
      totalCents,
      currency,
      paymentProvider: paymentProvider.id,
      notes: v.notes,
    })
    .returning({ id: orders.id });

  // Snapshot each line so later product edits never mutate order history.
  await db.insert(orderItems).values(
    cart.lines.map((line) => ({
      orderId: order.id,
      productId: line.product.id,
      titleSnapshot: line.product.title,
      slugSnapshot: line.product.slug,
      imageUrlSnapshot: line.product.imageUrl,
      unitPriceCents: line.product.priceCents,
      quantity: line.qty,
      lineTotalCents: line.lineTotalCents,
    })),
  );

  // Kick off payment via the swappable provider, persist any link/reference.
  const init = await paymentProvider.initiatePayment({
    orderId: order.id,
    orderNumber,
    amountCents: totalCents,
    currency,
    buyerName: v.buyerName,
    buyerEmail: v.buyerEmail,
  });

  if (init.paymentLink || init.paymentReference) {
    await db
      .update(orders)
      .set({
        paymentLink: init.paymentLink,
        paymentReference: init.paymentReference,
        updatedAt: new Date(),
      })
      .where(eq(orders.id, order.id));
  }

  // Decrement stock for each purchased line (clamped at 0).
  for (const line of cart.lines) {
    await db
      .update(products)
      .set({
        stock: sql`greatest(0, ${products.stock} - ${line.qty})`,
        updatedAt: new Date(),
      })
      .where(eq(products.id, line.product.id));
  }

  // Order-confirmation email (no-op + logged when RESEND_API_KEY is unset).
  await sendOrderConfirmation({
    orderNumber,
    buyerName: v.buyerName,
    buyerEmail: v.buyerEmail,
    totalCents,
    currency,
    items: cart.lines.map((l) => ({
      title: l.product.title,
      qty: l.qty,
      lineTotalCents: l.lineTotalCents,
    })),
  });

  // Clear the cart (cookie) and invalidate cached reads (orders + stock).
  await writeCartCookie([]);
  updateTag("orders");
  updateTag("products");

  redirect(`/orders/${orderNumber}`);
}
