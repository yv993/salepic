import Link from "next/link";
import { KeyRound } from "lucide-react";
import { Button } from "@/components/ui/button";

/** Shown on the auth routes when Clerk keys aren't configured. */
export function ClerkNotConfigured() {
  return (
    <div className="surface flex w-full max-w-sm flex-col items-center gap-4 rounded-2xl px-6 py-12 text-center">
      <span className="grid size-12 place-items-center rounded-full bg-muted text-muted-foreground">
        <KeyRound className="size-6" />
      </span>
      <div>
        <h1 className="font-heading text-xl font-semibold">Sign-in is off</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          The storefront runs with zero accounts. Authentication (for the studio
          admin) is disabled until real Clerk keys are added to{" "}
          <code className="rounded bg-muted px-1 py-0.5 text-xs">.env.local</code>.
        </p>
      </div>
      <Button variant="outline" render={<Link href="/" />}>
        Back to the store
      </Button>
    </div>
  );
}
