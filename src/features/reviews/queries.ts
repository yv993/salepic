import "server-only";
import { and, desc, eq } from "drizzle-orm";
import { cacheLife, cacheTag } from "next/cache";
import { getDb } from "@/db";
import { reviews, products } from "@/db/schema";

/** A published review joined with the postcard it's about (for the wall/modal). */
export type WallReview = {
  id: string;
  rating: number;
  title: string | null;
  body: string;
  authorName: string;
  authorLocation: string | null;
  verified: boolean;
  createdAt: string;
  product: { title: string; slug: string; imageUrl: string } | null;
};

const SELECT = {
  id: reviews.id,
  rating: reviews.rating,
  title: reviews.title,
  body: reviews.body,
  authorName: reviews.authorName,
  authorLocation: reviews.authorLocation,
  verified: reviews.verified,
  createdAt: reviews.createdAt,
  pTitle: products.title,
  pSlug: products.slug,
  pImage: products.imageUrl,
} as const;

type Row = {
  id: string;
  rating: number;
  title: string | null;
  body: string;
  authorName: string;
  authorLocation: string | null;
  verified: boolean;
  createdAt: Date;
  pTitle: string | null;
  pSlug: string | null;
  pImage: string | null;
};

function toWall(r: Row): WallReview {
  return {
    id: r.id,
    rating: r.rating,
    title: r.title,
    body: r.body,
    authorName: r.authorName,
    authorLocation: r.authorLocation,
    verified: r.verified,
    createdAt: r.createdAt.toISOString(),
    product: r.pSlug
      ? { title: r.pTitle ?? "Postcard", slug: r.pSlug, imageUrl: r.pImage ?? "" }
      : null,
  };
}

/** Published reviews across all postcards, for the homepage review wall. */
export async function getPublishedReviews(limit = 24): Promise<WallReview[]> {
  "use cache";
  cacheLife("hours");
  cacheTag("reviews");

  try {
    const db = await getDb();
    const rows = await db
      .select(SELECT)
      .from(reviews)
      .leftJoin(products, eq(products.id, reviews.productId))
      .where(eq(reviews.status, "published"))
      .orderBy(desc(reviews.createdAt))
      .limit(limit);
    return rows.map(toWall);
  } catch (err) {
    console.warn("getPublishedReviews: unavailable —", (err as Error).message);
    return [];
  }
}

export type ProductReviews = {
  reviews: WallReview[];
  average: number;
  count: number;
};

/** Published reviews for one postcard + its average rating, for product pages. */
export async function getReviewsForProduct(
  productId: string,
): Promise<ProductReviews> {
  "use cache";
  cacheLife("hours");
  cacheTag("reviews");
  cacheTag(`reviews-${productId}`);

  try {
    const db = await getDb();
    const rows = await db
      .select(SELECT)
      .from(reviews)
      .leftJoin(products, eq(products.id, reviews.productId))
      .where(
        and(eq(reviews.status, "published"), eq(reviews.productId, productId)),
      )
      .orderBy(desc(reviews.createdAt));
    const list = rows.map(toWall);
    const count = list.length;
    const average =
      count > 0 ? list.reduce((s, r) => s + r.rating, 0) / count : 0;
    return { reviews: list, average, count };
  } catch (err) {
    console.warn("getReviewsForProduct: unavailable —", (err as Error).message);
    return { reviews: [], average: 0, count: 0 };
  }
}
