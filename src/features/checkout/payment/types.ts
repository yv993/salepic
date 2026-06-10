import type { PaymentProviderId } from "@/db/schema";

export interface PaymentInitInput {
  orderId: string;
  orderNumber: string;
  amountCents: number;
  currency: string;
  buyerName: string;
  buyerEmail: string;
}

export interface PaymentInitResult {
  provider: PaymentProviderId;
  status: "pending_payment";
  /** Provider-side reference (e.g. a Payoneer payment request id). */
  paymentReference?: string;
  /** A hosted checkout / pay link to send the buyer to, if any. */
  paymentLink?: string;
  /** Human-readable next steps shown on the confirmation page. */
  instructions?: string;
}

export interface PaymentProvider {
  readonly id: PaymentProviderId;
  initiatePayment(input: PaymentInitInput): Promise<PaymentInitResult>;
  /** Verify an inbound webhook payload (implemented per provider). */
  verifyCallback?(
    payload: unknown,
    signature?: string,
  ): Promise<{ orderNumber: string; paid: boolean }>;
}
