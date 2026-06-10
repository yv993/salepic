# Posted. — an illustrator's postcard storefront

A small, production-grade shop for an independent postcard artist. Visitors
browse hand-illustrated postcards, add them to a cookie-based cart, and check
out as a guest; a private studio dashboard lets the illustrator manage
postcards and orders.

Built on **Next.js 16 with Cache Components** (Partial Prerendering) — static,
prerendered storefront shells with dynamic data streamed in via `<Suspense>`,
and a `'use cache'` catalog that an admin edit invalidates instantly.

## Features

### Storefront (public)
- **Home** — editorial hero, featured row, browse-by-mood category teaser,
  testimonials, and an FAQ.
- **Gallery** — every active postcard with category filters and sorting; the
  grid is a cached, tagged query that streams into a `<Suspense>` boundary.
- **Product pages** — per-slug cached detail with an image gallery, quantity
  picker, and add-to-cart.
- **Cart** — a signed, httpOnly cookie holding only product IDs + quantities;
  **prices are always re-derived from the database**, never trusted from the
  client. A dynamic `<CartBadge>` streams the live count.
- **Guest checkout** — shipping + buyer form, money recomputed server-side, an
  order + snapshotted line items written, then a confirmation page with
  payment-pending instructions (or a "Pay now" link when one exists).

### Studio admin (`/admin`, allowlisted)
- **Dashboard** — order counts, paid revenue, and low-stock alerts.
- **Postcards** — full CRUD; saving an edit calls `updateTag('products')` so it
  appears in the store immediately.
- **Orders** — list + detail with an inline status control.

## Cache Components model

This app sets `cacheComponents: true` and follows its rules strictly:

- Catalog reads use `'use cache'` + `cacheLife('days')` + `cacheTag('products')`
  (plus a per-slug `product-${slug}` tag). See `src/features/products/queries.ts`.
- Runtime APIs (`cookies()`, `searchParams`, `params`) are read **outside** any
  cached scope and passed in as plain args; dynamic reads live under `<Suspense>`.
- Admin mutations call `updateTag(...)` for read-your-own-writes. A future
  payment webhook will use `revalidateTag('orders', 'max')` in a route handler.

## Payments — swappable provider

`src/features/checkout/payment/` defines a `PaymentProvider` interface with a
single swap point in `index.ts`. Today the **manual** provider records orders as
`pending_payment` with friendly instructions; a **Payoneer** stub is ready to be
implemented and switched on with a one-line change (plus a webhook route).

## Tech stack

- **Next.js 16** (App Router, Cache Components) + **React 19** + **TypeScript**
- **Tailwind CSS v4** + **Base UI** primitives (shadcn `base-nova` style)
- **Neon** Postgres + **Drizzle ORM**
- **Clerk** authentication (admin only — the store is public)
- **motion** for nav + testimonial animations
- Warm, editorial palette (terracotta · marigold · sage · ink on warm paper)

## Getting started

### Quick start — zero accounts (local PGlite)

The repo runs end-to-end with **no Neon and no Clerk**. When `DATABASE_URL` is
empty or points at `localhost` (the default in `.env.local`), the app uses an
on-disk **PGlite** database under `./.pglite` and applies the migrations
automatically. With placeholder Clerk keys, the public storefront runs fully and
`/admin` shows a "configure Clerk" notice instead of crashing.

```bash
npm install
npm run db:seed     # creates ./.pglite, migrates it, inserts 10 postcards
npm run dev         # http://localhost:3000 (or 3001 if 3000 is busy)
```

That's it — the gallery, cart, checkout, and order confirmation all work.

### Going to production (Neon + Clerk)

| Service | Get | Used for |
|---------|-----|----------|
| [Neon](https://neon.tech) | a project's **pooled** connection string | Postgres |
| [Clerk](https://dashboard.clerk.com) | Publishable + Secret keys | Admin auth |

Set these in `.env.local` (see `.env.example`):
```bash
DATABASE_URL=postgresql://...               # Neon pooled connection string
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_...    # a REAL key (not the pk_test_ZXhhbXBsZS5j placeholder)
CLERK_SECRET_KEY=sk_...
ADMIN_EMAILS=you@example.com                # comma-separated admin allowlist
```
Then:
```bash
npm run db:push     # apply the schema to your Neon database
npm run db:seed     # insert 10 placeholder postcards (idempotent)
npm run dev
```
Sign in at `/sign-in` with an email on your `ADMIN_EMAILS` list to reach `/admin`.

> The driver is chosen at runtime in `src/db/connect.ts`: local → PGlite,
> real `DATABASE_URL` → Neon. Force PGlite anywhere with `USE_PGLITE=1`.
> (`npm run db:generate` regenerates SQL migrations; `npm run db:studio` opens Drizzle Studio.)

## Scripts
| Script | What it does |
|--------|--------------|
| `npm run dev` | Start the dev server |
| `npm run build` / `npm start` | Production build / serve |
| `npm run typecheck` | `tsc --noEmit` |
| `npm run lint` | ESLint |
| `npm run db:generate` / `db:push` / `db:studio` | Drizzle migrations / push / studio |
| `npm run db:seed` | Seed placeholder postcards |

## Project structure
```
src/
├─ app/
│  ├─ (store)/   # public: home, postcards, [slug], cart, checkout, orders, about
│  ├─ (admin)/   # /admin dashboard, products CRUD, orders (allowlisted)
│  └─ (auth)/    # Clerk sign-in / sign-up
├─ db/           # Drizzle schema, client, and seed
├─ features/
│  ├─ products/  # cached queries, admin queries, schemas, CRUD actions, slug
│  ├─ cart/      # signed-cookie helpers + mutation actions
│  ├─ checkout/  # schemas, placeOrder action, payment/ (provider interface)
│  └─ orders/    # public + admin queries, status actions
├─ components/   # store/, admin/, app-shell, theme, shared UI primitives
└─ lib/          # env, auth (requireAdmin), formatting, action-state
```

## Notes
- Money is always stored as integer **cents**.
- Order line items **snapshot** the product (title, slug, image, price) so later
  edits never mutate order history.
- The catalog queries degrade gracefully (return empty) if the DB is briefly
  unreachable, so `next build` succeeds even before the database is seeded.
- `reference/` holds the original design/component references used to shape the UI.
