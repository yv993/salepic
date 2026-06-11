import { Suspense } from "react";
import type { Metadata } from "next";
import Link from "next/link";
import { cookies } from "next/headers";
import { HeartOff } from "lucide-react";
import { getStoreProducts } from "@/features/products/queries";
import { parseWishlist, WISHLIST_COOKIE } from "@/lib/wishlist";
import { PostcardCard } from "@/components/store/postcard-card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { siteUrl } from "@/lib/env";

export const metadata: Metadata = {
  title: "Your wishlist",
  description: "Postcards you've saved for later.",
  alternates: { canonical: `${siteUrl()}/wishlist` },
};

export default function WishlistPage() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
      <header className="mb-8">
        <p className="stamp-label text-primary">Saved for later</p>
        <h1 className="mt-2 font-heading text-4xl font-bold tracking-tight sm:text-5xl">
          Your wishlist
        </h1>
        <p className="mt-3 max-w-xl text-muted-foreground">
          Tap the heart on any postcard to keep it here. Saved on this device.
        </p>
      </header>
      {/* cookies() is a runtime read → stays inside <Suspense>. */}
      <Suspense fallback={<GridSkeleton />}>
        <SavedItems />
      </Suspense>
    </div>
  );
}

async function SavedItems() {
  const store = await cookies();
  const ids = new Set(parseWishlist(store.get(WISHLIST_COOKIE)?.value));
  const all = await getStoreProducts({});
  const saved = all.filter((p) => ids.has(p.id));

  if (saved.length === 0) {
    return (
      <div className="surface flex flex-col items-center gap-3 rounded-2xl px-6 py-16 text-center">
        <span className="grid size-12 place-items-center rounded-full bg-muted text-muted-foreground">
          <HeartOff className="size-6" />
        </span>
        <p className="font-heading text-lg font-semibold">No saved postcards yet</p>
        <p className="max-w-sm text-sm text-muted-foreground">
          Browse the collection and tap the heart to save your favourites.
        </p>
        <Button className="mt-2" render={<Link href="/postcards" />}>
          Browse postcards
        </Button>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
      {saved.map((product, i) => (
        <PostcardCard key={product.id} product={product} priority={i < 3} />
      ))}
    </div>
  );
}

function GridSkeleton() {
  return (
    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
      {Array.from({ length: 6 }).map((_, i) => (
        <Skeleton key={i} className="aspect-[1.41/1] w-full rounded-2xl" />
      ))}
    </div>
  );
}
