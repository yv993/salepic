"use client";

import { useActionState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { Loader2, Plus } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { saveAddress } from "@/features/account/actions";

export function AddressForm() {
  const [state, action, pending] = useActionState(saveAddress, {});
  const formRef = useRef<HTMLFormElement>(null);
  const router = useRouter();

  useEffect(() => {
    if (state.ok) {
      toast.success("Address saved.");
      formRef.current?.reset();
      router.refresh();
    } else if (state.error && !state.fieldErrors) {
      toast.error(state.error);
    }
  }, [state, router]);

  const err = (k: string) => state.fieldErrors?.[k];

  return (
    <form ref={formRef} action={action} className="surface space-y-4 rounded-2xl p-5">
      <p className="flex items-center gap-2 stamp-label text-primary">
        <Plus className="size-4" /> Add an address
      </p>
      <div className="grid gap-4 sm:grid-cols-2">
        <Field name="name" label="Full name" required error={err("name")} />
        <Field name="label" label="Label (e.g. Home)" />
      </div>
      <Field name="line1" label="Address line 1" required error={err("line1")} />
      <Field name="line2" label="Address line 2" />
      <div className="grid gap-4 sm:grid-cols-2">
        <Field name="city" label="City" required error={err("city")} />
        <Field name="state" label="State / region" />
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <Field name="postal" label="Postcode" required error={err("postal")} />
        <Field name="country" label="Country" required error={err("country")} />
      </div>
      <label className="flex items-center gap-2 text-sm">
        <input type="checkbox" name="isDefault" value="true" className="size-4 accent-[var(--color-clay)]" />
        Make this my default address
      </label>
      <Button type="submit" disabled={pending}>
        {pending && <Loader2 className="size-4 animate-spin" />}
        Save address
      </Button>
    </form>
  );
}

function Field({
  name,
  label,
  required,
  error,
}: {
  name: string;
  label: string;
  required?: boolean;
  error?: string;
}) {
  return (
    <div className="space-y-1.5">
      <Label htmlFor={`addr-${name}`}>{label}</Label>
      <Input id={`addr-${name}`} name={name} required={required} aria-invalid={Boolean(error)} />
      {error && <p className="text-xs text-destructive">{error}</p>}
    </div>
  );
}
