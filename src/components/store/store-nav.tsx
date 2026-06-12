"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  motion,
  AnimatePresence,
  useScroll,
  useMotionValueEvent,
  useReducedMotion,
} from "motion/react";
import { Menu, X, ChevronDown, ArrowUpRight } from "lucide-react";
import { Brand } from "@/components/brand";
import { ThemeToggle } from "@/components/theme-toggle";
import { cn } from "@/lib/utils";
import { CATEGORY_ORDER, CATEGORY_META } from "@/features/products/constants";
import { COLLECTIONS } from "@/features/collections/data";
import { SearchDialog, type SearchItem } from "./search-dialog";
import { WishlistBadge } from "./wishlist-badge";
import { AccountMenu } from "./account-menu";

const LINKS = [
  { href: "/postcards", label: "Shop", match: "/postcards" },
  { href: "/journal", label: "Journal", match: "/journal" },
  { href: "/about", label: "About", match: "/about" },
];

/**
 * State-aware sticky storefront nav: transparent at the top, solid + shadowed
 * once scrolled (no height change → no CLS). Active-route highlighting and a
 * collections/categories mega-menu on desktop. All motion reduced-motion gated.
 * The dynamic cart count streams in via `cartSlot` (a server <Suspense>).
 */
export function StoreNav({
  cartSlot,
  searchProducts = [],
}: {
  cartSlot: React.ReactNode;
  searchProducts?: SearchItem[];
}) {
  const [open, setOpen] = useState(false);
  const [menu, setMenu] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const reduce = useReducedMotion();
  const { scrollY } = useScroll();
  useMotionValueEvent(scrollY, "change", (y) => setScrolled(y > 8));

  return (
    <header
      className={cn(
        "sticky top-0 z-40 transition-[background-color,box-shadow,border-color] duration-300",
        scrolled
          ? "border-b border-border/70 bg-background/90 shadow-2 backdrop-blur-md"
          : "border-b border-transparent bg-background/50 backdrop-blur-sm",
      )}
    >
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-4 px-4 sm:px-6">
        <Brand href="/" />

        <nav className="hidden items-center gap-1 md:flex">
          <NavLink href="/postcards" label="Shop" match="/postcards" />

          {/* Collections mega-menu */}
          <div
            className="relative"
            onMouseEnter={() => setMenu(true)}
            onMouseLeave={() => setMenu(false)}
          >
            <Link
              href="/collections"
              aria-expanded={menu}
              className="inline-flex items-center gap-1 rounded-lg px-3 py-1.5 text-sm font-medium text-foreground/70 transition-colors hover:text-foreground"
            >
              Collections
              <ChevronDown
                className={cn("size-3.5 transition-transform", menu && "rotate-180")}
              />
            </Link>

            <AnimatePresence>
              {menu && (
                <motion.div
                  initial={reduce ? { opacity: 0 } : { opacity: 0, y: 8, scale: 0.98 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={reduce ? { opacity: 0 } : { opacity: 0, y: 8, scale: 0.98 }}
                  transition={{ duration: 0.18, ease: [0.22, 1, 0.36, 1] }}
                  className="absolute left-1/2 top-full z-50 mt-2 w-[40rem] -translate-x-1/2"
                >
                  <div className="surface grid grid-cols-[1.3fr_1fr] gap-6 rounded-2xl border border-border/70 p-5 shadow-4">
                    <div>
                      <p className="stamp-label mb-3 text-muted-foreground">Collections</p>
                      <ul className="space-y-1">
                        {COLLECTIONS.map((c) => (
                          <li key={c.slug}>
                            <Link
                              href={`/collections/${c.slug}`}
                              className="group/mi block rounded-lg px-3 py-2 transition-colors hover:bg-muted"
                            >
                              <span className="flex items-center gap-1.5 font-medium">
                                {c.title}
                                <ArrowUpRight className="size-3.5 opacity-0 transition-opacity group-hover/mi:opacity-100" />
                              </span>
                              <span className="line-clamp-1 text-xs text-muted-foreground">
                                {c.blurb}
                              </span>
                            </Link>
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <p className="stamp-label mb-3 text-muted-foreground">Shop by mood</p>
                      <ul className="grid grid-cols-2 gap-1">
                        {CATEGORY_ORDER.map((c) => {
                          const meta = CATEGORY_META[c];
                          const Icon = meta.icon;
                          return (
                            <li key={c}>
                              <Link
                                href={`/postcards?category=${c}`}
                                className="flex items-center gap-2 rounded-lg px-2.5 py-1.5 text-sm text-foreground/80 transition-colors hover:bg-muted hover:text-primary"
                              >
                                <Icon className="size-3.5 shrink-0 text-primary" />
                                {meta.label}
                              </Link>
                            </li>
                          );
                        })}
                      </ul>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {LINKS.slice(1).map((l) => (
            <NavLink key={l.label} href={l.href} label={l.label} match={l.match} />
          ))}
        </nav>

        <div className="flex items-center gap-1">
          <SearchDialog products={searchProducts} />
          <ThemeToggle />
          <WishlistBadge />
          <AccountMenu />
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
            className="fixed inset-0 z-50 overflow-y-auto bg-background px-6 pt-6 pb-12 md:hidden"
            initial={{ opacity: 0, x: "100%" }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: "100%" }}
            transition={{ type: "spring", damping: 26, stiffness: 280 }}
            data-lenis-prevent
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
              {[
                { href: "/postcards", label: "Shop" },
                { href: "/collections", label: "Collections" },
                { href: "/journal", label: "Journal" },
                { href: "/about", label: "About" },
                { href: "/wishlist", label: "Wishlist" },
              ].map((l, i) => (
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
            <p className="stamp-label mt-8 mb-3 px-3 text-muted-foreground">Shop by mood</p>
            <div className="grid grid-cols-2 gap-1">
              {CATEGORY_ORDER.map((c) => {
                const meta = CATEGORY_META[c];
                const Icon = meta.icon;
                return (
                  <Link
                    key={c}
                    href={`/postcards?category=${c}`}
                    onClick={() => setOpen(false)}
                    className="flex items-center gap-2 rounded-lg px-3 py-2.5 text-sm text-foreground/80 hover:bg-muted hover:text-primary"
                  >
                    <Icon className="size-4 shrink-0 text-primary" />
                    {meta.label}
                  </Link>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}

function NavLink({
  href,
  label,
  match,
}: {
  href: string;
  label: string;
  match: string;
}) {
  // Active state read on the client only (post-mount), so it never affects the
  // prerendered static shell. Re-checks on every navigation via popstate +
  // a light interval fallback for client-side route changes.
  const [active, setActive] = useState(false);
  useEffect(() => {
    const check = () => setActive(window.location.pathname.startsWith(match));
    check();
    window.addEventListener("popstate", check);
    const id = window.setInterval(check, 400);
    return () => {
      window.removeEventListener("popstate", check);
      window.clearInterval(id);
    };
  }, [match]);

  return (
    <Link
      href={href}
      aria-current={active ? "page" : undefined}
      className={cn(
        "relative rounded-lg px-3 py-1.5 text-sm font-medium transition-colors",
        active ? "text-primary" : "text-foreground/70 hover:text-foreground",
      )}
    >
      {label}
      {active && (
        <span className="absolute inset-x-3 -bottom-0.5 h-0.5 rounded-full bg-primary" />
      )}
    </Link>
  );
}
