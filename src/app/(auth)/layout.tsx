import { Suspense } from "react";
import Link from "next/link";
import { Brand } from "@/components/brand";
import { Skeleton } from "@/components/ui/skeleton";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="relative grid min-h-screen place-items-center overflow-hidden px-4 py-12">
      <div className="spotlight pointer-events-none absolute inset-x-0 top-0 h-[36rem]" />
      <div className="relative z-10 flex w-full max-w-md flex-col items-center gap-8">
        <Brand href="/" />
        {/* Clerk's <SignIn>/<SignUp> read request-time data, so they stream. */}
        <Suspense fallback={<Skeleton className="h-96 w-full max-w-sm rounded-2xl" />}>
          {children}
        </Suspense>
        <Link
          href="/"
          className="text-sm text-muted-foreground transition-colors hover:text-foreground"
        >
          ← Back to home
        </Link>
      </div>
    </div>
  );
}
