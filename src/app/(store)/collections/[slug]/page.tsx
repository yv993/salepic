import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { notFound } from "next/navigation";
import { getStoreProducts } from "@/features/products/queries";
import {
  COLLECTION_SLUGS,
  getCollection,
  selectCollectionProducts,
} from "@/features/collections/data";
import { PostcardCard } from "@/components/store/postcard-card";
import { siteUrl } from "@/lib/env";

type Params = Promise<{ slug: string }>;

export function generateStaticParams() {
  return COLLECTION_SLUGS.map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Params;
}): Promise<Metadata> {
  const { slug } = await params;
  const c = getCollection(slug);
  if (!c) return { title: "Collection not found" };
  return {
    title: c.title,
    description: c.blurb,
    alternates: { canonical: `${siteUrl()}/collections/${c.slug}` },
  };
}

export default async function CollectionPage({ params }: { params: Params }) {
  const { slug } = await params;
  const c = getCollection(slug);
  if (!c) notFound();

  const all = await getStoreProducts({});
  const products = selectCollectionProducts(c, all);

  return (
    <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
      <Link
        href="/collections"
        className="inline-flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground"
      >
        <ArrowLeft className="size-4" />
        All collections
      </Link>
      <header className="mt-6 mb-8">
        <p className="stamp-label text-primary">Collection</p>
        <h1 className="mt-2 font-heading text-4xl font-bold tracking-tight sm:text-5xl">
          {c.title}
        </h1>
        <p className="mt-3 max-w-xl text-muted-foreground">{c.blurb}</p>
      </header>

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {products.map((product, i) => (
          <PostcardCard key={product.id} product={product} priority={i < 3} />
        ))}
      </div>
    </div>
  );
}
