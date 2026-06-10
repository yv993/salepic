import Link from "next/link";
import { Camera, Send, Video, Mail } from "lucide-react";
import { Brand } from "@/components/brand";
import { CATEGORY_ORDER, CATEGORY_META } from "@/features/products/constants";

const COLUMNS: { heading: string; links: { label: string; href: string }[] }[] = [
  {
    heading: "Browse",
    links: [
      { label: "All postcards", href: "/postcards" },
      ...CATEGORY_ORDER.slice(0, 4).map((c) => ({
        label: CATEGORY_META[c].label,
        href: `/postcards?category=${c}`,
      })),
    ],
  },
  {
    heading: "Studio",
    links: [
      { label: "About the artist", href: "/about" },
      { label: "New arrivals", href: "/postcards?sort=newest" },
      { label: "Studio admin", href: "/admin" },
    ],
  },
  {
    heading: "Help",
    links: [
      { label: "Your cart", href: "/cart" },
      { label: "Checkout", href: "/checkout" },
      { label: "Shipping & returns", href: "/about" },
    ],
  },
  {
    heading: "Connect",
    links: [
      { label: "Instagram", href: "/about" },
      { label: "Newsletter", href: "/about" },
      { label: "Contact", href: "/about" },
    ],
  },
];

const SOCIAL = [
  { icon: Camera, label: "Instagram", href: "/about" },
  { icon: Send, label: "Twitter", href: "/about" },
  { icon: Video, label: "YouTube", href: "/about" },
  { icon: Mail, label: "Email", href: "/about" },
];

export function StoreFooter() {
  return (
    <footer className="relative overflow-hidden border-t border-border/70 bg-card/50">
      <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
        {/* centered brand mark */}
        <div className="flex flex-col items-center gap-3 text-center">
          <Brand href="/" />
          <p className="max-w-md text-sm leading-relaxed text-muted-foreground">
            Original postcard art, drawn by hand and printed small-batch on A6
            card stock — sent with care from the studio to your letterbox.
          </p>
          <div className="mt-2 flex gap-2">
            {SOCIAL.map((s) => {
              const Icon = s.icon;
              return (
                <Link
                  key={s.label}
                  href={s.href}
                  aria-label={s.label}
                  className="grid size-10 place-items-center rounded-full ring-1 ring-border text-foreground/70 transition-colors hover:bg-primary/10 hover:text-primary focus-visible:ring-2 focus-visible:ring-ring"
                >
                  <Icon className="size-4" />
                </Link>
              );
            })}
          </div>
        </div>

        <div className="mt-14 grid grid-cols-2 gap-8 border-t border-border/60 pt-10 sm:grid-cols-4">
          {COLUMNS.map((col) => (
            <div key={col.heading}>
              <h4 className="stamp-label text-muted-foreground">{col.heading}</h4>
              <ul className="mt-4 space-y-2.5 text-sm">
                {col.links.map((l) => (
                  <li key={l.label}>
                    <Link
                      href={l.href}
                      className="link-underline text-foreground/75 hover:text-primary"
                    >
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      <div className="border-t border-border/60">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-2 px-4 py-5 text-xs text-muted-foreground sm:flex-row sm:px-6">
          <p>© Posted. All artwork © the artist.</p>
          <p className="stamp-label">Made with care · Shipped worldwide</p>
        </div>
      </div>
    </footer>
  );
}
