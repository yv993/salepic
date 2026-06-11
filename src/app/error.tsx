"use client";

import { useEffect } from "react";
import Link from "next/link";
import { RotateCcw, Home } from "lucide-react";
import { Button } from "@/components/ui/button";

/**
 * Route-level error boundary. Catches render/runtime errors in any route below
 * the root layout and offers a recovery (reset) without a full reload.
 */
export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Surfaced to the server logs; picked up by Sentry when a DSN is configured.
    console.error("Route error:", error);
  }, [error]);

  return (
    <div className="mx-auto flex min-h-[60vh] max-w-md flex-col items-center justify-center px-4 py-16 text-center">
      <p className="stamp-label text-primary">Something went sideways</p>
      <h1 className="mt-3 font-heading text-3xl font-bold tracking-tight sm:text-4xl">
        That didn&apos;t post.
      </h1>
      <p className="mt-3 text-muted-foreground">
        An unexpected error stopped this page from loading. You can try again —
        your cart is safe.
      </p>
      {error.digest && (
        <p className="mt-2 font-mono text-xs text-muted-foreground/70">
          Ref: {error.digest}
        </p>
      )}
      <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
        <Button onClick={reset}>
          <RotateCcw className="size-4" />
          Try again
        </Button>
        <Button variant="outline" render={<Link href="/" />}>
          <Home className="size-4" />
          Back home
        </Button>
      </div>
    </div>
  );
}
