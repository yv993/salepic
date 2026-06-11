"use client";

import { useState, useTransition } from "react";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { setReviewStatus } from "@/features/reviews/actions";
import type { ReviewStatus } from "@/db/schema";

export function ReviewModeration({
  id,
  status,
}: {
  id: string;
  status: ReviewStatus;
}) {
  const [cur, setCur] = useState<ReviewStatus>(status);
  const [pending, start] = useTransition();

  const set = (s: ReviewStatus) =>
    start(async () => {
      const res = await setReviewStatus(id, s);
      if (res.ok) {
        setCur(s);
        toast.success(s === "published" ? "Review published" : "Review hidden");
      } else {
        toast.error(res.error ?? "Could not update review");
      }
    });

  return (
    <div className="flex justify-end gap-2">
      {cur !== "published" ? (
        <Button size="sm" variant="outline" disabled={pending} onClick={() => set("published")}>
          {pending ? <Loader2 className="size-4 animate-spin" /> : <Eye className="size-4" />}
          Publish
        </Button>
      ) : (
        <Button size="sm" variant="ghost" disabled={pending} onClick={() => set("hidden")}>
          {pending ? <Loader2 className="size-4 animate-spin" /> : <EyeOff className="size-4" />}
          Hide
        </Button>
      )}
    </div>
  );
}
