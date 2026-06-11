import "server-only";
import { z } from "zod";

/**
 * Server-only environment variables, validated lazily.
 *
 * We validate on first access (not at import time) so that `next build` and
 * static rendering don't fail when secrets are absent — the values are only
 * needed at request time by the DB and admin/payment features.
 *
 * `ADMIN_EMAILS` and the payment provider keys are OPTIONAL so the build (and
 * the public storefront) work without them; admin/payment code reads them
 * defensively at request time.
 */
const serverEnvSchema = z.object({
  // Optional: when empty/local, the DB layer falls back to a local PGlite
  // database (see src/db/connect.ts), so the app runs with zero external
  // accounts. Set a real Neon pooled URL to use Postgres.
  DATABASE_URL: z.string().optional().default(""),

  /** Comma-separated allowlist of admin emails (matched against the Clerk user). */
  ADMIN_EMAILS: z.string().optional().default(""),

  /** Which payment provider to use. "manual" is the only one wired today. */
  PAYMENT_PROVIDER: z.enum(["manual", "payoneer"]).optional().default("manual"),
  PAYONEER_API_KEY: z.string().optional(),
  PAYONEER_API_BASE: z.string().optional(),
  PAYONEER_WEBHOOK_SECRET: z.string().optional(),

  /** Transactional email (Resend). Unset → emails are logged + skipped. */
  RESEND_API_KEY: z.string().optional(),
  EMAIL_FROM: z.string().optional(),

  /** Error monitoring (Sentry). Unset → no-op. */
  SENTRY_DSN: z.string().optional(),

  /** Canonical site origin for absolute URLs (SEO/OG). */
  SITE_URL: z.string().optional(),
});

/** Canonical site origin (no trailing slash). Falls back to the demo origin. */
export function siteUrl(): string {
  const raw =
    process.env.SITE_URL || process.env.NEXT_PUBLIC_SITE_URL || "https://posted.example";
  return raw.replace(/\/$/, "");
}

type ServerEnv = z.infer<typeof serverEnvSchema>;

let cached: ServerEnv | null = null;

export function serverEnv(): ServerEnv {
  if (cached) return cached;
  const parsed = serverEnvSchema.safeParse(process.env);
  if (!parsed.success) {
    const issues = parsed.error.issues
      .map((i) => `  - ${i.path.join(".")}: ${i.message}`)
      .join("\n");
    throw new Error(
      `Invalid or missing server environment variables:\n${issues}\n\n` +
        `Add them to .env.local (see .env.example).`,
    );
  }
  cached = parsed.data;
  return cached;
}

/** Parsed, lowercased set of allowlisted admin emails. */
export function adminEmails(): Set<string> {
  return new Set(
    serverEnv()
      .ADMIN_EMAILS.split(",")
      .map((e) => e.trim().toLowerCase())
      .filter(Boolean),
  );
}
