"use client";

import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import { Loader2, Lock } from "lucide-react";
import { RainbowButton } from "@/components/ui/rainbow-button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { type ActionState } from "@/lib/action-state";
import { placeOrder } from "@/features/checkout/actions";
import { COUNTRIES } from "@/features/checkout/constants";

export type CheckoutDefaults = {
  buyerName?: string;
  buyerEmail?: string;
  shippingLine1?: string;
  shippingLine2?: string;
  shippingCity?: string;
  shippingState?: string;
  shippingPostal?: string;
  shippingCountry?: string;
};

export function CheckoutForm({ defaults }: { defaults?: CheckoutDefaults }) {
  const [state, formAction] = useActionState<ActionState, FormData>(
    placeOrder,
    {},
  );
  const d = defaults ?? {};
  const prefilled = Boolean(d.buyerEmail);

  return (
    <form action={formAction} className="space-y-8">
      {prefilled && (
        <p className="rounded-lg bg-primary/10 px-3 py-2 text-sm text-primary">
          Prefilled from your account — edit anything before placing the order.
        </p>
      )}
      {/* Honeypot — hidden from humans; bots that fill it are rejected. */}
      <div aria-hidden className="sr-only">
        <label htmlFor="company">Company</label>
        <input id="company" name="company" tabIndex={-1} autoComplete="off" />
      </div>
      <section className="space-y-5">
        <h2 className="font-heading text-lg font-semibold">Contact</h2>
        <div className="grid gap-5 sm:grid-cols-2">
          <Field
            label="Full name"
            name="buyerName"
            required
            placeholder="Jordan Rivera"
            defaultValue={d.buyerName}
            error={state.fieldErrors?.buyerName}
          />
          <Field
            label="Email"
            name="buyerEmail"
            type="email"
            required
            placeholder="jordan@example.com"
            defaultValue={d.buyerEmail}
            error={state.fieldErrors?.buyerEmail}
          />
        </div>
      </section>

      <section className="space-y-5">
        <h2 className="font-heading text-lg font-semibold">Shipping address</h2>
        <Field
          label="Address line 1"
          name="shippingLine1"
          required
          placeholder="12 Maple Street"
          defaultValue={d.shippingLine1}
          error={state.fieldErrors?.shippingLine1}
        />
        <Field
          label="Address line 2"
          name="shippingLine2"
          placeholder="Apartment, suite, etc. (optional)"
          defaultValue={d.shippingLine2}
          error={state.fieldErrors?.shippingLine2}
        />
        <div className="grid gap-5 sm:grid-cols-2">
          <Field
            label="City"
            name="shippingCity"
            required
            placeholder="Portland"
            defaultValue={d.shippingCity}
            error={state.fieldErrors?.shippingCity}
          />
          <Field
            label="State / Region"
            name="shippingState"
            placeholder="OR"
            defaultValue={d.shippingState}
            error={state.fieldErrors?.shippingState}
          />
        </div>
        <div className="grid gap-5 sm:grid-cols-2">
          <Field
            label="Postal code"
            name="shippingPostal"
            required
            placeholder="97201"
            defaultValue={d.shippingPostal}
            error={state.fieldErrors?.shippingPostal}
          />
          <div className="space-y-1.5">
            <Label htmlFor="shippingCountry">
              Country<span className="text-primary"> *</span>
            </Label>
            <Select name="shippingCountry" defaultValue={d.shippingCountry || "United States"}>
              <SelectTrigger id="shippingCountry" className="w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {COUNTRIES.map((c) => (
                  <SelectItem key={c} value={c}>
                    {c}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {state.fieldErrors?.shippingCountry && (
              <p className="text-xs text-destructive">
                {state.fieldErrors.shippingCountry}
              </p>
            )}
          </div>
        </div>
      </section>

      <section className="space-y-2">
        <Label htmlFor="notes">Order notes</Label>
        <Textarea
          id="notes"
          name="notes"
          rows={3}
          placeholder="Gift message, delivery notes, anything we should know…"
        />
      </section>

      {state.error && !state.fieldErrors && (
        <p className="rounded-lg bg-destructive/10 px-3 py-2 text-sm text-destructive">
          {state.error}
        </p>
      )}

      <SubmitButton />

      <p className="flex items-center justify-center gap-1.5 text-xs text-muted-foreground">
        <Lock className="size-3.5" />
        You&apos;ll receive a secure payment link after placing your order.
      </p>
    </form>
  );
}

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <RainbowButton type="submit" disabled={pending} className="h-12 w-full">
      {pending ? (
        <>
          <Loader2 className="size-4 animate-spin" />
          Placing order…
        </>
      ) : (
        "Place order"
      )}
    </RainbowButton>
  );
}

function Field({
  label,
  name,
  type = "text",
  placeholder,
  required,
  error,
  defaultValue,
}: {
  label: string;
  name: string;
  type?: string;
  placeholder?: string;
  required?: boolean;
  error?: string;
  defaultValue?: string;
}) {
  return (
    <div className="space-y-1.5">
      <Label htmlFor={name}>
        {label}
        {required && <span className="text-primary"> *</span>}
      </Label>
      <Input
        id={name}
        name={name}
        type={type}
        placeholder={placeholder}
        defaultValue={defaultValue}
        aria-invalid={Boolean(error)}
      />
      {error && <p className="text-xs text-destructive">{error}</p>}
    </div>
  );
}
