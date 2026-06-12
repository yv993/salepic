import "server-only";
import { and, desc, eq, sql, inArray } from "drizzle-orm";
import { getDb } from "@/db";
import {
  orders,
  savedAddresses,
  accountWishlist,
  products,
  reviews,
  type Order,
  type OrderItem,
  type SavedAddress,
  type Product,
} from "@/db/schema";

/**
 * Account reads — derived from the signed-in user's id/email, so they are
 * UNCACHED and only ever called from dynamic (Suspense) account pages.
 */

export type AccountOrder = Order & { items: OrderItem[] };

/** Orders placed with the buyer's verified email (incl. prior guest orders). */
export async function getMyOrders(email: string): Promise<AccountOrder[]> {
  const db = await getDb();
  return db.query.orders.findMany({
    where: sql`lower(${orders.buyerEmail}) = ${email.toLowerCase()}`,
    with: { items: true },
    orderBy: (o, { desc: d }) => [d(o.createdAt)],
  });
}

export async function getSavedAddresses(userId: string): Promise<SavedAddress[]> {
  const db = await getDb();
  return db
    .select()
    .from(savedAddresses)
    .where(eq(savedAddresses.userId, userId))
    .orderBy(desc(savedAddresses.isDefault), desc(savedAddresses.createdAt));
}

export async function getDefaultAddress(userId: string): Promise<SavedAddress | null> {
  const rows = await getSavedAddresses(userId);
  return rows.find((a) => a.isDefault) ?? rows[0] ?? null;
}

/** The account (DB) wishlist resolved to active products. */
export async function getAccountWishlist(userId: string): Promise<Product[]> {
  const db = await getDb();
  const rows = await db
    .select({ product: products })
    .from(accountWishlist)
    .innerJoin(products, eq(products.id, accountWishlist.productId))
    .where(and(eq(accountWishlist.userId, userId), eq(products.status, "active")))
    .orderBy(desc(accountWishlist.createdAt));
  return rows.map((r) => r.product);
}

export type MyReview = {
  id: string;
  rating: number;
  title: string | null;
  body: string;
  status: string;
  createdAt: Date;
  productTitle: string | null;
  productSlug: string | null;
};

export async function getMyReviews(userId: string): Promise<MyReview[]> {
  const db = await getDb();
  return db
    .select({
      id: reviews.id,
      rating: reviews.rating,
      title: reviews.title,
      body: reviews.body,
      status: reviews.status,
      createdAt: reviews.createdAt,
      productTitle: products.title,
      productSlug: products.slug,
    })
    .from(reviews)
    .leftJoin(products, eq(products.id, reviews.productId))
    .where(eq(reviews.userId, userId))
    .orderBy(desc(reviews.createdAt));
}

/** Valid product ids from a candidate list (used when merging the cookie list). */
export async function filterValidProductIds(ids: string[]): Promise<string[]> {
  if (ids.length === 0) return [];
  const db = await getDb();
  const rows = await db
    .select({ id: products.id })
    .from(products)
    .where(inArray(products.id, ids));
  return rows.map((r) => r.id);
}
