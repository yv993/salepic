import "server-only";
import { desc, eq } from "drizzle-orm";
import { getDb } from "@/db";
import { products, type Product } from "@/db/schema";
import { requireAdmin } from "@/lib/auth";

/** All products (any status), newest first — for the admin list. */
export async function adminListProducts(): Promise<Product[]> {
  await requireAdmin();
  const db = await getDb();
  return db.select().from(products).orderBy(desc(products.createdAt));
}

/** A single product by id, for the admin edit form. */
export async function adminGetProduct(id: string): Promise<Product | null> {
  await requireAdmin();
  const db = await getDb();
  const [row] = await db
    .select()
    .from(products)
    .where(eq(products.id, id))
    .limit(1);
  return row ?? null;
}
