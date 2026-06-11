import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { LEGAL_DOCS, LEGAL_SLUGS, LEGAL_NAV } from "@/features/legal/content";
import { siteUrl } from "@/lib/env";

type Params = Promise<{ doc: string }>;

export function generateStaticParams() {
  return LEGAL_SLUGS.map((doc) => ({ doc }));
}

export async function generateMetadata({
  params,
}: {
  params: Params;
}): Promise<Metadata> {
  const { doc } = await params;
  const d = LEGAL_DOCS[doc];
  if (!d) return { title: "Not found" };
  return {
    title: d.title,
    description: d.description,
    alternates: { canonical: `${siteUrl()}/legal/${d.slug}` },
  };
}

export default async function LegalPage({ params }: { params: Params }) {
  const { doc } = await params;
  const d = LEGAL_DOCS[doc];
  if (!d) notFound();

  const updated = new Date(d.updated).toLocaleDateString(undefined, {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6">
      <p className="stamp-label text-primary">Legal</p>
      <h1 className="mt-2 font-heading text-4xl font-bold tracking-tight sm:text-5xl">
        {d.title}
      </h1>
      <p className="mt-3 text-sm text-muted-foreground">Last updated {updated}</p>

      <p className="mt-8 text-lg leading-relaxed text-muted-foreground">
        {d.intro}
      </p>

      <div className="mt-10 space-y-10">
        {d.sections.map((s) => (
          <section key={s.heading}>
            <h2 className="font-heading text-xl font-semibold tracking-tight">
              {s.heading}
            </h2>
            <div className="mt-3 space-y-3 leading-relaxed text-muted-foreground">
              {s.body.map((p, i) => (
                <p key={i}>{p}</p>
              ))}
            </div>
          </section>
        ))}
      </div>

      <nav className="mt-14 flex flex-wrap gap-x-5 gap-y-2 border-t border-border/70 pt-6 text-sm">
        {LEGAL_NAV.map((n) => (
          <Link
            key={n.slug}
            href={`/legal/${n.slug}`}
            aria-current={n.slug === d.slug ? "page" : undefined}
            className={
              n.slug === d.slug
                ? "font-medium text-primary"
                : "text-muted-foreground hover:text-foreground"
            }
          >
            {n.title}
          </Link>
        ))}
      </nav>
    </div>
  );
}
