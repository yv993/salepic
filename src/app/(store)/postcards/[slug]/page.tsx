import { Suspense } from "react";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Truck, Stamp, Package } from "lucide-react";
import { getProductBySlug } from "@/features/products/queries";
import { CATEGORY_META } from "@/features/products/constants";
import { ARTIST_BYLINE } from "@/lib/artist";
import { formatPrice, formatDimensions } from "@/lib/format";
import { ProductGallery } from "@/components/store/product-gallery";
import { BuyBox } from "@/components/store/buy-box";
import { ProductReviews } from "@/components/store/product-reviews";
import { Skeleton } from "@/components/ui/skeleton";

type Params = Promise<{ slug: string }>;

export async function generateMetadata({
  params,
}: {
  params: Params;
}): Promise<Metadata> {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  if (!product) return { title: "Postcard not found" };
  return {
    title: product.title,
    description:
      product.description ??
      `${product.title} — an original hand-illustrated postcard.`,
    openGraph: {
      title: product.title,
      images: [{ url: product.imageUrl }],
    },
  };
}

export default function ProductPage({ params }: { params: Params }) {
  // params is a runtime API, so the dynamic read happens inside <Suspense>.
  // The product data itself comes from a cached, per-slug-tagged query.
  return (
    <Suspense fallback={<DetailSkeleton />}>
      <ProductDetail params={params} />
    </Suspense>
  );
}

async function ProductDetail({ params }: { params: Params }) {
  const { slug } = await params;
  // Per-slug caching + the `product-${slug}` tag live inside getProductBySlug.
  const product = await getProductBySlug(slug);
  if (!product) notFound();

  const cat = CATEGORY_META[product.category];
  const CatIcon = cat.icon;
  const dims = formatDimensions(product.widthMm, product.heightMm);
  const images = [product.imageUrl, ...(product.images ?? [])];

  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
      <Link
        href="/postcards"
        className="inline-flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground"
      >
        <ArrowLeft className="size-4" />
        Back to all postcards
      </Link>

      <div className="mt-6 grid gap-10 lg:grid-cols-2">
        <ProductGallery images={images} title={product.title} />

        <div className="flex flex-col">
          <Link
            href={`/postcards?category=${product.category}`}
            className="inline-flex w-fit items-center gap-1.5 rounded-full border border-border bg-card px-3 py-1 text-xs font-medium text-foreground/70 transition-colors hover:text-primary"
          >
            <CatIcon className="size-3.5" />
            {cat.label}
          </Link>

          <h1 className="mt-4 font-heading text-4xl font-bold tracking-tight sm:text-5xl">
            {product.title}
          </h1>

          <p className="mt-2 text-sm text-muted-foreground">
            {ARTIST_BYLINE}
          </p>

          <p className="mt-4 font-heading text-3xl font-semibold text-primary">
            {formatPrice(product.priceCents, product.currency)}
          </p>

          {product.description && (
            <p className="mt-6 max-w-prose leading-relaxed text-muted-foreground">
              {product.description}
            </p>
          )}

          <div className="mt-8">
            <BuyBox
              productId={product.id}
              title={product.title}
              stock={product.stock}
            />
          </div>

          <dl className="mt-10 grid gap-4 border-t border-border/70 pt-8 sm:grid-cols-3">
            <Spec icon={Stamp} label="Size" value={dims ?? "A6 card"} />
            <Spec icon={Package} label="Finish" value="Matte recycled stock" />
            <Spec icon={Truck} label="Shipping" value="Posted flat, worldwide" />
          </dl>
        </div>
      </div>

      <ProductReviews productId={product.id} productTitle={product.title} />
    </div>
  );
}

function Spec({
  icon: Icon,
  label,
  value,
}: {
  icon: typeof Stamp;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-start gap-3">
      <span className="grid size-9 shrink-0 place-items-center rounded-lg bg-muted text-primary">
        <Icon className="size-4" />
      </span>
      <div className="leading-tight">
        <dt className="stamp-label text-muted-foreground">{label}</dt>
        <dd className="mt-1 text-sm font-medium">{value}</dd>
      </div>
    </div>
  );
}

function DetailSkeleton() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
      <Skeleton className="h-5 w-40" />
      <div className="mt-6 grid gap-10 lg:grid-cols-2">
        <Skeleton className="aspect-[1.41/1] w-full rounded-2xl" />
        <div className="space-y-5">
          <Skeleton className="h-6 w-24 rounded-full" />
          <Skeleton className="h-12 w-3/4" />
          <Skeleton className="h-9 w-28" />
          <Skeleton className="h-20 w-full" />
          <Skeleton className="h-12 w-full" />
        </div>
      </div>
    </div>
  );
}
