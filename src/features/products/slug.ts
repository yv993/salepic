/** Turn an arbitrary title into a URL-safe slug. */
export function slugify(input: string): string {
  return input
    .toLowerCase()
    .trim()
    .normalize("NFKD")
    .replace(/[̀-ͯ]/g, "") // strip accents
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80);
}

/** Append a short random suffix so colliding slugs stay unique. */
export function slugWithSuffix(base: string): string {
  const suffix = Math.random().toString(36).slice(2, 6);
  const root = slugify(base) || "postcard";
  return `${root}-${suffix}`;
}
