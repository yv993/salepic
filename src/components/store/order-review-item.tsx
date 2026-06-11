"use client";

import { Star } from "lucide-react";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ReviewForm } from "./review-form";
import type { ReviewAccess } from "@/features/reviews/access";

/** "Review this postcard" entry on the order confirmation, per purchased item. */
export function OrderReviewItem({
  productId,
  productTitle,
  access,
}: {
  productId: string;
  productTitle: string;
  access: ReviewAccess;
}) {
  return (
    <Dialog>
      <DialogTrigger render={<Button variant="outline" size="sm" />}>
        <Star className="size-4" />
        Review
      </DialogTrigger>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="font-heading">Review {productTitle}</DialogTitle>
          <DialogDescription>
            Share how it arrived and what you thought.
          </DialogDescription>
        </DialogHeader>
        <ReviewForm
          productId={productId}
          productTitle={productTitle}
          access={access}
        />
      </DialogContent>
    </Dialog>
  );
}
