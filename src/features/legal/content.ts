/**
 * Legal / trust copy for the storefront. Tailored to a small independent
 * illustrated-postcard studio. Business-specific details are marked
 * [PLACEHOLDER: …] — fill these in before going live.
 */
export type LegalDoc = {
  slug: string;
  title: string;
  description: string;
  updated: string;
  intro: string;
  sections: { heading: string; body: string[] }[];
};

const COMPANY = "Posted. (sole trader: [PLACEHOLDER: legal name / business])";
const CONTACT = "[PLACEHOLDER: hello@yourdomain.com]";
const JURISDICTION = "[PLACEHOLDER: country / state of jurisdiction]";

export const LEGAL_DOCS: Record<string, LegalDoc> = {
  privacy: {
    slug: "privacy",
    title: "Privacy Policy",
    description:
      "How Posted. collects, uses, and protects your personal information.",
    updated: "2026-06-11",
    intro: `This policy explains what ${COMPANY} ("we") collects when you use this store, why, and your rights. Questions: ${CONTACT}.`,
    sections: [
      {
        heading: "What we collect",
        body: [
          "Order details you provide at checkout: name, email, and shipping address. We never see or store full card numbers — payments are handled by our payment processor.",
          "If you sign in (optional, for reviews), your account is managed by our authentication provider (Clerk); we store only your user id, display name, and verified email.",
          "Basic, privacy-friendly analytics (aggregate page views) when enabled — no cross-site tracking, no advertising cookies.",
        ],
      },
      {
        heading: "How we use it",
        body: [
          "To process and ship your order, send order confirmations, and respond to support requests.",
          "To show verified-buyer reviews you choose to submit.",
          "We do not sell your personal information.",
        ],
      },
      {
        heading: "Retention & your rights",
        body: [
          "Order records are kept for accounting and warranty purposes for [PLACEHOLDER: retention period].",
          `You may request access, correction, or deletion of your data by emailing ${CONTACT}. We respond within [PLACEHOLDER: e.g. 30 days].`,
          `This service is operated from ${JURISDICTION}; data may be processed by our hosting, database, email, and payment providers.`,
        ],
      },
    ],
  },
  terms: {
    slug: "terms",
    title: "Terms of Service",
    description: "The terms that govern your use of the Posted. store.",
    updated: "2026-06-11",
    intro: `By using this store you agree to these terms with ${COMPANY}.`,
    sections: [
      {
        heading: "Orders & pricing",
        body: [
          "All prices are shown in the currency at checkout and include applicable taxes where stated. Shipping is calculated at checkout.",
          "We reserve the right to cancel and refund an order if an item is mispriced or unavailable.",
          "Artwork is original to the studio; reproduction or resale of the prints for commercial purposes is not permitted without written permission.",
        ],
      },
      {
        heading: "Acceptable use",
        body: [
          "Reviews must be honest and relate to a verified purchase. We may remove content that is unlawful, abusive, or spam.",
          "Don't attempt to disrupt, scrape, or misuse the service.",
        ],
      },
      {
        heading: "Liability",
        body: [
          "The store is provided “as is” to the extent permitted by law. Our liability for any order is limited to the amount you paid for it.",
          `These terms are governed by the laws of ${JURISDICTION}.`,
        ],
      },
    ],
  },
  refunds: {
    slug: "refunds",
    title: "Refunds & Returns",
    description: "Our returns, replacement, and refund policy.",
    updated: "2026-06-11",
    intro:
      "We want you to love your postcards. If something isn't right, here's how we make it good.",
    sections: [
      {
        heading: "Damaged or wrong items",
        body: [
          "If a card arrives damaged or we sent the wrong item, email us within 14 days with a photo and we'll send a free replacement or full refund — no need to return it.",
        ],
      },
      {
        heading: "Change of mind",
        body: [
          "Unused items in original condition can be returned within [PLACEHOLDER: 30] days for a refund of the item price (return shipping is the buyer's responsibility).",
          "Personalised or custom orders are non-refundable unless faulty.",
        ],
      },
      {
        heading: "How to start a return",
        body: [
          `Email ${CONTACT} with your order number (e.g. PC-XXXXXX). Refunds are issued to your original payment method within [PLACEHOLDER: 5–10] business days of approval.`,
        ],
      },
    ],
  },
  shipping: {
    slug: "shipping",
    title: "Shipping",
    description: "Where we ship, how long it takes, and what it costs.",
    updated: "2026-06-11",
    intro: "Every order is packed flat in a rigid mailer to keep corners crisp.",
    sections: [
      {
        heading: "Processing & delivery",
        body: [
          "Orders are typically dispatched within 2 business days. Estimated delivery: [PLACEHOLDER: domestic 3–5 days, international 7–21 days].",
          "Tracking is provided where available. Delays in the postal network are outside our control.",
        ],
      },
      {
        heading: "Rates",
        body: [
          "Flat-rate shipping is shown at checkout and calculated from your cart total. Orders above the threshold shown in the cart ship free.",
          "Import duties or taxes for international orders are the recipient's responsibility.",
        ],
      },
    ],
  },
  cookies: {
    slug: "cookies",
    title: "Cookie Policy",
    description: "The small set of cookies and local storage this store uses.",
    updated: "2026-06-11",
    intro:
      "We keep cookies to a minimum — only what's needed to run the store and remember your preferences.",
    sections: [
      {
        heading: "Essential",
        body: [
          "Cart contents and (if you sign in) your authentication session. These are required for the store to function and don't need consent.",
        ],
      },
      {
        heading: "Preferences",
        body: [
          "Your theme (light/dark), wishlist favourites, and your cookie-consent choice are stored locally in your browser.",
        ],
      },
      {
        heading: "Analytics",
        body: [
          "If enabled, privacy-friendly analytics count aggregate page views without cross-site tracking or advertising identifiers. You can decline via the cookie banner.",
        ],
      },
    ],
  },
};

export const LEGAL_SLUGS = Object.keys(LEGAL_DOCS);
export const LEGAL_NAV = LEGAL_SLUGS.map((s) => ({
  slug: s,
  title: LEGAL_DOCS[s].title,
}));
