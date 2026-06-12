"use client";

import Link from "next/link";
import { UserRound } from "lucide-react";
import { useUser, UserButton } from "@clerk/nextjs";
import { isClerkConfigured } from "@/lib/clerk-config";

const CLERK = isClerkConfigured();

/**
 * Header account control. With Clerk configured: "Sign in" when logged out, an
 * account link + the Clerk <UserButton> when logged in. Without Clerk, a plain
 * account link (the /account page shows the configure/sign-in state) so the
 * build + storefront work with no keys. Clerk hooks only run when configured
 * (the inner component is rendered solely in that branch).
 */
export function AccountMenu() {
  if (!CLERK) {
    return (
      <Link
        href="/account"
        aria-label="Account"
        className="grid size-9 place-items-center rounded-lg text-foreground/80 transition-colors hover:bg-muted hover:text-foreground"
      >
        <UserRound className="size-5" />
      </Link>
    );
  }
  return <ClerkAccountMenu />;
}

function ClerkAccountMenu() {
  const { isSignedIn } = useUser();

  if (!isSignedIn) {
    return (
      <Link
        href="/sign-in?redirect_url=/account"
        className="rounded-lg px-3 py-1.5 text-sm font-medium text-foreground/80 transition-colors hover:text-foreground"
      >
        Sign in
      </Link>
    );
  }

  return (
    <>
      <Link
        href="/account"
        aria-label="Your account"
        className="grid size-9 place-items-center rounded-lg text-foreground/80 transition-colors hover:bg-muted hover:text-foreground"
      >
        <UserRound className="size-5" />
      </Link>
      <UserButton />
    </>
  );
}
