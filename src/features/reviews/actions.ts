"use server";

import { eq } from "drizzle-orm";
import { updateTag } from "next/cache";
import { z } from "zod";
import { getDb } from "@/db";
import { reviews, type ReviewStatus } from "@/db/schema";
import { requireUserId, requireAdmin } from "@/lib/auth";
import { type ActionState, zodToFieldErrors } from "@/lib/action-state";
import { rateLimit, isHoneypotTripped } from "@/lib/spam";
import { hasPurchased } from "./access";

const schema = z.object({
  productId: z.string().uuid("Invalid postcard."),
  rating: z.coerce.number().int().min(1, "Pick a rating.").max(5),
  title: z.string().trim().max(120).optional(),
  body: z
    .string()
    .trim()
    .min(10, "Tell us a little more — at least 10 characters.")
    .max(2000, "Keep it under 2000 characters."),
  authorName: z.string().trim().min(1, "Your name is required.").max(80),
  authorLocation: z.string().trim().max(80).optional(),
});

/**
 * Create a buyer review. Auth + the verified-purchase check run OUTSIDE any
 * cache; only verified buyers (a paid/fulfilled order with their email
 * containing this product) can post. On success, revalidates the review tags.
 */
export async function createReview(
  _prev: ActionState,
  formData: FormData,
): Promise<ActionState> {
  // Spam protection: honeypot.
  if (isHoneypotTripped(formData)) return { error: "Please sign in to leave a review." };

  // --- auth (outside use cache) ---
  let userId: string;
  let email: string | undefined;
  try {
    userId = await requireUserId();
    const { currentUser } = await import("@clerk/nextjs/server");
    const user = await currentUser();
    email =
      user?.emailAddresses.find((e) => e.id === user.primaryEmailAddressId)
        ?.emailAddress ?? user?.emailAddresses[0]?.emailAddress;
  } catch {
    return { error: "Please sign in to leave a review." };
  }
  if (!email) {
    return { error: "Your account needs a verified email to review." };
  }
  if (!rateLimit(`review:${userId}`, 5, 60_000)) {
    return { error: "Too many submissions — please wait a minute." };
  }

  // --- validate ---
  const parsed = schema.safeParse({
    productId: formData.get("productId"),
    rating: formData.get("rating"),
    title: formData.get("title") || undefined,
    body: formData.get("body"),
    authorName: formData.get("authorName"),
    authorLocation: formData.get("authorLocation") || undefined,
  });
  if (!parsed.success) return zodToFieldErrors(parsed.error);
  const { productId, rating, title, body, authorName, authorLocation } =
    parsed.data;

  // --- verified purchase ---
  const db = await getDb();
  const bought = await hasPurchased(email, productId);
  if (!bought) {
    return { error: "Only verified buyers can review this postcard." };
  }

  await db.insert(reviews).values({
    productId,
    userId,
    authorName,
    authorLocation: authorLocation ?? null,
    rating,
    title: title ?? null,
    body,
    verified: true,
    status: "published",
  });

  updateTag("reviews");
  updateTag(`reviews-${productId}`);
  return { ok: true };
}

/** Admin: moderate a review (hide / publish). */
export async function setReviewStatus(
  id: string,
  status: ReviewStatus,
): Promise<{ ok: boolean; error?: string }> {
  await requireAdmin();
  const db = await getDb();
  await db.update(reviews).set({ status }).where(eq(reviews.id, id));
  updateTag("reviews");
  return { ok: true };
}
