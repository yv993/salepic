import type { Metadata } from "next";
import { PageHeader } from "@/components/page-header";
import { ProductForm } from "@/components/admin/product-form";
import { createProduct } from "@/features/products/actions";

export const metadata: Metadata = { title: "New postcard" };

export default function NewProductPage() {
  return (
    <div className="mx-auto max-w-5xl">
      <PageHeader
        title="New postcard"
        description="Add a new artwork to the studio. Save as a draft, then set it active when it's ready to sell."
      />
      <ProductForm action={createProduct} submitLabel="Create postcard" />
    </div>
  );
}
