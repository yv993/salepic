import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { ArrowUpRight } from "lucide-react";
import { getStoreProducts } from "@/features/products/queries";
import {
  COLLECTIONS,
  selectCollectionProducts,
} from "@/features/collections/data";
import { siteUrl } from "@/lib/env";

export const metadata: Metadata = {
  title: "Collections",
  description: "Curated capsules of postcards — travel, seasonal, ink & paper, and studio favourites.",
  alternates: { canonical: `${siteUrl()}/collections` },
};

export default async function CollectionsPage() {
  const all = await getStoreProducts({});
  const bySlug = new Map(all.map((p) => [p.slug, p]));

  return (
    <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
      <header className="mb-10">
        <p className="stamp-label text-primary">Curated</p>
        <h1 className="mt-2 font-heading text-4xl font-bold tracking-tight sm:text-5xl">
          Collections
        </h1>
        <p className="mt-3 max-w-xl text-muted-foreground">
          Hand-picked groupings from the studio — a quicker way in than scrolling
          all eighty.
        </p>
      </header>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
        {COLLECTIONS.map((c) => {
          const cover = bySlug.get(c.coverSlug);
          const count = selectCollectionProducts(c, all).length;
          return (
            <Link
              key={c.slug}
              href={`/collections/${c.slug}`}
              className="group/col surface hover-lift relative overflow-hidden rounded-3xl"
            >
              <div className="relative aspect-[16/10] overflow-hidden">
                {cover && (
                  <Image
                    src={cover.imageUrl}
                    alt=""
                    fill
                    sizes="(min-width: 640px) 45vw, 90vw"
                    className="object-cover transition-transform duration-500 group-hover/col:scale-[1.04]"
                  />
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/20 to-transparent" />
                <div className="absolute inset-x-0 bottom-0 p-5 text-white">
                  <div className="flex items-end justify-between gap-3">
                    <div>
                      <h2 className="font-heading text-2xl font-bold tracking-tight">
                        {c.title}
                      </h2>
                      <p className="mt-1 max-w-sm text-sm text-white/80">{c.blurb}</p>
                    </div>
                    <ArrowUpRight className="size-5 shrink-0 transition-transform group-hover/col:translate-x-0.5 group-hover/col:-translate-y-0.5" />
                  </div>
                  <p className="mt-3 text-xs font-medium text-white/70">
                    {count} {count === 1 ? "postcard" : "postcards"}
                  </p>
                </div>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
