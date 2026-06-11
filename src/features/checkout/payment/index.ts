import { serverEnv } from "@/lib/env";
import type { PaymentProvider } from "./types";
import { manualProvider } from "./manual-provider";
import { payoneerProvider } from "./payoneer-provider";

/**
 * The single swap point — driven by env so NO code change is needed to go live:
 * set PAYMENT_PROVIDER=payoneer AND PAYONEER_API_KEY to activate Payoneer.
 * Until then (or if the key is missing) the manual pending-payment flow runs,
 * so the build + checkout work with zero external accounts.
 */
const env = serverEnv();
export const paymentProvider: PaymentProvider =
  env.PAYMENT_PROVIDER === "payoneer" && env.PAYONEER_API_KEY
    ? payoneerProvider
    : manualProvider;

export type { PaymentProvider, PaymentInitInput, PaymentInitResult } from "./types";
