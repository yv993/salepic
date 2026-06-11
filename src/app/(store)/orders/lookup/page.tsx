import type { Metadata } from "next";
import { PackageSearch } from "lucide-react";
import { OrderLookupForm } from "@/components/store/order-lookup-form";
import { siteUrl } from "@/lib/env";

export const metadata: Metadata = {
  title: "Track an order",
  description: "Look up your Posted. order by its number and email.",
  alternates: { canonical: `${siteUrl()}/orders/lookup` },
};

export default function OrderLookupPage() {
  return (
    <div className="mx-auto max-w-md px-4 py-16 sm:px-6">
      <div className="text-center">
        <span className="mx-auto grid size-12 place-items-center rounded-full bg-muted text-primary">
          <PackageSearch className="size-6" />
        </span>
        <h1 className="mt-4 font-heading text-3xl font-bold tracking-tight sm:text-4xl">
          Track an order
        </h1>
        <p className="mt-2 text-muted-foreground">
          Enter your order number (from your confirmation, e.g. PC-1A2B3C) and
          the email you used at checkout.
        </p>
      </div>
      <div className="mt-8">
        <OrderLookupForm />
      </div>
    </div>
  );
}
