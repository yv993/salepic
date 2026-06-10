import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ExternalLink } from "lucide-react";
import { PageHeader } from "@/components/page-header";
import { Button } from "@/components/ui/button";
import { ProductForm } from "@/components/admin/product-form";
import { DeleteProductButton } from "@/components/admin/delete-product-button";
import { adminGetProduct } from "@/features/products/admin";
import { updateProduct } from "@/features/products/actions";

export const metadata: Metadata = { title: "Edit postcard" };

export default async function EditProductPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const product = await adminGetProduct(id);
  if (!product) notFound();

  // Bind the id so the form's action matches (prev, formData) => state.
  const action = updateProduct.bind(null, product.id);

  return (
    <div className="mx-auto max-w-5xl">
      <PageHeader title="Edit postcard" description={product.title}>
        <div className="flex items-center gap-2">
          {product.status === "active" && (
            <Button
              variant="outline"
              size="sm"
              render={
                <Link href={`/postcards/${product.slug}`} target="_blank" />
              }
            >
              View
              <ExternalLink className="size-4" />
            </Button>
          )}
          <DeleteProductButton id={product.id} title={product.title} />
        </div>
      </PageHeader>
      <ProductForm
        action={action}
        product={product}
        submitLabel="Save changes"
      />
    </div>
  );
}
