import type { PaymentProvider } from "./types";

/**
 * STUB — not imported anywhere yet. Flip the export in ./index.ts to switch the
 * whole checkout over once these are implemented.
 *
 * TODO (when Payoneer details arrive):
 *   1. initiatePayment: create a Payoneer "Request a Payment" / Checkout request
 *      for { amountCents, currency, orderNumber, buyerEmail } using
 *      PAYONEER_API_KEY, and return { paymentReference, paymentLink }.
 *   2. verifyCallback: validate the webhook signature against
 *      PAYONEER_WEBHOOK_SECRET, then map the payload to { orderNumber, paid }.
 *   3. Wire src/app/api/revalidate/route.ts to call verifyCallback, mark the
 *      order paid (set paidAt), and revalidateTag("orders", "max").
 */
export const payoneerProvider: PaymentProvider = {
  id: "payoneer",
  async initiatePayment() {
    throw new Error("Payoneer provider is not implemented yet.");
  },
  async verifyCallback() {
    throw new Error("Payoneer verifyCallback is not implemented yet.");
  },
};
