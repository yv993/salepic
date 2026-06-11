/**
 * Cookie-backed wishlist of product ids. Favourites are non-sensitive, so the
 * cookie is plain (no signing) and readable/writable on the client for instant
 * UX — the /wishlist page resolves ids to products server-side. Mirrors the
 * cart's "ids only, never prices" principle.
 */
export const WISHLIST_COOKIE = "pc_wishlist";
const MAX = 60;
const EVENT = "wishlist:changed";

/** Pure parser — usable on server (from the cookie value) and client. */
export function parseWishlist(raw: string | undefined | null): string[] {
  if (!raw) return [];
  return raw
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean)
    .slice(0, MAX);
}

export function readWishlist(): string[] {
  if (typeof document === "undefined") return [];
  const match = document.cookie
    .split("; ")
    .find((c) => c.startsWith(`${WISHLIST_COOKIE}=`));
  return parseWishlist(match ? decodeURIComponent(match.split("=")[1]) : "");
}

function writeWishlist(ids: string[]) {
  const value = encodeURIComponent(ids.slice(0, MAX).join(","));
  const maxAge = 60 * 60 * 24 * 180; // 180 days
  document.cookie = `${WISHLIST_COOKIE}=${value}; path=/; max-age=${maxAge}; samesite=lax`;
  window.dispatchEvent(new CustomEvent(EVENT));
}

/** Toggle an id; returns the new membership state. */
export function toggleWishlist(id: string): boolean {
  const ids = readWishlist();
  const has = ids.includes(id);
  writeWishlist(has ? ids.filter((x) => x !== id) : [...ids, id]);
  return !has;
}

/** Subscribe to wishlist changes (returns an unsubscribe fn). */
export function onWishlistChange(cb: () => void): () => void {
  if (typeof window === "undefined") return () => {};
  window.addEventListener(EVENT, cb);
  window.addEventListener("focus", cb);
  return () => {
    window.removeEventListener(EVENT, cb);
    window.removeEventListener("focus", cb);
  };
}

export const WISHLIST_EVENT = EVENT;
