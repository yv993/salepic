import { Suspense } from "react";
import Link from "next/link";
import { Lock } from "lucide-react";
import { AppSidebar } from "@/components/app-shell/app-sidebar";
import { AppHeader } from "@/components/app-shell/app-header";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { isAdmin } from "@/lib/auth";
import { isClerkConfigured } from "@/lib/clerk-config";

/**
 * Admin shell. Middleware already requires authentication for /admin(.*);
 * this layout additionally enforces the email allowlist (defence in depth —
 * every admin query/action re-checks too).
 *
 * The whole shell is dynamic: the auth gate reads runtime user data, and the
 * nav reads usePathname (request-time on dynamic routes). So it all lives
 * inside one <Suspense> — admin pages are auth-gated and never prerendered.
 */
export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <Suspense fallback={<ShellFallback />}>
      <AdminShell>{children}</AdminShell>
    </Suspense>
  );
}

async function AdminShell({ children }: { children: React.ReactNode }) {
  const clerkOn = isClerkConfigured();
  const ok = clerkOn && (await isAdmin());
  return (
    <div className="grid min-h-screen lg:grid-cols-[280px_1fr]">
      <aside className="sticky top-0 hidden h-screen border-r border-sidebar-border bg-sidebar lg:block">
        <AppSidebar />
      </aside>
      <div className="flex min-h-screen flex-col">
        <AppHeader />
        <main id="main-content" className="flex-1 px-4 py-6 lg:px-8 lg:py-8">
          {ok ? children : <Forbidden clerkConfigured={clerkOn} />}
        </main>
      </div>
    </div>
  );
}

function ShellFallback() {
  return (
    <div className="grid min-h-screen lg:grid-cols-[280px_1fr]">
      <aside className="hidden border-r border-sidebar-border bg-sidebar lg:block" />
      <div className="flex min-h-screen flex-col">
        <div className="h-16 border-b border-border" />
        <main id="main-content" className="flex-1 px-4 py-6 lg:px-8 lg:py-8">
          <Skeleton className="h-9 w-56" />
          <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <Skeleton key={i} className="h-28 rounded-2xl" />
            ))}
          </div>
        </main>
      </div>
    </div>
  );
}

function Forbidden({ clerkConfigured }: { clerkConfigured: boolean }) {
  return (
    <div className="mx-auto flex max-w-md flex-col items-center gap-4 rounded-2xl border border-border bg-card px-6 py-16 text-center">
      <span className="grid size-12 place-items-center rounded-full bg-muted text-muted-foreground">
        <Lock className="size-6" />
      </span>
      {clerkConfigured ? (
        <div>
          <h1 className="font-heading text-xl font-semibold">No studio access</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            You&apos;re signed in, but this account isn&apos;t on the admin
            allowlist. Ask the studio owner to add your email to
            <code className="mx-1 rounded bg-muted px-1 py-0.5 text-xs">
              ADMIN_EMAILS
            </code>
            .
          </p>
        </div>
      ) : (
        <div>
          <h1 className="font-heading text-xl font-semibold">
            Admin needs Clerk
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            The storefront runs without accounts, but the studio dashboard needs
            authentication. Add real Clerk keys and your email to
            <code className="mx-1 rounded bg-muted px-1 py-0.5 text-xs">
              ADMIN_EMAILS
            </code>
            in <code className="rounded bg-muted px-1 py-0.5 text-xs">.env.local</code>.
          </p>
        </div>
      )}
      <Button variant="outline" render={<Link href="/" />}>
        Back to the store
      </Button>
    </div>
  );
}
