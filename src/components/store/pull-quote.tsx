/**
 * Centered italic serif pull-quote with oversized quotation marks — the
 * editorial "statement" beat. Static + AA in both themes.
 */
export function PullQuote() {
  return (
    <section className="relative mx-auto max-w-4xl px-4 py-24 text-center sm:px-6">
      <span
        aria-hidden
        className="pointer-events-none absolute left-1/2 top-6 -translate-x-1/2 select-none font-heading text-[12rem] leading-none text-primary/15"
      >
        &ldquo;
      </span>
      <blockquote className="relative font-heading text-2xl font-medium italic leading-relaxed tracking-tight text-foreground sm:text-3xl md:text-4xl">
        A postcard is the slowest, kindest kind of message — a small piece of
        somewhere, sent the long way round, just to say{" "}
        <span className="text-primary not-italic">you were on my mind.</span>
      </blockquote>
      <p className="stamp-label mt-8 text-muted-foreground">
        The studio · est. MMXXV
      </p>
    </section>
  );
}
