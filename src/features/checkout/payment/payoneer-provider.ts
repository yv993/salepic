import { createHmac, timingSafeEqual } from "node:crypto";
import { serverEnv } from "@/lib/env";
import type { PaymentProvider } from "./types";

/**
 * Payoneer provider on the PaymentProvider abstraction.
 *
 * Selected automatically when PAYMENT_PROVIDER=payoneer + PAYONEER_API_KEY are
 * set (see ./index.ts). The webhook route (/api/payments/payoneer/webhook)
 * calls verifyCallback and flips the order to paid.
 *
 * NOTE: the exact request/response field names follow Payoneer's "Request a
 * Payment" shape and may need a small tweak once real API docs/credentials are
 * provided — the WIRING (selection, init, webhook, order flip, signature
 * verification) is complete. initiatePayment fails safe: any error falls back
 * to a pending order with instructions, so checkout never breaks.
 */
export const payoneerProvider: PaymentProvider = {
  id: "payoneer",

  async initiatePayment(input) {
    const env = serverEnv();
    const base = env.PAYONEER_API_BASE || "https://api.payoneer.com";
    const key = env.PAYONEER_API_KEY;
    if (!key) {
      return {
        provider: "payoneer",
        status: "pending_payment",
        instructions: "A secure payment link is on its way.",
      };
    }
    try {
      const res = await fetch(`${base}/v4/payment-requests`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${key}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          amount: (input.amountCents / 100).toFixed(2),
          currency: input.currency,
          client_reference_id: input.orderNumber,
          description: `Posted. order ${input.orderNumber}`,
          payer: { name: input.buyerName, email: input.buyerEmail },
        }),
      });
      if (!res.ok) throw new Error(`Payoneer ${res.status}`);
      const data = (await res.json()) as {
        id?: string;
        payment_request_id?: string;
        checkout_url?: string;
        hosted_url?: string;
      };
      return {
        provider: "payoneer",
        status: "pending_payment",
        paymentReference: data.id ?? data.payment_request_id,
        paymentLink: data.checkout_url ?? data.hosted_url,
        instructions: "Use the secure link to complete your payment.",
      };
    } catch (err) {
      console.error("[payoneer] initiatePayment failed — falling back:", err);
      return {
        provider: "payoneer",
        status: "pending_payment",
        instructions:
          "We couldn't open the payment session automatically — a secure link will follow by email.",
      };
    }
  },

  async verifyCallback(payload, signature) {
    const env = serverEnv();
    const secret = env.PAYONEER_WEBHOOK_SECRET;
    if (!secret) throw new Error("PAYONEER_WEBHOOK_SECRET is not set");

    // Verify HMAC-SHA256 of the raw body against the provider signature header.
    const raw = typeof payload === "string" ? payload : JSON.stringify(payload);
    const expected = createHmac("sha256", secret).update(raw).digest("hex");
    const got = (signature ?? "").replace(/^sha256=/, "");
    const a = Buffer.from(expected);
    const b = Buffer.from(got);
    if (a.length !== b.length || !timingSafeEqual(a, b)) {
      throw new Error("Invalid webhook signature");
    }

    const body = (
      typeof payload === "string" ? JSON.parse(payload) : payload
    ) as { client_reference_id?: string; order_number?: string; status?: string };
    const orderNumber = body.client_reference_id ?? body.order_number ?? "";
    const paid = ["paid", "completed", "succeeded", "approved"].includes(
      (body.status ?? "").toLowerCase(),
    );
    return { orderNumber, paid };
  },
};
