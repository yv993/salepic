import { Suspense } from "react";
import Link from "next/link";
import { Lock, UserRound } from "lucide-react";
import { isClerkConfigured } from "@/lib/clerk-config";
import { getBuyer } from "@/lib/auth";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { AccountTabs } from "@/components/account/account-tabs";

/**
 * Buyer account shell. The auth read lives inside <Suspense> (so the route is
 * dynamic, never statically prerendered, and we never read uncached data
 * outside a boundary). Guest checkout is unaffected — this only gates /account.
 */
export default function AccountLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <Suspense fallback={<AccountFallback />}>
      <AccountShell>{children}</AccountShell>
    </Suspense>
  );
}

async function AccountShell({ children }: { children: React.ReactNode }) {
  const clerkOn = isClerkConfigured();
  const buyer = clerkOn ? await getBuyer() : null;

  if (!clerkOn || !buyer) {
    return (
      <div className="mx-auto max-w-md px-4 py-20 text-center sm:px-6">
        <span className="mx-auto grid size-12 place-items-center rounded-full bg-muted text-primary">
          <Lock className="size-6" />
        </span>
        <h1 className="mt-4 font-heading text-2xl font-bold tracking-tight">
          {clerkOn ? "Sign in to your account" : "Accounts need Clerk"}
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          {clerkOn
            ? "Track orders, save addresses, and keep a wishlist — or keep checking out as a guest."
            : "Add Clerk keys to .env.local to enable buyer accounts. Guest checkout works without them."}
        </p>
        {clerkOn && (
          <div className="mt-6 flex justify-center gap-3">
            <Button render={<Link href="/sign-in?redirect_url=/account" />}>
              Sign in
            </Button>
            <Button variant="outline" render={<Link href="/sign-up?redirect_url=/account" />}>
              Create account
            </Button>
          </div>
        )}
      </div>
    );
  }

  const firstName = buyer.name.split(" ")[0] || "there";

  return (
    <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
      <header className="mb-8 flex items-center gap-3">
        <span className="grid size-11 place-items-center rounded-full bg-primary/12 text-primary ring-1 ring-primary/25">
          <UserRound className="size-5" />
        </span>
        <div>
          <p className="stamp-label text-primary">Your account</p>
          <h1 className="font-heading text-2xl font-bold tracking-tight sm:text-3xl">
            Hello, {firstName}
          </h1>
        </div>
      </header>
      <AccountTabs />
      <div className="mt-8">{children}</div>
    </div>
  );
}

function AccountFallback() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
      <Skeleton className="h-9 w-48" />
      <Skeleton className="mt-6 h-10 w-full max-w-md" />
      <Skeleton className="mt-8 h-48 w-full rounded-2xl" />
    </div>
  );
}
