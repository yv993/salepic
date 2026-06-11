"use client";

import { useActionState, useEffect, useId, useRef, useState } from "react";
import Link from "next/link";
import { Star, Loader2, CheckCircle2, Lock, PenLine } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { createReview } from "@/features/reviews/actions";
import type { ReviewAccess } from "@/features/reviews/access";

/** Interactive star picker backing a hidden `rating` input. */
function StarInput({ value, onChange }: { value: number; onChange: (n: number) => void }) {
  const [hover, setHover] = useState(0);
  const active = hover || value;
  return (
    <div className="flex items-center gap-1" role="radiogroup" aria-label="Rating">
      {[1, 2, 3, 4, 5].map((n) => (
        <button
          key={n}
          type="button"
          role="radio"
          aria-checked={value === n}
          aria-label={`${n} star${n > 1 ? "s" : ""}`}
          onClick={() => onChange(n)}
          onMouseEnter={() => setHover(n)}
          onMouseLeave={() => setHover(0)}
          className="rounded p-0.5 transition-transform hover:scale-110 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        >
          <Star
            className={cn(
              "size-7",
              n <= active
                ? "fill-primary text-primary"
                : "fill-transparent text-muted-foreground/40",
            )}
          />
        </button>
      ))}
    </div>
  );
}

export function ReviewForm({
  productId,
  productTitle,
  access,
}: {
  productId: string;
  productTitle: string;
  access: ReviewAccess;
}) {
  const [state, formAction, pending] = useActionState(createReview, {});
  const [rating, setRating] = useState(0);
  const formRef = useRef<HTMLFormElement>(null);
  const titleId = useId();

  useEffect(() => {
    if (state.ok) toast.success("Thanks! Your review is published.");
    else if (state.error) toast.error(state.error);
  }, [state]);

  // Signed out → invite to sign in.
  if (access.state === "signed-out") {
    return (
      <div className="surface flex flex-col items-start gap-3 rounded-2xl p-5">
        <p className="flex items-center gap-2 text-sm text-muted-foreground">
          <Lock className="size-4 text-primary" />
          Bought this postcard? Sign in to share your review.
        </p>
        <Button render={<Link href="/sign-in" />}>Sign in to review</Button>
      </div>
    );
  }

  // Signed in but no matching paid order.
  if (access.state === "not-buyer") {
    return (
      <div className="surface flex items-center gap-2 rounded-2xl p-5 text-sm text-muted-foreground">
        <Lock className="size-4 shrink-0 text-primary" />
        Only verified buyers can review this postcard.
      </div>
    );
  }

  // Verified buyer, just submitted.
  if (state.ok) {
    return (
      <div className="surface flex items-center gap-3 rounded-2xl p-5">
        <CheckCircle2 className="size-6 shrink-0 text-success" />
        <div>
          <p className="font-heading font-semibold">Thank you for the review!</p>
          <p className="text-sm text-muted-foreground">
            It&apos;s now published on {productTitle}.
          </p>
        </div>
      </div>
    );
  }

  // Verified buyer → the form.
  return (
    <form
      ref={formRef}
      action={formAction}
      className="surface space-y-4 rounded-2xl p-5"
    >
      <p className="flex items-center gap-2 stamp-label text-primary">
        <PenLine className="size-4" />
        Verified buyer · review {productTitle}
      </p>

      <input type="hidden" name="productId" value={productId} />
      <input type="hidden" name="rating" value={rating} />
      {/* Honeypot — hidden from humans; bots that fill it are dropped. */}
      <div aria-hidden className="sr-only">
        <label htmlFor={`${titleId}-company`}>Company</label>
        <input id={`${titleId}-company`} name="company" tabIndex={-1} autoComplete="off" />
      </div>

      <div className="space-y-1.5">
        <Label>Your rating</Label>
        <StarInput value={rating} onChange={setRating} />
        {state.fieldErrors?.rating && (
          <p className="text-xs text-destructive">{state.fieldErrors.rating}</p>
        )}
      </div>

      <div className="space-y-1.5">
        <Label htmlFor={`${titleId}-title`}>Headline (optional)</Label>
        <Input
          id={`${titleId}-title`}
          name="title"
          placeholder="A line that sums it up"
          maxLength={120}
        />
      </div>

      <div className="space-y-1.5">
        <Label htmlFor={`${titleId}-body`}>Your review</Label>
        <Textarea
          id={`${titleId}-body`}
          name="body"
          rows={4}
          required
          placeholder="What did you love? How did it arrive?"
          aria-invalid={Boolean(state.fieldErrors?.body)}
        />
        {state.fieldErrors?.body && (
          <p className="text-xs text-destructive">{state.fieldErrors.body}</p>
        )}
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-1.5">
          <Label htmlFor={`${titleId}-name`}>Name</Label>
          <Input
            id={`${titleId}-name`}
            name="authorName"
            required
            defaultValue={access.name}
            maxLength={80}
          />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor={`${titleId}-loc`}>Location (optional)</Label>
          <Input
            id={`${titleId}-loc`}
            name="authorLocation"
            placeholder="City"
            defaultValue={access.location}
            maxLength={80}
          />
        </div>
      </div>

      {state.error && !state.fieldErrors && (
        <p className="rounded-lg bg-destructive/10 px-3 py-2 text-sm text-destructive">
          {state.error}
        </p>
      )}

      <Button type="submit" disabled={pending || rating === 0}>
        {pending && <Loader2 className="size-4 animate-spin" />}
        Post review
      </Button>
    </form>
  );
}
