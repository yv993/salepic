import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Cache Components: dynamic-by-default rendering with Partial Prerendering.
  // Cached scopes use `'use cache'` + cacheLife/cacheTag; dynamic data must
  // live under <Suspense>. See src/features/products/queries.ts.
  cacheComponents: true,

  // PGlite ships WASM and must not be bundled into the server build.
  serverExternalPackages: ["@electric-sql/pglite"],

  images: {
    // The seeded postcard placeholders are SVGs; allow next/image to serve them.
    // Admin-provided image URLs are trusted (gated behind requireAdmin).
    dangerouslyAllowSVG: true,
    contentDispositionType: "attachment",
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
    remotePatterns: [
      // Testimonial avatars used by the storefront marketing blocks.
      { protocol: "https", hostname: "randomuser.me" },
      // Logo cloud wordmarks.
      { protocol: "https", hostname: "svgl.app" },
      // Unsplash fallbacks for any remote artwork placeholders.
      { protocol: "https", hostname: "images.unsplash.com" },
    ],
  },
};

export default nextConfig;
