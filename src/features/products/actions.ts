"use server";

import { and, eq, ne } from "drizzle-orm";
import { updateTag } from "next/cache";
import { redirect } from "next/navigation";
import { getDb } from "@/db";
import { products } from "@/db/schema";
import { requireAdmin } from "@/lib/auth";
import { type ActionState, zodToFieldErrors } from "@/lib/action-state";
import { productInput } from "./schemas";
import { slugify, slugWithSuffix } from "./slug";

/** Invalidate every cached storefront read + the per-slug entry. */
function revalidateProduct(slug?: string) {
  updateTag("products");
  if (slug) updateTag(`product-${slug}`);
}

/** Ensure a slug is unique, appending a random suffix on collision. */
async function ensureUniqueSlug(
  desired: string,
  excludeId?: string,
): Promise<string> {
  const db = await getDb();
  let slug = slugify(desired) || "postcard";
  const existing = await db
    .select({ id: products.id })
    .from(products)
    .where(
      excludeId
        ? and(eq(products.slug, slug), ne(products.id, excludeId))
        : eq(products.slug, slug),
    )
    .limit(1);
  if (existing.length > 0) slug = slugWithSuffix(desired);
  return slug;
}

export async function createProduct(
  _prev: ActionState,
  formData: FormData,
): Promise<ActionState> {
  await requireAdmin();
  const parsed = productInput.safeParse(Object.fromEntries(formData));
  if (!parsed.success) return zodToFieldErrors(parsed.error);
  const v = parsed.data;
  const db = await getDb();

  const slug = await ensureUniqueSlug(v.slug || v.title);

  await db.insert(products).values({
    slug,
    title: v.title,
    description: v.description,
    priceCents: v.price,
    currency: v.currency,
    category: v.category,
    imageUrl: v.imageUrl,
    images: v.images,
    widthMm: v.widthMm,
    heightMm: v.heightMm,
    stock: v.stock,
    available: v.available,
    featured: v.featured,
    status: v.status,
  });

  revalidateProduct(slug);
  redirect("/admin/products");
}

export async function updateProduct(
  id: string,
  _prev: ActionState,
  formData: FormData,
): Promise<ActionState> {
  await requireAdmin();
  const parsed = productInput.safeParse(Object.fromEntries(formData));
  if (!parsed.success) return zodToFieldErrors(parsed.error);
  const v = parsed.data;
  const db = await getDb();

  // Look up the previous slug so we can invalidate it too if it changes.
  const [prevRow] = await db
    .select({ slug: products.slug })
    .from(products)
    .where(eq(products.id, id))
    .limit(1);
  if (!prevRow) return { error: "Postcard not found." };

  const slug = await ensureUniqueSlug(v.slug || v.title, id);

  await db
    .update(products)
    .set({
      slug,
      title: v.title,
      description: v.description,
      priceCents: v.price,
      currency: v.currency,
      category: v.category,
      imageUrl: v.imageUrl,
      images: v.images,
      widthMm: v.widthMm,
      heightMm: v.heightMm,
      stock: v.stock,
      available: v.available,
      featured: v.featured,
      status: v.status,
      updatedAt: new Date(),
    })
    .where(eq(products.id, id));

  revalidateProduct(slug);
  if (prevRow.slug !== slug) updateTag(`product-${prevRow.slug}`);
  redirect("/admin/products");
}

export async function deleteProduct(id: string): Promise<void> {
  await requireAdmin();
  const db = await getDb();
  const [row] = await db
    .delete(products)
    .where(eq(products.id, id))
    .returning({ slug: products.slug });
  revalidateProduct(row?.slug);
  redirect("/admin/products");
}

/** Quick toggles from the admin list (status / featured) without a full edit. */
export async function setProductStatus(
  id: string,
  status: "draft" | "active" | "archived",
): Promise<void> {
  await requireAdmin();
  const db = await getDb();
  const [row] = await db
    .update(products)
    .set({ status, updatedAt: new Date() })
    .where(eq(products.id, id))
    .returning({ slug: products.slug });
  revalidateProduct(row?.slug);
}
