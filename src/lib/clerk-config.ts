/**
 * Whether real Clerk keys are configured. The repo ships with Clerk's example
 * placeholder publishable key, which would crash <ClerkProvider> on the client,
 * so when it's absent or still the placeholder we run the app WITHOUT Clerk:
 * the public storefront works fully and /admin shows the "configure" state.
 *
 * Safe in every runtime (Node, Edge middleware, client) — it only reads the
 * inlined NEXT_PUBLIC_ env var, no `server-only` import.
 */

/** Clerk's documented example publishable key prefix. */
const PLACEHOLDER_PREFIX = "pk_test_ZXhhbXBsZS5j";

export function isClerkConfigured(): boolean {
  const pk = process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY?.trim();
  return Boolean(pk) && !pk!.startsWith(PLACEHOLDER_PREFIX);
}
