/** Flat shipping rate in cents, waived above the free-shipping threshold. */
export const SHIPPING_FLAT_CENTS = 450;
export const FREE_SHIPPING_THRESHOLD_CENTS = 5000;

/** Shipping charged for a given subtotal (free once the threshold is met). */
export function computeShippingCents(subtotalCents: number): number {
  if (subtotalCents <= 0) return 0;
  return subtotalCents >= FREE_SHIPPING_THRESHOLD_CENTS
    ? 0
    : SHIPPING_FLAT_CENTS;
}

/** A short, friendly country list for the checkout select. */
export const COUNTRIES = [
  "United States",
  "United Kingdom",
  "Canada",
  "Australia",
  "Ireland",
  "Germany",
  "France",
  "Netherlands",
  "Sweden",
  "Norway",
  "Denmark",
  "Spain",
  "Italy",
  "Japan",
  "New Zealand",
  "Other",
] as const;
