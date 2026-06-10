import "server-only";
import { and, asc, desc, eq, sql } from "drizzle-orm";
import { cacheLife, cacheTag } from "next/cache";
import { getDb } from "@/db";
import { products, type Product, type ProductCategory } from "@/db/schema";
import type { ProductSort } from "./constants";

/**
 * Cached storefront reads. Every entry is tagged `products` (invalidated by any
 * admin product mutation via updateTag) and lives for `days` until then.
 *
 * These run inside `use cache`, so they MUST NOT touch runtime APIs (cookies,
 * headers, params, searchParams) — callers read those and pass plain args in.
 */

function orderFor(sort: ProductSort) {
  switch (sort) {
    case "price_asc":
      return [asc(products.priceCents), desc(products.createdAt)];
    case "price_desc":
      return [desc(products.priceCents), desc(products.createdAt)];
    case "newest":
      return [desc(products.createdAt)];
    case "featured":
    default:
      return [desc(products.featured), desc(products.createdAt)];
  }
}

/** Active, available postcards for the gallery, optionally filtered + sorted. */
export async function getStoreProducts(opts: {
  category?: ProductCategory;
  sort?: ProductSort;
}): Promise<Product[]> {
  "use cache";
  cacheLife("days");
  cacheTag("products");

  try {
    const db = await getDb();
    const where = and(
      eq(products.status, "active"),
      eq(products.available, true),
      opts.category ? eq(products.category, opts.category) : undefined,
    );
    return await db
      .select()
      .from(products)
      .where(where)
      .orderBy(...orderFor(opts.sort ?? "featured"));
  } catch (err) {
    // Degrade gracefully if the catalog DB is unreachable (e.g. building before
    // the database is provisioned/seeded). Revalidated once data is available.
    console.warn("getStoreProducts: catalog unavailable —", (err as Error).message);
    return [];
  }
}

/** Featured postcards for the home page row. */
export async function getFeaturedProducts(limit = 6): Promise<Product[]> {
  "use cache";
  cacheLife("days");
  cacheTag("products");

  try {
    const db = await getDb();
    return await db
      .select()
      .from(products)
      .where(
        and(
          eq(products.status, "active"),
          eq(products.available, true),
          eq(products.featured, true),
        ),
      )
      .orderBy(desc(products.createdAt))
      .limit(limit);
  } catch (err) {
    console.warn("getFeaturedProducts: catalog unavailable —", (err as Error).message);
    return [];
  }
}

/** A single active postcard by slug, with a per-slug tag for targeted updates. */
export async function getProductBySlug(slug: string): Promise<Product | null> {
  "use cache";
  cacheLife("days");
  cacheTag("products");
  cacheTag(`product-${slug}`);

  const db = await getDb();
  const [row] = await db
    .select()
    .from(products)
    .where(and(eq(products.slug, slug), eq(products.status, "active")))
    .limit(1);
  return row ?? null;
}

/** Count of active postcards per category, for the category teaser. */
export async function getCategoryCounts(): Promise<Record<string, number>> {
  "use cache";
  cacheLife("days");
  cacheTag("products");

  try {
    const db = await getDb();
    const rows = await db
      .select({
        category: products.category,
        count: sql<number>`count(*)::int`,
      })
      .from(products)
      .where(and(eq(products.status, "active"), eq(products.available, true)))
      .groupBy(products.category);

    const out: Record<string, number> = {};
    for (const r of rows) out[r.category] = r.count;
    return out;
  } catch (err) {
    console.warn("getCategoryCounts: catalog unavailable —", (err as Error).message);
    return {};
  }
}
