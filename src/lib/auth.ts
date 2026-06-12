import "server-only";
import { adminEmails } from "@/lib/env";

/**
 * Returns the authenticated Clerk user id, or throws.
 *
 * Route protection happens in middleware; this is the per-query/-action guard.
 */
export async function requireUserId(): Promise<string> {
  const { auth } = await import("@clerk/nextjs/server");
  const { userId } = await auth();
  if (!userId) {
    throw new Error("Unauthorized: no authenticated user");
  }
  return userId;
}

/**
 * Guards admin-only queries and Server Actions.
 *
 * Server Actions are reachable by direct POST, so this MUST be called inside
 * every admin query and action — middleware alone is not enough. Checks the
 * signed-in Clerk user's verified email against the ADMIN_EMAILS allowlist.
 *
 * When Clerk isn't configured, Clerk's currentUser() throws ("clerkMiddleware
 * not detected"); isAdmin() catches it and the admin UI shows the
 * "configure Clerk" state. (Accessing Clerk here also lets Next defer admin
 * pages to dynamic during prerender instead of erroring the build.)
 */
export async function requireAdmin(): Promise<{ userId: string; email: string }> {
  const { currentUser } = await import("@clerk/nextjs/server");
  const user = await currentUser();
  if (!user) throw new Error("Unauthorized: no authenticated user");

  const allow = adminEmails();
  if (allow.size === 0) {
    throw new Error(
      "Forbidden: no admin emails configured (set ADMIN_EMAILS in the environment)",
    );
  }

  const emails = user.emailAddresses.map((e) => e.emailAddress.toLowerCase());
  const match = emails.find((e) => allow.has(e));
  if (!match) {
    throw new Error("Forbidden: not an admin");
  }

  return { userId: user.id, email: match };
}

/** Non-throwing variant for conditional UI (e.g. showing an admin link). */
export async function isAdmin(): Promise<boolean> {
  try {
    await requireAdmin();
    return true;
  } catch {
    return false;
  }
}

export type Buyer = { userId: string; email: string; name: string };

/**
 * The signed-in buyer (any authenticated Clerk user), or null. Non-throwing —
 * returns null when signed out OR when Clerk isn't configured. Read OUTSIDE
 * `use cache`. Powers the /account area + checkout prefill.
 */
export async function getBuyer(): Promise<Buyer | null> {
  try {
    const { currentUser } = await import("@clerk/nextjs/server");
    const user = await currentUser();
    if (!user) return null;
    const email =
      user.emailAddresses.find((e) => e.id === user.primaryEmailAddressId)
        ?.emailAddress ?? user.emailAddresses[0]?.emailAddress;
    if (!email) return null;
    const name =
      [user.firstName, user.lastName].filter(Boolean).join(" ") ||
      user.username ||
      "";
    return { userId: user.id, email, name };
  } catch {
    return null;
  }
}
