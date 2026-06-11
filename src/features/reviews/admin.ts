import "server-only";
import { desc, eq } from "drizzle-orm";
import { getDb } from "@/db";
import { reviews, products } from "@/db/schema";
import { requireAdmin } from "@/lib/auth";
import type { ReviewStatus } from "@/db/schema";

export type AdminReviewRow = {
  id: string;
  rating: number;
  title: string | null;
  body: string;
  authorName: string;
  authorLocation: string | null;
  verified: boolean;
  status: ReviewStatus;
  createdAt: Date;
  productTitle: string | null;
  productSlug: string | null;
};

/** All reviews (any status), newest first — admin moderation list. */
export async function adminListReviews(): Promise<AdminReviewRow[]> {
  await requireAdmin();
  const db = await getDb();
  return db
    .select({
      id: reviews.id,
      rating: reviews.rating,
      title: reviews.title,
      body: reviews.body,
      authorName: reviews.authorName,
      authorLocation: reviews.authorLocation,
      verified: reviews.verified,
      status: reviews.status,
      createdAt: reviews.createdAt,
      productTitle: products.title,
      productSlug: products.slug,
    })
    .from(reviews)
    .leftJoin(products, eq(products.id, reviews.productId))
    .orderBy(desc(reviews.createdAt));
}
