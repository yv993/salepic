"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { SignOutButton } from "@clerk/nextjs";
import { LogOut } from "lucide-react";
import { cn } from "@/lib/utils";

const TABS = [
  { href: "/account", label: "Overview", match: "/account" },
  { href: "/account/wishlist", label: "Wishlist", match: "/account/wishlist" },
  { href: "/account/addresses", label: "Addresses", match: "/account/addresses" },
  { href: "/account/reviews", label: "Reviews", match: "/account/reviews" },
];

/** Account section tabs (the /account subtree is always dynamic, so reading the
 *  path on the client here is safe). */
export function AccountTabs() {
  const [path, setPath] = useState("/account");
  useEffect(() => {
    const sync = () => setPath(window.location.pathname);
    sync();
    window.addEventListener("popstate", sync);
    const id = window.setInterval(sync, 400);
    return () => {
      window.removeEventListener("popstate", sync);
      window.clearInterval(id);
    };
  }, []);

  const isActive = (m: string) =>
    m === "/account" ? path === "/account" : path.startsWith(m);

  return (
    <div className="flex flex-wrap items-center gap-2 border-b border-border/70 pb-3">
      {TABS.map((t) => (
        <Link
          key={t.href}
          href={t.href}
          aria-current={isActive(t.match) ? "page" : undefined}
          className={cn(
            "rounded-full px-4 py-1.5 text-sm font-medium transition-colors",
            isActive(t.match)
              ? "bg-primary text-primary-foreground"
              : "text-foreground/70 hover:bg-muted hover:text-foreground",
          )}
        >
          {t.label}
        </Link>
      ))}
      <SignOutButton>
        <button
          type="button"
          className="ml-auto inline-flex items-center gap-1.5 rounded-full px-4 py-1.5 text-sm font-medium text-foreground/70 transition-colors hover:bg-muted hover:text-foreground"
        >
          <LogOut className="size-4" />
          Sign out
        </button>
      </SignOutButton>
    </div>
  );
}
