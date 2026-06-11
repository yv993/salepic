import { BadgeCheck } from "lucide-react";
import { getReviewsForProduct } from "@/features/reviews/queries";
import { getReviewAccess } from "@/features/reviews/access";
import { StarRating } from "./stars";
import { ReviewForm } from "./review-form";

function initials(name: string) {
  return name.split(" ").map((w) => w[0]).filter(Boolean).slice(0, 2).join("").toUpperCase();
}

/**
 * Per-postcard reviews: average rating, the gated review form (auth + verified
 * purchase, read OUTSIDE cache), and the published list. Rendered inside the
 * product page's dynamic <Suspense> boundary.
 */
export async function ProductReviews({
  productId,
  productTitle,
}: {
  productId: string;
  productTitle: string;
}) {
  const [{ reviews, average, count }, access] = await Promise.all([
    getReviewsForProduct(productId),
    getReviewAccess(productId),
  ]);

  return (
    <section className="mt-16 border-t border-border/70 pt-10">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="stamp-label text-primary">Reviews</p>
          <h2 className="mt-2 font-heading text-2xl font-bold tracking-tight sm:text-3xl">
            What buyers say
          </h2>
        </div>
        {count > 0 && (
          <div className="flex items-center gap-3">
            <span className="font-heading text-3xl font-bold">
              {average.toFixed(1)}
            </span>
            <div className="leading-tight">
              <StarRating rating={average} />
              <p className="text-xs text-muted-foreground">
                {count} {count === 1 ? "review" : "reviews"}
              </p>
            </div>
          </div>
        )}
      </div>

      <div className="mt-8 grid gap-10 lg:grid-cols-[1.1fr_1fr]">
        {/* List */}
        <div>
          {count === 0 ? (
            <p className="text-sm text-muted-foreground">
              No reviews yet — verified buyers can be the first to share one.
            </p>
          ) : (
            <ul className="space-y-6">
              {reviews.map((r) => (
                <li key={r.id} className="border-b border-border/50 pb-6 last:border-0">
                  <div className="flex items-center gap-3">
                    <span className="grid size-9 shrink-0 place-items-center rounded-full bg-primary/15 text-xs font-semibold text-primary ring-1 ring-primary/25">
                      {initials(r.authorName)}
                    </span>
                    <div className="leading-tight">
                      <p className="flex items-center gap-1.5 text-sm font-medium">
                        {r.authorName}
                        {r.verified && (
                          <BadgeCheck className="size-3.5 text-primary" aria-label="Verified buyer" />
                        )}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {r.authorLocation ?? "Verified buyer"} ·{" "}
                        {new Date(r.createdAt).toLocaleDateString(undefined, {
                          year: "numeric",
                          month: "short",
                          day: "numeric",
                        })}
                      </p>
                    </div>
                  </div>
                  <div className="mt-3">
                    <StarRating rating={r.rating} />
                  </div>
                  {r.title && (
                    <p className="mt-2 font-heading font-semibold tracking-tight">
                      {r.title}
                    </p>
                  )}
                  <p className="mt-1 text-sm leading-relaxed text-foreground/85">
                    {r.body}
                  </p>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Form (gated) */}
        <div className="lg:sticky lg:top-24 lg:self-start">
          <ReviewForm
            productId={productId}
            productTitle={productTitle}
            access={access}
          />
        </div>
      </div>
    </section>
  );
}
