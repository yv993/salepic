import { z } from "zod";

const emptyToUndef = (v: unknown) =>
  typeof v === "string" && v.trim() === "" ? undefined : v;

const optional = (max: number) =>
  z.preprocess(emptyToUndef, z.string().trim().max(max).optional());

/** Buyer + shipping details captured at checkout (parsed from FormData). */
export const checkoutInput = z.object({
  buyerName: z.string().trim().min(1, "Your name is required").max(200),
  buyerEmail: z
    .string()
    .trim()
    .min(1, "Email is required")
    .email("Enter a valid email")
    .max(200),
  shippingLine1: z.string().trim().min(1, "Address is required").max(300),
  shippingLine2: optional(300),
  shippingCity: z.string().trim().min(1, "City is required").max(200),
  shippingState: optional(200),
  shippingPostal: z.string().trim().min(1, "Postal code is required").max(40),
  shippingCountry: z.string().trim().min(1, "Country is required").max(120),
  notes: optional(2000),
});

export type CheckoutInput = z.infer<typeof checkoutInput>;
