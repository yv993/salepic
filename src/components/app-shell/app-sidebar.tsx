"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { UserButton, useUser } from "@clerk/nextjs";
import { UserRound } from "lucide-react";
import { Brand } from "@/components/brand";
import { cn } from "@/lib/utils";
import { isClerkConfigured } from "@/lib/clerk-config";
import { NAV_ITEMS, STORE_LINK } from "./nav";

const CLERK_ON = isClerkConfigured();

export function AppSidebar({ onNavigate }: { onNavigate?: () => void }) {
  const pathname = usePathname();

  return (
    <div className="flex h-full flex-col gap-6 p-5">
      <Link href="/admin" onClick={onNavigate} className="px-1 py-1">
        <Brand />
      </Link>

      <nav className="flex flex-1 flex-col gap-1">
        {NAV_ITEMS.map((item) => {
          const active = item.exact
            ? pathname === item.href
            : pathname === item.href || pathname.startsWith(`${item.href}/`);
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={onNavigate}
              aria-current={active ? "page" : undefined}
              className={cn(
                "group relative flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                active
                  ? "bg-primary/10 text-primary"
                  : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-foreground",
              )}
            >
              {active && (
                <span className="absolute left-0 top-1/2 h-5 w-0.5 -translate-y-1/2 rounded-full bg-primary" />
              )}
              <Icon className="size-[18px] shrink-0" />
              {item.label}
            </Link>
          );
        })}

        <div className="my-2 h-px bg-sidebar-border" />

        <Link
          href={STORE_LINK.href}
          onClick={onNavigate}
          className="group flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-sidebar-foreground transition-colors hover:bg-sidebar-accent hover:text-foreground"
        >
          <STORE_LINK.icon className="size-[18px] shrink-0" />
          {STORE_LINK.label}
        </Link>
      </nav>

      {CLERK_ON ? <ClerkUserCard /> : <LocalUserCard />}
    </div>
  );
}

function ClerkUserCard() {
  const { user } = useUser();
  return (
    <div className="flex items-center gap-3 rounded-xl border border-sidebar-border bg-sidebar-accent/40 p-3">
      <UserButton />
      <div className="min-w-0 text-sm leading-tight">
        <p className="truncate font-medium text-foreground">
          {user?.fullName ?? user?.username ?? "Studio account"}
        </p>
        <p className="truncate text-xs text-muted-foreground">
          {user?.primaryEmailAddress?.emailAddress ?? "Manage profile"}
        </p>
      </div>
    </div>
  );
}

/** Shown when Clerk isn't configured — avoids calling Clerk hooks/components. */
function LocalUserCard() {
  return (
    <div className="flex items-center gap-3 rounded-xl border border-sidebar-border bg-sidebar-accent/40 p-3">
      <span className="grid size-8 shrink-0 place-items-center rounded-full bg-primary/15 text-primary">
        <UserRound className="size-4" />
      </span>
      <div className="min-w-0 text-sm leading-tight">
        <p className="truncate font-medium text-foreground">Studio</p>
        <p className="truncate text-xs text-muted-foreground">
          Clerk not configured
        </p>
      </div>
    </div>
  );
}
