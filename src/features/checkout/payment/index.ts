import type { PaymentProvider } from "./types";
import { manualProvider } from "./manual-provider";

/**
 * The single swap point. When the Payoneer integration is ready, change this to
 * `payoneerProvider` (and nothing else in the checkout flow needs to change).
 */
export const paymentProvider: PaymentProvider = manualProvider;

export type { PaymentProvider, PaymentInitInput, PaymentInitResult } from "./types";
