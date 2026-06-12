import Link from "next/link";
import { HeartOff } from "lucide-react";
import { getBuyer } from "@/lib/auth";
import { getAccountWishlist } from "@/features/account/queries";
import { PostcardCard } from "@/components/store/postcard-card";
import { Button } from "@/components/ui/button";
import { WishlistMergeBar } from "@/components/account/wishlist-merge-bar";

export default async function AccountWishlistPage() {
  const buyer = await getBuyer();
  if (!buyer) return null;
  const products = await getAccountWishlist(buyer.userId);

  return (
    <section>
      <h2 className="font-heading text-xl font-bold tracking-tight">Saved to your account</h2>
      <p className="mt-1 mb-6 text-sm text-muted-foreground">
        Wishlist items kept on your account — available on any device you sign in to.
      </p>

      <WishlistMergeBar />

      {products.length === 0 ? (
        <div className="surface flex flex-col items-center gap-3 rounded-2xl px-6 py-14 text-center">
          <span className="grid size-12 place-items-center rounded-full bg-muted text-muted-foreground">
            <HeartOff className="size-6" />
          </span>
          <p className="font-heading text-lg font-semibold">Nothing saved yet</p>
          <p className="max-w-sm text-sm text-muted-foreground">
            Tap the heart on any postcard, then use “Save to my account” above to
            keep it here.
          </p>
          <Button className="mt-2" render={<Link href="/postcards" />}>
            Browse postcards
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {products.map((product, i) => (
            <PostcardCard key={product.id} product={product} priority={i < 3} />
          ))}
        </div>
      )}
    </section>
  );
}
