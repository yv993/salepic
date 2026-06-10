import {
  pgTable,
  pgEnum,
  uuid,
  text,
  integer,
  boolean,
  timestamp,
  index,
  uniqueIndex,
} from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";

/* ------------------------------------------------------------------ enums */

/** Artwork categories shown in the gallery filter and category teaser. */
export const productCategory = pgEnum("product_category", [
  "travel",
  "nature",
  "city",
  "abstract",
  "typography",
  "seasonal",
  "animals",
  "vintage",
]);

export const productStatus = pgEnum("product_status", [
  "draft",
  "active",
  "archived",
]);

/** Lifecycle of an order, from placement through fulfillment. */
export const orderStatus = pgEnum("order_status", [
  "pending_payment",
  "paid",
  "fulfilled",
  "cancelled",
  "refunded",
]);

export const paymentProvider = pgEnum("payment_provider", [
  "manual",
  "payoneer",
]);

/* --------------------------------------------------------------- tables */

/** A postcard artwork available in the store. Money is always integer cents. */
export const products = pgTable(
  "products",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    /** URL-safe identifier used in /postcards/[slug]. */
    slug: text("slug").notNull(),
    title: text("title").notNull(),
    description: text("description"),
    priceCents: integer("price_cents").notNull(),
    currency: text("currency").notNull().default("USD"),
    category: productCategory("category").notNull().default("travel"),
    /** Primary display image. */
    imageUrl: text("image_url").notNull(),
    /** Optional extra gallery images. */
    images: text("images").array(),
    /** Physical dimensions in millimetres (A6 = 148 × 105). */
    widthMm: integer("width_mm"),
    heightMm: integer("height_mm"),
    stock: integer("stock").notNull().default(0),
    available: boolean("available").notNull().default(true),
    featured: boolean("featured").notNull().default(false),
    status: productStatus("status").notNull().default("draft"),
    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (t) => [
    uniqueIndex("products_slug_idx").on(t.slug),
    index("products_status_idx").on(t.status),
    index("products_category_idx").on(t.category),
    index("products_featured_idx").on(t.featured),
  ],
);

/** A customer order. Buyer + shipping captured inline (guest checkout). */
export const orders = pgTable(
  "orders",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    /** Human-friendly reference, e.g. "PC-7F3A9C". Generated in the action. */
    orderNumber: text("order_number").notNull(),
    status: orderStatus("status").notNull().default("pending_payment"),

    buyerName: text("buyer_name").notNull(),
    buyerEmail: text("buyer_email").notNull(),

    shippingLine1: text("shipping_line1").notNull(),
    shippingLine2: text("shipping_line2"),
    shippingCity: text("shipping_city").notNull(),
    shippingState: text("shipping_state"),
    shippingPostal: text("shipping_postal").notNull(),
    shippingCountry: text("shipping_country").notNull(),

    subtotalCents: integer("subtotal_cents").notNull(),
    shippingCents: integer("shipping_cents").notNull().default(0),
    totalCents: integer("total_cents").notNull(),
    currency: text("currency").notNull().default("USD"),

    paymentProvider: paymentProvider("payment_provider")
      .notNull()
      .default("manual"),
    paymentReference: text("payment_reference"),
    paymentLink: text("payment_link"),
    paidAt: timestamp("paid_at", { withTimezone: true }),

    notes: text("notes"),
    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (t) => [
    uniqueIndex("orders_order_number_idx").on(t.orderNumber),
    index("orders_status_idx").on(t.status),
    index("orders_buyer_email_idx").on(t.buyerEmail),
    index("orders_created_at_idx").on(t.createdAt),
  ],
);

/**
 * Line items snapshot the product at purchase time, so later product edits
 * (price, title, image) never mutate order history.
 */
export const orderItems = pgTable(
  "order_items",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    orderId: uuid("order_id")
      .notNull()
      .references(() => orders.id, { onDelete: "cascade" }),
    /** Kept for reporting; nulled if the product is later deleted. */
    productId: uuid("product_id").references(() => products.id, {
      onDelete: "set null",
    }),
    titleSnapshot: text("title_snapshot").notNull(),
    slugSnapshot: text("slug_snapshot").notNull(),
    imageUrlSnapshot: text("image_url_snapshot"),
    unitPriceCents: integer("unit_price_cents").notNull(),
    quantity: integer("quantity").notNull().default(1),
    lineTotalCents: integer("line_total_cents").notNull(),
  },
  (t) => [index("order_items_order_idx").on(t.orderId)],
);

/* ------------------------------------------------------------ relations */

export const ordersRelations = relations(orders, ({ many }) => ({
  items: many(orderItems),
}));

export const orderItemsRelations = relations(orderItems, ({ one }) => ({
  order: one(orders, {
    fields: [orderItems.orderId],
    references: [orders.id],
  }),
  product: one(products, {
    fields: [orderItems.productId],
    references: [products.id],
  }),
}));

export const productsRelations = relations(products, ({ many }) => ({
  orderItems: many(orderItems),
}));

/* ---------------------------------------------------------------- types */

export type Product = typeof products.$inferSelect;
export type NewProduct = typeof products.$inferInsert;
export type Order = typeof orders.$inferSelect;
export type NewOrder = typeof orders.$inferInsert;
export type OrderItem = typeof orderItems.$inferSelect;
export type NewOrderItem = typeof orderItems.$inferInsert;

export type ProductCategory = (typeof productCategory.enumValues)[number];
export type ProductStatus = (typeof productStatus.enumValues)[number];
export type OrderStatus = (typeof orderStatus.enumValues)[number];
export type PaymentProviderId = (typeof paymentProvider.enumValues)[number];
