import "server-only";
import { createHmac, timingSafeEqual } from "node:crypto";
import { cookies } from "next/headers";
import { inArray } from "drizzle-orm";
import { getDb } from "@/db";
import { products, type Product } from "@/db/schema";

export const CART_COOKIE = "pc_cart";

/** One entry of the persisted cart — IDs + quantities ONLY, never prices. */
export type CartCookieItem = { id: string; qty: number };

/** A resolved cart line, with the price re-derived from the DB at read time. */
export type CartLine = {
  product: Product;
  qty: number;
  lineTotalCents: number;
};

export type Cart = {
  lines: CartLine[];
  count: number;
  subtotalCents: number;
  currency: string;
};

const MAX_QTY = 99;

/**
 * Cookie is signed (HMAC) so a tampered value is rejected rather than trusted.
 * No secret is strictly required for correctness (prices are always re-derived
 * server-side), but signing keeps the cart from being trivially forged.
 */
function secret(): string {
  return (
    process.env.CART_SECRET ||
    process.env.CLERK_SECRET_KEY ||
    "pc-dev-insecure-cart-secret"
  );
}

function sign(payload: string): string {
  return createHmac("sha256", secret()).update(payload).digest("base64url");
}

function serialize(items: CartCookieItem[]): string {
  const payload = Buffer.from(JSON.stringify(items)).toString("base64url");
  return `${payload}.${sign(payload)}`;
}

function deserialize(raw: string | undefined): CartCookieItem[] {
  if (!raw) return [];
  const dot = raw.lastIndexOf(".");
  if (dot < 0) return [];
  const payload = raw.slice(0, dot);
  const mac = raw.slice(dot + 1);
  try {
    const expected = sign(payload);
    const a = Buffer.from(mac);
    const b = Buffer.from(expected);
    if (a.length !== b.length || !timingSafeEqual(a, b)) return [];
    const json = Buffer.from(payload, "base64url").toString("utf8");
    const parsed = JSON.parse(json);
    if (!Array.isArray(parsed)) return [];
    return parsed
      .filter(
        (x): x is CartCookieItem =>
          x &&
          typeof x.id === "string" &&
          typeof x.qty === "number" &&
          Number.isFinite(x.qty),
      )
      .map((x) => ({ id: x.id, qty: Math.min(MAX_QTY, Math.max(1, Math.trunc(x.qty))) }));
  } catch {
    // Malformed / tampered cookie → treat as empty.
    return [];
  }
}

/** Raw cookie items (no DB). Cheap — used by the cart badge. */
export async function readCartCookie(): Promise<CartCookieItem[]> {
  const store = await cookies();
  return deserialize(store.get(CART_COOKIE)?.value);
}

/** Total item count straight from the cookie (badge use). */
export async function getCartCount(): Promise<number> {
  const items = await readCartCookie();
  return items.reduce((n, i) => n + i.qty, 0);
}

/** Persist cart items into the signed httpOnly cookie. */
export async function writeCartCookie(items: CartCookieItem[]): Promise<void> {
  const store = await cookies();
  const cleaned = items.filter((i) => i.qty > 0);
  if (cleaned.length === 0) {
    store.delete(CART_COOKIE);
    return;
  }
  store.set(CART_COOKIE, serialize(cleaned), {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 24 * 30, // 30 days
  });
}

/**
 * Resolve the cookie into priced lines from the DB.
 *
 * Hardening: drops IDs that don't resolve to an active+available product, and
 * clamps each quantity to available stock. Prices ALWAYS come from the DB.
 */
export async function getCart(): Promise<Cart> {
  const items = await readCartCookie();
  if (items.length === 0) {
    return { lines: [], count: 0, subtotalCents: 0, currency: "USD" };
  }

  const db = await getDb();
  const ids = items.map((i) => i.id);
  const rows = await db.select().from(products).where(inArray(products.id, ids));
  const byId = new Map(rows.map((r) => [r.id, r]));

  const lines: CartLine[] = [];
  for (const item of items) {
    const product = byId.get(item.id);
    if (!product) continue;
    if (product.status !== "active" || !product.available) continue;
    const qty = Math.max(0, Math.min(item.qty, product.stock));
    if (qty === 0) continue;
    lines.push({
      product,
      qty,
      lineTotalCents: product.priceCents * qty,
    });
  }

  const subtotalCents = lines.reduce((s, l) => s + l.lineTotalCents, 0);
  const count = lines.reduce((n, l) => n + l.qty, 0);
  const currency = lines[0]?.product.currency ?? "USD";
  return { lines, count, subtotalCents, currency };
}
