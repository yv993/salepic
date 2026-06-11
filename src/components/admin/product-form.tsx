"use client";

import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import Link from "next/link";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import type { Product } from "@/db/schema";
import { type ActionState } from "@/lib/action-state";
import { CATEGORY_ORDER, CATEGORY_META } from "@/features/products/constants";

type Props = {
  action: (prev: ActionState, formData: FormData) => Promise<ActionState>;
  product?: Product;
  submitLabel: string;
};

const STATUS_OPTIONS = [
  { value: "draft", label: "Draft" },
  { value: "active", label: "Active" },
  { value: "archived", label: "Archived" },
];

export function ProductForm({ action, product, submitLabel }: Props) {
  const [state, formAction] = useActionState<ActionState, FormData>(action, {});
  const p = product;

  return (
    <form action={formAction} className="space-y-8">
      <div className="grid gap-8 lg:grid-cols-[1.6fr_1fr]">
        {/* Main details */}
        <div className="space-y-6">
          <Field
            label="Title"
            name="title"
            required
            defaultValue={p?.title}
            placeholder="Kyoto at Dusk"
            error={state.fieldErrors?.title}
          />
          <Field
            label="Slug"
            name="slug"
            defaultValue={p?.slug}
            placeholder="auto-generated from the title if left blank"
            hint="The URL path, e.g. /postcards/kyoto-at-dusk"
            error={state.fieldErrors?.slug}
          />
          <div className="space-y-1.5">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              name="description"
              rows={5}
              defaultValue={p?.description ?? ""}
              placeholder="A short, evocative description of the artwork…"
            />
            {state.fieldErrors?.description && (
              <p className="text-xs text-destructive">
                {state.fieldErrors.description}
              </p>
            )}
          </div>

          <Field
            label="Primary image URL or path"
            name="imageUrl"
            required
            defaultValue={p?.imageUrl}
            placeholder="/postcards/kyoto-at-dusk.jpg"
            error={state.fieldErrors?.imageUrl}
          />
          <div className="space-y-1.5">
            <Label htmlFor="images">Additional images</Label>
            <Textarea
              id="images"
              name="images"
              rows={3}
              defaultValue={(p?.images ?? []).join("\n")}
              placeholder="One URL or path per line (optional)"
            />
            <p className="text-xs text-muted-foreground">
              Shown in the gallery on the product page, after the primary image.
            </p>
          </div>
        </div>

        {/* Sidebar: pricing, classification, inventory */}
        <div className="space-y-6">
          <div className="surface space-y-5 rounded-2xl p-5">
            <h3 className="font-heading text-sm font-semibold">Pricing</h3>
            <div className="grid grid-cols-2 gap-3">
              <Field
                label="Price"
                name="price"
                type="number"
                step="0.01"
                required
                defaultValue={p ? (p.priceCents / 100).toFixed(2) : ""}
                placeholder="8.50"
                error={state.fieldErrors?.price}
              />
              <Field
                label="Currency"
                name="currency"
                defaultValue={p?.currency ?? "USD"}
                placeholder="USD"
                error={state.fieldErrors?.currency}
              />
            </div>
          </div>

          <div className="surface space-y-5 rounded-2xl p-5">
            <h3 className="font-heading text-sm font-semibold">Classification</h3>
            <SelectField
              label="Category"
              name="category"
              defaultValue={p?.category ?? "travel"}
              options={CATEGORY_ORDER.map((c) => ({
                value: c,
                label: CATEGORY_META[c].label,
              }))}
            />
            <SelectField
              label="Status"
              name="status"
              defaultValue={p?.status ?? "draft"}
              options={STATUS_OPTIONS}
            />
            <div className="space-y-3 pt-1">
              <CheckboxField
                name="available"
                label="Available for sale"
                defaultChecked={p?.available ?? true}
              />
              <CheckboxField
                name="featured"
                label="Feature on the home page"
                defaultChecked={p?.featured ?? false}
              />
            </div>
          </div>

          <div className="surface space-y-5 rounded-2xl p-5">
            <h3 className="font-heading text-sm font-semibold">Inventory &amp; size</h3>
            <Field
              label="Stock"
              name="stock"
              type="number"
              defaultValue={p?.stock ?? 0}
              placeholder="40"
              error={state.fieldErrors?.stock}
            />
            <div className="grid grid-cols-2 gap-3">
              <Field
                label="Width (mm)"
                name="widthMm"
                type="number"
                defaultValue={p?.widthMm ?? 148}
                placeholder="148"
                error={state.fieldErrors?.widthMm}
              />
              <Field
                label="Height (mm)"
                name="heightMm"
                type="number"
                defaultValue={p?.heightMm ?? 105}
                placeholder="105"
                error={state.fieldErrors?.heightMm}
              />
            </div>
          </div>
        </div>
      </div>

      {state.error && !state.fieldErrors && (
        <p className="rounded-lg bg-destructive/10 px-3 py-2 text-sm text-destructive">
          {state.error}
        </p>
      )}

      <div className="flex items-center gap-3 border-t border-border pt-6">
        <SubmitButton label={submitLabel} />
        <Button variant="ghost" render={<Link href="/admin/products" />}>
          Cancel
        </Button>
      </div>
    </form>
  );
}

function SubmitButton({ label }: { label: string }) {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending}>
      {pending && <Loader2 className="size-4 animate-spin" />}
      {label}
    </Button>
  );
}

function Field({
  label,
  name,
  defaultValue,
  error,
  required,
  type = "text",
  placeholder,
  hint,
  step,
}: {
  label: string;
  name: string;
  defaultValue?: string | number | null;
  error?: string;
  required?: boolean;
  type?: string;
  placeholder?: string;
  hint?: string;
  step?: string;
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
        step={step}
        defaultValue={defaultValue ?? ""}
        placeholder={placeholder}
        aria-invalid={Boolean(error)}
      />
      {hint && !error && <p className="text-xs text-muted-foreground">{hint}</p>}
      {error && <p className="text-xs text-destructive">{error}</p>}
    </div>
  );
}

function SelectField({
  label,
  name,
  defaultValue,
  options,
}: {
  label: string;
  name: string;
  defaultValue: string;
  options: { value: string; label: string }[];
}) {
  return (
    <div className="space-y-1.5">
      <Label htmlFor={name}>{label}</Label>
      <Select name={name} defaultValue={defaultValue}>
        <SelectTrigger id={name} className="w-full">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {options.map((o) => (
            <SelectItem key={o.value} value={o.value}>
              {o.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}

function CheckboxField({
  name,
  label,
  defaultChecked,
}: {
  name: string;
  label: string;
  defaultChecked: boolean;
}) {
  return (
    <label className="flex cursor-pointer items-center gap-2.5 text-sm">
      <input
        type="checkbox"
        name={name}
        defaultChecked={defaultChecked}
        className={cn(
          "size-4 rounded border-input text-primary accent-[var(--color-clay)]",
        )}
      />
      {label}
    </label>
  );
}
