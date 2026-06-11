import "server-only";

/**
 * Lightweight spam protection for public mutations: a honeypot field check and
 * an in-memory sliding-window rate limiter. The limiter is per server instance
 * (fine for a single-node deploy; swap for Redis/Upstash if you scale out).
 */

const HITS = new Map<string, number[]>();

/** Returns true when the request is within the rate limit (and records it). */
export function rateLimit(key: string, limit = 6, windowMs = 60_000): boolean {
  const now = Date.now();
  const arr = (HITS.get(key) ?? []).filter((t) => now - t < windowMs);
  if (arr.length >= limit) return false;
  arr.push(now);
  HITS.set(key, arr);
  // Opportunistic cleanup to bound memory.
  if (HITS.size > 5000) {
    for (const [k, v] of HITS) if (v.every((t) => now - t > windowMs)) HITS.delete(k);
  }
  return true;
}

/** True when the hidden honeypot field is filled (i.e. a bot submitted it). */
export function isHoneypotTripped(formData: FormData, field = "company"): boolean {
  const v = formData.get(field);
  return typeof v === "string" && v.trim().length > 0;
}
