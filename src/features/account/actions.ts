"use server";

import { and, eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { getDb } from "@/db";
import { savedAddresses, accountWishlist } from "@/db/schema";
import { requireUserId } from "@/lib/auth";
import { type ActionState, zodToFieldErrors } from "@/lib/action-state";
import { filterValidProductIds } from "./queries";

const addressSchema = z.object({
  id: z.string().uuid().optional().or(z.literal("")),
  label: z.string().trim().max(40).optional(),
  name: z.string().trim().min(1, "Name is required.").max(80),
  line1: z.string().trim().min(1, "Address is required.").max(120),
  line2: z.string().trim().max(120).optional(),
  city: z.string().trim().min(1, "City is required.").max(80),
  state: z.string().trim().max(80).optional(),
  postal: z.string().trim().min(1, "Postcode is required.").max(20),
  country: z.string().trim().min(1, "Country is required.").max(80),
  isDefault: z.coerce.boolean().optional(),
});

/** Create or update a saved address for the signed-in buyer. */
export async function saveAddress(
  _prev: ActionState,
  formData: FormData,
): Promise<ActionState> {
  let userId: string;
  try {
    userId = await requireUserId();
  } catch {
    return { error: "Please sign in to save an address." };
  }

  const parsed = addressSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) return zodToFieldErrors(parsed.error);
  const v = parsed.data;
  const db = await getDb();

  if (v.isDefault) {
    await db
      .update(savedAddresses)
      .set({ isDefault: false })
      .where(eq(savedAddresses.userId, userId));
  }

  const values = {
    userId,
    label: v.label || null,
    name: v.name,
    line1: v.line1,
    line2: v.line2 || null,
    city: v.city,
    state: v.state || null,
    postal: v.postal,
    country: v.country,
    isDefault: Boolean(v.isDefault),
  };

  if (v.id) {
    await db
      .update(savedAddresses)
      .set(values)
      .where(and(eq(savedAddresses.id, v.id), eq(savedAddresses.userId, userId)));
  } else {
    await db.insert(savedAddresses).values(values);
  }

  revalidatePath("/account/addresses");
  return { ok: true };
}

export async function deleteAddress(id: string): Promise<{ ok: boolean }> {
  const userId = await requireUserId();
  const db = await getDb();
  await db
    .delete(savedAddresses)
    .where(and(eq(savedAddresses.id, id), eq(savedAddresses.userId, userId)));
  revalidatePath("/account/addresses");
  return { ok: true };
}

export async function addToAccountWishlist(
  productId: string,
): Promise<{ ok: boolean }> {
  const userId = await requireUserId();
  const valid = await filterValidProductIds([productId]);
  if (valid.length === 0) return { ok: false };
  const db = await getDb();
  await db
    .insert(accountWishlist)
    .values({ userId, productId })
    .onConflictDoNothing();
  revalidatePath("/account/wishlist");
  return { ok: true };
}

export async function removeFromAccountWishlist(
  productId: string,
): Promise<{ ok: boolean }> {
  const userId = await requireUserId();
  const db = await getDb();
  await db
    .delete(accountWishlist)
    .where(
      and(
        eq(accountWishlist.userId, userId),
        eq(accountWishlist.productId, productId),
      ),
    );
  revalidatePath("/account/wishlist");
  return { ok: true };
}

/** Merge this device's cookie wishlist (product ids) into the account. */
export async function mergeWishlist(
  productIds: string[],
): Promise<{ ok: boolean; merged: number }> {
  const userId = await requireUserId();
  const valid = await filterValidProductIds(productIds.slice(0, 100));
  if (valid.length === 0) return { ok: true, merged: 0 };
  const db = await getDb();
  await db
    .insert(accountWishlist)
    .values(valid.map((productId) => ({ userId, productId })))
    .onConflictDoNothing();
  revalidatePath("/account/wishlist");
  return { ok: true, merged: valid.length };
}
