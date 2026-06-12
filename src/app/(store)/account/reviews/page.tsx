import Link from "next/link";
import { Star, MessageSquare } from "lucide-react";
import { getBuyer } from "@/lib/auth";
import { getMyReviews } from "@/features/account/queries";
import { Button } from "@/components/ui/button";
import { formatDate } from "@/lib/format";

const STATUS: Record<string, string> = {
  published: "bg-success/15 text-success",
  hidden: "bg-muted text-muted-foreground",
  pending: "bg-warning/15 text-warning",
};

export default async function AccountReviewsPage() {
  const buyer = await getBuyer();
  if (!buyer) return null;
  const reviews = await getMyReviews(buyer.userId);

  return (
    <section>
      <h2 className="font-heading text-xl font-bold tracking-tight">My reviews</h2>
      <p className="mt-1 mb-6 text-sm text-muted-foreground">
        Reviews you&apos;ve left as a verified buyer.
      </p>

      {reviews.length === 0 ? (
        <div className="surface flex flex-col items-center gap-3 rounded-2xl px-6 py-14 text-center">
          <span className="grid size-12 place-items-center rounded-full bg-muted text-muted-foreground">
            <MessageSquare className="size-6" />
          </span>
          <p className="font-heading text-lg font-semibold">No reviews yet</p>
          <p className="max-w-sm text-sm text-muted-foreground">
            Once an order is paid, you can review the postcards you bought.
          </p>
          <Button className="mt-2" render={<Link href="/account" />}>
            View orders
          </Button>
        </div>
      ) : (
        <ul className="space-y-4">
          {reviews.map((r) => (
            <li key={r.id} className="surface rounded-2xl p-5">
              <div className="flex flex-wrap items-center justify-between gap-2">
                {r.productSlug ? (
                  <Link href={`/postcards/${r.productSlug}`} className="font-medium hover:text-primary">
                    {r.productTitle}
                  </Link>
                ) : (
                  <span className="font-medium">{r.productTitle ?? "Postcard"}</span>
                )}
                <span className={`rounded-full px-2.5 py-0.5 text-xs font-semibold capitalize ${STATUS[r.status] ?? ""}`}>
                  {r.status}
                </span>
              </div>
              <div className="mt-2 flex items-center gap-1">
                {Array.from({ length: 5 }, (_, i) => (
                  <Star
                    key={i}
                    className={i < r.rating ? "size-4 fill-primary text-primary" : "size-4 text-muted-foreground/40"}
                  />
                ))}
                <span className="ml-2 text-xs text-muted-foreground">{formatDate(r.createdAt)}</span>
              </div>
              {r.title && <p className="mt-2 font-heading font-semibold">{r.title}</p>}
              <p className="mt-1 text-sm text-muted-foreground">{r.body}</p>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
