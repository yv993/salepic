import { orderStatus, type OrderStatus } from "@/db/schema";

export type OrderStatusMeta = {
  value: OrderStatus;
  label: string;
  /** Tailwind classes for a status pill. */
  className: string;
};

export const ORDER_STATUS_META: Record<OrderStatus, OrderStatusMeta> = {
  pending_payment: {
    value: "pending_payment",
    label: "Pending payment",
    className: "bg-warning/15 text-warning ring-1 ring-warning/30",
  },
  paid: {
    value: "paid",
    label: "Paid",
    className: "bg-success/15 text-success ring-1 ring-success/30",
  },
  fulfilled: {
    value: "fulfilled",
    label: "Fulfilled",
    className: "bg-primary/15 text-primary ring-1 ring-primary/30",
  },
  cancelled: {
    value: "cancelled",
    label: "Cancelled",
    className: "bg-muted text-muted-foreground ring-1 ring-border",
  },
  refunded: {
    value: "refunded",
    label: "Refunded",
    className: "bg-destructive/10 text-destructive ring-1 ring-destructive/30",
  },
};

export const ORDER_STATUS_ORDER = orderStatus.enumValues;
