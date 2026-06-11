import "server-only";
import { serverEnv } from "@/lib/env";

/**
 * Transactional email via Resend's REST API (no SDK dependency). When
 * RESEND_API_KEY is unset it logs and skips — checkout/contact never fail
 * because of email. Activates automatically once the key is added.
 */
type SendArgs = { to: string; subject: string; html: string };

async function sendEmail({ to, subject, html }: SendArgs): Promise<{ sent: boolean }> {
  const env = serverEnv();
  const key = env.RESEND_API_KEY;
  const from = env.EMAIL_FROM || "Posted. <onboarding@resend.dev>";
  if (!key) {
    console.info(`[email] skipped (no RESEND_API_KEY) → ${to}: ${subject}`);
    return { sent: false };
  }
  try {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${key}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ from, to, subject, html }),
    });
    if (!res.ok) {
      console.error("[email] send failed", res.status, await res.text().catch(() => ""));
      return { sent: false };
    }
    return { sent: true };
  } catch (err) {
    console.error("[email] error", err);
    return { sent: false };
  }
}

const money = (cents: number, currency: string) =>
  new Intl.NumberFormat("en", { style: "currency", currency }).format(cents / 100);

function shell(title: string, body: string): string {
  return `<!doctype html><html><body style="margin:0;background:#f4eee1;font-family:ui-sans-serif,system-ui,Arial,sans-serif;color:#231a10">
  <div style="max-width:560px;margin:0 auto;padding:32px 20px">
    <div style="font-family:Georgia,serif;font-size:22px;font-weight:700;color:#a83c22">Posted.</div>
    <div style="background:#fffefb;border:1px solid #e4d7bf;border-radius:16px;padding:24px;margin-top:16px">
      <h1 style="font-family:Georgia,serif;font-size:22px;margin:0 0 12px">${title}</h1>
      ${body}
    </div>
    <p style="color:#655647;font-size:12px;margin-top:16px">Original postcard art by Tatevik Papyan.</p>
  </div></body></html>`;
}

export type OrderEmailInput = {
  orderNumber: string;
  buyerName: string;
  buyerEmail: string;
  totalCents: number;
  currency: string;
  items: { title: string; qty: number; lineTotalCents: number }[];
};

export async function sendOrderConfirmation(o: OrderEmailInput) {
  const rows = o.items
    .map(
      (i) =>
        `<tr><td style="padding:6px 0;border-bottom:1px solid #eee">${i.title} × ${i.qty}</td><td align="right" style="padding:6px 0;border-bottom:1px solid #eee">${money(i.lineTotalCents, o.currency)}</td></tr>`,
    )
    .join("");
  const html = shell(
    `Thank you, ${o.buyerName.split(" ")[0]}!`,
    `<p style="color:#655647">We've received your order <strong>${o.orderNumber}</strong>. Here's what's coming:</p>
     <table style="width:100%;border-collapse:collapse;font-size:14px;margin:12px 0">${rows}
     <tr><td style="padding:10px 0;font-weight:700">Total</td><td align="right" style="padding:10px 0;font-weight:700">${money(o.totalCents, o.currency)}</td></tr></table>
     <p style="color:#655647">We'll email tracking when it ships. You can also track it anytime with your order number + email.</p>`,
  );
  return sendEmail({
    to: o.buyerEmail,
    subject: `Your Posted. order ${o.orderNumber}`,
    html,
  });
}
