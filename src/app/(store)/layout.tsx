import { Suspense } from "react";
import { StoreNav } from "@/components/store/store-nav";
import { StoreFooter } from "@/components/store/store-footer";
import { CartBadge, CartBadgeFallback } from "@/components/store/cart-badge";
import { ScrollProgress } from "@/components/ui/scroll-progress";
import { PhotoCollage } from "@/components/store/photo-collage";
import { RevealFooter } from "@/components/store/reveal-footer";

/**
 * Storefront shell. NOT a `use cache` scope: the cart badge reads the cookie
 * (a runtime API), which is forbidden inside `use cache`. Instead, the nav and
 * footer are static client/server components that Cache Components prerenders
 * into the static shell automatically, while the dynamic cart count streams in
 * via its own <Suspense> boundary. Product data is cached at the query level.
 */
export default function StoreLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="relative">
      <ScrollProgress />
      {/* Content shell sits ABOVE the pinned footer (opaque bg) and scrolls
          up off it to reveal the sticky parallax footer below. */}
      <div className="relative z-10 flex min-h-screen flex-col bg-background">
        <StoreNav
          cartSlot={
            <Suspense fallback={<CartBadgeFallback />}>
              <CartBadge />
            </Suspense>
          }
        />
        <main id="main-content" className="flex-1">{children}</main>
        <PhotoCollage />
      </div>
      <RevealFooter>
        <StoreFooter />
      </RevealFooter>
    </div>
  );
}
