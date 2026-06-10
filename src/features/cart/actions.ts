"use server";

import { z } from "zod";
import { eq } from "drizzle-orm";
import { getDb } from "@/db";
import { products } from "@/db/schema";
import {
  readCartCookie,
  writeCartCookie,
  type CartCookieItem,
} from "./cart";

/**
 * Cart mutations set the signed cookie. Per Cache Components, setting a cookie
 * in a Server Action re-renders the current tree, so the <CartBadge> Suspense
 * slot reflects the new count automatically.
 */

const addSchema = z.object({
  productId: z.string().uuid(),
  qty: z.coerce.number().int().min(1).max(99).default(1),
});

function upsert(
  items: CartCookieItem[],
  id: string,
  qty: number,
): CartCookieItem[] {
  const next = items.filter((i) => i.id !== id);
  if (qty > 0) next.push({ id, qty: Math.min(99, qty) });
  return next;
}

export type CartActionResult = { ok: boolean; error?: string; count?: number };

export async function addToCart(
  productId: string,
  qty = 1,
): Promise<CartActionResult> {
  const parsed = addSchema.safeParse({ productId, qty });
  if (!parsed.success) return { ok: false, error: "Invalid item." };

  const db = await getDb();
  const [product] = await db
    .select({
      id: products.id,
      stock: products.stock,
      status: products.status,
      available: products.available,
    })
    .from(products)
    .where(eq(products.id, parsed.data.productId))
    .limit(1);

  if (!product || product.status !== "active" || !product.available) {
    return { ok: false, error: "This postcard is no longer available." };
  }
  if (product.stock <= 0) {
    return { ok: false, error: "Sorry — this postcard is sold out." };
  }

  const items = await readCartCookie();
  const current = items.find((i) => i.id === product.id)?.qty ?? 0;
  const desired = Math.min(current + parsed.data.qty, product.stock);
  const next = upsert(items, product.id, desired);
  await writeCartCookie(next);

  const count = next.reduce((n, i) => n + i.qty, 0);
  return { ok: true, count };
}

export async function setCartQty(
  productId: string,
  qty: number,
): Promise<CartActionResult> {
  const clamped = Math.max(0, Math.min(99, Math.trunc(qty)));
  const items = await readCartCookie();
  await writeCartCookie(upsert(items, productId, clamped));
  return { ok: true };
}

export async function removeFromCart(
  productId: string,
): Promise<CartActionResult> {
  const items = await readCartCookie();
  await writeCartCookie(items.filter((i) => i.id !== productId));
  return { ok: true };
}

export async function clearCart(): Promise<void> {
  await writeCartCookie([]);
}
