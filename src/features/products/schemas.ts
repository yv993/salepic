import { z } from "zod";
import { productCategory, productStatus } from "@/db/schema";

export const categoryEnum = z.enum(productCategory.enumValues);
export const statusEnum = z.enum(productStatus.enumValues);

const emptyToUndef = (v: unknown) =>
  typeof v === "string" && v.trim() === "" ? undefined : v;

const toInt = (v: unknown) => {
  const u = emptyToUndef(v);
  if (u === undefined || u === null) return undefined;
  const n = Number(u);
  return Number.isFinite(n) ? Math.trunc(n) : undefined;
};

/** Dollars string (e.g. "8.50") → integer cents. */
const toCents = (v: unknown) => {
  const u = emptyToUndef(v);
  if (u === undefined || u === null) return undefined;
  const n = Number(u);
  return Number.isFinite(n) ? Math.round(n * 100) : undefined;
};

/** HTML checkbox → boolean ("on"/"true" = true, absent/"" = false). */
const toBool = (v: unknown) => v === "on" || v === "true" || v === true;

/** Newline/comma-separated image URLs → string[] (or undefined). */
const toImageList = (v: unknown) => {
  if (typeof v !== "string") return undefined;
  const list = v
    .split(/[\n,]+/)
    .map((s) => s.trim())
    .filter(Boolean);
  return list.length ? list : undefined;
};

/**
 * Validates the admin create/edit product form (parsed from FormData).
 * `price` is entered in dollars and stored as integer cents.
 */
export const productInput = z.object({
  title: z.string().trim().min(1, "Title is required").max(200),
  slug: z.preprocess(emptyToUndef, z.string().trim().max(80).optional()),
  description: z.preprocess(emptyToUndef, z.string().max(5000).optional()),
  price: z.preprocess(
    toCents,
    z
      .number({ error: "Enter a price" })
      .int()
      .positive("Price must be greater than 0")
      .max(1_000_000, "That price looks too high"),
  ),
  currency: z.preprocess((v) => emptyToUndef(v) ?? "USD", z.string().length(3)),
  category: z.preprocess((v) => emptyToUndef(v) ?? "travel", categoryEnum),
  imageUrl: z
    .string()
    .trim()
    .min(1, "An image URL or path is required")
    .max(1000),
  images: z.preprocess(toImageList, z.array(z.string().max(1000)).optional()),
  widthMm: z.preprocess(toInt, z.number().int().positive().max(2000).optional()),
  heightMm: z.preprocess(
    toInt,
    z.number().int().positive().max(2000).optional(),
  ),
  stock: z.preprocess(
    (v) => toInt(v) ?? 0,
    z.number().int().nonnegative().max(1_000_000),
  ),
  available: z.preprocess(toBool, z.boolean()),
  featured: z.preprocess(toBool, z.boolean()),
  status: z.preprocess((v) => emptyToUndef(v) ?? "draft", statusEnum),
});

export type ProductInput = z.infer<typeof productInput>;
