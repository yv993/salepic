"use client";

import { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "motion/react";
import { Menu, X } from "lucide-react";
import { Brand } from "@/components/brand";
import { ThemeToggle } from "@/components/theme-toggle";

const LINKS = [
  { href: "/postcards", label: "Shop" },
  { href: "/postcards?category=travel", label: "Travel" },
  { href: "/postcards?category=nature", label: "Nature" },
  { href: "/postcards?category=city", label: "City" },
  { href: "/about", label: "About" },
];

/**
 * Storefront top bar. A static client component (no runtime data reads) so it
 * prerenders into the shell on every route, including dynamic ones. The dynamic
 * cart count is passed in as `cartSlot` (a server <Suspense> boundary).
 */
export function StoreNav({ cartSlot }: { cartSlot: React.ReactNode }) {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 border-b border-border/70 bg-background/80 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-4 px-4 sm:px-6">
        <Brand href="/" />

        <nav className="hidden items-center gap-6 md:flex">
          {LINKS.map((l) => (
            <Link
              key={l.label}
              href={l.href}
              className="link-underline py-1 text-sm font-medium text-foreground/70 transition-colors hover:text-foreground"
            >
              {l.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-1">
          <ThemeToggle />
          {cartSlot}
          <button
            type="button"
            aria-label="Open menu"
            onClick={() => setOpen(true)}
            className="grid size-9 place-items-center rounded-lg text-foreground/80 transition-colors hover:bg-muted md:hidden"
          >
            <Menu className="size-5" />
          </button>
        </div>
      </div>

      <AnimatePresence>
        {open && (
          <motion.div
            className="fixed inset-0 z-50 bg-background px-6 pt-6 md:hidden"
            initial={{ opacity: 0, x: "100%" }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: "100%" }}
            transition={{ type: "spring", damping: 26, stiffness: 280 }}
          >
            <div className="flex items-center justify-between">
              <Brand href="/" />
              <button
                type="button"
                aria-label="Close menu"
                onClick={() => setOpen(false)}
                className="grid size-9 place-items-center rounded-lg text-foreground/80 hover:bg-muted"
              >
                <X className="size-5" />
              </button>
            </div>
            <nav className="mt-10 flex flex-col gap-1">
              {LINKS.map((l, i) => (
                <motion.div
                  key={l.label}
                  initial={{ opacity: 0, x: 16 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.05 + 0.05 }}
                >
                  <Link
                    href={l.href}
                    onClick={() => setOpen(false)}
                    className="block rounded-lg px-3 py-3 font-heading text-2xl font-semibold hover:text-primary"
                  >
                    {l.label}
                  </Link>
                </motion.div>
              ))}
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
