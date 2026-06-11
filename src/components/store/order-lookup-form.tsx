"use client";

import { useActionState } from "react";
import { Loader2, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { lookupOrder } from "@/features/orders/actions";

export function OrderLookupForm() {
  const [state, action, pending] = useActionState(lookupOrder, {});

  return (
    <form action={action} className="surface space-y-4 rounded-2xl p-6">
      {/* Honeypot — hidden from humans; bots that fill it are dropped. */}
      <div aria-hidden className="sr-only">
        <label htmlFor="company">Company</label>
        <input id="company" name="company" tabIndex={-1} autoComplete="off" />
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="orderNumber">Order number</Label>
        <Input
          id="orderNumber"
          name="orderNumber"
          required
          placeholder="PC-XXXXXX"
          aria-invalid={Boolean(state.fieldErrors?.orderNumber)}
        />
        {state.fieldErrors?.orderNumber && (
          <p className="text-xs text-destructive">{state.fieldErrors.orderNumber}</p>
        )}
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="email">Email used at checkout</Label>
        <Input
          id="email"
          name="email"
          type="email"
          required
          placeholder="you@example.com"
          aria-invalid={Boolean(state.fieldErrors?.email)}
        />
        {state.fieldErrors?.email && (
          <p className="text-xs text-destructive">{state.fieldErrors.email}</p>
        )}
      </div>

      {state.error && !state.fieldErrors && (
        <p className="rounded-lg bg-destructive/10 px-3 py-2 text-sm text-destructive">
          {state.error}
        </p>
      )}

      <Button type="submit" disabled={pending} className="w-full">
        {pending ? <Loader2 className="size-4 animate-spin" /> : <Search className="size-4" />}
        Find my order
      </Button>
    </form>
  );
}
