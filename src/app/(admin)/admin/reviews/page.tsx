import type { Metadata } from "next";
import Link from "next/link";
import { Star, BadgeCheck } from "lucide-react";
import { PageHeader } from "@/components/page-header";
import { cn } from "@/lib/utils";
import { formatDate } from "@/lib/format";
import { adminListReviews } from "@/features/reviews/admin";
import { ReviewModeration } from "@/components/admin/review-moderation";

export const metadata: Metadata = { title: "Reviews" };

const STATUS_CLASS: Record<string, string> = {
  published: "bg-success/15 text-success",
  hidden: "bg-muted text-muted-foreground",
  pending: "bg-warning/15 text-warning",
};

export default async function AdminReviewsPage() {
  const reviews = await adminListReviews();
  const published = reviews.filter((r) => r.status === "published").length;

  return (
    <div className="mx-auto max-w-6xl">
      <PageHeader
        title="Reviews"
        description={`${reviews.length} total · ${published} published`}
      />

      {reviews.length === 0 ? (
        <div className="flex flex-col items-center gap-4 rounded-2xl border border-dashed border-border px-6 py-20 text-center">
          <span className="grid size-12 place-items-center rounded-full bg-muted text-muted-foreground">
            <Star className="size-6" />
          </span>
          <div>
            <p className="font-heading text-lg font-semibold">No reviews yet</p>
            <p className="mt-1 text-sm text-muted-foreground">
              Verified buyers&apos; reviews will appear here for moderation.
            </p>
          </div>
        </div>
      ) : (
        <div className="overflow-hidden rounded-2xl border border-border bg-card">
          <table className="w-full text-sm">
            <thead className="border-b border-border bg-muted/50 text-left text-xs text-muted-foreground">
              <tr>
                <th className="px-4 py-3 font-medium">Postcard</th>
                <th className="hidden px-4 py-3 font-medium sm:table-cell">Author</th>
                <th className="px-4 py-3 font-medium">Rating</th>
                <th className="hidden px-4 py-3 font-medium lg:table-cell">Review</th>
                <th className="px-4 py-3 font-medium">Status</th>
                <th className="px-4 py-3 font-medium text-right">Moderate</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {reviews.map((r) => (
                <tr key={r.id} className="align-top transition-colors hover:bg-muted/40">
                  <td className="px-4 py-3">
                    {r.productSlug ? (
                      <Link
                        href={`/postcards/${r.productSlug}`}
                        className="font-medium hover:text-primary"
                      >
                        {r.productTitle}
                      </Link>
                    ) : (
                      <span className="text-muted-foreground">(removed)</span>
                    )}
                    <p className="text-xs text-muted-foreground">
                      {formatDate(r.createdAt)}
                    </p>
                  </td>
                  <td className="hidden px-4 py-3 sm:table-cell">
                    <span className="flex items-center gap-1 font-medium">
                      {r.authorName}
                      {r.verified && (
                        <BadgeCheck className="size-3.5 text-primary" aria-label="Verified" />
                      )}
                    </span>
                    <p className="text-xs text-muted-foreground">
                      {r.authorLocation ?? "—"}
                    </p>
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap font-medium">
                    {r.rating}/5
                  </td>
                  <td className="hidden max-w-xs px-4 py-3 lg:table-cell">
                    {r.title && <p className="font-medium">{r.title}</p>}
                    <p className="line-clamp-2 text-muted-foreground">{r.body}</p>
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={cn(
                        "inline-flex rounded-full px-2.5 py-1 text-xs font-semibold capitalize",
                        STATUS_CLASS[r.status],
                      )}
                    >
                      {r.status}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <ReviewModeration id={r.id} status={r.status} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
