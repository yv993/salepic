import type { PaymentProvider } from "./types";

/**
 * The only provider wired today. It records the order as pending and tells the
 * buyer a secure payment link is on the way — letting the studio collect
 * payment out-of-band while the real (Payoneer) integration is finished.
 */
export const manualProvider: PaymentProvider = {
  id: "manual",
  async initiatePayment() {
    return {
      provider: "manual",
      status: "pending_payment",
      instructions:
        "Payoneer checkout is being set up — you'll receive a secure payment link shortly.",
    };
  },
};
