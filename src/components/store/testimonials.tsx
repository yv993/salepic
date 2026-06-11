import { getPublishedReviews, type WallReview } from "@/features/reviews/queries";
import { ReviewsWall } from "./reviews-wall";

/** Shown only if the DB has too few published reviews (e.g. before seeding). */
const FALLBACK: WallReview[] = [
  { id: "f1", rating: 5, title: "Richer in person", body: "The colours are even warmer than the photos. I framed three instead of mailing a single one.", authorName: "Maya Lindqvist", authorLocation: "Stockholm", verified: true, createdAt: "2026-01-01T00:00:00.000Z", product: null },
  { id: "f2", rating: 5, title: null, body: "Arrived perfectly flat and so quickly. It's on my fridge and I smile every morning.", authorName: "Daniel Okafor", authorLocation: "Lagos", verified: true, createdAt: "2026-01-01T00:00:00.000Z", product: null },
  { id: "f3", rating: 5, title: null, body: "A tiny luxury. The hand-lettered ones make the best little notes — people always ask where they're from.", authorName: "Tomás Rivera", authorLocation: "Mexico City", verified: true, createdAt: "2026-01-01T00:00:00.000Z", product: null },
];

/**
 * Review wall. Backed by a cached query (tagged `reviews`) so it prerenders
 * into the static shell. Each card opens a detail modal (ReviewsWall, client).
 */
export async function Testimonials() {
  const reviews = await getPublishedReviews(24);
  const data = reviews.length >= 3 ? reviews : FALLBACK;

  return (
    <section className="relative overflow-hidden py-20">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="mx-auto max-w-xl text-center">
          <p className="stamp-label text-primary">From the letterbox</p>
          <h2 className="mt-2 font-heading text-3xl font-bold tracking-tight sm:text-4xl">
            Sent, received, treasured
          </h2>
          <p className="mt-3 text-muted-foreground">
            Real words from verified buyers — tap any card to read the full note.
          </p>
        </div>

        <ReviewsWall reviews={data} />
      </div>
    </section>
  );
}
