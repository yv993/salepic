import { NextResponse } from "next/server";
import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { isClerkConfigured } from "@/lib/clerk-config";

/**
 * The storefront is public. Only the admin dashboard requires authentication.
 * Admin queries/actions additionally enforce the email allowlist via
 * requireAdmin() — middleware just gates the route.
 *
 * When Clerk isn't configured (placeholder/missing keys) we skip Clerk entirely
 * so the store works with zero accounts; /admin then renders its "configure
 * Clerk" / forbidden state instead of crashing.
 */
const isProtectedRoute = createRouteMatcher(["/admin(.*)", "/account(.*)"]);

const clerk = clerkMiddleware(async (auth, req) => {
  if (isProtectedRoute(req)) {
    await auth.protect();
  }
});

export default isClerkConfigured() ? clerk : () => NextResponse.next();

export const config = {
  matcher: [
    // Skip Next.js internals and static files, unless referenced in search params.
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    // Always run for API routes.
    "/(api|trpc)(.*)",
  ],
};
